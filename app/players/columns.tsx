"use client"

import * as React from "react"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

import { DataTableFeatures } from "./player-table-features";

export type PlayerTableData = {
    adp: number,
    name: string,
    position: string,
    projectedPoints: number,
    prevYearPoints: number,
}

export const getPlayerPositions = (players: ScouterPlayer[]): string[] => {
    return Array.from(new Set(players.map((p) => p.position))).sort();
};

function PlayerNameCell({ player }: { player: PlayerTableData }) {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="link" className="h-auto p-0" />}>
                {player.name}
            </DialogTrigger>
            <DialogPopup render={<Card />}>
                <CardHeader>
                    <DialogTitle>{player.name}</DialogTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm">
                    <div>Position: {player.position}</div>
                    <div>ADP: {player.adp}</div>
                    <div>Projected Points: {player.projectedPoints}</div>
                    <div>Previous Year Points: {player.prevYearPoints}</div>
                </CardContent>
            </DialogPopup>
        </Dialog>
    );
}



const columnHelper = createColumnHelper<DataTableFeatures, PlayerTableData>();
export const getColumns = (players: ScouterPlayer[], positions: string[]) => {

    const prevYear = players[0].prevYearStats.year;

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
            cell: ({ row }) => <PlayerNameCell player={row.original} />,
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
                        {prevYear} PTS
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        }),
        
    ]);
};
