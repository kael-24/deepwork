import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/shared/index.js";

const useRecordWorkout = () => {
    const recordWorkout = useMutation({
        mutationFn: async ({
            workoutId, 
            workoutDateStarted, 
            workoutDateEnded, 
            workoutDuration, 
            exercisesDuration
        }) => {
                const res = await apiClient.post(`/api/workouts/record/${workoutId}`, {
                    workoutDateStarted, 
                    workoutDateEnded, 
                    workoutDuration, 
                    exercisesDuration
                });
                return res.data;
            }
        });   
    return { recordWorkout };
}

export default useRecordWorkout;
