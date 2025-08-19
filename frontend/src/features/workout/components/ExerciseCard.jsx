import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const ExerciseCard = ({ id, exercise, index, update }) => {
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

    const [ExerciseTypeMenuOpen, setExerciseTypeMenuOpen] = useState(false);

    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "RestBetweenSets", "Cooldown"];

    const handleTimer = (type, value) => {
        let digits = Number(value.replace(/[^0-9]/g, ""));
        digits = digits < 0 ? 0 : digits > 59 ? 59 : digits;
        if (type === "minutes") {
            digits = String(digits).padStart(2, "0") + exercise.timer.slice(2, 4);
        } else {
            digits = exercise.timer.slice(0, 2) + String(digits).padStart(2, "0");
        }
        update({timer: digits});  
    }

    console.log("exerciseTImer", exercise.timer);

    return(
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {/** SEQUENCE NUMBER */}
            <div>{index}</div>

            {/* EXERCISE TYPE */}
            <div className="mb-6 mt-6">
                <button
                    onClick={() => setExerciseTypeMenuOpen(!ExerciseTypeMenuOpen)}
                    className="border border-black"
                >
                    {exercise.type}
                </button>
                {ExerciseTypeMenuOpen && (
                    <div>
                        <ul>
                            {exerciseTypeOptions.map((option, index) => 
                                exercise.type !== option ? (
                                    <li key={index}>
                                        <button 
                                            onClick={() => {
                                                update({type: option});    
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
                        update({name: e.target.value});
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
                        update({timeType});
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
                                onClick={() => Number(exercise.timer.slice(0, 2)) <= 0 
                                        ? 0 
                                        : update({timer: String(Number(exercise.timer.slice(0,2)) - 1).padStart(2, "0") + exercise.timer.slice(2,4)})
                                    }
                                >
                                -
                            </button>
                            <input
                                type="text"
                                value={exercise.timer.padStart(2, "0").slice(0, 2)}
                                onChange={(e) => handleTimer("minutes", e.target.value)}
                                placeholder="00"
                            />
                            <button
                                onClick={() => Number(exercise.timer.slice(0, 2)) >= 59 
                                        ? 0 
                                        : update({timer: String(Number(exercise.timer.slice(0,2)) + 1).padStart(2, "0") + exercise.timer.slice(2,4)})
                                    }
                                >
                                +
                            </button>
                            <button
                                onClick={() => Number(exercise.timer.slice(2,4)) <= 0 
                                        ? 0 
                                        : update({timer: exercise.timer.slice(0,2) + String(Number(exercise.timer.slice(2,4)) - 1).padStart(2, "0")})
                                    }
                                >
                                -
                            </button>
                            <input
                                type="text"
                                value={exercise.timer.padStart(2, "0").slice(2, 4)}
                                onChange={(e) => handleTimer("seconds", e.target.value)}
                                placeholder="00"
                            />
                            <button
                                onClick={() => Number(exercise.timer.slice(2, 4)) >= 59 
                                        ? 0 
                                        : update({timer: exercise.timer.slice(0,2) + String(Number(exercise.timer.slice(2,4)) + 1).padStart(2, "0")})
                                    }
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
                            onClick={() => update({reps: exercise.reps <= 0 ? 0 : exercise.reps - 1})}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                update({reps: value === '' || value === '0' ? '' : value});
                            }}
                            placeholder="0"
                        />
                        <button
                            onClick={() => update({reps: exercise.reps >= 59 ? 59 : exercise.reps + 1})}
                        >
                            +
                        </button>
                    </div>
                }
            </div><hr/>
        </div>
    );
}

export default ExerciseCard;