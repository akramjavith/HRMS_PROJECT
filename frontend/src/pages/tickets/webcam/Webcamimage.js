
import React, { useRef, useCallback, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { Box } from "@material-ui/core";

function Webcamimage({ getImg, setGetImg, valNum, setValNum, capturedImages, setCapturedImages, }) {

  const webcamRef = useRef(null);
  const [isFlip, setIsFlip] = useState(false);

  const videoConstraints = {
    // width: 1280,
    // height: 720,
    // facingMode: { exact: "facing-Out" }
    facingMode: isFlip ? { exact: "environment" } : "user"
  };


  const capture = useCallback(
    () => {


      const imageSrc = webcamRef.current.getScreenshot();
      setGetImg(imageSrc);

      if (Array.isArray(capturedImages)) {
        let newSelectedFiles = [...capturedImages];
        newSelectedFiles.push({
          name: `capture.img (${valNum})`,
          size: "",
          type: "image/jpeg",
          preview: imageSrc,
          base64: imageSrc.split(",")[1],
        });
        setValNum(valNum + 1)
        setCapturedImages(newSelectedFiles);


      } else {
      }
    },
    [webcamRef, capturedImages, valNum]
  );




  const retake = useCallback(
    () => {
      setGetImg(null);
      setCapturedImages([]);
    },
    [webcamRef]
  );

  return (
    <>
      <Box sx={{ maxWidth: 'sm' }}>
        <Typography sx={{
          '@media only screen and (minWidth: 500px)': {
            fontSize: '15px',

            // padding: '1px',
          },
        }}><b>Web camera capture image!</b></Typography><br />
        <Grid container>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ justifyContent: 'center', textAlign: 'center' }}>
            <Webcam
              audio={false}
              height={200}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={500}
              videoConstraints={videoConstraints}
            />
          </Grid>
        </Grid>

        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={capture}>Capture</Button>
          <Button variant="contained" onClick={retake}>Retake</Button>
          <Button variant="contained" onClick={() => { setIsFlip(!isFlip); }}>Flip</Button>
        </Grid><br />
        <Box>
          <img src={getImg} id="productimage" width="100" height="100" />
        </Box>
      </Box>
    </>
  )
}

export default Webcamimage;