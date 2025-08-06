import { create } from 'zustand'

const usePwdResetStore = create((set) => ({
    pwdResetMessage: '',
    pwdResetSuccess: () => set({ pwdResetMessage: "New password have been set" }),
    pwdClearMessage: () => set({ pwdResetMessage: '' })
}))

export default usePwdResetStore;