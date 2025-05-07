

import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, RadioGroup, Radio, FormControlLabel, Checkbox, InputAdornment, ListItemText, Tooltip, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment-timezone";
import Selects from "react-select";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../../services/Baseservice";
import StyledDataGrid from "../../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { handleApiError } from "../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '../../../components/Pagination';
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";

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

function OverallTrainingForUserReport({ com }) {

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName,
        setPageName,
        buttonStyles, } =
        useContext(UserRoleAccessContext);
    //Datatable
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const {
        isAssignBranch,
        allTeam,
        allUsersData,
    } = useContext(UserRoleAccessContext);
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        'Training Status',
        'Training Date',
        'UserName',
        'Required',
        'Training Time',
        'Training Name',
        'Training Details',
        'Frequency',
        'Schedule',
        'Duration'
    ];
    let exportRowValues = [
        'taskstatus',
        'taskassigneddate',
        'username',
        'required',
        'tasktime',
        'trainingdetails',
        'taskdetails',
        'frequency',
        'schedule',
        'duration'
    ];

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const [filterUser, setFilterUser] = useState({
        fromdate: today,
        todate: today,
        day: "Today"
    });

    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
                break;
            default:
                return;
        }
    }
    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });

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

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];
    const taskStatusOptions = [
        { label: "Completed", value: "Completed" },
        { label: "Assigned", value: "Assigned" },
        { label: "Pending", value: "Pending" },
        { label: "Postponed", value: "Postponed" },
        { label: "Finished By Others", value: "Finished By Others" },
        { label: "Not Applicable to Me", value: "Not Applicable to Me" },
    ];
    //MULTISELECT ONCHANGE START
    //FILTER START
    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        setPageName(!pageName);
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
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
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };
    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };
    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);
    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };
    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);
    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };
    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    //auto select all dropdowns
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    const handleAutoSelect = async () => {
        setPageName(!pageName);
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => u.companyname);
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);

            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);


    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Training/Training Users Report"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.companyname),
                    date: String(new Date()),
                },
            ],
        });
    };

    const classes = useStyles();
    const [raiseTicketList, setRaiseTicketList] = useState([]);

    const [filterLoader, setFilterLoader] = useState(false);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);

    const [queueCheck, setQueueCheck] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [items, setItems] = useState([]);
    const [itemsOverallList, setItemsOverallList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
    let [valueWeekly, setValueWeekly] = useState("");    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const checkCurrentDate = new Date();

    // get current time
    const currentHours = checkCurrentDate.getHours();
    const currentMinutes = checkCurrentDate.getMinutes();

    // Determine whether it's AM or PM
    const currentperiod = currentHours >= 12 ? "PM" : "AM";


    // Format the current time manually
    const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes =
        currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
    const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;

    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
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
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };

    const backPage = useNavigate();
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
        taskstatus: true,
        username: true,
        taskassigneddate: true,
        date: true,
        checkbox: true,
        serialNumber: true,
        frequency: true,
        trainingdetails: true,
        schedule: true,
        tasktime: true,
        priority: true,
        duration: true,
        type: true,
        taskdetails: true,
        required: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    const convertTimeToAMPMFormat = (time) => {
        let [hour, minute] = time.split(':').map(Number);
        let timetype = 'AM';

        if (hour >= 12) {
            timetype = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }

        if (hour === 0) {
            hour = 12;
        }

        return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute} ${timetype}`;
    };



    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
    });



    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "taskstatus",
            headerName: "Training Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskstatus,
            pinned: "left",
            lockPinned: true,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.data?.taskstatus === "Assigned" ? "green" : params?.data?.taskstatus === "Pending" ? "red" : "blue" }}>{params?.data?.taskstatus}</Typography>
                </Grid>
            ),
        },
        {
            field: "taskassigneddate",
            headerName: "Training Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.taskassigneddate,
        },
        {
            field: "username",
            headerName: "User Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.username,
        },
        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 150,
            hide: !columnVisibility.required,
        },
        {
            field: "tasktime",
            headerName: "Training Time",
            flex: 0,
            width: 100,
            hide: !columnVisibility.tasktime,
        },
        {
            field: "trainingdetails",
            headerName: "Training Name",
            flex: 0,
            width: 100,
            hide: !columnVisibility.trainingdetails,
        },
        {
            field: "taskdetails",
            headerName: "Training Details",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskdetails,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.data?.taskdetails === "schedule" ? "green" : "blue" }}>{params?.data?.taskdetails}</Typography>
                </Grid>
            ),
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 100,
            hide: !columnVisibility.frequency,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.data.frequency === "Daily" ? "red" :
                                params.data.frequency === "Date Wise" ? "green" :
                                    params.data.frequency === "Monthly" ? "blue" :
                                        params.data.frequency === "Annually" ? 'Orange' :
                                            params.data.frequency === "Day Wise" ? "palevioletred" : 'violet'
                        }}>{params.data.frequency}</Typography>
                    </Grid>

                </Grid>

            ),
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 100,
            hide: !columnVisibility.schedule,
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 100,
            hide: !columnVisibility.duration,
        },

    ];


    // Function to remove HTML tags and convert to numbered list
    const convertToNumberedList = (htmlContent) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;

        const listItems = Array.from(tempElement.querySelectorAll("li"));
        listItems.forEach((li, index) => {
            li.innerHTML = `\u2022 ${li.innerHTML}\n`;
        });

        return tempElement.innerText;
    };

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item?._id,
            serialNumber: item?.serialNumber,
            taskstatus: item?.taskstatus,
            taskassigneddate: item?.taskassigneddate,
            username: item?.username,
            taskdetails: item?.taskdetails,
            trainingdetails: item.trainingdetails,
            priority: item.priority,
            tasktime: item?.tasktime,
            schedule: item?.schedule,
            duration: item?.duration,
            frequency: item?.frequency,
            required: item?.required,
            breakup: item?.breakup,
            description: item?.description,
        };
    });

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User Training Panel-Overall Reports",
        pageStyle: "print",
    });

    const columns = [
        { title: "Training Status", field: "taskstatus" },
        { title: "Training Date", field: "taskassigneddate" },
        { title: "UserName", field: "username" },
        { title: "Required", field: 'required' },
        { title: "Training Time", field: "tasktime" },
        { title: "Training Name", field: "trainingdetails" },
        { title: "Training Details", field: "taskdetails" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Duration", field: "duration" },
    ];



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
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Training User Reports.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

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
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const [copiedData, setCopiedData] = useState("");

    const ListPageLoadDataOnprogress = async () => {
        setPageName(!pageName);
        const Value = valueWeekly?.length > 0 ? valueWeekly : [];
        const ValueCompany = valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany;
        const ValueBranch = valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch;
        const ValueUnit = valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit;
        const ValueTeam = valueTeamCat?.length > 0 ? valueTeamCat : [];
        const ValueDepartment = valueDepartmentCat?.length > 0 ? valueDepartmentCat : [];
        const ValueEmployee = valueEmployeeCat?.length > 0 ? valueEmployeeCat : [];
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            // required: valueWeekly,
            taskstatus: Value,
            company: ValueCompany,
            branch: ValueBranch,
            unit: ValueUnit,
            team: ValueTeam,
            username: ValueEmployee,
            department: ValueDepartment,
            fromdate: valueCompanyCat?.length > 0 ? filterUser?.fromdate : "",
            todate: valueCompanyCat?.length > 0 ? filterUser?.todate : "",
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }
        try {
            setQueueCheck(false);
            let res_task = await axios.post(SERVICE.ALL_TRAINIGFORUSER_OVERALL_REPORTS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_task?.data?.trainingforuser?.length > 0 ? res_task?.data?.trainingforuser : []
            const overallList = res_task?.data?.overallList?.length > 0 ? res_task?.data?.overallList : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails !== "Mandatory" ? "" :
                    item.schedule === "Any Time" ? "" :
                        `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            }));

            setRaiseTicketList(itemsWithSerialNumber);
            setQueueCheck(true);
            setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            const itemsOverall = overallList?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                tasktime: item?.taskdetails !== "Mandatory" ? "" :
                    item.schedule === "Any Time" ? "" :
                        `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            }));
            setItemsOverallList(itemsOverall)
        } catch (err) { setQueueCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }



    const handleResetSearch = async (data) => {
        // const Value = valueWeekly;
        // Reset all filters and pagination state
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);
        const Value = valueWeekly?.length > 0 ? valueWeekly : [];
        const ValueCompany = valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany;
        const ValueBranch = valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch;
        const ValueUnit = valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit;
        const ValueTeam = valueTeamCat?.length > 0 ? valueTeamCat : [];
        const ValueDepartment = valueDepartmentCat?.length > 0 ? valueDepartmentCat : [];
        const ValueEmployee = valueEmployeeCat?.length > 0 ? valueEmployeeCat : [];

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            // required: Value,
            taskstatus: Value,
            company: ValueCompany,
            branch: ValueBranch,
            unit: ValueUnit,
            team: ValueTeam,
            username: ValueEmployee,
            department: ValueDepartment,
            fromdate: valueCompanyCat?.length > 0 ? filterUser?.fromdate : "",
            todate: valueCompanyCat?.length > 0 ? filterUser?.todate : "",
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        try {
            let res_task = await axios.post(SERVICE.ALL_TRAINIGFORUSER_OVERALL_REPORTS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_task?.data?.trainingforuser?.length > 0 ? res_task?.data?.trainingforuser : []
            const overallList = res_task?.data?.overallList?.length > 0 ? res_task?.data?.overallList : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails !== "Mandatory" ? "" : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            }));

            setRaiseTicketList(itemsWithSerialNumber);
            setQueueCheck(true);
            setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            const itemsOverall = overallList?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                tasktime: item?.taskdetails !== "Mandatory" ? "" : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            }));
            setItemsOverallList(itemsOverall)
            setFilteredChanges(null);
            setItems(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            // Trigger a table refresh if necessary
            setPageName((prev) => !prev); // Force re-render
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };
    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };


    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");



    //serial no for listing items
    const addSerialNumber = (datas) => {
        setItems(datas);
    };


    useEffect(() => {
        addSerialNumber(raiseTicketList);
    }, [raiseTicketList]);


    const handleSubmit = () => {
        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (valueWeekly?.length < 1) {
            setPopupContentMalert('Please Select Status');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.day === "Custom Fields" && filterUser.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (filterUser.day === "Custom Fields" && filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSearchQuery("")
            ListPageLoadDataOnprogress();
        }
    }

    useEffect(() => {
        ListPageLoadDataOnprogress()
    }, [page, pageSize, searchQuery])




    const handleWeeklyChange = (options) => {
        setValueWeekly(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedWeeklyOptions(options);
        setItemsOverallList([])
        setRaiseTicketList([])
    };

    const customValueRendererCate = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Required";
    };


    const handleClear = () => {
        setValueWeekly([])
        setSearchQuery("")
        setSelectedWeeklyOptions([])
        setRaiseTicketList([])
        setItems([])
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setFilterUser({
            fromdate: today,
            todate: today,
            day: "Today"
        });
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setTotalProjects(0)
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
        setItemsOverallList([])
    }


    return (
        <Box>
            <Headtitle title={"USER TRAINING PANEL - OVERALL REPORTS"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="User Training Panel - Overall Reports"
                modulename="Training"
                submodulename="Training Users Report"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <br />
            <br />

            <Box sx={userStyle.dialogbox}>
                <>
                    <Typography sx={userStyle.SubHeaderText}>User Training Panel - Overall Reports</Typography>
                    <br />
                    <br />
                    <br />
                    {isUserRoleCompare?.includes("loveralltrainingusersreport") && (
                        <>
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={TypeOptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: filterState.type ?? "Please Select Type",
                                                    value: filterState.type ?? "Please Select Type",
                                                }}
                                                onChange={(e) => {
                                                    setFilterState((prev) => ({
                                                        ...prev,
                                                        type: e.value,
                                                    }));
                                                    setValueCompanyCat([]);
                                                    setSelectedOptionsCompany([]);
                                                    setValueBranchCat([]);
                                                    setSelectedOptionsBranch([]);
                                                    setValueUnitCat([]);
                                                    setSelectedOptionsUnit([]);
                                                    setValueTeamCat([]);
                                                    setSelectedOptionsTeam([]);
                                                    setValueDepartmentCat([]);
                                                    setSelectedOptionsDepartment([]);
                                                    setValueEmployeeCat([]);
                                                    setSelectedOptionsEmployee([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl size="small" fullWidth>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.map((data) => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label &&
                                                                    i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsCompany}
                                                onChange={(e) => {
                                                    handleCompanyChange(e);
                                                }}
                                                valueRenderer={customValueRendererCompany}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    {["Individual", "Team"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Branch Unit Team */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    valueCompanyCat?.includes(comp.company) &&
                                                                    valueBranchCat?.includes(comp.branch)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsUnit}
                                                        onChange={(e) => {
                                                            handleUnitChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnit}
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
                                                        options={allTeam
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCat?.includes(u.company) &&
                                                                    valueBranchCat?.includes(u.branch) &&
                                                                    valueUnitCat?.includes(u.unit)
                                                            )
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.teamname,
                                                                value: u.teamname,
                                                            }))}
                                                        value={selectedOptionsTeam}
                                                        onChange={(e) => {
                                                            handleTeamChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererTeam}
                                                        labelledBy="Please Select Team"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Department"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Department */}
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOptions}
                                                        value={selectedOptionsDepartment}
                                                        onChange={(e) => {
                                                            handleDepartmentChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Branch"]?.includes(filterState.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Unit"]?.includes(filterState.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Unit <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    valueCompanyCat?.includes(comp.company) &&
                                                                    valueBranchCat?.includes(comp.branch)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsUnit}
                                                        onChange={(e) => {
                                                            handleUnitChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {["Individual"]?.includes(filterState.type) && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allUsersData
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team) &&
                                                                u.workmode !== "Internship"
                                                        )
                                                        .map((u) => ({
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsEmployee}
                                                    onChange={(e) => {
                                                        handleEmployeeChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererEmployee}
                                                    labelledBy="Please Select Employee"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>Status<b style={{ color: "red", gap: "15px" }}>*</b></Typography>
                                        <FormControl fullWidth size="small">
                                            <MultiSelect size="small"
                                                options={taskStatusOptions}
                                                value={selectedWeeklyOptions}
                                                onChange={handleWeeklyChange}
                                                valueRenderer={customValueRendererCate}
                                                labelledBy="Please Select Status"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Days
                                            </Typography>
                                            <Selects
                                                options={daysoptions}
                                                // styles={colourStyles}
                                                value={{ label: filterUser.day, value: filterUser.day }}
                                                onChange={(e) => {
                                                    handleChangeFilterDate(e);
                                                    setFilterUser((prev) => ({ ...prev, day: e.value }))
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {" "}
                                                From Date
                                            </Typography>
                                            <OutlinedInput
                                                id="from-date"
                                                type="date"
                                                disabled={filterUser.day !== "Custom Fields"}
                                                value={filterUser.fromdate}
                                                onChange={(e) => {
                                                    const newFromDate = e.target.value;
                                                    setFilterUser((prevState) => ({
                                                        ...prevState,
                                                        fromdate: newFromDate,
                                                        todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                To Date
                                            </Typography>
                                            <OutlinedInput
                                                id="to-date"
                                                type="date"
                                                value={filterUser.todate}
                                                disabled={filterUser.day !== "Custom Fields"}
                                                onChange={(e) => {
                                                    const selectedToDate = new Date(e.target.value);
                                                    const selectedFromDate = new Date(filterUser.fromdate);
                                                    const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                                    if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                        setFilterUser({
                                                            ...filterUser,
                                                            todate: e.target.value
                                                        });
                                                    } else {
                                                        setFilterUser({
                                                            ...filterUser,
                                                            todate: "" // Reset to empty string if the condition fails
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6} mt={3}>
                                        <div style={{ display: "flex", gap: "20px" }}>
                                            <LoadingButton
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSubmit}
                                                loading={filterLoader}
                                                sx={buttonStyles.buttonsubmit}
                                            >
                                                Filter
                                            </LoadingButton>

                                            <Button
                                                sx={buttonStyles.btncancel}
                                                onClick={handleClear}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </Grid>
                                    {/* <Grid item md={3} sm={12} xs={12}>

                                        <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                            <Button variant="contained"
                                                onClick={() => { handleSubmit() }}
                                                sx={buttonStyles.buttonsubmit}
                                            >
                                                {" "}
                                                Filter
                                            </Button>
                                            <Button
                                                onClick={() => { handleClear() }}
                                                sx={buttonStyles.btncancel}
                                            >
                                                {" "}
                                                CLEAR
                                            </Button>
                                        </Grid>
                                    </Grid> */}
                                </>
                            </Grid>
                        </>
                    )}
                    <br />
                    <br />
                    {isUserRoleCompare?.includes("loveralltrainingusersreport") && (
                        <>

                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <br></br>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
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
                                        <MenuItem value={itemsOverallList?.length}>All</MenuItem>
                                    </Select>
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
                                    {isUserRoleCompare?.includes("exceloveralltrainingusersreport") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvoveralltrainingusersreport") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printoveralltrainingusersreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfoveralltrainingusersreport") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageoveralltrainingusersreport") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Grid>
                                {/* <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={raiseTicketList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={true}
                                        totalDatas={itemsOverallList}
                                    />
                                </Grid> */}

                                <Grid item md={2} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput size="small"
                                            id="outlined-adornment-weight"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <FaSearch />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    {advancedFilter && (
                                                        <IconButton onClick={handleResetSearch}>
                                                            <MdClose />
                                                        </IconButton>
                                                    )}
                                                    <Tooltip title="Show search options">
                                                        <span>
                                                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                                        </span>
                                                    </Tooltip>
                                                </InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{ 'aria-label': 'weight', }}
                                            type="text"
                                            value={getSearchDisplay()}
                                            onChange={handleSearchChange}
                                            placeholder="Type to search..."
                                            disabled={!!advancedFilter}
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>{" "}
                            &emsp;
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >

                                {!queueCheck ? (
                                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                ) : (
                                    <AggridTableForPaginationTable
                                        rowDataTable={rowDataTable}
                                        columnDataTable={columnDataTable}
                                        columnVisibility={columnVisibility}
                                        page={page}
                                        setPage={setPage}
                                        pageSize={pageSize}
                                        totalPages={totalPages}
                                        setColumnVisibility={setColumnVisibility}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRefTable}
                                        filteredDatas={filteredDatas}
                                        totalDatas={totalProjects}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={itemsOverallList}

                                    />
                                )}
                            </Box>



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
                        </>
                    )}
                </>
            </Box>
            {/* )} */}

            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={itemsOverallList ?? []}
                filename={"User Training Panel-Reports"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* Search Bar */}
            <Popover
                id={idSearch}
                open={openSearch}
                anchorEl={anchorElSearch}
                onClose={handleCloseSearch}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <Box style={{ padding: "10px", maxWidth: '450px' }}>
                    <Typography variant="h6">Advance Search</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseSearch}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ width: "100%" }}>
                        <Box sx={{
                            width: '350px',
                            maxHeight: '400px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <Box sx={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                // paddingRight: '5px'
                            }}>
                                <Grid container spacing={1}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Columns</Typography>
                                        <Select fullWidth size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedColumn}
                                            onChange={(e) => setSelectedColumn(e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Select Column</MenuItem>
                                            {filteredSelectedColumn.map((col) => (
                                                <MenuItem key={col.field} value={col.field}>
                                                    {col.headerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Operator</Typography>
                                        <Select fullWidth size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedCondition}
                                            onChange={(e) => setSelectedCondition(e.target.value)}
                                            disabled={!selectedColumn}
                                        >
                                            {conditions.map((condition) => (
                                                <MenuItem key={condition} value={condition}>
                                                    {condition}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Value</Typography>
                                        <TextField fullWidth size="small"
                                            value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                            placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                            sx={{
                                                '& .MuiOutlinedInput-root.Mui-disabled': {
                                                    backgroundColor: 'rgb(0 0 0 / 26%)',
                                                },
                                                '& .MuiOutlinedInput-input.Mui-disabled': {
                                                    cursor: 'not-allowed',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    {additionalFilters.length > 0 && (
                                        <>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <RadioGroup
                                                    row
                                                    value={logicOperator}
                                                    onChange={(e) => setLogicOperator(e.target.value)}
                                                >
                                                    <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                    <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                </RadioGroup>
                                            </Grid>
                                        </>
                                    )}
                                    {additionalFilters.length === 0 && (
                                        <Grid item md={4} sm={12} xs={12} >
                                            <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                Add Filter
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item md={2} sm={12} xs={12}>
                                        <Button variant="contained" onClick={() => {
                                            ListPageLoadDataOnprogress();
                                            setIsSearchActive(true);
                                            setAdvancedFilter([
                                                ...additionalFilters,
                                                { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                            ])
                                        }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
            </Popover>


        </Box>
    );
}

export default OverallTrainingForUserReport;