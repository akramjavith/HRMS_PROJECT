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

function TaskDesignationGrouping() {
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
    const { isUserRoleCompare, isUserRoleAccess} = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);

    const [reasonmasterCheck, setReasonmastercheck] = useState(false);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");


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
                rowDataTable?.map((t, index) => ({
                    "Sno": index + 1,
                                Category: t.category,
                                Subcategory: t.subcategory,
                                Frequency: t.frequency,
                                Type: t.type,
                                Designation: t.designation,
                                Department: t.department,
                                Company: t.company,
                                Branch: t.branch,
                                Unit: t.unit,
                                Team: t.team,
                                Employeenames: t.employeenames,
                                ScheduleStatus: t.schedulestatus,
                                TaskAssign: t.taskassign,
                                Description: t.description,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((t, index) => ({
                    "Sno": index + 1,
                    Category: t.category,
                    Subcategory: t.subcategory,
                    Frequency: t.frequency,
                    Type: t.type,
                    Designation: t.designation,
                    Department: t.department,
                    Company: t.company,
                    Branch: t.branch,
                    Unit: t.unit,
                    Team: t.team,
                    Employeenames: t.employeenames,
                    ScheduleStatus: t.schedulestatus,
                    TaskAssign: t.taskassign,
                    Description: t.description,
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
            filteredData.map(t => ({
                serialNumber: serialNumberCounter++,
                category: t.category,
                subcategory: t.subcategory,
                frequency: t.frequency,
                type: t.type,
                designation: t.designation,
                department: t.department,
                company: t.company,
                branch: t.branch,
                unit: t.unit,
                team: t.team,
                employeenames: t.employeenames,
                schedulestatus: t.schedulestatus,
                taskassign: t.taskassign,
                description: t.description,
            })) :
            items?.map(t => ({
                serialNumber: serialNumberCounter++,
                category: t.category,
                subcategory: t.subcategory,
                frequency: t.frequency,
                type: t.type,
                designation: t.designation,
                department: t.department,
                company: t.company,
                branch: t.branch,
                unit: t.unit,
                team: t.team,
                employeenames: t.employeenames,
                schedulestatus: t.schedulestatus,
                taskassign: t.taskassign,
                description: t.description,
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

        doc.save("TaskAssignGrouping.pdf");
    };



    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "TaskAssignGrouping.png");
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let Checkpointticketsid = deleteCheckpointicket?._id;
    const delCheckpointticket = async (e) => {
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
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully..!!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delCheckpointticketcheckbox = async () => {
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

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully..!!"}</p>
                </>
            );
            handleClickOpenerr();
            await fetchInterviewgrouping();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [categorys, setCategorys] = useState([]);
    const [employeesNames, setEmployeesNames] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [designation, setDesignation] = useState([]);
    const [department, setDepartment] = useState([]);
    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([]);

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




    const fetchCategoryTicket = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchCategoryBased = async (e) => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchCategoryBasedEdit = async (e) => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchTaskScheduleGrouping = async (e) => {
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
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        fetchEmployeeOptions(options, "Designation")
        setSelectedEmployeeOptions([])
        setValueEmployee([])

        setSelectedDesignationOptions(options);
    };

    const customValueRendererDesignation = (valueCate, _days) => {
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



    useEffect(() => {
        fetchCompanyAll();
    }, [])






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


            const categoryall = [{ label: "ALL", value: "ALL" },
            ...employeenames?.map((d) => ({
                label: d.companyname,
                value: d.companyname,
            })),
            ];
            setEmployeesNames(categoryall)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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


            const categoryall = [{ label: "ALL", value: "ALL" },
            ...employeenames?.map((d) => ({
                label: d.companyname,
                value: d.companyname,
            })),
            ];
            setEmployeesNamesEdit(categoryall)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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























    const fetchTaskScheduleGroupingEdit = async (category, e) => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Designation")
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
        fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Department")
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
            setdocumentFiles([])
            setBtnSubmit(false)
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnSubmit(true)
        const isNameMatch = taskDesignationGroupingall.some(
            (item) =>
                item.subcategory === taskDesignationGrouping.subcategory &&
                item.category === taskDesignationGrouping.category &&
                item.frequency?.some(data => valueWeekly?.includes(data)));

        if (taskDesignationGrouping.category === "Please Select Category") {
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
        } else if (taskDesignationGrouping.subcategory === "Please Select Subcategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Subcategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedWeeklyOptions?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Frequency"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskDesignationGrouping.type === "Please Select Type") {
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
        else if (taskDesignationGrouping.type === "Designation" && selectedDesignationOptions?.length < 1) {
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
        else if (taskDesignationGrouping.type === "Department" && selectedDepartmentOptions?.length < 1) {
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
        else if (taskDesignationGrouping.type === "Employee" && selectedOptionsCompany?.length < 1) {
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
        else if (taskDesignationGrouping.type === "Employee" && selectedOptionsBranch?.length < 1) {
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
        else if (taskDesignationGrouping.type === "Employee" && selectedOptionsUnit?.length < 1) {
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
        else if (taskDesignationGrouping.type === "Employee" && selectedOptionsTeam?.length < 1) {
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
        else if (taskDesignationGrouping?.priority === "Please Select Priority") {
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
        else if (agenda === "" || agenda === "<p><br></p>") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Description"}
                    </p>
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
                        {"Already Data Exists.!!!"}
                    </p>
                </>
            );
            handleClickOpenerr();
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

        setValueWeekly([])
        setValueDesignation([])
        setSelectedDesignationOptions([])
        setScheduleGrouping([])
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully..!!!!"}</p>
            </>
        );
        handleClickOpenerr();
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
            setSelectedOptionsUnitEdit([...res?.data?.staskdesignationgrouping?.unit.map((t) => ({ ...t, label: t, value: t }))])
            fetchUnitAllEdit([...res?.data?.staskdesignationgrouping?.branch.map((t) => ({ ...t, label: t, value: t }))])

            setValueTeamCatEdit(res?.data?.staskdesignationgrouping?.team)
            setSelectedOptionsTeamEdit([...res?.data?.staskdesignationgrouping?.team.map((t) => ({ ...t, label: t, value: t }))])
            fetchTeamAllEdit(res?.data?.staskdesignationgrouping?.company, res?.data?.staskdesignationgrouping?.branch, [...res?.data?.staskdesignationgrouping?.unit.map((t) => ({ ...t, label: t, value: t }))])


            setSelectedDesignationOptionsEdit([...res?.data?.staskdesignationgrouping?.designation.map((t) => ({ ...t, label: t, value: t }))])
            setValueDesignationEdit(res?.data?.staskdesignationgrouping?.designation)

            setSelectedDepartmentOptionsEdit([...res?.data?.staskdesignationgrouping?.department.map((t) => ({ ...t, label: t, value: t }))])
            setValueDepartmentEdit(res?.data?.staskdesignationgrouping?.department)



            setSelectedEmployeeOptionsEdit([...res?.data?.staskdesignationgrouping?.employeenames.map((t) => ({ ...t, label: t, value: t }))])
            setValueEmployeeEdit(res?.data?.staskdesignationgrouping?.employeenames)
            const typeChecking = res?.data?.staskdesignationgrouping?.type === "Designation" ? [...res?.data?.staskdesignationgrouping?.designation.map((t) => ({ ...t, label: t, value: t }))] :
                res?.data?.staskdesignationgrouping?.type === "Department" ? [...res?.data?.staskdesignationgrouping?.department.map((t) => ({ ...t, label: t, value: t }))]
                    : [...res?.data?.staskdesignationgrouping?.team.map((t) => ({ ...t, label: t, value: t }))]
            fetchEmployeeOptionsEdit(res?.data?.staskdesignationgrouping?.company, res?.data?.staskdesignationgrouping?.branch, res?.data?.staskdesignationgrouping?.unit, typeChecking, res?.data?.staskdesignationgrouping?.type)
            handleClickOpenEdit();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    // get single row to view....
    const getviewCode = async (e) => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully..!!"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        } else if (
            taskDesignationGroupingEdit.subcategory === "Please Select Subcategory"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Subcategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (taskDesignationGroupingEdit.type === "Please Select Type") {
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
        else if (taskDesignationGroupingEdit.type === "Designation" && selectedDesignationOptionsEdit?.length < 1) {
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
        else if (taskDesignationGroupingEdit.type === "Department" && selectedDepartmentOptionsEdit?.length < 1) {
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
        else if (taskDesignationGroupingEdit.type === "Employee" && selectedOptionsCompanyEdit?.length < 1) {
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
        else if (taskDesignationGroupingEdit.type === "Employee" && selectedOptionsBranchEdit?.length < 1) {
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
        else if (taskDesignationGroupingEdit.type === "Employee" && selectedOptionsUnitEdit?.length < 1) {
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
        else if (taskDesignationGroupingEdit.type === "Employee" && selectedOptionsTeamEdit?.length < 1) {
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

        else if (selectedWeeklyOptionsEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Frequency"}
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
        else if (taskDesignationGroupingEdit?.priority === "Please Select Priority") {
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
        else if (taskDesignationGroupingEdit.description === "" || taskDesignationGroupingEdit.description === "<p><br></p>") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Description"}
                    </p>
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
                        {"Already Data Exists.!!!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendEditRequest();
        }
    };

    //get all Sub vendormasters.
    const fetchInterviewgrouping = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_TASKDESIGNATIONGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setReasonmastercheck(true);
            setTaskDesignationGroupingall(res_vendor?.data?.taskdesignationgrouping);
        } catch (err) {setReasonmastercheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all Sub vendormasters.
    const fetchInterviewgroupingall = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        { title: "Employee Names", field: "employeenames" },
        { title: "Schedule Status", field: "schedulestatus" },
        { title: "Task Assign", field: "taskassign" },
        { title: "Description", field: "description" },
    ];

    // Excel
    const fileName = "TaskAssignGrouping";

    const [checkpointticketData, setCheckpointticketData] = useState([]);

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "TaskAssignGrouping",
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

    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskDesignationGroupingall?.map((item, index) => ({
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
            employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            description: convertToNumberedList(item.description)
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
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
            width: 160,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 160,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
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
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("etaskassigngrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getCode(params.row.id, params.row.name);
                            }}
                        >
                            Change
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dtaskassigngrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vtaskassigngrouping") && (
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
                    {isUserRoleCompare?.includes("itaskassigngrouping") && (
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
                    &ensp;
                    {isUserRoleCompare?.includes("itaskassigngrouping") && (
                        <Link to={`/task/taskschedulelog/${params.row.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
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
            <Headtitle title={" Task Grouping"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>
                Task Assign Grouping
            </Typography>
            {isUserRoleCompare?.includes("ataskassigngrouping") && (
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
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
                                        options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
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
                                            setEmployeesNames([])
                                            setSelectedDesignationOptions([])
                                            setValueDesignation([])
                                            setSelectedDepartmentOptions([])
                                            setSelectedDesignationOptions([])
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
                                            setValueDesignation([])
                                            setValueDepartment([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>



                            {taskDesignationGrouping.type === "Designation" ?
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
                                taskDesignationGrouping.type === "Department" ?
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
                                    taskDesignationGrouping.type === "Employee" ?

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
                                                        options={branchOption
                                                            ?.filter((u) => valueCompanyCat?.includes(u.company))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.name,
                                                                value: u.name,
                                                            }))}
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
                                                        options={unitOption
                                                            ?.filter((u) => valueBranchCat?.includes(u.branch))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.name,
                                                                value: u.name,
                                                            }))}
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
                                    <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
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
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                                            <DeleteIcon />
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
                                        ...userStyle.buttonedit,
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
                                <Button sx={userStyle.btncancel} onClick={handleClear}>
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
                            <Grid item lg={4} md={6} sm={12} xs={12} >
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
                                        options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
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
                                            setEmployeesNamesEdit([])
                                            setValueEmployeeEdit([])
                                            setSelectedEmployeeOptionsEdit([])
                                            setSelectedDepartmentOptionsEdit([])
                                            setValueDepartmentEdit([])
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
                            {taskDesignationGroupingEdit?.type === "Designation" ?
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
                                taskDesignationGroupingEdit?.type === "Department" ?
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
                                    taskDesignationGroupingEdit?.type === "Employee" ?

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
                                    <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
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
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteEdit(index)}>
                                                            <DeleteIcon />
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
                                <Button variant="contained" type="submit" onClick={editSubmit}>
                                    Update
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
                            <Grid item md={2} xs={6} sm={6}>
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
                        {isUserRoleCompare?.includes("bdtaskassigngrouping") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
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
                                    <StyledDataGrid
                                     
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
                                        {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                                        {filteredDatas.length} entries
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
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delCheckpointticket(Checkpointticketsid)}
                        >
                            {" "}
                            OK{" "}
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
                                Task Assign Grouping Info
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
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {"SNO"}.
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {" "}
                                                    {"UserName"}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
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
                                                            {moment(item.date).format(
                                                                "DD-MM-YYYY hh:mm:ss a"
                                                            )}
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
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {"SNO"}.
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {" "}
                                                    {"UserName"}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
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
                                                            {moment(item.date).format(
                                                                "DD-MM-YYYY hh:mm:ss a"
                                                            )}
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
                                <TableCell> Category</TableCell>
                                <TableCell>Subcategory</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell> Designation</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Employee Names</TableCell>
                                <TableCell>Schedule Status</TableCell>
                                <TableCell>Task Assign</TableCell>
                                <TableCell> Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.subcategory}</TableCell>
                                        <TableCell>{row.frequency}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.designation}</TableCell>
                                        <TableCell>{row.department}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.employeenames}</TableCell>
                                        <TableCell>{row.schedulestatus}</TableCell>
                                        <TableCell>{row.taskassign}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Task Assign Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{taskDesignationGroupingEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subcategory</Typography>
                                    <Typography>{taskDesignationGroupingEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Frequency</Typography>
                                    <Typography>{taskDesignationGroupingEdit?.frequency?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{taskDesignationGroupingEdit?.type}</Typography>
                                </FormControl>
                            </Grid>

                            {taskDesignationGroupingEdit.type === "Designation" ?
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6"> Designation</Typography>
                                        <Typography>{taskDesignationGroupingEdit.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                    </FormControl>
                                </Grid> :
                                taskDesignationGroupingEdit.type === "Department" ?
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Department</Typography>
                                            <Typography>{taskDesignationGroupingEdit.department?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                        </FormControl>
                                    </Grid>

                                    :
                                    taskDesignationGroupingEdit.type === "Employee" ?

                                        <>

                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Company</Typography>
                                                    <Typography>{taskDesignationGroupingEdit.company?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Branch</Typography>
                                                    <Typography>{taskDesignationGroupingEdit.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Unit</Typography>
                                                    <Typography>{taskDesignationGroupingEdit.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6"> Team</Typography>
                                                    <Typography>{taskDesignationGroupingEdit.team?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                                </FormControl>
                                            </Grid>
                                        </>
                                        : ""
                            }

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Names</Typography>
                                    <Typography>{taskDesignationGroupingEdit.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Priority</Typography>
                                    <Typography>{taskDesignationGroupingEdit.priority}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Schedule Status</Typography>
                                    <Typography>{taskDesignationGroupingEdit.schedulestatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
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
                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
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
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delCheckpointticketcheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
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
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "70px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseModalert}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
        </Box>
    );
}

export default TaskDesignationGrouping;
