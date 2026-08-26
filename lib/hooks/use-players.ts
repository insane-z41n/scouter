"use client"

import { useQuery } from "@tanstack/react-query";
import { getScouterPlayersAction } from "@/lib/functions/scouter-service/get-players-action";
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

export function usePlayers(sport: string, initialData: ScouterPlayer[]) {
    return useQuery({
        queryKey: ["players", sport],
        queryFn: () => getScouterPlayersAction(sport),
        initialData,
        staleTime: 5 * 60 * 1000,
    });
}
