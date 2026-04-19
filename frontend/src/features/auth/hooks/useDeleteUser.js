// external
import { useMutation } from "@tanstack/react-query";

// internal
import { apiClient } from "@/shared/index";
import useAuthStore from "../store/useAuthStore";
import { firebaseLogout } from "../utils/firebase";

const useDeleteUser = () => {

    const { user, logoutUser } = useAuthStore();

    const deleteUser = useMutation({
        mutationFn: async ({ password }) => {
            await apiClient.delete(`/api/auth/user/delete-user`, {
                data: { password }
            });
        },
        onSuccess: () => {
            if (user.provider === 'google') {
                firebaseLogout();
            }
            logoutUser();
        },
    });

    return { deleteUser };
}

export default useDeleteUser;