"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateTeam } from "@/lib/hooks/use-teams"

export function CreateTeamDialog({
    boardId,
    onCreated,
}: {
    boardId: string
    onCreated: (teamId: string) => void
}) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const createTeam = useCreateTeam(boardId)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        const formData = new FormData(event.currentTarget)
        const teamName = formData.get("teamName") as string

        try {
            const team = await createTeam.mutateAsync({ teamName })
            setOpen(false)
            onCreated(team._id)
        } catch {
            setError("Could not create team. Try a different name.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline">+ New Team</Button>} />
            <DialogPopup className="max-w-sm p-6">
                <DialogTitle>Create Team</DialogTitle>
                <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input id="teamName" name="teamName" placeholder="Team Alpha" required />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={createTeam.isPending}>
                        {createTeam.isPending ? "Creating..." : "Create Team"}
                    </Button>
                </form>
            </DialogPopup>
        </Dialog>
    )
}
