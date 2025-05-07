import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Grid, MenuItem, Popover, Select, Typography, } from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import "react-notifications/lib/notifications.css";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext, } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import ManageColumnsContent from "../../../components/ManageColumn.js";

function PreviousLogList() {

    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [designationlogs, setDesignationlogs] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [items, setItems] = useState([]);

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");

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
    const handleClosePopup = () => { setOpenPopup(false); };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        company: true,
        filtertype: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        enable: true,
        shiftstartday: true,
        shiftdaytotal: true,
        calstartday: true,
        weekoffpresentday: true,
        createdby: true,
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

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Previous Log"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),
            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    const logid = useParams().id;
    const rowData = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${logid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const itemsWithSerialNumber = res?.data?.sweekoffpresent?.previousdata?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                index: index,
                id: item._id,
                shiftstartday: item.shiftstartday + "-" + item.shiftendday,
                calstartday: item.calstartday + "-" + item.calendday,
                enable: item.enable === true ? 'Yes' : 'No',
                employee: item.employee.length > 0 ? item.employee.join(",").toString() : 'ALL',
            }));
            setDesignationlogs(itemsWithSerialNumber);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        rowData();
    }, []);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(designationlogs);
    }, [designationlogs]);

    //Datatable 
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
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
    const firstVisiblePage = Math.max(1, page - 1); const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 120, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "filtertype", headerName: "Type", flex: 0, width: 120, hide: !columnVisibility.filtertype, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 150, hide: !columnVisibility.employee, headerClassName: "bold-header" },
        { field: "enable", headerName: "Include Weekoff Target", flex: 0, width: 100, hide: !columnVisibility.enable, headerClassName: "bold-header" },
        { field: "shiftstartday", headerName: "Shift Day", flex: 0, width: 135, hide: !columnVisibility.shiftstartday, headerClassName: "bold-header" },
        { field: "shiftdaytotal", headerName: "Shift Day Total", flex: 0, width: 135, hide: !columnVisibility.shiftdaytotal, headerClassName: "bold-header" },
        { field: "calstartday", headerName: "Calculation Day", flex: 0, width: 150, hide: !columnVisibility.calstartday, headerClassName: "bold-header" },
        { field: "weekoffpresentday", headerName: "Weekoff Present Day", flex: 0, width: 130, hide: !columnVisibility.weekoffpresentday, headerClassName: "bold-header" },
        { field: "createdby", headerName: "Created By", flex: 0, width: 150, hide: !columnVisibility.createdby, headerClassName: "bold-header", },
    ];

    const rowDataTable = filteredData.map((item) => {
        return {
            ...item,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
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

    // Excel
    const fileName = "Previous Log List";
    const [fileFormat, setFormat] = useState("");
    let exportColumnNames = ["Company", "Type", "Branch", "Unit", "Team", "Employee", "Include Weekoff Target", "Shift Day", "Shift Day Total", "Calculation Day", "Weekoff Present Day", "Created By"];
    let exportRowValues = ["company", "filtertype", "branch", "unit", "team", "employee", "enable", "shiftstartday", "shiftdaytotal", "calstartday", "weekoffpresentday", "createdby"];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Previous Log List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Previous Log List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Weekoff Controlpanel"} />
            <PageHeading
                title="Previous Log"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Setup"
                subsubpagename="Weekoff Controlpanel"
            /><br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lweekoffcontrolpanel") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container spacing={2}>
                            <Grid item md={8} xs={8}>
                                <Typography sx={userStyle.importheadtext}>Previous Log List</Typography>
                            </Grid>
                            <Grid item md={3} xs={3}></Grid>
                            <Grid item md={1} xs={1}>
                                <Link to={"/weekoffpresent"}>
                                    <Button variant="contained" sx={buttonStyles.btncancel}>Back</Button>
                                </Link>
                            </Grid>
                        </Grid><br />
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
                                        <MenuItem value={designationlogs?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelweekoffcontrolpanel") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvweekoffcontrolpanel") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printweekoffcontrolpanel") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfweekoffcontrolpanel") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageweekoffcontrolpanel") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={designationlogs}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={designationlogs}
                                />
                            </Grid>
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;<br /><br />
                        <>
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
                                // totalDatas={totalProjects}
                                searchQuery={searchQuery}
                                handleShowAllColumns={handleShowAllColumns}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                setFilteredChanges={setFilteredChanges}
                                filteredChanges={filteredChanges}
                                gridRefTableImg={gridRefTableImg}
                                itemsList={designationlogs}
                            />
                        </>
                    </Box>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumns}
                    searchQuery={searchQueryManage}
                    setSearchQuery={setSearchQueryManage}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibility}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    initialColumnVisibility={initialColumnVisibility}
                    columnDataTable={columnDataTable}
                />
            </Popover>

            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
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
                itemsTwo={designationlogs ?? []}
                filename={fileName}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default PreviousLogList;