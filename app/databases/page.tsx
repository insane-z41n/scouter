import { getDraftBoards } from "@/lib/functions/scouter-service/draft-board"
import { DatabasesList } from "@/components/scouter-components/databases-list"

export default async function DatabasesPage() {
    const boards = await getDraftBoards("nfl")
    return <DatabasesList initialData={boards} />
}
