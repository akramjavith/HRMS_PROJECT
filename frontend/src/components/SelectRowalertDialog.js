import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const SelectRowAlertDialog = ({ open, onClose }) => {
    const handleClose = () => {
        onClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                    Please Select any Row
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus variant="contained" color="error" onClick={handleClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectRowAlertDialog;
