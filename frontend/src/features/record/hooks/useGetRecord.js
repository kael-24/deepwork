import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/index";
import useRecordWorkout from "./useCreateRecord";

const useGetRecordWorkout = (recordId) => {
    return useQuery({
        queryKey: ["record", recordId],
        queryFn: async () => {
            
        } 
    })
};

export default useRecordWorkout;