"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ROSTER_SLOT_POSITIONS } from "@/lib/constants/nfl"

export type RosterSlotCounts = Record<string, number>

export const defaultRosterSlotCounts = (): RosterSlotCounts =>
    Object.fromEntries(ROSTER_SLOT_POSITIONS.map((position) => [position, position === "FLEX" || position === "K" ? 1 : position === "BENCH" ? 6 : 1]))

export function rosterSlotCountsToTemplate(counts: RosterSlotCounts) {
    return ROSTER_SLOT_POSITIONS.map((position) => ({ position, count: counts[position] ?? 0 })).filter(
        (slot) => slot.count > 0
    )
}

export function RosterSlotCountsInput({
    counts,
    onChange,
}: {
    counts: RosterSlotCounts
    onChange: (counts: RosterSlotCounts) => void
}) {
    const updateCount = (position: string, delta: number) => {
        onChange({ ...counts, [position]: Math.max(0, (counts[position] ?? 0) + delta) })
    }

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0)

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label>Roster Slots (per team)</Label>
                <span className="text-xs text-muted-foreground">{total} rounds</span>
            </div>
            {ROSTER_SLOT_POSITIONS.map((position) => (
                <div key={position} className="flex items-center justify-between">
                    <span className="text-sm">{position}</span>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon-sm" onClick={() => updateCount(position, -1)}>
                            -
                        </Button>
                        <span className="w-4 text-center text-sm">{counts[position] ?? 0}</span>
                        <Button type="button" variant="outline" size="icon-sm" onClick={() => updateCount(position, 1)}>
                            +
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
