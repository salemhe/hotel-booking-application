import apiClient from './axios';

const BASE_URL = process.env.BASE_URL;

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/api/vendors/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};