import mongoose from "mongoose";

import User from './userModel.js';
import Workout, { exerciseSchema } from './workoutsModel.js';
import { errorThrower } from "../utils/index.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants/index.js";

const Schema = mongoose.Schema;

const recordExerciseSchema = exerciseSchema.clone().add({
    duration: {
        type: Number,
        required: true,
        default: 0
    }
});

const recordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    workoutId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    workoutName: {
        type: String,
        required: true
    },
    exercises: [recordExerciseSchema],
    workoutDateStarted: {
        type: Date,
        required: true,
    },
    workoutDateEnded: {
        type: Date,
        required: true
    },
}, { timestamps: true });


recordSchema.statics.createRecord = async function (userId, workoutId, workoutDateStarted, workoutDateEnded, exercisesDuration) {
    if (!mongoose.Types.ObjectId.isValid(workoutId) || !mongoose.Types.ObjectId.isValid(userId))
        errorThrower(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);

    const workout = await Workout.findById(workoutId);
    if (!workout)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    if (workout.exercises.length !== exercisesDuration.length)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT);

    const mergedExercise = workout.exercises.map((ex, index) => ({
        ...ex.toObject(),
        duration: exercisesDuration[index].duration
    }))

    const res = await this.create({ userId, workoutId, workoutName: workout.workoutName, exercises: mergedExercise, workoutDateStarted, workoutDateEnded });

    return res._id;
};

recordSchema.statics.getRecordsByWorkout = async function (userId, workoutId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(workoutId))
        errorThrower(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);

    const workoutExists = await Workout.findById(workoutId);
    if (!workoutExists)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    const res = await this.find({ userId, workoutId }).select('-userId -__v -createdAt -updatedAt');
    return res;
};

recordSchema.statics.getRecord = async function (userId, recordId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(recordId))
        errorThrower(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);

    const result = await this.findById(recordId).select('-userId -__v -createdAt -updatedAt');
    if (!result)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.FAILED_TO_GET_RECORDS);

    return result;
};

recordSchema.statics.getAllRecords = async function (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId))
        errorThrower(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const result = await this.find({ userId });
    if (result.length === 0)
        errorThrower(HTTP_STATUS.NO_CONTENT, ERROR_MESSAGES.FAILED_TO_GET_RECORDS);

    return result;
}

recordSchema.statics.deleteRecord = async function (userId, recordId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(recordId))
        errorThrower(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const result = await this.findOneAndDelete({ userId, _id: recordId });
    if (!result)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.FAILED_TO_GET_RECORDS);
}

export default mongoose.model('Record', recordSchema);