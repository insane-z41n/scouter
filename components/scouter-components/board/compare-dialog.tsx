"use client"

import { useMemo, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogDescription, DialogPopup, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { getStatFields } from "@/app/players/columns"
import { mapScouterPlayersToPlayerTableData } from "@/app/players/map-player-table-data"
import { CompareCharts } from "./compare-charts"

export function CompareDialog({
    open,
    onOpenChange,
    players,
    onToggleCompare,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    players: ScouterPlayer[]
    onToggleCompare: (playerId: string) => void
}) {
    const [view, setView] = useState<"table" | "graphs">("table")

    const tableDataById = useMemo(() => {
        const data = mapScouterPlayersToPlayerTableData(players)
        return new Map(data.map((d) => [d.id, d]))
    }, [players])

    const statFields = useMemo(
        () => (players.length === 0 ? [] : getStatFields(getLatestYearEntry(players[0].previousStats))),
        [players]
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPopup render={<Card />} className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden">
                <CardHeader className="shrink-0 pr-10">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <DialogTitle>Compare Players</DialogTitle>
                            <DialogDescription>Stats side by side for the selected players.</DialogDescription>
                        </div>
                        <Tabs value={view} onValueChange={(v) => setView(v as "table" | "graphs")}>
                            <TabsList>
                                <TabsTrigger value="table">Table</TabsTrigger>
                                <TabsTrigger value="graphs">Graphs</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    {view === "table" ? (
                        // A single scrollable wrapper (not the shared Table primitive, whose own
                        // overflow-x-auto div would become the nearest sticky-positioning ancestor
                        // instead of this one, breaking the sticky header) handles both scroll axes,
                        // so the header row can stick to its top edge while scrolling down. A fixed
                        // viewport-relative cap is used instead of h-full because a flex item's
                        // stretched height isn't a definite containing block for percentage children.
                        <div className="max-h-[55vh] overflow-auto rounded-md border">
                            <table className="w-full caption-bottom text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky top-0 left-0 z-30 bg-card">Stat</TableHead>
                                        {players.map((player) => (
                                            <TableHead key={player._id} className="sticky top-0 z-20 min-w-32 bg-card">
                                                <div className="flex items-start justify-between gap-1">
                                                    <div>
                                                        <div className="font-medium text-foreground">
                                                            {player.playerInfo.firstName} {player.playerInfo.lastName}
                                                        </div>
                                                        <div className="text-xs font-normal text-muted-foreground">
                                                            {player.playerInfo.primaryPosition} · {player.team}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        aria-label={`Remove ${player.playerInfo.firstName} ${player.playerInfo.lastName} from comparison`}
                                                        onClick={() => onToggleCompare(player._id)}
                                                    >
                                                        <X />
                                                    </Button>
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {statFields.map(({ key, label }) => (
                                        <TableRow key={key}>
                                            <TableCell className="sticky left-0 z-10 bg-card font-medium text-muted-foreground">
                                                {label}
                                            </TableCell>
                                            {players.map((player) => (
                                                <TableCell key={player._id}>
                                                    {tableDataById.get(player._id)?.[key] ?? "-"}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </table>
                        </div>
                    ) : (
                        <div className="max-h-[55vh] overflow-auto">
                            <CompareCharts players={players} />
                        </div>
                    )}
                </CardContent>
            </DialogPopup>
        </Dialog>
    )
}
