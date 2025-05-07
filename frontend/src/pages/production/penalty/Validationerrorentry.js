import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import {
    Box, Button, Chip, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem,
    OutlinedInput, Popover, Select, TextField, Typography, CircularProgress,

} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import { PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";
import moment from "moment-timezone";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";


function ValidationErroEntry() {

    const [selectedTable, setSelectedTable] = useState([]);
    const [valueTable, setValueTable] = useState([]);
    const [tableCheck, setTableCheck] = useState([]);
    const [loader, setLoader] = useState(false);


    const tableOptions = [
        { label: "Validation Error Entry List", value: "Validation Error Entry List" },
        { label: "Invalid/Valid Updated List", value: "Invalid/Valid Updated List" },

    ];
    const [isusercompleted, setisusercompleted] = useState([]);

    //Table Mode multiselect
    const handleTableChange = (options) => {
        setValueTable(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTable(options);
    };

    const customValueRendererCompany = (valueTable, _categoryname) => {
        return valueTable?.length
            ? valueTable.map(({ label }) => label)?.join(", ")
            : "Please Select Table Mode";
    };

    const [loaderList, setLoaderList] = useState(false)
    const [filterList, setFilterList] = useState([])
    const [loginIdOptFilter, setClientLoginIDOptFilter] = useState([])

    const [selectProjectVendor, setSelectedProjectVendor] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedSLoginId, setSelectedLoginId] = useState([]);
    const [errorType, setErrorType] = useState([]);
    const [errorReason, setErrorReason] = useState([]);
    const [errormode, setErrormode] = useState([]);
    const [status, setStatus] = useState([]);
    const [viewsingleData, setviewsingleData] = useState({
        projectvendor: "",
        process: "",
        loginid: "",
        date: "",
        errorfilename: "",
        documentnumber: "",
        documenttype: "",
        filename: "",
        fieldname: "",
        line: "",
        errorvalue: "",
        correctvalue: "",
        link: "",
        doclink: ""
    });


    const [managetypepgState, setManagetypepgState] = useState({
        process: "Please Select Process",
        errortype: "Please Select Error Type",
        errortypepost: "Please Select Error Type",
        errortypestatus: "Error Status",
        reason: "Please Select Reason",
        errorseverity: "",
        explanation: "",
        status: "",
    });

    const fetchErrorTypeDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.ERROR_TYPE_FILTER, {
                headers: {

                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: viewsingleData.projectvendor,
                process: viewsingleData.process
            });

            setErrorType(res_project?.data?.penaltyerrorupload.map((data) => ({
                label: data.errortype + "-" + data.status,
                value: data.errortype + "-" + data.status,
                errortype: data.status,
                errortypereason: data.errortype
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchErrorStatusDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.ERROR_REASON_FILTER_STATUS, {
                headers: {

                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: viewsingleData.projectvendor,
                process: viewsingleData.process,
                errortype: managetypepgState.errortypepost,
            });

            setStatus(res_project?.data?.penaltyerrorupload.map((data) => ({
                label: data.status,
                value: data.status
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchErrorReasonDropdowns = async (errortype) => {

        setPageName(!pageName)
        try {
            let res_project = await axios.post(SERVICE.ERROR_REASON_FILTER, {
                headers: {

                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: viewsingleData.projectvendor,
                process: viewsingleData.process,
                errortype: errortype,
            });

            setErrorReason(res_project?.data?.penaltyerrorreason.map((data) => ({
                label: data.reason,
                value: data.reason
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchErrorModeDropdowns = async () => {
        setPageName(!pageName)
        if (viewsingleData) {
            const resvendor = viewsingleData.projectvendor?.split("-");
            try {
                let res_project = await axios.post(SERVICE.ERROR_MODE_FILTER, {
                    headers: {

                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: resvendor[0],
                    process: viewsingleData.process,
                    fieldname: viewsingleData.fieldname,
                });

                setErrormode(res_project?.data?.errormodes?.mode)
            }

            catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
        }
    };

    useEffect(() => {
        fetchErrorTypeDropdowns();
        fetchErrorModeDropdowns();
        fetchErrorStatusDropdowns();
    }, [viewsingleData])

    const handleProjecvendor = (options) => {
        setSelectedProjectVendor(options);
        setSelectedProcess([]);
        setSelectedLoginId([])
        fetchProcessQueueFilter(options.map(d => d.value));

        fetchClientUserIDFilter(options.map(d => d.value));
    };
    const customValueRendererProject = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select ProjectVendor";
    };


    const handleProcess = (options) => {
        setSelectedProcess(options);
        setSelectedLoginId([])
    };
    const customValueRendererProcess = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Process";
    };

    const handleLoginId = (options) => {
        setSelectedLoginId(options);
    };
    const customValueLoginId = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select LoginId";
    };



    const [projOpt, setProjOpt] = useState([])
    const [processOptFilter, setProcessQueueArrayFilter] = useState([])

    const getProject = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.VENDORMASTER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projectOpt = [...response.data.vendormaster.map((t) => ({ ...t, label: t.projectname + "-" + t.name, value: t.projectname + "-" + t.name }))]
            setProjOpt(projectOpt);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchProcessQueueFilter = async (projname) => {

        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => projname.includes(item.projectvendor))
            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue
            }))
            setProcessQueueArrayFilter(Que);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchClientUserIDFilter = async (proj) => {
        setPageName(!pageName)
        try {
            // let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            // const filterProjBased = res_freq?.data?.clientuserid.filter((item) => proj.includes(item.projectvendor))

            let res_vendor = await axios.post(SERVICE.CLIENT_USER_ID_VALIDATION_ERROR_ENTRY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                role: isUserRoleAccess.role,
                project: proj,
                companyname: isUserRoleAccess.companyname,
                date: fromdate,
            });

            // let alluseridNames = res_vendor?.data?.clientuserid;
            let alluseridNamesadmin = res_vendor?.data?.clientuserid.map((d) => ({
                ...d,
                label: d.userid,
                value: d.userid,
            }));
            setClientLoginIDOptFilter(alluseridNamesadmin);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        getProject();
    }, []);

    const [loginIdOptEdit, setClientLoginIDOptEdit] = useState([])
    const [processOptEdit, setProcessQueueArrayEdit] = useState([])

    //get all client user id.
    const fetchClientUserIDEdit = async (proj) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterProjBased = res_freq?.data?.clientuserid.filter((item) => item.projectvendor === proj)
            const loginIdOpt = [...filterProjBased.map((d) => ({
                ...d,
                label: d.userid,
                value: d.userid,
            }))];
            setClientLoginIDOptEdit(loginIdOpt);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all client user id.
    const fetchProcessQueueEdit = async (projname) => {
        const projName = projname?.split("-")[0]
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => item.projectvendor === projname)

            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue
            }))
            setProcessQueueArrayEdit(Que);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const [editsingleData, setEditsingleData] = useState({
        fromdate: "",
        todate: "",
        projectvendor: "",
        process: "",
        loginid: "",
        date: "",
        errorfilename: "",
        documentnumber: "",
        documenttype: "",
        filename: "",
        fieldname: "",
        mode: "",
        line: "",
        errorvalue: "",
        correctvalue: "",
        link: "",
        doclink: ""
    });

    const [selectedMode, setSelectedMode] = useState("Today");

    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
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

    const exportColumnNames = [
        "Employee Name", "Branch", "Unit",
        'Project Vendor', 'Process',
        'Login ID', 'Date',
        'Error File Name', 'Document Number',
        'Document type', 'Field Name',
        'Line', 'Error Value',
        'Correct value', 'Link',
        'Doc Link', "Entry Creation", "Mode", "Manual Completed", "Supervisor Completed"
    ]
    const exportRowValues = [
        "name", "branch", "unit",
        'projectvendor', 'process',
        'loginid', 'date',
        'errorfilename', 'documentnumber',
        'documenttype', 'fieldname',
        'line', 'errorvalue',
        'correctvalue', 'link',
        'doclink', 'mode', 'errormode', 'manaulerrorcheck', 'erroruploadconfirmcheck'
    ]


    const exportColumnNamescom = [
        "Employee Name", "Branch", "Unit",
        'Project Vendor', 'Process',
        'Login ID', 'Date',
        'Error File Name', 'Document Number',
        'Document type', 'Field Name',
        'Line', 'Error Value',
        'Correct value', 'Link',
        'Doc Link', "Entry Creation", "Mode", "Status", "Manual Completed", "Supervisor Completed"
    ]
    const exportRowValuescom = [
        "name", "branch", "unit",
        'projectvendor', 'process',
        'loginid', 'date',
        'errorfilename', 'documentnumber',
        'documenttype', 'fieldname',
        'line', 'errorvalue',
        'correctvalue', 'link',
        'doclink', 'mode', 'errormode', 'status', 'manaulerrorcheck', 'erroruploadconfirmcheck'
    ]

    const [loadingdeloverall, setloadingdeloverall] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [openviewalert, setOpenviewalert] = useState(false);


    //completed
    const [filteredRowDatacom, setFilteredRowDatacom] = useState([]);
    const [filteredChangescom, setFilteredChangescom] = useState(null);
    const [isHandleChangecom, setIsHandleChangecom] = useState(false);
    const [searchedStringcom, setSearchedStringcom] = useState("");
    const gridRefTablecom = useRef(null);
    const gridRefTableImgcom = useRef(null);

    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };
    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Validation Error Entry List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleCaptureImagecom = () => {
        if (gridRefTableImgcom.current) {
            domtoimage.toBlob(gridRefTableImgcom.current)
                .then((blob) => {
                    saveAs(blob, "Invalid/Valid Updated List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const [searchQueryManagecom, setSearchQueryManagecom] = useState("");
    const [searchQuerycom, setSearchQuerycom] = useState("");

    const [isFilterOpencom, setIsFilterOpencom] = useState(false);
    const [isPdfFilterOpencom, setIsPdfFilterOpencom] = useState(false);

    // page refersh reload
    const handleCloseFilterModcom = () => {
        setIsFilterOpencom(false);
    };

    const handleClosePdfFilterModcom = () => {
        setIsPdfFilterOpencom(false);
    };



    const componentRefcom = useRef();
    const handleprintcom = useReactToPrint({
        content: () => componentRefcom.current,
        documentTitle: "Invalid/Valid Updated List",
        pageStyle: "print",
    });


    const [pagecom, setPagecom] = useState(1);
    const [pageSizecom, setPageSizecom] = useState(10);


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            // setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
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

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        name: true,
        branch: true,
        manaulerrorcheck: true,
        erroruploadconfirmcheck: true,
        unit: true,
        errormode: true,
        projectvendor: true,
        process: true,
        loginid: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        status: true,
        correctvalue: true,
        mode: true,
        link: true,
        greentext: true,
        doclink: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
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

    //Edit model...
    const [isEditOpenError, setIsEditOpenError] = useState(false);
    const handleClickOpenEditError = () => {
        setIsEditOpenError(true);
    };
    const handleCloseModEditError = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenError(false);
        setManagetypepgState({
            ...managetypepgState,
            process: "Please Select Process",
            errortype: "Please Select Error Type",
            errortypepost: "Please Select Error Type",
            errortypestatus: "Error Status",
            reason: "Please Select Reason",
            errorseverity: "",
            explanation: "",
            status: "",
        })

    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Project updateby edit page...
    let updateby = editsingleData.updatedby;
    let addedby = editsingleData.addedby;

    const [updateCounts, setUpdateCounts] = useState({}); // Track update counts


    //editing the single data...
    const sendEditRequest = async () => {
        let projectsid = editsingleData._id;
        setPageName(!pageName)
        let currentCount = updateCounts[projectsid] ? updateCounts[projectsid] : 1;
        console.log(currentCount, "currentCount")
        if (currentCount > 4) {
            setPopupContentMalert(`Update for should not exceed 4 times`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return;
        }
        try {

            if (editsingleData.mode == "Bulkupload" || editsingleData.mode == "Bulkkeying") {

                let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: String(editsingleData.projectvendor),
                    process: String(editsingleData.process),
                    loginid: String(editsingleData.loginid),
                    date: String(editsingleData.date),
                    errorfilename: String(editsingleData.errorfilename),
                    documentnumber: String(editsingleData.documentnumber),
                    documenttype: String(editsingleData.documenttype),
                    fieldname: String(editsingleData.fieldname),
                    line: String(editsingleData.line),
                    errorvalue: String(editsingleData.errorvalue),
                    correctvalue: String(editsingleData.correctvalue),
                    link: String(editsingleData.link),
                    doclink: String(editsingleData.doclink),
                    validatestatus: true,
                    errorseverity: String(errormode),
                    editedcount: currentCount,
                    updatedby: [

                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                setUpdateCounts((prevCounts) => ({
                    ...prevCounts,
                    [projectsid]: currentCount + 1,
                }));

                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                await fetchBatchFilter();

            }
            else {


                let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: String(editsingleData.projectvendor),
                    process: String(editsingleData.process),
                    loginid: String(editsingleData.loginid),
                    date: String(editsingleData.date),
                    errorfilename: String(editsingleData.errorfilename),
                    documentnumber: String(editsingleData.documentnumber),
                    documenttype: String(editsingleData.documenttype),
                    fieldname: String(editsingleData.fieldname),
                    line: String(editsingleData.line),
                    errorvalue: String(editsingleData.errorvalue),
                    correctvalue: String(editsingleData.correctvalue),
                    link: String(editsingleData.link),
                    doclink: String(editsingleData.doclink),
                    validatestatus: true,
                    editedcount: currentCount,
                    errorseverity: String(errormode),
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

            }

            await fetchBatchFilter();

            setUpdateCounts((prevCounts) => ({
                ...prevCounts,
                [projectsid]: currentCount + 1,
            }));


            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        if (editsingleData.projectvendor === "") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert()
        } else if (editsingleData.process === "") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert()
        } else if (editsingleData.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.date == "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorfilename == "") {
            setPopupContentMalert("Please Enter Error File Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.documentnumber == "") {
            setPopupContentMalert("Please Enter Document Number");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.documenttype == "") {
            setPopupContentMalert("Please Enter Document Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.fieldname == "") {
            setPopupContentMalert("Please Enter Field Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.line == "") {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorvalue == "") {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.correctvalue == "") {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.link == "") {
            setPopupContentMalert("Please Enter Link");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.doclink == "") {
            setPopupContentMalert("Please Enter Doc Link");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };
    const sendEditRequestErrorLoad = async () => {
        let projectsid = viewsingleData._id;
        setPageName(!pageName)
        try {

            if (viewsingleData.mode == "Bulkupload" || viewsingleData.mode == "Bulkkeying") {

                let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: String(viewsingleData.projectvendor),
                    process: String(viewsingleData.process),
                    loginid: String(viewsingleData.loginid),
                    date: String(viewsingleData.date),
                    errorfilename: String(viewsingleData.errorfilename),
                    documentnumber: String(viewsingleData.documentnumber),
                    documenttype: String(viewsingleData.documenttype),
                    fieldname: String(viewsingleData.fieldname),

                    line: String(viewsingleData.line),
                    errorvalue: String(viewsingleData.errorvalue),
                    correctvalue: String(viewsingleData.correctvalue),
                    link: String(viewsingleData.link),
                    doclink: String(viewsingleData.doclink),
                    errortype: String(managetypepgState.errortype),
                    reason: String(managetypepgState.reason),
                    explanation: String(managetypepgState.explanation),
                    status: String(managetypepgState.errortypepost),
                    errorseverity: String(errormode),

                    validatestatus: true,


                    updatedby: [

                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
                setPopupContent("Saved Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                await fetchBatchFilter();

            }


            else {


                let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: String(viewsingleData.projectvendor),
                    process: String(viewsingleData.process),
                    loginid: String(viewsingleData.loginid),
                    date: String(viewsingleData.date),
                    errorfilename: String(viewsingleData.errorfilename),
                    documentnumber: String(viewsingleData.documentnumber),
                    documenttype: String(viewsingleData.documenttype),
                    fieldname: String(viewsingleData.fieldname),

                    line: String(viewsingleData.line),
                    errorvalue: String(viewsingleData.errorvalue),
                    correctvalue: String(viewsingleData.correctvalue),
                    link: String(viewsingleData.link),
                    doclink: String(viewsingleData.doclink),


                    //validation

                    errortype: String(managetypepgState.errortype),
                    reason: String(managetypepgState.reason),
                    explanation: String(managetypepgState.explanation),
                    status: String(managetypepgState.errortypepost),
                    errorseverity: String(errormode),
                    validatestatus: true,

                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

            }

            await fetchBatchFilter();

            setPopupContent("Saved Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEditError();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    const editSubmitErrorLoad = async (e) => {
        e.preventDefault();


        if (managetypepgState.errortype == "Please Select Error Type") {
            setPopupContentMalert("Please Select Error Type");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (managetypepgState.reason == "Please Select Reason") {
            setPopupContentMalert("Please Select Error Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (managetypepgState.explanation == "") {
            setPopupContentMalert("Please Enter Explanation To Avoid");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequestErrorLoad();
        }
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Validation Error Entry List",
        pageStyle: "print",
    });

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {


        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(filterList);
    }, [filterList]);

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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "name",
            headerName: "Employee Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 130,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 130,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 130,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 130,

            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 130,
            hide: !columnVisibility.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 130,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "errorfilename",
            headerName: "Error File Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorfilename,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.link} >{params.data.errorfilename}</a>

                </Grid>
            ),
        },
        {
            field: "documentnumber",
            headerName: "Document Number",
            flex: 0,
            width: 140,
            hide: !columnVisibility.documentnumber,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.doclink} >{params.data.documentnumber}</a>

                </Grid>
            ),
        },
        {
            field: "documenttype",
            headerName: "Document Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.documenttype,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "Field Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fieldname,
            headerClassName: "bold-header",
        },
        {
            field: "line",
            headerName: "Line",
            flex: 0,
            width: 130,
            hide: !columnVisibility.line,
            headerClassName: "bold-header",
        },
        {
            field: "errorvalue",
            headerName: "Error Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorvalue,
            headerClassName: "bold-header",
        },
        {
            field: "correctvalue",
            headerName: "Correct Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.correctvalue,
            headerClassName: "bold-header",
        },
        {
            field: "link",
            headerName: "Link",
            flex: 0,
            width: 150,
            hide: !columnVisibility.link,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.link} >{params.data.link}</a>

                </Grid>
            ),
        },
        {
            field: "doclink",
            headerName: "Doc Link",
            flex: 0,
            width: 150,
            hide: !columnVisibility.doclink,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.doclink} >{params.data.doclink}</a>

                </Grid>
            ),
        },
        {
            field: "mode",
            headerName: "Entry Creation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",
        },
        {
            field: "errormode",
            headerName: "Mode",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errormode,
            headerClassName: "bold-header",
        },
        {
            field: "manaulerrorcheck",
            headerName: "Manual Completed",
            flex: 0,
            width: 150,
            hide: !columnVisibility.manaulerrorcheck,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return params.data.manaulerrorcheck === "YES" ? (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="success"
                        variant="outlined"
                        label="YES"
                    />
                ) : (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="warning"
                        variant="outlined"
                        label="No"
                    />
                );
            }
        },
        {
            field: "erroruploadconfirmcheck",
            headerName: "Supervisor Completed",
            flex: 0,
            width: 150,
            hide: !columnVisibility.erroruploadconfirmcheck,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return params.data.erroruploadconfirmcheck === "YES" ? (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="success"
                        variant="outlined"
                        label="YES"
                    />
                ) : (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="warning"
                        variant="outlined"
                        label="No"
                    />
                );
            }
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ backgroundColor: "#d32f2f", color: "white" }}
                        disabled={params?.data?.validatestatus === "true"}
                        onClick={() => {
                            getCode(params.data.id, params.data.mode, params.data.olddate);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        sx={userStyle.buttonedit}
                        disabled={params?.data?.validatestatus === "true"}
                        onClick={() => {
                            getCodeView(params.data.id, params.data.mode, params.data, params.data.olddate);
                        }}
                    >
                        <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />

                    </Button>


                </Grid>
            ),
        },
    ];
    function formatDate(dateString) {
        if (!dateString) {
            return ''; // Return an empty string or handle the error as needed
        }
        const dateParts = dateString.split('-');
        if (dateParts.length !== 3) {
            return ''; // Return an empty string or handle the error as needed
        }
        const formattedDay = dateParts[0]?.padStart(2, '0');
        const formattedMonth = dateParts[1]?.padStart(2, '0');
        const formattedYear = dateParts[2];
        return `${formattedDay}-${formattedMonth}-${formattedYear}`;

    }

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item.id,
            serialNumber: item.serialNumber,
            errormode: item.errormode,
            name: item.name,
            olddate: item.olddate,
            branch: item.branch,
            unit: item.unit,
            projectvendor: item.projectvendor,
            process: item.process,
            loginid: item.loginid,
            date: item.date,
            errorfilename: item.errorfilename,
            documentnumber: item.documentnumber,
            documenttype: item.documenttype,
            fieldname: item.fieldname,
            line: item.line,
            errorvalue: item.errorvalue,
            status: item.status,
            correctvalue: item.correctvalue,
            link: item.link,
            doclink: item.doclink,
            mode: item.mode,
            greentext: item.greentext,
            validatestatus: item.validatestatus
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    const [fileFormat, setFormat] = useState("");

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Validation Error Entry"),
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
        getapi();
    }, []);

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
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
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

    const [batchNumber, setBatchNumber] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadMorePopupOpen, setIsLoadMorePopupOpen] = useState(false);

    const handleLoadMoreClosePopup = () => {
        setIsLoadMorePopupOpen(false); // Close the popup without loading more
    };


    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };




    const fetchBatchFilter = async () => {
        setFilterList([]);
        setLoaderList(true);
        setLoader(true);
        try {
            let finaldata = []
            let finaldatastatus = []


            let [res_employee, res_completed] = await Promise.all([
                axios.post(
                    SERVICE.VALIDATION_ERROR_FILTER,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        projectvendor: selectProjectVendor.map(item => item.value),
                        process: selectedProcess.map(item => item.value),
                        loginid: selectedSLoginId.map(item => item.value),
                        fromdate: fromdate,
                        todate: todate,
                    }
                ),

                axios.post(
                    SERVICE.VALIDATION_ERROR_FILTER_STATUS_COMPLETED,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        projectvendor: selectProjectVendor.map(item => item.value),
                        process: selectedProcess.map(item => item.value),
                        loginid: selectedSLoginId.map(item => item.value),
                        fromdate: fromdate,
                        todate: todate,
                    }
                ),

            ])
            console.log(res_employee?.data?.validatefinal, "de")

            if (valueTable?.includes('Validation Error Entry List')) {

                const itemsWithSerialNumber = res_employee?.data?.validatefinal?.map((item, index) => ({
                    ...item,
                    // date: moment(item.date).format("DD-MM-YYYY"),
                    date: item.date,
                    mode: item.mode
                }));

                finaldata = itemsWithSerialNumber.filter(data => data.name === isUserRoleAccess.companyname).map((item, index) => {
                    let dateFinal = item.mode == "Bulkupload" ? item.dateformatted : item.date

                    return {

                        ...item,
                        id: item._id,
                        serialNumber: index + 1,
                        date: moment(dateFinal).format("DD-MM-YYYY"),
                        olddate: item.mode == "Bulkupload" ? item.dateformatted : item.date


                    }
                })

                setFilterList(finaldata)
                // setFilteredRowData(finaldata)
                setTableCheck(valueTable);

            }
            //valid/Invalid status

            if (valueTable?.includes('Invalid/Valid Updated List')) {

                const itemsWithSerialNumberstatus = res_completed?.data?.validatefinal?.map((item, index) => ({
                    ...item,
                    // date: moment(item.date).format("DD-MM-YYYY"),
                    date: item.date,
                    mode: item.mode
                }));

                finaldatastatus = itemsWithSerialNumberstatus.filter(data => data.name === isUserRoleAccess.companyname).map((item, index) => {
                    let dateFinal = item.mode == "Bulkupload" ? item.dateformatted : item.date

                    return {

                        ...item,
                        id: item._id,
                        serialNumber: index + 1,
                        date: moment(dateFinal).format("DD-MM-YYYY"),
                        olddate: item.mode == "Bulkupload" ? item.dateformatted : item.date


                    }
                })
                setisusercompleted(finaldatastatus)
                // setFilteredRowDatacom(finaldatastatus)
                setTableCheck(valueTable);
            }


            setIsLoading(false);
            setLoaderList(false);
            setLoader(false);
        } catch (err) {
            setLoaderList(false);
            setLoader(false);
            setIsLoading(false);
            setHasMoreData(false);
        }
    };






    const handleSubmitFilterNew = (e) => {
        e.preventDefault();

        if (selectedTable.length === 0) {
            setPopupContentMalert("Please Select Table Mode");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (fromdate === "") {
            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (todate === "") {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (selectProjectVendor.length === 0) {
            setPopupContentMalert("Please Select Project Vendor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            // If all conditions are met, proceed with the fetch
            fetchBatchFilter(1);
        }
    };

    const handleClearFilterNew = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        var today1 = new Date();
        var dd1 = String(today1.getDate()).padStart(2, "0");
        var mm1 = String(today1.getMonth() + 1).padStart(2, "0"); // January is 0!
        var yyyy1 = today1.getFullYear();
        today1 = yyyy1 + "-" + mm1 + "-" + dd1;
        setPageName(!pageName)
        // e.preventDefault();
        setFromdate(today1)
        setTodate(today1)
        setSelectedMode("Today")
        setSelectedTable([]);
        setValueTable([]);
        setTableCheck([]);
        setSelectedProjectVendor([])
        setSelectedProcess([])
        setSelectedLoginId([])
        setFilterList([])
        setPopupContent("Cleared Successfully!");
        setPopupSeverity("success");
        handleClickOpenPopup();

    };


    const getCode = async (id, type, olddate) => {
        console.log(type, "tuype")
        setPageName(!pageName)
        try {

            let res_data = await axios.post(SERVICE.CHECK_PENALTYDAY_CREATED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: olddate,
            });
            const checkpenaltyday = res_data.data.penaltydayupload > 0

            if (checkpenaltyday) {
                setPopupContentMalert("Penalty Day Created For This Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else {
                handleClickOpenEdit();
                if (type == "Bulkupload" || type == "Bulkkeying") {
                    let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    });
                    setEditsingleData(Res?.data?.sbulkerroruploadpoints)
                    // handleClickOpenEdit();
                    fetchClientUserIDEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);
                    fetchProcessQueueEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);

                }
                else if (type == "ErrorUpload" || type == "Errorkeying") {
                    let Res = await axios.get(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    });
                    setEditsingleData(Res?.data?.spenaltyerroruploadpoints)
                    // handleClickOpenEdit();
                    fetchClientUserIDEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
                    fetchProcessQueueEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);

                }
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const getCodeView = async (id, type, row, olddate) => {
        let Res = await axios.post(`${SERVICE.CHEKCK_MANAGER_APPROVE_PENALTYTOTAL}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            date: row.date,
            vendor: row.projectvendor,
            process: row.process,
            loginid: row.loginid,
        });

        setPageName(!pageName)
        try {
            let res_data = await axios.post(SERVICE.CHECK_PENALTYDAY_CREATED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: olddate,
            });
            const checkpenaltyday = res_data.data.penaltydayupload > 0

            if (checkpenaltyday) {
                setPopupContentMalert("Penalty Day Created For This Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else {

                if (Res.data.checkmanager > 0) {


                    if (type == "Bulkupload" || type == "Bulkkeying") {
                        let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                        });
                        setviewsingleData(Res?.data?.sbulkerroruploadpoints)
                        handleClickOpenEditError();
                        fetchClientUserIDEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);
                        fetchProcessQueueEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);

                    }
                    else if (type == "ErrorUpload" || type == "Errorkeying") {
                        let Res = await axios.get(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${id}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                        });
                        setviewsingleData(Res?.data?.spenaltyerroruploadpoints)
                        handleClickOpenEditError();
                        fetchClientUserIDEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
                        fetchProcessQueueEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
                    }
                }
                else {

                    setPopupContentMalert("TL Not Yet Confirm!");
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();

                }
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //completed


    // Manage Columns
    const [isManageColumnsOpencom, setManageColumnsOpencom] = useState(false);
    const [anchorElcom, setAnchorElcom] = useState(null);

    const handleOpenManageColumnscom = (event) => {
        setAnchorElcom(event.currentTarget);
        setManageColumnsOpencom(true);
    };
    const handleCloseManageColumnscom = () => {
        setManageColumnsOpencom(false);
        setSearchQueryManagecom("");
    };

    const opencom = Boolean(anchorElcom);
    const idcom = opencom ? "simple-popover" : undefined;



    // Show All Columns & Manage Columns
    const initialColumnVisibilitycom = {
        serialNumber: true,
        checkbox: true,
        name: true,
        status: true,
        branch: true,
        manaulerrorcheck: true,
        erroruploadconfirmcheck: true,
        unit: true,
        errormode: true,
        projectvendor: true,
        process: true,
        loginid: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        status: true,
        correctvalue: true,
        mode: true,
        link: true,
        greentext: true,
        doclink: true,
        actions: true,
    };


    const [columnVisibilitycom, setColumnVisibilitycom] = useState(
        initialColumnVisibilitycom
    );

    const [itemscom, setItemscom] = useState([]);

    // const addSerialNumber = () => {
    //     const itemsWithSerialNumber = isuser?.map((item, index) => ({
    //         ...item, serialNumber: index + 1,
    //         fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
    //     }));
    //     setItems(itemsWithSerialNumber);
    // };

    const addSerialNumbercom = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => {


        //     return {
        //         ...item,
        //         serialNumber: index + 1,

        //         date: moment(item.date).format("DD/MM/YYYY"),
        //     }
        // });
        setItemscom(datas);
    };

    useEffect(() => {
        addSerialNumbercom(isusercompleted);
    }, [isusercompleted]);

    // console.log(isuser, "isuser")

    //Datatable
    const handlePageChangecom = (newPage) => {
        setPagecom(newPage);
        setSelectedRows([]);
        // setSelectAllChecked(false);
    };

    const handlePageSizeChangecom = (event) => {
        setPageSizecom(Number(event.target.value));
        setSelectedRows([]);
        // setSelectAllChecked(false);
        setPagecom(1);
    };

    //datatable....
    const handleSearchChangecom = (event) => {
        setSearchQuerycom(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermscom = searchQuerycom.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatascom = itemscom?.filter((item) => {
        return searchTermscom.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDatacom = filteredDatascom?.slice(
        (pagecom - 1) * pageSizecom,
        pagecom * pageSizecom
    );

    const totalPagescom = Math.ceil(filteredDatascom?.length / pageSizecom);

    const visiblePagescom = Math.min(totalPagescom, 3);

    const firstVisiblePagecom = Math.max(1, pagecom - 1);
    const lastVisiblePagecom = Math.min(
        firstVisiblePagecom + visiblePagescom - 1,
        totalPagescom
    );

    const pageNumberscom = [];

    const indexOfLastItemcom = pagecom * pageSizecom;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }



    const columnDataTablecom = [

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
            field: "name",
            headerName: "Employee Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 130,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 130,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 130,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 130,

            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 130,
            hide: !columnVisibility.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 130,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "errorfilename",
            headerName: "Error File Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorfilename,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.link} >{params.data.errorfilename}</a>

                </Grid>
            ),
        },
        {
            field: "documentnumber",
            headerName: "Document Number",
            flex: 0,
            width: 140,
            hide: !columnVisibility.documentnumber,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.doclink} >{params.data.documentnumber}</a>

                </Grid>
            ),
        },
        {
            field: "documenttype",
            headerName: "Document Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.documenttype,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "Field Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fieldname,
            headerClassName: "bold-header",
        },
        {
            field: "line",
            headerName: "Line",
            flex: 0,
            width: 130,
            hide: !columnVisibility.line,
            headerClassName: "bold-header",
        },
        {
            field: "errorvalue",
            headerName: "Error Value",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.errorvalue,
            headerClassName: "bold-header",
        },
        {
            field: "correctvalue",
            headerName: "Correct Value",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.correctvalue,
            headerClassName: "bold-header",
        },
        {
            field: "link",
            headerName: "Link",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.link,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.link} >{params.data.link}</a>

                </Grid>
            ),
        },
        {
            field: "doclink",
            headerName: "Doc Link",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.doclink,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    <a target="_blank" href={params.data.doclink} >{params.data.doclink}</a>

                </Grid>
            ),
        },
        {
            field: "mode",
            headerName: "Entry Creation",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.mode,
            headerClassName: "bold-header",
        },
        {
            field: "errormode",
            headerName: "Mode",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.errormode,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.status,
            headerClassName: "bold-header",
        },
        {
            field: "manaulerrorcheck",
            headerName: "Manual Completed",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.manaulerrorcheck,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return params.data.manaulerrorcheck === "YES" ? (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="success"
                        variant="outlined"
                        label="YES"
                    />
                ) : (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="warning"
                        variant="outlined"
                        label="No"
                    />
                );
            }
        },
        {
            field: "erroruploadconfirmcheck",
            headerName: "Supervisor Completed",
            flex: 0,
            width: 150,
            hide: !columnVisibilitycom.erroruploadconfirmcheck,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return params.data.erroruploadconfirmcheck === "YES" ? (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="success"
                        variant="outlined"
                        label="YES"
                    />
                ) : (
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color="warning"
                        variant="outlined"
                        label="No"
                    />
                );
            }
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilitycom.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ backgroundColor: "#d32f2f", color: "white" }}
                        disabled={params?.data?.validatestatus === "true"}
                        onClick={() => {
                            getCode(params.data.id, params.data.mode, params.data.olddate);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        sx={userStyle.buttonedit}
                        disabled={params?.data?.validatestatus === "true"}
                        onClick={() => {
                            getCodeView(params.data.id, params.data.mode, params.data, params.data.olddate);
                        }}
                    >
                        <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />

                    </Button>


                </Grid>
            ),
        },
    ];
    // console.log(filteredData, "lll")

    const rowDataTablecom = filteredDatacom.map((item, index) => {
        return {
            ...item,
            id: item.id,
            serialNumber: item.serialNumber,
            errormode: item.errormode,
            name: item.name,
            olddate: item.olddate,
            branch: item.branch,
            unit: item.unit,
            projectvendor: item.projectvendor,
            process: item.process,
            loginid: item.loginid,
            date: item.date,
            errorfilename: item.errorfilename,
            documentnumber: item.documentnumber,
            documenttype: item.documenttype,
            fieldname: item.fieldname,
            line: item.line,
            errorvalue: item.errorvalue,
            status: item.status,
            correctvalue: item.correctvalue,
            link: item.link,
            doclink: item.doclink,
            mode: item.mode,
            greentext: item.greentext,
            validatestatus: item.validatestatus
        };
    });
    console.log(rowDataTablecom, "rowdat")
    const rowsWithCheckboxescom = rowDataTablecom?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnscom = () => {
        const updatedVisibilitycom = { ...columnVisibilitycom };
        for (const columnKey in updatedVisibilitycom) {
            updatedVisibilitycom[columnKey] = true;
        }
        setColumnVisibilitycom(updatedVisibilitycom);
    };

    // // Function to filter columns based on search query
    const filteredColumnscom = columnDataTablecom.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManagecom.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibilitycom = (field) => {
        setColumnVisibilitycom((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentcom = (
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
                onClick={handleCloseManageColumnscom}
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
                    value={searchQueryManagecom}
                    onChange={(e) => setSearchQueryManagecom(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnscom.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilitycom[column.field]}
                                        onChange={() => toggleColumnVisibilitycom(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibilitycom(initialColumnVisibilitycom)}
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
                                const newColumnVisibilitycom = {};
                                columnDataTablecom.forEach((column) => {
                                    newColumnVisibilitycom[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilitycom(newColumnVisibilitycom);
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
            <Headtitle title={"Validation Error Entry"} />
            <PageHeading
                title="Validation Error Entry"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Validation Error Entry"
            />
            {isUserRoleCompare?.includes("avalidationerrorentry") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Validation Error Entry
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Table Mode<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={tableOptions}
                                            value={selectedTable}
                                            onChange={(e) => {
                                                handleTableChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Table Mode"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project Vendor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            maxMenuHeight={300}
                                            options={projOpt}
                                            styles={colourStyles}
                                            value={selectProjectVendor}
                                            onChange={handleProjecvendor}
                                            valueRenderer={customValueRendererProject}
                                            labelledBy="Please Select ProjectVendor"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Process
                                        </Typography>
                                        <MultiSelect
                                            maxMenuHeight={300}
                                            options={processOptFilter}
                                            styles={colourStyles}
                                            value={selectedProcess}
                                            onChange={handleProcess}
                                            valueRenderer={customValueRendererProcess}
                                            labelledBy="Please Select Process"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Login Id
                                        </Typography>
                                        <MultiSelect
                                            maxMenuHeight={300}
                                            options={loginIdOptFilter}
                                            styles={colourStyles}
                                            value={selectedSLoginId}
                                            onChange={handleLoginId}
                                            valueRenderer={customValueLoginId}
                                            labelledBy="Please Select LoginId"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Filter Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            labelId="mode-select-label"
                                            options={mode}
                                            style={colourStyles}
                                            value={{ label: selectedMode, value: selectedMode }}
                                            onChange={(selectedOption) => {
                                                let fromdate = '';
                                                let todate = '';

                                                // If a valid option is selected, get the date range
                                                if (selectedOption.value) {
                                                    const dateRange = getDateRange(selectedOption.value);
                                                    fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                                    todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                                }

                                                setFromdate(formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))))
                                                setTodate(formatDateForInput(new Date(todate.split('-').reverse().join('-'))))
                                                setSelectedMode(selectedOption.value); // Update the mode
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            From Date
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlinedname"
                                            type="date"
                                            value={fromdate}
                                            disabled={selectedMode != "Custom"}
                                            onChange={(e) => {
                                                setFromdate(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            To  Date
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlinedname123"
                                            type="date"
                                            value={todate}
                                            disabled={selectedMode != "Custom"}
                                            onChange={(e) => {
                                                setTodate(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12} marginTop={3}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                        onClick={handleSubmitFilterNew}
                                    >
                                        Filter
                                    </Button>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12} marginTop={3}>
                                    <Button
                                        onClick={handleClearFilterNew}
                                        sx={buttonStyles.btncancel}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                            <br />
                        </>
                    </Box>
                </>
            )}
            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '50px' }}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Validation Error Entry
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Project Vendor<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={projOpt}
                                        value={{ label: editsingleData.projectvendor, value: editsingleData.projectvendor }}
                                        onChange={((e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                projectvendor: e.value,
                                                process: "Please Select Process",
                                                loginid: "Please Select Login ID"
                                            })
                                            fetchClientUserIDEdit(e.value);
                                            fetchProcessQueueEdit(e.value);
                                        })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Process<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={processOptEdit}
                                        value={{ label: editsingleData.process, value: editsingleData.process }}
                                        onChange={((e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                process: e.value,
                                                loginid: "Please Select Login ID"
                                            })
                                        })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={loginIdOptEdit}
                                        value={{ label: editsingleData.loginid, value: editsingleData.loginid }}
                                        onChange={((e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                loginid: e.value
                                            })
                                        })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={editsingleData.date}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                date: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Error Filename<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Error Filename"
                                        value={editsingleData.errorfilename}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                errorfilename: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Document Number<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Document Number"
                                        value={editsingleData.documentnumber}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                documentnumber: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Document Type<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.documenttype}
                                        placeholder="Please Enter Document Type"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                documenttype: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Field Name<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.fieldname}
                                        placeholder="Please Enter Field Name"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                fieldname: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Line<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.line}
                                        placeholder="Please Enter Line"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                line: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Error Value<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.errorvalue}
                                        placeholder="Please Enter Error Value"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                errorvalue: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Correct Value<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.correctvalue}
                                        placeholder="Please Enter Correct Value"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                correctvalue: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Link<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.link}
                                        placeholder="Please Enter Link"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                link: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Doc Link<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.doclink}
                                        placeholder="Please Enter Doc Link"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                doclink: e.target.value
                                            })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                            Update
                        </Button>
                        <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                    </DialogActions>

                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {loader && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}>
                    <CircularProgress size="3rem" />
                </Box>
            )}

            {isUserRoleCompare?.includes("lvalidationerrorentry") && tableCheck?.includes('Validation Error Entry List') ?

                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Validation Error Entry List
                                {/* Penalty Total Field List */}
                            </Typography>
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
                                        <MenuItem value={filterList?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelvalidationerrorentry") && (
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
                                    {isUserRoleCompare?.includes("csvvalidationerrorentry") && (
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
                                    {isUserRoleCompare?.includes("printvalidationerrorentry") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleprint}
                                            >
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfvalidationerrorentry") && (
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
                                    {isUserRoleCompare?.includes("imagevalidationerrorentry") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={filterList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={filterList}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleOpenManageColumns}
                        >
                            Manage Columns
                        </Button>
                        &ensp;
                        {/* {hasMoreData && !isLoading && filterList.length > 0 && (
                            <Button variant="contained" onClick={loadMore}>
                                Load More
                            </Button>
                        )} */}
                        <br />
                        {loaderList ? (
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
                                    gridRefTable={gridRefTable}
                                    paginated={false}
                                    // pagenamecheck={"Validation Error Entry"}
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalDatas}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={filterList}

                                />
                            </>
                        )}
                    </Box>
                </> : null}

            <br />


            {isUserRoleCompare?.includes("lvalidationerrorentry") && tableCheck?.includes('Invalid/Valid Updated List') ?

                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Invalid/Valid Updated List</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizecom}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangecom}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={isusercompleted?.length}>All</MenuItem>
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
                                        {isUserRoleCompare?.includes(
                                            "excelvalidationerrorentry"
                                        ) && (
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            setIsFilterOpencom(true);
                                                            setFormat("xl");
                                                        }}
                                                        sx={userStyle.buttongrp}
                                                    >
                                                        <FaFileExcel />
                                                        &ensp;Export to Excel&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "csvvalidationerrorentry"
                                        ) && (
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            setIsFilterOpencom(true);
                                                            setFormat("csv");
                                                        }}
                                                        sx={userStyle.buttongrp}
                                                    >
                                                        <FaFileCsv />
                                                        &ensp;Export to CSV&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "printvalidationerrorentry"
                                        ) && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintcom}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "pdfvalidationerrorentry"
                                        ) && (
                                                <>
                                                    <Button
                                                        sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpencom(true);
                                                        }}
                                                    >
                                                        <FaFilePdf />
                                                        &ensp;Export to PDF&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "imagevalidationerrorentry"
                                        ) && (
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImagecom}
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
                                    <Box>
                                        {/* <FormControl fullWidth size="small">
                                                    <Typography>Search</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={handleSearchChange}
                                                    />
                                                </FormControl> */}
                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTablecom}
                                            setItems={setItemscom}
                                            addSerialNumber={addSerialNumbercom}
                                            setPage={setPagecom}
                                            maindatas={isusercompleted}
                                            setSearchedString={setSearchedStringcom}
                                            searchQuery={searchQuerycom}
                                            setSearchQuery={setSearchQuerycom}
                                            paginated={false}
                                            totalDatas={isusercompleted}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnscom}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnscom}>
                                Manage Columns
                            </Button>
                            {/* Show "Load More" button if there's more data */}

                            <Popover
                                id={idcom}
                                open={isManageColumnsOpencom}
                                anchorEl={anchorElcom}
                                onClose={handleCloseManageColumnscom}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                {manageColumnsContentcom}
                            </Popover>
                            <br />
                            <br />
                            {loaderList ? (
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
                                        rowDataTable={rowDataTablecom}
                                        columnDataTable={columnDataTablecom}
                                        columnVisibility={columnVisibilitycom}
                                        page={pagecom}
                                        setPage={setPagecom}
                                        pageSize={pageSizecom}
                                        totalPages={totalPagescom}
                                        setColumnVisibility={setColumnVisibilitycom}
                                        isHandleChange={isHandleChange}
                                        items={itemscom}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRefTablecom}
                                        paginated={false}
                                        filteredDatas={filteredDatascom}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedStringcom}
                                        handleShowAllColumns={handleShowAllColumnscom}
                                        setFilteredRowData={setFilteredRowDatacom}
                                        filteredRowData={filteredRowDatacom}
                                        setFilteredChanges={setFilteredChangescom}
                                        filteredChanges={filteredChangescom}
                                        gridRefTableImg={gridRefTableImgcom}
                                        itemsList={isusercompleted}
                                    />
                                </>
                            )}
                        </>
                    </Box>
                </>
                : null}


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

            {/* view model */}
            <Dialog open={isEditOpenError} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '50px' }}>
                <DialogContent sx={{ height: "400px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={userStyle.HeaderText}>
                                Error Load
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Process : <b style={{ color: "cornflowerblue" }}>{viewsingleData.process}</b></Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Field: <b style={{ color: "cornflowerblue" }}>{viewsingleData.fieldname}</b></Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error: <b style={{ color: "red" }}>{viewsingleData.errorvalue}</b></Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value: <b style={{ color: "green" }}>{viewsingleData.correctvalue}</b></Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Type <b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    options={errorType}
                                    value={{
                                        label: managetypepgState.errortype,
                                        value: managetypepgState.errortype,
                                    }}
                                    onChange={(e) => {
                                        setManagetypepgState({
                                            ...managetypepgState,
                                            errortype: e.value,
                                            errortypestatus: e.value,
                                            errortypepost: e.errortype,
                                            errortypereason: e.errortypereason,
                                            reason: "Please Select Reason"
                                        });
                                        fetchErrorReasonDropdowns(e.errortypereason)
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Reason <b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    options={errorReason}
                                    // styles={colourStyles}
                                    value={{
                                        label: managetypepgState.reason,
                                        value: managetypepgState.reason,
                                    }}
                                    onChange={(e) => {
                                        setManagetypepgState({
                                            ...managetypepgState,
                                            reason: e.value,

                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Explanation To Avoid<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Reason"
                                    value={managetypepgState.explanation}
                                    onChange={(e) => {
                                        setManagetypepgState({
                                            ...managetypepgState,
                                            explanation: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Status </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    readOnly
                                    placeholder="Please Enter Reason"
                                    value={managetypepgState.errortypepost}

                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Severity </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    readOnly

                                    value={errormode}

                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" onClick={editSubmitErrorLoad} sx={buttonStyles.buttonsubmit}>
                        Save
                    </Button>
                    <Button onClick={handleCloseModEditError} sx={buttonStyles.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>

            </Dialog>

            {/* Reason of Leaving  */}
            <Dialog
                open={openviewalert}
                onClose={handleClickOpenviewalert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Name</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6"></Typography>

                                        <FormControl size="small" fullWidth>
                                            <TextField />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button
                                    variant="contained"
                                    sx={buttonStyles.buttonsubmit}
                                    onClick={handleCloseviewalert}
                                >
                                    Save
                                </Button>
                            </Grid>

                            <Grid item md={0.2} xs={12} sm={12}></Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button
                                    variant="contained"
                                    sx={buttonStyles.btncancel}
                                    onClick={handleCloseviewalert}
                                >
                                    {" "}
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* <Dialog open={isLoadMorePopupOpen} onClose={handleLoadMoreClosePopup} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "60px", color: "skyblue" }} />
                    <Typography variant="h6">Loaded {filterList.length} Data</Typography>
                    <Typography variant="body1"> Do you want to load more data?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button sx={buttonStyles.btncancel} onClick={handleLoadMoreClosePopup}>
                        No
                    </Button>
                    <Button sx={buttonStyles.buttonsubmit} onClick={handleLoadMore} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog> */}

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
                itemsTwo={filterList ?? []}
                filename={"Validation Error Entry"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpencom}
                handleCloseFilterMod={handleCloseFilterModcom}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpencom}
                isPdfFilterOpen={isPdfFilterOpencom}
                setIsPdfFilterOpen={setIsPdfFilterOpencom}
                handleClosePdfFilterMod={handleClosePdfFilterModcom}
                filteredDataTwo={(filteredChangescom !== null ? filteredRowDatacom : rowDataTablecom) ?? []}
                itemsTwo={isusercompleted ?? []}
                filename={"Invalid/Valid Updated List"}
                exportColumnNames={exportColumnNamescom}
                exportRowValues={exportRowValuescom}
                componentRef={componentRefcom}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Validation Error Entry Info"
                addedby={addedby}
                updateby={updateby}
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

export default ValidationErroEntry;