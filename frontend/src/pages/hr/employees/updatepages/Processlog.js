import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf, } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../../components/Export";
import jsPDF from "jspdf";
import moment from 'moment-timezone';
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from '../../../../context/Appcontext';
import { handleApiError } from "../../../../components/Errorhandling";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import StyledDataGrid from "../../../../components/TableStyle";
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';

function ProcessLogList({ boardinglogs, userID }) {

    const gridRef = useRef(null);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [boardinglogsProcess, setBoardinglogsProcess] = useState([])
    const [items, setItems] = useState([]);
    const [processlogData, setProcesslogData] = useState([]);
    const [processlogcheck, setProcesslogcheck] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState('');

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        starttime: true,
        startdate: true,
        time: true,
        branch: true,
        unit: true,
        team: true,
        floor: true,
        area: true,
        workstation: true,
        company: true,
        process: true,
        processduration: true, createdby: true,
        processduration: true, processtype: true, allotedhours: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const fetchAllUsersLimit = async () => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            const currentUser = res?.data?.suser;

            const uniqueArray = res?.data?.suser.processlog.map((item, index) => {
                return {
                    _id: item._id,
                    team: item.team,
                    username: currentUser.companyname,
                    startdate: item.date,
                    createdby: item?.updatedusername,
                    time: item.updateddatetime ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a") : "",
                    branch: item.branch,
                    unit: item.unit,
                    company: item.company,
                    floor: item.floor,
                    area: item.area,
                    workstation: item.workstation,
                    process: item.process,
                    processduration: item.processduration,
                    processtype: item.processtype,
                    allotedhours: item.time
                }
            })
            setBoardinglogsProcess(uniqueArray);
            setProcesslogcheck(true);
        } catch (err) { setProcesslogcheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchAllUsersLimit();
    }, []);

    // Excel
    const fileName = "Process Log List";
    // get particular columns for export excel 
    const getexcelDatas = () => {
        var data = items?.map((t, index) => ({
            "SNo": index + 1,
            "Company": t.company,
            "Branch": t.branch,
            "Unit": t.unit,
            Floor: t.floor,
            Area: t.area,
            "Team": t.team,
            Workstation: t.workstationexcel,
            "Employee Name": t.username,
            "Start Date": t.startdate,
            "Created Date&Time": t.time,
            "Created By": t.createdby,
            "Process": t.process,
            "Process Duration": t.processduration,
            "Process Type": t.processtype,
            "Process Hours": t.allotedhours,
        }));
        setProcesslogData(data);
    }

    useEffect(() => {
        getexcelDatas();
    }, [boardinglogsProcess])

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Process Log List',
        pageStyle: 'print'
    });

    // pdf.....
    const columns = [
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Team", field: "team" },
        { title: "Workstation", field: "workstation" },
        { title: "Employee Name", field: "username" },
        { title: "Start Date ", field: "startdate" },
        { title: "Created Date&Time", field: "time" },
        { title: "Created By", field: "createdby" },
        { title: "Process", field: "process" },
        { title: "Process Duration", field: "processduration" },
        { title: "Process Type", field: "processtype" },
        { title: "Process Hours", field: "allotedhours" },
    ]

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = boardinglogsProcess.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            startdate: item.startdate !== "" ? moment(item.startdate).format('DD-MM-YYYY') : ""
        }));
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 4, },
            columns: columnsWithSerial,
            body: itemsWithSerial,
        });
        doc.save("Process Log List.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Process Log List.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const addSerialNumber = () => {
        const itemsWithSerialNumber = boardinglogsProcess?.map((item, index) => ({
            ...item, serialNumber: index + 1, workstationexcel: item.workstation?.map((t, i) => `${i + 1 + ". "}` + t)
                .toString(),
        }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [boardinglogsProcess])

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

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 60, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
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
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        {
            field: "workstation",
            headerName: "Workstation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.workstation,
            headerClassName: "bold-header",
        },
        { field: "startdate", headerName: "Start Date", flex: 0, width: 150, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
        { field: "time", headerName: "Created ", flex: 0, width: 150, hide: !columnVisibility.time, headerClassName: "bold-header" },
        { field: "createdby", headerName: "Created By", flex: 0, width: 150, hide: !columnVisibility.createdby, headerClassName: "bold-header" },
        {
            field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibility.process, headerClassName: "bold-header",
            renderCell: (params) => {
                return (
                    <Grid>
                        <Button size="small"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontWeight: '500',
                                display: 'flex',
                                color: 'red',
                            }}
                        >
                            {params.row.process}
                        </Button>
                    </Grid >
                );
            },
        },
        { field: "processduration", headerName: "Process Duration", flex: 0, width: 70, hide: !columnVisibility.processduration, headerClassName: "bold-header" },
        { field: "processtype", headerName: "Process Type", flex: 0, width: 100, hide: !columnVisibility.processtype, headerClassName: "bold-header" },
        { field: "allotedhours", headerName: "Process Hours", flex: 0, width: 70, hide: !columnVisibility.allotedhours, headerClassName: "bold-header" },
    ]

    function isValidDateFormat(dateString) {
        // Regular expression to match the format YYYY-MM-DD
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

        return dateFormatRegex.test(dateString);
    }

    const rowDataTable = filteredData.map((item, index) => {
        const formattedStartDate = isValidDateFormat(item.startdate) ? moment(item.startdate).format('DD-MM-YYYY') : item.startdate;
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            startdate: formattedStartDate,
            username: item.username,
            floor: item.floor,
            area: item.area,
            workstation: item.workstation,
            workstationexcel: item.workstation,
            starttime: item.starttime,
            time: item.time,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            process: item.process,
            processduration: item.processduration,
            processtype: item.processtype,
            allotedhours: item.allotedhours,
            createdby: item.createdby
        }
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
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
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

    return (
        <Box>

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lboardinglog") && (
                <>
                    <Box sx={{ border: '1px solid #8080801c', padding: '20px' }} >
                        <Grid container spacing={2} >
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}>
                                    <b>Process Log</b>
                                </Typography>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(boardinglogsProcess?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelboardinglog") && (
                                        <>
                                            <ExportXL csvData={processlogData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvboardinglog") && (
                                        <>
                                            <ExportCSV csvData={processlogData} fileName={fileName} />

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printboardinglog") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfboardinglog") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageboardinglog") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        </>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!processlogcheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

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
                            :
                            <>
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                                        Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>}
                    </Box>
                </>
            )
            }

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
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
                            <TableCell>Created Date&Time</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Process Duration</TableCell>
                            <TableCell>Process Type</TableCell>
                            <TableCell>Process Hours</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {boardinglogsProcess &&
                            (boardinglogsProcess.map((row, index) => (
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
                                    <TableCell>{moment(row.startdate).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.createdby}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.processduration}</TableCell>
                                    <TableCell>{row.processtype}</TableCell>
                                    <TableCell>{row.allotedhours}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default ProcessLogList;