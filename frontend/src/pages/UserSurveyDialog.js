import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AuthContext } from '../context/Appcontext';
import ShieldIcon from '@mui/icons-material/Shield';
import PinIcon from '@mui/icons-material/Pin';
import { BASE_URL } from '../services/Authservice';
import { Container, Checkbox, Grid, Skeleton, FormControl, OutlinedInput, FormControlLabel, ListItem, List, Paper, Box } from '@mui/material';
import axios from '../axiosInstance';
import { SERVICE } from '../services/Baseservice';
import confetti from 'canvas-confetti';
const UserSurveyDialog = ({ open, onClose, surveyData, serverDate, employeeData, getCurrentServerTime, fetchUserSurvey }) => {
    const today = new Date(serverDate);
    console.log(serverDate, "serverDate")
    const { auth } = useContext(AuthContext);
    // Check if any test ends today or earlier
    const hasZeroDaysLeft = surveyData?.some((item) => {
        const endDate = new Date(item.enddate);
        const remainingMs = endDate - today;
        const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
        return remainingDays <= 0;
    });

    const handleApproveLater = () => {
        if (!hasZeroDaysLeft) onClose();
    };
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const [errorValidation, setErrorValidation] = useState('');
    const [openValidation, setOpenValidation] = useState(false);
    const [otp, setOtp] = useState('');
    const [openOTPView, setOpenOTPView] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogTermsConditions, setOpenDialogTermsConditions] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', description: '', key: '' });
    const [openGreetDialog, setOpenGreetDialog] = React.useState(false);
    const handleViewOpenOTP = () => {
        setOpenOTPView(true);
    };
    const handlViewCloseOTP = () => {
        setOpenOTPView(false);
        setOtp('');
        setError('');
    };
    //view popup
    const [openView, setOpenView] = useState(false);
    const handleViewOpen = () => {
        setOpenView(true);
        setOtp('');
    };
    const handlViewClose = () => {
        setOpenView(false);
        setOtp('');
    };

    const handleOpenValidation = () => {
        setOpenValidation(true);
        setErrorValidation('');
    };
    const handleCloseValidation = () => {
        setOpenValidation(false);
        setErrorValidation('');
        setMobile('');
        setDob('');
        setErrorValidation('');
    };

    const handleMobileChange = (e) => {
        const enteredValue = e.target.value.replace(/\D/, ''); // Allow digits only
        if (/^\d{0,10}$/.test(enteredValue)) {
            setMobile(enteredValue);
        }
    };

    const handleDOBChange = (e) => {
        setDob(e.target.value);
    };
    const [groupingData, setGroupingData] = useState({})
    const redirectFun = async () => {
        try {
            let serverDT = await getCurrentServerTime();
            let systemName = employeeData?.loginUserStatus?.find((data) => data?.status === "Active")

            let testdetails = [
                {
                    employeename: employeeData?.companyname,
                    teststatus: "On Progress",
                    startedAt: new Date(serverDT?.currentNewDate),
                    localip: systemName?.localip || "",

                    macaddress: systemName?.macaddress || "",
                    hostname: systemName?.hostname || "",
                    systemusername: systemName?.username || "",
                    // responseid:,
                    // completedAt:,


                }]

            await axios.put(
                `${SERVICE.SINGLE_USER_SURVEY_QUESTIONS_GROUPING}/${groupingData?._id}`,
                {
                    testdetails
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchUserSurvey();
            let url = `${BASE_URL}/usersurvey/${employeeData?._id}/${groupingData?._id}/${groupingData?.testname}`
            window.open(url, '_blank'
                // , 'location=yes,height=0,width=0,scrollbars=yes,status=yes'
            );
        } catch (err) {

        }
    }

    const validateAndSubmit = () => {
        if (mobile === '') {
            setErrorValidation('Please Enter Mobile number');
            return;
        }
        if (mobile !== '' && mobile.length !== 10) {
            setErrorValidation('Mobile number must be 10 digits.');
            return;
        }
        else if (dob === '') {
            setErrorValidation('Please Select DOB');
            return;
        } else {
            verifyValidation();
        }
    };

    const checkOtp = async () => {
        try {
            let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL}`, {
                otp: String(otp),
                companyname: employeeData?.companyname,
            });
            if (response.data.otpneeded == true) {
                handleViewOpenOTP();
            } else {
                handleOpenValidation();
            }
        } catch (err) {
            console.log(err, 'err');
        }
    };
    const verifyOtp = async () => {
        try {
            if (otp != '') {
                let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL}`, {
                    otp: String(otp),
                    companyname: employeeData?.companyname,
                });
                console.log(response?.data, 'response?.data');
                if (response?.data?.success == true) {
                    handlViewCloseOTP();
                    const canvas = document.getElementById('confettiCanvas');
                    const myConfetti = confetti.create(canvas, { resize: true });
                    // Trigger the confetti effect
                    myConfetti({
                        particleCount: 360,
                        spread: 180,
                        origin: { y: 0.8 },
                    });
                    setOpenGreetDialog(true);
                    redirectFun()

                    //   getApprovalDocument(documentData?.data?.sdocumentPreparation);
                } else {
                    handlViewClose();
                    setError('Error Verifying OTP');
                }
                setError('');
            } else {
                setError('Please Enter OTP');
            }
        } catch (err) {
            if (!err?.response?.data?.success) {
                setError(err?.response?.data?.message);
            }

            console.log(err, 'err');
        }
    };
    const verifyValidation = async () => {
        try {
            if (dob != '' || mobile != '') {
                let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL_VALIDATION}`, {
                    dateofbirth: String(dob),
                    mobile: String(mobile),
                    companyname: employeeData?.companyname,
                });
                if (response?.data?.success == true) {
                    handleCloseValidation();
                    const canvas = document.getElementById('confettiCanvas');
                    const myConfetti = confetti.create(canvas, { resize: true });
                    // Trigger the confetti effect
                    myConfetti({
                        particleCount: 360,
                        spread: 180,
                        origin: { y: 0.8 },
                    });
                    setOpenGreetDialog(true);
                    redirectFun()
                    //   getApprovalDocument(documentData?.data?.sdocumentPreparation);
                } else {
                    handleCloseValidation();
                    setMobile('');
                    setDob('');
                    setErrorValidation('');
                }
            }
        } catch (err) {
            const error = err?.response?.data?.message;
            setErrorValidation(error);
            setMobile('');
            setDob('');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={hasZeroDaysLeft ? () => { } : onClose} maxWidth="sm" fullWidth>
                <DialogTitle>User Survey Test</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {surveyData.map((item, index) => {
                            const endDate = new Date(item.enddate);
                            const remainingMs = endDate - today;
                            const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

                            return (
                                <Card key={index} variant="outlined">
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <div>
                                                <Typography variant="h6">{item.testname}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Remaining Days: {remainingDays <= 0 ? '0 (Ends Today)' : `${remainingDays} day(s)`}
                                                </Typography>
                                            </div>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    setGroupingData(item)
                                                    checkOtp()
                                                    // Start Test button logic
                                                    console.log("Start Test for:", item.testname);
                                                }}
                                            >
                                                Start
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                </DialogContent>

                {!hasZeroDaysLeft && (
                    <DialogActions>
                        <Button onClick={handleApproveLater}>Later</Button>
                    </DialogActions>
                )}
            </Dialog>

            <Dialog
                open={openOTPView}
                onClose={handlViewCloseOTP}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xs"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '20px',
                        padding: '30px',
                        minWidth: '400px',
                        background: '#1E1E2E',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    },
                }}
            >
                <DialogContent>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <PinIcon
                                sx={{
                                    fontSize: '100px',
                                    color: '#FAC921',
                                    textAlign: 'center',
                                    animation: 'pulse 1.5s infinite',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <FormControl sx={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight="bold" color="#FAC921" gutterBottom>
                                    Enter Two Factor OTP
                                    <b style={{ color: 'red' }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => {
                                        const enteredValue = e.target.value.replace(/\D/, '');
                                        if (/^\d{0,6}$/.test(enteredValue)) {
                                            setOtp(enteredValue);
                                        }
                                    }}
                                    inputProps={{
                                        maxLength: 6,
                                    }}
                                    sx={{
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        '& .MuiOutlinedInput-input': {
                                            fontSize: '15px',
                                            textAlign: 'center',
                                            letterSpacing: '5px',
                                        },
                                    }}
                                />
                                {error && <Typography sx={{ color: 'red', fontSize: '0.9rem', marginTop: '10px' }}>{error}</Typography>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#2A2A3B', borderRadius: '0 0 20px 20px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            padding: '10px 30px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#1976D2',
                            '&:hover': {
                                backgroundColor: '#135BA1',
                            },
                        }}
                        onClick={verifyOtp}
                    >
                        Verify
                    </Button>
                    <Button
                        onClick={() => {
                            handlViewCloseOTP();
                            setOtp('');
                            setError('');
                        }}
                        sx={{
                            padding: '10px 30px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            border: '1px solid #FAC921',
                            '&:hover': {
                                backgroundColor: '#FAC921',
                                color: '#000',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openValidation}
                onClose={handleCloseValidation}
                maxWidth="xs"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '20px',
                        padding: '30px',
                        minWidth: '400px',
                        background: '#1E1E2E',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    },
                }}
            >
                <DialogContent>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <ShieldIcon
                                sx={{
                                    fontSize: '80px',
                                    color: '#FAC921',
                                    animation: 'pulse 1.5s infinite',
                                }}
                            />{' '}
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <FormControl sx={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                                <Typography variant="h8" fontWeight="bold" color="#FAC921" gutterBottom>
                                    Enter Mobile Number<b style={{ color: 'red' }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    value={mobile}
                                    onChange={handleMobileChange}
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                    sx={{
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        '& .MuiOutlinedInput-input': {
                                            fontSize: '15px',
                                            textAlign: 'center',
                                            letterSpacing: '2px',
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <FormControl sx={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                                <Typography variant="h8" fontWeight="bold" color="#FAC921" gutterBottom>
                                    Enter Date of Birth<b style={{ color: 'red' }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    type="date"
                                    value={dob}
                                    onChange={handleDOBChange}
                                    sx={{
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        '& .MuiOutlinedInput-input': {
                                            fontSize: '15px',
                                            textAlign: 'center',
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {errorValidation && <Typography sx={{ color: 'red', fontSize: '0.9rem', marginTop: '10px' }}>{errorValidation}</Typography>}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#2A2A3B', borderRadius: '0 0 20px 20px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            padding: '10px 30px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#1976D2',
                            '&:hover': {
                                backgroundColor: '#135BA1',
                            },
                        }}
                        onClick={validateAndSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={() => {
                            handleCloseValidation();
                            setMobile('');
                            setDob('');
                            setErrorValidation('');
                        }}
                        sx={{
                            padding: '10px 30px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            border: '1px solid #FAC921',
                            '&:hover': {
                                backgroundColor: '#FAC921',
                                color: '#000',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};

export default UserSurveyDialog;
