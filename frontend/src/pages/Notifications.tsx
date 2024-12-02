import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "@/services/NotificationsService";
import { Notification } from "@/interface/Notification";
import { NotificationItem } from "@/components/NotificationItem";


const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [seenNotificationTypes, setSeenNotificationTypes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { newNotifications, updatedSeenTypes } = await getNotifications(seenNotificationTypes);
      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev]); // Prepend new notifications
        setSeenNotificationTypes(updatedSeenTypes);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false); // Ensure loading state is set to false after the fetch
    }
  };


  // Fetch notifications when the component mounts and at regular intervals
  useEffect(() => {
    fetchNotifications(); // Initial fetch on mount

    // Start polling after the first fetch
    const interval = setInterval(async () => {
      const { newNotifications, updatedSeenTypes } = await getNotifications(seenNotificationTypes);
      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev]); // Prepend new notifications
        setSeenNotificationTypes(updatedSeenTypes);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [seenNotificationTypes]);

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
          {loading ? ( // Show loading message while loading
            <p className="text-center text-gray-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
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