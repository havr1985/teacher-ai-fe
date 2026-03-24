import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/auth.store';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Spinner } from '../../../shared/components/ui/Spinner';

type Status = 'loading' | 'success' | 'error' | 'no-token';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'no-token');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    authApi
      .verifyEmail(token)
      .then((res) => {
        setMessage(res.data.data.message);
        setStatus('success');

        // Update user in store if logged in
        const { token: authToken } = useAuthStore.getState();
        if (authToken) {
          authApi.me().then((meRes) => {
            useAuthStore.getState().updateUser(meRes.data.data);
          });
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message?.[0] ??
          err?.response?.data?.message ??
          'Не вдалося підтвердити email';
        setMessage(Array.isArray(msg) ? msg[0] : msg);
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-chalk-bg flex items-center justify-center p-6">
      <Card className="max-w-[440px] w-full p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <Spinner size={28} />
            </div>
            <p className="text-sm text-chalk-muted">Перевіряємо...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <span className="text-4xl mb-4 block">✅</span>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
              Email підтверджено!
            </h1>
            <p className="text-sm text-chalk-muted mb-6">{message}</p>
            <Link to="/" className="no-underline">
              <Button>Перейти до кабінету</Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="text-4xl mb-4 block">❌</span>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
              Помилка верифікації
            </h1>
            <p className="text-sm text-chalk-muted mb-6">{message}</p>
            <Link to="/" className="no-underline">
              <Button variant="secondary">На головну</Button>
            </Link>
          </>
        )}

        {status === 'no-token' && (
          <>
            <span className="text-4xl mb-4 block">🔗</span>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
              Невірне посилання
            </h1>
            <p className="text-sm text-chalk-muted mb-6">
              Посилання для верифікації не містить токен. Перевірте лист.
            </p>
            <Link to="/" className="no-underline">
              <Button variant="secondary">На головну</Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
