import React, { useEffect, useState } from "react";

const WateringControl = () => {
  const [imageSrc, setImageSrc] = useState("https://manatee-steady-immensely.ngrok-free.app/camera");

  useEffect(() => {
    const updateImage = () => {
      const timestamp = new Date().getTime(); // Add a timestamp to avoid caching
      setImageSrc(`https://manatee-steady-immensely.ngrok-free.app/camera?timestamp=${timestamp}`);
    };

    updateImage(); // Update immediately on mount

    const interval = setInterval(() => {
      updateImage(); // Update every second
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <img src={imageSrc} alt="Custom" />
      {/* Other components or elements */}
    </div>
  );
};

export default WateringControl;
