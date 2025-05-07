import React, {useRef, useCallback, useState} from "react";
import { Button,Grid,Typography } from "@mui/material";
import Webcam from "react-webcam";
import { Box } from "@material-ui/core";

const videoConstraints = {
    // width: 1280,
    // height: 720,
    // facingMode: { exact: "facing-Out" }
    facingMode: "user"
  };

function Webcamprofile({getImg,setGetImg}){
    const webcamRef = useRef(null);
    
  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setGetImg(imageSrc);
    },
    [webcamRef]
  );

  const retake = useCallback(
    () => {
      setGetImg(null);
    },
    [webcamRef]
  );

    return(
        <>
            <Box>
            <Typography variant="h4"><b>Web camera capture image!</b></Typography><br />
                <Webcam
                    audio={false}
                    height={200}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                />
                <Grid sx={{ display:'flex', justifyContent:'space-between'}}>
                    <Button variant="contained" onClick={capture}>Capture</Button>
                    <Button variant="contained" onClick={retake}>Retake</Button>
                </Grid><br />
                <Box>
                    <img src={getImg} id="productimage" width="100" height="100"/>
                </Box>
            </Box>
        </>
    )
}

export default Webcamprofile;