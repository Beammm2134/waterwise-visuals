import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

interface DataPoint {
  time: string;
  value: number;
}

interface EnvironmentChartProps {
  data: DataPoint[];
  title: string;
  yAxisLabel?: string;
}

export const EnvironmentChart = ({ data, title, yAxisLabel }: EnvironmentChartProps) => {
  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#34D399" // Default color (you can change based on data type)
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};