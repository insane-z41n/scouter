"use client"

import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { RosterSlot } from "@/lib/functions/scouter-service/teams"

export function teamSlotDropId(teamId: string, slotId: string) {
    return `team-slot-${teamId}-${slotId}`
}

export function parseTeamSlotDropId(id: string): { teamId: string; slotId: string } | null {
    const match = /^team-slot-(.+)-([0-9a-f-]{36})$/.exec(id)
    if (!match) return null
    return { teamId: match[1], slotId: match[2] }
}

function TeamSlotCardComponent({
    teamId,
    slot,
    assignedPlayer,
    poolPlayers,
    onAssignSlot,
}: {
    teamId: string
    slot: RosterSlot
    assignedPlayer: ScouterPlayer | undefined
    poolPlayers: ScouterPlayer[]
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id: teamSlotDropId(teamId, slot.slotId) })

    const selectablePlayers = assignedPlayer ? [assignedPlayer, ...poolPlayers] : poolPlayers

    return (
        <div
            ref={setNodeRef}
            className={`flex items-center gap-2 rounded-md border p-2 ${isOver ? "bg-accent/50" : "bg-card"}`}
        >
            <span className="w-12 shrink-0 text-xs font-semibold text-muted-foreground">{slot.position}</span>
            <Select
                value={assignedPlayer?._id ?? ""}
                onValueChange={(value) =>
                    onAssignSlot(teamId, slot.slotId, value === "" ? null : (value as string))
                }
            >
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Empty" />
                </SelectTrigger>
                <SelectContent>
                    {selectablePlayers.map((player) => (
                        <SelectItem key={player._id} value={player._id}>
                            {player.playerInfo.firstName} {player.playerInfo.lastName} · {player.playerInfo.primaryPosition}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {assignedPlayer && (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onAssignSlot(teamId, slot.slotId, null)}
                    aria-label="Clear slot"
                >
                    <XIcon className="size-4" />
                </Button>
            )}
        </div>
    )
}

export const TeamSlotCard = memo(TeamSlotCardComponent)
