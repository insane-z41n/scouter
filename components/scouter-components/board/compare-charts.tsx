"use client"

import { useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { STAT_OPTIONS, StatKey } from "@/components/scouter-components/player-stats-chart"

const PLAYER_LINE_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

type StatsMode = "projected" | "previous"

const STATS_KEY_BY_MODE = {
    projected: "projectedStats",
    previous: "previousStats",
} as const

function playerHasStat(player: ScouterPlayer, stat: StatKey, mode: StatsMode) {
    return Object.values(player[STATS_KEY_BY_MODE[mode]]).some((s) => s[stat] != null)
}

// One row per year, one column per player, drawn from whichever source
// (projected or previous years) the toggle currently has selected.
function buildChartData(players: ScouterPlayer[], stat: StatKey, mode: StatsMode) {
    const statsKey = STATS_KEY_BY_MODE[mode]
    const years = new Set<string>()
    players.forEach((player) => {
        Object.keys(player[statsKey]).forEach((year) => years.add(year))
    })

    return Array.from(years)
        .sort((a, b) => Number(a) - Number(b))
        .map((year) => {
            const row: Record<string, string | number | null> = { year }
            players.forEach((player) => {
                row[player._id] = player[statsKey][year]?.[stat] ?? null
            })
            return row
        })
}

function StatChart({
    players,
    stat,
    label,
    config,
    mode,
}: {
    players: ScouterPlayer[]
    stat: StatKey
    label: string
    config: ChartConfig
    mode: StatsMode
}) {
    const chartData = useMemo(() => buildChartData(players, stat, mode), [players, stat, mode])

    return (
        <div className="flex flex-col gap-1 rounded-md border p-2">
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
            <ChartContainer config={config} className="aspect-auto h-40 w-full">
                <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {players.map((player) => (
                        <Line
                            key={player._id}
                            dataKey={player._id}
                            type="monotone"
                            stroke={`var(--color-${player._id})`}
                            strokeWidth={2}
                            dot={{ r: 3, fill: `var(--color-${player._id})` }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ChartContainer>
        </div>
    )
}

export function CompareCharts({ players }: { players: ScouterPlayer[] }) {
    const [mode, setMode] = useState<StatsMode>("projected")

    const config: ChartConfig = useMemo(
        () =>
            Object.fromEntries(
                players.map((player, index) => [
                    player._id,
                    {
                        label: `${player.playerInfo.firstName} ${player.playerInfo.lastName}`,
                        color: PLAYER_LINE_COLORS[index % PLAYER_LINE_COLORS.length],
                    },
                ])
            ),
        [players]
    )

    const availableStats = useMemo(
        () => STAT_OPTIONS.filter(({ value }) => players.some((player) => playerHasStat(player, value, mode))),
        [players, mode]
    )

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex flex-wrap items-center gap-4">
                    {players.map((player, index) => (
                        <div key={player._id} className="flex items-center gap-1.5 text-sm">
                            <span
                                className="size-2.5 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: PLAYER_LINE_COLORS[index % PLAYER_LINE_COLORS.length] }}
                            />
                            {player.playerInfo.firstName} {player.playerInfo.lastName}
                        </div>
                    ))}
                </div>
                <Tabs value={mode} onValueChange={(v) => setMode(v as StatsMode)}>
                    <TabsList>
                        <TabsTrigger value="projected">Projections</TabsTrigger>
                        <TabsTrigger value="previous">Previous Years</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            {availableStats.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                    No {mode === "projected" ? "projected" : "previous year"} stat data available for these players.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {availableStats.map(({ value, label }) => (
                        <StatChart key={value} players={players} stat={value} label={label} config={config} mode={mode} />
                    ))}
                </div>
            )}
        </div>
    )
}
