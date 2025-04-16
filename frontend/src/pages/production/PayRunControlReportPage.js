import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import StyledDataGrid from "../../components/TableStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from "../../components/PageHeading";
function PayRunControlReportPage() {

    const gridRef = useRef(null);
    const gridRefNeartat = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsNear, setSelectedRowsNear] = useState([]);
    //Datatable neartat
    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [idgrpedit, setidgrpedit] = useState([]);
    const [statusCheck, setStatusCheck] = useState(false);
    const [originaledit, setoriginaledit] = useState([]);

    const employeestatus = [
        { label: 'Live Employee', value: "Live Employee" },
        { label: 'Releave Employee', value: "Releave Employee" },
        { label: "Absconded", value: "Absconded" },
        { label: "Hold", value: "Hold" },
        { label: "Terminate", value: "Terminate" },
    ];
    const salary = [
        { label: 'Final Salary', value: 'Final Salary' },
        { label: "Fixed Salary", value: "Fixed Salary" },
        { label: "Production Salay", value: "Production Salay" },
        { label: "Whichever is Lower", value: "Whichever is Lower" },
        { label: "Whichever is Higher", value: "Whichever is Higher" },
    ];
    const deduction = [
        { label: 'Actual Deduction', value: "Actual Deduction" },
        { label: "On Value", value: "On Value" },
        { label: "On Penalty", value: "On Penalty" },
        { label: "Minimum Deduction", value: "Minimum Deduction" },
        { label: "Whichever is Lower", value: "Whichever is Lower" },
        { label: "Whichever is Higher", value: "Whichever is Higher" },
    ];
    const [payruncontrol, setPayruncontrol] = useState({
        company: "Please Select Company", empstatus: "Please Select Status",
        filtertype: "Please Select Filter Type",
        choosestatus: "Please Select Type",
        empname: "", userbranch: "", userdepartment: "",
        userunit: "", userteam: "", newgross: "",
        newgrosssymbol: "",
        achievedsymbol: "", achieved: "",
        achievedfrom: "", achievedto: "",
        newgrossfrom: "", newgrossto: "",
        salraytype: "Please Select SalaryType",
        deductiontype: "Please Select DeductionType", addedby: "",
        updatedby: "",
    });

    const [payruncontroledit, setPayruncontroledit] = useState({
        company: "Please Select Company", empstatus: "Please Select Status",
        empname: "", newgross: "", newgrosssymbol: "",
        achievedsymbol: "", achieved: "",
        achievedfrom: "", achievedto: "",
        newgrossfrom: "", newgrossto: "", salraytype: "Please Select SalaryType",
        deductiontype: "Please Select DeductionType", userbranch: "", userdepartment: "", userunit: "", userteam: ""
    });
    const [payruncontrolmaster, setPayruncontrolmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [teamsall, setTeamsall] = useState([]);
    const [departmentOpt, setDepartment] = useState([]);
    const [selectedBranchTo, setSelectedBranchTo] = useState([]);
    const [selectedUnitTo, setSelectedUnitTo] = useState([]);
    const [selectedTeamTo, setSelectedTeamTo] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState("Please Select Month");
    const [monthValues, setMonthValues] = useState([]);
    const [selectedYear, setSelectedYear] = useState("Please Select Year")
    const [selectedDepartmentTo, setSelectedDepartmentTo] = useState([]);
    const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);
    const [employeesall, setEmployeesall] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    // page refersh reload
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };

    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
    };

    let today = new Date();
    const currYear = today.getFullYear();
    const years = [];
    for (let year = currYear + 1; year >= currYear - 10; year--) {
        years.push({ value: year, label: year.toString() });
    }


    const [employeenamesDropdown, setEmployeeNamesDropdown] = useState([])
    const [employeenamesDropdownEdit, setEmployeeNamesDropdownEdit] = useState([])
    const [chooseProdOrGross, setChooseProdOrGross] = useState(false);
    const [chooseProdOrGrossEdit, setChooseProdOrGrossEdit] = useState(false);
    const [departmentValues, setDepartmentValues] = useState([])


    const fetchPayRunDetailsBasedOnData = async () => {
        setStatusCheck(true)
        let companiesto = selectedOptionsCompany.map((item) => item.value);
        let branchnamesto = selectedBranchTo.map((item) => item.value);
        let unitnamesto = selectedUnitTo.map((item) => item.value);
        let teamnamesto = selectedTeamTo.map((item) => item.value);
        let departments = selectedDepartmentTo.map((item) => item.value);
        let employeenamesto = selectedEmployeeTo?.map((item) => item.value);
        let filtertype = selectedEmployeeTo?.length > 0 ? "Individual" : departments?.length > 0 ? "Department" :
            selectedTeamTo?.length > 0 ? "Team" : unitnamesto?.length > 0 ? "Unit" : "Branch"
        try {
            let res = await axios.post(SERVICE.FILTER_PAY_RUN_REPORT_DATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: departments,
                company: companiesto,
                branch: branchnamesto,
                unit: unitnamesto,
                team: teamnamesto,
                employeenames: employeenamesto,
                month: selectedMonths,
                filtertype: filtertype,
                yearfiltered: selectedYear,
                empstatus: payruncontrol.empstatus
            });

            console.log(res.data)
            setPayruncontrolmaster(res?.data?.users)
            setStatusCheck(false)
        }
        catch (err) { setStatusCheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }

    }
    const fetchEmployeeNamesDropdown = async (options, status) => {
        let branch = [];
        let unit = [];
        let teamDrop = [];
        let department = [];
        let company = [];
        let empstatus;


        switch (status) {
            case "empstatus":
                department = [];
                company = [];
                unit = [];
                teamDrop = [];
                empstatus = options;
                break;

            case "company":
                company = options?.length > 0 ? options.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = [];
                unit = [];
                teamDrop = [];
                branch = [];
                break;

            case "department":
                department = options?.length > 0 ? options.map(data => data.value) : [];
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                unit = [];
                teamDrop = [];
                branch = [];
                break;

            case "branch":
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = options?.length > 0 ? options.map(data => data.value) : [];
                unit = [];
                teamDrop = [];
                break;

            case "unit":
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = options?.length > 0 ? options.map(data => data.value) : [];
                teamDrop = [];
                break;

            case "team":
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = selectedUnitTo?.length > 0 ? selectedUnitTo.map(data => data.value) : [];
                teamDrop = options?.length > 0 ? options.map(data => data.value) : [];
                break;

            default:
                company = [];
                department = [];
                branch = [];
                unit = [];
                teamDrop = [];
                empstatus = ""
                break;
        }
        try {

            let res = await axios.post(SERVICE.FILTER_PAY_RUN_REPORT_EMPLOYEE_NAMES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: department,
                company: company,
                branch: branch,
                unit: unit,
                team: teamDrop,
                empstatus: empstatus
            });
            setEmployeeNamesDropdown(res?.data?.users)

        }
        catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    }

    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);
    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        const data = options?.length > 0 ? options.map((a, index) => {
            return a.value;
        }) : []
        fetchEmployeeNamesDropdown(options, 'company')
        setSelectedOptionsCompany(options);
        // fetchBranchAll(options)
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branchto multiselect dropdown changes
    const handleBranchChangeTo = (options) => {
        setSelectedBranchTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'branch')
        setSelectedUnitTo([]);
        setSelectedEmployeeTo([]);
        setSelectedTeamTo([]);


    };
    const customValueRendererBranchTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unitto multiselect dropdown changes
    const handleUnitChangeTo = (options) => {
        setSelectedUnitTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'unit')
        setSelectedTeamTo([]);
        setSelectedEmployeeTo([]);

    };
    const customValueRendererUnitTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };
    //Teamto multiselect dropdown changes
    const handleTeamChangeTo = (options) => {
        setSelectedTeamTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'team')
        setSelectedEmployeeTo([]);
    };
    const customValueRendererTeamTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    //branchto multiselect dropdown changes
    const handleDepartmentChangeTo = (options) => {
        setSelectedDepartmentTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'department')
        setDepartmentValues(data)
        setSelectedEmployeeTo([]);

    };
    const customValueRendererDepartmentTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Department";
    };

    //employee multiselect dropdown changes
    const handleEmployeeChangeTo = (options) => {
        setSelectedEmployeeTo(options);
    };
    const customValueRendererEmployeeTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    const fetchTeamAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTeamsall(res.data.teamsdetails);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchDepartment = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setDepartment([

                ...res?.data?.departmentdetails?.map((t) => ({
                    ...t,
                    label: t.deptname,
                    value: t.deptname,
                })),
            ]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchEmployeesAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.USER_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployeesall(res.data.usersstatus);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchTeamAll();
        fetchDepartment();
        fetchEmployeesAll();

    }, []);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isErrorOpenpay, setIsErrorOpenpay] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [showAlertpay, setShowAlertpay] = useState();
    const [openview, setOpenview] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenNear, setIsDeleteOpenNear] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsneartat, setItemsNearTat] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allProjectedit, setAllProjectedit] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    useEffect(() => {
        fetchEmployeesAll();
    }, [isEditOpen])


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Payrun_Control_Group.png");
                });
            });
        }
    };

    const handleCaptureImagenear = () => {
        if (gridRefNeartat.current) {
            html2canvas(gridRefNeartat.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Payrun_Control_Individual.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const handleSelectionChangeNear = (newSelection) => {
        setSelectedRowsNear(newSelection.selectionModel);
    };


    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    const handleClickOpenerrpay = () => {
        setIsErrorOpenpay(true);
    };
    const handleCloseerrpay = async () => {
        setIsErrorOpenpay(false);

    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };


    const [openviewnear, setOpenviewnear] = useState(false);

    // view model
    const handleClickOpenviewnear = () => {
        setOpenviewnear(true);
    };

    const handleCloseviewnear = () => {
        setOpenviewnear(false);
    };

    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    //Delete model
    const handleClickOpenNear = () => {
        setIsDeleteOpenNear(true);
    };
    const handleCloseModNear = () => {
        setIsDeleteOpenNear(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRowsNear.length == 0) {
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

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
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

    // State for manage columns search query
    const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] = useState(false);
    const [anchorElNeartat, setAnchorElNeartat] = useState(null)
    const handleOpenManageColumnsNeartat = (event) => {
        setAnchorElNeartat(event.currentTarget);
        setManageColumnsOpenNeartat(true);
    };
    const handleCloseManageColumnsNeartat = () => {
        setManageColumnsOpenNeartat(false);
        setSearchQueryManageNeartat("")
    };

    const openneartat = Boolean(anchorElNeartat);
    const idneartat = openneartat ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const getRowClassNameNearTat = (params) => {
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
        empstatus: true,
        userdepartment: true,
        userbranch: true,
        userunit: true,
        userteam: true,
        empname: true,
        achieved: true,
        achievedsymbol: true,
        finalgross: true,
        finalachieved: true,
        newgrosssymbol: true,
        salraytype: true,
        deductiontype: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // Show All Columns & Manage Columns
    const initialColumnVisibilityNeartat = {
        serialNumber: true,
        checkbox: true,
        company: true,
        empstatus: true,
        userdepartment: true,
        userbranch: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        userunit: true,
        userteam: true,
        empname: true,
        achieved: true,
        achievedsymbol: true,
        finalgross: true,
        finalachieved: true,
        newgrosssymbol: true,
        salraytype: true,
        deductiontype: true,
        actions: true,
    };
    const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(initialColumnVisibilityNeartat);
    //set function to get particular row
    const rowData = async (id, idgrp) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.spayruncontrol);
            setidgrpedit(idgrp)
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const rowDataNear = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.spayruncontrol);
            handleClickOpenNear();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    let projectnearid = deleteproject._id;

    const delProjectcheckbox = async () => {
        setPageName(!pageName)
        try {

            const deletePromises = selectedRowsNear?.map((item) => {
                return axios.delete(`${SERVICE.PAYRUNCONTROL_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRowsNear([]);
            setSelectAllCheckedNear(false);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [isBtn, setIsBtn] = useState(false)



    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        // let departments = selectedDepartmentTo.map((item) => item.value);
        let company = selectedOptionsCompany.map((item) => item.value);
        // let branch = selectedBranchTo.map((item) => item.value);
        // let unit = selectedUnitTo.map((item) => item.value);
        // let team = selectedTeamTo.map((item) => item.value);
        // let empnames = selectedEmployeeTo.map((item) => item.value);
        if (!company?.length > 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (payruncontrol.filtertype === "Please Select Filter Type" || payruncontrol.filtertype === "" || payruncontrol.filtertype === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Filter Type for Employee Names"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (payruncontrol.empstatus === "Please Select Status") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Status"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (payruncontrol.filtertype === "Department" && selectedDepartmentTo.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(payruncontrol.filtertype) && selectedBranchTo.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (["Individual", "Team", "Unit"]?.includes(payruncontrol.filtertype) && selectedUnitTo.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedTeamTo.length === 0 && ["Individual", "Team"]?.includes(payruncontrol.filtertype)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedEmployeeTo.length === 0 && ["Individual"]?.includes(payruncontrol.filtertype)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Names"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedMonths === "Please Select Month" || selectedMonths === "" || selectedMonths === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Month"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedYear === "Please Select Year" || selectedYear === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please  Select Year"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            fetchPayRunDetailsBasedOnData();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setPayruncontrol({
            company: "Please Select Company",
            empstatus: "Please Select Status",
            filtertype: "Please Select Filter Type",
            choosestatus: "Please Select Type",
            empname: "", achieved: "", newgross: "",
            achievedsymbol: "",
            salraytype: "Please Select SalaryType", deductiontype: "Please Select DeductionType",
        });
        setSelectedMonths("Please Select Month")
        setMonthValues([])
        setPayruncontrolmaster([])
        setSelectedOptionsCompany([])
        setSelectedYear('Please Select Year')
        setSelectedBranchTo([]);
        setSelectedUnitTo([]);
        setSelectedTeamTo([]);
        setEmployeeNamesDropdown([])
        setSelectedDepartmentTo([]);
        setSelectedEmployeeTo([]);
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully!"}</p>
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
        setPayruncontroledit({
            company: "Please Select Company", empstatus: "Please Select Status",
            empname: "", achieved: "", achievedsymbol: "", newgross: "", salraytype: "Please Select SalaryType",
            deductiontype: "Please Select DeductionType"
        })
    };

    const [isEditOpenNear, setIsEditOpenNear] = useState(false);

    //Edit model...
    const handleClickOpenEditNear = () => {
        setIsEditOpenNear(true);
    };
    const handleCloseModEditNear = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenNear(false);
    };

    //Project updateby edit page...
    let updateby = payruncontroledit.updatedby;
    let addedby = payruncontroledit.addedby;

    let projectsid = payruncontroledit._id;






    const [uniqueid, setUniqueid] = useState(0)
    const [payrungrp, setpayrungrp] = useState([])

    const [payrungrpArray, setpayrungrpArray] = useState([])
    const [payruncontrolmasterArray, setPayruncontrolmasterArray] = useState([])

    const fetchPayrunControlArray = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setpayrungrpArray(res_project?.data?.payruncontrol);
            let single = res_project?.data?.payruncontrol

            const uniqueObjects = [];
            const uniqueKeysMap = new Map();

            single.forEach((obj) => {
                const key = `${obj.company}-${obj.empstatus}-${obj.achieved}-${obj.newgross}-${obj.salraytype}-${obj.deductiontype}-${obj.department}-${obj.branch}-${obj.unit}-${obj.team}-${obj.achievedsymbol}`;

                if (!uniqueKeysMap.has(key)) {
                    obj.id = [obj._id];
                    uniqueKeysMap.set(key, obj);
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    existingObj.empname = [...existingObj.empname, ...obj.empname];
                    existingObj.id = existingObj.id.concat(obj._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());
            setPayruncontrolmasterArray(uniqueObjects)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchPayrunControlArray();
    }, [isFilterOpen])

    //get all project.
    const fetchProjMasterAll = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllProjectedit(res_project?.data?.payruncontrol.filter((item) => !idgrpedit?.includes(item._id)));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Employee Status", field: "empstatus" },
        { title: "Department", field: "userdepartment" },
        { title: "Branch", field: "userbranch" },
        { title: "Unit", field: "userunit" },
        { title: "Team", field: "userteam" },
        { title: "Employee Name", field: "empname" },
        { title: "achieved", field: "achieved" },
        { title: "Achieved Symbol", field: "achievedsymbol" },
        { title: "NewGross", field: "newgross" },
        { title: "Salary Type", field: "salraytype" },
        { title: "Deduction Type", field: "deductiontype" },
    ];



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
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            payruncontrolmasterArray.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: "auto"
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Payrun_Control_Report_list.pdf");
    };


    // pdf.....
    const columnsnear = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Employee Status", field: "empstatus" },
        { title: "Department", field: "userdepartment" },
        { title: "Branch", field: "userbranch" },
        { title: "Unit", field: "userunit" },
        { title: "Team", field: "userteam" },
        { title: "Employee Name", field: "empname" },
        { title: "Production Achieved", field: "finalachieved" },
        { title: "New Gross", field: "finalgross" },
        { title: "Salary Type", field: "salraytype" },
        { title: "Deduction Type", field: "deductiontype" },
    ];



    const downloadPdf2 = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columnsnear.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTableNearTat.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            itemsneartat.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: "auto"
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Payrun_Control_Individual.pdf");
    };



    // Excel
    const fileName = "Payrun_Control_Report_list ";
    const fileNameNear = "Payrun_Control_Individual ";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Payrun_Control_Report_list ",
        pageStyle: "print",
    });



    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = payruncontrolmaster?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            empname: item?.empname?.length > 0 ? item.empname[0] : "",
            branch: item?.branch?.length > 0 ? item.branch[0] : "",
            unit: item?.unit?.length > 0 ? item.unit[0] : "",
            team: item?.team?.length > 0 ? item.team[0] : "",
            department: item?.department?.length > 0 ? item.department[0] : "",
            finalachieved:(item.newgrosssymbol && (item.achievedfrom || item?.achievedto || item?.achieved)) ?  item.achievedsymbol === "Between" ? `${item.achievedsymbol} - ${item.achievedfrom} to ${item.achievedto}` : `${item.achievedsymbol} - ${item.achieved}`:"",
            finalgross:(item.newgrosssymbol && (item.newgrossfrom || item?.newgrossto || item?.newgross)) ? item.newgrosssymbol === "Between" ? `${item.newgrosssymbol} - ${item.newgrossfrom} to ${item.newgrossto}` : `${item.newgrosssymbol} -${item.newgross}`:"",
       }));
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber();
    }, [payruncontrolmaster]);



    //serial no for listing items
    const addSerialNumberNearTat = () => {
        const itemsWithSerialNumber = payrungrp?.map((item, index) => ({
            ...item,
            _id: item._id,
            serialNumber: index + 1,

            finalachieved: item.achievedsymbol === "Between" ? `${item.achievedfrom} to ${item.achievedto}` : item.achieved,
            finalgross: item.newgrosssymbol === "Between" ? `${item.newgrossfrom} to ${item.newgrossto}` : item.newgross,
        }));
        setItemsNearTat(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberNearTat();
    }, [payrungrp]);



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

    //Datatable
    const handlePageChangeNearTatPrimary = (newPage) => {
        setPageNearTatPrimary(newPage);
    };

    const handlePageSizeChangeNearTatPrimary = (event) => {
        setPageSizeNearTatPrimary(Number(event.target.value));
        setPageNearTatPrimary(1);
    };


    //datatable....
    const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] = useState("");
    const handleSearchChangeNearTatPrimary = (event) => {
        setSearchQueryNearTatPrimary(event.target.value);
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


    const searchOverNearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
        return searchOverNearTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });


    const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice((pageNearTatPrimary - 1) * pageSizeNearTatPrimary, pageNearTatPrimary * pageSizeNearTatPrimary);

    const totalPagesNearTatPrimary = Math.ceil(filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary);

    const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

    const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
    const lastVisiblePageNearTatPrimary = Math.min(Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1), totalPagesNearTatPrimary);


    const pageNumbersNearTatPrimary = [];

    const indexOfLastItemNearTatPrimary = pageNearTatPrimary * pageSizeNearTatPrimary;
    const indexOfFirstItemNearTatPrimary = indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;


    for (let i = firstVisiblePageNearTatPrimary; i <= lastVisiblePageNearTatPrimary; i++) {
        pageNumbersNearTatPrimary.push(i);
    }


    useEffect(() => {
        fetchProjMasterAll();
    }, [isEditOpen, idgrpedit]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );


    const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

    const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
        <div>
            <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
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
            width: 80,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
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
            field: "empstatus",
            headerName: "Employee Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.empstatus,
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
            field: "empname",
            headerName: "Employee Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.empname,
            headerClassName: "bold-header",
        },
        {
            field: "finalachieved",
            headerName: "Production Achieved",
            flex: 0,
            width: 110,
            hide: !columnVisibility.finalachieved,
            headerClassName: "bold-header",
        },
        {
            field: "finalgross",
            headerName: "New Gross",
            flex: 0,
            width: 130,
            hide: !columnVisibility.finalgross,
            headerClassName: "bold-header",
        },
        {
            field: "salraytype",
            headerName: "Salary Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.salraytype,
            headerClassName: "bold-header",
        },
        {
            field: "deductiontype",
            headerName: "Deduction Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.deductiontype,
            headerClassName: "bold-header",
        },

    ];

    const columnDataTableNeartat = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeaderNear
                    selectAllCheckedNear={selectAllCheckedNear}
                    onSelectAllNear={() => {
                        if (rowDataTableNearTat.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }

                        if (selectAllCheckedNear) {
                            setSelectedRowsNear([]);
                        } else {
                            const allRowIds = rowDataTableNearTat.map((row) => row.id);
                            setSelectedRowsNear(allRowIds);
                        }
                        setSelectAllCheckedNear(!selectAllCheckedNear);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRowsNear.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRowsNear.includes(params.row.id)) {
                            updatedSelectedRows = selectedRowsNear.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRowsNear, params.row.id];
                        }

                        setSelectedRowsNear(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllCheckedNear(updatedSelectedRows.length === filteredDataNearTatPrimary.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 80,

            hide: !columnVisibilityNeartat.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibilityNeartat.serialNumber,
            headerClassName: "bold-header",
        },


        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.company,
            headerClassName: "bold-header",
        },
        {
            field: "empstatus",
            headerName: "Employee Status",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.empstatus,
            headerClassName: "bold-header",
        },

        {
            field: "userdepartment",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.userdepartment,
            headerClassName: "bold-header",
        },
        {
            field: "userbranch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.userbranch,
            headerClassName: "bold-header",
        },
        {
            field: "userunit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.userunit,
            headerClassName: "bold-header",
        },
        {
            field: "userteam",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.userteam,
            headerClassName: "bold-header",
        },
        {
            field: "empname",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.empname,
            headerClassName: "bold-header",
        },
        {
            field: "finalachieved",
            headerName: "Production Achieved",
            flex: 0,
            width: 110,
            hide: !columnVisibilityNeartat.finalachieved,
            headerClassName: "bold-header",
        },
        {
            field: "finalgross",
            headerName: "New Gross",
            flex: 0,
            width: 130,
            hide: !columnVisibilityNeartat.finalgross,
            headerClassName: "bold-header",
        },
        {
            field: "salraytype",
            headerName: "Salary Type",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.salraytype,
            headerClassName: "bold-header",
        },
        {
            field: "deductiontype",
            headerName: "Deduction Type",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.deductiontype,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item.serialNumber,
            idgrp: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empstatus: item.empstatus,
            empname: item.empname,
            empnames: item.empname,
            userdepartment: item.userdepartment,
            userbranch: item.userbranch,
            userunit: item.userunit,
            userteam: item.userteam,
            achieved: item.achievedsymbol + " " + item.achieved,
            achievedsymbol: item.achievedsymbol,
            // newgross: item.newgrosssymbol + " " + item.newgross,
            salraytype: item.salraytype,
            deductiontype: item.deductiontype,
        };
    });

    const rowDataTableNearTat = filteredDataNearTatPrimary.map((item, index) => {
        return {
            id: item._id,
            ...item,
            serialNumber: item.serialNumber,
            company: item.company,
            empstatus: item.empstatus,
            userdepartment: item.userdepartment,
            userbranch: item.userbranch,
            userunit: item.userunit,
            userteam: item.userteam,
            empname: item.empname[0],
            achieved: item.achievedsymbol + " " + item.achieved,
            achievedsymbol: item.achievedsymbol,
            newgross: item.newgrosssymbol + " " + item.newgross,
            salraytype: item.salraytype,
            deductiontype: item.deductiontype,
        };
    });




    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsNear.includes(row.id),
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


    // Show All Columns functionality
    const handleShowAllColumnsNeartat = () => {
        const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
        for (const columnKey in updatedVisibilityNeartat) {
            updatedVisibilityNeartat[columnKey] = true;
        }
        setColumnVisibilityNeartat(updatedVisibilityNeartat);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityNeartat = (field) => {
        setColumnVisibilityNeartat((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumnsNeartat = columnDataTableNeartat.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase())
    );


    const manageColumnsContentNeartat = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNeartat}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageNeartat} onChange={(e) => setSearchQueryManageNeartat(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityNeartat[column.field]} onChange={() => toggleColumnVisibilityNeartat(column.field)} />}
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityNeartat(initialColumnVisibilityNeartat)}>
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
                                columnDataTableNeartat.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityNeartat(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

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
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Department": t.userdepartment[0],
                    "Branch": t.userbranch[0],
                    "Unit": t.userunit[0],
                    "team": t.userteam[0],
                    "Employeename": t.empname,
                    "Production Achieved": t.finalachieved,
                    "New Gross": t.finalgross,
                    "Salary Type": t.salraytype,
                    "Deduction Type": t.deductiontype,

                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((t, index) => ({
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Department": t.userdepartment[0],
                    "Branch": t.userbranch[0],
                    "Unit": t.userunit[0],
                    "team": t.userteam[0],
                    "Employeename": t.empname,
                    "Production Achieved": t.finalachieved,
                    "New Gross": t.finalgross,
                    "Salary Type": t.salraytype,
                    "Deduction Type": t.deductiontype,

                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };


    const handleExportXL2 = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTableNearTat?.map((t, index) => ({
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Department": t.userdepartment[0],
                    "Branch": t.userbranch[0],
                    "Unit": t.userunit[0],
                    "team": t.userteam[0],
                    "Employeename": t.empname,
                    "Production Achieved": t.achievedsymbol + " " + t.finalachieved,
                    "New Gross": t.newgrosssymbol + " " + t.finalgross,
                    "Salary Type": t.salraytype,
                    "Deduction Type": t.deductiontype,

                })),
                fileNameNear,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                itemsneartat.map((t, index) => ({
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Department": t.userdepartment[0],
                    "Branch": t.userbranch[0],
                    "Unit": t.userunit[0],
                    "team": t.userteam[0],
                    "Employeename": t.empname,
                    "Production Achieved": t.achievedsymbol + " " + t.finalachieved,
                    "New Gross": t.newgrosssymbol + " " + t.finalgross,
                    "Salary Type": t.salraytype,
                    "Deduction Type": t.deductiontype,

                })),
                fileNameNear,
            );

        }

        setIsFilterOpen2(false)
    };

    return (
        <Box>
            <Headtitle title={"PAYRUN CONTROL REPORT PAGE"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Pay Run Control Report Page"
                modulename="PayRoll"
                submodulename="PayRoll Setup"
                mainpagename="Pay Run Control"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lpayruncontrolreport") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Pay Run Control Report Page</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setEmployeeNamesDropdown([])
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>



                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[
                                                { label: "Individual", value: "Individual" },
                                                { label: "Department", value: "Department" },
                                                { label: "Branch", value: "Branch" },
                                                { label: "Unit", value: "Unit" },
                                                { label: "Team", value: "Team" },
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.filtertype,
                                                value: payruncontrol.filtertype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({ ...payruncontrol, filtertype: e.value });
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setEmployeeNamesDropdown([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={employeestatus}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.empstatus,
                                                value: payruncontrol.empstatus,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({
                                                    ...payruncontrol, empstatus: e.value,
                                                });
                                                fetchEmployeeNamesDropdown(
                                                    e.value, "empstatus")
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(payruncontrol.filtertype) ? <>
                                    {/* Branch Unit Team */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) => selectedOptionsCompany.map((item) => item.value).includes(comp.company)                                            
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedBranchTo}

                                                onChange={handleBranchChangeTo}
                                                valueRenderer={customValueRendererBranchTo}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        selectedOptionsCompany.map((item) => item.value).includes(comp.company) && selectedBranchTo
                                                            .map((item) => item.value)
                                                            .includes(comp.branch)
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedUnitTo}
                                                onChange={handleUnitChangeTo}
                                                valueRenderer={customValueRendererUnitTo}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team
                                            </Typography>

                                            <MultiSelect
                                                options={Array.from(
                                                    new Set(
                                                        teamsall
                                                            ?.filter(
                                                                (comp) =>
                                                                    selectedBranchTo
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch) &&
                                                                    selectedUnitTo
                                                                        .map((item) => item.value)
                                                                        .includes(comp.unit)
                                                            )
                                                            ?.map((com) => com.teamname)
                                                    )
                                                ).map((teamname) => ({
                                                    label: teamname,
                                                    value: teamname,
                                                }))}
                                                value={selectedTeamTo}
                                                onChange={handleTeamChangeTo}
                                                valueRenderer={customValueRendererTeamTo}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                                    :
                                    ["Department"]?.includes(payruncontrol.filtertype) ?
                                        <>
                                            {/* Department */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOpt}
                                                        value={selectedDepartmentTo}
                                                        onChange={handleDepartmentChangeTo}
                                                        valueRenderer={customValueRendererDepartmentTo}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                        : ["Branch"]?.includes(payruncontrol.filtertype) ?
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Branch
                                                        </Typography>
                                                        <MultiSelect
                                                            options={isAssignBranch?.filter(
                                                                (comp) =>
                                                                    selectedOptionsCompany.map((item) => item.value).includes(comp.company)
                                                            )?.map(data => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedBranchTo}

                                                            onChange={handleBranchChangeTo}
                                                            valueRenderer={customValueRendererBranchTo}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            :
                                            ["Unit"]?.includes(payruncontrol.filtertype) ?
                                                <>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Branch
                                                            </Typography>
                                                            <MultiSelect
                                                                options={isAssignBranch?.filter(
                                                                    (comp) =>
                                                                        selectedOptionsCompany.map((item) => item.value).includes(comp.company)
                                                                )?.map(data => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                                value={selectedBranchTo}

                                                                onChange={handleBranchChangeTo}
                                                                valueRenderer={customValueRendererBranchTo}
                                                                labelledBy="Please Select Branch"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Unit
                                                            </Typography>
                                                            <MultiSelect
                                                                options={isAssignBranch?.filter(
                                                                    (comp) =>
                                                                        selectedOptionsCompany.map((item) => item.value).includes(comp.company) && selectedBranchTo
                                                                            .map((item) => item.value)
                                                                            .includes(comp.branch)
                                                                )?.map(data => ({
                                                                    label: data.unit,
                                                                    value: data.unit,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                                value={selectedUnitTo}
                                                                onChange={handleUnitChangeTo}
                                                                valueRenderer={customValueRendererUnitTo}
                                                                labelledBy="Please Select Branch"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                                : ""
                                }
                                {["Individual"]?.includes(payruncontrol.filtertype) &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name
                                            </Typography>
                                            <MultiSelect
                                                options={employeenamesDropdown?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                }))}
                                                value={selectedEmployeeTo}
                                                onChange={handleEmployeeChangeTo}
                                                valueRenderer={customValueRendererEmployeeTo}
                                                labelledBy="Please Select Employeename"
                                            />
                                        </FormControl>
                                    </Grid>}

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Months <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[
                                                { label: "January", value: "January" },
                                                { label: "February", value: "February" },
                                                { label: "March", value: "March" },
                                                { label: "April", value: "April" },
                                                { label: "May", value: "May" },
                                                { label: "June", value: "June" },
                                                { label: "July", value: "July" },
                                                { label: "August", value: "August" },
                                                { label: "September", value: "September" },
                                                { label: "October", value: "October" },
                                                { label: "November", value: "November" },
                                                { label: "December", value: "December" }
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: selectedMonths,
                                                value: selectedMonths,
                                            }}
                                            onChange={(e) => {
                                                setSelectedMonths(e.value);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Year <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={years}
                                            styles={colourStyles}
                                            value={{
                                                label: selectedYear,
                                                value: selectedYear,
                                            }}
                                            onChange={(e) => {
                                                setSelectedYear(e.value);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />

                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isBtn}>
                                        FILTER
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpayruncontrolreport") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Pay Run Control Report List</Typography>
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
                                        {/* <MenuItem value={payruncontrolmaster?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelpayruncontrolreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPayrunControlArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpayruncontrolreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPayrunControlArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpayruncontrolreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpayruncontrolreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchPayrunControlArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepayruncontrolreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
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
                        <br />
                        <br />

                        {statusCheck ? (
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
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
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
            <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
                <Dialog open={isErrorOpenpay} onClose={handleCloseerrpay} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpay}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerrpay}
                        >
                            ok
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
                        <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Employee Status</TableCell>
                            <TableCell>Deaprtment</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell> Employee Name</TableCell>
                            <TableCell>Production Achieved</TableCell>
                            <TableCell>New Gross</TableCell>
                            <TableCell>Salary Type</TableCell>
                            <TableCell>Deduction Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.empstatus}</TableCell>
                                    <TableCell>{row.userdepartment}</TableCell>
                                    <TableCell>{row.userbranch}</TableCell>
                                    <TableCell>{row.userunit}</TableCell>
                                    <TableCell>{row.userteam}</TableCell>
                                    <TableCell>{row.empname}</TableCell>
                                    <TableCell>{row.finalachieved}</TableCell>
                                    <TableCell>{row.finalgross}</TableCell>
                                    <TableCell>{row.salraytype}</TableCell>
                                    <TableCell>{row.deductiontype}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                            fetchPayrunControlArray()
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
            {/*Export XL Data  */}
            <Dialog open={isFilterOpen2} onClose={handleCloseFilterMod2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod2}
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
                            handleExportXL2("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL2("overall")
                            fetchPayrunControlArray()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen2} onClose={handleClosePdfFilterMod2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod2}
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
                            downloadPdf2("filtered")
                            setIsPdfFilterOpen2(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf2("overall")
                            setIsPdfFilterOpen2(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default PayRunControlReportPage;