import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Headtitle from "../../components/Headtitle";
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
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";

function LeaveCriteria() {

    const [leavecriteria, setLeavecriteria] = useState({
        leavetype: "Please Select Leave Type", numberofdays: "0", experience: "", experiencein: "",
        leaveautocheck: "", leaveautoincrease: "", leaveautoincreasedays: "", leaveautodays: "Choose Mode",
        pendingleave: "", pendingfrommonth: "Choose Month", pendingfromdate: "Choose Day",
        leavecalculation: "", leavefrommonth: "Choose Month", leavefromdate: "Choose Day", leavetomonth: "Choose Month", leavetodate: "Choose Day",
        tookleave: "", applicablesalary: "", fullsalary: "", halfsalary: "", mode: "Department",
        leaverespecttoweekoff: false,
        leaverespecttotraining: false,



        uninformedleave: false,
        uninformedleavecount: "",


        leavefornoticeperiod: false,
        leavefornoticeperiodcount: "",

        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,

        tookleavecheck: false,
        weekstartday: "Monday",

    });

    const [leavecriteriaEdit, setLeavecriteriaEdit] = useState({
        leavetype: "", numberofdays: "0", experience: "", experiencein: "Choose Mode",
        leaveautocheck: "", leaveautoincrease: "", leaveautoincreasedays: "", leaveautodays: "Choose Mode",
        pendingleave: "", pendingfrommonth: "Choose Month", pendingfromdate: "Choose Day",
        leavecalculation: "", leavefrommonth: "Choose Month", leavefromdate: "Choose Day", leavetomonth: "Choose Month", leavetodate: "Choose Day",
        tookleave: "", applicablesalary: "", fullsalary: "", halfsalary: "",
        leaverespecttoweekoff: false,
        leaverespecttotraining: false,



        uninformedleave: false,
        uninformedleavecount: "",


        leavefornoticeperiod: false,
        leavefornoticeperiodcount: "",
        mode: "Please Select Mode",
        tookleavecheck: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,

    });

    const [branchOption, setBranchOption] = useState([]);
    const [companyOption, setCompanyOption] = useState([]);

    const [unitOption, setUnitOption] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [participantsOption, setParticipantsOption] = useState([]);

    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    const [valueCate, setValueCate] = useState("");

    const [departmentOption, setDepartmentOption] = useState([]);

    const [designationOption, setDesignationOption] = useState([]);

    const [leaveTypeOption, setLeaveTypeOption] = useState([]);

    const [btnSubmit, setBtnSubmit] = useState(false);
    const [btnSubmitEdit, setBtnSubmitEdit] = useState(false);

    const appfromModes = [
        { label: "Month", value: "Month" },
        { label: "Year", value: "Year" },
    ]

    const days = [
        { label: 'Monday', value: "Monday" },
        { label: 'Tuesday', value: "Tuesday" },
        { label: 'Wednesday', value: "Wednesday" },
        { label: 'Thursday', value: "Thursday" },
        { label: 'Friday', value: "Friday" },
        { label: 'Saturday', value: "Saturday" },
        { label: 'Sunday', value: "Sunday" },
    ];

    const [tookLeave, setTookLeave] = useState([]);

    const [tookLeaveEdit, setTookLeaveEdit] = useState([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //Designation multiselect
    const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState(
        []
    );
    let [valueDesignationCat, setValueDesignationCat] = useState([]);

    const handleDesignationChange = (options) => {
        setValueDesignationCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignation(options);
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDesignation = (valueDesignationCat, _categoryname) => {
        return valueDesignationCat?.length
            ? valueDesignationCat.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
    };


    //Department multiselect
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
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
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
        setValueCate([]);
        setSelectedOptionsCate([]);
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
        setValueCate([]);
        setSelectedOptionsCate([]);
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
        setValueCate([]);
        setSelectedOptionsCate([]);
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
        setValueCate([]);
        setSelectedOptionsCate([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };
    const customValueRendererCate = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Participants";
    };


    //get all leave types.
    const fetchLeaveTypesAll = async () => {
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
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

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
    //function to fetch participants
    const fetchParticipants = async () => {
        try {
            let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setParticipantsOption([
                ...res_participants?.data?.users?.map((t) => ({
                    ...t,
                    label: t.companyname,
                    value: t.companyname,
                })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //function to fetch department based on branch and team
    const fetchDepartmentAll = async () => {
        try {
            let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setDepartmentOption([
                ...res_deptandteam?.data?.departmentdetails?.map((t) => ({
                    ...t,
                    label: t.deptname,
                    value: t.deptname,
                })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //function to fetch department based on branch and team
    const fetchDesignationAll = async () => {
        try {
            let res_desig = await axios.get(SERVICE.DESIGNATION, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setDesignationOption([
                ...res_desig?.data?.designation
                    ?.map((t) => ({
                        ...t,
                        label: t.name,
                        value: t.name,
                    })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const [branchOptionEdit, setBranchOptionEdit] = useState([]);
    const [companyOptionEdit, setCompanyOptionEdit] = useState([]);

    const [unitOptionEdit, setUnitOptionEdit] = useState([]);
    const [teamOptionEdit, setTeamOptionEdit] = useState([]);
    const [participantsOptionEdit, setParticipantsOptionEdit] = useState([]);

    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
    const [valueCateEdit, setValueCateEdit] = useState("");

    const [departmentOptionEdit, setDepartmentOptionEdit] = useState([]);

    const [designationOptionEdit, setDesignationOptionEdit] = useState([]);

    const [leaveTypeOptionEdit, setLeaveTypeOptionEdit] = useState([]);




    //Designation multiselect
    const [selectedOptionsDesignationEdit, setSelectedOptionsDesignationEdit] = useState(
        []
    );
    let [valueDesignationCatEdit, setValueDesignationCatEdit] = useState([]);

    const handleDesignationChangeEdit = (options) => {
        setValueDesignationCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignationEdit(options);
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDesignationEdit = (valueDesignationCatEdit, _categoryname) => {
        return valueDesignationCatEdit?.length
            ? valueDesignationCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
    };


    //Department multiselect
    const [selectedOptionsDepartmentEdit, setSelectedOptionsDepartmentEdit] = useState(
        []
    );
    let [valueDepartmentCatEdit, setValueDepartmentCatEdit] = useState([]);

    const handleDepartmentChangeEdit = (options) => {
        setValueDepartmentCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartmentEdit(options);
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDepartmentEdit = (valueDepartmentCatEdit, _categoryname) => {
        return valueDepartmentCatEdit?.length
            ? valueDepartmentCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
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
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
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
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
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
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
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
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
    };

    const customValueRendererTeamEdit = (valueTeamCatEdit, _categoryname) => {
        return valueTeamCatEdit?.length
            ? valueTeamCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    const handleCategoryChangeEdit = (options) => {
        setValueCateEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCateEdit(options);
    };
    const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
        return valueCateEdit.length
            ? valueCateEdit.map(({ label }) => label).join(", ")
            : "Please Select Participants";
    };

    // get current year
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(10), (val, index) => currentYear + index);

    const [leavecriterias, setLeavecriterias] = useState([]);
    const [leavecriteriasAll, setLeavecriteriasAll] = useState([]);
    const [leavecriteriasAllEdit, setLeavecriteriasAllEdit] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allLeavecriteriaedit, setAllLeavecriteriaedit] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [leavecriteriaCheck, setLeavecriteriacheck] = useState(false);

    const [experiencein, setExperiencein] = useState("Month");
    const [leaveautodays, setLeaveautodays] = useState("Month");
    const [pendingfrommonth, setPendingfrommonth] = useState("Choose Month");
    const [pendingfromyear, setPendingfromyear] = useState("Choose Year");
    const [leavefrommonth, setLeavefrommonth] = useState("Choose Month");
    const [leavetomonth, setLeavetomonth] = useState("Choose Month");
    const [leavefromdate, setLeavefromdate] = useState("Choose Day");
    const [leavetodate, setLeavetodate] = useState("Choose Day");
    const [pendingfromdate, setPendingfromdate] = useState("Choose Day");

    const [experienceinEdit, setExperienceinEdit] = useState("Choose Mode");
    const [leaveautodaysEdit, setLeaveautodaysEdit] = useState("Choose Mode");
    const [pendingfrommonthEdit, setPendingfrommonthEdit] = useState("Choose Month");
    const [pendingfromyearEdit, setPendingfromyearEdit] = useState("Choose Year");
    const [leavefrommonthEdit, setLeavefrommonthEdit] = useState("Choose Month");
    const [leavetomonthEdit, setLeavetomonthEdit] = useState("Choose Month");
    const [leavefromdateEdit, setLeavefromdateEdit] = useState("Choose Day");
    const [leavetodateEdit, setLeavetodateEdit] = useState("Choose Day");
    const [pendingfromdateEdit, setPendingfromdateEdit] = useState("Choose Day");

    const modes = [
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
        { label: "Employee", value: "Employee" },
    ]



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

    const [selectedDays, setSelectedDays] = useState([]);
    const handleCheckboxChange = (event) => {
        const selectedDay = event.target.name;
        const updatedSelectedDays = selectedDays.includes(selectedDay) ? selectedDays.filter((day) => day !== selectedDay) : [...selectedDays, selectedDay];

        setSelectedDays(updatedSelectedDays);

        // If you need to do something with the updated array, you can use it here.
    };

    const [selectedDaysEdit, setSelectedDaysEdit] = useState([]);

    const handleCheckboxChangeEdit = (event) => {
        const selectedDay = event.target.name;
        const updatedSelectedDays = selectedDaysEdit.includes(selectedDay) ? selectedDaysEdit.filter((day) => day !== selectedDay) : [...selectedDaysEdit, selectedDay];

        setSelectedDaysEdit(updatedSelectedDays);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Leave Control Criteria.png");
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
        setBtnSubmit(false);
        setBtnSubmitEdit(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        department: true,
        designation: true,

        leavetype: true,
        numberofdays: true,
        experience: true,
        experiencein: true,
        leaveautocheck: true,
        leaveautoincrease: true,
        leaveautodays: true,
        pendingleave: true,
        pendingfrommonth: true,
        pendingfromdate: true,
        leavecalculation: true,
        leavefrommonth: true,
        leavefromdate: true,
        leavetomonth: true,
        leavetodate: true,
        tookleavecheck: true,
        tookleave: true,
        applicablesalary: true,
        fullsalary: true,
        halfsalary: true,

        leaverespecttoweekoff: true,
        leaverespecttotraining: true,
        uninformedleave: true,
        uninformedleavecount: true,
        leavefornoticeperiod: true,
        leavefornoticeperiodcount: true,

        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteLeavecriteria, setDeleteLeavecriteria] = useState("");

    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteLeavecriteria(res?.data?.sleavecriteria);
            handleClickOpen();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let leavesid = deleteLeavecriteria?._id;
    const delLeavecriteria = async (e) => {
        try {
            if (leavesid) {
                await axios.delete(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchLeavecriteria();
                await fetchLeavecriteriaAll();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
                setShowAlert(
                    <>
                        <CheckCircleOutline sx={{ fontSize: "100px", color: "green" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>Deleted Successfully !</p>
                    </>
                );
                handleClickOpenerr();
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delLeavecheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.LEAVECRITERIA_SINGLE}/${item}`, {
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

            await fetchLeavecriteria();
            await fetchLeavecriteriaAll();
            setShowAlert(
                <>
                    <CheckCircleOutline sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Deleted Successfully !</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // const getWeeksInMonth = (month, year) => {
    //     const date = new Date(year, month, 1);
    //     const weeks = [];
    //     while (date.getMonth() === month) {
    //         const week = Math.ceil(date.getDate() / 7);
    //         weeks.push(week === 1 ? `${week}st Week` :
    //             week === 2 ? `${week}nd Week` :
    //                 week === 3 ? `${week}rd Week` :
    //                     week > 3 ? `${week}th Week` : '');
    //         date.setDate(date.getDate() + 7);
    //     }
    //     return weeks;
    // };

    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //add function
    const sendRequest = async () => {
        let comp = selectedOptionsCompany.map((item) => item.value);
        let bran = selectedOptionsBranch.map((item) => item.value);
        let unit = selectedOptionsUnit.map((item) => item.value);
        let team = selectedOptionsTeam.map((item) => item.value);
        let emp = selectedOptionsCate.map((item) => item.value);
        let depart = selectedOptionsDepartment.map((item) => item.value);
        let desig = selectedOptionsDesignation.map((item) => item.value);

        let filt = Array.from(new Set(tookLeave));

        const currentDay = new Date();
        const currentYear = currentDay.getFullYear();
        // const monthIndex = currentDay.getMonth() + 1;

        // const weeks = getWeeksInMonth(monthIndex, parseInt(currentYear ));

        // const newTodoList = [];

        // weeks.forEach(week => {
        //     filt.forEach(day => {
        //         newTodoList.push({
        //             year: currentYear ,
        //             month: monthstring[currentDay.getMonth()],
        //             week: week,
        //             day: day
        //         });
        //     });
        // });

        const newTodoList = [];

        // Helper function to get weeks in a month
        const getWeeksInMonth = (month, year) => {
            const weeks = [];
            let weekNumber = 1;
            let date = new Date(year, month, 1);

            while (date.getMonth() === month) {
                weeks.push(weekNumber === 1 ? `${weekNumber}st Week` :
                    weekNumber === 2 ? `${weekNumber}nd Week` :
                        weekNumber === 3 ? `${weekNumber}rd Week` :
                            weekNumber > 3 ? `${weekNumber}th Week` : '');
                date.setDate(date.getDate() + 7);
                weekNumber++;
            }
            return weeks;
        };

        // Iterate through each month from January to December
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const monthWeeks = getWeeksInMonth(monthIndex, currentYear);
            const monthName = monthstring[monthIndex];

            monthWeeks.forEach(week => {
                filt.forEach(day => {
                    newTodoList.push({
                        year: currentYear,
                        month: monthName,
                        week: week,
                        day: day
                    });
                });
            });
        }

        try {
            let subprojectscreate = await axios.post(SERVICE.LEAVECRITERIA_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employee: emp,
                department: depart,
                designation: desig,
                mode: leavecriteria.mode,
                leavetype: leavecriteria.leavetype == "Please Select Leave Type" ? "" : String(leavecriteria.leavetype),
                numberofdays: String(leavecriteria.numberofdays),
                experience: String(leavecriteria.experience),
                experiencein: String(experiencein),
                leaveautocheck: Boolean(leavecriteria.leaveautocheck),
                leaveautoincrease: String(leavecriteria.leaveautoincrease),
                leaveautodays: String(leaveautodays),
                pendingleave: Boolean(leavecriteria.pendingleave),
                pendingfrommonth: String(pendingfrommonth),
                pendingfromyear: String(pendingfromyear),
                pendingfromdate: String(pendingfromdate),
                leavecalculation: Boolean(leavecriteria.leavecalculation),
                leavefrommonth: String(leavefrommonth),
                leavefromdate: String(leavefromdate),
                leavetomonth: String(leavetomonth),
                leavetodate: String(leavetodate),
                tookleavecheck: Boolean(leavecriteria.tookleavecheck),
                weekstartday: String(leavecriteria.weekstartday),
                tookleave: newTodoList,
                applicablesalary: Boolean(leavecriteria.applicablesalary),
                fullsalary: Boolean(leavecriteria.fullsalary),
                halfsalary: Boolean(leavecriteria.halfsalary),

                leaverespecttoweekoff: Boolean(leavecriteria.leaverespecttoweekoff),
                leaverespecttotraining: Boolean(leavecriteria.leaverespecttotraining),
                uninformedleave: Boolean(leavecriteria.uninformedleave),
                uninformedleavecount: String(leavecriteria.uninformedleavecount),
                leavefornoticeperiod: Boolean(leavecriteria.leavefornoticeperiod),
                leavefornoticeperiodcount: String(leavecriteria.leavefornoticeperiodcount),

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchLeavecriteria();
            await fetchLeavecriteriaAll();


            setBtnSubmit(false);
            setShowAlert(
                <>
                    <CheckCircleOutline sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Added Successfully!</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {setBtnSubmit(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        setBtnSubmit(true);
        e.preventDefault();
        await fetchLeavecriteriaAll();
        if (leavecriteria.mode == "Employee") {
            let emps = selectedOptionsCate.map((item) => item.value);
            let isNameMatch = leavecriteriasAll.some((data) => data.employee.some((item) => emps.includes(item)) && data.leavetype == leavecriteria.leavetype);
            if (selectedOptionsCompany.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsBranch.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsUnit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsTeam.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsCate.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (leavecriteria.leavetype == "Please Select Leave Type" || leavecriteria.leavetype === "" || leavecriteria.leavetype === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type!"}</p>
                    </>
                );
                handleClickOpenerr();
            } else if (leavecriteria.numberofdays == "" || leavecriteria.numberofdays === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Number of Days!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (isNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Exist!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest()
            }
        } else if (leavecriteria.mode == "Department") {
            let deps = selectedOptionsDepartment.map((item) => item.value);
            let isNameMatch = leavecriteriasAll.some((data) => data.department.some((item) => deps.includes(item)) && data.leavetype == leavecriteria.leavetype);
            if (selectedOptionsDepartment.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (leavecriteria.leavetype == "Please Select Leave Type" || leavecriteria.leavetype === "" || leavecriteria.leavetype === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type!"}</p>
                    </>
                );
                handleClickOpenerr();
            } else if (leavecriteria.numberofdays == "" || leavecriteria.numberofdays === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Number of Days!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (isNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Exist!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest()
            }
        } else if (leavecriteria.mode == "Designation") {
            let desigs = selectedOptionsDesignation.map((item) => item.value);
            let isNameMatch = leavecriteriasAll.some((data) => data.designation.some((item) => desigs.includes(item)) && data.leavetype == leavecriteria.leavetype);
            if (selectedOptionsDesignation.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Designation!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (leavecriteria.leavetype == "Please Select Leave Type" || leavecriteria.leavetype === "" || leavecriteria.leavetype === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type!"}</p>
                    </>
                );
                handleClickOpenerr();
            } else if (leavecriteria.numberofdays == "" || leavecriteria.numberofdays === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Number of Days!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (isNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Exist!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest()
            }
        }

        else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode!"}</p>
                </>
            );
            handleClickOpenerr();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setLeavecriteria({
            ...leavecriteria,
            leavetype: "Please Select Leave Type", numberofdays: "0", experience: "", experiencein: "",
            leaveautocheck: "", leaveautoincrease: "", leaveautoincreasedays: "", leaveautodays: "Choose Mode",
            pendingleave: "", pendingfrommonth: "Choose Month", pendingfromdate: "Choose Day",
            leavecalculation: "", leavefrommonth: "Choose Month", leavefromdate: "Choose Day", leavetomonth: "Choose Month", leavetodate: "Choose Day",
            tookleavecheck: false,
            tookleave: "", applicablesalary: "", fullsalary: "", halfsalary: "", mode: "Department",
            leaverespecttoweekoff: false,
            leaverespecttotraining: false,



            uninformedleave: false,
            uninformedleavecount: "",


            leavefornoticeperiod: false,
            leavefornoticeperiodcount: "",
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,

        });
        setTookLeave([]);
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedOptionsCate([])
        setSelectedOptionsDepartment([])
        setSelectedOptionsDesignation([])
        setBranchOption([])
        setUnitOption([])
        setTeamOption([])
        setParticipantsOption([])
        setExperiencein("Month");
        setLeaveautodays("Month");
        setPendingfrommonth("Choose Month");
        setPendingfromyear("Choose Year");
        setPendingfromdate("Choose Day");
        setLeavefrommonth("Choose Month");
        setLeavefromdate("Choose Day");
        setLeavetomonth("Choose Month");
        setLeavetodate("Choose Day");
        setShowAlert(
            <>
                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>Cleared Successfully!</p>
            </>
        );
        handleClickOpenerr();
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //get single row to edit....
    const getCode = async (e, name) => {
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriaEdit({
                ...res?.data?.sleavecriteria,
                sunday: res?.data?.sleavecriteria?.tookleave.includes("Sunday") ? true : false,
                monday: res?.data?.sleavecriteria?.tookleave.includes("Monday") ? true : false,
                tuesday: res?.data?.sleavecriteria?.tookleave.includes("Tuesday") ? true : false,
                wednesday: res?.data?.sleavecriteria?.tookleave.includes("Wednesday") ? true : false,
                thursday: res?.data?.sleavecriteria?.tookleave.includes("Thursday") ? true : false,
                friday: res?.data?.sleavecriteria?.tookleave.includes("Friday") ? true : false,
                saturday: res?.data?.sleavecriteria?.tookleave.includes("Saturday") ? true : false,

            });

            setTookLeaveEdit([...res?.data?.sleavecriteria?.tookleave]);



            setSelectedOptionsCompanyEdit(res?.data?.sleavecriteria?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sleavecriteria?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sleavecriteria?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sleavecriteria?.team.map((item) => ({ label: item, value: item })));
            setSelectedOptionsCateEdit(res?.data?.sleavecriteria?.employee.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDepartmentEdit(res?.data?.sleavecriteria?.department.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDesignationEdit(res?.data?.sleavecriteria?.designation.map((item) => ({ label: item, value: item })));

            setValueCompanyCatEdit(res?.data?.sleavecriteria?.company)
            setValueBranchCatEdit(res?.data?.sleavecriteria?.branch)
            setValueUnitCatEdit(res?.data?.sleavecriteria?.unit)
            setValueTeamCatEdit(res?.data?.sleavecriteria?.team)

            setExperienceinEdit(res?.data?.sleavecriteria.experiencein);
            setLeaveautodaysEdit(res?.data?.sleavecriteria.leaveautodays);
            setPendingfrommonthEdit(res?.data?.sleavecriteria.pendingfrommonth);
            setPendingfromyearEdit(res?.data?.sleavecriteria.pendingfromyear);
            setLeavefrommonthEdit(res?.data?.sleavecriteria.leavefrommonth);
            setLeavetomonthEdit(res?.data?.sleavecriteria.leavetomonth);
            setLeavefromdateEdit(res?.data?.sleavecriteria.leavefromdate);
            setLeavetodateEdit(res?.data?.sleavecriteria.leavetodate);
            setPendingfromdateEdit(res?.data?.sleavecriteria.pendingfromdate);
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            setLeavecriteriasAllEdit(res_vendor?.data?.leavecriterias.filter((data) => data._id != res?.data?.sleavecriteria._id));
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriaEdit({
                ...res?.data?.sleavecriteria,
                sunday: res?.data?.sleavecriteria?.tookleave.includes("Sunday") ? true : false,
                monday: res?.data?.sleavecriteria?.tookleave.includes("Monday") ? true : false,
                tuesday: res?.data?.sleavecriteria?.tookleave.includes("Tuesday") ? true : false,
                wednesday: res?.data?.sleavecriteria?.tookleave.includes("Wednesday") ? true : false,
                thursday: res?.data?.sleavecriteria?.tookleave.includes("Thursday") ? true : false,
                friday: res?.data?.sleavecriteria?.tookleave.includes("Friday") ? true : false,
                saturday: res?.data?.sleavecriteria?.tookleave.includes("Saturday") ? true : false,

            });

            setSelectedOptionsCompanyEdit(res?.data?.sleavecriteria?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sleavecriteria?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sleavecriteria?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sleavecriteria?.team.map((item) => ({ label: item, value: item })));
            setSelectedOptionsCateEdit(res?.data?.sleavecriteria?.employee.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDepartmentEdit(res?.data?.sleavecriteria?.department.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDesignationEdit(res?.data?.sleavecriteria?.designation.map((item) => ({ label: item, value: item })));

            setValueCompanyCatEdit(res?.data?.sleavecriteria?.company)
            setValueBranchCatEdit(res?.data?.sleavecriteria?.branch)
            setValueUnitCatEdit(res?.data?.sleavecriteria?.unit)
            setValueTeamCatEdit(res?.data?.sleavecriteria?.team)

            setExperienceinEdit(res?.data?.sleavecriteria.experiencein);
            setLeaveautodaysEdit(res?.data?.sleavecriteria.leaveautodays);
            setPendingfrommonthEdit(res?.data?.sleavecriteria.pendingfrommonth);
            setPendingfromyearEdit(res?.data?.sleavecriteria.pendingfromyear);
            setLeavefrommonthEdit(res?.data?.sleavecriteria.leavefrommonth);
            setLeavetomonthEdit(res?.data?.sleavecriteria.leavetomonth);
            setLeavefromdateEdit(res?.data?.sleavecriteria.leavefromdate);
            setLeavetodateEdit(res?.data?.sleavecriteria.leavetodate);
            setPendingfromdateEdit(res?.data?.sleavecriteria.pendingfromdate);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriaEdit(res?.data?.sleavecriteria);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Project updateby edit page...
    let updateby = leavecriteriaEdit?.updatedby;
    let addedby = leavecriteriaEdit?.addedby;

    let subprojectsid = leavecriteriaEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let filtEdit = Array.from(new Set(tookLeaveEdit));

        let comp = selectedOptionsCompanyEdit.map((item) => item.value);
        let bran = selectedOptionsBranchEdit.map((item) => item.value);
        let unit = selectedOptionsUnitEdit.map((item) => item.value);
        let team = selectedOptionsTeamEdit.map((item) => item.value);
        let emp = selectedOptionsCateEdit.map((item) => item.value);
        let depart = selectedOptionsDepartmentEdit.map((item) => item.value);
        let desig = selectedOptionsDesignationEdit.map((item) => item.value);
        try {
            let res = await axios.put(`${SERVICE.LEAVECRITERIA_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
                unit: unit,
                team: team,
                employee: emp,
                department: depart,
                designation: desig,
                mode: leavecriteriaEdit.mode,

                leavetype: leavecriteriaEdit.leavetype == "Please Select Leave Type" ? "" : String(leavecriteriaEdit.leavetype),
                numberofdays: String(leavecriteriaEdit.numberofdays),
                experience: String(leavecriteriaEdit.experience),
                experiencein: String(experienceinEdit) === "Choose Mode" ? "" : experienceinEdit,
                leaveautocheck: Boolean(leavecriteriaEdit.leaveautocheck),
                leaveautoincrease: String(leavecriteriaEdit.leaveautoincrease),
                leaveautodays: String(leaveautodaysEdit) === "Choose Mode" ? "" : leaveautodaysEdit,
                pendingleave: Boolean(leavecriteriaEdit.pendingleave),
                pendingfrommonth: String(pendingfrommonthEdit) === "Choose Month" ? "" : pendingfrommonthEdit,
                pendingfromyear: String(pendingfromyearEdit) === "Choose Year" ? "" : pendingfromyearEdit,
                pendingfromdate: String(pendingfromdateEdit) === "Choose Day" ? "" : pendingfromdateEdit,
                leavecalculation: Boolean(leavecriteriaEdit.leavecalculation),
                leavefrommonth: String(leavefrommonthEdit) === "Choose Month" ? "" : leavefrommonthEdit,
                leavefromdate: String(leavefromdateEdit) === "Choose Day" ? "" : leavefromdateEdit,
                leavetomonth: String(leavetomonthEdit) === "Choose Month" ? "" : leavetomonthEdit,
                leavetodate: String(leavetodateEdit) === "Choose Day" ? "" : leavetodateEdit,
                tookleavecheck: Boolean(leavecriteriaEdit.tookleavecheck),
                weekstartday: String(leavecriteriaEdit.weekstartday),
                tookleave: filtEdit,
                applicablesalary: Boolean(leavecriteriaEdit.applicablesalary),
                fullsalary: Boolean(leavecriteriaEdit.fullsalary),
                halfsalary: Boolean(leavecriteriaEdit.halfsalary),


                leaverespecttoweekoff: Boolean(leavecriteriaEdit.leaverespecttoweekoff),
                leaverespecttotraining: Boolean(leavecriteriaEdit.leaverespecttotraining),
                uninformedleave: Boolean(leavecriteriaEdit.uninformedleave),
                uninformedleavecount: String(leavecriteriaEdit.uninformedleavecount),
                leavefornoticeperiod: Boolean(leavecriteriaEdit.leavefornoticeperiod),
                leavefornoticeperiodcount: String(leavecriteriaEdit.leavefornoticeperiodcount),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchLeavecriteria();
            await fetchLeavecriteriaAll();
            handleCloseModEdit();
            setTookLeaveEdit([]);
            setBtnSubmitEdit(false);
            setShowAlert(
                <>
                    <CheckCircleOutline sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Updated Successfully!</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {setBtnSubmitEdit(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editSubmit = async (e) => {
        setBtnSubmitEdit(true);
        e.preventDefault();
        await fetchLeavecriteriaAll();
        if (leavecriteriaEdit.mode == "Employee") {
            let emps = selectedOptionsCateEdit.map((item) => item.value);
            let isNameMatch = leavecriteriasAllEdit.some((data) => data.employee.some((item) => emps.includes(item)) && data.leavetype == leavecriteriaEdit.leavetype);
            if (selectedOptionsCompanyEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsBranchEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsUnitEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsTeamEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedOptionsCateEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (leavecriteriaEdit.leavetype == "Please Select Leave Type" || leavecriteriaEdit.leavetype === "" || leavecriteriaEdit.leavetype === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type!"}</p>
                    </>
                );
                handleClickOpenerr();
            } else if (leavecriteriaEdit.numberofdays == "" || leavecriteriaEdit.numberofdays === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Number of Days!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (isNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Exist!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendEditRequest()
            }
        } else if (leavecriteriaEdit.mode == "Department") {
            let deps = selectedOptionsDepartmentEdit.map((item) => item.value);
            let isNameMatch = leavecriteriasAllEdit.some((data) => data.department.some((item) => deps.includes(item)) && data.leavetype == leavecriteriaEdit.leavetype);
            if (selectedOptionsDepartmentEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (leavecriteriaEdit.leavetype == "Please Select Leave Type" || leavecriteriaEdit.leavetype === "" || leavecriteriaEdit.leavetype === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type!"}</p>
                    </>
                );
                handleClickOpenerr();
            } else if (leavecriteriaEdit.numberofdays == "" || leavecriteriaEdit.numberofdays === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Number of Days!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (isNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Exist!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendEditRequest()
            }
        } else if (leavecriteriaEdit.mode == "Designation") {
            let desigs = selectedOptionsDesignationEdit.map((item) => item.value);
            let isNameMatch = leavecriteriasAllEdit.some((data) => data.designation.some((item) => desigs.includes(item)) && data.leavetype == leavecriteriaEdit.leavetype);
            if (selectedOptionsDesignationEdit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Designation!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (leavecriteriaEdit.leavetype == "Please Select Leave Type" || leavecriteriaEdit.leavetype === "" || leavecriteriaEdit.leavetype === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type!"}</p>
                    </>
                );
                handleClickOpenerr();
            } else if (leavecriteriaEdit.numberofdays == "" || leavecriteriaEdit.numberofdays === undefined) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Number of Days!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (isNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Exist!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendEditRequest()
            }
        }

        else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode!"}</p>
                </>
            );
            handleClickOpenerr();
        }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteria = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriacheck(true);
            setLeavecriterias(res_vendor?.data?.leavecriterias);
        } catch (err) {setLeavecriteriacheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all Sub vendormasters.
    const fetchLeavecriteriaAll = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setLeavecriteriasAll(res_vendor?.data?.leavecriterias);
            setLeavecriteriasAllEdit(res_vendor?.data?.leavecriterias.filter((data) => data._id != leavecriteriaEdit._id));
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Excel
    const fileName = "Leave Control Criteria";

    const [fileFormat, setFormat] = useState('')
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
                    "SNo": index + 1,
                    "Department": Array.isArray(t.department) ? t.department.join(',') : "",
                    "Designation": Array.isArray(t.designation) ? t.designation.join(',') : "",
                    "Company": Array.isArray(t.company) ? t.company.join(',') : "",
                    "Branch": Array.isArray(t.branch) ? t.branch.join(',') : "",
                    "Unit": Array.isArray(t.unit) ? t.unit.join(',') : "",
                    "Team": Array.isArray(t.team) ? t.team.join(',') : "",
                    "Employee": Array.isArray(t.employee) ? t.employee.join(',') : "",
                    "Leavetype": t.leavetype,
                    "Number of Days": t.numberofdays,
                    "Experience": t.experience,
                    "Experience In": t.experiencein,
                    "Leave Auto Increase": t.leaveautocheck ? "YES" : "NO",
                    "Increase": t.leaveautoincrease,
                    "Days Per": t.leaveautodays,
                    "Pending Leave Carry": t.pendingleave ? "YES" : "NO",
                    // "Pending Frommonth": t.pendingfrommonth,
                    // "Pending Fromdate": t.pendingfromdate,
                    // "Leave Calculation Period": t.leavecalculation ? "YES" : "NO",
                    // "Leave Frommonth": t.leavefrommonth,
                    // "Leave Fromdate": t.leavefromdate,
                    // "Leave Tomonth": t.leavetomonth,
                    // "Leave Todate": t.leavetodate,
                    "Took Leave": t.tookleavecheck ? "YES" : "NO",
                    // "Took Leave Day": t.tookleave.map(d => d.day).join(','),
                    // "Applicable For Salary": t.applicablesalary ? "YES" : "NO",
                    // "Full Salary": t.fullsalary ? "YES" : "NO",
                    // "Half Salary": t.halfsalary ? "YES" : "NO",
                    'Leave Respect To Weekoff': t.leaverespecttoweekoff ? "YES" : "NO",
                    "Leave Respect To Training": t.leaverespecttotraining ? "YES" : "NO",
                    "Uninformed Leave": t.uninformedleave ? "YES" : "NO",
                    "Uninformed Leave Count": t.uninformedleavecount,
                    "Leave For Notice Period": t.leavefornoticeperiod ? "YES" : "NO",
                    "Leave For Notice Period Count": t.leavefornoticeperiodcount,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                leavecriterias.map((t, index) => ({
                    "SNo": index + 1,
                    "Department": Array.isArray(t.department) ? t.department.join(',') : "",
                    "Designation": Array.isArray(t.designation) ? t.designation.join(',') : "",
                    "Company": Array.isArray(t.company) ? t.company.join(',') : "",
                    "Branch": Array.isArray(t.branch) ? t.branch.join(',') : "",
                    "Unit": Array.isArray(t.unit) ? t.unit.join(',') : "",
                    "Team": Array.isArray(t.team) ? t.team.join(',') : "",
                    "Employee": Array.isArray(t.employee) ? t.employee.join(',') : "",
                    "Leavetype": t.leavetype,
                    "Number of Days": t.numberofdays,
                    "Experience": t.experience,
                    "Experience In": t.experiencein,
                    "Leave Auto Increase": t.leaveautocheck ? "YES" : "NO",
                    "Increase": t.leaveautoincrease,
                    "Days Per": t.leaveautodays,
                    "Pending Leave Carry": t.pendingleave ? "YES" : "NO",
                    "Took Leave": t.tookleavecheck ? "YES" : "NO",
                    'Leave Respect To Weekoff': t.leaverespecttoweekoff ? "YES" : "NO",
                    "Leave Respect To Training": t.leaverespecttotraining ? "YES" : "NO",
                    "Uninformed Leave": t.uninformedleave ? "YES" : "NO",
                    "Uninformed Leave Count": t.uninformedleavecount,
                    "Leave For Notice Period": t.leavefornoticeperiod ? "YES" : "NO",
                    "Leave For Notice Period Count": t.leavefornoticeperiodcount,
                })),
                fileName,
            );
        }
        setIsFilterOpen(false)
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Leave Control Criteria",
        pageStyle: "print",
    });

    // pdf.....
    // const columns = [
    //     { title: "SNo", field: "serialNumber" },
    //     { title: "Department", field: "department" },
    //     { title: "Designation", field: "designation" },
    //     { title: "Company", field: "company" },
    //     { title: "Branch", field: "branch" },
    //     { title: "Unit", field: "unit" },
    //     { title: "Team", field: "team" },
    //     { title: "Employee", field: "employee" },
    //     { title: "Leavetype", field: "leavetype" },
    //     { title: "Number of Days", field: "numberofdays" },
    //     { title: "Experience", field: "experience" },
    //     { title: "Experience In", field: "experiencein" },
    //     { title: "Leave Auto Increase", field: "leaveautocheck" },
    //     { title: "Increase", field: "leaveautoincrease" },
    //     { title: "Days Per", field: "leaveautodays" },
    //     { title: "Pending Leave Carry", field: "pendingleave" },
    //     // { title: "Pending From Month", field: "pendingfrommonth" },
    //     // { title: "Pending From Year", field: "pendingfromdate" },
    //     // { title: "Leave Calculation Period", field: "leavecalculation" },
    //     // { title: "Leave Frommonth", field: "leavefrommonth" },
    //     // { title: "Leave Fromdate", field: "leavefromdate" },
    //     // { title: "Leave Tomonth", field: "leavetomonth" },
    //     // { title: "Leave Todate", field: "leavetodate" },
    //     { title: "Took Leave", field: "tookleavecheck" },
    //     // { title: "Took Leave Day", field: "tookleave" },
    //     // { title: "Applicable For Salary", field: "applicablesalary" },
    //     // { title: "Full Salary", field: "fullsalary" },
    //     // { title: "Half Salary", field: "halfsalary" },
    //     { title: "Leaves Respect to Weekoff", field: "leaverespecttoweekoff" },
    //     { title: "Leaves Respect to Training", field: "leaverespecttotraining" },
    //     { title: "Uninformed Leave", field: "uninformedleave" },
    //     { title: "Uninformed Leave Count", field: "uninformedleavecount" },
    //     { title: "Leave For Notice Period", field: "leavefornoticeperiod" },
    //     { title: "Leave For Notice Period Count", field: "leavefornoticeperiodcount" },
    // ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF({ orientation: "landscape" });
        const headers = [
            "SNo", "Department", "Designation", "Company", "Branch",
            "Unit", "Team", "Employee", "Leavetype", "Number of Days", "Experience", "Experience In", "Leave Auto Increase",
            "Increase", "Days Per", "Pending Leave Carry",
            "Took Leave", "Leaves Respect to Weekoff",
            "Leaves Respect to Training", "Uninformed Leave",
            "Uninformed Leave Count",
            "Leave For Notice Period",
            "Leave For Notice Period Count",
        ];

        let data = [];
        // Add a serial number to each row
        if (isfilter === "filtered") {
            data = rowDataTable.map((item, index) => {
                return [
                    index + 1,
                    item.department.join(", "),
                    item.designation.join(", "),
                    item.company.join(", "),
                    item.branch.join(", "),
                    item.unit.join(", "),
                    item.team.join(", "),
                    item.employee.join(", "),
                    item.leavetype,
                    item.numberofdays,
                    item.experience,
                    item.experiencein,
                    item.leaveautocheck ? "YES" : "NO",
                    item.leaveautoincrease,
                    item.leaveautodays,
                    item.pendingleave ? "YES" : "NO",
                    item.tookleavecheck ? "YES" : "NO",
                    item.leaverespecttoweekoff ? "YES" : "NO",
                    item.leaverespecttotraining ? "YES" : "NO",
                    item.uninformedleave ? "YES" : "NO",
                    item.uninformedleavecount,
                    item.leavefornoticeperiod ? "YES" : "NO",
                    item.leavefornoticeperiodcount,
                ]
            })
        }
        else {
            data = leavecriterias.map((item, index) => {
                return [
                    index + 1,
                    item.department.join(", "),
                    item.designation.join(", "),
                    item.company.join(", "),
                    item.branch.join(", "),
                    item.unit.join(", "),
                    item.team.join(", "),
                    item.employee.join(", "),
                    item.leavetype,
                    item.numberofdays,
                    item.experience,
                    item.experiencein,
                    item.leaveautocheck ? "YES" : "NO",
                    item.leaveautoincrease,
                    item.leaveautodays,
                    item.pendingleave ? "YES" : "NO",
                    item.tookleavecheck ? "YES" : "NO",
                    item.leaverespecttoweekoff ? "YES" : "NO",
                    item.leaverespecttotraining ? "YES" : "NO",
                    item.uninformedleave ? "YES" : "NO",
                    item.uninformedleavecount,
                    item.leavefornoticeperiod ? "YES" : "NO",
                    item.leavefornoticeperiodcount,
                ]
            })
        }

        // Define column styles to adjust width
        const columnStyles = {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20 },
            4: { cellWidth: 30 },
            5: { cellWidth: 30 },
            6: { cellWidth: 35 },
            7: { cellWidth: 35 },
            8: { cellWidth: 20 },
            9: { cellWidth: 10 },
            10: { cellWidth: 20 },
            11: { cellWidth: 20 },
            12: { cellWidth: 20 },
            13: { cellWidth: 20 },
            14: { cellWidth: 20 },
            15: { cellWidth: 20 },
            16: { cellWidth: 20 },
            17: { cellWidth: 20 },
            18: { cellWidth: 20 },
            19: { cellWidth: 20 },
            20: { cellWidth: 20 },
            21: { cellWidth: 20 },
            22: { cellWidth: 20 },
        };

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
                columnStyles: columnStyles,
            });
        });

        doc.save("Leave Control Criteria.pdf");
    };

    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        // getexcelDatas();
    }, [leavecriteriaEdit, leavecriteria, leavecriterias]);

    useEffect(() => {
        fetchLeavecriteria();
        fetchLeavecriteriaAll();
        fetchCompanyAll();
        fetchBranchAll();
        fetchUnitAll();
        fetchTeamAll();
        fetchParticipants();
        fetchDepartmentAll();
        fetchDesignationAll();
        fetchLeaveTypesAll();
    }, [selectedOptionsCompany]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = leavecriterias?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [leavecriterias]);

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
            width: 90,

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
        { field: "department", headerName: "Department", flex: 0, width: 90, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "designation", headerName: "Designation", flex: 0, width: 90, hide: !columnVisibility.designation, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 90, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 90, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 90, hide: !columnVisibility.employee, headerClassName: "bold-header" },


        { field: "leavetype", headerName: "Leavetype", flex: 0, width: 90, hide: !columnVisibility.leavetype, headerClassName: "bold-header" },
        { field: "numberofdays", headerName: "Number of Days", flex: 0, width: 90, hide: !columnVisibility.numberofdays, headerClassName: "bold-header" },
        { field: "experience", headerName: "Experience", flex: 0, width: 90, hide: !columnVisibility.experience, headerClassName: "bold-header" },
        { field: "experiencein", headerName: "Experience In", flex: 0, width: 90, hide: !columnVisibility.experiencein, headerClassName: "bold-header" },
        { field: "leaveautocheck", headerName: "Leave Auto Increase", flex: 0, width: 90, hide: !columnVisibility.leaveautocheck, headerClassName: "bold-header" },
        { field: "leaveautoincrease", headerName: "Increase", flex: 0, width: 90, hide: !columnVisibility.leaveautoincrease, headerClassName: "bold-header" },
        { field: "leaveautodays", headerName: "Days Per", flex: 0, width: 90, hide: !columnVisibility.leaveautodays, headerClassName: "bold-header" },
        { field: "pendingleave", headerName: "Pending Leave Carry", flex: 0, width: 90, hide: !columnVisibility.pendingleave, headerClassName: "bold-header" },
        // { field: "pendingfrommonth", headerName: "Pending Frommonth", flex: 0, width: 90, hide: !columnVisibility.pendingfrommonth, headerClassName: "bold-header" },
        // { field: "pendingfromdate", headerName: "Pending Fromdate", flex: 0, width: 90, hide: !columnVisibility.pendingfromdate, headerClassName: "bold-header" },
        // { field: "leavecalculation", headerName: "Leave Calculation Period", flex: 0, width: 90, hide: !columnVisibility.leavecalculation, headerClassName: "bold-header" },
        // { field: "leavefrommonth", headerName: "Leave Frommonth", flex: 0, width: 90, hide: !columnVisibility.leavefrommonth, headerClassName: "bold-header" },
        // { field: "leavefromdate", headerName: "Leave Fromdate", flex: 0, width: 90, hide: !columnVisibility.leavefromdate, headerClassName: "bold-header" },
        // { field: "leavetomonth", headerName: "Leave Tomonth", flex: 0, width: 90, hide: !columnVisibility.leavetomonth, headerClassName: "bold-header" },
        // { field: "leavetodate", headerName: "Leave Todate", flex: 0, width: 90, hide: !columnVisibility.leavetodate, headerClassName: "bold-header" },
        { field: "tookleavecheck", headerName: "Took Leave", flex: 0, width: 90, hide: !columnVisibility.tookleavecheck, headerClassName: "bold-header" },
        // { field: "tookleave", headerName: "Took Leave Day", flex: 0, width: 90, hide: !columnVisibility.tookleave, headerClassName: "bold-header" },
        // { field: "applicablesalary", headerName: "Applicable For Salary", flex: 0, width: 90, hide: !columnVisibility.applicablesalary, headerClassName: "bold-header" },
        { field: "fullsalary", headerName: "Full Salary", flex: 0, width: 90, hide: !columnVisibility.fullsalary, headerClassName: "bold-header" },
        { field: "halfsalary", headerName: "Half Salary", flex: 0, width: 90, hide: !columnVisibility.halfsalary, headerClassName: "bold-header" },

        { field: "leaverespecttoweekoff", headerName: "Leave Respect to Weekoff", flex: 0, width: 90, hide: !columnVisibility.leaverespecttoweekoff, headerClassName: "bold-header" },
        { field: "leaverespecttotraining", headerName: "Leave Respect to Training", flex: 0, width: 90, hide: !columnVisibility.leaverespecttotraining, headerClassName: "bold-header" },
        { field: "uninformedleave", headerName: "Uninformed Leave", flex: 0, width: 90, hide: !columnVisibility.uninformedleave, headerClassName: "bold-header" },
        { field: "uninformedleavecount", headerName: "Uninformed Leave Count", flex: 0, width: 90, hide: !columnVisibility.uninformedleavecount, headerClassName: "bold-header" },
        { field: "leavefornoticeperiod", headerName: "Leave for Notice Period", flex: 0, width: 90, hide: !columnVisibility.leavefornoticeperiod, headerClassName: "bold-header" },
        { field: "leavefornoticeperiodcount", headerName: "Notice period Leave count", flex: 0, width: 90, hide: !columnVisibility.leavefornoticeperiodcount, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("eleavecriteria") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenEdit();
                                getCode(params.row.id, params.row.name);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dleavecriteria") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vleavecriteria") && (
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
                    {isUserRoleCompare?.includes("ileavecriteria") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employee: item.employee,
            department: item.department,
            designation: item.designation,

            leavetype: item.leavetype,
            numberofdays: item.numberofdays,
            experience: item.experience,
            experiencein: item.experiencein === "Choose Mode" ? "" : item.experiencein,
            leaveautocheck: item.leaveautocheck ? "YES" : "NO",
            leaveautoincrease: item.leaveautoincrease,
            leaveautodays: item.leaveautodays === "Choose Mode" ? "" : item.leaveautodays,
            pendingleave: item.pendingleave ? "YES" : "NO",
            pendingfrommonth: item.pendingfrommonth === "Choose Month" ? "" : item.pendingfrommonth,
            pendingfromdate: item.pendingfromdate === "Choose Day" ? "" : item.pendingfromdate,
            leavecalculation: item.leavecalculation ? "YES" : "NO",
            leavefrommonth: item.leavefrommonth === "Choose Month" ? "" : item.leavefrommonth,
            leavefromdate: item.leavefromdate === "Choose Day" ? "" : item.leavefromdate,
            leavetomonth: item.leavetomonth === "Choose Month" ? "" : item.leavetomonth,
            leavetodate: item.leavetodate === "Choose Day" ? "" : item.leavetodate,
            tookleavecheck: item.tookleavecheck ? "YES" : "NO",
            // tookleave: item.tookleave.map(d => d?.day).join(','),
            applicablesalary: item.applicablesalary ? "YES" : "NO",
            fullsalary: item.fullsalary ? "YES" : "NO",
            halfsalary: item.halfsalary ? "YES" : "NO",

            leaverespecttoweekoff: item.leaverespecttoweekoff ? "YES" : "NO",
            leaverespecttotraining: item.leaverespecttotraining ? "YES" : "NO",
            uninformedleave: item.uninformedleave ? "YES" : "NO",
            uninformedleavecount: item.uninformedleavecount,
            leavefornoticeperiod: item.leavefornoticeperiod ? "YES" : "NO",
            leavefornoticeperiodcount: item.leavefornoticeperiodcount,

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
            <Headtitle title={"Leave Control Criteria"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Leave Control Criteria</Typography>
            {isUserRoleCompare?.includes("aleavecriteria") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        <b>Leave Control Criteria</b>
                                    </Typography>
                                </Grid>

                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={modes}
                                            value={{ label: leavecriteria.mode, value: leavecriteria.mode }}
                                            onChange={(e) => {
                                                setLeavecriteria((prev) => ({
                                                    ...prev, mode: e.value,
                                                }))

                                                setSelectedOptionsCompany([])
                                                setSelectedOptionsBranch([])
                                                setSelectedOptionsUnit([])
                                                setSelectedOptionsTeam([])
                                                setSelectedOptionsCate([])
                                                setSelectedOptionsDepartment([])
                                                setSelectedOptionsDesignation([])
                                                setBranchOption([])
                                                setUnitOption([])
                                                setTeamOption([])
                                                setParticipantsOption([])

                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                {leavecriteria.mode == "Employee" ?
                                    <>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company <b style={{ color: "red" }}>*</b>
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={participantsOption
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
                                                    value={selectedOptionsCate}
                                                    onChange={handleCategoryChange}
                                                    valueRenderer={customValueRendererCate}
                                                    labelledBy="Please Select Participants"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </> :
                                    <>
                                        {leavecriteria.mode == "Department" ? <>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOption}
                                                        value={selectedOptionsDepartment}
                                                        onChange={(e) => {
                                                            handleDepartmentChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </> : <>
                                            {leavecriteria.mode == "Designation" ?
                                                <>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Designation<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={designationOption}
                                                                value={selectedOptionsDesignation}
                                                                onChange={(e) => {
                                                                    handleDesignationChange(e);
                                                                }}
                                                                valueRenderer={customValueRendererDesignation}
                                                                labelledBy="Please Select Department"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </> : <>
                                                </>}
                                        </>}
                                    </>}

                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        <b>Manage Leave Control Criteria</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={1.5} xs={12} sm={12}>
                                    <Typography>Leave Type <b style={{ color: 'red' }}>*</b> </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={leaveTypeOption}
                                            value={{ label: leavecriteria.leavetype, value: leavecriteria.leavetype }}
                                            onChange={(e) => {
                                                setLeavecriteria({ ...leavecriteria, leavetype: e.value });


                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={7.5}></Grid>
                            </Grid>
                            <br /> <br />

                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography>
                                        <b>Applicable From </b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={1} xs={12} sm={12}>
                                    <Typography>Experience </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={leavecriteria.experience}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;

                                                if (/^\d{0,2}$/.test(inputValue)) {
                                                    setLeavecriteria({ ...leavecriteria, experience: e.target.value });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={1} xs={12} sm={12} marginTop={1}>
                                    <Typography>Mode </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={appfromModes}
                                            value={{ label: experiencein, value: experiencein }}
                                            onChange={(e) => {
                                                setExperiencein(e.value);
                                            }}
                                        />


                                    </FormControl>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12}>
                                    <Typography>Number of Days <b style={{ color: 'red' }}>*</b> </Typography>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={leavecriteria.numberofdays}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;

                                                if (/^\d{0,2}$/.test(inputValue)) {
                                                    setLeavecriteria({ ...leavecriteria, numberofdays: inputValue });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />

                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography>
                                        <b>Leave Auto Increase </b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.leaveautocheck}
                                        value={leavecriteria.leaveautocheck}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, leaveautocheck: !leavecriteria.leaveautocheck, leaveautoincrease: "" });
                                            setLeaveautodays("Month");
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    {leavecriteria.leaveautocheck ? <span>Yes</span> : <span>No</span>}
                                </Grid>

                                <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>Increase </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            disabled={!leavecriteria.leaveautocheck}
                                            value={leavecriteria.leaveautoincrease}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;

                                                if (/^\d{0,2}$/.test(inputValue)) {
                                                    setLeavecriteria({ ...leavecriteria, leaveautoincrease: e.target.value });
                                                }
                                                if (e.target.value > 3) {
                                                    setShowAlert(
                                                        <>
                                                            <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Value less than 3"}</p>
                                                        </>
                                                    );
                                                    handleClickOpenerr();
                                                }

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>Mode</Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">

                                        <Selects
                                            options={appfromModes}
                                            value={{ label: leaveautodays, value: leaveautodays }}
                                            isDisabled={!leavecriteria.leaveautocheck}
                                            onChange={(e) => {
                                                setLeaveautodays(e.value);
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> < br />

                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography>
                                        <b>Pending Leave Carry Over Next Year </b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.pendingleave}
                                        value={leavecriteria.pendingleave}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, pendingleave: !leavecriteria.pendingleave });
                                            setPendingfrommonth("Choose Month");
                                            setPendingfromyear("Choose Year");
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    {leavecriteria.pendingleave ? <span>Yes</span> : <span>No</span>}
                                </Grid>
                                {leavecriteria.pendingleave === true ? (
                                    <>
                                        <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                            <Typography>From Month </Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                            <FormControl fullWidth size="small">
                                                {/* <Selects
                                            options={appfromModes}
                                            value={{ label: pendingfrommonth, value: pendingfrommonth }}
                                            isDisabled={!leavecriteria.pendingleave}
                                            onChange={(e) => {
                                                setPendingfrommonth(e.value);
                                            }}
                                        /> */}
                                                <Select
                                                    fullWidth
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 200,
                                                                width: 80,
                                                            },
                                                        },
                                                    }}
                                                    value={pendingfrommonth}
                                                    onChange={(e) => {
                                                        setPendingfrommonth(e.target.value);
                                                    }}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                >
                                                    <MenuItem value="Choose Month" disabled>
                                                        {" "}
                                                        {"Choose Month"}{" "}
                                                    </MenuItem>
                                                    <MenuItem value="January"> {"January"} </MenuItem>
                                                    <MenuItem value="February"> {"February"} </MenuItem>
                                                    <MenuItem value="March"> {"March"} </MenuItem>
                                                    <MenuItem value="April"> {"April"} </MenuItem>
                                                    <MenuItem value="May"> {"May"} </MenuItem>
                                                    <MenuItem value="June"> {"June"} </MenuItem>
                                                    <MenuItem value="July"> {"July"} </MenuItem>
                                                    <MenuItem value="August"> {"August"} </MenuItem>
                                                    <MenuItem value="September"> {"September"} </MenuItem>
                                                    <MenuItem value="October"> {"October"} </MenuItem>
                                                    <MenuItem value="November "> {"November"} </MenuItem>
                                                    <MenuItem value="December "> {"December"} </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                            <Typography>From Year </Typography>
                                        </Grid>
                                        <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    fullWidth
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 200,
                                                                width: 80,
                                                            },
                                                        },
                                                    }}
                                                    value={pendingfromyear}
                                                    onChange={(e) => {
                                                        setPendingfromyear(e.target.value);
                                                    }}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Without label" }}
                                                >
                                                    <MenuItem value="Choose Year" disabled>
                                                        {" "}
                                                        {"Choose Year"}{" "}
                                                    </MenuItem>
                                                    {years.map((d, index) => (
                                                        <MenuItem value={d} key={index}> {d} </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : null}

                                {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>From Date </Typography>
                                </Grid> */}
                                {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">

                                        <Selects
                                            options={appfromModes}
                                            value={{ label: pendingfromdate, value: pendingfromdate }}
                                            isDisabled={!leavecriteria.pendingleave}
                                            onChange={(e) => {
                                                setPendingfromdate(e.value);
                                            }}
                                        />
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={pendingfromdate}
                                            onChange={(e) => {
                                                setPendingfromdate(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Day" disabled>
                                                {" "}
                                                {"Choose Day"}{" "}
                                            </MenuItem>
                                            <MenuItem value="1"> {"1"} </MenuItem>
                                            <MenuItem value="2"> {"2"} </MenuItem>
                                            <MenuItem value="3"> {"3"} </MenuItem>
                                            <MenuItem value="4"> {"4"} </MenuItem>
                                            <MenuItem value="5"> {"5"} </MenuItem>
                                            <MenuItem value="6"> {"6"} </MenuItem>
                                            <MenuItem value="7"> {"7"} </MenuItem>
                                            <MenuItem value="8"> {"8"} </MenuItem>
                                            <MenuItem value="9"> {"9"} </MenuItem>
                                            <MenuItem value="10"> {"10"} </MenuItem>
                                            <MenuItem value="11"> {"11"} </MenuItem>
                                            <MenuItem value="12"> {"12"} </MenuItem>
                                            <MenuItem value="13"> {"13"} </MenuItem>
                                            <MenuItem value="14"> {"14"} </MenuItem>
                                            <MenuItem value="15"> {"15"} </MenuItem>
                                            <MenuItem value="16"> {"16"} </MenuItem>
                                            <MenuItem value="17"> {"17"} </MenuItem>
                                            <MenuItem value="18"> {"18"} </MenuItem>
                                            <MenuItem value="19"> {"19"} </MenuItem>
                                            <MenuItem value="20"> {"20"} </MenuItem>
                                            <MenuItem value="21"> {"21"} </MenuItem>
                                            <MenuItem value="22"> {"22"} </MenuItem>
                                            <MenuItem value="23"> {"23"} </MenuItem>
                                            <MenuItem value="24"> {"24"} </MenuItem>
                                            <MenuItem value="25"> {"25"} </MenuItem>
                                            <MenuItem value="26"> {"26"} </MenuItem>
                                            <MenuItem value="27"> {"27"} </MenuItem>
                                            <MenuItem value="28"> {"28"} </MenuItem>
                                            <MenuItem value="29"> {"29"} </MenuItem>
                                            <MenuItem value="30"> {"30"} </MenuItem>
                                            <MenuItem value="31"> {"31"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
                            </Grid>
                            <br /> < br />

                            {/* <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography>
                                        <b>Leave Calculation Period </b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.leavecalculation}
                                        value={leavecriteria.leavecalculation}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, leavecalculation: !leavecriteria.leavecalculation });
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    {leavecriteria.leavecalculation ? <span>Yes</span> : <span>No</span>}
                                </Grid> */}

                            {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>From Month </Typography>
                                </Grid> */}
                            {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={appfromModes}
                                            value={{ label: leavefrommonth, value: leavefrommonth }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavefrommonth(e.value);
                                            }}
                                        />
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={leavefrommonth}
                                            onChange={(e) => {
                                                setLeavefrommonth(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Month" disabled>
                                                {" "}
                                                {"Choose Month"}{" "}
                                            </MenuItem>
                                            <MenuItem value="January"> {"January"} </MenuItem>
                                            <MenuItem value="February"> {"February"} </MenuItem>
                                            <MenuItem value="March"> {"March"} </MenuItem>
                                            <MenuItem value="April"> {"April"} </MenuItem>
                                            <MenuItem value="May"> {"May"} </MenuItem>
                                            <MenuItem value="June"> {"June"} </MenuItem>
                                            <MenuItem value="July"> {"July"} </MenuItem>
                                            <MenuItem value="August"> {"August"} </MenuItem>
                                            <MenuItem value="September"> {"September"} </MenuItem>
                                            <MenuItem value="October"> {"October"} </MenuItem>
                                            <MenuItem value="November "> {"November"} </MenuItem>
                                            <MenuItem value="December "> {"December"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
                            {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>From Date </Typography>
                                </Grid> */}
                            {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={appfromModes}
                                            value={{ label: leavefromdate, value: leavefromdate }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavefromdate(e.value);
                                            }}
                                        />
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={leavefromdate}
                                            onChange={(e) => {
                                                setLeavefromdate(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Day" disabled>
                                                {" "}
                                                {"Choose Day"}{" "}
                                            </MenuItem>
                                            <MenuItem value="1"> {"1"} </MenuItem>
                                            <MenuItem value="2"> {"2"} </MenuItem>
                                            <MenuItem value="3"> {"3"} </MenuItem>
                                            <MenuItem value="4"> {"4"} </MenuItem>
                                            <MenuItem value="5"> {"5"} </MenuItem>
                                            <MenuItem value="6"> {"6"} </MenuItem>
                                            <MenuItem value="7"> {"7"} </MenuItem>
                                            <MenuItem value="8"> {"8"} </MenuItem>
                                            <MenuItem value="9"> {"9"} </MenuItem>
                                            <MenuItem value="10"> {"10"} </MenuItem>
                                            <MenuItem value="11"> {"11"} </MenuItem>
                                            <MenuItem value="12"> {"12"} </MenuItem>
                                            <MenuItem value="13"> {"13"} </MenuItem>
                                            <MenuItem value="14"> {"14"} </MenuItem>
                                            <MenuItem value="15"> {"15"} </MenuItem>
                                            <MenuItem value="16"> {"16"} </MenuItem>
                                            <MenuItem value="17"> {"17"} </MenuItem>
                                            <MenuItem value="18"> {"18"} </MenuItem>
                                            <MenuItem value="19"> {"19"} </MenuItem>
                                            <MenuItem value="20"> {"20"} </MenuItem>
                                            <MenuItem value="21"> {"21"} </MenuItem>
                                            <MenuItem value="22"> {"22"} </MenuItem>
                                            <MenuItem value="23"> {"23"} </MenuItem>
                                            <MenuItem value="24"> {"24"} </MenuItem>
                                            <MenuItem value="25"> {"25"} </MenuItem>
                                            <MenuItem value="26"> {"26"} </MenuItem>
                                            <MenuItem value="27"> {"27"} </MenuItem>
                                            <MenuItem value="28"> {"28"} </MenuItem>
                                            <MenuItem value="29"> {"29"} </MenuItem>
                                            <MenuItem value="30"> {"30"} </MenuItem>
                                            <MenuItem value="31"> {"31"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
                            {/* <Grid item md={2} xs={12} sm={12} marginTop={2}></Grid>
                                <Grid item md={1.6} xs={12} sm={12} marginTop={2}></Grid>

                                <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>To Month </Typography>
                                </Grid> */}
                            {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={appfromModes}
                                            value={{ label: leavetomonth, value: leavetomonth }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavetomonth(e.value);
                                            }}
                                        />
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={leavetomonth}
                                            onChange={(e) => {
                                                setLeavetomonth(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Month" disabled>
                                                {" "}
                                                {"Choose Month"}{" "}
                                            </MenuItem>
                                            <MenuItem value="January"> {"January"} </MenuItem>
                                            <MenuItem value="February"> {"February"} </MenuItem>
                                            <MenuItem value="March"> {"March"} </MenuItem>
                                            <MenuItem value="April"> {"April"} </MenuItem>
                                            <MenuItem value="May"> {"May"} </MenuItem>
                                            <MenuItem value="June"> {"June"} </MenuItem>
                                            <MenuItem value="July"> {"July"} </MenuItem>
                                            <MenuItem value="August"> {"August"} </MenuItem>
                                            <MenuItem value="September"> {"September"} </MenuItem>
                                            <MenuItem value="October"> {"October"} </MenuItem>
                                            <MenuItem value="November "> {"November"} </MenuItem>
                                            <MenuItem value="December "> {"December"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
                            {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                    <Typography>To Date </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            options={appfromModes}
                                            value={{ label: leavetodate, value: leavetodate }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavetodate(e.value);
                                            }}
                                        />
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={leavetodate}
                                            onChange={(e) => {
                                                setLeavetodate(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Choose Day" disabled>
                                                {" "}
                                                {"Choose Day"}{" "}
                                            </MenuItem>
                                            <MenuItem value="1"> {"1"} </MenuItem>
                                            <MenuItem value="2"> {"2"} </MenuItem>
                                            <MenuItem value="3"> {"3"} </MenuItem>
                                            <MenuItem value="4"> {"4"} </MenuItem>
                                            <MenuItem value="5"> {"5"} </MenuItem>
                                            <MenuItem value="6"> {"6"} </MenuItem>
                                            <MenuItem value="7"> {"7"} </MenuItem>
                                            <MenuItem value="8"> {"8"} </MenuItem>
                                            <MenuItem value="9"> {"9"} </MenuItem>
                                            <MenuItem value="10"> {"10"} </MenuItem>
                                            <MenuItem value="11"> {"11"} </MenuItem>
                                            <MenuItem value="12"> {"12"} </MenuItem>
                                            <MenuItem value="13"> {"13"} </MenuItem>
                                            <MenuItem value="14"> {"14"} </MenuItem>
                                            <MenuItem value="15"> {"15"} </MenuItem>
                                            <MenuItem value="16"> {"16"} </MenuItem>
                                            <MenuItem value="17"> {"17"} </MenuItem>
                                            <MenuItem value="18"> {"18"} </MenuItem>
                                            <MenuItem value="19"> {"19"} </MenuItem>
                                            <MenuItem value="20"> {"20"} </MenuItem>
                                            <MenuItem value="21"> {"21"} </MenuItem>
                                            <MenuItem value="22"> {"22"} </MenuItem>
                                            <MenuItem value="23"> {"23"} </MenuItem>
                                            <MenuItem value="24"> {"24"} </MenuItem>
                                            <MenuItem value="25"> {"25"} </MenuItem>
                                            <MenuItem value="26"> {"26"} </MenuItem>
                                            <MenuItem value="27"> {"27"} </MenuItem>
                                            <MenuItem value="28"> {"28"} </MenuItem>
                                            <MenuItem value="29"> {"29"} </MenuItem>
                                            <MenuItem value="30"> {"30"} </MenuItem>
                                            <MenuItem value="31"> {"31"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid> */}
                            {/* </Grid> */}
                            {/* <br /> < br /> */}

                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>Allow to Take Leave in Before or After Week off </b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={1} xs={12} sm={6}>
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                checked={leavecriteria.leaverespecttoweekoff}
                                                value={leavecriteria.leaverespecttoweekoff}
                                                onChange={(e) => {
                                                    setLeavecriteria({
                                                        ...leavecriteria,
                                                        leaverespecttoweekoff:
                                                            !leavecriteria.leaverespecttoweekoff,
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                            {leavecriteria.leaverespecttoweekoff ? (
                                                <span>Yes</span>
                                            ) : (
                                                <span>No</span>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>Allow to Take Leave During Training Period </b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={1} xs={12} sm={6}>
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                checked={leavecriteria.leaverespecttotraining}
                                                value={leavecriteria.leaverespecttotraining}
                                                onChange={(e) => {
                                                    setLeavecriteria({
                                                        ...leavecriteria,
                                                        leaverespecttotraining:
                                                            !leavecriteria.leaverespecttotraining,
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                            {leavecriteria.leaverespecttotraining ? (
                                                <span>Yes</span>
                                            ) : (
                                                <span>No</span>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>Uninformed leaves & leaves informed on that day</b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={1} xs={12} sm={6}>
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                checked={leavecriteria.uninformedleave}
                                                value={leavecriteria.uninformedleave}
                                                onChange={(e) => {
                                                    setLeavecriteria({
                                                        ...leavecriteria,
                                                        uninformedleave: !leavecriteria.uninformedleave,
                                                        uninformedleavecount: "",
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                            {leavecriteria.uninformedleave ? (
                                                <span>Yes</span>
                                            ) : (
                                                <span>No</span>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {(leavecriteria.uninformedleave === true || leavecriteria.uninformedleave == "true") ? (
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Typography>
                                            <b>Allowed Uninformed Leave Count</b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={8} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter Allowed Uninformed Leave Count"
                                                        value={leavecriteria.uninformedleavecount}
                                                        onChange={(e) => {
                                                            const enteredValue = e.target.value
                                                                .replace(/\D/g, "")
                                                                .slice(0, 2);
                                                            if (
                                                                enteredValue === "" ||
                                                                /^\d+$/.test(enteredValue)
                                                            ) {
                                                                setLeavecriteria({
                                                                    ...leavecriteria,
                                                                    uninformedleavecount: enteredValue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid item md={6} xs={12} sm={12}></Grid>
                                )}

                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>
                                            Notice period employees will be eligible to take any
                                            kind of leaves
                                        </b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={1} xs={12} sm={6}>
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                checked={leavecriteria.leavefornoticeperiod}
                                                value={leavecriteria.leavefornoticeperiod}
                                                onChange={(e) => {
                                                    setLeavecriteria({
                                                        ...leavecriteria,
                                                        leavefornoticeperiod: !leavecriteria.leavefornoticeperiod,
                                                        leavefornoticeperiodcount: "",
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                            {leavecriteria.leavefornoticeperiod ? (
                                                <span>Yes</span>
                                            ) : (
                                                <span>No</span>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {leavecriteria.leavefornoticeperiod === true ? (
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Typography>
                                            <b>After Notice Period Leave Count</b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={8} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter After Notice Period Leave Count"
                                                        value={leavecriteria.leavefornoticeperiodcount}
                                                        onChange={(e) => {
                                                            const enteredValue = e.target.value
                                                                .replace(/\D/g, "")
                                                                .slice(0, 2);
                                                            if (
                                                                enteredValue === "" ||
                                                                /^\d+$/.test(enteredValue)
                                                            ) {
                                                                setLeavecriteria({
                                                                    ...leavecriteria,
                                                                    leavefornoticeperiodcount: enteredValue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid item md={6} xs={12} sm={12}></Grid>
                                )}
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography >
                                        <b>Took Leave in Leave Block Days </b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={1} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.tookleavecheck}
                                        value={leavecriteria.tookleavecheck}
                                        onChange={(e) => {
                                            setLeavecriteria({
                                                ...leavecriteria,
                                                tookleavecheck:
                                                    !leavecriteria.tookleavecheck,
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                    {leavecriteria.tookleavecheck ? (
                                        <span>Yes</span>
                                    ) : (
                                        <span>No</span>
                                    )}
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                    <Typography>Week Start Day </Typography>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            size="small"
                                            options={days}
                                            value={{ label: leavecriteria.weekstartday, value: leavecriteria.weekstartday, }}
                                            onChange={(e) => setLeavecriteria({ ...leavecriteria, weekstartday: e.value, })}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.sunday}
                                        value={leavecriteria.sunday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, sunday: !leavecriteria.sunday });

                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Sunday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Sunday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Sunday
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.monday}
                                        value={leavecriteria.monday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, monday: !leavecriteria.monday });
                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Monday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Monday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Monday
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.tuesday}
                                        value={leavecriteria.tuesday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, tuesday: !leavecriteria.tuesday });
                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Tuesday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Tuesday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Tuesday
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.wednesday}
                                        value={leavecriteria.wednesday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, wednesday: !leavecriteria.wednesday });
                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Wednesday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Wednesday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Wednesday
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.thursday}
                                        value={leavecriteria.thursday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, thursday: !leavecriteria.thursday });
                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Thursday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Thursday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Thursday
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.friday}
                                        value={leavecriteria.friday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, friday: !leavecriteria.friday });
                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Friday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Friday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Friday
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.saturday}
                                        value={leavecriteria.saturday}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, saturday: !leavecriteria.saturday });
                                            if (e.target.checked) {
                                                setTookLeave([...tookLeave, "Saturday"]);
                                            } else {
                                                setTookLeave(tookLeave.filter((item) => item !== "Saturday")); // 
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    Saturday
                                </Grid>

                            </Grid>
                            <br /> <br />

                            {/* <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography>
                                        <b>Applicable For Salary </b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.applicablesalary}
                                        value={leavecriteria.applicablesalary}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, applicablesalary: !leavecriteria.applicablesalary, fullsalary: false, halfsalary: false });
                                        }}
                                    />
                                </Grid>
                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                    {leavecriteria.applicablesalary ? <span>Yes</span> : <span>No</span>}
                                </Grid>

                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.fullsalary}
                                        value={leavecriteria.fullsalary}
                                        disabled={!leavecriteria.applicablesalary}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, fullsalary: !leavecriteria.fullsalary });
                                        }}
                                    />
                                </Grid>
                                <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                    <Typography >Full Salary </Typography>
                                </Grid>

                                <Grid item md={0.8} xs={12} sm={6}>
                                    <Checkbox
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                        checked={leavecriteria.halfsalary}
                                        value={leavecriteria.halfsalary}
                                        disabled={!leavecriteria.applicablesalary}
                                        onChange={(e) => {
                                            setLeavecriteria({ ...leavecriteria, halfsalary: !leavecriteria.halfsalary });
                                        }}
                                    />
                                </Grid>
                                <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                    <Typography >Half Salary </Typography>
                                </Grid>

                            </Grid>
                            <br /> */}


                            <br /> < br />

                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={6}>
                                    <LoadingButton loading={btnSubmit} variant="contained" color="primary" onClick={handleSubmit}>
                                        Submit
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
                //     overflow: 'visible',
                //     '& .MuiPaper-root': {
                //         overflow: 'visible',
                //     },
                // }}
                >
                    <DialogContent sx={{ width: "1300px" }}>
                        {/* <Box sx={{ padding: '20px', width: '850px' }}> */}
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText} >
                                            <b>Edit Leave Control Criteria</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />


                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>
                                            <b>Leave Control Criteria</b>
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Mode <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={modes}
                                                value={{ label: leavecriteriaEdit.mode, value: leavecriteriaEdit.mode }}
                                                onChange={(e) => {
                                                    setLeavecriteriaEdit((prev) => ({
                                                        ...prev, mode: e.value,
                                                    }))

                                                    setSelectedOptionsCompanyEdit([])
                                                    setSelectedOptionsBranchEdit([])
                                                    setSelectedOptionsUnitEdit([])
                                                    setSelectedOptionsTeamEdit([])
                                                    setSelectedOptionsCateEdit([])
                                                    setSelectedOptionsDepartmentEdit([])
                                                    setSelectedOptionsDesignationEdit([])
                                                    setBranchOptionEdit([])
                                                    setUnitOptionEdit([])
                                                    setTeamOptionEdit([])
                                                    setParticipantsOptionEdit([])

                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                    {leavecriteriaEdit.mode == "Employee" ?
                                        <>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Company <b style={{ color: "red" }}>*</b>
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
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Employee<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={participantsOption
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
                                                        value={selectedOptionsCateEdit}
                                                        onChange={handleCategoryChangeEdit}
                                                        valueRenderer={customValueRendererCateEdit}
                                                        labelledBy="Please Select Participants"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </> :
                                        <>
                                            {leavecriteriaEdit.mode == "Department" ? <>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Department<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={departmentOption}
                                                            value={selectedOptionsDepartmentEdit}
                                                            onChange={(e) => {
                                                                handleDepartmentChangeEdit(e);
                                                            }}
                                                            valueRenderer={customValueRendererDepartmentEdit}
                                                            labelledBy="Please Select Department"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </> : <>
                                                {leavecriteriaEdit.mode == "Designation" ?
                                                    <>
                                                        <Grid item md={4} xs={12} sm={6}>
                                                            <FormControl fullWidth size="small">
                                                                <Typography>
                                                                    Designation<b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <MultiSelect
                                                                    options={designationOption}
                                                                    value={selectedOptionsDesignationEdit}
                                                                    onChange={(e) => {
                                                                        handleDesignationChangeEdit(e);
                                                                    }}
                                                                    valueRenderer={customValueRendererDesignationEdit}
                                                                    labelledBy="Please Select Department"
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </> : <>
                                                    </>}
                                            </>}
                                        </>}

                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>
                                            <b>Manage Leave Control Criteria</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <Typography>Leave Type <b style={{ color: "red" }}>*</b> </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                options={leaveTypeOption}
                                                value={{ label: leavecriteriaEdit.leavetype == "" ? "Please Select Leave Type" : leavecriteriaEdit.leavetype, value: leavecriteriaEdit.leavetype == "" ? "Please Select Leave Type" : leavecriteriaEdit.leavetype }}
                                                onChange={(e) => {
                                                    setLeavecriteriaEdit({ ...leavecriteriaEdit, leavetype: e.value });


                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Applicable From </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br /> <br />
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={12}>
                                        <Typography>Experience </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={leavecriteriaEdit.experience}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;

                                                    if (/^\d{0,2}$/.test(inputValue)) {
                                                        setLeavecriteriaEdit({ ...leavecriteriaEdit, experience: e.target.value });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={1}>
                                        <Typography>Mode </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                options={appfromModes}
                                                value={{ label: experienceinEdit, value: experienceinEdit }}
                                                onChange={(e) => {
                                                    setExperienceinEdit(e.value);
                                                }}
                                            />


                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <Typography>Number of Days <b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={leavecriteriaEdit.numberofdays}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;

                                                    if (/^\d{0,2}$/.test(inputValue)) {
                                                        setLeavecriteriaEdit({ ...leavecriteriaEdit, numberofdays: inputValue });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Leave Auto Increase </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leaveautocheck}
                                            value={leavecriteriaEdit.leaveautocheck}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, leaveautocheck: !leavecriteriaEdit.leaveautocheck });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leaveautocheck ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>Increase </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                disabled={!leavecriteriaEdit.leaveautocheck}
                                                value={leavecriteriaEdit.leaveautoincrease}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;

                                                    if (/^\d{0,2}$/.test(inputValue)) {
                                                        setLeavecriteriaEdit({ ...leavecriteriaEdit, leaveautoincrease: e.target.value });
                                                    }
                                                    if (e.target.value > 3) {
                                                        setShowAlert(
                                                            <>
                                                                <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                                                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Value less than 3"}</p>
                                                            </>
                                                        );
                                                        handleClickOpenerr();
                                                    }

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>Mode</Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">

                                            <Selects
                                                options={appfromModes}
                                                value={{ label: leaveautodaysEdit, value: leaveautodaysEdit }}
                                                isDisabled={!leavecriteriaEdit.leaveautocheck}
                                                onChange={(e) => {
                                                    setLeaveautodaysEdit(e.value);
                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> < br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Pending Leave Carry Over Next Year </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.pendingleave}
                                            value={leavecriteriaEdit.pendingleave}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, pendingleave: !leavecriteriaEdit.pendingleave });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.pendingleave ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    {leavecriteriaEdit.pendingleave === true ? (
                                        <>
                                            <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                                <Typography>From Month </Typography>
                                            </Grid>
                                            <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        fullWidth
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: 80,
                                                                },
                                                            },
                                                        }}
                                                        value={pendingfrommonthEdit}
                                                        onChange={(e) => {
                                                            setPendingfrommonthEdit(e.target.value);
                                                        }}
                                                        displayEmpty
                                                        inputProps={{ "aria-label": "Without label" }}
                                                    >
                                                        <MenuItem value="Choose Month" disabled>
                                                            {" "}
                                                            {"Choose Month"}{" "}
                                                        </MenuItem>
                                                        <MenuItem value="January"> {"January"} </MenuItem>
                                                        <MenuItem value="February"> {"February"} </MenuItem>
                                                        <MenuItem value="March"> {"March"} </MenuItem>
                                                        <MenuItem value="April"> {"April"} </MenuItem>
                                                        <MenuItem value="May"> {"May"} </MenuItem>
                                                        <MenuItem value="June"> {"June"} </MenuItem>
                                                        <MenuItem value="July"> {"July"} </MenuItem>
                                                        <MenuItem value="August"> {"August"} </MenuItem>
                                                        <MenuItem value="September"> {"September"} </MenuItem>
                                                        <MenuItem value="October"> {"October"} </MenuItem>
                                                        <MenuItem value="November "> {"November"} </MenuItem>
                                                        <MenuItem value="December "> {"December"} </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                                <Typography>From Year </Typography>
                                            </Grid>
                                            <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        fullWidth
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: 80,
                                                                },
                                                            },
                                                        }}
                                                        value={pendingfromyearEdit}
                                                        onChange={(e) => {
                                                            setPendingfromyearEdit(e.target.value);
                                                        }}
                                                        displayEmpty
                                                        inputProps={{ "aria-label": "Without label" }}
                                                    >
                                                        <MenuItem value="Choose Year" disabled>
                                                            {" "}
                                                            {"Choose Year"}{" "}
                                                        </MenuItem>
                                                        {years.map((d, index) => (
                                                            <MenuItem value={d} key={index}> {d} </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : null}
                                    {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Month </Typography>
                                    </Grid> */}
                                    {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                            options={appfromModes}
                                            value={{ label: pendingfrommonth, value: pendingfrommonth }}
                                            isDisabled={!leavecriteria.pendingleave}
                                            onChange={(e) => {
                                                setPendingfrommonth(e.value);
                                            }}
                                        />
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={pendingfrommonthEdit}
                                                onChange={(e) => {
                                                    setPendingfrommonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="January"> {"January"} </MenuItem>
                                                <MenuItem value="February"> {"February"} </MenuItem>
                                                <MenuItem value="March"> {"March"} </MenuItem>
                                                <MenuItem value="April"> {"April"} </MenuItem>
                                                <MenuItem value="May"> {"May"} </MenuItem>
                                                <MenuItem value="June"> {"June"} </MenuItem>
                                                <MenuItem value="July"> {"July"} </MenuItem>
                                                <MenuItem value="August"> {"August"} </MenuItem>
                                                <MenuItem value="September"> {"September"} </MenuItem>
                                                <MenuItem value="October"> {"October"} </MenuItem>
                                                <MenuItem value="November "> {"November"} </MenuItem>
                                                <MenuItem value="December "> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Date </Typography>
                                    </Grid> */}
                                    {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">

                                            <Selects
                                            options={appfromModes}
                                            value={{ label: pendingfromdate, value: pendingfromdate }}
                                            isDisabled={!leavecriteria.pendingleave}
                                            onChange={(e) => {
                                                setPendingfromdate(e.value);
                                            }}
                                        />
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={pendingfromdateEdit}
                                                onChange={(e) => {
                                                    setPendingfromdateEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Day" disabled>
                                                    {" "}
                                                    {"Choose Day"}{" "}
                                                </MenuItem>
                                                <MenuItem value="1"> {"1"} </MenuItem>
                                                <MenuItem value="2"> {"2"} </MenuItem>
                                                <MenuItem value="3"> {"3"} </MenuItem>
                                                <MenuItem value="4"> {"4"} </MenuItem>
                                                <MenuItem value="5"> {"5"} </MenuItem>
                                                <MenuItem value="6"> {"6"} </MenuItem>
                                                <MenuItem value="7"> {"7"} </MenuItem>
                                                <MenuItem value="8"> {"8"} </MenuItem>
                                                <MenuItem value="9"> {"9"} </MenuItem>
                                                <MenuItem value="10"> {"10"} </MenuItem>
                                                <MenuItem value="11"> {"11"} </MenuItem>
                                                <MenuItem value="12"> {"12"} </MenuItem>
                                                <MenuItem value="13"> {"13"} </MenuItem>
                                                <MenuItem value="14"> {"14"} </MenuItem>
                                                <MenuItem value="15"> {"15"} </MenuItem>
                                                <MenuItem value="16"> {"16"} </MenuItem>
                                                <MenuItem value="17"> {"17"} </MenuItem>
                                                <MenuItem value="18"> {"18"} </MenuItem>
                                                <MenuItem value="19"> {"19"} </MenuItem>
                                                <MenuItem value="20"> {"20"} </MenuItem>
                                                <MenuItem value="21"> {"21"} </MenuItem>
                                                <MenuItem value="22"> {"22"} </MenuItem>
                                                <MenuItem value="23"> {"23"} </MenuItem>
                                                <MenuItem value="24"> {"24"} </MenuItem>
                                                <MenuItem value="25"> {"25"} </MenuItem>
                                                <MenuItem value="26"> {"26"} </MenuItem>
                                                <MenuItem value="27"> {"27"} </MenuItem>
                                                <MenuItem value="28"> {"28"} </MenuItem>
                                                <MenuItem value="29"> {"29"} </MenuItem>
                                                <MenuItem value="30"> {"30"} </MenuItem>
                                                <MenuItem value="31"> {"31"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid> */}
                                </Grid>
                                <br /> < br />

                                {/* <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Leave Calculation Period </b>
                                        </Typography>
                                    </Grid>
                                </Grid> */}
                                <br />
                                {/* <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leavecalculation}
                                            value={leavecriteriaEdit.leavecalculation}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, leavecalculation: !leavecriteriaEdit.leavecalculation });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leavecalculation ? <span>Yes</span> : <span>No</span>}
                                    </Grid> */}

                                {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Month </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                            options={appfromModes}
                                            value={{ label: leavefrommonth, value: leavefrommonth }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavefrommonth(e.value);
                                            }}
                                        />
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavefrommonthEdit}
                                                onChange={(e) => {
                                                    setLeavefrommonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="January"> {"January"} </MenuItem>
                                                <MenuItem value="February"> {"February"} </MenuItem>
                                                <MenuItem value="March"> {"March"} </MenuItem>
                                                <MenuItem value="April"> {"April"} </MenuItem>
                                                <MenuItem value="May"> {"May"} </MenuItem>
                                                <MenuItem value="June"> {"June"} </MenuItem>
                                                <MenuItem value="July"> {"July"} </MenuItem>
                                                <MenuItem value="August"> {"August"} </MenuItem>
                                                <MenuItem value="September"> {"September"} </MenuItem>
                                                <MenuItem value="October"> {"October"} </MenuItem>
                                                <MenuItem value="November "> {"November"} </MenuItem>
                                                <MenuItem value="December "> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid> */}
                                {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Date </Typography>
                                    </Grid> */}
                                {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                            options={appfromModes}
                                            value={{ label: leavefromdate, value: leavefromdate }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavefromdate(e.value);
                                            }}
                                        />
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavefromdateEdit}
                                                onChange={(e) => {
                                                    setLeavefromdateEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Day" disabled>
                                                    {" "}
                                                    {"Choose Day"}{" "}
                                                </MenuItem>
                                                <MenuItem value="1"> {"1"} </MenuItem>
                                                <MenuItem value="2"> {"2"} </MenuItem>
                                                <MenuItem value="3"> {"3"} </MenuItem>
                                                <MenuItem value="4"> {"4"} </MenuItem>
                                                <MenuItem value="5"> {"5"} </MenuItem>
                                                <MenuItem value="6"> {"6"} </MenuItem>
                                                <MenuItem value="7"> {"7"} </MenuItem>
                                                <MenuItem value="8"> {"8"} </MenuItem>
                                                <MenuItem value="9"> {"9"} </MenuItem>
                                                <MenuItem value="10"> {"10"} </MenuItem>
                                                <MenuItem value="11"> {"11"} </MenuItem>
                                                <MenuItem value="12"> {"12"} </MenuItem>
                                                <MenuItem value="13"> {"13"} </MenuItem>
                                                <MenuItem value="14"> {"14"} </MenuItem>
                                                <MenuItem value="15"> {"15"} </MenuItem>
                                                <MenuItem value="16"> {"16"} </MenuItem>
                                                <MenuItem value="17"> {"17"} </MenuItem>
                                                <MenuItem value="18"> {"18"} </MenuItem>
                                                <MenuItem value="19"> {"19"} </MenuItem>
                                                <MenuItem value="20"> {"20"} </MenuItem>
                                                <MenuItem value="21"> {"21"} </MenuItem>
                                                <MenuItem value="22"> {"22"} </MenuItem>
                                                <MenuItem value="23"> {"23"} </MenuItem>
                                                <MenuItem value="24"> {"24"} </MenuItem>
                                                <MenuItem value="25"> {"25"} </MenuItem>
                                                <MenuItem value="26"> {"26"} </MenuItem>
                                                <MenuItem value="27"> {"27"} </MenuItem>
                                                <MenuItem value="28"> {"28"} </MenuItem>
                                                <MenuItem value="29"> {"29"} </MenuItem>
                                                <MenuItem value="30"> {"30"} </MenuItem>
                                                <MenuItem value="31"> {"31"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid> */}
                                {/* <Grid item md={2} xs={12} sm={12} marginTop={2}></Grid>
                                    <Grid item md={1.6} xs={12} sm={12} marginTop={2}></Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>To Month </Typography>
                                    </Grid> */}
                                {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                            options={appfromModes}
                                            value={{ label: leavetomonth, value: leavetomonth }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavetomonth(e.value);
                                            }}
                                        />
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavetomonthEdit}
                                                onChange={(e) => {
                                                    setLeavetomonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="January"> {"January"} </MenuItem>
                                                <MenuItem value="February"> {"February"} </MenuItem>
                                                <MenuItem value="March"> {"March"} </MenuItem>
                                                <MenuItem value="April"> {"April"} </MenuItem>
                                                <MenuItem value="May"> {"May"} </MenuItem>
                                                <MenuItem value="June"> {"June"} </MenuItem>
                                                <MenuItem value="July"> {"July"} </MenuItem>
                                                <MenuItem value="August"> {"August"} </MenuItem>
                                                <MenuItem value="September"> {"September"} </MenuItem>
                                                <MenuItem value="October"> {"October"} </MenuItem>
                                                <MenuItem value="November "> {"November"} </MenuItem>
                                                <MenuItem value="December "> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>To Date </Typography>
                                    </Grid> */}
                                {/* <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                            options={appfromModes}
                                            value={{ label: leavetodate, value: leavetodate }}
                                            isDisabled={!leavecriteria.leavecalculation}
                                            onChange={(e) => {
                                                setLeavetodate(e.value);
                                            }}
                                        />
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavetodateEdit}
                                                onChange={(e) => {
                                                    setLeavetodateEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Day" disabled>
                                                    {" "}
                                                    {"Choose Day"}{" "}
                                                </MenuItem>
                                                <MenuItem value="1"> {"1"} </MenuItem>
                                                <MenuItem value="2"> {"2"} </MenuItem>
                                                <MenuItem value="3"> {"3"} </MenuItem>
                                                <MenuItem value="4"> {"4"} </MenuItem>
                                                <MenuItem value="5"> {"5"} </MenuItem>
                                                <MenuItem value="6"> {"6"} </MenuItem>
                                                <MenuItem value="7"> {"7"} </MenuItem>
                                                <MenuItem value="8"> {"8"} </MenuItem>
                                                <MenuItem value="9"> {"9"} </MenuItem>
                                                <MenuItem value="10"> {"10"} </MenuItem>
                                                <MenuItem value="11"> {"11"} </MenuItem>
                                                <MenuItem value="12"> {"12"} </MenuItem>
                                                <MenuItem value="13"> {"13"} </MenuItem>
                                                <MenuItem value="14"> {"14"} </MenuItem>
                                                <MenuItem value="15"> {"15"} </MenuItem>
                                                <MenuItem value="16"> {"16"} </MenuItem>
                                                <MenuItem value="17"> {"17"} </MenuItem>
                                                <MenuItem value="18"> {"18"} </MenuItem>
                                                <MenuItem value="19"> {"19"} </MenuItem>
                                                <MenuItem value="20"> {"20"} </MenuItem>
                                                <MenuItem value="21"> {"21"} </MenuItem>
                                                <MenuItem value="22"> {"22"} </MenuItem>
                                                <MenuItem value="23"> {"23"} </MenuItem>
                                                <MenuItem value="24"> {"24"} </MenuItem>
                                                <MenuItem value="25"> {"25"} </MenuItem>
                                                <MenuItem value="26"> {"26"} </MenuItem>
                                                <MenuItem value="27"> {"27"} </MenuItem>
                                                <MenuItem value="28"> {"28"} </MenuItem>
                                                <MenuItem value="29"> {"29"} </MenuItem>
                                                <MenuItem value="30"> {"30"} </MenuItem>
                                                <MenuItem value="31"> {"31"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid> */}
                                {/* </Grid> */}
                                {/* <br /> < br /> */}
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Typography>
                                            <b>Allow to Take Leave in Before or After Week off </b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={1} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={leavecriteriaEdit.leaverespecttoweekoff}
                                                    value={leavecriteriaEdit.leaverespecttoweekoff}
                                                    onChange={(e) => {
                                                        setLeavecriteriaEdit({
                                                            ...leavecriteriaEdit,
                                                            leaverespecttoweekoff:
                                                                !leavecriteriaEdit.leaverespecttoweekoff,
                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                                {leavecriteriaEdit.leaverespecttoweekoff ? (
                                                    <span>Yes</span>
                                                ) : (
                                                    <span>No</span>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item md={6} xs={12} sm={12}>
                                        <Typography>
                                            <b>Allow to Take Leave During Training Period </b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={1} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={leavecriteriaEdit.leaverespecttotraining}
                                                    value={leavecriteriaEdit.leaverespecttotraining}
                                                    onChange={(e) => {
                                                        setLeavecriteriaEdit({
                                                            ...leavecriteriaEdit,
                                                            leaverespecttotraining:
                                                                !leavecriteriaEdit.leaverespecttotraining,
                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                                {leavecriteriaEdit.leaverespecttotraining ? (
                                                    <span>Yes</span>
                                                ) : (
                                                    <span>No</span>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item md={6} xs={12} sm={12}>
                                        <Typography>
                                            <b>Uninformed leaves & leaves informed on that day</b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={1} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={leavecriteriaEdit.uninformedleave}
                                                    value={leavecriteriaEdit.uninformedleave}
                                                    onChange={(e) => {
                                                        setLeavecriteriaEdit({
                                                            ...leavecriteriaEdit,
                                                            uninformedleave: !leavecriteriaEdit.uninformedleave,
                                                            uninformedleavecount: "",
                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                                {leavecriteriaEdit.uninformedleave ? (
                                                    <span>Yes</span>
                                                ) : (
                                                    <span>No</span>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {leavecriteriaEdit.uninformedleave === true ? (
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Typography>
                                                <b>Allowed Uninformed Leave Count</b>
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item md={8} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            type="text"
                                                            placeholder="Please Enter Allowed Uninformed Leave Count"
                                                            value={leavecriteriaEdit.uninformedleavecount}
                                                            onChange={(e) => {
                                                                const enteredValue = e.target.value
                                                                    .replace(/\D/g, "")
                                                                    .slice(0, 2);
                                                                if (
                                                                    enteredValue === "" ||
                                                                    /^\d+$/.test(enteredValue)
                                                                ) {
                                                                    setLeavecriteriaEdit({
                                                                        ...leavecriteriaEdit,
                                                                        uninformedleavecount: enteredValue,
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid item md={6} xs={12} sm={12}></Grid>
                                    )}

                                    <Grid item md={6} xs={12} sm={12}>
                                        <Typography>
                                            <b>
                                                Notice period employees will be eligible to take any
                                                kind of leaves
                                            </b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={1} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={leavecriteriaEdit.leavefornoticeperiod}
                                                    value={leavecriteriaEdit.leavefornoticeperiod}
                                                    onChange={(e) => {
                                                        setLeavecriteriaEdit({
                                                            ...leavecriteriaEdit,
                                                            leavefornoticeperiod: !leavecriteriaEdit.leavefornoticeperiod,
                                                            leavefornoticeperiodcount: "",
                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                                {leavecriteriaEdit.leavefornoticeperiod ? (
                                                    <span>Yes</span>
                                                ) : (
                                                    <span>No</span>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {leavecriteriaEdit.leavefornoticeperiod === true ? (
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Typography>
                                                <b>After Notice Period Leave Count</b>
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item md={8} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            type="text"
                                                            placeholder="Please Enter After Notice Period Leave Count"
                                                            value={leavecriteriaEdit.leavefornoticeperiodcount}
                                                            onChange={(e) => {
                                                                const enteredValue = e.target.value
                                                                    .replace(/\D/g, "")
                                                                    .slice(0, 2);
                                                                if (
                                                                    enteredValue === "" ||
                                                                    /^\d+$/.test(enteredValue)
                                                                ) {
                                                                    setLeavecriteriaEdit({
                                                                        ...leavecriteriaEdit,
                                                                        leavefornoticeperiodcount: enteredValue,
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid item md={6} xs={12} sm={12}></Grid>
                                    )}
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Took Leave in Leave Block Days </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.tookleavecheck}
                                            value={leavecriteriaEdit.tookleavecheck}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({
                                                    ...leavecriteriaEdit,
                                                    tookleavecheck: !leavecriteriaEdit.tookleavecheck,
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.tookleavecheck ? (
                                            <span>Yes</span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                        <Typography>Week Start Day </Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                size="small"
                                                options={days}
                                                value={{ label: leavecriteriaEdit.weekstartday, value: leavecriteriaEdit.weekstartday, }}
                                                onChange={(e) => setLeavecriteriaEdit({ ...leavecriteriaEdit, weekstartday: e.value, })}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {/* <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.sunday}
                                            value={leavecriteriaEdit.sunday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, sunday: !leavecriteriaEdit.sunday });

                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Sunday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Sunday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Sunday
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.monday}
                                            value={leavecriteriaEdit.monday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, monday: !leavecriteriaEdit.monday });
                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Monday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Monday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Monday
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.tuesday}
                                            value={leavecriteriaEdit.tuesday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, tuesday: !leavecriteriaEdit.tuesday });
                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Tuesday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Tuesday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Tuesday
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.wednesday}
                                            value={leavecriteriaEdit.wednesday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, wednesday: !leavecriteriaEdit.wednesday });
                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Wednesday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Wednesday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Wednesday
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.thursday}
                                            value={leavecriteriaEdit.thursday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, thursday: !leavecriteriaEdit.thursday });
                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Thursday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Thursday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Thursday
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.friday}
                                            value={leavecriteriaEdit.friday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, friday: !leavecriteriaEdit.friday });
                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Friday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Friday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Friday
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.saturday}
                                            value={leavecriteriaEdit.saturday}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, saturday: !leavecriteriaEdit.saturday });
                                                if (e.target.checked) {
                                                    setTookLeaveEdit([...tookLeaveEdit, "Saturday"]);
                                                } else {
                                                    setTookLeaveEdit(tookLeaveEdit.filter((item) => item !== "Saturday")); // 
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        Saturday
                                    </Grid>
                                </Grid> */}
                                <br /> <br />

                                {/* <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Applicable For Salary </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.applicablesalary}
                                            value={leavecriteriaEdit.applicablesalary}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, applicablesalary: !leavecriteriaEdit.applicablesalary });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.applicablesalary ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.fullsalary}
                                            value={leavecriteriaEdit.fullsalary}
                                            disabled={!leavecriteriaEdit.applicablesalary}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, fullsalary: !leavecriteriaEdit.fullsalary });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        <Typography >Full Salary </Typography>
                                    </Grid>

                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.halfsalary}
                                            value={leavecriteriaEdit.halfsalary}
                                            disabled={!leavecriteriaEdit.applicablesalary}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, halfsalary: !leavecriteriaEdit.halfsalary });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        <Typography >Half Salary </Typography>
                                    </Grid>

                                </Grid> 
                                <br /> */}

                                {/* <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={12}>
                                        <Typography>Leave Type </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={leavecriteriaEdit.leavetype}
                                                onChange={(e) => {
                                                    setLeavecriteriaEdit({ ...leavecriteriaEdit, leavetype: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <Typography>Number of Days </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={leavecriteriaEdit.numberofdays}
                                                onChange={(e) => {
                                                    setLeavecriteriaEdit({ ...leavecriteriaEdit, numberofdays: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Applicable Form </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br /> <br />
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={12}>
                                        <Typography>Experience </Typography>
                                    </Grid>
                                    <Grid item md={3.2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={leavecriteriaEdit.experience}
                                                onChange={(e) => {
                                                    setLeavecriteriaEdit({ ...leavecriteriaEdit, experience: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={0.5} xs={12} sm={12}>
                                        <Typography>In </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={experienceinEdit}
                                                onChange={(e) => {
                                                    setExperienceinEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Mode" disabled>
                                                    {" "}
                                                    {"Choose Mode"}{" "}
                                                </MenuItem>
                                                <MenuItem value="Day"> {"Day"} </MenuItem>
                                                <MenuItem value="Month"> {"Month"} </MenuItem>
                                                <MenuItem value="Year"> {"Year"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Leave Auto Increase </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leaveautocheck}
                                            value={leavecriteriaEdit.leaveautocheck}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, leaveautocheck: !leavecriteriaEdit.leaveautocheck });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leaveautocheck ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>Increase </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                value={leavecriteriaEdit.leaveautoincrease}
                                                onChange={(e) => {
                                                    setLeavecriteriaEdit({ ...leavecriteriaEdit, leaveautoincrease: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>Days Per </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leaveautodaysEdit}
                                                onChange={(e) => {
                                                    setLeaveautodaysEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Mode" disabled>
                                                    {" "}
                                                    {"Choose Mode"}{" "}
                                                </MenuItem>
                                                <MenuItem value="Day"> {"Day"} </MenuItem>
                                                <MenuItem value="Month"> {"Month"} </MenuItem>
                                                <MenuItem value="Year"> {"Year"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> < br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Pending Leave Carry Over Next Year </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.pendingleave}
                                            value={leavecriteriaEdit.pendingleave}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, pendingleave: !leavecriteriaEdit.pendingleave });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.pendingleave ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Month </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={pendingfrommonthEdit}
                                                onChange={(e) => {
                                                    setPendingfrommonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="January"> {"January"} </MenuItem>
                                                <MenuItem value="February"> {"February"} </MenuItem>
                                                <MenuItem value="March"> {"March"} </MenuItem>
                                                <MenuItem value="April"> {"April"} </MenuItem>
                                                <MenuItem value="May"> {"May"} </MenuItem>
                                                <MenuItem value="June"> {"June"} </MenuItem>
                                                <MenuItem value="July"> {"July"} </MenuItem>
                                                <MenuItem value="August"> {"August"} </MenuItem>
                                                <MenuItem value="September"> {"September"} </MenuItem>
                                                <MenuItem value="October"> {"October"} </MenuItem>
                                                <MenuItem value="November "> {"November"} </MenuItem>
                                                <MenuItem value="December "> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Date </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={pendingfromdateEdit}
                                                onChange={(e) => {
                                                    setPendingfromdateEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Day" disabled>
                                                    {" "}
                                                    {"Choose Day"}{" "}
                                                </MenuItem>
                                                <MenuItem value="1"> {"1"} </MenuItem>
                                                <MenuItem value="2"> {"2"} </MenuItem>
                                                <MenuItem value="3"> {"3"} </MenuItem>
                                                <MenuItem value="4"> {"4"} </MenuItem>
                                                <MenuItem value="5"> {"5"} </MenuItem>
                                                <MenuItem value="6"> {"6"} </MenuItem>
                                                <MenuItem value="7"> {"7"} </MenuItem>
                                                <MenuItem value="8"> {"8"} </MenuItem>
                                                <MenuItem value="9"> {"9"} </MenuItem>
                                                <MenuItem value="10"> {"10"} </MenuItem>
                                                <MenuItem value="11"> {"11"} </MenuItem>
                                                <MenuItem value="12"> {"12"} </MenuItem>
                                                <MenuItem value="13"> {"13"} </MenuItem>
                                                <MenuItem value="14"> {"14"} </MenuItem>
                                                <MenuItem value="15"> {"15"} </MenuItem>
                                                <MenuItem value="16"> {"16"} </MenuItem>
                                                <MenuItem value="17"> {"17"} </MenuItem>
                                                <MenuItem value="18"> {"18"} </MenuItem>
                                                <MenuItem value="19"> {"19"} </MenuItem>
                                                <MenuItem value="20"> {"20"} </MenuItem>
                                                <MenuItem value="21"> {"21"} </MenuItem>
                                                <MenuItem value="22"> {"22"} </MenuItem>
                                                <MenuItem value="23"> {"23"} </MenuItem>
                                                <MenuItem value="24"> {"24"} </MenuItem>
                                                <MenuItem value="25"> {"25"} </MenuItem>
                                                <MenuItem value="26"> {"26"} </MenuItem>
                                                <MenuItem value="27"> {"27"} </MenuItem>
                                                <MenuItem value="28"> {"28"} </MenuItem>
                                                <MenuItem value="29"> {"29"} </MenuItem>
                                                <MenuItem value="30"> {"30"} </MenuItem>
                                                <MenuItem value="31"> {"31"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> < br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Leave Calculation Period </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leavecalculation}
                                            value={leavecriteriaEdit.leavecalculation}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, leavecalculation: !leavecriteriaEdit.leavecalculation });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leavecalculation ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Month </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavefrommonthEdit}
                                                onChange={(e) => {
                                                    setLeavefrommonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="January"> {"January"} </MenuItem>
                                                <MenuItem value="February"> {"February"} </MenuItem>
                                                <MenuItem value="March"> {"March"} </MenuItem>
                                                <MenuItem value="April"> {"April"} </MenuItem>
                                                <MenuItem value="May"> {"May"} </MenuItem>
                                                <MenuItem value="June"> {"June"} </MenuItem>
                                                <MenuItem value="July"> {"July"} </MenuItem>
                                                <MenuItem value="August"> {"August"} </MenuItem>
                                                <MenuItem value="September"> {"September"} </MenuItem>
                                                <MenuItem value="October"> {"October"} </MenuItem>
                                                <MenuItem value="November "> {"November"} </MenuItem>
                                                <MenuItem value="December "> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Date </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavefromdateEdit}
                                                onChange={(e) => {
                                                    setLeavefromdateEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Day" disabled>
                                                    {" "}
                                                    {"Choose Day"}{" "}
                                                </MenuItem>
                                                <MenuItem value="1"> {"1"} </MenuItem>
                                                <MenuItem value="2"> {"2"} </MenuItem>
                                                <MenuItem value="3"> {"3"} </MenuItem>
                                                <MenuItem value="4"> {"4"} </MenuItem>
                                                <MenuItem value="5"> {"5"} </MenuItem>
                                                <MenuItem value="6"> {"6"} </MenuItem>
                                                <MenuItem value="7"> {"7"} </MenuItem>
                                                <MenuItem value="8"> {"8"} </MenuItem>
                                                <MenuItem value="9"> {"9"} </MenuItem>
                                                <MenuItem value="10"> {"10"} </MenuItem>
                                                <MenuItem value="11"> {"11"} </MenuItem>
                                                <MenuItem value="12"> {"12"} </MenuItem>
                                                <MenuItem value="13"> {"13"} </MenuItem>
                                                <MenuItem value="14"> {"14"} </MenuItem>
                                                <MenuItem value="15"> {"15"} </MenuItem>
                                                <MenuItem value="16"> {"16"} </MenuItem>
                                                <MenuItem value="17"> {"17"} </MenuItem>
                                                <MenuItem value="18"> {"18"} </MenuItem>
                                                <MenuItem value="19"> {"19"} </MenuItem>
                                                <MenuItem value="20"> {"20"} </MenuItem>
                                                <MenuItem value="21"> {"21"} </MenuItem>
                                                <MenuItem value="22"> {"22"} </MenuItem>
                                                <MenuItem value="23"> {"23"} </MenuItem>
                                                <MenuItem value="24"> {"24"} </MenuItem>
                                                <MenuItem value="25"> {"25"} </MenuItem>
                                                <MenuItem value="26"> {"26"} </MenuItem>
                                                <MenuItem value="27"> {"27"} </MenuItem>
                                                <MenuItem value="28"> {"28"} </MenuItem>
                                                <MenuItem value="29"> {"29"} </MenuItem>
                                                <MenuItem value="30"> {"30"} </MenuItem>
                                                <MenuItem value="31"> {"31"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}></Grid>
                                    <Grid item md={1.6} xs={12} sm={12} marginTop={2}></Grid>

                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>To Month </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavetomonthEdit}
                                                onChange={(e) => {
                                                    setLeavetomonthEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Month" disabled>
                                                    {" "}
                                                    {"Choose Month"}{" "}
                                                </MenuItem>
                                                <MenuItem value="January"> {"January"} </MenuItem>
                                                <MenuItem value="February"> {"February"} </MenuItem>
                                                <MenuItem value="March"> {"March"} </MenuItem>
                                                <MenuItem value="April"> {"April"} </MenuItem>
                                                <MenuItem value="May"> {"May"} </MenuItem>
                                                <MenuItem value="June"> {"June"} </MenuItem>
                                                <MenuItem value="July"> {"July"} </MenuItem>
                                                <MenuItem value="August"> {"August"} </MenuItem>
                                                <MenuItem value="September"> {"September"} </MenuItem>
                                                <MenuItem value="October"> {"October"} </MenuItem>
                                                <MenuItem value="November "> {"November"} </MenuItem>
                                                <MenuItem value="December "> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                        <Typography>To Date </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={leavetodateEdit}
                                                onChange={(e) => {
                                                    setLeavetodateEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Choose Day" disabled>
                                                    {" "}
                                                    {"Choose Day"}{" "}
                                                </MenuItem>
                                                <MenuItem value="1"> {"1"} </MenuItem>
                                                <MenuItem value="2"> {"2"} </MenuItem>
                                                <MenuItem value="3"> {"3"} </MenuItem>
                                                <MenuItem value="4"> {"4"} </MenuItem>
                                                <MenuItem value="5"> {"5"} </MenuItem>
                                                <MenuItem value="6"> {"6"} </MenuItem>
                                                <MenuItem value="7"> {"7"} </MenuItem>
                                                <MenuItem value="8"> {"8"} </MenuItem>
                                                <MenuItem value="9"> {"9"} </MenuItem>
                                                <MenuItem value="10"> {"10"} </MenuItem>
                                                <MenuItem value="11"> {"11"} </MenuItem>
                                                <MenuItem value="12"> {"12"} </MenuItem>
                                                <MenuItem value="13"> {"13"} </MenuItem>
                                                <MenuItem value="14"> {"14"} </MenuItem>
                                                <MenuItem value="15"> {"15"} </MenuItem>
                                                <MenuItem value="16"> {"16"} </MenuItem>
                                                <MenuItem value="17"> {"17"} </MenuItem>
                                                <MenuItem value="18"> {"18"} </MenuItem>
                                                <MenuItem value="19"> {"19"} </MenuItem>
                                                <MenuItem value="20"> {"20"} </MenuItem>
                                                <MenuItem value="21"> {"21"} </MenuItem>
                                                <MenuItem value="22"> {"22"} </MenuItem>
                                                <MenuItem value="23"> {"23"} </MenuItem>
                                                <MenuItem value="24"> {"24"} </MenuItem>
                                                <MenuItem value="25"> {"25"} </MenuItem>
                                                <MenuItem value="26"> {"26"} </MenuItem>
                                                <MenuItem value="27"> {"27"} </MenuItem>
                                                <MenuItem value="28"> {"28"} </MenuItem>
                                                <MenuItem value="29"> {"29"} </MenuItem>
                                                <MenuItem value="30"> {"30"} </MenuItem>
                                                <MenuItem value="31"> {"31"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /> < br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Took Leave in Leave Block Days </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.tookleave}
                                            value={leavecriteriaEdit.tookleave}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, tookleave: !leavecriteriaEdit.tookleave });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.tookleave ? <span>Yes</span> : <span>No</span>}
                                    </Grid>
                                </Grid>
                                <br /> <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>
                                            <b>Applicable For Salary </b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.applicablesalary}
                                            value={leavecriteriaEdit.applicablesalary}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, applicablesalary: !leavecriteriaEdit.applicablesalary });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.applicablesalary ? <span>Yes</span> : <span>No</span>}
                                    </Grid>

                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.fullsalary}
                                            value={leavecriteriaEdit.fullsalary}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, fullsalary: !leavecriteriaEdit.fullsalary });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        <Typography >Full Salary </Typography>
                                    </Grid>

                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.halfsalary}
                                            value={leavecriteriaEdit.halfsalary}
                                            onChange={(e) => {
                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, halfsalary: !leavecriteriaEdit.halfsalary });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        <Typography >Half Salary </Typography>
                                    </Grid>
                                </Grid> */}
                                <br /> < br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" type="submit">
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
                        {/* </Box> */}
                    </DialogContent>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lleavecriteria") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Leave Control Criteria List</Typography>
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
                                        {/* <MenuItem value={leavecriterias?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelleavecriteria") && (
                                        <>
                                            {/* <ExportXL csvData={leaveData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchLeavecriteria()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvleavecriteria") && (
                                        <>
                                            {/* <ExportCSV csvData={leaveData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchLeavecriteria()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printleavecriteria") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfleavecriteria") && (
                                        <>
                                            {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button> */}
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchLeavecriteria()
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageleavecriteria") && (
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
                        {isUserRoleCompare?.includes("bdleavecriteria") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>)}
                        <br />
                        <br />
                        {!leavecriteriaCheck ? (
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delLeavecriteria(leavesid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}

                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Leave Control Criteria Info</Typography>
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
                                <TableCell>S.No</TableCell>
                                <TableCell>Deaprtment</TableCell>
                                <TableCell>Designation</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Employee</TableCell>
                                <TableCell>Leavetype</TableCell>
                                <TableCell>Number of Days</TableCell>
                                <TableCell>Experience</TableCell>
                                <TableCell>Experience In</TableCell>
                                <TableCell>Leave Auto Increase</TableCell>
                                <TableCell>Increase</TableCell>
                                <TableCell>Days Per</TableCell>
                                <TableCell>Pending Leave Carry</TableCell>
                                {/* <TableCell>Pending Frommonth</TableCell>
                                <TableCell>Pending Fromdate</TableCell> */}
                                {/* <TableCell>Leave Calculation Period</TableCell> */}
                                {/* <TableCell>Leave Frommonth</TableCell>
                                <TableCell>Leave Fromdate</TableCell>
                                <TableCell>Leave Tomonth</TableCell>
                                <TableCell>Leave Todate</TableCell> */}
                                <TableCell>Took Leave</TableCell>
                                {/* <TableCell>Took Leave Day</TableCell> */}
                                {/* <TableCell>Applicable For Salary</TableCell> */}
                                {/* <TableCell>Full Salary</TableCell>
                                <TableCell>Half Salary</TableCell> */}
                                <TableCell>Leave Respect To Weekoff</TableCell>
                                <TableCell>Leave Respect To Training</TableCell>
                                <TableCell>Uninformed Leave</TableCell>
                                <TableCell>Uninformed Leave Count</TableCell>
                                <TableCell>Leave For Notice Period</TableCell>
                                <TableCell>Notice Period Leave Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{Array.isArray(row.department) ? row.department.join(',') : ""}</TableCell>
                                        <TableCell>{Array.isArray(row.designation) ? row.designation.join(',') : ""}</TableCell>
                                        <TableCell>{Array.isArray(row.company) ? row.company.join(',') : ""}</TableCell>
                                        <TableCell>{Array.isArray(row.branch) ? row.branch.join(',') : ""}</TableCell>
                                        <TableCell>{Array.isArray(row.unit) ? row.unit.join(',') : ""}</TableCell>
                                        <TableCell>{Array.isArray(row.team) ? row.team.join(',') : ""}</TableCell>
                                        <TableCell>{Array.isArray(row.employee) ? row.employee.join(',') : ""}</TableCell>
                                        <TableCell>{row.leavetype}</TableCell>
                                        <TableCell>{row.numberofdays}</TableCell>
                                        <TableCell>{row.experience}</TableCell>
                                        <TableCell>{row.experiencein}</TableCell>
                                        <TableCell>{row.leaveautocheck ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.leaveautoincrease}</TableCell>
                                        <TableCell>{row.leaveautodays}</TableCell>
                                        <TableCell>{row.pendingleave ? "YES" : "NO"}</TableCell>
                                        {/* <TableCell>{row.pendingfrommonth}</TableCell>
                                        <TableCell>{row.pendingfromdate}</TableCell> */}
                                        {/* <TableCell>{row.leavecalculation ? "YES" : "NO"}</TableCell> */}
                                        {/* <TableCell>{row.leavefrommonth}</TableCell>
                                        <TableCell>{row.leavefromdate}</TableCell>
                                        <TableCell>{row.leavetomonth}</TableCell>
                                        <TableCell>{row.leavetodate}</TableCell> */}
                                        <TableCell>{row.tookleavecheck ? "YES" : "NO"}</TableCell>
                                        {/* <TableCell>{row.tookleave.map(d => d.day).join(',')}</TableCell> */}
                                        {/* <TableCell>{row.applicablesalary ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.fullsalary ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.halfsalary ? "YES" : "NO"}</TableCell> */}
                                        <TableCell>{row.leaverespecttoweekoff ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.leaverespecttotraining ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.uninformedleave ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.uninformedleavecount}</TableCell>
                                        <TableCell>{row.leavefornoticeperiod ? "YES" : "NO"}</TableCell>
                                        <TableCell>{row.leavefornoticeperiodcount}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

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
                            fetchLeavecriteria()
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

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                {/* <Box sx={{ padding: '30px 70px', width:"1000px" }}> */}
                <DialogContent sx={{ width: "1300px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            <b>View Leave Control Criteria</b>{" "}
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    <b>Leave Control Criteria</b>
                                </Typography>
                            </Grid>

                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Mode
                                    </Typography>
                                    <OutlinedInput readOnly value={leavecriteriaEdit.mode} />


                                </FormControl>
                            </Grid>
                            {leavecriteriaEdit.mode == "Employee" ?
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsCompanyEdit) ? selectedOptionsCompanyEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>


                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography >
                                                Branch
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsBranchEdit) ? selectedOptionsBranchEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsUnitEdit) ? selectedOptionsUnitEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsTeamEdit) ? selectedOptionsTeamEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsCateEdit) ? selectedOptionsCateEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                </> :
                                <>
                                    {leavecriteriaEdit.mode == "Department" ? <>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department
                                                </Typography>
                                                <Typography>
                                                    {Array.isArray(selectedOptionsDepartmentEdit) ? selectedOptionsDepartmentEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                                </Typography>

                                            </FormControl>
                                        </Grid>
                                    </> : <>
                                        {leavecriteriaEdit.mode == "Designation" ?
                                            <>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Designation
                                                        </Typography>
                                                        <Typography>
                                                            {Array.isArray(selectedOptionsDesignationEdit) ? selectedOptionsDesignationEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                                        </Typography>

                                                    </FormControl>
                                                </Grid>
                                            </> : <>
                                            </>}
                                    </>}
                                </>}

                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    <b>Manage Leave Control Criteria</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />

                        <Grid container spacing={2}>
                            <Grid item md={1} xs={12} sm={12}>
                                <Typography>Leave Type </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={leavecriteriaEdit.leavetype} />


                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />

                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>
                                    <b>Applicable From </b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={1} xs={12} sm={12}>
                                <Typography>Experience </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        value={leavecriteriaEdit.experience}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={1} xs={12} sm={12} marginTop={1}>
                                <Typography>Mode </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={experienceinEdit} />

                                </FormControl>
                            </Grid>
                            <Grid item md={1.5} xs={12} sm={12}>
                                <Typography>Number of Days </Typography>
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        value={leavecriteriaEdit.numberofdays}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />

                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>
                                    <b>Leave Auto Increase </b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.leaveautocheck}
                                    value={leavecriteriaEdit.leaveautocheck}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                {leavecriteriaEdit.leaveautocheck ? <span>Yes</span> : <span>No</span>}
                            </Grid>

                            <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>Increase </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        disabled={!leavecriteriaEdit.leaveautocheck}
                                        value={leavecriteriaEdit.leaveautoincrease}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>Mode</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={leaveautodaysEdit} />


                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> < br />

                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>
                                    <b>Pending Leave Carry Over Next Year </b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.pendingleave}
                                    value={leavecriteriaEdit.pendingleave}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                {leavecriteriaEdit.pendingleave ? <span>Yes</span> : <span>No</span>}
                            </Grid>

                            {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>From Month </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={pendingfrommonthEdit} />

                                </FormControl>
                            </Grid>
                            <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>From Date </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">

                                    <OutlinedInput readOnly value={pendingfromdateEdit} />

                                </FormControl>
                            </Grid> */}
                        </Grid>
                        <br /> < br />

                        {/* <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>
                                    <b>Leave Calculation Period </b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.leavecalculation}
                                    value={leavecriteriaEdit.leavecalculation}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                {leavecriteriaEdit.leavecalculation ? <span>Yes</span> : <span>No</span>}
                            </Grid> */}

                        {/* <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>From Month </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={leavefrommonthEdit} />

                                </FormControl>
                            </Grid>
                            <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>From Date </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={leavefromdateEdit} />

                                </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} marginTop={2}></Grid>
                            <Grid item md={1.6} xs={12} sm={12} marginTop={2}></Grid>

                            <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>To Month </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={leavetomonthEdit} />

                                </FormControl>
                            </Grid>
                            <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                <Typography>To Date </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput readOnly value={leavetodateEdit} />

                                </FormControl>
                            </Grid> */}
                        {/* </Grid> */}
                        {/* <br /> < br /> */}
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography>
                                    <b>Allow to Take Leave in Before or After Week off </b>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leaverespecttoweekoff}
                                            value={leavecriteriaEdit.leaverespecttoweekoff}

                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leaverespecttoweekoff ? (
                                            <span>Yes</span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <Typography>
                                    <b>Allow to Take Leave During Training Period </b>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leaverespecttotraining}
                                            value={leavecriteriaEdit.leaverespecttotraining}

                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leaverespecttotraining ? (
                                            <span>Yes</span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <Typography >
                                    <b>Uninformed leaves & leaves informed on that day</b>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.uninformedleave}
                                            value={leavecriteriaEdit.uninformedleave}

                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.uninformedleave ? (
                                            <span>Yes</span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            {leavecriteriaEdit.uninformedleave === true ? (
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>Allowed Uninformed Leave Count</b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={8} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Allowed Uninformed Leave Count"
                                                    value={leavecriteriaEdit.uninformedleavecount}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item md={6} xs={12} sm={12}></Grid>
                            )}

                            <Grid item md={6} xs={12} sm={12}>
                                <Typography>
                                    <b>
                                        Notice period employees will be eligible to take any
                                        kind of leaves
                                    </b>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.leavefornoticeperiod}
                                            value={leavecriteriaEdit.leavefornoticeperiod}

                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.leavefornoticeperiod ? (
                                            <span>Yes</span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            {leavecriteriaEdit.leavefornoticeperiod === true ? (
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>After Notice Period Leave Count</b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={8} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter After Notice Period Leave Count"
                                                    value={leavecriteriaEdit.leavefornoticeperiodcount}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item md={6} xs={12} sm={12}></Grid>
                            )}
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>
                                    <b>Took Leave in Leave Block Days </b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={1} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.tookleavecheck}
                                    value={leavecriteriaEdit.tookleavecheck}
                                />
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                {leavecriteriaEdit.tookleavecheck ? (
                                    <span>Yes</span>
                                ) : (
                                    <span>No</span>
                                )}
                            </Grid>
                        </Grid>
                        {/* <br />
                        <Grid container spacing={2}>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.sunday}
                                    value={leavecriteriaEdit.sunday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Sunday
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.monday}
                                    value={leavecriteriaEdit.monday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Monday
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.tuesday}
                                    value={leavecriteriaEdit.tuesday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Tuesday
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.wednesday}
                                    value={leavecriteriaEdit.wednesday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Wednesday
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.thursday}
                                    value={leavecriteriaEdit.thursday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Thursday
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.friday}
                                    value={leavecriteriaEdit.friday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Friday
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.saturday}
                                    value={leavecriteriaEdit.saturday}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                Saturday
                            </Grid>
                        </Grid> */}
                        <br /> <br />

                        {/* <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>
                                    <b>Applicable For Salary </b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.applicablesalary}
                                    value={leavecriteriaEdit.applicablesalary}

                                />
                            </Grid>
                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                {leavecriteriaEdit.applicablesalary ? <span>Yes</span> : <span>No</span>}
                            </Grid>

                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.fullsalary}
                                    value={leavecriteriaEdit.fullsalary}
                                    disabled={!leavecriteriaEdit.applicablesalary}

                                />
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                <Typography >Full Salary </Typography>
                            </Grid>

                            <Grid item md={0.8} xs={12} sm={6}>
                                <Checkbox
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                    checked={leavecriteriaEdit.halfsalary}
                                    value={leavecriteriaEdit.halfsalary}
                                    disabled={!leavecriteriaEdit.applicablesalary}

                                />
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                <Typography >Half Salary </Typography>
                            </Grid>

                        </Grid>
                        <br /> */}

                        <br /> < br />     <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </DialogContent>
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
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delLeavecheckbox(e)}>
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
        </Box>
    );
}

export default LeaveCriteria;