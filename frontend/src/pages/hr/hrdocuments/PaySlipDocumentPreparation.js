import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, RadioGroup, InputAdornment, Radio, Tooltip, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import FormControlLabel from '@mui/material/FormControlLabel';
import "jspdf-autotable";
import Snackbar from '@mui/material/Snackbar';
import axios from "axios";
import Selects from "react-select";
import Docxtemplater from 'docxtemplater';
import Payslip from './paysliplayoutone'
import Paysliptemplatetwo from "./paysliplayouttwo";
import payslipthree from "./paysliplayoutthree";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { htmlToText } from "html-to-text";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
// import QRCodeGenerator from './QRCodeComponent';y
import QRCode from 'qrcode';
import LoadingButton from "@mui/lab/LoadingButton";
import { BASE_URL } from "../../../services/Authservice";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Backdrop from '@mui/material/Backdrop';
import { MultiSelect } from "react-multi-select-component";
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';

const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};

function PaySlipDocumentPreparation() {
    const [emailVisibleCount, setEmailVisibleCount] = useState(10);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
    const [emailLoadMoreDisabled, setEmailLoadMoreDisabled] = useState(false);


    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
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

    let exportColumnNames = [
        'Date ',
        'Template',
        'PaySlip Month',
        'PaySlip Year',
        'Filter Type',
        'Employee Status',
        'Department',
        'Company',
        'Branch',
        'Unit',
        'Team',
        'Persons'
    ];
    let exportRowValues = [
        'date',
        'template',
        'productionmonth',
        'productionyear',
        'filtertype',
        'empstatus',
        'department',
        'company',
        'branch',
        'unit',
        'team',
        'person'
    ];




    const [indexViewQuest, setIndexViewQuest] = useState(1);
    const [checking, setChecking] = useState("");
    const [deleteloading, setDeleteLoading] = useState(false);
    const [deleteAll, setDeleteAll] = useState(false);
    const [downloadAll, setDownloadAll] = useState(false);
    const [sendEmailAll, setSendEmailAll] = useState(false);

    const [signatureId, setSignatureId] = useState("")
    const [backgroundImageId, setBackgroundImageId] = useState("");
    const [sealId, setSealId] = useState("")
    const [checkingArray, setCheckingArray] = useState([]);
    const [monthSets, setMonthsets] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const currentDateAttStatus = new Date();
    const currentYearAttStatus = currentDateAttStatus.getFullYear();
    const years = Array.from(new Array(10), (val, index) => currentYearAttStatus - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });
    const [selectedMonthNum, setSelectedMonthNum] = useState(0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const [fromEmail, setFromEmail] = useState("");
    const dateMonth = new Date();
    const optionsMonth = { month: 'long' };
    const optionsYear = { year: 'numeric' };
    const monthInWords = dateMonth.toLocaleString('en-US', optionsMonth);
    const YearInWords = Number(dateMonth.toLocaleString('en-US', optionsYear));
    const [documentPrepartion, setDocumentPrepartion] = useState({
        date: "",
        template: "Please Select Template Name",
        productionmonth: "Please Select Month",
        productionyear: "Please Select Year",
        employeemode: "Please Select Employee Mode",
        filtertype: "Please Select Filter Type",
        empstatus: "Please Select Employee Status",
        company: "Please Select Company",
        choosedetails: "Please Select Details",
        signature: "Please Select Signature",
        seal: "Please Select Seal",



        templateno: "",
        pagenumberneed: "All Pages",
        reason: "Document",
        issuingauthority: "Please Select Issuing Authority",
        month: "Please Select Month",
        sort: "Please Select Sort",
        attendancedate: "",
        attendancemonth: "Please Select Attendance Month",
        attendanceyear: "Please Select Attendance Year",
        productiondate: "",

        unit: "Please Select Unit",
        team: "Please Select Team",
        person: "Please Select Person",
        proption: "Please Select Print Option",
        pagesize: "Please Select pagesize",
        print: "Please Select Print Option",
        heading: "Please Select Header Option",

        issuedpersondetails: "",
    });
    const [teamsall, setTeamsall] = useState([]);
    const [qrCodeNeed, setQrCodeNeed] = useState(false);
    const [signatureSealNeed, setSignatureSealNeed] = useState(false);
    const [departmentOpt, setDepartment] = useState([]);
    const [selectedBranchTo, setSelectedBranchTo] = useState([]);
    const [selectedUnitTo, setSelectedUnitTo] = useState([]);
    const [selectedTeamTo, setSelectedTeamTo] = useState([]);
    const [selectedDepartmentTo, setSelectedDepartmentTo] = useState([]);
    const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);
    const [withoutIndividualEmployees, setWithoutIndividualEmployees] = useState([]);
    const [employeesall, setEmployeesall] = useState([]);
    const [employeenamesDropdown, setEmployeeNamesDropdown] = useState([]);
    const [sealSignatureStatus, setSealSignatureStatus] = useState([]);
    const [departmentValues, setDepartmentValues] = useState([]);
    const [paySlipTodo, setPayslipTodo] = useState([]);
    const employeestatus = [
        { label: 'Live Employee', value: "Live Employee" },
        { label: 'Releave Employee', value: "Releave Employee" },
        { label: "Absconded", value: "Absconded" },
        { label: "Hold", value: "Hold" },
        { label: "Terminate", value: "Terminate" },
    ];

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

    useEffect(() => {
        fetchTeamAll();
        fetchDepartment();
    }, [])

    // Employee Names Dropdown
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
        setPageName(!pageName)
        try {

            let res = await axios.post(SERVICE.PAYSLIP_EMPLOYEE_NAMES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: "",
                month: documentPrepartion.productionmonth,
                year: documentPrepartion.productionyear,
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
    const fetchSignAatureandSeal = async (company, empstatus, options, status) => {
        let branch = [];
        let unit = [];
        let teamDrop = [];
        let department = [];

        switch (status) {
            case "empstatus":
                department = [];
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
        setPageName(!pageName)
        try {

            let res = await axios.post(SERVICE.PAYSLIP_SIGNATURE_SEAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: "",
                empstatus: empstatus,
                department: department,
                status: status,
                company: documentPrepartion.company,
                branch: branch,
                unit: unit,
                team: teamDrop,
            });
            const empNames = res?.data?.users?.length > 0 ? res?.data?.users : [];
            setSealSignatureStatus(empNames)

        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }

    const fetchSignatureSeal = (value) => {
        const company = value?.split("--")[0]
        const branch = value?.split("--")[1]
        const signatureSeal = sealSignatureStatus?.find(data => data.company === company && data.branch === branch);
        setCompanyName(signatureSeal)
    }


    //branchto multiselect dropdown changes
    const handleBranchChangeTo = (options) => {
        setSelectedBranchTo(options);
        setSelectedUnitTo([]);
        setSelectedEmployeeTo([]);
        setSelectedTeamTo([]);
        fetchEmployeeNamesBasedTeam(documentPrepartion.company, documentPrepartion.empstatus, options, 'branch');
        fetchSignAatureandSeal(documentPrepartion.company, documentPrepartion.empstatus, options, 'branch');
        setPayslipTodo([]);
        setCurrentPagePaySlip(1)

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
        setPayslipTodo([]);
        setCurrentPagePaySlip(1)
        fetchEmployeeNamesBasedTeam(documentPrepartion.company, documentPrepartion.empstatus, options, 'unit');
        fetchSignAatureandSeal(documentPrepartion.company, documentPrepartion.empstatus, options, 'unit');

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
        setPayslipTodo([]);
        setCurrentPagePaySlip(1)
        fetchEmployeeNamesBasedTeam(documentPrepartion.company, documentPrepartion.empstatus, options, 'team');
        fetchSignAatureandSeal(documentPrepartion.company, documentPrepartion.empstatus, options, 'team');
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
        setPayslipTodo([]);
        setCurrentPagePaySlip(1);
        fetchEmployeeNamesBasedTeam(documentPrepartion.company,
            documentPrepartion.empstatus,
            options, "department")
        fetchSignAatureandSeal(documentPrepartion.company,
            documentPrepartion.empstatus,
            options, "department")
    };
    const customValueRendererDepartmentTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Department";
    };

    //employee multiselect dropdown changes
    const handleEmployeeChangeTo = (options) => {
        setSelectedEmployeeTo(options);
        setPayslipTodo([])
        setCurrentPagePaySlip(1)
    };
    const customValueRendererEmployeeTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };



















    const handleMonthChangeProduction = (selectedMonth) => {
        const selectedMonthIndex = months.findIndex(month => month.value === selectedMonth.value);
        let updatedYears = getyear;
        if (selectedMonthIndex > currentMonth) {
            updatedYears = getyear.filter(year => year.value < currentYear);
        }
        setSelectedMonth(selectedMonth.value)
        setSelectedMonthNum(Number(selectedMonth.ansvalue))
        setDocumentPrepartion({
            ...documentPrepartion,
            productionmonth: selectedMonth.value,
            productionyear: selectedMonthIndex > currentMonth ? 'Please Select Year' : 'Please Select Year',
            signature: "Please Select Signature",
            seal: "Please Select Seal",
        });

        setAvailableYears(updatedYears);
        setPayslipTodo([])
    };
    const handleYearChangeProduction = (selectedYear) => {
        setChecking("")
        setDocumentPrepartion({
            ...documentPrepartion,
            productionyear: selectedYear.value,
            signature: "Please Select Signature",
            seal: "Please Select Seal",
        });
        setSelectedYear(selectedYear.value)
        setPayslipTodo([])

    };
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    const [availableYears, setAvailableYears] = useState(getyear);



    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;
    //useStates
    const [date, setDate] = useState(formattedDate);
    const gridRef = useRef(null);
    // let newvalues = "DOC0001";
    const [DateFormat, setDateFormat] = useState();
    const [attModearr, setAttModearr] = useState([]);
    const [DateFormatEdit, setDateFormatEdit] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [Changed, setChanged] = useState("");

    const [documentPreparationEdit, setDocumentPreparationEdit] = useState([]);
    const [templateCreationArray, setTemplateCreationArray] = useState([]);
    const [templateCreationArrayCreate, setTemplateCreationArrayCreate] = useState([]);
    const [templateCreationArrayExcel, setTemplateCreationExcel] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    // AssignBranch For Users
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
    const [loader, setLoader] = useState(false);
    const [btnload, setBtnLoad] = useState(false);
    const [btnloadSave, setBtnLoadSave] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [buttonLoadingPreview, setButtonLoadingPreview] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0)
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);



    useEffect(() => {
        // Disable right-click
        const handleRightClick = (event) => {
            event.preventDefault();
        };
        // Attach event listeners
        document.addEventListener('contextmenu', handleRightClick); // Disable right-click
        // Cleanup event listeners when the component is unmounted
        return () => {
            document.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);


    const months = [
        { value: 'January', label: 'January', ansvalue: "01" },
        { value: 'February', label: 'February', ansvalue: "02" },
        { value: 'March', label: 'March', ansvalue: "03" },
        { value: 'April', label: 'April', ansvalue: "04" },
        { value: 'May', label: 'May', ansvalue: "05" },
        { value: 'June', label: 'June', ansvalue: "06" },
        { value: 'July', label: 'July', ansvalue: "07" },
        { value: 'August', label: 'August', ansvalue: "08" },
        { value: 'September', label: 'September', ansvalue: "09" },
        { value: 'October', label: 'October', ansvalue: "10" },
        { value: 'November', label: 'November', ansvalue: "11" },
        { value: 'December', label: 'December', ansvalue: "12" }
    ];
    const [items, setItems] = useState([]);
    //  const [employees, setEmployees] = useState([]);
    const [departmentCheck, setDepartmentCheck] = useState(false);
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [agendaEdit, setAgendaEdit] = useState("");
    const [head, setHeader] = useState("");
    const [foot, setfooter] = useState("");
    const [signature, setSignature] = useState("");
    const [signatureContent, setSignatureContent] = useState("");
    const [signatureStatus, setSignatureStatus] = useState("");
    const [sealStatus, setSealStatus] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [sealPlacement, setSealPlacement] = useState("");
    const [waterMarkText, setWaterMarkText] = useState("");
    const [overallExcelDatas, setOverallExcelDatas] = useState([])
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

    const [isInfoOpenImage, setInfoOpenImage] = useState(false)
    const [previewManual, setPreviewManual] = useState(false)
    const [isInfoOpenImageManual, setInfoOpenImageManual] = useState(false)
    const [isInfoOpenImagePrint, setInfoOpenImagePrint] = useState(false)
    const [isInfoOpenImagePrintManual, setInfoOpenImagePrintManual] = useState(false)

    const handleClickOpenInfoImage = () => {
        setInfoOpenImage(true);
    };
    const handleCloseInfoImage = () => {
        setInfoOpenImage(false);
    };
    const handleClickOpenInfoImageManual = () => {
        setInfoOpenImageManual(true);
    };
    const handleCloseInfoImageManual = () => {
        setInfoOpenImageManual(false);
    };
    const handleClickOpenInfoImagePrint = () => {

        setInfoOpenImagePrint(true);
    };
    const handleCloseInfoImagePrint = () => {
        setInfoOpenImagePrint(false);
    };
    const handleOpenPreviewManual = () => {
        setPreviewManual(true);
    };
    const handleClosePreviewManual = () => {
        setPreviewManual(false);
    };
    const handleClickOpenInfoImagePrintManual = () => {
        setInfoOpenImagePrintManual(true);
    };
    const handleCloseInfoImagePrintManual = () => {
        setInfoOpenImagePrintManual(false);
    };

    const [openDialogManual, setOpenDialogManual] = useState(false)
    const handleClickOpenManualCheck = () => {
        setOpenDialogManual(true);
    };
    const handleCloseManualCheck = () => {
        setOpenDialogManual(false);
    };
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


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
            pagename: String("Human Resource/HR Documents/PaySlip Preparation"),
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

    const [headvalue, setHeadValue] = useState([])
    const [selectedHeadOpt, setSelectedHeadOpt] = useState([])
    function encryptString(str) {
        if (str) {
            const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const shift = 3; // You can adjust the shift value as per your requirement
            let encrypted = "";
            for (let i = 0; i < str.length; i++) {
                let charIndex = characters.indexOf(str[i]);
                if (charIndex === -1) {
                    // If character is not found, add it directly to the encrypted string
                    encrypted += str[i];
                } else {
                    // Shift the character index
                    charIndex = (charIndex + shift) % characters.length;
                    encrypted += characters[charIndex];
                }
            }
            return encrypted;
        }
        else {
            return ""
        }

    }

    const employeeModeOptions = [
        { value: "Current List", label: "Current List" },
        { value: "Abscond", label: "Abscond" },
        { value: "Releave Employee", label: "Releave Employee" },
        { value: "Hold", label: "Hold" },
        { value: "Terminate", label: "Terminate" },
        { value: "Manual", label: "Manual" },
    ];

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        referenceno: true,
        templateno: true,
        template: true,
        filtertype: true,
        empstatus: true,
        document: true,
        productionmonth: true,
        productionyear: true,
        employeemode: true,
        department: true,
        company: true,
        printingstatus: true,
        branch: true,
        unit: true,
        team: true,
        person: true,
        head: true,
        foot: true,
        headvaluetext: true,
        email: true,
        document: true,
        issuedpersondetails: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    useEffect(() => {
        addSerialNumber(templateCreationArrayCreate);
    }, [templateCreationArrayCreate]);



    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnLoad(false)
        setBtnLoadSave(false)
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
        setAgendaEdit("");
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
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.companyname;
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
    const [isDeleteOpenBulkcheckbox, setIsDeleteOpenBulkcheckbox] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const handleClickOpenDownloadOptions = () => {
        setIsDownloadOpen(true);
    };
    const handleCloseDownloadoptions = () => {
        setIsDownloadOpen(false);
    };

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [totalEmailFiles, setTotalEmailFiles] = useState([]);
    const [isDeleteBulkOpenalert, setIsDeleteBulkOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true)
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {

            setIsDeleteOpencheckbox(true);
        }
    };

    const handleClickOpenBulkcheckbox = () => {
        setIsDeleteOpenBulkcheckbox(true);
    };
    const handleCloseBulkModcheckbox = () => {
        setIsDeleteOpenBulkcheckbox(false);
    };

    const handleClickOpenBulkalert = () => {
        if (selectedRows?.length === 0) {
            setIsDeleteBulkOpenalert(true);
        } else {
            handleFileChange(selectedRows);
            setIsDeleteOpenBulkcheckbox(true);
        }
    };

    const handleFileChange = async (selectedRows) => {
        setPageName(!pageName)
        try {
            let res = await axios.post(`${SERVICE.PAYSLIPEMAILDATAS}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                selectedRows
            });
            const answer = res?.data?.payslipemaildatas?.flatMap(data => data?.paySlipTodo);
            setTotalEmailFiles(answer);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const handleCloseBulkModalert = () => {
        setIsDeleteBulkOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const templateValues = [{ label: "Template 1", value: "Template 1" },
    { label: "Template 2", value: "Template 2" },
    { label: "Template 3", value: "Template 3" }
    ]

    const [templateCreationValue, setTemplateCreationValue] = useState("");
    const [templateCreationValueEdit, setTemplateCreationValueEdit] = useState("");
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [employeeValue, setEmployeeValue] = useState([]);
    const [employeeUserName, setEmployeeUserName] = useState("");
    const [CompanyOptions, setCompanyOptions] = useState([]);
    const [BranchOptions, setBranchOptions] = useState([]);
    const [BranchOptionsEdit, setBranchOptionsEdit] = useState([]);
    const [allBranch, setAllBranch] = useState("");
    const [allBranchValue, setAllBranchValue] = useState(false);
    const [UnitOptions, setUnitOptions] = useState([]);
    const [TeamOptions, setTeamOptions] = useState([]);
    const [employeenames, setEmployeenames] = useState([]);
    const [employeeMode, setEmployeeMode] = useState("");



    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [selectedEmployeeValues, setSelectedEmployeeValues] = useState([]);







    const pagesizeoptions = [
        { value: "A3", label: "A3" },
        { value: "A4", label: "A4" },
        { value: "Certificate", label: "Certificate" },
        { value: "Certificate1", label: "Certificate1" },
        { value: "Envelope", label: "Envelope" }
    ];


    const [agendaEditStyles, setAgendaEditStyles] = useState({});
    const handlePagenameChange = (format) => {

        if (format === "A3") {
            setAgendaEditStyles({ width: "297mm", height: "420mm" });
        }
        else if (format === "A4") {
            setAgendaEditStyles({ width: "210mm", height: "297mm" });
        }
        else if (format === "Certificate") {
            setAgendaEditStyles({ width: "297mm", height: "180mm" });
        }
        else if (format === "Certificate1") {
            setAgendaEditStyles({ width: "297mm", height: "200mm" });
        }
        else if (format === "Envelope") {
            setAgendaEditStyles({ width: "220mm", height: "110mm" });
        }

    }





    const [generateData, setGenerateData] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [personId, setPersonId] = useState('');

    let Allcodedata = `${BASE_URL}/document/documentpreparation/${encryptString(documentPrepartion.person)}/${personId ? personId?._id : ""}/${encryptString(documentPrepartion?.issuingauthority)}/${DateFormat}/${isUserRoleAccess?._id}`



    const generateQrCode = async () => {
        setPageName(!pageName)
        try {
            const response = await QRCode.toDataURL(`${Allcodedata}`);
            setImageUrl(response);
        } catch (error) {

        }
    }


    useEffect(() => {
        generateQrCode();
    }, [Allcodedata])









    const [emailUser, setEmailUser] = useState("");

    const [employeeControlPanel, setEmployeeControlPanel] = useState("");

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYSLIP_DOCUMENT_PREPARATION_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handlePaySlipDatas = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYSLIP_DOCUMENT_PREPARATION_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpenDownloadOptions();
            setStateRow(res.data?.sdocumentPreparation?.paySlipTodo)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let brandid = documentPreparationEdit?._id;
    const delBrand = async () => {
        setDeleteLoading(true)
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.PAYSLIP_DOCUMENT_PREPARATION_SINGLE}/${brandid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchBrandMaster();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setDeleteLoading(false)
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setDeleteLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function
    const sendRequest = async () => {
        setBtnLoad(true)
        setPageName(!pageName)
        const branch = selectedBranchTo?.length ? selectedBranchTo?.map(data => data?.value) : [];
        const unit = selectedUnitTo?.length ? selectedUnitTo?.map(data => data?.value) : [];
        const team = selectedTeamTo?.length ? selectedTeamTo?.map(data => data?.value) : [];
        const department = selectedDepartmentTo?.length ? selectedDepartmentTo?.map(data => data?.value) : [];
        const employeeName = selectedEmployeeTo?.length ? selectedEmployeeTo?.map(data => data?.value) : ["All"];




        try {
            // const answer = checkingArray?.map(async (data, index) => {
            await axios.post(SERVICE.PAYSLIP_DOCUMENT_PREPARATION_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: String(date),
                template: String(documentPrepartion.template),
                empstatus: String(documentPrepartion.empstatus),
                filtertype: String(documentPrepartion.filtertype),
                company: String(documentPrepartion.company),
                employeemode: String(documentPrepartion?.employeemode),
                productionmonth: String(documentPrepartion.productionmonth),
                productionyear: String(documentPrepartion.productionyear),
                signature: String(documentPrepartion.signature),
                signaturepreview: signature,
                seal: String(documentPrepartion.seal),
                choosedetails: String(documentPrepartion.choosedetails),
                sealpreview: sealPlacement,
                signatureSealNeed: signatureSealNeed,
                branch: branch,
                unit: unit,
                team: team,
                department: department,
                employeename: employeeName,
                paySlipTodo: paySlipTodo,
                qrcodeneed: qrCodeNeed,
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
            // })
            await fetchBrandMaster();
            handleCloseInfoImage();
            setDocumentPrepartion({
                ...documentPrepartion,
                person: "Please Select Person",
                template: "Please Select Template Name",
                productionmonth: "Please Select Month",
                productionyear: "Please Select Year",
                employeemode: "Please Select Employee Mode",
                filtertype: "Please Select Filter Type",
                empstatus: "Please Select Employee Status",

            });
            setPayslipTodo([]);
            setBtnLoad(false)
            handleCloseInfoImage();
            setChecking("");
            setCheckingArray([])
            setIndexViewQuest(1)
            setEmployeeControlPanel("")
            setEmployeeValue([])
            setEmployeeUserName("")
            window.scrollTo(0, 0)
            setPopupContent('AddedSuccessfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtnLoad(false)
            setSearchQuery("")
        } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));



    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const [first, second, third] = moment(new Date()).format("DD-MM-YYYY hh:mm a")?.split(" ")
        const vasr = `${first}_${second}_${third}`
        setDateFormat(vasr)
        let employeeNames = selectedEmployeeTo?.length > 0 ? selectedEmployeeTo?.map(data => data?.value) : withoutIndividualEmployees?.map(data => data.companyname)
        const isNameMatch = templateCreationArray?.some((item) =>
            item.template === documentPrepartion?.template
            &&
            item.productionmonth === documentPrepartion?.productionmonth &&
            item.productionyear === documentPrepartion?.productionyear?.toString() &&
            item?.paySlipTodo?.some(data => employeeNames?.includes(data.companyname))
        );

        const isNameMatchInside = checkingArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.empname === documentPrepartion.person);

        if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
            setPopupContentMalert('Please Select Template Name');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.productionmonth === "Please Select Month") {
            setPopupContentMalert('Please Select Month');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.productionyear === "Please Select Year") {
            setPopupContentMalert('Please Select Year');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company") {
            setPopupContentMalert('Please Select Company');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.filtertype === "" || documentPrepartion.filtertype === "Please Select Filter Type") {
            setPopupContentMalert('Please Select Filter Type');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.empstatus === "" || documentPrepartion.empstatus === "Please Select Employee Status") {
            setPopupContentMalert('Please Select Employee Status');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.filtertype === "Department" && selectedDepartmentTo.length === 0) {
            setPopupContentMalert('Please Select Department');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(documentPrepartion.filtertype) && selectedBranchTo.length === 0) {
            setPopupContentMalert('Please Select Branch');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(documentPrepartion.filtertype) && selectedUnitTo.length === 0) {
            setPopupContentMalert('Please Select Unit');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeamTo.length === 0 && ["Individual", "Team"]?.includes(documentPrepartion.filtertype)) {
            setPopupContentMalert('Please Select Team');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployeeTo.length === 0 && ["Individual"]?.includes(documentPrepartion.filtertype)) {
            setPopupContentMalert('Please Select Employee Names');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (documentPrepartion.choosedetails === "Please Select Details") {
            setPopupContentMalert('Please Select Details');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((documentPrepartion.choosedetails !== "Please Select Details" && documentPrepartion.choosedetails !== "") && !signatureSealNeed &&
            (documentPrepartion.signature === "" || documentPrepartion.signature === "Please Select Signature")) {
            setPopupContentMalert('Please Select Signature');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((documentPrepartion.choosedetails !== "Please Select Details" && documentPrepartion.choosedetails !== "") && !signatureSealNeed &&
            (documentPrepartion.seal === "" || documentPrepartion.seal === "Please Select Seal")) {
            setPopupContentMalert('Please Select Seal');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployeeTo?.length > 0 && isNameMatch) {
            setPopupContentMalert('These Data is Already Added...');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            if (selectedEmployeeTo?.length > 0) {
                TodoPaySlip(selectedEmployeeTo);
            } else {
                filteringEmployeeNames();
            }




        }
    };


    const filteringEmployeeNames = async () => {
        let branch = [];
        let unit = [];
        let teamDrop = [];
        let department = [];
        let company;
        switch (documentPrepartion.filtertype) {

            case "empstatus":
                department = [];
                company = [];
                unit = [];
                teamDrop = [];
                break;
            case "Department":
                company = documentPrepartion.company;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo.map(data => data.value) : [];
                company = [];
                unit = [];
                teamDrop = [];
                break;
            case "Branch":
                department = [];
                company = documentPrepartion.company;
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = [];
                teamDrop = [];
                break;

            case "Unit":
                company = documentPrepartion.company
                department = []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = selectedUnitTo?.length > 0 ? selectedUnitTo.map(data => data.value) : [];
                teamDrop = [];
                break;

            case "Team":
                department = [];
                company = documentPrepartion.company;
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = selectedUnitTo?.length > 0 ? selectedUnitTo.map(data => data.value) : [];
                teamDrop = selectedTeamTo?.length > 0 ? selectedTeamTo.map(data => data.value) : [];
                break;

            default:
                company = documentPrepartion.company;
                department = [];
                branch = [];
                unit = [];
                teamDrop = [];
                break;
        }
        setPageName(!pageName);
        try {
            let res = await axios.post(`${SERVICE.FILTERED_EMPLOYEE_NAMES_PAYSLIP}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: documentPrepartion.productionmonth,
                year: documentPrepartion.productionyear,
                company: documentPrepartion.company,
                filtertype: documentPrepartion.filtertype,
                empstatus: documentPrepartion.empstatus,
                branch: branch,
                unit: unit,
                team: teamDrop,
                department: department
            });
            const empNames = res?.data?.users?.length > 0 ? res?.data?.users : [];
            let employeeNames = selectedEmployeeTo?.length > 0 ? selectedEmployeeTo?.map(data => data?.value) : empNames?.map(data => data.companyname)
            const isNameMatch = templateCreationArray?.some((item) =>
                item.template === documentPrepartion.template &&
                item.productionmonth === documentPrepartion.productionmonth &&
                item.productionyear === documentPrepartion.productionyear?.toString() &&
                item?.paySlipTodo?.some(data => employeeNames?.includes(data.companyname))
            );
            if (isNameMatch) {
                setWithoutIndividualEmployees([])
                setPopupContentMalert('These Data is Already Added...');
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (empNames?.length === 0) {
                setWithoutIndividualEmployees([])
                setPopupContentMalert('There is no Employee to Generate Pay Slip');
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                setWithoutIndividualEmployees(empNames)
                TodoPaySlip(empNames);
            }
        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const TodoPaySlip = (item) => {
        let answerr = [];
        const sealid = sealId ? sealId?._id : "123456";
        const signatureid = signatureId ? signatureId?._id : "123456";
        const backgroundimageid = backgroundImageId ? backgroundImageId?._id : "123456";
        item?.forEach((data, index) =>
            answerr.push({
                branch: data.branch,
                unit: data.unit,
                team: data.team,
                companyname: data.companyname,
                username: data.username,
                department: data.department,
                usermail: data.email,
                userid: data._id,
                index: index,
                qrcode: qrCodeNeed,
                generatedby: isUserRoleAccess.companyname,
                generateddate: (new Date()).toString(),
                month: documentPrepartion?.productionmonth,
                year: documentPrepartion?.productionyear,
                template: documentPrepartion.template,
                signatureid: signatureid,
                sealid: sealid,
                backgroundimageid: backgroundimageid
            })

        );
        setPayslipTodo(answerr);

    };
    const HandleDeleteTodoIndex = (index) => {
        const updatedTodos = [...paySlipTodo];
        updatedTodos.splice(index, 1);
        setPayslipTodo(updatedTodos);
    }

    const [currentPagePaySlip, setCurrentPagePaySlip] = useState(1);
    const itemsPerPagePaySlip = 5;
    // Calculate total pages
    const totalPagesPaySlip = Math.ceil(paySlipTodo?.length / itemsPerPagePaySlip);
    const currentItemsPaySlip = paySlipTodo?.slice((currentPagePaySlip - 1) * itemsPerPagePaySlip, currentPagePaySlip * itemsPerPagePaySlip);
    // Handle Next button
    const handleNextPaySlip = () => {
        if (currentPagePaySlip < totalPagesPaySlip) {
            setCurrentPagePaySlip(currentPagePaySlip + 1);
        }
    };

    // Handle Previous button
    const handlePreviousPaySlip = () => {
        if (currentPagePaySlip > 1) {
            setCurrentPagePaySlip(currentPagePaySlip - 1);
        }
    };


    //submit option for saving
    const handleSubmited = (e, index) => {
        e.preventDefault();
        let ans = [];
        let employeeNames = selectedEmployeeTo?.length > 0 ? selectedEmployeeTo?.map(data => data?.value) : withoutIndividualEmployees?.map(data => data.companyname)
        const isNameMatch = templateCreationArray?.some((item) =>
            item.template === documentPrepartion.template &&
            item.productionmonth === documentPrepartion.productionmonth &&
            item.productionyear === documentPrepartion?.productionyear?.toString() &&
            item?.paySlipTodo?.some(data => employeeNames?.includes(data.companyname))
        );
        if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
            setPopupContentMalert('Please Select Template Name');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.productionmonth === "Please Select Month") {
            setPopupContentMalert('Please Select Month');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.productionyear === "Please Select Year") {
            setPopupContentMalert('Please Select Year');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company") {
            setPopupContentMalert('Please Select Company');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.filtertype === "" || documentPrepartion.filtertype === "Please Select Filter Type") {
            setPopupContentMalert('Please Select Filter Type');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.empstatus === "" || documentPrepartion.empstatus === "Please Select Employee Status") {
            setPopupContentMalert('Please Select Employee Status');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.filtertype === "Department" && selectedDepartmentTo.length === 0) {
            setPopupContentMalert('Please Select Department');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(documentPrepartion.filtertype) && selectedBranchTo.length === 0) {
            setPopupContentMalert('Please Select Branch');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(documentPrepartion.filtertype) && selectedUnitTo.length === 0) {
            setPopupContentMalert('Please Select Unit');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeamTo.length === 0 && ["Individual", "Team"]?.includes(documentPrepartion.filtertype)) {
            setPopupContentMalert('Please Select Team');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployeeTo.length === 0 && ["Individual"]?.includes(documentPrepartion.filtertype)) {
            setPopupContentMalert('Please Select Employee Names');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (["Individual"]?.includes(documentPrepartion.filtertype) && paySlipTodo?.length === 0) {
            setPopupContentMalert('Please add at least one item to the todo list.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (documentPrepartion.choosedetails === "Please Select Details") {
            setPopupContentMalert('Please Select Details');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((documentPrepartion.choosedetails !== "Please Select Details" && documentPrepartion.choosedetails !== "") && !signatureSealNeed &&
            (documentPrepartion.signature === "" || documentPrepartion.signature === "Please Select Signature")) {
            setPopupContentMalert('Please Select Signature');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((documentPrepartion.choosedetails !== "Please Select Details" && documentPrepartion.choosedetails !== "") && !signatureSealNeed &&
            (documentPrepartion.seal === "" || documentPrepartion.seal === "Please Select Seal")) {
            setPopupContentMalert('Please Select Seal');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert('These Data is Already Added...');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            handleClickOpenInfoImage();
        }
    };
    const handleSubmitedManual = (e) => {
        e.preventDefault();
        const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
        if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
            setPopupContentMalert('Please Select Template Name');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
            setPopupContentMalert('Please Select Employee Mode');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
            setPopupContentMalert('Please Select Department');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
            setPopupContentMalert('Please Select Company');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
            setPopupContentMalert('Please Select Branch');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
            setPopupContentMalert('Please Select Unit');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
            setPopupContentMalert('Please Select Team');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (documentPrepartion.employeemode !== "Manual" && isNameMatch) {
            setPopupContentMalert('Document with Person Name and Template already exists!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (checking === "") {
            setPopupContentMalert('Document is Empty');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (generateData) {
            setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.employeemode === "Manual" && (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0)) {
            setPopupContentMalert('Fill All the Fields Which starts From $ and Ends with $');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setBtnLoad(true)


        }
    };
    const regex = /\$[A-Z]+\$/g;



    const handlecleared = (e) => {
        e.preventDefault();
        setGenerateData(false)
        setDocumentPrepartion({
            date: "",
            template: "Please Select Template Name",
            productionmonth: "Please Select Month",
            productionyear: "Please Select Year",
            employeemode: "Please Select Employee Mode",
            filtertype: "Please Select Filter Type",
            empstatus: "Please Select Employee Status",
            company: "Please Select Company",
            choosedetails: "Please Select Details",
            signature: "Please Select Signature",
            seal: "Please Select Seal",
        });
        setQrCodeNeed(false);
        setSignatureSealNeed(false)
        setSignature("")
        setSealPlacement('')
        setPayslipTodo([])
        setSelectedEmployeeValues([])
        setSelectedEmployee([])
        setIndexViewQuest(1)
        setHeadValue([])
        setSealSignatureStatus([])
        setCompanyName("")
        setSelectedHeadOpt([])
        setHeader("")
        setfooter("")
        setSealStatus("")
        setSignatureStatus("")
        setDepartmentCheck(false);
        setAllBranchValue(false);
        setButtonLoading(false)
        setBtnLoad(false)
        setBranchOptions([]);
        setUnitOptions([]);
        setTeamOptions([]);
        setEmployeenames([]);
        setChecking("");
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    const handleclearedManual = (e) => {
        e.preventDefault();
        setGenerateData(false)
        setDocumentPrepartion({
            date: "", template: "Please Select Template Name",
            referenceno: "", templateno: "",
            pagenumberneed: "All Pages",
            employeemode: "Please Select Employee Mode",
            department: "Please Select Department",
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            person: "Please Select Person",
            proption: "Please Select Print Option",
            issuingauthority: "Please Select Issuing Authority",
            sort: "Please Select Sort",
            attendancedate: "",
            attendancemonth: "Please Select Attendance Month",
            attendanceyear: "Please Select Attendance Year",
            productiondate: "",
            productionmonth: "Please Select Month",
            productionyear: "Please Select Year",
            signature: "Please Select Signature",
            seal: "Please Select Seal",
            pagesize: "Please Select pagesize",
            print: "Please Select Print Option",
            heading: "Please Select Header Option",
            issuedpersondetails: "",
        });

        setHeadValue([])
        setSelectedHeadOpt([])
        setHeader("")
        setCheckingArray([])
        setSelectedEmployeeValues([])
        setSelectedEmployee([])
        setIndexViewQuest(1)
        setfooter("")
        setSealStatus("")
        setSignatureStatus("")
        setDepartmentCheck(false);
        setAllBranchValue(false);
        setButtonLoading(false)
        setBtnLoad(false)
        setBranchOptions([]);
        setUnitOptions([]);
        setTeamOptions([]);
        setEmployeenames([]);
        setChecking("");
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };
    const [logicOperator, setLogicOperator] = useState("AND");
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    //get all brand master name.
    const fetchBrandMaster = async () => {
        setLoader(true);
        setPageName(!pageName)
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch
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
            let res_freq = await axios.post(SERVICE.PAYSLIP_DOCUMENT_PREPARATION_ASSIGNBRANCH, {
                queryParams

            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });


            const answer = res_freq?.data?.paySlipDocumentPreparation?.length > 0 ? res_freq?.data?.paySlipDocumentPreparation?.map((item, index) => ({
                // ...item,
                _id: item._id,
                // serialNumber: index + 1,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
                company: item.company,
                template: item.template,
                filtertype: item.filtertype,
                empstatus: item.empstatus,
                // paySlipTodo: item?.paySlipTodo,
                productionmonth: item.productionmonth,
                productionyear: item.productionyear,
                department: item.department?.length > 0 ? item.department
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                branch: item.branch?.length > 0 ? item.branch
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                unit: item.unit?.length > 0 ? item.unit
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                team: item.team?.length > 0 ? item.team
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                person: item?.paySlipTodo?.length > 0 ? item?.paySlipTodo
                    ?.map((t, i) => `${i + 1 + ". "}` + t.companyname)
                    .join("\n") : "",
            })) : [];
            setTemplateCreationArrayCreate(answer)
            setTotalProjects(answer?.length > 0 ? res_freq?.data?.totalProjects : 0);
            setTotalPages(answer?.length > 0 ? res_freq?.data?.totalPages : 0);
            setPageSize((data) => { return answer?.length > 0 ? data : 10 });
            setPage((data) => { return answer?.length > 0 ? data : 1 });
            setChanged("ChangedStatus")
            setLoader(false);
        } catch (err) {
            console.log(err, 'err')
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleResetSearch = async (data) => {

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

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch
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
            let res_freq = await axios.post(SERVICE.PAYSLIP_DOCUMENT_PREPARATION_ASSIGNBRANCH, {
                queryParams

            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });


            const answer = res_freq?.data?.paySlipDocumentPreparation?.length > 0 ? res_freq?.data?.paySlipDocumentPreparation?.map((item, index) => ({
                // ...item,
                _id: item._id,
                // serialNumber: index + 1,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
                company: item.company,
                template: item.template,
                filtertype: item.filtertype,
                empstatus: item.empstatus,
                // paySlipTodo: item?.paySlipTodo,
                productionmonth: item.productionmonth,
                productionyear: item.productionyear,
                department: item.department?.length > 0 ? item.department
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                branch: item.branch?.length > 0 ? item.branch
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                unit: item.unit?.length > 0 ? item.unit
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                team: item.team?.length > 0 ? item.team
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                person: item?.paySlipTodo?.length > 0 ? item?.paySlipTodo
                    ?.map((t, i) => `${i + 1 + ". "}` + t.companyname)
                    .join("/n") : "",
            })) : [];
            setTemplateCreationArrayCreate(answer)
            setTotalProjects(answer?.length > 0 ? res_freq?.data?.totalProjects : 0);
            setTotalPages(answer?.length > 0 ? res_freq?.data?.totalPages : 0);
            setPageSize((data) => { return answer?.length > 0 ? data : 10 });
            setPage((data) => { return answer?.length > 0 ? data : 1 });
            setChanged("ChangedStatus")
            // Trigger a table refresh if necessary
            setPageName((prev) => !prev); // Force re-render
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

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

    const fetchBrandMasterOverall = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.post(SERVICE.PAYSLIP_DOCUMENT_PREPARATION_ASSIGNBRANCH_OVERALL, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            setTemplateCreationArray(res_freq?.data?.overallList);
            const answer = res_freq?.data?.overAllExcel?.length > 0 ? res_freq?.data?.overAllExcel?.map((item, index) => ({
                // ...item,
                _id: item._id,
                serialNumber: index + 1,
                // serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
                company: item.company,
                template: item.template,
                filtertype: item.filtertype,
                empstatus: item.empstatus,
                // paySlipTodo: item?.paySlipTodo,
                productionmonth: item.productionmonth,
                productionyear: item.productionyear,
                department: item.department?.length > 0 ? item.department
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                branch: item.branch?.length > 0 ? item.branch
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                unit: item.unit?.length > 0 ? item.unit
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                team: item.team?.length > 0 ? item.team
                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                    .join("\n") : "",
                person: item?.paySlipTodo?.length > 0 ? item?.paySlipTodo
                    ?.map((t, i) => `${i + 1 + ". "}` + t.companyname)
                    .join("/n") : "",
            })) : [];
            setTemplateCreationExcel(res_freq?.data?.overAllExcel);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchBrandMaster();
    }, [page, pageSize, searchQuery]);




    useEffect(() => {
        fetchBrandMasterOverall();
    }, []);

    const delAreagrpcheckbox = async () => {
        setDeleteAll(true)
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.PAYSLIP_DOCUMENT_PREPARATION_SINGLE}/${item}`, {
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
            setDeleteAll(false)
            await fetchBrandMaster();
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchBrandMaster();
        } catch (err) { setDeleteAll(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };




    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYSLIP_DOCUMENT_PREPARATION_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYSLIP_DOCUMENT_PREPARATION_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //frequency master name updateby edit page...
    let updateby = documentPreparationEdit?.updatedby;
    let addedby = documentPreparationEdit?.addedby;
    let frequencyId = documentPreparationEdit?._id;

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Pay Slip Preparation.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Excel
    const fileName = "PaySlipPreparation";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "PaySlipPreparation",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (item) => {
        setItems(item);
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
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    // const filteredDatas = items?.filter((item) => {
    //     return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    // });

    // const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    // const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    // const visiblePages = Math.min(totalPages, 3);
    // const firstVisiblePage = Math.max(1, page - 1);
    // const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    // const pageNumbers = [];
    // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    //     pageNumbers.push(i);
    // }

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
            //lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            //lockPinned: true,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "productionmonth",
            headerName: "Pay Slip Month",
            flex: 0,
            width: 100,
            hide: !columnVisibility.productionmonth,
            headerClassName: "bold-header",
        },
        {
            field: "productionyear",
            headerName: "Pay Slip Year",
            flex: 0,
            width: 100,
            hide: !columnVisibility.productionyear,
            headerClassName: "bold-header",
        },
        {
            field: "template",
            headerName: "Template",
            flex: 0,
            width: 150,
            hide: !columnVisibility.template,
            headerClassName: "bold-header",
        },
        {
            field: "filtertype",
            headerName: "Filter Type",
            flex: 0,
            width: 100,
            hide: !columnVisibility.filtertype,
            headerClassName: "bold-header",
        },
        {
            field: "empstatus",
            headerName: "Employee Status",
            flex: 0,
            width: 100,
            hide: !columnVisibility.empstatus,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 140,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 80,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 80,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 80,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 80,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "person",
            headerName: "Persons",
            flex: 0,
            width: 250,
            hide: !columnVisibility.person,
            headerClassName: "bold-header",
        },
        {
            field: "document",
            headerName: "Documents",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.document,
            cellRenderer: (params) => (
                <Grid>
                    <Button
                        variant="text"
                        onClick={() => {
                            handlePaySlipDatas(params.data?.id);
                        }}
                        sx={userStyle.buttonview}
                    >
                        View
                    </Button>
                </Grid>
            ),
        },
        // {
        //     field: "printingstatus",
        //     headerName: "Printing Status",
        //     flex: 0,
        //     width: 150,
        //     minHeight: "40px",
        //     hide: !columnVisibility.printingstatus,

        // },
        // {
        //     field: "email",
        //     headerName: "Email",
        //     flex: 0,
        //     width: 150,
        //     minHeight: "40px",
        //     hide: !columnVisibility.email,
        //     renderCell: (params) => (
        //         <Grid>
        //             {isUserRoleCompare?.includes("menuemployeedocumentpreparationmail") && (
        //                 <Button
        //                     variant="contained"
        //                     color={params?.data?.mail === "Send" ? "success" : "error"}
        //                     onClick={() => {

        //                         // extractEmailFormat(params.data.person, params.data.id)
        //                     }}
        //                     sx={userStyle.buttonview}
        //                 >
        //                     {params?.data?.mail}
        //                 </Button>
        //             )}
        //         </Grid>
        //     ),

        // },
        // {
        //     field: "issuedpersondetails",
        //     headerName: "Issued Person Details",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.issuedpersondetails,
        //     headerClassName: "bold-header",
        // },
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
                    {/* {isUserRoleCompare?.includes("edocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
                    {isUserRoleCompare?.includes("dpayslipdocumentpreparation") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpayslipdocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipayslipdocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const payslipRef = useRef([]);
    // Example employee and salary details
    const employeeDetails = { name: 'John Doe', id: '1234' };
    const salaryDetails = { amount: '$5000' };
    const [stateRow, setStateRow] = useState([])
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    // const getUpdatePrintingStatus = (index = 0) => {
    //     setDownloadAll(true)
    //     if (index >= stateRow.length) return; // Exit if all payslips are processed

    //     const currentPayslipRef = payslipRef.current[index];

    //     if (currentPayslipRef) {
    //         const element = payslipRef.current[index];

    //         // Optional settings
    //         const options = {
    //             margin: 0.01,
    //             filename: 'payslip.pdf',
    //             image: { type: 'jpeg', quality: 0.98 },
    //             html2canvas: { scale: 2 },
    //             jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    //         };

    //         // Generate and download the PDF
    //         html2pdf().from(element).set(options).save();
    //         getUpdatePrintingStatus(index + 1); // Trigger the next one after the current finishes  
    //         handleCloseDownloadoptions();
    //         setDownloadAll(false)
    //     } else {
    //         setDownloadAll(false)
    //     }
    // };


    const getUpdatePrintingStatus = (index = 0) => {
        setDownloadAll(true);

        if (index >= stateRow.length) {
            setDownloadAll(false);
            setVisibleCount(10)
            return;
        }

        const currentPayslipRef = payslipRef.current[index];

        if (currentPayslipRef) {
            const element = payslipRef.current[index];

            // Show snackbar message
            setSnackbarMessage(`Payslip for ${stateRow[index]?.companyname} is downloading...`);
            setShowSnackbar(true);

            const options = {
                margin: 0.01,
                filename: `payslip-${stateRow[index]?.companyname} .pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
            };

            // Generate and download the PDF
            html2pdf()
                .from(element)
                .set(options)
                .save()
                .then(() => {
                    getUpdatePrintingStatus(index + 1); // Call next after current download completes
                });
        } else {
            setDownloadAll(false);
            setVisibleCount(10)
        }

        if (index === stateRow.length - 1) {
            handleCloseDownloadoptions();
            setVisibleCount(10)
        }
    };



    const handleDownloadAll = () => {
        if (visibleCount >= stateRow.length) {
            // All payslips loaded – proceed with download
            getUpdatePrintingStatus();
        }
        else {
            // Not all loaded – show a warning
            setPopupContent(`Only ${visibleCount}/${stateRow.length} payslips are loaded.Load All`);
            setPopupSeverity("warning");
            handleClickOpenPopup();
        }
    };

    const handleSendEmailAll = () => {
        if (emailVisibleCount >= totalEmailFiles.length) {
            // All payslips are loaded – proceed with email sending
            handleBulkEmail(); // Start email sending sequence
        } else {
            // Not all loaded – show a warning popup
            setPopupContent(`Only ${emailVisibleCount}/${totalEmailFiles.length} payslips are loaded. Load All`);
            setPopupSeverity("warning");
            handleClickOpenPopup();
        }
    };

    const handleBulkEmail = async (index = 0) => {
        setSendEmailAll(true);

        if (index >= totalEmailFiles.length) {
            setSendEmailAll(false);
            return;
        }

        const currentPayslipRef = payslipRef.current[index];

        if (currentPayslipRef) {
            const element = currentPayslipRef;

            const options = {
                margin: 0.01,
                filename: `payslip_${index + 1}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
            };

            setPageName(!pageName);

            try {
                const pdfBlob = await new Promise((resolve, reject) => {
                    html2pdf().from(element).set(options).outputPdf('blob').then(resolve).catch(reject);
                });

                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(pdfBlob);
                });

                const payload = {
                    fileName: `payslip_${index + 1}.pdf`,
                    usermail: totalEmailFiles[index]?.usermail,
                    paymonth: totalEmailFiles[index]?.month,
                    payyear: totalEmailFiles[index]?.year,
                    controlid: totalEmailFiles[index]?.backgroundimageid,
                    fileData: base64
                };

                const res_module = await axios.post(SERVICE.PAYSLIP_DOCUMENT_MAIL, payload, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (res_module.status === 200) {
                    NotificationManager.success('Email Sent Successfully 👍', '', 2000);
                } else {
                    NotificationManager.error('Email Not Sent 👎', '', 2000);
                }
            } catch (error) {
                console.error(`Error processing payslip at index ${index}:`, error);
            }

            handleBulkEmail(index + 1);
        } else {
            console.error("payslipRef is not pointing to a valid element");
            setSendEmailAll(false);
        }
    };


    const rowDataTable = items.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            date: item.date,
            company: item.company,
            template: item.template,
            filtertype: item.filtertype,
            empstatus: item.empstatus,
            productionmonth: item.productionmonth,
            productionyear: item.productionyear,
            department: item.department,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            person: item.person,
            paySlipTodo: item?.paySlipTodo,
            // issuedpersondetails: item.issuingauthority,
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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


    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <Box>
            <Headtitle title={"PAY SLIP PREPARATION"} />
            {/* ****** Header Content ****** */}
            <PageHeading title="Pay Slip Preparation" modulename="Human Resources" submodulename="HR Documents" mainpagename="Employee Documents" subpagename="PaySlip Document Preparation" subsubpagename="" />

            <Snackbar
                open={showSnackbar}
                autoHideDuration={2000}
                onClose={() => setShowSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ top: '100px !important' }}
            />


            <>
                {isUserRoleCompare?.includes("apayslipdocumentpreparation") && (


                    <Box sx={userStyle.selectcontainer}>
                        <Typography>
                            Add Pay Slip Preparation
                        </Typography>
                        <br /> <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={moment(date).format("DD-MM-YYYY")} />
                                    </FormControl>
                                </Grid>
                                {/* Templates should be here */}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Template <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={templateValues}
                                            value={{ label: documentPrepartion.template, value: documentPrepartion.template }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    template: e.value,
                                                    sign: "Please Select Signature",
                                                    sealing: "Please Select Seal",
                                                    person: "Please Select Person",
                                                });
                                                // fetchTemplatePage(e.value);
                                                setSealPlacement("")
                                                setSignature("")
                                                setChecking("")
                                                setTemplateCreationValue(e)
                                                setSignatureStatus("")
                                                setSealStatus("")
                                                setCheckingArray([])
                                                setIndexViewQuest(1)
                                                setSelectedEmployeeValues([])
                                                setSelectedEmployee([])
                                                setPayslipTodo([])
                                                setCurrentPagePaySlip(1)

                                            }}
                                        />
                                    </FormControl>
                                </Grid>


                                {/*Procution Month dropdowns based on Production - Completed Data's  */}

                                <Grid item md={3} xs={12} sm={12}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Month<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={months}
                                                value={{ label: documentPrepartion?.productionmonth, value: documentPrepartion?.productionmonth }}
                                                onChange={handleMonthChangeProduction}

                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Select Year<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={availableYears}
                                            value={{ label: documentPrepartion?.productionyear, value: documentPrepartion?.productionyear }}
                                            onChange={handleYearChangeProduction}
                                        />
                                    </FormControl>
                                </Grid>





                                {/* Change HERE */}







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
                                                label: documentPrepartion.company,
                                                value: documentPrepartion.company,
                                            }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    company: e.value,
                                                    filtertype: "Please Select Filter Type"
                                                });
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setEmployeeNamesDropdown([]);
                                                setPayslipTodo([]);
                                                setCurrentPagePaySlip(1)
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
                                                label: documentPrepartion.filtertype,
                                                value: documentPrepartion.filtertype,
                                            }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({ ...documentPrepartion, filtertype: e.value });
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setEmployeeNamesDropdown([])
                                                setPayslipTodo([]);
                                                setCurrentPagePaySlip(1)
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
                                                label: documentPrepartion.empstatus,
                                                value: documentPrepartion.empstatus,
                                            }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion, empstatus: e.value,
                                                });
                                                fetchEmployeeNamesBasedTeam(documentPrepartion.company,
                                                    e.value,
                                                    e.value, "empstatus")

                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setPayslipTodo([]);
                                                setCurrentPagePaySlip(1)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                {["Individual", "Team"]?.includes(documentPrepartion.filtertype) ? <>
                                    {/* Branch Unit Team */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        documentPrepartion.company === comp.company
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
                                                        documentPrepartion.company === comp.company && selectedBranchTo
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
                                    ["Department"]?.includes(documentPrepartion.filtertype) ?
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
                                        : ["Branch"]?.includes(documentPrepartion.filtertype) ?
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Branch
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch?.filter(
                                                                (comp) =>
                                                                    documentPrepartion.company === comp.company
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
                                            ["Unit"]?.includes(documentPrepartion.filtertype) ?
                                                <>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Branch
                                                            </Typography>
                                                            <MultiSelect
                                                                options={accessbranch?.filter(
                                                                    (comp) =>
                                                                        documentPrepartion.company === comp.company
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
                                                                        documentPrepartion.company === comp.company && selectedBranchTo
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
                                {["Individual"]?.includes(documentPrepartion.filtertype) &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name
                                            </Typography>
                                            <MultiSelect
                                                options={employeenamesDropdown?.map(data => ({
                                                    ...data,
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
                                {/* {(signatureStatus === "With") &&  */}
                                {sealSignatureStatus?.length > 0 &&
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Choose Details<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={sealSignatureStatus?.map(data => ({
                                                    ...data,
                                                    label: `${data.company}--${data.branch}`,
                                                    value: `${data.company}--${data.branch}`
                                                }))}
                                                value={{ label: documentPrepartion.choosedetails, value: documentPrepartion.choosedetails }}
                                                onChange={(e) => {
                                                    setDocumentPrepartion({
                                                        ...documentPrepartion,
                                                        choosedetails: e.value,
                                                        seal: "Please Select Seal",
                                                        signature: "Please Select Signature"
                                                    });
                                                    setBackgroundImageId(e)
                                                    fetchSignatureSeal(e.value);
                                                    setSignature("");
                                                    setSealPlacement("");
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>}
                                {companyName &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                        checked={signatureSealNeed}
                                                        onChange={() => {
                                                            setSignatureSealNeed((val) => !val);
                                                            setDocumentPrepartion({
                                                                ...documentPrepartion,
                                                                seal: "Please Select Seal",
                                                                signature: "Please Select Signature"
                                                            });
                                                            setSignature("");
                                                            setSealPlacement("");
                                                        }}
                                                        color="primary"
                                                    />
                                                }
                                                label="Without Signature/Seal"
                                            />
                                        </FormControl>
                                    </Grid>
                                }

                                {(companyName && !signatureSealNeed) &&
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Signature<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    maxMenuHeight={300}
                                                    options={companyName?.documentsignature?.map(data => ({
                                                        ...data,
                                                        label: `${data.signaturename} -- ${data.employee}`,
                                                        value: `${data.signaturename} -- ${data.employee}`
                                                    }))}
                                                    value={{ label: documentPrepartion.signature, value: documentPrepartion.signature }}
                                                    onChange={(e) => {
                                                        setDocumentPrepartion({
                                                            ...documentPrepartion,
                                                            signature: e.value,
                                                            seal: "Please Select Seal"
                                                        });
                                                        setSignature(e?.document[0]?.preview)
                                                        setSignatureContent(e)
                                                        setSignatureId(e)
                                                        setSealPlacement("")
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Seal<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    maxMenuHeight={300}
                                                    options={companyName?.documentseal?.map(data => ({
                                                        ...data,
                                                        label: `${data.seal} -- ${data.name}`,
                                                        value: `${data.seal} -- ${data.name}`
                                                    }))}
                                                    value={{ label: documentPrepartion.seal, value: documentPrepartion.seal }}
                                                    onChange={(e) => {
                                                        setDocumentPrepartion({
                                                            ...documentPrepartion,
                                                            seal: e.value,
                                                        });
                                                        setSealId(e)
                                                        setSealPlacement(e?.document[0]?.preview)
                                                    }}
                                                />

                                            </FormControl>
                                        </Grid>
                                    </>}


                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                    checked={qrCodeNeed}
                                                    onChange={() => setQrCodeNeed((val) => !val)}
                                                    color="primary"
                                                />
                                            }
                                            label="QR Code"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>

                                </Grid>
                                <Grid item md={12} xs={12} sm={12}></Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        Generate
                                    </Button>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Document <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <div>
                                            {
                                                currentItemsPaySlip?.length > 0 && currentItemsPaySlip?.map((data, index) => {
                                                    const templateName = data?.template === "Template 1"
                                                        ? `hrdocuments/payslipone`
                                                        : data?.template === "Template 2" ? `hrdocuments/paysliptwo`
                                                            : data?.template === "Template 3" ? `hrdocuments/payslipthree` : `hrdocuments/payslipone`;

                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Grid container spacing={2} sx={{ display: "flex" }}>
                                                                <Grid item md={2} xs={12} sm={12}>
                                                                    <Typography>{data?.template}</Typography>
                                                                </Grid>
                                                                <Grid item md={3} xs={12} sm={12}>
                                                                    <Typography>{data?.companyname}</Typography>
                                                                </Grid>
                                                                <Grid item md={2} xs={12} sm={12}>
                                                                    <Typography>{data?.month}-{data?.year}</Typography>
                                                                </Grid>
                                                                <Grid item md={2} xs={12} sm={12}>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            const [first, second, third] = moment(new Date(data?.generateddate)).format("DD-MM-YYYY hh:mm a")?.split(" ")
                                                                            const vasr = `${first}_${second}_${third}`
                                                                            const url = `${BASE_URL}/${templateName}/${data?.month}/${data?.year}/${data?.userid}/${data?.sealid}/${data?.signatureid}/${data?.backgroundimageid}/${encryptString(data?.generatedby)}/${vasr}/${data?.qrcode}`;
                                                                            window.open(url, "_blank");
                                                                        }}>
                                                                        View Slip
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} sm={12} xs={12}>
                                                                    <Button
                                                                        sx={userStyle.buttondelete}
                                                                        onClick={() => HandleDeleteTodoIndex(index)}>
                                                                        <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                            <br />
                                                        </React.Fragment>
                                                    );
                                                })
                                            }

                                            {/* Pagination buttons */}
                                            {paySlipTodo?.length > 0 && <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                                <Button onClick={handlePreviousPaySlip} disabled={currentPagePaySlip === 1}>
                                                    Previous
                                                </Button>
                                                <span style={{ margin: "0 10px" }}> Page {currentPagePaySlip} of {totalPagesPaySlip} </span>
                                                <Button onClick={handleNextPaySlip} disabled={currentPagePaySlip === totalPagesPaySlip}>
                                                    Next
                                                </Button>
                                            </div>}
                                        </div>
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            {documentPrepartion.employeemode === "Manual" ?
                                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        {/* {checking ? ( */}
                                        <LoadingButton
                                            loading={buttonLoadingPreview}
                                            variant="contained"
                                            color="primary"
                                            sx={userStyle.buttonadd}
                                        // onClick={handlePreviewDocumentManual}
                                        >
                                            Preview
                                        </LoadingButton>
                                        {/* ) : ( */}
                                        {/* "" */}
                                        {/* )} */}
                                    </Grid>
                                    &ensp;
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        {/* {checking ? ( */}
                                        <LoadingButton
                                            loading={buttonLoading}
                                            variant="contained"
                                            color="primary"
                                            sx={userStyle.buttonadd}
                                        // onClick={getDownloadFile}
                                        // onClick={handlePrintDocumentManual}
                                        >
                                            Print
                                        </LoadingButton>
                                        {/* ) : ( */}
                                        {/* "" */}
                                        {/* )} */}
                                    </Grid>
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} variant="contained" color="primary" onClick={handleSubmitedManual}>
                                            Save
                                        </LoadingButton>
                                    </Grid>
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleclearedManual}>
                                            Clear
                                        </Button>
                                    </Grid>
                                </Grid>
                                :
                                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        {checkingArray?.length > 0 ? (
                                            <LoadingButton
                                                loading={buttonLoadingPreview}
                                                variant="contained"
                                                color="primary"
                                                sx={userStyle.buttonadd}
                                            // onClick={() => 
                                            //     // handlePreviewDocument(indexViewQuest - 1)
                                            // }
                                            >
                                                Preview
                                            </LoadingButton>
                                        ) : (
                                            ""
                                        )}
                                    </Grid>
                                    &ensp;
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        <LoadingButton loading={btnload}
                                            variant="contained"
                                            color="primary"
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={(e) => handleSubmited(e, indexViewQuest - 1)}>
                                            Save
                                        </LoadingButton>
                                    </Grid>
                                    <Grid item lg={1} md={2} sm={2} xs={12}>
                                        <Button sx={buttonStyles.btncancel} onClick={handlecleared}>
                                            Clear
                                        </Button>
                                    </Grid>
                                </Grid>}
                        </>
                    </Box>
                )}
            </>
            {/* } */}
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lpayslipdocumentpreparation") && (
                    <>
                        <Box sx={userStyle.container}>
                            <NotificationContainer />
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>List Pay Slip Preparation</Typography>
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
                                        {isUserRoleCompare?.includes("excelpayslipdocumentpreparation") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvpayslipdocumentpreparation") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printpayslipdocumentpreparation") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfpayslipdocumentpreparation") && (

                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagepayslipdocumentpreparation") && (

                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
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
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>
                            &ensp;
                            {isUserRoleCompare?.includes("bdpayslipdocumentpreparation") && (
                                <LoadingButton sx={buttonStyles.buttonbulkdelete} loading={deleteAll} variant="contained" color="error" onClick={handleClickOpenalert}>
                                    Bulk Delete
                                </LoadingButton>
                            )}
                            &ensp;
                            <Button variant="contained" color="error" onClick={
                                handleClickOpenBulkalert
                            }>
                                Bulk Email
                            </Button>
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
                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                        }}
                                    >

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
                                            // filteredDatas={items}
                                            totalDatas={totalProjects}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={items}


                                        />
                                        {/* <AggridTable
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
                                        />    */}
                                    </Box>
                                </>
                            }

                            {/* ****** Table End ****** */}
                            <br />
                            <br />
                            <br />
                            {/* {userRoles?.includes("MANAGER", "HIRINGMANAGER") && <DocumentsPrintedStatusList data={Changed} setData={setChanged} />} */}
                        </Box>
                    </>
                )
            }
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
                                            fetchBrandMaster();
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
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Template</TableCell>
                            <TableCell>PaySlip Month</TableCell>
                            <TableCell>PaySlip Year</TableCell>
                            <TableCell>Filter Type</TableCell>
                            <TableCell>Employee Status</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Persons</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.template}</TableCell>
                                    <TableCell>{row.productionmonth}</TableCell>
                                    <TableCell>{row.productionyear}</TableCell>
                                    <TableCell>{row.filtertype}</TableCell>
                                    <TableCell>{row.empstatus}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.person}</TableCell>
                                    <TableCell>{row.issuedpersondetails}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*DELETE ALERT DIALOG */}
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
                        sx={buttonStyles.btncancel}
                    >
                        Cancel
                    </Button>
                    <LoadingButton sx={buttonStyles.buttonsubmit} loading={deleteloading} variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
                        {" "}
                        OK{" "}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Box>
                <Dialog
                    open={isInfoOpenImage}
                    onClose={handleCloseInfoImage}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check Saving/Printing the Document whether it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImage} sx={buttonStyles.btncancel}>Cancel</Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} autoFocus variant="contained" color='primary'
                            onClick={(e) => sendRequest(e)}
                        > Submit </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isInfoOpenImageManual}
                    onClose={handleCloseInfoImageManual}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check while Saving/Printing the Document whether it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImageManual} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} autoFocus variant="contained" color='primary'
                        // onClick={(e) => sendRequestManual(e)}
                        > Submit </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isInfoOpenImagePrint}
                    onClose={handleCloseInfoImagePrint}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check while Saving/Printing the Document whether  it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImagePrint} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={buttonLoading} autoFocus variant="contained" color='primary'
                        //   onClick={(e) => downloadPdfTesdt(indexViewQuest - 1)}
                        > Download </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={previewManual}
                    onClose={handleClosePreviewManual}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            {`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`}
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePreviewManual} sx={userStyle.btncancel}>Change</Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={buttonLoading} autoFocus variant="contained" color='primary'
                        //   onClick={(e) => handleOpenPreviewManualfunc()}
                        > View </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isInfoOpenImagePrintManual}
                    onClose={handleCloseInfoImagePrintManual}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check while Saving/Printing the Document whether it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImagePrintManual} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
                        //   onClick={(e) => downloadPdfTesdtManual(e)}
                        > Download </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={openDialogManual}
                    onClose={handleCloseManualCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Manual User's List
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    {/* <Typography>{moment(documentPreparationEdit.date).format("DD-MM-YYYY")}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reference No</Typography>
                                    {/* <Typography>{documentPreparationEdit.referenceno}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template No</Typography>
                                    {/* <Typography>{documentPreparationEdit.templateno}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template</Typography>
                                    {/* <Typography>{documentPreparationEdit.template}</Typography> */}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseManualCheck} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton
                            loading={buttonLoading}
                            autoFocus
                            variant="contained"
                            color='primary'
                        // onClick={(e) => downloadPdfTesdt(e)}
                        > Download
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}
                sx={{ marginTop: "80px" }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            <b>View Pay Slip Preparation</b>
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(documentPreparationEdit.date).format("DD-MM-YYYY")}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template</Typography>
                                    <Typography>{documentPreparationEdit.template}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Month</Typography>
                                    <Typography>{documentPreparationEdit.productionmonth}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Year</Typography>
                                    <Typography>{documentPreparationEdit.productionyear}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{documentPreparationEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{documentPreparationEdit.filtertype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Status</Typography>
                                    <Typography>{documentPreparationEdit.empstatus}</Typography>
                                </FormControl>
                            </Grid>
                            {documentPreparationEdit.department?.length > 0 ? (
                                <>
                                    {" "}
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Department</Typography>
                                            <Typography>{documentPreparationEdit.department}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : (
                                ""
                            )}
                            {documentPreparationEdit?.branch?.length > 0 &&
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Branch</Typography>
                                        <Typography>{documentPreparationEdit.branch?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}</Typography>
                                    </FormControl>
                                </Grid>
                            }

                            {documentPreparationEdit?.unit?.length > 0 &&
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Unit</Typography>
                                        <Typography>{documentPreparationEdit.unit?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}</Typography>
                                    </FormControl>
                                </Grid>
                            }
                            {documentPreparationEdit?.team > 0 &&
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Team</Typography>
                                        <Typography>{documentPreparationEdit.team?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}</Typography>
                                    </FormControl>
                                </Grid>
                            }

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Person</Typography>
                                    <Typography>{documentPreparationEdit?.paySlipTodo?.map((t, i) => `${i + 1 + ". "}` + t?.companyname)
                                        .toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Choose Details</Typography>
                                    <Typography>{documentPreparationEdit?.choosedetails}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                checked={Boolean(documentPreparationEdit?.qrcodeneed)}
                                                color="primary"
                                            />
                                        }
                                        label="QR Code"
                                    />
                                </FormControl>
                            </Grid>
                            {!Boolean(documentPreparationEdit?.qrcodeneed) &&

                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Seal</Typography>
                                            <Typography>{documentPreparationEdit?.seal}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Signature</Typography>
                                            <Typography>{documentPreparationEdit?.signature}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            }
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                checked={Boolean(documentPreparationEdit.signatureSealNeed)}
                                                color="primary"
                                            />
                                        }
                                        label="Without Signature/Seal"
                                    />
                                </FormControl>
                            </Grid>

                            {!Boolean(documentPreparationEdit.signatureSealNeed) &&
                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Seal</Typography>
                                            <Typography>{documentPreparationEdit.seal}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Signature</Typography>
                                            <Typography>{documentPreparationEdit.signature}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>}



                        </Grid>
                        <br /> <br /> <br />
                        <br /> <br />
                        <br />
                        <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
                            <Button sx={buttonStyles.btncancel} variant="contained" color="primary" onClick={handleCloseview}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isDownloadOpen}
                    onClose={handleCloseDownloadoptions}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg" fullWidth={true}
                    sx={{ marginTop: "80px" }}
                >
                    <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                        <div>

                            {/* Info & Load More */}
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Showing {Math.min(visibleCount, stateRow.length)} of {stateRow.length} payslips
                                </Typography>

                                {visibleCount < stateRow.length && (
                                    <Button
                                        onClick={() => {
                                            setVisibleCount(prev => prev + 10);
                                            setLoadMoreDisabled(true);
                                            setTimeout(() => {
                                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                                setLoadMoreDisabled(false);
                                            }, 8000); // 5 seconds delay
                                        }}
                                        variant="outlined"
                                        color="primary"
                                        disabled={loadMoreDisabled}
                                        sx={{ px: 4, py: 1.5, borderRadius: '10px', fontWeight: 600 }}
                                    >
                                        {loadMoreDisabled ? "Loading..." : "Load More"}
                                    </Button>
                                )}
                            </Box>

                        </div>
                        <div>
                            {stateRow?.slice(0, visibleCount).map((dora, index) => {
                                const Component = dora?.template === "Template 1" ? Payslip : dora?.template === "Template 2" ? Paysliptemplatetwo : payslipthree;
                                return (
                                    <Component
                                        key={index}
                                        ref={el => payslipRef.current[index] = el}
                                        data={dora}
                                        index={index}
                                    />
                                );
                            })

                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDownloadoptions} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <LoadingButton loading={downloadAll} variant="contained" color="success" onClick={(e) => handleDownloadAll()}>
                            {" "}
                            Download All{" "}
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>



            {/* Bulk delete ALERT DIALOG */}
            <Dialog open={isDeleteBulkOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" color="error" onClick={handleCloseBulkModalert}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>


            <Box>
                <Dialog open={isDeleteOpenBulkcheckbox} onClose={handleCloseBulkModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg" fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                        <div>
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Showing {Math.min(emailVisibleCount, totalEmailFiles.length)} of {totalEmailFiles.length} payslips
                                </Typography>

                                {emailVisibleCount < totalEmailFiles.length && (
                                    <Button
                                        onClick={() => {
                                            setEmailVisibleCount(prev => prev + 10);
                                            setEmailLoadMoreDisabled(true);
                                            setTimeout(() => {
                                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                                setEmailLoadMoreDisabled(false);
                                            }, 8000); // Disable for 5 seconds
                                        }}
                                        variant="outlined"
                                        color="primary"
                                        disabled={emailLoadMoreDisabled}
                                        sx={{ px: 4, py: 1.5, borderRadius: '10px', fontWeight: 600 }}
                                    >
                                        {emailLoadMoreDisabled ? "Loading..." : "Load More"}
                                    </Button>
                                )}

                            </Box>
                        </div>

                        <div>
                            {totalEmailFiles?.slice(0, emailVisibleCount).map((dora, index) => {
                                const Component = dora?.template === "Template 1" ? Payslip : dora?.template === "Template 2" ? Paysliptemplatetwo : payslipthree;
                                return (
                                    <Component
                                        key={index}
                                        ref={el => payslipRef.current[index] = el}
                                        data={dora}
                                        index={index}
                                    />
                                );
                            })}
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseBulkModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <LoadingButton
                            loading={sendEmailAll}
                            variant="contained"
                            color="error"
                            onClick={handleSendEmailAll}
                        >
                            Email All
                        </LoadingButton>
                    </DialogActions>

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
                itemsTwo={templateCreationArrayExcel ?? []}
                filename={"Pay Slip Preparation"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Pay Slip Preparation Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box >
    );
}

export default PaySlipDocumentPreparation;