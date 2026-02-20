// external
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

// internal
import { DnDWrapper, useClickOutside } from '@/shared/index';
import { useAuthStore } from "@/features/auth/index";
import useGetWorkouts from "../hooks/useGetWorkouts";
import useDeleteWorkout from "../hooks/useDeleteWorkout";

const WorkoutCard = ({ workout }) => {
    const { setNodeRef, attributes, transform, listeners, transition } = useSortable({ id: workout._id });
    const navigate = useNavigate();
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    const workoutCardOption = ["Edit", "Delete"];
    const [isWorkoutOptionOpen, setIsWorkoutOptionOpen] = useState(false);
    const workoutDropdownRef = useRef(null);
    const { deleteWorkoutMutation } = useDeleteWorkout();

    useClickOutside(workoutDropdownRef, () => setIsWorkoutOptionOpen(false));

    return (
        <div
            key={workout._id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
        >
            {/* Workout name */}
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{workout.workoutName}</h3>

            {/* Exercise count */}
            <p className="text-sm text-gray-500 mb-3">{workout.exercises?.length || 0} exercises</p>

            {/* Exercise list preview */}
            <ul className="space-y-1 mb-2">
                {workout.exercises?.map((exercise, index) => index <= 5 &&
                    <li key={index} className="text-sm text-gray-600">
                        {exercise.exerciseName}
                    </li>
                )}
            </ul>

            {/* Options dropdown */}
            <div ref={workoutDropdownRef} className="absolute top-3 right-3">
                <button
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsWorkoutOptionOpen(prev => !prev);
                    }}
                >⋯
                </button>
                {isWorkoutOptionOpen &&
                    <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 overflow-hidden">
                        {workoutCardOption.map((option, index) =>
                            <button
                                key={index}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (option === workoutCardOption[1])
                                        deleteWorkoutMutation.mutate(workout._id)
                                    else if (option == workoutCardOption[0])
                                        navigate(`/edit-workout/${workout._id}`, { state: { from: '/' } });
                                }}
                                disabled={deleteWorkoutMutation.isLoading}
                            >
                                {option}
                            </button>
                        )}
                    </div>
                }
            </div>

            {/* Delete error */}
            {deleteWorkoutMutation.isError &&
                <p className="text-red-500 text-xs mt-2">
                    Error: {deleteWorkoutMutation.error?.response?.data.error || deleteWorkoutMutation.error.message}
                </p>
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

    if (!user) return <div className="text-center text-gray-500 mt-20">Log in to see your workouts</div>
    if (isLoading) return <p className="text-center text-gray-400 mt-20">Loading....</p>;
    if (isError && error) return <p className="text-center text-red-500 mt-20">{error.response?.data?.error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {workouts.length === 0 ? (
                // Message if no workout is created
                <div className="text-center text-gray-400 mt-20">No workouts created!</div>
            ) : (
                // List of workouts mapping 
                <div>
                    <DnDWrapper items={workouts} setItems={setWorkouts} type="grid">
                        <div className="grid grid-cols-2 gap-4">
                            {workouts.map((workout) =>
                                <Link to={`/view-workout/${workout._id}`} key={workout._id} className="no-underline">
                                    <WorkoutCard workout={workout} />
                                </Link>
                            )}
                        </div>
                    </DnDWrapper>
                </div>
            )}

            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-6">
                <Link
                    to="/create-workout"
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-2xl shadow-md hover:bg-blue-700"
                >+</Link>
                <Link
                    to="/view-records"
                    className="text-sm text-blue-600 hover:underline"
                >Records</Link>
            </div>
        </div>
    );
};

export default Home;