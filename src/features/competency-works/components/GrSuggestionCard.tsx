import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import type {
  OutcomeGroupEnum,
  SuggestGrResponse,
} from '../../../shared/types';
import { OUTCOME_GROUP_LABELS } from '../../../shared/types';

interface GrSuggestionCardProps {
  suggestion: SuggestGrResponse;
  onSelect: (gr: OutcomeGroupEnum) => void;
  onManual: () => void;
}

export function GrSuggestionCard({
  suggestion,
  onSelect,
  onManual,
}: GrSuggestionCardProps) {
  return (
    <Card className="p-6">
      <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-4">
        AI рекомендує
      </p>

      {/* Main suggestion */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => onSelect(suggestion.suggested)}
          className="w-full text-left px-4 py-3 rounded-lg border-2 border-chalk-accent bg-[rgba(200,169,110,0.06)] transition-all hover:bg-[rgba(200,169,110,0.12)] cursor-pointer"
        >
          <p className="text-[15px] font-medium text-chalk-header mb-1">
            {OUTCOME_GROUP_LABELS[suggestion.suggested]}
          </p>
          <p className="text-[13px] text-chalk-muted leading-relaxed">
            {suggestion.reasoning}
          </p>
        </button>
      </div>

      {/* Alternative */}
      {suggestion.alternative && (
        <div className="mb-4">
          <p className="text-[12px] text-chalk-muted uppercase tracking-wider mb-2">
            Альтернатива
          </p>
          <button
            type="button"
            onClick={() => onSelect(suggestion.alternative!)}
            className="w-full text-left px-4 py-3 rounded-lg border border-chalk-border transition-all hover:border-chalk-accent hover:bg-[rgba(200,169,110,0.04)] cursor-pointer bg-transparent"
          >
            <p className="text-[15px] font-medium text-chalk-header mb-1">
              {OUTCOME_GROUP_LABELS[suggestion.alternative]}
            </p>
            {suggestion.alternative_reasoning && (
              <p className="text-[13px] text-chalk-muted leading-relaxed">
                {suggestion.alternative_reasoning}
              </p>
            )}
          </button>
        </div>
      )}

      {/* Manual choice */}
      <div className="pt-2 border-t border-chalk-border">
        <Button variant="ghost" size="sm" onClick={onManual}>
          Обрати іншу ГР вручну
        </Button>
      </div>
    </Card>
  );
}
