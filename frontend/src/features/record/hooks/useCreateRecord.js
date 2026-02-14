import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/shared/index.js";

const useCreateRecord = () => {
    const createRecord = useMutation({
        mutationFn: async ({
            workoutId, 
            workoutDateStarted, 
            workoutDateEnded, 
            workoutDuration, 
            exercisesDuration
        }) => {
                const res = await apiClient.post(`/api/records/${workoutId}`, {
                    workoutDateStarted, 
                    workoutDateEnded, 
                    workoutDuration, 
                    exercisesDuration
                });
                return res.data;
            }
        });   
    return { createRecord };
}

export default useCreateRecord;
