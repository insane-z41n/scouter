"use client"

import { useState } from "react"
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
import { useRouter } from "next/navigation"
import { login } from "@/lib/functions/scouter-service/login"

export function Login() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loginSubmitAction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await login(email, password);
        setIsSubmitting(false);

        if (!result.success) {
            setError(result.message);
            return;
        }
        router.push('/draft-boards');
    }
    const registerOnClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push('/register');
    }
    const forgotPasswordOnClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push('/forgot-password');
    }

    return (
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="flex justify-center gap-2">
            <span>Scouter Login</span>
            </CardTitle>

        </CardHeader>
        <CardContent>
            <form id="login-form" onSubmit={loginSubmitAction}>
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
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-6">
            <Button type="submit" className="w-full" form="login-form" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <Button onClick={forgotPasswordOnClickAction} variant="link" className="w-full -my-4" >
                Forgot password?
            </Button>
            <Button onClick={registerOnClickAction} variant="outline" className="w-full" >
                Register
            </Button>
        </CardFooter>
        </Card>
    )
}

export default Login