import { redirect } from "next/navigation"
import { getDraftBoards } from "@/lib/functions/scouter-service/draft-board"
import { AuthExpiredError } from "@/lib/auth/errors"
import { DraftBoardsList } from "@/components/scouter-components/draft-boards-list"

export default async function DraftBoardsPage() {
    let boards
    try {
        boards = await getDraftBoards("nfl")
    } catch (error) {
        if (error instanceof AuthExpiredError) {
            redirect("/login")
        }
        throw error
    }
    return <DraftBoardsList initialData={boards} />
}
