import { useState } from "react";
import validate from 'validator';
import { Link } from 'react-router-dom';
import useForgetPassword from "@/features/auth/hooks/useForgetPassword";

const ForgetPassword = () => {
    const {
        forgetPasswordMutation: {
            mutate: forgetPassword,
            isPending,
            isError,
            error,
            isSuccess
        }
    } = useForgetPassword();

    const [email, setEmail] = useState('');
    const [clientError, setClientError] = useState(null);

    const handleForgetPassword = (e) => {
        e.preventDefault();
        setClientError(null);

        if(!validate.isEmail(email)) {
            setClientError("Your email is invalid");
            return;
        }
    
        forgetPassword(email);
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password? 🔑
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive a reset link
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleForgetPassword}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">✉️</span>
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-lg block w-full pl-10 pr-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 sm:text-sm"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {clientError && <p className="text-center text-red-500 text-sm">{clientError}</p>}
                    {isError && <p className="text-center text-red-500 text-sm">{error.response?.data?.error || error.message}</p>}
                    {isSuccess && <p className="text-center text-green-500 text-sm">A message has been sent to your email</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg ${
                                isPending ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-green-100 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </span>
                            {isPending ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword