import { apiClient } from "@/shared/api/client";
import { useMutation } from "@tanstack/react-query"

const useEditUser = () => {

    const editUserMutation = useMutation({
        mutationFn: async ({ name = undefined, password = undefined, newPassword = undefined }) => {
            const res = await apiClient.patch(`/api/auth/user/edit-user`, { name, password, newPassword });

            return res.data;
        }
    });

    return {editUserMutation}
}

export default useEditUser;

