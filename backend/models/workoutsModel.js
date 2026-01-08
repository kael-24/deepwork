import mongoose, { mongo } from "mongoose";
import User from './userModel.js'

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    exerciseType: {
        type: String,
        enum: ['prepare', 'work', 'rest', 'restbetweensets', 'cooldown'],
        required: true
    },
    exerciseName: {
        type: String,
        default: "No description"
    },
    timeType: {
        type: String,
        enum: ['timer', 'stopwatch', 'none']
    },
    timer: {
        type: Number,
        required: function () {
            return this.timeType === 'timer';
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
        throw new Error('Object ID is not valid');

    const userExists = await User.findById(id);
    if (!userExists)
        throw new Error('User does not exists');
}

workoutSchema.statics.getWorkouts = async function (userId) {
    try {
        await validateUser(userId);

        const workouts = await this.find({ userId })
            .select('workoutName exercises');

        return workouts;
    } catch (err) {
        throw new Error(err.message || "Error getting workouts");
    }
}

workoutSchema.statics.getWorkout = async function (userId, objectId) {
    try {
        await validateUser(userId);
    
        if (!mongoose.Types.ObjectId.isValid(objectId))
            throw new Error("ObjectId is invalid");
    
        const workout = await this.findOne({ _id: objectId, userId })
            .select('workoutName exercises')
    
        if (!workout) 
            throw new Error("Workout is not found");

        return workout;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

workoutSchema.statics.createWorkout = async function (userId, workoutName, exercises) {
    try {
        await validateUser(userId);

        // clear out empty data
        exercises.map((exercise) => {
            if (exercise.exerciseType !== "work" || exercise.reps === 0)
                exercise.reps = undefined;
            if (exercise.timeType !== "timer")
                exercise.timer = undefined;
        })

        // Order creation
        const lastWorkout = await this
            .findOne({ userId })
            .sort({ order: -1 })
            .select("order");
        console.log("asdsad", lastWorkout);
        const newOrder = lastWorkout ? lastWorkout.order + 100 : 100;

        const createdWorkout = await this.create({ userId, workoutName, exercises, order: newOrder });

        return {
            workoutName: createdWorkout.workoutName,
            exercises: createdWorkout.exercises,
            order: createdWorkout.order
        };
    } catch (err) {
        throw new Error(err.message || "Error creating workout");
    }
}

workoutSchema.statics.deleteWorkout = async function (userId, objectId) {
    try {
        await validateUser(userId);
        if (!mongoose.Types.ObjectId.isValid(objectId))
            throw new Error("Workout Id is invalid");
    
        const deletedWorkout = await this.findOneAndDelete({ userId, _id: objectId });
        if (!deletedWorkout)
            throw new Error("Workout not found");

        return deletedWorkout;
    } catch (err) {
        throw new Error(err.message || "Error deleting workout");
    }
}

workoutSchema.statics.editWorkout = async function (userId, objectId, workoutName, exercises) {
    try {
        validateUser(userId);

        if (!mongoose.Types.ObjectId.isValid(objectId)) 
            throw new Error("Workout ID is invalid");

        const updateFields = {};

        if (workoutName !== undefined)
            updateFields.workoutName = workoutName;

        if (exercises !== undefined) 
            updateFields.exercises = exercises;

        if (Object.keys(updateFields).length === 0) return;

        const result = await this.updateOne({ _id: objectId, userId }, { $set: updateFields }, {runValidators: true});
        
        return result;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}


export default mongoose.model('Workout', workoutSchema);
