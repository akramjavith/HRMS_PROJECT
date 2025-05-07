import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Tooltip, Typography, } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext, } from "../../context/Appcontext";
import { userStyle, colourStyles } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import ExportData from "../../components/ExportData";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

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

function AssignBiometricDevice() {
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
    } = useContext(UserRoleAccessContext);
    const [checkemployeelist, setcheckemployeelist] = useState(false);
    const { auth } = useContext(AuthContext);

    //for Assign biometric value get
    const [biometricName, setBiometricname] = useState({
        company: "",
        branch: "",
        unit: "",
        team: "",
        companyname: "",
        cardnumber: "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);
    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setBiometricname({
            cardnumber: "",
        });
    };

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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Assign Biometric Device Card Number List.png");
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
            pagename: String("Assign Biometric Device Card Number"),
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
        status: true,
        percentage: true,
        empcode: true,
        companyname: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        checkbox: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    let userid = deleteuser?._id;

    //set function to get particular row

    const [teams, setTeams] = useState([]);
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


    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpenEdit();
            setBiometricname(res?.data?.suser);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // submit option for saving....
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allGroupEdit.some(
            (item) => item.cardnumber?.toLowerCase() === biometricName.cardnumber?.toLowerCase()
        );
        // if (biometricName.cardnumber === "") {
        if (!biometricName.cardnumber || biometricName.cardnumber.trim() === "") {
            setPopupContentMalert('Please Enter Card Number');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            // Show alert if the card number already exists
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    let projectsid = biometricName._id;
    // post call
    const sendRequest = async () => {
        setPageName(!pageName);
        try {

            let ans = await axios.put(
                `${SERVICE.USER_SINGLE_PWD}/${projectsid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    cardnumber: biometricName.cardnumber,

                    updatedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchListData();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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

    const exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Empcode",
        "Employee Name"
    ];
    const exportRowValues = [
        "company",
        "branch",
        "unit",
        "team",
        "empcode",
        "companyname",
    ];
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Assign Biometric Device Card Number List",
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
                status: item.status || "",
                empcode: item.empcode || "",
                companyname: item.companyname || "",
                username: item.username || "",
                company: item.company || "",
                branch: item.branch || "",
                unit: item.unit || "",
                team: item.team || ""

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
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            // Assign biometric
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    {isUserRoleCompare?.includes("eassignbiometricdevicecardnumber") && (
                        <Button
                            sx={userStyle.buttonedit}
                            variant="contained"
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            Assign
                        </Button>
                    )}
                </Grid>
            ),
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.company,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.branch,
            pinned: "left",
            lockPinned: true,
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
            field: "empcode",
            headerName: "Empcode",
            flex: 0,
            width: 140,
            minHeight: "40px",
            hide: !columnVisibility.empcode,
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
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.companyname,
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

    ];
    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            status: item.status,
            empcode: item.empcode,
            companyname: item.companyname,
            username: item.username,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
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
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
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
        setEmployeeOptions([]);
        setEmployees([]);

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
        } else {
            fetchListData();
        }
    };

    const [allGroupEdit, setAllGroupEdit] = useState([]);

    const fetchListData = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        try {
            let response = await axios.post(
                SERVICE.BIOMETRICUSERSALL,
                {
                    pageName: "Employee",
                    company:
                        valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                    branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                    unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    employee: valueEmployeeCat,
                    profileimage: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            // setEmployees(response.data.allusers?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
            setEmployees(response.data.allusers?.filter(user => !user.cardnumber).map((item, index) => ({ ...item, serialNumber: index + 1, })));

            setSearchQuery("");
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
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

    const fetchListDataEdit = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        try {
            const response = await axios.post(
                SERVICE.BIOMETRICUSERSALL,
                {
                    pageName: "Employee",
                    company: valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                    branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                    unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    employee: valueEmployeeCat,
                    profileimage: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            const allUsers = response.data.allusers || [];
            // Set employees with serial numbers

            setAllGroupEdit(allUsers.filter((item) => item._id !== biometricName._id));
            setSearchQuery("");
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            setFilterLoader(false);
            setTableLoader(false);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    useEffect(() => {
        fetchListDataEdit()
    }, [isEditOpen])

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
                <Headtitle title={"Assign Biometric Device"} />
                {/* ****** Header Content ****** */}
                <PageHeading
                    title="Assign Biometric Device Card Number"
                    modulename="Biometric Device"
                    submodulename="Assign Biometric Device Card Number"
                    mainpagename=""
                    subpagename=""
                    subsubpagename=""
                />
                {isUserRoleCompare?.includes("lassignbiometricdevicecardnumber") && (
                    <>
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>
                                            Assign Biometric Device Card Number Filter
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
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
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
                {isUserRoleCompare?.includes("lassignbiometricdevicecardnumber") && (
                    <>
                        <Box sx={userStyle.container}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Assign Biometric Device Card Number List
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
                                            {isUserRoleCompare?.includes("excelassignbiometricdevicecardnumber") && (
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
                                            {isUserRoleCompare?.includes("csvassignbiometricdevicecardnumber") && (
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
                                            {isUserRoleCompare?.includes("printassignbiometricdevicecardnumber") && (
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
                                            {isUserRoleCompare?.includes("pdfassignbiometricdevicecardnumber") && (
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
                                            {isUserRoleCompare?.includes("imageassignbiometricdevicecardnumber") && (
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
                <Box>
                    {/* Edit DIALOG */}
                    <Dialog
                        open={isEditOpen}
                        onClose={handleCloseModEdit}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        maxWidth="md"
                        sx={{
                            overflow: "visible",
                            "& .MuiPaper-root": {
                                overflow: "visible",
                            },
                        }}
                    >
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Typography sx={userStyle.SubHeaderText}>
                                    Assign Biometric Device Card Number
                                </Typography>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Company</Typography>
                                            <Typography>{biometricName.company}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Branch</Typography>
                                            <Typography>{biometricName.branch}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Unit</Typography>
                                            <Typography>{biometricName.unit}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Floor</Typography>
                                            <Typography>{biometricName.floor}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Team</Typography>
                                            <Typography>{biometricName.team}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee name</Typography>
                                            <Typography>{biometricName.companyname}</Typography>
                                        </FormControl>
                                        <Grid></Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Card Number  <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Card Number"
                                                value={biometricName.cardnumber}
                                                onChange={(e) => {
                                                    setBiometricname({ ...biometricName, cardnumber: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                        <Grid></Grid>
                                    </Grid>
                                </Grid>
                                <br /> <br /> <br />
                                <Grid container>
                                    <Grid item md={1}></Grid>
                                    <Button variant="contained"
                                        onClick={handleSubmit}
                                        sx={buttonStyles.buttonsubmit}>
                                        Update
                                    </Button>
                                    <Grid item md={1}></Grid>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </>
                        </Box>
                    </Dialog>
                </Box>


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
                    filename={"Assign Biometric Device Card Number List"}
                    exportColumnNames={exportColumnNames}
                    exportRowValues={exportRowValues}
                    componentRef={componentRef}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />

            </Box >
            <LoadingBackdrop open={isLoading} />
        </>
    );
}

export default AssignBiometricDevice;
