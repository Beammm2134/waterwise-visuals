import { EnvironmentChart } from "@/components/EnvironmentChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllPlantData } from "@/services/PlantService";

const Graphs = () => {
  const navigate = useNavigate();
  const [ldrData, setLdrData] = useState({});
  const [motionData, setMotionData] = useState({});
  const [soilData, setSoilData] = useState({});
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    const getData = async () => {
      const { ldrData, motionData, soilData, tempData } = await getAllPlantData();
      setLdrData(ldrData);
      setMotionData(motionData);
      setSoilData(soilData);
      setTempData(tempData);
    };
    getData();
  }, []);

  const formatData = (data: Record<string, any>, transformFn = (value) => value) => {
    return Object.keys(data).map((key) => ({
      time: new Date(parseInt(key, 10) * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }),
      value: transformFn(data[key]),
    }));
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-plant-dark mb-2">
              Detailed Analytics
            </h1>
            <p className="text-gray-600">View detailed environmental data trends</p>
          </header>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Graph for Moisture */}
          <EnvironmentChart
            data={formatData(soilData, (value) => value.soil_moisture)} // Adjust if necessary
            title="Moisture Trends"
            yAxisLabel="Moisture (%)"
          />

          {/* Graph for Temperature */}
          <EnvironmentChart
            data={formatData(tempData, (value) => value.temperature)} // Adjust if necessary
            title="Temperature Trends"
            yAxisLabel="Temperature (°C)"
          />

          {/* Graph for Humidity */}
          <EnvironmentChart
            data={formatData(tempData, (value) => value.humidity)} // Adjust if necessary
            title="Humidity Trends"
            yAxisLabel="Humidity (%)"
          />

          {/* Graph for Brightness */}
          <EnvironmentChart
            data={formatData(ldrData, (value) => (Math.round((value.ldr_value / 4096 * 100) * 100) / 100))}
            title="Brightness Trends"
            yAxisLabel="Brightness (%)"
          />
        </div>
      </div>
    </div>
  );
};

export default Graphs;
