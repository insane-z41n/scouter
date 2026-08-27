"use client"

import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Round } from "@/lib/functions/scouter-service/draft-board"
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
    onMoveToRound,
    onSendToPool,
    onResetRound,
    compareIds,
    onToggleCompare,
}: {
    round: Round
    roundNumbers: number[]
    playersById: Map<string, ScouterPlayer>
    selectedPositions: string[]
    onMoveToRound: (playerId: string, roundNumber: number) => void
    onSendToPool: (playerId: string) => void
    onResetRound: (roundNumber: number) => void
    compareIds: Set<string>
    onToggleCompare: (playerId: string) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id: roundDropzoneId(round.roundNumber) })
    const sortedPlayers = [...round.players].sort((a, b) => a.rank - b.rank)
    const itemIds = sortedPlayers.map((p) => roundPlayerDragId(round.roundNumber, p.playerId))

    return (
        <div className="flex w-full flex-col gap-2 rounded-lg border bg-muted/30 p-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Round {round.roundNumber}</span>
                    <span className="text-xs text-muted-foreground">{round.players.length}</span>
                </div>
                <Button
                    variant="ghost"
                    size="xs"
                    disabled={round.players.length === 0}
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
                                onSendToPool={onSendToPool}
                                compareSelected={compareIds.has(player._id)}
                                onToggleCompare={onToggleCompare}
                            />
                        )
                    })}
                </SortableContext>
            </div>
        </div>
    )
}

export const RoundColumn = memo(RoundColumnComponent)
