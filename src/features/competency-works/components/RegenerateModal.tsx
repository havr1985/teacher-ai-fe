import { useState } from 'react';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Textarea } from '../../../shared/components/ui/Textarea';

interface RegenerateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  loading: boolean;
}

export function RegenerateModal({
  open,
  onClose,
  onConfirm,
  loading,
}: RegenerateModalProps) {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
  };

  const handleClose = () => {
    if (!loading) {
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Перегенерувати роботу" onClose={handleClose} />
      <ModalBody>
        <p className="text-sm text-chalk-muted mb-4">
          Claude створить новий варіант з іншими сценаріями та завданнями.
        </p>

        <div className="mb-3">
          <label
            htmlFor="regen-notes"
            className="block text-sm font-medium text-chalk-text mb-1.5"
          >
            Що змінити?{' '}
            <span className="font-normal text-chalk-muted">
              (необов'язково)
            </span>
          </label>
          <Textarea
            id="regen-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Наприклад: спрости сценарії рівня 1, додай завдання з малюнком, зроби сценарії про тварин..."
            maxLength={500}
            rows={3}
            disabled={loading}
          />
          <p className="text-xs text-chalk-muted mt-1 text-right">
            {notes.length}/500
          </p>
        </div>

        <div className="bg-chalk-sidebar rounded-[8px] px-3 py-2.5 flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <p className="text-[13px] text-chalk-muted">
            Буде списана 1 генерація. Попередній варіант залишиться в
            бібліотеці.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClose}
          disabled={loading}
        >
          Скасувати
        </Button>
        <Button size="sm" onClick={handleConfirm} loading={loading}>
          Перегенерувати
        </Button>
      </ModalFooter>
    </Modal>
  );
}
