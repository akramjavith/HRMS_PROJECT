import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function TaskNonScheduleGrouping() {
    const gridRef = useRef(null);

    const { isUserRoleCompare, isAssignBranch, isUserRoleAccess, pageName, allTeam,
        setPageName,
        alldesignation,
        allUsersData,
        buttonStyles, } = useContext(
            UserRoleAccessContext
        );
    const [processValues, setProcessValues] = useState([]);
    const [processOptions, setProcessOptions] = useState([]);
    const [processOptionsEdit, setProcessOptionsEdit] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        //   setSubmitLoader(false);
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


    // AssignBranch For Users
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
            branchaddress: data?.branchaddress,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
                branchaddress: data?.branchaddress
            }));




    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    let exportColumnNames = [
        'Category', 'SubCategory',
        'Schedule', 'Priority',
        'Type', 'Designation',
        'Department', 'Company',
        'Branch', 'Unit',
        'Team', 'Process', 'Employee Names',
        'Date', 'Time',
        'Duration', 'Breakup Count',
        'Breakup', 'Required'
    ];
    let exportRowValues = [
        'category', 'subcategory',
        'schedule', 'priority',
        'type', 'designation',
        'department', 'company',
        'branch', 'unit',
        'team', 'process', 'employeenames',
        'date', 'time',
        'duration', 'breakupcount',
        'breakup', 'required'
    ];
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
            pagename: String("Task/Task Non-Schedule Grouping"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };


    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [taskGrouping, setTaskGrouping] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        date: "",
        breakupcount: "1",
        duration: "00:10",
        type: "Please Select Type",
        frequency: "Please Select Schedule",
        priority: "Please Select Priority",
    });
    const [taskGroupingEdit, setTaskGroupingEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        schedule: "Please Select Schedule",
        frequency: "Please Select Schedule",
        duration: "00:10",
        breakupcount: "1",
        hour: "",
        min: "",
        timetype: "",
        monthdate: "",
        date: "",
        annumonth: "",
        annuday: ""
    });

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        // { label: "VPN Type", value: "VPN Type" },
        { label: "Process", value: "Process" },
        // { label: "Shift", value: "Shift" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
    ];
    const [btnLoad, setBtnLoad] = useState(false)
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
    const [taskGroupingArray, setTaskGroupingArray] = useState([]);
    const [taskGroupingArrayEdit, setTaskGroupingArrayEdit] = useState([]);
    const [taskGroupingLogEdit, setTaskGroupingLogEdit] = useState([]);

    const [categoryOption, setCategoryOption] = useState([]);
    const [subCategoryOption, setSubCategoryOption] = useState([]);
    const [filteredSubCategory, setFilteredSubCategory] = useState([]);
    const [filteredSubCategoryEdit, setFilteredSubCategoryEdit] = useState([]);


    const [addReqTodo, setAddReqTodo] = useState([]);

    const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
    const [addReqTodoEdit, setAddReqTodoEdit] = useState([]);
    const [isTodoEditPage, setIsTodoEditPage] = useState(
        Array(addReqTodoEdit.length).fill(false)
    );

    const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);
    const [selectedWeeklyOptionsEdit, setSelectedWeeklyOptionsEdit] = useState([]);

    let [valueWeekly, setValueWeekly] = useState("");
    let [valueWeeklyEdit, setValueWeeklyEdit] = useState("");

    const [hourTodo, setHourTodo] = useState([]);
    const [minutesTodo, setMinutesTodo] = useState([]);
    const [timeTypeTodo, setTimeTypeTodo] = useState([]);
    const [hourTodoEdit, setHourTodoEdit] = useState([]);
    const [minutesTodoEdit, setMinutesTodoEdit] = useState([]);
    const [timeTypeTodoEdit, setTimeTypeTodoEdit] = useState([]);

    const handleUpdateTodocheck = () => {
        const newTodoscheck = [...addReqTodo];
        newTodoscheck[editingIndexcheck].hour = hourTodo;
        newTodoscheck[editingIndexcheck].min = minutesTodo;
        newTodoscheck[editingIndexcheck].timetype = timeTypeTodo;

        setAddReqTodo(newTodoscheck);
        setEditingIndexcheck(-1);

    };
    const handleEditTodocheck = (index) => {
        setEditingIndexcheck(index);
        setHourTodo(addReqTodo[index].hour);
        setMinutesTodo(addReqTodo[index].min);
        setTimeTypeTodo(addReqTodo[index].timetype);
    };


    const handleUpdateTodocheckEdit = () => {
        const newTodoscheck = [...addReqTodoEdit];
        newTodoscheck[editingIndexcheckEdit].hour = hourTodoEdit;
        newTodoscheck[editingIndexcheckEdit].min = minutesTodoEdit;
        newTodoscheck[editingIndexcheckEdit].timetype = timeTypeTodoEdit;

        setAddReqTodoEdit(newTodoscheck);
        setEditingIndexcheckEdit(-1);


    };
    const handleEditTodocheckEdit = (index) => {
        setEditingIndexcheckEdit(index);
        setHourTodoEdit(addReqTodoEdit[index].hour);
        setMinutesTodoEdit(addReqTodoEdit[index].min);
        setTimeTypeTodoEdit(addReqTodoEdit[index].timetype);
    };

    const [frequencyOption, setFrequencyOption] = useState([
        { label: "Daily", value: "Daily" },
        { label: "Day Wise", value: "Day Wise" },
        { label: "Date Wise", value: "Date Wise" },
        { label: "Weekly", value: "Weekly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Annually", value: "Annually" }

    ]);
    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("10");
    const [hoursEdit, setHoursEdit] = useState("00");
    const [minutesEdit, setMinutesEdit] = useState("10");

    const [breakuphrsOption, setbreakupHrsOption] = useState([]);
    const [breakupminsOption, setbreakupMinsOption] = useState([]);
    const [breakuphours, setbreakupHours] = useState("10");
    const [breakuphoursEdit, setbreakupHoursEdit] = useState("10");
    const [breakupminutes, setbreakupMinutes] = useState("Mins");

    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [openReassign, setOpenReassign] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTaskGrouping, setDeleteTaskGrouping] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [taskGroupingData, setTaskGroupingData] = useState([]);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        category: true,
        subcategory: true,
        duration: true,
        breakup: true,
        breakupcount: true,
        required: true,
        schedule: true,
        priority: true,
        actions: true,
        designation: true,
        process: true,
        department: true,
        branch: true,
        company: true,
        unit: true,
        team: true,
        date: true,
        time: true,
        employeenames: true,
        type: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
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


    //useEffect
    useEffect(() => {
        addSerialNumber(taskGroupingArray);
    }, [taskGroupingArray]);


    useEffect(() => {
        fetchTaskGroupingAll();
    }, [isEditOpen]);


    useEffect(() => {
        fetchTaskGrouping();
    }, []);

    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
        // fetchFrequency();
        generateHrsOptions();
        generateMinsOptions();
    }, []);
    useEffect(() => {
        const filteredSubCategory = subCategoryOption?.filter(u =>
            u.category === taskGrouping.category).map(u => (
                {
                    ...u,
                    label: u.subcategoryname,
                    value: u.subcategoryname
                }
            ))

        setFilteredSubCategory(filteredSubCategory);
    }, [taskGrouping.category]);

    useEffect(() => {
        const filteredSubCategoryedit = subCategoryOption?.filter(ue =>
            ue.category === taskGroupingEdit.category
        ).map(ue => (
            {
                ...ue,
                label: ue.subcategoryname,
                value: ue.subcategoryname
            }
        ))

        setFilteredSubCategoryEdit(filteredSubCategoryedit);
    }, [taskGroupingEdit.category]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const scheduleOption = [{ label: "Fixed", value: "Fixed" }, { label: "Any Time", value: "Any Time" }]
    const requiredOption = [{ label: "Photo", value: "Photo" }, { label: "Documents", value: "Documents" }, { label: "Screenshot", value: "Screenshot" }, { label: "Email", value: "Email" }]
    // sevendays
    const weekdays = [
        { label: "Sunday", value: "Sunday" },
        { label: "Monday", value: "Monday" },
        { label: "Tuesday", value: "Tuesday" },
        { label: "Wednesday", value: "Wednesday" },
        { label: "Thursday", value: "Thursday" },
        { label: "Friday", value: "Friday" },
        { label: "Saturday", value: "Saturday" },

    ];
    const [selectedRequiredOptionsCate, setSelectedRequiredOptionsCate] = useState([]);
    const [requiredValueCate, setRequiredValueCate] = useState("");
    const [selectedRequiredOptionsCateEdit, setSelectedRequiredOptionsCateEdit] = useState([]);
    const [requiredValueCateEdit, setRequiredValueCateEdit] = useState("");
    const handleRequiredChange = (options) => {
        setRequiredValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedRequiredOptionsCate(options);
    };
    const customValueRendererRequired = (requiredValueCate, _employeename) => {
        return requiredValueCate.length ? requiredValueCate.map(({ label }) => label).join(", ") : "Please Select Required";
    };
    const handleRequiredChangeEdit = (options) => {
        setRequiredValueCateEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedRequiredOptionsCateEdit(options);

    };
    const customValueRendererRequiredEdit = (requiredValueCateEdit, _employeename) => {
        return requiredValueCateEdit.length ? requiredValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Required";
    };

    const [concReqs, setConcReqs] = useState("");
    const concordinateParticipants = (fileshare) => {
        const require = fileshare.required;
        const concatenatedDepts = require.join(",");
        setConcReqs(concatenatedDepts);
    };

    //function to generate hrs
    const generateHrsOptions = () => {
        const hrsOpt = [];
        for (let i = 0; i <= 23; i++) {
            if (i < 10) {
                i = "0" + i;
            }
            hrsOpt.push({ value: i.toString(), label: i.toString() });
        }
        setHrsOption(hrsOpt);
        setbreakupHrsOption(hrsOpt);
    };
    //function to generate mins
    const generateMinsOptions = () => {
        const minsOpt = [];
        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                i = "0" + i;
            }
            minsOpt.push({ value: i.toString(), label: i.toString() });
        }
        setMinsOption(minsOpt);
        setbreakupMinsOption(minsOpt);
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnLoad(false)
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    // Reassign model
    const handleClickOpenReassign = () => {
        setOpenReassign(true);
    };
    const handleCloseReassign = () => {
        setOpenReassign(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true)
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    let [valueDesignation, setValueDesignation] = useState([]);
    let [valueDesignationEdit, setValueDesignationEdit] = useState([]);
    const [selectedDesignationOptions, setSelectedDesignationOptions] = useState([]);
    const [selectedOptionsProcess, setSelectedOptionsProcess] = useState([]);
    let [valueProcessCat, setValueProcessCat] = useState([]);
    const [selectedOptionsProcessEdit, setSelectedOptionsProcessEdit] = useState([]);
    let [valueProcessCatEdit, setValueProcessCatEdit] = useState([]);

    const [selectedDesignationOptionsEdit, setSelectedDesignationOptionsEdit] = useState([]);
    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);
    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);

    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
    const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
    let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);
    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);
    //unit multiselect
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);
    let [valueEmployee, setValueEmployee] = useState([]);
    const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState([]);
    let [valueEmployeeEdit, setValueEmployeeEdit] = useState([]);
    const [selectedEmployeeOptionsEdit, setSelectedEmployeeOptionsEdit] = useState([]);
    const [employeesNames, setEmployeesNames] = useState([]);
    const [employeesNamesEdit, setEmployeesNamesEdit] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [department, setDepartment] = useState([]);
    let [valueDepartment, setValueDepartment] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState([]);
    let [valueDepartmentEdit, setValueDepartmentEdit] = useState([]);
    const [selectedDepartmentOptionsEdit, setSelectedDepartmentOptionsEdit] = useState([]);

    const fetchCategory = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.TASKCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.taskcategorys.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                })),
            ];

            setCategoryOption(categoryall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchSubCategory = async () => {
        setPageName(!pageName);
        try {
            let res_subcategory = await axios.get(SERVICE.TASKSUBCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSubCategoryOption(res_subcategory?.data?.tasksubcategorys);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchDesignation = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.DESIGNATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.designation.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setDesignation(categoryall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchDepartments = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.departmentdetails.map((d) => ({
                    ...d,
                    label: d.deptname,
                    value: d.deptname,
                })),
            ];

            setDepartmentOptions(categoryall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchProcess = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setProcessValues(res_freq?.data?.processteam);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    useEffect(() => { fetchProcess(); }, [])

    const filterProcess = (teamArray) => {
        let result = processValues.filter(
            (d) =>
                valueCompanyCat?.includes(d.company) &&
                valueBranchCat?.includes(d.branch) &&
                valueUnitCat?.includes(d.unit) &&
                teamArray?.includes(d.team)
        );

        const uniqueProcesses = [...new Set(result.map(d => d.process))];

        const processall = uniqueProcesses.map(process => ({
            label: process,
            value: process,
        }));


        setProcessOptions(processall);
    }
    const filterProcessEdit = (valueCompanyEdit, valueBranchEdit, valueUnitEdit, teamArrayEdit) => {
        let result = processValues.filter(
            (d) =>
                valueCompanyEdit?.includes(d.company) &&
                valueBranchEdit?.includes(d.branch) &&
                valueUnitEdit?.includes(d.unit) &&
                teamArrayEdit?.includes(d.team)
        );

        const processall = result.map((d) => ({
            label: d.process,
            value: d.process,
        }));

        setProcessOptionsEdit(processall);
    }

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        if (taskGrouping?.type === "Company") {
            fetchEmployeeOptions(options, "Company")
        } else {
            setEmployeesNames([])
        }
        setSelectedOptionsCompany(options);
        // fetchBranchAll(options)
        setSelectedOptionsBranch([])
        setValueBranchCat([])
        setSelectedOptionsUnit([])
        setValueUnitCat([])
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        // setUnitOption([])
        // setTeamOption([])
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        setValueEmployee([])
        setProcessOptions([])
        setSelectedEmployeeOptions([])
        setValueEmployee([])
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };




    const handleCompanyChangeEdit = (options) => {
        setValueCompanyCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        const value = options.map((a, index) => {
            return a.value;
        })
        setSelectedOptionsCompanyEdit(options);
        setSelectedOptionsBranchEdit([])
        setValueBranchCatEdit([])
        setSelectedOptionsUnitEdit([])
        setValueUnitCatEdit([])
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])

        setEmployeesNamesEdit([])

        setSelectedDepartmentOptionsEdit([])
        setValueDepartmentEdit([])
        setSelectedDesignationOptionsEdit([])
        setValueDesignationEdit([])

        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])

        if (taskGroupingEdit?.type === "Company") {
            fetchEmployeeOptionsEdit(value, valueBranchCatEdit, valueUnitCatEdit, valueTeamCatEdit, valueDepartmentEdit, valueDesignationEdit, valueProcessCatEdit, "Company")
        }
        else {
            setEmployeesNamesEdit([])
        }
    };

    const customValueRendererCompanyEdit = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };



    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        // fetchUnitAll(options)
        setSelectedOptionsBranch(options);
        setSelectedOptionsUnit([])
        setValueUnitCat([])
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        // setTeamOption([])
        setSelectedEmployeeOptions([])
        setValueEmployee([]);
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        setProcessOptions([])


        if (taskGrouping?.type === "Branch") {
            fetchEmployeeOptions(options, "Branch")
        } else {
            setEmployeesNames([])
        }
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };



    const handleBranchChangeEdit = (options) => {
        setValueBranchCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        const value = options.map((a, index) => {
            return a.value;
        })
        setSelectedOptionsBranchEdit(options);
        setSelectedOptionsUnitEdit([])
        setValueUnitCatEdit([])
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setEmployeesNamesEdit([])
        setSelectedDepartmentOptionsEdit([])
        setValueDepartmentEdit([])
        setSelectedDesignationOptionsEdit([])
        setValueDesignationEdit([])
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])

        if (taskGroupingEdit?.type === "Branch") {
            fetchEmployeeOptionsEdit(valueCompanyCatEdit, value, valueUnitCatEdit, valueTeamCatEdit, valueDepartmentEdit, valueDesignationEdit, valueProcessCatEdit, "Branch")
        } else {
            setEmployeesNamesEdit([])
        }
    };

    const customValueRendererBranchEdit = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };



    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        // fetchTeamAll(options)
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        setSelectedEmployeeOptions([])
        setValueEmployee([])
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        setProcessOptions([])

        if (taskGrouping?.type === "Unit") {
            fetchEmployeeOptions(options, "Unit")
        } else {
            setEmployeesNames([])
        }
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };


    const handleUnitChangeEdit = (options) => {
        setValueUnitCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        const value = options.map((a, index) => {
            return a.value;
        })
        setSelectedOptionsUnitEdit(options);
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setSelectedEmployeeOptionsEdit([])
        setEmployeesNamesEdit([])
        setValueEmployeeEdit([])

        setSelectedDepartmentOptionsEdit([])
        setValueDepartmentEdit([])
        setSelectedDesignationOptionsEdit([])
        setValueDesignationEdit([])
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])

        if (taskGroupingEdit?.type === "Unit") {
            fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, value, valueTeamCatEdit, valueDepartmentEdit, valueDesignationEdit, valueProcessCatEdit, "Unit")
        } else {
            setEmployeesNamesEdit([])
        }
    };

    const customValueRendererUnitEdit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };


    const handleTeamChange = (options) => {
        let teamArray =
            options.map((a, index) => {
                return a.value;
            })
        setValueTeamCat(teamArray);
        setSelectedOptionsTeam(options);

        if (["Team", "Individual"]?.includes(taskGrouping?.type)) {
            fetchEmployeeOptions(options, "Individual")
        } else {
            setEmployeesNames([])
        }
        setSelectedEmployeeOptions([])
        setValueEmployee([])
        setValueProcessCat([])
        setSelectedOptionsProcess([])
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        if (taskGrouping?.type === "Process") {
            filterProcess(teamArray)
        }
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };


    const handleTeamChangeEdit = (options) => {
        setValueTeamCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
        let value = options.map((a, index) => {
            return a.value;
        })
        if (["Team", "Individual"]?.includes(taskGroupingEdit?.type)) {
            fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, value, valueDepartmentEdit, valueDesignationEdit, valueProcessCatEdit, "Team")
        }
        filterProcessEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, value)
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])
        setValueProcessCatEdit([])
        setSelectedOptionsProcessEdit([])
        setSelectedDepartmentOptionsEdit([])
        setValueDepartmentEdit([])
        setSelectedDesignationOptionsEdit([])
        setValueDesignationEdit([])
    };

    const customValueRendererTeamEdit = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };




    const handleProcessChange = (options) => {
        setValueProcessCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsProcess(options);
        if (taskGrouping?.type === "Process") {
            fetchEmployeeOptions(options, "Process")
        }
        setSelectedEmployeeOptions([])
        setValueEmployee([])

    };

    const customValueRendererProcess = (valueProcessCat, _categoryname) => {
        return valueProcessCat?.length
            ? valueProcessCat.map(({ label }) => label)?.join(", ")
            : "Please Select Process";
    };



    const handleProcessChangeEdit = (options) => {
        setValueProcessCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsProcessEdit(options);
        let value = options.map((a, index) => {
            return a.value;
        })
        if (taskGroupingEdit?.type === "Process") {
            fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, valueTeamCatEdit, valueDepartmentEdit, valueDesignationEdit, value, "Process")
        }
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])
    };

    const customValueRendererProcessEdit = (valueProcessEditCat, _categoryname) => {
        return valueProcessEditCat?.length
            ? valueProcessEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Process";
    };



    //Designation_Wise_Employees
    const handleEmployeeChange = (options) => {
        setValueEmployee(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedEmployeeOptions(options);
    };

    const customValueRendererEmployee = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
    };
    //Designation_Wise_Employees
    const handleEmployeeChangeEdit = (options) => {
        setValueEmployeeEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedEmployeeOptionsEdit(options);
    };

    const customValueRendererEmployeeEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
    };



    useEffect(() => {
        fetchDesignation();
        fetchDepartments();
    }, []);




    const fetchEmployeeOptions = async (e, type) => {
        const valuesData = e.length > 0 ? e.map(data => data?.value) : [];
        let filteredUsers = [];

        const isMatching = (user, conditions) => {
            return Object.entries(conditions).every(([key, val]) =>
                Array.isArray(val) ? val.includes(user[key]) : user[key] === val
            );
        };

        switch (type) {
            case "Company":
                filteredUsers = allUsersData.filter(user => valuesData?.includes(user.company));
                break;
            case "Branch":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valuesData })
                );
                break;
            case "Unit":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valueBranchCat, unit: valuesData })
                );
                break;
            case "Team":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valueBranchCat, unit: valueUnitCat, team: valuesData })
                );
                break;
            case "Department":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valueBranchCat, unit: valueUnitCat, department: valuesData })
                );
                break;
            case "Designation":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valueBranchCat, unit: valueUnitCat, designation: valuesData })
                );
                break;
            case "Individual":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valueBranchCat, unit: valueUnitCat, team: valuesData })
                );
                break;
            case "Process":
                filteredUsers = allUsersData.filter(user =>
                    isMatching(user, { company: valueCompanyCat, branch: valueBranchCat, unit: valueUnitCat, team: valueTeamCat, process: valuesData })
                );
                break;
            default:
                break;
        }
        const allCondiitons = [
            // { label: "ALL", value: "ALL" }, ...
            ...filteredUsers?.map(data => ({
                label: data?.companyname,
                value: data?.companyname,
            }))
        ]
        setEmployeesNames(allCondiitons)
        // return filteredUsers;
    };


    const fetchEmployeeOptionsEdit = async (company, branch, unit, team, department, designation, process, type) => {
        try {
            let filteredUsers = [];
            const isMatching = (user, conditions) => {
                return Object.entries(conditions).every(([key, val]) =>
                    Array.isArray(val) ? val.includes(user[key]) : user[key] === val
                );
            };

            switch (type) {
                case "Company":
                    filteredUsers = allUsersData.filter(user => company?.includes(user.company));
                    break;
                case "Branch":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch })
                    );
                    break;
                case "Unit":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch, unit: unit })
                    );
                    break;
                case "Team":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch, unit: unit, team: team })
                    );
                    break;
                case "Department":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch, unit: unit, department: department })
                    );
                    break;
                case "Designation":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch, unit: unit, designation: designation })
                    );
                    break;
                case "Individual":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch, unit: unit, team: team })
                    );
                    break;
                case "Process":
                    filteredUsers = allUsersData.filter(user =>
                        isMatching(user, { company: company, branch: branch, unit: unit, team: team, process: process })
                    );
                    break;
                default:
                    break;
            }

            const allCondiitons = [...filteredUsers?.map(data => ({
                label: data?.companyname,
                value: data?.companyname,
            }))]
            setEmployeesNamesEdit(allCondiitons)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Designation
    const handleDesignationChange = (options) => {
        setValueDesignation(
            options.map((a, index) => {
                return a.value;
            })
        );

        if (taskGrouping?.type === "Designation") {
            fetchEmployeeOptions(options, "Designation")
        }

        setSelectedEmployeeOptions([])
        setValueEmployee([])

        setSelectedDesignationOptions(options);
    };
    const customValueRendererDesignation = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Designation";
    };
    //Designation
    const handleDesignationChangeEdit = (options) => {
        setValueDesignationEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Designation")
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])
        setSelectedDesignationOptionsEdit(options);
    };

    const customValueRendererDesignationEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Designation";
    };



    //Department
    const handleDepartmentChange = (options) => {
        setValueDepartment(
            options.map((a, index) => {
                return a.value;
            })
        );
        if (taskGrouping?.type === "Department") {
            fetchEmployeeOptions(options, "Department")
        }
        setSelectedEmployeeOptions([])
        setValueEmployee([])
        setSelectedDepartmentOptions(options);
    };

    const customValueRendererDepartment = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Department";
    };



    //Department
    const handleDepartmentChangeEdit = (options) => {
        setValueDepartmentEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Department")
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])
        setSelectedDepartmentOptionsEdit(options);
    };

    const customValueRendererDepartmentEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Department";
    };


    //set function to get particular row
    const rowData = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteTaskGrouping(res?.data?.stasknonschedulegrouping);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let proid = deleteTaskGrouping._id;
    const delProcess = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${proid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            await fetchTaskGrouping();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    //add function
    const sendRequest = async (item) => {
        setBtnLoad(true)

        setPageName(!pageName);
        try {
            let brandCreate = await axios.post(SERVICE.CREATE_TASK_NONSCHEDULEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: String(taskGrouping.category),
                subcategory: String(taskGrouping.subcategory),
                date: String(taskGrouping.date),
                time: taskGrouping.frequency === "Fixed" ? String(taskGrouping.time) : "",
                type: String(taskGrouping.type),
                schedule: String(taskGrouping.frequency),
                priority: String(taskGrouping.priority),
                designation: valueDesignation,
                department: valueDepartment,
                company: valueCompanyCat,
                branch: valueBranchCat,
                unit: valueUnitCat,
                team: valueTeamCat,
                process: valueProcessCat,
                formattedDate: new Date(taskGrouping.date),
                employeenames: valueEmployee,
                duration: String(taskGrouping.duration),
                breakupcount: String(taskGrouping.breakupcount),
                breakup: breakuphours,
                required: [...requiredValueCate],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setTaskGrouping(brandCreate.data);
            await fetchTaskGrouping();
            setTaskGrouping({
                ...taskGrouping,
                date: "",
                time: "",
                breakupcount: "1",
                duration: "00:10",
            })
            setbreakupHours("10")
            setHours("00")
            setMinutes("10")
            setSearchQuery("")
            setBtnLoad(false)
            setAddReqTodo([])
            setPopupContent('Added Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        }

        catch (err) {
            setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = taskGroupingArray?.some(
            (item) =>
                item.category === taskGrouping.category &&
                item.subcategory === taskGrouping.subcategory &&
                valueEmployee?.some(data => item?.employeenames?.includes(data))
        );

        if (taskGrouping.category === "Please Select Category") {
            setPopupContentMalert('Please Select Category');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.subcategory === "Please Select SubCategory") {
            setPopupContentMalert('Please Select SubCategory');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGrouping?.type === "Please Select Type" ||
            taskGrouping?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskGrouping?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskGrouping?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(taskGrouping?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGrouping?.type === "Department" &&
            selectedDepartmentOptions?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGrouping?.type === "Designation" &&
            selectedDesignationOptions?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGrouping?.type === "Process" &&
            selectedOptionsProcess?.length === 0
        ) {
            setPopupContentMalert("Please Select Process!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployeeOptions?.length < 1) {
            setPopupContentMalert('Please Select Employee Names');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.frequency === "Please Select Schedule") {
            setPopupContentMalert('Please Select Schedule');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.priority === "Please Select Priority") {
            setPopupContentMalert('Please Select Priority');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.date === "" || taskGrouping.date === undefined) {
            setPopupContentMalert('Please Select Date');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.frequency === "Fixed" && taskGrouping.time === "" || taskGrouping.time === undefined) {
            setPopupContentMalert('Please Select Time');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.duration === undefined || taskGrouping.duration === "00:00" || taskGrouping?.duration?.includes("Mins")) {
            setPopupContentMalert('Please Select Duration');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.breakupcount === "") {
            setPopupContentMalert('Please Enter Breakup count');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (isNameMatch) {
            setPopupContentMalert('This Task Non-Schedule Grouping data already exists!');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setTaskGrouping({
            category: "Please Select Category",
            subcategory: "Please Select SubCategory",
            type: "Please Select Type",
            frequency: "Please Select Schedule",
            priority: "Please Select Priority",
            date: "",
            duration: "00:10",
            breakupcount: "1",
            time: "",
        });
        setSelectedWeeklyOptions([])
        setAddReqTodo([])
        setHours("00");
        setMinutes("10");
        setbreakupHours("10");
        setbreakupMinutes("Mins");
        setFilteredSubCategory([]);
        setSelectedRequiredOptionsCate([]);
        setRequiredValueCate("");

        setSelectedOptionsProcess([])
        setValueProcessCat([])

        setEmployeesNames([])
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setValueEmployee([])
        setSelectedEmployeeOptions([])
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedDepartmentOptions([])
        setSelectedOptionsTeam([])
        setSelectedOptionsUnit([])
        setValueBranchCat([])
        setValueCompanyCat([])
        setValueUnitCat([])
        setValueTeamCat([])
        // setDepartment([])
        setValueDesignation([])
        setValueDepartment([])
        setSelectedDesignationOptions([])
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };


    // get single row to view....

    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.stasknonschedulegrouping);
            concordinateParticipants(res?.data?.stasknonschedulegrouping);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....

    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpeninfo();
            setTaskGroupingEdit(res?.data?.stasknonschedulegrouping);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const getReassignCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.stasknonschedulegrouping);
            const [hourscal, minutescal] = res?.data?.stasknonschedulegrouping.duration.split(":");
            setHoursEdit(hourscal);
            setMinutesEdit(minutescal);
            setRequiredValueCateEdit(res?.data?.stasknonschedulegrouping?.required);
            setbreakupHoursEdit(res?.data?.stasknonschedulegrouping?.breakup)
            setSelectedRequiredOptionsCateEdit([...res?.data?.stasknonschedulegrouping?.required.map((t) => ({ ...t, label: t, value: t }))]);

            setSelectedOptionsCompanyEdit([...res?.data?.stasknonschedulegrouping?.company.map((t) => ({ ...t, label: t, value: t }))])
            setValueCompanyCatEdit(res?.data?.stasknonschedulegrouping?.company)

            setSelectedOptionsBranchEdit([...res?.data?.stasknonschedulegrouping?.branch.map((t) => ({ ...t, label: t, value: t }))])
            setValueBranchCatEdit(res?.data?.stasknonschedulegrouping?.branch)

            setValueUnitCatEdit(res?.data?.stasknonschedulegrouping?.unit)
            setSelectedOptionsUnitEdit([...res?.data?.stasknonschedulegrouping?.unit.map((t) => ({ ...t, label: t, value: t }))])

            setValueTeamCatEdit(res?.data?.stasknonschedulegrouping?.team)
            setSelectedOptionsTeamEdit([...res?.data?.stasknonschedulegrouping?.team.map((t) => ({ ...t, label: t, value: t }))])


            setSelectedDesignationOptionsEdit([...res?.data?.stasknonschedulegrouping?.designation.map((t) => ({ ...t, label: t, value: t }))])
            setValueDesignationEdit(res?.data?.stasknonschedulegrouping?.designation)


            setValueProcessCatEdit(res?.data?.stasknonschedulegrouping?.process)
            setSelectedOptionsProcessEdit([...res?.data?.stasknonschedulegrouping?.process.map((t) => ({ label: t, value: t }))])
            setSelectedDepartmentOptionsEdit([...res?.data?.stasknonschedulegrouping?.department.map((t) => ({ ...t, label: t, value: t }))])
            setValueDepartmentEdit(res?.data?.stasknonschedulegrouping?.department)
            let company = res?.data?.stasknonschedulegrouping?.company ?? [];
            let branch = res?.data?.stasknonschedulegrouping?.branch ?? [];
            let unit = res?.data?.stasknonschedulegrouping?.unit ?? [];
            let team = res?.data?.stasknonschedulegrouping?.team ?? [];
            let department = res?.data?.stasknonschedulegrouping?.department ?? [];
            let designation = res?.data?.stasknonschedulegrouping?.designation ?? [];
            let process = res?.data?.stasknonschedulegrouping?.process ?? [];
            filterProcessEdit(company, branch, unit, team)
            fetchEmployeeOptionsEdit(company, branch, unit, team, department, designation, process, res?.data?.stasknonschedulegrouping?.type)


            setSelectedEmployeeOptionsEdit([...res?.data?.stasknonschedulegrouping?.employeenames.map((t) => ({ ...t, label: t, value: t }))])
            setValueEmployeeEdit(res?.data?.stasknonschedulegrouping?.employeenames)
            // handleClickOpenReassign();
            handleClickOpenReassign();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    let updateby = taskGroupingEdit.updatedby;
    let addedby = taskGroupingEdit.addedby;
    let taskgroupingId = taskGroupingEdit._id;

    //editing the single data...

    const sendEditRequestReassingn = async (item) => {
        setPageName(!pageName);
        try {

            let res = await axios.post(
                `${SERVICE.CREATE_TASKFORUSER}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    category: String(taskGroupingEdit.category),
                    subcategory: String(taskGroupingEdit.subcategory),
                    taskdate: String(taskGroupingEdit.date),
                    tasktime: taskGroupingEdit.schedule === "Fixed" ? String(taskGroupingEdit.time) : "",
                    type: String(taskGroupingEdit.type),
                    schedule: String(taskGroupingEdit.schedule),
                    priority: String(taskGroupingEdit.priority),
                    username: item,
                    taskstatus: "Assigned",
                    orginalid: taskGroupingEdit._id,
                    taskdetails: "nonschedule",
                    duration: String(taskGroupingEdit.duration),
                    breakupcount: String(taskGroupingEdit.breakupcount),
                    breakup: breakuphoursEdit,
                    required: [...requiredValueCateEdit],
                    description: "",
                    taskassigneddate: moment(taskGroupingEdit.date).format("DD-MM-YYYY"),
                    formattedDate: new Date(taskGroupingEdit.date),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );


            await fetchTaskGrouping();
            await fetchTaskGroupingAll();
            handleCloseReassign();
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();


        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };





    const editSubmitReassign = async (e) => {
        e.preventDefault();
        await fetchTaskGroupingAllReassign()
        const isNameMatch = taskGroupingArrayEdit?.some(
            (item) =>
                item.category == taskGroupingEdit.category &&
                item.subcategory == taskGroupingEdit.subcategory &&
                valueEmployeeEdit?.some(data => item.employeenames?.includes(data)) &&
                item.date == taskGroupingEdit.date
                &&
                item.time == taskGroupingEdit.time

        );
        const isNameMatchtask = taskGroupingLogEdit?.some(
            (item) =>
                item.category == taskGroupingEdit.category &&
                item.subcategory == taskGroupingEdit.subcategory &&
                valueEmployeeEdit?.includes(item.username) &&
                item.taskdate == taskGroupingEdit.date && item.tasktime == taskGroupingEdit.time && item.taskdetails === "nonschedule"

        );
        if (taskGroupingEdit.category === "Please Select Category") {
            setPopupContentMalert('Please Select Category');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (taskGroupingEdit.subcategory === "Please Select SubCategory") {
            setPopupContentMalert('Please Select SubCategory');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.type === "Please Select Type") {
            setPopupContentMalert('Please Select Type');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCompanyEdit?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskGroupingEdit?.type) &&
            selectedOptionsBranchEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskGroupingEdit?.type) &&
            selectedOptionsUnitEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team", "Process"]?.includes(taskGroupingEdit?.type) &&
            selectedOptionsTeamEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGroupingEdit?.type === "Department" &&
            selectedDepartmentOptionsEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGroupingEdit?.type === "Designation" &&
            selectedDesignationOptionsEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskGroupingEdit?.type === "Process" &&
            selectedOptionsProcessEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Process!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployeeOptionsEdit?.length < 1) {
            setPopupContentMalert('Please Select Employee Names');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.schedule === "Please Select Schedule") {
            setPopupContentMalert('Please Select Schedule');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.priority === "Please Select Priority") {
            setPopupContentMalert('Please Select Priority');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.date === "" || taskGroupingEdit.date === undefined) {
            setPopupContentMalert('Please Select Date');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.schedule === "Fixed" && taskGroupingEdit.time === "" || taskGroupingEdit.time === undefined) {
            setPopupContentMalert('Please Select Time');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit?.duration === undefined || taskGroupingEdit?.duration === "00:00" || taskGroupingEdit?.duration?.includes("Mins")) {
            setPopupContentMalert('Please Select Duration');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.breakupcount === "") {
            setPopupContentMalert('Please Enter Breakup count');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (isNameMatch) {
            setPopupContentMalert('Task Non-Schedule Grouping already exists!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatchtask) {
            setPopupContentMalert('These Data is already exists in Task!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            const empName = valueEmployeeEdit?.map(data => sendEditRequestReassingn(data))

        }
    };
    //get all Task Schedule Grouping.

    const fetchTaskGrouping = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.post(SERVICE.ALL_TASK_NONSCHEDULEGROUPING_ACCESSBRANCH, {
                accessbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            const answer = res_freq?.data?.tasknonschedulegrouping ? res_freq?.data?.tasknonschedulegrouping?.map((item, index) => ({
                // ...item,
                serialNumber: index + 1,
                id: item._id,
                category: item.category,
                subcategory: item.subcategory,
                type: item.type,
                designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                schedule: item.schedule,
                priority: item.priority,
                department: item.department?.length > 0 ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
                company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                process: item.process?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                date: moment(item.date).format("DD-MM-YYYY"),
                time: item?.time,
                duration: item.duration,
                breakup: item.breakup,
                breakupcount: item.breakupcount,
                required: item.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

            })) : [];


            setTaskGroupingArray(answer);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const bulkdeletefunction = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false)
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchTaskGrouping();
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all Task Schedule Grouping.

    const fetchTaskGroupingAll = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_TASK_NONSCHEDULEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setTaskGroupingArrayEdit(
                res_freq?.data?.tasknonschedulegrouping.filter(
                    (item) => item._id !== taskgroupingId
                ));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchTaskGroupingAllReassign = async (e) => {
        setPageName(!pageName);
        try {
            const [res_freq, res_freq_task] = await Promise.all([
                axios.get(SERVICE.ALL_TASK_NONSCHEDULEGROUPING, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.NONSCHEDULLOGREASSIGNTASKFORUSER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    category: taskGroupingEdit.category,
                    subcategory: taskGroupingEdit.subcategory,
                    username: [...valueEmployeeEdit],
                    taskdate: taskGroupingEdit.date,
                    tasktime: taskGroupingEdit.time,
                })
            ])

            setTaskGroupingArrayEdit(res_freq?.data?.tasknonschedulegrouping);
            setTaskGroupingLogEdit(res_freq_task?.data?.taskforuser)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Task Non-Schedule Grouping.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // pdf.....
    const columns = [
        { title: "Category", field: "category" },
        { title: "SubCategory", field: "subcategory" },
        { title: "Schedule", field: "schedule" },
        { title: "Priority", field: "priority" },
        { title: "Type", field: "type" },
        { title: "Designation", field: "designation" },
        { title: "Department", field: "department" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Process", field: "process" },
        { title: "Employee Names", field: "employeenames" },
        { title: "Date", field: "date" },
        { title: "Time", field: "time" },
        { title: "Duration", field: "duration" },
        { title: "Breakup Count", field: "breakupcount" },
        { title: "Breakup", field: "breakup" },
        { title: "Required", field: "required" },
    ];

    // Excel
    const fileName = "TaskNonScheduleGrouping";
    // get particular columns for export excel


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Task NonSchedule Grouping",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
    };
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
        setPage(1);
    };


    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
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
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 150,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "subcategory",
            headerName: "SubCategory",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 100,
            hide: !columnVisibility.schedule,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "priority",
            headerName: "Priority",
            flex: 0,
            width: 100,
            hide: !columnVisibility.priority,
            headerClassName: "bold-header",
        },

        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 100,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 160,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 160,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 160,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 160,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 160,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 160,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 160,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "employeenames",
            headerName: "Employee Names",
            flex: 0,
            width: 250,
            hide: !columnVisibility.employeenames,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "time",
            headerName: "Time",
            flex: 0,
            width: 75,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },



        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 75,
            hide: !columnVisibility.duration,
            headerClassName: "bold-header",
        },
        {
            field: "breakupcount",
            headerName: "Breakup Count",
            flex: 0,
            width: 75,
            hide: !columnVisibility.breakupcount,
            headerClassName: "bold-header",
        },
        {
            field: "breakup",
            headerName: "Breakup",
            flex: 0,
            width: 75,
            hide: !columnVisibility.breakup,
            headerClassName: "bold-header",
        },

        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 150,
            hide: !columnVisibility.required,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 500,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    {isUserRoleCompare?.includes("dtasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vtasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    &ensp;
                    {isUserRoleCompare?.includes("etasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getReassignCode(params.data.id);
                            }}
                        >
                            Reassign
                        </Button>
                    )}
                    &ensp;
                    &ensp;
                    {isUserRoleCompare?.includes("etasknonschedulegrouping") && (
                        <Link to={`/task/tasknonschedulelog/${params.data.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                            <Button variant="contained" ><MenuIcon /></Button>
                        </Link>

                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            category: item.category,
            subcategory: item.subcategory,
            duration: item.duration,
            breakup: item.breakup,
            schedule: item.schedule,
            priority: item.priority,
            breakupcount: item.breakupcount,
            required: item?.required,
            designation: item.designation,
            process: item.process,
            department: item.department,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            type: item.type,
            date: item.date,
            time: item.time,
            employeenames: item.employeenames,

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
    // Function to filter columns based on search query
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
                            {" "}
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
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const handleTimeCalculate = (e) => {
        const breakupCount = e ? Number(e) : 1;
        const hourCal = hours !== "Hrs" ? Number(hours) : 0;
        const MinsCal = minutes !== "Mins" ? Number(minutes) : 0;
        const breakUpTime = ((hourCal * 60 + MinsCal) / breakupCount).toFixed(2);
        setbreakupHours(breakUpTime)



    }

    const handleTimeCalculateEdit = (e) => {
        const breakupCount = e ? Number(e) : 1;
        const hourCal = hoursEdit ? Number(hoursEdit) : 0;
        const MinsCal = minutesEdit ? Number(minutesEdit) : 0;
        const breakUpTime = ((hourCal * 60 + MinsCal) / breakupCount).toFixed(2);
        setbreakupHoursEdit(breakUpTime)



    }


    return (
        <Box>
            <Headtitle title={"TASK NON-SCHEDULE GROUPING"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Task Non-Schedule Grouping"
                modulename="Task"
                submodulename="Task Non Schedule Grouping"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />

            <>
                {isUserRoleCompare?.includes("atasknonschedulegrouping") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                                        Add Task Non-Schedule Grouping
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={categoryOption}
                                                placeholder="Please Select Category"
                                                value={{ label: taskGrouping.category, value: taskGrouping.category }}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        category: e.value,
                                                        subcategory: "Please Select SubCategory",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                SubCategory<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={filteredSubCategory}
                                                placeholder="Please Select SubCategory"
                                                value={{ label: taskGrouping.subcategory, value: taskGrouping.subcategory }}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        subcategory: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>



                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={TypeOptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: taskGrouping.type,
                                                    value: taskGrouping.type,
                                                }}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        type: e.value,
                                                    });
                                                    setSelectedOptionsCompany([])
                                                    setValueCompanyCat([])


                                                    setSelectedOptionsBranch([])
                                                    setValueBranchCat([])

                                                    setSelectedOptionsUnit([])
                                                    setValueUnitCat([])


                                                    setSelectedOptionsTeam([])
                                                    setValueTeamCat([])


                                                    setSelectedDesignationOptions([])
                                                    setValueDesignation([])


                                                    setSelectedOptionsProcess([])
                                                    setValueProcessCat([])

                                                    setSelectedDepartmentOptions([])
                                                    setValueDepartment([])


                                                    setEmployeesNames([])
                                                    setValueEmployee([])
                                                    setSelectedEmployeeOptions([])


                                                    // setBranchOption([])
                                                    // setUnitOption([])
                                                    // setTeamOption([])

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
                                    {["Individual", "Team", "Process", "Shift"]?.includes(taskGrouping.type) ? (
                                        <>
                                            {/* Branch Unit Team */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
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
                                            {["Process"]?.includes(taskGrouping.type) && (
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Process<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={processOptions}
                                                            value={selectedOptionsProcess}
                                                            onChange={(e) => {
                                                                handleProcessChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererProcess}
                                                            labelledBy="Please Select Process"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            )}
                                        </>
                                    ) : ["Department"]?.includes(taskGrouping.type) ? (
                                        <>
                                            {/* Department */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
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
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOptions}
                                                        value={selectedDepartmentOptions}
                                                        onChange={(e) => {
                                                            handleDepartmentChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Designation"]?.includes(taskGrouping.type) ? (
                                        <>
                                            {/* Designation */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
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
                                                        Designation<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={alldesignation?.map(data => ({
                                                            label: data.name,
                                                            value: data.name,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedDesignationOptions}
                                                        onChange={(e) => {
                                                            handleDesignationChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDesignation}
                                                        labelledBy="Please Select Designation"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Branch"]?.includes(taskGrouping.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
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
                                    ) : ["Unit"]?.includes(taskGrouping.type) ? (
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
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Names<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                                options={employeesNames}
                                                value={selectedEmployeeOptions}
                                                onChange={handleEmployeeChange}
                                                valueRenderer={customValueRendererEmployee}
                                                labelledBy="Please Select Employee"
                                            />

                                        </FormControl>
                                    </Grid>


                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Schedule<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={[{ label: "Fixed", value: "Fixed" }, { label: "Any Time", value: "Any Time" }]}
                                                styles={colourStyles}
                                                value={{
                                                    label: taskGrouping.frequency,
                                                    value: taskGrouping.frequency,
                                                }}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        frequency: e.value,
                                                        time: ""
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Priority<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={[{ label: "High", value: "High" }, { label: "Medium", value: "Medium" }, { label: "Low", value: "Low" }]}
                                                styles={colourStyles}
                                                value={{
                                                    label: taskGrouping.priority,
                                                    value: taskGrouping.priority,
                                                }}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        priority: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Date"
                                                value={taskGrouping.date}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        date: e.target.value,
                                                    });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    {taskGrouping?.frequency === "Fixed" &&
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Time<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="Time"
                                                    value={taskGrouping.time}
                                                    onChange={(e) => {
                                                        setTaskGrouping({
                                                            ...taskGrouping,
                                                            time: e.target.value,
                                                        });
                                                    }}

                                                />
                                            </FormControl>
                                        </Grid>
                                    }

                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Duration<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={hrsOption}
                                                        placeholder="Hrs"
                                                        value={{ label: hours, value: hours }}
                                                        onChange={(e) => {
                                                            setHours(e.value);
                                                            setTaskGrouping({ ...taskGrouping, duration: `${e.value}:${minutes}`, breakupcount: "" });
                                                            setbreakupHours("")
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={minsOption}
                                                        placeholder="Mins"
                                                        value={{ label: minutes, value: minutes }}
                                                        onChange={(e) => {
                                                            setMinutes(e.value);
                                                            setTaskGrouping({ ...taskGrouping, duration: `${hours}:${e.value}`, breakupcount: "" });
                                                            setbreakupHours("")
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Breakup Count<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="Number"
                                            sx={userStyle.input}
                                            value={taskGrouping.breakupcount}
                                            onChange={(e) => {
                                                const ans = e.target.value > 0 ? e.target.value : ""
                                                handleTimeCalculate(ans)
                                                setTaskGrouping({
                                                    ...taskGrouping,
                                                    breakupcount: ans,

                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Breakup
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={`${breakuphours} mins`}

                                        />
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Required
                                            </Typography>
                                            <MultiSelect options={requiredOption} value={selectedRequiredOptionsCate} onChange={handleRequiredChange} valueRenderer={customValueRendererRequired} labelledBy="Please Select Required" />
                                        </FormControl>
                                    </Grid>

                                </>
                            </Grid>
                            <br />



                            <Grid item md={12} sm={12} xs={12}>
                                <br />
                                <br />
                                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                    <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnLoad} variant='contained' color='primary' onClick={handleSubmit} >Submit</LoadingButton>

                                    <Button sx={buttonStyles.btncancel}
                                        onClick={handleclear}
                                    >
                                        {" "}
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            <br />   <br />
            {/* ****** Table Start ****** */}
            {!loader ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("ltasknonschedulegrouping") && (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    Task Non Schedule Grouping List
                                </Typography>
                            </Grid>
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
                                            <MenuItem value={taskGroupingArray?.length}>
                                                All
                                            </MenuItem>
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
                                        {isUserRoleCompare?.includes("exceltasknonschedulegrouping") && (


                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtasknonschedulegrouping") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtasknonschedulegrouping") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftasknonschedulegrouping") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetasknonschedulegrouping") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={taskGroupingArray}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={items}
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
                            {isUserRoleCompare?.includes("bdtasknonschedulegrouping") && (
                                <Button sx={buttonStyles.buttonbulkdelete} variant="contained" color="error" onClick={handleClickOpenalert}>
                                    Bulk Delete
                                </Button>
                            )}
                            <br />
                            <br />
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
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
                                    // totalDatas={totalProjects}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={items}

                                />
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>}
            {/* ****** Table End ****** */}
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


            {/*DELETE ALERT DIALOG */}
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
                    <Button
                        onClick={handleCloseMod}
                        sx={buttonStyles.btncancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        // color="error"
                        sx={buttonStyles.buttonsubmit}
                        onClick={(e) => delProcess(proid)}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
                sx={{ marginTop: "40px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Task Non - Schedule Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{taskGroupingEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">SubCategory</Typography>
                                    <Typography>{taskGroupingEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{taskGroupingEdit?.type}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{taskGroupingEdit.company?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>

                            {taskGroupingEdit?.branch?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{taskGroupingEdit.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskGroupingEdit?.unit?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    <Typography>{taskGroupingEdit.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskGroupingEdit?.team?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Team</Typography>
                                    <Typography>{taskGroupingEdit.team?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}

                            {taskGroupingEdit?.process?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Process</Typography>
                                    <Typography>{taskGroupingEdit.process?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskGroupingEdit?.designation?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Designation</Typography>
                                    <Typography>{taskGroupingEdit.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskGroupingEdit?.department?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Department</Typography>
                                    <Typography>{taskGroupingEdit.department?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Names</Typography>
                                    <Typography>{taskGroupingEdit.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Schedule</Typography>
                                    <Typography>{`${taskGroupingEdit?.schedule}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Priority</Typography>
                                    <Typography>{`${taskGroupingEdit?.priority}`}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Date</Typography>
                                    <Typography>{`${moment(taskGroupingEdit.date).format("DD-MM-YYYY")}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Time</Typography>
                                    <Typography>{`${taskGroupingEdit.time}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Duration</Typography>
                                    <Typography>{taskGroupingEdit.duration}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Breakup Count</Typography>
                                    <Typography>{taskGroupingEdit.breakupcount}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Breakup</Typography>
                                    <Typography>{`${taskGroupingEdit.breakup} mins`}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Required</Typography>
                                    <Typography>{concReqs}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                sx={buttonStyles.btncancel}
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* Bulk delete ALERT DIALOG */}
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
            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" sx={buttonStyles.buttonsubmit}
                            onClick={(e) => bulkdeletefunction(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Re Assign DIALOG */}
            <Box>
                <Dialog
                    open={openReassign}
                    onClose={handleCloseReassign}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: 'Auto',
                        '& .MuiPaper-root': {
                            overflow: 'Auto',
                        },
                        marginTop: "40px"
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Reassign Task Non Schedule Grouping
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={categoryOption}
                                            placeholder="Please Select Category"
                                            value={{ label: taskGroupingEdit.category === "" ? "Please Select Category" : taskGroupingEdit.category, value: taskGroupingEdit.category === "" ? "Please Select Category" : taskGroupingEdit.category }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    category: e.value,
                                                    subcategory: "Please Select SubCategory",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            SubCategory<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={filteredSubCategoryEdit}
                                            placeholder="Please Select SubCategory"
                                            value={{ label: taskGroupingEdit.subcategory === "" ? "Please Select SubCategory" : taskGroupingEdit.subcategory, value: taskGroupingEdit.subcategory === "" ? "Please Select SubCategory" : taskGroupingEdit.subcategory }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    subcategory: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>



                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: taskGroupingEdit.type,
                                                value: taskGroupingEdit.type,
                                            }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    type: e.value,
                                                });
                                                setSelectedOptionsCompanyEdit([])
                                                setValueCompanyCatEdit([])


                                                setSelectedOptionsBranchEdit([])
                                                setValueBranchCatEdit([])

                                                setSelectedOptionsUnitEdit([])
                                                setValueUnitCatEdit([])


                                                setSelectedOptionsTeamEdit([])
                                                setValueTeamCatEdit([])


                                                setSelectedDesignationOptionsEdit([])
                                                setValueDesignationEdit([])


                                                setSelectedOptionsProcessEdit([])
                                                setValueProcessCatEdit([])

                                                setSelectedDepartmentOptionsEdit([])
                                                setValueDepartmentEdit([])


                                                setEmployeesNamesEdit([])
                                                setValueEmployeeEdit([])
                                                setSelectedEmployeeOptionsEdit([])
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
                                            value={selectedOptionsCompanyEdit}
                                            onChange={(e) => {
                                                handleCompanyChangeEdit(e);
                                            }}
                                            valueRenderer={customValueRendererCompanyEdit}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team", "Process", "Shift"]?.includes(taskGroupingEdit.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCatEdit?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
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
                                                                valueCompanyCatEdit?.includes(comp.company) &&
                                                                valueBranchCatEdit?.includes(comp.branch)
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
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCatEdit?.includes(u.company) &&
                                                                valueBranchCatEdit?.includes(u.branch) &&
                                                                valueUnitCatEdit?.includes(u.unit)
                                                        )
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
                                        {["Process"]?.includes(taskGroupingEdit.type) && (
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Process<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={processOptionsEdit}
                                                        value={selectedOptionsProcessEdit}
                                                        onChange={(e) => {
                                                            handleProcessChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererProcessEdit}
                                                        labelledBy="Please Select Process"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                    </>
                                ) : ["Department"]?.includes(taskGroupingEdit.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCatEdit?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
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
                                                                valueCompanyCatEdit?.includes(comp.company) &&
                                                                valueBranchCatEdit?.includes(comp.branch)
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
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedDepartmentOptionsEdit}
                                                    onChange={(e) => {
                                                        handleDepartmentChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartmentEdit}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Designation"]?.includes(taskGroupingEdit.type) ? (
                                    <>
                                        {/* Designation */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCatEdit?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
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
                                                                valueCompanyCatEdit?.includes(comp.company) &&
                                                                valueBranchCatEdit?.includes(comp.branch)
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
                                                    Designation<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={alldesignation?.map(data => ({
                                                        label: data.name,
                                                        value: data.name,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedDesignationOptionsEdit}
                                                    onChange={(e) => {
                                                        handleDesignationChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererDesignationEdit}
                                                    labelledBy="Please Select Designation"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(taskGroupingEdit.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCatEdit?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Unit"]?.includes(taskGroupingEdit.type) ? (
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
                                                            valueCompanyCatEdit?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
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
                                                                valueCompanyCatEdit?.includes(comp.company) &&
                                                                valueBranchCatEdit?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnitEdit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Names<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={employeesNamesEdit}
                                            value={selectedEmployeeOptionsEdit}
                                            onChange={handleEmployeeChangeEdit}
                                            valueRenderer={customValueRendererEmployeeEdit}
                                            labelledBy="Please Select Employee"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Schedule<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[{ label: "Fixed", value: "Fixed" }, { label: "Any Time", value: "Any Time" }]}
                                            styles={colourStyles}
                                            value={{
                                                label: taskGroupingEdit.schedule,
                                                value: taskGroupingEdit.schedule,
                                            }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    schedule: e.value,
                                                    time: ""
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Priority<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[{ label: "High", value: "High" }, { label: "Medium", value: "Medium" }, { label: "Low", value: "Low" }]}
                                            styles={colourStyles}
                                            value={{
                                                label: taskGroupingEdit.priority,
                                                value: taskGroupingEdit.priority,
                                            }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    priority: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="Date"
                                            value={taskGroupingEdit.date}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    date: e.target.value,
                                                });
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                {taskGroupingEdit.schedule === "Fixed" &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Time"
                                                value={taskGroupingEdit.time}
                                                onChange={(e) => {
                                                    setTaskGroupingEdit({
                                                        ...taskGroupingEdit,
                                                        time: e.target.value,
                                                    });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>}

                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Duration<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    maxMenuHeight={300}
                                                    options={hrsOption}
                                                    placeholder="Hrs"
                                                    value={{ label: hoursEdit, value: hoursEdit }}
                                                    onChange={(e) => {
                                                        setHoursEdit(e.value);
                                                        setTaskGroupingEdit({ ...taskGroupingEdit, duration: `${e.value}:${minutesEdit}`, breakupcount: "" });
                                                        setbreakupHoursEdit("")
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    maxMenuHeight={300}
                                                    options={minsOption}
                                                    placeholder="Mins"
                                                    value={{ label: minutesEdit, value: minutesEdit }}
                                                    onChange={(e) => {
                                                        setMinutesEdit(e.value);
                                                        setTaskGroupingEdit({ ...taskGroupingEdit, duration: `${hoursEdit}:${e.value}`, breakupcount: "" });
                                                        setbreakupHoursEdit("")
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Breakup Count<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={taskGroupingEdit.breakupcount}
                                            onChange={(e) => {
                                                const ans = e.target.value > 0 ? e.target.value : ""
                                                handleTimeCalculateEdit(ans)
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
                                                    breakupcount: ans,

                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Breakup
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            readOnly
                                            value={`${breakuphoursEdit} mins`}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Required
                                        </Typography>
                                        <MultiSelect options={requiredOption} value={selectedRequiredOptionsCateEdit} onChange={handleRequiredChangeEdit} valueRenderer={customValueRendererRequiredEdit} labelledBy="Please Select Required" />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <br />
                            <br />
                            <br />

                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={editSubmitReassign}>
                                        {" "}
                                        Reassign
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseReassign}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={taskGroupingArray ?? []}
                filename={"Task Non-Schedule Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Task Non-Schedule Grouping Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box>
    );
}

export default TaskNonScheduleGrouping;
