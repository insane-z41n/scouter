import { RankedPlayer, Round } from "@/lib/functions/scouter-service/draft-board";

// Removes a player from every round (a player belongs to at most one round)
// and, unless toRoundNumber is null (send back to pool), appends them to the
// destination round at the end. Returns the set of rounds whose player list
// actually changed, keyed by roundNumber, so callers only need to persist those.
export function movePlayerToRound(
    rounds: Round[],
    playerId: string,
    toRoundNumber: number | null
): { rounds: Round[]; changedRoundNumbers: number[] } {
    const changed = new Set<number>();

    const withoutPlayer = rounds.map((round) => {
        if (!round.players.some((p) => p.playerId === playerId)) {
            return round;
        }
        changed.add(round.roundNumber);
        return {
            ...round,
            players: round.players.filter((p) => p.playerId !== playerId),
        };
    });

    if (toRoundNumber === null) {
        return { rounds: withoutPlayer, changedRoundNumbers: Array.from(changed) };
    }

    const nextRounds = withoutPlayer.map((round) => {
        if (round.roundNumber !== toRoundNumber) {
            return round;
        }
        changed.add(round.roundNumber);
        const nextRank = round.players.length > 0 ? Math.max(...round.players.map((p) => p.rank)) + 1 : 0;
        const newPlayer: RankedPlayer = { playerId, rank: nextRank };
        return { ...round, players: [...round.players, newPlayer] };
    });

    return { rounds: nextRounds, changedRoundNumbers: Array.from(changed) };
}

// Reorders players within a single round (drag-to-reorder), reassigning rank
// sequentially to match the new order.
export function reorderRound(rounds: Round[], roundNumber: number, orderedPlayerIds: string[]): Round[] {
    return rounds.map((round) => {
        if (round.roundNumber !== roundNumber) {
            return round;
        }
        const byId = new Map(round.players.map((p) => [p.playerId, p]));
        const reordered = orderedPlayerIds
            .map((id, index) => {
                const existing = byId.get(id);
                return existing ? { ...existing, rank: index } : null;
            })
            .filter((p): p is RankedPlayer => p !== null);
        return { ...round, players: reordered };
    });
}

export function getRound(rounds: Round[], roundNumber: number): Round | undefined {
    return rounds.find((round) => round.roundNumber === roundNumber);
}

// Empties one round, sending its players back to the pool (they're just no longer
// placed anywhere - nothing is deleted).
export function clearRound(rounds: Round[], roundNumber: number): Round[] {
    return rounds.map((round) => (round.roundNumber === roundNumber ? { ...round, players: [] } : round));
}

// Empties every round that currently has players, returning both the resulting
// rounds and which round numbers actually changed (so callers only persist those).
export function clearAllRounds(rounds: Round[]): { rounds: Round[]; changedRoundNumbers: number[] } {
    const changedRoundNumbers = rounds.filter((r) => r.players.length > 0).map((r) => r.roundNumber);
    const nextRounds = rounds.map((round) => (round.players.length > 0 ? { ...round, players: [] } : round));
    return { rounds: nextRounds, changedRoundNumbers };
}
