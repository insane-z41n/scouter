// A player marked "drafted" was taken in the real live draft (by anyone), but
// stays wherever they're currently placed (a round, a team) - "drafted" is
// just a flag layered on top, not a placement of its own.
export function addDraftedPlayer(draftedPlayerIds: string[], playerId: string): string[] {
    return draftedPlayerIds.includes(playerId) ? draftedPlayerIds : [...draftedPlayerIds, playerId];
}

export function removeDraftedPlayer(draftedPlayerIds: string[], playerId: string): string[] {
    return draftedPlayerIds.filter((id) => id !== playerId);
}
