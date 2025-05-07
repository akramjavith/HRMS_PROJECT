import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVICE } from "./services/Baseservice";

const Watermark = () => {
  const [base64Image, setBase64Image] = useState("");
  const [isOpacity, setIsOpacity] = useState(0.05);

  useEffect(() => {
    // Fetch the base64 image from MongoDB or API
    const fetchImage = async () => {
      try {
        let res = await axios.get(SERVICE.CONTROL_SETTINGS_LAST_INDEX);
        const image = res?.data?.overallsettings?.watermark;
        setIsOpacity(res?.data?.overallsettings?.opacitywatermark)
        // Ensure the image is a valid base64 string
        if (image && image.startsWith("data:image")) {
          setBase64Image(image);
        } else {
          console.error("Invalid base64 image");
        }
      } catch (error) {
        console.error("Error fetching watermark image:", error);
      }
    };

    fetchImage();
  }, []);

  if (!base64Image) return null; // Wait until image is fetched

  return (
    <div
      className="watermark"
      // style={{
      //   backgroundImage: `url(${base64Image})`, // Set the base64 image as background
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "center",
      //   backgroundSize: "contain", // Scale the watermark image
      //   opacity: 0.07, // Set the opacity for the watermark
      //   position: "fixed",
      //   top: "50%", // Move to the vertical center
      //   left: "50%", // Move to the horizontal center
      //   width: "30%",
      //   height: "30%",
      //   transform: "translate(-50%, -50%)",
      //   pointerEvents: "none", // Prevent interference with other elements
      //   zIndex: 5000000, // Keep it behind other content
      // }}

      style={{
        backgroundImage: `url(${base64Image})`, // Set the base64 image as background
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center", // Center the image
        backgroundSize: "cover", // Cover the entire area, cropping if necessary
        opacity: isOpacity, // Set the opacity for the watermark
        position: "fixed", // Keep it fixed in position
        top: 65, // Align to the top
        left: 0, // Align to the left
        width: "100%", // Full width
        height: "100%", // Full height
        pointerEvents: "none", // Prevent interference with other elements
        zIndex: 5000000, // Keep it behind other content
        // border: "10px solid red",
      }}
    />
  );
};

export default Watermark;
