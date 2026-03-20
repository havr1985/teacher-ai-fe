import { Card } from '../../../shared/components/ui/Card.tsx';
import { Link } from 'react-router-dom';
import { useUser } from '../../auth/store/auth.selectors.ts';

const QUICK_ACTIONS = [
  {
    to: '/lesson-plans/generate',
    icon: '✦',
    label: 'Новий план уроку',
    description: 'Структурований план по НУШ з хронометражем',
    primary: true,
  },
  {
    to: '/competency-works/generate',
    icon: '◈',
    label: 'Компетентнісна робота',
    description: 'Три рівні на одному аркуші — учень обирає сам',
    primary: true,
  },
  {
    to: '/classes',
    icon: '◻',
    label: 'Мої класи',
    description: 'Керувати класами та журналом пройденого',
    primary: false,
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Доброго ранку';
  if (h < 17) return 'Доброго дня';
  return 'Добрий вечір';
}

interface StatCardProps {
  value: string | number;
  label: string;
  warning?: boolean;
}

function StatCard({ value, label, warning }: StatCardProps) {
  return (
    <Card className="px-6 py-5">
      <p className="font-[family-name:var(--font-display)] text-[2rem] font-semibold text-chalk-header leading-none mb-1">
        {value}
      </p>
      <p className="text-sm text-chalk-muted">{label}</p>
      {warning && (
        <p className="text-[13px] text-chalk-accent font-medium mt-1">
          ⚠ Майже вичерпано
        </p>
      )}
    </Card>
  );
}

const DashboardPage = () => {
  const user = useUser();
  const balance = user?.generationsBalance ?? 0;

  return (
    <div className="animate-fade-up max-w-[1060px] mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-1">
          {greeting()}, {user?.firstName} 👋
        </h1>
        <p className="text-[15px] text-chalk-muted">Що генеруємо сьогодні?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          value={balance}
          label="Генерацій залишилось"
          warning={balance <= 3}
        />
        <StatCard value="—" label="Планів уроків" />
        <StatCard value="—" label="Компетентнісних робіт" />
      </div>

      {/* Quick actions */}
      <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-3">
        Швидкі дії
      </p>

      <div className="flex flex-col gap-2.5 mb-8">
        {QUICK_ACTIONS.map(({ to, icon, label, description, primary }) => (
          <Link key={to} to={to} className="no-underline group">
            <Card className="flex items-center gap-4 px-5 py-4 transition-all duration-150 group-hover:border-chalk-accent group-hover:shadow-[0_2px_12px_rgba(200,169,110,0.12)]">
              <div
                className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-[18px] shrink-0 text-chalk-accent
                ${primary ? 'bg-[rgba(200,169,110,0.1)]' : 'bg-chalk-border'}
              `}
              >
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-chalk-header mb-0.5">
                  {label}
                </p>
                <p className="text-[13px] text-chalk-muted">{description}</p>
              </div>

              <span className="text-chalk-muted text-lg shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
                →
              </span>
            </Card>
          </Link>
        ))}
      </div>

      {/* NUŠ info */}
      <div className="px-5 py-4 bg-[rgba(200,169,110,0.07)] border border-[rgba(200,169,110,0.2)] border-l-[3px] border-l-chalk-accent rounded-[10px]">
        <p className="text-[13px] font-medium text-chalk-accent uppercase tracking-[0.05em] mb-1">
          НУШ · Природнича галузь
        </p>
        <p className="text-sm text-chalk-text leading-relaxed">
          Підтримує <strong>ГР-1</strong> "Досліджує природу",{' '}
          <strong>ГР-2</strong> "Опрацьовує інформацію" та <strong>ГР-3</strong>{' '}
          "Усвідомлює закономірності природи" — класи 5–9.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
