import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import {
    Box,
    Button, Divider,
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
    Popover,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CircularProgress, {
    circularProgressClasses,
} from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import SendToServer from "../../sendtoserver";
import LoadingButton from '@mui/lab/LoadingButton';

import domtoimage from 'dom-to-image';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import PageHeading from "../../../components/PageHeading";
// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: "relative" }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) =>
                        theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                    animationDuration: "550ms",
                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: "round",
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}
function PenaltyDayUpload() {
    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ];
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, "0");
    // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    // var yyyy = today.getFullYear();
    // today = yyyy + "-" + mm + "-" + dd;

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isloading, setIsloading] = useState(false);
    const [overallItems, setOverallItems] = useState([]);

    const [filteredRowDataViewAll, setFilteredRowDataViewAll] = useState([]);
    const [filteredChangesViewAll, setFilteredChangesViewAll] = useState(null);

    const [overallItemsViewAll, setOverallItemsViewAll] = useState([]);

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [isHandleChangeNew, setIsHandleChangeNew] = useState(false);
    const [searchedStringNew, setSearchedStringNew] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
        setIsLoaderbtn(false);
    }
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setIsLoaderbtn(false);
    };
    const gridRef = useRef(null);
    const [items, setItems] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [deleteClientUserID, setDeleteClientUserID] = useState({});
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loader, setIsLoader] = useState(false);
    const [loaderbtn, setIsLoaderbtn] = useState(false);
    const [penaltydayuploadlist, setPenaltydayuploadList] = useState([]);
    const [show, setShow] = useState(false);
    const [AlertButton, setAlertButton] = useState(false);
    const [fileupload, setFileupload] = useState([]);
    const [fileName, setFileName] = useState("");
    const [fileNameView, setFileNameView] = useState("");
    const [fileNameID, setFileNameID] = useState("");
    const { auth, setngs } = useContext(AuthContext);
    const [dataupdated, setDataupdated] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [penaltydayUploadOverallData, setPenaltydayUploadOverallData] = useState(
        []
    );
    const [fileFormat, setFormat] = useState('')
    const [documentFiles, setdocumentFiles] = useState([]);
    const [isFilterOpenAll, setIsFilterOpenAll] = useState(false);
    const [isPdfFilterOpenAll, setIsPdfFilterOpenAll] = useState(false);
    // page refersh reload
    const handleCloseFilterModAll = () => {
        setIsFilterOpenAll(false);
    };
    const handleClosePdfFilterModAll = () => {
        setIsPdfFilterOpenAll(false);
    };
    //Datatable
    const [page, setPage] = useState(1);
    const [excelData, setExcelData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const fromDateData = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
    const toDateData = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

    const [filterUser, setFilterUser] = useState({
        fromdate: fromDateData,
        todate: toDateData,
        day: "Last Week"
    });


    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
                break;
            default:
                return;
        }
    }
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
        // fetchAllPenaltyday();
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    const [penaltydayupload, setPenaltydayupload] = useState({
        date: formattedDate, company: "Please Select Company",

    });
    const backLPage = useNavigate();
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        // ResetFunc();
        // fetchAllPenaltyday();
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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    // Access
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName,
        buttonStyles } = useContext(
            UserRoleAccessContext
        );
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
    const [dataArrayLength, setDataArrayLength] = useState([]);
    // viewAll model
    const initialColumnVisibilityviewAll = {
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        processcode: true,
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
        edited1: true,
        edited2: true,
        edited3: true,
        edited4: true,
        reject1: true,
        reject1: true,
        reject2: true,
        reject3: true,
        reject4: true,
        notvalidate: true,
        validateerror: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
        actions: true,
    };
    const [openviewAll, setOpenviewAll] = useState(false);
    const handleClickOpenviewAll = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpenviewAll(true);
    };
    // view all codes
    const [itemsviewAll, setItemsviewAll] = useState([]);
    const [productionoriginalviewAll, setProductionoriginalViewAll] = useState(
        []
    );
    const addSerialNumberviewAll = (datas) => {
        const itemsWithSerialNumber = datas?.map(
            (item, index) => ({
                ...item,
                serialNumber: index + 1,
            })
        );
        setItemsviewAll(itemsWithSerialNumber);
        setOverallItemsViewAll(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumberviewAll(productionoriginalviewAll);
    }, [productionoriginalviewAll]);
    const [searchQueryviewAll, setSearchQueryviewAll] = useState("");
    const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");
    const [pageviewAll, setPageviewAll] = useState(1);
    const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(
        initialColumnVisibilityviewAll
    );
    const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
    const handleCloseviewAll = () => {
        setOpenviewAll(false);
        setProductionoriginalViewAll([]);
        setSearchQueryviewAll("");
        setPageviewAll(1);
        setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    };
    const [productionoriginalViewAllArray, setProductionoriginalViewAllArray] = useState([])
    // get single row to view....
    const getviewCodeall = async (id) => {

        setPageName(!pageName)
        try {
            setProductionfirstViewcheck(false);
            let res = await axios.get(`${SERVICE.SINGLE_PENALTYDAYUPLOAD}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let filteredData = res?.data?.spenaltydayupload?.uploaddata?.filter(item => {

            //     let data = accessbranch.some(branch => (
            //         branch.company === item.company &&
            //         branch.branch === item.branch &&
            //         branch.unit === item.unit)
            //     )

            //     return data;
            // }
            // )
            // console.log(filteredData, "filteredData")
            setProductionoriginalViewAll(res?.data?.spenaltydayupload?.uploaddata?.map(
                (item, index) => ({
                    ...item,
                    serialNumber: index + 1,
                    date: moment(item.date).format("DD-MM-YYYY")
                })));
            setProductionoriginalViewAllArray(res?.data?.spenaltydayupload?.uploaddata);
            setFileNameView(res?.data?.spenaltydayupload?.filename);
            setFileNameID(res?.data?.spenaltydayupload?._id);
            handleClickOpenviewAll();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {
            setProductionfirstViewcheck(true);
            setPageviewAll(1);
            setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
        }
    };
    //Datatable
    const handlePageChangeviewAll = (newPage) => {
        setPageviewAll(newPage);
    };
    const handlePageSizeChangeviewAll = (event) => {
        setPageSizeviewAll(Number(event.target.value));
        setPageviewAll(1);
    };
    //datatable....
    const handleSearchChangeviewAll = (event) => {
        setSearchQueryviewAll(event.target.value);
        setPageviewAll(1);
    };
    // Show All Columns functionality
    const handleShowAllColumnsviewAll = () => {
        const updatedVisibility = { ...columnVisibilityviewAll };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityviewAll(updatedVisibility);
    };
    // Manage Columnsviewall
    const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] =
        useState(false);
    const [anchorElviewAll, setAnchorElviewAll] = useState(null);
    const handleOpenManageColumnsviewAll = (event) => {
        setAnchorElviewAll(event.currentTarget);
        setManageColumnsOpenviewAll(true);
    };
    const handleCloseManageColumnsviewAll = () => {
        setManageColumnsOpenviewAll(false);
        setSearchQueryManageviewAll("");
    };
    const openviewpopall = Boolean(anchorElviewAll);
    const idviewall = openviewpopall ? "simple-popover" : undefined;

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityviewAll",
            JSON.stringify(columnVisibilityviewAll)
        );
    }, [columnVisibilityviewAll]);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityviewAll");
        if (savedVisibility) {
            setColumnVisibilityviewAll(JSON.parse(savedVisibility));
        }
    }, []);
    // Split the search query into individual terms
    const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDataviewAlls = itemsviewAll?.filter((item) => {
        return searchTermsviewAll.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDataviewAll = filteredDataviewAlls.slice(
        (pageviewAll - 1) * pageSizeviewAll,
        pageviewAll * pageSizeviewAll
    );
    const totalPagesviewAll = Math.ceil(
        filteredDataviewAlls.length / pageSizeviewAll
    );
    const visiblePagesviewAll = Math.min(totalPagesviewAll, 3);
    const firstVisiblePageviewAll = Math.max(1, pageviewAll - 1);
    const lastVisiblePageviewAll = Math.min(
        firstVisiblePageviewAll + visiblePagesviewAll - 1,
        totalPagesviewAll
    );
    const pageNumbersviewall = [];
    const indexOfLastItemviewAll = pageviewAll * pageSizeviewAll;
    const indexOfFirstItemviewAll = indexOfLastItemviewAll - pageSizeviewAll;
    for (let i = firstVisiblePageviewAll; i <= lastVisiblePageviewAll; i++) {
        pageNumbersviewall.push(i);
    }
    //print.view.all.
    const componentRefviewall = useRef();
    const handleprintviewall = useReactToPrint({
        content: () => componentRefviewall.current,
        documentTitle: fileNameView,
        pageStyle: "print",
    });
    const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            processcode: item.processcode,
            name: item.name,
            empcode: item.empcode,
            date: item.date,
            vendorname: item.vendorname,
            process: item.process,
            totalfield: item.totalfield,
            autoerror: item.autoerror,
            manualerror: item.manualerror,
            uploaderror: item.uploaderror,
            moved: item.moved,
            notupload: item.notupload,
            penalty: item.penalty,
            nonpenalty: item.nonpenalty,
            bulkupload: item.bulkupload,
            bulkkeying: item.bulkkeying,
            edited1: item.edited1,
            edited2: item.edited2,
            edited3: item.edited3,
            edited4: item.edited4,
            reject1: item.reject1,
            reject2: item.reject2,
            reject3: item.reject3,
            reject4: item.reject4,
            notvalidate: item.notvalidate,
            validateerror: item.validateerror,
            waivererror: item.waivererror,
            neterror: item.neterror,
            per: item.per,
            percentage: item.percentage,
            amount: item.amount,
        };
    });
    const gridRefviewall = useRef(null);


    const gridRefTableImgviewall = useRef(null);
    // image
    const handleCaptureImageviewall = () => {
        if (gridRefTableImgviewall.current) {
            domtoimage.toBlob(gridRefTableImgviewall.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Day Upload.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        filename: true,
        type: true,
        username: true,
        date: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    // datavallist:datavallist,
    const columnDataTableviewAll = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
            lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.company,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.branch,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.team,
            headerClassName: "bold-header",
        },
        {
            field: "processcode",
            headerName: "Process Code",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.processcode,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.name,
            headerClassName: "bold-header",
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.empcode,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 200,
            hide: !columnVisibilityviewAll.date,
            headerClassName: "bold-header",
        },
        {
            field: "vendorname",
            headerName: "Vendor Name",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.vendorname,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.process,
            headerClassName: "bold-header",
        },
        {
            field: "totalfield",
            headerName: "Total Field",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.totalfield,
            headerClassName: "bold-header",
        },
        {
            field: "autoerror",
            headerName: "Auto Error",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.autoerror,
            headerClassName: "bold-header",
        },
        {
            field: "manualerror",
            headerName: "Manual Error",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.manualerror,
            headerClassName: "bold-header",
        },
        {
            field: "uploaderror",
            headerName: "Upload Error",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.uploaderror,
            headerClassName: "bold-header",
        },
        {
            field: "moved",
            headerName: "Moved",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.moved,
            headerClassName: "bold-header",
        },
        {
            field: "notupload",
            headerName: "Not Upload",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.notupload,
            headerClassName: "bold-header",
        },
        {
            field: "penalty",
            headerName: "Penalty",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.penalty,
            headerClassName: "bold-header",
        },
        {
            field: "nonpenalty",
            headerName: "Non Penalty",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.nonpenalty,
            headerClassName: "bold-header",
        },
        {
            field: "bulkupload",
            headerName: "Bulk Upload",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.bulkupload,
            headerClassName: "bold-header",
        },
        {
            field: "bulkkeying",
            headerName: "Bulk Keying",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.bulkkeying,
            headerClassName: "bold-header",
        },
        {
            field: "edited1",
            headerName: "Edited1",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.edited1,
            headerClassName: "bold-header",
        },
        {
            field: "edited2",
            headerName: "Edited2",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.edited2,
            headerClassName: "bold-header",
        },
        {
            field: "edited3",
            headerName: "Edited3",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.edited3,
            headerClassName: "bold-header",
        },
        {
            field: "edited4",
            headerName: "Edited4",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.edited4,
            headerClassName: "bold-header",
        },
        {
            field: "reject1",
            headerName: "Reject1",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.reject1,
            headerClassName: "bold-header",
        },
        {
            field: "reject2",
            headerName: "Reject2",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.reject2,
            headerClassName: "bold-header",
        },
        {
            field: "reject3",
            headerName: "Reject3",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.reject3,
            headerClassName: "bold-header",
        },
        {
            field: "reject4",
            headerName: "Reject4",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.reject4,
            headerClassName: "bold-header",
        },
        {
            field: "notvalidate",
            headerName: "Not Validate",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.notvalidate,
            headerClassName: "bold-header",
        },
        {
            field: "validateerror",
            headerName: "Validate Error",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.validateerror,
            headerClassName: "bold-header",
        },
        {
            field: "waivererror",
            headerName: "Waiver% Error",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.waivererror,
            headerClassName: "bold-header",
        },
        {
            field: "neterror",
            headerName: "Net Error",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.neterror,
            headerClassName: "bold-header",
        },
        {
            field: "per",
            headerName: "Per%",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.per,
            headerClassName: "bold-header",
        },
        {
            field: "percentage",
            headerName: "Percentage",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.percentage,
            headerClassName: "bold-header",
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.amount,
            headerClassName: "bold-header",
        },
    ];
    // // Function to filter columns based on search query
    const filteredColumnsviewAll = columnDataTableviewAll.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageviewAll.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibilityviewAll = (field) => {
        setColumnVisibilityviewAll((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentviewAll = (
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
                onClick={handleCloseManageColumnsviewAll}
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
                    value={searchQueryManageviewAll}
                    onChange={(e) => setSearchQueryManageviewAll(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsviewAll.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityviewAll[column.field]}
                                        onChange={() => toggleColumnVisibilityviewAll(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
                            sx={{ textTransform: "none" }}
                            onClick={() =>
                                setColumnVisibilityviewAll(initialColumnVisibilityviewAll)
                            }
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
                                columnDataTableviewAll.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityviewAll(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    const [productionfirstViewCheck, setProductionfirstViewcheck] =
        useState(false);
    const username = isUserRoleAccess.username;
    const readExcel = (file, name, e) => {
        if (
            name?.split(".")[1] === "xlsx" ||
            name?.split(".")[1] === "xls" ||
            name?.split(".")[1] === "csv"
        ) {
            const expectedHeaders = [
                "Branch", "Unit", "Team", "Process Code", "Name", "Emp Code", "Ventor Name",
                "Process", "Total Field", "Auto Error", "Manual Error", "Upload Error", "Moved",
                "Not Upolad", "Penalty", "Non Penalty", "Bulk Upload", "Bulk Keying", "Edited1",
                "Edited2", "Edited3", "Edited4", "Reject1", "Reject2", "Reject3", "Reject4",
                "Not Validate", "Valid Error", "Waiver% Error", "Net Error", "per%", "Percentage", "Amount"
            ];
            const resume = e.target.files;
            let documentarray;
            const reader = new FileReader();
            const files = resume[0];
            reader.readAsDataURL(files);
            reader.onload = () => {
                documentarray = [
                    {
                        name: files.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ];
            };
            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: "buffer" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    // Get headers from the sheet's first row
                    const fileHeaders = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];

                    // Check if all expected headers are present
                    const isValidFile = expectedHeaders.every(header => fileHeaders.includes(header));
                    if (!isValidFile) {
                        setPopupContentMalert("File headers do not match the expected template. Please upload a valid file.");
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();

                        return;
                    }
                    // Convert the sheet to JSON
                    const data = XLSX.utils.sheet_to_json(ws);
                    resolve(data);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
            promise.then((d) => {
                const dataArray = d.map((item, index) => ({
                    date: item.Date,
                    company: penaltydayupload.company,
                    branch: item.Branch,
                    unit: item.Unit,
                    team: item.Team,
                    processcode: item["Process Code"],
                    name: item.Name,
                    empcode: item["Emp Code"],
                    date: penaltydayupload.date,
                    filename: name.split(".")[0],
                    vendorname: item["Ventor Name"],
                    process: item.Process,
                    totalfield: item["Total Field"],
                    autoerror: item["Auto Error"],
                    manualerror: item["Manual Error"],
                    uploaderror: item["Upload Error"],
                    moved: item.Moved,
                    notupload: item["Not Upolad"],
                    penalty: item.Penalty,
                    nonpenalty: item["Non Penalty"],
                    bulkupload: item["Bulk Upload"],
                    bulkkeying: item["Bulk Keying"],
                    edited1: item.Edited1,
                    edited2: item.Edited2,
                    edited3: item.Edited3,
                    edited4: item.Edited4,
                    reject1: item.Reject1,
                    reject2: item.Reject2,
                    reject3: item.Reject3,
                    reject4: item.Reject4,
                    notvalidate: item["Not Validate"],
                    validateerror: item["Valid Error"],
                    waivererror: item["Waiver% Error"],
                    neterror: item["Net Error"],
                    per: item["per%"],
                    percentage: item.Percentage,
                    amount: item.Amount,
                }));
                if (dataArray.length === 0) {
                    setPopupContentMalert("Already Added The Upload Data!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
                else if (dataArray.length !== d.length) {
                    setPopupContentMalert("Dupicate & Not a Number Value Removed!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
                const uniqueCombinationstime = new Set();
                // // Filter and deduplicate CATEGORIES
                const filteredArray1time = penaltydayUploadOverallData.filter((item) => {
                    const combination = `${item.company}
                    -
                    ${item.branch}-${item.unit}-${item.team}-${item.processcode}-${item.name}-${item.empcode}-${item.date}-${item.vendorname}-${item.process}-${item.totalfield}-${item.autoerror}-${item.manualerror}-${item.uploaderror}-${item.moved} -${item.notupload} -${item.penalty}-${item.nonpenalty}-${item.bulkupload}-${item.bulkkeying}
                    -${item.edited1}-${item.edited2}-${item.edited3}-${item.edited4}-${item.reject1}-${item.reject2}-${item.reject3}-${item.reject4}-${item.notvalidate}-${item.validateerror}
                    -${item.waivererror}-${item.neterror}
                    -${item.per}
                    -${item.percentage}-${item.amount}`
                        ;
                    if (!uniqueCombinationstime.has(combination)) {
                        uniqueCombinationstime.add(combination);
                        return true;
                    }
                    return false;
                });
                let uniqueArrayfinal = dataArray.filter((item) =>
                    !penaltydayuploadlist.some((data) =>
                        data.uploaddata.some((tp) =>
                            tp.date === item.date
                            && tp.company === item.company
                            && tp.branch === item.branch
                            && tp.unit == item.unit
                            && tp.team == item.team
                            && tp.processcode == item.processcode
                            && tp.name == item.name
                            && tp.empcode == item.empcode
                            //  && tp.filename == item.filename 
                            && tp.vendorname == item.vendorname
                            && tp.process == item.process
                            && tp.totalfield == item.totalfield
                            && tp.autoerror == item.autoerror
                            && tp.manualerror == item.manualerror
                            && tp.uploaderror == item.uploaderror
                            && tp.moved == item.moved
                            && tp.notupload == item.notupload
                            && tp.penalty == item.penalty
                            && tp.nonpenalty == item.nonpenalty
                            && tp.bulkupload == item.bulkupload
                            && tp.bulkkeying == item.bulkkeying
                            && tp.edited1 == item.edited1
                            && tp.edited2 == item.edited2
                            && tp.edited3 == item.edited3
                            && tp.edited4 == item.edited4
                            && tp.reject1 == item.reject1
                            && tp.reject2 == item.reject2
                            && tp.reject3 == item.reject3
                            && tp.reject4 == item.reject4
                            && tp.notvalidate == item.notvalidate
                            && tp.validateerror == item.validateerror
                            && tp.waivererror == item.waivererror
                            && tp.neterror == item.neterror
                            && tp.per == item.per
                            && tp.percentage == item.percentage
                            && tp.amount == item.amount
                        )
                    )
                );
                // const name =
                const ans = [
                    {
                        filename: name.split(".")[0],
                        company: penaltydayupload.company,
                        date: penaltydayupload.date,
                        uploaddata: uniqueArrayfinal,
                        document: [...documentarray],
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    },
                ];
                setItems(ans);
                setShow(true);
                setAlertButton(true);
                setDataArrayLength(uniqueArrayfinal.length);
            });
        }
    };
    const [penaltydayuploadListArray, setPenaltydayuploadListArray] = useState([])
    //get all Time Loints List.
    const fetchAllPenaltydayArray = async () => {

        setPageName(!pageName)
        try {
            let res_queue = await axios.post(SERVICE.GET_PENALTYDAYUPLOAD, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPenaltydayuploadListArray(res_queue.data.penaltydayupload?.map((item, index) => ({
                ...item,
                date: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss a"),
            })));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchAllPenaltydayArray();
    }, [isFilterOpen])

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Penalty Day Upload"),
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

    //get all Time Loints List.
    const fetchAllPenaltyday = async () => {

        setIsLoader(true);
        setPageName(!pageName)


        try {
            let res_queue = await axios.post(SERVICE.GET_PENALTYDAYUPLOAD_FILTER_LIST, {
                assignbranch: accessbranch,
                fromdate: filterUser?.fromdate,
                todate: filterUser?.todate,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // console.log(res_queue.data, 'res_queue.data')
            setPenaltydayuploadList(res_queue.data.penaltydayupload?.map((item) => ({
                ...item,
                olddate: item.date,
                username: item?.addedby[0]?.name,
                filename: item.filename ? item.filename : `PENALTY_DAY_UPLOAD_${moment(item.date).format('DD-MM-YYYY')}`,
                // date: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss a"),
                date: moment(item.date).format('DD-MM-YYYY'),
                type: item.type == "nonexcel" ? "Created" : "Uploaded",
            })));
            let answer = res_queue?.data?.penaltydayupload
                .map((data) => data.uploaddata)
                .flat();
            setPenaltydayUploadOverallData(answer?.map((item) => ({ ...item, date: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss a"), })));
            setIsLoader(false);
        } catch (err) { handleApiError(err, setIsLoader(false), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };
    const ResetFunc = () => {
        // fetchAllPenaltyday();
        setItems([]);
        setFileName("");
        setShow(false);
        setFileupload("");
        setAlertButton(false);
        setDataArrayLength("");
    };
    // useEffect(() => {
    //     fetchAllPenaltyday();
    // }, []);
    const clearFileSelection = () => {
        setFileupload([]);
        setFileName("");
        setItems("");
        readExcel(null);
        setShow(false);
        setAlertButton(false);
        setDataupdated("");
        setdocumentFiles([]);
    };
    const ExportsHead = () => {
        new CsvBuilder("PENALTYDAY-FILE UPLOAD")
            .setColumns([
                // "Company",
                "Branch",
                "Unit",
                "Team",
                "Process Code",
                "Name",
                "Emp Code",
                // "Date",
                "Ventor Name",
                "Process",
                "Total Field",
                "Auto Error",
                "Manual Error",
                "Upload Error",
                "Moved",
                "Not Upolad",
                "Penalty",
                "Non Penalty",
                "Bulk Upload",
                "Bulk Keying",
                "Edited1",
                "Edited2",
                "Edited3",
                "Edited4",
                "Reject1",
                "Reject2",
                "Reject3",
                "Reject4",
                "Not Validate",
                "Valid Error",
                "Waiver% Error",
                "Net Error",
                "per%",
                "Percentage",
                "Amount",
            ])
            .exportFile();
    };
    const sendJSON = async () => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
            }
        };
        setPageName(!pageName)

        let res_payrun = await axios.post(SERVICE.CHECK_PAYRUN_ISCREATED_FOR_PENALTYDAYUPLOAD, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            date: penaltydayupload.date,
        });

        if (penaltydayupload.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }
        else if (penaltydayupload.date === "") {
            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }
        else if (dataArrayLength === 0 && penaltydayupload.date === "") {
            setPopupContent("No data to upload");
            setPopupSeverity("success");
            handleClickOpenPopup();
            return;
        }
        else if (res_payrun?.data?.payrunlist?.length > 0) {
            setPopupContentMalert("Payrun Already Generated");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            try {
                // setLoading(true); // Set loading to true when starting the upload
                xmlhttp.open("POST", SERVICE.ADD_PENALTYDAYUPLOAD);
                xmlhttp.setRequestHeader(
                    "Content-Type",
                    "application/json;charset=UTF-8"
                );
                xmlhttp.send(JSON.stringify(items));
                // await fetchAllPenaltyday();
                setdocumentFiles([]);
                setItems([]);
                setFileName("");
                setShow(false);
                setFileupload("");
                setAlertButton(false);
                setDataArrayLength("");
            } catch (err) {
            } finally {
                // setLoading(false); // Set loading back to false when the upload is complete
                setPopupContent("Uploaded Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                // await fetchAllPenaltyday();
                setItems([]);
                setFileName("");
                setShow(false);
                setFileupload("");
                setAlertButton(false);
                setDataArrayLength("");
            }
        }
    };
    const handleCheck = () => {
        toast.warning("Upload files!");
    };
    //set function to get particular row
    const rowData = async (id) => {
        console.log(id);
        setPageName(!pageName)
        try {
            setDeleteClientUserID(id);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup

    const delBrand = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.SINGLE_PENALTYDAYUPLOAD}/${deleteClientUserID}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // await readExcel(null)
            await fetchAllPenaltyday();
            setAlertButton(false);
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 150,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "username",
            headerName: "User Name",
            flex: 0,
            width: 350,
            hide: !columnVisibility.username,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "filename",
            headerName: "File Name",
            flex: 0,
            width: 350,
            hide: !columnVisibility.filename,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 250,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("dpenaltyday") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpenaltyday") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeall(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />{" "}
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = penaltydayuploadlist.map((t, i) => ({
            Sno: i + 1,
            "File Name": t.filename,
            Date: moment(t.createdAt).format("DD-MM-YYYY hh:mm:ss a"),
        }));
        setExcelData(data);
    };
    //image
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Day Upload.png");
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
        documentTitle: "Penalty Day Upload",
        pageStyle: "print",
    });
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
    const addSerialNumber = (datas) => {

        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            id: item._id,
            serialNumber: index + 1,
        }));
        setItemsList(itemsWithSerialNumber);
        setOverallItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber(penaltydayuploadlist);
        getexcelDatas();
    }, [penaltydayuploadlist]);
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = itemsList?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
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
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            // date: moment(item.date).format("DD-MM-YYYY"),,
            date: item.date,
            username: item.username,
            olddate: item.olddate,
            type: item.type,
            filename: item.filename,
        };
    });
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
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
    );
    let exportColumnNames = ["Username", "File Name", "Created Date & Time", "Type"];
    let exportRowValues = ["username", "filename", "date", "type"];
    let exportColumnNamesall = ["company", "branch", "unit", "team", "processcode", "name", "empcode", "date", "vendorname", "process", "totalfield", "autoerror", "manualerror", "uploaderror", "moved", "notupload", "penalty", "nonpenalty", "bulkupload", "bulkkeying", "edited1", "edited2", "edited3", "edited4", "reject1", "reject2", "reject3", "reject4", "notvalidate", "validateerror", "waivererror", "neterror", "per", "percentage", "amount"];
    let exportRowValuesall = ["company", "branch", "unit", "team", "processcode", "name", "empcode", "date", "vendorname", "process", "totalfield", "autoerror", "manualerror", "uploaderror", "moved", "notupload", "penalty", "nonpenalty", "bulkupload", "bulkkeying", "edited1", "edited2", "edited3", "edited4", "reject1", "reject2", "reject3", "reject4", "notvalidate", "validateerror", "waivererror", "neterror", "per", "percentage", "amount"];

    const handleFilterSave = async () => {

        setIsLoaderbtn(true)

        try {
            let res = await axios.post(SERVICE.VALID_OK_ENTRY_ALERT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: penaltydayupload.date,
            });
            // console.log(res.data.finalvalue, "finalvalue")


            let isDateMatch = penaltydayuploadlist.find((d) => d.olddate === penaltydayupload.date);


            if (penaltydayupload.company === "Please Select Company") {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                return;
            }
            else if (penaltydayupload.date === '') {

                setPopupContentMalert("Please Select Date!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (res.data.finalvalue == 0) {

                setPopupContentMalert("There is No Data To Create!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (isDateMatch) {

                setPopupContentMalert("Already This Date Created!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                setIsLoaderbtn(true)
                let res_Day = await axios.post(SERVICE.VALID_OK_ENTRY, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: penaltydayupload.date,
                    username: isUserRoleAccess.username,
                    filename: fileName,
                });

                setPopupContent("Created Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();

                // await fetchAllPenaltyday();

                setIsLoaderbtn(false)
            }
        } catch (err) { handleApiError(err, setIsLoaderbtn(false), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {

        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchAllPenaltyday();
        }
    };
    const handleClear = () => {
        setFilterUser({
            fromdate: fromDateData,
            todate: toDateData,
            day: "Last Week"
        });
        setPenaltydayuploadList([]);
        setPenaltydayUploadOverallData([]);
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    return (
        <Box>
            <Headtitle title={"PENALTY DAY UPLOAD"} />
            <PageHeading
                title="Manage Penalty Day Upload"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Calculation"
                subpagename="Penalty Day"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lpenaltyday") && (
                <Box sx={userStyle.dialogbox}>
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={userStyle.HeaderText}>Upload Penalty Day</Typography>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Company<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={accessbranch?.map(data => ({
                                        label: data.company,
                                        value: data.company,
                                    })).filter((item, index, self) => {
                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                    })}
                                    styles={colourStyles}
                                    value={{ label: penaltydayupload.company, value: penaltydayupload.company }}
                                    onChange={(e) => {
                                        setPenaltydayupload({
                                            ...penaltydayupload, company: e.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Date<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    placeholder="Please Enter Name"
                                    value={penaltydayupload.date}
                                    onChange={(e) => {
                                        setPenaltydayupload({
                                            ...penaltydayupload,
                                            date: e.target.value,
                                        });
                                        setItems([]);
                                        setFileName("");
                                        setShow(false);
                                        setFileupload("");
                                        setAlertButton(false);
                                        setDataArrayLength("");
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12} marginTop={3}>
                            <LoadingButton
                                disabled={dataArrayLength > 0}
                                loading={loaderbtn}
                                onClick={() => handleFilterSave()}
                                color="primary"
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                                loadingPosition="end"
                                variant="contained"
                            >
                                {' '}
                                Create
                            </LoadingButton>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container>
                        <Grid item md={5.7} sm={5.7} lg={5.7} xs={5.7} marginTop={1}>
                            <Divider />
                        </Grid>
                        <Grid item md={0.6} sm={0.6} lg={0.6} xs={0.6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {' '}
                            <Typography>(OR)</Typography>
                        </Grid>
                        <Grid item md={5.7} sm={5.7} lg={5.7} xs={5.7} marginTop={1}>
                            {' '}
                            <Divider />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {dataArrayLength > 0 && AlertButton ? (
                            <Alert severity="success">File Accepted!</Alert>
                        ) : null}
                        {dataArrayLength == 0 &&
                            dataupdated == "uploaded" &&
                            AlertButton ? (
                            <Alert severity="error">No data to upload!</Alert>
                        ) : null}
                    </Box>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={2}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={buttonStyles.buttonsubmit}
                            >
                                Upload
                                <input
                                    id="resume"
                                    name="file"
                                    hidden
                                    type="file"
                                    accept=".xlsx, .xls , .csv"
                                    onChange={(e) => {
                                        // handleResumeUpload(e);
                                        const file = e.target.files[0];
                                        setFileupload(file);
                                        setDataupdated("uploaded");
                                        readExcel(file, file.name, e);
                                        setFileName(file.name);
                                        e.target.value = null;
                                    }}
                                />
                            </Button>
                        </Grid>
                        <Grid item md={7}>
                            {fileName && dataArrayLength > 0 ? (
                                <Box sx={{ display: "flex", justifyContent: "left" }}>
                                    <p>{fileName}</p>
                                    <Button onClick={() => clearFileSelection()}>
                                        <FaTrash style={{ color: "red" }} />
                                    </Button>
                                </Box>
                            ) : null}
                        </Grid>
                        <Grid item md={2}>
                            {show && dataArrayLength > 0 && (
                                <>
                                    <div>
                                        <div readExcel={readExcel} />
                                        <SendToServer sendJSON={sendJSON} />
                                    </div>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "Capitalize" }}
                        onClick={(e) => ExportsHead()}
                    >
                        <FaDownload />
                        &ensp;Download template file
                    </Button>
                </Box>
            )}
            <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpenaltyday") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Penalty Day Upload List
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Days<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={daysoptions}
                                            // styles={colourStyles}
                                            value={{ label: filterUser.day, value: filterUser.day }}
                                            onChange={(e) => {
                                                handleChangeFilterDate(e);
                                                setFilterUser((prev) => ({ ...prev, day: e.value }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            From Date
                                        </Typography>
                                        <OutlinedInput
                                            id="from-date"
                                            type="date"
                                            disabled={filterUser.day !== "Custom Fields"}
                                            value={filterUser.fromdate}
                                            onChange={(e) => {
                                                const newFromDate = e.target.value;
                                                setFilterUser((prevState) => ({
                                                    ...prevState,
                                                    fromdate: newFromDate,
                                                    todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            To Date
                                        </Typography>
                                        <OutlinedInput
                                            id="to-date"
                                            type="date"
                                            value={filterUser.todate}
                                            disabled={filterUser.day !== "Custom Fields"}
                                            onChange={(e) => {
                                                const selectedToDate = new Date(e.target.value);
                                                const selectedFromDate = new Date(filterUser.fromdate);
                                                const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                                if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                    setFilterUser({
                                                        ...filterUser,
                                                        todate: e.target.value
                                                    });
                                                } else {
                                                    setFilterUser({
                                                        ...filterUser,
                                                        todate: "" // Reset to empty string if the condition fails
                                                    });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} mt={3.5}>
                                    <Grid sx={{ display: "flex", gap: "15px" }}>
                                        <Button
                                            variant="contained"
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={(e) => {
                                                handleSubmit(e);
                                            }}
                                        >
                                            {" "}
                                            Filter
                                        </Button>
                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={() => {
                                                handleClear();
                                            }}
                                        >
                                            {" "}
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Grid>
                        <br />
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
                                        <MenuItem value={penaltydayuploadlist?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelpenaltyday") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAllPenaltydayArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpenaltyday") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAllPenaltydayArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpenaltyday") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpenaltyday") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchAllPenaltydayArray()
                                                }}                                             >
                                                <FaFilePdf />&ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepenaltyday") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItemsList} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={penaltydayuploadlist} setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}
                                />
                            </Grid>
                        </Grid>

                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
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
                        <br />
                        <br />
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
                                    items={itemsList}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRef}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>
                        )}
                    </Box>
                </>
            )}
            {/* ****** Instructions Box Ends ****** */}
            {/* viewAll model */}
            <Dialog
                open={openviewAll}
                onClose={handleClickOpenviewAll}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: '50px' }}
            >
                <DialogContent >
                    <>
                        <Typography sx={userStyle.HeaderText} >{fileNameView}</Typography>
                        {/* <br /> */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeviewAll}
                                        size="small"
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeviewAll}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={productionoriginalviewAll?.length}>
                                            All
                                        </MenuItem>
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
                                    {isUserRoleCompare?.includes("excelpenaltyday") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAll(true)
                                                // fetchAllPenaltydayArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpenaltyday") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAll(true)
                                                // fetchAllPenaltydayArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpenaltyday") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleprintviewall}
                                            >
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpenaltyday") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenAll(true)
                                                }}                                               >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepenaltyday") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImageviewall}
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
                                <AggregatedSearchBar columnDataTable={columnDataTableviewAll} setItems={setItemsviewAll} addSerialNumber={addSerialNumberviewAll} setPage={setPageviewAll} maindatas={productionoriginalviewAll} setSearchedString={setSearchedStringNew}
                                    searchQuery={searchQueryviewAll}
                                    setSearchQuery={setSearchQueryviewAll}
                                    paginated={false}
                                    totalDatas={overallItemsViewAll}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleShowAllColumnsviewAll}
                        >
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleOpenManageColumnsviewAll}
                        >
                            Manage Columns
                        </Button>
                        <br />
                        {/* Manage Column */}
                        <Popover
                            id={idviewall}
                            open={isManageColumnsOpenviewAll}
                            anchorEl={anchorElviewAll}
                            onClose={handleCloseManageColumnsviewAll}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            {manageColumnsContentviewAll}
                        </Popover>
                        {/* <br /> */}
                        {!productionfirstViewCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <FacebookCircularProgress />
                                </Box>
                            </>
                        ) : (
                            <>
                                <AggridTable
                                    rowDataTable={rowDataTableviewAll}
                                    columnDataTable={columnDataTableviewAll}
                                    columnVisibility={columnVisibilityviewAll}
                                    page={pageviewAll}
                                    setPage={setPageviewAll}
                                    pageSize={pageSizeviewAll}
                                    totalPages={totalPagesviewAll}
                                    setColumnVisibility={setColumnVisibilityviewAll}
                                    isHandleChange={isHandleChangeNew}
                                    items={itemsviewAll}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefviewall}
                                    paginated={false}
                                    filteredDatas={filteredDataviewAlls}
                                    handleShowAllColumns={handleShowAllColumnsviewAll}
                                    setFilteredRowData={setFilteredRowDataViewAll}
                                    filteredRowData={filteredRowDataViewAll}
                                    setFilteredChanges={setFilteredChangesViewAll}
                                    filteredChanges={filteredChangesViewAll}
                                    gridRefTableImg={gridRefTableImgviewall}
                                    itemsList={overallItemsViewAll}
                                />
                            </>
                        )}
                    </>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseviewAll}
                        sx={buttonStyles.btncancel}
                    >
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={penaltydayuploadlist ?? []}
                filename={"Penalty Day Upload"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpenAll}
                handleCloseFilterMod={handleCloseFilterModAll}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenAll}
                isPdfFilterOpen={isPdfFilterOpenAll}
                setIsPdfFilterOpen={setIsPdfFilterOpenAll}
                handleClosePdfFilterMod={handleClosePdfFilterModAll}
                filteredDataTwo={(filteredChangesViewAll !== null ? filteredRowDataViewAll : rowDataTableviewAll) ?? []}
                itemsTwo={productionoriginalviewAll ?? []}
                filename={"PENALTYDAY-FILE UPLOAD"}
                exportColumnNames={exportColumnNamesall}
                exportRowValues={exportRowValuesall}
                componentRef={componentRefviewall}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delBrand}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />

        </Box>
    );
}
export default PenaltyDayUpload;