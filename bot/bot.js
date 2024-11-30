const { Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const fetch = require('node-fetch');

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Replace 'YOUR_CHANNEL_ID' with the channel ID where notifications will be sent
const CHANNEL_ID = '1303061838354976849';
const TOKEN = "ODk2Njg5MjE1NzkyODgxNzQ1.GFN48X.AfynBwSX7rlLsMTO0yz_Yno37l_YvmEHr24GHs"; // Securely manage this token
const BACKEND_URL = 'https://water-visuals-backend.vercel.app/api/notifications'; // Replace with your backend URL

// Set to keep track of sent notifications by their ID
let sentNotifications = new Set();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Function to send a message to a specific channel
const sendNotification = async (notification) => {
  console.log('Attempting to send notification...');
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (channel) {
      const embed = new EmbedBuilder()
        .setColor('#3498db') // Choose an appropriate color
        .setTitle(notification.title)
        .setDescription(notification.message)
        .setFooter({ text: `Notification Type: ${notification.type}` })
        .setTimestamp(new Date(notification.timestamp));

      await channel.send({ embeds: [embed] });
      console.log('Notification sent successfully.');
    } else {
      console.error('Channel not found!');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Function to fetch notifications from the backend and send them to Discord
const pollNotifications = async () => {
  console.log('Polling for notifications...');
  try {
    console.log('Fetching data from backend...');
    const response = await fetch(BACKEND_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Data fetched successfully:', data);

    if (data && data.notifications && data.notifications.length > 0) {
      console.log('New notifications found:', data.notifications.length);
      data.notifications.forEach((notification, index) => {
        console.log(`Processing notification ${index + 1}: ${notification.title}`);

        // Check if the notification type has already been sent
        if (!sentNotifications.has(notification.type)) {
          sendNotification(notification);
          sentNotifications.add(notification.type);
        } else {
          console.log(`Duplicate notification skipped: ${notification.title}`);
        }
      });
    } else {
      console.log('No new notifications.');
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

// Poll every 10 minutes (600,000 milliseconds)
console.log('Starting notification polling...');
setInterval(pollNotifications, 6000);

// Log in to Discord
console.log('Logging into Discord...');
client.login(TOKEN);
