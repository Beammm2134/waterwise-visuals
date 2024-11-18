import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlantCardProps {
  name: string;
  status: "Healthy" | "Needs Water" | "Critical";
  moisture: number;
  temperature: number;
  lastWatered: string;
}

export const PlantCard = ({
  name,
  status,
  moisture,
  temperature,
  lastWatered,
}: PlantCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800";
      case "Needs Water":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-plant-dark">{name}</h3>
          <Badge className={`mt-2 ${getStatusColor(status)}`}>{status}</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Moisture</p>
          <p className="text-lg font-medium">{moisture}%</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="text-lg font-medium">{temperature}°C</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500">
          Last watered: {lastWatered}
        </p>
      </div>
    </Card>
  );
};