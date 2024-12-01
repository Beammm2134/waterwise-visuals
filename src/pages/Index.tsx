import React, { useState, useEffect } from "react";
import { PlantCard } from "@/components/PlantCard";
import WateringControl from "@/components/WateringControl";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Brain } from "lucide-react";
import { getRecentPlantData, analyzeImage } from "@/services/PlantService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getRecentPlantData();
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

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeImage();
      if (result) {
        setAnalysisResult(result.health);
        toast({
          title: "Plant Analysis Complete",
          description: "Analysis results are shown below the button",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze plant image",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

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
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Button
                onClick={handleAnalyze}
                className="w-full flex items-center justify-center gap-2"
                disabled={analyzing}
              >
                <Brain className="w-4 h-4" />
                {analyzing ? "Analyzing..." : "Analyze Plant Health"}
              </Button>
              {analysisResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-center text-gray-700">
                    Plant Health Analysis: <span className="font-semibold">{analysisResult}</span>
                  </p>
                </div>
              )}
            </div>
            <WateringControl />
          </div>
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
            onClick={handleAnalyze}
            className="flex items-center gap-2"
            variant="outline"
            disabled={analyzing}
          >
            <Brain className="w-4 h-4" />
            Analyze Plant Health
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;