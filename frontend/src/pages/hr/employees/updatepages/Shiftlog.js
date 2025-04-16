import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableBody,
    TableRow, TableCell, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import axios from "axios";
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";
import { SERVICE } from "../../../../services/Baseservice";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext, } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../../../components/TableStyle";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

function ShiftLogList() {

    const gridRef = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [boardinglogsTeam, setBoardinglogsTeam] = useState([]);
    const [items, setItems] = useState([]);
    const [teamlogcheck, setTeamlogcheck] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [boardingLog, setBoardingLog] = useState({});
    const [shiftLogDateEdit, setShiftLogDateEdit] = useState({});

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => { setOpenEdit(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
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
        starttime: true,
        username: true,
        startdate: true,
        createdby: true,
        time: true,
        floor: true,
        workstation: true,
        area: true,
        branch: true,
        unit: true,
        team: true,
        company: true,
        process: true,
        shifttype: true,
        shift: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

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

    const logid = useParams().id;

    const rowData = async () => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const currentUser = res?.data?.suser;
            const filteredArray = res?.data?.suser.boardingLog.filter((item) => {
                return item.logcreation === "user" || item.logcreation === "shift";
            });

            const newarray = filteredArray.map((item) => {
                return {
                    _id: item._id,
                    team: item.team,
                    username: currentUser.companyname,
                    startdate: item.startdate,
                    createdby: item?.updatedusername,
                    time: item.updateddatetime ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a") : "",
                    branch: item.branch,
                    unit: item.unit,
                    company: item.company,
                    floor: item.floor,
                    area: item.area,
                    workstation: item.workstation,
                    shifttiming: item.shifttiming,
                    shiftgrouping: item.shiftgrouping,
                    shifttype: item.shifttype,
                    weekoff: item.weekoff,
                    todo: item.todo,
                };
            });

            // Step 3: Update the state
            setBoardinglogsTeam(newarray);
            setTeamlogcheck(true);
        } catch (err) { setTeamlogcheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [boardinglogsTeamArray, setBoardinglogsTeamArray] = useState([])

    const rowDataArray = async () => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const currentUser = res?.data?.suser;
            const filteredArray = res?.data?.suser.boardingLog.filter((item) => {
                return item.logcreation === "user" || item.logcreation === "shift";
            });

            const newarray = filteredArray.map((item) => {
                return {
                    _id: item._id,
                    team: item.team,
                    username: currentUser.companyname,
                    startdate: item.startdate,
                    createdby: item?.updatedusername,
                    time: item.updateddatetime ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a") : "",
                    branch: item.branch,
                    unit: item.unit,
                    company: item.company,
                    shifttiming: item.shifttiming,
                    shiftgrouping: item.shiftgrouping,
                    shifttype: item.shifttype,
                    weekoff: item.weekoff,
                    todo: item.todo,
                };
            });
            setBoardinglogsTeamArray(newarray);
            setTeamlogcheck(true);
        } catch (err) { setTeamlogcheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        rowDataArray()
    }, [isFilterOpen])

    useEffect(() => {
        rowData();
    }, [logid]);

    // get single row to view....
    const getinfoCode = async (rowid) => {
        let result = boardinglogsTeam.filter((d) => d._id === rowid)
        setBoardingLog(...result);
    };

    // Excel
    const fileName = "Shift Log List";


    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Shift Log List",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "Company ", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Team", field: "team" },
        { title: "Workstation", field: "workstation" },
        { title: "Employee Name", field: "username" },
        { title: "Start Date", field: "startdate" },
        { title: "Created Date&Time", field: "time" },
        { title: "Created By", field: "createdby" },
        { title: "Shift Type", field: "shifttype" },
    ];


    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        let serialNumberCounter = 1;

        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            boardinglogsTeamArray.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                startdate: moment(row.startdate).format("DD-MM-YYYY"),
            }));

        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Shift Log List.pdf");
    };



    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Shift Log List.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const addSerialNumber = () => {
        const itemsWithSerialNumber = boardinglogsTeam?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            workstationexcel: item.workstation?.map((t, i) => `${i + 1 + ". "}` + t)
                .toString(),
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [boardinglogsTeam]);

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
    };
    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 50,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 70,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 150,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 150,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 100,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "workstation",
            headerName: "Workstation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.workstation,
            headerClassName: "bold-header",
        },
        {
            field: "startdate",
            headerName: "Start Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.startdate,
            headerClassName: "bold-header",
        },
        {
            field: "time",
            headerName: "Created Date&Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },
        {
            field: "createdby",
            headerName: "Created By",
            flex: 0,
            width: 170,
            hide: !columnVisibility.createdby,
            headerClassName: "bold-header",
        },
        {
            field: "shifttype",
            headerName: "Shift Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.shifttype,
            headerClassName: "bold-header",
        },
        {
            field: "shift",
            headerName: "Action",
            flex: 0,
            width: 70,
            hide: !columnVisibility.shift,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <>
                    {isUserRoleCompare?.includes("vshiftlog") && (

                        <Button size="small" variant="outlined" style={userStyle.actionbutton}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <VisibilityIcon style={{ fontSize: "20px" }} />
                        </Button>

                    )}
                </>
            ),
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            startdate: moment(item.startdate).format("DD-MM-YYYY"),
            username: item.username,
            starttime: item.starttime,
            createdby: item.createdby,
            time: item.time,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            floor: item.floor,
            area: item.area,
            workstation: item.workstation,
            workstationexcel: item.workstation,
            process: item.process,
            shifttype: item.shifttype,
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


    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    "Sno": index + 1,
                    company: t.company,
                    branch: t.branch,
                    unit: t.unit,
                    Floor: t.floor,
                    Area: t.area,
                    team: t.team,
                    Workstation: t.workstationexcel,
                    employeename: t.username,
                    "Start Date": t.startdate,
                    "Created Date&Time": t.time,
                    "Created By": t.createdby,
                    shifttype: t.shifttype,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((t, index) => ({
                    "Sno": index + 1,
                    company: t.company,
                    branch: t.branch,
                    unit: t.unit,
                    Floor: t.floor,
                    Area: t.area,
                    team: t.team,
                    Workstation: t.workstationexcel,
                    employeename: t.username,
                    "Start Date": moment(t.startdate).format("DD-MM-YYYY"),
                    "Created Date&Time": t.time,
                    "Created By": t.createdby,
                    shifttype: t.shifttype,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"SHIFT LOG LIST"} />
            <br />
            {/* ****** Table Start ****** */}
            <>
                <Box sx={{ border: '1px solid #8080801c', padding: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item md={8} xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                <b>Shift Log</b>
                            </Typography>
                        </Grid>
                        <Grid item md={3} xs={3}></Grid>
                    </Grid>
                    <br />
                    <Box>
                        <br />

                        <br />
                        <Box>
                            <Grid container spacing={2}>
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
                                            {/* <MenuItem value={boardinglogsTeam?.length}>
                                                        All
                                                    </MenuItem> */}
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
                                        {isUserRoleCompare?.includes("excelboardinglog") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    rowDataArray()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvboardinglog") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    rowDataArray()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printboardinglog") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleprint}
                                                >
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfboardinglog") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        rowDataArray()
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageboardinglog") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
                                                >
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                    &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleShowAllColumns}
                            >
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>
                            &ensp;
                            <br />
                            <br />
                            {!teamlogcheck ? (
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
                                    <Box style={{ width: "100%", overflowY: "hidden" }}>
                                        <StyledDataGrid
                                            onClipboardCopy={(copiedString) =>
                                                setCopiedData(copiedString)
                                            }
                                            rows={rowsWithCheckboxes}
                                            columns={columnDataTable.filter(
                                                (column) => columnVisibility[column.field]
                                            )}
                                            onSelectionModelChange={handleSelectionChange}
                                            selectionModel={selectedRows}
                                            autoHeight={true}
                                            ref={gridRef}
                                            density="compact"
                                            hideFooter
                                            getRowClassName={getRowClassName}
                                            disableRowSelectionOnClick
                                        />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing{" "}
                                            {filteredData.length > 0
                                                ? (page - 1) * pageSize + 1
                                                : 0}{" "}
                                            to {Math.min(page * pageSize, filteredDatas.length)}{" "}
                                            of {filteredDatas.length} entries
                                        </Box>
                                        <Box>
                                            <Button
                                                onClick={() => setPage(1)}
                                                disabled={page === 1}
                                                sx={userStyle.paginationbtn}
                                            >
                                                <FirstPageIcon />
                                            </Button>
                                            <Button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 1}
                                                sx={userStyle.paginationbtn}
                                            >
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button
                                                    key={pageNumber}
                                                    sx={userStyle.paginationbtn}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={page === pageNumber ? "active" : ""}
                                                    disabled={page === pageNumber}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === totalPages}
                                                sx={userStyle.paginationbtn}
                                            >
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button
                                                onClick={() => setPage(totalPages)}
                                                disabled={page === totalPages}
                                                sx={userStyle.paginationbtn}
                                            >
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
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
                                    <TableContainer component={Paper} sx={userStyle.printcls}>
                                        <Table
                                            sx={{ minWidth: 700 }}
                                            aria-label="customized table"
                                            id="usertable"
                                            ref={componentRef}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>SNo</TableCell>
                                                    <TableCell>Company</TableCell>
                                                    <TableCell>Branch</TableCell>
                                                    <TableCell>Unit</TableCell>
                                                    <TableCell>Floor</TableCell>
                                                    <TableCell>Area</TableCell>
                                                    <TableCell>Team</TableCell>
                                                    <TableCell>Workstation</TableCell>
                                                    <TableCell>Employee Name</TableCell>
                                                    <TableCell>Start Date</TableCell>
                                                    <TableCell>Created By</TableCell>
                                                    <TableCell>Created Date&Time</TableCell>
                                                    <TableCell>Shift Type</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {rowDataTable &&
                                                    rowDataTable.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{row.company}</TableCell>
                                                            <TableCell>{row.branch}</TableCell>
                                                            <TableCell>{row.unit}</TableCell>
                                                            <TableCell>{row.floor}</TableCell>
                                                            <TableCell>{row.area}</TableCell>
                                                            <TableCell>{row.team}</TableCell>
                                                            <TableCell>{row.workstation}</TableCell>
                                                            <TableCell>{row.username}</TableCell>
                                                            <TableCell>{row.startdate}</TableCell>
                                                            <TableCell>{row.createdby}</TableCell>
                                                            <TableCell>{row.time}</TableCell>
                                                            <TableCell>{row.shifttype}</TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </>

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

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "visible",
                    },
                }}
            >
                <Box sx={{ overflow: "auto", padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={userStyle.HeaderText}>
                                Shift Details
                            </Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={12} xs={12}>
                            <Typography> Shift Type </Typography>
                            <FormControl fullWidth size="small">
                                <OutlinedInput
                                    value={boardingLog.shifttype}
                                    type="text"
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={8}></Grid>
                        {boardingLog.shifttype === 'Daily' ? (
                            <>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Typography>
                                        Shift Grouping
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            value={boardingLog.shiftgrouping}
                                            type="text"
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12} >
                                    <Typography>
                                        Shift
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            value={boardingLog.shifttiming}
                                            type="text"
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Week Off</Typography>
                                        <OutlinedInput
                                            value={boardingLog.weekoff}
                                            type="text"
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        ) : null}

                        <Grid item md={12} sm={12} xs={12}>
                            {boardingLog.shifttype === '1 Week Rotation' ? (
                                <>
                                    {boardingLog.todo.length > 0 ? (
                                        <Grid container spacing={2}>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Day</Typography>
                                            </Grid>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Week</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Mode</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Grouping</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : null}
                                    {boardingLog.todo &&
                                        boardingLog.todo?.map((todo, index) => (
                                            <Grid container spacing={2} key={index} sx={{ paddingTop: '5px' }}>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.day}</Typography>
                                                </Grid>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.week}</Typography>
                                                </Grid>
                                                <Grid item md={3} sm={6} xs={12} sx={{ display: "flex" }}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            value={todo.shiftmode}
                                                            type="text"
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                {todo.shiftmode === 'Week Off' ? (
                                                    <Grid item md={6} sm={6} xs={12}></Grid>
                                                ) :
                                                    <>
                                                        <Grid item md={3} sm={6} xs={12}>
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput
                                                                    value={todo.shiftgrouping}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={3} xs={6} sm={6}>
                                                            <FormControl fullWidth size="small">

                                                                <OutlinedInput
                                                                    value={todo.shifttiming}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                }
                                            </Grid>
                                        ))
                                    }
                                </>
                            ) : null}

                            {boardingLog.shifttype === '2 Week Rotation' ? (
                                <>
                                    {boardingLog.todo.length > 0 ? (
                                        <Grid container spacing={2}>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Day</Typography>
                                            </Grid>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Week</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Mode</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Grouping</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : null}
                                    {boardingLog.todo &&
                                        boardingLog.todo?.map((todo, index) => (
                                            <Grid container spacing={2} key={index} sx={{ paddingTop: '5px' }}>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.day}</Typography>
                                                </Grid>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.week}</Typography>
                                                </Grid>
                                                <Grid item md={3} sm={6} xs={12} sx={{ display: "flex" }}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            value={todo.shiftmode}
                                                            type="text"
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                {todo.shiftmode === 'Week Off' ? (
                                                    <Grid item md={6} sm={6} xs={12}></Grid>
                                                ) :
                                                    <>
                                                        <Grid item md={3} sm={6} xs={12}>
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput
                                                                    value={todo.shiftgrouping}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={3} xs={6} sm={6}>
                                                            <FormControl fullWidth size="small">

                                                                <OutlinedInput
                                                                    value={todo.shifttiming}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                }
                                            </Grid>
                                        ))
                                    }
                                </>
                            ) : null}

                            {boardingLog.shifttype === '1 Month Rotation' ? (
                                <>
                                    {boardingLog.todo.length > 0 ? (
                                        <Grid container spacing={2}>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Day</Typography>
                                            </Grid>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Week</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Mode</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Grouping</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : null}
                                    {boardingLog.todo &&
                                        boardingLog.todo?.map((todo, index) => (
                                            <Grid container spacing={2} key={index} sx={{ paddingTop: '5px' }}>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.day}</Typography>
                                                </Grid>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.week}</Typography>
                                                </Grid>
                                                <Grid item md={3} sm={6} xs={12} sx={{ display: "flex" }}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            value={todo.shiftmode}
                                                            type="text"
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                {todo.shiftmode === 'Week Off' ? (
                                                    <Grid item md={6} sm={6} xs={12}></Grid>
                                                ) :
                                                    <>
                                                        <Grid item md={3} sm={6} xs={12}>
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput
                                                                    value={todo.shiftgrouping}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={3} xs={6} sm={6}>
                                                            <FormControl fullWidth size="small">

                                                                <OutlinedInput
                                                                    value={todo.shifttiming}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                }
                                            </Grid>
                                        ))
                                    }
                                </>
                            ) : null}

                            {boardingLog.shifttype === '2 Month Rotation' ? (
                                <>
                                    {boardingLog.todo.length > 0 ? (
                                        <Grid container spacing={2}>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Day</Typography>
                                            </Grid>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography>Week</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Mode</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift Grouping</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={12} xs={12}>
                                                <Typography>Shift </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : null}
                                    {boardingLog.todo &&
                                        boardingLog.todo?.map((todo, index) => (
                                            <Grid container spacing={2} key={index} sx={{ paddingTop: '5px' }}>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.day}</Typography>
                                                </Grid>
                                                <Grid item md={1.5} sm={6} xs={12}>
                                                    <Typography>{todo.week}</Typography>
                                                </Grid>
                                                <Grid item md={3} sm={6} xs={12} sx={{ display: "flex" }}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            value={todo.shiftmode}
                                                            type="text"
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                {todo.shiftmode === 'Week Off' ? (
                                                    <Grid item md={6} sm={6} xs={12}></Grid>
                                                ) :
                                                    <>
                                                        <Grid item md={3} sm={6} xs={12}>
                                                            <FormControl fullWidth size="small">
                                                                <OutlinedInput
                                                                    value={todo.shiftgrouping}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={3} xs={6} sm={6}>
                                                            <FormControl fullWidth size="small">

                                                                <OutlinedInput
                                                                    value={todo.shifttiming}
                                                                    type="text"
                                                                    readOnly
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                }
                                            </Grid>
                                        ))
                                    }
                                </>
                            ) : null}
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={12}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {/*Export XL Data  */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                            rowDataArray()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
            </Dialog>

            <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="sm"
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "visible",
                    },
                }}
            >
                <Box sx={{ overflow: "auto", padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={userStyle.HeaderText}>
                                Edit
                            </Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={12} xs={12}>
                            <Typography> Date </Typography>
                            <FormControl fullWidth size="small">
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    placeholder="Date"
                                    value={shiftLogDateEdit.startdate}
                                    onChange={(e) => {
                                        setShiftLogDateEdit({
                                            ...shiftLogDateEdit,
                                            startdate: e.target.value,
                                        });
                                    }}
                                    inputProps={{
                                        min: shiftLogDateEdit.startdate
                                            ? new Date(shiftLogDateEdit.startdate).toISOString().split('T')[0]
                                            : new Date().toISOString().split('T')[0], // Set minimum date to today if startdate is not defined
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </Box>
    );
}

export default ShiftLogList;