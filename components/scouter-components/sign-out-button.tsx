"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/functions/scouter-service/logout"

export function SignOutButton() {
    const router = useRouter()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const onClick = async () => {
        setIsSigningOut(true)
        await logout()
        router.push("/login")
        router.refresh()
    }

    return (
        <Button variant="outline" onClick={onClick} disabled={isSigningOut}>
            {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
    )
}
