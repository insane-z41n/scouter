"use client"

import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { RosterSlot } from "@/lib/functions/scouter-service/teams"
import { groupSlotsForFormation } from "@/lib/board/roster-formation"
import { TeamFieldSlotCard } from "./team-field-slot-card"

const OFFENSIVE_LINE = ["OT", "OG", "C", "OG", "OT"]

export function TeamField({
    teamId,
    slots,
    playersById,
    draftedIds,
    onAssignSlot,
    onMarkDrafted,
    onUnmarkDrafted,
}: {
    teamId: string
    slots: RosterSlot[]
    playersById: Map<string, ScouterPlayer>
    draftedIds: Set<string>
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
    onMarkDrafted: (playerId: string) => void
    onUnmarkDrafted: (playerId: string) => void
}) {
    const formation = groupSlotsForFormation(slots)
    // WR1 lines up with FLEX in the top row; the rest of the WRs drop back to
    // line up (slightly offset in) with TE in the row below, next to each other
    // rather than stacked.
    const [wr1, ...restWr] = formation.wr

    const renderSlot = (slot: RosterSlot) => {
        const assignedPlayer = slot.playerId ? playersById.get(slot.playerId) : undefined
        return (
            <TeamFieldSlotCard
                key={slot.slotId}
                teamId={teamId}
                slot={slot}
                assignedPlayer={assignedPlayer}
                isDrafted={!!assignedPlayer && draftedIds.has(assignedPlayer._id)}
                onAssignSlot={onAssignSlot}
                onMarkDrafted={onMarkDrafted}
                onUnmarkDrafted={onUnmarkDrafted}
            />
        )
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-between gap-1 rounded-lg border bg-gradient-to-b from-green-950/40 to-green-900/20 p-2">
            {/* DEF sits front-and-center, balancing the WR/TE/FLEX spread on either side */}
            <div className="flex justify-center gap-4">{formation.def.map(renderSlot)}</div>

            {/* Top row: WR1 out wide, the O-line, FLEX out wide on the other side */}
            <div className="flex w-full items-center justify-between gap-4">
                <div>{wr1 && renderSlot(wr1)}</div>
                <div className="flex gap-1" aria-hidden="true">
                    {OFFENSIVE_LINE.map((label, index) => (
                        <div
                            key={`${label}-${index}`}
                            className="flex h-10 w-8 items-center justify-center rounded-sm bg-muted text-[0.6rem] font-semibold text-muted-foreground"
                        >
                            {label}
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">{formation.flex.map(renderSlot)}</div>
            </div>

            {/* Bottom row: WR2+ (offset in from the sideline), the backfield, TE */}
            <div className="flex w-full items-center justify-between gap-4">
                <div className="ml-10 flex gap-3">{restWr.map(renderSlot)}</div>
                <div className="flex items-center gap-2">
                    {formation.rbLeft && renderSlot(formation.rbLeft)}
                    {formation.qb.map(renderSlot)}
                    {formation.rbRight && renderSlot(formation.rbRight)}
                </div>
                <div className="flex gap-3">{formation.te.map(renderSlot)}</div>
            </div>

            <div className="flex w-full justify-end">{formation.k.map(renderSlot)}</div>
        </div>
    )
}
