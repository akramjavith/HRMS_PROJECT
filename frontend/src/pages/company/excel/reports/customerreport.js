import React, { useState, useRef, useContext, useEffect } from "react";
import { TableCell, TableRow, TableFooter, Box, Typography, Checkbox, TableBody, Paper, Grid, Table, TableHead, TableContainer, Button, FormControl, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { handleApiError } from "../../../../components/Errorhandling";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from '../../../../context/Appcontext';
import { AuthContext } from '../../../../context/Appcontext';
import Headtitle from "../../../../components/Headtitle";
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import ImageIcon from '@mui/icons-material/Image';
import autoTable from 'jspdf-autotable';

function FacebookCircularProgress(props) {
    return (
        <Box style={{ position: 'relative' }}>

            <CircularProgress
                variant="indeterminate"
                disableShrink
                style={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'relative',
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

function Customerwise() {

    const gridRef = useRef(null);

    const [customerwise, setCustomerwise] = useState([]);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [isLoader, setIsLoader] = useState(false);
    const { auth } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    let overallCount = 0;
    let overallPoints = 0;
    let overallTime = { hours: 0, minutes: 0, seconds: 0 };
    let overallTimeFormatted;


    // fetch count based on the customeres
    const fetchCustomerTotal = async () => {
        try {
            let res_customer = await axios.get(SERVICE.CUSTOMERWISEREPORTEXCELUPLOAD, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setCustomerwise(res_customer?.data?.resultoutput);
            setIsLoader(true);
        } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchCustomerTotal()
    }, [])

    // Sorting
    const addSerialNumber = () => {
        const itemsWithSerialNumber = customerwise?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [customerwise])

    //table sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = items?.sort((a, b) => {
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
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    //CHECK BOX SELECTION
    const handleCheckboxChange = (id) => {
        let updatedSelectedRows;
        if (selectedRows.includes(id)) {
            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
        } else {
            updatedSelectedRows = [...selectedRows, id];
        }

        setSelectedRows(updatedSelectedRows);

        // Update the "Select All" checkbox based on whether all rows are selected
        setSelectAll(updatedSelectedRows.length === filteredData.length);
    };

    //CHECK BOX CHECKALL SELECTION
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
            setSelectAll(false);
        } else {
            const allRowIds = filteredData.map((row) => row.id);
            setSelectedRows(allRowIds);
            setSelectAll(true);
        }
    };

    // Excel
    const fileName = "CustomerWiseQueueReport";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "CustomerWiseQueueReport",
        pageStyle: "print",
    });



    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#customerwisetable' })
        doc.save("CustomerWiseQueueReport.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'CustomerWiseQueueReport.png');
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={'Customer Wise Queue Report List'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Customer Wise Queue Report List</Typography>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lcustomerwisereport")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Manage Customer Wise Queue Report</Typography>
                            </Grid>
                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare?.includes("excelcustomerwisereport")
                                        && (
                                            <>
                                                <ExportXL csvData={filteredData.map(t => ({
                                                    "SNo": t.serialNumber, "Customer": t.customer, "Total Count": t.count, "Total Points": t.points, "Total Time": t.time
                                                }))} fileName={fileName} />

                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("csvcustomerwisereport")
                                        && (
                                            <>
                                                <ExportCSV csvData={filteredData.map(t => ({
                                                    "SNo": t.serialNumber, "Customer": t.customer, "Total Count": t.count, "Total Points": t.points, "Total Time": t.time
                                                }))} fileName={fileName} />

                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("printcustomerwisereport")
                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>  &ensp;  <FaPrint />  &ensp;Print&ensp;  </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("pdfcustomerwisereport")
                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>  <FaFilePdf />  &ensp;Export to PDF&ensp;  </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("imagecustomerwisereport")

                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                                            </>
                                        )}
                                </Grid>
                            </Grid>
                            <br /><br /><br />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ maxWidth: '700px', padding: '0px 20px' }}>
                                    <Grid style={userStyle.dataTablestyle}>
                                        <Box>
                                            <label >Show entries:</label>
                                            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                                <MenuItem value={(customerwise.length)}>All</MenuItem>
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
                                    <TableContainer component={Paper}>
                                        <Table ref={gridRef}
                                            aria-label="customized table"
                                            sx={{ maxWidth: '100px' }}
                                            id="usertable"
                                        >
                                            <TableHead sx={{ fontWeight: "600" }}>
                                                <StyledTableRow>
                                                    <StyledTableCell sx={userStyle.tableheadstyle}>
                                                        <Box>
                                                            <Checkbox
                                                                checked={selectAll}
                                                                onChange={handleSelectAll}
                                                            />
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('serialNumber')} ><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('customer')} ><Box sx={userStyle.tableheadstyle}><Box>Customer</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('customer')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('count')}><Box sx={userStyle.tableheadstyle}><Box >Total Count</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('count')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('points')} ><Box sx={userStyle.tableheadstyle}><Box>Total Points</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('points')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('time')} ><Box sx={userStyle.tableheadstyle}><Box>Total Time</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('time')}</Box></Box></StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            {!isLoader ?
                                                <>
                                                    <TableBody>
                                                        <StyledTableRow>
                                                            <StyledTableCell colSpan={6} align="center">
                                                                <Box sx={{ diaply: 'flex', justifyContent: 'center' }}>
                                                                    <FacebookCircularProgress />
                                                                </Box>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableBody>

                                                </>
                                                :
                                                <>
                                                    <TableBody>
                                                        {filteredData?.length > 0 ? (
                                                            filteredData?.map((row, index) => (
                                                                <StyledTableRow key={index} sx={{ background: selectedRows.includes(row.id) ? "#1976d22b !important" : "inherit" }}>
                                                                    <StyledTableCell sx={{ textAlign: 'center', padding: '0px 5px !IMPORTANT' }}>
                                                                        <Checkbox
                                                                            checked={selectedRows.includes(row.id)}
                                                                            onChange={() => handleCheckboxChange(row.id)}
                                                                        />
                                                                    </StyledTableCell>
                                                                    <StyledTableCell sx={{ textAlign: 'left', maxWidth: '50px', padding: '0px 5px' }}>{row.serialNumber}</StyledTableCell>
                                                                    <StyledTableCell sx={{ textAlign: 'left', minWidth: '150px', padding: '0px 5px !IMPORTANT' }}>{row.customer}</StyledTableCell>
                                                                    <StyledTableCell sx={{ textAlign: 'left', minWidth: 'fit-content', padding: '0px 5px !IMPORTANT' }}>{row.count}</StyledTableCell>
                                                                    <StyledTableCell sx={{ textAlign: 'left', padding: '0px 5px !IMPORTANT' }}>{(row.points).toFixed(4)}</StyledTableCell>
                                                                    <StyledTableCell sx={{ textAlign: 'left', padding: '0px 5px !IMPORTANT' }}>{row.time}</StyledTableCell>
                                                                </StyledTableRow>
                                                            ))) : <StyledTableRow> <StyledTableCell colSpan={6} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                                    </TableBody>

                                                </>
                                            }
                                            <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                                                {filteredData && (
                                                    filteredData.forEach((item) => {
                                                        overallCount += item.count;
                                                        const decimalfixed = Number(item.points).toFixed(4)
                                                        overallPoints += Number(decimalfixed);


                                                        const branchTime = item.time.split(":");
                                                        const hours = parseInt(branchTime[0]);
                                                        const minutes = parseInt(branchTime[1]);
                                                        const seconds = parseInt(branchTime[2]);

                                                        // Ensure valid ranges for minutes and seconds
                                                        if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                                                            overallTime.hours += hours;
                                                            overallTime.minutes += minutes;
                                                            overallTime.seconds += seconds;
                                                        }
                                                        const resulttime = `${overallTime.hours}:${overallTime.minutes}:${overallTime.seconds}`;
                                                        const [hoursall, minutesall, secondsall] = resulttime ? resulttime.split(":").map(Number) : String('00:00:00').split(":").map(Number);
                                                        const totalTimeInSeconds = hoursall * 3600 + minutesall * 60 + secondsall;
                                                        const newHours = Math.floor(totalTimeInSeconds / 3600);
                                                        const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
                                                        const newSeconds = totalTimeInSeconds % 60;
                                                        overallTimeFormatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

                                                    })
                                                )}
                                                <StyledTableRow className="table2_total">
                                                    <StyledTableCell ></StyledTableCell>
                                                    <StyledTableCell ></StyledTableCell>
                                                    <StyledTableCell align="left"></StyledTableCell>
                                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{overallCount}</StyledTableCell>
                                                    <StyledTableCell sx={{ fontWeight: 'bold' }}> {(overallPoints).toFixed(4)}</StyledTableCell>
                                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{overallTimeFormatted}</StyledTableCell>
                                                </StyledTableRow>
                                            </TableFooter>

                                        </Table>
                                    </TableContainer>
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
                                </Box>
                            </Box>
                            {/* ****** Table End ****** */}
                            <br />
                            <TableContainer component={Paper} sx={userStyle.printcls} >
                                <Table id="customerwisetable"
                                    aria-label="customized table"
                                    ref={componentRef}
                                >
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell>SNo</StyledTableCell>
                                            <StyledTableCell>Customer</StyledTableCell>
                                            <StyledTableCell>Total Count</StyledTableCell>
                                            <StyledTableCell>Total Points</StyledTableCell>
                                            <StyledTableCell>Total Time</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData?.length > 0 ? (
                                            filteredData?.map((row, index) => (
                                                <StyledTableRow key={index} >
                                                    <StyledTableCell sx={{ padding: '10px' }}>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '10px !IMPORTANT' }}>{row.customer}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '10px !IMPORTANT' }}>{row.count}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '10px !IMPORTANT' }}>{(row.points).toFixed(4)}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: '10px !IMPORTANT' }}>{row.time}</StyledTableCell>
                                                </StyledTableRow>
                                            ))) : <StyledTableRow> <StyledTableCell colSpan={6} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                    </TableBody>
                                    <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                                        <StyledTableRow className="table2_total">
                                            <StyledTableCell align="left"></StyledTableCell>
                                            <StyledTableCell align="left"></StyledTableCell>
                                            <StyledTableCell align="left">{overallCount}</StyledTableCell>
                                            <StyledTableCell align="left">{(overallPoints).toFixed(4)}</StyledTableCell>
                                            <StyledTableCell align="left">{overallTimeFormatted}</StyledTableCell>
                                        </StyledTableRow>
                                    </TableFooter>

                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                )}
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

export default Customerwise;