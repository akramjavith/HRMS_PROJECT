import React from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const severityIcons = {
  success: (
    <CheckCircleOutlineIcon style={{ fontSize: "3.5rem", color: "green" }} />
  ),
  info: <InfoOutlinedIcon style={{ fontSize: "3.5rem", color: "teal" }} />,
  warning: (
    <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "orange" }} />
  ),
  error: (
    <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "red" }} />
  ),
};

const MessageAlert = ({
  openPopup,
  handleClosePopup,
  popupContent,
  popupSeverity,
}) => {
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
      <Box sx={{ width: "350px" }}>
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
        <DialogActions>
          <Button
            onClick={handleClosePopup}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MessageAlert;