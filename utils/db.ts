"use server"
import apiClient from './axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/api/users/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};