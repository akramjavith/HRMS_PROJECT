import React from "react";
import { Typography, Box, Paper, Dialog, DialogContent } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const severityIcons = {
  success: (
    <CheckCircleOutlineIcon style={{ fontSize: "3.5rem", color: "green" }} />
  ),
  info: <InfoOutlinedIcon style={{ fontSize: "3.5rem", color: "blue" }} />,
  warning: (
    <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "orange" }} />
  ),
  error: (
    <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "red" }} />
  ),
};

const AlertDialog = ({
  openPopup,
  handleClosePopup,
  popupContent,
  popupSeverity,
}) => {
  setTimeout(() => {
    handleClosePopup();
  }, 1500);

  const CustomPaper = (props) => {
    return <Paper {...props} sx={{ borderRadius: "8px" }} />;
  };

  return (
    <Dialog
      open={openPopup}
      onClose={handleClosePopup}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      PaperComponent={CustomPaper}
    >
      <Box sx={{ width: "350px", height: "180px", borderRadius: "3px" }}>
        {/* <DialogTitle id="alert-dialog-title">{popupTitle}</DialogTitle> */}
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {severityIcons[popupSeverity]}
            <Typography
              sx={{ fontSize: "1.4rem", fontWeight: "600", color: "black" }}
            >
              {popupContent}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AlertDialog;