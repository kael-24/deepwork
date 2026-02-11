import { useLocation, useParams, useNavigate, Link } from "react-router-dom";

const ResultWorkout = () => {
    const { workoutId } = useParams();
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