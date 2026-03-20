import type { LessonStage } from '../../../shared/types';

interface LessonPlanStagesTableProps {
  stages: LessonStage[];
}

export function LessonPlanStagesTable({ stages }: LessonPlanStagesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[14px] border-collapse">
        <thead>
          <tr className="border-b-2 border-chalk-border">
            <th className="text-left py-2.5 px-3 text-[12px] font-medium text-chalk-muted uppercase tracking-wider w-[180px]">
              Етап
            </th>
            <th className="text-left py-2.5 px-3 text-[12px] font-medium text-chalk-muted uppercase tracking-wider w-[60px]">
              Час
            </th>
            <th className="text-left py-2.5 px-3 text-[12px] font-medium text-chalk-muted uppercase tracking-wider">
              Діяльність учнів
            </th>
            <th className="text-left py-2.5 px-3 text-[12px] font-medium text-chalk-muted uppercase tracking-wider">
              Дії вчителя
            </th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage, i) => (
            <tr
              key={i}
              className="border-b border-chalk-border last:border-b-0"
            >
              <td className="py-3 px-3 align-top font-medium text-chalk-header">
                {stage.name}
              </td>
              <td className="py-3 px-3 align-top text-chalk-muted whitespace-nowrap">
                {stage.duration_minutes} хв
              </td>
              <td className="py-3 px-3 align-top text-chalk-text">
                <ul className="list-none m-0 p-0 flex flex-col gap-1">
                  {stage.activities.map((a, j) => (
                    <li key={j}>• {a}</li>
                  ))}
                </ul>
              </td>
              <td className="py-3 px-3 align-top text-chalk-text">
                <ul className="list-none m-0 p-0 flex flex-col gap-1">
                  {stage.teacher_actions.map((a, j) => (
                    <li key={j}>• {a}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
