import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, Popover, TextField, Typography } from "@mui/material";
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
import hilifelogo from "../../../images/hilogo.png"


function PayslipTemplateTwo() {
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

    useEffect(() => {
        fetchControlSettings();
    }, []);


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
                        <Grid container spacing={1} sx={{ border: "3px solid black", padding: "2px", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }} >
                            <Grid item lg={6} md={12} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "1px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small" >
                                    {/* <img src={Logo} style={{ objectFit: "contain" }} /> */}
                                    <img src={hilifelogo} style={{ objectFit: "contain" }} />
                                </FormControl>
                            </Grid>
                            <Grid item lg={5.98} md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", border: "0.5px solid black", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", alignContent: "start" }}>
                                    {/* <Typography sx={userStyle.HeaderText}> <strong> Gen Engineering Services Pvt. Ltd.,</strong> </Typography>
                                    <Typography sx={userStyle.titletxt}> <strong> Door No: 19, 1st floor, Indira Gandhi Nagar, Vayalur Road, Trichy, 620102 </strong></Typography> */}
                                    <Typography sx={userStyle.HeaderText}> <strong>HILIFE.AI PRIVATE LIMITED</strong> </Typography>
                                    <Typography sx={{ ...userStyle.SubHeaderText, lineHeight: "2" }}> No 2, Second Floor, Zee towers, EVR Road, <br />
                                        Puthur, Trichy -620017</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        EMP CODE
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}HT2107070006
                                    <Typography>{payslip.empcode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.titletxt} >
                                        <strong>NAME</strong>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ ...userStyle.titletxt, fontSize: "1em" }}>
                                        {/* <strong>UMAPARVATHI CHELLADURAI</strong> */}
                                        <Typography>{payslip.companyname}NIRMAL</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        DEPARTMENT
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography>{payslip.department}IT</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        DESIGNATION
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography>{payslip.designation}SOFTWARE ENGINEER - II</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        PERIOD END DATE
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    {/* <Typography>{payslip.periodenddate}</Typography> */}
                                    <Typography>{moment(payslip.periodenddate).format("DD-MM-YYYY")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        BANK ACCOUNT NUM
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography>{payslip.accountnumber}65114654644</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        PAID DAYS
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography>{payslip.rundate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        UAN NO.
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        {/* <Typography>{payslip.uanno}</Typography> */}
                                        <Typography>{payslip.uanno !== undefined ? String(payslip.uanno) : ""}NIL</Typography>
                                        {/* <Typography>{payslip.uanno ? payslip.uanno : ""}</Typography> */}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                         DATE
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    {/* <Typography>{payslip.paiddate}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <strong>EARNINGS</strong>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <strong>AMOUNT</strong>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <strong>DEDUCTIONS</strong>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small" >
                                    <Typography sx={userStyle.SubHeaderText}>
                                        <strong>AMOUNT</strong>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        BASIC
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px", }}>
                                <FormControl fullWidth size="small" sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography>{payslip.basic}27000.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        PROVIDENT FUND
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.providentfund}0.00</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        HRA
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.hra}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        ESI
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.esi}0.00</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        MA
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small" sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography>{payslip.medicalallowance}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        OTHER DEDUCTIONS
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.otherdeduction}0.00</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        CONVEYANCE
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.conveyance}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        INCOME TAX
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.incometax}0.00</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        PUNCTUALITY INCENTIVE
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.punctualityincentive}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Typography sx={userStyle.SubHeaderText} >
                                        PROFESSIONAL TAX
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.professionaltax}0.00</Typography>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        ATTENDANCE BONUS
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.attendancebonus}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        OVER TIME
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.overtime}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        OTHER ALLOWANCE
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.otherallowance}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={userStyle.SubHeaderText}>
                                        PERFORMANCE BONUS
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.96} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">
                                    {/* <Input fullWidth disableUnderline={true} /> */}
                                    <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}>{payslip.performancebonus}0.00</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.95} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", marginBottom: "3px", marginLeft: "1px" }}>
                                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px", flexWrap: "wrap", marginBottom: "3px", marginLeft: "2px" }}>
                                <FormControl fullWidth size="small">

                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", border: "0.5px solid black", padding: "5px", marginBottom: "3px" }}>
                                <Grid item md={3} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.SubHeaderText}>
                                            GROSS TOTAL
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3.5} xs={12} >
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end", marginRight: "19px"}}><strong>{payslip.gross}27000.00</strong></Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3.2} xs={12} sm={12}  >
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography sx={userStyle.SubHeaderText}  >
                                            DEDUCTION TOTAL
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3.1} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end"}}><strong>{payslip.deductiontotal}0.00</strong></Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ border: "0.5px solid black", padding: "5px" }}>
                                <Grid item md={6} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.SubHeaderText}>
                                            <strong>NET PAY</strong>
                                        </Typography>
                                    </FormControl>
                                    <FormControl fullWidth size="small">
                                        {/* <Input fullWidth disableUnderline={true} /> */}
                                        <Typography sx={{display: "flex",flexDirection: "row", justifyContent: "flex-end", alignItems: "end",  marginRight: "14px" }}><strong>{payslip.nettotalpay}27000.00</strong></Typography>
                                    </FormControl>
                                </Grid>< br />
                                <Grid item md={4} xs={12} sm={12}  >
                                    <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <Typography sx={userStyle.titletxt} >
                                            {/* ( Rupees ninety-six thousand two hundred fifty Only ) */}
                                            {/* <Typography><strong>{payslip.nettotalpay}</strong></Typography> */}
                                            <Typography><strong>(Twenty Seven Thousand Only){numberToWords(payslip.nettotalpay)}</strong></Typography>
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <br />
                                {/* <Grid item md={3} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.SubHeaderText} >
                                            {/* No .of days leave : <strong>0</strong> 
                                            {/* No .of days leave : <strong>{payslip.noofdays}</strong> 
                                            No .of days leave : <strong>{payslip.numberofdays}</strong>

                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.SubHeaderText} >
                                            {/* Leave Balance : <strong>12</strong> 
                                            Leave Balance : <strong>{payslip.remainingdaysleave}</strong>

                                        </Typography>
                                    </FormControl>
                                </Grid> */}
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

export default PayslipTemplateTwo;
