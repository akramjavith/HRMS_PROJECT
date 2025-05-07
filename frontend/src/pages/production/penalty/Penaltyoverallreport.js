import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, OutlinedInput, Popover, Select, Typography, Dialog, DialogContent, DialogActions, IconButton, CircularProgress } from "@mui/material";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { MultiSelect } from "react-multi-select-component";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ManageColumnsContent from "../../../components/ManageColumn";
import moment from "moment";
import PenaltyCurrentOverAllReport from './Penaltycurrentoverallreport';

function PenaltyOverallReport() {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
        // fontSize: "12px"
    }

    const gridRefTable = useRef(null);
    const gridRefTableTwo = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRefTableImgTwo = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

    const [filterUser, setFilterUser] = useState({ fromdate: "", todate: "", });
    const [selectedTable, setSelectedTable] = useState([]);
    const [tableCheck, setTableCheck] = useState([]);
    const [valueTable, setValueTable] = useState([]);
    const [penaltyErrors, setPenaltyErrors] = useState([]);
    const [penaltyErrorsTwo, setPenaltyErrorsTwo] = useState([]);
    const [penaltyErrorsThree, setPenaltyErrorsThree] = useState([]);
    const [penaltyErrorsFour, setPenaltyErrorsFour] = useState([]);
    const [items, setItems] = useState([]);
    const [itemsTwo, setItemsTwo] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsTwo, setSelectedRowsTwo] = useState([]);

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [filteredRowDataTwo, setFilteredRowDataTwo] = useState([]);
    const [filteredChangesTwo, setFilteredChangesTwo] = useState(null);
    const [isHandleChangeTwo, setIsHandleChangeTwo] = useState(false);
    const [searchedStringTwo, setSearchedStringTwo] = useState("");

    const [filteredRowDataThree, setFilteredRowDataThree] = useState([]);
    const [filteredChangesThree, setFilteredChangesThree] = useState(null);
    const [isHandleChangeThree, setIsHandleChangeThree] = useState(false);
    const [searchedStringThree, setSearchedStringThree] = useState("");

    const [filteredRowDataFour, setFilteredRowDataFour] = useState([]);
    const [filteredChangesFour, setFilteredChangesFour] = useState(null);
    const [isHandleChangeFour, setIsHandleChangeFour] = useState(false);
    const [searchedStringFour, setSearchedStringFour] = useState("");

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    //Datatable second Table
    const [pageTwo, setPageTwo] = useState(1);
    const [pageSizeTwo, setPageSizeTwo] = useState(10);
    const [searchQueryTwo, setSearchQueryTwo] = useState("");

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
    };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    // second table
    const [isFilterOpenTwo, setIsFilterOpenTwo] = useState(false);
    const [isPdfFilterOpenTwo, setIsPdfFilterOpenTwo] = useState(false);
    // page refersh reload
    const handleCloseFilterModTwo = () => { setIsFilterOpenTwo(false); };
    const handleClosePdfFilterModTwo = () => { setIsPdfFilterOpenTwo(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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

    // Manage Columns second Table
    const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");
    const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
    const [anchorElTwo, setAnchorElTwo] = useState(null);

    const handleOpenManageColumnsTwo = (event) => {
        setAnchorElTwo(event.currentTarget);
        setManageColumnsOpenTwo(true);
    };
    const handleCloseManageColumnsTwo = () => {
        setManageColumnsOpenTwo(false);
        setSearchQueryManageTwo("");
    };

    const openTwo = Boolean(anchorElTwo);
    const idTwo = openTwo ? "simple-popover" : undefined;

    const [selectedMode, setSelectedMode] = useState("Last Week");
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        name: true,
        empcode: true,
        fromdate: true,
        todate: true,
        vendorname: true,
        process: true,
        totalfield: true,
        autoerror: true,
        manualerror: true,
        uploaderror: true,
        moved: true,
        notupload: true,
        penalty: true,
        nonpenalty: true,
        bulkupload: true,
        bulkkeying: true,
        clientamount: true,
        edited1: true,
        edited2: true,
        edited3: true,
        edited4: true,
        reject1: true,
        reject2: true,
        reject3: true,
        reject4: true,
        notvalidate: true,
        validateerror: true,
        waiver: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilityTwo = {
        serialNumber: true,
        name: true,
        empcode: true,
        date: true,
        vendorname: true,
        process: true,
        totalfield: true,
        autoerror: true,
        manualerror: true,
        uploaderror: true,
        moved: true,
        notupload: true,
        penalty: true,
        nonpenalty: true,
        bulkupload: true,
        bulkkeying: true,
        clientamount: true,
        edited1: true,
        edited2: true,
        edited3: true,
        edited4: true,
        reject1: true,
        reject2: true,
        reject3: true,
        reject4: true,
        notvalidate: true,
        validateerror: true,
        waiver: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
    };

    const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

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

    const tableOptions = [
        { label: "Process-Penalty Month List", value: "Process-Penalty Month List" },
        { label: "Current Process-Penalty consolidate List", value: "Current Process-Penalty consolidate List" },
        { label: "Current Process List", value: "Current Process List" },
        { label: "ReCheck Current Process List", value: "ReCheck Current Process List" },
    ];

    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Penalty Over All Report"),
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

    //Table Mode multiselect
    const handleTableChange = (options) => {
        setValueTable(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTable(options);
    };

    const customValueRendererCompany = (valueTable, _categoryname) => {
        return valueTable?.length
            ? valueTable.map(({ label }) => label)?.join(", ")
            : "Please Select Table Mode";
    };

    useEffect(() => {
        const today = new Date();

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        if (selectedMode === "Last Week") {
            const startOfLastWeek = new Date(today);
            startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
            setFilterUser({ fromdate: formatDate(startOfLastWeek), todate: formatDate(endOfLastWeek) })
        }
    }, []);

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

    const filteredErrorData = async () => {
        setPageName(!pageName)
        setLoader(true);
        setloadingdeloverall(true);
        try {
            let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_EMPLOYEEWISE_OVER_ALL_REPORT, {
                empname: isUserRoleAccess.companyname,
                department: isUserRoleAccess.department,
                departmentlog: isUserRoleAccess.departmentlog,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            if (valueTable?.includes('Process-Penalty Month List')) {
                let itemsWithSerialNumber = res?.data?.consolidatedData?.map((item, index) => {

                    return {
                        ...item,
                        id: item._id,
                        serialNumber: index + 1,
                        fromdate: moment(item.fromdate).format('DD/MM/YYYY'),
                        todate: moment(item.todate).format('DD/MM/YYYY'),
                    }
                });
                setPenaltyErrors(itemsWithSerialNumber);
                // setFilteredRowData(itemsWithSerialNumber);
                setTableCheck(valueTable);
            }
            if (valueTable?.includes('Current Process-Penalty consolidate List')) {
                let itemsWithSerialNumberTwo = res?.data?.consolidatedDataProcessWise?.map((item, index) => {

                    return {
                        ...item,
                        id: item._id,
                        serialNumber: index + 1,
                    }
                });
                setPenaltyErrorsTwo(itemsWithSerialNumberTwo);
                setFilteredRowDataTwo(itemsWithSerialNumberTwo);
                setTableCheck(valueTable);
            }
            if (valueTable?.includes('Current Process List')) {
                let itemsWithSerialNumberThree = await Promise.all(
                    res?.data?.penaltydayuploaddepdatas?.filter(data => data.history === undefined || data.history && data.history.length === 0).map(async (item, index) => {
                        try {
                            let res_vendor = await axios.post(SERVICE.PENALTYWAIVERMASTER_FOR_PENALTYOVERALL_RESTRICTION, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                fromdate: item.date,
                                todate: item.date,
                                department: item.department,
                                employeename: item.name,
                                branch: item.branch,
                                processcode: item.processcode,
                            });
                            let result = res_vendor?.data?.penaltywaivermasters;

                            if (result?.length === 0) {
                                // setPopupContentMalert(`This date range does not have any data matches. Kindly contact the administrator to confirm the 'Penalty Waiver'.`);
                                // setPopupSeverityMalert("warning");
                                // handleClickOpenPopupMalert();
                                return {
                                    ...item,
                                    id: item._id,
                                    serialNumber: index + 1,
                                    date: moment(item.date).format('DD/MM/YYYY'),
                                    actualdate: item.date,

                                }
                            } else {
                                return result.map((dep) => {
                                    // Convert createdAt to a moment object
                                    let createdAtMoment = moment(item.createdAt);

                                    // Calculate waiver close time (createdAt + validity days in hours)
                                    let waiverCloseTime = createdAtMoment.add(dep.validitydays * 24, "hours");

                                    // Calculate remaining hours
                                    // let remainingHours = waiverCloseTime.diff(moment(), "hours");
                                    // console.log(remainingHours, 'remainingHours')
                                    // // Set waivercloseon message
                                    // let waivercloseon = remainingHours > 0
                                    //     ? `${remainingHours} Hours`
                                    //     : "Request Hours Limit Closed";

                                    // Get remaining seconds instead of hours
                                    let remainingSeconds = waiverCloseTime.diff(moment(), "seconds");

                                    // Set waivercloseon message with precise timing
                                    let waivercloseon =
                                        remainingSeconds > 0
                                            ? `${Math.floor(remainingSeconds / 3600)} Hours ${Math.floor((remainingSeconds % 3600) / 60)} Minutes ${remainingSeconds % 60} Seconds`
                                            : "Request Hours Limit Closed";

                                    return {
                                        ...item,
                                        id: item._id,
                                        serialNumber: index + 1,
                                        date: moment(item.date).format("DD/MM/YYYY"),
                                        actualdate: item.date,
                                        waivercloseon,
                                        validitydays: dep.validitydays
                                    };
                                });
                            }
                        } catch (error) {
                            console.error("Error fetching penalty waiver:", error);
                            return null; // Handle errors gracefully
                        }
                    })
                );
                setPenaltyErrorsThree(itemsWithSerialNumberThree.flat().filter(Boolean));
                // setFilteredRowDataThree(itemsWithSerialNumberThree.flat().filter(Boolean));
                setTableCheck(valueTable);
            }
            if (valueTable?.includes('ReCheck Current Process List')) {
                let itemsWithSerialNumberFour = await Promise.all(
                    res?.data?.penaltydayuploaddepdatas?.filter(data => Array.isArray(data.history) && data.history.length > 0)?.map(async (item, index) => {
                        try {
                            let res_vendor = await axios.post(SERVICE.PENALTYWAIVERMASTER_FOR_PENALTYOVERALL_RESTRICTION, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                fromdate: item.date,
                                todate: item.date,
                                department: item.department,
                                employeename: item.name,
                                branch: item.branch,
                                processcode: item.processcode,
                            });
                            let result = res_vendor?.data?.penaltywaivermasters;
                            if (result?.length === 0) {
                                // setPopupContentMalert(`This date range does not have any data matches. Kindly contact the administrator to confirm the 'Penalty Waiver'.`);
                                // setPopupSeverityMalert("warning");
                                // handleClickOpenPopupMalert();
                                return {
                                    ...item,
                                    id: item._id,
                                    date: moment(item.date).format('DD/MM/YYYY'),
                                    actualdate: item.date,
                                }
                            } else {
                                return result.map((dep) => {
                                    // Get the previous entry
                                    const previousEntry = item.history[item.history.length - 2];

                                    if (!previousEntry) {
                                        return null; // Skip if no previous entry
                                    }

                                    // Combine previousEntry date and time into a single moment object
                                    let previousEntryTime = moment(`${previousEntry.date} ${previousEntry.time}`, "YYYY-MM-DD HH:mm:ss");

                                    // Calculate waiver close time (previousEntryTime + validity days in hours)
                                    let waiverCloseTime = previousEntryTime.add(dep.validitydays * 24, "hours");

                                    // Calculate remaining hours
                                    let remainingSeconds = waiverCloseTime.diff(moment(), "seconds");

                                    // Set waivercloseon message
                                    let waivercloseon = remainingSeconds > 0
                                        ? `${Math.floor(remainingSeconds / 3600)} Hours ${Math.floor((remainingSeconds % 3600) / 60)} Minutes ${remainingSeconds % 60} Seconds`
                                        : "Request Hours Limit Closed";

                                    const relevantHistory = item.history.filter(val =>
                                        ["Sent", "Recheck"].includes(val.status)
                                    );

                                    const reasons = relevantHistory.map(val => val.reason).join('\n');

                                    if (item.history[item.history.length - 1]?.status === "Recheck") {
                                        return {
                                            ...item,
                                            id: item._id,
                                            actualdate: item.date,
                                            date: moment(item.date).format('DD/MM/YYYY'),
                                            reason: reasons,
                                            previousdate: previousEntry.date,
                                            previoustime: previousEntry.time,
                                            validitydays: dep.validitydays,
                                            waivercloseon,
                                        };
                                    }
                                })
                            }
                        } catch (error) {
                            console.error("Error fetching penalty waiver:", error);
                            return null; // Handle errors gracefully
                        }
                    })
                );
                setPenaltyErrorsFour(itemsWithSerialNumberFour.flat().filter(Boolean)?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setFilteredRowDataFour(itemsWithSerialNumberFour.flat().filter(Boolean)?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }
            setLoader(false);
            setloadingdeloverall(false);
        } catch (err) {
            console.log(err.message)
            setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTable.length === 0) {
            setPopupContentMalert("Please Select Table Mode");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        // if (filterUser.fromdate === '' && filterUser.todate === '') {
        //     setPopupContentMalert("Please Select Date");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // }
        else {
            filteredErrorData();
        }
    };

    const handleClear = () => {
        setPageName(!pageName);
        setSelectedTable([]);
        setValueTable([]);
        setTableCheck([]);
        setPenaltyErrors([]);
        setPenaltyErrorsTwo([]);
        setPenaltyErrorsThree([]);
        setPenaltyErrorsFour([]);
        setItems([]);
        setItemsTwo([]);
        const today = new Date();

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        setFilterUser({ fromdate: formatDate(startOfLastWeek), todate: formatDate(endOfLastWeek) })

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(penaltyErrors);
    }, [penaltyErrors]);

    const addSerialNumberTwo = (datas) => {
        setItemsTwo(datas);
    };

    useEffect(() => {
        addSerialNumberTwo(penaltyErrorsTwo);
    }, [penaltyErrorsTwo]);

    //Datatable
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    //Datatable second Table
    const handlePageSizeChangeTwo = (event) => {
        setPageSizeTwo(Number(event.target.value));
        setPageTwo(1);
    };

    // Split the search query into individual terms
    const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasTwo = itemsTwo?.filter((item) => {
        return searchTermsTwo.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataTwo = filteredDatasTwo?.slice((pageTwo - 1) * pageSizeTwo, pageTwo * pageSizeTwo);
    const totalPagesTwo = Math.ceil(filteredDatasTwo.length / pageSizeTwo);
    const visiblePagesTwo = Math.min(totalPagesTwo, 3);
    const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
    const lastVisiblePageTwo = Math.min(firstVisiblePageTwo + visiblePagesTwo - 1, totalPagesTwo);
    const pageNumbersTwo = [];
    const indexOfLastItemTwo = pageTwo * pageSizeTwo;
    const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;
    for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
        pageNumbersTwo.push(i);
    }

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.name, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibility.empcode, pinned: 'left', lockPinned: true, },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, pinned: 'left', lockPinned: true, },
        { field: "todate", headerName: "To Date", flex: 0, width: 150, hide: !columnVisibility.todate, pinned: 'left', lockPinned: true, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibility.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibility.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibility.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibility.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibility.manualerror, },
        { field: "uploaderror", headerName: "Upload Error", flex: 0, width: 120, hide: !columnVisibility.uploaderror, },
        { field: "moved", headerName: "Moved", flex: 0, width: 150, hide: !columnVisibility.moved, },
        { field: "notupload", headerName: "Not Upload", flex: 0, width: 150, hide: !columnVisibility.notupload, },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibility.penalty, },
        { field: "nonpenalty", headerName: "Non Penalty", flex: 0, width: 120, hide: !columnVisibility.nonpenalty, },
        { field: "bulkupload", headerName: "Bulk Upload", flex: 0, width: 120, hide: !columnVisibility.bulkupload, },
        { field: "bulkkeying", headerName: "Bulk Keying", flex: 0, width: 120, hide: !columnVisibility.bulkkeying, },
        { field: "edited1", headerName: "Edited1", flex: 0, width: 100, hide: !columnVisibility.edited1, },
        { field: "edited2", headerName: "Edited2", flex: 0, width: 100, hide: !columnVisibility.edited2, },
        { field: "edited3", headerName: "Edited3", flex: 0, width: 100, hide: !columnVisibility.edited3, },
        { field: "edited4", headerName: "Edited4", flex: 0, width: 100, hide: !columnVisibility.edited4, },
        { field: "reject1", headerName: "Reject1", flex: 0, width: 100, hide: !columnVisibility.reject1, },
        { field: "reject2", headerName: "Reject2", flex: 0, width: 100, hide: !columnVisibility.reject2, },
        { field: "reject3", headerName: "Reject3", flex: 0, width: 100, hide: !columnVisibility.reject3, },
        { field: "reject4", headerName: "Reject4", flex: 0, width: 100, hide: !columnVisibility.reject4, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibility.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibility.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibility.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibility.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibility.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibility.per, },
        { field: "percentage", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibility.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibility.amount, },
    ];

    // second table
    const columnDataTableTwo = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityTwo.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityTwo.name, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityTwo.empcode, pinned: 'left', lockPinned: true, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityTwo.vendorname, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilityTwo.process, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilityTwo.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilityTwo.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilityTwo.manualerror, },
        { field: "uploaderror", headerName: "Upload Error", flex: 0, width: 120, hide: !columnVisibilityTwo.uploaderror, },
        { field: "moved", headerName: "Moved", flex: 0, width: 150, hide: !columnVisibilityTwo.moved, },
        { field: "notupload", headerName: "Not Upload", flex: 0, width: 150, hide: !columnVisibilityTwo.notupload, },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibilityTwo.penalty, },
        { field: "nonpenalty", headerName: "Non Penalty", flex: 0, width: 120, hide: !columnVisibilityTwo.nonpenalty, },
        { field: "bulkupload", headerName: "Bulk Upload", flex: 0, width: 120, hide: !columnVisibilityTwo.bulkupload, },
        { field: "bulkkeying", headerName: "Bulk Keying", flex: 0, width: 120, hide: !columnVisibilityTwo.bulkkeying, },
        { field: "edited1", headerName: "Edited1", flex: 0, width: 100, hide: !columnVisibilityTwo.edited1, },
        { field: "edited2", headerName: "Edited2", flex: 0, width: 100, hide: !columnVisibilityTwo.edited2, },
        { field: "edited3", headerName: "Edited3", flex: 0, width: 100, hide: !columnVisibilityTwo.edited3, },
        { field: "edited4", headerName: "Edited4", flex: 0, width: 100, hide: !columnVisibilityTwo.edited4, },
        { field: "reject1", headerName: "Reject1", flex: 0, width: 100, hide: !columnVisibilityTwo.reject1, },
        { field: "reject2", headerName: "Reject2", flex: 0, width: 100, hide: !columnVisibilityTwo.reject2, },
        { field: "reject3", headerName: "Reject3", flex: 0, width: 100, hide: !columnVisibilityTwo.reject3, },
        { field: "reject4", headerName: "Reject4", flex: 0, width: 100, hide: !columnVisibilityTwo.reject4, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilityTwo.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilityTwo.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilityTwo.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilityTwo.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilityTwo.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityTwo.per, },
        { field: "percentage", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibilityTwo.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilityTwo.amount, },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
        };
    });

    // second Table
    const rowDataTableTwo = filteredDataTwo.map((item, index) => {
        return {
            ...item,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Show All Columns functionality second Table
    const handleShowAllColumnsTwo = () => {
        const updatedVisibility = { ...columnVisibilityTwo };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityTwo(updatedVisibility);
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // Function to filter columns based on search query second Table
    const filteredColumnsTwo = columnDataTableTwo.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageTwo.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Manage Columns functionality secondtable
    const toggleColumnVisibilityTwo = (field) => {
        setColumnVisibilityTwo((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const [fileFormat, setFormat] = useState("");
    let exportColumnNames = ['Employee Name', 'Employee Code', 'From Date', 'To Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
        'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
        'per%', 'Percentage', 'Amount',];
    let exportRowValues = ['name', 'empcode', 'fromdate', 'todate', 'vendorname', 'process', 'totalfield', 'autoerror', 'manualerror', 'uploaderror', 'moved', 'notupload', 'penalty', 'nonpenalty', 'bulkupload', 'bulkkeying',
        'edited1', 'edited2', 'edited3', 'edited4', 'reject1', 'reject2', 'reject3', 'reject4', 'notvalidate', 'validateerror', 'waiver', 'waivererror', 'neterror',
        'per', 'percentage', 'amount',];

    let exportColumnNamesTwo = ['Employee Name', 'Employee Code', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
        'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
        'per%', 'Percentage', 'Amount',];
    let exportRowValuesTwo = ['name', 'empcode', 'vendorname', 'process', 'totalfield', 'autoerror', 'manualerror', 'uploaderror', 'moved', 'notupload', 'penalty', 'nonpenalty', 'bulkupload', 'bulkkeying',
        'edited1', 'edited2', 'edited3', 'edited4', 'reject1', 'reject2', 'reject3', 'reject4', 'notvalidate', 'validateerror', 'waiver', 'waivererror', 'neterror',
        'per', 'percentage', 'amount',];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Process-Penalty Month List",
        pageStyle: "print",
    });

    //print...
    const componentRefTwo = useRef();
    const handleprintTwo = useReactToPrint({
        content: () => componentRefTwo.current,
        documentTitle: "Current Process-Penalty consolidate List",
        pageStyle: "print",
    });

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Process-Penalty Month List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //image second table
    const handleCaptureImageTwo = () => {
        if (gridRefTableImgTwo.current) {
            domtoimage.toBlob(gridRefTableImgTwo.current)
                .then((blob) => {
                    saveAs(blob, "Current Process-Penalty consolidate List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Penalty Over All Report"} />
            <PageHeading
                title="Penalty Over All Report"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Process Penalty"
                subpagename="Penalty Over All Report"
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpenaltyoverallreport") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Table Mode<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={tableOptions}
                                        value={selectedTable}
                                        onChange={(e) => {
                                            handleTableChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Table Mode"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={1} sm={6} xs={6} marginTop={3}>
                                <LoadingButton
                                    onClick={handleSubmit}
                                    loading={loadingdeloverall}
                                    sx={buttonStyles.buttonsubmit}
                                    loadingPosition="end"
                                    variant="contained"
                                >
                                    Filter
                                </LoadingButton>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box><br />
                    {/* <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Filter Mode<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        labelId="mode-select-label"
                                        options={mode}
                                        value={{ label: selectedMode, value: selectedMode }}
                                        onChange={(selectedOption) => {
                                            // Reset the date fields to empty strings
                                            let fromdate = '';
                                            let todate = '';

                                            // If a valid option is selected, get the date range
                                            if (selectedOption.value) {
                                                const dateRange = getDateRange(selectedOption.value);
                                                fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                                todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                            }
                                            // Set the state with formatted dates
                                            setFilterUser({
                                                ...filterUser,
                                                fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            });
                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.fromdate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            if (selectedDate <= currentDate) {
                                                setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate });
                                            } else {
                                                // Handle the case where the selected date is in the future (optional)
                                                // You may choose to show a message or take other actions.
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>{" "} To Date<b style={{ color: "red" }}>*</b>{" "}</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.todate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                                            if (filterUser.fromdate == "") {
                                                setPopupContentMalert("Please Select From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate < fromdateval) {
                                                setFilterUser({ ...filterUser, todate: "" });
                                                setPopupContentMalert("To Date should be after or equal to From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate <= currentDate) {
                                                setFilterUser({ ...filterUser, todate: selectedDate });
                                            } else {
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={1.5} md={2} sm={2} xs={6} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <LoadingButton onClick={handleSubmit} loading={loadingdeloverall} sx={buttonStyles.buttonsubmit} loadingPosition="end" variant="contained">Get List</LoadingButton>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box> <br /> */}
                    {loader && (
                        <Box sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                        }}>
                            <CircularProgress size="3rem" />
                        </Box>
                    )}
                    {/* First Table */}
                    {tableCheck?.includes('Process-Penalty Month List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Process-Penalty Month List</Typography>
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
                                                <MenuItem value={penaltyErrors?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv /> &ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagepenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={6} sm={6}>
                                        <Box>
                                            <AggregatedSearchBar
                                                columnDataTable={columnDataTable}
                                                setItems={setItems}
                                                addSerialNumber={addSerialNumber}
                                                setPage={setPage}
                                                maindatas={penaltyErrors}
                                                setSearchedString={setSearchedString}
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                                paginated={false}
                                                totalDatas={penaltyErrors}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid> <br />
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns</Button>&ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
                                {loader ? (
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
                                            gridRefTable={gridRefTable}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            // totalDatas={totalDatas}
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={penaltyErrors}
                                            pagenamecheck={"Client Error Waiver_Current"}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {/* Second Table */}
                    {tableCheck?.includes('Current Process-Penalty consolidate List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Current Process-Penalty consolidate List</Typography>
                                </Grid>
                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <Box>
                                            <label>Show entries:</label>
                                            <Select
                                                id="pageSizeSelect"
                                                value={pageSizeTwo}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 180,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                onChange={handlePageSizeChangeTwo}
                                                sx={{ width: "77px" }}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                                <MenuItem value={penaltyErrorsTwo?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenTwo(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenTwo(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintTwo}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenTwo(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagepenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageTwo}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={6} sm={6}>
                                        <Box>
                                            <AggregatedSearchBar
                                                columnDataTable={columnDataTableTwo}
                                                setItems={setItemsTwo}
                                                addSerialNumber={addSerialNumberTwo}
                                                setPage={setPageTwo}
                                                maindatas={penaltyErrorsTwo}
                                                setSearchedString={setSearchedStringTwo}
                                                searchQuery={searchQueryTwo}
                                                setSearchQuery={setSearchQueryTwo}
                                                paginated={false}
                                                totalDatas={penaltyErrorsTwo}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid><br />
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsTwo}>Show All Columns</Button>&ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsTwo}>Manage Columns</Button><br /><br />
                                {loader ? (
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
                                            rowDataTable={rowDataTableTwo}
                                            columnDataTable={columnDataTableTwo}
                                            columnVisibility={columnVisibilityTwo}
                                            page={pageTwo}
                                            setPage={setPageTwo}
                                            pageSize={pageSizeTwo}
                                            totalPages={totalPagesTwo}
                                            setColumnVisibility={setColumnVisibilityTwo}
                                            isHandleChange={isHandleChangeTwo}
                                            items={itemsTwo}
                                            gridRefTable={gridRefTableTwo}
                                            paginated={false}
                                            filteredDatas={filteredDatasTwo}
                                            // totalDatas={totalDatas}
                                            selectedRows={selectedRowsTwo}
                                            setSelectedRows={setSelectedRowsTwo}
                                            searchQuery={searchedStringTwo}
                                            handleShowAllColumns={handleShowAllColumnsTwo}
                                            setFilteredRowData={setFilteredRowDataTwo}
                                            filteredRowData={filteredRowDataTwo}
                                            setFilteredChanges={setFilteredChangesTwo}
                                            filteredChanges={filteredChangesTwo}
                                            gridRefTableImg={gridRefTableImgTwo}
                                            itemsList={penaltyErrorsTwo}
                                            pagenamecheck={"Client Error Waiver_Recheck"}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    <PenaltyCurrentOverAllReport penaltyErrorsThree={penaltyErrorsThree} penaltyErrorsFour={penaltyErrorsFour} filteredErrorData={filteredErrorData} loader={loader} tableCheck={tableCheck}
                        setFilteredRowDataThree={setFilteredRowDataThree} filteredChangesThree={filteredChangesThree} setFilteredChangesThree={setFilteredChangesThree} filteredRowDataThree={filteredRowDataThree} setIsHandleChangeThree={setIsHandleChangeThree} isHandleChangeThree={isHandleChangeThree} setSearchedStringThree={setSearchedStringThree} searchedStringThree={searchedStringThree}
                        setFilteredRowDataFour={setFilteredRowDataFour} filteredChangesFour={filteredChangesFour} setFilteredChangesFour={setFilteredChangesFour} filteredRowDataFour={filteredRowDataFour} setIsHandleChangeFour={setIsHandleChangeFour} isHandleChangeFour={isHandleChangeFour} setSearchedStringFour={setSearchedStringFour} searchedStringFour={searchedStringFour} isUserRoleAccess={isUserRoleAccess}
                    /><br />
                </>
            )
            }
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }} >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumns}
                    searchQuery={searchQueryManage}
                    setSearchQuery={setSearchQueryManage}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibility}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    initialColumnVisibility={initialColumnVisibility}
                    columnDataTable={columnDataTable}
                />
            </Popover>

            {/* Manage Column */}
            <Popover
                id={idTwo}
                open={isManageColumnsOpenTwo}
                anchorEl={anchorElTwo}
                onClose={handleCloseManageColumnsTwo}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsTwo}
                    searchQuery={searchQueryManageTwo}
                    setSearchQuery={setSearchQueryManageTwo}
                    filteredColumns={filteredColumnsTwo}
                    columnVisibility={columnVisibilityTwo}
                    toggleColumnVisibility={toggleColumnVisibilityTwo}
                    setColumnVisibility={setColumnVisibilityTwo}
                    initialColumnVisibility={initialColumnVisibilityTwo}
                    columnDataTable={columnDataTableTwo}
                />
            </Popover>

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
                itemsTwo={penaltyErrors ?? []}
                filename={"Process-Penalty Month List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpenTwo}
                handleCloseFilterMod={handleCloseFilterModTwo}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenTwo}
                isPdfFilterOpen={isPdfFilterOpenTwo}
                setIsPdfFilterOpen={setIsPdfFilterOpenTwo}
                handleClosePdfFilterMod={handleClosePdfFilterModTwo}
                filteredDataTwo={(filteredChangesTwo !== null ? filteredRowDataTwo : rowDataTableTwo) ?? []}
                itemsTwo={penaltyErrorsTwo ?? []}
                filename={"Current Process-Penalty consolidate List"}
                exportColumnNames={exportColumnNamesTwo}
                exportRowValues={exportRowValuesTwo}
                componentRef={componentRefTwo}
            />
        </Box >
    );
}

export default PenaltyOverallReport;