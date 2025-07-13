import { create } from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  userProfile: { name: string; email: string } | null;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  userProfile: null,
  login: (user) => set({ isLoggedIn: true, userProfile: user }),
  logout: () => set({ isLoggedIn: false, userProfile: null }),
}));
