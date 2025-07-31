import { useState } from "react";
import validate from 'validator';
import { Link } from 'react-router-dom';
import { useAuthHandler } from "../hooks/useAuthHandler";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

const Login = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputIsValid, setInputIsValid] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { userLogin, error, isLoading } = useAuthHandler();
    const { loginWithGoogle, loading: gLoading } = useGoogleAuth();

    const validateEmail = (value) => {
        setInputEmail(value);

        if (!validate.isEmail(value))
            setInputIsValid(false);
        else 
            setInputIsValid(true);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        userLogin(inputEmail, inputPassword);
    }
    
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back! 👋
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to continue your fitness journey
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                                    className={`appearance-none rounded-lg block w-full pl-10 pr-3 py-3 border ${
                                        inputIsValid === true ? "border-green-500 focus:ring-green-500" : 
                                        inputIsValid === false ? "border-red-500 focus:ring-red-500" : 
                                        "border-gray-300 focus:ring-green-500"
                                    } focus:border-green-500 focus:outline-none focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                    placeholder="Your email address"
                                    value={inputEmail}
                                    onChange={(e) => validateEmail(e.target.value)}
                                />
                            </div>
                            {inputIsValid === false && (
                                <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
                            )}
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">🔒</span>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 sm:text-sm"
                                    placeholder="Your password"
                                    value={inputPassword}
                                    onChange={(e) => setInputPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-green-100 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                {error && <p className="text-center text-red-500 text-sm">{error}</p>}

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                            Sign up now
                        </Link>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={loginWithGoogle}
                    disabled={gLoading}
                    className="w-full flex justify-center mt-4 bg-white text-gray-700 border
                                border-gray-300 rounded-lg py-3 hover:bg-gray-50"
                    >
                    <img src="https://developers.google.com/identity/images/g-logo.png"
                        alt="G" className="h-5 w-5 mr-3" />
                    {gLoading ? 'Signing in…' : 'Continue with Google'}
                </button>
            </div>
        </div>
    );
}

export default Login