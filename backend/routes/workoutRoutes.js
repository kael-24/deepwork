import express from 'express';
const router = express.Router();
const app = express;

import { requireAuth } from '../middleware/requireAuth.js';
import { getWorkouts, createWorkout, deleteWorkout } from '../controllers/workoutsController.js';

router.use(requireAuth);

// GET WORKOUTS
router.get('/', getWorkouts)

// ADD WORKOUT
router.post('/', createWorkout)

// // UPDATE WORKOUT
// router.patch('/', updateWorkout)

// DELETE WORKOUT
router.delete('/:objectId', deleteWorkout)


export default router;