import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, TextareaAutosize, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import StyledDataGrid from "../../components/TableStyle";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import Selects from "react-select";
import "jspdf-autotable";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import CodeIcon from "@mui/icons-material/Code";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
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

function Module() {

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

  let exportColumnNames = ['Project', 'Subproject', 'Module', 'Estimation Time'];
  let exportRowValues = ['project', 'subproject', 'name', 'estimateTime'];

  const gridRef = useRef(null);
  const [module, setModule] = useState({
    project: "Please Select Project",
    subproject: "Please Select SubProject",
    name: "",
    estimation: "",
    estimationtime: "",
  });
  const [moduleid, setModuleid] = useState({
    project: "Please Select Project",
    subproject: "Please Select SubProject",
    name: "",
    estimation: "",
    estimationtime: "",
  });
  const [modules, setModules] = useState([]);
  const [getrowid, setRowGetid] = useState("");
  const [subProjectEdit, setSubProjectEdit] = useState([]);
  const [subproject, setSubProject] = useState([]);
  const [project, setProject] = useState([]);
  const [rowEditTime, setRowEditTime] = useState("");
  const [rowEditTimeProj, setRowEditTimeProj] = useState("");
  const [editTimeCalculation, setEditTimeCalculation] = useState("");
  const [editCalOverall, setEditCalOverall] = useState("");
  const [getEstitype, setGetEstiType] = useState("");
  const [conditionTiming, setConditionTiming] = useState("");
  const [timeDiffCal, setTimeDiffCal] = useState("");
  const [timeCalculation, setTimeCalculation] = useState("");
  const [typeEst, setTypeEst] = useState("");
  const [editProjDropdwon, setEditProjDropdown] = useState("");
  const [editProjDropdownproj, setEditProjDropdownproj] = useState("");
  const [subProjectEditList, setSubProjectEditList] = useState([]);
  const [modulecheck, setmodulecheck] = useState(false);
  const [isBtn, setIsBtn] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Please Select Project");
  const [selectedSubproject, setSelectedSubproject] = useState("Please Select SubProject");
  const { isUserRoleCompare, isUserRoleAccess, pageName,setPageName  } = useContext(UserRoleAccessContext);
  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [allModuleedit, setAllModuleedit] = useState([]);
  const [selectedProjectedit, setSelectedProjectedit] = useState("Please Select Project");
  const [selectedSubprojectedit, setSelectedSubprojectedit] = useState("Please Select SubProject");

  const username = isUserRoleAccess.username;

  // selects field status
  const handleProjectChange = (e) => {
    const selectedProject = e.value;
    setSelectedProject(selectedProject);
    setSelectedSubproject("Please Select SubProject");
    setModule({ ...module, estimation: "", estimationtime: "" });
  };

  const [filteredCategoriesEdit, setFilteredCategoriesEdit] = useState([]);
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Module.png");
        });
      });
    }
  };

  const classes = useStyles();

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
    project: true,
    subproject: true,
    name: true,
    estimateTime: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

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


  useEffect(() => {
    // Filter categories based on the selected project and vendors
    const filteredCategoriesedit = subproject
      ?.filter((subpro) => subpro.project === selectedProjectedit)
      .map((subpro) => ({
        ...subpro,
        label: subpro.name,
        value: subpro.name,
      }));

    setFilteredCategoriesEdit(filteredCategoriesedit);
  }, [selectedProjectedit, selectedSubprojectedit]);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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

  // view model
  const [openview, setOpenview] = useState(false);

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
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //set function to get particular row
  const [deletemodule, setDeletemodule] = useState({});

  const handleChangeEstimation = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      // Function to check if the input is a valid number (including decimals)
      function isValidNumber(input) {
        return !isNaN(parseFloat(input)) && isFinite(input);
      }
      setModule({
        ...module,
        estimation: isValidNumber(inputValue) && parseFloat(inputValue) <= typeEst ? parseFloat(inputValue) : 0,
      });
    }
  };

  const handleChangeEstimationedit = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      // setSubprojid({ ...projid, estimation: inputValue });
      setModuleid({
        ...moduleid,
        estimation: Number(inputValue) > Number(conditionTiming) ? 0 : Number(inputValue),
      });
    }
  };

  const [checkSubmodule, setCheckSubmodule] = useState();
  const [checkTask, setCheckTask] = useState();

  const rowData = async (id, name, project, subproject) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MODULE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletemodule(res?.data?.smodule);
      let ressubmod = await axios.post(SERVICE.MODULETOSUBMODULEMODULECHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkmoduletosubmodule: String(name),
        project: String(project),
        subproject: String(subproject),
      });
      setCheckSubmodule(ressubmod?.data?.submodules);
      let restask = await axios.post(SERVICE.MODULETOTASKMODULECHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkmodulettotask: String(name),
        project: String(project),
        subproject: String(subproject),
      });
      setCheckTask(restask?.data?.tasks);
      if ((ressubmod?.data?.submodules).length > 0 || (restask?.data?.tasks).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.projects.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProject(projall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub-Project for Dropdowns
  const fetch_Sub_ProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let subPro = await axios.get(SERVICE.SUBPROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const subprojall = [
        ...subPro?.data?.subprojects.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setSubProject(subprojall);
      setSubProjectEditList(subPro.data.subprojects);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    if (subproject.length == 0) {
      setsubprojectnone("None");
    } else {
      setsubprojectnone("Show");
    }
  }, [subproject, project]);

  const [subprojectnone, setsubprojectnone] = useState("");

  //fetching sub-Project Dropdowns
  const fetchProjectnames = async () => {
    setPageName(!pageName);
    try {
      let subPro = await axios.get(SERVICE.SUBPROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubProject(subPro?.data?.subprojects);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [getprojectname, setgetprojectname] = useState("");

  const fetchProjectnamesedit = async () => {
    setPageName(!pageName);
    let projectname = getprojectname ? getprojectname : moduleid.project;
    try {
      let subPro = await axios.get(SERVICE.SUBPROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let subProDrop =
        subPro.data.subprojects.length > 0 &&
        subPro.data.subprojects.filter((data) => {
          if (projectname == data.project) return data;
        });
      setSubProjectEdit(subProDrop);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let modulesid = deletemodule._id;
  const delModule = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.MODULE_SINGLE}/${modulesid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllModule();
      setPage(1);
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //checking whether the subprojectData is linked with task or not in create
  const [relatedCount, setRelatedCount] = useState(0);
  const errorPopupFunc = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.MODULETASKCHECK}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(e),
      });
      setRelatedCount(res.data.count);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function...
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let modules = await axios.post(SERVICE.MODULE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        subproject: String(selectedSubproject),
        name: String(module.name),
        estimation: String(module.estimation),
        estimationtime: String(module.estimationtime),
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

      await fetchAllModule();
      setTypeEst("");
      setModule({ ...module, name: "", estimation: "", estimationtime: "" });
      setValue("1");
      setRefCode("");
      setRefImage([]);
      setrefDocuments([]);
      setRefLinks("");
      setRefDetails("");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = modules.some((item) => item.name?.toLowerCase() === module.name?.toLowerCase() && item.project === selectedProject && item.subproject === selectedSubproject);
    if (selectedProject === "" || selectedProject == "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedSubproject === "" || selectedSubproject == "Please Select SubProject") {
      setPopupContentMalert("Please Select Sub Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (module.name === "") {
      setPopupContentMalert("Please Enter Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (module.estimationtime == "") {
      setPopupContentMalert("Please Select Estimation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (module.estimation == "" || module.estimationtime == "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if ((module.estimation <= 0) || (typeEst < module.estimation)) {
      setPopupContentMalert("Please Enter a valid Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (relatedCount > 0) {
      setPopupContentMalert("This Data is already linked with Task");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Module Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //cancel for create section
  const handleclear = () => {
    setTypeEst("");
    setSelectedProject("Please Select Project");
    setSelectedSubproject("Please Select SubProject");
    setModule({ name: "", estimation: "", estimationtime: "" });
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setValueEdit("1");
    setRefCodeEdit("");
    setRefImageEdit([]);
    setrefDocumentsEdit([]);
    setRefLinksEdit("");
    setRefDetailsEdit("");
  };

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  //get single row to edit....
  const getCode = async (e, name, project, subproject) => {
    setPageName(!pageName);
    try {
      setRowGetid(e);
      let res = await axios.get(`${SERVICE.MODULE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModuleid(res?.data?.smodule);
      setRowGetid(res?.data?.smodule);
      setRowEditTime(res?.data?.smodule);
      setOvProj(res?.data?.smodule?.name);
      getOverallEditSection(res?.data?.smodule?.name);
      setSelectedProjectedit(res?.data?.smodule?.project);
      setSelectedSubprojectedit(res?.data?.smodule?.subproject);
      errorPopupFuncEdit(name, project, subproject);
      setRefCodeEdit(res?.data?.smodule.refCode);
      setRefImageEdit(res?.data?.smodule.refImage);
      setrefDocumentsEdit(res?.data?.smodule.refDocuments);
      setRefLinksEdit(res?.data?.smodule.refLinks);
      setRefDetailsEdit(res?.data?.smodule.refDetails);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MODULE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModuleid(res?.data?.smodule);
      setRefCodeView(res?.data?.smodule.refCode);
      setRefImageView(res?.data?.smodule.refImage);
      setrefDocumentsView(res?.data?.smodule.refDocuments);
      setRefLinksView(res?.data?.smodule.refLinks);
      setRefDetailsView(res?.data?.smodule.refDetails);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MODULE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModuleid(res?.data?.smodule);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //Module updateby edit page...
  let updateby = moduleid?.updatedby;
  let addedby = moduleid?.addedby;
  let moduletsid = moduleid?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.MODULE_SINGLE}/${moduletsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProjectedit),
        subproject: String(selectedSubprojectedit),
        name: String(moduleid.name),
        estimation: String(moduleid.estimation),
        estimationtime: String(moduleid.estimationtime),
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
      handleCloseModEdit();
      await fetchAllModule();
      await fetchModuleAll();
      await getOverallEditSectionUpdate();
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

  //checking whether the subprojectData is linked with task or not in edit
  const [relatedCountEdit, setRelatedCountEdit] = useState(0);
  const errorPopupFuncEdit = async (e, project, subproject) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.MODULETASKCHECKEDIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(e),
        project: String(project),
        subproject: String(subproject),
      });
      setRelatedCountEdit(res.data.count);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchModuleAll();
    // const isNameMatch = allModuleedit.some(item => item.name.toLowerCase() === (moduleid.name).toLowerCase());
    const isNameMatch = allModuleedit.some((item) => item.name.toLowerCase() === moduleid.name.toLowerCase() && item.project === selectedProjectedit && item.subproject === selectedSubprojectedit);
    if (selectedProjectedit === "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedSubprojectedit === "" || selectedSubprojectedit === "Please Select Subproject" || selectedSubprojectedit === "Please Select SubProject") {
      setPopupContentMalert("Please Select Sub Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (moduleid.name === "") {
      setPopupContentMalert("Please Enter Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (moduleid.estimationtime == "") {
      setPopupContentMalert("Please Select Estimation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (moduleid.estimation == "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if ((moduleid.estimation <= 0) || (editCalOverall < moduleid.estimation)) {
      setPopupContentMalert("Please Enter a valid Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      // else if ((Number(moduleid.estimation) <= 0) || (Number(editCalOverall) < Number(moduleid.estimation))) {
      //   setPopupContentMalert("Please Enter a valid Estimation Time");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
    } else if (relatedCountEdit > 0) {
      setPopupContentMalert("This Data is already linked with Task");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Module Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (moduleid.name != ovProj && ovProjCount > 0) {
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
      let res = await axios.post(SERVICE.OVERALL_MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in 
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
      let res = await axios.post(SERVICE.OVERALL_MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res.data.submodule, res.data.mainpage, res.data.subpage1, res.data.subpage2, res.data.subpage3, res.data.subpage4, res.data.subpage5, res.data.task);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (submod, mainpage, sub1, sub2, sub3, sub4, sub5, task) => {
    setPageName(!pageName);
    try {
      if (submod.length > 0) {
        let answ = submod.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBMODULE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (mainpage.length > 0) {
        let answ = mainpage.map((d, i) => {
          let res = axios.put(`${SERVICE.MAINPAGE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (sub1.length > 0) {
        let answ = sub1.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBPAGEONE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (sub2.length > 0) {
        let answ = sub2.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBPAGETWO_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (sub3.length > 0) {
        let answ = sub3.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBPAGETHREE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (sub4.length > 0) {
        let answ = sub4.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBPAGEFOUR_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (sub5.length > 0) {
        let answ = sub5.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBPAGETWO_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
      if (task.length > 0) {
        let answ = task.map((d, i) => {
          let res = axios.put(`${SERVICE.TASK_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            module: String(moduleid.name),
          });
        });
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all modules.
  const fetchAllModule = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setmodulecheck(true);
      setModules(res_module?.data?.modules);
    } catch (err) { setmodulecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all modules.
  const fetchModuleAll = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllModuleedit(res_module?.data?.modules.filter((item) => item._id !== moduleid._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let difference = [];
  let ans = 0;
  let timeDiffsCreate = 0;

  //calculate time difference between the choosed projects
  const fetchTimeDiffCal = async () => {
    setPageName(!pageName);
    try {
      let sub_proj_time = modules.filter((data) => {
        if (selectedSubproject === data.subproject && selectedProject === data.project) {
          if (data.estimationtime === "Month") {
            difference.push((Number(data.estimation) / 12) * 365);
          } else if (data.estimationtime === "Year") {
            difference.push(Number(data.estimation) * 365);
          } else if (data.estimationtime === "Days") {
            difference.push(Number(data.estimation));
          }
          ans = difference.reduce((acc, cur) => acc + cur);
          setTimeCalculation(ans);
        }
      });

      let project_check = subProjectEditList.map((value) => {
        if (selectedSubproject === value.name && selectedProject === value.project) {
          if (value.estimationtime === "Month") {
            timeDiffsCreate = (Number(value.estimation) / 12) * 365;
            setTimeDiffCal(timeDiffsCreate);
          } else if (value.estimationtime === "Year") {
            timeDiffsCreate = Number(value.estimation) * 365;
            setTimeDiffCal(timeDiffsCreate);
          } else if (value.estimationtime === "Days") {
            setTimeDiffCal(Number(value.estimation));
          }
        }
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchCalculRemaining = async (estType) => {
    if (estType === "Month") {
      setTypeEst(((timeDiffCal - timeCalculation) / 30).toFixed(2));
    } else if (estType === "Year") {
      setTypeEst(((timeDiffCal - timeCalculation) / 365).toFixed(2));
    } else if (estType === "Days") {
      setTypeEst((timeDiffCal - timeCalculation).toFixed(2));
    }
  };

  let differenceEdit = [];
  let ansEdit = 0;
  let timeDiffs = 0;

  //Edit Page Functionality for Estimation Time
  const fetchEditEstTime = async () => {
    setPageName(!pageName);
    try {
      let project = editProjDropdwon ? editProjDropdwon : rowEditTime.project;
      let sub_Project = editProjDropdownproj ? editProjDropdownproj : rowEditTime.subproject;

      let sub_proj_time = modules.filter((data) => {
        if (sub_Project === data.subproject && project === data.project) {
          if (data.estimationtime === "Month") {
            differenceEdit.push((Number(data.estimation) / 12) * 365);
          } else if (data.estimationtime === "Year") {
            differenceEdit.push(Number(data.estimation) * 365);
          } else if (data.estimationtime === "Days") {
            differenceEdit.push(Number(data.estimation));
          }
          ansEdit = differenceEdit.reduce((acc, cur) => acc + cur);
          setEditTimeCalculation(ansEdit);
        }
        // else if (sub_Project != data.subproject) {
        //   setEditTimeCalculation(0);
        // }
      });

      let project_check = subProjectEditList.map((value) => {
        if (sub_Project === value.name && project === value.project) {
          if (value.estimationtime === "Month") {
            timeDiffs = (Number(value.estimation) / 12) * 365;
            setRowEditTimeProj(timeDiffs);
          } else if (value.estimationtime === "Year") {
            timeDiffs = Number(value.estimation) * 365;
            setRowEditTimeProj(timeDiffs);
          } else if (value.estimationtime === "Days") {
            setRowEditTimeProj(Number(value.estimation));
          }
        }
        // else if(sub_Project != value.name ) {
        //   setRowEditTimeProj(0);
        // }
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchEditEstimationType = async () => {
    let estimatType = getEstitype ? getEstitype : rowEditTime.estimationtime;
    if (rowEditTime.estimationtime === "Month") {
      if (estimatType === "Month") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 30).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 30);
        setEditCalOverall(remaining[0] + " months ");
      } else if (estimatType === "Days") {
        let remaining = (rowEditTimeProj - editTimeCalculation).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) * 30 + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) / 12 + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining[0] + " year " + " Remaining");
      }
    } else if (rowEditTime.estimationtime === "Days") {
      if (estimatType === "Month") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 30).toFixed(2).toString().split(".");
        let rem = ((rowEditTimeProj - editTimeCalculation) % 30).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) / 30 + (rowEditTimeProj - editTimeCalculation) / 30);
        setEditCalOverall(remaining[0] + " months " + rem[0] + " days Remaining");
      } else if (estimatType === "Days") {
        let remaining = (rowEditTimeProj - editTimeCalculation).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining + " years Remaining");
      }
    } else if (rowEditTime.estimationtime === "Year") {
      if (estimatType === "Month") {
        let remaining = (((rowEditTimeProj - editTimeCalculation) / 365) * 12).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) * 12 + ((rowEditTimeProj - editTimeCalculation) / 365) * 12);
        setEditCalOverall(remaining[0] + " Months Remaining");
      } else if (estimatType === "Days") {
        let remaining = ((rowEditTimeProj - editTimeCalculation)).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) * 365 + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining + " years Remaining");
      }
    }
  };

  const modifiedData = modules.map((person) => ({
    ...person,
    estimateTime: person.estimation + " " + person.estimationtime,
  }));

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchProjectnamesedit();
  }, [isEditOpen]);

  useEffect(() => {
    fetchTimeDiffCal();
    fetchEditEstTime();
    fetchCalculRemaining();
    fetchEditEstimationType();
  }, [modifiedData]);


  useEffect(() => {
    fetchEditEstimationType();
  }, [getEstitype, modifiedData]);

  useEffect(() => {
    fetchAllModule();
    fetchModuleAll();
    fetchProjectnames();
    fetch_Sub_ProjectDropdowns();
    fetchProjectDropdowns();
  }, []);

  useEffect(() => {
    fetchModuleAll();
    fetchProjectnames();
    fetch_Sub_ProjectDropdowns();
  }, [isEditOpen, moduleid, module]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = modules?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      estimateTime: item.estimation + " " + item.estimationtime,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [modules]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

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
    { field: "project", headerName: "Project Name", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "subproject", headerName: "Subproject Name", flex: 0, width: 200, hide: !columnVisibility.subproject, headerClassName: "bold-header" },
    { field: "name", headerName: "Module Name", flex: 0, width: 200, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "estimateTime", headerName: "Estimation Time", flex: 0, width: 200, hide: !columnVisibility.estimateTime, headerClassName: "bold-header" },
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
          {isUserRoleCompare?.includes("emodule") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id, params.row.name, params.row.project, params.row.subproject);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmodule") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name, params.row.project, params.row.subproject);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmodule") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imodule") && (
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
      project: item.project,
      subproject: item.subproject,
      name: item.name,
      estimateTime: item.estimation + " " + item.estimationtime,
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
    documentTitle: "Module",
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
      <Headtitle title={"MODULE"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Module"
        modulename="Projects"
        submodulename="Module"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("amodule") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Module</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects options={project} styles={colourStyles} value={{ label: selectedProject, value: selectedProject }} onChange={handleProjectChange} />
                  </FormControl>
                </Grid>
                {/* { subprojectnone == "None" ? null :           */}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub Project <b style={{ color: "red" }}>*</b>
                  </Typography>

                  <FormControl size="small" fullWidth>
                    <Selects
                      options={subproject
                        ?.filter((subpro) => subpro.project === selectedProject)
                        ?.map((subpro) => ({
                          ...subpro,
                          label: subpro.name,
                          value: subpro.name,
                        }))}
                      styles={colourStyles}
                      value={{
                        label: selectedSubproject,
                        value: selectedSubproject,
                      }}
                      onChange={(e) => setSelectedSubproject(e.value)}
                    />
                  </FormControl>
                </Grid>
                {/* } */}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Module Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Module Name"
                      value={module.name}
                      onChange={(e) => {
                        setModule({ ...module, name: e.target.value });
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
                        value={module.estimationtime}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setModule({
                            ...module,
                            estimationtime: e.target.value,
                          });
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select
                        </MenuItem>
                        <MenuItem value="Days" onClick={() => fetchCalculRemaining("Days")}>
                          {" "}
                          {"Days"}{" "}
                        </MenuItem>
                        <MenuItem value="Month" onClick={() => fetchCalculRemaining("Month")}>
                          {" "}
                          {"Month"}{" "}
                        </MenuItem>
                        <MenuItem value="Year" onClick={() => fetchCalculRemaining("Year")}>
                          {" "}
                          {"Year"}{" "}
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput id="component-outlined" type="text" value={module.estimation} onChange={(e) => handleChangeEstimation(e)} />
                      </FormControl>
                      {module.estimationtime != "" ? (
                        <>
                          {" "}
                          <Typography sx={{ color: "red" }}>
                            {typeEst} {module.estimationtime} is Remaining
                          </Typography>
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
                    <input className={classes.inputs} type="file" id="file-inputuploadcreatefirstdocreate" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocument} />
                    <label htmlFor="file-inputuploadcreatefirstdocreate">
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
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
        {/* edit model */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <Box sx={{ padding: "20px 25px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>Edit Module</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Project <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={project}
                      styles={colourStyles}
                      value={{
                        label: selectedProjectedit,
                        value: selectedProjectedit,
                      }}
                      onChange={(e) => {
                        setSelectedProjectedit(e.value);
                        setSelectedSubprojectedit("Please Select SubProject");
                        setEditProjDropdown(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Subproject <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={filteredCategoriesEdit}
                      styles={colourStyles}
                      value={{
                        label: selectedSubprojectedit,
                        value: selectedSubprojectedit,
                      }}
                      onChange={(e) => {
                        setSelectedSubprojectedit(e.value);
                        setEditProjDropdownproj(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={moduleid.name}
                      onChange={(e) => {
                        setModuleid({ ...moduleid, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={6} sm={6}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Estimation <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={moduleid.estimationtime}
                        onChange={(e) => {
                          setModuleid({
                            ...moduleid,
                            estimationtime: e.target.value,
                            estimation: 0
                          });
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select
                        </MenuItem>
                        <MenuItem value="Days" onClick={() => setGetEstiType("Days")}>
                          {" "}
                          {"Days"}{" "}
                        </MenuItem>
                        <MenuItem value="Month" onClick={() => setGetEstiType("Month")}>
                          {" "}
                          {"Month"}{" "}
                        </MenuItem>
                        <MenuItem value="Year" onClick={() => setGetEstiType("Year")}>
                          {" "}
                          {"Year"}
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Estimation Time <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          size="small"
                          value={moduleid.estimation}
                          // onChange={(e) => { setModuleid({ ...moduleid, estimation: Number(e.target.value) > Number(conditionTiming) ? " " : Number(e.target.value) }) }}
                          onChange={(e) => handleChangeEstimationedit(e)}
                        />
                      </FormControl>
                    </Grid>
                    <Typography sx={{ color: "red" }}> {editCalOverall}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
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
                          style={{ height: "200px" }}
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
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmodule") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/*       
          <Box sx={userStyle.container} > */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Module List</Typography>
            </Grid>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes("excelmodule") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchAllModule()
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvmodule") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchAllModule()
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("printmodule") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfmodule") && (
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                        fetchAllModule()
                      }}
                    ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imagemodule") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                )}
              </Grid>
            </Grid>
            <br />
            {!modulecheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label>Show entries:</label>
                    <Select id="pageSizeSelect" defaultValue="" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={modules.length}>All</MenuItem> */}
                    </Select>
                  </Box>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                    </FormControl>
                  </Box>
                </Grid>
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
                {/* ****** Table Grid Container ****** */}
                {/* ****** Table start ****** */}
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
              </>
            )}
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
      {/* Delete Modal */}
      <Box>

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
                    {checkSubmodule?.length > 0 && checkTask?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletemodule.name} `}</span>
                        was linked in <span style={{ fontWeight: "700" }}>Submodule & Task </span>
                      </>
                    ) : checkSubmodule?.length > 0 || checkTask?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletemodule.name} `}</span>
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>
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

      </Box>
      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <Box sx={{ padding: "20px 30px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Module</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Project Name</Typography>
                  <Typography>{moduleid.project}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subproject Name</Typography>
                  <Typography>{moduleid.subproject}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Module Name</Typography>
                  <Typography>{moduleid.name}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <Typography variant="h6">Estimation Time</Typography>
                <FormControl fullWidth size="small">
                  <Typography>{moduleid.estimation + "  " + moduleid.estimationtime}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
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
                              <Grid item md={2} sm={2} xs={2}></Grid>
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
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
        filename={"Module"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Module Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delModule}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}

    </Box>
  );
}

export default Module;