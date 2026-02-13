import { workoutService } from '../services/index.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants/index.js';

/**
 * Get all workouts for authenticated user
 */
export const getWorkouts = async (req, res) => {
        const { _id } = req.user;
        const workouts = await workoutService.getAllWorkouts(_id);
        res.status(HTTP_STATUS.OK).json(workouts);
}

/**
 * Get single workout by ID
 */
export const getWorkout = async (req, res) => {
        const { _id } = req.user;
        const { objectId } = req.params;

        const workout = await workoutService.getWorkoutById(_id, objectId);
        res.status(HTTP_STATUS.OK).json({ success: true, workout });
} 

/**
 * Create new workout
 */
export const createWorkout = async (req, res) => { 
        const { _id } = req.user;
        const { workoutName, exercises } = req.body;

        const newWorkout = await workoutService.createNewWorkout(_id, { workoutName, exercises });
        res.status(HTTP_STATUS.CREATED).json(newWorkout);
}

/**
 * Delete workout
 */
export const deleteWorkout = async (req, res) => {
        const { _id } = req.user;
        const { objectId } = req.params; 

        const deletedWorkout = await workoutService.deleteWorkout(_id, objectId);
        res.status(HTTP_STATUS.OK).json(deletedWorkout);
}

/**
 * Update existing workout
 */
export const editWorkout = async (req, res) => {
        const { _id } = req.user;
        const { objectId } = req.params;
        const { workoutName, exercises } = req.body;

        await workoutService.updateWorkout(_id, objectId, { workoutName, exercises });

        res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.WORKOUT_UPDATED,
        });
}

