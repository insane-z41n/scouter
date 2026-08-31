"use client"

import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    draftedIds,
    onAssignSlot,
    onMarkDrafted,
    onUnmarkDrafted,
    onResetTeam,
}: {
    boardId: string
    teams: Team[]
    selectedTeamId: string | null
    onSelectTeamId: (teamId: string) => void
    playersById: Map<string, ScouterPlayer>
    draftedIds: Set<string>
    onAssignSlot: (teamId: string, slotId: string, playerId: string | null) => void
    onMarkDrafted: (playerId: string) => void
    onUnmarkDrafted: (playerId: string) => void
    onResetTeam: (teamId: string) => void
}) {
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const selectedTeam = teams.find((t) => t._id === selectedTeamId) ?? teams[0]
    const teamSelectItems = teams.map((team) => ({ value: team._id, label: team.teamName }))
    const bench = selectedTeam ? groupSlotsForFormation(selectedTeam.slots).bench : []
    const hasRosteredPlayers = selectedTeam?.slots.some((s) => s.playerId) ?? false

    return (
        <div className="flex h-full flex-col gap-3 p-3">
            <div className="flex items-center justify-between gap-2">
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
                {selectedTeam && (
                    <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                        <AlertDialogTrigger
                            render={
                                <Button variant="outline" size="sm" disabled={!hasRosteredPlayers}>
                                    Reset Team
                                </Button>
                            }
                        />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset {selectedTeam.teamName}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Every player on this team will be removed from their slot and sent back to
                                    wherever they belong - their assigned round, the Drafted list, or the Player
                                    Pool. This can&apos;t be undone automatically, though nothing is deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        onResetTeam(selectedTeam._id)
                                        setResetDialogOpen(false)
                                    }}
                                >
                                    Reset Team
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
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
                            draftedIds={draftedIds}
                            onAssignSlot={onAssignSlot}
                            onMarkDrafted={onMarkDrafted}
                            onUnmarkDrafted={onUnmarkDrafted}
                        />
                    </div>
                    <TeamBenchSidebar
                        teamId={selectedTeam._id}
                        slots={bench}
                        playersById={playersById}
                        draftedIds={draftedIds}
                        onAssignSlot={onAssignSlot}
                        onMarkDrafted={onMarkDrafted}
                        onUnmarkDrafted={onUnmarkDrafted}
                    />
                </div>
            )}
        </div>
    )
}
