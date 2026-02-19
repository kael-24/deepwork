import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/index";

const useGetAllRecords = () => {
    return useQuery({
        queryKey: ["records"],
        queryFn: async () => {
            const res = await apiClient.get(`/api/records`);
            return res.data;
        }
    });
};

export default useGetAllRecords;