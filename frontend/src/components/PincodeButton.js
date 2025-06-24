import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Alert, AlertTitle, CircularProgress, IconButton } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Info as InfoIcon } from '@mui/icons-material';
// import axios from '../../../axiosInstance';
import axios from '../axiosInstance';
import { SERVICE } from '../services/Baseservice.js';
const PincodeButton = ({ pincode, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setDialogContent(null);
  };

  const handleClick = async () => {
    // Validate pincode
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setDialogContent(
        <Alert severity="warning" icon={<InfoIcon />}>
          <AlertTitle>Invalid Pincode</AlertTitle>
          Please enter a valid 6-digit pincode.
        </Alert>
      );
      setOpen(true);
      return;
    }

    setLoading(true);

    try {

      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      // const response = await axios.get(`https://postalpincode.in/api/pincode/${pincode}`);
      const { Status, Message, PostOffice } = response.data[0];
      if (Status === 'Error' || !PostOffice) {
        setDialogContent(
          <Alert severity="error" icon={<ErrorIcon />}>
            <AlertTitle>Error</AlertTitle>
            {Message || 'No records found.'}
          </Alert>
        );
        setOpen(true);

        onSuccess([]);
      } else {
        // 1. Get local areas from your own backend
        const localAreaRes = await axios.get(`${SERVICE.GET_AREAS_BY_PINCODE}/?pincode=${pincode}`);
        const localAreaNames = localAreaRes.data?.areas || [];

        // 2. Map PostOffice API results
        const modifiedPostOffices = PostOffice.map(({ Name, ...rest }) => ({
          name: Name,
          ...rest,
        }));

        // 3. Append local areas from your DB as objects
        const localAreaObjects = localAreaNames.map(area => ({
          name: area,
          source: 'internal'  // Optional: mark source if needed
        }));

        const combined = [...modifiedPostOffices, ...localAreaObjects];

        // 4. Remove duplicates by `name` (case-insensitive)
        const uniqueMap = new Map();
        combined.forEach(item => {
          const key = item.name?.trim().toLowerCase();
          if (key && !uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        const uniqueFinalList = Array.from(uniqueMap.values());

        // 5. Pass to parent
        onSuccess(uniqueFinalList);
        // setDialogContent(
        //   <Alert severity="success" icon={<CheckCircle />}>
        //     <AlertTitle>Location Found</AlertTitle>
        //     {Message}
        //   </Alert>
        // );
        // setOpen(true);
      }
    } catch (err) {
      setDialogContent(
        <Alert severity="error" icon={<ErrorIcon />}>
          <AlertTitle>Network Error</AlertTitle>
          Unable to reach the pincode server. Please try again.
        </Alert>
      );
      setOpen(true);
    }

    setLoading(false);
  };

  return (
    <>
      <Button size="small" variant="outlined" onClick={handleClick} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
        GET
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Pincode Status</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
      </Dialog>
    </>
  );
};

export default PincodeButton;
