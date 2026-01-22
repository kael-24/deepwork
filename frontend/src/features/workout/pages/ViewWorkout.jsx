import { useEffect, useState } from 'react';
import useGetWorkout from '../hooks/useGetWorkout'
import { Link, useParams, useNavigate } from 'react-router-dom';

import { DialogBox } from '@/shared/index';
import useDeleteWorkout from '../hooks/useDeleteWorkout';

const ViewWorkoutCard = ({ ex }) => {
    return (
        <div>
            <p>{ex.exerciseName}</p>
            <p>{ex.exerciseType}</p>
            <p>{ex.timeType}</p>
            {ex.timer && <p>{ex.timer}</p>}
            {ex.reps && <p>{ex.reps}</p>}
            <p>----------------</p>
        </div>
    )
}


const ViewWorkout = () => {
    const navigate = useNavigate();
    
    const { workoutId } = useParams();
    const { data } = useGetWorkout(workoutId);

    const [openDialogBox, setOpenDialogBox] = useState(false);
    const { deleteWorkoutMutation } = useDeleteWorkout();

    const [ workoutName, setWorkoutName ] = useState("");
    const [ exercises, setExercises ] = useState(null);

    // console.log("exercises", data?.workout);

    useEffect(() => {
        if (data?.workout?.exercises && data?.workout?.workoutName){
            setExercises(data.workout.exercises);
            setWorkoutName(data.workout.workoutName);
        }
    }, [data]);

    return (
        <div>
            <Link to='/'>BACK</Link>
            <p>{workoutName}</p>
            <Link 
                to={`/edit-workout/${workoutId}`}
                state={{ from: `/view-workout/${workoutId}` }}
            >
                Edit
            </Link>
            <button
                onClick={() => setOpenDialogBox(true)}
            >
                DELETE
            </button>
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