import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { Box } from "@material-ui/core";
import * as faceapi from "face-api.js";
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import MessageAlert from "../../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";
const videoConstraints = {
    // width: 1280,
    // height: 720,
    // facingMode: { exact: "facing-Out" }
    facingMode: "user"
};

function ProfilePageWebCam({ getImg, setGetImg, getImgFaceId, setGetImgFaceId, employeeid }) {

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setUpdateLoader(false);
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        // setUpdateLoader(false);
        setOpenPopupMalert(false);
    };
    const webcamRef = useRef(null);
    const { auth, setAuth } = useContext(AuthContext);
    //   const capture = useCallback(
    //     () => {
    //       const imageSrc = webcamRef.current.getScreenshot();
    //       setGetImg(imageSrc);
    //     },
    //     [webcamRef]
    //   );
    useEffect(() => {
        const loadModels = async () => {
            const modelUrl = SERVICE.FACEDETECTLOGINMODEL;


            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
                faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
                faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)
            ]);
        };
        loadModels();

    }, []);

    const [btnUpload, setBtnUpload] = useState(false);
    const capture = useCallback(() => {
        setBtnUpload(true);
        const imageSrc = webcamRef.current.getScreenshot();
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageSrc;

        image.onload = async () => {
            try {
                const detections = await faceapi
                    .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                if (detections.length > 0) {
                    const faceDescriptor = detections[0].descriptor;

                    const response = await axios.post(
                        `${SERVICE.DUPLICATEFACEDETECT}`,
                        {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            id: employeeid,
                            faceDescriptor: Array.from(faceDescriptor),
                        }
                    );

                    if (response?.data?.matchfound) {
                        setPopupContentMalert('Image already exist.');
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();
                        setBtnUpload(false);
                    } else {
                        setGetImg(imageSrc);
                        setGetImgFaceId(Array.from(faceDescriptor));
                        setBtnUpload(false);

                    }
                } else {
                    setPopupContentMalert('No face detected.');
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setBtnUpload(false);
                }
            } catch (error) {
                setPopupContentMalert('Error in face detection.');
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } finally {
                setBtnUpload(false); // Disable loader when done
            }
        }

        image.onerror = (err) => {
            setPopupContentMalert('Error loading image.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();;
            setBtnUpload(false); // Disable loader in case of error
        };

    }, [webcamRef]);
    const retake = useCallback(
        () => {
            setGetImg(null);
            setGetImgFaceId([]);
        },
        [webcamRef]
    );

    return (
        <>
            <Box>
                <Typography variant="h4"><b>Web camera capture image!</b></Typography><br />
                <Webcam
                    audio={false}
                    height={200}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                />
                <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <LoadingButton
                        onClick={() => {
                            capture();
                        }}
                        variant="contained"
                        loading={btnUpload}
                    >
                        Capture
                    </LoadingButton>
                    <Button variant="contained" onClick={retake}>Retake</Button>
                </Grid><br />
                <Box>
                    <img src={getImg} id="productimage" width="100" height="100" />
                </Box>


            </Box>
            {/* VALIDATION */}
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
        </>
    )
}

export default ProfilePageWebCam;