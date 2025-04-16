import React, { useState, useEffect } from "react";
import { SERVICE } from "../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import "../App.css";
import { handleApiError } from "../components/Errorhandling";
import hilifelogo from "../login/hilifelogo.png";
import {
    Box,
    Typography,
    OutlinedInput,
    Container,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    InputAdornment,
    IconButton,
    Button,
} from "@mui/material";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useParams } from "react-router-dom";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function UserPasswordCredentials() {
    const { id } = useParams();

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [candidateFiles, setCandidateFiles] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    useEffect(() => {
        fetchStatus();
    }, [id]);

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn(false)
    };

    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const fetchStatus = async () => {
        try {
            let response = await axios.get(`${SERVICE.USER_SINGLE}/${id}`);


            if(response?.data?.suser?.resetstatus === true){
                backPage(`/passwordresetgreetmsg`);
            }else {
                setCandidateFiles(response?.data?.suser)
            }

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const backPage = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newPassword === "" || newPassword === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {`Please Enter New Password`}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else if (confirmPassword === "" || confirmPassword === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {`Please Enter Confirm Password`}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (confirmPassword != "" && newPassword != "" && (newPassword != confirmPassword)) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {`Passwords doesn't match`}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }

            else {
                setIsBtn(true)
                let response = await axios.put(
                    `${SERVICE.USER_SINGLE_PWD_RESET}/${candidateFiles?._id}`,
                    {
                        password: newPassword,
                        originalpassword: confirmPassword,
                        resetstatus : true
                    }
                );
            setIsBtn(false)
                backPage(`/passwordresetgreetmsg`);
            }
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };




    return (
        <>
            <div
                style={{
                    textAlign: "center",
                    paddingTop: "50px",
                }}
            >
                <div
                    style={{
                        padding: "10px",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        backgroundColor: "black",
                        zIndex: 1,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={hilifelogo}
                            alt="Logo"
                            style={{ height: "50px", width: "auto", marginRight: "10px" }}
                        />
                        <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }}>
                            HIHRMS
                        </h2>
                    </div>
                </div>
            </div>

            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "90vh",
                    paddingTop: "60px",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#ecf0f1",
                        border: "2px solid lightgray",
                        borderRadius: "10px",
                        padding: "20px",
                        width: "100%",
                        maxWidth: 500,
                        boxSizing: "border-box",
                        boxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
                        // textAlign: "center",
                    }}
                >

                    <Grid container spacing={2}>
                        <Typography variant="h6">
                            Password Reset
                        </Typography>

                        <br />
                        <Grid item md={12} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Username
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Username"
                                    value={candidateFiles?.companyname}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    New Password<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                 id="outlined-adornment-password"
                                 type={showPassword ? "text" : "password"}
                                    placeholder="Please Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                    }}
                       
                                    endAdornment={
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                          >
                                            {!showPassword ? (
                                              <VisibilityOff sx={{ fontSize: "25px" }} />
                                            ) : (
                                              <Visibility sx={{ fontSize: "25px" }} />
                                            )}
                                          </IconButton>
                                        </InputAdornment>
                                      }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Confirm Password<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>{" "}
                    <LoadingButton
                    loading={isBtn}
                        variant="contained"
                        color="primary"
                        onClick={(e)=> handleSubmit(e)}
                        style={{ marginTop: "20px" }}
                    >
                        Submit
                    </LoadingButton>

                </Box>
            </Container>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default UserPasswordCredentials;