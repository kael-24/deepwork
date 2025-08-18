import { useState } from "react";

const ExerciseCard = ({ exercise, sequence, update }) => {
    const [ExerciseTypeMenuOpen, setExerciseTypeMenuOpen] = useState(false);

    const exerciseTypeOptions = ["Prepare", "Work", "Rest", "Rest between sets", "Cooldown"];

    const handleTimer = (type, value) => {
        let digits = Number(value.replace(/[^0-9]/g, ""));
        digits = digits < 0 ? 0 : digits > 59 ? 59 : digits;
        if (type === "minutes") {
            digits = String(digits).padStart(2, "0") + exercise.timer.slice(2, 4);
        } else {
            digits = exercise.timer.slice(0, 2) + String(digits).padStart(2, "0");
        }
        update(sequence, {timer: digits});  
    }

    console.log("exerciseTImer", exercise.timer);

    return(
        <div>
            {/** SEQUENCE NUMBER */}
            <div>{sequence + 1}</div>

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
                                                update(sequence, {type: option});    
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
                <label>Exercise Name:</label>
                <input
                    onChange={(e) => {
                        update(sequence, {name: e.target.value});
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
                        update(sequence, {timeType});
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
                                        : update(sequence, {timer: String(Number(exercise.timer.slice(0,2)) - 1).padStart(2, "0") + exercise.timer.slice(2,4)})
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
                                        : update(sequence, {timer: String(Number(exercise.timer.slice(0,2)) + 1).padStart(2, "0") + exercise.timer.slice(2,4)})
                                    }
                                >
                                +
                            </button>
                            <button
                                onClick={() => Number(exercise.timer.slice(2,4)) <= 0 
                                        ? 0 
                                        : update(sequence, {timer: exercise.timer.slice(0,2) + String(Number(exercise.timer.slice(2,4)) - 1).padStart(2, "0")})
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
                                        : update(sequence, {timer: exercise.timer.slice(0,2) + String(Number(exercise.timer.slice(2,4)) + 1).padStart(2, "0")})
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
                            onClick={() => update(sequence, {reps: exercise.reps <= 0 ? 0 : exercise.reps - 1})}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                update(sequence, {reps: value === '' || value === '0' ? '' : value});
                            }}
                            placeholder="0"
                        />
                        <button
                            onClick={() => update(sequence, {reps: exercise.reps >= 59 ? 59 : exercise.reps + 1})}
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