"use client"

import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { FlagIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { RosterSlot } from "@/lib/functions/scouter-service/teams"
import { getPlayerQuickStats } from "./round-player-card"

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
    onAssignSlot,
    onMarkDrafted,
}: {
    teamId: string
    slot: RosterSlot
    assignedPlayer: ScouterPlayer | undefined
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
    onMarkDrafted: (playerId: string) => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id: teamSlotDropId(teamId, slot.slotId) })

    if (!assignedPlayer) {
        return (
            <div
                ref={setNodeRef}
                className={`flex items-center gap-2 rounded-md border border-dashed p-2 ${isOver ? "bg-accent/50" : "bg-card/50"}`}
            >
                <span className="w-12 shrink-0 text-xs font-semibold text-muted-foreground">{slot.position}</span>
                <span className="flex-1 text-sm text-muted-foreground">Empty</span>
            </div>
        )
    }

    const { projectedPoints, prevYearPoints } = getPlayerQuickStats(assignedPlayer)

    return (
        <div
            ref={setNodeRef}
            className={`flex items-center gap-2 rounded-md border p-2 ${isOver ? "bg-accent/50" : "bg-card"}`}
        >
            <span className="w-12 shrink-0 text-xs font-semibold text-muted-foreground">{slot.position}</span>
            <div className="flex-1 truncate text-sm">
                <span className="font-medium">
                    {assignedPlayer.playerInfo.firstName} {assignedPlayer.playerInfo.lastName}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                    {assignedPlayer.team}
                    {projectedPoints !== null && <> · Proj {projectedPoints.toFixed(1)}</>}
                    {prevYearPoints !== null && <> · Prev {prevYearPoints.toFixed(1)}</>}
                </span>
            </div>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onMarkDrafted(assignedPlayer._id)}
                aria-label="Mark drafted"
                title="Mark drafted"
            >
                <FlagIcon className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onAssignSlot(teamId, slot.slotId, null)}
                aria-label="Clear slot"
            >
                <XIcon className="size-4" />
            </Button>
        </div>
    )
}

export const TeamSlotCard = memo(TeamSlotCardComponent)
