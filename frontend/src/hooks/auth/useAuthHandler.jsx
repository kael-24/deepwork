import axios from 'axios'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore';

export const useAuthHandler = () => {
    const { setUser, logoutUser } = useAuthStore(); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userSignup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/signup`, { 
                name,
                email, 
                password
            }, {
                withCredentials: true // Ensure cookies are sent/received
            });

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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/login`, {
                email, 
                password,
                rememberMe
            }, {
                withCredentials: true // Ensure cookies are sent/received
            });

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
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/logout`, {}, {
                withCredentials: true
            });
            
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