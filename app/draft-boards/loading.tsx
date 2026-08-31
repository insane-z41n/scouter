import { LoadingSpinner } from "@/components/scouter-components/loading-spinner"

export default function Loading() {
    return (
        <div className="mx-auto flex h-64 max-w-3xl flex-col p-8">
            <LoadingSpinner label="Loading draft boards…" />
        </div>
    )
}
