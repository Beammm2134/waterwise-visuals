import axios from "axios";

const backendBaseUrl = "https://water-visuals-backend.vercel.app/api/plants";
const aiBaseUrl = "https://manatee-steady-immensely.ngrok-free.app"

export const getAllPlantData = async () => {
  try {
    const response = await fetch(`${backendBaseUrl}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch all plant data:", error);
    return {
      ldrData: {},
      motionData: {},
      soilData: {},
      tempData: {},
    };
  }
};

export const getRecentPlantData = async () => {
  try {
    const response = await fetch(`${backendBaseUrl}/recent`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent plant data:", error);
    return null;
  }
};

export const identifyPlant = async (): Promise<{
  name: string;
  isPlant: number;
  isHealthy: number;
  disease: string;
} | null> => {
  try {
    const headers = {
      'ngrok-skip-browser-warning': '0', // Header to skip browser warning
    };

    const response = await axios.get(`${aiBaseUrl}/ai`, { headers }); // Include headers in the request
    console.log(response.data);

    const { name, is_plant, is_healthy, disease } = response.data;

    return {
      name,
      isPlant: is_plant,
      isHealthy: is_healthy,
      disease: disease,
    };
  } catch (error) {
    console.error("Error identifying plant:", error);
    return null;
  }
};
