import { apiClient } from "@/shared/api/client";
import { useQuery } from "@tanstack/react-query";
import { useWorkoutsStore } from "@/features/workout/store/useWorkoutsStore";

export const useGetWorkouts = () => {
    const { getWorkouts } = useWorkoutsStore();

    return useQuery({
        queryKey: ["workouts"],
        queryFn: async () => {
            const res = await apiClient.get(`/api/workouts/`);
            getWorkouts(res.data);
            return res.data;
        },
    });
};
