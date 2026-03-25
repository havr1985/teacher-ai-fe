interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      <div
        className={`text-xs font-medium uppercase tracking-wide mb-1 ${accent ? 'text-indigo-200' : 'text-gray-500'}`}
      >
        {label}
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && (
        <div
          className={`text-xs mt-1 ${accent ? 'text-indigo-200' : 'text-gray-400'}`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
