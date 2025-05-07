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
import { FaPrint, FaFilePdf, FaPlus, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle } from "../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../components/TableStyle";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
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

function TaskUserScheduleLog() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
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

    let exportColumnNames = [
        'Assign Status', 'Date',
        'Task Assign', 'Category',
        'Subcategory', 'Frequency',
        'Type', 'Designation',
        'Department', 'Company',
        'Branch', 'Unit',
        'Team', 'Process', 'Employee Names'
    ];
    let exportRowValues = [
        'schedulestatus', 'date',
        'taskassign', 'category',
        'subcategory', 'frequency',
        'type', 'designation',
        'department', 'company',
        'branch', 'unit',
        'team', 'process', 'employeenames'
    ];

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [taskGroupingArray, setTaskGroupingArray] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, pageName,
        setPageName,
        buttonStyles, } = useContext(
            UserRoleAccessContext
        );
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);



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


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        designation: true,
        process: true,
        department: true,
        branch: true,
        company: true,
        unit: true,
        team: true,
        employeenames: true,
        type: true,
        category: true,
        frequency: true,
        subcategory: true,
        schedulestatus: true,
        date: true,
        taskassign: true,

    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

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

    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
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

    //get all Task Assign Grouping.
    const ids = useParams().id;
    const fetchTaskGrouping = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(`${SERVICE.SINGLE_TASKDESIGNATIONGROUPING}/${ids}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            const answer = (res_freq?.data?.staskdesignationgrouping?.taskdesignationlog?.length > 0) ? res_freq?.data?.staskdesignationgrouping?.taskdesignationlog?.map((item, index) => ({
                // ...item,
                serialNumber: index + 1,
                id: item._id,
                category: item.category,
                subcategory: item.subcategory,
                type: item.type,
                schedulestatus: item.schedulestatus,
                taskassign: item.taskassign,
                date: item.date,
                designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                frequency: item.frequency?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                department: item.department?.length > 0 ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
                company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                process: item.process?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

            })) : [];
            setTaskGroupingArray(answer);
            setLoader(true);
        } catch (err) {
            setLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

        }
    };

    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Task Assign Grouping Log.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Task Assign Grouping Log",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
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
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "schedulestatus",
            headerName: "Assign Status",
            flex: 0,
            width: 160,
            hide: !columnVisibility.schedulestatus,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 120,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "taskassign",
            headerName: "Task Assign",
            flex: 0,
            width: 160,
            hide: !columnVisibility.taskassign,
            headerClassName: "bold-header",
        },

        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 160,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 160,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 160,
            hide: !columnVisibility.frequency,
            headerClassName: "bold-header",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 160,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 160,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 160,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 160,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 160,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 160,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 160,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 160,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "employeenames",
            headerName: "Employee Names",
            flex: 0,
            width: 160,
            hide: !columnVisibility.employeenames,
            headerClassName: "bold-header",
        },


    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            category: item.category,
            subcategory: item.subcategory,
            designation: item.designation,
            process: item.process,
            frequency: item.frequency,
            schedulestatus: item.schedulestatus,
            taskassign: item.taskassign,
            date: item.date,
            department: item.department,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            type: item.type,
            employeenames: item.employeenames,

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




    return (
        <Box>
            <Headtitle title={"TASK ASSIGN GROUPING LOG"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Task Assign Grouping Log</Typography>

            <br />   <br />
            {/* ****** Table Start ****** */}
            {!loader ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("ltaskassigngrouping") && (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}


                            <Grid container spacing={2}>
                                <Grid item md={11} xs={12} sm={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Task Assign Grouping Log List
                                    </Typography>
                                </Grid>
                                <Grid item md={1} xs={12} sm={12}>
                                    <Link to={`/task/taskdesignationgrouping`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                        <Button sx={buttonStyles.btncancel} variant="contained" >Back</Button>
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
                                        {isUserRoleCompare?.includes("exceltaskassigngrouping") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtaskassigngrouping") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtaskassigngrouping") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftaskassigngrouping") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>


                                        )}
                                        {isUserRoleCompare?.includes("imagetaskassigngrouping") && (
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
                                        totalDatas={items}
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
                itemsTwo={taskGroupingArray ?? []}
                filename={"Task Assign Grouping Log"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />



            <br />
        </Box>
    );
}

export default TaskUserScheduleLog;
