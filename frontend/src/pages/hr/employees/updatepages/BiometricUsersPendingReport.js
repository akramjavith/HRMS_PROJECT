import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    OutlinedInput,
    FormControlLabel,
    FormGroup,
    FormLabel,
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
import BiometricForm from "../BiometricForm";

function BiometricUsersPendingReport() {
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
    const [openCreateUserPopup, setOpenCreateUserPopup] = useState(false);
    const handleClickOpenCreateUser = () => {
        setOpenCreateUserPopup(true);
    };
    const handleClickCloseCreateUser = () => {
        setOpenCreateUserPopup(false);
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
        'Status',
        'Company',
        'Branch ',
        'Unit',
        'Team',
        'Department',
        'Employee Name',
        'Username',
        'Common Device Name',
        "Biometric User ID",
        'Biometric Role',
        'FingerPrint Count',
        'Face Enrolled',


    ]
    let exportRowValuescrt = [
        'statusreport',
        'company',
        'branch',
        'unit',
        'team',
        'department',
        'companyname',
        'staffNameC',
        'biometriccommonname',
        "biometricUserIDC",
        'privilegeC',
        'fingerCountN',
        'isFaceEnrolledC',

    ]
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
    console.log(allUsersData , 'userData')

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
        companyname: true,
        department: true,
        biometriccommonname: true,
        biometricUserIDC: true,
        privilegeC: true,
        actions: true,
        staffNameC: true,
        statusreport: true,
        isFaceEnrolledC: true,
        fingerCountN: true,

    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

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
    }, [])

    // BioMetric Usage Details
    const [BiometricPostDevice, setBiometricPostDevice] = useState({});
    const [BioPostCheckDevice, setBioPostCheckDevice] = useState(false);
    const [BiometricDeviceOptions, setBiometricDeviceOptions] = useState([]);
    const [employee, setEmployee] = useState({
        biometricdevicename: "Please Select Device",
        biometricrole: "Please Select Role",
        biometricname: "",
    });
    const [usernameBio, setUsernameBio] = useState([]);
    const fetchBiometricDevices = async () => {
        try {
            let response = await axios.get(SERVICE.ALL_BIOMETRICDEVICEMANAGEMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = response?.data?.biometricdevicemanagement?.filter((data) =>
                accessbranch?.some(
                    (item) =>
                        data?.company === item?.company &&
                        data?.branch === item?.branch &&
                        data?.unit === item?.unit
                )
            );
            const biometricDevice =
                answer?.length > 0
                    ? answer?.map((data) => ({
                        ...data,
                        label: data?.biometricserialno,
                        value: data?.biometricserialno,
                    }))
                    : [];
            setBiometricDeviceOptions(biometricDevice);
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                // setPopupContentMalert(error);
                // setPopupSeverityMalert("error");
                // handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };

    const handleSubmitBiometricAdd = async (e) => {
        e.preventDefault();
        if (!BioPostCheckDevice) {
            setPopupContentMalert(`Please Finish the Biometric Process`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            handleCommitUserBiometric(e)
        }

    }

    const handleCommitUserBiometric = async (e) => {
        e.preventDefault();
        try {
            if (BiometricPostDevice?.cloudIDC) {
                let res = await axios.post(SERVICE.BIOMETRIC_GET_SEND_COMMAND, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    biometricUserIDC: BiometricPostDevice?.biometricUserIDC,
                    CloudIDC: BiometricPostDevice?.cloudIDC,
                    deviceCommandN: "5",
                });
                console.log(res?.data, "res?.data");
                setBioPostCheckDevice(false)
                handleClickCloseCreateUser();
                setPopupContentMalert(`Added Successfully`);
                setPopupSeverityMalert("success");
                handleClickOpenPopupMalert();
            }
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
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
            pagename: String("BiometricUsersPendingReport"),
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
        status: "Please Select Status",
    });

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Unmatched", value: "Unmatched" },
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

    //add function
    const sendRequest = async () => {
        setLoader(true);
        setPageName(!pageName)
        const filterEmployee = filterState?.type === "Individual" ?
            TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
                TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
                    TypeUnit : filterState?.type === "Team" ? TypeTeam : []
        try {
            const response = await axios.post(SERVICE.BIOMETRIC_USER_SINGLE_CHECK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company : valueCompanyCat,
                branch:valueBranchCat,
                usernames: filterState?.type === "Unmatched" ? [] : filterEmployee?.map(data => data?.username),
                type: filterState?.type,
                status: filterState?.status,
                workmode: valueWorkMode,
                date: new Date()
            });
            console.log(response?.data, 'data')
            setMeetingArray(response?.data?.users?.length > 0 ? response?.data?.users?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
            })) : []);
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
        if (filterState?.type !== "Unmatched" && selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterState?.type !== "Unmatched" &&
            ["Individual", "Branch", "Unit", "Team" , "Deactivate"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterState?.type !== "Unmatched" &&
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterState?.type !== "Unmatched" &&
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterState?.type !== "Unmatched" &&
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (filterState?.type !== "Unmatched" &&
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
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
        })
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
                    saveAs(blob, "BiometricUsersPendingReport.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // Excel
    const fileName = "BiometricUsersPendingReport";
    // get particular columns for export excel
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Biometric Users Pending Report",
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

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isEditOpenRole, setIsEditOpenRole] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [UnmatchedUserData, setUnmatchedUserData] = useState({});
    const [matchedDataRole, setMatchedDataRole] = useState("Please Select Role");
    const [BioUserDataActions, setBioUserDataActions] = useState({});
    const [UnmatchedName, setUnmatchedName] = useState("");
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setUnmatchedName("")
    };
    const handleClickOpenEditRole = () => {
        setIsEditOpenRole(true);
    };
    const handleCloseModEditRole = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenRole(false);
        setMatchedDataRole("Please Select Role")
        setUnmatchedUserData({})
    };



    const handleClickOpenAction = () => {
        setIsActionOpen(true);
    };
    const handleCloseModAction = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsActionOpen(false);
        setUnmatchedName("")
        setUnmatchedUserData({})
        setBioUserDataActions({})
    };




    const getCode = async (e) => {
        setPageName(!pageName);
        try {
            setUnmatchedName(e.companyname)
            setUnmatchedUserData(e)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const getCodeRole = async (e) => {
        setPageName(!pageName);
        try {
            setUnmatchedName(e.companyname)
            setUnmatchedUserData(e)
            setMatchedDataRole(e.privilegeC)
            setBioUserDataActions({
                deviceCommandN: "5",
                CloudIDC: e.cloudIDC,
                biometricUserIDC: e?.biometricUserIDC,
            });
            handleClickOpenEditRole();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const handleBioUserActions = async (e, mode) => {
        setPageName(!pageName);
        try {
            setUnmatchedUserData(e)
            if (mode === "Enable") {
                setBioUserDataActions({
                    deviceCommandN: "6",
                    CloudIDC: e.cloudIDC,
                    biometricUserIDC: e?.biometricUserIDC,
                    mode: "Enable"
                });
                handleClickOpenAction()
            } else if (mode === "Disable") {
                setBioUserDataActions({
                    deviceCommandN: "7",
                    CloudIDC: e.cloudIDC,
                    biometricUserIDC: e?.biometricUserIDC,
                    mode: "Disable"
                })
                handleClickOpenAction()

            }
            else if (mode === "Delete") {
                setBioUserDataActions({
                    deviceCommandN: "8",
                    CloudIDC: e.cloudIDC,
                    biometricUserIDC: e?.biometricUserIDC,
                    mode: "Delete"
                })
                handleClickOpenAction()

            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    const handleActionSubmit = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.BIOMETRIC_EDIT_UNMATCHED_USER_DATA}/${UnmatchedUserData?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                cloudIDC: BioUserDataActions?.CloudIDC,
                biometricUserIDC: BioUserDataActions?.biometricUserIDC,
                isEnabledC: BioUserDataActions?.mode === "Enable" ? "Yes" : (BioUserDataActions?.mode === "Disable" ? "No" : ""),
                mode: BioUserDataActions?.mode,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            if (res?.data?.success) {
                let res = await axios.post(SERVICE.BIOMETRIC_GET_SEND_COMMAND, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    CloudIDC: BioUserDataActions?.CloudIDC,
                    biometricUserIDC: BioUserDataActions?.biometricUserIDC,
                    deviceCommandN: BioUserDataActions?.mode === "Enable" ? "6" : (BioUserDataActions?.mode === "Disable" ? "7" : "8"),
                });
            }

            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setUnmatchedName("");
            handleCloseModAction();
            sendRequest();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const editSubmit = (e) => {
        e.preventDefault();
        if (UnmatchedName === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };
    const editSubmitRole = (e) => {
        e.preventDefault();
        if (!matchedDataRole || matchedDataRole === "Please Select Role") {
            setPopupContentMalert("Please Select Role");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequestRole();
        }
    };

    let updateby = UnmatchedUserData?.updatedby;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.BIOMETRIC_EDIT_UNMATCHED_USER_DATA}/${UnmatchedUserData?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                companyname: String(UnmatchedName),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setUnmatchedName("");
            sendRequest();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendEditRequestRole = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.BIOMETRIC_EDIT_UNMATCHED_USER_DATA}/${UnmatchedUserData?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                privilegeC: String(matchedDataRole),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            if (res?.data?.success) {
                let res = await axios.post(SERVICE.BIOMETRIC_GET_SEND_COMMAND, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    CloudIDC: BioUserDataActions?.CloudIDC,
                    biometricUserIDC: BioUserDataActions?.biometricUserIDC,
                    deviceCommandN: "5",
                    datastatus: "new",
                });
            }

            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setUnmatchedName("");
            sendRequest();
            handleCloseModEditRole();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



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
            field: "statusreport",
            headerName: "Status",
            flex: 0,
            width: 100,
            hide: !columnVisibility.statusreport,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{
                        color: params?.data?.statusreport === "Assigned" ? "green" : params?.data?.statusreport === "Un-Matched" ? "blue" : "red"
                    }}>{params?.data?.statusreport}</Typography>
                </Grid>
            ),
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
            headerName: "Common Device Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.biometriccommonname,
            headerClassName: "bold-header",
        },
        {
            field: "biometricUserIDC",
            headerName: "BiometricUser ID",
            flex: 0,
            width: 100,
            hide: !columnVisibility.biometricUserIDC,
            headerClassName: "bold-header",
        },
        {
            field: "privilegeC",
            headerName: "Biometric Role",
            flex: 0,
            width: 100,
            hide: !columnVisibility.privilegeC,
            headerClassName: "bold-header",
        },
        {
            field: "fingerCountN",
            headerName: "FingerPrint Count",
            flex: 0,
            width: 75,
            hide: !columnVisibility.fingerCountN,
            headerClassName: "bold-header",
        },
        {
            field: "isFaceEnrolledC",
            headerName: "Face Enrolled",
            flex: 0,
            width: 75,
            hide: !columnVisibility.isFaceEnrolledC,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 450,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return (
                    <Grid sx={{ display: 'flex' }}>
                        {isUserRoleCompare?.includes("ebiometricuserspendingreport") && (
                            params?.data?.statusreport === "Un-Matched" ?

                                <Grid item md={4}>
                                    <Button
                                        sx={userStyle.buttonedit}
                                        onClick={() => getCode(params.data)}
                                    >
                                        <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                                    </Button>&ensp;
                                </Grid>
                                :

                                <Grid item md={4}>
                                    <Button
                                        sx={userStyle.buttonedit}
                                        onClick={() => getCodeRole(params.data)}
                                    >
                                        <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                                    </Button>&ensp;
                                </Grid>

                        )}
                        {params?.data?.isEnabledC === "No" ? <Grid item md={4}>
                            <Button variant="contained" sx={{ backgroundColor: "#4CAF50", color: "#fff" }} onClick={() => handleBioUserActions(params.data, "Enable")}>Enable</Button>&ensp;
                        </Grid> :
                            <Grid item md={4}>
                                <Button variant="contained" sx={{ backgroundColor: "#FF9800", color: "#fff" }} onClick={() => handleBioUserActions(params.data, "Disable")}>Disable</Button>&ensp;
                            </Grid>}
                        <Grid item md={4}>
                            <Button variant="contained" sx={{ backgroundColor: "#F44336", color: "#fff" }} onClick={() => handleBioUserActions(params.data, "Delete")}>Delete</Button>
                        </Grid>
                    </Grid>
                );
            }


        },

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
            companyname: item.companyname,
            cloudIDC: item.cloudIDC,
            biometricUserIDC: item.biometricUserIDC,
            privilegeC: item.privilegeC,
            staffNameC: item.staffNameC,
            statusreport: item.statusreport,
            isFaceEnrolledC: item.isFaceEnrolledC,
            fingerCountN: item.fingerCountN,
            updatedby: item.updatedby,
            isEnabledC: item.isEnabledC,
            biometriccommonname: item.biometriccommonname,
            status: item.status,

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
        fetchBiometricDevices();
    }, [isAssignBranch]);

    return (
        <Box>
            <Headtitle title={"BIOMETRIC USERS REPORT"} />
            <PageHeading
                title="Biometric Users Pending Report"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Biometric Device"
                subsubpagename="Biometric Users Pending Report"
            />
            {isUserRoleCompare?.includes("lbiometricuserspendingreport") && (
                <Box sx={userStyle.selectcontainer}>
                    <>
                        <Typography sx={userStyle.importheadtext}>Biometric Users Pending Report Filter</Typography>
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
                            {
                                filterState.type === "Unmatched" ?
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
                                    :
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
                                <Typography>
                                    Status
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={[{ label: "Assigned", value: "Assigned" },
                                        { label: "Not-Assigned", value: "Not-Assigned" },
                                        { label: "Disable", value: "Disable" }
                                        ]}
                                        value={{
                                            label: filterState.status ?? "Please Select Status",
                                            value: filterState.status ?? "Please Select Status",
                                        }}
                                        onChange={(e) => {
                                            setFilterState((prev) => ({
                                                ...prev,
                                                status: e.value,
                                            }));
                                        }}
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
            {isUserRoleCompare?.includes("lbiometricuserspendingreport") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <Typography sx={userStyle.importheadtext}>
                                    List Biometric Users Pending Report
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" onClick={(e) => handleClickOpenCreateUser()}>Add User</Button>
                            </Grid>
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
                                    {isUserRoleCompare?.includes("excelbiometricuserspendingreport") && (
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
                                    {isUserRoleCompare?.includes("csvbiometricuserspendingreport") && (
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
                                    {isUserRoleCompare?.includes("printbiometricuserspendingreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp; <FaPrint /> &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfbiometricuserspendingreport") && (
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
                                    {isUserRoleCompare?.includes("imagebiometricuserspendingreport") && (
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
            )
            }

            {/* edit model */}
            <Dialog open={isEditOpen}
                onClose={handleCloseModEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth>
                <Box sx={{ padding: "20px 30px" }}>
                    <form onSubmit={editSubmit}>
                        <Grid container spacing={2}>
                            <Typography sx={userStyle.HeaderText}>Edit Biometric Users Pending Report</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{UnmatchedUserData?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{UnmatchedUserData?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{UnmatchedUserData?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Username</Typography>
                                    <Typography>{UnmatchedUserData?.staffNameC}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Device Status</Typography>
                                    <Typography sx={{ color: "Green" }}>{UnmatchedUserData?.status}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Name <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Name"
                                        value={UnmatchedName}
                                        onChange={(e) => {
                                            setUnmatchedName(e.target.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <Button variant="contained" type="submit"
                                    sx={buttonStyles.buttonsubmit}
                                >
                                    {" "}
                                    Update
                                </Button>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                    {" "}
                                    Cancel{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Dialog>
            {/* edit model */}
            <Dialog open={isEditOpenRole}
                onClose={handleCloseModEditRole}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
                sx={{
                    overflow: 'visible',
                    '& .MuiPaper-root': {
                        overflow: 'visible',
                    },
                }}
            >
                <Box sx={{ padding: "20px 30px" }}>
                    <form onSubmit={editSubmitRole}>
                        <Grid container spacing={2}>
                            <Typography sx={userStyle.HeaderText}>Edit Biometric Users Pending Report</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{UnmatchedUserData?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{UnmatchedUserData?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{UnmatchedUserData?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Username</Typography>
                                    <Typography>{UnmatchedUserData?.staffNameC}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Device Status</Typography>
                                    <Typography sx={{ color: "Green" }}>{UnmatchedUserData?.status}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={2.8} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Biometric Role<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={[{ label: "User", value: "User" }, { label: "Manager", value: "Manager" }, { label: "Administrator", value: "Administrator" }]}
                                        value={{
                                            label: matchedDataRole,
                                            value: matchedDataRole,
                                        }}
                                        onChange={(e) => {
                                            setMatchedDataRole(e.value);
                                        }}
                                    />

                                </FormControl>

                            </Grid>
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <Button variant="contained" type="submit"
                                    sx={buttonStyles.buttonsubmit}
                                >
                                    {" "}
                                    Update
                                </Button>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEditRole}>
                                    {" "}
                                    Cancel{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Dialog>
            {/* Crate New User model */}
            <Dialog
                open={openCreateUserPopup}
                // onClose={handleCloseModEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
                sx={{
                    overflow: 'visible',
                    '& .MuiPaper-root': {
                        overflow: 'visible',
                    },
                }}
            >
                <Box sx={{ padding: "20px 30px" }}>
                    <Grid item xs={10}>
                        <Typography sx={userStyle.HeaderText}>
                            Add New Biometric User
                        </Typography>
                    </Grid>
                    <br />
                    <BiometricForm
                        employee={employee}
                        BiometricDeviceOptions={BiometricDeviceOptions}
                        setEmployee={setEmployee}
                        auth={auth}
                        SERVICE={SERVICE}
                        handleApiError={handleApiError}
                        setPopupContentMalert={setPopupContentMalert}
                        setPopupSeverityMalert={setPopupSeverityMalert}
                        handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        enableLoginName={true}
                        third={usernameBio}
                        BiometricPostDevice={BiometricPostDevice}
                        setBiometricPostDevice={setBiometricPostDevice}
                        BioPostCheckDevice={BioPostCheckDevice}
                        setBioPostCheckDevice={setBioPostCheckDevice}
                        pagename={false}
                        setUsernameBio={setUsernameBio}
                    />
                    <br /> <br />
                    <Grid container spacing={2}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Button variant="contained"
                                sx={buttonStyles.buttonsubmit}
                                onClick={(e) => handleSubmitBiometricAdd(e)}
                            >
                                {" "}
                                Add User
                            </Button>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Button sx={buttonStyles.btncancel} disabled={BioPostCheckDevice} onClick={handleClickCloseCreateUser}>
                                {" "}
                                Cancel{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {/* edit model */}
            <Dialog
                open={isActionOpen}
                onClose={handleCloseModAction}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xs"
                fullWidth>
                <Box sx={{ padding: "20px 30px" }}>
                    <Grid container spacing={2}>
                        <Typography sx={userStyle.HeaderText}>{`Are You Sure ? You want to ${BioUserDataActions?.mode} the User? `}</Typography>
                    </Grid>
                    <br /> <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
                            <Button variant="contained" type="submit"
                                sx={buttonStyles.buttonsubmit}
                                onClick={handleActionSubmit}
                            >
                                {" "}
                                Ok
                            </Button>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <Button sx={buttonStyles.btncancel} onClick={handleCloseModAction}>
                                {" "}
                                Cancel{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>

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
                filename={"Biometric Users Pending Report"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box >
    );
}
export default BiometricUsersPendingReport;