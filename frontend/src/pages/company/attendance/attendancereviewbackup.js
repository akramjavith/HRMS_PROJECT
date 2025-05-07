import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { handleApiError } from "../../../components/Errorhandling";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceReview() {

    const gridRefTableAttReview = useRef(null);
    const gridRefImageAttReview = useRef(null);

    const { isUserRoleAccess, isUserRoleCompare, allUsersLimit, alldepartment, allTeam, isAssignBranch, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [valueTeam, setValueTeam] = useState([]);
    const [selectedDep, setSelectedDep] = useState([]);
    const [valueDep, setValueDep] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [valueEmp, setValueEmp] = useState([]);
    const [userShifts, setUserShifts] = useState([]);
    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);
    const [attStatusOption, setAttStatusOption] = useState([]);
    const [attStatusOptionDropdown, setAttStatusOptionDropdown] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);
    const cuurentDate = new Date();

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(userShifts);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [filterUser, setFilterUser] = useState({
        filtertype: "Individual",
        fromdate: moment(cuurentDate).format("YYYY-MM-DD"),
        todate: moment(cuurentDate).format("YYYY-MM-DD"),
        attendancestatus: "Please Select Attendance Status",
    });

    // Datatable
    const [pageAttReview, setPageAttReview] = useState(1);
    const [pageSizeAttReview, setPageSizeAttReview] = useState(10);
    const [searchQueryAttReview, setSearchQueryAttReview] = useState("");
    const [totalPagesAttReview, setTotalPagesAttReview] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

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

    // page refersh reload
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
    const [isManageColumnsOpenAttReview, setManageColumnsOpenAttReview] = useState(false);
    const [anchorElAttReview, setAnchorElAttReview] = useState(null);
    const [searchQueryManageAttReview, setSearchQueryManageAttReview] = useState("");
    const handleOpenManageColumnsAttReview = (event) => {
        setAnchorElAttReview(event.currentTarget);
        setManageColumnsOpenAttReview(true);
    };
    const handleCloseManageColumnsAttReview = () => {
        setManageColumnsOpenAttReview(false);
        setSearchQueryManageAttReview("");
    };
    const openAttReview = Boolean(anchorElAttReview);
    const idAttReview = openAttReview ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchAttReview, setAnchorElSearchAttReview] = React.useState(null);
    const handleClickSearchAttReview = (event) => {
        setAnchorElSearchAttReview(event.currentTarget);
    };
    const handleCloseSearchAttReview = () => {
        setAnchorElSearchAttReview(null);
        setSearchQueryAttReview("");
    };

    const openSearchAttReview = Boolean(anchorElSearchAttReview);
    const idSearchAttReview = openSearchAttReview ? 'simple-popover' : undefined;

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    const modeOptions = [
        { label: 'Department', value: "Department" },
        { label: "Employee", value: "Employee" },
    ];

    // Show All Columns & Manage Columns
    const initialColumnVisibilityAttReview = {
        serialNumber: true,
        empcode: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        department: true,
        date: true,
        shift: true,
        clockin: true,
        clockout: true,
        clockinstatus: true,
        clockoutstatus: true,
        attendance: true,
        attendancestatus: true,
    };
    const [columnVisibilityAttReview, setColumnVisibilityAttReview] = useState(initialColumnVisibilityAttReview);

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    useEffect(() => {
        fetchAttedanceStatus();
        // document.getElementById("to-date").min = moment(cuurentDate).format("YYYY-MM-DD");
    }, []);

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
            pagename: String("Attendance Review"),
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

    const clockInOpt = ["Early - ClockIn",
        "On - Present",
        "BeforeWeekOffAbsent",
        "AfterWeekOffAbsent",
        "PERAPPR",
        "PERAPPL",
        "PERREJ",
        "COMP - PERAPPR",
        "COMP - PERAPPL",
        "HB Applied",
        "HB Approved",
        "HB Rejected",
        "HA Applied",
        "HA Approved",
        "HA Rejected",
        "DL Applied",
        "DL Approved",
        "DL Rejected",
        "DHB Applied",
        "DHB Approved",
        "DHB Rejected",
        "DHA Applied",
        "DHA Approved",
        "DHA Rejected",
        "HBLOP", "FLOP", "Grace - ClockIn",
        "Late - ClockIn", "Present", "Absent", "Week Off", "Mis - ClockIn", "Holiday", "Leave", "BeforeWeekOffLeave", "AfterWeekOffLeave", "L.W.P Approved", "L.W.P Applied", "L.W.P Rejected"]

    const clockOutOpt = ["Early - ClockOut", "Over - ClockOut",
        "PERAPPR",
        "PERAPPL",
        "PERREJ",
        "COMP - PERAPPR",
        "COMP - PERAPPL",
        "HB Applied",
        "HB Approved",
        "HB Rejected",
        "HA Applied",
        "HA Approved",
        "HA Rejected",
        "DL Applied",
        "DL Approved",
        "DL Rejected",
        "DHB Applied",
        "DHB Approved",
        "DHB Rejected",
        "DHA Applied",
        "DHA Approved",
        "DHA Rejected",
        "BeforeWeekOffAbsent", "AfterWeekOffAbsent", "HALOP", "On - ClockOut",
        "Auto Mis - ClockOut", "Pending", "Present", "Absent",
        "Week Off", "Mis - ClockOut", "Holiday", "Leave", "FLOP", "BeforeWeekOffLeave", "AfterWeekOffLeave", "L.W.P Approved", "L.W.P Applied", "L.W.P Rejected"]

    //get all Sub vendormasters.
    const fetchAttedanceStatus = async () => {
        setPageName(!pageName)
        const rearr = [];
        const perarr = [];
        try {
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_type = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            const uniqueNamesWithIds = new Map();

            res_vendor?.data?.attendancestatus.forEach((item) => {
                uniqueNamesWithIds.set(item.name, item._id);
            });

            const formattedArray = Array.from(uniqueNamesWithIds).map(
                ([name, _id]) => ({
                    label: name,
                    value: name,
                    _id: _id,
                })
            );

            let leavestatusarr = ["Applied", "Approved", "Rejected"];
            let leavestatushp = ["DHA", "DHB", "HA", "HB", "DL"];
            res_type?.data?.leavetype.forEach((data, index) => {
                let resdata = leavestatusarr.map((leavestatus, i) => {
                    rearr.push(data.code + " " + leavestatus)
                })
            })
            res_type?.data?.leavetype.forEach((data, index) => {
                let resdata = leavestatusarr.map((leavestatus, i) => {
                    let resleave = leavestatushp.map((red, rindex) => {
                        perarr.push(`${red} - ${data.code} ${leavestatus}`)
                    })

                })
            })
            let sumresclockin = [...clockInOpt, ...rearr, ...perarr]
            let finalresclockin = sumresclockin.map((t) => ({
                ...t,
                label: t,
                value: t
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })
            let sumresclockout = [...clockOutOpt, ...rearr, ...perarr]
            let finalresclockout = sumresclockout.map((t) => ({
                ...t,
                label: t,
                value: t
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })

            const finalOptions = [...formattedArray, ...finalresclockin, ...finalresclockout]

            // Remove duplicates
            const uniqueFinalOptions = finalOptions.filter(
                (option, index, self) =>
                    index === self.findIndex((o) => o.label === option.label && o.value === option.value)
            );

            setAttStatus(res_vendor?.data?.attendancestatus);
            // setAttStatusOptionDropdown(formattedArray);
            setAttStatusOptionDropdown(uniqueFinalOptions);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        setValueCompany(
            company.map((a, index) => {
                return a.value;
            })
        );
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
        setValueBranch(
            branch.map((a, index) => {
                return a.value;
            })
        );
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
        setValueUnit(
            unit.map((a, index) => {
                return a.value;
            })
        );
        const team = allTeam
            ?.filter(val =>
                company.some(comp => comp.value === val.company) &&
                branch.some(br => br.value === val.branch) &&
                unit.some(uni => uni.value === val.unit)
            )
            .map(data => ({
                label: data.teamname,
                value: data.teamname,
            }));
        setSelectedTeam(team);
        setValueTeam(team.map(a => a.value));
        const allemployees = allUsersLimit?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch) && unit?.map(comp => comp.value === val.unit) && team.map(team => team.value === val.team)
        )?.map(data => ({
            label: data.companyname,
            value: data.companyname,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedEmp(allemployees);
        setValueEmp(
            allemployees.map((a, index) => {
                return a.value;
            })
        );
    }, [isAssignBranch])

    //company multiselect
    const handleCompanyChange = (options) => {
        setValueCompany(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedCompany(options);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedDep([]);
        setValueDep([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branchto multiselect dropdown changes
    const handleBranchChange = (options) => {
        setSelectedBranch(options);
        setValueBranch(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedUnit([]);
        setValueUnit([]);
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setSelectedDep([]);
        setValueDep([]);
    };

    const customValueRendererBranch = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    // unitto multiselect dropdown changes
    const handleUnitChange = (options) => {
        setSelectedUnit(options);
        setValueUnit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };
    const customValueRendererUnit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //Teamto multiselect dropdown changes
    const handleTeamChange = (options) => {
        setSelectedTeam(options);
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedEmp([]);
    };
    const customValueRendererTeam = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    // Employee    
    const handleEmployeeChange = (options) => {
        setSelectedEmp(options);
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );
    };
    const customValueRendererEmp = (valueCate, _employees) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    // Department
    const handleDepartmentChange = (options) => {
        setSelectedDep(options);
        setValueDep(
            options.map((a, index) => {
                return a.value;
            })
        );
    };

    const customValueRendererDepartment = (valueDep, _categoryname) => {
        return valueDep?.length
            ? valueDep.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };

    //status multiselect
    const [selectedOptionsStatus, setSelectedOptionsStatus] = useState([]);
    let [valueStatusCat, setValueStatusCat] = useState([]);

    const handleStatusChange = (options) => {
        setValueStatusCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsStatus(options);
    };

    const customValueRendererStatus = (valueStatusCat, _categoryname) => {
        return valueStatusCat?.length
            ? valueStatusCat.map(({ label }) => label)?.join(", ")
            : "Please Select Status";
    };

    const getattendancestatus = (alldata) => {
        let result = attStatus.filter((data, index) => {
            return (
                data?.clockinstatus === alldata?.clockinstatus &&
                data?.clockoutstatus === alldata?.clockoutstatus
            );
        });

        return result[0]?.name;
    };

    const getAttModePaidPresent = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.paidleave === true ? 'YES' : 'No';
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
        fetchAttMode();
    }, []);

    const fetchFilteredUsersStatus = async () => {
        setUserShifts([]);
        setLoader(true);
        setPageAttReview(1);
        setPageSizeAttReview(10);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + "-" + mm + "-" + dd;

        let endMonthDate = new Date(filterUser.todate);
        let startMonthDate = new Date(filterUser.fromdate);
        let endmonth = endMonthDate;

        const daysArray = [];
        while (startMonthDate <= endmonth) {
            const formattedDate = `${String(startMonthDate.getDate()).padStart(
                2,
                "0"
            )}/${String(startMonthDate.getMonth() + 1).padStart(
                2,
                "0"
            )}/${startMonthDate.getFullYear()}`;
            const dayName = startMonthDate.toLocaleDateString("en-US", {
                weekday: "long",
            });
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

            daysArray.push({
                formattedDate,
                dayName,
                dayCount,
                shiftMode,
                weekNumberInMonth,
            });

            // Move to the next day
            startMonthDate.setDate(startMonthDate.getDate() + 1);
        }

        try {

            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
            });

            let leaveresult = res_applyleave?.data?.applyleaves;

            let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_INDIVIDUAL_TYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                // company: [...valueCompany],
                // branch: [...valueBranch],
                // unit: [...valueUnit],
                // employee: [...valueEmp],
                // department: [...valueDep]
                type: filterUser.filtertype,
                company: [...valueCompany],
                branch: [...valueBranch],
                unit: [...valueUnit],
                team: [...valueTeam],
                employee: [...valueEmp],
                department: [...valueDep],
                assignbranch: accessbranch,
            });

            // console.log(res_emp?.data?.users.length, 'userResult')

            function splitArray(array, chunkSize) {
                const resultarr = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                    const chunk = array.slice(i, i + chunkSize);
                    resultarr.push({
                        data: chunk,
                    });
                }
                return resultarr;
            }

            let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map(item => item.companyname))] : []
            const resultarr = splitArray(employeelistnames, 10);
            // console.log(resultarr.length, 'resultarr')

            async function sendBatchRequest(batch) {
                try {
                    let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER_DATEWISE, {
                        employee: batch.data,
                        userDates: daysArray,
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    })

                    const filteredBatch = res?.data?.finaluser?.filter(d => {
                        const [day, month, year] = d.rowformattedDate.split("/");
                        const formattedDate = new Date(`${year}-${month}-${day}`);
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

                    let filtered = valueDep.length > 0 ? (filteredBatch?.filter((data) => valueDep.includes(data.department))) : filteredBatch;

                    let countByEmpcodeClockin = {}; // Object to store count for each empcode
                    let countByEmpcodeClockout = {};

                    const result = filtered?.map((item, index) => {
                        // Initialize count for empcode if not already present
                        if (!countByEmpcodeClockin[item.empcode]) {
                            countByEmpcodeClockin[item.empcode] = 1;
                        }
                        if (!countByEmpcodeClockout[item.empcode]) {
                            countByEmpcodeClockout[item.empcode] = 1;
                        }

                        // Adjust clockinstatus based on lateclockincount
                        let updatedClockInStatus = item.clockinstatus;
                        // Adjust clockoutstatus based on earlyclockoutcount
                        let updatedClockOutStatus = item.clockoutstatus;

                        // Filter out only 'Absent' items for the current employee
                        const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

                        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                        if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                            // Define the date format for comparison
                            const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                            const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                            const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

                            const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                            const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

                            if (isPreviousDayLeave) {
                                updatedClockInStatus = 'BeforeWeekOffLeave';
                                updatedClockOutStatus = 'BeforeWeekOffLeave';
                            }
                            if (isPreviousDayAbsent) {
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
                        }

                        // Check if 'Late - ClockIn' count exceeds the specified limit
                        if (updatedClockInStatus === 'Late - ClockIn') {
                            updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                            countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
                        }
                        // Check if 'Early - ClockOut' count exceeds the specified limit
                        if (updatedClockOutStatus === 'Early - ClockOut') {
                            updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                            countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
                        }

                        return {
                            ...item,
                            clockinstatus: updatedClockInStatus,
                            clockoutstatus: updatedClockOutStatus,
                        };
                    });

                    return result;

                } catch (err) {
                    console.error("Error in POST request for batch:", batch.data, err);
                }
            }

            async function getAllResults() {
                let allResults = [];
                for (let batch of resultarr) {
                    const finaldata = await sendBatchRequest(batch);
                    allResults = allResults.concat(finaldata);
                }

                return { allResults }; // Return both results as an object
            }

            getAllResults().then(async (results) => {

                // const updateResult = results.allResults.filter((item) => item !== null)?.map((data) => {
                //   data.attendancestatus === ""
                //     ? (data.attendancestatus = getattendancestatus(data) === undefined ? "No Status" : getattendancestatus(data))
                //     : (data.attendancestatus = data.attendancestatus);
                //   return data;
                // });

                const itemsWithSerialNumber = results.allResults.filter((item) => item !== null)?.map((item, index) => (
                    {
                        ...item,
                        attendance: getattendancestatus(item),
                        attendancestatus: item.attendancestatus ? item.attendancestatus : getattendancestatus(item),
                        paidpresentbefore: getAttModePaidPresent(item.attendancestatus ? item.attendancestatus : getattendancestatus(item)),
                        paidleavetype: getAttModePaidPresentType(item.attendancestatus ? item.attendancestatus : getattendancestatus(item)),
                        paidpresent: getFinalPaid(
                            getAttModePaidPresent(item.attendancestatus ? item.attendancestatus : getattendancestatus(item)),
                            getAttModePaidPresentType(item.attendancestatus ? item.attendancestatus : getattendancestatus(item))
                        ),
                    }
                ));

                const weekOption = ['BeforeWeekOffAbsent', 'AfterWeekOffAbsent', 'BeforeWeekOffLeave', 'AfterWeekOffLeave'];
                itemsWithSerialNumber.forEach((item, index, array) => {
                    console.log(item.attendancestatus)
                    if (attStatusOption.includes(item.attendancestatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "YES - Full Day") {
                        const previousItem = array[index - 1];
                        const nextItem = array[index + 1];

                        const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off");

                        if (hasRelevantStatus(previousItem)) {
                            previousItem.clockinstatus = 'Week Off';
                            previousItem.clockoutstatus = 'Week Off';
                            previousItem.attendance = getattendancestatus(previousItem);
                            previousItem.attendancestatus = previousItem.attendancestatus ? previousItem.attendancestatus : getattendancestatus(previousItem);
                            previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendancestatus ? previousItem.attendancestatus : getattendancestatus(previousItem));
                            previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendancestatus ? previousItem.attendancestatus : getattendancestatus(previousItem));
                            previousItem.paidpresent = getFinalPaid(
                                getAttModePaidPresent(previousItem.attendancestatus ? previousItem.attendancestatus : getattendancestatus(previousItem)),
                                getAttModePaidPresentType(previousItem.attendancestatus ? previousItem.attendancestatus : getattendancestatus(previousItem))
                            );
                        }
                        if (hasRelevantStatus(nextItem)) {
                            console.log(nextItem.attendancestatus, 'befor')
                            nextItem.clockinstatus = 'Week Off';
                            nextItem.clockoutstatus = 'Week Off';
                            nextItem.attendance = getattendancestatus(nextItem);
                            nextItem.attendancestatus = nextItem.attendancestatus ? nextItem.attendancestatus : getattendancestatus(nextItem);
                            nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendancestatus ? nextItem.attendancestatus : getattendancestatus(nextItem));
                            nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendancestatus ? nextItem.attendancestatus : getattendancestatus(nextItem));
                            nextItem.paidpresent = getFinalPaid(
                                getAttModePaidPresent(nextItem.attendancestatus ? nextItem.attendancestatus : getattendancestatus(nextItem)),
                                getAttModePaidPresentType(nextItem.attendancestatus ? nextItem.attendancestatus : getattendancestatus(nextItem))
                            );
                            console.log(nextItem.attendancestatus, 'after')
                        }
                    }
                })

                let resultdata = itemsWithSerialNumber.filter((item) => {
                    // item.clockin !== "00:00:00" &&
                    const clockoutText = item.clockoutstatus.replace(/^\d+/, '').trim();
                    if (valueStatusCat?.includes(item.attendancestatus)) {
                        return item;
                    }
                    else if (valueStatusCat?.includes(item.clockinstatus)) {
                        return item;
                    }
                    else if (valueStatusCat?.includes(clockoutText)) {
                        return item;
                    }
                }).map((item, index) => {
                    return {
                        ...item, serialNumber: index + 1,
                        // attendance: getattendancestatus(item) === undefined ? "No Status" : getattendancestatus(item)
                    };
                });
                setUserShifts(resultdata);
                setSearchQueryAttReview("");
                setTotalPagesAttReview(Math.ceil(resultdata.length / pageSizeAttReview));
                setLoader(false);
            }).catch(error => {
                setLoader(true);
                console.error('Error in getting all results:', error);
            });
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        setFilteredDataItems(userShifts);
    }, [userShifts])

    const handleSubmit = (e) => {
        if (filterUser.filtertype === "Please Select Filter Type" || filterUser.filtertype === "" || filterUser.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedCompany?.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(filterUser.filtertype) && selectedBranch.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(filterUser.filtertype) && selectedUnit.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team"]?.includes(filterUser.filtertype) && selectedTeam.length === 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual"]?.includes(filterUser.filtertype) && selectedEmp.length === 0) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Department"]?.includes(filterUser.filtertype) && selectedDep.length === 0) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (filterUser.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            setLoader(false);
            fetchFilteredUsersStatus();
        }
    };

    const handleClear = async (e) => {
        e.preventDefault();
        setUserShifts([]);
        setFilterUser({
            filtertype: "Individual",
            fromdate: moment(cuurentDate).format("YYYY-MM-DD"),
            todate: moment(cuurentDate).format("YYYY-MM-DD"),
            attendancestatus: "Please Select Attendance Status",
        });
        setSelectedMode("Today");
        // document.getElementById("to-date").min = moment(cuurentDate).format("YYYY-MM-DD");
        setSelectedCompany([]);
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedDep([]);
        setSelectedEmp([]);
        setValueCompany([]);
        setValueBranch([]);
        setValueUnit([]);
        setValueTeam([])
        setValueDep([]);
        setValueEmp([]);
        setValueStatusCat([]);
        setSelectedOptionsStatus([]);
        setPageAttReview(1);
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
                    filteredData.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableAttReview.current) {
            const gridApi = gridRefTableAttReview.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesAttReview = gridApi.paginationGetTotalPages();
            setPageAttReview(currentPage);
            setTotalPagesAttReview(totalPagesAttReview);
        }
    }, []);

    const columnDataTableAttReview = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAttReview.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityAttReview.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityAttReview.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibilityAttReview.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibilityAttReview.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibilityAttReview.unit, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibilityAttReview.department, headerClassName: "bold-header", },
        { field: "date", headerName: "Date", flex: 0, width: 110, hide: !columnVisibilityAttReview.date, headerClassName: "bold-header", },
        { field: "shift", headerName: "Shift Name", flex: 0, width: 150, hide: !columnVisibilityAttReview.shift, headerClassName: "bold-header", },
        { field: "clockinstatus", headerName: "Clock In Status", flex: 0, width: 150, hide: !columnVisibilityAttReview.clockinstatus, headerClassName: "bold-header", },
        { field: "clockoutstatus", headerName: "Clock Out Status", flex: 0, width: 150, hide: !columnVisibilityAttReview.clockoutstatus, headerClassName: "bold-header", },
        {
            field: "attendance",
            headerName: "Mode",
            flex: 0,
            width: 120,
            hide: !columnVisibilityAttReview.attendance,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return (
                    <Grid sx={{ display: 'flex' }}>
                        <Button
                            size="small"
                            sx={{
                                marginTop: '10px',
                                textTransform: "capitalize",
                                borderRadius: "4px",
                                boxShadow: "none",
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: "400",
                                fontSize: "0.575rem",
                                lineHeight: "1.43",
                                letterSpacing: "0.01071em",
                                display: "flex",
                                padding: "3px 8px",
                                cursor: "default",
                                color: "#052106",
                                backgroundColor: "rgb(156 239 156)",
                            }}
                        >
                            {params.data.attendance}
                        </Button>
                    </Grid>
                );
            },
        },
        { field: "attendancestatus", headerName: "Attendance Status", flex: 0, width: 180, hide: !columnVisibilityAttReview.attendancestatus, headerClassName: "bold-header", },
    ];

    //Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryAttReview(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = userShifts?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageAttReview(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = userShifts?.filter((item) => {
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
        // handleCloseSearchAttReview(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryAttReview("");
        setFilteredDataItems(userShifts);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableAttReview.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryAttReview;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAttReview) {
            setPageAttReview(newPage);
            gridRefTableAttReview.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAttReview(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityAttReview };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAttReview(updatedVisibility);
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableAttReview.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageAttReview.toLowerCase())
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

        setColumnVisibilityAttReview((prevVisibility) => {
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

        setColumnVisibilityAttReview((prevVisibility) => {
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
        setColumnVisibilityAttReview((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('')
    let exportColumnNamescrt = ["Emp Code", "Employee Name", "Company", "Branch", "Unit", "Department", "Date", "Shift Name", "Clock In Status", "Clock Out Status", "Mode", "Attendance Status",]
    let exportRowValuescrt = ["empcode", "username", "company", "branch", "unit", "department", "date", "shift", "clockinstatus", "clockoutstatus", "attendance", "attendancestatus",]

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Attendance Review",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageAttReview.current) {
            domtoimage.toBlob(gridRefImageAttReview.current)
                .then((blob) => {
                    saveAs(blob, "Attendance Review.png");
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

        const startPage = Math.max(1, pageAttReview - 1);
        const endPage = Math.min(totalPagesAttReview, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageAttReview numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageAttReview, show ellipsis
        if (endPage < totalPagesAttReview) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageAttReview - 1) * pageSizeAttReview, pageAttReview * pageSizeAttReview);
    const totalPagesAttReviewOuter = Math.ceil(filteredDataItems?.length / pageSizeAttReview);
    const visiblePages = Math.min(totalPagesAttReviewOuter, 3);
    const firstVisiblePage = Math.max(1, pageAttReview - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttReviewOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAttReview * pageSizeAttReview;
    const indexOfFirstItem = indexOfLastItem - pageSizeAttReview;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"ATTENDANCE REVIEW"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Attendance Review"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Review"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lattendancereview") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography sx={userStyle.importheadtext}>Attendance Review</Typography>
                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      options={modeOptions}
                      styles={colourStyles}
                      value={{ label: filterUser.mode, value: filterUser.mode }}
                      onChange={(e) => {
                        setFilterUser({ ...filterUser, mode: e.value, });
                        setSelectedDep([]);
                        setValueDep([]);
                        setSelectedEmp([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedBranch}
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
                      Unit<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        options={[
                                            { label: "Individual", value: "Individual" },
                                            { label: "Company", value: "Company" },
                                            { label: "Branch", value: "Branch" },
                                            { label: "Unit", value: "Unit" },
                                            { label: "Team", value: "Team" },
                                            { label: "Department", value: "Department" },
                                        ]}
                                        styles={colourStyles}
                                        value={{ label: filterUser.filtertype, value: filterUser.filtertype, }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, filtertype: e.value });
                                            setSelectedCompany([]);
                                            setValueCompany([]);
                                            setSelectedBranch([]);
                                            setValueBranch([]);
                                            setSelectedUnit([]);
                                            setValueUnit([]);
                                            setSelectedTeam([]);
                                            setValueTeam([]);
                                            setSelectedEmp([]);
                                            setValueEmp([]);
                                            setSelectedDep([]);
                                            setValueDep([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedCompany}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            {["Individual", "Team"]?.includes(filterUser.filtertype) ? <>
                                {/* Branch Unit Team */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedBranch}
                                            onChange={handleBranchChange}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedUnit}
                                            onChange={handleUnitChange}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Team<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={allTeam
                                                ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                                                .map((u) => ({
                                                    ...u,
                                                    label: u.teamname,
                                                    value: u.teamname,
                                                }))}
                                            value={selectedTeam}
                                            onChange={handleTeamChange}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                                : ["Branch"]?.includes(filterUser.filtertype) ?
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            valueCompany?.includes(comp.company)
                                                    )?.map(data => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedBranch}
                                                    onChange={handleBranchChange}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                    :
                                    ["Unit"]?.includes(filterUser.filtertype) ?
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
                                                            (comp) =>
                                                                valueCompany?.includes(comp.company)
                                                        )?.map(data => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedBranch}
                                                        onChange={handleBranchChange}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
                                                            (comp) =>
                                                                valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                                        )?.map(data => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedUnit}
                                                        onChange={handleUnitChange}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                        : ["Individual", "Department"]?.includes(filterUser.filtertype) ?
                                            <>
                                                {/* Department */}
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Department<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={alldepartment?.map(data => ({
                                                                label: data.deptname,
                                                                value: data.deptname,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedDep}
                                                            onChange={(e) => {
                                                                handleDepartmentChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererDepartment}
                                                            labelledBy="Please Select Department"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : ""
                            }
                            {["Individual"]?.includes(filterUser.filtertype) &&
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={allUsersLimit?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && selectedBranch?.map(data => data.value)?.includes(comp.branch) && selectedUnit?.map(data => data.value)?.includes(comp.unit) && selectedTeam?.map(data => data.value)?.includes(comp.team)
                                            )?.map(data => ({
                                                label: data.companyname,
                                                value: data.companyname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedEmp}
                                            onChange={(e) => { handleEmployeeChange(e); }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Employee"
                                        />
                                    </FormControl>
                                </Grid>}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        Attendance Status<b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <MultiSelect
                                        options={attStatusOptionDropdown}
                                        value={selectedOptionsStatus}
                                        onChange={(e) => {
                                            handleStatusChange(e);
                                        }}
                                        valueRenderer={customValueRendererStatus}
                                        labelledBy="Please Select Status"
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
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        From Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="from-date"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.fromdate}
                                        onChange={(e) => {
                                            setFilterUser({
                                                ...filterUser,
                                                fromdate: e.target.value,
                                                todate: "",
                                            });
                                            // document.getElementById("to-date").min = e.target.value;
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="to-date"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.todate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                                            if (filterUser.fromdate == "") {
                                                setShowAlert(
                                                    <>
                                                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please Select From date`}</p>
                                                    </>
                                                );
                                                handleClickOpenerr();
                                            } else if (selectedDate < fromdateval) {
                                                setFilterUser({ ...filterUser, todate: "" });
                                                setShowAlert(
                                                    <>
                                                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                                                    </>
                                                );
                                                handleClickOpenerr();
                                            } else if (selectedDate <= currentDate) {
                                                setFilterUser({ ...filterUser, todate: selectedDate });
                                            } else {
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                    />
                                </FormControl>
                            </Grid>
                            {/* {filterUser.mode === 'Department' ?
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Department<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <MultiSelect
                        options={alldepartment?.map(data => ({
                          label: data.deptname,
                          value: data.deptname,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedDep}
                        onChange={(e) => {
                          handleDepartmentChange(e);
                        }}
                        valueRenderer={customValueRendererDepartment}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                  </Grid>
                  : null}
                {filterUser.mode === 'Employee' ?
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allUsersLimit?.filter(
                          (comp) =>
                            valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit)
                        )?.map(data => ({
                          label: data.companyname,
                          value: data.companyname,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedEmp}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmp}
                        labelledBy="Please Select Employee"
                      />
                    </FormControl>
                  </Grid>
                  : null} */}
                        </Grid>
                        <Grid container spacing={1}>
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
                    </Box> <br />
                    {/* ****** Table Start ****** */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                {" "}
                                Attendance Review List{" "}
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeAttReview}
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
                                        <MenuItem value={userShifts?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelattendancereview") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvattendancereview") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printattendancereview") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleprint}
                                            >
                                                {" "}
                                                &ensp; <FaPrint /> &ensp;Print&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfattendancereview") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageattendancereview") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttReview} />
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
                        </Grid> <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttReview} > Manage Columns </Button><br /><br />
                        {loader ? (
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
                        ) : (
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttReview} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableAttReview.filter((column) => columnVisibilityAttReview[column.field])}
                                        ref={gridRefTableAttReview}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeAttReview}
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
                        (filteredDataItems.length > 0 ? (pageAttReview - 1) * pageSizeAttReview + 1 : 0)
                      ) : (
                        filteredRowData.length > 0 ? (pageAttReview - 1) * pageSizeAttReview + 1 : 0
                      )
                    }{" "}to{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        Math.min(pageAttReview * pageSizeAttReview, filteredDataItems.length)
                      ) : (
                        filteredRowData.length > 0 ? Math.min(pageAttReview * pageSizeAttReview, filteredRowData.length) : 0
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
                    <Button onClick={() => handlePageChange(1)} disabled={pageAttReview === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                    <Button onClick={() => handlePageChange(pageAttReview - 1)} disabled={pageAttReview === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
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
                        className={pageAttReview === pageNumber ? "active" : ""}
                        disabled={pageAttReview === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(pageAttReview + 1)} disabled={pageAttReview === totalPagesAttReview} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                    <Button onClick={() => handlePageChange(totalPagesAttReview)} disabled={pageAttReview === totalPagesAttReview} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                  </Box>
                </Box> */}
                            </>
                        )}
                    </Box>
                    {/* ****** Table End ****** */}
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idAttReview}
                open={isManageColumnsOpenAttReview}
                anchorEl={anchorElAttReview}
                onClose={handleCloseManageColumnsAttReview}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAttReview}
                    searchQuery={searchQueryManageAttReview}
                    setSearchQuery={setSearchQueryManageAttReview}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityAttReview}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityAttReview}
                    initialColumnVisibility={initialColumnVisibilityAttReview}
                    columnDataTable={columnDataTableAttReview}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAttReview}
                open={openSearchAttReview}
                anchorEl={anchorElSearchAttReview}
                onClose={handleCloseSearchAttReview}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAttReview} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttReview} handleCloseSearch={handleCloseSearchAttReview} />
            </Popover>

            {/* Alert  */}
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
                itemsTwo={userShifts ?? []}
                filename={"Attendance Review"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default AttendanceReview;