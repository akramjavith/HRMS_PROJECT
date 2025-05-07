import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControlLabel, FormControl, Grid, Button, Popover, Checkbox } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import MenuIcon from "@mui/icons-material/Menu";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MultiSelect } from "react-multi-select-component";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar.js";
import AggridTable from "../../../components/AggridTable.js";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

const WeekoffSwitch = styled((props) => (
    <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
        onClick={props.onClick}
    />
))(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        backgroundColor: '#e32a2a',
        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&::before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&::after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
        backgroundColor: '#fff',
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: 'white',
        '&:hover': {
            backgroundColor: alpha('#008000', theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#008000',
    },
}));

function WeekOffPresent() {

    const gridRefTableWkControl = useRef(null);
    const gridRefImageWkControl = useRef(null);

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
        filtertype: "Please Select Filter Type"
    });

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
        filtertype: "Please Select Filter Type"
    });

    const [previousData, setPreviousData] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
    const [weekoffpresents, setWeekoffpresents] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [weekoffpresentCheck, setWeekoffpresentcheck] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [enableWeekOffDay, setEnableWeekOffDay] = useState(true);

    // State to track advanced filter
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // pageWkControl refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    //Datatable
    const [pageWkControl, setPageWkControl] = useState(1);
    const [pageSizeWkControl, setPageSizeWkControl] = useState(10);
    const [searchQueryWkControl, setSearchQueryWkControl] = useState("");
    const [totalPagesWkControl, setTotalPagesWkControl] = useState(1);

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => { setIsEditOpen(true); };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => { setIsDeleteOpencheckbox(true); };
    const handleCloseModcheckbox = () => {
        setSelectedRows([]);
        setSelectAllChecked(false);
        setIsDeleteOpencheckbox(false);
    };

    // Manage Columns
    const [searchQueryManageWkControl, setSearchQueryManageWkControl] = useState("");
    const [isManageColumnsOpenWkControl, setManageColumnsOpenWkControl] = useState(false);
    const [anchorElWkControl, setAnchorElWkControl] = useState(null);

    const handleOpenManageColumnsWkControl = (event) => {
        setAnchorElWkControl(event.currentTarget);
        setManageColumnsOpenWkControl(true);
    };
    const handleCloseManageColumnsWkControl = () => {
        setManageColumnsOpenWkControl(false);
        setSearchQueryManageWkControl("");
    };

    const openWkControl = Boolean(anchorElWkControl);
    const idWkControl = openWkControl ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchWkControl, setAnchorElSearchWkControl] = React.useState(null);
    const handleClickSearchWkControl = (event) => {
        setAnchorElSearchWkControl(event.currentTarget);
    };
    const handleCloseSearchWkControl = () => {
        setAnchorElSearchWkControl(null);
        setSearchQueryWkControl("");
    };

    const openSearchWkControl = Boolean(anchorElSearchWkControl);
    const idSearchWkControl = openSearchWkControl ? 'simple-popover' : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibilityWkControl = {
        serialNumber: true,
        checkbox: true,
        // shiftstatus: true,
        company: true,
        filtertype: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        enable: true,
        shiftstartday: true,
        calstartday: true,
        weekoffpresentday: true,
        actions: true,
    };

    const [columnVisibilityWkControl, setColumnVisibilityWkControl] = useState(initialColumnVisibilityWkControl);

    // pageWkControl refersh reload code
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

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Weekoff Controlpanel"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),
            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    }

    const pathname = window.location.pathname;

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    const calculateShiftDayTotal = (startDay, endDay) => {
        if (!startDay || !endDay) return 0;

        const startIndex = weekDays.indexOf(startDay);
        const endIndex = weekDays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) return 0;

        if (endIndex >= startIndex) {
            return endIndex - startIndex + 1; // +1 to include the start day
        } else {
            return (7 - startIndex) + endIndex + 1; // +1 to include the start day
        }
    };

    const handleStartDayChange = (e) => {
        const newShiftstartday = e.value;
        const totalDays = calculateShiftDayTotal(newShiftstartday, weekoffpresent.shiftendday);

        // if (totalDays < 5) {
        //     setPopupContentMalert("You cannot set a week less than 5 days.");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        //     return;
        // }

        setWeekoffpresent({
            ...weekoffpresent,
            shiftstartday: newShiftstartday,
            shiftdaytotal: totalDays,
        });
    };

    const handleEndDayChange = (e) => {
        const newShiftendday = e.value;
        const totalDays = calculateShiftDayTotal(weekoffpresent.shiftstartday, newShiftendday);

        if (totalDays < 5) {
            setPopupContentMalert("You cannot set a week less than 5 days.");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return;
        }

        setWeekoffpresent({
            ...weekoffpresent,
            shiftendday: newShiftendday,
            shiftdaytotal: totalDays
        });
    };

    const calculateShiftDayTotalTwo = (startDay, endDay) => {
        if (!startDay || !endDay) return 0;

        const startIndex = weekDays.indexOf(startDay);
        const endIndex = weekDays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) return 0;

        if (endIndex >= startIndex) {
            return endIndex - startIndex + 1; // +1 to include the start day
        } else {
            return (7 - startIndex) + endIndex + 1; // +1 to include the start day
        }
    };

    const handleStartDayChangetwo = (e) => {
        const newShiftstartday = e.value;
        const totalDays = calculateShiftDayTotalTwo(newShiftstartday, weekoffpresent.calendday);

        // if (totalDays < 5) {
        //     setPopupContentMalert("You cannot set a week less than 5 days.");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        //     return;
        // }

        setWeekoffpresent({
            ...weekoffpresent,
            calstartday: newShiftstartday,
            caldaytotal: totalDays
        });
    };

    const handleEndDayChangetwo = (e) => {
        const newShiftendday = e.value;
        const totalDays = calculateShiftDayTotalTwo(weekoffpresent.calstartday, newShiftendday);

        if (totalDays < 5) {
            setPopupContentMalert("You cannot set a week less than 5 days.");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return;
        }

        setWeekoffpresent({
            ...weekoffpresent,
            calendday: newShiftendday,
            caldaytotal: totalDays
        });
    };

    const calculateShiftDayTotalEdit = (startDay, endDay) => {
        if (!startDay || !endDay) return 0;

        const startIndex = weekDays.indexOf(startDay);
        const endIndex = weekDays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) return 0;

        if (endIndex >= startIndex) {
            return endIndex - startIndex + 1; // +1 to include the start day
        } else {
            return (7 - startIndex) + endIndex + 1; // +1 to include the start day
        }
    };

    const handleStartDayChangeEdit = (e) => {
        const newShiftstartday = e.value;
        const totalDays = calculateShiftDayTotalEdit(newShiftstartday, weekoffpresentEdit.shiftendday);

        // if (totalDays < 5) {
        //     setPopupContentMalert("You cannot set a week less than 5 days.");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        //     return;
        // }

        setWeekoffpresentEdit({
            ...weekoffpresentEdit,
            shiftstartday: newShiftstartday,
            shiftdaytotal: totalDays,
        });
    };

    const handleEndDayChangeEdit = (e) => {
        const newShiftendday = e.value;
        const totalDays = calculateShiftDayTotalEdit(weekoffpresentEdit.shiftstartday, newShiftendday);

        if (totalDays < 5) {
            setPopupContentMalert("You cannot set a week less than 5 days.");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return;
        }

        setWeekoffpresentEdit({
            ...weekoffpresentEdit,
            shiftendday: newShiftendday,
            shiftdaytotal: totalDays
        });
    };

    const calculateShiftDayTotalTwoEdit = (startDay, endDay) => {
        if (!startDay || !endDay) return 0;

        const startIndex = weekDays.indexOf(startDay);
        const endIndex = weekDays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) return 0;

        if (endIndex >= startIndex) {
            return endIndex - startIndex + 1; // +1 to include the start day
        } else {
            return (7 - startIndex) + endIndex + 1; // +1 to include the start day
        }
    };

    const handleStartDayChangetwoEdit = (e) => {
        const newShiftstartday = e.value;
        const totalDays = calculateShiftDayTotalTwoEdit(newShiftstartday, weekoffpresentEdit.calendday);

        // if (totalDays < 5) {
        //     setPopupContentMalert("You cannot set a week less than 5 days.");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        //     return;
        // }

        setWeekoffpresentEdit({
            ...weekoffpresentEdit,
            calstartday: newShiftstartday,
            caldaytotal: totalDays
        });
    };

    const handleEndDayChangetwoEdit = (e) => {
        const newShiftendday = e.value;
        const totalDays = calculateShiftDayTotalTwoEdit(weekoffpresentEdit.calstartday, newShiftendday);

        if (totalDays < 5) {
            setPopupContentMalert("You cannot set a week less than 5 days.");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return;
        }

        setWeekoffpresentEdit({
            ...weekoffpresentEdit,
            calendday: newShiftendday,
            caldaytotal: totalDays
        });
    };

    const [deleteweekoffpresent, setDeleteWeekoffpresent] = useState("");

    const rowData = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteWeekoffpresent(res?.data?.sweekoffpresent);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let Weekoffsid = deleteweekoffpresent?._id;
    const delWeekoffpresent = async () => {
        setPageName(!pageName)
        try {
            if (Weekoffsid) {
                await axios.delete(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${Weekoffsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchWeekoffpresent();
                handleCloseMod();
                setSelectedRows([]);
                setPageWkControl(1);
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delWeekoffcheckbox = async () => {
        setPageName(!pageName)
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
            setPageWkControl(1);

            await fetchWeekoffpresent();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
            : "Please Select Branch";
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
            : "Please Select Unit";
    };

    //Teamto multiselect dropdown changes
    const handleTeamChange = (options) => {
        setSelectedTeam(options);
        setSelectedEmp([]);
    };
    const customValueRendererTeam = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Team";
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

    // Handle weekoff hide/show
    const toggleNavbar = () => {
        setEnableWeekOffDay((prev) => !prev);
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true);
        setPageWkControl(1);
        setPageSizeWkControl(10);

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
                enable: Boolean(enableWeekOffDay),
                shiftstartday: String(weekoffpresent.shiftstartday),
                shiftendday: String(weekoffpresent.shiftendday),
                shiftdaytotal: String(weekoffpresent.shiftdaytotal),
                calstartday: String(weekoffpresent.calstartday),
                calendday: String(weekoffpresent.calendday),
                caldaytotal: String(weekoffpresent.caldaytotal),
                weekoffpresentday: String(weekoffpresent.weekoffpresentday),
                // shiftstatus: String(weekoffpresent.shiftstatus),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });


            await fetchWeekoffpresent();
            setSearchQueryWkControl("");
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
            // item.shiftstatus === weekoffpresent.shiftstatus &&
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


        // if (weekoffpresent.shiftstatus === "Please Select Shift Status") {
        //     setPopupContentMalert("Please Select Shift Status");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // }
        // else
        if (weekoffpresent.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresent.filtertype === "Please Select Filter Type" || weekoffpresent.filtertype === "" || weekoffpresent.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(weekoffpresent.filtertype) && selectedBranch.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(weekoffpresent.filtertype) && selectedUnit.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeam.length === 0 && ["Individual", "Team"]?.includes(weekoffpresent.filtertype)) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmp.length === 0 && ["Individual"]?.includes(weekoffpresent.filtertype)) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
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
            setPopupContentMalert("Please Select Shift Start");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresent.shiftendday === "Please Select Shift End") {
            setPopupContentMalert("Please Select Shift End");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresent.calstartday === "Please Select Calculation Start") {
            setPopupContentMalert("Please Select Calculation Start");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresent.calendday === "Please Select Calculation End") {
            setPopupContentMalert("Please Select Calculation End");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresent.weekoffpresentday === "Please Select Weekoff Present Day") {
            setPopupContentMalert("Please Select Weekoff Present Day");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
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
            // shiftstatus: "Please Select Shift Status",
            shiftdaytotal: "",
            caldaytotal: "",
            filtertype: "Please Select Filter Type"
        });
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [selectedBranchEdit, setSelectedBranchEdit] = useState([]);
    const [selectedUnitEdit, setSelectedUnitEdit] = useState([]);
    const [selectedTeamEdit, setSelectedTeamEdit] = useState([]);
    const [selectedEmpEdit, setSelectedEmpEdit] = useState([]);

    //branchto multiselect dropdown changes
    const handleBranchChangeEdit = (options) => {
        setSelectedBranchEdit(options);
        setSelectedUnitEdit([]);
        setSelectedTeamEdit([]);
        setSelectedEmpEdit([]);
    };

    const customValueRendererBranchEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    // unitto multiselect dropdown changes
    const handleUnitChangeEdit = (options) => {
        setSelectedUnitEdit(options);
        setSelectedTeamEdit([]);
        setSelectedEmpEdit([]);
    };
    const customValueRendererUnitEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Unit";
    };

    //Teamto multiselect dropdown changes
    const handleTeamChangeEdit = (options) => {
        setSelectedTeamEdit(options);
        setSelectedEmpEdit([]);
    };
    const customValueRendererTeamEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Team";
    };

    // Employee    
    const handleEmployeeChangeEdit = (options) => {
        setSelectedEmpEdit(options);
    };
    const customValueRendererEmpEdit = (valueCate, _employees) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    // Handle weekoff hide/show
    const toggleNavbarEdit = () => {
        setWeekoffpresentEdit({
            ...weekoffpresentEdit,
            enable: !weekoffpresentEdit.enable,
        });
    };

    //get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWeekoffpresentEdit(res?.data?.sweekoffpresent);
            setPreviousData(res?.data?.sweekoffpresent);
            setSelectedBranchEdit(res?.data?.sweekoffpresent.branch.map(item => ({ label: item, value: item })));
            setSelectedUnitEdit(res?.data?.sweekoffpresent.unit.map(item => ({ label: item, value: item })));
            setSelectedTeamEdit(res?.data?.sweekoffpresent.team.map(item => ({ label: item, value: item })));
            setSelectedEmpEdit(res?.data?.sweekoffpresent.employee.map(item => ({ label: item, value: item })));
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWeekoffpresentEdit(res?.data?.sweekoffpresent);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWeekoffpresentEdit(res?.data?.sweekoffpresent);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit pageWkControl...
    let updateby = weekoffpresentEdit?.updatedby;
    let addedby = weekoffpresentEdit?.addedby;
    let subprojectsid = weekoffpresentEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {

        let branchnames = selectedBranchEdit.map((item) => item.value);
        let unitnames = selectedUnitEdit.map((item) => item.value);
        let teamnames = selectedTeamEdit.map((item) => item.value);
        let empnames = selectedEmpEdit.map((item) => item.value);

        try {
            await axios.put(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(weekoffpresentEdit.company),
                filtertype: String(weekoffpresentEdit.filtertype),
                branch: branchnames,
                unit: unitnames,
                team: teamnames,
                employee: empnames,
                enable: Boolean(weekoffpresentEdit.enable),
                shiftstartday: String(weekoffpresentEdit.shiftstartday),
                shiftendday: String(weekoffpresentEdit.shiftendday),
                shiftdaytotal: String(weekoffpresentEdit.shiftdaytotal),
                calstartday: String(weekoffpresentEdit.calstartday),
                calendday: String(weekoffpresentEdit.calendday),
                caldaytotal: String(weekoffpresentEdit.caldaytotal),
                weekoffpresentday: String(weekoffpresentEdit.weekoffpresentday),
                previousdata: [...weekoffpresentEdit.previousdata, ({ ...previousData, createdby: weekoffpresentEdit?.addedby[0].name })],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            await fetchWeekoffpresent();
            handleCloseModEdit();
            setSearchQueryWkControl("");
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setPreviousData([]);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        let res_area = await axios.get(SERVICE.WEEKOFFPRESENT, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let result = res_area?.data?.weekoffpresents.filter(
            (item) => item._id !== weekoffpresentEdit._id
        );

        const isNameMatch = result?.some((item) =>
            item.company === weekoffpresentEdit.company &&
            // item.shiftstatus === weekoffpresent.shiftstatus &&
            item.filtertype === weekoffpresentEdit.filtertype &&

            (selectedBranchEdit.length > 0 ? item.branch.some((data) =>
                selectedBranchEdit.map((item) => item.value).includes(data)) : true) &&
            (selectedUnitEdit.length > 0 ? item.unit.some((data) =>
                selectedUnitEdit.map((item) => item.value).includes(data)) : true) &&
            (selectedTeamEdit.length > 0 ? item.team.some((data) =>
                selectedTeamEdit.map((item) => item.value).includes(data)) : true) &&
            (selectedEmpEdit.length > 0 ? item.employee.some((data) =>
                selectedEmpEdit.map((item) => item.value).includes(data)) : true)

        );
        if (weekoffpresentEdit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresentEdit.filtertype === "Please Select Filter Type" || weekoffpresentEdit.filtertype === "" || weekoffpresentEdit.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(weekoffpresentEdit.filtertype) && selectedBranchEdit.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(weekoffpresentEdit.filtertype) && selectedUnitEdit.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeamEdit.length === 0 && ["Individual", "Team"]?.includes(weekoffpresentEdit.filtertype)) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmpEdit.length === 0 && ["Individual"]?.includes(weekoffpresentEdit.filtertype)) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresentEdit.shiftstartday === "Please Select Shift Start") {
            setPopupContentMalert("Please Select Shift Start");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresentEdit.shiftendday === "Please Select Shift End") {
            setPopupContentMalert("Please Select Shift End");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresentEdit.calstartday === "Please Select Calculation Start") {
            setPopupContentMalert("Please Select Calculation Start");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresentEdit.calendday === "Please Select Calculation End") {
            setPopupContentMalert("Please Select Calculation End");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (weekoffpresentEdit.weekoffpresentday === "Please Select Weekoff Present Day") {
            setPopupContentMalert("Please Select Weekoff Present Day");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Name Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    //get all Sub vendormasters.
    const fetchWeekoffpresent = async () => {
        setPageName(!pageName)
        const accessmodule = [];

        isAssignBranch.map((data) => {
            let fetfinalurl = [];

            if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
                data?.subsubpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
                fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0) {
                fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            }
            // console.log(fetfinalurl, 'fetfinalurl')
            accessmodule.push(fetfinalurl);
        });

        const uniqueValues = [...new Set(accessmodule.flat())];

        if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {
            try {
                let res_area = await axios.get(SERVICE.WEEKOFFPRESENT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                const itemsWithSerialNumber = res_area?.data?.weekoffpresents?.map((item, index) => ({
                    ...item, serialNumber: index + 1,
                    id: item._id,
                    shiftstartday: item.shiftstartday + "-" + item.shiftendday,
                    calstartday: item.calstartday + "-" + item.calendday,
                    enable: item.enable === true ? 'Yes' : 'No',
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
                setWeekoffpresents(itemsWithSerialNumber);
                setWeekoffpresentcheck(true);
                // If necessary, set pagination state here
                setTotalPagesWkControl(Math.ceil(res_area?.data?.weekoffpresents.length / pageSizeWkControl));
            } catch (err) { setWeekoffpresentcheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
        }
    };

    useEffect(() => {
        fetchWeekoffpresent();
    }, []);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(weekoffpresents);
    }, [weekoffpresents]);

    // Split the search query into individual terms
    const searchTerms = searchQueryWkControl.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    // Pagination for outer filter
    const filteredData = filteredDatas?.slice((pageWkControl - 1) * pageSizeWkControl, pageWkControl * pageSizeWkControl);
    const totalPagesWkControlOuter = Math.ceil(filteredDatas?.length / pageSizeWkControl);
    const visiblePages = Math.min(totalPagesWkControlOuter, 3);
    const firstVisiblePage = Math.max(1, pageWkControl - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesWkControlOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageWkControl * pageSizeWkControl;
    const indexOfFirstItem = indexOfLastItem - pageSizeWkControl;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const columnDataTableWkControl = [
        { field: "checkbox", headerName: "Checkbox", sortable: false, width: 90, headerCheckboxSelection: true, checkboxSelection: true, hide: !columnVisibilityWkControl.checkbox, pinned: "left", lockPinned: true, },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 90, hide: !columnVisibilityWkControl.serialNumber, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibilityWkControl.company, headerClassName: "bold-header" },
        { field: "filtertype", headerName: "Type", flex: 0, width: 100, hide: !columnVisibilityWkControl.filtertype, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibilityWkControl.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibilityWkControl.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibilityWkControl.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 100, hide: !columnVisibilityWkControl.employee, headerClassName: "bold-header" },
        { field: "enable", headerName: "Include Weekoff Target", flex: 0, width: 100, hide: !columnVisibilityWkControl.enable, headerClassName: "bold-header" },
        { field: "shiftstartday", headerName: "Shift Day", flex: 0, width: 130, hide: !columnVisibilityWkControl.shiftstartday, headerClassName: "bold-header" },
        { field: "calstartday", headerName: "Calculation Day", flex: 0, width: 130, hide: !columnVisibilityWkControl.calstartday, headerClassName: "bold-header" },
        { field: "weekoffpresentday", headerName: "Weekoff Present Day", flex: 0, width: 130, hide: !columnVisibilityWkControl.weekoffpresentday, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityWkControl.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", justifyContent: 'center' }}>
                    <Box>
                        {isUserRoleCompare?.includes("vweekoffcontrolpanel") && (
                            <Button
                                variant="contained"
                                sx={{
                                    minWidth: "15px",
                                    padding: "6px 5px",
                                }}
                                onClick={() => {
                                    window.open(
                                        `/attendance/previousloglist/${params.data.id}`,
                                        "_blank"
                                    );
                                }}
                            >
                                <MenuIcon style={{ fontsize: "small" }} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("eweekoffcontrolpanel") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCode(params.data.id);
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("dweekoffcontrolpanel") && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.data.id);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("vweekoffcontrolpanel") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    handleClickOpenview();
                                    getviewCode(params.data.id);
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("iweekoffcontrolpanel") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getinfoCode(params.data.id);
                                }}
                            >
                                <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                            </Button>
                        )}
                    </Box>
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            filtertype: item.filtertype,
            branch: item.branch.length > 0 ? item.branch.join(",").toString() : '',
            unit: item.unit.length > 0 ? item.unit.join(",").toString() : '',
            team: item.team.length > 0 ? item.team.join(",").toString() : '',
            employee: item.employee.length > 0 ? item.employee.join(",").toString() : 'ALL',
            enable: item.enable,
            shiftstartday: item.shiftstartday,
            calstartday: item.calstartday,
            weekoffpresentday: item.weekoffpresentday,
            employeename: item.employeename
        };
    });

    const rowDataTableOverAll = weekoffpresents.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
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

    // Datatable
    const handlePageSizeChange = (e) => {
        setPageSizeWkControl(Number(e.target.value));
        setSelectAllChecked(false);
        setSelectedRows([]);
        setPageWkControl(1);
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityWkControl };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityWkControl(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityWkControl");
        if (savedVisibility) {
            setColumnVisibilityWkControl(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityWkControl", JSON.stringify(columnVisibilityWkControl));
    }, [columnVisibilityWkControl]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableWkControl.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageWkControl.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibilityWkControl((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Exports
    const [fileFormat, setFormat] = useState("");
    let exportColumnNames = ["Company", "Type", "Branch", "Unit", "Team", "Employee", "Include Weekoff Target", "Shift Day", "Calculation Day", "Weekoff Present Day"];
    let exportRowValues = ["company", "filtertype", "branch", "unit", "team", "employeename", "enable", "shiftstartday", "calstartday", "weekoffpresentday"];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Weekoff Controlpanel",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageWkControl.current) {
            domtoimage.toBlob(gridRefImageWkControl.current)
                .then((blob) => {
                    saveAs(blob, "WeekOff Controlpanel.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Weekoff Controlpanel"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Weekoff Controlpanel"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Setup"
                subsubpagename="Weekoff Controlpanel"
            />
            {isUserRoleCompare?.includes("aweekoffcontrolpanel") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}>Add Weekoff Controlpanel</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={accessbranch?.map(data => ({
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
                                    <Typography>Type<b style={{ color: "red" }}>*</b> </Typography>
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
                                        <Typography>Branch<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
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
                                        <Typography>Unit<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
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
                                        <Typography>Team <b style={{ color: "red" }}>*</b></Typography>
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
                                                <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
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
                                                    <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
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
                                                    <Typography>Unit<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
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
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Shift Start Day<b style={{ color: "red" }}>*</b></Typography>
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
                                    <Typography>Shift End Day<b style={{ color: "red" }}>*</b></Typography>
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
                                    <Typography>Shift Day Total</Typography>
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
                            {/* <Grid item md={3} sm={12} xs={12}>
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
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <Box sx={{ display: 'flex', marginTop: '25px' }}>
                                    <FormControlLabel
                                        control={<WeekoffSwitch defaultChecked checked={enableWeekOffDay} onClick={toggleNavbar} />}
                                    />
                                    <Box sx={{ marginTop: '10px' }}>Include Weekoff Target</Box>
                                </Box>
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
                        <Grid container spacing={1}>
                            <Grid item lg={1} md={2} sm={2} xs={6} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                                        Submit
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
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
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeWkControl}
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
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvweekoffcontrolpanel") && (
                                        <>
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
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableWkControl}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPageWkControl}
                                    maindatas={weekoffpresents}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQueryWkControl}
                                    setSearchQuery={setSearchQueryWkControl}
                                    paginated={false}
                                    totalDatas={weekoffpresents}
                                />
                            </Grid>
                        </Grid> <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsWkControl}> Manage Columns  </Button>&ensp;
                        {isUserRoleCompare?.includes("bdweekoffcontrolpanel") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>Bulk Delete </Button>
                        )}<br /><br />
                        {!weekoffpresentCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageWkControl} >
                                    <AggridTable
                                        rowDataTable={rowDataTable}
                                        columnDataTable={columnDataTableWkControl}
                                        columnVisibility={columnVisibilityWkControl}
                                        page={pageWkControl}
                                        setPage={setPageWkControl}
                                        pageSize={pageSizeWkControl}
                                        totalPages={totalPagesWkControl}
                                        setColumnVisibility={setColumnVisibilityWkControl}
                                        isHandleChange={isHandleChange}
                                        items={items}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRefTableWkControl}
                                        gridRefTableImg={gridRefImageWkControl}
                                        paginated={false}
                                        filteredDatas={filteredDatas}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        itemsList={weekoffpresents}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idWkControl}
                open={isManageColumnsOpenWkControl}
                anchorEl={anchorElWkControl}
                onClose={handleCloseManageColumnsWkControl}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsWkControl}
                    searchQuery={searchQueryManageWkControl}
                    setSearchQuery={setSearchQueryManageWkControl}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityWkControl}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityWkControl}
                    initialColumnVisibility={initialColumnVisibilityWkControl}
                    columnDataTable={columnDataTableWkControl}
                />
            </Popover>

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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={rowDataTableOverAll ?? []}
                filename={"WeekOff Controlpanel"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Weekoff Controlpanel Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delWeekoffpresent}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delWeekoffcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />

            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                    sx={{ marginTop: '95px' }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}> Edit Weekoff Controlpanel</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresentEdit.company, value: weekoffpresentEdit.company }}
                                            onChange={(e) => {
                                                setWeekoffpresentEdit({
                                                    ...weekoffpresentEdit,
                                                    company: e.value,
                                                    filtertype: "Please Select Filter Type"
                                                });
                                                setSelectedBranchEdit([]);
                                                setSelectedUnitEdit([]);
                                                setSelectedTeamEdit([]);
                                                setSelectedEmpEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Type<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={[
                                                { label: "Individual", value: "Individual" },
                                                { label: "Branch", value: "Branch" },
                                                { label: "Unit", value: "Unit" },
                                                { label: "Team", value: "Team" },
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: weekoffpresentEdit.filtertype,
                                                value: weekoffpresentEdit.filtertype,
                                            }}
                                            onChange={(e) => {
                                                setWeekoffpresentEdit({ ...weekoffpresentEdit, filtertype: e.value });
                                                setSelectedBranchEdit([]);
                                                setSelectedUnitEdit([]);
                                                setSelectedTeamEdit([]);
                                                setSelectedEmpEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(weekoffpresentEdit.filtertype) ? <>
                                    {/* Branch Unit Team */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Branch<b style={{ color: "red" }}>*</b> </Typography>
                                            <MultiSelect
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        weekoffpresentEdit.company === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedBranchEdit}

                                                onChange={handleBranchChangeEdit}
                                                valueRenderer={customValueRendererBranchEdit}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Unit<b style={{ color: "red" }}>*</b></Typography>
                                            <MultiSelect
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        weekoffpresentEdit.company === comp.company && selectedBranchEdit
                                                            .map((item) => item.value)
                                                            .includes(comp.branch)
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedUnitEdit}
                                                onChange={handleUnitChangeEdit}
                                                valueRenderer={customValueRendererUnitEdit}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Team <b style={{ color: "red" }}>*</b></Typography>
                                            <MultiSelect
                                                options={Array.from(
                                                    new Set(
                                                        allTeam
                                                            ?.filter(
                                                                (comp) =>
                                                                    selectedBranchEdit
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch) &&
                                                                    selectedUnitEdit
                                                                        .map((item) => item.value)
                                                                        .includes(comp.unit)
                                                            )
                                                            ?.map((com) => com.teamname)
                                                    )
                                                ).map((teamname) => ({
                                                    label: teamname,
                                                    value: teamname,
                                                }))}
                                                value={selectedTeamEdit}
                                                onChange={handleTeamChangeEdit}
                                                valueRenderer={customValueRendererTeamEdit}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                                    : ["Branch"]?.includes(weekoffpresentEdit.filtertype) ?
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
                                                            (comp) =>
                                                                weekoffpresentEdit.company === comp.company
                                                        )?.map(data => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedBranchEdit}

                                                        onChange={handleBranchChangeEdit}
                                                        valueRenderer={customValueRendererBranchEdit}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                        :
                                        ["Unit"]?.includes(weekoffpresentEdit.filtertype) ?
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                                                        <MultiSelect
                                                            options={accessbranch?.filter(
                                                                (comp) =>
                                                                    weekoffpresentEdit.company === comp.company
                                                            )?.map(data => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedBranchEdit}

                                                            onChange={handleBranchChangeEdit}
                                                            valueRenderer={customValueRendererBranchEdit}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>Unit<b style={{ color: "red" }}>*</b></Typography>
                                                        <MultiSelect
                                                            options={accessbranch?.filter(
                                                                (comp) =>
                                                                    weekoffpresentEdit.company === comp.company && selectedBranchEdit
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch)
                                                            )?.map(data => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedUnitEdit}
                                                            onChange={handleUnitChangeEdit}
                                                            valueRenderer={customValueRendererUnitEdit}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : ""
                                }
                                {["Individual"]?.includes(weekoffpresentEdit.filtertype) &&
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                                            <MultiSelect
                                                options={allUsersData?.filter(
                                                    (comp) =>
                                                        weekoffpresentEdit.company === comp.company && selectedBranchEdit?.map(data => data.value)?.includes(comp.branch) && selectedUnitEdit?.map(data => data.value)?.includes(comp.unit) && selectedTeamEdit?.map(data => data.value)?.includes(comp.team)
                                                )?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedEmpEdit}
                                                onChange={(e) => {
                                                    handleEmployeeChangeEdit(e);
                                                }}
                                                valueRenderer={customValueRendererEmpEdit}
                                                labelledBy="Please Select Employee"
                                            />
                                        </FormControl>
                                    </Grid>}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Shift Start Day<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresentEdit.shiftstartday, value: weekoffpresentEdit.shiftstartday }}
                                            onChange={handleStartDayChangeEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Shift End Day<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresentEdit.shiftendday, value: weekoffpresentEdit.shiftendday }}
                                            onChange={handleEndDayChangeEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Shift Day Total</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={weekoffpresentEdit.shiftdaytotal}
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
                                            value={{ label: weekoffpresentEdit.calstartday, value: weekoffpresentEdit.calstartday }}
                                            onChange={handleStartDayChangetwoEdit}
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
                                            value={{ label: weekoffpresentEdit.calendday, value: weekoffpresentEdit.calendday }}
                                            onChange={handleEndDayChangetwoEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Box sx={{ display: 'flex', marginTop: '25px' }}>
                                        <FormControlLabel
                                            control={<WeekoffSwitch defaultChecked checked={weekoffpresentEdit.enable} onClick={toggleNavbarEdit} />}
                                        />
                                        <Box sx={{ marginTop: '10px' }}>Include Weekoff Target</Box>
                                    </Box>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Weekoff Present Day<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: weekoffpresentEdit.weekoffpresentday, value: weekoffpresentEdit.weekoffpresentday }}
                                            onChange={(e) => {
                                                setWeekoffpresentEdit({
                                                    ...weekoffpresentEdit,
                                                    weekoffpresentday: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid><br /><br />
                            <Grid container spacing={1}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" fullWidth aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
                <Box sx={{ width: "850px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Weekoff Controlpanel</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            {/* <Grid item md={6} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Shift Status</Typography>
                                    <Typography>{weekoffpresentEdit.shiftstatus}</Typography>
                                </FormControl>
                            </Grid> */}
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
                                    <Typography>{weekoffpresentEdit.branch ? (weekoffpresentEdit.branch + ',') : ''}</Typography>
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
                                    <Typography>{weekoffpresentEdit.unit ? (weekoffpresentEdit.unit + ',') : ''}</Typography>
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
                                    <Typography>{weekoffpresentEdit.team ? (weekoffpresentEdit.team + ',') : ''}</Typography>
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
                                        {weekoffpresentEdit.employee ?
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
                                <Typography variant="h6">Include Weekoff Target</Typography>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                                    checked={weekoffpresentEdit.enable}
                                    value={weekoffpresentEdit.enable}
                                />
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
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog >
        </Box >
    );
}

export default WeekOffPresent;