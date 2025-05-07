import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import ReactQuill from "react-quill";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
import ListOrganizationDocument from "./ListOrganizationDocument.js.js";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { FaTrash } from "react-icons/fa";

function AddOrganizationDocument() {

  const [uploadBills, setUploadBills] = useState([]);


  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...uploadBills];
    newSelectedFiles.splice(index, 1);
    setUploadBills(newSelectedFiles);
  };


  const renderFilePreviewMulter = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const [newDocuments, setNewDocuments] = useState({
    categoryname: {
      label: "Please Select Category",
      value: "Please Select Category",
    },
    subcategoryname: {
      label: "Please Select SubCategory",
      value: "Please Select SubCategory",
    },
    name: "", fileoptionname: "Excel"
  });
  const [uploadShow, setUploadShow] = useState(false);
  const [isBtn, setIsBtn] = useState(false);
  const [textShow, setTextShow] = useState(false);
  const [documentFiles, setdocumentFiles] = useState([]);
  const [TextEditor, setTextEditor] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, pageName, buttonStyles, setPageName } = useContext(
    UserRoleAccessContext
  );
  const username = isUserRoleAccess?.username;
  const handleTextSummary = (value) => {
    setTextEditor(value);
  };
  const backPage = useNavigate();
  const { auth } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
  const [findMatch, setFindMatch] = useState([]);
  const [vendorAuto, setVendorAuto] = useState("");
  //useEffect
  useEffect(() => {
    if (TextEditor.length > 11) {
      setUploadShow(false);
    } else {
      setUploadShow(true);
    }
    if (uploadBills.length !== 0) {
      setTextShow(false);
    } else if (uploadBills.length === 0) {
      setTextShow(true);
    }
  }, [TextEditor, uploadBills]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Organization Category Documents"),
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
  useEffect(() => {
    getapi();
    fetchCategory();
    fetchAllApproveds();
  }, []);
  const fileOption = [
    { label: "Excel", value: "Excel" },
    { label: "Pdf", value: "Pdf" },
    { label: "Image-png", value: "Image-png" },
  ];
  // const handleResumeUpload = (event) => {
  //   const resume = event.target.files;
  //   const allowedExtensions = newDocuments.fileoptionname === "Excel"
  //     ? ["xlsx", "xls", "csv"]
  //     : newDocuments.fileoptionname === "Pdf"
  //       ? ["pdf"]
  //       : newDocuments.fileoptionname === "Image-png"
  //         ? ["png"]
  //         : [];

  //   for (let i = 0; i < resume?.length; i++) {
  //     const file = resume[i];
  //     const fileExtension = file.name.split('.').pop().toLowerCase();
  //     // Check if the file type is allowed
  //     if (!allowedExtensions.includes(fileExtension)) {
  //       // alert(`Please upload a ${newDocuments.fileoptionname} file.`);
  //       setPopupContentMalert(`Please upload a ${newDocuments.fileoptionname} file.`);
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //       continue; // Skip this file and move to the next
  //     }
  //     // If the file type is valid, proceed with reading the file
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       setdocumentFiles((prevFiles) => [
  //         ...prevFiles,
  //         {
  //           name: file.name,
  //           preview: reader.result,
  //           data: reader.result.split(",")[1],
  //           remark: "resume file",
  //         },
  //       ]);
  //     };
  //   }
  // };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    const allowedExtensions =
      newDocuments.fileoptionname === "Excel"
        ? ["xlsx", "xls", "csv"]
        : newDocuments.fileoptionname === "Pdf"
          ? ["pdf"]
          : newDocuments.fileoptionname === "Image-png"
            ? ["png"]
            : [];

    const selectedFiles = Array.from(resume); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let invalidFiles = []; // To store names of files with invalid extensions
    let largeFiles = []; // To store names of files larger than 1MB
    let validFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // Check if the file type is allowed
      if (!allowedExtensions.includes(fileExtension)) {
        invalidFiles.push(file.name); // Collect invalid file names
        continue; // Skip this file and move to the next
      }

      // Check if the file size is within the limit
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        continue; // Skip this file and move to the next
      }

      // If the file is valid, create a preview URL and add it to the validFiles array
      validFiles.push({
        file: file,
        preview: URL.createObjectURL(file), // Generate preview URL
      });
    }

    // If there are invalid files, show a single popup message
    if (invalidFiles.length > 0) {
      setPopupContentMalert(
        `The following files have invalid extensions and will not be uploaded:\n${invalidFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (validFiles.length === 0) return; // If no valid files, exit

    // If there are existing files, append the new valid files
    if (uploadBills?.length > 0) {
      setUploadBills([...uploadBills, ...validFiles]);
    } else {
      // If no existing files, set the valid files as the new documentFiles
      setUploadBills(validFiles);
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
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const fetchCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.ORGCATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions([
        ...response?.data?.orgcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchSubCategory = async (e) => {
    setPageName(!pageName)
    try {
      let response = await axios.post(`${SERVICE.GET_ORGSUBCAT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(e.value),
      });
      let subcatOpt = response?.data?.subcat
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      let addedAllTeam = [{ label: "ALL", value: "ALL" }, ...subcatOpt];
      setsSubCategoryOptions(addedAllTeam);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const handleClear = () => {
    setNewDocuments({
      ...newDocuments,
      categoryname: {
        label: "Please Select Category",
        value: "Please Select Category",
      },
      subcategoryname: {
        label: "Please Selec SubCategory",
        value: "Please Select SubCategory",
      },
      name: "", fileoptionname: "Excel"
    });
    setTextEditor("");
    setUploadBills([]);
    // setCategoryOptions([])
    setsSubCategoryOptions([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const sendRequest = async () => {
    setIsBtn(true);
    setVendorAuto("ABCD");
    setPageName(!pageName)
    try {

      let formData = new FormData();

      if (uploadBills.length > 0) {
        uploadBills.forEach((item) => {
          formData.append("document", item.file); // `files` is the key for multiple files

        });
      }

      const jsonData = {
        categoryname: String(newDocuments.categoryname.value),
        subcategoryname: String(newDocuments.subcategoryname.value),
        name: String(newDocuments.name),
        // document: [...documentFiles],
        documentstext: TextEditor,
        fileoptionname: String(newDocuments.fileoptionname),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }

      formData.append("jsonData", JSON.stringify(jsonData));

      await axios.post(`${SERVICE.ORGDOCUMENT_CREATE}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });
      await fetchAllApproveds();
      setNewDocuments({ ...newDocuments, name: "" });
      setTextEditor("");
      setdocumentFiles([]);
      setVendorAuto("EFGH");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const handleSubmit = () => {
    const duplicate = findMatch.some(
      (item) =>
        item?.categoryname === newDocuments?.categoryname?.value &&
        item?.subcategoryname === newDocuments?.subcategoryname?.value &&
        item?.name?.toLowerCase() === newDocuments?.name?.toLowerCase()
    );
    if (newDocuments?.categoryname?.value === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newDocuments?.subcategoryname?.value === "Please Select SubCategory"
    ) {
      setPopupContentMalert("Please Select SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newDocuments.name === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      uploadBills.length === 0 &&
      (TextEditor == "<p><br></p>" || TextEditor == "")
    ) {
      setPopupContentMalert("Please Add the Documents");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (duplicate) {
      setPopupContentMalert("Organization Document Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleChangeInput = (e) => {
    // Remove any numeric characters from the input value
    const newValue = e.target.value.replace(/[0-9]/g, "");
    setNewDocuments({ ...newDocuments, name: newValue });
  };
  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName)
    try {
      let res_doc = await axios.get(SERVICE.ALL_ORGDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFindMatch(res_doc?.data?.document);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  return (
    <Box>
      <Headtitle title={"ADD ORGANIZATION DOCUMENT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Organization Document"
        modulename="Settings"
        submodulename="Organization Document"
        mainpagename="Organization Document"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aorganizationdocument") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Organization Document
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    options={categoryOptions}
                    placeholder="Please Select Category"
                    value={{
                      label: newDocuments?.categoryname?.label,
                      value: newDocuments?.categoryname?.value,
                    }}
                    onChange={(e) => {
                      fetchSubCategory(e);
                      setNewDocuments({
                        ...newDocuments,
                        categoryname: {
                          label: e.label,
                          value: e.value,
                        },
                        subcategoryname: {
                          label: "Please Select SubCategory",
                          value: "Please Select SubCategory",
                        },
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    SubCategory<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    options={subCategoryOptions}
                    value={{
                      label: newDocuments?.subcategoryname?.label,
                      value: newDocuments?.subcategoryname?.value,
                    }}
                    placeholder="Please Select SubCategory"
                    onChange={(e) => {
                      setNewDocuments({
                        ...newDocuments,
                        subcategoryname: {
                          label: e.label,
                          value: e.value,
                        },
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={newDocuments.name}
                    onChange={(e) => {
                      setNewDocuments({
                        ...newDocuments,
                        name: e.target.value,
                      });
                      handleChangeInput(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}></Grid>
              {/* next grdi */}
              {textShow ? (
                <>
                  <Grid item md={12} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Documents </b>
                      </Typography>
                      <ReactQuill
                        style={{ height: "180px" }}
                        value={TextEditor}
                        onChange={(e) => {
                          handleTextSummary(e);
                        }}
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
                    </FormControl>
                  </Grid>
                  <br />
                  <br />
                </>
              ) : null}
              <br />
              <br />
              {uploadShow ? (
                <>
                  <Grid item md={12} sm={6} xs={12}></Grid>
                  <br />
                  <br />
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>File Type</Typography>
                      <Selects
                        options={fileOption}
                        placeholder="Excel"
                        value={{
                          label: newDocuments.fileoptionname,
                          value: newDocuments.fileoptionname,
                        }}
                        onChange={(e) => {
                          setNewDocuments({
                            ...newDocuments,
                            fileoptionname: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <br />
                  {newDocuments.fileoptionname !== "Please Select Fileoption" && (
                    <>
                      <Grid item md={12} sm={12} xs={12}>
                        <br /> <br /> <br /> <br />
                        <Typography variant="h6">Upload Document</Typography>
                        <Grid marginTop={2} sx={{ display: "flex" }}>
                          <Button
                            variant="contained"
                            size="small"
                            component="label"
                            sx={{
                              "@media only screen and (max-width:550px)": {
                                marginY: "5px",
                              },
                              ...buttonStyles.buttonsubmit
                            }}
                          >
                            Upload
                            <input
                              type="file"
                              id="resume"
                              accept={
                                newDocuments.fileoptionname === "Excel"
                                  ? ".xlsx, .xls, .csv"
                                  : newDocuments.fileoptionname === "Pdf"
                                    ? ".pdf"
                                    : newDocuments.fileoptionname === "Image-png"
                                      ? ".png"
                                      : ""
                              }
                              name="file"
                              hidden
                              onChange={(e) => {
                                handleResumeUpload(e);
                                setTextEditor("");
                              }}
                            />
                          </Button>
                          &emsp;
                        </Grid>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        {uploadBills?.length > 0 && uploadBills?.map((data, index) => (
                          <>
                            <Grid container>
                              {/* <Grid item md={2} sm={2} xs={2}>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >

                                <img
                                  // className={classes.preview}
                                  src={data.name || data.file.name}
                                  // src={getFileIcon(data.name || data.file.name)}
                                  height="25"
                                  alt="file icon"
                                />
                                {/* )} 
                              </Box>
                            </Grid> */}
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
                                    onClick={() => renderFilePreviewMulter(data.file)}
                                  />
                                </Button>

                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                  onClick={() =>
                                    handleDeleteFileDocumentEdit(index)
                                  }
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </>
                  )}
                </>
              ) : null}

              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    sx={buttonStyles.buttonsubmit} onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    {" "}
                    SAVE
                  </Button>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Box>
              <Dialog
                open={isErrorOpen}
                onClose={handleCloseerr}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent
                  sx={{
                    width: "350px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={handleCloseerr}
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
          <br />
        </>
      )}
      <ListOrganizationDocument vendorAuto={vendorAuto} />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}
export default AddOrganizationDocument;