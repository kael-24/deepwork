import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const ExerciseCard = ({ id, exercise, sequence, addExercise, updateExercise, deleteExercise }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "12px",
        margin: "8px 0",
        background: "#f4f4f4",
        borderRadius: "8px",
        cursor: "grab",
    };

    const [exerciseTypeMenuOpen, setExerciseTypeMenuOpen] = useState(false);
    const [exerciseOptionsMenuOpen, setExerciseOptionsMenuOpen] = useState(false);

    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "RestBetweenSets", "Cooldown"];
    const exerciseOptionsMenu = ["☝️Add exercise", "👇Add exercise"];

    const handleTimer = (value) => {
        let digits = Number(value.replace(/[^0-9]/g, "")); // prevent non-digits
        digits = String(digits <= 0 ? "" : digits).slice(0, 5); // treats 0 as empty string and sets limit to 5 digits
        updateExercise({timer: digits});  
    }

    return(
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {/** SEQUENCE NUMBER */}
            <div>{sequence}</div>

            {/** OPTIONS */}
            <button
                onClick={() => setExerciseOptionsMenuOpen(!exerciseOptionsMenuOpen)}
                className="border border-black"
            >
                option
            </button>
            <ul>
                {exerciseOptionsMenuOpen && 
                    exerciseOptionsMenu.map((option, index) => 
                        <li 
                            key={index}
                            onClick={() => {
                                addExercise(option === exerciseOptionsMenu[0] ? "before" : "after")
                                setExerciseOptionsMenuOpen(false)
                            }}
                        >
                            {option}
                        </li>
                    )
                }
            </ul>

            {/* EXERCISE TYPE */}
            <div className="mb-6 mt-6">
                <button
                    onClick={() => setExerciseTypeMenuOpen(!exerciseTypeMenuOpen)}
                    className="border border-black"
                >
                    {exercise.type}
                </button>
                {exerciseTypeMenuOpen && (
                    <div>
                        <ul>
                            {exerciseTypeOptions.map((option, index) => 
                                exercise.type !== option ? (
                                    <li key={index}>
                                        <button 
                                            onClick={() => {
                                                updateExercise({type: option});    
                                                setExerciseTypeMenuOpen(false);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ) : null
                            )}
                        </ul>
                    </div>
                )}
            </div><hr />

            {/* EXERCISE NAME */}
            <div className="mb-6 mt-6">
                <label>Description:</label>
                <input
                    onChange={(e) => {
                        updateExercise({name: e.target.value});
                    }}
                    value={exercise.name}
                    className="border border-black"
                    placeholder="Enter your workout name"
                />
            </div><hr />

            {/* TIME TYPE */}
            <div className="mb-6 mt-6">
                <button
                    onClick={() => {
                        let timeType = exercise.timeType;
                        timeType === "Timer" ? timeType = "Stopwatch" : timeType === "Stopwatch" ? timeType = "None" : timeType = "Timer";
                        updateExercise({timeType});
                    }}
                >
                    {exercise.timeType === "Timer" ? "⌚" : exercise.timeType === "Stopwatch" ? "⌛" : "⛔"}
                </button>
            </div><hr />

            {/* TIMER */}
            <div className="mb-6 mt-6">
                {exercise.timeType === "Timer" && (
                    <div>
                        <div>
                            <button
                                onClick={() => exercise.timer <= 0 ? 0 : updateExercise({timer: String(Number(exercise.timer) - 1)})}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={exercise.timer}
                                onChange={(e) => handleTimer(e.target.value)}
                                placeholder="00"
                            />
                            <button
                                onClick={() => updateExercise({timer: String(Number(exercise.timer) + 1)})}
                                >
                                +
                            </button>
                        </div> 
                    </div>
                )}
            </div><hr/>

            {/* REPS */}
            <div className="mt-6 mb-6">
                {exercise.type === "Work" && 
                    <div>
                        <button
                            onClick={() => updateExercise({reps: exercise.reps <= 0 ? 0 : exercise.reps - 1})}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                updateExercise({reps: value === '' || value === '0' ? '' : value});
                            }}
                            placeholder="0"
                        />
                        <button
                            onClick={() => updateExercise({reps: exercise.reps >= 59 ? 59 : exercise.reps + 1})}
                        >
                            +
                        </button>
                    </div>
                }
            </div><hr/>
            <button
                onClick={deleteExercise}
                className="border border-black"
            >
                delete
            </button>
        </div>
    );
}

export default ExerciseCard;