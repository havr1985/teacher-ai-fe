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
import { Input } from '../../../shared/components/ui/Input';
import { FormField } from '../../../shared/components/ui/FormField';
import { adminApi, type AdminUser } from '../api/adminApi';

interface BalanceModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuccess: (userId: string, newBalance: number) => void;
}

export function BalanceModal({ user, onClose, onSuccess }: BalanceModalProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numVal = parseInt(amount, 10);
  const preview = !isNaN(numVal) ? user.generationsBalance + numVal : null;

  const handleSubmit = async () => {
    setError(null);
    if (isNaN(numVal) || numVal === 0) {
      setError('Введіть ненульову кількість');
      return;
    }
    if (!note.trim()) {
      setError('Введіть причину зміни');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.updateBalance(user.id, numVal, note.trim());
      const newBalance = res.data.data.generationsBalance;
      toast.success(`Баланс оновлено: ${newBalance} генерацій`);
      onSuccess(user.id, newBalance);
      onClose();
    } catch (err) {
      const msg = (err as AxiosError<{ message: string | string[] }>).response
        ?.data?.message;
      setError(
        Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка оновлення балансу'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <ModalHeader title={`Баланс: ${user.email}`} onClose={onClose} />
      <ModalBody>
        <div className="space-y-4">
          {/* Current balance */}
          <div className="bg-chalk-sidebar rounded-[8px] p-3">
            <div className="text-xs text-chalk-muted mb-1">Поточний баланс</div>
            <div className="text-2xl font-semibold text-chalk-header">
              {user.generationsBalance}
            </div>
          </div>

          {/* Amount */}
          <FormField
            id="amount"
            label="Зміна (додатня або від'ємна)"
            error={error ?? undefined}
          >
            <Input
              id="amount"
              type="number"
              placeholder="+50 або -10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={!!error}
            />
          </FormField>

          {preview !== null && numVal !== 0 && (
            <p className="text-sm text-chalk-muted -mt-2">
              Новий баланс:{' '}
              <span
                className={
                  preview < 0
                    ? 'text-chalk-error font-medium'
                    : 'text-chalk-accent font-medium'
                }
              >
                {preview}
              </span>
            </p>
          )}

          {/* Note */}
          <FormField id="note" label="Причина (для журналу)">
            <Input
              id="note"
              placeholder="Наприклад: бонус за відгук"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </FormField>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          Скасувати
        </Button>
        <Button size="sm" onClick={handleSubmit} loading={loading}>
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
