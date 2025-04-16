import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";

// Cell Renderer Components

const ButtonCellRenderer = (props) => {
    const { data, node } = props;
    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();


    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [storedIds, setStoredIds] = useState([]);

    useEffect(() => {
        const storedIdsJSON = localStorage.getItem('userIds');
        if (storedIdsJSON) {
            setStoredIds(JSON.parse(storedIdsJSON));
        }
    }, []);

    const confirmSubmit = async (e) => {

        e.preventDefault();
        try {

            let resSave = await axios.post(`${SERVICE.CONFIRM_CONSOLIDATED_RELEASE_SAVE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: node.data.outerId,
                innerId: node.data.innerId,
                logid: node.data._id,

            });

            let res = await axios.post(`${SERVICE.CONSOLIDATED_SALARY_RELEASE_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: node.data.outerId,
                innerId: node.data.innerId,
                logid: node.data._id,
                status: "bankrelease",
                companyname: node.data.companyname,
                company: node.data.company,
                branch: node.data.branch,
                unit: node.data.unit,
                empcode: node.data.empcode,
                legalname: node.data.legalname,
                designation: node.data.designation,
                team: node.data.team,
                department: node.data.department,
                totalnumberofdays: node.data.totalnumberofdays,
                totalshift: node.data.totalshift,
                clsl: node.data.clsl,
                totalasbleave: node.data.totalasbleave,
                totalpaidDays: node.data.totalpaidDays,
                targetpoints: node.data.targetpoints,
                acheivedpoints: node.data.achievedpoints,

                acheivedpercent: node.data.achieved,
                penaltyamount: node.data.penaltyamount,
                accountholdername: node.data.accountholdername,
                bankname: node.data.bankname,
                accountnumber: node.data.accountno,
                ifsccode: node.data.ifsccode,
                releaseamount: node.data.releaseamount,
                otherdeductionamount: node.data.otherdeductionamount,
                totalexcess: node.data.totalexcess,
                totaladvance: node.data.totaladvance,

                approvedby: node.data.approvedby,
                description: node.data.description,

                paidstatus: node.data.paidstatus,
                paydate: node.data.paydate,
                holdpercent: node.data.holdpercent,
                payamount: (Number(node.data.payamount)).toFixed(2),

                payonsalarytype: node.data.payonsalarytype,
                paymonth: node.data.paymonth,
                payyear: node.data.payyear,

                finalusersalary: node.data.finalusersalary

            });

            if (res.statusText === "OK") {

                const updatedIds = [...storedIds, node.data._id];
                localStorage.setItem('userIds', JSON.stringify(updatedIds));
                setStoredIds(updatedIds);
            }


        } catch (err) {
            const messages = err?.response?.data?.message;
            console.error(messages);
        }
    };
    let finalstatus = node.data.updatedpaidstatus != "" ? node.data.updatedpaidstatus : node.data.paidstatus

    return (
        <>

            {node.data.bankclose == "closed" ?

                <Typography>Closed</Typography>
                :
                finalstatus?.split("_")[1] === "REJECT" ?
                    ""
                    :
                    <Button variant="contained" sx={{ textTransform: "capitalize", border: storedIds?.includes(data._id) ? "1px solid green" : "inherit" }} size="small" color="success" disabled={storedIds?.includes(data._id)} onClick={confirmSubmit}>
                        {storedIds?.includes(data._id) ? "Updated" : "Save"}
                    </Button>
            }

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )
};

const ButtonCellRejectRenderer = (props) => {
    const { data, node } = props;
    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();



    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [storedIds, setStoredIds] = useState([]);

    useEffect(() => {
        const storedIdsJSON = localStorage.getItem('userIds');
        if (storedIdsJSON) {
            setStoredIds(JSON.parse(storedIdsJSON));
        }
    }, []);

    const confirmSubmit = async (e) => {
        // let oldholdpercentvalue = node.data.holdpercent
        e.preventDefault();
        try {


        } catch (err) {
            const messages = err?.response?.data?.message;
            console.error(messages);
        }
    };

    return (
        <>
            <Box>
                {node.data.bankclose == "closed" ?
                    <Typography></Typography>
                    :
                    <>
                        <input style={{ display: "block", height: "26px" }} value={node.data.recheckreason} placeholder="Recheck Reason"></input>
                        <Button variant="contained" sx={{ textTransform: "capitalize" }} size="small" color="error" disabled={storedIds?.includes(data._id)} onClick={confirmSubmit}>
                            {storedIds?.includes(data._id) ? "Rejected" : "Recheck"}
                        </Button>
                    </>
                }
            </Box>


            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )
};

const generateNewPayData = (id, data, plusminVal, excellVal, advanceVal, pay) => {

    return {

        ...data,
        id: id,
        plusminusamount: plusminVal,
        minusexcess: excellVal,
        advance: advanceVal,
        payamount: Number(pay) + Number(plusminVal) + Number(excellVal) + Number(advanceVal),
    };
};



const TextBoxPlusMinusCellRenderer = (props) => {
    const { data, node } = props;
    const { auth } = useContext(AuthContext);

    const { gridRefnew } = props.context;

    const updateDataOnFord = useCallback((e) => {

        const rowNode = gridRefnew.current.api.getRowNode(node.data._id);
        const newData = generateNewPayData(node.data._id, node.data, e.target.value, node.data.minusexcess, node.data.advance, props.data.payamount);
        rowNode.updateData(newData);
    }, []);
    let finalstatus = node.data.updatedpaidstatus != "" ? node.data.updatedpaidstatus : node.data.paidstatus

    return (
        <>
            {finalstatus?.split("_")[1] === "REJECT" ?
                null
                :
                < Box sx={{ display: "flex", justifyContent: "center" }}>
                    <input value={node.data.plusminusamount} style={{ height: "30px" }} onChange={updateDataOnFord} placeholder="Other Deduction"></input>
                </Box >

            }
        </>
    )
};
const TextBoxExcessCellRenderer = (props) => {
    const { data, node } = props;
    const { auth } = useContext(AuthContext);
    const { gridRefnew } = props.context;

    const updateDataOnFord = useCallback((e) => {
        const rowNode = gridRefnew.current.api.getRowNode(node.data._id);
        const newData = generateNewPayData(node.data._id, props.data, node.data.plusminusamount, e.target.value, node.data.advance, props.data.payamount);
        rowNode.updateData(newData);
    }, []);

    let finalstatus = node.data.updatedpaidstatus != "" ? node.data.updatedpaidstatus : node.data.paidstatus


    return (
        <>
            {finalstatus?.split("_")[1] === "REJECT" ?
                null
                :
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <input value={node.data.minusexcess} style={{ height: "30px" }} onChange={updateDataOnFord} placeholder="Excess Amount"></input>
                </Box>
            }
        </>
    )
};
const TextBoxAdvanceCellRenderer = (props) => {
    const { data, node } = props;
    const { auth } = useContext(AuthContext);
    const { gridRefnew } = props.context;
    const updateDataOnFord = useCallback((e) => {

        const rowNode = gridRefnew.current.api.getRowNode(node.data._id);

        const newData = generateNewPayData(node.data._id, props.data, node.data.plusminusamount, node.data.minusexcess, e.target.value, props.data.payamount);
        rowNode.updateData(newData);
    }, []);

    let finalstatus = node.data.updatedpaidstatus != "" ? node.data.updatedpaidstatus : node.data.paidstatus


    return (
        <>
            {finalstatus?.split("_")[1] === "REJECT" ?
                null
                :
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <input value={node.data.advance} style={{ height: "30px" }} onChange={updateDataOnFord} placeholder="Advance Amount"></input>
                </Box>
            }
        </>
    )
};

function ConsolidatedRelease() {
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const years = [];
    for (let year = yyyy; year >= 1977; year--) {
        years.push({ value: year, label: year.toString() });
    }
    const gridRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    const [itemsTwo, setItemsTwo] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

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
    const holdPercentOpt = [
        { label: 0, value: 0 },
        { label: 25, value: 25 },
        { label: 50, value: 50 },
        { label: 75, value: 75 },
        { label: 100, value: 100 },
    ];
    const [modeselection, setModeSelection] = useState({ label: "My Hierarchy List", value: "myhierarchy" });
    const [sectorSelection, setSectorSelection] = useState({ label: "Primary", value: "Primary" });

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");


    const [selectAllCheckedTwo, setSelectAllCheckedTwo] = useState(false);

    const [pageTwo, setPageTwo] = useState(1);
    const [pageSizeTwo, setPageSizeTwo] = useState(10);

    const [selectedRowsTwo, setSelectedRowsTwo] = useState([]);
    const [searchQueryTwo, setSearchQueryTwo] = useState("");
    const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");

    const [copiedData, setCopiedData] = useState("");

    const handleYearChange = (event) => {
        setSelectedYear(event.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.value);
        setSelectMonthName(event.label);
        setSelectedMonthNum(event.numval);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let currentMonth = monthNames[mm - 1];

    const [selectedYear, setSelectedYear] = useState(yyyy);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectmonthname, setSelectMonthName] = useState(currentMonth);
    const [selectedMonthNum, setSelectedMonthNum] = useState(mm);

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

    const handleCaptureImageNew = () => {
        if (gridRefContainer.current) {
            domtoimage.toBlob(gridRefContainer.current)
                .then((blob) => {
                    saveAs(blob, "Pay-Details.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

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

    // Manage TWO Columns
    const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
    const [anchorElTwo, setAnchorElTwo] = useState(null);

    const handleOpenManageTwoColumns = (event) => {
        setAnchorElTwo(event.currentTarget);
        setManageColumnsOpenTwo(true);
    };
    const handleCloseManageTwoColumns = () => {
        setManageColumnsOpenTwo(false);
        setSearchQueryManageTwo("");
    };

    const openTwo = Boolean(anchorElTwo);
    const idTwo = openTwo ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
        },

        "& .MuiDataGrid-columnHeaderTitle": {
            // fontSize: "11px",
            fontWeight: "bold !important",
            lineHeight: "17px",
            whiteSpace: "normal", // Wrap text within the available space
            overflow: "visible", // Allow overflowed text to be visible
            minWidth: "20px",
        },
        "& .MuiDataGrid-columnHeaders": {
            minHeight: "50px !important",
            // background: "#b7b3b347",
            padding: 0,
            maxHeight: "51px",
        },
        "& .MuiDataGrid-row": {
            fontSize: "13px", // Change the font size for row data
            minWidth: "20px",
            color: "black",
            // Add any other styles you want to apply to the row data
        },

        "& .MuiDataGrid-cell[data-field='prodlossdeduction']": {
            backgroundColor: "#2f87187a !important",
        },

        "& .MuiDataGrid-row.Mui-selected": {
            "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
                backgroundColor: "unset !important", // Clear the background color for selected rows
            },
        },
    }));
    const initialColumnVisibilityTwo = {
        serialNumber: true,
        checkbox: true,
        department: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        designation: true,
        employeename: true,
        aadharname: true,

        finalusersalary: true,
        balanceamount: true,
        payamount: true,
        payyear: true,
        paymonth: true,

        bankname: true,
        accountnumber: true,
        accountno: true,
        ifsccode: true,

        updatechangedate: true,
        updatedpaidstatus: true,
        actions: true,
        updatedholdpercent: 1,
        updatedreason: 1,
    };

    const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const handleClear = (e) => {
        e.preventDefault();
        setPage(1);
        setPageSize(10);
        setSelectedYear(yyyy);
        setSelectedMonth(currentMonth);
        setSelectMonthName(currentMonth);
        setSelectedMonthNum(mm);
        setFilteredData([]);
        setItemsTwo([]);
    };

    const columns = [
        // Serial number column
        { title: "SNo", dataKey: "serialNumber" },
        { title: "Company", dataKey: "company" },
        { title: "Branch", dataKey: "branch" },
        { title: "Unit", dataKey: "unit" },
        { title: "Empcode", dataKey: "empcode" },

        { title: "Aadhar Name", dataKey: "legalname" },
        { title: "Employee Name", dataKey: "employeename" },
        { title: "Designation", dataKey: "designation" },

        { title: "Team", dataKey: "team" },

        { title: "Bank Name", dataKey: "bankname" },
        { title: "Account No", dataKey: "accountno" },
        { title: "IFSC Code", dataKey: "ifsccode" },

        { title: "Salary Amount", dataKey: "finalusersalary" },
        { title: "+/- Amount", dataKey: "" },
        { title: "Pay Amount", dataKey: "payamount" },


        { title: "Paid Status", dataKey: "paidstatus" },
        { title: "Pay Date", dataKey: "paydate" },

        { title: "Pay Year", dataKey: "payyear" },
        { title: "Pay Month", dataKey: "paymonth" },


    ];

    const downloadPdf = () => {
        const doc = new jsPDF({
            orientation: "landscape",
        });

        const maxColumnsPerPage = 15; // Maximum number of columns per page
        const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

            const currentPageColumns = columns.slice(startIdx, endIdx);

            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 5,
                },
                columns: currentPageColumns,
                body: rowDataTable,
            });

            if (currentPage < totalPages) {
                doc.addPage(); // Add a new page if there are more columns to display
            }
        }

        doc.save("Pay-Details.pdf");
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Pay-Details",
        pageStyle: "print",
    });



    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);


    const [rowData, setRowData] = useState([]);

    const handleSubmit = async (e) => {
        setIsActive(true);
        try {

            let Res_Data = await axios.post(SERVICE.FETCH_PAYRUNLIST_MONTHWISE, {
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
            let addserialnumberfilteredTabletwo = mergedDatafinal.filter(d => d.fixsalarydateconfirm === "Yes" || d.fixholdsalarydateconfirm === "Yes").reduce((acc, item) => {
                return acc.concat(item.logdata);
            }, []);

            let finalitemsTabletwo = addserialnumberfilteredTabletwo.filter(d => d.status === "bankrelease").map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setRowData(finalitemsTabletwo);
            setFilteredData(finalitemsTabletwo);
            setIsActive(false);


            setIsActive(false);
            setUndoIds([]);
            localStorage.removeItem("userIds");
        } catch (err) {

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

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
        // fontSize: "12px"
    }
    let cellStylesname = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        lineHeight: 'normal',
        // fontSize: "12px"
    }


    const gridRefnew = useRef();

    const columnApi = useRef(null);

    const context = {
        gridRefnew: gridRefnew
    }

    const columnDataTable = [
        { headerName: "Sno", field: "serialNumber", sortable: true, width: 80, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true, pinned: "left" },
        { headerName: "Company", field: "company", sortable: true, width: 110, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Branch", field: "branch", sortable: true, width: 110, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Unit", field: "unit", sortable: true, width: 100, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Emp Code", field: "empcode", sortable: true, width: 120, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },

        { headerName: "Aadhar Name", field: "legalname", sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', width: 140, resizable: true },
        { headerName: "TTS Name", field: "employeename", sortable: true, filter: true, cellStyle: cellStylesname, width: 140, resizable: true, pinned: "left" },

        { headerName: "Designation", field: "designation", sortable: true, width: 127, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },

        { headerName: "Team", field: "team", sortable: true, filter: true, width: 100, cellStyle: cellStyles, headerClass: 'header-wrap', width: 100, resizable: true },

        { headerName: "Bank Name", field: "bankname", sortable: true, filter: true, width: 100, cellStyle: cellStyles, headerClass: 'header-wrap', width: 100, resizable: true },
        { headerName: "Bank Account No", field: "bankaccountno", sortable: true, filter: true, width: 130, cellStyle: cellStyles, headerClass: 'header-wrap', width: 100, resizable: true },
        { headerName: "IFSC", field: "ifsccode", sortable: true, filter: true, width: 100, cellStyle: cellStyles, headerClass: 'header-wrap', width: 100, resizable: true },

        { headerName: "Salary Amount", field: "finalusersalary", width: 100, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Release Amount", field: "releaseamount", width: 100, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "+/- Amount", field: "plusminusamount", width: 180, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true, cellRenderer: TextBoxPlusMinusCellRenderer, },
        { headerName: "Total Excess", field: "totalexcess", width: 110, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "-Excess", field: "minusexcess", width: 180, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true, cellRenderer: TextBoxExcessCellRenderer, },
        { headerName: "Total Advance", field: "totaladvance", width: 110, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Advance", field: "advance", width: 180, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true, cellRenderer: TextBoxAdvanceCellRenderer, },
        { headerName: "Pay Amount", field: "payamount", width: 100, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },

        // { headerName: "Balance Amount", field: "balanceamount", sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },

        { headerName: "Pay Date", field: "paydate", width: 100, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Pay Status", field: "paidstatus", width: 130, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },


        { headerName: "Pay Year", field: "payyear", width: 90, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },
        { headerName: "Pay Month", field: "paymonth", width: 100, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true },


        {
            headerName: "Hold %", field: "holdpercent", width: 80, suppressClickEdit: true, sortable: true, filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true,

        },

        {
            headerName: "Reason", field: "reason", sortable: true,
            filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true,

        },
        {
            headerName: "Approved by", field: "approvedby", sortable: true,
            filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true,

        },
        {
            headerName: "Description", field: "description", sortable: true,
            filter: true, cellStyle: cellStyles, headerClass: 'header-wrap', resizable: true,

        },

        {
            headerName: 'Confirmation',
            field: 'confirmation',
            cellRenderer: ButtonCellRenderer,
            editable: false,

        },
        {
            headerName: 'Reject',
            field: 'reject',
            cellRenderer: ButtonCellRejectRenderer,
            editable: false,

        },
    ]

    const rowDataTable = currentData.map((item, index) => {

        return {
            ...item,
            id: item._id,
            employeename: item.companyname,
            aadharname: item.legalname,
            paydate: item.updatechangedate ? item.updatechangedate : item.paydate,
            paidstatus: item.updatedpaidstatus ? item.updatedpaidstatus : item.paidstatus,
            holdpercent: item.updatedholdpercent ? item.updatedholdpercent : item.holdpercent,
            reason: item.updatedholdreason ? item.updatedholdreason : item.updatedreason,
            releaseamount: item.payamount,
            minusexcess: 0,
            advance: 0,
            plusminusamount: 0
        };
    })





    const [anchorEl, setAnchorEl] = useState(null);
    const isPopoverOpen = Boolean(anchorEl);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseManageColumns = () => {
        setAnchorEl(null);
    };

    const [columnVisibility, setColumnVisibility] = useState(
        columnDataTable.reduce((acc, col) => {
            acc[col.field] = !col.hide;
            return acc;
        }, {})
    );

    const toggleColumnVisibility = (field) => {
        const newVisibility = !columnVisibility[field];
        setColumnVisibility({
            ...columnVisibility,
            [field]: newVisibility
        });
        gridRefnew.current.columnApi.setColumnVisible(field, newVisibility);
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    const filteredColumns = columnDataTable.filter(col =>
        col.headerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const initialColumnVisibility = columnDataTable.reduce((acc, col) => {
        acc[col.field] = true;
        return acc;
    }, {});

    const manageColumnsContent = (
        <Box style={{ padding: '10px', minWidth: '325px' }}>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute' }}
                />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%' }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: 'flex' }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: '-5px' }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={column.headerName}
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
                            sx={{ textTransform: 'none' }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = true;
                                });
                                setColumnVisibility(newColumnVisibility);
                                columnDataTable.forEach((column) => {
                                    gridRefnew.current.columnApi.setColumnVisible(column.field, true);
                                });
                            }}
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
                                    newColumnVisibility[column.field] = false;
                                });
                                setColumnVisibility(newColumnVisibility);
                                columnDataTable.forEach((column) => {
                                    gridRefnew.current.columnApi.setColumnVisible(column.field, false);
                                });
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );



    const [undoIds, setUndoIds] = useState([]);

    const undoSubmit = async (id, outerId) => {
        try {
            let res = await axios.post(`${SERVICE.UPDATE_UNDO_FIELDNAME_CONFIRMLIST}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                innerId: id,
                outerId: outerId
            });
            setUndoIds(prev => [...prev, id])
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
    };


    return (
        <Box>


            <Headtitle title={"Pay-Details"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}> Pay-Details</Typography>
            {isUserRoleCompare?.includes("aconsolidatedsalary") && (
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
                            </Grid>
                            <br /> <br />
                            <Grid item md={12} sm={12} xs={12}>
                                <Grid
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "15px",
                                    }}
                                >
                                    <Button variant="contained" disabled={isActive === true} onClick={(e) => handleSubmit(e)}>
                                        Filter
                                    </Button>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lconsolidatedsalary") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Pay Run-Details:</Typography>
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
                                <Box>
                                    {isUserRoleCompare?.includes("excelconsolidatedsalary") && (
                                        <>
                                            <ExportXL
                                                csvData={rowDataTable.map((t, index) => ({
                                                    Sno: index + 1,
                                                    Company: t.company,
                                                    Branch: t.branch,
                                                    Unit: t.unit,
                                                    Empcode: t.empcode,

                                                    "Aadhar Name": t.legalname,
                                                    "Employee Name": t.employeename,
                                                    Designation: t.designation,

                                                    Team: t.team,

                                                    "Bank Name": (t.bankname),
                                                    "Account No": (t.accountno),
                                                    "IFSC Code": (t.ifsccode),

                                                    "Salary Amount": (t.finalusersalary),
                                                    "+/- Amount": (""),
                                                    "Pay Amount": (t.payamount),


                                                    "Paid Status": t.paidstatus,
                                                    "Pay Date": t.paydate,
                                                    "Pay Year": t.payyear,
                                                    "Pay Month": t.paymonth,
                                                    "Hold %": t.holdpercent,
                                                    "Reason": t.updatedreason,


                                                }))}
                                                fileName={"Pay-Details"}
                                            />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvconsolidatedsalary") && (
                                        <>
                                            <ExportCSV
                                                csvData={rowDataTable.map((t, index) => ({
                                                    Sno: index + 1,
                                                    Company: t.company,
                                                    Branch: t.branch,
                                                    Unit: t.unit,
                                                    Empcode: t.empcode,

                                                    "Aadhar Name": t.legalname,
                                                    "Employee Name": t.employeename,
                                                    Designation: t.designation,

                                                    Team: t.team,

                                                    "Bank Name": (t.bankname),
                                                    "Account No": (t.accountno),
                                                    "IFSC Code": (t.ifsccode),

                                                    "Salary Amount": (t.finalusersalary),
                                                    "+/- Amount": (""),
                                                    "Pay Amount": (t.payamount),


                                                    "Paid Status": t.paidstatus,
                                                    "Pay Date": t.paydate,
                                                    "Pay Year": t.payyear,
                                                    "Pay Month": t.paymonth,
                                                    "Hold %": t.holdpercent,
                                                    "Reason": t.updatedreason,


                                                }))}
                                                fileName={"Pay-Details"}
                                            />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printconsolidatedsalary") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfconsolidatedsalary") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageconsolidatedsalary") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageNew}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        <Popover
                            open={isPopoverOpen}
                            anchorEl={anchorEl}
                            onClose={handleCloseManageColumns}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            {manageColumnsContent}
                        </Popover>

                        <br />
                        {isActive ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        // height: 500,
                                        width: "100%",
                                    }}
                                    className="ag-theme-quartz"
                                    ref={gridRefContainer}
                                >

                                    <AgGridReact
                                        columnDefs={columnDataTable}
                                        ref={gridRefnew}
                                        rowData={rowDataTable}
                                        context={context}
                                        getRowId={(params) => params.data.id}
                                        onGridReady={onGridReady}
                                        headerHeight={60}
                                        rowHeight={72}
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

            <Box>
                {/* print layout */}
                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Empcode</TableCell>
                                <TableCell>Aadhar Name</TableCell>
                                <TableCell>TTS Name</TableCell>
                                <TableCell>Designation</TableCell>

                                <TableCell>Team</TableCell>

                                <TableCell>Bank Name</TableCell>
                                <TableCell>Account NO</TableCell>
                                <TableCell>IFSC Code</TableCell>

                                <TableCell>Salary Amount</TableCell>
                                <TableCell>+/- Amount</TableCell>
                                <TableCell>Pay Amount</TableCell>

                                <TableCell>Paid Status</TableCell>
                                <TableCell>Pay Date</TableCell>
                                <TableCell>Pay Year</TableCell>
                                <TableCell>Pay Month</TableCell>
                                <TableCell>Hold %</TableCell>
                                <TableCell>Reason</TableCell>


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
                                        <TableCell>{row.empcode}</TableCell>
                                        <TableCell>{row.legalname}</TableCell>
                                        <TableCell>{row.employeename}</TableCell>
                                        <TableCell>{row.designation}</TableCell>

                                        <TableCell>{row.team}</TableCell>

                                        <TableCell>{row.bankname}</TableCell>
                                        <TableCell>{row.accountno}</TableCell>
                                        <TableCell>{row.ifsccode}</TableCell>

                                        <TableCell>{row.finalusersalary}</TableCell>
                                        <TableCell>{""}</TableCell>
                                        <TableCell>{row.payamount}</TableCell>

                                        <TableCell>{row.updatedpaidstatus}</TableCell>
                                        <TableCell>{row.updatedpaydate}</TableCell>

                                        <TableCell>{row.payyear}</TableCell>
                                        <TableCell>{row.paymonth}</TableCell>

                                        <TableCell>{row.holdpercent}</TableCell>
                                        <TableCell>{row.reason}</TableCell>




                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </Box>
            {/* ALERT DIALOG */}
            <Box>
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
        </Box>
    );
}
export default ConsolidatedRelease;