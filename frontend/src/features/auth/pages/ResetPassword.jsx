// external
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

// internal
import useForgetPassword from "../hooks/useForgetPassword";
import usePwdResetStore from "../store/usePwdResetStore";
import { passwordValidator } from "../utils/inputValidator";

const ResetPassword = () => {
    const {
        resetPasswordMutation: {
            mutate: resetPassword,
            isPending,
            isError,
            error,
        }
    } = useForgetPassword();

    const { pwdResetSuccess } = usePwdResetStore();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [clientError, setClientError] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!token) {
            setClientError('Token required');
            return;
        }

        if (!newPassword || !confirmPassword) {
            setClientError('Password fields should not be empty');
            return;
        }

        await resetPassword({ token, newPassword }, {
            onSuccess: () => {
                pwdResetSuccess();
                navigate('/login', { replace: true });
            }
        });
    }

    useEffect(() => {
        setClientError(null)
        if (newPassword) {
            const result = passwordValidator({ password: newPassword, isEnough: true, isStrong: true });
            if (result) {
                setClientError(result);
                return;
            }
            if (confirmPassword && confirmPassword !== newPassword)
                setClientError("Passwords does not match");
        }
    }, [newPassword, confirmPassword])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Your Password 🔐
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password to continue
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
                    {/** Password */}
                    <div className="space-y-4">

                        {/** New password */}
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">🔒</span>
                                </div>

                                {/** New password input */}
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 sm:text-sm"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                {/** New password peek button */}
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showNewPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/** Confirm Password */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">🔐</span>
                                </div>

                                {/** Confirm Password Input */}
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 sm:text-sm"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                {/** Confirm Password Peek button */}
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** Client-side password input error message */}
                    {clientError && <p className="text-center text-red-500 text-sm">{clientError}</p>}

                    {/** Server-side password input error message */}
                    {isError && <p className="text-center text-red-500 text-sm">{error.response?.data?.error || error.message}</p>}

                    {/** Update password button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg ${isPending ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-green-100 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {isPending ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </div>
                </form>

                {/** Signin page redirect button */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Remembered your password?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword