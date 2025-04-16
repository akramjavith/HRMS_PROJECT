import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Checkbox, List, ListItem, Popover, ListItemText, TableCell, TextField, IconButton, TableRow, Dialog, DialogContent, Select, MenuItem, DialogActions, FormControl, Grid, TextareaAutosize, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { CircularProgress, Backdrop } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import EmployeeActionLoginStatus from "./EmployeeActionLoginStatus";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import EmployeeLoginUnmatchedData from "./EmployeeLoginUnmatchedData";

const EmployeeLoginStatus = () => {

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
                rowDataTable.map((item, index) => {
                    return {
                        "S.No": index + 1,
                        "Employee Code": item.empcode,
                        "Company Name": item.companyname,
                        "Login Name": item.userloginname,
                        Company: item.company,
                        Branch: item.branch,
                        Unit: item.unit,
                        Team: item.team,
                        Designation: item.designation,
                        Department: item.department,
                        MacAddress: item.macaddress,
                        LocalIP: item.localip,
                        UserName: item.username,
                        "System Name": item.hostname,
                        Matched: item.matched,
                        "Work Station": item.workstation,
                        "Matched Status": item.matchedstatus,
                        Version: item.version,
                        Date: item?.date,
                        Count: item.count,
                        Status: item?.username ? "Active" : "InActive",

                    };
                }),
                fileName
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items?.map((item, index) => ({
                    "S.No": index + 1,
                    "Employee Code": item.empcode,
                    "Company Name": item.companyname,
                    "Login Name": item.userloginname,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    Designation: item.designation,
                    Department: item.department,
                    MacAddress: item.macaddress,
                    LocalIP: item.localip,
                    UserName: item.username,
                    "System Name": item.hostname,
                    Matched: item.matched,
                    "Work Station": item.workstation,
                    "Matched Status": item.matchedstatus,
                    Version: item.version,
                    Date: item?.date,
                    Count: item.count,
                    Status: item?.username ? "Active" : "InActive",

                })),
                fileName
            );
        }
        setIsFilterOpen(false);
    };

    const { auth } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState([]);
    const [loginStatusUpdate, setLoginStatusUpdate] = useState([]);
    const [idLoginStatus, setIdLoginStatus] = useState({});
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [isBranch, setIsBranch] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "EmployeeLoginStatus.png");
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
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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

    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
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

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.orginalid)) {
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
        company: true,
        branch: true,
        unit: true,
        team: true,
        username: true,
        empcode: true,
        companyname: true,
        userloginname: true,
        macaddress: true,
        matched: true,
        matchedstatus: true,
        workstation: true,
        localip: true,
        date: true,
        hostname: true,
        department: true,
        designation: true,
        status: true,
        count: true,
        version: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // get all loginStatus
    const fetchBranch = async () => {
        try {
            let res_branch = await axios.get(SERVICE.USER_LOGIN_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const transformData = (data) => {
                const transformedArray = [];
                data?.forEach((item) => {
                    const getwithoutmacstatus = item.loginUserStatus.filter((status , index) => status.macaddress != "none");
                    const getSecondaryworkStationLength = item.loginUserStatus.filter((status) => status?.matched === "Secondary WorkStation");
                    let seconCount = 2;
                    if (item.loginUserStatus && getwithoutmacstatus.length > 0 && item.employeecount !== "0") {
                        const matchedWorkStations = new Set(); // Track matched workstations
                        getwithoutmacstatus.forEach((status) => {   

                            if (status?.matchedstatus === "Matched") {
                                const newItem = {
                                    _id: item?._id,
                                    branch: item.branch,
                                    companyname: item.companyname,
                                    empcode: item.empcode,
                                    designation: item.designation,
                                    company: item.company,
                                    username: item?.username,
                                    unit: item.unit,
                                    team: item.team,
                                    department: item.department,
                                    loginUserStatus: status,
                                    matched: status?.matched,
                                    matchedstatus: status?.matchedstatus,
                                    workstation: status?.workstation,
                                    count : status?.matched === "Work From Home" ? getSecondaryworkStationLength?.length > 0 ? 
                                    getSecondaryworkStationLength?.length + 2 : 3 : status?.matched === "Secondary WorkStation" ? seconCount++ : status.count,
                                    version: status.version,
                                    date: status.createdAt ? moment(status.createdAt).format("DD-MM-YYYY hh:mm:ss a") : ""
                                };
                                transformedArray.push(newItem);
                            }
                        });
                        seconCount = 2;
                    }
                });
                return transformedArray;
            };

            const transformedData = transformData(res_branch?.data?.users);
            console.log(transformedData,'transformedData')
            setLoginStatus(transformedData);
            setIsBranch(true);
        } catch (err) { setIsBranch(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //  PDF
    const columns = [
        { title: "Employee Code", field: "empcode" },
        { title: "Company Name", field: "companyname" },
        { title: "Login Name", field: "userloginname" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Designation", field: "designation" },
        { title: "Department", field: "department" },
        { title: "MacAddress", field: "macaddress" },
        { title: "Local IP", field: "localip" },
        { title: "UserName", field: "username" },
        { title: "SystemName", field: "hostname" },
        { title: "Version", field: "version" },
        { titel: "Date", field: "date" },
        { title: "Count", field: "count" },
        { title: "Work Station", field: "workstation" },
        { title: "Matched", field: "matched" },
        { title: "Matched Status", field: "matchedstatus" },
        { title: "Status", field: "status" },

    ];


    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Modify columns to include serial number column
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
                        empcode: item.empcode,
                        companyname: item.companyname,
                        userloginname: item.userloginname,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        designation: item.designation,
                        department: item.department,
                        macaddress: item.macaddress,
                        localip: item.localip,
                        username: item.username,
                        hostname: item.hostname,
                        version: item.version,
                        count: item.count,
                        matched: item.matched,
                        workstation: item.workstation,
                        matchedstatus: item.matchedstatus,
                        status: item?.username ? "Active" : "InActive",
                        date: item.date
                    };
                })
                : items?.map((item, index) => ({
                    serialNumber: index + 1,
                    empcode: item.empcode,
                    companyname: item.companyname,
                    company: item.company,
                    userloginname: item.userloginname,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    designation: item.designation,
                    department: item.department,
                    macaddress: item.macaddress,
                    localip: item.localip,
                    username: item.username,
                    hostname: item.hostname,
                    version: item.version,
                    count: item.count,
                    matched: item.matched,
                    workstation: item.workstation,
                    matchedstatus: item.matchedstatus,
                    status: item?.username ? "Active" : "InActive",
                    date: item.date
                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: "4", cellWidth: "auto" },
        });

        doc.save("EmployeeLoginStatus.pdf");
    };

    // Excel
    const fileName = "EmployeeLoginStatus";
    let excelno = 1;

    const getCode = async (e, name) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setIdLoginStatus(res.data?.suser)
            if (res.data?.suser?.loginUserStatus?.length > 0) {
                const ans = res.data?.suser?.loginUserStatus?.filter(data => data._id !== name?.addressid)
                setLoginStatusUpdate(ans)
                handleClickOpendel();

            } else {
                console.log('No Reset')
            }

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let branchid = idLoginStatus?._id;
    const delBranch = async () => {
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${branchid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                loginUserStatus: loginStatusUpdate

            });
            await fetchBranch();
            setPage(1);
            setSelectedRows([]);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Successfully Resetted"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchBranch();
    }, []);


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "EmployeeLoginStatus",
        pageStyle: "print",
    });

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = loginStatus?.map((item, index) => ({
            ...item, serialNumber: index + 1,

            id: item._id,
            empcode: item.empcode,
            companyname: item.companyname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            userloginname: item?.username,
            designation: item.designation,
            department: item.department,
            matched: item.matched,
            matchedstatus: item.matchedstatus,
            workstation: item.workstation,
            macaddress: item?.loginUserStatus?.macaddress,
            localip: item?.loginUserStatus?.localip,
            status: item?.loginUserStatus?.status,
            username: item?.loginUserStatus?.username,
            hostname: item?.loginUserStatus?.hostname,
            Version: item?.loginUserStatus?.version,
            count: item?.count,
            addressid: item?.loginUserStatus?._id,
            date: item?.loginUserStatus?.createdAt ? moment(item?.loginUserStatus?.createdAt).format("DD-MM-YYYY hh:mm:ss a") : ""
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [loginStatus]);

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

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);


    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

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
                            const allRowIds = rowDataTable.map((row) => row.orginalid);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.orginalid)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.orginalid)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.orginalid);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.orginalid];
                        }

                        setSelectedRows(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 160, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "companyname", headerName: "Employee Name", flex: 0, width: 100, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        { field: "userloginname", headerName: "Login Name", flex: 0, width: 100, hide: !columnVisibility.userloginname, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "designation", headerName: "Designation", flex: 0, width: 150, hide: !columnVisibility.designation, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 100, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "macaddress", headerName: "Mac Address", flex: 0, width: 175, hide: !columnVisibility.macaddress, headerClassName: "bold-header" },
        { field: "localip", headerName: "Local Ip", flex: 0, width: 175, hide: !columnVisibility.localip, headerClassName: "bold-header" },
        { field: "username", headerName: "UserName", flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: "bold-header" },
        { field: "hostname", headerName: "SystemName", flex: 0, width: 150, hide: !columnVisibility.hostname, headerClassName: "bold-header" },
        {
            field: "matched", headerName: "Matched", flex: 0, width: 200, hide: !columnVisibility.matched, headerClassName: "bold-header"
            , renderCell: (params) => {
                const colorName = params.row.matched === "Primary WorkStation" ? 'Blue' :
                    params.row.status === "Secondary WorkStation" ? 'Green' :
                        params.row.status === "Work From Home" ? 'Red' :
                            "Orange";
                return (
                    <Typography sx={{ color: colorName }}>{params.row.matched}</Typography>
                );
            },
        },
        { field: "workstation", headerName: "Work Station", flex: 0, width: 200, hide: !columnVisibility.workstation, headerClassName: "bold-header" },
        { field: "matchedstatus", headerName: "Matched Status", flex: 0, width: 200, hide: !columnVisibility.matchedstatus, headerClassName: "bold-header" },
        { field: "version", headerName: "Version", flex: 0, width: 200, hide: !columnVisibility.version, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 200, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "count", headerName: "Count", flex: 0, width: 100, hide: !columnVisibility.count, headerClassName: "bold-header" },
        {
            field: "status", headerName: "Status", flex: 0, width: 100, hide: !columnVisibility.status, headerClassName: "bold-header",
            renderCell: (params) => {
                return (
                    <Grid>
                        <Button size="small"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontWeight: '500',
                                display: 'flex',
                                color: 'white',
                                backgroundColor: params.row.status === 'Active' ? 'green' : 'red',
                                '&:hover': {
                                    backgroundColor: params.row.status === 'Active' ? 'green' : 'red',
                                }
                            }}
                        >
                            {params.row.status}
                        </Button>
                    </Grid >
                );
            },
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eemployeeloginstatus") && (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {

                                getCode(params.row.orginalid, params.row);
                            }}
                        >
                            Reset
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: index + 1,
            orginalid: item.id,
            serialNumber: item.serialNumber,
            empcode: item.empcode,
            companyname: item.companyname,
            userloginname: item.userloginname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            username: item.username,
            designation: item.designation,
            department: item.department,
            macaddress: item.macaddress,
            localip: item.localip,
            hostname: item.hostname,
            version: item.version,
            status: item?.username ? "Active" : "InActive",
            count: item.count,
            addressid: item.addressid,
            date: item.date,
            workstation: item.workstation,
            matched: item.matched,
            matchedstatus: item.matchedstatus,

        };
    });


    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.orginalid),
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
                            // secondary={column.headerName }
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


    return (
        <>
            <Headtitle title={"EMPLOYEE LOGIN STATUS"} />
            <Typography sx={userStyle.HeaderText}>Employee Login Status</Typography>
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lemployeeloginstatus") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Employee Login Status List </Typography>
                        </Grid>
                        <br />
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
                                        {/* <MenuItem value={loginStatus?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelemployeeloginstatus") && (
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
                                    {isUserRoleCompare?.includes("csvemployeeloginstatus") && (
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
                                    {isUserRoleCompare?.includes("printemployeeloginstatus") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeeloginstatus") && (
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
                                    {isUserRoleCompare?.includes("imageemployeeloginstatus") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {/* {isUserRoleCompare?.includes("bdbranch") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )} */}
                        <br />
                        <br />
                        {!isBranch ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
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
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
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
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            <br />
            <br />
            <br />
            <EmployeeLoginUnmatchedData/>
            <br />
            <br />
            <br />
            <EmployeeActionLoginStatus />
            {/* ****** Table End ****** */}
            {/* Delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isDeleteOpen} onClose={handleCloseDel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                                    Are you sure you want to Reset?
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        delBranch(branchid);
                                        handleCloseDel();
                                    }}
                                    autoFocus
                                    variant="contained"
                                    color="error"
                                >
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
                {/* ALERT DIALOG */}
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

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>SI.NO</TableCell>
                            <TableCell>Employee Code</TableCell>
                            <TableCell>Employee Name </TableCell>
                            <TableCell>Login Name </TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Mac Address</TableCell>
                            <TableCell>Local IP</TableCell>
                            <TableCell>UserName</TableCell>
                            <TableCell>SystemName</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Work Station</TableCell>
                            <TableCell>Matched</TableCell>
                            <TableCell>Matched Status</TableCell>
                            <TableCell>Status</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.empcode} </TableCell>
                                    <TableCell>{row.companyname} </TableCell>
                                    <TableCell>{row.userloginname} </TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team} </TableCell>
                                    <TableCell>{row.designation}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.macaddress}</TableCell>
                                    <TableCell>{row.localip}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.hostname}</TableCell>
                                    <TableCell>{row.version}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.workstation}</TableCell>
                                    <TableCell>{row.matched}</TableCell>
                                    <TableCell>{row?.matchedstatus}</TableCell>
                                    <TableCell>{row?.username ? "Active" : "InActive"}</TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        {isLoading ? (
                            <>
                                <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            </>
                        ) : (
                            <>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        style={{
                                            padding: "7px 13px",
                                            color: "white",
                                            background: "rgb(25, 118, 210)",
                                        }}
                                        onClick={() => {

                                            handleCloseerrpop();
                                        }}
                                    >
                                        ok
                                    </Button>
                                </Grid>
                            </>
                        )}
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
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
        </>
    );
};

export default EmployeeLoginStatus;