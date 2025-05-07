import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
import { Backdrop, Box, Button, Checkbox, Chip, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext, } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

const LoadingBackdrop = ({ open }) => {
    return (
        <Backdrop
            sx={{
                color: "#fff",
                position: "fixed", // Changed to absolute
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: (theme) => theme.zIndex.drawer + 1000,
            }}
            open={open}
        >
            <div className="pulsating-circle">
                <CircularProgress color="inherit" className="loading-spinner" />
            </div>
            <Typography
                variant="h6"
                sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
            >
                Loading, please wait...
            </Typography>
        </Backdrop>
    );
};

function EmployeeFacilityReport() {
    // Copied fields Name

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };
    const [isLoading, setIsLoading] = useState(false);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setFilterLoader(false);
        setTableLoader(false);
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
    const [employees, setEmployees] = useState([]);
    const [employeesExcel, setEmployeesExcel] = useState([]);
    const [deleteuser, setDeleteuser] = useState([]);
    const [useredit, setUseredit] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        allTeam,
        pageName,
        setPageName,
        buttonStyles,
        allUsersData,
        allUsersLimit
    } = useContext(UserRoleAccessContext);
    const [checkemployeelist, setcheckemployeelist] = useState(false);
    const { auth } = useContext(AuthContext);

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];
                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    // Work mode Options
    const workModeOpt = [
        { label: "Remote", value: "Remote" },
        { label: "Office", value: "Office" },
    ];

    const [selectedOptionsWorkmode, setSelectedOptionsWorkmode] = useState([]);
    let [valueWorkmode, setValueWorkmode] = useState("");

    const handleWorkmodeChange = (options) => {
        setValueWorkmode(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsWorkmode(options);
    };

    const customValueRendererWorkmode = (valueWorkmode, _workmodes) => {
        return valueWorkmode.length ? valueWorkmode.map(({ label }) => label).join(", ") : "Please Select Work Mode";
    };



    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Employee Facility Report.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
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

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Employee Facility Report"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    // page refersh reload code
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        serialNumber: true,
        empcode: true,
        companyname: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        designation: true,
        workmode: true,
        workmode: true,
        workstation: true,
        workstationinput: true,
        checkbox: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    let userid = deleteuser?._id;

    const rowData = async (id, username) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });



            handleClickOpendel();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delAddemployee = async () => {
        setPageName(!pageName);
        try {
            let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchListData();
            setPage(1);
            handleCloseDel();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUseredit(res?.data?.suser);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    let updateby = useredit?.updatedby;
    let addedby = useredit?.addedby;
    //------------------------------------------------------
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
        setIsLoading(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [fileFormat, setFormat] = useState("xl");
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportColumnNames = [
        "SNo",
        "Empcode",
        "Employee Name",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Department",
        "Designation",
        "Work Mode",
        "Work Station",
        "Remote Workstation",
    ];
    const exportRowValues = [
        "serialNumber",
        "empcode",
        "companyname",
        "company",
        "branch",
        "unit",
        "team",
        "department",
        "designation",
        "workmode",
        "workstation",
        "workstationinput",
    ];
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Employeelist",
        pageStyle: "print",
    });

    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => {
            return {
                ...item,
                _id: item._id,
                // serialNumber: index + 1,
                serialNumber: item.serialNumber,

                empcode: item.empcode || "",
                companyname: item.companyname || "",
                // username: item.username || "",
                company: item.company || "",
                branch: item.branch || "",
                unit: item.unit || "",
                team: item.team || "",
                department: item.department || "",
                designation: item.designation || "",
                workmode: item.workmode || "",
                workstation: item.workstation || "",
                workstationinput: item.workstationinput || "",
            };
        });
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);

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
    // const handleSearchChange = (event) => {
    //   setSearchQuery(event.target.value);
    //   setPage(1);
    // };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    // const searchTerms = searchQuery?.replace(/\s+/g, "").toLowerCase().split(" ");
    // const filteredDatas = items?.filter((item) => {
    //   // Normalize companyname by removing spaces
    //   const normalizedCompanyName = item.companyname.replace(/\s+/g, "").toLowerCase();

    //   // Check if every search term is present in the normalized company name or other fields
    //   return searchTerms.every((term) =>
    //     normalizedCompanyName.includes(term) ||
    //     Object.values(item).join(" ").toLowerCase().includes(term)
    //   );
    // });

    // const searchTerms = searchQuery?.replace(/\s+/g, "").toLowerCase().split(" ");

    // const filteredDatas = items?.filter((item) => {
    //   // Create a normalized string of all fields joined together
    //   const normalizedItem = Object.values(item)
    //     .map(value => value?.toString().replace(/\s+/g, "").toLowerCase()) // Remove spaces and convert to lowercase
    //     .join(" ");

    //   // Check if every search term is present in the normalized item string
    //   return searchTerms.every((term) => normalizedItem.includes(term));
    // });

    // Pagination for outer filter
    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * page;
    const indexOfFirstItem = indexOfLastItem - page;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            lockPinned: true,
        },

        {
            field: "empcode",
            headerName: "Empcode",
            flex: 0,
            width: 200,
            minHeight: "40px",
            hide: !columnVisibility.empcode,
            pinned: "left",
            lockPinned: true,
            cellRenderer: (params) => (
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
                            text={params?.data?.empcode}
                        >
                            <ListItemText primary={params?.data?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 250,
            minHeight: "40px",
            hide: !columnVisibility.companyname,
            pinned: "left",
            lockPinned: true,
            cellRenderer: (params) => (
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
                            text={params?.data?.companyname}
                        >
                            <ListItemText primary={params?.data?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        // {
        //     field: "username",
        //     headerName: "User Name",
        //     flex: 0,
        //     width: 100,
        //     minHeight: "40px",
        //     hide: !columnVisibility.username,
        // },

        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 200,
            minHeight: "40px",
            hide: !columnVisibility.company,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 200,
            minHeight: "40px",
            hide: !columnVisibility.branch,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.unit,
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 200,
            minHeight: "40px",
            hide: !columnVisibility.team,
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 200,
            minHeight: "40px",
            hide: !columnVisibility.department,
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 200,
            minHeight: "40px",
            hide: !columnVisibility.designation,
        },

        {
            field: "workstation",
            headerName: "Work Station",
            flex: 0,
            width: 260,
            minHeight: "40px",
            hide: !columnVisibility.workstation,
        },
        {
            field: "workstationinput",
            headerName: "Remote Workstation",
            flex: 0,
            width: 260,
            minHeight: "40px",
            hide: !columnVisibility.workstationinput,
        },

        {
            field: "workmode",
            headerName: "Work Mode",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.workmode,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Box
                    sx={{
                        backgroundColor: params.data.workmode === "Remote" ? "blue" : "green", // ✅ Use params.value
                        color: "white",
                        fontWeight: "bold",
                        padding: "0px",
                        borderRadius: "22px",
                        textAlign: "center",
                        width: "90%",
                        height: "47%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {params.data.workmode}
                </Box>
            ),
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        sx={{
                            minWidth: "15px",
                            padding: "6px 5px",
                        }}
                        onClick={() => {
                            window.open(
                                `/employeefacilityreportlog/${params.data.id}`,
                                "_blank"
                            );
                        }}
                    >
                        <MenuIcon style={{ fontsize: "small" }} />
                    </Button>

                </Grid>
            ),
        },

    ];


    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            empcode: item.empcode,
            nexttime: item.nexttime,
            companyname: item.companyname,
            // username: item.username,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            designation: item.designation,
            workstation: item.workstation.includes("Please Select Primary Work Station") ? [] : item.workstation,
            workstationinput: item.workstationinput,
            workmode: item.workmode,

        };
    });


    // const rowsWithCheckboxes = rowDataTable.map((row) => ({
    //   ...row,
    //   // Create a custom field for rendering the checkbox
    //   checkbox: selectedRows.includes(row.id),
    // }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
    };

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable?.filter((column) =>
        column?.headerName
            ?.toLowerCase()
            ?.includes(searchQueryManage?.toLowerCase())
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
                    {filteredColumns?.map((column) => (
                        <ListItem key={column?.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-10px" }}
                                        checked={columnVisibility[column?.field]}
                                        onChange={() => toggleColumnVisibility(column?.field)}
                                    />
                                }
                                secondary={column?.headerName}
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
        </div>
    );


    //FILTER START
    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        setPageName(!pageName);
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });
    const EmployeeStatusOptions = [
        { label: "Live Employee", value: "Live Employee" },
        { label: "Releave Employee", value: "Releave Employee" },
        { label: "Absconded", value: "Absconded" },
        { label: "Hold", value: "Hold" },
        { label: "Terminate", value: "Terminate" },
    ];
    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];

    //MULTISELECT ONCHANGE START

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setValueWorkmode([]);
        setSelectedOptionsWorkmode([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setValueWorkmode([]);
        setSelectedOptionsWorkmode([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setValueWorkmode([]);
        setSelectedOptionsWorkmode([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setValueWorkmode([]);
        setSelectedOptionsWorkmode([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setValueWorkmode([]);
        setSelectedOptionsWorkmode([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
        setValueWorkmode([]);
        setSelectedOptionsWorkmode([]);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    const [valueEmp, setValueEmp] = React.useState([]); // State for employees
    const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state

    const [searchInputValue, setSearchInputValue] = useState('');

    const handlePasteForEmp = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Process the pasted text
        const pastedNames = pastedText
            .split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name !== "");

        // Update the state
        updateEmployees(pastedNames);

        // Clear the search input after paste
        setSearchInputValue('');

        // Refocus the element
        e.target.focus();
    };




    useEffect(() => {
        updateEmployees([]); // Pass an empty array instead of an empty string
    }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

    const updateEmployees = (pastedNames) => {
        // Your existing update logic...
        const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

        const availableOptions = allUsersData
            ?.filter(
                (comp) =>
                    valueCompanyCat?.includes(comp.company) &&
                    valueBranchCat?.includes(comp.branch) &&
                    valueUnitCat?.includes(comp.unit) &&
                    valueTeamCat?.includes(comp.team) &&
                    comp.workmode !== "Internship"
            )
            ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

        const matchedValues = namesArray.filter((name) =>
            availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
        );

        // Update selected options
        const newOptions = matchedValues.map(value => ({
            label: value,
            value: value
        }));

        setSelectedOptionsEmployee(prev => {
            const newValues = newOptions.filter(
                newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
            );
            return [...prev, ...newValues];
        });

        // Update other states...
        setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
        setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
    };

    // Handle clicks outside the Box
    useEffect(() => {
        const handleClickOutside = (e) => {
            const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
            if (boxElement && !boxElement.contains(e.target)) {
                setIsBoxFocused(false); // Reset focus state if clicking outside the Box
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
        setValueEmp((current) => current.filter(empValue => empValue !== value));
        setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
    };

    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmp([]); setEmployeeOptions([]);
        setEmployees([]);
        setSelectedOptionsWorkmode([]);

        setFilterState({
            type: "Individual",
            employeestatus: "Please Select Employee Status",
        });

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);
    const handleFilter = () => {
        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsWorkmode?.length === 0
        ) {
            setPopupContentMalert("Please Select Workmode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            fetchListData();
        }
    };

    const fetchListData = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        try {
            let response = await axios.post(
                SERVICE.EMPLOYEEFACILITYREPORT,
                {
                    pageName: "Employee",
                    company:
                        valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                    branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                    unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    employee: valueEmployeeCat,
                    workmode: valueWorkmode,

                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            setEmployees(response.data.allusers?.map((item, index) => ({ ...item, serialNumber: index + 1, })));

            setSearchQuery("");
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            console.log(err);
            setFilterLoader(true);
            setTableLoader(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //auto select all dropdowns
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    const handleAutoSelect = async () => {
        setPageName(!pageName);
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => u.companyname);
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);

            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);
            setValueEmp(mappedemployees?.map(a => a.value));
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    //FILTER END

    return (
        <>
            <Box>
                <NotificationContainer />
                <Headtitle title={"EMPLOYEE FACILITY REPORT"} />
                {/* ****** Header Content ****** */}
                <PageHeading
                    title="Employee Facility Report"
                    modulename="Human Resources"
                    submodulename="HR"
                    mainpagename="Employee"
                    subpagename="Employee details"
                    subsubpagename="Employee Facility Report"
                />
                {isUserRoleCompare?.includes("lemployeefacilityreport") && (
                    <>
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>
                                            Employee Facility Report Filter
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={TypeOptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: filterState.type ?? "Please Select Type",
                                                    value: filterState.type ?? "Please Select Type",
                                                }}
                                                onChange={(e) => {
                                                    setFilterState((prev) => ({
                                                        ...prev,
                                                        type: e.value,
                                                    }));
                                                    setValueCompanyCat([]);
                                                    setSelectedOptionsCompany([]);
                                                    setValueBranchCat([]);
                                                    setSelectedOptionsBranch([]);
                                                    setValueUnitCat([]);
                                                    setSelectedOptionsUnit([]);
                                                    setValueTeamCat([]);
                                                    setSelectedOptionsTeam([]);
                                                    setValueDepartmentCat([]);
                                                    setSelectedOptionsDepartment([]);
                                                    setValueEmployeeCat([]);
                                                    setSelectedOptionsEmployee([]);
                                                    setValueEmp([]); setValueWorkmode([]);
                                                    setSelectedOptionsWorkmode([]);

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl size="small" fullWidth>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.map((data) => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label &&
                                                                    i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsCompany}
                                                onChange={(e) => {
                                                    handleCompanyChange(e);
                                                }}
                                                valueRenderer={customValueRendererCompany}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>

                                    {["Individual", "Team"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Branch Unit Team */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    valueCompanyCat?.includes(comp.company) &&
                                                                    valueBranchCat?.includes(comp.branch)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsUnit}
                                                        onChange={(e) => {
                                                            handleUnitChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={allTeam
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCat?.includes(u.company) &&
                                                                    valueBranchCat?.includes(u.branch) &&
                                                                    valueUnitCat?.includes(u.unit)
                                                            )
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.teamname,
                                                                value: u.teamname,
                                                            }))}
                                                        value={selectedOptionsTeam}
                                                        onChange={(e) => {
                                                            handleTeamChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererTeam}
                                                        labelledBy="Please Select Team"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Department"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Department */}
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOptions}
                                                        value={selectedOptionsDepartment}
                                                        onChange={(e) => {
                                                            handleDepartmentChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Branch"]?.includes(filterState.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Unit"]?.includes(filterState.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Unit <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    valueCompanyCat?.includes(comp.company) &&
                                                                    valueBranchCat?.includes(comp.branch)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsUnit}
                                                        onChange={(e) => {
                                                            handleUnitChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {["Individual"]?.includes(filterState.type) && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <div
                                                    onPaste={handlePasteForEmp}
                                                    style={{ position: 'relative' }}
                                                >
                                                    <MultiSelect
                                                        options={allUsersData
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCat?.includes(u.company) &&
                                                                    valueBranchCat?.includes(u.branch) &&
                                                                    valueUnitCat?.includes(u.unit) &&
                                                                    valueTeamCat?.includes(u.team) &&
                                                                    u.workmode !== "Internship"
                                                            )
                                                            .map((u) => ({
                                                                label: u.companyname,
                                                                value: u.companyname,
                                                            }))}
                                                        value={selectedOptionsEmployee}
                                                        onChange={(e) => {
                                                            handleEmployeeChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererEmployee}
                                                        labelledBy="Please Select Employee"
                                                        // Add these props if your MultiSelect supports them
                                                        inputValue={searchInputValue} // Add this state if needed
                                                        onInputChange={(newValue) => setSearchInputValue(newValue)}
                                                    />
                                                </div>
                                            </FormControl>
                                        </Grid>
                                    )}
                                    {["Individual"]?.includes(filterState.type) &&
                                        <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Selected Employees</Typography>
                                                <div
                                                    id="paste-box" // Add an ID to the Box
                                                    tabIndex={0} // Make the div focusable
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: '3.75px',
                                                        height: '110px',
                                                        overflow: 'auto',
                                                    }}
                                                    onPaste={handlePasteForEmp}
                                                    onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                                                    onBlur={(e) => {
                                                        if (isBoxFocused) {
                                                            e.target.focus(); // Refocus only if the Box was previously focused
                                                        }
                                                    }}
                                                >
                                                    {valueEmp.map((value) => (
                                                        <Chip
                                                            key={value}
                                                            label={value}
                                                            clickable
                                                            sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                                                            onDelete={(e) => handleDelete(e, value)}
                                                            onClick={() => console.log("clicked chip")}
                                                        />
                                                    ))}
                                                </div>
                                            </FormControl>
                                        </Grid>
                                    }
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Work Mode <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={workModeOpt}
                                                value={selectedOptionsWorkmode}
                                                onChange={handleWorkmodeChange}
                                                valueRenderer={customValueRendererWorkmode}
                                                labelledBy="Please Select Work Mode"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6} mt={3}>
                                        <div style={{ display: "flex", gap: "20px" }}>
                                            <LoadingButton
                                                variant="contained"
                                                color="primary"
                                                onClick={handleFilter}
                                                loading={filterLoader}
                                                sx={buttonStyles.buttonsubmit}
                                            >
                                                Filter
                                            </LoadingButton>

                                            <Button
                                                sx={buttonStyles.btncancel}
                                                onClick={handleClearFilter}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    </>
                )} <br />
                {isUserRoleCompare?.includes("lemployeefacilityreport") && (
                    <>
                        <Box sx={userStyle.container}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Employee Facility Report List
                                    </Typography>
                                </Grid>

                            </Grid>
                            <Box>
                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <Box>
                                            <label htmlFor="pageSizeSelect">Show entries:</label>
                                            <Select
                                                id="pageSizeSelect"
                                                value={pageSize}
                                                onChange={handlePageSizeChange}
                                                sx={{ width: "77px" }}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                                <MenuItem value={employees?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                        <Box>
                                            {isUserRoleCompare?.includes("excelemployeefacilityreport") && (
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
                                            {isUserRoleCompare?.includes("csvemployeefacilityreport") && (
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
                                            {isUserRoleCompare?.includes("printemployeefacilityreport") && (
                                                <>
                                                    <Button
                                                        sx={userStyle.buttongrp}
                                                        onClick={handleprint}
                                                    >
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfemployeefacilityreport") && (
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
                                            {isUserRoleCompare?.includes("imageemployeefacilityreport") && (
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
                                                >
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                    &ensp;Image&ensp;{" "}
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={6} sm={6}>
                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTable}
                                            setItems={setItems}
                                            addSerialNumber={addSerialNumber}
                                            setPage={setPage}
                                            maindatas={employees}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={employees}
                                        />
                                    </Grid>
                                </Grid>  <br />
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button> <br /><br />
                                {!tableLoader ? (
                                    <>
                                        <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                                                gridRefTableImg={gridRefTableImg}
                                                paginated={false}
                                                filteredDatas={filteredDatas}
                                                // totalDatas={totalDatas}
                                                searchQuery={searchedString}
                                                handleShowAllColumns={handleShowAllColumns}
                                                setFilteredRowData={setFilteredRowData}
                                                filteredRowData={filteredRowData}
                                                setFilteredChanges={setFilteredChanges}
                                                filteredChanges={filteredChanges}
                                                rowHeight={80}
                                                itemsList={employees}
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
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


                <DeleteConfirmation
                    open={isDeleteOpen}
                    onClose={handleCloseDel}
                    onConfirm={delAddemployee}
                    title="Are you sure?"
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                />
                {/* VALIDATION */}
                <MessageAlert
                    openPopup={openPopupMalert}
                    handleClosePopup={handleClosePopupMalert}
                    popupContent={popupContentMalert}
                    popupSeverity={popupSeverityMalert}
                />
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
                    // filteredDataTwo={filteredData ?? []}
                    filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                    itemsTwo={employees ?? []}
                    filename={"Employee Facility Report List"}
                    exportColumnNames={exportColumnNames}
                    exportRowValues={exportRowValues}
                    componentRef={componentRef}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
                <InfoPopup
                    openInfo={openInfo}
                    handleCloseinfo={handleCloseinfo}
                    heading="Employee Facility Report Info"
                    addedby={addedby}
                    updateby={updateby}
                />
            </Box >
            <LoadingBackdrop open={isLoading} />
        </>
    );
}

export default EmployeeFacilityReport;