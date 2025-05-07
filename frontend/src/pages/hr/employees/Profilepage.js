import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, FormControl, Dialog, DialogActions, DialogContent, Grid, Button, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ProfilePageWebCam from "../employees/ProfilePageWebCam";
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import 'cropperjs/dist/cropper.css';
import "react-image-crop/dist/ReactCrop.css";
import * as faceapi from "face-api.js";
import MessageAlert from "../../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";

function Profilepage() {
    const emp_id = useParams().id;
    const ispassword_Access = useParams()?.form;
    let backPage = useNavigate();

    const { isUserRoleAccess } =
        useContext(UserRoleAccessContext);
    const [empaddformedit, setEmpaddformedit] = useState({ username: "", password: "", cpassword: "" });
    const [empaddform, setEmpaddform] = useState({ username: "", password: "", cpassword: "", faceDescriptor: [] });
    const { auth, setAuth } = useContext(AuthContext);
    //to add state for validator
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordc, setShowPasswordc] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowPasswordc = () => setShowPasswordc((show) => !show);

    const handleMouseDownPasswordc = (event) => {
        event.preventDefault();
    };


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
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        // setUpdateLoader(false);
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        // setUpdateLoader(false);
        setOpenPopup(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //crop image
    const [selectedFile, setSelectedFile] = useState(null);
    const [croppedImage, setCroppedImage] = useState('');
    const cropperRef = useRef(null);

    const [documentID, setDocumentID] = useState("");

    //get all employees list details fro user
    const fetchEmployee = async () => {
        try {
            let res_employee = await axios.get(`${SERVICE.USER_SINGLE}/${emp_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let responsenew = await axios.post(
                SERVICE.EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONID,
                {
                    commonid: emp_id,
                }
            );
            let ans = res_employee?.data?.suser
            let finalans = responsenew?.data?.semployeedocument
            let result = { ...ans, ...finalans }
            setEmpaddform(result);
            setDocumentID(responsenew?.data?.semployeedocument?._id);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    //webcam

    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [getImg, setGetImg] = useState(null)
    const [getImgFaceId, setGetImgFaceId] = useState([])
    const [isWebcamCapture, setIsWebcamCapture] = useState(false)
    const [file, setFile] = useState("");
    const [isPasswordChange, setIsPasswordChange] = useState(false);

    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
    };
    const closeWebCam = () => {
        // setEmpaddform({ ...empaddform, profileimage: "", faceDescriptor: []  });
        setGetImg(null);
        setGetImgFaceId([]);
    };
    const webcamDataStore = () => {
        if (getImgFaceId?.length && getImg) {

            setEmpaddform((prev) => ({ ...prev, profileimage: getImg, faceDescriptor: getImgFaceId }));
        }
        setIsWebcamCapture(true)
        //popup close
        webcamClose();
    }
    //add webcamera popup
    const showWebcam = () => {
        webcamOpen();

    }
    //image cropping
    const handleFileSelect = (acceptedFiles) => {
        setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
    };

    const handleCrop = () => {
        if (typeof cropperRef.current.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        const croppedImageData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
        setCroppedImage(croppedImageData);
        setEmpaddform({ ...empaddform, profileimage: croppedImageData });
        setSelectedFile(null)
        setGetImg(null);
        setGetImgFaceId([]);
        // handleChangeImage()
    };


    const handleClearImage = () => {
        setFile(null);
        setGetImg(null);
        setGetImgFaceId([]);
        setSelectedFile(null)
        setCroppedImage(null);
        setEmpaddform({ ...empaddform, profileimage: "", faceDescriptor: [], });
    };

    // useEffect(() => {
    //     setEmpaddform((prev) => ({ ...prev, profileimage: getImg }))
    // }, [getImg])

    // let capture = isWebcamCapture == true ? getImg : croppedImage ;
    let final = croppedImage ? croppedImage : empaddform.profileimage;

    // Image Upload
    // function handleChangeImage(e) {
    //     let profileimage = document.getElementById("profileimage")
    //     var path = (window.URL || window.webkitURL).createObjectURL(profileimage.files[0]);
    //     toDataURL(path, function (dataUrl) {
    //         profileimage.setAttribute('value', String(dataUrl));
    //         setEmpaddform({ ...empaddform, profileimage: String(dataUrl) })
    //         return dataUrl;
    //     })
    //     setFile(URL.createObjectURL(e.target.files[0]));
    // }

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
        console.log("FaceRecognitionNet loaded:", faceapi.nets.faceRecognitionNet.isLoaded);

    }, []);
    const [btnUpload, setBtnUpload] = useState(false);
    function handleChangeImage(e) {
        setBtnUpload(true); // Enable loader when the process starts
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

        // Get the selected file
        const file = e.target.files[0];

        if (file && file.size < maxFileSize) {
            const path = URL.createObjectURL(file);
            const image = new Image();
            image.src = path;

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
                                id: emp_id,
                                faceDescriptor: Array.from(faceDescriptor),
                            }
                        );

                        if (response?.data?.matchfound) {
                            setPopupContentMalert('Image already exist.');
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();
                        } else {
                            toDataURL(path, function (dataUrl) {
                                setEmpaddform({
                                    ...empaddform,
                                    profileimage: String(dataUrl),
                                    faceDescriptor: Array.from(faceDescriptor),
                                });
                            });
                            setFile(URL.createObjectURL(file));
                        }
                    } else {
                        setPopupContentMalert('No face detected.');
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();
                    }
                } catch (error) {
                    setPopupContentMalert('Error in face detection.');
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } finally {
                    setBtnUpload(false); // Disable loader when done
                }
            };

            image.onerror = (err) => {
                setPopupContentMalert('Error loading image.');
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();;
                setBtnUpload(false); // Disable loader in case of error
            };

            setFile(URL.createObjectURL(file));
        } else {
            setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            setBtnUpload(false); // Disable loader if file is too large
        }
    }


    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }
    let updateby = empaddform?.updatedby;

    const sendRequestt = async () => {
        try {
            let resSetting = await axios.get(
                `${SERVICE.GET_OVERALL_SETTINGS}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            const paswordupdateday = resSetting?.data?.overallsettings[0]?.passwordupdatedays || "";

            let res = await axios.put(`${SERVICE.USER_SINGLE}/${emp_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                password: String(empaddformedit.password),
                faceDescriptor: empaddform.profileimage ? (empaddform?.faceDescriptor?.length > 0 ? empaddform?.faceDescriptor : []) : [],
                originalpassword: String(empaddformedit.cpassword),
                passexpdate: new Date(new Date().setDate(new Date().getDate() + Number(paswordupdateday))),
                newEmployeePassUpdateCheck: Boolean(false),
                updatedby: [
                    ...updateby,
                    { name: String(isUserRoleAccess?.companyname), date: String(new Date()) },
                ],
            });



            let ress = await axios.put(`${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${documentID}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                profileimage: String(empaddform.profileimage),
            });


            if (empaddform?.rocketchatid) {
                let res = await axios.put(
                    `${SERVICE.UPDATE_ROCKETCHAT_USER_DETAILS}`,
                    {
                        id: String(empaddform?.rocketchatid),
                        employeeid: emp_id,
                        password: String(empaddformedit.cpassword),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
            }

            let companyEmailArray = empaddform?.companyemail?.split(",")
            if (companyEmailArray?.length) {
                try {
                    let domainUpdate = await axios.post(
                        SERVICE.UPDATEDOMAINMAILUSERPASSWORD,
                        {
                            usernames: companyEmailArray,
                            password: String(empaddformedit.originalpassword),
                        }
                    );
                    console.log("Password Changed Successfully in post fix")

                } catch (error) {
                    console.log(error, "Error Changing password in post fix")
                }
            }
            setEmpaddformedit(res.data);
            backPage("/dashboard");
            setEmpaddformedit({ password: "", cpassword: "" })
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }
    // console.log(empaddform, "empaddform")
    const sendRequesttpwd = async () => {
        try {
            // Ensure default values to avoid undefined
            const faceDescriptor = empaddform.profileimage
                ? empaddform?.faceDescriptor?.length > 0
                    ? empaddform.faceDescriptor
                    : []
                : [];
            const profileImage = empaddform.profileimage
                ? empaddform.profileimage
                : ""; // Default to empty string if undefined

            // First API call
            const res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${emp_id}`,
                {
                    faceDescriptor: faceDescriptor,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

            // Second API call
            const ress = await axios.put(`${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${documentID}`,
                {
                    profileimage: profileImage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

            setEmpaddformedit(ress.data);
            backPage("/dashboard");
            setEmpaddformedit({ password: "", cpassword: "" });
        } catch (err) {
            console.error(err);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (empaddformedit.cpassword != empaddformedit.password) {
            setFormError("Password didn't match")
        }
        else if (!empaddform.profileimage) {
            setPopupContentMalert('Please upload Profile Image');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isPasswordChange && empaddformedit.cpassword == empaddformedit.password) {
            sendRequestt();
        }
        else {
            sendRequesttpwd();
        }
    }

    useEffect(
        () => {
            fetchEmployee();
        }, []
    );

    return (
        <Box >
            <br />
            <Box sx={userStyle.container}>
                <form onSubmit={handleSubmit}>
                    <Typography sx={userStyle.SubHeaderText}>Profilepage</Typography><br /><br /><br />
                    <Grid container spacing={2}>
                        <Grid item md={7} xs={12} sm={12}>
                            <Grid item md={10} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography sx={userStyle.titletxt}> User Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={empaddform.username}
                                        placeholder="user name"
                                        disabled
                                        endAdornment={<InputAdornment position="end"><PersonIcon sx={{ fontSize: "25px" }} /></InputAdornment>}
                                    />
                                </FormControl>
                            </Grid><br /> <br />
                            <Grid item md={10} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography sx={userStyle.titletxt}> New Password</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => {
                                            setEmpaddformedit({ ...empaddformedit, password: e.target.value });
                                            if (e.target.value === "") { setIsPasswordChange(false); } else {
                                                setIsPasswordChange(true);
                                            }
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility sx={{ fontSize: "25px" }} /> : <VisibilityOff sx={{ fontSize: "25px" }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid> <br /> <br />
                            <Grid item md={10} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography sx={userStyle.titletxt}> Confirm Password</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type={showPasswordc ? 'text' : 'password'}
                                        placeholder="confirm Password"
                                        onChange={(e) => { setEmpaddformedit({ ...empaddformedit, cpassword: e.target.value }) }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPasswordc}
                                                    onMouseDown={handleMouseDownPasswordc}
                                                    edge="end"
                                                >
                                                    {showPasswordc ? <Visibility sx={{ fontSize: "25px" }} /> : <VisibilityOff sx={{ fontSize: "25px" }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <Typography className="error-message" color={formError ? "error" : ""}>{formError}</Typography>
                                </FormControl>
                            </Grid> <br /> <br />
                        </Grid><br /><br />

                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>

                            {/* {croppedImage && (
                                        <> */}
                            <img style={{ height: 120 }} src={empaddform.profileimage} alt="" />

                            {/* </>
                                    )} */}
                            <div>
                                {(empaddform.profileimage && !croppedImage) ? (
                                    <>
                                        <Cropper
                                            style={{ height: 120, width: '100%' }}
                                            aspectRatio={1 / 1}
                                            // src={selectedFile}
                                            src={empaddform.profileimage}
                                            ref={cropperRef}
                                        />
                                        <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                                            <Box>
                                                <Typography sx={userStyle.uploadbtn} onClick={handleCrop}>Crop Image</Typography>
                                            </Box>
                                            <Box >
                                                <Button variant="outlined" sx={userStyle.btncancel} onClick={handleClearImage}>Clear</Button>
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <Grid container sx={{ display: 'flex' }}>
                                        {!empaddform.profileimage &&
                                            <>
                                                <Grid item md={4} sm={4}>
                                                    <section>
                                                        <LoadingButton
                                                            component="label"
                                                            variant="contained"
                                                            loading={btnUpload}
                                                        // sx={buttonStyles.buttonsubmit}
                                                        >
                                                            Upload
                                                            <input
                                                                type="file"
                                                                id="profileimage"
                                                                name="file"
                                                                accept="image/*"
                                                                hidden
                                                                onChange={handleChangeImage}
                                                            />
                                                            <br />
                                                        </LoadingButton>
                                                    </section>
                                                </Grid>
                                                <Grid item md={4} sm={4}>
                                                    <Button onClick={showWebcam} variant="contained" sx={userStyle.uploadbtn}><CameraAltIcon /></Button>
                                                </Grid>
                                            </>}
                                        {empaddform.profileimage && (
                                            <>
                                                <Grid item md={4} sm={4}>
                                                    <Button variant="outlined" sx={userStyle.btncancel} onClick={handleClearImage}>Clear</Button>
                                                </Grid>

                                            </>
                                        )}
                                    </Grid>
                                )}

                            </div>
                        </Grid>
                    </Grid><br /><br />
                    <Grid container sx={{ justifyContent: "center", display: "flex" }} spacing={2}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Update
                            </Button>

                        </Grid>
                        <Grid item>
                            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}> <Button sx={userStyle.btncancel}> Cancel </Button> </Link>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <Dialog
                open={isWebcamOpen}
                onClose={(event, reason) => {
                    if (reason === "backdropClick") {
                        // Ignore backdrop clicks
                        return;
                    }
                    webcamClose(); // Handle other close actions
                    closeWebCam();
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <ProfilePageWebCam getImg={getImg} setGetImg={setGetImg} employeeid={emp_id} setGetImgFaceId={setGetImgFaceId} getImgFaceId={getImgFaceId} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={webcamDataStore}>OK</Button>
                    <Button variant="contained" color="error" onClick={() => {
                        webcamClose();
                        closeWebCam();
                    }}>CANCEL</Button>
                </DialogActions>
            </Dialog>

            {  /* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }} >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>

            {/* VALIDATION */}
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
        </Box>
    );
}
export default Profilepage;

