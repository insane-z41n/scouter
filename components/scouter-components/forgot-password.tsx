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
import { forgotPassword } from "@/lib/functions/scouter-service/password-reset"

export function ForgotPassword() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const backToLoginOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        router.push('/login')
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string

        const result = await forgotPassword(email)
        setIsSubmitting(false)
        setMessage(result.message)
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="flex justify-center gap-2">
                    <span>Reset Your Password</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {message ? (
                    <p className="text-sm text-muted-foreground">{message}</p>
                ) : (
                    <form id="forgot-password-form" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="scouter@example.com"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-6">
                {!message && (
                    <Button type="submit" className="w-full" form="forgot-password-form" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                )}
                <Button onClick={backToLoginOnClick} variant="outline" className="w-full">
                    Back to Login
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ForgotPassword
