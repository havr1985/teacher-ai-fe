import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../../shared/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setToken: (token) => set({ token }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      version: 2,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: () => ({
        token: null,
        user: null,
        isAuthenticated: false,
      }),
    },
  ),
);
