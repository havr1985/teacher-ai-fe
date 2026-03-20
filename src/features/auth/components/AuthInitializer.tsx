import { useEffect, useState, type ReactNode } from 'react';
import {
  useAuthLogin,
  useAuthLogout,
  useIsAuthenticated,
  useToken,
} from '../store/auth.selectors';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/authApi';
import { Spinner } from '../../../shared/components/ui/Spinner';

interface Props {
  children: ReactNode;
}

export function AuthInitializer({ children }: Props) {
  const isAuthenticated = useIsAuthenticated();
  const token = useToken();
  const login = useAuthLogin();
  const logout = useAuthLogout();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // No session flag or already have token → nothing to restore
      if (!isAuthenticated || token) {
        setReady(true);
        return;
      }

      try {
        const refreshRes = await authApi.refresh();
        const { accessToken } = refreshRes.data.data;

        useAuthStore.getState().setToken(accessToken);

        const meRes = await authApi.me();
        const user = meRes.data.data;

        login(accessToken, user);
      } catch {
        logout();
      } finally {
        setReady(true);
      }
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-chalk-bg flex flex-col items-center justify-center gap-3">
        <Spinner size={28} />
        <span className="text-sm text-chalk-muted">Завантаження...</span>
      </div>
    );
  }

  return <>{children}</>;
}
