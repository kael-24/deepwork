import mongoose, { mongo } from "mongoose";
import User from './userModel.js'

import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import errorThrower from "../utils/errorThrower.js";

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    exerciseType: {
        type: String,
        enum: ['Prepare', 'Work', 'Rest', 'RestBetweenSets', 'Cooldown'],
        required: true
    },
    exerciseName: {
        type: String,
        default: "No description"
    },
    timeType: {
        type: String,
        enum: ['Timer', 'Stopwatch', 'None']
    },
    timer: {
        type: Number,
        required: function () {
            return this.timeType === 'Timer';
        }, 
        min: [1, "Timer must be greater than 0"],
        validate: {
            validator: Number.isInteger,
            message: "Timer must be a whole number"
        }
    },
    reps: {
        type: Number,
        min: [1, "Reps must be greater than 0"],
        validate: {
            validator: Number.isInteger,
            message: "Reps must be a whole number"
        }
    }
});

const workoutSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    exercises: [exerciseSchema],
    order: {
        type: Number,
        required: true,
        min: [0, "Timer can never be negative"],
    }
}, { timestamps: true });

const validateUser = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_OBJECT_ID);

    const userExists = await User.findById(id);
    if (!userExists)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
}

workoutSchema.statics.getWorkouts = async function (userId) {
    await validateUser(userId);

    const workouts = await this.find({ userId })
        .select('workoutName exercises order');

    return workouts;
}

workoutSchema.statics.getWorkout = async function (userId, objectId) {
    await validateUser(userId);

    if (!mongoose.Types.ObjectId.isValid(objectId))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_OBJECT_ID);

    const workout = await this.findOne({ _id: objectId, userId })
        .select('workoutName exercises')

    if (!workout)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    return workout;
}

workoutSchema.statics.createWorkout = async function (userId, workoutName, exercises) {
    await validateUser(userId);

    // clear out empty data
    exercises.forEach((exercise) => {
        if (exercise.exerciseType !== "Work" || exercise.reps === 0)
            exercise.reps = undefined;
        if (exercise.timeType !== "Timer")
            exercise.timer = undefined;
    })

    // Order creation
    const lastWorkout = await this
        .findOne({ userId })
        .sort({ order: -1 })
        .select("order");
    const newOrder = lastWorkout ? lastWorkout.order + 100 : 100;

    const createdWorkout = await this.create({ userId, workoutName, exercises, order: newOrder });

    return {
        workoutName: createdWorkout.workoutName,
        exercises: createdWorkout.exercises,
        order: createdWorkout.order
    };
}

workoutSchema.statics.deleteWorkout = async function (userId, objectId) {
    await validateUser(userId);
    if (!mongoose.Types.ObjectId.isValid(objectId))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_OBJECT_ID);

    const deletedWorkout = await this.findOneAndDelete({ userId, _id: objectId });
    if (!deletedWorkout)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    return deletedWorkout;
}

workoutSchema.statics.editWorkout = async function (userId, objectId, workoutName, exercises) {
    validateUser(userId);

    if (!mongoose.Types.ObjectId.isValid(objectId))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_OBJECT_ID);

    const updateFields = {};

    if (workoutName !== undefined)
        updateFields.workoutName = workoutName;

    if (exercises !== undefined)
        updateFields.exercises = exercises;

    if (Object.keys(updateFields).length === 0)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_EXERCISES)

    const result = await this.updateOne({ _id: objectId, userId }, { $set: updateFields }, { runValidators: true });
    if (result.matchedCount === 0)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.WORKOUT_NOT_FOUND);

    return result;
};


export default mongoose.model('Workout', workoutSchema);
