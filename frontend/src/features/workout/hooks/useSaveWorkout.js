import { useMutation } from "@tanstack/react-query" 
import axios from "axios"

export const useSaveWorkout = () => {

    const saveWorkoutMutation = useMutation({
        mutationFn: async ({ workoutName, exercises }) => {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/workouts/`, {workoutName, exercises}, {
                withCredentials: true
            });
            return response.data;
        }
    });

    return {
        saveWorkoutMutation
    }
}