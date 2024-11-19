import { PlantCard } from "@/components/PlantCard";
import { WateringControl } from "@/components/WateringControl";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

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