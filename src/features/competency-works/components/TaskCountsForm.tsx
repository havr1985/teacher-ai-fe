import { Card } from '../../../shared/components/ui/Card';
import { Select } from '../../../shared/components/ui/Select';

interface TaskCounts {
  level1Count: number;
  level2Count: number;
  level3Count: number;
}

interface TaskCountsFormProps {
  value: TaskCounts;
  onChange: (counts: TaskCounts) => void;
}

const LEVEL_CONFIG = [
  { key: 'level1Count' as const, label: 'Рівень 1 — Середній (6 б.)', max: 5 },
  { key: 'level2Count' as const, label: 'Рівень 2 — Достатній (9 б.)', max: 5 },
  { key: 'level3Count' as const, label: 'Рівень 3 — Високий (12 б.)', max: 3 },
];

export function TaskCountsForm({ value, onChange }: TaskCountsFormProps) {
  const handleChange = (key: keyof TaskCounts, val: string) => {
    onChange({ ...value, [key]: Number(val) });
  };

  return (
    <Card className="p-6">
      <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-4">
        Кількість завдань на кожен рівень
      </p>

      <div className="flex flex-col gap-3">
        {LEVEL_CONFIG.map(({ key, label, max }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-[14px] text-chalk-text">{label}</span>
            <Select
              value={String(value[key])}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-[80px]"
            >
              {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        ))}
      </div>
    </Card>
  );
}
