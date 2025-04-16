import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl,
    Grid, IconButton, List, ListItem, ListItemText, Popover, TextField, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useMediaQuery 
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import Resizable from "react-resizable";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import ttslogo from "../../../images/ttslogo.png"


function Payslip() {

    const isSmallScreen = useMediaQuery('(max-width:900px)');

    const useStyles = {
        tableHeaderText: {
            fontWeight: "bold",
            border: "0.5px solid grey",
            padding: "5px",
            textAlign: "left",

        },
        tableCellText: {
            border: "0.5px solid grey",
            padding: "5px",
            textAlign: "left",
        },
    };

    const [payrungens, setPayrungens] = useState([]);
    const [payslip, setPaySlip] = useState([]);
    const [controlpanel, setControlpanel] = useState([]);

    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [groupCheck, setGroupCheck] = useState(false);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const { auth } = useContext(AuthContext);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");



    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Group.png");
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


    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
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

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
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

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

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

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: " bold !important ",
        },
        "& .custom-id-row": {
            backgroundColor: "#1976d22b !important",
        },

        "& .MuiDataGrid-row.Mui-selected": {
            "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
                backgroundColor: "unset !important", // Clear the background color for selected rows
            },
        },
        "&:hover": {
            "& .custom-ago-row:hover": {
                backgroundColor: "#ff00004a !important",
            },
            "& .custom-in-row:hover": {
                backgroundColor: "#ffff0061 !important",
            },
            "& .custom-others-row:hover": {
                backgroundColor: "#0080005e !important",
            },
        },
    }));

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        name: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };



    const ids = useParams().id;

    // const designRef = useRef(null);
    // const ids = useParams().id
    // const handleConvert = () => {
    //   domToImage.toPng(designRef.current)
    //     .then(function (dataUrl) {
    //       const link = document.createElement('a');
    //     //   link.download = `${userDetails.legalname}.jpg`;
    //       link.download = `${userDetails.legalname}.jpg`;
    //       link.href = dataUrl;
    //       link.click();
    //     });
    // }


    const payslipRef = useRef(null);

    const handleDownloadPDF = () => {
        html2canvas(payslipRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 208;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('Payslip.pdf');
        });
    };


    const fetchControlSettings = async () => {

        try {

            let res_sub = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // setGroupCheck(true);
            setControlpanel(res_sub.data.overallsettings[0]);
        }
        catch (err) {
            // setGroupCheck(true);
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    // useEffect(() => {
    //     fetchControlSettings();
    // }, []);


    function numberToWords(number) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const suffixes = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

        if (number === 0) {
            return 'Zero';
        }

        function convertLessThanOneThousand(num) {
            if (num < 10) {
                return ones[num];
            } else if (num < 20) {
                return teens[num - 10];
            } else if (num < 100) {
                return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
            } else {
                return ones[Math.floor(num / 100)] + ' Hundred ' + convertLessThanOneThousand(num % 100);
            }
        }

        function convert(number) {
            if (number === 0) {
                return '';
            }

            let result = '';
            for (let i = 0; number > 0; i++) {
                if (number % 1000 !== 0) {
                    result = convertLessThanOneThousand(number % 1000) + ' ' + suffixes[i] + ' ' + result;
                }
                number = Math.floor(number / 1000);
            }
            return result.trim();
        }

        return convert(number);
    }



    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
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



    let snos = 1;

    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Group Name", field: "name" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: items,
        });
        doc.save("Group.pdf");
    };



    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Group",
        pageStyle: "print",
    });



    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = payrungens?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [payrungens]);

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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "name", headerName: "Group Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },


    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            // serialNumber: item.serialNumber,
            // name: item.name,
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

    console.log(isSmallScreen)

    return (
        <Box>
            <Headtitle title={"Pay Slip"} />
            {/* ****** Header Content ****** */}
            {/* {isUserRoleCompare?.includes("apayslip") && ( */}
            {/* <Box sx={{ backgroundColor: "white", width: '732px' }} ref={designRef}> */}
            <>
                <Typography sx={userStyle.HeaderText}> Pay Slip </Typography>
                <Box sx={userStyle.dialogbox} ref={payslipRef}>
                    <>
                        <br />
                        <Grid container spacing={1} sx={{ border: "3px solid black", padding: "6px", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }} >
                            <Grid item lg={12} md={12} xs={12} sm={12} sx={{ marginBottom: "40px" }} ></Grid>
                            <Grid item lg={4} md={12} xs={12} sm={12} sx={{ padding: "1px", marginBottom: "3px", marginLeft: "45px" }}>
                                <FormControl fullWidth size="small" >
                                    {/* <img src={Logo} style={{ objectFit: "contain" }} /> */}
                                    <img src={ttslogo} style={{ objectFit: "contain" }} />
                                </FormControl>
                            </Grid>
                            {/* <Grid item lg={6.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", marginTop: "37px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                                    <Typography sx={{
                                        fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
                                        fontSize: "25px",
                                        fontWeight: "500",
                                        margin: "0px 0px 5px 0px",
                                        color: "#444 !important",
                                    }}> <strong>TTS BUSINESS SERVICES PRIVATE LIMITED</strong> </Typography>
                                    <Typography sx={{
                                        fontSize: "25px",
                                        fontWeight: "400",
                                        margin: "0px 0px 10px 0px",
                                    }}> No.2 Third Floor,zee Towers,E.V.R. Road, Puther <br /> Trichy 620017 Phone: 0431-2792269 </Typography>
                                </FormControl>
                            </Grid> */}
                            <Grid
                                item
                                lg={6.98}
                                md={12}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: isSmallScreen ? "center" : "flex-start",
                                    marginTop: "37px",
                                    marginBottom: "3px",
                                    marginLeft: "1px",
                                }}
                            >
                                <FormControl
                                    fullWidth
                                    size="small"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: isSmallScreen ? "center" : "flex-start",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
                                            fontSize: "25px",
                                            fontWeight: "500",
                                            margin: "0px 0px 5px 0px",
                                            color: "#444 !important",
                                        }}
                                    >
                                        <strong>TTS BUSINESS SERVICES PRIVATE LIMITED</strong>
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "25px",
                                            fontWeight: "400",
                                            margin: "0px 0px 10px 0px",
                                        }}
                                    >
                                        No.2 Third Floor, Zee Towers, E.V.R. Road, Puthur <br />
                                        Trichy 620017 Phone: 0431-2792269
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} xs={12} sm={12} sx={{ marginBottom: "20px" }} >

                            </Grid>
                            <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "0.5px solid black", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography sx={{
                                        fontSize: "20px",
                                        fontWeight: "100",
                                        color: "#adaaaa !important",
                                    }}> <strong> Payslip For The Month Of May 2024</strong> </Typography>
                                </FormControl>
                            </Grid>
                            {/* <Grid item lg={11.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row" }}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Emp Name:
                                    </Typography>

                                    <Typography sx={userStyle.SubHeaderText}>
                                        AKILA SELVAN
                                    </Typography>
                                </FormControl>
                            </Grid> */}


                            <TableContainer component={Paper} elevation={0} sx={{ marginBottom: "16px", border: "none" }}>
                                <Table size="small" sx={{ borderCollapse: "collapse" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}> Emp Name</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }} >AKILA SELVAN</TableCell>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>EmpCode</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }} >{payslip.empcode}</TableCell>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Name of Bank</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>ICICI</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Designation</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>{payslip.department}</TableCell>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Account no</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>943463463666</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>DOJ</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>{moment(payslip.periodenddate).format("DD-MM-YYYY")}</TableCell>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>No of Working Days</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>31</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>Leave Taken</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>6</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                            <TableCell sx={{ ...userStyle.SubHeaderText, borderBottom: "none" }}>No. of Present Days</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>:</TableCell>
                                            <TableCell sx={{ borderBottom: "none" }}>25</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>


                            {/* <Grid>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        EmpCode
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>:{payslip.empcode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        Name of Bank
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ ...userStyle.titletxt, fontSize: "1em" }}>
                                        <Typography>: ICICI</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Designation
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>:{payslip.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        Account no
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <Typography>: 943463463666</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        DOJ
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>: {moment(payslip.periodenddate).format("DD-MM-YYYY")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        No of Working Days
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <Typography>: 31</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>{payslip.rundate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        Leave Taken
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <Typography> : 6</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        No. of Present Days
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText} >
                                        : 25
                                    </Typography>
                                </FormControl>
                            </Grid> */}
                            {/* <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="payslip table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>S.No</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>EARNINGS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                border: "0.5px solid black",
                                                padding: "5px",
                                                textAlign: "right",

                                            }}>
                                                <Typography><strong>AMOUNT</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>S.No</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>DEDUCTIONS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                border: "0.5px solid black",
                                                padding: "5px",
                                                textAlign: "right",

                                            }}>
                                                <Typography><strong>AMOUNT</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>1</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Basic</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.basic}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>1</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Leave Deduction</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.providentfund}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>2</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>HRA</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.hra}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>2</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>EPF</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.esi}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>3</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Conveyance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.medicalallowance}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>3</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>ESI</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.otherdeduction}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>4</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Medical Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>4</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Professional Tax</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>5</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Other Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.punctualityincentive}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>5</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>TDS</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.professionaltax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>6</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Production Allow</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.attendancebonus}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>7</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Over Time</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.overtime}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>8</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Incentives</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.otherallowance}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>9</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Night Shift Allow</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.performancebonus}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Total</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.performancebonus}</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Total</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                            <TableCell sx={useStyles.tableCellText}></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer> */}
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="payslip table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>S.No</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>EARNINGS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                border: "0.5px solid grey",
                                                padding: "5px",
                                                textAlign: "right",
                                            }}>
                                                <Typography ><strong>AMOUNT</strong></Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>S.No</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableHeaderText}>
                                                <Typography><strong>DEDUCTIONS</strong></Typography>
                                            </TableCell>
                                            <TableCell sx={{
                                                fontWeight: "bold",
                                                border: "0.5px solid grey",
                                                padding: "5px",
                                                textAlign: "right",
                                            }}>
                                                <Typography ><strong>AMOUNT</strong></Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Each row contains a spacer cell as well */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>1</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Basic</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.basic}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>1</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Leave Deduction</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.providentfund}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        {/* Repeat the above structure for each row */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>2</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>HRA</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.hra}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>2</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>EPF</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.esi}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        {/* Add more rows as needed following the same pattern */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>3</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Conveyance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.medicalallowance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>3</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>ESI</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.otherdeduction}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        {/* Continue for all rows */}
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>4</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Medical Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>4</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Professional Tax</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>5</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Other Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>5</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>TDS</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>6</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Production Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>7</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Over Time</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>8</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Incentives</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>9</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Night Shift Allowance</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Total</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.conveyance}</Typography>
                                            </TableCell>

                                            {/* Spacer between columns */}
                                            <TableCell sx={{ width: '50px' }}></TableCell>

                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>Total</Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography></Typography>
                                            </TableCell>
                                            <TableCell sx={useStyles.tableCellText}>
                                                <Typography>{payslip.incometax}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        {/* Continue adding rows as required */}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", padding: "5px", marginBottom: "3px" }}></Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ padding: "5px", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>

                                <Grid sx={{ width: "500px" }} >
                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                                {/* No .of days leave : <strong>0</strong> */}
                                                {/* No .of days leave : <strong>{payslip.noofdays}</strong> */}
                                                Total Earnings:

                                            </Typography>
                                        </FormControl>
                                        <FormControl fullWidth size="small">

                                            <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }}>
                                                {/* Leave Balance : <strong>12</strong> */}
                                                <strong>676786{payslip.numberofdays}</strong>

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }} >
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} >
                                                {/* Leave Balance : <strong>12</strong> */}
                                                Less Total Deductions:

                                            </Typography>
                                        </FormControl>
                                        <FormControl fullWidth size="small">

                                            <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }} >
                                                {/* Leave Balance : <strong>12</strong> */}
                                                <strong>7578{payslip.remainingdaysleave}</strong>

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column" }}>
                                        <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", }}>
                                                    Net Pay:
                                                </Typography>
                                            </FormControl>
                                            <FormControl fullWidth size="small">
                                                {/* <Input fullWidth disableUnderline={true} /> */}
                                                <Typography sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "black" }} ><strong>5656{payslip.nettotalpay}</strong></Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12} >
                                            <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}  >
                                                <Typography>(Rupees Five Thousand Five Hundred Six){numberToWords(payslip.nettotalpay)}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>< br />

                                </Grid>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", padding: "5px", marginBottom: "3px", marginLeft: "40px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}  >

                                    <Typography></Typography>
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", color: "black" }}  >

                                    <Typography><strong>Signature</strong></Typography>
                                </FormControl>
                            </Grid>

                        </Grid>

                    </>
                </Box>
            </>
            {/* </Box> */}
            <br />
            {/* {rowGetId === "Teammember" ? "" : <button onClick={handleConvert}>Download</button>} */}
            {/* <Button onClick={handleDownloadPDF}>Download PDF</Button> */}




            {/* <button onClick={handleConvert}>Download</button> */}
            {/* )} */}

            {/* ****** Table Start ****** */}

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

export default Payslip;
