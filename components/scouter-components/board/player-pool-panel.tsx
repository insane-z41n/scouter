"use client"

import { useMemo, useState } from "react"
import { Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    onSendToRound,
    compareIds,
    onToggleCompare,
    teams,
    onAssignSlot,
    onMarkDrafted,
    onUnmarkDrafted,
}: {
    poolPlayers: ScouterPlayer[]
    draftedPlayers: ScouterPlayer[]
    roundNumbers: number[]
    onSendToRound: (playerId: string, roundNumber: number) => void
    compareIds: Set<string>
    onToggleCompare: (playerId: string) => void
    teams: Team[]
    onAssignSlot: (teamId: string, slotId: string, playerId: string) => void
    onMarkDrafted: (playerId: string) => void
    onUnmarkDrafted: (playerId: string) => void
}) {
    const [view, setView] = useState<"pool" | "drafted">("pool")

    const poolTableData = useMemo(() => mapScouterPlayersToPlayerTableData(poolPlayers), [poolPlayers])
    const draftedTableData = useMemo(() => mapScouterPlayersToPlayerTableData(draftedPlayers), [draftedPlayers])
    const poolPlayersById = useMemo(() => new Map(poolPlayers.map((p) => [p._id, p])), [poolPlayers])

    return (
        <div className="flex h-full flex-col overflow-auto p-2">
            <div className="mb-2 flex items-center justify-between px-2">
                <Tabs value={view} onValueChange={(v) => setView(v as "pool" | "drafted")}>
                    <TabsList>
                        <TabsTrigger value="pool">Player Pool</TabsTrigger>
                        <TabsTrigger value="drafted">Drafted</TabsTrigger>
                    </TabsList>
                </Tabs>
                <span className="text-sm text-muted-foreground">
                    {view === "pool" ? `${poolPlayers.length} available` : `${draftedPlayers.length} drafted`}
                </span>
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
                        <Button variant="outline" size="sm" onClick={() => onUnmarkDrafted(playerId)}>
                            <Undo2 /> Move to Pool
                        </Button>
                    )}
                />
            )}
        </div>
    )
}
