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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
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





function TaskNonScheduleGrouping() {
    const gridRef = useRef(null);
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
    const [isTodoEdit, setIsTodoEdit] = useState(
        Array(addReqTodo.length).fill(false)
    );
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

    const { isUserRoleCompare, isUserRoleAccess, allCompany, allBranch, allUnit, allTeam } = useContext(
        UserRoleAccessContext
    );
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
    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                filteredData?.map((item, index) => ({
                    "Sno": index + 1,
                    Category: item.category,
                    "Subcategory": item.subcategory,
                    Schedule: item.schedule,
                    Priority: item.priority,
                    Type: item.type,
                    Designation: item.designation,
                    Department: item.department,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    "Employee Names": item.employeenames,
                    Date: item.date,
                    Time: item.time,
                    Duration: item.duration,
                    "Breakup Count": item.breakupcount,
                    Breakup: item.breakup,
                    Required: item?.required,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((item, index) => ({
                    "Sno": index + 1,
                    Category: item.category,
                    "Subcategory": item.subcategory,
                    Schedule: item.schedule,
                    Priority: item.priority,
                    Type: item.type,
                    Designation: item.designation,
                    Department: item.department,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    "Employee Names": item.employeenames,
                    Date: item.date,
                    Time: item.time,
                    Duration: item.duration,
                    "Breakup Count": item.breakupcount,
                    Breakup: item.breakup,
                    Required: item?.required,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };



    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredData.map(item => ({
                serialNumber: serialNumberCounter++,
                            category: item.category,
                            subcategory: item.subcategory,
                            schedule: item.schedule,
                            priority: item.priority,
                            type: item.type,
                            designation: item.designation,
                            department: item.department,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                            employeenames: item.employeenames,
                            date: item.date,
                            time: item.time,
                            duration: item.duration,
                            breakupcount: item.breakupcount,
                            breakup: item.breakup,
                            required: item?.required,
            })) :
            items?.map(item => ({
                serialNumber: serialNumberCounter++,
                            category: item.category,
                            subcategory: item.subcategory,
                            schedule: item.schedule,
                            priority: item.priority,
                            type: item.type,
                            designation: item.designation,
                            department: item.department,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                            employeenames: item.employeenames,
                            date: item.date,
                            time: item.time,
                            duration: item.duration,
                          
                            breakupcount: item.breakupcount,
                            breakup: item.breakup,
                            required: item?.required,
            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("TaskNonScheduleGrouping.pdf");
    };
















    //useEffect
    useEffect(() => {
        addSerialNumber();
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
    const [selectedDesignationOptionsEdit, setSelectedDesignationOptionsEdit] = useState([]);
    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);
    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);

    const [companyOption, setCompanyOption] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [branchOptionEdit, setBranchOptionEdit] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [unitOptionEdit, setUnitOptionEdit] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [teamOptionEdit, setTeamOptionEdit] = useState([]);
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
    const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState([]);
    let [valueDepartmentEdit, setValueDepartmentEdit] = useState([]);
    const [selectedDepartmentOptionsEdit, setSelectedDepartmentOptionsEdit] = useState([]);

    const fetchCategory = async () => {
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
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const fetchSubCategory = async () => {
        try {
            let res_subcategory = await axios.get(SERVICE.TASKSUBCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSubCategoryOption(res_subcategory?.data?.tasksubcategorys);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };




    const fetchDesignation = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchDepartments = async () => {
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

            setDepartment(categoryall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        fetchBranchAll(options)
        setSelectedOptionsBranch([])
        setValueBranchCat([])
        setSelectedOptionsUnit([])
        setValueUnitCat([])
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        setUnitOption([])
        setTeamOption([])
        setSelectedEmployeeOptions([])
        setEmployeesNames([])
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
        setSelectedOptionsCompanyEdit(options);
        fetchBranchAllEdit(options)
        setSelectedOptionsBranchEdit([])
        setValueBranchCatEdit([])
        setSelectedOptionsUnitEdit([])
        setValueUnitCatEdit([])
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setUnitOptionEdit([])
        setTeamOptionEdit([])
        setSelectedEmployeeOptionsEdit([])
        setEmployeesNamesEdit([])
        setValueEmployeeEdit([])
    };

    const customValueRendererCompanyEdit = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };


    //get all branches.
    const fetchBranchAll = async (companies) => {
        let company = companies?.map(e => e.value)
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            let branchDrop = res_location?.data?.branch?.filter(data => company?.includes(data.company))
            setBranchOption([
                ...branchDrop?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchUnitAll(options)
        setSelectedOptionsBranch(options);
        setSelectedOptionsUnit([])
        setValueUnitCat([])
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        setTeamOption([])
        setSelectedEmployeeOptions([])
        setEmployeesNames([])
        setValueEmployee([])
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };



    const fetchBranchAllEdit = async (companies) => {
        let company = companies?.map(e => e.value)
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            let branchDrop = res_location?.data?.branch?.filter(data => company?.includes(data.company))
            setBranchOptionEdit([
                ...branchDrop?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleBranchChangeEdit = (options) => {
        setValueBranchCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchUnitAllEdit(options)
        setSelectedOptionsBranchEdit(options);
        setSelectedOptionsUnitEdit([])
        setValueUnitCatEdit([])
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setTeamOptionEdit([])
        setSelectedEmployeeOptionsEdit([])
        setEmployeesNamesEdit([])
        setValueEmployeeEdit([])
    };

    const customValueRendererBranchEdit = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };



    //function to fetch unit
    const fetchUnitAll = async (branches) => {
        let branch = branches?.map(e => e.value)
        try {
            let res_unit = await axios.get(`${SERVICE.UNIT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let unitDrop = res_unit?.data?.units?.filter(data => branch?.includes(data.branch))
            setUnitOption([
                ...unitDrop?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        fetchTeamAll(options)
        setSelectedOptionsTeam([])
        setValueTeamCat([])
        setSelectedEmployeeOptions([])
        setEmployeesNames([])
        setValueEmployee([])
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };
    //function to fetch unit
    const fetchUnitAllEdit = async (branches) => {
        let branch = branches?.map(e => e.value)
        try {
            let res_unit = await axios.get(`${SERVICE.UNIT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let unitDrop = res_unit?.data?.units?.filter(data => branch?.includes(data.branch))
            setUnitOptionEdit([
                ...unitDrop?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const handleUnitChangeEdit = (options) => {
        setValueUnitCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnitEdit(options);
        fetchTeamAllEdit(valueCompanyCatEdit, valueBranchCatEdit, options)
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setSelectedEmployeeOptionsEdit([])
        setEmployeesNamesEdit([])
        setValueEmployeeEdit([])
    };

    const customValueRendererUnitEdit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };


    //function to fetch  team
    const fetchTeamAll = async (unit) => {

        const units = unit?.map(data => data?.value)
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            const unitDrop = res_team?.data?.teamsdetails?.filter(data => valueCompanyCat?.includes(data.company) && valueBranchCat?.includes(data.branch) && units?.includes(data.unit))
            setTeamOption([
                ...unitDrop?.map((t) => ({
                    ...t,
                    label: t.teamname,
                    value: t.teamname,
                })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        fetchEmployeeOptions(options, "Employee")
        setSelectedEmployeeOptions([])
        setValueEmployee([])
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };
    //function to fetch  team
    const fetchTeamAllEdit = async (company, branch, unit) => {

        const units = unit?.map(data => data?.value)
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            const unitDrop = res_team?.data?.teamsdetails?.filter(data => company?.includes(data.company) && branch?.includes(data.branch) && units?.includes(data.unit))
            setTeamOptionEdit([
                ...unitDrop?.map((t) => ({
                    ...t,
                    label: t.teamname,
                    value: t.teamname,
                })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const handleTeamChangeEdit = (options) => {
        setValueTeamCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
        fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Employee")
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])
    };

    const customValueRendererTeamEdit = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
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
        fetchCompanyAll();
    }, []);



    const fetchEmployeeOptions = async (e, type) => {
        let designation = e?.map(data => data.value);
        try {
            let res_category = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const employeenames =
                type === "Designation" ? res_category?.data?.users?.filter(item => designation?.includes(item.designation))
                    : type === "Department" ? res_category?.data?.users?.filter(item => designation?.includes(item.department))
                        : type === "Employee" ? res_category?.data?.users?.filter(item => valueCompanyCat?.includes(item.company) &&
                            valueBranchCat?.includes(item.branch) &&
                            valueUnitCat?.includes(item.unit)
                            && designation?.includes(item.team)) : []


            const categoryall = [
                ...employeenames?.map((d) => ({
                    label: d.companyname,
                    value: d.companyname,
                })),
            ];
            setEmployeesNames(categoryall)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchEmployeeOptionsEdit = async (company, branch, unit, e, type) => {
        let designation = e?.map(data => data.value);
        try {
            let res_category = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const employeenames =
                type === "Designation" ? res_category?.data?.users?.filter(item => designation?.includes(item.designation))
                    : type === "Department" ? res_category?.data?.users?.filter(item => designation?.includes(item.department))
                        : type === "Employee" ? res_category?.data?.users?.filter(item => company?.includes(item.company) &&
                            branch?.includes(item.branch) &&
                            unit?.includes(item.unit)
                            && designation?.includes(item.team)) : []


            const categoryall = [
                ...employeenames?.map((d) => ({
                    label: d.companyname,
                    value: d.companyname,
                })),
            ];
            setEmployeesNamesEdit(categoryall)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Designation
    const handleDesignationChange = (options) => {
        setValueDesignation(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchEmployeeOptions(options, "Designation")
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
        fetchEmployeeOptions(options, "Department")
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
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteTaskGrouping(res?.data?.stasknonschedulegrouping);
            handleClickOpen();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // Alert delete popup
    let proid = deleteTaskGrouping._id;
    const delProcess = async () => {
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
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Deleted Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    //add function
    const sendRequest = async (item) => {
        setBtnLoad(true)

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
            setBtnLoad(false)
            setAddReqTodo([])
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Added Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } catch (err) {setBtnLoad(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.subcategory === "Please Select SubCategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select SubCategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.type === "Please Select Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.type === "Designation" && selectedDesignationOptions?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Designation"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.type === "Department" && selectedDepartmentOptions?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Department"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.type === "Employee" && selectedOptionsCompany?.length < 1) {
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
        }
        else if (taskGrouping.type === "Employee" && selectedOptionsBranch?.length < 1) {
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
        }
        else if (taskGrouping.type === "Employee" && selectedOptionsUnit?.length < 1) {
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
        }
        else if (taskGrouping.type === "Employee" && selectedOptionsTeam?.length < 1) {
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
        }
        else if (selectedEmployeeOptions?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee Names"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.frequency === "Please Select Schedule") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Schedule"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.priority === "Please Select Priority") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Priority"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.date === "" || taskGrouping.date === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Date"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.frequency === "Fixed" && taskGrouping.time === "" || taskGrouping.time === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Time"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.duration === undefined || taskGrouping.duration === "00:00" || taskGrouping?.duration?.includes("Mins")) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.breakupcount === "") {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Breakup count"} </p>{" "}
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
                        {"This Task Non-Schedule Grouping data already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
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
        setBranchOption([])
        setUnitOption([])
        setTeamOption([])
        // setDepartment([])
        setValueDesignation([])
        setValueDepartment([])
        setSelectedDesignationOptions([])
        setShowAlert(
            <>
                {" "}
                <CheckCircleOutlineIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />{" "}
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {" "}
                    {"Cleared Successfully👍"}{" "}
                </p>{" "}
            </>
        );
        handleClickOpenerr();
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
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.stasknonschedulegrouping);
            concordinateParticipants(res?.data?.stasknonschedulegrouping);
            handleClickOpenview();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....

    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.stasknonschedulegrouping);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const getReassignCode = async (e) => {
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
            fetchBranchAllEdit([...res?.data?.stasknonschedulegrouping?.company.map((t) => ({ ...t, label: t, value: t }))])

            setValueUnitCatEdit(res?.data?.stasknonschedulegrouping?.unit)
            setSelectedOptionsUnitEdit([...res?.data?.stasknonschedulegrouping?.unit.map((t) => ({ ...t, label: t, value: t }))])
            fetchUnitAllEdit([...res?.data?.stasknonschedulegrouping?.branch.map((t) => ({ ...t, label: t, value: t }))])

            setValueTeamCatEdit(res?.data?.stasknonschedulegrouping?.team)
            setSelectedOptionsTeamEdit([...res?.data?.stasknonschedulegrouping?.team.map((t) => ({ ...t, label: t, value: t }))])
            fetchTeamAllEdit(res?.data?.stasknonschedulegrouping?.company, res?.data?.stasknonschedulegrouping?.branch, [...res?.data?.stasknonschedulegrouping?.unit.map((t) => ({ ...t, label: t, value: t }))])


            setSelectedDesignationOptionsEdit([...res?.data?.stasknonschedulegrouping?.designation.map((t) => ({ ...t, label: t, value: t }))])
            setValueDesignationEdit(res?.data?.stasknonschedulegrouping?.designation)

            setSelectedDepartmentOptionsEdit([...res?.data?.stasknonschedulegrouping?.department.map((t) => ({ ...t, label: t, value: t }))])
            setValueDepartmentEdit(res?.data?.stasknonschedulegrouping?.department)



            setSelectedEmployeeOptionsEdit([...res?.data?.stasknonschedulegrouping?.employeenames.map((t) => ({ ...t, label: t, value: t }))])
            setValueEmployeeEdit(res?.data?.stasknonschedulegrouping?.employeenames)
            const typeChecking = res?.data?.stasknonschedulegrouping?.type === "Designation" ? [...res?.data?.stasknonschedulegrouping?.designation.map((t) => ({ ...t, label: t, value: t }))] :
                res?.data?.stasknonschedulegrouping?.type === "Department" ? [...res?.data?.stasknonschedulegrouping?.department.map((t) => ({ ...t, label: t, value: t }))]
                    : [...res?.data?.stasknonschedulegrouping?.team.map((t) => ({ ...t, label: t, value: t }))]
            fetchEmployeeOptionsEdit(res?.data?.stasknonschedulegrouping?.company, res?.data?.stasknonschedulegrouping?.branch, res?.data?.stasknonschedulegrouping?.unit, typeChecking, res?.data?.stasknonschedulegrouping?.type)




            handleClickOpenReassign();

       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    let updateby = taskGroupingEdit.updatedby;
    let addedby = taskGroupingEdit.addedby;
    let taskgroupingId = taskGroupingEdit._id;

    //editing the single data...

    const sendEditRequest = async () => {
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_TASK_NONSCHEDULEGROUPING}/${taskgroupingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    category: String(taskGroupingEdit.category),
                    subcategory: String(taskGroupingEdit.subcategory),
                    date: String(taskGroupingEdit.date),
                    time: taskGroupingEdit.frequency === "Fixed" ? String(taskGroupingEdit.time) : '',
                    type: String(taskGroupingEdit.type),
                    schedule: String(taskGroupingEdit.frequency),
                    priority: String(taskGroupingEdit.priority),
                    designation: valueDesignationEdit,
                    department: valueDepartmentEdit,
                    company: valueCompanyCatEdit,
                    branch: valueBranchCatEdit,
                    unit: valueUnitCatEdit,
                    team: valueTeamCatEdit,
                    employeenames: valueEmployeeEdit,
                    duration: String(taskGroupingEdit.duration),
                    breakupcount: String(taskGroupingEdit.breakupcount),
                    breakup: breakuphoursEdit,
                    required: [...requiredValueCateEdit],
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
            handleCloseModEdit();
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Updated Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const sendEditRequestReassingn = async (item) => {
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
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Updated Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };





    const editSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = taskGroupingArrayEdit?.some(
            (item) =>
                item.category == taskGroupingEdit.category &&
                item.subcategory == taskGroupingEdit.subcategory &&
                valueEmployeeEdit?.some(data => item?.employeenames?.includes(data))

        );

        if (taskGroupingEdit.category === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.subcategory === "Please Select SubCategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select SubCategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Please Select Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Designation" && selectedDesignationOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Designation"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Department" && selectedDepartmentOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Department"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsCompanyEdit?.length < 1) {
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
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsBranchEdit?.length < 1) {
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
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsUnitEdit?.length < 1) {
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
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsTeamEdit?.length < 1) {
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
        }
        else if (selectedEmployeeOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee Names"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.frequency === "Please Select Schedule") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Schedule"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.priority === "Please Select Priority") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Priority"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.date === "" || taskGroupingEdit.date === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Date"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.frequency === "Fixed" && taskGroupingEdit.time === "" || taskGroupingEdit.time === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Time"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit?.duration === undefined || taskGroupingEdit?.duration === "00:00" || taskGroupingEdit?.duration?.includes("Mins")) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.breakupcount === "") {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Breakup count"} </p>{" "}
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
                        {"This Task NonSchedule Grouping data already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            sendEditRequest();
        }
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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.subcategory === "Please Select SubCategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select SubCategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Please Select Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Designation" && selectedDesignationOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Designation"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.type === "Department" && selectedDepartmentOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Department"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (taskGroupingEdit.type === "Employee" && selectedOptionsCompanyEdit?.length < 1) {
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
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsBranchEdit?.length < 1) {
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
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsUnitEdit?.length < 1) {
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
        }
        else if (taskGroupingEdit.type === "Employee" && selectedOptionsTeamEdit?.length < 1) {
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
        }
        else if (selectedEmployeeOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee Names"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.schedule === "Please Select Schedule") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Schedule"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.priority === "Please Select Priority") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Priority"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.date === "" || taskGroupingEdit.date === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Date"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.schedule === "Fixed" && taskGroupingEdit.time === "" || taskGroupingEdit.time === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Time"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit?.duration === undefined || taskGroupingEdit?.duration === "00:00" || taskGroupingEdit?.duration?.includes("Mins")) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGroupingEdit.breakupcount === "") {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Breakup count"} </p>{" "}
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
                        {"Task Non-Schedule Grouping already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatchtask) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"These Data is already exists in Task!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const empName = valueEmployeeEdit?.map(data => sendEditRequestReassingn(data))

        }
    };
    //get all Task Schedule Grouping.

    const fetchTaskGrouping = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ALL_TASK_NONSCHEDULEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setTaskGroupingArray(res_freq?.data?.tasknonschedulegrouping);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const bulkdeletefunction = async () => {
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
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchTaskGrouping();
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Deleted Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all Task Schedule Grouping.

    const fetchTaskGroupingAll = async () => {
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
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchTaskGroupingAllReassign = async (e) => {
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
                    category:taskGroupingEdit.category,
                    subcategory:taskGroupingEdit.subcategory,
                    username: [...valueEmployeeEdit],
                    taskdate: taskGroupingEdit.date,
                    tasktime: taskGroupingEdit.time,
                })
            ])
           
            setTaskGroupingArrayEdit(res_freq?.data?.tasknonschedulegrouping);
            setTaskGroupingLogEdit(res_freq_task?.data?.taskforuser)
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "TaskNonScheduleGrouping.png");
                });
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
    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskGroupingArray?.map((item, index) => ({
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
            employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            date: moment(item.date).format("DD-MM-YYYY"),
            time: item?.time,
            duration: item.duration,
            breakup: item.breakup,
            breakupcount: item.breakupcount,
            breakup: item.breakup,
            required: item.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

        }));
        setItems(itemsWithSerialNumber);
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
            headerName: "Checkbox",
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
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 150,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "SubCategory",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 100,
            hide: !columnVisibility.schedule,
            headerClassName: "bold-header",
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
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {isUserRoleCompare?.includes("etasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )} */}
                    {isUserRoleCompare?.includes("dtasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vtasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itasknonschedulegrouping") && (
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
                    &ensp;
                    {isUserRoleCompare?.includes("itasknonschedulegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenReassign();
                                getReassignCode(params.row.id);
                            }}
                        >
                            Reassign
                        </Button>
                    )}
                    &ensp;
                    &ensp;
                    {isUserRoleCompare?.includes("itasknonschedulegrouping") && (
                        <Link to={`/task/tasknonschedulelog/${params.row.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
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
            <Typography sx={userStyle.HeaderText}>Task Non-Schedule Grouping</Typography>

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
                                                options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
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
                                                    setEmployeesNames([])
                                                    setValueEmployee([])
                                                    setSelectedEmployeeOptions([])



                                                    setSelectedDesignationOptions([])
                                                    setValueDesignation([])

                                                    setSelectedOptionsCompany([])
                                                    setValueCompanyCat([])

                                                    setSelectedOptionsBranch([])
                                                    setValueBranchCat([])
                                                    setBranchOption([])

                                                    setSelectedOptionsUnit([])
                                                    setValueUnitCat([])
                                                    setUnitOption([])


                                                    setSelectedDepartmentOptions([])
                                                    setValueDepartment([])


                                                    setSelectedOptionsTeam([])
                                                    setValueTeamCat([])
                                                    setTeamOption([])

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>



                                    {taskGrouping.type === "Designation" ?
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Designation<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    options={designation}
                                                    value={selectedDesignationOptions}
                                                    onChange={handleDesignationChange}
                                                    valueRenderer={customValueRendererDesignation}
                                                    labelledBy="Please Select Designation"
                                                />

                                            </FormControl>
                                        </Grid> :
                                        taskGrouping.type === "Department" ?
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect size="small"
                                                        options={department}
                                                        value={selectedDepartmentOptions}
                                                        onChange={handleDepartmentChange}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />

                                                </FormControl>
                                            </Grid>

                                            :
                                            taskGrouping.type === "Employee" ?

                                                <>

                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Company <b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={companyOption}
                                                                value={selectedOptionsCompany}
                                                                onChange={(e) => {
                                                                    handleCompanyChange(e);
                                                                }}
                                                                valueRenderer={customValueRendererCompany}
                                                                labelledBy="Please Select Company"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Branch<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={branchOption}
                                                                value={selectedOptionsBranch}
                                                                onChange={(e) => {
                                                                    handleBranchChange(e);
                                                                }}
                                                                valueRenderer={customValueRendererBranch}
                                                                labelledBy="Please Select Branch"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Unit<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={unitOption}
                                                                value={selectedOptionsUnit}
                                                                onChange={(e) => {
                                                                    handleUnitChange(e);
                                                                }}
                                                                valueRenderer={customValueRendererUnit}
                                                                labelledBy="Please Select Unit"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Team<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={teamOption
                                                                    ?.filter((u) => valueUnitCat?.includes(u.unit))
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
                                                : ""
                                    }
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
                                    <LoadingButton loading={btnLoad} variant='contained' color='primary' onClick={handleSubmit} >Submit</LoadingButton>

                                    <Button sx={userStyle.btncancel}
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
                            {isUserRoleCompare?.includes("bdtasknonschedulegrouping") && (
                                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
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
                                <StyledDataGrid
                                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
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
                            <TableCell> SI.No</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>SubCategory</TableCell>
                            <TableCell>Schedule</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell> Designation</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Employee Names</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>


                            <TableCell>Duration</TableCell>
                            <TableCell>Breakup Count</TableCell>
                            <TableCell>Breakup</TableCell>
                            <TableCell>Required</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.schedule}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.designation}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.employeenames}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.time}</TableCell>

                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.breakupcount}</TableCell>
                                    <TableCell>{row.breakup}</TableCell>

                                    <TableCell>{row.required}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*Export XL Data  */}
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
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                        :
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
                            Task Non - Schedule Grouping Info
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
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
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Task Non - Schedule Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{taskGroupingEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">SubCategory</Typography>
                                    <Typography>{taskGroupingEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{taskGroupingEdit?.type}</Typography>
                                </FormControl>
                            </Grid>

                            {taskGroupingEdit.type === "Designation" ?
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6"> Designation</Typography>
                                        <Typography>{taskGroupingEdit.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                    </FormControl>
                                </Grid> :
                                taskGroupingEdit.type === "Department" ?
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Department</Typography>
                                            <Typography>{taskGroupingEdit.department?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                        </FormControl>
                                    </Grid>

                                    :
                                    taskGroupingEdit.type === "Employee" ?

                                        <>

                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Company</Typography>
                                                    <Typography>{taskGroupingEdit.company?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Branch</Typography>
                                                    <Typography>{taskGroupingEdit.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Unit</Typography>
                                                    <Typography>{taskGroupingEdit.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Team</Typography>
                                                    <Typography>{taskGroupingEdit.team?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                        </>
                                        : ""
                            }

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Names</Typography>
                                    <Typography>{taskGroupingEdit.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Schedule</Typography>
                                    <Typography>{`${taskGroupingEdit?.schedule}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Priority</Typography>
                                    <Typography>{`${taskGroupingEdit?.priority}`}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Date</Typography>
                                    <Typography>{`${moment(taskGroupingEdit.date).format("DD-MM-YYYY")}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Time</Typography>
                                    <Typography>{`${taskGroupingEdit.time}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Duration</Typography>
                                    <Typography>{taskGroupingEdit.duration}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Breakup Count</Typography>
                                    <Typography>{taskGroupingEdit.breakupcount}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Breakup</Typography>
                                    <Typography>{`${taskGroupingEdit.breakup} mins`}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Required</Typography>
                                    <Typography>{concReqs}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
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
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error"
                            onClick={(e) => bulkdeletefunction(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: 'Auto',
                        '& .MuiPaper-root': {
                            overflow: 'Auto',
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Task Non Schedule Grouping
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



                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
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
                                                setEmployeesNamesEdit([])
                                                setValueEmployeeEdit([])
                                                setSelectedEmployeeOptionsEdit([])



                                                setSelectedDesignationOptionsEdit([])
                                                setValueDesignationEdit([])

                                                setSelectedOptionsCompanyEdit([])
                                                setValueCompanyCatEdit([])

                                                setSelectedOptionsBranchEdit([])
                                                setValueBranchCatEdit([])
                                                setBranchOptionEdit([])

                                                setSelectedOptionsUnitEdit([])
                                                setValueUnitCatEdit([])
                                                setUnitOptionEdit([])


                                                setSelectedDepartmentOptionsEdit([])
                                                setValueDepartmentEdit([])


                                                setSelectedOptionsTeamEdit([])
                                                setValueTeamCatEdit([])
                                                setTeamOptionEdit([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>



                                {taskGroupingEdit.type === "Designation" ?
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Designation<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                                options={designation}
                                                value={selectedDesignationOptionsEdit}
                                                onChange={handleDesignationChangeEdit}
                                                valueRenderer={customValueRendererDesignationEdit}
                                                labelledBy="Please Select Designation"
                                            />

                                        </FormControl>
                                    </Grid> :
                                    taskGroupingEdit.type === "Department" ?
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    options={department}
                                                    value={selectedDepartmentOptionsEdit}
                                                    onChange={handleDepartmentChangeEdit}
                                                    valueRenderer={customValueRendererDepartmentEdit}
                                                    labelledBy="Please Select Department"
                                                />

                                            </FormControl>
                                        </Grid>

                                        :
                                        taskGroupingEdit.type === "Employee" ?

                                            <>

                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Company <b style={{ color: "red" }}>*</b>
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
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Branch<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={branchOptionEdit}
                                                            value={selectedOptionsBranchEdit}
                                                            onChange={(e) => {
                                                                handleBranchChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererBranchEdit}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Unit<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={unitOptionEdit}
                                                            value={selectedOptionsUnitEdit}
                                                            onChange={(e) => {
                                                                handleUnitChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererUnitEdit}
                                                            labelledBy="Please Select Unit"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Team<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={teamOptionEdit}
                                                            value={selectedOptionsTeamEdit}
                                                            onChange={(e) => {
                                                                handleTeamChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererTeamEdit}
                                                            labelledBy="Please Select Team"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : ""
                                }
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
                                                label: taskGroupingEdit.frequency,
                                                value: taskGroupingEdit.frequency,
                                            }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({
                                                    ...taskGroupingEdit,
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
                                {taskGroupingEdit.frequency === "Fixed" && <Grid item md={3} xs={12} sm={12}>
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
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
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



                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
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
                                                setEmployeesNamesEdit([])
                                                setValueEmployeeEdit([])
                                                setSelectedEmployeeOptionsEdit([])

                                                setSelectedDesignationOptionsEdit([])
                                                setValueDesignationEdit([])

                                                setSelectedOptionsCompanyEdit([])
                                                setValueCompanyCatEdit([])

                                                setSelectedOptionsBranchEdit([])
                                                setValueBranchCatEdit([])
                                                setBranchOptionEdit([])

                                                setSelectedOptionsUnitEdit([])
                                                setValueUnitCatEdit([])
                                                setUnitOptionEdit([])

                                                setSelectedDepartmentOptionsEdit([])
                                                setValueDepartmentEdit([])

                                                setSelectedOptionsTeamEdit([])
                                                setValueTeamCatEdit([])
                                                setTeamOptionEdit([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>



                                {taskGroupingEdit?.type === "Designation" ?
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Designation<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                                options={designation}
                                                value={selectedDesignationOptionsEdit}
                                                onChange={handleDesignationChangeEdit}
                                                valueRenderer={customValueRendererDesignationEdit}
                                                labelledBy="Please Select Designation"
                                            />

                                        </FormControl>
                                    </Grid> :
                                    taskGroupingEdit?.type === "Department" ?
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    options={department}
                                                    value={selectedDepartmentOptionsEdit}
                                                    onChange={handleDepartmentChangeEdit}
                                                    valueRenderer={customValueRendererDepartmentEdit}
                                                    labelledBy="Please Select Department"
                                                />

                                            </FormControl>
                                        </Grid>

                                        :
                                        taskGroupingEdit?.type === "Employee" ?

                                            <>

                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Company <b style={{ color: "red" }}>*</b>
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
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Branch<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={branchOptionEdit}
                                                            value={selectedOptionsBranchEdit}
                                                            onChange={(e) => {
                                                                handleBranchChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererBranchEdit}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Unit<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={unitOptionEdit}
                                                            value={selectedOptionsUnitEdit}
                                                            onChange={(e) => {
                                                                handleUnitChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererUnitEdit}
                                                            labelledBy="Please Select Unit"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Team<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={teamOptionEdit}
                                                            value={selectedOptionsTeamEdit}
                                                            onChange={(e) => {
                                                                handleTeamChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererTeamEdit}
                                                            labelledBy="Please Select Team"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : ""
                                }
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
                                    <Button variant="contained" onClick={editSubmitReassign}>
                                        {" "}
                                        Reassign
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseReassign}>
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
        </Box>
    );
}

export default TaskNonScheduleGrouping;
