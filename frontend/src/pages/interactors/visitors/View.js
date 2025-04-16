import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogTitle,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import Webcamimage from "../../asset/Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageHeading from "../../../components/PageHeading";

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function EditVisitors() {
  const classes = useStyles();
  const [isimgviewbill, setImgviewbill] = useState(false);

  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  const [vendor, setVendor] = useState([]);
  const { isUserRoleCompare, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [followupArray, setFollowupArray] = useState([]);

  let ids = useParams().id;
  let redirect = useParams().form;

  //useEffect
  useEffect(() => {
    getinfoCode();
  }, [ids, vendor, followupArray]);
  // get single row to view....
  const getinfoCode = async () => {
    setPageName(!pageName)
try {
      let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendor(res?.data?.svisitors);
      setFollowupArray(res?.data?.svisitors.followuparray);
      setRefImageedit(res?.data?.svisitors.files);
      setRefImageDragedit(res?.data?.svisitors.files);
      setCapturedImagesedit(res?.data?.svisitors.files);
      setAllUploadedFilesedit(res?.data?.svisitors.files);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
  };
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);

  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);

  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    webcamCloseedit();
    setGetImgedit("");
  };

  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };

  const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
  let combinedArray = allUploadedFilesedit.concat(
    refImageedit,
    refImageDragedit,
    capturedImagesedit
  );
  let uniqueValues = {};
  let resultArray = combinedArray.filter((item) => {
    if (!uniqueValues[item.name]) {
      uniqueValues[item.name] = true;
      return true;
    }
    return false;
  });

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [getimgbillcode, setGetImgbillcode] = useState([]);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  let name = "create";
  let nameedit = "edit";

  return (
    <Box>
      <Headtitle title={"VIEW VISITORS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>View Visitor </Typography>
      <>
        {isUserRoleCompare?.includes("vaddvisitors") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Box>
                {followupArray?.map((data, index) => (
                  <Box key={index}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <span>
                          <b>Visitor Name:</b> {vendor.visitorname + "  "}
                          <b>Visitor Type:</b> {data.visitortype + "  "}
                          <b>Visitor Mode:</b> {data.visitormode + "  "}
                          <b>Visitor Purpose:</b> {data.visitorpurpose + "  "}
                          <b>Visitor Contact No:</b>{" "}
                          {vendor.visitorcontactnumber + "  "}
                          <b>Date:</b>{" "}
                          {moment(vendor.date).format("DD-MM-YYYY")}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={8}>
                            {" "}
                            <Typography sx={{ fontWeight: "bold" }}>
                              View Visitor
                            </Typography>{" "}
                          </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Company</Typography>
                            </FormControl>
                            <Typography>{vendor.company}</Typography>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Branch</Typography>
                              <Typography>{vendor.branch}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Unit</Typography>
                              <Typography>{vendor.unit}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Visitor's ID
                              </Typography>
                              <Typography>{vendor.visitorid}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Visitor Type
                              </Typography>
                              <Typography>{data.visitortype}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">Visitor Mode</Typography>
                              <Typography>{data.visitormode}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">Date</Typography>
                              <Typography>
                                {moment(vendor.date).format("DD-MM-YYYY")}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">Prefix</Typography>
                              <Typography>{vendor.prefix}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">Visitor Name</Typography>
                              <Typography>{vendor.visitorname}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">IN Time</Typography>
                              <Typography>{data.intime}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Purpose
                              </Typography>
                              <Typography>{data.visitorpurpose}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Contact Number
                              </Typography>
                              <Typography>
                                {vendor.visitorcontactnumber}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Email
                              </Typography>
                              <Typography>{vendor.visitoremail}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor's Company Name
                              </Typography>
                              <Typography>
                                {vendor.visitorcompnayname}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={12}>
                            <Typography>Photograph</Typography>
                            <Box
                              sx={{ display: "flex", justifyContent: "left" }}
                            >
                              <Button
                                variant="contained"
                                onClick={handleClickUploadPopupOpenedit}
                              >
                                Upload
                              </Button>
                            </Box>
                          </Grid>
                          <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Visitor ID / Document Details
                            </Typography>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Document Type
                              </Typography>
                              <Typography>{vendor.documenttype}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Document Number
                              </Typography>
                              <Typography>{vendor.documentnumber}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={12}></Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Boolean(data.meetingdetails)}
                                  />
                                }
                                readOnly
                                label="Meeting Details"
                              />
                            </FormGroup>
                          </Grid>
                          <Grid item md={9} xs={12} sm={12}></Grid>
                          {data.meetingdetails && (
                            <>
                              <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  Meeting Person
                                </Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Company</Typography>
                                  <Typography>
                                    {data.meetingpersoncompany
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Branch</Typography>
                                  <Typography>
                                    {data.meetingpersonbranch
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Unit</Typography>
                                  <Typography>
                                    {data.meetingpersonunit
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Department
                                  </Typography>
                                  <Typography>
                                    {data.meetingpersondepartment
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Team</Typography>
                                  <Typography>
                                    {data.meetingpersonteam
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Employee Name
                                  </Typography>
                                  <Typography>
                                    {data.meetingpersonemployeename}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  Meeting Location
                                </Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Company</Typography>
                                  <Typography>
                                    {data.meetinglocationcompany
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Branch</Typography>
                                  <Typography>
                                    {data.meetinglocationbranch
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Unit</Typography>
                                  <Typography>
                                    {data.meetinglocationunit
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Floor</Typography>
                                  <Typography>
                                    {data.meetinglocationfloor
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Area</Typography>
                                  <Typography>
                                    {data.meetinglocationarea}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}></Grid>
                            </>
                          )}
                          <Grid item md={3} xs={12} sm={12}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Boolean(data.escortinformation)}
                                  />
                                }
                                readOnly
                                label="Escort Information"
                              />
                            </FormGroup>
                          </Grid>
                          <Grid item md={9} xs={12} sm={12}></Grid>
                          {data.escortinformation && (
                            <>
                              <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Escort Details
                                  </Typography>
                                  <Typography>{data.escortdetails}</Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={6} xs={12} sm={12}></Grid>
                            </>
                          )}
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Equipment Borrowed
                              </Typography>
                              <Typography>{data.equipmentborrowed}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> OUT Time</Typography>
                              <Typography>{data.outtime}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Remark</Typography>
                              <Typography>{data.remark}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Follow Up Action
                              </Typography>
                              <Typography>{data.followupaction}</Typography>
                            </FormControl>
                          </Grid>
                          {data.followupaction === "Required" && (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Follow Up Date
                                  </Typography>
                                  <Typography>
                                    {moment(data.followupdate).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Follow Up Time
                                  </Typography>
                                  <Typography>{data.followuptime}</Typography>
                                </FormControl>
                              </Grid>
                            </>
                          )}
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Visitor Badge / Pass Details
                              </Typography>
                              <Typography>{data.visitorbadge}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Visitor Survey / Feedback
                              </Typography>
                              <Typography>{data.visitorsurvey}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Added By</Typography>
                              <Typography>{vendor.detailsaddedy}</Typography>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <br /> <br />
                        <br /> <br />
                      </AccordionDetails>
                    </Accordion>
                    <br />
                  </Box>
                ))}
                <br />
                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    {redirect === "visitor" ? (
                      <Link
                        to="/interactor/master/listvisitors"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={userStyle.buttonadd}
                        >
                          Back
                        </Button>
                      </Link>
                    ) : redirect === "allvisitor" ? (
                      <Link
                        to="/interactor/allvisitorlist"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={userStyle.buttonadd}
                        >
                          Back
                        </Button>
                      </Link>
                    ) : redirect === "datefilter" ? (
                      <Link
                        to="/interactor/master/visitorsdatefilter"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={userStyle.buttonadd}
                        >
                          Back
                        </Button>
                      </Link>
                    ) : redirect === "followupfilter" ? (
                      <Link
                        to="/interactor/master/visitorsfollowupfilter"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={userStyle.buttonadd}
                        >
                          Back
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        to="/interactor/master/listvisitors"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={userStyle.buttonadd}
                        >
                          Back
                        </Button>
                      </Link>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </>
          </Box>
        )}
      </>
      <br />

      {/* UPLOAD IMAGE DIALOG */}
      <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div>
                {previewURL && refImageDrag?.length > 0 ? (
                  <>
                    {refImageDrag.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          //   onClick={() => handleRemoveFile(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  {/* {showUploadBtn ? ( */}
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                    disabled
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      disabled
                    />
                  </Button>
                  &ensp;
                  <Button
                    variant="contained"
                    onClick={showWebcam}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled variant="contained">
            Ok
          </Button>
          <Button disabled sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={name}
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD IMAGE DIALOG EDIT */}
      <Dialog
        open={uploadPopupOpenedit}
        onClose={handleUploadPopupCloseedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image Edit
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div>
                {previewURLedit && refImageDragedit?.length > 0 ? (
                  <>
                    {refImageDragedit.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button style={{ marginTop: "0px", color: "red" }}>
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                    disabled
                  >
                    {" "}
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      disabled
                    />
                  </Button>
                  &ensp;
                  <Button variant="contained" sx={userStyle.uploadbtn} disabled>
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {resultArray?.map((file, index) => (
                <>
                  <Grid container>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {file.type.includes("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            height={50}
                            style={{
                              maxWidth: "-webkit-fill-available",
                            }}
                          />
                        ) : (
                          <img
                            className={classes.preview}
                            src={getFileIcon(file.name)}
                            height="10"
                            alt="file icon"
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      sm={8}
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2"> {file.name} </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreviewedit(file)}
                        >
                          <VisibilityOutlinedIcon
                            style={{ fontsize: "12px", color: "#357AE8" }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled variant="contained">
            Ok
          </Button>
          <Button disabled sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpenedit}
        onClose={webcamCloseedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={nameedit}
            getImgedit={getImgedit}
            setGetImgedit={setGetImgedit}
            valNumedit={valNumedit}
            setValNumedit={setValNumedit}
            capturedImagesedit={capturedImagesedit}
            setCapturedImagesedit={setCapturedImagesedit}
            setRefImageedit={setRefImageedit}
            setRefImageDragedit={setRefImageDragedit}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={webcamDataStoreedit}
          >
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamCloseedit}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isimgviewbill}
        onClose={handlecloseImgcodeviewbill}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6">Images</Typography>
          {getimgbillcode.map((imagefilebill, index) => (
            <Grid container key={index}>
              <Grid item md={6} sm={10} xs={10}>
                <img
                  src={imagefilebill.preview}
                  style={{
                    maxWidth: "70px",
                    maxHeight: "70px",
                    marginTop: "10px",
                  }}
                />
              </Grid>

              <Grid
                item
                md={4}
                sm={10}
                xs={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography>{imagefilebill.name}</Typography>
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Button
                  sx={{
                    padding: "14px 14px",
                    minWidth: "40px !important",
                    borderRadius: "50% !important",
                    ":hover": {
                      backgroundColor: "#80808036", // theme.palette.primary.main
                    },
                  }}
                  onClick={() => renderFilePreview(imagefilebill)}
                >
                  <VisibilityOutlinedIcon
                    style={{
                      fontsize: "12px",
                      color: "#357AE8",
                      marginTop: "35px !important",
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
export default EditVisitors;