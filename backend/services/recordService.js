import Record from '../models/recordModel.js';

import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';
import { errorThrower } from '../utils/index.js'

/**
 * Record a workout
 */
export const createRecord = async (userId, workoutId, workoutDateStarted, workoutDateEnded, exercisesDuration) => {
    if (exercisesDuration.some(ex => !Number.isFinite(ex.duration)))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT);

    const isValidDate = (date) => {
        return !isNaN(new Date(date).getTime());
    }

    if (!isValidDate(workoutDateStarted) || !isValidDate(workoutDateEnded))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT);

    const res = await Record.createRecord(userId, workoutId, workoutDateStarted, workoutDateEnded, exercisesDuration);
    return res;
};

/**
 * Get workout records
 */
export const getRecordsByWorkout = async (userId, workoutId) => {
    const result = await Record.getRecordsByWorkout(userId, workoutId)
    if (!result)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.FAILED_TO_GET_RECORDS);
    return result;
};

/** 
 * Get workout record
 */
export const getRecord = async (userId, recordId) => {
    const result = await Record.getRecord(userId, recordId);
    if (!result)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.FAILED_TO_GET_RECORDS);
    return result;
}

/**
 * 
 * Get all records
 */
export const getAllRecords = async (userId) => {
    const result = await Record.getAllRecords(userId);
    return result;
}

/** 
 * Delete a record
 */
export const deleteRecord = async (userId, recordId) => {
    await Record.deleteRecord(userId, recordId);
}