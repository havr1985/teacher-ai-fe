interface LessonPlanSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LessonPlanSection({ title, children }: LessonPlanSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface LessonPlanListSectionProps {
  title: string;
  items: string[];
}

export function LessonPlanListSection({
  title,
  items,
}: LessonPlanListSectionProps) {
  if (items.length === 0) return null;

  return (
    <LessonPlanSection title={title}>
      <ul className="list-none m-0 p-0 flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="text-[14px] text-chalk-text">
            • {item}
          </li>
        ))}
      </ul>
    </LessonPlanSection>
  );
}
