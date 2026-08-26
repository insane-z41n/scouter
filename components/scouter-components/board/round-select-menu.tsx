"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function RoundSelectMenu({
    roundNumbers,
    currentRoundNumber,
    onSelectRound,
    onSendToPool,
    triggerLabel = "Send to Round",
}: {
    roundNumbers: number[]
    currentRoundNumber?: number
    onSelectRound: (roundNumber: number) => void
    onSendToPool?: () => void
    triggerLabel?: string
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="sm">
                        {triggerLabel}
                    </Button>
                }
            />
            <DropdownMenuContent align="end">
                {roundNumbers.map((roundNumber) => (
                    <DropdownMenuItem
                        key={roundNumber}
                        disabled={roundNumber === currentRoundNumber}
                        onClick={() => onSelectRound(roundNumber)}
                    >
                        Round {roundNumber}
                    </DropdownMenuItem>
                ))}
                {onSendToPool && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onSendToPool}>Send to Pool</DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
