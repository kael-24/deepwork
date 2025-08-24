import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthHandler } from '@/hooks/auth/useAuthHandler'
import { useGoogleAuth } from '@/hooks/auth/useGoogleAuth'

const Navbar = () => {
    const { user } = useAuthStore();
    const { userLogout } = useAuthHandler();
    const { logoutGoogle } = useGoogleAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sidebarRef = useRef();
    const burgerRef = useRef();

    /**
     * ---------------------------------------------------------
     * HANDLES CLOSE MENU WHEN CLICKED OUTSIDE THE SIDEBAR
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && burgerRef.current &&
        !burgerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    
    /**
     * ---------------------------------------------------------
     * HANDLES LOGOUT FEATURE
     * ---------------------------------------------------------
     */
    const handleLogout = async () => {
        if (user?.provider === 'google')
            await logoutGoogle();
        else
            await userLogout();
    }

    /**
     * ---------------------------------------------------------
     * CLOSES THE SIDEBAR MENU
     * ---------------------------------------------------------
     */
    const closeMenu = () => {
        setIsMenuOpen(false);
    }
    
    return (
        <>
            <nav className="bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg fixed top-0 left-0 right-0 z-50">
                <div className="w-full px-0">
                    <div className="flex items-center justify-between h-16 w-full">
                        {/* Left group: burger + logo */}
                        <div className="flex items-center min-w-0">
                            <button 
                                ref={burgerRef}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-500 focus:outline-none transition-colors duration-200 ml-2"
                            >
                                {isMenuOpen ? (
                                    // ← Left arrow
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                ) : (
                                    // ☰ Burger menu
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                            <Link to="/" className="flex items-center ml-2">
                                <span className="text-white font-bold text-xl whitespace-nowrap">🏋️‍♂️ deepwork</span>
                            </Link>
                        </div>

                        {/* Right group: account section */}
                        <div className="flex items-center space-x-4 mr-2">
                            {!user ? (
                                <div className="flex items-center space-x-4">
                                    <Link to="/signup" className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-medium transition-colors duration-200">
                                        Sign Up
                                    </Link>
                                    <Link to="/login" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium transition-colors duration-200">
                                        Login
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link to="/profile-settings" className="flex items-center space-x-2 text-white hover:text-green-100 transition-colors duration-200">
                                        {/* Profile Icon */}
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">{user.name}</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            {isMenuOpen && (
                <div className="fixed left-0 right-0 top-16 bottom-0 z-50 flex">
                    {/* Sidebar */}
                    {/* To adjust sidebar width, change w-80 (20rem/320px) and max-w-[33vw] below */}
                    <div 
                        className="relative w-80 max-w-[50vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
                        ref={sidebarRef}
                        >
                        <div className="h-full flex flex-col">
                            {/* Sidebar Content */}
                            <div className="flex-1 p-6 space-y-4">
                                <Link 
                                    to="/" 
                                    onClick={closeMenu}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="font-medium">Home</span>
                                </Link>

                                {!user ? (
                                    <div className="space-y-2">
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <p className="text-sm text-gray-500 mb-3 px-3">Account</p>
                                        </div>
                                        <Link 
                                            to="/signup" 
                                            onClick={closeMenu}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 border border-green-200"
                                        >
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            <span className="font-medium text-green-700">Sign Up</span>
                                        </Link>
                                        <Link 
                                            to="/login" 
                                            onClick={closeMenu}
                                            className="flex items-center space-x-3 p-3 rounded-lg bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white"
                                        >
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-medium">Login</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                    <Link 
                                        to="/profile-settings" 
                                            onClick={closeMenu}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">Profile Settings</span>
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                handleLogout();
                                                closeMenu();
                                            }}
                                            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-left"
                                        >
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-medium text-red-600">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add top margin to main content to account for fixed navbar */}
            <div className="h-16"></div>
        </>
    )
}

export default Navbar