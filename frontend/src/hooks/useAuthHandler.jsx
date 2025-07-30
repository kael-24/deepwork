import axios from 'axios'
import { useState } from 'react'
import { useAuthContext } from './useContext/useAuthContext';

export const useAuthHandler = () => {
    const { dispatch } = useAuthContext(); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userSignup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, { //TODO
                name,
                email, 
                password
            }, {
                withCredentials: true // Ensure cookies are sent/received
            });

            // Update context with user data
            dispatch({ type: 'SIGNUP', payload: response.data });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.error || 'Error signing up');
        }
    }

    const userLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                email, 
                password
            }, {
                withCredentials: true // Ensure cookies are sent/received
            });

            // Update context with user data
            dispatch({ type: 'LOGIN', payload: response.data });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.error || 'Error logging in');
        }
    }

    const userLogout = async () => {
        setIsLoading(true);
        
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {}, {
                withCredentials: true
            });
            
            // Clear user from context
            dispatch({ type: 'LOGOUT' });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error("Error logging out", err);
        }
    }

    return { userSignup, userLogin, userLogout, error, isLoading };
}