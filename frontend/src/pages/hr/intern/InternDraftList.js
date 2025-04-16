import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, TableRow, TableCell, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, FormControl, Paper, Table, TableHead, TableContainer, Button, TableBody, List, ListItem, ListItemText, Popover, TextField, IconButton, Checkbox } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import jsPDF from "jspdf";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ThreeDots } from "react-loader-spinner";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import * as FileSaver from 'file-saver'; 
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { styles } from "@material-ui/pickers/views/Calendar/Calendar";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
function InternDraftList() {
    const [employees, setEmployees] = useState([]);
    const [deleteuser, setDeleteuser] = useState([]);
    const [exceldata, setexceldata] = useState([]);
    const [useredit, setUseredit] = useState([]);

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [checkemployeelist, setcheckemployeelist] = useState(false);
    const { auth } = useContext(AuthContext);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Draft List.png");
                });
            });
        }
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
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

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // State for manage columns search query
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);

    const gridRef = useRef(null);

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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        serialNumber: true,
        status: true,
        percentage: true,
        empcode: true,
        companyname: true,
        username: true,
        email: true,
        branch: true,
        unit: true,
        team: true,
        shift: true,
        experience: true,
        doj: true,
        expmode: true,
        expval: true,
        endexp: true,
        endexpdate: true,
        endtar: true,
        endtardate: true,
        checkbox: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    let userid = deleteuser?._id;

    //set function to get particular row
    const [checkProject, setCheckProject] = useState();
    const [checkTask, setCheckTask] = useState();

    const rowData = async (id, username) => {
        try {
            let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteuser(res?.data?.sdraft);
            let resdev = await axios.post(SERVICE.USERPROJECTCHECK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                checkprojectouser: String(username),
            });
            setCheckProject(resdev?.data?.projects);

            let restask = await axios.post(SERVICE.USERTTASKCHECK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                checkusertotask: String(username),
            });
            setCheckTask(restask?.data?.tasks);

            if ((resdev?.data?.projects)?.length > 0 || (restask?.data?.tasks)?.length > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpendel();
            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    let userId = localStorage?.LoginUserId;

    //get all employees list details
    const fetchEmployee = async () => {
        try {
            let res_employee = await axios.get(SERVICE.DRAFT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setcheckemployeelist(true);
            let filteredDatas = res_employee?.data?.drafts.filter((data) => {
                return data.fromwhere == "Intern"
            })
            setEmployees(filteredDatas);
        } catch (err) {setcheckemployeelist(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [internDraftArray, setInternDraftArray] = useState([])

    //get all employees list details
    const fetchInternDraftArray = async () => {
        try {
            let res_employee = await axios.get(SERVICE.DRAFT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setcheckemployeelist(true);
            let filteredDatas = res_employee?.data?.drafts.filter((data) => {
                return data.fromwhere == "Intern"
            })
            setInternDraftArray(filteredDatas);
        } catch (err) {setcheckemployeelist(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchInternDraftArray()
    }, [isFilterOpen])

    const delAddemployee = async () => {
        try {
            let del = await axios.delete(`${SERVICE.DRAFT_SINGLE}/${userid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUseredit(res?.data?.sdraft);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    let updateby = useredit?.updatedby;
    let addedby = useredit?.addedby;

    //  PDF
    const columns = [
        // { title: "S.No", field: "serialNumber" },
        { title: "Status", field: "status" },
        { title: "Percentage", field: "percentage" },
        { title: "Empcode", field: "empcode" },
        { title: "Employee Name", field: "companyname" },
        { title: "Username", field: "username" },
        { title: "Email", field: "email" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Experience", field: "experience" },
        { title: "Doj", field: "doj" },
        { title: "Mode", field: "expmode" },
        { title: "Value", field: "expval" },
        { title: "End Exp", field: "endexp" },
        { title: "End-Exp Date", field: "endexpdate" },
        { title: "End Tar", field: "endtar" },
        { title: "End-Tar Date", field: "endtardate" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        let serialNumberCounter = 1;

        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            internDraftArray.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                doj: moment(row.doj).format("DD-MM-YYYY")
            }));

        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: "auto"
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Draft List.pdf");
    };

    // Excel

    const getexcelDatas = async () => {
        try {
            let res_employee = await axios.get(SERVICE.USERSEXCELDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            var data =
                res_employee?.data?.users?.length > 0 &&
                res_employee.data.users.map((t, index) => {
                    let lastExpLog = t?.assignExpLog?.length > 0 ? t?.assignExpLog[t?.assignExpLog?.length - 1] : "";
                    return {
                        Sno: index + 1,
                        Empcode: t.empcode,
                        Username: t.username,
                        Firstname: t.firstname,
                        Lastname: t.lastname,
                        Legalname: t.legalname,
                        Fathername: t.fathername,
                        Mothername: t.mothername,
                        Gender: t.gender,
                        maritalstatus: t.maritalstatus,
                        dob: t.dob,
                        bloodgroup: t.bloodgroup,
                        location: t.location,
                        email: t.email,
                        contactpersonal: t.contactpersonal,
                        contactfamily: t.contactfamily,
                        emergencyno: t.emergencyno,
                        doj: t.doj,
                        expmode: lastExpLog ? lastExpLog.expmode : "",
                        expval: lastExpLog ? lastExpLog.expval : "",
                        endexp: lastExpLog ? lastExpLog.endexp : "",
                        endexpdate: lastExpLog ? lastExpLog.endexpdate : "",
                        endtar: lastExpLog ? lastExpLog.endtar : "",
                        endtardate: lastExpLog ? lastExpLog.endtardate : "",

                        contactno: t.contactno,
                        details: t.details,
                        companyname: t.companyname,
                        pdoorno: t.pdoorno,
                        pstreet: t.pstreet,
                        parea: t.parea,
                        plandmark: t.plandmark,
                        ptaluk: t.ptaluk,
                        ppincode: t.ppincode,
                        pcountry: t.pcountry,
                        pstate: t.pstate,
                        pcity: t.pcity,
                        cdoorno: t.cdoorno,
                        cstreet: t.cstreet,
                        carea: t.carea,
                        clandmark: t.clandmark,
                        ctaluk: t.ctaluk,
                        cpost: t.cpost,
                        cpincode: t.cpincode,
                        ccountry: t.ccountry,
                        cstate: t.cstate,
                        ccity: t.ccity,
                        branch: t.branch,
                        floor: t.floor,
                        department: t.department,
                        team: t.team,
                        unit: t.unit,
                        shifttiming: t.shifttiming,
                        reportingto: t.reportingto,
                    };
                });
            setexceldata(data);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Draft Intern List",
        pageStyle: "print",
    });

    useEffect(() => {
        getexcelDatas();
    }, [employees]);

    useEffect(() => {
        fetchEmployee();
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [employees]);

    //table sorting
    const [sorting, setSorting] = useState({ column: "", direction: "" });

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
                        if (rowDataTable?.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }

                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable?.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows?.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows?.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData?.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 90,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 100,
            minHeight: "40px",
            renderCell: (params) => (
                <Typography color={params.row.status == "incomplete" ? "error" : "green"} variant="contained" sx={{ padding: "5px" }}>
                    {params.row.status}
                </Typography>
            ),
            hide: !columnVisibility.status,
        },
        {
            field: "percentage",
            headerName: "Percentage",
            flex: 0,
            width: 120,
            minHeight: "40px",

            hide: !columnVisibility.percentage,
        },
        {
            field: "empcode",
            headerName: "Empcode",
            flex: 0,
            width: 140,
            minHeight: "40px",
            hide: !columnVisibility.empcode,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Empcode!");
                            }}
                            options={{ message: "Copied Empcode!" }}
                            text={params?.row?.empcode}
                        >
                            <ListItemText primary={params?.row?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.companyname,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Employee Name!");
                            }}
                            options={{ message: "Copied Employee Name!" }}
                            text={params?.row?.companyname}
                        >
                            <ListItemText primary={params?.row?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "username",
            headerName: "User Name",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.username,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.email,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.branch,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.unit,
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.team,
        },
        {
            field: "experience",
            headerName: "Experience",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.experience,
        },
        {
            field: "doj",
            headerName: "Doj",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.doj,
        },
        {
            field: "expmode",
            headerName: "Mode",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.expmode,
        },
        {
            field: "expval",
            headerName: "Value",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.expval,
        },
        {
            field: "endexp",
            headerName: "End Exp",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.endexp,
        },
        {
            field: "endexpdate",
            headerName: "End-Exp Date",
            flex: 0,
            width: 110,
            minHeight: "40px",
            hide: !columnVisibility.endexpdate,
        },
        {
            field: "endtar",
            headerName: "End Tar",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.endtardate,
        },
        {
            field: "endtardate",
            headerName: "End-Tar Date",
            flex: 0,
            width: 110,
            minHeight: "40px",
            hide: !columnVisibility.endtardate,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <>
                    {!isUserRoleCompare.includes("Manager") ? (
                        <>
                            <Grid container spacing={2}>
                                <Grid item>
                                    {isUserRoleCompare?.includes("einterndraftlist") && (
                                        <a href={`/interndraft/edit/${params.row.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                            <Button variant="outlined" size="small" style={userStyle.actionbutton}>
                                                <EditIcon style={{ fontSize: "20px" }} />
                                            </Button>
                                        </a>
                                    )}
                                    {isUserRoleCompare?.includes("dinterndraftlist") && (
                                        <Link to="">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                style={userStyle.actionbutton}
                                                onClick={(e) => {
                                                    rowData(params.row.id, params.row.username);
                                                }}
                                            >
                                                <DeleteIcon style={{ fontSize: "20px" }} />
                                            </Button>
                                        </Link>
                                    )}
                                    {isUserRoleCompare?.includes("vinterndraftlist") && (
                                        <a href={`/interndraft/view/${params.row.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>

                                            <Button size="small" variant="outlined" style={userStyle.actionbutton}>
                                                <VisibilityIcon style={{ fontSize: "20px" }} />
                                            </Button>
                                        </a>
                                    )}
                                    {isUserRoleCompare?.includes("iinterndraftlist") && (
                                        <Link to="">
                                            <Button
                                                sx={userStyle.actionbutton}
                                                onClick={() => {
                                                    handleClickOpeninfo();
                                                    getinfoCode(params.row.id);
                                                }}
                                            >
                                                <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                            </Button>
                                        </Link>
                                    )}
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid sx={{ display: "flex" }}>
                                {isUserRoleCompare?.includes("vinterndraftlist") && (
                                    <Link to={`/view/${params.row.id}`} style={{ textDecoration: "none", color: "#fff" }}>
                                        <Button size="small" variant="outlined" style={userStyle.actionbutton}>
                                            <VisibilityIcon style={{ fontSize: "20px" }} />
                                        </Button>
                                    </Link>
                                )}
                            </Grid>
                        </>
                    )}
                </>
            ),
        },
    ];

    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item) => {
        let lastExpLog = item?.assignExpLog?.length > 0 ? item?.assignExpLog[item?.assignExpLog?.length - 1] : "";
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            status: item.status,
            percentage: item.percentage ? Math.round(item.percentage) + "%" : " ",
            empcode: item.empcode,
            nexttime: item.nexttime,
            companyname: item.companyname,
            username: item.username,
            email: item.email,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            shift: item.shift,
            experience: (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 + new Date().getMonth() - new Date(item.doj).getMonth() - (new Date(item.doj).getDate() > 2 || new Date(item.doj).getDate() !== 1 ? 1 : 0) == -1 ? 0 : (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 + new Date().getMonth() - new Date(item.doj).getMonth() - (new Date(item.doj).getDate() > 2 || new Date(item.doj).getDate() !== 1 ? 1 : 0),
            doj: moment(item.doj).format("DD-MM-YYYY"),
            expmode: lastExpLog ? lastExpLog.expmode : "",
            expval: lastExpLog ? lastExpLog.expval : "",
            endexp: lastExpLog ? lastExpLog.endexp : "",
            endexpdate: lastExpLog ? lastExpLog.endexpdate : "",
            endtar: lastExpLog ? lastExpLog.endtar : "",
            endtardate: lastExpLog ? lastExpLog.endtardate : "",
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

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable?.filter((column) => column?.headerName?.toLowerCase()?.includes(searchQueryManage?.toLowerCase()));

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
                    {filteredColumns?.map((column) => (
                        <ListItem key={column?.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column?.field]} onChange={() => toggleColumnVisibility(column?.field)} />} secondary={column?.headerName} />
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


    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName = "Draft List") => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const fileName = "Draft List";


    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    "Sno": index + 1,
                    status: t.status,
                    percentage: t.percentage,
                    empcode: t.empcode,
                    companyname: t.companyname,
                    username: t.username,
                    email: t.email,
                    branch: t.branch,
                    unit: t.unit,
                    team: t.team,
                    experience: t.experience,
                    doj: t.doj,
                    expmode: t.expmode,
                    expval: t.expval,
                    endexp: t.endexp,
                    endexpdate: t.endexpdate,
                    endtar: t.endtar,
                    endtardate: t.endtardate,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                internDraftArray.map((t, index) => {

                    let lastExpLog = t?.assignExpLog?.length > 0 ? t?.assignExpLog[t?.assignExpLog?.length - 1] : "";

                    return {
                        "Sno": index + 1,
                        status: t.status,
                        percentage: t.percentage ? Math.round(t.percentage) + "%" : " ",
                        empcode: t.empcode,
                        companyname: t.companyname,
                        username: t.username,
                        email: t.email,
                        branch: t.branch,
                        unit: t.unit,
                        team: t.team,
                        experience: (new Date().getFullYear() - new Date(t.doj).getFullYear()) * 12 + new Date().getMonth() - new Date(t.doj).getMonth() - (new Date(t.doj).getDate() > 2 || new Date(t.doj).getDate() !== 1 ? 1 : 0) == -1 ? 0 : (new Date().getFullYear() - new Date(t.doj).getFullYear()) * 12 + new Date().getMonth() - new Date(t.doj).getMonth() - (new Date(t.doj).getDate() > 2 || new Date(t.doj).getDate() !== 1 ? 1 : 0),
                        doj: moment(t.doj).format("DD-MM-YYYY"),
                        expmode: lastExpLog ? lastExpLog.expmode : "",
                        expval: lastExpLog ? lastExpLog.expval : "",
                        endexp: lastExpLog ? lastExpLog.endexp : "",
                        endexpdate: lastExpLog ? lastExpLog.endexpdate : "",
                        endtar: lastExpLog ? lastExpLog.endtar : "",
                        endtardate: lastExpLog ? lastExpLog.endtardate : "",
                    }

                }), fileName);

        }

        setIsFilterOpen(false)
    };

    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"INTERN DRAFT LIST"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Draft Intern Details</Typography>
            <br />
            {isUserRoleCompare?.includes("linterndraftlist") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.SubHeaderText}>Draft Intern List</Typography>
                            </Grid>
                            {/* <Grid item xs={4}>
                                        {isUserRoleCompare?.includes("adraftlist") && (
                                        <>
                                            <Link
                                            to="/addemployee"
                                            style={{
                                                textDecoration: "none",
                                                color: "white",
                                                float: "right",
                                            }}
                                            >
                                            <Button variant="contained">ADD</Button>
                                            </Link>
                                        </>
                                        )}
                                    </Grid> */}
                        </Grid>
                        <br />
                        <br />
                        <Box>
                            {checkemployeelist ? (
                                <>
                                    <Grid container sx={{ justifyContent: "center" }}>
                                        <Grid>
                                            {isUserRoleCompare?.includes("excelinterndraftlist") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        fetchInternDraftArray()
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvinterndraftlist") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        fetchInternDraftArray()
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printinterndraftlist") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfinterndraftlist") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen(true)
                                                            fetchInternDraftArray()
                                                        }}
                                                    >
                                                        <FaFilePdf />
                                                        &ensp;Export to PDF&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageinterndraftlist") && (
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <br />

                                    <Grid style={userStyle.dataTablestyle}>
                                        <Box>
                                            <label htmlFor="pageSizeSelect">Show entries:</label>
                                            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                                {/* <MenuItem value={employees?.length}>All</MenuItem> */}
                                            </Select>
                                        </Box>
                                        <Box>
                                            <FormControl fullWidth size="small">
                                                <Typography>Search</Typography>
                                                <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <br />
                                    <Grid container spacing={1}>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "left",
                                                    flexWrap: "wrap",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                                    Show All Columns
                                                </Button>
                                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                                    Manage Columns
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                                    <br />
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
                            ) : (
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            )}
                        </Box>
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

            {/* ****** Table End ****** */}

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseDel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                delAddemployee(userid);
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

            <Box>
                <Dialog
                    // open={isErrorOpen}
                    // onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6"></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error">
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Check Modal */}
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
                                    {checkProject?.length > 0 && checkTask?.length > 0 ? (
                                        <>
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteuser?.username} `}</span>
                                            was linked in <span style={{ fontWeight: "700" }}>Project & Task</span>{" "}
                                        </>
                                    ) : checkProject?.length > 0 ? (
                                        <>
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteuser?.username} `}</span> was linked in <span style={{ fontWeight: "700" }}>Project</span>
                                        </>
                                    ) : checkTask?.length > 0 ? (
                                        <>
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteuser?.username} `}</span> was linked in <span style={{ fontWeight: "700" }}>Task</span>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>SI.NO</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Empcode</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Doj</TableCell>
                            <TableCell>Exp Mode</TableCell>
                            <TableCell>Exp Value</TableCell>
                            <TableCell>End Exp</TableCell>
                            <TableCell>End Exp Date</TableCell>
                            <TableCell>End Tar</TableCell>
                            <TableCell>End Tar Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <StyledTableCell>{row.status} </StyledTableCell>
                                    {/* <TableCell> {row.firstname + " " + row.lastname}</TableCell> */}
                                    <TableCell> {row.percentage}</TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{row.companyname}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.experience}</TableCell>
                                    <TableCell>{row.doj}</TableCell>
                                    <TableCell>{row.expmode}</TableCell>
                                    <TableCell>{row.expval}</TableCell>
                                    <TableCell>{row.endexp}</TableCell>
                                    <TableCell>{row.endexpdate}</TableCell>
                                    <TableCell>{row.endtar}</TableCell>
                                    <TableCell>{row.endtardate}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* //info view */}
            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Draft Details Info</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
            {/*Export XL Data  */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

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

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                            fetchInternDraftArray()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
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
        </Box>
    );
}

export default InternDraftList;