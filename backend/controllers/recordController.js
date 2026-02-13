import { HTTP_STATUS } from '../constants/index.js';
import { recordService } from '../services/index.js';

/**
 * Record workout
 */
export const createRecord = async (req, res) => { 
        const { _id } = req.user;
        const { workoutId } = req.params;
        const { workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration } = req.body;

        const result = await recordService.createRecord(_id, workoutId, workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration);

        res.status(HTTP_STATUS.CREATED).json({ recordId: result, success: true, message: "Record created"});
};

/** 
 * Get Workout Records
 */
export const getRecords = async (req, res) => {
    const { _id } = req.user;
    const { workoutId } = req.params;

    const result = await recordService.getRecords(_id, workoutId);
    res.status(HTTP_STATUS.OK).json({ success: true, records: result, message: "Records fetched"})
};

