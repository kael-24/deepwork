import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useGetWorkout from "../hooks/useGetWorkout.js";
import { useCreateRecord } from "@/features/record/index.js";
import { DialogBox } from "@/shared/index.js";


const Banner = ({ exercise, timerIsRunning, setTimerIsRunning, workoutName, lockIsOn, setLockIsOn }) => {
    const { workoutId } = useParams();
    const navigate = useNavigate();
    const [exitDialogBoxOpen, setExitDialogBoxOpen] = useState(false);

    return (
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <button
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-50 shrink-0"
                onClick={() => setExitDialogBoxOpen(true)}
                title="Exit Workout"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="font-bold text-xl text-gray-800 tracking-wide truncate px-2 text-center flex-1">
                {workoutName}
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${lockIsOn ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={setLockIsOn}
                >
                    {lockIsOn ? "🔓 Unlock" : "🔒 Lock UI"}
                </button>
                
                {exercise.timer && (
                    <button
                        className={`w-20 py-2 rounded-lg font-bold text-white transition-colors shadow-sm text-sm flex justify-center items-center ${lockIsOn ? "bg-gray-300 cursor-not-allowed" : timerIsRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}`}
                        disabled={lockIsOn}
                        onClick={() => setTimerIsRunning(!timerIsRunning)}
                    >
                        {timerIsRunning ? "⏸ Pause" : "▶ Play"}
                    </button>
                )}
            </div>

            {exitDialogBoxOpen && (
                <DialogBox
                    title="Exit Workout"
                    message="Exiting the workout will not save your progress. Are you sure?"
                    onSave={() => navigate(`/view-workout/${workoutId}`)}
                    onSaveName="Exit Without Saving"
                    onCancel={() => setExitDialogBoxOpen(false)}
                    onCancelName="Cancel"
                />
            )}
        </div>
    );
};

const TimerInterface = ({ exercise, timerIsRunning, setTimerIsRunning, exerciseOrder, setNextExercise }) => {
    const [elapsedTime, setElapsedTime] = useState((exercise.timer || 0) * 1000);

    useEffect(() => {
        if (exercise.timer) {
            let intervalId;

            if (timerIsRunning) {
                const sessionEndTime = Date.now() + elapsedTime;

                intervalId = setInterval(() => {
                    const remainingTime = sessionEndTime - Date.now();

                    if (remainingTime > 0) {
                        setElapsedTime(remainingTime);
                    } else {
                        setElapsedTime(0);
                        setTimerIsRunning(false);
                        clearInterval(intervalId);
                        setNextExercise();
                    }
                }, 100);
            } else {
                clearInterval(intervalId);
            }

            return () => clearInterval(intervalId);
        }
    }, [timerIsRunning]);

    const formatMs = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hour = Math.floor(totalSeconds / 3600);
        const minute = Math.floor((totalSeconds / 60) % 60);
        const second = Math.floor(totalSeconds % 60);

        if (hour > 0)
            return `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
        else if (minute > 0)
            return `${minute}:${second.toString().padStart(2, "0")}`
        else
            return `${second}`
    }
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 w-full">
            <div className="inline-flex text-sm font-semibold px-4 py-1 rounded-full bg-violet-100 text-violet-800 capitalize mb-6 tracking-wide">
                {exercise.exerciseType}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-10 text-center leading-tight">
                {exercise.exerciseName}
            </h2>
            
            <div className="flex items-center justify-center w-64 h-64 md:w-72 md:h-72 rounded-full border-[12px] border-gray-50 shadow-inner bg-white mb-10 relative">
                {exercise.timer && (
                    <div className="text-6xl md:text-7xl font-black text-blue-600 tracking-tighter">
                        {formatMs(elapsedTime)}
                    </div>
                )}
                {exercise.reps && !exercise.timer && (
                    <div className="flex flex-col items-center">
                        <div className="text-7xl md:text-8xl font-black text-rose-500 leading-none">{exercise.reps}</div>
                        <div className="text-lg font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Reps</div>
                    </div>
                )}
            </div>
            
            <div className="text-sm font-bold text-gray-500 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm uppercase tracking-wider">
                Exercise {exerciseOrder.exerciseNumber} of {exerciseOrder.totalExercise}
            </div>
        </div>
    );
}

const NextExercise = ({ exercise, setPreviousExercise, setNextExercise, exerciseNumber, exerciseLength, lockIsOn, finishWorkout }) => {
    const [finishDialogBoxOpen, setFinishDialogBoxOpen] = useState(false)
    const isLastExercise = exerciseNumber === exerciseLength - 1;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-40">
            <div className="max-w-2xl mx-auto">
                {isLastExercise ? (
                    <div className="flex gap-4">
                        <button
                            className="flex-1 font-semibold bg-gray-100 text-gray-700 rounded-xl px-6 py-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            disabled={lockIsOn}
                            onClick={setPreviousExercise}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setFinishDialogBoxOpen(true)}
                            className="flex-[2] bg-green-500 font-bold text-lg text-white rounded-xl px-6 py-4 hover:bg-green-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:bg-green-500"
                            disabled={lockIsOn}
                        >
                            Finish Workout 🏆
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-3">
                            <div className="w-28 shrink-0">
                                {exerciseNumber > 0 ? (
                                    <button
                                        className="w-full font-semibold bg-gray-100 text-gray-700 rounded-xl py-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        disabled={lockIsOn}
                                        onClick={setPreviousExercise}
                                    >
                                        Previous
                                    </button>
                                ) : null}
                            </div>

                            <div className="flex-1 text-center bg-gray-50 rounded-xl py-2 px-3 border border-gray-100 truncate">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">Up Next</span>
                                <span className="text-sm font-bold text-gray-800 truncate block">{exercise.exerciseName}</span>
                            </div>

                            <div className="w-28 shrink-0">
                                <button
                                    className="w-full font-bold bg-green-500 text-white rounded-xl py-3 hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
                                    disabled={lockIsOn}
                                    onClick={setNextExercise}
                                >
                                    Next ➔
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                onClick={() => setFinishDialogBoxOpen(true)}
                                className="text-xs font-bold text-gray-400 hover:text-green-600 transition-colors py-2 uppercase tracking-wide disabled:opacity-50"
                                disabled={lockIsOn}
                            >
                                Finish Workout Early
                            </button>
                        </div>
                    </>
                )}
            </div>
            {finishDialogBoxOpen &&
                <DialogBox
                    title="Finish workout?"
                    onSave={finishWorkout}
                    onSaveName="Save"
                    onCancel={() => setFinishDialogBoxOpen(false)}
                    onCancelName="Cancel"
                />
            }
        </div>
    );
}



const PlayWorkout = () => {
    const { workoutId } = useParams();
    const { data, isLoading } = useGetWorkout(workoutId);

    const [timerIsRunning, setTimerIsRunning] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [exercises, setExercises] = useState(null);
    const [exerciseNumber, setExerciseNumber] = useState(0);
    const [lockIsOn, setLockIsOn] = useState(false);

    // Duration tracking lives in refs — no re-renders needed
    const durationsRef = useRef([]);            // accumulated seconds per exercise (by index)
    const exerciseStartRef = useRef(Date.now()); // when current exercise started
    const workoutStartTime = useRef(Date.now());

    const [errorDialogBoxIsOpen, setErrorDialogBoxIsOpen] = useState(false);

    const navigate = useNavigate();
    const { createRecord } = useCreateRecord();

    useEffect(() => {
        if (data?.workout) {
            setWorkoutName(data.workout.workoutName);
            setExercises(data.workout.exercises);

            // Simple array of zeros, indexed by position
            durationsRef.current = data.workout.exercises.map(() => 0);
            exerciseStartRef.current = Date.now();
        }
    }, [data]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // Standard way to trigger the browser's confirmation dialog
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    console.log(durationsRef)

    // Stamp the current exercise's elapsed time into the ref
    const stampCurrentExercise = () => {
        const elapsed = Math.floor((Date.now() - exerciseStartRef.current) / 1000);
        durationsRef.current[exerciseNumber] += elapsed;
        exerciseStartRef.current = Date.now();
    };

    // Stamp BEFORE switching — no useEffect or prevExerciseId needed
    const goToExercise = (nextIndex) => {
        stampCurrentExercise();
        setExerciseNumber(nextIndex);
    };

    const setNextExercise = () => {
        if (exerciseNumber < exercises.length - 1) {
            goToExercise(exerciseNumber + 1);
        }
    };

    const setPreviousExercise = () => {
        if (exerciseNumber > 0) {
            goToExercise(exerciseNumber - 1);
        }
    };

    const finishWorkout = () => {
        stampCurrentExercise();

        // Build the payload in one clean pass
        const exercisesDuration = exercises.map((ex, i) => ({
            exerciseId: ex._id,
            duration: durationsRef.current[i],
        }));

        createRecord.mutate({
            workoutId,
            workoutDateStarted: new Date(workoutStartTime.current),
            workoutDateEnded: new Date(),
            exercisesDuration,
        }, {
            onSuccess: (data) => navigate(`/result-workout/${data.recordId}`),
            onError: () => setErrorDialogBoxIsOpen(true),
        });
    };

    if (isLoading) return <div>Loading...</div>;


    return (
        <div className="min-h-screen bg-gray-50 pt-6 px-4 pb-64">
            <div className="max-w-2xl mx-auto">
            {exercises && exercises.length > 0 && (
                <div className="animate-fade-in">
                    <Banner
                        exercise={exercises[exerciseNumber]}
                        timerIsRunning={timerIsRunning}
                        setTimerIsRunning={setTimerIsRunning}
                        workoutName={workoutName}
                        lockIsOn={lockIsOn}
                        setLockIsOn={() => setLockIsOn(!lockIsOn)}
                    />

                    <TimerInterface
                        key={exerciseNumber}
                        exercise={exercises[exerciseNumber]}
                        timerIsRunning={timerIsRunning}
                        setTimerIsRunning={(state) => setTimerIsRunning(state)}
                        exerciseOrder={{ exerciseNumber: exerciseNumber + 1, totalExercise: exercises.length }}
                        setNextExercise={() => goToExercise(Math.min(exerciseNumber + 1, exercises.length - 1))}
                    />

                    <NextExercise
                        exercise={exercises[Math.min(exerciseNumber + 1, exercises.length - 1)]}
                        setPreviousExercise={setPreviousExercise}
                        setNextExercise={setNextExercise}
                        exerciseNumber={exerciseNumber}
                        lockIsOn={lockIsOn}
                        exerciseLength={exercises.length}
                        setTimerIsRunning={(state) => setTimerIsRunning(state)}
                        finishWorkout={finishWorkout}
                    />

                    {errorDialogBoxIsOpen &&
                        <DialogBox
                            title="Error saving workout"
                            message="Please try again"
                            onCancel={() => setErrorDialogBoxIsOpen(false)}
                            onCancelName="Cancel"
                        />}
                </div>
            )}
            </div>
        </div>
    );
}

export default PlayWorkout;