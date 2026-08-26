import { getDraftBoard } from "@/lib/functions/scouter-service/draft-board"
import { getTeamsForBoard } from "@/lib/functions/scouter-service/teams"
import { getScouterPlayers } from "@/lib/functions/scouter-service/get-players"
import { BoardView } from "@/components/scouter-components/board/board-view"

export default async function DatabasePage({
    params,
}: {
    params: Promise<{ boardId: string }>
}) {
    const { boardId } = await params
    const [board, teams, players] = await Promise.all([
        getDraftBoard("nfl", boardId),
        getTeamsForBoard("nfl", boardId),
        getScouterPlayers("nfl"),
    ])

    return <BoardView board={board} initialTeams={teams} initialPlayers={players} />
}
