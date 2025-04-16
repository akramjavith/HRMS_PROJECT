import React from 'react';
import { Dialog, DialogContent, DialogActions, IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';

const ExportDialog = ({ open, handleClose, handleExport, fileFormat }) => {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                    :
                    <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                }
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                    Choose Export
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus variant="contained"
                    onClick={() => handleExport("filtered")}
                >
                    Export Filtered Data
                </Button>
                <Button autoFocus variant="contained"
                    onClick={() => handleExport("overall")}
                >
                    Export Overall Data
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDialog;
