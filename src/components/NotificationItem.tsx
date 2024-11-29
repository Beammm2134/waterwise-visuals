import { Card } from "@/components/ui/card";
import { Bell, Droplet, Activity, Home } from "lucide-react";
import { Notification } from "@/interface/Notification";


export const NotificationItem = ({ notification }: { notification: Notification }) => {
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
          <div className="p-2 bg-gray-100 rounded-full">{getIcon(notification.type)}</div>
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