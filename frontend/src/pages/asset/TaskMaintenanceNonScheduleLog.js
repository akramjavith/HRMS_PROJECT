import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Table,
    TableHead,
    TableContainer,
    Button,
    List,
    ListItem,
    ListItemText,
    Popover,
    Checkbox,
    TextField,
    IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import AlertDialog from "../../components/Alert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';


function TaskMaintenanceNonScheduleLog() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


    const [btnLoad, setBtnLoad] = useState(false);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setBtnLoad(false);
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
        'Asset Material',
        'Employee Name',
        'Date',
        'Time',
        'Duration',
        'Breakup Count',
        'Breakup',
        'Required'
    ];
    let exportRowValues = [
        'assetmaterial',
        'username',
        'taskdate',
        'tasktime',
        'duration',
        'breakupcount',
        'breakup',
        'required'
    ];


    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [taskGroupingArray, setTaskGroupingArray] = useState([]);

    const { isUserRoleCompare, buttonStyles } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        category: true,
        assetmaterial: true,
        subcategory: true,
        duration: true,
        breakup: true,
        breakupcount: true,
        required: true,
        actions: true,
        taskdate: true,
        tasktime: true,
        username: true,
        type: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(taskGroupingArray);
    }, [taskGroupingArray]);

    useEffect(() => {
        fetchTaskGrouping();
    }, []);


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
    };

    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
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

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
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
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    //get all Task Schedule Grouping.
    const ids = useParams().id;
    const fetchTaskGrouping = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ALL_TASKMAINTENACEFORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setTaskGroupingArray(res_freq?.data?.taskmaintenanceforuser?.filter(data => data.orginalid === ids));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const bulkdeletefunction = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${item}`, {
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

            await fetchTaskGrouping();
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Deleted Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Maintenance Non-Schedule Log List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Asset Material", field: "assetmaterial" },
        { title: "Employee Name", field: "username" },
        { title: "Date", field: "taskdate" },
        { title: "Time", field: "tasktime" },
        { title: "Duration", field: "duration" },
        { title: "Breakup Count", field: "breakupcount" },
        { title: "Breakup", field: "breakup" },
        { title: "Required", field: "required" },
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
            body: filteredData,
        });
        doc.save("MaintenanceNonScheduleGroupinglog.pdf");
    };
    // Excel
    const fileName = "MaintenanceNonScheduleGroupinglog";
    // get particular columns for export excel


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Maintenance Non Schedule Grouping Log",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskGroupingArray?.map((item, index) => ({
            // ...item,
            serialNumber: index + 1,
            id: item._id,
            assetmaterial: item.assetmaterial,
            username: item.username,
            taskdetails: item.taskdetails,
            taskdate: moment(item.taskdate).format("DD-MM-YYYY"),
            tasktime: item?.tasktime,
            duration: item.duration,
            breakup: item.breakup,
            breakupcount: item.breakupcount,
            breakup: item.breakup,
            required: item.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

        }));
        setItems(itemsWithSerialNumber);
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


    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
            headerName: "Checkbox",
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
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredData.length
                        );
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 60,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterial",
            headerName: "Asset Material",
            flex: 0,
            width: 150,
            hide: !columnVisibility.assetmaterial,
            headerClassName: "bold-header",
        },

        {
            field: "username",
            headerName: "Employee Name",
            flex: 0,
            width: 250,
            hide: !columnVisibility.username,
            headerClassName: "bold-header",
        },
        {
            field: "taskdate",
            headerName: "Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskdate,
            headerClassName: "bold-header",
        },
        {
            field: "tasktime",
            headerName: "Time",
            flex: 0,
            width: 75,
            hide: !columnVisibility.tasktime,
            headerClassName: "bold-header",
        },

        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 75,
            hide: !columnVisibility.duration,
            headerClassName: "bold-header",
        },
        {
            field: "breakupcount",
            headerName: "Breakup Count",
            flex: 0,
            width: 75,
            hide: !columnVisibility.breakupcount,
            headerClassName: "bold-header",
        },
        {
            field: "breakup",
            headerName: "Breakup",
            flex: 0,
            width: 75,
            hide: !columnVisibility.breakup,
            headerClassName: "bold-header",
        },

        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 150,
            hide: !columnVisibility.required,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            assetmaterial: item.assetmaterial,
            duration: item.duration,
            breakup: item.breakup,
            breakupcount: item.breakupcount,
            required: item?.required,
            taskdate: item.taskdate,
            tasktime: item.tasktime,
            username: item.username,

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

    return (
        <Box>
            <Headtitle title={"MAINTENANCE NON-SCHEDULE GROUPING LOG"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Manage Maintenance Non-Schedule Log</Typography>

            <br />   <br />
            {/* ****** Table Start ****** */}
            {!loader ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("ltasknonschedulegrouping") && (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}


                            <Grid container spacing={2}>
                                <Grid item md={8} sm={8} xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Maintenance Non-Schedule Log List
                                    </Typography>
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <Link to={`/asset/taskmaintenancenonschedulegrouping`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} >Back</Button>
                                    </Link>
                                </Grid>
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
                                            <MenuItem value={taskGroupingArray?.length}>
                                                All
                                            </MenuItem>
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
                                        {isUserRoleCompare?.includes("exceltasknonschedulegrouping") && (
                                            // <>
                                            //     <ExportXL csvData={filteredData.map((item, index) => {
                                            //         return {
                                            //             Sno: item.serialNumber,
                                            //             assetmaterial: item.assetmaterial,
                                            //             Employeename: item.username,
                                            //             Date: item.taskdate,
                                            //             Time: item?.tasktime,
                                            //             Duration: item.duration,
                                            //             Breakup: item.breakup,
                                            //             Breakupcount: item.breakupcount,
                                            //             Required: item.required,
                                            //         };
                                            //     })} fileName={fileName} />
                                            // </>
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
                                        {isUserRoleCompare?.includes("csvtasknonschedulegrouping") && (
                                            // <>
                                            //     <ExportCSV csvData={filteredData.map((item, index) => {
                                            //         return {
                                            //             Sno: item.serialNumber,
                                            //             assetmaterial: item.assetmaterial,
                                            //             Employeename: item.username,
                                            //             Date: item.taskdate,
                                            //             Time: item?.tasktime,
                                            //             Duration: item.duration,
                                            //             Breakup: item.breakup,
                                            //             Breakupcount: item.breakupcount,
                                            //             Required: item.required,
                                            //         };
                                            //     })} fileName={fileName} />
                                            // </>
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
                                        {isUserRoleCompare?.includes("printtasknonschedulegrouping") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftasknonschedulegrouping") && (
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
                                        {isUserRoleCompare?.includes("imagetasknonschedulegrouping") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={taskGroupingArray}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={taskGroupingArray}
                                    />
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
                            <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                                        itemsList={taskGroupingArray}
                                    />
                                </>
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>}
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
            {/* print layout */}
            {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Asset Material</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Breakup Count</TableCell>
                            <TableCell>Breakup</TableCell>
                            <TableCell>Required</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.assetmaterial}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.taskdate}</TableCell>
                                    <TableCell>{row.tasktime}</TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.breakupcount}</TableCell>
                                    <TableCell>{row.breakup}</TableCell>
                                    <TableCell>{row.required}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
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
                        <Button autoFocus variant="contained" color="error"
                            onClick={(e) => bulkdeletefunction(e)}
                        >
                            {" "}
                            OK{" "}
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
                itemsTwo={items ?? []}
                filename={"Maintenance Non-Schedule Log List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />


            <br />
        </Box>
    );
}

export default TaskMaintenanceNonScheduleLog;