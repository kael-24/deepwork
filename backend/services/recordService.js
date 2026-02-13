import Record from '../models/recordModel.js';

import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';
import { errorThrower } from '../utils/index.js'

/**
 * Record a workout
 */
export const createRecord = async (userId, workoutId, workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration) => {
    if (!Number.isFinite(workoutDuration))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT);

    if (exercisesDuration.some(ex => !Number.isFinite(ex.duration)))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT);

    const isValidDate = (date) => {
        return !isNaN(new Date(date).getTime());
    }

    if (!isValidDate(workoutDateStarted) || !isValidDate(workoutDateEnded))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT);

    const res = await Record.createRecord(userId, workoutId, workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration);
    return res;
};

