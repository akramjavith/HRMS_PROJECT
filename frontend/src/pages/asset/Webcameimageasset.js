import React, { useRef, useCallback, useContext, useState } from "react";
// import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
// import { Box } from "@material-ui/core";

import { Box, Typography, OutlinedInput, Dialog, TextField, InputLabel, Popover, IconButton, List, ListItem, ListItemText, TableBody, Checkbox, TextareaAutosize, FormControlLabel, TableRow, TableCell, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, DialogTitle, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ExportXL, ExportCSV } from "../../components/Export";
import { saveAs } from "file-saver";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "jspdf-autotable";
import jsPDF from "jspdf";
import axios from "axios";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { handleApiError } from "../../components/Errorhandling";
import Selects from "react-select";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

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
  const { auth, setAuth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  const webcamRef = useRef(null);
  const [isFlip, setIsFlip] = useState(false);

  const videoConstraints = {
    // width: 1280,
    // height: 720,
    // facingMode: { exact: "facing-Out" }
    facingMode: isFlip ? { exact: "environment" } : "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setGetImg(imageSrc);

      // Convert base64 image to Blob
  const byteCharacters = atob(imageSrc.split(",")[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const byteArray = new ArrayBuffer(512);
    const byteArrayView = new Uint8Array(byteArray);
    for (let i = 0; i < 512 && offset + i < byteCharacters.length; i++) {
      byteArrayView[i] = byteCharacters.charCodeAt(offset + i);
    }
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: "image/jpeg" });

  // Get the size of the Blob (in bytes)
  const fileSize = blob.size; // in bytes

    if (Array.isArray(capturedImages)) {
      let newSelectedFiles = [...capturedImages];
      newSelectedFiles.push({
        name: `capture.img (${valNum}).jpeg`,
        size: fileSize,
        type: "image/jpeg",
        preview: imageSrc,
        base64: imageSrc?.split(",")[1],
      });
      setValNum(valNum + 1);
      setCapturedImages(newSelectedFiles);
    } else {
    }
  }, [webcamRef, capturedImages, valNum]);

  const captureedit = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setGetImgedit(imageSrc);

      // Convert base64 image to Blob
  const byteCharacters = atob(imageSrc.split(",")[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const byteArray = new ArrayBuffer(512);
    const byteArrayView = new Uint8Array(byteArray);
    for (let i = 0; i < 512 && offset + i < byteCharacters.length; i++) {
      byteArrayView[i] = byteCharacters.charCodeAt(offset + i);
    }
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: "image/jpeg" });

  // Get the size of the Blob (in bytes)
  const fileSize = blob.size; // in bytes

    if (Array.isArray(capturedImagesedit)) {
      let newSelectedFiles = [...capturedImagesedit];
      newSelectedFiles.push({
        name: `capture.img (${valNumedit}).jpeg`,
        size: fileSize,
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
