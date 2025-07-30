import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        console.log('useAuthContext should be within AuthContextProvider only');
        throw Error('useAuthContext should be within AuthContextProvider only');
    }
    
    
    return context;
}