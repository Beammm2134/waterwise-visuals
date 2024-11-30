const backendBaseUrl = "https://water-visuals-backend.vercel.app/api/plants";

export const getAllPlantData = async () => {
  try {
    const response = await fetch(`${backendBaseUrl}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("fetch complete");
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
