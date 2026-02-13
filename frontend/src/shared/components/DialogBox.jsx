import { useEffect, useRef } from "react";

const DialogBox = ({ title, message, onSave, onSaveName, onCancel, onCancelName }) => {
    const dialogBoxRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(event.target)) {
                onCancel();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                ref={dialogBoxRef}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scale-in border border-gray-100"
                role="dialog"
                aria-modal="true"
            >
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    {/* Cancel Button */}
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        {onCancelName || "Cancel"}
                    </button>

                    {/* Save/Confirm Button */}
                    {onSave && (
                        <button
                            onClick={onSave}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 transform active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            {onSaveName || "Confirm"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DialogBox;