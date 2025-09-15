import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useWorkoutsStore } from "@/store/useWorkoutsStore";

export const useGetWorkouts = () => {
    const { getWorkouts } = useWorkoutsStore();

    return useQuery({
        queryKey: ["workouts"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workouts/`, {
                withCredentials: true,
            });
            getWorkouts(res.data);
            return res.data;
        },
    });
};
