import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getRecentPlantData } from "@/services/PlantService";
import { Notification } from "@/interface/Notification";
import { PlantData } from "@/interface/PlantData";
import { NotificationItem } from "@/components/NotificationItem";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastNotificationState, setLastNotificationState] = useState<Record<string, number | string | boolean>>({});

  // Define notification logic
  const evaluateNotifications = (plant: PlantData): Notification[] => {
    const newNotifications: Notification[] = [];
    const plantTimestamp = new Date(parseInt(plant.time, 10) * 1000).toISOString();

    const notificationTypes = {
      "moistureHigh": plant.moisture > 80,
      "moistureLow": plant.moisture < 20,
      "temperatureHigh": plant.temperature > 30,
      "brightnessLow": plant.brightness < 20,
      "motionDetected": plant.motion === "detected",
    };

    Object.keys(notificationTypes).forEach((type) => {
      if (notificationTypes[type] && lastNotificationState[type] !== true) {
        newNotifications.push({
          id: Date.now(),
          title: type.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to human-readable title
          message: generateNotificationMessage(type, plant),
          timestamp: plantTimestamp,
          type: type,
        });
        // Mark this notification type as "seen"
        setLastNotificationState((prevState) => ({
          ...prevState,
          [type]: true,
        }));
      } else if (!notificationTypes[type]) {
        // Reset the state when the condition is no longer met
        setLastNotificationState((prevState) => ({
          ...prevState,
          [type]: false,
        }));
      }
    });

    return newNotifications;
  };

  const generateNotificationMessage = (type: string, plant: PlantData): string => {
    switch (type) {
      case "moistureHigh":
        return `Soil moisture is ${plant.moisture}% (exceeds safe level).`;
      case "moistureLow":
        return `Soil moisture is ${plant.moisture}% (too low).`;
      case "temperatureHigh":
        return `Temperature is ${plant.temperature}°C (too hot).`;
      case "brightnessLow":
        return `Brightness is ${plant.brightness} (too dark for healthy growth).`;
      case "motionDetected":
        return "Movement detected near Plant #1";
      default:
        return "";
    }
  };

  // Fetch and update notifications
  useEffect(() => {
    const fetchAndUpdate = async () => {
      const data = await getRecentPlantData();
      if (data) {
        const allNotifications = evaluateNotifications(data);
        if (allNotifications.length > 0) {
          setNotifications((prev) => [...allNotifications, ...prev]); // Append new notifications
        }
      }
    };

    const interval = setInterval(fetchAndUpdate, 10000);
    fetchAndUpdate(); // Fetch immediately on mount

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [lastNotificationState]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-plant-dark mb-2">Notifications</h1>
            <p className="text-gray-600">Recent alerts and activity</p>
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

        <ScrollArea className="h-[600px] rounded-md border p-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications yet</p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Notifications;
