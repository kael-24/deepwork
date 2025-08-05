import { createContext, useReducer, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'SIGNUP':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'CHECK_AUTH':
            return { user: action.payload }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: null,
    });

    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Check if user is authenticated when the app loads
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Make a request to an endpoint that checks if the cookie is valid
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/check-auth`, {
                    withCredentials: true // Important to send cookies
                });
                
                console.log("RESPONSES", response.data.name, response.data.email);

                if (response.data.isAuthenticated) {
                    dispatch({ 
                        type: 'CHECK_AUTH', 
                            payload: {
                                name: response.data.name,
                                email: response.data.email,
                                provider: response.data.provider,
                                isAuthenticated: true
                            }
                    });
                }
            } catch (error) {
                console.log('Error checking auth status: ', error)
                // If there's an error or the user is not authenticated, set user to null
                dispatch({ type: 'LOGOUT' });
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    console.log('AuthContext State: ', state)

    return(
        <AuthContext.Provider value={{ ...state, dispatch, isAuthLoading }}>
            { children }
        </AuthContext.Provider>
    )
}

