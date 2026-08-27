"use client"

import { useState } from "react"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Round } from "@/lib/functions/scouter-service/draft-board"
import { Team } from "@/lib/functions/scouter-service/teams"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RoundColumn } from "./round-column"
import { PositionFilter } from "./position-filter"

export function RoundsTab({
    rounds,
    roundNumbers,
    positions,
    playersById,
    onMoveToRound,
    onSendToPool,
    onResetRound,
    onResetAllRounds,
    compareIds,
    onToggleCompare,
    teams,
    onAssignSlot,
    onMarkDrafted,
}: {
    rounds: Round[]
    roundNumbers: number[]
    positions: string[]
    playersById: Map<string, ScouterPlayer>
    onMoveToRound: (playerId: string, roundNumber: number) => void
    onSendToPool: (playerId: string) => void
    onResetRound: (roundNumber: number) => void
    onResetAllRounds: () => void
    compareIds: Set<string>
    onToggleCompare: (playerId: string) => void
    teams: Team[]
    onAssignSlot: (teamId: string, slotId: string, playerId: string) => void
    onMarkDrafted: (playerId: string) => void
}) {
    const [selectedPositions, setSelectedPositions] = useState<string[]>([])
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const sortedRounds = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber)
    const hasPlacedPlayers = rounds.some((r) => r.players.length > 0)

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-3 py-2">
                <PositionFilter positions={positions} selectedPositions={selectedPositions} onChange={setSelectedPositions} />
                <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <AlertDialogTrigger
                        render={
                            <Button variant="outline" size="sm" disabled={!hasPlacedPlayers}>
                                Reset All Rounds
                            </Button>
                        }
                    />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reset all rounds?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Every player placed in a round will be sent back to the pool. This can&apos;t be undone
                                automatically, though nothing is deleted - you can re-place players from the pool.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    onResetAllRounds()
                                    setResetDialogOpen(false)
                                }}
                            >
                                Reset All Rounds
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <ScrollArea className="h-full w-full flex-1">
                <div className="flex w-full flex-col gap-3 p-3">
                    {sortedRounds.map((round) => (
                        <RoundColumn
                            key={round.roundNumber}
                            round={round}
                            roundNumbers={roundNumbers}
                            playersById={playersById}
                            selectedPositions={selectedPositions}
                            onMoveToRound={onMoveToRound}
                            onSendToPool={onSendToPool}
                            onResetRound={onResetRound}
                            compareIds={compareIds}
                            onToggleCompare={onToggleCompare}
                            teams={teams}
                            onAssignSlot={onAssignSlot}
                            onMarkDrafted={onMarkDrafted}
                        />
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    )
}
