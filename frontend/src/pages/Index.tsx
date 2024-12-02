import React, { useState, useEffect } from "react";
import { PlantCard } from "@/components/PlantCard";
import WateringControl from "@/components/WateringControl";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bell, Cpu } from "lucide-react";
import { getRecentPlantData, identifyPlant } from "@/services/PlantService";


const determineStatus = (moisture: number, temperature: number, humidity: number) => {
  if (moisture > 50) {
    return "Healthy";
  } else if (moisture <= 50 && moisture >= 10) {
    return "Needs Water";
  } else {
    return "Critical";
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState<{
    moisture: number;
    temperature: number;
    humidity: number;
    brightness: number;
    status: "Healthy" | "Needs Water" | "Critical";
  }>({
    moisture: 0,
    temperature: 0,
    humidity: 0,
    brightness: 0,
    status: "Critical",
  });

  const [plantInfo, setPlantInfo] = useState<{
    name: string;
    isPlant: number;
    isHealthy: number;
    disease: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleIdentifyPlant = async () => {
    setLoading(true);
    const data = await identifyPlant();
    if (data) {
      setPlantInfo(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      const data = await getRecentPlantData();
      if (data) {
        // Extract values from the data
        const brightness = data.brightness?.value?.ldr_value ?? 0;
        const soilMoisture = data.soil?.value?.soil_moisture || 0;
        const temperature = data.temperature?.value?.temperature ?? 0;
        const humidity = data.temperature?.value?.humidity ?? 0;

        // Set status based on soil moisture
        const status = determineStatus(soilMoisture, temperature, humidity);

        setPlantData({
          brightness,
          moisture: soilMoisture,
          temperature,
          humidity,
          status,
        });
      }
    };

    getData(); // Fetch data immediately on mount

    const interval = setInterval(() => {
      getData(); // Fetch data every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-plant-dark mb-2">Plant Dashboard</h1>
          <p className="text-gray-600">Monitor and control your plant's environment</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col h-full">
          <PlantCard
            name="Monstera Deliciosa"
            status={plantData.status}
            moisture={plantData.moisture}
            temperature={plantData.temperature}
            humidity={plantData.humidity}
            brightness={Math.round((plantData.brightness / 4096 * 100) * 100) / 100}
          />
        </div>
        <div className="flex flex-col h-full">
          <WateringControl />
        </div>
      </div>
        

        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/graphs')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              View Detailed Graphs
            </Button>
            <Button
              onClick={handleIdentifyPlant}
              className="flex items-center gap-2"
              variant="outline"
              disabled={loading}
            >
              <Cpu className="w-4 h-4" />
              {loading ? "Processing..." : "Process Image"}
            </Button>
          </div>

          {plantInfo && plantInfo.isPlant > 0.5 && (
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
              <h2 className="text-2xl font-semibold mb-4 text-plant-dark">Plant Identification</h2>
              <p className="text-lg mb-2">
                <strong>Name:</strong> {plantInfo.name}
              </p>
              <p className={`text-lg font-medium mb-2 ${plantInfo.isHealthy > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Health Status:</strong> {plantInfo.isHealthy > 0.5 ? "🌱 Plant is healthy" : "⚠️ Plant is not healthy"}
              </p>
              {plantInfo.isHealthy <= 0.5 && (
                <p className={'text-lg font-medium mb-2 text-purple-600'}>
                  <strong>Disease:</strong> {"💀 " + plantInfo.disease}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-4">
                * Probabilities are calculated based on the provided image.
              </p>
            </div>
          )}

          {plantInfo && plantInfo.isPlant <= 0.5 && (
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
              <h2 className="text-2xl font-semibold mb-4 text-plant-dark">Plant Identification</h2>
              <p className={`text-lg font-medium mb-2 ${plantInfo.isPlant > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Plant:</strong> {plantInfo.isPlant > 0.5 ? "✔️ Yes" : "❌ No"}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                * Probabilities are calculated based on the provided image.
              </p>
            </div>
          )}



        </div>
      </div>
    </div>
  );
};

export default Index;
