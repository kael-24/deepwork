import express from 'express';
const router = express.Router();
const app = express;

import { requireAuth } from '../middleware/requireAuth.js';
import { getWorkouts, createWorkout, deleteWorkout, editWorkout, getWorkout } from '../controllers/workoutsController.js';

router.use(requireAuth);

// GET WORKOUTS
router.get('/', getWorkouts)

// GET WORKOUT
router.get('/:objectId', getWorkout)

// ADD WORKOUT
router.post('/', createWorkout)

// // UPDATE WORKOUT
router.patch('/:objectId', editWorkout)

// DELETE WORKOUT
router.delete('/:objectId', deleteWorkout)


export default router;