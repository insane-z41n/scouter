"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ROSTER_SLOT_POSITIONS } from "@/lib/constants/nfl"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Team } from "@/lib/functions/scouter-service/teams"
import { CreateTeamDialog } from "./create-team-dialog"
import { TeamSlotCard } from "./team-slot-card"

export function TeamsTab({
    boardId,
    teams,
    selectedTeamId,
    onSelectTeamId,
    poolPlayers,
    playersById,
    onAssignSlot,
}: {
    boardId: string
    teams: Team[]
    selectedTeamId: string | null
    onSelectTeamId: (teamId: string) => void
    poolPlayers: ScouterPlayer[]
    playersById: Map<string, ScouterPlayer>
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
}) {
    const selectedTeam = teams.find((t) => t._id === selectedTeamId) ?? teams[0]

    const orderedSlots = selectedTeam
        ? [...selectedTeam.slots].sort(
              (a, b) => ROSTER_SLOT_POSITIONS.indexOf(a.position as never) - ROSTER_SLOT_POSITIONS.indexOf(b.position as never)
          )
        : []

    return (
        <div className="flex h-full flex-col gap-3 p-3">
            <div className="flex items-center gap-2">
                {teams.length > 0 && (
                    <Select
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
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-2 pr-3">
                        {orderedSlots.map((slot) => (
                            <TeamSlotCard
                                key={slot.slotId}
                                teamId={selectedTeam._id}
                                slot={slot}
                                assignedPlayer={slot.playerId ? playersById.get(slot.playerId) : undefined}
                                poolPlayers={poolPlayers}
                                onAssignSlot={onAssignSlot}
                            />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}
