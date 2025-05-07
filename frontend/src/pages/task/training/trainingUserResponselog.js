import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import { handleApiError } from "../../../components/Errorhandling";
import 'react-quill/dist/quill.snow.css';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";



const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
        complete: {
            textTransform: "capitalize !IMPORTANT",
            padding: "7px 19px",
            backgroundColor: "#00905d",
            height: "fit-content",
        },
    },
}));

function TrainingUserResponseLog({ com }) {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
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

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);

    let exportColumnNames = [
        'User Name',
        'Training Details',
        'Training Assigned Date',
        'Total Marks ',
        'Total Marks Obtained'
    ];
    let exportRowValues = [
        'username',
        'trainingdetails',
        'trainingassigneddate',
        'totalmarks',
        'totalmarksobtained',
    ];

    const classes = useStyles();
    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, allUsersData, isAssignBranch, allTeam, pageName,
        setPageName,
        buttonStyles, } = useContext(
            UserRoleAccessContext
        );
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    const [queueCheck, setQueueCheck] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    // Error Popup model
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const buttonStyle = {
        color: "black",
        "&:hover": {
            backgroundColor: "transparent",
        },
    };
    const ids = useParams().id;

    const checkCurrentDate = new Date();

    // get current time
    const currentHours = checkCurrentDate.getHours();
    const currentMinutes = checkCurrentDate.getMinutes();
    // const currentSeconds = checkCurrentDate.getSeconds();

    // Determine whether it's AM or PM
    const currentperiod = currentHours >= 12 ? "PM" : "AM";


    // Format the current time manually
    const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes =
        currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
    // const formattedSeconds = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds;
    const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

























    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };


    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };


    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;


    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    const dataGridStyles = {
        root: {
            "& .MuiDataGrid-row": {
                height: "15px",
            },
        },
    };
    const [allUploadedFiles, setAllUploadedFiles] = useState([]);


    const [shiftEndDate, setShiftEndDate] = useState([])

    const [singleDoc, setSingleDoc] = useState({});
    const [updateDetails, setUpDateDetails] = useState({});
    let updateby = singleDoc?.updatedby;
    let addedby = singleDoc?.addedby;



    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        username: true,
        trainingdetails: true,
        trainingassigneddate: true,
        trainingdate: true,
        serialNumber: true,
        taskdetails: true,
        totalmarks: true,
        totalmarksobtained: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    const convertTimeToAMPMFormat = (time) => {
        let [hour, minute] = time.split(':').map(Number);
        let timetype = 'AM';

        if (hour >= 12) {
            timetype = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }

        if (hour === 0) {
            hour = 12;
        }

        return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute} ${timetype}`;
    };


    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(raiseTicketList);
    }, [raiseTicketList]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };

    //datatable....
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
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 105,
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            //lockPinned: true,
        },
        {
            field: "username",
            headerName: "User Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.username,
            pinned: "left",
            //lockPinned: true,
        },
        {
            field: "trainingdetails",
            headerName: "Training Details",
            flex: 0,
            width: 200,
            hide: !columnVisibility.trainingdetails,
        },
        {
            field: "trainingassigneddate",
            headerName: "Training Assigned Date",
            flex: 0,
            width: 250,
            hide: !columnVisibility.trainingassigneddate,
        },
        {
            field: "taskassigneddate",
            headerName: "Training Date",
            flex: 0,
            width: 250,
            hide: !columnVisibility.taskassigneddate,
        },
        {
            field: "totalmarks",
            headerName: "Total Marks",
            flex: 0,
            width: 150,
            hide: !columnVisibility.totalmarks,
        },
        {
            field: "totalmarksobtained",
            headerName: "Total Marks Obtained",
            flex: 0,
            width: 200,
            hide: !columnVisibility.totalmarksobtained,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 400,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vtrainingpostponeduserpanel") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },

    ];
    const [onlineTestmasterEdit, setOnlineTestmasterEdit] = useState({});
    // get single row to edit....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TRAINING_USER_RESPONSE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setOnlineTestmasterEdit(res.data.straininguserresponses);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };




    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item?.serialNumber,
            username: item.username,
            trainingdetails: item.trainingdetails,
            trainingassigneddate: item.trainingassigneddate,
            trainingdate: item.trainingdate,
            typequestion: item.typequestion,
            trainingtype: item.trainingtype,
            taskdetails: item.taskdetails,
            totalmarks: item.totalmarks,
            totalmarksobtained: item.totalmarksobtained,
        };
    });

    // Excel
    const fileName = "User_Training_Responses";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User Training Responses",
        pageStyle: "print",
    });

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Training User Response Log.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

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

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const [copiedData, setCopiedData] = useState("");








    const ListPageLoadDataCompleted = async () => {
        try {
            let res_task = await axios.post(SERVICE.ALL_TRAINING_USER_RESPONSE_COMPLETED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess.companyname,
                trainingid: ids,
                status: ["Completed", "Finished By Others", "Not Applicable to Me"]
            });
            const finalAnswer = res_task?.data?.traininguserresponses
            const answer = finalAnswer?.length > 0 ? finalAnswer?.map((item, index) => ({
                serialNumber: index + 1,
                id: item._id,
                username: item.username,
                trainingdetails: item.trainingdetails,
                trainingassigneddate: item.trainingassigneddate,
                trainingdate: item.trainingdate,
                typequestion: item.typequestion,
                trainingtype: item.trainingtype,
                subcategory: item.subcategory,
                taskdetails: item.taskdetails,
                totalmarks: item.totalmarks,
                totalmarksobtained: item.totalmarksobtained,
                type: item.type,
            })) : [];
            setRaiseTicketList(answer);
            setQueueCheck(true);
        } catch (err) { setQueueCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }




    useEffect(() => {
        ListPageLoadDataCompleted();
    }, [com])
    useEffect(() => {
        ListPageLoadDataCompleted();
    }, [])





    return (
        <Box>
            <Headtitle title={"USER TRAINING RESPONSE"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>User Training Responses</Typography>
            {/* <Confetti
                width={windowSize.width}
                height={windowSize.height}
            /> */}
            {!queueCheck ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("ltrainingpostponeduserpanel") && (
                        <>

                            <Box sx={userStyle.dialogbox}>
                                <Typography sx={userStyle.HeaderText}>User Training Responses List</Typography>

                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <br></br><br></br><br></br>
                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                    <Grid item md={2} xs={12} sm={12}>
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
                                            <MenuItem value={raiseTicketList?.length}>All</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid
                                        item
                                        md={8}
                                        xs={12}
                                        sm={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {isUserRoleCompare?.includes("exceltrainingpostponeduserpanel") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtrainingpostponeduserpanel") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtrainingpostponeduserpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftrainingpostponeduserpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetrainingpostponeduserpanel") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTable}
                                            setItems={setItems}
                                            addSerialNumber={addSerialNumber}
                                            setPage={setPage}
                                            maindatas={raiseTicketList}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={items}
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                {/* ****** Table Grid Container ****** */}

                                <br />
                                <br />
                                <Button
                                    sx={userStyle.buttongrp}
                                    onClick={() => {
                                        handleShowAllColumns();
                                        setColumnVisibility(initialColumnVisibility);
                                    }}
                                >
                                    Show All Columns
                                </Button>
                                &emsp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                    Manage Columns
                                </Button>{" "}
                                &emsp;

                                <br />
                                <br />
                                {/* ****** Table start ****** */}
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
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
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={items}

                                    />
                                </Box>
                                <br></br>
                                <br></br>

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

                            </Box>
                        </>
                    )}
                </>
            )}



            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view model */}
            <Dialog open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth
                sx={{marginTop:"50px"}}
            >

                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View User Training Responses</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">User Name</Typography>
                                    <Typography>{onlineTestmasterEdit.username}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Total Marks Obtained</Typography>
                                    <Typography>{onlineTestmasterEdit.totalmarksobtained}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Total Marks</Typography>
                                    <Typography>{onlineTestmasterEdit.totalmarks}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">User's Responses</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important", fontStyle: "bold", fontWeight: "bold" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important", fontStyle: "bold", fontWeight: "bold" }}> {"Question"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important", fontStyle: "bold", fontWeight: "bold" }}> {"User Answers"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important", fontStyle: "bold", fontWeight: "bold" }}> {"Question Status"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {onlineTestmasterEdit?.interviewForm?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.question}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.userans?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.status}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={raiseTicketList ?? []}
                filename={"Training User Response Log"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <br />
            <br />
        </Box>
    );
}

export default TrainingUserResponseLog;
