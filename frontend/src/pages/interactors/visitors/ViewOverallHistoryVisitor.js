import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../../components/Alert.js";
import { PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { colourStyles, userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";

function ViewOverallHistoryVisitor() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); };

    let exportColumnNames2 = ['Company', 'Branch', 'Unit', 'Date', "Visitor Name"];
    let exportRowValues2 = ['company', 'branch', 'unit', 'date', 'visitorname'];

    const [selectedRows, setSelectedRows] = useState([]);
    const [eraAmountEdit, setEraAmountEdit] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);


    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [items, setItems] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    //SECOND DATATABLE
    const gridRefTable = useRef(null);
    const [isHandleChange, setIsHandleChange] = useState(false);

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        date: true,
        visitorname: true,
        visitoremail: true,
        document: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const getDownloadFile = async (file) => {

        if (Array.isArray(file)) {
            // Handle array of objects
            for (const fileObj of file) {
                if (fileObj.preview) {
                    try {
                        const response = await fetch(fileObj.preview);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        document.body.appendChild(link); // Append link to the body
                        link.click(); // Simulate click
                        document.body.removeChild(link); // Remove link after click
                    } catch (error) {
                        console.error(`Failed to download file: ${fileObj.preview}`, error);
                    }
                } else {
                    console.warn("File object missing 'preview' property:", fileObj);
                }
            }
        } else {
            // Handle single file object
            if (file?.preview) {
                try {
                    const response = await fetch(file.preview);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    document.body.appendChild(link); // Append link to the body
                    link.click(); // Simulate click
                    document.body.removeChild(link); // Remove link after click
                } catch (error) {
                    console.error(`Failed to download file: ${file.preview}`, error);
                }
            } else {
                console.warn("File object missing 'preview' property:", file);
            }
        }
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



    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

    // page refersh reload
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };
    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
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

    // filter option state
    const [targetFilter, setTargetFilter] = useState([]);

    const [ProcessOptions, setProcessOptions] = useState([]);
    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);



    const [visitorNamesValue, setVisitorNamesValue] = useState([])

    const fetchVisitorOverallHistory = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.FILTEROVERALL_VISITORS_ALLVISITOR, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setVisitorNamesValue(res.data?.visitordetailslog?.map((item) => ({
                label: item,
                value: item,
            })))

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchVisitorOverallHistory();
    }, [])

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const [overallFilterdataAll, setOverallFilterdataAll] = useState([]);
    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
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

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    const [overallFilterdataForExport, setOverallFilterdataForExport] = useState([])

    // Disable the search input if the search is active

    const handleResetSearch = async () => {
        setLoader(true);
        // Reset all filters and pagination state
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            visitorname: selectedCompanyFrom.map((item) => item.value),
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = "";  // Use searchQuery for regular search
        }

        try {
            let res = await axios.post(SERVICE.FILTEROVERALL_VISITORS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
            const ansoverall = res?.data?.totalProjectsAllData?.length > 0 ? res?.data?.totalProjectsAllData : [];
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),

            }));
            const itemsWithSerialNumberOverall = ansoverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),

            }));

            setTargetFilter(itemsWithSerialNumber);
            setFilteredChanges(null);

            const datas = itemsWithSerialNumberOverall.map((item, index) => {

                const lastFollowUp = item?.followuparray?.[item?.followuparray?.length - 1] || {};


                return {
                    _id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: item.date,
                    visitorid: item.visitorid,
                    prefix: item.prefix || "",
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: lastFollowUp.visitortype || "",
                    visitormode: lastFollowUp.visitormode || "",
                    visitorpurpose: lastFollowUp.visitorpurpose || "", visitorcontactnumber: item.visitorcontactnumber,
                    intime: lastFollowUp.intime,
                    outtime: lastFollowUp.outtime,
                    interactorstatus: item.interactorstatus,
                    files: item.files,
                    visitorcommonid: item.visitorcommonid || "",
                };
            });

            setOverallFilterdata(datas);
            setItems(itemsWithSerialNumber)
            setOverallFilterdataAll(datas);
            setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setLoader(false)

            // Trigger a table refresh if necessary
            setPageName((prev) => !prev); // Force re-render
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const fetchEmployee = async () => {
        setPageName(!pageName);
        setLoader(true);
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            visitorname: selectedCompanyFrom.map((item) => item.value),
        };

        const allFilters = [
            ...(additionalFilters || []),
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters;
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }

        try {
            const res = await axios.post(SERVICE.FILTEROVERALL_VISITORS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
            const totalProjects = res?.data?.totalProjects || 0;
            const totalPages = res?.data?.totalPages || 0;

            const ansoverall = res?.data?.totalProjectsAllData?.length > 0 ? res?.data?.totalProjectsAllData : [];
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),

            }));
            const itemsWithSerialNumberOverall = ansoverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),

            }));

            setTargetFilter(itemsWithSerialNumber);
            setFilteredChanges(null);
            setOverallFilterdata(itemsWithSerialNumberOverall);

            setTotalProjects(totalProjects);
            setTotalPages(totalPages);
            setPageSize(ans?.length > 0 ? pageSize : 10);
            setPage(ans?.length > 0 ? page : 1);
            // }

            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        if (items?.length !== 0) {
            fetchEmployee();
        }
    }, [page, pageSize, searchQuery]);

    const handleCompanyChangeFrom = (options) => {
        setSelectedCompanyFrom(options);

  
    };
    const customValueRendererCompanyFrom = (valueCate, _company) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Visitor Name";
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Visitor Overall History"),
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
    }, [])

    //submit option for saving 
    const fetchFilter = async () => {
        setPageName(!pageName); // Toggle page name
        setLoader(true); // Set loader state

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            visitorname: selectedCompanyFrom.map((item) => item.value),
            // processcode: selectedProcessFrom.map((item) => item.value),

        };
        try {
            let res = await axios.post(SERVICE.FILTEROVERALL_VISITORS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
            const ansoverall = res?.data?.totalProjectsAllData?.length > 0 ? res?.data?.totalProjectsAllData : [];
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),

            }));
            const itemsWithSerialNumberOverall = ansoverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),

            }));
            setTargetFilter(itemsWithSerialNumber?.map((item, index) => {
                const lastFollowUp = item?.followuparray?.[item?.followuparray?.length - 1] || {};

                return {
                    _id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: item.date,
                    visitorid: item.visitorid,
                    prefix: item.prefix || "",
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: lastFollowUp.visitortype || "",
                    visitormode: lastFollowUp.visitormode || "",
                    visitorpurpose: lastFollowUp.visitorpurpose || "",
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: lastFollowUp.intime,
                    outtime: lastFollowUp.outtime,
                    interactorstatus: item.interactorstatus,
                    files: item.files,
                    visitorcommonid: item.visitorcommonid || "",
                };
            }));

            const datas = itemsWithSerialNumberOverall?.map((item, index) => {

                const lastFollowUp = item?.followuparray?.[item?.followuparray?.length - 1] || {};

                return {
                    id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: item.date,
                    visitorid: item.visitorid,
                    prefix: item.prefix || "",
                    visitorname: item.visitorname,
                    visitoremail: item.visitoremail,
                    visitortype: lastFollowUp.visitortype || "",
                    visitormode: lastFollowUp.visitormode || "",
                    visitorpurpose: lastFollowUp.visitorpurpose || "",
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: lastFollowUp.intime,
                    outtime: lastFollowUp.outtime,
                    interactorstatus: item.interactorstatus,
                    files: item.files,
                    visitorcommonid: item.visitorcommonid || "",

                };
            });

            setOverallFilterdata(datas)
            setOverallFilterdataForExport(datas)

            setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });

            // setVendorcheck(false);
            setSearchQuery("")
            setLoader(false);
        } catch (err) {
            setLoader(false); // Stop loader on error
            console.error(err, "Error fetching era amount");
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        if (selectedCompanyFrom.length === 0) {
            setPopupContentMalert("Please Select Visitor Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            // setSearchQuery("")
            fetchFilter()
        }
    }


    const handleClearFilter = async (e) => {
        e.preventDefault();

        setSelectedCompanyFrom([]);
        setOverallFilterdataForExport([])
        setProcessOptions([])
        setSearchQuery("")
        // fetchFilter();
        setTargetFilter([]);
        setOverallFilterdata([]);
        setPage(1);
        setPageSize(10);
        setTotalProjects(0);
        setTotalPages(0);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Visitor Overall History.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "ERA Amount",
        pageStyle: "print",
    });

    //serial no for listing items

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(targetFilter);
    }, [targetFilter]);

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilterValue(event.target.value);
        fetchEmployee();
        setPage(1);
    };


    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 130,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 130,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 130,
            minHeight: "40px",
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "visitorname",
            headerName: "Visitor Name",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorname,
            headerClassName: "bold-header",
        },
        {
            field: "document",
            headerName: "Profile",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.document,
            cellRenderer: (params) => (
                <Grid>
                    <div className="page-pdf" textAlign={'center'}>
                        {params.data.files.length !== 0 ? <>
                            <Button variant="contained" sx={{ width: "100%" }}
                                onClick={() => {
                                    getDownloadFile(params.data.files);
                                }}
                                className="next-pdf-btn pdf-button">
                                View
                            </Button>
                        </> : <><Button variant="contained" sx={{ background: "red", color: "white", width: "100%" }}
                            className="next-pdf-btn pdf-button">
                            {"NIL "}
                        </Button></>}
                    </div>
                </Grid>
            ),
        },
        {

            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                const sanitizedVisitorId = params.data?.visitorcommonid?.replace('#', '-'); // Define outside JSX
                return (
                    <Grid sx={{ display: 'flex' }}>
                        {isUserRoleCompare?.includes("evisitoroverallhistory") && (
                            params.data?.visitorcommonid === "" ? (
                                <Button
                                    sx={userStyle.buttonedit}
                                    disabled
                                >
                                    <MenuIcon style={{ fontSize: "small" }} />
                                </Button>
                            ) : (
                                <Link
                                    to={`/interactor/viewoverallhistoryvisitorlog/${sanitizedVisitorId}`}
                                    target="_blank"
                                >
                                    <Button
                                        sx={userStyle.buttonedit}
                                        onClick={() => {
                                            console.log(params.data, "row");
                                        }}
                                    >
                                        <MenuIcon style={{ fontSize: "small" }} />
                                    </Button>
                                </Link>
                            )
                        )}
                    </Grid>

                );
            }
        },
    ];

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            // id: item.id,
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            date: item.date,
            visitorname: item.visitorname,
            visitoremail: item.visitoremail,
            files: item.files,
            visitorcommonid: item.visitorcommonid || "",


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

    const [loader, setLoader] = useState(false);

    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        localStorage.removeItem("filterModel");
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
            <Headtitle title={"ERA AMOUNT"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Visitor Overall History"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="ERA Amount List"
                subpagename=""
                subsubpagename=""
            />
            <br />
            {isUserRoleCompare?.includes("lvisitoroverallhistory")
                && (
                    <Box sx={userStyle.selectcontainer}>

                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>Visitor Overall History</Typography>
                            </Grid>
                        </Grid><br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={visitorNamesValue}

                                        styles={colourStyles}

                                        value={selectedCompanyFrom}
                                        onChange={handleCompanyChangeFrom}
                                        valueRenderer={customValueRendererCompanyFrom}
                                        labelledBy="Please Select Visitor Name"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ display: "flex", alignItems: "center", marginTop: "22px" }}>
                                <Typography>&nbsp;</Typography>
                                <Typography>&nbsp;</Typography>

                                <Button variant='contained' color='primary' onClick={handleSubmitFilter}>Filter</Button>
                                &nbsp;
                                &nbsp;
                                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>Clear</Button>
                            </Grid>
                        </Grid>
                        <br />  <br />

                    </Box>

                )}
            <br />
            {/* ****** Table Start ****** */}

            {isUserRoleCompare?.includes("lvisitoroverallhistory") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Visitor Overall History List</Typography>
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
                                    {isUserRoleCompare?.includes("excelvisitoroverallhistory") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen2(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvvisitoroverallhistory") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen2(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printvisitoroverallhistory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfvisitoroverallhistory") && (
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
                                    {isUserRoleCompare?.includes("imagevisitoroverallhistory") && (
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
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
                        {loader ? (
                            <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        ) : (<>
                            <AggridTableForPaginationTable
                                rowDataTable={rowDataTable}
                                columnDataTable={columnDataTable}
                                columnVisibility={columnVisibility}
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                totalPages={totalPages}
                                setColumnVisibility={setColumnVisibility}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                                gridRefTable={gridRefTable}
                                totalDatas={totalProjects}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                gridRefTableImg={gridRefTableImg}
                                itemsList={overallFilterdataAll}
                            // itemsList={overallFilterdata}
                            />
                        </>
                        )}
                        {/* ****** Table End ****** */}
                    </Box>

                    {/* Search Bar */}
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
                </>
            )
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
                itemsTwo={overallFilterdataForExport ?? []}
                filename={"Visitor Overall History"}
                exportColumnNames={exportColumnNames2}
                exportRowValues={exportRowValues2}
                componentRef={componentRef}
            />
            {/* INFO */}
   
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
        
 
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

export default ViewOverallHistoryVisitor;