import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

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

export { DeleteConfirmation, PleaseSelectRow };