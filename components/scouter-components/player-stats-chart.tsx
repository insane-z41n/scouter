"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { ScouterPlayer, ScouterPlayerYearStats } from "@/lib/functions/scouter-service/get-players";

// Add a stat to the toggle by adding one entry here — value is checked against
// ScouterPlayerYearStats, and the select options / chart both read from this list.
const STAT_OPTIONS = [
    { value: "passingAttempts", label: "Passing Attempts" },
    { value: "passingYards", label: "Passing Yards" },
    { value: "passingYardsPerAttempt", label: "Passing Yards / Attempt" },
    { value: "passingTouchdowns", label: "Passing Touchdowns" },
    { value: "rushingAttempts", label: "Rushing Attempts" },
    { value: "rushingYards", label: "Rushing Yards" },
    { value: "rushingTouchdowns", label: "Rushing Touchdowns" },
    { value: "receptions", label: "Receptions" },
    { value: "receivingYards", label: "Receiving Yards" },
    { value: "receivingTouchdowns", label: "Receiving Touchdowns" },
    { value: "fantasyPointsPPR", label: "Fantasy Points (PPR)" },
] as const satisfies ReadonlyArray<{ value: keyof ScouterPlayerYearStats; label: string }>;

type StatKey = (typeof STAT_OPTIONS)[number]["value"];

const chartConfig = {
    previous: {
        label: "Previous",
        color: "var(--chart-1)",
    },
    projected: {
        label: "Projected",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

function hasStat(statsByYear: Record<string, ScouterPlayerYearStats>, stat: StatKey) {
    return Object.values(statsByYear).some((yearStats) => yearStats[stat] != null);
}

export function PlayerStatsChart({ player }: { player: ScouterPlayer }) {
    const availableStats = useMemo(
        () =>
            STAT_OPTIONS.filter(
                ({ value }) =>
                    hasStat(player.previousStats, value) || hasStat(player.projectedStats, value)
            ),
        [player.previousStats, player.projectedStats]
    );

    const [selectedStat, setSelectedStat] = useState<StatKey>(() => {
        const defaultStat: StatKey = "fantasyPointsPPR";
        return availableStats.some(({ value }) => value === defaultStat)
            ? defaultStat
            : (availableStats[0]?.value ?? STAT_OPTIONS[0].value);
    });

    const chartData = useMemo(() => {
        const years = new Set([
            ...Object.keys(player.previousStats),
            ...Object.keys(player.projectedStats),
        ]);
        return Array.from(years)
            .sort((a, b) => Number(a) - Number(b))
            .map((year) => ({
                year,
                previous: player.previousStats[year]?.[selectedStat] ?? null,
                projected: player.projectedStats[year]?.[selectedStat] ?? null,
            }));
    }, [player.previousStats, player.projectedStats, selectedStat]);

    const hasData = chartData.some((point) => point.previous != null || point.projected != null);

    return (
        <div className="flex flex-col gap-3">
            <Select
                items={STAT_OPTIONS}
                value={selectedStat}
                onValueChange={(value) => setSelectedStat(value as StatKey)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {STAT_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasData ? (
                <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line
                            dataKey="previous"
                            type="monotone"
                            stroke="var(--color-previous)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "var(--color-previous)" }}
                            connectNulls
                        />
                        <Line
                            dataKey="projected"
                            type="monotone"
                            stroke="var(--color-projected)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "var(--color-projected)" }}
                            connectNulls
                        />
                    </LineChart>
                </ChartContainer>
            ) : (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                    No data available for this stat.
                </div>
            )}
        </div>
    );
}
