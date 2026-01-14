import { apiClient } from "@/shared/api/client";
import { useMutation } from "@tanstack/react-query" 

export const useSaveWorkout = () => {

    const saveWorkoutMutation = useMutation({
        mutationFn: async ({ workoutName, exercises }) => {
            const response = await apiClient.post(`/api/workouts/`, {workoutName, exercises});
            return response.data;
        }
    });

    return {
        saveWorkoutMutation
    }
}