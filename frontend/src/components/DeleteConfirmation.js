import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  DialogTitle,
} from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
const PleaseSelectRow = ({ open, onClose, message, iconColor, buttonText }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent
      sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
    >
      <ErrorOutlineOutlinedIcon
        sx={{ fontSize: "70px", color: iconColor || "orange" }}
      />
      <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button autoFocus variant="contained" color="error" onClick={onClose}>
        {buttonText || "OK"}
      </Button>
    </DialogActions>
  </Dialog>
);

const DeleteConfirmation = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  confirmButtonText = "OK",
  cancelButtonText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
      >
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
          {title}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: "#f4f4f4",
            color: "#444",
            boxShadow: "none",
            borderRadius: "3px",
            border: "1px solid #0000006b",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          {cancelButtonText}
        </Button>
        <Button autoFocus variant="contained" color="error" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const ConfirmationPopup = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "Do you want to proceed with this action?",
  confirmButtonText = "Yes",
  cancelButtonText = "No",
  icon = "warning", // 'success', 'error', or 'warning'
  iconColor = "orange",
  titleColor = "red",
  confirmButtonColor = "error", // 'error', 'primary', 'success'
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "success":
        return <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "80px", color: iconColor || "green" }} />;
      case "error":
        return <HighlightOffOutlinedIcon sx={{ fontSize: "80px", color: iconColor || "red" }} />;
      default:
        return <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: iconColor || "orange" }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: "center" }}>
        {renderIcon()}
      </DialogTitle>
      <DialogContent
        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
      >
        <Typography
          variant="h5"
          id="confirmation-dialog-title"
          sx={{ color: titleColor, textAlign: "center" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          id="confirmation-dialog-description"
          sx={{ mt: 1 }}
        >
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: "#f4f4f4",
            color: "#444",
            boxShadow: "none",
            borderRadius: "3px",
            border: "1px solid #0000006b",
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          autoFocus
          variant="contained"
          color={confirmButtonColor}
          onClick={onConfirm}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { DeleteConfirmation, PleaseSelectRow, ConfirmationPopup };