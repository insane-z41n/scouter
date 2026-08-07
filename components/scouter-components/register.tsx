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

export function Register() {
  const router = useRouter();
  const backToLoginOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("Register button clicked - Event:", event);
        router.push('/login');
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex justify-center gap-2">
          <span>Scouter Register</span>
        </CardTitle>

      </CardHeader>
      <CardContent>
        <form>
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm-password">Confirm Password</Label>
              </div>
              <Input id="confirm-password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-6">
        <Button type="submit" className="w-full">
          Register
        </Button>
        <Button variant="outline" className="w-full" onClick={backToLoginOnClick}>
            Back to Login
        </Button>
      </CardFooter>
    </Card>
  )
}

export default { Register }
