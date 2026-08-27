import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { verifyEmail } from "@/lib/functions/scouter-service/verify-email"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = token
    ? await verifyEmail(token)
    : { success: false as const, message: "This verification link is missing its token." }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex justify-center gap-2">
            <span>{result.success ? "Email Verified" : "Verification Failed"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${result.success ? "text-muted-foreground" : "text-destructive"}`}>
            {result.message}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" nativeButton={false} render={<Link href="/login" />}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
