import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody,  Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { MultiSelect } from "react-multi-select-component";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import ExportData from "../../../components/ExportData";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";

function WeekOffPresent() {


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [weekoffpresent, setWeekoffpresent] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Employee",
        shiftstartday: "Please Select Shift Start",
        shiftendday: "Please Select Shift End",
        calstartday: "Please Select Calculation Start",
        calendday: "Please Select Calculation End",
        weekoffpresentday: "Please Select Weekoff Present Day",
        shiftstatus: "Please Select Shift Status",
        filtertype: "Please Select Filter Type"
    });

    const [fileFormat, setFormat] = useState("");

    const [weekoffpresentEdit, setWeekoffpresentEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Employee",
        shiftstartday: '',
        shiftendday: '',
        shiftdaytotal: '',
        calstartday: "Please Select Calculation Start",
        calendday: "Please Select Calculation End",
        weekoffpresentday: "Please Select Weekoff Present Day",
        shiftstatus: "Please Select Shift Status",
        filtertype: "Please Select Filter Type"
    });
    const [isBtn, setIsBtn] = useState(false);
    const [weekoffpresents, setWeekoffpresents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, allTeam } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [weekoffpresentCheck, setWeekoffpresentcheck] = useState(false);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");

    let exportColumnNames = ["Shift Status", "Company",
        "Type", "Branch", "Unit", "Team", "Employee", "Shift Day",
        "Calculation Day", "Weekoff Present Day"];
    let exportRowValues = ["shiftstatus", "company",
        "filtertype", "branch", "unit", "team",
        "employeename", "shiftstartday", "calstartday", "weekoffpresentday"];

    const shiftstatusDrop = [
        { label: 'Day Shift', value: "Day Shift" },
        { label: "Night Shift", value: "Night Shift" },

    ];
    const shiftstartDrop = [
        { label: 'Sunday', value: "Sunday" },
        { label: "Monday", value: "Monday" },
        { label: "Tuesday", value: "Tuesday" },
        { label: "Wednesday", value: "Wednesday" },
        { label: "Thursday", value: "Thursday" },
        { label: "Friday", value: "Friday" },
        { label: "Saturday", value: "Saturday" },
    ];

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const calculateShiftDayTotal = (startDay, endDay) => {
        if (!startDay || !endDay) return '';

        const startIndex = weekDays.indexOf(startDay);
        const endIndex = weekDays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) return '';

        if (endIndex >= startIndex) {
            return endIndex - startIndex + 1; // +1 to include the start day
        } else {
            return (7 - startIndex) + endIndex + 1; // +1 to include the start day
        }
    };

    const handleStartDayChange = (e) => {
        const newShiftstartday = e.value;
        const totalDays = calculateShiftDayTotal(newShiftstartday, weekoffpresent.shiftendday);
        setWeekoffpresent({
            ...weekoffpresent,
            shiftstartday: newShiftstartday,
            shiftdaytotal: totalDays,
        });
    };

    const handleEndDayChange = (e) => {
        const newShiftendday = e.value;
        const totalDays = calculateShiftDayTotal(weekoffpresent.shiftstartday, newShiftendday);
        setWeekoffpresent({
            ...weekoffpresent,
            shiftendday: newShiftendday,
            shiftdaytotal: totalDays
        });
    };

    const calculateShiftDayTotalTwo = (startDay, endDay) => {
        if (!startDay || !endDay) return '';

        const startIndex = weekDays.indexOf(startDay);
        const endIndex = weekDays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) return '';

        if (endIndex >= startIndex) {
            return endIndex - startIndex + 1; // +1 to include the start day
        } else {
            return (7 - startIndex) + endIndex + 1; // +1 to include the start day
        }
    };

    const handleStartDayChangetwo = (e) => {
        const newShiftstartday = e.value;
        const totalDays = calculateShiftDayTotalTwo(newShiftstartday, weekoffpresent.calendday);
        setWeekoffpresent({
            ...weekoffpresent,
            calstartday: newShiftstartday,
            caldaytotal: totalDays
        });
    };
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleEndDayChangetwo = (e) => {
        const newShiftendday = e.value;
        const totalDays = calculateShiftDayTotalTwo(weekoffpresent.calstartday, newShiftendday);
        setWeekoffpresent({
            ...weekoffpresent,
            calendday: newShiftendday,
            caldaytotal: totalDays
        });
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Weekoff Controlpanel.png");
                });
            });
        }
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
        setSelectedRows([]);
        setSelectAllChecked(false);
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
        shiftstatus: true,
        company: true,
        filtertype: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        shiftstartday: true,
        calstartday: true,
        weekoffpresentday: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteweekoffpresent, setDeleteWeekoffpresent] = useState("");

    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteWeekoffpresent(res?.data?.sweekoffpresent);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let Weekoffsid = deleteweekoffpresent?._id;
    const delWeekoffpresent = async (e) => {
        try {
            if (Weekoffsid) {
                await axios.delete(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchWeekoffpresent();
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

    const delWeekoffcheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${item}`, {
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

            await fetchWeekoffpresent();
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

    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);

    //branchto multiselect dropdown changes
    const handleBranchChange = (options) => {
        setSelectedBranch(options);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
    };

    const customValueRendererBranch = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    // unitto multiselect dropdown changes
    const handleUnitChange = (options) => {
        setSelectedUnit(options);
        setSelectedTeam([]);
        setSelectedEmp([]);
    };
    const customValueRendererUnit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //Teamto multiselect dropdown changes
    const handleTeamChange = (options) => {
        setSelectedTeam(options);
        setSelectedEmp([]);
    };
    const customValueRendererTeam = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    // Employee    
    const handleEmployeeChange = (options) => {
        setSelectedEmp(options);
    };
    const customValueRendererEmp = (valueCate, _employees) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    //add function
    const sendRequest = async () => {
        setIsBtn(true)
        let branchnames = selectedBranch.map((item) => item.value);
        let unitnames = selectedUnit.map((item) => item.value);
        let teamnames = selectedTeam.map((item) => item.value);
        let empnames = selectedEmp.map((item) => item.value);

        try {
            await axios.post(SERVICE.WEEKOFFPRESENT_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(weekoffpresent.company),
                filtertype: String(weekoffpresent.filtertype),
                branch: branchnames,
                unit: unitnames,
                team: teamnames,
                employee: empnames,
                shiftstartday: String(weekoffpresent.shiftstartday),
                shiftendday: String(weekoffpresent.shiftendday),
                shiftdaytotal: String(weekoffpresent.shiftdaytotal),
                calstartday: String(weekoffpresent.calstartday),
                calendday: String(weekoffpresent.calendday),
                caldaytotal: String(weekoffpresent.caldaytotal),
                weekoffpresentday: String(weekoffpresent.weekoffpresentday),
                shiftstatus: String(weekoffpresent.shiftstatus),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });


            await fetchWeekoffpresent();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        let employees = selectedEmp.map((item) => item.value);
        // const isNameMatch = weekoffpresents.some((item) => item.company === weekoffpresent.company
        //     && item.branch === weekoffpresent.branch
        //     && item.unit === weekoffpresent.unit
        //     && item.team === weekoffpresent.team
        //     && item.shiftstatus === weekoffpresent.shiftstatus
        //     && item.employee.some((data) => employees.includes(data))
        // );

        const isNameMatch = weekoffpresents?.some((item) =>
            item.company === weekoffpresent.company &&
            item.shiftstatus === weekoffpresent.shiftstatus &&
            item.filtertype === weekoffpresent.filtertype &&

            (selectedBranch.length > 0 ? item.branch.some((data) =>
                selectedBranch.map((item) => item.value).includes(data)) : true) &&
            (selectedUnit.length > 0 ? item.unit.some((data) =>
                selectedUnit.map((item) => item.value).includes(data)) : true) &&
            (selectedTeam.length > 0 ? item.team.some((data) =>
                selectedTeam.map((item) => item.value).includes(data)) : true) &&
            (selectedEmp.length > 0 ? item.employee.some((data) =>
                selectedEmp.map((item) => item.value).includes(data)) : true)

        );


        if (weekoffpresent.shiftstatus === "Please Select Shift Status") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Shift Status"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (weekoffpresent.company === "Please Select Company") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (weekoffpresent.filtertype === "Please Select Filter Type" || weekoffpresent.filtertype === "" || weekoffpresent.filtertype === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Filter Type for Employee Names"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(weekoffpresent.filtertype) && selectedBranch.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (["Individual", "Team", "Unit"]?.includes(weekoffpresent.filtertype) && selectedUnit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedTeam.length === 0 && ["Individual", "Team"]?.includes(weekoffpresent.filtertype)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedEmp.length === 0 && ["Individual"]?.includes(weekoffpresent.filtertype)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Names"}</p>
                </>
            );
            handleClickOpenerr();
        }
        // else if (weekoffpresent.branch === "Please Select Branch") {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        // else if (weekoffpresent.unit === "Please Select Unit") {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        // else if (weekoffpresent.team === "Please Select Team") {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }
        // else if (selectedEmp.length == 0) {
        //     setShowAlert(
        //         <>
        //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
        //         </>
        //     );
        //     handleClickOpenerr();
        // }


        else if (weekoffpresent.shiftstartday === "Please Select Shift Start") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Shift Start"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (weekoffpresent.shiftendday === "Please Select Shift End") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Shift End"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (weekoffpresent.calstartday === "Please Select Calculation Start") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Calculation Start"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (weekoffpresent.calendday === "Please Select Calculation End") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Calculation End"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (weekoffpresent.weekoffpresentday === "Please Select Weekoff Present Day") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Weekoff Present Day"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exists!"}</p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setWeekoffpresent({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            employee: "Please Select Employee",
            shiftstartday: "Please Select Shift Start",
            shiftendday: "Please Select Shift End",
            calstartday: "Please Select Calculation Start",
            calendday: "Please Select Calculation End",
            weekoffpresentday: "Please Select Weekoff Present Day",
            shiftstatus: "Please Select Shift Status",
            shiftdaytotal: "",
            caldaytotal: "",
            filtertype: "Please Select Filter Type"
        });
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };

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
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWeekoffpresentEdit(res?.data?.sweekoffpresent);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWeekoffpresentEdit(res?.data?.sweekoffpresent);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //Project updateby edit page...
    let updateby = weekoffpresentEdit?.updatedby;
    let addedby = weekoffpresentEdit?.addedby;

    let subprojectsid = weekoffpresentEdit?._id;

    //get all Sub vendormasters.
    const fetchWeekoffpresent = async () => {
        try {
            let res_area = await axios.get(SERVICE.WEEKOFFPRESENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setWeekoffpresents(res_area?.data?.weekoffpresents);
            setWeekoffpresentcheck(true);
        } catch (err) { setWeekoffpresentcheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // pdf.....
    const columns = [
        { title: "Shift Status", field: "shiftstatus" },
        { title: "Company", field: "company" },
        { title: "Type", field: "filtertype" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Employee", field: "employee" },
        { title: "Shift Day", field: "shiftstartday" },
        { title: "Calculation Day", field: "calstartday" },
        { title: "Weekoff Present Day", field: "weekoffpresentday" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = rowDataTable.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: itemsWithSerial,
        });
        doc.save("Weekoff Controlpanel.pdf");
    };

    // Excel
    const fileName = "Weekoff Controlpanel";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Weekoff Controlpanel",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchWeekoffpresent();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = weekoffpresents?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            shiftstartday: item.shiftstartday + "-" + item.shiftendday,
            calstartday: item.calstartday + "-" + item.calendday,
            employeename: item.employee.length > 0 ? item.employee.join(",").toString() :
                item.filtertype === "Branch" ?
                    allUsersData
                        ?.filter(
                            (comp) =>
                                item.company?.includes(comp.company))
                        ?.filter(
                            (comp) =>
                                item.branch?.includes(comp.branch)
                        )?.map(data => data?.companyname)?.join(", ")

                    : item.filtertype === "Unit" ?
                        allUsersData
                            ?.filter(
                                (comp) =>
                                    item.company?.includes(comp.company))
                            ?.filter(
                                (comp) =>
                                    item.branch?.includes(comp.branch)
                            )?.filter(
                                (comp) =>
                                    item.unit?.includes(comp.unit)
                            )?.map(data => data?.companyname)?.join(", ")
                        : item.filtertype === "Team" ?
                            allUsersData
                                ?.filter(
                                    (comp) =>
                                        item.company?.includes(comp.company))
                                ?.filter(
                                    (comp) =>
                                        item.branch?.includes(comp.branch)
                                )?.filter(
                                    (comp) =>
                                        item.unit?.includes(comp.unit)
                                )?.filter(
                                    (comp) =>
                                        item.team?.includes(comp.team)
                                )?.map(data => data?.companyname)?.join(", ") : "ALL",

        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [weekoffpresents]);

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
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "shiftstatus", headerName: "Shift Status", flex: 0, width: 130, hide: !columnVisibility.shiftstatus, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "filtertype", headerName: "Type", flex: 0, width: 100, hide: !columnVisibility.filtertype, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 100, hide: !columnVisibility.employee, headerClassName: "bold-header" },
        { field: "shiftstartday", headerName: "Shift Day", flex: 0, width: 130, hide: !columnVisibility.shiftstartday, headerClassName: "bold-header" },
        { field: "calstartday", headerName: "Calculation Day", flex: 0, width: 130, hide: !columnVisibility.calstartday, headerClassName: "bold-header" },
        { field: "weekoffpresentday", headerName: "Weekoff Present Day", flex: 0, width: 130, hide: !columnVisibility.weekoffpresentday, headerClassName: "bold-header" },

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
                    {isUserRoleCompare?.includes("dweekoffcontrolpanel") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vweekoffcontrolpanel") && (
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
                    {isUserRoleCompare?.includes("iweekoffcontrolpanel") && (
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
            shiftstatus: item.shiftstatus,
            company: item.company,
            filtertype: item.filtertype,
            branch: item.branch.length > 0 ? item.branch.join(",").toString() : '',
            unit: item.unit.length > 0 ? item.unit.join(",").toString() : '',
            team: item.team.length > 0 ? item.team.join(",").toString() : '',
            employee: item.employee.length > 0 ? item.employee.join(",").toString() : 'ALL',
            shiftstartday: item.shiftstartday,
            calstartday: item.calstartday,
            weekoffpresentday: item.weekoffpresentday,
            employeename: item.employeename
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
    return (
        <Box>
            <Headtitle title={"Weekoff Controlpanel"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Weekoff Controlpanel</Typography>
            {isUserRoleCompare?.includes("aweekoffcontrolpanel") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Weekoff Controlpanel</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Shift Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstatusDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.shiftstatus, value: weekoffpresent.shiftstatus }}
                                            onChange={(e) => {
                                                setWeekoffpresent({ ...weekoffpresent, shiftstatus: e.value, });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.company, value: weekoffpresent.company }}
                                            onChange={(e) => {
                                                setWeekoffpresent({
                                                    ...weekoffpresent,
                                                    company: e.value,
                                                    filtertype: "Please Select Filter Type"
                                                });
                                                setSelectedBranch([]);
                                                setSelectedUnit([]);
                                                setSelectedTeam([]);
                                                setSelectedEmp([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={[
                                                { label: "Individual", value: "Individual" },
                                                { label: "Branch", value: "Branch" },
                                                { label: "Unit", value: "Unit" },
                                                { label: "Team", value: "Team" },
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: weekoffpresent.filtertype,
                                                value: weekoffpresent.filtertype,
                                            }}
                                            onChange={(e) => {
                                                setWeekoffpresent({ ...weekoffpresent, filtertype: e.value });
                                                setSelectedBranch([]);
                                                setSelectedUnit([]);
                                                setSelectedTeam([]);
                                                setSelectedEmp([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(weekoffpresent.filtertype) ? <>
                                    {/* Branch Unit Team */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        weekoffpresent.company === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedBranch}

                                                onChange={handleBranchChange}
                                                valueRenderer={customValueRendererBranch}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        weekoffpresent.company === comp.company && selectedBranch
                                                            .map((item) => item.value)
                                                            .includes(comp.branch)
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedUnit}
                                                onChange={handleUnitChange}
                                                valueRenderer={customValueRendererUnit}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Team <b style={{ color: "red" }}>*</b></Typography>
                                            <MultiSelect
                                                options={Array.from(
                                                    new Set(
                                                        allTeam
                                                            ?.filter(
                                                                (comp) =>
                                                                    selectedBranch
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch) &&
                                                                    selectedUnit
                                                                        .map((item) => item.value)
                                                                        .includes(comp.unit)
                                                            )
                                                            ?.map((com) => com.teamname)
                                                    )
                                                ).map((teamname) => ({
                                                    label: teamname,
                                                    value: teamname,
                                                }))}
                                                value={selectedTeam}
                                                onChange={handleTeamChange}
                                                valueRenderer={customValueRendererTeam}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                                    : ["Branch"]?.includes(weekoffpresent.filtertype) ?
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={isAssignBranch?.filter(
                                                            (comp) =>
                                                                weekoffpresent.company === comp.company
                                                        )?.map(data => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedBranch}

                                                        onChange={handleBranchChange}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                        :
                                        ["Unit"]?.includes(weekoffpresent.filtertype) ?
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                                                        <MultiSelect
                                                            options={isAssignBranch?.filter(
                                                                (comp) =>
                                                                    weekoffpresent.company === comp.company
                                                            )?.map(data => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedBranch}

                                                            onChange={handleBranchChange}
                                                            valueRenderer={customValueRendererBranch}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                                        <MultiSelect
                                                            options={isAssignBranch?.filter(
                                                                (comp) =>
                                                                    weekoffpresent.company === comp.company && selectedBranch
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch)
                                                            )?.map(data => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedUnit}
                                                            onChange={handleUnitChange}
                                                            valueRenderer={customValueRendererUnit}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : ""
                                }

                                {["Individual"]?.includes(weekoffpresent.filtertype) &&
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                                            <MultiSelect
                                                options={allUsersData?.filter(
                                                    (comp) =>
                                                        weekoffpresent.company === comp.company && selectedBranch?.map(data => data.value)?.includes(comp.branch) && selectedUnit?.map(data => data.value)?.includes(comp.unit) && selectedTeam?.map(data => data.value)?.includes(comp.team)
                                                )?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedEmp}
                                                onChange={(e) => {
                                                    handleEmployeeChange(e);
                                                }}
                                                valueRenderer={customValueRendererEmp}
                                                labelledBy="Please Select Employee"
                                            />
                                        </FormControl>
                                    </Grid>}

                                {/* <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    weekoffpresent.company === comp.company
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.branch, value: weekoffpresent.branch }}
                                            onChange={(e) => {
                                                setWeekoffpresent({ ...weekoffpresent, branch: e.value, unit: "Please Select Unit", team: "Please Select Team", employee: "Please Select Employee" });

                                                setSelectedEmp([]);


                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    weekoffpresent.company === comp.company && weekoffpresent.branch === comp.branch
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.unit, value: weekoffpresent.unit }}
                                            onChange={(e) => {
                                                setWeekoffpresent({ ...weekoffpresent, unit: e.value, team: "Please Select Team", employee: "Please Select Employee" });

                                                setSelectedEmp([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={allTeam?.filter(
                                                (comp) =>
                                                    weekoffpresent.company === comp.company && weekoffpresent.branch === comp.branch && weekoffpresent.unit === comp.unit
                                            )?.map(data => ({
                                                label: data.teamname,
                                                value: data.teamname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.team, value: weekoffpresent.team }}
                                            onChange={(e) => {
                                                setWeekoffpresent({ ...weekoffpresent, team: e.value, employee: "Please Select Employee" });

                                                setSelectedEmp([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid> */}

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Shift Start Day<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.shiftstartday, value: weekoffpresent.shiftstartday }}

                                            onChange={handleStartDayChange}
                                        />
                                    </FormControl>

                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Shift End Day<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.shiftendday, value: weekoffpresent.shiftendday }}
                                            onChange={handleEndDayChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>

                                        </Typography>Shift Day Total
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={weekoffpresent.shiftdaytotal}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Calculation Start Day<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.calstartday, value: weekoffpresent.calstartday }}
                                            onChange={handleStartDayChangetwo}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Calculation End Day<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.calendday, value: weekoffpresent.calendday }}
                                            onChange={handleEndDayChangetwo}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Calculation Day Total
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={weekoffpresent.caldaytotal}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Weekoff Present Day<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresent.weekoffpresentday, value: weekoffpresent.weekoffpresentday }}
                                            onChange={(e) => {
                                                setWeekoffpresent({
                                                    ...weekoffpresent,
                                                    weekoffpresentday: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isBtn}>
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}<br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lweekoffcontrolpanel") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Weekoff Controlpanel List</Typography>
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
                                        <MenuItem value={weekoffpresents?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelweekoffcontrolpanel") && (
                                        <>
                                            {/* <ExportXL csvData={rowDataTable?.map((t, index) => ({
                                                "SNo": index + 1,
                                                "Company": t.company,
                                                "Type": t.filtertype,
                                                "Branch": t.branch,
                                                "Unit": t.unit,
                                                "Team": t.team,
                                                "Employee": t.employee,
                                                "Shift Status": t.shiftstatus,
                                                "Shift Day": t.shiftstartday,
                                                "Calculation Day": t.calstartday,
                                                "Weekoff Present Day": t.weekoffpresentday,
                                            }))} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvweekoffcontrolpanel") && (
                                        <>
                                            {/* <ExportCSV csvData={rowDataTable?.map((t, index) => ({
                                                "SNo": index + 1,
                                                "Company": t.company,
                                                "Type": t.filtertype,
                                                "Branch": t.branch,
                                                "Unit": t.unit,
                                                "Team": t.team,
                                                "Employee": t.employee,
                                                "Shift Status": t.shiftstatus,
                                                "Shift Day": t.shiftstartday,
                                                "Calculation Day": t.calstartday,
                                                "Weekoff Present Day": t.weekoffpresentday,
                                            }))} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printweekoffcontrolpanel") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfweekoffcontrolpanel") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageweekoffcontrolpanel") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
                        {isUserRoleCompare?.includes("bdweekoffcontrolpanel") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {!weekoffpresentCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delWeekoffpresent(Weekoffsid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}

                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Weekoff Controlpanel Info</Typography>
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

               
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" fullWidth aria-describedby="alert-dialog-description" maxWidth="md">
                <Box sx={{ width: "850px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Weekoff Controlpanel</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Shift Status</Typography>
                                    <Typography>{weekoffpresentEdit.shiftstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{weekoffpresentEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{weekoffpresentEdit.filtertype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <FormControl fullWidth size="small"
                                    sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{weekoffpresentEdit.branch.length > 0 ? (weekoffpresentEdit.branch + ',') : ''}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <FormControl fullWidth size="small"
                                    sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{weekoffpresentEdit.unit.length > 0 ? (weekoffpresentEdit.unit + ',') : ''}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <FormControl fullWidth size="small"
                                    sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{weekoffpresentEdit.team.length > 0 ? (weekoffpresentEdit.team + ',') : ''}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <FormControl fullWidth size="small"
                                    sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <Typography variant="h6">Employee</Typography>
                                    <Typography>
                                        {weekoffpresentEdit.employee.length > 0 ?
                                            weekoffpresentEdit.employee?.toString() :
                                            weekoffpresentEdit.filtertype === "Branch" ?
                                                allUsersData
                                                    ?.filter(
                                                        (comp) =>
                                                            weekoffpresentEdit.company?.includes(comp.company))
                                                    ?.filter(
                                                        (comp) =>
                                                            weekoffpresentEdit.branch?.includes(comp.branch)
                                                    )?.map(data => data?.companyname)?.join(", ")

                                                : weekoffpresentEdit.filtertype === "Unit" ?
                                                    allUsersData
                                                        ?.filter(
                                                            (comp) =>
                                                                weekoffpresentEdit.company?.includes(comp.company))
                                                        ?.filter(
                                                            (comp) =>
                                                                weekoffpresentEdit.branch?.includes(comp.branch)
                                                        )?.filter(
                                                            (comp) =>
                                                                weekoffpresentEdit.unit?.includes(comp.unit)
                                                        )?.map(data => data?.companyname)?.join(", ")
                                                    : weekoffpresentEdit.filtertype === "Team" ?
                                                        allUsersData
                                                            ?.filter(
                                                                (comp) =>
                                                                    weekoffpresentEdit.company?.includes(comp.company))
                                                            ?.filter(
                                                                (comp) =>
                                                                    weekoffpresentEdit.branch?.includes(comp.branch)
                                                            )?.filter(
                                                                (comp) =>
                                                                    weekoffpresentEdit.unit?.includes(comp.unit)
                                                            )?.filter(
                                                                (comp) =>
                                                                    weekoffpresentEdit.team?.includes(comp.team)
                                                            )?.map(data => data?.companyname)?.join(", ")
                                                        :
                                                        ""
                                        }
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Shift Start Day</Typography>
                                    <Typography>{weekoffpresentEdit.shiftstartday}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Shift End Day</Typography>
                                    <Typography>{weekoffpresentEdit.shiftendday}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Shift Day Total</Typography>
                                    <Typography>{weekoffpresentEdit.shiftdaytotal}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Calculation Start Day</Typography>
                                    <Typography>{weekoffpresentEdit.calstartday}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Calculation End Day</Typography>
                                    <Typography>{weekoffpresentEdit.calendday}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Calculation Day Total</Typography>
                                    <Typography>{weekoffpresentEdit.caldaytotal}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Weekoff Present Day</Typography>
                                    <Typography>{weekoffpresentEdit.weekoffpresentday}</Typography>
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delWeekoffcheckbox(e)}>
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={items ?? []}
                filename={"WeekOff Controlpanel"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default WeekOffPresent;