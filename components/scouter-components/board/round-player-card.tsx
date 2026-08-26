"use client"

import { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players"
import { RoundSelectMenu } from "./round-select-menu"

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
    onSendToPool,
}: {
    player: ScouterPlayer
    roundNumber: number
    roundNumbers: number[]
    onMoveToRound: (playerId: string, roundNumber: number) => void
    onSendToPool: (playerId: string) => void
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative flex items-center gap-2 rounded-md border bg-card p-2 text-sm"
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
                <div className="truncate font-medium">
                    {player.playerInfo.firstName} {player.playerInfo.lastName}
                </div>
                <div className="text-xs text-muted-foreground">
                    {player.playerInfo.primaryPosition} · {player.team}
                </div>
            </div>
            <RoundSelectMenu
                roundNumbers={roundNumbers}
                currentRoundNumber={roundNumber}
                onSelectRound={(toRoundNumber) => onMoveToRound(player._id, toRoundNumber)}
                onSendToPool={() => onSendToPool(player._id)}
                triggerLabel="Move"
            />
            {showInsertionLine && insertBelow && (
                <div className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
            )}
        </div>
    )
}

export const RoundPlayerCard = memo(RoundPlayerCardComponent)
