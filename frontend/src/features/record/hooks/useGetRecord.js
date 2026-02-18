import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/index";

const useGetRecord = (recordId) => {
    return useQuery({
        queryKey: ["record", recordId],
        queryFn: async () => {
            const record = await apiClient.get(`/api/records/${recordId}`);
            return record.data;
        } 
    });
};

export default useGetRecord;