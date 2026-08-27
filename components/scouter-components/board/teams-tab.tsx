"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Team } from "@/lib/functions/scouter-service/teams"
import { groupSlotsForFormation } from "@/lib/board/roster-formation"
import { CreateTeamDialog } from "./create-team-dialog"
import { TeamField } from "./team-field"
import { TeamBenchSidebar } from "./team-bench-sidebar"

export function TeamsTab({
    boardId,
    teams,
    selectedTeamId,
    onSelectTeamId,
    playersById,
    onAssignSlot,
    onMarkDrafted,
}: {
    boardId: string
    teams: Team[]
    selectedTeamId: string | null
    onSelectTeamId: (teamId: string) => void
    playersById: Map<string, ScouterPlayer>
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
    onMarkDrafted: (playerId: string) => void
}) {
    const selectedTeam = teams.find((t) => t._id === selectedTeamId) ?? teams[0]
    const teamSelectItems = teams.map((team) => ({ value: team._id, label: team.teamName }))
    const bench = selectedTeam ? groupSlotsForFormation(selectedTeam.slots).bench : []

    return (
        <div className="flex h-full flex-col gap-3 p-3">
            <div className="flex items-center gap-2">
                {teams.length > 0 && (
                    <Select
                        items={teamSelectItems}
                        value={selectedTeam?._id}
                        onValueChange={(value) => value && onSelectTeamId(value)}
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map((team) => (
                                <SelectItem key={team._id} value={team._id}>
                                    {team.teamName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <CreateTeamDialog boardId={boardId} onCreated={onSelectTeamId} />
            </div>

            {!selectedTeam ? (
                <p className="text-sm text-muted-foreground">No teams yet. Create one to start assigning players.</p>
            ) : (
                <div className="flex flex-1 gap-4 overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <TeamField
                            teamId={selectedTeam._id}
                            slots={selectedTeam.slots}
                            playersById={playersById}
                            onAssignSlot={onAssignSlot}
                            onMarkDrafted={onMarkDrafted}
                        />
                    </div>
                    <TeamBenchSidebar
                        teamId={selectedTeam._id}
                        slots={bench}
                        playersById={playersById}
                        onAssignSlot={onAssignSlot}
                        onMarkDrafted={onMarkDrafted}
                    />
                </div>
            )}
        </div>
    )
}
