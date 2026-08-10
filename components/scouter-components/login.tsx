"use client"

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

export function Login() {

    const router = useRouter();

    const loginSubmitAction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Login form submitted - Event:", event);
        router.push('/home');
    }
    const registerOnClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("Register button clicked - Event:", event);
        router.push('/register');
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
                    type="email"
                    placeholder="scouter@example.com"
                    required
                />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-6">
            <Button type="submit" className="w-full" form="login-form">
                Login
            </Button>
            <Button onClick={registerOnClickAction} variant="outline" className="w-full" >
                Register
            </Button>
        </CardFooter>
        </Card>
    )
}

export default Login