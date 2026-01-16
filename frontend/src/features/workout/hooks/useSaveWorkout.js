// external
import { useMutation } from "@tanstack/react-query" 

// internal
import { apiClient } from "@/shared/index";

const useSaveWorkout = () => {

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

export default useSaveWorkout;
