import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import ExportData from "../../components/ExportData";
import domtoimage from 'dom-to-image';

function PayRunControlReportPage() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    let exportColumnNames = [
        'Company',
        'Employee Status',
        'Department',
        'Branch',
        'Unit',
        'Team',
        'Employee Name',
        'achieved',
        'Achieved Symbol',
        'NewGross',
        'Salary Type',
        'Deduction Type'
    ];
    let exportRowValues = [
        'company', 'empstatus',
        'department', 'branch',
        'unit', 'team',
        'empname', 'achieved',
        'achievedsymbol', 'newgross',
        'salraytype', 'deductiontype'
    ];

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
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

    const gridRef = useRef(null);
    const gridRefNeartat = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsNear, setSelectedRowsNear] = useState([]);
    //Datatable neartat
    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [idgrpedit, setidgrpedit] = useState([]);
    const [statusCheck, setStatusCheck] = useState(false);
    const [originaledit, setoriginaledit] = useState([]);

    useEffect(() => {

        getapi();

    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Pay Run Control Report Page"),
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

    const employeestatus = [
        { label: 'Live Employee', value: "Live Employee" },
        { label: 'Releave Employee', value: "Releave Employee" },
        { label: "Absconded", value: "Absconded" },
        { label: "Hold", value: "Hold" },
        { label: "Terminate", value: "Terminate" },
    ];
    const salary = [
        { label: 'Final Salary', value: 'Final Salary' },
        { label: "Fixed Salary", value: "Fixed Salary" },
        { label: "Production Salay", value: "Production Salay" },
        { label: "Whichever is Lower", value: "Whichever is Lower" },
        { label: "Whichever is Higher", value: "Whichever is Higher" },
    ];
    const deduction = [
        { label: 'Actual Deduction', value: "Actual Deduction" },
        { label: "On Value", value: "On Value" },
        { label: "On Penalty", value: "On Penalty" },
        { label: "Minimum Deduction", value: "Minimum Deduction" },
        { label: "Whichever is Lower", value: "Whichever is Lower" },
        { label: "Whichever is Higher", value: "Whichever is Higher" },
    ];
    const [payruncontrol, setPayruncontrol] = useState({
        company: "Please Select Company", empstatus: "Please Select Status",
        filtertype: "Please Select Filter Type",
        choosestatus: "Please Select Type",
        empname: "", userbranch: "", userdepartment: "",
        userunit: "", userteam: "", newgross: "",
        newgrosssymbol: "",
        achievedsymbol: "", achieved: "",
        achievedfrom: "", achievedto: "",
        newgrossfrom: "", newgrossto: "",
        salraytype: "Please Select SalaryType",
        deductiontype: "Please Select DeductionType", addedby: "",
        updatedby: "",
    });

    const [payruncontroledit, setPayruncontroledit] = useState({
        company: "Please Select Company", empstatus: "Please Select Status",
        empname: "", newgross: "", newgrosssymbol: "",
        achievedsymbol: "", achieved: "",
        achievedfrom: "", achievedto: "",
        newgrossfrom: "", newgrossto: "", salraytype: "Please Select SalaryType",
        deductiontype: "Please Select DeductionType", userbranch: "", userdepartment: "", userunit: "", userteam: ""
    });
    const [payruncontrolmaster, setPayruncontrolmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

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
    const { auth } = useContext(AuthContext);
    const [teamsall, setTeamsall] = useState([]);
    const [departmentOpt, setDepartment] = useState([]);
    const [selectedBranchTo, setSelectedBranchTo] = useState([]);
    const [selectedUnitTo, setSelectedUnitTo] = useState([]);
    const [selectedTeamTo, setSelectedTeamTo] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState("Please Select Month");
    const [monthValues, setMonthValues] = useState([]);
    const [selectedYear, setSelectedYear] = useState("Please Select Year")
    const [selectedDepartmentTo, setSelectedDepartmentTo] = useState([]);
    const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);
    const [employeesall, setEmployeesall] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    // page refersh reload
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };

    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
    };

    let today = new Date();
    const currYear = today.getFullYear();
    const years = [];
    for (let year = currYear + 1; year >= currYear - 10; year--) {
        years.push({ value: year, label: year.toString() });
    }


    const [employeenamesDropdown, setEmployeeNamesDropdown] = useState([])
    const [employeenamesDropdownEdit, setEmployeeNamesDropdownEdit] = useState([])
    const [chooseProdOrGross, setChooseProdOrGross] = useState(false);
    const [chooseProdOrGrossEdit, setChooseProdOrGrossEdit] = useState(false);
    const [departmentValues, setDepartmentValues] = useState([])


    const fetchPayRunDetailsBasedOnData = async () => {
        setStatusCheck(true)
        let companiesto = selectedOptionsCompany.map((item) => item.value);
        let branchnamesto = selectedBranchTo.map((item) => item.value);
        let unitnamesto = selectedUnitTo.map((item) => item.value);
        let teamnamesto = selectedTeamTo.map((item) => item.value);
        let departments = selectedDepartmentTo.map((item) => item.value);
        let employeenamesto = selectedEmployeeTo?.map((item) => item.value);
        let filtertype = selectedEmployeeTo?.length > 0 ? "Individual" : departments?.length > 0 ? "Department" :
            selectedTeamTo?.length > 0 ? "Team" : unitnamesto?.length > 0 ? "Unit" : "Branch"
        try {
            let res = await axios.post(SERVICE.FILTER_PAY_RUN_REPORT_DATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: departments,
                company: companiesto,
                branch: branchnamesto,
                unit: unitnamesto,
                team: teamnamesto,
                employeenames: employeenamesto,
                month: selectedMonths,
                filtertype: filtertype,
                yearfiltered: selectedYear,
                empstatus: payruncontrol.empstatus
            });

            const itemsWithSerialNumber = res?.data?.users?.map((item, index) => ({
                ...item, serialNumber: index + 1,
                empname: item?.empname?.length > 0 ? item.empname[0] : "",
                branch: item?.branch?.length > 0 ? item.branch[0] : "",
                unit: item?.unit?.length > 0 ? item.unit[0] : "",
                team: item?.team?.length > 0 ? item.team[0] : "",
                department: item?.department?.length > 0 ? item.department[0] : "",
                finalachieved: (item.newgrosssymbol && (item.achievedfrom || item?.achievedto || item?.achieved)) ? item.achievedsymbol === "Between" ? `${item.achievedsymbol} - ${item.achievedfrom} to ${item.achievedto}` : `${item.achievedsymbol} - ${item.achieved}` : "",
                finalgross: (item.newgrosssymbol && (item.newgrossfrom || item?.newgrossto || item?.newgross)) ? item.newgrosssymbol === "Between" ? `${item.newgrosssymbol} - ${item.newgrossfrom} to ${item.newgrossto}` : `${item.newgrosssymbol} -${item.newgross}` : "",
            }));
            setPayruncontrolmaster(itemsWithSerialNumber);
            setStatusCheck(false)
        }
        catch (err) { setStatusCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    const fetchEmployeeNamesDropdown = async (options, status) => {
        let branch = [];
        let unit = [];
        let teamDrop = [];
        let department = [];
        let company = [];
        let empstatus;


        switch (status) {
            case "empstatus":
                department = [];
                company = [];
                unit = [];
                teamDrop = [];
                empstatus = options;
                break;

            case "company":
                company = options?.length > 0 ? options.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = [];
                unit = [];
                teamDrop = [];
                branch = [];
                break;

            case "department":
                department = options?.length > 0 ? options.map(data => data.value) : [];
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                unit = [];
                teamDrop = [];
                branch = [];
                break;

            case "branch":
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = options?.length > 0 ? options.map(data => data.value) : [];
                unit = [];
                teamDrop = [];
                break;

            case "unit":
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = options?.length > 0 ? options.map(data => data.value) : [];
                teamDrop = [];
                break;

            case "team":
                company = selectedOptionsCompany?.length > 0 ? selectedOptionsCompany.map(data => data.value) : [];
                empstatus = payruncontrol.empstatus;
                department = selectedDepartmentTo?.length > 0 ? selectedDepartmentTo?.map(data => data.value) : []
                branch = selectedBranchTo?.length > 0 ? selectedBranchTo.map(data => data.value) : [];
                unit = selectedUnitTo?.length > 0 ? selectedUnitTo.map(data => data.value) : [];
                teamDrop = options?.length > 0 ? options.map(data => data.value) : [];
                break;

            default:
                company = [];
                department = [];
                branch = [];
                unit = [];
                teamDrop = [];
                empstatus = ""
                break;
        }
        try {

            let res = await axios.post(SERVICE.FILTER_PAY_RUN_REPORT_EMPLOYEE_NAMES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: department,
                company: company,
                branch: branch,
                unit: unit,
                team: teamDrop,
                empstatus: empstatus
            });
            setEmployeeNamesDropdown(res?.data?.users)

        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }

    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);
    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        const data = options?.length > 0 ? options.map((a, index) => {
            return a.value;
        }) : []
        fetchEmployeeNamesDropdown(options, 'company')
        setSelectedOptionsCompany(options);
        // fetchBranchAll(options)
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branchto multiselect dropdown changes
    const handleBranchChangeTo = (options) => {
        setSelectedBranchTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'branch')
        setSelectedUnitTo([]);
        setSelectedEmployeeTo([]);
        setSelectedTeamTo([]);


    };
    const customValueRendererBranchTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unitto multiselect dropdown changes
    const handleUnitChangeTo = (options) => {
        setSelectedUnitTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'unit')
        setSelectedTeamTo([]);
        setSelectedEmployeeTo([]);

    };
    const customValueRendererUnitTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };
    //Teamto multiselect dropdown changes
    const handleTeamChangeTo = (options) => {
        setSelectedTeamTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'team')
        setSelectedEmployeeTo([]);
    };
    const customValueRendererTeamTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    //branchto multiselect dropdown changes
    const handleDepartmentChangeTo = (options) => {
        setSelectedDepartmentTo(options);
        const data = options?.map(data => data?.value)
        fetchEmployeeNamesDropdown(options, 'department')
        setDepartmentValues(data)
        setSelectedEmployeeTo([]);

    };
    const customValueRendererDepartmentTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Department";
    };

    //employee multiselect dropdown changes
    const handleEmployeeChangeTo = (options) => {
        setSelectedEmployeeTo(options);
    };
    const customValueRendererEmployeeTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    const fetchTeamAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTeamsall(res.data.teamsdetails);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchDepartment = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setDepartment([

                ...res?.data?.departmentdetails?.map((t) => ({
                    ...t,
                    label: t.deptname,
                    value: t.deptname,
                })),
            ]);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchEmployeesAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.USER_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployeesall(res.data.usersstatus);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        fetchTeamAll();
        fetchDepartment();
        fetchEmployeesAll();

    }, []);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isErrorOpenpay, setIsErrorOpenpay] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [showAlertpay, setShowAlertpay] = useState();
    const [openview, setOpenview] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenNear, setIsDeleteOpenNear] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsneartat, setItemsNearTat] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allProjectedit, setAllProjectedit] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    useEffect(() => {
        fetchEmployeesAll();
    }, [isEditOpen])


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Payrun Control Report Page.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleCaptureImagenear = () => {
        if (gridRefNeartat.current) {
            html2canvas(gridRefNeartat.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Payrun_Control_Individual.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const handleSelectionChangeNear = (newSelection) => {
        setSelectedRowsNear(newSelection.selectionModel);
    };


    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    const handleClickOpenerrpay = () => {
        setIsErrorOpenpay(true);
    };
    const handleCloseerrpay = async () => {
        setIsErrorOpenpay(false);

    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };


    const [openviewnear, setOpenviewnear] = useState(false);

    // view model
    const handleClickOpenviewnear = () => {
        setOpenviewnear(true);
    };

    const handleCloseviewnear = () => {
        setOpenviewnear(false);
    };

    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    //Delete model
    const handleClickOpenNear = () => {
        setIsDeleteOpenNear(true);
    };
    const handleCloseModNear = () => {
        setIsDeleteOpenNear(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRowsNear.length == 0) {
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

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
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

    // State for manage columns search query
    const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] = useState(false);
    const [anchorElNeartat, setAnchorElNeartat] = useState(null)
    const handleOpenManageColumnsNeartat = (event) => {
        setAnchorElNeartat(event.currentTarget);
        setManageColumnsOpenNeartat(true);
    };
    const handleCloseManageColumnsNeartat = () => {
        setManageColumnsOpenNeartat(false);
        setSearchQueryManageNeartat("")
    };

    const openneartat = Boolean(anchorElNeartat);
    const idneartat = openneartat ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const getRowClassNameNearTat = (params) => {
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
        department: true,
        empstatus: true,
        userdepartment: true,
        userbranch: true,
        userunit: true,
        userteam: true,
        empname: true,
        achieved: true,
        achievedsymbol: true,
        finalgross: true,
        finalachieved: true,
        newgrosssymbol: true,
        salraytype: true,
        deductiontype: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // Show All Columns & Manage Columns
    const initialColumnVisibilityNeartat = {
        serialNumber: true,
        checkbox: true,
        company: true,
        empstatus: true,
        userdepartment: true,
        userbranch: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        userunit: true,
        userteam: true,
        empname: true,
        achieved: true,
        achievedsymbol: true,
        finalgross: true,
        finalachieved: true,
        newgrosssymbol: true,
        salraytype: true,
        deductiontype: true,
        actions: true,
    };
    const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(initialColumnVisibilityNeartat);
    //set function to get particular row
    const rowData = async (id, idgrp) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.spayruncontrol);
            setidgrpedit(idgrp)
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const rowDataNear = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PAYRUNCONTROL_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.spayruncontrol);
            handleClickOpenNear();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    let projectnearid = deleteproject._id;

    const delProjectcheckbox = async () => {
        setPageName(!pageName)
        try {

            const deletePromises = selectedRowsNear?.map((item) => {
                return axios.delete(`${SERVICE.PAYRUNCONTROL_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRowsNear([]);
            setSelectAllCheckedNear(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [isBtn, setIsBtn] = useState(false)



    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        // let departments = selectedDepartmentTo.map((item) => item.value);
        let company = selectedOptionsCompany.map((item) => item.value);
        // let branch = selectedBranchTo.map((item) => item.value);
        // let unit = selectedUnitTo.map((item) => item.value);
        // let team = selectedTeamTo.map((item) => item.value);
        // let empnames = selectedEmployeeTo.map((item) => item.value);
        if (!company?.length > 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (payruncontrol.filtertype === "Please Select Filter Type" || payruncontrol.filtertype === "" || payruncontrol.filtertype === undefined) {

            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (payruncontrol.empstatus === "Please Select Status") {
            setPopupContentMalert("Please Select Employee Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (payruncontrol.filtertype === "Department" && selectedDepartmentTo.length === 0) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(payruncontrol.filtertype) && selectedBranchTo.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (["Individual", "Team", "Unit"]?.includes(payruncontrol.filtertype) && selectedUnitTo.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (selectedTeamTo.length === 0 && ["Individual", "Team"]?.includes(payruncontrol.filtertype)) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (selectedEmployeeTo.length === 0 && ["Individual"]?.includes(payruncontrol.filtertype)) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (selectedMonths === "Please Select Month" || selectedMonths === "" || selectedMonths === undefined) {
            setPopupContentMalert("Please Select Month");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (selectedYear === "Please Select Year" || selectedYear === "") {
            setPopupContentMalert("Please Select Year");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();



        }

        else {
            setSearchQuery("")
            fetchPayRunDetailsBasedOnData();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setPayruncontrol({
            company: "Please Select Company",
            empstatus: "Please Select Status",
            filtertype: "Please Select Filter Type",
            choosestatus: "Please Select Type",
            empname: "", achieved: "", newgross: "",
            achievedsymbol: "",
            salraytype: "Please Select SalaryType", deductiontype: "Please Select DeductionType",
        });
        setSelectedMonths("Please Select Month")
        setMonthValues([])
        setPayruncontrolmaster([])
        setSelectedOptionsCompany([])
        setSelectedYear('Please Select Year')
        setSelectedBranchTo([]);
        setSelectedUnitTo([]);
        setSelectedTeamTo([]);
        setEmployeeNamesDropdown([])
        setSelectedDepartmentTo([]);
        setSelectedEmployeeTo([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
    };

    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;

        setIsEditOpen(false);
        setPayruncontroledit({
            company: "Please Select Company", empstatus: "Please Select Status",
            empname: "", achieved: "", achievedsymbol: "", newgross: "", salraytype: "Please Select SalaryType",
            deductiontype: "Please Select DeductionType"
        })
    };

    const [isEditOpenNear, setIsEditOpenNear] = useState(false);

    //Edit model...
    const handleClickOpenEditNear = () => {
        setIsEditOpenNear(true);
    };
    const handleCloseModEditNear = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenNear(false);
    };

    //Project updateby edit page...
    let updateby = payruncontroledit.updatedby;
    let addedby = payruncontroledit.addedby;

    let projectsid = payruncontroledit._id;






    const [uniqueid, setUniqueid] = useState(0)
    const [payrungrp, setpayrungrp] = useState([])

    const [payrungrpArray, setpayrungrpArray] = useState([])
    const [payruncontrolmasterArray, setPayruncontrolmasterArray] = useState([])

    const fetchPayrunControlArray = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setpayrungrpArray(res_project?.data?.payruncontrol);
            let single = res_project?.data?.payruncontrol

            const uniqueObjects = [];
            const uniqueKeysMap = new Map();

            single.forEach((obj) => {
                const key = `${obj.company}-${obj.empstatus}-${obj.achieved}-${obj.newgross}-${obj.salraytype}-${obj.deductiontype}-${obj.department}-${obj.branch}-${obj.unit}-${obj.team}-${obj.achievedsymbol}`;

                if (!uniqueKeysMap.has(key)) {
                    obj.id = [obj._id];
                    uniqueKeysMap.set(key, obj);
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    existingObj.empname = [...existingObj.empname, ...obj.empname];
                    existingObj.id = existingObj.id.concat(obj._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());
            setPayruncontrolmasterArray(uniqueObjects)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchPayrunControlArray();
    }, [isFilterOpen])

    //get all project.
    const fetchProjMasterAll = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.PAYRUNCONTROLBYASSIGNBRANCH, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllProjectedit(res_project?.data?.payruncontrol.filter((item) => !idgrpedit?.includes(item._id)));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Employee Status", field: "empstatus" },
        { title: "Department", field: "userdepartment" },
        { title: "Branch", field: "userbranch" },
        { title: "Unit", field: "userunit" },
        { title: "Team", field: "userteam" },
        { title: "Employee Name", field: "empname" },
        { title: "achieved", field: "achieved" },
        { title: "Achieved Symbol", field: "achievedsymbol" },
        { title: "NewGross", field: "newgross" },
        { title: "Salary Type", field: "salraytype" },
        { title: "Deduction Type", field: "deductiontype" },
    ];



    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            payruncontrolmasterArray.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: "auto"
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Payrun_Control_Report_list.pdf");
    };


    // pdf.....
    const columnsnear = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Employee Status", field: "empstatus" },
        { title: "Department", field: "userdepartment" },
        { title: "Branch", field: "userbranch" },
        { title: "Unit", field: "userunit" },
        { title: "Team", field: "userteam" },
        { title: "Employee Name", field: "empname" },
        { title: "Production Achieved", field: "finalachieved" },
        { title: "New Gross", field: "finalgross" },
        { title: "Salary Type", field: "salraytype" },
        { title: "Deduction Type", field: "deductiontype" },
    ];


    // Excel
    const fileName = "Payrun_Control_Report_list ";
    const fileNameNear = "Payrun_Control_Individual ";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Payrun_Control_Report_list ",
        pageStyle: "print",
    });



    //serial no for listing items
    const addSerialNumber = (datas) => {
     
        setItems(datas);
        setOverallItems(datas);
    };
    useEffect(() => {
        addSerialNumber(payruncontrolmaster);
    }, [payruncontrolmaster]);



    //serial no for listing items
    const addSerialNumberNearTat = () => {
        const itemsWithSerialNumber = payrungrp?.map((item, index) => ({
            ...item,
            _id: item._id,
            serialNumber: index + 1,

            finalachieved: item.achievedsymbol === "Between" ? `${item.achievedfrom} to ${item.achievedto}` : item.achieved,
            finalgross: item.newgrosssymbol === "Between" ? `${item.newgrossfrom} to ${item.newgrossto}` : item.newgross,
        }));
        setItemsNearTat(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberNearTat();
    }, [payrungrp]);



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
        setPage(1);
    };

    //Datatable
    const handlePageChangeNearTatPrimary = (newPage) => {
        setPageNearTatPrimary(newPage);
    };

    const handlePageSizeChangeNearTatPrimary = (event) => {
        setPageSizeNearTatPrimary(Number(event.target.value));
        setPageNearTatPrimary(1);
    };


    //datatable....
    const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] = useState("");
    const handleSearchChangeNearTatPrimary = (event) => {
        setSearchQueryNearTatPrimary(event.target.value);
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


    const searchOverNearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
        return searchOverNearTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });


    const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice((pageNearTatPrimary - 1) * pageSizeNearTatPrimary, pageNearTatPrimary * pageSizeNearTatPrimary);

    const totalPagesNearTatPrimary = Math.ceil(filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary);

    const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

    const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
    const lastVisiblePageNearTatPrimary = Math.min(Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1), totalPagesNearTatPrimary);


    const pageNumbersNearTatPrimary = [];

    const indexOfLastItemNearTatPrimary = pageNearTatPrimary * pageSizeNearTatPrimary;
    const indexOfFirstItemNearTatPrimary = indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;


    for (let i = firstVisiblePageNearTatPrimary; i <= lastVisiblePageNearTatPrimary; i++) {
        pageNumbersNearTatPrimary.push(i);
    }


    useEffect(() => {
        fetchProjMasterAll();
    }, [isEditOpen, idgrpedit]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );


    const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

    const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
        <div>
            <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
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
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            sortable: false, // Optionally, you can make this column not sortable
            width: 80,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },


        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "empstatus",
            headerName: "Employee Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.empstatus,
            headerClassName: "bold-header",
        },

        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "empname",
            headerName: "Employee Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.empname,
            headerClassName: "bold-header",
        },
        {
            field: "finalachieved",
            headerName: "Production Achieved",
            flex: 0,
            width: 110,
            hide: !columnVisibility.finalachieved,
            headerClassName: "bold-header",
        },
        {
            field: "finalgross",
            headerName: "New Gross",
            flex: 0,
            width: 130,
            hide: !columnVisibility.finalgross,
            headerClassName: "bold-header",
        },
        {
            field: "salraytype",
            headerName: "Salary Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.salraytype,
            headerClassName: "bold-header",
        },
        {
            field: "deductiontype",
            headerName: "Deduction Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.deductiontype,
            headerClassName: "bold-header",
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item.serialNumber,
            idgrp: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empstatus: item.empstatus,
            empname: item.empname,
            empnames: item.empname,
            userdepartment: item.userdepartment,
            userbranch: item.userbranch,
            userunit: item.userunit,
            userteam: item.userteam,
            achieved: item.achievedsymbol + " " + item.achieved,
            achievedsymbol: item.achievedsymbol,
            // newgross: item.newgrosssymbol + " " + item.newgross,
            salraytype: item.salraytype,
            deductiontype: item.deductiontype,
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


    // Show All Columns functionality
    const handleShowAllColumnsNeartat = () => {
        const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
        for (const columnKey in updatedVisibilityNeartat) {
            updatedVisibilityNeartat[columnKey] = true;
        }
        setColumnVisibilityNeartat(updatedVisibilityNeartat);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityNeartat = (field) => {
        setColumnVisibilityNeartat((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };



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
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Department": t.userdepartment[0],
                    "Branch": t.userbranch[0],
                    "Unit": t.userunit[0],
                    "team": t.userteam[0],
                    "Employeename": t.empname,
                    "Production Achieved": t.finalachieved,
                    "New Gross": t.finalgross,
                    "Salary Type": t.salraytype,
                    "Deduction Type": t.deductiontype,

                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((t, index) => ({
                    Sno: index + 1,
                    "Company": t.company,
                    "Employee Status": t.empstatus,
                    "Department": t.userdepartment[0],
                    "Branch": t.userbranch[0],
                    "Unit": t.userunit[0],
                    "team": t.userteam[0],
                    "Employeename": t.empname,
                    "Production Achieved": t.finalachieved,
                    "New Gross": t.finalgross,
                    "Salary Type": t.salraytype,
                    "Deduction Type": t.deductiontype,

                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };



    return (
        <Box>
            <Headtitle title={"PAYRUN CONTROL REPORT PAGE"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Pay Run Control Report Page"
                modulename="PayRoll"
                submodulename="PayRoll Setup"
                mainpagename="Pay Run Control"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lpayruncontrolreport") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Pay Run Control Report Page</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
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
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setEmployeeNamesDropdown([])
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>



                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[
                                                { label: "Individual", value: "Individual" },
                                                { label: "Department", value: "Department" },
                                                { label: "Branch", value: "Branch" },
                                                { label: "Unit", value: "Unit" },
                                                { label: "Team", value: "Team" },
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.filtertype,
                                                value: payruncontrol.filtertype,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({ ...payruncontrol, filtertype: e.value });
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                                setEmployeeNamesDropdown([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={employeestatus}
                                            styles={colourStyles}
                                            value={{
                                                label: payruncontrol.empstatus,
                                                value: payruncontrol.empstatus,
                                            }}
                                            onChange={(e) => {
                                                setPayruncontrol({
                                                    ...payruncontrol, empstatus: e.value,
                                                });
                                                fetchEmployeeNamesDropdown(
                                                    e.value, "empstatus")
                                                setSelectedBranchTo([]);
                                                setSelectedEmployeeTo([]);
                                                setSelectedDepartmentTo([]);
                                                setSelectedUnitTo([]);
                                                setSelectedTeamTo([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(payruncontrol.filtertype) ? <>
                                    {/* Branch Unit Team */}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch?.filter(
                                                    (comp) => selectedOptionsCompany.map((item) => item.value).includes(comp.company)
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedBranchTo}

                                                onChange={handleBranchChangeTo}
                                                valueRenderer={customValueRendererBranchTo}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        selectedOptionsCompany.map((item) => item.value).includes(comp.company) && selectedBranchTo
                                                            .map((item) => item.value)
                                                            .includes(comp.branch)
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedUnitTo}
                                                onChange={handleUnitChangeTo}
                                                valueRenderer={customValueRendererUnitTo}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team
                                            </Typography>

                                            <MultiSelect
                                                options={Array.from(
                                                    new Set(
                                                        teamsall
                                                            ?.filter(
                                                                (comp) =>
                                                                    selectedBranchTo
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch) &&
                                                                    selectedUnitTo
                                                                        .map((item) => item.value)
                                                                        .includes(comp.unit)
                                                            )
                                                            ?.map((com) => com.teamname)
                                                    )
                                                ).map((teamname) => ({
                                                    label: teamname,
                                                    value: teamname,
                                                }))}
                                                value={selectedTeamTo}
                                                onChange={handleTeamChangeTo}
                                                valueRenderer={customValueRendererTeamTo}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                                    :
                                    ["Department"]?.includes(payruncontrol.filtertype) ?
                                        <>
                                            {/* Department */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOpt}
                                                        value={selectedDepartmentTo}
                                                        onChange={handleDepartmentChangeTo}
                                                        valueRenderer={customValueRendererDepartmentTo}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                        : ["Branch"]?.includes(payruncontrol.filtertype) ?
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Branch
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch?.filter(
                                                                (comp) =>
                                                                    selectedOptionsCompany.map((item) => item.value).includes(comp.company)
                                                            )?.map(data => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedBranchTo}

                                                            onChange={handleBranchChangeTo}
                                                            valueRenderer={customValueRendererBranchTo}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            :
                                            ["Unit"]?.includes(payruncontrol.filtertype) ?
                                                <>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Branch
                                                            </Typography>
                                                            <MultiSelect
                                                                options={accessbranch?.filter(
                                                                    (comp) =>
                                                                        selectedOptionsCompany.map((item) => item.value).includes(comp.company)
                                                                )?.map(data => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                                value={selectedBranchTo}

                                                                onChange={handleBranchChangeTo}
                                                                valueRenderer={customValueRendererBranchTo}
                                                                labelledBy="Please Select Branch"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Unit
                                                            </Typography>
                                                            <MultiSelect
                                                                options={accessbranch?.filter(
                                                                    (comp) =>
                                                                        selectedOptionsCompany.map((item) => item.value).includes(comp.company) && selectedBranchTo
                                                                            .map((item) => item.value)
                                                                            .includes(comp.branch)
                                                                )?.map(data => ({
                                                                    label: data.unit,
                                                                    value: data.unit,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                                value={selectedUnitTo}
                                                                onChange={handleUnitChangeTo}
                                                                valueRenderer={customValueRendererUnitTo}
                                                                labelledBy="Please Select Branch"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                                : ""
                                }
                                {["Individual"]?.includes(payruncontrol.filtertype) &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name
                                            </Typography>
                                            <MultiSelect
                                                options={employeenamesDropdown?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                }))}
                                                value={selectedEmployeeTo}
                                                onChange={handleEmployeeChangeTo}
                                                valueRenderer={customValueRendererEmployeeTo}
                                                labelledBy="Please Select Employeename"
                                            />
                                        </FormControl>
                                    </Grid>}

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Months <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[
                                                { label: "January", value: "January" },
                                                { label: "February", value: "February" },
                                                { label: "March", value: "March" },
                                                { label: "April", value: "April" },
                                                { label: "May", value: "May" },
                                                { label: "June", value: "June" },
                                                { label: "July", value: "July" },
                                                { label: "August", value: "August" },
                                                { label: "September", value: "September" },
                                                { label: "October", value: "October" },
                                                { label: "November", value: "November" },
                                                { label: "December", value: "December" }
                                            ]}
                                            styles={colourStyles}
                                            value={{
                                                label: selectedMonths,
                                                value: selectedMonths,
                                            }}
                                            onChange={(e) => {
                                                setSelectedMonths(e.value);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Year <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={years}
                                            styles={colourStyles}
                                            value={{
                                                label: selectedYear,
                                                value: selectedYear,
                                            }}
                                            onChange={(e) => {
                                                setSelectedYear(e.value);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />

                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button variant="contained" color="primary" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                                        FILTER
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} >
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
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
            {isUserRoleCompare?.includes("lpayruncontrolreport") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Pay Run Control Report List</Typography>
                        </Grid>
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
                                        <MenuItem value={payruncontrolmaster?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelpayruncontrolreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPayrunControlArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpayruncontrolreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPayrunControlArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpayruncontrolreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpayruncontrolreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchPayrunControlArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepayruncontrolreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={payruncontrolmaster} setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={overallItems}

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

                        {statusCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                            </>
                        ) : (
                            <>
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
                                    gridRefTable={gridRef}
                                    paginated={false}
                                    searchQuery={searchQuery}
                                    filteredDatas={filteredDatas}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>
                        )}
                        {/* ****** Table End ****** */}
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
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isErrorOpenpay} onClose={handleCloseerrpay} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpay}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerrpay}
                        >
                            ok
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
                        <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={payruncontrolmaster ?? []}
                filename={"Pay Run Control Report Page"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

        </Box>
    );
}

export default PayRunControlReportPage;