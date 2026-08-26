"use server"

import { getScouterPlayers } from "@/lib/functions/scouter-service/get-players";

import { mapScouterPlayersToPlayerTableData } from "./map-player-table-data";
import { PlayerTable } from "./player-table";


export default async function PlayerTablePage() {
    const scouterPlayers = await getScouterPlayers('nfl');
    const playerTableData = mapScouterPlayersToPlayerTableData(scouterPlayers);
    return (
        <div>
            <PlayerTable data={playerTableData} players={scouterPlayers}/>
        </div>
    )
};