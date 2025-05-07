import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Popover, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography, OutlinedInput, InputAdornment, Tooltip, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";

function OverallAchievedAccuracyIndividualList() {
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);
    const pathname = window.location.pathname;
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [getIndexData, setGetIndexData] = useState("");
    const [searchedString, setSearchedString] = useState("")
    const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch,
        buttonStyles } = useContext(
            UserRoleAccessContext
        );

    const [isHandleChange, setIsHandleChange] = useState(false);
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
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Overall Achieved Accuracy Individual List"),
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

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth } = useContext(AuthContext);
    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };
    const [isBankdetail, setBankdetail] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updatedFieldEmployee, setUpdatedFieldEmployee] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Overall Achieved Accuracy Individual List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
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
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
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
        if ((selectedRows).includes(params.row.editid)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        loginid: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        accuracy: true,
        totalfield: true,
        autoerrorcount: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // get single row to view....
    const getinfoCode = async (e) => {
        setOverallList((prev) => ({
            ...prev, ...e
        }))
        handleClickOpenInfo();
    };
    const [isEditOpen, setIsEditOpen] = useState(false);
    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
    const [primaryWorkStation, setPrimaryWorkStation] = useState("Select Primary Workstation");
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [updateWorkStation, setUpdateworkStation] = useState([]);
    const [filteredWorkStation, setFilteredWorkStation] = useState([]);
    const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState([]);
    const [maxSelections, setMaxSelections] = useState(0);
    const [empaddform, setEmpaddform] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        workstation: "Please Select Work Station",
    });
    let [valueWorkStation, setValueWorkStation] = useState("");
    const [overallList, setOverallList] = useState({
        date: "",
        project: "",
        vendor: "",
        queue: "",
        loginid: "",
        accuracy: "",
        totalfield: "",
        company: "",
        branch: "",
        unit: "",
        team: "",
        employeename: "",
    });

    const [totalPages, setTotalPages] = useState(0);
    const [totalDatas, setTotalDatas] = useState(0);
    //get all employees list details
    const fetchOverallItems = async () => {
        try {
            let res = await axios.get(SERVICE.OVERALLACHIEVEDACCURACYINDIVIDUALLIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            const overallWithSerialNumber = res?.data?.finalData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setOverallItems(overallWithSerialNumber)
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    useEffect(() => {
        fetchOverallItems();
    }, [])
    const fetchAchievedAccuracyIndividual = async () => {
        setPageName(!pageName)
        console.time("start");

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {

            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        try {
            let res_status = await axios.post(SERVICE.OVERALL_ACHIEVEDACCURACYINDIVIDUALBYPAGINATION, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

            let toShowList = ans
                .filter(item => {
                    if (item.company) {
                        return accessbranch.some(branch =>
                            branch.company === item.company &&
                            branch.branch === item.branch &&
                            branch.unit === item.unit
                        );
                    }
                    return true; // Return the item if company is null
                });

            const itemsWithSerialNumber = toShowList?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
                autoerrorcount: isNaN(item?.totalfield) || isNaN(item?.accuracy)
                    ? ""
                    : Math.round(item.totalfield * (1 - item.accuracy / 100))
            }));
            

            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setEmployees(itemsWithSerialNumber);
            setBankdetail(true);
            console.timeEnd("start");
        } catch (err) {
            console.log(err);
            setBankdetail(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };


    const handleResetSearch = async () => {
        setPageName(!pageName)


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
        };

        const allFilters = [];

        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }


        try {
            let res_status = await axios.post(SERVICE.OVERALL_ACHIEVEDACCURACYINDIVIDUALBYPAGINATION, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });

            const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

            let toShowList = ans
                .filter(item => {
                    if (item.company) {
                        return accessbranch.some(branch =>
                            branch.company === item.company &&
                            branch.branch === item.branch &&
                            branch.unit === item.unit
                        );
                    }
                    return true; // Return the item if company is null
                });

            const itemsWithSerialNumber = toShowList?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY")
            }));
            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setEmployees(itemsWithSerialNumber);


        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    }

    //20.11.2024-------------------------------------------------------------------------------------------------------------------
    const [advancedFilter, setAdvancedFilter] = useState(null);


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
    const [employeesArray, setEmployeesArray] = useState([])

    const [indexGet, setIndexGet] = useState();
    const delAddemployee = async () => {
        setPageName(!pageName)
        try {
            let del = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                workstation: updateWorkStation,
            });
            await fetchAchievedAccuracyIndividual();
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Removed Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // company multi select
    const handleEmployeesChange = (options) => {
        // If employeecount is greater than 0, limit the selections
        if (maxSelections > 0) {
            // Limit the selections to the maximum allowed
            options = options.slice(0, (maxSelections - 1));
        }
        // Update the disabled property based on the current selections and employeecount
        const updatedOptions = filteredWorkStation.map((option) => ({
            ...option,
            disabled:
                (maxSelections - 1) > 0 &&
                options.length >= (maxSelections - 1) &&
                !options.find(
                    (selectedOption) => selectedOption.value === option.value
                ),
        }));
        setValueWorkStation(options.map((a, index) => a.value));
        setSelectedOptionsWorkStation(options);
        setFilteredWorkStation(updatedOptions);
    };
    const customValueRendererEmployees = (
        valueWorkStation,
        _filteredWorkStation
    ) => {
        return valueWorkStation.length ? (
            valueWorkStation.map(({ label }) => label).join(", ")
        ) : (
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Select Secondary Work Station</span>
        );
    };
    const fetchWorkStation = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const result = res?.data?.locationgroupings.flatMap((item) => {
                return item.combinstation.flatMap((combinstationItem) => {
                    return combinstationItem.subTodos.length > 0
                        ? combinstationItem.subTodos.map(
                            (subTodo) =>
                                subTodo.subcabinname +
                                "(" +
                                item.branch +
                                "-" +
                                item.floor +
                                ")"
                        )
                        : [
                            combinstationItem.cabinname +
                            "(" +
                            item.branch +
                            "-" +
                            item.floor +
                            ")",
                        ];
                });
            });
            setWorkStationOpt(res?.data?.locationgroupings);
            setAllWorkStationOpt(
                result.flat()?.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchWorkStation();
    }, []);
    //Boardingupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    let addedby = empaddform?.addedby;
    let username = isUserRoleAccess.username;
    //edit post call.
    let boredit = empaddform?._id;
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleCloseinfo = () => { setOpeninfo(false); };
    const handleClickOpenInfo = () => {
        setOpenview(true);
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
    //  PDF
    let exportColumnNames = ["Date", "Project", "Vendor", "Queue", "Loginid", "Company", "Branch", "Unit", "Team", "Employeename", "Accuracy", "Totalfield", "Auto Error Count"];
    let exportRowValues = ["date", "project", "vendor", "queue", "loginid", "company", "branch", "unit", "team", "employeename", "accuracy", "totalfield", "autoerrorcount"];
    // Excel
    const fileName = "Overall Achieved Accuracy Individual List";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Overall Achieved Accuracy Individual List",
        pageStyle: "print",
    });
    useEffect(() => {
        fetchAchievedAccuracyIndividual();
    }, [page, pageSize, searchQuery]);
    //table entries ..,.
    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {

        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);
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
        setPage(1);
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
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
        </div>
    );
    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',

        },
        { field: "date", headerName: "Date", flex: 0, width: 200, hide: !columnVisibility.date, headerClassName: "bold-header", pinned: 'left' },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header", pinned: 'left' },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 200, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "loginid", headerName: "Login ID", flex: 0, width: 200, hide: !columnVisibility.loginid, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 200, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 200, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "accuracy", headerName: "Accuracy", flex: 0, width: 150, hide: !columnVisibility.accuracy, headerClassName: "bold-header" },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 150, hide: !columnVisibility.totalfield, headerClassName: "bold-header" },
        { field: "autoerrorcount", headerName: "Auto Error Count", flex: 0, width: 180, hide: !columnVisibility.autoerrorcount, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            // Assign Bank Detail
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("voverallacheivedaccuracyindividuallist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getinfoCode(params.data);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    &ensp;
                </Grid>
            ),
        },
    ]
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");
    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            serialNumber: item.serialNumber,
            id: item.id,
            date: item.date,
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            loginid: item.loginid,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            accuracy: item.accuracy,
            totalfield: item.totalfield,
            autoerrorcount: item?.autoerrorcount || 0
        }
    });
    console.log(rowDataTable,"rowDataTable")
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
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

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
    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"OVERALL ACHIEVED ACCURACY INDIVIDUAL LIST"} />
            <PageHeading
                title="Overall Achieved Accuracy Individual List"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Overall Acheived Accuracy Individual List"
                subpagename=""
                subsubpagename=""
            />

            <br />
            {isUserRoleCompare?.includes("loverallacheivedaccuracyindividuallist") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Overall Achieved Accuracy Individual List</Typography>
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
                                        <MenuItem value={(employees?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("exceloverallacheivedaccuracyindividuallist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)

                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvoverallacheivedaccuracyindividuallist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)

                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printoverallacheivedaccuracyindividuallist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfoverallacheivedaccuracyindividuallist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageoverallacheivedaccuracyindividuallist") && (
                                        <Button sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!isBankdetail ?
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


                                    totalDatas={totalDatas}

                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}

                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>}
                    </Box>
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
                                                    fetchAchievedAccuracyIndividual();
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
            )}
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
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='md'
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>View Overall Achieved Accuracy Individual List</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{overallList.date}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl size="small" fullWidth>
                                    <Typography variant="h6"> Project</Typography>
                                    <Typography>{overallList.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{overallList.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{overallList.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Login ID</Typography>
                                    <Typography>{overallList.loginid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{overallList.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{overallList.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{overallList.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{overallList.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{overallList.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Accuracy</Typography>
                                    <Typography>{overallList.accuracy}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Total Field</Typography>
                                    <Typography>{overallList.totalfield}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <Dialog
                open={isErrorOpen}
                onClose={handleCloseerr}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseerr}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Project</StyledTableCell>
                            <StyledTableCell>Vendor</StyledTableCell>
                            <StyledTableCell>Queue</StyledTableCell>
                            <StyledTableCell>Login ID</StyledTableCell>
                            <StyledTableCell>Accuracy</StyledTableCell>
                            <StyledTableCell>Totalfield</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Employeename</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.date} </StyledTableCell>
                                    <StyledTableCell> {row.project}</StyledTableCell>
                                    <StyledTableCell> {row.vendor}</StyledTableCell>
                                    <StyledTableCell> {row.queue}</StyledTableCell>
                                    <StyledTableCell> {row.loginid}</StyledTableCell>
                                    <StyledTableCell> {row.accuracy}</StyledTableCell>
                                    <StyledTableCell> {row.totalfield}</StyledTableCell>
                                    <StyledTableCell> {row.company}</StyledTableCell>
                                    <StyledTableCell> {row.branch}</StyledTableCell>
                                    <StyledTableCell> {row.unit}</StyledTableCell>
                                    <StyledTableCell> {row.team}</StyledTableCell>
                                    <StyledTableCell> {row.employeename}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={overallItems ?? []}
                filename={"Overall Achieved Accuracy Individual List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
        </Box>
    );
}

export default OverallAchievedAccuracyIndividualList;