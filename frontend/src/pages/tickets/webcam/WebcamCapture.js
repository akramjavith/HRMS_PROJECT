import React, { useRef, useCallback, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { Box } from "@material-ui/core";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER
};

const WebcamCapture = () => {
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  const handleClick = useCallback(() => {
    setFacingMode(
      prevState =>
        prevState === FACING_MODE_USER
          ? FACING_MODE_ENVIRONMENT
          : FACING_MODE_USER
    );
  }, []);

  return (
    <>
      <button onClick={handleClick}>Switch camera</button>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          ...videoConstraints,
          facingMode
        }}
      />
    </>
  );
};

export default WebcamCapture;