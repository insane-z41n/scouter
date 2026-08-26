import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "scouter_token";

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getAuthHeader(): Promise<{ Authorization: string }> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }
    return { Authorization: `Bearer ${token}` };
}
