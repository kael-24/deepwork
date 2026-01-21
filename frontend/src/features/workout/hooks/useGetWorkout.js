// external
import { useQuery } from "@tanstack/react-query";

// internal
import { apiClient } from "@/shared/index";

const useGetWorkout = (workoutId) => {
    return useQuery({
        queryKey: ["workout", workoutId],
        queryFn: async () => {
            if (!workoutId) return null;
            const res = await apiClient.get(`/api/workouts/${workoutId}`);
            return res.data;
        },
        enabled: !!workoutId // disabled if no workoutId
    });
}

export default useGetWorkout;
