import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { Link, useParams } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { ThreeDots } from "react-loader-spinner";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";



function BankReleaseBreakup() {


    const [isActive, setIsActive] = useState(false);

    const selectedMonth = useParams().month;
    const selectedYear = useParams().year;
    const selectedDate = useParams().date;

    const { isUserRoleCompare, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    //Datatable
    const gridRefContainer = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsActive(false);
    };


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

    const [rowData, setRowData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    const fetchBankRleaseDatas = async () => {
        try {
            // let salaryData = await axios.get(`${SERVICE.BANK_RELEASE_SINGLE}/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },

            // });


            let Res_Data = await axios.post(SERVICE.FETCH_BANKRELEASE_PAYRUNLIST_MONTHWISE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: selectedMonth,
                year: selectedYear,
            });

            console.log(Res_Data.data.payrunlists)
            let mergedData = Res_Data.data.payrunlists.map(item => ({ data: item.data.map(t => ({ ...t, outerId: item._id })) })).map(d => d.data).flat();


            let mergedDatafinal = mergedData.filter(d => d.sentfixsalary === "Yes")?.sort((a, b) => {
                // First, sort by experienceinmonth
                if (Number(b.experience) !== Number(a.experience)) {
                    return Number(b.experience) - Number(a.experience);
                }
                // If experienceinmonth is the same, sort by employeename
                return a.companyname.localeCompare(b.companyname);
            });
            console.log(mergedDatafinal, 'mergedDatafinal')
            //SECOND TABLE
            let addserialnumberfilteredTabletwo = mergedDatafinal.reduce((acc, item) => {
                return acc.concat(item.logdata);
            }, []);

            let salaryDataFetched = addserialnumberfilteredTabletwo.filter(d => d.status === "bankrelease" && d.bankreleasestatus === "created" && (d.updatechangedate ? d.updatechangedate == selectedDate : d.paydate == selectedDate)).map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));



            const aggregation = salaryDataFetched;


            const result = Object.values(aggregation);

            let addSerialNumber = result.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            }));
            setRowData(addSerialNumber);
            setFilteredData(addSerialNumber);
        } catch (err) {
            console.log(err, 'err')
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }

    const gridApi = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const onQuickFilterChanged = useCallback((event) => {
        if (gridApi.current) {
            const filterText = event.target.value;
            gridApi.current.setQuickFilter(filterText);
            const filtered = rowData.filter(row => JSON.stringify(row).toLowerCase().includes(filterText.toLowerCase()));
            setFilteredData(filtered);
            setCurrentPage(1);
        }
    }, [rowData]);


    let minRowHeight = 25;
    let currentRowHeight;
    const columnApi = useRef(null);
    const onGridReady = useCallback((params) => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
        currentRowHeight = minRowHeight;
      }, []);

    useEffect(() => {
        updateGridData();
    }, [currentPage, filteredData, pageSize]);

    const updateGridData = () => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setCurrentData(filteredData.slice(start, end));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page whenever page size changes
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage === 1) {
                pageNumbers.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    const gridRefnew = useRef();

    const getRowClass = params => {
        return params.node.rowPinned ? 'custom-footer-row' : params.node.rowIndex % 2 === 0 ? 'even-aggrid-row' : 'odd-aggrid-row';
    };


    const columnDataTable = [
        { headerName: "Sno", field: "serialNumber", width: 80, sortable: true, filter: true, resizable: true },
        { headerName: "Empcode", field: "empcode", sortable: true, width: 130, filter: true, resizable: true },
        { headerName: "EmpName", field: "companyname", sortable: true, filter: true, resizable: true },
        { headerName: "Account Name", field: "accountholdername", sortable: true, filter: true, resizable: true },
        { headerName: "Bank Name", field: "bankname", sortable: true, filter: true, resizable: true },
        { headerName: "Bank AccountNo", field: "accountno", sortable: true, filter: true, resizable: true },
        { headerName: "IFSC", field: "ifsccode", sortable: true, filter: true, resizable: true },
        { headerName: "Pay Amount", field: "payamount", sortable: true, width: 120, filter: true, resizable: true },
        { headerName: "Pay Date", field: "paydate", sortable: true, width: 120, filter: true, resizable: true },
    ]

    const rowDataTable = currentData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            empcount: String(item.empcount),
            paydate: item.updatechangedate ? item.updatechangedate : item.paydate,
            payamounttotal: String(item.payamounttotal)
        };
    })



    useEffect(() => {
        fetchBankRleaseDatas();
    }, [])


    return (
        <Box>
            <Headtitle title={"Release Details"} />
            {/* ****** Header Content ****** */}
            <Grid container>
                <Grid item md={8} lg={8} sm={8} xs={12}>   <Typography sx={userStyle.HeaderText}>{`Release Details:-`}</Typography></Grid>
                <Grid item md={4} lg={4} sm={4} xs={12}><Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Link to={`/production/payroll/bankrelease`} ><Button variant="contained" size="small">Go back</Button></Link>
                </Box></Grid>
            </Grid>



            {isUserRoleCompare?.includes("lbankrelease") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
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
                                        <MenuItem value={rowData?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <OutlinedInput
                                    size="small"
                                    variant="outlined"
                                    onChange={onQuickFilterChanged}
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>

                        {isActive ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", }} className="ag-theme-quartz" ref={gridRefContainer} >

                                    <AgGridReact
                                        columnDefs={columnDataTable}
                                        ref={gridRefnew}
                                        rowData={rowDataTable}
                                        getRowId={(params) => params.data.id}
                                        onGridReady={onGridReady}
                                        domLayout={"autoHeight"}
                                        getRowClass={getRowClass}
                                    />
                                </Box>

                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers[0] > 1 && <span>...</span>}
                                        {pageNumbers.map((pageNumber) => (
                                            <Button
                                                key={pageNumber}
                                                sx={userStyle.paginationbtn}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={currentPage === pageNumber ? 'active' : ''}
                                                disabled={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {pageNumbers[pageNumbers.length - 1] < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>

                                    </Box>
                                </Box>

                            </>
                        )}
                    </Box>
                </>
            )}
            {/* ALERT DIALOG */}
            <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseerr}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default BankReleaseBreakup;