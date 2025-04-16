import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, List, ListItem, ListItemText, TableCell, Popover, Checkbox, TextField, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import StyledDataGrid from "../../../components/TableStyle";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Headtitle from "../../../components/Headtitle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function TemplateControlLog() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    const { auth } = useContext(AuthContext);
    const [isBankdetail, setBankdetail] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Remote Employee Log List.png');
                });
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
        company: true,
        branch: true,
        companyurl: true,
        companyname: true,
        address: true,
        datetime: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const handleClickOpenView = () => {
        setIsViewOpen(true);
    };
    const handleCloseModView = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsViewOpen(false);

    };

    const renderFilePreviewDocumentContentHeader = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const [purposeEdit, setPurposeEdit] = useState({ purposename: "" })
    const [documentFilesDocumentContentHeaderView, setdocumentFilesDOcumentContentHeaderView] = useState([]);
    const [documentFilesDocumentContentFooterView, setdocumentFilesDOcumentContentFooterView] = useState([]);
    const [documentFilesDocumentBodyContentView, setdocumentFilesDOcumentBodyContentView] = useState([]);
    const [documentFilesDocumentFrontHeaderView, setdocumentFilesDOcumentFrontHeaderView] = useState([]);
    const [documentFilesDocumentFrontFooterView, setdocumentFilesDOcumentFrontFooterView] = useState([]);
    const [documentFilesDocumentBackHeaderView, setdocumentFilesDOcumentBackHeaderView] = useState([]);
    const [documentFilesDocumentBackFooterView, setdocumentFilesDOcumentBackFooterView] = useState([]);
    const [todoscheckSealView, settodoscheckSealView] = useState([])
    const [documentFilesSignatureView, setdocumentFilesSignatureView] = useState([])
    const [documentFilesView, setdocumentFilesVIew] = useState([]);

    const [isDeletealert, setDeletealert] = useState(false);

    const [deleteSource, setDeleteSource] = useState("");

    const rowData = async (id) => {
        try {

            setDeleteSource(id);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    const delSource = async (e) => {

        try {
            if (deleteSource) {
                await axios.delete(`${SERVICE.TEMPLATECONTROLPANEL_SINGLEDELETE}/${userid}/${deleteSource}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchEmployee();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setDeletealert(true);
                setTimeout(() => {
                    setDeletealert(false);
                }, 1000)
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    // get single row to view....
    const getviewCode = async (e, logid) => {
        try {
            let res = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const lastupdatedata = res?.data?.stemplatecontrolpanel?.templatecontrolpanellog?.filter((item) => item._id === logid)
            setPurposeEdit(lastupdatedata[0]);
            setdocumentFilesDOcumentContentHeaderView(lastupdatedata[0]?.letterheadcontentheader)
            setdocumentFilesDOcumentContentFooterView(lastupdatedata[0]?.letterheadcontentfooter)
            setdocumentFilesDOcumentBodyContentView(lastupdatedata[0]?.letterheadbodycontent)
            setdocumentFilesDOcumentFrontHeaderView(lastupdatedata[0]?.idcardfrontheader)
            setdocumentFilesDOcumentFrontFooterView(lastupdatedata[0]?.idcardfrontfooter)
            setdocumentFilesDOcumentBackHeaderView(lastupdatedata[0]?.idcardbackheader)
            setdocumentFilesDOcumentBackFooterView(lastupdatedata[0]?.idcardbackfooter)
            settodoscheckSealView(lastupdatedata[0]?.documentseal)
            setdocumentFilesSignatureView(lastupdatedata[0]?.documentsignature)
            setdocumentFilesVIew(lastupdatedata[0]?.documentcompany)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //get all employees list details
    const userid = useParams().id

    const fetchEmployee = async () => {
        try {
            let res_employee = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${userid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_emp = res_employee?.data?.stemplatecontrolpanel?.templatecontrolpanellog
            setEmployees(data_emp)
            setBankdetail(true);
        } catch (err) { setBankdetail(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //  PDF
    const columns = [
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Company URL", field: "companyurl" },
        { title: "Company Name", field: "companyname" },
        { title: "Address", field: "address" },
        { title: "Date/Time", field: "datetime" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns?.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
            },
            columns: columnsWithSerial,
            body: rowDataTable,
        });
        doc.save("Template Control Panel Log List.pdf");
    };

    // Excel
    const fileName = "Template Control Panel Log List";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Template Control Panel Log List",
        pageStyle: "print",
    });
    useEffect(() => {
        fetchEmployee();
    }, []);
    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [employees]);

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


    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(employees?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

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
            flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "companyurl", headerName: "Company URL", flex: 0, width: 150, hide: !columnVisibility.companyurl, headerClassName: "bold-header" },
        { field: "companyname", headerName: "Company Name", flex: 0, width: 150, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        { field: "address", headerName: "Address", flex: 0, width: 150, hide: !columnVisibility.address, headerClassName: "bold-header" },
        { field: "datetime", headerName: "Date/Time", flex: 0, width: 180, hide: !columnVisibility.datetime, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            // Assign Bank Detail
            renderCell: (params) => (
                <Grid sx={{ display: 'flex', gap: "20px" }}>

                    {isUserRoleCompare?.includes("vtemplatecontrolpanel") && (
                        <Button variant="contained" onClick={() => {
                            handleClickOpenView();
                            getviewCode(userid, params.row.id);
                        }}>View
                        </Button>
                    )}
                    {(isUserRoleCompare?.includes("dtemplatecontrolpanel") && params?.row?.index == 0) && (
                        <Button startIcon={<><DeleteIcon /></>} variant="contained" color="error" onClick={() => {

                            rowData(params.row.id);
                        }}>Delete
                        </Button>
                    )}
                </Grid>
            ),
        },
    ]

    const rowDataTable = filteredData.map((item, index) => {

        return {
            id: item._id,
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            companyurl: item.companyurl,
            companyname: item.companyname,
            address: item.address,
            datetime: `${moment(item.createdAt).format("DD-MM-YYYY")} / ${moment(item.createdAt).format("HH:mm:ss")}`,
            index: index
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
                    {filteredColumns?.map((column) => (
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
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    return (
        <Box>
            <Headtitle title={"Template Control Panel"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Template Control Panel Log List</Typography>
            <br />
            <br />
            {isUserRoleCompare?.includes("menutemplatecontrolpanel") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <Typography sx={userStyle.SubHeaderText}>Template Control Panel Log List</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Link to="/settings/templatecontrolpanel" style={{ textDecoration: "none", color: "white", float: "right" }}>
                                    <Button variant="contained">Back</Button>
                                </Link>
                            </Grid>
                        </Grid>


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
                                        <MenuItem value={(employees?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("exceltemplatecontrolpanel") && (
                                        <>
                                            <ExportXL csvData={rowDataTable?.map((item, index) => ({
                                                Sno: index + 1,
                                                "Company": item.company,
                                                "Branch": item.branch,
                                                "Company URL": item.companyurl,
                                                "Company Name": item.companyname,
                                                "Address": item.address,
                                                "Date/Time": item.datetime,
                                            }))} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtemplatecontrolpanel") && (
                                        <>
                                            <ExportCSV csvData={rowDataTable?.map((item, index) => ({
                                                Sno: index + 1,
                                                "Company": item.company,
                                                "Branch": item.branch,
                                                "Company URL": item.companyurl,
                                                "Company Name": item.companyname,
                                                "Address": item.address,
                                                "Date/Time": item.datetime,
                                            }))} fileName={fileName} />

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtemplatecontrolpanel") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftemplatecontrolpanel") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagetemplatecontrolpanel") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
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

                        <br /><br />
                        {!isBankdetail ?
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
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                                        Showing {filteredData?.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6"></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error">
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* View DIALOG */}
                <Dialog open={isViewOpen} onClose={handleCloseModView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                    <Box sx={userStyle.dialogbox}>
                        <Box sx={{ padding: '20px 50px' }}>
                            <>
                                <Typography sx={userStyle.HeaderText}> View Template Control Panel</Typography>
                                <br /> <br />
                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography ><b>Company</b></Typography>
                                            <Typography>{purposeEdit.company}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography ><b>Branch</b></Typography>
                                            <Typography>{purposeEdit.branch}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>Document Letter Head Content Header</b> </Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentContentHeaderView?.length > 0 &&
                                                documentFilesDocumentContentHeaderView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>Document Letter Head Content Footer</b> </Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentContentFooterView?.length > 0 &&
                                                documentFilesDocumentContentFooterView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>Document Letter Head Body Content(Background)</b> </Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentBodyContentView?.length > 0 &&
                                                documentFilesDocumentBodyContentView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography ><b>Company URL</b></Typography>
                                            <Typography>{purposeEdit.companyurl}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>ID Card Front Header</b> </Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentFrontHeaderView?.length > 0 &&
                                                documentFilesDocumentFrontHeaderView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>ID Card Front Footer</b></Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentFrontFooterView?.length > 0 &&
                                                documentFilesDocumentFrontFooterView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>ID Card Back Header</b> </Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentBackHeaderView?.length > 0 &&
                                                documentFilesDocumentBackHeaderView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <Typography ><b>ID Card Back Footer </b></Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesDocumentBackFooterView?.length > 0 &&
                                                documentFilesDocumentBackFooterView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography ><b>Company Name</b></Typography>
                                            <Typography>{purposeEdit.companyname}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography ><b>Address</b></Typography>
                                            <Typography>{purposeEdit.address}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <Typography ><b>Logo</b> </Typography>
                                        <br></br>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {documentFilesView?.length > 0 &&
                                                documentFilesView?.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={8} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Seal</Typography>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {todoscheckSealView?.length > 0 &&
                                                    todoscheckSealView.map((todo, index) => (
                                                        <div key={index}>

                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Seal Type</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.seal}
                                                                                readOnly={true}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.name}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={4} sm={6} xs={6}>
                                                                    <Typography><b>Seal Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                            </Grid>

                                                            <br />
                                                        </div>
                                                    ))}
                                            </Grid>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Signature</Typography>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesSignatureView?.length > 0 &&
                                                    documentFilesSignatureView.map((todo, index) => (
                                                        <div key={index}>

                                                            <Grid container spacing={1}>
                                                                <>

                                                                    <Grid item md={2.5} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Unit</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.unit}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2.5} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Team</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.team}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2.5} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Employee</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.employee}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2.5} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.signaturename}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={2} sm={6} xs={6}>
                                                                    <Typography><b>Signature Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>

                                                                <Grid item md={4} xs={12} sm={12} >
                                                                    <FormControl fullWidth size="small">
                                                                        <Typography ><b>From Email</b></Typography>
                                                                        <Typography>{purposeEdit.fromemail}</Typography>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={4} xs={12} sm={12} >
                                                                    <FormControl fullWidth size="small">
                                                                        <Typography ><b>CC Email</b></Typography>
                                                                        {Array.isArray(purposeEdit.ccemail) ? purposeEdit.ccemail?.map((item => <Typography>{item}</Typography>)) : ""}

                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item md={4} xs={12} sm={12} >
                                                                    <FormControl fullWidth size="small">
                                                                        <Typography ><b>BCC Email</b></Typography>
                                                                        {Array.isArray(purposeEdit.bccemail) ? purposeEdit.bccemail?.map((item => <Typography>{item}</Typography>)) : ""}
                                                                    </FormControl>
                                                                </Grid>

                                                            </Grid>

                                                            <br />
                                                        </div>
                                                    ))}
                                            </Grid>
                                        </FormControl>
                                    </Grid>



                                </Grid>
                                <br /> <br />  <br />
                                <Grid container spacing={2}>
                                    <Button variant="contained" color="primary" onClick={handleCloseModView}> Back </Button>
                                </Grid>
                            </>
                        </Box>
                    </Box>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
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

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <TableCell>S.no</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Company URL</TableCell>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Date/Time</TableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable?.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.companyurl}</TableCell>
                                    <TableCell>{row.companyname}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                    <TableCell>{row.datetime}</TableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={isDeleteOpen}
                onClose={handleCloseMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                    <Button autoFocus variant="contained" color='error'
                        onClick={(e) => delSource()}
                    > OK </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeletealert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default TemplateControlLog;