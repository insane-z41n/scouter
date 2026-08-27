"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// The trigger always shows the player's current status - "Player Pool" or
// "Round N" - rather than a generic action label, so this one control doubles
// as both the mover and the status indicator everywhere a player shows up.
export function RoundSelectMenu({
    roundNumbers,
    currentRoundNumber,
    onSelectRound,
}: {
    roundNumbers: number[]
    currentRoundNumber?: number
    onSelectRound: (roundNumber: number | null) => void
}) {
    const triggerLabel = currentRoundNumber !== undefined ? `Round ${currentRoundNumber}` : "Player Pool"

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
                <DropdownMenuItem disabled={currentRoundNumber === undefined} onClick={() => onSelectRound(null)}>
                    Player Pool
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {roundNumbers.map((roundNumber) => (
                    <DropdownMenuItem
                        key={roundNumber}
                        disabled={roundNumber === currentRoundNumber}
                        onClick={() => onSelectRound(roundNumber)}
                    >
                        Round {roundNumber}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
