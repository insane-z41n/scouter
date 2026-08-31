import { LoadingSpinner } from "@/components/scouter-components/loading-spinner"

export default function Loading() {
    return (
        <div className="flex h-64 flex-col p-8">
            <LoadingSpinner label="Loading players…" />
        </div>
    )
}
