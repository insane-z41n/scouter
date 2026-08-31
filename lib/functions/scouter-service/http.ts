import axios from "axios";
import { cookies } from "next/headers";
import { getAuthHeader, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { AuthExpiredError } from "@/lib/auth/errors";

export async function scouterApiRequest<T>(
    method: "get" | "post" | "patch" | "delete",
    path: string,
    data?: unknown
): Promise<T> {
    const url = `${process.env.SCOUTER_API_DOMAIN}${path}`;
    const headers = await getAuthHeader();

    try {
        const response = await axios.request<T>({ method, url, data, headers });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                `Scouter API ${method.toUpperCase()} ${path} failed:`,
                error.response?.status,
                error.response?.data ?? error.message
            );
            // Our session token was rejected (expired/invalid) - drop it and signal
            // callers to send the user back to the login page instead of surfacing
            // a generic "could not save" failure.
            if (error.response?.status === 401 || error.response?.status === 403) {
                try {
                    const cookieStore = await cookies();
                    cookieStore.delete(SESSION_COOKIE_NAME);
                } catch {
                    // Cookie mutation is only allowed inside a Server Action/Route
                    // Handler. This function is also called directly from Server
                    // Components mid-render (e.g. the draft-boards page's initial
                    // load), where deleting is rejected - harmless to skip, since
                    // the next successful login overwrites this cookie anyway.
                }
                throw new AuthExpiredError();
            }
        }
        throw error;
    }
}
