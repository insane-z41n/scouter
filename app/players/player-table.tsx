"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"
import {
    useTable,
    type ColumnFiltersState,
    type SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { features } from "./player-table-features"
import { getColumns, getPlayerPositions, PlayerTableData } from "./columns"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"


export function PlayerTable({
  data,
  players,
}: {data: PlayerTableData[]; players: ScouterPlayer[]}) {
    const positions = React.useMemo(() => getPlayerPositions(players), [players])
    const columns = React.useMemo(() => getColumns(players, positions), [players, positions])
    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: 'adp',
            desc: false,
        }
    ]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useTable({
        columns,
        data,
        features,
        manualFiltering: false,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        initialState: {
            columnPinning: {
                start: ["name"],
                end: [],
            },
        },
        state: {
            columnFilters,
            sorting,
        }
    })

    return (
        <div>
            <div>
                <Table>
                    {/** Mapping Heders for player table */}
                    <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const isPinned = header.column.getIsPinned();
                            return (
                            <TableHead
                                key={header.id}
                                className={isPinned ? "sticky left-0 z-20 bg-background" : undefined}
                            >
                                {header.isPlaceholder ? null : (
                                <table.FlexRender header={header} />
                                )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const isPinned = cell.column.getIsPinned();
                                    return (
                                    <TableCell
                                        key={cell.id}
                                        className={isPinned ? "sticky left-0 z-10 bg-background" : undefined}
                                    >
                                        <table.FlexRender cell={cell} />
                                    </TableCell>
                                    )
                                })}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}