"use client"

import * as React from "react"
import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { AUTH_EXPIRED_MESSAGE } from "@/lib/auth/errors"

// Server Actions invoked from client code (queryFn/mutationFn) can't rely on
// redirect() inside scouterApiRequest - it just becomes a rejected promise that
// React Query captures as an error instead of navigating. Catching it here, in one
// place, means every hook in lib/hooks gets the redirect for free instead of each
// dialog/mutation needing its own auth-aware error handling.
function isAuthExpired(error: unknown): boolean {
  return error instanceof Error && error.message === AUTH_EXPIRED_MESSAGE
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (isAuthExpired(error)) {
              router.replace("/login")
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (isAuthExpired(error)) {
              router.replace("/login")
            }
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export { QueryProvider }
