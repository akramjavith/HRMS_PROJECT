import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, InputAdornment, DialogActions, FormControl, Grid, Button, Popover, IconButton, Tooltip } from "@mui/material";
import { userStyle } from "../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { menuItems } from "../../components/menuItemsList";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
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

function AssignBranchModuleListTable() {

    const gridRefTableAccessModule = useRef(null);
    const gridRefImageAccessModule = useRef(null);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [filteredModule, setFilteredModule] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);

    // Datatable
    const [pageAccessModule, setPageAccessModule] = useState(1);
    const [pageSizeAccessModule, setPageSizeAccessModule] = useState(10);
    const [searchQueryAccessModule, setSearchQueryAccessModule] = useState("");
    const [totalPagesAccessModule, setTotalPagesAccessModule] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // pageAccessModule refersh reload
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

    // pageAccessModule refersh reload
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

    // Manage Columns
    const [isManageColumnsOpenAccessModule, setManageColumnsOpenAccessModule] = useState(false);
    const [anchorElAccessModule, setAnchorElAccessModule] = useState(null);
    const [searchQueryManageAccessModule, setSearchQueryManageAccessModule] = useState("");
    const handleOpenManageColumnsAccessModule = (event) => {
        setAnchorElAccessModule(event.currentTarget);
        setManageColumnsOpenAccessModule(true);
    };
    const handleCloseManageColumnsAccessModule = () => {
        setManageColumnsOpenAccessModule(false);
        setSearchQueryManageAccessModule("");
    };
    const openManageColumnsAccessModule = Boolean(anchorElAccessModule);
    const idManageColumnsAccessModule = openManageColumnsAccessModule ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchAccessModule, setAnchorElSearchAccessModule] = React.useState(null);
    const handleClickSearchAccessModule = (event) => {
        setAnchorElSearchAccessModule(event.currentTarget);
    };
    const handleCloseSearchAccessModule = () => {
        setAnchorElSearchAccessModule(null);
        setSearchQueryAccessModule("");
    };

    const openSearchAccessModule = Boolean(anchorElSearchAccessModule);
    const idSearchAccessModule = openSearchAccessModule ? 'simple-popover' : undefined;

    const [selectedModuleName, setSelectedModuleName] = useState([]);
    const [subModuleOptions, setSubModuleOptions] = useState([]);
    const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
    const [mainPageoptions, setMainPageoptions] = useState([]);
    const [selectedMainPageName, setSelectedMainPageName] = useState([]);
    const [subPageoptions, setSubPageoptions] = useState([]);
    const [subSubPageoptions, setsubSubPageoptions] = useState([]);
    const [selectedSubPageName, setSelectedSubPageName] = useState([]);
    const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);
    const [moduleTitleNames, setModuleTitleNames] = useState([]);
    const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
    const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
    const [subPageTitleNames, setSubPageTitleNames] = useState([]);
    const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);

    const module =
        menuItems.length > 0 &&
        menuItems?.map((data) => ({
            ...data,
            label: data.title,
            value: data.title,
        }));

    //setting an module names into array
    const handleModuleChange = (options) => {
        let ans = options.map((a, index) => {
            return a.value;
        });
        setModuleTitleNames(ans);

        //subModuleDropDown Names
        let subModu = menuItems.filter((data) => ans.includes(data.title));
        let Submodule = subModu.length > 0 && subModu?.map((item) => item.submenu);
        let singleArray = Submodule.length > 0 && [].concat(...Submodule);
        //Removing Add in the list
        let filteredArray =
            singleArray.length > 0 &&
            singleArray.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
            });

        setSubModuleOptions(
            filteredArray.length > 0 ?
                filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                })) : []
        );
        setMainPageoptions([]);
        setSubPageoptions([]);
        setsubSubPageoptions([]);
        setSubModuleTitleNames([]);
        setMainPageTitleNames([]);
        setSubPageTitleNames([]);
        setSubSubPageTitleNames([]);
        setSelectedModuleName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererModule = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Module";
    };

    //setting an Sub module names into array
    const handleSubModuleChange = (options) => {

        let submodAns = options.map((a, index) => {
            return a.value;
        });
        setSubModuleTitleNames(submodAns);

        let subModu = subModuleOptions.filter((data) => submodAns.includes(data.title));
        let mainPage =
            subModu.length > 0 &&
            subModu
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        let filteredArray =
            mainPage.length > 0 &&
            mainPage.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
            });
        let mainPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setMainPageoptions(mainPageDropDown);
        setsubSubPageoptions([])
        setSubPageoptions([])
        setMainPageTitleNames([]);
        setSubPageTitleNames([]);
        setSubSubPageTitleNames([]);
        setSelectedSubModuleName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererSubModule = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Module";
    };

    //setting an Main Page names into array
    const handleMainPageChange = (options) => {

        let mainpageAns = options.map((a, index) => {
            return a.value;
        });
        setMainPageTitleNames(mainpageAns);

        let mainPageFilt = mainPageoptions.filter((data) => mainpageAns.includes(data.title));

        let mainPage =
            mainPageFilt.length > 0 &&
            mainPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        //Removing Add in the list
        let filteredArray =
            mainPage.length > 0 &&
            mainPage.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
            });
        //options fetching
        let subPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setSubPageoptions(subPageDropDown);
        setsubSubPageoptions([])
        setSubPageTitleNames([]);
        setSubSubPageTitleNames([]);
        setSelectedMainPageName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererMainPage = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Main-Page";
    };

    //setting an Main Page names into array
    const handleSubPageChange = (options) => {

        let subPageAns = options.map((a, index) => {
            return a.value;
        });
        setSubPageTitleNames(subPageAns);

        let subPageFilt = subPageoptions.filter((data) => subPageAns.includes(data.title));
        let controlDrop =
            subPageFilt.length > 0 &&
            subPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        let filteredArray =
            controlDrop.length > 0 &&
            controlDrop.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
            });
        //options fetching
        let subPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setsubSubPageoptions(subPageDropDown);
        setSubSubPageTitleNames([]);
        setSelectedSubPageName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererSubPage = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub-Page";
    };
    //setting an Main Page names into array
    const handleSubSubPageChange = (options) => {
        let subPageAns = options.map((a, index) => {
            return a.value;
        });
        setSubSubPageTitleNames(subPageAns);

        let subPageFilt = subPageoptions.filter((data) => subPageAns.includes(data.title));

        let controlDrop =
            subPageFilt.length > 0 &&
            subPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();

        setSelectedSubSubPageName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRenderersubSubPage = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Sub-Page";
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibilityAccessModule = {
        serialNumber: true,
        module: true,
        submodule: true,
        mainpage: true,
        subpage: true,
        subsubpage: true,
    };
    const [columnVisibilityAccessModule, setColumnVisibilityAccessModule] = useState(initialColumnVisibilityAccessModule);

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' };
        } else {
            return { background: '#ffffff' };
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
            pagename: String("Accessible Branch Module List"),
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

    const fetchFilteredUsersStatus = async () => {
        setPageName(!pageName)
        setFilteredModule([]);
        setLoader(true);
        setPageAccessModule(1);
        setPageSizeAccessModule(10);
        try {
            let finaldata = [];
            menuItems
                ?.filter((data) => {
                    if (moduleTitleNames?.includes(data.title)) {
                        data.submenu?.filter(item => {
                            if (subModuleTitleNames?.includes(item.title) && item.access === true) {
                                finaldata.push({ module: data.title, submodule: item.title });
                            }
                            else if (subModuleTitleNames?.includes(item.title) && item.access === undefined) {
                                item.submenu?.filter(val => {
                                    if (mainPageTitleNames?.includes(val.title) && val.access === true) {
                                        finaldata.push({ module: data.title, submodule: item.title, mainpage: val.title });
                                    }
                                    else if (mainPageTitleNames?.includes(val.title) && val.access === undefined) {
                                        val.submenu?.filter(ress => {
                                            if (subPageTitleNames?.includes(ress.title) && ress.access === true) {
                                                finaldata.push({ module: data.title, submodule: item.title, mainpage: val.title, subpage: ress.title });
                                            }
                                            else if (subPageTitleNames?.includes(ress.title) && ress.access === undefined) {
                                                ress.submenu?.filter(query => {
                                                    if (subsubPageTitleNames?.includes(query.title) && query.access === true) {
                                                        finaldata.push({ module: data.title, submodule: item.title, mainpage: val.title, subpage: ress.title, subsubpage: query.title });
                                                    }
                                                    else if (subsubPageTitleNames?.includes(query.title) && query.access === undefined) {
                                                        query.submenu?.filter(final => {
                                                            finaldata.push({ module: data.title, submodule: item.title, mainpage: val.title, subpage: ress.title, subsubpage: final.title });
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    }
                })

            let itemsWithSerialNumber = finaldata?.map((item, index) => ({ ...item, serialNumber: index + 1 }))

            setFilteredModule(itemsWithSerialNumber);
            setFilteredDataItems(itemsWithSerialNumber);
            setSearchQueryAccessModule("");
            setLoader(false);
            setTotalPagesAccessModule(Math.ceil(itemsWithSerialNumber.length / pageSizeAccessModule));

        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (moduleTitleNames.length < 1) {
            setPopupContentMalert("Please Select Module Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (subModuleTitleNames.length < 1) {
            setPopupContentMalert("Please Select Sub-Module Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchFilteredUsersStatus();
        }
    };

    const handleClear = async (e) => {
        e.preventDefault();
        setFilteredModule([]);
        setFilteredDataItems([]);
        setSelectedModuleName([]);
        setSelectedSubModuleName([]);
        setSelectedMainPageName([]);
        setSelectedSubPageName([]);
        setSubModuleTitleNames([]);
        setModuleTitleNames([]);
        setSubPageTitleNames([]);
        setSubSubPageTitleNames([]);
        setSelectedSubSubPageName([]);
        setMainPageoptions([])
        setSubModuleOptions([])
        setSubPageoptions([])
        setsubSubPageoptions([])
        setPageAccessModule(1);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

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
                    filteredData.push(node.data);
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableAccessModule.current) {
            const gridApi = gridRefTableAccessModule.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesAccessModule = gridApi.paginationGetTotalPages();
            setPageAccessModule(currentPage);
            setTotalPagesAccessModule(totalPagesAccessModule);
        }
    }, []);

    const columnDataTableAccessModule = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAccessModule.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "module", headerName: "Module", flex: 0, width: 250, hide: !columnVisibilityAccessModule.module, },
        { field: "submodule", headerName: "Sub Module", flex: 0, width: 250, hide: !columnVisibilityAccessModule.submodule, },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 250, hide: !columnVisibilityAccessModule.mainpage, },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 250, hide: !columnVisibilityAccessModule.subpage, },
        { field: "subsubpage", headerName: "Sub Sub-Page", flex: 0, width: 250, hide: !columnVisibilityAccessModule.subsubpage, },
    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryAccessModule(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = filteredModule?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageAccessModule(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = filteredModule?.filter((item) => {
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

        setFilteredDataItems(filtered);
        setAdvancedFilter(filters);
        // handleCloseSearchAccessModule(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryAccessModule("");
        setFilteredDataItems(filteredModule);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableAccessModule.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryAccessModule;
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAccessModule(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityAccessModule };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAccessModule(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAccessModule");
        if (savedVisibility) {
            setColumnVisibilityAccessModule(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAccessModule", JSON.stringify(columnVisibilityAccessModule));
    }, [columnVisibilityAccessModule]);

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableAccessModule.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageAccessModule.toLowerCase())
    );

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

        setColumnVisibilityAccessModule((prevVisibility) => {
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

        setColumnVisibilityAccessModule((prevVisibility) => {
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
        setColumnVisibilityAccessModule((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Module", "Sub Module", "Main Page", "Sub Page", "Sub Sub-Page"]
    let exportRowValuescrt = ['module', 'submodule', 'mainpage', 'subpage', 'subsubpage']

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Accessible Branch Module List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageAccessModule.current) {
            domtoimage.toBlob(gridRefImageAccessModule.current)
                .then((blob) => {
                    saveAs(blob, "Accessible Branch Module List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageAccessModule - 1) * pageSizeAccessModule, pageAccessModule * pageSizeAccessModule);
    const totalPagesAccessModuleOuter = Math.ceil(filteredDataItems?.length / pageSizeAccessModule);
    const visiblePages = Math.min(totalPagesAccessModuleOuter, 3);
    const firstVisiblePage = Math.max(1, pageAccessModule - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAccessModuleOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAccessModule * pageSizeAccessModule;
    const indexOfFirstItem = indexOfLastItem - pageSizeAccessModule;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"ACCESSIBLE BRANCH MODULE LIST"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Accessible Branch Module List"
                modulename="Human Resources"
                submodulename="Facility"
                mainpagename="Accessible Branch Module List"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("laccessiblebranchmodulelist") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> Accessible Branch Module List </Typography>
                            </Grid>

                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Module Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={module}
                                        value={selectedModuleName}
                                        onChange={(e) => {
                                            handleModuleChange(e);
                                            setSelectedSubModuleName([]);
                                            setSelectedMainPageName([]);
                                            setSelectedSubPageName([]);
                                            setSelectedSubSubPageName([]);
                                        }}
                                        valueRenderer={customValueRendererModule}
                                        labelledBy="Please Select Module"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub Module Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={subModuleOptions}
                                        value={selectedSubModuleName}
                                        onChange={(e) => {
                                            handleSubModuleChange(e);
                                            setSelectedMainPageName([]);
                                            setSelectedSubPageName([]);
                                            setSelectedSubSubPageName([]);
                                        }}
                                        valueRenderer={customValueRendererSubModule}
                                        labelledBy="Please Select Sub-Module"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Main Page</Typography>
                                    <MultiSelect
                                        options={mainPageoptions}
                                        value={selectedMainPageName}
                                        onChange={(e) => {
                                            handleMainPageChange(e);
                                            setSelectedSubPageName([]);
                                            setSelectedSubSubPageName([]);
                                        }}
                                        valueRenderer={customValueRendererMainPage}
                                        labelledBy="Please Select Main-Page"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Sub Page</Typography>
                                    <MultiSelect
                                        options={subPageoptions}
                                        value={selectedSubPageName}
                                        onChange={(e) => {
                                            handleSubPageChange(e);
                                            setSelectedSubSubPageName([]);
                                        }}
                                        valueRenderer={customValueRendererSubPage}
                                        labelledBy="Please Select Sub-Page"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Sub Sub-Page</Typography>
                                    <MultiSelect
                                        options={subSubPageoptions}
                                        value={selectedSubSubPageName}
                                        onChange={(e) => {
                                            handleSubSubPageChange(e);
                                        }}
                                        valueRenderer={customValueRenderersubSubPage}
                                        labelledBy="Please Select Sub sub-Page"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item lg={1} md={2} sm={2} xs={6} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit} > Filter </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box><br />
                    {/* ****** Table Start ****** */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Accessible Branch Module List </Typography>
                        </Grid>
                        <Grid container spacing={1} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeAccessModule}
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
                                        <MenuItem value={filteredModule?.length}>  All </MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                <Box>
                                    {isUserRoleCompare?.includes("excelaccessiblebranchmodulelist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvaccessiblebranchmodulelist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printaccessiblebranchmodulelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfaccessiblebranchmodulelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageaccessiblebranchmodulelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp; </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAccessModule} />
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
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAccessModule}> Manage Columns  </Button><br /><br />
                        {loader ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAccessModule} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableAccessModule.filter((column) => columnVisibilityAccessModule[column.field])}
                                        ref={gridRefTableAccessModule}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSizeSelector={[]}
                                        paginationPageSize={pageSizeAccessModule}
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
                            </>
                        } {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={idManageColumnsAccessModule}
                open={isManageColumnsOpenAccessModule}
                anchorEl={anchorElAccessModule}
                onClose={handleCloseManageColumnsAccessModule}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAccessModule}
                    searchQuery={searchQueryManageAccessModule}
                    setSearchQuery={setSearchQueryManageAccessModule}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityAccessModule}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityAccessModule}
                    initialColumnVisibility={initialColumnVisibilityAccessModule}
                    columnDataTable={columnDataTableAccessModule}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAccessModule}
                open={openSearchAccessModule}
                anchorEl={anchorElSearchAccessModule}
                onClose={handleCloseSearchAccessModule}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAccessModule} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAccessModule} handleCloseSearch={handleCloseSearchAccessModule} />
            </Popover>

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
                itemsTwo={filteredModule ?? []}
                filename={"Accessible Branch Module List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box >
    );
}

export default AssignBranchModuleListTable;