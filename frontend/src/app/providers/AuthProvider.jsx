// external
import { useEffect } from 'react';

// internal
import { apiClient } from '@/shared/index';
import { useAuthStore } from '@/features/auth/index';

const AuthProvider = ({ children }) => {
    const { setUser, logoutUser, setIsAuthLoading } = useAuthStore();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsAuthLoading(true);
            try {
                // Make a request to an endpoint that checks if the cookie is valid
                const response = await apiClient.get(`/api/auth/user/check-auth`);


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

    return children || null;
}

export default AuthProvider