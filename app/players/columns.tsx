"use client"

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableFeatures } from "./player-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type PlayerTableData = {
    adp: number,
    name: string,
    position: string,
    projectedPoints: number,
    prevYearPoints: number,
}

const columnHelper = createColumnHelper<DataTableFeatures, PlayerTableData>();
export const getColumns = (prevYear: string) => {

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
            header: "Player Name"
        }),
        columnHelper.accessor("position", {
            header: "Position"
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
