import { apiClient } from "@/shared/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteWorkout = () => {
    const queryClient = useQueryClient(); // get React Query's cache manager
    
    const deleteWorkoutMutation = useMutation({
        mutationFn: async (objectId) => {
            const response = await apiClient.delete(`/api/workouts/${objectId}`);
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