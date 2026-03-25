import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { competencyWorksApi } from '../api/competencyWorksApi';
import { classesApi } from '../../classes/api/classesApi';
import { authApi } from '../../auth/api/authApi';
import { useAuthUpdateUser } from '../../auth/store/auth.selectors';

import { GrSuggestionCard } from '../components/GrSuggestionCard';
import { GrManualSelect } from '../components/GrManualSelect';
import { TaskCountsForm } from '../components/TaskCountsForm';
import { SurveyModal } from '../../surveys/components/SurveyModal';
import { useSurveyTrigger } from '../../surveys/hooks/useSurveyTrigger';

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
import type { SurveyTrigger } from '../../surveys/api/surveyApi';

type Step = 'input' | 'suggesting' | 'choose-gr' | 'configure' | 'generating';

interface TaskCounts {
  level1Count: number;
  level2Count: number;
  level3Count: number;
}

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
  const { shouldShowSurvey, markShown } = useSurveyTrigger();

  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [classId, setClassId] = useState('');
  const [topic, setTopic] = useState('');

  const [step, setStep] = useState<Step>('input');
  const [suggestion, setSuggestion] = useState<SuggestGrResponse | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [selectedGr, setSelectedGr] = useState<OutcomeGroupEnum | null>(null);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({
    level1Count: 2,
    level2Count: 2,
    level3Count: 1,
  });

  const [surveyTrigger, setSurveyTrigger] = useState<SurveyTrigger | null>(
    null,
  );
  const [generatedWorkId, setGeneratedWorkId] = useState<string | null>(null);

  const selectedClass = classes.find((c) => c.id === classId);

  useEffect(() => {
    classesApi
      .getAll()
      .then((res) => setClasses(res.data.data))
      .catch(() => setError('Не вдалося завантажити класи'))
      .finally(() => setLoading(false));
  }, []);

  // ─── Step 1: Suggest ГР ──────────────────────────────────────────────

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

  // ─── Step 2: Select ГР ───────────────────────────────────────────────
  // GrSuggestionCard props: suggestion, onSelect, onManual

  const handleSelectGr = (gr: OutcomeGroupEnum) => {
    setSelectedGr(gr);
    setShowManual(false);
    setStep('configure');
  };

  const handleShowManual = () => {
    setShowManual(true);
    setSelectedGr(null);
  };

  // GrManualSelect props: value, onChange

  const handleManualSelect = (gr: OutcomeGroupEnum) => {
    setSelectedGr(gr);
    setStep('configure');
  };

  // ─── Step 3: Generate ────────────────────────────────────────────────

  const handleGenerate = async () => {
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
      });
      const work = res.data.data;

      // Refresh user balance
      try {
        const meRes = await authApi.me();
        const freshUser = meRes.data.data;
        updateUser(freshUser);

        const trigger = shouldShowSurvey(freshUser.generationsBalance);
        if (trigger) {
          markShown();
          setGeneratedWorkId(work.id);
          setSurveyTrigger(trigger);
          return;
        }
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

  const handleSurveyClose = () => {
    setSurveyTrigger(null);
    navigate(
      generatedWorkId
        ? `/competency-works/${generatedWorkId}`
        : '/competency-works',
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <>
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

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {classes.length === 0 ? (
          <Alert variant="warning">
            Спочатку{' '}
            <Link to="/classes" className="text-chalk-accent underline">
              створіть клас
            </Link>
            .
          </Alert>
        ) : (
          <>
            {/* ── input / suggesting ─────────────────────────────────── */}
            {(step === 'input' || step === 'suggesting') && (
              <Card className="p-6">
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
                          {c.name} — {c.subject.nameShort}
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
                      onClick={() => void handleSuggestGr()}
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
            )}

            {/* ── choose-gr ─────────────────────────────────────────── */}
            {step === 'choose-gr' && suggestion && !showManual && (
              <GrSuggestionCard
                suggestion={suggestion}
                onSelect={handleSelectGr}
                onManual={handleShowManual}
              />
            )}

            {showManual && (
              <GrManualSelect
                value={selectedGr}
                onChange={handleManualSelect}
              />
            )}

            {/* ── configure / generating ────────────────────────────── */}
            {(step === 'configure' || step === 'generating') && selectedGr && (
              <>
                <div className="px-4 py-2.5 rounded-lg bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.2)] mb-4">
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

                {/* TaskCountsForm props: value, onChange */}
                <TaskCountsForm value={taskCounts} onChange={setTaskCounts} />

                <Button
                  onClick={() => void handleGenerate()}
                  fullWidth
                  loading={step === 'generating'}
                  className="mt-4"
                >
                  {step === 'generating' ? 'Генерується...' : '✨ Згенерувати'}
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {surveyTrigger && (
        <SurveyModal trigger={surveyTrigger} onClose={handleSurveyClose} />
      )}
    </>
  );
}
