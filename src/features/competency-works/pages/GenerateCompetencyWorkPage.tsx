import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { competencyWorksApi } from '../api/competencyWorksApi';
import { classesApi } from '../../classes/api/classesApi';
import { GrSuggestionCard } from '../components/GrSuggestionCard';
import { GrManualSelect } from '../components/GrManualSelect';
import { TaskCountsForm } from '../components/TaskCountsForm';
import { useAuthUpdateUser } from '../../auth/store/auth.selectors';
import { authApi } from '../../auth/api/authApi';

import { Card } from '../../../shared/components/ui/Card';
import { FormField } from '../../../shared/components/ui/FormField';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Spinner } from '../../../shared/components/ui/Spinner';
import type {
  ClassEntity,
  OutcomeGroupEnum,
  SuggestGrResponse,
} from '../../../shared/types';
import { OUTCOME_GROUP_SHORT } from '../../../shared/types';

type Step = 'input' | 'suggesting' | 'choose-gr' | 'configure' | 'generating';

/**
 * AI may return "gr1", "gr2", "gr3" without hyphens.
 * Backend enum expects "gr-1", "gr-2", "gr-3".
 */
function normalizeGr(value: string): OutcomeGroupEnum {
  const map: Record<string, OutcomeGroupEnum> = {
    gr1: 'gr-1',
    gr2: 'gr-2',
    gr3: 'gr-3',
    'gr-1': 'gr-1',
    'gr-2': 'gr-2',
    'gr-3': 'gr-3',
  };
  return map[value] ?? 'gr-1';
}

function normalizeSuggestion(raw: SuggestGrResponse): SuggestGrResponse {
  return {
    ...raw,
    suggested: normalizeGr(raw.suggested),
    alternative: raw.alternative ? normalizeGr(raw.alternative) : undefined,
  };
}

export default function GenerateCompetencyWorkPage() {
  const navigate = useNavigate();
  const updateUser = useAuthUpdateUser();

  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [classId, setClassId] = useState('');
  const [topic, setTopic] = useState('');

  const [step, setStep] = useState<Step>('input');
  const [suggestion, setSuggestion] = useState<SuggestGrResponse | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [selectedGr, setSelectedGr] = useState<OutcomeGroupEnum | null>(null);
  const [taskCounts, setTaskCounts] = useState({
    level1Count: 2,
    level2Count: 2,
    level3Count: 1,
  });

  const selectedClass = classes.find((c) => c.id === classId);

  useEffect(() => {
    classesApi
      .getAll()
      .then((res) => setClasses(res.data.data))
      .catch(() => setError('Не вдалося завантажити класи'))
      .finally(() => setLoading(false));
  }, []);

  // ─── Step 1: Ask Claude for ГР suggestion ───────────────────────────

  const handleSuggestGr = async () => {
    if (!classId || !topic.trim() || !selectedClass) return;

    setError(null);
    setStep('suggesting');

    try {
      const res = await competencyWorksApi.suggestGr({
        classId,
        subjectId: selectedClass.subject.id,
        topic: topic.trim(),
      });
      setSuggestion(normalizeSuggestion(res.data.data));
      setStep('choose-gr');
    } catch (err) {
      const msg = (err as AxiosError<{ message: string | string[] }>).response
        ?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка підбору ГР'));
      setStep('input');
    }
  };

  // ─── Step 2: Select ГР and configure ────────────────────────────────

  const handleSelectGr = (gr: OutcomeGroupEnum) => {
    setSelectedGr(gr);
    setShowManual(false);
    setStep('configure');
  };

  const handleShowManual = () => {
    setShowManual(true);
    setSelectedGr(null);
  };

  const handleManualSelect = (gr: OutcomeGroupEnum) => {
    setSelectedGr(gr);
    setStep('configure');
  };

  // ─── Step 3: Generate ───────────────────────────────────────────────

  const handleGenerate = async (forceNew = false) => {
    if (!selectedClass || !selectedGr) return;

    setError(null);
    setStep('generating');

    try {
      const res = await competencyWorksApi.generate({
        classId,
        subjectId: selectedClass.subject.id,
        topic: topic.trim(),
        outcomeGroup: selectedGr,
        ...taskCounts,
        forceNew,
      });
      const work = res.data.data;

      try {
        const meRes = await authApi.me();
        updateUser(meRes.data.data);
      } catch {
        /* non-critical */
      }

      navigate(`/competency-works/${work.id}`, { state: { work } });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string | string[] }>;
      const msg = axiosErr.response?.data?.message;
      if (axiosErr.response?.status === 403) {
        setError('Недостатньо генерацій. Поповніть баланс.');
      } else {
        setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка генерації'));
      }
      setStep('configure');
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-[560px] mx-auto">
      <Link
        to="/competency-works"
        className="inline-flex items-center gap-1.5 text-sm text-chalk-muted no-underline hover:text-chalk-accent mb-4"
      >
        ← Компетентнісні роботи
      </Link>

      <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold text-chalk-header tracking-tight mb-6">
        Нова компетентнісна робота
      </h1>

      {classes.length === 0 ? (
        <Alert variant="warning">
          Спочатку{' '}
          <Link to="/classes" className="text-chalk-accent underline">
            створіть клас
          </Link>
          .
        </Alert>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Step 1: Class + Topic */}
          <Card className="p-6">
            <p className="text-[13px] font-medium text-chalk-muted uppercase tracking-[0.06em] mb-4">
              Крок 1 — Тема
            </p>

            <div className="flex flex-col gap-4">
              <FormField id="classId" label="Клас">
                <Select
                  id="classId"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  disabled={step !== 'input'}
                >
                  <option value="">Оберіть клас</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.subject.name} ({c.grade} кл.)
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField id="topic" label="Тема">
                <Input
                  id="topic"
                  placeholder="Наприклад: Будова крові"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={step !== 'input'}
                />
              </FormField>

              {step === 'input' && (
                <Button
                  onClick={handleSuggestGr}
                  disabled={!classId || !topic.trim()}
                  fullWidth
                >
                  Підібрати ГР
                </Button>
              )}

              {step === 'suggesting' && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <Spinner size={18} />
                  <span className="text-[13px] text-chalk-muted">
                    AI підбирає групу результатів...
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Step 2: Choose ГР */}
          {step === 'choose-gr' && suggestion && !showManual && (
            <GrSuggestionCard
              suggestion={suggestion}
              onSelect={handleSelectGr}
              onManual={handleShowManual}
            />
          )}

          {showManual && (
            <GrManualSelect value={selectedGr} onChange={handleManualSelect} />
          )}

          {/* Step 3: Configure task counts */}
          {(step === 'configure' || step === 'generating') && selectedGr && (
            <>
              <div className="px-4 py-2.5 rounded-lg bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.2)]">
                <p className="text-[14px] text-chalk-header">
                  Обрано: <strong>{OUTCOME_GROUP_SHORT[selectedGr]}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('choose-gr');
                      setSelectedGr(null);
                    }}
                    className="ml-2 text-[13px] text-chalk-accent underline bg-transparent border-none cursor-pointer"
                  >
                    Змінити
                  </button>
                </p>
              </div>

              <TaskCountsForm value={taskCounts} onChange={setTaskCounts} />

              <Button
                onClick={() => handleGenerate(false)}
                fullWidth
                loading={step === 'generating'}
              >
                {step === 'generating' ? 'Генерація...' : 'Згенерувати роботу'}
              </Button>

              {step === 'generating' && (
                <p className="text-center text-[13px] text-chalk-muted">
                  Зазвичай займає 15–30 секунд
                </p>
              )}
            </>
          )}

          {error && <Alert className="mt-2">{error}</Alert>}
        </div>
      )}
    </div>
  );
}
