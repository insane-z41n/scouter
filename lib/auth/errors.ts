// Client-safe: no "next/headers" or other server-only imports here. http.ts
// (server-only) and query-provider.tsx (client) both need this signal, and
// pulling it from a module that imports next/headers would break the client
// bundle ("next/headers ... only available in Server Components").
export const AUTH_EXPIRED_MESSAGE = "AUTH_SESSION_EXPIRED";

export class AuthExpiredError extends Error {
    constructor() {
        super(AUTH_EXPIRED_MESSAGE);
        this.name = "AuthExpiredError";
    }
}
