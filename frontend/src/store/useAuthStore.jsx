import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    // states
    user: null,
    isAuthLoading: true,

    // set user
    setUser: (userData) => set((state) => ({ 
        user: {
            ...state.user, ...userData
        }
    })),

    // logout user
    logoutUser: () => set({ user: null }),
    
    // set isAuthLoading (seems like not needed) // TODO
    setIsAuthLoading: (value) => set({ isAuthLoading: value }),
}));