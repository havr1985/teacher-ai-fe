import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ─── Types matching backend TaskChart ────────────────────────────────────────

interface BarChartData {
  type: 'bar';
  labels: string[];
  values: number[];
  unit?: string;
  yLabel?: string;
}

interface PieChartData {
  type: 'pie';
  segments: Array<{ label: string; value: number }>;
  unit?: string;
}

interface LineChartData {
  type: 'line';
  xLabel?: string;
  yLabel?: string;
  points: Array<{ x: string; y: number }>;
  normalRange?: { min: number; max: number };
}

interface TaskChart {
  title: string;
  data: BarChartData | PieChartData | LineChartData;
}

// ─── Colors ──────────────────────────────────────────────────────────────────

const BAR_COLOR = '#2E75B6';
const PIE_COLORS = [
  '#2E75B6',
  '#E06B50',
  '#5AAE61',
  '#C8A96E',
  '#8B6DB0',
  '#E8A838',
];
const LINE_COLOR = '#2E75B6';

// ─── Component ───────────────────────────────────────────────────────────────

interface TaskChartBlockProps {
  chart: TaskChart;
}

export function TaskChartBlock({ chart }: TaskChartBlockProps) {
  return (
    <div className="my-4 bg-chalk-sidebar rounded-lg p-4 border border-chalk-border">
      <p className="text-[13px] font-medium text-chalk-header mb-3 text-center">
        {chart.title}
      </p>
      <div className="flex justify-center">
        {chart.data.type === 'bar' && <BarChartView data={chart.data} />}
        {chart.data.type === 'pie' && <PieChartView data={chart.data} />}
        {chart.data.type === 'line' && <LineChartView data={chart.data} />}
      </div>
    </div>
  );
}

// ─── Bar ─────────────────────────────────────────────────────────────────────

function BarChartView({ data }: { data: BarChartData }) {
  const chartData = data.labels.map((label, i) => ({
    name: label,
    value: data.values[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#666' }}
          label={
            data.unit
              ? {
                  value: data.unit,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#999' },
                }
              : undefined
          }
        />
        <Tooltip
          formatter={(value: number) =>
            data.unit
              ? `${value.toLocaleString('uk-UA')} ${data.unit}`
              : value.toLocaleString('uk-UA')
          }
        />
        <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Pie ─────────────────────────────────────────────────────────────────────

function PieChartView({ data }: { data: PieChartData }) {
  const unit = data.unit ?? '%';

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data.segments}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ label, value }: { label: string; value: number }) =>
            `${label}: ${value}${unit}`
          }
        >
          {data.segments.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`${value}${unit}`, name]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Line ────────────────────────────────────────────────────────────────────

function LineChartView({ data }: { data: LineChartData }) {
  const chartData = data.points.map((p) => ({ name: p.x, value: p.y }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#666' }}
          label={
            data.xLabel
              ? {
                  value: data.xLabel,
                  position: 'insideBottom',
                  offset: -5,
                  style: { fontSize: 11, fill: '#999' },
                }
              : undefined
          }
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#666' }}
          label={
            data.yLabel
              ? {
                  value: data.yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#999' },
                }
              : undefined
          }
        />
        {data.normalRange && (
          <>
            <ReferenceLine
              y={data.normalRange.min}
              stroke="#5AAE61"
              strokeDasharray="5 5"
              label={{
                value: 'мін. норма',
                position: 'right',
                style: { fontSize: 10, fill: '#5AAE61' },
              }}
            />
            <ReferenceLine
              y={data.normalRange.max}
              stroke="#5AAE61"
              strokeDasharray="5 5"
              label={{
                value: 'макс. норма',
                position: 'right',
                style: { fontSize: 10, fill: '#5AAE61' },
              }}
            />
          </>
        )}
        <Tooltip
          formatter={(value: number) =>
            data.yLabel ? `${value} ${data.yLabel}` : value
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={LINE_COLOR}
          strokeWidth={2}
          dot={{ fill: LINE_COLOR, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
