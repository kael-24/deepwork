// TODO drag and drop
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGetWorkouts } from '@/hooks/workout/useGetWorkouts';
import DnDWrapper from '@/utils/DnDWrapper';
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useClickOutside } from "@/utils/useClickOutside";
import { useDeleteWorkout } from "@/hooks/workout/useDeleteWorkout";

const WorkoutCard = ({ workout }) => {
    const { setNodeRef, attributes, transform, listeners, transition } = useSortable({ id: workout._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    const workoutCardOption = ["Edit", "Delete"];
    const [isWorkoutOptionOpen, setIsWorkoutOptionOpen] = useState(false); 
    const workoutDropdownRef = useRef(null);
    const { deleteWorkoutMutation } = useDeleteWorkout();

    useClickOutside(workoutDropdownRef, () => setIsWorkoutOptionOpen(false));

    return(
        <div 
            key={workout._id} 
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
            <div ref={workoutDropdownRef}>
                <div 
                    onClick={() => setIsWorkoutOptionOpen(prev => !prev)}
                >...
                </div>
                {isWorkoutOptionOpen && 
                    workoutCardOption.map((option, index) => 
                        <button 
                            key={index} 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (option === workoutCardOption[1]) 
                                    deleteWorkoutMutation.mutate(workout._id) 
                            }}
                            disabled={deleteWorkoutMutation.isLoading}
                        >
                            {option}
                        </button>
                    )
                }
            </div>
            
            {deleteWorkoutMutation.isError &&
                <div>
                    Error: {deleteWorkoutMutation.error?.response?.data.error || deleteWorkoutMutation.error.message} 
                </div>
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
            setWorkouts(data);
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
                            {workouts.map((workout) => <WorkoutCard key={workout._id} workout={workout} />)}
                        </div>
                    </DnDWrapper>
                </div>
            )} 
            <Link to="/create-workout">+</Link>
        </div>
    );
};

export default Home;