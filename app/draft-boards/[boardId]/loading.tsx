import { LoadingSpinner } from "@/components/scouter-components/loading-spinner"

export default function Loading() {
    return (
        <div style={{ height: "100vh" }}>
            <LoadingSpinner label="Loading draft board…" />
        </div>
    )
}
