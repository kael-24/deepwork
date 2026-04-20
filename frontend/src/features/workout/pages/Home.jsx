// external
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

// internal
import { DnDWrapper, useClickOutside } from '@/shared/index';
import { useAuthStore } from "@/features/auth/index";
import useGetWorkouts from "../hooks/useGetWorkouts";
import LandingPage from "../components/LandingPage";
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

    if (!user) return <LandingPage />
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

            {/* Floating Action Buttons - Bottom Right */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
                {/* Records Button */}
                <Link
                    to="/view-records"
                    className="w-12 h-12 bg-white text-green-600 rounded-full hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200"
                    title="View Records"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </Link>

                {/* Create Workout Plus Button */}
                <Link
                    to="/create-workout"
                    className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                    title="Create Workout"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default Home;