import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, TextareaAutosize, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../components/TableStyle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
function ApprovedLoan() {
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
    }
    const [loan, setLoan] = useState({
        loanamount: "",
        startyear: "Please Select Start Year",
        month: "Please Select Month",
        applieddate: "",
        tenure: "",
    });
    const [repaymentamount, setRepaymentAmount] = useState("")
    const [repaymentamountEdit, setRepaymentAmountEdit] = useState("")
    const [appliedLoanAmount, setAppliedLoanAmount] = useState('')
    const [appliedTenure, setAppliedTenure] = useState('')
    const [isBtn, setIsBtn] = useState(false)
    const [groupEdit, setGroupEdit] = useState({
        loanamount: "",
        startyear: "Please Select Start Year",
        month: "Please Select Month",
        applieddate: "",
        tenure: "",
    });
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allGroupEdit, setAllGroupEdit] = useState([]);
    const [groupCheck, setGroupCheck] = useState(false);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
    const [selectStatus, setSelectStatus] = useState({});
    const [interestState, setInterestState] = useState("Please Select Interest");
    const { auth } = useContext(AuthContext);
    const username = isUserRoleAccess.username;
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };
    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Approved Loan.png");
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
        loanamount: true,
        startyear: true,
        month: true,
        applieddate: true,
        tenure: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        empcode: true,
        companyname: true,
        employeename: true,
        shifttiming: true,
        status: true,
        createddatetime: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const [deleteGroup, setDeletegroup] = useState("");
    const rowData = async (id, loanamount) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LOAN_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletegroup(res?.data?.sloan);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // Alert delete popup
    let groupEditt = deleteGroup._id;
    const deleGroup = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.LOAN_SINGLE}/${groupEditt}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchAllGroup();
            handleCloseMod();
            handleCloseCheck();
            setPage(1);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const delGroupcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.LOAN_SINGLE}/${item}`, {
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
            await fetchAllGroup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //add function
    const sendRequest = async () => {
        setIsBtn(true)
        setPageName(!pageName)
        try {
            let grpcreate = await axios.post(SERVICE.LOAN_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                loanamount: String(loan.loanamount),
                startyear: String(loan.startyear),
                month: String(loan.month),
                applieddate: String(loan.applieddate),
                tenure: String(loan.tenure),
                company: String(isUserRoleAccess.company),
                branch: String(isUserRoleAccess.branch),
                unit: String(isUserRoleAccess.unit),
                team: String(isUserRoleAccess.team),
                empcode: String(isUserRoleAccess.empcode),
                companyname: String(isUserRoleAccess.companyname),
                shifttiming: String(isUserRoleAccess.shifttiming),
                status: String("Applied"),
                rejectedreason: String(""),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setLoan(grpcreate.data);
            await fetchAllGroup();
            setLoan({
                loanamount: "",
                startyear: "Please Select Start Year",
                month: "Please Select Month",
                applieddate: "",
                tenure: "",
            });
            setRepaymentAmount("")
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
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
    const getCode = async (e, loanamount) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LOAN_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpenEdit();
            setGroupEdit(res?.data?.sloan);
            setRepaymentAmountEdit(res?.data?.sloan?.repaymentamount);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LOAN_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setGroupEdit(res?.data?.sloan);
            setEmiTodo(res?.data?.sloan?.emitodo)
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LOAN_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setGroupEdit(res?.data?.sloan);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //Project updateby edit page...
    let updateby = groupEdit.updatedby;
    let addedby = groupEdit.addedby;
    let projectsid = groupEdit._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.LOAN_SINGLE}/${projectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                loanamount: String(groupEdit.loanamount),
                startyear: String(groupEdit.startyear),
                month: String(groupEdit.month),
                applieddate: String(groupEdit.applieddate),
                tenure: String(groupEdit.tenure),
                company: String(isUserRoleAccess.company),
                branch: String(isUserRoleAccess.branch),
                unit: String(isUserRoleAccess.unit),
                team: String(isUserRoleAccess.team),
                empcode: String(isUserRoleAccess.empcode),
                companyname: String(isUserRoleAccess.companyname),
                shifttiming: String(isUserRoleAccess.shifttiming),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllGroup(); fetchGroupAll();
            handleCloseModEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        fetchGroupAll();
        const isNameMatch = allGroupEdit.some((item) => item.loanamount.toLowerCase() === groupEdit.loanamount.toLowerCase());
        if (groupEdit.loanamount === "") {
            setPopupContentMalert("Please Enter Loan Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (groupEdit.loanamount === "") {
            setPopupContentMalert("Please Enter Loan Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (groupEdit.startyear === "Please Select Start Year") {
            setPopupContentMalert("Please Select Start Year");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (groupEdit.month === "Please Select Month") {
            setPopupContentMalert("Please Select Month");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (groupEdit.applieddate === "") {
            setPopupContentMalert("Please Enter Applied Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (groupEdit.tenure === "") {
            setPopupContentMalert("Please Enter Tenure(Month)");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Name already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };
    //get all project.
    const fetchAllGroup = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.post(SERVICE.LOANBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setGroupCheck(true);
            let groupcheck = res_grp?.data?.loan?.filter((item) => item.status === "Approved")
            setGroups(groupcheck.map((t, index) => ({
                ...t,
                applieddates: moment(t.applieddate).format("DD-MM-YYYY"),
                createddatetime: moment(t.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),

            })));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [approvedLoanArray, setApprovedLoanArray] = useState([])
    //get all project.
    const fetchAllApprovedLoanArray = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.post(SERVICE.LOANBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let approveone = res_grp?.data?.loan?.filter((item) => item.status === "Approved")
            setApprovedLoanArray(approveone?.map((t, index) => ({
                ...t,
                applieddates: moment(t.applieddate).format("DD-MM-YYYY"),
                createddatetime: moment(t.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
            })));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        fetchAllApprovedLoanArray()
    }, [isFilterOpen])
    //get all project.
    const fetchGroupAll = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.post(SERVICE.LOANBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllGroupEdit(res_grp?.data?.loan.filter((item) => item._id !== groupEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Approved Loan",
        pageStyle: "print",
    });
    useEffect(() => {
        fetchAllGroup();
        fetchGroupAll();
    }, []);
    useEffect(() => {
        fetchGroupAll();
    }, [isEditOpen, groupEdit]);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    const [items, setItems] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = groups?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber();
    }, [groups]);
    const [statusOpen, setStatusOpen] = useState(false);
    const handleStatusOpen = () => {
        setStatusOpen(true);
    };
    const handleStatusClose = () => {
        setStatusOpen(false);
    };
    let updatedByStatus = selectStatus.updatedby;
    const [emitodo, setEmiTodo] = useState([])
    const [totalPayableAmount, setTotalpayableamount] = useState(0)
    const sendCalculateLoan = async () => {
        const loanamount = selectStatus.loanamount;
        const tenure = selectStatus.tenure;
        const interestrate = interestState === "No" ? 0 : selectStatus.percentage;
        const monthlyInterestRate = interestrate * 0.01;
        const monthlyPayment = loanamount / tenure;
        let balance = Number(loanamount);
        let result = [];
        // Get starting month and year from selectStatus
        let startMonthIndex = monthOpt.findIndex(month => month.label === selectStatus.month);
        let year = selectStatus.startyear;
        let totalamountrepay = 0;
        // Loop through each month
        for (let month = 0; month < tenure; month++) {
            const currentMonthIndex = (startMonthIndex + month) % 12; // Wrap around to start month index if needed
            const currentMonth = monthOpt[currentMonthIndex].label;
            if (currentMonthIndex === 0 && month !== 0) { // Check for January to adjust year
                year++;
            }
            let totalloanamount = balance;
            const interest = balance * monthlyInterestRate;
            const payableAmount = monthlyPayment + interest;
            balance -= monthlyPayment;
            totalamountrepay += payableAmount
            result.push({
                year: year,
                months: currentMonth,
                loanamount: totalloanamount,
                repaymentprincipalamount: monthlyPayment,
                repaymentintrestamount: interest,
                balance: balance.toFixed(2),
                payableAmount: payableAmount.toFixed(2)
            });
        }
        setTotalpayableamount(totalamountrepay)
        setEmiTodo(result);
    };
    const sendEditStatus = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.LOAN_SINGLE}/${selectStatus._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String(selectStatus.status),
                rejectedreason: String(selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""),
                emitodo: emitodo,
                approvedloanstartdate: String(selectStatus.startdate),
                approvedinstallment: String(selectStatus.tenure),
                actionby: String(isUserRoleAccess.companyname),
                updatedby: [
                    ...updatedByStatus,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllGroup();
            setSelectStatus({});
            handleStatusClose();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const getinfoCodeStatus = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LOAN_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSelectStatus(res?.data?.sloan);
            setAppliedLoanAmount(res?.data?.sloan?.loanamount)
            setAppliedTenure(res?.data?.sloan?.tenure)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const generateEmi = () => {
        if (selectStatus.status == "Approved") {
            if (selectStatus.loanamount == "") {
                setPopupContentMalert("Please Enter Loan Amount");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (interestState == "Please Select Interest") {
                setPopupContentMalert("Please Select Interest");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (interestState == "Yes" && selectStatus.percentage == "" || selectStatus.percentage == undefined) {
                setPopupContentMalert("Please Enter Percentage");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectStatus.tenure == "") {
                setPopupContentMalert("Please Enter Tenure(Month)");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectStatus.month == "Please Select Month") {
                setPopupContentMalert("Please Select Month");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendCalculateLoan();
            }
        } else {
            sendCalculateLoan();
        }
    };
    const editStatus = () => {
        if (selectStatus.status == "Rejected") {
            if (selectStatus.rejectedreason == "") {
                setPopupContentMalert("Please Enter Rejected Reason");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                sendEditStatus();
            }
        } else if (selectStatus.status == "Approved") {
            if (selectStatus.loanamount == "") {
                setPopupContentMalert("Please Enter Loan Amount");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (interestState == "Please Select Interest") {
                setPopupContentMalert("Please Select Interest");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (interestState == "Yes" && selectStatus.percentage == "" || selectStatus.percentage == undefined) {
                setPopupContentMalert("Please Enter Percentage");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectStatus.tenure == "") {
                setPopupContentMalert("Please Enter Tenure(Month)");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectStatus.startdate == "") {
                setPopupContentMalert("Please Select Start Date");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditStatus();
            }
        } else {
            sendEditStatus();
        }
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
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
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
            headerName: "Checkbox", // Default header loanamount
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
        { field: "loanamount", headerName: "Loan Amount", flex: 0, width: 150, hide: !columnVisibility.loanamount, headerClassName: "bold-header" },
        { field: "startyear", headerName: "Start Year", flex: 0, width: 150, hide: !columnVisibility.startyear, headerClassName: "bold-header" },
        { field: "month", headerName: "Month", flex: 0, width: 150, hide: !columnVisibility.month, headerClassName: "bold-header" },
        { field: "applieddate", headerName: "Applied Date", flex: 0, width: 150, hide: !columnVisibility.applieddate, headerClassName: "bold-header" },
        { field: "tenure", headerName: "Tenure", flex: 0, width: 150, hide: !columnVisibility.tenure, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee", flex: 0, width: 130, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "shifttiming", headerName: "Shift Time", flex: 0, width: 100, hide: !columnVisibility.shifttiming, headerClassName: "bold-header" },
        { field: "createddatetime", headerName: "Created Date/Time", flex: 0, width: 230, hide: !columnVisibility.createddatetime, headerClassName: "bold-header" },
        { field: "companyname", headerName: "Approved By", flex: 0, width: 130, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 90,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            renderCell: (params) => {
                if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && !["Approved", "Rejected"].includes(params.row.status)) {
                    return (
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                                    fontSize: "10px",
                                    width: "60px",
                                    fontWeight: "bold",
                                }}
                            >
                                {params.value}
                            </Button>
                        </Grid>
                    );
                } else {
                    return (
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                                    fontSize: "10px",
                                    width: "60px",
                                    fontWeight: "bold",
                                }}
                            >
                                {params.value}
                            </Button>
                        </Grid>
                    );
                }
            },
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
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vloan") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredData.map((item, index) => {
        console.log(item)
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            serialNumber: item.serialNumber,
            loanamount: item.loanamount,
            startyear: item.startyear,
            month: item.month,
            applieddate: moment(item.applieddate).format("DD-MM-YYYY"),
            tenure: item.tenure,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            employeename: item.employeename,
            companyname: item.companyname,
            shifttiming: item.shifttiming,
            status: item.status,
            createddatetime: item.createddatetime,

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
    const interestOpt = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]
    function calculateMonthlyPayment() {
        const monthlyInterestRate = loan.percentage / 100 / 12;
        let monthlyPayment = loan.loanamount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loan.tenure)));
        // const monthlyPayment = (loan.loanamount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loan.tenure));
        setRepaymentAmount(Math.round(monthlyPayment))
    }
    function calculateMonthlyPaymentEdit() {
        const monthlyInterestRate = groupEdit.percentage / 100 / 12;
        let monthlyPayment = groupEdit.loanamount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -groupEdit.tenure)));
        // const monthlyPayment = (loan.loanamount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loan.tenure));
        setRepaymentAmountEdit(Math.round(monthlyPayment))
    }
    // Get the current year
    const currentYear = new Date().getFullYear();
    let startyearOpt = [];
    for (let i = 0; i <= 10; i++) {
        const year = currentYear + i;
        startyearOpt.push({ label: year.toString(), value: year });
    }
    const monthOpt = [
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
        { label: "December", value: "December" },
    ]
    const [selectedMont, setSelectMonth] = useState([
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
        { label: "December", value: "December" },
    ])
    const handleYearChange = (selectedYear) => {
        const year = selectedYear.value;
        let updatedMonthOpt;
        if (year === currentYear) {
            updatedMonthOpt = monthOpt.slice(new Date().getMonth());
        } else {
            updatedMonthOpt = monthOpt;
        }
        setSelectMonth(updatedMonthOpt)
        setSelectStatus({
            ...selectStatus,
            startyear: year,
            month: "Please Select Month"
        });
    };
    const [fileFormat, setFormat] = useState('')
    let exportColumnNames = ["Loan Amount", "Start Year", "Month", "Applied Date", "Tenure", "Company", "Branch", "Unit", "Team", "Emp Code", "Employee", "Shift Time", "Description", "Created Date/Time", "Approved By"];
    let exportRowValues = ["loanamount", "startyear", "month", "applieddates", "tenure", "company", "branch", "unit", "team", "empcode", "employeename", "shifttiming", "description", "createddatetime", "companyname"];
    return (
        <Box>
            <Headtitle title={"Approved Loan"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Approved Loan"
                modulename="PayRoll"
                submodulename="Loan & Advance"
                mainpagename="Approved Loan"
                subpagename=""
                subsubpagename=""
            />
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="md"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Loan</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Loan Amount <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Loan Amount"
                                                value={groupEdit.loanamount}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value
                                                        .replace(/\D/g, "")
                                                    //   .slice(0, 2);
                                                    if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                                        setGroupEdit({
                                                            ...groupEdit,
                                                            loanamount: enteredValue,
                                                            percentage: "",
                                                            tenure: "",
                                                        });
                                                    }
                                                    setRepaymentAmountEdit("")
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Start Year<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                styles={colourStyles}
                                                options={startyearOpt}
                                                value={{ label: groupEdit.startyear, value: groupEdit.startyear }}
                                                onChange={(e) => {
                                                    setGroupEdit({
                                                        ...groupEdit,
                                                        startyear: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Month<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                styles={colourStyles}
                                                options={monthOpt}
                                                value={{ label: groupEdit.month, value: groupEdit.month }}
                                                onChange={(e) => {
                                                    setGroupEdit({
                                                        ...groupEdit,
                                                        month: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Applied Date <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={groupEdit.applieddate}
                                                onChange={(e) => {
                                                    setGroupEdit({
                                                        ...groupEdit,
                                                        applieddate: e.target.value
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Tenure(Month) <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Tenure in Month"
                                                value={groupEdit.tenure}
                                                onChange={(e) => {
                                                    let enteredValue = e.target.value.replace(/\D/g, "").slice(0, 2);
                                                    // Check if enteredValue is empty or a number less than or equal to 60
                                                    if (enteredValue === "" || (enteredValue !== "0" && /^\d+$/.test(enteredValue) && parseInt(enteredValue) <= 60)) {
                                                        setGroupEdit({
                                                            ...groupEdit,
                                                            tenure: enteredValue,
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                padding: "7px 13px",
                                                color: "white",
                                                background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={editSubmit}
                                        >
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                                {/* </DialogContent> */}
                            </form>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lapprovedloan") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Approved Loan List</Typography>
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
                                        {/* <MenuItem value={groups?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelapprovedloan") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAllApprovedLoanArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvapprovedloan") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAllApprovedLoanArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printapprovedloan") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfapprovedloan") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchAllApprovedLoanArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageapprovedloan") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                                            </Button>
                                        </>
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
                        {!groupCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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

            {/* view model */}
            <Dialog open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Grid container spacing={2}  >
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}> View Loan</Typography>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography variant="h6">Employee Name : {groupEdit.employeename}</Typography>
                                <Typography variant="h6">
                                    Emp ID : {groupEdit.empcode}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container sx={{ display: "flex" }} spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}> Loan Amount :</Typography>
                                        <Typography>{groupEdit.loanamount}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}>Start Year : </Typography>
                                        <Typography>{groupEdit.startyear}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}> Month :</Typography>
                                        <Typography>{groupEdit.month}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}> Tenure(Month) : </Typography>
                                        <Typography>{groupEdit.tenure}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}> Applied Date :</Typography>
                                        <Typography>{moment(groupEdit.applieddate).format("DD-MM-YYYY")}</Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}>Approved Loan Amount :</Typography>
                                        <Typography>{groupEdit.approvedloanamount}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText} variant="h6">Approved Start Year : </Typography>
                                        <Typography>{groupEdit.approvedstartyear}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12} >
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}>Approved Month : </Typography>
                                        <Typography>{groupEdit.approvedstartmonth}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}>Approved Installment :</Typography>
                                        <Typography>{groupEdit.approvedinstallment}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}> Interest(%) : </Typography>
                                        <Typography>{groupEdit.interestpercent}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography sx={userStyle.SubHeaderText}> Approved Start Date : </Typography>
                                        <Typography>{moment(groupEdit.approvedloanstartdate).format("DD-MM-YYYY")}</Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Typography variant="h6"> TOTAL PAYABLE AMOUNT : </Typography>
                                    <Typography variant="h6">{Number(groupEdit.totalamountpayable).toFixed(2)}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <TableContainer component={Paper}>
                                    <Table
                                        sx={{ minWidth: 700 }}
                                        aria-label="customized table"
                                        id="usertable"
                                    >
                                        <TableHead sx={{ fontWeight: "400" }}>
                                            <StyledTableRow>
                                                {/* <StyledTableCell>SNo</StyledTableCell>
                                                        <StyledTableCell>Year</StyledTableCell> */}
                                                <StyledTableCell>S.No</StyledTableCell>
                                                <StyledTableCell>Month</StyledTableCell>
                                                <StyledTableCell>Year</StyledTableCell>
                                                <StyledTableCell>Loan Amount</StyledTableCell>
                                                {/* <StyledTableCell>Total Repayment Amount</StyledTableCell> */}
                                                <StyledTableCell>Repayment Principal Amount</StyledTableCell>
                                                <StyledTableCell>Repayment Interest Amount</StyledTableCell>
                                                <StyledTableCell>Total Repayment Amount</StyledTableCell>
                                                <StyledTableCell>Balance Amount</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">
                                            {emitodo?.length > 0 ? (
                                                emitodo?.map((row, index) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                                        <StyledTableCell>{row.months}</StyledTableCell>
                                                        <StyledTableCell>{row.year}</StyledTableCell>
                                                        <StyledTableCell>{row.loanamount}</StyledTableCell>
                                                        {/* <StyledTableCell>{row.totalrepaymentamount}</StyledTableCell> */}
                                                        <StyledTableCell>{row.repaymentprincipalamount}</StyledTableCell>
                                                        <StyledTableCell>{row.repaymentintrestamount}</StyledTableCell>
                                                        <StyledTableCell>{row.payableAmount}</StyledTableCell>
                                                        <StyledTableCell>{row.balance}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            ) : (
                                                <StyledTableRow>
                                                    {" "}
                                                    <StyledTableCell colSpan={8} align="center">
                                                        No Data Available
                                                    </StyledTableCell>{" "}
                                                </StyledTableRow>
                                            )}
                                            <StyledTableRow></StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
            {/* Reason of Leaving  */}
            <Dialog open={openviewalert} onClose={handleClickOpenviewalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Name</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6"></Typography>
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                            />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={handleCloseviewalert}>
                                    Save
                                </Button>
                            </Grid>
                            <Grid item md={0.2} xs={12} sm={12}></Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={handleCloseviewalert}>
                                    {" "}
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* dialog status change */}
            <Box>
                <Dialog maxWidth="lg" fullWidth={true}
                    open={statusOpen} onClose={handleStatusClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            padding: "30px 50px",
                            overflow: "visible",
                            "& .MuiPaper-root": {
                                overflow: "visible",
                            },
                        }}
                    >
                        <Grid container spacing={2}>
                            {selectStatus.status !== "Approved" &&
                                <>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Approved Loan Status</Typography>
                                    </Grid>
                                </>
                            }
                            <Grid item md={6} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Status<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        fullWidth
                                        options={[
                                            { label: "Approved", value: "Approved" },
                                            { label: "Rejected", value: "Rejected" },
                                            { label: "Applied", value: "Applied" },
                                        ]}
                                        value={{ label: selectStatus.status, value: selectStatus.value }}
                                        onChange={(e) => {
                                            setSelectStatus({
                                                ...selectStatus,
                                                status: e.value,
                                                rejectedreason: ""
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12}>
                                {selectStatus.status == "Rejected" ? (
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Reason for Rejected<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={selectStatus.rejectedreason}
                                            onChange={(e) => {
                                                setSelectStatus({ ...selectStatus, rejectedreason: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                ) : null}
                            </Grid>
                            {selectStatus.status == "Approved" ?
                                <>
                                    <Grid item md={3} xs={6} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Applied Loan  <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Loan Amount"
                                                value={appliedLoanAmount}
                                                readOnly={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={6} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Approved Loan  <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Loan Amount"
                                                value={selectStatus.loanamount}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                                                    if (enteredValue === "" ||
                                                        (enteredValue !== "0" &&
                                                            /^\d+$/.test(enteredValue) &&
                                                            parseInt(enteredValue) <= parseInt(appliedLoanAmount))// Don't accept greater than appliedLoanAmount
                                                    ) {
                                                        setSelectStatus({
                                                            ...selectStatus,
                                                            loanamount: enteredValue,
                                                        });
                                                        setEmiTodo([]);
                                                        setTotalpayableamount(0)
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Interest(%)<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                fullWidth
                                                options={[
                                                    { label: "Yes", value: "Yes" },
                                                    { label: "No", value: "No" },
                                                ]}
                                                value={{ label: interestState, value: interestState }}
                                                onChange={(e) => {
                                                    setInterestState(
                                                        e.value,
                                                    );
                                                    setSelectStatus({
                                                        ...selectStatus,
                                                        percentage: "",
                                                    });
                                                    setEmiTodo([])
                                                    setTotalpayableamount(0)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {interestState === "Yes" ? <>
                                        <Grid item md={3} xs={6} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Percentage <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Percentage"
                                                    value={selectStatus.percentage}
                                                    onChange={(e) => {
                                                        const enteredValue = e.target.value
                                                            .replace(/\D/g, "")
                                                        //   .slice(0, 2);
                                                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                                            setSelectStatus({
                                                                ...selectStatus,
                                                                percentage: enteredValue,
                                                            });
                                                            setEmiTodo([])
                                                            setTotalpayableamount(0)
                                                        }
                                                        // setRepaymentAmount("")
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </> : null}
                                    <Grid item md={3} xs={6} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Tenure(Month) <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Tenure in Month"
                                                value={appliedTenure}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={6} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Start Date  <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={selectStatus.startdate}
                                                onChange={((e) => {
                                                    setSelectStatus({
                                                        ...selectStatus,
                                                        startdate: e.target.value,
                                                    });
                                                })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={6} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Approved Installment  <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Installment"
                                                value={selectStatus.tenure}
                                                onChange={(e) => {
                                                    let enteredValue = e.target.value.replace(/\D/g, "").slice(0, 2);
                                                    if ((enteredValue === "" || enteredValue !== "0" && parseInt(enteredValue) <= 60)) {
                                                        setSelectStatus({
                                                            ...selectStatus,
                                                            tenure: enteredValue,
                                                        });
                                                        setEmiTodo([])
                                                        setTotalpayableamount(0)
                                                        // calculateMonthlyPayment();
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={6} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Start Year<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                styles={colourStyles}
                                                options={startyearOpt}
                                                value={{ label: selectStatus.startyear, value: selectStatus.startyear }}
                                                onChange={handleYearChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Start Month<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                styles={colourStyles}
                                                options={selectedMont}
                                                value={{ label: selectStatus.month, value: selectStatus.month }}
                                                onChange={(selectedMonth) => {
                                                    setSelectStatus({
                                                        ...selectStatus,
                                                        month: selectedMonth.value
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <TableContainer component={Paper}>
                                            <Table
                                                sx={{ minWidth: 500 }}
                                                aria-label="customized table"
                                                id="usertable"
                                            >
                                                <TableHead sx={{ fontWeight: "400" }}>
                                                    <StyledTableRow>
                                                        {/* <StyledTableCell>SNo</StyledTableCell>
                                                        <StyledTableCell>Year</StyledTableCell> */}
                                                        <StyledTableCell>S.No</StyledTableCell>
                                                        <StyledTableCell>Month</StyledTableCell>
                                                        <StyledTableCell>Year</StyledTableCell>
                                                        <StyledTableCell>Loan Amount</StyledTableCell>
                                                        {/* <StyledTableCell>Total Repayment Amount</StyledTableCell> */}
                                                        <StyledTableCell>Repayment Principal Amount</StyledTableCell>
                                                        <StyledTableCell>Repayment Interest Amount</StyledTableCell>
                                                        <StyledTableCell>Total Repayment Amount</StyledTableCell>
                                                        <StyledTableCell>Balance Amount</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody align="left">
                                                    {emitodo?.length > 0 ? (
                                                        emitodo?.map((row, index) => (
                                                            <StyledTableRow>
                                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                                <StyledTableCell>{row.months}</StyledTableCell>
                                                                <StyledTableCell>{row.year}</StyledTableCell>
                                                                <StyledTableCell>{row.loanamount}</StyledTableCell>
                                                                {/* <StyledTableCell>{row.totalrepaymentamount}</StyledTableCell> */}
                                                                <StyledTableCell>{row.repaymentprincipalamount}</StyledTableCell>
                                                                <StyledTableCell>{row.repaymentintrestamount}</StyledTableCell>
                                                                <StyledTableCell>{row.payableAmount}</StyledTableCell>
                                                                <StyledTableCell>{row.balance}</StyledTableCell>
                                                            </StyledTableRow>
                                                        ))
                                                    ) : (
                                                        <StyledTableRow>
                                                            {" "}
                                                            <StyledTableCell colSpan={8} align="center">
                                                                No Data Available
                                                            </StyledTableCell>{" "}
                                                        </StyledTableRow>
                                                    )}
                                                    <StyledTableRow></StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Typography variant="h6">Total Payable Amount: {totalPayableAmount}</Typography>
                                    </Grid>
                                </> : null
                            }
                        </Grid>
                    </DialogContent>
                    {selectStatus.status == "Rejected" ? <br /> : null}
                    <DialogActions>
                        {selectStatus.status == "Approved" && emitodo.length === 0 ?
                            <>
                                <Button
                                    variant="contained"
                                    style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
                                    onClick={() => {
                                        generateEmi();
                                        // handleCloseerrpop();
                                    }}
                                >
                                    Generate
                                </Button>
                                <Button
                                    variant="contained"
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
                                    onClick={() => {
                                        setEmiTodo([])
                                        setTotalpayableamount(0)
                                    }}
                                >
                                    Clear
                                </Button>
                            </>
                            :
                            <Button
                                variant="contained"
                                style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
                                onClick={() => {
                                    editStatus();
                                    // handleCloseerrpop();
                                }}
                            >
                                Update
                            </Button>
                        }
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
                            onClick={() => {
                                handleStatusClose();
                                setSelectStatus({});
                                setEmiTodo([])
                                setTotalpayableamount(0)
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredData ?? []}
                itemsTwo={approvedLoanArray ?? []}
                filename={"Approved Loan"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}
export default ApprovedLoan;