"use server";

import axios from "axios";
import type { ActionResult } from "./verify-email";

export async function register(email: string, password: string): Promise<ActionResult> {
    const url = `${process.env.SCOUTER_API_DOMAIN}/users/register`;

    try {
        const response = await axios.post<{ message: string }>(url, { email, password });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Registration failed",
            };
        }
        throw error;
    }
}
