import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../components/TableStyle";
import Selects from "react-select";
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
import { MultiSelect } from "react-multi-select-component";
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import LoadingButton from "@mui/lab/LoadingButton";

function ShiftRoasterFilter() {

    const currentDate = new Date().toISOString().split('T')[0];

    const gridRef = useRef(null);
    const gridRefSetTable = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isAssignBranch } = useContext(UserRoleAccessContext);
    const [allShiftRoasters, setAllShiftRoasters] = useState([]);
    const [comparedUsers, setComparedUsers] = useState([]);
    const [allShiftRoastersEdit, setAllShiftRoastersEdit] = useState([]);
    const [shiftRoastersCheck, allShiftRoastersCheck] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");

    const [excelData, setExcelData] = useState([]);
    const [items, setItems] = useState([]);
    const [branches, setBranches] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [units, setUnits] = useState([]);
    const [teams, setTeams] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [allUserDates, setAllUserDates] = useState([])
    const [comparedUsersSetlist, setComparedUsersSetlist] = useState([]);
    const [filter, setFilter] = useState({ weeks: "1st Week" })
    const [shiftDayOptions, setShiftDayOptions] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [shiftsFiltered, setShiftsFiltered] = useState([])
    const [itemsSetTable, setItemsSetTable] = useState([])
    const [allShifts, setAllShifts] = useState([])
    const [shiftTime, setShiftTime] = useState("");
    const [secondShiftTime, setSecondShiftTime] = useState("")
    const [shiftAllows, setShiftAllows] = useState("");
    const [getUpdateID, setGetUpdateID] = useState("")
    const [getShiftAllot, setGetShiftAllot] = useState({})
    const [selectedRowsSetlist, setSelectedRowsSetlist] = useState([]);
    const [copiedDataSetlist, setCopiedDataSetlist] = useState("");
    const [selectAllCheckedSetlist, setSelectAllCheckedSetlist] = useState(false);
    const [allSetCheckSetlist, setAllSetCheckSetlist] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [overallsettings, setOverallsettings] = useState("");
    const [departmentShow, setDepartmentShow] = useState(true);
    const [branchShow, setBranchShow] = useState(true);
    const [isBtn, setIsBtn] = useState(false);

    // company multiselect add
    const [selectedOptionsCompanyAdd, setSelectedOptionsCompanyAdd] = useState([]);
    let [valueCompanyAdd, setValueCompanyAdd] = useState("")
    // branch multiselect add
    const [selectedOptionsBranchAdd, setSelectedOptionsBranchAdd] = useState([]);
    let [valueBranchAdd, setValueBranchAdd] = useState("")
    // unit multiselect add
    const [selectedOptionsUnitAdd, setSelectedOptionsUnitAdd] = useState([]);
    let [valueUnitAdd, setValueUnitAdd] = useState("")
    // team multiselect add
    const [selectedOptionsTeamAdd, setSelectedOptionsTeamAdd] = useState([]);
    let [valueTeamAdd, setValueTeamAdd] = useState("")
    // department multiselect add
    const [selectedOptionsDepartmentAdd, setSelectedOptionsDepartmentAdd] = useState([]);
    let [valueDepartmentAdd, setValueDepartmentAdd] = useState("")

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); setIsBtn(false); };

    // Edit model
    const [openEditSetlist, setOpenEditSetlist] = useState(false);
    const handleClickOpenEditSetlist = () => { setOpenEditSetlist(true); };
    const handleCloseEditSetlist = () => { setOpenEditSetlist(false); }

    const [shiftRoasterEdit, setShiftRoasterEdit] = useState({
        company: "",
        branch: "",
        unit: "",
        team: "",
        department: "",
        shifttype: "Choose Type",
        departmenttype: "Choose Department Type",
        fullweek: 'Choose Week',
        fromdate: "", todate: "",
        mode: 'Shift',
        shiftgrptype: "Choose Day/Night",
        shift: "Choose Shift",
        firstshift: "",
        secondmode: "Choose Second Shift",
        pluseshift: "",
        status: "",
    });

    const [getAdjShiftTypeTime, setGetAdjShiftTypeTime] = useState("")
    const [getChangeShiftTypeTime, setGetChangeShiftTypeTime] = useState("")
    const [shiftRoasterUserEdit, setShiftRoasterUserEdit] = useState({
        adjfirstshiftmode: "", firstshift: "", adjustmenttype: "Add On Shift", adjchangeshift: "Choose Shift",
        adjchangeshiftime: "", adjchangereason: "", adjdate: currentDate, adjtypeshift: "Choose Shift", adjtypeshifttime: "", adjtypereason: "",
    })

    // get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthname = monthstring[new Date().getMonth()];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
    const currentYearObject = { label: currentYear, value: currentYear };
    const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject });

    // get current month
    let month = new Date().getMonth() + 1;
    // get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

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

    const [shiftRoasterAdd, setShiftRoasterAdd] = useState({
        company: "", branch: "", unit: "", team: "", department: "Choose Department",
        departmenttype: "Choose Department Type",
        shifttype: "Choose Type",
        fullweek: 'Choose Week',
        fromdate: "", todate: ""
    });

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Datatable Set Table
    const [pageSetTable, setPageSetTable] = useState(1);
    const [pageSizeSetTable, setPageSizeSetTable] = useState(10);
    const [searchQuerySetTable, setSearchQuerySetTable] = useState("");

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

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setPopupFilter({ filterfield: "Select..." });
        setShiftRoasterUserEdit({
            adjfirstshiftmode: "", firstshift: "", adjustmenttype: "Add On Shift", adjchangeshift: "Choose Shift",
            adjchangeshiftime: "", adjchangereason: "", adjdate: currentDate, adjtypeshift: "Choose Shift", adjtypeshifttime: "", adjtypereason: "",
        });
        setGetAdjShiftTypeTime("")
        setGetChangeShiftTypeTime("")
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [isFilterOpenSetTable, setIsFilterOpenSetTable] = useState(false);
    const [isPdfFilterOpenSetTable, setIsPdfFilterOpenSetTable] = useState(false);
    // page refersh reload
    const handleCloseFilterModSetTable = () => { setIsFilterOpenSetTable(false); };
    const handleClosePdfFilterModSetTable = () => { setIsPdfFilterOpenSetTable(false); };

    // Manage Columns
    const [searchQueryManageSetlist, setSearchQueryManageSetlist] = useState("");
    const [isManageColumnsOpenSetlist, setManageColumnsOpenSetlist] = useState(false);
    const [anchorElSetlist, setAnchorElSetlist] = useState(null);

    const handleOpenManageColumnsSetlist = (event) => {
        setAnchorElSetlist(event.currentTarget);
        setManageColumnsOpenSetlist(true);
    };
    const handleCloseManageColumnsSetlist = () => {
        setManageColumnsOpenSetlist(false);
        setSearchQueryManageSetlist("");
    };

    const openSetList = Boolean(anchorElSetlist);
    const idSetList = openSetList ? "simple-popover" : undefined;

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        companylist: true,
        branchlist: true,
        unitlist: true,
        teamlist: true,
        departmentlist: true,
        fromdate: true,
        todate: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const filteroptions = [
        { label: "1st Week", value: "1st Week" },
        { label: "2nd Week", value: "2nd Week" },
        { label: "3rd Week", value: "3rd Week" },
        { label: "4th Week", value: "4th Week" },
        { label: "5th Week", value: "5th Week" },
    ];

    const modeoptions = [
        { label: "Shift", value: "Shift" },
        { label: "Week Off", value: "Week Off" },
        { label: "Others", value: "Others" },
    ];

    const secondmodeoptions = [
        { label: "Double Shift", value: "Double Shift" },
        { label: "Continue Shift", value: "Continue Shift" },
    ];

    const adjtypeoptions = [
        { label: "Add On Shift", value: "Add On Shift" },
        { label: "Change Shift", value: "Change Shift" },
    ];


    // Show Manual or Adjust
    const [popupFilter, setPopupFilter] = useState({ filterfield: "Select..." });
    const filterfieldoptions = [
        { label: "Adjust", value: "Adjust" },
        { label: "Manual", value: "Manual" },
    ];

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

    const departmentoptions = [
        { label: "Department Month", value: "Department Month" },
        { label: "Month Start", value: "Month Start" },
    ];

    const shifttypeoptions = [
        { label: "For Week", value: "For Week" },
        { label: "For Month", value: "For Month" },
    ];

    const formatDateForDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // const [filter, setFilter] = useState({ weeks: "1st Week" })
    // const filteroptions = [
    //     { label: "1st Week", value: "1st Week" },
    //     { label: "2nd Week", value: "2nd Week" },
    //     { label: "3rd Week", value: "3rd Week" },
    //     { label: "4th Week", value: "4th Week" },
    //     { label: "5th Week", value: "5th Week" },
    // ];

    const fetchCompany = async () => {
        try {
           
            setCompanies(isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              }));

       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    // company multi select
    const handleCompanyChangeAdd = (options) => {
        setValueCompanyAdd(options.map((a, index) => {
            return a.value
        }))
        setSelectedOptionsCompanyAdd(options);
        fetchBranch(options)
        if (options.length == 0) {
            setSelectedOptionsBranchAdd([])
            setValueBranchAdd("")
        }
    };

    const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length
            ? valueCompanyAdd.map(({ label }) => label).join(", ")
            : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Choose Company</span>
    };

    // get all assignBranches
    const fetchBranch = async (company) => {
        try {
            let resval = company.map((a, index) => {
                return a.value
            })
            let arr = isAssignBranch?.filter(
                (comp) =>
                    resval.includes(comp.company)
              )?.map(data => ({
                label: data.branch,
                value: data.branch,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setBranches(arr);

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // branch multi select
    const handleBranchChangeAdd = (options) => {
        setValueBranchAdd(options.map((a, index) => {
            return a.value
        }))
        setSelectedOptionsBranchAdd(options);
        fetchUnit(options)
        if (options.length == 0) {
            setSelectedOptionsUnitAdd([])
            setValueUnitAdd("")
        }
        if (options.length > 0) {
            setDepartmentShow(false);
        } else {
            setDepartmentShow(true);
        }
    };

    const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length
            ? valueBranchAdd.map(({ label }) => label).join(", ")
            : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Choose Branch</span>
    };

    const fetchUnit = async (branch) => {
        try {
            let resval = branch.map((a, index) => {
                return a.value
            })
            let arr = isAssignBranch?.filter(
                (comp) =>
                    resval.includes(comp.branch)
              )?.map(data => ({
                label: data.unit,
                value: data.unit,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setUnits(arr);

       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // unit multi select
    const handleUnitChangeAdd = (options) => {
        setValueUnitAdd(options.map((a, index) => {
            return a.value
        }))
        setSelectedOptionsUnitAdd(options);
        fetchTeam(options)
        if (options.length == 0) {
            setSelectedOptionsTeamAdd([])
            setValueTeamAdd("")
        }
    };

    const customValueRendererUnitAdd = (valueUnitAdd, _units) => {
        return valueUnitAdd.length
            ? valueUnitAdd.map(({ label }) => label).join(", ")
            : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Choose Unit</span>

    };

    const fetchTeam = async (unit) => {
        try {
            let res_teams = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let arr = []
            res_teams.data.teamsdetails.map(t => {
                unit.forEach(d => {
                    if (d.value == t.unit) {
                        arr.push(t.teamname)
                    }
                })
            })
            setTeams(arr.map((t) => ({
                label: t,
                value: t
            })));
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // team multi select
    const handleTeamChangeAdd = (options) => {
        setValueTeamAdd(options.map((a, index) => {
            return a.value
        }))
        setSelectedOptionsTeamAdd(options);
    };

    const customValueRendererTeamAdd = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length
            ? valueTeamAdd.map(({ label }) => label).join(", ")
            : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Choose Team</span>

    };

    const [allDepartmentSet, setAllDepartmentSet] = useState([]);
    const [departmentSetDate, setDepartmentSetDate] = useState("");

    //get all data.
    const fetchDepartmentSetDepartment = async () => {
        try {
            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // Remove duplicates from companies
            let uniqueDepMonthSet = Array.from(new Set(res_status.data.departmentdetails.map((t) => t.department)));
            setAllDepartmentSet(uniqueDepMonthSet.map((t) => ({
                label: t,
                value: t
            })));

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useState(() => {
        fetchDepartmentSetDepartment();
    }, []);

    const fetchDepartment = async () => {
        try {
            const [res_dep, res_status] = await Promise.all([
                axios.get(SERVICE.DEPARTMENT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.DEPMONTHSET_ALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                })
            ])

            // Get unmatched departments
            let unmatchedDepartments = res_dep.data.departmentdetails.filter((d) => {
                return !res_status.data.departmentdetails.some((t) => t.department === d.deptname);
            });

            // Extract unique department names
            let uniqueDepartments = Array.from(new Set(unmatchedDepartments.map((t) => t.deptname)));

            setDepartments(uniqueDepartments.map((t) => ({
                label: t,
                value: t
            })));

       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchDepartment()
    }, [])

    // department multi select
    const handleDepartmentChangeAdd = (options) => {
        setValueDepartmentAdd(options.map((a, index) => {
            return a.value
        }))
        setSelectedOptionsDepartmentAdd(options);
        setShiftRoasterAdd({ ...shiftRoasterAdd, shifttype: "Choose Type" });
        // fetchDepartmentSet(options)
        // if (options.length > 0) {
        //     setBranchShow(false);
        // } else {
        //     setBranchShow(true);
        // }
    };

    const customValueRendererDepartmentAdd = (valueDepartmentAdd, _departments) => {
        return valueDepartmentAdd.length
            ? valueDepartmentAdd.map(({ label }) => label).join(", ")
            : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Choose Department</span>
    };

    const fetchDepartmentSet = async (departments) => {

        try {
            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const departmentDetail = res_status.data.departmentdetails.find(
                (d) => d.department === departments && d.monthname === monthstring[isMonthyear.ismonth.value - 1] && Number(d.year) === isMonthyear.isyear.value
            );

            if (departmentDetail) {
                setDepartmentSetDate(departmentDetail.fromdate);
            } else {
                setDepartmentSetDate(""); // Set default value if department is not found
            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchOverAllSettings = async () => {
        try {
            let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            res?.data?.overallsettings.map((d) => {
                setOverallsettings(d.repeatinterval);
            })
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchOverAllSettings();
    }, []);

    const handleShiftTpe = (e) => {
        if (selectedOptionsBranchAdd.length === 0 && shiftRoasterAdd.departmenttype == "Choose Department Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Branch or Department"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setShiftRoasterAdd({ ...shiftRoasterAdd, shifttype: e.value });
        }
    }

    const handleGetMonth = (e) => {
        const selectedMonthObject = months.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, ismonth: selectedMonthObject });
        calculateMonthDates();
        fetchFromDate(selectedMonthObject, isMonthyear.isyear);
    }
    const handleGetYear = (e) => {
        const selectedYearObject = getyear.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, isyear: selectedYearObject });
        calculateMonthDates();
        fetchFromDate(isMonthyear.ismonth, selectedYearObject);
    }

    const fetchFromDate = async (selectedMonth, selectedYear) => {
        try {
            const res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            const departmentDetail = res_status.data.departmentdetails.find(
                (d) => d.department === shiftRoasterAdd.department
                    && Number(d.month) === selectedMonth.value
                    && Number(d.year) === selectedYear.value
            );
            if (departmentDetail) {
                setDepartmentSetDate(departmentDetail.fromdate);
            } else {
                setDepartmentSetDate("");
            }
        } catch (err) {
        }
    };

    const calculateWeekDates = (weekOption) => {
      
        if (departmentShow) {
            if (shiftRoasterAdd.departmenttype === "Department Month") {
                // Check if departmentSetDate is available
                if (departmentSetDate) {
                    const startDate = new Date(departmentSetDate);
                    const selectedWeek = parseInt(weekOption.value);
                    const daysToAdd = (selectedWeek - 1) * 7;
                    startDate.setDate(startDate.getDate() + daysToAdd);

                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);

                    setShiftRoasterAdd({
                        ...shiftRoasterAdd,
                        fullweek: weekOption.value,
                        fromdate: formatDate(startDate),
                        todate: formatDate(endDate),
                    });
                }
            }
            if (shiftRoasterAdd.departmenttype === "Month Start") {
                const currentMonth = parseInt(isMonthyear.ismonth.value);
                const currentYear = parseInt(isMonthyear.isyear.value);

                const startDate = new Date(currentYear, currentMonth - 1, 1);

                const firstDayOfMonth = startDate.getDay();
                const selectedWeek = parseInt(weekOption.value);
                const daysToAdd = (selectedWeek - 1) * 7 - firstDayOfMonth + 1;

                startDate.setDate(startDate.getDate() + daysToAdd);

                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);

                setShiftRoasterAdd({
                    ...shiftRoasterAdd,
                    fullweek: weekOption.value,
                    fromdate: formatDate(startDate),
                    todate: formatDate(endDate),
                });
            }
        }
        if (branchShow) {
            // const currentMonth = isMonthyear.ismonth.value;
            // const currentYear = isMonthyear.isyear.value;
            const currentMonth = parseInt(isMonthyear.ismonth.value);
            const currentYear = parseInt(isMonthyear.isyear.value);

            // const startDate = new Date(`${currentYear}-${currentMonth}-01`);
            const startDate = new Date(currentYear, currentMonth - 1, 1);
            const overallSettingsValue = parseInt(overallsettings);

            const firstDayOfMonth = startDate.getDay();
            const selectedWeek = parseInt(weekOption.value);
            const daysToAdd = (selectedWeek - 1) * 7 - firstDayOfMonth + 1;

            startDate.setDate(startDate.getDate() + daysToAdd);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            setShiftRoasterAdd({
                ...shiftRoasterAdd,
                fullweek: weekOption.value,
                fromdate: formatDate(startDate),
                todate: formatDate(endDate),
            });
        }
    };

    const calculateWeekDatesMonthYear = (weekOption) => {
        const currentMonth = parseInt(isMonthyear.ismonth.value);
        const currentYear = parseInt(isMonthyear.isyear.value);

        // const startDate = new Date(`${currentYear}-${currentMonth}-01`);
        const startDate = new Date(currentYear, currentMonth - 1, 1);
        const overallSettingsValue = parseInt(overallsettings);

        const firstDayOfMonth = startDate.getDay();
        const selectedWeek = parseInt(weekOption.value);
        const daysToAdd = (selectedWeek - 1) * 7 - firstDayOfMonth + 1;

        startDate.setDate(startDate.getDate() + daysToAdd);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        setShiftRoasterAdd({
            ...shiftRoasterAdd,
            fullweek: weekOption.value,
            fromdate: formatDate(startDate),
            todate: formatDate(endDate),
        });
    }

    const calculateMonthDates = () => {
        const overallSettingsValue = parseInt(overallsettings);
        const currentMonth = parseInt(isMonthyear.ismonth.value);
        const currentYear = parseInt(isMonthyear.isyear.value);

        const startDate = new Date(currentYear, currentMonth - 1, 1);

        // Calculate the end date of the month based on overallsettings
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + overallSettingsValue);

        // Adjust to the last day of the month to get the correct end date
        endDate.setDate(endDate.getDate() - 1);

        // Set the calculated dates to the state
        setShiftRoasterAdd({
            ...shiftRoasterAdd,
            fromdate: formatDate(startDate),
            todate: formatDate(endDate),
        });
    };

    useEffect(() => {
        if (shiftRoasterAdd.shifttype === "For Week") {
            // Set the calculated dates to the state
            setShiftRoasterAdd({
                ...shiftRoasterAdd,
                fullweek: "Choose Week",
                fromdate: "",
                todate: "",
            });
        } else {
            // Function to calculate start and end dates based on month option and overallsettings
            const calculateMonthDates = () => {
                const overallSettingsValue = parseInt(overallsettings);
                // const currentMonth = isMonthyear.ismonth.value;
                // const currentYear = isMonthyear.isyear.value;
                const currentMonth = parseInt(isMonthyear.ismonth.value);
                const currentYear = parseInt(isMonthyear.isyear.value);


                if (departmentShow) {
                    if (shiftRoasterAdd.departmenttype === "Department Month") {
                        // Check if departmentSetDate is available
                        if (departmentSetDate) {
                            // Calculate the start date of the month based on department's fromdate
                            const startDate = new Date(departmentSetDate);

                            // Calculate the end date of the month based on overallsettings
                            const endDate = new Date(startDate);
                            endDate.setMonth(endDate.getMonth() + overallSettingsValue);

                            // Adjust to the last day of the month to get the correct end date
                            endDate.setDate(endDate.getDate() - 1);

                            // Set the calculated dates to the state
                            setShiftRoasterAdd({
                                ...shiftRoasterAdd,
                                fromdate: formatDate(startDate),
                                todate: formatDate(endDate),
                            });
                        }
                    }
                    if (shiftRoasterAdd.departmenttype === "Month Start") {
                        // Calculate the start date of the month based on the selected month
                        // const startDate = new Date(`${currentYear}-${currentMonth}-01`);
                        const startDate = new Date(currentYear, currentMonth - 1, 1);

                        // Calculate the end date of the month based on overallsettings
                        const endDate = new Date(startDate);
                        endDate.setMonth(endDate.getMonth() + overallSettingsValue);

                        // Adjust to the last day of the month to get the correct end date
                        endDate.setDate(endDate.getDate() - 1);

                        // Set the calculated dates to the state
                        setShiftRoasterAdd({
                            ...shiftRoasterAdd,
                            fromdate: formatDate(startDate),
                            todate: formatDate(endDate),
                        });
                    }
                }
                if (branchShow) {
                    // Calculate the start date of the month based on the selected month
                    const startDate = new Date(`${currentYear}-${currentMonth}-01`);

                    // Calculate the end date of the month based on overallsettings
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + overallSettingsValue);

                    // Adjust to the last day of the month to get the correct end date
                    endDate.setDate(endDate.getDate() - 1);

                    // Set the calculated dates to the state
                    setShiftRoasterAdd({
                        ...shiftRoasterAdd,
                        fromdate: formatDate(startDate),
                        todate: formatDate(endDate),
                    });
                }
            };
            calculateMonthDates();
        }
    }, [shiftRoasterAdd.shifttype, isMonthyear.ismonth.value, isMonthyear.isyear.value, departmentSetDate, overallsettings]);

    // Helper function to format date as "YYYY-MM-DD"
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        // return `${year}-${month}-${day}`;
        return `${day}-${month}-${year}`;
    };

    // Generate fullweek options based on overallsettings value
    const generateFullWeekOptions = () => {
        const overallSettingsValue = parseInt(overallsettings);
        const weekOptions = [];
        for (let i = 1; i <= overallSettingsValue; i++) {
            weekOptions.push({ label: `${i}st Week`, value: `${i}st Week` });
        }
        return weekOptions;
    };

    const handleHideClear = () => {
        setSelectedOptionsCompanyAdd([]);
        setValueCompanyAdd("");
        setSelectedOptionsDepartmentAdd([]);
        setSelectedOptionsBranchAdd([]);
        setValueDepartmentAdd("");
        setValueBranchAdd("");
        setDepartmentShow(true);
        setBranchShow(true);
        setBranches([]);
        setUnits([]);
        setTeams([]);
        setShiftRoasterAdd({ department: 'Choose Department', departmenttype: "Choose Department Type", shifttype: "Choose Type", fullweek: 'Choose Week', fromdate: "", todate: "" });
        setShowAlert(
            <>
                <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    }

    const handleClear = (e) => {
        e.preventDefault();
        setAllShiftRoasters([]);
        setShiftRoasterAdd({
            department: 'Choose Department', departmenttype: "Choose Department Type",
            shifttype: "Choose Type", fullweek: 'Choose Week', fromdate: "", todate: ""
        });
        setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
        setBranches([]);
        setUnits([]);
        setTeams([]);
        setSelectedOptionsCompanyAdd([]);
        setSelectedOptionsDepartmentAdd([]);
        setSelectedOptionsBranchAdd([]);
        setSelectedOptionsUnitAdd([]);
        setSelectedOptionsTeamAdd([]);
        setValueCompanyAdd("");
        setValueDepartmentAdd("");
        setValueBranchAdd("");
        setValueUnitAdd("");
        setValueTeamAdd("");
        setDepartmentShow(true);
        setBranchShow(true);
        setShowAlert(
            <>
                <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };

    // add function
    const sendRequest = async () => {
        setIsBtn(true);
        let result = []
        try {
           
            result.push({
                company: [...valueCompanyAdd],
                branch: [...valueBranchAdd],
                unit: [...valueUnitAdd],
                team: [...valueTeamAdd],
                departmenttype: String(shiftRoasterAdd.departmenttype),
                department: shiftRoasterAdd.departmenttype == "Department Month" ? shiftRoasterAdd.department : [...valueDepartmentAdd],
                month: String(isMonthyear.ismonth.value),
                year: String(isMonthyear.isyear.value),
                repeatinterval: Number(overallsettings),
                shifttype: String(shiftRoasterAdd.shifttype),
                fromdate: String(shiftRoasterAdd.fromdate),
                todate: String(shiftRoasterAdd.todate),
            })

            setAllShiftRoasters(result);
            allShiftRoastersCheck(false);
            setShiftRoasterAdd({
                ismonth: month, isyear: currentYear, department: 'Choose Department', departmenttype: "Choose Department Type",
                shifttype: "Choose Type", fullweek: 'Choose Week', fromdate: "", todate: ""
            });
            setSelectedOptionsCompanyAdd([]);
            setSelectedOptionsDepartmentAdd([]);
            setSelectedOptionsBranchAdd([]);
            setSelectedOptionsUnitAdd([]);
            setSelectedOptionsTeamAdd([]);
            setValueCompanyAdd("");
            setValueDepartmentAdd("");
            setValueBranchAdd("");
            setValueUnitAdd("");
            setValueTeamAdd("");
            setDepartmentShow(true);
            setBranchShow(true);
            setShowAlert(
                <>
                    <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Generated Successfully!</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {allShiftRoastersCheck(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        // let check = allShiftRoasters.some((data) => data.company == shiftRoasterAdd.company && data.branch == shiftRoasterAdd.branch &&
        //     data.unit == shiftRoasterAdd.unit && data.team == shiftRoasterAdd.team && data.department == shiftRoasterAdd.department &&
        //     data.shifttype == shiftRoasterAdd.shifttype && data.fromdate == shiftRoasterAdd.fromdate && data.todate == shiftRoasterAdd.todate)

        if (selectedOptionsCompanyAdd.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsBranchAdd.length === 0 && shiftRoasterAdd.departmenttype === "Choose Department Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Branch or Department"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            if (branchShow) {
                if (selectedOptionsBranchAdd.length === 0) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Branch"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (selectedOptionsUnitAdd.length === 0) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Unit"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (selectedOptionsTeamAdd.length === 0) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Team"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (shiftRoasterAdd.shifttype == "Choose Type") {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Type"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (shiftRoasterAdd.shifttype == "For Week" && shiftRoasterAdd.fullweek == "Choose Week") {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Week"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else {
                    setIsBtn(true);
                    sendRequest();
                }
            }
            else {
                if (shiftRoasterAdd.departmenttype == "Choose Department Type") {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Department Type"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (selectedOptionsDepartmentAdd.length === 0 && shiftRoasterAdd.department === "Choose Department") {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Department"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (shiftRoasterAdd.shifttype == "Choose Type") {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Type"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else if (shiftRoasterAdd.shifttype == "For Week" && shiftRoasterAdd.fullweek == "Choose Week") {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Week"}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                else {
                    setIsBtn(true);
                    sendRequest();
                }
            }
        }
    };

    useEffect(() => {
        // getexcelDatas();
    }, [shiftRoasterEdit, shiftRoasterAdd, allShiftRoasters]);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const addSerialNumber = () => {
        const itemsWithSerialNumber = allShiftRoasters?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [allShiftRoasters]);

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

    // datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: { fontWeight: "bold", },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable?.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable?.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.row.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.row.id)) {
        //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.row.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(updatedSelectedRows?.length === filteredData?.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 75,
        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "companylist", headerName: "Company", flex: 0, width: 120, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branchlist", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unitlist", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "teamlist", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "departmentlist", headerName: "Department", flex: 0, width: 120, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 100, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "todate", headerName: "To Date", flex: 0, width: 100, hide: !columnVisibility.todate, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eshiftroaster") && (
                        // <Button
                        //     // sx={userStyle.buttonedit}
                        //     variant="contained"
                        //     color="primary"
                        //     sx={{ fontSize: '12px', height: '25px', marginTop: '0px', marginRight: '5px' }}
                        //     onClick={() => {
                        //         handleClickOpenEditSetlist();
                        //         getCode(params.row.id, params.row.name);
                        //     }}
                        // >
                        //     {/* <EditOutlinedIcon style={{ fontsize: "large" }} /> */}
                        //     Set
                        // </Button>
                        // <Link to={`/shiftroaster/${params.row.id}`}>
                        <Button variant="contained" color="primary" size="small" sx={{ fontSize: '12px', height: '25px', marginTop: '0px', marginRight: '5px' }}
                            onClick={() => {
                                fetchSingleShiftRoasterSet();
                            }}
                        >
                            View
                        </Button>
                        // </Link>

                    )}
                    {/* {isUserRoleCompare?.includes("dshiftroaster") && (
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ fontSize: '12px', height: '25px', marginTop: '0px', marginRight: '5px' }}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            Delete
                        </Button>
                    )} */}
                    {/* {isUserRoleCompare?.includes("vshiftroaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ishiftroaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )} */}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {
            id: index + 1,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            departmenttype: item.departmenttype,
            fromdate: item.fromdate,
            todate: item.todate,
            companylist: item.company.join(",").toString(),
            branchlist: item.branch.join(",").toString(),
            unitlist: item.unit.join(",").toString(),
            teamlist: item.team.join(",").toString(),
            departmentlist: item.departmenttype == "Department Month" ? item.department : item.department.join(",").toString()
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
                    {filteredColumns?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
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

    const [userRole, setUserRole] = useState([])
    const [userBoardingLogLastIndex, setUserBoardingLogLastIndex] = useState({})

    //get single row to edit....
    const fetchSingleShiftRoasterSet = async () => {
        handleClickOpenEditSetlist();
        try {
            const [resuser,res_shift] = await Promise.all([
                axios.get(SERVICE.USER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.SHIFT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                })
            ])
            const users = resuser?.data?.users || [];
            const shiftRoasters = allShiftRoasters || [];
            const shifttime = res_shift?.data?.shifts || [];

            let result = users
                .filter((user) =>
                    shiftRoasters.some(
                        (shiftRoaster) =>
                            (shiftRoaster.company.includes(user.company) &&
                                shiftRoaster.branch.includes(user.branch) &&
                                shiftRoaster.unit.includes(user.unit) &&
                                shiftRoaster.team.includes(user.team)) ||
                            (shiftRoaster.company.includes(user.company) &&
                                shiftRoaster.department.includes(user.department))
                    )
                )
                .map((matchedUser) => {

                    const findShiftTiming = (shiftName) => {
                        const foundShift = shifttime.find((d) => d.name === shiftName);
                        return foundShift
                            ? `${foundShift.fromhour}:${foundShift.frommin}${foundShift.fromtime}to${foundShift.tohour}:${foundShift.tomin}${foundShift.totime}`
                            : '';
                    };

                    const matchingShiftRoasters = shiftRoasters.filter(
                        (shiftRoaster) =>
                            (shiftRoaster.company.includes(matchedUser.company) &&
                                shiftRoaster.branch.includes(matchedUser.branch) &&
                                shiftRoaster.unit.includes(matchedUser.unit) &&
                                shiftRoaster.team.includes(matchedUser.team)) ||
                            (shiftRoaster.company.includes(matchedUser.company) &&
                                shiftRoaster.department.includes(matchedUser.department))
                    );

                    // Assuming matchedUser.weekoff is an array of week-off days like ["Sunday", "Monday"]
                    const isWeekOff = matchedUser.weekoff && matchedUser.weekoff.some((day) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(day));

                    return matchingShiftRoasters.map((shiftRoaster) => ({
                        userid: matchedUser._id,
                        company: matchedUser.company,
                        branch: matchedUser.branch,
                        unit: matchedUser.unit,
                        team: matchedUser.team,
                        department: matchedUser.department,
                        username: matchedUser.companyname,
                        empcode: matchedUser.empcode,
                        boardingLog: matchedUser.boardingLog,
                        shifttiming: findShiftTiming(matchedUser.shifttiming),
                        shifttype: shiftRoaster.shifttype,
                        fromdate: shiftRoaster.fromdate,
                        todate: shiftRoaster.todate,
                        status: isWeekOff ? "Week Off" : "Manual",
                        weekoff: matchedUser.weekoff,
                    }));
                })
                .flat(); // Flatten the nested array

            setComparedUsersSetlist(result);
            setAllSetCheckSetlist(true);
        } catch (err) {setAllSetCheckSetlist(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get all shifts
    const fetchShiftGroup = async () => {
        try {
            let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setShiftDayOptions(
                res_shiftGroupings?.data?.shiftgroupings.map((data) => ({
                    ...data,
                    label: `${data.shiftday}_${data.shifthours}`,
                    value: `${data.shiftday}_${data.shifthours}`,
                }))
            );

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchShiftGroup();
    }, [])

    // get all shifts name based on shiftgroup
    const fetchShiftFromShiftGroup = async (value) => {
        try {

            let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let dayString = value?.split('_')[0];
            let hoursString = value?.split('_')[1];

            let grpresult = res_shiftGroupings?.data?.shiftgroupings
                ?.filter(item => item.shiftday === dayString && item.shifthours === hoursString)
                ?.map(item => item.shift)
                .flat();

            setShifts(
                grpresult?.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const getShiftTime = async (value) => {
        try {
            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setAllShifts(res_shift?.data?.shifts)
            res_shift?.data?.shifts.map((d) => {
                if (d.name == value) {
                    if (shiftRoasterEdit.secondmode !== 'Double Shift') {
                        setShiftTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                        setShiftAllows(d.isallowance)
                        // setGetAdjShiftTypeTime("")
                        // setGetChangeShiftTypeTime("")
                    }
                    else {
                        setSecondShiftTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                        // setGetAdjShiftTypeTime("")
                        // setGetChangeShiftTypeTime("")
                    }
                }
            })
            res_shift?.data?.shifts.map((d) => {
                if (d.name == value) {
                    if (shiftRoasterUserEdit.adjustmenttype == "Add On Shift") {
                        setGetAdjShiftTypeTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                        // setShiftTime("")
                        // setSecondShiftTime("")
                    }
                    else {
                        setGetChangeShiftTypeTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                        // setShiftTime("")
                        // setSecondShiftTime("")
                    }
                }
            })
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // Function to calculate working hours between two time strings
    const calculateWorkingHours = (startTime, endTime) => {

        const parseTime = (timeString) => {
            const [time, period] = timeString.split(/([aApP][mM])/);
            const [hours, minutes] = time.split(':').map(Number);

            return {
                hours,
                minutes,
                period: period ? period.toUpperCase() : undefined,
            };
        };

        const { hours: startHour, minutes: startMinute, period: startPeriod } = parseTime(startTime);
        const { hours: endHour, minutes: endMinute, period: endPeriod } = parseTime(endTime);

        // Convert both start and end times to minutes
        const startMinutes = (startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startHour) * 60 + startMinute;
        const endMinutes = (endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endHour) * 60 + endMinute;

        // Calculate the difference in minutes
        let differenceInMinutes = endMinutes - startMinutes;

        // Handle cases where end time is before start time (e.g., night shifts)
        if (differenceInMinutes < 0) {
            differenceInMinutes += 24 * 60; // Assuming a 24-hour day
        }

        // Convert the difference back to hours and minutes
        const hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;

        return `${hours}:${minutes}`;
    };

    const handleSecondModeChange = (e) => {
        if (e.value === 'Double Shift') {
            setShiftRoasterEdit({ ...shiftRoasterEdit, secondmode: e.value, shift: "Choose Shift" });
            const shiftTimeParts = shiftTime.split(' - ');

            if (shiftTimeParts.length === 2) {
                const startTime = shiftTimeParts[0];
                const endTime = shiftTimeParts[1];

                // Convert the time strings to 24-hour format
                const convertTo24HourFormat = (timeString) => {
                    const [time, period] = timeString.split(/([aApP][mM])/);
                    const [hours, minutes] = time.split(':').map(Number);
                    return period.toUpperCase() === 'PM' ? { hours: hours + 12, minutes } : { hours, minutes };
                };

                const start24 = convertTo24HourFormat(startTime);
                const end24 = convertTo24HourFormat(endTime);

                // Create Date objects manually
                const startDate = new Date(2000, 0, 1, start24.hours, start24.minutes);
                const endDate = new Date(2000, 0, 1, end24.hours, end24.minutes);

                // Extract hours and minutes from Date objects
                const startHour = startDate.getHours();
                const startMinute = startDate.getMinutes();
                const endHour = endDate.getHours();
                const endMinute = endDate.getMinutes();

                // Convert both start and end times to minutes
                const startMinutes = startHour * 60 + startMinute;
                const endMinutes = endHour * 60 + endMinute;

                // Calculate the difference in minutes
                let differenceInMinutes = endMinutes - startMinutes;

                // Handle cases where end time is before start time (e.g., night shifts)
                if (differenceInMinutes < 0) {
                    differenceInMinutes += 24 * 60; // Assuming a 24-hour day
                }

                // Convert the difference back to hours and minutes
                const hours = Math.floor(differenceInMinutes / 60);
                const minutes = differenceInMinutes % 60;

                const workingHours = `${hours}:${minutes}`;

                // Filter shifts with the same working hours
                const filteredWorkingHours = allShifts?.filter((shift) => {
                    const shiftStartTime = `${shift.fromhour}:${shift.frommin}${shift.fromtime}`;
                    const shiftEndTime = `${shift.tohour}:${shift.tomin}${shift.totime}`;

                    const shiftWorkingHours = calculateWorkingHours(shiftStartTime, shiftEndTime);

                    // Compare working hours using the calculated working hours
                    return shiftWorkingHours === workingHours;
                });

                // Now, filter out shifts that start after the calculated end time
                const filteredShiftsAfterEndTime = filteredWorkingHours?.filter((shift) => {
                    const shiftStartTime = `${shift.fromhour}:${shift.frommin}${shift.fromtime}`;
                    const shiftEndTime = `${shift.tohour}:${shift.tomin}${shift.totime}`;

                    const shiftStartTime24 = convertTo24HourFormat(shiftStartTime);
                    const shiftEndTime24 = convertTo24HourFormat(shiftEndTime);

                    const shiftStartMinutes = shiftStartTime24.hours * 60 + shiftStartTime24.minutes;
                    const shiftEndMinutes = shiftEndTime24.hours * 60 + shiftEndTime24.minutes;

                    // // Handle shifts that span across midnight
                    // if (shiftEndMinutes < shiftStartMinutes) {
                    //     return shiftStartMinutes >= endMinutes || shiftEndMinutes > endMinutes;
                    // }

                    // // Filter out shifts that start after the calculated end time or partially overlap
                    // return (
                    //     (shiftStartMinutes >= endMinutes && shiftStartMinutes < startMinutes) ||
                    //     (shiftStartMinutes < endMinutes && shiftEndMinutes > endMinutes)
                    // );

                    if ((shiftEndMinutes < shiftStartMinutes) && shiftStartMinutes >= endMinutes || shiftEndMinutes > endMinutes) {
                        // if (shiftStartMinutes >= endMinutes || shiftEndMinutes > endMinutes) {
                        //     return true;
                        // }
                        // if (shiftStartMinutes < startMinutes && shiftEndMinutes > endMinutes) {
                        //     return true;
                        // }

                        // if ((shiftStartMinutes >= endMinutes && shiftStartMinutes < startMinutes)) {
                        //     return true;
                        // }
                        return true;
                    }

                });

                const filteredShifts = filteredShiftsAfterEndTime?.map((shift) => ({
                    ...shift,
                    label: shift.name,
                    value: shift.name,
                })) || [];

                setShiftsFiltered(filteredShifts);

            } else {
            }
        }
        else {

            const filteredShifts = shifts?.map((shift) => ({
                ...shift,
                label: shift.name,
                value: shift.name,
            })) || [];

            setShifts(filteredShifts);
        };
    }

    const getWeekOfMonthSetlist = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const days = date.getDate() + firstDay.getDay() - 1;
        return Math.ceil(days / 7);
    };

    // Helper function to format date as "YYYY-MM-DD"
    const formatDateRenderDate = (input) => {
        if (!input) {
            return null; // or handle it as per your requirement
        }

        const [day, month, year] = input.split('-');
        return `${year}-${month}-${day}`;
    };

    const renderDateColumnsSetlist = (fromDate, toDate, shiftType, selectedWeek, empCode) => {

        let formatDateFinalFromDate = formatDateRenderDate(fromDate);
        let formatDateFinalToDate = formatDateRenderDate(toDate);

        const columns = [];
        let currentDate = new Date(formatDateFinalFromDate);
        let dayCount = 1;

        while (currentDate <= new Date(formatDateFinalToDate)) {

            columns.push({
                date: currentDate.toISOString(),
                formattedDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
                dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                weekOfMonth: getWeekOfMonthSetlist(currentDate),
                dayCount: dayCount,
                empCode: empCode,
            });
            currentDate.setDate(currentDate.getDate() + 1);
            dayCount++;
        }

        return columns;
    };

    const filteredColumnsSetTable = renderDateColumnsSetlist(
        comparedUsersSetlist[0]?.fromdate,
        comparedUsersSetlist[0]?.todate,
        comparedUsersSetlist[0]?.shifttype,
        parseInt(filter.weeks[0], 10),
        comparedUsersSetlist[0]?.empcode,
    );

    const handleSelectionChangeSetlist = (newSelection) => {
        setSelectedRowsSetlist(newSelection.selectionModel);
    };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = comparedUsersSetlist?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsSetTable(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberSetTable();
    }, [comparedUsersSetlist]);

    // Datatable
    const handlePageChangeSetTable = (newPage) => {
        setPageSetTable(newPage);
    };

    const handlePageSizeChangeSetTable = (event) => {
        setPageSizeSetTable(Number(event.target.value));
        setPageSetTable(1);
    };

    // datatable....
    const handleSearchChangeSetTable = (event) => {
        setSearchQuerySetTable(event.target.value);
    };

    // Split the search query into individual terms
    const searchTermsSetTable = searchQuerySetTable.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasSetTable = itemsSetTable?.filter((item) => {
        return searchTermsSetTable.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataSetTable = filteredDatasSetTable?.slice((pageSetTable - 1) * pageSizeSetTable, pageSetTable * pageSizeSetTable);

    const totalPagesSetTable = Math.ceil(filteredDatasSetTable?.length / pageSizeSetTable);

    const visiblePagesSetTable = Math.min(totalPagesSetTable, 3);

    const firstVisiblePageSetTable = Math.max(1, pageSetTable - 1);
    const lastVisiblePageSetTable = Math.min(firstVisiblePageSetTable + visiblePagesSetTable - 1, totalPagesSetTable);

    const pageNumbersSetTable = [];

    const indexOfLastItemSetTable = pageSetTable * pageSizeSetTable;
    const indexOfFirstItemSetTable = indexOfLastItemSetTable - pageSizeSetTable;

    for (let i = firstVisiblePageSetTable; i <= lastVisiblePageSetTable; i++) {
        pageNumbersSetTable.push(i);
    }

    const handleShiftAllot = (data, rowdata) => {

        const check = rowdata.days.find((d) => d.formattedDate === data.formattedDate)

        handleClickOpenEdit();
        let newobj = {
            ...data,
            userid: rowdata.userid,
            company: rowdata.company,
            branch: rowdata.branch,
            unit: rowdata.unit,
            team: rowdata.team,
            department: rowdata.department,
            empcode: rowdata.empcode,
            shifttiming: rowdata.shifttiming,
            username: rowdata.username,
            weekoff: rowdata.weekoff,
            // mode: (rowdata.weekoff?.includes(data.dayName) || rowdata.mode === 'Week Off') ? "Week Off" : "Shift",
            // shiftgrptype: "Choose Day/Night",
            // shift: "Choose Shift",
            // firstshift: "",
            // secondmode: "Choose Second Shift",
            // pluseshift: "",
            selectedCellShift: check ? check.shiftlabel : '',
            status: "",
            mode: check ? check.mode : (rowdata.weekoff?.includes(data.dayName) ? 'Week Off' : 'Shift'),
            shiftgrptype: check ? check.shiftgrptype : 'Choose Day/Night',
            shift: check ? check.shift : 'Choose Shift',
            firstshift: check ? check.firstshift : '',
            secondmode: check ? check.secondmode : 'Choose Second Shift',
            pluseshift: check ? check.pluseshift : '',
            shiftallows: check ? check.shiftallows : '',
        }

        setShiftRoasterEdit(newobj);
        getCode(rowdata.empcode);

    }

    //get single row to edit....
    const getCodeAdjustment = async (rowdata) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${rowdata.userid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // Get the current date and time
            const currentTime = new Date();

            // Format the current time as "12:35 PM"
            const formattedTime = format(currentTime, 'h:mm a');

            res?.data?.suser.shiftallot.filter((d) => {
                setShiftRoasterUserEdit({
                    ...d,
                    adjfirstshiftmode: shiftRoasterUserEdit.firstshift !== "" ? "First Shift" : "",
                    adjfirstshifttime: shiftRoasterUserEdit.firstshift,
                    adjustmenttype: "Add On Shift",
                    adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "",
                    adjchangereason: "",
                    adjdate: formatDateForDate(currentTime),
                    adjtypeshift: "Choose Shift",
                    adjtypeshifttime: "",
                    adjtypereason: "",
                    adjapplydate: formatDateForDate(currentTime),
                    adjapplytime: String(formattedTime),
                })
            })

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Clear
    const handleClearSetlist = () => {
        setShiftTime("");
        setSecondShiftTime("");
        setShiftRoasterEdit({
            ...shiftRoasterEdit,
            mode: "Shift", shift: "Choose Shift", firstshift: "", secondmode: "Choose Second Shift", pluseshift: ""
        });

    };

    //get single row to edit....
    const getCode = async (value) => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            res?.data?.users?.filter((user) => {
                if (user.empcode == value) {
                    setGetUpdateID(user._id);
                    setGetShiftAllot(user.shiftallot)
                    // setUpdateBy(user.updateby) 
                }
            })
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchUsers = async () => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let resultshiftallot = []
            res.data.users.map(user =>
                user.shiftallot.map(allot => {
                    resultshiftallot.push({ ...allot })
                })
            );
            setAllUserDates(resultshiftallot)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const sendRequestSetlist = async () => {
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${getUpdateID}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftallot: [
                    ...getShiftAllot,
                    {
                        userid: String(shiftRoasterEdit.userid),
                        company: String(shiftRoasterEdit.company),
                        branch: String(shiftRoasterEdit.branch),
                        unit: String(shiftRoasterEdit.unit),
                        team: String(shiftRoasterEdit.team),
                        department: String(shiftRoasterEdit.department),
                        username: String(shiftRoasterEdit.username),
                        empcode: String(shiftRoasterEdit.empcode),
                        shifttiming: String(shiftRoasterEdit.shifttiming),
                        date: String(shiftRoasterEdit.formattedDate),
                        day: String(shiftRoasterEdit.dayName),
                        daycount: String(shiftRoasterEdit.dayCount),
                        mode: String(shiftRoasterEdit.mode),
                        shiftgrptype: String(shiftRoasterEdit.shiftgrptype),
                        shift: String(shiftRoasterEdit.shift),
                        firstshift: String(shiftTime),
                        secondmode: String(shiftRoasterEdit.secondmode),
                        pluseshift: String(secondShiftTime),
                        status: String(shiftRoasterEdit.mode == "Week Off" ? "Week Off" : "Manual"),
                        shiftallows: String(shiftAllows),
                        weekoff: [...shiftRoasterEdit.weekoff],
                        adjustmentstatus: false,
                        // adjfirstshiftmode: String(shiftTime !== "" ? "First Shift" : ""),
                        // adjfirstshifttime: String(shiftTime),
                        // adjustmenttype: String(shiftRoasterEdit.adjustmenttype == undefined ? "" : shiftRoasterEdit.adjustmenttype),
                        // adjchangeshift: String(shiftRoasterEdit.adjchangeshift == undefined ? "" : shiftRoasterEdit.adjchangeshift),
                        // adjchangeshiftime: String(shiftRoasterEdit.adjchangeshiftime == undefined ? "" : shiftRoasterEdit.adjchangeshiftime),
                        // adjchangereason: String(shiftRoasterEdit.adjchangereason == undefined ? "" : shiftRoasterEdit.adjchangereason),
                        // adjdate: String(shiftRoasterEdit.adjdate == undefined ? "" : shiftRoasterEdit.adjdate),
                        // adjtypeshift: String(shiftRoasterEdit.adjtypeshift == undefined ? "" : shiftRoasterEdit.adjtypeshift),
                        // adjtypeshifttime: String(shiftRoasterEdit.adjtypeshifttime == undefined ? "" : shiftRoasterEdit.adjtypeshifttime),
                        // adjtypereason: String(shiftRoasterEdit.adjtypereason == undefined ? "" : shiftRoasterEdit.adjtypereason),
                        // adjapplydate: String(shiftRoasterEdit.adjapplydate == undefined ? "" : shiftRoasterEdit.adjapplydate),
                        // adjapplytime: String(shiftRoasterEdit.adjapplytime == undefined ? "" : shiftRoasterEdit.adjapplytime),
                        // adjstatus: String("Not Adjusted"),
                    }
                ],

                // updatedby: [...updateBy, { name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
            });
            await fetchUsers();
            handleCloseEdit();
            setShowAlert(
                <>
                    <CheckCircleOutlinedIcon sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Alloted Successfully!</p>
                </>
            );
            handleClickOpenerr();
            // setShiftRoasterAdd({
            //     ...shiftRoasterAdd,
            //     branch: "Please Select Branch", unit: "Please Select Unit", team: "Please Select Team", department: "Please Select Department"
            // })
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleSubmitUpdateManual = () => {
        if (shiftRoasterEdit.mode === 'Shift') {
            if (shiftRoasterEdit.shiftgrptype === 'Choose Day/Night') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift (Day/Night))"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterEdit.shift === 'Choose Shift') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftTime === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Shift Hours"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterEdit.secondmode !== 'Choose Second Shift' && secondShiftTime === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Second Shift Hours"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequestSetlist();
            }
        }
        else if (shiftRoasterEdit.mode === 'Week Off') {
            sendRequestSetlist();
        }
    }
    // Show All Columns & Manage Columns
    const initialColumnVisibilitySetlist = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        username: true,
        shifttiming: true,
        ...filteredColumnsSetTable.reduce((acc, day, index) => {
            acc[`${day.formattedDate} ${day.dayName} Day ${day.dayCount}`] = true;
            return acc;
        }, {}),
    };

    const [columnVisibilitySetlist, setColumnVisibilitySetlist] = useState({
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        username: true,
        shifttiming: true,
        ...filteredColumnsSetTable.reduce((acc, day, index) => {
            const dateKey = `${day.formattedDate} ${day.dayName} Day ${day.dayCount}`;
            acc[dateKey] = true;
            return acc;
        }, {}),
    });

    const CheckboxHeaderSetlist = ({ selectAllCheckedSetlist, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllCheckedSetlist} onChange={onSelectAll} />
        </div>
    );

    const formatDateBoardingLog = (inputDate) => {
        // Assuming inputDate is in the format "yyyy-mm-dd"
        const [year, month, day] = inputDate?.split('-');

        // Use parseInt to remove leading zeros, and then convert back to string
        const formattedDay = String(parseInt(day, 10));
        const formattedMonth = String(parseInt(month, 10));

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    const currentDate1Allot = new Date();

    const getShiftForDateAllot = (column, matchingItem, shifttiming, boardingLog, isWeekOff) => {
        if (matchingItem && matchingItem.status === 'Manual') {
            return matchingItem.firstshift;
        }
        else if (matchingItem && matchingItem.status === 'Week Off') {
            return ""
        }
        // else if (boardingLog.length > 0) {
        //     if (!lastShiftTimingDate) {
        //         return ""
        //     }
        //     const formattedLastShiftTimingDate = formatDateBoardingLog(lastShiftTimingDate);

        //     const [day, month, year] = formattedLastShiftTimingDate?.split('/');
        //     // Use padStart to add leading zeros
        //     const formattedDay = String(day)?.padStart(2, '0');
        //     const formattedMonth = String(month)?.padStart(2, '0');


        //     // // Map through each column and compare dates
        //     // const shifts = filteredColumnsSetTable.map((currentColumn) => {

        //     //     const [day1, month1, year1] = currentColumn.formattedDate?.split('/');

        //     //     // Use padStart to add leading zeros
        //     //     const formattedDay1 = String(day1)?.padStart(2, '0');
        //     //     const formattedMonth1 = String(month1)?.padStart(2, '0');

        //     //     // Compare dates without checking month or year
        //     //     if (year >= year1 && formattedMonth >= formattedMonth1 && formattedDay > formattedDay1) {
        //     //         return !isWeekOff ? shifttiming : "";
        //     //     }
        //     //     else {
        //     //         return !isWeekOff ? lastShiftTiming : "";
        //     //     }

        //     // })
        //     const shifts = filteredColumnsSetTable?.map((currentColumn) => {
        //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
        //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
        //         const [shiftYear, shiftMonth, shiftDay] = lastShiftTimingDate?.split('-').map(Number);
        //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);

        //         if (shiftFormattedDate >= columnFormattedDate) {
        //             return !isWeekOff ? shifttiming : "";
        //         } else {
        //             return !isWeekOff ? lastShiftTiming : "";
        //         }
        //     });
        //     // Return the shift value for the current column
        //     return shifts[column.dayCount - 1];
        // }

        // else if (boardingLog?.length > 0) {
        //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');

        //     const formattedcolumnDay = String(columnDay)?.padStart(2, '0');
        //     const formattedcolumnMonth = String(columnMonth)?.padStart(2, '0');

        //     const finalDate = `${columnYear}-${formattedcolumnMonth}-${formattedcolumnDay}`;

        //     // Filter boardingLog entries for the same start date
        //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

        //     // If there are entries for the date, return the shift timing of the second entry
        //     if (entriesForDate.length > 1) {
        //         return entriesForDate[1].shifttiming;
        //     }

        //     // Find the most recent boarding log entry that is less than or equal to the selected date
        //     const recentLogEntry = boardingLog
        //         .filter(log => log.startdate <= finalDate)
        //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        //     // If a recent log entry is found, return its shift timing
        //     if (recentLogEntry) {
        //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
        //     } else {
        //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
        //         return !isWeekOff ? shifttiming : "Week Off";
        //     }
        // }

        else if (boardingLog.length > 0) {

            // Remove duplicate entries with recent entry
            const uniqueEntries = {};
            boardingLog.forEach(entry => {
                const key = entry.startdate;
                if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                    uniqueEntries[key] = entry;
                }
            });
            const uniqueBoardingLog = Object.values(uniqueEntries);

            const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
            const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;


            // Find the relevant log entry for the given date     
            const relevantLogEntry = uniqueBoardingLog
                .filter(log => log.startdate < finalDate)
                .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

            if (relevantLogEntry) {
                // Daily
                if (relevantLogEntry.shifttype === 'Daily' || relevantLogEntry.shifttype === undefined) {
                    // If shift type is 'Daily', return the same shift timing for each day
                    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                }

                // 1 Week Rotation 2nd try working code
                if (relevantLogEntry.shifttype === '1 Week Rotation') {
                    for (const data of relevantLogEntry.todo) {
                        const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                        if (data.week === columnWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                // 2 Week Rotation 2nd try working code  
                if (relevantLogEntry.shifttype === '2 Week Rotation') {
                    const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                    // Get the day name of the start date
                    const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                    // Calculate the day count until the next Sunday
                    let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                    // Calculate the week number based on the day count
                    let weekNumber = Math.ceil((7 - dayCount) / 7);

                    // Adjust the week number considering the two-week rotation
                    const logStartDate = new Date(relevantLogEntry.startdate);
                    const currentDate = new Date(finalDate);

                    const diffTime = Math.abs(currentDate - logStartDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                    // Determine the final week based on the calculated week number                    
                    const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                // 1 Month Rotation 1st try working code
                if (relevantLogEntry.shifttype === '1 Month Rotation') {
                    for (const data of relevantLogEntry.todo) {
                        if (data.week === column.weekNumberInMonth && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                // 2 Month Rotation // working code
                // if (relevantLogEntry.shifttype === '2 Month Rotation') {
                //     const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                //     // Calculate the difference in months between start date and column formattedDate
                //     const startMonth = startDate.getMonth() + 1;
                //     const monthDiff = (columnYear - startDate.getFullYear()) * 12 + columnMonth - startMonth + 1;

                //     // Determine the final week based on month and week number
                //     let finalWeek;
                //     if (monthDiff % 2 === 0) {
                //         finalWeek = (
                //             column.weekNumberInMonth === '1st Week' ? '6th Week' :
                //                 column.weekNumberInMonth === '2nd Week' ? '7th Week' :
                //                     column.weekNumberInMonth === '3rd Week' ? '8th Week' :
                //                         column.weekNumberInMonth === '4th Week' ? '9th Week' :
                //                             column.weekNumberInMonth === '5th Week' ? '10th Week' :
                //                                 column.weekNumberInMonth // If not in the first five weeks, keep it the same
                //         );
                //     } else {
                //         finalWeek = column.weekNumberInMonth; // If the start month is odd, keep the week number the same
                //     }

                //     for (const data of relevantLogEntry.todo) {
                //         // Check if the adjusted week matches the column week and day
                //         if (data.week === finalWeek && data.day === column.dayName) {
                //             return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                //         }
                //     }
                // }


                // working code justnow 10-05-2024
                if (relevantLogEntry.shifttype === '2 Month Rotation') {
                    const [year, month, day] = relevantLogEntry.startdate.split('-').map(Number);

                    // Calculate the next month after the start date
                    const start = new Date(year, month, day + 1);
                    const currentDate = new Date(finalDate);

                    // Calculate the month count from the next month after the start date
                    const monthDiff = (currentDate.getFullYear() - start.getFullYear()) * 12 + currentDate.getMonth() - start.getMonth() + 1;


                    // Determine the final week based on the month count
                    let finalWeek;
                    if (monthDiff % 2 === 0) {
                        // Odd months return the column.weekNumberInMonth value
                        finalWeek = column.weekNumberInMonth;

                    } else {
                        // Adjust the week number accordingly for even months
                        finalWeek = (
                            column.weekNumberInMonth === '1st Week' ? '6th Week' :
                                column.weekNumberInMonth === '2nd Week' ? '7th Week' :
                                    column.weekNumberInMonth === '3rd Week' ? '8th Week' :
                                        column.weekNumberInMonth === '4th Week' ? '9th Week' :
                                            column.weekNumberInMonth === '5th Week' ? '10th Week' :
                                                column.weekNumberInMonth // If not in the first five weeks, keep it the same
                        );
                    }

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

            }
            else {
                // If no date satisfies the condition, return actualShiftTiming
                return !isWeekOff ? shifttiming : "Week Off";
            }
        }


        else {
            // If no date satisfies the condition, return shifttiming
            return !isWeekOff ? shifttiming : "Week Off";
        }
    }


    const columnDataTableSetlist = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: { fontWeight: "bold", },
        //     renderHeader: (params) => (
        //         <CheckboxHeaderSetlist
        //             selectAllCheckedSetlist={selectAllCheckedSetlist}
        //             onSelectAll={() => {
        //                 if (rowDataTableSetlist?.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllCheckedSetlist) {
        //                     setSelectedRowsSetlist([]);
        //                 } else {
        //                     const allRowIds = rowDataTableSetlist?.map((row) => row.id);
        //                     setSelectedRowsSetlist(allRowIds);
        //                 }
        //                 setSelectAllCheckedSetlist(!selectAllCheckedSetlist);
        //             }}
        //         />
        //     ),

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRowsSetlist.includes(params.row.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRowsSetlist.includes(params.row.id)) {
        //                     updatedSelectedRows = selectedRowsSetlist.filter((selectedId) => selectedId !== params.row.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRowsSetlist, params.row.id];
        //                 }

        //                 setSelectedRowsSetlist(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllCheckedSetlist(updatedSelectedRows?.length === filteredDataSetTable?.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 75,
        //     hide: !columnVisibilitySetlist.checkbox,
        //     headerClassName: "bold-header",
        // },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilitySetlist.serialNumber, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 120, hide: !columnVisibilitySetlist.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibilitySetlist.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilitySetlist.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibilitySetlist.team, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 120, hide: !columnVisibilitySetlist.department, headerClassName: "bold-header" },
        { field: "username", headerName: "Name", flex: 0, width: 100, hide: !columnVisibilitySetlist.username, headerClassName: "bold-header" },
        // { field: "shifttiming", headerName: "Shift", flex: 0, width: 100, hide: !columnVisibilitySetlist.shifttiming, headerClassName: "bold-header" },
        // ...filteredColumnsSetTable.map((column, index) => ({
        //     field: `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`,
        //     headerName: `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`,
        //     hide: !columnVisibilitySetlist[`${column.formattedDate} ${column.dayName} Day ${column.dayCount}`],
        //     flex: 0,
        //     width: 100,
        //     sortable: false,
        //     renderCell: (params) => {
        //         // Move the variable declaration outside the JSX
        //         let filteredRowData = allUserDates.filter((val) => val.empcode == params.row.empcode);
        //         const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);

        //         return (
        //             <StyledTableCell>
        //                 <Button
        //                     // color={matchingItem && matchingItem.status === 'Manual' ? 'rgb(30, 70, 32)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(30, 70, 32)'}
        //                     variant="contained"
        //                     size="small"
        //                     sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.575rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: matchingItem && matchingItem.status === 'Manual' ? '3px 8px' : params.row.weekoff?.includes(column.dayName) ? '3px 10px' : '3px 8px',
        //                         color: matchingItem && matchingItem.status === 'Week Off' ? '#892a23' : matchingItem && matchingItem.status === 'Manual' ? '#052106' : params.row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
        //                         backgroundColor: matchingItem && matchingItem.status === 'Week Off' ? 'rgb(243 174 174)' : matchingItem && matchingItem.status === 'Manual' ? 'rgb(156 239 156)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
        //                         pointerEvents: matchingItem && matchingItem.status === 'Manual' ? 'none' : 'auto',
        //                         '&:hover': {
        //                             color: matchingItem && matchingItem.status === 'Week Off' ? '#892a23' : matchingItem && matchingItem.status === 'Manual' ? '#052106' : params.row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
        //                             backgroundColor: matchingItem && matchingItem.status === 'Week Off' ? 'rgb(243 174 174)' : matchingItem && matchingItem.status === 'Manual' ? 'rgb(156 239 156)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
        //                         }
        //                     }}
        //                     onClick={(e) => {
        //                         if (matchingItem && matchingItem.status === 'Manual'
        //                             // params.row.weekoff?.includes(column.dayName)
        //                         ) {
        //                             // Handle the case when the status is 'Manual'
        //                         } else {
        //                             handleShiftAllot(column, params.row);
        //                         }

        //                     }}
        //                 >
        //                     {params.row.days[index].status}
        //                 </Button>
        //                 <Typography variant="body2" sx={{ fontSize: '8px' }}>
        //                     {params.row.days[index].shiftlabel}
        //                 </Typography>
        //             </StyledTableCell >
        //         );
        //     },
        // })),

        ...filteredColumnsSetTable.map((column, index) => {
            // disabling the buttons based on the current date
            let currentdayallot = currentDate1Allot.getDate();
            let currentmonthallot = currentDate1Allot.getMonth() + 1;
            let currentyearallot = currentDate1Allot.getFullYear();
            const currentFormattedDate = new Date(`${currentmonthallot}/${currentdayallot}/${currentyearallot}`);
            const [formatday1allot, fromatmonth1allot, formatyear1allot] = column.formattedDate?.split('/');
            const columnFormattedDate = new Date(`${fromatmonth1allot}/${formatday1allot}/${formatyear1allot}`);

            // find before 5 days from the currentdate to disable
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 5);

            return {
                field: `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`,
                headerName: `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`,
                hide: !columnVisibilitySetlist[`${column.formattedDate} ${column.dayName} Day ${column.dayCount}`],
                flex: 0,
                width: 100,
                sortable: false,
                renderCell: (params) => {
                    // Move the variable declaration outside the JSX
                    let filteredRowData = allUserDates.filter((val) => val.empcode == params.row.empcode);
                    const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);
                    // Disable the button if the date is before the current date
                    // const isDisabled = (currentyearallot >= formatyear1allot && currentmonthallot >= fromatmonth1allot && currentdayallot > formatday1allot);
                    // const isDisabled = (columnFormattedDate <= currentFormattedDate);
                    const isDisabled = new Date(columnFormattedDate) < currentDate;

                    return (
                        <StyledTableCell>
                            <Button
                                // color={matchingItem && matchingItem.status === 'Manual' ? 'rgb(30, 70, 32)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(30, 70, 32)'}
                                variant="contained"
                                size="small"
                                sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.43',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: matchingItem && matchingItem.status === 'Manual' ? '3px 8px' : params.row.weekoff?.includes(column.dayName) ? '3px 10px' : '3px 8px',
                                    // color: matchingItem && matchingItem.status === 'Week Off' ? '#892a23' : matchingItem && matchingItem.status === 'Manual' ? '#052106' : params.row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
                                    // backgroundColor: matchingItem && matchingItem.status === 'Week Off' ? 'rgb(243 174 174)' : matchingItem && matchingItem.status === 'Manual' ? 'rgb(156 239 156)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
                                    color: (matchingItem && matchingItem.status === 'Week Off' || matchingItem && matchingItem.status === 'Manual') ? '#052106' : params.row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
                                    backgroundColor: (matchingItem && matchingItem.status === 'Week Off' || matchingItem && matchingItem.status === 'Manual') ? 'rgb(156 239 156)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
                                    pointerEvents: (matchingItem && matchingItem.status === 'Week Off' || matchingItem && matchingItem.status === 'Manual') ? 'none' : 'auto',
                                    '&:hover': {
                                        // color: matchingItem && matchingItem.status === 'Week Off' ? '#892a23' : matchingItem && matchingItem.status === 'Manual' ? '#052106' : params.row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
                                        // backgroundColor: matchingItem && matchingItem.status === 'Week Off' ? 'rgb(243 174 174)' : matchingItem && matchingItem.status === 'Manual' ? 'rgb(156 239 156)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',

                                        color: (matchingItem && matchingItem.status === 'Week Off' || matchingItem && matchingItem.status === 'Manual') ? '#052106' : params.row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
                                        backgroundColor: (matchingItem && matchingItem.status === 'Week Off' || matchingItem && matchingItem.status === 'Manual') ? 'rgb(156 239 156)' : params.row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
                                    }
                                }}
                                // Disable the button if the date is before the current date
                                disabled={isDisabled}
                                onClick={(e) => {
                                    if (matchingItem && matchingItem.status === 'Manual' || matchingItem && matchingItem.status === 'Week Off'
                                        // params.row.weekoff?.includes(column.dayName)
                                    ) {
                                        // Handle the case when the status is 'Manual'
                                    } else {
                                        handleShiftAllot(column, params.row);
                                    }

                                }}
                            >
                                {params.row.days[index].status}
                            </Button>
                            <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                {params.row.days[index].shiftlabel}
                            </Typography>
                        </StyledTableCell >
                    );
                },
            }
        }),
    ];

    const rowDataTableSetlist = filteredDataSetTable?.map((item, index) => {
        return {
            id: item.userid,
            userid: item.userid,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.username,
            shifttiming: item.shifttiming,
            boardingLog: item.boardingLog,
            empcode: item.empcode,
            weekoff: item.weekoff,
            days: filteredColumnsSetTable.map((column, index) => {
                let filteredRowData = allUserDates.filter((val) => val.empcode == item.empcode);
                const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);

                // Check if the dayName is Sunday or Monday
                const isWeekOff = item.weekoff?.includes(column.dayName);

                return {
                    formattedDate: column.formattedDate,
                    status: matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular'),
                    shiftlabel: getShiftForDateAllot(column, matchingItem, item.shifttiming, item.boardingLog, isWeekOff) === 'Week Off' ? '' : getShiftForDateAllot(column, matchingItem, item.shifttiming, item.boardingLog, isWeekOff),
                    empCode: item.empcode,
                    mode: matchingItem ? matchingItem.mode : (isWeekOff ? 'Week Off' : 'Shift'),
                    firstshift: matchingItem ? matchingItem.firstshift : '',
                    pluseshift: matchingItem ? matchingItem.pluseshift : '',
                    secondmode: matchingItem ? matchingItem.secondmode : 'Choose Second Shift',
                    shift: matchingItem ? matchingItem.shift : 'Choose Shift',
                    shiftallows: matchingItem ? matchingItem.shiftallows : '',
                    shiftgrptype: matchingItem ? matchingItem.shiftgrptype : 'Choose Day/Night',
                };
            }),
        };
    });

    const rowsWithCheckboxesSetlist = rowDataTableSetlist?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsSetlist.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnsSetlist = () => {
        const updatedVisibility = { ...columnVisibilitySetlist };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilitySetlist(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilitySetlist");
        if (savedVisibility) {
            setColumnVisibilitySetlist(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilitySetlist", JSON.stringify(columnVisibilitySetlist));
    }, [columnVisibilitySetlist]);

    // // Function to filter columns based on search query
    const filteredColumnsSetlist = columnDataTableSetlist.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageSetlist.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilitySetlist = (field) => {
        setColumnVisibilitySetlist((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentSetlist = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsSetlist}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageSetlist} onChange={(e) => setSearchQueryManageSetlist(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsSetlist?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilitySetlist[column.field]} onChange={() => toggleColumnVisibilitySetlist(column.field)} />}
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilitySetlist(initialColumnVisibilitySetlist)}>
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
                                columnDataTableSetlist.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilitySetlist(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Excel
    const fileName = "Shift Roaster";
    const [fileFormat, setFormat] = useState('');
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    'SNo': index + 1,
                    'Company': t.company.map((t) => t).join(','),
                    'Branch': t.branch.map((t) => t).join(','),
                    'Unit': t.unit.map((t) => t).join(','),
                    'Team': t.team.map((t) => t).join(','),
                    'Department': t.departmenttype == "Department Month" ? t.department : t.department.map(t => t).join(","),
                    'From Date': t.fromdate,
                    'To Date': t.todate
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                allShiftRoasters.map((t, index) => ({
                    'SNo': index + 1,
                    'Company': t.company.map((t) => t).join(','),
                    'Branch': t.branch.map((t) => t).join(','),
                    'Unit': t.unit.map((t) => t).join(','),
                    'Team': t.team.map((t) => t).join(','),
                    'Department': t.departmenttype == "Department Month" ? t.department : t.department.map(t => t).join(","),
                    'From Date': t.fromdate,
                    'To Date': t.todate
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Shift Roaster",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: "From Date", field: "fromdate" },
        { title: "To Date", field: "todate" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                company: row.company.map(t => t).join(","),
                branch: row.branch.map(t => t).join(","),
                unit: row.unit.map(t => t).join(","),
                team: row.team.map(t => t).join(","),
                department: row.department.map(t => t).join(","),
            })) :
            allShiftRoasters.map(row => {
                return {
                    ...row,
                    serialNumber: serialNumberCounter++,
                    company: row.company.map(t => t).join(","),
                    branch: row.branch.map(t => t).join(","),
                    unit: row.unit.map(t => t).join(","),
                    team: row.team.map(t => t).join(","),
                    department: row.department.map(t => t).join(","),
                }
            });

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Shift Roaster.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Shift Roaster.png");
                });
            });
        }
    };

    // Excel Set Table
    const fileNameSetTable = "Set Table";
    const [fileFormatSetTable, setFormatSetTable] = useState('')
    const fileTypeSetTable = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionSetTable = fileFormatSetTable === "xl" ? '.xlsx' : '.csv';
    const exportToCSVSetTable = (csvData, fileNameSetTable) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeSetTable });
        FileSaver.saveAs(data, fileNameSetTable + fileExtensionSetTable);
    }

    const handleExportXLSetTable = (isfilterSetTable) => {
        // Define the table headers
        const headers = [
            'SNo',
            'Company',
            'Branch',
            'Unit',
            'Team',
            'Department',
            'Name',
            // Add headers for date columns dynamically
            ...filteredColumnsSetTable.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
        ];

        let data = [];
        if (isfilterSetTable === "filtered") {
            data = rowDataTableSetlist.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    // Add data for date columns dynamically           
                    ...filteredColumnsSetTable.map(column => {
                        let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                        const matchingItem = filteredRowData.find(item => item.date === column.formattedDate);
                        const isWeekOff = row.weekoff?.includes(column.dayName);
                        const status = matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular');
                        const shiftTiming = getShiftForDateAllot(column, matchingItem, row.shifttiming, row.boardingLog, isWeekOff);
                        return status === "Week Off" ? `${status}` : `${status} (${shiftTiming})`;
                    }),
                ];
            });
        } else if (isfilterSetTable === "overall") {
            data = comparedUsersSetlist.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    // Add data for date columns dynamically           
                    ...filteredColumnsSetTable.map(column => {
                        let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                        const matchingItem = filteredRowData.find(item => item.date === column.formattedDate);
                        const isWeekOff = row.weekoff?.includes(column.dayName);
                        const status = matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular');
                        const shiftTiming = getShiftForDateAllot(column, matchingItem, row.shifttiming, row.boardingLog, isWeekOff);
                        return status === "Week Off" ? `${status}` : `${status} (${shiftTiming})`;
                    }),
                ];
            });
        }

        // Add headers to the data array
        const formattedData = data.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        // Export to CSV
        exportToCSVSetTable(formattedData, fileNameSetTable);
        setIsFilterOpenSetTable(false);
    };

    // print...
    const componentRefSetTable = useRef();
    const handleprintSetTable = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "Set Table",
        pageStyle: "print",
    });

    const downloadPdfSetTable = (isfilterSetTable) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = [
            'SNo',
            'Company',
            'Branch',
            'Unit',
            'Team',
            'Department',
            'Name',
            ...filteredColumnsSetTable.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
        ];

        // Initialize serial number counter
        let serialNumberCounter = 1;

        let data = [];
        if (isfilterSetTable === "filtered") {
            data = rowDataTableSetlist.map((row, index) => {
                return [
                    serialNumberCounter++,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    ...filteredColumnsSetTable.map(column => {
                        let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                        const matchingItem = filteredRowData.find(item => item.date === column.formattedDate);
                        const isWeekOff = row.weekoff?.includes(column.dayName);
                        const status = matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular');
                        const shiftTiming = getShiftForDateAllot(column, matchingItem, row.shifttiming, row.boardingLog, isWeekOff);
                        return status === "Week Off" ? `${status}` : `${status} (${shiftTiming})`;
                    }),
                ];
            });
        } else {
            data = comparedUsersSetlist.map((row, index) => {
                return [
                    serialNumberCounter++,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    ...filteredColumnsSetTable.map(column => {
                        let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                        const matchingItem = filteredRowData.find(item => item.date === column.formattedDate);
                        const isWeekOff = row.weekoff?.includes(column.dayName);
                        const status = matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular');
                        const shiftTiming = getShiftForDateAllot(column, matchingItem, row.shifttiming, row.boardingLog, isWeekOff);
                        return status === "Week Off" ? `${status}` : `${status} (${shiftTiming})`;
                    }),
                ];
            });
        }

        // Split data into chunks to fit on pages
        const columnsPerSheet = 10; // Number of columns per sheet
        const chunks = [];

        for (let i = 0; i < headers.length; i += columnsPerSheet) {
            const chunkHeaders = headers.slice(i, i + columnsPerSheet);
            const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

            chunks.push({ headers: chunkHeaders, data: chunkData });
        }

        chunks.forEach((chunk, index) => {
            if (index > 0) {
                doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
            }

            doc.autoTable({
                theme: "grid",
                styles: { fontSize: 8 },
                head: [chunk.headers],
                body: chunk.data,
                startY: 20, // Adjust startY to leave space for headers
                margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Adjust margin as needed
            });
        });

        doc.save("Set Table.pdf");
    };


    // image
    const handleCaptureImageSetTable = () => {
        if (gridRefSetTable.current) {
            html2canvas(gridRefSetTable.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Set Table.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"SHIFT ROASTER FILTER"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Shift Roaster Filter</Typography>
            {isUserRoleCompare?.includes("ashiftroaster") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Company <b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect size="small"
                                            options={companies}
                                            value={selectedOptionsCompanyAdd}
                                            onChange={handleCompanyChangeAdd}
                                            valueRenderer={customValueRendererCompanyAdd}
                                        />
                                    </FormControl>
                                </Grid>
                                {departmentShow ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Department Type<b style={{ color: "red" }}>*</b> </Typography>
                                                <Selects
                                                    options={departmentoptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterAdd.departmenttype, value: shiftRoasterAdd.departmenttype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterAdd({ ...shiftRoasterAdd, departmenttype: e.value, department: 'Choose Department', shifttype: "Choose Type" });
                                                        setBranchShow(false);
                                                        setSelectedOptionsDepartmentAdd([]);
                                                        setValueDepartmentAdd([]);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {shiftRoasterAdd.departmenttype === "Department Month" ?
                                            (<Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Department<b style={{ color: "red" }}>*</b> </Typography>
                                                    <Selects
                                                        options={allDepartmentSet}
                                                        styles={colourStyles}
                                                        value={{ label: shiftRoasterAdd.department, value: shiftRoasterAdd.department }}
                                                        onChange={(e) => {
                                                            setShiftRoasterAdd({ ...shiftRoasterAdd, department: e.value, shifttype: "Choose Type" });
                                                            fetchDepartmentSet(e.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>)
                                            :
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Department <b style={{ color: "red" }}>*</b> </Typography>
                                                    <MultiSelect size="small"
                                                        options={departments}
                                                        value={selectedOptionsDepartmentAdd}
                                                        onChange={handleDepartmentChangeAdd}
                                                        valueRenderer={customValueRendererDepartmentAdd}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        }
                                        <Grid item md={2.5} xs={12} sm={6}>
                                            <Button sx={userStyle.btncancel} onClick={handleHideClear} style={{ marginTop: '25px' }}>
                                                Clear
                                            </Button>
                                        </Grid>
                                        <Grid item md={0.5} xs={12} sm={6}></Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item md={2.5} xs={12} sm={6}>
                                            <Button sx={userStyle.btncancel} onClick={handleHideClear} style={{ marginTop: '25px' }}>
                                                Clear
                                            </Button>
                                        </Grid>
                                        <Grid item md={6.5} xs={12} sm={6}></Grid>
                                    </>
                                )}

                                {branchShow ? (
                                    <>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>  Branch <b style={{ color: "red" }}>*</b> </Typography>
                                                <MultiSelect size="small"
                                                    options={branches}
                                                    value={selectedOptionsBranchAdd}
                                                    onChange={handleBranchChangeAdd}
                                                    valueRenderer={customValueRendererBranchAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>  Unit <b style={{ color: "red" }}>*</b> </Typography>
                                                <MultiSelect size="small"
                                                    options={units}
                                                    value={selectedOptionsUnitAdd}
                                                    onChange={handleUnitChangeAdd}
                                                    valueRenderer={customValueRendererUnitAdd}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>  Team <b style={{ color: "red" }}>*</b> </Typography>
                                                <MultiSelect size="small"
                                                    options={teams}
                                                    value={selectedOptionsTeamAdd}
                                                    onChange={handleTeamChangeAdd}
                                                    valueRenderer={customValueRendererTeamAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {/* {shiftRoasterAdd.departmenttype === "Department Month" ?
                                            <></> :
                                            <> */}
                                        <Grid item md={2} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Select Month</Typography>
                                                <Selects
                                                    maxMenuHeight={200}
                                                    options={months}
                                                    value={isMonthyear.ismonth}
                                                    // placeholder={monthname}
                                                    // onChange={(e) => { setShiftRoasterAdd({ ...shiftRoasterAdd, ismonth: e.value }) }}
                                                    onChange={(e) => handleGetMonth(e.value)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Select Year</Typography>
                                                <Selects
                                                    maxMenuHeight={200}
                                                    options={getyear}
                                                    value={isMonthyear.isyear}
                                                    // placeholder={currentYear}
                                                    // onChange={(e) => { setShiftRoasterAdd({ ...shiftRoasterAdd, isyear: e.value }) }}
                                                    onChange={(e) => handleGetYear(e.value)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {/* </>} */}

                                        <Grid item md={2} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Repeat Interval</Typography>
                                                <OutlinedInput readOnly value={overallsettings} />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) :
                                    <>
                                        {/* {shiftRoasterAdd.departmenttype === "Department Month" ?
                                            <>
                                                <Grid item md={2} sm={12} xs={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography> Repeat Interval</Typography>
                                                        <OutlinedInput readOnly value={overallsettings} />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={10} sm={12} xs={12}></Grid>
                                            </> : <> */}
                                        <Grid item md={2} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Select Month</Typography>
                                                <Selects
                                                    maxMenuHeight={200}
                                                    value={isMonthyear.ismonth}
                                                    // placeholder={monthname}
                                                    // onChange={(e) => {
                                                    //     setShiftRoasterAdd({ ...shiftRoasterAdd, ismonth: e.value });
                                                    //     calculateMonthDates();
                                                    // }}
                                                    onChange={(e) => handleGetMonth(e.value)}
                                                    options={months}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Select Year</Typography>
                                                <Selects
                                                    maxMenuHeight={200}
                                                    value={isMonthyear.isyear}
                                                    // placeholder={isMonthyear.isyear.value}
                                                    // onChange={(e) => {
                                                    //     setShiftRoasterAdd({ ...shiftRoasterAdd, isyear: e.value });
                                                    //     calculateMonthDates();
                                                    // }}
                                                    onChange={(e) => handleGetYear(e.value)}
                                                    options={getyear}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Repeat Interval</Typography>
                                                <OutlinedInput readOnly value={overallsettings} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={12} xs={12}></Grid>
                                        {/* </>} */}

                                    </>
                                }
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Shift Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shifttypeoptions}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterAdd.shifttype, value: shiftRoasterAdd.shifttype }}
                                            onChange={(e) => handleShiftTpe(e)}
                                        />
                                    </FormControl>
                                </Grid>
                                {shiftRoasterAdd.shifttype == "For Week" ? (
                                    <>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Full Week<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    // options={weekoptions}
                                                    options={generateFullWeekOptions()}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterAdd.fullweek, value: shiftRoasterAdd.fullweek }}
                                                    onChange={(e) => {
                                                        calculateWeekDates(e);
                                                        // calculateWeekDatesMonthYear(e)
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>From Date<b style={{ color: "red" }}>*</b>  </Typography>
                                                <OutlinedInput readonly type="text" value={shiftRoasterAdd.fromdate}
                                                // onChange={(e) => {
                                                //     setShiftRoasterAdd({ ...shiftRoasterAdd, fromdate: e.target.value });
                                                // }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>To Date<b style={{ color: "red" }}>*</b>  </Typography>
                                                <OutlinedInput readonly type="text" value={shiftRoasterAdd.todate}
                                                // onChange={(e) => setShiftRoasterAdd({ ...shiftRoasterAdd, todate: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>) : null}

                                {shiftRoasterAdd.shifttype == "For Month" ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>From Date<b style={{ color: "red" }}>*</b>  </Typography>
                                                <OutlinedInput readonly type="text" value={shiftRoasterAdd.fromdate}
                                                // onChange={(e) => {
                                                //     setShiftRoasterAdd({ ...shiftRoasterAdd, fromdate: e.target.value });
                                                // }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>To Date<b style={{ color: "red" }}>*</b>  </Typography>
                                                <OutlinedInput readonly type="text" value={shiftRoasterAdd.todate}
                                                // onChange={(e) => setShiftRoasterAdd({ ...shiftRoasterAdd, todate: e.target.value })}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : null}

                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        Generate
                                    </Button> */}
                                    <LoadingButton
                                        onClick={handleSubmit}
                                        loading={isBtn}
                                        color="primary"
                                        loadingPosition="end"
                                        variant="contained"
                                    >
                                        Generate
                                    </LoadingButton>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftroaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Shift List</Typography>
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
                                        {/* <MenuItem value={allShiftRoasters?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftroaster") && (
                                        <>
                                            {/* <ExportXL csvData={excelData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftroaster") && (
                                        <>
                                            {/* <ExportCSV csvData={excelData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftroaster") && (
                                        <>
                                            {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button> */}
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftroaster") && (
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
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>  Manage Columns </Button> &ensp;
                        {/* <Button variant="contained" color="error" onClick={handleClickOpenalert}> Bulk Delete  </Button>  */}
                        <br /> <br />
                        {shiftRoastersCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden", }} >
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                    </Box><br />

                </>
            )}
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

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.company.map(t => t).join(",")}</TableCell>
                                    <TableCell>{row.branch.map(t => t).join(",")}</TableCell>
                                    <TableCell>{row.unit.map(t => t).join(",")}</TableCell>
                                    <TableCell>{row.team.map(t => t).join(",")}</TableCell>
                                    <TableCell>{row.departmenttype === "Department Month" ? row.department : row.department.map(t => t).join(",")}</TableCell>
                                    <TableCell>{row.fromdate}</TableCell>
                                    <TableCell>{row.todate}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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



            <Box>
                {/* Set list table */}
                <Dialog open={openEditSetlist} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.HeaderText}>Set</Typography>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseEditSetlist}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 20,
                                // color: (theme) => theme.palette.grey[500],
                                color: 'red'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <br />
                        <Box >
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid container style={userStyle.dataTablestyle}>
                                <Grid md={10}>
                                    <Typography sx={userStyle.importheadtext}>Shift Allot</Typography>
                                </Grid>
                            </Grid>
                            <br /><br />
                            <Grid container style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select size="small"
                                            id="pageSizeSelect"
                                            value={pageSizeSetTable}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangeSetTable}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            {/* <MenuItem value={comparedUsers?.length}>All</MenuItem> */}
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box>
                                        {isUserRoleCompare?.includes("excelshiftroaster") && (
                                            <>
                                                {/* <Button sx={userStyle.buttongrp}>
                                                    <FaFileExcel />&ensp;
                                                    <ReactHTMLTableToExcel
                                                        id="test-table-xls-button"
                                                        className="download-table-xls-button"
                                                        table="settablepdf"
                                                        filename="SetTable"
                                                        sheet="Sheet"
                                                        buttonText="Export To Excel"
                                                    />
                                                </Button> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpenSetTable(true)
                                                    setFormatSetTable("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvshiftroaster") && (
                                            <>
                                                {/* <CSVLink style={{
                                                    backgroundColor: "#f4f4f4",
                                                    color: "#444",
                                                    borderRadius: "3px",
                                                    boxShadow: "none",
                                                    fontSize: "12px",
                                                    padding: "8px 6px",
                                                    textTransform: "capitalize",
                                                    border: "1px solid #8080808f",
                                                    textDecoration: 'none',
                                                    marginRight: '0px',
                                                    fontFamily: "Roboto,Helvetica,Arial,sans-serif"
                                                }}
                                                    data={// Constructing data in the required format
                                                        [
                                                            [
                                                                'S.No',
                                                                'Company',
                                                                'Branch',
                                                                'Unit',
                                                                'Team',
                                                                'Department',
                                                                'Name',
                                                                // Add headers for date columns dynamically
                                                                ...filteredColumnsSetTable.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
                                                            ], // First row should be headers
                                                            ...filteredDataSetTable.map((row, index) => [
                                                                row.serialNumber,
                                                                row.company,
                                                                row.branch,
                                                                row.unit,
                                                                row.team,
                                                                row.department,
                                                                row.username,
                                                                // Add data for date columns dynamically           
                                                                ...filteredColumnsSetTable.map(column => {
                                                                    let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                                                                    const matchingItem = filteredRowData.find(item => item.date === column.formattedDate);
                                                                    const isWeekOff = row.weekoff?.includes(column.dayName);
                                                                    const status = matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular');
                                                                    const shiftTiming = getShiftForDateAllot(column, matchingItem, row.shifttiming, row.boardingLog, isWeekOff);
                                                                    return status == "Week Off" ? `${status}` : `${status} (${shiftTiming})`;
                                                                }),
                                                            ]),
                                                        ]}
                                                    filename="SetTable.csv"
                                                >
                                                    <FaFileCsv />&ensp;Export To CSV
                                                </CSVLink> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpenSetTable(true)
                                                    setFormatSetTable("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printshiftroaster") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintSetTable}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfshiftroaster") && (
                                            <>
                                                {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSetTable()}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button> */}
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpenSetTable(true)
                                                    }}
                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageshiftroaster") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImageSetTable}>
                                                    {" "} <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={searchQuerySetTable} onChange={handleSearchChangeSetTable} />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>  <br />

                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsSetlist}> Show All Columns </Button>  &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsSetlist}>  Manage Columns </Button> &ensp;
                            <br /> <br />
                            {!allSetCheckSetlist ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Box style={{ width: "100%", overflowY: "hidden", }}>
                                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedDataSetlist(copiedString)} rows={rowsWithCheckboxesSetlist} columns={columnDataTableSetlist.filter((column) => columnVisibilitySetlist[column.field])} onSelectionModelChange={handleSelectionChangeSetlist} selectionModel={selectedRowsSetlist} autoHeight={true} ref={gridRefSetTable} id="settableexcel" density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredDataSetTable?.length > 0 ? (pageSetTable - 1) * pageSizeSetTable + 1 : 0} to {Math.min(pageSetTable * pageSizeSetTable, filteredDatasSetTable?.length)} of {filteredDatasSetTable?.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageSetTable(1)} disabled={pageSetTable === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeSetTable(pageSetTable - 1)} disabled={pageSetTable === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersSetTable?.map((pageNumberSetTable) => (
                                                <Button key={pageNumberSetTable} sx={userStyle.paginationbtn} onClick={() => handlePageChangeSetTable(pageNumberSetTable)} className={pageSetTable === pageNumberSetTable ? "active" : ""} disabled={pageSetTable === pageNumberSetTable}>
                                                    {pageNumberSetTable}
                                                </Button>
                                            ))}
                                            {lastVisiblePageSetTable < totalPagesSetTable && <span>...</span>}
                                            <Button onClick={() => handlePageChangeSetTable(pageSetTable + 1)} disabled={pageSetTable === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageSetTable(totalPagesSetTable)} disabled={pageSetTable === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Box><br />
                    </Box>
                </Dialog>
                {/* Manage Column */}
                <Popover
                    id={idSetList}
                    open={isManageColumnsOpenSetlist}
                    anchorElSetlist={anchorElSetlist}
                    onClose={handleCloseManageColumnsSetlist}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    {manageColumnsContentSetlist}
                </Popover>

                {/* Print layout for Set Table */}
                <TableContainer component={Paper} sx={userStyle.printcls} >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="settablepdf">
                        <TableHead>
                            <TableRow >
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>SNo</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Company</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Team</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Department</TableCell>
                                <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Name</TableCell>
                                {/* Render date columns dynamically */}
                                {filteredColumnsSetTable.map((column, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <StyledTableCell>
                                                <Box sx={userStyle.tableheadstyle}>
                                                    {column.formattedDate}<br />
                                                    {column.dayName}<br />
                                                    {`Day ${column.dayCount}`}
                                                </Box>
                                            </StyledTableCell>
                                        </React.Fragment>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {filteredDataSetTable &&
                                filteredDataSetTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontSize: '14px' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>{row.company}</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>{row.branch}</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>{row.unit}</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>{row.team}</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>{row.department}</TableCell>
                                        <TableCell sx={{ fontSize: '14px' }}>{row.username}</TableCell>
                                        {/* Render "Not Allot" for each date column */}
                                        {filteredColumnsSetTable && (
                                            filteredColumnsSetTable.map((column, index) => {
                                                let filteredRowData = allUserDates.filter((val) => val.empcode == row.empcode)

                                                // Find the corresponding status for the current formattedDate
                                                const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);
                                                const isWeekOff = row.weekoff?.includes(column.dayName);

                                                return (
                                                    <React.Fragment key={index}>
                                                        <StyledTableCell>
                                                            <Button
                                                                //  color={matchingItem && matchingItem.status === 'Manual' ? 'success' : isWeekOff ? 'error' : 'success'} 
                                                                variant="contained" size="small"
                                                                sx={{
                                                                    fontSize: '10px', textTransform: 'capitalize', borderRadius: '15px', height: '20px', padding: '1px 8px',
                                                                    display: 'flex',
                                                                    // color: matchingItem && matchingItem.status === 'Manual' ? '#052106' : isWeekOff ? '#892a23' : '#183e5d',
                                                                    color: matchingItem && matchingItem.status === 'Manual' ? '#052106' : isWeekOff ? '#892a23' : '#183e5d',
                                                                    backgroundColor: (matchingItem && matchingItem.status === 'Manual' || matchingItem && matchingItem.status === 'Week Off') ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
                                                                }}
                                                            >
                                                                {matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Regular')}
                                                            </Button><br />
                                                            <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                                                {getShiftForDateAllot(column, matchingItem, row.shifttiming, row.boardingLog, isWeekOff)}
                                                            </Typography>
                                                        </StyledTableCell>
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                        <IconButton
                            aria-label="close"
                            onClick={handleCloseFilterMod}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {fileFormat === 'xl' ?
                            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                        }
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Choose Export
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus variant="contained"
                            onClick={(e) => {
                                handleExportXL("filtered")
                            }}
                        >
                            Export Filtered Data
                        </Button>
                        <Button autoFocus variant="contained"
                            onClick={(e) => {
                                handleExportXL("overall")
                            }}
                        >
                            Export Over All Data
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Set Table export popup */}
                <Dialog open={isFilterOpenSetTable} onClose={handleCloseFilterModSetTable} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                        <IconButton
                            aria-label="close"
                            onClick={handleCloseFilterModSetTable}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {fileFormatSetTable === 'xl' ?
                            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                        }
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Choose Export
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus variant="contained"
                            onClick={(e) => {
                                handleExportXLSetTable("filtered")
                            }}
                        >
                            Export Filtered Data
                        </Button>
                        <Button autoFocus variant="contained"
                            onClick={(e) => {
                                handleExportXLSetTable("overall")
                            }}
                        >
                            Export Over All Data
                        </Button>
                    </DialogActions>
                </Dialog>
                {/*Export pdf Data  */}
                <Dialog open={isPdfFilterOpenSetTable} onClose={handleClosePdfFilterModSetTable} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                        <IconButton
                            aria-label="close"
                            onClick={handleClosePdfFilterModSetTable}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Choose Export
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={(e) => {
                                downloadPdfSetTable("filtered")
                                setIsPdfFilterOpenSetTable(false);
                            }}
                        >
                            Export Filtered Data
                        </Button>
                        <Button variant="contained"
                            onClick={(e) => {
                                downloadPdfSetTable("overall")
                                setIsPdfFilterOpenSetTable(false);
                            }}
                        >
                            Export Over All Data
                        </Button>
                    </DialogActions>
                </Dialog>

                {/*Export pdf Data  */}
                <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                        <IconButton
                            aria-label="close"
                            onClick={handleClosePdfFilterMod}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                        <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Choose Export
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={(e) => {
                                downloadPdf("filtered")
                                setIsPdfFilterOpen(false);
                            }}
                        >
                            Export Filtered Data
                        </Button>
                        <Button variant="contained"
                            onClick={(e) => {
                                downloadPdf("overall")
                                setIsPdfFilterOpen(false);
                            }}
                        >
                            Export Over All Data
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Model */}
                <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'auto',
                        },
                    }}
                >
                    <Box sx={userStyle.dialogbox}>
                        {/* <Typography sx={userStyle.HeaderText}>Set or Adjust Shift</Typography> */}
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseEdit}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 20,
                                // color: (theme) => theme.palette.grey[500],
                                color: 'red'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {/* <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Select Manual/Adjust</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects size="small"
                                        options={filterfieldoptions}
                                        styles={colourStyles}
                                        value={{ label: popupFilter.filterfield, value: popupFilter.filterfield }}
                                        onChange={(e) => {
                                            setPopupFilter({ ...popupFilter, filterfield: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /><br /><br /><br />
                        {popupFilter.filterfield == "Manual" ? ( */}
                        <>
                            <Typography sx={userStyle.HeaderText}> Shift Allot</Typography>
                            <Grid container spacing={2}>
                                <Grid item md={1.5} sm={12} xs={12} >
                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <TextField readOnly size="small" value={shiftRoasterEdit.username} />
                                        <TextField readOnly size="small" value={shiftRoasterEdit.empcode} sx={{ display: 'none' }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={0.5} sm={12} xs={12} >
                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} sx={{ display: 'flex' }}>
                                    <FormControl fullWidth size="small" >
                                        <TextField readOnly size="small" value={shiftRoasterEdit.formattedDate} />
                                    </FormControl>
                                    <FormControl fullWidth size="small" >
                                        <TextField readOnly size="small" value={`Day ${shiftRoasterEdit.dayCount}`} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={0.5} sm={12} xs={12} >
                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small" >
                                        <TextField readOnly size="small" value={shiftRoasterEdit.selectedCellShift} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12} >
                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Mode</Typography>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Selects size="small"
                                            options={modeoptions}
                                            styles={colourStyles}
                                            value={{ label: shiftRoasterEdit.mode, value: shiftRoasterEdit.mode }}
                                            onChange={(e) => {
                                                setShiftRoasterEdit({ ...shiftRoasterEdit, mode: e.value, shiftgrptype: 'Choose Day/Nigth', shift: 'Choose Shift', secondmode: 'Choose Second Shift', });
                                                setShiftTime("");
                                                setSecondShiftTime("");
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {shiftRoasterEdit.mode == "Shift" ? (
                                    <>
                                        <Grid item md={1.5} xs={12} sm={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift (Day/Night)</Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shiftDayOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterEdit.shiftgrptype, value: shiftRoasterEdit.shiftgrptype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterEdit({ ...shiftRoasterEdit, shiftgrptype: e.value, shift: 'Choose Shift', secondmode: 'Choose Second Shift', });
                                                        fetchShiftFromShiftGroup(e.value);
                                                        setShiftTime("");
                                                        setSecondShiftTime("");
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Selects size="small"
                                                    options={shiftRoasterEdit.secondmode == "Double Shift" ? shiftsFiltered : shifts}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterEdit.shift, value: shiftRoasterEdit.shift }}
                                                    onChange={(e) => {
                                                        setShiftRoasterEdit({ ...shiftRoasterEdit, shift: e.value, secondmode: 'Choose Second Shift', });
                                                        getShiftTime(e.value);
                                                        setSecondShiftTime("");
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift</Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftTime} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>2nd ShiftMode</Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={secondmodeoptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterEdit.secondmode, value: shiftRoasterEdit.secondmode }}
                                                    onChange={handleSecondModeChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px', }}>Pluse Shift</Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={secondShiftTime} />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : null}
                            </Grid>
                            <br /> <br /> <br />
                            <Grid container >
                                <Grid item md={2}>
                                    <Button variant="contained" color="primary" onClick={handleSubmitUpdateManual}> {" "} Save{" "}  </Button>
                                </Grid>
                                <Grid item md={2}>
                                    <Button variant="contained" sx={userStyle.btncancel} onClick={handleClearSetlist}> {" "} Clear{" "} </Button>
                                </Grid>
                                <Grid item md={2}>
                                    <Button variant="contained" sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Close{" "} </Button>
                                </Grid>
                            </Grid>
                        </>
                        {/* ) : null} */}

                        {/* {popupFilter.filterfield == "Adjust" ? (
                            <>
                                <Typography sx={userStyle.HeaderText}> Shift Adjustment</Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                        <FormControl fullWidth size="small">
                                            <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Emp Code</Typography>
                                        <FormControl fullWidth size="small">
                                            <TextField readOnly size="small" value={shiftRoasterUserEdit.empcode} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Alloted Shift Mode</Typography>
                                        <FormControl fullWidth size="small">
                                            <TextField readOnly size="small" value={shiftRoasterUserEdit.firstshift != "" ? "First Shift" : shiftRoasterUserEdit.shifttiming != "" ? "First Shift" : ""} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Alloted Shift Shows</Typography>
                                        <FormControl fullWidth size="small">
                                            <TextField readOnly size="small" value={shiftRoasterUserEdit.firstshift == "" ? shiftRoasterUserEdit.shifttiming : shiftRoasterUserEdit.firstshift} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Adjustment Type</Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                size="small"
                                                options={adjtypeoptions}
                                                styles={colourStyles}
                                                value={{ label: shiftRoasterUserEdit.adjustmenttype, value: shiftRoasterUserEdit.adjustmenttype }}
                                                onChange={(e) => setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjustmenttype: e.value })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12} >
                                        {shiftRoasterUserEdit.adjustmenttype == "Add On Shift" ? (
                                            <Grid container spacing={2}>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            id="myDateInput"
                                                            type="date"
                                                            value={shiftRoasterUserEdit.adjdate}
                                                            onChange={(e) => {
                                                                setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjdate: e.target.value });
                                                            }}
                                                            inputProps={{ min: currentDate }} // Set the minimum allowed date
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                                    <FormControl fullWidth size="small">
                                                        <Selects
                                                            size="small"
                                                            options={shifts}
                                                            styles={colourStyles}
                                                            value={{ label: shiftRoasterUserEdit.adjtypeshift, value: shiftRoasterUserEdit.adjtypeshift }}
                                                            onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjtypeshift: e.value }); getShiftTime(e.value); }}

                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift Hours</Typography>
                                                    <FormControl fullWidth size="small">
                                                        <TextField readOnly size="small" value={getAdjShiftTypeTime} />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <FormControl fullWidth>
                                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Reason</Typography>
                                                        <TextareaAutosize
                                                            aria-label="minimum height"
                                                            minRows={5}
                                                            value={shiftRoasterUserEdit?.adjtypereason}
                                                            onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjtypereason: e.target.value, }) }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        ) : null}
                                        {shiftRoasterUserEdit.adjustmenttype == "Change Shift" ? (
                                            <Grid container spacing={2}>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                                    <FormControl fullWidth size="small">
                                                        <Selects
                                                            size="small"
                                                            options={shifts}
                                                            styles={colourStyles}
                                                            value={{ label: shiftRoasterUserEdit.adjchangeshift, value: shiftRoasterUserEdit.adjchangeshift }}
                                                            onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangeshift: e.value }); getShiftTime(e.value); }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift Hours</Typography>
                                                    <FormControl fullWidth size="small">
                                                        <TextField readOnly size="small" value={getChangeShiftTypeTime} />
                                                    </FormControl>
                                                </Grid><Grid item md={4} sm={12} xs={12}></Grid>
                                                <Grid item md={4} sm={12} xs={12}>
                                                    <FormControl fullWidth>
                                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Reason</Typography>
                                                        <TextareaAutosize
                                                            aria-label="minimum height"
                                                            minRows={5}
                                                            value={shiftRoasterUserEdit?.adjchangereason}
                                                            onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangereason: e.target.value, }) }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        ) : null}
                                    </Grid>
                                </Grid>
                                <br /> <br /><br />
                                <Grid container>
                                    <Grid item md={2}>
                                        <Button variant="contained" color="primary" onClick={sendRequestAdjusment}> {" "} Update{" "}  </Button>
                                    </Grid>
                                    <Grid item md={2}>
                                        <Button variant="contained" sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                                    </Grid>
                                </Grid>
                            </>
                        ) : null} */}

                    </Box>
                </Dialog >

                {/* ALERT DIALOG */}
                < Box >
                    <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                            <Typography variant="h6">{showAlert}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleCloseerr}>
                                ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box >
            </Box >
        </Box >
    );
}

export default ShiftRoasterFilter;