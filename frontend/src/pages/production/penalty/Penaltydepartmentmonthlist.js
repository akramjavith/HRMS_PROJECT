import React, { useState, useEffect, useRef, useContext, } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, Select, MenuItem, FormControl, Grid, Button, List, Popover } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import domtoimage from 'dom-to-image';
import moment from "moment-timezone";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import AlertDialog from "../../../components/Alert";
import ManageColumnsContent from "../../../components/ManageColumn";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import ResizeObserver from 'resize-observer-polyfill';
import Selects from "react-select";
window.ResizeObserver = ResizeObserver;

function PenaltyDepartmentmonthlist({ setChange, change, setPenaltywaiver, penaltyWaiver }) {
    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const modes = [];
    for (let year = yyyy; year >= 1977; year--) {
        modes.push({ value: year, label: year.toString() });
    }

    let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const monthmode = [{ value: "January", label: "January" }, { value: "February", label: "February" },
    { value: "March", label: "March" }, { value: "April", label: "April" },
    { value: "May", label: "May" }, { value: "June", label: "June" },
    { value: "July", label: "July" }, { value: "August", label: "August" },
    { value: "September", label: "September" }, { value: "October", label: "October" },
    { value: "November", label: "November" }, { value: "December", label: "December" }];

    let currentMonth = monthsArr[mm - 1];
    const gridRefTableLeaveCrit = useRef(null);
    const gridRefImageLeaveCrit = useRef(null);

    const { isUserRoleCompare, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [isDptFilterOpen, setIsDptFilterOpen] = useState({ month: currentMonth, year: yyyy })

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    // get current year
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(10), (val, index) => currentYear + index);

    const [penaltyDepts, setPenaltydepts] = useState([]);

    // State to track advanced filter
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const [penaltyCheck, setPenaltycheck] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    //Datatable
    const [pageLeaveCrit, setPageLeaveCrit] = useState(1);
    const [pageSizeLeaveCrit, setPageSizeLeaveCrit] = useState(10);
    const [searchQueryLeaveCrit, setSearchQueryLeaveCrit] = useState("");
    const [totalPagesLeaveCrit, setTotalPagesLeaveCrit] = useState(1);

    // Manage Columns
    const [searchQueryManageLeaveCrit, setSearchQueryManageLeaveCrit] = useState("");
    const [isManageColumnsOpenLeaveCrit, setManageColumnsOpenLeaveCrit] = useState(false);
    const [anchorElLeaveCrit, setAnchorElLeaveCrit] = useState(null);

    const handleOpenManageColumnsLeaveCrit = (event) => {
        setAnchorElLeaveCrit(event.currentTarget);
        setManageColumnsOpenLeaveCrit(true);
    };
    const handleCloseManageColumnsLeaveCrit = () => {
        setManageColumnsOpenLeaveCrit(false);
        setSearchQueryManageLeaveCrit("");
    };

    const openLeaveCrit = Boolean(anchorElLeaveCrit);
    const idLeaveCrit = openLeaveCrit ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchLeaveCrit, setAnchorElSearchLeaveCrit] = React.useState(null);
    const handleClickSearchLeaveCrit = (event) => {
        setAnchorElSearchLeaveCrit(event.currentTarget);
    };
    const handleCloseSearchLeaveCrit = () => {
        setAnchorElSearchLeaveCrit(null);
        setSearchQueryLeaveCrit("");
    };

    const openSearchLeaveCrit = Boolean(anchorElSearchLeaveCrit);
    const idSearchLeaveCrit = openSearchLeaveCrit ? 'simple-popover' : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibilityLeaveCrit = {
        serialNumber: true,
        checkbox: true,
        department: true,
        year: true,
        monthname: true,
        fromdate: true,
        todate: true,
        salary: true,
        penalty: true,
        proftaxstop: true,
        esistop: true,
        pfstop: true,
        payrun: true,
        totaldays: true,
        actions: true,
    };

    const [columnVisibilityLeaveCrit, setColumnVisibilityLeaveCrit] = useState(initialColumnVisibilityLeaveCrit);

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

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

    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {
        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(penaltyDepts);
    }, [penaltyDepts]);

    // Split the search query into individual terms
    const searchTerms = searchQueryLeaveCrit.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    // Pagination for outer filter
    const filteredData = filteredDatas?.slice((pageLeaveCrit - 1) * pageSizeLeaveCrit, pageLeaveCrit * pageSizeLeaveCrit);
    const totalPagesLeaveCritOuter = Math.ceil(filteredDatas?.length / pageSizeLeaveCrit);
    const visiblePages = Math.min(totalPagesLeaveCritOuter, 3);
    const firstVisiblePage = Math.max(1, pageLeaveCrit - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesLeaveCritOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageLeaveCrit * pageSizeLeaveCrit;
    const indexOfFirstItem = indexOfLastItem - pageSizeLeaveCrit;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const columnDataTableLeaveCrit = [
        {
            field: "checkbox",
            headerName: "",
            headerStyle: { fontWeight: "bold", },
            sortable: false,
            width: 75,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibilityLeaveCrit.checkbox,
            pinned: "left",
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityLeaveCrit.serialNumber, },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.department, headerClassName: "bold-header" },
        { field: "year", headerName: "Year", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.year, headerClassName: "bold-header" },
        { field: "monthname", headerName: "Month", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.monthname, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.fromdate, headerClassName: "bold-header" },
        { field: "todate", headerName: "To Date", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.todate, headerClassName: "bold-header" },
        { field: "salary", headerName: "Salary", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.salary, headerClassName: "bold-header" },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.penalty, headerClassName: "bold-header" },
        { field: "proftaxstop", headerName: "Professional tax", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.proftaxstop, headerClassName: "bold-header" },
        { field: "esistop", headerName: "ESI", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.esistop, headerClassName: "bold-header" },
        { field: "pfstop", headerName: "PF", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.pfstop, headerClassName: "bold-header" },
        { field: "payrun", headerName: "Pay Run", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.payrun, headerClassName: "bold-header" },
        { field: "totaldays", headerName: "No Days", flex: 0, width: 130, hide: !columnVisibilityLeaveCrit.totaldays, headerClassName: "bold-header" },


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 280,
            minHeight: "40px !important",
            filter: false,
            sortable: false,
            hide: !columnVisibilityLeaveCrit.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* <div>{params.data }</div>  */}
                    <Button sx={{ ...buttonStyles.buttonsubmit, backgroundColor: params.data.iscolor ? "green" : "blue" }}
                        onClick={() => { setChange(params.data); handleFilter(params.data); }}>
                        {params?.data?.iscolor ? "Selected" : "Select"}
                    </Button>
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            department: item.department,
            year: item.year,
            monthname: item.monthname,
            fromdate: item.fromdate,
            todate: item.todate,
            salary: item.salary,
            penalty: item.penalty,
            proftaxstop: item.proftaxstop,
            esistop: item.esistop,
            pfstop: item.pfstop,
            payrun: item.payrun,
            totaldays: item.totaldays,
        };
    });

    // Datatable
    const handlePageSizeChange = (e) => {
        setPageSizeLeaveCrit(Number(e.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPageLeaveCrit(1);
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityLeaveCrit };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityLeaveCrit(updatedVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableLeaveCrit.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageLeaveCrit.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibilityLeaveCrit((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = [
        'Department', 'Year', 'Month', 'From Date', 'To Date', 'Salary',
        'Penalty', 'Professional tax', 'ESI', 'PF', 'Pay Run', 'No Days']
    let exportRowValuescrt = [
        'department', 'year', 'monthname', 'fromdate', 'todate', 'salary', 'penalty',
        'proftaxstop', 'esistop', 'pfstop', 'payrun', 'totaldays']

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Department Month List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageLeaveCrit.current) {
            domtoimage.toBlob(gridRefImageLeaveCrit.current)
                .then((blob) => {
                    saveAs(blob, "Department Month List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleFilter = async (row) => {
        setPageName(!pageName);
        setPenaltycheck(false);
        try {
            const [res, resrun] = await Promise.all([
                axios.post(SERVICE.DEPARTMENTMONTHSETYEARMONTH, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    year: isDptFilterOpen.year,
                    month: isDptFilterOpen.month
                }),
                axios.post(SERVICE.PAYRUNLISTYEARMONTH, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    year: isDptFilterOpen.year,
                    month: isDptFilterOpen.month
                })
            ]);
            const respayrundpt = resrun?.data?.payrunlists.map((data, index) => data.department)
            // Initialize resdata as an empty array
            const resdata = res?.data?.departmentdetails.map((data, index) => {
                if (respayrundpt?.includes(data.department)) {
                    return { ...data, payrun: "Complete" }
                } else {
                    return { ...data, payrun: "Pending" }
                }
            });
            setPenaltydepts(resdata.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
                todate: moment(item.todate).format("DD-MM-YYYY"),
                salary: item.salary ? "YES" : "NO",
                penalty: item.penalty ? "YES" : "NO",
                proftaxstop: item.proftaxstop ? "YES" : "NO",
                esistop: item.esistop ? "YES" : "NO",
                pfstop: item.pfstop ? "YES" : "NO",
                payrun: item.payrun,
                iscolor: row?.department === item.department ? true : false
            })));

            setPenaltycheck(true);
            setTotalPagesLeaveCrit(Math.ceil(res?.data?.departmentdetails?.length / pageSizeLeaveCrit));
            setPenaltywaiver({...penaltyWaiver,
                company: "Please Select Company", branch: "Please Select Branch", processcode: "Please Select Process Code", process: "Please Select Process", employee: "Please Select Employee",
                clienterrocountupto: "", clienterroramount: "", clienterrorpercentage: "", waiverallowupto: "", waiveramountupto: "", waiverpercentageupto: "", validitydays: "", 
            })
        } catch (err) {
            setPenaltycheck(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleClear = () => {
        setIsDptFilterOpen({ month: currentMonth, year: yyyy });
        setPenaltydepts([]);
        setChange({
            department: "", year: "",
            monthname: "", fromdate: "", todate: ""
        })
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    return (
        <Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpenaltywaivermaster") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Month <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={monthmode}
                                        value={{ label: isDptFilterOpen.month, value: isDptFilterOpen.month }}
                                        onChange={(e) => {
                                            setIsDptFilterOpen({ ...isDptFilterOpen, month: e.value })
                                        }}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Year <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={modes}
                                        value={{ label: isDptFilterOpen.year, value: isDptFilterOpen.year }}
                                        onChange={(e) => {
                                            setIsDptFilterOpen({ ...isDptFilterOpen, year: e.value })
                                        }}
                                    />

                                </FormControl>
                            </Grid>

                            <Grid item md={3} sm={6} xs={12} marginTop={3}>
                                <Grid
                                    sx={{
                                        display: "flex",
                                        justifyContent: { sm: "center", md: "left", xs: "center", lg: "left" },
                                        gap: "15px",
                                    }}
                                >
                                    <Button variant="contained" onClick={handleFilter}>
                                        Filter
                                    </Button>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Department Month List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeLeaveCrit}
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
                                        <MenuItem value={penaltyDepts?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelpenaltywaivermaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpenaltywaivermaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpenaltywaivermaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpenaltywaivermaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepenaltywaivermaster") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableLeaveCrit}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPageLeaveCrit}
                                    maindatas={penaltyDepts}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQueryLeaveCrit}
                                    setSearchQuery={setSearchQueryLeaveCrit}
                                    paginated={false}
                                    totalDatas={penaltyDepts}
                                />
                            </Grid>
                        </Grid>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsLeaveCrit}> Manage Columns  </Button>&ensp;
                        {!penaltyCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageLeaveCrit} >
                                    <AggridTable
                                        rowDataTable={rowDataTable}
                                        columnDataTable={columnDataTableLeaveCrit}
                                        columnVisibility={columnVisibilityLeaveCrit}
                                        page={pageLeaveCrit}
                                        setPage={setPageLeaveCrit}
                                        pageSize={pageSizeLeaveCrit}
                                        totalPages={totalPagesLeaveCrit}
                                        setColumnVisibility={setColumnVisibilityLeaveCrit}
                                        isHandleChange={isHandleChange}
                                        items={items}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRefTableLeaveCrit}
                                        gridRefTableImg={gridRefImageLeaveCrit}
                                        paginated={false}
                                        filteredDatas={filteredDatas}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        itemsList={penaltyDepts}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idLeaveCrit}
                open={isManageColumnsOpenLeaveCrit}
                anchorEl={anchorElLeaveCrit}
                onClose={handleCloseManageColumnsLeaveCrit}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsLeaveCrit}
                    searchQuery={searchQueryManageLeaveCrit}
                    setSearchQuery={setSearchQueryManageLeaveCrit}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityLeaveCrit}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityLeaveCrit}
                    initialColumnVisibility={initialColumnVisibilityLeaveCrit}
                    columnDataTable={columnDataTableLeaveCrit}
                />
            </Popover>

            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
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
                itemsTwo={penaltyDepts ?? []}
                filename={"Department Month List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default PenaltyDepartmentmonthlist;