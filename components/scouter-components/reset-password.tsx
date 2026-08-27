"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/functions/scouter-service/password-reset"

export function ResetPassword({ token }: { token: string | null }) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        if (!token) {
            setError("This reset link is missing its token. Request a new one.")
            return
        }

        const formData = new FormData(event.currentTarget)
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirm-password") as string

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsSubmitting(true)
        const result = await resetPassword(token, password)
        setIsSubmitting(false)

        if (!result.success) {
            setError(result.message)
            return
        }
        setSuccess(true)
    }

    if (success) {
        return (
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="flex justify-center gap-2">
                        <span>Password Reset</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push('/login')}>
                        Go to Login
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="flex justify-center gap-2">
                    <span>Choose a New Password</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form id="reset-password-form" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" name="confirm-password" type="password" required />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" form="reset-password-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Reset Password"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ResetPassword
