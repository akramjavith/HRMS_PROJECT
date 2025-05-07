import React, { useState, useEffect, useRef, useContext } from "react";
import { handleApiError } from "../../../components/Errorhandling.js";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf } from 'react-icons/fa';
import { Box, FormControl, OutlinedInput, Typography, Select, MenuItem, Grid, Button, Popover, Checkbox, Chip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import { ThreeDots } from "react-loader-spinner";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import Headtitle from "../../../components/Headtitle.js";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import AlertDialog from "../../../components/Alert.js";
import ManageColumnsContent from "../../../components/ManageColumn.js";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar.js";
import AggridTable from "../../../components/AggridTable.js";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceBulkUpdateListTable() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTableAttBulkList = useRef(null);
    const gridRefImageAttBulkList = useRef(null);

    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersLimit, alldepartment, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
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
    const [allAttBulkUpdate, setAllAttBulkUpdate] = useState([]);
    const [itemsAttBulkList, setItemsAttBulkList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterUser, setFilterUser] = useState({ filtertype: "Individual", fromdate: today, todate: today, });

    // State to track advanced filter
    const [filteredRowDataAttBulkList, setFilteredRowDataAttBulkList] = useState([]);
    const [filteredChangesAttBulkList, setFilteredChangesAttBulkList] = useState(null);
    const [isHandleChangeAttBulkList, setIsHandleChangeAttBulkList] = useState(false);
    const [searchedStringAttBulkList, setSearchedStringAttBulkList] = useState("");

    //Datatable
    const [pageAttBulkList, setPageAttBulkList] = useState(1);
    const [pageSizeAttBulkList, setPageSizeAttBulkList] = useState(10);
    const [searchQueryAttBulkList, setSearchQueryAttBulkList] = useState("");
    const [totalPagesAttBulkList, setTotalPagesAttBulkList] = useState("");

    // Manage Columns
    const [searchQueryManageAttBulkList, setSearchQueryManageAttBulkList] = useState("");
    const [isManageColumnsOpenAttBulkList, setManageColumnsOpenAttBulkList] = useState(false);
    const [anchorElAttBulkList, setAnchorElAttBulkList] = useState(null);
    const handleOpenManageColumnsAttBulkList = (event) => {
        setAnchorElAttBulkList(event.currentTarget);
        setManageColumnsOpenAttBulkList(true);
    };
    const handleCloseManageColumnsAttBulkList = () => {
        setManageColumnsOpenAttBulkList(false);
        setSearchQueryManageAttBulkList("");
    };

    const openAttBulkList = Boolean(anchorElAttBulkList);
    const idAttBulkList = openAttBulkList ? "simple-popover" : undefined;

    // Exports
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

    // page refersh reload description
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAttBulkList");
        if (savedVisibility) {
            setColumnVisibilityAttBulkList(JSON.parse(savedVisibility));
        }
    }, []);

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    // Show All Columns & Manage Columns
    const initialColumnVisibilityAttBulkList = {
        checkbox: true,
        serialNumber: true,
        empcode: true,
        companyname: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        date: true,
        shiftmode: true,
        shiftname: true,
        clockin: true,
        clockout: true,
        clockintime: true,
        clockouttime: true,
        attendance: true,
        actions: true,
    };
    const [columnVisibilityAttBulkList, setColumnVisibilityAttBulkList] = useState(initialColumnVisibilityAttBulkList);

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
            pagename: String("Attendance Bulk Update Report"),
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
        // Create team options based on selected company, branch, and unit
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
        const allemployees = allUsersLimit
            ?.filter(val =>
                company.some(comp => comp.value === val.company) &&
                branch.some(br => br.value === val.branch) &&
                unit.some(uni => uni.value === val.unit) &&
                team.some(team => team.value === val.team)
            )
            .map(data => ({
                label: data.companyname,
                value: data.companyname,
            }));
        setSelectedEmp(allemployees);
        setValueEmp(allemployees.map(a => a.value));
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
        setValueEmp([]);
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

    const [searchInputValue, setSearchInputValue] = useState('');
    const [isBoxFocused, setIsBoxFocused] = React.useState(false);

    const handlePasteForEmp = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Process the pasted text
        const pastedNames = pastedText
            .split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name !== "");

        // Update the state
        updateEmployees(pastedNames);

        // Clear the search input after paste
        setSearchInputValue('');

        // Refocus the element
        e.target.focus();
    };

    useEffect(() => {
        updateEmployees([]); // Pass an empty array instead of an empty string
    }, [allUsersLimit, valueCompany, valueBranch, valueUnit, valueTeam]);

    const updateEmployees = (pastedNames) => {

        const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

        const availableOptions = allUsersLimit
            ?.filter(
                (comp) =>
                    valueCompany?.includes(comp.company) &&
                    valueBranch?.includes(comp.branch) &&
                    valueUnit?.includes(comp.unit) &&
                    valueTeam?.includes(comp.team)
            )
            ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

        const matchedValues = namesArray.filter((name) =>
            availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
        );

        // Update selected options
        const newOptions = matchedValues.map(value => ({
            label: value,
            value: value
        }));

        setSelectedEmp(prev => {
            const newValues = newOptions.filter(
                newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
            );
            return [...prev, ...newValues];
        });

        // Update other states...
        setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    };

    // Handle clicks outside the Box
    useEffect(() => {
        const handleClickOutside = (e) => {
            const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
            if (boxElement && !boxElement.contains(e.target)) {
                setIsBoxFocused(false); // Reset focus state if clicking outside the Box
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedEmp((current) => current.filter(emp => emp.value !== value));
        setValueEmp((current) => current.filter(empValue => empValue !== value));
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

    //get all Brand Type Name.
    const fetchAttBulkUpdateData = async () => {
        setPageName(!pageName);
        setLoader(true);
        try {

            let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_INDIVIDUAL_TYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
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

            async function sendBatchRequest(batch) {
                try {
                    let res = await axios.post(SERVICE.ATTENDANCE_BULK_UPDATE_REPORT_FILTER, {
                        employee: batch.data,
                        fromDate: filterUser.fromdate,
                        toDate: filterUser.todate,
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    })

                    let filtered = valueDep.length > 0 ? (res?.data?.filteredData?.filter((data) => valueDep.includes(data.department))) : res?.data?.filteredData;

                    return filtered;

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

                const itemsWithSerialNumber = results.allResults?.map((item, index) => {
                    return {
                        ...item,
                        id: item._id,
                        serialNumber: index + 1,
                        clockintime: item.bulkupdateclockinstatus === true ? item.clockintime : '',
                        clockouttime: item.bulkupdateclockoutstatus === true ? item.clockouttime : '',
                    }
                });
                setAllAttBulkUpdate(itemsWithSerialNumber);
                setSearchQueryAttBulkList("");
                setLoader(false);
                setTotalPagesAttBulkList(Math.ceil(itemsWithSerialNumber.length / pageSizeAttBulkList));
            }).catch(error => {
                setLoader(true);
                console.error('Error in getting all results:', error);
            });
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        }
        else if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchAttBulkUpdateData();
        }
    };

    const handleClear = async (e) => {
        e.preventDefault();
        setAllAttBulkUpdate([]);
        setFilterUser({ filtertype: "Individual", fromdate: today, todate: today, });
        setSelectedMode("Today")
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
        setPageAttBulkList(1);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //serial no for listing itemsAttBulkList
    const addSerialNumber = (data) => {
        setItemsAttBulkList(data);
    };

    //useEffect
    useEffect(() => {
        addSerialNumber(allAttBulkUpdate);
    }, [allAttBulkUpdate]);

    // Split the search query into individual terms
    const searchTerms = searchQueryAttBulkList.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasAttBulkList = itemsAttBulkList?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    // Pagination for outer filter
    const filteredDataAttBulkList = filteredDatasAttBulkList?.slice((pageAttBulkList - 1) * pageSizeAttBulkList, pageAttBulkList * pageSizeAttBulkList);
    const totalPagesAttBulkListOuter = Math.ceil(filteredDatasAttBulkList?.length / pageSizeAttBulkList);
    const visiblePages = Math.min(totalPagesAttBulkListOuter, 3);
    const firstVisiblePage = Math.max(1, pageAttBulkList - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttBulkListOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAttBulkList * pageSizeAttBulkList;
    const indexOfFirstItem = indexOfLastItem - pageSizeAttBulkList;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const columnDataTableAttBulkList = [
        // {
        //     field: "checkbox",
        //     headerName: "", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold",
        //     },
        //     sortable: false,
        //     width: 75,
        //     filter: false,
        //     headerCheckboxSelection: true,
        //     checkboxSelection: true,
        //     hide: !columnVisibilityAttBulkList.checkbox,
        //     headerClassName: "bold-header",
        //     pinned: "left",
        // },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAttBulkList.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityAttBulkList.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "companyname", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityAttBulkList.companyname, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibilityAttBulkList.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibilityAttBulkList.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibilityAttBulkList.unit, headerClassName: "bold-header", },
        { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibilityAttBulkList.team, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibilityAttBulkList.department, headerClassName: "bold-header", },
        { field: "date", headerName: "Date", flex: 0, width: 110, hide: !columnVisibilityAttBulkList.date, headerClassName: "bold-header", },
        { field: "shiftmode", headerName: "Shift Mode", flex: 0, width: 110, hide: !columnVisibilityAttBulkList.shiftmode, headerClassName: "bold-header", },
        { field: "shiftname", headerName: "Shift Name", flex: 0, width: 150, hide: !columnVisibilityAttBulkList.shiftname, headerClassName: "bold-header", },
        { field: "clockintime", headerName: "ClockIn Time", flex: 0, width: 150, hide: !columnVisibilityAttBulkList.clockintime, headerClassName: "bold-header", },
        { field: "clockouttime", headerName: "ClockOut Time", flex: 0, width: 150, hide: !columnVisibilityAttBulkList.clockouttime, headerClassName: "bold-header", },
    ];

    const rowDataTable = filteredDataAttBulkList.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
        };
    });

    // Datatable
    const handlePageSizeChange = (event) => {
        setPageSizeAttBulkList(Number(event.target.value));
        setSelectedRows([]);
        setPageAttBulkList(1);
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityAttBulkList };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAttBulkList(updatedVisibility);
    };

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAttBulkList", JSON.stringify(columnVisibilityAttBulkList));
    }, [columnVisibilityAttBulkList]);

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableAttBulkList.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageAttBulkList.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibilityAttBulkList((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Emp Code ", "Employee Name ", "Company", "Branch", "Unit", "Team", "Department", "Date", "Shift Mode", "Shift Name", "ClockIn Time", "ClockOut Time"]
    let exportRowValuescrt = ["empcode", "companyname", "company", "branch", "unit", "team", "department", "date", "shiftmode", "shiftname", "clockintime", "clockouttime"]

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Attendance Bulk Update Report",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageAttBulkList.current) {
            domtoimage.toBlob(gridRefImageAttBulkList.current)
                .then((blob) => {
                    saveAs(blob, "Attendance Bulk Update Report.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"ATTENDANCE BULK UPDATE REPORT"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Attendance Bulk Update Report"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Reports"
                subsubpagename="Attendance Bulk Update Report"
            />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lattendancebulkupdatereport") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> User Shift Roaster </Typography>
                            </Grid>
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
                                        <Typography>Employee<b style={{ color: "red" }}>*</b></Typography>
                                        <div
                                            onPaste={handlePasteForEmp}
                                            style={{ position: 'relative' }}
                                        >
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
                                                inputValue={searchInputValue} // Add this state if needed
                                                onInputChange={(newValue) => setSearchInputValue(newValue)}
                                            />
                                        </div>
                                    </FormControl>
                                </Grid>}
                            {["Individual"]?.includes(filterUser.filtertype) &&
                                <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Selected Employees</Typography>
                                        <Box
                                            id="paste-box"
                                            tabIndex={0}
                                            sx={{
                                                border: '1px solid #ccc',
                                                borderRadius: '3.75px',
                                                height: '110px',
                                                overflow: 'auto',
                                                '& .MuiChip-clickable': {
                                                    margin: '1px',
                                                    cursor: 'pointer',
                                                    userSelect: 'none',
                                                    background: '#e0e0e0',
                                                },
                                            }}
                                            onPaste={handlePasteForEmp}
                                            onFocus={() => setIsBoxFocused(true)}
                                            onBlur={(e) => {
                                                if (isBoxFocused) {
                                                    e.target.focus();
                                                }
                                            }}
                                        >
                                            {valueEmp.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    clickable
                                                    sx={{ margin: 2, backgroundColor: "#FFF" }}
                                                    onDelete={(e) => handleDelete(e, value)}
                                                    onClick={() => console.log("clicked chip")}
                                                />
                                            ))}
                                        </Box>
                                    </FormControl>
                                </Grid>}
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
                    </Box><br />
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Attendance Bulk Update Report
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeAttBulkList}
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
                                        <MenuItem value={itemsAttBulkList?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{ display: "flex", justifyContent: "center", alignItems: "center", }} >
                                <Box>
                                    {isUserRoleCompare?.includes("excelattendancebulkupdatereport") && (
                                        <>  <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            setFormat("xl")
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvattendancebulkupdatereport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printattendancebulkupdatereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfattendancebulkupdatereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageattendancebulkupdatereport") && (
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
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableAttBulkList}
                                    setItems={setItemsAttBulkList}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPageAttBulkList}
                                    maindatas={allAttBulkUpdate}
                                    setSearchedString={setSearchedStringAttBulkList}
                                    searchQuery={searchQueryAttBulkList}
                                    setSearchQuery={setSearchQueryAttBulkList}
                                    paginated={false}
                                    totalDatas={allAttBulkUpdate}
                                />
                            </Grid>
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttBulkList}>Manage Columns</Button><br /><br />
                        {loader ? (
                            <Box sx={{ display: "flex", justifyContent: "center" }}                                >
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttBulkList} >
                                    <AggridTable
                                        rowDataTable={rowDataTable}
                                        columnDataTable={columnDataTableAttBulkList}
                                        columnVisibility={columnVisibilityAttBulkList}
                                        page={pageAttBulkList}
                                        setPage={setPageAttBulkList}
                                        pageSize={pageSizeAttBulkList}
                                        totalPages={totalPagesAttBulkList}
                                        setColumnVisibility={setColumnVisibilityAttBulkList}
                                        isHandleChange={isHandleChangeAttBulkList}
                                        items={itemsAttBulkList}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        pagenamecheck={"Attendance Bulk Update Report"}
                                        gridRefTable={gridRefTableAttBulkList}
                                        gridRefTableImg={gridRefImageAttBulkList}
                                        paginated={false}
                                        filteredDatas={filteredDatasAttBulkList}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedStringAttBulkList}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowDataAttBulkList}
                                        filteredRowData={filteredRowDataAttBulkList}
                                        setFilteredChanges={setFilteredChangesAttBulkList}
                                        filteredChanges={filteredChangesAttBulkList}
                                        itemsList={allAttBulkUpdate}
                                    />
                                </Box>
                            </>
                        )}
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={idAttBulkList}
                open={isManageColumnsOpenAttBulkList}
                anchorEl={anchorElAttBulkList}
                onClose={handleCloseManageColumnsAttBulkList}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAttBulkList}
                    searchQuery={searchQueryManageAttBulkList}
                    setSearchQuery={setSearchQueryManageAttBulkList}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityAttBulkList}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityAttBulkList}
                    initialColumnVisibility={initialColumnVisibilityAttBulkList}
                    columnDataTable={columnDataTableAttBulkList}
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
                filteredDataTwo={(filteredChangesAttBulkList !== null ? filteredRowDataAttBulkList : rowDataTable) ?? []}
                itemsTwo={allAttBulkUpdate ?? []}
                filename={"Attendance Bulk Update Report"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default AttendanceBulkUpdateListTable;