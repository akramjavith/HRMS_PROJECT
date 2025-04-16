import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from '@mui/icons-material/Image';
import LastPageIcon from "@mui/icons-material/LastPage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableContainer, TableHead, TextareaAutosize, Tooltip, Typography, } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiInput from "@mui/material/Input";
import Popover from "@mui/material/Popover";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from "@mui/system";
import axios from "axios";
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import CheckListTable from "../../../hr/exit details/ChecklistTable";
import Webcamimage from "../Webcamprofile";

import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import Headtitle from "../../../../components/Headtitle";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";

import { LoadingButton } from "@mui/lab";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from "../../../../components/Alert";
import {
    DeleteConfirmation
} from "../../../../components/DeleteConfirmation.js";

const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};



const Input = styled(MuiInput)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none !important",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));


function RejoinEmployeeList() {

    const [deletebtn, setDeleteBtn] = useState(false);
    const [deletebtnDisable, setDeleteBtnDisable] = useState(true);
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    const [isTable, setIsTable] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleCloseTable = () => {
        setIsTable(false);
    }
    const handleOpenTable = (userId) => {
        setSelectedUserId(userId);
        setIsTable(true);
    }

    const [employees, setEmployees] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [replaceName, setReplaceName] = useState("Please Choose Replace name");

    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth } = useContext(AuthContext);

    const [empaddform, setEmpaddform] = useState({});

    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const [isBoarding, setIsBoarding] = useState(false);



    //    popup for releaving
    const [openviewReleave, setOpenviewReleave] = useState(false);
    const handleClickOpenviewReleave = () => {
        setOpenviewReleave(true);
        handleCloseManageColumns();
    };

    const handleCloseviewReleave = () => {
        setOpenviewReleave(false);
        setIsCheckedListOverall(false);
    };

    const [getId, setGetId] = useState("");

    // popover content
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenManageColumns = (event, idval) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
        setGetId(idval);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;


    const username = isUserRoleAccess.username;

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

        if (groupDetails) {
            let returnOverall = groupDetails?.map((row) => {

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

            let allcondition = returnOverall?.every((item) => item == true);

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
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Add Check List</p>
                </>
            );
            handleClickOpenerr();
        }



    }
    const handleCheckboxChange = (index) => {


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
        let statusFor = data();

        if (statusFor) {
            const newCheckedState = [...isCheckedList];
            newCheckedState[index] = !newCheckedState[index];
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


    const deleteChecklist = async () => {
        setDeleteBtn(true);
        const searchItem = datasAvailedDB.find(
            (item) =>
                item.commonid === postID &&
                item.module === "Human Resources" &&
                item.submodule === "HR" &&
                item.mainpage === "Employee" &&
                item.subpage === "Employee Action Details" &&
                item.subsubpage === "Rejoined Employee List"
        );
        try {
            await axios.delete(`${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleCloseMod();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseviewReleave();
            setDeleteBtn(false);
            setDeleteBtnDisable(true);
            setIsCheckedListOverall(false);
        } catch (err) {
            setDeleteBtn(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
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


    const [firstDateValue, setFirstDateValue] = useState([]);
    const [firstTimeValue, setFirstTimeValue] = useState([]);
    const [secondDateValue, setSecondDateValue] = useState([]);
    const [secondTimeValue, setSecondTimeValue] = useState([]);



    let completedbyName = isUserRoleAccess.companyname;


    const updateIndividualData = async (index) => {
        setDeleteBtnDisable(false);
        let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == "Human Resources" && item.submodule == "HR" && item.mainpage == "Employee" && item.subpage == "Employee Action Details" && item.subsubpage == "Rejoined Employee List");

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
                        newFiles: objectData?.files !== undefined ? objectData?.files : "",
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
                        module: thisPageDatas[0]?.modulename,
                        submodule: thisPageDatas[0]?.submodule,
                        mainpage: thisPageDatas[0]?.mainpage,
                        subpage: thisPageDatas[0]?.subpage,
                        subsubpage: thisPageDatas[0]?.subsubpage,
                        category: thisPageDatas[0]?.category,
                        subcategory: thisPageDatas[0]?.subcategory,
                        candidatename: assignDetails?.companyname,
                        status: "progress",
                        groups: [...combinedGroups],
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
        } catch (err) {
            setDeleteBtnDisable(true);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }


    async function fecthDBDatas() {
        try {
            let res = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res?.data?.mychecklist);

            let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID && item.subsubpage == "Rejoined Employee List")
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




    const handleCheckListSubmit = async () => {


        setLoading(true);
        if (groupDetails) {

            let nextStep = isCheckedList.every((item) => item == true);

            if (!nextStep) {
                setLoading(false);
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
            }
            else {

                sendRequestReason();
            }
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Add Check List"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

    }

    const sendRequest = async () => {

        let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == "Human Resources" && item.submodule == "HR" && item.mainpage == "Employee" && item.subpage == "Employee Action Details" && item.subsubpage == "Rejoined Employee List");
        try {
            if (searchItem) {
                let assignbranches = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`,
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
                        status: "completed",
                        groups: groupDetails,
                        updatedby: [
                            ...searchItem?.updatedby,
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
            } else {
                let assignbranches = await axios.post(
                    `${SERVICE.MYCHECKLIST_CREATE}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        commonid: postID,
                        module: thisPageDatas[0]?.modulename,
                        submodule: thisPageDatas[0]?.submodule,
                        mainpage: thisPageDatas[0]?.mainpage,
                        subpage: thisPageDatas[0]?.subpage,
                        subsubpage: thisPageDatas[0]?.subsubpage,
                        category: thisPageDatas[0]?.category,
                        subcategory: thisPageDatas[0]?.subcategory,
                        candidatename: assignDetails?.companyname,
                        status: "completed",
                        groups: groupDetails,
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
            }

            await fetchUnassignedCandidates();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    // Show all columns
    const [columnVisibility, setColumnVisibility] = useState({
        actions: true,
        serialNumber: true,
        empcode: true,
        name: true,
        department: true,
        dateofbirth: true,
        personalnumber: true,
        dateofjoining: true,
        experience: true,
        profileimage: true,
        reportingto: true,
    });

    const [reason, setReason] = useState({ date: formattedDate, reasonname: "" });


    let bor = empaddform._id;

    const [statusemployee, setstatusemployee] = useState("");
    //add function
    const sendRequestReason = async () => {
        let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == "Human Resources" && item.submodule == "HR" && item.mainpage == "Employee" && item.subpage == "Employee Action Details" && item.subsubpage == "Rejoined Employee List");

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
        let previousRelievedDetails = getDetails.relieveddetails ? getDetails.relieveddetails : [];
        try {
            if (searchItem) {
                let assignbranches = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`,
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
                        status: "completed",
                        groups: [...combinedGroups],
                        updatedby: [
                            ...searchItem?.updatedby,
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
            } else {
                let assignbranches = await axios.post(
                    `${SERVICE.MYCHECKLIST_CREATE}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        commonid: postID,
                        module: thisPageDatas[0]?.modulename,
                        submodule: thisPageDatas[0]?.submodule,
                        mainpage: thisPageDatas[0]?.mainpage,
                        subpage: thisPageDatas[0]?.subpage,
                        subsubpage: thisPageDatas[0]?.subsubpage,
                        category: thisPageDatas[0]?.category,
                        subcategory: thisPageDatas[0]?.subcategory,
                        candidatename: assignDetails?.companyname,
                        status: "completed",
                        groups: [...combinedGroups],
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
            }
            let projectscreate = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${bor}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                resonablestatus: statusemployee,
                reasondate: reason.date,
                reasonname: reason.reasonname,
                relieveddetails: [
                    ...previousRelievedDetails,
                    {
                        dateofrelieving: reason.date,
                        reasonforrelieving: reason.reasonname,
                        dateofjoining: getDetails?.doj
                    }
                ],
            });
            setReason(projectscreate.data);
            setReason({ date: formattedDate, reasonname: "" });
            await fetchUnassignedCandidates();
            handleCloseviewReleave();
            await hierarchyCheckDelete(empaddform.companyname, statusemployee);
            setIsCheckedListOverall(false);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const sendBulkUpdateRequest = async () => {
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


        const searchItem = datasAvailedDB.find(
            (item) =>
                item.commonid === postID &&
                item.module === "Human Resources" &&
                item.submodule === "HR" &&
                item.mainpage === "Employee" &&
                item.subpage === "Employee Action Details" &&
                item.subsubpage === "Rejoined Employee List"
        );

        const headers = {
            Authorization: `Bearer ${auth.APIToken}`,
        };

        const createOrUpdateChecklist = async () => {
            const url = searchItem ? `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem._id}` : SERVICE.MYCHECKLIST_CREATE;
            const method = searchItem ? 'put' : 'post';

            const data = searchItem
                ? {
                    commonid: assignDetails?.commonid,
                    module: assignDetails?.module,
                    submodule: assignDetails?.submodule,
                    mainpage: assignDetails?.mainpage,
                    subpage: assignDetails?.subpage,
                    subsubpage: assignDetails?.subsubpage,
                    category: assignDetails?.category,
                    subcategory: assignDetails?.subcategory,
                    candidatename: assignDetails?.fullname,
                    status: "Progress",
                    groups: [...combinedGroups],
                    updatedby: [
                        ...searchItem?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
                : {
                    commonid: postID,
                    module: thisPageDatas[0]?.modulename,
                    submodule: thisPageDatas[0]?.submodule,
                    mainpage: thisPageDatas[0]?.mainpage,
                    subpage: thisPageDatas[0]?.subpage,
                    subsubpage: thisPageDatas[0]?.subsubpage,
                    category: thisPageDatas[0]?.category,
                    subcategory: thisPageDatas[0]?.subcategory,
                    candidatename: assignDetails?.companyname,
                    status: "Progress",
                    groups: [...combinedGroups],
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                };

            await axios[method](url, data, { headers });
        };



        try {
            await createOrUpdateChecklist();

            await fetchUnassignedCandidates();
            await fecthDBDatas();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

            setIsCheckedListOverall(false);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //cancel for reason section
    const handleClearreason = () => {
        setReason({ date: formattedDate, reasonname: "" });
    };

    const [userDetails, setUserDetails] = useState({});

    const [alreadyUpdatedDatas, setAlreadyUpdatedDatas] = useState([]);


    const getCode = async (e, name, details) => {
        console.log(details)
        setGetDetails(details);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let res1 = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res1?.data?.mychecklist);
            let searchItem = res1?.data?.mychecklist.find((item) => item.commonid == userDetails?._id && item.module == "Human Resources" && item.submodule == "HR" && item.mainpage == "Employee" && item.subpage == "Employee Action Details" && item.subsubpage == "Rejoined Employee List");

            if (searchItem) {
                setDeleteBtnDisable(false);
                setAssignDetails(searchItem);



                setPostID(searchItem?.commonid);
                let datasNew = searchItem.groups.map((item) => {
                    switch (item.details) {
                        case 'LEGALNAME':
                            return {
                                ...item, data: userDetails.companyname
                            }
                            break;
                        case 'USERNAME':
                            return {
                                ...item, data: userDetails.username
                            }
                            break;
                        case 'PASSWORD':
                            return {
                                ...item, data: userDetails.originalpassword
                            }
                            break;
                        case 'DATE OF BIRTH':
                            return {
                                ...item, data: userDetails.dob
                            }
                            break;
                        case 'EMAIL':
                            return {
                                ...item, data: userDetails.email
                            }
                            break;
                        case 'PHONE NUMBER':
                            return {
                                ...item, data: userDetails.contactpersonal
                            }
                            break;
                        case 'FIRST NAME':
                            return {
                                ...item, data: userDetails.firstname
                            }
                            break;
                        case 'LAST NAME':
                            return {
                                ...item, data: userDetails.lastname
                            }
                            break;
                        case 'AADHAAR NUMBER':
                            return {
                                ...item, data: userDetails.aadhar
                            }
                            break;
                        case 'PAN NUMBER':
                            return {
                                ...item, data: userDetails.panno
                            }
                            break;
                        case 'CURRENT ADDRESS':
                            return {
                                ...item, data: userDetails.currentaddress
                            }
                            break;
                        default:
                            return {
                                ...item
                            }
                    }
                })
                setGroupDetails(
                    datasNew?.map((data) => ({
                        ...data,
                        lastcheck: false,
                    }))
                );

                setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));


                let forFillDetails = datasNew?.map((data) => {
                    if (data.checklist === "Date Multi Random Time") {
                        if (data?.data && data?.data !== "") {
                            const [date, time] = data?.data?.split(" ");
                            return { date, time };
                        }

                    } else {
                        return { date: "0", time: "0" };
                    }
                });

                let forDateSpan = datasNew?.map((data) => {
                    if (data.checklist === "Date Multi Span") {
                        if (data?.data && data?.data !== "") {
                            const [fromdate, todate] = data?.data?.split(" ");
                            return { fromdate, todate };
                        }
                    } else {
                        return { fromdate: "0", todate: "0" };
                    }
                })


                let forDateTime = datasNew?.map((data) => {
                    if (data.checklist === "DateTime") {
                        if (data?.data && data?.data !== "") {
                            const [date, time] = data?.data?.split(" ");
                            return { date, time };
                        }
                    } else {
                        return { date: "0", time: "0" };
                    }
                })

                let forDateMultiSpanTime = datasNew?.map((data) => {
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

            } else {
                setDeleteBtnDisable(true);
                setAssignDetails(userDetails);
                setPostID(userDetails?._id);
                let datasNew = userDetails?.groups?.map((item) => {
                    switch (item.details) {
                        case 'LEGALNAME':
                            return {
                                ...item, data: userDetails.companyname
                            }
                            break;
                        case 'USERNAME':
                            return {
                                ...item, data: userDetails.username
                            }
                            break;
                        case 'PASSWORD':
                            return {
                                ...item, data: userDetails.originalpassword
                            }
                            break;
                        case 'DATE OF BIRTH':
                            return {
                                ...item, data: userDetails.dob
                            }
                            break;
                        case 'EMAIL':
                            return {
                                ...item, data: userDetails.email
                            }
                            break;
                        case 'PHONE NUMBER':
                            return {
                                ...item, data: userDetails.contactpersonal
                            }
                            break;
                        case 'FIRST NAME':
                            return {
                                ...item, data: userDetails.firstname
                            }
                            break;
                        case 'LAST NAME':
                            return {
                                ...item, data: userDetails.lastname
                            }
                            break;
                        case 'AADHAAR NUMBER':
                            return {
                                ...item, data: userDetails.aadhar
                            }
                            break;
                        case 'PAN NUMBER':
                            return {
                                ...item, data: userDetails.panno
                            }
                            break;
                        case 'CURRENT ADDRESS':
                            return {
                                ...item, data: userDetails.currentaddress
                            }
                            break;
                        default:
                            return {
                                ...item
                            }
                    }
                })
                setGroupDetails(
                    datasNew?.map((data) => ({
                        ...data,
                        lastcheck: false,
                    }))
                );

                setIsCheckedList(new Array(datasNew?.length).fill(false));

                setDateValueRandom(new Array(details?.groups?.length).fill(0))
                setTimeValueRandom(new Array(details?.groups?.length).fill(0))

                setDateValueMultiFrom(new Array(details?.groups?.length).fill(0))
                setDateValueMultiTo(new Array(details?.groups?.length).fill(0))

                setDateValue(new Array(details?.groups?.length).fill(0))
                setTimeValue(new Array(details?.groups?.length).fill(0))

                setFirstDateValue(new Array(details?.groups?.length).fill(0))
                setFirstTimeValue(new Array(details?.groups?.length).fill(0))
                setSecondDateValue(new Array(details?.groups?.length).fill(0))
                setSecondTimeValue(new Array(details?.groups?.length).fill(0))

                setDisableInput(new Array(details?.groups?.length).fill(true))
            }



            setEmpaddform(res?.data?.suser);
            setReplaceName(res?.data?.suser?.companyname);
            setstatusemployee(name);
            handleClickOpenviewReleave();
            await hierarchyCheck(res?.data?.suser?.companyname); fetchEmployeeList(res?.data?.suser?.companyname);
        } catch (err) {
            console.log(err);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [hierarchyDeleteData, setHierarchyDeleteData] = useState([]);
    const [hierarchyDeleteEmployee, setHierarchyDeleteEmployee] = useState([]);

    //getting the datas while clicking options
    const hierarchyCheck = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.HIRERARCHI}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let answer = res.data.hirerarchi.filter((data) => data.supervisorchoose.includes(e));
            let answerEmployeename = res.data.hirerarchi.filter((data) => data.employeename.includes(e));
            setHierarchyDeleteData(answer);
            setHierarchyDeleteEmployee(answerEmployeename);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //while clicking save it happens
    const hierarchyCheckDelete = async (e, status) => {
        try {
            if (status !== "Hold") {
                //Updating The SuperVisor based onn the supervisor array length
                let DeleteSuperVisor =
                    hierarchyDeleteData.length > 0 &&
                    hierarchyDeleteData.map((data, i) => {
                        const checkSame = data.employeename.includes(replaceName);
                        const checkSamesup = data.supervisorchoose.includes(replaceName);

                        //if the supervisor array contains more than one element without the orginal releiveing name
                        if (data.supervisorchoose.length > 1 && !checkSame && !checkSamesup) {
                            const superVisor = data.supervisorchoose;
                            const supervisorCheck = superVisor.filter((item) => item !== e);

                            const ans = [...supervisorCheck, replaceName];
                            const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                supervisorchoose: ans,
                            });
                        } else if (data.supervisorchoose.length > 1 && checkSame && !checkSamesup) {
                            const superVisor = data.supervisorchoose;
                            const supervisorCheck = superVisor.filter((item) => item !== e);

                            const ans = [...supervisorCheck];
                            const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                supervisorchoose: ans,
                            });
                        } else if (data.supervisorchoose.length > 1 && !checkSame && checkSamesup) {
                            const superVisor = data.supervisorchoose;
                            const supervisorCheck = superVisor.filter((item) => item !== e);

                            const ans = [...supervisorCheck];
                            const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                supervisorchoose: ans,
                            });
                        } else if (data.supervisorchoose.length > 1 && checkSame && checkSamesup) {
                            const superVisor = data.supervisorchoose;
                            const supervisorCheck = superVisor.filter((item) => item !== e);

                            const ans = [...supervisorCheck];
                            const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                supervisorchoose: ans,
                            });
                        }
                        //if the supervisor array contains only the orginal releiveing name
                        else if (!checkSame && data.supervisorchoose.length == 1) {
                            const superVisor = data.supervisorchoose;
                            const supervisorCheck = superVisor.filter((item) => item !== e);
                            const ans = [...supervisorCheck];
                            const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                supervisorchoose: replaceName,
                            });
                        } else if (checkSame && data.supervisorchoose.length == 1) {
                            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            });
                        }
                    });

                //Updating The EmployeeName based onn the Employeename array length
                let DeleteemployeeName =
                    hierarchyDeleteEmployee.length > 0 &&
                    hierarchyDeleteEmployee.map((data) => {
                        //if the employeename array contains more than one element without the orginal releiveing name
                        if (data.employeename.length > 1) {
                            const superVisor = data.employeename;
                            const supervisorCheck = superVisor.filter((item) => item !== e);
                            const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                employeename: supervisorCheck,
                            });
                        } else {
                            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            });
                        }
                    });
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //get all employees list details
    const fetchEmployeeList = async (e) => {
        try {
            let res_employee = await axios.get(SERVICE.ALLUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let Designation = res_employee?.data?.allusers.find((item) => {
                return e === item.companyname;
            });

            let answer = res_employee?.data?.allusers.filter((data) => data.companyname !== e && Designation.designation === data.designation && (data.resonablestatus === "" || data.resonablestatus === undefined));
            setEmployeesList(
                answer.map((data) => ({
                    ...data,
                    label: data.companyname,
                    value: data.companyname,
                }))
            );
        } catch (err) { setIsBoarding(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [sourceDatas, setSourceDatas] = useState([]);
    const [checklistDatas, setChecklistDatas] = useState([]);
    const [thisPageDatas, setThisPageDatas] = useState([]);
    const [employeeToShow, setEmployeesToShow] = useState([]);

    const [excludedGroupDatas, setexcludedGroupDatas] = useState([]);
    const [overallGroupDatas, setOverallGroupDatas] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');


    const [manager, setManger] = useState(false);

    const fetchUnassignedCandidates = async () => {
        try {
            let res = await axios.post(
                `${SERVICE.MYCHECKLISTVIEW}`, {
                companyname: isUserRoleAccess?.companyname,
                role: isUserRoleAccess?.role,
                modulename: "Human Resources",
                submodule: "HR",
                mainpage: "Employee",
                subpage: "Employee Action Details",
                subsubpage: "Rejoined Employee List"
            },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                }
            );
            console.log(res?.data?.configuredUsers)
            setEmployees(res?.data?.configuredUsers);
            setThisPageDatas(res?.data?.toViewDatas);

            setIsBoarding(true);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchUnassignedCandidates();
    }, []);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Boardingupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    let addedby = empaddform?.addedby;

    const gridRef = useRef(null);
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Rejoined Employee List.png');
                });
            });
        }
    };

    //------------------------------------------------------

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const calculateExperience = (doj) => {
        const startDate = new Date(doj);
        const currentDate = new Date();
        let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += currentDate.getMonth();
        return Math.max(0, months);
    };

    const [fileFormat, setFormat] = useState("xl");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = async (csvData, fileName) => {
        if (!csvData || !csvData.length) {
            console.error("No data provided for export.");
            return;
        }

        if (!fileName) {
            console.error("No file name provided.");
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            // Define columns
            worksheet.columns = [
                { header: 'S.No', key: 'serial', width: 10 },

                { header: 'Empcode', key: 'empcode', width: 15 },
                { header: 'Name', key: 'companyname', width: 30 },
                { header: 'Department', key: 'department', width: 30 },
                { header: 'DOB', key: 'dob', width: 20 },
                { header: 'Personal Number', key: 'contactpersonal', width: 20 },

                { header: 'Doj', key: 'doj', width: 20 },
                { header: 'Experience', key: 'experience', width: 20 },
                { header: 'Reportint To', key: 'reportingto', width: 20 },



                { header: 'Image', key: 'image', width: 20 }
            ];

            worksheet.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Yellow background
                };
                cell.font = {
                    bold: true,
                    color: { argb: '000' } // Red text color
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Add rows and images
            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
                const row = worksheet.addRow({
                    serial: i + 1,
                    empcode: item.empcode || '',
                    companyname: item.companyname || '',
                    department: item.department || '',
                    dob: item.dob || '',
                    contactpersonal: item.contactpersonal || '',


                    doj: item.doj || '',
                    experience: item.experience || '',
                    reportingto: item.reportingto || '',

                });

                // Center align the text in each cell of the row
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };

                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };

                });


                if (item.profileimage) {
                    const base64Image = item.profileimage.split(',')[1];
                    const imageId = workbook.addImage({
                        base64: base64Image,
                        extension: 'png',
                    });

                    const rowIndex = row.number;

                    // Adjust row height to fit the image
                    worksheet.getRow(rowIndex).height = 80;

                    // Add image to the worksheet
                    worksheet.addImage(imageId, {
                        tl: { col: 9, row: rowIndex - 1 },
                        ext: { width: 100, height: 80 },
                    });

                    // Center align the image cell
                    worksheet.getCell(`H${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' };
                }
            }

            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, `${fileName}${fileExtension}`);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };


    const handleExportXL = (isfilter) => {

        const dataToExport = isfilter === "filtered" ? filteredData : items;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(dataToExport, 'Rejoined Employee List');
        setIsFilterOpen(false);
    };




    //  PDF
    // pdf.....
    const columns = [
        { title: "S.No", field: "serialNumber" },
        { title: "Empcode", field: "empcode" },
        { title: "Name", field: "companyname" },
        { title: "Department", field: "department" },
        { title: "Dob", field: "dob" },
        { title: "PersonalNo", field: "contactpersonal" },
        { title: "DOJ", field: "doj" },
        { title: "Experience", field: "experience" },
        { title: "Reportingto", field: "reportingto" },
        { title: "Image", field: "imageBase64" }
    ];

    const downloadPdf = async (isfilter) => {
        const doc = new jsPDF();
        const tableColumn = columns.map((col) => col.title);
        const tableRows = [];
        const imagesToLoad = [];

        let datatoPdf = isfilter === "filtered" ? filteredData : items;

        datatoPdf.forEach((item, index) => {
            const rowData = [
                index + 1,

                item.empcode || '',
                item.companyname || '',
                item.department || '',
                item.dob || '',
                item.contactpersonal || '',
                item.doj || '',
                item.experience || '',
                item.reportingto || '',
                // item.mode || '',
                // item.value || '',
                // item.endexp || '',
                // item.endexpdate || '',
                // item.endtar || '',
                // item.endtardate || '',
                '' // Placeholder for the image column
            ];

            tableRows.push(rowData);

            if (item.profileimage) {
                imagesToLoad.push({ index, imageBase64: item.profileimage });
            }
        });

        const loadImage = (imageBase64) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = imageBase64;
            });
        };

        const loadedImages = await Promise.all(imagesToLoad.map(item => loadImage(item.imageBase64).then(img => ({ ...item, img }))));

        // Calculate the required row height based on image height
        const rowHeight = 10; // Set desired row height

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            didDrawCell: (data) => {
                // Ensure that the cell belongs to the body section and it's the image column
                if (data.section === 'body' && data.column.index === columns.length - 1) {
                    const imageInfo = loadedImages.find(image => image.index === data.row.index);
                    if (imageInfo) {
                        const imageHeight = 10; // Desired image height
                        const imageWidth = 10; // Desired image width
                        const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
                        const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

                        doc.addImage(imageInfo.img, 'PNG', data.cell.x + xOffset, data.cell.y + yOffset, imageWidth, imageHeight);

                        // Adjust cell styles to increase height
                        data.cell.height = rowHeight; // Set custom height
                    }
                }
            },
            headStyles: {
                minCellHeight: 5, // Set minimum cell height for header cells
                fontSize: 4, // You can adjust the font size if needed
                cellPadding: { top: 2, right: 1, bottom: 2, left: 1 } // Adjust padding for header cells
            },
            bodyStyles: {
                fontSize: 4,
                minCellHeight: rowHeight, // Set minimum cell height for body cells
                cellPadding: { top: 4, right: 1, bottom: 0, left: 1 } // Adjust padding for body cells
            },
            columnStyles: {
                [tableColumn.length - 1]: { cellWidth: 12 } // Increase width of the image column
            },

        });

        doc.save("Rejoined Employee List.pdf");
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Rejoined Employee List",
        pageStyle: "print",
    });

    useEffect(() => {
        // fetchEmployee();
    }, []);


    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            dob: item?.dob ? moment(item.dob, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
            doj: item?.doj ? moment(item.doj, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
            experience: calculateExperience(item.doj)
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [employees]);

    //table sorting
    const [sorting, setSorting] = useState({ column: "", direction: "" });

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
        setSorting({ column, direction });
    };

    items.sort((a, b) => {
        if (sorting.direction === "asc") {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === "desc") {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return (
                <>
                    <Box sx={{ color: "#bbb6b6" }}>
                        <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
                            <ArrowDropUpOutlinedIcon />
                        </Grid>
                        <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
                            <ArrowDropDownOutlinedIcon />
                        </Grid>
                    </Box>
                </>
            );
        } else if (sorting.direction === "asc") {
            return (
                <>
                    <Box>
                        <Grid sx={{ height: "6px" }}>
                            <ArrowDropUpOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
                        </Grid>
                        <Grid sx={{ height: "6px" }}>
                            <ArrowDropDownOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
                        </Grid>
                    </Box>
                </>
            );
        } else {
            return (
                <>
                    <Box>
                        <Grid sx={{ height: "6px" }}>
                            <ArrowDropUpOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
                        </Grid>
                        <Grid sx={{ height: "6px" }}>
                            <ArrowDropDownOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
                        </Grid>
                    </Box>
                </>
            );
        }
    };

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
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(employees.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

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

    return (
        <Box>
            <NotificationContainer />
            {/* ****** Header Content ****** */}
            <Headtitle title={"REJOINED EMPLOYEE LIST"} />
            <Typography sx={userStyle.HeaderText}>Rejoined Employee List</Typography>
            <br />
            {isUserRoleCompare?.includes("lrejoinedemployeelist") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.SubHeaderText}>Rejoined Employeelist</Typography>
                            </Grid>
                        </Grid>
                        {!isBoarding ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <br />
                                <br />

                                <Grid container sx={{ justifyContent: "center" }}>
                                    <Grid>
                                        {isUserRoleCompare?.includes("csvrejoinedemployeelist") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("xl");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileExcel />
                                                    &ensp;Export to Excel&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("excelrejoinedemployeelist") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("csv");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileCsv />
                                                    &ensp;Export to CSV&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printrejoinedemployeelist") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfrejoinedemployeelist") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true);
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagerejoinedemployeelist") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        )}
                                    </Grid>
                                </Grid>
                                <br />
                                {/* added to the pagination grid */}
                                <Grid style={userStyle.dataTablestyle}>
                                    <Box>
                                        <label htmlFor="pageSizeSelect">Show entries:</label>
                                        <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>

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
                                {/* ****** Table Grid Container ****** */}
                                <Grid container>
                                    <Grid md={4} sm={2} xs={1}></Grid>
                                    <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                                </Grid>
                                <br />

                                {/* ****** Table start ****** */}
                                {/* ****** Table start ****** */}
                                <TableContainer component={Paper} ref={gridRef}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                                        <TableHead sx={{ fontWeight: "600" }}>
                                            <StyledTableRow>
                                                <StyledTableCell onClick={() => handleSorting("serialNumber")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>SNo</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("serialNumber")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("empcode")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Empcode</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("empcode")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("companyname")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Name</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("companyname")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("checklist")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Checklist</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("checklist")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("department")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Department</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("department")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("dob")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>DOB</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("dob")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("contactpersonal")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Personal Number</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("contactpersonal")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("doj")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>DOJ</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("doj")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("experience")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Experience</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("experience")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("reportingto")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Reporting To</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("reportingto")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting("profileimage")}>
                                                    <Box sx={userStyle.tableheadstyle}>
                                                        <Box>Profile</Box>
                                                        <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("profileimage")}</Box>
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">
                                            {filteredData?.length > 0 ? (
                                                filteredData?.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                        <StyledTableCell>
                                                            <ListItem
                                                                sx={{
                                                                    "&:hover": {
                                                                        cursor: "pointer",
                                                                        color: "blue",
                                                                        textDecoration: "underline",
                                                                    },
                                                                }}
                                                            >
                                                                <CopyToClipboard
                                                                    onCopy={() => {
                                                                        handleCopy("Copied Empcode!");
                                                                    }}
                                                                    options={{ message: "Copied Empcode!" }}
                                                                    text={row?.empcode}
                                                                >
                                                                    <ListItemText primary={row?.empcode} />
                                                                </CopyToClipboard>
                                                            </ListItem>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <ListItem
                                                                sx={{
                                                                    "&:hover": {
                                                                        cursor: "pointer",
                                                                        color: "blue",
                                                                        textDecoration: "underline",
                                                                    },
                                                                }}
                                                            >
                                                                <CopyToClipboard
                                                                    onCopy={() => {
                                                                        handleCopy("Copied Name!");
                                                                    }}
                                                                    options={{ message: "Copied Name!" }}
                                                                    text={row?.companyname}
                                                                >
                                                                    <ListItemText primary={row?.companyname} />
                                                                </CopyToClipboard>
                                                            </ListItem>
                                                        </StyledTableCell>
                                                        <StyledTableCell>

                                                            <div style={{
                                                                color: '#fff', border: '1px solid #1565c0', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                                                                cursor: 'pointer', backgroundColor: '#1565c0'
                                                            }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.backgroundColor = '#fff';
                                                                    e.target.style.color = '#1565c0';
                                                                }} // Change background color on hover
                                                                onMouseOut={(e) => {
                                                                    e.target.style.backgroundColor = '#1565c0';
                                                                    e.target.style.color = '#fff';
                                                                }}
                                                                onClick={() => {

                                                                    handleOpenTable(row._id)
                                                                }}
                                                            >
                                                                View
                                                            </div>

                                                        </StyledTableCell>
                                                        <StyledTableCell>{row.department}</StyledTableCell>
                                                        <StyledTableCell>{row.dob}</StyledTableCell>
                                                        <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                                                        <StyledTableCell>{row.doj}</StyledTableCell>
                                                        <StyledTableCell>{row.experience}</StyledTableCell>
                                                        <StyledTableCell>{row.reportingto}</StyledTableCell>
                                                        <StyledTableCell>{row?.profileimage ? <img src={row?.profileimage} alt="profile" style={{ height: "100px", width: "100px" }} /> : ""}</StyledTableCell>
                                                        <StyledTableCell component="th" scope="row" colSpan={1}>
                                                            <Grid sx={{ display: "flex" }}>
                                                                <Button
                                                                    sx={userStyle.buttonedit}
                                                                    onClick={(e) => {
                                                                        handleOpenManageColumns(e, row._id);
                                                                        setUserDetails(row);
                                                                    }}
                                                                >
                                                                    <MoreVertIcon />
                                                                </Button>

                                                                <Popover id={id} open={isManageColumnsOpen} anchorEl={anchorEl} onClose={handleCloseManageColumns}>
                                                                    <Box>
                                                                        <List component="nav" aria-label="My List">
                                                                            <ListItem button>
                                                                                <ListItemText
                                                                                    onClick={(e) => {
                                                                                        getCode(getId, "Releave Employee", row);

                                                                                    }}
                                                                                    primary="Releave Employee"
                                                                                />
                                                                            </ListItem>
                                                                            <ListItem button>
                                                                                <ListItemText
                                                                                    onClick={(e) => {
                                                                                        getCode(getId, "Absconded", row);
                                                                                    }}
                                                                                    primary="Absconded"
                                                                                />
                                                                            </ListItem>
                                                                            <ListItem button>
                                                                                <ListItemText
                                                                                    onClick={(e) => {
                                                                                        getCode(getId, "Hold", row);
                                                                                    }}
                                                                                    primary="Hold"
                                                                                />
                                                                            </ListItem>
                                                                            <ListItem button>
                                                                                <ListItemText
                                                                                    onClick={() => {
                                                                                        getCode(getId, "Terminate", row);
                                                                                    }}
                                                                                    primary="Terminate"
                                                                                />
                                                                            </ListItem>
                                                                        </List>
                                                                    </Box>
                                                                </Popover>
                                                            </Grid>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            ) : (
                                                <StyledTableRow>
                                                    {" "}
                                                    <StyledTableCell colSpan={7} align="center">
                                                        No Data Available
                                                    </StyledTableCell>{" "}
                                                </StyledTableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
                        )}
                    </Box>
                </>
            )}
            <br />
            {/* ****** Table End ****** */}

            <Box>
                <Dialog
                    open={isErrorOpen}
                    // onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>

                        <Typography variant="h6"></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error">
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* this is info view details */}

            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Boarding Info</Typography>
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
                            <br />
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

            {/* this is the alert for the popover ation button in Reason Employee */}
            <Dialog open={openviewReleave} onClose={handleClickOpenviewReleave} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl">
                <Box sx={{ padding: "20px 50px" }}>
                    <>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <Typography sx={userStyle.HeaderText}> Rejoined employee list</Typography>
                            <Tooltip title="Delete Saved Check List For This Person">

                                <LoadingButton
                                    variant="contained"
                                    color="error"
                                    sx={{ paddingTop: '0 !important', paddingBottom: '0 !important', height: '30px' }}
                                    startIcon={<DeleteIcon />}
                                    onClick={() => { handleClickOpen(); }}
                                    loading={deletebtn}
                                    disabled={deletebtnDisable}
                                >
                                    Delete
                                </LoadingButton>


                            </Tooltip>


                        </div>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <b>Reason Apply</b>
                                    </Typography>
                                    <Typography>{statusemployee}</Typography>
                                </FormControl>
                            </Grid>
                            {hierarchyDeleteData.length > 0 ? (
                                <>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.SubHeaderText}>
                                                <b>Replace</b>
                                                {/* <b style={{ color: "red" }}>*</b>{" "} */}
                                            </Typography>
                                            <Selects
                                                options={employeesList}
                                                styles={colourStyles}
                                                value={{ label: replaceName, value: replaceName }}
                                                onChange={(e) => {
                                                    setReplaceName(e.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : (
                                ""
                            )}
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <b>Employee code</b>
                                    </Typography>
                                    <Typography>{empaddform.empcode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}></Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <b>Employee Name</b>
                                    </Typography>
                                    <Typography>{empaddform.companyname}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={1} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">
                                        <b>Date</b>{" "}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        // value={formattedDate}
                                        value={reason.date}
                                        onChange={(e) => {
                                            setReason({ ...reason, date: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">
                                        <b>Reason</b>{" "}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={5}
                                        value={reason.reasonname}
                                        onChange={(e) => {
                                            setReason({ ...reason, reasonname: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Box sx={{ padding: "20px 10px", width: '100%' }}>
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ ...userStyle.SubHeaderText, fontWeight: '600' }} >
                                        My Check List
                                    </Typography>

                                    <div>
                                        <Tooltip title="Update All the Values simultaneously">
                                            <Button onClick={() => { sendBulkUpdateRequest(); }} variant="contained" color="success">
                                                Bulk Update
                                            </Button>
                                        </Tooltip>
                                    </div>


                                </div>


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

                                                                                const value = e.target.value;
                                                                                if (value === '' || /^\d*$/.test(value)) {
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


                                                                                </Box>
                                                                                {row.files && <Grid container spacing={2}>
                                                                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                                                                        <Typography>{row.files.name}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                                                                        <VisibilityOutlinedIcon
                                                                                            style={{
                                                                                                fontsize: "large",
                                                                                                color: "#357AE8",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() => renderFilePreviewEdit(row.files)}
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
                                                    <TableCell>{row?.employee && row?.employee?.map((data, index) => (
                                                        <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                                                    ))}</TableCell>
                                                    <TableCell>{row.completedby}</TableCell>
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

                            </>
                        </Box>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={handleCheckListSubmit}>
                                    Save
                                </Button>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={handleClearreason}>
                                    {" "}
                                    Clear
                                </Button>
                            </Grid>
                            <Grid item md={0.2} xs={12} sm={12}></Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={handleCloseviewReleave}>
                                    {" "}
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Empcode</StyledTableCell>
                            <StyledTableCell>Name </StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell>Dob</StyledTableCell>
                            <StyledTableCell>Personal Number</StyledTableCell>
                            <StyledTableCell>Doj</StyledTableCell>
                            <StyledTableCell>Experience</StyledTableCell>
                            <StyledTableCell>Reporting To</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.empcode} </StyledTableCell>
                                    <StyledTableCell> {row.companyname}</StyledTableCell>
                                    <StyledTableCell>{row.department}</StyledTableCell>
                                    <StyledTableCell>{row.dob ? moment(row.dob, "YYYY-MM-DD").format("DD-MM-YYYY") : ""}</StyledTableCell>
                                    <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                                    <StyledTableCell>{row.doj ? moment(row.doj, "YYYY-MM-DD").format("DD-MM-YYYY") : ""}</StyledTableCell>
                                    <StyledTableCell>{row.experience}</StyledTableCell>
                                    <StyledTableCell>{row.reportingto}</StyledTableCell>
                                    <StyledTableCell>{row?.profileimage ? <img src={row?.profileimage} style={{ height: "100px", width: "100px" }} /> : ""}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormat === "xl" ? (
                        <>
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

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
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

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
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
                            downloadPdf("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            <CheckListTable isTable={isTable} handleCloseTable={handleCloseTable} userId={selectedUserId} from={"rejoined"} />

            <Loader loading={loading} message={loadingMessage} />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteChecklist}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
        </Box>

        //    another table
    );
}

export default RejoinEmployeeList;