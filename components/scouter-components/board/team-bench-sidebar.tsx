"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { RosterSlot } from "@/lib/functions/scouter-service/teams"
import { TeamSlotCard } from "./team-slot-card"

export function TeamBenchSidebar({
    teamId,
    slots,
    playersById,
    draftedIds,
    onAssignSlot,
    onMarkDrafted,
}: {
    teamId: string
    slots: RosterSlot[]
    playersById: Map<string, ScouterPlayer>
    draftedIds: Set<string>
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
    onMarkDrafted: (playerId: string) => void
}) {
    return (
        <div className="flex h-full w-64 shrink-0 flex-col gap-2 overflow-hidden">
            <span className="px-1 text-sm font-medium text-muted-foreground">Bench</span>
            <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-2 pr-3">
                    {slots.map((slot) => {
                        const assignedPlayer = slot.playerId ? playersById.get(slot.playerId) : undefined
                        return (
                            <TeamSlotCard
                                key={slot.slotId}
                                teamId={teamId}
                                slot={slot}
                                assignedPlayer={assignedPlayer}
                                isDrafted={!!assignedPlayer && draftedIds.has(assignedPlayer._id)}
                                onAssignSlot={onAssignSlot}
                                onMarkDrafted={onMarkDrafted}
                            />
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
