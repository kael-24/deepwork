import { create } from 'zustand'

export const usePwdResetStore = create((set) => ({
    pwdResetMessage: '',
    pwdResetSuccess: () => set({ pwdResetMessage: "New password have been set" }),
    pwdClearMessage: () => set({ pwdResetMessage: '' })
}));

