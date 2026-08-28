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
    projectedGamesPlayed: number,
    statsGamesPlayed: number,
    projectedPassingAttempts: number,
    projectedPassingYards: number,
    projectedPassingYardsPerAttempt: number,
    projectedPassingTouchdowns: number,
    projectedRushingAttempts: number,
    projectedRushingYards: number,
    projectedRushingTouchdowns: number,
    projectedReceptions: number,
    projectedReceivingYards: number,
    projectedReceivingTouchdowns: number,
    statsPassingAttempts: number,
    statsPassingYards: number,
    statsPassingYardsPerAttempt: number,
    statsPassingTouchdowns: number,
    statsRushingAttempts: number,
    statsRushingYards: number,
    statsRushingTouchdowns: number,
    statsReceptions: number,
    statsReceivingTargets: number,
    statsReceivingYards: number,
    statsReceivingTouchdowns: number,
    statsReceivingYardsPerReception: number
}

export const getPlayerPositions = (players: ScouterPlayer[]): string[] => {
    return Array.from(new Set(players.flatMap((p) => p.playerInfo.primaryPosition))).sort();
};

// Shared list of (key, label) pairs for every stat column - reused by the player
// table's columns below and by the compare dialog's rows, so labels can't drift
// between the two views.
export const getStatFields = (latestPreviousYear: number): { key: keyof PlayerTableData; label: string }[] => [
    { key: "adp", label: "ADP" },
    { key: "projectedPoints", label: "PROJ PTS" },
    { key: "prevYearPoints", label: `${latestPreviousYear} PTS` },
    { key: "projectedGamesPlayed", label: "PROJ GP" },
    { key: "statsGamesPlayed", label: `${latestPreviousYear} GP` },
    { key: "projectedPassingAttempts", label: "PROJ PASS ATT" },
    { key: "projectedPassingYards", label: "PROJ PASS YDS" },
    { key: "projectedPassingYardsPerAttempt", label: "PROJ PASS YPA" },
    { key: "projectedPassingTouchdowns", label: "PROJ PASS TDS" },
    { key: "projectedRushingAttempts", label: "PROJ RUSH ATT" },
    { key: "projectedRushingYards", label: "PROJ RUSH YDS" },
    { key: "projectedRushingTouchdowns", label: "PROJ RUSH TDS" },
    { key: "projectedReceptions", label: "PROJ REC" },
    { key: "projectedReceivingYards", label: "PROJ REC YDS" },
    { key: "projectedReceivingTouchdowns", label: "PROJ REC TDS" },
    { key: "statsPassingAttempts", label: `${latestPreviousYear} PASS ATT` },
    { key: "statsPassingYards", label: `${latestPreviousYear} PASS YDS` },
    { key: "statsPassingYardsPerAttempt", label: `${latestPreviousYear} PASS YPA` },
    { key: "statsPassingTouchdowns", label: `${latestPreviousYear} PASS TDS` },
    { key: "statsRushingAttempts", label: `${latestPreviousYear} RUSH ATT` },
    { key: "statsRushingYards", label: `${latestPreviousYear} RUSH YDS` },
    { key: "statsRushingTouchdowns", label: `${latestPreviousYear} RUSH TDS` },
    { key: "statsReceptions", label: `${latestPreviousYear} REC` },
    { key: "statsReceivingTargets", label: `${latestPreviousYear} REC TGT` },
    { key: "statsReceivingYards", label: `${latestPreviousYear} REC YDS` },
    { key: "statsReceivingTouchdowns", label: `${latestPreviousYear} REC TDS` },
    { key: "statsReceivingYardsPerReception", label: `${latestPreviousYear} REC YPR` },
];

const columnHelper = createColumnHelper<DataTableFeatures, PlayerTableData>();

export type GetColumnsOptions = {
    // When provided, appends an "Actions" column rendering the given node per row -
    // used by the board's pool panel to add a "Send to Round" dropdown per player.
    renderRowActions?: (playerId: string) => React.ReactNode;
};

export const getColumns = (players: ScouterPlayer[], positions: string[], options?: GetColumnsOptions) => {
    const latestPreviousYear = players.length > 0 ? getLatestYearEntry(players[0].previousStats) : 0;
    const playersById = new Map(players.map((p) => [p._id, p]));

    return columnHelper.columns([
        sortingColumnHeader('adp', 'ADP'),
        columnHelper.accessor("name", {
            header: "NAME",
            size: 220,
            cell: ({ row }) => {
                const player = playersById.get(row.original.id);
                if (!player) return null;
                return (<PlayerNameCell player={player} />);
            },
        }),
        columnHelper.accessor("team", {
            header: "TEAM"
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
        // Points, projected stats, and previous year stats
        ...getStatFields(latestPreviousYear)
            .filter(({ key }) => key !== "adp")
            .map(({ key, label }) => sortingColumnHeader(key, label)),
        ...(options?.renderRowActions
            ? [
                  columnHelper.display({
                      id: "actions",
                      header: "ACTIONS",
                      size: 420,
                      cell: ({ row }) => options.renderRowActions!(row.original.id),
                  }),
              ]
            : []),
    ]);
};

const sortingColumnHeader = (columnKey: keyof PlayerTableData, columnName: string) => {
    return columnHelper.accessor(columnKey, {
        header: ({column}) => {
            return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {columnName}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
            )
        }
    });
}
