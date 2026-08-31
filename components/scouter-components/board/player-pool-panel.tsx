"use client"

import { useMemo, useState } from "react"
import { Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { mapScouterPlayersToPlayerTableData } from "@/app/players/map-player-table-data"
import { PlayerTable } from "@/app/players/player-table"
import { RoundSelectMenu } from "./round-select-menu"
import { CompareToggleButton } from "./compare-toggle-button"
import { AssignTeamSlotMenu } from "./assign-team-slot-menu"
import { MarkDraftedButton } from "./mark-drafted-button"

export function PlayerPoolPanel({
    poolPlayers,
    draftedPlayers,
    roundNumbers,
    playerRoundNumbers,
    onSendToRound,
    compareIds,
    onToggleCompare,
    teams,
    onAssignSlot,
    onMarkDrafted,
    onUnmarkDrafted,
    onResetDrafted,
}: {
    poolPlayers: ScouterPlayer[]
    draftedPlayers: ScouterPlayer[]
    roundNumbers: number[]
    playerRoundNumbers: Map<string, number>
    onSendToRound: (playerId: string, roundNumber: number | null) => void
    compareIds: Set<string>
    onToggleCompare: (playerId: string) => void
    teams: Team[]
    onAssignSlot: (teamId: string, slotId: string, playerId: string) => void
    onMarkDrafted: (playerId: string) => void
    onUnmarkDrafted: (playerId: string) => void
    onResetDrafted: () => void
}) {
    const [view, setView] = useState<"pool" | "drafted">("pool")
    const [resetDialogOpen, setResetDialogOpen] = useState(false)

    const poolTableData = useMemo(() => mapScouterPlayersToPlayerTableData(poolPlayers), [poolPlayers])
    const draftedTableData = useMemo(() => mapScouterPlayersToPlayerTableData(draftedPlayers), [draftedPlayers])
    const poolPlayersById = useMemo(() => new Map(poolPlayers.map((p) => [p._id, p])), [poolPlayers])
    const draftedPlayersById = useMemo(() => new Map(draftedPlayers.map((p) => [p._id, p])), [draftedPlayers])

    return (
        // pb-16 reserves room below the pagination row so the fixed CompareTray
        // (bottom-4 right-4, shown once players are selected to compare) doesn't
        // sit on top of the Previous/Next buttons.
        <div className="flex h-full flex-col overflow-auto p-2 pb-16">
            <div className="mb-2 flex items-center justify-between px-2">
                <Tabs value={view} onValueChange={(v) => setView(v as "pool" | "drafted")}>
                    <TabsList>
                        <TabsTrigger value="pool">Player Pool</TabsTrigger>
                        <TabsTrigger value="drafted">Drafted</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                        {view === "pool" ? `${poolPlayers.length} available` : `${draftedPlayers.length} drafted`}
                    </span>
                    {view === "drafted" && (
                        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                            <AlertDialogTrigger
                                render={
                                    <Button variant="outline" size="sm" disabled={draftedPlayers.length === 0}>
                                        Reset Drafted
                                    </Button>
                                }
                            />
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reset all drafted players?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Every drafted player is undrafted. Since their round assignment was never
                                        touched, each one simply reappears wherever they already were - their round,
                                        or the Player Pool.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            onResetDrafted()
                                            setResetDialogOpen(false)
                                        }}
                                    >
                                        Reset Drafted
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
            {view === "pool" ? (
                <PlayerTable
                    data={poolTableData}
                    players={poolPlayers}
                    renderRowActions={(playerId) => (
                        <div className="flex items-center gap-1">
                            <CompareToggleButton
                                selected={compareIds.has(playerId)}
                                onToggle={() => onToggleCompare(playerId)}
                            />
                            <AssignTeamSlotMenu
                                teams={teams}
                                playerId={playerId}
                                playerPosition={poolPlayersById.get(playerId)?.playerInfo.primaryPosition ?? ""}
                                onAssignSlot={onAssignSlot}
                            />
                            <RoundSelectMenu
                                roundNumbers={roundNumbers}
                                currentRoundNumber={playerRoundNumbers.get(playerId)}
                                onSelectRound={(roundNumber) => onSendToRound(playerId, roundNumber)}
                            />
                            <MarkDraftedButton onMarkDrafted={() => onMarkDrafted(playerId)} />
                        </div>
                    )}
                />
            ) : (
                <PlayerTable
                    data={draftedTableData}
                    players={draftedPlayers}
                    renderRowActions={(playerId) => (
                        <div className="flex items-center gap-1">
                            <CompareToggleButton
                                selected={compareIds.has(playerId)}
                                onToggle={() => onToggleCompare(playerId)}
                            />
                            <AssignTeamSlotMenu
                                teams={teams}
                                playerId={playerId}
                                playerPosition={draftedPlayersById.get(playerId)?.playerInfo.primaryPosition ?? ""}
                                onAssignSlot={onAssignSlot}
                            />
                            <RoundSelectMenu
                                roundNumbers={roundNumbers}
                                currentRoundNumber={playerRoundNumbers.get(playerId)}
                                onSelectRound={(roundNumber) => onSendToRound(playerId, roundNumber)}
                            />
                            <Button variant="outline" size="sm" onClick={() => onUnmarkDrafted(playerId)}>
                                <Undo2 /> Undraft
                            </Button>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
