import { EnvironmentChart } from "@/components/EnvironmentChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";

// const mockData = [
//   { time: "00:00", temperature: 22, moisture: 65 },
//   { time: "04:00", temperature: 21, moisture: 63 },
//   { time: "08:00", temperature: 23, moisture: 60 },
//   { time: "12:00", temperature: 25, moisture: 58 },
//   { time: "16:00", temperature: 24, moisture: 55 },
//   { time: "20:00", temperature: 22, moisture: 52 },
//   { time: "24:00", temperature: 21, moisture: 50 },
// ];

const fetchPlantData = async () => {
  const databaseUrl =
    "https://embedded-sys-default-rtdb.asia-southeast1.firebasedatabase.app/.json";
  try {
    const response = await fetch(databaseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract temperature, soil, and brightness data
    const soilData = data.soil || {};
    const tempData = data.temp || {};
    const ldrData = data.ldr || {};

    let lastValidMoisture = null; // To hold the last valid moisture value

    // Process the data into an array of time-based data points
    const processedData = Object.keys(tempData).map((key) => {
      const moisture = soilData[key]?.soil_moisture || 0;
      // Replace moisture with last valid value if it's 0
      if (moisture !== 0) {
        lastValidMoisture = moisture;
      } else if (lastValidMoisture !== null) {
        lastValidMoisture = lastValidMoisture;
      }

      return {
        time: key, // Timestamp
        temperature: tempData[key]?.temperature || 0,
        humidity: tempData[key]?.humidity || 0,
        moisture: lastValidMoisture || 0,
        brightness: ldrData[key]?.ldr_value || 0,
      };
    });

    console.log(processedData);

    return processedData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
};

const Graphs = () => {
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPlantData();
      setPlantData(data);
    };
    getData();
  }, []);

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
            data={plantData.map((d) => ({
              time: d.time,
              value: d.moisture,
            }))}
            title="Moisture Trends"
            yAxisLabel="Moisture (%)"
          />

          {/* Graph for Temperature */}
          <EnvironmentChart
            data={plantData.map((d) => ({
              time: d.time,
              value: d.temperature,
            }))}
            title="Temperature Trends"
            yAxisLabel="Temperature (°C)"
          />

          {/* Graph for Humidity */}
          <EnvironmentChart
            data={plantData.map((d) => ({
              time: d.time,
              value: d.humidity,
            }))}
            title="Humidity Trends"
            yAxisLabel="Humidity (%)"
          />

          {/* Graph for Brightness */}
          <EnvironmentChart
            data={plantData.map((d) => ({
              time: d.time,
              value: d.brightness,
            }))}
            title="Brightness Trends"
            yAxisLabel="Brightness (LDR)"
          />
        </div>
      </div>
    </div>
  );
};

export default Graphs;