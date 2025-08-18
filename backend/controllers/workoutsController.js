import Workout from '../models/workoutsModel.js'

export const getWorkouts = async (req, res) => {
    try {
        const { _id } = req.user;

        const workouts = await Workout.getWorkoutsModel(_id);

        res.status(200).json(workouts);
    } catch (err) {
        res.status(400).json({ error: err.message || "Error creating workouts" });
    }
}

export const createWorkout = async (req, res) => { 
    try {
        const { _id } = req.user;
        const { workoutName, exercises } = req.body;

        if (typeof workoutName !== 'string' || workoutName?.trim().length < 2)
            throw new Error("Invalid workout name");

        if (!Array.isArray(exercises) || (exercises.length === 0))
            throw new Error("Invalid or empty exercises data");

        const newWorkout = await Workout.createWorkoutModel(_id, workoutName, exercises);

        res.status(200).json(newWorkout);
    } catch (err) {
        res.status(400).json({ error: err.message || "Error creating workouts" });
    }
}