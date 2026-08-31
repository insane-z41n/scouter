"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2Icon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DraftBoardSummary } from "@/lib/functions/scouter-service/draft-board"
import { useDeleteDraftBoard, useDraftBoards } from "@/lib/hooks/use-draft-boards"
import { CreateDraftBoardDialog } from "./create-draft-board-dialog"
import { SignOutButton } from "./sign-out-button"

function DeleteDraftBoardAction({ boardId, boardName }: { boardId: string; boardName: string }) {
    const deleteDraftBoard = useDeleteDraftBoard()
    const [error, setError] = useState<string | null>(null)

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute top-3 right-3 z-10 text-muted-foreground hover:text-destructive"
                        onClick={(event) => event.stopPropagation()}
                    />
                }
            >
                <Trash2Icon />
                <span className="sr-only">Delete draft board</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete &ldquo;{boardName}&rdquo;?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes the draft board and every team on it. This can&apos;t be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deleteDraftBoard.isPending}
                        onClick={() => {
                            setError(null)
                            deleteDraftBoard.mutate(boardId, {
                                onError: () => setError("Could not delete draft board. Try again."),
                            })
                        }}
                    >
                        {deleteDraftBoard.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function DraftBoardsList({ initialData }: { initialData: DraftBoardSummary[] }) {
    const { data: boards } = useDraftBoards(initialData)

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-2xl font-semibold">Your Draft Boards</h1>
                <div className="flex items-center gap-2">
                    <CreateDraftBoardDialog />
                    <SignOutButton />
                </div>
            </div>

            {boards.length === 0 ? (
                <p className="text-muted-foreground">
                    No draft boards yet. Create one to start building teams and round rankings.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {boards.map((board) => (
                        <Card key={board._id} className="relative transition-colors hover:bg-accent">
                            <DeleteDraftBoardAction boardId={board._id} boardName={board.draftBoardName} />
                            <Link href={`/draft-boards/${board._id}`}>
                                <CardHeader>
                                    <CardTitle>{board.draftBoardName}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {board.numberOfRounds ?? 0} rounds · {board.teamIds?.length ?? 0} teams
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
