import express from 'express';
const router = express.Router();
const app = express;

import { requireAuth } from '../middleware/requireAuth.js';
import { workoutsController } from '../controllers/index.js';
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


export default router;