import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useGetWorkout from "../hooks/useGetWorkout";
import { DialogBox } from "@/shared/index";

const Banner = ({ exercise, timerIsRunning, setTimerIsRunning, workoutName, lockIsOn, setLockIsOn }) => {
    const { workoutId } = useParams();
    const navigate = useNavigate();
    const [ dialogBoxOpen, setDialogBoxOpen ] = useState(false);

    return (
        <div>
            <div>workoutName:{workoutName}</div>
            <button
                className="px-4 py-2 border-3 border-black bg-blue-500 text-white rounded"
                onClick={() => setDialogBoxOpen(true)}
            >
                X
            </button>
            <button
                className="px-4 py-2 border-3 border-black bg-blue-500 text-white rounded"
                onClick={setLockIsOn}
            >
                {lockIsOn ? "UNLOCK" : "LOCK"}
            </button>
            {exercise.timer && (
                <button
                    className="px-4 py-2 border-3 border-black bg-blue-500 text-white rounded"
                    disabled={lockIsOn}
                    onClick={() => setTimerIsRunning(!timerIsRunning)}
                >
                    {timerIsRunning ? <div>PAUSE</div> : <div>PLAY</div>}
                </button>
            )}
            <div>------------</div>
            {dialogBoxOpen && (
                <DialogBox // UNFINISHED
                    title="Exit Workout"
                    message="Exiting workout wont save your progress"
                    onSave={() => navigate(`/view-workout/${workoutId}`)}
                    onSaveName="Exit"
                    onCancel={() => setDialogBoxOpen(false)}
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
    { console.log("SETTIMERISRUNNING", timerIsRunning) }

    return (
        <div>
            <p>exerciseType:{exercise.exerciseType}</p>
            <p>exerciseName:{exercise.exerciseName}</p>
            {exercise.timer && <p>Timer:{formatMs(elapsedTime)}</p>}
            {exercise.reps && <p>Reps:{exercise.reps}</p>}
            <div>{exerciseOrder.exerciseNumber} / {exerciseOrder.totalExercise}</div>
            <div>-----------------</div>
        </div>
    );
}

const NextExercise = ({ exercise, setPreviousExercise, setNextExercise, exerciseNumber, exerciseLength, lockIsOn }) => {

    return (
        <div>
            {exerciseNumber < exerciseLength - 1 ? (
                <div>
                    <div>Up next</div>
                    <div>{exercise.exerciseType}</div>
                    <div>{exercise.exerciseName}</div>
                </div>
            ) : (
                <button // UNFINISHED
                    // onClick={}
                >
                    Finish
                </button>
            )}
            {exerciseNumber > 0 && (
                <button
                    className="px-4 py-2 border-3 border-black bg-blue-500 text-white rounded"
                    disabled={lockIsOn}
                    onClick={setPreviousExercise}
                >
                    Previous
                </button>
            )}
            {exerciseNumber < exerciseLength - 1 && (
                <button
                    className="px-4 py-2 border-3 border-black bg-blue-500 text-white rounded"
                    disabled={lockIsOn}
                    onClick={setNextExercise}
                >
                    Next
                </button>
            )}
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

    useEffect(() => {
        if (data?.workout) {
            setWorkoutName(data.workout.workoutName);
            setExercises(data.workout.exercises);
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

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
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
                        setNextExercise={() => setExerciseNumber(prev => Math.min(prev + 1, exercises.length - 1))}
                    />

                    <NextExercise
                        exercise={exercises[Math.min(exerciseNumber + 1, exercises.length - 1)]}
                        setPreviousExercise={() => setExerciseNumber(prev => Math.max(prev - 1, 0))}
                        setNextExercise={() => setExerciseNumber(prev => Math.min(prev + 1, exercises.length - 1))}
                        exerciseNumber={exerciseNumber}
                        lockIsOn={lockIsOn}
                        exerciseLength={exercises.length}
                        setTimerIsRunning={(state) => setTimerIsRunning(state)}
                    />
                </div>
            )}
        </div>
    );
}

export default PlayWorkout;