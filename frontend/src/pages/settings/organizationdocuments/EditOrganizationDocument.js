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
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import "jspdf-autotable";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import { FaTrash } from "react-icons/fa";

function EditOrganizationDocument() {

  const [billUploadedFiles, setBillUploadedFiles] = useState([]);
  const [uploadBills, setUploadBills] = useState([]);
  const [deletedBillFiles, setDeletedBillFiles] = useState([]);

  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...uploadBills];
    newSelectedFiles.splice(index, 1);
    setUploadBills(newSelectedFiles);
  };

  const handleDeleteUploadedBills = (index) => {
    setBillUploadedFiles((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Update the deletedBillFiles state
      setDeletedBillFiles((prevDeletedFiles) => [...prevDeletedFiles, fileToDelete]);

      // Remove the file from the uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });
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

  const [fieldsShow, setFieldsShow] = useState(false);
  const [uploadShow, setUploadShow] = useState(false);
  const [textShow, setTextShow] = useState(false);
  const [documentFiles, setdocumentFiles] = useState([]);
  const [TextEditor, setTextEditor] = useState("");
  const backPage = useNavigate();
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, buttonStyles, isUserRoleAccess, setPageName, pageName } = useContext(
    UserRoleAccessContext
  );
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [singleDocument, setSingleDocument] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
  const [findMatch, setFindMatch] = useState([]);

  const fileOption = [
    { label: "Excel", value: "Excel" },
    { label: "Pdf", value: "Pdf" },
    { label: "Image-png", value: "Image-png" },
  ];

  let ids = useParams().id;
  //useEffect
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Edit Organization Document"),
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
    getinfoCode();
    getapi();
  }, [ids]);
  useEffect(() => {
    fetchCategory();
    fetchAllApproveds();
  }, []);
  let updateby = singleDocument.updatedby;
  useEffect(() => {
    if (TextEditor.length > 11) {
      setUploadShow(false);
      setBillUploadedFiles([])
      setUploadBills([])
    } else {
      setUploadShow(true);
    }
    if (billUploadedFiles.length !== 0 || uploadBills?.length !== 0) {
      setTextShow(false);
    } else if (billUploadedFiles.length === 0 || uploadBills?.length !== 0) {
      setTextShow(true);
    }
    if (fieldsShow) {
      setSingleDocument({ ...singleDocument });
    }
  }, [TextEditor, billUploadedFiles, uploadBills, fieldsShow]);
  const handleTextSummary = (value) => {
    setTextEditor(value);
  };
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const username = isUserRoleAccess?.username;
  const getinfoCode = async () => {
    setLoading(false);

    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ORGDOCUMENT_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDocument(res?.data.sdocument);
      setTextEditor(res?.data.sdocument.documentstext);
      setdocumentFiles(res?.data.sdocument.document);
      setBillUploadedFiles(res?.data.sdocument.document);

      await fetchSubCategory(res?.data.sdocument.categoryname);
      if (res?.data.sdocument.type === "Policy Document") {
        setFieldsShow(true);
      } else {
        setFieldsShow(false);
      }
      setLoading(true);

      // handleCloseerr();
    } catch (err) {
      setLoading(true);

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    const allowedExtensions =
      singleDocument.fileoptionname === "Excel"
        ? ["xlsx", "xls", "csv"]
        : singleDocument.fileoptionname === "Pdf"
          ? ["pdf"]
          : singleDocument.fileoptionname === "Image-png"
            ? ["png"]
            : [];

    const selectedFiles = Array.from(resume); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let invalidFiles = []; // To store names of files with invalid extensions
    let largeFiles = []; // To store names of files larger than 1MB
    let validFiles = []; // To store valid files with preview URLs

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

  // const handleResumeUpload = (event) => {
  //   const resume = event.target.files;
  //   const allowedExtensions =
  //     singleDocument.fileoptionname === "Excel"
  //       ? ["xlsx", "xls", "csv"]
  //       : singleDocument.fileoptionname === "Pdf"
  //         ? ["pdf"]
  //         : singleDocument.fileoptionname === "Image-png"
  //           ? ["png"]
  //           : [];

  //   for (let i = 0; i < resume?.length; i++) {
  //     const file = resume[i];
  //     const fileExtension = file.name.split('.').pop().toLowerCase();

  //     // Check if the file type is allowed
  //     if (!allowedExtensions.includes(fileExtension)) {
  //       // alert(`Please upload a ${singleDocument.fileoptionname} file.`);
  //       setPopupContentMalert(`Please upload a ${singleDocument.fileoptionname} file.`);
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
        categoryname: String(e),
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
  const sendRequest = async () => {
    setPageName(!pageName)
    try {

      const formData = new FormData();

      if (uploadBills.length > 0) {
        uploadBills.forEach((item) => {
          formData.append("document", item.file);
        });
      }

      if (deletedBillFiles.length > 0) {
        formData.append("deletedorganizationFiles", JSON.stringify(deletedBillFiles));
      }

      const jsonData = {
        categoryname:
          singleDocument.categoryname === String(singleDocument.categoryname)
            ? String(singleDocument.categoryname)
            : String(singleDocument.categoryname),
        subcategoryname:
          singleDocument.subcategoryname ===
            String(singleDocument.subcategoryname)
            ? String(singleDocument.subcategoryname)
            : String(singleDocument.subcategoryname),
        name: String(singleDocument.name),
        // document: [...documentFiles],
        documentstext: TextEditor,
        fileoptionname: String(singleDocument.fileoptionname),
        updatedby: [
          ...updateby,
          { name: String(isUserRoleAccess.companyname), date: String(new Date()) },
        ],
      }

      formData.append("jsonData", JSON.stringify(jsonData));

      let response = await axios.put(`${SERVICE.ORGDOCUMENT_SINGLE}/${ids}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setTimeout(() => {
        backPage("/settings/addorganizationdocument");
      }, 1000)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const handleSubmit = () => {
    const duplicate = findMatch.some(
      (item) =>
        item.categoryname === singleDocument?.categoryname &&
        item.subcategoryname === singleDocument?.subcategoryname &&
        item.name.toLowerCase() === singleDocument.name.toLowerCase()
    );
    if (singleDocument?.categoryname === "Please Select Category") {

      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singleDocument?.subcategoryname === "Please Select SubCategory"
    ) {

      setPopupContentMalert("Please Select SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleDocument.name === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (
      billUploadedFiles.length === 0 && uploadBills.length === 0 &&
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
    setSingleDocument({ ...singleDocument, name: newValue });
  };
  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName)
    try {
      let res_queue = await axios.get(SERVICE.ALL_ORGDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFindMatch(res_queue?.data.document.filter((item) => item._id !== ids));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const renderFilePreviewMulterUploaded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_ORGANIZATIONDOCUMENT_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };

  return (
    <>
      <Headtitle title={"EDIT ORGANIZATION DOCUMENT"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Organization Document
      </Typography>
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "350px",
            }}
          >
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#1976d2"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </Box>
        </Box>
      ) : (
        <Box>
          {isUserRoleCompare?.includes("eorganizationdocument") && (
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Edit Organization Document
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
                      placeholder={singleDocument?.categoryname}
                      value={{
                        label: singleDocument.categoryname,
                        value: singleDocument.categoryname,
                      }}
                      onChange={(e) => {
                        fetchSubCategory(e.value);
                        setSingleDocument({
                          ...singleDocument,
                          categoryname: e.value,
                          subcategoryname: "Please Select SubCategory",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      SubCategory <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      id="component-outlined"
                      type="text"
                      options={subCategoryOptions}
                      placeholder={singleDocument?.subcategoryname}
                      value={{
                        label: singleDocument.subcategoryname,
                        value: singleDocument.subcategoryname,
                      }}
                      onChange={(e) => {
                        setSingleDocument({
                          ...singleDocument,
                          subcategoryname: e.value,
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
                      value={singleDocument.name}
                      onChange={(e) => {
                        setSingleDocument({
                          ...singleDocument,
                          name: e.target.value,
                        });
                        handleChangeInput(e);
                      }}
                    />
                  </FormControl>
                </Grid>
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
                  </>
                ) : null}
                <br />
                <br />
                {/* setTextEditor("<p><br></p>"); */}

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
                            label: singleDocument.fileoptionname,
                            value: singleDocument.fileoptionname,
                          }}
                          onChange={(e) => {
                            setSingleDocument({
                              ...singleDocument,
                              fileoptionname: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <br />
                    {/* {singleDocument.fileoptionname !== "Please Select Fileoption" && ( */}
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
                                singleDocument.fileoptionname === "Excel"
                                  ? ".xlsx, .xls, .csv"
                                  : singleDocument.fileoptionname === "Pdf"
                                    ? ".pdf"
                                    : singleDocument.fileoptionname === "Image-png"
                                      ? ".png"
                                      : ""
                              }
                              name="file"
                              hidden
                              onChange={(e) => {
                                handleResumeUpload(e);
                                // setTextEditor("");
                                setTextEditor("<p><br></p>");
                              }}
                            />
                          </Button>
                          &emsp;
                        </Grid>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        {/* {documentFiles?.length > 0 &&
                          documentFiles.map((file, index) => (
                            <Grid
                              container
                              spacing={2}
                              sx={{ display: "flex", justifyContent: "center" }}
                              key={index}
                            >
                              <Grid item md={5} sm={5} xs={5}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Grid>
                              <Grid item md={1} sm={1} xs={1}>
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
                          ))} */}
                        {billUploadedFiles?.length > 0 && billUploadedFiles?.map((data, index) => (
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
                              <Grid item md={4} sm={2} xs={2}>
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
                                    handleDeleteUploadedBills(index)
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
                              <Grid item md={4} sm={2} xs={2}>
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
                    {/* // )} */}
                  </>
                ) : null}
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <br />
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <Button sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                      {" "}
                      Update
                    </Button>
                    <Button
                      sx={buttonStyles.btncancel} onClick={() => {
                        backPage("/settings/addorganizationdocument");
                      }}
                    >
                      Cancel
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
          )}

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
        </Box>
      )}
    </>
  );
}
export default EditOrganizationDocument;