"use server";

import { scouterApiRequest } from "./http";

export type RankedPlayer = {
    playerId: string;
    rank: number;
};

export type Round = {
    roundNumber: number;
    players: RankedPlayer[];
};

export type RosterSlotCount = {
    position: string;
    count: number;
};

// List-view shape (no rounds payload - kept light for the draft boards list page)
export type DraftBoardSummary = {
    _id: string;
    draftBoardName: string;
    sport: string;
    userId: string;
    numberOfRounds: number;
    teamIds: string[];
    createdOn: number;
    lastUpdated: number;
};

export type DraftBoard = DraftBoardSummary & {
    rosterSlots: RosterSlotCount[];
    rounds: Round[];
    draftedPlayerIds: string[];
};

export async function createDraftBoard(
    sport: string,
    draftBoardName: string,
    rosterSlots: RosterSlotCount[]
): Promise<DraftBoard> {
    return scouterApiRequest<DraftBoard>("post", `/${sport}/draft-board/create`, {
        draftBoardName,
        rosterSlots,
    });
}

export async function getDraftBoards(sport: string): Promise<DraftBoardSummary[]> {
    return scouterApiRequest<DraftBoardSummary[]>("get", `/${sport}/draft-board`);
}

export async function getDraftBoard(sport: string, draftBoardId: string): Promise<DraftBoard> {
    return scouterApiRequest<DraftBoard>("get", `/${sport}/draft-board/${draftBoardId}`);
}

export async function updateDraftBoard(
    sport: string,
    draftBoardId: string,
    updates: { draftBoardName: string }
): Promise<DraftBoard> {
    return scouterApiRequest<DraftBoard>("patch", `/${sport}/draft-board/${draftBoardId}`, updates);
}

export async function updateRound(
    sport: string,
    draftBoardId: string,
    roundNumber: number,
    players: RankedPlayer[]
): Promise<DraftBoard> {
    return scouterApiRequest<DraftBoard>(
        "patch",
        `/${sport}/draft-board/${draftBoardId}/rounds/${roundNumber}`,
        { players }
    );
}

export async function updateDraftedPlayers(
    sport: string,
    draftBoardId: string,
    draftedPlayerIds: string[]
): Promise<DraftBoard> {
    return scouterApiRequest<DraftBoard>(
        "patch",
        `/${sport}/draft-board/${draftBoardId}/drafted`,
        { draftedPlayerIds }
    );
}

export async function deleteDraftBoard(sport: string, draftBoardId: string): Promise<void> {
    await scouterApiRequest<{ message: string }>("delete", `/${sport}/draft-board/${draftBoardId}`);
}
