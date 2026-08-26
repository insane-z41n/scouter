"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export type AuthResult =
    | { success: true }
    | { success: false; message: string };

export async function login(email: string, password: string): Promise<AuthResult> {
    const url = `${process.env.SCOUTER_API_DOMAIN}/users/login`;

    try {
        const response = await axios.post<{ token: string }>(url, { email, password });
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, response.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });
        return { success: true };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Login failed",
            };
        }
        throw error;
    }
}
