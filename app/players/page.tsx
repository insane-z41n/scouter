"use server"

import { getScouterPlayers, getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

import { PlayerTableData} from "./columns";
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

function mapScouterPlayersToPlayerTableData(players: ScouterPlayer[]): PlayerTableData[] {

    const latestProjectedYear = getLatestYearEntry(players[0]?.projectedStats);
    const latestPreviousYear = getLatestYearEntry(players[0]?.previousStats);

    return players.map((p) : PlayerTableData=> ({
        id: p._id,
        adp: p.projectedStats[latestProjectedYear].adp,
        name: `${p.playerInfo.firstName} ${p.playerInfo.lastName}`,
        position: p.playerInfo.primaryPosition,
        team: p.team,
        projectedPoints: p.projectedStats[latestProjectedYear].fantasyPointsPPR,
        prevYearPoints: p.previousStats[latestPreviousYear].fantasyPointsPPR,
    }));
}