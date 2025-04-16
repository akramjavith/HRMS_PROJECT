import React, { useState, useContext, useEffect } from "react";
import { Typography, Box, OutlinedInput, FormControl, Grid, Button, Dialog, DialogContent, DialogActions, FormGroup, FormControlLabel, Checkbox, TextareaAutosize } from "@mui/material";
import { userStyle } from "../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { AuthContext } from "../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import Selects from "react-select";
import { FaPlus } from "react-icons/fa";
import {accounttypes} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";

function ExpCategorypopup({ setVendorAuto }) {
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  //useState
  const [vendor, setVendor] = useState({ vendorname: "", emailid: "", phonenumber: "", whatsappnumber: "", contactperson: "", address: "", gstnumber: "", bankname: "Please Select Bank Name", accountname: "", accountnumber: "", ifsccode: "", phonecheck: false });
  const [vendormaster, setVendormaster] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [openpopup, setOpenPopup] = useState(false);

  //useEffect
  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber]);

  useEffect(() => {
    fetchVendorAll();
  }, []);

  const maxLength = 15;
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const handleMobile = (e) => {
    if (e.length > 10) {
      setShowAlert("Mobile number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, phonenumber: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setShowAlert("Whats app number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, whatsappnumber: num });
    }
  };
  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsappnumber: vendor.phonenumber });
    } else {
      setVendor({ ...vendor, whatsappnumber: "" });
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setVendor({
      vendorname: "",
      emailid: "",
      phonenumber: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      gstnumber: "",
      bankname: "Please Select Bank Name",
      accountname: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
    });
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  const vendorOpen = () => {
    setOpenPopup(true);
  };
  const vendorClose = () => {
    setOpenPopup(false);
    setVendor({
      vendorname: "",
      emailid: "",
      phonenumber: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      gstnumber: "",
      bankname: "Please Select Bank Name",
      accountname: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
    });
  };
  const { auth } = useContext(AuthContext);
  //get all vendors to ckeck vendor name already exist or not
  const fetchVendorAll = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendormaster(res_vendor?.data?.vendordetails);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //add function
  const sendRequest = async () => {
    try {
      let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorname: String(vendor.vendorname),
        emailid: String(vendor.emailid),
        phonenumber: Number(vendor.phonenumber),
        whatsappnumber: Number(vendor.whatsappnumber),
        phonecheck: Boolean(vendor.phonecheck),
        contactperson: String(vendor.contactperson),
        address: String(vendor.address),
        gstnumber: String(vendor.gstnumber),
        bankname: String(vendor.bankname === "Please Select Bank Name" ? "" : vendor.bankname),
        accountname: String(vendor.accountname),
        accountnumber: Number(vendor.accountnumber),
        ifsccode: String(vendor.ifsccode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchVendorAll();
      setVendorAuto("none");
      setVendor({
        vendorname: "",
        emailid: "",
        phonenumber: "",
        whatsappnumber: "",
        contactperson: "",
        address: "",
        gstnumber: "",
        bankname: "Please Select Bank Name",
        accountname: "",
        accountnumber: "",
        ifsccode: "",
        phonecheck: false,
      });
      vendorClose();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = vendormaster.some((item) => item.vendorname.toLowerCase() === vendor.vendorname.toLowerCase() && item.vendorname === vendor.vendorname);
    if (vendor.vendorname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Vendor Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (!validateEmail(vendor.emailid)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Valid Email Id"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.address === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Address"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Vendorame already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  return (
    <Box>
      <Button
        variant="contained"
        style={{
          height: "30px",
          minWidth: "20px",
          padding: "19px 13px",
          marginTop: "25px",
        }}
        onClick={vendorOpen}
      >
        <FaPlus />
      </Button>
      <Dialog
        onClose={vendorClose}
        aria-labelledby="customized-dialog-title1"
        open={openpopup}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid rgb(216 216 216)",
          },
        }}
        maxWidth="md"
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={{ fontWeight: "bold" }}>Add Vendor</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Vendor Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.vendorname}
                    placeholder="Please Enter Vendor Name"
                    onChange={(e) => {
                      setVendor({ ...vendor, vendorname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Email ID</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="email"
                    value={vendor.emailid}
                    placeholder="Please Enter Email ID"
                    onChange={(e) => {
                      setVendor({ ...vendor, emailid: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.phonenumber}
                    placeholder="Please Enter Phone Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, phonenumber: e.target.value });
                      handleMobile(e.target.value);
                    }}
                  />
                </FormControl>
                <Grid>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={vendor.phonecheck} />} onChange={(e) => setVendor({ ...vendor, phonecheck: !vendor.phonecheck })} label="Same as Whats app number" />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>WhatsApp Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.whatsappnumber}
                    placeholder="Please Enter Whatsapp Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, whatsappnumber: e.target.value });
                      handlewhatsapp(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Contact Person Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.contactperson}
                    placeholder="Please Enter Contact Person Name"
                    onChange={(e) => {
                      setVendor({ ...vendor, contactperson: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Address <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Please Enter Address"
                    value={vendor.address}
                    onChange={(e) => {
                      setVendor({ ...vendor, address: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>GST Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.gstnumber}
                    placeholder="Please Enter GST Number"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= maxLength) {
                        setVendor({ ...vendor, gstnumber: newValue });
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={{ fontWeight: "bold" }}>Bank Details</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Bank Name</Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={accounttypes}
                    placeholder="Please Choose Bank Name"
                    value={{ label: vendor.bankname, value: vendor.bankname }}
                    onChange={(e) => {
                      setVendor({ ...vendor, bankname: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Account Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.accountname}
                    placeholder="Please Enter Account Name"
                    onChange={(e) => {
                      setVendor({ ...vendor, accountname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Account Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.accountnumber}
                    placeholder="Please Enter Account Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, accountnumber: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>IFSC Code</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.ifsccode}
                    placeholder="Please Enter IFSC Code"
                    onChange={(e) => {
                      setVendor({ ...vendor, ifsccode: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <DialogActions>
              <Button variant="contained" color="primary" sx={userStyle.buttonadd} onClick={handleSubmit}>
                Save
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                Clear
              </Button>
              <Button sx={userStyle.btncancel} onClick={vendorClose}>
                Close
              </Button>
            </DialogActions>
          </>
        </Box>
      </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Box>
          <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
    </Box>
  );
}
export default ExpCategorypopup;
