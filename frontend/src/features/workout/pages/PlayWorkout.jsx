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
        <div className="flex items-center justify-between mb-10">
            {/** Back Button */}
            <div className="">
                <button
                    className="border border-green-500 rounded-md px-4 py-2 text-green-500"
                    onClick={() => setExitDialogBoxOpen(true)}
                >
                    X
                </button>
            </div>

            {/** Workout Name */}
            <div>
                <div className="font-bold text-2xl ml-23">{workoutName}</div>
            </div>

            <div>
                {/** Lock Button */}
                <button
                    className="border border-green-500 rounded-md px-4 py-2 text-green-500"
                    onClick={setLockIsOn}
                >
                    {lockIsOn ? "UNLOCK" : "LOCK"}
                </button>

                {/** Play/Pause Button */}
                {exercise.timer && (
                    <button
                        className="border border-green-500 rounded-md px-4 py-2 text-green-500"
                        disabled={lockIsOn}
                        onClick={() => setTimerIsRunning(!timerIsRunning)}
                    >
                        {timerIsRunning ? <div>PAUSE</div> : <div>PLAY</div>}
                    </button>
                )}
            </div>

            {exitDialogBoxOpen && (
                <DialogBox // UNFINISHED
                    title="Exit Workout"
                    message="Exiting workout wont save your progress"
                    onSave={() => navigate(`/view-workout/${workoutId}`)}
                    onSaveName="Exit"
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
        <div className="flex flex-col items-center justify-center my-30">
            <div className="text-2xl">{exercise.exerciseType}</div>
            <div className="text-4xl">{exercise.exerciseName}</div>
            {exercise.timer && <div className="text-6xl">{formatMs(elapsedTime)}</div>}
            {exercise.reps && <div className="text-6xl">{exercise.reps}</div>}
            <div className="text-lg">{exerciseOrder.exerciseNumber} / {exerciseOrder.totalExercise}</div>
        </div>
    );
}

const NextExercise = ({ exercise, setPreviousExercise, setNextExercise, exerciseNumber, exerciseLength, lockIsOn, finishWorkout }) => {
    const [finishDialogBoxOpen, setFinishDialogBoxOpen] = useState(false)
    const isLastExercise = exerciseNumber === exerciseLength - 1;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
            <div className="max-w-screen-xl mx-auto">
                {isLastExercise ? (
                    <div className="flex gap-4">
                        <button
                            className="w-1/3 border border-green-500 rounded-md px-4 py-2 text-green-500 hover:bg-green-50 transition-colors"
                            disabled={lockIsOn}
                            onClick={setPreviousExercise}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setFinishDialogBoxOpen(true)}
                            className="w-2/3 bg-green-500 border border-green-500 rounded-md px-4 py-2 text-white hover:bg-green-600 transition-colors"
                        >
                            Finish
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <button
                                onClick={() => setFinishDialogBoxOpen(true)}
                                className="border border-green-500 rounded-md px-4 py-2 text-green-500 hover:bg-green-50 transition-colors w-full sm:w-auto"
                            >
                                Finish
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-24">
                                {exerciseNumber > 0 && (
                                    <button
                                        className="border border-green-500 rounded-md px-4 py-2 text-green-500 hover:bg-green-50 transition-colors w-full"
                                        disabled={lockIsOn}
                                        onClick={setPreviousExercise}
                                    >
                                        Previous
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 text-center px-2">
                                <div>
                                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Up next</div>
                                    <div className="font-semibold text-gray-700">{exercise.exerciseType}</div>
                                    <div className="text-lg font-bold text-gray-900 truncate">{exercise.exerciseName}</div>
                                </div>
                            </div>

                            <div className="w-24">
                                <button
                                    className="border border-green-500 rounded-md px-4 py-2 text-green-500 hover:bg-green-50 transition-colors w-full"
                                    disabled={lockIsOn}
                                    onClick={setNextExercise}
                                >
                                    Next
                                </button>
                            </div>
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
        <div className="pb-64">
            {exercises && exercises.length > 0 && (
                <div>
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
    );
}

export default PlayWorkout;