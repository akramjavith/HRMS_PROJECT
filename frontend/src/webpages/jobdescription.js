// import { React, useState, useEffect } from 'react';
// import { Typography, Grid, Box, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
// import Headtitle from '../components/Headtitle';
// import { Link, useParams } from 'react-router-dom';
// import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// import axios from "axios";
// import { SERVICE } from "../services/Baseservice";
// import { handleApiError } from "../components/Errorhandling";
// import '../App.css';
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// import Logoimg from '../images/logo192.png';

// const JobdescriptionPage = () => {

//     const [jobopenening, setJobOpeing] = useState([]); 
//     const [overallSettings, setOverAllsettingsCount] = useState({});
//     // alert popup
//     const [isErrorOpen, setIsErrorOpen] = useState(false);
//     const [showAlert, setShowAlert] = useState();
//     const handleClickOpenerr = () => { setIsErrorOpen(true); };
//     const handleCloseerr = () => { setIsErrorOpen(false); };

//     const id = useParams().id

//     const getviewCode = async () => {
//         try {
//             let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${id}`);
//             setJobOpeing(res.data.sjobopening);
//          } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
//     };

//     useEffect(() => {
//         getviewCode()
//     }, [id]);

//     const fetchOverAllSettings = async () => {
//         try {
//             let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
//           setOverAllsettingsCount(res?.data?.overallsettings[0]);
    
//         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
//       }
    
//     useEffect(() => {
    
//         fetchOverAllSettings();
    
//     }, []);

//     return (
//         <Box sx={{ background: "#f6f5f3", paddingLeft: "15px", position: 'relative' }}>
//             <Headtitle title="JOB DESCRIPTION" />
//             <Box sx={{ position: 'fixed', background: "#f6f5f3", borderBottom: '1px solid #8080801a', width: '100%', height: '65px', padding: '10px', top: '0px', left: '0px', zIndex: 1 }}>
//                 <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", }}>
//                     <Grid item lg={8} md={8} sm={10} xs={12} sx={{ display: "flex", textAlign: "left", }}>
//                         {overallSettings?.companylogo &&
//                         <img src={overallSettings?.companylogo} style={{ width: '55px', heigth: '50px' }} />
// }
//                         &ensp;
                        
//                         <Typography read sx={{ textAlign: "left", alignItems: "left", color: "black", fontFamily: "FiraSansRegular !important", fontSize: "27px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "30px !important", justifyContent: "center", alignItems: "center" }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }} >
//                             {overallSettings?.companyname}
//                         </Typography>
//                     </Grid>
//                 </Grid>
//             </Box><br />
//             {/* Center content End */}
//             <Box>
//                 <Grid container spacing={2} sx={{ backgroundColor: '#FFCC00', display: "flex", justifyContent: "center" }}>
//                     <Grid item lg={6} md={6} xs={12} sm={12} sx={{ marginTop: "30px", "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', alignItems: "center" }, }}   >
//                         <Link to={'/career'} style={{ color: "#000001 ", textDecoration: "none" }}>
//                             <Typography variant='body1' sx={{ textAlign: "left", display: "flex", color: "#333", fontFamily: "FiraSansRegular !important", margin: "0px", fontSize: "18px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "16px !important" }, '@media only screen and (max-width: 150px)': { fontSize: '14px' } }} >
//                                 <KeyboardBackspaceIcon />&ensp;Jobs
//                             </Typography>
//                         </Link><br />
//                         <Typography variant='body1' sx={{textDecoration:'uppercase',color:'#000000', textAlign: "left", fontWeight: 600, display: "flex", color: "#333", fontFamily: "Source Sans Pro,Helvetica,sans-serif !important", margin: "0px", fontSize: "32px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "30px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }} >
//                             {jobopenening.recruitmentname}
//                         </Typography>
//                         <Typography variant='body2' sx={{ lineHeight: "27px", marginBottom: "30px", textAlign: "left", color: "#333", fontFamily: "FiraSansRegular !important", fontSize: "14px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }} >
//                             {jobopenening.city + "," + " " + jobopenening.state} <br />
//                             Work Type: {jobopenening.remotejob == false ? "Full Time" : "Remote"}
//                         </Typography>
//                     </Grid>
//                     <Grid item lg={2} md={2} xs={12} sm={12} sx={{ display: "flex", justifyContent: "end", margin: "auto 0px", "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", justifyContent: 'center', marginBottom: '20px' }, }} >
//                         <Link to={`/career/candidate/${jobopenening._id}`}><Button sx={{ textTransform: 'capitalize !important', fontSize: "18px", background: 'black', fontFamily: "FiraSansRegular !important", color: 'white', pading: '6px 29px', width: '140px', '&:hover': { background: 'gray', color: 'white' }, }}>
//                             Apply Now
//                         </Button>
//                         </Link>
//                     </Grid>
//                 </Grid>
//             </Box><br />
//             <Box sx={{ '& .MuiTypography-root': { fontWeight: 100 } }}>
//                 <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
//                     <Grid item lg={8} md={8} sm={10} xs={12} sx={{ marginTop: "30px", "@media only screen and (max-width: 900px) and (min-width: 250px)": { alignItems: "center" }, }} >
//                         <Typography variant='body2' sx={{ 
//                             fontSize: '16px',
//                              lineHeight: '27px', 
//                              fontFamily: "FiraSansRegular !important",
//                               letterSpacing: "0.5px",
//                              wordWrap:"break-word",
//                              overflow: 'hidden',  
//                              }}
//                          dangerouslySetInnerHTML={{
//                             __html: jobopenening.jobdescription,
//                           }}>
//                            {/* {overallSettings?.companydescription} */}
//                            {/* {jobopenening?.jobdescription} */}
//                         </Typography><br />
                        
//                     </Grid>
//                     {overallSettings?.jobrequirements &&
//                     <Grid item lg={8} md={8} xs={12} sm={10} sx={{ "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', }, }}   >
//                         <Typography sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "FiraSansRegular !important", }}><b>You'll meet our Requirements:</b></Typography><br />
//                         <Typography variant='body2' sx={{ marginLeft: '41px', lineHeight: "27px", wordSpacing: "4px", color: "#333", fontFamily: "FiraSansRegular !important", fontSize: "16px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }}
//                             dangerouslySetInnerHTML={{ __html: jobopenening.jobrequirements }}>
//                         </Typography>
//                     </Grid>
//                     }
//                     {overallSettings?.jorolesresponsibility &&
//                     <Grid item lg={8} md={8} xs={12} sm={10} sx={{ "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', }, }}   >
//                         <Typography sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "FiraSansRegular !important", }}><b>Role & Responsibilities:</b>  </Typography><br />
//                         <Typography variant='body2' sx={{ marginLeft: '41px', lineHeight: "27px", wordSpacing: "4px", color: "#333", fontFamily: "FiraSansRegular !important", fontSize: "16px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }}
//                             dangerouslySetInnerHTML={{ __html: jobopenening.rolesresponse }}>
//                         </Typography>
//                     </Grid>
//                     }
//                     {overallSettings?.jobperks &&
//                     <Grid item lg={8} md={8} xs={12} sm={10} sx={{ "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', }, }}   >
//                         <Typography sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "FiraSansRegular !important", }}><b>Perks:</b> </Typography><br />
//                         <Typography variant='body2' sx={{ marginLeft: '41px', lineHeight: "27px", wordSpacing: "4px", color: "#333", fontFamily: "FiraSansRegular !important", fontSize: "16px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }}
//                             dangerouslySetInnerHTML={{ __html: jobopenening.jobbenefits }}>
//                         </Typography><br />
//                         <Typography variant='body2' sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "FiraSansRegular !important", }}>If this excites you, apply for this opportunity, and Our team will get back with you on a call discuss further.</Typography><br />
//                     </Grid>
//                     }
//                 </Grid>
//             </Box >

//             {/* ALERT DIALOG */}
//             < Box >
//                 <Dialog
//                     open={isErrorOpen}
//                     onClose={handleCloseerr}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
//                         <Typography variant="h6" >{showAlert}</Typography>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box >
//         </Box >
//     )
// }


// function Jobdescription() {
//     return (
//         <Box>
//             <Box sx={{ width: '100%', overflowX: 'hidden' }}>
//                 <Box sx={{ maxWidth: '1600px', margin: '0 auto', padding: '3rem 0px 0px 0px' }} >
//                     <JobdescriptionPage />
//                 </Box>
//             </Box>
//         </Box >
//     );
// }
// export default Jobdescription;
import { React, useState, useEffect } from 'react';
import { Typography, Grid, Box, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import Headtitle from '../components/Headtitle';
import { Link, useParams } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { handleApiError } from "../components/Errorhandling";
import '../App.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Logoimg from '../images/logo192.png';

const JobdescriptionPage = () => {

    const [jobopenening, setJobOpeing] = useState([]);
    const [overallSettings, setOverAllsettingsCount] = useState({});
    // alert popup
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const id = useParams().id

    const getviewCode = async () => {
        try {
            let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${id}`);
            setJobOpeing(res.data.sjobopening);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        getviewCode()
    }, [id]);

    const fetchOverAllSettings = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
            setOverAllsettingsCount(res?.data?.overallsettings[0]);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    useEffect(() => {

        fetchOverAllSettings();

    }, []);

    return (
        <Box sx={{ background: "#f6f5f3", paddingLeft: "15px", position: 'relative' }}>
            <Headtitle title="JOB DESCRIPTION" />
            <Box sx={{ position: 'fixed', background: "#f6f5f3", borderBottom: '1px solid #8080801a', width: '100%', height: '65px', display: "flex", justifyContent: "center", alignItems: "center", top: '0px', left: '0px', zIndex: 1 }}>
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", }}>
                    <Grid item lg={8} md={8} sm={10} xs={12} sx={{ display: "flex", textAlign: "left", }}>
                        {overallSettings?.companylogo &&
                            <img src={overallSettings?.companylogo} style={{ width: "200px", height: "30px", objectFit: "contain", }} />
                        }
                        &ensp;

                        <Typography read sx={{ textAlign: "left", alignItems: "left", color: "black", fontFamily: "'League Spartan', sans-serif !important", fontSize: "27px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "30px !important", justifyContent: "center", alignItems: "center" }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }} >
                            {overallSettings?.companyname}
                        </Typography>
                    </Grid>
                </Grid>
            </Box><br />
            {/* Center content End */}
            <Box>
                <Grid container spacing={2} sx={{ backgroundColor: '#FFCC00', display: "flex", justifyContent: "center" }}>
                    <Grid item lg={6} md={6} xs={12} sm={12} sx={{ marginTop: "30px", "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', alignItems: "center" }, }}   >
                        <Link to={'/career'} style={{ color: "#000001 ", textDecoration: "none" }}>
                            <Typography variant='body1' sx={{ textAlign: "left", display: "flex", color: "#333", fontFamily: "'League Spartan', sans-serif !important", margin: "0px", fontSize: "18px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "16px !important" }, '@media only screen and (max-width: 150px)': { fontSize: '14px' } }} >
                                <KeyboardBackspaceIcon />&ensp;Jobs
                            </Typography>
                        </Link><br />
                        <Typography variant='body1' sx={{ textDecoration: 'uppercase', color: '#000000', textAlign: "left", fontWeight: 600, display: "flex", color: "#333", fontFamily: "'League Spartan', sans-serif !important", margin: "0px", fontSize: "32px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "30px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }} >
                            {jobopenening.recruitmentname}
                        </Typography>
                        <Typography variant='body2' sx={{ lineHeight: "27px", marginBottom: "30px", textAlign: "left", color: "#333", fontFamily: "'League Spartan', sans-serif !important", fontSize: "14px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }} >
                            {jobopenening.city + "," + " " + jobopenening.state} <br />
                            Work Type: {jobopenening.remotejob == false ? "Full Time" : "Remote"}
                        </Typography>
                    </Grid>
                    <Grid item lg={2} md={2} xs={12} sm={12} sx={{ display: "flex", justifyContent: "end", margin: "auto 0px", "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", justifyContent: 'center', marginBottom: '20px' }, }} >
                        <Link to={`/career/candidate/${jobopenening._id}`}><Button sx={{ textTransform: 'capitalize !important', fontSize: "18px", background: 'black', fontFamily: "'League Spartan', sans-serif !important", color: 'white', pading: '6px 29px', width: '140px', '&:hover': { background: 'gray', color: 'white' }, }}>
                            Apply Now
                        </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box><br />
            <Box sx={{ '& .MuiTypography-root': { fontWeight: 100 } }}>
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid item lg={8} md={8} sm={10} xs={12} sx={{ marginTop: "30px", "@media only screen and (max-width: 900px) and (min-width: 250px)": { alignItems: "center" }, }} >
                        <Typography variant='body2' sx={{
                            fontSize: '16px',
                            lineHeight: '27px',
                            fontFamily: "'League Spartan', sans-serif !important",
                            letterSpacing: "0.5px",
                            wordWrap: "break-word",
                            overflow: 'hidden',
                        }}
                            dangerouslySetInnerHTML={{
                                __html: jobopenening.jobdescription,
                            }}>
                            {/* {overallSettings?.companydescription} */}
                            {/* {jobopenening?.jobdescription} */}
                        </Typography><br />

                    </Grid>
                    {overallSettings?.jobrequirements &&
                        <Grid item lg={8} md={8} xs={12} sm={10} sx={{ "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', }, }}   >
                            <Typography sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "'League Spartan', sans-serif !important", }}><b>You'll meet our Requirements:</b></Typography><br />
                            <Typography variant='body2' sx={{ marginLeft: '41px', lineHeight: "27px", wordSpacing: "4px", color: "#333", fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }}
                                dangerouslySetInnerHTML={{ __html: jobopenening.jobrequirements }}>
                            </Typography>
                        </Grid>
                    }
                    {overallSettings?.jorolesresponsibility &&
                        <Grid item lg={8} md={8} xs={12} sm={10} sx={{ "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', }, }}   >
                            <Typography sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "'League Spartan', sans-serif !important", }}><b>Role & Responsibilities:</b>  </Typography><br />
                            <Typography variant='body2' sx={{ marginLeft: '41px', lineHeight: "27px", wordSpacing: "4px", color: "#333", fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }}
                                dangerouslySetInnerHTML={{ __html: jobopenening.rolesresponse }}>
                            </Typography>
                        </Grid>
                    }
                    {overallSettings?.jobperks &&
                        <Grid item lg={8} md={8} xs={12} sm={10} sx={{ "@media only screen and (max-width: 900px) and (min-width: 250px)": { display: "flex", flexDirection: 'column', }, }}   >
                            <Typography sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "'League Spartan', sans-serif !important", }}><b>Perks:</b> </Typography><br />
                            <Typography variant='body2' sx={{ marginLeft: '41px', lineHeight: "27px", wordSpacing: "4px", color: "#333", fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "13px !important", }, '@media only screen and (max-width: 150px)': { fontSize: '10px', } }}
                                dangerouslySetInnerHTML={{ __html: jobopenening.jobbenefits }}>
                            </Typography><br />
                            <Typography variant='body2' sx={{ fontSize: '16px', lineHeight: '27px', fontFamily: "'League Spartan', sans-serif !important", }}>If this excites you, apply for this opportunity, and Our team will get back with you on a call discuss further.</Typography><br />
                        </Grid>
                    }
                </Grid>
            </Box >

            {/* ALERT DIALOG */}
            < Box >
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box >
        </Box >
    )
}


function Jobdescription() {
    return (
        <Box>
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box sx={{ maxWidth: '1600px', margin: '0 auto', padding: '3rem 0px 0px 0px' }} >
                    <JobdescriptionPage />
                </Box>
            </Box>
        </Box >
    );
}
export default Jobdescription;