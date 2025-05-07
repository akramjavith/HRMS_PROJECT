import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, TextareaAutosize, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BASE_URL } from "../../services/Authservice";
import axios from "axios";
import Selects from "react-select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";



const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
        complete: {
            textTransform: "capitalize !IMPORTANT",
            padding: "7px 19px",
            backgroundColor: "#00905d",
            height: "fit-content",
        },
    },
}));

function RaiseticketOpenList({ changed, setChanged }) {
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
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

    let exportColumnNames = ['Status',
        'Ticket Number',
        'Raised By',
        'Raised Date',
        'Employee Name',
        'Employee Code',
        'Category',
        'Subcategory ',
        'Sub 1 category '];
    let exportRowValues = [
        'status',
        'raiseticketcount',
        'raisedby',
        'raiseddate',
        'employeename',
        'employeecode',
        'category',
        'subcategory',
        'subsubcategory'
    ];

    const classes = useStyles();
    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const [filterValue, setFilterValue] = useState("All Ticket");
    const { isUserRoleCompare, isUserRoleAccess, pageName,
        setPageName,
        buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    const [ticketStatusChange, setTicketStatusChange] = useState("Please Select Status");
    const [textAreaCloseDetails, setTextAreaCloseDetails] = useState("");
    //Datatable
    const [queueCheck, setQueueCheck] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    // Error Popup model
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [capturedImages, setCapturedImages] = useState([]);
    const [refImage, setRefImage] = useState([]);
    const [refImageDrag, setRefImageDrag] = useState([]);



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

    const getFileIcon = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };

    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const renderFilePreview = async (file) => {
        const { path } = file;
        console.log(file, 'file')
        if (path) {
            const url = `${BASE_URL}/${path}`; // Construct the URL based on your server setup
            window.open(url, "_blank");
        } else {
            const url = URL.createObjectURL(file);
            window.open(url, "_blank");
        }
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };

    const backPage = useNavigate();
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Error Popup model
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
    const [showViewAlert, setShowViewAlert] = useState();
    const handleClickOpenViewpop = () => {
        setIsViewOpen(true);
    };
    const handleCloseViewpop = () => {
        setIsViewOpen(false);
    };
    const handleClickOpenStaus = () => {
        setIsStatusChangeOpen(true);
    };
    const handleCloseViewStaus = () => {
        setIsStatusChangeOpen(false);
        setTicketStatusChange("Please Select Status");
        setTextAreaCloseDetails("");
    };
    //delete model
    const [openDelete, setOpenDelete] = useState(false);
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const handleSubmitStatusChange = (e) => {
        e.preventDefault();
        if (ticketStatusChange === "Please Select Status") {
            setPopupContentMalert('Please Select Status');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (textAreaCloseDetails === "" || textAreaCloseDetails === undefined) {
            setPopupContentMalert('Please Enter Reason');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequestToChangeStatus();
        }
    }
    const sendRequestToChangeStatus = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${singleDoc?._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                raiseself: ticketStatusChange,
                ticketclosed: String(isUserRoleAccess.companyname),
                resolvedate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
                textAreaCloseDetails: textAreaCloseDetails,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllRaisedTickets();
            setChanged(singleDoc?._id)
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            setTicketStatusChange("Please Select Status");
            setTextAreaCloseDetails("");
            handleClickOpenPopup();
            handleCloseViewStaus();
            setChanged("Changed the Ticket Status")
            backPage("/tickets/listtickets");
        } catch (err) { console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    const dataGridStyles = {
        root: {
            "& .MuiDataGrid-row": {
                height: "15px",
            },
        },
    };
    const [allUploadedFiles, setAllUploadedFiles] = useState([]);
    //get all project.
    const fetchAllRaisedTickets = async () => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.RAISETICKETOPEN, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let ans = isUserRoleAccess.role.map(data => data.toLowerCase())
            const isPresent = ans.some(value => ['manager', 'superadmin'].includes(value));
            const checkList = isPresent ? res_queue?.data.raisetickets.filter(data => data.raiseself === "Open") : res_queue?.data.raisetickets.filter(data => data.employeename.includes(isUserRoleAccess.companyname) && data.raiseself === "Open")
            const answer = checkList?.length > 0 ? checkList?.map((item, index) => ({
                ...item, serialNumber: index + 1,
                employeename: item.employeename
                    ?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
                employeecode: item.employeecode
                    ?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
                category: item.category,
                subcategory: item.subcategory,
                subsubcategory:
                    item.subsubcategory === "Please Select Sub Sub-category"
                        ? ""
                        : item.subsubcategory,
                workstation: item.workstation,
                materialname:
                    item.materialname === "Please Select Material Name"
                        ? ""
                        : item.materialname,
                type: item.type,
                raiseddate: item.raiseddate,
                raisedby: item.raisedby,
                // resolverby: item?.resolverby?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                resolverby: item?.ticketclosed,
                resolvedate: item.resolvedate,
                raiseticketcount: item.raiseticketcount,
                reason: item.textAreaCloseDetails,
                priority: item.priority,
                status: item.raiseself,
                duedate: item.duedate,
                title: item.title,
                description: convertToNumberedList(item.description),

            })) : [];
            setRaiseTicketList(answer);
            setQueueCheck(true);
        } catch (err) { setQueueCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        fetchAllRaisedTickets();
    }, []);
    useEffect(() => {
        fetchAllRaisedTickets();
    }, [changed]);



    const [singleDoc, setSingleDoc] = useState({});

    const [updateDetails, setUpDateDetails] = useState({});
    let updateby = singleDoc?.updatedby;
    let addedby = singleDoc?.addedby;

    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res.data.sraiseticket);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getrowData = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res.data.sraiseticket);
            setCapturedImages(res?.data?.sraiseticket?.files);
            setRefImage(res?.data?.sraiseticket?.files);
            handleClickOpenViewpop();
            setRefImageDrag(res?.data?.sraiseticket?.files);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getStatusForTicket = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res.data.sraiseticket);
            handleClickOpenStaus();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Combine all arrays into a single array
    let combinedArray = allUploadedFiles.concat(refImage, refImageDrag, capturedImages);

    // Create an empty object to keep track of unique values
    let uniqueValues = {};

    // Filter out duplicates and create a new array
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });




    const getInfoDetails = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res.data.sraiseticket);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        status: true,
        raiseticketcount: true,
        raisedby: true,
        raiseddate: true,
        category: true,
        subcategory: true,
        subsubcategory: true,
        employeename: true,
        employeecode: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(raiseTicketList);
    }, [raiseTicketList]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
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
            headerName: "S.No",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 100,
            hide: !columnVisibility.status,
            pinned: "left",
            lockPinned: true,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.data.status === "Open" ? "red" :
                                params.data.status === "Resolved" ? "green" :
                                    params.data.status === "Details Needed" ? "blue" :
                                        params.data.status === "Closed" ? 'Orange' :
                                            params.data.status === "Forwarded" ? "palevioletred" :
                                                params.data.status === "Reject" ? "darkmagenta" : 'violet'
                        }}>{params.data.status}</Typography>                </Grid>

                </Grid>

            ),
        },
        {
            field: "raiseticketcount",
            headerName: "Ticket Number",
            flex: 0,
            width: 200,
            hide: !columnVisibility.raiseticketcount,
        },
        {
            field: "raisedby",
            headerName: "Raised By",
            flex: 0,
            width: 100,
            hide: !columnVisibility.raisedby,
        },
        {
            field: "raiseddate",
            headerName: "Raised Date/Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.raiseddate,
        },
        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeename,
        },
        {
            field: "employeecode",
            headerName: "Employee Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeecode,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 100,
            hide: !columnVisibility.category,
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 150,

            hide: !columnVisibility.subcategory,
        },
        {
            field: "subsubcategory",
            headerName: "Sub 1 category",
            flex: 0,
            width: 150,

            hide: !columnVisibility.subsubcategory,
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            sortable: false,
            hide: !columnVisibility.actions,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {((params.data.status !== 'Closed') && (params.data.status !== 'Resolved') && (params.data.status !== 'Reject')) ?
                        (isUserRoleCompare?.includes("eraiseticket")) && (
                            <Link to={`/tickets/raiseticketmaster/${params.data.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                                    <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontSize: "large" }} />
                                </Button>
                            </Link>
                        ) : ""}
                    {isUserRoleCompare?.includes("vraiseticket") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getrowData(params.data.id);

                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iraiseticket") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getInfoDetails(params.data.id);

                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vraiseticket") && (
                        <Button
                            sx={buttonStyles.buttonsubmit}
                            onClick={(e) => {
                                getStatusForTicket(params.data.id);

                            }}
                        >
                            Status
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    // Function to remove HTML tags and convert to numbered list
    const convertToNumberedList = (htmlContent) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;

        const listItems = Array.from(tempElement.querySelectorAll("li"));
        listItems.forEach((li, index) => {
            li.innerHTML = `\u2022 ${li.innerHTML}\n`;
        });

        return tempElement.innerText;
    };

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            employeename: item.employeename,
            employeecode: item.employeecode,
            category: item.category,
            subcategory: item.subcategory,
            subsubcategory: item.subsubcategory ===
                "Please Select Sub Sub-category"
                ? ""
                : item.subsubcategory,
            workstation: item.workstation,
            materialname: item.materialname,
            type: item.type,
            raiseddate: item.raiseddate,
            type: item.type,
            raisedby: item.raisedby,
            resolverby: item?.ticketclosed,
            resolvedate: item.resolvedate,
            raiseticketcount: item.raiseticketcount,
            reason: item.textAreaCloseDetails,
            priority: item.priority,
            status: item.raiseself,
            duedate: item.duedate,
            title: item.title,
            description: item.description,
        };
    });

    // Excel
    const fileName = "Raise Ticket(Open)";
    let snos = 1;
    // this is the etimation concadination value

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Raise Ticket(Open)",
        pageStyle: "print",
    });



    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Raise Ticket Open List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const [copiedData, setCopiedData] = useState("");

    return (
        <Box>
            {/* <Headtitle title={"RAISE TICKET LIST"} /> */}
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Raise Ticket List (Open)</Typography>

            {!queueCheck ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("lconsolidatedticketlist") && (
                        <>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>

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
                                        <MenuItem value={raiseTicketList?.length}>All</MenuItem>
                                    </Select>

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
                                    {isUserRoleCompare?.includes("excelconsolidatedticketlist") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvconsolidatedticketlist") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printconsolidatedticketlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfconsolidatedticketlist") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageconsolidatedticketlist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={raiseTicketList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={items}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            {/* ****** Table Grid Container ****** */}

                            <br />
                            <br />
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>{" "}
                            &emsp;
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
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
                        </>
                    )}
                </>
            )}

            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isViewOpen}
                    onClose={handleCloseViewpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "scroll",
                        "& .MuiPaper-root": {
                            overflow: "scroll",
                        },
                        marginTop: "40px"
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>View Raise Ticket</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                {singleDoc.accessdrop === "Manager" ? (
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>Company</Typography>
                                                <Typography>{singleDoc.company}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>Branch</Typography>
                                                <Typography>{singleDoc.branch}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>Unit</Typography>
                                                <Typography>{singleDoc.unit}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>Team</Typography>
                                                <Typography>{singleDoc.team}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Employee Name</Typography>
                                        <Typography>{singleDoc.employeename?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Employee Code</Typography>
                                        <Typography>{singleDoc.employeecode?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Category</Typography>
                                        <Typography>{singleDoc.category}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Sub-Category</Typography>
                                        <Typography>{singleDoc.subcategory}</Typography>
                                    </FormControl>
                                </Grid>
                                {singleDoc.subsubcategory &&
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.HeaderText}>Sub Sub-Category</Typography>
                                            <Typography>{singleDoc.subsubcategory === "Please Select Sub Sub-category" ? "" : singleDoc.subsubcategory}</Typography>
                                        </FormControl>
                                    </Grid>}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Type</Typography>
                                        <Typography>{singleDoc.type}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Reason</Typography>
                                        <Typography>{singleDoc.reason}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Work Station</Typography>
                                        <Typography>{singleDoc?.workstation}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Material Name</Typography>
                                        <Typography>{singleDoc?.materialname}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Priority</Typography>
                                        <Typography>{singleDoc.priority}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Title</Typography>
                                        <Typography>{singleDoc.title}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Description</Typography>
                                        <Typography>{convertToNumberedList(singleDoc.description)}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Status</Typography>
                                        <Typography>{singleDoc?.raiseself}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Reason For Ticket Status </Typography>
                                        <Typography>{singleDoc?.textAreaCloseDetails}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} xs={12} sm={12}>

                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    {resultArray.map((file, index) => (
                                        <>
                                            <Grid container>
                                                <Grid item md={8} sm={8} xs={8} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <Typography variant="subtitle2"> {file.name} </Typography>
                                                </Grid>
                                                <Grid item md={1} sm={1} xs={1}>
                                                    <Grid sx={{ display: "flex" }}>
                                                        <Button
                                                            sx={{
                                                                padding: "14px 14px",
                                                                minWidth: "40px !important",
                                                                borderRadius: "50% !important",
                                                                ":hover": {
                                                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                                                },
                                                            }}
                                                            onClick={() => renderFilePreview(file)}
                                                        >
                                                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "12px", color: "#357AE8" }} />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ))}
                                </Grid>
                            </Grid>

                            <br />

                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={6} xs={6} sm={6}>
                                    <Button sx={buttonStyles.btncancel} variant="contained" onClick={handleCloseViewpop}>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* </DialogContent> */}
                        </>
                    </Box>
                </Dialog>
            </Box>
            <Box>
                {/* Status Change DIALOG */}
                <Dialog
                    open={isStatusChangeOpen}
                    onClose={handleCloseViewStaus}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "scroll",
                        "& .MuiPaper-root": {
                            overflow: "scroll",
                        },
                        marginTop: "40px"
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>Change Ticket Status</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Employee Name</Typography>
                                        <Typography>{singleDoc?.employeename?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Employee Code</Typography>
                                        <Typography>{singleDoc?.employeecode?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Ticket Number</Typography>
                                        <Typography>{singleDoc?.raiseticketcount}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Category</b></Typography>
                                        <Typography>{singleDoc.category}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Sub-Category</b></Typography>
                                        <Typography>{singleDoc.subcategory}</Typography>
                                    </FormControl>
                                </Grid>
                                {singleDoc.subsubcategory &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.HeaderText}><b>Sub Sub-Category</b></Typography>
                                            <Typography>{singleDoc.subsubcategory === "Please Select Sub Sub-category" ? "" : singleDoc.subsubcategory}</Typography>
                                        </FormControl>
                                    </Grid>}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Type</b></Typography>
                                        <Typography>{singleDoc.type}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Reason</b></Typography>
                                        <Typography>{singleDoc.reason}</Typography>
                                    </FormControl>
                                </Grid>
                                {singleDoc?.workstation && <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Work Station</b></Typography>
                                        <Typography>{singleDoc?.workstation}</Typography>
                                    </FormControl>
                                </Grid>}

                                {(singleDoc?.materialname !== "" || singleDoc?.materialname !== "Please Select Material Name") &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.HeaderText}><b>Material Name</b></Typography>
                                            <Typography>{singleDoc?.materialname}</Typography>
                                        </FormControl>
                                    </Grid>}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Priority</b></Typography>
                                        <Typography>{singleDoc.priority}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Title</b></Typography>
                                        <Typography>{singleDoc.title}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}><b>Status</b></Typography>
                                        <Typography>{singleDoc?.raiseself}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            <b>Change Ticket Status to<b style={{ color: "red" }}>*</b></b>
                                        </Typography>
                                        <Selects
                                            options={[{ label: "Closed", value: "Closed" }, { label: "Resolved", value: "Resolved" }]}
                                            styles={colourStyles}
                                            value={{
                                                label: ticketStatusChange,
                                                value: ticketStatusChange,
                                            }}
                                            onChange={(e) => {
                                                setTicketStatusChange(e.value);
                                            }}
                                        />
                                    </FormControl>

                                </Grid>
                                {(ticketStatusChange !== "" && ticketStatusChange !== 'Please Select Status') && <Grid item md={3} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        {" "}
                                        <b>
                                            Reason<b style={{ color: "red" }}>*</b>
                                        </b>{" "}
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        value={textAreaCloseDetails}
                                        onChange={(e) => {
                                            setTextAreaCloseDetails(e.target.value);
                                        }}
                                    />
                                </Grid>}


                            </Grid>

                            <br />

                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmitStatusChange}>
                                        Change
                                    </Button>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseViewStaus}>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* </DialogContent> */}
                        </>
                    </Box>
                </Dialog>
            </Box >
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
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
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                            sx={buttonStyles.buttonsubmit}
                        >
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
                itemsTwo={raiseTicketList ?? []}
                filename={"Raise Ticket Open List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Raise Ticket Info"
                addedby={addedby}
                updateby={updateby}
            />

            <br />
            <br />
        </Box >
    );
}

export default RaiseticketOpenList;