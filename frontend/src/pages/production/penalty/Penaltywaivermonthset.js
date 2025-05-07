import React, { useState, useEffect, useRef, useContext, } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import "jspdf-autotable";
import axios from "axios";
import { handleApiError } from "../../../components/Errorhandling.js";
import { SERVICE } from "../../../services/Baseservice.js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import domtoimage from 'dom-to-image';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import AlertDialog from "../../../components/Alert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import moment from "moment-timezone";
import ManageColumnsContent from "../../../components/ManageColumn.js";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar.js";
import AggridTable from "../../../components/AggridTable.js";
import ResizeObserver from 'resize-observer-polyfill';
import { MultiSelect } from "react-multi-select-component";
window.ResizeObserver = ResizeObserver;

function Penaltywaivermonthset() {

    const gridRefTableLeaveCrit = useRef(null);
    const gridRefImageLeaveCrit = useRef(null);

    const { isUserRoleCompare, isUserRoleAccess, allUsersData, isAssignBranch, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [penaltyWaiver, setPenaltywaiver] = useState({
        company: "Please Select Company", branch: "Please Select Branch", processcode: "Please Select Process Code", process: "Please Select Process", employee: "Please Select Employee",
        clienterrocountupto: 0, clienterroramount: 0, clienterrorpercentage: 0, waiverallowupto: 0, waiveramountupto: 0, waiverpercentageupto: 0, validitydays: 0, department: ""
    });

    const [penaltyWaiverEdit, setPenaltywaiverEdit] = useState({
        company: "Please Select Company", branch: "Please Select Branch", processcode: "Please Select Process Code", process: "Please Select Process", employee: "Please Select Employee",
        clienterrocountupto: 0, clienterroramount: 0, clienterrorpercentage: 0, waiverallowupto: 0, waiveramountupto: 0, waiverpercentageupto: 0, validitydays: 0
    });

    const [btnSubmit, setBtnSubmit] = useState(false);

    const [penaltyComp, setPenaltyComp] = useState({
        department: "", year: "",
        monthname: "", fromdate: "", todate: ""
    });
    const [processUniq,setProcessUniq] = useState([]);
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

    const [processQueueCode, setProcessQueueCode] = useState([{ label: "All", value: "All" }]);
    const [processQueue, setProcessQueue] = useState([{ label: "All", value: "All" }]);
    const [employeeOpt, setEmployeeOpt] = useState([{ label: "All", value: "All" }]);

    const [processQueueCodeEdit, setProcessQueueCodeEdit] = useState([{ label: "All", value: "All" }]);
    const [processQueueEdit, setProcessQueueEdit] = useState([{ label: "All", value: "All" }]);
    const [employeeOptEdit, setEmployeeOptEdit] = useState([{ label: "All", value: "All" }]);

    //get all process queue code create.
    const fetchProcessQueueCode = async (e) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = e.value === "All" ? res_freq?.data?.processqueuename : res_freq?.data?.processqueuename.filter((data) => e.value === data.branch);
            const all = [{ label: "All", value: "All" },
            ...data_set.map((d) => ({
                ...d,
                label: d.code,
                value: d.code,
            })),
            ];
            setProcessQueueCode(all.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all process queue code edit.
    const fetchProcessQueueCodeEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = e === "All" ? res_freq?.data?.processqueuename : res_freq?.data?.processqueuename.filter((data) => e === data.branch);

            const all = [{ label: "All", value: "All" },
            ...data_set.map((d) => ({
                ...d,
                label: d.code,
                value: d.code,
            })),
            ];

            setProcessQueueCodeEdit(all.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all procesqueue name create
    const fetchProcessQueue = async (e) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = e.value === "All" ? res_freq?.data?.processqueuename : res_freq?.data?.processqueuename.filter((data) => e.value === data.code);
            const all = [{ label: "All", value: "All" },
            ...data_set.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            })),
            ];

            const getprocess = data_set?.map(data => data.name)
            console.log(getprocess,'getprocess')
            setProcessUniq(getprocess);
            setProcessQueue(all.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all procesqueue name edit
    const fetchProcessQueueEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let data_set = e === "All" ? res_freq?.data?.processqueuename : res_freq?.data?.processqueuename.filter((data) => e === data.code);
            const all = [{ label: "All", value: "All" },
            ...data_set.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            })),
            ];
            const getprocess = data_set?.map(data => data.name)
            console.log(getprocess,'getprocess')
            setProcessUniq(getprocess);
            setProcessQueueEdit(all.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [departments, setDepartments] = useState([]);
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    const [valueCate, setValueCate] = useState([]);
    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);

    };
    const customValueRendererCate = (valueCate, _department) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Department";
    };

    const fetchDepartmentDropdown = async () => {
        setPageName(!pageName)
        try {
            let res_dept = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const deptall = [
                ...res_dept?.data?.departmentdetails.map((d) => ({
                    ...d,
                    label: d.deptname,
                    value: d.deptname,
                })),
            ];
            setDepartments(deptall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all Employee create
    const fetchEmployee = async (e) => {
        setPageName(!pageName)
        try {

            let data_set = (e.value === "All" && penaltyWaiver.branch !== "All" && penaltyWaiver.processcode !== "All") ? allUsersData.filter((data) => penaltyWaiver.company === data.company && penaltyWaiver.branch === data.branch && processUniq?.includes(data.process) && valueCate?.includes(data.department)) :
            (e.value === "All" && penaltyWaiver.branch !== "All" && penaltyWaiver.processcode === "All") ? allUsersData.filter((data) => penaltyWaiver.company === data.company && penaltyWaiver.branch === data.branch && valueCate?.includes(data.department)) :
                (e.value === "All" && penaltyWaiver.branch === "All" && penaltyWaiver.processcode !== "All") ? allUsersData.filter((data) => penaltyWaiver.company === data.company && processUniq?.map((item) => item)?.includes(data.process) && valueCate?.includes(data.department)) :
                (e.value === "All" && penaltyWaiver.branch === "All" && penaltyWaiver.processcode === "All") ? allUsersData.filter((data) => penaltyWaiver.company === data.company && valueCate?.includes(data.department)) :
                    (e.value !== "All" && penaltyWaiver.branch === "All") ? allUsersData.filter((data) => e.value === data.process && penaltyWaiver.company === data.company && valueCate?.includes(data.department)) :
                        allUsersData.filter((data) => e.value === data.process && penaltyWaiver.company === data.company && penaltyWaiver.branch === data.branch && valueCate?.includes(data.department))
                ;

            const all = [{ label: "All", value: "All" },
            ...data_set.map((d) => ({
                ...d,
                label: d.companyname,
                value: d.companyname,
            })),
            ];

            setEmployeeOpt(all.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all Employee create
    const fetchEmployeeEdit = async (e, compval, branchval, dptname, prcode) => {

        setPageName(!pageName)
        try {
            let data_set = (e === "All" && branchval !== "All" && prcode !== "All") ? allUsersData.filter((data) => compval === data.company && branchval === data.branch && processUniq?.includes(data.process) && dptname === data.department) :
            (e === "All" && branchval !== "All" && prcode === "All") ? allUsersData.filter((data) => compval === data.company && branchval === data.branch && dptname === data.department) :
                (e === "All" && branchval === "All" && prcode !== "All") ? allUsersData.filter((data) => compval === data.company && processUniq?.map((item) => item)?.includes(data.process) && dptname === data.department) :
                (e === "All" && branchval === "All" && prcode === "All") ? allUsersData.filter((data) => compval === data.company && dptname === data.department) :
                    (e !== "All" && branchval === "All") ? allUsersData.filter((data) => e.value === data.process && compval === data.company && dptname === data.department) :
                        allUsersData.filter((data) => e === data.process && compval === data.company && branchval === data.branch && dptname === data.department)
                ;

            const all = [{ label: "All", value: "All" },
            ...data_set.map((d) => ({
                ...d,
                label: d.companyname,
                value: d.companyname,
            })),
            ];

            setEmployeeOptEdit(all.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // get current year
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(10), (val, index) => currentYear + index);

    const [penaltyWaivers, setPenaltyWaivers] = useState([]);
    const [penaltyWaiverAllEdit, setPenaltyWaiverAllEdit] = useState([]);

    // State to track advanced filter
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [penaltyCheck, setPenaltycheck] = useState(false);

    const username = isUserRoleAccess.username;
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");

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
        department: true,
        year: true,
        monthname: true,
        fromdate: true,
        todate: true,
        company: true,
        branch: true,
        processcode: true,
        process: true,
        employee: true,
        waiverallowupto: true, clienterrocountupto: true, clienterroramount: true, clienterrorpercentage: true,
        waiveramountupto: true,
        waiverpercentageupto: true,
        validitydays: true,
        actions: true,
    };

    const [columnVisibilityLeaveCrit, setColumnVisibilityLeaveCrit] = useState(initialColumnVisibilityLeaveCrit);

    useEffect(() => {
        getapi();
        fetchDepartmentDropdown();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Penalty Waiver Month Set"),
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
            let res = await axios.get(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteLeavecriteria(res?.data?.spenaltywaivermaster);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let leavesid = deleteLeavecriteria?._id;
    const delLeavecriteria = async () => {
        setPageName(!pageName)
        try {
            if (leavesid) {
                await axios.delete(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${leavesid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchLeavecriteria();
                setIsHandleChange(false);
                handleCloseMod();
                setSelectedRows([]);
                setPageLeaveCrit(1);
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delLeavecheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${item}`, {
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
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function
    const sendRequest = async () => {
        setBtnSubmit(true);
        setPageName(!pageName)

        let modifiedDatas = valueCate?.map((data) => ({
            department: String(data),
            company: String(penaltyWaiver.company),
            branch: String(penaltyWaiver.branch),
            processcode: String(penaltyWaiver.processcode),
            process: String(penaltyWaiver.process),
            employee: String(penaltyWaiver.employee),
            waiverallowupto: Number(penaltyWaiver.waiverallowupto),
            clienterrocountupto: Number(penaltyWaiver.clienterrocountupto),
            clienterroramount: Number(penaltyWaiver.clienterroramount) ? Number(penaltyWaiver.clienterroramount) : 0,
            clienterrorpercentage: Number(penaltyWaiver.clienterrorpercentage) ? Number(penaltyWaiver.clienterrorpercentage) : 0,
            waiveramountupto: Number(penaltyWaiver.waiveramountupto),
            waiverpercentageupto: Number(penaltyWaiver.waiverpercentageupto),
            validitydays: Number(penaltyWaiver.validitydays),


            addedby: [
                {
                    name: String(isUserRoleAccess.companyname),
                    date: String(new Date()),
                },
            ],
        }))

        try {
            let subprojectscreate = await axios.post(SERVICE.PENALTYWAIVERMONTHSETBULK_CREATE, {
                datas: modifiedDatas
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchLeavecriteria();

            setBtnSubmit(false);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isNameMatch = penaltyWaivers.some(
            (item) =>
                item.company === penaltyWaiver.company &&
                item.branch === penaltyWaiver.branch &&
                item.processcode === penaltyWaiver.processcode &&
                item.process === penaltyWaiver.process &&
                item.employee === penaltyWaiver.employee &&
                valueCate.includes(item.department)
        );
        if (valueCate?.length === 0) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiver.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiver.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiver.processcode === "Please Select Code") {
            setPopupContentMalert("Please Select Code");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiver.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiver.employee === "Please Select Employee") {
            setPopupContentMalert("Please Select Employee");
            setPopupSeverityMalert("info");
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
    };

    const handleClear = (e) => {
        e.preventDefault();
        setPenaltywaiver({
            ...penaltyWaiver,
            company: "Please Select Company", branch: "Please Select Branch", processcode: "Please Select Process Code", process: "Please Select Process", employee: "Please Select Employee",
            waiverallowupto: "", waiveramountupto: "", waiverpercentageupto: "", validitydays: "", clienterrocountupto: "",
            clienterroramount: "",
            clienterrorpercentage: "",

        });
        setPenaltyComp({
            department: "", year: "",
            monthname: "", fromdate: "", todate: ""
        });
        setProcessQueueCode([{ label: "All", value: "All" }]);
        setProcessQueue([{ label: "All", value: "All" }]);
        setEmployeeOpt([{ label: "All", value: "All" }]);
        setSelectedOptionsCate([]);
        setValueCate([]);
        setProcessUniq([]);
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

    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPenaltywaiverEdit(res?.data?.spenaltywaivermaster)
            fetchProcessQueueCodeEdit(res?.data?.spenaltywaivermaster.branch)
            fetchProcessQueueEdit(res?.data?.spenaltywaivermaster.processcode)
            fetchEmployeeEdit(res?.data?.spenaltywaivermaster?.process, res?.data?.spenaltywaivermaster.company, res?.data?.spenaltywaivermaster.branch, res?.data?.spenaltywaivermaster?.department, res?.data?.spenaltywaivermaster?.processcode)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPenaltywaiverEdit(res?.data?.spenaltywaivermaster)
            handleClickOpenview();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPenaltywaiverEdit(res?.data?.spenaltywaivermaster);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = penaltyWaiverEdit?.updatedby;
    let addedby = penaltyWaiverEdit?.addedby;
    let subprojectsid = penaltyWaiverEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)

        try {
            let res = await axios.put(`${SERVICE.PENALTYWAIVERMONTHSET_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: String(penaltyWaiverEdit.department),
                company: String(penaltyWaiverEdit.company),
                branch: String(penaltyWaiverEdit.branch),
                processcode: String(penaltyWaiverEdit.processcode),
                process: String(penaltyWaiverEdit.process),
                employee: String(penaltyWaiverEdit.employee),
                waiverallowupto: Number(penaltyWaiverEdit.waiverallowupto),
                clienterrocountupto: Number(penaltyWaiverEdit.clienterrocountupto) ? Number(penaltyWaiverEdit.clienterrocountupto) : 0,
                clienterroramount: Number(penaltyWaiverEdit.clienterroramount),
                clienterrorpercentage: Number(penaltyWaiverEdit.clienterrorpercentage) ? Number(penaltyWaiverEdit.clienterrorpercentage) : 0,
                waiveramountupto: Number(penaltyWaiverEdit.waiveramountupto),
                waiverpercentageupto: Number(penaltyWaiverEdit.waiverpercentageupto),
                validitydays: Number(penaltyWaiverEdit.validitydays),
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
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        fetchLeavecriteriaAll();
        const isNameMatch = penaltyWaiverAllEdit.some(
            (item) =>
                item.company === penaltyWaiverEdit.company &&
                item.branch === penaltyWaiverEdit.branch &&
                item.processcode === penaltyWaiverEdit.processcode &&
                item.process === penaltyWaiverEdit.process &&
                item.employee === penaltyWaiverEdit.employee &&
                item.department === penaltyWaiverEdit.department
        );
        if (penaltyWaiverEdit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiverEdit.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiverEdit.processcode === "Please Select Code") {
            setPopupContentMalert("Please Select Code");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiverEdit.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyWaiverEdit.employee === "Please Select Employee") {
            setPopupContentMalert("Please Select Employee");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest()
        }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteria = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.PENALTYWAIVERMONTHSET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const itemsWithSerialNumber = res_vendor?.data?.penaltywaivermasters?.map((item, index) => (
                {
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    fromdate: item.fromdate,
                    // todate: item.todate ? moment(item.todate).isValid() ? moment(item.todate).format("DD-MM-YYYY") : "" : "",
                    todate: item.todate,
                    waiverallowupto: item.waiverallowupto,
                    clienterrocountupto: item.clienterrocountupto,
                    clienterroramount: item.clienterroramount,
                    clienterrorpercentage: item.clienterrorpercentage,
                    waiveramountupto: item.waiveramountupto,
                    waiverpercentageupto: item.waiverpercentageupto,
                    validitydays: item.validitydays,
                }));
            setPenaltyWaivers(itemsWithSerialNumber);
            setPenaltycheck(true);
            setTotalPagesLeaveCrit(Math.ceil(itemsWithSerialNumber.length / pageSizeLeaveCrit));
        } catch (err) { setPenaltycheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteriaAll = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.PENALTYWAIVERMONTHSET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPenaltyWaiverAllEdit(res_vendor?.data?.penaltywaivermasters.filter((item) => item._id != penaltyWaiverEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchLeavecriteria();
        fetchLeavecriteriaAll();
    }, []);

    useEffect(() => {
        fetchLeavecriteriaAll();
    }, [isEditOpen, penaltyWaiverEdit]);

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
        addSerialNumber(penaltyWaivers);
    }, [penaltyWaivers]);

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
        { field: "department", headerName: "Department", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.department, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.branch, headerClassName: "bold-header" },
        { field: "processcode", headerName: "Code", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.processcode, headerClassName: "bold-header" },
        { field: "process", headerName: "Process", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.process, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.employee, headerClassName: "bold-header" },
        { field: "waiverallowupto", headerName: "Waiver Amount", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.waiverallowupto, headerClassName: "bold-header" },
        { field: "waiveramountupto", headerName: "No.of Waiver", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.waiveramountupto, headerClassName: "bold-header" },
        { field: "waiverpercentageupto", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.waiverpercentageupto, headerClassName: "bold-header" },
        { field: "clienterrocountupto", headerName: "Client Error Count", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.clienterrocountupto, headerClassName: "bold-header" },
        { field: "clienterroramount", headerName: "Client Error Amount", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.clienterroramount, headerClassName: "bold-header" },
        { field: "clienterrorpercentage", headerName: "Client Error %", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.clienterrorpercentage, headerClassName: "bold-header" },
        { field: "validitydays", headerName: "Days", flex: 0, width: 120, hide: !columnVisibilityLeaveCrit.validitydays, headerClassName: "bold-header" },

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
                        {isUserRoleCompare?.includes("epenaltywaivermonthset") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCode(params.data.id, params.data.name);
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("dpenaltywaivermonthset") && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.data.id, params.data.name);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("vpenaltywaivermonthset") && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getviewCode(params.data.id);
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        )}
                        {isUserRoleCompare?.includes("ipenaltywaivermonthset") && (
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
            department: item.department,
            year: item.year,
            monthname: item.monthname,
            fromdate: item.fromdate,
            todate: item.todate,
            company: item.company,
            branch: item.branch,
            processcode: item.processcode,
            process: item.process,
            employee: item.employee,
            waiverallowupto: item.waiverallowupto,
            waiveramountupto: item.waiveramountupto,
            waiverpercentageupto: item.waiverpercentageupto,
            validitydays: item.validitydays,
            clienterrocountupto: item.clienterrocountupto,
            clienterroramount: item.clienterroramount,
            clienterrorpercentage: item.clienterrorpercentage
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
        'Department', 'Company', 'Branch', 'Code',
        'Process', 'Employee', 'Waiver Amount', 'No.of Waiver', 'Percentage', 'Client Error Count', 'Client Error Amount', 'Client Error Percentage', 'Days']
    let exportRowValuescrt = [
        'department', 'company', 'branch', 'processcode',
        'process', 'employee', 'waiverallowupto', 'waiveramountupto', 'waiverpercentageupto', 'clienterrocountupto', 'clienterroramount', 'clienterrorpercentage', 'validitydays']

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Penalty Waiver Month Set",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageLeaveCrit.current) {
            domtoimage.toBlob(gridRefImageLeaveCrit.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Waiver Month Set.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Penalty Waiver Month Set"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Penalty Waiver Month Set"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Penalty Waiver Month Set"
            />
            {isUserRoleCompare?.includes("apenaltywaivermonthset") && (
                <>
                    <br />
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        <b>Add Penalty Waiver Month Set</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Department<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={departments}
                                            value={selectedOptionsCate}
                                            onChange={handleCategoryChange}
                                            valueRenderer={customValueRendererCate}
                                            labelledBy="Please Select Department"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            placeholder="Please Select Company"
                                            value={{ label: penaltyWaiver.company, value: penaltyWaiver.company }}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    processcode: "Please Select Process Code",
                                                    process: "Please Select Process",
                                                    employee: "Please Select Employee",
                                                });
                                                setProcessQueueCode([{ label: "All", value: "All" }])
                                                setProcessQueue([{ label: "All", value: "All" }])
                                                setEmployeeOpt([{ label: "All", value: "All" }])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={[{ label: "All", value: "All" }, ...isAssignBranch
                                                ?.filter(comp => comp.company === penaltyWaiver?.company)
                                                ?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })]}
                                            placeholder="Please Select Branch"
                                            value={{ label: penaltyWaiver.branch, value: penaltyWaiver.branch }}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    branch: e.value,
                                                    processcode: "Please Select Process Code",
                                                    process: "Please Select Process",
                                                    employee: "Please Select Employee",
                                                });
                                                setProcessQueueCode([{ label: "All", value: "All" }])
                                                setProcessQueue([{ label: "All", value: "All" }])
                                                setEmployeeOpt([{ label: "All", value: "All" }])
                                                fetchProcessQueueCode(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Code<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={processQueueCode}
                                            value={{ label: penaltyWaiver.processcode, value: penaltyWaiver.processcode }}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    processcode: e.value,
                                                    process: "Please Select Process",
                                                    employee: "Please Select Employee",
                                                });
                                                setProcessQueue([{ label: "All", value: "All" }])
                                                setEmployeeOpt([{ label: "All", value: "All" }])
                                                fetchProcessQueue(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Process <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={processQueue}
                                            value={{ label: penaltyWaiver.process, value: penaltyWaiver.process }}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    process: e.value,
                                                    employee: "Please Select Employee",
                                                });
                                                fetchEmployee(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={employeeOpt}
                                            value={{ label: penaltyWaiver.employee, value: penaltyWaiver.employee }}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    employee: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Waiver Allow Upto
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Number Count"
                                            value={penaltyWaiver.waiverallowupto}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    waiverallowupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Waiver Amount UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Amount"
                                            value={penaltyWaiver.waiveramountupto}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    waiveramountupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Waiver Percentage UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Percentage"
                                            value={penaltyWaiver.waiverpercentageupto}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    waiverpercentageupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Error Allow Upto
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Number Count"
                                            value={penaltyWaiver.clienterrocountupto}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    clienterrocountupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Error Amount UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Amount"
                                            value={penaltyWaiver.clienterroramount}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    clienterroramount: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Error Percentage UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Percentage"
                                            value={penaltyWaiver.clienterrorpercentage}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    clienterrorpercentage: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Validity Days
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Days"
                                            value={penaltyWaiver.validitydays}
                                            onChange={(e) => {
                                                setPenaltywaiver({
                                                    ...penaltyWaiver,
                                                    validitydays: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
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
            )} <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpenaltywaivermonthset") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Penalty Waiver Month Set List</Typography>
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
                                    {isUserRoleCompare?.includes("excelpenaltywaivermonthset") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpenaltywaivermonthset") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpenaltywaivermonthset") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpenaltywaivermonthset") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepenaltywaivermonthset") && (
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
                                    maindatas={penaltyWaivers}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQueryLeaveCrit}
                                    setSearchQuery={setSearchQueryLeaveCrit}
                                    paginated={false}
                                    totalDatas={penaltyWaivers}
                                />
                            </Grid>
                        </Grid>   <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsLeaveCrit}> Manage Columns  </Button>&ensp;
                        {isUserRoleCompare?.includes("bdpenaltywaivermonthset") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>)}<br /><br />
                        {!penaltyCheck ? (
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
                                        itemsList={penaltyWaivers}
                                    />
                                </Box>

                            </>
                        )}
                    </Box>

                </>
            )}

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
                <DialogContent sx={{ width: "1300px" }}>
                    {/* <Box sx={{ padding: '20px', width: '850px' }}> */}
                    <>
                        <form onSubmit={editSubmit}>
                            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}

                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText} >
                                        <b>Edit Penalty Waiver Month Set</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Department
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            placeholder="Please Enter Name"
                                            value={penaltyWaiverEdit.department}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={
                                                isAssignBranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) =>
                                                    self.findIndex(i => i.label === item.label && i.value === item.value) === index
                                                )
                                            }
                                            placeholder="Please Select Company"
                                            value={{ label: penaltyWaiverEdit.company, value: penaltyWaiverEdit.company }}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    processcode: "Please Select Process Code",
                                                    process: "Please Select Process",
                                                    employee: "Please Select Employee",
                                                });
                                                setProcessQueueCodeEdit([{ label: "All", value: "All" }])
                                                setProcessQueueEdit([{ label: "All", value: "All" }])
                                                setEmployeeOptEdit([{ label: "All", value: "All" }])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={[{ label: "All", value: "All" },
                                            ...isAssignBranch
                                                ?.filter(comp => comp.company === penaltyWaiverEdit?.company)
                                                .map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) =>
                                                    self.findIndex(i => i.label === item.label && i.value === item.value) === index
                                                )
                                            ]}
                                            placeholder="Please Select Branch"
                                            value={{ label: penaltyWaiverEdit.branch, value: penaltyWaiverEdit.branch }}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    branch: e.value,
                                                    processcode: "Please Select Process Code",
                                                    process: "Please Select Process",
                                                    employee: "Please Select Employee",
                                                });
                                                setProcessQueueCodeEdit([{ label: "All", value: "All" }])
                                                setProcessQueueEdit([{ label: "All", value: "All" }])
                                                setEmployeeOptEdit([{ label: "All", value: "All" }])
                                                fetchProcessQueueCodeEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Code<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={processQueueCodeEdit}
                                            value={{ label: penaltyWaiverEdit.processcode, value: penaltyWaiverEdit.processcode }}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    processcode: e.value,
                                                    process: "Please Select Process",
                                                    employee: "Please Select Employee",
                                                });
                                                setProcessQueueEdit([{ label: "All", value: "All" }])
                                                setEmployeeOptEdit([{ label: "All", value: "All" }])
                                                fetchProcessQueueEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Process <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={processQueueEdit}
                                            value={{ label: penaltyWaiverEdit.process, value: penaltyWaiverEdit.process }}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    process: e.value,
                                                    employee: "Please Select Employee",
                                                });
                                                fetchEmployeeEdit(e.value, penaltyWaiverEdit.company, penaltyWaiverEdit.branch, penaltyWaiverEdit.department, penaltyWaiverEdit.processcode);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name  <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            styles={colourStyles}
                                            options={employeeOptEdit}
                                            value={{ label: penaltyWaiverEdit.employee, value: penaltyWaiverEdit.employee }}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    employee: e.value,
                                                });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Waiver Allow Upto
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Number Count"
                                            value={penaltyWaiverEdit.waiverallowupto}
                                            // value={penaltyWaiverEdit.waiverallowupto === "" || penaltyWaiverEdit.waiverallowupto === 0 ? "" : penaltyWaiverEdit.waiverallowupto}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    waiverallowupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Waiver Amount UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Amount"
                                            value={penaltyWaiverEdit.waiveramountupto}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    waiveramountupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Waiver Percentage UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Percentage"
                                            value={penaltyWaiverEdit.waiverpercentageupto}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    waiverpercentageupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Error Allow Upto
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Number Count"
                                            value={penaltyWaiverEdit.clienterrocountupto}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    clienterrocountupto: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Error Amount UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Amount"
                                            value={penaltyWaiverEdit.clienterroramount}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    clienterroramount: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Client Error Percentage UpTo
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Percentage"
                                            value={penaltyWaiverEdit.clienterrorpercentage}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    clienterrorpercentage: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Validity Days
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Days"
                                            value={penaltyWaiverEdit.validitydays}
                                            onChange={(e) => {
                                                setPenaltywaiverEdit({
                                                    ...penaltyWaiverEdit,
                                                    validitydays: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>




                            </Grid>

                            <br />

                            <Grid container spacing={1}>
                                <Grid item lg={1} md={2} sm={2} xs={12} >
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
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
                        </form>
                    </>
                    {/* </Box> */}
                </DialogContent>
            </Dialog>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '95px' }}>
                {/* <Box sx={{ padding: '30px 70px', width:"1000px" }}> */}
                <DialogContent sx={{ width: "1050px" }}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    <b>View Penalty Waiver Month Set</b>
                                </Typography>
                            </Grid>

                        </Grid>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Department</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.department}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.company}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.branch}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Code</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.processcode}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Process</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.process}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Employee Name</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.process}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Waiver Allow Upto</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.waiverallowupto}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Waiver Amount Upto</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.waiveramountupto}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Waiver Percentage Upto</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.waiverpercentageupto}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Client Error Allow Upto</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.clienterrocountupto}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Client Error Amount Upto</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.clienterroramount}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Client Error Percentage Upto</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.clienterrorpercentage}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Validity Days</Typography>
                                    <Typography>
                                        {penaltyWaiverEdit.validitydays}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <br />


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
                itemsTwo={penaltyWaivers ?? []}
                filename={"Penalty Waiver Month Set"}
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
                heading="Penalty Waiver Month Set Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box>
    );
}

export default Penaltywaivermonthset;