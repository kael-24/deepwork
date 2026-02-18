import express from 'express';
const router = express.Router();

import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { recordController } from '../controllers/index.js';

router.use(requireAuth);

// ADD WORKOUT RECORD
router.post('/:workoutId', asyncHandler(recordController.createRecord));

// GET WORKOUT RECORDS BY WORKOUT
router.get('/workouts/:workoutId', asyncHandler(recordController.getRecordsByWorkout));

// GET WORKOUT RECORD
router.get('/:recordId', asyncHandler(recordController.getRecord));

// GET ALL RECORDS
router.get('/', asyncHandler(recordController.getAllRecords));

export default router;