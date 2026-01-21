// external
import { useMutation } from "@tanstack/react-query";

// internal
import { apiClient } from "@/shared/index";

const useEditWorkout = () => {
    const editWorkout = useMutation({
        mutationFn: async ({ workoutId, workoutName, exercises }) => {
            console.log(workoutId);
            const res = await apiClient.patch(`/api/workouts/${workoutId}`, { workoutName, exercises });
            return res.data;
        },
    });

    return { editWorkout };
}

export default useEditWorkout;