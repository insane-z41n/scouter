import { Round } from "@/lib/functions/scouter-service/draft-board";
import { Team } from "@/lib/functions/scouter-service/teams";

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

export function findPlayerRound(rounds: Round[], playerId: string): Round | undefined {
    return rounds.find((round) => round.players.some((p) => p.playerId === playerId));
}

export function findPlayerTeamSlot(teams: Team[], playerId: string): { teamId: string; slotId: string } | undefined {
    for (const team of teams) {
        const slot = team.slots.find((s) => s.playerId === playerId);
        if (slot) {
            return { teamId: team._id, slotId: slot.slotId };
        }
    }
    return undefined;
}
