"use server";

import { getScouterPlayers, ScouterPlayer } from "./get-players";

// Thin "use server" wrapper so client components can fetch players through
// TanStack Query. getScouterPlayers itself can't carry "use server" directly
// because get-players.ts also exports the sync helper getLatestYearEntry,
// and every export of a "use server" file must be an async function.
export async function getScouterPlayersAction(sport: string): Promise<ScouterPlayer[]> {
    return getScouterPlayers(sport);
}
