import { getDraftBoards } from "@/lib/functions/scouter-service/draft-board"
import { DraftBoardsList } from "@/components/scouter-components/draft-boards-list"

export default async function DraftBoardsPage() {
    const boards = await getDraftBoards("nfl")
    return <DraftBoardsList initialData={boards} />
}
