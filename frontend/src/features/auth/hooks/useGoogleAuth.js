import { apiClient } from "@/shared/api/client";
import { googlePopupLogin, firebaseLogout } from "@/features/auth/utils/firebase";
import { useState } from "react"
import { useAuthStore } from "@/features/auth/store/useAuthStore";


export const useGoogleAuth = () => {
    const { setUser, logoutUser } = useAuthStore();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const loginWithGoogle = async () => {
        setError(null);
        setLoading(true);

        try {
            const result = await googlePopupLogin();
            const idToken = await result.user.getIdToken();

            // send token to the backend
            const response = await apiClient.post(`/api/auth/user/google`, { idToken });

            setUser({
                name: response.data.name,
                email: response.data.email,
                uid: response.data.uid,
                provider: response.data.provider,
                isAuthenticated: true
            })
        } catch (err) {
            console.error(err);
            setError(`${err?.response?.data?.error} -- ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const logoutGoogle = async () => {
        await firebaseLogout();
        await apiClient.post(`/api/auth/user/logout`)
        logoutUser();
    }

    return { loginWithGoogle, logoutGoogle, error, loading }
};