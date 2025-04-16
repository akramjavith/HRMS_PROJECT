import React, { useState, useEffect, useRef, useContext } from "react";
import {
  DialogTitle,
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  Select,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { handleApiError } from "../components/Errorhandling";
import { userStyle, colourStyles } from "../pageStyle";
import { FaPlus, FaTrash } from "react-icons/fa";
import { SERVICE } from "../services/Baseservice";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { menuItems } from "../components/menuItemsList";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import pdfIcon from "../components/Assets/pdf-icon.png";
import wordIcon from "../components/Assets/word-icon.png";
import excelIcon from "../components/Assets/excel-icon.png";
import csvIcon from "../components/Assets/CSV.png";
import fileIcon from "../components/Assets/file-icons.png";
// import Webcamimage from "../asset/Webcameimageasset";
import { makeStyles } from "@material-ui/core";
// import CategoryMasterPopup from "./CategoryMasterPopup";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "react-quill/dist/quill.snow.css";

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

function ScreenShot() {
  const [cateCode, setCatCode] = useState([]);
  let allUploadedFiles = [];

  const deduction = [
    { label: "Corrections", value: "Corrections" },
    { label: "Existings", value: "Existings" },
  ];

  const priorityOptions = [
    { label: "Immediate", value: "Immediate" },
    { label: "Delay", value: "Delay" },
    { label: "Next Version", value: "Next Version" },
  ];

  const [btnSubmit, setBtnSubmit] = useState(false);

  const [singleSelectValues, setSingleSelectValues] = useState({
    mode: "Please Select Mode",
    priority: "Please Select Priority",
    module: "",
    submodule: "",
    mainpage: "",
    subpage: "",
    subsubpage: "",
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryMaster, setCategoryMaster] = useState([]);
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);

  const handleScreenshotOption = (isYes) => {
    if (isYes) {
      setIsScreenshotMode(true);
      takeScreenshot();
    } else {
      setIsScreenshotMode(false);
      setScreenshotFile(null);
    }
  };
  const scrollToTop = () => {
    return new Promise((resolve) => {
      const onScroll = () => {
        if (window.pageYOffset === 0) {
          window.removeEventListener("scroll", onScroll);
          resolve();
        }
      };

      window.addEventListener("scroll", onScroll);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // In case the page is already at the top
      if (window.pageYOffset === 0) {
        window.removeEventListener("scroll", onScroll);
        resolve();
      }
    });
  };
  const takeScreenshot = async () => {
    await handleCloseMod();
    await scrollToTop();
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newScreenshotFile = {
        name: "screenshot.png",
        size: imgData.length,
        type: "image/png",
        preview: imgData,
        base64: imgData.split(",")[1],
      };
      setScreenshotFile(newScreenshotFile);
      setRefImage((prevImages) => [newScreenshotFile]);
    });
    handleClickOpenEdit(); // Reopen the edit modal after taking a screenshot
  };

  // Reference images input handling (only allowed when screenshot mode is disabled)
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        newSelectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setRefImage(newSelectedFiles);
      };
      reader.readAsDataURL(file);
      //   }
    }
  };

  const getCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.CATEGORYMASTERGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryMaster(response.data.categorymaster);
      setCategoryOptions(
        response.data.categorymaster.map((item) => ({
          label: item.categoryname,
          value: item.categoryname,
        }))
      );
      setStockCategoryAuto("");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //alert model for stock category
  const [openviewalertstockcategory, setOpenviewalertstockcategory] =
    useState(false);
  const [stockCategoryAuto, setStockCategoryAuto] = useState("");

  // view model
  const handleClickOpenviewalertstockcategory = () => {
    setOpenviewalertstockcategory(true);
  };
  const handleCloseviewalertstockcategory = () => {
    setOpenviewalertstockcategory(false);
  };

  useEffect(() => {
    getCategory();
  }, [stockCategoryAuto]);

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setScreenshotFile(null);
    handleCloseMod();
    setRefImage([]);
  };

  const [isOpen, setIsOpen] = useState(false);

  //Delete model
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleCloseMod = () => {
    setIsOpen(false);
  };

  let name = "create";
  const [currentText, setCurrentText] = useState("");
  const [currentTexttodo, setCurrentTexttodo] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const classes = useStyles();

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
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
    setScreenshotFile(null);
    handleCloseMod();
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

  // //reference images
  // const handleInputChange = (event) => {
  //     const files = event.target.files;
  //     let newSelectedFiles = [...refImage];

  //     for (let i = 0; i < files.length; i++) {
  //         const file = files[i];
  //         // Check if the file is an image
  //         // if (file.type.startsWith("image/")) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //             newSelectedFiles.push({
  //                 name: file.name,
  //                 size: file.size,
  //                 type: file.type,
  //                 preview: reader.result,
  //                 base64: reader.result.split(",")[1],
  //             });
  //             setRefImage(newSelectedFiles);
  //         };
  //         reader.readAsDataURL(file);
  //         // } else {
  //         //   setShowAlert(
  //         //     <>
  //         //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //         //         {"Only Accept Images!"}
  //         //       </p>
  //         //     </>
  //         //   );
  //         //   // handleClickOpenalert();
  //         // }
  //     }
  // };
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
    setScreenshotFile(null);
  };

  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
  };

  //todo upload
  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);
  const webcamOpenedit = () => {
    setIsWebcamOpenedit(true);
  };
  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    webcamCloseedit();
    setGetImgedit("");
  };
  const showWebcamedit = () => {
    webcamOpenedit();
  };

  const handletododocumentchange = (e, field, index) => {
    setEditingIndexcheck(index);
    // setRefImageedit(todoscheck[index].files)
    // setCurrentTexttodo()
    // setCurrentTexttodo(todoscheck[index].e.target.value)
    const newTodoscheck = [...todoscheck];
    newTodoscheck[index].document = e;

    setTodoscheck(newTodoscheck);
  };

  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);

  const handleClickUploadPopupOpenedit = (index) => {
    setUploadPopupOpenedit(true);
    setEditingIndexcheck(index);
    setRefImageedit(todoscheck[index].files);
  };

  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
    setScreenshotFile(null);
  };
  const handleInputChangeedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      // if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        newSelectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setRefImageedit(newSelectedFiles);
      };
      reader.readAsDataURL(file);
    }
  };

  //first deletefile
  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const resetImageedit = () => {
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };

  const handleUploadOverAlledit = () => {
    const files = refImageedit ? refImageedit : [];
    const newTodoscheck = [...todoscheck];
    newTodoscheck[editingIndexcheck].files = files;

    setTodoscheck(newTodoscheck);
    setUploadPopupOpenedit(false);
  };
  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFileedit = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
  };

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);

  const handleCreateTodocheck = () => {
    // if (currentText && currentText === 0) {

    if (
      (currentText === "" || currentText === "<p><br></p>") &&
      refImage.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Any Description or Upload Attachement"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const newTodocheck = {
        document: currentText,
        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
      };
      setTodoscheck([...todoscheck, newTodocheck]);
      setRefImage([]);
      setPreviewURL(null);
      setCurrentText("");
    }
    // }
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };

  const [rolesNewList, setRolesNewList] = useState([]);

  const currentPage = window.location.pathname;

  const findPageHierarchy = (items, currentUrl) => {
    // Initialize titles object to track hierarchy
    let titles = {
      module: null,
      submodule: null,
      mainpage: null,
      subpage: null,
      subsubpage: null,
    };

    // Recursive function to traverse the menu items
    const traverse = (items, path = []) => {
      for (let item of items) {
        const newPath = [...path, item.title]; // Create a path with current item

        if (item.url && item.url === currentUrl) {
          // When current URL matches, assign titles based on path depth
          titles.module = newPath[0] || null;
          titles.submodule = newPath[1] || null;
          titles.mainpage = newPath[2] || null;
          titles.subpage = newPath[3] || null;
          titles.subsubpage = newPath[4] || null;

          return true; // Exit once the URL is matched
        } else if (item.submenu) {
          // Continue searching in submenu
          if (traverse(item.submenu, newPath)) {
            return true; // Exit once a match is found in the submenu
          }
        }
      }
      return false; // Return false if no match found
    };

    traverse(items); // Start traversing the menu items

    // Return the titles object containing the hierarchy
    return titles;
  };

  useEffect(() => {
    const result = findPageHierarchy(menuItems, currentPage);
    if (result) {
      setSingleSelectValues({
        ...result,
        mode: "Please Select Mode",
        priority: "Please Select Priority",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
      });
    }
  }, [currentPage]);

  const { auth } = useContext(AuthContext);

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const fetchRaise = async () => {
    try {
      let res_branch = await axios.get(SERVICE.RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(res_branch?.data?.raises);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get the current user role datas
  const fetchNewRoleList = async () => {
    try {
      let role_new = await axios.get(SERVICE.ROLE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const allRoles = role_new?.data?.roles.filter((item) =>
        isUserRoleAccess?.role?.includes(item?.name)
      );

      let mergedObject = {};
      allRoles.forEach((obj) => {
        const keysToInclude = [
          "modulename",
          "submodulename",
          "mainpagename",
          "subpagename",
          "subsubpagename",
        ];

        keysToInclude.forEach((key) => {
          if (!mergedObject[key]) {
            mergedObject[key] = [];
          }

          if (Array.isArray(obj[key])) {
            obj[key].forEach((item) => {
              if (!mergedObject[key].includes(item)) {
                mergedObject[key].push(item);
              }
            });
          } else {
            if (!mergedObject[key].includes(obj[key])) {
              mergedObject[key].push(obj[key]);
            }
          }
        });
      });
      setRolesNewList([mergedObject]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchRaise();
  }, []);
  useEffect(() => {
    fetchNewRoleList();
  }, [isUserRoleAccess]);

  const [isAddOpenalert, setAddOpenAlert] = useState(false);

  //add function...
  const sendRequest = async () => {
    setBtnSubmit(true);
    try {
      let roles = await axios.post(`${SERVICE.RAISEPROBLEM_CREATE}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        mode: singleSelectValues.mode,
        autoid: String(newval),
        status: String("Open"),
        priority: singleSelectValues.priority,
        modulename: singleSelectValues.module,
        submodulename: singleSelectValues.submodule,
        mainpagename: singleSelectValues.mainpage,
        subpagename: singleSelectValues.subpage,
        subsubpagename: singleSelectValues.subsubpage,
        raisetodo: todoscheck,
        category:
          singleSelectValues.category === "Please Select Category"
            ? ""
            : singleSelectValues.category,
        subcategory:
          singleSelectValues.subcategory === "Please Select Sub Category"
            ? ""
            : singleSelectValues.subcategory,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
        createdby: String(isUserRoleAccess?.username),
        createdbycompany: String(isUserRoleAccess?.company),
        createdbyemail: String(isUserRoleAccess?.email),
        createdbycontactnumber: String(isUserRoleAccess?.emergencyno),
      });
      // await fetchNewRoleList();
      setBtnSubmit(false);
      setSingleSelectValues({
        ...singleSelectValues,
        mode: "Please Select Mode",
        priority: "Please Select Priority",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
      });
      setTodoscheck([]);
      setRefImage([]);
      await fetchRaise();
      setAddOpenAlert(true);
      setTimeout(() => {
        setAddOpenAlert(false);
      }, 1000);
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSubmit = () => {
    if (singleSelectValues.mode === "Please Select Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Mode"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singleSelectValues.priority === "Please Select Priority") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Priority"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoscheck.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add Any Data in Todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (currentText != "<p><br></p>" && currentText != "") ||
      refImage.length > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add The Todo And Submit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todoscheck?.some(
        (data) =>
          (data?.document === "" || data?.document === "<p><br></p>") &&
          data?.files.length === 0
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the todos and Submit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleScreenshot = () => {
    handleClickOpen();
  };

  const handleClear = () => {
    setTodoscheck([]);
    setRefImage([]);
    setScreenshotFile(null);
    setIsScreenshotMode(false);

    setSingleSelectValues({
      ...singleSelectValues,
      mode: "Please Select Mode",
      priority: "Please Select Priority",
      // modulename: "",
      // submodulename: "",
      // mainpagename: "",
      // subpagename: "",
      // subsubpagename: "",
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
    });
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Clearded Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  const [rolesedit, setRolesedit] = useState([]);
  let updateby = rolesedit?.updatedby;
  let addedby = rolesedit?.addedby;

  //Delete functionalities

  // Alert delete popup
  let roleid = rolesedit._id;

  let projectsid = rolesedit._id;
  let newval = "RUP0001";

  return (
    <>
      <Box sx={{}}>
        {!isEditOpen && (
          <Avatar
            sx={{
              bgcolor: "#ee5b2e",
              cursor: "pointer",
              position: "fixed", // Fixed position to keep it at a set location
              //   bottom: "20px", // Adjust position as needed
              //   right: "20px", // Adjust position as needed
              zIndex: 1500, // Ensure the z-index is higher than the Dialog's z-index
              pointerEvents: "auto", // Ensure it can receive click events

              bottom: "2rem",
              right: "2rem",
              height: "4rem",
              width: "4rem",
              // fontSize: "1rem",
              borderRadius: "50%",
              // cursor: "pointer",
            }}
            onClick={handleScreenshot}
          >
            {"✋"}
          </Avatar>
        )}
      </Box>

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

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
        >
          {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Raise Problem</Typography>
              </Grid>

              {cateCode &&
                cateCode.map(() => {
                  let strings = "RUP";
                  let refNo = cateCode[cateCode.length - 1].autoid;
                  let digits = (cateCode.length + 1).toString();
                  const stringLength = refNo.length;
                  let lastChar = refNo.charAt(stringLength - 1);
                  let getlastBeforeChar = refNo.charAt(stringLength - 2);
                  let getlastThreeChar = refNo.charAt(stringLength - 3);
                  let lastBeforeChar = refNo.slice(-2);
                  let lastThreeChar = refNo.slice(-3);
                  let lastDigit = refNo.slice(-4);
                  let refNOINC = parseInt(lastChar) + 1;
                  let refLstTwo = parseInt(lastBeforeChar) + 1;
                  let refLstThree = parseInt(lastThreeChar) + 1;
                  let refLstDigit = parseInt(lastDigit) + 1;
                  if (
                    digits.length < 4 &&
                    getlastBeforeChar == 0 &&
                    getlastThreeChar == 0
                  ) {
                    refNOINC = ("000" + refNOINC).substr(-4);
                    newval = strings + refNOINC;
                  } else if (
                    digits.length < 4 &&
                    getlastBeforeChar > 0 &&
                    getlastThreeChar == 0
                  ) {
                    refNOINC = ("00" + refLstTwo).substr(-4);
                    newval = strings + refNOINC;
                  } else if (digits.length < 4 && getlastThreeChar > 0) {
                    refNOINC = ("0" + refLstThree).substr(-4);
                    newval = strings + refNOINC;
                  } else {
                    refNOINC = refLstDigit.substr(-4);
                    newval = strings + refNOINC;
                  }
                })}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography>
                    Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={deduction}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.mode,
                      value: singleSelectValues.mode,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        mode: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Priority<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={priorityOptions}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.priority,
                      value: singleSelectValues.priority,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        priority: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Module Name<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={singleSelectValues.module || ""}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Sub Module Name<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={singleSelectValues.submodule || ""}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography> Main Page </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={singleSelectValues.mainpage || ""}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography> Sub Page </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={singleSelectValues.subpage || ""}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Sub-Page</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={singleSelectValues.subsubpage || ""}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={3.5} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Category</Typography>
                  <Selects
                    options={categoryOptions}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.category,
                      value: singleSelectValues.category,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        category: e.value,
                        subcategory: "Please Select Sub Category",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {/* <Grid item md={0.5} sm={1} xs={1}>
                                        {isUserRoleCompare?.includes("acategorymaster") && (
                                            <Button
                                                variant="contained"
                                                style={{
                                                    height: "30px",
                                                    minWidth: "20px",
                                                    padding: "19px 13px",
                                                    color: "white",
                                                    marginTop: "23px",
                                                    marginLeft: "-10px",
                                                    background: "rgb(25, 118, 210)",
                                                }}
                                                onClick={() => {
                                                    handleClickOpenviewalertstockcategory();
                                                }}
                                            >
                                                <FaPlus style={{ fontSize: "15px" }} />
                                            </Button>
                                        )}
                                    </Grid> */}
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Category</Typography>
                  <Selects
                    options={categoryMaster
                      .filter(
                        (item) =>
                          item.categoryname === singleSelectValues.category
                      )
                      .map((item) => {
                        return item.subcategoryname.map((subCatName) => ({
                          label: subCatName,
                          value: subCatName,
                        }));
                      })
                      .flat()}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.subcategory,
                      value: singleSelectValues.subcategory,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        subcategory: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>

              {/* {textShow ? ( */}
              <>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b> Description </b>
                    </Typography>
                    <ReactQuill
                      style={{ height: "180px" }}
                      value={currentText}
                      onChange={(e) => {
                        setCurrentText(e);
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
              {/* ) : null} */}

              <br />

              <Grid item md={4} xs={12} sm={12}>
                <Typography>Attachment</Typography>
                <Box sx={{ display: "flex", justifyContent: "left" }}>
                  <Button
                    variant="contained"
                    onClick={handleClickUploadPopupOpen}
                  >
                    Upload
                  </Button>
                </Box>
                <Grid item md={12} xs={12} sm={12}>
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
                        <Typography variant="subtitle2">
                          {" "}
                          {file.name}{" "}
                        </Typography>
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
              <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                <Button
                  variant="contained"
                  sx={{ minWidth: "35px" }}
                  onClick={handleCreateTodocheck}
                >
                  <FaPlus />
                </Button>
              </Grid>
            </Grid>
            <br />
            <br />
            <br />
            {todoscheck?.length > 0 &&
              todoscheck.map((todo, index) => (
                <div key={index}>
                  <br />
                  <br />
                  <br />
                  <Grid container spacing={1}>
                    <Grid item md={6} sm={4} xs={4}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          <b> Problem {index + 1} </b>
                        </Typography>
                        <ReactQuill
                          style={{ height: "180px" }}
                          value={todo.document}
                          onChange={(e) => {
                            handletododocumentchange(e, "document", index);
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
                    <Grid item md={4} sm={6} xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          marginTop: "30px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleClickUploadPopupOpenedit(index)}
                        >
                          Upload
                        </Button>
                      </Box>
                      <Grid item md={12} xs={12} sm={12}>
                        {todo.files.map((file, index) => (
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
                              <Typography variant="subtitle2">
                                {" "}
                                {file.name}{" "}
                              </Typography>
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
                                    style={{
                                      fontsize: "12px",
                                      color: "#357AE8",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item md={2} sm={6} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          minWidth: "20px",
                          minHeight: "41px",
                          background: "transparent",
                          boxShadow: "none",
                          marginTop: "-13px !important",
                          "&:hover": {
                            background: "#f4f4f4",
                            borderRadius: "50%",
                            minHeight: "41px",
                            minWidth: "20px",
                            boxShadow: "none",
                          },
                        }}
                        onClick={() => handleDeleteTodocheck(index)}
                      >
                        <FaTrash
                          style={{
                            color: "#b92525",
                            fontSize: "1.2rem",
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>

                  <br />
                </div>
              ))}
            <br /> <br />
            <br /> <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item md={1} sm={2} xs={12}>
                <LoadingButton
                  sx={{
                    ...userStyle.buttonadd,
                    marginLeft: "10px",
                  }}
                  variant="contained"
                  loading={btnSubmit}
                  style={{ minWidth: "0px" }}
                  onClick={handleSubmit}
                >
                  SAVE
                </LoadingButton>
              </Grid>
              <Grid item md={1} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
              <Grid item md={1} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                  {" "}
                  Cancel{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* </DialogContent> */}
        </Dialog>
      </Box>

      {/* Upload Files DIALOG */}
      {/* // Render the dialog */}
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
          {isScreenshotMode ? "Capture Screenshot" : "Upload Files"}
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .docx, .txt, .png, image/*"
                      hidden
                      onChange={handleInputChange}
                    />
                  </Button>
                </Grid>
              </FormControl>
            </Grid>

            {/* Displaying uploaded/screenshot files */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* Display screenshot if available */}
              {screenshotFile && !refImage.includes(screenshotFile) && (
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
                        src={screenshotFile.preview}
                        alt={screenshotFile.name}
                        height={50}
                        style={{ maxWidth: "-webkit-fill-available" }}
                      />
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
                    <Typography variant="subtitle2">
                      {" "}
                      {screenshotFile.name}{" "}
                    </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036",
                          },
                        }}
                        onClick={() => renderFilePreview(screenshotFile)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036",
                          },
                        }}
                        onClick={() => setScreenshotFile(null)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Display other uploaded files */}
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
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036",
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
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
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      {/* <Dialog
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
            </Dialog> */}

      {/* Upload Files DIALOG EDIT */}
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
          Upload Files
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* {showDragField ? ( */}

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
                  >
                    {" "}
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .txt, .docx, image/*"
                      hidden
                      onChange={handleInputChangeedit}
                    />
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImageedit?.map((file, index) => (
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
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => {
                            handleDeleteFileedit(index);
                          }}
                        >
                          <FaTrash
                            style={{ color: "#a73131", fontSize: "12px" }}
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
          <Button onClick={handleUploadOverAlledit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      {/* <Dialog
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
                        name={name}
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
            </Dialog> */}

      {/* Popup open conditions */}
      <Box>
        <Dialog
          open={isOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* Close Icon */}
          <IconButton
            aria-label="close"
            onClick={handleCloseMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              // color: (theme) => theme.palette.grey[500],
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            sx={{ width: "550px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h6" sx={{ color: "red", textAlign: "center" }}>
              Do you want to Raise Problem In This Page?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={handleClickOpenEdit}
              variant="contained"
              color="error"
              sx={{fontSize:"12px"}}
            >
              No, Without Screenshot
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="success"
              sx={{fontSize:"12px"}}
              onClick={handleScreenshotOption}
            >
              Yes, With Screenshot
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{fontSize:"12px"}}
              onClick={() => {
                alert("To capture a portion of your screen, press Windows + Shift + S");
              }}
            >
              Screenshot with Snipping Tool
            </Button>

          </DialogActions>
        </Dialog>
      </Box>

      {/* dialog box for  category */}

      {/* Submit DIALOG */}
      <Dialog
        open={isAddOpenalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Raise Problem is Raised</b>
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openviewalertstockcategory}
        onClose={handleClickOpenviewalertstockcategory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        // sx={{
        //     overflow: "visible",
        //     "& .MuiPaper-root": {
        //         overflow: "visible",
        //     },
        // }}
        fullWidth={true}
      >
        {/* <CategoryMasterPopup
                    setStockCategoryAuto={setStockCategoryAuto}
                    handleCloseviewalertstockcategory={handleCloseviewalertstockcategory}
                /> */}
      </Dialog>
    </>
  );
}

export default ScreenShot;
