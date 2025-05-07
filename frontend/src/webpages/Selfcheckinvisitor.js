
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import hilifelogo from "../login/hilifelogo.png";
import Footer from "../components/footer/footer.js";
import { SERVICE } from "../services/Baseservice";
import { handleApiError } from "../components/Errorhandling";
import { Typography, Grid, Box, Button, Dialog, DialogContent, DialogActions, FormControl, TextField, InputAdornment, IconButton } from "@mui/material";
import Selects from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

function SelfCheckInVisitor() {

    const mode = useParams()?.mode;
    const candidateid = useParams()?.candidateid;
    const roundid = useParams()?.roundid;

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const navigation = useNavigate();

    const [branches, setBranches] = useState([]);

    console.log(branches, "branches")

    const fetchBranch = async () => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                // headers: {
                //   Authorization: `Bearer ${auth.APIToken}`,
                // },
            });
            setBranches(res_branch?.data?.branch?.map((item) => ({
                ...item,
                label: item.name,
                value: item.name,
            })));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [selfCheckVisitor, setSelfcheckVisitor] = useState({
        company: "",
        branch: "Please Select Branch"
    })

    const handlesubmit = () => {
        if (selfCheckVisitor?.branch === "Please Select Branch") {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Select Branch</p>{" "}
                </>
            );
            handleClickOpenerr();
        } else {
            navigation(`/Checkinvisitor/${selfCheckVisitor.company}/${selfCheckVisitor.branch}`);
        }
    }

    const handleClear = () => {


        setSelfcheckVisitor({
            company: "",
            branch: "Please Select Branch"
        })
        setShowAlert(
            <>
                {" "}
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />{" "}
                <p style={{ fontSize: "20px", fontWeight: 900 }}>Cleared Successfully</p>{" "}
            </>
        );
        handleClickOpenerr();
    }

    useEffect(() => {
        fetchBranch();
    }, [])

    return (
        <>
            <div
                style={{
                    paddingTop: "50px",
                }}
            >
                {/* Navbar */}
                <div
                    style={{
                        padding: "15px 20px",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "#e0dfdc", // Dark formal background
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                        zIndex: 1,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={hilifelogo}
                            alt="Logo"
                            style={{
                                height: "50px",
                                width: "auto",
                                marginRight: "15px",
                                transition: "transform 0.3s ease", // Smooth hover effect
                            }}
                            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")} // Hover effect
                            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")} // Reset hover
                        />
                        <h2
                            style={{
                                color: "black",
                                fontSize: "1.8rem",
                                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                fontWeight: 600,
                                margin: 0,
                            }}
                        >
                            HIHRMS
                        </h2>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minHeight: mode === "typingtest" ? "100vh" : "90vh",
                    }}
                    className="bounce-in-top"
                >
                    {/* Thank You Card */}
                    <div
                        style={{
                            backgroundColor: "#ecf0f1",
                            border: "2px solid lightgray",
                            borderRadius: "10px",
                            padding: "50px 50px",
                            width: "40%",
                            margin: "0 auto", // Center the card horizontally
                            boxSizing: "border-box",
                            boxShadow: "-1px 1px 15px 8px rgba(224, 223, 220,2.21)",
                        }}
                    // className="thankyou-card-container"
                    >
                        <Grid item md={4} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <Typography sx={{ color: "black", fontWeight: "bold" }}>
                                    Branch <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={branches}
                                    value={{ label: selfCheckVisitor.branch, value: selfCheckVisitor.branch }}
                                    onChange={(e) => {
                                        setSelfcheckVisitor({
                                            ...selfCheckVisitor,
                                            branch: e.name,
                                            company: e.company
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <br />
                        <br />
                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Button variant="contained" color="success"
                                onClick={handlesubmit}
                            >
                                Submit
                            </Button>
                            &nbsp;
                            &nbsp;
                            <Button variant="contained" sx={{
                                backgroundColor: "grey",
                                color: "white",
                                '&:hover': {
                                    backgroundColor: "darkgrey", // Hover effect
                                },
                            }}
                                onClick={handleClear}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>

                    <br />

                    <br />
                </div>
            </div>

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
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </>
    );
}

export default SelfCheckInVisitor;