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
import { register } from "@/lib/functions/scouter-service/register"

export function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredMessage, setRegisteredMessage] = useState<string | null>(null);

  const backToLoginOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push('/login');
  }

  const registerSubmitAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const result = await register(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
    setRegisteredMessage(result.message);
  }

  if (registeredMessage) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex justify-center gap-2">
            <span>Check Your Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{registeredMessage}</p>
        </CardContent>
        <CardFooter className="flex-col gap-6">
          <Button variant="outline" className="w-full" onClick={backToLoginOnClick}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex justify-center gap-2">
          <span>Scouter Register</span>
        </CardTitle>

      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={registerSubmitAction}>
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm-password">Confirm Password</Label>
              </div>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-6">
        <Button type="submit" className="w-full" form="register-form" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
        <Button variant="outline" className="w-full" onClick={backToLoginOnClick}>
            Back to Login
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Register
