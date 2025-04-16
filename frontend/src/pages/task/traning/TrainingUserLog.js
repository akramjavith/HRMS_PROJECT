import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    InputLabel,
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
import { FaPlus } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVICE } from "../../../services/Baseservice";
import StyledDataGrid from "../../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
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
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams } from "react-router-dom";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function TrainingUserLog() {
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [taskGrouping, setTaskGrouping] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        date: "",
        breakupcount: "",
        type: "Please Select Type",
    });
    const [taskGroupingEdit, setTaskGroupingEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        schedule: "Please Select Schedule",
        frequency: "Please Select Frequency",
        duration: "00:00",
        breakupcount: "",
        hour: "",
        min: "",
        timetype: "",
        monthdate: "",
        date: "",
        annumonth: "",
        annuday: ""
    });



    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
    const [taskGroupingArray, setTaskGroupingArray] = useState([]);
    const [taskGroupingArrayEdit, setTaskGroupingArrayEdit] = useState([]);

    const [categoryOption, setCategoryOption] = useState([]);
    const [subCategoryOption, setSubCategoryOption] = useState([]);
    const [filteredSubCategory, setFilteredSubCategory] = useState([]);
    const [filteredSubCategoryEdit, setFilteredSubCategoryEdit] = useState([]);


    const [addReqTodo, setAddReqTodo] = useState([]);
    const [viewReqTodo, setViewReqTodo] = useState([]);
    const [isTodoEdit, setIsTodoEdit] = useState(
        Array(addReqTodo.length).fill(false)
    );
    const [todoSubmit, setTodoSubmit] = useState(false);
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




    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);
    const [hours, setHours] = useState("Hrs");
    const [minutes, setMinutes] = useState("Mins");
    const [hoursEdit, setHoursEdit] = useState("Hrs");
    const [minutesEdit, setMinutesEdit] = useState("Mins");

    const [breakuphrsOption, setbreakupHrsOption] = useState([]);
    const [breakupminsOption, setbreakupMinsOption] = useState([]);
    const [breakuphours, setbreakupHours] = useState("");
    const [breakuphoursEdit, setbreakupHoursEdit] = useState("");
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
                    AssignDate: item.assigndate,
                    TrainingAssign: item.taskassign,
                    Tablerainingdetails: item.trainingdetails,
                    Status: item.status,
                    Duration: item.duration,
                    Mode: item.mode,
                    Required: item.required,
                    Date: item.date,
                    Time: item.time,
                    Deadlinedate: item.deadlinedate,
                    Frequency: item.frequency,
                    Schedule: item.schedule,
                    Timetodo: item?.timetodo,
                    Weekdays: item?.weekdays,
                    Monthdate: item.monthdate,
                    AnnualMonth: item?.annumonth,
                    Duefromdoj: item.duefromdoj,
                    Type: item.type,
                    Designation: item.designation,
                    Department: item.department,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    Employeenames: item.employeenames,
                    Testnames: item.testnames,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((item, index) => ({
                    "Sno": index + 1,
                    AssignDate: item.assigndate,
                    TrainingAssign: item.taskassign,
                    Tablerainingdetails: item.trainingdetails,
                    Status: item.status,
                    Duration: item.duration,
                    Mode: item.mode,
                    Required: item.required,
                    Date: item.date,
                    Time: item.time,
                    Deadlinedate: item.deadlinedate,
                    Frequency: item.frequency,
                    Schedule: item.schedule,
                    Timetodo: item?.timetodo,
                    Weekdays: item?.weekdays,
                    Monthdate: item.monthdate,
                    AnnualMonth: item?.annumonth,
                    Duefromdoj: item.duefromdoj,
                    Type: item.type,
                    Designation: item.designation,
                    Department: item.department,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    Employeenames: item.employeenames,
                    Testnames: item.testnames,
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
                assigndate: item.assigndate,
                taskassign: item.taskassign,
                trainingdetails: item.trainingdetails,
                status: item.status,
                duration: item.duration,
                mode: item.mode,
                required: item.required,
                date: item.date,
                time: item.time,
                deadlinedate: item.deadlinedate,
                frequency: item.frequency,
                schedule: item.schedule,
                timetodo: item?.timetodo,
                weekdays: item?.weekdays,
                monthdate: item.monthdate,
                AnnualMonth: item?.annumonth,
                duefromdoj: item.duefromdoj,
                type: item.type,
                designation: item.designation,
                department: item.department,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                employeenames: item.employeenames,
                testnames: item.testnames,
            })) :
            items?.map(item => ({
                serialNumber: serialNumberCounter++,
                assigndate: item.assigndate,
                taskassign: item.taskassign,
                trainingdetails: item.trainingdetails,
                status: item.status,
                duration: item.duration,
                mode: item.mode,
                required: item.required,
                date: item.date,
                time: item.time,
                deadlinedate: item.deadlinedate,
                frequency: item.frequency,
                schedule: item.schedule,
                timetodo: item?.timetodo,
                weekdays: item?.weekdays,
                monthdate: item.monthdate,
                AnnualMonth: item?.annumonth,
                duefromdoj: item.duefromdoj,
                type: item.type,
                designation: item.designation,
                department: item.department,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                employeenames: item.employeenames,
                testnames: item.testnames,
            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 3,
                cellWidth :"auto"
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("TrainingUserLog.pdf");
    };







    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        status: true,
        assigndate: true,
        taskassign: true,
        trainingdetails: true,
        status: true,
        required: true,
        date: true,
        time: true,
        deadlinedate: true,
        duefromdoj: true,
        duration: true,
        mode: true,
        testnames: true,
        frequency: true,
        schedule: true,
        type: true,
        designation: true,
        department: true,
        timetodo: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeenames: true,
        weekdays: true,
        annumonth: true,
        monthdate: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [taskGroupingArray]);





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
    const requiredOption = [{ label: "Photo", value: "Photo" }, { label: "Documents", value: "Documents" }]
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







    const addTodo = () => {
        const result = {
            hour: taskGrouping?.hour,
            min: taskGrouping?.min,
            timetype: taskGrouping?.timetype,

        }
        if (taskGrouping?.hour === "" || taskGrouping?.min === "" || taskGrouping?.timetype === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Hour, Minutes and Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (addReqTodo?.some(data => data?.hour === taskGrouping?.hour && data?.min === taskGrouping?.min && data?.timetype === taskGrouping?.timetype)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Already Added"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            setAddReqTodo((prevTodos) => [...prevTodos, result]);
            setIsTodoEdit(Array(addReqTodo.length).fill(false));
        }


    };

    const deleteTodo = (index) => {
        const updatedTodos = [...addReqTodo];
        updatedTodos.splice(index, 1);
        setAddReqTodo(updatedTodos);

    };
    const handleEditTodoCreate = (index, key, newValue) => {
        // Assuming addReqTodo is an array of objects
        const updatedTodos = addReqTodo.map((todo, i) => {
            if (i === index) {
                // Update the specific key-related value
                const updatedTodo = { ...todo, [key]: newValue };
                return updatedTodo;
            }
            return todo;
        });

        setAddReqTodo(updatedTodos);
    };

    const handleWeeklyChange = (options) => {
        setValueWeekly(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedWeeklyOptions(options);
    };

    const customValueRendererCate = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Days";
    };

    const addTodoEdit = () => {
        const result = {
            hour: taskGroupingEdit?.hour,
            min: taskGroupingEdit?.min,
            timetype: taskGroupingEdit?.timetype,

        }

        if ((taskGroupingEdit?.hour === "" || taskGroupingEdit?.hour === undefined) || (taskGroupingEdit?.min === "" || taskGroupingEdit?.min === undefined) || (taskGroupingEdit?.timetype === "" || taskGroupingEdit?.timetype === undefined)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Hour, Minutes and Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (addReqTodoEdit?.some(data => data?.hour === taskGroupingEdit?.hour && data?.min === taskGroupingEdit?.min && data?.timetype === taskGroupingEdit?.timetype)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Already Added"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            setAddReqTodoEdit((prevTodos) => [...prevTodos, result]);
            setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
        }


    };

    const deleteTodoEdit = (index) => {
        const updatedTodos = [...addReqTodoEdit];
        updatedTodos.splice(index, 1);
        setAddReqTodoEdit(updatedTodos);

    };
    const handleEditTodoEdit = (index, key, newValue) => {
        // Assuming addReqTodo is an array of objects
        const updatedTodos = addReqTodoEdit?.map((todo, i) => {


            if (i === index) {
                // Update the specific key-related value
                const updatedTodo = { ...todo, [key]: newValue };
                return updatedTodo;
            }
            return todo;
        });

        setAddReqTodoEdit(updatedTodos);
    };

    const handleWeeklyChangeEdit = (options) => {
        setValueWeeklyEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedWeeklyOptionsEdit(options);
    };

    const customValueRendererCateEdit = (valueCate, _days) => {
        return valueCate?.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Days";
    };



    //add function
    const sendRequest = async () => {


        try {
            let brandCreate = await axios.post(SERVICE.CREATE_TASK_NONSCHEDULEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: String(taskGrouping.category),
                subcategory: String(taskGrouping.subcategory),
                date: String(taskGrouping.date),
                time: String(taskGrouping.time),
                type: String(taskGrouping.type),
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
                breakupcount: "",
                duration: "00:00",
            })
            setbreakupHours("")
            setHours("hrs")
            setMinutes("00")
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
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        else if (taskGrouping.date === "" || taskGrouping.date === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Choose Date"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }
        else if (taskGrouping.time === "" || taskGrouping.time === undefined) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please choose Time"} </p>{" "}
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

        else if (requiredValueCate?.length === 0) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Required"} </p>{" "}
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
                        {"This Task Non-Schedule Grouping data already exits!"}
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
            date: "",
            breakupcount: "",
            time: "",
        });
        setSelectedWeeklyOptions([])
        setAddReqTodo([])
        setHours("Hrs");
        setMinutes("Mins");
        setbreakupHours("");
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


    //get all Task Schedule Grouping.
    const ids = useParams().id;
    const fetchTaskGrouping = async () => {
        try {
            let res_freq = await axios.get(`${SERVICE.SINGLE_TRAININGDETAILS}/${ids}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setTaskGroupingArray(res_freq?.data?.strainingdetails?.trainingdetailslog);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "TrainingUserLog.png");
                });
            });
        }
    };
    // pdf.....
    const columns = [
        { title: "Assign Date", field: "assigndate" },
        { title: "Training Assign", field: "taskassign" },
        { title: "Training Details", field: "trainingdetails" },
        { title: "Status", field: "status" },
        { title: "Duration", field: "duration" },
        { title: "Mode", field: "mode" },
        { title: "Required", field: "required" },
        { title: "Date", field: "date" },
        { title: "Time", field: "time" },
        { title: "Dead Line Date", field: "deadlinedate" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Time", field: "timetodo" },
        { title: "Days", field: "weekdays" },
        { title: "MonthDate", field: "monthdate" },
        { title: "Annual", field: "annumonth" },
        { title: "Due From DOJ", field: "duefromdoj" },
        { title: "Type", field: "type" },
        { title: "Department", field: "department" },
        { title: "Designation", field: "designation" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Responsible Person", field: "employeenames" },
        { title: "Test Names", field: "testnames" },

    ];

    // Excel
    const fileName = "TrainingUserLog";
    // get particular columns for export excel


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "TrainingUserLog",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskGroupingArray?.map((item, index) => ({
            // ...item,
            serialNumber: index + 1,
            id: item._id,
            serialNumber: index + 1,
            type: item.type,
            duration: item.duration,
            trainingdetails: item.trainingdetails,
            duefromdoj: item.estimationtime + " " + item.estimation,
            mode: item.mode,
            frequency: item.frequency,
            schedule: item.schedule,
            required: item.required,
            date: item.date ? moment(item.date).format("DD-MM-YYYY") : "",
            time: item.time,
            assigndate: item.assigndate,
            testnames: item.testnames,
            taskassign: item.taskassign,
            status: item.status,
            deadlinedate: item.deadlinedate ? moment(item.deadlinedate).format("DD-MM-YYYY") : "",
            designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            timetodo: item?.timetodo?.length > 0 ? item?.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`).toString() : "",
            weekdays: item?.weekdays?.length > 0 ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
            annumonth: item?.frequency === "Annually" ? `${item?.annumonth} month ${item?.annuday} days` : "",
            monthdate: item?.monthdate,
            department: item.department?.length > 0 ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
            company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

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
            field: "assigndate",
            headerName: "Assign Date",
            flex: 0,
            width: 180,
            hide: !columnVisibility.assigndate,
            headerClassName: "bold-header",
        },
        {
            field: "taskassign",
            headerName: "Training Assign",
            flex: 0,
            width: 180,
            hide: !columnVisibility.taskassign,
            headerClassName: "bold-header",
        },
        {
            field: "assignstatus",
            headerName: "Assign Status",
            flex: 0,
            width: 180,
            hide: !columnVisibility.assignstatus,
            headerClassName: "bold-header",
        },
        {
            field: "trainingdetails",
            headerName: "Training Details",
            flex: 0,
            width: 180,
            hide: !columnVisibility.trainingdetails,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 100,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 100,
            hide: !columnVisibility.duration,
            headerClassName: "bold-header",
        },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 100,
            hide: !columnVisibility.mode,
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
            width: 150,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },
        {
            field: "deadlinedate",
            headerName: "DeadLine Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.deadlinedate,
            headerClassName: "bold-header",
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 150,
            hide: !columnVisibility.frequency,
            headerClassName: "bold-header",
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 150,
            hide: !columnVisibility.schedule,
            headerClassName: "bold-header",
        },
        {
            field: "timetodo",
            headerName: "Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.timetodo,
            headerClassName: "bold-header",
        },
        {
            field: "weekdays",
            headerName: "Days",
            flex: 0,
            width: 150,
            hide: !columnVisibility.weekdays,
            headerClassName: "bold-header",
        },
        {
            field: "monthdate",
            headerName: "Month Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.monthdate,
            headerClassName: "bold-header",
        },
        {
            field: "annumonth",
            headerName: "Annual",
            flex: 0,
            width: 150,
            hide: !columnVisibility.annumonth,
            headerClassName: "bold-header",
        },
        {
            field: "duefromdoj",
            headerName: "Due From Doj",
            flex: 0,
            width: 150,
            hide: !columnVisibility.duefromdoj,
            headerClassName: "bold-header",
        },

        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },

        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "employeenames",
            headerName: "Employee Names",
            flex: 0,
            width: 180,
            hide: !columnVisibility.employeenames,
            headerClassName: "bold-header",
        },

        {
            field: "testnames",
            headerName: "Test Names",
            flex: 0,
            width: 180,
            hide: !columnVisibility.testnames,
            headerClassName: "bold-header",
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            trainingdetails: item.trainingdetails,
            type: item.type,
            duration: item.duration,
            duefromdoj: item.duefromdoj,
            mode: item.mode,
            required: item.required,
            taskassign: item.taskassign,
            date: item.date,
            status: item.status,
            testnames: item.testnames,
            time: item.time,
            deadlinedate: item.deadlinedate,
            frequency: item.frequency,
            schedule: item.schedule,
            assigndate: item.assigndate,
            designation: item.designation,
            timetodo: item?.timetodo,
            department: item.department,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            weekdays: item?.weekdays,
            annumonth: item?.annumonth,
            monthdate: item.monthdate,
            team: item.team,
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
        const breakUpTime = (hourCal * 60 + MinsCal) / breakupCount;
        setbreakupHours(breakUpTime)



    }

    const handleTimeCalculateEdit = (e) => {
        const breakupCount = e ? Number(e) : 1;
        const hourCal = hoursEdit ? Number(hoursEdit) : 0;
        const MinsCal = minutesEdit ? Number(minutesEdit) : 0;
        const breakUpTime = (hourCal * 60 + MinsCal) / breakupCount;
        setbreakupHoursEdit(breakUpTime)



    }
    return (
        <Box>
            <Headtitle title={"TRAINING USER LOG"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Manage Training User Log</Typography>

            <br />   <br />
            {/* ****** Table Start ****** */}
            {!loader ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("ltrainingpostponeduserpanel") && (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}


                            <Grid container spacing={2}>
                                <Grid item md={10} xs={12} sm={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Training User Log List
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Link to={`/task/traning/master/trainingdetails`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                        <Button variant="contained" >Back</Button>
                                    </Link>
                                </Grid>
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
                                        {isUserRoleCompare?.includes("exceltrainingpostponeduserpanel") && (
                                            // <>
                                            //     <ExportXL csvData={filteredData.map((item, index) => {
                                            //         return {
                                            //             Sno: item.serialNumber,
                                            //             AssignDate: item.assigndate,
                                            //             TrainingAssign: item.taskassign,
                                            //             Tablerainingdetails: item.trainingdetails,
                                            //             Status: item.status,
                                            //             Duration: item.duration,
                                            //             Mode: item.mode,
                                            //             Required: item.required,
                                            //             Date: item.date,
                                            //             Time: item.time,
                                            //             Deadlinedate: item.deadlinedate,
                                            //             Frequency: item.frequency,
                                            //             Schedule: item.schedule,
                                            //             Timetodo: item?.timetodo,
                                            //             Weekdays: item?.weekdays,
                                            //             Monthdate: item.monthdate,
                                            //             AnnualMonth: item?.annumonth,
                                            //             Duefromdoj: item.duefromdoj,
                                            //             Type: item.type,
                                            //             Designation: item.designation,
                                            //             Department: item.department,
                                            //             Company: item.company,
                                            //             Branch: item.branch,
                                            //             Unit: item.unit,
                                            //             Team: item.team,
                                            //             Employeenames: item.employeenames,
                                            //             Testnames: item.testnames,

                                            //         };
                                            //     })} fileName={fileName} />
                                            // </>

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtrainingpostponeduserpanel") && (
                                            // <>
                                            //     <ExportCSV csvData={filteredData.map((item, index) => {
                                            //         return {
                                            //             Sno: item.serialNumber,
                                            //             AssignDate: item.assigndate,
                                            //             TrainingAssign: item.taskassign,
                                            //             Tablerainingdetails: item.trainingdetails,
                                            //             Status: item.status,
                                            //             Duration: item.duration,
                                            //             Mode: item.mode,
                                            //             Required: item.required,
                                            //             Date: item.date,
                                            //             Time: item.time,
                                            //             Deadlinedate: item.deadlinedate,
                                            //             Frequency: item.frequency,
                                            //             Schedule: item.schedule,
                                            //             Timetodo: item?.timetodo,
                                            //             Weekdays: item?.weekdays,
                                            //             Monthdate: item.monthdate,
                                            //             AnnualMonth: item?.annumonth,
                                            //             Duefromdoj: item.duefromdoj,
                                            //             Type: item.type,
                                            //             Designation: item.designation,
                                            //             Department: item.department,
                                            //             Company: item.company,
                                            //             Branch: item.branch,
                                            //             Unit: item.unit,
                                            //             Team: item.team,
                                            //             Employeenames: item.employeenames,
                                            //             Testnames: item.testnames,
                                            //         };
                                            //     })} fileName={fileName} />
                                            // </>
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtrainingpostponeduserpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftrainingpostponeduserpanel") && (
                                            // <>
                                            //     <Button
                                            //         sx={userStyle.buttongrp}
                                            //         onClick={() => downloadPdf()}
                                            //     >
                                            //         <FaFilePdf />
                                            //         &ensp;Export to PDF&ensp;
                                            //     </Button>
                                            // </>

                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetrainingpostponeduserpanel") && (
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
                            <TableCell>Assign Date</TableCell>
                            <TableCell>Training Assign</TableCell>
                            <TableCell>Training Details</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Required</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>DeadlineDate</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Schedule</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Date Wise</TableCell>
                            <TableCell>Month Date</TableCell>
                            <TableCell>Annually</TableCell>
                            <TableCell>Due From DOJ</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Employee Names</TableCell>
                            <TableCell>Test Names</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.assigndate}</TableCell>
                                    <TableCell>{row.taskassign}</TableCell>
                                    <TableCell>{row.trainingdetails}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.mode}</TableCell>
                                    <TableCell>{row.required}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.deadlinedate}</TableCell>
                                    <TableCell>{row.frequency}</TableCell>
                                    <TableCell>{row.schedule}</TableCell>
                                    <TableCell>{row.timetodo}</TableCell>
                                    <TableCell>{row?.weekdays}</TableCell>
                                    <TableCell>{row?.monthdate}</TableCell>
                                    <TableCell>{row?.annumonth}</TableCell>
                                    <TableCell>{row?.duefromdoj}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.designation}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.employeenames}</TableCell>
                                    <TableCell>{row.testnames}</TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

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









            <br />
        </Box>
    );
}

export default TrainingUserLog;
