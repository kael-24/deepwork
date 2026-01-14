import { create } from 'zustand';

export const useWorkoutsStore = create((set) => ({
    // states
    workouts: [],

    getWorkouts: (workouts) => set(() => ({ workouts }))

    // add workouts
    // addWorkout: (workout) => set((state) => ({
    //     workouts: [...state.workouts, workout]
    // })),

    // update workouts
    // updateWorkout
}));

