// NotificationsService.ts
const backendBaseUrl = "https://water-visuals-backend.vercel.app/api/notifications";

export const getNotifications = async (seenNotificationTypes: Set<string>) => {
  try {
    const response = await fetch(backendBaseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    if (data.success && data.notifications) {
      const newNotifications = data.notifications.filter((notification) => 
        !seenNotificationTypes.has(notification.type)
      );

      if (newNotifications.length > 0) {
        return {
          newNotifications,
          updatedSeenTypes: new Set([...seenNotificationTypes, ...newNotifications.map(n => n.type)])
        };
      }
    }
    return { newNotifications: [], updatedSeenTypes: seenNotificationTypes };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      newNotifications: [],
      updatedSeenTypes: seenNotificationTypes
    };
  }
};
