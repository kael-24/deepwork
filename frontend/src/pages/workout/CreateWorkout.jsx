import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import ExerciseCard from "@/components/workout/ExerciseCard";
import DnDWrapper from "@/utils/DnDWrapper";
import DialogBox from "@/utils/DialogBox";
import { useSaveWorkout } from "@/hooks/workout/useSaveWorkout";
import { useNavigate } from 'react-router-dom';

const CreateWorkout = () => {    
    const { 
        saveWorkoutMutation: {
            mutate: saveWorkout,
            isError,
            error,
    }} = useSaveWorkout();

    const navigate = useNavigate();

    const [workoutName, setWorkoutName] = useState("");
    const [exercises, setExercises] = useState([]);
    const [dialogBoxOpen, setIsDialogBoxOpen] = useState(false);
    const [clientError, setClientError] = useState(null);
    
    const [addExerciseMenuOpen, setAddExerciseMenuOpen] = useState(false);
    const [addExerciseBetween, setAddExerciseBetween] = useState(null);
    
    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "RestBetweenSets", "Cooldown"];
    const defaultExercises = [
        {id: uuidv4(), exerciseType: "Prepare", exerciseName: "Prepare yourself", timeType: "Timer", timer: '60', reps: 0},
        {id: uuidv4(), exerciseType: "Work", exerciseName: "Here lies the workout", timeType: "Timer", timer: '120', reps: 12},
        {id: uuidv4(), exerciseType: "Cooldown", exerciseName: "Stretch yourself", timeType: "Timer", timer: '180', reps: 0}
    ]

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
            arr = {exerciseType: "Prepare", exerciseName: "", timeType: "None", timer: '', reps: 0};
        else if (option === "Work")
            arr = {exerciseType: "Work", exerciseName: "", timeType: "Timer", timer: '', reps: 0};
        else if (option === "Rest")
            arr = {exerciseType: "Rest", exerciseName: "", timeType: "Timer", timer: '', reps: 0};
        else if (option === "RestBetweenSets")
            arr = {exerciseType: "RestBetweenSets", exerciseName: "", timeType: "Timer", timer: '', reps: 0};
        else if (option === "Cooldown")
            arr = {exerciseType: "Cooldown", exerciseName: "", timeType: "Timer", timer: '', reps: 0};

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
        console.log("WORKOUTS", exercises);
        setClientError(null);
        if (!Array.isArray(exercises) || exercises.length === 0) {
            setClientError("Workout Should not be empty");
            setIsDialogBoxOpen(true);
            return;
        }

        const hasEmptyTimer = exercises.some(ex => ex.timeType === 'Timer' && (ex.timer === '' || ex.timer === "0" || ex.timer === null))
        if (hasEmptyTimer) {
            setClientError("Timer cannot be 0. You can set it to none if you do not want a timer")
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

        await saveWorkout({ workoutName, exercises: finalExercises }, {
            onSuccess: () => {
                navigate("/");
            },
            onError: () => {
                setIsDialogBoxOpen(true);
            }
        });
    }
    
    // recovers snapshot from local storage
    useEffect(() => {
        const draftWorkout = JSON.parse(localStorage.getItem("draftWorkout"));

        if (!draftWorkout || Object.keys(draftWorkout).length === 0) {
            localStorage.setItem("draftWorkout", JSON.stringify({workoutName, defaultExercises}));
        } 
        setWorkoutName(draftWorkout.workoutName);
        setExercises(draftWorkout.exercises);
    }, []);

    // reflects changes to the local storage
    useEffect(() => {
        if (exercises.length !== 0)
            localStorage.setItem("draftWorkout", JSON.stringify({workoutName, exercises}));
    }, [workoutName, exercises, defaultExercises]);


    return(
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Create Your Workout 💪
                    </h1>
                    <p className="text-lg text-gray-600">
                        Design the perfect workout routine for your fitness goals
                    </p>
                </div>

                {/* Workout Name Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workout Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg">🏋️</span>
                        </div>
                        <input
                            type="text"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-lg"
                            placeholder="Enter your workout name"
                        />
                    </div>
                </div>
                
                {/* Exercises Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Exercises</h2>
                    </div>

                    {/* Exercise List */}
                    <DnDWrapper items={exercises} setItems={setExercises} type="vertical">
                        {exercises.length > 0 ? (
                            <div className="space-y-3">
                                {exercises.map((exercise, index) => (
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
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises added yet</h3>
                                <p className="text-gray-500 mb-4">Start building your workout by adding exercises below</p>
                            </div>
                        )}
                    </DnDWrapper>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="flex-1 sm:flex-none px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 shadow-md hover:shadow-lg"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>
                    <button 
                        className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={handleSaveWorkout}
                        disabled={exercises.length === 0}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Workout
                    </button>
                </div>

                {/* Error Dialog */}
                {dialogBoxOpen && (clientError || (isError && error)) && 
                    <DialogBox 
                        title="Error"
                        message={clientError || error.response?.data?.error || error.message || "Something went wrong"}
                        onCancel={() => setIsDialogBoxOpen(false)}
                    />
                }
            </div>

            {/* Floating Add Exercise Button - Bottom Right */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Exercise Type Options Menu - Above the button */}
                {addExerciseMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-3 p-3 bg-white rounded-xl shadow-lg border border-gray-200 min-w-[200px]">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">Choose exercise type:</h3>
                        <div className="space-y-2">
                            {exerciseTypeOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCreateExercise(option)}
                                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-left"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Plus Button */}
                <button
                    className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                    onClick={() => setAddExerciseMenuOpen(!addExerciseMenuOpen)}
                    title="Add exercise"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default CreateWorkout;