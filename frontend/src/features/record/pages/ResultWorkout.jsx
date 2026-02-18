import { useParams, Link } from "react-router-dom";

import useGetRecord from '../hooks/useGetRecord';
import { useEffect } from "react";

const ResultWorkout = () => {
    const { recordId } = useParams();
    const { data } = useGetRecord(recordId);

    const workoutName = data?.record?.workoutName || "";
    const startWorkoutDate = new Date(data?.record?.workoutDateStarted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || "";
    const startWorkoutTime = new Date(data?.record?.workoutDateStarted).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) || "";
    const endWorkoutTime = new Date(data?.record?.workoutDateEnded).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) || "";
    const workoutDuration = Math.floor((new Date(data?.record?.workoutDateEnded) - new Date(data?.record?.workoutDateStarted)) / 1000) | "";
    const exercises = data?.record?.exercises || null;

    /* Helper function to format seconds */
    const formatDuration = (totalSeconds) => {
        if (!totalSeconds) return "00:00:00";

        // Calculate hours, minutes, and remaining seconds
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Pad with leading zeros (e.g., "5" -> "05") and join with colon
        return [hours, minutes, seconds]
            .map(val => String(val).padStart(2, '0'))
            .join(':');
    };

    useEffect(() => {
        if (data?.record) {
            console.log(data.record)
        }
    }, [data])

    return (
        <div>
            <Link to='/'>Home</Link>
            <div className="font-bold text-xl">{workoutName}</div>
            <div>{startWorkoutDate}</div>
            <div>{startWorkoutTime} - {endWorkoutTime}</div>
            <div>{formatDuration(workoutDuration)}</div>
            {exercises && exercises.map((ex) =>
                <div key={ex._id} className="py-6 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-baseline mb-2">
                        <div className="text-xl font-bold text-gray-900">{ex.exerciseName}</div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{ex.exerciseType}</div>
                    </div>

                    <div className="flex gap-8 mt-2">
                        {ex.timeType === 'Timer' && (
                            <div>
                                <span className="text-xs text-gray-400 font-medium uppercase mr-2">Timer</span>
                                <span className="text-xl font-bold text-green-500">{ex.timer}s</span>
                            </div>
                        )}
                        {ex.reps && (
                            <div>
                                <span className="text-xs text-gray-400 font-medium uppercase mr-2">Reps</span>
                                <span className="text-xl font-bold text-green-500">{ex.reps}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-xs text-gray-400 font-medium uppercase mr-2">Duration</span>
                            <span className="text-xl font-bold text-green-500">{formatDuration(ex.duration)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResultWorkout;

