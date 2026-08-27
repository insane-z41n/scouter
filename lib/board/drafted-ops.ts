// A player marked "drafted" was taken in the real live draft (by anyone) and
// is no longer available to plan around - callers are responsible for also
// clearing the player out of any round/team slot they occupied (see
// findPlayerRound/findPlayerTeamSlot in pool.ts), since a drafted player can't
// remain placed anywhere.
export function addDraftedPlayer(draftedPlayerIds: string[], playerId: string): string[] {
    return draftedPlayerIds.includes(playerId) ? draftedPlayerIds : [...draftedPlayerIds, playerId];
}

export function removeDraftedPlayer(draftedPlayerIds: string[], playerId: string): string[] {
    return draftedPlayerIds.filter((id) => id !== playerId);
}
