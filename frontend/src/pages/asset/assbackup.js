import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PageHeading from "../../components/PageHeading";
import {
    Box, InputAdornment,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';

function AssetWorkStationUnassigned() {
    const [employees, setEmployees] = useState([]);
    const [assetDetails, setAssetDetails] = useState([]);

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

    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Maincabin",
        "Subcabin Name",
        "Subsubcabin Name",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "maincabin",
        "subcabinname",
        "subsubcabinname",
    ];



    //NEW TABLE
    const gridRefTableUserShift = useRef(null);
    const gridRefImageUserShift = useRef(null);

    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(employees);
    const [filteredRowData, setFilteredRowData] = useState([]);


    const [pageUserShift, setPageUserShift] = useState(1);
    const [pageSizeUserShift, setPageSizeUserShift] = useState(10);
    const [searchQueryUserShift, setSearchQueryUserShift] = useState("");
    const [totalPagesUserShift, setTotalPagesUserShift] = useState(1);


    // Search bar
    const [anchorElSearchUserShift, setAnchorElSearchUserShift] = React.useState(null);
    const handleClickSearchUserShift = (event) => {
        setAnchorElSearchUserShift(event.currentTarget);
    };
    const handleCloseSearchUserShift = () => {
        setAnchorElSearchUserShift(null);
        setSearchQuery("");
    };

    const openSearchUserShift = Boolean(anchorElSearchUserShift);
    const idSearchUserShift = openSearchUserShift ? 'simple-popover' : undefined;

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }


    // Pagination for innter filter
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageUserShift - 1);
        const endPage = Math.min(totalPagesUserShift, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageUserShift numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageUserShift, show ellipsis
        if (endPage < totalPagesUserShift) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageUserShift - 1) * pageSizeUserShift, pageUserShift * pageSizeUserShift);
    const totalPagesUserShiftOuter = Math.ceil(filteredDataItems?.length / pageSizeUserShift);
    const visiblePages = Math.min(totalPagesUserShiftOuter, 3);
    const firstVisiblePage = Math.max(1, pageUserShift - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesUserShiftOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageUserShift * pageSizeUserShift;
    const indexOfFirstItem = indexOfLastItem - pageSizeUserShift;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }



    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Asset Workstation Grouping Report"),
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


    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(
        UserRoleAccessContext
    );

    const accessbranch = isAssignBranch
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        fetchWorkStation();
        fetchAssetDetails();
        fetchAssetWorkStationGrouping();
    }, []);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [workStationOpt, setWorkStationOpt] = useState([]);

    const [isBankdetail, setBankdetail] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Asset Workstation Grouping Report.png");
                });
            });
        }
    };

    //for getting branch while loading
    const [getTeams, setGetTeams] = useState([]);

    //for workstation value get
    const [subsubcabinname, setSubsubcabinname] = useState({
        company: "",
        branch: "",
        unit: "",
        subsubcabinname: "",
    });

    const fetchWorkStation = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWorkStationOpt(res?.data?.locationgroupings);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    const [maintentancemasteredit, setMaintentancemasteredit] = useState({});
    const getviewCode = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        components,
        subsubcabinname,
        componentcodearray
    ) => {
        try {
            setMaintentancemasteredit({
                ...maintentancemasteredit,
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                assetmaterial: components,
                workstation: subsubcabinname,
                component: componentcodearray,
            });
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //allot model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const handleOpenModcheckbox = () => {
        setIsDeleteOpencheckbox(true);
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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    const oldrowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            maincabin: item.maincabin,
            subcabinname: item.subcabinname,
            subsubcabinname: item.subsubcabinname,
        };
    });

    let allComponents = {};
    const filteredAssets = assetDetails.filter((asset) => {
        // Check if company, branch, unit, floor, area match
        const matches = oldrowDataTable.some((row) => {
            const locationMatches =
                asset.location === "ALL"
                    ? row.company === asset.company &&
                    row.branch === asset.branch &&
                    row.unit === asset.unit &&
                    row.floor === asset.floor &&
                    row.area === asset.area
                    : row.company === asset.company &&
                    row.branch === asset.branch &&
                    row.unit === asset.unit &&
                    row.floor === asset.floor &&
                    row.area === asset.area &&
                    row.location === asset.location;

            return locationMatches;
        });
        return matches;
    });

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        maincabin: true,
        subcabinname: true,
        subsubcabinname: true,
        actions: true,
        // ...allComponents,
        ...filteredAssets.reduce((acc, day) => {

            acc[`${day.component}`] = true
            return acc;
        }, {})
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [maxSelections, setMaxSelections] = useState(0);

    // get single userdata to view

    const [userReport, setUserReport] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        area: "",
        location: "",
        maincabin: "",
        subcabinname: "",
        subsubcabinname: "",
    });
    //get all employees list details
    const fetchEmployee = async () => {
        setPageName(!pageName)
        const accessmodule = [];

        isAssignBranch.map((data) => {
            let fetfinalurl = [];

            if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
                data?.subsubpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
                fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0) {
                fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            }
            accessmodule.push(fetfinalurl);
        });

        const uniqueValues = [...new Set(accessmodule.flat())];

        if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {

            try {
                let exactWorkstation = [];
                let exactWorkstaionobjects = [];
                // let res_workstations = await axios.get(SERVICE.WORKSTATION);
                let res_workstations = await axios.post(SERVICE.WORKSTATION_ACCESS, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignbranch: accessbranch,
                });

                res_workstations?.data?.locationgroupings.forEach((workstation) => {
                    workstation.combinstation.forEach((combinstation) => {
                        combinstation.subTodos.forEach((finalcabin) => {
                            exactWorkstation.push(
                                `${workstation.company}_${workstation.branch}_${workstation.unit}_${finalcabin.subcabinname}`
                            );
                            exactWorkstaionobjects.push({
                                _id: finalcabin._id,
                                company: workstation.company,
                                branch: workstation.branch,
                                unit: workstation.unit,
                                floor: workstation.floor,
                                area: workstation.area,
                                location: workstation.location,
                                maincabin: workstation.maincabin,
                                subcabinname: combinstation.cabinname,
                                subsubcabinname: finalcabin.subcabinname,
                                checking: `${workstation.company}_${workstation.branch}_${workstation.unit}_${finalcabin.subcabinname}`,
                            });
                        });
                    });
                });
                let uniqueExactWorkstation = [...new Set(exactWorkstation)];
                setBankdetail(true);

                setEmployees(exactWorkstaionobjects);
            } catch (err) {
                setBankdetail(true);
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
        else {
            setBankdetail(true)
            setEmployees([]);
        }
    }


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Asset Workstation Grouping Report",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchEmployee();
    }, []);
    // }, [accessbranch, employees]);

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            id: item._id,
        }));
        setItems(itemsWithSerialNumber);
        setFilteredDataItems(itemsWithSerialNumber);

    };

    useEffect(() => {
        addSerialNumber();
    }, [employees]);

    //Datatable
    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = employees?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageUserShift(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = employees?.filter((item) => {
            return filters.reduce((acc, filter, index) => {
                const { column, condition, value } = filter;
                const itemValue = String(item[column])?.toLowerCase();
                const filterValue = String(value).toLowerCase();

                let match;
                switch (condition) {
                    case "Contains":
                        match = itemValue.includes(filterValue);
                        break;
                    case "Does Not Contain":
                        match = !itemValue?.includes(filterValue);
                        break;
                    case "Equals":
                        match = itemValue === filterValue;
                        break;
                    case "Does Not Equal":
                        match = itemValue !== filterValue;
                        break;
                    case "Begins With":
                        match = itemValue.startsWith(filterValue);
                        break;
                    case "Ends With":
                        match = itemValue.endsWith(filterValue);
                        break;
                    case "Blank":
                        match = !itemValue;
                        break;
                    case "Not Blank":
                        match = !!itemValue;
                        break;
                    default:
                        match = true;
                }

                // Combine conditions with AND/OR logic
                if (index === 0) {
                    return match; // First filter is applied directly
                } else if (logicOperator === "AND") {
                    return acc && match;
                } else {
                    return acc || match;
                }
            }, true);
        });

        setFilteredDataItems(filtered); // Update filtered data
        setAdvancedFilter(filters);
        // handleCloseSearchUserShift(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryUserShift("");
        setFilteredDataItems(employees);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryUserShift;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesUserShift) {
            setPageUserShift(newPage);
            gridRefTableUserShift.current.api.paginationGoToPage(newPage - 1);
            setSelectedRows([]);
            setSelectAllChecked(false);
            gridApi.deselectAll();
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeUserShift(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
        setSelectedRows([]);
    };


    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryUserShift(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };


    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });



    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );




    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true
        };
    }, []);

    const maxPinnedColumns = 3; // Define the limit for pinned columns
    const pinnedColumnsQueue = useRef([]); // Track pinned columns order

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

    // Handler for column pinning 
    const onColumnPinned = (event) => {
        // Ensure columnApi is available before using it
        if (!columnApi) return;

        const column = event.column;
        const pinned = event.pinned; // 'left', 'right', or null (unpinned)

        if (pinned === 'left') {
            // Add newly pinned column to the queue
            pinnedColumnsQueue.current.push(column);

            // If pinned columns exceed the limit, unpin the oldest column
            if (pinnedColumnsQueue.current.length > maxPinnedColumns) {
                const oldestPinnedColumn = pinnedColumnsQueue.current.shift(); // Get first pinned column
                columnApi.setColumnPinned(oldestPinnedColumn, null); // Unpin the oldest column
            }
        } else if (pinned === null) {
            // If a column is unpinned, remove it from the queue
            pinnedColumnsQueue.current = pinnedColumnsQueue.current.filter(col => col !== column);
        }
    };

    // Function to handle filter changes
    const onFilterChanged = () => {
        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
            } else {
                // Filters are active, capture filtered data
                const filteredData = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredData.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableUserShift.current) {
            const gridApi = gridRefTableUserShift.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesUserShift = gridApi.paginationGetTotalPages();
            setPageUserShift(currentPage);
            setTotalPagesUserShift(totalPagesUserShift);
        }
    }, []);



    const selection = useMemo(() => {
        return {
            mode: "multiRow",
        };
    }, []);




    const fetchAssetDetails = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ASSETDETAIL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let sub = res.data.assetdetails?.filter(
                (item) => item?.workcheck === false
            );
            setAssetDetails(res.data.assetdetails);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const [assetGroupingDatas, setAssetGroupingDatas] = useState([]);
    const [existingAssetGroupingDatas, setExistingAssetGroupingDatas] = useState(
        []
    );
    const fetchAssetWorkStationGrouping = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const newData = res_project?.data?.assetworkstationgrouping.map((obj) => {
                // Extracting the part before the first opening parenthesis
                const newWorkstation = obj.workstation.split("(")[0].trim();

                // Creating a new object with the modified workstation
                return {
                    ...obj,
                    workstation: newWorkstation,
                };
            });

            const exsistingDatas = newData?.flatMap((data) => data?.component);

            setAssetGroupingDatas(newData);
            setExistingAssetGroupingDatas(exsistingDatas);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [datasToAllot, setDatasToAllot] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        area: "",
        location: "",
        subsubcabinname: "",
        component: "",
        newArray: "",
    });
    const groupComponentArray = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        subsubcabinname,
        component,
        componentcodearray
    ) => {
        const filteredAssets = assetDetails
            ?.filter(
                (data) =>
                    data.company === company &&
                    data.branch === branch &&
                    data.unit === unit &&
                    data.floor === floor &&
                    data.area === area &&
                    (data.location === location || data.location === "ALL") &&
                    data.component === component
            )
            ?.map((data) => `${component}-${data?.code}`);

        const subArrayCodes = componentcodearray?.flatMap(
            (item) => item?.componentCode
        );

        const oldArray = filteredAssets?.filter(
            (item) => !subArrayCodes.includes(item)
        );
        const newArray = oldArray?.filter(
            (item) => !existingAssetGroupingDatas.includes(item)
        );

        if (newArray?.length === 0) {
            setPopupContentMalert("No Material To Allot for this Work Station!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setDatasToAllot({
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                subsubcabinname: subsubcabinname,
                component: component,
                newArray: newArray[0],
            });
            handleOpenModcheckbox();
        }
    };

    const createAssetGrouping = async () => {
        try {
            axios.post(`${SERVICE.ASSETWORKSTATIONGROUP_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(datasToAllot?.company),
                branch: String(datasToAllot?.branch),
                unit: String(datasToAllot?.unit),
                floor: String(datasToAllot?.floor),
                location: String(datasToAllot?.location),
                area: String(datasToAllot?.area),

                // subcomponents: subarray,
                assetmaterial: String(datasToAllot?.component),
                component: [datasToAllot?.newArray],
                workstation: String(
                    `${datasToAllot?.subsubcabinname}(${datasToAllot?.branch}-${datasToAllot?.floor})`
                ),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            await fetchAssetDetails();
            await fetchAssetWorkStationGrouping();
            handleCloseModcheckbox();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };




    // Extract components from filteredAssets
    const components = [
        ...new Set(filteredAssets?.flatMap((asset) => asset?.component)),
    ];

    // Merge components into rowDataTable
    // const rowDataTable = oldrowDataTable.map((row) => ({
    //   ...row,
    //   components: components.filter((component) =>
    //     filteredAssets.some(
    //       (asset) =>
    //         asset.company === row.company &&
    //         asset.branch === row.branch &&
    //         asset.unit === row.unit &&
    //         asset.floor === row.floor &&
    //         asset.area === row.area &&
    //         asset.component === component
    //     )
    //   ),
    // }));

    const rowDataTable = oldrowDataTable.map((row) => {
        const concatenatedComponents = components.flatMap((component) =>
            assetGroupingDatas
                .filter(
                    (asset) =>
                        asset.company === row.company &&
                        asset.branch === row.branch &&
                        asset.unit === row.unit &&
                        asset.floor === row.floor &&
                        asset.area === row.area &&
                        asset.location === row.location &&
                        asset.workstation === row.subsubcabinname &&
                        asset.assetmaterial === component
                )
                .map((asset) => ({
                    component: component,
                    componentCode: asset.component,
                }))
        );

        return {
            ...row,
            components: components.filter((component) =>
                filteredAssets.some(
                    (asset) =>
                        asset.company === row.company &&
                        asset.branch === row.branch &&
                        asset.unit === row.unit &&
                        asset.floor === row.floor &&
                        asset.area === row.area &&
                        asset.component === component
                )
            ),
            componentcodearray: concatenatedComponents,
        };
    });

    // Create a Set to store unique components
    const uniqueComponents = new Set();

    // Create the new array of objects




    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            headerComponent: (params) => (
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

            cellRenderer: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.data.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.data.id)) {
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.data.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.data.id];
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
            width: 75,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        // { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        // { field: "companyname", headerName: "Name", flex: 0, width: 200, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 150,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "maincabin",
            headerName: "Maincabin",
            flex: 0,
            width: 100,
            hide: !columnVisibility.maincabin,
            headerClassName: "bold-header",
        },
        {
            field: "subcabinname",
            headerName: "Subcabin Name",
            flex: 0,
            width: 100,
            hide: !columnVisibility.subcabinname,
            headerClassName: "bold-header",
        },
        {
            field: "subsubcabinname",
            headerName: "Subsubcabin Name",
            flex: 0,
            width: 100,
            hide: !columnVisibility.subsubcabinname,
            headerClassName: "bold-header",
        },
        // ...newArrayOfObjects,

        ...filteredAssets?.map((result, asset) => {
            // Check if the component is already added to the Set
            if (!uniqueComponents.has(asset.component)) {
                // If not, add it to the Set and add the object to the result array

                uniqueComponents.add(asset.component);
                return {
                    field: `${asset.component}`,
                    headerName: `${asset.component}`,
                    flex: 0,
                    width: 120,
                    hide: !columnVisibility[`${asset.component}`],
                    headerClassName: "bold-header",
                    cellRenderer: (params) => (
                        <Grid sx={{ display: "flex" }}>
                            {isUserRoleCompare?.includes("eassetworkstationgroupingreport") && (
                                <>
                                    {params?.data?.components?.includes(asset.component) && (
                                        <>
                                            {params?.data?.componentcodearray?.filter(
                                                (data) => data.component === asset.component
                                            )?.length === 0 ? (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        ...userStyle.buttonedit,
                                                        padding: "8px 12px", // Adjust padding
                                                        fontSize: "10px", // Adjust font size
                                                    }}
                                                    onClick={() => {
                                                        groupComponentArray(
                                                            params.data.company,
                                                            params.data.branch,
                                                            params.data.unit,
                                                            params.data.floor,
                                                            params.data.area,
                                                            params.data.location,
                                                            params.data.subsubcabinname,
                                                            asset.component,
                                                            params?.data?.componentcodearray?.filter(
                                                                (data) => data.component === asset.component
                                                            )
                                                        );
                                                    }}
                                                >
                                                    ALLOT
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        ...userStyle.buttonedit,
                                                        background: "green",
                                                        padding: "8px 12px", // Adjust padding
                                                        fontSize: "10px", // Adjust font size
                                                    }}
                                                    onClick={() => {
                                                        groupComponentArray(
                                                            params.data.company,
                                                            params.data.branch,
                                                            params.data.unit,
                                                            params.data.floor,
                                                            params.data.area,
                                                            params.data.location,
                                                            params.data.subsubcabinname,
                                                            asset.component,
                                                            params?.data?.componentcodearray?.filter(
                                                                (data) => data.component === asset.component
                                                            )
                                                        );
                                                    }}
                                                >
                                                    ALLOTED{" "}
                                                    {
                                                        params?.data?.componentcodearray
                                                            ?.filter(
                                                                (data) => data.component === asset.component
                                                            )
                                                            ?.flatMap((data) => data.componentCode)?.length
                                                    }
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                    ),
                };
            }

            // const objectFromArray = result?.map((data) => data?.field);

            // allComponents = objectFromArray?.reduce((obj, item) => {
            //   obj[item] = true;
            //   return obj;
            // }, {});

            // return result;
        },),

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vassetmaterialip") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.components,
                                    params.data.subsubcabinname,
                                    params?.data?.componentcodearray?.flatMap(
                                        (item) => item?.componentCode
                                    )
                                );
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

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
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const columnMoveRef = useRef(0);
    const columnMoveLimit = 3; // Limit for column moves
    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibility((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisible = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // new code for toggle based on the remove columns
    const toggleColumnVisibility = (field) => {
        if (!gridApi) return;

        setColumnVisibility((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
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
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
        </Box>
    )


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

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"ASSET WORKSTATION GROUPING REPORT"} />
            {/* <Typography sx={userStyle.HeaderText}>
        Asset Workstation Grouping Report
      </Typography> */}
            <PageHeading
                title=" Asset Workstation Grouping"
                modulename="Asset"
                submodulename="Asset Details"
                mainpagename="Asset WorkStation Grouping Report"
                subpagename=""
                subsubpagename=""
            />
            <br />
            {isUserRoleCompare?.includes("lassetworkstationgroupingreport") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Asset Workstation Grouping Report List
                            </Typography>
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
                                        <MenuItem value={employees?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes(
                                        "excelassetworkstationgroupingreport"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "csvassetworkstationgroupingreport"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "printassetworkstationgroupingreport"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "pdfassetworkstationgroupingreport"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "imageassetworkstationgroupingreport"
                                    ) && (
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
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        {/* <Typography>Search</Typography> */}
                                        <OutlinedInput size="small"
                                            id="outlined-adornment-weight"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <FaSearch />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    {advancedFilter && (
                                                        <IconButton onClick={handleResetSearch}>
                                                            <MdClose />
                                                        </IconButton>
                                                    )}
                                                    <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchUserShift} />
                                                </InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{ 'aria-label': 'weight', }}
                                            type="text"
                                            value={getSearchDisplay()}
                                            onChange={handleSearchChange}
                                            placeholder="Type to search..."
                                            disabled={!!advancedFilter}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={() =>
                                setColumnVisibility({
                                    ...initialColumnVisibility,
                                    // ...allComponents,
                                })
                            }
                        >
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        <br />
                        <br />
                        {!isBankdetail ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
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
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageUserShift} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        ref={gridRefTableUserShift}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeUserShift}
                                        onPaginationChanged={onPaginationChanged}
                                        onGridReady={onGridReady}
                                        onColumnPinned={onColumnPinned}
                                        onColumnMoved={handleColumnMoved}
                                        onColumnVisible={handleColumnVisible}
                                        // onSelectionChanged={onSelectionChanged}
                                        rowSelection="multiple"
                                        selection={selection}
                                        onFilterChanged={onFilterChanged}
                                        suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressRowClickSelection={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                    />
                                </Box><br />
                                <Box style={userStyle.dataTablestyle}>
                                    {/* show and hide based on the inner filter and outer filter */}
                                    <Box>
                                        Showing{" "}
                                        {filteredRowData.length > 0
                                            ? (filteredRowData.length > 0 ? (pageUserShift - 1) * pageSizeUserShift + 1 : 0)
                                            : (filteredDataItems.length > 0 ? (pageUserShift - 1) * pageSizeUserShift + 1 : 0)}
                                        {" "}to{" "}
                                        {filteredRowData.length > 0
                                            ? Math.min(pageUserShift * pageSizeUserShift, filteredRowData.length)
                                            : Math.min(pageUserShift * pageSizeUserShift, filteredDataItems.length)}
                                        {" "}of{" "}
                                        {filteredRowData.length > 0 ? filteredRowData.length : filteredDataItems.length} entries
                                    </Box>

                                    {/* Pagination Controls */}
                                    <Box>
                                        <Button onClick={() => handlePageChange(1)} disabled={pageUserShift === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChange(pageUserShift - 1)} disabled={pageUserShift === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {/* Display the dynamic pageUserShift numbers */}
                                        {getVisiblePageNumbers().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                                                sx={{
                                                    ...userStyle.paginationbtn,
                                                    ...(pageNumber === "..." && {
                                                        cursor: "default",
                                                        color: "black", // Customize the color
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: "transparent",
                                                        border: "none", // Remove borders for "..."
                                                        "&:hover": {
                                                            backgroundColor: "transparent", // Disable hover effect for "..."
                                                            boxShadow: "none",
                                                        },
                                                    }),
                                                }}
                                                className={pageUserShift === pageNumber ? "active" : ""}
                                            // disabled={pageNumber === "..."}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChange(pageUserShift + 1)} disabled={pageUserShift === totalPagesUserShift} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChange(totalPagesUserShift)} disabled={pageUserShift === totalPagesUserShift} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
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
            <Popover
                id={idSearchUserShift}
                open={openSearchUserShift}
                anchorEl={anchorElSearchUserShift}
                onClose={handleCloseSearchUserShift}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
            >
                <Box sx={{ padding: '10px' }}>
                    <AdvancedSearchBar columns={columnDataTable} onSearch={applyAdvancedFilter} initialSearchValue={searchQuery} />
                </Box>
            </Popover>
            {/* Delete Modal */}

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
                        <QuestionMarkIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography
                            variant="h5"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Do You Want to Allot {datasToAllot?.component} to{" "}
                            {datasToAllot?.subsubcabinname} ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModcheckbox}
                            variant="contained"
                            color="error"
                        >
                            No
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="success"
                            onClick={(e) => createAssetGrouping()}
                        >
                            {" "}
                            Yes{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* view model */}

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Asset Workstation Grouping Report
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintentancemasteredit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{maintentancemasteredit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{maintentancemasteredit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{maintentancemasteredit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{maintentancemasteredit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{maintentancemasteredit.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> workstation</Typography>
                                    <Typography>{maintentancemasteredit.workstation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <TableContainer component={Paper}>
                                    <Table
                                        sx={{ minWidth: 700 }}
                                        aria-label="customized table"
                                        id="usertable"
                                    >
                                        <TableHead sx={{ fontWeight: "600" }}>
                                            <StyledTableRow>
                                                <StyledTableCell>S.No</StyledTableCell>
                                                <StyledTableCell>Material</StyledTableCell>
                                                <StyledTableCell>Asset Material</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody align="left">
                                            {maintentancemasteredit?.component?.length === 0 ? (
                                                <StyledTableRow>
                                                    {" "}
                                                    <StyledTableCell colSpan={8} align="center">
                                                        No Data Available
                                                    </StyledTableCell>{" "}
                                                </StyledTableRow>
                                            ) : (
                                                <>
                                                    {maintentancemasteredit?.assetmaterial?.map(
                                                        (material, index) => {
                                                            const matchingComponents =
                                                                maintentancemasteredit?.component?.filter(
                                                                    (component) =>
                                                                        component?.startsWith(`${material}-`)
                                                                );

                                                            // Check if there are matching components for the current material
                                                            if (matchingComponents.length === 0) {
                                                                return null; // Skip rendering this row
                                                            }

                                                            return (
                                                                <StyledTableRow key={index}>
                                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                                    <StyledTableCell>{material}</StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {matchingComponents
                                                                            ?.map((t, i) => t)
                                                                            ?.toString()}
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={employees ?? []}
                filename={"AssetWorkstationGroupingReport"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default AssetWorkStationUnassigned;
