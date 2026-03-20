import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import {
  useAuthLogout,
  useUser,
} from '../../../features/auth/store/auth.selectors';
import { authApi } from '../../../features/auth/api/authApi';

export function Header() {
  const navigate = useNavigate();
  const user = useUser();
  const logout = useAuthLogout();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* server might be down — still clear local state */
    }
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-12 h-14 shrink-0 bg-chalk-header z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span className="font-[family-name:var(--font-display)] text-chalk-accent text-xl font-semibold tracking-tight">
          TeacherAI
        </span>
        <span className="text-white/20">·</span>
        <span className="text-white/40 text-xs font-normal uppercase tracking-widest">
          НУШ
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Balance badge */}
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(200,169,110,0.12)] border border-[rgba(200,169,110,0.25)]">
            <span className="text-sm">⚡</span>
            <span className="text-chalk-accent text-[13px] font-medium">
              {user.generationsBalance} генерацій
            </span>
          </div>
        )}

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white/40 hover:text-white/80"
          >
            Вийти
          </Button>
        </div>
      </div>
    </header>
  );
}
