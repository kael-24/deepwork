// external
import { useMutation } from '@tanstack/react-query';

// internal
import { apiClient } from '@/shared/index';

const useForgetPassword = () => {

    const forgetPasswordMutation = useMutation({
        mutationFn: async (email) => {
            await apiClient.post(`/api/auth/forget-password`, { email });
            // still needed so that mutate can know what to output
            return true;
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ token, newPassword }) => {
            await apiClient.patch(`/api/auth/reset-password`, { token, newPassword });
            return true;
        }
    });

    return {
        forgetPasswordMutation,
        resetPasswordMutation
    };
}

export default useForgetPassword;






