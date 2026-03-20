import { Button } from '../../../shared/components/ui/Button';
import type { CoveredTopic } from '../../../shared/types';

interface TopicRowProps {
  topic: CoveredTopic;
  onDelete: (topic: CoveredTopic) => void;
}

export function TopicRow({ topic, onDelete }: TopicRowProps) {
  const date = new Date(topic.coveredAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isGenerated = topic.source === 'generated';

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-chalk-border last:border-b-0">
      <span
        className="shrink-0 text-[13px]"
        title={isGenerated ? 'Додано автоматично' : 'Додано вручну'}
      >
        {isGenerated ? '⚡' : '✏️'}
      </span>

      <p className="flex-1 text-[15px] text-chalk-text min-w-0 truncate">
        {topic.topic}
      </p>

      <span className="shrink-0 text-[13px] text-chalk-muted">{date}</span>

      {!isGenerated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(topic)}
          className="text-chalk-error hover:text-chalk-error shrink-0"
        >
          ×
        </Button>
      )}
    </div>
  );
}
