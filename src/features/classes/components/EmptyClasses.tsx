import { Button } from '../../../shared/components/ui/Button';

interface EmptyClassesProps {
  onCreate: () => void;
}

export function EmptyClasses({ onCreate }: EmptyClassesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-4">📚</span>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
        Ще немає класів
      </h2>
      <p className="text-sm text-chalk-muted mb-6 max-w-[320px]">
        Створіть перший клас, щоб почати генерувати плани уроків та
        компетентнісні роботи
      </p>
      <Button onClick={onCreate}>Створити клас</Button>
    </div>
  );
}
