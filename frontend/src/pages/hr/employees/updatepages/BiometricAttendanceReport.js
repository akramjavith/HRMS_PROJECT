import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    OutlinedInput,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
// import { colourStyles, userStyle } from "../../../../pageStyle";

function BiometricAttendanceReport() {


    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [totalProjects, setTotalProjects] = useState(0);

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    }


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [isHandleChange, setIsHandleChange] = useState(false);


    const [isAllUsers, setIsAllUsers] = useState([]);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [fileFormat, setFormat] = useState("");
    let exportColumnNamescrt = [
        'Shift Date',
        'In Time',
        'Out Time',
        'Company',
        'Branch ',
        'Unit',
        'Team',
        'Department',
        'Employee Name',
        'Username',
        'Device Common Name',
    ]
    let exportRowValuescrt = [
        'shiftdate',
        'inTime',
        'outTime',
        'company',
        'branch',
        'unit',
        'team',
        'department',
        'companyname',
        'staffNameC',
        'biometriccommonname',
    ]
    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    //useStates
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [meetingArray, setMeetingArray] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        allTeam,
        pageName, setPageName, buttonStyles, allUsersData
    } = useContext(UserRoleAccessContext);

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
            branchaddress: data?.branchaddress,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];
                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
                branchaddress: data?.branchaddress
            }));
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("")
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        inTime: true,
        outTime: true,
        companyname: true,
        actions: true,
        staffNameC: true,
        shiftdate: true,
        department: true,
        statusreport: true,
        biometriccommonname: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const [filterUser, setFilterUser] = useState({ fromdate: today, todate: today, });

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]
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
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
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


    //set function to get particular row
    const fetchAllUsers = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ALLUSERENQLIVE}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setIsAllUsers(res?.data?.users);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        addSerialNumber(meetingArray);
    }, [meetingArray]);


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("BiometricAttendanceReport"),
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
        fetchAllUsers();
        getapi()
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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

    const [filterState, setFilterState] = useState({
        type: "Individual",
    });

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Deactivate", value: "Deactivate" },
    ];
    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };





    //Work Mode multiselect
    const [selectedOptionsWorkMode, setSelectedOptionsWorkMode] = useState([]);
    let [valueWorkMode, setValueWorkMode] = useState([]);

    const handleWorkModeChange = (options) => {
        setValueWorkMode(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsWorkMode(options);
    };

    const customValueRendererWorkMode = (valueWorkMode, _categoryname) => {
        return valueWorkMode?.length
            ? valueWorkMode?.map(({ label }) => label)?.join(", ")
            : "Please Select Work Mode";
    };










    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const TypeCompany = allUsersData
        ?.filter(
            (u) =>
                valueCompanyCat?.includes(u.company)
        )
        .map((u) => ({
            //   ...u,
            label: u.companyname,
            value: u.companyname,
            userid: u._id,
            username: u.username,
        }))

    const TypeBranch = allUsersData
        ?.filter(
            (u) =>
                valueCompanyCat?.includes(u.company) &&
                valueBranchCat?.includes(u.branch)
        )
        .map((u) => ({
            //   ...u,
            label: u.companyname,
            value: u.companyname,
            userid: u._id,
            username: u.username,
        }))

    const TypeUnit = allUsersData
        ?.filter(
            (u) =>
                valueCompanyCat?.includes(u.company) &&
                valueBranchCat?.includes(u.branch) &&
                valueUnitCat?.includes(u.unit)
        )
        .map((u) => ({
            //   ...u,
            label: u.companyname,
            value: u.companyname,
            userid: u._id,
            username: u.username,
        }))

    const TypeTeam = allUsersData
        ?.filter(
            (u) =>
                valueCompanyCat?.includes(u.company) &&
                valueBranchCat?.includes(u.branch) &&
                valueUnitCat?.includes(u.unit) &&
                valueTeamCat?.includes(u.team)
        )
        .map((u) => ({
            //   ...u,
            label: u.companyname,
            value: u.companyname,
            userid: u._id,
            username: u.username,
        }))

    const TypeDepart = allUsersData
        ?.filter(
            (u) =>
                valueCompanyCat?.includes(u.company) &&
                valueDepartmentCat?.includes(u.department)
        )
        .map((u) => ({
            //   ...u,
            label: u.companyname,
            value: u.companyname,
            userid: u._id,
            username: u.username,
        }))

    const TypeEmployee = allUsersData
        ?.filter(
            (u) =>
                valueCompanyCat?.includes(u.company) &&
                valueBranchCat?.includes(u.branch) &&
                valueUnitCat?.includes(u.unit) &&
                valueTeamCat?.includes(u.team) &&
                valueEmployeeCat?.includes(u.companyname)
        )
        .map((u) => ({
            //   ...u,
            label: u.companyname,
            value: u.companyname,
            userid: u._id,
            username: u.username,
        }))

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
    //add function
    const sendRequest = async () => {
        setLoader(true);
        setPageName(!pageName)
        const filterEmployee = filterState?.type === "Individual" ?
            TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
                TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
                    TypeUnit : filterState?.type === "Team" ? TypeTeam : [];

        let startMonthDate = new Date(filterUser.fromdate);
        let endMonthDate = new Date(filterUser.todate);

        const daysArray = [];
        while (startMonthDate <= endMonthDate) {
            const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
            const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
            const dayCount = startMonthDate.getDate();
            const shiftMode = 'Main Shift';
            const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
                getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
                    getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
                        getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

            daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

            // Move to the next day
            startMonthDate.setDate(startMonthDate.getDate() + 1);
        }


        try {
            const response = await axios.post(SERVICE.BIOMETRIC_USERS_ATTENDANCE_REPORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company : valueCompanyCat,
                branch:valueBranchCat,
                usernames: filterState?.type === "Deactivate" ? [] : filterEmployee?.map(data => data?.username),
                userDates: daysArray,
                type: filterState?.type,
                workmode: valueWorkMode,
            });
            console.log(response?.data, "attendance")

            // setMeetingArray(response?.data?.filteredData)
            setMeetingArray(response?.data?.filteredData?.map((data, index) => ({ ...data, serialNumber: index + 1 })));
            setLoader(false);

        } catch (err) {
            console.log(err, 'err')
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();

        const filterEmployee = filterState?.type === "Individual" ?
            TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
                TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
                    TypeUnit : filterState?.type === "Team" ? TypeTeam : []
        if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Branch", "Unit", "Team", "Deactivate"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setFilterState({
            type: "Individual",
        });
        setSelectedMode("Today")
        setFilterUser({ fromdate: today, todate: today, })
        setFilteredRowData([])
        setFilteredChanges(null)
        setSelectedOptionsEmployee([]);
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setMeetingArray([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setLoader(false);
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "BiometricAttendanceReport.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // Excel
    const fileName = "BiometricAttendanceReport";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Biometric Attendance Report",
        pageStyle: "print",
    });
    const addSerialNumber = (datas) => {
        setItems(datas);
    };


    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };
    //datatable....

    // Split the search query into individual terms
    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
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

    const columnDataTable = [
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
            field: "shiftdate",
            headerName: "Shift Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.shiftdate,
            headerClassName: "bold-header",
        },
        {
            field: "inTime",
            headerName: "In Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.inTime,
            headerClassName: "bold-header",

        },
        {
            field: "outTime",
            headerName: "Out Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.outTime,
            headerClassName: "bold-header",

        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",

        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
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
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 100,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 100,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },

        {
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
        },
        {
            field: "staffNameC",
            headerName: "Username",
            flex: 0,
            width: 100,
            hide: !columnVisibility.staffNameC,
            headerClassName: "bold-header",
        },
        {
            field: "biometriccommonname",
            headerName: "Device Common Name",
            flex: 0,
            width: 250,
            hide: !columnVisibility.biometriccommonname,
            headerClassName: "bold-header",
        },
        // {
        //     field: "privilegeC",
        //     headerName: "Biometric Role",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.privilegeC,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "fingerCountN",
        //     headerName: "FingerPrint Count",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.fingerCountN,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "isFaceEnrolledC",
        //     headerName: "Face Enrolled",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.isFaceEnrolledC,
        //     headerClassName: "bold-header",
        // },
    ];
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            shiftdate: item.shiftdate,
            companyname: item.companyname,
            biometriccommonname: item.biometriccommonname,
            staffNameC: item.staffNameC,
            inTime: item.inTime,
            outTime: item.outTime,

        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
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
                            {" "}
                            Hide All{" "}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const handleAutoSelect = async () => {
        setPageName(!pageName)
        try {

            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );

            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);




            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);


            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);


            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);



        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    return (
        <Box>
            <Headtitle title={"BIOMETRIC ATTENDANCE REPORT"} />
            <PageHeading
                title="Biometric Attendance Report"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Biometric Device"
                subsubpagename="Biometric Attendance Report"
            />
            {isUserRoleCompare?.includes("lbiometricattendancereport") && (
                <Box sx={userStyle.selectcontainer}>

                    <>
                        <Typography sx={userStyle.importheadtext}>Biometric Attendance Report Filter</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Type<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={TypeOptions}
                                        // styles={colourStyles}
                                        value={{
                                            label: filterState.type ?? "Please Select Type",
                                            value: filterState.type ?? "Please Select Type",
                                        }}
                                        onChange={(e) => {
                                            setFilterState((prev) => ({
                                                ...prev,
                                                type: e.value,
                                            }));
                                            setValueCompanyCat([]);
                                            setSelectedOptionsCompany([]);
                                            setValueBranchCat([]);
                                            setSelectedOptionsBranch([]);
                                            setValueUnitCat([]);
                                            setSelectedOptionsUnit([]);
                                            setValueTeamCat([]);
                                            setSelectedOptionsTeam([]);
                                            setValueDepartmentCat([]);
                                            setSelectedOptionsDepartment([]);
                                            setValueEmployeeCat([]);
                                            setSelectedOptionsEmployee([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>



                            {filterState.type === "Unmatched" ? "" :
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl size="small" fullWidth>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.map((data) => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsCompany}
                                                onChange={(e) => {
                                                    handleCompanyChange(e);
                                                }}
                                                valueRenderer={customValueRendererCompany}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    {["Individual", "Team"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Branch Unit Team */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    valueCompanyCat?.includes(comp.company) &&
                                                                    valueBranchCat?.includes(comp.branch)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsUnit}
                                                        onChange={(e) => {
                                                            handleUnitChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={allTeam
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCat?.includes(u.company) &&
                                                                    valueBranchCat?.includes(u.branch) &&
                                                                    valueUnitCat?.includes(u.unit)
                                                            )
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.teamname,
                                                                value: u.teamname,
                                                            }))}
                                                        value={selectedOptionsTeam}
                                                        onChange={(e) => {
                                                            handleTeamChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererTeam}
                                                        labelledBy="Please Select Team"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Department"]?.includes(filterState.type) ? (
                                        <>
                                            {/* Department */}
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOptions}
                                                        value={selectedOptionsDepartment}
                                                        onChange={(e) => {
                                                            handleDepartmentChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Branch", "Deactivate"]?.includes(filterState.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : ["Unit"]?.includes(filterState.type) ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter((comp) =>
                                                                valueCompanyCat?.includes(comp.company)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsBranch}
                                                        onChange={(e) => {
                                                            handleBranchChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Unit <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    valueCompanyCat?.includes(comp.company) &&
                                                                    valueBranchCat?.includes(comp.branch)
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) => {
                                                                return (
                                                                    self.findIndex(
                                                                        (i) =>
                                                                            i.label === item.label &&
                                                                            i.value === item.value
                                                                    ) === index
                                                                );
                                                            })}
                                                        value={selectedOptionsUnit}
                                                        onChange={(e) => {
                                                            handleUnitChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {["Individual"]?.includes(filterState.type) && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={isAllUsers
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team)
                                                        )
                                                        .map((u) => ({
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsEmployee}
                                                    onChange={(e) => {
                                                        handleEmployeeChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererEmployee}
                                                    labelledBy="Please Select Employee"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                </>
                            }
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        Work Mode
                                    </Typography>
                                    <MultiSelect
                                        options={[{ label: "Remote", value: "Remote" },
                                        { label: "Facility", value: "Office" },
                                        { label: "Intern", value: "Internship" },
                                        ]}
                                        value={selectedOptionsWorkMode}
                                        onChange={(e) => {
                                            handleWorkModeChange(e);
                                        }}
                                        valueRenderer={customValueRendererWorkMode}
                                        labelledBy="Please Select Work Mode"
                                    />
                                </FormControl>
                            </Grid>
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
                            <Grid item md={3} xs={12} sm={6}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignContent: "end",
                                    alignItems: "end"
                                }}>
                                <Grid>
                                    <LoadingButton
                                        // loading={btnLoading}
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={handleSubmit}
                                    >
                                        Filter
                                    </LoadingButton>
                                    &nbsp;
                                    &nbsp;
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        {" "}
                                        Clear{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <br />

                        </Grid>
                    </>
                </Box>
            )}
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lbiometricattendancereport") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                List Biometric Attendance Report
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        MenuProps={{
                                            PaperProps: { style: { maxHeight: 180, width: 80 } },
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
                                        <MenuItem value={meetingArray?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelbiometricattendancereport") && (
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
                                    {isUserRoleCompare?.includes("csvbiometricattendancereport") && (
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
                                    {isUserRoleCompare?.includes("printbiometricattendancereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp; <FaPrint /> &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfbiometricattendancereport") && (
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
                                    {isUserRoleCompare?.includes("imagebiometricattendancereport") && (
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

                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={meetingArray}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={meetingArray}

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
                        <br />
                        <br />
                        <Box style={{ width: "100%", overflowY: "hidden" }}>
                            {loader ? (
                                <Box sx={userStyle.container}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            minHeight: "350px",
                                        }}
                                    >
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
                                </Box>
                            ) : (
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
                                    totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={meetingArray}
                                />

                            )}
                        </Box>

                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                {" "}
                {manageColumnsContent}
            </Popover>


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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={meetingArray ?? []}
                filename={"Biometric Attendance Report"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />

        </Box>
    );
}
export default BiometricAttendanceReport;