import { Card } from "@/components/ui/card";
import { Bell, Droplet, Activity, Home } from "lucide-react";
import { Notification } from "@/interface/Notification";

export const NotificationItem = ({ notification }: { notification: Notification }) => {
  // Determine the color based on the type of notification
  const getIcon = (type: string) => {
    switch (type) {
      case "moistureLow":
        return <Droplet className="w-5 h-5 text-blue-500" />; // Blue for low moisture
      case "motionDetected":
        return <Activity className="w-5 h-5 text-yellow-500" />; // Yellow for motion detected
      default:
        return <Bell className="w-5 h-5 text-gray-500" />; // Default icon color
    }
  };

  return (
    <Card className="p-4 mb-4 hover:bg-gray-50 transition-colors animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-full">{getIcon(notification.type)}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
          <p className="text-gray-600 text-sm">{notification.message}</p>
        </div>
      </div>
    </Card>
  );
};
