import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const ExerciseCard = ({ id, exercise, sequence, addExercise, updateExercise, deleteExercise }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [exerciseTypeMenuOpen, setExerciseTypeMenuOpen] = useState(false);
    const [exerciseOptionsMenuOpen, setExerciseOptionsMenuOpen] = useState(false);

    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "RestBetweenSets", "Cooldown"];
    const exerciseOptionsMenu = ["☝️ Add above", "👇 Add below"];

    const handleTimer = (value) => {
        let digits = Number(value.replace(/[^0-9]/g, ""));
        digits = String(digits <= 0 ? "" : digits).slice(0, 5);
        updateExercise({timer: digits});  
    }

    const getTypeColor = (type) => {
        switch(type) {
            case "Prepare": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Work": return "bg-red-100 text-red-800 border-red-200";
            case "Rest": return "bg-green-100 text-green-800 border-green-200";
            case "RestBetweenSets": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Cooldown": return "bg-purple-100 text-purple-800 border-purple-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    }

    const getTypeIcon = (type) => {
        switch(type) {
            case "Prepare": return "🔥";
            case "Work": return "💪";
            case "Rest": return "😌";
            case "RestBetweenSets": return "⏸️";
            case "Cooldown": return "🧘";
            default: return "⚡";
        }
    }

    return(
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-3 cursor-grab hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        >
            <div className="flex items-center justify-between mb-3">
                {/* Sequence Number */}
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full">
                    {sequence}
                </div>

                {/* Exercise Type - Centered */}
                <div className="relative flex-1 mx-4">
                    <button
                        onClick={() => setExerciseTypeMenuOpen(!exerciseTypeMenuOpen)}
                        className={`w-full flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-sm ${getTypeColor(exercise.exerciseType)}`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(exercise.exerciseType)}</span>
                            <span className="font-medium">{exercise.exerciseType === "RestBetweenSets" ? "Rest Between Sets" : exercise.exerciseType}</span>
                        </span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {exerciseTypeMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                            {exerciseTypeOptions.map((option, index) => 
                                exercise.exerciseType !== option ? (
                                    <button 
                                        key={index}
                                        onClick={() => {
                                            updateExercise({exerciseType: option});    
                                            setExerciseTypeMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    >
                                        {option}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                    </button>
                                ) : null
                            )}
                        </div>
                    )}
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-2">
                    {/* Delete Button */}
                    <button
                        onClick={deleteExercise}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete exercise"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    {/* Options Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setExerciseOptionsMenuOpen(!exerciseOptionsMenuOpen)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        
                        {exerciseOptionsMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                {exerciseOptionsMenu.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            addExercise(option === exerciseOptionsMenu[0] ? "before" : "after");
                                            setExerciseOptionsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Exercise Description and Time Type - Side by side */}
            <div className="flex items-center gap-3 mb-3">
                {/* Exercise Description */}
                <div className="flex-1">
                    <input
                        onChange={(e) => updateExercise({exerciseName: e.target.value})}
                        value={exercise.exerciseName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="Enter exercise description"
                    />
                </div>

                {/* Time Type Toggle */}
                <button
                    onClick={() => {
                        let timeType = exercise.timeType;
                        timeType === "Timer" ? timeType = "Stopwatch" : timeType === "Stopwatch" ? timeType = "None" : timeType = "Timer";
                        updateExercise({timeType});
                    }}
                    className="flex items-center justify-center w-12 h-10 rounded-lg border-2 border-gray-300 hover:border-green-500 transition-colors duration-200 flex-shrink-0"
                    title={exercise.timeType === "Timer" ? "Timer" : exercise.timeType === "Stopwatch" ? "Stopwatch" : "No Timer"}
                >
                    <span className="text-lg">
                        {exercise.timeType === "Timer" ? "⌚" : exercise.timeType === "Stopwatch" ? "⌛" : "⛔"}
                    </span>
                </button>
            </div>

            {/* Timer Controls - Full width with label */}
            {exercise.timeType === "Timer" && (
                <div className="mb-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 flex-shrink-0">⌚ Timer</label>
                        <button
                            onClick={() => exercise.timer <= 0 ? 0 : updateExercise({timer: String(Number(exercise.timer) - 1)})}
                            className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={exercise.timer}
                            onChange={(e) => handleTimer(e.target.value)}
                            placeholder="seconds"
                            className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                            onClick={() => updateExercise({timer: String(Number(exercise.timer) + 1)})}
                            className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Reps - Full width below time controls with emoji label */}
            {exercise.exerciseType === "Work" && (
                <div className="mb-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 flex-shrink-0">💪 Reps</label>
                        <button
                            onClick={() => updateExercise({reps: exercise.reps <= 0 ? 0 : exercise.reps - 1})}
                            className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                updateExercise({reps: value === '' || value === '0' ? '' : value});
                            }}
                            placeholder="0"
                            className="flex-1 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                            onClick={() => updateExercise({reps: exercise.reps >= 59 ? 59 : exercise.reps + 1})}
                            className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExerciseCard;