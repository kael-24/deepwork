import axios from "axios"
import { useMutation } from "@tanstack/react-query"

const useEditUser = () => {

    const editUserMutation = useMutation({
        mutationFn: async ({ name = undefined, password = undefined, newPassword = undefined }) => {
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/edit-user`, { 
                name, 
                password, 
                newPassword 
            }, { 
                withCredentials: true 
            });

            return res.data;
        }
    });

    return {editUserMutation}
}

export default useEditUser;

