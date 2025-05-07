import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
function Paycontrol() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    const [filteredRowDataNeartat, setFilteredRowDataNeartat] = useState([]);
    const [filteredChangesNeartat, setFilteredChangesNeartat] = useState(null);

    const [overallItemsNeartat, setOverallItemsNeartat] = useState([]);

    let exportColumnNames = [
        'Company',

        'Branch',
        'Unit',
        'Team',

        'Employee Status',
        'Filter Type',
        'Employee Name',

        'Achieved Type',
        'Achieved Value',
        'Newgross Type',
        'Newgross Value',


        'Production Achieved',
        'New Gross',
        'Salary Type',
        'Deduction Type'
    ];
    let exportRowValues = [
        'company',

        'branch',
        'unit',
        'team',

        'empstatus',
        'filtertype',
        'empname',

        'achievedsymbol',
        'achieved',
        'newgrosssymbol',
        'newgross',

        'finalachieved',
        'finalgross',
        'salraytype',
        'deductiontype'
    ];

    let exportColumnNamesNearTat = [
        'Company',
        'Employee Status',
        'Filter Type',
        'Department',
        'Branch',
        'Unit',
        'Team',
        'Employee Name',
        'Achieved Type',
        'Achieved Value',
        'Newgross Type',
        'Newgross Value',
        'Production Achieved',
        'New Gross',
        'Salary Type',
        'Deduction Type'
    ];
    let exportRowValuesNearTat = [
        'company',
        'empstatus',
        'filtertype', 'userdepartment',
        'userbranch', 'userunit',
        'userteam', 'empname',
        'achievedsymbol',
        'achieved',
        'newgrosssymbol',
        'newgross',
        'finalachieved', 'finalgross',
        'salraytype', 'deductiontype'
    ];

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
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


    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [isHandleChangeNear, setIsHandleChangeNear] = useState(false);
    const [searchedStringNear, setSearchedStringNear] = useState("")
    const gridRef = useRef(null);
    const gridRefNeartat = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsNear, setSelectedRowsNear] = useState([]);
    //Datatable neartat
    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [idgrpedit, setidgrpedit] = useState([]);
    const [originaledit, setoriginaledit] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loaderSecond, setLoaderSecond] = useState(false);
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
        { label: "Production Salary", value: "Production Salary" },
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
        choosestatus: "",
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
            pagename: String("Pay Run Control"),
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
    const [payruncontrolmaster, setPayruncontrolmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

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
    const { auth } = useContext(AuthContext);
    const [teamsall, setTeamsall] = useState([]);
    const [departmentOpt, setDepartment] = useState([]);
    const [selectedBranchTo, setSelectedBranchTo] = useState([]);
    const [selectedUnitTo, setSelectedUnitTo] = useState([]);
    const [selectedTeamTo, setSelectedTeamTo] = useState([]);
    const [selectedDepartmentTo, setSelectedDepartmentTo] = useState([]);
    const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);
    const [employeesall, setEmployeesall] = useState([]);

    const [selectedBranchToEdit, setSelectedBranchToEdit] = useState([]);
    const [selectedUnitToEdit, setSelectedUnitToEdit] = useState([]);
    const [selectedTeamToEdit, setSelectedTeamToEdit] = useState([]);
    const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState([]);
    const [selectedDepartmentToEdit, setSelectedDepartmentToEdit] = useState([]);

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

    const [employeenamesDropdown, setEmployeeNamesDropdown] = useState([])
    const [employeenamesDropdownEdit, setEmployeeNamesDropdownEdit] = useState([])
    const [chooseProdOrGross, setChooseProdOrGross] = useState(false);
    const [chooseProdOrGrossEdit, setChooseProdOrGrossEdit] = useState(false);
    const [departmentValues, setDepartmentValues] = useState([])


    const fetchEmployeeNamesBasedTeam = async (company, empstatus, options, status) => {
        let branch = [];
        let unit = [];
        let teamDrop = [];
        let department = [];

        switch (status) {
            case "empstatus":
                department = [];
                company = [];
                unit = [];
                teamDrop = [];
                break;
            case "department":
                department = options?.length > 0 ? options.map(data => data.value) : [];
                company = [];
                unit = [];
                teamDrop = [];
                break;
            case "branch":
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = options?.length > 0 ? options.map(data => data.value) : [];
                unit = [];
                teamDrop = [];
                break;

            case "unit":
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = options?.length > 0 ? options.map(data => data.value) : [];
                teamDrop = [];
                break;

            case "team":
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = selectedUnitTo?.length > 0 ? selectedUnitTo.map(data => data.value) : [];
                teamDrop = options?.length > 0 ? options.map(data => data.value) : [];
                break;

            default:
                department = [];
                branch = [];
                unit = [];
                teamDrop = [];
                break;
        }
        try {

            let res = await axios.post(SERVICE.EMPLOYEE_NAMES_BASES_ON_STATUS_PAYRUN, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: "",
                empstatus: empstatus,
                department: department,
                status: status,
                company: company,
                branch: branch,
                unit: unit,
                team: teamDrop,
            });
            const empNames = res?.data?.users?.length > 0 ? res?.data?.users : [];
            setEmployeeNamesDropdown(empNames)

        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    // Fetching Employee Names DropDown Based on Employee Status
    const fetchEmployeeNamesBasedTeamEdit = async (company, empstatus, department, branch, unit, team, status) => {
        let branchVal = [];
        let departmentVal = [];
        let unitVal = [];
        let teamVal = [];
        switch (status) {
            case "empstatus":
                departmentVal = [];
                branchVal = [];
                unitVal = [];
                teamVal = [];
                break;
            case "department":
                departmentVal = department?.length > 0 ? department.map(data => data.value) : [];
                branchVal = [];
                unitVal = [];
                teamVal = [];
                break;
            case "branch":
                departmentVal = department?.length > 0 ? department?.map(data => data.value) : []
                branchVal = branch?.length > 0 ? branch.map(data => data.value) : [];
                unitVal = [];
                teamVal = [];
                break;

            case "unit":
                departmentVal = department?.length > 0 ? department?.map(data => data.value) : []
                branchVal = branch?.length > 0 ? branch.map(data => data.value) : [];
                unitVal = unit?.length > 0 ? unit.map(data => data.value) : [];
                teamVal = [];
                break;

            case "team":
                departmentVal = department?.length > 0 ? department?.map(data => data.value) : []
                branchVal = branch?.length > 0 ? branch.map(data => data.value) : [];
                unitVal = unit?.length > 0 ? unit.map(data => data.value) : [];
                teamVal = team?.length > 0 ? team.map(data => data.value) : [];
                break;

            default:
                departmentVal = [];
                branchVal = [];
                unitVal = [];
                teamVal = [];
                break;
        }
        try {
            let res = await axios.post(SERVICE.EMPLOYEE_NAMES_BASES_ON_STATUS_PAYRUN, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: "",
                empstatus: empstatus,
                status: status,
                department: departmentVal,
                company: company,
                branch: branchVal,
                unit: unitVal,
                team: teamVal,
            });
            const empNames = res?.data?.users?.length > 0 ? res?.data?.users : [];
            setEmployeeNamesDropdownEdit(empNames)

        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }


    //branchto multiselect dropdown changes
    const handleBranchChangeTo = (options) => {
        setSelectedBranchTo(options);
        setSelectedUnitTo([]);
        setSelectedEmployeeTo([]);
        setSelectedTeamTo([]);
        fetchEmployeeNamesBasedTeam(payruncontrol.company, payruncontrol.empstatus, options, 'branch');

    };
    const customValueRendererBranchTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unitto multiselect dropdown changes
    const handleUnitChangeTo = (options) => {
        setSelectedUnitTo(options);
        setSelectedTeamTo([]);
        setSelectedEmployeeTo([]);
        fetchEmployeeNamesBasedTeam(payruncontrol.company, payruncontrol.empstatus, options, 'unit');

    };
    const customValueRendererUnitTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };
    //Teamto multiselect dropdown changes
    const handleTeamChangeTo = (options) => {
        setSelectedTeamTo(options);
        setSelectedEmployeeTo([]);
        fetchEmployeeNamesBasedTeam(payruncontrol.company, payruncontrol.empstatus, options, 'team');
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
        setDepartmentValues(data)
        setSelectedEmployeeTo([]);
        fetchEmployeeNamesBasedTeam(payruncontrol.company,
            payruncontrol.empstatus,
            options, "department")
    };


    const customValueRendererDepartmentTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Department";
    };
    //branchto multiselect dropdown changes
    const handleDepartmentChangeToEdit = (options) => {
        setSelectedDepartmentToEdit(options);
        fetchEmployeeNamesBasedTeamEdit(payruncontroledit.company,
            payruncontroledit.empstatus, options, selectedBranchToEdit,
            selectedUnitToEdit, selectedTeamToEdit, 'department')
        setSelectedUnitToEdit([]);
        setSelectedTeamToEdit([]);
        setSelectedEmployeeToEdit([]);
        setSelectedBranchToEdit([]);
    };
    const customValueRendererDepartmentToEdit = (valueCate, _employeename) => {
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
    //branchto multiselect dropdown changes
    const handleBranchChangeToEdit = (options) => {
        setSelectedBranchToEdit(options);
        fetchEmployeeNamesBasedTeamEdit(payruncontroledit.company,
            payruncontroledit.empstatus, selectedDepartmentToEdit, options,
            selectedUnitToEdit, selectedTeamToEdit, 'branch')
        setSelectedUnitToEdit([]);
        setSelectedTeamToEdit([]);
        setSelectedEmployeeToEdit([]);
    };
    const customValueRendererBranchToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };
    //unitto multiselect dropdown changes
    const handleUnitChangeToEdit = (options) => {
        setSelectedUnitToEdit(options);
        fetchEmployeeNamesBasedTeamEdit(payruncontroledit.company,
            payruncontroledit.empstatus, selectedDepartmentToEdit, selectedBranchToEdit,
            options, selectedTeamToEdit, 'unit')
        setSelectedTeamToEdit([]);
        setSelectedEmployeeToEdit([]);
    };
    const customValueRendererUnitToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    const handleTeamChangeToEdit = (options) => {
        setSelectedTeamToEdit(options);
        fetchEmployeeNamesBasedTeamEdit(payruncontroledit.company,
            payruncontroledit.empstatus, selectedDepartmentToEdit, selectedBranchToEdit,
            selectedUnitToEdit, options, 'team')
        setSelectedEmployeeToEdit([]);
    };
    const customValueRendererTeamToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };
    //employee multiselect dropdown changes
    const handleEmployeeChangeToEdit = (options) => {
        setSelectedEmployeeToEdit(options);
    };
    const customValueRendererEmployeeToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select To Employee Name";
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    const [allProjecteditIndidvidual, setAllProjecteditIndividual] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    useEffect(() => {
        fetchEmployeesAll();
    }, [isEditOpen])

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Payrun_Control.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const gridRefTableImgnear = useRef(null);
    // image
    const handleCaptureImagenear = () => {
        if (gridRefTableImgnear.current) {
            domtoimage.toBlob(gridRefTableImgnear.current)
                .then((blob) => {
                    saveAs(blob, "Payrun_Control.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
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
        await fetchPayrunControl();
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
        setIsHandleChangeNear(true);
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
        empstatus: true,
        empname: true,
        achieved: true,
        achievedsymbol: true,
        newgross: true,
        salraytype: true,
        finalgross: true,
        finalachieved: true,
        filtertype: true,
        newgrosssymbol: true,
        deductiontype: true,
        actions: true,
        branch: true,
        unit: true,
        team: true,


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
        userunit: true,
        userteam: true,
        empname: true,
        achieved: true,
        achievedsymbol: true,
        finalgross: true,
        finalachieved: true,
        newgrosssymbol: true,
        salraytype: true,
        filtertype: true,
        newgross: true,
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const rowDataNear = async (id, idgrp) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.spayruncontrol);
            setidgrpedit(idgrp)
            handleClickOpenNear();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    let projectnearid = deleteproject._id;
    const delProject = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = idgrpedit?.map((item) => {
                return axios.delete(`${SERVICE.PAYRUNCONTROL_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);
            setIsHandleChangeNear(false);
            await fetchPayrunControl();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const delProjectNear = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.PAYRUNCONTROL_SINGLE}/${projectnearid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchPayrunControl();
            handleCloseModNear();
            setSelectedRowsNear([]);
            setPageNearTatPrimary(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

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
            await fetchPayrunControl();
            handleCloseModcheckbox();
            setSelectedRowsNear([]);
            setSelectAllCheckedNear(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [isBtn, setIsBtn] = useState(false)


    //add function
    const sendRequest = async () => {
        setIsBtn(true)
        let branchnamesto = selectedBranchTo.map((item) => item.value);
        let unitnamesto = selectedUnitTo.map((item) => item.value);
        let teamnamesto = selectedTeamTo.map((item) => item.value);
        let departments = selectedDepartmentTo.map((item) => item.value);
        let employeenamesto = selectedEmployeeTo?.length > 0 ? selectedEmployeeTo?.map((item) => item.value) : ["ALL"];
        let uniqueval = uniqueid ? uniqueid + 1 : 1

        setPageName(!pageName)
        try {
            employeenamesto?.map((item) => {
                return axios.post(`${SERVICE.PAYRUNCONTROL_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(payruncontrol.company),
                    empstatus: String(payruncontrol.empstatus),
                    department: departments,
                    filtertype: payruncontrol.filtertype,
                    choosestatus: payruncontrol.choosestatus,
                    choosetype: chooseProdOrGross,
                    branch: branchnamesto,
                    unit: unitnamesto,
                    team: teamnamesto,
                    userdepartment: departments.length > 0 ? employeesall.find(d => d.companyname === item)?.department : [],
                    userbranch: branchnamesto.length > 0 ? employeesall.find(d => d.companyname === item)?.branch : [],
                    userunit: unitnamesto.length > 0 ? employeesall.find(d => d.companyname === item)?.unit : [],
                    userteam: teamnamesto.length > 0 ? employeesall.find(d => d.companyname === item)?.team : [],
                    empname: item,
                    achievedsymbol: String(payruncontrol.achievedsymbol),
                    achieved: String(payruncontrol.achieved),
                    achievedfrom: String(payruncontrol.achievedfrom),
                    achievedto: String(payruncontrol.achievedto),
                    newgrosssymbol: String(payruncontrol.newgrosssymbol),
                    newgross: String(payruncontrol.newgross),
                    newgrossfrom: String(payruncontrol.newgrossfrom),
                    newgrossto: String(payruncontrol.newgrossto),
                    salraytype: String(payruncontrol.salraytype),
                    deductiontype: String(payruncontrol.deductiontype),
                    uniqueid: uniqueval,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            });
            await fetchPayrunControl();
            setPayruncontrol({
                ...payruncontrol,
                newgross: "",
                newgrosssymbol: "",
                achievedsymbol: "", achieved: "",
                achievedfrom: "", achievedto: "",
                newgrossfrom: "", newgrossto: "",
            });
            setChooseProdOrGross(false)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const empNames = selectedEmployeeTo?.length > 0 ? selectedEmployeeTo : [{ label: "ALL", value: "ALL" }]
        const isNameMatch = payruncontrolmaster?.some((item) =>
            item.company === payruncontrol.company &&
            item.empstatus === payruncontrol.empstatus &&
            item.filtertype === payruncontrol.filtertype &&
            (selectedDepartmentTo.length > 0 ? item.department.some((item) =>
                selectedDepartmentTo.map((item) => item.value).includes(item)) : true
            ) &&
            (selectedBranchTo.length > 0 ? item.branch.some((item) =>
                selectedBranchTo.map((item) => item.value).includes(item)) : true) &&
            (selectedUnitTo.length > 0 ? item.unit.some((item) =>
                selectedUnitTo.map((item) => item.value).includes(item)) : true) &&
            (selectedTeamTo.length > 0 ? item.team.some((item) =>
                selectedTeamTo.map((item) => item.value).includes(item)) : true) &&
            item.empname.some((item) => {
                if (item === "ALL") {
                    return true
                } else {
                    return empNames?.map((item) => item.value).includes(item)

                }
            }
            )

        );

        if (payruncontrol.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontrol.filtertype === "Please Select Filter Type" || payruncontrol.filtertype === "" || payruncontrol.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontrol.empstatus === "Please Select Status") {
            setPopupContentMalert("Please Select Employee Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (payruncontrol.filtertype === "Department" && selectedDepartmentTo.length === 0) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(payruncontrol.filtertype) && selectedBranchTo.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(payruncontrol.filtertype) && selectedUnitTo.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (selectedTeamTo.length === 0 && ["Individual", "Team"]?.includes(payruncontrol.filtertype)) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (selectedEmployeeTo.length === 0 && ["Individual"]?.includes(payruncontrol.filtertype)) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }



        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.achievedsymbol === "") {
            setPopupContentMalert("Please Select Achieved Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.achievedsymbol !== "Between" && payruncontrol.achieved === "") {
            setPopupContentMalert("Please Enter achieved");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.achievedsymbol === "Between" && payruncontrol.achievedfrom === "") {
            setPopupContentMalert("Please Enter Production achievedFrom");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.achievedsymbol === "Between" && payruncontrol.achievedto === "") {
            setPopupContentMalert("Please Enter Production achievedTo");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Production" && payruncontrol.achievedsymbol === "") {
            setPopupContentMalert("Please Select Achieved Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Production" && payruncontrol.achievedsymbol !== "Between" && payruncontrol.achieved === "") {
            setPopupContentMalert("Please Enter achieved");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Production" && payruncontrol.achievedsymbol === "Between" && payruncontrol.achievedfrom === "") {
            setPopupContentMalert("Please Enter Production achievedFrom");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Production" && payruncontrol.achievedsymbol === "Between" && payruncontrol.achievedto === "") {
            setPopupContentMalert("Please Enter Production achievedTo");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }

        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.newgrosssymbol === "") {
            setPopupContentMalert("Please Select New Gross Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.newgrosssymbol !== "Between" && payruncontrol.newgross === "") {
            setPopupContentMalert("Please Enter Newgross(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.newgrosssymbol === "Between" && payruncontrol.newgrossfrom === "") {
            setPopupContentMalert("Please Enter Newgross From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (chooseProdOrGross && payruncontrol?.choosestatus === "Both" && payruncontrol.newgrosssymbol === "Between" && payruncontrol.newgrossto === "") {
            setPopupContentMalert("Please Enter Newgross To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }


        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "New Gross" && payruncontrol.newgrosssymbol === "") {
            setPopupContentMalert("Please Select New Gross Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "New Gross" && payruncontrol.newgrosssymbol !== "Between" && payruncontrol.newgross === "") {
            setPopupContentMalert("Please Enter Newgross(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGross && payruncontrol?.choosestatus === "New Gross" && payruncontrol.newgrosssymbol === "Between" && payruncontrol.newgrossfrom === "") {
            setPopupContentMalert("Please Enter Newgross From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (chooseProdOrGross && payruncontrol?.choosestatus === "New Gross" && payruncontrol.newgrosssymbol === "Between" && payruncontrol.newgrossto === "") {
            setPopupContentMalert("Please Enter Newgross To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }



        else if (payruncontrol.salraytype === "Please Select SalaryType") {
            setPopupContentMalert("Please  Select SalaryType");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontrol.deductiontype === "Please Select DeductionType") {
            setPopupContentMalert("Please  Select DeductionType");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (isNameMatch) {
            setPopupContentMalert("This Data  Already Exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else {
            setSearchQuery("")
            setSearchQueryManageNeartat("")
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setPayruncontrol({
            company: "Please Select Company",
            empstatus: "Please Select Status",
            filtertype: "Please Select Filter Type",
            choosestatus: "Both",
            empname: "", achieved: "", newgross: "",
            achievedsymbol: "",
            salraytype: "Please Select SalaryType", deductiontype: "Please Select DeductionType",
        });
        setSelectedBranchTo([]);
        setSelectedUnitTo([]);
        setSelectedTeamTo([]);
        setEmployeeNamesDropdown([])
        setSelectedDepartmentTo([]);
        setChooseProdOrGross(false)
        setSelectedEmployeeTo([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
        setSearchQueryManageNeartat("")
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
        // fetchPayrunControl();
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

    //get single row to edit....
    const getCode = async (e, idgrp, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setoriginaledit(res?.data?.spayruncontrol)
            setPayruncontroledit(res?.data?.spayruncontrol);
            let company = res?.data?.spayruncontrol?.company;
            let empstatus = res?.data?.spayruncontrol?.empstatus;
            let filtertype = res?.data?.spayruncontrol?.filtertype;
            let checkDepartment = res?.data?.spayruncontrol?.department?.length > 0 ?
                res?.data?.spayruncontrol?.department?.map(data => ({
                    label: data,
                    value: data
                })) : []
            let checkBranch = res?.data?.spayruncontrol?.branch?.length > 0 ?
                res?.data?.spayruncontrol?.branch?.map(data => ({
                    label: data,
                    value: data
                })) : []
            let checkUnit = res?.data?.spayruncontrol?.unit?.length > 0 ?
                res?.data?.spayruncontrol?.unit?.map(data => ({
                    label: data,
                    value: data
                })) : []
            let checkTeam = res?.data?.spayruncontrol?.team?.length > 0 ?
                res?.data?.spayruncontrol?.team?.map(data => ({
                    label: data,
                    value: data
                })) : [];
            fetchEmployeeNamesBasedTeamEdit(company, empstatus, checkDepartment, checkBranch, checkUnit, checkTeam, filtertype,)
            setChooseProdOrGrossEdit(res?.data?.spayruncontrol?.choosetype)
            setSelectedBranchToEdit(
                res?.data?.spayruncontrol.branch.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedUnitToEdit(
                res?.data?.spayruncontrol.unit.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedTeamToEdit(
                res?.data?.spayruncontrol.team.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );

            const setemp = departmentOpt.filter((item) => res?.data?.spayruncontrol.department.includes(item.deptname))

            setSelectedDepartmentToEdit(setemp);
            setSelectedEmployeeToEdit(
                name.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setChooseProdOrGrossEdit(res?.data?.spayruncontrol?.choosetype)

            handleClickOpenEdit();
            setidgrpedit(idgrp)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //individual
    const getCodeNear = async (e, idgrp, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPayruncontroledit(res?.data?.spayruncontrol);
            setoriginaledit(res?.data?.spayruncontrol)
            setChooseProdOrGrossEdit(res?.data?.spayruncontrol?.choosetype)

            setSelectedBranchToEdit(
                res?.data?.spayruncontrol.branch.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedUnitToEdit(
                res?.data?.spayruncontrol.unit.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedTeamToEdit(
                res?.data?.spayruncontrol.team.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedDepartmentToEdit(
                res?.data?.spayruncontrol.department.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedEmployeeToEdit(
                res?.data?.spayruncontrol.empname.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            handleClickOpenEditNear();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [viewpay, setviewPay] = useState([])
    const [viewpaynear, setviewPaynear] = useState([])
    // get single row to view....
    const getviewCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPayruncontroledit({
                ...res?.data?.spayruncontrol,
                finalachieved: res?.data?.spayruncontrol.achievedsymbol === "Between" ? `${res?.data?.spayruncontrol.achievedfrom} to ${res?.data?.spayruncontrol.achievedto}` : res?.data?.spayruncontrol.achieved,
                finalgross: res?.data?.spayruncontrol.newgrosssymbol === "Between" ? `${res?.data?.spayruncontrol.newgrossfrom} to ${res?.data?.spayruncontrol.newgrossto}` : res?.data?.spayruncontrol.newgross,
            });
            setviewPay(name.map((item) => ({
                ...item,
                label: item,
                value: item,
            })));
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getviewCodeNear = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setviewPaynear({
                ...res?.data?.spayruncontrol,
                finalachieved: res?.data?.spayruncontrol.achievedsymbol === "Between" ? `${res?.data?.spayruncontrol.achievedfrom} to ${res?.data?.spayruncontrol.achievedto}` : res?.data?.spayruncontrol.achieved,
                finalgross: res?.data?.spayruncontrol.newgrosssymbol === "Between" ? `${res?.data?.spayruncontrol.newgrossfrom} to ${res?.data?.spayruncontrol.newgrossto}` : res?.data?.spayruncontrol.newgross,
            })
            handleClickOpenviewnear();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = payruncontroledit.updatedby;
    let addedby = payruncontroledit.addedby;

    let projectsid = payruncontroledit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let branchnamesto = selectedBranchToEdit.map((item) => item.value);
        let unitnamesto = selectedUnitToEdit.map((item) => item.value);
        let teamnamesto = selectedTeamToEdit.map((item) => item.value);
        let departments = selectedDepartmentToEdit.map((item) => item.value);
        let employeenamesto = selectedEmployeeToEdit?.length > 0 ? selectedEmployeeToEdit?.map((item) => item.value) : ["ALL"];

        setPageName(!pageName)
        try {
            const deletePromises = idgrpedit?.map((item) => {
                return axios.delete(`${SERVICE.PAYRUNCONTROL_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            await fetchPayrunControl();
            await Promise.all(deletePromises);
            const promises = employeenamesto?.map((item) => {
                return axios.post(`${SERVICE.PAYRUNCONTROL_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(payruncontroledit.company),
                    empstatus: String(payruncontroledit.empstatus),
                    department: departments,
                    branch: branchnamesto,
                    unit: unitnamesto,
                    team: teamnamesto,
                    filtertype: payruncontroledit.filtertype,
                    choosestatus: payruncontroledit.choosestatus,
                    choosetype: chooseProdOrGrossEdit,
                    userdepartment: departments.length > 0 ? employeesall.find(d => d.companyname === item)?.department : [],
                    userbranch: branchnamesto.length > 0 ? employeesall.find(d => d.companyname === item)?.branch : [],
                    userunit: unitnamesto.length > 0 ? employeesall.find(d => d.companyname === item)?.unit : [],
                    userteam: teamnamesto.length > 0 ? employeesall.find(d => d.companyname === item)?.team : [],
                    empname: item,

                    achievedsymbol: String(payruncontroledit.achievedsymbol),
                    achieved: String(payruncontroledit.achieved),
                    achievedfrom: String(payruncontroledit.achievedfrom),
                    achievedto: String(payruncontroledit.achievedto),

                    newgrosssymbol: String(payruncontroledit.newgrosssymbol),
                    newgross: String(payruncontroledit.newgross),
                    newgrossfrom: String(payruncontroledit.newgrossfrom),
                    newgrossto: String(payruncontroledit.newgrossto),


                    salraytype: String(payruncontroledit.salraytype),
                    deductiontype: String(payruncontroledit.deductiontype),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            });

            await fetchPayrunControl();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendEditRequestNear = async () => {
        let branchnamesto = selectedBranchToEdit.map((item) => item.value);
        let unitnamesto = selectedUnitToEdit.map((item) => item.value);
        let teamnamesto = selectedTeamToEdit.map((item) => item.value);
        let departments = selectedDepartmentToEdit.map((item) => item.value);
        let employeenamesto = selectedEmployeeToEdit?.length > 0 ? selectedEmployeeToEdit?.map((item) => item.value) : ["ALL"];

        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PAYRUNCONTROL_SINGLE}/${projectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(payruncontroledit.company),
                empstatus: String(payruncontroledit.empstatus),
                department: departments,
                branch: branchnamesto,
                unit: unitnamesto,
                team: teamnamesto,
                empname: employeenamesto,
                filtertype: payruncontroledit.filtertype,
                choosestatus: payruncontroledit.choosestatus,
                choosetype: chooseProdOrGrossEdit,
                achievedsymbol: String(payruncontroledit.achievedsymbol),
                achieved: String(payruncontroledit.achieved),
                achievedfrom: String(payruncontroledit.achievedfrom),
                achievedto: String(payruncontroledit.achievedto),
                newgrosssymbol: String(payruncontroledit.newgrosssymbol),
                newgross: String(payruncontroledit.newgross),
                newgrossfrom: String(payruncontroledit.newgrossfrom),
                newgrossto: String(payruncontroledit.newgrossto),
                salraytype: String(payruncontroledit.salraytype),
                deductiontype: String(payruncontroledit.deductiontype),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchPayrunControl(); fetchProjMasterAll();
            handleCloseModEditNear();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };




    const editSubmit = (e) => {
        e.preventDefault();
        fetchProjMasterAll();
        const empNames = selectedEmployeeToEdit?.length > 0 ? selectedEmployeeToEdit : [{ label: "ALL", value: "ALL" }]

        const isNameMatch = allProjectedit?.some((item) =>
            item.company === payruncontroledit.company &&
            item.empstatus === payruncontroledit.empstatus &&
            item.filtertype === payruncontroledit.filtertype &&
            (selectedDepartmentToEdit.length > 0 ? item.department.some((item) =>
                selectedDepartmentToEdit.map((item) => item.value).includes(item)) : true
            ) &&
            (selectedBranchToEdit.length > 0 ? item.branch.some((item) =>
                selectedBranchToEdit.map((item) => item.value).includes(item)) : true) &&
            (selectedUnitToEdit.length > 0 ? item.unit.some((item) =>
                selectedUnitToEdit.map((item) => item.value).includes(item)) : true) &&
            (selectedTeamToEdit.length > 0 ? item.team.some((item) =>
                selectedTeamToEdit.map((item) => item.value).includes(item)) : true) &&
            (empNames.length > 0 ? item.empname.some((item) => {
                if (item === "ALL") {
                    return true
                } else {
                    return empNames?.map((item) => item.value).includes(item)

                }
            }
            ) : true)
            // &&

            // (
            //     chooseProdOrGrossEdit ?
            //         (chooseProdOrGrossEdit === item.choosetype &&
            //             item.salraytype === payruncontroledit?.salraytype &&
            //             item.deductiontype === payruncontroledit?.deductiontype)

            //         : !chooseProdOrGrossEdit
            //         && (payruncontroledit?.choosestatus === "Both" ?
            //             item.achievedsymbol === payruncontroledit.achievedsymbol &&
            //             item.achieved === payruncontroledit.achieved
            //             && item.newgross === payruncontroledit.newgross
            //             && item.newgrosssymbol === payruncontroledit.newgrosssymbol
            //             :
            //             payruncontroledit?.choosestatus === "Production" ? item.achievedsymbol === payruncontroledit.achievedsymbol &&
            //                 item.achieved === payruncontroledit.achieved :
            //                 item.newgross === payruncontroledit.newgross
            //                 && item.newgrosssymbol === payruncontroledit.newgrosssymbol)
            // )


        );
        console.log(payruncontrol.choosestatus)
        const selectedEmployeesSet = new Set(selectedEmployeeToEdit.map(d => d.value));
        const originalEmployeesSet = new Set(originaledit.empname.map(item => item));

        if (payruncontroledit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontroledit.filtertype === "Please Select Filter Type" || payruncontroledit.filtertype === "" || payruncontroledit.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (payruncontroledit.empstatus === "Please Select Status") {
            setPopupContentMalert("Please Select Employee Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (payruncontroledit.filtertype === "Department" && selectedDepartmentToEdit?.length === 0) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(payruncontroledit.filtertype) && selectedBranchToEdit?.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (["Individual", "Team", "Unit"]?.includes(payruncontroledit.filtertype) && selectedUnitToEdit?.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (selectedTeamToEdit?.length === 0 && ["Individual", "Team"]?.includes(payruncontroledit.filtertype)) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (["Individual"]?.includes(payruncontroledit?.filtertype) && selectedEmployeeToEdit.length === 0) {
            setPopupContentMalert("Please Select Employee Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (payruncontrol.choosestatus === "") {
            setPopupContentMalert("Please Select Choose Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol === "") {
            setPopupContentMalert("Please Select Achieved Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol !== "Between" && payruncontroledit.achieved === "") {
            setPopupContentMalert("Please Enter achieved");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedfrom === "") {
            setPopupContentMalert("Please Enter Production achievedFrom");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedto === "") {
            setPopupContentMalert("Please Enter Production achievedTo");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol === "") {
            setPopupContentMalert("Please Select Newgross Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol !== "Between" && payruncontroledit.newgross === "") {
            setPopupContentMalert("Please Enter Newgross(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossfrom === "") {
            setPopupContentMalert("Please Enter Newgross From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossto === "") {
            setPopupContentMalert("Please Enter Newgross To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol === "") {
            setPopupContentMalert("Please Select Achieved Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol !== "Between" && payruncontroledit.achieved === "") {
            setPopupContentMalert("Please Enter achieved");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedfrom === "") {
            setPopupContentMalert("Please Enter Production achievedFrom");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedto === "") {
            setPopupContentMalert("Please Enter Production achievedTo");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol === "") {
            setPopupContentMalert("Please Select Newgross Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol !== "Between" && payruncontroledit.newgross === "") {
            setPopupContentMalert("Please Enter Newgross(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossfrom === "") {
            setPopupContentMalert("Please Enter Newgross From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossto === "") {
            setPopupContentMalert("Please Enter Newgross To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontroledit.salraytype === "Please Select SalaryType") {
            setPopupContentMalert("Please Select SalaryType");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontroledit.deductiontype === "Please Select DeductionType") {
            setPopupContentMalert("Please  Select DeductionType");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (isNameMatch) {
            setPopupContentMalert("This Data is Already Exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else {
            sendEditRequest();
        }
    };


    const editSubmitNear = (e) => {
        e.preventDefault();
        fetchProjMasterAllIndividual();
        const selectedEmployeesSet = new Set(selectedEmployeeToEdit.map(d => d.value));
        const originalEmployeesSet = new Set(originaledit.empname.map(item => item));
        const empNames = selectedEmployeeToEdit?.length > 0 ? selectedEmployeeToEdit : [{ label: "ALL", value: "ALL" }]

        const isNameMatch = allProjecteditIndidvidual?.some((item) =>
            item.company === payruncontroledit.company &&
            item.empstatus === payruncontroledit.empstatus &&
            item.filtertype === payruncontroledit.filtertype &&
            (selectedDepartmentToEdit.length > 0 ? item.department.some((item) =>
                selectedDepartmentToEdit.map((item) => item.value).includes(item)) : true
            ) &&
            (selectedBranchToEdit.length > 0 ? item.branch.some((item) =>
                selectedBranchToEdit.map((item) => item.value).includes(item)) : true) &&
            (selectedUnitToEdit.length > 0 ? item.unit.some((item) =>
                selectedUnitToEdit.map((item) => item.value).includes(item)) : true) &&
            (selectedTeamToEdit.length > 0 ? item.team.some((item) =>
                selectedTeamToEdit.map((item) => item.value).includes(item)) : true) &&
            (empNames.length > 0 ? item.empname.some((item) => {
                if (item === "ALL") {
                    return true
                } else {
                    return empNames?.map((item) => item.value).includes(item)

                }
            }
                // empNames.map((item) => item.value).includes(item)
            ) : true)

        );

        if (!payruncontroledit.choosestatus || payruncontroledit.choosestatus === "" || payruncontroledit.choosestatus === "Please Select Type") {
            setPopupContentMalert("Please Select Choose Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol === "") {
            setPopupContentMalert("Please Select Achieved Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol !== "Between" && payruncontroledit.achieved === "") {
            setPopupContentMalert("Please Enter achieved");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedfrom === "") {
            setPopupContentMalert("Please Enter Production achievedFrom");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedto === "") {
            setPopupContentMalert("Please Enter Production achievedTo");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol === "") {
            setPopupContentMalert("Please Select Newgross Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol !== "Between" && payruncontroledit.newgross === "") {
            setPopupContentMalert("Please Enter Newgross(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossfrom === "") {
            setPopupContentMalert("Please Enter Newgross From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Both" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossto === "") {
            setPopupContentMalert("Please Enter Newgross To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol === "") {
            setPopupContentMalert("Please Select Achieved Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol !== "Between" && payruncontroledit.achieved === "") {
            setPopupContentMalert("Please Enter achieved");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedfrom === "") {
            setPopupContentMalert("Please Enter Production achievedFrom");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "Production" && payruncontroledit.achievedsymbol === "Between" && payruncontroledit.achievedto === "") {
            setPopupContentMalert("Please Enter Production achievedTo");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol === "") {
            setPopupContentMalert("Please Select Newgross Symbol");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol !== "Between" && payruncontroledit.newgross === "") {
            setPopupContentMalert("Please Enter Newgross(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (!chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossfrom === "") {
            setPopupContentMalert("Please Enter Newgross From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (chooseProdOrGrossEdit && payruncontroledit?.choosestatus === "New Gross" && payruncontroledit.newgrosssymbol === "Between" && payruncontroledit.newgrossto === "") {
            setPopupContentMalert("Please Enter Newgross To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }


        else if (payruncontroledit.salraytype === "Please Select SalaryType") {

            setPopupContentMalert("Please  Select SalaryType");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontroledit.deductiontype === "Please Select DeductionType") {
            setPopupContentMalert("Please Select DeductionType");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (isNameMatch) {
            setPopupContentMalert("This Data is Already Exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else {
            sendEditRequestNear();
        }
    };

    const [uniqueid, setUniqueid] = useState(0)
    const [payrungrp, setpayrungrp] = useState([])

    const fetchPayrunControl = async () => {
        setLoader(true)
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let oldsingle = res_project?.data?.payruncontrol
            console.log(oldsingle);
            const itemsWithSerialNumberNew = oldsingle?.map((item, index) => ({
                ...item,
                _id: item._id,
                serialNumber: index + 1,
                userdepartment: item.empname[0] === "ALL" ? item.department : item.userdepartment,
                userbranch: item.empname[0] === "ALL" ? item.branch : item.userbranch,
                userunit: item.empname[0] === "ALL" ? item.unit : item.userunit,
                userteam: item.empname[0] === "ALL" ? item.team : item.userteam,
                finalachieved: (item.newgrosssymbol && (item.achievedfrom || item?.achievedto || item?.achieved)) ? item.achievedsymbol === "Between" ? `${item.achievedsymbol} - ${item.achievedfrom} to ${item.achievedto}` : `${item.achievedsymbol} - ${item.achieved}` : "",
                finalgross: (item.newgrosssymbol && (item.newgrossfrom || item?.newgrossto || item?.newgross)) ? item.newgrosssymbol === "Between" ? `${item.newgrosssymbol} - ${item.newgrossfrom} to ${item.newgrossto}` : `${item.newgrosssymbol} -${item.newgross}` : "",
            }));
            setpayrungrp(itemsWithSerialNumberNew);

            let single = res_project?.data?.payruncontrol

            const uniqueObjects = [];
            const uniqueKeysMap = new Map();
            single.forEach((obj) => {
                // Create a shallow copy of the object
                const copy = { ...obj };
                const key = `${copy.company}-${copy.empstatus}-${copy.achieved}-${copy.newgross}-${copy.salraytype}-${copy.deductiontype}-${copy.department}-${copy.branch}-${copy.unit}-${copy.team}-${copy.achievedsymbol}`;

                if (!uniqueKeysMap.has(key)) {
                    copy.id = [copy._id];
                    uniqueKeysMap.set(key, copy);
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    existingObj.empname = [...existingObj.empname, ...copy.empname];
                    existingObj.id = existingObj.id.concat(copy._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());
            const itemsWithSerialNumber = uniqueObjects?.map((item, index) => ({
                ...item, serialNumber: index + 1,
                finalachieved: (item.newgrosssymbol && (item.achievedfrom || item?.achievedto || item?.achieved)) ? item.achievedsymbol === "Between" ? `${item.achievedsymbol} - ${item.achievedfrom} to ${item.achievedto}` : `${item.achievedsymbol} - ${item.achieved}` : "",
                finalgross: (item.newgrosssymbol && (item.newgrossfrom || item?.newgrossto || item?.newgross)) ? item.newgrosssymbol === "Between" ? `${item.newgrosssymbol} - ${item.newgrossfrom} to ${item.newgrossto}` : `${item.newgrosssymbol} -${item.newgross}` : "",

            }));
            console.log(itemsWithSerialNumber);
            setPayruncontrolmaster(itemsWithSerialNumber);
            setLoader(false)

            if (res_project?.data?.payruncontrol.length > 0) {
                setUniqueid(res_project?.data?.payruncontrol[res_project?.data?.payruncontrol.length - 1].uniqueid);
            }
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [payrungrpArray, setpayrungrpArray] = useState([])
    const [payruncontrolmasterArray, setPayruncontrolmasterArray] = useState([])

    const fetchPayrunControlArray = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: accessbranch
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchPayrunControlArray();
    }, [isFilterOpen])

    //get all project.
    const fetchProjMasterAll = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let res_project = await axios.get(SERVICE.PAYRUNCONTROL, {
            //     // assignbranch: accessbranch
            // }, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            let oldsingle = res_project?.data?.payruncontrol
            setAllProjectedit(oldsingle?.filter((item) => !idgrpedit?.includes(item._id)));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchProjMasterAllIndividual = async () => {
        setPageName(!pageName);
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let oldsingle = res_project?.data?.payruncontrol
            setAllProjecteditIndividual(oldsingle?.filter((item) => payruncontroledit._id !== item._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Employee Status", field: "empstatus" },
        { title: "Filter Type", field: "filtertype" },
        { title: "Employee Name", field: "empname" },
        { title: "Production Achieved", field: "finalachieved" },
        { title: "New Gross", field: "finalgross" },
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
            items.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

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

        doc.save("Payrun_Control_Group.pdf");
    };


    // pdf.....
    const columnsnear = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Employee Status", field: "empstatus" },
        { title: "Filter Type", field: "filtertype" },
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
    const fileName = "Payrun_Control_Group ";
    const fileNameNear = "Payrun_Control_Individual ";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Payrun_Control_Group ",
        pageStyle: "print",
    });

    //print...
    const componentRefNear = useRef();
    const handleprintNear = useReactToPrint({
        content: () => componentRefNear.current,
        documentTitle: "Payrun_Control_Individual ",
        pageStyle: "print",
    });



    //serial no for listing items
    const addSerialNumber = (datas) => {

        setItems(datas);
        setOverallItems(datas);
    };

    useEffect(() => {
        addSerialNumber(payruncontrolmaster);
    }, [payruncontrolmaster]);



    //serial no for listing items
    const addSerialNumberNearTat = (datas) => {

        setItemsNearTat(datas);
        setOverallItemsNeartat(datas);
    };


    useEffect(() => {
        addSerialNumberNearTat(payrungrp);
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
        fetchPayrunControl();
    }, []);

    useEffect(() => {
        fetchProjMasterAll();
    }, [isEditOpen, idgrpedit]);
    useEffect(() => {
        fetchProjMasterAllIndividual();
    }, [isEditOpenNear, payruncontroledit]);


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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },


        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: 'left',
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
            field: "filtertype",
            headerName: "Filter Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.filtertype,
            headerClassName: "bold-header",
        },
        {
            field: "empstatus",
            headerName: "Employee Status",
            flex: 0,
            width: 200,
            hide: !columnVisibilityNeartat.empstatus,
            headerClassName: "bold-header",
        },
        {
            field: "empname",
            headerName: "Employee Name",
            flex: 0,
            width: 300,
            hide: !columnVisibility.empname,
            headerClassName: "bold-header",
        },
        {
            field: "achievedsymbol",
            headerName: "Achieved Type",
            flex: 0,
            width: 200,
            hide: !columnVisibility.achievedsymbol,
            headerClassName: "bold-header",
        },
        {
            field: "achieved",
            headerName: "Achieved Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.achieved,
            headerClassName: "bold-header",
        },
        {
            field: "newgrosssymbol",
            headerName: "Newgross Type",
            flex: 0,
            width: 200,
            hide: !columnVisibility.newgrosssymbol,
            headerClassName: "bold-header",
        },
        {
            field: "newgross",
            headerName: "Newgross Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.newgross,
            headerClassName: "bold-header",
        },
        {
            field: "finalachieved",
            headerName: "Production Achieved",
            flex: 0,
            width: 200,
            hide: !columnVisibility.finalachieved,
            headerClassName: "bold-header",
        },
        {
            field: "finalgross",
            headerName: "New Gross",
            flex: 0,
            width: 200,
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
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("epayruncontrol") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id, params.data.idgrp, params.data.empnames);


                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}

                    {isUserRoleCompare?.includes("dpayruncontrol") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.idgrp);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpayruncontrol") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id, params.data.empnames);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                </Grid>
            ),
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
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
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
            pinned: 'left',
        },


        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.company,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "empstatus",
            headerName: "Employee Status",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.empstatus,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "filtertype",
            headerName: "Filter Type",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.filtertype,
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
            width: 300,
            hide: !columnVisibilityNeartat.empname,
            headerClassName: "bold-header",
        },
        {
            field: "achievedsymbol",
            headerName: "Achieved Type",
            flex: 0,
            width: 200,
            hide: !columnVisibility.achievedsymbol,
            headerClassName: "bold-header",
        },
        {
            field: "achieved",
            headerName: "Achieved Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.achieved,
            headerClassName: "bold-header",
        },
        {
            field: "newgrosssymbol",
            headerName: "Newgross Type",
            flex: 0,
            width: 200,
            hide: !columnVisibility.newgrosssymbol,
            headerClassName: "bold-header",
        },
        {
            field: "newgross",
            headerName: "Newgross Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.newgross,
            headerClassName: "bold-header",
        },
        {
            field: "finalachieved",
            headerName: "Production Achieved",
            flex: 0,
            width: 200,
            hide: !columnVisibilityNeartat.finalachieved,
            headerClassName: "bold-header",
        },
        {
            field: "finalgross",
            headerName: "New Gross",
            flex: 0,
            width: 200,
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


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityNeartat.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("epayruncontrol") && params?.data?.empname !== "ALL" && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCodeNear(params.data.id, params.data.idgrp, params.data.name);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}

                    {isUserRoleCompare?.includes("dpayruncontrol") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataNear(params.data.id, params.data.idgrp);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpayruncontrol") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeNear(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}

                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            idgrp: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            empstatus: item.empstatus,
            filtertype: item.filtertype,
            empname: item.empname.join(","),
            empnames: item.empname,
            // achieved: item.achievedsymbol + " " + item.achieved,
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
            filtertype: item.filtertype,
            // achieved: item.achievedsymbol + " " + item.achieved,
            achievedsymbol: item.achievedsymbol,
            // newgross: item.newgrosssymbol + " " + item.newgross,
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
                    "Filter Type": t.filtertype,
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
                    "Filter Type": t.filtertype,
                    "Employeename": t.empname
                        ?.map((t, i) => `${i + 1 + "."}` + t)
                        .join(",")
                        .toString(),
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
                    "Filter Type": t.filtertype,
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
                fileNameNear,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                itemsneartat.map((t, index) => ({
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Filter Type": t.filtertype,
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
                fileNameNear,
            );

        }

        setIsFilterOpen2(false)
    };

    return (
        <Box>
            <Headtitle title={"PAYRUN CONTROL"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Pay Run Control Settings"
                modulename="PayRoll"
                submodulename="PayRoll Setup"
                mainpagename="Pay Run Control"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("apayruncontrol") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Pay Run Control Settings</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.company,
                                                value: payruncontrol.company,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({
                                                    ...payruncontrol,
                                                    company: e.value,
                                                    filtertype: "Please Select Filter Type"
                                                });
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
                                                fetchEmployeeNamesBasedTeam(payruncontrol.company,
                                                    e.value,
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
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        payruncontrol.company === comp.company
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
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        payruncontrol.company === comp.company && selectedBranchTo
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
                                                            options={accessbranch?.filter(
                                                                (comp) =>
                                                                    payruncontrol.company === comp.company
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
                                                                options={accessbranch?.filter(
                                                                    (comp) =>
                                                                        payruncontrol.company === comp.company
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
                                                                options={accessbranch?.filter(
                                                                    (comp) =>
                                                                        payruncontrol.company === comp.company && selectedBranchTo
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

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                    checked={chooseProdOrGross}
                                                    onChange={() => {
                                                        setChooseProdOrGross((val) => !val);
                                                        setPayruncontrol({
                                                            ...payruncontrol,
                                                            choosestatus: "Both",
                                                            achievedsymbol: "",
                                                            achievedfrom: "",
                                                            achievedto: "",
                                                            achieved: "",
                                                            newgrosssymbol: "",
                                                            newgrossfrom: "",
                                                            newgrossto: "",
                                                            newgross: "",

                                                        });
                                                    }}
                                                    color="primary"
                                                />
                                            }
                                            // sx={{marginTop: 1}}
                                            label="Choose Any"
                                        />
                                    </FormControl>
                                </Grid>
                                {!chooseProdOrGross &&
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Choose Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={[{ label: "Both", value: "Both" }
                                                    , { label: "Production", value: "Production" }
                                                    , { label: "New Gross", value: "New Gross" }
                                                ]}
                                                styles={colourStyles}
                                                value={{
                                                    label: payruncontrol.choosestatus,
                                                    value: payruncontrol.choosestatus,
                                                }}
                                                onChange={(e) => {
                                                    setPayruncontrol({
                                                        ...payruncontrol, choosestatus: e.value,
                                                        achievedsymbol: "",
                                                        achievedfrom: "",
                                                        achievedto: "",
                                                        achieved: "",
                                                        newgrosssymbol: "",
                                                        newgrossfrom: "",
                                                        newgrossto: "",
                                                        newgross: "",

                                                    });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>}
                                {!chooseProdOrGross &&
                                    <>
                                        {payruncontrol?.choosestatus === "Production" &&
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container>
                                                    <Typography>
                                                        Production Achieved {payruncontrol.achievedsymbol === "Between" ? "from to" : ""} <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={payruncontrol.achievedsymbol}
                                                            onChange={(e) => {
                                                                setPayruncontrol({
                                                                    ...payruncontrol,
                                                                    achievedsymbol: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                {" "}
                                                                Please Select
                                                            </MenuItem>
                                                            <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                            <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                            <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                            <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                            <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                            <MenuItem value="Between"> {"Between"} </MenuItem>



                                                        </Select>
                                                        {payruncontrol.achievedsymbol === "Between" ?
                                                            <>
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontrol.achievedfrom}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontrol({ ...payruncontrol, achievedfrom: e.target.value });

                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>

                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontrol.achievedto}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontrol({ ...payruncontrol, achievedto: e.target.value });
                                                                        }
                                                                    }}
                                                                />

                                                            </>
                                                            :
                                                            <OutlinedInput id="component-outlined"
                                                                type="text"
                                                                value={payruncontrol.achieved}
                                                                onChange={(e) => {
                                                                    const regex = /^[0-9]+$/;
                                                                    if (regex.test(e.target.value)) {
                                                                        setPayruncontrol({ ...payruncontrol, achieved: e.target.value });
                                                                    }
                                                                }}
                                                            />

                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>}
                                        {payruncontrol?.choosestatus === "New Gross" &&
                                            <Grid item md={4} xs={12} sm={12}>

                                                <Grid container>
                                                    <Typography>
                                                        New Gross(Month) {payruncontrol.newgrosssymbol === "Between" ? "from to" : ""}<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={payruncontrol.newgrosssymbol}
                                                            onChange={(e) => {
                                                                setPayruncontrol({
                                                                    ...payruncontrol,
                                                                    newgrosssymbol: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled> Please Select  </MenuItem>
                                                            <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                            <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                            <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                            <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                            <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                            <MenuItem value="Between"> {"Between"} </MenuItem>



                                                        </Select>
                                                        {payruncontrol.newgrosssymbol === "Between" ?
                                                            <>
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontrol.newgrossfrom}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontrol({ ...payruncontrol, newgrossfrom: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontrol.newgrossto}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontrol({ ...payruncontrol, newgrossto: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                            :
                                                            <OutlinedInput id="component-outlined"
                                                                type="text"
                                                                value={payruncontrol.newgross}
                                                                onChange={(e) => {
                                                                    const regex = /^[0-9]+$/;
                                                                    if (regex.test(e.target.value)) {
                                                                        setPayruncontrol({ ...payruncontrol, newgross: e.target.value });
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                    </Grid>

                                                </Grid>
                                            </Grid>}
                                        {payruncontrol?.choosestatus === "Both" &&
                                            <>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <Grid container>
                                                        <Typography>
                                                            Production Achieved {payruncontrol.achievedsymbol === "Between" ? "from to" : ""} <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payruncontrol.achievedsymbol}
                                                                onChange={(e) => {
                                                                    setPayruncontrol({
                                                                        ...payruncontrol,
                                                                        achievedsymbol: e.target.value,
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled>
                                                                    {" "}
                                                                    Please Select
                                                                </MenuItem>
                                                                <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                                <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                                <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                                <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                                <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                                <MenuItem value="Between"> {"Between"} </MenuItem>



                                                            </Select>
                                                            {payruncontrol.achievedsymbol === "Between" ?
                                                                <>
                                                                    <FormControl
                                                                        fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontrol.achievedfrom}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontrol({ ...payruncontrol, achievedfrom: e.target.value });

                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>

                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontrol.achievedto}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontrol({ ...payruncontrol, achievedto: e.target.value });
                                                                            }
                                                                        }}
                                                                    />

                                                                </>
                                                                :
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontrol.achieved}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontrol({ ...payruncontrol, achieved: e.target.value });
                                                                        }
                                                                    }}
                                                                />

                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={12}>

                                                    <Grid container>
                                                        <Typography>
                                                            New Gross(Month) {payruncontrol.newgrosssymbol === "Between" ? "from to" : ""}<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payruncontrol.newgrosssymbol}
                                                                onChange={(e) => {
                                                                    setPayruncontrol({
                                                                        ...payruncontrol,
                                                                        newgrosssymbol: e.target.value,
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled> Please Select  </MenuItem>
                                                                <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                                <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                                <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                                <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                                <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                                <MenuItem value="Between"> {"Between"} </MenuItem>



                                                            </Select>
                                                            {payruncontrol.newgrosssymbol === "Between" ?
                                                                <>
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontrol.newgrossfrom}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontrol({ ...payruncontrol, newgrossfrom: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontrol.newgrossto}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontrol({ ...payruncontrol, newgrossto: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </>
                                                                :
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontrol.newgross}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontrol({ ...payruncontrol, newgross: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    </>
                                }
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Salary Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={salary}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.salraytype,
                                                value: payruncontrol.salraytype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({ ...payruncontrol, salraytype: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Deduction Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={deduction}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.deductiontype,
                                                value: payruncontrol.deductiontype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({ ...payruncontrol, deductiontype: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: 'flex', gap: '20px' }}>

                                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isBtn} sx={buttonStyles.buttonsubmit}>
                                            Submit
                                        </Button>

                                        <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                            Clear
                                        </Button>

                                    </div>
                                </Grid>
                            </Grid>



                        </>
                    </Box>
                </>
            )}
            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: "scroll",
                        "& .MuiPaper-root": {
                            overflow: "scroll",
                        },
                    }}
                >

                    <Box sx={{ padding: "20px" }}>
                        <>
                            <Grid container>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>Edit Group PayRun Control</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontroledit.company,
                                                value: payruncontroledit.company,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({
                                                    ...payruncontroledit,
                                                    company: e.value,
                                                });
                                                setSelectedBranchToEdit([]);
                                                setSelectedUnitToEdit([]);
                                                setSelectedTeamToEdit([]);
                                                setSelectedDepartmentToEdit([]);
                                                setSelectedEmployeeToEdit([]);
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
                                            options={[
                                                { label: "Individual", value: "Individual" },
                                                { label: "Department", value: "Department" },
                                                { label: "Branch", value: "Branch" },
                                                { label: "Unit", value: "Unit" },
                                                { label: "Team", value: "Team" },
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontroledit.filtertype,
                                                value: payruncontroledit.filtertype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({
                                                    ...payruncontroledit,
                                                    filtertype: e.value
                                                });
                                                setSelectedBranchToEdit([]);
                                                setSelectedEmployeeToEdit([]);
                                                setSelectedDepartmentToEdit([]);
                                                setSelectedUnitToEdit([]);
                                                setSelectedTeamToEdit([]);
                                                setEmployeeNamesDropdownEdit([])
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
                                                label: payruncontroledit.empstatus,
                                                value: payruncontroledit.empstatus,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({
                                                    ...payruncontroledit,
                                                    empstatus: e.value
                                                });
                                                fetchEmployeeNamesBasedTeamEdit(payruncontroledit.company,
                                                    e.value, selectedDepartmentToEdit, selectedBranchToEdit,
                                                    selectedUnitToEdit, selectedTeamToEdit, 'empstatus')
                                                setSelectedDepartmentToEdit([]);
                                                setSelectedUnitToEdit([]);
                                                setSelectedTeamToEdit([]);
                                                setSelectedEmployeeToEdit([]);
                                                setSelectedBranchToEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>


                                {
                                    ["Individual", "Team"]?.includes(payruncontroledit.filtertype) ? <>
                                        {/* Company Branch Unit */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            payruncontroledit.company === comp.company
                                                    )?.map(data => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedBranchToEdit}
                                                    onChange={handleBranchChangeToEdit}
                                                    valueRenderer={customValueRendererBranchToEdit}
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
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            payruncontroledit.company === comp.company && selectedBranchToEdit
                                                                .map((item) => item.value)
                                                                .includes(comp.branch))?.map(data => ({
                                                                    label: data.unit,
                                                                    value: data.unit,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                    value={selectedUnitToEdit}
                                                    onChange={handleUnitChangeToEdit}
                                                    valueRenderer={customValueRendererUnitToEdit}
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
                                                                        selectedBranchToEdit
                                                                            .map((item) => item.value)
                                                                            .includes(comp.branch) &&
                                                                        selectedUnitToEdit
                                                                            .map((item) => item.value)
                                                                            .includes(comp.unit)
                                                                )
                                                                ?.map((com) => com.teamname)
                                                        )
                                                    ).map((teamname) => ({
                                                        label: teamname,
                                                        value: teamname,
                                                    }))}
                                                    value={selectedTeamToEdit}
                                                    onChange={handleTeamChangeToEdit}
                                                    valueRenderer={customValueRendererTeamToEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </> :
                                        ["Department"]?.includes(payruncontroledit.filtertype) ?
                                            <>
                                                {/* Department */}
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Department
                                                        </Typography>
                                                        <MultiSelect
                                                            options={departmentOpt}
                                                            value={selectedDepartmentToEdit}
                                                            onChange={handleDepartmentChangeToEdit}
                                                            valueRenderer={customValueRendererDepartmentToEdit}
                                                            labelledBy="Please Select Department"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            :
                                            ["Branch"]?.includes(payruncontroledit.filtertype) ?
                                                <>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Branch
                                                            </Typography>
                                                            <MultiSelect
                                                                options={accessbranch?.filter(
                                                                    (comp) =>
                                                                        payruncontroledit.company === comp.company
                                                                )?.map(data => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                                value={selectedBranchToEdit}
                                                                onChange={handleBranchChangeToEdit}
                                                                valueRenderer={customValueRendererBranchToEdit}
                                                                labelledBy="Please Select Branch"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                                :
                                                ["Unit"]?.includes(payruncontroledit.filtertype) ?
                                                    <>
                                                        <Grid item md={3} xs={12} sm={12}>
                                                            <FormControl fullWidth size="small">
                                                                <Typography>
                                                                    Branch
                                                                </Typography>
                                                                <MultiSelect
                                                                    options={accessbranch?.filter(
                                                                        (comp) =>
                                                                            payruncontroledit.company === comp.company
                                                                    )?.map(data => ({
                                                                        label: data.branch,
                                                                        value: data.branch,
                                                                    })).filter((item, index, self) => {
                                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                    })}
                                                                    value={selectedBranchToEdit}
                                                                    onChange={handleBranchChangeToEdit}
                                                                    valueRenderer={customValueRendererBranchToEdit}
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
                                                                    options={accessbranch?.filter(
                                                                        (comp) =>
                                                                            payruncontroledit.company === comp.company && selectedBranchToEdit
                                                                                .map((item) => item.value)
                                                                                .includes(comp.branch))?.map(data => ({
                                                                                    label: data.unit,
                                                                                    value: data.unit,
                                                                                })).filter((item, index, self) => {
                                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                                })}
                                                                    value={selectedUnitToEdit}
                                                                    onChange={handleUnitChangeToEdit}
                                                                    valueRenderer={customValueRendererUnitToEdit}
                                                                    labelledBy="Please Select Branch"
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                    : ""
                                }
                                {["Individual"]?.includes(payruncontroledit.filtertype) &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={employeenamesDropdownEdit?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                }))}
                                                value={selectedEmployeeToEdit}
                                                style={{
                                                    menu: (provided, state) => ({
                                                        ...provided,
                                                        position: "absolute",
                                                        top: "100%", // Set the desired top position
                                                        left: "0", // Set the desired left position
                                                        zIndex: 1000, // Set the desired zIndex
                                                    }),
                                                    menuList: (provided, state) => ({
                                                        ...provided,
                                                        maxHeight: "200px", // Set the desired max height here
                                                        overflowY: "auto", // Add scroll if the content exceeds max height
                                                    }),
                                                }}
                                                onChange={handleEmployeeChangeToEdit}
                                                valueRenderer={customValueRendererEmployeeToEdit}
                                                labelledBy="Please Select Employeename"
                                            // className="scrollable-multiselect"
                                            />
                                        </FormControl>
                                    </Grid>}
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        {/* <Typography variant="h6">QR Code</Typography> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                    checked={chooseProdOrGrossEdit}
                                                    onChange={() => {
                                                        setChooseProdOrGrossEdit((val) => !val);
                                                        setPayruncontroledit({
                                                            ...payruncontroledit,
                                                            choosestatus: "Please Select Type",
                                                            achievedsymbol: "",
                                                            achievedfrom: "",
                                                            achievedto: "",
                                                            achieved: "",
                                                            newgrosssymbol: "",
                                                            newgrossfrom: "",
                                                            newgrossto: "",
                                                            newgross: "",

                                                        });
                                                    }}
                                                    color="primary"
                                                />
                                            }
                                            // sx={{marginTop: 1}}
                                            label="Choose Any"
                                        />
                                    </FormControl>
                                </Grid>
                                {!chooseProdOrGrossEdit &&
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Choose Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={[{ label: "Both", value: "Both" }
                                                    , { label: "Production", value: "Production" }
                                                    , { label: "New Gross", value: "New Gross" }
                                                ]}
                                                styles={colourStyles}
                                                value={{
                                                    label: payruncontroledit.choosestatus,
                                                    value: payruncontroledit.choosestatus,
                                                }}
                                                onChange={(e) => {
                                                    setPayruncontroledit({
                                                        ...payruncontroledit, choosestatus: e.value,
                                                        achievedsymbol: "",
                                                        achievedfrom: "",
                                                        achievedto: "",
                                                        achieved: "",
                                                        newgrosssymbol: "",
                                                        newgrossfrom: "",
                                                        newgrossto: "",
                                                        newgross: "",

                                                    });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>}
                                {
                                    !chooseProdOrGrossEdit &&
                                    <>
                                        {payruncontroledit?.choosestatus === "Production" &&
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container>
                                                    <Typography>
                                                        Production Achieved {payruncontroledit.achievedsymbol === "Between" ? "from to" : ""} <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={payruncontroledit.achievedsymbol}
                                                            onChange={(e) => {
                                                                setPayruncontroledit({
                                                                    ...payruncontroledit,
                                                                    achievedsymbol: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                {" "}
                                                                Please Select
                                                            </MenuItem>
                                                            <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                            <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                            <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                            <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                            <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                            <MenuItem value="Between"> {"Between"} </MenuItem>



                                                        </Select>
                                                        {payruncontroledit.achievedsymbol === "Between" ?
                                                            <>
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.achievedfrom}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, achievedfrom: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.achievedto}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, achievedto: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </>
                                                            :
                                                            <FormControl
                                                                fullWidth size="small">
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontroledit.achieved}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontroledit({ ...payruncontroledit, achieved: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>

                                                        }
                                                    </Grid>

                                                </Grid>
                                            </Grid>}
                                        {payruncontroledit?.choosestatus === "New Gross" &&
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container>
                                                    <Typography>
                                                        New Gross(Month) {payruncontroledit.newgrosssymbol === "Between" ? "from to" : ""}<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={payruncontroledit.newgrosssymbol}
                                                            onChange={(e) => {
                                                                setPayruncontroledit({
                                                                    ...payruncontroledit,
                                                                    newgrosssymbol: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled> Please Select  </MenuItem>
                                                            <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                            <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                            <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                            <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                            <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                            <MenuItem value="Between"> {"Between"} </MenuItem>
                                                        </Select>
                                                        {payruncontroledit.newgrosssymbol === "Between" ?
                                                            <>
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.newgrossfrom}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, newgrossfrom: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.newgrossto}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, newgrossto: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </>
                                                            :
                                                            <FormControl
                                                                fullWidth size="small">
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontroledit.newgross}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontroledit({ ...payruncontroledit, newgross: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>}

                                        {payruncontroledit?.choosestatus === "Both" &&
                                            <>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <Grid container>
                                                        <Typography>
                                                            Production Achieved {payruncontroledit.achievedsymbol === "Between" ? "from to" : ""} <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payruncontroledit.achievedsymbol}
                                                                onChange={(e) => {
                                                                    setPayruncontroledit({
                                                                        ...payruncontroledit,
                                                                        achievedsymbol: e.target.value,
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled>
                                                                    {" "}
                                                                    Please Select
                                                                </MenuItem>
                                                                <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                                <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                                <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                                <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                                <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                                <MenuItem value="Between"> {"Between"} </MenuItem>



                                                            </Select>
                                                            {payruncontroledit.achievedsymbol === "Between" ?
                                                                <>
                                                                    <FormControl
                                                                        fullWidth size="small">
                                                                        <OutlinedInput
                                                                            id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.achievedfrom}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, achievedfrom: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormControl
                                                                        fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.achievedto}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, achievedto: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </>
                                                                :
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.achieved}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, achieved: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>

                                                            }
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={12}>

                                                    <Grid container>
                                                        <Typography>
                                                            New Gross(Month) {payruncontroledit.newgrosssymbol === "Between" ? "from to" : ""}<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payruncontroledit.newgrosssymbol}
                                                                onChange={(e) => {
                                                                    setPayruncontroledit({
                                                                        ...payruncontroledit,
                                                                        newgrosssymbol: e.target.value,
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled> Please Select  </MenuItem>
                                                                <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                                <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                                <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                                <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                                <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                                <MenuItem value="Between"> {"Between"} </MenuItem>
                                                            </Select>
                                                            {payruncontroledit.newgrosssymbol === "Between" ?
                                                                <>
                                                                    <FormControl
                                                                        fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.newgrossfrom}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, newgrossfrom: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormControl
                                                                        fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.newgrossto}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, newgrossto: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </>
                                                                :
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.newgross}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, newgross: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    </>
                                }
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Salary Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={salary}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontroledit.salraytype,
                                                value: payruncontroledit.salraytype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({ ...payruncontroledit, salraytype: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Deduction Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={deduction}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontroledit.deductiontype,
                                                value: payruncontroledit.deductiontype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({ ...payruncontroledit, deductiontype: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
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


            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpenNear} onClose={handleCloseModEditNear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                    maxWidth="lg" fullWidth={true}
                    sx={{
                        overflow: "scroll",
                        "& .MuiPaper-root": {
                            overflow: "scroll",
                        },
                        marginTop: '50px'
                    }}

                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Individual PayRun Control</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            isDisabled={true}
                                            value={{
                                                label: payruncontroledit.company,
                                                value: payruncontroledit.company,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined"
                                            type="text"
                                            size="small"
                                            value={payruncontroledit.filtertype}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined"
                                            type="text"
                                            size="small"
                                            value={payruncontroledit.empstatus}
                                        />
                                    </FormControl>
                                </Grid>
                                {
                                    ["Department"]?.includes(payruncontroledit.filtertype) ?
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput id="component-outlined"
                                                    type="text"
                                                    size="small"
                                                    value={payruncontroledit.userdepartment}
                                                />
                                            </FormControl>
                                        </Grid>
                                        :
                                        ["Individual", "Team"]?.includes(payruncontroledit.filtertype) ? <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput id="component-outlined"
                                                        type="text"
                                                        size="small"
                                                        value={payruncontroledit.userbranch}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput id="component-outlined"
                                                        type="text"
                                                        size="small"
                                                        value={payruncontroledit.userunit}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput id="component-outlined"
                                                        type="text"
                                                        size="small"
                                                        value={payruncontroledit.userteam}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                            :
                                            ["Branch"]?.includes(payruncontroledit.filtertype) ?
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Branch<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <OutlinedInput id="component-outlined"
                                                            type="text"
                                                            size="small"
                                                            value={payruncontroledit.userbranch}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                :
                                                ["Unit"]?.includes(payruncontroledit.filtertype) ?
                                                    <>
                                                        <Grid item md={3} xs={12} sm={12}>
                                                            <FormControl fullWidth size="small">
                                                                <Typography>
                                                                    Branch<b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    size="small"
                                                                    value={payruncontroledit.userbranch}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={3} xs={12} sm={12}>
                                                            <FormControl fullWidth size="small">
                                                                <Typography>
                                                                    Unit<b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    size="small"
                                                                    value={payruncontroledit.userunit}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                    : ""


                                }




                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={employeesall
                                                ?.filter(
                                                    (comp) =>
                                                        selectedDepartmentToEdit.length > 0 ?
                                                            payruncontroledit.company === comp.company &&
                                                            selectedDepartmentToEdit
                                                                .map((item) => item.value)
                                                                .includes(comp.department) &&
                                                            (payruncontroledit.empstatus === "Live Employee" ? (comp.resonablestatus != "Releave Employee" || comp.resonablestatus != "Hold" || comp.resonablestatus != "Terminate" || comp.resonablestatus != "Absconded") : payruncontroledit.empstatus == comp.resonablestatus)
                                                            :
                                                            payruncontroledit.company === comp.company &&
                                                            selectedBranchToEdit
                                                                .map((item) => item.value)
                                                                .includes(comp.branch) &&
                                                            selectedUnitToEdit
                                                                .map((item) => item.value)
                                                                .includes(comp.unit) &&
                                                            selectedTeamToEdit
                                                                .map((item) => item.value)
                                                                .includes(comp.team)
                                                            &&
                                                            (payruncontroledit.empstatus === "Live Employee" ? (comp.resonablestatus != "Releave Employee" || comp.resonablestatus != "Hold" || comp.resonablestatus != "Terminate" || comp.resonablestatus != "Absconded") : payruncontroledit.empstatus == comp.resonablestatus)
                                                )
                                                ?.map((com) => ({
                                                    ...com,
                                                    label: com.companyname,
                                                    value: com.companyname,
                                                }))}
                                            value={selectedEmployeeToEdit}
                                            disabled={true}
                                            style={{
                                                menu: (provided, state) => ({
                                                    ...provided,
                                                    position: "absolute",
                                                    top: "100%", // Set the desired top position
                                                    left: "0", // Set the desired left position
                                                    zIndex: 1000, // Set the desired zIndex
                                                }),
                                                menuList: (provided, state) => ({
                                                    ...provided,
                                                    maxHeight: "200px", // Set the desired max height here
                                                    overflowY: "auto", // Add scroll if the content exceeds max height
                                                }),
                                            }}
                                            // onChange={handleEmployeeChangeToEdit}
                                            valueRenderer={customValueRendererEmployeeToEdit}
                                            labelledBy="Please Select Employeename"
                                        // className="scrollable-multiselect"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        {/* <Typography variant="h6">QR Code</Typography> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                    checked={chooseProdOrGrossEdit}
                                                    onChange={() => {
                                                        setChooseProdOrGrossEdit((val) => !val);
                                                        setPayruncontroledit({
                                                            ...payruncontroledit,
                                                            choosestatus: "Please Select Type",
                                                            achievedsymbol: "",
                                                            achievedfrom: "",
                                                            achievedto: "",
                                                            achieved: "",
                                                            newgrosssymbol: "",
                                                            newgrossfrom: "",
                                                            newgrossto: "",
                                                            newgross: "",

                                                        });
                                                    }}
                                                    color="primary"
                                                />
                                            }
                                            // sx={{marginTop: 1}}
                                            label="Choose Any"
                                        />
                                    </FormControl>
                                </Grid>
                                {!chooseProdOrGrossEdit &&
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Choose Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={[{ label: "Both", value: "Both" }
                                                    , { label: "Production", value: "Production" }
                                                    , { label: "New Gross", value: "New Gross" }
                                                ]}
                                                styles={colourStyles}
                                                value={{
                                                    label: payruncontroledit.choosestatus,
                                                    value: payruncontroledit.choosestatus,
                                                }}
                                                onChange={(e) => {
                                                    setPayruncontroledit({
                                                        ...payruncontroledit, choosestatus: e.value,
                                                        achievedsymbol: "",
                                                        achievedfrom: "",
                                                        achievedto: "",
                                                        achieved: "",
                                                        newgrosssymbol: "",
                                                        newgrossfrom: "",
                                                        newgrossto: "",
                                                        newgross: "",

                                                    });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>}
                                {
                                    !chooseProdOrGrossEdit &&
                                    <>
                                        {payruncontroledit?.choosestatus === "Production" &&
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container>
                                                    <Typography>
                                                        Production Achieved {payruncontroledit.achievedsymbol === "Between" ? "from to" : ""} <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                        <Select
                                                            fullWidth
                                                            size="small"

                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={payruncontroledit.achievedsymbol}
                                                            onChange={(e) => {
                                                                setPayruncontroledit({
                                                                    ...payruncontroledit,
                                                                    achievedsymbol: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                {" "}
                                                                Please Select
                                                            </MenuItem>
                                                            <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                            <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                            <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                            <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                            <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                            <MenuItem value="Between"> {"Between"} </MenuItem>



                                                        </Select>
                                                        {payruncontroledit.achievedsymbol === "Between" ?
                                                            <>
                                                                <FormControl
                                                                    fullWidth size="small">
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.achievedfrom}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, achievedfrom: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.achievedto}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, achievedto: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </>
                                                            :
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontroledit.achieved}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontroledit({ ...payruncontroledit, achieved: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>

                                                        }
                                                    </Grid>

                                                </Grid>
                                            </Grid>}
                                        {payruncontroledit?.choosestatus === "New Gross" &&
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container>
                                                    <Typography>
                                                        New Gross(Month) {payruncontroledit.newgrosssymbol === "Between" ? "from to" : ""}<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            value={payruncontroledit.newgrosssymbol}
                                                            onChange={(e) => {
                                                                setPayruncontroledit({
                                                                    ...payruncontroledit,
                                                                    newgrosssymbol: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled> Please Select  </MenuItem>
                                                            <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                            <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                            <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                            <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                            <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                            <MenuItem value="Between"> {"Between"} </MenuItem>
                                                        </Select>
                                                        {payruncontroledit.newgrosssymbol === "Between" ?
                                                            <>
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.newgrossfrom}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, newgrossfrom: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.newgrossto}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, newgrossto: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </>
                                                            :
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput id="component-outlined"
                                                                    type="text"
                                                                    value={payruncontroledit.newgross}
                                                                    onChange={(e) => {
                                                                        const regex = /^[0-9]+$/;
                                                                        if (regex.test(e.target.value)) {
                                                                            setPayruncontroledit({ ...payruncontroledit, newgross: e.target.value });
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>}

                                        {payruncontroledit?.choosestatus === "Both" &&
                                            <>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <Grid container>
                                                        <Typography>
                                                            Production Achieved {payruncontroledit.achievedsymbol === "Between" ? "from to" : ""} <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                            <Select
                                                                fullWidth
                                                                size="small"

                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payruncontroledit.achievedsymbol}
                                                                onChange={(e) => {
                                                                    setPayruncontroledit({
                                                                        ...payruncontroledit,
                                                                        achievedsymbol: e.target.value,
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled>
                                                                    {" "}
                                                                    Please Select
                                                                </MenuItem>
                                                                <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                                <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                                <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                                <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                                <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                                <MenuItem value="Between"> {"Between"} </MenuItem>



                                                            </Select>
                                                            {payruncontroledit.achievedsymbol === "Between" ?
                                                                <>
                                                                    <FormControl
                                                                        fullWidth size="small">
                                                                        <OutlinedInput
                                                                            id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.achievedfrom}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, achievedfrom: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormControl fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.achievedto}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, achievedto: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </>
                                                                :
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.achieved}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, achieved: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            }
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                                <Grid item md={4} xs={12} sm={12}>

                                                    <Grid container>
                                                        <Typography>
                                                            New Gross(Month) {payruncontroledit.newgrosssymbol === "Between" ? "from to" : ""}<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>

                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={payruncontroledit.newgrosssymbol}
                                                                onChange={(e) => {
                                                                    setPayruncontroledit({
                                                                        ...payruncontroledit,
                                                                        newgrosssymbol: e.target.value,
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled> Please Select  </MenuItem>
                                                                <MenuItem value="Less than">  {"Less than"}  </MenuItem>
                                                                <MenuItem value="Less than or equal">  {"Less than or equal"}</MenuItem>
                                                                <MenuItem value="Greater than"> {"Greater than"} </MenuItem>
                                                                <MenuItem value="Greater than or equal">  {"Greater than or equal"}  </MenuItem>
                                                                <MenuItem value="Equal"> {"Equal"} </MenuItem>
                                                                <MenuItem value="Between"> {"Between"} </MenuItem>
                                                            </Select>
                                                            {payruncontroledit.newgrosssymbol === "Between" ?
                                                                <>
                                                                    <FormControl fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.newgrossfrom}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, newgrossfrom: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormControl fullWidth size="small">
                                                                        <OutlinedInput id="component-outlined"
                                                                            type="text"
                                                                            value={payruncontroledit.newgrossto}
                                                                            onChange={(e) => {
                                                                                const regex = /^[0-9]+$/;
                                                                                if (regex.test(e.target.value)) {
                                                                                    setPayruncontroledit({ ...payruncontroledit, newgrossto: e.target.value });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </>
                                                                :
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput id="component-outlined"
                                                                        type="text"
                                                                        value={payruncontroledit.newgross}
                                                                        onChange={(e) => {
                                                                            const regex = /^[0-9]+$/;
                                                                            if (regex.test(e.target.value)) {
                                                                                setPayruncontroledit({ ...payruncontroledit, newgross: e.target.value });
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    </>
                                }




                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Salary Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={salary}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontroledit.salraytype,
                                                value: payruncontroledit.salraytype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({ ...payruncontroledit, salraytype: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Deduction Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={deduction}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontroledit.deductiontype,
                                                value: payruncontroledit.deductiontype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontroledit({ ...payruncontroledit, deductiontype: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmitNear} sx={buttonStyles.buttonsubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEditNear}>
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
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpayruncontrol") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Group PayRun Control List</Typography>
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
                                        <MenuItem value={payruncontrolmaster?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelpayruncontrol") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPayrunControlArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpayruncontrol") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPayrunControlArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpayruncontrol") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpayruncontrol") && (
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
                                    {isUserRoleCompare?.includes("imagepayruncontrol") && (
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
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={payruncontrolmaster} setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}

                                />
                            </Grid>
                        </Grid>

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
                        {loader ?

                            <>

                                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>

                            </>
                            :
                            <>
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
                                    gridRefTable={gridRef}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>
                        }
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

            {isUserRoleCompare?.includes("lpayruncontrol") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Individual PayRun Control List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeNearTatPrimary}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeNearTatPrimary}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={payrungrp?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelpayruncontrol") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen2(true)
                                                fetchPayrunControlArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpayruncontrol") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen2(true)
                                                fetchPayrunControlArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpayruncontrol") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpayruncontrol") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen2(true)
                                                    fetchPayrunControlArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepayruncontrol") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImagenear}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar columnDataTable={columnDataTableNeartat} setItems={setItemsNearTat} addSerialNumber={addSerialNumberNearTat} setPage={setPageNearTatPrimary} maindatas={payrungrp} setSearchedString={setSearchedStringNear}
                                    searchQuery={searchQueryManageNeartat}
                                    setSearchQuery={setSearchQueryManageNeartat}
                                    paginated={false}
                                    totalDatas={overallItemsNeartat}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsNeartat}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNeartat}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {isUserRoleCompare?.includes("bdpayruncontrol") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {loader ?
                            <>

                                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>

                            </>
                            :
                            <>
                                <AggridTable
                                    rowDataTable={rowDataTableNearTat}
                                    columnDataTable={columnDataTableNeartat}
                                    columnVisibility={columnVisibilityNeartat}
                                    page={pageNearTatPrimary}
                                    setPage={setPageNearTatPrimary}
                                    pageSize={pageSizeNearTatPrimary}
                                    totalPages={totalPagesNearTatPrimary}
                                    setColumnVisibility={setColumnVisibilityNeartat}
                                    isHandleChange={isHandleChangeNear}
                                    items={itemsneartat}
                                    selectedRows={selectedRowsNear}
                                    setSelectedRows={setSelectedRowsNear}
                                    gridRefTable={gridRefNeartat}
                                    paginated={false}
                                    filteredDatas={filteredDatasNearTatPrimary}
                                    handleShowAllColumns={handleShowAllColumnsNeartat}

                                    setFilteredRowData={setFilteredRowDataNeartat}
                                    filteredRowData={filteredRowDataNeartat}
                                    setFilteredChanges={setFilteredChangesNeartat}
                                    filteredChanges={filteredChangesNeartat}
                                    gridRefTableImg={gridRefTableImgnear}
                                    itemsList={overallItemsNeartat}
                                />
                            </>
                        }
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}

            < Popover
                id={idneartat}
                open={isManageColumnsOpenNeartat}
                anchorEl={anchorElNeartat}
                onClose={handleCloseManageColumnsNeartat}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }
                }
            >
                {manageColumnsContentNeartat}
            </Popover >
            <br />

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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isDeleteOpenNear} onClose={handleCloseModNear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModNear}
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delProjectNear(projectnearid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* print layout Group*/}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Employee Status</TableCell>
                                <TableCell>Filter Type</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Production Achieved</TableCell>
                                <TableCell>New Gross</TableCell>
                                <TableCell>Salary Type</TableCell>
                                <TableCell>Deduction Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {filteredData &&
                                filteredData?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.empstatus}</TableCell>
                                        <TableCell>{row.filtertype}</TableCell>
                                        <TableCell>{(row.empname.join(","))}</TableCell>
                                        <TableCell>{row.finalachieved}</TableCell>
                                        <TableCell>{row.finalgross}</TableCell>
                                        <TableCell>{row.salraytype}</TableCell>
                                        <TableCell>{row.deductiontype}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefNear}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Employee Status</TableCell>
                                <TableCell>Filter Type</TableCell>
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
                            {rowDataTableNearTat &&
                                rowDataTableNearTat.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.empstatus}</TableCell>
                                        <TableCell>{row.filtertype}</TableCell>
                                        <TableCell>{row.userdepartment?.join(",")}</TableCell>
                                        <TableCell>{row.userbranch?.join(",")}</TableCell>
                                        <TableCell>{row.userunit?.join(",")}</TableCell>
                                        <TableCell>{row.userteam?.join(",")}</TableCell>
                                        <TableCell>{row.empname}</TableCell>
                                        <TableCell>{row.achievedsymbol + " " + row.finalachieved}</TableCell>
                                        <TableCell>{row.newgrosssymbol + " " + row.finalgross}</TableCell>
                                        <TableCell>{row.salraytype}</TableCell>
                                        <TableCell>{row.deductiontype}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* view model group*/}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                maxWidth="md" fullWidth={true} sx={{ marginTop: '50px' }}
            >
                <Box sx={{ padding: "10px 30px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Group Payrun Control</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{payruncontroledit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Filter Type</Typography>
                                    <Typography>{payruncontroledit.filtertype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Status</Typography>
                                    <Typography>{payruncontroledit.empstatus}</Typography>
                                </FormControl>
                            </Grid>
                            {payruncontroledit.department?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Department</Typography>

                                    {payruncontroledit.department && payruncontroledit.department.join(', ')}
                                </FormControl>
                            </Grid>}
                            {payruncontroledit.branch?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    {payruncontroledit.branch && payruncontroledit.branch.join(', ')}
                                </FormControl>
                            </Grid>}
                            {payruncontroledit.unit?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    {payruncontroledit.unit && payruncontroledit.unit.join(', ')}
                                </FormControl>
                            </Grid>}
                            {payruncontroledit.team?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <Box>
                                    <Typography variant="h6"> Team</Typography>
                                    {payruncontroledit.team && payruncontroledit.team.join(', ')}
                                </Box>
                            </Grid>}
                            <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    {/* <Typography variant="h6">QR Code</Typography> */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                checked={payruncontroledit?.choosetype}
                                                color="primary"
                                            />
                                        }
                                        // sx={{marginTop: 1}}
                                        label="Choose Any"
                                    />
                                </FormControl>
                            </Grid>
                            {payruncontroledit?.choosetype === false &&
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Production Achieved </Typography>
                                            <Typography>{payruncontroledit.achievedsymbol + " " + payruncontroledit.finalachieved}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">New Gross</Typography>
                                            <Typography>{payruncontroledit.newgrosssymbol + " " + payruncontroledit.finalgross}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>}
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Salary Type</Typography>
                                    <Typography>{payruncontroledit.salraytype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Deduction Type</Typography>
                                    <Typography>{payruncontroledit.deductiontype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Name</Typography>
                                    {/* {viewpay?.map((t, i) => t.label.join(","))
                                    } */}
                                    {viewpay?.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {item.label}
                                            {index < viewpay.length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container >
                            <Grid item md={12} xs={12} lg={12} sm={12} sx={{ display: "flex", justifyContent: "end" }}>
                                <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <Dialog open={openviewnear} onClose={handleClickOpenviewnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                maxWidth="md" fullWidth={true} sx={{ marginTop: '50px' }}
            >
                <Box sx={{ padding: "10px 30px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Individual Payrun Control</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{viewpaynear.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Filter Type</Typography>
                                    <Typography>{viewpaynear.filtertype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Status</Typography>
                                    <Typography>{viewpaynear.empstatus}</Typography>
                                </FormControl>
                            </Grid>
                            {viewpaynear?.department?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Department</Typography>

                                    {viewpaynear?.department && viewpaynear?.department.join(', ')}
                                </FormControl>
                            </Grid>}
                            {viewpaynear?.branch?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    {viewpaynear?.branch && viewpaynear?.branch.join(', ')}
                                </FormControl>
                            </Grid>}
                            {viewpaynear?.unit?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    {viewpaynear?.unit && viewpaynear?.unit.join(', ')}
                                </FormControl>
                            </Grid>}
                            {viewpaynear?.team?.length > 0 && <Grid item md={4} xs={12} sm={6}>
                                <Box>
                                    <Typography variant="h6"> Team</Typography>
                                    {viewpaynear?.team && viewpaynear?.team.join(', ')}
                                </Box>
                            </Grid>}
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Name</Typography>
                                    <Typography>{viewpaynear.empname
                                    }</Typography>
                                </FormControl>
                            </Grid>
                            {viewpaynear?.choosetype === false &&
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Production Achieved </Typography>
                                            <Typography>{viewpaynear?.finalachieved}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">New Gross</Typography>
                                            <Typography>{viewpaynear?.finalgross}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>}
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Salary Type</Typography>
                                    <Typography>{viewpaynear?.salraytype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Deduction Type</Typography>
                                    <Typography>{viewpaynear?.deductiontype}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container >
                            <Grid item md={12} xs={12} lg={12} sm={12} sx={{ display: "flex", justifyContent: "end" }}>
                                <Button variant="contained" color="primary" onClick={handleCloseviewnear} sx={buttonStyles.btncancel}>
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
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
                itemsTwo={payruncontrolmaster ?? []}
                filename={"Pay Run Control"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpen2}
                handleCloseFilterMod={handleCloseFilterMod2}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen2}
                isPdfFilterOpen={isPdfFilterOpen2}
                setIsPdfFilterOpen={setIsPdfFilterOpen2}
                handleClosePdfFilterMod={handleClosePdfFilterMod2}
                filteredDataTwo={(filteredChangesNeartat !== null ? filteredRowDataNeartat : rowDataTableNearTat) ?? []}
                itemsTwo={payrungrp ?? []}
                filename={"Pay Run Control"}
                exportColumnNames={exportColumnNamesNearTat}
                exportRowValues={exportRowValuesNearTat}
                componentRef={componentRefNear}
            />
        </Box>
    );
}

export default Paycontrol;