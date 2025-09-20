import Workout from '../models/workoutsModel.js'

export const getWorkouts = async (req, res) => {
    try {
        const { _id } = req.user;

        const workouts = await Workout.getWorkoutsModel(_id);

        res.status(200).json(workouts);
    } catch (err) {
        res.status(400).json({ error: err.message || "Error getting workouts" });
    }
}

export const createWorkout = async (req, res) => { 
    try {
        const { _id } = req.user;
        const { workoutName, exercises } = req.body;

        // verifies the workoutName
        if (typeof workoutName !== 'string' || workoutName?.trim().length < 2) 
            throw new Error("Invalid workout name. Must be at least 2 characters");
        
        // verifies the exercises
        if ((!Array.isArray(exercises) ||   
        exercises.length === 0) || 
        exercises.every((obj) => Object.keys(obj).length === 0))
        throw new Error("Invalid or empty exercises data");

        const finalExercises = exercises.map(({exerciseType, timeType, ...rest}) => ({
            ...rest,
            exerciseType: exerciseType.toLowerCase(),
            timeType: timeType.toLowerCase()
        }));

        const newWorkout = await Workout.createWorkoutModel(_id, workoutName, finalExercises);
        res.status(200).json(newWorkout);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message || "Error creating workouts" });
    }
}

export const deleteWorkout = async (req, res) => {
    try {
        const { _id } = req.user;
        const { objectId } = req.body; 

        const deletedWorkout = await Workout.deleteWorkoutModel(_id, objectId);
        res.status(200).json(deletedWorkout);
    } catch (err) {
        res.status(400).json({ error: err.message || "Error deleting workout" });
    }
}