
export const getAllPlantData = async () => {
    const databaseUrl =
      "https://embedded-sys-default-rtdb.asia-southeast1.firebasedatabase.app/.json";
    try {
      const response = await fetch(databaseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      // Extract temperature, soil, and brightness data
      const soilData = data.soil || {};
      const tempData = data.temp || {};
      const ldrData = data.ldr || {};
      const motionData = data.motion || {};
  
      let lastValidMoisture = null; // To hold the last valid moisture value
  
      // Process the data into an array of time-based data points
      const processedData = Object.keys(tempData).map((key) => {
        const moisture = soilData[key]?.soil_moisture || 0;
        // Replace moisture with last valid value if it's 0
        if (moisture !== 0) {
          lastValidMoisture = moisture;
        } else if (lastValidMoisture !== null) {
          lastValidMoisture = lastValidMoisture;
        }
  
        return {
          time: key, // Timestamp
          temperature: tempData[key]?.temperature || 0,
          humidity: tempData[key]?.humidity || 0,
          moisture: lastValidMoisture || 0,
          brightness: ldrData[key]?.ldr_value || 0,
          motion: motionData[key]?.motion_detected || false,
        };
      });
  
      console.log(processedData);
  
      return processedData;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [];
    }
  };

  export const getRecentPlantData = async () => {
    try {
      const allData = await getAllPlantData();
      if (!allData || allData.length === 0) {
        return null;
      }
  
      // Get the most recent entry (assuming data is sorted by time)
      const mostRecentEntry = allData.at(-1);
  
      return mostRecentEntry || null;
    } catch (error) {
      console.error("Failed to fetch recent plant data:", error);
      return null;
    }
  };