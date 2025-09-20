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
        min: [1, "Timer must be greater than 0"],
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

workoutSchema.statics.getWorkoutsModel = async function (userId) {
    try {
        await validateUser(userId);

        const workouts = await this.find({ userId })
            .select('workoutName exercises -_id');

        return workouts;
    } catch (err) {
        throw new Error(err.message || "Error getting workouts");
    }
}

workoutSchema.statics.createWorkoutModel = async function (userId, workoutName, exercises) {
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

workoutSchema.statics.deleteWorkoutModel = async function (userId, objectId) {
    try {
        validateUser(userId);
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


export default mongoose.model('Workout', workoutSchema);
