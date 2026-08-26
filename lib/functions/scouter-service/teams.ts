"use server";

import { scouterApiRequest } from "./http";

export type RosterSlot = {
    slotId: string;
    position: string;
    playerId: string | null;
};

export type Team = {
    _id: string;
    teamName: string;
    sport: string;
    userId: string;
    boardId: string;
    slots: RosterSlot[];
    createdOn: number;
    lastUpdated: number;
};

// Teams always inherit their board's roster template, so creation only needs a name.
export async function createTeam(sport: string, boardId: string, teamName: string): Promise<Team> {
    return scouterApiRequest<Team>("post", `/${sport}/draft-board/${boardId}/teams`, {
        teamName,
    });
}

export async function getTeamsForBoard(sport: string, boardId: string): Promise<Team[]> {
    return scouterApiRequest<Team[]>("get", `/${sport}/draft-board/${boardId}/teams`);
}

export async function getTeam(sport: string, teamId: string): Promise<Team> {
    return scouterApiRequest<Team>("get", `/${sport}/teams/${teamId}`);
}

export async function assignSlotPlayer(
    sport: string,
    teamId: string,
    slotId: string,
    playerId: string | null
): Promise<Team> {
    return scouterApiRequest<Team>("patch", `/${sport}/teams/${teamId}/slots/${slotId}`, {
        playerId,
    });
}

export async function deleteTeam(sport: string, teamId: string): Promise<void> {
    await scouterApiRequest<{ message: string }>("delete", `/${sport}/teams/${teamId}`);
}
