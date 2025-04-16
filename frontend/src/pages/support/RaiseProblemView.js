import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  TextareaAutosize,
  DialogTitle,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle } from "../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Selects from "react-select";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import Webcamimage from "../asset/Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactDOMServer from "react-dom/server";

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

function RaiseProblemView() {
  const classes = useStyles();
  const [isimgviewbill, setImgviewbill] = useState(false);
  const [status, setStatus] = useState("Please Select Status");
  const [closeReason, setCloseReason] = useState("");

  const statusOption = [
    { label: "Open", value: "Open" },
    { label: "On Progress", value: "On Progress" },
    { label: "Details Needed", value: "Details Needed" },
    { label: "Closed", value: "Closed" },
  ];

  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  const [vendor, setVendor] = useState([]);
  const [todo, setTodo] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  let ids = useParams().id;
  let riderectedfrom = useParams().from;
  let riderectto = useParams().forwardto;
  //useEffect
  useEffect(() => {
    getinfoCode();
  }, [ids]);
  // get single row to view....
  const getinfoCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.RAISEPROBLEM_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendor(res?.data?.sraises);
      setTodo(res?.data?.sraises.raisetodo);
      setStatus(res?.data?.sraises?.status);
      setUpload(res?.data?.sraises?.closedfiles);
      setCloseReason(res?.data?.sraises?.closereason);
      setDetailsNeeded(res?.data?.sraises?.detailsneeded);
      //   setRefImageedit(res?.data?.sraises.files);
      //   setRefImageDragedit(res?.data?.sraises.files);
      //   setCapturedImagesedit(res?.data?.sraises.files);
      //   setAllUploadedFilesedit(res?.data?.sraises.files);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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

  const [upload, setUpload] = useState([]);

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ]);
      };
    }
  };
  const handleFileDelete = (index) => {
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const [detailsNeeded, setDetailsNeeded] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (status === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (status === "Details Needed" && detailsNeeded === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Details Needed"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (status === "Closed" && closeReason === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Close Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  const updateby = vendor?.updatedby;
  const backPage = useNavigate();

  const sendRequest = async () => {
    try {
      let addVendorDetails = await axios.put(
        `${SERVICE.RAISEPROBLEM_SINGLE}/${ids}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String(status),
          closedby:
            status === "Closed" ? String(isUserRoleAccess?.username) : "",
          closedAt: status === "Closed" ? String(new Date()) : "",
          closereason: status === "Closed" ? String(closeReason) : "",
          detailsneeded:
            status === "Details Needed" ? String(detailsNeeded) : "",
          closedfiles: status === "Closed" ? [...upload] : [],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        }
      );
      if (riderectto === "list") {
        backPage("/production/raiseproblemlist");
      } else if (riderectto === "open") {
        backPage("/support/raiseproblem/open");
      } else if (riderectto === "closed") {
        backPage("/support/raiseproblem/closed");
      } else if (riderectto === "onprogress") {
        backPage("/support/raiseproblem/onprogress");
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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

  // Function to remove HTML tags and convert to numbered list
  // Function to remove HTML tags and convert to numbered list

  // const tempElement = document.createElement("div");
  // tempElement.innerHTML = htmlContent;

  // const listItems = Array.from(tempElement.querySelectorAll("li"));
  // listItems.forEach((li, index) => {
  //   li.innerHTML = `\u2022 ${li.innerHTML}\n`;
  // });

  // return tempElement.innerText;
  const convertHtmlToReact = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    // Replace image elements with buttons
    const images = Array.from(tempElement.querySelectorAll("img"));
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        // Create a button element
        const button = document.createElement("button");
        button.textContent = "View Image";
        button.onclick = () => {
          // Open the image in a new tab
          window.open(src);
        };
        // Replace the image with the button
        img.parentNode.replaceChild(button, img);
      }
    });

    // Convert list items to include bullet points
    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    // Return the modified HTML content
    return tempElement.innerHTML;
  };

  const handleImageClick = (event) => {
    // Check if the clicked element is an image
    if (event.target.nodeName == "IMG") {
      // Open the image in a new tab
      window.open(event.target.src, "_blank");
    }
  };

  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Get the editor instance
      const editor = editorRef.current.getEditor();

      // Add a click event listener to the editor
      editor.root.addEventListener("click", handleClickImage);

      // Cleanup function to remove the event listener when component unmounts
      return () => {
        editor.root.removeEventListener("click", handleClickImage);
      };
    }
  }, []);

  const handleClickImage = (event) => {
    // Check if the clicked element is an image
    if (event.target.nodeName === "IMG") {
      // Open the image in a new tab
      window.open(event.target.src, "_blank");
    }
  };

  function getImageSrc(content) {
    // Extract the image source from the <img> tag
    const match = /<img.*src="(data:image\/[^"]+)"/.exec(content);
    return match ? match[1] : null;
  }

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
      <Headtitle title={"VIEW RAISE PROBLEM"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        View Raise Problem{" "}
        {vendor.status === "Closed" && (
          <Button
            variant="contained"
            style={{
              padding: "5px",
              background: "red",
              color: "white",
              fontSize: "10px",
              width: "70px",
              fontWeight: "bold",
            }}
          >
            Closed
          </Button>
        )}
      </Typography>
      <>
        {isUserRoleCompare?.includes("vraiseproblem") && (
          <Box sx={userStyle.dialogbox}>
            <>
              {/* <Grid container spacing={2}>
                <Grid item xs={8}>
                  {" "}
                  <Typography sx={{ fontWeight: "bold" }}>
                    View Visitor
                  </Typography>{" "}
                </Grid>
              </Grid>
              <br /> */}
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Auto id</Typography>
                  </FormControl>
                  <Typography>{vendor.autoid}</Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">mode</Typography>
                    <Typography>{vendor.mode}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Priority</Typography>
                    <Typography>{vendor.priority}</Typography>{" "}
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Module</Typography>
                    <Typography>{vendor.modulename}</Typography>
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Sub-Module</Typography>
                    <Typography>{vendor.submodulename}</Typography>
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Main Page</Typography>
                    <Typography>{vendor.mainpagename}</Typography>
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Sub-Page</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>{vendor.subpagename}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Sub Sub-Page</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>{vendor.subsubpagename}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Category</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>{vendor.category}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Sub Category</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>{vendor.subcategory}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Created Date</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {moment(vendor?.createdAt).format("DD-MM-YYYY")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Created Time</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {moment(vendor?.createdAt).format("hh:mm:ss A")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  {" "}
                  <Typography variant="h6">Created By</Typography>
                  <FormControl fullWidth size="small">
                    <Typography>{vendor?.createdby}</Typography>
                  </FormControl>
                </Grid>

                {vendor.status === "Closed" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                      <Typography variant="h6">Closed Date</Typography>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {moment(new Date(vendor?.closedAt)).format(
                            "DD-MM-YYYY"
                          )}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                      <Typography variant="h6">Closed Time</Typography>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {moment(new Date(vendor?.closedAt)).format(
                            "hh:mm:ss A"
                          )}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      {" "}
                      <Typography variant="h6">Closed By</Typography>
                      <FormControl fullWidth size="small">
                        <Typography>{vendor?.closedby}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {riderectedfrom === "statusupdate" &&
                vendor.status != "Closed" ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                    <Grid item md={12} xs={12} sm={12}></Grid>
                    <Grid item md={2.5} xs={12} sm={12}>
                      <Typography variant="h6">
                        Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={statusOption}
                          placeholder="Please Select Status"
                          value={{
                            label: status,
                            value: status,
                          }}
                          onChange={(e) => {
                            setStatus(e.value);
                            setCloseReason("");
                            setDetailsNeeded("");
                            setUpload([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} xs={12} sm={12}></Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography variant="h6">Status</Typography>
                      <FormControl fullWidth size="small">
                        <Typography>{vendor.status}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
                {vendor.status === "Closed" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography variant="h6">Closed Reason</Typography>
                      <FormControl fullWidth size="small">
                        <Typography>{vendor.closereason}</Typography>
                      </FormControl>
                    </Grid>
                    {/* {upload?.length > 0 && ( */}
                    <Grid item md={9} xs={12} sm={12}>
                      <Typography variant="h6">Closed Attachments</Typography>
                      <FormControl fullWidth size="small">
                        {upload?.length > 0 &&
                          upload.map((file, index) => (
                            <>
                              <Grid container spacing={2}>
                                <Grid item lg={3} md={8} sm={8} xs={8}>
                                  <Typography>{file.name}</Typography>
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </FormControl>
                    </Grid>
                    {/* )} */}
                  </>
                )}

                {vendor.status === "Details Needed" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography variant="h6">Details Needed</Typography>
                      <FormControl fullWidth size="small">
                        <Typography>{vendor.detailsneeded}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {riderectedfrom === "statusupdate" &&
                  status === "Closed" &&
                  vendor.status != "Closed" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <Typography variant="h6">
                          Close Reason<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2.5}
                          value={closeReason}
                          onChange={(e) => {
                            setCloseReason(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        md={1}
                        xs={12}
                        sm={12}
                        sx={{ marginTop: "20px" }}
                      >
                        {/* <Typography variant="h6">&nbsp;</Typography> */}
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          component="label"
                        >
                          Upload
                          <input
                            type="file"
                            id="resume"
                            multiple
                            accept=".xlsx, .xls, .csv, .pdf, .doc, .txt, .png, image/*"
                            name="file"
                            hidden
                            onChange={handleResumeUpload}
                          />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        md={5}
                        xs={12}
                        sm={12}
                        sx={{ marginTop: "20px" }}
                      >
                        {upload?.length > 0 &&
                          upload.map((file, index) => (
                            <>
                              <Grid container spacing={2}>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                  <Typography>{file.name}</Typography>
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                  <Button
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                      marginTop: "-5px",
                                    }}
                                    onClick={() => handleFileDelete(index)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    </>
                  )}

                {riderectedfrom === "statusupdate" &&
                  status === "Details Needed" &&
                  vendor.status != "Details Needed" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <Typography variant="h6">
                          Details Needed<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2.5}
                          value={detailsNeeded}
                          onChange={(e) => {
                            setDetailsNeeded(e.target.value);
                          }}
                        />
                      </Grid>
                    </>
                  )}

                {riderectedfrom === "statusupdate" && status !== "Closed" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                  </>
                )}
                {riderectedfrom === "view" && status !== "Closed" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                  </>
                )}
                {todo?.map((item, index) => (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          <b> Problem {index + 1} </b>
                        </Typography>
                        <ReactQuill
                          style={{ height: "200px" }}
                          value={item.document}
                          readOnly={true}
                          modules={{
                            toolbar: [
                              [{ header: "1" }, { header: "2" }, { font: [] }],
                              [{ size: [] }],
                              [
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                              ],
                              [
                                { list: "ordered" },
                                { list: "bullet" },
                                { indent: "-1" },
                                { indent: "+1" },
                              ],
                              ["link", "image", "video"],
                              ["clean"],
                            ],
                          }}
                          formats={[
                            "header",
                            "font",
                            "size",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                            "list",
                            "bullet",
                            "indent",
                            "link",
                            "image",
                            "video",
                          ]}
                        />

                        {/* {convertHtmlToReact(item.document)} */}
                      </FormControl>
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <Typography>
                        <b> Attachments </b>
                      </Typography>
                      {item.files.map((file, fileIndex) => (
                        <Grid container key={fileIndex}>
                          <Grid item md={6} sm={10} xs={10}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                          <Grid item md={4} sm={2} xs={2}></Grid>
                        </Grid>
                      ))}
                      <br />
                      <br />
                    </Grid>
                  </>
                ))}
              </Grid>
              <br /> <br />
              <br /> <br />
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item lg={1} md={6} sm={2} xs={12}>
                  {riderectedfrom === "statusupdate" &&
                  vendor.status != "Closed" ? (
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={2} xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={userStyle.buttonadd}
                          onClick={(e) => handleSubmit(e)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item md={6} sm={2} xs={12}>
                        {riderectto === "list" ? (
                          <Link
                            to="/production/raiseproblemlist"
                            style={{
                              textDecoration: "none",
                              color: "white",
                              float: "left",
                              marginLeft: "50px",
                            }}
                          >
                            <Button sx={userStyle.btncancel}>Cancel</Button>
                          </Link>
                        ) : riderectto === "open" ? (
                          <Link
                            to="/support/raiseproblem/open"
                            style={{
                              textDecoration: "none",
                              color: "white",
                              float: "left",
                              marginLeft: "50px",
                            }}
                          >
                            <Button sx={userStyle.btncancel}>Cancel</Button>
                          </Link>
                        ) : riderectto === "closed" ? (
                          <Link
                            to="/support/raiseproblem/closed"
                            style={{
                              textDecoration: "none",
                              color: "white",
                              float: "left",
                              marginLeft: "50px",
                            }}
                          >
                            <Button sx={userStyle.btncancel}>Cancel</Button>
                          </Link>
                        ) : riderectto === "onprogress" ? (
                          <Link
                            to="/support/raiseproblem/onprogress"
                            style={{
                              textDecoration: "none",
                              color: "white",
                              float: "left",
                              marginLeft: "50px",
                            }}
                          >
                            <Button sx={userStyle.btncancel}>Cancel</Button>
                          </Link>
                        ) : null}
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      {riderectto === "list" ? (
                        <Link
                          to="/production/raiseproblemlist"
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
                      ) : riderectto === "open" ? (
                        <Link
                          to="/support/raiseproblem/open"
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
                      ) : riderectto === "closed" ? (
                        <Link
                          to="/support/raiseproblem/closed"
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
                      ) : riderectto === "onprogress" ? (
                        <Link
                          to="/support/raiseproblem/onprogress"
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
                      ) : null}
                    </>
                  )}
                </Grid>
              </Grid>
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
                {previewURL && refImageDrag.length > 0 ? (
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
                {previewURLedit && refImageDragedit.length > 0 ? (
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
export default RaiseProblemView;
