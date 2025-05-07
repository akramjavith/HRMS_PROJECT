import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Button, Checkbox, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Typography, } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext, } from "../../context/Appcontext";
import { userStyle, colourStyles } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import "react-notifications/lib/notifications.css";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import EmployeeExportData from "../../components/EmployeeExport";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
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

function AccessibleBranchFilter() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Accessible Branch Filter.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
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

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Accessible Branch Filter"),
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

    useEffect(() => {
        getapi();
    }, []);

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
        serialNumber: true,
        type: true,
        employeecode: true,
        employee: true,
        fromcompany: true,
        frombranch: true,
        fromunit: true,
        company: true,
        branch: true,
        unit: true,
        // mode: true,

    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


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
    const [fileFormat, setFormat] = useState("");

    const exportColumnNames = ['Employee Code', 'Employee Name', 'From Company', 'From Branch', 'From Unit', 'To Company', 'To Branch', 'To Unit'];
    const exportRowValues = ['employeecode', 'employee', 'fromcompany', 'frombranch', 'fromunit', 'company', 'branch', 'unit'];
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Accessible Branch Filter",
        pageStyle: "print",
    });

    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas;
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
            field: "employeecode",
            headerName: "Employee Code",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.employeecode,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "employee",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.employee,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "fromcompany",
            headerName: "From Company",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.fromcompany,
        },
        {
            field: "frombranch",
            headerName: "From Branch",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.frombranch,
        },
        {
            field: "fromunit",
            headerName: "From Unit",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.fromunit,
        },

        {
            field: "company",
            headerName: "To Company",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.company,
        },
        {
            field: "branch",
            headerName: "To Branch",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.branch,
        },
        {
            field: "unit",
            headerName: "To Unit",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.unit,
        },
        // {
        //     field: "mode",
        //     headerName: "Mode",
        //     flex: 0,
        //     width: 150,
        //     minHeight: "40px",
        //     hide: !columnVisibility.mode,
        // },

    ];

    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            employeecode: item.employeecode,
            employee: item.employee,
            fromcompany: item.fromcompany,
            frombranch: item.frombranch,
            fromunit: item.fromunit,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            // mode: item.mode,

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

    const [filterState, setFilterState] = useState({
        type: "Individual",
    });
    const [modeOpt, setModeopt] = useState("Please Select Mode");

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
    ];
    const modeOptions = [
        { label: "Team", value: "Team" },
        { label: "Overall", value: "Overall" },
        { label: "Default", value: "Default" },
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
        setModeopt("Please Select Mode");
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
        setModeopt("Please Select Mode");
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
        setModeopt("Please Select Mode");
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setEmployees([]);
        setModeopt("Please Select Mode");
        setFilterState({
            type: "Individual",
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
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterState?.type === "Individual" && (modeOpt === "Please Select Mode" || !modeOpt)) {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
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
            const payload = {
                company: valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                mode: modeOpt === "Team"
                    ? "teamassignbranch"
                    : modeOpt === "Overall"
                        ? "assignbranch"
                        : modeOpt === "Default"
                            ? "Default"
                            : null,
            };

            // Make the API request
            let response = await axios.post(
                SERVICE.ASSIGNBRANCHFILTER,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            setEmployees(
                response.data.allbranch?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,
                    employeecode: item.employeecode,
                    employee: item.employee,
                    fromcompany: item.fromcompany,
                    frombranch: item.frombranch,
                    fromunit: item.fromunit,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    mode: item.mode,
                }))
            );

            setSearchQuery("");
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            console.error(err);
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
                        u.workmode !== "Internship"
                )
                .map((u) => u.companyname);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);

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
                <Headtitle title={"Accessible Branch Filter"} />
                {/* ****** Header Content ****** */}
                <PageHeading
                    title="Accessible Branch Filter"
                    modulename="Human Resources"
                    submodulename="Facility"
                    mainpagename="Accessible Branch Filter"
                    subpagename=""
                    subsubpagename=""
                />
                {isUserRoleCompare?.includes("laccessiblebranchfilter") && (
                    <>
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>
                                            Accessible Branch List Filter
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
                                                    setModeopt("Please Select Mode");
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

                                    {["Individual"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Branch Unit*/}
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
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Mode<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={modeOptions}
                                                        styles={colourStyles}

                                                        value={{ label: modeOpt, value: modeOpt }}
                                                        onChange={(e) => {
                                                            setModeopt(e.value);

                                                        }}
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
                {isUserRoleCompare?.includes("laccessiblebranchfilter") && (
                    <>
                        <Box sx={userStyle.container}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Accesible Branch Filter List
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
                                            {isUserRoleCompare?.includes("excelaccessiblebranchfilter") && (
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
                                            {isUserRoleCompare?.includes("csvaccessiblebranchfilter") && (
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
                                            {isUserRoleCompare?.includes("printaccessiblebranchfilter") && (
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
                                            {isUserRoleCompare?.includes("pdfaccessiblebranchfilter") && (
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
                                            {isUserRoleCompare?.includes("imageaccessiblebranchfilter") && (
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
                    filename={"Accesible Branch Filter List"}
                    exportColumnNames={exportColumnNames}
                    exportRowValues={exportRowValues}
                    componentRef={componentRef}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
                <InfoPopup
                    openInfo={openInfo}
                    handleCloseinfo={handleCloseinfo}
                    heading="Accessible Branch Filter Info"
                    addedby={addedby}
                    updateby={updateby}
                />
            </Box >
            <LoadingBackdrop open={isLoading} />
        </>
    );
}

export default AccessibleBranchFilter;
