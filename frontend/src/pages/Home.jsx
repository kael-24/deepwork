import { v4 as uuidv4 } from "uuid";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGetWorkouts } from '@/hooks/workout/useGetWorkouts';
import DnDWrapper from '@/utils/DnDWrapper';
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useClickOutside } from "@/utils/useClickOutside";

const WorkoutCard = ({ workout }) => {
    const { setNodeRef, attributes, transform, listeners, transition } = useSortable({ id: workout.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    const workoutCardOption = ["Edit", "Delete"];
    const [isWorkoutOptionOpen, setIsWorkoutOptionOpen] = useState(false); 
    const workoutDropdownRef = useRef(null);

    useClickOutside(workoutDropdownRef, () => setIsWorkoutOptionOpen(false));

    return(
        <div 
            key={workout.id} 
            className='border border-black'
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
        >
            <div>{workout.workoutName}</div>
            <div>{workout.exercises.length}</div>
            {workout.exercises.map((exercise, index) => index <= 5 && 
                <div key={index}>
                    {exercise.exerciseName}
                </div>
            )}
            <div 
                onClick={() => setIsWorkoutOptionOpen(prev => !prev)}
                ref={workoutDropdownRef}
            >...
            </div>
            {isWorkoutOptionOpen && 
                workoutCardOption.map((option, index) => 
                    <div key={index}>{option}</div>
                )
            }
        </div>
    )
}

const Home = () => {
    const { data, isLoading, isError, error } = useGetWorkouts();
    const [workouts, setWorkouts] = useState([]);
    const { user } = useAuthStore();
    
    useEffect(() => {
        if (data) {
            const workoutsArr = data.map((workout) => ({id: uuidv4(), ...workout}));
            setWorkouts(workoutsArr);
        }
    }, [data]);
    
    if (!user) return <div>Log in to see your workouts</div>
    if (isLoading) return <p>loading....</p>;
    if (isError && error) return <p>{error.response?.data?.error}</p>;

    return (
        <div>
            {workouts.length === 0 ? (
                <div>No workouts created!</div>
            ) : (
                <div>
                    <DnDWrapper items={workouts} setItems={setWorkouts} type="grid">
                        <div className="grid grid-cols-2 gap-4">
                            {workouts.map((workout) => <WorkoutCard workout={workout} />)}
                        </div>
                    </DnDWrapper>
                </div>
            )} 
            <Link to="/create-workout">+</Link>
        </div>
    );
};

export default Home;