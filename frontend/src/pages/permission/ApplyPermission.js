import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { handleApiError } from "../../components/Errorhandling";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  TextareaAutosize,
  InputLabel
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaCheck, FaEdit } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDataGrid from "../../components/TableStyle";
import moment, { invalid } from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LoadingButton from "@mui/lab/LoadingButton";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Webcamimage from "../hr/webcamprofile";
import FormControlLabel from '@mui/material/FormControlLabel';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import MuiInput from "@mui/material/Input";

const Input = styled(MuiInput)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

function ApplyPermission() {
  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [minDate, setMinDate] = useState("");

  // Calculate the minimum date as today
  useEffect(() => {
    const today = new Date();

    // Format the date as 'YYYY-MM-DD' for the input element
    const formattedToday = today.toISOString().split("T")[0];
    setMinDate(formattedToday);
  }, []);

  const [isPermissions, setIsPermissions] = useState([]);
  const [Accessdrop, setAccesDrop] = useState("Employee");
  const [AccessdropEdit, setAccesDropEdit] = useState("Employee");
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const [selectStatus, setSelectStatus] = useState({});
  const [permissionSelf, setPermissionSelf] = useState([]);

  const [applypermission, setApplyPermission] = useState({
    companyname: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Branch",
    team: "Please Select Team",
    employeename: "Please Select Employee Name",
    employeeid: "",
    permissiontype: "Hours",
    date: "",
    fromtime: "",
    endtime: "",
    reasonforpermission: "",
    reportingto: "",
    shifttiming: "",
    requesthours: "",
    time: "",
    compensationapplytype: 'startshift',
    compensationstatus: '',
  });
  const [getTiming, setGetTiming] = useState("");
  const [permissionedit, setPermissionEdit] = useState([]);
  const [applyleaves, setApplyleaves] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [allpermissions, setAllpermissions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [leaveId, setLeaveId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allApplyleaveedit, setAllApplyleaveedit] = useState([]);

  const [type, settype] = useState("Hours");
  const [leaveEdit, setLeaveEdit] = useState("Hours");
  const [applytype, setApplytype] = useState("Please Select ApplyType");
  const [applytypeEdit, setApplytypeEdit] = useState("Please Select ApplyType");

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => {
    setStatusOpen(true);
  };
  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  const { auth } = useContext(AuthContext);

  const [applyleaveCheck, setApplyleavecheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
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

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setBtnSubmit(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

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
    requesthours: true,
    fromtime: true,
    endtime: true,
    employeename: true,
    employeeid: true,
    date: true,
    reasonforpermission: true,
    reportingto: true,
    status: true,
    actions: true,
  };


  const [isEditOpenCheckList, setIsEditOpenCheckList] = useState(false);
  const handleClickOpenEditCheckList = () => {
    setIsEditOpenCheckList(true);
  };
  const handleCloseModEditCheckList = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenCheckList(false);
  };


  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map((item) => item = !isCheckedListOverall);

    let returnOverall = groupDetails.map((row) => {

      {
        if (row.checklist === "DateTime") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
            return true;
          } else {
            return false;
          }
        }
        else if (row.checklist === "Date Multi Span") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21)) {
            return true;
          } else {
            return false;
          }
        }
        else if (row.checklist === "Date Multi Span Time") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33)) {
            return true;
          } else {
            return false;
          }
        }
        else if (row.checklist === "Date Multi Random Time") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
            return true;
          } else {
            return false;
          }

        }
        else if (((row.data !== undefined && row.data !== "") || (row.files !== undefined))) {
          return true;
        } else {
          return false;
        }

      }

    })

    let allcondition = returnOverall.every((item) => item == true);

    if (allcondition) {
      setIsCheckedList(newArrayChecked);
      setIsCheckedListOverall(!isCheckedListOverall);
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Fill all the Fields</p>
        </>
      );
      handleClickOpenerr();
    }


  }
  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isCheckedList];
    newCheckedState[index] = !newCheckedState[index];

    let currentItem = groupDetails[index];

    let data = () => {
      if (currentItem.checklist === "DateTime") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
          return true;
        } else {
          return false;
        }
      }
      else if (currentItem.checklist === "Date Multi Span") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 21)) {
          return true;
        } else {
          return false;
        }
      }
      else if (currentItem.checklist === "Date Multi Span Time") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 33)) {
          return true;
        } else {
          return false;
        }
      }
      else if (currentItem.checklist === "Date Multi Random Time") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
          return true;
        } else {
          return false;
        }

      }
      else if (((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined))) {
        return true;
      } else {
        return false;
      }
    }

    if (data()) {
      setIsCheckedList(newCheckedState);
      handleDataChange(newCheckedState[index], index, "Check Box");
      let overallChecked = newCheckedState.every((item) => item === true);

      if (overallChecked) {
        setIsCheckedListOverall(true);
      } else {
        setIsCheckedListOverall(false);
      }
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Fill the Field</p>
        </>
      );
      handleClickOpenerr();
    }


  };

  let name = "create";

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();
  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [disableInput, setDisableInput] = useState([]);
  const [getDetails, setGetDetails] = useState();


  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);

  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);

  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [postID, setPostID] = useState();
  const [pagesDetails, setPagesDetails] = useState({});
  const [fromWhere, setFromWhere] = useState("");

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);

  const [isCheckList, setIsCheckList] = useState(true);

  let completedbyName = isUserRoleAccess.companyname;

  const updateIndividualData = async (index) => {
    let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == "Leave&Permission" && item.submodule == "Permission" && item.mainpage == "Apply Permission" && item.status.toLowerCase() !== "completed");

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            data: String(objectData?.data),
            lastcheck: objectData?.lastcheck,
            newFiles: objectData?.files,
            completedby: objectData?.completedby,
            completedat: objectData?.completedat
          }
        );
        await fecthDBDatas();
      } else {
        let assignbranches = await axios.post(
          `${SERVICE.MYCHECKLIST_CREATE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            commonid: postID,
            module: pagesDetails?.module,
            submodule: pagesDetails?.submodule,
            mainpage: pagesDetails?.mainpage,
            subpage: pagesDetails?.subpage,
            subsubpage: pagesDetails?.subsubpage,
            category: assignDetails?.category,
            subcategory: assignDetails?.subcategory,
            candidatename: assignDetails?.fullname,
            status: "progress",
            groups: combinedGroups,
            addedby: [
              {
                name: String(username),
                date: String(new Date()),
              },
            ],
          }
        );
        await fecthDBDatas();
      }
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>Updated Successfully</p>
        </>
      );
      handleClickOpenerr();

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  }


  async function fecthDBDatas() {
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID)
      setGroupDetails(foundData?.groups);
    }
    catch (err) {
      console.log(err);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  }


  const updateDateValuesAtIndex = (value, index) => {

    setDateValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "date")
  };

  const updateTimeValuesAtIndex = (value, index) => {

    setTimeValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "time")
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {

    setDateValueMultiFrom(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "fromdate")
  };

  const updateToDateValueAtIndex = (value, index) => {

    setDateValueMultiTo(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "todate")
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {

    setDateValueRandom(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "date")
  };

  const updateTimeValueAtIndex = (value, index) => {

    setTimeValueRandom(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "time")
  };
  //---------------------------------------------------------------------------------------------------------------------------------------



  const updateFirstDateValuesAtIndex = (value, index) => {

    setFirstDateValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromdate")
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {

    setFirstTimeValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromtime")
  };

  const updateSecondDateValuesAtIndex = (value, index) => {

    setSecondDateValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "todate")
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {

    setSecondTimeValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "totime")
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {

    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case 'Check Box':
        getData = groupDetails[index];
        finalData = {
          ...getData, lastcheck: e
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-number':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alpha':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alphanumeric':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Attachments':
        getData = groupDetails[index];
        finalData = {
          ...getData, files: e
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Pre-Value':
        break;
      case 'Date':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Time':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'DateTime':
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${timeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${dateValue[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case 'Date Multi Span':
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${dateValueMultiTo[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${dateValueMultiFrom[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Span Time':
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "fromtime") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        else if (sub == "todate") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Random':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Date Multi Random Time':

        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${timeValueRandom[index]}`
          }


          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${dateValueRandom[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Radio':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  }

  const handleChangeImage = (event, index) => {

    const resume = event.target.files;


    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      handleDataChange(
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "resume file",
        }, index, "Attachments")

    };

  };

  const getCodeNew = async (details) => {
    setGetDetails(details);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);
      let searchItem = res?.data?.mychecklist.find((item) => item.commonid == details?.id && item.module == "Leave&Permission" && item.submodule == "Permission" && item.mainpage == "Apply Permission" && item.status.toLowerCase() !== "completed");

      if (searchItem) {
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);

        setGroupDetails(
          searchItem?.groups?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));


        let forFillDetails = searchItem?.groups?.map((data) => {
          if (data.checklist === "Date Multi Random Time") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }

          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateSpan = searchItem?.groups?.map((data) => {
          if (data.checklist === "Date Multi Span") {
            if (data?.data && data?.data !== "") {
              const [fromdate, todate] = data?.data?.split(" ");
              return { fromdate, todate };
            }
          } else {
            return { fromdate: "0", todate: "0" };
          }
        })


        let forDateTime = searchItem?.groups?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        })

        let forDateMultiSpanTime = searchItem?.groups?.map((data) => {
          if (data.checklist === "Date Multi Span Time") {
            if (data?.data && data?.data !== "") {
              const [from, to] = data?.data?.split("/");
              const [fromdate, fromtime] = from?.split(" ");
              const [todate, totime] = to?.split(" ");
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
          }
        })

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate))
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate))

        setDateValueRandom(forFillDetails.map((item) => item?.date))
        setTimeValueRandom(forFillDetails.map((item) => item?.time))

        setDateValue(forDateTime.map((item) => item?.date))
        setTimeValue(forDateTime.map((item) => item?.time))

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate))
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime))
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate))
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime))

        setDisableInput(new Array(details?.groups?.length).fill(true))
      }
      else {
        setIsCheckList(false);
      }
      // else {
      //     setAssignDetails(details);
      //     setPostID(details?.id);
      //     let datasNew = details.groups.map((item) => {
      //         switch (item.details) {
      //             case 'LEGALNAME':
      //                 return {
      //                     ...item, data: details.fullname
      //                 }
      //                 break;
      //             case 'USERNAME':
      //                 return {
      //                     ...item, data: details.username
      //                 }
      //                 break;
      //             case 'PASSWORD':
      //                 return {
      //                     ...item, data: details.password
      //                 }
      //                 break;
      //             case 'DATE OF BIRTH':
      //                 return {
      //                     ...item, data: details.dateofbirth
      //                 }
      //                 break;
      //             case 'EMAIL':
      //                 return {
      //                     ...item, data: details.email
      //                 }
      //                 break;
      //             case 'PHONE NUMBER':
      //                 return {
      //                     ...item, data: details.mobile
      //                 }
      //                 break;
      //             case 'FIRST NAME':
      //                 return {
      //                     ...item, data: details.firstname
      //                 }
      //                 break;
      //             case 'LAST NAME':
      //                 return {
      //                     ...item, data: details.lastname
      //                 }
      //                 break;
      //             case 'AADHAAR NUMBER':
      //                 return {
      //                     ...item, data: details.adharnumber
      //                 }
      //                 break;
      //             case 'PAN NUMBER':
      //                 return {
      //                     ...item, data: details.pannumber
      //                 }
      //                 break;
      //             case 'CURRENT ADDRESS':
      //                 return {
      //                     ...item, data: details.address
      //                 }
      //                 break;
      //             default:
      //                 return {
      //                     ...item
      //                 }
      //         }
      //     })
      //     setGroupDetails(
      //         datasNew?.map((data) => ({
      //             ...data,
      //             lastcheck: false,
      //         }))
      //     );

      //     setDateValueRandom(new Array(details.groups.length).fill(0))
      //     setTimeValueRandom(new Array(details.groups.length).fill(0))

      //     setDateValueMultiFrom(new Array(details.groups.length).fill(0))
      //     setDateValueMultiTo(new Array(details.groups.length).fill(0))

      //     setDateValue(new Array(details.groups.length).fill(0))
      //     setTimeValue(new Array(details.groups.length).fill(0))

      //     setFirstDateValue(new Array(details.groups.length).fill(0))
      //     setFirstTimeValue(new Array(details.groups.length).fill(0))
      //     setSecondDateValue(new Array(details.groups.length).fill(0))
      //     setSecondTimeValue(new Array(details.groups.length).fill(0))

      //     setDisableInput(new Array(details.groups.length).fill(true))
      // }

    } catch (err) {
      console.log(err);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }

  };


  const handleCheckListSubmit = async () => {
    let nextStep = isCheckedList.every((item) => item == true);

    if (!nextStep) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Check All the Fields!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestCheckList();
    }
  }



  const sendRequestCheckList = async () => {

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    try {

      let assignbranches = await axios.put(
        `${SERVICE.MYCHECKLIST_SINGLE}/${assignDetails?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: assignDetails?.commonid,
          module: assignDetails?.module,
          submodule: assignDetails?.submodule,
          mainpage: assignDetails?.mainpage,
          subpage: assignDetails?.subpage,
          subsubpage: assignDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: "Completed",
          groups: combinedGroups,
          updatedby: [
            ...assignDetails?.updatedby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      handleCloseModEditCheckList()
      setIsCheckedListOverall(false);
      sendEditStatus();

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };





  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteApply, setDeleteApply] = useState("");

  const fetchPermissionsAll = async () => {
    try {
      const response = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllpermissions(response.data.permissions);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  const fetchAttendanceCriterias = async (empid, selectedDate) => {
    let daysArray = [];
    let startMonthDate = new Date(selectedDate);
    let endMonthDate = new Date(selectedDate);

    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayCount = startMonthDate.getDate();
      const shiftMode = 'Main Shift';
      const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
        getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
          getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
            getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        empcode: empid
      });

      let res_leave = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const findShiftTiming = (shiftName) => {
        const foundShift = res_emp.data.shifts?.find((d) => d.name === shiftName?.trim());
        return foundShift
          ? `${foundShift.fromhour}:${foundShift.frommin}${foundShift.fromtime} to ${foundShift.tohour}:${foundShift.tomin}${foundShift.totime} `
          : '';
      };

      setGetTiming(res.data.finaluser[0] === undefined ? '' : res.data.finaluser[0].shift);
      setApplyPermission({
        ...applypermission,
        date: selectedDate,
        shifttiming: res.data.finaluser[0] === undefined ? '' : res.data.finaluser[0].shift,
        time: res.data.finaluser[0] === undefined ? '' : findShiftTiming(res.data.finaluser[0].shift),
      });

      const [year, month, day] = selectedDate?.split('-');

      let result = res_vendor?.data?.permissions.filter((d) => d.employeeid === empid && d.status !== 'Rejected');

      let matchedResult = result.filter((d) => {
        const [dataYear, dataMonth, dataDay] = d.date?.split('-');
        if (month === dataMonth && year === dataYear) {
          return d;
        }
      })

      if (matchedResult.length > parseInt(res_leave?.data?.attendancecontrolcriteria[0].permissionpermonthduration)) {
        handleClickOpenCompensation();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchPermissionsAll();
  }, []);

  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteApply(res?.data?.sPermission);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let Applysid = deleteApply?._id;
  const delApply = async (e) => {
    try {
      if (Applysid) {
        await axios.delete(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchApplyPermissions();
        await fetchPermissionsAll();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Deleted Successfully"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const delApplycheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PERMISSION_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchApplyPermissions();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [empnames, setEmpname] = useState([]);
  const [empnamesEdit, setEmpnameEdit] = useState([]);
  const [company, setCompany] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const fetchCategoryTicket = async () => {
    try {
      let res_emp = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const empall = [
        ...res_emp?.data?.users
          .filter((data) => data.companyname !== isUserRoleAccess.companyname)
          .map((d) => ({
            ...d,
            label: d.companyname,
            value: d.companyname,
          })),
      ];

      setEmpname(empall);
      setEmpnameEdit(empall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching company for optionsd
  const fetchCompany = async () => {
    try {
      let res_emp = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const getCompany = [
        ...res_emp?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setCompany(getCompany);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching branch for options
  const fetchBranch = async (e) => {
    try {
      let res_emp = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getCompanyBranch = res_emp.data.branch.filter(
        (data) => data.company == e.value
      );
      const getBranch = [
        ...getCompanyBranch.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setBranchOptions(getBranch);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching branch for options
  const fetchUnit = async (e) => {
    try {
      let res_emp = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getCompanyBranch = res_emp.data.units.filter(
        (data) => data.branch == e.value
      );
      const getUnit = [
        ...getCompanyBranch.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setUnitOptions(getUnit);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching team for options
  const fetchTeam = async (e) => {
    try {
      let res_emp = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getCompanyBranch = res_emp.data.teamsdetails.filter(
        (data) => data.unit == e.value
      );
      const getTeam = [
        ...getCompanyBranch.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];
      setTeamOptions(getTeam);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching users  for options
  const fetchUsers = async (e) => {
    try {
      let res_emp = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getCompanyBranch = res_emp.data.users.filter(
        (data) => data.team == e.value
      );

      const getUser = [
        ...getCompanyBranch.map((d) => ({
          ...d,
          label: d.companyname,
          value: d.companyname,
        })),
      ];
      setUserOptions(getUser);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching shift for optionsd
  const fetchShift = async (e) => {

    try {

      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filterShit = res_emp.data.shifts.find(
        (data) => data.name == e.shifttiming
      );

      setApplyPermission({
        ...applypermission,
        employeename: e.value,
        employeeid: e.empcode,
        reportingto: e.reportingto,
        // shifttiming: e.shifttiming,
        // time: `${filterShit.fromhour}:${filterShit.frommin}:${filterShit.fromtime} to ${filterShit.tohour}:${filterShit.tomin}:${filterShit.totime}`,
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching shift for optionsd
  const fetchShiftEdit = async (e) => {
    try {
      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filterShit = res_emp.data.shifts.find(
        (data) => data.name == e.shifttiming
      );
      setPermissionEdit({
        ...permissionedit,
        employeename: e.value,
        employeeid: e.empcode,
        reportingto: e.reportingto,
        shifttiming: e.shifttiming,
        time: `${filterShit.fromhour}:${filterShit.frommin}:${filterShit.fromtime} to ${filterShit.tohour}:${filterShit.tomin}:${filterShit.totime}`,
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // fetching shift for optionsd
  const fetchShiftuser = async (e) => {
    try {
      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filterShit = res_emp.data.shifts.find(
        (data) => data.name == isUserRoleAccess.shifttiming
      );
      // setGetTiming(
      //   `${filterShit.fromhour}:${filterShit.frommin}:${filterShit.fromtime} to ${filterShit.tohour}:${filterShit.tomin}:${filterShit.totime}`
      // );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    // fetchShiftuser();
  }, []);

  const [maxTime, setTimeMax] = useState("");
  const [minTime, setTimeMin] = useState("");
  const [showMinTime, setShowMinTime] = useState("");
  const [showMaxTime, setShowMaxTime] = useState("");

  const getTypeofHours = (e) => {
    if (getTiming === 'Week Off') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            style={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Week Dates!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {

      let timingShift = Accessdrop === "HR" ? applypermission.time : getTiming;

      if (!timingShift) {
        return ''
      }

      let splitedTime = timingShift.split("to");
      let setTimeBefore = splitedTime[0]?.trim();
      let setLastTime = splitedTime[1]?.trim();

      let isAMlast = setLastTime?.includes("PM");
      let [hoursl, minutesl] = setLastTime?.split(":").map(Number);

      let isAM = setTimeBefore?.includes("AM");
      let [hours, minutes] = setTimeBefore?.split(":").map(Number);

      if (!isAM && hoursl !== 12) {
        hours += 12;
      }

      if (!isAMlast && hours !== 12) {
        hours += 12;
      }
      const startTime = new Date(yyyy, 0, 1, hours, minutes);

      const endTime = new Date(yyyy, 0, 1, hoursl, minutesl);

      if (e === "startshift") {
        const beforeShiftTime = new Date(startTime.getTime());
        const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMinTime(
          beforeShiftTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMin(formattedEndTime);
        const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
        const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMaxTime(
          inBetweenTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMax(formattedEnd);
      } else if (e === "endshift") {
        const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
        const formattedEndTime = inBetweenTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMinTime(
          inBetweenTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMin(formattedEndTime);
        const maxBetween = new Date(inBetweenTime.getTime() + 4 * 60 * 60 * 1000);
        const formatMaxTime = maxBetween.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMaxTime(
          maxBetween.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMax(formatMaxTime);
      } else {
        const beforeShiftTime = new Date(startTime.getTime());
        const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMinTime(
          beforeShiftTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMin(formattedEndTime);
        const inBetweenTime = new Date(endTime.getTime());
        const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMaxTime(
          inBetweenTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMax(formattedEnd);
      }
    }

  };

  const [maxTimeEdit, setTimeMaxEdit] = useState("");
  const [minTimeEdit, setTimeMinEdit] = useState("");
  const [showMinTimeEdit, setShowMinTimeEdit] = useState("");
  const [showMaxTimeEdit, setShowMaxTimeEdit] = useState("");

  const getTypeofHoursEdit = (e) => {
    let timingShift = AccessdropEdit === "HR" ? permissionedit.time : getTiming;

    if (!timingShift) {
      return ''
    }

    let splitedTime = timingShift.split("to");
    let setTimeBefore = splitedTime[0]?.trim();
    let setLastTime = splitedTime[1]?.trim();

    let isAMlast = setLastTime.includes("PM");
    let [hoursl, minutesl] = setLastTime.split(":").map(Number);

    let isAM = setTimeBefore.includes("AM");
    let [hours, minutes] = setTimeBefore.split(":").map(Number);

    if (!isAM && hoursl !== 12) {
      hours += 12;
    }

    if (!isAMlast && hours !== 12) {
      hours += 12;
    }
    const startTime = new Date(yyyy, 0, 1, hours, minutes);

    const endTime = new Date(yyyy, 0, 1, hoursl, minutesl);

    if (e === "startshift") {
      const beforeShiftTime = new Date(startTime.getTime());
      const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMinTimeEdit(
        beforeShiftTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMinEdit(formattedEndTime);
      const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
      const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMaxTimeEdit(
        inBetweenTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMaxEdit(formattedEnd);
    } else if (e === "endshift") {
      const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
      const formattedEndTime = inBetweenTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMinTimeEdit(
        inBetweenTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMinEdit(formattedEndTime);
      const maxBetween = new Date(inBetweenTime.getTime() + 4 * 60 * 60 * 1000);
      const formatMaxTime = maxBetween.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMaxTimeEdit(
        maxBetween.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMaxEdit(formatMaxTime);
    } else {
      const beforeShiftTime = new Date(startTime.getTime());
      const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMinTimeEdit(
        beforeShiftTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMinEdit(formattedEndTime);
      const inBetweenTime = new Date(endTime.getTime());
      const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMaxTimeEdit(
        inBetweenTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMaxEdit(formattedEnd);
    }
  };


  const getRequestHours = (e) => {
    const requestedValue = e.target.value;
    const time = applypermission.fromtime;
    const startTime = new Date(`2022-01-01T${time}:00`); // Replace `yyyy` with a fixed year for now

    let endTime;

    if (type === "Minutes") {
      endTime = new Date(startTime.getTime() + requestedValue * 60 * 1000);
    } else { // default to hours
      endTime = new Date(startTime.getTime() + requestedValue * 60 * 60 * 1000);
    }

    const formattedEndTime = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setApplyPermission({
      ...applypermission,
      requesthours: requestedValue,
      endtime: formattedEndTime,
    });
  };

  const getRequestHoursEdit = (e) => {
    const requestedValue = e.target.value;
    const time = permissionedit.fromtime;
    const startTime = new Date(`2022-01-01T${time}:00`); // Replace `yyyy` with a fixed year for now

    let endTime;

    if (leaveEdit === "Minutes") {
      endTime = new Date(startTime.getTime() + requestedValue * 60 * 1000);
    } else { // default to hours
      endTime = new Date(startTime.getTime() + requestedValue * 60 * 60 * 1000);
    }

    const formattedEndTime = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setPermissionEdit({
      ...permissionedit,
      requesthours: requestedValue,
      endtime: formattedEndTime,
    });
  };

  const getRequestFormat = (e) => {
    if (applypermission.requesthours.length > 0) {
      const requestedHours = applypermission.requesthours;
      const time = e.target.value;

      const startTime = new Date(`${yyyy}-01-01T${time}:00`);

      const endTime = new Date(
        startTime.getTime() + requestedHours * 60 * 60 * 1000
      );

      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setApplyPermission({
        ...applypermission,
        fromtime: e.target.value,
        endtime: formattedEndTime,
      });
    } else {
      setApplyPermission({ ...applypermission, fromtime: e.target.value });
    }
  };

  const getRequestFormatEdit = (e) => {
    if (permissionedit.requesthours.length > 0) {
      const requestedHours = permissionedit.requesthours;
      const time = e.target.value;

      const startTime = new Date(`${yyyy}-01-01T${time}:00`);

      const endTime = new Date(
        startTime.getTime() + requestedHours * 60 * 60 * 1000
      );

      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setPermissionEdit({
        ...permissionedit,
        fromtime: e.target.value,
        endtime: formattedEndTime,
      });
    } else {
      setPermissionEdit({ ...permissionedit, fromtime: e.target.value });
    }
  };

  let dateselect = new Date();
  dateselect.setDate(dateselect.getDate() + 3);
  var ddt = String(dateselect.getDate()).padStart(2, "0");
  var mmt = String(dateselect.getMonth() + 1).padStart(2, "0");
  var yyyyt = dateselect.getFullYear();
  let formattedDatet = yyyyt + "-" + mmt + "-" + ddt;

  let datePresent = new Date();
  var ddp = String(datePresent.getDate());
  var mmp = String(datePresent.getMonth() + 1);
  var yyyyp = datePresent.getFullYear();
  let formattedDatePresent = yyyyp + "-" + mmp + "-" + ddp;

  // Assuming applypermission.date is the "from date" and applypermission.todate is the "to date"
  const calculateDaysDifference = () => {
    const fromDate = new Date(applypermission.date).getTime();
    const toDate = new Date(applypermission.todate).getTime();

    if (!isNaN(fromDate) && !isNaN(toDate)) {
      // Calculate the number of days between the two dates
      const daysDifference = Math.floor(
        (toDate - fromDate) / (1000 * 60 * 60 * 24)
      );
      return daysDifference;
    }

    return 0; // Return 0 if either date is invalid
  };

  // Call the function and set the result in state or use it as needed

  //add function
  const sendRequest = async () => {
    try {
      let subprojectscreate = await axios.post(SERVICE.PERMISSION_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeename:
          Accessdrop === "HR"
            ? String(applypermission.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          Accessdrop === "HR"
            ? String(applypermission.employeeid)
            : isUserRoleAccess.empcode,
        permissiontype: String(type),
        applytype: String(applytype),
        shifttiming: String(
          Accessdrop === "HR"
            ? applypermission.shifttiming
            : isUserRoleAccess.shifttiming
        ),
        time: String(Accessdrop === "HR" ? applypermission.time : getTiming),
        companyname: String(
          Accessdrop === "HR" ? applypermission.companyname : ""
        ),
        branch: String(Accessdrop === "HR" ? applypermission.branch : ""),
        unit: String(Accessdrop === "HR" ? applypermission.unit : ""),
        team: String(Accessdrop === "HR" ? applypermission.team : ""),
        access: Accessdrop,
        date: String(applypermission.date),
        fromtime: String(applypermission.fromtime),
        requesthours: String(applypermission.requesthours),
        endtime: String(applypermission.endtime),
        reasonforpermission: String(applypermission.reasonforpermission),
        reportingto:
          Accessdrop === "HR"
            ? String(applypermission.reportingto)
            : isUserRoleAccess.reportingto,
        status: String("Applied"),
        rejectedreason: String(""),
        compensationapplytype: String(compensationValue === true ? applypermission.compensationapplytype : ''),
        compensationstatus: String(compensationValue === true ? 'Compensation' : ''),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyPermissions();
      settype("Hours");
      setApplytype("Please Select ApplyType");
      setBranchOptions([]);
      setUnitOptions([]);
      setTeamOptions([]);
      setUserOptions([]);
      setApplyPermission({
        ...applypermission,
        companyname: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employeename: "Please Select Employee Name",
        employeeid: "",
        permissiontype: "",
        date: "",
        fromtime: "",
        requesthours: "",
        endtime: "",
        reasonforpermission: "",
        reportingto: "",
        shifttiming: "",
        time: "",
      });
      setBtnSubmit(false);
      setShowAlert(
        <>
          <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>Added Successfully!</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { setBtnSubmit(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // //submit option for saving
  const handleSubmit = async (e) => {
    e.preventDefault();

    let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let empid = Accessdrop === 'HR' ? applypermission.employeeid : isUserRoleAccess.empcode;
    const [year, month, day] = applypermission.date?.split('-');
    let result = res_vendor?.data?.permissions.filter((d) => d.employeeid === empid && d.status !== 'Rejected');
    let matchedResult = result.filter((d) => {
      const [dataYear, dataMonth, dataDay] = d.date?.split('-');
      if (month === dataMonth && year === dataYear) {
        return d;
      }
    })

    // Convert minTime to 24-hour format
    let minTimeDate = new Date(`${yyyy}-01-01T${minTime}`);
    let minTime24Hrs = minTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert maxTime to 24-hour format
    let maxTimeDate = new Date(`${yyyy}-01-01T${maxTime}`);
    let maxTime24Hrs = maxTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert applypermission.fromtime to 24-hour format
    let selectedTimeDate = new Date(
      `${yyyy}-01-01T${applypermission.fromtime}`
    );
    let selectedTime24Hrs = selectedTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    const [hours1, minutes1, seconds1] = selectedTime24Hrs
      .split(":")
      .map(Number);
    const [hours2, minutes2, seconds2] = maxTime24Hrs.split(":").map(Number);
    const [hours3, minutes3, seconds3] = minTime24Hrs.split(":").map(Number);

    const isNameMatch = allpermissions.some(
      (item) =>
        item.employeename?.toLowerCase() ===
        isUserRoleAccess.companyname.toLowerCase() &&
        item.date === applypermission.date
    );
    const nameCheck = allpermissions.some(
      (item) =>
        item.company === applypermission.companyname &&
        item.branch === applypermission.branch &&
        item.team === applypermission.team &&
        item.employeename.toLowerCase() ===
        applypermission.employeename.toLowerCase() &&
        item.date === applypermission.date
    );

    // if (
    //   Accessdrop === "HR" &&
    //   applypermission.employeename === "Please Select Employee Name"
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Employee Name"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else 

    if (
      Accessdrop === "HR" &&
      applypermission.companyname === "Please Select Company"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "HR" &&
      applypermission.branch === "Please Select Branch"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "HR" &&
      applypermission.unit === "Please Select Unit"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "HR" &&
      applypermission.team === "Please Select Team"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "HR" &&
      applypermission.employeename === "Please Select Employee Name"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (applypermission.date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (applytype === "Please Select ApplyType") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Apply Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (type === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Permission Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (applypermission.fromtime === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (applypermission.requesthours == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Request Hours"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (applypermission.reasonforpermission === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason for Permission"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      applypermission.employeename === "Please Select Employee Name" &&
      isNameMatch
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Permission Was Already Added to this Employee to Date!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (nameCheck) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Permission Was Already Added to this Employee to Date!!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (applytype !== "inbetween" &&
        (applytype == "startshift" || applytype == "endshift") &&
        hours1 > hours2) ||
      (hours1 === hours2 && minutes1 > minutes2) ||
      (hours1 === hours2 && minutes1 === minutes2 && seconds1 > seconds2) ||
      hours1 < hours3 ||
      (hours1 === hours3 && minutes1 < minutes3) ||
      (hours1 === hours3 && minutes1 === minutes3 && seconds1 < seconds3)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`Select the time between  ${showMinTime} and ${showMaxTime}`}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (matchedResult.length > parseInt(res?.data?.attendancecontrolcriteria[0].permissionpermonthduration) && compensationValue === false) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {'Please Select Compensation Type'}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (applypermission.compensationapplytype === '') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {'Please Select Compensation Type'}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (applypermission.shifttiming === '' || applypermission.time === '' || getTiming === '') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {'Shift is not alloted for the selected date. Please select another date'}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      setBtnSubmit(true);
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    settype("Hours");
    setApplytype("Please Select ApplyType");
    setApplyPermission({
      ...applypermission,
      companyname: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      employeename: "Please Select Employee Name",
      employeeid: "",
      permissiontype: "",
      date: "",
      fromtime: "",
      requesthours: "",
      endtime: "",
      reasonforpermission: "",
      reportingto: "",
      shifttiming: "",
      time: "",
    });
    setBranchOptions([]);
    setUnitOptions([]);
    setTeamOptions([]);
    setUserOptions([]);
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // Compensation model
  const [compensationValue, setCompensationValue] = useState(false);
  const [isCompensationOpen, setIsCompensationOpen] = useState(false);
  const handleClickOpenCompensation = () => {
    setIsCompensationOpen(true);
  };
  const handleCloseModCompensation = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsCompensationOpen(false);
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

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setPermissionEdit(res?.data?.sPermission);
      setLeaveId(res?.data?.sPermission._id);
      setAccesDropEdit(res?.data?.sPermission.access);
      setLeaveEdit(res?.data?.sPermission.permissiontype);
      setApplytypeEdit(res?.data?.sPermission.applytype);
      setPermissionSelf(res?.data?.sPermission);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPermissionEdit(res?.data?.sPermission);
      setApplytypeEdit(res?.data?.sPermission.applytype);
      setLeaveEdit(res?.data?.sPermission.permissiontype);
      setAccesDropEdit(res?.data?.sPermission.access);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPermissionEdit(res?.data?.sPermission);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const getinfoCodeStatus = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSelectStatus(res?.data?.sPermission);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchCategoryTicket();
    fetchCompany();
  }, []);

  //Project updateby edit page...
  let updateby = permissionedit?.updatedby;
  let addedby = permissionedit?.addedby;
  let updatedByStatus = selectStatus.updatedby;

  let subprojectsid = permissionedit?._id;

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.PERMISSION_SINGLE}/${leaveId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeename:
          AccessdropEdit === "HR"
            ? String(permissionedit.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          AccessdropEdit === "HR"
            ? String(permissionedit.employeeid)
            : isUserRoleAccess.empcode,
        permissiontype: String(leaveEdit),
        applytype: String(applytypeEdit),
        date: String(permissionedit.date),
        shifttiming: String(
          Accessdrop === "HR"
            ? permissionedit.shifttiming
            : isUserRoleAccess.shifttiming
        ),
        time: String(Accessdrop === "HR" ? permissionedit.time : getTiming),
        reasonforpermission: String(permissionedit.reasonforpermission),
        reportingto:
          AccessdropEdit === "HR"
            ? String(permissionedit.reportingto)
            : isUserRoleAccess.reportingto,
        companyname: String(
          AccessdropEdit === "HR" ? permissionedit.companyname : ""
        ),
        branch: String(AccessdropEdit === "HR" ? permissionedit.branch : ""),
        unit: String(AccessdropEdit === "HR" ? permissionedit.unit : ""),
        team: String(AccessdropEdit === "HR" ? permissionedit.team : ""),
        access: AccessdropEdit,
        fromtime: String(permissionedit.fromtime),
        requesthours: String(permissionedit.requesthours),
        endtime: String(permissionedit.endtime),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyPermissions();
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Succesfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditStatus = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.PERMISSION_SINGLE}/${selectStatus._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String(selectStatus.status),
          rejectedreason: String(
            selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""
          ),
          actionby: String(isUserRoleAccess.companyname),
          updatedby: [
            ...updatedByStatus,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchApplyPermissions();
      handleStatusClose();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // const editStatus = () => {
  //   if (selectStatus.status == "Rejected") {
  //     if (selectStatus.rejectedreason == "") {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Please Enter Rejected Reason"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       sendEditStatus();
  //     }
  //   } else {
  //     sendEditStatus();
  //   }
  // };

  const editStatus = () => {
    if (selectStatus.status == "Rejected") {
      if (selectStatus.rejectedreason == "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Rejected Reason"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        sendEditStatus();
      }
    }
    else if (selectStatus.status == "Approved") {
      if (isCheckList) {
        handleClickOpenEditCheckList();
      } else {
        sendEditStatus();
      }

    }
    else {
      sendEditStatus();
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchApplyleaveAll();

    // Convert minTime to 24-hour format
    let minTimeDate = new Date(`${yyyy}-01-01T${minTimeEdit}`);
    let minTime24Hrs = minTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert maxTime to 24-hour format
    let maxTimeDate = new Date(`${yyyy}-01-01T${maxTimeEdit}`);
    let maxTime24Hrs = maxTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert applypermission.fromtime to 24-hour format
    let selectedTimeDate = new Date(`${yyyy}-01-01T${permissionedit.fromtime}`);
    let selectedTime24Hrs = selectedTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });
    const [hours1, minutes1, seconds1] = selectedTime24Hrs
      .split(":")
      .map(Number);
    const [hours2, minutes2, seconds2] = maxTime24Hrs.split(":").map(Number);
    const [hours3, minutes3, seconds3] = minTime24Hrs.split(":").map(Number);

    const isNameMatch = allApplyleaveedit.some((item) =>
      (item.employeename?.toLowerCase() === Accessdrop) === "HR"
        ? applypermission.employeename?.toLowerCase()
        : isUserRoleAccess.companyname && item.date === applypermission.date
    );
    const nameCheck = allApplyleaveedit.some(
      (item) =>
        item.company === permissionedit.company &&
        item.branch === permissionedit.branch &&
        item.team === permissionedit.team &&
        item.employeename.toLowerCase() ===
        permissionedit.employeename.toLowerCase() &&
        item.date === permissionedit.date
    );
    if (
      AccessdropEdit === "HR" &&
      permissionedit.employeename === "Please Select Employee Name"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.company === "Please Select Company"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.branch === "Please Select Branch"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.unit === "Please Select Unit"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.team === "Please Select Team"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (applytypeEdit === "Please Select ApplyType") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Apply Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (leaveEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Permission Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (permissionedit.date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (permissionedit.fromtime === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (permissionedit.requesthours == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Request Hours"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (permissionedit.reasonforpermission === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason for Permission"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      allApplyleaveedit == "Please Select Employee Name" &&
      isNameMatch
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Permission Was Already Added to this Employee to Date!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (nameCheck) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Permission Was Already Added to this Employee to Date!!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (applytypeEdit !== "inbetween" &&
        (applytypeEdit == "startshift" || applytypeEdit == "endshift") &&
        hours1 > hours2) ||
      (hours1 === hours2 && minutes1 > minutes2) ||
      (hours1 === hours2 && minutes1 === minutes2 && seconds1 > seconds2) ||
      hours1 < hours3 ||
      (hours1 === hours3 && minutes1 < minutes3) ||
      (hours1 === hours3 && minutes1 === minutes3 && seconds1 < seconds3)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`Select the time between ${showMinTimeEdit} and ${showMaxTimeEdit}`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
      // await fetchApplyPermissions();
    }
  };

  //get all Sub vendormasters.
  const fetchApplyleave = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setApplyleavecheck(true);
      let answer =
        isUserRoleAccess?.role?.includes("Manager") ||
          isUserRoleAccess?.role?.includes("HiringManager") ||
          isUserRoleAccess?.role?.includes("HR") ||
          isUserRoleAccess?.role?.includes("Superadmin")
          ? res_vendor?.data?.applyleaves
          : res_vendor?.data?.applyleaves.filter(
            (data) => data.employeename === isUserRoleAccess.companyname
          );
      setApplyleaves(answer);
    } catch (err) { setApplyleavecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchApplyPermissions = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setApplyleavecheck(true);
      let answer =
        isUserRoleAccess?.role?.includes("Manager") ||
          isUserRoleAccess?.role?.includes("HiringManager") ||
          isUserRoleAccess?.role?.includes("HR") ||
          isUserRoleAccess?.role?.includes("Superadmin")
          ? res_vendor?.data?.permissions
          : res_vendor?.data?.permissions.filter(
            (data) => data.employeename === isUserRoleAccess.companyname
          );
      setPermissions(answer);
      let Approve =
        isUserRoleAccess?.role?.includes("Manager") ||
          isUserRoleAccess?.role?.includes("HiringManager") ||
          isUserRoleAccess?.role?.includes("HR") ||
          isUserRoleAccess?.role?.includes("Superadmin")
          ? res_vendor?.data?.permissions.filter(
            (data) => data.status === "Approved"
          )
          : res_vendor?.data?.permissions.filter(
            (data) =>
              data.employeename === isUserRoleAccess.companyname &&
              data.status === "Approved"
          );
      setIsPermissions(Approve);
    } catch (err) { setApplyleavecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchApplyPermissions();
  }, []);

  //get all Sub vendormasters.
  const fetchApplyleaveAll = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllApplyleaveedit(
        res_vendor?.data?.permissions.filter(
          (item) => item._id !== permissionedit._id
        )
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Excel
  const fileName = "Apply Permission";
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
          "SNo": index + 1,
          "Employee Name": t.employeename,
          "Employee Id": t.employeeid,
          "Date": t.date,
          "From Time": t.fromtime,
          "Request Hours": t.requesthours,
          "End Time": t.endtime,
          "Reason for Permission": t.reasonforpermission,
          "Status": t.status,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        permissions.map((t, index) => ({
          "SNo": index + 1,
          "Employee Name": t.employeename,
          "Employee Id": t.employeeid,
          "Date": moment(t.date).format('DD-MM-YYYY'),
          "From Time": t.fromtime,
          "Request Hours": t.requesthours,
          "End Time": t.endtime,
          "Reason for Permission": t.reasonforpermission,
          "Status": t.status,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Apply Permission",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "SNo", field: "serialNumber" },
    { title: "Employee Id", field: "employeeid" },
    { title: "Employee Name", field: "employeename" },
    { title: "Date", field: "date" },
    { title: "From Time", field: "fromtime" },
    { title: "Request Hours", field: "requesthours" },
    { title: "End Time", field: "endtime" },
    { title: "Reason For Permission", field: "reasonforpermission" },
    { title: "Status", field: "status" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      permissions.map(row => ({ ...row, serialNumber: serialNumberCounter++, date: moment(row.date).format('DD-MM-YYYY') }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: dataWithSerial,
    });

    doc.save("Apply Permission.pdf");
  };

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    // getexcelDatas();
  }, [permissionedit, applypermission, applyleaves]);

  useEffect(() => {
    fetchApplyleave();
    fetchApplyleaveAll();
  }, []);

  useEffect(() => {
    fetchApplyleaveAll();
  }, [isEditOpen, permissionedit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = permissions?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [permissions]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "employeename",
      headerName: "Employee Name",
      flex: 0,
      width: 130,
      hide: !columnVisibility.employeename,
      headerClassName: "bold-header",
    },
    {
      field: "employeeid",
      headerName: "Employee Id",
      flex: 0,
      width: 160,
      hide: !columnVisibility.employeeid,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "fromtime",
      headerName: "From Time",
      flex: 0,
      width: 90,
      hide: !columnVisibility.fromtime,
      headerClassName: "bold-header",
    },
    {
      field: "requesthours",
      headerName: "Request Hours",
      flex: 0,
      width: 70,
      hide: !columnVisibility.requesthours,
      headerClassName: "bold-header",
    },
    {
      field: "endtime",
      headerName: "End Time",
      flex: 0,
      width: 90,
      hide: !columnVisibility.endtime,
      headerClassName: "bold-header",
    },
    {
      field: "reasonforpermission",
      headerName: "Reason for Permission",
      flex: 0,
      width: 180,
      hide: !columnVisibility.reasonforpermission,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            backgroundColor:
              params.value === "Applied"
                ? "#FFC300"
                : params.value === "Rejected"
                  ? "red"
                  : params.value === "Approved"
                    ? "green"
                    : "inherit",
            color:
              params.value === "Applied"
                ? "black"
                : params.value === "Rejected"
                  ? "white"
                  : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
            cursor: 'default'
          }}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {(!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          ) &&
            ["Approved", "Rejected"].includes(params.row.status)) ||
            (isUserRoleCompare?.includes("eapplypermission") && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpenEdit();
                  getCode(params.row.id);
                }}
              >
                <EditOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            ))} */}
          {(!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          ) &&
            ["Approved", "Rejected"].includes(params.row.status)) ||
            (isUserRoleCompare?.includes("dapplypermission") && (
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  rowData(params.row.id, params.row.name);
                }}
              >
                <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            ))}
          {isUserRoleCompare?.includes("vapplypermission") && (
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
          {(!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          ) &&
            ["Approved", "Rejected"].includes(params.row.status)) ||
            (isUserRoleCompare?.includes("iapplypermission") && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpeninfo();
                  getinfoCode(params.row.id);
                }}
              >
                <InfoOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            ))}
          {!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          )
            ? null
            : isUserRoleCompare?.includes("iapplypermission") && (
              <Button
                variant="contained"
                style={{
                  backgroundColor: "red",
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                onClick={(e) => {
                  getinfoCodeStatus(params.row.id);
                  handleStatusOpen();
                  getCodeNew(params.row);
                }}
              >
                <FaEdit style={{ color: "white", fontSize: "17px" }} />
              </Button>
            )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    const militaryTime = item.fromtime;
    const militaryTimeArray = militaryTime.split(":");
    const hours = parseInt(militaryTimeArray[0], 10);
    const minutes = militaryTimeArray[1];

    const convertedTime = new Date(
      yyyy,
      0,
      1,
      hours,
      minutes
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeeid: item.employeeid,
      employeename: item.employeename,
      fromtime: convertedTime,
      date: moment(item.date).format("DD-MM-YYYY"),
      endtime: item.endtime,
      requesthours: item.requesthours,
      reasonforpermission: item.reasonforpermission,
      status: item.status,
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

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  const DateFrom =
    (isUserRoleAccess.role.includes("HiringManager") ||
      isUserRoleAccess.role.includes("HR") ||
      isUserRoleAccess.role.includes("Manager") ||
      isUserRoleCompare.includes("lapplypermission")) &&
      Accessdrop === "HR"
      ? formattedDatePresent
      : formattedDatet;

  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box
      style={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
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
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
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
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
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



  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ApplyPermission.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"Apply Permission"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Apply Permission</Typography>
      {isUserRoleCompare?.includes("aapplyleave") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  {" "}
                  Add Apply Permission
                </Typography>
              </Grid>
              {(isUserRoleAccess.role.includes("HiringManager") ||
                isUserRoleAccess.role.includes("HR") ||
                isUserRoleAccess.role.includes("Manager") ||
                isUserRoleCompare.includes("lassignleaveapply")) && (
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Access</Typography>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          setApplyPermission({
                            ...applypermission,
                            date: "",
                            todate: "",
                          });
                        }}
                      >
                        <MenuItem value={"Employee"}>Self</MenuItem>
                        <MenuItem value={"HR"}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
            </Grid>
            <br />
            <Grid container spacing={2}>
              {Accessdrop === "HR" ? (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={company}
                        styles={colourStyles}
                        value={{
                          label: applypermission.companyname,
                          value: applypermission.companyname,
                        }}
                        onChange={(e) => {
                          setApplyPermission({
                            ...applypermission,
                            companyname: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            team: "Please Select Team",
                            employeename: "Please Select Employee Name",
                            employeeid: "",
                            date: '',
                            applytype: 'Please Select Apply Type',
                            permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', reasonforpermission: '',
                            reportingto: '', shifttiming: '', time: ''
                          });
                          fetchBranch(e);
                          setUnitOptions([]);
                          setTeamOptions([]);
                          setUserOptions([]);

                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={branchOptions}
                        styles={colourStyles}
                        value={{
                          label: applypermission.branch,
                          value: applypermission.branch,
                        }}
                        onChange={(e) => {
                          setApplyPermission({
                            ...applypermission,
                            branch: e.value,
                            unit: "Please Select Unit",
                            team: "Please Select Team",
                            employeename: "Please Select Employee Name",
                            employeeid: "",
                            date: '',
                            applytype: 'Please Select Apply Type',
                            permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', reasonforpermission: '',
                            reportingto: '', shifttiming: '', time: ''
                          });
                          fetchUnit(e);
                          setTeamOptions([]);
                          setUserOptions([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={unitOptions}
                        styles={colourStyles}
                        value={{
                          label: applypermission.unit,
                          value: applypermission.unit,
                        }}
                        onChange={(e) => {
                          setApplyPermission({
                            ...applypermission,
                            unit: e.value,
                            employeeid: e.empcode,
                            team: "Please Select Team",
                            employeename: "Please Select Employee Name",
                            employeeid: "",
                            date: '',
                            applytype: 'Please Select Apply Type',
                            permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', reasonforpermission: '',
                            reportingto: '', shifttiming: '', time: ''
                          });
                          fetchTeam(e);
                          setUserOptions([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={teamOptions}
                        styles={colourStyles}
                        value={{
                          label: applypermission.team,
                          value: applypermission.team,
                        }}
                        onChange={(e) => {
                          setApplyPermission({
                            ...applypermission,
                            team: e.value,
                            employeename: "Please Select Employee Name",
                            employeeid: "",
                            date: '',
                            applytype: 'Please Select Apply Type',
                            permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', reasonforpermission: '',
                            reportingto: '', shifttiming: '', time: ''
                          });
                          fetchUsers(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={userOptions}
                        styles={colourStyles}
                        value={{
                          label: applypermission.employeename,
                          value: applypermission.employeename,
                        }}
                        onChange={(e) => {
                          // setApplyPermission({ ...applypermission, employeename: e.value, employeeid: e.empcode, reportingto: e.reportingto, date: formattedDate, shifttiming: e.shifttiming });
                          setApplyPermission({
                            ...applypermission, employeename: e.value, employeeid: e.empcode,
                            date: '',
                            applytype: 'Please Select Apply Type',
                            permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', reasonforpermission: '',
                            reportingto: e.reportingto, shifttiming: '', time: ''
                          });
                          // fetchShift(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee ID </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={applypermission.employeeid}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={isUserRoleAccess.companyname}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee ID </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={isUserRoleAccess.empcode}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Date <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={applypermission.date}
                    onChange={(e) => {
                      if (
                        isUserRoleAccess?.role?.includes("Employee") &&
                        formattedDate <= e.target.value
                      ) {
                        setApplyPermission({
                          ...applypermission,
                          date: e.target.value,
                        });
                      } else if (
                        !isUserRoleAccess?.role?.includes("Employee")
                      ) {
                        setApplyPermission({
                          ...applypermission,
                          date: e.target.value,
                        });
                      }
                      fetchAttendanceCriterias(
                        Accessdrop === "HR" ? applypermission.employeeid : isUserRoleAccess.empcode,
                        e.target.value
                      )
                      // fetchShiftuser(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Apply Type<b style={{ color: "red" }}>*</b>
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
                    value={applytype}
                    onChange={(e) => {
                      if (applypermission.date === "") {
                        setShowAlert(
                          <>
                            <ErrorOutlineOutlinedIcon
                              style={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                              {"Please Select Date!"}
                            </p>
                          </>
                        );
                        handleClickOpenerr();
                      } else {
                        setApplytype(e.target.value);
                        getTypeofHours(e.target.value);
                      }

                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="Please Select ApplyType" disabled>
                      {" "}
                      {"Please Select ApplyType"}{" "}
                    </MenuItem>
                    <MenuItem value="startshift"> {"Start Shift"} </MenuItem>
                    <MenuItem value="inbetween"> {"In Between"} </MenuItem>
                    <MenuItem value="endshift"> {"End Shift"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Permission Type<b style={{ color: "red" }}>*</b>
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
                    value={type}
                    onChange={(e) => {
                      settype(e.target.value);
                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="HalfDay"> {"Half Day"} </MenuItem>
                    <MenuItem value="Hours"> {"Hours"} </MenuItem>
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  From Time <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    value={applypermission.fromtime}
                    onChange={(e) => {
                      getRequestFormat(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Request Hours <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={applypermission.requesthours}
                    onChange={(e) => {
                      getRequestHours(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  End Time <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    value={
                      applypermission.endtime == "Invalid Date" || undefined
                        ? ""
                        : applypermission.requesthours.length == 0
                          ? ""
                          : applypermission.endtime
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reason for Permission<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={applypermission.reasonforpermission}
                    onChange={(e) => {
                      setApplyPermission({
                        ...applypermission,
                        reasonforpermission: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Reporting To </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      Accessdrop === "HR"
                        ? applypermission.reportingto
                        : isUserRoleAccess.reportingto
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Shift </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      Accessdrop === "HR"
                        ? applypermission.shifttiming
                        : isUserRoleAccess.shifttiming
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Timing </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      Accessdrop === "HR" ? applypermission.time : getTiming
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                {/* {isUserRoleCompare?.includes("aapplyleave") && ( */}
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button> */}
                <LoadingButton loading={btnSubmit} variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </LoadingButton>
                {/* )} */}
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                {/* {isUserRoleCompare?.includes("aapplyleave") && ( */}
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  Clear
                </Button>
                {/* )} */}
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <br />
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "scroll",
            "& .MuiPaper-root": {
              overflow: "scroll",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form
              // onSubmit={editSubmit}
              >
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={8} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Apply Permission
                    </Typography>
                  </Grid>
                  {(isUserRoleAccess.role.includes("HiringManager") ||
                    isUserRoleAccess.role.includes("HR") ||
                    isUserRoleAccess.role.includes("Manager") ||
                    isUserRoleCompare.includes("lassignleaveapply")) && (
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Access</Typography>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={AccessdropEdit}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                },
                              },
                            }}
                            onChange={(e) => {
                              setAccesDropEdit(e.target.value);
                              setBranchOptions([]);
                              setUnitOptions([]);
                              setTeamOptions([]);
                              setUserOptions([]);
                              if (e.target.value === "HR") {
                                setPermissionEdit({
                                  ...permissionedit,
                                  shifttiming: "",
                                  time: "",
                                  reportingto: "",
                                  date: "",
                                  companyname: "Please Select Company Name",
                                  branch: "Please Select Branch ",
                                  unit: "Please Select Unit",
                                  team: "Please Select Team",
                                  employeename: "Please Select Employee Name",
                                  employeeid: "",
                                });
                              } else {
                                setPermissionEdit({
                                  ...permissionedit,
                                  date: permissionSelf.date,
                                  shifttiming: isUserRoleAccess.shifttiming,
                                  time: getTiming,
                                  reportingto: isUserRoleAccess.reportingto,
                                  employeename: isUserRoleAccess.companyname,
                                  employeeid: isUserRoleAccess.empcode,
                                });
                              }
                            }}
                          >
                            <MenuItem value={"Employee"}>Self</MenuItem>
                            <MenuItem value={"HR"}>Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                </Grid>
                <br />
                <Grid container spacing={2}>
                  {AccessdropEdit === "HR" ? (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Company<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={company}
                            styles={colourStyles}
                            value={{
                              label: permissionedit.companyname,
                              value: permissionedit.companyname,
                            }}
                            onChange={(e) => {
                              setPermissionEdit({
                                ...permissionedit,
                                companyname: e.value,
                                branch: "Please Select Branch",
                                unit: "Please Select Unit",
                                team: "Please Select Team",
                                employeename: "Please Select Employee Name",
                              });
                              fetchBranch(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Branch<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={branchOptions}
                            styles={colourStyles}
                            value={{
                              label: permissionedit.branch,
                              value: permissionedit.branch,
                            }}
                            onChange={(e) => {
                              setPermissionEdit({
                                ...permissionedit,
                                branch: e.value,
                                unit: "Please Select Unit",
                                team: "Please Select Team",
                                employeename: "Please Select Employee Name",
                              });
                              fetchUnit(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Unit<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={unitOptions}
                            styles={colourStyles}
                            value={{
                              label: permissionedit.unit,
                              value: permissionedit.unit,
                            }}
                            onChange={(e) => {
                              setPermissionEdit({
                                ...permissionedit,
                                unit: e.value,
                                team: "Please Select Team",
                                employeename: "Please Select Employee Name",
                              });
                              fetchTeam(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Team<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={teamOptions}
                            styles={colourStyles}
                            value={{
                              label: permissionedit.team,
                              value: permissionedit.team,
                            }}
                            onChange={(e) => {
                              setPermissionEdit({
                                ...permissionedit,
                                team: e.value,
                                employeename: "Please Select Employee Name",
                              });
                              fetchUsers(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Employee Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={userOptions}
                            styles={colourStyles}
                            value={{
                              label: permissionedit?.employeename,
                              value: permissionedit?.employeename,
                            }}
                            onChange={(e) => {
                              fetchShiftEdit(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Employee ID </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={permissionedit.employeeid}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Employee Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={permissionedit?.employeename}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Employee ID </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={permissionedit?.employeeid}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Apply Type<b style={{ color: "red" }}>*</b>
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
                        value={applytypeEdit}
                        onChange={async (e) => {
                          setApplytypeEdit(e.target.value);
                          // await fetchShiftuser();
                          getTypeofHoursEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Please Select ApplyType" disabled>
                          {" "}
                          {"Please Select ApplyType"}{" "}
                        </MenuItem>
                        <MenuItem value="startshift">
                          {" "}
                          {"Start Shift"}{" "}
                        </MenuItem>
                        <MenuItem value="inbetween"> {"In Between"} </MenuItem>
                        <MenuItem value="endshift"> {"End Shift"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Permission Type<b style={{ color: "red" }}>*</b>
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
                        value={leaveEdit}
                        onChange={(e) => {
                          setLeaveEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="HalfDay"> {"Half Day"} </MenuItem>
                        <MenuItem value="Hours"> {"Hours"} </MenuItem>
                        <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <br />
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Date <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={permissionedit.date}
                        min={
                          isUserRoleAccess?.role?.includes("Employee")
                            ? formattedDate
                            : undefined
                        }
                        onChange={(e) => {
                          if (
                            isUserRoleAccess?.role?.includes("Employee") &&
                            formattedDate <= e.target.value
                          ) {
                            setPermissionEdit({
                              ...permissionedit,
                              date: e.target.value,
                            });
                          } else if (
                            !isUserRoleAccess?.role?.includes("Employee")
                          ) {
                            setPermissionEdit({
                              ...permissionedit,
                              date: e.target.value,
                            });
                          }
                          setPermissionEdit({
                            ...permissionedit,
                            date: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      From Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        value={permissionedit.fromtime}
                        onChange={(e) => {
                          getRequestFormatEdit(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Request Hours <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={permissionedit.requesthours}
                        onChange={(e) => {
                          getRequestHoursEdit(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      End Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        value={
                          permissionedit.endtime === "Invalid Date" ||
                            permissionedit.endtime === undefined
                            ? ""
                            : permissionedit.requesthours.length === 0
                              ? ""
                              : permissionedit.endtime
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reason for Permission<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={permissionedit.reasonforpermission}
                        onChange={(e) => {
                          setPermissionEdit({
                            ...permissionedit,
                            reasonforpermission: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Reporting To </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          AccessdropEdit === "HR"
                            ? permissionedit.reportingto
                            : isUserRoleAccess.reportingto
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Shift </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          AccessdropEdit === "HR"
                            ? permissionedit.shifttiming
                            : isUserRoleAccess.shifttiming
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Timing </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          AccessdropEdit === "HR"
                            ? permissionedit.time
                            : getTiming
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" onClick={editSubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      {/* Compensation Model */}
      <Box>
        <Dialog
          open={isCompensationOpen}
          onClose={handleCloseModCompensation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="sm"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form >
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={8} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}> Compensation </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Compensation Type<b style={{ color: "red" }}>*</b>
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
                        value={applypermission.compensationapplytype}
                        onChange={(e) => { setApplyPermission({ ...applypermission, compensationapplytype: e.target.value }); }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="startshift"> {"Start Shift"} </MenuItem>
                        <MenuItem value="endshift"> {"End Shift"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" onClick={(e) => {
                      handleCloseModCompensation();
                      setCompensationValue(true)
                    }}
                    > Ok </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={(e) => {
                        setApplyPermission({ ...applypermission, compensationapplytype: '' });
                        handleCloseModCompensation();
                        setCompensationValue(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lapplypermission") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Apply Permission List
              </Typography>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
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
                    {/* <MenuItem value={applyleaves?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>
                  {isUserRoleCompare?.includes("excelapplypermission") && (
                    <>
                      {/* <ExportXL csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvapplypermission") && (
                    <>
                      {/* <ExportCSV csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printapplypermission") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfapplypermission") && (
                    <>
                      {/* <Button
                        sx={userStyle.buttongrp}
                        onClick={() => downloadPdf()}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button> */}
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)

                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageapplypermission") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </FormControl>
                </Box>
              </Grid>
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
            {isUserRoleCompare?.includes("bdapplypermission") && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              </>
            )}
            <br />
            <br />
            {!applyleaveCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              </>
            ) : (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )}
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
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <FirstPageIcon />
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateNextIcon />
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
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
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delApply(Applysid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Apply Permission Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Updated by</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <Grid container spacing={2}>
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell> SNo</TableCell>
                <TableCell> Employee Id</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>From Time</TableCell>
                <TableCell>Request Hours</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Reason For Permission</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.employeeid}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.fromtime}</TableCell>
                    <TableCell>{row.requesthours}</TableCell>
                    <TableCell>{row.endtime}</TableCell>
                    <TableCell>{row.reasonforpermission}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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



      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px" }}>
          <>
            <form
            // onSubmit={editSubmit}
            >
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    View Apply Permission
                  </Typography>
                </Grid>
                {(isUserRoleAccess.role.includes("HiringManager") ||
                  isUserRoleAccess.role.includes("HR") ||
                  isUserRoleAccess.role.includes("Manager") ||
                  isUserRoleCompare.includes("lassignleaveapply")) && (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Access</Typography>

                        <OutlinedInput
                          value={AccessdropEdit === "HR" ? "Other" : "Self"}
                        />
                      </FormControl>
                    </Grid>
                  )}
              </Grid>
              <br />
              <Grid container spacing={2}>
                {AccessdropEdit === "HR" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput value={permissionedit.companyname} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput value={permissionedit.branch} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput readOnly value={permissionedit.unit} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput readOnly value={permissionedit.team} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={permissionedit.employeename}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          readOnly
                          type="text"
                          value={permissionedit.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={permissionedit.employeename}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={permissionedit.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={permissionedit.date}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Apply Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={applytypeEdit} readOnly />
                  </FormControl>
                </Grid>
                {permissionedit.compensationstatus === 'Compensation' ? (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Compensation Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput value={permissionedit.compensationapplytype} readOnly />
                    </FormControl>
                  </Grid>
                ) : null}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Permission Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={leaveEdit} />
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    From Time <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      value={permissionedit.fromtime}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Request Hours <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={permissionedit.requesthours}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    End Time <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      value={
                        permissionedit.endtime == "Invalid Date" || undefined
                          ? ""
                          : permissionedit.endtime
                      }
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Permission<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={permissionedit.reasonforpermission}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Reporting To </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={permissionedit.reportingto}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Shift </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={permissionedit.shifttiming}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Timing </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={permissionedit.time}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <Button variant="contained" onClick={handleCloseview}>
                    Back
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </form>
          </>
        </Box>
      </Dialog>

      {/* dialog status change */}
      <Box>
        <Dialog
          maxWidth="lg"
          open={statusOpen}
          onClose={handleStatusClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "600px",
              height: selectStatus.status == "Rejected" ? "260px" : "220px",
              overflow: "visible",
              "& .MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Apply Status
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Status<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    fullWidth
                    options={[
                      { label: "Approved", value: "Approved" },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Applied", value: "Applied" },
                    ]}
                    value={{
                      label: selectStatus.status,
                      value: selectStatus.value,
                    }}
                    onChange={(e) => {
                      setSelectStatus({ ...selectStatus, status: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={6} xs={12}></Grid>
              <Grid item md={12} sm={12} xs={12}>
                {selectStatus.status == "Rejected" ? (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Rejected<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={selectStatus.rejectedreason}
                      onChange={(e) => {
                        setSelectStatus({
                          ...selectStatus,
                          rejectedreason: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                ) : null}
              </Grid>
            </Grid>
          </DialogContent>
          {selectStatus.status == "Rejected" ? <br /> : null}
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                editStatus();
                // handleCloseerrpop();
              }}
            >
              Update
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
              onClick={() => {
                handleStatusClose();
                setSelectStatus({});
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
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

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delApplycheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
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
        <Dialog open={isEditOpenCheckList} onClose={handleCloseModEditCheckList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl" fullWidth={true} sx={{
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'auto',
          },
        }}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.SubHeaderText} onClick={() => { console.log(groupDetails); console.log(assignDetails); console.log(datasAvailedDB); console.log(isCheckedList) }}>
                My Check List
              </Typography>
              <br />
              <br />
              <Grid container spacing={2} >
                <Grid item md={12} xs={12} sm={12} >
                  <FormControl fullWidth size="small" sx={{ display: 'flex', justifyContent: 'center', border: '1px solid black', borderRadius: '20px' }} >
                    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }} onClick={() => { console.log(dateValueRandom); console.log(timeValueRandom) }}>
                      Candidate Name: <span style={{ fontWeight: '500', fontSize: '1.2rem', display: 'inline-block', textAlign: 'center' }}> {`${getDetails?.employeename}`}</span>
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead >
                    <TableRow>

                      <TableCell style={{ fontSize: '1.2rem' }}>
                        <Checkbox onChange={() => { overallCheckListChange() }} checked={isCheckedListOverall} />
                      </TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Action</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>


                      {/* Add more table headers as needed */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupDetails?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: '1.2rem' }}>
                          <Checkbox onChange={() => { handleCheckboxChange(index) }} checked={isCheckedList[index]} />
                        </TableCell>

                        <TableCell>{row.details}</TableCell>
                        {
                          (() => {
                            switch (row.checklist) {
                              case "Text Box":

                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    // disabled={disableInput[index]}
                                    onChange={(e) => {
                                      handleDataChange(e, index, "Text Box")
                                    }}
                                  />
                                </TableCell>;
                              case "Text Box-number":
                                return <TableCell>
                                  <Input value={row.data}
                                    style={{ height: '32px' }}
                                    type="number"

                                    onChange={(e) => {

                                      handleDataChange(e, index, "Text Box-number")


                                    }}
                                  />
                                </TableCell>;
                              case "Text Box-alpha":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z]*$/.test(inputValue)) {
                                        handleDataChange(e, index, "Text Box-alpha")
                                      }
                                    }}

                                  />
                                </TableCell>;
                              case "Text Box-alphanumeric":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                        handleDataChange(e, index, "Text Box-alphanumeric")
                                      }
                                    }}
                                    inputProps={{ pattern: '[A-Za-z0-9]*' }}
                                  />
                                </TableCell>;
                              case "Attachments":
                                return <TableCell>
                                  <div>
                                    <InputLabel sx={{ m: 1 }}>File</InputLabel>


                                    <div>

                                      <Box
                                        sx={{ display: "flex", marginTop: "10px", gap: "10px" }}
                                      >

                                        <Box item md={4} sm={4}>
                                          <section>
                                            <input
                                              type="file"
                                              accept="*/*"
                                              id={index}
                                              onChange={(e) => {
                                                handleChangeImage(e, index);

                                              }}
                                              style={{ display: 'none' }}
                                            />
                                            <label htmlFor={index}>
                                              <Typography sx={userStyle.uploadbtn}>Upload</Typography>
                                            </label>
                                            <br />
                                          </section>
                                        </Box>

                                        <Box item md={4} sm={4}>
                                          <Button
                                            onClick={showWebcam}
                                            variant="contained"
                                            sx={userStyle.uploadbtn}
                                          >
                                            <CameraAltIcon />
                                          </Button>
                                        </Box>
                                        

                                      </Box>
                                      {row.files && <Grid container spacing={2}>
                                          <Grid item lg={8} md={8} sm={8} xs={8}>
                                            <Typography>{row.files.name}</Typography>
                                          </Grid>
                                          <Grid item lg={1.5} md={1} sm={1} xs={1} sx={{ cursor: 'pointer' }} onClick={() => renderFilePreviewEdit(row.files)}>
                                            <VisibilityOutlinedIcon
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                              }}

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
                                              onClick={() => handleFileDeleteEdit(index)}
                                            >
                                              <DeleteIcon />
                                            </Button>
                                          </Grid>
                                        </Grid>}

                                    </div>
                                    <Dialog
                                      open={isWebcamOpen}
                                      onClose={webcamClose}
                                      aria-labelledby="alert-dialog-title"
                                      aria-describedby="alert-dialog-description"
                                    >
                                      <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                                        <Webcamimage
                                          getImg={getImg}
                                          setGetImg={setGetImg}
                                          capturedImages={capturedImages}
                                          valNum={valNum}
                                          setValNum={setValNum}
                                          name={name}
                                        />
                                      </DialogContent>
                                      <DialogActions>
                                        <Button
                                          variant="contained"
                                          color="success"
                                          onClick={webcamDataStore}
                                        >
                                          OK
                                        </Button>
                                        <Button variant="contained" color="error" onClick={webcamClose}>
                                          CANCEL
                                        </Button>
                                      </DialogActions>
                                    </Dialog>

                                  </div>


                                </TableCell>;
                              case "Pre-Value":
                                return <TableCell><Typography>{row?.data}</Typography>
                                </TableCell>;
                              case "Date":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type='date'
                                    value={row.data}
                                    onChange={(e) => {

                                      handleDataChange(e, index, "Date")

                                    }}
                                  />
                                </TableCell>;
                              case "Time":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type='time'
                                    value={row.data}
                                    onChange={(e) => {

                                      handleDataChange(e, index, "Time")

                                    }}
                                  />
                                </TableCell>;
                              case "DateTime":
                                return <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type='date'
                                      value={dateValue[index]}
                                      onChange={(e) => {
                                        updateDateValuesAtIndex(e.target.value, index)


                                      }}
                                    />
                                    <OutlinedInput
                                      type='time'
                                      style={{ height: '32px' }}
                                      value={timeValue[index]}
                                      onChange={(e) => {
                                        updateTimeValuesAtIndex(e.target.value, index);

                                      }}
                                    />
                                  </Stack>
                                </TableCell>;
                              case "Date Multi Span":
                                return <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type='date'
                                      value={dateValueMultiFrom[index]}
                                      onChange={(e) => {
                                        updateFromDateValueAtIndex(e.target.value, index)


                                      }}
                                    />
                                    <OutlinedInput
                                      type='date'
                                      style={{ height: '32px' }}
                                      value={dateValueMultiTo[index]}
                                      onChange={(e) => {
                                        updateToDateValueAtIndex(e.target.value, index)


                                      }}
                                    />
                                  </Stack>
                                </TableCell>;
                              case "Date Multi Span Time":
                                return <TableCell>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type='date'
                                        value={firstDateValue[index]}
                                        onChange={(e) => {
                                          updateFirstDateValuesAtIndex(e.target.value, index)


                                        }}
                                      />
                                      <OutlinedInput
                                        type='time'
                                        style={{ height: '32px' }}
                                        value={firstTimeValue[index]}
                                        onChange={(e) => {
                                          updateFirstTimeValuesAtIndex(e.target.value, index);


                                        }}
                                      />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>

                                      <OutlinedInput
                                        type='date'
                                        style={{ height: '32px' }}
                                        value={secondDateValue[index]}
                                        onChange={(e) => {
                                          updateSecondDateValuesAtIndex(e.target.value, index)


                                        }}
                                      />
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type='time'
                                        value={secondTimeValue[index]}
                                        onChange={(e) => {
                                          updateSecondTimeValuesAtIndex(e.target.value, index);


                                        }}
                                      />
                                    </Stack>
                                  </div>

                                </TableCell>;
                              case "Date Multi Random":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type='date'
                                    value={row.data}
                                    onChange={(e) => {

                                      handleDataChange(e, index, "Date Multi Random")

                                    }}
                                  />
                                </TableCell>;
                              case "Date Multi Random Time":
                                return <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type='date'
                                      value={dateValueRandom[index]}
                                      onChange={(e) => {
                                        updateDateValueAtIndex(e.target.value, index)


                                      }}
                                    />
                                    <OutlinedInput
                                      type='time'
                                      style={{ height: '32px' }}
                                      value={timeValueRandom[index]}
                                      onChange={(e) => {
                                        updateTimeValueAtIndex(e.target.value, index);


                                      }}
                                    />
                                  </Stack>
                                </TableCell>;
                              case "Radio":
                                return <TableCell>
                                  <FormControl component="fieldset">
                                    <RadioGroup value={row.data} sx={{ display: 'flex', flexDirection: 'row !important' }} onChange={(e) => {
                                      handleDataChange(e, index, "Radio")
                                    }}>
                                      <FormControlLabel value="No" control={<Radio />} label="No" />
                                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />

                                    </RadioGroup>
                                  </FormControl>
                                </TableCell>;

                              default:
                                return <TableCell></TableCell>; // Default case
                            }
                          })()
                        }
                        <TableCell><span>
                          {row?.employee && row?.employee?.map((data, index) => (
                            <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                          ))}
                        </span></TableCell>
                        <TableCell>
                          <Typography>{row?.completedby}</Typography>
                        </TableCell>
                        <TableCell>{row.completedat && moment(row.completedat).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                        <TableCell>
                          {row.checklist === "DateTime" ?
                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                              <Typography>Completed</Typography>
                              : <Typography>Pending</Typography>
                            : row.checklist === "Date Multi Span" ?
                              (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                <Typography>Completed</Typography>
                                : <Typography>Pending</Typography>
                              : row.checklist === "Date Multi Span Time" ?
                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                  <Typography>Completed</Typography>
                                  : <Typography>Pending</Typography>
                                : row.checklist === "Date Multi Random Time" ?
                                  (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                    <Typography>Completed</Typography>
                                    : <Typography>Pending</Typography>
                                  : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                    <Typography>Completed</Typography>
                                    : <Typography>Pending</Typography>
                          }
                        </TableCell>

                        <TableCell>
                          {row.checklist === "DateTime" ?
                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                              : <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            : row.checklist === "Date Multi Span" ?
                              (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                <>
                                  <IconButton
                                    sx={{ color: 'green', cursor: 'pointer' }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                                : <IconButton
                                  sx={{ color: '#1565c0', cursor: 'pointer' }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              : row.checklist === "Date Multi Span Time" ?
                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                  <>
                                    <IconButton
                                      sx={{ color: 'green', cursor: 'pointer' }}
                                      onClick={() => {
                                        updateIndividualData(index);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </>
                                  : <IconButton
                                    sx={{ color: '#1565c0', cursor: 'pointer' }}
                                    onClick={() => {
                                      let itemValue = disableInput[index];
                                      itemValue = false;
                                      let spreadData = [...disableInput];
                                      spreadData[index] = false;
                                      setDisableInput(spreadData);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                : row.checklist === "Date Multi Random Time" ?
                                  (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                    <>
                                      <IconButton
                                        sx={{ color: 'green', cursor: 'pointer' }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                    : <IconButton
                                      sx={{ color: '#1565c0', cursor: 'pointer' }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                    <>
                                      <IconButton
                                        sx={{ color: 'green', cursor: 'pointer' }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                    : <IconButton
                                      sx={{ color: '#1565c0', cursor: 'pointer' }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                          }
                        </TableCell>

                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.subcategory}</TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1} sm={1}></Grid>
                <Button variant="contained" onClick={handleCheckListSubmit}>
                  Submit
                </Button>
                <Grid item md={1} sm={1}></Grid>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEditCheckList}>
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ApplyPermission;