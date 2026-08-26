"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DraftBoardSummary } from "@/lib/functions/scouter-service/draft-board"
import { useDraftBoards } from "@/lib/hooks/use-draft-boards"
import { CreateDatabaseDialog } from "./create-database-dialog"

export function DatabasesList({ initialData }: { initialData: DraftBoardSummary[] }) {
    const { data: boards } = useDraftBoards(initialData)

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-2xl font-semibold">Your Databases</h1>
                <CreateDatabaseDialog />
            </div>

            {boards.length === 0 ? (
                <p className="text-muted-foreground">
                    No databases yet. Create one to start building teams and round rankings.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {boards.map((board) => (
                        <Link key={board._id} href={`/databases/${board._id}`}>
                            <Card className="transition-colors hover:bg-accent">
                                <CardHeader>
                                    <CardTitle>{board.draftBoardName}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {board.numberOfRounds ?? 0} rounds · {board.teamIds?.length ?? 0} teams
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
