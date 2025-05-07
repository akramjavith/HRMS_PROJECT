import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert.js";
import {
    DeleteConfirmation
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext.js';
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from '../../../services/Baseservice.js';

const OthoursTable = ({ taskcategorys, setDeleteIndexWeekoff, handleClickOpenWeekOff }) => {

    const pathname = window.location.pathname;
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = ['Name', 'Description'];
    let exportRowValues = ['categoryname', 'description',]

    const [taskcategoryEdit, setTaskcategoryEdit] = useState({ categoryname: "", description: "" })
    // const [taskcategorys, setTaskcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allTaskcategoryedit, setAllTaskcategoryedit] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [btnLoad, setBtnLoad] = useState(false)
    const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Task Category.png');
                });
            });
        }
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnLoad(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // const handleClickOpen = () => {
    //     setIsDeleteOpen(true);
    // };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
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
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        enableholiday: true,
        enableweekoff: true,
        enableshiftbeforeothours: true,
        enableshiftbeforeothoursvalue: true,
        enableshitafterothours: true,
        enableshitafterothoursvalue: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteCategroy, setDeleteCategory] = useState("");


    // Alert delete popup
    let taskcategorysid = deleteCategroy?._id;
    const delTaskCategory = async (e) => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.TASKCATEGORY_SINGLE}/${taskcategorysid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchTaskcategory();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1)
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Project updateby edit page...
    let updateby = taskcategoryEdit?.updatedby;
    let addedby = taskcategoryEdit?.addedby;


    //get all Sub vendormasters.
    const fetchTaskcategory = async () => {
        setPageName(!pageName);
        try {

            // setTaskcategorys(allTodo);
            setTaskcategorycheck(true);
        } catch (err) { setTaskcategorycheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //get all Sub vendormasters.
    const fetchTaskcategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_meet = await axios.get(SERVICE.TASKCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllTaskcategoryedit(res_meet?.data?.taskcategorys.filter(item => item._id !== taskcategoryEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Task Category',
        pageStyle: 'print'
    });

    useEffect(() => {
        // fetchTaskcategory();
        fetchTaskcategoryAll();
    }, [])

    useEffect(() => {
        fetchTaskcategoryAll();
    }, [isEditOpen, taskcategoryEdit])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {
        const allData = data?.map((items, index) => ({
            ...items, serialNumber: index + 1
        }))
        setItems(allData);
    }

    useEffect(() => {
        addSerialNumber(taskcategorys);
    }, [taskcategorys])

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
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
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
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );

    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 170, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 220, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "enableshiftbeforeothours", headerName: "Enable Shift Before OT Hours", flex: 0, width: 170, hide: !columnVisibility.enableshiftbeforeothours, headerClassName: "bold-header" },
        { field: "enableshiftbeforeothoursvalue", headerName: "Shift Before OT Hours", flex: 0, width: 170, hide: !columnVisibility.enableshiftbeforeothoursvalue, headerClassName: "bold-header" },
        { field: "enableshitafterothours", headerName: "Enable Shift After OT Hours", flex: 0, width: 170, hide: !columnVisibility.enableshitafterothours, headerClassName: "bold-header" },
        { field: "enableshitafterothoursvalue", headerName: "Shift After OT Hours", flex: 0, width: 170, hide: !columnVisibility.enableshitafterothoursvalue, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex', }}>

                    <Button sx={userStyle.buttondelete} onClick={(e) => {
                        handleClickOpenWeekOff(params.row.serialNumberdel);
                        setDeleteIndexWeekoff(params.row.serialNumberdel)

                    }}>
                        <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>


                </Grid>
            ),
        },
    ]

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            serialNumberdel: item.serialNumber === 0 ? 0 : item.serialNumber - 1,
            serialNumberforDel: index,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            enableholiday: item.enableHoliday ? "Yes" : "No",
            enableweekoff: item.enableweekoff ? "Yes" : "No",
            enableshiftbeforeothours: item.enableshiftbeforeothours ? "Yes" : "No",
            enableshiftbeforeothoursvalue: item.enableshiftbeforeothoursvalue,
            enableshitafterothours: item.enableshitafterothours ? "Yes" : "No",
            enableshitafterothoursvalue: item.enableshitafterothoursvalue,
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

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lattendancecontrolcriteria") && (
                <>
                    <Box >
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={userStyle.importheadtext}><b>OT Hours List</b></Typography>
                        </Grid>
                        <Grid style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
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
                                        {/* <MenuItem value={(taskcategorys?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
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
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;

                        <br />
                        <br />
                        <>
                            <Box
                                style={{
                                    width: '100%',
                                    overflowY: 'hidden', // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    rows={rowsWithCheckboxes}
                                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                        </>
                        {/* } */}
                    </Box>
                </>
            )
            }
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

            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent
                                sx={{
                                    width: "350px",
                                    textAlign: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {getOverAllCountDelete}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error" sx={buttonStyles.buttonsubmit}>
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>




            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error' sx={buttonStyles.buttonsubmit}
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={items ?? []}
                filename={"Task Category"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Task Category Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delTaskCategory}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            <br />
        </Box>
    );
}


export default OthoursTable;