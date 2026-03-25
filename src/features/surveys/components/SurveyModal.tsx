import { useState } from 'react';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { surveysApi, type SurveyTrigger } from '../api/surveyApi';

interface SurveyModalProps {
  trigger: SurveyTrigger;
  onClose: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Щодня' },
  { value: 'weekly', label: 'Щотижня' },
  { value: 'monthly', label: 'Раз на місяць' },
  { value: 'rarely', label: 'Рідко' },
];

const FEATURE_OPTIONS = [
  { value: 'lesson', label: '📋 Плани уроків' },
  { value: 'competency', label: '📝 Компетентнісні роботи' },
  { value: 'both', label: '🌟 Обидва однаково' },
];

export function SurveyModal({ trigger, onClose }: SurveyModalProps) {
  const [frequency, setFrequency] = useState('');
  const [favoriteFeature, setFavoriteFeature] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await surveysApi.submit({
        trigger,
        frequency: frequency || undefined,
        favoriteFeature: favoriteFeature || undefined,
        feedback: feedback.trim() || undefined,
      });
      toast.success('Дякуємо за відгук! 🎉');
      onClose();
    } catch (err) {
      const msg = (err as AxiosError<{ message: string | string[] }>).response
        ?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка надсилання'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <ModalHeader title="Як вам TeacherAI? 👋" onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-chalk-muted mb-5">
          Займе 30 секунд. Ваш відгук допоможе зробити продукт кращим.
        </p>

        {/* Frequency */}
        <div className="mb-5">
          <p className="text-sm font-medium text-chalk-text mb-2">
            Як часто використовуєте TeacherAI?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFrequency(opt.value)}
                className={`py-2 px-3 rounded-[8px] text-sm border transition-colors text-left ${
                  frequency === opt.value
                    ? 'border-chalk-accent bg-chalk-accent/10 text-chalk-accent font-medium'
                    : 'border-chalk-border text-chalk-muted hover:border-chalk-accent/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite feature */}
        <div className="mb-5">
          <p className="text-sm font-medium text-chalk-text mb-2">
            Яка фіча найкорисніша?
          </p>
          <div className="space-y-2">
            {FEATURE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFavoriteFeature(opt.value)}
                className={`w-full py-2 px-3 rounded-[8px] text-sm border text-left transition-colors ${
                  favoriteFeature === opt.value
                    ? 'border-chalk-accent bg-chalk-accent/10 text-chalk-accent font-medium'
                    : 'border-chalk-border text-chalk-muted hover:border-chalk-accent/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Free text */}
        <div>
          <label className="text-sm font-medium text-chalk-text">
            Що можна покращити?{' '}
            <span className="text-chalk-muted font-normal">
              (необов'язково)
            </span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ваші думки..."
            rows={3}
            maxLength={2000}
            className="mt-1.5 w-full border-[1.5px] border-chalk-border rounded-[8px] px-3 py-2 text-sm text-chalk-text placeholder:text-chalk-muted focus:outline-none focus:border-chalk-accent bg-chalk-input-bg resize-none"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
          Пропустити
        </Button>
        <Button size="sm" onClick={handleSubmit} loading={loading}>
          Надіслати
        </Button>
      </ModalFooter>
    </Modal>
  );
}
