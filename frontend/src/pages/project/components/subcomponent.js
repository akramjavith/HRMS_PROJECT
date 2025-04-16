import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TextareaAutosize, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { SERVICE } from "../../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { saveAs } from "file-saver";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Selects from "react-select";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CodeIcon from "@mui/icons-material/Code";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import { makeStyles } from "@material-ui/core";
import ReactQuill from "react-quill";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
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
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function Subcomponent() {

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

  let exportColumnNames = ['Component Name', 'Component Code', 'SubComponent Name', 'Estimation Time', 'Reference Details'];
  let exportRowValues = ['componentname', 'componentcode', 'subcomponentname', 'fulltime', 'refDetails'];

  const gridRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState("1");
  const [valueEdit, setValueEdit] = useState("1");
  const [isBtn, setIsBtn] = useState(false);
  const [isBtnsave, setIsBtnsave] = useState(false);
  const classes = useStyles();
  const { isUserRoleCompare, isUserRoleAccess, pageName,setPageName, } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const username = isUserRoleAccess.username;
  const [inputvalue, setInputvalue] = useState("");
  const [sizeheight, setSizeheight] = useState("Default Value");
  const [sizewidth, setSizewidth] = useState("Default Value");
  const [colour, setColour] = useState("");
  const [direction, setDirection] = useState("");
  const [position, setPosition] = useState("");
  const [inputvalueEdit, setInputvalueEdit] = useState("");
  const [sizeheightEdit, setSizeheightEdit] = useState("");
  const [sizewidthEdit, setSizewidthEdit] = useState("");
  const [colourEdit, setColourEdit] = useState("");
  const [directionEdit, setDirectionEdit] = useState("");
  const [positionEdit, setPositionEdit] = useState("");
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
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Subcomponent Master.png');
        });
      });
    }
  };

  const handleChangeEdit = (event, newValue) => {
    setValueEdit(newValue);
  };

  //tab context create
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const [valueView, setValueView] = useState("1");

  const handleChangeView = (event, newValue) => {
    setValueView(newValue);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [compSubComptEditallName, setcompSubComptEditallName] = useState([]);
  const [compSubComptList, setcompSubComptList] = useState([]);
  const [compSubComptEdit, setcompSubComptEdit] = useState([]);
  const [subCompName, setSubcompName] = useState("");
  const [estimationTypetodo, setEstimationTypetodo] = useState("");
  const [estimationTime, setEstimationTime] = useState("");
  const [refCode, setRefCode] = useState("");
  const [refImage, setRefImage] = useState([]);
  const [refDocuments, setrefDocuments] = useState([]);
  const [refLinks, setRefLinks] = useState("");
  const [refDetails, setRefDetails] = useState("");
  const [selectedOption, setSelectedOption] = useState({ value: "Please Select Component Name", label: "Please Select Component Name" });
  const [selectedOptionEdit, setSelectedOptionEdit] = useState(null);
  const [subCompNameEdit, setSubcompNameEdit] = useState("");
  const [estimationTypetodoEdit, setEstimationTypetodoEdit] = useState("");
  const [estimationTimeEdit, setEstimationTimeEdit] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const getRowClassName = (params) => {
    if ((selectedRows).includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    componentname: true,
    componentcode: true,
    subcomponentname: true,
    fulltime: true,
    refDetails: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //reference images
  const handleInputChange = (event) => {
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
            // index: indexData
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

  //Rendering File
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //first deletefile
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };

  //reference documents
  const handleInputChangedocument = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an documents
      if (file.type.startsWith("image/")) {
        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
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
      }
    }
  };


  //first deletefile
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];
    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles);
  };

  //reference Links
  const handleChangeSummary = (value) => {
    setRefLinks(value);
  };

  //reference images for edit todo create section
  const handleInputChangeEdit = (event) => {
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

  //first deletefile in edit page create section
  const handleDeleteFileEdit = (index) => {
    const newSelectedFiles = [...refImageEdit];
    newSelectedFiles.splice(index, 1);
    setRefImageEdit(newSelectedFiles);
  };
  //reference documents in edit page cretae
  const handleInputChangedocumentEdit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocumentsEdit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an documents
      if (file.type.startsWith("image/")) {
        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
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
      }
    }
  };

  //first deletefile  in edit page create
  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...refDocumentsEdit];
    newSelectedFiles.splice(index, 1);
    setrefDocumentsEdit(newSelectedFiles);
  };
  //reference Links for edit page create
  const handleChangeSummaryEdit = (value) => {
    setRefLinksEdit(value);
  };

  const [componentNames, setcomponentNames] = useState([]);
  const [selectedCompName, setSelectedCompName] = useState("Please Select Component");

  //get all components Name
  const fetchComponentAll = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.COMPONENTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setcomponentNames(
        res_vendor?.data?.component?.map((d) => ({
          ...d,
          label: d.componentname,
          value: d.componentname,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all Sub vendormasters.
  const fetchSubComponentAll = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.SUBCOMPONENTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setcompSubComptList(res_vendor?.data?.subcomponent);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchSubComponentAll();
  }, []);

  const [componentCode, setComponentCode] = useState("");
  //get all Sub vendormasters.
  const fetchComponentCode = async (e) => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.post(SERVICE.SUBCOMPONENT_CODE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        compname: e.label,
      });
      setComponentCode(res_vendor?.data?.compCode[0]?.componentcode);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [componentCodeEdit, setComponentCodeEdit] = useState("");
  //get all Sub vendormasters.
  const fetchComponentCodeEdit = async (e) => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.post(SERVICE.SUBCOMPONENT_CODE_EDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        compname: e.label,
      });
      setComponentCodeEdit(res_vendor?.data?.compCode[0]?.componentcode);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      await axios.post(SERVICE.SUBCOMPONENT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        componentname: String(selectedOption.label),
        componentcode: String(componentCode),
        subCompName: subCompName,
        estimationType: estimationTypetodo,
        estimationTime: estimationTime,
        inputvalue: inputvalue,
        sizeheight: sizeheight,
        sizewidth: sizewidth,
        colour: colour,
        direction: direction,
        position: position,
        refCode: refCode,
        refImage: [...refImage],
        refDocuments: [...refDocuments],
        refLinks: refLinks,
        refDetails: refDetails,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });

      setSelectedOption({ value: "Please Select Component Name", label: "Please Select Component Name" });
      setComponentCode("");
      setSubcompName("");
      setEstimationTime("");
      setEstimationTypetodo("");
      setRefCode("");
      setRefImage([]);
      setRefDetails("");
      setRefLinks("");
      setrefDocuments([]);
      setInputvalue("");
      setSizeheight("Default Value");
      setSizewidth("Default Value");
      setColour("");
      setDirection("");
      setPosition("");
      setValue("1");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchSubComponentAll();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //add function
  const sendRequestSave = async () => {
    setPageName(!pageName);
    setIsBtnsave(true);
    try {
      await axios.post(SERVICE.SUBCOMPONENT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        componentname: String(selectedOption.label),
        componentcode: String(componentCode),
        subCompName: subCompName,
        estimationType: estimationTypetodo,
        estimationTime: estimationTime,
        refCode: refCode,
        inputvalue: inputvalue,
        sizeheight: sizeheight,
        sizewidth: sizewidth,
        colour: colour,
        direction: direction,
        position: position,
        refImage: [...refImage],
        refDocuments: [...refDocuments],
        refLinks: refLinks,
        refDetails: refDetails,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      // setSelectedOption({ value: "Please Select Component Name", label: "Please Select Component Name" });
      // setSubcompName("");
      // setEstimationTime("");
      // setEstimationTypetodo("");
      // setRefCode("");
      // setRefImage([]);
      // setRefDetails("");
      // setRefLinks("");
      // setrefDocuments([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchSubComponentAll();
      setIsBtnsave(false);
    } catch (err) {
      setIsBtnsave(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = () => {
    setSelectedOption({ value: "Please Select Component Name", label: "Please Select Component Name" });
    setComponentCode("");
    setSubcompName("");
    setEstimationTime("");
    setEstimationTypetodo("");
    setRefCode("");
    setRefImage([]);
    setRefDetails("");
    setRefLinks("");
    setrefDocuments([]);
    setColour("")
    setInputvalue("")
    setSizeheight("Default Value")
    setSizewidth("Default Value")
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = compSubComptList.some((item) => item.subCompName?.toLowerCase() === subCompName?.toLowerCase() && selectedCompName === item.componentname);
    if (selectedOption.value === 'Please Select Component Name') {
      setPopupContentMalert("Please Select Component Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCompName === "") {
      setPopupContentMalert("Please Enter Sub-Component Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTypetodo === "") {
      setPopupContentMalert("Please Select Estimation Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTime === "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Sub Component Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //submit option for add and save another
  const handleSubmitSave = (e) => {
    e.preventDefault();
    const isNameMatch = compSubComptList.some((item) => item.subCompName?.toLowerCase() === subCompName?.toLowerCase());

    if (selectedOption.value === 'Please Select Component Name') {
      setPopupContentMalert("Please Select Component Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCompName === "") {
      setPopupContentMalert("Please Enter Sub-Component Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTypetodo === "") {
      setPopupContentMalert("Please Select Estimation Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTime === "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Sub Component Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestSave();
    }
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBCOMPONENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setcompSubComptEdit(res?.data?.ssubcomp);
      setSelectedOptionEdit(res?.data?.ssubcomp?.componentname);
      setComponentCodeEdit(res?.data?.ssubcomp?.componentcode);
      setSubcompNameEdit(res?.data?.ssubcomp?.subCompName);
      setEstimationTimeEdit(res?.data?.ssubcomp?.estimationTime);
      setEstimationTypetodoEdit(res?.data?.ssubcomp?.estimationType);
      setInputvalueEdit(res?.data?.ssubcomp?.inputvalue);
      setSizeheightEdit(res?.data?.ssubcomp?.sizeheight);
      setSizewidthEdit(res?.data?.ssubcomp?.sizewidth);
      setColourEdit(res?.data?.ssubcomp?.colour);
      setDirectionEdit(res?.data?.ssubcomp?.direction);
      setPositionEdit(res?.data?.ssubcomp?.position);
      setRefCodeEdit(res?.data?.ssubcomp?.refCode);
      setRefDetailsEdit(res?.data?.ssubcomp?.refDetails);
      setRefLinksEdit(res?.data?.ssubcomp?.refLinks);
      setRefImageEdit(res?.data?.ssubcomp?.refImage);
      setrefDocumentsEdit(res?.data?.ssubcomp?.refDocuments);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all Sub vendormasters.
  const fetchCompSubComponentAllEditName = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.SUBCOMPONENTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setcompSubComptEditallName(res_vendor?.data?.subcomponent?.filter((item) => item._id !== compSubComptEdit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBCOMPONENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setcompSubComptEdit(res?.data?.ssubcomp);
      setRefCodeView(res?.data?.ssubcomp.refCode);
      setRefImageView(res?.data?.ssubcomp.refImage);
      setrefDocumentsView(res?.data?.ssubcomp.refDocuments);
      setRefLinksView(res?.data?.ssubcomp.refLinks);
      setRefDetailsView(res?.data?.ssubcomp.refDetails);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBCOMPONENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setcompSubComptEdit(res?.data?.ssubcomp);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //Project updateby edit page...
  let updateby = compSubComptEdit?.updatedby;
  let addedby = compSubComptEdit?.addedby;
  const [deleteCompSubComp, setDeleteCompSubComp] = useState([]);
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBCOMPONENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteCompSubComp(res?.data?.ssubcomp);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let compSubCompId = deleteCompSubComp?._id;
  const deleCompSubComp = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SUBCOMPONENT_SINGLE}/${compSubCompId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      await fetchSubComponentAll();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let comsubComEdit = compSubComptEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      await axios.put(`${SERVICE.SUBCOMPONENT_SINGLE}/${comsubComEdit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        componentname: String(selectedOptionEdit),
        componentcode: componentCodeEdit,
        subCompName: subCompNameEdit,
        estimationType: estimationTypetodoEdit,
        estimationTime: estimationTimeEdit,
        inputvalue: inputvalueEdit,
        sizeheight: sizeheightEdit,
        sizewidth: sizewidthEdit,
        colour: colourEdit,
        direction: directionEdit,
        position: positionEdit,
        refCode: refCodeEdit,
        refImage: [...refImageEdit],
        refDocuments: [...refDocumentsEdit],
        refLinks: refLinksEdit,
        refDetails: refDetailsEdit,
        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      handleCloseModEdit();
      setSubcompNameEdit("");
      setEstimationTimeEdit("");
      setEstimationTypetodoEdit("");
      setRefCodeEdit("");
      setRefImageEdit([]);
      setRefDetailsEdit("");
      setRefLinksEdit("");
      setrefDocumentsEdit([]);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchSubComponentAll();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = compSubComptEditallName.some((item) => item.subCompName.toLowerCase() === subCompNameEdit.toLowerCase());
    if (!selectedOptionEdit) {
      setPopupContentMalert("Please Select Component Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      // } else if (compSubComptEdit.subcomponentname === "") {
    } else if (subCompNameEdit === "") {
      setPopupContentMalert("Please Enter Sub Component Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTypetodoEdit === "") {
      setPopupContentMalert("Please Enter Estimation Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTimeEdit === "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Sub Component Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const handleClearEdit = () => {
    handleCloseModEdit();
    setSubcompNameEdit("");
    setEstimationTimeEdit("");
    setEstimationTypetodoEdit("");
    setRefCodeEdit("");
    setRefImageEdit([]);
    setRefDetailsEdit("");
    setRefLinksEdit("");
    setrefDocumentsEdit([]);
    setInputvalueEdit("");
    setSizeheightEdit("");
    setSizewidthEdit("");
    setColourEdit("");
    setDirectionEdit("");
    setPositionEdit("");
    setValueEdit("1");
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = compSubComptList?.map((item, index) => ({
      id: item._id,
      serialNumber: index + 1,
      componentname: item.componentname,
      componentcode: item.componentcode,
      subcomponentname: item.subCompName,
      estimationType: item.estimationType,
      estimationTime: item.estimationTime,
      refDetails: item.refDetails,
      fulltime: item.estimationTime + " " + item.estimationType,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [compSubComptList]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    fetchComponentAll();
  }, []);

  useEffect(() => {
    fetchCompSubComponentAllEditName();
  }, [isEditOpen, compSubComptEdit]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox
        checked={selectAllChecked}
        onChange={onSelectAll}
      />
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
      headerClassName: "bold-header"
    },
    {
      field: "serialNumber", headerName: "SNo",
      flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
    },
    { field: "componentname", headerName: "Component Name", flex: 0, width: 190, hide: !columnVisibility.componentname, headerClassName: "bold-header" },
    { field: "componentcode", headerName: "Component Code", flex: 0, width: 190, hide: !columnVisibility.componentcode, headerClassName: "bold-header" },
    { field: "subcomponentname", headerName: "Subcomponent Name", flex: 0, width: 190, hide: !columnVisibility.subcomponentname, headerClassName: "bold-header" },
    { field: "fulltime", headerName: "Estimation Time", flex: 0, width: 190, hide: !columnVisibility.fulltime, headerClassName: "bold-header" },
    { field: "refDetails", headerName: "Details", flex: 0, width: 190, hide: !columnVisibility.refDetails, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("esubcomponentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dsubcomponentmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vsubcomponentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("isubcomponentmaster") && (
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
  ]

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      componentname: item.componentname,
      componentcode: item.componentcode,
      subcomponentname: item.subcomponentname,
      fulltime: item.fulltime,
      refDetails: item.refDetails
    }
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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {

    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute', }}
        />
      </Box><br /><br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%', }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }}
                primary={
                  <Switch sx={{ marginTop: "-5px" }} size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
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
    documentTitle: "Subcomponent Master",
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
      <Headtitle title={"SUBCOMPONENTS"} />
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Subcomponent Master"
        modulename="Projects"
        submodulename="Components"
        mainpagename="SubComponent Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("asubcomponentmaster") && (
        <>
          {/* <Typography sx={userStyle.HeaderText}>Subcomponent Master</Typography> */}
          <Box sx={userStyle.container}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Subcomponents</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Component Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={componentNames}
                      value={{ label: selectedOption.label, value: selectedOption.value }}
                      onChange={(value) => {
                        setSelectedOption(value);
                        fetchComponentCode(value);
                        setSelectedCompName(value.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Typography>Component Code</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput id="component-outlined" type="text" value={componentCode} />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Subcomponent Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={subCompName}
                      placeholder="Please Enter Subcomponent Name"
                      onChange={(e) => {
                        setSubcompName(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Estimation<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={estimationTypetodo}
                        onChange={(e) => {
                          setEstimationTypetodo(e.target.value);
                        }}
                      >
                        <MenuItem value="Hours"> {"Hours"} </MenuItem>
                        <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          sx={userStyle.input}
                          type="number"
                          value={estimationTime}
                          onChange={(e) => {
                            setEstimationTime(Number(e.target.value) > 0 ? Number(e.target.value) : 0);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Input value</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      size="small"
                      variant="outlined"
                      value={inputvalue}
                      onChange={(e) => {
                        setInputvalue(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Size-Height</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      type="text"
                      sx={userStyle.input}
                      value={sizeheight}
                      onChange={(e) => {
                        setSizeheight(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Size-Width</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      type="text"
                      sx={userStyle.input}
                      value={sizewidth}
                      onChange={(e) => {
                        setSizewidth(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Color</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      value={colour}
                      onChange={(e) => {
                        setColour(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Direction</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={direction}
                      onChange={(e) => {
                        setDirection(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="" disabled>
                        Please Select Direction
                      </MenuItem>
                      <MenuItem value="left to right"> {"Left to Right"} </MenuItem>
                      <MenuItem value="right to left"> {"Right to Left"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Position</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={position}
                      onChange={(e) => {
                        setPosition(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="" disabled>
                        Please Select Position
                      </MenuItem>
                      <MenuItem value="Left"> {"Left"} </MenuItem>
                      <MenuItem value="Right"> {"Right"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2} sx={{ justifyContent: "left" }}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography> References </Typography>
                  <br />
                  <br />
                  <Box sx={{ width: "100%", height: "max-content", minHeight: "250px", typography: "body1", boxShadow: "0px 0px 2px #808080a3", border: "1px solid #80808057" }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBotton: 1, border: "divider", background: "#80808036", height: "47px" }}>
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
                        <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" accept="image/*" multiple onChange={handleInputChange} />
                        <label htmlFor="file-inputuploadcreatefirst">
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
                                      <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            ))}
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel value="3">
                        <input className={classes.inputs} type="file" id="file-inputuploadcreatefirst" accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip" multiple onChange={handleInputChangedocument} />
                        <label htmlFor="file-inputuploadcreatefirst">
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
                                      <FaTrash style={{ color: "#a73131", fontSize: "14px" }} />
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
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2} sx={{ justifyContent: "left" }}>
                <Grid item md={2} xs={12} sm={12} marginTop={3}></Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={3}>
                  <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isBtn}>
                    Submit
                  </Button>
                </Grid>
                <Grid item md={3.5} xs={12} sm={12} marginTop={3}>
                  <Button variant="contained" color="primary" onClick={handleSubmitSave} disabled={isBtnsave}>
                    Submit and add another
                  </Button>
                </Grid>
                <Grid item md={3.5} xs={12} sm={12} marginTop={3}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={3}></Grid>
              </Grid>
            </>
          </Box>
        </>
      )}

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lsubcomponentmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Subcomponent List</Typography>
            </Grid>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes("excelsubcomponentmaster") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchSubComponentAll()
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvsubcomponentmaster") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchSubComponentAll()
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("printsubcomponentmaster") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfsubcomponentmaster") && (
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                        fetchSubComponentAll()
                      }}
                    ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imagesubcomponentmaster") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                )}
              </Grid>
            </Grid>
            <br />
            {/* ****** Table Grid Container ****** */}
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
                  {/* <MenuItem value={compSubComptList?.length}>All</MenuItem> */}
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
            <br /> <br />
            <>
              {/* ****** Table start ****** */}
              <Box
                style={{
                  width: '100%',
                  overflowY: 'hidden', // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
            </>
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>
      <Box>
        {/* Edit DIALOG */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="md">
          <Box sx={{ padding: "20px 25px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <Typography sx={userStyle.HeaderText}>Edit subcomponent </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Component Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={componentNames}
                      //   placeholder={selectedOptionEdit}
                      value={{ value: selectedOptionEdit, label: selectedOptionEdit }}
                      onChange={(value) => {
                        setSelectedOptionEdit(value.value);
                        fetchComponentCodeEdit(value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Component Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={componentCodeEdit} placeholder="Please Enter componentcode" />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Subcomponent Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={subCompNameEdit}
                      placeholder="Please Enter subcomponentname"
                      onChange={(e) => {
                        setSubcompNameEdit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Estimation<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={estimationTypetodoEdit}
                          onChange={(e) => {
                            setEstimationTypetodoEdit(e.target.value);
                            // fetchCalculRemaining(e.target.value);
                          }}
                        >
                          <MenuItem value="Hours"> {"Hours"} </MenuItem>
                          <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          sx={userStyle.input}
                          type="number"
                          value={estimationTimeEdit}
                          onChange={(e) => {
                            setEstimationTimeEdit(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Input value</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      size="small"
                      variant="outlined"
                      value={inputvalueEdit}
                      onChange={(e) => {
                        setInputvalueEdit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Size-Height</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      type="text"
                      sx={userStyle.input}
                      value={sizeheightEdit}
                      onChange={(e) => {
                        setSizeheightEdit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Size-Width</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      type="text"
                      sx={userStyle.input}
                      value={sizewidthEdit}
                      onChange={(e) => {
                        setSizewidthEdit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Color</Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      value={colourEdit}
                      onChange={(e) => {
                        setColourEdit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Direction</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={directionEdit}
                      onChange={(e) => {
                        setDirectionEdit(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="" disabled>
                        Please Select Direction
                      </MenuItem>
                      <MenuItem value="left to right"> {"Left to Right"} </MenuItem>
                      <MenuItem value="right to left"> {"Right to Left"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Position</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={positionEdit}
                      onChange={(e) => {
                        setPositionEdit(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="" disabled>
                        Please Select Position
                      </MenuItem>
                      <MenuItem value="Left"> {"Left"} </MenuItem>
                      <MenuItem value="Right"> {"Right"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.SubHeaderText}>References</Typography>
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
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12} marginTop={3}></Grid>
                <Grid item md={4} xs={12} sm={12} marginTop={3}>
                  {/* {isUserRoleCompare?.includes("usubcomponentmaster") && ( */}
                  <Button variant="contained" color="primary" onClick={editSubmit}>
                    Update
                  </Button>
                  {/* )} */}
                </Grid>
                <Grid item md={4} xs={12} sm={12} marginTop={3}>
                  {/* {isUserRoleCompare?.includes("usubcomponentmaster") && ( */}
                  <Button
                    sx={userStyle.btncancel}
                    onClick={() => {
                      handleClearEdit();
                    }}
                  >
                    Cancel
                  </Button>
                  {/* )} */}
                </Grid>
              </Grid>
            </>
          </Box>
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

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="md">
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Sub Component</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Component Name</Typography>
                  <Typography>{compSubComptEdit.componentname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Component Code</Typography>
                  <Typography>{compSubComptEdit.componentcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> SubComponent Name</Typography>
                  <Typography>{compSubComptEdit.subCompName}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Estimation Time</Typography>
                  <Typography>{compSubComptEdit.estimationTime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Estimation Type</Typography>
                  <Typography>{compSubComptEdit.estimationType}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Typography variant="h6">References</Typography><br />
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
      <br />
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
        filename={"Subcomponent Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Subcomponent Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleCompSubComp}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Subcomponent;