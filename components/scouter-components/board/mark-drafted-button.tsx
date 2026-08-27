"use client"

import { FlagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarkDraftedButton({ onMarkDrafted }: { onMarkDrafted: () => void }) {
    return (
        <Button variant="outline" size="sm" onClick={onMarkDrafted}>
            <FlagIcon /> Drafted
        </Button>
    )
}
