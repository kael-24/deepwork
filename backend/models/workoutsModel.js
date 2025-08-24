import mongoose, { mongo } from "mongoose";
import User from './userModel.js'

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    exerciseType: {
        type: String,
        enum: ['prepare', 'work', 'rest', 'restBetweenSets', 'cooldown'],
        required: true
    },
    exerciseName: {
        type: String,
        required: true,
        default: 'Untitled'
    },
    timeType: {
        type: String,
        enum: ['timer', 'stopwatch', 'none']
    },
    timer: {
        type: Number,
        required: function () {
            return this.timeType === 'timer';
        }    
    },
    reps: {
        type: Number,
        required: function () { 
            return this.exerciseType === 'work'; 
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

        if (!workouts || workouts.length === 0)
            throw new Error('Cannot find workout');

        return workouts;
    } catch (err) {
        throw new Error(err.message || "Error getting workouts");
    }
}

workoutSchema.statics.createWorkoutModel = async function (userId, workoutName, exercises) {
    console.log("qwewqe", workoutName, exercises);
    try {
        await validateUser(userId);
        const createdWorkout = await this.create({ userId, workoutName, exercises });

        return {
            workoutName: createdWorkout.workoutName,
            exercises: createdWorkout.exercises
        };
    } catch (err) {
        throw new Error(err.message || "Error creating workout");
    }
}



export default mongoose.model('Workout', workoutSchema);
