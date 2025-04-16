import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../components/TableStyle";
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

function ShiftRoaster() {

    const gridRef = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess,isAssignBranch, } = useContext(UserRoleAccessContext);
    const [allShiftRoasters, setAllShiftRoasters] = useState([]);
    const [comparedUsers, setComparedUsers] = useState([]);
    const [allShiftRoastersEdit, setAllShiftRoastersEdit] = useState([]);
    const [shiftRoastersCheck, allShiftRoastersCheck] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [deleteShiftRoaster, setDeleteShiftRoaster] = useState("");
    const [excelData, setExcelData] = useState([]);
    const [items, setItems] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [companys, setCompanys] = useState([]);
    const [unitAdd, setUnitAdd] = useState([]);
    const [teamAdd, setTeamAdd] = useState([]);
    const [departmentAdd, setDepartmentAdd] = useState([]);
    const [branchsEdit, setBranchsEdit] = useState([]);
    const [companysEdit, setCompanysEdit] = useState([]);
    const [unitsEdit, setUnitsEdit] = useState([]);
    const [teamsEdit, setTeamEdit] = useState([]);
    const [departmentEdit, setDepartmentEdit] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    // Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => { setIsEditOpen(true); };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    let today = new Date();
    const [shiftRoasterAdd, setShiftRoasterAdd] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        department: "Please Select Department",
        shifttype: "This Week", fromdate: today, todate: ""
    });

    const [shiftRoasterEdit, setShiftRoasterEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        department: "Please Select Department",
        shifttype: "This Week", fromdate: "", todate: ""
    });

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Datatable Set Table
    const [pageSetTable, setPageSetTable] = useState(1);
    const [pageSizeSetTable, setPageSizeSetTable] = useState(10);
    const [searchQuerySetTable, setSearchQuerySetTable] = useState("");

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    // Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        if (selectedRows?.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

    // Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => { setIsDeleteOpencheckbox(true); };
    const handleCloseModcheckbox = () => { setIsDeleteOpencheckbox(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        fromdate: true,
        todate: true,
        actions: true,
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

    const shifttypeoptions = [
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "None", value: "None" },
    ];

    const [filter, setFilter] = useState({ weeks: "1st Week" })
    const filteroptions = [
        { label: "1st Week", value: "1st Week" },
        { label: "2nd Week", value: "2nd Week" },
        { label: "3rd Week", value: "3rd Week" },
        { label: "4th Week", value: "4th Week" },
        { label: "5th Week", value: "5th Week" },
    ];

    const fetchCompany = async () => {
        try {
            const companyall = isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              });

            setCompanys(companyall);
            setCompanysEdit(companyall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchBranch = async (e) => {
        try {
            const branchall = isAssignBranch?.filter(
                (comp) =>
                    e.value === comp.company
              )?.map(data => ({
                label: data.branch,
                value: data.branch,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setBranchs(branchall);
            setBranchsEdit(branchall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchUnit = async (e) => {
        try {
            const unitall = isAssignBranch?.filter(
                (comp) =>
                    e.value === comp.branch
              )?.map(data => ({
                label: data.unit,
                value: data.unit,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setUnitAdd(unitall);
            setUnitsEdit(unitall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchTeam = async (e) => {
        try {
            let res_teams = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_teams.data.teamsdetails.filter((d) => d.unit === e.value);
            const teamall = result.map((d) => ({
                ...d,
                label: d.teamname,
                value: d.teamname,
            }));
            setTeamAdd(teamall);
            setTeamEdit(teamall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchDepartment = async (e) => {
        try {
            let res_dep = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const all = res_dep.data.departmentdetails?.map((d) => ({
                ...d,
                label: d.deptname,
                value: d.deptname,
            }));

            setDepartmentAdd(all);
            setDepartmentEdit(all);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchDepartment()
    }, [])

    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const formattedFirstDay = formatDate(firstDayOfMonth);
        const formattedLastDay = formatDate(lastDayOfMonth);

        // Set min and max for the fromdate
        document.getElementById("myDateInput").min = formattedFirstDay;
        document.getElementById("myDateInput").max = formattedLastDay;

        // Set min and max for the todate
        document.getElementById("myDate").min = formattedFirstDay;
        document.getElementById("myDate").max = formattedLastDay;

        // Set initial values for fromdate and todate
        setShiftRoasterAdd({
            ...shiftRoasterAdd,
            fromdate: formattedFirstDay,
            todate: formattedLastDay,
        });
    }, []);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const calculateDateRange = () => {
            const today = new Date();

            const fromDate = new Date(shiftRoasterAdd.fromdate);

            if (isNaN(fromDate.getTime())) {
                return;
            }

            let formattedFromDate = "";

            if (shiftRoasterAdd.shifttype === "This Week") {
                // Calculate 7 days later from the selected fromdate
                const sevenDaysLater = new Date(fromDate);
                sevenDaysLater.setDate(fromDate.getDate() + 6);
                if (isNaN(sevenDaysLater.getTime())) {
                    return;
                }
                formattedFromDate = fromDate.toISOString().split("T")[0];
                const formattedSevenDaysLater = sevenDaysLater.toISOString().split("T")[0];

                setShiftRoasterAdd({
                    ...shiftRoasterAdd,
                    fromdate: formattedFromDate,
                    todate:
                        shiftRoasterAdd.shifttype === "This Week"
                            ? formattedSevenDaysLater
                            : "",
                });
            } else if (shiftRoasterAdd.shifttype === "This Month") {
                // Set the fromdate to the first day of the current month
                fromDate.setDate(1);
                // formattedFromDate = fromDate.toISOString().split("T")[0];
                formattedFromDate = formatDate(fromDate);

                // Set the todate to the last day of the current month
                const lastDayOfMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                );
                
                const formattedLastDayOfMonth = formatDate(lastDayOfMonth);

                setShiftRoasterAdd({
                    ...shiftRoasterAdd,
                    fromdate: formattedFromDate,
                    todate: formattedLastDayOfMonth,
                });
            }
            else if (shiftRoasterAdd.shifttype === "None") {

                setShiftRoasterAdd({
                    ...shiftRoasterAdd,
                    fromdate: "",
                    todate: "",
                });
            }

        };

        calculateDateRange();
    }, [shiftRoasterAdd.shifttype]);


    // add function
    const sendRequest = async () => {
        try {
            let subprojectscreate = await axios.post(SERVICE.SHIFTROASTER_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(shiftRoasterAdd.company),
                branch: String(shiftRoasterAdd.branch),
                unit: String(shiftRoasterAdd.unit),
                team: String(shiftRoasterAdd.team),
                department: String(shiftRoasterAdd.department),
                shifttype: String(shiftRoasterAdd.shifttype),
                fromdate: String(shiftRoasterAdd.fromdate),
                todate: String(shiftRoasterAdd.todate),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchShiftRoaster();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        let check = allShiftRoasters.some((data) => data.company == shiftRoasterAdd.company && data.branch == shiftRoasterAdd.branch &&
            data.unit == shiftRoasterAdd.unit && data.team == shiftRoasterAdd.team && data.department == shiftRoasterAdd.department &&
            data.shifttype == shiftRoasterAdd.shifttype && data.fromdate == shiftRoasterAdd.fromdate && data.todate == shiftRoasterAdd.todate)

        if (shiftRoasterAdd.company === "Please Select Company") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (shiftRoasterAdd.branch === "Please Select Branch") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (shiftRoasterAdd.unit === "Please Select Unit") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (shiftRoasterAdd.team === "Please Select Team") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (shiftRoasterAdd.department === "Please Select Department") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (check) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"The Company, Branch, Unit, Team, and Department group is already set for this dates!."}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setShiftRoasterAdd({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            department: "Please Select Department",
            shifttype: "This Week",
            fromdate: today
        });
        setTeamAdd([]);
        setBranchs([]);
        setUnitAdd([]);
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SHIFTROASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setShiftRoasterEdit(res?.data?.sshiftroaster);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SHIFTROASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setShiftRoasterEdit(res?.data?.sshiftroaster);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Project updateby edit page...
    let updateby = shiftRoasterEdit?.updatedby;
    let addedby = shiftRoasterEdit?.addedby;

    let roasterid = shiftRoasterEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.SHIFTROASTER_SINGLE}/${roasterid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(shiftRoasterEdit.company),
                branch: String(shiftRoasterEdit.branch),
                unit: String(shiftRoasterEdit.unit),
                team: String(shiftRoasterEdit.team),
                department: String(shiftRoasterEdit.department),
                fromdate: String(shiftRoasterEdit.fromdate),
                todate: String(shiftRoasterEdit.todate),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchShiftRoaster();
            await fetchLocationgroupingAll();
            handleCloseModEdit();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchLocationgroupingAll();

        const isNameMatch = allShiftRoastersEdit.some((item) => item.company === shiftRoasterEdit.company && item.branch === shiftRoasterEdit.branch && item.unit === shiftRoasterEdit.unit && item.floor === shiftRoasterEdit.floor && item.area === shiftRoasterEdit.area);
        if (shiftRoasterEdit.company === "Please Select Company") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (shiftRoasterEdit.branch === "Please Select Branch") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (shiftRoasterEdit.unit === "Please Select Unit") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (shiftRoasterEdit.team === "Please Select Team") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (shiftRoasterEdit.department === "Please Select Department") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
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
        } else {
            sendEditRequest();
        }
    };

    //get all ShifrRoasters
    const fetchShiftRoaster = async () => {
        try {
            let res_shiftroaster = await axios.get(SERVICE.SHIFTROASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllShiftRoasters(res_shiftroaster?.data?.shiftroasters);
            allShiftRoastersCheck(true);
        } catch (err) {allShiftRoastersCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchShiftRoaster();
    }, []);

    const getWeekOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const days = date.getDate() + firstDay.getDay() - 1;
        return Math.ceil(days / 7);
    };

    const renderDateColumns = (fromDate, toDate, shiftType, selectedWeek, empCode) => {

        const columns = [];
        let currentDate = new Date(fromDate);

        while (currentDate <= new Date(toDate)) {
            columns.push({
                date: currentDate.toISOString(),
                formattedDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
                dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                weekOfMonth: getWeekOfMonth(currentDate),
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        if (shiftType === 'This Month') {
            return columns.filter((column) => column.weekOfMonth === selectedWeek);
        }

        return columns;
    };

    const filteredColumnsSetTable = renderDateColumns(
        comparedUsers[0]?.fromdate,
        comparedUsers[0]?.todate,
        comparedUsers[0]?.shifttype,
        parseInt(filter.weeks[0], 10)
    );

    //get all Sub vendormasters.
    const fetchLocationgroupingAll = async () => {
        try {
            let res = await axios.get(SERVICE.SHIFTROASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllShiftRoastersEdit();
            allShiftRoastersCheck(true);
        } catch (err) {allShiftRoastersCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchLocationgroupingAll();
    }, [isEditOpen, shiftRoasterEdit]);

    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.SHIFTROASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteShiftRoaster(res?.data?.sshiftroaster);
            handleClickOpen();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let Locationgrpsid = deleteShiftRoaster?._id;
    const delLocationgrp = async (e) => {
        try {
            if (Locationgrpsid) {
                await axios.delete(`${SERVICE.SHIFTROASTER_SINGLE}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchShiftRoaster();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delLocationgrpcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SHIFTROASTER_SINGLE}/${item}`, {
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

            await fetchShiftRoaster();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Excel
    const fileName = "Shift Roaster";
    // get particular columns for export excel
    const getexcelDatas = () => {
        var data = allShiftRoasters?.map((t, index) => ({
            'Sno': index + 1,
            'Company': t.company,
            'Branch': t.branch,
            'Unit': t.unit,
            'Team': t.team,
            'Department': t.department,
            'From Date': t.fromdate,
            'To Date': t.todate
        }));
        setExcelData(data);
    };

    useEffect(() => {
        getexcelDatas();
    }, [shiftRoasterEdit, shiftRoasterAdd, allShiftRoasters]);

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Shift Roaster",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: "From Date", field: "fromdate" },
        { title: "To Date", field: "todate" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns?.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = allShiftRoasters?.map((item, index) => ({
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
        doc.save("Shift Roaster.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Shift Roaster.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const addSerialNumber = () => {
        const itemsWithSerialNumber = allShiftRoasters?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [allShiftRoasters]);

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

    // datatable....
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

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: { fontWeight: "bold", },
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
                        setSelectAllChecked(updatedSelectedRows?.length === filteredData?.length);
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
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "company", headerName: "Company", flex: 0, width: 120, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 120, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 100, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "todate", headerName: "To Date", flex: 0, width: 100, hide: !columnVisibility.todate, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("eshiftroaster") && (
                        <Link to={`/shiftroaster/${params.row.id}`}>
                            <Button variant="contained" color="primary" size="small" sx={{ fontSize: '12px', height: '25px', marginTop: '0px', marginRight: '5px' }} >
                                Set
                            </Button>
                        </Link>

                    )}
                    {isUserRoleCompare?.includes("dshiftroaster") && (
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ fontSize: '12px', height: '25px', marginTop: '0px', marginRight: '5px' }}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            fromdate: item.fromdate,
            todate: item.todate
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
                    {filteredColumns?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
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
            <Headtitle title={"SHIFT ROASTER"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Shift Roaster</Typography>
            {isUserRoleCompare?.includes("ashiftroaster") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Manage Shift Roaster</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={companys}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.company, value: shiftRoasterAdd.company }}
                                            onChange={(e) => {
                                                setShiftRoasterAdd({ ...shiftRoasterAdd, company: e.value, branch: "Please Select Branch", unit: "Please Select Unit", team: "Please Select Team", });
                                                fetchBranch(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={branchs}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.branch, value: shiftRoasterAdd.branch }}
                                            onChange={(e) => {
                                                setShiftRoasterAdd({ ...shiftRoasterAdd, branch: e.value, unit: "Please Select Unit", team: "Please Select Team", });
                                                fetchUnit(e);
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
                                            options={unitAdd}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.unit, value: shiftRoasterAdd.unit }}
                                            onChange={(e) => {
                                                setShiftRoasterAdd({ ...shiftRoasterAdd, unit: e.value, team: "Please Select Team", });
                                                fetchTeam(e);
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
                                            options={teamAdd}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.team, value: shiftRoasterAdd.team }}
                                            onChange={(e) => {
                                                setShiftRoasterAdd({ ...shiftRoasterAdd, team: e.value, });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Department<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={departmentAdd}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.department, value: shiftRoasterAdd.department }}
                                            onChange={(e) => {
                                                setShiftRoasterAdd({ ...shiftRoasterAdd, department: e.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Shift Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shifttypeoptions}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.shifttype, value: shiftRoasterAdd.shifttype }}
                                            
                                            onChange={(e) => {
                                                const today = new Date();

                                                // Parse the selected fromdate value to a Date object
                                                const fromDate = new Date(today);

                                                // Check if fromDate is a valid date
                                                if (isNaN(fromDate.getTime())) {
                                                    return;
                                                }

                                                let formattedFromDate = "";

                                                if (e.value === "This Week") {
                                                    // Calculate 7 days later from the selected fromdate
                                                    const sevenDaysLater = new Date(fromDate);
                                                    sevenDaysLater.setDate(fromDate.getDate() + 6);

                                                    // Check if sevenDaysLater is a valid date
                                                    if (isNaN(sevenDaysLater.getTime())) {
                                                        return;
                                                    }

                                                    // Format the dates to strings
                                                    formattedFromDate = fromDate.toISOString().split("T")[0];
                                                    const formattedSevenDaysLater = sevenDaysLater.toISOString().split("T")[0];

                                                    setShiftRoasterAdd({
                                                        ...shiftRoasterAdd,
                                                        shifttype: e.value,
                                                        fromdate: formattedFromDate,
                                                        todate:
                                                            e.value === "This Week"
                                                                ? formattedSevenDaysLater
                                                                : "",
                                                    });
                                                } else if (e.value === "This Month") {
                                                    // Set the fromdate to the first day of the current month
                                                    fromDate.setDate(1);
                                                    formattedFromDate = fromDate.toISOString().split("T")[0];

                                                    // Set the todate to the last day of the current month
                                                    const lastDayOfMonth = new Date(
                                                        today.getFullYear(),
                                                        today.getMonth() + 1,
                                                        0
                                                    );
                                                    const formattedLastDayOfMonth = lastDayOfMonth
                                                        .toISOString()
                                                        .split("T")[0];

                                                    setShiftRoasterAdd({
                                                        ...shiftRoasterAdd,
                                                        shifttype: e.value,
                                                        fromdate: formattedFromDate,
                                                        todate: formattedLastDayOfMonth,
                                                    });
                                                }
                                                else if (e.value === "None") {

                                                    setShiftRoasterAdd({
                                                        ...shiftRoasterAdd,
                                                        shifttype: e.value,
                                                        fromdate: "",
                                                        todate: "",
                                                    });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>From Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={shiftRoasterAdd.fromdate} onChange={(e) => {
                                            setShiftRoasterAdd({ ...shiftRoasterAdd, fromdate: e.target.value });
                                        }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>To Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDate" type="date" value={shiftRoasterAdd.todate} onChange={(e) => setShiftRoasterAdd({ ...shiftRoasterAdd, todate: e.target.value })} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
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
            {isUserRoleCompare?.includes("lshiftroaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Shift List</Typography>
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
                                        <MenuItem value={allShiftRoasters?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftroaster") && (
                                        <>
                                            <ExportXL csvData={excelData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftroaster") && (
                                        <>
                                            <ExportCSV csvData={excelData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftroaster") && (
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
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>  Manage Columns </Button> &ensp;
                        <Button variant="contained" color="error" onClick={handleClickOpenalert}> Bulk Delete  </Button> <br /> <br />
                        {!shiftRoastersCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden", }} >
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
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
                        )}
                    </Box><br />

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
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}> Cancel</Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delLocationgrp(Locationgrpsid)}>{" "} OK{" "}</Button>
                    </DialogActions>
                </Dialog>
                {/* this is info view details */}
                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Location Grouping Info</Typography> <br /> <br />
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
                            </Grid><br /> <br /><br />
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
                                <TableCell>SI.No</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>To Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {allShiftRoasters &&
                                allShiftRoasters?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.department}</TableCell>
                                        <TableCell>{row.fromdate}</TableCell>
                                        <TableCell>{row.todate}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
                <Box sx={{ width: "750px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Location Grouping</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{shiftRoasterEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{shiftRoasterEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{shiftRoasterEdit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{shiftRoasterEdit.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography>{shiftRoasterEdit.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">From Date</Typography>
                                    <Typography>{shiftRoasterEdit.fromdate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">To Date</Typography>
                                    <Typography>{shiftRoasterEdit.todate}</Typography>
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delLocationgrpcheckbox(e)}>
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
        </Box>
    );
}

export default ShiftRoaster;