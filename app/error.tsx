"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Something went wrong</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        An unexpected error occurred. You can try again, or head back to your draft boards.
                    </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full" onClick={reset}>
                        Try again
                    </Button>
                    <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/draft-boards" />}>
                        Back to Draft Boards
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
