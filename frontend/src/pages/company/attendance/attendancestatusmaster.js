import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import StyledDataGrid from "../../../components/TableStyle";
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Selects from "react-select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function Attedancestatusmaster() {

    const [attendanceStatus, setAttendanceStatus] = useState({
        clockinstatus: "Please Select Clock In Status",
        clockoutstatus: "Please Select Clock Out Status",
        defalutclockinstatus: "",
        defaultclockoutstatus: "",
        name: "Please Select Name",
        clockincount: "",
        clockoutcount: "",
        clockincountstart: "",
        clockoutcountstart: "",
        clockincountend: "",
        clockoutcountend: "",
    });
    const [isBtn, setIsBtn] = useState(false)
    const [attendanceEdit, setAttendanceEdit] = useState({
        clockinstatus: "Please Select Clock In Status",
        clockoutstatus: "Please Select Clock Out Status",
        defalutclockinstatus: "",
        defaultclockoutstatus: "",
        name: "Please Select Name",
        clockincount: "",
        clockoutcount: "",
        clockincountstart: "",
        clockoutcountstart: "",
        clockincountend: "",
        clockoutcountend: "",
    })

    const [attModearr, setAttModearr] = useState([]);
    const [isClearOpenalert, setClearOpenalert] = useState(false);
    const [isAddOpenalert, setAddOpenalert] = useState(false);
    const [isDeletealert, setDeletealert] = useState(false);
    const [isBulkDelOpenalert, setBulkDelOpenalert] = useState(false);
    const [isUpdateOpenalert, setUpdateOpenalert] = useState(false);
    const [leavetypeData, setLeaveTypeData] = useState([]);
    const [leavetypeDataOut, setLeaveTypeDataOut] = useState([]);

    const [sources, setSources] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [sourceCheck, setSourcecheck] = useState(false);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);


    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
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
        clockinstatus: true,
        clockoutstatus: true,
        name: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    const [deleteSource, setDeleteSource] = useState("");


    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.sattendancestatus);
            handleClickOpen();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async (e) => {

        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${e}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchAttedanceStatus();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
            }
            setDeletealert(true);
            setTimeout(() => {
                setDeletealert(false)
            }, 1000)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const delSourcecheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchAttedanceStatus();
            setBulkDelOpenalert(true);
            setTimeout(() => {
                setBulkDelOpenalert(false)
            }, 1000)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //add function 
    const sendRequest = async () => {
        setIsBtn(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                clockincount: String(attendanceStatus.clockincount),
                clockincountstatus: Boolean(attendanceStatus.clockinstatus === "Late - ClockIn" ? true : false),
                clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === "Early - ClockOut" ? true : false),
                clockoutcount: String(attendanceStatus.clockoutcount),
                clockinstatus: String(attendanceStatus.clockinstatus),
                clockoutstatus: String(attendanceStatus.clockoutstatus),
                defalutclockinstatus: String(attendanceStatus.clockinstatus),
                defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
                name: String(attendanceStatus.name),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchAttedanceStatus();
            setAttendanceStatus({
                ...attendanceStatus,
                name: "Please Select Name",
            })
            setAddOpenalert(true);
            setTimeout(() => {
                setAddOpenalert(false)
            }, 1000)
            setIsBtn(false)
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //Late Clockin request
    const sendClkLateRequest = async (resultArray) => {
        setIsBtn(true)
        try {
            resultArray.forEach((data, index) => {
                const isNameMatch = sources.some(item =>
                    item.name.toLowerCase() === (attendanceStatus.name).toLowerCase() &&
                    item.clockinstatus.toLowerCase() === (data === 0 ? "" : data + attendanceStatus.clockinstatus).toLowerCase() &&
                    item.clockoutstatus.toLowerCase() === (attendanceStatus.clockoutstatus).toLowerCase()
                );
                if (isNameMatch) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Name already exists!"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();
                } else {
                    axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        clockincount: String(data),
                        clockoutcount: String(attendanceStatus.clockoutcount),
                        clockinstatus: String(data + attendanceStatus.clockinstatus),
                        clockoutstatus: String(attendanceStatus.clockoutstatus),
                        defalutclockinstatus: String(attendanceStatus.clockinstatus),
                        defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
                        name: String(attendanceStatus.name),
                        clockincountstatus: Boolean(attendanceStatus.clockinstatus === "Late - ClockIn" ? true : false),
                        clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === "Early - ClockOut" ? true : false),
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    })

                    fetchAttedanceStatus();
                }
            })


            setAttendanceStatus({
                ...attendanceStatus,
                name: "Please Select Name",
            })
            setAddOpenalert(true);
            setTimeout(() => {
                setAddOpenalert(false)
            }, 1000)
            setIsBtn(false)
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }
    const sendClkLateCokEarlyRequest = async (cinresultArray, coutresultArray) => {
        setIsBtn(true);
        try {
            cinresultArray.forEach((data, index) => {
                coutresultArray.forEach((cata, cindex) => {
                    const isNameMatch = sources.some(item =>
                        item.name.toLowerCase() === (attendanceStatus.name).toLowerCase() &&
                        item.clockinstatus.toLowerCase() === (data === 0 ? "" : data + attendanceStatus.clockinstatus).toLowerCase() &&
                        item.clockoutstatus.toLowerCase() === (cata === 0 ? "" : cata + attendanceStatus.clockoutstatus).toLowerCase()
                    );
                    if (isNameMatch) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon
                                    sx={{ fontSize: "100px", color: "orange" }}
                                />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                    {"Name already exists!"}
                                </p>
                            </>
                        );
                        handleClickOpenerr();
                    } else {
                        axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            clockincount: String(data),
                            clockoutcount: String(cata),
                            clockinstatus: String(data + attendanceStatus.clockinstatus),
                            clockoutstatus: String(cata + attendanceStatus.clockoutstatus),
                            defalutclockinstatus: String(attendanceStatus.clockinstatus),
                            defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
                            name: String(attendanceStatus.name),
                            clockincountstatus: Boolean(attendanceStatus.clockinstatus === "Late - ClockIn" ? true : false),
                            clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === "Early - ClockOut" ? true : false),
                            addedby: [
                                {
                                    name: String(isUserRoleAccess.companyname),
                                    date: String(new Date()),
                                },
                            ],
                        })

                        fetchAttedanceStatus();
                    }
                })

            })


            setAttendanceStatus({
                ...attendanceStatus,
                name: "Please Select Name",
            })
            setAddOpenalert(true);
            setTimeout(() => {
                setAddOpenalert(false)
            }, 1000);
            setIsBtn(false);
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }
    //early Clockout request
    const sendCokEarlyRequest = async (resultArray) => {
        setIsBtn(true)
        try {
            resultArray.forEach((data, index) => {
                const isNameMatch = sources.some(item =>
                    item.name.toLowerCase() === (attendanceStatus.name).toLowerCase() &&
                    item.clockinstatus.toLowerCase() === (attendanceStatus.clockinstatus).toLowerCase() &&
                    item.clockoutstatus.toLowerCase() === (data === 0 ? "" : data + attendanceStatus.clockoutstatus).toLowerCase()
                );
                if (isNameMatch) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Name already exists!"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();
                } else {
                    axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        clockincount: String(attendanceStatus.clockincount),
                        clockoutcount: String(data),
                        clockinstatus: String(attendanceStatus.clockinstatus),
                        clockoutstatus: String(data + attendanceStatus.clockoutstatus),
                        name: String(attendanceStatus.name),
                        defalutclockinstatus: String(attendanceStatus.clockinstatus),
                        defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
                        clockincountstatus: Boolean(attendanceStatus.clockinstatus === "Late - ClockIn" ? true : false),
                        clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === "Early - ClockOut" ? true : false),
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    })

                    fetchAttedanceStatus();
                }
            })


            setAttendanceStatus({
                ...attendanceStatus,
                name: "Please Select Name",
            })
            setAddOpenalert(true);
            setTimeout(() => {
                setAddOpenalert(false)
            }, 1000)
            setIsBtn(false);
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isNameMatch = sources.some(item =>
            item.name.toLowerCase() === (attendanceStatus.name).toLowerCase() &&
            item.clockinstatus.toLowerCase() === (attendanceStatus.clockincount + attendanceStatus.clockinstatus).toLowerCase() &&
            item.clockoutstatus.toLowerCase() === (attendanceStatus.clockoutcount + attendanceStatus.clockoutstatus).toLowerCase()
        );


        if (attendanceStatus.clockinstatus === "Please Select Clock In Status") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Clock In Status"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (attendanceStatus.clockoutstatus === "Please Select Clock Out Status") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Clock Out Status"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (attendanceStatus.name === "Please Select Name") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (attendanceStatus.clockinstatus === "Late - ClockIn" && attendanceStatus.clockoutstatus != "Early - ClockOut") {
            if (attendanceStatus.clockincountstart === "" && attendanceStatus.clockincountend === "") {
                sendRequest();
            } else if (!(Number(attendanceStatus.clockincountstart) < Number(attendanceStatus.clockincountend))) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"End Count Must Greater than Start Count!!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else {
                const startValue = parseInt(attendanceStatus.clockincountstart, 10);
                const endValue = parseInt(attendanceStatus.clockincountend, 10);

                if (!isNaN(startValue) && !isNaN(endValue)) {
                    // Ensure that startValue and endValue are valid numbers
                    let resultArray = [];
                    for (let i = startValue; i <= endValue; i++) {
                        resultArray.push(i);
                    }

                    await sendClkLateRequest(resultArray);

                } else {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Invalid start or end value!"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();
                }
            }
        } else if (attendanceStatus.clockinstatus != "Late - ClockIn" && attendanceStatus.clockoutstatus === "Early - ClockOut") {
            if (attendanceStatus.clockoutcountstart === "" && attendanceStatus.clockoutcountend === "") {
                sendRequest();
            } else if (!(Number(attendanceStatus.clockoutcountstart) < Number(attendanceStatus.clockoutcountend))) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"End Count Must Greater than Start Count!!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                const startValue = parseInt(attendanceStatus.clockoutcountstart, 10);
                const endValue = parseInt(attendanceStatus.clockoutcountend, 10);

                if (!isNaN(startValue) && !isNaN(endValue)) {
                    // Ensure that startValue and endValue are valid numbers
                    let resultArray = [];
                    for (let i = startValue; i <= endValue; i++) {
                        resultArray.push(i);
                    }

                    await sendCokEarlyRequest(resultArray);

                } else {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Invalid start or end value!"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();
                }
            }
        } else if (attendanceStatus.clockinstatus === "Late - ClockIn" && attendanceStatus.clockoutstatus === "Early - ClockOut") {
            if (attendanceStatus.clockoutcountstart === "" && attendanceStatus.clockoutcountend === "" && attendanceStatus.clockoutcountstart === "" && attendanceStatus.clockoutcountend === "") {
                sendRequest();
            } else {
                const startValue = parseInt(attendanceStatus.clockincountstart, 10);
                const endValue = parseInt(attendanceStatus.clockincountend, 10);
                const co1startValue = parseInt(attendanceStatus.clockoutcountstart, 10);
                const co2endValue = parseInt(attendanceStatus.clockoutcountend, 10);
                let cinresultArray = [];
                let coutresultArray = [];
                if (isNaN(startValue) && isNaN(endValue)) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Clock In Invalid start or end value!"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();
                } else if (isNaN(co1startValue) && isNaN(co2endValue)) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Clock Out Invalid start or end value!"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();
                } else {
                    for (let i = startValue; i <= endValue; i++) {
                        cinresultArray.push(i);
                    }
                    for (let i = co1startValue; i <= co2endValue; i++) {
                        coutresultArray.push(i);
                    }
                    await sendClkLateCokEarlyRequest(cinresultArray, coutresultArray);
                }
            }
        }
        else {
            sendRequest();
        }
    }


    const handleClear = (e) => {
        e.preventDefault();
        setAttendanceStatus({
            clockinstatus: "Please Select Clock In Status",
            clockoutstatus: "Please Select Clock Out Status",
            defalutclockinstatus: "",
            defaultclockoutstatus: "",
            name: "Please Select Name",
            clockincount: "",
            clockoutcount: "",
            clockincountstart: "",
            clockoutcountstart: "",
            clockincountend: "",
            clockoutcountend: "",
        })
        setClearOpenalert(true);
        setTimeout(() => {
            setClearOpenalert(false)
        }, 1000)
    }

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAttendanceEdit(res?.data?.sattendancestatus);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAttendanceEdit(res?.data?.sattendancestatus);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    //Project updateby edit page...
    let updateby = attendanceEdit?.updatedby;
    let addedby = attendanceEdit?.addedby;


    let subprojectsid = attendanceEdit?._id;

    //get all Sub vendormasters.
    const fetchAttedanceStatus = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setSources(res_vendor?.data?.attendancestatus);
        } catch (err) {setSourcecheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const fetchLeaveType = async () => {
        const rearr = [];
        const perarr = [];
        try {
            let res_type = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let leavestatusarr = ["Applied", "Approved", "Rejected"];
            let leavestatushp = ["DHA", "DHB", "HA", "HB", "DL"];
            res_type?.data?.leavetype.forEach((data, index) => {
                let resdata = leavestatusarr.map((leavestatus, i) => {
                    rearr.push(data.code + " " + leavestatus)
                })
            })
            res_type?.data?.leavetype.forEach((data, index) => {
                let resdata = leavestatusarr.map((leavestatus, i) => {
                    let resleave = leavestatushp.map((red, rindex)=>{
                        perarr.push(`${red} - ${data.code} ${leavestatus}`)
                    })
                    
                })
            })
            let sumresclockin = [...clockInOpt, ...rearr, ...perarr]
            let finalresclockin = sumresclockin.map((t) => ({
                ...t,
                label: t,
                value: t
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            let sumresclockout = [...clockOutOpt, ...rearr, ...perarr]
            let finalresclockout = sumresclockout.map((t) => ({
                ...t,
                label: t,
                value: t
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setLeaveTypeData(finalresclockin);
            setLeaveTypeDataOut(finalresclockout);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchAttedanceStatus();
        fetchAttMode();
        fetchLeaveType();
    }, [])


    const handleClockStart = (e) => {
        const regex = /^\d*\.?\d*$/;
        let num = e.target.value.slice(0, 2);
        setAttendanceStatus({ ...attendanceStatus, clockincountstart: num })
    }

    const handleClockEnd = (e) => {
        const regex = /^\d*\.?\d*$/;
        let num = e.target.value.slice(0, 2);
        setAttendanceStatus({ ...attendanceStatus, clockincountend: num })
    }
    const handleCoutStart = (e) => {
        const regex = /^\d*\.?\d*$/;
        let num = e.target.value.slice(0, 2);
        setAttendanceStatus({ ...attendanceStatus, clockoutcountstart: num })
    }
    const handleCoutEnd = (e) => {
        const regex = /^\d*\.?\d*$/;
        let num = e.target.value.slice(0, 2);
        setAttendanceStatus({ ...attendanceStatus, clockoutcountend: num })
    }
    const handleClockEditStart = (e) => {
        const regex = /^\d*\.?\d*$/;
        let num = e.target.value.slice(0, 2);
        setAttendanceEdit({ ...attendanceEdit, clockincount: num })
    }
    const handleClockEditEnd = (e) => {
        const regex = /^\d*\.?\d*$/;
        let num = e.target.value.slice(0, 2);
        setAttendanceEdit({ ...attendanceEdit, clockoutcount: num })
    }
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = sources?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [sources])

    const fetchAttMode = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let modeall = [
                ...res_freq?.data?.allattmodestatus.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setAttModearr(modeall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
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

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "clockinstatus", headerName: "Clock In Status", flex: 0, width: 250, hide: !columnVisibility.clockinstatus, headerClassName: "bold-header" },
        { field: "clockoutstatus", headerName: "Clock Out Status", flex: 0, width: 250, hide: !columnVisibility.clockoutstatus, headerClassName: "bold-header" },
        { field: "name", headerName: "Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },

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
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("dattendancestatusmaster") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vattendancestatusmaster") && (
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
                    {isUserRoleCompare?.includes("iattendancestatusmaster") && (
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
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            clockinstatus: item.clockinstatus,
            clockoutstatus: item.clockoutstatus
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

    const clockInOpt = ["Early - ClockIn",
        "On - Present",
        "BeforeWeekOffAbsent",
        "AfterWeekOffAbsent",
        "PERAPPR",
        "PERAPPL",
        "PERREJ",
        "COMP - PERAPPR",
        "COMP - PERAPPL",
        "HB Applied",
        "HB Approved",
        "HB Rejected",
        "HA Applied",
        "HA Approved",
        "HA Rejected",
        "DL Applied",
        "DL Approved",
        "DL Rejected",
        "DHB Applied",
        "DHB Approved",
        "DHB Rejected",
        "DHA Applied",
        "DHA Approved",
        "DHA Rejected",
        "HBLOP", "FLOP", "Grace - ClockIn",
        "Late - ClockIn", "Present", "Absent", "Week Off", "Mis - ClockIn", "Holiday", "Leave", "BeforeWeekOffLeave", "AfterWeekOffLeave", "L.W.P Approved", "L.W.P Applied", "L.W.P Rejected"]

    const clockOutOpt = ["Early - ClockOut", "Over - ClockOut",
        "PERAPPR",
        "PERAPPL",
        "PERREJ",
        "COMP - PERAPPR",
        "COMP - PERAPPL",
        "HB Applied",
        "HB Approved",
        "HB Rejected",
        "HA Applied",
        "HA Approved",
        "HA Rejected",
        "DL Applied",
        "DL Approved",
        "DL Rejected",
        "DHB Applied",
        "DHB Approved",
        "DHB Rejected",
        "DHA Applied",
        "DHA Approved",
        "DHA Rejected",
        "BeforeWeekOffAbsent", "AfterWeekOffAbsent", "HALOP", "On - ClockOut",
        "Auto Mis - ClockOut", "Pending", "Present", "Absent",
        "Week Off", "Mis - ClockOut", "Holiday", "Leave", "FLOP", "BeforeWeekOffLeave", "AfterWeekOffLeave", "L.W.P Approved", "L.W.P Applied", "L.W.P Rejected"]

    // Excel
    const fileName = "Attendance Status Master";
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
                    "Clock In Status": t.clockinstatus,
                    "Clock Out Status": t.clockoutstatus,
                    "Name": t.name,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                sources.map((t, index) => ({
                    "SNo": index + 1,
                    "Clock In Status": t.clockinstatus,
                    "Clock Out Status": t.clockoutstatus,
                    "Name": t.name,
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
        documentTitle: 'Attendance Status Master',
        pageStyle: 'print'
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Clock In Status", field: "clockinstatus" },
        { title: "Clock Out Status", field: "clockoutstatus" },
        { title: "Name", field: "name" },
    ]

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            sources.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save('Attendance Status Master.pdf')
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Attendance Status Master.png');
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={'Attendance Status Master'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Attendance Status Master</Typography>
            {isUserRoleCompare?.includes("aattendancestatusmaster")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Attendance Status Master</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Typography>Clock In Status<b style={{ color: "red" }}>*</b></Typography>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                styles={colourStyles}
                                                options={leavetypeData}
                                                value={{ label: attendanceStatus.clockinstatus, value: attendanceStatus.clockinstatus }}
                                                onChange={(e) => {
                                                    setAttendanceStatus({
                                                        ...attendanceStatus,
                                                        clockinstatus: e.value,
                                                        clockincount: "",
                                                        clockincountstart: "",
                                                        clockincountend: "",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {attendanceStatus.clockinstatus === "Late - ClockIn" &&
                                        <>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Typography>Clock In Status Start Count</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        sx={userStyle.input}
                                                        placeholder="Please Enter Count"
                                                        value={attendanceStatus.clockincountstart}
                                                        onChange={(e) => {
                                                            handleClockStart(e);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Typography>Clock In Status End Count</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        sx={userStyle.input}
                                                        placeholder="Please Enter Count"
                                                        value={attendanceStatus.clockincountend}
                                                        onChange={(e) => {
                                                            handleClockEnd(e);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    }
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Typography>Clock Out Status<b style={{ color: "red" }}>*</b></Typography>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                styles={colourStyles}
                                                options={leavetypeDataOut}
                                                value={{ label: attendanceStatus.clockoutstatus, value: attendanceStatus.clockoutstatus }}
                                                onChange={(e) => {
                                                    setAttendanceStatus({
                                                        ...attendanceStatus,
                                                        clockoutstatus: e.value,
                                                        clockoutcount: "",
                                                        clockoutcountstart: "",
                                                        clockoutcountend: "",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {attendanceStatus.clockoutstatus === "Early - ClockOut" &&
                                        <>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Typography>Clock Out Status Start Count</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        sx={userStyle.input}
                                                        placeholder="Please Enter Count"
                                                        value={attendanceStatus.clockoutcountstart}
                                                        onChange={(e) => {
                                                            handleCoutStart(e);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Typography>Clock Out Status End Count</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        sx={userStyle.input}
                                                        placeholder="Please Enter Count"
                                                        value={attendanceStatus.clockoutcountend}
                                                        onChange={(e) => {
                                                            handleCoutEnd(e);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>

                                    }
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={attModearr}
                                                styles={colourStyles}
                                                placeholder={"Please Select Name"}
                                                value={{ label: attendanceStatus.name, value: attendanceStatus.name }}
                                                onChange={(e) => {
                                                    setAttendanceStatus({ ...attendanceStatus, name: e.value });
                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <br />
                                        <br />
                                        <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                            <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit} disabled={isBtn}>
                                                SAVE
                                            </Button>

                                            <Button sx={userStyle.btncancel}
                                                onClick={handleClear}
                                            >
                                                {" "}
                                                CLEAR
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    </>
                )}
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lattendancestatusmaster") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Attendance Status Master List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={(sources?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelattendancestatusmaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)

                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvattendancestatusmaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)

                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printattendancestatusmaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfattendancestatusmaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageattendancestatusmaster") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdattendancestatusmaster") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}


                        <br /><br />
                        {!sourceCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                            :
                            <>
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
                                        Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>}
                    </Box>
                </>
            )
            }
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

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delSource(Sourcesid)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>


                {/* this is info view details */}

                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Attendance Status Master Info</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br /><br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SNo</TableCell>
                                <TableCell>Clock In Status</TableCell>
                                <TableCell>Clock Out Status</TableCell>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.clockinstatus}</TableCell>
                                        <TableCell>{row.clockoutstatus}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                    </TableRow>
                                )))}
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
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box sx={{ width: "450px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Attendance Status Master View</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Clock In Status</Typography>
                                    <Typography>{attendanceEdit.clockinstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Clock Out Status</Typography>
                                    <Typography>{attendanceEdit.clockoutstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{attendanceEdit.name}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delSourcecheckbox(e)}
                        > OK </Button>
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
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Clear DIALOG */}
            <Dialog open={isClearOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Cleared Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* Add DIALOG */}
            <Dialog open={isAddOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Added Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* Delete DIALOG */}
            <Dialog open={isDeletealert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* BulkDelete DIALOG */}
            <Dialog open={isBulkDelOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* BulkDelete DIALOG */}
            <Dialog open={isUpdateOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Updated Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>



            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}


export default Attedancestatusmaster;