import { EnvironmentChart } from "@/components/EnvironmentChart";

const mockData = [
  { time: "00:00", temperature: 22, moisture: 65 },
  { time: "04:00", temperature: 21, moisture: 63 },
  { time: "08:00", temperature: 23, moisture: 60 },
  { time: "12:00", temperature: 25, moisture: 58 },
  { time: "16:00", temperature: 24, moisture: 55 },
  { time: "20:00", temperature: 22, moisture: 52 },
  { time: "24:00", temperature: 21, moisture: 50 },
];

const Graphs = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-plant-dark mb-2">Detailed Analytics</h1>
          <p className="text-gray-600">View detailed environmental data trends</p>
        </header>

        <div className="grid gap-6">
          <EnvironmentChart
            data={mockData}
            title="Temperature & Moisture Trends"
          />
          <EnvironmentChart
            data={mockData.map(d => ({ ...d, temperature: d.temperature + 2, moisture: d.moisture - 5 }))}
            title="Weekly Overview"
          />
        </div>
      </div>
    </div>
  );
};

export default Graphs;