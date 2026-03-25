import { useEffect, useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { adminApi, type AdminUser } from '../api/adminApi';
import { UserRow } from '../components/UserRow';
import { BalanceModal } from '../components/BalanceModal';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';

const LIMIT = 20;

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [verified, setVerified] = useState<'' | 'true' | 'false'>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceUser, setBalanceUser] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUsers({
        page,
        limit: LIMIT,
        search: search || undefined,
        verified: verified || undefined,
      });
      setUsers(res.data.data.users);
      setTotal(res.data.data.total);
    } catch (err) {
      const msg = (err as AxiosError<{ message: string | string[] }>).response
        ?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Помилка завантаження'));
    } finally {
      setLoading(false);
    }
  }, [page, search, verified]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleUpdate = (userId: string, patch: Partial<AdminUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
    );
  };

  const handleBalanceSuccess = (userId: string, newBalance: number) => {
    handleUpdate(userId, { generationsBalance: newBalance });
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[1.5rem] font-semibold text-chalk-header">
            Користувачі
          </h2>
          <p className="text-sm text-chalk-muted mt-0.5">Всього: {total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-1 min-w-48">
          <Input
            placeholder="Пошук за email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="secondary" onClick={handleSearch}>
            Знайти
          </Button>
        </div>

        <select
          value={verified}
          onChange={(e) => {
            setVerified(e.target.value as '' | 'true' | 'false');
            setPage(1);
          }}
          className="border-[1.5px] border-chalk-border rounded-[8px] px-3 h-10 text-sm text-chalk-text bg-chalk-input-bg focus:outline-none focus:border-chalk-accent"
        >
          <option value="">Всі</option>
          <option value="true">Верифіковані</option>
          <option value="false">Не верифіковані</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-chalk-card rounded-[12px] border border-chalk-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner size={28} />
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert>{error}</Alert>
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-chalk-muted py-10 text-sm">
            Нічого не знайдено
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-chalk-sidebar border-b border-chalk-border">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-chalk-muted uppercase tracking-wide">
                  Email / Ім'я
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-chalk-muted uppercase tracking-wide text-center">
                  Верифікація
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-chalk-muted uppercase tracking-wide text-center">
                  Баланс
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-chalk-muted uppercase tracking-wide text-center">
                  Роль
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-chalk-muted uppercase tracking-wide text-center">
                  Дії
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-chalk-muted uppercase tracking-wide">
                  Реєстрація
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chalk-border">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onBalanceClick={setBalanceUser}
                  onUpdate={handleUpdate}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-chalk-muted">
          <span>
            Сторінка {page} з {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Попередня
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Наступна →
            </Button>
          </div>
        </div>
      )}

      {balanceUser && (
        <BalanceModal
          user={balanceUser}
          onClose={() => setBalanceUser(null)}
          onSuccess={handleBalanceSuccess}
        />
      )}
    </div>
  );
}
