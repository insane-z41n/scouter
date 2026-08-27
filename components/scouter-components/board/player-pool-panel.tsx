"use client"

import { useMemo } from "react"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { mapScouterPlayersToPlayerTableData } from "@/app/players/map-player-table-data"
import { PlayerTable } from "@/app/players/player-table"
import { RoundSelectMenu } from "./round-select-menu"
import { CompareToggleButton } from "./compare-toggle-button"

export function PlayerPoolPanel({
    poolPlayers,
    roundNumbers,
    onSendToRound,
    compareIds,
    onToggleCompare,
}: {
    poolPlayers: ScouterPlayer[]
    roundNumbers: number[]
    onSendToRound: (playerId: string, roundNumber: number) => void
    compareIds: Set<string>
    onToggleCompare: (playerId: string) => void
}) {
    const tableData = useMemo(() => mapScouterPlayersToPlayerTableData(poolPlayers), [poolPlayers])

    return (
        <div className="flex h-full flex-col overflow-auto p-2">
            <div className="mb-2 px-2 text-sm text-muted-foreground">
                Player Pool ({poolPlayers.length} available)
            </div>
            <PlayerTable
                data={tableData}
                players={poolPlayers}
                renderRowActions={(playerId) => (
                    <div className="flex items-center gap-1">
                        <CompareToggleButton
                            selected={compareIds.has(playerId)}
                            onToggle={() => onToggleCompare(playerId)}
                        />
                        <RoundSelectMenu
                            roundNumbers={roundNumbers}
                            onSelectRound={(roundNumber) => onSendToRound(playerId, roundNumber)}
                        />
                    </div>
                )}
            />
        </div>
    )
}
