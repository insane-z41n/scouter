import axios from "axios";
import { getAuthHeader } from "@/lib/auth/session";

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
        }
        throw error;
    }
}
