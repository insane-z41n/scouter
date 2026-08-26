"use client"

import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Round } from "@/lib/functions/scouter-service/draft-board"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { RoundColumn } from "./round-column"

export function RoundsTab({
    rounds,
    roundNumbers,
    playersById,
    onMoveToRound,
    onSendToPool,
}: {
    rounds: Round[]
    roundNumbers: number[]
    playersById: Map<string, ScouterPlayer>
    onMoveToRound: (playerId: string, roundNumber: number) => void
    onSendToPool: (playerId: string) => void
}) {
    const sortedRounds = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber)

    return (
        <ScrollArea className="h-full w-full">
            <div className="flex w-full flex-col gap-3 p-3">
                {sortedRounds.map((round) => (
                    <RoundColumn
                        key={round.roundNumber}
                        round={round}
                        roundNumbers={roundNumbers}
                        playersById={playersById}
                        onMoveToRound={onMoveToRound}
                        onSendToPool={onSendToPool}
                    />
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}
