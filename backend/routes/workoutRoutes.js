import express from 'express';
const router = express.Router();

import { workoutsController } from '../controllers/index.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

router.use(requireAuth);

// GET WORKOUTS
router.get('/', asyncHandler(workoutsController.getWorkouts))

// GET WORKOUT
router.get('/:objectId', asyncHandler(workoutsController.getWorkout))

// ADD WORKOUT
router.post('/', asyncHandler(workoutsController.createWorkout))

// // UPDATE WORKOUT
router.patch('/:objectId', asyncHandler(workoutsController.editWorkout))

// DELETE WORKOUT
router.delete('/:objectId', asyncHandler(workoutsController.deleteWorkout))

// ADD WORKOUT RECORD
router.post('/record/:workoutId', asyncHandler(workoutsController.recordWorkout))


export default router;