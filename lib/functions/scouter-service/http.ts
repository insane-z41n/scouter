import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthHeader, SESSION_COOKIE_NAME } from "@/lib/auth/session";

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
            // Our session token was rejected (expired/invalid) - drop it and send
            // the user back to the login page instead of surfacing a crash.
            if (error.response?.status === 401 || error.response?.status === 403) {
                const cookieStore = await cookies();
                cookieStore.delete(SESSION_COOKIE_NAME);
                redirect("/login");
            }
        }
        throw error;
    }
}
