"use client"

import { useMemo } from "react"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { mapScouterPlayersToPlayerTableData } from "@/app/players/map-player-table-data"
import { PlayerTable } from "@/app/players/player-table"
import { RoundSelectMenu } from "./round-select-menu"

export function PlayerPoolPanel({
    poolPlayers,
    roundNumbers,
    onSendToRound,
}: {
    poolPlayers: ScouterPlayer[]
    roundNumbers: number[]
    onSendToRound: (playerId: string, roundNumber: number) => void
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
                    <RoundSelectMenu
                        roundNumbers={roundNumbers}
                        onSelectRound={(roundNumber) => onSendToRound(playerId, roundNumber)}
                    />
                )}
            />
        </div>
    )
}
