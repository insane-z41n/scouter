"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PositionFilter({
    positions,
    selectedPositions,
    onChange,
}: {
    positions: string[]
    selectedPositions: string[]
    onChange: (positions: string[]) => void
}) {
    const togglePosition = (position: string, checked: boolean) => {
        onChange(checked ? [...selectedPositions, position] : selectedPositions.filter((p) => p !== position))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="sm">
                        <Filter />
                        {selectedPositions.length > 0 ? `Position (${selectedPositions.length})` : "Position"}
                    </Button>
                }
            />
            <DropdownMenuContent align="start">
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
}
