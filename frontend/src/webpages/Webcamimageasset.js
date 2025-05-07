import React, { useRef, useCallback, useContext, useState } from "react";
// import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
// import { Box } from "@material-ui/core";

import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  TextField,
  InputLabel,
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TableBody,
  Checkbox,
  TextareaAutosize,
  FormControlLabel,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  DialogTitle,
  TableContainer,
  Button,
} from "@mui/material";

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
  // const { auth, setAuth } = useContext(AuthContext);
  // const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  const webcamRef = useRef(null);
  const [isFlip, setIsFlip] = useState(false);

  const videoConstraints = {
    // width: 1280,
    // height: 720,
    // facingMode: { exact: "facing-Out" }
    facingMode: isFlip ? { exact: "environment" } : "user",
  };

  // const getCode = async () => {
  //   try {
  //     let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     // setAssetdetailEdit(res?.data?.sassetdetail);
  //     // setRefImageDragedit(res?.data?.sassetdetail.files);
  //     // setCapturedImagesedit(res?.data?.sassetdetail.files);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     // if (messages) {
  //     //   setShowAlert(
  //     //     <>
  //     //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //     //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //     //     </>
  //     //   );
  //     //   handleClickOpenerr();
  //     // } else {
  //     //   setShowAlert(
  //     //     <>
  //     //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //     //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something1 went wrong!"}</p>
  //     //     </>
  //     //   );
  //     //   handleClickOpenerr();
  //     // }
  //   }
  // };

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
      let final = newSelectedFiles.filter(d => d.preview !== null && d.base64 !== undefined)
      setCapturedImages(final);
    } else {
    }
  }, [webcamRef, capturedImages, valNum]);

  const captureedit = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
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
  }, [webcamRef, capturedImagesedit, setValNumedit]);

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
      <Box>
        <Box
          sx={{
            // maxWidth: "sm",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
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
        </Box>
        <br />
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>

          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
          />

        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
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
          {/* <Button
            variant="contained"
            onClick={() => {
              setIsFlip(!isFlip);
            }}
          >
            Flip
          </Button> */}
        </Box>
      </Box>
      <br />
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {name === "edit" && (
          <img
            src={getImgedit}
            alt={""}
            id="productimage"
            width="100"
            height="100"
          />
        )}
        {name === "create" && (
          <img
            src={getImg}
            alt={""}
            id="productimage"
            width="100"
            height="100"
          />
        )}
      </Box>
    </>
  );
}

export default Webcamimage;