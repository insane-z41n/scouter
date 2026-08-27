"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateDraftBoard } from "@/lib/hooks/use-draft-boards"
import {
    defaultRosterSlotCounts,
    rosterSlotCountsToTemplate,
    RosterSlotCounts,
    RosterSlotCountsInput,
} from "@/components/scouter-components/board/roster-slot-counts"

export function CreateDraftBoardDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [counts, setCounts] = useState<RosterSlotCounts>(defaultRosterSlotCounts)
    const createDraftBoard = useCreateDraftBoard()

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        const formData = new FormData(event.currentTarget)
        const draftBoardName = formData.get("name") as string
        const rosterSlots = rosterSlotCountsToTemplate(counts)

        if (rosterSlots.length === 0) {
            setError("Add at least one roster slot.")
            return
        }

        try {
            const board = await createDraftBoard.mutateAsync({ draftBoardName, rosterSlots })
            setOpen(false)
            router.push(`/draft-boards/${board._id}`)
        } catch {
            setError("Could not create draft board. Try a different name.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>Create Draft Board</Button>} />
            <DialogPopup className="max-w-sm p-6">
                <DialogTitle>Create Draft Board</DialogTitle>
                <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="2026 Season" required />
                    </div>
                    <RosterSlotCountsInput counts={counts} onChange={setCounts} />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={createDraftBoard.isPending}>
                        {createDraftBoard.isPending ? "Creating..." : "Create"}
                    </Button>
                </form>
            </DialogPopup>
        </Dialog>
    )
}
