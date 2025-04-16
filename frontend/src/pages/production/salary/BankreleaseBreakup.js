import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { Link, useParams } from "react-router-dom";
import Headtitle from "../../../components/Headtitle";
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
    // const [totalValue, setTotalValue] = useState(0);

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



            const aggregation = salaryDataFetched.reduce((acc, curr) => {
                if (!acc[curr.paidstatus]) {
                    acc[curr.paidstatus] = { paidstatus: curr.paidstatus, empcount: 0, payamounttotal: 0 };
                }
                acc[curr.paidstatus].empcount += 1;
                acc[curr.paidstatus].paymonth = curr.paymonth;
                acc[curr.paidstatus].payyear = curr.payyear;
                acc[curr.paidstatus].paydate = curr.updatechangedate ? curr.updatechangedate : curr.paydate;
                acc[curr.paidstatus]._id = curr._id;
                acc[curr.paidstatus].payamounttotal += Number(curr.payamount)
                return acc;
            }, {});

            const result = Object.values(aggregation);

            let addSerialNumber = result.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            }));
            setRowData(addSerialNumber);

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
    let minRowHeight = 25;
    let currentRowHeight;


    const onFirstDataRendered = useCallback((params) => {
        const gridApi = params.api;

        // Access the number of displayed rows
        const displayedRowCount = gridApi.getDisplayedRowCount();

        let totalSum = 0;

        // Iterate over each displayed row to sum up the payamounttotal
        for (let i = 0; i < displayedRowCount; i++) {
            const rowNode = gridApi.getDisplayedRowAtIndex(i);
            totalSum += Number(rowNode.data.payamounttotal);
        }
        // Create the footer row data
        const footerData = [{ empcount: 'Total:', payamounttotal: (totalSum) }];

        // Set the pinned bottom row data
        gridApi.setPinnedBottomRowData(footerData);
    }, []);
    const columnApi = useRef(null);
    const onGridReady = useCallback((params) => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
        currentRowHeight = minRowHeight;
      }, []);



    const getRowClass = params => {
        return params.node.rowPinned ? 'custom-footer-row' : params.node.rowIndex % 2 === 0 ? 'even-aggrid-row' : 'odd-aggrid-row';
    };



    const gridRefnew = useRef();

    const columnDataTable = [
        { headerName: "Sno", field: "serialNumber", sortable: true, filter: true, resizable: true },
        { headerName: "Year", field: "payyear", sortable: true, filter: true, resizable: true },
        { headerName: "Month", field: "paymonth", sortable: true, filter: true, resizable: true },
        { headerName: "Pay Status", field: "paidstatus", width: 350, sortable: true, filter: true, resizable: true },
        { headerName: "Pay Date", field: "paydate", sortable: true, filter: true, resizable: true },
        { headerName: "Total Employees", field: "empcount", sortable: true, filter: true, resizable: true },
        { headerName: "Total Amount", field: "payamounttotal", sortable: true, filter: true, resizable: true },
    ]

    const rowDataTable = rowData.map((item, index) => {
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
            <Headtitle title={"Break Up Details"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>{`Break Up Details:`}</Typography>


            {isUserRoleCompare?.includes("lbankrelease") && (
                <>
                    {/* <Box sx={userStyle.container}> */}
                    <Box >
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Link to={`/production/payroll/bankrelease`} ><Button variant="contained" size="small">Go back</Button></Link>
                        </Box>
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
                                        rowData={rowDataTable}
                                        getRowId={(params) => params.data.id}
                                        onGridReady={onGridReady}
                                        onFirstDataRendered={onFirstDataRendered}
                                        domLayout={"autoHeight"}
                                        getRowClass={getRowClass}
                                    />
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