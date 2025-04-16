import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaUndoAlt } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import AlertDialog from "../../../components/Alert";

function ShiftAdjustmentListTable({ allUsersAdjTable, adjApply, fetchUsers }) {

    const gridRefAdjTable = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [itemsSetTable, setItemsSetTable] = useState([])
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [shiftRoasterAdjStatusEdit, setShiftRoasterAdjStatusEdit] = useState({})

    // Datatable Set Table
    const [pageSetTable, setPageSetTable] = useState(1);
    const [pageSizeSetTable, setPageSizeSetTable] = useState(10);
    const [searchQuerySetTable, setSearchQuerySetTable] = useState("");

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => { setOpenEdit(false); setShiftRoasterAdjStatusEdit({ adjstatus: "" }) }

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpenAdjList, setIsFilterOpenAdjList] = useState(false);
    const [isPdfFilterOpenAdjList, setIsPdfFilterOpenAdjList] = useState(false);
    // page refersh reload
    const handleCloseFilterModAdjList = () => { setIsFilterOpenAdjList(false); };
    const handleClosePdfFilterModAdjList = () => { setIsPdfFilterOpenAdjList(false); };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); };

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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

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

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }

        return ""; // Return an empty string for other rows
    };

    const getRowHeight = (params) => {
        // If found, return the desired row height
        if (params.model.adjustmenttype === 'Shift Adjustment' || params.model.adjustmenttype === 'Shift Weekoff Swap' || params.model.adjustmenttype === 'WeekOff Adjustment') {
            return 80; // Adjust this value as needed
        }

        // Return null to use default row height for other rows
        return 40;
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        branch: true,
        unit: true,
        team: true,
        username: true,
        empcode: true,
        adjapplydate: true,
        adjustmenttype: true,
        request: true,
        reason: true,
        adjstatus: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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

    const adjtypeoptions = [
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ];
    //get single row to edit....
    const getCode = async (e, shifallotid) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            res?.data?.suser.shiftallot.filter((d) => {
                if (d._id == shifallotid) {
                    setShiftRoasterAdjStatusEdit({
                        ...d,
                        adjstatus: d.adjstatus == "Adjustment" ? "Not Approved" : ""
                    })
                }
            })

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [userOuterId, setUserOuterId] = useState("");
    const [userShiftInnerId, setUserShiftInnterId] = useState("");
    const getCodeForDelete = (e, shifallotid) => {
        setUserOuterId(e);
        setUserShiftInnterId(shifallotid);
        handleClickOpen();
    };

    const sendRequest = async () => {
        try {

            let res = await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftallotsarray: [
                    {
                        ...shiftRoasterAdjStatusEdit,
                        adjstatus: String(shiftRoasterAdjStatusEdit.adjstatus),
                    }
                ]
            })
            fetchUsers();
            handleCloseEdit();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const deleteShiftAllot = async () => {
        try {
            await axios.post(SERVICE.USER_SHIFTALLOT_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                outerId: userOuterId,
                innerId: userShiftInnerId
            });
            await fetchUsers();
            handleCloseMod();
            setPageSetTable(1);
            setPopupContent("Undone Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = allUsersAdjTable?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsSetTable(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberSetTable();
    }, [allUsersAdjTable]);

    // Datatable
    const handlePageChangeSetTable = (newPage) => {
        setPageSetTable(newPage);
    };

    const handlePageSizeChangeSetTable = (event) => {
        setPageSizeSetTable(Number(event.target.value));
        setPageSetTable(1);
    };

    // datatable....
    const handleSearchChangeSetTable = (event) => {
        setSearchQuerySetTable(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsSetTable = searchQuerySetTable.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasAdjApply = itemsSetTable?.filter((item) => {
        return searchTermsSetTable.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataAdjApply = filteredDatasAdjApply?.slice((pageSetTable - 1) * pageSizeSetTable, pageSetTable * pageSizeSetTable);

    const totalPagesSetTable = Math.ceil(filteredDatasAdjApply?.length / pageSizeSetTable);

    const visiblePagesSetTable = Math.min(totalPagesSetTable, 3);

    const firstVisiblePageSetTable = Math.max(1, pageSetTable - 1);
    const lastVisiblePageSetTable = Math.min(firstVisiblePageSetTable + visiblePagesSetTable - 1, totalPagesSetTable);

    const pageNumbersSetTable = [];

    const indexOfLastItemSetTable = pageSetTable * pageSizeSetTable;
    const indexOfFirstItemSetTable = indexOfLastItemSetTable - pageSizeSetTable;

    for (let i = firstVisiblePageSetTable; i <= lastVisiblePageSetTable; i++) {
        pageNumbersSetTable.push(i);
    }

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: { fontWeight: "bold", },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable?.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable?.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.row.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.row.id)) {
        //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.row.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(updatedSelectedRows?.length === filteredDatasAdjApply?.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 75,
        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "username", headerName: "Name", flex: 0, width: 100, hide: !columnVisibility.username, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "adjapplydate", headerName: "Apply Date", flex: 0, width: 160, hide: !columnVisibility.adjapplydate, headerClassName: "bold-header" },
        { field: "adjustmenttype", headerName: "Adjustment", flex: 0, width: 150, hide: !columnVisibility.adjustmenttype, headerClassName: "bold-header" },
        {
            field: "request", headerName: "Request", flex: 0, width: 250, hide: !columnVisibility.request, headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid >
                    {
                        params.row.adjustmenttype === "Shift Weekoff Swap" ?
                            (<Grid sx={{ display: 'block', fontSize: '12px', }}>
                                {`Allot Weekoff Date : ${params.row.adjdate}`} <br />
                                {`Swap To : ${params.row.todate} `} <br />
                                {`Shift : Weekoff Request Shift`} <br />
                                {`1st : ${params.row.adjchangeshiftime}`}
                            </Grid>)
                            :
                            params.row.adjustmenttype === "WeekOff Adjustment" ?
                                (<Grid sx={{ display: 'block', fontSize: '12px', }}>
                                    {`Week off Date : ${params.row.adjdate}`} <br />
                                    {`Adjustment For : ${params.row.todate} `} <br />
                                    {`Shift : ${params.row.selectedShifTime}`} <br />
                                    {`Request Shift 1st : ${params.row.adjchangeshiftime}`}
                                </Grid>)
                                :
                                params.row.adjustmenttype === "Shift Adjustment" ?
                                    (<Grid sx={{ display: 'block', fontSize: '12px', }}>
                                        {`Date : ${params.row.selectedDate}`} <br />
                                        {`Shift : ${params.row.selectedShifTime} `} <br />
                                        {`Adjustment to : ${params.row.adjdate}`} <br />
                                        {`2nd : ${params.row.pluseshift}`}
                                    </Grid>)
                                    : (`${params.row.adjustmenttype} : ${params.row.adjdate}`)
                    }

                </Grid>
            ),
        },
        { field: "reason", headerName: "Reason", flex: 0, width: 200, hide: !columnVisibility.reason, headerClassName: "bold-header" },
        {
            field: "adjstatus",
            headerName: "Status",
            flex: 0,
            width: 110,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.adjstatus,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid >
                        <Button variant="contained" sx={{ padding: '0px 5px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9', pointerEvents: "none" }} color={params.row.adjstatus === 'Not Approved' ? 'warning' : params.row.adjstatus === 'Approved' ? 'success' : 'error'}>
                            {params.row.adjstatus}
                        </Button>
                    </Grid>
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 95,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => {
                return params.row.adjstatus === "Not Approved" ? (
                    <Grid sx={{ display: "flex" }}>
                        {isUserRoleCompare?.includes("eshiftadjustment") && (
                            <StyledTableCell>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{ fontSize: '35px', height: '25px', minWidth: "15px", marginTop: '0px', marginRight: '5px' }}
                                    onClick={() => {
                                        handleClickOpenEdit();
                                        getCode(params.row.userid, params.row.id);
                                    }}
                                >
                                    <Typography sx={{ fontSize: '50px', marginTop: '-28px !important' }}>.</Typography>
                                </Button>
                            </StyledTableCell>
                        )}
                    </Grid>
                ) : (
                    <Grid sx={{ display: "flex" }}>
                        {isUserRoleCompare?.includes("dshiftadjustment") && (
                            <Button onClick={() => { getCodeForDelete(params.row.userid, params.row.id); }}>
                                <FaUndoAlt style={{ fontsize: "large", marginLeft: '-12px' }} />
                            </Button>
                        )}
                    </Grid >
                );
            },
        },
    ];

    const rowDataTable = filteredDataAdjApply?.map((item, index) => {

        // const [year, month, day] = item.adjrequestdate?.split('-')
        return {
            id: item._id,
            userid: item.userid,
            serialNumber: item.serialNumber,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            username: item.username,
            empcode: item.empcode,
            adjapplytime: item.adjapplytime,
            adjapplydate: moment(item.adjapplydate).format("DD-MM-YYYY") + " " + item.adjapplytime,
            adjustmenttype: item.adjustmenttype,
            // request: item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} \n Swap To : ${item.todate} \n Shift : Weekoff Request Shift \n 1st : ${item.adjchangeshiftime}`)
            //     : (`${item.adjustmenttype} : ${item.adjdate}`),
            adjdate: item.adjdate,
            todate: item.todate,
            todateshiftmode: item.todateshiftmode,
            adjchangeshift: item.adjchangeshift,
            adjchangeshiftime: item.adjchangeshiftime,
            selectedDate: item.selectedDate,
            selectedShifTime: item.selectedShifTime,
            secondmode: item.secondmode,
            pluseshift: item.pluseshift,
            // reason: item.adjustmenttype == "Add On Shift" ? item.adjtypereason : item.adjchangereason,
            reason: item.adjchangereason,
            adjstatus: item.adjstatus === "Approved" ? "Approved" : item.adjstatus === "Reject" ? "Reject" : "Not Approved",
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

    // Excel
    const fileNameAdjList = "Adjustment Apply List";
    const [fileFormatAdjList, setFormatAdjList] = useState('')
    const fileTypeAdjList = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionAdjList = fileFormatAdjList === "xl" ? '.xlsx' : '.csv';
    const exportToCSVAdjList = (csvData, fileNameAdjList) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeAdjList });
        FileSaver.saveAs(data, fileNameAdjList + fileExtensionAdjList);
    }

    const handleExportXLAdjList = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSVAdjList(
                rowDataTable?.map((item, index) => ({
                    "SNo": index + 1,
                    "Branch": item.branch,
                    "Unit": item.unit,
                    "Team": item.team,
                    "Name": item.username,
                    "Emp Code": item.empcode,
                    "Apply Date": item.adjapplydate,
                    "Adjustment": item.adjustmenttype,
                    'Request': item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                        item.adjustmenttype == "WeekOff Adjustment" ? (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                            item.adjustmenttype == "Shift Adjustment" ? (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                                : (`${item.adjustmenttype} : ${item.adjdate}`),
                    "Reason": item.adjchangereason,
                    "Status": item.adjstatus,
                })),
                fileNameAdjList,
            );
        } else if (isfilter === "overall") {
            exportToCSVAdjList(
                allUsersAdjTable.map((item, index) => ({
                    "SNo": index + 1,
                    "Branch": item.branch,
                    "Unit": item.unit,
                    "Team": item.team,
                    "Name": item.username,
                    "Emp Code": item.empcode,
                    "Apply Date": moment(item.adjapplydate).format("DD-MM-YYYY") + " " + item.adjapplytime,
                    "Adjustment": item.adjustmenttype,
                    'Request': item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                        item.adjustmenttype == "WeekOff Adjustment" ? (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                            item.adjustmenttype == "Shift Adjustment" ? (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                                : (`${item.adjustmenttype} : ${item.adjdate}`),
                    "Reason": item.adjchangereason,
                    "Status": item.adjstatus === "Approved" ? "Approved" : item.adjstatus === "Reject" ? "Reject" : "Not Approved",
                })),
                fileNameAdjList,
            );

        }

        setIsFilterOpenAdjList(false)
    };

    // print...
    const componentRefSetTable = useRef();
    const handleprintAdjList = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "Adjustment Apply List",
        pageStyle: "print",
    });

    // pdf
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Name", field: "username" },
        { title: "Emp Code", field: "empcode" },
        { title: "Apply Date", field: "adjapplydate" },
        { title: "Adjustment", field: "adjustmenttype" },
        { title: "Request", field: "adjustrequest" },
        { title: "Reason", field: "adjchangereason" },
        { title: "Status", field: "adjstatus" }
    ]

    const downloadPdfAdjList = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(item => ({
                ...item,
                serialNumber: serialNumberCounter++,
                adjustrequest: item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                    item.adjustmenttype == "WeekOff Adjustment" ? (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                        item.adjustmenttype == "Shift Adjustment" ? (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                            : (`${item.adjustmenttype} : ${item.adjdate}`),
            })) :
            allUsersAdjTable.map(item => {
                return {
                    ...item,
                    serialNumber: serialNumberCounter++,
                    adjustrequest: item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                        item.adjustmenttype == "WeekOff Adjustment" ? (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                            item.adjustmenttype == "Shift Adjustment" ? (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                                : (`${item.adjustmenttype} : ${item.adjdate}`),
                    adjstatus: item.adjstatus === "Approved" ? "Approved" : item.adjstatus === "Reject" ? "Reject" : "Not Approved",
                }
            });

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Adjustment Apply List.pdf");
    };

    // image
    const handleCaptureImageAdjList = () => {
        if (gridRefAdjTable.current) {
            html2canvas(gridRefAdjTable.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Adjustment Apply List.png");
                });
            });
        }
    };

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Adjustment Apply List and Status</Typography> <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftadjustment") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}

                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeSetTable}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeSetTable}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={allUsersAdjTable?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftadjustment") && (
                                        <>
                                            {/* <ExportXL csvData={filteredDataAdjApply?.map((item, i) => ({
                                                "S.No": item.serialNumber,
                                                "Branch": item.branch,
                                                "Unit": item.unit,
                                                "Team": item.team,
                                                "Name": item.username,
                                                "Emp Code": item.empcode,
                                                "Apply Date": moment(item.adjapplydate).format("DD-MM-YYYY") + " " + item.adjapplytime,
                                                "Adjustment": item.adjustmenttype,
                                                // "Request": item.adjustmenttype == "Add On Shift" ? (item.adjustmenttype + " : " + moment(item.adjdate).format("DD-MM-YYYY")) : (`${item.adjustmenttype} : ${item.adjdate}`),
                                                // "Reason": item.adjustmenttype == "Add On Shift" ? (item.adjtypereason) : (item.adjchangereason),
                                                'Request': item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                                                    item.adjustmenttype == "WeekOff Adjustment" ? (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                                                        item.adjustmenttype == "Shift Adjustment" ? (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                                                            : (`${item.adjustmenttype} : ${item.adjdate}`),
                                                "Reason": item.adjchangereason,
                                                "Status": item.adjstatus,
                                            }))} fileNameAdjList={"Adjustment Apply List"} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAdjList(true)
                                                setFormatAdjList("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftadjustment") && (
                                        <>
                                            {/* <ExportCSV csvData={filteredDataAdjApply?.map((item, i) => ({
                                                "S.No": item.serialNumber,
                                                "Branch": item.branch,
                                                "Unit": item.unit,
                                                "Team": item.team,
                                                "Name": item.username,
                                                "Emp Code": item.empcode,
                                                "Apply Date": moment(item.adjapplydate).format("DD-MM-YYYY") + " " + item.adjapplytime,
                                                "Adjustment": item.adjustmenttype,
                                                // "Request": item.adjustmenttype == "Add On Shift" ? (item.adjustmenttype + " : " + moment(item.adjdate).format("DD-MM-YYYY")) : (`${item.adjustmenttype} : ${item.adjdate}`),
                                                // "Reason": item.adjustmenttype == "Add On Shift" ? (item.adjtypereason) : (item.adjchangereason),
                                                'Request': item.adjustmenttype == "Shift Weekoff Swap" ? (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                                                    item.adjustmenttype == "WeekOff Adjustment" ? (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                                                        item.adjustmenttype == "Shift Adjustment" ? (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                                                            : (`${item.adjustmenttype} : ${item.adjdate}`),
                                                "Reason": item.adjchangereason,
                                                "Status": item.adjstatus,
                                            }))} fileNameAdjList={"Adjustment Apply List"} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAdjList(true)
                                                setFormatAdjList("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintAdjList}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftadjustment") && (
                                        <>
                                            {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSetTable()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button> */}
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenAdjList(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftadjustment") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAdjList}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuerySetTable} onChange={handleSearchChangeSetTable} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>  Manage Columns </Button> &ensp;
                        {/* <Button variant="contained" color="error" onClick={handleClickOpenalert}> Bulk Delete  </Button>  */}
                        <br /> <br />
                        {adjApply ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden", }}>
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} ref={gridRefAdjTable} id="settableexcel" hideFooter disableRowSelectionOnClick
                                        getRowClassName={getRowClassName}
                                        getRowHeight={getRowHeight}
                                        autoHeight={true}
                                    // density="comfortable"
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataAdjApply?.length > 0 ? (pageSetTable - 1) * pageSizeSetTable + 1 : 0} to {Math.min(pageSetTable * pageSizeSetTable, filteredDatasAdjApply?.length)} of {filteredDatasAdjApply?.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageSetTable(1)} disabled={pageSetTable === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeSetTable(pageSetTable - 1)} disabled={pageSetTable === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersSetTable?.map((pageNumberSetTable) => (
                                            <Button key={pageNumberSetTable} sx={userStyle.paginationbtn} onClick={() => handlePageChangeSetTable(pageNumberSetTable)} className={pageSetTable === pageNumberSetTable ? "active" : ""} disabled={pageSetTable === pageNumberSetTable}>
                                                {pageNumberSetTable}
                                            </Button>
                                        ))}
                                        {lastVisiblePageSetTable < totalPagesSetTable && <span>...</span>}
                                        <Button onClick={() => handlePageChangeSetTable(pageSetTable + 1)} disabled={pageSetTable === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageSetTable(totalPagesSetTable)} disabled={pageSetTable === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        }
                    </Box><br />

                </>
            )}
            <br />
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

            {/* Print layout for Set Table */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="adjapplypdf">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>SNo</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Team</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Name</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Emp Code</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Apply Date</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Adjustment</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Request</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Reason</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredDataAdjApply &&
                            filteredDataAdjApply.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontSize: '14px' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.branch}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.unit}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.team}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.username}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.empcode}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{moment(row.adjapplydate).format("DD-MM-YYYY") + " " + row.adjapplytime}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.adjustmenttype}</TableCell>
                                    {/* <TableCell sx={{ fontSize: '14px' }}>{row.adjustmenttype == "Add On Shift" ? (row.adjustmenttype + " : " + moment(row.adjdate).format("DD-MM-YYYY")) : (row.adjustmenttype + " : " + row.adjdate)}</TableCell> */}
                                    <TableCell>{row.adjustmenttype == "Shift Weekoff Swap" ? (
                                        <div>
                                            {`Allot Weekoff Date : ${row.adjdate}`} <br />
                                            {`Swap To : ${row.todate}`} <br />
                                            {`Shift : Weekoff Request Shift`} <br />
                                            {`1st : ${row.adjchangeshiftime}`}
                                        </div>) :
                                        row.adjustmenttype == "WeekOff Adjustment" ? (
                                            <div>
                                                {`Week off Date : ${row.adjdate}`} <br />
                                                {`Adjustment For : ${row.todate} `} <br />
                                                {`Shift : ${row.selectedShifTime}`} <br />
                                                {`Request Shift 1st : ${row.adjchangeshiftime}`}
                                            </div>) :
                                            row.adjustmenttype == "Shift Adjustment" ? (
                                                <div>
                                                    {`Date : ${row.selectedDate}`} <br />
                                                    {`Shift : ${row.selectedShifTime} `} <br />
                                                    {`Adjustment to : ${row.adjdate}`} <br />
                                                    {`2nd : ${row.pluseshift}`}
                                                </div>)
                                                : (`${row.adjustmenttype} : ${row.adjdate}`)}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.adjchangereason}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}><Button variant="contained" sx={{ padding: '0px 5px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }} color={row.adjstatus === 'Adjustment' ? 'warning' : row.adjstatus === 'Approved' ? 'success' : 'error'}>{row.adjstatus}</Button></TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFilterOpenAdjList} onClose={handleCloseFilterModAdjList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModAdjList}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormatAdjList === 'xl' ?
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
                            handleExportXLAdjList("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLAdjList("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenAdjList} onClose={handleClosePdfFilterModAdjList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModAdjList}
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
                            downloadPdfAdjList("filtered")
                            setIsPdfFilterOpenAdjList(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfAdjList("overall")
                            setIsPdfFilterOpenAdjList(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ALERT DIALOG */}
            < Box >
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
            </Box >

            {/* Edit Adjustment*/}
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Status Update</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={5} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', }}>Status</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects fullWidth
                                        size="small"
                                        options={adjtypeoptions}
                                        styles={colourStyles}
                                        value={{ label: shiftRoasterAdjStatusEdit.adjstatus, value: shiftRoasterAdjStatusEdit.adjstatus }}
                                        onChange={(e) => setShiftRoasterAdjStatusEdit({ ...shiftRoasterAdjStatusEdit, adjstatus: e.value })}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Button variant="contained" color="primary" onClick={sendRequest}> {" "} Ok{" "}  </Button>
                            </Grid>
                            {/* <Grid item md={1}>
                                <Button variant="contained" sx={userStyle.btncancel} onClick={handleClear}> {" "} Clear{" "} </Button>
                            </Grid> */}
                            <Grid item md={2}>
                                <Button variant="contained" sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >

            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteShiftAllot}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
        </Box >
    );
}

export default ShiftAdjustmentListTable;