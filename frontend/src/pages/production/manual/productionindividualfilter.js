import React, { useState, useEffect, useContext, useRef } from "react";
import {
    IconButton,
    Box,
    Chip,
    Typography,
    Paper,
    TableBody,
    TextField,
    List,
    ListItem,
    ListItemText,
    Popover,
    Checkbox,
    TableRow,
    Select,
    MenuItem,
    TableCell,
    FormControl,
    OutlinedInput,
    TableContainer,
    Grid,
    Table,
    TableHead,
    Button,
    DialogContent,
    DialogActions,
    Dialog,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import "jspdf-autotable";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import { ExportXL, ExportCSV } from "../../../components/Export";
import axios from "axios";
import moment from "moment";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Selects from "react-select";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MultiSelect } from "react-multi-select-component";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function ProductionIndividualFilter() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);


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

    let exportColumnNames = [
        "Vendor",
        "Company Name",
        "Date",
        "Time",
        "Category",
        "Sub Category",
        "Identifier",
        "Login Id",
        "Section",
        "Flag Count",
        "Doc Number",
        "Level",
        // 'Approvestatus',
        "Entry Status",
        "Approval Status",
    ];
    let exportRowValues = [
        "vendor",
        "companyname",
        "fromdate",
        "time",
        "filename",
        "category",
        "unitid",
        "user",
        "section",
        "flagcount",
        "docnumber",
        "level",
        // 'approvalstatus',
        "lateentrystatus",
        "approvalstatus",
    ];

    const gridRef = useRef(null);



    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Production_Individual_Filter_List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const [updatedIdsDisabled, setUpdatedIdsDisabled] = useState([]);
    const [updatedIdsDisabledReject, setUpdatedIdsDisabledReject] = useState([]);

    //get current month
    let month = new Date().getMonth() + 1;

    const { auth } = useContext(AuthContext);

    const [selectedVendor, setSelectedVendor] = useState([]);
    let [valueVendor, setValueVendor] = useState([]);

    const handleVendorChange = (options) => {
        setValueVendor(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedVendor(options);
    };

    const customValueRendererVendor = (valueVendor, _categoryname) => {
        return valueVendor?.length
            ? valueVendor.map(({ label }) => label)?.join(", ")
            : "Please Select Vendor";
    };

    //get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let monthname = monthstring[new Date().getMonth()];

    const [isMonthyear, setIsMonthYear] = useState({
        ismonth: month,
        isyear: currentYear,
        isuser: "",
    });
    const [isuser, setisuser] = useState([]);
    const [isAttandance, setIsAttandance] = useState(false);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles } =
        useContext(UserRoleAccessContext);
    let listpageaccessby =
        listPageAccessMode?.find(
            (data) =>
                data.modulename === "Production" &&
                data.submodulename === "Manual Entry" &&
                data.mainpagename === "Production Manual Entry Filter" &&
                data.subpagename === "" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const currentDate = new Date(); // Get the current date
    const currentDay = currentDate.getDate(); // Get the day of the month
    const currentMonth = currentDate.getMonth() + 1; // Get the day of the month

    // Get the total number of days in the month
    const daysInMonth = getDaysInMonth(isMonthyear.isyear, isMonthyear.ismonth);

    // Create an array of days from 1 to the total number of days in the month
    const daysArray = Array.from(
        new Array(daysInMonth),
        (val, index) => index + 1
    );

    const modeDropDowns = [
        { label: "My Hierarchy List", value: "myhierarchy" },
        { label: "All Hierarchy List", value: "allhierarchy" },
        { label: "My + All Hierarchy List", value: "myallhierarchy" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];
    const [modeselection, setModeSelection] = useState({
        label: "My Hierarchy List",
        value: "myhierarchy",
    });
    const [sectorSelection, setSectorSelection] = useState({
        label: "Primary",
        value: "Primary",
    });

    const handleClear = (e) => {
        e.preventDefault();
        setProducionIndividual({
            vendor: "Choose Vendor",
        });
        setSectorSelection({ label: "Primary", value: "Primary" });
        setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
        setisuser([]);
        setSelectedVendor([]);
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();
    };

    // Excel
    const fileName = "Production_Individual_Filter_List";

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Production_Individual_Filter_List",
        pageStyle: "print",
    });

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
        companyname: true,
        fromdate: true,
        time: true,
        category: true,
        filename: true,
        unitid: true,
        user: true,
        section: true,
        flagcount: true,
        alllogin: true,
        docnumber: true,
        level: true,
        status: true,
        approvalstatus: true,
        lateentrystatus: true,
        actionsstatus: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [items, setItems] = useState([]);

    // const addSerialNumber = () => {
    //     const itemsWithSerialNumber = isuser?.map((item, index) => ({
    //         ...item, serialNumber: index + 1,
    //         fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
    //     }));
    //     setItems(itemsWithSerialNumber);
    // };

    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => {
        //     const fromDate = new Date(item.createdAt);
        //     const fromDatePlus24Hours = new Date(
        //         fromDate.getTime() + 24 * 60 * 60 * 1000
        //     );
        //     const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);
        //     const fromDatePlus48Hours = new Date(
        //         fromDaten.getTime() + 48 * 60 * 60 * 1000
        //     );
        //     return {
        //         ...item,
        //         serialNumber: index + 1,

        //         fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
        //         lateentrystatus:
        //             fromDate > fromDatePlus48Hours ? "Late Entry" : "On Entry",
        //         approvalstatus:
        //             (item.approvaldate === "" ||
        //                 item.approvaldate === null ||
        //                 item.approvaldate === undefined) &&
        //                 item.status === "Approved"
        //                 ? ""
        //                 : new Date() <= fromDatePlus24Hours &&
        //                     (item.approvaldate === "" ||
        //                         item.approvaldate === null ||
        //                         item.approvaldate === undefined)
        //                     ? "Pending"
        //                     : new Date() > fromDatePlus24Hours &&
        //                         (item.approvaldate === "" ||
        //                             item.approvaldate === null ||
        //                             item.approvaldate === undefined)
        //                         ? "Late Not Approval"
        //                         : new Date() > fromDatePlus24Hours && item.approvaldate
        //                             ? "Late Approval"
        //                             : "On Approval",
        //     };
        // });
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(isuser);
    }, [isuser]);

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

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

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
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable?.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable?.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     cellRenderer: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRows.filter(
        //                         (selectedId) => selectedId !== params.data.id
        //                     );
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.data.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(
        //                     updatedSelectedRows.length === filteredData.length
        //                 );
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 90,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 90,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid container spacing={1}>
                    <Grid item md={6} xs={6} sm={6}>
                        {params.data.status == "Approved" ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                disabled={params.data.status == "Approved"}
                                sx={{ textTransform: "capitalize", padding: "3px" }}
                            >
                                Done
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                sx={{
                                    textTransform: "capitalize",
                                    padding: "3px",
                                    backgroundColor: updatedIdsDisabledReject?.includes(
                                        params.data.id
                                    )
                                        ? "#1775ce"
                                        : updatedIdsDisabled.includes(params.data.id)
                                            ? "lightgrey"
                                            : "#1775ce",
                                    color: updatedIdsDisabledReject?.includes(params.data.id)
                                        ? "#fff !important"
                                        : updatedIdsDisabled.includes(params.data.id)
                                            ? "lightgrey"
                                            : "#fff !important",
                                    border: updatedIdsDisabled?.includes(params.data.id)
                                        ? "2px solid #1775ce"
                                        : "none",
                                    "&:hover": {
                                        backgroundColor: updatedIdsDisabledReject?.includes(
                                            params.data.id
                                        )
                                            ? "#1775ce"
                                            : updatedIdsDisabled.includes(params.data.id)
                                                ? "lightgrey"
                                                : "#1775ce",
                                        color: updatedIdsDisabledReject?.includes(params.data.id)
                                            ? "#fff !important"
                                            : updatedIdsDisabled.includes(params.data.id)
                                                ? "lightgrey"
                                                : "#fff !important",
                                    },
                                }}
                                disabled={
                                    updatedIdsDisabled.includes(params.data.id) ||
                                    updatedIdsDisabledReject?.includes(params.data.id)
                                }
                                onClick={() =>
                                    handleSubmit(
                                        params.data.id,
                                        params.data.createdAt,
                                        params.data.approvaldate
                                    )
                                }
                            >
                                {/* Approve */}
                                {updatedIdsDisabled?.includes(params.data.id)
                                    ? "Approved"
                                    : "Approve"}
                            </Button>
                        )}
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                        {params.data.status == "Rejected" ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                disabled={params.data.status == "Rejected"}
                                sx={{ textTransform: "capitalize", padding: "3px" }}
                            >
                                Done
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                sx={{
                                    textTransform: "capitalize",
                                    padding: "3px",

                                    backgroundColor: updatedIdsDisabled?.includes(params.data.id)
                                        ? "#cf1b1b"
                                        : updatedIdsDisabledReject.includes(params.data.id)
                                            ? "lightgrey"
                                            : "#cf1b1b",
                                    color: updatedIdsDisabled?.includes(params.data.id)
                                        ? " #fff !important"
                                        : updatedIdsDisabledReject.includes(params.data.id)
                                            ? "lightgrey"
                                            : "#fff !important",

                                    border: updatedIdsDisabledReject?.includes(params.data.id)
                                        ? "2px solid #cf1b1b"
                                        : "none",
                                    "&:hover": {
                                        backgroundColor: updatedIdsDisabled?.includes(params.data.id)
                                            ? "#cf1b1b"
                                            : updatedIdsDisabledReject.includes(params.data.id)
                                                ? "lightgrey"
                                                : "#cf1b1b",
                                        color: updatedIdsDisabled?.includes(params.data.id)
                                            ? "#fff !important"
                                            : updatedIdsDisabledReject.includes(params.data.id)
                                                ? "lightgrey"
                                                : "#fff",
                                    },
                                }}
                                disabled={
                                    updatedIdsDisabledReject.includes(params.data.id) ||
                                    updatedIdsDisabled?.includes(params.data.id)
                                }
                                onClick={() => handleSubmitReject(params.data.id)}
                            >
                                {/* Reject */}
                                {updatedIdsDisabledReject?.includes(params.data.id)
                                    ? "Rejected"
                                    : "Reject"}
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ),
        },
        {
            field: "vendor",
            headerName: "Vendor",
            flex: 0,
            width: 150,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "companyname",
            headerName: "Company Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
        },
        {
            field: "fromdate",
            headerName: "Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fromdate,
            headerClassName: "bold-header",
        },
        {
            field: "time",
            headerName: "Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },
        {
            field: "filename",
            headerName: "Category",
            flex: 0,
            width: 150,
            hide: !columnVisibility.filename,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "SubCategory",
            flex: 0,
            width: 150,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "unitid",
            headerName: "Identifier",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unitid,
            headerClassName: "bold-header",
        },
        {
            field: "user",
            headerName: "Login Id",
            flex: 0,
            width: 150,
            hide: !columnVisibility.user,
            headerClassName: "bold-header",
        },
        {
            field: "section",
            headerName: "Section",
            flex: 0,
            width: 150,
            hide: !columnVisibility.section,
            headerClassName: "bold-header",
        },
        {
            field: "flagcount",
            headerName: "Flag Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.flagcount,
            headerClassName: "bold-header",
        },
        {
            field: "alllogin",
            headerName: "All Login",
            flex: 0,
            width: 150,
            hide: !columnVisibility.alllogin,
            headerClassName: "bold-header",
        },
        {
            field: "docnumber",
            headerName: "Doc Number",
            flex: 0,
            width: 150,
            hide: !columnVisibility.docnumber,
            headerClassName: "bold-header",
        },
        {
            field: "level",
            headerName: "Level",
            flex: 0,
            width: 150,
            hide: !columnVisibility.level,
            headerClassName: "bold-header",
        },
        // { field: "approvalstatus", headerName: "Approve Status", flex: 0, width: 150, hide: !columnVisibility.approvalstatus, headerClassName: "bold-header" },
        // { field: "lateentrystatus", headerName: "Late Entry Status", flex: 0, width: 150, hide: !columnVisibility.lateentrystatus, headerClassName: "bold-header" },
        {
            field: "actionsstatus",
            headerName: "Status",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actionsstatus,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"warning"}
                        variant="outlined"
                        label={params.data.approvalstatus}
                    />
                    &ensp;
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"success"}
                        variant="outlined"
                        label={params.data.lateentrystatus}
                    />
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            companyname: item.companyname,
            fromdate: item.fromdate,
            time: item.time,
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
            lateentrystatus: item.lateentrystatus,
            approvaldate: item.approvaldate,
            level: item.level, // Fixed the syntax error here
            createdAt: item.createdAt, // Fixed the syntax error here
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const TableFilter = async () => {
        setIsAttandance(true);
        try {
            let res_employee = await axios.post(
                SERVICE.PRODUCTION_INDIVIDUAL_HIERARCHYFILTER,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    hierachy: modeselection.value,
                    sector: sectorSelection.value,
                    username: isUserRoleAccess.companyname,
                    vendor: selectedVendor,
                    pagename: "menuproductionmanualentryfilter",
                    listpageaccessmode: listpageaccessby,
                }
            );
            // console.log(res_employee?.data?.resultedTeam, res_employee?.data?.resultAccessFilter < 1, 'sbhsbh')

            if (
                // res_employee?.data?.resultedTeam?.length > 0 &&
                res_employee?.data?.resultAccessFilter?.length < 1 && ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)) {
                alert("Some employees have not been given access to this page.")
            }



            const itemsWithSerialNumber = res_employee?.data?.resultAccessFilter?.map((item, index) => {
                const fromDate = new Date(item.createdAt);
                const fromDatePlus24Hours = new Date(
                    fromDate.getTime() + 24 * 60 * 60 * 1000
                );
                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);
                const fromDatePlus48Hours = new Date(
                    fromDaten.getTime() + 48 * 60 * 60 * 1000
                );
                return {
                    ...item,
                    serialNumber: index + 1,

                    fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                    lateentrystatus:
                        fromDate > fromDatePlus48Hours ? "Late Entry" : "On Entry",
                    approvalstatus:
                        (item.approvaldate === "" ||
                            item.approvaldate === null ||
                            item.approvaldate === undefined) &&
                            item.status === "Approved"
                            ? ""
                            : new Date() <= fromDatePlus24Hours &&
                                (item.approvaldate === "" ||
                                    item.approvaldate === null ||
                                    item.approvaldate === undefined)
                                ? "Pending"
                                : new Date() > fromDatePlus24Hours &&
                                    (item.approvaldate === "" ||
                                        item.approvaldate === null ||
                                        item.approvaldate === undefined)
                                    ? "Late Not Approval"
                                    : new Date() > fromDatePlus24Hours && item.approvaldate
                                        ? "Late Approval"
                                        : "On Approval",
                };
            });
            setisuser(itemsWithSerialNumber);
            // setisuser(res_employee?.data?.resultAccessFilter);
            setIsAttandance(false);
        } catch (err) {
            console.log(err, "error");
            setIsAttandance(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const TableFilterSubmit = async () => {
        try {
            let res_employee = await axios.post(
                SERVICE.PRODUCTION_INDIVIDUAL_HIERARCHYFILTER,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    hierachy: modeselection.value,
                    sector: sectorSelection.value,
                    username: isUserRoleAccess.companyname,
                    vendor: selectedVendor,
                }
            );

            setisuser(res_employee.data.resultAccessFilter);
            setIsAttandance(true);
        } catch (err) {
            setIsAttandance(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const HandleTablesubmit = (e) => {
        // setIsLoader(false)
        e.preventDefault();

        if (selectedVendor.length === 0) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (modeselection.value === "Please Select Mode") {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (sectorSelection.value === "Please Select Sector") {
            setPopupContentMalert("Please Select Selector!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            TableFilter();
        }
    };

    const handleSubmit = async (id, date, approvaldate) => {
        try {
            // const currentDate = new Date().toISOString().split('T')[0];

            const currentDate = new Date();

            const [dateval, timeWithMilliseconds] = date.split("T");

            const time = timeWithMilliseconds.split(".")[0];
            // const fromDate = new Date(`${dateval}T${time}`);
            const fromDate = new Date(date);

            console.log(fromDate, "fromDate");
            const fromDatePlus24Hours = new Date(
                fromDate.getTime() + 24 * 60 * 60 * 1000
            );

            let req = await axios.put(
                `${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    status: String("Approved"),
                    approvaldate: new Date(),
                    approvalstatus:
                        new Date() > fromDatePlus24Hours ? "Late Approval" : "On Approval",
                }
            );
            setUpdatedIdsDisabled((prev) => [...prev, id]);
            // await TableFilterSubmit()
        } catch (err) {
            const messages = err?.response?.data?.message;

        }
    };

    const handleSubmitReject = async (id) => {
        try {
            let req = await axios.put(
                `${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    status: String("Rejected"),
                }
            );
            setUpdatedIdsDisabledReject((prev) => [...prev, id]);
            // await TableFilterSubmit()
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Vendor", field: "vendor" },
        { title: "Company Name", field: "companyname" },
        { title: "Date", field: "fromdate" },
        { title: "Time", field: "time" },
        { title: "Category", field: "filename" },
        { title: "Sub Category", field: "category" },
        { title: "Identifier", field: "unitid" },
        { title: "Login Id", field: "user" },
        { title: "Section", field: "section" },
        { title: "Flag Count", field: "flagcount" },
        { title: "Doc Number", field: "docnumber" },
        { title: "Level", field: "level" },
    ];

    //  pdf download functionality
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: rowDataTable,
        });
        doc.save("Production_Individual_filter.pdf");
    };

    const [vendors, setVendors] = useState([]);

    const [producionIndividual, setProducionIndividual] = useState({
        vendor: "Choose Vendor",
        subcategory: "Choose Subcategory",
        category: "Choose Category",
        unitid: "",
        alllogin: "Choose AllLogin",
        loginid: "Choose Loginid",
        docnumber: "",
        doclink: "",
        flagcount: "",
        section: "",
        addedby: "",
        updatedby: "",
    });

    const fetchVendors = async () => {
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
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Production Manual Entry Filter"),
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

    // page refersh reload code
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


    return (
        <Box>
            <Headtitle title={"PRODUCTION MANUAL ENTRY"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Production Manual Entry Filter"
                modulename="Production"
                submodulename="Manual Entry"
                mainpagename="Production Manual Entry Filter"
                subpagename=""
                subsubpagename=""
            />
            <Box>
                <Box sx={{ ...userStyle.dialogbox }}>
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <MultiSelect
                                    options={vendors}
                                    value={selectedVendor}
                                    onChange={(e) => {
                                        handleVendorChange(e);
                                    }}
                                    valueRenderer={customValueRendererVendor}
                                    labelledBy="Please Select Vendor"
                                />
                            </FormControl>
                        </Grid>
                        {listpageaccessby === "Reporting to Based" ? (
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                <TextField readOnly size="small" value={listpageaccessby} />
                            </Grid>
                        ) : (
                            <>
                                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                    <Selects
                                        options={modeDropDowns}
                                        styles={colourStyles}
                                        value={{
                                            label: modeselection.label,
                                            value: modeselection.value,
                                        }}
                                        onChange={(e) => {
                                            setModeSelection(e);
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                    <Selects
                                        options={sectorDropDowns}
                                        styles={colourStyles}
                                        value={{
                                            label: sectorSelection.label,
                                            value: sectorSelection.value,
                                        }}
                                        onChange={(e) => {
                                            setSectorSelection(e);
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item lg={1} md={1} xs={12} sm={6}>
                            <Button variant="contained"
                                sx={buttonStyles.buttonsubmit}

                                onClick={(e) => HandleTablesubmit(e)}>
                                Filter
                            </Button>
                        </Grid>
                        <Grid item lg={3} md={1} xs={12} sm={6}>
                            <Button sx={buttonStyles.btncancel} onClick={(e) => handleClear(e)}>
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <br />
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Production Manual Entry Filter List</Typography>
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
                                        <MenuItem value={isuser?.length}>All</MenuItem>
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
                                        "excelproductionmanualentryfilter"
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
                                        "csvproductionmanualentryfilter"
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
                                        "printproductionmanualentryfilter"
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
                                        "pdfproductionmanualentryfilter"
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
                                        "imageproductionmanualentryfilter"
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
                                    {/* <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl> */}
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={isuser}
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
                        <br />
                        {isAttandance ? (
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
                    </>
                </Box>
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
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                            <TableCell>Vendor</TableCell>
                            <TableCell>Company Name</TableCell>
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
                            <TableCell>Level</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.companyname}</TableCell>
                                    <TableCell>
                                        {moment(row.fromdate).format("DD/MM/YYYY")}
                                    </TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.filename}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.unitid}</TableCell>
                                    <TableCell>{row.user}</TableCell>
                                    <TableCell>{row.section}</TableCell>
                                    <TableCell>{row.flagcount}</TableCell>
                                    <TableCell>{row.alllogin}</TableCell>
                                    <TableCell>{row.docnumber}</TableCell>
                                    <TableCell>{row.level}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box></Box>

            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={isuser ?? []}
                filename={"Production_Individual_Filter_List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
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

export default ProductionIndividualFilter;