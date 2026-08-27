"use client"

import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Round } from "@/lib/functions/scouter-service/draft-board"
import { Team } from "@/lib/functions/scouter-service/teams"
import { RoundPlayerCard, roundPlayerDragId } from "./round-player-card"

export function roundDropzoneId(roundNumber: number) {
    return `round-dropzone-${roundNumber}`
}

export function parseRoundDropzoneId(id: string): number | null {
    const match = /^round-dropzone-(\d+)$/.exec(id)
    return match ? Number(match[1]) : null
}

function RoundColumnComponent({
    round,
    roundNumbers,
    playersById,
    selectedPositions,
    draftedIds,
    onMoveToRound,
    onResetRound,
    compareIds,
    onToggleCompare,
    teams,
    onAssignSlot,
    onMarkDrafted,
}: {
    round: Round
    roundNumbers: number[]
    playersById: Map<string, ScouterPlayer>
    selectedPositions: string[]
    draftedIds: Set<string>
    onMoveToRound: (playerId: string, roundNumber: number | null) => void
    onResetRound: (roundNumber: number) => void
    compareIds: Set<string>
    onToggleCompare: (playerId: string) => void
    teams: Team[]
    onAssignSlot: (teamId: string, slotId: string, playerId: string) => void
    onMarkDrafted: (playerId: string) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id: roundDropzoneId(round.roundNumber) })
    // A drafted player keeps their round assignment (so "Reset Drafted"/undraft
    // can put them right back), but is taken - so they no longer show as an
    // active pick in the round itself.
    const activePlayers = round.players.filter((p) => !draftedIds.has(p.playerId))
    const sortedPlayers = [...activePlayers].sort((a, b) => a.rank - b.rank)
    const itemIds = sortedPlayers.map((p) => roundPlayerDragId(round.roundNumber, p.playerId))

    return (
        <div className="flex w-full flex-col gap-2 rounded-lg border bg-muted/30 p-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Round {round.roundNumber}</span>
                    <span className="text-xs text-muted-foreground">{activePlayers.length}</span>
                </div>
                <Button
                    variant="ghost"
                    size="xs"
                    disabled={activePlayers.length === 0}
                    onClick={() => onResetRound(round.roundNumber)}
                >
                    Reset
                </Button>
            </div>
            <div
                ref={setNodeRef}
                className={`flex min-h-20 flex-1 flex-col gap-2 rounded-md p-1 ${isOver ? "bg-accent/50" : ""}`}
            >
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                    {sortedPlayers.map((rankedPlayer) => {
                        const player = playersById.get(rankedPlayer.playerId)
                        if (!player) return null
                        if (
                            selectedPositions.length > 0 &&
                            !selectedPositions.includes(player.playerInfo.primaryPosition)
                        ) {
                            return null
                        }
                        return (
                            <RoundPlayerCard
                                key={rankedPlayer.playerId}
                                player={player}
                                roundNumber={round.roundNumber}
                                roundNumbers={roundNumbers}
                                onMoveToRound={onMoveToRound}
                                compareSelected={compareIds.has(player._id)}
                                onToggleCompare={onToggleCompare}
                                teams={teams}
                                onAssignSlot={onAssignSlot}
                                onMarkDrafted={onMarkDrafted}
                            />
                        )
                    })}
                </SortableContext>
            </div>
        </div>
    )
}

export const RoundColumn = memo(RoundColumnComponent)
