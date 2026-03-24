import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../../../features/auth/api/authApi';
import { useUser } from '../../../features/auth/store/auth.selectors';
import { Button } from './Button';

export function VerificationBanner() {
  const user = useUser();
  const [sending, setSending] = useState(false);

  if (!user || user.isVerified) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await authApi.resendVerification();
      toast.success('Лист надіслано повторно');
    } catch {
      toast.error('Не вдалося надіслати лист');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[rgba(200,169,110,0.12)] border-b border-[rgba(200,169,110,0.25)] px-6 py-2.5 flex items-center justify-center gap-3">
      <span className="text-[13px] text-chalk-text">
        📧 Підтвердіть email <strong>{user.email}</strong> для отримання 10
        безкоштовних генерацій
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleResend}
        loading={sending}
        className="text-chalk-accent hover:text-chalk-accent-hover text-[13px]"
      >
        Надіслати ще раз
      </Button>
    </div>
  );
}
