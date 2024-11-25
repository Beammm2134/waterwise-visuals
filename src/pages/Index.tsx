import React, { useState, useEffect } from "react";
import { PlantCard } from "@/components/PlantCard";
import WateringControl from "@/components/WateringControl";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bell } from "lucide-react";

const fetchPlantData = async () => {
  const databaseUrl =
    "https://embedded-sys-default-rtdb.asia-southeast1.firebasedatabase.app/.json";

  try {
    const response = await fetch(databaseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Function to get the most recent data from a sensor (e.g., ldr, soil, temperature, etc.)
    const getMostRecentData = (sensorData: any) => {
      const timestamps = Object.keys(sensorData); // Get all timestamps (keys)
      const mostRecentTimestamp = timestamps.at(-1); // Get the last timestamp (most recent)
      return sensorData[mostRecentTimestamp]; // Return the value for that timestamp
    };

    // Get the most recent values for each sensor
    const moistureData = getMostRecentData(data.soil || {});
    const temperatureData = getMostRecentData(data.temp || {});
    const humidityData = temperatureData?.humidity; // Assuming humidity is under the temp node
    const brightnessData = getMostRecentData(data.ldr || {});

    // Return the most recent values for all sensors
    return {
      moisture: moistureData?.soil_moisture || 50, // Default moisture value if not found
      temperature: temperatureData?.temperature || 0, // Default temperature if not found
      humidity: humidityData || 0, // Default humidity if not found
      brightness: brightnessData?.ldr_value || 0, // Default brightness if not found
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};




const determineStatus = (moisture: number, temperature: number, humidity: number) => {
  if (moisture > 40 && humidity >= 30) {
    return "Healthy";
  } else if (moisture <= 40 || humidity < 60) {
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

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPlantData();
      if (data) {
        const status = determineStatus(data.moisture, data.temperature, data.humidity);
        setPlantData({ ...data, status });
      }
    };

    getData(); // Fetch immediately on mount

    const interval = setInterval(() => {
      getData(); // Fetch every 10 seconds
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
          <PlantCard
            name="Monstera Deliciosa"
            status={plantData.status}
            moisture={plantData.moisture}
            temperature={plantData.temperature}
            humidity={plantData.humidity}
            brightness={plantData.brightness}
            lastWatered="Today at 8:00 AM"
          />
          <WateringControl />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => navigate('/graphs')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Detailed Graphs
          </Button>
          <Button
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Bell className="w-4 h-4" />
            View Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
