import { Card } from '../../../shared/components/ui/Card';
import type { OutcomeGroupEnum } from '../../../shared/types';
import { OUTCOME_GROUP_LABELS } from '../../../shared/types';
import { cn } from '../../../shared/lib/cn';

const GR_OPTIONS: OutcomeGroupEnum[] = ['gr-1', 'gr-2', 'gr-3'];

interface GrManualSelectProps {
  value: OutcomeGroupEnum | null;
  onChange: (gr: OutcomeGroupEnum) => void;
}

export function GrManualSelect({ value, onChange }: GrManualSelectProps) {
  return (
    <Card className="p-6">
      <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-3">
        Оберіть групу результатів
      </p>

      <div className="flex flex-col gap-2">
        {GR_OPTIONS.map((gr) => (
          <button
            key={gr}
            type="button"
            onClick={() => onChange(gr)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer bg-transparent',
              value === gr
                ? 'border-2 border-chalk-accent bg-[rgba(200,169,110,0.06)]'
                : 'border-chalk-border hover:border-chalk-accent hover:bg-[rgba(200,169,110,0.04)]',
            )}
          >
            <p className="text-[15px] font-medium text-chalk-header">
              {OUTCOME_GROUP_LABELS[gr]}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
}
