"use server"

import { getScouterPlayers, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

import { PlayerTableData} from "./columns";
import { PlayerTable } from "./player-table";

export default async function PlayerTablePage() {
    const scouterPlayers = await getScouterPlayers('nfl');
    const playerTableData = mapScouterPlayersToPlayerTableData(scouterPlayers);
    return (
        <div>
            <PlayerTable data={playerTableData} year="2025"/>
        </div>
    )
};

function mapScouterPlayersToPlayerTableData(scouterPlayers: ScouterPlayer[]): PlayerTableData[] {

    return scouterPlayers.map((s) : PlayerTableData=> ({
        adp: s.projectedStats.adp,
        name: s.name,
        position: s.position,
        projectedPoints: s.projectedStats.points,
        prevYearPoints: s.prevYearStats.points,
    }));

}