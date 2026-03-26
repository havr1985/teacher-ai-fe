import type { CompetencyWorkLevel } from '../../../shared/types';
import { TaskChartBlock } from './TaskChartBlock';

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-[#EAF3DE]', // green
  2: 'bg-[#E6F1FB]', // blue
  3: 'bg-[#FAEEDA]', // yellow
};

// ─── Markdown table parser ───────────────────────────────────────────────────

type ScenarioSegment =
  | { type: 'text'; content: string }
  | { type: 'table'; rows: string[][] };

function parseScenarioSegments(scenario: string): ScenarioSegment[] {
  const lines = scenario.split('\n');
  const segments: ScenarioSegment[] = [];
  let textBuffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushText = () => {
    if (textBuffer.length > 0) {
      const text = textBuffer.join('\n').trim();
      if (text) segments.push({ type: 'text', content: text });
      textBuffer = [];
    }
  };

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const rows = tableBuffer
        .filter((line) => !/^\|[\s\-:|]+\|$/.test(line)) // skip separator
        .map((line) =>
          line
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim()),
        );
      if (rows.length > 0) segments.push({ type: 'table', rows });
      tableBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushText();
      tableBuffer.push(trimmed);
    } else {
      flushTable();
      textBuffer.push(line);
    }
  }

  flushText();
  flushTable();

  return segments;
}

// ─── Scenario renderer ───────────────────────────────────────────────────────

function ScenarioBlock({ scenario }: { scenario: string }) {
  const segments = parseScenarioSegments(scenario);

  return (
    <div className="mb-3">
      {segments.map((segment, i) => {
        if (segment.type === 'text') {
          return (
            <p
              key={i}
              className="text-[14px] text-chalk-text italic leading-relaxed mb-2 last:mb-0"
            >
              {segment.content}
            </p>
          );
        }

        // Table
        const [header, ...body] = segment.rows;
        return (
          <div key={i} className="my-3 overflow-x-auto">
            <table className="w-full text-[13px] border-collapse border border-chalk-border">
              {header && (
                <thead>
                  <tr className="bg-chalk-sidebar">
                    {header.map((cell, j) => (
                      <th
                        key={j}
                        className="border border-chalk-border px-3 py-2 text-left font-medium text-chalk-header"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="border border-chalk-border px-3 py-2 text-chalk-text"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

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

            {/* Scenario — with table support */}
            {task.scenario && <ScenarioBlock scenario={task.scenario} />}

            {/* Image placeholder */}
            {task.image && (
              <p className="text-[13px] text-chalk-muted italic mb-3">
                [Зображення: {task.image.description}]
              </p>
            )}

            {/* Chart */}
            {task.chart && <TaskChartBlock chart={task.chart} />}

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
