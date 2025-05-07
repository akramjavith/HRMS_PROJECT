import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import { Box, Button, Checkbox, Radio, RadioGroup, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Tooltip, OutlinedInput, Popover, InputAdornment, Select, TextField, Typography, FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import Selects from "react-select";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";

import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert.js";
import { MdClose } from "react-icons/md";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";

function UnAssignedReportList() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
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

    let exportColumnNames2 = ['Company', 'Branch', 'Process Code', 'Code', 'Mode'];
    let exportRowValues2 = ['company', 'branch', 'processcode', 'code', 'mode'];

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [targetFilter, setTargetFilter] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            codeval: data.branchcode
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
                codeval: data.branchcode
            }));


    const [searchedString, setSearchedString] = useState("")
    const gridRefTable = useRef(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [targetdetailFilter, setTargetdetailFilter] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        type: "Please Select Type",
        salaryrange: "Please Select Salary Range",
        amountvalue: "",
        process: "Please Select Process",
        from: "",
        to: ""

    });
    const [ProcessOptions, setProcessOptions] = useState([]);
    const [loaderFilter, setLoaderFilter] = useState(false);
    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedProcessFrom, setSelectedProcessFrom] = useState([]);
    const [selectedMode, setSelectedMode] = useState("Please Select Mode");

    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);

    const handleCompanyChangeFrom = (options) => {
        setSelectedCompanyFrom(options);
        setSelectedBranchFrom([]);

        setTargetdetailFilter({
            ...targetdetailFilter,
            process: "Please Select Process",
        })
    };
    const customValueRendererCompanyFrom = (valueCate, _company) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Company";
    };

    const handleBranchChangeFrom = async (options) => {
        setSelectedBranchFrom(options);
        setSelectedProcessFrom([])
        setTargetdetailFilter({
            ...targetdetailFilter,
            process: "Please Select Process",
        })

        await fetchProcessQueue(options.map(d => d.value))
    };
    const customValueRendererBranchFrom = (valueCate, _branch) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    const handleProcessChangeFrom = (options) => {
        setSelectedProcessFrom(options);

        setTargetdetailFilter({
            ...targetdetailFilter,
            process: "Please Select Process",
        })
    };
    const customValueRendererProcessFrom = (valueCate, _process) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Process";
    };

    const fetchProcessQueue = async (pro) => {
        setPageName(!pageName);
        try {
            // Fetch process queue names from the API
            let res_freq = await axios.post(SERVICE.ALL_PROCESSQUEUENAME_UNASSIGNED_REPORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: selectedCompanyFrom?.map(data => data?.value),
                branch: pro,
            });
            // console.log(res_freq?.data?.processqueuename, 'res_freq?.data?.processqueuename')
            let data_set = res_freq?.data?.processqueuename?.length > 0 ? res_freq?.data?.processqueuename : [];
            const all = data_set?.map(d => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            // Set unique options in process options
            setProcessOptions(all?.filter((item, index, self) => {
                return self.findIndex(i => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [items, setItems] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    //SECOND DATATABLE

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        // checkbox: true,
        company: true,
        branch: true,
        // experience: true,
        processcode: true,
        code: true,
        mode: true,
        // pointstable: true,
        // actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

    // page refersh reload
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };
    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const username = isUserRoleAccess.username;

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        // fetchTargetPointsData();
    };
    const handleCloseerrUpdate = () => {
        setIsErrorOpen(false);
        // fetchEmployee();
    };

    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);

        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const [targetPointEditDup, setTargetPointEditDup] = useState([])
    const [overallFilterdataAll, setOverallFilterdataAll] = useState([]);
    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    //  const [filteredRowData, setFilteredRowData] = useState([]);
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);

    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("UnAssigned Report List"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi()
    }, [])


    //submit option for saving 
    const fetchFilter = async () => {
        setPageName(!pageName);
        setLoaderFilter(true);
        const queryParams = {
            company: selectedCompanyFrom.map((item) => item.value),
            branch: selectedBranchFrom.map((item) => item.value),
            process: selectedProcessFrom.map((item) => item.value),
            mode: selectedMode,
        };
        try {
            const response = await axios.post(
                SERVICE.UNASSIGNED_REPORT_LIST,
                queryParams,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            const filteredData = response?.data?.targetpointFilters || [];
            console.log(response?.data, 'response?.data')
            const itemsWithSerialNumber =
                filteredData.map((item, index) => ({
                    ...item,
                    id: index + 1,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    processcode: item.process,
                    code: item.code,
                    mode: item.mode,
                }));

            setOverallFilterdata(itemsWithSerialNumber);
            setTargetFilter(itemsWithSerialNumber);
            setLoaderFilter(false);
        } catch (err) {
            setLoaderFilter(false);
            console.error(err, "Error fetching UnAssigned Report List");
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        if (selectedCompanyFrom.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedBranchFrom.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedProcessFrom.length === 0) {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedMode === "Please Select Mode" || selectedMode === undefined || selectedMode === "") {
            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchFilter()
        }
    }

    const handleClearFilter = async (e) => {
        e.preventDefault();
        setTargetdetailFilter({
            ...targetdetailFilter,

            process: "Please Select Process",
            from: "",
            to: ""
        })
        setSelectedCompanyFrom([]);
        setSelectedBranchFrom([]);
        setSelectedProcessFrom([]);
        setProcessOptions([])
        setSearchQuery("")
        setTargetFilter([]);
        setOverallFilterdata([]);

        setPage(1);
        setPageSize(10);
        setTotalProjects(0);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "UnAssigned Report List",
        pageStyle: "print",
    });

    const addSerialNumber = (datas) => {
        setItems(datas);
    };
    // useEffect(() => {
    //   addSerialNumber(targetPoints);
    // }, [targetPoints]);
    useEffect(() => {
        addSerialNumber(targetFilter);
    }, [targetFilter]);

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
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },

        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 90,
        //     headerCheckboxSelection: true,
        //     checkboxSelection: true,
        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        //     pinned: 'left', lockPinned: true,
        // },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 180,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },

        {
            field: "processcode",
            headerName: "Process Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.processcode,
            headerClassName: "bold-header",
        },
        {
            field: "code",
            headerName: "Code",
            flex: 0,
            width: 200,
            hide: !columnVisibility.code,
            headerClassName: "bold-header",
        },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 200,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",
        },

    ];
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            // experience: item.experience,
            company: item.company,
            branch: item.branch,
            processcode: item.processcode,
            code: item.code,
            mode: item.mode,
            // pointstable: Number(item.points),
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
    // Function to filter columns based on search query
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
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            {" "}
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
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    //SECOND TABLE FDATA AND FUNCTIONS
    const gridRefTableImg = useRef(null);

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "UnAssigned Report List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // page refersh reload
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

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;

    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={"UNASSIGNED REPORT LIST"} />
            <PageHeading
                title="UnAssigned Report List"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="UnAssigned Report List"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aunassignedreportlist")
                && (

                    <Box sx={userStyle.selectcontainer}>

                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>UnAssigned Report Filter</Typography>
                            </Grid>
                        </Grid><br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}

                                        styles={colourStyles}

                                        value={selectedCompanyFrom}
                                        onChange={handleCompanyChangeFrom}
                                        valueRenderer={customValueRendererCompanyFrom}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                selectedCompanyFrom.map(data => data.value).includes(comp.company)
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}

                                        styles={colourStyles}

                                        value={selectedBranchFrom}
                                        onChange={handleBranchChangeFrom}
                                        valueRenderer={customValueRendererBranchFrom}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography>
                                    Process<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <MultiSelect
                                        options={ProcessOptions}
                                        styles={colourStyles}
                                        value={selectedProcessFrom}
                                        onChange={handleProcessChangeFrom}
                                        valueRenderer={customValueRendererProcessFrom}
                                        labelledBy="Please Select Process"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Mode<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={250}
                                        options={[
                                            { label: "Target Points", value: "Target Points" },
                                            { label: "ERA Amount", value: "ERA Amount" },
                                            { label: "Revenue Amount", value: "Revenue Amount" },
                                            { label: "Salary Slab", value: "Salary Slab" },
                                        ]}
                                        placeholder="Please Select Mode"
                                        value={{ label: selectedMode, value: selectedMode }}
                                        onChange={(e) => {
                                            setSelectedMode(e.value)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />  <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={6}>
                                <Button variant='contained' sx={buttonStyles.buttonsubmit} onClick={handleSubmitFilter}>Filter</Button>

                            </Grid>
                            <Grid item md={2.5} xs={12} sm={6}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>Clear</Button>
                            </Grid>
                        </Grid>
                    </Box>

                )}
            <br />
            {/* ****** Table Start ****** */}
            {loader ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("lunassignedreportlist") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>UnAssigned Report List</Typography>
                                </Grid>
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
                                                <MenuItem value={totalProjects}>All</MenuItem>
                                            </Select>
                                        </Box>
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
                                        <Box>
                                            {isUserRoleCompare?.includes("excelunassignedreportlist") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen2(true)
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvunassignedreportlist") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen2(true)
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printunassignedreportlist") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfunassignedreportlist") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen2(true)
                                                        }}
                                                    >
                                                        <FaFilePdf />
                                                        &ensp;Export to PDF&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageunassignedreportlist") && (
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                                            maindatas={overallFilterdata}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={overallFilterdata}
                                        />
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
                                &ensp;
                                <br />
                                <br />
                                <br />
                                {loaderFilter ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
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
                                            itemsList={overallFilterdata}
                                        />

                                    </>
                                )}
                            </Box>

                        </>
                    )}</>)
            }

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
            <br />

            {/* second table starts */}
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
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen2}
                handleCloseFilterMod={handleCloseFilterMod2}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen2}
                isPdfFilterOpen={isPdfFilterOpen2}
                setIsPdfFilterOpen={setIsPdfFilterOpen2}
                handleClosePdfFilterMod={handleClosePdfFilterMod2}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                // itemsTwo={targetPointsArray ?? []}
                itemsTwo={overallFilterdata ?? []}
                filename={"UnAssignedReportList"}
                exportColumnNames={exportColumnNames2}
                exportRowValues={exportRowValues2}
                componentRef={componentRef}
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* second table ends */}

            <br />

        </Box >
    );
}

export default UnAssignedReportList;