import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useContext/useAuthContext'
import { useAuthHandler } from '../hooks/useAuthHandler'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

const Navbar = () => {
    const { user } = useAuthContext();
    const { userLogout } = useAuthHandler();
    const { logoutGoogle } = useGoogleAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleLogout = async () => {
        if (user?.provider === 'google')
            await logoutGoogle();
        else
            await userLogout();

    }

    return (
        <nav className="bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-white font-bold text-xl">🏋️‍♂️ DeepWork</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <Link to="/" className="text-white hover:bg-green-500 hover:bg-opacity-75 px-3 py-2 rounded-md font-medium">
                                Home
                            </Link>
                            <Link to="/about" className="text-white hover:bg-green-500 hover:bg-opacity-75 px-3 py-2 rounded-md font-medium">
                                About Us
                            </Link>
                            <Link to="/usage" className="text-white hover:bg-green-500 hover:bg-opacity-75 px-3 py-2 rounded-md font-medium">
                                Usage
                            </Link>
                            {!user && (
                                <div className="flex items-center space-x-4">
                                    <Link to="/signup" className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-medium">
                                        Sign Up
                                    </Link>
                                    <Link to="/login" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium">
                                        Login
                                    </Link>
                                </div>
                            )}
                            {user && (
                                <div onClick={handleLogout} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium">
                                    Logout
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-500 focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gradient-to-r from-green-400 to-emerald-500">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-white block px-3 py-2 rounded-md font-medium hover:bg-green-500">
                            Home
                        </Link>
                        <Link to="/about" className="text-white block px-3 py-2 rounded-md font-medium hover:bg-green-500">
                            About Us
                        </Link>
                        <Link to="/usage" className="text-white block px-3 py-2 rounded-md font-medium hover:bg-green-500">
                            Usage
                        </Link>
                        {!user && (
                            <div className="space-y-1">
                                <Link to="/signup" className="block bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-medium">
                                    Sign Up
                                </Link>
                                <Link to="/login" className="block bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium">
                                    Login
                                </Link>
                            </div>
                        )}
                        {user && (
                            <div onClick={handleLogout} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium">
                                Logout
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar