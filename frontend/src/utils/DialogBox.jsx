import { useEffect, useRef } from "react";

const DialogBox = ({title, message, onCancel}) => {
    const dialogBoxRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogBoxRef.current && !dialogBoxRef.current.contains(event.target))
                onCancel();
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [onCancel])
    
    return(
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4" ref={dialogBoxRef}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {message}
                </p>
                <div className="flex justify-end pt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-medium"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DialogBox;