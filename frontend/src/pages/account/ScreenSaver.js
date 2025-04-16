// // App.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { SERVICE } from "../../services/Baseservice";

// function ScreensaverForm() {
//     const [images, setImages] = useState([]);
//     const [interval, setInterval] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleImageChange = (e) => {
//         setImages(e.target.files);
//     };

//     const handleIntervalChange = (e) => {
//         setInterval(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const formData = new FormData();
//         for (let i = 0; i < images.length; i++) {
//             formData.append('images', images[i]);
//         }
//         formData.append('interval', interval);

//         try {
//             const response = await axios.post(SERVICE.SCREENSAVERCREATION, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             console.log(response)

//             const base64File = response?.data?.base64File;

//             // Create a blob from the base64 file and download it
//             const blob = new Blob([new Uint8Array(atob(base64File).split("").map(char => char.charCodeAt(0)))], { type: 'application/x-msdownload' });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             link.download = "slideshow.scr"; // Define the desired file name
//             link.click();


//         } catch (error) {
//             console.error("Error uploading files:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ marginTop: '50px' }}>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Interval (in seconds): </label>
//                     <input type="number" value={interval} onChange={handleIntervalChange} />
//                 </div>
//                 <div>
//                     <label>Images: </label>
//                     <input type="file" accept="image/*" multiple onChange={handleImageChange} />
//                 </div>
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Creating Screensaver...' : 'Create Screensaver'}
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default ScreensaverForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVICE } from "../../services/Baseservice";
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    LinearProgress,
    Box,
    Input,
    Stack,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MessageAlert from "../../components/MessageAlert";
import { handleApiError } from "../../components/Errorhandling";

function ScreensaverForm() {

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };


    const [images, setImages] = useState([]);
    const [interval, setInterval] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [requestId, setRequestId] = useState(null);

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleIntervalChange = (e) => {
        const value = e.target.value;
        if (/^(?!0(\.0+)?$)\d*\.?\d*$/.test(value)) {
            setInterval(value); // Only update if value is a positive number
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!interval || interval === "") {
            setPopupContentMalert("Please Enter Interval!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (images?.length === 0) {
            setPopupContentMalert("Please Select Images!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {


            setLoading(true);
            setProgress(0);
            setDownloadComplete(false);

            const formData = new FormData();
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
            formData.append('interval', interval);

            try {
                console.time("time")
                const response = await axios.post(SERVICE.SCREENSAVERCREATION, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onDownloadProgress: (progressEvent) => {
                        const total = progressEvent.total || 1;
                        const currentProgress = Math.round((progressEvent.loaded / total) * 100);
                        setProgress(currentProgress);
                    }
                });
                const base64File = response?.data?.base64File;
                setRequestId(response.data.requestId);
                // Create a blob from the base64 file and download it
                const blob = new Blob([new Uint8Array(atob(base64File).split("").map(char => char.charCodeAt(0)))], { type: 'application/x-msdownload' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "slideshow.scr"; // Define the desired file name
                link.click();

                setDownloadComplete(true);
                setImages([]);
                setRequestId(null);
                setInterval('');
            } catch (error) {
                handleApiError(error, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            } finally {
                console.timeEnd("time");
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (requestId) {
            const intervalId = setInterval(async () => {
                try {
                    const response = await axios.get(`${SERVICE.SCREENSAVERPROGRESS}/${requestId}`);
                    setProgress(response.data.progress);
                    console.log(response.data.progress);
                    if (response.data.progress >= 100) {
                        clearInterval(intervalId); // Stop polling when complete
                    }
                } catch (error) {
                    console.error("Error fetching progress:", error);
                }
            }, 1000); // Poll every 1 second

            return () => clearInterval(intervalId); // Clean up on component unmount
        }
    }, [requestId]);

    return (
        <Container maxWidth="sm" sx={{ marginTop: '50px' }}>
            <Card variant="outlined" sx={{ padding: '20px' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Create Screensaver
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Interval (in seconds)"
                                type="number"
                                variant="outlined"
                                value={interval}
                                onChange={handleIntervalChange}
                                fullWidth

                            />
                            <Box display="flex" alignItems="center">
                                <label htmlFor="upload-images">
                                    <input
                                        style={{ display: 'none' }}
                                        id="upload-images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<UploadFileIcon />}
                                    >
                                        Select Images
                                    </Button>
                                </label>
                                <Typography sx={{ ml: 2 }}>
                                    {images.length > 0 ? `${images.length} file(s) selected` : 'No file selected'}
                                </Typography>
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Creating Screensaver...' : 'Create Screensaver'}
                            </Button>
                            {loading && (
                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                                    <CircularProgress color="secondary" />
                                    <Typography variant="subtitle1" sx={{ ml: 2 }}>Processing...</Typography>
                                </Box>
                            )}
                            {/* {loading && (
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgress variant="determinate" value={progress} />
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        {progress}% downloaded
                                    </Typography>
                                </Box>
                            )} */}
                            {downloadComplete && (
                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 2, color: 'green' }}>
                                    <CheckCircleOutlineIcon />
                                    <Typography variant="subtitle1" sx={{ ml: 1 }}>Download Complete!</Typography>
                                </Box>
                            )}
                            {requestId && (
                                <Box mt={2}>
                                    <LinearProgress variant="determinate" value={progress} />
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        {progress}% completed
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </form>
                </CardContent>
            </Card>
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
        </Container>
    );
}

export default ScreensaverForm;