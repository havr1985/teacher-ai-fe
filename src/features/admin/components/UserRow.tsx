import { useState } from 'react';
import { type AdminUser, adminApi } from '../api/adminApi';
import toast from 'react-hot-toast';

interface UserRowProps {
  user: AdminUser;
  onBalanceClick: (user: AdminUser) => void;
  onUpdate: (userId: string, patch: Partial<AdminUser>) => void;
}

export function UserRow({ user, onBalanceClick, onUpdate }: UserRowProps) {
  const [toggling, setToggling] = useState(false);

  const handleToggleBlock = async () => {
    setToggling(true);
    try {
      if (user.isBlocked) {
        await adminApi.unblockUser(user.id);
        toast.success('Користувача розблоковано');
        onUpdate(user.id, { isBlocked: false });
      } else {
        await adminApi.blockUser(user.id);
        toast.success('Користувача заблоковано');
        onUpdate(user.id, { isBlocked: true });
      }
    } catch {
      toast.error('Помилка операції');
    } finally {
      setToggling(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-800">{user.email}</div>
        <div className="text-xs text-gray-400">
          {user.firstName} {user.lastName}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {user.isVerified ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ✓ Верифікований
          </span>
        ) : (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            ⏳ Очікує
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onBalanceClick(user)}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
        >
          {user.generationsBalance}
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        {user.role === 'admin' ? (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            admin
          </span>
        ) : (
          <span className="text-xs text-gray-400">user</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {user.role !== 'admin' && (
          <button
            onClick={handleToggleBlock}
            disabled={toggling}
            className={`text-xs px-3 py-1 rounded-md font-medium transition-colors disabled:opacity-50 ${
              user.isBlocked
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {toggling ? '...' : user.isBlocked ? 'Розблокувати' : 'Заблокувати'}
          </button>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">
        {new Date(user.createdAt).toLocaleDateString('uk-UA')}
      </td>
    </tr>
  );
}
