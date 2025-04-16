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
import Webcamimage from "../employees/Webcamprofile";
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import 'cropperjs/dist/cropper.css';
import "react-image-crop/dist/ReactCrop.css";

function Profilepage() {
    const emp_id = useParams().id;
    let backPage = useNavigate();
    const [empaddformedit, setEmpaddformedit] = useState({ username: "", password: "", cpassword: "" });
    const [empaddform, setEmpaddform] = useState({ username: "", password: "", cpassword: "" });
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
    const [isWebcamCapture, setIsWebcamCapture] = useState(false)
    const [file, setFile] = useState("");
    const [isPasswordChange, setIsPasswordChange] = useState(false);

    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
    };

    const webcamDataStore = () => {
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
        setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
        setSelectedFile(null)
        setGetImg(null);
        // handleChangeImage()
    };


    const handleClearImage = () => {
        setFile(null);
        setGetImg(null);
        setSelectedFile(null)
        setCroppedImage(null);

    };

    // let capture = isWebcamCapture == true ? getImg : croppedImage ;
    let final = croppedImage ? croppedImage : empaddform.profileimage;

    // Image Upload
    function handleChangeImage(e) {
        let profileimage = document.getElementById("profileimage")
        var path = (window.URL || window.webkitURL).createObjectURL(profileimage.files[0]);
        toDataURL(path, function (dataUrl) {
            profileimage.setAttribute('value', String(dataUrl));
            setEmpaddform({ ...empaddform, profileimage: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const sendRequestt = async () => {
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE}/${emp_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                password: String(empaddformedit.password),
                originalpassword: String(empaddformedit.cpassword),
                passexpdate: new Date(new Date().setDate(new Date().getDate() + 90)),

            });

            let ress = await axios.put(`${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${documentID}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                profileimage: String(final),
            });
            setEmpaddformedit(res.data);
            backPage("/dashboard");
            setEmpaddformedit({ password: "", cpassword: "" })
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }
    const sendRequesttpwd = async () => {
        try {
            let ress = await axios.put(`${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${documentID}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                profileimage: String(final),
            });
            setEmpaddformedit(ress.data);
            backPage("/dashboard");
            setEmpaddformedit({ password: "", cpassword: "" })
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (empaddformedit.cpassword != empaddformedit.password) {
            setFormError("Password didn't match")
        } else if (isPasswordChange && empaddformedit.cpassword == empaddformedit.password) {
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
                                        onChange={(e) => { setEmpaddformedit({ ...empaddformedit, password: e.target.value }); setIsPasswordChange(true); }}
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
                            <img style={{ height: 120 }} src={croppedImage === "" ? empaddform.profileimage : croppedImage} alt="" />

                            {/* </>
                                    )} */}
                            <div>
                                {selectedFile || getImg ? (
                                    <>
                                        <Cropper
                                            style={{ height: 120, width: '100%' }}
                                            aspectRatio={1 / 1}
                                            // src={selectedFile}
                                            src={selectedFile ? selectedFile : getImg}
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

                                        <Grid item md={4} sm={4}>
                                            <Dropzone onDrop={handleFileSelect}>
                                                {({ getRootProps, getInputProps }) => (

                                                    <section>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} id="profileimage" onChange={handleChangeImage} />

                                                            <Typography sx={userStyle.uploadbtn}>Upload</Typography><br />
                                                        </div>
                                                    </section>

                                                )}
                                            </Dropzone>
                                        </Grid>
                                        <Grid item md={4} sm={4}>
                                            <Button onClick={showWebcam} variant="contained" sx={userStyle.uploadbtn}><CameraAltIcon /></Button>
                                        </Grid>

                                        {croppedImage && (
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
                onClose={webcamClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Webcamimage getImg={getImg} setGetImg={setGetImg} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={webcamDataStore}>OK</Button>
                    <Button variant="contained" color="error" onClick={webcamClose}>CANCEL</Button>
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
        </Box>
    );
}
export default Profilepage;