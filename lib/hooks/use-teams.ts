"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignSlotPlayer, createTeam, deleteTeam, getTeamsForBoard } from "@/lib/functions/scouter-service/teams";

const SPORT = "nfl";

export function useTeamsForBoard(boardId: string, initialData: Awaited<ReturnType<typeof getTeamsForBoard>>) {
    return useQuery({
        queryKey: ["teams", SPORT, boardId],
        queryFn: () => getTeamsForBoard(SPORT, boardId),
        initialData,
    });
}

export function useCreateTeam(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teamName }: { teamName: string }) => createTeam(SPORT, boardId, teamName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams", SPORT, boardId] });
            queryClient.invalidateQueries({ queryKey: ["draft-board", SPORT, boardId] });
        },
    });
}

// The hot path for slot assignment: fires immediately against the already-optimistic
// UI. See useUpdateRound for why onSuccess reconciles only the one slot this call was
// for (via variables) rather than replacing the whole team with the response body -
// two concurrent slot assignments on the same team would otherwise race the same way
// two concurrent round updates can.
export function useAssignSlotPlayer(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["assign-slot", SPORT, boardId],
        retry: 2,
        mutationFn: ({ teamId, slotId, playerId }: { teamId: string; slotId: string; playerId: string | null }) =>
            assignSlotPlayer(SPORT, teamId, slotId, playerId),
        onSuccess: (_updatedTeam, variables) => {
            queryClient.setQueryData(
                ["teams", SPORT, boardId],
                (teams: Awaited<ReturnType<typeof getTeamsForBoard>> | undefined) =>
                    teams?.map((team) =>
                        team._id === variables.teamId
                            ? {
                                  ...team,
                                  slots: team.slots.map((s) =>
                                      s.slotId === variables.slotId ? { ...s, playerId: variables.playerId } : s
                                  ),
                              }
                            : team
                    )
            );
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["teams", SPORT, boardId] });
        },
    });
}

export function useDeleteTeam(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (teamId: string) => deleteTeam(SPORT, teamId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams", SPORT, boardId] });
            queryClient.invalidateQueries({ queryKey: ["draft-board", SPORT, boardId] });
        },
    });
}
