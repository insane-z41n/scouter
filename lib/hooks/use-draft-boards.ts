"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createDraftBoard,
    deleteDraftBoard,
    DraftBoard,
    DraftBoardSummary,
    getDraftBoard,
    getDraftBoards,
    RankedPlayer,
    RosterSlotCount,
    updateDraftBoard,
    updateDraftedPlayers,
    updateRound,
} from "@/lib/functions/scouter-service/draft-board";

const SPORT = "nfl";

export function useDraftBoards(initialData: DraftBoardSummary[]) {
    return useQuery({
        queryKey: ["draft-boards", SPORT],
        queryFn: () => getDraftBoards(SPORT),
        initialData,
    });
}

export function useDraftBoard(boardId: string, initialData: DraftBoard) {
    return useQuery({
        queryKey: ["draft-board", SPORT, boardId],
        queryFn: () => getDraftBoard(SPORT, boardId),
        initialData,
    });
}

export function useCreateDraftBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ draftBoardName, rosterSlots }: { draftBoardName: string; rosterSlots: RosterSlotCount[] }) =>
            createDraftBoard(SPORT, draftBoardName, rosterSlots),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["draft-boards", SPORT] });
        },
    });
}

export function useUpdateDraftBoard(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: { draftBoardName: string }) => updateDraftBoard(SPORT, boardId, updates),
        onSuccess: (board) => {
            queryClient.setQueryData(["draft-board", SPORT, boardId], board);
            queryClient.invalidateQueries({ queryKey: ["draft-boards", SPORT] });
        },
    });
}

export function useDeleteDraftBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (boardId: string) => deleteDraftBoard(SPORT, boardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["draft-boards", SPORT] });
        },
    });
}

// The hot path for round moves: fires immediately in the background against the
// already-optimistic UI. mutationKey lets the board header track in-flight saves
// (see useSaveStatus) and retry gives transient network blips a couple of chances
// before surfacing as a failed save.
//
// A cross-round move fires two of these concurrently (remove from round A, add to
// round B). Each PATCH's response is a full-board snapshot taken after only ITS OWN
// round was written - if we naively replaced the whole cached board with that
// snapshot, whichever response lands last could clobber the sibling round's update
// (since it may not have committed server-side yet when this one was read), making
// the moved player vanish from both. Reconciling only the one round this call was
// for - using the exact players we already applied optimistically - avoids that.
export function useUpdateRound(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-round", SPORT, boardId],
        retry: 2,
        mutationFn: ({ roundNumber, players }: { roundNumber: number; players: RankedPlayer[] }) =>
            updateRound(SPORT, boardId, roundNumber, players),
        onSuccess: (_board, variables) => {
            queryClient.setQueryData(["draft-board", SPORT, boardId], (old: DraftBoard | undefined) =>
                old
                    ? {
                          ...old,
                          rounds: old.rounds.map((r) =>
                              r.roundNumber === variables.roundNumber ? { ...r, players: variables.players } : r
                          ),
                      }
                    : old
            );
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["draft-board", SPORT, boardId] });
        },
    });
}

// Marking/unmarking a player drafted is low-frequency (unlike round drag-and-drop),
// so this just replaces the whole drafted list and reconciles the cache with the
// exact array the caller already applied optimistically.
export function useUpdateDraftedPlayers(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-drafted", SPORT, boardId],
        retry: 2,
        mutationFn: (draftedPlayerIds: string[]) => updateDraftedPlayers(SPORT, boardId, draftedPlayerIds),
        onSuccess: (_board, draftedPlayerIds) => {
            queryClient.setQueryData(["draft-board", SPORT, boardId], (old: DraftBoard | undefined) =>
                old ? { ...old, draftedPlayerIds } : old
            );
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["draft-board", SPORT, boardId] });
        },
    });
}
