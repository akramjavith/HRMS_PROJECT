import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from '../../services/Baseservice';
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import 'jspdf-autotable';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useReactToPrint } from "react-to-print";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import { ThreeDots } from "react-loader-spinner";

function Submodulelistview() {
    const pathname = window.location.pathname;
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const [loader, setLoader] = useState(false);
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

    let exportColumnNames = ['Project', 'Sub Project', 'Module', 'Sub Module', 'Page Type No', 'Main Page', 'Sub Page', 'Sub Sub Page', 'Page Branch'];
    let exportRowValues = ['project', 'subproject', 'module', 'submodule', 'pagetype', 'mainpage', 'subpage', 'name', 'page'];

    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const { isUserRoleCompare, pageName, setPageName, isAssignBranch, isUserRoleAccess } = useContext(UserRoleAccessContext);
    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("");
    let authToken = localStorage.APIToken;
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // Delete model

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    const { auth } = useContext(AuthContext);
    const [projectModels, setProjectModels] = useState([]);
    const [submoduleEnd, setSubmoduleEnd] = useState([]);
    const [endMerge, setEndmerge] = useState([]);

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Submodule List View.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Submodule List view"),
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

    const filteredDataend = projectModels.filter(row => row.pageBranch === 'EndPage');
    {
        filteredDataend.map(row => (
            <li>{row.pageBranch}</li>
        ))
    }
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
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

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        project: true,
        subproject: true,
        module: true,
        submodule: true,
        pagetype: true,
        mainpage: true,
        subpage: true,
        name: true,
        page: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const [deletePageData, setDeletePageData] = useState([]);
    const [deletePageName, setDeletePageName] = useState([]);

    // Alert delete popup
    let pageTypeId = deletePageData?._id;
    const delPageView = async () => {
        setPageName(!pageName);
        try {
            if (deletePageName === "submodule") {
                await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${pageTypeId}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    status: "not assigned",
                    componentgrouping: "",
                    component: "",
                    subcomponent: "",
                    count: "",
                    subComReq: "",
                    taskassignboardliststatus: "Yet to assign"
                });
                handleCloseMod();
                setPage(1)
            }
            else {
                await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${pageTypeId}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    status: "not assigned",
                    componentgrouping: "",
                    component: "",
                    subcomponent: "",
                    count: "",
                    subComReq: "",
                    taskassignboardliststatus: "Yet to assign"
                });
                handleCloseMod();
                setPage(1)
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchprojectModelsDropdwon = async () => {
        setPageName(!pageName);
        try {
            let res_project = await axios.get(SERVICE.PAGEMODEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let resr = res_project.data.pagemodel.filter((a) => a.pageBranch === "EndPage")
            setProjectModels(resr);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchSubmodule = async () => {
        setPageName(!pageName);
        try {
            let res_submodule = await axios.get(SERVICE.SUBMODULE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let res = res_submodule?.data?.submodules?.filter((a) => a.endpage === "end")

            const res_name = res.map((t, index) => ({
                _id: t._id,
                project: t.project,
                subproject: t.subproject,
                module: t.module,
                submodule: t.name,
                page: "submodule",
                endpage: t.endpage,
                pagetype: "",
                mainpage: "---",
                subpage: "",
                subsubpage: "",
                pageBranch: "",
                endpage: t.endpage,
                status: t.status
            }));
            setSubmoduleEnd(res_name);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchmerge = async () => {
        let res = [...projectModels, ...submoduleEnd]
        setEndmerge(res.map((item, index) => ({
            ...item, serialNumber: index + 1,
            project: item.project,
            subproject: item.subproject,
            module: item.module,
            submodule: item.submodule,
            pagetype: item.pagetype,
            mainpage: item.mainpage === "" ? "---" : item.mainpage,
            subpage: item.subpage === "" ? "---" : item.subpage,
            name: item.name,
            page: (item.page == "pageBranch" ? item.name : item.pageBranch)

        })));
        setLoader(true);
    };

    useEffect(() => {
        fetchprojectModelsDropdwon();
        fetchSubmodule();
    }, [])

    useEffect(() => {
        fetchmerge();
    }, [submoduleEnd, projectModels]);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    }

    useEffect(() => {
        addSerialNumber(endMerge);
    }, [endMerge])

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };
    //datatable....
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
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

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "project", headerName: "Project Name", flex: 0, width: 130, hide: !columnVisibility.project, headerClassName: "bold-header" },
        { field: "subproject", headerName: "Sub Project ", flex: 0, width: 130, hide: !columnVisibility.subproject, headerClassName: "bold-header" },
        { field: "module", headerName: "Module", flex: 0, width: 130, hide: !columnVisibility.module, headerClassName: "bold-header" },
        { field: "submodule", headerName: "Sub Module", flex: 0, width: 130, hide: !columnVisibility.submodule, headerClassName: "bold-header" },
        { field: "pagetype", headerName: "Page Type No", flex: 0, width: 130, hide: !columnVisibility.pagetype, headerClassName: "bold-header" },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 130, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 130, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
        { field: "name", headerName: "Sub Sub Page", flex: 0, width: 130, hide: !columnVisibility.name, headerClassName: "bold-header" },
        {
            field: "page",
            headerName: "Page Branch",
            flex: 0,
            width: 120,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.page,
            headerClassName: "bold-header",
        },
    ]

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            project: item.project,
            subproject: item.subproject,
            module: item.module,
            submodule: item.submodule,
            pagetype: item.pagetype,
            mainpage: item.mainpage,
            subpage: item.subpage,
            name: item.name,
            // page: (item.page == "pageBranch" ? item.name : item.pageBranch)
            page: item.page,
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
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Submodulelistview",
        pageStyle: "print",
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={"Sub Module List View"} />
            <PageHeading
                title="Sub Module List View"
                modulename="Projects"
                submodulename="Sub Module"
                mainpagename="Submodule List view"
                subpagename=""
                subsubpagename=""
            />
            {!loader ? (
                <Box sx={userStyle.container}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            minHeight: "350px",
                        }}
                    >
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
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("lsubmodulelistview")
                        && (
                            <>
                                <br />
                                <Box sx={userStyle.container}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <Typography sx={userStyle.SubHeaderText}>Sub Module List View</Typography>
                                        </Grid>
                                    </Grid>
                                    <br /><br />
                                    {/* {isSubpagefive ?  */}
                                    <>
                                        <Grid container sx={{ justifyContent: "center" }} >
                                            <Grid >
                                                {isUserRoleCompare?.includes("excelsubmodulelistview") && (
                                                    <>
                                                        <Button onClick={(e) => {
                                                            setIsFilterOpen(true)
                                                            setFormat("xl")
                                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes("csvsubmodulelistview") && (
                                                    <>
                                                        <Button onClick={(e) => {
                                                            setIsFilterOpen(true)
                                                            setFormat("csv")
                                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes("printsubmodulelistview") && (
                                                    <>
                                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes("pdfsubmodulelistview") && (
                                                    <>
                                                        <Button sx={userStyle.buttongrp}
                                                            onClick={() => {
                                                                setIsPdfFilterOpen(true)
                                                            }}
                                                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes("imagesubmodulelistview") && (
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                                )}
                                            </Grid>
                                        </Grid><br />
                                        <Grid style={userStyle.dataTablestyle}>
                                            <Box>
                                                <label >Show entries:</label>
                                                <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                    <MenuItem value={50}>50</MenuItem>
                                                    <MenuItem value={100}>100</MenuItem>
                                                    <MenuItem value={(endMerge?.length)}>All</MenuItem>
                                                </Select>
                                            </Box>
                                            <Grid item md={2} xs={6} sm={6}>
                                                <AggregatedSearchBar
                                                    columnDataTable={columnDataTable}
                                                    setItems={setItems}
                                                    addSerialNumber={addSerialNumber}
                                                    setPage={setPage}
                                                    maindatas={endMerge}
                                                    setSearchedString={setSearchedString}
                                                    searchQuery={searchQuery}
                                                    setSearchQuery={setSearchQuery}
                                                    paginated={false}
                                                    totalDatas={endMerge}
                                                />
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                                        <br />
                                        {/* ****** Table start ****** */}
                                        <Box
                                            style={{
                                                width: '100%',
                                                overflowY: 'hidden', // Hide the y-axis scrollbar
                                            }}
                                        >
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
                                                    // totalDatas={totalDatas}
                                                    searchQuery={searchedString}
                                                    handleShowAllColumns={handleShowAllColumns}
                                                    setFilteredRowData={setFilteredRowData}
                                                    filteredRowData={filteredRowData}
                                                    setFilteredChanges={setFilteredChanges}
                                                    filteredChanges={filteredChanges}
                                                    gridRefTableImg={gridRefTableImg}
                                                    itemsList={endMerge}
                                                />
                                            </>
                                        </Box>
                                    </>

                                </Box>
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

                                {/* Delete Modal */}
                                <Box>
                                    {/* ALERT DIALOG */}
                                    <Dialog
                                        open={isDeleteOpen}
                                        onClose={handleCloseMod}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogContent
                                            style={{ width: "350px", textAlign: "center", alignItems: "center" }}
                                        >
                                            <ErrorOutlineOutlinedIcon
                                                style={{ fontSize: "80px", color: "orange" }}
                                            />
                                            <Typography variant="h5" style={{ color: "red", textAlign: "center" }}>
                                                Are you sure?
                                            </Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseMod} style={{
                                                backgroundColor: '#f4f4f4',
                                                color: '#444',
                                                boxShadow: 'none',
                                                borderRadius: '3px',
                                                border: '1px solid #0000006b',
                                                '&:hover': {
                                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                                        backgroundColor: '#f4f4f4',
                                                    },
                                                },
                                            }}>
                                                Cancel
                                            </Button>
                                            <Button
                                                autoFocus
                                                variant="contained"
                                                color="error"
                                                onClick={(e) => delPageView(pageTypeId)}
                                            >
                                                {" "}
                                                OK{" "}
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
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
                                    itemsTwo={endMerge ?? []}
                                    filename={"Submodulelistview"}
                                    exportColumnNames={exportColumnNames}
                                    exportRowValues={exportRowValues}
                                    componentRef={componentRef}
                                />
                                {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
                                <DeleteConfirmation
                                    open={isDeleteOpen}
                                    onClose={handleCloseMod}
                                    onConfirm={delPageView}
                                    title="Are you sure?"
                                    confirmButtonText="Yes"
                                    cancelButtonText="Cancel"
                                />
                            </>
                        )}
                </>
            )}

        </Box>

    );
}

export default Submodulelistview;