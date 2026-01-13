import Workout from '../models/workoutsModel.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Get all workouts for a user
 */
export const getAllWorkouts = async (userId) => {
    const workouts = await Workout.getWorkouts(userId);
    return workouts;
};

/**
 * Get single workout by ID
 */
export const getWorkoutById = async (userId, workoutId) => {
        const workout = await Workout.getWorkout(userId, workoutId);
        if (!workout) {
            throw new Error(ERROR_MESSAGES.WORKOUT_NOT_FOUND);
        }
        return workout;
};

/**
 * Create a new workout
 */
export const createNewWorkout = async (userId, { workoutName, exercises }) => {
    // Validate workout name
    if (typeof workoutName !== 'string' || workoutName?.trim().length < 2) {
        throw new Error(ERROR_MESSAGES.INVALID_WORKOUT_NAME);
    }

    // Validate exercises
    if (
        !Array.isArray(exercises) ||
        exercises.length === 0 ||
        exercises.every((obj) => Object.keys(obj).length === 0)
    ) {
        throw new Error(ERROR_MESSAGES.INVALID_EXERCISES);
    }

    // Normalize exercise data
    const normalizedExercises = exercises.map(({ exerciseType, timeType, ...rest }) => ({
        ...rest,
        exerciseType: exerciseType.toLowerCase(),
        timeType: timeType.toLowerCase(),
    }));

    const workout = await Workout.createWorkout(userId, workoutName, normalizedExercises);
    return workout;
};

/**
 * Update an existing workout
 */
export const updateWorkout = async (userId, workoutId, { workoutName, exercises }) => {
    if (workoutName && (typeof workoutName !== 'string' || workoutName?.trim().length < 2)) {
        throw new Error(ERROR_MESSAGES.INVALID_WORKOUT_NAME);
    }

    if (exercises && (!Array.isArray(exercises) || exercises.length === 0)) {
        throw new Error(ERROR_MESSAGES.INVALID_EXERCISES);
    }

    const workout = await Workout.editWorkout(userId, workoutId, workoutName, exercises);
    return workout;
};

/**
 * Delete a workout
 */
export const deleteWorkout = async (userId, workoutId) => {
    const result = await Workout.deleteWorkout(userId, workoutId);
    return result;
};
