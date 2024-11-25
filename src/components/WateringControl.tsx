import React, { useEffect, useState } from "react";

const WateringControl = () => {
  const [imageSrc, setImageSrc] = useState("http://192.168.43.18/custom");

  useEffect(() => {
    const updateImage = () => {
      const timestamp = new Date().getTime(); // Add a timestamp to avoid caching
      setImageSrc(`http://192.168.43.18/custom?timestamp=${timestamp}`);
    };

    updateImage(); // Update immediately on mount

    const interval = setInterval(() => {
      updateImage(); // Update every second
    }, 500);

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