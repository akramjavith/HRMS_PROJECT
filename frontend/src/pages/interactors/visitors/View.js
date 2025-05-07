import { makeStyles } from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import Webcamimage from "../../asset/Webcameimageasset";

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

  const [billUploadedFiles, setBillUploadedFiles] = useState([]);

  const [uploadedRequestDocument, setUploadedRequestDocument] = useState([]);

  let sno = 1;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const assignurl = urlParams.get('status');

  const classes = useStyles();
  const [isimgviewbill, setImgviewbill] = useState(false);

  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  const [vendor, setVendor] = useState([]);
  const { pageName, setPageName, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [followupArray, setFollowupArray] = useState([]);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };

  let ids = useParams().id;
  let redirect = useParams().form;

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Viewvisitors"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }




  //useEffect
  useEffect(() => {
    getinfoCode();
    getapi();
    fetchInteractorType();
  }, [ids]);
  // useEffect(() => {
  //   getinfoCode();
  //   getapi();
  // }, [ids, vendor, followupArray]);
  // get single row to view....

  const [documentFilesImages, setdocumentFilesImages] = useState([]);

  const getinfoCode = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendor(res?.data?.svisitors);
      console.log(res?.data?.svisitors, "res?.data?.svisitors");
      setFollowupArray(res?.data?.svisitors.followuparray);
      const allFiles = res?.data?.svisitors?.followuparray?.flatMap(item => item.files) || [];
      let multerUploadedFiles = res?.data?.svisitors?.visitordocument?.filter(data => !data.preview)
      setBillUploadedFiles(multerUploadedFiles);
      let multerUploadedRequestFiles = res?.data?.svisitors?.requestdocument?.filter(data => !data.preview)
      setUploadedRequestDocument(multerUploadedRequestFiles);
      setRefImageedit(allFiles);
      setRefImageDragedit(allFiles);
      setCapturedImagesedit(allFiles);
      setAllUploadedFilesedit(allFiles);
      if (res?.data?.svisitors?.visitorid) {
        let url = `${SERVICE.VISITORDETAILS_LOG_SINGLE_PROFILE}/${encodeURIComponent(res?.data?.svisitors?.visitorid)}`;
        let resVisitor = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setdocumentFilesImages(resVisitor?.data?.svisitordetailslog);
      }

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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

  const [IndexForProf, setIndex] = useState();
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
  // let resultArray = combinedArray?.filter((item) => {
  //   if (!uniqueValues[item?.name]) {
  //     uniqueValues[item?.name] = true;
  //     return true;
  //   }
  //   return false;
  // });

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [getimgbillcode, setGetImgbillcode] = useState([]);


  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  let name = "create";
  let nameedit = "edit";

  const renderFilePreviewMulterUploaded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_VISITOR_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };

  const [visitorsTypeOption, setVisitorsTypeOption] = useState([]);

  //get all interactorType name.
  const fetchInteractorType = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVisitorsTypeOption(
        res_freq?.data?.manageTypePG.map((t) => ({
          ...t,
          label: t.interactorstype,
          value: t.interactorstype,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [files, setFiles] = useState([]);

  const handleRemarkChange = (index, remark) => {
    setFiles((prevFiles) =>
      prevFiles?.map((file, i) => (i === index ? { ...file, remark } : file))
    );
  };

  console.log(followupArray, "followupArray")
  return (
    <Box>
      <Headtitle title={"VIEW VISITORS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>View Visitor </Typography>
      <>
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
                        {assignurl !== "visitorenquiry" && (

                          <>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                              <Grid item md={3} sm={12} xs={12}>
                                <Typography>Photograph</Typography>
                                <Box
                                  sx={{ display: "flex", justifyContent: "left" }}
                                >
                                  <Button
                                    sx={buttonStyles.buttonsubmit}
                                    onClick={() => {
                                      handleClickUploadPopupOpenedit()
                                      setIndex(index)
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </Box>
                              </Grid>
                              <Grid item md={9} sm={12} xs={12}>
                                <Typography>&nbsp;</Typography>
                                {documentFilesImages[index]?.files?.map((file, index) => (
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
                          </>
                        )}
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
                        <Grid item md={6} sm={12} xs={12}>
                          <Typography variant="h6" >Upload Document</Typography>
                          <Grid >
                            <Grid item md={2} sm={12} xs={12}>

                            </Grid>
                            <Typography>&nbsp;</Typography>
                            <Grid container>
                              <Grid item md={12} sm={12} xs={12}>
                                {data?.visitordocument?.length > 0 && data?.visitordocument?.map((data, index) => (
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

                                          <img
                                            className={classes.preview}
                                            src={getFileIcon(data.name || data.file.name)}
                                            height="25"
                                            alt="file icon"
                                          />
                                          {/* )} */}
                                        </Box>
                                      </Grid>
                                      <Grid
                                        item
                                        md={8}
                                        sm={8}
                                        xs={8}
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Typography variant="subtitle2">
                                          {data.name || data.file.name}{" "}
                                        </Typography>
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
                                        >
                                          <VisibilityOutlinedIcon
                                            style={{
                                              fontsize: "large",
                                              color: "#357AE8",
                                            }}
                                            onClick={() => renderFilePreviewMulterUploaded(data)}
                                          />
                                        </Button>


                                      </Grid>
                                    </Grid>
                                  </>
                                ))}

                              </Grid>
                            </Grid>

                          </Grid>
                        </Grid>
                        {visitorsTypeOption?.filter((item) => item?.interactorstype === data.visitortype && item?.interactorspurpose?.includes(data.visitorpurpose))[0]?.requestdocument &&

                          <Grid item md={12} xs={12} sm={12}>
                            <Box >
                              <Grid item xs={8}>
                                <Typography sx={{ fontWeight: 'bold' }}>Request Visitor Document</Typography>
                              </Grid>
                              <>
                                <Grid container sx={{ justifyContent: "center" }} spacing={1}>

                                </Grid>
                              </>

                              <br />
                              <br />
                              <br />
                              <TableContainer component={Paper}>
                                <Table aria-label="simple table" id="branch">
                                  <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                                      <StyledTableCell align="center">Document</StyledTableCell>
                                      {/* <StyledTableCell align="center">Remarks</StyledTableCell> */}
                                      <StyledTableCell align="center">View</StyledTableCell>
                                    </StyledTableRow>
                                  </TableHead>
                                  <TableBody>
                                    {data?.requestdocument &&
                                      data?.requestdocument?.map((file, index) => (
                                        <StyledTableRow key={index}>
                                          <StyledTableCell align="center">
                                            {index + 1}
                                          </StyledTableCell>
                                          <StyledTableCell align="left">
                                            {file.name || file.file.name}
                                          </StyledTableCell>
                                          {/* <StyledTableCell align="center">
                                            <FormControl>
                                              <OutlinedInput
                                                sx={{
                                                  height: "30px !important",
                                                  background: "white",
                                                  border: "1px solid rgb(0 0 0 / 48%)",
                                                }}
                                                size="small"
                                                type="text"
                                                value={file.remark}
                                                // onChange={(event) =>
                                                //   handleRemarkChange(index, event.target.value)
                                                // }
                                              />
                                            </FormControl>
                                          </StyledTableCell> */}

                                          <StyledTableCell
                                            component="th"
                                            scope="row"
                                            align="center"
                                          >
                                            {/* <a
                                                                          style={{ color: "#357ae8" }}
                                                                          href={`data:application/octet-stream;base64,${file.data}`}
                                                                          download={file.name}
                                                                        >
                                                                          Download
                                                                        </a> */}
                                            <a
                                              style={{
                                                color: "#357ae8",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                              }}
                                              onClick={() => renderFilePreviewMulterUploaded(file)}
                                            >
                                              View
                                            </a>
                                          </StyledTableCell>
                                          {/* <StyledTableCell align="center">
                                            <Button
                                              onClick={() => handleDeleteUploadedRequestDocument(index)}
                                              variant="contained"
                                              size="small"
                                              sx={{
                                                textTransform: "capitalize",
                                                minWidth: "0px",
                                              }}
                                            >
                                              <DeleteIcon style={{ fontSize: "20px" }} />
                                            </Button>
                                          </StyledTableCell> */}
                                        </StyledTableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                            <br />
                          </Grid>
                        }
                        {visitorsTypeOption?.filter((item) => item?.interactorstype === data.visitortype && item?.interactorspurpose?.includes(data.visitorpurpose))[0]?.requestdocument && (
                          <>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  Request Visitor Followup Date<b style={{ color: 'red' }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="date"
                                  value={vendor.requestvisitorfollowupdate}
                                // onChange={(e) => {
                                //   setVendor({ ...vendor, requestvisitorfollowupdate: e.target.value });

                                // }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  Request Follow Up Action <b style={{ color: 'red' }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={vendor.requestvisitorfollowaction}
                                // onChange={(e) => {
                                //   setVendor({ ...vendor, requestvisitorfollowupdate: e.target.value });

                                // }}
                                />
                                {/* <Selects
                                  maxMenuHeight={300}
                                  options={followUpActionOption}
                                  placeholder="Please Select Follow Up Action"
                                  value={{
                                    label: vendor.requestvisitorfollowaction,
                                    value: vendor.requestvisitorfollowaction,
                                  }}
                                  onChange={(e) => {
                                    setVendor({
                                      ...vendor,
                                      requestvisitorfollowaction: e.value,
                                      requestfollowupactionupdate: "",
                                      requestfollowupactionuptime: ""
                                    });
                                  }}
                                /> */}
                              </FormControl>
                            </Grid>
                            {vendor.requestvisitorfollowaction === 'Required' ? (
                              <>

                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Request Follow Up Date<b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="date"
                                      value={vendor.requestfollowupactionupdate}
                                    // onChange={(e) => {
                                    //   setVendor({
                                    //     ...vendor,
                                    //     requestfollowupactionupdate: e.target.value,
                                    //   });
                                    // }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Request Follow Up Time <b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="time"
                                      placeholder="HH:MM:AM/PM"
                                      value={vendor.requestfollowupactionuptime}
                                    // onChange={(e) => {
                                    //   setVendor({
                                    //     ...vendor,
                                    //     requestfollowupactionuptime: e.target.value,
                                    //   });
                                    // }}
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            ) :
                              (
                                <>
                                  <Grid item md={6} xs={12} sm={12}>
                                  </Grid>
                                </>
                              )
                            }


                          </>
                        )

                        }
                        {assignurl !== "visitorenquiry" &&
                          <>
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
                          </>
                        }
                        <Grid item md={10} xs={12} sm={12}></Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Address Type
                            </Typography>

                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.addesstype}
                              placeholder="Please Enter Reference Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Personal Prefix
                            </Typography>

                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.personalprefix}
                              placeholder="Please Enter Reference Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Reference Name </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.referencename}
                              placeholder="Please Enter Reference Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Landmark Position Prefix
                            </Typography>


                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.landmarkpositionprefix}
                              placeholder="Please Enter Landmark Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Landmark Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.landmarkname}
                              placeholder="Please Enter Landmark Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>House/Flat No</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.houseflatnumber}
                              placeholder="Please Enter House/Flat Number"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Street/Road Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.streetroadname}
                              placeholder="Please Enter Street/Road Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Locality/Area Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.localityareaname}
                              placeholder="Please Enter Locality/Area Name"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Country</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              sx={userStyle.input}
                              placeholder="Pincode"
                              value={data.pcountry}

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>State</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              sx={userStyle.input}
                              placeholder="Pincode"
                              value={data.pstate}

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>City</Typography>

                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              sx={userStyle.input}
                              placeholder="Pincode"
                              value={data.pcity}

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Pincode</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              placeholder="Pincode"
                              value={data.ppincode}

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>GPS Coordinate</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={data.gpscoordinate}
                              placeholder="Please Enter GPS Coordinate"

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Full Address
                            </Typography>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={5}
                              value={
                                [
                                  data.personalprefix !== "Please Select Personal Prefix" ? data.personalprefix : null,
                                  data.referencename,
                                  data.landmarkpositionprefix !== "Please Select Landmark Position Prefix" ? data.landmarkpositionprefix : null,
                                  data.landmarkname,
                                  data.houseflatnumber,
                                  data.streetroadname,
                                  data.localityareaname,
                                  data.pcity,
                                  data.pstate,
                                  data.pcountry,
                                  data.ppincode
                                ]
                                  .filter(part => part != null) // Remove null/undefined first
                                  .map(part => String(part).trim()) // Convert to string and then trim
                                  .filter(part => part !== "") // Remove empty strings after trim
                                  .reduce((acc, part) => {
                                    const trimmedPart = String(part).trim();
                                    if (!trimmedPart) return acc;

                                    if (acc.endsWith(',')) {
                                      return `${acc} ${trimmedPart}`;
                                    }
                                    if (trimmedPart.startsWith(',')) {
                                      return `${acc}${trimmedPart}`;
                                    }
                                    return acc ? `${acc}, ${trimmedPart}` : trimmedPart;
                                  }, "")
                              }
                            />
                          </FormControl>
                        </Grid>
                        {data.meetingdetails && (
                          <>
                            <Grid item md={12} xs={12} sm={12}>
                              <Typography sx={{ fontWeight: "bold" }}>
                                {assignurl === "visitorenquiry" ? "Enquiry Person" : "Meeting Person"}
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
                          </>
                        )}
                        {assignurl === "visitorenquiry" &&
                          <>
                            <Grid item md={4} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  {" "}
                                  Enquired Branch Number
                                </Typography>
                                <Typography>
                                  {data.enquiredbranchnumber}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  {" "}
                                  Enquired Branch Email
                                </Typography>
                                <Typography>
                                  {data.enquiredbranchemail}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                            </Grid>
                          </>
                        }
                        {assignurl !== "visitorenquiry" && (
                          <>
                            {data.meetingdetails && (
                              <>
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
                          </>
                        )}
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6"> Remark</Typography>
                            <Typography>{data.remark}</Typography>
                          </FormControl>
                        </Grid>
                        {visitorsTypeOption?.filter((item) => item?.interactorstype === data.visitortype && item?.interactorspurpose?.includes(data.visitorpurpose))[0]?.requestdocument || false ?
                          <>
                            <Grid item md={3} xs={12} sm={12}>
                            </Grid>
                          </>
                          :
                          <>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  Follow Up Action <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Typography>{data.followupaction}</Typography>
                              </FormControl>
                            </Grid>
                          </>
                        },
                        {vendor.followupaction === "Required" && (
                          <>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  Follow Up Date<b style={{ color: "red" }}>*</b>
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
                                <Typography>
                                  Follow Up Time <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Typography>{data.followuptime}</Typography>
                              </FormControl>
                            </Grid>
                          </>
                        )}
                        {assignurl !== "visitorenquiry" && (
                          <>
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
                          </>
                        )}
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
                        sx={buttonStyles.btncancel}
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
                        sx={buttonStyles.btncancel}
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
                        sx={buttonStyles.btncancel}
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
                        sx={buttonStyles.btncancel}
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
                        sx={buttonStyles.btncancel}
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
        sx={{ marginTop: "80px" }}
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
                    sx={buttonStyles.buttonsubmit}
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
              {documentFilesImages[IndexForProf]?.files?.map((file, index) => (
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
          <Button disabled sx={buttonStyles.buttonsubmit}>
            Ok
          </Button>
          <Button disabled sx={buttonStyles.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={buttonStyles.btncancel}>
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
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
    </Box>
  );
}
export default EditVisitors;