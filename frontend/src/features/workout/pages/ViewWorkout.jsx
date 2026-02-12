import { useEffect, useState } from 'react';
import useGetWorkout from '../hooks/useGetWorkout'
import { Link, useParams, useNavigate } from 'react-router-dom';

import { DialogBox } from '@/shared/index';
import useDeleteWorkout from '../hooks/useDeleteWorkout';

const ViewWorkoutCard = ({ ex }) => {
    return (
        <div className='border border-black rounded-md p-3 mb-3'>
            {/** Exercise Name */}
            <div className='font-bold'>
                {ex.exerciseName}
            </div>

            {/** Exercise Type */}
            <div>
                {ex.exerciseType}
            </div>

            {/** Timer Type */}
            <div className='border border-violet-500 rounded-md p-1 text-violet-500 my-1 w-fit'>
                {ex.timeType}
            </div>

            <div className='flex gap-2'>
                {/** Time in seconds */}
                {ex.timer && 
                <div className='border border-blue-500 rounded-md p-1 text-blue-500 my-1 w-fit'>
                    Time: {ex.timer} seconds
                </div>}

                {/** Reps */}
                {ex.reps && 
                <div className='border border-red-500 rounded-md p-1 text-red-500 my-1 w-fit'>
                    Reps: {ex.reps}
                </div>}
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

    // console.log("exercises", data?.workout);

    useEffect(() => {
        if (data?.workout?.exercises && data?.workout?.workoutName) {
            setExercises(data.workout.exercises);
            setWorkoutName(data.workout.workoutName);
        }
    }, [data]);

    return (
        <div>
            <div className='flex justify-between items-center w-full mb-4'>
                <Link
                    to='/'
                    className='text-black border border-black rounded-md px-2 py-1'
                >
                    BACK
                </Link>
                <div className='flex gap-2'>
                    <Link
                        className='border border-green-500 rounded-md text-green-500 p-2'
                        to={`/play-workout/${workoutId}`}
                        state={{ from: `/view-workout/${workoutId}` }}
                    >
                        ▶️
                    </Link>
                    <Link
                        className='text-black border border-black rounded-md px-2 py-2'
                        to={`/edit-workout/${workoutId}`}
                        state={{ from: `/view-workout/${workoutId}` }}
                    >
                        ⚙️
                    </Link>
                    <button
                        onClick={() => setOpenDialogBox(true)}
                        className='text-black border border-black rounded-md px-2 py-1'
                    >
                        🗑️
                    </button>
                </div>
            </div>
            <p className='text-xl font-bold mb-4'>{workoutName}</p>
            {exercises?.map((ex, index) => <ViewWorkoutCard key={index} ex={ex} />)}
            {openDialogBox && (
                <DialogBox
                    title="Delete the workout"
                    message="Are you sure you want to delete the workout?"
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