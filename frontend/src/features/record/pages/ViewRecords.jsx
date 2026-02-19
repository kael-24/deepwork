import useGetAllRecords from '../hooks/useGetAllRecords.js';
import { useNavigate } from 'react-router-dom';
import useDeleteRecord from '../hooks/useDeleteRecord.js';

const ViewRecords = () => {
    const { data, isLoading, error, isError } = useGetAllRecords();
    const { deleteRecord } = useDeleteRecord();
    const records = data?.records || [];
    const navigate = useNavigate();

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

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">History</h1>

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
                                    if (window.confirm('Are you sure you want to delete this record?')) {
                                        deleteRecord.mutate(record._id);
                                    }
                                }}
                                className="ml-4 text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
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