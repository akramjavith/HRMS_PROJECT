import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormGroup,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
    Typography
} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiInput from "@mui/material/Input";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from "@mui/material/Switch";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from "@mui/system";
import axios from "axios";
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import StyledDataGrid from "../../../components/TableStyle";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import ScheduleMeetingNoticePeriod from "../noticeperiod/ScheduleInterview";
import Webcamimage from "../webcamprofile";

import UndoIcon from '@mui/icons-material/Undo';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import PageHeading from "../../../components/PageHeading";
import { BASE_URL } from "../../../services/Authservice";

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

const Input = styled(MuiInput)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none !important",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));



function Exitlist() {

    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    const [roundmasterEdit, setRoundmasterEdit] = useState({});

    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);

    };

    const setViewData = (datas) => {
        setRoundmasterEdit(datas);
        handleClickOpenview();
    }

    // Convert data URI to Blob
    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleViewImageSubEdit = (data) => {
        const blob = dataURItoBlob(data.uploadedimage);
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    };


    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');

    const gridRef = useRef(null);
    const gridRef1 = useRef(null);
    const [vendorAuto, setVendorAuto] = useState("");

    useEffect(() => {
        fetchNoticeperiodlist();
        // fetchNoticeperiodlistArray();
    }, [vendorAuto]);

    const [employees, setEmployees] = useState([]);
    const [employeeApproved, setemployeeApproved] = useState([]);
    const [pageApproved, setPageApproved] = useState(1);
    const [pageSizeApproved, setPageApprovedSize] = useState(10);
    const [fileApproved, setFileApproved] = useState("");

    // const [selectedbranch, setselectedbranch] = useState([]);
    const [exceldataApproved, setexceldataApproved] = useState([]);

    const [isBoardingApproved, setIsBoardingApproved] = useState(false);

    // let username = isUserRoleAccess.name
    // const id = useParams().id
    const { isUserRoleAccess, isUserRoleCompare, allUsersData, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth, setAuth } = useContext(AuthContext);
    const [file, setFile] = useState("");
    const [noticePeriod, setNoticeperiod] = useState("");

    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    // const [selectedbranch, setselectedbranch] = useState([]);
    const [exceldata, setexceldata] = useState([]);

    const [isBoarding, setIsBoarding] = useState(false);

    const id = useParams().id;

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    //alert model for schedule meeting
    const [openMeetingPopup, setOpenMeetingPopup] = useState(false);
    const [meetingValues, setMeetingValues] = useState([]);

    const handleClickOpenMeetingPopup = (
        company,
        branch,
        team,
        department,
        empname,
        noticeperiodid,
        username,
        password,
        fromDate,
        toDate,
        testname,
        interviewcategory,
        interviewtype,
        venue,
        interviewmode,
        branchvenue,
        floorvenue,
        link,
        date,
        time,
        interviewer
    ) => {
        setOpenMeetingPopup(true);
        setMeetingValues([
            company,
            branch,
            team,
            department,
            empname,
            noticeperiodid,
            username,
            password,
            fromDate,
            toDate,
            testname,
            interviewcategory,
            interviewtype,
            venue,
            interviewmode,
            branchvenue,
            floorvenue,
            link,
            date,
            time,
            interviewer
        ]);
    };

    const handleClickCloseMeetingPopup = () => {
        setOpenMeetingPopup(false);
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


    const [isFilterOpen2, setIsFilterOpen2] = useState(false);

    //alert model for view schedule meeting
    const [openMeetingViewPopup, setOpenMeetingViewPopup] = useState(false);
    const [meetingData, setMeetingData] = useState(false);


    const handleClickCloseMeetingViewPopup = () => {
        setOpenMeetingViewPopup(false);
    };

    // get single row to view....


    const handleCaptureImageApproved = () => {
        if (gridRef1.current) {
            html2canvas(gridRef1.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Exit List.png");
                });
            });
        }
    };

    // clipboard
    const [copiedDataApproved, setCopiedDataApproved] = useState("");

    // State for manage columns search query
    const [searchQueryManageApproved, setSearchQueryManageApproved] =
        useState("");
    // Manage Columns
    const [isManageColumnsOpenApproved, setManageColumnsOpenApproved] =
        useState(false);
    const [anchorElApproved, setAnchorElApproved] = useState(null);
    const handleOpenManageColumnsApproved = (event) => {
        setAnchorElApproved(event.currentTarget);
        setManageColumnsOpenApproved(true);
    };
    const handleCloseManageColumnsApproved = () => {
        setManageColumnsOpenApproved(false);
        setSearchQueryManageApproved("");
    };

    const openApproved = Boolean(anchorElApproved);
    const idApproved = openApproved ? "simple-popover" : undefined;

    const [selectedRowsApproved, setSelectedRowsApproved] = useState([]);

    // State for manage columns search query
    const [searchQueryManage, setSearchQueryManage] = useState("");

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

    const open = Boolean(anchorEl);
    const ids = open ? "simple-popover" : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        checkbox: true,
        actions: true,
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        empname: true,
        empcode: true,
        department: true,
        noticedate: true,
        reasonleavingname: true,
        status: true,
        team: true,
        files: true,
        releasedate: true,
        approved: true,
        requestdate: true,
        reject: true,
        recheck: true,
        cancel: true,
        continue: true,
        upload: true,
        requestdatereason: true,
        scheduleinterview: true,
        viewstatus: true,
        username: true,
        password: true,
        scheduledat: true

    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setLoading(false);
        setBtnSubmit(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //get all employees list details
    const fetchNoticeperiodlist = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let ans = res?.data?.noticeperiodapply.filter(
                (data) =>
                    data.approvedStatus != "true" &&
                    data.recheckStatus != "true" &&
                    data.rejectStatus != "true"
            );

            setIsBoarding(true);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [employeesfilterArray, setEmployeesfilterArray] = useState([])

    const fetchNoticeperiodlistArray = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
                assignbranch: isAssignBranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let ans = res?.data?.noticeperiodapply.filter(
                (data) =>
                    data.approvedStatus != "true" &&
                    data.recheckStatus != "true" &&
                    data.rejectStatus != "true"
            );
            setIsBoarding(true);
            setEmployeesfilterArray(ans);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useState(() => {
        fetchNoticeperiodlistArray()
    }, [isFilterOpen, vendorAuto])


    //------------------------------------------------------

    const [fileFormat, setFormat] = useState("xl");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName);
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,

                "Username": item.username || '',
                "Password": item.password || '',
                "Interview Link": item.roundlink || '',
                "Scheduled At": item.scheduledat || '',
                "Name": item.empname || '',
                "Company": item.company || '',
                "Branch": item.branch || '',
                "Unit": item.unit || '',
                Empcode: item.empcode || '',
                "Team": item.team || '',

                "Department": item.department || '',

                "Reason": item.reasonleavingname || '',
                "Approved Through": item.approvedthrough || '',
                "Status": item.status || '',


            };
        });
    };

    const handleExportXL = (isfilter) => {

        const dataToExport = isfilter === "filtered" ? filteredDataApproved : itemsApproved;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(formatData(dataToExport), 'Exit List');
        setIsFilterOpen(false);
    };




    //  PDF
    // pdf.....
    const columns = [
        { title: "Username", field: "username" },
        { title: "Password", field: "password" },
        { title: "Interview Link", field: "roundlink" },
        { title: "Schduled At", field: "scheduledat" },

        { title: "Name", field: "empname" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },

        { title: "Empcode", field: "empcode" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: "Reason", field: "reasonleavingname" },
        { title: "Approved Through", field: "approvedthrough" },
        { title: "Status", field: "status" },

    ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredDataApproved.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,


                }))
                : itemsApproved?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("Exit List.pdf");
    };




    //print...
    const componentRef = useRef();

    useEffect(() => {
        fetchNoticeperiodlist();
    }, []);

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {

        const itemsWithSerialNumber = employees?.map((item, index) => {
            return {
                ...item,
                serialNumber: index + 1,
            };
        });
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [employees]);

    //datatable....
    const [searchQuery, setSearchQuery] = useState("");

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

    const totalPages = Math.ceil(employees.length / pageSize);

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

    // Calculate the DataGrid height based on the number of row

    const renderFilePreviewApproved = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const initialColumnVisibilityApproved = {
        checkbox: true,
        actions: true,
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        empname: true,
        empcode: true,
        department: true,
        date: true,
        reason: true,
        document: true,
        status: true,
        approvedthrough: true,
        reasonleavingname: true,
        releasedate: true,
        files: true,
        cancel: true,
        continue: true,
        scheduleinterview: true,
        viewstatus: true,
        username: true,
        password: true,
        roundlink: true,
        scheduledat: true,
        viewstatusnew: true,
    };

    // Show all columns
    const [columnVisibilityApproved, setColumnVisibilityApproved] = useState(
        initialColumnVisibilityApproved
    );

    const [employeeApprovedFilterArray, setemployeeApprovedFilterArray] = useState([])



    useEffect(() => {

    }, [isFilterOpen2])

    // Error Popup model
    const [isErrorOpenApproved, setIsErrorOpenApproved] = useState(false);
    const [setShowAlertApproved] = useState();
    const handleClickOpenerrApproved = () => {
        setIsErrorOpenApproved(true);
    };

    //print...
    const componentRefApproved = useRef();
    const handleprintApproved = useReactToPrint({
        content: () => componentRefApproved.current,
        documentTitle: "Exit List",
        pageStyle: "print",
    });

    //table entries ..,.
    const [itemsApproved, setItemsApproved] = useState([]);

    const addSerialNumberApproved = () => {

        const itemsWithSerialNumber = employeeApproved?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            empname: item.empname,
            empcode: item.empcode,
            team: item.team,
            department: item.department,
            noticedate: item.noticedate,
            reasonleavingname: item.reasonleavingname,
            status: "Approved",
            exitstatus: item.exitstatus,
            approvedthrough: item.approvedthrough,
            username: item.username,
            password: item.password,
            interviewscheduled: item.interviewscheduled,
            interviewForm: item.interviewForm,
            confirmationstatus: item.confirmationstatus,
            approvenoticereq: item.approvenoticereq,
            updatedby: item.updatedby,
            roundlink: `${BASE_URL}/interview/exitinterview/${item._id}/${item.testname}`,
            scheduledat: item?.date && item?.time ? `${item?.date}/${item?.time}` : "",

            testname: item.testname ? item.testname : "",
            interviewcategory: item.interviewcategory ? item.interviewcategory : "",
            interviewtype: item.interviewtype ? item.interviewtype : "",
            venue: item.venue ? item.venue : "",
            interviewmode: item.interviewmode ? item.interviewmode : "",
            branchvenue: item.branchvenue ? item.branchvenue : "",
            floorvenue: item.floorvenue ? item.floorvenue : "",
            link: item.link ? item.link : "",
            date: item.date ? item.date : "",
            time: item.time ? item.time : "",
            interviewer: item.interviewer ? item.interviewer : "",
        }));
        setItemsApproved(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberApproved();
    }, [employeeApproved]);

    //table sorting
    const [sortingApproved, setSortingApproved] = useState({
        column: "",
        direction: "",
    });

    itemsApproved.sort((a, b) => {
        if (sortingApproved.direction === "asc") {
            return a[sortingApproved.column] > b[sortingApproved.column] ? 1 : -1;
        } else if (sortingApproved.direction === "desc") {
            return a[sortingApproved.column] < b[sortingApproved.column] ? 1 : -1;
        }
        return 0;
    });


    //Datatable
    const handlePageChangeApproved = (newPage) => {
        setPageApproved(newPage);
    };

    const handlePageSizeChangeApproved = (event) => {
        setPageApprovedSize(Number(event.target.value));
        setPageApproved(1);
    };

    //datatable....
    const [searchQueryApproved, setSearchQueryApproved] = useState("");
    const handleSearchChangeApproved = (event) => {
        setSearchQueryApproved(event.target.value);
    };

    // Split the search query into individual terms
    const searchTermsApproved = searchQueryApproved.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasApproved = itemsApproved?.filter((item) => {
        return searchTermsApproved.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataApproved = filteredDatasApproved.slice(
        (pageApproved - 1) * pageSizeApproved,
        pageApproved * pageSizeApproved
    );

    const totalPagesApproved = Math.ceil(
        employeeApproved.length / pageSizeApproved
    );

    const visiblePagesApproved = Math.min(totalPagesApproved, 3);

    const firstVisiblePageApproved = Math.max(1, pageApproved - 1);
    const lastVisiblePageApproved = Math.min(
        firstVisiblePageApproved + visiblePagesApproved - 1,
        totalPagesApproved
    );

    const pageNumbersApproved = [];

    for (let i = firstVisiblePageApproved; i <= lastVisiblePageApproved; i++) {
        pageNumbersApproved.push(i);
    }

    const [selectAllCheckedApproved, setSelectAllCheckedApproved] =
        useState(false);

    const CheckboxHeaderApproved = ({
        selectAllCheckedApproved,
        onSelectAll,
    }) => (
        <div>
            <Checkbox checked={selectAllCheckedApproved} onChange={onSelectAll} />
        </div>

    );


    const sendRequestReason = async () => {

        let searchItem = datasAvailedDB.find((item) => item.commonid == postID &&
            item.module == "Human Resources" &&
            item.submodule == "HR" &&
            item.mainpage == "Employee" &&
            item.subpage == "Notice Period" &&
            item.subsubpage == "Exit List");

        let combinedGroups = groupDetails?.map((data) => {
            let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

            if (check) {
                return {
                    ...data, completedby: completedbyName, completedat: new Date()
                }
            } else {
                return {
                    ...data, completedby: "", completedat: ""
                }
            }

        })
        setPageName(!pageName);
        try {

            if (searchItem) {
                let assignbranches = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        commonid: assignDetails?.commonid,
                        module: assignDetails?.module,
                        submodule: assignDetails?.submodule,
                        mainpage: assignDetails?.mainpage,
                        subpage: assignDetails?.subpage,
                        subsubpage: assignDetails?.subsubpage,
                        category: assignDetails?.category,
                        subcategory: assignDetails?.subcategory,
                        candidatename: assignDetails?.fullname,
                        status: "completed",
                        groups: combinedGroups,
                        updatedby: [
                            ...searchItem?.updatedby,
                            {
                                name: String(username),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
            } else {
                let assignbranches = await axios.post(
                    `${SERVICE.MYCHECKLIST_CREATE}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        commonid: postID,
                        module: thisPageDatas[0]?.modulename,
                        submodule: thisPageDatas[0]?.submodule,
                        mainpage: thisPageDatas[0]?.mainpage,
                        subpage: thisPageDatas[0]?.subpage,
                        subsubpage: thisPageDatas[0]?.subsubpage,
                        category: thisPageDatas[0]?.category,
                        subcategory: thisPageDatas[0]?.subcategory,
                        candidatename: assignDetails?.companyname,
                        status: "completed",
                        groups: combinedGroups,
                        addedby: [
                            {
                                name: String(username),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
            }

            let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${exitStatusId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                exitstatus: Boolean(true),
                status: String("Exited"),
            });




            setIsCheckedListOverall(false);
            setIsCheckedList([]);

            setBtnSubmit(false);
            await fetchUnassignedCandidates();
            handleCloseviewReleave();
        } catch (err) { setBtnSubmit(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const sendRequest = async (datas) => {
        console.log(datas)
        try {


            //updateing noticeperiod meetingf status
            let res = await axios.put(
                `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${datas?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    interviewscheduled: false,
                    updatedby: [
                        ...datas?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchUnassignedCandidates()
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "green" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Moved Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
            handleClickCloseMeetingPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };




    const fetchUnassignedCandidates = async () => {
        setPageName(!pageName);
        try {
            const [res] = await Promise.all([
                axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
                    assignbranch: isAssignBranch
                }, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ])

            let ans = res?.data?.noticeperiodapply.filter(
                (data) =>
                    data.approvedStatus === "true" &&
                    data.cancelstatus === false &&
                    data.continuestatus === false
            )

            setemployeeApproved(ans);
            setIsBoardingApproved(true);

            setIsBoarding(true);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchUnassignedCandidates();
    }, [vendorAuto]);

    const [reason, setReason] = useState({ date: formattedDate, reasonname: "" });
    const [employeeToShow, setEmployeesToShow] = useState([]);

    const [datasAvailedDB, setDatasAvailedDB] = useState();
    const [getDetails, setGetDetails] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [exitStatusId, setExitStatusId] = useState({});
    const [assignDetails, setAssignDetails] = useState();
    const [postID, setPostID] = useState();
    const [groupDetails, setGroupDetails] = useState([]);

    const [isCheckedList, setIsCheckedList] = useState([]);
    const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
    const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
    const [dateValueRandom, setDateValueRandom] = useState([]);
    const [timeValueRandom, setTimeValueRandom] = useState([]);
    const [dateValue, setDateValue] = useState([]);
    const [timeValue, setTimeValue] = useState([]);
    const [firstDateValue, setFirstDateValue] = useState([]);
    const [firstTimeValue, setFirstTimeValue] = useState([]);
    const [secondDateValue, setSecondDateValue] = useState([]);
    const [secondTimeValue, setSecondTimeValue] = useState([]);
    const [disableInput, setDisableInput] = useState([]);
    const [empaddform, setEmpaddform] = useState({});
    const [replaceName, setReplaceName] = useState("Please Choose Replace name");
    const [statusemployee, setstatusemployee] = useState("");
    const [getId, setGetId] = useState("");
    const [employeesList, setEmployeesList] = useState([]);
    const [getImg, setGetImg] = useState(null);

    const [openviewReleave, setOpenviewReleave] = useState(false);
    const [hierarchyDeleteData, setHierarchyDeleteData] = useState([]);
    const [hierarchyDeleteEmployee, setHierarchyDeleteEmployee] = useState([]);
    const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [valNum, setValNum] = useState(0);
    const [isWebcamCapture, setIsWebcamCapture] = useState(false);
    const [thisPageDatas, setThisPageDatas] = useState([]);
    const [sourceDatas, setSourceDatas] = useState([]);
    const [checklistDatas, setChecklistDatas] = useState([]);

    const username = isUserRoleAccess.username;
    let name = "create";
    const handleClickOpenviewReleave = () => {
        setOpenviewReleave(true);
        handleCloseManageColumns();
    };

    const handleCloseviewReleave = () => {
        setOpenviewReleave(false);
        setIsCheckedListOverall(false);
    };


    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
    };

    const webcamDataStore = () => {
        setIsWebcamCapture(true);
        //popup close
        webcamClose();
    };

    const showWebcam = () => {
        webcamOpen();
    };


    let completedbyName = isUserRoleAccess.companyname;
    const updateIndividualData = async (index) => {
        let searchItem = datasAvailedDB.find((item) => item.commonid == postID &&
            item.module == "Human Resources" &&
            item.submodule == "HR" &&
            item.mainpage == "Employee" &&
            item.subpage == "Notice Period"
            && item.subsubpage == "Exit List");

        let combinedGroups = groupDetails?.map((data) => {
            let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

            if (check) {
                return {
                    ...data, completedby: completedbyName, completedat: new Date()
                }
            } else {
                return {
                    ...data, completedby: "", completedat: ""
                }
            }

        })

        setPageName(!pageName);
        try {
            let objectID = combinedGroups[index]?._id;
            let objectData = combinedGroups[index];
            if (searchItem) {

                let assignbranches = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        data: String(objectData?.data),
                        lastcheck: objectData?.lastcheck,
                        newFiles: objectData?.files !== undefined ? objectData?.files : "",
                        completedby: objectData?.completedby,
                        completedat: objectData?.completedat
                    }
                );
                await fecthDBDatas();
            } else {
                let assignbranches = await axios.post(
                    `${SERVICE.MYCHECKLIST_CREATE}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        commonid: postID,
                        module: thisPageDatas[0]?.modulename,
                        submodule: thisPageDatas[0]?.submodule,
                        mainpage: thisPageDatas[0]?.mainpage,
                        subpage: thisPageDatas[0]?.subpage,
                        subsubpage: thisPageDatas[0]?.subsubpage,
                        category: thisPageDatas[0]?.category,
                        subcategory: thisPageDatas[0]?.subcategory,
                        candidatename: assignDetails?.companyname,
                        status: "progress",
                        groups: combinedGroups,
                        addedby: [
                            {
                                name: String(username),
                                date: String(new Date()),
                            },
                        ],
                    }
                );
                await fecthDBDatas();
            }
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Updated Successfully</p>
                </>
            );
            handleClickOpenerr();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const [btnSubmit, setBtnSubmit] = useState(false);

    const handleCheckListSubmit = async () => {
        setBtnSubmit(true);
        if (groupDetails?.length > 0) {
            let nextStep = isCheckedList.every((item) => item == true);
            if (predefinedChecks?.exitinterview === false) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Exit Interview Not Completed Yet!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (predefinedChecks?.assetrecovery === false) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Assets Not Recovered Yet!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (!nextStep) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Check All the Fields!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else {

                sendRequestReason();
            }
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        Please Add Checklist in
                    </p>
                    <a style={{ display: 'block', color: 'blue' }} href="/interview/myinterviewchecklist" target="_blank">{"My Checklist Page"}</a>
                </>
            );
            handleClickOpenerr();
        }

    }

    const handleClearreason = () => {
        setReason({ date: formattedDate, reasonname: "" });
    };

    async function fecthDBDatas() {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res?.data?.mychecklist);

            let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID)
            setGroupDetails(foundData?.groups);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const updateFromDateValueAtIndex = (value, index) => {

        setDateValueMultiFrom(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span", "fromdate")
    };


    const updateToDateValueAtIndex = (value, index) => {

        setDateValueMultiTo(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span", "todate")
    };
    //---------------------------------------------------------------------------------------------------------------------------------
    const updateDateValueAtIndex = (value, index) => {

        setDateValueRandom(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Random Time", "date")
    };

    const updateTimeValueAtIndex = (value, index) => {

        setTimeValueRandom(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Random Time", "time")
    };
    //---------------------------------------------------------------------------------------------------------------------------------------



    const updateFirstDateValuesAtIndex = (value, index) => {

        setFirstDateValue(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "fromdate")
    };

    const updateFirstTimeValuesAtIndex = (value, index) => {

        setFirstTimeValue(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "fromtime")
    };

    const updateSecondDateValuesAtIndex = (value, index) => {

        setSecondDateValue(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "todate")
    };

    const updateSecondTimeValuesAtIndex = (value, index) => {

        setSecondTimeValue(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "totime")
    };

    const updateTimeValuesAtIndex = (value, index) => {

        setTimeValue(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "DateTime", "time")
    };

    const updateDateValuesAtIndex = (value, index) => {

        setDateValue(prevArray => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "DateTime", "date")
    };

    const handleChangeImage = (event, index) => {

        const resume = event.target.files;


        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);

        reader.onload = () => {
            handleDataChange(
                {
                    name: file.name,
                    preview: reader.result,
                    data: reader.result.split(",")[1],
                    remark: "resume file",
                }, index, "Attachments")

        };

    };

    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeleteEdit = (index) => {
        let getData = groupDetails[index];
        delete getData.files;
        let finalData = getData;

        let updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);

    };

    const handleDataChange = (e, index, from, sub) => {

        let getData;
        let finalData;
        let updatedTodos;
        switch (from) {
            case 'Check Box':
                getData = groupDetails[index];
                finalData = {
                    ...getData, lastcheck: e
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box-number':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box-alpha':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box-alphanumeric':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Attachments':
                getData = groupDetails[index];
                finalData = {
                    ...getData, files: e
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Pre-Value':
                break;
            case 'Date':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Time':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'DateTime':
                if (sub == "date") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${timeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${dateValue[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }

                break;
            case 'Date Multi Span':
                if (sub == "fromdate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${dateValueMultiTo[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${dateValueMultiFrom[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case 'Date Multi Span Time':
                if (sub == "fromdate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else if (sub == "fromtime") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                else if (sub == "todate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case 'Date Multi Random':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Date Multi Random Time':

                if (sub == "date") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${timeValueRandom[index]}`
                    }


                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${dateValueRandom[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case 'Radio':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
        }
    }


    const hierarchyCheck = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.HIRERARCHI}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let answer = res.data.hirerarchi.filter((data) => data.supervisorchoose.includes(e));
            let answerEmployeename = res.data.hirerarchi.filter((data) => data.employeename.includes(e));
            setHierarchyDeleteData(answer);
            setHierarchyDeleteEmployee(answerEmployeename);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchEmployeeList = async (e) => {
        setPageName(!pageName);
        try {

            let Designation = allUsersData.find((item) => {
                return e === item.companyname;
            });

            let answer = allUsersData.filter((data) => data?.companyname !== e && Designation?.designation === data?.designation && (data?.resonablestatus === "" || data?.resonablestatus === undefined));
            setEmployeesList(
                answer.map((data) => ({
                    ...data,
                    label: data.companyname,
                    value: data.companyname,
                }))
            );
        } catch (err) { setIsBoarding(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const overallCheckListChange = () => {
        let newArrayChecked = isCheckedList.map((item) => item = !isCheckedListOverall);

        if (groupDetails) {
            let returnOverall = groupDetails?.map((row) => {

                {
                    if (row.checklist === "DateTime") {
                        if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    else if (row.checklist === "Date Multi Span") {
                        if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    else if (row.checklist === "Date Multi Span Time") {
                        if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    else if (row.checklist === "Date Multi Random Time") {
                        if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
                            return true;
                        } else {
                            return false;
                        }

                    }
                    else if (((row.data !== undefined && row.data !== "") || (row.files !== undefined))) {
                        return true;
                    } else {
                        return false;
                    }

                }

            })

            let allcondition = returnOverall?.every((item) => item == true);

            if (allcondition) {
                setIsCheckedList(newArrayChecked);
                setIsCheckedListOverall(!isCheckedListOverall);
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Fill all the Fields</p>
                    </>
                );
                handleClickOpenerr();
            }
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Add Check List</p>
                </>
            );
            handleClickOpenerr();
        }

    }


    const handleCheckboxChange = (index) => {


        let currentItem = groupDetails[index];

        let data = () => {
            if (currentItem.checklist === "DateTime") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (currentItem.checklist === "Date Multi Span") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 21)) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (currentItem.checklist === "Date Multi Span Time") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 33)) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (currentItem.checklist === "Date Multi Random Time") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
                    return true;
                } else {
                    return false;
                }

            }
            else if (((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined))) {
                return true;
            } else {
                return false;
            }
        }
        let statusFor = data();

        if (statusFor) {
            const newCheckedState = [...isCheckedList];
            newCheckedState[index] = !newCheckedState[index];
            setIsCheckedList(newCheckedState);
            handleDataChange(newCheckedState[index], index, "Check Box");
            let overallChecked = newCheckedState.every((item) => item === true);

            if (overallChecked) {
                setIsCheckedListOverall(true);
            } else {
                setIsCheckedListOverall(false);
            }
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Fill the Field</p>
                </>
            );
            handleClickOpenerr();
        }


    };

    const [predefinedChecks, setPredefinedChecks] = useState({
        exitinterview: false,
        assetrecovery: false
    })
    const getCodeList = async (e, name, details) => {

        console.log(details)
        setLoading(true);
        setGetDetails(details);

        setPageName(!pageName);
        try {
            const [resAsset, res1] = await Promise.all([
                axios.get(SERVICE.EMPLOYEEASSET, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.MYCHECKLIST, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ])

            let foundData = resAsset?.data?.employeeassets?.filter((item) => item.status !== "recovered")?.some((itemnew) => itemnew?.employeenameto?.includes(details?.empname));

            if (details?.confirmationstatus === "confirm") {
                setPredefinedChecks((prev) => ({ ...prev, exitinterview: true }))
            } else {
                setPredefinedChecks((prev) => ({ ...prev, exitinterview: false }))
            }
            if (!foundData) {
                setPredefinedChecks((prev) => ({ ...prev, assetrecovery: true }))
            } else {
                setPredefinedChecks((prev) => ({ ...prev, assetrecovery: false }))
            }

            setDatasAvailedDB(res1?.data?.mychecklist);
            let searchItem = res1?.data?.mychecklist.find((item) => item.commonid == details?._id &&
                item.module == "Human Resources" &&
                item.submodule == "HR" &&
                item.mainpage == "Employee" &&
                item.subpage == "Notice Period" &&
                item.subsubpage == "Exit List");


            if (searchItem) {
                setAssignDetails(searchItem);

                setPostID(searchItem?.commonid);

                setGroupDetails(
                    searchItem?.groups?.map((data) => ({
                        ...data,
                        lastcheck: false,
                    }))
                );


                setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));


                let forFillDetails = searchItem?.groups?.map((data) => {
                    if (data.checklist === "Date Multi Random Time") {
                        if (data?.data && data?.data !== "") {
                            const [date, time] = data?.data?.split(" ");
                            return { date, time };
                        }

                    } else {
                        return { date: "0", time: "0" };
                    }
                });

                let forDateSpan = searchItem?.groups?.map((data) => {
                    if (data.checklist === "Date Multi Span") {
                        if (data?.data && data?.data !== "") {
                            const [fromdate, todate] = data?.data?.split(" ");
                            return { fromdate, todate };
                        }
                    } else {
                        return { fromdate: "0", todate: "0" };
                    }
                })


                let forDateTime = searchItem?.groups?.map((data) => {
                    if (data.checklist === "DateTime") {
                        if (data?.data && data?.data !== "") {
                            const [date, time] = data?.data?.split(" ");
                            return { date, time };
                        }
                    } else {
                        return { date: "0", time: "0" };
                    }
                })

                let forDateMultiSpanTime = searchItem?.groups?.map((data) => {
                    if (data.checklist === "Date Multi Span Time") {
                        if (data?.data && data?.data !== "") {
                            const [from, to] = data?.data?.split("/");
                            const [fromdate, fromtime] = from?.split(" ");
                            const [todate, totime] = to?.split(" ");
                            return { fromdate, fromtime, todate, totime };
                        }
                    } else {
                        return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
                    }
                })

                setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate))
                setDateValueMultiTo(forDateSpan.map((item) => item?.todate))

                setDateValueRandom(forFillDetails.map((item) => item?.date))
                setTimeValueRandom(forFillDetails.map((item) => item?.time))

                setDateValue(forDateTime.map((item) => item?.date))
                setTimeValue(forDateTime.map((item) => item?.time))

                setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate))
                setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime))
                setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate))
                setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime))

                setDisableInput(new Array(details?.groups?.length).fill(true))

            } else {
                setAssignDetails([]);
                setPostID("");
                setGroupDetails([]);
                setIsCheckedList([]);


                setDateValueMultiFrom([]);
                setDateValueMultiTo([]);
                setDateValueRandom([]);
                setTimeValueRandom([]);
                setDateValue([]);
                setTimeValue([]);
                setFirstDateValue([]);
                setFirstTimeValue([]);
                setSecondDateValue([]);
            }



            setEmpaddform(details);
            setReplaceName(details.companyname);
            setstatusemployee(name);
            setLoading(false);
            handleClickOpenviewReleave();
            await hierarchyCheck(details?.companyname); fetchEmployeeList(details?.companyname);
        } catch (err) { setLoading(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    // Table start colum and row
    // Define columnsApproved for the DataGrid
    const columnDataTableApproved = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeaderApproved
                    selectAllCheckedApproved={selectAllCheckedApproved}
                    onSelectAll={() => {
                        if (rowDataTableApproved.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllCheckedApproved) {
                            setSelectedRowsApproved([]);
                        } else {
                            const allRowIds = rowDataTableApproved.map((row) => row.id);
                            setSelectedRowsApproved(allRowIds);
                        }
                        setSelectAllCheckedApproved(!selectAllCheckedApproved);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRowsApproved.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRowsApproved.includes(params.row.id)) {
                            updatedSelectedRows = selectedRowsApproved.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRowsApproved, params.row.id];
                        }

                        setSelectedRowsApproved(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllCheckedApproved(
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
            width: 70,
            hide: !columnVisibilityApproved.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "cancel",
            headerName: "Action",
            flex: 0,
            width: 200,
            sortable: false,
            hide: !columnVisibility.cancel,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {!params?.row?.exitstatus ?
                        <Grid item md={4} xs={12} sm={12}>
                            <div style={{
                                color: '#fff', border: '1px solid #1565c0', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                                cursor: 'pointer', backgroundColor: '#1565c0'
                            }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#fff';
                                    e.target.style.color = '#1565c0';
                                }} // Change background color on hover
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#1565c0';
                                    e.target.style.color = '#fff';
                                }}
                                onClick={() => {

                                    getCodeList(params.row.id, "Hold", params.row);
                                    setUserDetails(params.row);
                                    setExitStatusId(params.row.id)
                                }}
                            >
                                Add Exit
                            </div>
                        </Grid> : <>
                            <div style={{
                                color: '#fff', border: '1px solid #23895d', padding: '2px 10px', borderRadius: '20px', transition: 'background-color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', backgroundColor: '#23895d'
                            }}
                            >
                                <span style={{ marginRight: '5px' }}>Added</span>
                                <PublishedWithChangesIcon />
                            </div>
                        </>
                    }


                </Grid >
            ),
        },
        {
            field: "scheduleinterview",
            headerName: "Schedule Interview",
            flex: 0,
            width: 200,
            sortable: false,
            hide: !columnVisibility.scheduleinterview,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {!params?.row?.exitstatus && !params?.row?.interviewscheduled ?
                        <Grid item md={4} xs={12} sm={12}>
                            <div style={{
                                color: '#fff', border: '1px solid #1565c0', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                                cursor: 'pointer', backgroundColor: '#1565c0'
                            }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#fff';
                                    e.target.style.color = '#1565c0';
                                }} // Change background color on hover
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#1565c0';
                                    e.target.style.color = '#fff';
                                }}
                                onClick={() => {
                                    handleClickOpenMeetingPopup(
                                        params.row.company,
                                        params.row.branch,
                                        params.row.team,
                                        params.row.department,
                                        params.row.empname,
                                        params.row.id,
                                        params.row.username,
                                        params.row.password,
                                        params.row.noticedate,
                                        params.row.approvenoticereq,
                                        params.row.testname,
                                        params.row.interviewcategory,
                                        params.row.interviewtype,
                                        params.row.venue,
                                        params.row.interviewmode,
                                        params.row.branchvenue,
                                        params.row.floorvenue,
                                        params.row.link,
                                        params.row.date,
                                        params.row.time,
                                        params.row.interviewer,

                                    );
                                }}
                            >
                                SI
                            </div>
                        </Grid> : !params?.row?.exitstatus && params?.row?.interviewscheduled && !params?.row?.interviewForm.length > 0 ? <>
                            <Grid item md={4} xs={12} sm={12}>
                                <div style={{
                                    color: '#fff', border: '1px solid #cc5333', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                                    cursor: 'pointer', backgroundColor: '#cc5333'
                                }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.color = '#cc5333';
                                    }} // Change background color on hover
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#cc5333';
                                        e.target.style.color = '#fff';
                                    }}
                                    onClick={() => {
                                        sendRequest(params?.row)
                                    }}
                                >
                                    <UndoIcon />
                                </div>
                            </Grid>
                        </> : <>
                        </>
                    }


                </Grid >
            ),
        },
        {
            field: "viewstatusnew",
            headerName: "Response Status",
            flex: 0,
            width: 200,
            sortable: false,
            hide: !columnVisibility.viewstatusnew,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {!params?.row?.exitstatus && params?.row?.interviewscheduled && params?.row?.interviewForm.length > 0 ?
                        <Grid item md={4} xs={12} sm={12}>
                            <div style={{
                                color: '#fff', border: '1px solid #1565c0', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                                cursor: 'pointer', backgroundColor: '#1565c0'
                            }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#fff';
                                    e.target.style.color = '#1565c0';
                                }} // Change background color on hover
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#1565c0';
                                    e.target.style.color = '#fff';
                                }}
                                onClick={() => {
                                    setViewData(params?.row);
                                }}
                            >
                                view
                            </div>
                        </Grid> : !params?.row?.exitstatus && params?.row?.interviewscheduled && params?.row?.interviewForm.length === 0 ? <>
                            <div style={{
                                color: '#fff', border: '1px solid #23895d', padding: '2px 10px', borderRadius: '20px', transition: 'background-color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', backgroundColor: '#23895d'
                            }}
                            >
                                <span style={{ marginRight: '5px' }}>Interview Scheduled</span>

                            </div>
                        </> : !params?.row?.exitstatus && !params?.row?.interviewscheduled && params?.row?.interviewForm?.length === 0 ? <>
                            <div style={{
                                color: '#fff', border: '1px solid #dd1818', padding: '2px 10px', borderRadius: '20px', transition: 'background-color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', backgroundColor: '#dd1818'
                            }}
                            >
                                <span style={{ marginRight: '5px' }}>Interview Not Scheduled</span>

                            </div>
                        </> : <>
                            {/* <div style={{
                                color: '#fff', border: '1px solid #dd1818', padding: '2px 10px', borderRadius: '20px', transition: 'background-color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', backgroundColor: '#dd1818'
                            }}
                            >
                                <span style={{ marginRight: '5px' }}>Interview Not Scheduled</span>

                            </div> */}
                        </>
                    }


                </Grid >
            ),
        },
        {
            field: "username",
            headerName: "UserName",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.username,
            renderCell: (params) => {
                return params.row.interviewscheduled ? <>
                    <Grid sx={{ display: "flex" }}>
                        <ListItem
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                    color: "blue",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            <CopyToClipboard
                                onCopy={() => {
                                    handleCopy("Copied Username!");
                                }}
                                options={{ message: "Copied Username!" }}
                                text={params?.row?.username}
                            >
                                <ListItemText primary={params?.row?.username} />
                            </CopyToClipboard>
                        </ListItem>
                    </Grid>
                </> : <>
                </>
            },
        },
        {
            field: "password",
            headerName: "Password",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.password,
            renderCell: (params) => {
                return params.row.interviewscheduled ?
                    (
                        <Grid sx={{ display: "flex" }}>
                            <ListItem
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                        color: "blue",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                <CopyToClipboard
                                    onCopy={() => {
                                        handleCopy("Copied Password!");
                                    }}
                                    options={{ message: "Copied Password!" }}
                                    text={params?.row?.password}
                                >
                                    <ListItemText primary={params?.row?.password} />
                                </CopyToClipboard>
                            </ListItem>
                        </Grid>
                    )
                    : null;
            }
        },
        {
            field: "roundlink",
            headerName: "Interview Link",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.roundlink,
            renderCell: (params) => {
                return params.row.interviewscheduled ? (
                    <Grid sx={{ display: "flex" }}>
                        <>
                            <ListItem
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                        color: "blue",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                <CopyToClipboard
                                    onCopy={() => {
                                        handleCopy("Link Copied!");
                                    }}
                                    options={{ message: "Copied Interview Link!" }}
                                    text={params?.row?.roundlink}
                                >
                                    <ListItemText
                                        primary={"Copy"}
                                        style={{ fontSize: "smaller" }}
                                    />
                                </CopyToClipboard>
                            </ListItem>
                        </>


                    </Grid>
                ) : null
            }
        },
        {
            field: "scheduledat",
            headerName: "Scheduled Date/Time",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.scheduledat,
            renderCell: (params) => {
                // Define your condition here, for example, only render if scheduledat is not null
                if (params.row.interviewscheduled) {
                    return (
                        <Grid>
                            <ListItemText primary={params.row.scheduledat} />
                        </Grid>
                    );
                } else {
                    return null; // Return null if the condition is not met
                }
            },
        },
        {
            field: "empname",
            headerName: "Name",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.empname,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Comapny",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.unit,
            headerClassName: "bold-header",
        },

        {
            field: "empcode",
            headerName: "Empcode",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.empcode,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.team,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.department,
            headerClassName: "bold-header",
        },
        {
            field: "noticedate",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.noticedate,
            headerClassName: "bold-header",
        },
        {
            field: "reasonleavingname",
            headerName: "Reason",
            flex: 0,
            width: 100,
            hide: !columnVisibilityApproved.reasonleavingname,
            headerClassName: "bold-header",
        },

        {
            field: "approvedthrough",
            headerName: "Approved Through",
            flex: 0,
            width: 150,
            hide: !columnVisibilityApproved.approvedthrough,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 200,
            renderCell: (params) => (

                <Button
                    variant="contained"
                    style={{
                        padding: "5px",
                        background:
                            params.row.status === "Approved"
                                ? "green"
                                : params.row.status === "Reject"
                                    ? "red"
                                    : params.row.status === "Recheck"
                                        ? "blue"
                                        : params.row.status === "Applied"
                                            ? "yellow"
                                            : params.row.status,
                        color: params.row.status === "Applied" ? "black" : "white",
                        // color: params.value === "Approved" ? "black" : params.value === "Rejected" ? "white" : "white",
                        fontSize: "10px",
                        width: "90px",
                        fontWeight: "bold",
                    }}
                >
                    {params.row.status}
                </Button>
            ),
            hide: !columnVisibilityApproved.status,
        },
        {
            field: "releasedate",
            headerName: "Release Date",
            flex: 0,
            width: 150,
            hide: !columnVisibilityApproved.releasedate,
            headerClassName: "bold-header",
        },

    ];

    // Create a row data object for the DataGrid
    const rowDataTableApproved = filteredDataApproved.map((notice, index) => {
        return {
            ...notice,
            id: notice._id,
            serialNumber: notice.serialNumber,
            company: notice.company,
            branch: notice.branch,
            unit: notice.unit,
            empname: notice.empname,
            empcode: notice.empcode,
            team: notice.team,
            department: notice.department,
            noticedate: notice.noticedate,
            reasonleavingname: notice.reasonleavingname,
            exitstatus: notice.exitstatus,
            status: notice.status,
            approvedthrough: notice.approvedthrough,
            username: notice.username,
            password: notice.password,
            interviewscheduled: notice.interviewscheduled,
            roundlink: notice.roundlink,
            scheduledat: notice.scheduledat,
            interviewForm: notice.interviewForm,
            confirmationstatus: notice.confirmationstatus,
            approvenoticereq: notice.approvenoticereq,
            updatedby: notice.updatedby,


            testname: notice.testname,
            interviewcategory: notice.interviewcategory,
            interviewtype: notice.interviewtype,
            venue: notice.venue,
            interviewmode: notice.interviewmode,
            branchvenue: notice.branchvenue,
            floorvenue: notice.floorvenue,
            link: notice.link,
            date: notice.date,
            time: notice.time,
            interviewer: notice.interviewer,

        };
    });
    const handleShowAllcolumnsApproved = () => {
        const updatedVisibility = { ...columnVisibilityApproved };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityApproved(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityApproved");
        if (savedVisibility) {
            setColumnVisibilityApproved(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityApproved",
            JSON.stringify(columnVisibilityApproved)
        );
    }, [columnVisibilityApproved]);
    // Manage Columns functionality
    const toggleColumnVisibilityApproved = (field) => {
        setColumnVisibilityApproved((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // Function to filter columns based on search query
    const filteredColumnsApproved = columnDataTableApproved.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageApproved.toLowerCase())
    );
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentApproved = (
        <Box
            sx={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsApproved}
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
                    value={searchQueryManageApproved}
                    onChange={(e) => setSearchQueryManageApproved(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsApproved?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityApproved[column.field]}
                                        onChange={() =>
                                            toggleColumnVisibilityApproved(column.field)
                                        }
                                    />
                                }
                                secondary={column.headerName}
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
                            onClick={() =>
                                setColumnVisibilityApproved(initialColumnVisibilityApproved)
                            }
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibilityApproved({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    // Calculate the DataGrid height based on the number of rows
    const calculateDataGridHeightApproved = () => {
        if (pageSizeApproved === "All") {
            return "auto"; // Auto height for 'All' entries
        } else {
            // Calculate the height based on the number of rows displayed
            const visibleRows = Math.min(
                pageSizeApproved,
                filteredDatasApproved.length
            );
            const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
            const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
            const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
            return `${visibleRows > 0
                ? visibleRows * rowHeight + extraSpace
                : scrollbarWidth + extraSpace
                }px`;
        }
    };



    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"EXIT LIST"} />
            <NotificationContainer />
            <PageHeading
                title="Exit List"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Notice Period"
                subsubpagename="Exit List"
            />
            <br />
            {isUserRoleCompare?.includes("lexitlist") && (
                <>
                    <Box sx={userStyle.container}>
                        <br />
                        <Typography sx={userStyle.HeaderText}>
                            Exit list
                        </Typography>

                        <Box>
                            <br />
                            {isUserRoleCompare?.includes("lexitlist") && (
                                <>
                                    <Box>

                                        {!isBoardingApproved ? (
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
                                                <br />
                                                <br />
                                                <Grid container sx={{ justifyContent: "center" }}>
                                                    <Grid>
                                                        {isUserRoleCompare?.includes(
                                                            "csvexitlist"
                                                        ) && (
                                                                <>
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            setIsFilterOpen(true);
                                                                            setFormat("xl");
                                                                        }}
                                                                        sx={userStyle.buttongrp}
                                                                    >
                                                                        <FaFileExcel />
                                                                        &ensp;Export to Excel&ensp;
                                                                    </Button>
                                                                </>
                                                            )}
                                                        {isUserRoleCompare?.includes(
                                                            "excelexitlist"
                                                        ) && (
                                                                <>
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            setIsFilterOpen(true);
                                                                            setFormat("csv");
                                                                        }}
                                                                        sx={userStyle.buttongrp}
                                                                    >
                                                                        <FaFileCsv />
                                                                        &ensp;Export to CSV&ensp;
                                                                    </Button>
                                                                </>
                                                            )}
                                                        {isUserRoleCompare?.includes(
                                                            "printexitlist"
                                                        ) && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttongrp}
                                                                        onClick={handleprintApproved}
                                                                    >
                                                                        &ensp;
                                                                        <FaPrint />
                                                                        &ensp;Print&ensp;
                                                                    </Button>
                                                                </>
                                                            )}
                                                        {isUserRoleCompare?.includes(
                                                            "pdfexitlist"
                                                        ) && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttongrp}
                                                                        onClick={() => {
                                                                            setIsPdfFilterOpen(true);
                                                                        }}
                                                                    >
                                                                        <FaFilePdf />
                                                                        &ensp;Export to PDF&ensp;
                                                                    </Button>
                                                                </>
                                                            )}
                                                        {isUserRoleCompare?.includes(
                                                            "imageexitlist"
                                                        ) && (
                                                                <Button
                                                                    sx={userStyle.buttongrp}
                                                                    onClick={handleCaptureImageApproved}
                                                                >
                                                                    {" "}
                                                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                                    &ensp;Image&ensp;{" "}
                                                                </Button>
                                                            )}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                {/* added to the pagination grid */}
                                                <Grid style={userStyle.dataTablestyle}>
                                                    <Box>
                                                        <label htmlFor="pageSizeSelect">
                                                            Show entries:
                                                        </label>
                                                        <Select
                                                            id="pageSizeSelect"
                                                            value={pageSizeApproved}
                                                            onChange={handlePageSizeChangeApproved}
                                                            sx={{ width: "77px" }}
                                                        >
                                                            <MenuItem value={1}>1</MenuItem>
                                                            <MenuItem value={5}>5</MenuItem>
                                                            <MenuItem value={10}>10</MenuItem>
                                                            <MenuItem value={25}>25</MenuItem>
                                                            <MenuItem value={50}>50</MenuItem>
                                                            <MenuItem value={100}>100</MenuItem>
                                                            {/* <MenuItem value={employeeApproved.length}>
                                All
                              </MenuItem> */}
                                                        </Select>
                                                    </Box>
                                                    <Box>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>Search</Typography>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                value={searchQueryApproved}
                                                                onChange={handleSearchChangeApproved}
                                                            />
                                                        </FormControl>
                                                    </Box>
                                                </Grid>
                                                <br />
                                                {/* ****** Table Grid Container ****** */}
                                                <Grid container>
                                                    <Grid md={4} sm={2} xs={1}></Grid>
                                                    <Grid
                                                        md={8}
                                                        sm={10}
                                                        xs={10}
                                                        sx={{ align: "center" }}
                                                    ></Grid>
                                                </Grid>
                                                <br />
                                                {/* ****** Table start ****** */}
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        handleShowAllcolumnsApproved();
                                                        setColumnVisibilityApproved(
                                                            initialColumnVisibilityApproved
                                                        );
                                                    }}
                                                >
                                                    Show All Columns
                                                </Button>
                                                &ensp;
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleOpenManageColumnsApproved}
                                                >
                                                    Manage Columns
                                                </Button>
                                                <br />
                                                <br />
                                                {/* {isLoader ? ( */}
                                                <>

                                                    <Box style={{ width: "100%", overflowY: "hidden" }}>
                                                        <StyledDataGrid
                                                            rows={rowDataTableApproved}
                                                            columns={columnDataTableApproved.filter(
                                                                (column) =>
                                                                    columnVisibilityApproved[column.field]
                                                            )}
                                                            autoHeight={true}
                                                            density="standard"
                                                            hideFooter
                                                            ref={gridRef1}

                                                            // checkboxSelection={columnVisibilityApproved.checkboxSelection}
                                                            // getRowClassName={getRowClassNameAll}
                                                            disableRowSelectionOnClick
                                                            // unstable_cellSelection
                                                            onClipboardCopy={(copiedString) =>
                                                                setCopiedDataApproved(copiedString)
                                                            }
                                                        // unstable_ignoreValueFormatterDuringExport
                                                        />
                                                    </Box>

                                                    <br />
                                                    <Box style={userStyle.dataTablestyle}>
                                                        <Box>
                                                            Showing{" "}
                                                            {filteredDataApproved.length > 0
                                                                ? (pageApproved - 1) * pageSizeApproved + 1
                                                                : 0}{" "}
                                                            to{" "}
                                                            {Math.min(
                                                                pageApproved * pageSizeApproved,
                                                                filteredDatasApproved.length
                                                            )}{" "}
                                                            of {filteredDatasApproved.length} entries
                                                        </Box>
                                                        <Box>
                                                            <Button
                                                                onClick={() => setPageApproved(1)}
                                                                disabled={pageApproved === 1}
                                                                sx={userStyle.paginationbtn}
                                                            >
                                                                <FirstPageIcon />
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    handlePageChangeApproved(pageApproved - 1)
                                                                }
                                                                disabled={pageApproved === 1}
                                                                sx={userStyle.paginationbtn}
                                                            >
                                                                <NavigateBeforeIcon />
                                                            </Button>
                                                            {pageNumbersApproved?.map((pageNumber) => (
                                                                <Button
                                                                    key={pageNumber}
                                                                    sx={userStyle.paginationbtn}
                                                                    onClick={() =>
                                                                        handlePageChangeApproved(pageNumber)
                                                                    }
                                                                    className={
                                                                        pageApproved === pageNumber ? "active" : ""
                                                                    }
                                                                    disabled={pageApproved === pageNumber}
                                                                >
                                                                    {pageNumber}
                                                                </Button>
                                                            ))}
                                                            {lastVisiblePageApproved < totalPagesApproved && (
                                                                <span>...</span>
                                                            )}
                                                            <Button
                                                                onClick={() =>
                                                                    handlePageChangeApproved(pageApproved + 1)
                                                                }
                                                                disabled={pageApproved === totalPagesApproved}
                                                                sx={userStyle.paginationbtn}
                                                            >
                                                                <NavigateNextIcon />
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    setPageApproved(totalPagesApproved)
                                                                }
                                                                disabled={pageApproved === totalPagesApproved}
                                                                sx={userStyle.paginationbtn}
                                                            >
                                                                <LastPageIcon />
                                                            </Button>
                                                        </Box>
                                                    </Box>

                                                    {/* Manage Column */}
                                                    <Popover
                                                        id={idApproved}
                                                        open={isManageColumnsOpenApproved}
                                                        anchorEl={anchorElApproved}
                                                        onClose={handleCloseManageColumnsApproved}
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "left",
                                                        }}
                                                    >
                                                        {manageColumnsContentApproved}
                                                    </Popover>
                                                </>
                                                {/* ) : ( */}
                                                {/* <>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </> */}
                                                {/* )} */}
                                            </>
                                        )}
                                    </Box>
                                </>
                            )}
                            <br />
                            {/* ****** Table End ****** */}
                        </Box>
                    </Box>
                </>)}
            <br />
            {/* ****** Table End ****** */}

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRefApproved}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>Password</StyledTableCell>
                            <StyledTableCell>Interview Link</StyledTableCell>
                            <StyledTableCell>Scheduled At</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit </StyledTableCell>

                            <StyledTableCell>Empcode</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>

                            <StyledTableCell>Reason</StyledTableCell>
                            <StyledTableCell>Approved Through</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTableApproved &&
                            rowDataTableApproved.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.username}</StyledTableCell>
                                    <StyledTableCell>{row.password}</StyledTableCell>
                                    <StyledTableCell>{row.roundlink}</StyledTableCell>
                                    <StyledTableCell>{row.scheduledat}</StyledTableCell>
                                    <StyledTableCell>{row.empname}</StyledTableCell>
                                    <StyledTableCell>{row.company} </StyledTableCell>
                                    <StyledTableCell>{row.branch} </StyledTableCell>
                                    <StyledTableCell> {row.unit}</StyledTableCell>

                                    <StyledTableCell>{row.empcode}</StyledTableCell>
                                    <StyledTableCell>{row.team}</StyledTableCell>
                                    <StyledTableCell>{row.department}</StyledTableCell>

                                    <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                                    <StyledTableCell>{row.approvedthrough}</StyledTableCell>
                                    <StyledTableCell>{row.status}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* schedule meeting popup*/}
            <Dialog
                open={openMeetingPopup}
                onClose={handleClickCloseMeetingPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                // sx={{
                //     overflow: "visible",
                //     "& .MuiPaper-root": {
                //         overflow: "visible",
                //     },
                // }}
                fullWidth={true}
            >
                {/* <VendorPopup setVendorAuto={setVendorAuto} handleCloseviewalertvendor={handleCloseviewalertvendor} /> */}
                <ScheduleMeetingNoticePeriod
                    setVendorAuto={setVendorAuto}
                    handleClickCloseMeetingPopup={handleClickCloseMeetingPopup}
                    meetingValues={meetingValues}
                />
            </Dialog>

            {/* schdedule meeting view model */}
            <Dialog
                open={openMeetingViewPopup}
                onClose={handleClickCloseMeetingViewPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Schedule Interview
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>
                                        {meetingData.company
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>
                                        {meetingData.branch
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Team</Typography>
                                    <Typography>
                                        {meetingData.team
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Department</Typography>
                                    <Typography>
                                        {meetingData.department
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Meeting Category</Typography>
                                    <Typography>{meetingData.meetingcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Interviewer</Typography>
                                    <Typography>
                                        {meetingData.interviewer
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Meeting Type</Typography>
                                    <Typography>{meetingData.meetingtype}</Typography>
                                </FormControl>
                            </Grid>
                            {meetingData.meetingtype === "Online" && (
                                <>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Meeting Mode</Typography>
                                            <Typography>{meetingData.meetingmode}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Link</Typography>
                                            <Link
                                                href={meetingData.link}
                                                variant="body3"
                                                underline="none"
                                                target="_blank"
                                            >
                                                {meetingData.link}
                                            </Link>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            {meetingData.meetingtype === "Offline" && (
                                <>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Location-Branch</Typography>
                                            <Typography>
                                                {meetingData.branchvenue
                                                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                    .toString()}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Location-Floor</Typography>
                                            <Typography>
                                                {meetingData.floorvenue
                                                    ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                    .toString()}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Location-Area</Typography>
                                            <Typography>{meetingData.venue}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Title</Typography>
                                    <Typography>{meetingData.title}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>
                                        {moment(meetingData.date).format("DD-MM-YYYY")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Time</Typography>
                                    <Typography>{meetingData.time}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Duration</Typography>
                                    <Typography>{meetingData.duration}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Time Zone</Typography>
                                    <Typography>{meetingData.timezone}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Meeting Participant</Typography>
                                    <Typography>
                                        {meetingData.participants
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Meeting Type</Typography>
                                    <Typography>{meetingData.meetingtype}</Typography>
                                </FormControl>
                            </Grid>
                            {meetingData.reminder && (
                                <>
                                    {" "}
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Repeat Type</Typography>
                                            <Typography>{meetingData.repeattype}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClickCloseMeetingViewPopup}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* this is the alert for the popover ation button in Reason Employee */}
            <Dialog open={openviewReleave} onClose={handleClickOpenviewReleave} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl">
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText} > Exit Notice Period List</Typography>
                        <br /> <br />

                        <Box sx={{ padding: "20px 10px", width: '100%' }}>
                            <>
                                <Typography sx={{ ...userStyle.SubHeaderText, fontWeight: '600' }} >
                                    Additional Checks
                                </Typography>
                                <br />
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={predefinedChecks?.exitinterview} />} label="Exit Interview Completed" />
                                        <FormControlLabel control={<Checkbox checked={predefinedChecks?.assetrecovery} />} label="Assets Recovered" />
                                    </FormGroup>
                                </div>
                                <br />
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ ...userStyle.SubHeaderText, fontWeight: '600' }} >
                                        My Check List
                                    </Typography>
                                </div>
                                <br />
                                <br />
                                <br />
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead >
                                            <TableRow>

                                                <TableCell style={{ fontSize: '1.2rem' }}>
                                                    <Checkbox onChange={() => { overallCheckListChange() }} checked={isCheckedListOverall} />
                                                </TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Action</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>

                                                {/* Add more table headers as needed */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupDetails?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell style={{ fontSize: '1.2rem' }}>
                                                        <Checkbox onChange={() => { handleCheckboxChange(index) }} checked={isCheckedList[index]} />
                                                    </TableCell>

                                                    <TableCell>{row.details}</TableCell>
                                                    {
                                                        (() => {
                                                            switch (row.checklist) {
                                                                case "Text Box":

                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            value={row.data}
                                                                            // disabled={disableInput[index]}
                                                                            onChange={(e) => {
                                                                                handleDataChange(e, index, "Text Box")
                                                                            }}
                                                                        />
                                                                    </TableCell>;
                                                                case "Text Box-number":
                                                                    return <TableCell>
                                                                        <Input value={row.data}
                                                                            style={{ height: '32px' }}
                                                                            type="number"

                                                                            onChange={(e) => {

                                                                                const value = e.target.value;
                                                                                if (value === '' || /^\d*$/.test(value)) {
                                                                                    handleDataChange(e, index, "Text Box-number")
                                                                                }

                                                                            }}
                                                                        />
                                                                    </TableCell>;
                                                                case "Text Box-alpha":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            value={row.data}
                                                                            onChange={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                if (/^[a-zA-Z]*$/.test(inputValue)) {
                                                                                    handleDataChange(e, index, "Text Box-alpha")
                                                                                }
                                                                            }}

                                                                        />
                                                                    </TableCell>;
                                                                case "Text Box-alphanumeric":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            value={row.data}
                                                                            onChange={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                                                                    handleDataChange(e, index, "Text Box-alphanumeric")
                                                                                }
                                                                            }}
                                                                            inputProps={{ pattern: '[A-Za-z0-9]*' }}
                                                                        />
                                                                    </TableCell>;
                                                                case "Attachments":
                                                                    return <TableCell>
                                                                        <div>
                                                                            <InputLabel sx={{ m: 1 }}>File</InputLabel>


                                                                            <div>

                                                                                <Box
                                                                                    sx={{ display: "flex", marginTop: "10px", gap: "10px" }}
                                                                                >

                                                                                    <Box item md={4} sm={4}>
                                                                                        <section>
                                                                                            <input
                                                                                                type="file"
                                                                                                accept="*/*"
                                                                                                id={index}
                                                                                                onChange={(e) => {
                                                                                                    handleChangeImage(e, index);

                                                                                                }}
                                                                                                style={{ display: 'none' }}
                                                                                            />
                                                                                            <label htmlFor={index}>
                                                                                                <Typography sx={userStyle.uploadbtn}>Upload</Typography>
                                                                                            </label>
                                                                                            <br />
                                                                                        </section>
                                                                                    </Box>

                                                                                    <Box item md={4} sm={4}>
                                                                                        <Button
                                                                                            onClick={showWebcam}
                                                                                            variant="contained"
                                                                                            sx={userStyle.uploadbtn}
                                                                                        >
                                                                                            <CameraAltIcon />
                                                                                        </Button>
                                                                                    </Box>


                                                                                </Box>
                                                                                {row.files && <Grid container spacing={2}>
                                                                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                                                                        <Typography>{row.files.name}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                                                        <VisibilityOutlinedIcon
                                                                                            style={{
                                                                                                fontsize: "large",
                                                                                                color: "#357AE8",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() => renderFilePreviewEdit(row.files)}
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                                                        <Button
                                                                                            style={{
                                                                                                fontsize: "large",
                                                                                                color: "#357AE8",
                                                                                                cursor: "pointer",
                                                                                                marginTop: "-5px",
                                                                                            }}
                                                                                            onClick={() => handleFileDeleteEdit(index)}
                                                                                        >
                                                                                            <DeleteIcon />
                                                                                        </Button>
                                                                                    </Grid>
                                                                                </Grid>}

                                                                            </div>
                                                                            <Dialog
                                                                                open={isWebcamOpen}
                                                                                onClose={webcamClose}
                                                                                aria-labelledby="alert-dialog-title"
                                                                                aria-describedby="alert-dialog-description"
                                                                            >
                                                                                <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                                                                                    <Webcamimage
                                                                                        getImg={getImg}
                                                                                        setGetImg={setGetImg}
                                                                                        capturedImages={capturedImages}
                                                                                        valNum={valNum}
                                                                                        setValNum={setValNum}
                                                                                        name={name}
                                                                                    />
                                                                                </DialogContent>
                                                                                <DialogActions>
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        color="success"
                                                                                        onClick={webcamDataStore}
                                                                                    >
                                                                                        OK
                                                                                    </Button>
                                                                                    <Button variant="contained" color="error" onClick={webcamClose}>
                                                                                        CANCEL
                                                                                    </Button>
                                                                                </DialogActions>
                                                                            </Dialog>

                                                                        </div>


                                                                    </TableCell>;
                                                                case "Pre-Value":
                                                                    return <TableCell><Typography>{row?.data}</Typography>
                                                                    </TableCell>;
                                                                case "Date":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='date'
                                                                            value={row.data}
                                                                            onChange={(e) => {

                                                                                handleDataChange(e, index, "Date")

                                                                            }}
                                                                        />
                                                                    </TableCell>;
                                                                case "Time":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='time'
                                                                            value={row.data}
                                                                            onChange={(e) => {

                                                                                handleDataChange(e, index, "Time")

                                                                            }}
                                                                        />
                                                                    </TableCell>;
                                                                case "DateTime":
                                                                    return <TableCell>
                                                                        <Stack direction="row" spacing={2}>
                                                                            <OutlinedInput
                                                                                style={{ height: '32px' }}
                                                                                type='date'
                                                                                value={dateValue[index]}
                                                                                onChange={(e) => {
                                                                                    updateDateValuesAtIndex(e.target.value, index)


                                                                                }}
                                                                            />
                                                                            <OutlinedInput
                                                                                type='time'
                                                                                style={{ height: '32px' }}
                                                                                value={timeValue[index]}
                                                                                onChange={(e) => {
                                                                                    updateTimeValuesAtIndex(e.target.value, index);

                                                                                }}
                                                                            />
                                                                        </Stack>
                                                                    </TableCell>;
                                                                case "Date Multi Span":
                                                                    return <TableCell>
                                                                        <Stack direction="row" spacing={2}>
                                                                            <OutlinedInput
                                                                                style={{ height: '32px' }}
                                                                                type='date'
                                                                                value={dateValueMultiFrom[index]}
                                                                                onChange={(e) => {
                                                                                    updateFromDateValueAtIndex(e.target.value, index)


                                                                                }}
                                                                            />
                                                                            <OutlinedInput
                                                                                type='date'
                                                                                style={{ height: '32px' }}
                                                                                value={dateValueMultiTo[index]}
                                                                                onChange={(e) => {
                                                                                    updateToDateValueAtIndex(e.target.value, index)


                                                                                }}
                                                                            />
                                                                        </Stack>
                                                                    </TableCell>;
                                                                case "Date Multi Span Time":
                                                                    return <TableCell>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                            <Stack direction="row" spacing={2}>
                                                                                <OutlinedInput
                                                                                    style={{ height: '32px' }}
                                                                                    type='date'
                                                                                    value={firstDateValue[index]}
                                                                                    onChange={(e) => {
                                                                                        updateFirstDateValuesAtIndex(e.target.value, index)


                                                                                    }}
                                                                                />
                                                                                <OutlinedInput
                                                                                    type='time'
                                                                                    style={{ height: '32px' }}
                                                                                    value={firstTimeValue[index]}
                                                                                    onChange={(e) => {
                                                                                        updateFirstTimeValuesAtIndex(e.target.value, index);


                                                                                    }}
                                                                                />
                                                                            </Stack>
                                                                            <Stack direction="row" spacing={2}>

                                                                                <OutlinedInput
                                                                                    type='date'
                                                                                    style={{ height: '32px' }}
                                                                                    value={secondDateValue[index]}
                                                                                    onChange={(e) => {
                                                                                        updateSecondDateValuesAtIndex(e.target.value, index)


                                                                                    }}
                                                                                />
                                                                                <OutlinedInput
                                                                                    style={{ height: '32px' }}
                                                                                    type='time'
                                                                                    value={secondTimeValue[index]}
                                                                                    onChange={(e) => {
                                                                                        updateSecondTimeValuesAtIndex(e.target.value, index);


                                                                                    }}
                                                                                />
                                                                            </Stack>
                                                                        </div>

                                                                    </TableCell>;
                                                                case "Date Multi Random":
                                                                    return <TableCell>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='date'
                                                                            value={row.data}
                                                                            onChange={(e) => {

                                                                                handleDataChange(e, index, "Date Multi Random")

                                                                            }}
                                                                        />
                                                                    </TableCell>;
                                                                case "Date Multi Random Time":
                                                                    return <TableCell>
                                                                        <Stack direction="row" spacing={2}>
                                                                            <OutlinedInput
                                                                                style={{ height: '32px' }}
                                                                                type='date'
                                                                                value={dateValueRandom[index]}
                                                                                onChange={(e) => {
                                                                                    updateDateValueAtIndex(e.target.value, index)


                                                                                }}
                                                                            />
                                                                            <OutlinedInput
                                                                                type='time'
                                                                                style={{ height: '32px' }}
                                                                                value={timeValueRandom[index]}
                                                                                onChange={(e) => {
                                                                                    updateTimeValueAtIndex(e.target.value, index);


                                                                                }}
                                                                            />
                                                                        </Stack>
                                                                    </TableCell>;
                                                                case "Radio":
                                                                    return <TableCell>
                                                                        <FormControl component="fieldset">
                                                                            <RadioGroup value={row.data} sx={{ display: 'flex', flexDirection: 'row !important' }} onChange={(e) => {
                                                                                handleDataChange(e, index, "Radio")
                                                                            }}>
                                                                                <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />

                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </TableCell>;

                                                                default:
                                                                    return <TableCell></TableCell>; // Default case
                                                            }
                                                        })()
                                                    }
                                                    <TableCell><span>
                                                        {row?.employee && row?.employee?.map((data, index) => (
                                                            <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                                                        ))}
                                                    </span></TableCell>
                                                    <TableCell>
                                                        <Typography>{row?.completedby}</Typography>
                                                    </TableCell>
                                                    <TableCell>{row.completedat && moment(row.completedat).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                                                    <TableCell>
                                                        {row.checklist === "DateTime" ?
                                                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                <Typography>Completed</Typography>
                                                                : <Typography>Pending</Typography>
                                                            : row.checklist === "Date Multi Span" ?
                                                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                                                    <Typography>Completed</Typography>
                                                                    : <Typography>Pending</Typography>
                                                                : row.checklist === "Date Multi Span Time" ?
                                                                    (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                                                        <Typography>Completed</Typography>
                                                                        : <Typography>Pending</Typography>
                                                                    : row.checklist === "Date Multi Random Time" ?
                                                                        (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                            <Typography>Completed</Typography>
                                                                            : <Typography>Pending</Typography>
                                                                        : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                                                            <Typography>Completed</Typography>
                                                                            : <Typography>Pending</Typography>
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {row.checklist === "DateTime" ?
                                                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                <>
                                                                    <IconButton
                                                                        sx={{ color: 'green', cursor: 'pointer' }}
                                                                        onClick={() => {
                                                                            updateIndividualData(index);
                                                                        }}
                                                                    >
                                                                        <CheckCircleIcon />
                                                                    </IconButton>
                                                                </>
                                                                : <IconButton
                                                                    sx={{ color: '#1565c0', cursor: 'pointer' }}
                                                                    onClick={() => {
                                                                        let itemValue = disableInput[index];
                                                                        itemValue = false;
                                                                        let spreadData = [...disableInput];
                                                                        spreadData[index] = false;
                                                                        setDisableInput(spreadData);
                                                                    }}
                                                                >
                                                                    <CheckCircleIcon />
                                                                </IconButton>
                                                            : row.checklist === "Date Multi Span" ?
                                                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                                                    <>
                                                                        <IconButton
                                                                            sx={{ color: 'green', cursor: 'pointer' }}
                                                                            onClick={() => {
                                                                                updateIndividualData(index);
                                                                            }}
                                                                        >
                                                                            <CheckCircleIcon />
                                                                        </IconButton>
                                                                    </>
                                                                    : <IconButton
                                                                        sx={{ color: '#1565c0', cursor: 'pointer' }}
                                                                        onClick={() => {
                                                                            let itemValue = disableInput[index];
                                                                            itemValue = false;
                                                                            let spreadData = [...disableInput];
                                                                            spreadData[index] = false;
                                                                            setDisableInput(spreadData);
                                                                        }}
                                                                    >
                                                                        <CheckCircleIcon />
                                                                    </IconButton>
                                                                : row.checklist === "Date Multi Span Time" ?
                                                                    (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                                                        <>
                                                                            <IconButton
                                                                                sx={{ color: 'green', cursor: 'pointer' }}
                                                                                onClick={() => {
                                                                                    updateIndividualData(index);
                                                                                }}
                                                                            >
                                                                                <CheckCircleIcon />
                                                                            </IconButton>
                                                                        </>
                                                                        : <IconButton
                                                                            sx={{ color: '#1565c0', cursor: 'pointer' }}
                                                                            onClick={() => {
                                                                                let itemValue = disableInput[index];
                                                                                itemValue = false;
                                                                                let spreadData = [...disableInput];
                                                                                spreadData[index] = false;
                                                                                setDisableInput(spreadData);
                                                                            }}
                                                                        >
                                                                            <CheckCircleIcon />
                                                                        </IconButton>
                                                                    : row.checklist === "Date Multi Random Time" ?
                                                                        (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                            <>
                                                                                <IconButton
                                                                                    sx={{ color: 'green', cursor: 'pointer' }}
                                                                                    onClick={() => {
                                                                                        updateIndividualData(index);
                                                                                    }}
                                                                                >
                                                                                    <CheckCircleIcon />
                                                                                </IconButton>
                                                                            </>
                                                                            : <IconButton
                                                                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                                                                onClick={() => {
                                                                                    let itemValue = disableInput[index];
                                                                                    itemValue = false;
                                                                                    let spreadData = [...disableInput];
                                                                                    spreadData[index] = false;
                                                                                    setDisableInput(spreadData);
                                                                                }}
                                                                            >
                                                                                <CheckCircleIcon />
                                                                            </IconButton>
                                                                        : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                                                            <>
                                                                                <IconButton
                                                                                    sx={{ color: 'green', cursor: 'pointer' }}
                                                                                    onClick={() => {
                                                                                        updateIndividualData(index);
                                                                                    }}
                                                                                >
                                                                                    <CheckCircleIcon />
                                                                                </IconButton>
                                                                            </>
                                                                            : <IconButton
                                                                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                                                                onClick={() => {
                                                                                    let itemValue = disableInput[index];
                                                                                    itemValue = false;
                                                                                    let spreadData = [...disableInput];
                                                                                    spreadData[index] = false;
                                                                                    setDisableInput(spreadData);
                                                                                }}
                                                                            >
                                                                                <CheckCircleIcon />
                                                                            </IconButton>
                                                        }
                                                    </TableCell>
                                                    <TableCell>{row.category}</TableCell>
                                                    <TableCell>{row.subcategory}</TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <br /> <br /> <br />
                            </>
                        </Box>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12} sm={12}>
                                <LoadingButton variant="contained" loading={btnSubmit} color="primary" onClick={handleCheckListSubmit}>
                                    Save
                                </LoadingButton>
                            </Grid>
                            {/* <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={handleClearreason}>
                                    {" "}
                                    Clear
                                </Button>
                            </Grid> */}
                            <Grid item md={0.2} xs={12} sm={12}></Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button variant="contained" color="primary" onClick={(e) => {
                                    handleCloseviewReleave(e);
                                    setGroupDetails([]);
                                    setIsCheckedListOverall(false);
                                    setIsCheckedList([]);

                                }}>
                                    {" "}
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Alert Dialog */}
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

            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormat === "xl" ? (
                        <>
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

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
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

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");


                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
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
                            downloadPdf("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            <Loader loading={loading} message={loadingMessage} />
            <NotificationContainer />

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleCloseview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Response &nbsp;&nbsp; <b> {roundmasterEdit?.username} </b>
                        </Typography>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        {" "}
                                        Main Questions
                                    </Typography>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Questions </Typography>
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">User Ans </Typography>
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Correct Ans </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">User Ans Status </Typography>
                                    </FormControl>
                                </Grid> */}
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Options </Typography>
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={0.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Status </Typography>
                                    </FormControl>
                                </Grid> */}
                            </Grid>
                            <br />
                            <br />
                            {roundmasterEdit?.interviewForm?.map((data, index) => {
                                return (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item md={8} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            maxWidth: "100%",
                                                        }}
                                                        title={data.question}
                                                    >
                                                        {/* <Button
                                                            variant="contained"
                                                            style={{
                                                                padding: "5px",
                                                                background:
                                                                    data?.attendby === "Candidate"
                                                                        ? "green"
                                                                        : data?.attendby === "Interviewer"
                                                                            ? "orange"
                                                                            : "brown",
                                                                color: "white",
                                                                fontSize: "8px",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            {data?.attendby}
                                                        </Button>{" "} */}
                                                        &nbsp;
                                                        {data?.uploadedimage && (
                                                            <>
                                                                <>
                                                                    <IconButton
                                                                        aria-label="view"
                                                                        onClick={() => {
                                                                            handleViewImageSubEdit(data);
                                                                        }}
                                                                    >
                                                                        <VisibilityOutlinedIcon
                                                                            sx={{ color: "#0B7CED" }}
                                                                        />
                                                                    </IconButton>
                                                                </>
                                                            </>
                                                        )}
                                                        &nbsp;{index + 1} . {data.question}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.userans
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            {/* <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.filter((data) => data?.status === "Eligible")
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid> */}
                                            {/* <Grid item md={1.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.map((t, i) => t.options)
                                                            ?.includes("NOANSWER") &&
                                                            data?.userans?.filter((item) => item !== "")
                                                                ?.length > 0
                                                            ? "Eligible"
                                                            : data.optionArr
                                                                ?.filter((item) =>
                                                                    data.userans.includes(item.options)
                                                                )
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                                                                .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid> */}
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            {/* <Grid item md={0.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data?.userans?.filter((item) => item !== "")
                                                            ?.length > 0 &&
                                                            data.optionArr
                                                                ?.map((t) => t.options)
                                                                ?.includes("NOANSWER") ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : data?.type === "Date Range" &&
                                                            data?.userans?.length > 0 &&
                                                            new Date(data?.userans[0]) >=
                                                            new Date(data?.optionArr[0].options) &&
                                                            new Date(data?.userans[0]) <=
                                                            new Date(data?.optionArr[1].options) ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : data?.type !== "Date Range" &&
                                                            data?.userans?.filter((item) => item !== "")
                                                                ?.length > 0 &&
                                                            data.optionArr
                                                                ?.filter((item) =>
                                                                    data.userans.includes(item.options)
                                                                )
                                                                ?.map((t, i) => t.status)
                                                                .filter((item) => item.trim() === "Eligible")
                                                                .length >=
                                                            data.optionArr
                                                                ?.filter(
                                                                    (item) =>
                                                                        data.userans.includes(item.options) &&
                                                                        (item?.status === "Not-Eligible" ||
                                                                            item?.status === "Manual Decision")
                                                                )
                                                                ?.map((t, i) => t.status).length ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : (
                                                            <CancelIcon color="error" />
                                                        )}
                                                    </Typography>
                                                </FormControl>
                                            </Grid> */}
                                        </Grid>
                                        <br />
                                    </>
                                );
                            })}

                            {roundmasterEdit?.interviewForm?.length > 0 &&
                                roundmasterEdit?.interviewForm?.some(
                                    (form) => form.secondarytodo && form.secondarytodo.length > 0
                                ) && (
                                    <Grid container spacing={2}>
                                        <Grid item md={12} xs={12} sm={12}>
                                            <Typography sx={userStyle.HeaderText}>
                                                {" "}
                                                Sub Questions
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Questions </Typography>
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">User Ans </Typography>
                                            </FormControl>
                                        </Grid>
                                        {/* <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Correct Ans </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">User Ans Status </Typography>
                                            </FormControl>
                                        </Grid> */}
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Options </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={0.5} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Status </Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                            <br />
                            {roundmasterEdit?.interviewForm?.length > 0 &&
                                roundmasterEdit?.interviewForm?.map((data, index) => {
                                    return data?.secondarytodo?.map((item, ind) => (
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography
                                                            style={{
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                maxWidth: "100%",
                                                            }}
                                                            title={item.question}
                                                        >
                                                            {item.uploadedimage && (
                                                                <>
                                                                    <>
                                                                        <IconButton
                                                                            aria-label="view"
                                                                            onClick={() => {
                                                                                handleViewImageSubEdit(item);
                                                                            }}
                                                                        >
                                                                            <VisibilityOutlinedIcon
                                                                                sx={{ color: "#0B7CED" }}
                                                                            />
                                                                        </IconButton>
                                                                    </>
                                                                </>
                                                            )}
                                                            &nbsp; {index + 1}.{ind + 1} {item?.question}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {item?.userans
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t + " ")
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                {/* <Grid item md={2} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {item?.optionslist
                                                                ?.filter((data) => data?.status === "Eligible")
                                                                ?.map(
                                                                    (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                                                )
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={1.5} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            {item?.optionslist
                                                                ?.map((t, i) => t?.answer)
                                                                ?.includes("NOANSWER") &&
                                                                item?.userans?.filter((item) => item !== "")
                                                                    ?.length > 0
                                                                ? "Eligible"
                                                                : item?.optionslist
                                                                    ?.filter((data) =>
                                                                        item?.userans.includes(data?.answer)
                                                                    )
                                                                    ?.map(
                                                                        (t, i) => `${i + 1 + ". "}` + t.status
                                                                    )
                                                                    .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid> */}

                                                <Grid item md={2} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {item?.optionslist
                                                                ?.map(
                                                                    (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                                                )
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={0.5} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            {item?.userans?.filter((item) => item !== "")
                                                                ?.length > 0 &&
                                                                item?.optionslist
                                                                    ?.map((t, i) => t?.answer)
                                                                    ?.includes("NOANSWER") ? (
                                                                <CheckCircleIcon color="success" />
                                                            ) : item?.type === "Date Range" &&
                                                                item?.userans?.length > 0 &&
                                                                new Date(item?.userans[0]) >=
                                                                new Date(item?.optionslist[0].answer) &&
                                                                new Date(item?.userans[0]) <=
                                                                new Date(item?.optionslist[1].answer) ? (
                                                                <CheckCircleIcon color="success" />
                                                            ) : item?.type !== "Date Range" &&
                                                                item?.userans?.filter((item) => item !== "")
                                                                    ?.length > 0 &&
                                                                item?.optionslist
                                                                    ?.filter((data) =>
                                                                        item?.userans.includes(data?.answer)
                                                                    )
                                                                    ?.map((t, i) => t.status)
                                                                    .filter((item) => item.trim() === "Eligible")
                                                                    .length >=
                                                                item.optionslist
                                                                    ?.filter(
                                                                        (data) =>
                                                                            item?.userans.includes(data?.answer) &&
                                                                            (data?.status === "Not-Eligible" ||
                                                                                data?.status === "Manual Decision")
                                                                    )
                                                                    ?.map((t, i) => t.status).length ? (
                                                                <CheckCircleIcon color="success" />
                                                            ) : (
                                                                <CancelIcon color="error" />
                                                            )}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <br />
                                        </>
                                    ));
                                })}
                        </>

                        <br /> <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} sm={2} xs={12}>
                                {" "}
                                <Button sx={userStyle.btncancel} onClick={handleCloseview}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
        </Box>
    );
}

export default Exitlist;