import React, { useState, useEffect, useRef, useContext } from "react";
import {
    TextField,
    IconButton,
    ListItem,
    List,
    ListItemText,
    Popover,
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Table,
    Checkbox,
    TableHead,
    TableContainer,
    Button,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function ActionEmployeePassword({

    vendorAuto,
    fetchUnAssignedIP,
    twoTable,
    setTwotable,
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable.map((item, index) => ({
                    "S.No": index + 1,
                    // FirewallStatus: item?.firewallstatus,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    Type: item.type,
                    "Employee Name": item.employeename,
                    Category: item.category,
                    Subcategory: item.subcategory,
                    Username: item.username,
                    "Temp Password": item.temppassword,
                    "Live Password": item.livepassword,
                })),
                fileName
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                documentsList?.map((item, index) => ({
                    "S.No": index + 1,
                    // FirewallStatus: item?.firewallstatus,
                    Company: item.company
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString(),
                    Branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    Unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    Team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    Type: item.type,
                    "Employee Name": item.employeename,
                    Category: item.category,
                    Subcategory: item.subcategory,
                    Username: item.username,
                    "Temp Password": item.temppassword,
                    "Live Password": item.livepassword,
                })),
                fileName
            );
        }

        setIsFilterOpen(false);
    };

    const columns = [
        // { title: "Firewall Status", field: "firewallstatus" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Type", field: "type" },
        { title: "Employee Name", field: "employeename" },
        { title: "Category", field: "category" },
        { title: "Subcategory", field: "subcategory" },
        { title: "Username ", field: "username" },
        { title: "Temp Password ", field: "temppassword" },
        { title: "Live Password", field: "livepassword" },
    ];
    // PDF

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? rowDataTable.map((item, index) => {
                    return {
                        serialNumber: index + 1,
                        // firewallstatus: item?.firewallstatus,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        type: item.type,
                        employeename: item.employeename,
                        category: item.category,
                        subcategory: item.subcategory,
                        username: item.username,
                        temppassword: item.temppassword,
                        livepassword: item.livepassword,
                    };
                })
                : documentsList?.map((item, index) => ({
                    serialNumber: index + 1,
                    // firewallstatus: item?.firewallstatus,
                    company: item.company
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString(),
                    branch: item.branch
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString(),
                    unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    type: item.type,
                    employeename: item.employeename,
                    category: item.category,
                    subcategory: item.subcategory,
                    username: item.username,
                    temppassword: item.temppassword,
                    livepassword: item.livepassword,
                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("Action List Password.pdf");
    };

    const gridRef = useRef(null);
    const [documentsList, setDocumentsList] = useState([]);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [singleDoc, setSingleDoc] = useState({});
    const { auth } = useContext(AuthContext);
    //Datatable
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openInfo, setOpeninfo] = useState(false);
    const [oldIpId, setOldIpId] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [viewInfo, setViewInfo] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDeleteIP, setOpenDeleteIP] = useState(false);
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        type: true,
        employeename: true,
        category: true,
        subcategory: true,
        username: true,
        temppassword: true,
        livepassword: true,
        firewallstatus: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    //useEffect
    useEffect(() => {
        fetchAllApproveds();
    }, [vendorAuto]);
    useEffect(() => {
        fetchAllApproveds();
    }, [twoTable]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
   
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Action List Password.png");
                });
            });
        }
    };
    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
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
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    //delete model
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    //delete model IP
    const handleClickOpenIP = () => {
        setOpenDeleteIP(true);
    };
    const handleCloseDeleteIP = () => {
        setOpenDeleteIP(false);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //get all project.
    const fetchAllApproveds = async () => {
        try {
            let res_queue = await axios.get(SERVICE.PASSWORD_ACTION_EMPLOYEE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentsList(res_queue?.data?.pass);
            setLoading(true);
        } catch (err) { setLoading(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    //Project updateby edit page...
    let updateby = viewInfo.updatedby;
    let addedby = viewInfo.addedby;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Excel
    const fileName = "Action List Password";

    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_PASSWORD}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res?.data?.spass);
            setViewInfo(res?.data?.spass);
            setOldIpId(res?.data?.spass?.assignedipid);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

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

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const delVendorcheckbox = async () => {
        setTwotable("mmmmmmmmmm");
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_PASSWORD}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setTwotable("fghdfghdfgdfjhgjghjhgj");
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchAllApproveds();fetchUnAssignedIP();
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "green" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Deleted Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const getviewCode = async (e) => {
        setTwotable("lllksdfjkblknhyyyyyy");
        try {
            let res = await axios.delete(
                `${SERVICE.SINGLE_PASSWORD}/${singleDoc._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            handleCloseDelete();
            if (singleDoc.type === "IP") {
                await unAssignOldIp(singleDoc.assignedipid);
                handleCloseDeleteIP();
            }

            setTwotable("kjhkjgsdfgsfasdfb");
            await fetchAllApproveds();fetchUnAssignedIP();
            setShowAlert(
                <>
                    {" "}
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "green" }}
                    />{" "}
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" "}
                        {"Deleted Successfully👍"}{" "}
                    </p>{" "}
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const unAssignOldIp = async (e) => {
        try {
            let subprojectscreate = await axios.post(SERVICE.IPMASTER_UPDATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                updatevalue: e,
                status: "unassigned",
            });
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Action  List Password",
        pageStyle: "print",
    });

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
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
    const filteredDatas = documentsList?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
        );
    });
    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold",
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
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
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredData.length
                        );
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 80,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.company,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.branch,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.unit,
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.team,
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.type,
        },
        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.employeename,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.category,
        },
        {
            field: "subcategory",
            headerName: " SubCategory",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.subcategory,
        },
        {
            field: "username",
            headerName: "Username",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.username,
        },
        {
            field: "temppassword",
            headerName: "Temp Password",
            flex: 0,
            width: 130,
            minHeight: "40px",
            hide: !columnVisibility.temppassword,
        },
        {
            field: "livepassword",
            headerName: "Live Password",
            flex: 0,
            width: 130,
            minHeight: "40px",
            hide: !columnVisibility.livepassword,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            sortable: false,
            hide: !columnVisibility.actions,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("epassword") && (
                        <Link
                            to={`/editpassword/${params.row.id}`}
                            style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
                        >
                            <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                                <EditOutlinedIcon style={{ fontSize: "large" }} />
                            </Button>
                        </Link>
                    )}
                    {isUserRoleCompare?.includes("dpassword") && (
                        <>
                            {params.row.type === "IP" ? (
                                <Button
                                    sx={userStyle.buttondelete}
                                    onClick={(e) => {
                                        getinfoCode(params.row.id);
                                        handleClickOpenIP();
                                    }}
                                >
                                    <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                                </Button>
                            ) : (
                                <Button
                                    sx={userStyle.buttondelete}
                                    onClick={(e) => {
                                        getinfoCode(params.row.id);
                                        handleClickOpen();
                                    }}
                                >
                                    <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                                </Button>
                            )}
                        </>
                    )}
                    {isUserRoleCompare?.includes("vpassword") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={(e) => {
                                getinfoCode(params.row.id);
                                handleViewOpen();
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipassword") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredData.map((item) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
            type: item.type,
            employeename: item.employeename,
            category: item.category,
            subcategory: item.subcategory,
            username: item.username,
            temppassword: item.temppassword,
            livepassword: item.livepassword,
            firewallstatus: item?.firewallstatus,
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
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
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
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-10px" }}
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={column.headerName}
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
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility({})}
                        >
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
    return (
        <Box>

            <>
                {isUserRoleCompare?.includes("lpassword") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Action  List Password
                                    </Typography>
                                </Grid>
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
                                <Grid>
                                    {isUserRoleCompare?.includes("excelpassword") && (
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
                                    {isUserRoleCompare?.includes("csvpassword") && (
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
                                    {isUserRoleCompare?.includes("printpassword") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpassword") && (
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
                                    {isUserRoleCompare?.includes("imagepassword") && (
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
                                </Grid>
                            </Grid>
                            <br />
                            {/* ****** Table Grid Container ****** */}
                            <Grid style={userStyle.dataTablestyle}>
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
                                        {/* <MenuItem value={documentsList?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                                <Box>
                                    <FormControl fullWidth size="small">
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
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>
                            &emsp;
                            {isUserRoleCompare?.includes("bdpassword") && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ textTransform: "capitalize" }}
                                    onClick={handleClickOpenalert}
                                >
                                    Bulk Delete
                                </Button>
                            )}
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
                            {!loading ? (
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
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <StyledDataGrid
                                        rows={rowsWithCheckboxes}
                                        density="compact"
                                        columns={columnDataTable.filter(
                                            (column) => columnVisibility[column.field]
                                        )}
                                        autoHeight={true}
                                        hideFooter
                                        ref={gridRef}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                            )}
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
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table
                                aria-label="customized table"
                                id="jobopening"
                                ref={componentRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell>SNo</StyledTableCell>
                                        {/* <StyledTableCell>Firewall Status</StyledTableCell> */}
                                        <StyledTableCell>Company</StyledTableCell>
                                        <StyledTableCell>Branch</StyledTableCell>
                                        <StyledTableCell>Unit</StyledTableCell>
                                        <StyledTableCell>Team</StyledTableCell>
                                        <StyledTableCell>Type</StyledTableCell>
                                        <StyledTableCell>Employee Name</StyledTableCell>
                                        <StyledTableCell>Category </StyledTableCell>
                                        <StyledTableCell>Sub Category </StyledTableCell>
                                        <StyledTableCell>Username</StyledTableCell>
                                        <StyledTableCell>Temp Password</StyledTableCell>
                                        <StyledTableCell>Live Password</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {rowDataTable?.length > 0 ? (
                                        rowDataTable?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                {/* <StyledTableCell>{row.firewallstatus}</StyledTableCell> */}
                                                <StyledTableCell>{row.company}</StyledTableCell>
                                                <StyledTableCell>{row.branch}</StyledTableCell>
                                                <StyledTableCell>{row.unit}</StyledTableCell>
                                                <StyledTableCell>{row.team}</StyledTableCell>
                                                <StyledTableCell>{row.type}</StyledTableCell>
                                                <StyledTableCell>{row.employeename}</StyledTableCell>
                                                <StyledTableCell>{row.category}</StyledTableCell>
                                                <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                <StyledTableCell>{row.username}</StyledTableCell>
                                                <StyledTableCell>{row.temppassword}</StyledTableCell>
                                                <StyledTableCell>{row.livepassword}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            {" "}
                                            <StyledTableCell colSpan={7} align="center">
                                                No Data Available
                                            </StyledTableCell>{" "}
                                        </StyledTableRow>
                                    )}
                                    <StyledTableRow></StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                    </>
                )}
            </>
            {/* this is info view details */}
            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            Action  List Password Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Delete modal */}
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => getviewCode()}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Delete Model for IP */}
            <Dialog
                open={openDeleteIP}
                onClose={handleCloseDeleteIP}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure this data IP is assigned? Do you want to delete it?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteIP} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => getviewCode()}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            <br />
            <br />
            {/* view model */}
            <Dialog
                open={openView}
                onClose={handlViewClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Action  List Password
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>
                                        {singleDoc.company
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>
                                        {singleDoc.branch
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    <Typography>
                                        {singleDoc.unit
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Team</Typography>
                                    <Typography>
                                        {singleDoc.team
                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                            .toString()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Type</Typography>
                                    <Typography>{singleDoc.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Name</Typography>
                                    <Typography>{singleDoc.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{singleDoc.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> SubCategory</Typography>
                                    <Typography>{singleDoc.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> IP Sec Secret Password</Typography>
                                    <Typography>{singleDoc.ipsecsecretpassword}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Username</Typography>
                                    <Typography>{singleDoc.username}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Temp Password</Typography>
                                    <Typography>{singleDoc.temppassword}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Live Password</Typography>
                                    <Typography>{singleDoc.livepassword}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlViewClose}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
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
                            {" "}
                            ok{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "70px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseModalert}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delVendorcheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {fileFormat === "csv" ? (
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                    ) : (
                        <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                    )}
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");
                            // fetchProductionClientRateArray();
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default ActionEmployeePassword;
