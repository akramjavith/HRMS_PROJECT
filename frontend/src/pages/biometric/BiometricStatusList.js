import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import AggridTable from "../../components/AggridTable";

import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import {
    Box, Button, Checkbox, Dialog,
    DialogActions, DialogContent, FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    List, ListItem, ListItemText, MenuItem,
    OutlinedInput, Popover,
    Radio,
    RadioGroup,
    Select, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../components/Alert.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext.js';
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice.js';

function BiometricstatusList() {
    const [searchedString, setSearchedString] = useState("")
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [logicOperator, setLogicOperator] = useState("AND");
    const [filterValue, setFilterValue] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [biometricDeviceManagement, setBiometricDeviceManagement] = useState({
        param1C: "Please Select Status",
        deviceCommandN: "",
        cloudIDC: "",

    });

    const [isHandleChange, setIsHandleChange] = useState(false);
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

    let exportColumnNames = ['Company', 'Branch', 'Unit', 'Floor', 'Area', 'Biometric Device ID', 'Biometric Serial No', 'Biometric Assigned IP', 'Last Online Status', 'Status'];
    let exportRowValues = ['company', 'branch', 'unit', 'floor', 'area', 'biometricdeviceid', 'biometricserialno', 'biometricassignedip', 'lastOnlineTimeC', 'status'];

    const gridRefTable = useRef(null);

    const [isDisable, setIsDisable] = useState(false)
    const [sourceEdit, setSourceEdit] = useState({
        company: "",
        branch: "",
        department: "",
        dividevalue: "",
        multiplevalue: "",
    })
    const { isUserRoleCompare, alldepartment, allareagrouping, isAssignBranch, pageName, setPageName, buttonStyles, isUserRoleAccess, allfloor } = useContext(UserRoleAccessContext);

    const [acPointCalculation, setAcpointCalculation] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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

    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
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

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Biometric Status List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        biometricdeviceid: true,
        biometricserialno: true,
        biometricassignedip: true,
        lastOnlineTimeC: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    const [cloudIDC, setCloudIDC] = useState("")

    //add function 
    const handleSubmitBiometric = async () => {
        setPageName(!pageName);
        console.log(biometricDeviceManagement, 'biometricDeviceManagement');
        console.log(cloudIDC, 'cloudIDC');
        // const filterData = await allValue?.filter((item) => item?._id === id)[0];
        try {
            const res = await axios.post(SERVICE.CREATE_BIOMETRICSTATUSLIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                deviceCommandN: biometricDeviceManagement?.deviceCommandN,
                cloudIDC: cloudIDC,
                biometricUserIDC: "",
                status: "Send",
                description: biometricDeviceManagement?.param1C,
                param1C: "",
                param2C: "",
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            const ressend = await axios.post(SERVICE.BIO_SENDCOMMAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                cloudIDC: cloudIDC,
                deviceCommandN: biometricDeviceManagement?.deviceCommandN
            })

            handleCloseModEdit();
            setPopupContent(`${res?.data?.status} Successfully`);
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setIsDisable(false)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }



    //get all Sub vendormasters.
    const fetchSource = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.ALL_BIOMETRICDEVICEMANAGEMENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setAcpointCalculation(res_vendor?.data?.biometricdevicemanagement);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const [acpointCalculationArrayForExport, setAcpointCalculationArrayForExport] = useState([])

    const fetchAcpointcalculation = async () => {

        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.ALL_BIOMETRICDEVICEMANAGEMENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setAcpointCalculationArrayForExport(res_vendor?.data?.biometricdevicemanagement.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company?.toString(),
                    branch: item.branch?.toString(),
                    unit: item.unit?.toString(),
                    floor: item.floor?.toString(),
                    area: item.area,
                    biometricdeviceid: item.biometricdeviceid,
                    biometricserialno: item.biometricserialno,
                    biometricassignedip: item.biometricassignedip,

                }
            }));
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchAcpointcalculation()
    }, [isFilterOpen])


    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [overallFilterdataAllData, setOverallFilterdataAllData] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };


    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };


    const fetchEmployee = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.BIOMETRIC_DEVICE_STATUS_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                presentDate: new Date()
            });

            console.log(res_employee?.data?.deviceonlinestatus)

            const ans = res_employee?.data?.deviceonlinestatus?.length > 0 ? res_employee?.data?.deviceonlinestatus : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));
            setOverallFilterdata(itemsWithSerialNumber);


            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Biometric Status List',
        pageStyle: 'print'
    });

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Biometric Status List"),
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
        fetchEmployee();
        fetchSource();
        getapi();
    }, [])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(overallFilterdata);
    }, [overallFilterdata]);


    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        // setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
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
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );

    const [isEditOpen, setIsEditOpen] = useState(false);

    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        // if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setBiometricDeviceManagement({
            param1C: "Please Select Status",
            deviceCommandN: "",
            cloudIDC: "",
        });
    };

    const editSubmit = async (e) => {
        e.preventDefault()
        if (biometricDeviceManagement.param1C === "Please Select Status") {
            setPopupContentMalert("Please Select Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {


            const ressend = await axios.post(SERVICE.BIO_CHECKSENDCOMMANDSTATUS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                deviceCommandN: biometricDeviceManagement?.deviceCommandN
            })
            console.log(ressend?.data?.allbiocmdcpl[ressend?.data?.allbiocmdcpl?.length - 1], 'resp')
            if (ressend?.data?.allbiocmdcpl[ressend?.data?.allbiocmdcpl?.length - 1]?.status === "Send") {
                setPopupContentMalert(`${cloudIDC} Already Status Send!!`);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleSubmitBiometric()
            }


        }
    };





    const columnDataTable = [
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',
        },
        { field: "company", headerName: "Company", flex: 0, width: 160, hide: !columnVisibility.company, headerClassName: "bold-header", pinned: 'left', },
        {
            field: "branch", headerName: "Branch", flex: 0, width: 170, hide: !columnVisibility.branch, headerClassName: "bold-header",
            // pinned: 'left', 
        },
        {
            field: "unit", headerName: "Unit", flex: 0, width: 170, hide: !columnVisibility.unit, headerClassName: "bold-header",
            // pinned: 'left', 
        },
        { field: "floor", headerName: "Floor", flex: 0, width: 170, hide: !columnVisibility.floor, headerClassName: "bold-header" },
        { field: "area", headerName: "Area", flex: 0, width: 150, hide: !columnVisibility.area, headerClassName: "bold-header" },
        { field: "biometricdeviceid", headerName: "Biometric Device ID", flex: 0, width: 170, hide: !columnVisibility.biometricdeviceid, headerClassName: "bold-header" },
        { field: "lastOnlineTimeC", headerName: "Last Online Status", flex: 0, width: 170, hide: !columnVisibility.lastOnlineTimeC, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Status",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', marginTop: 1 }}>
                    <Typography sx={{ color: params.data.status === "Active" ? "green" : "red" }}>{params.data.status}</Typography>
                </Grid>
            ),
        },
    ]

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            roundid: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            biometricdeviceid: item.biometricdeviceid,
            biometricserialno: item.biometricserialno,
            biometricassignedip: item.biometricassignedip,
            lastOnlineTimeC: item.lastOnlineTimeC,
            status: item.status,

        }
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
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {

        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
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

    const [fileFormat, setFormat] = useState('')

    const [status, setStatus] = useState([]);
    const [allValue, setAllValue] = useState([]);

    const commandMapping = [
        { label: "To Clear Admin Lock Send", value: "To Clear Admin Lock Send", deviceCommandN: 1 },
        { label: "Get Device Info (Registered User, FP, Face count)", value: "Get Device Info (Registered User, FP, Face count)", deviceCommandN: 2 },
        { label: "Get All Attendance log", value: "Get All Attendance log", deviceCommandN: 3 },
        { label: "Get All user info from biometric terminal (including RFID Card, Password, Fingerprint & Face template)", value: "Get All user info from biometric terminal (including RFID Card, Password, Fingerprint & Face template)", deviceCommandN: 4 },
        { label: "Upload User Info To another biometric terminal (including Name, PFID Card, Password, Fingerprint & Face)", value: "Upload User Info To another biometric terminal (including Name, PFID Card, Password, Fingerprint & Face)", deviceCommandN: 5 },
        { label: "Enable User", value: "Enable User", deviceCommandN: 6 },
        { label: "Disable User", value: "Disable User", deviceCommandN: 7 },
        { label: "Delete User", value: "Delete User", deviceCommandN: 8 },
    ];

    return (
        <Box>
            <Headtitle title={'BIOMETRIC STATUS LIST'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Biometric Status List"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Ac-Point Calculation"
                subpagename=""
                subsubpagename=""
            />

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lbiometricstatuslist") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Biometric Status List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(acPointCalculation?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelbiometricstatuslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAcpointcalculation()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvbiometricstatuslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAcpointcalculation()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>


                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printbiometricstatuslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfbiometricstatuslist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchAcpointcalculation()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagebiometricstatuslist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br />
                        <br />
                        {!sourceCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

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
                            :
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
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallFilterdataAllData}
                                />
                                <Popover
                                    id={idSearch}
                                    open={openSearch}
                                    anchorEl={anchorElSearch}
                                    onClose={handleCloseSearch}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                                >
                                    <Box style={{ padding: "10px", maxWidth: '450px' }}>
                                        <Typography variant="h6">Advance Search</Typography>
                                        <IconButton
                                            aria-label="close"
                                            onClick={handleCloseSearch}
                                            sx={{
                                                position: "absolute",
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.grey[500],
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <DialogContent sx={{ width: "100%" }}>
                                            <Box sx={{
                                                width: '350px',
                                                maxHeight: '400px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <Box sx={{
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    // paddingRight: '5px'
                                                }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Columns</Typography>
                                                            <Select fullWidth size="small"
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 200,
                                                                            width: "auto",
                                                                        },
                                                                    },
                                                                }}
                                                                style={{ minWidth: 150 }}
                                                                value={selectedColumn}
                                                                onChange={(e) => setSelectedColumn(e.target.value)}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="" disabled>Select Column</MenuItem>
                                                                {filteredSelectedColumn.map((col) => (
                                                                    <MenuItem key={col.field} value={col.field}>
                                                                        {col.headerName}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Operator</Typography>
                                                            <Select fullWidth size="small"
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 200,
                                                                            width: "auto",
                                                                        },
                                                                    },
                                                                }}
                                                                style={{ minWidth: 150 }}
                                                                value={selectedCondition}
                                                                onChange={(e) => setSelectedCondition(e.target.value)}
                                                                disabled={!selectedColumn}
                                                            >
                                                                {conditions.map((condition) => (
                                                                    <MenuItem key={condition} value={condition}>
                                                                        {condition}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Value</Typography>
                                                            <TextField fullWidth size="small"
                                                                value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                                                onChange={(e) => setFilterValue(e.target.value)}
                                                                disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                                                placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root.Mui-disabled': {
                                                                        backgroundColor: 'rgb(0 0 0 / 26%)',
                                                                    },
                                                                    '& .MuiOutlinedInput-input.Mui-disabled': {
                                                                        cursor: 'not-allowed',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        {additionalFilters.length > 0 && (
                                                            <>
                                                                <Grid item md={12} sm={12} xs={12}>
                                                                    <RadioGroup
                                                                        row
                                                                        value={logicOperator}
                                                                        onChange={(e) => setLogicOperator(e.target.value)}
                                                                    >
                                                                        <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                                        <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                                    </RadioGroup>
                                                                </Grid>
                                                            </>
                                                        )}
                                                        {additionalFilters.length === 0 && (
                                                            <Grid item md={4} sm={12} xs={12} >
                                                                <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                                    Add Filter
                                                                </Button>
                                                            </Grid>
                                                        )}

                                                        <Grid item md={2} sm={12} xs={12}>
                                                            <Button variant="contained" onClick={() => {
                                                                fetchEmployee();
                                                                setIsSearchActive(true);
                                                                setAdvancedFilter([
                                                                    ...additionalFilters,
                                                                    { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                                                ])
                                                            }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                                Search
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </DialogContent>
                                    </Box>
                                </Popover>
                            </>}

                    </Box>
                </>
            )
            }
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>
            {/* Edit DIALOG */}
            <Box>
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm"

                    fullWidth={true} sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}>
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Send Biometric Status</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Status <b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={commandMapping}
                                            styles={colourStyles}
                                            value={{
                                                label: biometricDeviceManagement.param1C,
                                                value: biometricDeviceManagement.param1C,
                                            }}
                                            onChange={(e) => {
                                                setBiometricDeviceManagement({
                                                    ...biometricDeviceManagement,
                                                    param1C: e.value,
                                                    deviceCommandN: e.deviceCommandN,
                                                    cloudIDC: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained"
                                        onClick={editSubmit}
                                        sx={buttonStyles.buttonsubmit}>
                                        {" "}
                                        <SendIcon />
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        <CancelScheduleSendIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
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
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={acpointCalculationArrayForExport ?? []}
                filename={"Biometric Status List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />




            {/* EXTERNAL COMPONENTS -------------- END */}

        </Box>
    );
}

export default BiometricstatusList;