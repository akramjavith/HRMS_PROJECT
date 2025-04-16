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

function Erroruploadconfirm() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);



    const [manualError, setManualError] = useState([])

    const [dateCount, setDateCount] = useState("")


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

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)


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

    const exportColumnNames = [
        'Employee Name', 'Branch', 'Unit',
        'Project Vendor', 'Date',
        'Queue Name', 'Login ID',
        'Accuracy', 'Total Fields', 'Error Count', 'Auto Count', 'Upload Count', 'Level'
    ]
    const exportRowValues = [
        'companyname', 'branchname', 'unitname',
        'projectvendor', 'date',
        'queuename', 'loginid',
        'accuracy', 'totalfields', 'errorcount', 'autocount', 'uploadcount', 'level'
    ]

    const gridRef = useRef(null);



    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Error Upload Confirm.png");
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
                data.modulename === "Quality" &&
                data.submodulename === "Penalty" &&
                data.mainpagename === "Penalty Setup" &&
                data.subpagename === "Penalty Calculation" &&
                data.subsubpagename === "Error Upload Confirm"
        )?.listpageaccessmode || "Overall";





    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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


        var today1 = new Date();
        var dd1 = String(today1.getDate()).padStart(2, "0");
        var mm1 = String(today1.getMonth() + 1).padStart(2, "0"); // January is 0!
        var yyyy1 = today1.getFullYear();
        today1 = yyyy1 + "-" + mm1 + "-" + dd1;
        setFromdate(today1)
        setTodate(today1)
        setSelectedMode("Today")


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
        companyname: true,
        branchname: true,
        unitname: true,
        projectvendor: true,
        date: true,
        queuename: true,
        loginid: true,
        accuracy: true,
        totalfields: true,
        errorcount: true,
        autocount: true,
        uploadcount: true,
        level: true,
        manualerror: true,
        manualtotal: true,
        actions: true,
        actions1: true,
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


        //     return {
        //         ...item,
        //         serialNumber: index + 1,

        //         date: moment(item.date).format("DD/MM/YYYY"),
        //     }
        // });
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(isuser);
    }, [isuser]);

    // console.log(isuser, "isuser")

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        // setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        // setSelectAllChecked(false);
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



    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox",
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     headerCheckboxSelection: true,
        //     checkboxSelection: true,
        //     pinned: 'left',
        //     lockPinned: true,
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 70,
        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
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
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "branchname",
            headerName: "Branch",
            flex: 0,
            width: 130,
            hide: !columnVisibility.branchname,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "unitname",
            headerName: "Unit",
            flex: 0,
            width: 130,
            hide: !columnVisibility.unitname,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 130,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 130,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.queuename,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 130,
            hide: !columnVisibility.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "accuracy",
            headerName: "Accuracy",
            flex: 0,
            width: 150,
            hide: !columnVisibility.accuracy,
            headerClassName: "bold-header",
        },
        {
            field: "totalfields",
            headerName: "Total Fields",
            flex: 0,
            width: 150,
            hide: !columnVisibility.totalfields,
            headerClassName: "bold-header",
        },

        {
            headerName: "Manual Total (DoubleClick Editable)",
            field: "manualtotal",
            editable: true,
            suppressClickEdit: true,
            sortable: true,
            filter: true,
            resizable: true,
            cellEditor: "agTextCellEditor",
            suppressDestroy: true,
        },
        {
            field: "actions",
            headerName: "Actions(Manual Total)",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <>
                    {isUserRoleCompare?.includes("emanualerrorupdate") && (
                        <Grid sx={{ display: "flex" }}>

                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => {
                                    sendEditRequest(params.data.id, params.data.manualtotal, "manualtotal");
                                }}
                            >
                                UPDATE
                            </Button>

                        </Grid>
                    )}
                </>
            ),
        },
        {
            field: "errorcount",
            headerName: "Error Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorcount,
            headerClassName: "bold-header",
        },
        {
            field: "autocount",
            headerName: "Auto Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.autocount,
            headerClassName: "bold-header",
        },
        {
            headerName: "Manual Error (DoubleClick Editable)",
            field: "manualerror",
            editable: true,
            suppressClickEdit: true,
            sortable: true,
            filter: true,
            resizable: true,
            cellEditor: "agTextCellEditor",
            suppressDestroy: true,

        },
        {
            field: "actions1",
            headerName: "Actions(Manual Error)",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions1,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <>
                    {isUserRoleCompare?.includes("emanualerrorupdate") && (
                        <Grid sx={{ display: "flex" }}>

                            <Button
                                variant="outlined"
                                color="primary"
                                // disabled={Number(params.data.manualerror) <= 0 || params.data.manualerror == ""}
                                size="small"
                                onClick={() => {
                                    sendEditRequest(params.data.id, params.data.manualerror, "manualerror");
                                }}
                            >
                                UPDATE
                            </Button>

                        </Grid>
                    )}
                </>
            ),
        },
        {
            field: "uploadcount",
            headerName: "Upload Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.uploadcount,
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


    ];
    // console.log(filteredData, "lll")

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            companyname: item.companyname,
            branchname: item.branchname,
            unitname: item.unitname,
            projectvendor: item.projectvendor,
            date: item.date,
            queuename: item.queuename,
            loginid: item.loginid,
            accuracy: item.accuracy,
            totalfields: item.totalfields,
            errorcount: item.errorcount,
            manualtotal: item.manualtotal,
            manualerror: item.manualerror,
            uploadcount: item.uploadcount,

            // autocount: typeof item.autocount === 'number' ? item.autocount.toFixed(2) : item.autocount,
            autocount: typeof item.autocount === 'number'
                ? parseFloat(item.autocount.toFixed(2)).toString()
                : item.autocount,
            level: item.level,
        };
    });
    console.log(rowDataTable, "rowdat")
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


    const TableFilterNew = async () => {
        try {
            let res_employee = await axios.post(
                SERVICE.ERROR_UPLOAD_CONFIRM_HIERARCHY,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    hierachy: modeselection.value,
                    sector: sectorSelection.value,
                    username: isUserRoleAccess.companyname,
                    // team: isUserRoleAccess.team,
                    vendor: selectedVendor,
                    pagename: "menuerroruploadconfirm",
                    listpageaccessmode: listpageaccessby,
                    fromdate: fromdate,
                    todate: todate
                }
            );
            let finalData = res_employee?.data?.resultAccessFilter

            let finalDataAll = finalData?.map((item, index) => {
                return {
                    ...item,

                    serialNumber: index + 1,
                    id: item._id,
                    date: moment(item.date).format("DD/MM/YYYY"),
                }
            });
            console.log(finalDataAll, "finalDataAll")
            setisuser(finalData)
            // setDateCount(result);
        } catch (err) {
            console.log(err, "error");
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [batchNumber, setBatchNumber] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadMorePopupOpen, setIsLoadMorePopupOpen] = useState(false);

    const handleLoadMoreClosePopup = () => {
        setIsLoadMorePopupOpen(false); // Close the popup without loading more
    };

    const fetchBatchFilterold = async (batchNum) => {
        setisuser([]);
        setIsAttandance(true);
        try {
            let res_employee = await axios.post(
                SERVICE.ERROR_UPLOAD_CONFIRM_HIERARCHY,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    hierachy: modeselection.value,
                    sector: sectorSelection.value,
                    username: isUserRoleAccess.companyname,
                    // team: isUserRoleAccess.team,
                    vendor: selectedVendor,
                    pagename: "menuerroruploadconfirm",
                    listpageaccessmode: listpageaccessby,
                    fromdate: fromdate,
                    todate: todate,

                    batchNumber: batchNum,
                    batchSize: 10000,
                }
            );


            if (res_employee.data.count === 0) {
                setHasMoreData(false);
                setIsLoading(false);
                if (isuser.length > 0) {
                    setPopupContentMalert("Fully Loaded");
                    setPopupSeverityMalert("success");
                    handleClickOpenPopupMalert();
                }
            } else {
                const filtered = res_employee?.data?.resultAccessFilter.filter((item) => item != null);

                let finalDataAll = filtered?.map((item, index) => {
                    return {
                        ...item,

                        serialNumber: index + 1,
                        id: item._id,
                        date: moment(item.date).format("DD/MM/YYYY"),
                    }
                });


                setisuser(finalDataAll)
                setBatchNumber(batchNum);
                setIsLoading(false);
                if (filtered.length > 0) {
                    setIsLoadMorePopupOpen(true);
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setIsAttandance(false);
            setIsLoading(false);
            setHasMoreData(false);
        } finally {
            setIsAttandance(false);
            setIsLoading(false);
            setIsLoading(false);
        }
    };

    const fetchBatchFilter = async () => {
        setisuser([]);
        setIsAttandance(true);
        try {
            let res_employee = await axios.post(
                SERVICE.ERROR_UPLOAD_CONFIRM_HIERARCHY,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    hierachy: modeselection.value,
                    sector: sectorSelection.value,
                    username: isUserRoleAccess.companyname,
                    vendor: selectedVendor,
                    pagename: "menuerroruploadconfirm",
                    listpageaccessmode: listpageaccessby,
                    fromdate: fromdate,
                    todate: todate,
                }
            );

            const filtered = res_employee?.data?.resultAccessFilter.filter((item) => item != null);

            let finalDataAll = filtered?.map((item, index) => {
                return {
                    ...item,

                    serialNumber: index + 1,
                    id: item._id,
                    date: moment(item.date).format("DD/MM/YYYY"),
                }
            });

            setFilteredRowData(finalDataAll)
            setisuser(finalDataAll)

            setIsLoading(false);
            setIsAttandance(false);
            setIsLoading(false);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setIsAttandance(false);
            setIsLoading(false);
            setHasMoreData(false);
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
            fetchBatchFilter(1);
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
            pagename: String("Error Upload Confirm"),
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





    const fetchManulError = async () => {
        setPageName(!pageName)

        try {
            let Res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD_LOGIN_PROJECT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let finalData = Res?.data?.errormodes.filter(data => data.name === isUserRoleAccess.companyname)
            setManualError(finalData)
            const result = finalData.reduce((acc, curr) => {
                const date = curr.date;
                if (acc[date]) {
                    acc[date] += 1;
                } else {
                    acc[date] = 1;
                }
                return acc;
            }, {});
            setDateCount(result)

        } catch (err) {
            console.log(err, 'err')
            // setTableOneLoader(true); setTableTwoLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };

    // useEffect(() => {
    //     fetchManulError();
    // }, [])


    const [maualerroredit, setManualerroredit] = useState("")




    const sendEditRequest = async (id, manualvalue, type) => {
        // console.log(manualvalue, "manualvalue")
        // setLoader(true)
        let editid = id;
        setPageName(!pageName)
        try {

            if (type == "manualerror") {
                if (manualvalue === "" || manualvalue == undefined) {

                    setPopupContent("Please Enter Value");
                    setPopupSeverity("warning");
                    handleClickOpenPopup();
                } else {

                    setManualerroredit(id)
                    let res = await axios.put(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${editid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },

                        manualerror: String(manualvalue),
                        isedited: true,

                    });
                    // await TableFilterNew();
                    await fetchBatchFilter();
                    // await fetchBatch();
                    setPopupContent("Updated Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                    setManualerroredit("")

                }
            } else if (type == "manualtotal") {
                if (manualvalue === "" || manualvalue == undefined) {
                    setPopupContent("Please Enter Value");
                    setPopupSeverity("warning");
                    handleClickOpenPopup();
                }


                else {

                    setManualerroredit(id)
                    let res = await axios.put(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${editid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },

                        manualtotal: String(manualvalue),
                        iseditedtotal: true,

                    });
                    // await TableFilterNew();
                    await fetchBatchFilter();
                    // await fetchBatch();
                    setPopupContent("Updated Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                    setManualerroredit("")


                }
            }





            // setLoader(false)
        } catch (err) {
            setManualerroredit("")
            // setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };







    return (
        <Box>
            {/* <Headtitle title={"Error Upload Confirm"} /> */}
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Error Upload Confirm"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Error Upload Confirm"
            />
            <Box>
                <Box sx={{ ...userStyle.dialogbox }}>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} xs={12} sm={12}>
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
                            <Grid item lg={4} md={4} xs={12} sm={6}>
                                <TextField readOnly size="small" value={listpageaccessby} />
                            </Grid>
                        ) : (
                            <>
                                <Grid item lg={4} md={4} xs={12} sm={6}>
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
                                <Grid item lg={4} md={4} xs={12} sm={6}>
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
                                    id="component-outlinedname123"
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
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={(e) => HandleTablesubmit(e)}>
                                    Filter
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item lg={1} md={2} sm={2} xs={12} >
                            <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                <Button sx={buttonStyles.btncancel} onClick={(e) => handleClear(e)}>
                                    Clear
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>







                </Box>
                <br />
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Error Upload Confirm List</Typography>
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
                                        "excelerroruploadconfirm"
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
                                        "csverroruploadconfirm"
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
                                        "printerroruploadconfirm"
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
                                        "pdferroruploadconfirm"
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
                                        "imageerroruploadconfirm"
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
                                        paginated={false}
                                        totalDatas={isuser}
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
                        {/* Show "Load More" button if there's more data */}

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
                                    itemsList={isuser}
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
            {/* <Dialog open={isLoadMorePopupOpen} onClose={handleLoadMoreClosePopup} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "60px", color: "skyblue" }} />
                    <Typography variant="h6">Loaded {isuser.length} Data</Typography>
                    <Typography variant="body1"> Do you want to load more data?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button sx={buttonStyles.btncancel} onClick={handleLoadMoreClosePopup}>
                        No
                    </Button>
                    <Button sx={buttonStyles.buttonsubmit} onClick={handleLoadMore} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog> */}

            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={items ?? []}
                filename={"Error Upload Confirm_List"}
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

export default Erroruploadconfirm;