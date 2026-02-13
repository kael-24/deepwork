import mongoose from "mongoose";

import User from './userModel.js';
import Workout from './workoutsModel.js';
import { errorThrower } from "../utils/index.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants/index.js";

const Schema = mongoose.Schema;

const exercisesDurationSchema = new Schema({
    exerciseId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    duration: {
        type: Number,
        required: true
    } 
})
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
    workoutDateStarted: {
        type: Date,
        required: true,
    },
    workoutDateEnded: {
        type: Date,
        required: true
    },
    workoutDuration: {
        type: Number,
        required: true
    },
    exercisesDuration: [exercisesDurationSchema]
}, { timestamps: true });


recordSchema.statics.createRecord = async function (userId, workoutId, workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration) {
    if (!mongoose.Types.ObjectId.isValid(workoutId) || !mongoose.Types.ObjectId.isValid(userId))
        errorThrower(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);

    const workoutExists = await Workout.findById(workoutId);
    if (!workoutExists)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    const res = await this.create({userId, workoutId, workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration});

    return res._id;
};

recordSchema.statics.getRecords = async function (userId, workoutId) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(workoutId))
        errorThrower(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const userExists = await User.findById(userId);
    if (!userExists)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);

    const workoutExists = await Workout.findById(workoutId);
    if (!workoutExists)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    const res = await this.find({ workoutId }).select('-userId -__v -createdAt -updatedAt');
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

export default mongoose.model('Record', recordSchema);