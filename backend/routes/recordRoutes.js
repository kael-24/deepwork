import express from 'express';
const router = express.Router();

import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { recordController } from '../controllers/index.js';

router.use(requireAuth);

// ADD WORKOUT RECORD
router.post('/:workoutId', asyncHandler(recordController.createRecord));

// GET WORKOUT RECORDS
router.get('/workouts/:workoutId', asyncHandler(recordController.getRecords));

// GET WORKOUT RECORD
router.get('/:recordId', asyncHandler(recordController.getRecord));

export default router;