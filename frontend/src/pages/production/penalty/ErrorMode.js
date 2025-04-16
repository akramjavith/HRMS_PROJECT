import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, OutlinedInput, IconButton, List, Divider, ListItem, ListItemText, MenuItem, Popover, DialogTitle, Select, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import { ThreeDots } from "react-loader-spinner";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import ExportDataAllottedList from "../../../components/ExportData";
import ExportDataOrigin from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from "dom-to-image";

function ErrorMode() {
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [isHandleChangeAllottedList, setIsHandleChangeAllottedList] = useState(false);
    const [isHandleChangeOrigin, setIsHandleChangeOrigin] = useState(false);

    const [searchedString, setSearchedString] = useState("");
    const [searchedStringAllottedList, setSearchedStringAllottedList] = useState("");
    const [searchedStringOrigin, setSearchedStringOrigin] = useState("");

    const modes = [
        { label: "Critical", value: "Critical" },
        { label: "Non-Critical", value: "Non-Critical" },
        { label: "NoN", value: "NoN" },
    ];

    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRefTableAllottedList = useRef(null);
    const gridRefTableImgAllottedList = useRef(null);
    const gridRefTableOrigin = useRef(null);
    const gridRefTableImgOrigin = useRef(null);

    const [loadingUnallotList, setLoadingUnallotList] = useState(false);
    const [loadingAllottedList, setLoadingUAllottedList] = useState(false);
    const [loadingOrigin, setLoadingOrigin] = useState(false);

    const [errormodeEdit, setErrormodeEdit] = useState({ projectvendor: "", process: "", fieldname: "", mode: "", rate: "" });
    const [originEdit, setOriginEdit] = useState({ projectvendor: "", process: "", date: "", fieldname: "", errorfilename: "", documenttype: "", documentnumber: "" });

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

    let exportColumnNames = ["Project Vendor", "Process", "Field Name", "Mode", "Rate"];
    let exportRowValues = ["projectvendor", "process", "fieldname", "mode", "rate"];

    let exportColumnNamesAllottedList = ["Project Vendor", "Process", "Field Name", "Mode", "Rate"];
    let exportRowValuesAllottedList = ["projectvendor", "process", "fieldname", "mode", "rate"];

    let exportColumnNamesOrigin = ["Project Vendor", "Name", "Branch", "Unit", "Login Id", "Audit Date", "Process", "File Name", "Document Number", "Doc Type", "Line", "Error Value", "Correct Value", "Mode"];
    let exportRowValuesOrigin = ["projectvendor", "name", "branch", "unit", "user", "date", "process", "errorfilename", "documentnumber", "documenttype", "line", "errorvalue", "correctvalue", "mode"];

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [isFilterOpenAllottedList, setIsFilterOpenAllottedList] = useState(false);
    const [isPdfFilterOpenAllottedList, setIsPdfFilterOpenAllottedList] = useState(false);
    // page refersh reload
    const handleCloseFilterModAllottedList = () => {
        setIsFilterOpenAllottedList(false);
    };
    const handleClosePdfFilterModAllottedList = () => {
        setIsPdfFilterOpenAllottedList(false);
    };

    const [isFilterOpenOrigin, setIsFilterOpenOrigin] = useState(false);
    const [isPdfFilterOpenOrigin, setIsPdfFilterOpenOrigin] = useState(false);
    // page refersh reload
    const handleCloseFilterModOrigin = () => {
        setIsFilterOpenOrigin(false);
    };
    const handleClosePdfFilterModOrigin = () => {
        setIsPdfFilterOpenOrigin(false);
    };

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [selectedRowsAllottedList, setSelectedRowsAllottedList] = useState([]);
    const [searchQueryManageAllottedList, setSearchQueryManageAllottedList] = useState("");

    const [selectedRowsOrigin, setSelectedRowsOrigin] = useState([]);
    const [searchQueryManageOrigin, setSearchQueryManageOrigin] = useState("");

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const [items, setItems] = useState([]);

    //Datatable Allotedlist
    const [pageAllottedList, setPageAllottedList] = useState(1);
    const [pageSizeAllottedList, setPageSizeAllottedList] = useState(10);
    const [searchQueryAllottedList, setSearchQueryAllottedList] = useState("");

    const [itemsAllottedList, setItemsAllottedList] = useState([]);

    const [pageOrigin, setPageOrigin] = useState(1);
    const [pageSizeOrigin, setPageSizeOrigin] = useState(10);
    const [searchQueryOrigin, setSearchQueryOrigin] = useState("");

    const [itemsOrigin, setItemsOrigin] = useState([]);

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [filteredRowDataAllottedList, setFilteredRowDataAllottedList] = useState([]);
    const [filteredChangesAllottedList, setFilteredChangesAllottedList] = useState(null);

    const [filteredRowDataOrigin, setFilteredRowDataOrigin] = useState([]);
    const [filteredChangesOrigin, setFilteredChangesOrigin] = useState(null);

    const [errModesUnallotList, setErrModesUnallotList] = useState([]);
    const [errModesAllottedList, setErrModesAllottedList] = useState([]);
    const [errModesOrigin, setErrModesOrigin] = useState([]);

    const [vendors, setVendors] = useState([]);
    const [processOpt, setProcessOpt] = useState([]);
    const [processOptEdit, setProcessOptEdit] = useState([]);
    const [processOptEditOrigin, setProcessOptEditOrigin] = useState([]);
    const [fieldNameOpt, setFieldNameOpt] = useState([]);
    const [processOptAllottedList, setProcessOptAllottedList] = useState([]);

    const [selectedVendor, setSelectedVendor] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState([]);

    const [selectedVendorAllottedList, setSelectedVendorAllottedList] = useState([]);
    const [selectedProcessAllottedList, setSelectedProcessAllottedList] = useState([]);

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // ORIGN MODEL
    //Edit model...
    const [isOriginOpen, setIsOriginOpen] = useState(false);
    const handleClickOpenOrigin = () => {
        setIsOriginOpen(true);
    };
    const handleClickCloseOrigin = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsOriginOpen(false);
    };

    //Edit model...
    const [isOriginOpenEdit, setIsOriginOpenEdit] = useState(false);
    const handleClickOpenEditOrigin = () => {
        setIsOriginOpenEdit(true);
    };
    const handleClickCloseEditOrigin = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsOriginOpenEdit(false);
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        process: true,
        fieldname: true,
        mode: true,
        rate: true,
        actions: true,
    };
    // Show All Columns & Manage Columns
    const initialColumnVisibilityAllottedList = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        process: true,
        fieldname: true,
        mode: true,
        rate: true,
        actions: true,
    };
    const initialColumnVisibilityOrigin = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        process: true,
        fieldname: true,
        mode: true,
        name: true,
        branch: true,
        unit: true,
        user: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [columnVisibilityAllottedList, setColumnVisibilityAllottedList] = useState(initialColumnVisibilityAllottedList);
    const [columnVisibilityOrigin, setColumnVisibilityOrigin] = useState(initialColumnVisibilityOrigin);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    //const [copiedData, setCopiedData] = useState("");

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

    // Manage Columns Alotted List
    const [isManageColumnsOpenAllottedList, setManageColumnsOpenAllottedList] = useState(false);
    const [anchorElAllottedList, setAnchorElAllottedList] = useState(null);
    const handleOpenManageColumnsAllottedList = (event) => {
        setAnchorElAllottedList(event.currentTarget);
        setManageColumnsOpenAllottedList(true);
    };
    const handleCloseManageColumnsAllottedList = () => {
        setManageColumnsOpenAllottedList(false);
        setSearchQueryManageAllottedList("");
    };
    const openAllottedList = Boolean(anchorElAllottedList);
    const idAllottedList = openAllottedList ? "simple-popover" : undefined;

    // Manage Columns Alotted List
    const [isManageColumnsOpenOrigin, setManageColumnsOpenOrigin] = useState(false);
    const [anchorElOrigin, setAnchorElOrigin] = useState(null);
    const handleOpenManageColumnsOrigin = (event) => {
        setAnchorElOrigin(event.currentTarget);
        setManageColumnsOpenOrigin(true);
    };
    const handleCloseManageColumnsOrigin = () => {
        setManageColumnsOpenOrigin(false);
        setSearchQueryManageOrigin("");
    };
    const openOrigin = Boolean(anchorElOrigin);
    const idOrigin = openOrigin ? "simple-popover" : undefined;

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

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

    const fetchVendors = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER_LIMITED_NAMEONLY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
                // ...d,
                label: d.projectname + "-" + d.name,
                value: d.projectname + "-" + d.name,
            }));

            setVendors(vendorall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchProcess = async (vendor) => {
        try {
            let res_project = await axios.post(SERVICE.PRODUCTIONPROCESSQUEUE_LIMITED_BYPROJECT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: vendor.map((item) => item.value),
            });
            const dupremove = [...new Set(res_project.data.productionprocessqueue.map((d) => d.processqueue))];
            const categoriesData = dupremove.map((d) => ({
                // ...d,
                label: d,
                value: d,
            }));
            setProcessOpt(categoriesData);
        } catch (err) {
            console.log(err, "err");
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchProcessAllottedList = async (vendor) => {
        try {
            let res_project = await axios.post(SERVICE.PRODUCTIONPROCESSQUEUE_LIMITED_BYPROJECT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: vendor.map((item) => item.value),
            });

            const dupremove = [...new Set(res_project.data.productionprocessqueue.map((d) => d.processqueue))];
            const categoriesData = dupremove.map((d) => ({
                // ...d,
                label: d,
                value: d,
            }));
            setProcessOptAllottedList(categoriesData);
        } catch (err) {
            console.log(err, "err");
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchProcessEdit = async (vendor) => {
        try {
            let res_project = await axios.post(SERVICE.PRODUCTIONPROCESSQUEUE_LIMITED_BYPROJECT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: [vendor],
            });
            const dupremove = [...new Set(res_project.data.productionprocessqueue.map((d) => d.processqueue))];
            const categoriesData = dupremove.map((d) => ({
                // ...d,
                label: d,
                value: d,
            }));
            setProcessOptEdit(categoriesData);
        } catch (err) {
            console.log(err, "err");
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchProcessOriginEdit = async (vendor) => {
        try {
            let res_project = await axios.post(SERVICE.PRODUCTIONPROCESSQUEUE_LIMITED_BYPROJECT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: [vendor],
            });
            const dupremove = [...new Set(res_project.data.productionprocessqueue.map((d) => d.processqueue))];
            const categoriesData = dupremove.map((d) => ({
                // ...d,
                label: d,
                value: d,
            }));
            setProcessOptEditOrigin(categoriesData);
        } catch (err) {
            console.log(err, "err");
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchFieldNamesEdit = async (project, process) => {
        try {
            let res_project = await axios.post(SERVICE.FETCH_FIELDNAME_BYPROCESS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                project: project,
                process: process,
            });

            const categoriesData = res_project.data.masterfieldnames.map((d) => ({
                // ...d,
                label: d.fieldname,
                value: d.fieldname,
            }));
            setFieldNameOpt(categoriesData);
        } catch (err) {
            console.log(err, "err");
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleProjectChange = (options) => {
        setSelectedVendor(options);
        fetchProcess(options);
        setSelectedProcess([]);
    };

    const customValueRendererProject = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project Vendor";
    };

    const handleProcessChange = (options) => {
        setSelectedProcess(options);
    };

    const customValueRendererProcess = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Process";
    };

    const fetchUnallotList = async () => {
        if (selectedVendor.length === 0) {
            setPopupContentMalert("Please Select Project vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedProcess.length === 0) {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setLoadingUnallotList(true);
            try {
                let res = await axios.post(SERVICE.ERRORMODE_UNALLOT_LIST, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    project: selectedVendor.map((item) => item.value),
                    process: selectedProcess.map((item) => item.value),
                });

                let matchedData = res?.data?.errormodes.map((item, index) => {
                    return {
                        ...item,
                        id: item._id,
                        rate: 1,
                        mode: "Critical",
                        modes: ["Critical", "Non-Critical", "NoN"],
                    };
                });
                setErrModesUnallotList(matchedData);
                setLoadingUnallotList(false);
            } catch (err) {
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
    };

    const handleProjectChangeAllottedList = (options) => {
        setSelectedVendorAllottedList(options);
        fetchProcessAllottedList(options);
        setSelectedProcessAllottedList([]);
    };

    const customValueRendererProjectAllottedList = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project Vendor";
    };

    const handleProcessChangeAllottedList = (options) => {
        setSelectedProcessAllottedList(options);
    };

    const customValueRendererProcessAllottedList = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Process";
    };

    const fetchAllottedList = async () => {
        setLoadingUAllottedList(true);
        try {
            let res = await axios.post(SERVICE.ERRORMODE_ALLOTED_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: selectedVendorAllottedList.map((item) => item.value),
                process: selectedProcessAllottedList.map((item) => item.value),
            });

            let matchedData = res?.data?.errormodes;
            console.log(matchedData, "matchedData");
            setErrModesAllottedList(matchedData);
            setLoadingUAllottedList(false);
        } catch (err) {
            setLoadingUAllottedList(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [isClickAdd, setIsClickAdd] = useState("");
    //add function
    const handleAdd = async (id, data) => {
        setIsClickAdd(id);
        console.log(data, "data");
        setPageName(!pageName);
        try {
            let RES_CREATE = await axios.post(SERVICE.ERRORMODE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(data.projectvendor),
                process: String(data.process),
                fieldname: String(data.fieldname),
                mode: String(data.mode),
                rate: String(data.rate),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchUnallotList();

            setIsClickAdd("");
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err);
            setIsClickAdd("");
            if (err.response?.data?.message === "Data Already Exists!") {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    //get single row to edit....
    const fetchOriginData = async (data) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.GET_ORGIN_DATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: data.projectvendor,
                process: data.process,
                fieldname: data.fieldname,
            });
            setColumnVisibilityOrigin(initialColumnVisibilityOrigin);

            setErrModesOrigin(res.data.errormodes);
            handleClickOpenOrigin();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //get single row to edit....
    const getCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.ERRORMODE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            console.log(res.data);
            setErrormodeEdit(res.data.serrormodes);
            fetchProcessEdit(res.data.serrormodes.projectvendor);
            fetchFieldNamesEdit(res.data.serrormodes.projectvendor, res.data.serrormodes.process);
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.ERRORMODE_SINGLE}/${errormodeEdit._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(errormodeEdit.projectvendor),
                process: String(errormodeEdit.process),
                fieldname: String(errormodeEdit.fieldname),
                mode: String(errormodeEdit.mode),
                rate: String(errormodeEdit.rate),
                // isupdated: Boolean(true),
                updatedby: [
                    ...errormodeEdit.updatedby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllottedList();
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

        if (errormodeEdit.rate === "") {
            setPopupContentMalert("Please Enter Rate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (errormodeEdit.process === "Please Select Process" || errormodeEdit.process === "") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (errormodeEdit.fieldname === "Please Select Fieldname" || errormodeEdit.fieldname === "") {
            setPopupContentMalert("Please Select Fieldname");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };

    //get single row to edit....
    const getCodeOrigin = async (data) => {
        setPageName(!pageName);
        console.log(data);
        try {
            if (data.mode === "Individual") {
                let res = await axios.get(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${data._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                console.log(res.data.spenaltyerroruploadpoints, "res.data.spenaltyerroruploadpoints");
                setOriginEdit(res.data.spenaltyerroruploadpoints);
                handleClickOpenEditOrigin();
            } else {
                let res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${data._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                console.log(res.data.spenaltyerroruploadpoints, "res.data.spenaltyerroruploadpoints");
                setOriginEdit({ ...res.data.sbulkerroruploadpoints, date: res.data.sbulkerroruploadpoints.dateformatted });
                fetchProcessOriginEdit(res.data.sbulkerroruploadpoints.projectvendor);
                handleClickOpenEditOrigin();
            }
        } catch (err) {
            console.log(err);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const [sentId, setSentId] = useState("");
    const getReason = (data) => {
        setSentId(data.id);
    };

    //editing the single data...
    const sendEditRequestOrigin = async (type) => {
        setPageName(!pageName);
        console.log(type, "type");
        function formatDate(dateStr, format) {
            const date = new Date(dateStr);

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
            const year = date.getFullYear();

            // Replace the format placeholders with actual date values
            return format.replace("dd", day).replace("MM", month).replace("yyyy", year);
        }
        let dateold = formatDate(originEdit.date, originEdit.dateformat);
        console.log(dateold, "dateold");
        try {
            let FINALSERVICE = type === "Bulkupload" ? SERVICE.BULK_ERROR_UPLOADS_SINGLE : SERVICE.PENALTYERRORUPLOADS_SINGLE;

            let res = await axios.put(`${FINALSERVICE}/${originEdit._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(originEdit.projectvendor),
                process: String(originEdit.process),
                loginid: String(originEdit.loginid),
                date: String(dateold),
                dateformatted: String(originEdit.date),
                errorfilename: String(originEdit.errorfilename),
                documentnumber: String(originEdit.documentnumber),
                documenttype: String(originEdit.documenttype),
                fieldname: String(originEdit.fieldname),
                line: String(originEdit.line),
                errorvalue: String(originEdit.errorvalue),
                correctvalue: String(originEdit.correctvalue),
                link: String(originEdit.link),
                doclink: String(originEdit.doclink),
                updatedby: [
                    {
                        ...originEdit.updatedby,
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchUnallotList();
            handleClickCloseEditOrigin();
            fetchOriginData({ projectvendor: originEdit.projectvendor, process: originEdit.process, fieldname: originEdit.fieldname });
            setPageOrigin(1);
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const editOriginSubmit = async (type) => {
        if (originEdit.projectvendor === "Please Select ProjectVendor" || originEdit.projectvendor === "") {
            setPopupContentMalert("Please Select ProjectVendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.loginid === "") {
            setPopupContentMalert("Please Enter LoginID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.date === "") {
            setPopupContentMalert("Please Enter Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.errorfilename === "") {
            setPopupContentMalert("Please Enter ErrorFilename");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.documentnumber === "") {
            setPopupContentMalert("Please Enter DocumentNumber");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.documenttype === "") {
            setPopupContentMalert("Please Enter Documenttype");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.fieldname === "") {
            setPopupContentMalert("Please Enter Fieldname");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.line === "") {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.link === "") {
            setPopupContentMalert("Please Enter File Link");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (originEdit.doclink === "") {
            setPopupContentMalert("Please Enter Doc Link");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequestOrigin(type);
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage
                .toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "ErrorMode.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleCaptureImageAllottedList = () => {
        if (gridRefTableImgAllottedList.current) {
            domtoimage
                .toBlob(gridRefTableImgAllottedList.current)
                .then((blob) => {
                    saveAs(blob, "ErrorMode.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleCaptureImageOrigin = () => {
        if (gridRefTableImgOrigin.current) {
            domtoimage
                .toBlob(gridRefTableImgOrigin.current)
                .then((blob) => {
                    saveAs(blob, "ErrorMode.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Error Modes",
        pageStyle: "print",
    });

    //print...
    const componentRefAllottedList = useRef();
    const handleprintAllottedList = useReactToPrint({
        content: () => componentRefAllottedList.current,
        documentTitle: "Error Modes",
        pageStyle: "print",
    });

    const componentRefOrigin = useRef();
    const handleprintOrigin = useReactToPrint({
        content: () => componentRefOrigin.current,
        documentTitle: "Error Modes",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };
    //useEffect
    useEffect(() => {
        addSerialNumber(errModesUnallotList);
    }, [errModesUnallotList]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
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
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 50,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "projectvendor",
            headerName: "Project-Vendor",
            flex: 0,
            width: 200,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 300,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "FieldName",
            flex: 0,
            width: 250,
            hide: !columnVisibility.fieldname,
            headerClassName: "bold-header",
        },
        {
            headerName: "Mode (DoubleClick Editable)",
            field: "mode",
            width: 130,
            suppressClickEdit: true,
            headerClass: "header-wrap",
            sortable: true,
            editable: true,
            cellEditor: "agSelectCellEditor",
            filter: true,
            resizable: true,
            cellEditorParams: (params) => {
                const rowData = params.node.data;
                const modeOpt = rowData.modes;

                // Ensure statusopt is an array
                const modeValues = Array.isArray(modeOpt) ? modeOpt : [];
                // console.log('Dropdown 1 values:', dropdown1Values); // Debugging line

                return {
                    values: modeValues,
                };
            },
        },

        {
            headerName: "Rate (DoubleClick Editable)",
            field: "rate",
            width: 110,
            editable: true,
            suppressClickEdit: true,
            sortable: true,
            filter: true,
            resizable: true,
            cellEditor: "agTextCellEditor",
            suppressDestroy: true,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("aerrormode") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleAdd(params.data.id, params.data);
                            }}
                        >
                            Add
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("aerrormode") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                fetchOriginData(params.data);
                            }}
                        >
                            Origin
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData;

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
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
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            {" "}
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    ///ALLOTEDLIST TABLE
    //serial no for listing items
    const addSerialNumberAllottedList = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItemsAllottedList(itemsWithSerialNumber);
    };
    //useEffect
    useEffect(() => {
        addSerialNumberAllottedList(errModesAllottedList);
    }, [errModesAllottedList]);

    //Datatable
    const handlePageChangeAllottedList = (newPage) => {
        setPageAllottedList(newPage);
        // setSelectedRowsAllottedList([]);
    };
    const handlePageSizeChangeAllottedList = (event) => {
        setPageSizeAllottedList(Number(event.target.value));
        setPageAllottedList(1);
    };
    //datatable....
    const handleSearchChangeAllottedList = (event) => {
        setSearchQueryAllottedList(event.target.value);
        setPageAllottedList(1);
    };

    // Split the search query into individual terms
    const searchTermsAllottedList = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasAllottedList = itemsAllottedList?.filter((item) => {
        return searchTermsAllottedList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataAllottedList = filteredDatasAllottedList?.slice((pageAllottedList - 1) * pageSizeAllottedList, pageAllottedList * pageSizeAllottedList);
    const totalPagesAllottedList = Math.ceil(filteredDatasAllottedList?.length / pageSizeAllottedList);
    const visiblePagesAllottedList = Math.min(totalPagesAllottedList, 3);
    const firstVisiblePageAllottedList = Math.max(1, pageAllottedList - 1);
    const lastVisiblePageAllottedList = Math.min(firstVisiblePageAllottedList + visiblePagesAllottedList - 1, totalPagesAllottedList);
    const pageNumbersAllottedList = [];
    for (let i = firstVisiblePageAllottedList; i <= lastVisiblePageAllottedList; i++) {
        pageNumbersAllottedList.push(i);
    }

    const columnDataTableAllottedList = [
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 50,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibilityAllottedList.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibilityAllottedList.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "projectvendor",
            headerName: "Project-Vendor",
            flex: 0,
            width: 180,
            hide: !columnVisibilityAllottedList.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 350,
            hide: !columnVisibilityAllottedList.process,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "FieldName",
            flex: 0,
            width: 250,
            hide: !columnVisibilityAllottedList.fieldname,
            headerClassName: "bold-header",
        },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 100,
            hide: !columnVisibilityAllottedList.mode,
            headerClassName: "bold-header",
        },
        {
            field: "rate",
            headerName: "Rate",
            flex: 0,
            width: 80,
            hide: !columnVisibilityAllottedList.rate,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityAllottedList.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("lerrormode") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            Edit
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTableAllottedList = filteredDataAllottedList.map((item, index) => {
        return {
            ...item,
            id: item._id,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumnsAllottedList = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumnsAllottedList = columnDataTableAllottedList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAllottedList.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibilityAllottedList = (field) => {
        setColumnVisibilityAllottedList((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentAllottedList = (
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
                onClick={handleCloseManageColumnsAllottedList}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageAllottedList} onChange={(e) => setSearchQueryManageAllottedList(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsAllottedList.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityAllottedList[column.field]} onChange={() => toggleColumnVisibilityAllottedList(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityAllottedList(initialColumnVisibilityAllottedList)}>
                            {" "}
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
                                columnDataTableAllottedList.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityAllottedList(newColumnVisibility);
                            }}
                        >
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    ///Origin TABLE
    //serial no for listing items
    const addSerialNumberOrigin = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItemsOrigin(itemsWithSerialNumber);
    };
    //useEffect
    useEffect(() => {
        addSerialNumberOrigin(errModesOrigin);
    }, [errModesOrigin]);

    //Datatable
    const handlePageChangeOrigin = (newPage) => {
        setPageOrigin(newPage);
        // setSelectedRowsOrigin([]);
    };
    const handlePageSizeChangeOrigin = (event) => {
        setPageSizeOrigin(Number(event.target.value));
        setPageOrigin(1);
    };
    //datatable....
    const handleSearchChangeOrigin = (event) => {
        setSearchQueryOrigin(event.target.value);
        setPageOrigin(1);
    };

    // Split the search query into individual terms
    const searchTermsOrigin = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasOrigin = itemsOrigin?.filter((item) => {
        return searchTermsOrigin.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataOrigin = filteredDatasOrigin?.slice((pageOrigin - 1) * pageSizeOrigin, pageOrigin * pageSizeOrigin);
    const totalPagesOrigin = Math.ceil(filteredDatasOrigin?.length / pageSizeOrigin);
    const visiblePagesOrigin = Math.min(totalPagesOrigin, 3);
    const firstVisiblePageOrigin = Math.max(1, pageOrigin - 1);
    const lastVisiblePageOrigin = Math.min(firstVisiblePageOrigin + visiblePagesOrigin - 1, totalPagesOrigin);
    const pageNumbersOrigin = [];
    for (let i = firstVisiblePageOrigin; i <= lastVisiblePageOrigin; i++) {
        pageNumbersOrigin.push(i);
    }

    const columnDataTableOrigin = [
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 50,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibilityOrigin.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibilityOrigin.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "projectvendor",
            headerName: "Project-Vendor",
            flex: 0,
            width: 170,
            hide: !columnVisibilityOrigin.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibilityOrigin.name,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 110,
            hide: !columnVisibilityOrigin.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 90,
            hide: !columnVisibilityOrigin.unit,
            headerClassName: "bold-header",
        },

        {
            field: "user",
            headerName: "Login ID",
            flex: 0,
            width: 110,
            hide: !columnVisibilityOrigin.user,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Audit Date",
            flex: 0,
            width: 100,
            hide: !columnVisibilityOrigin.date,
            headerClassName: "bold-header",
        },

        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 250,
            hide: !columnVisibilityOrigin.process,
            headerClassName: "bold-header",
        },
        {
            field: "errorfilename",
            headerName: "File Name",
            flex: 0,
            width: 200,
            hide: !columnVisibilityOrigin.errorfilename,
            headerClassName: "bold-header",
        },
        {
            field: "documentnumber",
            headerName: "Doc Number",
            flex: 0,
            width: 200,
            hide: !columnVisibilityOrigin.documentnumber,
            headerClassName: "bold-header",
        },
        {
            field: "documnettype",
            headerName: "Doc Type",
            flex: 0,
            width: 200,
            hide: !columnVisibilityOrigin.documnettype,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "FieldName",
            flex: 0,
            width: 200,
            hide: !columnVisibilityOrigin.fieldname,
            headerClassName: "bold-header",
        },
        {
            field: "line",
            headerName: "Line",
            flex: 0,
            width: 90,
            hide: !columnVisibilityOrigin.line,
            headerClassName: "bold-header",
        },
        {
            field: "errorvalue",
            headerName: "Error Value",
            flex: 0,
            width: 110,
            hide: !columnVisibilityOrigin.errorvalue,
            headerClassName: "bold-header",
        },
        {
            field: "correctvalue",
            headerName: "Correct Value",
            flex: 0,
            width: 110,
            hide: !columnVisibilityOrigin.correctvalue,
            headerClassName: "bold-header",
        },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 100,
            hide: !columnVisibilityOrigin.mode,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityOrigin.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("lerrormode") && (
                        <>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCodeOrigin(params.data);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getReason(params.data.id);
                                }}
                            >
                                Sent
                            </Button>
                            {sentId === params.data.id && (
                                <>
                                    <input type="text" />
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            // Add your logic for confirming the input here
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTableOrigin = filteredDataOrigin.map((item, index) => {
        return {
            ...item,
            id: item._id,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumnsOrigin = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumnsOrigin = columnDataTableOrigin.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageOrigin.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibilityOrigin = (field) => {
        setColumnVisibilityOrigin((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentOrigin = (
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
                // onClick={handleCloseManageColumnsOrigin}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageOrigin} onChange={(e) => setSearchQueryManageOrigin(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsOrigin.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityOrigin[column.field]} onChange={() => toggleColumnVisibilityOrigin(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityOrigin(initialColumnVisibilityOrigin)}>
                            {" "}
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
                                columnDataTableOrigin.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityOrigin(newColumnVisibility);
                            }}
                        >
                            {" "}
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
            pagename: String("ErrorMode"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    useEffect(() => {
        getapi();
    }, []);
    console.log(originEdit, "originEdit");

    return (
        <Box>
            <Headtitle title={"ERROR MODE"} />
            {/* ****** Header Content ****** */}

            <PageHeading title="	Error Mode" modulename="Quality" submodulename="Penalty" mainpagename="Penalty Setup" subpagename="Error Mode" subsubpagename="" />
            {isUserRoleCompare?.includes("aerrormode") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Error Mode</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project Vendor <b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={vendors}
                                            value={selectedVendor}
                                            onChange={(e) => {
                                                handleProjectChange(e);
                                            }}
                                            valueRenderer={customValueRendererProject}
                                            labelledBy="Please Select Project Vendor"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Process <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={processOpt}
                                            value={selectedProcess}
                                            onChange={(e) => {
                                                handleProcessChange(e);
                                            }}
                                            valueRenderer={customValueRendererProcess}
                                            labelledBy="Please Select Processs"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} marginTop={3}>
                                    <LoadingButton loading={false} onClick={fetchUnallotList} sx={buttonStyles.buttonsubmit} loadingPosition="end" variant="contained">
                                        {" "}
                                        Get List
                                    </LoadingButton>
                                </Grid>
                                <Grid item md={1} xs={12} sm={6} marginTop={3}>
                                    {/* <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>  */}
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lerrormode") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Error Field List</Typography>
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
                                        <MenuItem value={errModesUnallotList.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelerrormode") && (
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
                                    {isUserRoleCompare?.includes("csverrormode") && (
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
                                    {isUserRoleCompare?.includes("printerrormode") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdferrormode") && (
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
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                        {" "}
                                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={errModesUnallotList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                    />
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
                        {/* {isUserRoleCompare?.includes("bderrormode") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )} */}
                        <br />
                        {loadingUnallotList ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                    getRowId={(params) => params.data.id}
                                    setColumnVisibility={setColumnVisibility}
                                    isHandleChange={isHandleChange}
                                    items={items}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalDatas}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                />
                            </>
                        )}
                    </Box>
                    <br />
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Error Field Updated List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Project Vendor <b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={vendors}
                                        value={selectedVendorAllottedList}
                                        onChange={(e) => {
                                            handleProjectChangeAllottedList(e);
                                        }}
                                        valueRenderer={customValueRendererProjectAllottedList}
                                        labelledBy="Please Select Project Vendor"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Process <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={processOptAllottedList}
                                        value={selectedProcessAllottedList}
                                        onChange={(e) => {
                                            handleProcessChangeAllottedList(e);
                                        }}
                                        valueRenderer={customValueRendererProcessAllottedList}
                                        labelledBy="Please Select Processs"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6} marginTop={3}>
                                <LoadingButton loading={false} onClick={fetchAllottedList} sx={buttonStyles.buttonsubmit} loadingPosition="end" variant="contained">
                                    {" "}
                                    Get List
                                </LoadingButton>
                            </Grid>
                            <Grid item md={1} xs={12} sm={6} marginTop={3}>
                                {/* <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>  */}
                            </Grid>
                        </Grid>
                        <br />
                        <Divider />
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeAllottedList}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeAllottedList}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={errModesAllottedList.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelerrormode") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpenAllottedList(true);

                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csverrormode") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpenAllottedList(true);

                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printerrormode") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintAllottedList}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdferrormode") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenAllottedList(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAllottedList}>
                                        {" "}
                                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableAllottedList}
                                        setItems={setItemsAllottedList}
                                        addSerialNumber={addSerialNumberAllottedList}
                                        setPage={setPageAllottedList}
                                        maindatas={errModesAllottedList}
                                        setSearchedString={setSearchedStringAllottedList}
                                        searchQuery={searchQueryAllottedList}
                                        setSearchQuery={setSearchQueryAllottedList}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsAllottedList}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAllottedList}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {/* Manage Column */}
                        <Popover
                            id={idAllottedList}
                            open={isManageColumnsOpenAllottedList}
                            anchorEl={anchorElAllottedList}
                            onClose={handleCloseManageColumnsAllottedList}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            {manageColumnsContentAllottedList}
                        </Popover>
                        {/* {isUserRoleCompare?.includes("bderrormode") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )} */}
                        <br />
                        {loadingAllottedList ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <AggridTable
                                    rowDataTable={rowDataTableAllottedList}
                                    columnDataTable={columnDataTableAllottedList}
                                    columnVisibility={columnVisibilityAllottedList}
                                    page={pageAllottedList}
                                    setPage={setPageAllottedList}
                                    pageSize={pageSizeAllottedList}
                                    getRowId={(params) => params.data.id}
                                    totalPages={totalPagesAllottedList}
                                    setColumnVisibility={setColumnVisibilityAllottedList}
                                    isHandleChange={isHandleChangeAllottedList}
                                    items={itemsAllottedList}
                                    selectedRows={selectedRowsAllottedList}
                                    setSelectedRows={setSelectedRowsAllottedList}
                                    gridRefTable={gridRefTableAllottedList}
                                    paginated={false}
                                    filteredDatas={filteredDatasAllottedList}
                                    // totalDatas={totalDatas}
                                    searchQuery={searchedStringAllottedList}
                                    handleShowAllColumns={handleShowAllColumnsAllottedList}
                                    setFilteredRowData={setFilteredRowDataAllottedList}
                                    filteredRowData={filteredRowDataAllottedList}
                                    setFilteredChanges={setFilteredChangesAllottedList}
                                    filteredChanges={filteredChangesAllottedList}
                                    gridRefTableImg={gridRefTableImgAllottedList}
                                />
                            </>
                        )}
                    </Box>
                </>
            )}

            {/* ****** Table End ****** */}
            {/* Edit DIALOG */}
            <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: "50px" }} fullWidth={true} maxWidth="md">
                <Box sx={{ padding: "20px" }}>
                    <>
                        {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>Edit Error Field </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Project Vendor<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={vendors}
                                        value={{
                                            label: errormodeEdit.projectvendor,
                                            value: errormodeEdit.projectvendor,
                                        }}
                                        onChange={(e) => {
                                            setErrormodeEdit({
                                                ...errormodeEdit,
                                                projectvendor: e.value,
                                                process: "Please Select Process",
                                            });
                                            fetchProcessEdit(e.value);
                                        }}
                                        styles={{
                                            menu: (provided) => ({
                                                ...provided,
                                                overflowY: "hidden",
                                                maxHeight: 200, // Adjust height for 5 rows (you can change this based on your row height)
                                            }),
                                        }}
                                        menuPlacement="auto" // Adjusts the placement of the menu if there isn't enough space
                                        menuPosition="fixed"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Process <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={processOptEdit}
                                        value={{
                                            label: errormodeEdit.process,
                                            value: errormodeEdit.process,
                                        }}
                                        onChange={(e) => {
                                            setErrormodeEdit({
                                                ...errormodeEdit,
                                                process: e.value,
                                                fieldname: "Please Select Fieldname",
                                            });
                                            fetchFieldNamesEdit(errormodeEdit.projectvendor, e.value);
                                        }}
                                        styles={{
                                            menu: (provided) => ({
                                                ...provided,
                                                overflowY: "hidden",
                                                maxHeight: 200, // Adjust height for 5 rows (you can change this based on your row height)
                                            }),
                                        }}
                                        menuPlacement="auto" // Adjusts the placement of the menu if there isn't enough space
                                        menuPosition="fixed"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Field Name <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={fieldNameOpt}
                                        value={{
                                            label: errormodeEdit.fieldname,
                                            value: errormodeEdit.fieldname,
                                        }}
                                        onChange={(e) => {
                                            setErrormodeEdit({
                                                ...errormodeEdit,
                                                fieldname: e.value,
                                            });
                                        }}
                                        styles={{
                                            menu: (provided) => ({
                                                ...provided,
                                                overflowY: "hidden",
                                                maxHeight: 200, // Adjust height for 5 rows (you can change this based on your row height)
                                            }),
                                        }}
                                        menuPlacement="auto" // Adjusts the placement of the menu if there isn't enough space
                                        menuPosition="fixed"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Mode<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={modes}
                                        value={{
                                            label: errormodeEdit.mode,
                                            value: errormodeEdit.mode,
                                        }}
                                        onChange={(e) => {
                                            setErrormodeEdit({
                                                ...errormodeEdit,
                                                mode: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Rate <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Rate"
                                        value={errormodeEdit.rate}
                                        onChange={(e) => {
                                            setErrormodeEdit({ ...errormodeEdit, rate: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                    Update
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                        {/* </DialogContent> */}
                    </>
                </Box>
            </Dialog>

            {/* ORGIN DIALOG */}
            <Dialog open={isOriginOpen} onClose={handleClickCloseOrigin} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: "50px" }} fullWidth={true} maxWidth="1400px">
                <Box sx={{ padding: "20px" }}>
                    <Typography sx={userStyle.HeaderText}>Upload Error List</Typography>
                    <Grid container sx={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelectorgin"
                                    size="small"
                                    value={pageSizeOrigin}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeOrigin}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={errModesOrigin.length}>All</MenuItem>
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
                                {isUserRoleCompare?.includes("excelerrormode") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpenOrigin(true);

                                                setFormat("xl");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileExcel />
                                            &ensp;Export to Excel&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csverrormode") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpenOrigin(true);

                                                setFormat("csv");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileCsv />
                                            &ensp;Export to CSV&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printerrormode") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprintOrigin}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdferrormode") && (
                                    <>
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpenOrigin(true);
                                            }}
                                        >
                                            <FaFilePdf />
                                            &ensp;Export to PDF&ensp;
                                        </Button>
                                    </>
                                )}
                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImageOrigin}>
                                    {" "}
                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableOrigin}
                                    setItems={setItemsOrigin}
                                    addSerialNumber={addSerialNumberOrigin}
                                    setPage={setPageOrigin}
                                    maindatas={errModesOrigin}
                                    setSearchedString={setSearchedStringOrigin}
                                    searchQuery={searchQueryOrigin}
                                    setSearchQuery={setSearchQueryOrigin}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsOrigin}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsOrigin}>
                        Manage Columns
                    </Button>
                    &ensp;
                    {/* Manage Column */}
                    <Popover
                        id={idOrigin}
                        open={isManageColumnsOpenOrigin}
                        anchorEl={anchorElOrigin}
                        onClose={handleCloseManageColumnsOrigin}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContentOrigin}
                    </Popover>
                    <br />
                    {loadingOrigin ? (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </>
                    ) : (
                        <>
                            <AggridTable
                                rowDataTable={rowDataTableOrigin}
                                columnDataTable={columnDataTableOrigin}
                                columnVisibility={columnVisibilityOrigin}
                                page={pageOrigin}
                                setPage={setPageOrigin}
                                pageSize={pageSizeOrigin}
                                getRowId={(params) => params.data.id}
                                totalPages={totalPagesOrigin}
                                setColumnVisibility={setColumnVisibilityOrigin}
                                isHandleChange={isHandleChangeOrigin}
                                items={itemsOrigin}
                                selectedRows={selectedRowsOrigin}
                                setSelectedRows={setSelectedRowsOrigin}
                                gridRefTable={gridRefTableOrigin}
                                paginated={false}
                                filteredDatas={filteredDatasOrigin}
                                // totalDatas={totalDatas}
                                searchQuery={searchedStringOrigin}
                                handleShowAllColumns={handleShowAllColumnsOrigin}
                                setFilteredRowData={setFilteredRowDataOrigin}
                                filteredRowData={filteredRowDataOrigin}
                                setFilteredChanges={setFilteredChangesOrigin}
                                filteredChanges={filteredChangesOrigin}
                                gridRefTableImg={gridRefTableImgOrigin}
                            />
                        </>
                    )}
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "end" }}>
                            <Button sx={buttonStyles.btncancel} onClick={handleClickCloseOrigin}>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>

            {/* ORGIN DIALOG */}

            <Dialog open={isOriginOpenEdit} onClose={handleClickCloseEditOrigin} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: "50px" }} fullWidth={true} maxWidth="1400px">
                <Box sx={{ padding: "20px" }}>
                    <>
                        {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>Update Error List</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Project Vendor<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={vendors}
                                        value={{
                                            label: originEdit.projectvendor,
                                            value: originEdit.projectvendor,
                                        }}
                                        onChange={(e) => {
                                            setOriginEdit({
                                                ...originEdit,
                                                projectvendor: e.value,
                                                process: "Please Select Process",
                                            });
                                            fetchProcessOriginEdit(e.value);
                                        }}
                                        styles={{
                                            menu: (provided) => ({
                                                ...provided,
                                                overflowY: "hidden",
                                                maxHeight: 200, // Adjust height for 5 rows (you can change this based on your row height)
                                            }),
                                        }}
                                        menuPlacement="auto" // Adjusts the placement of the menu if there isn't enough space
                                        menuPosition="fixed"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        LoginID <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter LoginID"
                                        value={originEdit.loginid}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, loginid: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Date <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="date"
                                        placeholder="Please Enter Date"
                                        value={originEdit.date}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, date: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Process <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={processOptEditOrigin}
                                        value={{
                                            label: originEdit.process,
                                            value: originEdit.process,
                                        }}
                                        onChange={(e) => {
                                            setOriginEdit({
                                                ...originEdit,
                                                process: e.value,
                                            });
                                            // fetchFieldNamesEdit(originEdit.projectvendor, e.value);
                                        }}
                                        styles={{
                                            menu: (provided) => ({
                                                ...provided,
                                                overflowY: "hidden",
                                                maxHeight: 200, // Adjust height for 5 rows (you can change this based on your row height)
                                            }),
                                        }}
                                        menuPlacement="auto" // Adjusts the placement of the menu if there isn't enough space
                                        menuPosition="fixed"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Error Filename <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Filename"
                                        value={originEdit.errorfilename}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, errorfilename: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Document Number <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Documentnumber"
                                        value={originEdit.documentnumber}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, documentnumber: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Document Type <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Documenttype"
                                        value={originEdit.documenttype}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, documenttype: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Error FieldName <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Fieldname"
                                        value={originEdit.fieldname}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, fieldname: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Line <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Line"
                                        value={originEdit.line}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, line: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Errorvalue</Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Errorvalue"
                                        value={originEdit.errorvalue}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, errorvalue: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Correctvalue</Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Correctvalue"
                                        value={originEdit.correctvalue}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, correctvalue: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        File link <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter Filelink"
                                        value={originEdit.link}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, link: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Doc Link <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedrate"
                                        type="text"
                                        placeholder="Please Enter DocLink"
                                        value={originEdit.doclink}
                                        onChange={(e) => {
                                            setOriginEdit({ ...originEdit, doclink: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button variant="contained" onClick={() => editOriginSubmit(originEdit.mode)} sx={buttonStyles.buttonsubmit}>
                                    Update
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClickCloseEditOrigin}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                        {/* </DialogContent> */}
                    </>
                </Box>
            </Dialog>

            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredData ?? []}
                itemsTwo={errModesUnallotList ?? []}
                filename={"ErrorMode"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportDataAllottedList
                isFilterOpen={isFilterOpenAllottedList}
                handleCloseFilterMod={handleCloseFilterModAllottedList}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenAllottedList}
                isPdfFilterOpen={isPdfFilterOpenAllottedList}
                setIsPdfFilterOpen={setIsPdfFilterOpenAllottedList}
                handleClosePdfFilterMod={handleClosePdfFilterModAllottedList}
                filteredDataTwo={filteredDataAllottedList ?? []}
                itemsTwo={errModesAllottedList ?? []}
                filename={"ErrorMode AllotedList"}
                exportColumnNames={exportColumnNamesAllottedList}
                exportRowValues={exportRowValuesAllottedList}
                componentRef={componentRefAllottedList}
            />
            <ExportDataOrigin
                isFilterOpen={isFilterOpenOrigin}
                handleCloseFilterMod={handleCloseFilterModOrigin}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenOrigin}
                isPdfFilterOpen={isPdfFilterOpenOrigin}
                setIsPdfFilterOpen={setIsPdfFilterOpenOrigin}
                handleClosePdfFilterMod={handleClosePdfFilterModOrigin}
                filteredDataTwo={filteredDataOrigin ?? []}
                itemsTwo={errModesOrigin ?? []}
                filename={"ErrorMode Origin Data"}
                exportColumnNames={exportColumnNamesOrigin}
                exportRowValues={exportRowValuesOrigin}
                componentRef={componentRefOrigin}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Error Mode Info"
            // addedby={addedby}
            // updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                // onConfirm={delFrequency}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default ErrorMode;