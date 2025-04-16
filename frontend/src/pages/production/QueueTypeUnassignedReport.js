import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Chip, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import Selects from "react-select";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";


function QueueTypeUnassignedReport() {


    const [loaderList, setLoaderList] = useState(false)

    const [batchNumber, setBatchNumber] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadMorePopupOpen, setIsLoadMorePopupOpen] = useState(false);

    const handleLoadMoreClosePopup = () => {
        setIsLoadMorePopupOpen(false); // Close the popup without loading more
    };

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

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;


    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;
    // const [selectedTypeFrom, setSelectedTypeForm] = useState([])
    const [selectedTypeFrom, setSelectedTypeForm] = useState("Please Select Type")

    const gridRef = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const [selectedMode, setSelectedMode] = useState("Today")

    const [projectOpt, setProjectopt] = useState([]);

    const [typeMaster, setTypeMaster] = useState([])


    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setProjectopt(companyall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        fetchProjectDropdowns()
    }, [])



    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]
    let exportColumnNames = [
        'Type',
        'Project',
        'Category',
        'SubCategory',

    ]

    let exportRowValues =
        ['type', 'project', 'categoryname', 'name',
        ];
    //    today date fetching
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)
    const [vendors, setVendors] = useState([]);


    // const [selectedProject, setSelectedProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState('Please Select Project');

    const [selectedVendor, setSelectedVendor] = useState("Please Select Vendor");
    let [valueVendor, setValueVendor] = useState([]);
    const [projmaster, setProjmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [vendorOpt, setVendormasterOpt] = useState([]);
    const [categoryOpt, setCategoryOPt] = useState([]);
    const [subcategory, setSubCategoryOpt] = useState([]);
    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);




    const fetchVendorsDropDown = async (project) => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.post(SERVICE.QUEUE_TYPE_MASTER_VENDOR_MASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: project
            });
            let vendorall = res_vendor?.data?.vendormasters.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            vendorall = vendorall.filter(
                (item, index, self) =>
                    index === self.findIndex((t) => t.label === item.label)
            );

            // console.log(vendorall, "vendorall")
            setVendormasterOpt(vendorall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };







    const handleProjectChange = (options) => {
        const selectedProject = options.value;
        setSelectedProject(selectedProject);
        fetchVendorsDropDown(selectedProject)
    };

    const handleTypeChangeFrom = (options) => {
        const selectedProject = options.value;
        setSelectedTypeForm(selectedProject);

    };

    const handleVendorChange = (options) => {
        const selectedProject = options.value;

        setSelectedVendor(selectedProject);
    };



    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Queue Type Unassigned Report .png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const username = isUserRoleAccess.username;
    const userData = {
        name: username,
        date: new Date(),
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        name: true,
        project: true,
        categoryname: true,
        type: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedTypeFrom == "Please Select Type") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (selectedProject === "Please Select Project") {
            setPopupContentMalert("Please Select Project!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }




        else {
            // If all conditions are met, proceed with the fetch
            // fetchProductionIndividual();
            fetchBatchFilter();
        }
    };


    const handleclear = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setProjmaster([])
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
        setVendormasterOpt([]);
        setSelectedTypeForm("Please Select Type");
        setTypeMaster([])
        setSelectedProject("Please Select Project");
        setSelectedVendor("Please Select Vendor");
        setCategoryOPt([]);
        setSubCategoryOpt([]);
        setFromdate(today)
        setTodate(today)
        setSelectedMode("Today")

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");


    };


    let result = [];



    const fetchBatchFilter = async () => {
        setProjmaster([]);
        setLoaderList(true);
        try {
            let res_employee = await axios.post(
                SERVICE.QUEUETYPE_TYPE_UNASSIGNED,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    // project: selectedProject,
                    type: selectedTypeFrom,
                    projectvendor: selectedProject,
                    fromdate: fromdate,
                    todate: todate,
                }
            );

            if (res_employee?.data?.prodresult?.length === 0) {
                setPopupContentMalert("The Selected Project is not Available in Subcategory Master!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
                setProjmaster([]); // Clear data
                setIsLoading(false);
                return;
            }

            const itemsWithSerialNumber = res_employee?.data?.prodresult?.map((item, index) => ({
                ...item,

                id: item._id,
                serialNumber: index + 1,

            }));


            setProjmaster(itemsWithSerialNumber)
            setIsLoading(false);

        } catch (err) {
            setLoaderList(false);
            setIsLoading(false);
            setHasMoreData(false);
        } finally {
            setLoaderList(false);
            setIsLoading(false);
            setIsLoading(false);
        }
    };







    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Queue Type Unassigned Report",
        pageStyle: "print",
    });

    const addSerialNumber = async (datas) => {
        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(projmaster);
    }, [projmaster]);

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


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

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
            width: 85,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        { field: "type", headerName: "Type", flex: 0, width: 280, hide: !columnVisibility.type, headerClassName: "bold-header" },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header" },
        { field: "categoryname", headerName: "Category", flex: 0, width: 400, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
        { field: "name", headerName: "SubCategory", flex: 0, width: 500, hide: !columnVisibility.name, headerClassName: "bold-header" },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {

            ...item,
            id: item._id,
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



    // const fetchVendors = async () => {
    //     setPageName(!pageName)
    //     try {
    //         let res_vendor = await axios.get(SERVICE.QUEUE_TYPE_VENDOR_DROP, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         let vendorall = res_vendor?.data?.queuetypemasters.map((d) => ({
    //             ...d,
    //             label: d.vendor,
    //             value: d.vendor,
    //         }));
    //         vendorall = vendorall.filter(
    //             (item, index, self) =>
    //                 index === self.findIndex((t) => t.label === item.label)
    //         );
    //         setVendors(vendorall);
    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };


    const fetchVendors = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let vendorall = res_vendor?.data?.projmaster.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            vendorall = vendorall.filter(
                (item, index, self) =>
                    index === self.findIndex((t) => t.label === item.label)
            );
            setVendors(vendorall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchAllTypemaster = async () => {
        setPageName(!pageName);
        try {
            let res_module = await axios.get(SERVICE.PRODUCTION_TYPEMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            // Default options
            const defaultOptions = [
                { label: "Other task queues", value: "Other task queues" },
                { label: "Other Task Upload", value: "Other task upload" },
            ];

            // Fetch and map dynamic options
            const dynamicOptions = Array.from(new Set(
                res_module?.data?.typemasters
                    .map((t) => t.name)
            )).map((name) => ({
                label: name,
                value: name,
            }));


            const combinedOptions = [...defaultOptions, ...dynamicOptions];

            // Remove duplicates with case-insensitive comparison
            const categoryOpt = Array.from(
                new Map(
                    combinedOptions.map(option => [option.label.toLowerCase(), option])
                ).values()
            );
            setTypeMaster(categoryOpt);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };





    useEffect(() => {
        fetchVendors();
        fetchAllTypemaster();
    }, []);

    const [fileFormat, setFormat] = useState('')
    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        switch (mode) {
            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            default:
                fromdate = todate = "";
        }

        return { fromdate, todate };
    };


    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Queue Type Unassigned Report"),
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
        getapi();
    }, []);

    return (
        <Box>
            <Headtitle title={"Queue Type Unassigned Report"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Queue Type Unassigned Report"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Queue Type Unassigned Report"
                subpagename=""
                subsubpagename=""
            />
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Queue Type Unassigned Report</Typography>
                    </Grid>
                    <>
                        <Grid container spacing={2}>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Type <b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <Selects
                                        options={typeMaster}
                                        value={{ label: selectedTypeFrom, value: selectedTypeFrom }}
                                        onChange={handleTypeChangeFrom}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={vendors}
                                        value={{ label: selectedProject, value: selectedProject }}
                                        onChange={(e) => {
                                            handleProjectChange(e);
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                                        Filter
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lqueuetypeunassignedreport") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Queue Type Unassigned Report List</Typography>
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
                                        <MenuItem value={projmaster?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelqueuetypeunassignedreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvqueuetypeunassignedreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printqueuetypeunassignedreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfqueuetypeunassignedreport") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagequeuetypeunassignedreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>

                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={projmaster}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={projmaster}
                                    />
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
                        <br />
                        {loaderList ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={projmaster}
                                />
                            </>
                        )}
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={projmaster ?? []}
                filename={"Queue Type Unassigned Report"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
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
        </Box>
    );
}

export default QueueTypeUnassignedReport;