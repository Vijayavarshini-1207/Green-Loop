import { Line, LineChart, ResponsiveContainer } from 'recharts';

type Props = {
  data: number[];
  color?: string;
  height?: number;
};

export function MiniSparkline({ data, color = 'hsl(var(--primary))', height = 40 }: Props) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
