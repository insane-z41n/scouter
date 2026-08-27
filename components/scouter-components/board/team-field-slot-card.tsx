"use client"

import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { FlagIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { RosterSlot } from "@/lib/functions/scouter-service/teams"
import { teamSlotDropId } from "./team-slot-card"
import { getPlayerQuickStats } from "./round-player-card"

function TeamFieldSlotCardComponent({
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
                className={`flex w-28 flex-col items-center gap-1 rounded-md border border-dashed p-1.5 text-center ${
                    isOver ? "bg-accent/50" : "bg-card/50"
                }`}
            >
                <span className="text-[0.65rem] font-semibold text-muted-foreground">{slot.position}</span>
                <span className="text-xs text-muted-foreground">Empty</span>
            </div>
        )
    }

    const { projectedPoints, prevYearPoints } = getPlayerQuickStats(assignedPlayer)

    return (
        <div
            ref={setNodeRef}
            className={`flex w-28 flex-col items-center gap-1 rounded-md border p-1.5 text-center ${
                isOver ? "bg-accent/50" : "bg-card"
            }`}
        >
            <span className="text-[0.65rem] font-semibold text-muted-foreground">{slot.position}</span>
            <span className="w-full truncate text-xs font-medium">
                {assignedPlayer.playerInfo.firstName} {assignedPlayer.playerInfo.lastName}
            </span>
            <span className="w-full truncate text-[0.6rem] text-muted-foreground">
                {assignedPlayer.team}
                {projectedPoints !== null && <> · Proj {projectedPoints.toFixed(1)}</>}
                {prevYearPoints !== null && <> · Prev {prevYearPoints.toFixed(1)}</>}
            </span>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onAssignSlot(teamId, slot.slotId, null)}
                    aria-label="Clear slot"
                >
                    <XIcon />
                </Button>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onMarkDrafted(assignedPlayer._id)}
                    aria-label="Mark drafted"
                    title="Mark drafted"
                >
                    <FlagIcon />
                </Button>
            </div>
        </div>
    )
}

export const TeamFieldSlotCard = memo(TeamFieldSlotCardComponent)
