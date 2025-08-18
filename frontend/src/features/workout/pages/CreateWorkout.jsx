import { useEffect, useState } from "react";
import ExerciseCard from "../components/exerciseCard";

const CreateWorkout = () => {    

    const [workoutName, setWorkoutName] = useState('Untitled');
    const [addWorkoutMenuOpen, setAddWorkoutMenuOpen] = useState(false);
    const [exercises, setExercises] = useState([]);

    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "RestBetweenSets", "Cooldown"];

    const updateExercise = (sequence, update) => {
        console.log("sequence", sequence);
        setExercises(prev =>
            prev.map((exercise) => 
                exercise.sequence === sequence
                    ? { ...exercise, ...update }
                    : exercise
            )
        )
    };

    console.log("exercises", exercises);
    const handleCreateExercise = (option) => {
        let arr = {};
        if (option === "Prepare")
            arr = {type: "Prepare", name: "", timeType: "None", timer: '0000', reps: null};
        else if (option === "Work")
            arr = {type: "Work", name: "", timeType: "Timer", timer: '0000', reps: 0};
        else if (option === "Rest")
            arr = {type: "Rest", name: "", timeType: "Timer", timer: '0000', reps: null};
        else if (option === "RestBetweenSets")
            arr = {type: "RestBetweenSets", name: "", timeType: "Timer", timer: '0000', reps: null};
        else if (option === "Cooldown")
            arr = {type: "Cooldown", name: "", timeType: "Timer", timer: '0000', reps: 0};

        arr = {sequence: exercises.length + 1, ...arr}

        setExercises(prev => [...prev, arr]);
        setAddWorkoutMenuOpen(false);
    }

    useEffect(() => {
        localStorage.setItem("draftWorkout", JSON.stringify({workoutName, exercises}));
    }, [exercises])

    return(
        <>
            <h1 className="mb-6 mt-6">Create Workout</h1><hr/>
            <div className="mb-6 mt-6">
                <label>Workout Name:</label>
                <input
                    type="String"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="border border-black"
                />
            </div><hr />

            {exercises.length > 0 ? 
                (
                    exercises.map((exercise, index) => 
                        <ExerciseCard 
                            key={index} 
                            exercise={exercise} 
                            sequence={index + 1}
                            update={(sequence, update) => updateExercise(sequence, update)}
                        />
                    )
                ) : (
                    <h1>No Exercises added</h1>
                )
            }

            <button
                className="border border-black"
                onClick={() => setAddWorkoutMenuOpen(!addWorkoutMenuOpen)}
            >
                {addWorkoutMenuOpen ? 'x' : '+'}
            </button>
            {addWorkoutMenuOpen && 
                <div>
                    <ul>
                        {exerciseTypeOptions.map((option, index) => 
                            <li key={index} onClick={() => handleCreateExercise(option)}>{option}</li>
                        )}
                    </ul>
                </div>
            }
        </>
    );
}

export default CreateWorkout