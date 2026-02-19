import { useParams, Link } from "react-router-dom";

import useGetRecord from '../hooks/useGetRecord';

const ResultWorkout = () => {
    const { recordId } = useParams();
    const { data, isLoading, isError, error } = useGetRecord(recordId);

    if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading workout details...</div>;
    if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

    const record = data?.record || {};
    const { workoutName = "Untitled Workout", workoutDateStarted, workoutDateEnded } = record;
    const exercises = record.exercises || [];

    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : "";
    const formatTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : "--:--";

    const startWorkoutDate = formatDate(workoutDateStarted);
    const startWorkoutTime = formatTime(workoutDateStarted);
    const endWorkoutTime = formatTime(workoutDateEnded);

    const workoutDuration = (workoutDateStarted && workoutDateEnded)
        ? Math.floor((new Date(workoutDateEnded) - new Date(workoutDateStarted)) / 1000)
        : 0;

    /* Helper function to format seconds */
    const formatDuration = (totalSeconds) => {
        if (!totalSeconds) return "00:00:00";
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        console.log(totalSeconds)
        return [hours, minutes, seconds].map(val => String(val).padStart(2, '0')).join(':');
    };
    console.log(data?.record);


    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-8">
                <Link to='/view-records' className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors">
                    &larr; Back to History
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{workoutName}</h1>
                    <div className="text-gray-500 font-medium">{startWorkoutDate}</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-8">
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Start Time</div>
                        <div className="text-lg font-medium text-gray-900">{startWorkoutTime}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">End Time</div>
                        <div className="text-lg font-medium text-gray-900">{endWorkoutTime}</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</div>
                        <div className="text-lg font-bold text-green-600">{formatDuration(workoutDuration)}</div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Workout Summary</h2>
            <div className="space-y-4">

                {exercises.length > 0 ? exercises.map((ex, index) => (
                    <div key={ex._id || index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{ex.exerciseName}</h3>
                                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-1">{ex.exerciseType}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-8">
                            {ex.timeType === 'Timer' && (
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Timer</span>
                                    <span className="text-2xl font-bold text-gray-900">{ex.timer}<span className="text-sm font-normal text-gray-500 ml-1">s</span></span>
                                </div>
                            )}
                            {ex.reps && (
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Reps</span>
                                    <span className="text-2xl font-bold text-gray-900">{ex.reps}</span>
                                </div>
                            )}
                            <div>
                                <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Duration</span>
                                <span className="text-2xl font-bold text-green-600">{formatDuration(ex.duration)}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No exercises recorded for this workout.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultWorkout;

