import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthLogout, useUser } from '../../auth/store/auth.selectors.ts';

const NAV_ITEMS = [
  { to: '/admin', label: '📊 Огляд', exact: true },
  { to: '/admin/users', label: '👥 Користувачі', exact: false },
  { to: '/admin/stats', label: '📈 Статистика', exact: false },
  { to: '/admin/surveys', label: '💬 Опитування', exact: false },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthLogout();
  const user = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-chalk-bg">
      {/* Sidebar */}
      <aside className="w-56 bg-chalk-header text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            TeacherAI
          </div>
          <div className="mt-1 text-xs text-white/30">Адміністрування</div>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== '/admin';
            const active = item.exact
              ? location.pathname === item.to
              : isActive;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm transition-colors no-underline ${
                  active
                    ? 'bg-chalk-accent text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <div className="px-3 py-2 text-xs text-white/40 truncate">
            {user?.email}
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors no-underline"
          >
            ← До кабінету
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-white/50 hover:text-red-300 hover:bg-white/10 transition-colors"
          >
            Вийти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-chalk-card border-b border-chalk-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-[15px] font-semibold text-chalk-header">
            Панель адміністратора
          </h1>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
            ADMIN
          </span>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
