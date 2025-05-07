import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    Select,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Paper,
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
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { handleApiError } from "../../components/Errorhandling";
import { Link } from "react-router-dom";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuIcon from "@mui/icons-material/Menu";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';


function TaskDesignationGrouping() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
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
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };
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
    let exportColumnNames = [
        'Category', 'SubCategory',
        'Frequency', 'Type',
        'Designation', 'Department',
        'Company', 'Branch',
        'Unit', 'Team',
        'Employee Names', 'Schedule Status', 'Task Assign', 'Description'
    ];
    let exportRowValues = [
        'category', 'subcategory',
        'frequency', 'type',
        'designation', 'department',
        'company', 'branch',
        'unit', 'team',
        'employeenames', 'schedulestatus', 'taskassign', 'description'
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
            pagename: String("Task/Task Assign Grouping"),
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
    const [taskDesignationGrouping, setTaskDesignationGrouping] = useState({
        designation: "Please Select Designation",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        type: "Please Select Type",
        schedulestatus: "Active",
        taskassign: "Individual",
        priority: "Please Select Priority",
    });

    const [taskDesignationGroupingEdit, setTaskDesignationGroupingEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",

    });
    const [taskDesignationGroupingall, setTaskDesignationGroupingall] = useState([]);
    const [taskDesigDatas, setTaskDesigDatas] = useState([]);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [agenda, setAgenda] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [allduemasteredit, setAllduemasteredit] = useState([]);

    const [scheduleGrouping, setScheduleGrouping] = useState([]);
    let [valueWeekly, setValueWeekly] = useState([]);
    let [valueDesignation, setValueDesignation] = useState([]);
    const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
    const [selectedDesignationOptions, setSelectedDesignationOptions] = useState([]);
    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [companyOption, setCompanyOption] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);
    let [valueEmployee, setValueEmployee] = useState([]);
    const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState([]);
    const [scheduleGroupingEdit, setScheduleGroupingEdit] = useState([]);


    let [valueDepartment, setValueDepartment] = useState([]);
    const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState([]);
    let [valueDepartmentEdit, setValueDepartmentEdit] = useState([]);

    let [valueWeeklyEdit, setValueWeeklyEdit] = useState("");
    const [selectedWeeklyOptionsEdit, setSelectedWeeklyOptionsEdit] = useState([]);
    let [valueDesignationEdit, setValueDesignationEdit] = useState("");
    const [selectedDesignationOptionsEdit, setSelectedDesignationOptionsEdit] = useState([]);
    const [selectedDepartmentOptionsEdit, setSelectedDepartmentOptionsEdit] = useState([]);
    //company multiselect

    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);



    const [branchOptionEdit, setBranchOptionEdit] = useState([]);

    const [unitOptionEdit, setUnitOptionEdit] = useState([]);

    const [teamOptionEdit, setTeamOptionEdit] = useState([]);

    const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
    let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);
    //unit multiselect

    //unit multiselect
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

    //team multiselect


    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

    let [valueEmployeeEdit, setValueEmployeeEdit] = useState([]);
    const [selectedEmployeeOptionsEdit, setSelectedEmployeeOptionsEdit] = useState([]);
    const [employeesNamesEdit, setEmployeesNamesEdit] = useState([]);
    const { isUserRoleCompare, isAssignBranch, isUserRoleAccess, pageName, allTeam,
        setPageName,
        alldesignation,
        allUsersData,
        buttonStyles, } = useContext(
            UserRoleAccessContext
        );

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

    const { auth } = useContext(AuthContext);

    const [reasonmasterCheck, setReasonmastercheck] = useState(false);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Task Assign Grouping.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
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
        setBtnSubmit(false)
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
        setIsHandleChange(true);
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
        designation: true,
        department: true,
        branch: true,
        company: true,
        unit: true,
        team: true,
        process: true,
        employeenames: true,
        type: true,
        category: true,
        frequency: true,
        subcategory: true,
        schedulestatus: true,
        taskassign: true,
        description: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteCheckpointicket, setDeleteCheckpointticket] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setDeleteCheckpointticket(res?.data?.staskdesignationgrouping);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let Checkpointticketsid = deleteCheckpointicket?._id;
    const delCheckpointticket = async (e) => {
        setPageName(!pageName);
        try {
            if (Checkpointticketsid) {
                await axios.delete(`${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchInterviewgrouping();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
                setPopupContent('Deleted Successfully');
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delCheckpointticketcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(
                    `${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${item}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();


            await fetchInterviewgrouping();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [categorys, setCategorys] = useState([]);
    const [employeesNames, setEmployeesNames] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [processValues, setProcessValues] = useState([]);
    const [processOptions, setProcessOptions] = useState([]);
    const [processOptionsEdit, setProcessOptionsEdit] = useState([]);
    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([]);
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
    //FILTER END
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




    const fetchCategoryTicket = async () => {
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

            setCategorys(categoryall);
            setCategorysEdit(categoryall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchCategoryBased = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.TASKSUBCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = res_category.data.tasksubcategorys
                .filter((data) => {
                    return e.value === data.category;
                })
                .map((data) => data.subcategoryname);
            let ans = [].concat(...data_set);

            setSubcategorys(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchCategoryBasedEdit = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.TASKSUBCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = res_category.data.tasksubcategorys
                .filter((data) => {
                    return e === data.category;
                })
                .map((data) => data.subcategoryname);


            let ans = [].concat(...data_set);

            setSubcategorysEdit(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchTaskScheduleGrouping = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.ALL_TASKSCHEDULEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.taskschedulegrouping.filter(ite => ite?.category === taskDesignationGrouping.category && ite?.subcategory === e).map((d) => ({
                    ...d,
                    label: d.schedule === "Fixed" ? d.frequency + "-" + d.schedule + "-" + d?.timetodo?.map((t, i) => `${t?.hour}:${t?.min} ${t?.timetype}`) : d.frequency + "-" + d.schedule,
                    value: d.schedule === "Fixed" ? d.frequency + "-" + d.schedule + "-" + d?.timetodo?.map((t, i) => `${t?.hour}:${t?.min} ${t?.timetype}`) : d.frequency + "-" + d.schedule,
                })),
            ];
            setScheduleGrouping(categoryall)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Frequency";
    };


    //Designation
    const handleDesignationChange = (options) => {
        setValueDesignation(
            options.map((a, index) => {
                return a.value;
            })
        );

        if (taskDesignationGrouping?.type === "Designation") {
            fetchEmployeeOptions(options, "Designation")
        }

        setSelectedEmployeeOptions([])
        setValueEmployee([])

        setSelectedDesignationOptions(options);
    };

    const customValueRendererDesignation = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Designation";
    };


    //process multiselect
    const [selectedOptionsProcess, setSelectedOptionsProcess] = useState([]);
    let [valueProcessCat, setValueProcessCat] = useState([]);
    const [selectedOptionsProcessEdit, setSelectedOptionsProcessEdit] = useState([]);
    let [valueProcessCatEdit, setValueProcessCatEdit] = useState([]);

    const handleProcessChange = (options) => {
        setValueProcessCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsProcess(options);
        if (taskDesignationGrouping?.type === "Process") {
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


    //Department
    const handleDepartmentChange = (options) => {
        setValueDepartment(
            options.map((a, index) => {
                return a.value;
            })
        );
        if (taskDesignationGrouping?.type === "Department") {
            fetchEmployeeOptions(options, "Department")
        }
        setSelectedEmployeeOptions([])
        setValueEmployee([])
        setSelectedDepartmentOptions(options);
    };

    const customValueRendererDepartment = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Department";
    };






    //get all comnpany.
    const fetchCompanyAll = async () => {
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        if (taskDesignationGrouping?.type === "Company") {
            fetchEmployeeOptions(options, "Company")
        } else {
            setEmployeesNames([])
        }
        setSelectedEmployeeOptions([])
        setValueEmployee([])
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
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        setValueEmployee([])
        setProcessOptions([])
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };



    //get all branches.
    const fetchBranchAll = async (companies) => {
        let company = companies?.map(e => e.value)
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        setValueEmployee([]);
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        setProcessOptions([])


        if (taskDesignationGrouping?.type === "Branch") {
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



    //function to fetch unit
    const fetchUnitAll = async (branches) => {
        let branch = branches?.map(e => e.value)
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        setValueEmployee([])
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        setProcessOptions([])

        if (taskDesignationGrouping?.type === "Unit") {
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

    //function to fetch  team
    const fetchTeamAll = async (unit) => {

        const units = unit?.map(data => data?.value)
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const handleTeamChange = (options) => {
        let teamArray =
            options.map((a, index) => {
                return a.value;
            })
        setValueTeamCat(teamArray);
        setSelectedOptionsTeam(options);

        if (["Team", "Individual"]?.includes(taskDesignationGrouping?.type)) {
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
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setSelectedDepartmentOptions([])
        setValueDepartment([])
        if (taskDesignationGrouping?.type === "Process") {
            filterProcess(teamArray)
        }
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };



    useEffect(() => {
        fetchCompanyAll();
    }, [])






    //Designation_Wise_Employees
    const handleEmployeeChange = (options) => {
        const allSelected = options.some(data => data?.value === 'ALL');
        const hasNonAllOptions = options.some(data => data?.value !== 'ALL');
        if (allSelected) {
            setValueEmployee(["ALL"]);
            setSelectedEmployeeOptions([{ label: "ALL", value: "ALL" }]);
        } else if (hasNonAllOptions) {
            setValueEmployee(options.map(a => a.value));
            setSelectedEmployeeOptions(options);
        } else {
            setValueEmployee([]);
            setSelectedEmployeeOptions([]);
        }
    };

    const customValueRendererEmployee = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
    };



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
        const allCondiitons = [{ label: "ALL", value: "ALL" }, ...filteredUsers?.map(data => ({
            label: data?.companyname,
            value: data?.companyname,
        }))]
        setEmployeesNames(allCondiitons)
        // return filteredUsers;
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
        fetchBranchAllEdit(options)
        setSelectedOptionsBranchEdit([])
        setValueBranchCatEdit([])
        setSelectedOptionsUnitEdit([])
        setValueUnitCatEdit([])
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setUnitOptionEdit([])
        setTeamOptionEdit([])
        setEmployeesNamesEdit([])

        setSelectedDepartmentOptionsEdit([])
        setValueDepartmentEdit([])
        setSelectedDesignationOptionsEdit([])
        setValueDesignationEdit([])

        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])


        if (taskDesignationGroupingEdit?.type === "Company") {
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



    const fetchBranchAllEdit = async (companies) => {
        let company = companies?.map(e => e.value)
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        fetchUnitAllEdit(options)
        setSelectedOptionsBranchEdit(options);
        setSelectedOptionsUnitEdit([])
        setValueUnitCatEdit([])
        setSelectedOptionsTeamEdit([])
        setValueTeamCatEdit([])
        setTeamOptionEdit([])
        setEmployeesNamesEdit([])
        setSelectedDepartmentOptionsEdit([])
        setValueDepartmentEdit([])
        setSelectedDesignationOptionsEdit([])
        setValueDesignationEdit([])
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])

        if (taskDesignationGroupingEdit?.type === "Branch") {
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

    //function to fetch unit
    const fetchUnitAllEdit = async (branches) => {
        let branch = branches?.map(e => e.value)
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        fetchTeamAllEdit(valueCompanyCatEdit, valueBranchCatEdit, options)
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

        if (taskDesignationGroupingEdit?.type === "Unit") {
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

    //function to fetch  team
    const fetchTeamAllEdit = async (company, branch, unit) => {

        const units = unit?.map(data => data?.value)
        setPageName(!pageName);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        if (["Team", "Individual"]?.includes(taskDesignationGroupingEdit?.type)) {
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
        if (taskDesignationGroupingEdit?.type === "Process") {
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

            const allCondiitons = [{ label: "ALL", value: "ALL" }, ...filteredUsers?.map(data => ({
                label: data?.companyname,
                value: data?.companyname,
            }))]
            setEmployeesNamesEdit(allCondiitons)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //Designation_Wise_Employees
    const handleEmployeeChangeEdit = (options) => {
        const allSelected = options.some(data => data?.value === 'ALL');
        const hasNonAllOptions = options.some(data => data?.value !== 'ALL');
        if (allSelected) {
            setValueEmployeeEdit(["ALL"]);
            setSelectedEmployeeOptionsEdit([{ label: "ALL", value: "ALL" }]);
        } else if (hasNonAllOptions) {
            setValueEmployeeEdit(options.map(a => a.value));
            setSelectedEmployeeOptionsEdit(options);
        } else {
            setValueEmployeeEdit([]);
            setSelectedEmployeeOptionsEdit([]);
        }
    };

    const customValueRendererEmployeeEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
    };























    const fetchTaskScheduleGroupingEdit = async (category, e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.ALL_TASKSCHEDULEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.taskschedulegrouping.filter(ite => ite?.category === category && ite?.subcategory === e).map((d) => ({
                    ...d,
                    label: d.schedule === "Fixed" ? d.frequency + "-" + d.schedule + "-" + d?.timetodo?.map((t, i) => `${t?.hour}:${t?.min} ${t?.timetype}`) : d.frequency + "-" + d.schedule,
                    value: d.schedule === "Fixed" ? d.frequency + "-" + d.schedule + "-" + d?.timetodo?.map((t, i) => `${t?.hour}:${t?.min} ${t?.timetype}`) : d.frequency + "-" + d.schedule,
                })),
            ];
            setScheduleGroupingEdit(categoryall)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Frequency";
    };




    const handleDesignationChangeEdit = (options) => {
        setValueDesignationEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        let value = options.map((a, index) => {
            return a.value;
        })
        if (taskDesignationGroupingEdit?.type === "Designation") {
            fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, valueTeamCatEdit, valueDepartmentEdit, value, valueProcessCatEdit, "Designation")
        }
        setValueEmployeeEdit([])
        setSelectedEmployeeOptionsEdit([])
        setSelectedDesignationOptionsEdit(options);
    };

    const customValueRendererDesignationEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Designation";
    };


    //Department
    const handleDepartmentChangeEdit = (options) => {
        setValueDepartmentEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        let value = options.map((a, index) => {
            return a.value;
        })
        if (taskDesignationGroupingEdit?.type === "Department") {
            fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, valueTeamCatEdit, value, valueDesignationEdit, valueProcessCatEdit, "Department")
        }
        setSelectedEmployeeOptionsEdit([])
        setValueEmployeeEdit([])
        setSelectedDepartmentOptionsEdit(options);
    };

    const customValueRendererDepartmentEdit = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Department";
    };




    const [documentFiles, setdocumentFiles] = useState([]);
    const [documentFilesEdit, setdocumentFilesEdit] = useState([]);

    const handleResumeUpload = (event) => {
        event.preventDefault();
        const resume = event.target.files;
        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFiles((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "Document file" }]);
        };

    };

    //Rendering File
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleResumeUploadEdit = (event) => {
        event.preventDefault();
        const resume = event.target.files;
        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFilesEdit((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "Document file" }]);
        };

    };

    //Rendering File
    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteEdit = (index) => {
        setdocumentFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const convertToNumberedList = (htmlContent) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;

        const listItems = Array.from(tempElement.querySelectorAll("li"));
        listItems.forEach((li, index) => {
            li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
        });
        return tempElement.innerText;
    };
    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setBtnSubmit(true)
        try {
            let subprojectscreate = await axios.post(
                SERVICE.CREATE_TASKDESIGNATIONGROUPING,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    category: String(taskDesignationGrouping.category),
                    subcategory: String(taskDesignationGrouping.subcategory),
                    type: String(taskDesignationGrouping.type),
                    priority: String(taskDesignationGrouping.priority),
                    schedulestatus: String(taskDesignationGrouping.schedulestatus),
                    taskassign: String(taskDesignationGrouping.taskassign),
                    frequency: valueWeekly,
                    designation: valueDesignation,
                    department: valueDepartment,
                    company: valueCompanyCat,
                    branch: valueBranchCat,
                    unit: valueUnitCat,
                    team: valueTeamCat,
                    employeenames: valueEmployee,
                    process: valueProcessCat,
                    description: agenda,
                    documentfiles: documentFiles,
                    taskdesignationlog: [{
                        category: String(taskDesignationGrouping.category),
                        subcategory: String(taskDesignationGrouping.subcategory),
                        type: String(taskDesignationGrouping.type),
                        priority: String(taskDesignationGrouping.priority),
                        date: moment(new Date()).format("DD-MM-YYYY hh:mm a"),
                        schedulestatus: String(taskDesignationGrouping.schedulestatus),
                        taskassign: String(taskDesignationGrouping.taskassign),
                        frequency: valueWeekly,
                        designation: valueDesignation,
                        department: valueDepartment,
                        process: valueProcessCat,
                        company: valueCompanyCat,
                        branch: valueBranchCat,
                        unit: valueUnitCat,
                        team: valueTeamCat,
                        employeenames: valueEmployee,
                    }
                    ],
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchInterviewgrouping();
            setAgenda("")
            setSearchQuery("")
            setdocumentFiles([])
            setBtnSubmit(false)
            setPopupContent('Added Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();


        } catch (err) { setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isNameMatch = taskDesigDatas?.some(
            (item) =>
                item.subcategory === taskDesignationGrouping.subcategory &&
                item.category === taskDesignationGrouping.category &&
                item.frequency?.some(data => valueWeekly?.includes(data)));

        if (taskDesignationGrouping.category === "Please Select Category") {
            setPopupContentMalert('Please Select Category');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (taskDesignationGrouping.subcategory === "Please Select Subcategory") {
            setPopupContentMalert('Please Select Subcategory');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedWeeklyOptions?.length < 1) {
            setPopupContentMalert('Please Select Frequency');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGrouping?.type === "Please Select Type" ||
            taskDesignationGrouping?.type === ""
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
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskDesignationGrouping?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskDesignationGrouping?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(taskDesignationGrouping?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGrouping?.type === "Department" &&
            selectedDepartmentOptions?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGrouping?.type === "Designation" &&
            selectedDesignationOptions?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGrouping?.type === "Process" &&
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
        else if (taskDesignationGrouping?.priority === "Please Select Priority") {
            setPopupContentMalert('Please Select Priority');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (agenda === "" || agenda === "<p><br></p>") {
            setPopupContentMalert('Please Enter Description');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert('Already Data Exists.!!!');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setTaskDesignationGrouping({
            designation: "Please Select Designation",
            category: "Please Select Category",
            subcategory: "Please Select Subcategory",
            type: "Please Select Type",
            schedulestatus: "Active",
            taskassign: "Individual",
            priority: "Please Select Priority",
        });
        setSubcategorys([])
        setAgenda("")
        setdocumentFiles([])
        setSelectedWeeklyOptions([])
        setEmployeesNames([])
        setSelectedDesignationOptions([])
        setValueDesignation([])
        setValueEmployee([])
        setSelectedEmployeeOptions([])
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsTeam([])
        setSelectedOptionsUnit([])
        setValueBranchCat([])
        setValueCompanyCat([])
        setValueUnitCat([])
        setValueTeamCat([])
        setBranchOption([])
        setUnitOption([])
        setTeamOption([])
        setSelectedOptionsProcess([])
        setValueProcessCat([])
        setValueWeekly([])
        setValueDesignation([])
        setSelectedDesignationOptions([])
        setScheduleGrouping([])
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //get single row to edit....
    const getCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setTaskDesignationGroupingEdit(res?.data?.staskdesignationgrouping);
            fetchCategoryBasedEdit(res?.data?.staskdesignationgrouping?.category)
            setdocumentFilesEdit(res?.data?.staskdesignationgrouping?.documentfiles)
            setValueWeeklyEdit(res?.data?.staskdesignationgrouping?.frequency)
            setValueDesignationEdit(res?.data?.staskdesignationgrouping?.designation)
            fetchTaskScheduleGroupingEdit(res?.data?.staskdesignationgrouping?.category, res?.data?.staskdesignationgrouping?.subcategory)
            setSelectedWeeklyOptionsEdit(res?.data?.staskdesignationgrouping?.frequency?.map((t) => ({
                ...t,
                label: t,
                value: t,
            })))
            setSelectedDesignationOptionsEdit(res?.data?.staskdesignationgrouping?.designation?.map((t) => ({
                ...t,
                label: t,
                value: t,
            })))

            setSelectedOptionsCompanyEdit([...res?.data?.staskdesignationgrouping?.company.map((t) => ({ ...t, label: t, value: t }))])
            setValueCompanyCatEdit(res?.data?.staskdesignationgrouping?.company)

            setSelectedOptionsBranchEdit([...res?.data?.staskdesignationgrouping?.branch.map((t) => ({ ...t, label: t, value: t }))])
            setValueBranchCatEdit(res?.data?.staskdesignationgrouping?.branch)
            fetchBranchAllEdit([...res?.data?.staskdesignationgrouping?.company.map((t) => ({ ...t, label: t, value: t }))])

            setValueUnitCatEdit(res?.data?.staskdesignationgrouping?.unit)
            setSelectedOptionsUnitEdit([...res?.data?.staskdesignationgrouping?.unit.map((t) => ({ label: t, value: t }))])
            fetchUnitAllEdit([...res?.data?.staskdesignationgrouping?.branch.map((t) => ({ label: t, value: t }))])

            setValueTeamCatEdit(res?.data?.staskdesignationgrouping?.team)
            setSelectedOptionsTeamEdit([...res?.data?.staskdesignationgrouping?.team.map((t) => ({ label: t, value: t }))])

            setValueProcessCatEdit(res?.data?.staskdesignationgrouping?.process)
            setSelectedOptionsProcessEdit([...res?.data?.staskdesignationgrouping?.process.map((t) => ({ label: t, value: t }))])

            fetchTeamAllEdit(res?.data?.staskdesignationgrouping?.company, res?.data?.staskdesignationgrouping?.branch, [...res?.data?.staskdesignationgrouping?.unit.map((t) => ({ ...t, label: t, value: t }))])


            setSelectedDesignationOptionsEdit([...res?.data?.staskdesignationgrouping?.designation.map((t) => ({ ...t, label: t, value: t }))])
            setValueDesignationEdit(res?.data?.staskdesignationgrouping?.designation)

            setSelectedDepartmentOptionsEdit([...res?.data?.staskdesignationgrouping?.department.map((t) => ({ ...t, label: t, value: t }))])
            setValueDepartmentEdit(res?.data?.staskdesignationgrouping?.department)
            let company = res?.data?.staskdesignationgrouping?.company ?? [];
            let branch = res?.data?.staskdesignationgrouping?.branch ?? [];
            let unit = res?.data?.staskdesignationgrouping?.unit ?? [];
            let team = res?.data?.staskdesignationgrouping?.team ?? [];
            let department = res?.data?.staskdesignationgrouping?.department ?? [];
            let designation = res?.data?.staskdesignationgrouping?.designation ?? [];
            let process = res?.data?.staskdesignationgrouping?.process ?? [];
            filterProcessEdit(company, branch, unit, team)
            fetchEmployeeOptionsEdit(company, branch, unit, team, department, designation, process, res?.data?.staskdesignationgrouping?.type)

            setSelectedEmployeeOptionsEdit([...res?.data?.staskdesignationgrouping?.employeenames.map((t) => ({ ...t, label: t, value: t }))])
            setValueEmployeeEdit(res?.data?.staskdesignationgrouping?.employeenames)
            const typeChecking = res?.data?.staskdesignationgrouping?.type === "Designation" ? [...res?.data?.staskdesignationgrouping?.designation.map((t) => ({ ...t, label: t, value: t }))] :
                res?.data?.staskdesignationgrouping?.type === "Department" ? [...res?.data?.staskdesignationgrouping?.department.map((t) => ({ ...t, label: t, value: t }))]
                    : [...res?.data?.staskdesignationgrouping?.team.map((t) => ({ ...t, label: t, value: t }))]
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            handleClickOpenview();
            setTaskDesignationGroupingEdit(res?.data?.staskdesignationgrouping);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setTaskDesignationGroupingEdit(res?.data?.staskdesignationgrouping);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchCategoryTicket();
        fetchDesignation();
        fetchDepartments();
    }, []);

    //Project updateby edit page...
    let updateby = taskDesignationGroupingEdit?.updatedby;
    let addedby = taskDesignationGroupingEdit?.addedby;
    let taskdesiLog = taskDesignationGroupingEdit?.taskdesignationlog;

    let subprojectsid = taskDesignationGroupingEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${subprojectsid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    category: String(taskDesignationGroupingEdit.category),
                    subcategory: String(taskDesignationGroupingEdit.subcategory),
                    type: String(taskDesignationGroupingEdit.type),
                    schedulestatus: String(taskDesignationGroupingEdit.schedulestatus),
                    taskassign: String(taskDesignationGroupingEdit.taskassign),
                    designation: valueDesignationEdit,
                    department: valueDepartmentEdit,
                    company: valueCompanyCatEdit,
                    branch: valueBranchCatEdit,
                    unit: valueUnitCatEdit,
                    team: valueTeamCatEdit,
                    process: valueProcessCatEdit,
                    employeenames: valueEmployeeEdit,
                    frequency: valueWeeklyEdit,
                    description: taskDesignationGroupingEdit.description,
                    priority: taskDesignationGroupingEdit.priority,
                    documentfiles: documentFilesEdit,
                    taskdesignationlog: [
                        ...taskdesiLog,
                        {
                            category: String(taskDesignationGroupingEdit.category),
                            subcategory: String(taskDesignationGroupingEdit.subcategory),
                            type: String(taskDesignationGroupingEdit.type),
                            schedulestatus: String(taskDesignationGroupingEdit.schedulestatus),
                            taskassign: String(taskDesignationGroupingEdit.taskassign),
                            designation: valueDesignationEdit,
                            date: moment(new Date()).format("DD-MM-YYYY hh:mm a"), department: valueDepartmentEdit,
                            company: valueCompanyCatEdit,
                            branch: valueBranchCatEdit,
                            unit: valueUnitCatEdit,
                            team: valueTeamCatEdit,
                            process: valueProcessCatEdit,
                            employeenames: valueEmployeeEdit,
                            frequency: valueWeeklyEdit,
                            description: taskDesignationGroupingEdit.description,
                            priority: taskDesignationGroupingEdit.priority,
                        },
                    ],
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchInterviewgrouping();
            await fetchInterviewgroupingall();
            handleCloseModEdit();
            setSelectedWeeklyOptionsEdit([])
            setValueWeeklyEdit([])
            setSelectedDesignationOptionsEdit([])
            setValueDesignationEdit([])
            setScheduleGroupingEdit([])
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchInterviewgroupingall();

        const isNameMatch = allduemasteredit.some(
            (item) =>
                item.subcategory === taskDesignationGroupingEdit.subcategory &&
                item.category === taskDesignationGroupingEdit.category &&
                item.frequency?.some(data => valueWeeklyEdit?.includes(data))
        );

        if (taskDesignationGroupingEdit.category === "Please Select Category") {
            setPopupContentMalert('Please Select Category');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            taskDesignationGroupingEdit.subcategory === "Please Select Subcategory"
        ) {
            setPopupContentMalert('Please Select Subcategory');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedWeeklyOptionsEdit?.length < 1) {
            setPopupContentMalert('Please Select Frequency');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGroupingEdit?.type === "Please Select Type" ||
            taskDesignationGroupingEdit?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCompanyEdit?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskDesignationGroupingEdit?.type) &&
            selectedOptionsBranchEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team", "Department", "Designation", "Process"]?.includes(taskDesignationGroupingEdit?.type) &&
            selectedOptionsUnitEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team", "Process"]?.includes(taskDesignationGroupingEdit?.type) &&
            selectedOptionsTeamEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGroupingEdit?.type === "Department" &&
            selectedDepartmentOptionsEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGroupingEdit?.type === "Designation" &&
            selectedDesignationOptionsEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            taskDesignationGroupingEdit?.type === "Process" &&
            selectedOptionsProcessEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Process!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployeeOptionsEdit?.length < 1) {
            setPopupContentMalert('Please Select Employee Names');
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (taskDesignationGroupingEdit?.priority === "Please Select Priority") {
            setPopupContentMalert('Please Select Priority');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskDesignationGroupingEdit.description === "" || taskDesignationGroupingEdit.description === "<p><br></p>") {
            setPopupContentMalert('Please Enter Description');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert('Already Data Exists.!!!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };

    //get all Sub vendormasters.
    const fetchInterviewgrouping = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.post(SERVICE.ALL_TASKDESIGNATIONGROUPING_ASSIGNBRANCH, {
                accessbranch: accessbranch
            }
                , {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

            const answer = res_vendor?.data?.taskdesignationgrouping?.length > 0 ? res_vendor?.data?.taskdesignationgrouping?.map((item, index) => ({
                serialNumber: index + 1,
                id: item._id,
                category: item.category,
                subcategory: item.subcategory,
                type: item.type,
                schedulestatus: item.schedulestatus,
                taskassign: item.taskassign,
                designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                frequency: item.frequency?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                department: item.department?.length > 0 ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
                company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                process: item.process?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                description: convertToNumberedList(item.description)
            })) : []
            setReasonmastercheck(true);
            setTaskDesigDatas(res_vendor?.data?.taskdesignationgrouping)
            setTaskDesignationGroupingall(answer);
        }
        catch (err) {
            setReasonmastercheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all Sub vendormasters.
    const fetchInterviewgroupingall = async () => {
        setPageName(!pageName);
        try {
            let res_check = await axios.get(SERVICE.ALL_TASKDESIGNATIONGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllduemasteredit(
                res_check?.data?.taskdesignationgrouping.filter(
                    (item) => item._id !== taskDesignationGroupingEdit?._id
                )
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // pdf.....
    const columns = [
        { title: "Category", field: "category" },
        { title: "Subcategory", field: "subcategory" },
        { title: "Frequency", field: "frequency" },
        { title: "Type", field: "type" },
        { title: "Designation", field: "designation" },
        { title: "Department", field: "department" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Process", field: "process" },
        { title: "Employee Names", field: "employeenames" },
        { title: "Schedule Status", field: "schedulestatus" },
        { title: "Task Assign", field: "taskassign" },
        { title: "Description", field: "description" },
    ];

    // Excel
    const fileName = "TaskAssignGrouping";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Task Assign Grouping",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchInterviewgrouping();
        fetchInterviewgroupingall();
    }, []);

    useEffect(() => {
        fetchInterviewgroupingall();
    }, [isEditOpen, taskDesignationGroupingEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {
        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(taskDesignationGroupingall);
    }, [taskDesignationGroupingall]);

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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
            width: 160,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 160,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 160,
            hide: !columnVisibility.frequency,
            headerClassName: "bold-header",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 160,
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
            width: 160,
            hide: !columnVisibility.employeenames,
            headerClassName: "bold-header",
        },
        {
            field: "schedulestatus",
            headerName: "Schedule Status",
            flex: 0,
            width: 160,
            hide: !columnVisibility.schedulestatus,
            headerClassName: "bold-header",
        },
        {
            field: "taskassign",
            headerName: "Task Assign",
            flex: 0,
            width: 160,
            hide: !columnVisibility.taskassign,
            headerClassName: "bold-header",
        },
        {
            field: "description",
            headerName: "Description",
            flex: 0,
            width: 160,
            hide: !columnVisibility.description,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 400,
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
                    {isUserRoleCompare?.includes("etaskassigngrouping") && (
                        <Button
                            sx={buttonStyles.buttonedit}
                            onClick={() => {

                                getCode(params.data.id, params.data.name);
                            }}
                        >
                            Change
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dtaskassigngrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vtaskassigngrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itaskassigngrouping") && (
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
                    &ensp;
                    {isUserRoleCompare?.includes("itaskassigngrouping") && (
                        <Link to={`/task/taskschedulelog/${params.data.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
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
            designation: item.designation,
            description: item.description,
            frequency: item.frequency,
            schedulestatus: item.schedulestatus,
            taskassign: item.taskassign,
            department: item.department,
            process: item.process,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            type: item.type,
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
                            // secondary={column.headerName }
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
            <Headtitle title={"TASK GROUPING"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Task Assign Grouping"
                modulename="Task"
                submodulename="Task Assign Grouping"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("ataskassigngrouping") && (
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.HeaderText}>
                                    Add Task Assign Grouping
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={categorys}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGrouping.category,
                                            value: taskDesignationGrouping.category,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGrouping({
                                                ...taskDesignationGrouping,
                                                category: e.value,
                                                subcategory: "Please Select Subcategory",
                                            });

                                            fetchCategoryBased(e);
                                            setSelectedWeeklyOptions([])
                                            setValueWeekly([])
                                            setScheduleGrouping([])
                                            setValueDesignation([])
                                            setSelectedDesignationOptions([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub Category<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={subcategorys}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGrouping.subcategory,
                                            value: taskDesignationGrouping.subcategory,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGrouping({
                                                ...taskDesignationGrouping,
                                                subcategory: e.value,
                                                reasonmaster: "Please Select Reason",
                                            });
                                            fetchTaskScheduleGrouping(e.value)
                                            setSelectedWeeklyOptions([])
                                            setValueWeekly([])
                                            setValueDesignation([])
                                            setSelectedDesignationOptions([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12} >
                                <Typography>
                                    Frequency <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <MultiSelect size="small"
                                        options={scheduleGrouping}
                                        value={selectedWeeklyOptions}
                                        onChange={handleWeeklyChange}
                                        valueRenderer={customValueRendererCate}
                                        labelledBy="Please Select Frquency"
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
                                            label: taskDesignationGrouping.type,
                                            value: taskDesignationGrouping.type,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGrouping({
                                                ...taskDesignationGrouping,
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


                                            setBranchOption([])
                                            setUnitOption([])
                                            setTeamOption([])

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
                            {["Individual", "Team", "Process", "Shift"]?.includes(taskDesignationGrouping.type) ? (
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
                                    {["Process"]?.includes(taskDesignationGrouping.type) && (
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
                            ) : ["Department"]?.includes(taskDesignationGrouping.type) ? (
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
                            ) : ["Designation"]?.includes(taskDesignationGrouping.type) ? (
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
                            ) : ["Branch"]?.includes(taskDesignationGrouping.type) ? (
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
                            ) : ["Unit"]?.includes(taskDesignationGrouping.type) ? (
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
                                        Priority<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={[{ label: "High", value: "High" }, { label: "Medium", value: "Medium" }, { label: "Low", value: "Low" }]}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGrouping.priority,
                                            value: taskDesignationGrouping.priority,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGrouping({
                                                ...taskDesignationGrouping,
                                                priority: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Schedule Status
                                    </Typography>
                                    <Selects
                                        options={[{ label: "Active", value: "Active" }, { label: "InActive", value: "InActive" }]}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGrouping.schedulestatus,
                                            value: taskDesignationGrouping.schedulestatus,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGrouping({
                                                ...taskDesignationGrouping,
                                                schedulestatus: e.value,
                                            });

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Task Assign
                                    </Typography>
                                    <Selects
                                        options={[{ label: "Individual", value: "Individual" }, { label: "Team", value: "Team" }]}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGrouping.taskassign,
                                            value: taskDesignationGrouping.taskassign,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGrouping({
                                                ...taskDesignationGrouping,
                                                taskassign: e.value,
                                            });

                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Description<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <ReactQuill
                                        style={{ maxHeight: "250px", height: "250px" }}
                                        value={agenda}
                                        onChange={setAgenda}
                                        modules={{
                                            toolbar: [
                                                [{ header: "1" }, { header: "2" }, { font: [] }], // Note: Font options should be an array
                                                [{ size: [] }],
                                                ["bold", "italic", "underline", "strike", "blockquote"],
                                                [{ align: [] }],
                                                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                                ["link", "image", "video"], ["clean"]
                                            ]
                                        }}
                                        formats={[
                                            "header", "font", "size", "bold", "italic", "underline", "align", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video", "Times New Roman"
                                        ]}
                                    />



                                </FormControl>
                                <br /> <br />
                            </Grid>

                            <Grid item md={12} sm={12} xs={12}>
                                <br /> <br />
                                <Typography variant="h6">Upload Document</Typography>
                                <Grid marginTop={2}>
                                    <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                        Upload
                                        <input
                                            type="file"
                                            id="resume"
                                            accept=".xlsx, .xls, .csv, .pdf, .txt, .image , .png , .jpg , .jpeg"
                                            name="file"
                                            hidden
                                            onChange={(e) => {
                                                handleResumeUpload(e);
                                            }}
                                        />
                                    </Button>
                                    <br />
                                    <br />
                                    {documentFiles?.length > 0 &&
                                        documentFiles?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <Typography>{file?.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                                            <DeleteIcon sx={buttonStyles.buttondelete} />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2.5} xs={12} sm={6}>
                                <LoadingButton
                                    sx={{
                                        ...buttonStyles.buttonsubmit,
                                        marginLeft: "10px",
                                    }}
                                    variant="contained"
                                    loading={btnSubmit}
                                    style={{ minWidth: "0px" }}
                                    onClick={(e) =>
                                        handleSubmit(e)
                                    }
                                >
                                    Submit
                                </LoadingButton>
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={6}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            )}
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "auto",
                        "& .MuiPaper-root": {
                            overflow: "auto",
                        },
                        marginTop: "80px"
                    }}
                >
                    <Box sx={userStyle.dialogbox}>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    Change Task Assign Grouping
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={categorysEdit}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGroupingEdit.category,
                                            value: taskDesignationGroupingEdit.category,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
                                                category: e.value,
                                                subcategory: "Please Select Subcategory",
                                            });
                                            fetchCategoryBasedEdit(e.value);
                                            setSelectedWeeklyOptionsEdit([])
                                            setValueWeeklyEdit([])
                                            setSelectedDesignationOptionsEdit([])
                                            setValueDesignationEdit([])
                                            setScheduleGroupingEdit([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub Category<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={subcategorysEdit}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGroupingEdit.subcategory,
                                            value: taskDesignationGroupingEdit.subcategory,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
                                                subcategory: e.value,
                                            });
                                            setSelectedWeeklyOptionsEdit([])
                                            setValueWeeklyEdit([])
                                            setSelectedDesignationOptionsEdit([])
                                            setValueDesignationEdit([])
                                            fetchTaskScheduleGroupingEdit(taskDesignationGroupingEdit.category, e.value)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>
                                    Frequency <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <MultiSelect size="small"
                                        options={scheduleGroupingEdit}
                                        value={selectedWeeklyOptionsEdit}
                                        onChange={handleWeeklyChangeEdit}
                                        valueRenderer={customValueRendererCateEdit}
                                        labelledBy="Please Select Frquency"
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
                                            label: taskDesignationGroupingEdit.type,
                                            value: taskDesignationGroupingEdit.type,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
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


                                            setBranchOptionEdit([])
                                            setUnitOptionEdit([])
                                            setTeamOptionEdit([])
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
                            {["Individual", "Team", "Process", "Shift"]?.includes(taskDesignationGroupingEdit.type) ? (
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
                                    {["Process"]?.includes(taskDesignationGroupingEdit.type) && (
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
                            ) : ["Department"]?.includes(taskDesignationGroupingEdit.type) ? (
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
                            ) : ["Designation"]?.includes(taskDesignationGroupingEdit.type) ? (
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
                            ) : ["Branch"]?.includes(taskDesignationGroupingEdit.type) ? (
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
                            ) : ["Unit"]?.includes(taskDesignationGroupingEdit.type) ? (
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
                                        Priority<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={[{ label: "High", value: "High" }, { label: "Medium", value: "Medium" }, { label: "Low", value: "Low" }]}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGroupingEdit.priority,
                                            value: taskDesignationGroupingEdit.priority,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
                                                priority: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Schedule Status
                                    </Typography>
                                    <Selects
                                        options={[{ label: "Active", value: "Active" }, { label: "InActive", value: "InActive" }]}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGroupingEdit.schedulestatus,
                                            value: taskDesignationGroupingEdit.schedulestatus,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
                                                schedulestatus: e.value,
                                            });

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Task Assign
                                    </Typography>
                                    <Selects
                                        options={[{ label: "Individual", value: "Individual" }, { label: "Team", value: "Team" }]}
                                        styles={colourStyles}
                                        value={{
                                            label: taskDesignationGroupingEdit.taskassign,
                                            value: taskDesignationGroupingEdit.taskassign,
                                        }}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
                                                taskassign: e.value,
                                            });

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Description<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <ReactQuill
                                        style={{ maxHeight: "250px", height: "250px" }}
                                        value={taskDesignationGroupingEdit.description}
                                        onChange={(e) => {
                                            setTaskDesignationGroupingEdit({
                                                ...taskDesignationGroupingEdit,
                                                description: e,
                                            });
                                        }}
                                        modules={{
                                            toolbar: [
                                                [{ header: "1" }, { header: "2" }, { font: [] }], // Note: Font options should be an array
                                                [{ size: [] }],
                                                ["bold", "italic", "underline", "strike", "blockquote"],
                                                [{ align: [] }],
                                                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                                ["link", "image", "video"], ["clean"]
                                            ]
                                        }}
                                        formats={[
                                            "header", "font", "size", "bold", "italic", "underline", "align", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video", "Times New Roman"
                                        ]}
                                    />



                                </FormControl>
                                <br /> <br />
                                <br /> <br />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <br /> <br /> <br /> <br />
                                <Typography variant="h6">Upload Document</Typography>
                                <Grid marginTop={2}>
                                    <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                        Upload
                                        <input
                                            type="file"
                                            id="resume"
                                            accept=".xlsx, .xls, .csv, .pdf, .txt, .image , .png , .jpg , .jpeg"
                                            name="file"
                                            hidden
                                            onChange={(e) => {
                                                handleResumeUploadEdit(e);
                                            }}
                                        />
                                    </Button>
                                    <br />
                                    <br />
                                    {documentFilesEdit?.length > 0 &&
                                        documentFilesEdit.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteEdit(index)}>
                                                            <DeleteIcon sx={buttonStyles.buttondelete} />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />

                        <br />

                        <Grid container spacing={2}>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button sx={buttonStyles.buttonsubmit} variant="contained" type="submit" onClick={editSubmit}>
                                    Update
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("ltaskassigngrouping") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                {" "}
                                Task Assign Grouping List
                            </Typography>
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
                                        <MenuItem value={taskDesignationGroupingall?.length}>
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
                                    {isUserRoleCompare?.includes(
                                        "exceltaskassigngrouping"
                                    ) && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "csvtaskassigngrouping"
                                    ) && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "printtaskassigngrouping"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "pdftaskassigngrouping"
                                    ) && (

                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                            //     <>
                                            //     <Button
                                            //         sx={userStyle.buttongrp}
                                            //         onClick={() => downloadPdf()}
                                            //     >
                                            //         <FaFilePdf />
                                            //         &ensp;Export to PDF&ensp;
                                            //     </Button>
                                            // </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "imagetaskassigngrouping"
                                    ) && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
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
                                    maindatas={taskDesignationGroupingall}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={items}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
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
                        {isUserRoleCompare?.includes("bdtaskassigngrouping") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                                sx={buttonStyles.buttonbulkdelete}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {!reasonmasterCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

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
                        ) : (
                            <>
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
                        <Button onClick={handleCloseMod} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            sx={buttonStyles.buttonsubmit}
                            onClick={(e) => delCheckpointticket(Checkpointticketsid)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Task Assign Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{taskDesignationGroupingEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subcategory</Typography>
                                    <Typography>{taskDesignationGroupingEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Frequency</Typography>
                                    <Typography>{taskDesignationGroupingEdit?.frequency?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{taskDesignationGroupingEdit?.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{taskDesignationGroupingEdit.company?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>

                            {taskDesignationGroupingEdit?.branch?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{taskDesignationGroupingEdit.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskDesignationGroupingEdit?.unit?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    <Typography>{taskDesignationGroupingEdit.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskDesignationGroupingEdit?.team?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Team</Typography>
                                    <Typography>{taskDesignationGroupingEdit.team?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}

                            {taskDesignationGroupingEdit?.process?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Process</Typography>
                                    <Typography>{taskDesignationGroupingEdit.process?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskDesignationGroupingEdit?.designation?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Designation</Typography>
                                    <Typography>{taskDesignationGroupingEdit.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}
                            {taskDesignationGroupingEdit?.department?.length > 0 && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Department</Typography>
                                    <Typography>{taskDesignationGroupingEdit.department?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>}

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Names</Typography>
                                    <Typography>{taskDesignationGroupingEdit.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Priority</Typography>
                                    <Typography>{taskDesignationGroupingEdit.priority}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Schedule Status</Typography>
                                    <Typography>{taskDesignationGroupingEdit.schedulestatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Task Assign</Typography>
                                    <Typography>{taskDesignationGroupingEdit.taskassign}</Typography>
                                </FormControl>
                            </Grid>



                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Description
                                    </Typography>
                                    <ReactQuill
                                        style={{ maxHeight: "250px", height: "250px" }}
                                        readOnly
                                        value={taskDesignationGroupingEdit.description}
                                        modules={{
                                            toolbar: [
                                                [{ header: "1" }, { header: "2" }, { font: [] }], // Note: Font options should be an array
                                                [{ size: [] }],
                                                ["bold", "italic", "underline", "strike", "blockquote"],
                                                [{ align: [] }],
                                                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                                ["link", "image", "video"], ["clean"]
                                            ]
                                        }}
                                        formats={[
                                            "header", "font", "size", "bold", "italic", "underline", "align", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video", "Times New Roman"
                                        ]}
                                    />



                                </FormControl>
                                <br /> <br />
                                <br /> <br />
                            </Grid>
                            {taskDesignationGroupingEdit?.documentfiles?.length > 0 &&
                                <Grid item md={12} sm={12} xs={12}>
                                    <br /> <br /> <br /> <br />
                                    <Typography variant="h6">Upload Document</Typography>
                                    <Grid marginTop={2}>
                                        {taskDesignationGroupingEdit?.documentfiles?.length > 0 &&
                                            taskDesignationGroupingEdit?.documentfiles?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={3} md={3} sm={6} xs={6}>
                                                            <Typography>{file?.name}</Typography>
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>}
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                sx={buttonStyles.buttonsubmit}
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
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
                            sx={buttonStyles.btncancel}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
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
                        <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            sx={buttonStyles.buttonsubmit}
                            onClick={(e) => delCheckpointticketcheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
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
                itemsTwo={taskDesignationGroupingall ?? []}
                filename={"Task Assign Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Task Assign Grouping Info"
                addedby={addedby}
                updateby={updateby}
            />


            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
        </Box>
    );
}

export default TaskDesignationGrouping;
