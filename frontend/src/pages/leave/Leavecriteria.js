import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch, FaEdit } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, InputAdornment } from "@mui/material";
import { userStyle } from "../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { handleApiError } from "../../components/Errorhandling";
import { SERVICE } from "../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
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
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ManageColumnsContent from "../../components/ManageColumn";
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTableEbList.js";
import AdvancedSearchBar from '../../components/Searchbar.js';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function LeaveCriteria() {

    const gridRefTableLeaveCrit = useRef(null);
    const gridRefImageLeaveCrit = useRef(null);

    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [leavecriteria, setLeavecriteria] = useState({
        leavetype: "Please Select Leave Type", numberofdays: "0", experience: "", experiencein: "", applicablefrommonth: "Choose Month", applicablefromyear: "Choose Year",
        leaveautocheck: "", leaveautoincrease: "", leaveautoincreasedays: "", leaveautodays: "Choose Mode",
        pendingleave: "", pendingfrommonth: "Choose Month", pendingfromdate: "Choose Day",
        leavecalculation: "", leavefrommonth: "Choose Month", leavefromdate: "Choose Day", leavetomonth: "Choose Month", leavetodate: "Choose Day",
        tookleave: "", applicablesalary: "", fullsalary: "", halfsalary: "", mode: "Department", lopdays: 'Choose LOP', applydays: '',
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
        leavetype: "", numberofdays: "0", experience: "", experiencein: "Choose Mode", applicablefrommonth: "Choose Month", applicablefromyear: "Choose Year",
        leaveautocheck: "", leaveautoincrease: "", leaveautoincreasedays: "", leaveautodays: "Choose Mode",
        pendingleave: "", pendingfrommonth: "Choose Month", pendingfromdate: "Choose Day",
        leavecalculation: "", leavefrommonth: "Choose Month", leavefromdate: "Choose Day", leavetomonth: "Choose Month", leavetodate: "Choose Day",
        tookleave: "", applicablesalary: "", fullsalary: "", halfsalary: "", lopdays: "Choose LOP", applydays: "",
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

    const [todosCheck, setTodosCheck] = useState([]);
    const [editingIndexCheck, setEditingIndexCheck] = useState(-1);
    const [selectedOptionsDayEdit, setSelectedOptionsDayEdit] = useState([]);
    const [valueDayEdit, setValueDayEdit] = useState([]);
    const [todoSubmit, setTodoSubmit] = useState(false);

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

    const lopOptions = [
        { label: 'Single Day / Single LOP', value: "Single Day / Single LOP" },
        { label: 'Double Day / Double LOP', value: "Double Day / Double LOP" },
        { label: 'Single Day consider as Double day', value: "Single Day consider as Double day" },
    ];

    const [tookLeave, setTookLeave] = useState([]);

    const [tookLeaveEdit, setTookLeaveEdit] = useState([]);

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

    //Designation multiselect
    const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState([]);
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
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
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
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const leaveall = [
                { label: "No Call/No Show", value: "No Call/No Show" },
                { label: "Leave Without Pay (LWP)", value: "Leave Without Pay (LWP)" },
                ...res?.data?.leavetype.map((d) => ({
                    ...d,
                    label: d.leavetype,
                    value: d.leavetype,
                })),
            ];
            setLeaveTypeOption(leaveall);
            // setLeaveTypeOption([
            //     ...res?.data?.leavetype
            //         ?.map((t) => ({
            //             ...t,
            //             label: t.leavetype,
            //             value: t.leavetype,
            //         })),
            // ]);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all comnpany.
    const fetchCompanyAll = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all branches.
    const fetchBranchAll = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch unit
    const fetchUnitAll = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch  team
    const fetchTeamAll = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch participants
    const fetchParticipants = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch department based on branch and team
    const fetchDepartmentAll = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch department based on branch and team
    const fetchDesignationAll = async () => {
        setPageName(!pageName)
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    const [selectedOptionsDesignationEdit, setSelectedOptionsDesignationEdit] = useState([]);
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
    const [selectedOptionsDepartmentEdit, setSelectedOptionsDepartmentEdit] = useState([]);
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
    const [allLeavecriteriaedit, setAllLeavecriteriaedit] = useState([]);

    // State to track advanced filter
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [leavecriteriaCheck, setLeavecriteriacheck] = useState(false);

    const [experiencein, setExperiencein] = useState("Month");
    const [leaveautodays, setLeaveautodays] = useState("Month");
    const [applicablefrommonth, setApplicablefrommonth] = useState("Choose Month");
    const [applicablefromyear, setApplicablefromyear] = useState("Choose Year");
    const [pendingfrommonth, setPendingfrommonth] = useState("Choose Month");
    const [pendingfromyear, setPendingfromyear] = useState("Choose Year");
    const [leavefrommonth, setLeavefrommonth] = useState("Choose Month");
    const [leavetomonth, setLeavetomonth] = useState("Choose Month");
    const [leavefromdate, setLeavefromdate] = useState("Choose Day");
    const [leavetodate, setLeavetodate] = useState("Choose Day");
    const [pendingfromdate, setPendingfromdate] = useState("Choose Day");

    const [experienceinEdit, setExperienceinEdit] = useState("Choose Mode");
    const [leaveautodaysEdit, setLeaveautodaysEdit] = useState("Choose Mode");
    const [applicablefrommonthEdit, setApplicablefrommonthEdit] = useState("Choose Month");
    const [applicablefromyearEdit, setApplicablefromyearEdit] = useState("Choose Year");
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

    const [copiedData, setCopiedData] = useState("");

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

    //Datatable
    const [pageLeaveCrit, setPageLeaveCrit] = useState(1);
    const [pageSizeLeaveCrit, setPageSizeLeaveCrit] = useState(10);
    const [searchQueryLeaveCrit, setSearchQueryLeaveCrit] = useState("");
    const [totalPagesLeaveCrit, setTotalPagesLeaveCrit] = useState(1);

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
        setBtnSubmitEdit(false);
    };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => { setIsDeleteOpencheckbox(true); };
    const handleCloseModcheckbox = () => { setIsDeleteOpencheckbox(false); };

    // Manage Columns
    const [searchQueryManageLeaveCrit, setSearchQueryManageLeaveCrit] = useState("");
    const [isManageColumnsOpenLeaveCrit, setManageColumnsOpenLeaveCrit] = useState(false);
    const [anchorElLeaveCrit, setAnchorElLeaveCrit] = useState(null);

    const handleOpenManageColumnsLeaveCrit = (event) => {
        setAnchorElLeaveCrit(event.currentTarget);
        setManageColumnsOpenLeaveCrit(true);
    };
    const handleCloseManageColumnsLeaveCrit = () => {
        setManageColumnsOpenLeaveCrit(false);
        setSearchQueryManageLeaveCrit("");
    };

    const openLeaveCrit = Boolean(anchorElLeaveCrit);
    const idLeaveCrit = openLeaveCrit ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchLeaveCrit, setAnchorElSearchLeaveCrit] = React.useState(null);
    const handleClickSearchLeaveCrit = (event) => {
        setAnchorElSearchLeaveCrit(event.currentTarget);
    };
    const handleCloseSearchLeaveCrit = () => {
        setAnchorElSearchLeaveCrit(null);
        setSearchQueryLeaveCrit("");
    };

    const openSearchLeaveCrit = Boolean(anchorElSearchLeaveCrit);
    const idSearchLeaveCrit = openSearchLeaveCrit ? 'simple-popover' : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibilityLeaveCrit = {
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
        applicablefrommonth: true,
        applicablefromyear: true,
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

    const [columnVisibilityLeaveCrit, setColumnVisibilityLeaveCrit] = useState(initialColumnVisibilityLeaveCrit);

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

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
            pagename: String("Leave Criteria"),
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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteLeavecriteria, setDeleteLeavecriteria] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteLeavecriteria(res?.data?.sleavecriteria);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let leavesid = deleteLeavecriteria?._id;
    const delLeavecriteria = async () => {
        setPageName(!pageName)
        try {
            if (leavesid) {
                await axios.delete(`${SERVICE.LEAVECRITERIA_SINGLE}/${leavesid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchLeavecriteria();
                await fetchLeavecriteriaAll();
                setIsHandleChange(false);
                handleCloseMod();
                setSelectedRows([]);
                setPageLeaveCrit(1);
                setPopupContent("Cleared Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delLeavecheckbox = async () => {
        setPageName(!pageName)
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
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPageLeaveCrit(1);

            await fetchLeavecriteria();
            await fetchLeavecriteriaAll();
            setPopupContent("Cleared Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    const currentMonthIndex = new Date().getMonth();

    const getCurrentWeekOfMonth = () => {
        const date = new Date();
        const startWeekDayIndex = 1; // Assuming week starts on Monday
        const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDay = firstDate.getDay();
        const offset = (firstDay - startWeekDayIndex + 7) % 7;
        return Math.ceil((date.getDate() + offset) / 7);
    };

    const currentWeek = getCurrentWeekOfMonth();

    //add function
    const sendRequest = async () => {
        setBtnSubmit(true);
        setPageName(!pageName)
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
            if (leavecriteria.leavetype === 'No Call/No Show') {
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
                    tookdaycommon: tookLeave,
                    tookleave: newTodoList,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            } else {
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
                    applicablefrommonth: String(applicablefrommonth),
                    applicablefromyear: String(applicablefromyear),
                    experience: String(leavecriteria.experience),
                    experiencein: String(experiencein),
                    leaveautocheck: Boolean(leavecriteria.leaveautocheck),
                    leaveautoincrease: String(leavecriteria.leaveautoincrease),
                    leaveautodays: String(leaveautodays),
                    branchlimitcheck: Boolean(leavecriteria.branchlimitcheck),
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
                    tookdaycommon: tookLeave,
                    lopdays: String(leavecriteria.lopdays),
                    applydays: String(leavecriteria.applydays),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            }
            await fetchLeavecriteria();
            await fetchLeavecriteriaAll();


            setBtnSubmit(false);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchLeavecriteriaAll();
        if (leavecriteria.mode == "Employee") {
            let emps = selectedOptionsCate.map((item) => item.value);
            let isNameMatch = leavecriteriasAll.some((data) => data.employee.some((item) => emps.includes(item)) && data.leavetype == leavecriteria.leavetype);
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
            else if (selectedOptionsTeam.length === 0) {
                setPopupContentMalert("Please Select Team");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsCate.length === 0) {
                setPopupContentMalert("Please Select Employee");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype == "Please Select Leave Type" || leavecriteria.leavetype === "" || leavecriteria.leavetype === undefined) {
                setPopupContentMalert("Please Select Leave Type!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.experience === '') {
                setPopupContentMalert("Please Enter Experience!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && (leavecriteria.numberofdays == "" || leavecriteria.numberofdays === undefined || leavecriteria.numberofdays === "0" || leavecriteria.numberofdays === 0)) {
                setPopupContentMalert("Please Enter Number of Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && applicablefrommonth === 'Choose Month') {
                setPopupContentMalert("Please Select From Month!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && applicablefromyear === 'Choose Year') {
                setPopupContentMalert("Please Select From Year!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.leaveautocheck === '' || leavecriteria.leaveautocheck === false) {
                setPopupContentMalert("Please Select Leave Auto Increase Check Box!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.leaveautocheck === true && leavecriteria.leaveautoincrease === '' || leavecriteria.leaveautoincrease === 0) {
                setPopupContentMalert("Please Enter Increase Value!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.applydays === "") {
                setPopupContentMalert("Please Enter Apply Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.tookleavecheck && leavecriteria.lopdays === 'Choose LOP') {
                setPopupContentMalert("Please Select LOP Calculation!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.tookleavecheck && tookLeave.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype === "No Call/No Show" && tookLeave.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest()
            }
        } else if (leavecriteria.mode == "Department") {
            let deps = selectedOptionsDepartment.map((item) => item.value);
            let isNameMatch = leavecriteriasAll.some((data) => data.department.some((item) => deps.includes(item)) && data.leavetype == leavecriteria.leavetype);
            if (selectedOptionsDepartment.length === 0) {
                setPopupContentMalert("Please Select Department");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype == "Please Select Leave Type" || leavecriteria.leavetype === "" || leavecriteria.leavetype === undefined) {
                setPopupContentMalert("Please Select Leave Type!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.experience === '') {
                setPopupContentMalert("Please Enter Experience!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && (leavecriteria.numberofdays === "" || leavecriteria.numberofdays === undefined || leavecriteria.numberofdays === "0" || leavecriteria.numberofdays === 0)) {
                setPopupContentMalert("Please Enter Number of Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && applicablefrommonth === 'Choose Month') {
                setPopupContentMalert("Please Select From Month!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && applicablefromyear === 'Choose Year') {
                setPopupContentMalert("Please Select From Year!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.leaveautocheck === '' || leavecriteria.leaveautocheck === false) {
                setPopupContentMalert("Please Select Leave Auto Increase Check Box!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.leaveautocheck === true && leavecriteria.leaveautoincrease === '' || leavecriteria.leaveautoincrease === 0) {
                setPopupContentMalert("Please Enter Increase Value!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.applydays === "") {
                setPopupContentMalert("Please Enter Apply Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.tookleavecheck && leavecriteria.lopdays === 'Choose LOP') {
                setPopupContentMalert("Please Select LOP Calculation!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.tookleavecheck && tookLeave.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype === "No Call/No Show" && tookLeave.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest()
            }
        } else if (leavecriteria.mode == "Designation") {
            let desigs = selectedOptionsDesignation.map((item) => item.value);
            let isNameMatch = leavecriteriasAll.some((data) => data.designation.some((item) => desigs.includes(item)) && data.leavetype == leavecriteria.leavetype);
            if (selectedOptionsDesignation.length === 0) {
                setPopupContentMalert("Please Select Designation");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype == "Please Select Leave Type" || leavecriteria.leavetype === "" || leavecriteria.leavetype === undefined) {
                setPopupContentMalert("Please Select Leave Type!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.experience === '') {
                setPopupContentMalert("Please Enter Experience!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && (leavecriteria.numberofdays == "" || leavecriteria.numberofdays === undefined || leavecriteria.numberofdays === "0" || leavecriteria.numberofdays === 0)) {
                setPopupContentMalert("Please Enter Number of Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && applicablefrommonth === 'Choose Month') {
                setPopupContentMalert("Please Select From Month!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && applicablefromyear === 'Choose Year') {
                setPopupContentMalert("Please Select From Year!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.leaveautocheck === '' || leavecriteria.leaveautocheck === false) {
                setPopupContentMalert("Please Select Leave Auto Increase Check Box!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.leaveautocheck === true && leavecriteria.leaveautoincrease === '' || leavecriteria.leaveautoincrease === 0) {
                setPopupContentMalert("Please Enter Increase Value!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.applydays === "") {
                setPopupContentMalert("Please Enter Apply Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.tookleavecheck && leavecriteria.lopdays === 'Choose LOP') {
                setPopupContentMalert("Please Select LOP Calculation!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype !== "No Call/No Show" && leavecriteria.tookleavecheck && tookLeave.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteria.leavetype === "No Call/No Show" && tookLeave.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exits!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest()
            }
        }

        else {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setLeavecriteria({
            ...leavecriteria,
            leavetype: "Please Select Leave Type", numberofdays: "0", experience: "", experiencein: "", applicablefrommonth: "choose Month", applicablefromyear: "Choose Year",
            leaveautocheck: "", leaveautoincrease: "", leaveautoincreasedays: "", leaveautodays: "Choose Mode",
            pendingleave: "", pendingfrommonth: "Choose Month", pendingfromyear: "Choose Year", pendingfromdate: "Choose Day",
            leavecalculation: "", leavefrommonth: "Choose Month", leavefromdate: "Choose Day", leavetomonth: "Choose Month", leavetodate: "Choose Day",
            tookleavecheck: false,
            tookleave: "", applicablesalary: "", fullsalary: "", halfsalary: "", mode: "Department", lopdays: 'Choose LOP', applydays: '',
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
        setApplicablefrommonth("Choose Month");
        setApplicablefromyear("Choose Year")
        setPendingfrommonth("Choose Month");
        setPendingfromyear("Choose Year");
        setPendingfromdate("Choose Day");
        setLeavefrommonth("Choose Month");
        setLeavefromdate("Choose Day");
        setLeavetomonth("Choose Month");
        setLeavetodate("Choose Day");
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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

    const handleDayChangeEdit = (options) => {

        setValueDayEdit(
            options.map((a, index) => {
                return a.value;
            })
        );

        setSelectedOptionsDayEdit(options);
    };

    const customValueRendererDayEdit = (valueDayEdit, _documents) => {
        return valueDayEdit?.length ? valueDayEdit.map(({ label }) => label).join(", ") : "Please Select Day";
    };

    const handleDeleteTodoCheck = (index) => {
        const newTodoscheck = [...todosCheck];
        newTodoscheck.splice(index, 1);
        setTodosCheck(newTodoscheck);
    };

    const handleEditTodoCheck = (index) => {
        setEditingIndexCheck(index);

        setValueDayEdit(
            todosCheck[index]?.day?.map((a, index) => {
                return a?.value;
            })
        );
        setSelectedOptionsDayEdit(todosCheck[index].day.map((item) => ({
            ...item,
            label: item,
            value: item,
        })));


    };

    const handleUpdateTodoCheck = () => {

        const day = selectedOptionsDayEdit ? selectedOptionsDayEdit.map(item => item.value) : "";

        const newTodoscheck = [...todosCheck];

        newTodoscheck[editingIndexCheck].day = day;

        setTodosCheck(newTodoscheck);
        setEditingIndexCheck(-1);
        setValueDayEdit("")

    };

    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
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
            handleClickOpenEdit();
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
            setApplicablefrommonthEdit(res?.data?.sleavecriteria?.applicablefrommonth);
            setApplicablefromyearEdit(res?.data?.sleavecriteria?.applicablefromyear);
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

            let uniqueDayNames = Array.from(new Set(res?.data?.sleavecriteria?.tookleave.map((t) => t.day)));

            const mergedTodoList = res?.data?.sleavecriteria?.tookleave.reduce((acc, current) => {
                const existingEntry = acc.find(
                    item => item.year === current.year && item.month === current.month && item.week === current.week
                );

                if (existingEntry) {
                    existingEntry.day.push(current.day);
                } else {
                    acc.push({
                        year: current.year,
                        month: current.month,
                        week: current.week,
                        day: [current.day]
                    });
                }

                return acc;
            }, []);

            setTodosCheck(mergedTodoList.filter(data => Number(data.year) === currentYear));
            setSelectedOptionsDayEdit(uniqueDayNames.map((t) => ({
                label: t,
                value: t
            })));
            setValueDayEdit(uniqueDayNames);

            setLeavecriteriasAllEdit(res_vendor?.data?.leavecriterias.filter((data) => data._id != res?.data?.sleavecriteria._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
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
            handleClickOpenview();
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
            setApplicablefrommonthEdit(res?.data?.sleavecriteria?.applicablefrommonth);
            setApplicablefromyearEdit(res?.data?.sleavecriteria?.applicablefromyear);
            setPendingfrommonthEdit(res?.data?.sleavecriteria.pendingfrommonth);
            setPendingfromyearEdit(res?.data?.sleavecriteria.pendingfromyear);
            setLeavefrommonthEdit(res?.data?.sleavecriteria.leavefrommonth);
            setLeavetomonthEdit(res?.data?.sleavecriteria.leavetomonth);
            setLeavefromdateEdit(res?.data?.sleavecriteria.leavefromdate);
            setLeavetodateEdit(res?.data?.sleavecriteria.leavetodate);
            setPendingfromdateEdit(res?.data?.sleavecriteria.pendingfromdate);

            const mergedTodoList = res?.data?.sleavecriteria?.tookleave.reduce((acc, current) => {
                const existingEntry = acc.find(
                    item => item.year === current.year && item.month === current.month && item.week === current.week
                );

                if (existingEntry) {
                    existingEntry.day.push(current.day);
                } else {
                    acc.push({
                        year: current.year,
                        month: current.month,
                        week: current.week,
                        day: [current.day]
                    });
                }

                return acc;
            }, []);

            setTodosCheck(mergedTodoList.filter(data => Number(data.year) === currentYear));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriaEdit(res?.data?.sleavecriteria);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = leavecriteriaEdit?.updatedby;
    let addedby = leavecriteriaEdit?.addedby;

    let subprojectsid = leavecriteriaEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        // let filtEdit = Array.from(new Set(tookLeaveEdit));        

        let comp = selectedOptionsCompanyEdit.map((item) => item.value);
        let bran = selectedOptionsBranchEdit.map((item) => item.value);
        let unit = selectedOptionsUnitEdit.map((item) => item.value);
        let team = selectedOptionsTeamEdit.map((item) => item.value);
        let emp = selectedOptionsCateEdit.map((item) => item.value);
        let depart = selectedOptionsDepartmentEdit.map((item) => item.value);
        let desig = selectedOptionsDesignationEdit.map((item) => item.value);

        let newTodoCheckList = [];
        todosCheck.map((todo) => {
            todo.day.map((day) => {
                newTodoCheckList.push({
                    year: todo.year,
                    month: todo.month,
                    week: todo.week,
                    day: day
                });
            })
        })
        const newDayData = [...new Set(newTodoCheckList.map(data => data.day))];
        // console.log(newTodoCheckList, 'newTodoCheckList')
        try {
            if (leavecriteriaEdit.leavetype === 'No Call/No Show') {
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
                    tookleave: newTodoCheckList,
                    tookdaycommon: leavecriteriaEdit.tookdaycommon,
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            } else {
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
                    applicablefrommonth: String(applicablefrommonthEdit) === "Choose Month" ? "" : applicablefrommonthEdit,
                    applicablefromyear: String(applicablefromyearEdit) === "Choose Year" ? "" : applicablefromyearEdit,
                    experience: String(leavecriteriaEdit.experience),
                    experiencein: String(experienceinEdit) === "Choose Mode" ? "" : experienceinEdit,
                    leaveautocheck: Boolean(leavecriteriaEdit.leaveautocheck),
                    leaveautoincrease: String(leavecriteriaEdit.leaveautoincrease),
                    leaveautodays: String(leaveautodaysEdit) === "Choose Mode" ? "" : leaveautodaysEdit,
                    branchlimitcheck: Boolean(leavecriteriaEdit.branchlimitcheck),
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
                    // tookleave: filtEdit,
                    tookleave: !leavecriteriaEdit.tookleavecheck ? [] : newTodoCheckList,
                    applicablesalary: Boolean(leavecriteriaEdit.applicablesalary),
                    fullsalary: Boolean(leavecriteriaEdit.fullsalary),
                    halfsalary: Boolean(leavecriteriaEdit.halfsalary),
                    leaverespecttoweekoff: Boolean(leavecriteriaEdit.leaverespecttoweekoff),
                    leaverespecttotraining: Boolean(leavecriteriaEdit.leaverespecttotraining),
                    uninformedleave: Boolean(leavecriteriaEdit.uninformedleave),
                    uninformedleavecount: String(leavecriteriaEdit.uninformedleavecount),
                    leavefornoticeperiod: Boolean(leavecriteriaEdit.leavefornoticeperiod),
                    leavefornoticeperiodcount: String(leavecriteriaEdit.leavefornoticeperiodcount),
                    // tookdaycommon: leavecriteriaEdit.tookleavecheck ? [] : newDayData, // added new edited day in tookdaycommon
                    tookdaycommon: leavecriteriaEdit.tookdaycommon,
                    lopdays: String(leavecriteriaEdit.lopdays),
                    applydays: String(leavecriteriaEdit.applydays),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            }
            await fetchLeavecriteria();
            await fetchLeavecriteriaAll();
            handleCloseModEdit();
            setTookLeaveEdit([]);
            setBtnSubmitEdit(false);
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setBtnSubmitEdit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const editSubmit = async (e) => {
        setBtnSubmitEdit(true);
        e.preventDefault();
        await fetchLeavecriteriaAll();
        if (leavecriteriaEdit.mode == "Employee") {
            let emps = selectedOptionsCateEdit.map((item) => item.value);
            let isNameMatch = leavecriteriasAllEdit.some((data) => data.employee.some((item) => emps.includes(item)) && data.leavetype == leavecriteriaEdit.leavetype);
            if (selectedOptionsCompanyEdit.length === 0) {
                setPopupContentMalert("Please Select Company");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsBranchEdit.length === 0) {
                setPopupContentMalert("Please Select Branch");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsUnitEdit.length === 0) {
                setPopupContentMalert("Please Select Unit");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsTeamEdit.length === 0) {
                setPopupContentMalert("Please Select Team");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsCateEdit.length === 0) {
                setPopupContentMalert("Please Select Employee");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype == "Please Select Leave Type" || leavecriteriaEdit.leavetype === "" || leavecriteriaEdit.leavetype === undefined) {
                setPopupContentMalert("Please Select Leave Type!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.experience === '') {
                setPopupContentMalert("Please Enter Experience!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && (leavecriteriaEdit.numberofdays == "" || leavecriteriaEdit.numberofdays === undefined || leavecriteriaEdit.numberofdays === "0" || leavecriteriaEdit.numberofdays === 0)) {
                setPopupContentMalert("Please Enter Number of Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && applicablefrommonthEdit === 'Choose Month') {
                setPopupContentMalert("Please Select From Month!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && applicablefromyearEdit === 'Choose Year') {
                setPopupContentMalert("Please Select From Year!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.leaveautocheck === '' || leavecriteriaEdit.leaveautocheck === false) {
                setPopupContentMalert("Please Select Leave Auto Increase Check Box!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.leaveautocheck === true && leavecriteriaEdit.leaveautoincrease === '' || leavecriteriaEdit.leaveautoincrease === 0) {
                setPopupContentMalert("Please Enter Increase Value!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.tookleavecheck === true && selectedOptionsDayEdit.length === 0) {
                setPopupContentMalert("Please Select Day!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.applydays === "") {
                setPopupContentMalert("Please Enter Apply Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.tookleavecheck && leavecriteriaEdit.lopdays === 'Choose LOP') {
                setPopupContentMalert("Please Select LOP Calculation!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.tookleavecheck && tookLeaveEdit.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype === "No Call/No Show" && tookLeaveEdit.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (todoSubmit === true) {
                setPopupContentMalert("Please Update the todo and Submit!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditRequest()
            }
        } else if (leavecriteriaEdit.mode == "Department") {
            let deps = selectedOptionsDepartmentEdit.map((item) => item.value);
            let isNameMatch = leavecriteriasAllEdit.some((data) => data.department.some((item) => deps.includes(item)) && data.leavetype == leavecriteriaEdit.leavetype);
            if (selectedOptionsDepartmentEdit.length === 0) {
                setPopupContentMalert("Please Select Department");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype == "Please Select Leave Type" || leavecriteriaEdit.leavetype === "" || leavecriteriaEdit.leavetype === undefined) {
                setPopupContentMalert("Please Select Leave Type!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.experience === '') {
                setPopupContentMalert("Please Enter Experience!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && (leavecriteriaEdit.numberofdays == "" || leavecriteriaEdit.numberofdays === undefined || leavecriteriaEdit.numberofdays === "0" || leavecriteriaEdit.numberofdays === 0)) {
                setPopupContentMalert("Please Enter Number of Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && applicablefrommonthEdit === 'Choose Month') {
                setPopupContentMalert("Please Select From Month!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && applicablefromyearEdit === 'Choose Year') {
                setPopupContentMalert("Please Select From Year!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.leaveautocheck === '' || leavecriteriaEdit.leaveautocheck === false) {
                setPopupContentMalert("Please Select Leave Auto Increase Check Box!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.leaveautocheck === true && leavecriteriaEdit.leaveautoincrease === '' || leavecriteriaEdit.leaveautoincrease === 0) {
                setPopupContentMalert("Please Enter Increase Value!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.tookleavecheck === true && selectedOptionsDayEdit.length === 0) {
                setPopupContentMalert("Please Select Day!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.applydays === "") {
                setPopupContentMalert("Please Enter Apply Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.tookleavecheck && leavecriteriaEdit.lopdays === 'Choose LOP') {
                setPopupContentMalert("Please Select LOP Calculation!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.tookleavecheck && tookLeaveEdit.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype === "No Call/No Show" && tookLeaveEdit.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (todoSubmit === true) {
                setPopupContentMalert("Please Update the todo and Submit!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditRequest()
            }
        } else if (leavecriteriaEdit.mode == "Designation") {
            let desigs = selectedOptionsDesignationEdit.map((item) => item.value);
            let isNameMatch = leavecriteriasAllEdit.some((data) => data.designation.some((item) => desigs.includes(item)) && data.leavetype == leavecriteriaEdit.leavetype);
            if (selectedOptionsDesignationEdit.length === 0) {
                setPopupContentMalert("Please Select Designation");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype == "Please Select Leave Type" || leavecriteriaEdit.leavetype === "" || leavecriteriaEdit.leavetype === undefined) {
                setPopupContentMalert("Please Select Leave Type!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.experience === '') {
                setPopupContentMalert("Please Enter Experience!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && (leavecriteriaEdit.numberofdays == "" || leavecriteriaEdit.numberofdays === undefined || leavecriteriaEdit.numberofdays === "0" || leavecriteriaEdit.numberofdays === 0)) {
                setPopupContentMalert("Please Enter Number of Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && applicablefrommonthEdit === 'Choose Month') {
                setPopupContentMalert("Please Select From Month!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && applicablefromyearEdit === 'Choose Year') {
                setPopupContentMalert("Please Select From Year!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.leaveautocheck === '' || leavecriteriaEdit.leaveautocheck === false) {
                setPopupContentMalert("Please Select Leave Auto Increase Check Box!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.leaveautocheck === true && leavecriteriaEdit.leaveautoincrease === '' || leavecriteriaEdit.leaveautoincrease === 0) {
                setPopupContentMalert("Please Enter Increase Value!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.tookleavecheck === true && selectedOptionsDayEdit.length === 0) {
                setPopupContentMalert("Please Select Day!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.applydays === "") {
                setPopupContentMalert("Please Enter Apply Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype !== "No Call/No Show" && leavecriteriaEdit.tookleavecheck && leavecriteriaEdit.lopdays === 'Choose LOP') {
                setPopupContentMalert("Please Select LOP Calculation!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.tookleavecheck && tookLeaveEdit.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (leavecriteriaEdit.leavetype === "No Call/No Show" && tookLeaveEdit.length === 0) {
                setPopupContentMalert("Please Select Leave Block Days!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (todoSubmit === true) {
                setPopupContentMalert("Please Update the todo and Submit!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditRequest()
            }
        }
        else {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteria = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const itemsWithSerialNumber = res_vendor?.data?.leavecriterias?.map((item, index) => (
                {
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    company: item.company.join(", "),
                    branch: item.branch.join(", "),
                    unit: item.unit.join(", "),
                    team: item.team.join(", "),
                    employee: item.employee.join(", "),
                    department: item.department.join(", "),
                    designation: item.designation.join(", "),
                    leavetype: item.leavetype,
                    numberofdays: item.numberofdays,
                    applicablefrommonth: item.applicablefrommonth === "Choose Month" ? "" : item.applicablefrommonth,
                    applicablefromyear: item.applicablefromyear === "Choose Year" ? "" : item.applicablefromyear,
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
                }));
            setLeavecriterias(itemsWithSerialNumber);
            setLeavecriteriacheck(true);
            setTotalPagesLeaveCrit(Math.ceil(itemsWithSerialNumber.length / pageSizeLeaveCrit));
        } catch (err) { setLeavecriteriacheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteriaAll = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setLeavecriteriasAll(res_vendor?.data?.leavecriterias);
            setLeavecriteriasAllEdit(res_vendor?.data?.leavecriterias.filter((data) => data._id != leavecriteriaEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    // useEffect(() => {
    //     // getexcelDatas();
    // }, [leavecriteriaEdit, leavecriteria, leavecriterias]);

    useEffect(() => {
        fetchLeavecriteria();
    }, []);

    useEffect(() => {
        fetchLeavecriteriaAll();
    }, []);

    // useEffect(() => {
    //     fetchCompanyAll();
    // }, [selectedOptionsCompany, participantsOption]);

    useEffect(() => {
        fetchCompanyAll();
    }, []);

    useEffect(() => {
        fetchParticipants();
    }, []);

    useEffect(() => {
        fetchBranchAll();
        fetchUnitAll();
        // fetchTeamAll();
        fetchDepartmentAll();
        fetchDesignationAll();
        fetchLeaveTypesAll();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {
        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(leavecriterias);
    }, [leavecriterias]);

    // Split the search query into individual terms
    const searchTerms = searchQueryLeaveCrit.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    // Pagination for outer filter
    const filteredData = filteredDatas?.slice((pageLeaveCrit - 1) * pageSizeLeaveCrit, pageLeaveCrit * pageSizeLeaveCrit);
    const totalPagesLeaveCritOuter = Math.ceil(filteredDatas?.length / pageSizeLeaveCrit);
    const visiblePages = Math.min(totalPagesLeaveCritOuter, 3);
    const firstVisiblePage = Math.max(1, pageLeaveCrit - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesLeaveCritOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageLeaveCrit * pageSizeLeaveCrit;
    const indexOfFirstItem = indexOfLastItem - pageSizeLeaveCrit;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const columnDataTableLeaveCrit = [
        {
            field: "checkbox",
            headerName: "",
            headerStyle: { fontWeight: "bold", },
            sortable: false,
            width: 75,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibilityLeaveCrit.checkbox,
            pinned: "left",
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityLeaveCrit.serialNumber, },
        { field: "department", headerName: "Department", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.department, headerClassName: "bold-header" },
        { field: "designation", headerName: "Designation", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.designation, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.employee, headerClassName: "bold-header" },
        { field: "leavetype", headerName: "Leavetype", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavetype, headerClassName: "bold-header" },
        { field: "numberofdays", headerName: "Number of Days", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.numberofdays, headerClassName: "bold-header" },
        { field: "experience", headerName: "Experience", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.experience, headerClassName: "bold-header" },
        { field: "experiencein", headerName: "Experience In", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.experiencein, headerClassName: "bold-header" },
        { field: "applicablefrommonth", headerName: "Applicable From (Month)", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.applicablefrommonth, headerClassName: "bold-header" },
        { field: "applicablefromyear", headerName: "Applicable From (Year)", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.applicablefromyear, headerClassName: "bold-header" },
        { field: "leaveautocheck", headerName: "Leave Auto Increase", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leaveautocheck, headerClassName: "bold-header" },
        { field: "leaveautoincrease", headerName: "Increase", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leaveautoincrease, headerClassName: "bold-header" },
        { field: "leaveautodays", headerName: "Days Per", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leaveautodays, headerClassName: "bold-header" },
        { field: "pendingleave", headerName: "Pending Leave Carry", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.pendingleave, headerClassName: "bold-header" },
        // { field: "pendingfrommonth", headerName: "Pending Frommonth", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.pendingfrommonth, headerClassName: "bold-header" },
        // { field: "pendingfromdate", headerName: "Pending Fromdate", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.pendingfromdate, headerClassName: "bold-header" },
        // { field: "leavecalculation", headerName: "Leave Calculation Period", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavecalculation, headerClassName: "bold-header" },
        // { field: "leavefrommonth", headerName: "Leave Frommonth", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavefrommonth, headerClassName: "bold-header" },
        // { field: "leavefromdate", headerName: "Leave Fromdate", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavefromdate, headerClassName: "bold-header" },
        // { field: "leavetomonth", headerName: "Leave Tomonth", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavetomonth, headerClassName: "bold-header" },
        // { field: "leavetodate", headerName: "Leave Todate", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavetodate, headerClassName: "bold-header" },
        { field: "tookleavecheck", headerName: "Took Leave", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.tookleavecheck, headerClassName: "bold-header" },
        // { field: "tookleave", headerName: "Took Leave Day", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.tookleave, headerClassName: "bold-header" },
        // { field: "applicablesalary", headerName: "Applicable For Salary", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.applicablesalary, headerClassName: "bold-header" },
        { field: "fullsalary", headerName: "Full Salary", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.fullsalary, headerClassName: "bold-header" },
        { field: "halfsalary", headerName: "Half Salary", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.halfsalary, headerClassName: "bold-header" },

        { field: "leaverespecttoweekoff", headerName: "Leave Respect to Weekoff", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leaverespecttoweekoff, headerClassName: "bold-header" },
        { field: "leaverespecttotraining", headerName: "Leave Respect to Training", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leaverespecttotraining, headerClassName: "bold-header" },
        { field: "uninformedleave", headerName: "Uninformed Leave", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.uninformedleave, headerClassName: "bold-header" },
        { field: "uninformedleavecount", headerName: "Uninformed Leave Count", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.uninformedleavecount, headerClassName: "bold-header" },
        { field: "leavefornoticeperiod", headerName: "Leave for Notice Period", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavefornoticeperiod, headerClassName: "bold-header" },
        { field: "leavefornoticeperiodcount", headerName: "Notice period Leave count", flex: 0, width: 90, hide: !columnVisibilityLeaveCrit.leavefornoticeperiodcount, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 280,
            minHeight: "40px !important",
            filter: false,
            sortable: false,
            hide: !columnVisibilityLeaveCrit.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Box>
                        {isUserRoleCompare?.includes("eleavecriteria") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCode(params.data.id, params.data.name);
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("dleavecriteria") && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.data.id, params.data.name);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("vleavecriteria") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getviewCode(params.data.id);
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("ileavecriteria") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getinfoCode(params.data.id);
                                }}
                            >
                                <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                            </Button>
                        )}
                    </Box>
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
        };
    });

    // Datatable
    const handlePageSizeChange = (e) => {
        setPageSizeLeaveCrit(Number(e.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPageLeaveCrit(1);
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityLeaveCrit };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityLeaveCrit(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityLeaveCrit");
        if (savedVisibility) {
            setColumnVisibilityLeaveCrit(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityLeaveCrit", JSON.stringify(columnVisibilityLeaveCrit));
    }, [columnVisibilityLeaveCrit]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableLeaveCrit.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageLeaveCrit.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibilityLeaveCrit((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = [
        "Department", "Designation", "Company", "Branch",
        "Unit", "Team", "Employee", "Leavetype", "Number of Days", "Experience", "Experience In",
        "Applicable From (Month)", "Applicable From (Year)", "Leave Auto Increase",
        "Increase", "Days Per", "Pending Leave Carry",
        "Took Leave", "Leaves Respect to Weekoff",
        "Leaves Respect to Training", "Uninformed Leave",
        "Uninformed Leave Count",
        "Leave For Notice Period",
        "Leave For Notice Period Count",
    ]
    let exportRowValuescrt = [
        'department', 'designation', 'company', 'branch',
        'unit', 'team', 'employee', 'leavetype', 'numberofdays', 'experience', 'experiencein',
        'applicablefrommonth', 'applicablefromyear', 'leaveautocheck',
        'leaveautoincrease', 'leaveautodays', 'pendingleave',
        'tookleavecheck', 'leaverespecttoweekoff',
        'leaverespecttotraining', 'uninformedleave',
        'uninformedleavecount',
        'leavefornoticeperiod',
        'leavefornoticeperiodcount',
    ]

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Leave Control Criteria",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageLeaveCrit.current) {
            domtoimage.toBlob(gridRefImageLeaveCrit.current)
                .then((blob) => {
                    saveAs(blob, "Leave Control Criteria.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Leave Control Criteria"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Leave Control Criteria"
                modulename="Leave&Permission"
                submodulename="Leave"
                mainpagename="Leave Criteria"
                subpagename=""
                subsubpagename=""
            />
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit))
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeam}
                                                    onChange={(e) => {
                                                        handleTeamChange(e);
                                                        fetchParticipants();
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
                                                        Department <b style={{ color: "red" }}>*</b>
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
                                                setLeavecriteria({
                                                    ...leavecriteria, leavetype: e.value,
                                                    sunday: false, monday: false, tuesday: false,
                                                    wednesday: false, thursday: false, friday: false, saturday: false,
                                                });
                                                setTookLeave([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={7.5}></Grid>
                            </Grid>
                            <br /> <br />
                            {leavecriteria.leavetype !== 'No Call/No Show' ?
                                <>
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
                                            <Typography>Experience <b style={{ color: 'red' }}>*</b></Typography>
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
                                        <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                            <Typography>From Month <b style={{ color: 'red' }}>*</b></Typography>
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
                                                    value={applicablefrommonth}
                                                    onChange={(e) => {
                                                        setApplicablefrommonth(e.target.value);
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
                                                    <MenuItem value="November"> {"November"} </MenuItem>
                                                    <MenuItem value="December"> {"December"} </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                            <Typography>From Year <b style={{ color: 'red' }}>*</b></Typography>
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
                                                    value={applicablefromyear}
                                                    onChange={(e) => {
                                                        setApplicablefromyear(e.target.value);
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
                                            <Typography>Increase <b style={{ color: 'red' }}>*</b></Typography>
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
                                                            setPopupContentMalert("Please Enter Value less than 3");
                                                            setPopupSeverityMalert("warning");
                                                            handleClickOpenPopupMalert();
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
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={12} xs={12} sm={12}>
                                                    <Typography><b>Branch Limit</b></Typography>
                                                </Grid>
                                            </Grid><br />
                                            <Grid container spacing={2}>
                                                <Grid item md={1} xs={12} sm={6}>
                                                    <Checkbox
                                                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                        checked={leavecriteria.branchlimitcheck}
                                                        value={leavecriteria.branchlimitcheck}
                                                        onChange={(e) => {
                                                            setLeavecriteria({ ...leavecriteria, branchlimitcheck: !leavecriteria.branchlimitcheck, });
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                                    {leavecriteria.branchlimitcheck ? <span>Yes</span> : <span>No</span>}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={12} xs={12} sm={12}>
                                                    <Typography><b>Apply Days Restriction</b> <b style={{ color: "red" }}>*</b></Typography>
                                                </Grid>
                                            </Grid><br />
                                            <Grid container spacing={2}>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            type="number"
                                                            sx={userStyle.input}
                                                            value={leavecriteria.applydays}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;

                                                                if (/^\d{0,2}$/.test(inputValue)) {
                                                                    setLeavecriteria({ ...leavecriteria, applydays: e.target.value });
                                                                }
                                                                // if (e.target.value > 3) {
                                                                //     setPopupContentMalert("Please Enter Value less than 3");
                                                                //     setPopupSeverityMalert("warning");
                                                                //     handleClickOpenPopupMalert();
                                                                // }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
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
                                                            <MenuItem value="November"> {"November"} </MenuItem>
                                                            <MenuItem value="December"> {"December"} </MenuItem>
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
                                            <MenuItem value="November"> {"November"} </MenuItem>
                                            <MenuItem value="December"> {"December"} </MenuItem>
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
                                            <MenuItem value="November"> {"November"} </MenuItem>
                                            <MenuItem value="December"> {"December"} </MenuItem>
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
                                                        tookleavecheck: !leavecriteria.tookleavecheck,
                                                        lopdays: 'Choose LOP'
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={1} xs={12} sm={12} marginTop={2}>
                                            {leavecriteria.tookleavecheck ? (
                                                <span>Yes</span>
                                            ) : (
                                                <span>No</span>
                                            )}
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                            <Typography>Week Start Day</Typography>
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
                                        {leavecriteria.tookleavecheck ?
                                            <>
                                                <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                                    <Typography>LOP Calculation <b style={{ color: "red" }}>*</b></Typography>
                                                </Grid>
                                                <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                                    <FormControl fullWidth size="small">
                                                        <Selects
                                                            size="small"
                                                            options={lopOptions}
                                                            value={{ label: leavecriteria.lopdays, value: leavecriteria.lopdays, }}
                                                            onChange={(e) => setLeavecriteria({ ...leavecriteria, lopdays: e.value, })}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </> : null}
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
                                </>
                                :
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
                            }
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
                            <Grid container spacing={1}>
                                <Grid item lg={1} md={2} sm={2} xs={12} >
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <LoadingButton loading={btnSubmit} variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                                            Submit
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                            Clear
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )
            } <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lleavecriteria") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Leave Control Criteria List</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizeLeaveCrit}
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
                                            <MenuItem value={items?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box>
                                        {isUserRoleCompare?.includes("excelleavecriteria") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvleavecriteria") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
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
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
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
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableLeaveCrit}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPageLeaveCrit}
                                        maindatas={leavecriterias}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQueryLeaveCrit}
                                        setSearchQuery={setSearchQueryLeaveCrit}
                                        paginated={false}
                                        totalDatas={leavecriterias}
                                    />
                                </Grid>
                            </Grid>   <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsLeaveCrit}> Manage Columns  </Button>&ensp;
                            {isUserRoleCompare?.includes("bdleavecriteria") && (
                                <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                                    Bulk Delete
                                </Button>)}<br /><br />
                            {!leavecriteriaCheck ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>

                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageLeaveCrit} >
                                        <AggridTable
                                            rowDataTable={rowDataTable}
                                            columnDataTable={columnDataTableLeaveCrit}
                                            columnVisibility={columnVisibilityLeaveCrit}
                                            page={pageLeaveCrit}
                                            setPage={setPageLeaveCrit}
                                            pageSize={pageSizeLeaveCrit}
                                            totalPages={totalPagesLeaveCrit}
                                            setColumnVisibility={setColumnVisibilityLeaveCrit}
                                            isHandleChange={isHandleChange}
                                            items={items}
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            gridRefTable={gridRefTableLeaveCrit}
                                            gridRefTableImg={gridRefImageLeaveCrit}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            itemsList={leavecriterias}
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    </>
                )
            }

            {/* Manage Column */}
            <Popover
                id={idLeaveCrit}
                open={isManageColumnsOpenLeaveCrit}
                anchorEl={anchorElLeaveCrit}
                onClose={handleCloseManageColumnsLeaveCrit}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsLeaveCrit}
                    searchQuery={searchQueryManageLeaveCrit}
                    setSearchQuery={setSearchQueryManageLeaveCrit}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityLeaveCrit}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityLeaveCrit}
                    initialColumnVisibility={initialColumnVisibilityLeaveCrit}
                    columnDataTable={columnDataTableLeaveCrit}
                />
            </Popover>

            {/* Edit DIALOG */}
            <Dialog
                open={isEditOpen}
                onClose={handleCloseModEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{
                    // overflow: 'visible',
                    // '& .MuiPaper-root': {
                    //     overflow: 'visible',
                    // },
                    marginTop: '95px'
                }}
            >
                <DialogContent sx={{ width: "auto" }}>
                    {/* <Box sx={{ padding: '20px', width: '850px' }}> */}
                    <>
                        {/* <form onSubmit={editSubmit}> */}
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
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
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
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        valueCompanyCatEdit?.includes(comp.company)
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
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
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        valueCompanyCatEdit?.includes(comp.company) && valueBranchCatEdit?.includes(comp.branch)
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
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
                                                options={allTeam
                                                    ?.filter((u) => valueCompanyCatEdit?.includes(u.company) && valueBranchCatEdit?.includes(u.branch) && valueUnitCatEdit?.includes(u.unit))
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
                                                    Department <b style={{ color: "red" }}>*</b>
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
                                            setLeavecriteriaEdit({
                                                ...leavecriteriaEdit, leavetype: e.value,
                                                // sunday: false, monday: false, tuesday: false,
                                                // wednesday: false, thursday: false, friday: false, saturday: false,
                                            });
                                            // setTookLeaveEdit([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        {leavecriteriaEdit.leavetype !== 'No Call/No Show' ?
                            <>
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
                                        <Typography>Experience <b style={{ color: 'red' }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
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
                                    <Grid item md={2} xs={12} sm={12}>
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
                                    <Grid item md={2} xs={12} sm={12}>
                                        <Typography>Number of Days <b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={6}>
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
                                <Grid container spacing={2}>
                                    <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Month <b style={{ color: 'red' }}>*</b></Typography>
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
                                                value={applicablefrommonthEdit}
                                                onChange={(e) => {
                                                    setApplicablefrommonthEdit(e.target.value);
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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Year <b style={{ color: 'red' }}>*</b></Typography>
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
                                                value={applicablefromyearEdit}
                                                onChange={(e) => {
                                                    setApplicablefromyearEdit(e.target.value);
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
                                        <Typography>Increase <b style={{ color: 'red' }}>*</b></Typography>
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
                                                        setPopupContentMalert("Please Enter Value less than 3");
                                                        setPopupSeverityMalert("warning");
                                                        handleClickOpenPopupMalert();
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
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={12} xs={12} sm={12}>
                                                <Typography><b>Branch Limit</b></Typography>
                                            </Grid>
                                        </Grid><br />
                                        <Grid container spacing={2}>
                                            <Grid item md={1} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={leavecriteriaEdit.branchlimitcheck}
                                                    value={leavecriteriaEdit.branchlimitcheck}
                                                    onChange={(e) => {
                                                        setLeavecriteriaEdit({ ...leavecriteriaEdit, branchlimitcheck: !leavecriteriaEdit.branchlimitcheck, });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                                {leavecriteriaEdit.branchlimitcheck ? <span>Yes</span> : <span>No</span>}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={12} xs={12} sm={12}>
                                                <Typography><b>Apply Days Restriction</b> <b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                        </Grid><br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        sx={userStyle.input}
                                                        value={leavecriteriaEdit.applydays}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;

                                                            if (/^\d{0,2}$/.test(inputValue)) {
                                                                setLeavecriteriaEdit({ ...leavecriteriaEdit, applydays: e.target.value });
                                                            }
                                                            // if (e.target.value > 3) {
                                                            //     setPopupContentMalert("Please Enter Value less than 3");
                                                            //     setPopupSeverityMalert("warning");
                                                            //     handleClickOpenPopupMalert();
                                                            // }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid><br />
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
                                                        <MenuItem value="November"> {"November"} </MenuItem>
                                                        <MenuItem value="December"> {"December"} </MenuItem>
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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
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
                                </Grid><br />

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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
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
                                    <Grid item md={1} xs={12} sm={12} marginTop={2}>
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
                                    {leavecriteriaEdit.tookleavecheck ?
                                        <>
                                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                                <Typography>LOP Calculation <b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        size="small"
                                                        options={lopOptions}
                                                        value={{ label: leavecriteriaEdit.lopdays, value: leavecriteriaEdit.lopdays, }}
                                                        onChange={(e) => setLeavecriteriaEdit({ ...leavecriteriaEdit, lopdays: e.value, })}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </> : null}
                                </Grid><br />
                                {leavecriteriaEdit.tookleavecheck ?
                                    <Grid container spacing={2}>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={1.5} sm={12} xs={12}>
                                                    <Typography><b>Year</b></Typography>
                                                </Grid>
                                                <Grid item md={1.5} sm={12} xs={12}>
                                                    <Typography><b>Month</b></Typography>
                                                </Grid>
                                                <Grid item md={1.5} sm={12} xs={12}>
                                                    <Typography><b>Week</b></Typography>
                                                </Grid>
                                                <Grid item md={3.5} sm={12} xs={12}>
                                                    <Typography><b>Day</b></Typography>
                                                </Grid>
                                            </Grid><br />

                                            {todosCheck?.length > 0 &&
                                                todosCheck.map((todo, index) => {
                                                    const todoMonthIndex = monthstring.indexOf(todo.month);
                                                    const todoWeekNumber = parseInt(todo.week.match(/\d+/)[0], 10);
                                                    const isFutureMonth = (parseInt(todo.year) > currentYear) || (parseInt(todo.year) === currentYear && todoMonthIndex > currentMonthIndex);
                                                    const isFutureWeek = (parseInt(todo.year) === currentYear && todoMonthIndex === currentMonthIndex && todoWeekNumber > currentWeek);

                                                    return (
                                                        < div key={index} >
                                                            {editingIndexCheck === index ? (
                                                                <Grid container spacing={2}>
                                                                    <Grid item md={1.5} sm={6} xs={12}>
                                                                        <Typography>{todo.year}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={1.5} sm={6} xs={12}>
                                                                        <Typography>{todo.month}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={1.5} sm={6} xs={12} >
                                                                        <Typography>{todo.week}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                                        <FormControl size="small" sx={{ width: "100%", maxWidth: "400px" }}>
                                                                            <MultiSelect
                                                                                options={days}
                                                                                value={selectedOptionsDayEdit}
                                                                                onChange={handleDayChangeEdit}
                                                                                valueRenderer={customValueRendererDayEdit}
                                                                                labelledBy="Please Select Branch"
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={1} sm={1} xs={1}>
                                                                        <Button
                                                                            variant="contained"
                                                                            style={{
                                                                                minWidth: "20px",
                                                                                minHeight: "41px",
                                                                                background: "transparent",
                                                                                boxShadow: "none",
                                                                                marginTop: "-3px !important",
                                                                                "&:hover": {
                                                                                    background: "#f4f4f4",
                                                                                    borderRadius: "50%",
                                                                                    minHeight: "41px",
                                                                                    minWidth: "20px",
                                                                                    boxShadow: "none",
                                                                                },
                                                                            }}
                                                                            onClick={() => { handleUpdateTodoCheck(); setTodoSubmit(false) }}
                                                                        >
                                                                            <CheckCircleIcon
                                                                                style={{
                                                                                    color: "#216d21",
                                                                                    fontSize: "1.5rem",
                                                                                }}
                                                                            />
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item md={1} sm={1} xs={1}>
                                                                        <Button
                                                                            variant="contained"
                                                                            style={{
                                                                                minWidth: "20px",
                                                                                minHeight: "41px",
                                                                                background: "transparent",
                                                                                boxShadow: "none",
                                                                                marginTop: "-3px !important",
                                                                                "&:hover": {
                                                                                    background: "#f4f4f4",
                                                                                    borderRadius: "50%",
                                                                                    minHeight: "41px",
                                                                                    minWidth: "20px",
                                                                                    boxShadow: "none",
                                                                                },
                                                                            }}
                                                                            onClick={() => { setEditingIndexCheck(-1); setTodoSubmit(false); }}
                                                                        >
                                                                            <CancelIcon
                                                                                style={{
                                                                                    color: "#b92525",
                                                                                    fontSize: "1.5rem",
                                                                                }}
                                                                            />
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            ) : (
                                                                <Grid container spacing={2}>
                                                                    <Grid item md={1.5} sm={6} xs={12}>
                                                                        <Typography>{todo.year}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={1.5} sm={6} xs={12}>
                                                                        <Typography>{todo.month}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={1.5} sm={6} xs={12}>
                                                                        <Typography>{todo.week}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={3.5} sm={6} xs={12} sx={{ maxWidth: '150px' }}>
                                                                        <Box sx={{ wordWrap: 'break-word' }}>
                                                                            <Typography>{todo.day.join(',')}</Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    {(isFutureMonth || isFutureWeek) ? (
                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                            <Button
                                                                                variant="contained"
                                                                                style={{
                                                                                    minWidth: "20px",
                                                                                    // minHeight: "41px",
                                                                                    background: "transparent",
                                                                                    boxShadow: "none",
                                                                                    marginTop: "-13px !important",
                                                                                    "&:hover": {
                                                                                        background: "#f4f4f4",
                                                                                        borderRadius: "50%",
                                                                                        minHeight: "41px",
                                                                                        minWidth: "20px",
                                                                                        boxShadow: "none",
                                                                                    },
                                                                                }}
                                                                                onClick={() => { handleEditTodoCheck(index); setTodoSubmit(true); }}
                                                                            >
                                                                                <FaEdit
                                                                                    style={{
                                                                                        color: "#1976d2",
                                                                                        fontSize: "1.2rem",
                                                                                    }}
                                                                                />
                                                                            </Button>
                                                                        </Grid>
                                                                    ) : null}
                                                                    {/* <Grid item md={1} sm={6} xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-13px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteTodoCheck(index)}
                                                            >
                                                                <FaTrash
                                                                    style={{
                                                                        color: "#b92525",
                                                                        fontSize: "1.2rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid> */}
                                                                </Grid>
                                                            )}
                                                            <br />
                                                        </div>
                                                    )
                                                })}
                                        </Grid>
                                    </Grid>
                                    : null}
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
                                {/* <br /> <br /> */}

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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
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
                                                <MenuItem value="November"> {"November"} </MenuItem>
                                                <MenuItem value="December"> {"December"} </MenuItem>
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
                            </>
                            :
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={1.5} sm={12} xs={12}>
                                            <Typography><b>Year</b></Typography>
                                        </Grid>
                                        <Grid item md={1.5} sm={12} xs={12}>
                                            <Typography><b>Month</b></Typography>
                                        </Grid>
                                        <Grid item md={1.5} sm={12} xs={12}>
                                            <Typography><b>Week</b></Typography>
                                        </Grid>
                                        <Grid item md={3.5} sm={12} xs={12}>
                                            <Typography><b>Day</b></Typography>
                                        </Grid>
                                    </Grid><br />

                                    {todosCheck?.length > 0 &&
                                        todosCheck.map((todo, index) => {
                                            const todoMonthIndex = monthstring.indexOf(todo.month);
                                            const todoWeekNumber = parseInt(todo.week.match(/\d+/)[0], 10);
                                            const isFutureMonth = (parseInt(todo.year) > currentYear) || (parseInt(todo.year) === currentYear && todoMonthIndex > currentMonthIndex);
                                            const isFutureWeek = (parseInt(todo.year) === currentYear && todoMonthIndex === currentMonthIndex && todoWeekNumber > currentWeek);

                                            return (
                                                < div key={index} >
                                                    {editingIndexCheck === index ? (
                                                        <Grid container spacing={2}>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.year}</Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.month}</Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={6} xs={12} >
                                                                <Typography>{todo.week}</Typography>
                                                            </Grid>
                                                            <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                                <FormControl size="small" sx={{ width: "100%", maxWidth: "400px" }}>
                                                                    <MultiSelect
                                                                        options={days}
                                                                        value={selectedOptionsDayEdit}
                                                                        onChange={handleDayChangeEdit}
                                                                        valueRenderer={customValueRendererDayEdit}
                                                                        labelledBy="Please Select Branch"
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={1} sm={1} xs={1}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: "20px",
                                                                        minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        marginTop: "-3px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={() => { handleUpdateTodoCheck(); setTodoSubmit(false) }}
                                                                >
                                                                    <CheckCircleIcon
                                                                        style={{
                                                                            color: "#216d21",
                                                                            fontSize: "1.5rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                            <Grid item md={1} sm={1} xs={1}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: "20px",
                                                                        minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        marginTop: "-3px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={() => { setEditingIndexCheck(-1); setTodoSubmit(false); }}
                                                                >
                                                                    <CancelIcon
                                                                        style={{
                                                                            color: "#b92525",
                                                                            fontSize: "1.5rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    ) : (
                                                        <Grid container spacing={2}>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.year}</Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.month}</Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.week}</Typography>
                                                            </Grid>
                                                            <Grid item md={3.5} sm={6} xs={12} sx={{ maxWidth: '150px' }}>
                                                                <Box sx={{ wordWrap: 'break-word' }}>
                                                                    <Typography>{todo.day.join(',')}</Typography>
                                                                </Box>
                                                            </Grid>
                                                            {(isFutureMonth || isFutureWeek) ? (
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            // minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { handleEditTodoCheck(index); setTodoSubmit(true); }}
                                                                    >
                                                                        <FaEdit
                                                                            style={{
                                                                                color: "#1976d2",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            ) : null}
                                                            {/* <Grid item md={1} sm={6} xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-13px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteTodoCheck(index)}
                                                            >
                                                                <FaTrash
                                                                    style={{
                                                                        color: "#b92525",
                                                                        fontSize: "1.2rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid> */}
                                                        </Grid>
                                                    )}
                                                    <br />
                                                </div>
                                            )
                                        })}
                                </Grid>
                            </Grid>
                        }

                        <Grid container spacing={1}>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                        Update
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        {/* </DialogContent> */}
                        {/* </form> */}
                    </>
                    {/* </Box> */}
                </DialogContent>
            </Dialog>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '95px' }}>
                {/* <Box sx={{ padding: '30px 70px', width:"1000px" }}> */}
                <DialogContent sx={{ width: "1200px" }}>
                    <>
                        <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                            <Typography sx={userStyle.HeaderText}>
                                <b>View Leave Control Criteria</b>{" "}
                            </Typography>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Box>
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
                        {leavecriteriaEdit.leavetype !== 'No Call/No Show' ?
                            <>
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
                                    <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Month </Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                sx={userStyle.input}
                                                value={applicablefrommonthEdit}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12} marginTop={2}>
                                        <Typography>From Year </Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12} marginTop={2}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                sx={userStyle.input}
                                                value={applicablefromyearEdit}
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
                                            <b>Branch Limit</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={0.8} xs={12} sm={6}>
                                        <Checkbox
                                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                            checked={leavecriteriaEdit.branchlimitcheck}
                                            value={leavecriteriaEdit.branchlimitcheck}
                                        />
                                    </Grid>
                                    <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                                        {leavecriteriaEdit.branchlimitcheck ? <span>Yes</span> : <span>No</span>}
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
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography><b>Year</b></Typography>
                                            </Grid>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography><b>Month</b></Typography>
                                            </Grid>
                                            <Grid item md={1.5} sm={12} xs={12}>
                                                <Typography><b>Week</b></Typography>
                                            </Grid>
                                            <Grid item md={3.5} sm={12} xs={12}>
                                                <Typography><b>Day</b></Typography>
                                            </Grid>
                                        </Grid><br />

                                        {todosCheck?.length > 0 &&
                                            todosCheck.map((todo, index) => {
                                                return (
                                                    < div key={index} >
                                                        <Grid container spacing={2}>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.year}</Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={6} xs={12}>
                                                                <Typography>{todo.month}</Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={6} xs={12} >
                                                                <Typography>{todo.week}</Typography>
                                                            </Grid>
                                                            <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                                <FormControl size="small" sx={{ width: "100%", maxWidth: "400px" }}>
                                                                    <Typography>{todo.day.join(', ')}</Typography>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                        <br />
                                                    </div>
                                                )
                                            })}
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
                            </>
                            :
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={1.5} sm={12} xs={12}>
                                            <Typography><b>Year</b></Typography>
                                        </Grid>
                                        <Grid item md={1.5} sm={12} xs={12}>
                                            <Typography><b>Month</b></Typography>
                                        </Grid>
                                        <Grid item md={1.5} sm={12} xs={12}>
                                            <Typography><b>Week</b></Typography>
                                        </Grid>
                                        <Grid item md={3.5} sm={12} xs={12}>
                                            <Typography><b>Day</b></Typography>
                                        </Grid>
                                    </Grid><br />

                                    {todosCheck?.length > 0 &&
                                        todosCheck.map((todo, index) => {
                                            return (
                                                < div key={index} >
                                                    <Grid container spacing={2}>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.year}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.month}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12} >
                                                            <Typography>{todo.week}</Typography>
                                                        </Grid>
                                                        <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                            <FormControl size="small" sx={{ width: "100%", maxWidth: "400px" }}>
                                                                <Typography>{todo.day.join(', ')}</Typography>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    <br />
                                                </div>
                                            )
                                        })}
                                </Grid>
                            </Grid>
                        }
                        <Grid container spacing={1}>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </DialogContent>
            </Dialog>

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
                itemsTwo={leavecriterias ?? []}
                filename={"Leave Control Criteria"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delLeavecriteria}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delLeavecheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Leave Control Criteria Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box >
    );
}

export default LeaveCriteria;