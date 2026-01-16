// external
import { useMutation } from '@tanstack/react-query';

// internal
import { apiClient } from '@/shared/index';
import useAuthStore from '../store/useAuthStore';

const useAuthHandler = () => {
    const { setUser, logoutUser } = useAuthStore();

    const userSignupMutation = useMutation({
        mutationFn: async ({ name, email, password }) => {
            const res = await apiClient.post(`/api/auth/user/signup`, { name, email, password });
            return res.data
        },
        onSuccess: (data) => {
            setUser({
                name: data.name,
                email: data.email,
                uid: data.uid ?? undefined,
                provider: data.provider,
                isAuthenticated: true,
            });
        }
    });

    const userLoginMutation = useMutation({
        mutationFn: async ({ email, password, rememberMe }) => {
            const res = await apiClient.post("/api/auth/user/login", {email, password, rememberMe});
            return res.data;
        },
        onSuccess: (data) => {
            setUser({
                name: data.name,
                email: data.email,
                uid: data.uid ?? undefined,
                provider: data.provider,
                isAuthenticated: true,
            });
        }
    });

    const userLogoutMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post(`/api/auth/user/logout`);
            logoutUser();
        }
    });

    return {
        userSignupMutation,
        userLoginMutation,
        userLogoutMutation
    }
}

export default useAuthHandler;