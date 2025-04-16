import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TextareaAutosize, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling"; 
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import ReactQuill from "react-quill";
import CodeIcon from "@mui/icons-material/Code";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import 'react-quill/dist/quill.snow.css';
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import {
  DeleteConfirmation,
} from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";

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

function Project() {

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

  let exportColumnNames = ['Project Name', 'EstimationTime'];
  let exportRowValues = ['name', 'estimateTime'];

  const gridRef = useRef(null);
  const [project, setProject] = useState({
    name: "",
    estimation: "",
    estimationtime: "Year",
    files: "",
    addedby: "",
    updatedby: "",
    team: "",
  });
  const [projid, setProjid] = useState({
    name: "",
    estimation: "",
    estimationtime: "Year",
    team: "",
  });
  const [projects, setProjects] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName,  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);
  const [checkSubproj, setCheckSubproj] = useState();
  const [checkModule, setCheckModule] = useState();
  const [checkSubmodule, setCheckSubmodule] = useState();
  const [checkTask, setCheckTask] = useState();
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBtn, setIsBtn] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjcount, setOvProjcount] = useState(0);
  const [allProjectedit, setAllProjectedit] = useState([]);
  const [refCode, setRefCode] = useState("");
  const [refImage, setRefImage] = useState([]);
  const [refDocuments, setrefDocuments] = useState([]);
  const [refLinks, setRefLinks] = useState("");
  const [refDetails, setRefDetails] = useState("");
  const [refCodeEdit, setRefCodeEdit] = useState("");
  const [refImageEdit, setRefImageEdit] = useState([]);
  const [refDocumentsEdit, setrefDocumentsEdit] = useState([]);
  const [refLinksEdit, setRefLinksEdit] = useState("");
  const [refDetailsEdit, setRefDetailsEdit] = useState("");
  const [refCodeView, setRefCodeView] = useState("");
  const [refImageView, setRefImageView] = useState([]);
  const [refDocumentsView, setrefDocumentsView] = useState([]);
  const [refLinksView, setRefLinksView] = useState("");
  const [refDetailsView, setRefDetailsView] = useState("");

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //reference Links
  const handleChangeSummary = (value) => {
    setRefLinks(value);
  };

  const [valueEdit, setValueEdit] = useState("1");

  const handleChangeEdit = (event, newValue) => {
    setValueEdit(newValue);
  };

  //reference Links
  const handleChangeSummaryEdit = (value) => {
    setRefLinksEdit(value);
  };

  const [valueView, setValueView] = useState("1");

  const handleChangeView = (event, newValue) => {
    setValueView(newValue);
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
      setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Project.png");
        });
      });
    }
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    estimateTime: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const username = isUserRoleAccess.username;

  const classes = useStyles();

  // UPLOADIMAGES AND UPLOAD DOCUMENTS HANDLECHANGE FUNCTRION
  const handleInputChange = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
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
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  //Rendering File
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };

  const handleInputChangedocument = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" // Handle ZIP
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setrefDocuments(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];
    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles);
  };

  // UPLOADIMAGES AND UPLOAD DOCUMENTS HANDLECHANGE FUNCTRION edit
  const handleInputChangeEdit = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageEdit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageEdit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  const handleDeleteFileEdit = (index) => {
    const newSelectedFilesedit = [...refImageEdit];
    newSelectedFilesedit.splice(index, 1);
    setRefImageEdit(newSelectedFilesedit);
  };

  const handleInputChangedocumentEdit = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocumentsEdit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" // Handle ZIP
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setrefDocumentsEdit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...refDocumentsEdit];
    newSelectedFiles.splice(index, 1);
    setrefDocumentsEdit(newSelectedFiles);
  };

  // FILEICONPREVIEW CREATE
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
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

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PROJECT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sprojects);

      let ressub = await axios.post(SERVICE.PROJTOSUBPROJCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojecttosub: String(name),
      });
      setCheckSubproj(ressub?.data?.subprojects);
      let resmod = await axios.post(SERVICE.PROJTOMODULEPROJCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojecttomodule: String(name),
      });
      setCheckModule(resmod?.data?.modules);

      let ressubmod = await axios.post(SERVICE.PROJTOSUBMODULEPROJCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojtosubmodule: String(name),
      });
      setCheckSubmodule(ressubmod?.data?.submodules);
      let restask = await axios.post(SERVICE.PROJTOTASKPROJCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojecttotask: String(name),
      });
      setCheckTask(restask?.data?.tasks);

      if ((ressub?.data?.subprojects).length > 0 || (resmod?.data?.modules).length > 0 || (ressubmod?.data?.submodules).length > 0 || (restask?.data?.tasks).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.PROJECT_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllProject();
      handleCloseMod();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let projectscreate = await axios.post(SERVICE.PROJECT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(project.name),
        estimation: String(project.estimation),
        estimationtime: String(project.estimationtime) ? project.estimationtime : "Year",
        refCode: refCode,
        refDetails: refDetails,
        refLinks: refLinks,
        refImage: [...refImage],
        refDocuments: [...refDocuments],
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setProject(projectscreate.data);
      await fetchAllProject();
      setProject({
        name: "",
        estimation: "",
        estimationtime: "Year",
        files: "",
      });
      setValue("1");
      setRefCode("");
      setRefImage([]);
      setrefDocuments([]);
      setRefLinks("");
      setRefDetails("");
      setIsBtn(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = projects.some((item) => item.name.toLowerCase() === project.name.toLowerCase());
    if (project.name === "") {
      setPopupContentMalert("Please Enter Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (project.estimation === "" || project.estimationtime === "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (project.estimation <= 0) {
      setPopupContentMalert("Please Enter a valid Estimation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Project Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setProjectCheck(false);
      sendRequest();
    }
  };
  //cancel for create section
  const handleclear = () => {
    setProject({
      name: "",
      estimation: "",
      estimationtime: "Year",
      files: "",
    });
    setValue("1");
    setRefCode("");
    setRefImage([]);
    setrefDocuments([]);
    setRefLinks("");
    setRefDetails("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setProjid({ name: "", estimation: "", estimationtime: "" });
    setValueEdit("1");
    setRefCodeEdit("");
    setRefImageEdit([]);
    setrefDocumentsEdit([]);
    setRefLinksEdit("");
    setRefDetailsEdit("");
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PROJECT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjid(res?.data?.sprojects);
      setOvProj(name);
      getOverallEditSection(name);
      handleClickOpenEdit();
      setRefCodeEdit(res?.data?.sprojects.refCode);
      setRefImageEdit(res?.data?.sprojects.refImage);
      setrefDocumentsEdit(res?.data?.sprojects.refDocuments);
      setRefLinksEdit(res?.data?.sprojects.refLinks);
      setRefDetailsEdit(res?.data?.sprojects.refDetails);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //change form
  const handleChangephonenumber = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setProject({ ...project, estimation: inputValue });
    }
  };

  const handleChangephonenumberedit = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setProjid({ ...projid, estimation: inputValue });
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PROJECT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjid(res?.data?.sprojects);
      setRefCodeView(res?.data?.sprojects.refCode);
      setRefImageView(res?.data?.sprojects.refImage);
      setrefDocumentsView(res?.data?.sprojects.refDocuments);
      setRefLinksView(res?.data?.sprojects.refLinks);
      setRefDetailsView(res?.data?.sprojects.refDetails);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PROJECT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjid(res?.data?.sprojects);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //Project updateby edit page...
  let updateby = projid.updatedby;
  let addedby = projid.addedby;

  let projectsid = projid._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.PROJECT_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(projid.name),
        estimation: String(projid.estimation),
        estimationtime: String(projid.estimationtime),
        refCode: refCodeEdit,
        refDetails: refDetailsEdit,
        refLinks: refLinksEdit,
        refImage: [...refImageEdit],
        refDocuments: [...refDocumentsEdit],
        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllProject();
      await fetchProjectAll();
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setValueEdit("1");
      setRefCodeEdit("");
      setRefImageEdit([]);
      setrefDocumentsEdit([]);
      setRefLinksEdit("");
      setRefDetailsEdit("");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchProjectAll();
    const isNameMatch = allProjectedit.some((item) => item.name.toLowerCase() === projid.name.toLowerCase());
    if (projid.name === "") {
      setPopupContentMalert("Please Enter Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (projid.estimation === "" || projid.estimationtime === "") {
      setPopupContentMalert("Please Enter Estimation time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (projid.estimation <= 0) {
      setPopupContentMalert("Please Enter a valid Estimation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Project Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (projid.name != ovProj && ovProjcount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_PROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjcount(res?.data?.count);

      setGetOverallCount(`The ${e} is linked in ${res?.data?.subproject?.length > 0 ? "Subpage ," : ""} 
       ${res?.data?.module?.length > 0 ? "module ," : ""}
       ${res?.data?.submodule?.length > 0 ? "submodule ," : ""}
       ${res?.data?.mainpage?.length > 0 ? "mainpage ," : ""}
       ${res?.data?.subpage1?.length > 0 ? "Subpage 1 ," : ""} 
       ${res?.data?.subpage2?.length > 0 ? "Subpage 2 ," : ""} 
       ${res?.data?.subpage3?.length > 0 ? "Subpage 3 " : ""} 
       ${res?.data?.subpage4?.length > 0 ? "Subpage 4 ," : ""}
       ${res?.data?.subpage5?.length > 0 ? "Subpage 5" : ""} whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_PROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.subproject, res?.data?.module, res?.data?.submodule, res?.data?.mainpage, res?.data?.subpage1, res?.data?.subpage2, res?.data?.subpage3, res?.data?.subpage4, res?.data?.subpage5);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (subproj, mod, submod, mainpage, sub1, sub2, sub3, sub4, sub5) => {
    setPageName(!pageName);
    try {
      if (subproj.length > 0) {
        let answ = subproj.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBPROJECT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            project: String(projid.name),
          });
        });
      }
      if (mod.length > 0) {
        let answ = mod.map((d, i) => {
          let res = axios.put(`${SERVICE.MODULE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            project: String(projid.name),
          });
        });
      }
      if (submod.length > 0) {
        let answ = submod.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBMODULE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            project: String(projid.name),
          });
        });
      }

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all project.
  const fetchAllProject = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjectCheck(true);
      setProjects(res_project?.data?.projects);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all project.
  const fetchProjectAll = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllProjectedit(res_project?.data?.projects.filter((item) => item._id !== projid._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = projects?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      estimateTime: item.estimation + " " + item.estimationtime,

    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [projects]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    fetchAllProject();
    fetchProjectAll();
  }, []);

  useEffect(() => {
    fetchProjectAll();
  }, [isEditOpen, projid, project]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "name", headerName: "Project Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "estimateTime", headerName: "Estimation Name", flex: 0, width: 250, hide: !columnVisibility.estimateTime, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eproject") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dproject") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vproject") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iproject") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      estimateTime: item.estimateTime,

    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: "relative", margin: "10px" }}>
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Project",
    pageStyle: "print",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"PROJECT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Project"
        modulename="Projects"
        submodulename="Project"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aproject") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Project</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Project Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Project Name"
                      value={project.name}
                      onChange={(e) => {
                        setProject({ ...project, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Estimation <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={project.estimationtime}
                        onChange={(e) => {
                          setProject({
                            ...project,
                            estimationtime: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select
                        </MenuItem>
                        <MenuItem value="Days"> {"Days"} </MenuItem>
                        <MenuItem value="Month"> {"Month"} </MenuItem>
                        <MenuItem value="Year"> {"Year"} </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput id="component-outlined" type="text" placeholder="Enter Time" value={project.estimation} onChange={(e) => handleChangephonenumber(e)} />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Box
                sx={{
                  width: "100%",
                  height: "max-content",
                  minHeight: "250px",
                  typography: "body1",
                  boxShadow: "0px 0px 2px #808080a3",
                  border: "1px solid #80808057",
                }}
              >
                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBotton: 1,
                      border: "divider",
                      background: "#80808036",
                      height: "47px",
                    }}
                  >
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        backgroundColor: "#c5c1c11c",
                        borderRadius: "4px",
                        boxShadow: "0px 0px 5px #33303070",
                        minHeight: "47px",
                        ".css-can5u7-MuiButtonBase-root-MuiTab-root.Mui-selected": {
                          color: "white",
                          border: "1px solid #b5afaf",
                          background: " #3346569c",
                        },
                        ".css-1aquho2-MuiTabs-indicator": {
                          background: " none",
                        },
                      }}
                    >
                      <Tab label="  Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <FormControl fullWidth>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={8}
                        value={refCode}
                        onChange={(e) => {
                          setRefCode(e.target.value);
                        }}
                      />
                    </FormControl>
                  </TabPanel>
                  <TabPanel value="2">
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstcreate" accept="image/*" multiple onChange={handleInputChange} />
                    <label htmlFor="file-inputuploadcreatefirstcreate">
                      <Button
                        component="span"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#444",
                          minWidth: "40px",
                          boxShadow: "none",
                          borderRadius: "5px",
                          marginTop: "-5px",
                          textTransform: "capitalize",
                          border: "1px solid #0000006b",
                          "&:hover": {
                            "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                              backgroundColor: "#f4f4f4",
                            },
                          },
                        }}
                      >
                        Upload Images &ensp; <CloudUploadIcon />
                      </Button>
                      <br></br>
                    </label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {refImage.map((file, index) => (
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
                                    <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                                  )}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={7}
                                sm={7}
                                xs={7}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">{file.name} </Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                  <VisibilityOutlinedIcon style={{ fontsize: "16px", color: "#357AE8", }} onClick={() => renderFilePreview(file)} />
                                </Button>
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
                                  onClick={() => handleDeleteFile(index)}
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                      fontSize: "14px",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="3">
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstdoccreate" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocument} />
                    <label htmlFor="file-inputuploadcreatefirstdoccreate">
                      <Button
                        component="span"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#444",
                          minWidth: "40px",
                          boxShadow: "none",
                          borderRadius: "5px",
                          marginTop: "-5px",
                          textTransform: "capitalize",
                          border: "1px solid #0000006b",
                          "&:hover": {
                            "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                              backgroundColor: "#f4f4f4",
                            },
                          },
                        }}
                      >
                        Upload Document &ensp; <CloudUploadIcon />
                      </Button>
                    </label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {refDocuments?.map((file, index) => (
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
                                    <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                                  )}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={7}
                                sm={7}
                                xs={7}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">{file.name} </Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                  <VisibilityOutlinedIcon style={{ fontsize: "16px", color: "#357AE8", }} onClick={() => renderFilePreview(file)} />
                                </Button>
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
                                  onClick={() => handleDeleteFileDocument(index)}
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                      fontSize: "14px",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="4">
                    <ReactQuill
                      style={{ height: "100px" }}
                      value={refLinks}
                      onChange={handleChangeSummary}
                      modules={{
                        toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                      }}
                      formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                    />
                  </TabPanel>
                  <TabPanel value="5">
                    <FormControl fullWidth>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={8}
                        value={refDetails}
                        onChange={(e) => {
                          setRefDetails(e.target.value);
                        }}
                      />
                    </FormControl>
                  </TabPanel>
                </TabContext>
              </Box>
              <br />
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isBtn}
                  >
                    SUBMIT
                  </Button>

                </Grid>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <Box sx={userStyle.dialogbox}>
            <DialogContent sx={{ maxWidth: "100%", padding: "20px" }}>
              <>
                <Grid container spacing={2}>
                  <Typography sx={userStyle.HeaderText}>Edit Project</Typography>
                </Grid>
                <br />
                <>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Project Name <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Project Name"
                          value={projid.name}
                          onChange={(e) => {
                            setProjid({ ...projid, name: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <Grid container>
                        <Grid item md={6} xs={12} sm={12}>
                          <Typography>
                            Estimation <b style={{ color: "red" }}>*</b>
                          </Typography>

                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={projid.estimationtime}
                            onChange={(e) => {
                              setProjid({
                                ...projid,
                                estimationtime: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value="" disabled>
                              {" "}
                              Please Select
                            </MenuItem>
                            <MenuItem value="Days"> {"Days"} </MenuItem>
                            <MenuItem value="Month"> {"Month"} </MenuItem>
                            <MenuItem value="Year"> {"Year"} </MenuItem>
                          </Select>
                        </Grid>
                        <br />
                        <Grid item md={6} xs={12} sm={12}>
                          <Typography>
                            Estimation Time <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Enter Time"
                              value={projid.estimation}
                              onChange={(e) => {
                                handleChangephonenumberedit(e);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.SubHeaderText}>Details</Typography>
                    <br></br>

                    <Box
                      sx={{
                        width: "100%",
                        height: "max-content",
                        minHeight: "250px",
                        typography: "body1",
                        boxShadow: "0px 0px 2px #808080a3",
                        border: "1px solid #80808057",
                      }}
                    >
                      <TabContext value={valueEdit}>
                        <Box
                          sx={{
                            borderBotton: 1,
                            border: "divider",
                            background: "#80808036",
                            height: "47px",
                          }}
                        >
                          <TabList
                            onChange={handleChangeEdit}
                            aria-label="lab API tabs example"
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                              backgroundColor: "#c5c1c11c",
                              borderRadius: "4px",
                              boxShadow: "0px 0px 5px #33303070",
                              minHeight: "47px",
                              ".css-can5u7-MuiButtonBase-root-MuiTab-root.Mui-selected": {
                                color: "white",
                                border: "1px solid #b5afaf",
                                background: " #3346569c",
                              },
                              ".css-1aquho2-MuiTabs-indicator": {
                                background: " none",
                              },
                            }}
                          >
                            <Tab label="  Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                            <Tab label="  Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                            <Tab label="  Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                            <Tab label="  Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                            <Tab label="  Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                          </TabList>
                        </Box>
                        <TabPanel value="1">
                          <FormControl fullWidth>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={8}
                              value={refCodeEdit}
                              onChange={(e) => {
                                setRefCodeEdit(e.target.value);
                              }}
                            />
                          </FormControl>
                        </TabPanel>
                        <TabPanel value="2">
                          <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstedit" multiple accept="image/*" onChange={handleInputChangeEdit} />
                          <label htmlFor="file-inputuploadcreatefirstedit">
                            <Button
                              component="span"
                              style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                minWidth: "40px",
                                boxShadow: "none",
                                borderRadius: "5px",
                                marginTop: "-5px",
                                textTransform: "capitalize",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                  },
                                },
                              }}
                            >
                              Upload Images &ensp; <CloudUploadIcon />
                            </Button>
                            <br></br>
                          </label>
                          <Grid container>
                            <Grid item md={12} sm={12} xs={12}>
                              {refImageEdit.map((file, index) => (
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
                                          <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                                        )}
                                      </Box>
                                    </Grid>
                                    <Grid
                                      item
                                      md={7}
                                      sm={7}
                                      xs={7}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography variant="subtitle2">{file.name} </Typography>
                                    </Grid>
                                    <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                        <VisibilityOutlinedIcon style={{ fontsize: "16px", color: "#357AE8", }} onClick={() => renderFilePreview(file)} />
                                      </Button>
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
                                        onClick={() => handleDeleteFileEdit(index)}
                                      >
                                        <FaTrash
                                          style={{
                                            fontSize: "medium",
                                            color: "#a73131",
                                            fontSize: "14px",
                                          }}
                                        />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value="3">
                          <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstdocedit" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocumentEdit} />
                          <label htmlFor="file-inputuploadcreatefirstdocedit">
                            <Button
                              component="span"
                              style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                minWidth: "40px",
                                boxShadow: "none",
                                borderRadius: "5px",
                                marginTop: "-5px",
                                textTransform: "capitalize",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                  },
                                },
                              }}
                            >
                              Upload Document &ensp; <CloudUploadIcon />
                            </Button>
                          </label>
                          <Grid container>
                            <Grid item md={12} sm={12} xs={12}>
                              {refDocumentsEdit?.map((file, index) => (
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
                                          <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                                        )}
                                      </Box>
                                    </Grid>
                                    <Grid
                                      item
                                      md={7}
                                      sm={7}
                                      xs={7}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography variant="subtitle2">{file.name} </Typography>
                                    </Grid>
                                    <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                        <VisibilityOutlinedIcon style={{ fontsize: "16px", color: "#357AE8", }} onClick={() => renderFilePreview(file)} />
                                      </Button>
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
                                        onClick={() => handleDeleteFileDocumentEdit(index)}
                                      >
                                        <FaTrash
                                          style={{
                                            fontSize: "medium",
                                            color: "#a73131",
                                            fontSize: "14px",
                                          }}
                                        />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value="4">
                          <ReactQuill
                            style={{ height: "max-content" }}
                            value={refLinksEdit}
                            onChange={handleChangeSummaryEdit}
                            modules={{
                              toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                            }}
                            formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                          />
                        </TabPanel>
                        <TabPanel value="5">
                          <FormControl fullWidth>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={8}
                              value={refDetailsEdit}
                              onChange={(e) => {
                                setRefDetailsEdit(e.target.value);
                              }}
                            />
                          </FormControl>
                        </TabPanel>
                      </TabContext>
                    </Box>
                  </Grid>

                  <br />


                </>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <Button
                      variant="contained"
                      style={{
                        padding: "7px 13px",
                        color: "white",
                        background: "rgb(25, 118, 210)",
                      }}
                      onClick={editSubmit}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <Button
                      style={{
                        backgroundColor: "#f4f4f4",
                        color: "#444",
                        boxShadow: "none",
                        borderRadius: "3px",
                        padding: "7px 13px",
                        border: "1px solid #0000006b",
                        "&:hover": {
                          "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                            backgroundColor: "#f4f4f4",
                          },
                        },
                      }}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </>
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lproject") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Project List</Typography>
            </Grid>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes("excelproject") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchAllProject()
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvproject") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchAllProject()
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("printproject") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfproject") && (
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                        fetchAllProject()
                      }}
                    ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imageproject") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                )}
              </Grid>
            </Grid>
            <br />
            {/* ****** Table Grid Container ****** */}
            <Grid style={userStyle.dataTablestyle}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeSelect"
                  value={pageSize}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChange}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  {/* <MenuItem value={projects?.length}>All</MenuItem> */}
                </Select>
              </Box>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                </FormControl>
              </Box>
            </Grid>
            {/* ****** Table start ****** */}
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <br />
            <br />
            <>
              {!projectCheck ? (
                <Box sx={userStyle.container}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "350px",
                    }}
                  >
                    <ThreeDots height="auto" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                  </Box>
                </Box>
              ) : (
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
              )}
            </>

            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
              </Box>
              <Box>
                <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                  <FirstPageIcon />
                </Button>
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                  <NavigateBeforeIcon />
                </Button>
                {pageNumbers?.map((pageNumber) => (
                  <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePage < totalPages && <span>...</span>}
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                  <NavigateNextIcon />
                </Button>
                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                  <LastPageIcon />
                </Button>
              </Box>
            </Box>

            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Project</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Project Name</Typography>
                  <Typography>{projid.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Estimation Time</Typography>
                  <Typography>{projid.estimation + " " + projid.estimationtime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "max-content",
                    minHeight: "250px",
                    typography: "body1",
                    boxShadow: "0px 0px 2px #808080a3",
                    border: "1px solid #80808057",
                  }}
                >
                  <TabContext value={valueView}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        background: "#80808036",
                        height: "55px",
                      }}
                    >
                      <TabList onChange={handleChangeView} aria-label="lab API tabs example" variant="scrollable" scrollButtons="auto">
                        <Tab label="  Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "55px" }} />
                        <Tab label="  Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "55px" }} />
                        <Tab label="  Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "55px" }} />
                        <Tab label="  Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "55px" }} />
                        <Tab label="  Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "55px" }} />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <FormControl fullWidth>
                        <TextareaAutosize aria-label="minimum height" minRows={8} value={refCodeView} readOnly />
                      </FormControl>
                    </TabPanel>
                    <TabPanel value="2">
                      <Grid container>
                        <Grid item md={12} sm={12} xs={12}>
                          {refImageView.map((file, index) => (
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
                                      <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                                    )}
                                  </Box>
                                </Grid>
                                <Grid
                                  item
                                  md={7}
                                  sm={7}
                                  xs={7}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="subtitle2">{file.name} </Typography>
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                    <VisibilityOutlinedIcon style={{ fontsize: "16px", color: "#357AE8", }} onClick={() => renderFilePreview(file)} />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="3">
                      <Grid container>
                        <Grid item md={12} sm={12} xs={12}>
                          {refDocumentsView?.map((file, index) => (
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
                                      <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                                    )}
                                  </Box>
                                </Grid>
                                <Grid
                                  item
                                  md={7}
                                  sm={7}
                                  xs={7}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="subtitle2">{file.name} </Typography>
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
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
                                    <VisibilityOutlinedIcon style={{ fontsize: "16px", color: "#357AE8", }} onClick={() => renderFilePreview(file)} />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="4">
                      <ReactQuill
                        style={{ height: "max-content" }}
                        value={refLinksView}
                        readOnly
                        modules={{
                          toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                        }}
                        formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                      />
                    </TabPanel>
                    <TabPanel value="5">
                      <FormControl fullWidth>
                        <TextareaAutosize readOnly aria-label="minimum height" minRows={8} value={refDetailsView} />
                      </FormControl>
                    </TabPanel>
                  </TabContext>
                </Box>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
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

      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  {checkSubproj?.length > 0 && checkModule?.length > 0 && checkSubmodule?.length > 0 && checkTask?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteproject.name} `}</span>
                      was linked in <span style={{ fontWeight: "700" }}>Subproject, Module, Submodule & Task </span>
                    </>
                  ) : checkSubproj?.length > 0 || checkModule?.length > 0 || checkSubmodule?.length > 0 || checkTask?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteproject.name} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>
                        {checkSubproj?.length ? " Subproject" : ""}
                        {checkModule?.length ? " Module" : ""}
                        {checkSubmodule?.length ? " Submodule" : ""}
                        {checkTask?.length ? " Task" : ""}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
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
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={"Project"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Project Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProject}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}

    </Box>
  );
}

export default Project;