import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice';
import MessageAlert from "../../components/MessageAlert";
import domtoimage from 'dom-to-image';

function Datainformation(stockmaterialedit) {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    //SELECT DROPDOWN STYLES
    const colourStyles = {
        menuList: styles => ({
            ...styles,
            background: 'white'
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            // color:'black',
            color: isFocused
                ? 'rgb(255 255 255, 0.5)'
                : isSelected
                    ? 'white'
                    : 'black',
            background: isFocused
                ? 'rgb(25 118 210, 0.7)'
                : isSelected
                    ? 'rgb(25 118 210, 0.5)'
                    : null,
            zIndex: 1
        }),
        menu: base => ({
            ...base,
            zIndex: 100
        })
    }
    const [empaddform, setEmpaddform] = useState({
        Page: "", Date: ""
    });
    // Country city state datas
    const [getrowid, setRowGetid] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
    // const [username, setUsername] = useState("");
    const { auth, setAuth } = useContext(AuthContext);
    const username = isUserRoleAccess.username;
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("")

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };

    const [personalcheck, setpersonalcheck] = useState(false);

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Individual_Maintanence_Log.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        companyname: true,
        pagename: true,
        date: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // const getCode = async (e) => {
    //     setPageName(!pageName)
    //     try {
    //         let response = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${auth.APIToken}`
    //             },
    //         })
    //         const savedEmployee = response?.data?.suser;
    //         setEmpaddform(response?.data?.suser);
    //         setRowGetid(response?.data?.suser);
    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // }
    // info model
    // const [openInfo, setOpeninfo] = useState(false);
    // const handleClickOpeninfo = () => {
    //     setOpeninfo(true);
    // };
    // const handleCloseinfo = () => {
    //     setOpeninfo(false);
    // };
    // get single row to view....
    // const getinfoCode = async (e) => {
    //     setPageName(!pageName)
    //     try {
    //         let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${auth.APIToken}`
    //             }
    //         });
    //         setEmpaddform(res?.data?.suser);
    //         setRowGetid(res?.data?.suser);
    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // }


    //personalupadate updateby edit page...
    let updateby = empaddform.updatedby;
    let addedby = empaddform.addedby;
    //EDIT POST CALL
    let logedit = getrowid._id;
    const editSubmit = (e) => {
        e.preventDefault();
    }
    useEffect(() => {
        if (stockmaterialedit.stockmaterialedit) {
            fetchHandler(stockmaterialedit.stockmaterialedit);
            fetchVendor(stockmaterialedit.stockmaterialedit);
        } else {
            // Handle case where newid is not available
        }
    }, [stockmaterialedit.stockmaterialedit]);
    const [vendormaster, setVendormaster] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        fetchVendor(stockmaterialedit.stockmaterialedit);
    }, [page, pageSize]);

    const [overallMaintanencelogData, setOverallMaintanencelogData] = useState([])
    console.log(overallMaintanencelogData)
    //get all  vendordetails.
    const fetchVendor = async (id) => {
        setPageName(!pageName)

        try {
            let res = await axios.post(SERVICE.SKIPPED_EMPLOYEE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                commonid: id,
                page: Number(page),
                pageSize: Number(pageSize),
            });

            console.log(res?.data)
            const ansOverall = res?.data?.totalProjectsOverall?.length > 0 ? res?.data?.totalProjectsOverall : [];
            const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            const itemsWithSerialNumberOverall = ansOverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));
            setVendormaster(itemsWithSerialNumber.map((item, index) => {
                return {
                    ...item,
                    companyname: item.companyname,
                    pagename: item.pagename,
                    Dateone: moment(item.date).format("DD-MM-YYYY hh:mm A") || '',
                    date: moment(item.date).isValid() ? moment(item.date).format("DD-MM-YYYY hh:mm A") : "Invalid Date"
                }
            }));

            setOverallMaintanencelogData(itemsWithSerialNumberOverall.map((item, index) => {
                return {
                    ...item,
                    companyname: item.companyname,
                    pagename: item.pagename,
                    Dateone: moment(item.date).format("DD-MM-YYYY hh:mm A") || '',
                    date: moment(item.date).isValid() ? moment(item.date).format("DD-MM-YYYY hh:mm A") : "Invalid Date"
                }
            }))

            // setItems(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //get all employees list details
    const fetchHandler = async (id) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.USERCHECKS_SINGLE}/${id}`);
            setEmployees(res?.data?.suser.map((item, index) => {
                return {
                    ...item,
                    companyname: item.companyname,
                    pagename: item.pagename,
                    Dateone: moment(item.date).format("DD-MM-YYYY hh:mm A") || '',
                    date: moment(item.date).isValid() ? moment(item.date).format("DD-MM-YYYY hh:mm A") : "Invalid Date"
                }
            }));
            setpersonalcheck(true);
        } catch (err) { setpersonalcheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    //------------------------------------------------------
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [isHandleChange, setIsHandleChange] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [fileFormat, setFormat] = useState("xl");
    let exportColumnNames = ["Company Name", "Page Name", "Date & Time"];
    let exportRowValues = ["companyname", "pagename", "Dateone"];
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Individual_Maintanence_Log_List",
        pageStyle: "print",
    });
    //table entries ..,.
    const [items, setItems] = useState([]);
    // const addSerialNumber = () => {
    //     const itemsWithSerialNumber = vendormaster?.map((item, index) => ({
    //         ...item, serialNumber: index + 1,
    //         // date: moment(item.date).isValid().format("DD-MM-YYYY hh:mm ") 
    //         date: moment(item.date).isValid() ? moment(item.date).format("DD-MM-YYYY hh:mm") : "Invalid Date"
    //     }));
    //     setItems(itemsWithSerialNumber);
    // }
    const addSerialNumber = (datas) => {
        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(vendormaster);
    }, [vendormaster]);
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "companyname", headerName: "Company Name", flex: 0, width: 270, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        { field: "pagename", headerName: "Page Name", flex: 0, width: 270, hide: !columnVisibility.pagename, headerClassName: "bold-header" },
        { field: "date", headerName: "Date & Time", flex: 0, width: 300, hide: !columnVisibility.date, headerClassName: "bold-header" },
    ]

    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");

    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            companyname: item.companyname,
            pagename: item.pagename,
            date: item.date
        }
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
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
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
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
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
    return (
        <Box>
            {/* ****** Header Content ****** */}
            {isUserRoleCompare?.includes("lmaintanencelog") && (
                <>
                    <Box >
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={totalProjects}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelmaintanencelog") && (
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
                                    {isUserRoleCompare?.includes("csvmaintanencelog") && (
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
                                    {isUserRoleCompare?.includes("printmaintanencelog") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmaintanencelog") && (
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
                                    {isUserRoleCompare?.includes("imagemaintanencelog") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>

                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={vendormaster}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={true}
                                    totalDatas={overallMaintanencelogData}

                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!personalcheck ?
                            <>
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
                            :
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
                                    paginated={true}
                                    filteredDatas={filteredDatas}
                                    totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallMaintanencelogData}

                                />
                                {/* <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }} ref={gridRef}
                                >
                                    <StyledDataGrid
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box>
                                    <Pagination
                                        page={page}
                                        pageSize={pageSize}
                                        totalPages={searchQuery !== "" ? 1 : totalPages}
                                        onPageChange={handlePageChange}
                                        pageItemLength={filteredDatas?.length}
                                        totalProjects={
                                            searchQuery !== "" ? filteredDatas?.length : totalProjects
                                        }
                                    />
                                </Box> */}
                            </>}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>

            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredDatas ?? []}
                itemsTwo={employees ?? []}
                filename={"Individual Maintanence Log List "}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
        </Box>
    );
}
export default Datainformation;