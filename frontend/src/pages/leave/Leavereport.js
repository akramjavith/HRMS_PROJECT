import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
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

function LeaveReportList() {

    const gridRefTableLeaveReport = useRef(null);
    const gridRefImageLeaveReport = useRef(null);

    const currentDateAttStatus = new Date();
    const currentYearAttStatus = currentDateAttStatus.getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
    const currentYearObject = { label: currentYearAttStatus, value: currentYearAttStatus };
    const years = Array.from(new Array(10), (val, index) => currentYearAttStatus - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [leaveTypeOption, setLeaveTypeOption] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);

    const [filterUser, setFilterUser] = useState({ company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", employee: 'Please Select Employee', leavetype: "Please Select Leave Type", });
    const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject });

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(allUsers);
    const [filteredRowData, setFilteredRowData] = useState([]);

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

    //get all months
    const months = [
        { value: 1, label: "January", },
        { value: 2, label: "February", },
        { value: 3, label: "March", },
        { value: 4, label: "April", },
        { value: 5, label: "May", },
        { value: 6, label: "June", },
        { value: 7, label: "July", },
        { value: 8, label: "August", },
        { value: 9, label: "September", },
        { value: 10, label: "October", },
        { value: 11, label: "November", },
        { value: 12, label: "December" },
    ];

    // Datatable
    const [pageLeaveReport, setPageLeaveReport] = useState(1);
    const [pageSizeLeaveReport, setPageSizeLeaveReport] = useState(10);
    const [searchQueryLeaveReport, setSearchQueryLeaveReport] = useState("");
    const [totalPagesLeaveReport, setTotalPagesLeaveReport] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

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
    const [isManageColumnsOpenLeaveReport, setManageColumnsOpenLeaveReport] = useState(false);
    const [anchorElLeaveReport, setAnchorElLeaveReport] = useState(null);
    const [searchQueryManageLeaveReport, setSearchQueryManageLeaveReport] = useState("");
    const handleOpenManageColumnsLeaveReport = (event) => {
        setAnchorElLeaveReport(event.currentTarget);
        setManageColumnsOpenLeaveReport(true);
    };
    const handleCloseManageColumnsLeaveReport = () => {
        setManageColumnsOpenLeaveReport(false);
        setSearchQueryManageLeaveReport("");
    };
    const openLeaveReport = Boolean(anchorElLeaveReport);
    const idLeaveReport = openLeaveReport ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchLeaveReport, setAnchorElSearchLeaveReport] = React.useState(null);
    const handleClickSearchLeaveReport = (event) => {
        setAnchorElSearchLeaveReport(event.currentTarget);
    };
    const handleCloseSearchLeaveReport = () => {
        setAnchorElSearchLeaveReport(null);
        setSearchQueryLeaveReport("");
    };

    const openSearchLeaveReport = Boolean(anchorElSearchLeaveReport);
    const idSearchLeaveReport = openSearchLeaveReport ? 'simple-popover' : undefined;

    const handleGetMonth = (e) => {
        const selectedMonthObject = months.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, ismonth: selectedMonthObject });
    }
    const handleGetYear = (e) => {
        const selectedYearObject = getyear.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, isyear: selectedYearObject });
    }

    // Show All Columns & Manage Columns
    const initialColumnVisibilityLeaveReport = {
        checkbox: true,
        serialNumber: true,
        employeeid: true,
        employeename: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        leavetype: true,
        eligible: true,
        startsfrom: true,
        pendingleave: true,
        currentmonthcount: true,
        availabledays: true,
        appliedleave: true,
        approvedleave: true,
        rejectedleave: true,
        balancecount: true,
    };
    const [columnVisibilityLeaveReport, setColumnVisibilityLeaveReport] = useState(initialColumnVisibilityLeaveReport);

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

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
        getapi();
    }, []);

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
        setSelectedOptionsCompany(company);
        setValueCompanyCat(
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
        setSelectedOptionsBranch(branch);
        setValueBranchCat(
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
        setSelectedOptionsUnit(unit);
        setValueUnitCat(
            unit.map((a, index) => {
                return a.value;
            })
        );
    }, [isAssignBranch])

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Leave Report"),
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

    const fetchEmployee = async () => {
        setPageName(!pageName)
        try {
            let res_emp = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setEmployeeOptions([
                ...res_emp?.data?.users?.map((t) => ({
                    ...t,
                    label: t.companyname,
                    value: t.companyname,
                })),
            ]);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

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
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
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

    useEffect(() => {
        fetchEmployee();
    }, []);

    //get all leave types.
    const fetchLeaveTypesAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeaveTypeOption([
                ...res?.data?.leavetype
                    ?.map((t) => ({
                        ...t,
                        label: t.leavetype,
                        value: t.leavetype,
                    })),
            ]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchLeaveTypesAll();
    }, [])

    const fetchLeaveCriteria = async (user, empdoj, selectedYear, selectedMonth, departmentMonthSetDataPre, total, finalanswer, filteredData, leavetype, finalanswerApplied, finalanswerApproved, finalanswerRejected) => {
        user.leavetype = leavetype;
        let currentDate = new Date();
        let doj = new Date(empdoj);
        let monthsDiff = (selectedYear - doj.getFullYear()) * 12 + ((selectedMonth - 1) - doj.getMonth());
        let yearsDiff = selectedYear - doj.getFullYear();

        filteredData?.forEach((d) => {
            let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : '';
            let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : '';

            let previousYearData = departmentMonthSetDataPre?.filter((dep) => {
                if (Number(dep.year) === comparedYear) {
                    return dep;
                }
            });

            // check the experience month is completed or not
            let comparedMonthValue = ((`${d.experience} ${d.experiencein}` === '1 Month') ? 1 :
                (`${d.experience} ${d.experiencein}` === '2 Month') ? 2 :
                    (`${d.experience} ${d.experiencein}` === '3 Month') ? 3 :
                        (`${d.experience} ${d.experiencein}` === '4 Month') ? 4 :
                            (`${d.experience} ${d.experiencein}` === '5 Month') ? 5 :
                                (`${d.experience} ${d.experiencein}` === '6 Month') ? 6 :
                                    0);

            // Calculate the year difference
            let comparedYearValue = ((`${d.experience} ${d.experiencein}` === '1 Year') ? 1 :
                (`${d.experience} ${d.experiencein}` === '2 Year') ? 2 :
                    (`${d.experience} ${d.experiencein}` === '3 Year') ? 3 :
                        (`${d.experience} ${d.experiencein}` === '4 Year') ? 4 :
                            (`${d.experience} ${d.experiencein}` === '5 Year') ? 5 :
                                (`${d.experience} ${d.experiencein}` === '6 Year') ? 6 :
                                    0);

            let yearStartDate = total[0].fromdate;
            let yearEndDate = total[total.length - 1].todate;

            let lastYearStartDate = previousYearData.length > 0 ? previousYearData[0].fromdate : '';
            let lastYearEndDate = previousYearData.length > 0 ? previousYearData[previousYearData.length - 1].todate : '';

            // check auto increase
            if (d.leaveautocheck === true && d.leaveautodays === 'Month') {
                // Applicable From
                if (d.experiencein === 'Month' && monthsDiff < comparedMonthValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else if (d.experiencein === 'Year' && yearsDiff < comparedYearValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else {

                    // To get Previous year's leave count
                    let withinRangeCountLastYear = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');

                            const date = new Date(`${month}/${day}/${year}`);

                            // Convert yearStartDate and yearEndDate to Date objects if they're not already
                            const startDate = new Date(lastYearStartDate);
                            const endDate = new Date(lastYearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate) {
                                // Increment the counter if date is within the range
                                withinRangeCountLastYear++;
                            }
                        });
                    });

                    // findout previous month's all leave count
                    let withinRangeCount = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCount++;
                            }
                        });
                    });

                    let withinRangeCountPreviousReject = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Rejected") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousReject++;
                            }
                        });
                    });

                    let withinRangeCountPreviousApplied = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Applied") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousApplied++;
                            }
                        });
                    });

                    // findout current month's applied leave count
                    let withinRangeCountApplied = 0;
                    finalanswerApplied.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApplied++;
                            } else {
                            }
                        });
                    });

                    // findout current month's approve leave count
                    let withinRangeCountApproved = 0;
                    finalanswerApproved.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApproved++;
                            }
                        });
                    });

                    // findout current month's reject leave count
                    let withinRangeCountReject = 0;
                    finalanswerRejected.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountReject++;
                            }
                        });
                    });

                    const currentYear = selectedYear;
                    const currentMonth = selectedMonth - 1;

                    const doj = new Date(empdoj);
                    const dojYear = doj.getFullYear();
                    const dojMonth = doj.getMonth();
                    const dojDate = doj.getDate();

                    let totalAvailableDaysLastYear = 0;
                    const lastYear = selectedYear - 1;

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassedLastYear) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = (dojMonth + leaveAutoIncreaseLastYear);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            if (currentDate.getDate() > dojDate) {
                                totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            }
                        }
                    }
                    else {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                        else if (oneMonthPassedLastYear) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(dojMonth + leaveAutoIncreaseLastYear);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                    }

                    let finalleaveremovedtotaldays = totalAvailableDaysLastYear - withinRangeCountLastYear;

                    // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                    let totalAvailableDays = 0; // till the current month count
                    let currentMonthDays = 0 // per months count

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassed) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const pendingFromMonth = dojMonth + leaveAutoIncrease;

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }

                            // if (currentDate.getDate() > dojDate) {
                            //     currentMonthDays -= (currentDate.getDate() - dojDate);
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 2) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }
                        }
                        else if (oneMonthPassed) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(dojMonth + leaveAutoIncrease);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }

                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 3) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname + 1);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < selectedMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= selectedMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[selectedMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            // Calculate the month index to check if it's a valid month for counting leave
                            const monthIndexToCheck = (currentMonth + 1) % leaveAutoIncrease; // Adding 1 to currentMonth because months are 0-indexed

                            // Check if the current month is within the leaveautoincrease period
                            if (monthIndexToCheck === 0) {
                                // If the current month is a valid month within the leaveautoincrease period,
                                // count leave days for this month
                                currentMonthDays = numberofdays;
                            }
                        }

                    }

                    let remainingLeaveDays = totalAvailableDays;

                    // If pendingleave is true, add the remaining days from the previous year to the total available days
                    if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                        remainingLeaveDays += finalleaveremovedtotaldays;
                    } else {
                        remainingLeaveDays = totalAvailableDays;
                    }

                    let finalRemainingLeaveDays = remainingLeaveDays < 0 ? 0 : remainingLeaveDays;

                    // Update the user object with the correct available days
                    user.eligible = 'Yes';
                    user.startsfrom = monthsDiff < 12 ? `${monthstring[dojMonth + parseInt(d.leaveautoincrease)]}/${dojYear}` : `${total[0].monthname}/${total[0].year}`;
                    // user.pendingleave = (currentMonth === currentDate.getMonth()) ? ((finalRemainingLeaveDays - currentMonthDays) - withinRangeCount) : (finalRemainingLeaveDays - currentMonthDays);
                    user.pendingleave = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied));
                    user.currentmonthcount = currentMonthDays;
                    user.availabledays = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays;
                    user.appliedleave = withinRangeCountApplied;
                    user.approvedleave = withinRangeCountApproved;
                    user.rejectedleave = withinRangeCountReject;
                    user.balancecount = (((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays) - withinRangeCountApproved;

                }
            }
            else if (d.leaveautocheck === true && d.leaveautodays === 'Year') {
                // Applicable From
                if (d.experiencein === 'Month' && monthsDiff < comparedMonthValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else if (d.experiencein === 'Year' && yearsDiff < comparedYearValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else {

                    // To get Previous year's leave count
                    let withinRangeCountLastYear = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');

                            const date = new Date(`${month}/${day}/${year}`);

                            // Convert yearStartDate and yearEndDate to Date objects if they're not already
                            const startDate = new Date(lastYearStartDate);
                            const endDate = new Date(lastYearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate) {
                                // Increment the counter if date is within the range
                                withinRangeCountLastYear++;
                            }
                        });
                    });

                    // findout previous month's all leave count
                    let withinRangeCount = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCount++;
                            }
                        });
                    });

                    let withinRangeCountPreviousReject = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Rejected") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousReject++;
                            }
                        });
                    });

                    let withinRangeCountPreviousApplied = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Applied") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousApplied++;
                            }
                        });
                    });

                    // findout current month's applied leave count
                    let withinRangeCountApplied = 0;
                    finalanswerApplied.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApplied++;
                            } else {
                            }
                        });
                    });

                    // findout current month's approve leave count
                    let withinRangeCountApproved = 0;
                    finalanswerApproved.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApproved++;
                            }
                        });
                    });

                    // findout current month's reject leave count
                    let withinRangeCountReject = 0;
                    finalanswerRejected.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountReject++;
                            }
                        });
                    });

                    const currentYear = selectedYear;
                    const currentMonth = selectedMonth - 1;

                    const doj = new Date(empdoj);
                    const dojYear = doj.getFullYear();
                    const dojMonth = doj.getMonth();
                    const dojDate = doj.getDate();

                    let totalAvailableDaysLastYear = 0;
                    const lastYear = selectedYear - 1;

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassedLastYear) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = (dojMonth + leaveAutoIncreaseLastYear);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            if (currentDate.getDate() > dojDate) {
                                totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            }
                        }
                    }
                    else {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                        else if (oneMonthPassedLastYear) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(dojMonth + leaveAutoIncreaseLastYear);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                    }

                    let finalleaveremovedtotaldays = totalAvailableDaysLastYear - withinRangeCountLastYear;

                    // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                    let totalAvailableDays = 0; // till the current month count
                    let currentMonthDays = 0 // per months count

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassed) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonth = (dojMonth + leaveAutoIncrease);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }
                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }

                            // if (currentDate.getDate() > dojDate) {
                            //     currentMonthDays -= (currentDate.getDate() - dojDate);
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 2) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }
                        }
                        else if (oneMonthPassed) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(dojMonth + leaveAutoIncrease);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }

                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 3) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname + 1);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < selectedMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= selectedMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[selectedMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            // Calculate the month index to check if it's a valid month for counting leave
                            const monthIndexToCheck = (currentMonth + 1) % leaveAutoIncrease; // Adding 1 to currentMonth because months are 0-indexed

                            // Check if the current month is within the leaveautoincrease period
                            if (monthIndexToCheck === 0) {
                                // If the current month is a valid month within the leaveautoincrease period,
                                // count leave days for this month
                                currentMonthDays = numberofdays;
                            }
                        }

                    }

                    let remainingLeaveDays = totalAvailableDays;

                    // If pendingleave is true, add the remaining days from the previous year to the total available days
                    if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                        remainingLeaveDays += finalleaveremovedtotaldays;
                    } else {
                        remainingLeaveDays = totalAvailableDays;
                    }

                    let finalRemainingLeaveDays = remainingLeaveDays < 0 ? 0 : remainingLeaveDays;

                    // Update the user object with the correct available days
                    user.eligible = 'Yes';
                    user.startsfrom = monthsDiff < 12 ? `${monthstring[dojMonth + parseInt(d.leaveautoincrease)]}/${dojYear}` : `${total[0].monthname}/${total[0].year}`;
                    // user.pendingleave = (currentMonth === currentDate.getMonth()) ? ((finalRemainingLeaveDays - currentMonthDays) - withinRangeCount) : (finalRemainingLeaveDays - currentMonthDays);
                    user.pendingleave = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied));
                    user.currentmonthcount = currentMonthDays;
                    user.availabledays = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays;
                    user.appliedleave = withinRangeCountApplied;
                    user.approvedleave = withinRangeCountApproved;
                    user.rejectedleave = withinRangeCountReject;
                    user.balancecount = (((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays) - withinRangeCountApproved;

                }
            }
            else if (d.leaveautocheck === false && (d.leaveautodays === 'Month' || d.leaveautodays === 'Year')) {
                // Applicable From
                if (d.experiencein === 'Month' && monthsDiff < comparedMonthValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else if (d.experiencein === 'Year' && yearsDiff < comparedYearValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else {

                    // To get Previous year's leave count
                    let withinRangeCountLastYear = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');

                            const date = new Date(`${month}/${day}/${year}`);

                            // Convert yearStartDate and yearEndDate to Date objects if they're not already
                            const startDate = new Date(lastYearStartDate);
                            const endDate = new Date(lastYearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate) {
                                // Increment the counter if date is within the range
                                withinRangeCountLastYear++;
                            }
                        });
                    });

                    // findout previous month's all leave count
                    let withinRangeCount = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCount++;
                            }
                        });
                    });

                    let withinRangeCountPreviousReject = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Rejected") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousReject++;
                            }
                        });
                    });

                    let withinRangeCountPreviousApplied = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Applied") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousApplied++;
                            }
                        });
                    });

                    // findout current month's applied leave count
                    let withinRangeCountApplied = 0;
                    finalanswerApplied.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApplied++;
                            } else {
                            }
                        });
                    });

                    // findout current month's approve leave count
                    let withinRangeCountApproved = 0;
                    finalanswerApproved.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApproved++;
                            }
                        });
                    });

                    // findout current month's reject leave count
                    let withinRangeCountReject = 0;
                    finalanswerRejected.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountReject++;
                            }
                        });
                    });

                    const currentYear = selectedYear;
                    const currentMonth = selectedMonth - 1;

                    const doj = new Date(empdoj);
                    const dojYear = doj.getFullYear();
                    const dojMonth = doj.getMonth();
                    const dojDate = doj.getDate();

                    let totalAvailableDaysLastYear = 0;
                    const lastYear = selectedYear - 1;

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassedLastYear) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = (dojMonth + leaveAutoIncreaseLastYear);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            if (currentDate.getDate() > dojDate) {
                                totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            }
                        }
                    }
                    else {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                        else if (oneMonthPassedLastYear) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(dojMonth + leaveAutoIncreaseLastYear);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                    }

                    let finalleaveremovedtotaldays = totalAvailableDaysLastYear - withinRangeCountLastYear;

                    // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                    let totalAvailableDays = 0; // till the current month count
                    let currentMonthDays = 0 // per months count

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassed) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonth = (dojMonth + leaveAutoIncrease);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }
                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }

                            // if (currentDate.getDate() > dojDate) {
                            //     currentMonthDays -= (currentDate.getDate() - dojDate);
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 2) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }
                        }
                        else if (oneMonthPassed) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(dojMonth + leaveAutoIncrease);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }

                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 3) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname + 1);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < selectedMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= selectedMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[selectedMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            // Calculate the month index to check if it's a valid month for counting leave
                            const monthIndexToCheck = (currentMonth + 1) % leaveAutoIncrease; // Adding 1 to currentMonth because months are 0-indexed

                            // Check if the current month is within the leaveautoincrease period
                            if (monthIndexToCheck === 0) {
                                // If the current month is a valid month within the leaveautoincrease period,
                                // count leave days for this month
                                currentMonthDays = numberofdays;
                            }
                        }

                    }

                    let remainingLeaveDays = totalAvailableDays;

                    // If pendingleave is true, add the remaining days from the previous year to the total available days
                    if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                        remainingLeaveDays += finalleaveremovedtotaldays;
                    } else {
                        remainingLeaveDays = totalAvailableDays;
                    }

                    let finalRemainingLeaveDays = remainingLeaveDays < 0 ? 0 : remainingLeaveDays;

                    // Update the user object with the correct available days
                    user.eligible = 'Yes';
                    user.startsfrom = monthsDiff < 12 ? `${monthstring[dojMonth + parseInt(d.leaveautoincrease)]}/${dojYear}` : `${total[0].monthname}/${total[0].year}`;
                    // user.pendingleave = (currentMonth === currentDate.getMonth()) ? ((finalRemainingLeaveDays - currentMonthDays) - withinRangeCount) : (finalRemainingLeaveDays - currentMonthDays);
                    user.pendingleave = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied));
                    user.currentmonthcount = currentMonthDays;
                    user.availabledays = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays;
                    user.appliedleave = withinRangeCountApplied;
                    user.approvedleave = withinRangeCountApproved;
                    user.rejectedleave = withinRangeCountReject;
                    user.balancecount = (((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays) - withinRangeCountApproved;

                }
            }

        });

        // Return the updated user object
        return user;
    };

    const fetchUsers = async () => {
        setPageName(!pageName)
        setLoader(true);
        try {
            let res_emp = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res_leavecriteria = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let departmentMonthSetData = res_status.data.departmentdetails;
            let applyleaveData = res_vendor?.data?.applyleaves;
            let leavecriteriaData = res_leavecriteria?.data?.leavecriterias;
            const users = res_emp?.data?.users || [];

            let filteredResult = await Promise.all(users
                ?.filter(d => {
                    return (
                        valueCompanyCat.includes(d.company) &&
                        valueBranchCat.includes(d.branch) &&
                        valueUnitCat.includes(d.unit) &&
                        valueEmployeeCat.includes(d.companyname)
                    );
                })
                .map(async (d) => {
                    let total = departmentMonthSetData?.filter((dep) => {
                        if (dep.department === d.department && Number(dep.year) === isMonthyear.isyear.value) {
                            return dep;
                        }
                    });
                    let departmentMonthSetDataPre = departmentMonthSetData?.filter((dep) => {
                        if (dep.department === d.department) {
                            return dep;
                        }
                    });

                    let answer = applyleaveData.filter((data) => data.employeeid === d.empcode);
                    let finalanswer = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype) {
                            return anw.date;
                        }
                    });

                    let finalanswerApplied = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype && anw.status === 'Applied') {
                            return anw.date;
                        }
                    });

                    let finalanswerApproved = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype && anw.status === 'Approved') {
                            return anw.date;
                        }
                    });

                    let finalanswerRejected = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype && anw.status === 'Rejected') {
                            return anw.date;
                        }
                    });


                    let filteredData = leavecriteriaData?.filter((item) => {
                        if (item.mode === 'Employee' && item.employee?.includes(d.companyname) && item.leavetype === filterUser.leavetype) {
                            return item;
                        }
                        else if (item.mode === 'Department' && item.department?.includes(d.department) && item.leavetype === filterUser.leavetype) {
                            return item;
                        }
                        else if (item.mode === 'Designation' && item.designation?.includes(d.designation) && item.leavetype === filterUser.leavetype) {
                            return item;
                        }
                        // if ((item.employee?.includes(d.companyname) || item.department?.includes(d.department) || item.designation?.includes(d.designation)) && item.leavetype === filterUser.leavetype) {
                        //     return item;
                        // }
                    });

                    return await fetchLeaveCriteria(d, d.doj, isMonthyear.isyear.value, isMonthyear.ismonth.value, departmentMonthSetDataPre, total, finalanswer, filteredData, filterUser.leavetype, finalanswerApplied, finalanswerApproved, finalanswerRejected);
                }));

            const itemsWithSerialNumber = filteredResult?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
                employeeid: item.empcode,
                employeename: item.companyname,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                department: item.department,
                leavetype: item.leavetype,
                eligible: item.eligible,
                startsfrom: item.startsfrom,
                currentmonthcount: item.currentmonthcount,
                pendingleave: item.pendingleave ? (item.pendingleave < 0 ? 0 : item.pendingleave) : 0,
                availabledays: item.availabledays ? (item.availabledays < 0 ? 0 : item.availabledays) : 0,
                appliedleave: item.appliedleave ? (item.appliedleave < 0 ? 0 : item.appliedleave) : 0,
                approvedleave: item.approvedleave ? (item.approvedleave < 0 ? 0 : item.approvedleave) : 0,
                rejectedleave: item.rejectedleave ? (item.rejectedleave < 0 ? 0 : item.rejectedleave) : 0,
                balancecount: item.balancecount ? (item.balancecount < 0 ? 0 : item.balancecount) : 0,
            }));

            // Update state with updated users
            setAllUsers(itemsWithSerialNumber);
            setFilteredDataItems(itemsWithSerialNumber);
            setTotalPagesLeaveReport(Math.ceil(itemsWithSerialNumber.length / pageSizeLeaveReport));
            setLoader(false);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOptionsCompany.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsBranch.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsUnit.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsEmployee.length === 0) {
            setPopupContentMalert("Please Select Employee");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.leavetype === 'Please Select Leave Type') {
            setPopupContentMalert("Please Select Leave Type");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            setLoader(false);
            fetchUsers();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setFilterUser({ company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", employee: 'Please Select Employee', leavetype: "Please Select Leave Type", });
        setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
        setAllUsers([]);
        setValueCompanyCat([]);
        setSelectedOptionsCompany([])
        setValueBranchCat([]);
        setSelectedOptionsBranch([])
        setValueUnitCat([]);
        setSelectedOptionsUnit([])
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([])
        setPageLeaveReport(1);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const addSerialNumber = async (datas) => {
        setItems(datas);
    }

    useEffect(() => {
        addSerialNumber(allUsers);
    }, [allUsers]);

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
        if (gridRefTableLeaveReport.current) {
            const gridApi = gridRefTableLeaveReport.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesLeaveReport = gridApi.paginationGetTotalPages();
            setPageLeaveReport(currentPage);
            setTotalPagesLeaveReport(totalPagesLeaveReport);
        }
    }, []);

    const columnDataTableLeaveReport = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityLeaveReport.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "employeeid", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityLeaveReport.employeeid, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityLeaveReport.employeename, headerClassName: "bold-header", pinned: 'left', lockPinned: true, pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibilityLeaveReport.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibilityLeaveReport.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibilityLeaveReport.unit, headerClassName: "bold-header", },
        { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibilityLeaveReport.team, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibilityLeaveReport.department, headerClassName: "bold-header", },
        { field: "leavetype", headerName: "Leave Type", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.leavetype, headerClassName: "bold-header", },
        { field: "eligible", headerName: "Eligible", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.eligible, headerClassName: "bold-header", },
        { field: "startsfrom", headerName: "Start Month/Year", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.startsfrom, headerClassName: "bold-header", },
        { field: "pendingleave", headerName: "Pending Count", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.pendingleave, headerClassName: "bold-header", },
        { field: "currentmonthcount", headerName: "Current Month Count", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.currentmonthcount, headerClassName: "bold-header", },
        { field: "availabledays", headerName: "Available Count", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.availabledays, headerClassName: "bold-header", },
        { field: "appliedleave", headerName: "Applied Leave", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.appliedleave, headerClassName: "bold-header", },
        { field: "approvedleave", headerName: "Approved Leave", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.approvedleave, headerClassName: "bold-header", },
        { field: "rejectedleave", headerName: "Rejected Leave", flex: 0, width: 110, hide: !columnVisibilityLeaveReport.rejectedleave, headerClassName: "bold-header", },
        { field: "balancecount", headerName: "Balance Count", flex: 0, width: 150, hide: !columnVisibilityLeaveReport.balancecount, headerClassName: "bold-header", },
    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryLeaveReport(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = items?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageLeaveReport(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = items?.filter((item) => {
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

        setFilteredDataItems(filtered); // Update filtered data
        setAdvancedFilter(filters);
        // handleCloseSearchLeaveReport(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryLeaveReport("");
        setFilteredDataItems(items);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableLeaveReport.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryLeaveReport;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesLeaveReport) {
            setPageLeaveReport(newPage);
            gridRefTableLeaveReport.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeLeaveReport(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityLeaveReport };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityLeaveReport(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityLeaveReport");
        if (savedVisibility) {
            setColumnVisibilityLeaveReport(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityLeaveReport", JSON.stringify(columnVisibilityLeaveReport));
    }, [columnVisibilityLeaveReport]);

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableLeaveReport.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageLeaveReport.toLowerCase())
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

        setColumnVisibilityLeaveReport((prevVisibility) => {
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

        setColumnVisibilityLeaveReport((prevVisibility) => {
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
        setColumnVisibilityLeaveReport((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = [
        "Emp Code", "Employee Name", "Company", "Branch", "Unit", "Team", "Department",
        'Leave Type', 'Eligible', 'Start Month/Year', 'Pending Count', 'Current Month Count',
        'Available Count', 'Applied Leave', 'Approved Leave', 'Rejected Leave', 'Balance Count',
    ]
    let exportRowValuescrt = [
        "employeeid", "employeename", "company", "branch", "unit", "team", "department",
        "leavetype", "eligible", "startsfrom", "pendingleave", "currentmonthcount",
        "availabledays", "appliedleave", "approvedleave", "rejectedleave", "balancecount",
    ]

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Leave Report",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageLeaveReport.current) {
            domtoimage.toBlob(gridRefImageLeaveReport.current)
                .then((blob) => {
                    saveAs(blob, "Leave Report.png");
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

        const startPage = Math.max(1, pageLeaveReport - 1);
        const endPage = Math.min(totalPagesLeaveReport, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageLeaveReport numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageLeaveReport, show ellipsis
        if (endPage < totalPagesLeaveReport) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageLeaveReport - 1) * pageSizeLeaveReport, pageLeaveReport * pageSizeLeaveReport);
    const totalPagesLeaveReportOuter = Math.ceil(filteredDataItems?.length / pageSizeLeaveReport);
    const visiblePages = Math.min(totalPagesLeaveReportOuter, 3);
    const firstVisiblePage = Math.max(1, pageLeaveReport - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesLeaveReportOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageLeaveReport * pageSizeLeaveReport;
    const indexOfFirstItem = indexOfLastItem - pageSizeLeaveReport;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"LEAVE REPORT"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Leave Report"
                modulename="Leave&Permission"
                submodulename="Leave"
                mainpagename="Leave Report"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lleavereport") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> Leave Report Filter </Typography>
                            </Grid>
                            <>
                                <Grid item md={3} xs={12} sm={6}>
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
                                            value={selectedOptionsCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompanyCat?.includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Department <b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        styles={colourStyles}
                                        options={departments}
                                        value={{ label: filterUser.department, value: filterUser.department }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, department: e.value, });
                                        }}
                                    />
                                </FormControl>
                            </Grid> */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Employee Name<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={employeeOptions
                                                ?.filter((u) => valueUnitCat?.includes(u.unit))
                                                .map((u) => ({
                                                    ...u,
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
                                <Grid item md={3} xs={12} sm={6}>
                                    <Typography>Leave Type<b style={{ color: 'red' }}>*</b> </Typography>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={leaveTypeOption}
                                            value={{ label: filterUser.leavetype, value: filterUser.leavetype }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, leavetype: e.value, });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Select Month</Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={months}
                                            value={isMonthyear.ismonth}
                                            onChange={(e) => handleGetMonth(e.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Select Year</Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={getyear}
                                            value={isMonthyear.isyear}
                                            onChange={(e) => handleGetYear(e.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12} >
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit} > Filter </Button>
                                    </Box>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <Button sx={userStyle.btncancel} onClick={handleClear} > Clear </Button>
                                    </Box>
                                </Grid>
                            </>
                        </Grid>
                    </Box><br />
                    {/* ****** Table Start ****** */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Leave Report List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeLeaveReport}
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
                                        <MenuItem value={allUsers?.length}>  All </MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                <Box>
                                    {isUserRoleCompare?.includes("excelleavereport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvleavereport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printleavereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfleavereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageleavereport") && (
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchLeaveReport} />
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
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button> &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsLeaveReport}> Manage Columns  </Button>  <br />  <br />
                        {loader ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageLeaveReport} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableLeaveReport.filter((column) => columnVisibilityLeaveReport[column.field])}
                                        ref={gridRefTableLeaveReport}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeLeaveReport}
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
                                            (filteredDataItems.length > 0 ? (pageLeaveReport - 1) * pageSizeLeaveReport + 1 : 0)
                                        ) : (
                                            filteredRowData.length > 0 ? (pageLeaveReport - 1) * pageSizeLeaveReport + 1 : 0
                                        )
                                    }{" "}to{" "}
                                    {
                                        gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                            Math.min(pageLeaveReport * pageSizeLeaveReport, filteredDataItems.length)
                                        ) : (
                                            filteredRowData.length > 0 ? Math.min(pageLeaveReport * pageSizeLeaveReport, filteredRowData.length) : 0
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
                                    <Button onClick={() => handlePageChange(1)} disabled={pageLeaveReport === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                    <Button onClick={() => handlePageChange(pageLeaveReport - 1)} disabled={pageLeaveReport === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
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
                                            className={pageLeaveReport === pageNumber ? "active" : ""}
                                            disabled={pageLeaveReport === pageNumber}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    <Button onClick={() => handlePageChange(pageLeaveReport + 1)} disabled={pageLeaveReport === totalPagesLeaveReport} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                    <Button onClick={() => handlePageChange(totalPagesLeaveReport)} disabled={pageLeaveReport === totalPagesLeaveReport} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                </Box>
                            </Box> */}
                            </>
                        }
                    </Box>
                    {/* ****** Table End ****** */}
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idLeaveReport}
                open={isManageColumnsOpenLeaveReport}
                anchorEl={anchorElLeaveReport}
                onClose={handleCloseManageColumnsLeaveReport}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsLeaveReport}
                    searchQuery={searchQueryManageLeaveReport}
                    setSearchQuery={setSearchQueryManageLeaveReport}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityLeaveReport}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityLeaveReport}
                    initialColumnVisibility={initialColumnVisibilityLeaveReport}
                    columnDataTable={columnDataTableLeaveReport}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchLeaveReport}
                open={openSearchLeaveReport}
                anchorEl={anchorElSearchLeaveReport}
                onClose={handleCloseSearchLeaveReport}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableLeaveReport} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryLeaveReport} handleCloseSearch={handleCloseSearchLeaveReport} />
            </Popover>

            {/* ALERT DIALOG */}
            <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }} >
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)", }} onClick={handleCloseerr} >
                        ok
                    </Button>
                </DialogActions>
            </Dialog>
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
                itemsTwo={items ?? []}
                filename={"Leave Report"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box >
    );
}

export default LeaveReportList;