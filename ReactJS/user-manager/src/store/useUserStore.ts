import { create } from 'zustand';

interface UserStore {
    refreshTrigger: number;
    refresh: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    refreshTrigger: 0,
    refresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));