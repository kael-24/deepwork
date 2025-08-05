import axios from "axios"
import { useMutation } from '@tanstack/react-query';


const useForgetPassword = () => {

    const forgetPasswordMutation = useMutation({
        mutationFn: async (email) => {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forget-password`, { email });
            // still needed so that mutate can know what to output
            return true;
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ token, newPassword }) => {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, { token, newPassword });
            return true;
        }
    })

    return {
        forgetPasswordMutation,
        resetPasswordMutation
    };
}

export default useForgetPassword