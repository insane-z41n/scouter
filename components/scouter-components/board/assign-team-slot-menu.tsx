"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Team } from "@/lib/functions/scouter-service/teams"
import { findBestOpenSlot } from "@/lib/board/roster-formation"

export function AssignTeamSlotMenu({
    teams,
    playerId,
    playerPosition,
    onAssignSlot,
}: {
    teams: Team[]
    playerId: string
    playerPosition: string
    onAssignSlot: (teamId: string, slotId: string, playerId: string) => void
}) {
    // No manual slot picking - a player always lands on their own position (then
    // FLEX if eligible, then the bench) on whichever team is chosen.
    const assignments = teams.flatMap((team) => {
        const slot = findBestOpenSlot(team.slots, playerPosition)
        return slot ? [{ team, slot }] : []
    })

    if (assignments.length === 0) {
        return (
            <Button variant="outline" size="sm" disabled>
                Add to Team
            </Button>
        )
    }

    if (assignments.length === 1) {
        const { team, slot } = assignments[0]
        return (
            <Button variant="outline" size="sm" onClick={() => onAssignSlot(team._id, slot.slotId, playerId)}>
                Add to Team
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm">Add to Team</Button>} />
            <DropdownMenuContent align="end">
                {assignments.map(({ team, slot }) => (
                    <DropdownMenuItem key={team._id} onClick={() => onAssignSlot(team._id, slot.slotId, playerId)}>
                        {team.teamName}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
