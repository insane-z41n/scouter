"use client"

import { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { Team } from "@/lib/functions/scouter-service/teams"
import { PlayerNameCell } from "@/components/scouter-components/player-stat-card"
import { RoundSelectMenu } from "./round-select-menu"
import { CompareToggleButton } from "./compare-toggle-button"
import { AssignTeamSlotMenu } from "./assign-team-slot-menu"
import { MarkDraftedButton } from "./mark-drafted-button"

export function getPlayerQuickStats(player: ScouterPlayer) {
    const hasProjected = Object.keys(player.projectedStats).length > 0
    const hasPrevious = Object.keys(player.previousStats).length > 0
    const projected = hasProjected ? player.projectedStats[getLatestYearEntry(player.projectedStats)] : null
    const previous = hasPrevious ? player.previousStats[getLatestYearEntry(player.previousStats)] : null

    return {
        projectedPoints: projected?.fantasyPointsPPR ?? null,
        prevYearPoints: previous?.fantasyPointsPPR ?? null,
        prevYearOverallRank: previous?.overallFantasyRankPPR ?? null,
        prevYearPositionalRank: previous?.positionalFantasyRankPPR ?? null,
    }
}

export function roundPlayerDragId(roundNumber: number, playerId: string) {
    return `round-player-${roundNumber}-${playerId}`
}

export function parseRoundPlayerDragId(id: string): { roundNumber: number; playerId: string } | null {
    const match = /^round-player-(\d+)-(.+)$/.exec(id)
    if (!match) return null
    return { roundNumber: Number(match[1]), playerId: match[2] }
}

function RoundPlayerCardComponent({
    player,
    roundNumber,
    roundNumbers,
    onMoveToRound,
    compareSelected,
    onToggleCompare,
    teams,
    onAssignSlot,
    onMarkDrafted,
}: {
    player: ScouterPlayer
    roundNumber: number
    roundNumbers: number[]
    onMoveToRound: (playerId: string, roundNumber: number | null) => void
    compareSelected: boolean
    onToggleCompare: (playerId: string) => void
    teams: Team[]
    onAssignSlot: (teamId: string, slotId: string, playerId: string) => void
    onMarkDrafted: (playerId: string) => void
}) {
    const dragId = roundPlayerDragId(roundNumber, player._id)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
        active,
        activeIndex,
        index,
    } = useSortable({ id: dragId })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    // While another card is dragged over this one, show a line marking which side
    // it'll be inserted on - above if dragging upward past this card, below if
    // dragging downward past it - instead of only ever landing at the list's ends.
    const showInsertionLine = isOver && active !== null && active.id !== dragId
    const insertBelow = showInsertionLine && activeIndex < index

    const { projectedPoints, prevYearPoints, prevYearOverallRank, prevYearPositionalRank } =
        getPlayerQuickStats(player)

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative flex items-center gap-2 rounded-md border bg-card p-2 text-sm ${
                compareSelected ? "ring-2 ring-primary" : ""
            }`}
        >
            {showInsertionLine && !insertBelow && (
                <div className="absolute inset-x-0 -top-1 h-0.5 rounded-full bg-primary" />
            )}
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                aria-label={`Drag ${player.playerInfo.firstName} ${player.playerInfo.lastName}`}
            >
                <GripVertical className="size-4" />
            </button>
            <div className="flex-1 truncate">
                <div className="flex items-baseline gap-2">
                    <span className="truncate font-medium">
                        <PlayerNameCell player={player} />
                    </span>
                    <span className="shrink-0 truncate text-xs text-muted-foreground">
                        {projectedPoints !== null && <>Proj {projectedPoints.toFixed(1)} pts</>}
                        {prevYearPoints !== null && <> · Prev {prevYearPoints.toFixed(1)} pts</>}
                        {prevYearOverallRank !== null && <> · Ovr #{prevYearOverallRank}</>}
                        {prevYearPositionalRank !== null && <> (Pos #{prevYearPositionalRank})</>}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    {player.playerInfo.primaryPosition} · {player.team}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <CompareToggleButton selected={compareSelected} onToggle={() => onToggleCompare(player._id)} />
                <AssignTeamSlotMenu
                    teams={teams}
                    playerId={player._id}
                    playerPosition={player.playerInfo.primaryPosition}
                    onAssignSlot={onAssignSlot}
                />
                <RoundSelectMenu
                    roundNumbers={roundNumbers}
                    currentRoundNumber={roundNumber}
                    onSelectRound={(toRoundNumber) => onMoveToRound(player._id, toRoundNumber)}
                />
                <MarkDraftedButton onMarkDrafted={() => onMarkDrafted(player._id)} />
            </div>
            {showInsertionLine && insertBelow && (
                <div className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
            )}
        </div>
    )
}

export const RoundPlayerCard = memo(RoundPlayerCardComponent)
