"use client"

import { Scale } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CompareToggleButton({
    selected,
    onToggle,
}: {
    selected: boolean
    onToggle: () => void
}) {
    return (
        <Button
            variant={selected ? "secondary" : "outline"}
            size="sm"
            aria-pressed={selected}
            onClick={onToggle}
        >
            <Scale /> {selected ? "Comparing" : "Compare"}
        </Button>
    )
}
