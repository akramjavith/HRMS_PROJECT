import React, { useRef, useCallback, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { Box } from "@material-ui/core";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: { exact: "facing-Out" },
  facingMode: "user"
};

function Webcamprofile({ 
  getImg,
  getImgedit,
  valNumedit,
  capturedImagesedit,
  setGetImgedit,
  // setCapturedImagesedit,
  setGetImg,
  capturedImages,
  valNum,
  setValNumedit,
  setValNum,
  name }) {

  const [captureImage, setCapturedImages] = useState([])
  const [captureImagesedit, setCapturedImagesedit] = useState([])


  const webcamRef = useRef(null);
  const webcamRefedit = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setGetImg(imageSrc);

    if (Array.isArray(capturedImages)) {
      let newSelectedFiles = [...capturedImages];
      newSelectedFiles.push({
        name: `capture.img (${valNum})`,
        size: "",
        type: "image/jpeg",
        preview: imageSrc,
        base64: imageSrc?.split(",")[1],
      });
      setValNum(valNum + 1);
      setCapturedImages(newSelectedFiles);
    }
  }, [webcamRef, capturedImages, valNum, setGetImg, setValNum, setCapturedImages]);

  const captureedit = useCallback(() => {
    const imageSrc = webcamRefedit.current.getScreenshot();
    setGetImgedit(imageSrc);

    if (Array.isArray(capturedImagesedit)) {
      let newSelectedFiles = [...capturedImagesedit];
      newSelectedFiles.push({
        name: `capture.img (${valNumedit})`,
        size: "",
        type: "image/jpeg",
        preview: imageSrc,
        base64: imageSrc?.split(",")[1],
      });
      setValNumedit(valNumedit + 1);
      setCapturedImagesedit(newSelectedFiles);
    } else {
    }
  }, [webcamRefedit, capturedImagesedit, setValNumedit, valNumedit,setValNumedit, setCapturedImagesedit]);


  const retake = useCallback(() => {
    setGetImg(null);
    setCapturedImages([]);
  }, [webcamRef]);

  const retakeedit = useCallback(() => {
    setGetImgedit(null);
    setCapturedImagesedit([]);
  }, [webcamRefedit]);

  return (
    <>
      <Box>
        <Typography variant="h4"><b>Web camera capture image!</b></Typography><br />
        <Webcam
          audio={false}
          height={200}
          ref={name === "create" ? webcamRef : webcamRefedit}
          screenshotFormat="image/jpeg"
          width={500}
          videoConstraints={videoConstraints}
        />
        <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
          {/* <Button variant="contained" onClick={capture}>Capture</Button>
                    <Button variant="contained" onClick={retake}>Retake</Button> */}
        </Grid><br />
        <Box>
          <img src={name == "create" ? getImg : getImgedit} id="productimage" width="100" height="100" />
        </Box>
      </Box>
    </>
  )
}

export default Webcamprofile;