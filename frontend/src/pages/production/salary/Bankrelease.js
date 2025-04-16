import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { Link } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Selects from "react-select";


const ButtonCellRenderer = (props) => {
    const { data, node, fetchBankRleaseDatas } = props;

    const { auth } = props.context
    //Delete model... 
    const [isDelOpen, setIsDelOpen] = useState(false);
    const handleClickOpenDel = () => {
        setIsDelOpen(true);
    };
    const handleCloseModDel = (e, reason) => {
        // if (reason && reason === "backdropClick") return;
        setIsDelOpen(false);
    };

    //Delete model... 
    const [isClose, setIsClose] = useState(false);

    const handleCloseBankclose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsClose(false);
    };


    const handleCloseBtn = async () => {
        console.log("close");
        try {
            let Res_Data = await axios.post(SERVICE.FETCH_BANKRELEASE_PAYRUNLIST_MONTHWISE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: node.data.month,
                year: node.data.year,
            });

            console.log(Res_Data.data.payrunlists);

            let mergedData = Res_Data.data.payrunlists.map(item => ({ data: item.data.map(t => ({ ...t, outerId: item._id })) })).map(d => d.data).flat();


            let mergedDatafinal = mergedData.filter(d => d.sentfixsalary === "Yes")?.sort((a, b) => {
                // First, sort by experienceinmonth
                if (Number(b.experience) !== Number(a.experience)) {
                    return Number(b.experience) - Number(a.experience);
                }
                // If experienceinmonth is the same, sort by employeename
                return a.companyname.localeCompare(b.companyname);
            });
            // console.log(mergedDatafinal, 'mergedDatafinal')
            //SECOND TABLE
            let addserialnumberfilteredTabletwo = mergedDatafinal.reduce((acc, item) => {
                return acc.concat(item.logdata);
            }, []);

            let salaryDataFetched = addserialnumberfilteredTabletwo.filter(d => d.status === "bankrelease" && (d.updatechangedate ? d.updatechangedate == node.data.date : d.paydate == node.data.date)).map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));



            const aggregation = salaryDataFetched;


            const result = Object.values(aggregation);
            const finalToUpdateIds = result.map(item => ({
                outerId: item.outerId,
                innerId: item.innerId,
                logid: item._id,
            }))

            console.log(node.data._id, 'jhgf')
            let res = await axios.post(`${SERVICE.BANK_RELEASE_CLOSED}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                ids: finalToUpdateIds,
                bankstatus: "created",
                status: "closed"

            });
            console.log(res, 'hgf')
            if (res.statusText == "OK") {

                let resNew = await axios.put(`${SERVICE.BANK_RELEASE_SINGLE}/${node.data._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    bankclose: "closed"
                });

                await fetchBankRleaseDatas();
                setIsClose(false);

            }

        }
        catch (err) {
            console.log(err, 'sdff');
        }

    };

    const delSubmit = async () => {
        try {
            await axios.delete(`${SERVICE.BANK_RELEASE_SINGLE}/${node.data._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let Res_Data = await axios.post(SERVICE.FETCH_BANKRELEASE_PAYRUNLIST_MONTHWISE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: node.data.month,
                year: node.data.year,
            });


            let mergedData = Res_Data.data.payrunlists.map(item => ({ data: item.data.map(t => ({ ...t, outerId: item._id })) })).map(d => d.data).flat();


            let mergedDatafinal = mergedData.filter(d => d.sentfixsalary === "Yes")?.sort((a, b) => {
                // First, sort by experienceinmonth
                if (Number(b.experience) !== Number(a.experience)) {
                    return Number(b.experience) - Number(a.experience);
                }
                // If experienceinmonth is the same, sort by employeename
                return a.companyname.localeCompare(b.companyname);
            });

            //SECOND TABLE
            let addserialnumberfilteredTabletwo = mergedDatafinal.reduce((acc, item) => {
                return acc.concat(item.logdata);
            }, []);

            let salaryDataFetched = addserialnumberfilteredTabletwo.filter(d => d.status === "bankrelease" && (d.updatechangedate ? d.updatechangedate == node.data.date : d.paydate == node.data.date)).map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));



            const aggregation = salaryDataFetched;


            const result = Object.values(aggregation);
            const finalToUpdateIds = result.map(item => ({
                outerId: item.outerId,
                innerId: item.innerId,
                logid: item._id,
            }))

            let res = await axios.post(`${SERVICE.BANK_RELEASE_CLOSED}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                ids: finalToUpdateIds,
                bankstatus: "",
                status: ""
            });

            await fetchBankRleaseDatas();
            setIsDelOpen(false);
        } catch (err) {
            console.log(err, 'err')
        }
    }

    const closeSubmit = () => {

        setIsClose(true);
    }

    return (
        <>
            <Box>
                <Link to={`/production/payroll/bankreleasebreakup/${node.data.month}/${node.data.year}/${node.data.date}`}>
                    <Button sx={{
                        textTransform: "capitalize", backgroundColor: "#17a2b8", minWidth: "30px", '&:hover': {
                            backgroundColor: "#30a5b7db" // Change this color to whatever you want for the hover effect
                        }, padding: "4px 14px", color: "white"
                    }} size="small" >
                        BreakUp
                    </Button>
                </Link>
                <Link to={`/production/payroll/bankreleaseall/${node.data.month}/${node.data.year}/${node.data.date}`}>
                    <Button variant="contained" sx={{ textTransform: "capitalize", padding: "4px 14px", minWidth: "30px" }} size="small"  >
                        All
                    </Button>
                </Link>
                {node.data.bankclose != "closed" ?
                    <>
                        <Button variant="contained" color="error" onClick={handleClickOpenDel} sx={{ textTransform: "capitalize", padding: "4px 14px", minWidth: "30px" }} size="small"  >
                            Delete
                        </Button> &ensp;&ensp;

                        <Button variant="contained" color="primary" onClick={closeSubmit} sx={{ textTransform: "capitalize", padding: "4px 14px", minWidth: "30px" }} size="small"  >
                            Close
                        </Button>
                    </>
                    : null
                }
            </Box >

            <Dialog open={isDelOpen} onClose={handleCloseModDel} aria-labelledby="alert-dialog-title-delete" aria-describedby="alert-dialog-description-delete">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={delSubmit}>
                        Yes
                    </Button>
                    <Button sx={userStyle.btncancel} onClick={handleCloseModDel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isClose} onClose={handleCloseBankclose} aria-labelledby="alert-dialog-title-close" aria-describedby="alert-dialog-description-close">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Are you sure you want to close?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseBtn}>
                        Yes
                    </Button>
                    <Button sx={userStyle.btncancel} onClick={handleCloseBankclose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}


function BankRelease() {

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const { isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
    const years = [];
    for (let year = yyyy; year >= 1977; year--) {
        years.push({ value: year, label: year.toString() });
    }

    const [isActive, setIsActive] = useState(false);

    const { isUserRoleCompare, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let currentMonth = monthNames[mm - 1];

    const [selectedYear, setSelectedYear] = useState(yyyy);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectmonthname, setSelectMonthName] = useState(currentMonth);
    const [selectedMonthNum, setSelectedMonthNum] = useState(mm);


    const [selectedDate, setSelectedDate] = useState("");
    const [availDates, setAvailDates] = useState([]);

    const fetchPaidDateFixes = async () => {
        try {
            let prodDateFix = await axios.post(SERVICE.PAIDDATEFIX_FITLERED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: selectmonthname,
                year: selectedYear,
            });
            let paidDatesFixed = prodDateFix.data.paiddatefixs.map(item => item.date);

            // let removeDupe = [... new Set(paidDatesFixed)].map(d => ({
            //     // ...d,
            //     label: d,
            //     value: d
            // }))
            let removeDupe = [... new Set(paidDatesFixed)]

            let checkOldBankRelease = await axios.post(SERVICE.CHECKWITH_BANK_RELEASE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: selectmonthname,
                year: String(selectedYear),
            });

            let finalDates = removeDupe.filter(d => !checkOldBankRelease.data.bankrelease.map(item => item.date).includes(d))
            const currentDate = new Date();

            let finalresultStatusDatefix = finalDates.map((item) => {
                // let datevalue = new Date(item) < new Date(currentDate) && item.afterexpiry != "Enable";
                return {
                    // label: datevalue ? `${item} (Expired) Choose Next` : item,
                    // value: datevalue ? `${item} (Expired) Choose Next` : item,
                    label: item,
                    value: item
                };
            });

            setAvailDates(finalresultStatusDatefix);

            console.log(finalresultStatusDatefix, 'finalresultStatusDatefix')
        } catch (err) {
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

    useEffect(() => {
        fetchPaidDateFixes()
    }, [selectedMonth, selectedYear])

    const handleYearChange = (event) => {
        setSelectedYear(event.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.value);
        setSelectMonthName(event.label);
        setSelectedMonthNum(event.numval);
        setSelectedDate("");
    };

    const handleDateChange = (event) => {
        if (event.value.includes("(Expired)")) {
            alert("You cannot select an expired date. Please Choose Next Date")
            setSelectedDate("");
        } else {
            setSelectedDate(event.value);
        }
    };

    const context = {
        auth
    }
    //month dropdown options
    const months = [
        { value: "January", label: "January", numval: 1 },
        { value: "February", label: "February", numval: 2 },
        { value: "March", label: "March", numval: 3 },
        { value: "April", label: "April", numval: 4 },
        { value: "May", label: "May", numval: 5 },
        { value: "June", label: "June", numval: 6 },
        { value: "July", label: "July", numval: 7 },
        { value: "August", label: "August", numval: 8 },
        { value: "September", label: "September", numval: 9 },
        { value: "October", label: "October", numval: 10 },
        { value: "November", label: "November", numval: 11 },
        { value: "December", label: "December", numval: 12 },
    ];

    const gridRefContainer = useRef(null);

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

    const fetchBankRleaseDatas = async () => {
        try {
            let salaryData = await axios.get(SERVICE.BANK_RELEASE_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            let addSerialNumber = salaryData.data.bankrelease.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            }))
            setRowData(addSerialNumber);

            setFilteredData(addSerialNumber)
        } catch (err) {
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


    const columnApi = useRef(null);
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

    const columnDataTable = [
        { headerName: "Sno", field: "serialNumber", sortable: true, filter: true, resizable: true },
        { headerName: "Year", field: "year", sortable: true, filter: true, resizable: true },
        { headerName: "Month", field: "month", sortable: true, filter: true, resizable: true },
        { headerName: "Date", field: "date", sortable: true, filter: true, resizable: true },
        {
            headerName: "Action", field: "action", width: 400, sortable: true, filter: true, resizable: true,
            cellRenderer: ButtonCellRenderer,
            cellRendererParams: {
                fetchBankRleaseDatas: fetchBankRleaseDatas
            }
        },
    ]

    const rowDataTable = currentData.map((item, index) => {
        return {
            ...item,
            id: item._id,
        };
    })


    const handleSubmit = async () => {
        try {


            let Res_Data = await axios.post(SERVICE.FETCH_BANKRELEASE_PAYRUNLIST_MONTHWISE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                month: selectedMonth,
                year: String(selectedYear),
            });

            let mergedData = Res_Data.data.payrunlists.map(item => ({ data: item.data.map(t => ({ ...t, outerId: item._id })) })).map(d => d.data).flat();

            let mergedDatafinal = mergedData.filter(d => d.sentfixsalary === "Yes")?.sort((a, b) => {
                // First, sort by experienceinmonth
                if (Number(b.experience) !== Number(a.experience)) {
                    return Number(b.experience) - Number(a.experience);
                }
                // If experienceinmonth is the same, sort by employeename
                return a.companyname.localeCompare(b.companyname);
            });

            //SECOND TABLE
            let addserialnumberfilteredTabletwo = mergedDatafinal.reduce((acc, item) => {
                return acc.concat(item.logdata);
            }, []);

            let finalitemsTabletwo = addserialnumberfilteredTabletwo.filter(d => d.status === "bankrelease" && (d.updatechangedate ? d.updatechangedate == selectedDate : d.paydate == selectedDate)).map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            // setRowData(finalitemsTabletwo);

            let salaryDataFetched = finalitemsTabletwo;
            let ids = salaryDataFetched.map(item => ({
                outerId: item.outerId,
                innerId: item.innerId,
                logid: item._id,
            }))


            if (salaryDataFetched.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"No Data to Upload"}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                const [branches, res] = await Promise.all([
                    axios.post(SERVICE.BANK_RELEASE_CREATE, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        month: String(selectedMonth),
                        year: String(selectedYear),
                        date: String(selectedDate),
                        bankclose: "",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }),
                    axios.post(`${SERVICE.BANK_RELEASE_CLOSED}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        ids: ids,
                        bankstatus: "created",
                        status: ""
                    })
                ]);

                await Promise.all([
                    fetchBankRleaseDatas(),
                    fetchPaidDateFixes(),
                    Promise.resolve(setShowAlert(
                        <>
                            <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
                        </>
                    )),
                    Promise.resolve(setIsErrorOpen(true))
                ]);
            }



        } catch (err) {
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


    useEffect(() => {
        fetchBankRleaseDatas();
    }, [])


    return (
        <Box>
            <Headtitle title={"Bank Release"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}> Bank Release</Typography>
            {isUserRoleCompare?.includes("abankrelease") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>

                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Year<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Month <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={availDates} value={{ label: selectedDate, value: selectedDate }} onChange={handleDateChange} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6} marginTop={3}>
                                    <Button variant="contained" disabled={isActive === true} onClick={() => handleSubmit()}>
                                        Prepare
                                    </Button>
                                </Grid>

                            </Grid>
                            <br /> <br />

                        </>
                    </Box>


                </>
            )}
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lbankrelease") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Month List:</Typography>
                        </Grid>
                        <br />
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
                        <br />
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
                                        context={context}
                                        rowData={rowDataTable}
                                        getRowId={(params) => params.data.id}
                                        onGridReady={onGridReady}
                                        domLayout={"autoHeight"}
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
export default BankRelease;