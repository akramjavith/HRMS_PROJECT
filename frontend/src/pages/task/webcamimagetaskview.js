import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { Box, Typography, Grid, Button } from "@mui/material";

import "jspdf-autotable";

function Webcamimage({
  getImg,
  setGetImg,
  valNum,
  setValNum,
  capturedImages,
  setCapturedImages,
  name,

  getImgedit,
  setGetImgedit,
  valNumedit,
  setValNumedit,
  capturedImagesedit,
  setCapturedImagesedit,
}) {

  const webcamRef = useRef(null);
  const [isFlip, setIsFlip] = useState(false);

  const videoConstraints = {
    facingMode: isFlip ? { exact: "environment" } : "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return
    // Convert base64 data URL to a Blob
    const byteString = atob(imageSrc.split(',')[1]);
    const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Create a file from the Blob
    const file = new File([blob], `capture-img-${valNum}.jpeg`, {
      type: mimeString,
    });

    setGetImg(imageSrc); // still useful if you want to show preview
    setValNum(valNum + 1);

    // Store only this one file
    setCapturedImages([file]);
  }, [webcamRef, valNum]);


  const captureedit = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    const byteString = atob(imageSrc.split(',')[1]);
    const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const file = new File([blob], `capture-img-${valNumedit}.jpeg`, {
      type: mimeString,
    });

    setGetImgedit(imageSrc);
    setValNumedit(valNumedit + 1);
    setCapturedImagesedit([file]);
  }, [webcamRef, valNumedit]);


  const retake = useCallback(() => {
    setGetImg(null);
    setCapturedImages([]);
  }, [webcamRef]);

  const retakeedit = useCallback(() => {
    setGetImgedit(null);
    setCapturedImagesedit([]);
  }, [webcamRef]);

  return (
    <>
      <Box sx={{ maxWidth: "sm" }}>
        <Typography
          sx={{
            "@media only screen and (minWidth: 500px)": {
              fontSize: "15px",

              // padding: '1px',
            },
          }}
        >
          <b>Web camera capture image!</b>
        </Typography>
        <br />
        <Grid container>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ justifyContent: "center", textAlign: "center" }}>
            <Webcam audio={false} height={200} ref={webcamRef} screenshotFormat="image/jpeg" width={500} videoConstraints={videoConstraints} />
          </Grid>
        </Grid>

        <Grid sx={{ display: "flex", justifyContent: "center" }}>
          {name == "edit" && (
            <Button
              variant="contained"
              onClick={() => {
                captureedit();
              }}
            >
              Capture
            </Button>
          )}
          {name == "create" && (
            <Button
              variant="contained"
              onClick={() => {
                capture();
              }}
            >
              Capture
            </Button>
          )}
          {name == "edit" && (
            <Button
              variant="contained"
              onClick={() => {
                retakeedit();
              }}
            >
              Retake
            </Button>
          )}
          {name == "create" && (
            <Button
              variant="contained"
              onClick={() => {
                retake();
              }}
            >
              Retake
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              setIsFlip(!isFlip);
            }}
          >
            Flip
          </Button>
        </Grid>
        <br />
        <Box>
          {name == "edit" && <img src={getImgedit} id="productimage" width="100" height="100" />}
          {name == "create" && <img src={getImg} id="productimage" width="100" height="100" />}
        </Box>
      </Box>
    </>
  );
}

export default Webcamimage;