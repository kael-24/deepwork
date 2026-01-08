import Workout from '../models/workoutsModel.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

/**
 * Get all workouts for a user
 */
export const getAllWorkouts = async (userId) => {
    try {
        const workouts = await Workout.getWorkouts(userId);
        return workouts;
    } catch (err) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_GET_WORKOUTS);
    }
};

/**
 * Get single workout by ID
 */
export const getWorkoutById = async (userId, workoutId) => {
    try {
        const workout = await Workout.getWorkout(userId, workoutId);
        if (!workout) {
            throw new Error(ERROR_MESSAGES.WORKOUT_NOT_FOUND);
        }
        return workout;
    } catch (err) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_GET_WORKOUT);
    }
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

    try {
        const workout = await Workout.createWorkout(userId, workoutName, normalizedExercises);
        return workout;
    } catch (err) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_CREATE_WORKOUT);
    }
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

    try {
        const workout = await Workout.updateWorkout(userId, workoutId, workoutName, exercises);
        return workout;
    } catch (err) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_WORKOUT);
    }
};

/**
 * Delete a workout
 */
export const deleteWorkout = async (userId, workoutId) => {
    try {
        const result = await Workout.deleteWorkout(userId, workoutId);
        return result;
    } catch (err) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_DELETE_WORKOUT);
    }
};
