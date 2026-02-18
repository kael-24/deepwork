import { HTTP_STATUS } from '../constants/index.js';
import { recordService } from '../services/index.js';

/**
 * Record workout
 */
export const createRecord = async (req, res) => { 
        const { _id } = req.user;
        const { workoutId } = req.params;
        const { workoutDateStarted, workoutDateEnded, exercisesDuration } = req.body;

        const result = await recordService.createRecord(_id, workoutId, workoutDateStarted, workoutDateEnded, exercisesDuration);

        res.status(HTTP_STATUS.CREATED).json({ recordId: result, success: true, message: "Record created"});
};

/** 
 * Get Workout Records
 */
export const getRecordsByWorkout = async (req, res) => {
    const { _id } = req.user;
    const { workoutId } = req.params;

    const result = await recordService.getRecordsByWorkout(_id, workoutId);
    console.log(result);
    res.status(HTTP_STATUS.OK).json({ success: true, records: result, message: "Workout records fetched"});
};

/**
 * Get Workout Record
 */
export const getRecord = async (req, res) => {
    const { _id } = req.user;
    const { recordId } = req.params;

    const result = await recordService.getRecord(_id, recordId);
    res.status(HTTP_STATUS.OK).json({ success: true, record: result, message: "Record fetched"});
};

/**
 * Get all workout records
 */
export const getAllRecords = async (req, res) => {
    const { _id } = req.user;
    
    const result = await recordService.getAllRecords(_id);
    res.status(HTTP_STATUS.OK).json({ success: true, records: result, message: "All records fetched" });
} 

/**
 * Delete a record
 */
export const deleteRecord = async (req, res) => {
    const { _id } = req.user;
    const { recordId } = req.params;

    await recordService.deleteRecord(_id, recordId);
    res.status(HTTP_STATUS.OK).json({ success: true, message: "Record deleted" });
}
