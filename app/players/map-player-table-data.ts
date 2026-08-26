import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";
import type { PlayerTableData } from "./columns";

export function mapScouterPlayersToPlayerTableData(players: ScouterPlayer[]): PlayerTableData[] {
    if (players.length === 0) return [];

    const latestProjectedYear = getLatestYearEntry(players[0]?.projectedStats);
    const latestPreviousYear = getLatestYearEntry(players[0]?.previousStats);

    return players.map((p): PlayerTableData => {
        const projected = p.projectedStats[latestProjectedYear];
        const previous = p.previousStats[latestPreviousYear];

        return {
            id: p._id,
            adp: projected.adp,
            name: `${p.playerInfo.firstName} ${p.playerInfo.lastName}`,
            position: p.playerInfo.primaryPosition,
            team: p.team,
            projectedPoints: projected.fantasyPointsPPR,
            prevYearPoints: previous.fantasyPointsPPR,
            projectedPassingAttempts: projected.passingAttempts ?? 0,
            projectedPassingYards: projected.passingYards ?? 0,
            projectedPassingYardsPerAttempt: projected.passingYardsPerAttempt ?? 0,
            projectedPassingTouchdowns: projected.passingTouchdowns ?? 0,
            projectedRushingAttempts: projected.rushingAttempts ?? 0,
            projectedRushingYards: projected.rushingYards ?? 0,
            projectedRushingTouchdowns: projected.rushingTouchdowns ?? 0,
            projectedReceptions: projected.receptions ?? 0,
            projectedReceivingYards: projected.receivingYards ?? 0,
            projectedReceivingTouchdowns: projected.receivingTouchdowns ?? 0,
            statsPassingAttempts: previous.passingAttempts ?? 0,
            statsPassingYards: previous.passingYards ?? 0,
            statsPassingYardsPerAttempt: previous.passingYardsPerAttempt ?? 0,
            statsPassingTouchdowns: previous.passingTouchdowns ?? 0,
            statsRushingAttempts: previous.rushingAttempts ?? 0,
            statsRushingYards: previous.rushingYards ?? 0,
            statsRushingTouchdowns: previous.rushingTouchdowns ?? 0,
            statsReceptions: previous.receptions ?? 0,
            statsReceivingTargets: previous.receivingTargets ?? 0,
            statsReceivingYards: previous.receivingYards ?? 0,
            statsReceivingTouchdowns: previous.receivingTouchdowns ?? 0,
            statsReceivingYardsPerReception: previous.receivingYardsPerReception ?? 0,
        };
    });
}
