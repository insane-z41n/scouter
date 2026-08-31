import { redirect } from "next/navigation"
import { getDraftBoard } from "@/lib/functions/scouter-service/draft-board"
import { getTeamsForBoard } from "@/lib/functions/scouter-service/teams"
import { getScouterPlayers } from "@/lib/functions/scouter-service/get-players"
import { AuthExpiredError } from "@/lib/auth/errors"
import { BoardView } from "@/components/scouter-components/board/board-view"

export default async function DraftBoardPage({
    params,
}: {
    params: Promise<{ boardId: string }>
}) {
    const { boardId } = await params

    let board, teams, players
    try {
        ;[board, teams, players] = await Promise.all([
            getDraftBoard("nfl", boardId),
            getTeamsForBoard("nfl", boardId),
            getScouterPlayers("nfl"),
        ])
    } catch (error) {
        if (error instanceof AuthExpiredError) {
            redirect("/login")
        }
        throw error
    }

    return <BoardView board={board} initialTeams={teams} initialPlayers={players} />
}
