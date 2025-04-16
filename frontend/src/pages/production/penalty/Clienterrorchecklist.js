import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Chip, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import StyledDataGrid from "../../../components/TableStyle";
import jsPDF from "jspdf";
import Selects from "react-select";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
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
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { SettingsPhone } from "@material-ui/icons";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../../components/Pagination';
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import AlertDialog from "../../../components/Alert";


function Clienerrorchecklist() {

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



    const gridRef = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const [selectedMode, setSelectedMode] = useState("Today");

    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    let exportColumnNames = ['Vendor',
        'Date',
        'Time',
        'Category',
        'Sub Category',
        'Identifier',
        'Login Id',
        'Section',
        'Flag Count',
        'Doc Number',
        'Status',
        'Approval Status',
        'Late Entry Status'];
    let exportRowValues = ['vendor', 'fromdate',
        'time', 'filename',
        'category', 'unitid',
        'user', 'section',
        'flagcount', 'docnumber',
        'status', 'approvalstatus',
        'lateentrystatus'];

    //    today date fetching
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;


    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");




    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)


    const [vendors, setVendors] = useState([]);

    const [projmaster, setProjmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [projectData, setProjectData] = useState([]);
    const [items, setItems] = useState([]);
    const [sorting, setSorting] = useState({ column: "", direction: "" });
    const [searchQuery, setSearchQuery] = useState("");

    const [allProjectedit, setAllProjectedit] = useState([]);

    const [copiedData, setCopiedData] = useState("");






    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'clienterrorchecklist .png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const username = isUserRoleAccess.username;
    const userData = {
        name: username,
        date: new Date(),
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

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        vendor: true,
        fromdate: true,
        filename: true,
        category: true,
        unitid: true,
        user: true,
        section: true,
        flagcount: true,
        alllogin: true,
        docnumber: true,
        status: true,
        lateentrystatus: true,
        approvalstatus: true,
        actions: true,
        actionsstatus: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        if (fromdate === "") {
            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (todate === "") {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (new Date(todate) < new Date(fromdate)) {
            // Check if todate is less than fromdate
            setPopupContentMalert("To Date must be greater than or equal to From Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            // If all conditions are met, proceed with the fetch
            fetchProductionIndividual();
        }
    };


    const handleclear = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setFromdate(today)
        setTodate(today)
        setSelectedMode("Today")
        let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_DATEFILTER, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            status: String("Approved"),
            fromdate: today,
            todate: today
        });

        setProjmaster(res_project?.data?.productionIndividualdate);
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();

    };







    //get all project.
    const fetchProductionIndividual = async () => {
        setPageName(!pageName)
        try {
            setProjectCheck(true);
            let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_DATEFILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
                fromdate: fromdate,
                todate: todate
            });
            const ans = res_project?.data?.productionIndividualdate?.length > 0 ? res_project?.data?.productionIndividualdate : []

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });

            setProjmaster(itemsWithSerialNumber);


            setProjectCheck(false);
        } catch (err) { setProjectCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [projmasterArray, setProjmasterArray] = useState([])

    const fetchProductionIndividualArray = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_DATEFILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
                fromdate: fromdate,
                todate: todate
            });

            setProjmasterArray(res_project?.data?.productionIndividualdate);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchProductionIndividualArray()
    }, [isFilterOpen])
    //get all project.

    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Vendor", field: "vendor" },
        { title: "Date", field: "fromdate" },
        { title: "Time", field: "time" },
        { title: "Category", field: "filename" },
        { title: "Sub Category", field: "category" },
        { title: "Identifier", field: "unitid" },
        { title: "Login Id", field: "user" },
        { title: "Section", field: "section" },
        { title: "Flag Count", field: "flagcount" },
        { title: "Doc Number", field: "docnumber" },
        { title: "Status", field: "status" },
        { title: "Approval Status", field: "approvalstatus" },
        { title: "Late Entry Status", field: "lateentrystatus" },
    ];

    //  pdf download functionality
    // const downloadPdf = () => {
    //     const doc = new jsPDF();
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: {
    //             fontSize: 4,
    //         },
    //         columns: columns.map((col) => ({ ...col, dataKey: col.field })),
    //         body: rowDataTable,
    //     });
    //     doc.save("Approve List.pdf");
    // };
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
            projmasterArray.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                fromdate: moment(row.fromdate).format("DD/MM/YYYY"),
            }));

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

        doc.save("Approve List.pdf");
    };

    // Excel
    const fileName = "Approve List";



    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Approve List",
        pageStyle: "print",
    });


    // const addSerialNumber = () => {

    //     const itemsWithSerialNumber = projmaster?.map((item, index) => ({
    //         ...item, serialNumber: index + 1,

    //         // approvalstatus: (item.approvaldate === item.createdAt.split("T")[0]) ? "" : "Late Approval"
    //         // approvalstatus: (item.approvaldate && item.approvaldate != "" && item.approvaldate != item.createdAt.split("T")[0]) ? "Late Approval" : ""


    //     }));
    //     setItems(itemsWithSerialNumber);
    // };

    const addSerialNumber = async (datas) => {
        // let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
        // let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;

        // const itemsWithSerialNumber = datas?.map((item, index) => {
        //     const fromDate = new Date(item.createdAt);

        //     const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

        //     let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
        //     let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
        //     let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

        //     let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
        //     let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
        //     let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1

        //     const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);

        //     const currentDateTime = new Date();

        //     const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);
        //     return {
        //         ...item, serialNumber: index + 1,

        //         fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
        //         lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
        //         approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
        //             ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
        //                 ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
        //                     ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
        //                         "On Approval"
        //     }


        // });
        setItems(datas);
    };


    useEffect(() => {
        addSerialNumber(projmaster);
    }, [projmaster]);


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

    const columnDataTable = [


        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Employee Name", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "SubCategory", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
        { field: "user", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "section", headerName: "Line", flex: 0, width: 150, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "Error Value", flex: 0, width: 150, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "alllogin", headerName: "Correct Value", flex: 0, width: 150, hide: !columnVisibility.alllogin, headerClassName: "bold-header" },
        { field: "docnumber", headerName: "Client Error", flex: 0, width: 150, hide: !columnVisibility.docnumber, headerClassName: "bold-header" },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            fromdate: item.fromdate,
            filename: item.filename,
            category: item.category,
            unitid: item.unitid,
            user: item.user,
            section: item.section,
            flagcount: item.flagcount,
            alllogin: item.alllogin,
            docnumber: item.docnumber,
            status: item.status,
            approvalstatus: item.approvalstatus,
            time: item.time,
            lateentrystatus: item.lateentrystatus
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



    const fetchVendors = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
                ...d,
                label: d.projectname + "-" + d.name,
                value: d.projectname + "-" + d.name,
            }));
            setVendors(vendorall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        // fetchProductionIndividual();
        fetchVendors();
    }, []);

    const [fileFormat, setFormat] = useState('')
    // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    // const exportToCSV = (csvData, fileName) => {
    //     const ws = XLSX.utils.json_to_sheet(csvData);
    //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     const data = new Blob([excelBuffer], { type: fileType });
    //     FileSaver.saveAs(data, fileName + fileExtension);
    // }


    // const handleExportXL = (isfilter) => {
    //     if (isfilter === "filtered") {
    //         exportToCSV(
    //             rowDataTable?.map((t, index) => ({
    //                 Sno: index + 1,
    //                 "Vendor": t.vendor,
    //                 "Date": t.fromdate,
    //                 "Time": t.time,
    //                 "Category": t.filename,
    //                 "SubCategory": t.category,
    //                 "Identifier": t.unitid,
    //                 "Login Id": t.user,
    //                 "Section": t.section,
    //                 "Flag Count": t.flagcount,
    //                 "alllogin": t.alllogin,
    //                 "Doc Number": t.docnumber,
    //                 "Status": t.status,
    //                 "Approval Status": t.approvalstatus,
    //                 "Late Entry Status": t.lateentrystatus
    //             })),
    //             fileName,
    //         );
    //     }
    //     else if (isfilter === "overall") {
    //         exportToCSV(
    //             projmasterArray.map((t, index) => ({
    //                 Sno: index + 1,
    //                 "Vendor": t.vendor,
    //                 "Date": moment(t.fromdate).format("DD/MM/YYYY"),
    //                 "Time": t.time,
    //                 "Category": t.filename,
    //                 "SubCategory": t.category,
    //                 "Identifier": t.unitid,
    //                 "Login Id": t.user,
    //                 "Section": t.section,
    //                 "Flag Count": t.flagcount,
    //                 "alllogin": t.alllogin,
    //                 "Doc Number": t.docnumber,
    //                 "Status": t.status,
    //                 "Approval Status": t.approvalstatus,
    //                 "Late Entry Status": t.lateentrystatus

    //             })),
    //             fileName,
    //         );

    //     }

    //     setIsFilterOpen(false)
    // };


    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        switch (mode) {
            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            default:
                fromdate = todate = "";
        }

        return { fromdate, todate };
    };


    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Approve List"),
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

    useEffect(() => {
        getapi();
    }, []);

    return (
        <Box>
            <Headtitle title={"Client Error Check List"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Client Error Check List"
                modulename="Production"
                submodulename="Manual Entry"
                mainpagename="Approve List"
                subpagename=""
                subsubpagename=""
            />

            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Add Client Error Checklist</Typography>
                    </Grid>
                    <>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Filter Mode<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        labelId="mode-select-label"
                                        options={mode}
                                        style={colourStyles}
                                        value={{ label: selectedMode, value: selectedMode }}
                                        onChange={(selectedOption) => {
                                            // Reset the date fields to empty strings
                                            let fromdate = '';
                                            let todate = '';

                                            // If a valid option is selected, get the date range
                                            if (selectedOption.value) {
                                                const dateRange = getDateRange(selectedOption.value);
                                                fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                                todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                            }

                                            // Set the state with formatted dates
                                            // setEbreadingdetailFilter({
                                            //   ...ebreadingdetailFilter,
                                            //   fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            //   todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            // });


                                            setFromdate(formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))))
                                            setTodate(formatDateForInput(new Date(todate.split('-').reverse().join('-'))))

                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>


                            </Grid>


                            <Grid item md={3} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        From Date
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedname"
                                        type="date"
                                        value={fromdate}
                                        disabled={selectedMode != "Custom"}
                                        onChange={(e) => {
                                            setFromdate(e.target.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To  Date
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedname"
                                        type="date"
                                        value={todate}
                                        disabled={selectedMode != "Custom"}
                                        onChange={(e) => {
                                            setTodate(e.target.value);
                                        }}
                                    />
                                </FormControl>

                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                                        Filter
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </>


            <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lclienterrorchecklist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Client Error List</Typography>
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
                                        <MenuItem value={projmaster?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelclienterrorchecklist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterrorchecklist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterrorchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterrorchecklist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterrorchecklist") && (
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

                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={projmaster}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                    />
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

                        {projectCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
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
                                    gridRefTable={gridRefTable}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalDatas}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                />
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
            {/*Export XL Data  */}
            {/* <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                            fetchProductionIndividualArray()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}
            {/*Export pdf Data  */}
            {/* <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
            </Dialog> */}

            {/* print layout */}
            {/* 
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>SubCategory</TableCell>
                            <TableCell>Identifier</TableCell>
                            <TableCell>Login ID</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Flag Count</TableCell>
                            <TableCell>All Login</TableCell>
                            <TableCell>Doc Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Approval Status</TableCell>
                            <TableCell>Late Entry Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.fromdate}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.filename}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.unitid}</TableCell>
                                    <TableCell>{row.user}</TableCell>
                                    <TableCell>{row.section}</TableCell>
                                    <TableCell>{row.flagcount}</TableCell>
                                    <TableCell>{row.alllogin}</TableCell>
                                    <TableCell>{row.docnumber}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.approvalstatus}</TableCell>
                                    <TableCell>{row.lateentrystatus}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}

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
                itemsTwo={projmaster ?? []}
                filename={"Approve List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
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

        </Box>
    );
}

export default Clienerrorchecklist;