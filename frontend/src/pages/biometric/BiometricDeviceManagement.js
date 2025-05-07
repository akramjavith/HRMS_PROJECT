import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FormGroup from "@mui/material/FormGroup";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box, Button, Checkbox, Dialog,
    DialogActions, DialogContent, FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    List, ListItem, ListItemText, MenuItem,
    OutlinedInput, Popover,
    Radio,
    RadioGroup,
    Select, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../components/Alert.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext.js';
import { userStyle, colourStyles } from "../../pageStyle.js";
import { SERVICE } from '../../services/Baseservice.js';

function BiometricDeviceManagement() {

    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [selectedColumn, setSelectedColumn] = useState("");
    const [fileFormat, setFormat] = useState('')
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [logicOperator, setLogicOperator] = useState("AND");
    const [filterValue, setFilterValue] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [AttendanceSwitch, setAttendanceSwitch] = useState(false);
    const [ExitSwitch, setExitSwitch] = useState(false);
    const [BreakSwitch, setBreakSwitch] = useState(false);
    const [AttendanceSwitchEdit, setAttendanceSwitchEdit] = useState(false);
    const [ExitSwitchEdit, setExitSwitchEdit] = useState(false);
    const [BreakSwitchEdit, setBreakSwitchEdit] = useState(false);
    const [btnUpload, setBtnUpload] = useState(false);
    const [biometricDeviceManagement, setBiometricDeviceManagement] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        branchcode: "",
        unitcode: "",
        floorcode: "",
        biometricdeviceid: "",
        biometricserialno: "",
        biometricassignedip: "",
    });
    const handleAttendanceSwitchChange = (e) => {
        setAttendanceSwitch(e.target.checked);
    };
    const handleExitSwitchChange = (e) => {
        setExitSwitch(e.target.checked);
    };
    const handleBreakSwitchChange = (e) => {
        setBreakSwitch(e.target.checked);
    };
    const handleAttendanceSwitchChangeEdit = (e) => {
        setAttendanceSwitchEdit(e.target.checked);
    };
    const handleExitSwitchChangeEdit = (e) => {
        setExitSwitchEdit(e.target.checked);
    };
    const handleBreakSwitchChangeEdit = (e) => {
        setBreakSwitchEdit(e.target.checked);
    };
    const [biometricDeviceManagementEdit, setBiometricDeviceManagementEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        area: "Please Select Area",
        branchcode: "",
        unitcode: "",
        floorcode: "",
        biometricdeviceid: "",
        biometricserialno: "",
        biometricassignedip: "",
    });

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

    let exportColumnNames = ['Company', 'Branch', 'Unit', 'Floor', 'Area', 'Biometric Device ID', 'Biometric Serial No', 'Biometric Assigned IP', 'Device Common Name', 'Attendance', 'Exit', 'Break'];
    let exportRowValues = ['company', 'branch', 'unit', 'floor', 'area', 'biometricdeviceid', 'biometricserialno', 'biometricassignedip', 'biometriccommonname', 'biometricattendance', 'biometricexit', 'biometricbreak'];

    const gridRefTable = useRef(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [isDisable, setIsDisable] = useState(false)
    const [sourceEdit, setSourceEdit] = useState({})
    const { isUserRoleCompare, alldepartment, allareagrouping, isAssignBranch, pageName, setPageName, buttonStyles, isUserRoleAccess, allfloor } = useContext(UserRoleAccessContext);
    console.log(sourceEdit, 'sourceEdit')
    const [acPointCalculation, setAcpointCalculation] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
            branchcode: data.branchcode,
            unitcode: data.unitcode,
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
                branchcode: data.branchcode,
                unitcode: data.unitcode,
            }));


    const filteredAreas = allareagrouping.filter(area =>

        accessbranch.some(access =>
            access.company === area.company &&
            access.branch === area.branch &&
            access.unit === area.unit
        )
    );


    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Biometric Device Management.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const fetchBiometricLastIndexCode = async (e) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.post(SERVICE.BIOMETRIC_LAST_INDEX, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                area: e
            });
            let refNo = res_queue?.data?.biocode.length > 0 ? res_queue?.data?.biocode[0]?.biometriccommonname :
                biometricDeviceManagement?.branchcode + "_" +
                biometricDeviceManagement?.unitcode + "_" +
                biometricDeviceManagement?.floorcode + "_" +
                res_queue?.data?.areacode?.code + "_" +
                biometricDeviceManagement?.biometricdeviceid?.slice(-3) + "_" +
                // biometricDeviceManagement?.biometricserialno?.slice(-3) + "_" +
                biometricDeviceManagement?.biometricassignedip?.split(".").pop() +
                "#" + 0;
            let codenum = refNo.split("#");
            let prefixLength = Number(codenum[1]) + 1;
            let prefixString = String(prefixLength);
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ? `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}` : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` : prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString

            let newval = biometricDeviceManagement?.branchcode + "_" +
                biometricDeviceManagement?.unitcode + "_" +
                biometricDeviceManagement?.floorcode + "_" +
                res_queue?.data?.areacode?.code + "_" +
                biometricDeviceManagement?.biometricdeviceid?.slice(-3) + "_" +
                // biometricDeviceManagement?.biometricserialno?.slice(-3) + "_" +
                biometricDeviceManagement?.biometricassignedip?.split(".").pop() + "#" + postfixLength;

            return newval;


        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchBiometricLastIndexCodeEdit = async (e) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.post(SERVICE.BIOMETRIC_LAST_INDEX, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                area: e
            });

            let codenum = biometricDeviceManagementEdit?.biometriccommonname?.split("#");
            let prefixLength = codenum[1];
            let newval = biometricDeviceManagementEdit?.branchcode + "_" +
                biometricDeviceManagementEdit?.unitcode + "_" +
                biometricDeviceManagementEdit?.floorcode + "_" +
                res_queue?.data?.areacode?.code + "_" +
                biometricDeviceManagementEdit?.biometricdeviceid?.slice(-3) + "_" +
                // biometricDeviceManagementEdit?.biometricserialno?.slice(-3) + "_" +
                biometricDeviceManagementEdit?.biometricassignedip?.split(".").pop() + "#" + prefixLength;

            return newval;


        } catch (err) { console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsDisable(false)
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
        setIsHandleChange(true);

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
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        biometricdeviceid: true,
        biometricserialno: true,
        biometricassignedip: true,
        biometriccommonname: true,
        biometricattendance: true,
        biometricexit: true,
        biometricbreak: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteSource, setDeleteSource] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.sbiometricdevicemanagement);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${Sourcesid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setFilteredRowData([])
            setFilteredChanges(null)
            await fetchEmployee(); fetchSource();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1)

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delSourcecheckbox = async () => {
        setPageName(!pageName)
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            setFilteredRowData([])
            setFilteredChanges(null)
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchEmployee();
            await fetchSource();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName)
        setBtnUpload(true)
        const commonname = await fetchBiometricLastIndexCode(biometricDeviceManagement?.area)
        try {
            axios.post(SERVICE.CREATE_BIOMETRICDEVICEMANAGEMENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(biometricDeviceManagement.company),
                branch: String(biometricDeviceManagement.branch),
                unit: String(biometricDeviceManagement.unit),
                floor: String(biometricDeviceManagement.floor),
                area: String(biometricDeviceManagement.area),
                biometricdeviceid: String(biometricDeviceManagement.biometricdeviceid),
                biometricserialno: String(biometricDeviceManagement.biometricserialno),
                biometricassignedip: String(biometricDeviceManagement.biometricassignedip),
                biometricattendance: AttendanceSwitch,
                biometricexit: ExitSwitch,
                biometricbreak: BreakSwitch,
                biometriccommonname: commonname,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            await fetchEmployee();
            await fetchSource();
            setIsDisable(false)
            setSearchQuery("")
            setBiometricDeviceManagement((prev) => ({
                ...prev,
                area: "Please Select Area",
                biometricdeviceid: "",
                biometricserialno: "",
                biometricassignedip: "",
            }))
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtnUpload(false)
        } catch (err) {
            setIsDisable(false)
            setBtnUpload(false)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = acPointCalculation.some(item =>
            item.company === biometricDeviceManagement.company &&
            item.branch === biometricDeviceManagement.branch &&
            item.unit === biometricDeviceManagement.unit &&
            item.floor === biometricDeviceManagement.floor &&
            item.area === biometricDeviceManagement.area &&
            item.biometricdeviceid === biometricDeviceManagement.biometricdeviceid &&
            item.biometricserialno === biometricDeviceManagement.biometricserialno &&
            item.biometricassignedip === biometricDeviceManagement.biometricassignedip
        );
        const breakCheck = acPointCalculation.some(item =>
            item.company === biometricDeviceManagement.company &&
            item.branch === biometricDeviceManagement.branch &&
            item.biometricexit && item.biometricexit === ExitSwitch
        );
        const ipFormat = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

        if (biometricDeviceManagement.company === "Please Select Company" || !biometricDeviceManagement.company) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.branch === "Please Select Branch" || !biometricDeviceManagement.branch) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.unit === "Please Select Unit" || !biometricDeviceManagement.unit) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.floor === "Please Select Floor" || !biometricDeviceManagement.floor) {
            setPopupContentMalert("Please Select Floor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.area === "Please Select Area") {
            setPopupContentMalert("Please Select Area");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.biometricdeviceid === "") {
            setPopupContentMalert("Please Enter Biometric Device ID");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.biometricserialno === "") {
            setPopupContentMalert("Please Enter Biometric Serial No");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagement.biometricassignedip === "") {
            setPopupContentMalert("Please Enter Biometric Assigned IP");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (!ipFormat.test(biometricDeviceManagement.biometricassignedip)) {
            setPopupContentMalert("Please Enter Valid Biometric Assigned IP");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (breakCheck) {
            setPopupContentMalert("Already Device Alloted for Exit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setBiometricDeviceManagement({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            biometricdeviceid: "",
            biometricserialno: "",
            biometricassignedip: "",
        })
        setExitSwitch(false)
        setAttendanceSwitch(false)
        setBreakSwitch(false)
        setSearchQuery("")
        fetchEmployee();
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const [acpointCalculationArrayEdit, setAcpointCalculationArrayEdit] = useState([])
    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAcpointCalculationArrayEdit(acPointCalculation?.filter((item) => item?._id !== e))
            setSourceEdit(res?.data?.sbiometricdevicemanagement);
            setAttendanceSwitchEdit(res?.data?.sbiometricdevicemanagement?.biometricattendance)
            setExitSwitchEdit(res?.data?.sbiometricdevicemanagement?.biometricexit)
            setBreakSwitchEdit(res?.data?.sbiometricdevicemanagement?.biometricbreak)
            const branchCode = accessbranch?.find(data => data?.branch === res?.data?.sbiometricdevicemanagement?.branch);
            const unitCode = accessbranch?.find(data => data?.unit === res?.data?.sbiometricdevicemanagement?.unit);
            const floorcode = allfloor?.find(data => data?.name === res?.data?.sbiometricdevicemanagement?.floor);
            setBiometricDeviceManagementEdit({
                ...res?.data?.sbiometricdevicemanagement
                , branchcode: branchCode?.branchcode
                , unitcode: unitCode?.unitcode
                , floorcode: floorcode?.code
            });


            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }


    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourceEdit(res?.data?.sbiometricdevicemanagement);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourceEdit(res?.data?.sbiometricdevicemanagement);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = sourceEdit?.updatedby;
    let addedby = sourceEdit?.addedby;
    let subprojectsid = sourceEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        const commonname = await fetchBiometricLastIndexCodeEdit(biometricDeviceManagementEdit?.area)
        try {
            let res = await axios.put(`${SERVICE.SINGLE_BIOMETRICDEVICEMANAGEMENT}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(biometricDeviceManagementEdit.company),
                branch: String(biometricDeviceManagementEdit.branch),
                unit: String(biometricDeviceManagementEdit.unit),
                floor: String(biometricDeviceManagementEdit.floor),
                area: String(biometricDeviceManagementEdit.area),
                biometricdeviceid: String(biometricDeviceManagementEdit.biometricdeviceid),
                biometricserialno: String(biometricDeviceManagementEdit.biometricserialno),
                biometricassignedip: String(biometricDeviceManagementEdit.biometricassignedip),
                biometricattendance: AttendanceSwitchEdit,
                biometricexit: ExitSwitchEdit,
                biometricbreak: BreakSwitchEdit,
                biometriccommonname: commonname,
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setFilteredRowData([])
            setFilteredChanges(null)
            await fetchEmployee(); fetchSource();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const editSubmit = async (e) => {
        e.preventDefault();
        const isNameMatch = acpointCalculationArrayEdit.some(item =>
            item.company === biometricDeviceManagementEdit.company &&
            item.branch === biometricDeviceManagementEdit.branch &&
            item.unit === biometricDeviceManagementEdit.unit &&
            item.floor === biometricDeviceManagementEdit.floor &&
            item.area === biometricDeviceManagementEdit.area &&
            item.biometricdeviceid === biometricDeviceManagementEdit.biometricdeviceid &&
            item.biometricserialno === biometricDeviceManagementEdit.biometricserialno &&
            item.biometricassignedip === biometricDeviceManagementEdit.biometricassignedip
        );

        const breakCheck = acpointCalculationArrayEdit?.some(item =>
            item.company === biometricDeviceManagementEdit.company &&
            item.branch === biometricDeviceManagementEdit.branch &&
            item.biometricexit && item.biometricexit === ExitSwitchEdit
        );

        const ipFormat = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

        if (biometricDeviceManagementEdit.company === "Please Select Company" || !biometricDeviceManagementEdit.company) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        if (biometricDeviceManagementEdit.branch === "Please Select Branch" || !biometricDeviceManagementEdit.branch) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        if (biometricDeviceManagementEdit.unit === "Please Select Unit" || !biometricDeviceManagementEdit.unit) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        if (biometricDeviceManagementEdit.floor === "Please Select Floor" || !biometricDeviceManagementEdit.floor) {
            setPopupContentMalert("Please Select Floor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagementEdit.area === "Please Select Area") {
            setPopupContentMalert("Please Select Area");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagementEdit.biometricdeviceid === "") {
            setPopupContentMalert("Please Enter Biometric Device ID");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagementEdit.biometricserialno === "") {
            setPopupContentMalert("Please Enter Biometric Serial No");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (biometricDeviceManagementEdit.biometricassignedip === "") {
            setPopupContentMalert("Please Enter Biometric Assigned IP");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (!ipFormat.test(biometricDeviceManagementEdit.biometricassignedip)) {
            setPopupContentMalert("Please Enter Valid Biometric Assigned IP");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (breakCheck) {
            setPopupContentMalert("Already Device Alloted for Exit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }

    //get all Sub vendormasters.
    const fetchSource = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.ALL_BIOMETRICDEVICEMANAGEMENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setAcpointCalculation(res_vendor?.data?.biometricdevicemanagement);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const [acpointCalculationArrayForExport, setAcpointCalculationArrayForExport] = useState([])

    const fetchAcpointcalculation = async () => {

        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.ALL_BIOMETRICDEVICEMANAGEMENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setAcpointCalculationArrayForExport(res_vendor?.data?.biometricdevicemanagement.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company?.toString(),
                    branch: item.branch?.toString(),
                    unit: item.unit?.toString(),
                    floor: item.floor?.toString(),
                    area: item.area,
                    biometricdeviceid: item.biometricdeviceid,
                    biometricserialno: item.biometricserialno,
                    biometricassignedip: item.biometricassignedip,
                    biometriccommonname: item.biometriccommonname,
                    biometricattendance: item.biometricattendance ? "true" : "false",
                    biometricexit: item.biometricexit ? "true" : "false",
                    biometricbreak: item.biometricbreak ? "true" : "false",

                }
            }));
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchAcpointcalculation()
    }, [isFilterOpen])



    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [overallFilterdataAllData, setOverallFilterdataAllData] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };


    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };


    const handleResetSearch = async () => {

        setPageName(!pageName)

        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            searchQuery: searchQuery,
            assignbranch: accessbranch
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }


        try {
            let res_employee = await axios.post(SERVICE.BIOMETRICDEVICEMANAGEMENT_LIST, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setOverallFilterdata(itemsWithSerialNumber);
            setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            })) : []);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchEmployee = async () => {

        setPageName(!pageName)
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            searchQuery: searchQuery,
            assignbranch: accessbranch
        };


        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }


        try {
            let res_employee = await axios.post(SERVICE.BIOMETRICDEVICEMANAGEMENT_LIST, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setOverallFilterdata(itemsWithSerialNumber);
            setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            })) : []);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize, searchQuery]);

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Biometric Device Management',
        pageStyle: 'print'
    });

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Biometric Device Management"),
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
        fetchEmployee();
        fetchSource();
        getapi()
        // fetchTeamAll();
    }, [])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(overallFilterdata);
    }, [overallFilterdata]);


    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        // setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',
        },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "floor", headerName: "Floor", flex: 0, width: 150, hide: !columnVisibility.floor, headerClassName: "bold-header" },
        { field: "area", headerName: "Area", flex: 0, width: 150, hide: !columnVisibility.area, headerClassName: "bold-header" },
        { field: "biometricdeviceid", headerName: "Biometric Device ID", flex: 0, width: 150, hide: !columnVisibility.biometricdeviceid, headerClassName: "bold-header" },
        { field: "biometricserialno", headerName: "Biometric Serial No", flex: 0, width: 150, hide: !columnVisibility.biometricserialno, headerClassName: "bold-header" },
        { field: "biometricassignedip", headerName: "Biometric Assigned IP", flex: 0, width: 150, hide: !columnVisibility.biometricassignedip, headerClassName: "bold-header" },
        { field: "biometriccommonname", headerName: "Biometric Common Name", flex: 0, width: 150, hide: !columnVisibility.biometriccommonname, headerClassName: "bold-header" },
        { field: "biometricattendance", headerName: "Attendance", flex: 0, width: 150, hide: !columnVisibility.biometricattendance, headerClassName: "bold-header" },
        { field: "biometricexit", headerName: "Exit", flex: 0, width: 150, hide: !columnVisibility.biometricexit, headerClassName: "bold-header" },
        { field: "biometricbreak", headerName: "Break", flex: 0, width: 150, hide: !columnVisibility.biometricbreak, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 280,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("ebiometricdevicemanagement") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.data.id, params.data.name);
                        }}>
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />                            </Button>
                    )}
                    {isUserRoleCompare?.includes("dbiometricdevicemanagement") && (
                        <Button sx={userStyle.buttondelete}
                            onClick={(e) => { rowData(params.data.id, params.data.name) }}>
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />                            </Button>
                    )}
                    {isUserRoleCompare?.includes("vbiometricdevicemanagement") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ibiometricdevicemanagement") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />                        </Button>
                    )}
                </Grid>
            ),
        },
    ]

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            biometricdeviceid: item.biometricdeviceid,
            biometricserialno: item.biometricserialno,
            biometricassignedip: item.biometricassignedip,
            biometriccommonname: item.biometriccommonname,
            biometricattendance: item.biometricattendance ? "true" : "false",
            biometricexit: item.biometricexit ? "true" : "false",
            biometricbreak: item.biometricbreak ? "true" : "false",

        }
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
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
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
            <Headtitle title={'BIOMETRIC DEVICE MANAGEMENT'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Biometric Device Management"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Ac-Point Calculation"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("abiometricdevicemanagement")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Biometric Device Management</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagement.company,
                                                    value: biometricDeviceManagement.company,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        company: e.value,
                                                        branchcode: "",
                                                        unitcode: "",
                                                        floorcode: "",
                                                        branch: "Please Select Branch",
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                        area: "Please Select Area",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.filter((comp) =>
                                                    comp.company === biometricDeviceManagement?.company
                                                ).map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                    branchcode: data.branchcode,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagement.branch,
                                                    value: biometricDeviceManagement.branch,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        branch: e.value,
                                                        branchcode: e.branchcode,
                                                        unitcode: "",
                                                        floorcode: "",
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                        area: "Please Select Area",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.filter((comp) =>
                                                    comp.company === biometricDeviceManagement?.company
                                                    && comp.branch === biometricDeviceManagement?.branch
                                                ).map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                    unitcode: data.unitcode,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagement.unit,
                                                    value: biometricDeviceManagement.unit,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        unit: e.value,
                                                        unitcode: e.unitcode,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Floor<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={allfloor
                                                    ?.filter((u) =>
                                                        biometricDeviceManagement?.branch === u.branch
                                                    )
                                                    .map((u) => ({
                                                        ...u,
                                                        label: u.name,
                                                        value: u.name,
                                                    })).filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label &&
                                                                    i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagement.floor,
                                                    value: biometricDeviceManagement.floor,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        floor: e.value,
                                                        floorcode: e.code,
                                                        area: "Please Select Area",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Area<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={
                                                    filteredAreas
                                                        .filter(
                                                            (item) =>
                                                                biometricDeviceManagement?.floor === item.floor && biometricDeviceManagement?.branch === item.branch
                                                                && item?.boardingareastatus
                                                        )
                                                        .flatMap((item) => item.area).map((location) => ({
                                                            label: location,
                                                            value: location,
                                                        }))}
                                                placeholder="Please Select Area"
                                                value={{
                                                    label: biometricDeviceManagement.area,
                                                    value: biometricDeviceManagement.area,
                                                }}
                                                onChange={(e) => {

                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        area: e.value,
                                                    });
                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Biometric Device ID <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Biometric Device ID"
                                                value={biometricDeviceManagement.biometricdeviceid}
                                                onChange={(e) => {
                                                    // const enteredValue = e.target.value.replace(/[^\d.]/g, "");
                                                    // if (enteredValue === "" || /^\d*\.?\d*$/.test(enteredValue)) {
                                                    //     if ((enteredValue.match(/\./g) || []).length <= 1) {
                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        biometricdeviceid: e.target.value
                                                    });
                                                    // }
                                                    // }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Biometric Serial No <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Biometric Serial No"
                                                value={biometricDeviceManagement.biometricserialno}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagement({
                                                        ...biometricDeviceManagement,
                                                        biometricserialno: e.target.value
                                                    });
                                                    // }
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Biometric Assigned IP <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Biometric Assigned IP"
                                                value={biometricDeviceManagement.biometricassignedip}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value;

                                                    // Regex to match partial IP address structure
                                                    if (
                                                        enteredValue === "" ||
                                                        /^(\d{1,3}\.){0,3}\d{0,3}$/.test(enteredValue) // Matches up to 3 octets and the last segment
                                                    ) {
                                                        // Split the entered value by dots
                                                        const segments = enteredValue.split(".");

                                                        // Ensure all segments are numbers between 0 and 255
                                                        const isValid = segments.every(
                                                            (segment) => segment === "" || (Number(segment) >= 0 && Number(segment) <= 255)
                                                        );

                                                        if (isValid) {
                                                            setBiometricDeviceManagement({
                                                                ...biometricDeviceManagement,
                                                                biometricassignedip: enteredValue
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Attendance"
                                                control={
                                                    <Switch
                                                        checked={AttendanceSwitch}
                                                        onChange={handleAttendanceSwitchChange}
                                                    />
                                                }
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Exit"
                                                control={
                                                    <Switch
                                                        checked={ExitSwitch}
                                                        onChange={handleExitSwitchChange}
                                                    />
                                                }
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Break"
                                                control={
                                                    <Switch
                                                        checked={BreakSwitch}
                                                        onChange={handleBreakSwitchChange}
                                                    />
                                                }
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <Typography>&nbsp;</Typography>
                                        <Grid
                                            sx={{
                                                display: "flex",

                                                gap: "15px",
                                            }}
                                        >
                                            <LoadingButton loading={btnUpload} sx={buttonStyles.buttonsubmit} onClick={handleSubmit} >
                                                SAVE
                                            </LoadingButton>
                                            <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                                CLEAR
                                            </Button>
                                        </Grid>
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
                    maxWidth="md"
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >

                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Biometric Device Management</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagementEdit.company,
                                                    value: biometricDeviceManagementEdit.company,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagementEdit({
                                                        ...biometricDeviceManagementEdit,
                                                        company: e.value,
                                                        branch: "Please Select Branch",
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                        area: "Please Select Area",
                                                        branchcode: "",
                                                        unitcode: "",
                                                        floorcode: "",

                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.filter((comp) =>
                                                    comp.company === biometricDeviceManagementEdit?.company
                                                ).map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                    branchcode: data.branchcode,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagementEdit.branch,
                                                    value: biometricDeviceManagementEdit.branch,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagementEdit({
                                                        ...biometricDeviceManagementEdit,
                                                        branch: e.value,
                                                        branchcode: e.branchcode,
                                                        unitcode: "",
                                                        floorcode: "",
                                                        unit: "Please Select Unit",
                                                        floor: "Please Select Floor",
                                                        area: "Please Select Area",

                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.filter((comp) =>
                                                    comp.company === biometricDeviceManagementEdit?.company
                                                    && comp.branch === biometricDeviceManagementEdit?.branch
                                                ).map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                    unitcode: data.unitcode
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagementEdit.unit,
                                                    value: biometricDeviceManagementEdit.unit,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagementEdit({
                                                        ...biometricDeviceManagementEdit,
                                                        unit: e.value,
                                                        unitcode: e.unitcode,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Floor<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={allfloor
                                                    ?.filter((u) =>
                                                        biometricDeviceManagementEdit?.branch === u.branch
                                                    )
                                                    .map((u) => ({
                                                        ...u,
                                                        label: u.name,
                                                        value: u.name,
                                                    })).filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label &&
                                                                    i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                styles={colourStyles}
                                                value={{
                                                    label: biometricDeviceManagementEdit.floor,
                                                    value: biometricDeviceManagementEdit.floor,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagementEdit({
                                                        ...biometricDeviceManagementEdit,
                                                        floor: e.value,
                                                        floorcode: e.code,
                                                        area: "Please Select Area",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Area<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={
                                                    filteredAreas
                                                        .filter(
                                                            (item) =>
                                                                biometricDeviceManagementEdit?.floor === item.floor && biometricDeviceManagementEdit?.branch === item.branch
                                                                && item?.boardingareastatus
                                                        )
                                                        .flatMap((item) => item.area).map((location) => ({
                                                            label: location,
                                                            value: location,
                                                        }))}
                                                placeholder="Please Select Area"
                                                value={{
                                                    label: biometricDeviceManagementEdit.area,
                                                    value: biometricDeviceManagementEdit.area,
                                                }}
                                                onChange={(e) => {
                                                    setBiometricDeviceManagementEdit({
                                                        ...biometricDeviceManagementEdit,
                                                        area: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Biometric Device ID <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Biometric Device ID"
                                                value={biometricDeviceManagementEdit.biometricdeviceid}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value.replace(/[^\d.]/g, "");
                                                    if (enteredValue === "" || /^\d*\.?\d*$/.test(enteredValue)) {
                                                        if ((enteredValue.match(/\./g) || []).length <= 1) {
                                                            setBiometricDeviceManagementEdit({
                                                                ...biometricDeviceManagementEdit,
                                                                biometricdeviceid: enteredValue
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Biometric Serial No <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Biometric Serial No"
                                                value={biometricDeviceManagementEdit.biometricserialno}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value
                                                    if (enteredValue === "" || /^[a-zA-Z0-9]*$/.test(enteredValue)) {
                                                        setBiometricDeviceManagementEdit({
                                                            ...biometricDeviceManagementEdit,
                                                            biometricserialno: enteredValue
                                                        });

                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Biometric Assigned IP <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Biometric Assigned IP"
                                                value={biometricDeviceManagementEdit.biometricassignedip}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value;

                                                    // Regex to match partial IP address structure
                                                    if (
                                                        enteredValue === "" ||
                                                        /^(\d{1,3}\.){0,3}\d{0,3}$/.test(enteredValue) // Matches up to 3 octets and the last segment
                                                    ) {
                                                        // Split the entered value by dots
                                                        const segments = enteredValue.split(".");

                                                        // Ensure all segments are numbers between 0 and 255
                                                        const isValid = segments.every(
                                                            (segment) => segment === "" || (Number(segment) >= 0 && Number(segment) <= 255)
                                                        );

                                                        if (isValid) {
                                                            setBiometricDeviceManagementEdit({
                                                                ...biometricDeviceManagementEdit,
                                                                biometricassignedip: enteredValue
                                                            });
                                                        }
                                                    }
                                                }}


                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={2} xs={12} sm={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Attendance"
                                                control={
                                                    <Switch
                                                        checked={AttendanceSwitchEdit}
                                                        onChange={handleAttendanceSwitchChangeEdit}
                                                    />
                                                }
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Exit"
                                                control={
                                                    <Switch
                                                        checked={ExitSwitchEdit}
                                                        onChange={handleExitSwitchChangeEdit}
                                                    />
                                                }
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                label="Break"
                                                control={
                                                    <Switch
                                                        checked={BreakSwitchEdit}
                                                        onChange={handleBreakSwitchChangeEdit}
                                                    />
                                                }
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.buttonsubmit} type="submit">Update</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
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
            {isUserRoleCompare?.includes("lbiometricdevicemanagement") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Biometric Device Management List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(acPointCalculation?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelbiometricdevicemanagement") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAcpointcalculation()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvbiometricdevicemanagement") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchAcpointcalculation()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>


                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printbiometricdevicemanagement") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfbiometricdevicemanagement") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchAcpointcalculation()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagebiometricdevicemanagement") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                {/* <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={overallFilterdata}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={true}
                                    totalDatas={overallFilterdataAllData}
                                /> */}
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
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
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdbiometricdevicemanagement") && (
                            <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}
                        <br /><br />
                        {!sourceCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

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
                            :
                            <>
                                <AggridTableForPaginationTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    totalDatas={totalProjects}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallFilterdataAllData}
                                />
                                {/* <AggridTable
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
                                    paginated={true}
                                    filteredDatas={filteredDatas}
                                    totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallFilterdataAllData}
                                /> */}
                                <Popover
                                    id={idSearch}
                                    open={openSearch}
                                    anchorEl={anchorElSearch}
                                    onClose={handleCloseSearch}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                                >
                                    <Box style={{ padding: "10px", maxWidth: '450px' }}>
                                        <Typography variant="h6">Advance Search</Typography>
                                        <IconButton
                                            aria-label="close"
                                            onClick={handleCloseSearch}
                                            sx={{
                                                position: "absolute",
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.grey[500],
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <DialogContent sx={{ width: "100%" }}>
                                            <Box sx={{
                                                width: '350px',
                                                maxHeight: '400px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <Box sx={{
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    // paddingRight: '5px'
                                                }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Columns</Typography>
                                                            <Select fullWidth size="small"
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 200,
                                                                            width: "auto",
                                                                        },
                                                                    },
                                                                }}
                                                                style={{ minWidth: 150 }}
                                                                value={selectedColumn}
                                                                onChange={(e) => setSelectedColumn(e.target.value)}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="" disabled>Select Column</MenuItem>
                                                                {filteredSelectedColumn.map((col) => (
                                                                    <MenuItem key={col.field} value={col.field}>
                                                                        {col.headerName}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Operator</Typography>
                                                            <Select fullWidth size="small"
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 200,
                                                                            width: "auto",
                                                                        },
                                                                    },
                                                                }}
                                                                style={{ minWidth: 150 }}
                                                                value={selectedCondition}
                                                                onChange={(e) => setSelectedCondition(e.target.value)}
                                                                disabled={!selectedColumn}
                                                            >
                                                                {conditions.map((condition) => (
                                                                    <MenuItem key={condition} value={condition}>
                                                                        {condition}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Value</Typography>
                                                            <TextField fullWidth size="small"
                                                                value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                                                onChange={(e) => setFilterValue(e.target.value)}
                                                                disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                                                placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root.Mui-disabled': {
                                                                        backgroundColor: 'rgb(0 0 0 / 26%)',
                                                                    },
                                                                    '& .MuiOutlinedInput-input.Mui-disabled': {
                                                                        cursor: 'not-allowed',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        {additionalFilters.length > 0 && (
                                                            <>
                                                                <Grid item md={12} sm={12} xs={12}>
                                                                    <RadioGroup
                                                                        row
                                                                        value={logicOperator}
                                                                        onChange={(e) => setLogicOperator(e.target.value)}
                                                                    >
                                                                        <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                                        <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                                    </RadioGroup>
                                                                </Grid>
                                                            </>
                                                        )}
                                                        {additionalFilters.length === 0 && (
                                                            <Grid item md={4} sm={12} xs={12} >
                                                                <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                                    Add Filter
                                                                </Button>
                                                            </Grid>
                                                        )}

                                                        <Grid item md={2} sm={12} xs={12}>
                                                            <Button variant="contained" onClick={() => {
                                                                fetchEmployee();
                                                                setIsSearchActive(true);
                                                                setAdvancedFilter([
                                                                    ...additionalFilters,
                                                                    { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                                                ])
                                                            }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                                Search
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </DialogContent>
                                    </Box>
                                </Popover>
                            </>}

                    </Box>
                </>
            )
            }
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Biometric Device Management</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{sourceEdit?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{sourceEdit?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{sourceEdit?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{sourceEdit?.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{sourceEdit?.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Biometric Device ID</Typography>
                                    <Typography>{sourceEdit?.biometricdeviceid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Biometric Serial No</Typography>
                                    <Typography>{sourceEdit?.biometricserialno}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Biometric Assigned IP</Typography>
                                    <Typography>{sourceEdit?.biometricassignedip}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Attendance</Typography>
                                    <Typography>{sourceEdit?.biometricattendance?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Break</Typography>
                                    <Typography>{sourceEdit?.biometricbreak?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Exit</Typography>
                                    <Typography>{sourceEdit?.biometricexit?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Device Common Name</Typography>
                                    <Typography>{sourceEdit?.biometriccommonname}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button sx={buttonStyles.btncancel} onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
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
            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={acpointCalculationArrayForExport ?? []}
                filename={"Biometric Device Management"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Biometric Device Management Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSource}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delSourcecheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}

        </Box>
    );
}

export default BiometricDeviceManagement;