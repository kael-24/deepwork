import { apiClient } from '@/shared/api/client';
import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const useAuthHandler = () => {
    const { setUser, logoutUser } = useAuthStore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userSignup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient(`/api/auth/user/signup`, { name, email, password });

            // Update context with user data
            setUser({
                name: response.data.name,
                email: response.data.email,
                uid: response.data.uid ?? undefined,
                provider: response.data.provider,
                isAuthenticated: true,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error signing up');
        } finally {
            setIsLoading(false)
        }
    }

    const userLogin = async (email, password, rememberMe) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(`/api/auth/user/login`, { email, password, rememberMe });

            // Update context with user data
            setUser({
                name: response.data.name,
                email: response.data.email,
                uid: response.data.uid ?? undefined,
                provider: response.data.provider,
                isAuthenticated: true,
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error logging in');
        } finally {
            setIsLoading(false);
        }
    }

    const userLogout = async () => {
        setIsLoading(true);

        try {
            await apiClient.post(`/api/auth/user/logout`);

            // Clear user from context
            logoutUser();
        } catch (err) {
            console.error("Error logging out", err);
        } finally {
            setIsLoading(false);
        }
    }

    return { userSignup, userLogin, userLogout, error, isLoading };
}