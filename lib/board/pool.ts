import { Round } from "@/lib/functions/scouter-service/draft-board";
import { Team } from "@/lib/functions/scouter-service/teams";
import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

// A player counts as "placed" (out of the pool) once they're in any round or
// any team's slots on this board - either placement removes them from the pool.
export function getPlacedPlayerIds(rounds: Round[], teams: Team[]): Set<string> {
    const placed = new Set<string>();
    for (const round of rounds) {
        for (const player of round.players) {
            placed.add(player.playerId);
        }
    }
    for (const team of teams) {
        for (const slot of team.slots) {
            if (slot.playerId) {
                placed.add(slot.playerId);
            }
        }
    }
    return placed;
}

// Lower ADP means an earlier average draft position (a more valuable player),
// so ascending ADP order is "best player first". Players with no projected
// stats at all sort last rather than erroring, since ADP can't be known for
// them.
function getPlayerAdp(player: ScouterPlayer): number {
    if (Object.keys(player.projectedStats).length === 0) return Infinity;
    const latestYear = getLatestYearEntry(player.projectedStats);
    return player.projectedStats[latestYear]?.adp ?? Infinity;
}

export function sortPlayersByAdp(players: ScouterPlayer[]): ScouterPlayer[] {
    return [...players].sort((a, b) => getPlayerAdp(a) - getPlayerAdp(b));
}
