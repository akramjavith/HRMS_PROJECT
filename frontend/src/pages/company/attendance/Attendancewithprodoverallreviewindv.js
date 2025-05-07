import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, Select, MenuItem, FormControl, Grid, Button, Popover } from '@mui/material';
import { userStyle } from '../../../pageStyle';
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import StyledDataGrid from '../../../components/TableStyle';
import Avatar from '@mui/material/Avatar';
import moment from 'moment-timezone';
import { useReactToPrint } from 'react-to-print';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { handleApiError } from '../../../components/Errorhandling';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { styled } from '@mui/system';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { saveAs } from 'file-saver';
import Selects from 'react-select';
import ManageColumnsContent from "../../../components/ManageColumn";
import { MultiSelect } from 'react-multi-select-component';
import ExportData from '../../../components/ExportData';
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";

function AttendanceWithProdOverallReviewListIndividual() {

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const gridRef = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allCompany, allBranch, allUnit, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    // Multiselectdropdowns
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);
    const [attStatusOption, setAttStatusOption] = useState([]);
    const [clientUserIDArray, setClientUserIDArray] = useState([]);
    const [items, setItems] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedData, setCopiedData] = useState('');

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

    const [pointsFilter, setPointsFilter] = useState({ fromdate: today, todate: today, greater: '', less: '', betweenfrom: '', betweento: '', compare: 'All' });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    // Manage columns
    const [searchQueryManage, setSearchQueryManage] = useState('');
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage('');
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        empcode: true,
        name: true,
        companyname: true,
        branch: true,
        unit: true,
        team: true,
        date: true,
        shiftmode: true,
        shift: true,
        leavestatus: true,
        permissionstatus: true,
        clockin: true,
        clockinstatus: true,
        clockout: true,
        clockoutstatus: true,
        daypoint: true,
        experience: true,
        target: true,
        point: true,
        temppoint: true,
        avgpoint: true,
        tempavgpoint: true,
        mindiff: true,
        tempmindiff: true,
        tardiff: true,
        temptardiff: true,
        minreached: true,
        tempminreached: true,
        status: true,
        tempstatus: true,
        daystatus: true,
        clienterrorcount: true,
        clientamount: true,
        waiveramount: true,
        accuracy: true,
        totalfield: true,
        autoerrorcalculation: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
        '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '14px',
            fontWeight: 'bold !important',
            lineHeight: '15px',
            whiteSpace: 'normal', // Wrap text within the available space
            overflow: 'visible', // Allow overflowed text to be visible
            minWidth: '20px',
        },
        '& .MuiDataGrid-columnHeaders': {
            minHeight: '50px !important',
            maxHeight: '50px',
        },
        '& .MuiDataGrid-row': {
            fontSize: '12px', // Change the font size for row data
            minWidth: '20px',
            color: '#000000de',
            // minHeight: "50px !important",
            // Add any other styles you want to apply to the row data
        },
        '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2 !important', // Optional: Adjusts line height for better readability
        },
        '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5', // Light grey for odd rows
        },
        '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#ffffff', // White for even rows
        },
    }));

    const compares = [
        { label: 'Below Minimum Points', value: 'Below Minimum Points' },
        { label: 'Below Target Points', value: 'Below Target Points' },
        { label: 'Less than', value: 'Less than' },
        { label: 'Greater than', value: 'Greater than' },
        { label: 'Between', value: 'Between' },
        { label: 'All', value: 'All' },
    ];

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

    // Pre select dropdowns
    useEffect(() => {
        // Remove duplicates based on the 'company' field
        const uniqueIsAssignBranch = accessbranch.reduce((acc, current) => {
            const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
            label: data,
            value: data,
        }));
        setSelectedCompany(company);

        const branch = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company)
        )?.map(data => ({
            label: data.branch,
            value: data.branch,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedBranch(branch);

        const unit = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
        )?.map(data => ({
            label: data.unit,
            value: data.unit,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedUnit(unit);

        // // Create team options based on selected company, branch, and unit
        // const team = allTeam
        //     ?.filter(val =>
        //         company.some(comp => comp.value === val.company) &&
        //         branch.some(br => br.value === val.branch) &&
        //         unit.some(uni => uni.value === val.unit)
        //     )
        //     .map(data => ({
        //         label: data.teamname,
        //         value: data.teamname,
        //     }));
        // setSelectedTeam(team);
        // setValueTeam(team.map(a => a.value));
        // const allemployees = allUsersLimit
        //     ?.filter(val =>
        //         company.some(comp => comp.value === val.company) &&
        //         branch.some(br => br.value === val.branch) &&
        //         unit.some(uni => uni.value === val.unit) &&
        //         team.some(team => team.value === val.team)
        //     )
        //     .map(data => ({
        //         label: data.companyname,
        //         value: data.companyname,
        //     }));
        // setSelectedEmp(allemployees);
        // setValueEmp(allemployees.map(a => a.value));
    }, [isAssignBranch])

    // page refersh reload password
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Attendance With Production Overall Review"),
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

    const fetchEmployee = async () => {
        setPageName(!pageName)
        try {
            let res_min = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setEmployees(res_min.data.users);
        } catch (err) {
            console.log(err, '025124');
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [selectedTeam]);

    const fetchTeamAll = async () => {
        setPageName(!pageName)
        try {
            let res_min = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setTeams(res_min.data.teamsdetails);
        } catch (err) {
            console.log(err, 'error016');
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchTeamAll();
    }, [selectedUnit]);

    const fetchTeamAlls = async (e) => {
        setPageName(!pageName)
        // let unitArr = e.map(data => data.name)

        try {
            let res_location = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let teamsOptfirstthree = res_location?.data?.teamsdetails
                .map((data) => data.teamname)
                .map((name) => ({
                    label: name,
                    value: name,
                }));
            setSelectedTeam(teamsOptfirstthree);
        } catch (err) {
            console.log(err, 'error014');
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchTeamAlls();
    }, []);

    const fetchAttedanceStatus = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttStatus(res_vendor?.data?.attendancestatus);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all Attendance Status name.
    const fetchAttMode = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttModearr(res_freq?.data?.allattmodestatus);
            let result = res_freq?.data?.allattmodestatus.filter((data, index) => {
                return data.appliedthrough != "Auto";
            });

            setAttStatusOption(result.map((d) => d.name));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchAttedanceStatus();
        fetchAttMode();
    }, []);

    const getattendancestatus = (alldata) => {
        let result = attStatus.filter((data, index) => {
            return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
        })
        return result[0]?.name
    }

    const getAttModeAppliedThr = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.appliedthrough
    }

    const getAttModeLop = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.lop === true ? 'Yes' : 'No';
    }

    const getAttModeLopType = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.loptype
    }

    const getFinalLop = (rowlop, rowloptype) => {
        return (rowloptype === undefined || rowloptype === "") ? rowlop : (rowlop + ' - ' + rowloptype);
    }

    const getAttModeTarget = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.target === true ? 'Yes' : 'No';
    }

    const getAttModePaidPresent = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.paidleave === true ? 'Yes' : 'No';
    }

    const getAttModePaidPresentType = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.paidleavetype;
    }

    const getFinalPaid = (rowpaid, rowpaidtype) => {
        return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
    }

    const getAssignLeaveDayForLop = (rowlopday) => {
        if (rowlopday === 'Yes - Double Day') {
            return '2'
        } else if (rowlopday === 'Yes - Full Day') {
            return '1';
        } else if (rowlopday === 'Yes - Half Day') {
            return '0.5'
        } else {
            return '0';
        }
    }

    const getAssignLeaveDayForPaid = (rowpaidday) => {
        if (rowpaidday === 'Yes - Double Day') {
            return '2'
        } else if (rowpaidday === 'Yes - Full Day') {
            return '1';
        } else if (rowpaidday === 'Yes - Half Day') {
            return '0.5'
        } else {
            return '0';
        }
    }

    const getIsWeekoff = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        })
        return result[0]?.weekoff === true ? 'Yes' : 'No';
    }

    const getIsHoliday = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        })
        return result[0]?.holiday === true ? 'Yes' : 'No';
    }

    //multiselect onchange
    //Company multiselect dropdown changes
    const handleCompanyChange = (options) => {
        setSelectedCompany(options);
        setSelectedBranch([]);

        setSelectedEmployee([]);
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedTeam([]);
    };
    const customValueRendererCompany = (valueCate, _companyname) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Company';
    };

    //branch multiselect dropdown changes
    const handleBranchChange = (options) => {
        setSelectedBranch(options);
        setSelectedUnit([]);
        setSelectedEmployee([]);
        setSelectedTeam([]);
    };
    const customValueRendererBranch = (valueCate, _branchname) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Branch';
    };

    //unit multiselect dropdown changes
    const handleUnitChange = (options) => {
        setSelectedUnit(options);
        fetchTeamAll(options);
        setSelectedTeam([]);
        setSelectedEmployee([]);
    };
    const customValueRendererUnit = (valueCate, _unitname) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Unit';
    };

    //Team multiselect dropdown changes
    const handleTeamChange = (options) => {
        setSelectedTeam(options);
        setSelectedEmployee([]);
    };
    const customValueRendererTeam = (valueCate, _teamname) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Team';
    };

    //employee multiselect dropdown changes
    const handleEmployeeChange = (options) => {
        setSelectedEmployee(options);
    };
    const customValueRendererEmployee = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Employee';
    };
    const [totalPages, setTotalPages] = useState(1);

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        // { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        // { label: "This Week", value: "This Week" },
        // { label: "This Month", value: "This Month" },
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
            // case "Tomorrow":
            //     const tomorrow = new Date(today);
            //     tomorrow.setDate(today.getDate() + 1);
            //     fromdate = todate = formatDate(tomorrow);
            //     break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            // case "This Week":
            //     const startOfThisWeek = new Date(today);
            //     startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
            //     const endOfThisWeek = new Date(startOfThisWeek);
            //     endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
            //     fromdate = formatDate(startOfThisWeek);
            //     todate = formatDate(endOfThisWeek);
            //     break;
            // case "This Month":
            //     fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
            //     todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
            //     break;
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

    function getMonthsInRange(fromdate, todate) {
        const startDate = new Date(fromdate);
        const endDate = new Date(todate);
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const result = [];

        // Previous month based on `fromdate`
        const prevMonth = startDate.getMonth() === 0 ? 11 : startDate.getMonth() - 1;
        const prevYear = startDate.getMonth() === 0 ? startDate.getFullYear() - 1 : startDate.getFullYear();
        result.push({ month: monthNames[prevMonth], year: prevYear.toString() });

        // Add selected months between `fromdate` and `todate`
        const currentDate = new Date(startDate);
        currentDate.setDate(1); // Normalize to the start of the month
        while (
            currentDate.getFullYear() < endDate.getFullYear() ||
            (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() <= endDate.getMonth())
        ) {
            result.push({
                month: monthNames[currentDate.getMonth()],
                year: currentDate.getFullYear().toString()
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Next month based on `todate`
        const nextMonth = endDate.getMonth() === 11 ? 0 : endDate.getMonth() + 1;
        const nextYear = endDate.getMonth() === 11 ? endDate.getFullYear() + 1 : endDate.getFullYear();
        result.push({ month: monthNames[nextMonth], year: nextYear.toString() });

        return result;
    }

    const handleFilter = async () => {
        setPageName(!pageName)

        let startMonthDate = new Date(pointsFilter.fromdate);
        let endMonthDate = new Date(pointsFilter.todate);

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

        const montharray = getMonthsInRange(pointsFilter.fromdate, pointsFilter.todate);

        try {
            setLoader(true);

            // console.log(resultarr.length)

            let res1 = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let attendanceCriteriaData = res1?.data?.attendancecontrolcriteria[0];

            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                employee: isUserRoleAccess.companyname,
            });

            let leaveresult = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype !== 'Leave Without Pay (LWP)');
            let leaveresultWithoutPay = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype === 'Leave Without Pay (LWP)');

            let res = await axios.post(SERVICE.USER_DAY_POINTS_FILTER_FOR_SINGLE_DATE_WITH_ATTENDANCE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                less: Number(pointsFilter.less),
                greater: Number(pointsFilter.greater),
                betweenfrom: Number(pointsFilter.betweenfrom),
                betweento: Number(pointsFilter.betweento),
                compare: pointsFilter.compare,
                empnames: isUserRoleAccess.companyname,
                daysArrays: daysArray,
                pagename: 'AttOverallReviewInd',
                fromdate: pointsFilter.fromdate,
                todate: pointsFilter.todate,
                montharray: [...montharray],
            });

            let res_type = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let resdatawithlwp = [...res_type?.data?.leavetype, { leavetype: 'Leave Without Pay (LWP)', code: "LWP" }]

            let leavestatusApproved = [];
            resdatawithlwp?.map((type) => {
                res_applyleave?.data?.applyleaves && res_applyleave?.data?.applyleaves?.forEach((d) => {
                    if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift') {
                        leavestatusApproved.push(type.code + ' ' + d.status)
                    }
                    if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift') {
                        leavestatusApproved.push('DL' + ' - ' + type.code + ' ' + d.status)
                    }
                    if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double Day' && d.leavestatus === 'Shift') {
                        leavestatusApproved.push('DDL' + ' - ' + type.code + ' ' + d.status)
                    }
                });
            });

            const rearr = [...new Set(leavestatusApproved)];

            const filtered = res?.data?.filter(d => {
                const formattedDate = new Date(d.finalDate);
                const reasonDate = new Date(d.reasondate);
                const dojDate = new Date(d.doj);

                if (d.reasondate && d.reasondate !== "") {
                    return (formattedDate <= reasonDate);
                } else if (d.doj && d.doj !== "") {
                    return (formattedDate >= dojDate);
                } else {
                    return d;
                }
            });

            const changedWeekoffResult = filtered?.map((item, index) => {
                // Adjust clockinstatus based on lateclockincount
                let updatedClockInStatus = item.clockinstatus;
                // Adjust clockoutstatus based on earlyclockoutcount
                let updatedClockOutStatus = item.clockoutstatus;

                // Filter out only 'Absent' items for the current employee
                const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && d.clockoutstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00' && item.attendanceautostatus === 'ABSENT');

                // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                    // Define the date format for comparison
                    const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                    const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                    const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                    const isPreviousDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isNextDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);

                    if (isPreviousDayLeave) {
                        updatedClockInStatus = 'BeforeWeekOffLeave';
                        updatedClockOutStatus = 'BeforeWeekOffLeave';
                    }
                    if (isPreviousDayAbsent) {
                        updatedClockInStatus = 'BeforeWeekOffAbsent';
                        updatedClockOutStatus = 'BeforeWeekOffAbsent';
                    }
                    if (isPreviousDayLeaveWithoutPay) {
                        updatedClockInStatus = 'BeforeWeekOffAbsent';
                        updatedClockOutStatus = 'BeforeWeekOffAbsent';
                    }
                    if (isNextDayLeave) {
                        updatedClockInStatus = 'AfterWeekOffLeave';
                        updatedClockOutStatus = 'AfterWeekOffLeave';
                    }
                    if (isNextDayAbsent) {
                        updatedClockInStatus = 'AfterWeekOffAbsent';
                        updatedClockOutStatus = 'AfterWeekOffAbsent';
                    }
                    if (isNextDayLeaveWithoutPay) {
                        updatedClockInStatus = 'AfterWeekOffAbsent';
                        updatedClockOutStatus = 'AfterWeekOffAbsent';
                    }

                    if (isPreviousDayLeave && isNextDayLeave) {
                        updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                        updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
                    }
                    // console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
                    if (isPreviousDayAbsent && isNextDayAbsent) {
                        updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                        updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
                    }
                    if (isPreviousDayLeaveWithoutPay && isNextDayLeaveWithoutPay) {
                        updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                        updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
                    }
                }

                return {
                    ...item,
                    clockinstatus: updatedClockInStatus,
                    clockoutstatus: updatedClockOutStatus,
                };
            });

            const resultBefore = [];

            const empGrouped = {};

            changedWeekoffResult.forEach(item => {
                if (!empGrouped[item.empcode]) empGrouped[item.empcode] = [];
                empGrouped[item.empcode].push(item);
            });

            const leaveStatuses = [
                ...rearr,
                "Absent", "BL - Absent",
            ];

            // console.log(leaveStatuses, 'leaveStatuses')
            Object.keys(empGrouped).forEach(empcode => {
                const records = empGrouped[empcode]
                    .sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));

                let streak = [];
                let counterIn = 1;
                let counterOut = 1;

                for (let i = 0; i < records.length; i++) {
                    const current = records[i];
                    const isWeekOff = current.shift === "Week Off";

                    const isLeaveDay =
                        current.clockin === "00:00:00" &&
                        current.clockout === "00:00:00" &&
                        leaveStatuses.includes(current.clockinstatus) &&
                        !isWeekOff;

                    if (isLeaveDay) {
                        streak.push(current);
                    } else if (isWeekOff) {
                        // Push Week Off directly, don’t reset streak
                        resultBefore.push(current);
                    } else {
                        // Encountered present day, finalize streak
                        if (streak.length > attendanceCriteriaData?.longabsentcount) {
                            streak.forEach(day => {
                                let clockinstatus = day.clockinstatus;
                                let clockoutstatus = day.clockoutstatus;

                                if (clockinstatus === "Absent") {
                                    clockinstatus = `${counterIn++}Long Absent`;
                                } else if (clockinstatus === "BL - Absent") {
                                    clockinstatus = `${counterIn++}Long BL - Absent`;
                                } else if (rearr?.includes(clockinstatus)) {
                                    clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                                }

                                if (clockoutstatus === "Absent") {
                                    clockoutstatus = `${counterOut++}Long Absent`;
                                } else if (clockoutstatus === "BL - Absent") {
                                    clockoutstatus = `${counterOut++}Long BL - Absent`;
                                } else if (rearr?.includes(clockoutstatus)) {
                                    clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                                }

                                resultBefore.push({
                                    ...day,
                                    clockinstatus,
                                    clockoutstatus
                                });
                            });
                        } else {
                            resultBefore.push(...streak); // push as-is
                        }

                        resultBefore.push(current); // current present day
                        streak = [];
                        counterIn = 1;
                        counterOut = 1;
                    }
                }

                // Remaining streak at end
                if (streak.length > attendanceCriteriaData?.longabsentcount) {
                    streak.forEach(day => {
                        let clockinstatus = day.clockinstatus;
                        let clockoutstatus = day.clockoutstatus;

                        if (clockinstatus === "Absent") {
                            clockinstatus = `${counterIn++}Long Absent`;
                        } else if (clockinstatus === "BL - Absent") {
                            clockinstatus = `${counterIn++}Long BL - Absent`;
                        } else if (rearr?.includes(clockinstatus)) {
                            clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                        }

                        if (clockoutstatus === "Absent") {
                            clockoutstatus = `${counterOut++}Long Absent`;
                        } else if (clockoutstatus === "BL - Absent") {
                            clockoutstatus = `${counterOut++}Long BL - Absent`;
                        } else if (rearr?.includes(clockoutstatus)) {
                            clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                        }

                        resultBefore.push({
                            ...day,
                            clockinstatus,
                            clockoutstatus
                        });
                    });
                } else {
                    resultBefore.push(...streak);
                }
            });
            resultBefore.sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));

            // Group data by empcode
            let groupedData = {};
            resultBefore.forEach((item) => {
                if (!groupedData[item.empcode]) {
                    groupedData[item.empcode] = {
                        attendanceRecords: [],
                        departmentDateSet: item.departmentDateSet || [],
                    };
                }
                groupedData[item.empcode].attendanceRecords.push(item);
            });
            // console.log(groupedData, 'groupedData')
            let result = [];

            for (let empcode in groupedData) {
                let { attendanceRecords, departmentDateSet } = groupedData[empcode];

                departmentDateSet.forEach((dateRange) => {
                    let { fromdate, todate, department } = dateRange;

                    let countByEmpcodeClockin = {};
                    let countByEmpcodeClockout = {};

                    let recordsInDateRange = attendanceRecords.filter((record) => {
                        let formattedDate = new Date(record.finalDate);
                        return department === record.department && formattedDate >= new Date(fromdate) && formattedDate <= new Date(todate);
                    });

                    let processedRecords = recordsInDateRange.map((item) => {
                        let formattedDate = new Date(item.finalDate);
                        let reasonDate = item.reasondate ? new Date(item.reasondate) : null;
                        let dojDate = item.doj ? new Date(item.doj) : null;

                        let updatedClockInStatus = item.clockinstatus;
                        let updatedClockOutStatus = item.clockoutstatus;

                        // Check if the date falls within the reasonDate or dojDate
                        if (reasonDate && formattedDate <= reasonDate) {
                            return null;
                        }
                        if (dojDate && formattedDate < dojDate) {
                            return null;
                        }

                        // Handling Late Clock-in and Early Clock-out
                        if (!countByEmpcodeClockin[item.empcode]) {
                            countByEmpcodeClockin[item.empcode] = 1;
                        }
                        if (!countByEmpcodeClockout[item.empcode]) {
                            countByEmpcodeClockout[item.empcode] = 1;
                        }

                        if (updatedClockInStatus === "Late - ClockIn") {
                            updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                            countByEmpcodeClockin[item.empcode]++;
                        }

                        if (updatedClockOutStatus === "Early - ClockOut") {
                            updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                            countByEmpcodeClockout[item.empcode]++;
                        }

                        // console.log(item.rowformattedDate, updatedClockInStatus, updatedClockOutStatus)

                        return {
                            ...item,
                            department,
                            fromdate,
                            todate,
                            clockinstatus: updatedClockInStatus,
                            clockoutstatus: updatedClockOutStatus,
                        };
                    });

                    result.push(...processedRecords.filter(Boolean));
                });
            }

            const itemsWithSerialNumber = result?.map((item, index) => (
                {
                    ...item,
                    attendanceauto: getattendancestatus(item),
                    daystatus: (item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)) ?
                        (item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)) : 'Not Defined',
                    appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    lopcalculation: getFinalLop(
                        getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                        getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                    ),
                    modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    paidpresent: getFinalPaid(
                        getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                        getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                    ),
                    lopday: getAssignLeaveDayForLop(
                        getFinalLop(
                            getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                            getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                        )
                    ),
                    paidpresentday: getAssignLeaveDayForPaid(
                        getFinalPaid(
                            getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                            getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
                        )
                    ),
                    isweekoff: getIsWeekoff(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                    isholiday: getIsHoliday(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                }));

            const weekOption = ['BeforeWeekOffAbsent', 'AfterWeekOffAbsent', 'BeforeWeekOffLeave', 'AfterWeekOffLeave', 'BeforeAndAfterWeekOffAbsent', 'BeforeAndAfterWeekOffLeave'];
            itemsWithSerialNumber.forEach((item, index, array) => {
                const previousItem = array[index - 1];
                const nextItem = array[index + 1];

                if (item.shift === 'Week Off') {

                    const isLopRelevant = (entry) => entry && (entry.lopcalculation === 'Yes - Full Day' || entry.lopcalculation === 'Yes - Double Day');

                    const isPreviousManualPaidFull =
                        previousItem &&
                        previousItem.appliedthrough === 'Manual' &&
                        previousItem.paidpresent === 'Yes - Full Day';

                    const isNextManualPaidFull =
                        nextItem &&
                        nextItem.appliedthrough === 'Manual' &&
                        nextItem.paidpresent === 'Yes - Full Day';

                    const isPrevLop = isLopRelevant(previousItem) && !isPreviousManualPaidFull;
                    const isNextLop = isLopRelevant(nextItem) && !isNextManualPaidFull;

                    if (isPrevLop && isNextLop) {
                        item.clockinstatus = 'BeforeAndAfterWeekOffAbsent';
                        item.clockoutstatus = 'BeforeAndAfterWeekOffAbsent';
                    } else if (isPrevLop) {
                        item.clockinstatus = 'BeforeWeekOffAbsent';
                        item.clockoutstatus = 'BeforeWeekOffAbsent';
                    } else if (isNextLop) {
                        item.clockinstatus = 'AfterWeekOffAbsent';
                        item.clockoutstatus = 'AfterWeekOffAbsent';
                    }

                    // Recalculate attendance status if needed
                    item.attendanceauto = getattendancestatus(item);
                    item.daystatus = (item.attendanceautostatus || getattendancestatus(item)) ? (item.attendanceautostatus || getattendancestatus(item)) : 'Not Defined';
                    item.appliedthrough = getAttModeAppliedThr(item.attendanceautostatus || getattendancestatus(item));
                    item.lop = getAttModeLop(item.attendanceautostatus || getattendancestatus(item));
                    item.loptype = getAttModeLopType(item.attendanceautostatus || getattendancestatus(item));
                    item.lopcalculation = getFinalLop(
                        getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
                        getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
                    );
                    item.modetarget = getAttModeTarget(item.attendanceautostatus || getattendancestatus(item));
                    item.paidpresentbefore = getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item));
                    item.paidleavetype = getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item));
                    item.paidpresent = getFinalPaid(
                        getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item)),
                        getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item))
                    );
                    item.lopday = getAssignLeaveDayForLop(
                        getFinalLop(
                            getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
                            getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
                        )
                    );
                    item.paidpresentday = getAssignLeaveDayForPaid(
                        getFinalPaid(
                            getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item)),
                            getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item))
                        )
                    );
                    item.isweekoff = getIsWeekoff(item.attendanceautostatus || getattendancestatus(item));
                    item.isholiday = getIsHoliday(item.attendanceautostatus || getattendancestatus(item));

                }
                if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.appliedthrough === 'Manual' && item.paidpresent === "Yes - Full Day") {

                    const hasRelevantStatus = (entry) => entry && ((weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus)) && entry.shift === 'Week Off');

                    if (hasRelevantStatus(previousItem)) {
                        if (!weekOption.includes(previousItem.clockinstatus)) {
                            previousItem.clockinstatus = 'Week Off';
                            previousItem.clockoutstatus = 'Week Off';
                            previousItem.attendanceauto = getattendancestatus(previousItem);
                            previousItem.daystatus = (previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)) ? (previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)) : 'Not Defined';
                            previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.lopcalculation = getFinalLop(
                                getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                                getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                            );
                            previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.paidpresent = getFinalPaid(
                                getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                                getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                            );
                            previousItem.lopday = getAssignLeaveDayForLop(
                                getFinalLop(
                                    getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                                    getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                                )
                            );
                            previousItem.paidpresentday = getAssignLeaveDayForPaid(
                                getFinalPaid(
                                    getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                                    getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                                )
                            );
                            previousItem.isweekoff = getIsWeekoff(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                            previousItem.isholiday = getIsHoliday(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                        }
                    }
                    if (hasRelevantStatus(nextItem)) {
                        if (!weekOption.includes(nextItem.clockinstatus)) {
                            nextItem.clockinstatus = 'Week Off';
                            nextItem.clockoutstatus = 'Week Off';
                            nextItem.attendanceauto = getattendancestatus(nextItem);
                            nextItem.daystatus = (nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)) ? (nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)) : 'Not Defined';
                            nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.lopcalculation = getFinalLop(
                                getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                                getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                            );
                            nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.paidpresent = getFinalPaid(
                                getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                                getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                            );
                            nextItem.lopday = getAssignLeaveDayForLop(
                                getFinalLop(
                                    getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                                    getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                                )
                            );
                            nextItem.paidpresentday = getAssignLeaveDayForPaid(
                                getFinalPaid(
                                    getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                                    getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                                )
                            );
                            nextItem.isweekoff = getIsWeekoff(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                            nextItem.isholiday = getIsHoliday(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                        }
                    }
                }
            })
            let fianlResult = itemsWithSerialNumber.filter(data => data.finalDate >= pointsFilter.fromdate && data.finalDate <= pointsFilter.todate);
            setClientUserIDArray(fianlResult);
            setTotalPages(Math.ceil(fianlResult.length / pageSize));
            // setPage(1);
            setLoader(false);

        } catch (err) {
            console.log(err, 'error013');
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pointsFilter.fromdate === '' && pointsFilter.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            handleFilter();
        }
    };

    const handleClear = async (e) => {
        setPageName(!pageName)
        try {
            setLoader(true);

            setSelectedEmployee([]);
            setSelectedCompany([]);
            setSelectedBranch([]);
            setSelectedUnit([]);
            setSelectedTeam([]);
            setPointsFilter({ ...pointsFilter, fromdate: today, todate: today, less: '', greater: '', betweenfrom: '', betweento: '', compare: 'All' });
            setClientUserIDArray([]);
            setLoader(false);
        } catch (err) {
            console.log(err, 'error012');
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //serial no for listing items
    const addSerialNumber = async () => {
        // console.log(clientUserIDArray, 'clientUserIDArray');
        const itemsWithSerialNumber = clientUserIDArray?.map((item, index) => {
            let status = '';
            let tempstatus = '';
            if (Number(item.point) < Number(item.daypoint)) {
                status = 'Below Min Points';
            } else if (item.avgpoint <= 50) {
                status = 'Below 50%';
            } else if (item.avgpoint > 50 && item.avgpoint <= 75) {
                status = 'Between 51 - 75%';
            } else if (item.avgpoint > 75 && item.avgpoint <= 100) {
                status = 'Between 76 - 100%';
            } else if (item.avgpoint > 100 && item.avgpoint <= 149) {
                status = 'Between 101 - 149%';
            } else if (item.avgpoint > 149) {
                status = '150% and Above';
            }

            if (Number(item.temppoint) < Number(item.daypoint)) {
                tempstatus = 'Below Min Points';
            } else if (item.tempavgpoint <= 50) {
                tempstatus = 'Below 50%';
            } else if (item.tempavgpoint > 50 && item.tempavgpoint <= 75) {
                tempstatus = 'Between 51 - 75%';
            } else if (item.tempavgpoint > 75 && item.tempavgpoint <= 100) {
                tempstatus = 'Between 76 - 100%';
            } else if (item.tempavgpoint > 100 && item.tempavgpoint <= 149) {
                tempstatus = 'Between 101 - 149%';
            } else if (item.tempavgpoint > 149) {
                tempstatus = '150% and Above';
            }

            let mindiffval = Number(item.point) - Number(item.daypoint);
            let tardiffval = Number(item.point) - Number(item.target);
            let tempmindiffval = Number(item.temppoint) - Number(item.daypoint);
            let temptardiffval = Number(item.temppoint) - Number(item.target);

            return {
                ...item,
                id: item._id,
                serialNumber: index + 1,
                production: String(item.production),
                manual: String(item.manual),
                nonproduction: String(item.nonproduction),
                point: Number(Number(item.point).toFixed(2)),
                temppoint: Number(Number(item.temppoint).toFixed(2)),
                avgpoint: Number(Number(item.avgpoint).toFixed(2)),
                tempavgpoint: Number(Number(item.tempavgpoint).toFixed(2)),
                daypoint: item.daypoint ? Number(Number(item.daypoint).toFixed(2)) : '',
                mindiff: item.daypoint ? (mindiffval <= 0 ? Number(mindiffval.toFixed(2)) : Number(mindiffval.toFixed(2))) : '',
                tempmindiff: item.daypoint ? (tempmindiffval <= 0 ? Number(tempmindiffval.toFixed(2)) : Number(tempmindiffval.toFixed(2))) : '',
                tardiff: item.target ? (tardiffval <= 0 ? Number(tardiffval.toFixed(2)) : Number(tardiffval.toFixed(2))) : '',
                temptardiff: item.target ? (temptardiffval <= 0 ? Number(temptardiffval.toFixed(2)) : Number(temptardiffval.toFixed(2))) : '',
                status: item.target == 0 ? ' ' : status,
                tempstatus: item.target == 0 ? ' ' : tempstatus,
                experience: Number(item.exper),
                minreached: item.target == 0 ? '' : (Number(item.point) < Number(item.daypoint) ? 'Not Reached' : 'Reached'),
                tempminreached: item.target == 0 ? '' : (Number(item.temppoint) < Number(item.daypoint) ? 'Not Reached' : 'Reached'),
            };
        });

        setItems(itemsWithSerialNumber);
    };

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [clientUserIDArray]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(' ');

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    // const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const columnDataTable = [
        { field: 'serialNumber', headerName: 'SNo', flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: 'bold-header', },
        { field: 'empcode', headerName: 'Employee Code', flex: 0, width: 110, hide: !columnVisibility.empcode, headerClassName: 'bold-header', },
        { field: 'name', headerName: 'Employee Name', flex: 0, width: 160, hide: !columnVisibility.name, headerClassName: 'bold-header', },
        { field: 'companyname', headerName: 'Company', flex: 0, width: 110, hide: !columnVisibility.companyname, headerClassName: 'bold-header', },
        { field: 'branch', headerName: 'Branch', flex: 0, width: 110, hide: !columnVisibility.branch, headerClassName: 'bold-header', },
        { field: 'unit', headerName: 'Unit', flex: 0, width: 110, hide: !columnVisibility.unit, headerClassName: 'bold-header', },
        { field: 'team', headerName: 'Team', flex: 0, width: 110, hide: !columnVisibility.team, headerClassName: 'bold-header', },
        { field: "date", headerName: "Date", flex: 0, width: 110, hide: !columnVisibility.date, },
        { field: "shiftmode", headerName: "Shift Mode", flex: 0, width: 110, hide: !columnVisibility.shiftmode, },
        { field: "shift", headerName: "Shift", flex: 0, width: 150, hide: !columnVisibility.shift, },
        { field: "leavestatus", headerName: "Leave Status", flex: 0, width: 150, hide: !columnVisibility.leavestatus, },
        { field: "permissionstatus", headerName: "Permission Status", flex: 0, width: 150, hide: !columnVisibility.permissionstatus, },
        { field: "clockin", headerName: "Clock In", flex: 0, width: 120, hide: !columnVisibility.clockin, },
        { field: "clockinstatus", headerName: "Clock In Status", flex: 0, width: 130, hide: !columnVisibility.clockinstatus, },
        { field: "clockout", headerName: "Clock Out", flex: 0, width: 120, hide: !columnVisibility.clockout, },
        { field: "clockoutstatus", headerName: "Clock Out Status", flex: 0, width: 130, hide: !columnVisibility.clockoutstatus, },
        { field: 'daypoint', headerName: 'Min Points', flex: 0, width: 100, hide: !columnVisibility.daypoint, headerClassName: 'bold-header', },
        { field: 'experience', headerName: 'Exp', flex: 0, width: 100, hide: !columnVisibility.experience, headerClassName: 'bold-header', },
        { field: 'target', headerName: 'Target', flex: 0, width: 110, hide: !columnVisibility.target, headerClassName: 'bold-header', },
        { field: 'point', headerName: 'Point', flex: 0, width: 110, hide: !columnVisibility.point, headerClassName: 'bold-header', },
        { field: 'temppoint', headerName: 'Temp Point', flex: 0, width: 110, hide: !columnVisibility.point, headerClassName: 'bold-header', },
        { field: 'avgpoint', headerName: 'Avg Point', flex: 0, width: 110, hide: !columnVisibility.avgpoint, headerClassName: 'bold-header', },
        { field: 'tempavgpoint', headerName: 'Temp Avg Point', flex: 0, width: 110, hide: !columnVisibility.tempavgpoint, headerClassName: 'bold-header', },
        {
            field: 'mindiff', headerName: 'Min Diff', flex: 0, width: 110, hide: !columnVisibility.mindiff, headerClassName: 'bold-header',
            renderCell: (params) => <Typography sx={{ color: params.row.mindiff < 0 ? 'red' : params.row.mindiff === 0 ? 'inherit' : 'green', fontSize: '10px' }}>{params.row.mindiff}</Typography>,
        },
        {
            field: 'tempmindiff', headerName: 'Temp Min Diff', flex: 0, width: 110, hide: !columnVisibility.tempmindiff, headerClassName: 'bold-header',
            renderCell: (params) => <Typography sx={{ color: params.row.tempmindiff < 0 ? 'red' : params.row.tempmindiff === 0 ? 'inherit' : 'green', fontSize: '10px' }}>{params.row.tempmindiff}</Typography>,
        },
        {
            field: 'tardiff', headerName: 'Tar Diff', flex: 0, width: 110, hide: !columnVisibility.tardiff, headerClassName: 'bold-header',
            renderCell: (params) => <Typography sx={{ color: params.row.tardiff < 0 ? 'red' : params.row.tardiff === 0 ? 'inherit' : 'green', fontSize: '10px' }}>{params.row.tardiff}</Typography>,
        },
        {
            field: 'temptardiff', headerName: 'Temp Tar Diff', flex: 0, width: 110, hide: !columnVisibility.temptardiff, headerClassName: 'bold-header',
            renderCell: (params) => <Typography sx={{ color: params.row.temptardiff < 0 ? 'red' : params.row.temptardiff === 0 ? 'inherit' : 'green', fontSize: '10px' }}>{params.row.temptardiff}</Typography>,
        },
        {
            field: 'minreached', headerName: 'Min Reached', flex: 0, width: 130, hide: !columnVisibility.minreached, headerClassName: 'bold-header',
            renderCell: (params) => params.row.target ? <Chip variant="outlined" sx={{ fontSize: '10px' }} size="small" color={params.row.minreached === 'Not Reached' ? 'error' : 'success'} icon={params.row.minreached === 'Not Reached' ? <ClearIcon /> : <CheckIcon />} label={params.row.minreached} /> : null,
        },
        {
            field: 'tempminreached', headerName: 'Temp Min Reached', flex: 0, width: 130, hide: !columnVisibility.tempminreached, headerClassName: 'bold-header',
            renderCell: (params) => params.row.target ? <Chip variant="outlined" sx={{ fontSize: '10px' }} size="small" color={params.row.tempminreached === 'Not Reached' ? 'error' : 'success'} icon={params.row.tempminreached === 'Not Reached' ? <ClearIcon /> : <CheckIcon />} label={params.row.tempminreached} /> : null,
        },
        {
            field: 'status', headerName: 'Status', flex: 0, width: 150, hide: !columnVisibility.status, headerClassName: 'bold-header', renderCell: (params) =>
                params.row.target ? (
                    <Chip
                        sx={{
                            fontSize: '10px',
                            background: params.row.status === 'Between 101 - 149%' || params.row.status === '150% and Above' ? '#A3C9AA' : params.row.status === 'Below Min Points' ? '#FF6868' : '#fdbb56',
                        }}
                        size="small"
                        avatar={params.row.status === 'Between 76 - 100%' ? <Avatar>{'👍'}</Avatar> : params.row.status === '150% and Above' ? <Avatar>{'🔥'}</Avatar> : params.row.status === 'Between 101 - 149%' ? <Avatar>{'👌'}</Avatar> : params.row.status === 'Below Min Points' ? <Avatar>{'👎'}</Avatar> : ''}
                        label={params.row.status}
                        variant="outlined"
                    />
                ) : null,
        },
        {
            field: 'tempstatus', headerName: 'Temp Status', flex: 0, width: 150, hide: !columnVisibility.tempstatus, headerClassName: 'bold-header', renderCell: (params) =>
                params.row.target ? (
                    <Chip
                        sx={{
                            fontSize: '10px',
                            background: params.row.tempstatus === 'Between 101 - 149%' || params.row.tempstatus === '150% and Above' ? '#A3C9AA' : params.row.tempstatus === 'Below Min Points' ? '#FF6868' : '#fdbb56',
                        }}
                        size="small"
                        avatar={params.row.tempstatus === 'Between 76 - 100%' ? <Avatar>{'👍'}</Avatar> : params.row.tempstatus === '150% and Above' ? <Avatar>{'🔥'}</Avatar> : params.row.tempstatus === 'Between 101 - 149%' ? <Avatar>{'👌'}</Avatar> : params.row.tempstatus === 'Below Min Points' ? <Avatar>{'👎'}</Avatar> : ''}
                        label={params.row.tempstatus}
                        variant="outlined"
                    />
                ) : null,
        },
        { field: 'daystatus', headerName: 'Day Status', flex: 0, width: 150, hide: !columnVisibility.daystatus, headerClassName: 'bold-header', },
        { field: 'clienterrorcount', headerName: 'Client Error Count', flex: 0, width: 110, hide: !columnVisibility.clienterrorcount, headerClassName: 'bold-header', },
        { field: 'clientamount', headerName: 'Client Amount', flex: 0, width: 115, hide: !columnVisibility.clientamount, headerClassName: 'bold-header', },
        { field: 'waiveramount', headerName: 'Waiver Amount', flex: 0, width: 115, hide: !columnVisibility.waiveramount, headerClassName: 'bold-header', },
        { field: 'accuracy', headerName: 'Accuracy', flex: 0, width: 115, hide: !columnVisibility.accuracy, headerClassName: 'bold-header', },
        { field: 'totalfield', headerName: 'Total Field', flex: 0, width: 115, hide: !columnVisibility.totalfield, headerClassName: 'bold-header', },
        { field: 'autoerrorcalculation', headerName: 'Auto Error Calculation', flex: 0, width: 115, hide: !columnVisibility.autoerrorcalculation, headerClassName: 'bold-header', },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            empcode: item.empcode,
            name: item.name,
            companyname: item.companyname,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            target: item.target,
            point: Number(item.point),
            temppoint: Number(item.temppoint),
            daypoint: Number(item.daypoint),
            avgpoint: Number(item.avgpoint),
            tempavgpoint: Number(item.tempavgpoint),
            minreached: item.minreached,
            tempminreached: item.tempminreached,
            mindiff: Number(item.mindiff),
            tempmindiff: Number(item.tempmindiff),
            tardiff: Number(item.tardiff),
            temptardiff: Number(item.temptardiff),
            status: item.status,
            tempstatus: item.tempstatus,
            daystatus: item.daystatus,
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

    const [fileFormat, setFormat] = useState('');
    let exportColumnNames =
        ['Employee Code', 'Employee Name', 'Company', 'Branch', 'Unit', 'Team', 'Date',
            'Shift Mode', 'Shift', "Leave Status", "Permission Status", 'ClockIn', 'ClockInStatus', 'ClockOut', 'ClockOutStatus',
            'Min Points', 'Exp', 'Target', 'Point', 'Temp Point', 'Avg Point', 'Temp Avg Point', 'Min Diff', 'Temp Min Diff',
            'Tar Diff', 'Temp Tar Diff', 'Min Reached', 'Temp Min Reached', 'Status', 'Temp Status', 'Day Status', 'Client Error Count', 'Client Amount', 'Waiver Amount', 'Accuracy', 'Total Field', 'Auto Error Calculation']

    let exportRowValues =
        ['empcode', 'name', 'companyname', 'branch', 'unit', 'team', 'date',
            'shiftmode', 'shift', 'leavestatus', 'permissionstatus', 'clockin', 'clockinstatus', 'clockout', 'clockoutstatus',
            'daypoint', 'experience', 'target', 'point', 'temppoint', 'avgpoint', 'tempavgpoint', 'mindiff', 'tempmindiff',
            'tardiff', 'temptardiff', 'minreached', 'tempminreached', 'status', 'tempstatus', 'daystatus', 'clienterrorcount', 'clientamount', 'waiveramount', 'accuracy', 'totalfield', 'autoerrorcalculation'
        ]

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Attendance With Production Overall Review',
        pageStyle: 'print',
    });

    // Image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Attendance With Production Overall Review List.png');
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={'ATTENDANCE WITH PRODUCTION OVERALL REVIEW'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Attendance With Production Overall Review"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Reports"
                subsubpagename="Attendance With Production Overall Review"
            />

            {isUserRoleCompare?.includes('lattendancewithproductionoverallreview') && (
                <>
                    <Box sx={userStyle.dialogbox}>
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
                                            setPointsFilter({
                                                ...pointsFilter,
                                                fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            });
                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={pointsFilter.fromdate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            if (selectedDate <= currentDate) {
                                                setPointsFilter({ ...pointsFilter, fromdate: selectedDate, todate: selectedDate });
                                            } else {
                                                // Handle the case where the selected date is in the future (optional)
                                                // You may choose to show a message or take other actions.
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>{" "} To Date<b style={{ color: "red" }}>*</b>{" "}</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={pointsFilter.todate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            const fromdateval = pointsFilter.fromdate != "" && new Date(pointsFilter.fromdate).toISOString().split("T")[0];
                                            if (pointsFilter.fromdate == "") {
                                                setPopupContentMalert("Please Select From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate < fromdateval) {
                                                setPointsFilter({ ...pointsFilter, todate: "" });
                                                setPopupContentMalert("To Date should be after or equal to From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate <= currentDate) {
                                                setPointsFilter({ ...pointsFilter, todate: selectedDate });
                                            } else {
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0], min: pointsFilter.fromdate !== "" ? pointsFilter.fromdate : null }}
                                    />
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={2.5} sm={6} lg={2.5} xs={12}>
                                <Typography>From Date</Typography>
                                <FormControl fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={pointsFilter.fromdate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split('T')[0];
                                            if (selectedDate <= currentDate) {
                                                setPointsFilter({ ...pointsFilter, fromdate: selectedDate, todate: selectedDate });
                                            } else {
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split('T')[0] }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2.5} sm={6} lg={2.5} xs={12}>
                                <Typography>To Date</Typography>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={pointsFilter.todate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split('T')[0];
                                            const fromdateval = pointsFilter.fromdate != '' && new Date(pointsFilter.fromdate).toISOString().split('T')[0];
                                            if (pointsFilter.fromdate == '') {
                                                setPopupContentMalert("Please Select From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate < fromdateval) {
                                                setPopupContentMalert("To Date should be after or equal to From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate <= currentDate) {
                                                setPointsFilter({ ...pointsFilter, todate: selectedDate });
                                            } else {
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split('T')[0], min: pointsFilter.fromdate !== '' ? pointsFilter.fromdate : null }}
                                    />
                                </FormControl>
                            </Grid> */}
                            {/* <Grid item md={3} sm={6} lg={2} xs={12}>
                                <Typography>Compare</Typography>
                                <FormControl fullWidth>
                                    <Selects
                                        options={compares}
                                        value={{ label: pointsFilter.compare, value: pointsFilter.compare }}
                                        onChange={(e) => {
                                            setPointsFilter({ ...pointsFilter, compare: e.value, less: '', greater: '', betweenfrom: '', betweento: '' });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {pointsFilter.compare === 'Less than' && (
                                <Grid item md={2} sm={6} lg={2} xs={12}>
                                    <Typography>
                                        Value (%) <b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Value(%)"
                                            value={pointsFilter.less}
                                            onChange={(e) => {
                                                setPointsFilter({
                                                    ...pointsFilter,
                                                    less: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                            {pointsFilter.compare === 'Greater than' && (
                                <Grid item md={2} sm={6} lg={2} xs={12}>
                                    <Typography>
                                        Value (%) <b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Value(%)"
                                            value={pointsFilter.greater}
                                            onChange={(e) => {
                                                setPointsFilter({
                                                    ...pointsFilter,
                                                    greater: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                            {pointsFilter.compare === 'Between' && (
                                <>
                                    <Grid item md={2} sm={6} lg={2} xs={12}>
                                        <Typography>
                                            Value from (%) <b style={{ color: 'red' }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter From Value(%)"
                                                value={pointsFilter.betweenfrom}
                                                onChange={(e) => {
                                                    setPointsFilter({
                                                        ...pointsFilter,
                                                        betweenfrom: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={2} sm={6} lg={2} xs={12}>
                                        <Typography>
                                            Value to (%) <b style={{ color: 'red' }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter To Value(%)"
                                                value={pointsFilter.betweento}
                                                onChange={(e) => {
                                                    setPointsFilter({
                                                        ...pointsFilter,
                                                        betweento: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )} */}
                            {/* </Grid>
                        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}> */}
                            <Grid item md={1} sm={6} lg={1.5} xs={12} marginTop={3}>
                                <Button variant="contained" onClick={(e) => handleSubmit(e)}>
                                    Generate
                                </Button>
                            </Grid>
                            <Grid item md={1} sm={6} lg={1} xs={12} marginTop={3}>
                                <Button sx={userStyle.btncancel} onClick={(e) => handleClear(e)}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </Box><br />
                    {/* ****** Table Start ****** */}
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Attendance With Production Points List</Typography>
                            </Grid>
                            {loader ? (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </>
                            ) : (
                                <>
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
                                                    sx={{ width: '77px' }}
                                                >
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                    <MenuItem value={50}>50</MenuItem>
                                                    <MenuItem value={100}>100</MenuItem>
                                                    <MenuItem value={clientUserIDArray?.length}>All</MenuItem>
                                                </Select>
                                            </Box>
                                        </Grid>
                                        <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <Box>
                                                {isUserRoleCompare?.includes('excelattendancewithproductionoverallreview') && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                setIsFilterOpen(true);

                                                                setFormat('xl');
                                                            }}
                                                            sx={userStyle.buttongrp}
                                                        >
                                                            <FaFileExcel />
                                                            &ensp;Export to Excel&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes('csvattendancewithproductionoverallreview') && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                setIsFilterOpen(true);
                                                                setFormat('csv');
                                                            }}
                                                            sx={userStyle.buttongrp}
                                                        >
                                                            <FaFileCsv />
                                                            &ensp;Export to CSV&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes('printattendancewithproductionoverallreview') && (
                                                    <>
                                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                            &ensp;
                                                            <FaPrint />
                                                            &ensp;Print&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                                {isUserRoleCompare?.includes('pdfattendancewithproductionoverallreview') && (
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
                                                {isUserRoleCompare?.includes('imageattendancewithproductionoverallreview') && (
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                        {' '}
                                                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                                                    </Button>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Box>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Search</Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                    </Grid><br />
                                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
                                    <Box style={{ width: '100%', overflowY: 'hidden', }}>
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
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
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
                        {/* ****** Table End ****** */}
                    </>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={items ?? []}
                filename={'Attendance With Production Overall Review'}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default AttendanceWithProdOverallReviewListIndividual;