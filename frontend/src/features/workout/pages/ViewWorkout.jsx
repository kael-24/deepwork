import { useEffect, useState } from 'react';
import useGetWorkout from '../hooks/useGetWorkout'
import { Link, useParams, useNavigate } from 'react-router-dom';

import { DialogBox } from '@/shared/index';
import useDeleteWorkout from '../hooks/useDeleteWorkout';

const ViewWorkoutCard = ({ ex }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 m-0">{ex.exerciseName}</h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{ex.exerciseType}</p>
                </div>
                <div className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-800 capitalize">
                    {ex.timeType}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {ex.timer && (
                    <div className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        ⏱️ {ex.timer} seconds
                    </div>
                )}
                {ex.reps && (
                    <div className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                        🔄 {ex.reps} reps
                    </div>
                )}
            </div>
        </div>
    )
}

const ViewWorkout = () => {
    const navigate = useNavigate();

    const { workoutId } = useParams();
    const { data } = useGetWorkout(workoutId);

    const [openDialogBox, setOpenDialogBox] = useState(false);
    const { deleteWorkoutMutation } = useDeleteWorkout();

    const [workoutName, setWorkoutName] = useState("");
    const [exercises, setExercises] = useState(null);

    useEffect(() => {
        if (data?.workout?.exercises && data?.workout?.workoutName) {
            setExercises(data.workout.exercises);
            setWorkoutName(data.workout.workoutName);
        }
    }, [data]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <Link
                    to="/"
                    className="text-gray-500 hover:text-gray-900 flex items-center font-medium transition-colors"
                >
                    ← Back
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        to={`/edit-workout/${workoutId}`}
                        state={{ from: `/view-workout/${workoutId}` }}
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => setOpenDialogBox(true)}
                        className="text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                    <Link
                        className="ml-2 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        to={`/play-workout/${workoutId}`}
                        state={{ from: `/view-workout/${workoutId}` }}
                    >
                        ▶ Play
                    </Link>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-6 text-gray-900">{workoutName || "Loading..."}</h1>
            
            <div className="flex flex-col gap-4">
                {exercises?.length > 0 ? (
                    exercises.map((ex, index) => <ViewWorkoutCard key={index} ex={ex} />)
                ) : (
                    <div className="text-center p-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        No exercises found for this workout.
                    </div>
                )}
            </div>

            {openDialogBox && (
                <DialogBox
                    title="Delete Workout"
                    message="Are you sure you want to delete this workout? This action cannot be undone."
                    onSave={() => deleteWorkoutMutation.mutate(workoutId, {
                        onSuccess: () => {
                            navigate('/');
                        }
                    })}
                    onSaveName="Delete"
                    onCancel={() => setOpenDialogBox(false)}
                    onCancelName="Cancel"
                />
            )}
        </div>
    );
};

export default ViewWorkout;