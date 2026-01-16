// external
import { useMutation } from "@tanstack/react-query";

// internal
import { apiClient } from "@/shared/index";
import { googlePopupLogin, firebaseLogout } from "../utils/firebase"
import useAuthStore from "../store/useAuthStore";


const useGoogleAuth = () => {
    const { setUser, logoutUser } = useAuthStore();

    const loginWithGoogleMutation = useMutation({
        mutationFn: async () => {
            const result = await googlePopupLogin();
            const idToken = await result.user.getIdToken();
            const res = await apiClient.post(`/api/auth/user/google`, { idToken });
            return res.data;
        },
        onSuccess: (data) => {
            setUser({
                name: data.name,
                email: data.email,
                uid: data.uid,
                provider: data.provider,
                isAuthenticated: true
            });
        }
    });

    const logoutGoogleMutation = useMutation({
        mutationFn: async () => {
            await firebaseLogout();
            await apiClient.post(`/api/auth/user/logout`)
            logoutUser();
        }
    });

    return { loginWithGoogleMutation, logoutGoogleMutation }
};

export default useGoogleAuth;