import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledDataGrid from "../../components/TableStyle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
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

function Applyleave() {
    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const [Accessdrop, setAccesDrop] = useState("Employee");
    const [AccessdropEdit, setAccesDropEdit] = useState("Employee");

    const [appleave, setAppleave] = useState({
        employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", date: "", todate: "", reasonforleave: "", reportingto: "",
        department: '', designation: '', doj: '', availabledays: '', durationtype: 'Random', weekoff: '', workmode: ''
    });

    const [appleaveEdit, setAppleaveEdit] = useState([]);
    const [selectStatus, setSelectStatus] = useState({});
    const [isApplyLeave, setIsApplyLeave] = useState([]);

    const [applyleaves, setApplyleaves] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [leaveId, setLeaveId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [allApplyleaveedit, setAllApplyleaveedit] = useState([]);
    const [relatedCountEdit, setRelatedCountEdit] = useState(0);
    const [selectedValue, setSelectedValue] = useState([]);

    const [leave, setLeave] = useState("Please Select LeaveType");
    const [leaveEdit, setLeaveEdit] = useState("Please Select LeaveType");

    const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [applyleaveCheck, setApplyleavecheck] = useState(false);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");

    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    const [statusOpen, setStatusOpen] = useState(false);
    const handleStatusOpen = () => {
        setStatusOpen(true);
    };
    const handleStatusClose = () => {
        setStatusOpen(false);
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Applyleave.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
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

    const [isErrorOpenForTookLeaveCheck, setIsErrorOpenForTookLeaveCheck] = useState(false);
    const handleClickOpenerrForTookLeaveCheck = () => {
        setIsErrorOpenForTookLeaveCheck(true);
    };
    const handleCloseerrForTookLeaveCheck = () => {
        setIsErrorOpenForTookLeaveCheck(false);
        setAppleave({
            ...appleave, employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: "Random",
            availabledays: '', date: "", todate: "", reasonforleave: "", reportingto: "", noofshift: ''
        });
    };

    const [isErrorOpenForTookLeaveCheckEdit, setIsErrorOpenForTookLeaveCheckEdit] = useState(false);
    const handleClickOpenerrForTookLeaveCheckEdit = () => {
        setIsErrorOpenForTookLeaveCheckEdit(true);
    };
    const handleCloseerrForTookLeaveCheckEdit = () => {
        setIsErrorOpenForTookLeaveCheckEdit(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
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

    const leaveStatusOptions = [
        { label: "Shift", value: "Shift" },
        { label: "Before Half Shift", value: "Before Half Shift" },
        { label: "After Half Shift", value: "After Half Shift" },
    ];

    const durationOptions = [
        { label: "Continous", value: "Continous" },
        { label: "Random", value: "Random" },
    ]

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

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
        employeename: true,
        employeeid: true,
        leavetype: true,
        date: true,
        todate: true,
        noofshift: true,
        reasonforleave: true,
        reportingto: true,
        actions: true,
        status: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const fetchLeaveType = async () => {
        try {
            let res_leavetype = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const leaveall = [{ label: 'Leave Without Pay', value: 'Leave Without Pay' }, ...res_leavetype?.data?.leavetype.map((d) => (
                {
                    ...d,
                    label: d.leavetype,
                    value: d.leavetype
                }
            ))];
            setLeaveTypeData(leaveall)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchLeaveType();
    }, []);

    const [deleteApply, setDeleteApply] = useState("");

    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteApply(res?.data?.sapplyleave);
            handleClickOpen();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let Applysid = deleteApply?._id;
    const delApply = async (e) => {
        try {
            if (Applysid) {
                await axios.delete(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchApplyleave();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delApplycheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.APPLYLEAVE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchApplyleave();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [companyOption, setCompanyOption] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [empnames, setEmpname] = useState([]);
    const [empnamesEdit, setEmpnameEdit] = useState([]);

    //get all comnpany.
    const fetchCompanyAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCompanyOption([
                ...res_location?.data?.companies?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all branches.
    const fetchBranchAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setBranchOption([
                ...res_location?.data?.branch?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);

       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //function to fetch unit
    const fetchUnitAll = async () => {
        try {
            let res_unit = await axios.get(`${SERVICE.UNIT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUnitOption([
                ...res_unit?.data?.units?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);


       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //function to fetch  team
    const fetchTeamAll = async () => {
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setTeamOption([
                ...res_team?.data?.teamsdetails?.map((t) => ({
                    ...t,
                    label: t.teamname,
                    value: t.teamname,
                })),
            ]);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchCategoryTicket = async () => {
        try {
            let res_emp = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const empall = [
                ...res_emp?.data?.users
                    .filter((data) => data.companyname !== isUserRoleAccess.companyname)
                    .map((d) => ({
                        ...d,
                        label: d.companyname,
                        value: d.companyname,
                    })),
            ];

            setEmpname(empall);
            setEmpnameEdit(empall);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

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
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
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
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
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
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
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
        setAppleave({ ...appleave, employeename: 'Please Select Employee Name', employeeid: '', leavetype: 'Please Select LeaveType', noofshift: '', reasonforleave: '', reportingto: '' });
        setAllUsers([]);
        setSelectStatus([]);
        setAvailableDays('');
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //company multiselect
    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);


    const handleCompanyChangeEdit = (options) => {
        setValueCompanyCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompanyEdit(options);
        setValueBranchCatEdit([]);
        setSelectedOptionsBranchEdit([]);
        setValueUnitCatEdit([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
    };

    const customValueRendererCompanyEdit = (valueCompanyCatEdit, _categoryname) => {
        return valueCompanyCatEdit?.length
            ? valueCompanyCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
    let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);

    const handleBranchChangeEdit = (options) => {
        setValueBranchCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranchEdit(options);
        setValueUnitCatEdit([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
    };

    const customValueRendererBranchEdit = (valueBranchCatEdit, _categoryname) => {
        return valueBranchCatEdit?.length
            ? valueBranchCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

    const handleUnitChangeEdit = (options) => {
        setValueUnitCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnitEdit(options);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
    };

    const customValueRendererUnitEdit = (valueUnitCatEdit, _categoryname) => {
        return valueUnitCatEdit?.length
            ? valueUnitCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

    const handleTeamChangeEdit = (options) => {
        setValueTeamCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
    };

    const customValueRendererTeamEdit = (valueTeamCatEdit, _categoryname) => {
        return valueTeamCatEdit?.length
            ? valueTeamCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    useEffect(() => {
        fetchCompanyAll();
        fetchBranchAll();
        fetchUnitAll();
        fetchTeamAll();
        fetchCategoryTicket();
    }, [selectedOptionsCompany]);

    let dateselect = new Date();
    dateselect.setDate(dateselect.getDate() + 3);
    var ddt = String(dateselect.getDate()).padStart(2, "0");
    var mmt = String(dateselect.getMonth() + 1).padStart(2, "0");
    var yyyyt = dateselect.getFullYear();
    let formattedDatet = yyyyt + "-" + mmt + "-" + ddt;

    let datePresent = new Date();
    var ddp = String(datePresent.getDate());
    var mmp = String(datePresent.getMonth() + 1);
    var yyyyp = datePresent.getFullYear();
    let formattedDatePresent = yyyyp + "-" + mmp + "-" + ddp;

    // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
    const calculateDaysDifference = () => {
        const fromDate = new Date(appleave.date).getTime();
        const toDate = new Date(appleave.todate).getTime();

        if (!isNaN(fromDate) && !isNaN(toDate)) {
            // Calculate the number of days between the two dates
            const daysDifference = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
            return daysDifference + 1;
        }

        return 0; // Return 0 if either date is invalid
    };

    // Call the function and set the result in state or use it as needed
    const daysDifference = calculateDaysDifference();

    // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
    const calculateDaysDifferenceEdit = () => {
        const fromDate = new Date(appleaveEdit.date).getTime();
        const toDate = new Date(appleaveEdit.todate).getTime();

        if (!isNaN(fromDate) && !isNaN(toDate)) {
            // Calculate the number of days between the two dates
            const daysDifferenceEdit = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
            return daysDifferenceEdit + 1;
        }

        return 0; // Return 0 if either date is invalid
    };

    // Call the function and set the result in state or use it as needed
    const daysDifferenceEdit = calculateDaysDifferenceEdit();

    const [allUsers, setAllUsers] = useState([]);
    const [leavecriterias, setLeavecriterias] = useState([]);
    const [availableDays, setAvailableDays] = useState('');
    const [getSelectedDates, setGetSelectedDates] = useState([]);
    const [leaveRestriction, setLeaveRestriction] = useState(false);
    const [checkDuplicate, setCheckDuplicate] = useState([]);

    const [allUsersEdit, setAllUsersEdit] = useState([]);
    const [leavecriteriasEdit, setLeavecriteriasEdit] = useState([]);
    const [availableDaysEdit, setAvailableDaysEdit] = useState('');
    const [getSelectedDatesEdit, setGetSelectedDatesEdit] = useState([]);
    const [leaveRestrictionEdit, setLeaveRestrictionEdit] = useState(false);
    const [checkDuplicateEdit, setCheckDuplicateEdit] = useState([]);

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

    const fetchUsersRandom = async (value, date,) => {
        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode;
        let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);

        let check = result.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (getSelectedDates.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (check) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(date);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });
            if (date !== '' && !getSelectedDates.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')) && !check && res?.data?.finaluser.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Shift is not alloted for the selected date. Please select another date"}</p>
                    </>
                );
                handleClickOpenerr();
                setAppleave({ ...appleave, date: '' });
            }
            else {
                let result = res?.data?.finaluser.filter((d) => d.shiftMode === 'Main Shift');
                // setAllUsers(prevUsers => [...prevUsers, ...res?.data?.finaluser]);
                setAllUsers(prevUsers => [...prevUsers, ...result]);

                // Extract formatted dates from response data and set to getSelectedDates
                // const selectedDates = res?.data?.finaluser.map(d => d.formattedDate);
                const selectedDates = result.map(d => d.formattedDate);
                setGetSelectedDates(prevDates => [...prevDates, ...selectedDates]);
                setAppleave({ ...appleave, date: '' });
            }

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };

    const fetchUsersRandomEdit = async (value, date,) => {

        let check = checkDuplicateEdit.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (getSelectedDatesEdit.includes(moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'))) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (check) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(date);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });

            setAllUsersEdit(prevUsers => [...prevUsers, ...res?.data?.finaluser]);

            // Extract formatted dates from response data and set to getSelectedDates
            const selectedDatesEdit = res?.data?.finaluser.map(d => d.formattedDate);
            setGetSelectedDatesEdit(prevDates => [...prevDates, ...selectedDatesEdit]);
            setAppleaveEdit({ ...appleaveEdit, date: '' });
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchUsers = async (value, date, todate) => {

        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode;
        let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);

        const isOverlap = result.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        const isOverlap1 = getSelectedDates.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select From Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        if (todate === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select To Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(todate);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });
            if (date !== '' && todate !== '' && !isOverlap1 && !isOverlap && res?.data?.finaluser.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Shift is not alloted for the selected date. Please select another date"}</p>
                    </>
                );
                handleClickOpenerr();
                setAppleave({ ...appleave, date: '', todate: '' });
            }
            else {

                let result = res?.data?.finaluser.filter((d) => d.shiftMode === 'Main Shift');

                // setAllUsers(prevUsers => [...prevUsers, ...res?.data?.finaluser]);
                setAllUsers(prevUsers => [...prevUsers, ...result]);

                // Extract formatted dates from response data and set to getSelectedDates
                // const selectedDates = res?.data?.finaluser.map(d => d.formattedDate);
                const selectedDates = result.map(d => d.formattedDate);
                setGetSelectedDates(prevDates => [...prevDates, ...selectedDates]);
                setAppleave({ ...appleave, date: '', todate: '' });
            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchUsersEdit = async (value, date, todate) => {

        const isOverlap = checkDuplicateEdit.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        const isOverlap1 = getSelectedDatesEdit.some((leave) => {
            const startDate = moment(date, "YYYY-MM-DD");
            const endDate = moment(todate, "YYYY-MM-DD");
            const leaveDate = moment(leave, "DD/MM/YYYY");

            // Check if any of the selected dates overlap with the leave date
            return (
                leaveDate.isBetween(startDate, endDate, 'day', '[]') || // Within leave period
                leaveDate.isSame(startDate, 'day') || // Leave starts on the given date
                leaveDate.isSame(endDate, 'day') // Leave ends on the given date
            );
        });

        let daysArray = [];
        if (date === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select From Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        if (todate === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select To Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isOverlap) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"These Date Range is Already Exists"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            let startMonthDate = new Date(date);
            let endMonthDate = new Date(todate);

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
        }

        try {
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                empcode: value
            });

            setAllUsersEdit(prevUsers => [...prevUsers, ...res?.data?.finaluser]);

            // Extract formatted dates from response data and set to getSelectedDates
            const selectedDatesEdit = res?.data?.finaluser.map(d => d.formattedDate);
            setGetSelectedDatesEdit(prevDates => [...prevDates, ...selectedDatesEdit]);
            setAppleaveEdit({ ...appleaveEdit, date: '', todate: '' });
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchLeaveCriteria = async (empname, empdepartment, empdesignation, leavetype, empdoj, empweekoff, empid) => {

        try {
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

            let currentDate = new Date();
            let total = res_status.data.departmentdetails.filter((dep) => {
                if (dep.department === empdepartment && Number(dep.year) === currentDate.getFullYear()) {
                    return dep;
                }
            });

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let answer = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname);

            let filteredData = res_leavecriteria?.data?.leavecriterias?.filter((d) => {
                if (d.mode === 'Employee' && d.employee?.includes(empname) && d.leavetype === leavetype) {
                    return d;
                }
                else if (d.mode === 'Department' && d.department?.includes(empdepartment) && d.leavetype === leavetype) {

                    return d;
                }
                else if (d.mode === 'Designation' && d.designation?.includes(empdesignation) && d.leavetype === leavetype) {
                    return d;
                }
                // if ((d.employee?.includes(empname) || d.department?.includes(empdepartment) || d.designation?.includes(empdesignation)) && d.leavetype === leavetype) {
                //   return d;
                // }
            })

            let doj = new Date(empdoj);
            let monthsDiff = (currentDate.getFullYear() - doj.getFullYear()) * 12 + (currentDate.getMonth() - doj.getMonth());
            let yearsDiff = currentDate.getFullYear() - doj.getFullYear();

            let monthstring = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let noticeresult = res?.data?.noticeperiodapply?.some(d => d.empcode === empid);

            filteredData?.forEach((d) => {
                let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : '';
                let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : '';

                let finalanswer = answer.filter(d => {
                    if (d.employeeid === empid && d.leavetype === leavetype) {
                        return d.date;
                    }
                })

                let previousYearData = res_status.data.departmentdetails?.filter((dep) => {
                    if (dep.department === empdepartment && Number(dep.year) === comparedYear) {
                        return dep;
                    }
                });

                let yearStartDate = total[0].fromdate;
                let yearEndDate = total[total.length - 1].todate;

                let lastYearStartDate = previousYearData.length > 0 ? previousYearData[0].fromdate : '';
                let lastYearEndDate = previousYearData.length > 0 ? previousYearData[previousYearData.length - 1].todate : '';

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
                        } else {
                        }
                    });
                });

                // To get Current year's leave count
                let withinRangeCount = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {

                        const [day, month, year] = leaveDate.split('/');
                        const date = new Date(`${month}/${day}/${year}`);

                        const startDate = new Date(yearStartDate);
                        const endDate = new Date(yearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter if date is within the range
                            withinRangeCount++;
                        } else {
                        }
                    });
                });

                // To get Current year's leave count
                let withinRangeNoOfShiftCount = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {
                        const [day, month, year] = leaveDate.split('/');
                        const date = new Date(`${month}/${day}/${year}`);

                        const startDate = new Date(yearStartDate);
                        const endDate = new Date(yearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter by parsing and adding the noofshift value
                            withinRangeNoOfShiftCount += leave.noofshift; // Parse as float
                        }
                    });
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

                if (d.uninformedleave === true) {
                    setLeaveRestriction(true)
                }

                // check auto increase
                if (d.leaveautocheck === true && d.leaveautodays === 'Month') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDays('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult === true && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
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
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
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
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        // let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeNoOfShiftCount


                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                            // remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeNoOfShiftCount;
                        }
                        setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }
                else if (d.leaveautocheck === true && d.leaveautodays === 'Year') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult === true && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = comparedYear;
                    //     const currentYear = currentDate.getFullYear() - 1;

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDaysLastYear *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let totalAvailableDays = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = parseInt(total[0].year);
                    //     const currentYear = currentDate.getFullYear();

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDays *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
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
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
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
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    }
                }
                else if (d.leaveautocheck === false && (d.leaveautodays === 'Month' || d.leaveautodays === 'Year')) {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDays('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDays('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult === true && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   let totalAvailableDays = parseInt(d.numberofdays);
                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
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
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
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
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }
            })

            setLeavecriterias(filteredData);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchLeaveCriteriaEdit = async (empname, empdepartment, empdesignation, leavetype, empdoj, empweekoff, empid) => {

        try {
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

            let currentDate = new Date();
            let total = res_status.data.departmentdetails.filter((dep) => {
                if (dep.department === empdepartment && Number(dep.year) === currentDate.getFullYear()) {
                    return dep;
                }
            });

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let answer = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname);

            let filteredData = res_leavecriteria?.data?.leavecriterias?.filter((d) => {
                if (d.mode === 'Employee' && d.employee?.includes(empname) && d.leavetype === leavetype) {
                    return d;
                }
                else if (d.mode === 'Department' && d.department?.includes(empdepartment) && d.leavetype === leavetype) {
                    return d;
                }
                else if (d.mode === 'Designation' && d.designation?.includes(empdesignation) && d.leavetype === leavetype) {
                    return d;
                }
                // if ((d.employee?.includes(empname) || d.department?.includes(empdepartment) || d.designation?.includes(empdesignation)) && d.leavetype === leavetype) {
                //   return d;
                // }
            })

            let doj = new Date(empdoj);
            let monthsDiff = (currentDate.getFullYear() - doj.getFullYear()) * 12 + (currentDate.getMonth() - doj.getMonth());
            let yearsDiff = currentDate.getFullYear() - doj.getFullYear();

            let monthstring = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let noticeresult = res?.data?.noticeperiodapply?.some(d => d.empcode === empid);

            filteredData?.forEach((d) => {
                let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : '';
                let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : '';

                let finalanswer = answer.filter(d => {
                    if (d.employeeid === empid && d.leavetype === leavetype) {
                        return d.date;
                    }
                })

                let previousYearData = res_status.data.departmentdetails?.filter((dep) => {
                    if (dep.department === empdepartment && Number(dep.year) === comparedYear) {
                        return dep;
                    }
                });

                let yearStartDate = total[0].fromdate;
                let yearEndDate = total[total.length - 1].todate;

                let lastYearStartDate = previousYearData.length > 0 ? previousYearData[0].fromdate : '';
                let lastYearEndDate = previousYearData.length > 0 ? previousYearData[previousYearData.length - 1].todate : '';

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
                        } else {
                        }
                    });
                });

                // To get Current year's leave count
                let withinRangeCount = 0;
                finalanswer.forEach((leave) => {
                    leave.date.forEach((leaveDate) => {

                        const [day, month, year] = leaveDate.split('/');
                        const date = new Date(`${month}/${day}/${year}`);

                        const startDate = new Date(yearStartDate);
                        const endDate = new Date(yearEndDate);

                        // Check if date is between startDate and endDate (inclusive)
                        if (date >= startDate && date <= endDate) {
                            // Increment the counter if date is within the range
                            withinRangeCount++;
                        } else {
                        }
                    });
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

                if (d.uninformedleave === true) {
                    setLeaveRestrictionEdit(true)
                }

                // check auto increase
                if (d.leaveautocheck === true && d.leaveautodays === 'Month') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult === true && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
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
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
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
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDaysEdit(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }
                else if (d.leaveautocheck === true && d.leaveautodays === 'Year') {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDaysEdit('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult === true && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = comparedYear;
                    //     const currentYear = currentDate.getFullYear() - 1;

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDaysLastYear *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let totalAvailableDays = parseInt(d.numberofdays);

                    //   // Adjust totalAvailableDays based on leaveautoincrease value
                    //   if (parseInt(d.leaveautoincrease) > 1) {
                    //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    //     const pendingFromYear = parseInt(total[0].year);
                    //     const currentYear = currentDate.getFullYear();

                    //     const yearsToAddDays = currentYear - pendingFromYear;

                    //     // Multiply the number of days by the leaveautoincrease value
                    //     totalAvailableDays *= Math.floor(yearsToAddDays / leaveAutoIncrease);
                    //   }

                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
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
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
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
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDaysEdit(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    }
                }
                else if (d.leaveautocheck === false && (d.leaveautodays === 'Month' || d.leaveautodays === 'Year')) {
                    // Applicable From
                    if (d.experiencein === 'Year' && yearsDiff <= comparedYearValue) {
                        setAvailableDaysEdit('')
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (d.experiencein === 'Month' && monthsDiff <= comparedMonthValue) {
                        setAvailableDaysEdit('')

                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in Training"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    else if (noticeresult === true && d.leavefornoticeperiod === false) {
                        setShowAlert(
                            <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                    // else {

                    //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

                    //   let totalAvailableDays = parseInt(d.numberofdays);
                    //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

                    //   // If pendingleave is true, add the remaining days from the previous year to the total available days
                    //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                    //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
                    //   } else {
                    //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
                    //   }

                    //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
                    // }
                    else {

                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();

                        const doj = new Date(empdoj);
                        const dojYear = doj.getFullYear();
                        const dojMonth = doj.getMonth();
                        const dojDate = doj.getDate();

                        let totalAvailableDaysLastYear = 0;
                        const lastYear = currentDate.getFullYear() - 1;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassedLastYear) {
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                    // for (let i = 0; i <= currentMonth; i++) {
                                    totalAvailableDaysLastYear += numberofdaysLastYear;
                                }
                                // if (currentDate.getDate() > dojDate) {
                                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                // }
                            }
                            else {
                                if (currentDate.getDate() > dojDate) {
                                    totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassedLastYear) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                                const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDaysLastYear = [];
                                const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
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
                        }

                        // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                        let totalAvailableDays = 0;

                        // Check if the user has completed one month from their date of joining
                        const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                        if (parseInt(d.leaveautoincrease) === 1) {
                            if (oneMonthPassed) {
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                    // for (let i = 0; i <= currentMonth; i++) {      
                                    totalAvailableDays += numberofdays;
                                }
                            }
                            else {
                                if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                                    totalAvailableDays -= (currentDate.getDate() - dojDate);
                                }
                            }
                        }
                        else {
                            if (oneMonthPassed) {
                                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                                const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                                const monthsToAddDays = [];
                                const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                                // Create an array of months based on leaveautoincrease
                                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
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
                            }
                        }

                        let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                        // If pendingleave is true, add the remaining days from the previous year to the total available days
                        if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                            remainingLeaveDays += ((oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear);
                        } else {
                            remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                        }
                        setAvailableDaysEdit(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);

                    }
                }


            })

            setLeavecriteriasEdit(filteredData);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    function multiLeaveStatusInputs(referenceIndex, inputvalue) {
        let shiftValue = 0;

        // Calculate shift value based on selected option
        if (inputvalue === 'Shift') {
            shiftValue = 1;
        } else if (inputvalue === 'Before Half Shift' || inputvalue === 'After Half Shift') {
            shiftValue = 0.5;
        }

        // Update isSubCategory state
        const updatedData = allUsers.map((value, index) => {
            if (referenceIndex === index) {
                return { ...value, leavestatus: inputvalue, shiftcount: shiftValue };
            } else {
                return value;
            }
        });

        setAllUsers(updatedData);

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleave({ ...appleave, noofshift: totalShifts });
    }

    const handleDelete = (referenceIndex) => {

        let deleteIndex;

        let updatedData = allUsers.filter((value, index) => {
            if (referenceIndex != index) {
                return value;
            } else {
                if (allUsers[index + 1]) {
                    deleteIndex = index;
                }
            }
            return false;
        });

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleave({ ...appleave, noofshift: totalShifts, date: '', todate: '' });

        setAllUsers(updatedData);
        setGetSelectedDates(updatedData.map(d => d.formattedDate))
    }

    function multiLeaveStatusInputsEdit(referenceIndex, inputvalue) {
        let shiftValue = 0;

        // Calculate shift value based on selected option
        if (inputvalue === 'Shift') {
            shiftValue = 1;
        } else if (inputvalue === 'Before Half Shift' || inputvalue === 'After Half Shift') {
            shiftValue = 0.5;
        }

        // Update isSubCategory state
        const updatedData = allUsersEdit.map((value, index) => {
            if (referenceIndex === index) {
                return { ...value, leavestatus: inputvalue, shiftcount: shiftValue };
            } else {
                return value;
            }
        });

        setAllUsersEdit(updatedData);

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleaveEdit({ ...appleaveEdit, noofshift: totalShifts });
    }

    const handleDeleteEdit = (referenceIndex) => {

        let deleteIndex;

        let updatedData = allUsersEdit.filter((value, index) => {
            if (referenceIndex != index) {
                return value;
            } else {
                if (allUsersEdit[index + 1]) {
                    deleteIndex = index;
                }
            }
            return false;
        });

        // Calculate total shift value
        const totalShifts = updatedData.reduce((acc, cur) => {
            if (cur.leavestatus === 'Shift') {
                return acc + 1;
            } else if (cur.leavestatus === 'Before Half Shift' || cur.leavestatus === 'After Half Shift') {
                return acc + 0.5;
            }
            return acc;
        }, 0);

        // Update state
        setAppleaveEdit({ ...appleaveEdit, noofshift: totalShifts, date: '', todate: '' });

        setAllUsersEdit(updatedData);
        setGetSelectedDatesEdit(updatedData.map(d => d.formattedDate))
    }

    //add function
    const sendRequest = async () => {
        let comp = selectedOptionsCompany.map((item) => item.value);
        let bran = selectedOptionsBranch.map((item) => item.value);
        let unit = selectedOptionsUnit.map((item) => item.value);
        let team = selectedOptionsTeam.map((item) => item.value);

        const currentDate = moment();

        const isAnyPastDate = allUsers.some(user => {
            const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
            return userDate.isBefore(currentDate, 'day');
        });

        let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode

        let noticeresult = res?.data?.noticeperiodapply.some(d => d.empcode === empid);

        try {
            let subprojectscreate = await axios.post(SERVICE.APPLYLEAVE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employeename: Accessdrop === "HR" ? String(appleave.employeename) : isUserRoleAccess.companyname,
                employeeid: Accessdrop === "HR" ? String(appleave.employeeid) : isUserRoleAccess.empcode,
                leavetype: String(appleave.leavetype),
                access: Accessdrop,
                // date: String(appleave.date),
                // todate: String(appleave.todate),
                date: [...getSelectedDates],
                numberofdays: String(allUsers.length),
                usershifts: [...allUsers],
                noofshift: Number(appleave.noofshift),
                durationtype: String(appleave.durationtype),
                availabledays: Number(availableDays),
                reasonforleave: String(appleave.reasonforleave),
                department: String(appleave.department),
                designation: String(appleave.designation),
                doj: String(appleave.doj),
                weekoff: appleave.weekoff,
                workmode: String(appleave.workmode),
                reportingto: Accessdrop === "HR" ? String(appleave.reportingto) : isUserRoleAccess.reportingto,
                status: String("Applied"),
                uninformedleavestatus: String((leaveRestriction === true && isAnyPastDate) ? 'Uninformed' : ''),
                noticeperiodstatus: String(noticeresult ? 'Noticeperiod' : ''),
                rejectedreason: String(""),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            setLeave("Please Select LeaveType");
            setAppleave({
                ...appleave, employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: "Random",
                availabledays: '', date: "", todate: "", reasonforleave: "", reportingto: "", noofshift: ''
            });
            setAllUsers([]);
            setGetSelectedDates([]);
            setAvailableDays('');
            setValueCompanyCat([]);
            setSelectedOptionsCompany([]);
            setValueBranchCat([]);
            setSelectedOptionsBranch([]);
            setValueUnitCat([]);
            setSelectedOptionsUnit([]);
            setValueTeamCat([]);
            setSelectedOptionsTeam([]);
            setBranchOption([]);
            setUnitOption([]);
            setTeamOption([]);
            setEmpname([]);
            handleCloseerrForTookLeaveCheck();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Function to find the day before and after a given day name
    function getDayBeforeAndAfter(dayName) {
        const index = daysOfWeek.indexOf(dayName);
        const beforeIndex = (index === 0) ? 6 : index - 1; // Wrap around to Saturday if Sunday
        const afterIndex = (index === 6) ? 0 : index + 1; // Wrap around to Sunday if Saturday
        return [daysOfWeek[beforeIndex], daysOfWeek[afterIndex]];
    }

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        const checkLeaveStatus = allUsers?.find(d => d.leavestatus === '')
        // const isNameMatch = applyleaves.some(item => item.reasonforleave.toLowerCase() === (appleave.reasonforleave).toLowerCase() && item.employeename === appleave.employeename && item.leavetype === leave && item.date === appleave.date && item.todate === appleave.todate);
        const isNameMatch = applyleaves.some((item) => item.employeename === appleave.employeename && item.date === appleave.date && item.todate === appleave.todate);
        let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode
        let uninformResult = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid && item.uninformedleavestatus === 'Uninformed').flatMap(d => d.date);
        let noticeresult = res?.data?.noticeperiodapply.some(d => d.empcode === empid);
        let noticeresultDate = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid && item.noticeperiodstatus === 'Noticeperiod').flatMap(d => d.date);
        let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);

        let checkDuplicateDates = allUsers.some((d) => result.includes(d.formattedDate))

        if (Accessdrop === "HR" && appleave.employeename === "Please Select Employee Name") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleave.leavetype === "Please Select LeaveType") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select LeaveType"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (allUsers.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please click plus button to add leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checkDuplicateDates) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Date already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleave.noofshift === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checkLeaveStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleave.reasonforleave === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason for Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            if (leavecriterias.length > 0) {
                let weekoff = Accessdrop === 'HR' ? appleave.weekoff : isUserRoleAccess.weekoff

                leavecriterias.forEach((d) => {

                    let check = allUsers.length > parseInt(d.uninformedleavecount);
                    let uninformedcheck = uninformResult.length >= parseInt(d.uninformedleavecount);
                    let noticeperiodcheck = noticeresultDate.length >= parseInt(d.leavefornoticeperiodcount);
                    let check2 = allUsers.length > parseInt(d.leavefornoticeperiodcount);

                    const currentDate = moment();

                    const isAnyPastDate = allUsers.some(user => {
                        const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
                        return userDate.isBefore(currentDate, 'day');
                    });

                    weekoff?.forEach(empwkoffday => {

                        // find out weekoff's before and after dayname
                        const [beforeDay, afterDay] = getDayBeforeAndAfter(empwkoffday);

                        const hasBeforeDay = allUsers.some(user => user.dayName === beforeDay);
                        const hasAfterDay = allUsers.some(user => user.dayName === afterDay);
                        // const hasWeekOffDay = allUsers.some(user => user.dayName === empwkoffday);

                        const hasBeforeDayDate = allUsers.filter(user => user.dayName === beforeDay).map(d => d.formattedDate);
                        const hasAfterDayDate = allUsers.filter(user => user.dayName === afterDay).map(d => d.formattedDate);

                        let updatedDatesBeforeWeekOffDates = [];
                        let updatedDatesAfterWeekOffDates = [];

                        //for example if selected date is monday
                        hasAfterDayDate.forEach(date => {
                            const [day, month, year] = date.split('/');
                            const currentDate = new Date(`${year}-${month}-${day}`);

                            // Get the day before
                            const dayBefore = new Date(currentDate);
                            dayBefore.setDate(currentDate.getDate() - 1);
                            const formattedDayBefore = `${dayBefore.getDate()}`.padStart(2, '0');
                            const formattedMonthBefore = `${dayBefore.getMonth() + 1}`.padStart(2, '0');
                            updatedDatesBeforeWeekOffDates.push(`${formattedDayBefore}/${formattedMonthBefore}/${dayBefore.getFullYear()}`);

                        });

                        hasBeforeDayDate.forEach(date => {
                            const [day, month, year] = date.split('/');
                            const currentDate = new Date(`${year}-${month}-${day}`);

                            // Get the day after
                            const dayAfter = new Date(currentDate);
                            dayAfter.setDate(currentDate.getDate() + 1);
                            const formattedDayAfter = `${dayAfter.getDate()}`.padStart(2, '0');
                            const formattedMonthAfter = `${dayAfter.getMonth() + 1}`.padStart(2, '0');
                            updatedDatesAfterWeekOffDates.push(`${formattedDayAfter}/${formattedMonthAfter}/${dayAfter.getFullYear()}`);
                        });

                        const hasWeekOffDayNext = allUsers.some(user => updatedDatesAfterWeekOffDates.includes(user.formattedDate));
                        const hasWeekOffDayBefore = allUsers.some(user => updatedDatesBeforeWeekOffDates.includes(user.formattedDate));

                        if (d.leaverespecttoweekoff === true && hasBeforeDay && !hasWeekOffDayNext && !hasWeekOffDayBefore) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date (${updatedDatesAfterWeekOffDates.map(d => d)}, ${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === true && hasAfterDay && !hasWeekOffDayBefore && !hasWeekOffDayNext) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date(${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === false && hasAfterDay) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${afterDay}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === false && hasBeforeDay) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${beforeDay}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (availableDays == '' || availableDays == 0) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"No more available leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (allUsers.length > availableDays) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You applied leave more than available days"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttotraining === false && appleave.workmode === 'Internship') {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in training period. Cannot apply leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult === true && d.leavefornoticeperiod === false) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.tookleavecheck === true && allUsers.some(val => d.tookleave.includes(val.dayName.toLowerCase()))) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${d.tookleave.map(d => d)}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.uninformedleave === true && isAnyPastDate && check) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.uninformedleavecount} days of leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.uninformedleave === true && isAnyPastDate && uninformedcheck && !check) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied Uninformed Leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult === true && d.leavefornoticeperiod === true && check2) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.leavefornoticeperiodcount} days of leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult === true && d.leavefornoticeperiod === true && noticeperiodcheck && !check2) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied leave in the noticeperiod`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else {
                            if (d.tookleavecheck === false && allUsers.some(val => d.tookleave.includes(val.dayName.toLowerCase()))) {
                                setShowAlert(
                                    <>
                                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${d.tookleave.map(d => d?.toUpperCase())}. If you want to apply leave on this day it will be calculate as a Double Lop. Do you want to apply?`}</p>
                                    </>
                                );
                                handleClickOpenerrForTookLeaveCheck();
                            }
                            else {
                                sendRequest();
                            }
                        }
                    })
                })
            }
            else {
                sendRequest();
            }

        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setLeave("Please Select LeaveType");
        setAppleave({
            employeename: "Please Select Employee Name", employeeid: "", leavetype: "Please Select LeaveType", durationtype: 'Random', date: "", todate: "", reasonforleave: "", reportingto: "",
            noofshift: '', availabledays: ''
        });
        setAllUsers([]);
        setAvailableDays('');
        setGetSelectedDates([]);
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setBranchOption([]);
        setUnitOption([]);
        setTeamOption([]);
        setEmpname([]);
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => { setIsEditOpen(true); };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setisCheckOpen(true); };
    const handleCloseCheck = () => { setisCheckOpen(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    //get single row to edit....
    const getCode = async (e, name) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAppleaveEdit(res?.data?.sapplyleave);
            setLeaveId(res?.data?.sapplyleave._id);
            setAccesDropEdit(res?.data?.sapplyleave.access);
            setLeaveEdit(res?.data?.sapplyleave.leavetype);
            setAllUsersEdit(res?.data?.sapplyleave.usershifts);
            setGetSelectedDatesEdit(res?.data?.sapplyleave.date);
            setSelectedOptionsCompanyEdit(res?.data?.sapplyleave?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sapplyleave?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sapplyleave?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sapplyleave?.team.map((item) => ({ label: item, value: item })));
            setValueCompanyCatEdit(res?.data?.sapplyleave?.company)
            setValueBranchCatEdit(res?.data?.sapplyleave?.branch)
            setValueUnitCatEdit(res?.data?.sapplyleave?.unit)
            setValueTeamCatEdit(res?.data?.sapplyleave?.team)

            fetchLeaveCriteriaEdit(
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.employeename : isUserRoleAccess.companyname),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.department : isUserRoleAccess.department),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.designation : isUserRoleAccess.designation),
                res?.data?.sapplyleave.leavetype,
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.doj : isUserRoleAccess.doj),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.weekoff : isUserRoleAccess.weekoff),
                (AccessdropEdit === 'HR' ? res?.data?.sapplyleave.employeeid : isUserRoleAccess.empcode),
            );

            setAvailableDaysEdit(res?.data?.sapplyleave?.availabledays);

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_vendor?.data?.applyleaves.filter((item) => item._id !== res?.data?.sapplyleave._id && item.employeeid === res?.data?.sapplyleave.employeeid).flatMap(d => d.date);
            setCheckDuplicateEdit(result);

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const getinfoCodeStatus = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSelectStatus(res?.data?.sapplyleave);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAppleaveEdit(res?.data?.sapplyleave);
            setAllUsersEdit(res?.data?.sapplyleave.usershifts)
            setSelectedOptionsCompanyEdit(res?.data?.sapplyleave?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sapplyleave?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sapplyleave?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sapplyleave?.team.map((item) => ({ label: item, value: item })));

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAppleaveEdit(res?.data?.sapplyleave);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Project updateby edit page...
    let updateby = appleaveEdit?.updatedby;
    let addedby = appleaveEdit?.addedby;
    let updatedByStatus = selectStatus.updatedby;

    let subprojectsid = appleaveEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        let comp = selectedOptionsCompanyEdit.map((item) => item.value);
        let bran = selectedOptionsBranchEdit.map((item) => item.value);
        let unit = selectedOptionsUnitEdit.map((item) => item.value);
        let team = selectedOptionsTeamEdit.map((item) => item.value);

        const currentDate = moment();

        const isAnyPastDate = allUsersEdit.some(user => {
            const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
            return userDate.isBefore(currentDate, 'day');
        });

        let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode
        let noticeresult = res?.data?.noticeperiodapply.some(d => d.empcode === empid);

        try {
            let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${leaveId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employeename: AccessdropEdit === "HR" ? String(appleaveEdit.employeename) : isUserRoleAccess.companyname,
                employeeid: AccessdropEdit === "HR" ? String(appleaveEdit.employeeid) : isUserRoleAccess.empcode,
                leavetype: String(appleaveEdit.leavetype),
                // date: String(appleaveEdit.date),
                // todate: String(appleaveEdit.todate),
                // numberofdays: String(calculateDaysDifferenceEdit()),
                department: String(appleaveEdit.department),
                designation: String(appleaveEdit.designation),
                doj: String(appleaveEdit.doj),
                weekoff: appleaveEdit.weekoff,
                workmode: String(appleaveEdit.workmode),
                date: [...getSelectedDatesEdit],
                numberofdays: String(allUsersEdit.length),
                usershifts: [...allUsersEdit],
                noofshift: Number(appleaveEdit.noofshift),
                durationtype: String(appleaveEdit.durationtype),
                availabledays: Number(appleaveEdit.availabledays ? appleaveEdit.availabledays : availableDaysEdit),
                reasonforleave: String(appleaveEdit.reasonforleave),
                reportingto: AccessdropEdit === "HR" ? String(appleaveEdit.reportingto) : isUserRoleAccess.reportingto,
                uninformedleavestatus: String(appleaveEdit.uninformedleavestatus ? appleaveEdit.uninformedleavestatus : ((leaveRestrictionEdit === true && isAnyPastDate) ? 'Uninformed' : '')),
                noticeperiodstatus: String(appleaveEdit.noticeperiodstatus ? appleaveEdit.noticeperiodstatus : (noticeresult ? 'Noticeperiod' : '')),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            handleCloseModEdit();
            handleCloseerrForTookLeaveCheckEdit();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        const checkLeaveStatus = allUsersEdit?.find(d => d.leavestatus === '')

        fetchApplyleaveAll();

        let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let empid = AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode;
        let uninformResult = res_vendor?.data?.applyleaves.filter((item) => item._id !== appleaveEdit._id && item.employeeid === empid && item.uninformedleavestatus === 'Uninformed').flatMap(d => d.date);
        let noticeresult = res?.data?.noticeperiodapply.some(d => d.empcode === empid);
        let noticeresultDate = res_vendor?.data?.applyleaves.filter((item) => item._id !== appleaveEdit._id && item.employeeid === empid && item.noticeperiodstatus === 'Noticeperiod').flatMap(d => d.date);

        const isNameMatch = allApplyleaveedit.some((item) => item.reasonforleave.toLowerCase() === appleaveEdit.reasonforleave.toLowerCase() && item.employeename === appleaveEdit.employeename && item.leavetype === leaveEdit && item.date === appleaveEdit.date && item.todate === appleaveEdit.todate);

        if (appleaveEdit.employeename === "Please Select Employee Name") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.availabledays == '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"No more available leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (allUsersEdit.length > appleaveEdit.availabledays) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You applied leave more than available days"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.leavetype === "Please Select LeaveType") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select LeaveType"}</p>
                </>
            );
            handleClickOpenerr();
        }
        // else if (appleaveEdit.date === "") {
        //   setShowAlert(
        //     <>
        //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
        //     </>
        //   );
        //   handleClickOpenerr();
        // } 
        // else if (appleaveEdit.todate === "") {
        //   setShowAlert(
        //     <>
        //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
        //     </>
        //   );
        //   handleClickOpenerr();
        // } 
        else if (allUsersEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.noofshift === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checkLeaveStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select All Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (appleaveEdit.reasonforleave === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason for Leave"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {

            if (leavecriterias.length > 0) {
                let weekoff = AccessdropEdit === 'HR' ? appleaveEdit.weekoff : isUserRoleAccess.weekoff
                leavecriteriasEdit.forEach((d) => {

                    let check = allUsersEdit.length > parseInt(d.uninformedleavecount);
                    let uninformedcheck = uninformResult.length >= parseInt(d.uninformedleavecount);
                    let noticeperiodcheck = noticeresultDate.length >= parseInt(d.leavefornoticeperiodcount);
                    let check2 = allUsersEdit.length > parseInt(d.leavefornoticeperiodcount);

                    const currentDate = moment();

                    const isAnyPastDate = allUsersEdit.some(user => {
                        const userDate = moment(user.formattedDate, 'DD/MM/YYYY');
                        return userDate.isBefore(currentDate, 'day');
                    });

                    weekoff?.forEach(empwkoffday => {

                        // find out weekoff's before and after dayname
                        const [beforeDay, afterDay] = getDayBeforeAndAfter(empwkoffday);

                        const hasBeforeDay = allUsersEdit.some(user => user.dayName === beforeDay);
                        const hasAfterDay = allUsersEdit.some(user => user.dayName === afterDay);
                        // const hasWeekOffDay = allUsersEdit.some(user => user.dayName === empwkoffday);

                        const hasBeforeDayDate = allUsersEdit.filter(user => user.dayName === beforeDay).map(d => d.formattedDate);
                        const hasAfterDayDate = allUsersEdit.filter(user => user.dayName === afterDay).map(d => d.formattedDate);

                        let updatedDatesBeforeWeekOffDates = [];
                        let updatedDatesAfterWeekOffDates = [];

                        //for example if selected date is monday
                        hasAfterDayDate.forEach(date => {
                            const [day, month, year] = date.split('/');
                            const currentDate = new Date(`${year}-${month}-${day}`);

                            // Get the day before
                            const dayBefore = new Date(currentDate);
                            dayBefore.setDate(currentDate.getDate() - 1);
                            const formattedDayBefore = `${dayBefore.getDate()}`.padStart(2, '0');
                            const formattedMonthBefore = `${dayBefore.getMonth() + 1}`.padStart(2, '0');
                            updatedDatesBeforeWeekOffDates.push(`${formattedDayBefore}/${formattedMonthBefore}/${dayBefore.getFullYear()}`);

                        });

                        hasBeforeDayDate.forEach(date => {
                            const [day, month, year] = date.split('/');
                            const currentDate = new Date(`${year}-${month}-${day}`);

                            // Get the day after
                            const dayAfter = new Date(currentDate);
                            dayAfter.setDate(currentDate.getDate() + 1);
                            const formattedDayAfter = `${dayAfter.getDate()}`.padStart(2, '0');
                            const formattedMonthAfter = `${dayAfter.getMonth() + 1}`.padStart(2, '0');
                            updatedDatesAfterWeekOffDates.push(`${formattedDayAfter}/${formattedMonthAfter}/${dayAfter.getFullYear()}`);
                        });

                        const hasWeekOffDayNext = allUsersEdit.some(user => updatedDatesAfterWeekOffDates.includes(user.formattedDate));
                        const hasWeekOffDayBefore = allUsersEdit.some(user => updatedDatesBeforeWeekOffDates.includes(user.formattedDate));

                        if (d.leaverespecttoweekoff === true && hasBeforeDay && !hasWeekOffDayNext && !hasWeekOffDayBefore) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date (${updatedDatesAfterWeekOffDates.map(d => d)}, ${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === true && hasAfterDay && !hasWeekOffDayBefore && !hasWeekOffDayNext) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please select Weekoff date(${updatedDatesBeforeWeekOffDates.map(d => d)}) with these selected date`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === false && hasAfterDay) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${afterDay}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttoweekoff === false && hasBeforeDay) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You cannot take leave on ${beforeDay}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.leaverespecttotraining === false && appleaveEdit.workmode === 'Internship') {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in training period. Cannot apply leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult === true && d.leavefornoticeperiod === false) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"You are in notice period. Cannot apply leave"}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.tookleavecheck === true && allUsersEdit.some(val => d.tookleave.includes(val.dayName.toLowerCase()))) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${d.tookleave.map(d => d?.toUpperCase())}`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.uninformedleave === true && isAnyPastDate && check) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.uninformedleavecount} days of leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (d.uninformedleave === true && isAnyPastDate && uninformedcheck && !check) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied Uninformed Leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult === true && d.leavefornoticeperiod === true && check2) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You can apply only ${d.leavefornoticeperiodcount} days of leave`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else if (noticeresult === true && d.leavefornoticeperiod === true && noticeperiodcheck && !check2) {
                            setShowAlert(
                                <>
                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You have already applied leave in the noticeperiod`}</p>
                                </>
                            );
                            handleClickOpenerr();
                        }
                        else {
                            if (d.tookleavecheck === false && allUsers.some(val => d.tookleave.includes(val.dayName.toLowerCase()))) {
                                setShowAlert(
                                    <>
                                        <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${d.tookleave.map(d => d?.toUpperCase())}. If you want to apply leave on this day it will be calculate as a Double Lop. Do you want to apply?`}</p>
                                    </>
                                );
                                handleClickOpenerrForTookLeaveCheckEdit();
                            }
                            else {
                                sendEditRequest();
                            }
                        }
                    })
                })
            }
            else {
                sendEditRequest();
            }
        }
    };

    const sendEditStatus = async () => {
        try {
            let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${selectStatus._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String(selectStatus.status),
                rejectedreason: String(selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""),
                actionby: String(isUserRoleAccess.companyname),
                updatedby: [
                    ...updatedByStatus,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchApplyleave();
            handleStatusClose();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editStatus = () => {
        if (selectStatus.status == "Rejected") {
            if (selectStatus.rejectedreason == "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Rejected Reason"}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                sendEditStatus();
            }
        } else {
            sendEditStatus();
        }
    };

    //get all Sub vendormasters.
    const fetchApplyleave = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplyleavecheck(true);
            let answer = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname);
            setApplyleaves(answer);
            let Approve = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves.filter((data) => data.status === "Approved") : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname && data.status === "Approved");
            setIsApplyLeave(Approve);
        } catch (err) {setApplyleavecheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all Sub vendormasters.
    const fetchApplyleaveAll = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllApplyleaveedit(res_vendor?.data?.applyleaves.filter((item) => item._id !== appleaveEdit._id));
            let empid = Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode;
            let result = res_vendor?.data?.applyleaves.filter((item) => item.employeeid === empid).flatMap(d => d.date);
            setCheckDuplicate(result);

        } catch (err) {setApplyleavecheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Employee Id", field: "employeeid" },
        { title: "Employee Name", field: "employeename" },
        { title: "Leavetype", field: "leavetype" },
        { title: "Date", field: "date" },
        { title: "Number of Shift", field: "noofshift" },
        { title: "Reason for leave", field: "reasonforleave" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = applyleaves.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: itemsWithSerial,
        });
        doc.save("Applyleave.pdf");
    };

    // Excel
    const fileName = "Applyleave";

    const [applyData, setApplyData] = useState([]);

    // get particular columns for export excel
    const getexcelDatas = () => {
        var data = applyleaves?.map((t, index) => ({
            Sno: index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Leave Type": t.leavetype,
            "Date": t.date + ', ',
            "Number of Shift": t.noofshift,
            "Reason for Leave": t.reasonforleave,
        }));
        setApplyData(data);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Applyleave",
        pageStyle: "print",
    });

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        getexcelDatas();
    }, [appleaveEdit, appleave, applyleaves, checkDuplicate]);

    useEffect(() => {
        fetchApplyleave();
        fetchApplyleaveAll();
    }, []);

    useEffect(() => {
        fetchApplyleaveAll();
    }, [isEditOpen, appleaveEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = applyleaves?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [applyleaves]);

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
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "employeeid", headerName: "Employee Id", flex: 0, width: 250, hide: !columnVisibility.employeeid, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "leavetype", headerName: "Leave Type", flex: 0, width: 250, hide: !columnVisibility.leavetype, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 250, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "noofshift", headerName: "Number of Shift", flex: 0, width: 250, hide: !columnVisibility.noofshift, headerClassName: "bold-header" },
        { field: "reasonforleave", headerName: "Reason for Leave", flex: 0, width: 250, hide: !columnVisibility.reasonforleave, headerClassName: "bold-header" },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 90,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            renderCell: (params) => {
                if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && !["Approved", "Rejected"].includes(params.row.status)) {
                    return (
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                                    fontSize: "10px",
                                    width: "60px",
                                    fontWeight: "bold",
                                }}
                            >
                                {params.value}
                            </Button>
                        </Grid>
                    );
                } else {
                    return (
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                                    color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                                    fontSize: "10px",
                                    width: "60px",
                                    fontWeight: "bold",
                                }}
                            >
                                {params.value}
                            </Button>
                        </Grid>
                    );
                }
            },
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {(!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.row.status)) ||
            (isUserRoleCompare?.includes("eapplyleave") && params.row.status !== 'Approved' && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpenEdit();
                  getCode(params.row.id, params.row.name);
                }}
              >
                <EditOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            ))} */}
                    {(!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.row.status)) ||
                        (isUserRoleCompare?.includes("dapplyleave") && params.row.status !== 'Approved' && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.row.id, params.row.name);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                        ))}
                    {isUserRoleCompare?.includes("vapplyleave") && (
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
                    {((isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.row.status)) ||
                        (isUserRoleCompare?.includes("iapplyleave") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    handleClickOpeninfo();
                                    getinfoCode(params.row.id);
                                }}
                            >
                                <InfoOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                        ))}
                    {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin"))
                        ? null
                        : isUserRoleCompare?.includes("iapplyleave") && (
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: "red",
                                    minWidth: "15px",
                                    padding: "6px 5px",
                                }}
                                onClick={(e) => {
                                    getinfoCodeStatus(params.row.id);
                                    handleStatusOpen();
                                }}
                            >
                                <FaEdit style={{ color: "white", fontSize: "17px" }} />
                            </Button>
                        )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            employeeid: item.employeeid,
            employeename: item.employeename,
            leavetype: item.leavetype,
            // date: item.date + "--" + item.todate,
            date: item.date,
            noofshift: item.noofshift,
            reasonforleave: item.reasonforleave,
            status: item.status,
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

    const DateFrom = (isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && Accessdrop === "HR" ? formattedDatePresent : formattedDatet;

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
    return (
        <Box>
            <Headtitle title={"Apply Leave"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Apply Leave</Typography>
            {isUserRoleCompare?.includes("aapplyleave") && (
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}> Manage Apply Leave</Typography>
                            </Grid>
                            {(isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && (
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Access</Typography>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={Accessdrop}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                },
                                            }}
                                            onChange={(e) => {
                                                setAccesDrop(e.target.value);
                                                setAppleave({ ...appleave, durationtype: 'Random', date: "", todate: "" });
                                                setAllUsers([]);
                                                setGetSelectedDates([]);
                                            }}
                                        >
                                            <MenuItem value={"Employee"}>Self</MenuItem>
                                            <MenuItem value={"HR"}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            {Accessdrop === "HR" ? (
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={companyOption}
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
                                                options={branchOption
                                                    ?.filter((u) => valueCompanyCat?.includes(u.company))
                                                    .map((u) => ({
                                                        ...u,
                                                        label: u.name,
                                                        value: u.name,
                                                    }))}
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
                                                options={unitOption
                                                    ?.filter((u) => valueBranchCat?.includes(u.branch))
                                                    .map((u) => ({
                                                        ...u,
                                                        label: u.name,
                                                        value: u.name,
                                                    }))}
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
                                                options={teamOption
                                                    ?.filter((u) => valueUnitCat?.includes(u.unit))
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
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                // options={empnames}
                                                options={empnames
                                                    ?.filter(
                                                        (u) =>
                                                            valueCompanyCat?.includes(u.company) &&
                                                            valueBranchCat?.includes(u.branch) &&
                                                            valueUnitCat?.includes(u.unit) &&
                                                            valueTeamCat?.includes(u.team)
                                                    )
                                                    .map((u) => ({
                                                        ...u,
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))}
                                                styles={colourStyles}
                                                value={{ label: appleave.employeename, value: appleave.employeename }}
                                                onChange={(e) => {
                                                    setAppleave({ ...appleave, employeename: e.value, employeeid: e.empcode, reportingto: e.reportingto, department: e.department, designation: e.designation, doj: e.doj, weekoff: e.weekoff, workmode: e.workmode, date: "", todate: "", noofshift: '', leavetype: 'Please Select LeaveType' });
                                                    setAllUsers([]);
                                                    setGetSelectedDates([]);
                                                    setAvailableDays('');
                                                    // fetchLeaveCriteria(e.employeename, e.department, e.designation, appleave.leavetype, e.doj,);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee ID </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleave.employeeid} />
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee Name</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={isUserRoleAccess.companyname} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee ID </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={isUserRoleAccess.empcode} />
                                        </FormControl>
                                    </Grid>
                                </>
                            )}

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Leave Type<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        size="small"
                                        options={leaveTypeData}
                                        styles={colourStyles}
                                        value={{ label: appleave.leavetype, value: appleave.leavetype }}
                                        onChange={(e) => {
                                            setAppleave({ ...appleave, leavetype: e.value });
                                            fetchLeaveCriteria(
                                                (Accessdrop === 'HR' ? appleave.employeename : isUserRoleAccess.companyname),
                                                (Accessdrop === 'HR' ? appleave.department : isUserRoleAccess.department),
                                                (Accessdrop === 'HR' ? appleave.designation : isUserRoleAccess.designation),
                                                e.value,
                                                (Accessdrop === 'HR' ? appleave.doj : isUserRoleAccess.doj),
                                                (Accessdrop === 'HR' ? appleave.weekoff : isUserRoleAccess.weekoff),
                                                (Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode),
                                            );
                                            setAvailableDays('');
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Remaining Days </Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={appleave.leavetype === 'Casual Leave' ? availableDays : availableDays} />
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Duration Type<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        size="small"
                                        options={durationOptions}
                                        styles={colourStyles}
                                        value={{ label: appleave.durationtype, value: appleave.durationtype }}
                                        onChange={(e) => {
                                            setAppleave({ ...appleave, durationtype: e.value, date: '', todate: '', noofshift: '' });
                                            setAllUsers([]);
                                            setGetSelectedDates([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {appleave.durationtype === 'Random' ? (
                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Grid container spacing={1.2} marginTop={1}>
                                            <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                                                <Typography>
                                                    Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item md={4.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={appleave.date}
                                                        onChange={(e) => {
                                                            if (leaveRestriction === true) {
                                                                setAppleave({ ...appleave, date: e.target.value })
                                                            } else {
                                                                setAppleave({ ...appleave, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1} sm={12} xs={12} marginTop={1}>
                                                <Button variant="contained" color="success" type="button" sx={{ height: "30px", minWidth: "30px", padding: "6px 10px", marginTop: '4px' }}
                                                    onClick={(e) => {
                                                        if (Accessdrop === 'HR' && appleave.employeename === 'Please Select Employee Name') {
                                                            setShowAlert(
                                                                <>
                                                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                                                                </>
                                                            );
                                                            handleClickOpenerr();
                                                        } else {
                                                            fetchUsersRandom((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date)
                                                        }
                                                    }} >
                                                    <FaPlus />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={5} xs={12} sm={12}>
                                        <Grid container spacing={1.2} marginTop={1}>
                                            <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                                                <Typography>
                                                    Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item md={4.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={appleave.date}
                                                        onChange={(e) => {
                                                            if (leaveRestriction === true) {
                                                                setAppleave({ ...appleave, date: e.target.value })
                                                            } else {
                                                                setAppleave({ ...appleave, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });

                                                                //   fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), e.target.value, appleave.todate)
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1} xs={12} sm={12} marginTop={1}>
                                                <Typography>To</Typography>
                                            </Grid>
                                            <Grid item md={4.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={appleave.todate}
                                                        onChange={(e) => {
                                                            if (leaveRestriction === true) {
                                                                setAppleave({ ...appleave, todate: e.target.value })
                                                            } else {
                                                                setAppleave({ ...appleave, todate: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? (new Date(e.target.value) >= new Date(appleave.date) ? e.target.value : "") : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : new Date(e.target.value) >= new Date(appleave.date) ? e.target.value : "" });
                                                                // setAppleave({ ...appleave, todate: e.target.value });
                                                                // fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date, e.target.value)
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={0.5} sm={12} xs={12} marginTop={1}>
                                                <Button variant="contained" color="success" type="button" sx={{ height: "30px", minWidth: "30px", padding: "6px 10px", marginTop: '-2px' }}
                                                    onClick={(e) => {
                                                        if (Accessdrop === 'HR' && appleave.employeename === 'Please Select Employee Name') {
                                                            setShowAlert(
                                                                <>
                                                                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                                                                </>
                                                            );
                                                            handleClickOpenerr();
                                                        } else {
                                                            fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date, appleave.todate)
                                                        }
                                                    }} >
                                                    <FaPlus />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </>
                            )}
                            <br />
                            <Grid item md={8} xs={12} sm={12}></Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <>
                                    {allUsers.length > 0 ?
                                        (<Grid container>
                                            <Grid item md={5} sm={12} xs={12}>
                                                <Typography>Shift</Typography>
                                            </Grid>
                                            <Grid item md={4} sm={12} xs={12}>
                                                <Typography>Leave<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={2} sm={12} xs={12}>
                                                <Typography>Count<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                        </Grid>)
                                        : null}
                                    {allUsers &&
                                        allUsers.map((column, index) => (
                                            <Grid container key={index}>
                                                <React.Fragment key={index}>
                                                    <Grid item md={5} sm={6} xs={12} fullWidth>
                                                        <Box sx={{ border: '1px solid #80808094', font: 'inherit', color: 'currentColor', fontSize: '14px', lineHeight: 1.3, padding: '8.5px 14px', borderRadius: '3.5px', display: 'block', background: '#80808030', margin: '0.5px' }}>
                                                            {`${column.formattedDate} (${column.shift})`}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item md={4} sm={6} xs={12} fullWidth>
                                                        <Box sx={{ display: 'block', margin: '0.5px' }}>
                                                            <Selects
                                                                size="small"
                                                                options={leaveStatusOptions}
                                                                styles={colourStyles}
                                                                value={leaveStatusOptions.find(option => option.value === column.leavestatus)}
                                                                onChange={(selectedOption) => multiLeaveStatusInputs(index, selectedOption.value)}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item md={2} sm={6} xs={12} fullWidth>
                                                        <Box sx={{ display: 'block', margin: '0.5px' }}>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                value={column.shiftcount}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item md={1} sm={6} xs={1} sx={{ display: 'flex' }}>
                                                        <Button variant="contained" color="error" type="button" onClick={(e) => handleDelete(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}>x</Button>
                                                    </Grid>
                                                </React.Fragment>

                                            </Grid>
                                        ))}
                                </>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Number of Shift</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={appleave.noofshift}
                                    //  onChange={(e) => {
                                    //   setAppleave({ ...appleave, reasonforleave: e.target.value });
                                    // }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Reason for Leave<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={5}
                                        value={appleave.reasonforleave}
                                        onChange={(e) => {
                                            setAppleave({ ...appleave, reasonforleave: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Reporting To </Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={Accessdrop === "HR" ? appleave.reportingto : isUserRoleAccess.reportingto} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2.5} xs={12} sm={6}>
                                {/* {isUserRoleCompare?.includes("aapplyleave") && ( */}
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Submit
                                </Button>
                                {/* )} */}
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={6}>
                                {/* {isUserRoleCompare?.includes("aapplyleave") && ( */}
                                <Button sx={userStyle.btncancel} onClick={handleClear}>
                                    Clear
                                </Button>
                                {/* )} */}
                            </Grid>
                        </Grid>
                    </>
                </Box>
            )}
            <br />
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                // sx={{
                //   overflow: "visible",
                //   "& .MuiPaper-root": {
                //     overflow: "visible",
                //   },
                // }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <form >
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={8} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Apply Leave</Typography>
                                    </Grid>
                                    {(isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && (
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControl size="small" fullWidth>
                                                <Typography>Access</Typography>
                                                <Select
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={AccessdropEdit}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 200,
                                                            },
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        setAccesDropEdit(e.target.value);
                                                        setAppleaveEdit({ ...appleaveEdit, date: "", todate: "" });
                                                    }}
                                                >
                                                    <MenuItem value={"Employee"}>Self</MenuItem>
                                                    <MenuItem value={"HR"}>Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    {AccessdropEdit === "HR" ? (
                                        <>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Company<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={companyOption}
                                                        value={selectedOptionsCompanyEdit}
                                                        onChange={(e) => {
                                                            handleCompanyChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererCompanyEdit}
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
                                                        options={branchOption
                                                            ?.filter((u) => valueCompanyCatEdit?.includes(u.company))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.name,
                                                                value: u.name,
                                                            }))}
                                                        value={selectedOptionsBranchEdit}
                                                        onChange={(e) => {
                                                            handleBranchChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranchEdit}
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
                                                        options={unitOption
                                                            ?.filter((u) => valueBranchCatEdit?.includes(u.branch))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.name,
                                                                value: u.name,
                                                            }))}
                                                        value={selectedOptionsUnitEdit}
                                                        onChange={(e) => {
                                                            handleUnitChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnitEdit}
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
                                                        options={teamOption
                                                            ?.filter((u) => valueUnitCatEdit?.includes(u.unit))
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.teamname,
                                                                value: u.teamname,
                                                            }))}
                                                        value={selectedOptionsTeamEdit}
                                                        onChange={(e) => {
                                                            handleTeamChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererTeamEdit}
                                                        labelledBy="Please Select Team"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Employee Name<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        // options={empnamesEdit}
                                                        options={empnamesEdit
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCatEdit?.includes(u.company) &&
                                                                    valueBranchCatEdit?.includes(u.branch) &&
                                                                    valueUnitCatEdit?.includes(u.unit) &&
                                                                    valueTeamCatEdit?.includes(u.team)
                                                            )
                                                            .map((u) => ({
                                                                ...u,
                                                                label: u.companyname,
                                                                value: u.companyname,
                                                            }))}
                                                        styles={colourStyles}
                                                        value={{ label: appleaveEdit.employeename, value: appleaveEdit.employeename }}
                                                        onChange={(e) => {
                                                            setAppleaveEdit({ ...appleaveEdit, employeename: e.value, employeeid: e.empcode, reportingto: e.reportingto, department: e.department, designation: e.designation, doj: e.doj, weekoff: e.weekoff, workmode: e.workmode, date: "", todate: "" });
                                                            setAvailableDaysEdit('');
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Employee ID </Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.employeeid} />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Employee Name</Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={isUserRoleAccess.companyname} />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Employee ID </Typography>
                                                    <OutlinedInput id="component-outlined" type="text" value={isUserRoleAccess.empcode} />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Leave Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                size="small"
                                                options={leaveTypeData}
                                                styles={colourStyles}
                                                value={{ label: appleaveEdit.leavetype, value: appleaveEdit.leavetype }}
                                                onChange={(e) => {
                                                    setAppleaveEdit({ ...appleaveEdit, leavetype: e.value });
                                                    fetchLeaveCriteriaEdit(
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.employeename : isUserRoleAccess.companyname),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.department : isUserRoleAccess.department),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.designation : isUserRoleAccess.designation),
                                                        e.value,
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.doj : isUserRoleAccess.doj),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.weekoff : isUserRoleAccess.weekoff),
                                                        (AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode),
                                                    );
                                                    setAvailableDaysEdit('');
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    {/* <Grid item md={4} xs={12} sm={12}>
                    <Grid container spacing={1.2} marginTop={1}>
                      <Grid item md={1.2} xs={12} sm={12} marginTop={1}>
                        <Typography>
                          Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleaveEdit.date}
                            onChange={(e) => {
                              setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1.2} xs={12} sm={12} marginTop={1}>
                        <Typography>To</Typography>
                      </Grid>
                      <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleaveEdit.todate}
                            onChange={(e) => {
                              setAppleaveEdit({ ...appleaveEdit, todate: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? (new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "") : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "" });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1} xs={12} sm={12}></Grid>
                    </Grid>
                  </Grid>
                  <br /> */}

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Remaining Days </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.availabledays ? appleaveEdit.availabledays : availableDaysEdit} />
                                        </FormControl>
                                    </Grid>
                                    <br />
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Duration Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.durationtype} />
                                            {/* <Selects
                        size="small"
                        options={durationOptions}
                        styles={colourStyles}
                        value={{ label: appleaveEdit.durationtype, value: appleaveEdit.durationtype }}
                        onChange={(e) => {
                          setAppleaveEdit({ ...appleaveEdit, durationtype: e.value, date: '', todate: '', noofshift: '' });
                          // setAllUsersEdit([]);
                          // setGetSelectedDatesEdit([]);
                        }}
                      /> */}
                                        </FormControl>
                                    </Grid>
                                    {appleaveEdit.durationtype === 'Random' ? (
                                        <>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container spacing={1.2} marginTop={1}>
                                                    <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                                                        <Typography>
                                                            Date<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4.5} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="date"
                                                                value={appleaveEdit.date}
                                                                onChange={(e) => {
                                                                    if (leaveRestrictionEdit === true) {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: e.target.value })
                                                                    } else {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={1} sm={12} xs={12} marginTop={1}>
                                                        <Button variant="contained" color="success" type="button" sx={{ height: "30px", minWidth: "30px", padding: "6px 10px", marginTop: '4px' }}
                                                            onClick={(e) => {
                                                                if (AccessdropEdit === 'HR' && appleaveEdit.employeename === 'Please Select Employee Name') {
                                                                    setShowAlert(
                                                                        <>
                                                                            <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                                                                        </>
                                                                    );
                                                                    handleClickOpenerr();
                                                                } else {
                                                                    fetchUsersRandomEdit((AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode), appleaveEdit.date)
                                                                }
                                                            }} >
                                                            <FaPlus />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item md={5} xs={12} sm={12}>
                                                <Grid container spacing={1.2} marginTop={1}>
                                                    <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                                                        <Typography>
                                                            Date<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={4.5} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="date"
                                                                value={appleaveEdit.date}
                                                                onChange={(e) => {
                                                                    if (leaveRestrictionEdit === true) {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: e.target.value })
                                                                    } else {
                                                                        setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });

                                                                        //   fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), e.target.value, appleave.todate)
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={1} xs={12} sm={12} marginTop={1}>
                                                        <Typography>To</Typography>
                                                    </Grid>
                                                    <Grid item md={4.5} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="date"
                                                                value={appleaveEdit.todate}
                                                                onChange={(e) => {
                                                                    if (leaveRestrictionEdit === true) {
                                                                        setAppleaveEdit({ ...appleaveEdit, todate: e.target.value })
                                                                    } else {
                                                                        setAppleaveEdit({ ...appleaveEdit, todate: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? (new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "") : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "" });
                                                                        // setAppleave({ ...appleave, todate: e.target.value });
                                                                        // fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date, e.target.value)
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={0.5} sm={12} xs={12} marginTop={1}>
                                                        <Button variant="contained" color="success" type="button" sx={{ height: "30px", minWidth: "30px", padding: "6px 10px", marginTop: '-2px' }}
                                                            onClick={(e) => {
                                                                if (AccessdropEdit === 'HR' && appleaveEdit.employeename === 'Please Select Employee Name') {
                                                                    setShowAlert(
                                                                        <>
                                                                            <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Name"}</p>
                                                                        </>
                                                                    );
                                                                    handleClickOpenerr();
                                                                } else {
                                                                    fetchUsersEdit((AccessdropEdit === 'HR' ? appleaveEdit.employeeid : isUserRoleAccess.empcode), appleaveEdit.date, appleaveEdit.todate)
                                                                }
                                                            }} >
                                                            <FaPlus />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                        </>
                                    )}
                                    <br />
                                    <Grid item md={8} xs={12} sm={12}></Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <>
                                            {allUsersEdit.length > 0 ?
                                                (<Grid container>
                                                    <Grid item md={5} sm={12} xs={12}>
                                                        <Typography>Shift</Typography>
                                                    </Grid>
                                                    <Grid item md={4} sm={12} xs={12}>
                                                        <Typography>Leave<b style={{ color: "red" }}>*</b></Typography>
                                                    </Grid>
                                                    <Grid item md={2} sm={12} xs={12}>
                                                        <Typography>Count<b style={{ color: "red" }}>*</b></Typography>
                                                    </Grid>
                                                </Grid>)
                                                : null}
                                            {allUsersEdit &&
                                                allUsersEdit.map((column, index) => (
                                                    <Grid container key={index}>
                                                        <React.Fragment key={index}>
                                                            <Grid item md={5} sm={6} xs={12} fullWidth>
                                                                <Box sx={{ border: '1px solid #80808094', font: 'inherit', color: 'currentColor', fontSize: '14px', lineHeight: 1.3, padding: '8.5px 14px', borderRadius: '3.5px', display: 'block', background: '#80808030', margin: '0.5px' }}>
                                                                    {`${column.formattedDate} (${column.shift})`}
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={4} sm={6} xs={12} fullWidth>
                                                                <Box sx={{ display: 'block', margin: '0.5px' }}>
                                                                    <Selects
                                                                        size="small"
                                                                        options={leaveStatusOptions}
                                                                        styles={colourStyles}
                                                                        value={leaveStatusOptions.find(option => option.value === column.leavestatus)}
                                                                        onChange={(selectedOption) => multiLeaveStatusInputsEdit(index, selectedOption.value)}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={2} sm={6} xs={12} fullWidth>
                                                                <Box sx={{ display: 'block', margin: '0.5px' }}>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        value={column.shiftcount}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={1} sm={6} xs={1} sx={{ display: 'flex' }}>
                                                                <Button variant="contained" color="error" type="button" onClick={(e) => handleDeleteEdit(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}>x</Button>
                                                            </Grid>
                                                        </React.Fragment>

                                                    </Grid>
                                                ))}
                                        </>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Number of Shift</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={appleaveEdit.noofshift}
                                            //  onChange={(e) => {
                                            //   setAppleave({ ...appleave, reasonforleave: e.target.value });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12}></Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Reason for Leave<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={appleaveEdit.reasonforleave}
                                                onChange={(e) => {
                                                    setAppleaveEdit({ ...appleaveEdit, reasonforleave: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Reporting To </Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={AccessdropEdit === "HR" ? appleaveEdit.reportingto : isUserRoleAccess.reportingto} />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" onClick={editSubmit}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                                {/* </DialogContent> */}
                            </form>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lapplyleave") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Apply Leave List</Typography>
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
                                        <MenuItem value={applyleaves?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelapplyleave") && (
                                        <>
                                            <ExportXL csvData={applyData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvapplyleave") && (
                                        <>
                                            <ExportCSV csvData={applyData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printapplyleave") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfapplyleave") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageapplyleave") && (
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
                        {isUserRoleCompare?.includes("bdapplyleave") && (
                            <>
                                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                    Bulk Delete
                                </Button>
                            </>
                        )}
                        <br />
                        <br />
                        {!applyleaveCheck ? (
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
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delApply(Applysid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}

                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Apply Leave Info</Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Updated by</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}>
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>

                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell> Employee Id</TableCell>
                                <TableCell>Employee Name</TableCell>
                                <TableCell>Leave Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Number of days</TableCell>
                                <TableCell>Reason for leave</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {applyleaves &&
                                applyleaves.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.employeeid}</TableCell>
                                        <TableCell>{row.employeename}</TableCell>
                                        <TableCell>{row.leavetype}</TableCell>
                                        <TableCell>{row.date + ", "}</TableCell>
                                        <TableCell>{row.noofshift}</TableCell>
                                        <TableCell>{row.reasonforleave}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                <Box sx={{ width: "950px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Apply Leave</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            {(isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply")) && (
                                <Grid item md={3} sm={6} xs={12}>
                                    <Typography variant="h6">Access</Typography>
                                    <Typography>{appleaveEdit.access}</Typography>
                                </Grid>
                            )}
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            {appleaveEdit.access === "HR" ? (
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Company </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsCompanyEdit) ? selectedOptionsCompanyEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Branch</Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsBranchEdit) ? selectedOptionsBranchEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Unit  </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsUnitEdit) ? selectedOptionsUnitEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6"> Team </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsTeamEdit) ? selectedOptionsTeamEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee Name</Typography>
                                            <Typography>{appleaveEdit.employeename}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee ID </Typography>
                                            <Typography>{appleaveEdit.employeeid}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee Name</Typography>
                                            <Typography>{appleaveEdit.employeename}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Employee ID </Typography>
                                            <Typography>{appleaveEdit.employeeid}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Leave Type</Typography>
                                    <Typography>{appleaveEdit.leavetype}</Typography>
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{appleaveEdit.date}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Date</Typography>
                  <Typography>{appleaveEdit.todate}</Typography>
                </FormControl>
              </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Remaining Days </Typography>
                                    <Typography>{appleaveEdit.availabledays}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Duration Type</Typography>
                                    <Typography>{appleaveEdit.durationtype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{appleaveEdit.date + ", "}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={8} xs={12} sm={12}></Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <>
                                    {allUsersEdit.length > 0 ?
                                        (<Grid container>
                                            <Grid item md={5} sm={6} xs={12}>
                                                <Typography variant="h6">Shift</Typography>
                                            </Grid>
                                            <Grid item md={4} sm={6} xs={12}>
                                                <Typography variant="h6">Leave</Typography>
                                            </Grid>
                                            <Grid item md={2} sm={6} xs={12}>
                                                <Typography variant="h6">Count</Typography>
                                            </Grid>
                                        </Grid>)
                                        : null}
                                    {allUsersEdit &&
                                        allUsersEdit.map((column, index) => (
                                            <Grid container key={index}>
                                                <React.Fragment key={index}>
                                                    <Grid item md={5} sm={6} xs={12} fullWidth>
                                                        <Typography>{`${column.formattedDate} (${column.shift})`}</Typography>
                                                    </Grid>
                                                    <Grid item md={4} sm={6} xs={12} fullWidth>
                                                        <Typography>{column.leavestatus}</Typography>
                                                    </Grid>
                                                    <Grid item md={2} sm={6} xs={12} fullWidth>
                                                        <Typography>{column.shiftcount}</Typography>
                                                    </Grid>
                                                </React.Fragment>
                                            </Grid>
                                        ))}
                                </>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Number of Shift</Typography>
                                    <Typography>{appleaveEdit.noofshift}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12}></Grid>
                            <Grid item md={3.5} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reason for Leave</Typography>
                                    <Typography>{appleaveEdit.reasonforleave}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3.7} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reporting To</Typography>
                                    <Typography>{appleaveEdit.reportingto}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}
                        >
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delApplycheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
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

            <Box>
                <Dialog open={isErrorOpenForTookLeaveCheck} onClose={handleCloseerrForTookLeaveCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={sendRequest}>
                            ok
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCloseerrForTookLeaveCheck}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog open={isErrorOpenForTookLeaveCheckEdit} onClose={handleCloseerrForTookLeaveCheckEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={sendEditRequest}>
                            ok
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCloseerrForTookLeaveCheckEdit}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* dialog status change */}
            <Box>
                <Dialog maxWidth="lg" open={statusOpen} onClose={handleStatusClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "600px",
                            height: selectStatus.status == "Rejected" ? "260px" : "220px",
                            overflow: "visible",
                            "& .MuiPaper-root": {
                                overflow: "visible",
                            },
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>Edit Apply Status</Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Status<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        fullWidth
                                        options={[
                                            { label: "Approved", value: "Approved" },
                                            { label: "Rejected", value: "Rejected" },
                                            { label: "Applied", value: "Applied" },
                                        ]}
                                        value={{ label: selectStatus.status, value: selectStatus.value }}
                                        onChange={(e) => {
                                            setSelectStatus({ ...selectStatus, status: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12}>
                                {selectStatus.status == "Rejected" ? (
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Reason for Rejected<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={selectStatus.rejectedreason}
                                            onChange={(e) => {
                                                setSelectStatus({ ...selectStatus, rejectedreason: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                ) : null}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    {selectStatus.status == "Rejected" ? <br /> : null}
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
                            onClick={() => {
                                editStatus();
                                // handleCloseerrpop();
                            }}
                        >
                            Update
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                            onClick={() => {
                                handleStatusClose();
                                setSelectStatus({});
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default Applyleave;
