import React, { useCallback, useContext, useRef, useState } from "react";
// import { Button, Grid, Typography } from "@mui/material";
import Webcam from "react-webcam";
// import { Box } from "@material-ui/core";

import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Dialog,
    Grid,
    Tooltip,
    Typography
} from "@mui/material";
import axios from "axios";
import * as faceapi from "face-api.js";
import "jspdf-autotable";
import { AuthContext, UserRoleAccessContext } from "../context/Appcontext";
import { userStyle } from "../pageStyle";
import ExistingProfileVisitor from "../pages/interactors/visitors/ExistingProfileVisitor";
import { SERVICE } from "../services/Baseservice";
import MessageAlert from "./MessageAlert";
function WebCamWithDuplicate({
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
    setVendor,
    vendor, fromEmployee
}) {
    const { auth, setAuth } = useContext(AuthContext);
    const { isUserRoleCompare, buttonStyles, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const webcamRef = useRef(null);
    const [isFlip, setIsFlip] = useState(false);
    const [refImage, setRefImage] = useState([]);
    const [image, setImage] = useState([])

    const videoConstraints = {
        // width: 1280,
        // height: 720,
        // facingMode: { exact: "facing-Out" }
        facingMode: isFlip ? { exact: "environment" } : "user",
    };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };

    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState([]);
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    const [uploadwithDupImage, setUploadwithDupImage] = useState([])
    const [faceDeseptorDup, setFaceDeseptorDup] = useState([])

    // Image Upload
    const [btnUpload, setBtnUpload] = useState(false);
    const capture = useCallback(() => {
        setBtnUpload(true);
        const imageSrc = webcamRef.current.getScreenshot();
        const image = new Image();
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
                        `${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR}`,
                        {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            faceDescriptor: Array.from(faceDescriptor),
                        }
                    );

                    if (response?.data?.matchfound) {
                        // setIsLoading(false);
                        setUploadwithDupImage(imageSrc)
                        setFaceDeseptorDup(faceDescriptor)
                        setShowAlertpop(
                            response?.data?.matchedData
                        );
                        handleClickOpenerrpop();
                        setBtnUpload(false);
                    } else {
                        setGetImg(imageSrc);
                        if (Array.isArray(capturedImages)) {
                            let newSelectedFiles = [...capturedImages];
                            newSelectedFiles.push({
                                name: `capture.img (${valNum})`,
                                size: "",
                                type: "image/jpeg",
                                preview: imageSrc,
                                base64: imageSrc?.split(",")[1],
                            });
                            setValNum(valNum + 1);
                            setCapturedImages(newSelectedFiles);
                            setVendor({
                                ...vendor,
                                faceDescriptor: Array.from(faceDescriptor),
                            });
                            setBtnUpload(false);
                        }
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

    }, [webcamRef, capturedImages, valNum]);

    const captureedit = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setGetImgedit(imageSrc);

        if (Array.isArray(capturedImagesedit)) {
            let newSelectedFiles = [...capturedImagesedit];
            newSelectedFiles.push({
                name: `capture.img (${valNumedit})`,
                size: "",
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


    const UploadWithDuplicate = (imageSrc, faceCal) => {

        setGetImg(imageSrc);

        setVendor({
            ...vendor,
            faceDescriptor: Array.from(faceCal),
        });
        if (Array.isArray(capturedImages)) {
            let newSelectedFiles = [...capturedImages];
            newSelectedFiles.push({
                name: `capture.img (${valNum})`,
                size: "",
                type: "image/jpeg",
                preview: imageSrc,
                base64: imageSrc?.split(",")[1],
            });
            setValNum(valNum + 1);
            setCapturedImages(newSelectedFiles);

            handleCloseerrpop();
        }

    }

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
                        <LoadingButton
                            variant="contained"
                            loading={btnUpload}
                            onClick={() => {
                                captureedit();
                            }}
                        >
                            Capture
                        </LoadingButton>
                    )}
                    {name == "create" && (
                        <LoadingButton
                            onClick={() => {
                                capture();
                            }}
                            variant="contained"
                            loading={btnUpload}
                        >
                            Capture
                        </LoadingButton>
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
                    {/* <Button
                        variant="contained"
                        onClick={() => {
                            setIsFlip(!isFlip);
                        }}
                    >
                        Flip
                    </Button> */}
                </Grid>
                <br />
                <Box>
                    {name == "edit" && <img src={getImgedit} id="productimage" width="100" height="100" />}
                    {name == "create" && <img src={getImg} id="productimage" width="100" height="100" />}
                </Box>
                {/* ALERT DIALOG */}
                <Box>
                    {/* Edit DIALOG */}
                    <Dialog open={isErrorOpenpop} onClose={(event, reason) => {
                        if (reason === "backdropClick") {
                            // Ignore backdrop clicks
                            return;
                        }
                        handleCloseerrpop(); // Handle other close actions
                    }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        maxWidth="lg"
                        fullWidth={true}
                        sx={{ marginTop: "80px" }}
                    >
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Typography sx={userStyle.HeaderText}>
                                    {" "}
                                    <b>Existing Profile List</b>
                                </Typography>
                                <Grid item md={6} sm={12} xs={12}>
                                    {showAlertpop && showAlertpop.length > 0 ? (
                                        <ExistingProfileVisitor
                                            ExistingProfileVisitors={showAlertpop}
                                        />) : (
                                        <Typography sx={{ ...userStyle.HeaderText, marginLeft: '28px', display: "flex", justifyContent: "center" }}>
                                            There is No Profile
                                        </Typography>
                                    )}
                                </Grid>
                                <br />
                                <Grid item md={12} sm={12} xs={12}>
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Tooltip
                                            title={
                                                (showAlertpop?.some(data => data?.modelName === "Employee") && fromEmployee)
                                                    ? "Cannot upload duplicate images for Employee."
                                                    : ""
                                            }
                                            placement="top"
                                            arrow
                                        >
                                            <span>
                                                <Button
                                                    style={{
                                                        padding: "7px 13px",
                                                        color: "white",
                                                        background: "rgb(25, 118, 210)",
                                                        ...buttonStyles?.buttonsubmit,
                                                    }}
                                                    disabled={showAlertpop?.some(data => data?.modelName === "Employee") && fromEmployee}
                                                    onClick={() => {
                                                        UploadWithDuplicate(uploadwithDupImage, faceDeseptorDup)
                                                    }}
                                                >
                                                    Upload With Duplicate
                                                </Button>
                                            </span>
                                        </Tooltip>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
                                            Upload WithOut Duplicate
                                        </Button>
                                    </Grid>
                                </Grid>

                            </>
                        </Box>
                    </Dialog>
                </Box>
                <MessageAlert
                    openPopup={openPopupMalert}
                    handleClosePopup={handleClosePopupMalert}
                    popupContent={popupContentMalert}
                    popupSeverity={popupSeverityMalert}
                />
            </Box>
        </>
    );
}

export default WebCamWithDuplicate;