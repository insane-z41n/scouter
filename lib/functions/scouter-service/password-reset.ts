"use server";

import axios from "axios";
import type { ActionResult } from "./verify-email";

export async function forgotPassword(email: string): Promise<ActionResult> {
    const url = `${process.env.SCOUTER_API_DOMAIN}/users/forgot-password`;

    try {
        const response = await axios.post<{ message: string }>(url, { email });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Could not request a password reset",
            };
        }
        throw error;
    }
}

export async function resetPassword(token: string, password: string): Promise<ActionResult> {
    const url = `${process.env.SCOUTER_API_DOMAIN}/users/reset-password`;

    try {
        const response = await axios.post<{ message: string }>(url, { token, password });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Could not reset password",
            };
        }
        throw error;
    }
}
