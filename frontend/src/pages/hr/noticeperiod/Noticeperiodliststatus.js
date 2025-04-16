import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody, List } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import moment from 'moment-timezone';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Rechecklist from './rechecklist';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';

function Noticeperiodlist() {
    const [employees, setEmployees] = useState([]);
    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const { auth } = useContext(AuthContext);
    const [getrowid, setRowGetid] = useState([]);

    const [empaddform, setEmpaddform] = useState({
        branch: "", floor: "", department: "", company: "", unit: "",
        team: "", designation: "", shifttiming: "", reportingto: ""
    });
    // const [selectedbranch, setselectedbranch] = useState([]);
    const [exceldata, setexceldata] = useState([]);

    const [isBoarding, setIsBoarding] = useState(false);

    let username = isUserRoleAccess.name
    const id = useParams().id


    // Show all columns
    const [columnVisibility, setColumnVisibility] = useState({
        actions: true,
        serialNumber: true,
        branch: true,
        unit: true,
        name: true,
        empcode: true,
        department: true,
        date: true,
        reason: true,
        document: true,
        status: true,
        releasedate: true,

    });

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

    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setEmpaddform(res?.data?.suser);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setEmpaddform(res?.data?.suser);
            setRowGetid(res?.data?.suser);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //  PDF
    const columns = [

        { title: "Sno", field: "sno" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Name", field: "companyname" },
        { title: "Empcode", field: "empcode" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: "Date", field: "date" },
        { title: "Reason", field: "reason" },
        { title: "Document", field: "document" },
        { title: "Status", field: "status" },
        { title: "Release Date", field: "releasedate" },
    ]

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: exceldata,
        });
        doc.save("Boardingeditlist.pdf");
    };

    // Excel
    const fileName = "Boardingedit";
    let excelno = 1;

    // get particular columns for export excel
    const getexcelDatas = async () => {
        try {
            let response = await axios.get(SERVICE.USERSEXCELDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            var data = response.data.users.length > 0 && response.data.users.map(t => ({
                Sno: excelno++, Branch: t.branch, unit: t.unit, Name: t.companyname, Empcode: t.empcode, Team: t.team,
                Department: t.department, date: t.date, Reason: t.reason, Document: t.document, Status: t.status, Releasedate: t.releasedate

            }));
            setexceldata(data);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Boardeditlist",
        pageStyle: "print",
    });


    useEffect(() => {
        getexcelDatas()
    }, [employees])


    //table entries ..,.
    const [items, setItems] = useState([]);


    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }


    useEffect(() => {
        addSerialNumber();

    }, [employees])



    //table sorting
    const [sorting, setSorting] = useState({ column: '', direction: '' });

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    items.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };


    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };



    //datatable....
    const [searchQuery, setSearchQuery] = useState("");
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


    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(employees.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }


    // Table start colum and row
    // Define columns for the DataGrid
    const columnDataTable = [

        { field: <span sx={{ fontWeight: 'bold' }}>serialNumber </span>, headerName: "SNo", flex: 0, width: 50, hide: !columnVisibility.serialNumber },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit },
        { field: "name", headerName: "Name", flex: 0, width: 100, hide: !columnVisibility.empcode },
        { field: "empcode", headerName: "Empcode", flex: 0, width: 100, hide: !columnVisibility.serialNumber },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team },
        { field: "department", headerName: "Department", flex: 0, width: 100, hide: !columnVisibility.department },
        { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.date },
        { field: "reason", headerName: "Reason", flex: 0, width: 300, hide: !columnVisibility.reason },
        { field: "document", headerName: "Document", flex: 0, width: 150, hide: !columnVisibility.document },
        { field: "status", headerName: "Status", flex: 0, width: 100, hide: !columnVisibility.status },
        { field: "releasedate", headerName: "Release Date", flex: 0, width: 100, hide: !columnVisibility.releasedate },
    ];

    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((notice, index) => {
        return {
            id: notice._id,
            serialNumber: notice.serialNumber,
            branch: notice.branch,
            unit: notice.unit,
            name: notice.name,
            empcode: notice.empcode,
            team: notice.team,
            department: notice.department,
            date: notice.date,
            reason: notice.reason,
            document: notice.document,
            status: notice.status,
            releasedate: notice.releasedate,

        }
    });

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


    // Calculate the DataGrid height based on the number of rows
    const calculateDataGridHeight = () => {
        if (pageSize === 'All') {
            return 'auto'; // Auto height for 'All' entries
        } else {
            // Calculate the height based on the number of rows displayed
            const visibleRows = Math.min(pageSize, filteredDatas.length);
            const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
            const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
            const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
            return `${visibleRows > 0 ? visibleRows * rowHeight + extraSpace : scrollbarWidth + extraSpace}px`;
        }
    };



    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Notice Period List</Typography>
            <br />
            {isUserRoleCompare?.includes("lnoticeperiodapprove") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.SubHeaderText}>Apply List</Typography>
                            </Grid>
                        </Grid>
                        {!isBoarding ? <>
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
                            : <>
                                <br /><br />

                                <Grid container sx={{ justifyContent: "center" }} >
                                    <Grid>
                                        {isUserRoleCompare?.includes("excelnoticeperiodapprove") && (
                                            <>
                                                <ExportCSV csvData={exceldata} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvnoticeperiodapprove") && (
                                            <>
                                                <ExportXL csvData={exceldata} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printnoticeperiodapprove") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfnoticeperiodapprove") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                    </Grid>
                                </Grid><br />
                                {/* added to the pagination grid */}
                                <Grid style={userStyle.dataTablestyle}>
                                    <Box>
                                        <label htmlFor="pageSizeSelect">Show entries:</label>
                                        <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={(employees.length)}>All</MenuItem>
                                        </Select>
                                    </Box>
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
                                <br />
                                {/* ****** Table Grid Container ****** */}
                                <Grid container>
                                    <Grid md={4} sm={2} xs={1}></Grid>
                                    <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                                </Grid>
                                <br />

                                {/* ****** Table start ****** */}

                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>
                                {/* {isLoader ? ( */}
                                <>
                                    <Box
                                        style={{
                                            height: calculateDataGridHeight(),
                                            width: '100%',
                                            overflowY: 'hidden', // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            rows={rowDataTable}
                                            columns={columnDataTable}
                                            autoHeight={pageSize === 'All'}
                                            hideFooter
                                        />
                                    </Box>
                                    <br />
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
                                    </Box>  <br />  <br />
                                </>

                            </>}
                    </Box>
                    <br />
                    <Box sx={userStyle.container}>
                        <Rechecklist />
                    </Box>
                </>

            )
            }
            <br />
            {/* ****** Table End ****** */}


            <Box>
                <Dialog
                    open={isErrorOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" ></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    aria-label="simple table"
                    id="branch"
                    ref={componentRef}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Floor </StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Designation</StyledTableCell>
                            <StyledTableCell>Shift Timing</StyledTableCell>
                            <StyledTableCell>Reporting To</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {employees &&
                            (employees.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.branch} </StyledTableCell>
                                    <StyledTableCell> {row.floor}</StyledTableCell>
                                    <StyledTableCell>{row.department}</StyledTableCell>
                                    <StyledTableCell>{row.team}</StyledTableCell>
                                    <StyledTableCell>{row.designation}</StyledTableCell>
                                    <StyledTableCell>{row.shifttiming}</StyledTableCell>
                                    <StyledTableCell>{row.reportingto}</StyledTableCell>
                                </StyledTableRow>

                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>


        //    another table

    );
}


export default Noticeperiodlist;


