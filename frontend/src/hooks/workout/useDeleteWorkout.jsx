import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from 'axios';

export const useDeleteWorkout = () => {
    const queryClient = useQueryClient(); // get React Query's cache manager
    
    const deleteWorkoutMutation = useMutation({
        mutationFn: async (objectId) => {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/workouts/${objectId}`, {
                withCredentials: true
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["workouts"]);
        }
    });
    return {
        deleteWorkoutMutation
    }
}