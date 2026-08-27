import { ResetPassword } from "@/components/scouter-components/reset-password"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return (
    <div className="flex justify-center items-center h-screen">
      <ResetPassword token={token ?? null} />
    </div>
  )
}
