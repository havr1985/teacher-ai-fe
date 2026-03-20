import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn.ts';
import type { FC } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Головна', icon: '⌂', end: true },
  { to: '/classes', label: 'Мої класи', icon: '◻' },
  { to: '/lesson-plans', label: 'Плани уроків', icon: '✦' },
  { to: '/competency-works', label: 'Компетентнісні роботи', icon: '◈' },
];

export const Sidebar: FC = () => {
  return (
    <aside className="flex flex-col w-[280px] shrink-0 bg-chalk-sidebar border-r border-chalk-border py-6">
      <nav className="flex-1 px-3">
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-[9px] rounded-lg',
                    'text-sm transition-all duration-150 no-underline',
                    'border-l-2',
                    isActive
                      ? 'bg-[rgba(200,169,110,0.1)] text-chalk-accent font-medium border-chalk-accent'
                      : 'text-chalk-muted border-transparent hover:bg-[rgba(200,169,110,0.06)] hover:text-chalk-text',
                  )
                }
              >
                <span className="text-[15px] opacity-70">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 pt-4 border-t border-chalk-border mt-4">
        <p className="text-xs text-chalk-muted leading-relaxed">
          Природнича галузь
          <br />
          Класи 5–9 · НУШ
        </p>
      </div>
    </aside>
  );
};
