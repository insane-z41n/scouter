"use client"

import { useCallback, useMemo, useState } from "react"
import { useIsMutating, useQueryClient } from "@tanstack/react-query"
import {
    CollisionDetection,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    pointerWithin,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DraftBoard, Round } from "@/lib/functions/scouter-service/draft-board"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Team } from "@/lib/functions/scouter-service/teams"
import { useDraftBoard, useUpdateRound } from "@/lib/hooks/use-draft-boards"
import { useAssignSlotPlayer, useTeamsForBoard } from "@/lib/hooks/use-teams"
import { usePlayers } from "@/lib/hooks/use-players"
import { getPlacedPlayerIds } from "@/lib/board/pool"
import { clearAllRounds, clearRound, getRound, movePlayerToRound, reorderRound } from "@/lib/board/round-ops"
import { getPlayerPositions } from "@/app/players/columns"
import { parseRoundPlayerDragId } from "./round-player-card"
import { parseRoundDropzoneId } from "./round-column"
import { parseTeamSlotDropId } from "./team-slot-card"
import { RoundsTab } from "./rounds-tab"
import { TeamsTab } from "./teams-tab"
import { PlayerPoolPanel } from "./player-pool-panel"

const SPORT = "nfl"

export function BoardView({
    board,
    initialTeams,
    initialPlayers,
}: {
    board: DraftBoard
    initialTeams: Team[]
    initialPlayers: ScouterPlayer[]
}) {
    const queryClient = useQueryClient()
    const { data: boardData } = useDraftBoard(board._id, board)
    const { data: teams } = useTeamsForBoard(board._id, initialTeams)
    const { data: players } = usePlayers(SPORT, initialPlayers)

    const [activeTab, setActiveTab] = useState<"teams" | "rounds">("rounds")
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(initialTeams[0]?._id ?? null)
    const [saveError, setSaveError] = useState<string | null>(null)

    const updateRoundMutation = useUpdateRound(board._id)
    const assignSlotMutation = useAssignSlotPlayer(board._id)

    const pendingSaves = useIsMutating({
        predicate: (m) => {
            const key = m.options.mutationKey?.[0]
            return key === "update-round" || key === "assign-slot"
        },
    })

    const playersById = useMemo(() => new Map(players.map((p) => [p._id, p])), [players])
    const placedIds = useMemo(() => getPlacedPlayerIds(boardData.rounds, teams), [boardData.rounds, teams])
    const poolPlayers = useMemo(() => players.filter((p) => !placedIds.has(p._id)), [players, placedIds])
    const roundNumbers = useMemo(
        () => Array.from({ length: boardData.numberOfRounds }, (_, i) => i + 1),
        [boardData.numberOfRounds]
    )
    const positions = useMemo(() => getPlayerPositions(players), [players])

    const applyRoundsOptimistically = useCallback(
        (nextRounds: Round[]) => {
            queryClient.setQueryData(["draft-board", SPORT, board._id], (old: DraftBoard | undefined) =>
                old ? { ...old, rounds: nextRounds } : old
            )
        },
        [queryClient, board._id]
    )

    // Fires immediately in the background against the already-optimistic UI - no
    // artificial debounce. Each move only touches the round(s) it actually affects,
    // so a failed save only loses that one move, not the whole board.
    const persistChangedRounds = useCallback(
        (nextRounds: Round[], changedRoundNumbers: number[]) => {
            changedRoundNumbers.forEach((roundNumber) => {
                const round = getRound(nextRounds, roundNumber)
                if (!round) return
                updateRoundMutation.mutate(
                    { roundNumber, players: round.players },
                    {
                        onError: () => setSaveError(`Couldn't save Round ${roundNumber} - try the move again`),
                        onSuccess: () => setSaveError(null),
                    }
                )
            })
        },
        [updateRoundMutation]
    )

    const handleMoveToRound = useCallback(
        (playerId: string, toRoundNumber: number | null) => {
            const { rounds: nextRounds, changedRoundNumbers } = movePlayerToRound(
                boardData.rounds,
                playerId,
                toRoundNumber
            )
            applyRoundsOptimistically(nextRounds)
            persistChangedRounds(nextRounds, changedRoundNumbers)
        },
        [boardData.rounds, applyRoundsOptimistically, persistChangedRounds]
    )

    const handleSendToPool = useCallback((playerId: string) => handleMoveToRound(playerId, null), [
        handleMoveToRound,
    ])

    const handleResetRound = useCallback(
        (roundNumber: number) => {
            const nextRounds = clearRound(boardData.rounds, roundNumber)
            applyRoundsOptimistically(nextRounds)
            persistChangedRounds(nextRounds, [roundNumber])
        },
        [boardData.rounds, applyRoundsOptimistically, persistChangedRounds]
    )

    const handleResetAllRounds = useCallback(() => {
        const { rounds: nextRounds, changedRoundNumbers } = clearAllRounds(boardData.rounds)
        applyRoundsOptimistically(nextRounds)
        persistChangedRounds(nextRounds, changedRoundNumbers)
    }, [boardData.rounds, applyRoundsOptimistically, persistChangedRounds])

    const handleAssignSlot = useCallback(
        (teamId: string, slotId: string, playerId: string | null) => {
            queryClient.setQueryData(["teams", SPORT, board._id], (old: Team[] | undefined) =>
                old?.map((team) =>
                    team._id === teamId
                        ? { ...team, slots: team.slots.map((s) => (s.slotId === slotId ? { ...s, playerId } : s)) }
                        : team
                )
            )
            assignSlotMutation.mutate(
                { teamId, slotId, playerId },
                {
                    onError: () => setSaveError("Couldn't save a team slot change - try again"),
                    onSuccess: () => setSaveError(null),
                }
            )
        },
        [queryClient, board._id, assignSlotMutation]
    )

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    // Round columns are now full-width, so the round's own dropzone rect is huge and
    // its center often ends up "closest" to the pointer even when hovering directly
    // over a specific card in the middle of the list - that made mid-list drops
    // resolve to the round container instead of a card, so you could only ever land
    // on the top/bottom edges. Preferring pointer-within collisions against the
    // actual player/slot targets (falling back to the container only when hovering
    // empty space) fixes middle-of-list insertion.
    const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
        const pointerCollisions = pointerWithin(args)
        const itemCollisions = pointerCollisions.filter(
            (collision) =>
                String(collision.id).startsWith("round-player-") || String(collision.id).startsWith("team-slot-")
        )
        if (itemCollisions.length > 0) return itemCollisions
        if (pointerCollisions.length > 0) return pointerCollisions
        return closestCenter(args)
    }, [])

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event
            if (!over) return

            const activeId = String(active.id)
            const overId = String(over.id)
            const activeRoundInfo = parseRoundPlayerDragId(activeId)
            if (!activeRoundInfo) return

            const { roundNumber: fromRound, playerId } = activeRoundInfo

            const overTeamSlot = parseTeamSlotDropId(overId)
            if (overTeamSlot) {
                handleAssignSlot(overTeamSlot.teamId, overTeamSlot.slotId, playerId)
                return
            }

            const overRoundPlayer = parseRoundPlayerDragId(overId)
            const overRoundDropzone = parseRoundDropzoneId(overId)
            const toRound = overRoundPlayer ? overRoundPlayer.roundNumber : overRoundDropzone
            if (toRound === null) return

            if (toRound === fromRound) {
                if (!overRoundPlayer || overRoundPlayer.playerId === playerId) return
                const round = getRound(boardData.rounds, fromRound)
                if (!round) return
                const sorted = [...round.players].sort((a, b) => a.rank - b.rank)
                const oldIndex = sorted.findIndex((p) => p.playerId === playerId)
                const newIndex = sorted.findIndex((p) => p.playerId === overRoundPlayer.playerId)
                if (oldIndex === -1 || newIndex === -1) return
                const reordered = arrayMove(sorted, oldIndex, newIndex)
                const nextRounds = reorderRound(boardData.rounds, fromRound, reordered.map((p) => p.playerId))
                applyRoundsOptimistically(nextRounds)
                persistChangedRounds(nextRounds, [fromRound])
                return
            }

            handleMoveToRound(playerId, toRound)
        },
        [boardData.rounds, applyRoundsOptimistically, persistChangedRounds, handleMoveToRound, handleAssignSlot]
    )

    return (
        <DndContext
            id={`board-${board._id}`}
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragEnd={handleDragEnd}
        >
            <div style={{ height: "100vh" }}>
                <ResizablePanelGroup orientation="vertical" className="h-screen w-full">
                    <ResizablePanel defaultSize={65}>
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between border-b px-4 py-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="font-heading text-lg font-semibold">{boardData.draftBoardName}</h1>
                                    {saveError ? (
                                        <span className="text-xs text-destructive">{saveError}</span>
                                    ) : pendingSaves > 0 ? (
                                        <span className="text-xs text-muted-foreground">Saving…</span>
                                    ) : null}
                                </div>
                                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "teams" | "rounds")}>
                                    <TabsList>
                                        <TabsTrigger value="teams">Teams</TabsTrigger>
                                        <TabsTrigger value="rounds">Rounds</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="min-h-0 flex-1">
                                {activeTab === "teams" ? (
                                    <TeamsTab
                                        boardId={board._id}
                                        teams={teams}
                                        selectedTeamId={selectedTeamId}
                                        onSelectTeamId={setSelectedTeamId}
                                        poolPlayers={poolPlayers}
                                        playersById={playersById}
                                        onAssignSlot={handleAssignSlot}
                                    />
                                ) : (
                                    <RoundsTab
                                        rounds={boardData.rounds}
                                        roundNumbers={roundNumbers}
                                        positions={positions}
                                        playersById={playersById}
                                        onMoveToRound={handleMoveToRound}
                                        onSendToPool={handleSendToPool}
                                        onResetRound={handleResetRound}
                                        onResetAllRounds={handleResetAllRounds}
                                    />
                                )}
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    <ResizablePanel defaultSize={35}>
                        <PlayerPoolPanel
                            poolPlayers={poolPlayers}
                            roundNumbers={roundNumbers}
                            onSendToRound={handleMoveToRound}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </DndContext>
    )
}
