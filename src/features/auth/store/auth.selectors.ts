import { useAuthStore } from './auth.store';

export const useUser = () => useAuthStore((s) => s.user);
export const useToken = () => useAuthStore((s) => s.token);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);

export const useAuthLogin = () => useAuthStore((s) => s).login;
export const useAuthLogout = () => useAuthStore((s) => s.logout);
export const useSetToken = () => useAuthStore((s) => s.setToken);
export const useAuthUpdateUser = () => useAuthStore((s) => s.updateUser);
