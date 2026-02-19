import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/index";

const useDeleteRecord = () => {
    const queryClient = useQueryClient();

    const deleteRecord = useMutation({
        mutationFn: async (recordId) => {
            await apiClient.delete(`/api/records/${recordId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["records"]);
        }
    });

    return { deleteRecord };
}

export default useDeleteRecord;