import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaEdit, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import AdvancedSearchBar from '../../components/SearchbarEbList';
import ManageColumnsContent from "../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function LeaveBlockDayList() {


    const gridRefTableBlockDay = useRef(null);
    const gridRefImageBlockDay = useRef(null);

    const [leavecriteriaEdit, setLeavecriteriaEdit] = useState({});

    const [leavecriterias, setLeavecriterias] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [leavecriteriaCheck, setLeavecriteriacheck] = useState(false);

    const [todosCheck, setTodosCheck] = useState([]);
    const [editingIndexCheck, setEditingIndexCheck] = useState(-1);
    const [selectedOptionsDayEdit, setSelectedOptionsDayEdit] = useState([]);
    const [valueDayEdit, setValueDayEdit] = useState([]);
    const [todoSubmit, setTodoSubmit] = useState(false);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(leavecriterias);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    const days = [
        { label: 'Monday', value: "Monday" },
        { label: 'Tuesday', value: "Tuesday" },
        { label: 'Wednesday', value: "Wednesday" },
        { label: 'Thursday', value: "Thursday" },
        { label: 'Friday', value: "Friday" },
        { label: 'Saturday', value: "Saturday" },
        { label: 'Sunday', value: "Sunday" },
    ];
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const getCurrentWeekOfMonth = () => {
        const date = new Date();
        const startWeekDayIndex = 1; // Assuming week starts on Monday
        const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDay = firstDate.getDay();
        const offset = (firstDay - startWeekDayIndex + 7) % 7;
        return Math.ceil((date.getDate() + offset) / 7);
    };

    const currentWeek = getCurrentWeekOfMonth();

    //Datatable
    const [pageBlockDay, setPageBlockDay] = useState(1);
    const [pageSizeBlockDay, setPageSizeBlockDay] = useState(10);
    const [searchQueryBlockDay, setSearchQueryBlockDay] = useState("");
    const [totalPagesBlockDay, setTotalPagesBlockDay] = useState(1);

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); setEditingIndexCheck(-1); };
    const handleCloseview = () => {
        setOpenview(false);
        setSelectedOptionsDayEdit([]);
        setEditingIndexCheck(-1);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Manage Columns
    const [isManageColumnsOpenBlockDay, setManageColumnsOpenBlockDay] = useState(false);
    const [searchQueryManageBlockDay, setSearchQueryManageBlockDay] = useState("");
    const [anchorElBlockDay, setAnchorElBlockDay] = useState(null);

    const handleOpenManageColumnsBlockDay = (event) => {
        setAnchorElBlockDay(event.currentTarget);
        setManageColumnsOpenBlockDay(true);
    };
    const handleCloseManageColumnsBlockDay = () => {
        setManageColumnsOpenBlockDay(false);
        setSearchQueryManageBlockDay("");
    };

    const openBlockDay = Boolean(anchorElBlockDay);
    const idBlockDay = openBlockDay ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchBlockDay, setAnchorElSearchBlockDay] = React.useState(null);
    const handleClickSearchBlockDay = (event) => {
        setAnchorElSearchBlockDay(event.currentTarget);
    };
    const handleCloseSearchBlockDay = () => {
        setAnchorElSearchBlockDay(null);
        setSearchQueryBlockDay("");
    };

    const openSearchBlockDay = Boolean(anchorElSearchBlockDay);
    const idSearchBlockDay = openSearchBlockDay ? 'simple-popover' : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibilityBlockDay = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        department: true,
        designation: true,
        leavetype: true,
        tookleavecheck: true,
        weekstartday: true,
        // tookleave: true,
        actions: true,
    };

    const [columnVisibilityBlockDay, setColumnVisibilityBlockDay] = useState(initialColumnVisibilityBlockDay);

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Block Days List"),
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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const handleDayChangeEdit = (options) => {

        setValueDayEdit(
            options.map((a, index) => {
                return a.value;
            })
        );

        setSelectedOptionsDayEdit(options);
    };

    const customValueRendererDayEdit = (valueDayEdit, _documents) => {
        return valueDayEdit?.length ? valueDayEdit.map(({ label }) => label).join(", ") : "Please Select Day";
    };

    const handleDeleteTodoCheck = (index) => {
        const newTodoscheck = [...todosCheck];
        newTodoscheck.splice(index, 1);
        setTodosCheck(newTodoscheck);
    };

    const handleEditTodoCheck = (index) => {
        setEditingIndexCheck(index);

        setValueDayEdit(
            todosCheck[index]?.day?.map((a, index) => {
                return a?.value;
            })
        );
        setSelectedOptionsDayEdit(todosCheck[index].day.map((item) => ({
            ...item,
            label: item,
            value: item,
        })));


    };

    const handleUpdateTodoCheck = () => {

        const day = selectedOptionsDayEdit ? selectedOptionsDayEdit.map(item => item.value) : "";

        const newTodoscheck = [...todosCheck];

        newTodoscheck[editingIndexCheck].day = day;

        setTodosCheck(newTodoscheck);
        setEditingIndexCheck(-1);
        setValueDayEdit("")

    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriaEdit(res?.data?.sleavecriteria);
            let uniqueDayNames = Array.from(new Set(res?.data?.sleavecriteria?.tookleave.map((t) => t.day)));

            const mergedTodoList = res?.data?.sleavecriteria?.tookleave.reduce((acc, current) => {
                const existingEntry = acc.find(
                    item => item.year === current.year && item.month === current.month && item.week === current.week
                );

                if (existingEntry) {
                    existingEntry.day.push(current.day);
                } else {
                    acc.push({
                        year: current.year,
                        month: current.month,
                        week: current.week,
                        day: [current.day]
                    });
                }

                return acc;
            }, []);

            setTodosCheck(mergedTodoList.filter(data => Number(data.year) === currentYear));
            setSelectedOptionsDayEdit(uniqueDayNames.map((t) => ({
                label: t,
                value: t
            })));
            setValueDayEdit(uniqueDayNames);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = leavecriteriaEdit?.updatedby;
    let subprojectsid = leavecriteriaEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)

        let newTodoCheckList = [];
        todosCheck.map((todo) => {
            todo.day.map((day) => {
                newTodoCheckList.push({
                    year: todo.year,
                    month: todo.month,
                    week: todo.week,
                    day: day
                });
            })
        })

        try {
            let res = await axios.put(`${SERVICE.LEAVECRITERIA_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                tookleave: newTodoCheckList,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchLeavecriteria();
            handleCloseview();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        if (selectedOptionsDayEdit.length === 0) {
            setPopupContentMalert("Please Select Day!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (todoSubmit === true) {
            setPopupContentMalert("Please Update the todo and Submit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteria = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const itemsWithSerialNumber = res_vendor?.data?.leavecriterias?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                employee: item.employee,
                department: item.department,
                designation: item.designation,
                leavetype: item.leavetype,
                tookleavecheck: item.tookleavecheck ? "YES" : "NO",
                weekstartday: item.weekstartday,
            }));
            setLeavecriteriacheck(true);
            setLeavecriterias(itemsWithSerialNumber);
            setFilteredDataItems(itemsWithSerialNumber);
            setTotalPagesBlockDay(Math.ceil(itemsWithSerialNumber.length / pageSizeBlockDay));
        } catch (err) { setLeavecriteriacheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        fetchLeavecriteria();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(leavecriterias);
    }, [leavecriterias]);

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

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
        if (gridRefTableBlockDay.current) {
            const gridApi = gridRefTableBlockDay.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesBlockDay = gridApi.paginationGetTotalPages();
            setPageBlockDay(currentPage);
            setTotalPagesBlockDay(totalPagesBlockDay);
        }
    }, []);

    const columnDataTableBlockDay = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityBlockDay.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "department", headerName: "Department", flex: 0, width: 150, hide: !columnVisibilityBlockDay.department, headerClassName: "bold-header" },
        { field: "designation", headerName: "Designation", flex: 0, width: 150, hide: !columnVisibilityBlockDay.designation, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibilityBlockDay.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityBlockDay.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilityBlockDay.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibilityBlockDay.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 150, hide: !columnVisibilityBlockDay.employee, headerClassName: "bold-header" },
        { field: "leavetype", headerName: "Leavetype", flex: 0, width: 100, hide: !columnVisibilityBlockDay.leavetype, headerClassName: "bold-header" },
        { field: "tookleavecheck", headerName: "Took Leave", flex: 0, width: 90, hide: !columnVisibilityBlockDay.tookleavecheck, headerClassName: "bold-header" },
        { field: "weekstartday", headerName: "Week Start Day", flex: 0, width: 90, hide: !columnVisibilityBlockDay.weekstartday, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 90,
            minHeight: "40px !important",
            filter: false,
            sortable: false,
            hide: !columnVisibilityBlockDay.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vblockdayslist") && (
                        <Box>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    handleClickOpenview();
                                    getviewCode(params.data.id);
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        </Box>
                    )}
                </Grid>
            ),
        },
    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryBlockDay(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = items?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageBlockDay(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = items?.filter((item) => {
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
        // handleCloseSearchBlockDay(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryBlockDay("");
        setFilteredDataItems(leavecriterias);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableBlockDay.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryBlockDay;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesBlockDay) {
            setPageBlockDay(newPage);
            gridRefTableBlockDay.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeBlockDay(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityBlockDay };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityBlockDay(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityBlockDay");
        if (savedVisibility) {
            setColumnVisibilityBlockDay(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityBlockDay", JSON.stringify(columnVisibilityBlockDay));
    }, [columnVisibilityBlockDay]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableBlockDay.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageBlockDay.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        if (!gridApi) return;

        setColumnVisibilityBlockDay((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityBlockDay((prevVisibility) => {
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
        setColumnVisibilityBlockDay((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Department", "Designation", "Company", "Branch", "Unit", "Team", "Employee", "Leavetype", "Took Leave", "Week Start Day",]
    let exportRowValuescrt = ["department", "designation", "company", "branch", "unit", "team", "employee", "leavetype", "tookleavecheck", "weekstartday",]

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Leave Block Day",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageBlockDay.current) {
            domtoimage.toBlob(gridRefImageBlockDay.current)
                .then((blob) => {
                    saveAs(blob, "Leave Block Day.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Pagination for innter filter
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageBlockDay - 1);
        const endPage = Math.min(totalPagesBlockDay, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageBlockDay numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageBlockDay, show ellipsis
        if (endPage < totalPagesBlockDay) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageBlockDay - 1) * pageSizeBlockDay, pageBlockDay * pageSizeBlockDay);
    const totalPagesBlockDayOuter = Math.ceil(filteredDataItems?.length / pageSizeBlockDay);
    const visiblePages = Math.min(totalPagesBlockDayOuter, 3);
    const firstVisiblePage = Math.max(1, pageBlockDay - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesBlockDayOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageBlockDay * pageSizeBlockDay;
    const indexOfFirstItem = indexOfLastItem - pageSizeBlockDay;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"Leave Block Day"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Leave Block Day"
                modulename="Leave&Permission"
                submodulename="Leave"
                mainpagename="Block Days List"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lblockdayslist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Leave Block Day List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeBlockDay}
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
                                        <MenuItem value={leavecriterias?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelblockdayslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvblockdayslist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printblockdayslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfblockdayslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageblockdayslist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
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
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchBlockDay} />
                                                    </span>
                                                </Tooltip>
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
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsBlockDay}> Manage Columns </Button>  <br /><br />
                        {!leavecriteriaCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageBlockDay} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableBlockDay.filter((column) => columnVisibilityBlockDay[column.field])}
                                        ref={gridRefTableBlockDay}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeBlockDay}
                                        onPaginationChanged={onPaginationChanged}
                                        onGridReady={onGridReady}
                                        onColumnMoved={handleColumnMoved}
                                        onColumnVisible={handleColumnVisible}
                                        onFilterChanged={onFilterChanged}
                                        // suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                        cellSelection={true}
                                        copyHeadersToClipboard={true}
                                    />
                                </Box>
                                {/* show and hide based on the inner filter and outer filter */}
                                {/* <Box style={userStyle.dataTablestyle}>
                                <Box>
                                        Showing{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                (filteredDataItems.length > 0 ? (pageBlockDay - 1) * pageSizeBlockDay + 1 : 0)
                                            ) : (
                                                filteredRowData.length > 0 ? (pageBlockDay - 1) * pageSizeBlockDay + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageBlockDay * pageSizeBlockDay, filteredDataItems.length)
                                            ) : (
                                                filteredRowData.length > 0 ? Math.min(pageBlockDay * pageSizeBlockDay, filteredRowData.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItems.length
                                            ) : (
                                                filteredRowData.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChange(1)} disabled={pageBlockDay === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChange(pageBlockDay - 1)} disabled={pageBlockDay === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbers().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                                                sx={{
                                                    ...userStyle.paginationbtn,
                                                    ...(pageNumber === "..." && {
                                                        cursor: "default",
                                                        color: "black", 
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: "transparent",
                                                        border: "none", 
                                                        "&:hover": {
                                                            backgroundColor: "transparent", 
                                                            boxShadow: "none",
                                                        },
                                                    }),
                                                }}
                                                className={pageBlockDay === pageNumber ? "active" : ""}
                                                disabled={pageBlockDay === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChange(pageBlockDay + 1)} disabled={pageBlockDay === totalPagesBlockDay} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChange(totalPagesBlockDay)} disabled={pageBlockDay === totalPagesBlockDay} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        )}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={idBlockDay}
                open={isManageColumnsOpenBlockDay}
                anchorEl={anchorElBlockDay}
                onClose={handleCloseManageColumnsBlockDay}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsBlockDay}
                    searchQuery={searchQueryManageBlockDay}
                    setSearchQuery={setSearchQueryManageBlockDay}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityBlockDay}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityBlockDay}
                    initialColumnVisibility={initialColumnVisibilityBlockDay}
                    columnDataTable={columnDataTableBlockDay}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchBlockDay}
                open={openSearchBlockDay}
                anchorEl={anchorElSearchBlockDay}
                onClose={handleCloseSearchBlockDay}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableBlockDay?.filter(data => data.field !== 'actions')} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryBlockDay} handleCloseSearch={handleCloseSearchBlockDay} />
            </Popover>

            {/* View Model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
                <DialogContent >
                    <Box sx={{ padding: '20px 20px', width: "800px" }}>
                        <Typography sx={userStyle.HeaderText}>
                            <b>View Leave Block Day</b>{" "}
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <Typography><b>Year</b></Typography>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <Typography><b>Month</b></Typography>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <Typography><b>Week</b></Typography>
                                    </Grid>
                                    <Grid item md={3.5} sm={12} xs={12}>
                                        <Typography><b>Day</b></Typography>
                                    </Grid>
                                </Grid><br />

                                {todosCheck?.length > 0 &&
                                    todosCheck.map((todo, index) => {
                                        const todoMonthIndex = monthstring.indexOf(todo.month);
                                        const todoWeekNumber = parseInt(todo.week.match(/\d+/)[0], 10);
                                        const isFutureMonth = (parseInt(todo.year) > currentYear) || (parseInt(todo.year) === currentYear && todoMonthIndex > currentMonthIndex);
                                        const isFutureWeek = (parseInt(todo.year) === currentYear && todoMonthIndex === currentMonthIndex && todoWeekNumber > currentWeek);

                                        return (
                                            < div key={index} >
                                                {editingIndexCheck === index ? (
                                                    <Grid container spacing={2}>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.year}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.month}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12} >
                                                            <Typography>{todo.week}</Typography>
                                                        </Grid>
                                                        <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                            <FormControl size="small" sx={{ width: "100%", maxWidth: "400px" }}>
                                                                <MultiSelect
                                                                    options={days}
                                                                    value={selectedOptionsDayEdit}
                                                                    onChange={handleDayChangeEdit}
                                                                    valueRenderer={customValueRendererDayEdit}
                                                                    labelledBy="Please Select Branch"
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-3px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => { handleUpdateTodoCheck(); setTodoSubmit(false) }}
                                                            >
                                                                <CheckCircleIcon
                                                                    style={{
                                                                        color: "#216d21",
                                                                        fontSize: "1.5rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-3px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => { setEditingIndexCheck(-1); setTodoSubmit(false); }}
                                                            >
                                                                <CancelIcon
                                                                    style={{
                                                                        color: "#b92525",
                                                                        fontSize: "1.5rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Grid container spacing={2}>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.year}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.month}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.week}</Typography>
                                                        </Grid>
                                                        <Grid item md={3.5} sm={6} xs={12} sx={{ maxWidth: '150px' }}>
                                                            <Box sx={{ wordWrap: 'break-word' }}>
                                                                <Typography>{todo.day.join(',')}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        {(isFutureMonth || isFutureWeek) ? (
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: "20px",
                                                                        // minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        marginTop: "-13px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={() => { handleEditTodoCheck(index); setTodoSubmit(true); }}
                                                                >
                                                                    <FaEdit
                                                                        style={{
                                                                            color: "#1976d2",
                                                                            fontSize: "1.2rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                        ) : null}
                                                        {/* <Grid item md={1} sm={6} xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-13px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteTodoCheck(index)}
                                                            >
                                                                <FaTrash
                                                                    style={{
                                                                        color: "#b92525",
                                                                        fontSize: "1.2rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid> */}
                                                    </Grid>
                                                )}
                                                <br />
                                            </div>
                                        )
                                    })}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item lg={1.5} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                        {" "}
                                        Update{" "}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
                itemsTwo={items ?? []}
                filename={"Leave Block Day"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box >
    );
}

export default LeaveBlockDayList;