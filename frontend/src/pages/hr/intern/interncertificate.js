import React, { useRef, useState, useEffect, useContext } from 'react';
import domToImage from 'dom-to-image';
import { useParams } from 'react-router-dom';
import { SERVICE } from '../../../services/Baseservice';
import {
  Box,
  Typography,
  Grid, DialogContent, DialogActions, Dialog, Button
} from "@mui/material";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext } from '../../../context/Appcontext';
import HilifeLogo from "../intern/images/hilifeAiLOgo.png";
import StartTamil from "../intern/images/startuptn.png";
import startIndia from "../intern/images/startIndia.png";
import moment from 'moment';
import Abisign from "./ABI.png";
import Shankarisign from "./shankari.png";

function Certificate() {

  const { auth } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState("");
  const [getRole, setGetRole] = useState("");
  const [rowGetId, setRowGetid] = useState("");

  const designRef = useRef(null);
  const id = useParams().id
  const handleConvert = () => {
    domToImage.toPng(designRef.current)
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = `${userDetails.legalname}.jpg`;
        link.href = dataUrl;
        link.click();
      });
  }

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Getting User Role to an setState
  const certificate = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      let user = res.data.users.length > 0 && res.data.users.filter((data) => {
        if (localStorage.LoginUserId === data._id) {
          setGetRole(data.role);
          return data
        }
      })
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  //checking the Role from the user with Role Access Page
  const RoleAccess = async () => {
    try {
      let res = await axios.get(`${SERVICE.ROLE}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      let user = res.data.roles.length > 0 && res.data.roles.filter((data) => {
        if (getRole === data.name) {
          setRowGetid(data.access);
          return data
        }
      })
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  //set function to get particular row
  const rowData = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setUserDetails(res?.data?.suser);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }


  useEffect(() => {
    rowData();
    certificate();
  }, [])

  useEffect(() => {
    RoleAccess();
  }, [])


  return (
    <div>

      <div>
        <Box sx={{ backgroundColor: "white", width: '732px' }} ref={designRef}>
          <div style={{ padding: "15px" }}>
            <Box sx={{ border: '5px solid black', padding: '10px' }} >
              <Grid container>
                <Grid item md={3} xs={3} lg={3} sm={3}>
                  <img src={HilifeLogo} height={85} ></img>
                </Grid>
                <Grid item md={9} xs={9} lg={9} sm={9}>
                  <Typography variant="h4" sx={{ textDecoration: 'underline', fontFamily: 'auto', fontWeight: '800' }}>HILIFE.AI PRIVATE LIMITED </Typography>
                  <Grid container>
                    <Grid item md={6} xs={6} lg={6} sm={6}>
                      <Typography sx={{ fontSize: '12px' }}>CIN NUMBER - U73100TN2020PTC135567</Typography>
                    </Grid>
                    <Grid item md={6} xs={6} lg={6} sm={6}>
                      <Typography sx={{ fontSize: '12px' }}>GST NUMBER - 33AAFCH279E1ZQ</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />

              <Grid container>

                <Grid item md={12} lg={12} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography sx={{ textDecoration: 'underline', fontSize: '25px', fontFamily: 'auto', fontWeight: '800' }}>CERTIFICATE OF COMPLETION</Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={0.5} lg={0.5} xs={0.5} sm={0.5}></Grid>
                <Grid item md={3} lg={3} xs={3} sm={3} sx={{ textAlign: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: '500', fontSize: '15px', fontFamily: 'auto', color: 'skyblue' }}>Certificate Number</Typography>
                  </Box>
                  <Box sx={{ border: '2px solid black', padding: '2px', textAlign: "center" }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>{userDetails.empcode}</Typography>
                  </Box>
                </Grid>
                <Grid item md={5} lg={5} xs={5} sm={5}>

                </Grid>
                <Grid item md={3} lg={3} xs={3} sm={3}>
                  <Box sx={{ position: 'relative' }}>
                    {userDetails.profileimage ? <img src={userDetails.profileimage} height={105} style={{ position: 'absolute', marginLeft: '45px', height: '120px', marginTop: '-4PX' }}></img> : ""}
                  </Box>

                </Grid>
              </Grid>
              <br />
              <Grid container>
                <Grid item md={12} lg={12} xs={12} sm={12} sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 30, fontStyle: 'italic', textAlign: "center", fontFamily: "Devroye", }}>This is to certify that</Typography>
                </Grid>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Typography sx={{ fontSize: 33, color: "red", textAlign: "center", fontFamily: 'auto' }}>{(userDetails.legalname)?.toUpperCase()}</Typography>
                </Grid>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Typography sx={{ fontSize: 28, textAlign: "center", fontStyle: 'italic', fontFamily: "Devroye" }}>has Succesfully Completed the Internship on </Typography>
                </Grid>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Typography sx={{ fontSize: 35, textAlign: "center", color: "red", fontFamily: 'auto' }}>{userDetails.intCourse}</Typography>
                </Grid>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Typography sx={{ fontWeight: '600', textAlign: "center" }}>( Duration - {userDetails.intStartDate} to {userDetails.intEndDate})</Typography>
                </Grid>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Typography sx={{ fontSize: 28, fontFamily: "Devroye", textAlign: "center", fontStyle: 'italic' }}>Designed And Developed as per the standards of</Typography>
                </Grid>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Typography sx={{ fontSize: 20, fontFamily: "Devroye", fontWeight: '600', textAlign: "center" }}>HILIFE.AI PRIVATE LIMITED </Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Grid container sx={{ display: 'flex', textAlign: 'center' }}>
                <Grid item md={3} lg={3} xs={3} sm={3} >
                  <Box>
                    <img src={Abisign} height={75}></img>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', }}>CO-ORDINATOR</Typography>
                  </Box>
                </Grid>
                <Grid item md={3} lg={3} xs={3} sm={3}>
                  <Box sx={{ marginTop: '30px' }}>
                    <img src={StartTamil} height={105}></img>
                  </Box>
                </Grid>
                <Grid item md={3} lg={3} xs={3} sm={3}>
                  <Box sx={{ marginTop: '30px' }}>
                    <img src={startIndia} height={122}></img>
                  </Box>
                </Grid>
                <Grid item md={3} lg={3} xs={3} sm={3}>
                  <Box>
                    <img src={Shankarisign} height={75}></img>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', }}>HR MANAGER</Typography>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={12} lg={12} xs={12} sm={12} sx={{ textAlign: "center" }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: '600', }}>DATE OF ISSUE : {moment(userDetails.intEndDate)?.format('DD-MMM-YYYY')?.toUpperCase()}</Typography>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={2.5} lg={2.5} sm={2.5} xs={2.5} sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: '600', fontSize: '13px', color: "red" }}>Corporate office :</Typography>
                    </Grid>
                    <Grid item md={9.5} lg={9.5} sm={9.5} xs={9.5} sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>NO-17, West Part, Nethaji Street SBIO Road Sankar Nagar, Airport, Trichy 620021</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={3.5} lg={3.5} sm={3.5} xs={3.5} sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: '600', fontSize: '13px', color: "red" }}>Branch office :</Typography>
                    </Grid>
                    <Grid item md={8} lg={8} sm={8} xs={8} sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>NO-2, Second Floor, Zee Towers EVR Road Puthur, Trichy 620021</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Grid container>
                <Grid item md={12} lg={12} xs={12} sm={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: '600', fontSize: '11px', textAlign: 'center' }}>Note:-</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: '10px', color: "red", textAlign: 'center' }}> Changes/Overscripts should bear competatnt attestation of HILIFE.AI Private Limited, else Certificate is invalid</Typography>
                  </Box>
                </Grid>
              </Grid>

            </Box>
          </div>
        </Box>
        <br />
        {rowGetId === "Teammember" ? "" : <button onClick={handleConvert}>Download</button>}

      </div>
      {/* ALERT DIALOG */}
      <Box>
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
      </Box>
    </div>

  );
}
export default Certificate;
