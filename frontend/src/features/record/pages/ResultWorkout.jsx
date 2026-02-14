import { useLocation, useParams, useNavigate, Link } from "react-router-dom";

const ResultWorkout = () => {
    const { recordId } = useParams();
    const location = useLocation();

    const { currentDate, startTime, endTime, totalWorkoutDuration, exercisesDuration } = location.state || {};
    return (
        <div>
            <div>{currentDate}</div>
            <div>{startTime} -- {endTime}</div>
            <div>{totalWorkoutDuration}</div>
            <Link to='/'>
                HOME
            </Link>
            {(exercisesDuration).map(exercise => <div>{exercise.exerciseId}:{exercise.duration}</div>)}

        </div>
    );
}

export default ResultWorkout;

/**
 *         const startWorkoutDate = new Date(workoutStartTime.current).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const startWorkoutTime = new Date(workoutStartTime.current).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const endWorkoutTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
 * 
 * 
 */