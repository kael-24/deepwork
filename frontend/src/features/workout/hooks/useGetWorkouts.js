// internal
import { useQuery } from "@tanstack/react-query";

// external
import { apiClient } from "@/shared/index";

const useGetWorkouts = () => {
    return useQuery({
        queryKey: ["workouts"],
        queryFn: async () => {
            const res = await apiClient.get(`/api/workouts/`);
            return res.data;
        },
    });
};

export default useGetWorkouts;
