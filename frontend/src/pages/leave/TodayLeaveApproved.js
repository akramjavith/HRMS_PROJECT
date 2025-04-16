import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, InputLabel, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledDataGrid from "../../components/TableStyle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
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
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Webcamimage from "../hr/webcamprofile";
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import LoadingButton from "@mui/lab/LoadingButton";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";


function TodayLeaveApproved() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


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


    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const [Accessdrop, setAccesDrop] = useState("Employee");
    const [AccessdropEdit, setAccesDropEdit] = useState("Employee");

    const [appleave, setAppleave] = useState({
        employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", date: "", todate: "", reasonforleave: "", reportingto: "",
        department: '', designation: '', doj: '', availabledays: '', durationtype: 'Random', weekoff: '', workmode: ''
    });

    const [appleaveEdit, setAppleaveEdit] = useState([]);
    const [selectStatus, setSelectStatus] = useState({});
    const [isApplyLeave, setIsApplyLeave] = useState([]);

    const [applyleaves, setApplyleaves] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [leaveId, setLeaveId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [allApplyleaveedit, setAllApplyleaveedit] = useState([]);
    const [relatedCountEdit, setRelatedCountEdit] = useState(0);
    const [selectedValue, setSelectedValue] = useState([]);

    const [leave, setLeave] = useState("Please Select LeaveType");
    const [leaveEdit, setLeaveEdit] = useState("Please Select LeaveType");

    const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [applyleaveCheck, setApplyleavecheck] = useState(false);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");

    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    const [statusOpen, setStatusOpen] = useState(false);
    const handleStatusOpen = () => {
        setStatusOpen(true);
    };
    const handleStatusClose = () => {
        setStatusOpen(false);
    };
    //image


    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Today Leave Approved.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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

    const [isErrorOpenForTookLeaveCheck, setIsErrorOpenForTookLeaveCheck] = useState(false);
    const handleClickOpenerrForTookLeaveCheck = () => {
        setIsErrorOpenForTookLeaveCheck(true);
    };
    const handleCloseerrForTookLeaveCheck = () => {
        setIsErrorOpenForTookLeaveCheck(false);
        setAppleave({
            ...appleave, employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: "Random",
            availabledays: '', date: "", todate: "", reasonforleave: "", reportingto: "", noofshift: ''
        });
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

    const leaveStatusOptions = [
        { label: "Shift", value: "Shift" },
        { label: "Before Half Shift", value: "Before Half Shift" },
        { label: "After Half Shift", value: "After Half Shift" },
    ];

    const durationOptions = [
        { label: "Continous", value: "Continous" },
        { label: "Random", value: "Random" },
    ]

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
                  .react-resizable-handle {
                    width: 10px;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    cursor: col-resize;
                  }
                `;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
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


    const updateIndividualData = async (index) => {
        let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == "Leave&Permission" && item.submodule == "Leave" && item.mainpage == "Approved Leave");

        try {
            let objectID = groupDetails[index]?._id;
            let objectData = groupDetails[index];
            if (searchItem) {
                let assignbranches = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        data: String(objectData?.data),
                        lastcheck: objectData?.lastcheck,
                        newFiles: objectData?.files
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
                        groups: groupDetails,
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
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

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    async function fecthDBDatas() {
        try {
            let res = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res?.data?.mychecklist);

            let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID)
            setGroupDetails(foundData?.groups);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
            let searchItem = res?.data?.mychecklist.find((item) => item.commonid == details?.id && item.module == "Leave&Permission" && item.submodule == "Leave" && item.mainpage == "Approved Leave");

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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

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
                    groups: groupDetails,
                    updatedby: [
                        ...assignDetails?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            handleCloseModEditCheckList()
            setIsCheckedListOverall(false);
            sendEditStatus();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        employeename: true,
        employeeid: true,
        leavetype: true,
        date: true,
        todate: true,
        noofshift: true,
        reasonforleave: true,
        reportingto: true,
        actions: true,
        status: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const fetchLeaveType = async () => {
        try {
            let res_leavetype = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const leaveall = [{ label: 'Leave Without Pay', value: 'Leave Without Pay' }, ...res_leavetype?.data?.leavetype.map((d) => (
                {
                    ...d,
                    label: d.leavetype,
                    value: d.leavetype
                }
            ))];
            setLeaveTypeData(leaveall)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    useEffect(() => {
        fetchLeaveType();
    }, []);

    const [deleteApply, setDeleteApply] = useState("");

    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteApply(res?.data?.sapplyleave);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let Applysid = deleteApply?._id;
    const delApply = async (e) => {
        try {
            if (Applysid) {
                await axios.delete(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchApplyleave();
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
                return axios.delete(`${SERVICE.APPLYLEAVE_SINGLE}/${item}`, {
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

            await fetchApplyleave();
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

    const [companyOption, setCompanyOption] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [empnames, setEmpname] = useState([]);
    const [empnamesEdit, setEmpnameEdit] = useState([]);

    //get all comnpany.
    const fetchCompanyAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCompanyOption([
                ...res_location?.data?.companies?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all branches.
    const fetchBranchAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setBranchOption([
                ...res_location?.data?.branch?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //function to fetch unit
    const fetchUnitAll = async () => {
        try {
            let res_unit = await axios.get(`${SERVICE.UNIT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUnitOption([
                ...res_unit?.data?.units?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);


        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //function to fetch  team
    const fetchTeamAll = async () => {
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setTeamOption([
                ...res_team?.data?.teamsdetails?.map((t) => ({
                    ...t,
                    label: t.teamname,
                    value: t.teamname,
                })),
            ]);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

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

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };


    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //company multiselect
    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);


    const handleCompanyChangeEdit = (options) => {
        setValueCompanyCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompanyEdit(options);
        setValueBranchCatEdit([]);
        setSelectedOptionsBranchEdit([]);
        setValueUnitCatEdit([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
    };

    const customValueRendererCompanyEdit = (valueCompanyCatEdit, _categoryname) => {
        return valueCompanyCatEdit?.length
            ? valueCompanyCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
    let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);

    const handleBranchChangeEdit = (options) => {
        setValueBranchCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranchEdit(options);
        setValueUnitCatEdit([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
    };

    const customValueRendererBranchEdit = (valueBranchCatEdit, _categoryname) => {
        return valueBranchCatEdit?.length
            ? valueBranchCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

    const handleUnitChangeEdit = (options) => {
        setValueUnitCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnitEdit(options);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
    };

    const customValueRendererUnitEdit = (valueUnitCatEdit, _categoryname) => {
        return valueUnitCatEdit?.length
            ? valueUnitCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

    const handleTeamChangeEdit = (options) => {
        setValueTeamCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
    };

    const customValueRendererTeamEdit = (valueTeamCatEdit, _categoryname) => {
        return valueTeamCatEdit?.length
            ? valueTeamCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    useEffect(() => {
        fetchCompanyAll();
        fetchBranchAll();
        fetchUnitAll();
        fetchTeamAll();
        fetchCategoryTicket();
    }, [selectedOptionsCompany]);

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

    // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
    const calculateDaysDifference = () => {
        const fromDate = new Date(appleave.date).getTime();
        const toDate = new Date(appleave.todate).getTime();

        if (!isNaN(fromDate) && !isNaN(toDate)) {
            // Calculate the number of days between the two dates
            const daysDifference = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
            return daysDifference + 1;
        }

        return 0; // Return 0 if either date is invalid
    };

    // Call the function and set the result in state or use it as needed
    const daysDifference = calculateDaysDifference();

    // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
    const calculateDaysDifferenceEdit = () => {
        const fromDate = new Date(appleaveEdit.date).getTime();
        const toDate = new Date(appleaveEdit.todate).getTime();

        if (!isNaN(fromDate) && !isNaN(toDate)) {
            // Calculate the number of days between the two dates
            const daysDifferenceEdit = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
            return daysDifferenceEdit + 1;
        }

        return 0; // Return 0 if either date is invalid
    };

    // Call the function and set the result in state or use it as needed
    const daysDifferenceEdit = calculateDaysDifferenceEdit();

    const [allUsers, setAllUsers] = useState([]);
    const [leavecriterias, setLeavecriterias] = useState([]);
    const [availableDays, setAvailableDays] = useState('');
    const [getSelectedDates, setGetSelectedDates] = useState([]);
    const [leaveRestriction, setLeaveRestriction] = useState(false);
    const [checkDuplicate, setCheckDuplicate] = useState([]);

    const [allUsersEdit, setAllUsersEdit] = useState([]);
    const [leavecriteriasEdit, setLeavecriteriasEdit] = useState([]);
    const [availableDaysEdit, setAvailableDaysEdit] = useState('');
    const [getSelectedDatesEdit, setGetSelectedDatesEdit] = useState([]);
    const [leaveRestrictionEdit, setLeaveRestrictionEdit] = useState(false);
    const [checkDuplicateEdit, setCheckDuplicateEdit] = useState([]);

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

    const fetchUsersRandom = async (value, date,) => {

        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode;
        let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);

        let check = result.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (getSelectedDates.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (check) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(date);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });
            if (date !== '' && !getSelectedDates.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')) && !check && res?.data?.finaluser.length === 0) {

                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Shift is not alloted for the selected date. Please select another date"}</p>
                    </>
                );
                handleClickOpenerr();
                setAppleave({ ...appleave, date: '' });
            }
            else {
                const uniqueHeadings = [...new Set(res?.data?.finaluser)];
                let result = uniqueHeadings.filter((d) => d.shiftMode === 'Main Shift');

                // setAllUsers(prevUsers => [...prevUsers, ...res?.data?.finaluser]);
                setAllUsers(prevUsers => [...prevUsers, ...result]);

                // Extract formatted dates from response data and set to getSelectedDates
                // const selectedDates = res?.data?.finaluser.map(d => d.formattedDate);
                const selectedDates = result.map(d => d.formattedDate);
                setGetSelectedDates(prevDates => [...prevDates, ...selectedDates]);
                setAppleave({ ...appleave, date: '' });
            }

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    const fetchUsersRandomEdit = async (value, date,) => {

        let check = checkDuplicateEdit.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (getSelectedDatesEdit.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (check) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(date);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });

            setAllUsersEdit(prevUsers => [...prevUsers, ...res?.data?.finaluser]);

            // Extract formatted dates from response data and set to getSelectedDates
            const selectedDatesEdit = res?.data?.finaluser.map(d => d.formattedDate);
            setGetSelectedDatesEdit(prevDates => [...prevDates, ...selectedDatesEdit]);
            setAppleaveEdit({ ...appleaveEdit, date: '' });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    const fetchUsers = async (value, date, todate) => {

        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode;
        let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);

        const isOverlap = result.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        const isOverlap1 = getSelectedDates.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select From Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        if (todate === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select To Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(todate);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });
            if (date !== '' && todate !== '' && !isOverlap1 && !isOverlap && res?.data?.finaluser.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Shift is not alloted for the selected date. Please select another date"}</p>
                    </>
                );
                handleClickOpenerr();
                setAppleave({ ...appleave, date: '', todate: '' });
            }
            else {
                const uniqueHeadings = [...new Set(res?.data?.finaluser)];
                let result = uniqueHeadings.filter((d) => d.shiftMode === 'Main Shift');

                // setAllUsers(prevUsers => [...prevUsers, ...res?.data?.finaluser]);
                setAllUsers(prevUsers => [...prevUsers, ...result]);

                // Extract formatted dates from response data and set to getSelectedDates
                // const selectedDates = res?.data?.finaluser.map(d => d.formattedDate);
                const selectedDates = result.map(d => d.formattedDate);
                setGetSelectedDates(prevDates => [...prevDates, ...selectedDates]);
                setAppleave({ ...appleave, date: '', todate: '' });
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    const fetchUsersEdit = async (value, date, todate) => {

        const isOverlap = checkDuplicateEdit.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        const isOverlap1 = getSelectedDatesEdit.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select From Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        if (todate === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select To Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"These Date Range is Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(todate);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });

            setAllUsersEdit(prevUsers => [...prevUsers, ...res?.data?.finaluser]);

            // Extract formatted dates from response data and set to getSelectedDates
            const selectedDatesEdit = res?.data?.finaluser.map(d => d.formattedDate);
            setGetSelectedDatesEdit(prevDates => [...prevDates, ...selectedDatesEdit]);
            setAppleaveEdit({ ...appleaveEdit, date: '', todate: '' });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };
    const [tookLeaveDaysWithAllUsers, setTookLeaveDaysWithAllUsers] = useState([]);
    const fetchLeaveCriteria = async (empname, empdepartment, empdesignation, leavetype, empdoj, empweekoff, empid) => {

        try {

            let res_leavecriteria = await axios.post(SERVICE.LEAVECRITERIA_FOR_APPLY_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empname: empname,
                empdept: empdepartment,
                empdesg: empdesignation,
                leavetype: leavetype,
            });

            // let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            // });

            let currentDate = new Date();
            // let total = res_status.data.departmentdetails.filter((dep) => {
            //   if (dep.department === empdepartment && Number(dep.year) === currentDate.getFullYear()) {
            //     return dep;
            //   }
            // });

            let res_status = await axios.post(SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empdepartment: empdepartment,
                year: String(currentDate.getFullYear()),
            });

            let total = res_status.data.departmentdetails;

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let answer = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname);

            // let filteredData = res_leavecriteria?.data?.leavecriterias?.filter((d) => {
            //   if (d.mode === 'Employee' && d.employee?.includes(empname) && d.leavetype === leavetype) {
            //     return d;
            //   }
            //   if (d.mode === 'Designation' && d.designation?.includes(empdesignation) && d.leavetype === leavetype) {
            //     return d;
            //   }
            //   if (d.mode === 'Department' && d.department?.includes(empdepartment) && d.leavetype === leavetype) {
            //     return d;
            //   }      
            // })

            let filteredData = res_leavecriteria?.data?.leavecriterias;

            let doj = new Date(empdoj);
            let monthsDiff = (currentDate.getFullYear() - doj.getFullYear()) * 12 + (currentDate.getMonth() - doj.getMonth());
            let yearsDiff = currentDate.getFullYear() - doj.getFullYear();

            let monthstring = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empid: empid,
            });

            let noticeresult = res?.data?.noticeperiodapply;

            filteredData?.forEach((d) => {
                let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : '';
                let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : '';

                let finalanswer = answer.filter(d => {
                    if (d.employeeid === empid && d.leavetype === leavetype) {
                        return d.date;
                    }
                })

                // let previousYearData = res_status.data.departmentdetails?.filter((dep) => {
                //   if (dep.department === empdepartment && Number(dep.year) === comparedYear) {
                //     return dep;
                //   }
                // });

                let previousYearData = [];
                if (d.pendingleave === true) {
                    let res_statuspre = axios.post(SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        empdepartment: empdepartment,
                        year: String(comparedYear),
                    });

                    previousYearData.push(res_statuspre.data.departmentdetails);
                }
                else {
                    previousYearData = []
                }

                setTookLeaveDaysWithAllUsers(d.tookleave);

                let yearStartDate = total[0].fromdate;
                let yearEndDate = total[total.length - 1].todate;

                let lastYearStartDate = previousYearData.length > 0 ? previousYearData[0].fromdate : '';
                let lastYearEndDate = previousYearData.length > 0 ? previousYearData[previousYearData.length - 1].todate : '';

                // To get Previous year's leave count
                let withinRangeCountLastYear = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {

                        const [day, month, year] = leaveDate.split('/');

                        const date = new Date(`${month}/${day}/${year}`);

                        // Convert yearStartDate and yearEndDate to Date objects if they're not already
                        const startDate = new Date(lastYearStartDate);
                        const endDate = new Date(lastYearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter if date is within the range
                            withinRangeCountLastYear++;
                        } else {
                        }
                    });
                });

                // To get Current year's leave count
                let withinRangeCount = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {

                        const [day, month, year] = leaveDate.split('/');
                        const date = new Date(`${month}/${day}/${year}`);

                        const startDate = new Date(yearStartDate);
                        const endDate = new Date(yearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter if date is within the range
                            withinRangeCount++;
                        } else {
                        }
                    });
                });

                // To get Current year's leave count
                let withinRangeNoOfShiftCount = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {
                        const [day, month, year] = leaveDate.split('/');
                        const date = new Date(`${month}/${day}/${year}`);

                        const startDate = new Date(yearStartDate);
                        const endDate = new Date(yearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter by parsing and adding the noofshift value
                            withinRangeNoOfShiftCount += leave.noofshift; // Parse as float
                        }
                    });
                });

                // check the experience month is completed or not
                let comparedMonthValue = ((`${d.experience} ${d.experiencein}` === '1 Month') ? 1 :
                    (`${d.experience} ${d.experiencein}` === '2 Month') ? 2 :
                        (`${d.experience} ${d.experiencein}` === '3 Month') ? 3 :
                            (`${d.experience} ${d.experiencein}` === '4 Month') ? 4 :
                                (`${d.experience} ${d.experiencein}` === '5 Month') ? 5 :
                                    (`${d.experience} ${d.experiencein}` === '6 Month') ? 6 :
                                        0);

                // Calculate the year difference
                let comparedYearValue = ((`${d.experience} ${d.experiencein}` === '1 Year') ? 1 :
                    (`${d.experience} ${d.experiencein}` === '2 Year') ? 2 :
                        (`${d.experience} ${d.experiencein}` === '3 Year') ? 3 :
                            (`${d.experience} ${d.experiencein}` === '4 Year') ? 4 :
                                (`${d.experience} ${d.experiencein}` === '5 Year') ? 5 :
                                    (`${d.experience} ${d.experiencein}` === '6 Year') ? 6 :
                                        0);

                if (d.uninformedleave === true) {
                    setLeaveRestriction(true)
                }

                // check auto increase
                if (d.leaveautocheck === true && d.leaveautodays === 'Month') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDays('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                                for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                    monthsToAddDaysLastYear.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDaysLastYear.forEach(month => {
                                    const monthIndexLastYear = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndexLastYear !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndexLastYear <= currentMonth) {
                                            totalAvailableDaysLastYear += numberofdaysLastYear;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                    totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                    totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                                }
                            }
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                                for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                    monthsToAddDays.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDays.forEach(month => {
                                    const monthIndex = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndex !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndex <= currentMonth) {
                                            totalAvailableDays += numberofdays;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonth = currentDate.getDate();
                                    totalAvailableDays -= daysPassedInCurrentMonth;
                                    totalAvailableDays += daysInCurrentMonth;
                                }
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        // let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeNoOfShiftCount


                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                            // remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeNoOfShiftCount;
                        }
                        setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }
                else if (d.leaveautocheck === true && d.leaveautodays === 'Year') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = comparedYear;
                    //     const currentYear = currentDate.getFullYear() - 1;

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDaysLastYear *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let totalAvailableDays = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = parseInt(total[0].year);
                    //     const currentYear = currentDate.getFullYear();

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDays *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                                for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                    monthsToAddDaysLastYear.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDaysLastYear.forEach(month => {
                                    const monthIndexLastYear = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndexLastYear !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndexLastYear <= currentMonth) {
                                            totalAvailableDaysLastYear += numberofdaysLastYear;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                    totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                    totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                                }
                            }
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                                for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                    monthsToAddDays.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDays.forEach(month => {
                                    const monthIndex = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndex !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndex <= currentMonth) {
                                            totalAvailableDays += numberofdays;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonth = currentDate.getDate();
                                    totalAvailableDays -= daysPassedInCurrentMonth;
                                    totalAvailableDays += daysInCurrentMonth;
                                }
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    }
                }
                else if (d.leaveautocheck === false && (d.leaveautodays === 'Month' || d.leaveautodays === 'Year')) {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDays('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   let totalAvailableDays = parseInt(d.numberofdays);
                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                                for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                    monthsToAddDaysLastYear.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDaysLastYear.forEach(month => {
                                    const monthIndexLastYear = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndexLastYear !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndexLastYear <= currentMonth) {
                                            totalAvailableDaysLastYear += numberofdaysLastYear;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                    totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                    totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                                }
                            }
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                                for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                    monthsToAddDays.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDays.forEach(month => {
                                    const monthIndex = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndex !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndex <= currentMonth) {
                                            totalAvailableDays += numberofdays;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonth = currentDate.getDate();
                                    totalAvailableDays -= daysPassedInCurrentMonth;
                                    totalAvailableDays += daysInCurrentMonth;
                                }
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }
            })

            setLeavecriterias(filteredData);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchLeaveCriteriaEdit = async (empname, empdepartment, empdesignation, leavetype, empdoj, empweekoff, empid) => {

        try {
            let res_leavecriteria = await axios.post(SERVICE.LEAVECRITERIA_FOR_APPLY_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empname: empname,
                empdept: empdepartment,
                empdesg: empdesignation,
                leavetype: leavetype,
            });

            // let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            // });

            let currentDate = new Date();
            // let total = res_status.data.departmentdetails.filter((dep) => {
            //   if (dep.department === empdepartment && Number(dep.year) === currentDate.getFullYear()) {
            //     return dep;
            //   }
            // });

            let res_status = await axios.post(SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empdepartment: empdepartment,
                year: String(currentDate.getFullYear()),
            });

            let total = res_status.data.departmentdetails;

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let answer = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname);

            // let filteredData = res_leavecriteria?.data?.leavecriterias?.filter((d) => {
            //   if (d.mode === 'Employee' && d.employee?.includes(empname) && d.leavetype === leavetype) {
            //     return d;
            //   }
            //   else if (d.mode === 'Designation' && d.designation?.includes(empdesignation) && d.leavetype === leavetype) {
            //     return d;
            //   }
            //   else if (d.mode === 'Department' && d.department?.includes(empdepartment) && d.leavetype === leavetype) {
            //     return d;
            //   }
            //   // if ((d.employee?.includes(empname) || d.department?.includes(empdepartment) || d.designation?.includes(empdesignation)) && d.leavetype === leavetype) {
            //   //   return d;
            //   // }
            // })

            let filteredData = res_leavecriteria?.data?.leavecriterias;

            let doj = new Date(empdoj);
            let monthsDiff = (currentDate.getFullYear() - doj.getFullYear()) * 12 + (currentDate.getMonth() - doj.getMonth());
            let yearsDiff = currentDate.getFullYear() - doj.getFullYear();

            let monthstring = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empid: empid,
            });

            let noticeresult = res?.data?.noticeperiodapply;

            filteredData?.forEach((d) => {
                let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : '';
                let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : '';

                let finalanswer = answer.filter(d => {
                    if (d.employeeid === empid && d.leavetype === leavetype) {
                        return d.date;
                    }
                })

                let previousYearData = [];
                if (d.pendingleave === true) {
                    let res_statuspre = axios.post(SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        empdepartment: empdepartment,
                        year: String(comparedYear),
                    });

                    previousYearData.push(res_statuspre.data.departmentdetails);
                }
                else {
                    previousYearData = []
                }


                // let previousYearData = res_status.data.departmentdetails?.filter((dep) => {
                //   if (dep.department === empdepartment && Number(dep.year) === comparedYear) {
                //     return dep;
                //   }
                // });

                let yearStartDate = total[0].fromdate;
                let yearEndDate = total[total.length - 1].todate;

                let lastYearStartDate = previousYearData.length > 0 ? previousYearData[0].fromdate : '';
                let lastYearEndDate = previousYearData.length > 0 ? previousYearData[previousYearData.length - 1].todate : '';

                // To get Previous year's leave count
                let withinRangeCountLastYear = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {

                        const [day, month, year] = leaveDate.split('/');

                        const date = new Date(`${month}/${day}/${year}`);

                        // Convert yearStartDate and yearEndDate to Date objects if they're not already
                        const startDate = new Date(lastYearStartDate);
                        const endDate = new Date(lastYearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter if date is within the range
                            withinRangeCountLastYear++;
                        } else {
                        }
                    });
                });

                // To get Current year's leave count
                let withinRangeCount = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {

                        const [day, month, year] = leaveDate.split('/');
                        const date = new Date(`${month}/${day}/${year}`);

                        const startDate = new Date(yearStartDate);
                        const endDate = new Date(yearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter if date is within the range
                            withinRangeCount++;
                        } else {
                        }
                    });
                });

                // check the experience month is completed or not
                let comparedMonthValue = ((`${d.experience} ${d.experiencein}` === '1 Month') ? 1 :
                    (`${d.experience} ${d.experiencein}` === '2 Month') ? 2 :
                        (`${d.experience} ${d.experiencein}` === '3 Month') ? 3 :
                            (`${d.experience} ${d.experiencein}` === '4 Month') ? 4 :
                                (`${d.experience} ${d.experiencein}` === '5 Month') ? 5 :
                                    (`${d.experience} ${d.experiencein}` === '6 Month') ? 6 :
                                        0);

                // Calculate the year difference
                let comparedYearValue = ((`${d.experience} ${d.experiencein}` === '1 Year') ? 1 :
                    (`${d.experience} ${d.experiencein}` === '2 Year') ? 2 :
                        (`${d.experience} ${d.experiencein}` === '3 Year') ? 3 :
                            (`${d.experience} ${d.experiencein}` === '4 Year') ? 4 :
                                (`${d.experience} ${d.experiencein}` === '5 Year') ? 5 :
                                    (`${d.experience} ${d.experiencein}` === '6 Year') ? 6 :
                                        0);

                if (d.uninformedleave === true) {
                    setLeaveRestrictionEdit(true)
                }

                // check auto increase
                if (d.leaveautocheck === true && d.leaveautodays === 'Month') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                                for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                    monthsToAddDaysLastYear.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDaysLastYear.forEach(month => {
                                    const monthIndexLastYear = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndexLastYear !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndexLastYear <= currentMonth) {
                                            totalAvailableDaysLastYear += numberofdaysLastYear;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                    totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                    totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                                }
                            }
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                                for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                    monthsToAddDays.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDays.forEach(month => {
                                    const monthIndex = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndex !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndex <= currentMonth) {
                                            totalAvailableDays += numberofdays;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonth = currentDate.getDate();
                                    totalAvailableDays -= daysPassedInCurrentMonth;
                                    totalAvailableDays += daysInCurrentMonth;
                                }
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDaysEdit(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }
                else if (d.leaveautocheck === true && d.leaveautodays === 'Year') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDaysEdit('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = comparedYear;
                    //     const currentYear = currentDate.getFullYear() - 1;

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDaysLastYear *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let totalAvailableDays = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = parseInt(total[0].year);
                    //     const currentYear = currentDate.getFullYear();

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDays *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                                for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                    monthsToAddDaysLastYear.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDaysLastYear.forEach(month => {
                                    const monthIndexLastYear = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndexLastYear !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndexLastYear <= currentMonth) {
                                            totalAvailableDaysLastYear += numberofdaysLastYear;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                    totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                    totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                                }
                            }
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                                for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                    monthsToAddDays.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDays.forEach(month => {
                                    const monthIndex = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndex !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndex <= currentMonth) {
                                            totalAvailableDays += numberofdays;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonth = currentDate.getDate();
                                    totalAvailableDays -= daysPassedInCurrentMonth;
                                    totalAvailableDays += daysInCurrentMonth;
                                }
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDaysEdit(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    }
                }
                else if (d.leaveautocheck === false && (d.leaveautodays === 'Month' || d.leaveautodays === 'Year')) {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDaysEdit('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   let totalAvailableDays = parseInt(d.numberofdays);
                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                                for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                    monthsToAddDaysLastYear.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDaysLastYear.forEach(month => {
                                    const monthIndexLastYear = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndexLastYear !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndexLastYear <= currentMonth) {
                                            totalAvailableDaysLastYear += numberofdaysLastYear;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                    totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                    totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                                }
                            }
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                                for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                    monthsToAddDays.push(monthstring[i]);
                                }

                                // Calculate totalAvailableDays by summing numberofdays for each month
                                monthsToAddDays.forEach(month => {
                                    const monthIndex = monthstring.indexOf(month);
                                    // Add numberofdays for the month
                                    if (monthIndex !== -1) {
                                        // If the month is before the current month or is the current month, add numberofdays
                                        if (monthIndex <= currentMonth) {
                                            totalAvailableDays += numberofdays;
                                        }
                                    }
                                });

                                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                    // Adjust based on the current day of the month
                                    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                    const daysPassedInCurrentMonth = currentDate.getDate();
                                    totalAvailableDays -= daysPassedInCurrentMonth;
                                    totalAvailableDays += daysInCurrentMonth;
                                }
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDaysEdit(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }


            })

            setLeavecriteriasEdit(filteredData);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    function multiLeaveStatusInputs(referenceIndex, inputvalue) {
        let shiftValue = 0;

        // Calculate shift value based on selected option
        if (inputvalue === 'Shift') {
            shiftValue = 1;
        } else if (inputvalue === 'Before Half Shift' || inputvalue === 'After Half Shift') {
            shiftValue = 0.5;
        }

        // Update isSubCategory state
        const updatedData = allUsers.map((value, index) => {
            if (referenceIndex === index) {
                return { ...value, leavestatus: inputvalue, shiftcount: shiftValue };
            } else {
                return value;
            }
        });

        setAllUsers(updatedData);

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleave({ ...appleave, noofshift: totalShifts });
    }

    const handleDelete = (referenceIndex) => {

        let deleteIndex;

        let updatedData = allUsers.filter((value, index) => {
            if (referenceIndex != index) {
                return value;
            } else {
                if (allUsers[index + 1]) {
                    deleteIndex = index;
                }
            }
            return false;
        });

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleave({ ...appleave, noofshift: totalShifts, date: '', todate: '' });

        setAllUsers(updatedData);
        setGetSelectedDates(updatedData.map(d => d.formattedDate))
    }

    function multiLeaveStatusInputsEdit(referenceIndex, inputvalue) {
        let shiftValue = 0;

        // Calculate shift value based on selected option
        if (inputvalue === 'Shift') {
            shiftValue = 1;
        } else if (inputvalue === 'Before Half Shift' || inputvalue === 'After Half Shift') {
            shiftValue = 0.5;
        }

        // Update isSubCategory state
        const updatedData = allUsersEdit.map((value, index) => {
            if (referenceIndex === index) {
                return { ...value, leavestatus: inputvalue, shiftcount: shiftValue };
            } else {
                return value;
            }
        });

        setAllUsersEdit(updatedData);

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleaveEdit({ ...appleaveEdit, noofshift: totalShifts });
    }

    const handleDeleteEdit = (referenceIndex) => {

        let deleteIndex;

        let updatedData = allUsersEdit.filter((value, index) => {
            if (referenceIndex != index) {
                return value;
            } else {
                if (allUsersEdit[index + 1]) {
                    deleteIndex = index;
                }
            }
            return false;
        });

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleaveEdit({ ...appleaveEdit, noofshift: totalShifts, date: '', todate: '' });

        setAllUsersEdit(updatedData);
        setGetSelectedDatesEdit(updatedData.map(d => d.formattedDate))
    }

    //add function
    const sendRequest = async () => {
        let comp = selectedOptionsCompany.map((item) => item.value);
        let bran = selectedOptionsBranch.map((item) => item.value);
        let unit = selectedOptionsUnit.map((item) => item.value);
        let team = selectedOptionsTeam.map((item) => item.value);

        const currentDate = moment();

        const isAnyPastDate = allUsers.some(user => {
            const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
            return userDate.isBefore(currentDate, 'day');
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode
        let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empid: empid,
        });

        let noticeresult = res?.data?.noticeperiodapply;

        let finalAllUsers = allUsers.map((d) => { return { ...d, tookleavecheckstatus: 'Single' } });

        try {
            let subprojectscreate = await axios.post(SERVICE.APPLYLEAVE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employeename: Accessdrop === "HR" ? String(appleave.employeename) : isUserRoleAccess.companyname,
                employeeid: Accessdrop === "HR" ? String(appleave.employeeid) : isUserRoleAccess.empcode,
                leavetype: String(appleave.leavetype),
                access: Accessdrop,
                // date: String(appleave.date),
                // todate: String(appleave.todate),
                date: [...getSelectedDates],
                numberofdays: String(allUsers.length),
                usershifts: [...finalAllUsers],
                noofshift: Number(appleave.noofshift),
                durationtype: String(appleave.durationtype),
                availabledays: Number(availableDays),
                reasonforleave: String(appleave.reasonforleave),
                department: String(appleave.department),
                designation: String(appleave.designation),
                doj: String(appleave.doj),
                weekoff: appleave.weekoff,
                workmode: String(appleave.workmode),
                reportingto: Accessdrop === "HR" ? String(appleave.reportingto) : isUserRoleAccess.reportingto,
                status: String("Applied"),
                uninformedleavestatus: String((leaveRestriction === true && isAnyPastDate) ? 'Uninformed' : ''),
                noticeperiodstatus: String(noticeresult.length > 0 ? 'Noticeperiod' : ''),
                rejectedreason: String(""),
                tookleavecheckstatus: String("Single"),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            setLeave("Please Select LeaveType");
            setAppleave({
                ...appleave, employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: "Random",
                availabledays: '', date: "", todate: "", reasonforleave: "", reportingto: "", noofshift: ''
            });
            setAllUsers([]);
            setGetSelectedDates([]);
            setAvailableDays('');
            setValueCompanyCat([]);
            setSelectedOptionsCompany([]);
            setValueBranchCat([]);
            setSelectedOptionsBranch([]);
            setValueUnitCat([]);
            setSelectedOptionsUnit([]);
            setValueTeamCat([]);
            setSelectedOptionsTeam([]);
            setBranchOption([]);
            setUnitOption([]);
            setTeamOption([]);
            setEmpname([]);
            handleCloseerrForTookLeaveCheck();
            setBtnSubmit(false);
            setShowAlert(
                <>
                    <CheckCircleOutline sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Added Successfully!</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { setBtnSubmit(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const sendRequestDouble = async () => {
        let comp = selectedOptionsCompany.map((item) => item.value);
        let bran = selectedOptionsBranch.map((item) => item.value);
        let unit = selectedOptionsUnit.map((item) => item.value);
        let team = selectedOptionsTeam.map((item) => item.value);

        const currentDate = moment();

        const isAnyPastDate = allUsers.some(user => {
            const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
            return userDate.isBefore(currentDate, 'day');
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode
        let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empid: empid,
        });

        let noticeresult = res?.data?.noticeperiodapply;

        const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let dayNamesArray = [];
        allUsers.forEach((all) => {
            tookLeaveDaysWithAllUsers.map((val) => {
                const [day, month, year] = all.formattedDate.split('/').map(Number);

                if ((parseInt(val.year) === year) && (val.month === monthstring[month - 1]) && (val.week === all.weekNumberInMonth)) {
                    dayNamesArray.push(val.day);
                }
            })
        })

        let uniqueDayNames = Array.from(new Set(dayNamesArray.map((t) => t)));

        let finalAllUsers = allUsers.map((d) => {
            if (uniqueDayNames.includes(d.dayName)) {
                return { ...d, tookleavecheckstatus: 'Double' }
            }
            else {
                return { ...d, tookleavecheckstatus: 'Single' }
            }
        })

        try {
            let subprojectscreate = await axios.post(SERVICE.APPLYLEAVE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employeename: Accessdrop === "HR" ? String(appleave.employeename) : isUserRoleAccess.companyname,
                employeeid: Accessdrop === "HR" ? String(appleave.employeeid) : isUserRoleAccess.empcode,
                leavetype: String(appleave.leavetype),
                access: Accessdrop,
                // date: String(appleave.date),
                // todate: String(appleave.todate),
                date: [...getSelectedDates],
                numberofdays: String(allUsers.length),
                usershifts: [...finalAllUsers],
                noofshift: Number(appleave.noofshift),
                durationtype: String(appleave.durationtype),
                availabledays: Number(availableDays),
                reasonforleave: String(appleave.reasonforleave),
                department: String(appleave.department),
                designation: String(appleave.designation),
                doj: String(appleave.doj),
                weekoff: appleave.weekoff,
                workmode: String(appleave.workmode),
                reportingto: Accessdrop === "HR" ? String(appleave.reportingto) : isUserRoleAccess.reportingto,
                status: String("Applied"),
                uninformedleavestatus: String((leaveRestriction === true && isAnyPastDate) ? 'Uninformed' : ''),
                noticeperiodstatus: String(noticeresult.length > 0 ? 'Noticeperiod' : ''),
                rejectedreason: String(""),
                tookleavecheckstatus: String("Double"),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            setLeave("Please Select LeaveType");
            setAppleave({
                ...appleave, employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: "Random",
                availabledays: '', date: "", todate: "", reasonforleave: "", reportingto: "", noofshift: ''
            });
            setAllUsers([]);
            setGetSelectedDates([]);
            setAvailableDays('');
            setValueCompanyCat([]);
            setSelectedOptionsCompany([]);
            setValueBranchCat([]);
            setSelectedOptionsBranch([]);
            setValueUnitCat([]);
            setSelectedOptionsUnit([]);
            setValueTeamCat([]);
            setSelectedOptionsTeam([]);
            setBranchOption([]);
            setUnitOption([]);
            setTeamOption([]);
            setEmpname([]);
            handleCloseerrForTookLeaveCheck();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Function to find the day before and after a given day name
    function getDayBeforeAndAfter(dayName) {
        const index = daysOfWeek.indexOf(dayName);
        const beforeIndex = (index === 0) ? 6 : index - 1; // Wrap around to Saturday if Sunday
        const afterIndex = (index === 6) ? 0 : index + 1; // Wrap around to Sunday if Saturday
        return [daysOfWeek[beforeIndex], daysOfWeek[afterIndex]];
    }

    //submit option for saving
    const handleSubmit = async (e) => {
        setBtnSubmit(true);
        e.preventDefault();
        const checkLeaveStatus = allUsers?.find(d => d.leavestatus === '')
        // const isNameMatch = applyleaves.some(item => item.reasonforleave.toLowerCase() === (appleave.reasonforleave).toLowerCase() && item.employeename === appleave.employeename && item.leavetype === leave && item.date === appleave.date && item.todate === appleave.todate);
        const isNameMatch = applyleaves.some((item) => item.employeename === appleave.employeename && item.date === appleave.date && item.todate === appleave.todate);
        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode
        let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empid: empid,
        });
        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let uninformResult = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid && item.uninformedleavestatus === 'Uninformed').flatMap(d => d.date);
        let noticeresult = res?.data?.noticeperiodapply;
        let noticeresultDate = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid && item.noticeperiodstatus === 'Noticeperiod').flatMap(d => d.date);
        let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);

        let checkDuplicateDates = allUsers.some((d) => result.includes(d.formattedDate))

        if (Accessdrop === "HR" && selectedOptionsCompany.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (Accessdrop === "HR" && selectedOptionsBranch.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (Accessdrop === "HR" && selectedOptionsUnit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (Accessdrop === "HR" && selectedOptionsTeam.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (Accessdrop === "HR" && appleave.employeename === "Please Select Employee Name") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleave.leavetype === "Please Select LeaveType") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select LeaveType"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (allUsers.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please click plus button to add leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checkDuplicateDates) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleave.noofshift === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checkLeaveStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleave.reasonforleave === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason for Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            if (leavecriterias.length > 0) {
                let weekoff = Accessdrop === 'HR' ? appleave.weekoff : isUserRoleAccess.weekoff

                leavecriterias.forEach((d) => {

                    let check = allUsers.length > parseInt(d.uninformedleavecount);
                    let uninformedcheck = uninformResult.length >= parseInt(d.uninformedleavecount);
                    let noticeperiodcheck = noticeresultDate.length >= parseInt(d.leavefornoticeperiodcount);
                    let check2 = allUsers.length > parseInt(d.leavefornoticeperiodcount);

                    const currentDate = moment();

                    const isAnyPastDate = allUsers.some(user => {
                        const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
                        return userDate.isBefore(currentDate, 'day');
                    });

                    weekoff?.forEach(empwkoffday => {

                        // find out weekoff's before and after dayname
                        const [beforeDay, afterDay] = getDayBeforeAndAfter(empwkoffday);

                        const hasBeforeDay = allUsers.some(user => user.dayName === beforeDay);
                        const hasAfterDay = allUsers.some(user => user.dayName === afterDay);
                        // const hasWeekOffDay = allUsers.some(user => user.dayName === empwkoffday);

                        const hasBeforeDayDate = allUsers.filter(user => user.dayName === beforeDay).map(d => d.formattedDate);
                        const hasAfterDayDate = allUsers.filter(user => user.dayName === afterDay).map(d => d.formattedDate);

                        let updatedDatesBeforeWeekOffDates = [];
                        let updatedDatesAfterWeekOffDates = [];

                        //for example if selected date is monday
                        hasAfterDayDate.forEach(date => {
                            const [day, month, year] = date.split('/');
                            const currentDate = new Date(`${year}-${month}-${day}`);

                            // Get the day before
                            const dayBefore = new Date(currentDate);
                            dayBefore.setDate(currentDate.getDate() - 1);
                            const formattedDayBefore = `${dayBefore.getDate()}`.padStart(2, '0');
                            const formattedMonthBefore = `${dayBefore.getMonth() + 1}`.padStart(2, '0');
                            updatedDatesBeforeWeekOffDates.push(`${formattedDayBefore}/${formattedMonthBefore}/${dayBefore.getFullYear()}`);

                        });

                        hasBeforeDayDate.forEach(date => {
                            const [day, month, year] = date.split('/');
                            const currentDate = new Date(`${year}-${month}-${day}`);

                            // Get the day after
                            const dayAfter = new Date(currentDate);
                            dayAfter.setDate(currentDate.getDate() + 1);
                            const formattedDayAfter = `${dayAfter.getDate()}`.padStart(2, '0');
                            const formattedMonthAfter = `${dayAfter.getMonth() + 1}`.padStart(2, '0');
                            updatedDatesAfterWeekOffDates.push(`${formattedDayAfter}/${formattedMonthAfter}/${dayAfter.getFullYear()}`);
                        });

                        const hasWeekOffDayNext = allUsers.some(user => updatedDatesAfterWeekOffDates.includes(user.formattedDate));
                        const hasWeekOffDayBefore = allUsers.some(user => updatedDatesBeforeWeekOffDates.includes(user.formattedDate));

                        const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        let dayNamesArray = [];
                        allUsers.forEach((all) => {
                            d.tookleave.map((val) => {
                                const [day, month, year] = all.formattedDate.split('/').map(Number);

                                if ((parseInt(val.year) === year) && (val.month === monthstring[month - 1]) && (val.week === all.weekNumberInMonth)) {
                                    dayNamesArray.push(val.day);
                                }
                            })
                        })

                        let uniqueDayNames = Array.from(new Set(dayNamesArray.map((t) => t)));

                        if (d.leaverespecttoweekoff === true && hasBeforeDay && !hasWeekOffDayNext && !hasWeekOffDayBefore) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date (${updatedDatesAfterWeekOffDates.map(d => d)}, ${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === true && hasAfterDay && !hasWeekOffDayBefore && !hasWeekOffDayNext) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date(${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === false && hasAfterDay) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${afterDay}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === false && hasBeforeDay) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${beforeDay}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (availableDays == '' || availableDays == 0) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"No more available leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (allUsers.length > availableDays) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You applied leave more than available days"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttotraining === false && appleave.workmode === 'Internship') {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in training period. Cannot Approved Leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.tookleavecheck === false && allUsers.some(val => uniqueDayNames.includes(val.dayName))) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${uniqueDayNames.map(d => d).join(',')}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.uninformedleave === true && isAnyPastDate && check) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.uninformedleavecount} days of leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.uninformedleave === true && isAnyPastDate && uninformedcheck && !check) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied Uninformed Leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult.length > 0 && d.leavefornoticeperiod === true && check2) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.leavefornoticeperiodcount} days of leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult.length > 0 && d.leavefornoticeperiod === true && noticeperiodcheck && !check2) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied leave in the noticeperiod`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else {
                            if (d.tookleavecheck === true && allUsers.some(val => uniqueDayNames.includes(val.dayName))) {
                                setShowAlert(
                                    <>
                                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${uniqueDayNames.map(d => d).join(',')}. If you want to Approved Leave on this day it will be calculate as a Double Lop. Do you want to apply?`}</p>
                                    </>
                                );
                                handleClickOpenerrForTookLeaveCheck();
                            }
                            else {
                                sendRequest();
                            }
                        }
                    })
                })
            }
            else {
                sendRequest();
            }

        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setLeave("Please Select LeaveType");
        setAppleave({
            employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: 'Random', date: "", todate: "", reasonforleave: "", reportingto: "",
            noofshift: '', availabledays: ''
        });
        setAllUsers([]);
        setAvailableDays('');
        setGetSelectedDates([]);
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setBranchOption([]);
        setUnitOption([]);
        setTeamOption([]);
        setEmpname([]);
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
    const handleClickOpenEdit = () => { setIsEditOpen(true); };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setisCheckOpen(true); };
    const handleCloseCheck = () => { setisCheckOpen(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    //get single row to edit....
    const getCode = async (e, name) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAppleaveEdit(res?.data?.sapplyleave);
            setLeaveId(res?.data?.sapplyleave._id);
            setAccesDropEdit(res?.data?.sapplyleave.access);
            setLeaveEdit(res?.data?.sapplyleave.leavetype);
            setAllUsersEdit(res?.data?.sapplyleave.usershifts);
            setGetSelectedDatesEdit(res?.data?.sapplyleave.date);
            setSelectedOptionsCompanyEdit(res?.data?.sapplyleave?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sapplyleave?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sapplyleave?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sapplyleave?.team.map((item) => ({ label: item, value: item })));
            setValueCompanyCatEdit(res?.data?.sapplyleave?.company)
            setValueBranchCatEdit(res?.data?.sapplyleave?.branch)
            setValueUnitCatEdit(res?.data?.sapplyleave?.unit)
            setValueTeamCatEdit(res?.data?.sapplyleave?.team)

            fetchLeaveCriteriaEdit(
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.employeename : isUserRoleAccess.companyname),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.department : isUserRoleAccess.department),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.designation : isUserRoleAccess.designation),
                res?.data?.sapplyleave.leavetype,
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.doj : isUserRoleAccess.doj),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.weekoff : isUserRoleAccess.weekoff),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.employeeid : isUserRoleAccess.empcode),
            );

            setAvailableDaysEdit(res?.data?.sapplyleave?.availabledays);

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_vendor?.data?.applyleaves.filter((item) => item._id !== res?.data?.sapplyleave._id && item.employeeid === res?.data?.sapplyleave.employeeid).flatMap(d => d.date);
            setCheckDuplicateEdit(result);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const getinfoCodeStatus = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSelectStatus(res?.data?.sapplyleave);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAppleaveEdit(res?.data?.sapplyleave);
            setAllUsersEdit(res?.data?.sapplyleave.usershifts)
            setSelectedOptionsCompanyEdit(res?.data?.sapplyleave?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sapplyleave?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sapplyleave?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sapplyleave?.team.map((item) => ({ label: item, value: item })));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAppleaveEdit(res?.data?.sapplyleave);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //Project updateby edit page...
    let updateby = appleaveEdit?.updatedby;
    let addedby = appleaveEdit?.addedby;
    let updatedByStatus = selectStatus.updatedby;

    let subprojectsid = appleaveEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        let comp = selectedOptionsCompanyEdit.map((item) => item.value);
        let bran = selectedOptionsBranchEdit.map((item) => item.value);
        let unit = selectedOptionsUnitEdit.map((item) => item.value);
        let team = selectedOptionsTeamEdit.map((item) => item.value);

        const currentDate = moment();

        const isAnyPastDate = allUsersEdit.some(user => {
            const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
            return userDate.isBefore(currentDate, 'day');
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode
        let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empid: empid,
        });

        let noticeresult = res?.data?.noticeperiodapply;

        try {
            let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${leaveId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employeename: AccessdropEdit === "HR" ? String(appleaveEdit.employeename) : isUserRoleAccess.companyname,
                employeeid: AccessdropEdit === "HR" ? String(appleaveEdit.employeeid) : isUserRoleAccess.empcode,
                leavetype: String(appleaveEdit.leavetype),
                // date: String(appleaveEdit.date),
                // todate: String(appleaveEdit.todate),
                // numberofdays: String(calculateDaysDifferenceEdit()),
                department: String(appleaveEdit.department),
                designation: String(appleaveEdit.designation),
                doj: String(appleaveEdit.doj),
                weekoff: appleaveEdit.weekoff,
                workmode: String(appleaveEdit.workmode),
                date: [...getSelectedDatesEdit],
                numberofdays: String(allUsersEdit.length),
                usershifts: [...allUsersEdit],
                noofshift: Number(appleaveEdit.noofshift),
                durationtype: String(appleaveEdit.durationtype),
                availabledays: Number(appleaveEdit.availabledays ? appleaveEdit.availabledays : availableDaysEdit),
                reasonforleave: String(appleaveEdit.reasonforleave),
                reportingto: AccessdropEdit === "HR" ? String(appleaveEdit.reportingto) : isUserRoleAccess.reportingto,
                uninformedleavestatus: String(appleaveEdit.uninformedleavestatus ? appleaveEdit.uninformedleavestatus : ((leaveRestrictionEdit === true && isAnyPastDate) ? 'Uninformed' : '')),
                noticeperiodstatus: String(appleaveEdit.noticeperiodstatus ? appleaveEdit.noticeperiodstatus : (noticeresult ? 'Noticeperiod' : '')),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            handleCloseModEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        const checkLeaveStatus = allUsersEdit?.find(d => d.leavestatus === '')

        fetchApplyleaveAll();

        let empid = AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode;
        let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empid: empid,
        });

        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let uninformResult = res_vendor?.data?.applyleaves.filter((item) => item._id !== appleaveEdit._id && item.employeeid === empid && item.uninformedleavestatus === 'Uninformed').flatMap(d => d.date);
        let noticeresult = res?.data?.noticeperiodapply;
        let noticeresultDate = res_vendor?.data?.applyleaves.filter((item) => item._id !== appleaveEdit._id && item.employeeid === empid && item.noticeperiodstatus === 'Noticeperiod').flatMap(d => d.date);

        const isNameMatch = allApplyleaveedit.some((item) => item.reasonforleave.toLowerCase() === appleaveEdit.reasonforleave.toLowerCase() && item.employeename === appleaveEdit.employeename && item.leavetype === leaveEdit && item.date === appleaveEdit.date && item.todate === appleaveEdit.todate);

        if (appleaveEdit.employeename === "Please Select Employee Name") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.availabledays == '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"No more available leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (allUsersEdit.length > appleaveEdit.availabledays) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You applied leave more than available days"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.leavetype === "Please Select LeaveType") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select LeaveType"}</p>
                </>
            );
            handleClickOpenerr();
        }
        // else if (appleaveEdit.date === "") {
        //   setShowAlert(
        //     <>
        //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
        //     </>
        //   );
        //   handleClickOpenerr();
        // } 
        // else if (appleaveEdit.todate === "") {
        //   setShowAlert(
        //     <>
        //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
        //     </>
        //   );
        //   handleClickOpenerr();
        // } 
        else if (allUsersEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.noofshift === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checkLeaveStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.reasonforleave === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason for Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {

            let weekoff = AccessdropEdit === 'HR' ? appleaveEdit.weekoff : isUserRoleAccess.weekoff
            leavecriteriasEdit.forEach((d) => {

                let check = allUsersEdit.length > parseInt(d.uninformedleavecount);
                let uninformedcheck = uninformResult.length >= parseInt(d.uninformedleavecount);
                let noticeperiodcheck = noticeresultDate.length >= parseInt(d.leavefornoticeperiodcount);
                let check2 = allUsersEdit.length > parseInt(d.leavefornoticeperiodcount);

                const currentDate = moment();

                const isAnyPastDate = allUsersEdit.some(user => {
                    const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
                    return userDate.isBefore(currentDate, 'day');
                });

                weekoff?.forEach(empwkoffday => {

                    // find out weekoff's before and after dayname
                    const [beforeDay, afterDay] = getDayBeforeAndAfter(empwkoffday);

                    const hasBeforeDay = allUsersEdit.some(user => user.dayName === beforeDay);
                    const hasAfterDay = allUsersEdit.some(user => user.dayName === afterDay);
                    // const hasWeekOffDay = allUsersEdit.some(user => user.dayName === empwkoffday);

                    const hasBeforeDayDate = allUsersEdit.filter(user => user.dayName === beforeDay).map(d => d.formattedDate);
                    const hasAfterDayDate = allUsersEdit.filter(user => user.dayName === afterDay).map(d => d.formattedDate);

                    let updatedDatesBeforeWeekOffDates = [];
                    let updatedDatesAfterWeekOffDates = [];

                    //for example if selected date is monday
                    hasAfterDayDate.forEach(date => {
                        const [day, month, year] = date.split('/');
                        const currentDate = new Date(`${year}-${month}-${day}`);

                        // Get the day before
                        const dayBefore = new Date(currentDate);
                        dayBefore.setDate(currentDate.getDate() - 1);
                        const formattedDayBefore = `${dayBefore.getDate()}`.padStart(2, '0');
                        const formattedMonthBefore = `${dayBefore.getMonth() + 1}`.padStart(2, '0');
                        updatedDatesBeforeWeekOffDates.push(`${formattedDayBefore}/${formattedMonthBefore}/${dayBefore.getFullYear()}`);

                    });

                    hasBeforeDayDate.forEach(date => {
                        const [day, month, year] = date.split('/');
                        const currentDate = new Date(`${year}-${month}-${day}`);

                        // Get the day after
                        const dayAfter = new Date(currentDate);
                        dayAfter.setDate(currentDate.getDate() + 1);
                        const formattedDayAfter = `${dayAfter.getDate()}`.padStart(2, '0');
                        const formattedMonthAfter = `${dayAfter.getMonth() + 1}`.padStart(2, '0');
                        updatedDatesAfterWeekOffDates.push(`${formattedDayAfter}/${formattedMonthAfter}/${dayAfter.getFullYear()}`);
                    });

                    const hasWeekOffDayNext = allUsersEdit.some(user => updatedDatesAfterWeekOffDates.includes(user.formattedDate));
                    const hasWeekOffDayBefore = allUsersEdit.some(user => updatedDatesBeforeWeekOffDates.includes(user.formattedDate));

                    if (d.leaverespecttoweekoff === true && hasBeforeDay && !hasWeekOffDayNext && !hasWeekOffDayBefore) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date (${updatedDatesAfterWeekOffDates.map(d => d)}, ${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.leaverespecttoweekoff === true && hasAfterDay && !hasWeekOffDayBefore && !hasWeekOffDayNext) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date(${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.leaverespecttoweekoff === false && hasAfterDay) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${afterDay}`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.leaverespecttoweekoff === false && hasBeforeDay) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${beforeDay}`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.leaverespecttotraining === false && appleaveEdit.workmode === 'Internship') {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in training period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot Approved Leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (allUsersEdit.some(val => d.tookleave.includes(val.dayName.toLowerCase()))) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${d.tookleave.map(d => d.toUpperCase())}`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.uninformedleave === true && isAnyPastDate && check) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.uninformedleavecount} days of leave`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.uninformedleave === true && isAnyPastDate && uninformedcheck && !check) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied Uninformed Leave`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === true && check2) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.leavefornoticeperiodcount} days of leave`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult.length > 0 && d.leavefornoticeperiod === true && noticeperiodcheck && !check2) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied leave in the noticeperiod`}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else {
                        sendEditRequest();
                    }
                })
            })
        }
    };

    const sendEditStatus = async () => {
        try {
            let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${selectStatus._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String(selectStatus.status),
                rejectedreason: String(selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""),
                actionby: String(isUserRoleAccess.companyname),
                updatedby: [
                    ...updatedByStatus,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            handleStatusClose();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const editStatus = () => {
        if (selectStatus.status == "Rejected") {
            if (selectStatus.rejectedreason == "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Rejected Reason"}</p>
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

    //get all Sub vendormasters.
    const fetchApplyleave = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.LEAVE_HOME_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplyleavecheck(true);
            let answer = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname);
            setApplyleaves(answer);
            let Approve = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves.filter((data) => data.status === "Approved") : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname && data.status === "Approved");
            setIsApplyLeave(Approve);
        } catch (err) { setApplyleavecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all Sub vendormasters.
    const fetchApplyleaveAll = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllApplyleaveedit(res_vendor?.data?.applyleaves.filter((item) => item._id !== appleaveEdit._id));
            let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode;
            let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);
            setCheckDuplicate(result);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Excel
    const fileName = "Today Leave Approved";

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
                    "Leave Type": t.leavetype,
                    "Date": t.date + ', ',
                    "Number of Shift": t.noofshift,
                    "Reason for Leave": t.reasonforleave,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                applyleaves.map((t, index) => ({
                    "SNo": index + 1,
                    "Employee Name": t.employeename,
                    "Employee Id": t.employeeid,
                    "Leave Type": t.leavetype,
                    "Date": t.date + ', ',
                    "Number of Shift": t.noofshift,
                    "Reason for Leave": t.reasonforleave,
                })),
                fileName,
            );
        }

        setIsFilterOpen(false)
    };

    // Print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Today Leave Approved",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Employee Id", field: "employeeid" },
        { title: "Employee Name", field: "employeename" },
        { title: "Leavetype", field: "leavetype" },
        { title: "Date", field: "date" },
        { title: "Number of Shift", field: "noofshift" },
        { title: "Reason for leave", field: "reasonforleave" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            applyleaves.map(row => {
                return {
                    ...row,
                    serialNumber: serialNumberCounter++,
                }
            });

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Today Leave Approved.pdf");
    };

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        // getexcelDatas();
    }, [appleaveEdit, appleave, applyleaves, checkDuplicate]);

    useEffect(() => {
        fetchApplyleave();
        fetchApplyleaveAll();
    }, []);

    useEffect(() => {
        fetchApplyleaveAll();
    }, [isEditOpen, appleaveEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(applyleaves);
    }, [applyleaves]);

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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "employeeid", headerName: "Employee Id", flex: 0, width: 250, hide: !columnVisibility.employeeid, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "leavetype", headerName: "Leave Type", flex: 0, width: 250, hide: !columnVisibility.leavetype, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 250, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "noofshift", headerName: "Number of Shift", flex: 0, width: 250, hide: !columnVisibility.noofshift, headerClassName: "bold-header" },
        { field: "reasonforleave", headerName: "Reason for Leave", flex: 0, width: 250, hide: !columnVisibility.reasonforleave, headerClassName: "bold-header" },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 90,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && !["Approved", "Rejected"].includes(params.data.status)) {
                    return (
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                                    fontSize: "10px",
                                    width: "60px",
                                    fontWeight: "bold",
                                    cursor: 'default'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Grid>
                    );
                } else {
                    return (
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                                    fontSize: "10px",
                                    width: "60px",
                                    fontWeight: "bold",
                                    cursor: 'default'
                                }}
                            >
                                {params.value}
                            </Button>
                        </Grid>
                    );
                }
            },
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
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {(!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.data.status)) ||
                          (isUserRoleCompare?.includes("eapplyleave") && params.data.status !== 'Approved' && (
                            <Button
                              sx={userStyle.buttonedit}
                              onClick={() => {
                                handleClickOpenEdit();
                                getCode(params.data.id, params.data.name);
                              }}
                            >
                              <EditOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                          ))} */}
                    {(!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.data.status)) ||
                        (isUserRoleCompare?.includes("dtodayleave") && params.data.status !== 'Approved' && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.data.id, params.data.name);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                        ))}
                    {isUserRoleCompare?.includes("vtodayleave") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {((isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.data.status)) ||
                        (isUserRoleCompare?.includes("itodayleave") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    handleClickOpeninfo();
                                    getinfoCode(params.data.id);
                                }}
                            >
                                <InfoOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                        ))}
                    {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin"))
                        ? null
                        : isUserRoleCompare?.includes("itodayleave") && (
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: "red",
                                    minWidth: "15px",
                                    padding: "6px 5px",
                                }}
                                onClick={(e) => {
                                    getinfoCodeStatus(params.data.id);
                                    handleStatusOpen();
                                    getCodeNew(params.data);
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
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            employeeid: item.employeeid,
            employeename: item.employeename,
            leavetype: item.leavetype,
            // date: item.date + "--" + item.todate,
            date: item.date,
            noofshift: item.noofshift,
            reasonforleave: item.reasonforleave,
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
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    const DateFrom = (isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && Accessdrop === "HR" ? formattedDatePresent : formattedDatet;

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

    return (
        <Box>
            <Headtitle title={"Today Leave Approved"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Today Leave Approved"
                modulename="Dashboard"
                submodulename="Employee"
                mainpagename="Today Leave"
                subpagename=""
                subsubpagename=""
            />
            {/* <Typography sx={userStyle.HeaderText}>
                Today Leave Approved
            </Typography> */}
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                // sx={{
                //   overflow: "visible",
                //   "& .MuiPaper-root": {
                //     overflow: "visible",
                //   },
                // }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <form >
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={8} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Approved Leave</Typography>
                                    </Grid>
                                    {(isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && (
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
                                                        setAppleaveEdit({ ...appleaveEdit, date: "", todate: "" });
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
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Company<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={companyOption}
                                                        value={selectedOptionsCompanyEdit}
                                                        onChange={(e) => {
                                                            handleCompanyChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererCompanyEdit}
                                                        labelledBy="Please Select Company"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={branchOption
                                                            ?.filter((u) => valueCompanyCatEdit?.includes(u.company))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.name,
                                                                value: u.name,
                                                            }))}
                                                        value={selectedOptionsBranchEdit}
                                                        onChange={(e) => {
                                                            handleBranchChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranchEdit}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={unitOption
                                                            ?.filter((u) => valueBranchCatEdit?.includes(u.branch))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.name,
                                                                value: u.name,
                                                            }))}
                                                        value={selectedOptionsUnitEdit}
                                                        onChange={(e) => {
                                                            handleUnitChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnitEdit}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={teamOption
                                                            ?.filter((u) => valueUnitCatEdit?.includes(u.unit))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.teamname,
                                                                value: u.teamname,
                                                            }))}
                                                        value={selectedOptionsTeamEdit}
                                                        onChange={(e) => {
                                                            handleTeamChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererTeamEdit}
                                                        labelledBy="Please Select Team"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Employee Name<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        // options={empnamesEdit}
                                                        options={empnamesEdit
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCatEdit?.includes(u.company) &&
                                                                    valueBranchCatEdit?.includes(u.branch) &&
                                                                    valueUnitCatEdit?.includes(u.unit) &&
                                                                    valueTeamCatEdit?.includes(u.team)
                                                            )
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.companyname,
                                                                value: u.companyname,
                                                            }))}
                                                        styles={colourStyles}
                                                        value={{ label: appleaveEdit.employeename, value: appleaveEdit.employeename }}
                                                        onChange={(e) => {
                                                            setAppleaveEdit({ ...appleaveEdit, employeename: e.value, employeeid: e.empcode, reportingto: e.reportingto, department: e.department, designation: e.designation, doj: e.doj, weekoff: e.weekoff, workmode: e.workmode, date: "", todate: "" });
                                                            setAvailableDaysEdit('');
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Employee ID </Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.employeeid} />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Employee Name</Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={isUserRoleAccess.companyname} />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Employee ID </Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={isUserRoleAccess.empcode} />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Leave Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                size="small"
                                                options={leaveTypeData}
                                                styles={colourStyles}
                                                value={{ label: appleaveEdit.leavetype, value: appleaveEdit.leavetype }}
                                                onChange={(e) => {
                                                    setAppleaveEdit({ ...appleaveEdit, leavetype: e.value });
                                                    fetchLeaveCriteriaEdit(
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.employeename : isUserRoleAccess.companyname),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.department : isUserRoleAccess.department),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.designation : isUserRoleAccess.designation),
                                                        e.value,
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.doj : isUserRoleAccess.doj),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.weekoff : isUserRoleAccess.weekoff),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode),
                                                    );
                                                    setAvailableDaysEdit('');
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    {/* <Grid item md={4} xs={12} sm={12}>
                                  <Grid container spacing={1.2} marginTop={1}>
                                    <Grid item md={1.2} xs={12} sm={12} marginTop={1}>
                                      <Typography>
                                        Date<b style={{ color: "red" }}>*</b>
                                      </Typography>
                                    </Grid>
                                    <Grid item md={4.5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={appleaveEdit.date}
                                          onChange={(e) => {
                                            setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={1.2} xs={12} sm={12} marginTop={1}>
                                      <Typography>To</Typography>
                                    </Grid>
                                    <Grid item md={4.5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={appleaveEdit.todate}
                                          onChange={(e) => {
                                            setAppleaveEdit({ ...appleaveEdit, todate: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? (new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "") : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "" });
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12}></Grid>
                                  </Grid>
                                </Grid>
                                <br /> */}

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Remaining Days </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.availabledays ? appleaveEdit.availabledays : availableDaysEdit} />
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Duration Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.durationtype} />
                                            {/* <Selects
                                      size="small"
                                      options={durationOptions}
                                      styles={colourStyles}
                                      value={{ label: appleaveEdit.durationtype, value: appleaveEdit.durationtype }}
                                      onChange={(e) => {
                                        setAppleaveEdit({ ...appleaveEdit, durationtype: e.value, date: '', todate: '', noofshift: '' });
                                        // setAllUsersEdit([]);
                                        // setGetSelectedDatesEdit([]);
                                      }}
                                    /> */}
                                        </FormControl>
                                    </Grid>
                                    {appleaveEdit.durationtype === 'Random' ? (
                                        <>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container spacing={1.2} marginTop={1}>
                                                    <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                                                        <Typography>
                                                            Date<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4.5} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="date"
                                                                value={appleaveEdit.date}
                                                                onChange={(e) => {
                                                                    if (leaveRestrictionEdit === true) {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: e.target.value })
                                                                    } else {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={1} sm={12} xs={12} marginTop={1}>
                                                        <Button variant="contained" color="success" type="button" sx={{ height: "30px", minWidth: "30px", padding: "6px 10px", marginTop: '4px' }}
                                                            onClick={(e) => {
                                                                if (AccessdropEdit === 'HR' && appleaveEdit.employeename === 'Please Select Employee Name') {
                                                                    setShowAlert(
                                                                        <>
                                                                            <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                                                                        </>
                                                                    );
                                                                    handleClickOpenerr();
                                                                } else {
                                                                    fetchUsersRandomEdit((AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode), appleaveEdit.date)
                                                                }
                                                            }} >
                                                            <FaPlus />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item md={5} xs={12} sm={12}>
                                                <Grid container spacing={1.2} marginTop={1}>
                                                    <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                                                        <Typography>
                                                            Date<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4.5} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="date"
                                                                value={appleaveEdit.date}
                                                                onChange={(e) => {
                                                                    if (leaveRestrictionEdit === true) {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: e.target.value })
                                                                    } else {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });

                                                                        //   fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), e.target.value, appleave.todate)
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={1} xs={12} sm={12} marginTop={1}>
                                                        <Typography>To</Typography>
                                                    </Grid>
                                                    <Grid item md={4.5} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="date"
                                                                value={appleaveEdit.todate}
                                                                onChange={(e) => {
                                                                    if (leaveRestrictionEdit === true) {
                                                                        setAppleaveEdit({ ...appleaveEdit, todate: e.target.value })
                                                                    } else {
                                                                        setAppleaveEdit({ ...appleaveEdit, todate: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? (new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "") : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "" });
                                                                        // setAppleave({ ...appleave, todate: e.target.value });
                                                                        // fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date, e.target.value)
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={0.5} sm={12} xs={12} marginTop={1}>
                                                        <Button variant="contained" color="success" type="button" sx={{ height: "30px", minWidth: "30px", padding: "6px 10px", marginTop: '-2px' }}
                                                            onClick={(e) => {
                                                                if (AccessdropEdit === 'HR' && appleaveEdit.employeename === 'Please Select Employee Name') {
                                                                    setShowAlert(
                                                                        <>
                                                                            <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                                                                        </>
                                                                    );
                                                                    handleClickOpenerr();
                                                                } else {
                                                                    fetchUsersEdit((AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode), appleaveEdit.date, appleaveEdit.todate)
                                                                }
                                                            }} >
                                                            <FaPlus />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                        </>
                                    )}
                                    <br />
                                    <Grid item md={8} xs={12} sm={12}></Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <>
                                            {allUsersEdit.length > 0 ?
                                                (<Grid container>
                                                    <Grid item md={5} sm={12} xs={12}>
                                                        <Typography>Shift</Typography>
                                                    </Grid>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <Typography>Leave<b style={{ color: "red" }}>*</b></Typography>
                                                    </Grid>
                                                    <Grid item md={2} sm={12} xs={12}>
                                                        <Typography>Count<b style={{ color: "red" }}>*</b></Typography>
                                                    </Grid>
                                                </Grid>)
                                                : null}
                                            {allUsersEdit &&
                                                allUsersEdit.map((column, index) => (
                                                    <Grid container key={index}>
                                                        <React.Fragment key={index}>
                                                            <Grid item md={5} sm={6} xs={12} fullWidth>
                                                                <Box sx={{ border: '1px solid #80808094', font: 'inherit', color: 'currentColor', fontSize: '14px', lineHeight: 1.3, padding: '8.5px 14px', borderRadius: '3.5px', display: 'block', background: '#80808030', margin: '0.5px' }}>
                                                                    {`${column.formattedDate} (${column.shift})`}
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={4} sm={6} xs={12} fullWidth>
                                                                <Box sx={{ display: 'block', margin: '0.5px' }}>
                                                                    <Selects
                                                                        size="small"
                                                                        options={leaveStatusOptions}
                                                                        styles={colourStyles}
                                                                        value={leaveStatusOptions.find(option => option.value === column.leavestatus)}
                                                                        onChange={(selectedOption) => multiLeaveStatusInputsEdit(index, selectedOption.value)}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={2} sm={6} xs={12} fullWidth>
                                                                <Box sx={{ display: 'block', margin: '0.5px' }}>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        value={column.shiftcount}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={1} sm={6} xs={1} sx={{ display: 'flex' }}>
                                                                <Button variant="contained" color="error" type="button" onClick={(e) => handleDeleteEdit(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}>x</Button>
                                                            </Grid>
                                                        </React.Fragment>

                                                    </Grid>
                                                ))}
                                        </>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Number of Shift</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.noofshift}
                                            //  onChange={(e) => {
                                            //   setAppleave({ ...appleave, reasonforleave: e.target.value });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12}></Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Reason for Leave<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={appleaveEdit.reasonforleave}
                                                onChange={(e) => {
                                                    setAppleaveEdit({ ...appleaveEdit, reasonforleave: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Reporting To </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={AccessdropEdit === "HR" ? appleaveEdit.reportingto : isUserRoleAccess.reportingto} />
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
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
            {isUserRoleCompare?.includes("ltodayleave") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Today Leave Approved List</Typography>
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
                                        <MenuItem value={applyleaves?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("exceltodayleave") && (
                                        <>
                                            {/* <ExportXL csvData={applyData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchApplyleave()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtodayleave") && (
                                        <>
                                            {/* <ExportCSV csvData={applyData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchApplyleave()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtodayleave") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftodayleave") && (
                                        <>
                                            {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button> */}
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    // fetchApplyleave()
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagetodayleave") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={applyleaves}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                />
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
                        {/* {isUserRoleCompare?.includes("bdapplyleave") && (
              <>
                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>
              </>
            )} */}
                        <br />
                        <br />
                        {!applyleaveCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <>
                                        <AggridTable
                                            rowDataTable={rowDataTable}
                                            columnDataTable={columnDataTable}
                                            columnVisibility={columnVisibility}
                                            page={page}
                                            setPage={setPage}
                                            pageSize={pageSize}
                                            totalPages={totalPages}
                                            setColumnVisibility={setColumnVisibility}
                                            isHandleChange={isHandleChange}
                                            items={items}
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            gridRefTable={gridRefTable}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                        />
                                    </>
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
                <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delApply(Applysid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}

                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Approved Leave Info</Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SNo</TableCell>
                                <TableCell> Employee Id</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Leave Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Number of days</TableCell>
                                <TableCell>Reason for leave</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.employeeid}</TableCell>
                                        <TableCell>{row.employeename}</TableCell>
                                        <TableCell>{row.leavetype}</TableCell>
                                        <TableCell>{row.date + ", "}</TableCell>
                                        <TableCell>{row.noofshift}</TableCell>
                                        <TableCell>{row.reasonforleave}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                <Box sx={{ width: "950px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Approved Leave</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            {(isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && (
                                <Grid item md={3} sm={6} xs={12}>
                                    <Typography variant="h6">Access</Typography>
                                    <Typography>{appleaveEdit.access}</Typography>
                                </Grid>
                            )}
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            {appleaveEdit.access === "HR" ? (
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Company </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsCompanyEdit) ? selectedOptionsCompanyEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Branch</Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsBranchEdit) ? selectedOptionsBranchEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Unit  </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsUnitEdit) ? selectedOptionsUnitEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Team </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsTeamEdit) ? selectedOptionsTeamEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee Name</Typography>
                                            <Typography>{appleaveEdit.employeename}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee ID </Typography>
                                            <Typography>{appleaveEdit.employeeid}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee Name</Typography>
                                            <Typography>{appleaveEdit.employeename}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee ID </Typography>
                                            <Typography>{appleaveEdit.employeeid}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Leave Type</Typography>
                                    <Typography>{appleaveEdit.leavetype}</Typography>
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={2} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Date</Typography>
                                <Typography>{appleaveEdit.date}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">To Date</Typography>
                                <Typography>{appleaveEdit.todate}</Typography>
                              </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Remaining Days </Typography>
                                    <Typography>{appleaveEdit.availabledays}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Duration Type</Typography>
                                    <Typography>{appleaveEdit.durationtype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{appleaveEdit.date + ", "}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={8} xs={12} sm={12}></Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <>
                                    {allUsersEdit.length > 0 ?
                                        (<Grid container>
                                            <Grid item md={5} sm={6} xs={12}>
                                                <Typography variant="h6">Shift</Typography>
                                            </Grid>
                                            <Grid item md={4} sm={6} xs={12}>
                                                <Typography variant="h6">Leave</Typography>
                                            </Grid>
                                            <Grid item md={2} sm={6} xs={12}>
                                                <Typography variant="h6">Count</Typography>
                                            </Grid>
                                        </Grid>)
                                        : null}
                                    {allUsersEdit &&
                                        allUsersEdit.map((column, index) => (
                                            <Grid container key={index}>
                                                <React.Fragment key={index}>
                                                    <Grid item md={5} sm={6} xs={12} fullWidth>
                                                        <Typography>{`${column.formattedDate} (${column.shift})`}</Typography>
                                                    </Grid>
                                                    <Grid item md={4} sm={6} xs={12} fullWidth>
                                                        <Typography>{column.leavestatus}</Typography>
                                                    </Grid>
                                                    <Grid item md={2} sm={6} xs={12} fullWidth>
                                                        <Typography>{column.shiftcount}</Typography>
                                                    </Grid>
                                                </React.Fragment>
                                            </Grid>
                                        ))}
                                </>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Number of Shift</Typography>
                                    <Typography>{appleaveEdit.noofshift}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12}></Grid>
                            <Grid item md={3.5} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reason for Leave</Typography>
                                    <Typography>{appleaveEdit.reasonforleave}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3.7} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reporting To</Typography>
                                    <Typography>{appleaveEdit.reportingto}</Typography>
                                </FormControl>
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
                            style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
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
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delApplycheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
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

            <Box>
                <Dialog open={isErrorOpenForTookLeaveCheck} onClose={handleCloseerrForTookLeaveCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={sendRequestDouble}>
                            ok
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCloseerrForTookLeaveCheck}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* dialog status change */}
            <Box>
                <Dialog maxWidth="lg" open={statusOpen} onClose={handleStatusClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                                <Typography sx={userStyle.HeaderText}>Edit Apply Status</Typography>
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
                                        value={{ label: selectStatus.status, value: selectStatus.value }}
                                        onChange={(e) => {
                                            setSelectStatus({ ...selectStatus, status: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12}>
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
                                                setSelectStatus({ ...selectStatus, rejectedreason: e.target.value });
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
                            style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
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
            <Box>
                <Dialog open={isEditOpenCheckList} onClose={handleCloseModEditCheckList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl" fullWidth={true} sx={{
                    overflow: 'visible',
                    '& .MuiPaper-root': {
                        overflow: 'auto',
                    },
                }}>
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.SubHeaderText} >
                                My Check List
                            </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2} >
                                <Grid item md={12} xs={12} sm={12} >
                                    <FormControl fullWidth size="small" sx={{ display: 'flex', justifyContent: 'center', border: '1px solid black', borderRadius: '20px' }} >
                                        <Typography sx={{ fontSize: '1rem', textAlign: 'center' }} >
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
                                            <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                                            <TableCell style={{ fontSize: '1.2rem' }}>Action</TableCell>
                                            <TableCell style={{ fontSize: '1.2rem' }}>Assigned Person</TableCell>
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
                                                                    <OutlinedInput value={row.data}
                                                                        style={{ height: '32px' }}
                                                                        type="text"
                                                                        onChange={(e) => {
                                                                            const inputValue = e.target.value;
                                                                            if (/^[0-9]*$/.test(inputValue)) {
                                                                                handleDataChange(e, index, "Text Box-number")
                                                                            }

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
                                                                                {row.files && <Grid container spacing={2}>
                                                                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                                                                        <Typography>{row.files.name}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item sx={{ cursor: 'pointer' }} lg={1.5} md={1} sm={1} xs={1} onClick={() => renderFilePreviewEdit(row.files)}>
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

                                                                            </Box>

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
                                                <TableCell><span>
                                                    {row?.employee && row?.employee?.map((data, index) => (
                                                        <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                                                    ))}
                                                </span></TableCell>
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
                                fetchApplyleave()
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
            </Box>
        </Box>
    );
}

export default TodayLeaveApproved;