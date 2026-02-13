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


recordSchema.statics.recordWorkout = async function (userId, workoutId, workoutDateStarted, workoutDateEnded, workoutDuration, exercisesDuration) {
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
}

export default mongoose.model('Record', recordSchema);