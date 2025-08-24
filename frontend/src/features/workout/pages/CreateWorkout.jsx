import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import ExerciseCard from "@/features/workout/components/ExerciseCard";
import DnDWrapper from "@/utils/DnDWrapper";
import { useSaveWorkout } from "@/features/workout/hooks/useSaveWorkout";
import DialogBox from "@/utils/DialogBox";
import { useNavigate } from 'react-router-dom';

const CreateWorkout = () => {    
    const { 
        saveWorkoutMutation: {
            mutate: saveWorkout,
            isError,
            error,
    }} = useSaveWorkout();

    const navigate = useNavigate();

    const [workoutName, setWorkoutName] = useState('Untitled');
    const [exercises, setExercises] = useState([]);
    const [dialogBoxOpen, setIsDialogBoxOpen] = useState(false);
    const [clientError, setClientError] = useState(null);
    
    const [addExerciseMenuOpen, setAddExerciseMenuOpen] = useState(false);
    const [addExerciseBetween, setAddExerciseBetween] = useState(null);
    
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

    const handleCreateExercise = (option) => {
        let arr = {};
        if (option === "Prepare")
            arr = {type: "Prepare", name: "", timeType: "None", timer: '0', reps: null};
        else if (option === "Work")
            arr = {type: "Work", name: "", timeType: "Timer", timer: '0', reps: 0};
        else if (option === "Rest")
            arr = {type: "Rest", name: "", timeType: "Timer", timer: '0', reps: null};
        else if (option === "RestBetweenSets")
            arr = {type: "RestBetweenSets", name: "", timeType: "Timer", timer: '0', reps: null};
        else if (option === "Cooldown")
            arr = {type: "Cooldown", name: "", timeType: "Timer", timer: '0', reps: 0};

        arr = {id: uuidv4(), ...arr}

        if (addExerciseBetween !== null) 
            setExercises(prev => {
                            const newArr = [...prev];
                            newArr.splice(addExerciseBetween[0] === "before" 
                                ? addExerciseBetween[1] 
                                : addExerciseBetween[1] + 1, 0, arr);
                            return newArr;
                            })
        else 
            setExercises(prev => [...prev, arr]);
        setAddExerciseMenuOpen(false);
    }

    /**
     * ---------------------------------------------------------
     * SAVE WORKOUT
     * ---------------------------------------------------------
     * @returns 
     */
    const handleSaveWorkout = async () => {
        setClientError(null);
        if (!Array.isArray(exercises) || exercises.length === 0) {
            setClientError("Workout Should not be empty");
            setIsDialogBoxOpen(true);
            return;
        }

        const finalExercises = exercises.map(exercise => {
            const rest = { ...exercise }
            delete rest.id;
            return {
                ...rest,
                timer: Number(rest.timer),
                reps: rest.reps !== null ? Number(rest.reps) : rest.reps
            }
        })

        console.log("Description", finalExercises);

        await saveWorkout({ workoutName, exercises: finalExercises }, {
            onSuccess: () => {
                navigate("/");
            },
            onError: () => {
                setIsDialogBoxOpen(true);
            }
        });
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
                                addExercise={(direction) => {
                                    setAddExerciseMenuOpen(true); 
                                    setAddExerciseBetween([direction, index]);
                                }}
                                updateExercise={(update) => updateExercise(exercise.id, update)}
                                deleteExercise={() => setExercises(prev => prev.filter((option) => exercise.id !== option.id))}
                            />
                        )
                    ) : (
                        <h1>No Exercises added</h1>
                    )
                }
            </DnDWrapper>

            <button
                className="border border-black"
                onClick={() => setAddExerciseMenuOpen(!addExerciseMenuOpen)}
            >
                {addExerciseMenuOpen ? 'x' : '+'}
            </button>
            <button 
                className="border border-black"
                onClick={handleSaveWorkout}
            >
                save
            </button>

            {addExerciseMenuOpen && 
                <div>
                    <ul>
                        {exerciseTypeOptions.map((option, index) => 
                            <li key={index} onClick={() => handleCreateExercise(option)}>{option}</li>
                        )}
                    </ul>
                </div>
            }
            {dialogBoxOpen && (clientError || (isError && error)) && 
                <DialogBox 
                    title="Error"
                    message={clientError || error.response?.data?.error || error.message || "Something went wrong"}
                    onCancel={() => setIsDialogBoxOpen(false)}
                />
            }
        </div>
    );
}

export default CreateWorkout