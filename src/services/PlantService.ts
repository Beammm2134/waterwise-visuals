const backendBaseUrl = "http://192.168.43.18"; // Using the same base URL as in WateringControl

export const getRecentPlantData = async () => {
  const databaseUrl =
    "https://embedded-sys-default-rtdb.asia-southeast1.firebasedatabase.app/.json";

  try {
    const response = await fetch(databaseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const getMostRecentData = (sensorData: any) => {
      const timestamps = Object.keys(sensorData);
      const mostRecentTimestamp = timestamps.at(-1);
      return sensorData[mostRecentTimestamp];
    };

    const moistureData = getMostRecentData(data.soil || {});
    const temperatureData = getMostRecentData(data.temp || {});
    const humidityData = temperatureData?.humidity;
    const brightnessData = getMostRecentData(data.ldr || {});

    return {
      moisture: moistureData?.soil_moisture || 50,
      temperature: temperatureData?.temperature || 0,
      humidity: humidityData || 0,
      brightness: brightnessData?.ldr_value || 0,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};

export const analyzeImage = async () => {
  try {
    const response = await fetch(`${backendBaseUrl}/analyze`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to analyze plant image:", error);
    throw error;
  }
};