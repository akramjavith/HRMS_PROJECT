import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    Select,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Paper,
    Table,
    TableHead,
    TableContainer,
    Button,
    List,
    ListItem,
    ListItemText,
    Popover,
    Checkbox,
    TextField,
    IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle.js";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { Space, TimePicker } from "antd";
import { Flex, Progress } from "antd";
import dayjs from "dayjs";
import AlertDialog from "../../../components/Alert.js";
import { DeleteConfirmation, PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";

function ProductionReport() {
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

    let exportColumnNames = ["Production Mode", "Company", "Branch", "Unit", "Team", "Vendor", "Category", "SubCategory", "Unit Identifier", "Points", "Employee Name", "Employee Code", "LoginId", "Section", "Flag Count", "WorkTook", "User Name"];
    let exportRowValues = ["mode", "company", "branch", "unit", "team", "vendor", "filename", "category", "unitid", "totalpoints", "empname", "empcode", "user", "section", "flagcount", "worktook", "username"];

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
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const ShiftOpt = [
        { label: "Shift Based", value: "Shift Based" },
        { label: "Date Based", value: "Date Based" },
    ];

    const [loginAllotFilter, setLoginAllotFilter] = useState([]);
    let [selectedDupe, setSelectedDupe] = useState("With Duplicate");
    const [overallState, setOverallState] = useState({
        mode: "Please Select Production Mode",
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        fromdate: today,
        alllogin: "Please Select Login",
        shift: "Shift Based",
        todate: today,
        fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
        totime: dayjs("11:59:59 PM", "h:mm:ss A"),
        fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
        totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
    });

    const [selectedOptionsLoginid, setSelectedOptionsLoginid] = useState([]);
    let [valueLoginCat, setValueLoginCat] = useState([]);

    //employee multiselect dropdown changes
    const handleLoginChangeFrom = (options) => {
        setSelectedOptionsLoginid(options);
    };
    const customValueRendererLoginFrom = (valueLoginCat, _employeename) => {
        return valueLoginCat.length ? valueLoginCat.map(({ label }) => label).join(", ") : "Please Select Login";
    };

    const [productionFilter, setProductionFilter] = useState([]);

    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState([]);

    let [valueVendor, setValueVendor] = useState([]);

    const handleTimeChange = (time, timeString) => {
        // Check if timeString is a valid time format
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();
        if (isValidTime) {
            setOverallState({
                ...overallState,
                fromtime: dayjs(timeString, "h:mm:ss A"),
                fromtime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
        }
    };

    const handleToTimeChange = (time, timeString) => {
        // Check if timeString is a valid time format
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();
        if (isValidTime) {
            setOverallState({
                ...overallState,
                totime: dayjs(timeString, "h:mm:ss A"),
                totime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
        }
    };

    // get week for month's start to end
    function getWeekNumberInMonth(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        // If the first day of the month is not Monday (1), calculate the adjustment
        const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // Calculate the day of the month adjusted for the starting day of the week
        const dayOfMonthAdjusted = date.getDate() + adjustment;

        // Calculate the week number based on the adjusted day of the month
        const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

        return weekNumber;
    }

    const fetchProductionFilter = async () => {
        try {
            let result = [];

            selectedProject
                .map((d) => d.value)
                .forEach((proj) => {
                    selectedVendor
                        .map((d) => d.value)
                        .forEach((vend) => {
                            if (vendorOpt.some((v) => v.projectname === proj && v.name === vend)) {
                                result.push(`${proj}-${vend}`);
                            }
                        });
                });
            let projvendor = [...new Set(result)];

            // let startMonthDate = new Date(overallState.fromdate);
            let startMonthDateMinus = new Date(overallState.fromdate);
            let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
            let startMonthDate = new Date(startdate);
            // let endMonthDate = new Date(overallState.todate);
            let firstDate = new Date(overallState.todate);
            let enddate = firstDate.setDate(firstDate.getDate() + 1);
            let endMonthDate = new Date(enddate);

            const daysArray = [];

            while (startMonthDate <= endMonthDate) {
                const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
                const dayName = startMonthDate.toLocaleDateString("en-US", { weekday: "long" });
                const dayCount = startMonthDate.getDate();
                const shiftMode = "Main Shift";
                const weekNumberInMonth =
                    getWeekNumberInMonth(startMonthDate) === 1
                        ? `${getWeekNumberInMonth(startMonthDate)}st Week`
                        : getWeekNumberInMonth(startMonthDate) === 2
                            ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
                            : getWeekNumberInMonth(startMonthDate) === 3
                                ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
                                : getWeekNumberInMonth(startMonthDate) > 3
                                    ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                                    : "";

                daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

                // Move to the next day
                startMonthDate.setDate(startMonthDate.getDate() + 1);
            }
            setSourcecheck(true);
            let res_vendor = await axios.post(SERVICE.PRODUCTION_REPORT_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                user: selectedOptionsLoginid.map((item) => item.value).length === 0 ? loginAllotFilter.map((d) => d.value) : selectedOptionsLoginid.map((item) => item.value),
                filename: selectedOptionsCategory.map((item) => item.value),
                category: selectedOptionsSubCategory.map((item) => item.value),
                vendor: selectedVendor,
                project: selectedProject,
                fromdate: overallState.fromdate,
                fromtime: overallState.fromtime24Hrs,
                totime: overallState.totime24Hrs,
                projectvendor: projvendor,
                // todate: overallState.todate,
                shift: overallState.shift,
                mode: selectedOptionsMode,
                userDates: daysArray,
                username: isUserRoleAccess.username,
                companyname: isUserRoleAccess.companyname,

                // allloginids: overallState.alllogin === "Please Select Login" ? employeeOption.map(item => item.userid) : [overallState.alllogin]
                allloginids: selectedOptionsLoginid.map((item) => item.value).length === 0 ? loginAllotFilter.map((d) => d.value) : selectedOptionsLoginid.map((item) => item.value),
            });

            let final = res_vendor.data.mergedData;

            setProductionFilter(final);

            setSourcecheck(false);
        } catch (err) {
            setSourcecheck(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const [projectOpt, setProjmasterOpt] = useState([]);
    const [vendorOpt, setVendormasterOpt] = useState([]);

    const [categoryOpt, setCategoryOPt] = useState([]);
    const [subcategory, setSubCategoryOpt] = useState([]);

    const [selectedOptionsMode, setSelectedOptionsMode] = useState([]);
    let [valueMode, setValueMode] = useState([]);

    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
    let [valueCompanyCategory, setValueCategory] = useState([]);

    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
    let [valueSubCat, setValueSubCat] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [sourceCheck, setSourcecheck] = useState(false);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Individual Production Report.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //get all Sub vendormasters.
    const fetchAllLogins = async (value) => {
        setOverallState({ ...overallState, fromdate: value });

        try {
            let res_vendor = await axios.post(SERVICE.CLIENTUSERID_LIMITED_USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                companyname: isUserRoleAccess.companyname,
                date: value
            });

            let findids = res_vendor?.data?.clientuserid
            // .filter((d) => d.empname === isUserRoleAccess.companyname);

            let alluseridNamesadmin = findids.map((d) => ({
                ...d,
                label: d.userid,
                value: d.userid,
            }));
            // setEmployeeOption(alluseridNamesadmin);
            setLoginAllotFilter(alluseridNamesadmin);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
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

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
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

    const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
        "& .custom-dupe-row": {
            backgroundColor: "#ff00004a !important",
        },
        "& .custom-lateentry": {
            color: "#db2e2e !important",
        },
        "&:hover": {
            "& .custom-dupe-row:hover": {
                backgroundColor: "#ff00004a !important",
            },
            // "& .custom-lateentry:hover": {
            //   color: "#db2e2e !important",
            // },
        },
    }));

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        if (params.row.dupe.includes("Yes")) {
            return "custom-dupe-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        if (params.row.lateentry === true) {
            return "custom-lateentry"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        dupe: true,
        mode: true,
        company: true,
        branch: true,
        dateval: true,
        unit: true,
        team: true,
        project: true,
        vendor: true,
        category: true,
        filename: true,
        unitid: true,
        empcode: true,
        empname: true,
        username: true,
        user: true,
        fromdate: true,
        todate: true,
        section: true,
        flagcount: true,
        points: true,
        worktook: true,
        createdAt: true,
        unitrate: true,
        totalpoints: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const fetchAllCategory = async (e) => {
        const branchArr = e.map((t) => t.name);
        try {
            let res_module = await axios.get(SERVICE.CATEGORYPROD_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryOpt = Array.from(new Set(res_module?.data?.categoryprod.filter((item) => branchArr.includes(item.project)).map((t) => t.name))).map((name) => ({
                label: name,
                value: name,
            }));
            setCategoryOPt(categoryOpt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //get all category.
    const fetchAllSubCategory = async (e) => {
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projFilt = res_module?.data?.subcategoryprod;

            setSubCategoryOpt(projFilt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //get all project.
    const fetchProjMaster = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const projectopt = [
                ...res_project?.data?.projmaster.map((item) => ({
                    ...item,
                    label: item.name,
                    value: item.name,
                })),
            ];

            setProjmasterOpt(projectopt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //get all Sub vendormasters.
    const fetchVendor = async (e) => {
        const branchArr = e.map((t) => t.name);
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const projFilt = res_vendor?.data?.vendormaster?.filter((item) => branchArr.includes(item.projectname));

            setVendormasterOpt(
                projFilt?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                }))
            );
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleProjectChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedProject(options);
        fetchVendor(options);
        fetchAllCategory(options);
        setSelectedVendor([]);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
    };

    const handleVendorChange = (options) => {
        setValueVendor(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedVendor(options);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
    };

    const handleCategoryChange = (options) => {
        setValueCategory(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCategory(options);
        setSelectedOptionsSubCategory([]);
    };

    const handleSubCategoryChange = (options) => {
        setValueSubCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCategory(options);
    };

    const handleModeChange = (options) => {
        setValueMode(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsMode(options);
    };

    const customValueRendererMode = (valueMode, _categoryname) => {
        return valueMode?.length ? valueMode.map(({ label }) => label)?.join(", ") : "Please Select Production";
    };

    const customValueRendererProject = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project";
    };

    const customValueRendererVendor = (valueVendor, _categoryname) => {
        return valueVendor?.length ? valueVendor.map(({ label }) => label)?.join(", ") : "Please Select Vendor";
    };

    const customValueRendererCategory = (valueCompanyCategory, _categoryname) => {
        return valueCompanyCategory?.length ? valueCompanyCategory.map(({ label }) => label)?.join(", ") : "Please Select Category";
    };

    const customValueRendererSubCategory = (valueSubCat, _categoryname) => {
        return valueSubCat?.length ? valueSubCat.map(({ label }) => label)?.join(", ") : "Please Select SubCategory";
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOptionsMode.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (overallState.fromdate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        } else {
            fetchProductionFilter();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setOverallState({
            mode: "Please Select Production Mode",
            project: "Please Select Project",
            vendor: "Please Select Vendor",
            fromdate: today,
            todate: today,
            fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
            totime: dayjs("11:59:59 PM", "h:mm:ss A"),
            fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
            totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
            alllogin: "Please Select Login",
            shift: "Shift Based",
        });

        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
        setSelectedOptionsLoginid([]);
        setVendormasterOpt([]);
        setSelectedOptionsMode([]);
        setProductionFilter([]);
        setSelectedProject([]);
        setSelectedVendor([]);
        setCategoryOPt([]);
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
    };

    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Production Mode", field: "mode" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Vendor", field: "vendor" },
        { title: "Category", field: "filename" },
        { title: "SubCategory", field: "category" },
        { title: "Unit Identifier", field: "unitid" },
        { title: "Points", field: "unitrate" },
        { title: "Employee Name", field: "empname" },
        { title: "Employee Code", field: "empcode" },
        { title: "LoginId", field: "user" },
        { title: "TotalPoints", field: "totalpoints" },
        { title: "Section", field: "section" },
        { title: "Flag Count", field: "flagcount" },
        { title: "WorkTook", field: "worktook" },
        { title: "User Name", field: "username" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: rowDataTable,
        });
        doc.save("Individual Production Report.pdf");
    };

    // Excel
    const fileName = "Individual Production Report";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Individual Production Report",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchAllSubCategory();
        fetchProjMaster();
        fetchAllLogins(today)
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = productionFilter?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [productionFilter]);

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
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
            width: 80,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "mode", headerName: "Production Mode", flex: 0, width: 100, hide: !columnVisibility.mode, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 80, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 70, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Project", flex: 0, width: 180, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 300, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "Sub Category", flex: 0, width: 320, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Unit Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
        { field: "unitrate", headerName: "Points", flex: 0, width: 90, hide: !columnVisibility.unitrate, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "empname", headerName: "Emp Name", flex: 0, width: 280, hide: !columnVisibility.empname, headerClassName: "bold-header" },
        { field: "user", headerName: "LogIn Id", flex: 0, width: 100, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "dateval", headerName: "Date", flex: 0, width: 190, hide: !columnVisibility.dateval, headerClassName: "bold-header" },
        { field: "worktook", headerName: "Worktook", flex: 0, width: 100, hide: !columnVisibility.worktook, headerClassName: "bold-header" },
        { field: "section", headerName: "Section", flex: 0, width: 90, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "Flag Count", flex: 0, width: 100, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "totalpoints", headerName: "Total Points", flex: 0, width: 100, hide: !columnVisibility.totalpoints, headerClassName: "bold-header" },
        { field: "username", headerName: "User Name", flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: "bold-header" },

        // {
        //     field: "dupe", headerName: "Dupe", flex: 0, width: 90, hide: !columnVisibility.dupe, headerClassName: "bold-header",
        //     renderCell: (params) => <Typography sx={{ backgroundColor: params.row.dupe === "Yes" ? "red" : "inherit", fontSize: "13px", padding: "5px", color: params.row.dupe === "Yes" ? "white" : "black" }}>{params.row.dupe}</Typography>,
        // },
    ];

    const rowDataTable = filteredData.map((item, index) => {

        return {
            ...item,
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            mode: item.mode,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            project: item.project,
            vendor: item.vendor,
            filename: item.filename,
            category: item.category,
            dateval: item.dateval,
            subcategory: item.subcategory,
            empcode: item.empcode,
            empname: item.empname,
            username: item.username,
            user: item.user,
            fromdate: item.fromdate,
            todate: item.todate,
            section: item.section,

            totalpoints: item.totalpoints,
            flagcount: item.flagcount,
            unitrate: item.points,
            unitid: item.unitid,
            worktook: item.worktook,
            dupe: item.dupe ? item.dupe : "No",
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

    const PmodeOpt = [
        { label: "Production", value: "Production" },
        { label: "Manual Production", value: "Manual Production" },
        { label: "Non Production", value: "Non Production" },
    ];

    return (
        <Box>
            <Headtitle title={"Individual Production Report"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Individual Production Report</Typography>
            <Box sx={userStyle.dialogbox}>
                <>
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <Typography>
                                    Production Mode<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    maxMenuHeight={250}
                                    options={PmodeOpt}
                                    value={selectedOptionsMode}
                                    onChange={(e) => {
                                        handleModeChange(e);
                                    }}
                                    valueRenderer={customValueRendererMode}
                                    labelledBy="Please Select Production"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <Typography>Project</Typography>

                                <MultiSelect
                                    options={projectOpt}
                                    value={selectedProject}
                                    onChange={(e) => {
                                        handleProjectChange(e);
                                    }}
                                    valueRenderer={customValueRendererProject}
                                    labelledBy="Please Select Project"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <Typography>Vendor</Typography>
                                <MultiSelect
                                    options={vendorOpt}
                                    value={selectedVendor}
                                    onChange={(e) => {
                                        handleVendorChange(e);
                                    }}
                                    valueRenderer={customValueRendererVendor}
                                    labelledBy="Please Select Vendor"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Shift</Typography>
                                <Selects
                                    options={ShiftOpt}
                                    value={{ label: overallState.shift, value: overallState.shift }}
                                    onChange={(e) => {
                                        setOverallState({
                                            ...overallState,
                                            shift: e.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Date <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={overallState.fromdate}
                                    onChange={(e) => {
                                        fetchAllLogins(e.target.value)
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <Typography>Category</Typography>
                                <MultiSelect
                                    options={categoryOpt}
                                    value={selectedOptionsCategory}
                                    onChange={(e) => {
                                        handleCategoryChange(e);
                                        setOverallState({
                                            ...overallState,
                                            raisedby: "Please Select Category",
                                        });
                                    }}
                                    valueRenderer={customValueRendererCategory}
                                    labelledBy="Please Select Category"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <Typography>Sub Category</Typography>
                                <MultiSelect
                                    options={Array.from(new Set(subcategory?.filter((comp) => selectedOptionsCategory.map((item) => item.value).includes(comp.categoryname))?.map((com) => com.name))).map((name) => ({
                                        label: name,
                                        value: name,
                                    }))}
                                    value={selectedOptionsSubCategory}
                                    onChange={(e) => {
                                        handleSubCategoryChange(e);
                                        setOverallState({
                                            ...overallState,
                                            raisedby: "Please Select SubCategory",
                                        });
                                    }}
                                    valueRenderer={customValueRendererSubCategory}
                                    labelledBy="Please Select SubCategory"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>All Login Id</Typography>
                                <MultiSelect
                                    // value={{ label: overallState.alllogin, value: overallState.alllogin }}
                                    // onChange={(e) => {
                                    //     setOverallState({
                                    //         ...overallState,
                                    //         alllogin: e.value,
                                    //     })
                                    // }}
                                    options={loginAllotFilter}
                                    value={selectedOptionsLoginid}
                                    onChange={handleLoginChangeFrom}
                                    valueRenderer={customValueRendererLoginFrom}
                                    labelledBy="Please Select Login ID"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={1.5} xs={6} sm={2}>
                            <Typography>From Time</Typography>
                            <Space wrap>
                                <TimePicker use12Hours format="h:mm:ss A" size="large" value={overallState.fromtime} disabled={overallState.shift === "Shift Based"} defaultValue={dayjs("00:00:00", "HH:mm:ss a")} onChange={handleTimeChange} allowClear={false} />
                            </Space>
                        </Grid>
                        <Grid item md={1.5} xs={6} sm={2}>
                            <Typography>To Time</Typography>
                            <Space wrap>
                                <TimePicker use12Hours format="h:mm:ss A" size="large" disabled={overallState.shift === "Shift Based"} value={overallState.totime} defaultValue={dayjs("00:00:00", "HH:mm:ss a")} onChange={handleToTimeChange} allowClear={false} />
                            </Space>
                        </Grid>
                        {/* <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    With/Without Duplicate
                                </Typography>
                                <Selects
                                    options={
                                        [{ label: "With Duplicate", value: "With Duplicate" },
                                        { label: "Without Duplicate", value: "Without Duplicate" },
                                        ]
                                    }
                                    value={{ label: selectedDupe, value: selectedDupe }}
                                    onChange={(e) => setSelectedDupe(e.value)}

                                />
                            </FormControl>
                        </Grid> */}
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                        <br />
                        <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                            <Button
                                variant="contained"
                                onClick={(e) => {
                                    handleSubmit(e);
                                }}
                            >
                                {" "}
                                Filter
                            </Button>
                            <Button sx={userStyle.btncancel} onClick={handleClear}>
                                {" "}
                                CLEAR
                            </Button>
                        </Grid>
                    </Grid>
                </>
            </Box>
            <br />
            {/* ****** Table Start ****** */}

            <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>Individual Production Report</Typography>
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
                                <MenuItem value={productionFilter?.length}>All</MenuItem>
                            </Select>
                        </Box>
                    </Grid>
                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box>
                            {isUserRoleCompare?.includes("excelindividualproductionreport") && (
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
                            {isUserRoleCompare?.includes("csvindividualproductionreport") && (
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
                            {isUserRoleCompare?.includes("printindividualproductionreport") && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                        &ensp;
                                        <FaPrint />
                                        &ensp;Print&ensp;
                                    </Button>
                                </>
                            )}
                            {isUserRoleCompare?.includes("pdfindividualproductionreport") && (
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
                            {isUserRoleCompare?.includes("imageindividualproductionreport") && (
                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                    {" "}
                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                </Button>
                            )}
                        </Box>
                    </Grid>
                    <Grid item md={2} xs={6} sm={6}>
                        <Box>
                            <FormControl fullWidth size="small">
                                <Typography>Search</Typography>
                                <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                            </FormControl>
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
                <br />
                {sourceCheck ? (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </>
                ) : (
                    <>
                        <Box
                            style={{
                                width: "100%",
                                overflowY: "hidden", // Hide the y-axis scrollbar
                            }}
                        >
                            <CustomStyledDataGrid
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
                                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                            </Box>
                            <Box>
                                <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                    <FirstPageIcon />
                                </Button>
                                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                    <NavigateBeforeIcon />
                                </Button>
                                {pageNumbers?.map((pageNumber) => (
                                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                        {pageNumber}
                                    </Button>
                                ))}
                                {lastVisiblePage < totalPages && <span>...</span>}
                                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                    <NavigateNextIcon />
                                </Button>
                                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
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

            {/* Delete Modal */}
            <Box>
                {/* print layout */}

                {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Vendor</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>SubCategory</TableCell>
                                <TableCell>Unit Identifier</TableCell>
                                <TableCell>Points</TableCell>
                                <TableCell>EmpCode</TableCell>
                                <TableCell>Emp Name</TableCell>
                                <TableCell>LoginId</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Section</TableCell>
                                <TableCell>FlagCount</TableCell>
                                <TableCell>Total Points</TableCell>
                                <TableCell>WorkTook</TableCell>
                                <TableCell>UserName</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.mode}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.vendor}</TableCell>
                                        <TableCell>{row.filename}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.unitid}</TableCell>
                                        <TableCell>{row.unitrate}</TableCell>
                                        <TableCell>{row.empcode}</TableCell>
                                        <TableCell>{row.empname}</TableCell>
                                        <TableCell>{row.user}</TableCell>
                                        <TableCell>{row.dateval}</TableCell>
                                        <TableCell>{row.section}</TableCell>
                                        <TableCell>{row.flagcount}</TableCell>
                                        <TableCell>{row.totalpoints}</TableCell>
                                        <TableCell>{row.worktook}</TableCell>
                                        <TableCell>{row.username}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}
            </Box>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                itemsTwo={items ?? []}
                filename={"Individual Production Report"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default ProductionReport;