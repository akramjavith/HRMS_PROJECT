import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, TableRow, TableCell, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, FormControl, Paper, Table, TableHead, TableContainer, Button, TableBody, TextareaAutosize, List, ListItem, ListItemText, Popover, TextField, IconButton, Checkbox, DialogTitle } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import StyledDataGrid from "../../../components/TableStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
// import Taskeditmodel from "./taskeditmodel";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import Selects from "react-select";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import PageHeading from "../../../components/PageHeading";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { makeStyles } from "@material-ui/core";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from "file-saver";

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
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function Raiseissue() {
  const classes = useStyles();

  const { isUserRoleCompare, isUserRoleAccess, pageName,setPageName, } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Raiseissue.png');
        });
      });
    }
  };


  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [textSumm, setTextSummary] = useState("");
  const [textSummedit, setTextSummaryedit] = useState("");

  const [raise, setRaise] = useState([]);

  const [submoduleedit, setSubmoduleedit] = useState({
    project: "",
    subproject: "",
    module: "",
    submodule: "",
    pagetypename: "",
    mainpage: "",
    subpage: "",
    name: "",
  });

  const handleChangeSummary = (value) => {
    setTextSummary(value);
  };

  const handleClickOpenalert = () => {
    setIsErrorOpen(true);
  };
  const handleClosealert = () => {
    setIsErrorOpen(false);
  };

  //get all project.
  const fetchRaise = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.RAISEISSUE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRaise(res_project?.data?.raiseissue);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [completedtask, setCompletedTask] = useState([]);

  //get all project.
  const fetchTaskcompleted = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.ALLTASKCOMPLETED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompletedTask(res_project?.data?.completedtask);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchTaskcompleted();
  }, []);

  //upload image

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  const [file, setFile] = useState();

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };

  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
    setGetImg("");
  };

  //add webcamera popup
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
    setFile("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  //first allexcel....
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

  //reference images
  const handleInputChange = (event) => {
    // setRefImageDrag([])
    // setCapturedImages([])

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
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Images!"}</p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };

  //first deletefile
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
    setFile("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  // Drag and drop image upload
  const handleDragOver = (event) => {
    event.preventDefault();
    // setRefImage([]);
    // setCapturedImages([])
  };

  const handleDrop = (event) => {
    event.preventDefault();

    // setRefImage([]);
    // setCapturedImages([])

    previewFile(event.dataTransfer.files[0]);

    // Use dataTransfer property to access the dropped files
    const files = event.dataTransfer.files;

    // Now, you can handle the dropped files
    let newSelectedFilesDrag = [...refImageDrag];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDrag(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Images!"}</p>
          </>
        );
        handleClickOpenalert();
      }
    }
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
    // setPreviewURL(newSelectedFiles);
  };

  let authToken = localStorage.APIToken;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Delete model

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  //remarkList Open close state
  const [addRaise, setaddRaise] = useState(false);
  const handleraiseOpen = (id, remark) => {
    setaddRaise(true);
  };
  const handleRaiseClose = (reason) => {
    if (reason && reason === "backdropClick") return;
    setaddRaise(false);
  };

  const [addRaiseedit, setaddRaiseedit] = useState(false);
  const handleraiseOpenedit = (id, remark) => {
    setaddRaiseedit(true);
  };
  const handleRaiseCloseedit = (reason) => {
    if (reason && reason === "backdropClick") return;
    setaddRaiseedit(false);
  };

  const { auth } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectModels, setProjectModels] = useState([]);
  const [submoduleEnd, setSubmoduleEnd] = useState([]);
  const [endMerge, setEndmerge] = useState([]);
  const [pagetypename, setPagetypename] = useState([]);
  const [pagetype, setPagetype] = useState([]);

  const [priorities, setPriorities] = useState([]);
  const [raiseissue, setRaiseissue] = useState({
    project: "",
    subproject: "",
    module: "",
    submodule: "",
    pagetypename: "",
    mainpage: "",
    issuedate: today,
    priority: "Please Select Priority",
    title: "",
    description: "",
    status: "open",
    ticketno: "",
    subpage: "",
    name: "",
    raiseissueadded: "added",
    addedby: "",
    updatedby: "",
  });

  const [raiseissueedit, setRaiseissueedit] = useState({
    project: "",
    subproject: "",
    module: "",
    submodule: "",
    pagetypename: "",
    mainpage: "",
    subpage: "",
    name: "",
    status: "open",
    ticketno: "",
    issuedate: today,
    priority: "Please Select Priority",
    title: "",
    description: "",
  });

  const [taskdeletepagename, setTaskDeletepagename] = useState();
  const [taskdeletepageid, setTaskdeletepageid] = useState();
  const [pageModelEdit, setPageModelEdit] = useState({ name: "", project: "", subproject: "", module: "" });

  // endpage show on the list
  const [dataItems, setDataItems] = useState([{ pageBranch: "EndPage" }, { pageBranch: "NotEndPage" }]);

  const filteredDataend = projectModels.filter((row) => row.pageBranch === "EndPage");
  {
    filteredDataend.map((row) => <li>{row.pageBranch}</li>);
  }

  let taskcompleted = (submoduleedit.project == "" ? "" : submoduleedit.project) + (submoduleedit.subproject == "" ? "" : "_" + submoduleedit.subproject) + (submoduleedit.module == "" ? "" : "_" + submoduleedit.module) + (submoduleedit.submodule == "" ? "" : "_" + submoduleedit.submodule) + (submoduleedit.pagetypename == "" ? "" : "_" + submoduleedit.pagetypename) + (submoduleedit.mainpage == "" ? "" : "_" + submoduleedit.mainpage) + (submoduleedit.name == "" ? "" : "_" + submoduleedit.name);

  let concatecreate = (submoduleedit.project == "" ? "" : submoduleedit.project) + (submoduleedit.subproject == "" ? "" : "_" + submoduleedit.subproject) + (submoduleedit.module == "" ? "" : "_" + submoduleedit.module) + (submoduleedit.submodule == "" ? "" : "_" + submoduleedit.submodule) + (submoduleedit.pagetypename == "" ? "" : "_" + submoduleedit.pagetypename) + (submoduleedit.mainpage == "" ? "" : "_" + submoduleedit.mainpage) + (submoduleedit.name == "" ? "" : "_" + submoduleedit.name);

  let newval = concatecreate + " _" + "0001";

  const [deletePageData, setDeletePageData] = useState([]);
  const [deletePageName, setDeletePageName] = useState([]);

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      setDeletePageName(name);
      if (name === "submodule") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        handleClickOpen();
        setDeletePageData(res?.data?.ssubmodule);
      } else {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        handleClickOpen();
        setDeletePageData(res?.data?.spagemodel);
      }
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.PAGEMODEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const idFind = res?.data?.pagemodel?.some((item) => item._id == getid);

      if (idFind === true) {
        let res = await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${getid}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          raiseissueadded: "added",
        });
      } else if (idFind === false) {
        let res = await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${getid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          raiseissueadded: "added",
        });
      }

      let raisecreate = await axios.post(SERVICE.RAISEISSUE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(submoduleedit.project),
        subproject: String(submoduleedit.subproject),
        module: String(submoduleedit.module),
        submodule: String(submoduleedit.submodule),
        pagetypename: String(submoduleedit.pagetypename),
        mainpage: String(submoduleedit.mainpage),
        subpage: String(submoduleedit.subpage),
        name: String(submoduleedit.name),
        // raiseissueadded: String(raiseissue.raiseissueadded),
        issuedate: String(raiseissue.issuedate),
        priority: String(raiseissue.priority),
        title: String(raiseissue.title),
        status: String(raiseissue.status),
        description: String(textSumm),
        files: [...refImage],
        ticketno: newval,
        previousid: getid,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });

      setRaiseissue(raisecreate.data);
      setRaiseissue({
        project: "",
        subproject: "",
        module: "",
        submodule: "",
        pagetypename: "",
        mainpage: "",
        issuedate: today,
        priority: "Please Select Priority",
        title: "",
        description: "",
        status: "open",
        ticketno: "",
        subpage: "",
        name: "",
        raiseissueadded: "added",
        addedby: "",
        updatedby: "",
      });
      setTextSummary("");
      await fetchRaise();

      setRefImage([]);
      setFile("");
      setGetImg(null);
      handleRaiseClose();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  const handleclear = (e) => {
    e.preventDefault();
    setRaiseissue({
      issuedate: today,
      priority: "Please Select Priority",
      title: "",
      description: "",
      status: "open",
      ticketno: "",
      subpage: "",
      name: "",
      raiseissueadded: "added",
      addedby: "",
      updatedby: "",
    });
    setTextSummary("");
  };

  const handleclearedit = (e) => {
    e.preventDefault();
    setRaiseissueedit({
      issuedate: today,
      priority: "Please Select Priority",
      title: "",
      description: "",
      status: "open",
      ticketno: "",
      subpage: "",
      name: "",
      raiseissueadded: "added",
      addedby: "",
      updatedby: "",
    });
  };


  const getRaiseCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.RAISEISSUE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRaiseissueedit(res.data.sraiseissue);
      handleraiseOpenedit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [getid, setGetid] = useState("");

  const getCode = async (id) => {
    setPageName(!pageName);
    setGetid(id);
    try {
      let res = await axios.get(SERVICE.PAGEMODEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const idFind = res?.data?.pagemodel?.some((item) => item._id == id);

      if (idFind === true) {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setSubmoduleedit({
          ...submoduleedit,
          project: res.data.spagemodel.project,
          subproject: res.data.spagemodel.subproject,
          module: res.data.spagemodel.module,
          submodule: res.data.spagemodel.submodule,
          pagetypename: res.data.spagemodel.pagetypename,
          pagetypename: res.data.spagemodel.pagetype,
          mainpage: res.data.spagemodel.mainpage,
          subpage: res.data.spagemodel.subpage,
          name: res.data.spagemodel.name,
          pageBranch: res.data.spagemodel.pageBranch,
        });
        handleraiseOpen();
      } else if (idFind === false) {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setSubmoduleedit(res.data.ssubmodule);
        setSubmoduleedit({
          ...submoduleedit,
          project: res.data.ssubmodule.project,
          subproject: res.data.ssubmodule.subproject,
          module: res.data.ssubmodule.module,
          submodule: res.data.ssubmodule.name,
        });

        handleraiseOpen();
      }
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let pageTypeId = deletePageData?._id;
  const delPageView = async () => {
    setPageName(!pageName);
    try {
      if (deletePageName === "submodule") {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${pageTypeId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "not assigned",
          componentgrouping: "",
          component: "",
          subcomponent: "",
          count: "",
          subComReq: "",
          taskassignboardliststatus: "Yet to assign",
        });
        handleCloseMod();
        setPage(1);
      } else {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${pageTypeId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "not assigned",
          componentgrouping: "",
          component: "",
          subcomponent: "",
          count: "",
          subComReq: "",
          taskassignboardliststatus: "Yet to assign",
        });
        handleCloseMod();
        setPage(1);
      }
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchprojectModelsDropdwon = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PAGEMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let resr = res_project.data.pagemodel.filter(
        (a) => a.pageBranch === "EndPage"
        // && a.raiseissueadded != "added"
      );

      res_project.data.pagemodel?.map((item) => ({
        ...item,

        project: item.project,
        subproject: item.subproject,
        module: item.module,
        submodule: item.submodule,
        pagetypename: item.pagetypename,
        pagetypename: item.pagetype,
        mainpage: item.mainpage,
        subpage: item.subpage,
        name: item.name,
        pageBranch: item.pageBranch,
      }));
      setProjectModels(resr);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchSubmodule = async () => {
    setPageName(!pageName);
    try {
      let res_submodule = await axios.get(SERVICE.SUBMODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res = res_submodule?.data?.submodules?.filter(
        (a) => a.endpage === "end"
        // && a.raiseissueadded != "added"
      );

      // res_submodule?.data?.submodules?.map((item, index) => ({
      //   ...item,

      //   project: item.project,
      //   subproject: item.subproject,
      //   module: item.module,
      //   submodule: item.name,

      // }))

      const res_name = res.map((t, index) => ({
        _id: t._id,
        project: t.project,
        subproject: t.subproject,
        module: t.module,
        submodule: t.name,
        page: "submodule",
        endpage: t.endpage,
        pagetype: "",
        mainpage: "",
        subpage: "",
        subsubpage: "",
        pageBranch: "",
        endpage: t.endpage,
        status: t.status,
      }));

      setSubmoduleEnd(res_name);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchmerge = async () => {
      let res = [...projectModels, ...submoduleEnd];
      setEndmerge(res);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);



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
    actions: true,
    checkbox: true,
    serialNumber: true,
    project: true,
    subproject: true,
    module: true,
    submodule: true,
    pagetypename: true,
    mainpage: true,
    subpage: true,
    name: true,
    pageBranch: true,
    raiseissue: true,
    viewissue: true,
    raiseissueadded: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  //  PDF
  const columns = [
    { title: "S.NO", field: "serialNumber" },
    { title: "Project", field: "project" },
    { title: "Sub Project", field: "subproject" },
    { title: "Module", field: "module" },
    { title: "Sub Module", field: "submodule" },
    { title: "Page Type No", field: "pagetypename" },
    { title: "Main Page", field: "mainpage" },
    { title: "Sub Page", field: "subpage" },
    { title: "Sub Sub Page", field: "name" },
    { title: "Page Branch", field: "pageBranch" },
  ];
  //  pdf download functionality
  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;


    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      endMerge.map(row => ({ ...row, serialNumber: serialNumberCounter++ }))


    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      // columns: columnsWithSerial,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: dataWithSerial,
    });

    doc.save("Raise_Issue.pdf");
  };

  // Excel
  const fileName = "Raise_Issue";

  const [pageModelData, setPageModelData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = async () => {
      var data = items?.map((t, index) => ({
        sno: index + 1,
        project: t.project,
        subproject: t.subproject,
        module: t.module,
        submodule: t.submodule,
        pagetype: t.pagetype,
        mainpage: t.mainpage,
        subpage: t.subpage,
        subsubpage: t.name,
        pageBranch: t.pageBranch,
        //  ...t,
      }));
      setPageModelData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "raiseissue",
    pageStyle: "print",
  });

  useEffect(() => {
    getexcelDatas();
  }, [endMerge]);

  const [items, setItems] = useState([]);

  // const modifiedData = endMerge.map((t, index) => ({
  //   // ...person,
  //   _id: t._id,
  //   sno: index + 1,
  //   status: t.status === "assigned" ? "Requirement assigned" : "Requirement not assigned",
  //   project: t.project,
  //   subproject: t.subproject,
  //   module: t.module,
  //   submodule: t.submodule,
  //   pagetype: t.pagetype === "" ? "---" : t.pagetype,
  //   mainpage: t.pagetypename === "MAINPAGE" ? (t.name === "" ? "---" : t.name) : (t.mainpage === "" ? "---" : t.mainpage),
  //   subpage: t.pagetypename === "SUBPAGE" ? (t.name === "" ? "---" : t.name) : (t.subpage === "" ? "---" : t.subpage),
  //   name: t.pagetypename === "SUBSUBPAGE" ? t.name : "---",
  //   pageBranch: t.pageBranch,
  //   endpage: t.endpage,
  //   page: t.page,

  // }));

  const addSerialNumber = () => {
    const itemsWithSerialNumber = endMerge?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [endMerge]);

  // get all shifts
  const fetchAllPriority = async () => {
    setPageName(!pageName);
    try {
      let res_priority = await axios.get(SERVICE.PRIORITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const priorityall = res_priority?.data?.priorities?.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setPriorities(priorityall);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchprojectModelsDropdwon();
    fetchSubmodule();
    fetchRaise();
    fetchAllPriority();
  }, []);

  useEffect(() => {
    fetchmerge();
  }, [submoduleEnd, projectModels]);

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
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows?.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows?.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData?.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    { field: "serialNumber", headerName: "S.No", flex: 0, width: 90, minHeight: "40px", hide: !columnVisibility.serialNumber },
    { field: "project", headerName: "Project", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.project },
    { field: "subproject", headerName: "Subproject", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.subproject },
    { field: "module", headerName: "Module", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.module },
    { field: "submodule", headerName: "Submodule", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.submodule },
    {
      field: "pagetypename",
      headerName: "PageType No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.pagetypename,
    },
    { field: "mainpage", headerName: "Mainpage", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.mainpage },
    { field: "subpage", headerName: "subpage", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.subpage },
    { field: "name", headerName: "Subsub Page", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.name },
    { field: "pageBranch", headerName: "Page Branch", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.pageBranch },
    {
      field: "raiseissue",
      headerName: "Raise Issue",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.raiseissue,
      headerClassName: "bold-header",
      renderCell: (params) => {
        // let tasknamedata = (params.row.project) + "_" + (params.row.subproject) + "_" +
        //   (params.row.module) + "_" + (params.row.submodule) + "_" +
        //   (params.row.mainpage) + "_" +
        //   (params.row.subpage) + "_" +
        //   (params.row.name)
        let tasknamedata = params.row.project + "_" + (params.row.subproject + "_") + (params.row.module + "_") + params.row.submodule + (params.row.mainpage ? "_" + params.row.mainpage : "") + (params.row.subpage ? "_" + params.row.subpage : "") + (params.row.name ? "_" + params.row.name : "");

        let tasknamefull = tasknamedata?.replace(/ /g, "");
        let tasknamefullcase = tasknamefull?.toUpperCase();

        return (
          <>
            <Grid sx={{ display: "flex" }} spacing={2}>
              {completedtask.includes(tasknamefullcase) && (
                <Button sx={userStyle.buttondelete}>
                  <FaPlus
                    style={{ fontsize: "large" }}
                    variant="contained"
                    onClick={() => {
                      getCode(params.row.id);
                    }}
                  />
                </Button>
              )}
            </Grid>
            {/* {completedtask.includes(
            (params.row.project) + "_" + (params.row.subproject) + "_" +
            (params.row.module) + "_" + (params.row.submodule) + "_" +
            (params.row.mainpage) + "_" +
            (params.row.pagetypename) + "_" +
            (params.row.name)
          ) */}

            {/* && 
         
        
          {/* {params.row.raiseissueadded == "added" &&
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getRaiseCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          } */}
          </>
        );
      },
    },

    {
      field: "viewissue",
      headerName: "View Issue",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.viewissue,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }} spacing={2}>
          <Link to={`/raiseissuedit/${params.row.id}`} style={{ textDecoration: "none", color: "white", float: "right" }}>
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
              View
            </Button>
          </Link>
        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((t) => {
    return {
      id: t._id,
      serialNumber: t.serialNumber,
      status: t.status === "assigned" ? "Requirement assigned" : "Requirement not assigned",
      project: t.project,
      subproject: t.subproject,
      module: t.module,
      submodule: t.submodule,
      pagetypename: t.pagetypename,
      mainpage: t.mainpage,
      subpage: t.subpage,
      name: t.name,
      pageBranch: t.pageBranch,
      endpage: t.endpage,
      page: t.page,
      raiseissueadded: t.raiseissueadded,
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

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) => column?.headerName?.toLowerCase()?.includes(searchQueryManage?.toLowerCase()));

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column?.field]} onChange={() => toggleColumnVisibility(column?.field)} />} secondary={column?.headerName} />
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

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
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          sno: index + 1,
          project: t.project,
          subproject: t.subproject,
          module: t.module,
          submodule: t.submodule,
          pagetypename: t.pagetypename,
          mainpage: t.mainpage,
          subpage: t.subpage,
          subsubpage: t.name,
          pageBranch: t.page == "pageBranch" ? t.name : t.pageBranch,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        endMerge.map((t, index) => ({
          sno: index + 1,
          project: t.project,
          subproject: t.subproject,
          module: t.module,
          submodule: t.submodule,
          pagetypename: t.pagetypename,
          mainpage: t.mainpage,
          subpage: t.subpage,
          subsubpage: t.name,
          pageBranch: t.page == "pageBranch" ? t.name : t.pageBranch,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };


  return (
    <Box>
      <Headtitle title={"Raise Issue"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Raise Issue"
        modulename="Projects"
        submodulename="Sub Module"
        mainpagename="Raise Issue"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lraiseissue") && (
        <>
          <br />
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Raise Issue</Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            {/* {isSubpagefive ?  */}
            <>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelraiseissue") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchmerge()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvraiseissue") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchmerge()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printraiseissue") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfraiseissue") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchmerge()
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {/* {isUserRoleCompare?.includes("printrequirements") && ( */}
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      &ensp;
                      <FaPrint />
                      &ensp;Image&ensp;
                    </Button>
                  </>
                  {/* )} */}
                </Grid>
              </Grid>
              <br />

              <Grid style={userStyle.dataTablestyle}>
                <Box>
                  <label>Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* <MenuItem value={endMerge?.length}>All</MenuItem> */}
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
              {/* <TableContainer component={Paper} >
                  <Table
                    aria-label="simple table"
                    id="branch"
                  >
                    <TableHead sx={{ fontWeight: "600" }}>
                      <StyledTableRow >
                        <StyledTableCell onClick={() => handleSorting('serialnumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialnumber')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('project')}><Box sx={userStyle.tableheadstyle}><Box>Project</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('project')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('subproject')}><Box sx={userStyle.tableheadstyle}><Box>Sub Project</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subproject')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('module')}><Box sx={userStyle.tableheadstyle}><Box>Module</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('module')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('submodule')}><Box sx={userStyle.tableheadstyle}><Box>Sub Module</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('submodule')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('pagetype')}><Box sx={userStyle.tableheadstyle}><Box>Page Type No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('pagetype')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('mainpage')}><Box sx={userStyle.tableheadstyle}><Box>Main Page</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mainpage')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('subpage')}><Box sx={userStyle.tableheadstyle}><Box>Sub Page</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subpage')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('name')}><Box sx={userStyle.tableheadstyle}><Box>Sub Sub Page</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('name')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('pageBranch')}><Box sx={userStyle.tableheadstyle}><Box>Page Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('pageBranch')}</Box></Box></StyledTableCell>

                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                            <StyledTableCell >{row.project}</StyledTableCell>
                            <StyledTableCell >{row.subproject}</StyledTableCell>
                            <StyledTableCell >{row.module}</StyledTableCell>
                            <StyledTableCell >{row.submodule}</StyledTableCell>
                            <StyledTableCell >{row.pagetype}</StyledTableCell>
                            <StyledTableCell >{row.mainpage}</StyledTableCell>
                            <StyledTableCell >{row.subpage}</StyledTableCell>
                            <StyledTableCell >{row.name}</StyledTableCell>
                            <StyledTableCell >{row.page == "pageBranch" ? row.name : row.pageBranch}</StyledTableCell>

                          </StyledTableRow>
                        ))) : <StyledTableRow> <StyledTableCell colSpan={15} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                    </TableBody>
                  </Table>
                </TableContainer> */}

              <br />
              <br />
              <Grid container spacing={1}>
                <Grid item md={6} xs={12} sm={12}>
                  <Box sx={{ display: "flex", justifyContent: "left", flexWrap: "wrap", gap: "10px" }}>
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                      Show All Columns
                    </Button>
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                      Manage Columns
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  autoHeight={true}
                  ref={gridRef}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                />
              </Box>
              <br />

              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
            </>
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
          </Box>
          <Box>
            <Dialog
              // open={isErrorOpen}
              // onClose={handleCloseerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                <Typography variant="h6"></Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="error">
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* print layout */}
          <Box sx={userStyle.printcls}>
            <Table aria-label="simple table" id="branch" ref={componentRef}>
              <TableHead sx={{ fontWeight: "600" }}>
                <TableRow>
                  <TableCell>SNo</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Sub Project</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Sub Module</TableCell>
                  <TableCell>Page Type No</TableCell>
                  <TableCell>Main Page</TableCell>
                  <TableCell>Sub Page</TableCell>
                  <TableCell>Sub Sub Page</TableCell>
                  <TableCell>Page Branch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowDataTable &&
                  rowDataTable.map((row, index) => (
                    <>
                      <TableRow key={index}>
                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                        <StyledTableCell>{row.page == "project" ? row.name : row.project}</StyledTableCell>
                        <StyledTableCell>{row.page == "subproject" ? row.name : row.subproject}</StyledTableCell>
                        <StyledTableCell>{row.page == "module" ? row.name : row.module}</StyledTableCell>
                        <StyledTableCell>{row.page == "submodule" ? row.name : row.submodule}</StyledTableCell>
                        <StyledTableCell>{row.page == "pagetype" ? row.name : row.pagetype}</StyledTableCell>
                        <StyledTableCell>{row.page == "mainpage" ? row.name : row.mainpage}</StyledTableCell>
                        <StyledTableCell>{row.page == "subpage" ? row.name : row.subpage}</StyledTableCell>
                        <StyledTableCell>{row.page == "name" ? row.name : row.name}</StyledTableCell>
                        <StyledTableCell>{row.pageBranch == "pageBranch" ? row.name : row.pageBranch}</StyledTableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </Box>
          {/* Delete Modal */}
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent style={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" style={{ color: "red", textAlign: "center" }}>
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseMod}
                  style={{
                    backgroundColor: "#f4f4f4",
                    color: "#444",
                    boxShadow: "none",
                    borderRadius: "3px",
                    border: "1px solid #0000006b",
                    "&:hover": {
                      "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                        backgroundColor: "#f4f4f4",
                      },
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button autoFocus variant="contained" color="error" onClick={(e) => delPageView(pageTypeId)}>
                  {" "}
                  OK{" "}
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

          {/* Add Raise Entry */}
          <Box>
            <Dialog open={addRaise} onClose={handleRaiseClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
              <Box sx={{ padding: "20px 50px" }}>
                <>
                  <Grid container spacing={2}>
                    <Typography sx={userStyle.HeaderText}>Add Issue</Typography>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>project</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.project} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Subproject</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.subproject} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Module</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.module} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>SubModule</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.submodule} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Page Typeno</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.pagetypename} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Main Page</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.mainpage} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Subpage</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.subpage} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Subsub Page</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={submoduleedit?.name} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        {raise &&
                          raise?.map(() => {
                            let strings = concatecreate;
                            let refNo = raise[raise?.length - 1]?.ticketno;
                            let digits = (raise?.length + 1)?.toString();
                            const stringLength = refNo?.length;
                            let lastChar = refNo?.charAt(stringLength - 1);
                            let getlastBeforeChar = refNo?.charAt(stringLength - 2);
                            let getlastThreeChar = refNo?.charAt(stringLength - 3);
                            let lastBeforeChar = refNo?.slice(-2);
                            let lastThreeChar = refNo?.slice(-3);
                            let lastDigit = refNo?.slice(-4);
                            let refNOINC = parseInt(lastChar) + 1;
                            let refLstTwo = parseInt(lastBeforeChar) + 1;
                            let refLstThree = parseInt(lastThreeChar) + 1;
                            let refLstDigit = parseInt(lastDigit) + 1;
                            if (digits?.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                              refNOINC = ("000" + refNOINC).substr(-4);
                              newval = strings + "_" + refNOINC;
                            } else if (digits?.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                              refNOINC = ("00" + refLstTwo).substr(-4);
                              newval = strings + "_" + refNOINC;
                            } else if (digits.length < 4 && getlastThreeChar > 0) {
                              refNOINC = ("0" + refLstThree).substr(-4);
                              newval = strings + "_" + refNOINC;
                            } else {
                              refNOINC = refLstDigit?.substr(-4);
                              newval = strings + "_" + refNOINC;
                            }
                          })}
                        <Typography>
                          Ticket No <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput id="component-outlined" value={newval} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Date</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={raiseissue.issuedate}
                          onChange={(e) => {
                            setRaiseissue({ ...raiseissue, issuedate: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Priority</Typography>
                        <Selects
                          options={priorities}
                          styles={colourStyles}
                          value={{ label: raiseissue.priority, value: raiseissue.priority }}
                          onChange={(e) => {
                            setRaiseissue({ ...raiseissue, priority: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Title</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={raiseissue.title}
                          onChange={(e) => {
                            setRaiseissue({ ...raiseissue, title: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Description</Typography>
                        <ReactQuill
                          style={{ height: "180px" }}
                          value={textSumm}
                          onChange={handleChangeSummary}
                          modules={{
                            toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                          }}
                          formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                        />
                      </FormControl>
                      <br /> <br />
                      <br />
                    </Grid>
                    <br />
                    <Grid item md={4} xs={6} sm={6}>
                      <Typography>Image Upload </Typography>
                      <Box>
                        <Button variant="contained" onClick={handleClickUploadPopupOpen}>
                          Upload
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  <br /> <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <Button variant="contained" color="primary" onClick={(e) => handleSubmit(e)}>
                        Rasie
                      </Button>
                    </Grid>
                    <br />
                    <Grid item md={4} xs={12} sm={12}>
                      <Button variant="contained" onClick={handleclear}>
                        Clear
                      </Button>
                    </Grid>
                    <br />
                    <Grid item md={4} xs={12} sm={12}>
                      <Button sx={userStyle.btncancel} onClick={handleRaiseClose}>
                        {" "}
                        Cancel{" "}
                      </Button>
                    </Grid>
                  </Grid>
                </>
              </Box>
            </Dialog>
          </Box>

          {/* UPLOAD IMAGE DIALOG */}
          <Dialog open={uploadPopupOpen} onClose={handleUploadPopupClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
            <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}>
              Upload Image
            </DialogTitle>
            <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="body2" style={{ marginTop: "5px" }}>
                    Max File size: 5MB
                  </Typography>
                  {/* {showDragField ? ( */}
                  <div onDragOver={handleDragOver} onDrop={handleDrop}>
                    {previewURL && refImageDrag.length > 0 ? (
                      <>
                        {refImageDrag.map((file, index) => (
                          <>
                            <img src={file.preview} alt={file.name} style={{ maxWidth: "70px", maxHeight: "70px", marginTop: "10px" }} />
                            <Button onClick={() => handleRemoveFile(index)} style={{ marginTop: "0px", color: "red" }}>
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
                      <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                        Upload
                        <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChange} />
                      </Button>
                      &ensp;
                      {/* <Button variant="contained" onClick={showWebcam} sx={userStyle.uploadbtn}>
                          Webcam
                        </Button> */}
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  {isWebcamCapture == true &&
                    capturedImages.map((image, index) => (
                      <Grid container key={index}>
                        <Grid item md={2} sm={2} xs={12}>
                          <Box style={{ isplay: "flex", justifyContent: "center", alignItems: "center", marginLeft: "37px" }}>
                            <img src={image.preview} alt={image.name} height={50} style={{ maxWidth: "-webkit-fill-available" }} />
                          </Box>
                        </Grid>
                        <Grid item md={7} sm={7} xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Typography variant="subtitle2"> {image.name} </Typography>
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
                              <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8", marginTop: "35px !important" }} />
                            </Button>
                            <Button
                              sx={{
                                marginTop: "15px !important",
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036",
                                },
                              }}
                              onClick={() => removeCapturedImage(index)}
                            >
                              <FaTrash style={{ color: "#a73131", fontSize: "12px", marginTop: "35px !important" }} />
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
                            <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                          )}
                        </Box>
                      </Grid>
                      <Grid item md={7} sm={7} xs={7} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                            <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8" }} />
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
                            onClick={() => handleDeleteFile(index)}
                          >
                            <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
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

          {/* View */}
          <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
            <Box sx={{ width: "750px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>View Submodulelist View </Typography>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Project</Typography>
                      <Typography>{pageModelEdit.project}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Subproject</Typography>
                      <Typography>{pageModelEdit.subproject}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Module Name</Typography>
                      <Typography>{pageModelEdit.module}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">SubModule Name</Typography>
                      <Typography>{pageModelEdit.submodule}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">PageType</Typography>
                      <Typography>{pageModelEdit.pagetype}</Typography>
                    </FormControl>
                  </Grid>
                  {pageModelEdit.pagetypename === "MAINPAGE" ? (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Name</Typography>
                        <Typography>{pageModelEdit.name}</Typography>
                      </FormControl>
                    </Grid>
                  ) : pageModelEdit.pagetypename === "SUBPAGE" ? (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Main Page</Typography>
                          <Typography>{pageModelEdit.mainpage}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Name</Typography>
                          <Typography>{pageModelEdit.name}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  ) : pageModelEdit.pagetypename === "SUBSUBPAGE" ? (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Main Page</Typography>
                          <Typography>{pageModelEdit.mainpage}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Sub Page</Typography>
                          <Typography>{pageModelEdit.subpage}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Name</Typography>
                          <Typography>{pageModelEdit.name}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Page Branch</Typography>
                      <Typography>{pageModelEdit.pageBranch}</Typography>
                    </FormControl>
                  </Grid>
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


          <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              {fileFormat === 'xl' ?
                <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
              }
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus variant="contained"
                onClick={(e) => {
                  handleExportXL("filtered")
                }}
              >
                Export Filtered Data
              </Button>
              <Button autoFocus variant="contained"
                onClick={(e) => {
                  handleExportXL("overall")
                  fetchmerge()
                }}
              >
                Export Over All Data
              </Button>
            </DialogActions>
          </Dialog>
          {/*Export pdf Data  */}
          <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
              <IconButton
                aria-label="close"
                onClick={handleClosePdfFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={(e) => {
                  downloadPdf("filtered")
                  setIsPdfFilterOpen(false);
                }}
              >
                Export Filtered Data
              </Button>
              <Button variant="contained"
                onClick={(e) => {
                  downloadPdf("overall")
                  setIsPdfFilterOpen(false);
                }}
              >
                Export Over All Data
              </Button>
            </DialogActions>
          </Dialog>




        </>
      )}
    </Box>
  );
}

export default Raiseissue;