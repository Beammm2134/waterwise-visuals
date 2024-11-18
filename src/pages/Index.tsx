import { PlantCard } from "@/components/PlantCard";
import { EnvironmentChart } from "@/components/EnvironmentChart";
import { WateringControl } from "@/components/WateringControl";

const mockData = [
  { time: "00:00", temperature: 22, moisture: 65 },
  { time: "04:00", temperature: 21, moisture: 63 },
  { time: "08:00", temperature: 23, moisture: 60 },
  { time: "12:00", temperature: 25, moisture: 58 },
  { time: "16:00", temperature: 24, moisture: 55 },
  { time: "20:00", temperature: 22, moisture: 52 },
  { time: "24:00", temperature: 21, moisture: 50 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-plant-dark mb-2">Plant Dashboard</h1>
          <p className="text-gray-600">Monitor and control your plant's environment</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlantCard
            name="Monstera Deliciosa"
            status="Healthy"
            moisture={65}
            temperature={23}
            lastWatered="Today at 8:00 AM"
          />
          <WateringControl />
        </div>

        <div className="mt-8">
          <EnvironmentChart
            data={mockData}
            title="Temperature & Moisture Trends"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;