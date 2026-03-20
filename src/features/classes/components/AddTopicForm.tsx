import { useState } from 'react';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

interface AddTopicFormProps {
  onAdd: (topic: string, date: string) => Promise<void>;
}

export function AddTopicForm({ onAdd }: AddTopicFormProps) {
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await onAdd(trimmed, date);
      setTopic('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Назва теми, наприклад: Будова крові"
        />
      </div>

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-[160px]"
      />

      <Button
        type="submit"
        size="md"
        loading={loading}
        disabled={!topic.trim()}
      >
        Додати
      </Button>
    </form>
  );
}
