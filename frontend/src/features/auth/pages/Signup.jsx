import { useEffect, useState } from "react"
import validate from 'validator'
import { Link } from 'react-router-dom'
import { useAuthHandler } from "@/features/auth/hooks/useAuthHandler"
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth"
import { inputValidator } from "@/features/auth/inputValidator"

const Signup = () => {
    const { userSignup, error, isLoading } = useAuthHandler();
    const { loginWithGoogle, loading: gLoading } = useGoogleAuth();


    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');

    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    /**
     * ----------------------------------------
     * VALIDATE NAME INPUT
     * ----------------------------------------
     * @param {string} name 
     */
    const validateName = (name) => {
        setInputName(name);
        setNameError(null);
        
        if (name?.length === 1)
            setNameError('Name is too short');
    }

    /**
     * ----------------------------------------
     * VALIDATE EMAIL INPUT
     * ----------------------------------------
     * @param {string} email 
     */
    const validateEmail = (email) => {
        setInputEmail(email);
        setEmailError(null);

        if (validate.isEmpty(email))
            setEmailError(null);
        else if (!validate.isEmail(email))
            setEmailError('Invalid Email');
    }
    
    /**
     * ---------------------------------------------------------
     * Verify passwords (password and confirm)
     * ---------------------------------------------------------
     */
    useEffect(() => {
        setPasswordError(null);
        if (inputPassword) {
            const result = inputValidator({ password: inputPassword, confirmPassword: inputConfirmPassword });
            if (result) 
                setPasswordError(result);

            if (inputConfirmPassword) {
                setConfirmPasswordError(null);
                const confirmPasswordResult = inputValidator({ password: inputPassword, confirmPassword: inputConfirmPassword });
                if (confirmPasswordResult) 
                    setConfirmPasswordError(confirmPasswordResult);
            }
        }
    }, [inputPassword, inputConfirmPassword])

    /**
     * ---------------------------------------------------------
     * HANDLES SIGNUP BUTTON
     * ---------------------------------------------------------
     */
    const handleSignup = async (e) => {
        e.preventDefault();
        
        // Check for validation errors first
        if (nameError || emailError || passwordError || confirmPasswordError) {
            return;
        }
        
        // Check if fields are empty
        if (!inputName || !inputEmail || !inputPassword || !inputConfirmPassword) {
            return;
        }
        
        // All validation passed, call the signup function
        await userSignup(inputName, inputEmail, inputPassword);
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Create your account 🚀
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start your fitness journey with us
                    </p>
                </div>
                
                <form className="mt-8 space-y-5" onSubmit={handleSignup} method="POST">
                    {/* Name field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">👤</span>
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className={`appearance-none rounded-lg block w-full pl-10 pr-3 py-3 border ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                placeholder="Your full name"
                                value={inputName}
                                onChange={(e) => validateName(e.target.value)}
                            />
                        </div>
                        {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
                    </div>

                    {/* Email field */}
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
                                className={`appearance-none rounded-lg block w-full pl-10 pr-3 py-3 border ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                placeholder="Your email address"
                                value={inputEmail}
                                onChange={(e) => validateEmail(e.target.value)}
                            />
                        </div>
                        {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                    </div>

                    {/* Password field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">🔒</span>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border ${passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                placeholder="Create a strong password"
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
                        {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
                        {!passwordError && inputPassword && (
                            <p className="mt-1 text-xs text-green-600">
                                Password strength: {inputPassword.length >= 12 ? 'Strong 💪' : inputPassword.length >= 8 ? 'Good ✅' : 'Weak ⚠️'}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password field */}
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">🔐</span>
                            </div>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border ${confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                placeholder="Confirm your password"
                                value={inputConfirmPassword}
                                onChange={(e) => setInputConfirmPassword(e.target.value)}
                            />
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
                        {confirmPasswordError && <p className="mt-1 text-xs text-red-500">{confirmPasswordError}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                            I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a> and <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
                        </label>
                    </div>

                    {error && <p className="text-center text-red-500 text-sm">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-green-100 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="font-medium text-green-600 hover:text-green-500"
                        >
                            Sign in
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
    )
}

export default Signup