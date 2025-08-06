import { googlePopupLogin, firebaseLogout } from "@/features/auth/firebase";
import { useState } from "react"
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

export const useGoogleAuth = () => {
    const { setUser, logoutUser} = useAuthStore();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const loginWithGoogle = async () => {
        setError(null);
        setLoading(true); 
        
        try {
            const result = await googlePopupLogin();
            const idToken = await result.user.getIdToken();

            // send token to the backend
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, { idToken }, {
                withCredentials: true
            });

            setUser({
                name: response.data.displayName,
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
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/logout`, null, {
            withCredentials: true
        })
        logoutUser();
    }

    return {loginWithGoogle, logoutGoogle, error, loading}
};