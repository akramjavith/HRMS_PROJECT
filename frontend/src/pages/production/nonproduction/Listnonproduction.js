import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import PageHeading from "../../../components/PageHeading";

function NonproductionList() {
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [isFilterOpenone, setIsFilterOpenone] = useState(false);
    const [isPdfFilterOpenone, setIsPdfFilterOpenone] = useState(false);
    // page refersh reload
    const handleCloseFilterModone = () => {
        setIsFilterOpenone(false);
    };
    const handleClosePdfFilterModone = () => {
        setIsPdfFilterOpenone(false);
    };
    const [isFilterOpentwo, setIsFilterOpentwo] = useState(false);
    const [isPdfFilterOpentwo, setIsPdfFilterOpentwo] = useState(false);
    // page refersh reload
    const handleCloseFilterModtwo = () => {
        setIsFilterOpentwo(false);
    };
    const handleClosePdfFilterModtwo = () => {
        setIsPdfFilterOpentwo(false);
    };
    const [fileFormat, setFormat] = useState("");
    const [fileFormatone, setFormatone] = useState("");
    const [fileFormattwo, setFormattwo] = useState("");
    const [taskcategory, setTaskcategory] = useState({
        base: "All",
    });
    const [taskcategorys, setTaskcategorys] = useState([]);
    const [taskcategorysAssign, setTaskcategorysAssign] = useState([]);
    const [taskcategorysall, setTaskcategorysall] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryAssign, setSearchQueryAssign] = useState("");
    const [searchQueryall, setSearchQueryall] = useState("");
    const { isUserRoleCompare, isUserRoleAccess,  isAssignBranch, pageName, setPageName  } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const gridRefAssign = useRef(null);
    const gridRefall = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsAssign, setSelectedRowsAssign] = useState([]);
    const [selectedRowsall, setSelectedRowsall] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQueryManageAssign, setSearchQueryManageAssign] = useState("");
    const [searchQueryManageall, setSearchQueryManageall] = useState("");
    const [copiedData, setCopiedData] = useState('');
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Assign List');
                });
            });
        }
    };
    const handleCaptureImageAssign = () => {
        if (gridRefAssign.current) {
            html2canvas(gridRefAssign.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Approved List');
                });
            });
        }
    };
    const handleCaptureImageAll = () => {
        if (gridRefall.current) {
            html2canvas(gridRefall.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Reject List.png');
                });
            });
        }
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const handleSelectionChangeAssign = (newSelection) => {
        setSelectedRowsAssign(newSelection.selectionModel);
    };
    const handleSelectionChangeall = (newSelection) => {
        setSelectedRowsall(newSelection.selectionModel);
    };
    //Datatable
    const [page, setPage] = useState(1);
    const [pageApproved, setPageApproved] = useState(1);
    const [pageReject, setPageReject] = useState(1);
    const [pageAsssign, setPageAssign] = useState(1);
    const [pageall, setPageall] = useState(1);
    const [pagesizeall, setPageSizeall] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageSizeApprove, setPageSizeApprove] = useState(10);
    const [pagesizeReject, setPageSizeReject] = useState(10);
    const [isOpenReject, setIsOpenReject] = useState(false);
    const handleClickOpenReject = () => {
        setIsOpenReject(true);
    };
    const handleCloseReject = () => {
        setIsOpenReject(false);
    }
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [isManageColumnsOpenAssign, setManageColumnsOpenAssign] = useState(false);
    const [isManageColumnsOpenall, setManageColumnsOpenall] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    const [anchorElAssign, setAnchorElAssign] = useState(null)
    const [anchorElall, setAnchorElall] = useState(null)
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleOpenManageColumnsAssign = (event) => {
        setAnchorElAssign(event.currentTarget);
        setManageColumnsOpenAssign(true);
    };
    const handleOpenManageColumnsall = (event) => {
        setAnchorElall(event.currentTarget);
        setManageColumnsOpenall(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };
    const handleCloseManageColumnsAssign = () => {
        setManageColumnsOpenAssign(false);
        setSearchQueryManageAssign("")
    };
    const handleCloseManageColumnsall = () => {
        setManageColumnsOpenall(false);
        setSearchQueryManageall("")
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
        name: true,
        category: true,
        subcategory: true,
        mode: true,
        date: true,
        allotdays: true,
        allothours: true,
        allotmins: true,
        days: true,
        hours: true,
        minutes: true,
        count: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // Show All Columns & Manage Columns 
    const initialColumnVisibilityAssign = {
        serialNumber: true,
        checkbox: true,
        name: true,
        category: true,
        subcategory: true,
        mode: true,
        date: true,
        allotdays: true,
        allothours: true,
        allotmins: true,
        days: true,
        hours: true,
        minutes: true,
        count: true,
        // reason: true,
    };
    const [columnVisibilityAssign, setColumnVisibilityAssign] = useState(initialColumnVisibilityAssign);
    // Show All Columns & Manage Columns 
    const initialColumnVisibilityall = {
        serialNumber: true,
        checkbox: true,
        name: true,
        category: true,
        subcategory: true,
        mode: true,
        date: true,
        allotdays: true,
        allothours: true,
        allotmins: true,
        days: true,
        hours: true,
        minutes: true,
        count: true,
        // reason: true,
        actions: true,
    };
    const [columnVisibilityall, setColumnVisibilityall] = useState(initialColumnVisibilityall);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const handleIsApprove = () => {
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Are You Sure to Approve"}</p>
            </>
        );
        handleClickOpenApprove();
    }
    const handleReject = () => {
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Are You Sure to Reject"}</p>
            </>
        );
        handleClickOpenReject();
    }
    const [nonProduction, setNonProductionData] = useState([])
    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTION_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionData(res?.data?.snonproduction);
            if (name == "approve") {
                handleIsApprove();
            } else {
                handleReject()
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    let exportColumnNames = ["Name", "Category Name", "Sub Category", "Mode", "Date", "Allot Days", "Allot Hours", "Allot Mins", "Days", "Hours", "Minutes", "Count"];
    let exportRowValues = ["name", "category", "subcategory", "mode", "date", "allotdays", "allothours", "allotmins", "days", "hours", "minutes", "count"];
    let exportColumnNamesone = ["Name", "Category Name", "Sub Category", "Mode", "Date", "Allot Days", "Allot Hours", "Allot Mins", "Days", "Hours", "Minutes", "Count"];
    let exportRowValuesone = ["name", "category", "subcategory", "mode", "date", "allotdays", "allothours", "allotmins", "days", "hours", "minutes", "count"];
    let exportColumnNamestwo = ["Name", "Category Name", "Sub Category", "Mode", "Date", "Allot Days", "Allot Hours", "Allot Mins", "Days", "Hours", "Minutes", "Count"];
    let exportRowValuestwo = ["name", "category", "subcategory", "mode", "date", "allotdays", "allothours", "allotmins", "days", "hours", "minutes", "count"];
    const handleFilterClick = async (from) => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.NONPRODUCTION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            if (from === "All") {
                const filterByBase = res_vendor?.data?.nonproduction.filter((item) => item.approvestatus === undefined);
                setTaskcategorys(filterByBase?.map((item, index) => ({
                    ...item,
                    serialNumber: item.serialNumber,
                    name: item.name,
                    category: item.category,
                    subcategory: item.subcategory,
                    mode: item.mode,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    allotdays: item.alloteddays,
                    allothours: item.allotedhours,
                    allotmins: item.allotedminutes,
                    days: item.days,
                    hours: item.hours,
                    minutes: item.minutes,
                    count: item.count
                })));
                setTaskcategorysAssign(res_vendor?.data?.nonproduction.filter((item) => item.approvestatus === true).map((item, index) => ({
                    ...item,
                    serialNumber: item.serialNumber,
                    name: item.name,
                    category: item.category,
                    subcategory: item.subcategory,
                    mode: item.mode,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    allotdays: item.alloteddays,
                    allothours: item.allotedhours,
                    allotmins: item.allotedminutes,
                    days: item.days,
                    hours: item.hours,
                    minutes: item.minutes,
                    count: item.count
                })));
                setTaskcategorysall(res_vendor?.data?.nonproduction.filter((item) => item.approvestatus === false).map((item, index) => ({
                    ...item,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    allotdays: item.alloteddays,
                    allothours: item.allotedhours,
                    allotmins: item.allotedminutes,
                })));
                setTaskcategorycheck(true)
            } else {
                const filterByBase = res_vendor?.data?.nonproduction.filter((item) => item.mode === taskcategory.base && item.approvestatus === undefined)
                setTaskcategorys(filterByBase?.map((item, index) => ({
                    ...item,
                    serialNumber: item.serialNumber,
                    name: item.name,
                    category: item.category,
                    subcategory: item.subcategory,
                    mode: item.mode,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    allotdays: item.alloteddays,
                    allothours: item.allotedhours,
                    allotmins: item.allotedminutes,
                    days: item.days,
                    hours: item.hours,
                    minutes: item.minutes,
                    count: item.count
                })));
                setTaskcategorysAssign(res_vendor?.data?.nonproduction.filter((item) => item.approvestatus === true));
                setTaskcategorysall(res_vendor?.data?.nonproduction.filter((item) => item.approvestatus === false).map((item, index) => ({
                    ...item,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    allotdays: item.alloteddays,
                    allothours: item.allotedhours,
                    allotmins: item.allotedminutes,
                })));
                setTaskcategorycheck(true)
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Assign List',
        pageStyle: 'print'
    });
    const componentRefAssign = useRef();
    const handleprintAssign = useReactToPrint({
        content: () => componentRefAssign.current,
        documentTitle: 'Approved List',
        pageStyle: 'print'
    });
    const componentRefall = useRef();
    const handleprintall = useReactToPrint({
        content: () => componentRefall.current,
        documentTitle: 'Reject List',
        pageStyle: 'print'
    });
    useEffect(() => {
        handleFilterClick("All")
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
    const [itemssAssign, setItemsAssign] = useState([]);
    const [itemsall, setItemsall] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskcategorys?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    const addSerialNumberApprove = () => {
        const itemsWithSerialNumber = taskcategorysAssign?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsAssign(itemsWithSerialNumber);
    }
    const addSerialNumberall = () => {
        const itemsWithSerialNumberall = taskcategorysall?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsall(itemsWithSerialNumberall);
    }
    useEffect(() => {
        addSerialNumber();
    }, [taskcategorys])
    useEffect(() => {
        addSerialNumberApprove();
    }, [taskcategorysAssign])
    useEffect(() => {
        addSerialNumberall();
    }, [taskcategorysall])
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageChangeAssign = (newPage) => {
        setPageApproved(newPage);
        setSelectedRowsAssign([]);
        setSelectAllCheckedAssign(false)
    };
    const handlePageChangeall = (newPage) => {
        setPageReject(newPage);
        setSelectedRowsall([]);
        setSelectAllCheckedall(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        setPage(1);
    };
    const handlePageSizeChangeApproved = (event) => {
        setPageSizeApprove(Number(event.target.value));
        setSelectedRowsall([]);
        setSelectAllCheckedAssign(false)
        setPageApproved(1);
    };
    const handlePageSizeChangeReject = (event) => {
        setPageSizeReject(Number(event.target.value));
        setSelectedRowsall([]);
        setSelectAllCheckedall(false)
        setPageReject(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    //datatable....
    const handleSearchChangeAssign = (event) => {
        setSearchQueryAssign(event.target.value);
    };
    const handleSearchChangeall = (event) => {
        setSearchQueryall(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const searchTermsAssign = searchQueryAssign.toLowerCase().split(" ");
    const searchTermsall = searchQueryall.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDatasAssign = itemssAssign?.filter((item) => {
        return searchTermsAssign.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDatasall = itemsall?.filter((item) => {
        return searchTermsall.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const filteredDataAssign = filteredDatasAssign.slice((pageApproved - 1) * pageSizeApprove, pageApproved * pageSizeApprove);
    const filteredDataall = filteredDatasall.slice((pageReject - 1) * pagesizeReject, pageReject * pagesizeReject);
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
    const totalPagesApproved = Math.ceil(filteredDatasAssign.length / pageSizeApprove);
    const totalPagesReject = Math.ceil(filteredDatasall.length / pagesizeReject);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const visiblePagesApproved = Math.min(totalPagesApproved, 3);
    const firstVisiblePageApproved = Math.max(1, pageApproved - 1);
    const lastVisiblePageApproved = Math.min(firstVisiblePageApproved + visiblePagesApproved - 1, totalPagesApproved);
    const pageNumbersApproved = [];
    const indexOfLastItemApproved = pageApproved * pageSizeApprove;
    const indexOfFirstItemApproved = indexOfLastItemApproved - pageSizeApprove;
    for (let i = firstVisiblePage; i <= lastVisiblePageApproved; i++) {
        pageNumbersApproved.push(i);
    }
    const visiblePagesReject = Math.min(totalPagesReject, 3);
    const firstVisiblePageReject = Math.max(1, pageReject - 1);
    const lastVisiblePageReject = Math.min(firstVisiblePageReject + visiblePagesReject - 1, totalPagesReject);
    const pageNumbersReject = [];
    const indexOfLastItemReject = pageReject * pagesizeReject;
    const indexOfFirstItemReject = indexOfLastItemReject - pagesizeReject;
    for (let i = firstVisiblePageReject; i <= lastVisiblePageReject; i++) {
        pageNumbersReject.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectAllCheckedAssign, setSelectAllCheckedAssign] = useState(false);
    const [selectAllCheckedall, setSelectAllCheckedall] = useState(false);
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
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
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
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "name", headerName: "Name", flex: 0, width: 100, hide: !columnVisibility.name, headerClassName: "bold-header" },
        { field: "category", headerName: "Category Name", flex: 0, width: 130, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 130, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        { field: "mode", headerName: "Mode", flex: 0, width: 130, hide: !columnVisibility.mode, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 130, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "allotdays", headerName: "Allot Days", flex: 0, width: 130, hide: !columnVisibility.allotdays, headerClassName: "bold-header" },
        { field: "allothours", headerName: "Allot Hours", flex: 0, width: 130, hide: !columnVisibility.allothours, headerClassName: "bold-header" },
        { field: "allotmins", headerName: "Allot Mins", flex: 0, width: 130, hide: !columnVisibility.allotmins, headerClassName: "bold-header" },
        { field: "days", headerName: "Days", flex: 0, width: 130, hide: !columnVisibility.days, headerClassName: "bold-header" },
        { field: "hours", headerName: "Hours", flex: 0, width: 130, hide: !columnVisibility.hours, headerClassName: "bold-header" },
        { field: "minutes", headerName: "Minutes", flex: 0, width: 130, hide: !columnVisibility.minutes, headerClassName: "bold-header" },
        { field: "count", headerName: "Count", flex: 0, width: 130, hide: !columnVisibility.count, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("enonproductionlist") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.row.id, "approve");
                        }}>
                            Approve
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("enonproductionlist") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => {
                            getCode(params.row.id, "reject");
                        }}>
                            Reject
                        </Button>
                    )}
                </Grid>
            ),
        },
    ]
    const columnDataTableAssign = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllCheckedAssign}
                    onSelectAll={() => {
                        if (rowDataTableAssign.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllCheckedAssign) {
                            setSelectedRowsAssign([]);
                        } else {
                            const allRowIds = rowDataTableAssign.map((row) => row.id);
                            setSelectedRowsAssign(allRowIds);
                        }
                        setSelectAllCheckedAssign(!selectAllCheckedAssign);
                    }}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRowsAssign.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRowsAssign.includes(params.row.id)) {
                            updatedSelectedRows = selectedRowsAssign.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRowsAssign, params.row.id];
                        }
                        setSelectedRowsAssign(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllCheckedAssign(updatedSelectedRows.length === filteredDataAssign.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibilityAssign.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibilityAssign.serialNumber, headerClassName: "bold-header"
        },
        { field: "name", headerName: "Name", flex: 0, width: 100, hide: !columnVisibilityAssign.name, headerClassName: "bold-header" },
        { field: "category", headerName: "Category Name", flex: 0, width: 130, hide: !columnVisibilityAssign.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 130, hide: !columnVisibilityAssign.subcategory, headerClassName: "bold-header" },
        { field: "mode", headerName: "Mode", flex: 0, width: 130, hide: !columnVisibilityAssign.mode, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 130, hide: !columnVisibilityAssign.date, headerClassName: "bold-header" },
        { field: "allotdays", headerName: "Allot Days", flex: 0, width: 130, hide: !columnVisibilityAssign.allotdays, headerClassName: "bold-header" },
        { field: "allothours", headerName: "Allot Hours", flex: 0, width: 130, hide: !columnVisibilityAssign.allothours, headerClassName: "bold-header" },
        { field: "allotmins", headerName: "Allot Mins", flex: 0, width: 130, hide: !columnVisibilityAssign.allotmins, headerClassName: "bold-header" },
        { field: "days", headerName: "Days", flex: 0, width: 130, hide: !columnVisibilityAssign.days, headerClassName: "bold-header" },
        { field: "hours", headerName: "Hours", flex: 0, width: 130, hide: !columnVisibilityAssign.hours, headerClassName: "bold-header" },
        { field: "minutes", headerName: "Minutes", flex: 0, width: 130, hide: !columnVisibilityAssign.minutes, headerClassName: "bold-header" },
        { field: "count", headerName: "Count", flex: 0, width: 130, hide: !columnVisibilityAssign.count, headerClassName: "bold-header" },
    ]
    const columnDataTableall = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllCheckedall}
                    onSelectAll={() => {
                        if (rowDataTableall.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllCheckedall) {
                            setSelectedRowsall([]);
                        } else {
                            const allRowIds = rowDataTableall.map((row) => row.id);
                            setSelectedRowsall(allRowIds);
                        }
                        setSelectAllCheckedall(!selectAllCheckedall);
                    }}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRowsall.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRowsall.includes(params.row.id)) {
                            updatedSelectedRows = selectedRowsall.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRowsall, params.row.id];
                        }
                        setSelectedRowsall(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllCheckedall(updatedSelectedRows.length === filteredDataall.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibilityall.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibilityall.serialNumber, headerClassName: "bold-header"
        },
        { field: "name", headerName: "Name", flex: 0, width: 100, hide: !columnVisibilityall.name, headerClassName: "bold-header" },
        { field: "category", headerName: "Category Name", flex: 0, width: 130, hide: !columnVisibilityall.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 130, hide: !columnVisibilityall.subcategory, headerClassName: "bold-header" },
        { field: "mode", headerName: "Mode", flex: 0, width: 130, hide: !columnVisibilityall.mode, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 130, hide: !columnVisibilityall.date, headerClassName: "bold-header" },
        { field: "allotdays", headerName: "Allot Days", flex: 0, width: 130, hide: !columnVisibilityall.allotdays, headerClassName: "bold-header" },
        { field: "allothours", headerName: "Allot Hours", flex: 0, width: 130, hide: !columnVisibilityall.allothours, headerClassName: "bold-header" },
        { field: "allotmins", headerName: "Allot Mins", flex: 0, width: 130, hide: !columnVisibilityall.allotmins, headerClassName: "bold-header" },
        { field: "days", headerName: "Days", flex: 0, width: 130, hide: !columnVisibilityall.days, headerClassName: "bold-header" },
        { field: "hours", headerName: "Hours", flex: 0, width: 130, hide: !columnVisibilityall.hours, headerClassName: "bold-header" },
        { field: "minutes", headerName: "Minutes", flex: 0, width: 130, hide: !columnVisibilityall.minutes, headerClassName: "bold-header" },
        { field: "count", headerName: "Count", flex: 0, width: 130, hide: !columnVisibilityall.count, headerClassName: "bold-header" },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            mode: item.mode,
            date: item.date,
            allotdays: item.alloteddays,
            allothours: item.allotedhours,
            allotmins: item.allotedminutes,
            days: item.days,
            hours: item.hours,
            minutes: item.minutes,
            count: item.count
        }
    });
    const rowDataTableAssign = filteredDataAssign.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            mode: item.mode,
            date: item.date,
            allotdays: item.allotdays,
            allothours: item.allothours,
            allotmins: item.allotmins,
            days: item.days,
            hours: item.hours,
            minutes: item.minutes,
            count: item.count
        }
    });
    const rowDataTableall = filteredDataall.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            mode: item.mode,
            date: item.date,
            allotdays: item.alloteddays,
            allothours: item.allotedhours,
            allotmins: item.allotedminutes,
            days: item.days,
            hours: item.hours,
            minutes: item.minutes,
            count: item.count
        }
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const rowsWithCheckboxesAssign = rowDataTableAssign.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsAssign.includes(row.id),
    }));
    const rowsWithCheckboxesall = rowDataTableall.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsall.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    const handleShowAllColumnsAssign = () => {
        const updatedVisibility = { ...columnVisibilityAssign };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAssign(updatedVisibility);
    };
    const handleShowAllColumnsall = () => {
        const updatedVisibility = { ...columnVisibilityall };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityall(updatedVisibility);
    };
    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
    const filteredColumnsAssign = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageAssign.toLowerCase())
    );
    const filteredColumnsall = columnDataTableall.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageall.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    const toggleColumnVisibilityAssign = (field) => {
        setColumnVisibilityAssign((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    const toggleColumnVisibilityall = (field) => {
        setColumnVisibilityall((prevVisibility) => ({
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
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentAssign = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsAssign}
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
                    value={searchQueryManageAssign}
                    onChange={(e) => setSearchQueryManageAssign(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumnsAssign.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibilityAssign[column.field]}
                                        onChange={() => toggleColumnVisibilityAssign(column.field)}
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
                            onClick={() => setColumnVisibilityAssign(initialColumnVisibilityAssign)}
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
                                columnDataTableAssign.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityAssign(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentall = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsall}
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
                    value={searchQueryManageall}
                    onChange={(e) => setSearchQueryManageall(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumnsall.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibilityall[column.field]}
                                        onChange={() => toggleColumnVisibilityall(column.field)}
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
                            onClick={() => setColumnVisibilityall(initialColumnVisibilityall)}
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
                                columnDataTableall.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityall(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    const BaseOpt = [{ label: "All", value: "All" }, { label: "Time", value: "Time" }, { label: "Count", value: "Count" }]
    //add function 
    const [isOpenApprove, setIsOpenApprove] = useState(false);
    const handleClickOpenApprove = () => {
        setIsOpenApprove(true);
    };
    const handleCloseApprove = () => {
        setIsOpenApprove(false);
    }
    const sendApproveRequest = async (isApproved) => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.put(`${SERVICE.NONPRODUCTION_SINGLE}/${nonProduction._id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(nonProduction.name),
                category: String(nonProduction.category),
                subcategory: String(nonProduction.subcategory),
                mode: String(nonProduction.mode),
                count: String(nonProduction.count),
                date: String(nonProduction.date),
                fromtime: String(nonProduction.fromtime),
                totime: String(nonProduction.totime),
                totalhours: String(nonProduction.totalhours),
                alloteddays: String(nonProduction.alloteddays),
                allotedhours: String(nonProduction.allotedhours),
                allotedminutes: String(nonProduction.allotedhours),
                days: String(nonProduction.days),
                hours: String(nonProduction.hours),
                minutes: String(nonProduction.minutes),
                approvestatus: Boolean(isApproved),
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            })
            handleCloseApprove();
            handleCloseReject();
            await handleFilterClick("All")
            if (isApproved) {
                setPopupContent("Assigned Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            } else {
                setPopupContent("Rejected Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    return (
        <Box>
            <Headtitle title={'Non Production List'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Non Production"
                modulename="Production"
                submodulename="Non Production"
                mainpagename="Non-production Setup"
                subpagename="Non Production List"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("anonproductionlist")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        {/* <Typography sx={userStyle.importheadtext}>Add Idle Time Work Entry</Typography> */}
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Base<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={BaseOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: taskcategory.base,
                                                    value: taskcategory.base,
                                                }}
                                                onChange={(e) => {
                                                    setTaskcategory({
                                                        ...taskcategory,
                                                        base: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} sx={{ marginTop: "24px" }}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                handleFilterClick(taskcategory.base)
                                            }}
                                        >
                                            Filter
                                        </Button>
                                    </Grid>
                                </Grid>
                                <br />  <br />
                            </>
                        </Box>
                    </>
                )}
            <br />
            {/* ****** Table 1 Start ****** */}
            {isUserRoleCompare?.includes("lnonproductionlist") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Assign List</Typography>
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
                                        {/* <MenuItem value={(taskcategorys?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelnonproductionlist") && (
                                        <>
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnonproductionlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnonproductionlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnonproductionlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenonproductionlist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!taskcategoryCheck ?
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
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }} ref={gridRef}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
                                        ref={gridRef}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>}
                    </Box>
                </>
            )
            }
            <br />
            {/* ****** Table 1 Start ****** */}
            {isUserRoleCompare?.includes("lnonproductionlist") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Approved List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSizeApprove}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeApproved} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelnonproductionlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenone(true)
                                                setFormatone("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnonproductionlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenone(true)
                                                setFormatone("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnonproductionlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintAssign}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnonproductionlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenone(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenonproductionlist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAssign}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQueryAssign}
                                            onChange={handleSearchChangeAssign}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsAssign}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAssign}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!taskcategoryCheck ?
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
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }} ref={gridRefAssign}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxesAssign}
                                        columns={columnDataTableAssign.filter((column) => columnVisibilityAssign[column.field])}
                                        onSelectionModelChange={handleSelectionChangeAssign}
                                        selectionModel={selectedRowsAssign}
                                        autoHeight={true}
                                        ref={gridRefAssign}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataAssign.length > 0 ? ((pageApproved - 1) * pageSizeApprove) + 1 : 0} to {Math.min(pageApproved * pageSizeApprove, filteredDatasAssign.length)} of {filteredDatasAssign.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageApproved(1)} disabled={pageApproved === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeAssign(pageApproved - 1)} disabled={pageApproved === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersApproved?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeAssign(pageNumber)} className={((pageApproved)) === pageNumber ? 'active' : ''} disabled={pageApproved === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePageApproved < totalPagesApproved && <span>...</span>}
                                        <Button onClick={() => handlePageChangeAssign(pageApproved + 1)} disabled={pageApproved === totalPagesApproved} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageApproved((totalPagesApproved))} disabled={pageApproved === totalPagesApproved} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>}
                    </Box>
                </>
            )
            }
            <br />
            {/* ****** Table 2 Start ****** */}
            {isUserRoleCompare?.includes("lnonproductionlist") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Reject List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pagesizeReject}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeReject} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelnonproductionlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpentwo(true)
                                                setFormattwo("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnonproductionlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpentwo(true)
                                                setFormattwo("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnonproductionlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintall}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnonproductionlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpentwo(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenonproductionlist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAll}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQueryall}
                                            onChange={handleSearchChangeall}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsall}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsall}>Manage Columns</Button>&ensp;
                        <br /><br />
                        {!taskcategoryCheck ?
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
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden',
                                    }} ref={gridRefall}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxesall}
                                        columns={columnDataTableall.filter((column) => columnVisibilityall[column.field])}
                                        onSelectionModelChange={handleSelectionChangeall}
                                        selectionModel={selectedRowsall}
                                        autoHeight={true}
                                        ref={gridRefall}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataall.length > 0 ? ((pageReject - 1) * pagesizeReject) + 1 : 0} to {Math.min(pageReject * pagesizeReject, filteredDatasall.length)} of {filteredDatasall.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageReject(1)} disabled={pageReject === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeall(pageReject - 1)} disabled={pageReject === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersReject?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeall(pageNumber)} className={((pageReject)) === pageNumber ? 'active' : ''} disabled={pageReject === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePageReject < totalPagesReject && <span>...</span>}
                                        <Button onClick={() => handlePageChangeall(pageReject + 1)} disabled={pageReject === totalPagesReject} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageReject((totalPagesReject))} disabled={pageReject === totalPagesReject} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
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
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpenAssign}
                anchorEl={anchorElAssign}
                onClose={handleCloseManageColumnsAssign}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContentAssign}
            </Popover>
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpenall}
                anchorEl={anchorElall}
                onClose={handleCloseManageColumnsall}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContentall}
            </Popover>
            {/* Reject DIALOG */}
            <Box>
                <Dialog
                    open={isOpenReject}
                    onClose={handleCloseReject}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={() => {
                            sendApproveRequest(false)
                        }}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Approve DIALOG */}
            <Box>
                <Dialog
                    open={isOpenApprove}
                    onClose={handleCloseApprove}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={() => {
                            sendApproveRequest(true)
                        }}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={taskcategorys ?? []}
                filename={"Assign List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpenone}
                handleCloseFilterMod={handleCloseFilterModone}
                fileFormat={fileFormatone}
                setIsFilterOpen={setIsFilterOpenone}
                isPdfFilterOpen={isPdfFilterOpenone}
                setIsPdfFilterOpen={setIsPdfFilterOpenone}
                handleClosePdfFilterMod={handleClosePdfFilterModone}
                filteredDataTwo={filteredDataAssign ?? []}
                itemsTwo={taskcategorysAssign ?? []}
                filename={"Approved List"}
                exportColumnNames={exportColumnNamesone}
                exportRowValues={exportRowValuesone}
                componentRef={componentRefAssign}
            />
            <ExportData
                isFilterOpen={isFilterOpentwo}
                handleCloseFilterMod={handleCloseFilterModtwo}
                fileFormat={fileFormattwo}
                setIsFilterOpen={setIsFilterOpentwo}
                isPdfFilterOpen={isPdfFilterOpentwo}
                setIsPdfFilterOpen={setIsPdfFilterOpentwo}
                handleClosePdfFilterMod={handleClosePdfFilterModtwo}
                filteredDataTwo={rowDataTableall ?? []}
                itemsTwo={taskcategorysall ?? []}
                filename={"Reject List"}
                exportColumnNames={exportColumnNamestwo}
                exportRowValues={exportRowValuestwo}
                componentRef={componentRefall}
            />
        </Box>
    );
}
export default NonproductionList;