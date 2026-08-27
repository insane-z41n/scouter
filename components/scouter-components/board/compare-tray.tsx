"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { CompareDialog } from "./compare-dialog"

export function CompareTray({
    players,
    onToggleCompare,
    onClear,
}: {
    players: ScouterPlayer[]
    onToggleCompare: (playerId: string) => void
    onClear: () => void
}) {
    const [dialogOpen, setDialogOpen] = useState(false)

    if (players.length === 0) return null

    return (
        <>
            <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg">
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                    Compare ({players.length})
                </Button>
                <Button variant="ghost" size="sm" onClick={onClear}>
                    Clear
                </Button>
            </div>
            <CompareDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                players={players}
                onToggleCompare={onToggleCompare}
            />
        </>
    )
}
