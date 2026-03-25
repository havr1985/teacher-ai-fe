interface BarData {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: BarData[];
  color?: string;
  height?: number;
}

export function MiniBarChart({
  data,
  color = '#6366f1',
  height = 80,
}: MiniBarChartProps) {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((d, i) => {
        const barHeight = Math.max(
          (d.value / max) * height,
          d.value > 0 ? 2 : 0,
        );
        return (
          <div key={i} className="flex-1 relative group" style={{ height }}>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {d.label}: {d.value}
              </div>
            </div>
            {/* Bar */}
            <div
              className="absolute bottom-0 inset-x-0 rounded-t-sm transition-all"
              style={{
                height: barHeight,
                backgroundColor: color,
                opacity: d.value > 0 ? 1 : 0.15,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
