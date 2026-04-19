import { create } from 'zustand'

const useAuthStore = create((set) => ({
    // states
    user: null,
    isAuthLoading: true,

    // set user
    setUser: (userData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...userData } : { ...userData }
    })),

    // logout user
    logoutUser: () => set({ user: null }),

    // set isAuthLoading
    setIsAuthLoading: (value) => set({ isAuthLoading: value }),
}));

export default useAuthStore;
