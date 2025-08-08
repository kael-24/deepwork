import axios from 'axios'

import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

const AuthProvider = ({ children }) => {
    const {user, setUser, logoutUser, setIsAuthLoading} = useAuthStore();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsAuthLoading(true);
            try {
                // Make a request to an endpoint that checks if the cookie is valid
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/check-auth`, {
                    withCredentials: true // Important to send cookies
                });
                

                if (response.data.isAuthenticated) {
                    setUser({ 
                        name: response.data.name,
                        email: response.data.email,
                        uid: response.data.uid ?? undefined,
                        provider: response.data.provider,
                        isAuthenticated: true
                    })
                    
                }
            } catch (error) {
                console.log('Error checking auth status: ', error)
                // If there's an error or the user is not authenticated, logout user
                logoutUser();
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuthStatus();
    }, [])

    console.log("AuthStates", user);

    return children || null;
}

export default AuthProvider