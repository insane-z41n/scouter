import { Loader2Icon } from "lucide-react"

export function LoadingSpinner({ label }: { label: string }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2Icon className="size-6 animate-spin" />
            <span className="text-sm">{label}</span>
        </div>
    )
}
