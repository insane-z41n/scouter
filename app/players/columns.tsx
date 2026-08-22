"use client"

import * as React from "react"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

import { DataTableFeatures } from "./player-table-features";
import { PlayerNameCell } from "@/components/scouter-components/player-stat-card";

export type PlayerTableData = {
    id: string,
    adp: number,
    name: string,
    position: string,
    team: string,
    projectedPoints: number,
    prevYearPoints: number,
}

export const getPlayerPositions = (players: ScouterPlayer[]): string[] => {
    return Array.from(new Set(players.flatMap((p) => p.playerInfo.primaryPosition))).sort();
};

const columnHelper = createColumnHelper<DataTableFeatures, PlayerTableData>();

export const getColumns = (players: ScouterPlayer[], positions: string[]) => {
    const latestPreviousYear = getLatestYearEntry(players[0]?.previousStats);
    const playersById = new Map(players.map((p) => [p._id, p]));

    return columnHelper.columns([
        columnHelper.accessor("adp", {
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ADP
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        }),
        columnHelper.accessor("name", {
            header: "Player Name",
            cell: ({ row }) => {
                const player = playersById.get(row.original.id);
                if (!player) return null;
                return (<PlayerNameCell player={player} />);
            },
        }),
        columnHelper.accessor("team", {
            header: ({ column }) => {
                return (
                    <div>
                        Team
                    </div>
                );
            },
        }),
        columnHelper.accessor("position", {
            header: ({ column }) => {
                const selectedPositions = (column.getFilterValue() as string[] | undefined) ?? [];
                const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);

                const togglePosition = (position: string, checked: boolean) => {
                    
                    column.setFilterValue((current: string[] | undefined) => {
                        const currentPositions = current ?? [];
                        return checked
                            ? [...currentPositions, position]
                            : currentPositions.filter((p) => p !== position);
                    });
                };


                return (
                    <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="ghost"> 
                                    Position
                                    {
                                        isDropDownOpen ? (
                                            <ChevronUp className="ml-2 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        )
                                    }
                                </Button>
                            }
                        />
                        <DropdownMenuContent side="top">
                            {positions.map((position) => (
                                <DropdownMenuCheckboxItem
                                    key={position}
                                    checked={selectedPositions.includes(position)}
                                    onCheckedChange={(checked) => togglePosition(position, checked)}
                                >
                                    {position}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
            filterFn: "arrHas",
        }),
        columnHelper.accessor("projectedPoints", {
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Projected Points
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        }),
        columnHelper.accessor("prevYearPoints", {
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {latestPreviousYear} PTS
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        }),
        
    ]);
};
