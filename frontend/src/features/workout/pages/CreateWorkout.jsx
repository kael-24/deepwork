import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import ExerciseCard from "@/features/workout/components/ExerciseCard";
import DnDWrapper from "@/utils/DnDWrapper";

const CreateWorkout = () => {    

    const [workoutName, setWorkoutName] = useState('Untitled');
    const [addWorkoutMenuOpen, setAddWorkoutMenuOpen] = useState(false);
    const [exercises, setExercises] = useState([]);

    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "RestBetweenSets", "Cooldown"];

    const updateExercise = (id, update) => {
        setExercises(prev =>
            prev.map((exercise) => 
                exercise.id === id
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

        arr = {id: uuidv4(), ...arr}

        setExercises(prev => [...prev, arr]);
        setAddWorkoutMenuOpen(false);
    }

    useEffect(() => {
        localStorage.setItem("draftWorkout", JSON.stringify({workoutName, exercises}));
    }, [exercises])

    return(
        <div>
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
            
            <DnDWrapper items={exercises} setItems={setExercises}>
                {exercises.length > 0 ? 
                    (
                        exercises.map((exercise, index) => 
                            <ExerciseCard 
                                key={exercise.id}
                                id={exercise.id} 
                                exercise={exercise} 
                                sequence={index + 1}
                                update={(update) => updateExercise(exercise.id, update)}
                            />
                        )
                    ) : (
                        <h1>No Exercises added</h1>
                    )
                }
            </DnDWrapper>

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
        </div>
    );
}

export default CreateWorkout