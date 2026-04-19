import useGetAllRecords from '../hooks/useGetAllRecords.js';
import { useNavigate } from 'react-router-dom';
import useDeleteRecord from '../hooks/useDeleteRecord.js';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { DialogBox } from '@/shared/index.js';
import { useState } from 'react';

const ViewRecords = () => {
    const { data, isLoading, error, isError } = useGetAllRecords();
    const { deleteRecord } = useDeleteRecord();
    const records = data?.records || [];
    const navigate = useNavigate();
    const [deleteRecordId, setDeleteRecordId] = useState(null);
    if (isLoading)
        return <div className="p-8 text-center text-gray-600">Loading records...</div>;

    if (isError)
        return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

    const dateFormatter = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDuration = (start, end) => {
        if (!start || !end) return "00:00:00";
        const totalSeconds = Math.floor((new Date(end) - new Date(start)) / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map(val => String(val).padStart(2, '0'))
            .join(':');
    };

    const handleDownload = () => {
        const flattenedData = records.flatMap(workout => {
            return workout.exercises.map(exercise => {
                return {
                    Workout_ID: workout._id,
                    Workout_Name: workout.workoutName,
                    Date_Started: new Date(workout.workoutDateStarted).toLocaleString(),
                    Date_Ended: new Date(workout.workoutDateEnded).toLocaleString(),
                    
                    Exercise_Type: exercise.exerciseType,
                    Exercise_Name: exercise.exerciseName,
                    Time_Type: exercise.timeType,
                    Target_Timer_Seconds: exercise.timer,
                    Actual_Duration: exercise.duration,
                    Reps: exercise.reps || "N/A" 
                };
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Workout History");
        XLSX.writeFile(workbook, "workout_history.xlsx");
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className='flex justify-between items-center mb-6'>
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-green-600 hover:text-green-700 transition-colors flex items-center justify-center p-1 rounded-full hover:bg-green-50">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 m-0">History</h1>
                </div>
                <button 
                    onClick={handleDownload} 
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download History
                </button>
            </div>


            <div className="flex flex-col gap-4">
                {records.length > 0 ? (
                    [...records]
                    .sort((a,b) => new Date(b.workoutDateStarted) - new Date(a.workoutDateStarted))
                    .map((record, index) => (
                        <div
                            onClick={() => navigate(`/result-workout/${record._id}`)}
                            key={record._id || index}
                            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="m-0 font-semibold text-gray-900 text-lg">{record.workoutName}</h3>
                                <div className="text-sm text-gray-500 mt-1">
                                    {dateFormatter(record.workoutDateStarted)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-green-600 text-base">
                                    {formatDuration(record.workoutDateStarted, record.workoutDateEnded)}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {record.exercises?.length || 0} Exercises
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDeleteRecordId(record._id);
                                }}
                                className="ml-4 text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
                            {deleteRecordId === record._id && (
                                <DialogBox
                                    title="Delete"
                                    message="Are you sure you want to delete this record?"
                                    onSave={() => {
                                        deleteRecord.mutate(record._id);
                                        setDeleteRecordId(null);
                                    }}
                                    onSaveName="Delete"
                                    onCancel={() => setDeleteRecordId(null)}
                                    onCancelName="Cancel"
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center p-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        No workouts recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewRecords;