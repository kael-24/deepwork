import express from 'express';
const router = express.Router();
const app = express;

import { requireAuth } from '../middleware/requireAuth.js';
import { getWorkouts, createWorkout, deleteWorkout, editWorkout, getWorkout } from '../controllers/workoutsController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

router.use(requireAuth);

// GET WORKOUTS
router.get('/', asyncHandler(getWorkouts))

// GET WORKOUT
router.get('/:objectId', asyncHandler(getWorkout))

// ADD WORKOUT
router.post('/', asyncHandler(createWorkout))

// // UPDATE WORKOUT
router.patch('/:objectId', asyncHandler(editWorkout))

// DELETE WORKOUT
router.delete('/:objectId', asyncHandler(deleteWorkout))


export default router;