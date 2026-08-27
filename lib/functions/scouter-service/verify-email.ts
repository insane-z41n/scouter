"use server";

import axios from "axios";

export type ActionResult =
    | { success: true; message: string }
    | { success: false; message: string };

export async function verifyEmail(token: string): Promise<ActionResult> {
    const url = `${process.env.SCOUTER_API_DOMAIN}/users/verify-email`;

    try {
        const response = await axios.post<{ message: string }>(url, { token });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Email verification failed",
            };
        }
        throw error;
    }
}

export async function resendVerification(email: string): Promise<ActionResult> {
    const url = `${process.env.SCOUTER_API_DOMAIN}/users/resend-verification`;

    try {
        const response = await axios.post<{ message: string }>(url, { email });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Could not resend verification email",
            };
        }
        throw error;
    }
}
