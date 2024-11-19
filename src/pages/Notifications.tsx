import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Bell, Droplet, Activity, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "High Moisture Level",
    message: "Soil moisture exceeded 80%",
    timestamp: "2024-02-20T10:30:00",
    type: "moisture",
  },
  {
    id: 2,
    title: "Motion Detected",
    message: "Movement detected near Plant #1",
    timestamp: "2024-02-20T09:15:00",
    type: "motion",
  },
  {
    id: 3,
    title: "Low Moisture Alert",
    message: "Soil moisture below 20%",
    timestamp: "2024-02-19T15:45:00",
    type: "moisture",
  },
  {
    id: 4,
    title: "Temperature Warning",
    message: "Temperature reached 30°C",
    timestamp: "2024-02-19T14:20:00",
    type: "temperature",
  },
];

const NotificationItem = ({ notification }: { notification: typeof notifications[0] }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "moisture":
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case "motion":
        return <Activity className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-4 mb-4 hover:bg-gray-50 transition-colors animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-full">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
          <p className="text-gray-600 text-sm">{notification.message}</p>
          <time className="text-xs text-gray-400">
            {new Date(notification.timestamp).toLocaleString()}
          </time>
        </div>
      </div>
    </Card>
  );
};

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-plant-dark mb-2">Notifications</h1>
            <p className="text-gray-600">Recent alerts and activity</p>
          </header>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Notifications;
