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

const columnHelper = createColumnHelper<DataTableFeatures, PlayerTableData>();

export type GetColumnsOptions = {
    // When provided, appends an "Actions" column rendering the given node per row -
    // used by the board's pool panel to add a "Send to Round" dropdown per player.
    renderRowActions?: (playerId: string) => React.ReactNode;
};

export const getColumns = (players: ScouterPlayer[], positions: string[], options?: GetColumnsOptions) => {
    const latestPreviousYear = getLatestYearEntry(players[0]?.previousStats);
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
        // Points 
        sortingColumnHeader('projectedPoints', 'PROJ PTS'),
        sortingColumnHeader('prevYearPoints', `${latestPreviousYear} PTS`),
        // Projected stats
        sortingColumnHeader('projectedPassingAttempts', 'PROJ PASS ATT'),
        sortingColumnHeader('projectedPassingYards', 'PROJ PASS YDS'),
        sortingColumnHeader('projectedPassingYardsPerAttempt', 'PROJ PASS YPA'),
        sortingColumnHeader('projectedPassingTouchdowns', 'PROJ PASS TDS'),
        sortingColumnHeader('projectedRushingAttempts', 'PROJ RUSH ATT'),
        sortingColumnHeader('projectedRushingYards', 'PROJ RUSH YDS'),
        sortingColumnHeader('projectedRushingTouchdowns', 'PROJ RUSH TDS'),
        sortingColumnHeader('projectedReceptions', 'PROJ REC'),
        sortingColumnHeader('projectedReceivingYards', 'PROJ REC YDS'),
        sortingColumnHeader('projectedReceivingTouchdowns', 'PROJ REC TDS'),
        // Previous Year Stats
        sortingColumnHeader('statsPassingAttempts', `${latestPreviousYear} PASS ATT`),
        sortingColumnHeader('statsPassingYards', `${latestPreviousYear} PASS YDS`),
        sortingColumnHeader('statsPassingYardsPerAttempt', `${latestPreviousYear} PASS YPA`),
        sortingColumnHeader('statsPassingTouchdowns', `${latestPreviousYear} PASS TDS`),
        sortingColumnHeader('statsRushingAttempts', `${latestPreviousYear} RUSH ATT`),
        sortingColumnHeader('statsRushingYards', `${latestPreviousYear} RUSH YDS`),
        sortingColumnHeader('statsRushingTouchdowns', `${latestPreviousYear} RUSH TDS`),
        sortingColumnHeader('statsReceptions', `${latestPreviousYear} REC`),
        sortingColumnHeader('statsReceivingTargets', `${latestPreviousYear} REC TGT`),
        sortingColumnHeader('statsReceivingYards', `${latestPreviousYear} REC YDS`),
        sortingColumnHeader('statsReceivingTouchdowns', `${latestPreviousYear} REC TDS`),
        sortingColumnHeader('statsReceivingYardsPerReception', `${latestPreviousYear} REC YPR`),
        ...(options?.renderRowActions
            ? [
                  columnHelper.display({
                      id: "actions",
                      header: "ACTIONS",
                      size: 160,
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
