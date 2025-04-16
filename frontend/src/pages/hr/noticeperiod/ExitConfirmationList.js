import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
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
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
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

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
    NotificationContainer
} from "react-notifications";
import { BASE_URL } from "../../../services/Authservice";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";

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


function ExitConfirmationList() {

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
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


    const [openNew, setOpenNew] = useState(false);
    const [selectedValueNew, setSelectedValueNew] = useState('');

    const handleClickOpenNew = () => {
        setOpenNew(true);
    };

    const handleCloseNew = () => {
        setOpenNew(false);
    };

    const handleSelectChangeNew = (event) => {
        setSelectedValueNew(event.target.value);
    };


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

    const [isBoardingApproved, setIsBoardingApproved] = useState(false);

    // let username = isUserRoleAccess.name
    // const id = useParams().id
    const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth, setAuth } = useContext(AuthContext);

    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const [isBoarding, setIsBoarding] = useState(false);


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


    // get single row to view....


    const handleCaptureImageApproved = () => {
        if (gridRef1.current) {
            html2canvas(gridRef1.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Exit Confirmation List.png");
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
        scheduledat: true,
        confirmationstatus: true,

    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setLoading(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //get all employees list details
    const fetchNoticeperiodlist = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
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
            let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
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
                "Confirmation Status": item.confirmationstatus || '',
                "Scheduled Date/Time": item.scheduledat || '',
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

        exportToExcel(formatData(dataToExport), 'Exit Confirmation List');
        setIsFilterOpen(false);
    };




    //  PDF
    // pdf.....
    const columns = [
        { title: "Confirmation Status", field: "confirmationstatus" },
        { title: "Scheduled Date/Time", field: "scheduledat" },
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

        doc.save("Exit Confirmation List.pdf");
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
        confirmationstatus: true,
    };

    // Show all columns
    const [columnVisibilityApproved, setColumnVisibilityApproved] = useState(
        initialColumnVisibilityApproved
    );




    useEffect(() => {

    }, [isFilterOpen2])

    //print...
    const componentRefApproved = useRef();
    const handleprintApproved = useReactToPrint({
        content: () => componentRefApproved.current,
        documentTitle: "Exit Confirmation List",
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
            scheduledat: item?.date && item?.time ? `${item?.date}/${item?.time}` : "",
            status: "Approved",
            exitstatus: item.exitstatus,
            approvedthrough: item.approvedthrough,
            username: item.username,
            password: item.password,
            interviewscheduled: item.interviewscheduled,
            testname: item.testname,
            interviewForm: item.interviewForm,
            confirmationstatus: item.confirmationstatus,
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

        setPageName(!pageName);
        try {

            let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${getDetails?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                confirmationstatus: String(selectedValueNew),
                continuestatus: selectedValueNew === 'continue' ? Boolean(true) : Boolean(false)
            });

            setPopupContent("Status Changed");
            setPopupSeverity("success");
            handleClickOpenPopup();

            await fetchUnassignedCandidates();

            handleCloseNew();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };




    const fetchUnassignedCandidates = async () => {
        setPageName(!pageName);
        try {
            const [res] = await Promise.all([
                axios.get(SERVICE.NOTICEPERIODAPPLY, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ])

            let ans = res?.data?.noticeperiodapply.filter((data) => {
                return (
                    data.approvedStatus === "true" &&
                    !data.cancelstatus &&
                    !data.continuestatus &&
                    data?.interviewForm?.length > 0 &&
                    isAssignBranch?.some(
                        (item) =>
                            item?.company === data?.company &&
                            item?.branch === data?.branch &&
                            item?.unit === data?.unit
                    )
                );
            });

            setemployeeApproved(ans);
            setIsBoardingApproved(true);

            setIsBoarding(true);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchUnassignedCandidates();
    }, [vendorAuto]);


    const [getDetails, setGetDetails] = useState([]);
    const getCodeList = async (details) => {
        setGetDetails(details);
        setPageName(!pageName);
        try {
            setSelectedValueNew(details?.confirmationstatus);
            handleClickOpenNew();
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
            field: "confirmationstatus",
            headerName: "Confirmation Status",
            flex: 0,
            width: 200,
            sortable: false,
            hide: !columnVisibility.confirmationstatus,
        },
        {
            field: "scheduleinterview",
            headerName: "Change Status",
            flex: 0,
            width: 200,
            sortable: false,
            hide: !columnVisibility.scheduleinterview,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <Grid item md={4} xs={12} sm={12}>
                        <div style={{
                            color: '#fff', border: '1px solid #237a57', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                            cursor: 'pointer', backgroundColor: '#237a57'
                        }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#50a7c2';
                                e.target.style.color = '#fff';
                            }} // Change background color on hover
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#237a57';
                                e.target.style.color = '#fff';
                            }}
                            onClick={() => {
                                getCodeList(params?.row)
                            }}
                        >
                            Change Status
                        </div>
                    </Grid>


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
                    </Grid>



                </Grid >
            ),
        },
        {
            field: "scheduledat",
            headerName: "Scheduled Date/Time",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.scheduledat,
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
            roundlink: `${BASE_URL}/interview/exitinterview/${notice._id}/${notice.testname}`,
            scheduledat: notice?.scheduledat,
            testname: notice.testname,
            interviewForm: notice.interviewForm,
            confirmationstatus: notice.confirmationstatus,

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



    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"EXIT CONFIRMATION LIST"} />
            <NotificationContainer />
            <PageHeading
                title="Exit Confirmation List"
                modulename="Interview"
                submodulename="Exit Interview"
                mainpagename="Exit Confirmation List"
                subpagename=""
                subsubpagename=""
            />
            <br />
            {isUserRoleCompare?.includes("lexitconfirmationlist") && (
                <>
                    <Box sx={userStyle.container}>
                        <br />
                        <Typography sx={userStyle.HeaderText}>
                            Exit Confirmation List
                        </Typography>

                        <Box>
                            <br />
                            {isUserRoleCompare?.includes("lexitconfirmationlist") && (
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
                                                            "csvexitconfirmationlist"
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
                                                            "excelexitconfirmationlist"
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
                                                            "printexitconfirmationlist"
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
                                                            "pdfexitconfirmationlist"
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
                                                            "imageexitconfirmationlist"
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
                            <StyledTableCell>Confirmationstatus</StyledTableCell>
                            <StyledTableCell>Scheduled Date/Time</StyledTableCell>
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
                                    <StyledTableCell>{row.confirmationstatus}</StyledTableCell>
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

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Options </Typography>
                                    </FormControl>
                                </Grid>

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

                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>

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

            <Dialog open={openNew} onClose={handleCloseNew}>
                <DialogTitle>Select an Option</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="select-label">Options</InputLabel>
                        <Select
                            labelId="select-label"
                            value={selectedValueNew}
                            onChange={handleSelectChangeNew}
                            label="Options"
                        >
                            <MenuItem value={'confirm'}>confirm</MenuItem>
                            <MenuItem value={'continue'}>continue</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNew}>Cancel</Button>
                    <Button onClick={sendRequestReason} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
        </Box>
    );
}

export default ExitConfirmationList;