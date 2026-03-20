import type { CompetencyWorkLevel } from '../../../shared/types';

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-[#EAF3DE]', // green
  2: 'bg-[#E6F1FB]', // blue
  3: 'bg-[#FAEEDA]', // yellow
};

interface CompetencyLevelBlockProps {
  level: CompetencyWorkLevel;
}

export function CompetencyLevelBlock({ level }: CompetencyLevelBlockProps) {
  const bgColor = LEVEL_COLORS[level.level] ?? 'bg-chalk-sidebar';

  return (
    <div className="mb-6 last:mb-0">
      {/* Level header */}
      <div className={`px-4 py-2.5 rounded-t-lg ${bgColor}`}>
        <p className="text-[14px] font-medium text-chalk-header">
          Рівень {level.level} — {level.label}
          <span className="text-chalk-muted font-normal ml-2">
            ___ / {level.max_score} балів
          </span>
        </p>
      </div>

      {/* Tasks */}
      <div className="border border-t-0 border-chalk-border rounded-b-lg px-5 py-4">
        {level.tasks.map((task, i) => (
          <div
            key={i}
            className={`${i > 0 ? 'mt-5 pt-5 border-t border-chalk-border' : ''}`}
          >
            {/* Task title */}
            <p className="text-[14px] font-medium text-chalk-header mb-2">
              Завдання {task.number}. {task.title}
            </p>

            {/* Scenario */}
            {task.scenario && (
              <p className="text-[14px] text-chalk-text italic mb-3 leading-relaxed">
                {task.scenario}
              </p>
            )}

            {/* Image placeholder */}
            {task.image && (
              <p className="text-[13px] text-chalk-muted italic mb-3">
                [Зображення: {task.image.description}]
              </p>
            )}

            {/* Questions */}
            {task.type === 'open' ? (
              <div className="flex flex-col gap-2">
                {(task.questions as string[]).map((q, j) => (
                  <p key={j} className="text-[14px] text-chalk-text">
                    {j + 1}. {q}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(
                  task.questions as Array<{ text: string; options: string[] }>
                ).map((q, j) => (
                  <div key={j}>
                    <p className="text-[14px] text-chalk-text mb-1.5">
                      {j + 1}. {q.text}
                    </p>
                    <div className="flex flex-col gap-0.5 pl-4">
                      {q.options.map((opt, k) => (
                        <p key={k} className="text-[14px] text-chalk-muted">
                          {opt}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
