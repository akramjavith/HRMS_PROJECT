import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Chip, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import StyledDataGrid from "../../../components/TableStyle";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';


function MyProductionIndividual() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRef = useRef(null);
    const [copiedData, setCopiedData] = useState("");

    let exportColumnNames = ['Vendor', 'From Date',
        'Date', 'Time',
        'Category', 'SubCategory',
        'Identifier', 'Login Id',
        'Section', 'Flag Count',
        'Doc Number', 'Doc Link',
        'Start Date Mode', 'Start Date',
        'Start Time', 'Status Mode',
        'Total Pages', 'Pending Pages',
        'Start Page', 'Remarks/Notes',
        'Approval Status', 'Late Entry Status'];


    let exportRowValues = ['vendor', 'datemode',
        'fromdate', 'time',
        'filename', 'category',
        'unitid', 'user',
        'section', 'flagcount',
        'docnumber', 'doclink',
        'startmode', 'startdate',
        'starttime', 'statusmode',
        'totalpages', 'pendingpages',
        'startpage', 'notes',
        'approvalstatus', 'lateentrystatus'];


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };




    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [projmaster, setProjmaster] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'My Production Manual Entry.png');
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

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
    const username = isUserRoleAccess.username;


    // Manage Columns
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



    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        checkbox: true,
        serialNumber: true,
        vendor: true,
        datemode: true,
        fromdate: true,
        time: true,
        filename: true,
        category: true,
        unitid: true,
        user: true,
        section: true,
        flagcount: true,
        alllogin: true,
        docnumber: true,
        doclink: true,
        approvalstatus: true,
        lateentrystatus: true,
        startmode: true,
        startdate: true,
        starttime: true,
        status: true,
        totalpages: true,
        flagcount: true,
        pendingpages: true,
        startpage: true,
        reason: true,
        statusmode: true,
        enddate: true,
        endtime: true,
        notes: true,
        actions: true,
        actionsstatus: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [loading, setLoading] = useState(false)


    const fetchEmployee = async () => {
        // setPageName(!pageName)
        setLoading(true)
        try {

            let res_employee = await axios.post(SERVICE.MY_PRODUCTION_INDIVIDUAL_FILTERED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: isUserRoleAccess.companyname,
                // userids: finalData

            });

            const ans = res_employee?.data?.productionupload?.length > 0 ? res_employee?.data?.productionupload : []

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {
                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1


                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });


            setProjmaster(itemsWithSerialNumber);

            setLoading(false)
        } catch (err) { setLoading(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Production_Individual",
        pageStyle: "print",
    });

    //serial no for listing items
    // const addSerialNumber = () => {
    //     const itemsWithSerialNumber = projmaster?.map((item, index) => {

    //         return {
    //             ...item,
    //             serialNumber: index + 1

    //         }
    //     })
    //     setItems(itemsWithSerialNumber);
    // };

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(projmaster);
    }, [projmaster]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        // setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        // setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

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
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }

        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.data.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.data.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 90,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 90,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "datemode", headerName: "Date Mode", flex: 0, width: 150, hide: !columnVisibility.datemode, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "time", headerName: "Time", flex: 0, width: 150, hide: !columnVisibility.time, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "SubCategory", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
        { field: "user", headerName: "Login Id", flex: 0, width: 150, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "section", headerName: "Section", flex: 0, width: 150, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "Flag Count", flex: 0, width: 150, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "alllogin", headerName: "All Login", flex: 0, width: 150, hide: !columnVisibility.alllogin, headerClassName: "bold-header" },
        { field: "docnumber", headerName: "Doc Number", flex: 0, width: 150, hide: !columnVisibility.docnumber, headerClassName: "bold-header" },
        { field: "doclink", headerName: "Doc Link", flex: 0, width: 150, hide: !columnVisibility.doclink, headerClassName: "bold-header" },
        { field: "startmode", headerName: "Start Mode", flex: 0, width: 150, hide: !columnVisibility.startmode, headerClassName: "bold-header" },
        { field: "startdate", headerName: "Start Date", flex: 0, width: 150, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
        { field: "starttime", headerName: "Start Time", flex: 0, width: 150, hide: !columnVisibility.starttime, headerClassName: "bold-header" },
        { field: "statusmode", headerName: "Status Mode", flex: 0, width: 150, hide: !columnVisibility.statusmode, headerClassName: "bold-header" },
        { field: "totalpages", headerName: "Total Pages", flex: 0, width: 150, hide: !columnVisibility.totalpages, headerClassName: "bold-header" },
        { field: "pendingpages", headerName: "Pending Pages", flex: 0, width: 150, hide: !columnVisibility.pendingpages, headerClassName: "bold-header" },
        { field: "startpage", headerName: "Start Page", flex: 0, width: 150, hide: !columnVisibility.startpage, headerClassName: "bold-header" },
        { field: "notes", headerName: "Remark/Notes", flex: 0, width: 150, hide: !columnVisibility.notes, headerClassName: "bold-header" },
        {
            field: "actionsstatus",
            headerName: "Status",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actionsstatus,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"warning"}
                        variant="outlined"
                        label={params.data.approvalstatus}
                    />
                    &ensp;
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"success"}
                        variant="outlined"
                        label={params.data.lateentrystatus}
                    />
                </Grid>
            ),
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            datemode: item.datemode,
            fromdate: item.fromdate,
            time: item.time,
            filename: item.filename,
            category: item.category,
            unitid: item.unitid,
            user: item.user,
            section: item.section,
            flagcount: item.flagcount,
            alllogin: item.alllogin,
            docnumber: item.docnumber,
            doclink: item.doclink,
            approvalstatus: item.approvalstatus,
            lateentrystatus: item.lateentrystatus,
            startmode: item.startmode,
            startdate: moment(item.startdate).format("DD/MM/YYYY"),
            starttime: item.starttime,
            statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
            totalpages: item.totalpages,
            flagcount: item.flagcount,
            startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
            pendingpages: item.pendingpages,
            reason: item.reason,
            enddate: item.enddate,
            endtime: item.endtime,
            notes: item.notes,
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
                    {filteredColumns.map((column) => (
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

    const [fileFormat, setFormat] = useState('')

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("My Production Manual Entry"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
    }, []);

    return (
        <Box>
            <Headtitle title={"My Production Manual Entry"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Production Manual Entry</Typography> */}
            <PageHeading
                title="My Production Manual Entry"
                modulename="Production"
                submodulename="Manual Entry"
                mainpagename="My Production Manual Entry"
                subpagename=""
                subsubpagename=""
            />


            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmyproductionmanualentry") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>My Production Manual Entry List</Typography>
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
                                        <MenuItem value={projmaster?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelmyproductionmanualentry") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyproductionmanualentry") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyproductionmanualentry") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyproductionmanualentry") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyproductionmanualentry") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    {/* <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl> */}
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={projmaster}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                    />
                                </Box>
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

                        {loading ? (
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
                                {/* <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
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
                                        {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                        {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                                        {filteredDatas.length} entries
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
                                </Box> */}
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
                                    // totalDatas={totalDatas}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                />

                            </>)}
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
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
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
                itemsTwo={projmaster ?? []}
                filename={"My Production Individual"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

        </Box>
    );
}

export default MyProductionIndividual;