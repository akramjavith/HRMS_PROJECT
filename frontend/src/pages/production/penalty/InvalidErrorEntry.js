import React, { useState, useEffect, useContext, useRef } from "react";
import { IconButton, Box, Chip, Typography, Paper, TableBody, TextField, List, ListItem, ListItemText, Popover, Checkbox, TableRow, Select, MenuItem, TableCell, FormControl, OutlinedInput, TableContainer, Grid, Table, TableHead, Button, DialogContent, DialogActions, Dialog } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import "jspdf-autotable";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import { ExportXL, ExportCSV } from "../../../components/Export";
import axios from "axios";
import moment from "moment";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Selects from "react-select";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MultiSelect } from "react-multi-select-component";
import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from "dom-to-image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function InvalidErrorEntry() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const [filteredRowDataNear, setFilteredRowDataNear] = useState([]);
    const [filteredChangesNear, setFilteredChangesNear] = useState(null);
    const [searchedStringNear, setSearchedStringNear] = useState("");
    const [isHandleChangeNear, setIsHandleChangeNear] = useState(false);
    const gridRefTableImgNear = useRef(null);
    const gridRefTableNear = useRef(null);

    const [viewall, setViewall] = useState([]);

    const [selectProjectVendor, setSelectedProjectVendor] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedSLoginId, setSelectedLoginId] = useState([]);

    const [processOpt, setProcessQueueArray] = useState([]);
    const [loginIdOpt, setClientLoginIDOpt] = useState([]);

    const currentDate = new Date(); // Get the current date
    const currentDay = currentDate.getDate(); // Get the day of the month
    const currentMonth = currentDate.getMonth() + 1; // Get the day of the month

    const [penaltyErrorUpload, setPenaltyErrorUpload] = useState({
        fromdate: moment(currentDate).format("YYYY-MM-DD"),
        todate: moment(currentDate).format("YYYY-MM-DD"),

        rejectreason: "",
        clienterror: "",

        projectvendorfirst: "Please Select Project Vendor",
        processfirst: "Please Select Process",
        loginidfirst: "Please Select Login ID",
        errorvaluefirst: "",
        correctvaluefirst: "",
        reasonfirst: "",

        projectvendordouble: "Please Select Project Vendor",
        processdouble: "Please Select Process",
        loginiddouble: "Please Select Login ID",
        errorvaluedouble: "",
        correctvaluedouble: "",
        reasondouble: "",

        projectvendorthird: "Please Select Project Vendor",
        processthird: "Please Select Process",
        loginidthird: "Please Select Login ID",
        errorvaluethird: "",
        correctvaluethird: "",
        reasonthird: "",

        date: "",
        errorfilename: "",
        documentnumber: "",
        documenttype: "",
        fieldname: "",
        line: "",
        errorvalue: "",
        correctvalue: "",
        link: "",
        doclink: "",
    });

    const handleClearMove = (e) => {
        e.preventDefault();

        setPenaltyErrorUpload({
            ...penaltyErrorUpload,

            projectvendorfirst: "Please Select Project Vendor",
            processfirst: "Please Select Process",
            loginidfirst: "Please Select Login ID",
            errorvaluefirst: "",
            correctvaluefirst: "",
            reasonfirst: "",

            projectvendordouble: "Please Select Project Vendor",
            processdouble: "Please Select Process",
            loginiddouble: "Please Select Login ID",
            errorvaluedouble: "",
            correctvaluedouble: "",
            reasondouble: "",

            projectvendorthird: "Please Select Project Vendor",
            processthird: "Please Select Process",
            loginidthird: "Please Select Login ID",
            errorvaluethird: "",
            correctvaluethird: "",
            reasonthird: "",
        });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const handleProjecvendor = (options) => {
        setSelectedProjectVendor(options);
        setSelectedProcess([]);
        setSelectedLoginId([]);
        // fetchProcessQueueFilter(options.map(d => d.value));

        // fetchClientUserIDFilter(options.map(d => d.value));
    };
    const customValueRendererProject = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select ProjectVendor";
    };

    const handleProcess = (options) => {
        setSelectedProcess(options);
        setSelectedLoginId([]);
    };
    const customValueRendererProcess = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Process";
    };

    const handleLoginId = (options) => {
        setSelectedLoginId(options);
    };
    const customValueLoginId = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select LoginId";
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

        setPenaltyErrorUpload({
            ...penaltyErrorUpload,
            fromdate: moment(currentDate).format("YYYY-MM-DD"),
            todate: moment(currentDate).format("YYYY-MM-DD"),

            rejectreason: "",
            clienterror: "",

            projectvendorfirst: "Please Select Project Vendor",
            processfirst: "Please Select Process",
            loginidfirst: "Please Select Login ID",
            errorvaluefirst: "",
            correctvaluefirst: "",
            reasonfirst: "",

            projectvendordouble: "Please Select Project Vendor",
            processdouble: "Please Select Process",
            loginiddouble: "Please Select Login ID",
            errorvaluedouble: "",
            correctvaluedouble: "",
            reasondouble: "",

            projectvendorthird: "Please Select Project Vendor",
            processthird: "Please Select Process",
            loginidthird: "Please Select Login ID",
            errorvaluethird: "",
            correctvaluethird: "",
            reasonthird: "",

            date: "",
            errorfilename: "",
            documentnumber: "",
            documenttype: "",
            fieldname: "",
            line: "",
            errorvalue: "",
            correctvalue: "",
            link: "",
            doclink: "",
        });
    };

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
        doclink: "",
        status: "",
    });
    // console.log(viewsingleData, "viewsingleData")
    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    const [projOpt, setProjOpt] = useState([]);
    const [processOptFilter, setProcessQueueArrayFilter] = useState([]);
    const [loginIdOptFilter, setClientLoginIDOptFilter] = useState([]);
    const [loginIdOptEdit, setClientLoginIDOptEdit] = useState([]);
    const [processOptEdit, setProcessQueueArrayEdit] = useState([]);
    const [bulkError, setBulkError] = useState([]);
    const [penaltyError, setPenaltyError] = useState([]);

    const getProject = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(`${SERVICE.VENDORMASTER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projectOpt = [...response.data.vendormaster.map((t) => ({ ...t, label: t.projectname + "-" + t.name, value: t.projectname + "-" + t.name }))];
            setProjOpt(projectOpt);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // const fetchProcessQueueFilter = async (projname) => {

    //     setPageName(!pageName)
    //     try {
    //         let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => projname.includes(item.projectvendor))
    //         const Que = processFilter.map((t) => ({
    //             label: t.processqueue,
    //             value: t.processqueue
    //         }))
    //         setProcessQueueArrayFilter(Que);
    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };

    // const fetchClientUserIDFilter = async (proj) => {
    //     setPageName(!pageName)
    //     try {
    //         let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         const filterProjBased = res_freq?.data?.clientuserid.filter((item) => proj.includes(item.projectvendor))
    //         const loginIdOpt = [...filterProjBased.map((d) => ({
    //             ...d,
    //             label: d.userid,
    //             value: d.userid,
    //         }))];
    //         setClientLoginIDOptFilter(loginIdOpt);
    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };

    //get all client user id.

    const fetchProcessQueue = async (projname) => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => item.projectvendor === projname);
            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue,
            }));
            setProcessQueueArray(Que);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchClientUserID = async (proj) => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterProjBased = res_freq?.data?.clientuserid.filter((item) => item.projectvendor === proj);
            const loginIdOpt = [
                ...filterProjBased.map((d) => ({
                    ...d,
                    label: d.userid,
                    value: d.userid,
                })),
            ];
            setClientLoginIDOpt(loginIdOpt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchClientUserIDEdit = async (proj) => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterProjBased = res_freq?.data?.clientuserid.filter((item) => item.projectvendor === proj);
            const loginIdOpt = [
                ...filterProjBased.map((d) => ({
                    ...d,
                    label: d.userid,
                    value: d.userid,
                })),
            ];
            setClientLoginIDOptEdit(loginIdOpt);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all client user id.
    const fetchProcessQueueEdit = async (projname) => {
        const projName = projname?.split("-")[0];
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => item.projectvendor === projname);

            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue,
            }));
            setProcessQueueArrayEdit(Que);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchPenaltyErrorUpload = async () => {
        try {
            let Res = await axios.get(SERVICE.PENALTYERRORUPLOADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPenaltyError(Res?.data?.penaltyerroruploadpoints);
        } catch (err) {
            handleApiError(err, console.log(err, "peanlerr"), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchBulkErrorPointsData = async () => {
        try {
            let res_project = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setBulkError(res_project?.data?.bulkerroruploadpoints);
        } catch (err) {
            handleApiError(err, console.log(err, "bulkerr"), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCode = async (id, type) => {
        setPageName(!pageName);
        try {
            if (type == "Bulkupload") {
                let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                setEditsingleData(Res?.data?.sbulkerroruploadpoints);
                handleClickOpenEdit();
                fetchClientUserIDEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);
                fetchProcessQueueEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);
            } else if (type == "Errorupload") {
                let Res = await axios.get(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                setEditsingleData(Res?.data?.spenaltyerroruploadpoints);
                handleClickOpenEdit();
                fetchClientUserIDEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
                fetchProcessQueueEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCodeView = async (id, type) => {
        setPageName(!pageName);
        try {
            if (type == "Bulkupload") {
                let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                setviewsingleData(Res?.data?.sbulkerroruploadpoints);
                handleClickOpenEditError();
                fetchClientUserIDEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);
                fetchProcessQueueEdit(Res?.data?.sbulkerroruploadpoints.projectvendor);
            } else if (type == "Errorupload") {
                let Res = await axios.get(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                setviewsingleData(Res?.data?.spenaltyerroruploadpoints);
                handleClickOpenEditError();
                fetchClientUserIDEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
                fetchProcessQueueEdit(Res?.data?.spenaltyerroruploadpoints.projectvendor);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        getProject();
    }, []);

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
        doclink: "",
    });

    //Project updateby edit page...
    let updateby = editsingleData.updatedby;
    const [updateCounts, setUpdateCounts] = useState({}); // Track update counts
    //editing the single data...
    const sendEditRequest = async () => {
        let projectsid = editsingleData._id;
        setPageName(!pageName);
        let currentCount = updateCounts[projectsid] ? updateCounts[projectsid] : 1;
        console.log(currentCount, "currentCount")
        if (currentCount > 4) {
            setPopupContentMalert(`Update for should not exceed 4 times`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return;
        }
        try {
            if (editsingleData.mode == "Bulkupload") {
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
                    count: currentCount,
                    doclink: String(editsingleData.doclink),
                    validatestatus: true,
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();

                setUpdateCounts((prevCounts) => ({
                    ...prevCounts,
                    [projectsid]: currentCount + 1,
                }));



                // await getviewCodeall()
                let final = viewall.map((item) => {
                    if (editsingleData._id == item._id) {
                        return {
                            ...item,
                            projectvendor: String(editsingleData.projectvendor),
                            process: String(editsingleData.process),
                            loginid: String(editsingleData.loginid),
                            // date: String(editsingleData.date),
                            date: moment(editsingleData.date).format("DD/MM/YYYY"),
                            mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
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
                        };
                    }

                    return item;
                });

                setItemsNearTat(final);
                await TableFilter();

                handleCloseModEdit();
                // await fetchFilteredDatas();
                // await fetchBulkErrorPointsData();
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
                    count: currentCount,
                    validatestatus: true,
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


                let final = viewall.map((item) => {
                    if (editsingleData._id == item._id) {
                        return {
                            ...item,
                            projectvendor: String(editsingleData.projectvendor),
                            process: String(editsingleData.process),
                            loginid: String(editsingleData.loginid),
                            // date: String(editsingleData.date),
                            date: moment(editsingleData.date).format("DD/MM/YYYY"),
                            mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
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
                        };
                    }

                    return item;
                });


                setItemsNearTat(final);
                await TableFilter();
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();

                handleCloseModEdit();
            }

            // await fetchPenaltyErrorUpload();
            // await fetchBulkErrorPointsData();
            // setPopupContent("Updated Successfully");
            // setPopupSeverity("success");
            // handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        if (editsingleData.projectvendor === "") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.date == "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.errorfilename == "") {
            setPopupContentMalert("Please Enter Error File Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.documentnumber == "") {
            setPopupContentMalert("Please Enter Document Number");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.documenttype == "") {
            setPopupContentMalert("Please Enter Document Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (editsingleData.fieldname == "") {
            setPopupContentMalert("Please Enter Field Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.line == "") {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.errorvalue == "") {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.correctvalue == "") {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.link == "") {
            setPopupContentMalert("Please Enter Link");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (editsingleData.doclink == "") {
            setPopupContentMalert("Please Enter Doc Link");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        // else if (isNameMatch) {
        //     setPopupContentMalert("Data Already Exists!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // }
        else {
            sendEditRequest();
        }
    };

    let addedby = viewsingleData.addedby;
    //Move

    const sendEditRequestErrorLoad = async () => {
        let projectsid = viewsingleData._id;
        setPageName(!pageName);
        try {
            if (viewsingleData.mode == "Bulkupload") {
                let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    movedstatus: true,
                    invalidbulkupload: [
                        {
                            ...viewsingleData.invalidbulkupload,
                            processinvalid: String(viewsingleData.process),
                            fieldinvalid: String(viewsingleData.fieldname),
                            errorinvalid: String(viewsingleData.errorvalue),
                            correctvalueinvalid: String(viewsingleData.correctvalue),

                            clienterror: String(penaltyErrorUpload.clienterror),
                            rejectreason: String(penaltyErrorUpload.rejectreason),
                            projectvendorfirst: String(penaltyErrorUpload.projectvendorfirst),
                            processfirst: String(penaltyErrorUpload.processfirst),
                            loginidfirst: String(penaltyErrorUpload.loginidfirst),
                            errorvaluefirst: String(penaltyErrorUpload.errorvaluefirst),
                            correctvaluefirst: String(penaltyErrorUpload.correctvaluefirst),
                            reasonfirst: String(penaltyErrorUpload.reasonfirst),

                            projectvendordouble: String(penaltyErrorUpload.projectvendordouble),
                            processdouble: String(penaltyErrorUpload.processdouble),
                            loginiddouble: String(penaltyErrorUpload.loginiddouble),
                            errorvaluedouble: String(penaltyErrorUpload.errorvaluedouble),
                            correctvaluedouble: String(penaltyErrorUpload.correctvaluedouble),
                            reasondouble: String(penaltyErrorUpload.reasondouble),

                            projectvendorthird: String(penaltyErrorUpload.projectvendorthird),
                            processthird: String(penaltyErrorUpload.processthird),
                            loginidthird: String(penaltyErrorUpload.loginidthird),
                            errorvaluethird: String(penaltyErrorUpload.errorvaluethird),
                            correctvaluethird: String(penaltyErrorUpload.correctvaluethird),
                            reasonthird: String(penaltyErrorUpload.reasonthird),
                        },
                    ],
                    // invalidcheck: true,
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                let payload = [];

                // First set of fields
                if (penaltyErrorUpload.projectvendorfirst !== "" || penaltyErrorUpload.projectvendorfirst !== "Please Select Project Vendor") {
                    payload.push({
                        fieldname: String(viewsingleData.fieldname),
                        date: String(viewsingleData.date),
                        mode: String("Bulkupload"),
                        dateformatted: String(viewsingleData.date),
                        errorfilename: String(viewsingleData.errorfilename),
                        documentnumber: String(viewsingleData.documentnumber),
                        documenttype: String(viewsingleData.documenttype),
                        line: String(viewsingleData.line),
                        errorvalue: String(viewsingleData.errorvalue),
                        correctvalue: String(viewsingleData.correctvalue),
                        link: String(viewsingleData.link),
                        doclink: String(viewsingleData.doclink),

                        projectvendor: String(penaltyErrorUpload.projectvendorfirst),
                        process: String(penaltyErrorUpload.processfirst),
                        loginid: String(penaltyErrorUpload.loginidfirst),
                        errorvalue: String(penaltyErrorUpload.errorvaluefirst),
                        correctvalue: String(penaltyErrorUpload.correctvaluefirst),
                        reason: String(penaltyErrorUpload.reasonfirst),
                        //movedstatus: true,

                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],
                    });
                }

                // Second set of fields
                if (penaltyErrorUpload.projectvendordouble !== "" || penaltyErrorUpload.projectvendordouble !== "Please Select Project Vendor") {
                    payload.push({
                        fieldname: String(viewsingleData.fieldname),
                        date: String(viewsingleData.date),
                        mode: String("Bulkupload"),
                        dateformatted: String(viewsingleData.date),
                        errorfilename: String(viewsingleData.errorfilename),
                        documentnumber: String(viewsingleData.documentnumber),
                        documenttype: String(viewsingleData.documenttype),
                        line: String(viewsingleData.line),
                        errorvalue: String(viewsingleData.errorvalue),
                        correctvalue: String(viewsingleData.correctvalue),
                        link: String(viewsingleData.link),
                        doclink: String(viewsingleData.doclink),

                        projectvendor: String(penaltyErrorUpload.projectvendordouble),
                        process: String(penaltyErrorUpload.processdouble),
                        loginid: String(penaltyErrorUpload.loginiddouble),
                        errorvalue: String(penaltyErrorUpload.errorvaluedouble),
                        correctvalue: String(penaltyErrorUpload.correctvaluedouble),
                        reason: String(penaltyErrorUpload.reasondouble),
                        //movedstatus: true,
                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],
                    });
                }

                // Third set of fields
                if (penaltyErrorUpload.projectvendorthird !== "" || penaltyErrorUpload.projectvendorthird !== "Please Select Project Vendor") {
                    payload.push({
                        fieldname: String(viewsingleData.fieldname),
                        date: String(viewsingleData.date),
                        mode: String("Bulkupload"),
                        dateformatted: String(viewsingleData.date),
                        errorfilename: String(viewsingleData.errorfilename),
                        documentnumber: String(viewsingleData.documentnumber),
                        documenttype: String(viewsingleData.documenttype),
                        line: String(viewsingleData.line),
                        errorvalue: String(viewsingleData.errorvalue),
                        correctvalue: String(viewsingleData.correctvalue),
                        link: String(viewsingleData.link),
                        doclink: String(viewsingleData.doclink),

                        projectvendor: String(penaltyErrorUpload.projectvendorthird),
                        process: String(penaltyErrorUpload.processthird),
                        loginid: String(penaltyErrorUpload.loginidthird),
                        errorvalue: String(penaltyErrorUpload.errorvaluethird),
                        correctvalue: String(penaltyErrorUpload.correctvaluethird),
                        reason: String(penaltyErrorUpload.reasonthird),
                        //movedstatus: true,
                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],
                    });
                }

                // Send the request
                let reserrorcreate = await axios.post(`${SERVICE.BULK_ERROR_UPLOADS_CREATE}`, payload, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                // let res_meet = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_INVALID_REJECTED, {
                //     headers: {
                //         Authorization: `Bearer ${auth.APIToken}`,
                //     },
                //     projectvendor: viewsingleData.projectvendor,
                //     process: viewsingleData.process,
                //     loginid: viewsingleData.loginid,
                //     date: viewsingleData.date,
                // });

                // await fetchPenaltyErrorUpload();
                // await fetchBulkErrorPointsData();

                await TableFilter();
                setPopupContent("Moved Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseModEditError();
                handleCloseview();
            } else {
                let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    movedstatus: true,
                    invalidbulkupload: [
                        {
                            ...viewsingleData.invalidbulkupload,
                            processinvalid: String(viewsingleData.process),
                            fieldinvalid: String(viewsingleData.fieldname),
                            errorinvalid: String(viewsingleData.errorvalue),
                            correctvalueinvalid: String(viewsingleData.correctvalue),

                            clienterror: String(penaltyErrorUpload.clienterror),
                            rejectreason: String(penaltyErrorUpload.rejectreason),
                            projectvendorfirst: String(penaltyErrorUpload.projectvendorfirst),
                            processfirst: String(penaltyErrorUpload.processfirst),
                            loginidfirst: String(penaltyErrorUpload.loginidfirst),
                            errorvaluefirst: String(penaltyErrorUpload.errorvaluefirst),
                            correctvaluefirst: String(penaltyErrorUpload.correctvaluefirst),
                            reasonfirst: String(penaltyErrorUpload.reasonfirst),

                            projectvendordouble: String(penaltyErrorUpload.projectvendordouble),
                            processdouble: String(penaltyErrorUpload.processdouble),
                            loginiddouble: String(penaltyErrorUpload.loginiddouble),
                            errorvaluedouble: String(penaltyErrorUpload.errorvaluedouble),
                            correctvaluedouble: String(penaltyErrorUpload.correctvaluedouble),
                            reasondouble: String(penaltyErrorUpload.reasondouble),

                            projectvendorthird: String(penaltyErrorUpload.projectvendorthird),
                            processthird: String(penaltyErrorUpload.processthird),
                            loginidthird: String(penaltyErrorUpload.loginidthird),
                            errorvaluethird: String(penaltyErrorUpload.errorvaluethird),
                            correctvaluethird: String(penaltyErrorUpload.correctvaluethird),
                            reasonthird: String(penaltyErrorUpload.reasonthird),
                        },
                    ],
                    // invalidcheck: true,
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                let payload = [];

                // First set of fields
                if (penaltyErrorUpload.projectvendorfirst !== "" || penaltyErrorUpload.projectvendorfirst !== "Please Select Project Vendor") {
                    payload.push({
                        fieldname: String(viewsingleData.fieldname),
                        date: String(viewsingleData.date),
                        errorfilename: String(viewsingleData.errorfilename),
                        documentnumber: String(viewsingleData.documentnumber),
                        documenttype: String(viewsingleData.documenttype),
                        line: String(viewsingleData.line),
                        errorvalue: String(viewsingleData.errorvalue),
                        correctvalue: String(viewsingleData.correctvalue),
                        link: String(viewsingleData.link),
                        doclink: String(viewsingleData.doclink),

                        projectvendor: String(penaltyErrorUpload.projectvendorfirst),
                        process: String(penaltyErrorUpload.processfirst),
                        loginid: String(penaltyErrorUpload.loginidfirst),
                        errorvalue: String(penaltyErrorUpload.errorvaluefirst),
                        correctvalue: String(penaltyErrorUpload.correctvaluefirst),
                        reason: String(penaltyErrorUpload.reasonfirst),
                        //movedstatus: true,

                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],
                    });
                }

                // Second set of fields
                if (penaltyErrorUpload.projectvendordouble !== "" || penaltyErrorUpload.projectvendordouble !== "Please Select Project Vendor") {
                    payload.push({
                        fieldname: String(viewsingleData.fieldname),
                        date: String(viewsingleData.date),
                        errorfilename: String(viewsingleData.errorfilename),
                        documentnumber: String(viewsingleData.documentnumber),
                        documenttype: String(viewsingleData.documenttype),
                        line: String(viewsingleData.line),
                        errorvalue: String(viewsingleData.errorvalue),
                        correctvalue: String(viewsingleData.correctvalue),
                        link: String(viewsingleData.link),
                        doclink: String(viewsingleData.doclink),

                        projectvendor: String(penaltyErrorUpload.projectvendordouble),
                        process: String(penaltyErrorUpload.processdouble),
                        loginid: String(penaltyErrorUpload.loginiddouble),
                        errorvalue: String(penaltyErrorUpload.errorvaluedouble),
                        correctvalue: String(penaltyErrorUpload.correctvaluedouble),
                        reason: String(penaltyErrorUpload.reasondouble),
                        //movedstatus: true,
                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],
                    });
                }

                // Third set of fields
                if (penaltyErrorUpload.projectvendorthird !== "" || penaltyErrorUpload.projectvendorthird !== "Please Select Project Vendor") {
                    payload.push({
                        fieldname: String(viewsingleData.fieldname),
                        date: String(viewsingleData.date),
                        errorfilename: String(viewsingleData.errorfilename),
                        documentnumber: String(viewsingleData.documentnumber),
                        documenttype: String(viewsingleData.documenttype),
                        line: String(viewsingleData.line),
                        errorvalue: String(viewsingleData.errorvalue),
                        correctvalue: String(viewsingleData.correctvalue),
                        link: String(viewsingleData.link),
                        doclink: String(viewsingleData.doclink),

                        projectvendor: String(penaltyErrorUpload.projectvendorthird),
                        process: String(penaltyErrorUpload.processthird),
                        loginid: String(penaltyErrorUpload.loginidthird),
                        errorvalue: String(penaltyErrorUpload.errorvaluethird),
                        correctvalue: String(penaltyErrorUpload.correctvaluethird),
                        reason: String(penaltyErrorUpload.reasonthird),
                        //movedstatus: true,
                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],
                    });
                }
                // Send the request
                let reserrorcreate = await axios.post(`${SERVICE.PENALTYERRORUPLOADS_CREATE}`, payload, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                // let res_meet = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_INVALID_REJECTED, {
                //     headers: {
                //         Authorization: `Bearer ${auth.APIToken}`,
                //     },
                //     projectvendor: viewsingleData.projectvendor,
                //     process: viewsingleData.process,
                //     loginid: viewsingleData.loginid,
                //     date: viewsingleData.date,
                // });

                // await fetchPenaltyErrorUpload();
                // await fetchBulkErrorPointsData();

                await TableFilter();
                setPopupContent("Moved Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseModEditError();
                handleCloseview();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmitErrorLoad = async (e) => {
        e.preventDefault();

        if (penaltyErrorUpload.projectvendorfirst == "Please Select Project Vendor" && penaltyErrorUpload.projectvendordouble == "Please Select Project Vendor" && penaltyErrorUpload.projectvendorthird == "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Any of the Project Vendor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (penaltyErrorUpload.projectvendorfirst != "Please Select Project Vendor" && (penaltyErrorUpload.processfirst == "Please Select Process" || penaltyErrorUpload.loginidfirst == "Please Select Login ID" || penaltyErrorUpload.errorvaluefirst === "" || penaltyErrorUpload.correctvaluefirst === "" || penaltyErrorUpload.reasonfirst === "")) {
            setPopupContentMalert("Please Select First Keyer/Primary Keyer All Fields");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            penaltyErrorUpload.projectvendordouble != "Please Select Project Vendor" &&
            (penaltyErrorUpload.processdouble == "Please Select Process" || penaltyErrorUpload.loginiddouble == "Please Select Login ID" || penaltyErrorUpload.errorvaluedouble === "" || penaltyErrorUpload.correctvaluedouble === "" || penaltyErrorUpload.reasondouble === "")
        ) {
            setPopupContentMalert("Please Select Double Keyer/Secondary Keyer All Fields");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (penaltyErrorUpload.projectvendorthird != "Please Select Project Vendor" && (penaltyErrorUpload.processthird == "Please Select Process" || penaltyErrorUpload.loginidthird == "Please Select Login ID" || penaltyErrorUpload.errorvaluethird === "" || penaltyErrorUpload.correctvaluethird === "" || penaltyErrorUpload.reasonthird === "")) {
            setPopupContentMalert("Please Select Reconcile Keyer/DKR Keyer/QC Keyer All Fields");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequestErrorLoad();
        }
    };

    // approve

    const sendEditRequestApprove = async () => {
        let projectsid = viewsingleData._id;
        setPageName(!pageName);
        try {
            if (viewsingleData.mode == "Bulkupload") {
                let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    clienterror: penaltyErrorUpload.clienterror,
                    status: "Valid",
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                let final = viewall.map((item) => {
                    if (viewsingleData._id == item._id) {
                        return {
                            ...item,
                            projectvendor: String(viewsingleData.projectvendor),
                            process: String(viewsingleData.process),
                            loginid: String(viewsingleData.loginid),
                            // date: String(editsingleData.date),
                            date: moment(viewsingleData.date).format("DD/MM/YYYY"),
                            mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
                            errorfilename: String(viewsingleData.errorfilename),
                            documentnumber: String(viewsingleData.documentnumber),
                            documenttype: String(viewsingleData.documenttype),
                            fieldname: String(viewsingleData.fieldname),
                            line: String(viewsingleData.line),
                            errorvalue: String(viewsingleData.errorvalue),
                            correctvalue: String(viewsingleData.correctvalue),
                            link: String(viewsingleData.link),
                            doclink: String(viewsingleData.doclink),
                        };
                    }

                    return item;
                });
                setItemsNearTat(final);

                // await fetchPenaltyErrorUpload();
                // await fetchBulkErrorPointsData();

                await TableFilter();
                setPopupContent("Approve Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseModEditError();
                handleCloseview();
            } else {
                let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    clienterror: penaltyErrorUpload.clienterror,
                    status: "Valid",
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                let final = viewall.map((item) => {
                    if (viewsingleData._id == item._id) {
                        return {
                            ...item,
                            projectvendor: String(viewsingleData.projectvendor),
                            process: String(viewsingleData.process),
                            loginid: String(viewsingleData.loginid),
                            // date: String(editsingleData.date),
                            date: moment(viewsingleData.date).format("DD/MM/YYYY"),
                            mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
                            errorfilename: String(viewsingleData.errorfilename),
                            documentnumber: String(viewsingleData.documentnumber),
                            documenttype: String(viewsingleData.documenttype),
                            fieldname: String(viewsingleData.fieldname),
                            line: String(viewsingleData.line),
                            errorvalue: String(viewsingleData.errorvalue),
                            correctvalue: String(viewsingleData.correctvalue),
                            link: String(viewsingleData.link),
                            doclink: String(viewsingleData.doclink),
                        };
                    }

                    return item;
                });
                setItemsNearTat(final);
                await TableFilter();
                // await fetchPenaltyErrorUpload();
                setPopupContent("Approve Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseModEditError();
                handleCloseview();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmitApprove = async (e) => {
        e.preventDefault();

        if (penaltyErrorUpload.clienterror == "") {
            setPopupContentMalert("Please Enter Client Error Remark");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequestApprove();
        }
    };

    //reject

    const sendEditRequestReject = async () => {
        let projectsid = viewsingleData._id;
        setPageName(!pageName);
        try {
            if (viewsingleData.mode == "Bulkupload") {
                const mode = viewsingleData.mode; // Get the current mode
                const rejectreason = penaltyErrorUpload.rejectreason;

                // Fetch or track the reject count for this mode
                // const existingRejectCount = viewsingleData.rejectarray?.filter(
                //     (item) => item.mode === mode
                // ).length || 0;

                const existingRejectCount = viewsingleData.rejectarray?.length || 0;
                console.log(existingRejectCount, "existingRejectCount");
                // Validate reject count
                if (existingRejectCount >= 4) {
                    setPopupContentMalert(`Reject for should not exceed 4 times`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                    return; // Stop execution
                }

                let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    // rejectreason: penaltyErrorUpload.rejectreason,
                    // rejectarray: [
                    //     {

                    //         rejectreason: penaltyErrorUpload.rejectreason
                    //     }
                    // ],
                    rejectarray: [...(viewsingleData.rejectarray || []), { mode, rejectreason }],

                    status: "",
                    validatestatus: false,
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                let res_meet = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_INVALID_REJECTED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: viewsingleData.projectvendor,
                    process: viewsingleData.process,
                    loginid: viewsingleData.loginid,
                    date: viewsingleData.date,
                });

                let final = viewall.map((item) => {
                    if (viewsingleData._id == item._id) {
                        return {
                            ...item,
                            projectvendor: String(viewsingleData.projectvendor),
                            process: String(viewsingleData.process),
                            loginid: String(viewsingleData.loginid),
                            // date: String(editsingleData.date),
                            date: moment(viewsingleData.date).format("DD/MM/YYYY"),
                            mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
                            errorfilename: String(viewsingleData.errorfilename),
                            documentnumber: String(viewsingleData.documentnumber),
                            documenttype: String(viewsingleData.documenttype),
                            fieldname: String(viewsingleData.fieldname),
                            line: String(viewsingleData.line),
                            errorvalue: String(viewsingleData.errorvalue),
                            correctvalue: String(viewsingleData.correctvalue),
                            link: String(viewsingleData.link),
                            doclink: String(viewsingleData.doclink),
                        };
                    }

                    return item;
                });
                setItemsNearTat(final);
                await TableFilter();

                // await fetchPenaltyErrorUpload();
                // await fetchBulkErrorPointsData();

                setPopupContent("Reject Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseModEditError();
                handleCloseview();
            } else {
                const mode = viewsingleData.mode; // Get the current mode
                const rejectreason = penaltyErrorUpload.rejectreason;

                // Fetch or track the reject count for this mode
                // const existingRejectCount = viewsingleData.rejectarray?.filter(
                //     (item) => item.mode === mode
                // ).length || 0;
                const existingRejectCount = viewsingleData.rejectarray?.length || 0;
                console.log(existingRejectCount, "errorupload");
                // Validate reject count
                if (existingRejectCount >= 4) {
                    setPopupContentMalert(`Reject for should not exceed 4 times`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                    return; // Stop execution
                }

                let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    // rejectreason: penaltyErrorUpload.rejectreason,
                    rejectarray: [...(viewsingleData.rejectarray || []), { mode, rejectreason }],
                    status: "",
                    validatestatus: false,
                    updatedby: [
                        {
                            ...updateby,
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

                // let res1 = await axios.post(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${projectsid}`, {
                //     headers: {
                //         Authorization: `Bearer ${auth.APIToken}`,

                //     },
                //     isedited: "",
                //     iseditedtotal: "",
                //     manualerror: "",
                //     updatedby: [

                //         {
                //             ...updateby,
                //             name: String(isUserRoleAccess.companyname),
                //             date: String(new Date()),
                //         },
                //     ],
                // });

                let res_meet = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_INVALID_REJECTED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    projectvendor: viewsingleData.projectvendor,
                    process: viewsingleData.process,
                    loginid: viewsingleData.loginid,
                    date: viewsingleData.date,
                });

                let final = viewall.map((item) => {
                    if (viewsingleData._id == item._id) {
                        return {
                            ...item,
                            projectvendor: String(viewsingleData.projectvendor),
                            process: String(viewsingleData.process),
                            loginid: String(viewsingleData.loginid),
                            // date: String(editsingleData.date),
                            date: moment(viewsingleData.date).format("DD/MM/YYYY"),
                            mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
                            errorfilename: String(viewsingleData.errorfilename),
                            documentnumber: String(viewsingleData.documentnumber),
                            documenttype: String(viewsingleData.documenttype),
                            fieldname: String(viewsingleData.fieldname),
                            line: String(viewsingleData.line),
                            errorvalue: String(viewsingleData.errorvalue),
                            correctvalue: String(viewsingleData.correctvalue),
                            link: String(viewsingleData.link),
                            doclink: String(viewsingleData.doclink),
                        };
                    }

                    return item;
                });
                setItemsNearTat(final);
                await TableFilter();
                // await fetchPenaltyErrorUpload();
                setPopupContent("Reject Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseModEditError();
                handleCloseview();
            }
        } catch (err) {
            console.log(err, "err");
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmitReject = async (e) => {
        e.preventDefault();

        if (penaltyErrorUpload.rejectreason == "") {
            setPopupContentMalert("Please Enter Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        // else if (penaltyErrorUpload.rejectreason.length > 4) {
        //     setPopupContentMalert("Reject Should Be 4 Times Only ");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // }
        else {
            sendEditRequestReject();
        }
    };

    const getviewCodeall = async (ids) => {
        try {
            let finalsdata = ids?.map((item, index) => {
                return {
                    ...item,
                    serialNumber: index + 1,

                    errorseverity: item.errorseverity == undefined || item.errorseverity == "undefined" || item.errorseverity == "" ? "" : item.errorseverity,
                    date: moment(item.date).format("DD/MM/YYYY"),
                    mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
                };
            });

            setViewall(finalsdata);
            setColumnVisibilityNeartat(initialColumnVisibilityNeartat);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [selectedRowsNear, setSelectedRowsNear] = useState([]);
    const [itemsneartat, setItemsNearTat] = useState([]);

    const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] = useState(false);
    const [anchorElNeartat, setAnchorElNeartat] = useState(null);
    const handleOpenManageColumnsNeartat = (event) => {
        setAnchorElNeartat(event.currentTarget);
        setManageColumnsOpenNeartat(true);
    };
    const handleCloseManageColumnsNeartat = () => {
        setManageColumnsOpenNeartat(false);
        setSearchQueryManageNeartat("");
    };

    const openneartat = Boolean(anchorElNeartat);
    const idneartat = openneartat ? "simple-popover" : undefined;

    const initialColumnVisibilityNeartat = {
        serialNumber: true,
        checkbox: true,
        companyname: true,
        branchname: true,
        unitname: true,
        projectvendor: true,
        process: true,
        loginid: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        status: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        mode: true,
        link: true,
        level: true,
        errorseverity: true,
        errortype: true,
        explanation: true,
        reason: true,
        actions: true,
        actions1: true,
    };

    const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(initialColumnVisibilityNeartat);

    const [selectedMode, setSelectedMode] = useState("Today");

    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" },
    ];

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [fromdate, setFromdate] = useState(today);
    const [todate, setTodate] = useState(today);

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

    const exportColumnNames = ["Employee Name", "Branch", "Unit", "Project Vendor", "Process", "Login ID", "Date", "Error File Name", "Document Number", "Document type", "Field Name", "Line", "Error Value", "Correct value", "Link", "Doc Link", "Mode", "Status", "Level"];
    const exportRowValues = ["companyname", "branchname", "unitname", "projectvendor", "process", "loginid", "date", "errorfilename", "documentnumber", "documenttype", "fieldname", "line", "errorvalue", "correctvalue", "link", "doclink", "mode", "status", "level"];

    const exportColumnNamesNear = ["Employee Name", "Branch", "Unit", "Project Vendor", "Process", "Login ID", "Date", "Error File Name", "Document Number", "Document type", "Field Name", "Line", "Error Value", "Correct value", "Link", "Error Severity", "Error Type", "Explanation", "Reason", "Doc Link", "Mode", "Status", "Level"];
    const exportRowValuesNear = ["companyname", "branchname", "unitname", "projectvendor", "process", "loginid", "date", "errorfilename", "documentnumber", "documenttype", "fieldname", "line", "errorvalue", "correctvalue", "link", "errorseverity", "errortype", "explanation", "reason", "doclink", "mode", "status", "level"];

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage
                .toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Invalid Error Entry.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const [updatedIdsDisabled, setUpdatedIdsDisabled] = useState([]);
    const [updatedIdsDisabledReject, setUpdatedIdsDisabledReject] = useState([]);

    //get current month
    let month = new Date().getMonth() + 1;

    const { auth } = useContext(AuthContext);

    const [selectedVendor, setSelectedVendor] = useState([]);

    //get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthname = monthstring[new Date().getMonth()];

    const [isMonthyear, setIsMonthYear] = useState({
        ismonth: month,
        isyear: currentYear,
        isuser: "",
    });
    const [isuser, setisuser] = useState([]);
    const [isAttandance, setIsAttandance] = useState(false);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    let listpageaccessby = listPageAccessMode?.find((data) => data.modulename === "Quality" && data.submodulename === "Penalty" && data.mainpagename === "Penalty Setup" && data.subpagename === "Penalty Calculation" && data.subsubpagename === "Error Upload Confirm")?.listpageaccessmode || "Overall";

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    //get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    // Get the total number of days in the month
    const daysInMonth = getDaysInMonth(isMonthyear.isyear, isMonthyear.ismonth);

    // Create an array of days from 1 to the total number of days in the month
    const daysArray = Array.from(new Array(daysInMonth), (val, index) => index + 1);

    const modeDropDowns = [
        { label: "My Hierarchy List", value: "myhierarchy" },
        { label: "All Hierarchy List", value: "allhierarchy" },
        { label: "My + All Hierarchy List", value: "myallhierarchy" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];
    const [modeselection, setModeSelection] = useState({
        label: "My Hierarchy List",
        value: "myhierarchy",
    });
    const [sectorSelection, setSectorSelection] = useState({
        label: "Primary",
        value: "Primary",
    });

    const handleClear = (e) => {
        e.preventDefault();
        setProducionIndividual({
            vendor: "Choose Vendor",
        });

        var today1 = new Date();
        var dd1 = String(today1.getDate()).padStart(2, "0");
        var mm1 = String(today1.getMonth() + 1).padStart(2, "0"); // January is 0!
        var yyyy1 = today1.getFullYear();
        today1 = yyyy1 + "-" + mm1 + "-" + dd1;
        setFromdate(today1);
        setTodate(today1);
        setSelectedMode("Today");

        setSectorSelection({ label: "Primary", value: "Primary" });
        setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
        setisuser([]);
        setSelectedVendor([]);
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();
    };

    // Excel
    const fileName = "Invalid Error Entry ";

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Invalid Error Entry ",
        pageStyle: "print",
    });

    //print...
    const componentRefNear = useRef();
    const handleprintNear = useReactToPrint({
        content: () => componentRefNear.current,
        documentTitle: "Invalid Error Entry",
        pageStyle: "print",
    });

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        companyname: true,
        branchname: true,
        unitname: true,
        projectvendor: true,
        process: true,
        loginid: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        status: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        mode: true,
        link: true,
        level: true,
        actions: true,
        actions1: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => {
            return {
                ...item,
                serialNumber: index + 1,

                date: moment(item.date).format("DD/MM/YYYY"),
                mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload",
            };
        });
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(isuser);
    }, [isuser]);

    const addSerialNumberNearTat = (datas) => {
        const itemsWithSerialNumber = datas;
        // ?.map((item, index) => {

        //     return {
        //         ...item,
        //         serialNumber: index + 1,

        //         date: moment(item.date).format("DD/MM/YYYY"),
        //         mode: item.mode == "Bulkupload" ? "Bulkupload" : "Errorupload"
        //     }
        // });
        setItemsNearTat(datas);
    };

    useEffect(() => {
        addSerialNumberNearTat(viewall);
    }, [viewall]);

    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        // setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        // setSelectAllChecked(false);
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
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

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const searchOverNearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
        return searchOverNearTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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

    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },

        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 250,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
            pinned: "left",
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
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 250,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 220,
            hide: !columnVisibility.loginid,
            headerClassName: "bold-header",
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
                        sx={userStyle.buttonedit}
                        onClick={() => {
                            getviewCodeall(params.data.ids);
                        }}
                    >
                        <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                    </Button>
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            companyname: item.companyname,
            branchname: item.branchname,
            unitname: item.unitname,
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
            correctvalue: item.correctvalue,
            link: item.link,
            doclink: item.doclink,
            mode: item.mode,
            status: item.status,
            level: item.level,
            invalidcheck: item.invalidcheck,
            movedstatus: item.movedstatus,
        };
    });

    const columnDataTableNeartat = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
            // pinned: 'left',
        },
        {
            field: "branchname",
            headerName: "Branch",
            flex: 0,
            width: 130,
            hide: !columnVisibility.branchname,
            headerClassName: "bold-header",
            // pinned: 'left',
        },
        {
            field: "unitname",
            headerName: "Unit",
            flex: 0,
            width: 130,
            hide: !columnVisibility.unitname,
            headerClassName: "bold-header",
            // pinned: 'left',
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 180,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
            // pinned: 'left',
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
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 180,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 180,
            hide: !columnVisibility.loginid,
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
                    <a target="_blank" href={params.data.link}>
                        {params.data.errorfilename}
                    </a>
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
                    <a target="_blank" href={params.data.doclink}>
                        {params.data.documentnumber}
                    </a>
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
                    <a target="_blank" href={params.data.link}>
                        {params.data.link}
                    </a>
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
                    <a target="_blank" href={params.data.doclink}>
                        {params.data.doclink}
                    </a>
                </Grid>
            ),
        },
        {
            field: "errorseverity",
            headerName: "Error Severity",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.errorseverity,
            headerClassName: "bold-header",
        },

        {
            field: "errortype",
            headerName: "Error Type",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.errortype,
            headerClassName: "bold-header",
        },
        {
            field: "explanation",
            headerName: "Explanation",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.explanation,
            headerClassName: "bold-header",
        },
        {
            field: "reason",
            headerName: "Reason",
            flex: 0,
            width: 150,
            hide: !columnVisibilityNeartat.reason,
            headerClassName: "bold-header",
        },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 150,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
        },
        {
            field: "level",
            headerName: "Level",
            flex: 0,
            width: 150,
            hide: !columnVisibility.level,
            headerClassName: "bold-header",
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
                        color="primary"
                        size="small"
                        onClick={() => {
                            getCodeView(params.data.id, params.data.mode);
                        }}
                    >
                        Action
                    </Button>
                    &ensp;
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ backgroundColor: "#d32f2f", color: "white" }}
                        onClick={() => {
                            getCode(params.data.id, params.data.mode);
                        }}
                    >
                        Edit
                    </Button>
                </Grid>
            ),
        },
    ];

    const rowDataTableNearTat = filteredDataNearTatPrimary?.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            companyname: item.companyname,
            branchname: item.branchname,
            unitname: item.unitname,
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
            correctvalue: item.correctvalue,
            link: item.link,
            doclink: item.doclink,
            mode: item.mode,
            status: item.status,
            level: item.level,
            invalidcheck: item.invalidcheck,
            errorseverity: item.errorseverity,
            errortype: item.errortype,
            explanation: item.explanation,
            reason: item.reason,
        };
    });

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

    // Function to filter columns based on search query
    const filteredColumnsNeartat = columnDataTableNeartat.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase()));

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentNeartat = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNeartat}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageNeartat} onChange={(e) => setSearchQueryManageNeartat(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsNeartat.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityNeartat[column.field]} onChange={() => toggleColumnVisibilityNeartat(column.field)} />}
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityNeartat(initialColumnVisibilityNeartat)}>
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
                                columnDataTableNeartat.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityNeartat(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const TableFilter = async () => {
        setIsAttandance(true);
        try {
            let res_employee = await axios.post(SERVICE.INVALID_ERROR_ENTRY_HIERARCHY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess.companyname,
                pagename: "menuerrorinvalidapproval",
                listpageaccessmode: listpageaccessby,
                fromdate: fromdate,
                todate: todate,
            });
            // if (
            //     res_employee?.data?.resultAccessFilter?.length < 1 && ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)) {
            //     alert("Some employees have not been given access to this page.")
            // }
            let finalData = res_employee?.data?.resultAccessFilter;

            console.log(finalData, "finalData");
            const groupedData = finalData.reduce((acc, curr) => {
                let date = curr.mode == "Bulkupload" ? curr.dateformatted : curr.date;

                const key = `${curr.projectvendor}-${curr.process}-${curr.loginid}-${date}`;

                acc[key] = acc[key] || { ...curr, date: date, ids: [] };

                acc[key].ids.push({
                    _id: curr._id,
                    serialNumber: curr.serialNumber,
                    companyname: curr.companyname,
                    branchname: curr.branchname,
                    unitname: curr.unitname,
                    projectvendor: curr.projectvendor,
                    process: curr.process,
                    loginid: curr.loginid,
                    date: date,
                    errorfilename: curr.errorfilename,
                    documentnumber: curr.documentnumber,
                    documenttype: curr.documenttype,
                    fieldname: curr.fieldname,
                    line: curr.line,
                    errorvalue: curr.errorvalue,
                    correctvalue: curr.correctvalue,
                    link: curr.link,
                    doclink: curr.doclink,
                    mode: curr.mode,
                    status: curr.status,
                    level: curr.level,
                    invalidcheck: curr.invalidcheck,
                    errorseverity: curr.errorseverity,
                    errortype: curr.errortype,
                    explanation: curr.explanation,
                    reason: curr.reason,
                    movedstatus: curr.movedstatus,
                });

                return acc;
            }, {});

            console.log(groupedData, "groupedData");
            let mergedDataval = Object.values(groupedData);
            setisuser(mergedDataval);
            setColumnVisibility(initialColumnVisibility);
            // setDateCount(result);
            setIsAttandance(false);
        } catch (err) {
            console.log(err, "error");
            setIsAttandance(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const HandleTablesubmit = (e) => {
        // setIsLoader(false)
        e.preventDefault();
        if (modeselection.value === "Please Select Mode") {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (sectorSelection.value === "Please Select Sector") {
            setPopupContentMalert("Please Select Selector!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            TableFilter();
        }
    };

    const [producionIndividual, setProducionIndividual] = useState({
        vendor: "Choose Vendor",
        subcategory: "Choose Subcategory",
        category: "Choose Category",
        unitid: "",
        alllogin: "Choose AllLogin",
        loginid: "Choose Loginid",
        docnumber: "",
        doclink: "",
        flagcount: "",
        section: "",
        addedby: "",
        updatedby: "",
    });

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Error Upload Confirm"),
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

    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
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
                startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday
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
                startOfLastWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7); // Last Monday
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

    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ""; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };

    const [isFilterOpennear, setIsFilterOpennear] = useState(false);
    const [isPdfFilterOpennear, setIsPdfFilterOpennear] = useState(false);

    // page refersh reload
    const handleCloseFilterModnear = () => {
        setIsFilterOpennear(false);
    };

    const handleClosePdfFilterModnear = () => {
        setIsPdfFilterOpennear(false);
    };

    return (
        <Box>
            {/* <Headtitle title={"Error Upload Confirm"} /> */}
            {/* ****** Header Content ****** */}
            <PageHeading title="Invalid Error Entry" modulename="Quality" submodulename="Penalty" mainpagename="Process Penalty" subpagename="Invalid Error Entry" subsubpagename="Error Upload Confirm" />
            <Box>
                <Box sx={{ ...userStyle.dialogbox }}>
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
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
                                        // Reset the date fields to empty strings
                                        let fromdate = "";
                                        let todate = "";

                                        // If a valid option is selected, get the date range
                                        if (selectedOption.value) {
                                            const dateRange = getDateRange(selectedOption.value);
                                            fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                            todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                        }

                                        setFromdate(formatDateForInput(new Date(fromdate.split("-").reverse().join("-"))));
                                        setTodate(formatDateForInput(new Date(todate.split("-").reverse().join("-"))));

                                        setSelectedMode(selectedOption.value); // Update the mode
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>From Date</Typography>
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
                        <Grid item md={4} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>To Date</Typography>
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
                        {listpageaccessby === "Reporting to Based" ? (
                            <Grid item lg={3} md={3} xs={12} sm={6}>
                                <TextField readOnly size="small" value={listpageaccessby} />
                            </Grid>
                        ) : (
                            <>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Selects
                                        options={modeDropDowns}
                                        styles={colourStyles}
                                        value={{
                                            label: modeselection.label,
                                            value: modeselection.value,
                                        }}
                                        onChange={(e) => {
                                            setModeSelection(e);
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Selects
                                        options={sectorDropDowns}
                                        styles={colourStyles}
                                        value={{
                                            label: sectorSelection.label,
                                            value: sectorSelection.value,
                                        }}
                                        onChange={(e) => {
                                            setSectorSelection(e);
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item lg={1} md={2} sm={2} xs={12} marginTop={-2.5}>
                            <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={(e) => HandleTablesubmit(e)}>
                                    Filter
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item lg={1} md={2} sm={2} xs={12} marginTop={-2.5}>
                            <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                                <Button sx={buttonStyles.btncancel} onClick={(e) => handleClear(e)}>
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <br />

                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Invalid Error Entry List</Typography>
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
                                        <MenuItem value={isuser?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelerrorinvalidapproval") && (
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
                                    {isUserRoleCompare?.includes("csverrorinvalidapproval") && (
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
                                    {isUserRoleCompare?.includes("printerrorinvalidapproval") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdferrorinvalidapproval") && (
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
                                    {isUserRoleCompare?.includes("imageerrorinvalidapproval") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                                    <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={isuser} setSearchedString={setSearchedString} searchQuery={searchQuery} setSearchQuery={setSearchQuery} paginated={false} totalDatas={isuser} />
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
                        <br />
                        {isAttandance ? (
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
                                    setColumnVisibility={setColumnVisibility}
                                    isHandleChange={isHandleChange}
                                    items={items}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    itemsList={isuser}
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
                    </>
                </Box>

                <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg" sx={{ marginTop: "95px" }}>
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Invalid Error Entry List</Typography>
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
                                            onChange={handlePageSizeChangeNearTatPrimary}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={isuser?.length}>All</MenuItem>
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
                                        {isUserRoleCompare?.includes("excelerrorinvalidapproval") && (
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
                                        {isUserRoleCompare?.includes("csverrorinvalidapproval") && (
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
                                        {isUserRoleCompare?.includes("printerrorinvalidapproval") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdferrorinvalidapproval") && (
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
                                        {isUserRoleCompare?.includes("imageerrorinvalidapproval") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                                        <AggregatedSearchBar columnDataTable={columnDataTableNeartat} setItems={setItemsNearTat} addSerialNumber={addSerialNumberNearTat} setPage={setPageNearTatPrimary} maindatas={viewall} setSearchedString={setSearchedString} searchQuery={searchQueryNearTatPrimary} setSearchQuery={setSearchQueryNearTatPrimary} />
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsNeartat}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNeartat}>
                                Manage Columns
                            </Button>
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
                            <br />
                            {isAttandance ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <AggridTable
                                        rowDataTable={rowDataTableNearTat}
                                        columnDataTable={columnDataTableNeartat}
                                        columnVisibility={columnVisibilityNeartat}
                                        page={pageNearTatPrimary}
                                        setPage={setPageNearTatPrimary}
                                        pageSize={pageSizeNearTatPrimary}
                                        totalPages={totalPages}
                                        setColumnVisibility={setColumnVisibilityNeartat}
                                        isHandleChange={isHandleChange}
                                        items={itemsneartat}
                                        selectedRows={selectedRowsNear}
                                        setSelectedRows={setSelectedRowsNear}
                                        gridRefTable={gridRefTableNear}
                                        paginated={false}
                                        // pagenamecheck={"Invaild Error Entry"}
                                        filteredDatas={filteredDatasNearTatPrimary}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumnsNeartat}
                                        setFilteredRowData={setFilteredRowDataNear}
                                        filteredRowData={filteredRowDataNear}
                                        setFilteredChanges={setFilteredChangesNear}
                                        filteredChanges={filteredChangesNear}
                                        gridRefTableImg={gridRefTableImgNear}
                                    />
                                </>
                            )}
                        </>
                        <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Box>
                    </Box>
                </Dialog>

                <Popover
                    id={idneartat}
                    open={isManageColumnsOpenNeartat}
                    anchorEl={anchorElNeartat}
                    onClose={handleCloseManageColumnsNeartat}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    {manageColumnsContentNeartat}
                </Popover>
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
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: "50px" }}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={userStyle.HeaderText}>Edit Invalid Error Entry</Typography>
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
                                        maxMenuHeight={300}
                                        options={projOpt}
                                        value={{ label: editsingleData.projectvendor, value: editsingleData.projectvendor }}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                projectvendor: e.value,
                                                process: "Please Select Process",
                                                loginid: "Please Select Login ID",
                                            });
                                            fetchClientUserIDEdit(e.value);
                                            fetchProcessQueueEdit(e.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Process<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={processOptEdit}
                                        value={{ label: editsingleData.process, value: editsingleData.process }}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                process: e.value,
                                                loginid: "Please Select Login ID",
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Login ID<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={loginIdOptEdit}
                                        value={{ label: editsingleData.loginid, value: editsingleData.loginid }}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                loginid: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={editsingleData.date}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                date: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Error Filename<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Error Filename"
                                        value={editsingleData.errorfilename}
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                errorfilename: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Document Number<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Document Number"
                                        value={editsingleData.documentnumber}
                                        onChange={(e) => {
                                            // const enteredValue = e.target.value
                                            //     .replace(/\D/g, "")
                                            // if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                            setEditsingleData({
                                                ...editsingleData,
                                                documentnumber: e.target.value,
                                            });
                                            // }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Document Type<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.documenttype}
                                        placeholder="Please Enter Document Type"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                documenttype: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Field Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.fieldname}
                                        placeholder="Please Enter Field Name"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                fieldname: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Line<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.line}
                                        placeholder="Please Enter Line"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                line: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Error Value<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.errorvalue}
                                        placeholder="Please Enter Error Value"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                errorvalue: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Correct Value<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.correctvalue}
                                        placeholder="Please Enter Correct Value"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                correctvalue: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Link<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.link}
                                        placeholder="Please Enter Link"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                link: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Doc Link<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={editsingleData.doclink}
                                        placeholder="Please Enter Doc Link"
                                        onChange={(e) => {
                                            setEditsingleData({
                                                ...editsingleData,
                                                doclink: e.target.value,
                                            });
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
            <Dialog open={isEditOpenError} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: "95px" }}>
                <DialogContent sx={{ height: "600px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Process</Typography>
                                <Typography
                                    sx={{
                                        color: "cornflowerblue",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: "normal",
                                    }}
                                >
                                    {viewsingleData.process}
                                </Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Field</Typography>
                                <Typography
                                    sx={{
                                        color: "cornflowerblue",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: "normal",
                                    }}
                                >
                                    {viewsingleData.fieldname}
                                </Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error</Typography>
                                <Typography
                                    sx={{
                                        color: "red",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: "normal",
                                    }}
                                >
                                    {viewsingleData.errorvalue}
                                </Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value</Typography>
                                <Typography
                                    sx={{
                                        color: "green",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: "normal",
                                    }}
                                >
                                    {viewsingleData.correctvalue}
                                </Typography>
                            </FormControl>
                        </Grid>

                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ color: "violet" }}>Approve</Typography>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Typography sx={userStyle.HeaderText}>
                                Client Error Remark<b style={{ color: "red" }}>*</b>
                            </Typography>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.projectvendorfirst != "Please Select Project Vendor" || penaltyErrorUpload.projectvendordouble != "Please Select Project Vendor" || penaltyErrorUpload.projectvendordouble != "Please Select Project Vendor"}
                                    value={penaltyErrorUpload.clienterror}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            clienterror: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Button onClick={editSubmitApprove} variant="contained" color="success">
                                Approved
                            </Button>
                        </Grid>

                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ color: "violet" }}>Reject</Typography>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Typography sx={userStyle.HeaderText}>
                                Reason<b style={{ color: "red" }}>*</b>
                            </Typography>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12}>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={penaltyErrorUpload.rejectreason}
                                    disabled={penaltyErrorUpload.clienterror || penaltyErrorUpload.projectvendorfirst != "Please Select Project Vendor" || penaltyErrorUpload.projectvendordouble != "Please Select Project Vendor" || penaltyErrorUpload.projectvendordouble != "Please Select Project Vendor"}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            rejectreason: e.target.value,
                                        });
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        setPopupContentMalert("Pasting is not allowed in this field!");
                                        setPopupSeverityMalert("info");
                                        handleClickOpenPopupMalert();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Button onClick={editSubmitReject} variant="contained" color="error">
                                Reject
                            </Button>
                        </Grid>
                        <br />
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ color: "violet" }}>Move</Typography>
                        </Grid>
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ color: "red" }}>First Keyer/Primary Keyer</Typography>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={projOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.projectvendorfirst, value: penaltyErrorUpload.projectvendorfirst }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            projectvendorfirst: e.value,
                                            processfirst: "Please Select Process",
                                            loginidfirst: "Please Select Login ID",
                                        });
                                        fetchClientUserID(e.value);
                                        fetchProcessQueue(e.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.processfirst, value: penaltyErrorUpload.processfirst }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            processfirst: e.value,
                                            loginidfirst: "Please Select Login ID",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={loginIdOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.loginidfirst, value: penaltyErrorUpload.loginidfirst }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            loginidfirst: e.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Value</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.errorvaluefirst}
                                    placeholder="Please Enter Error Value"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            errorvaluefirst: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.correctvaluefirst}
                                    placeholder="Please Enter Correct Value"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            correctvaluefirst: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Reason</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.reasonfirst}
                                    placeholder="Please Enter Reason"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            reasonfirst: e.target.value,
                                        });
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        setPopupContentMalert("Pasting is not allowed in this field!");
                                        setPopupSeverityMalert("info");
                                        handleClickOpenPopupMalert();
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {/* second  */}
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ color: "red" }}>Double Keyer/Secondary Keyer</Typography>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={projOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.projectvendordouble, value: penaltyErrorUpload.projectvendordouble }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            projectvendordouble: e.value,
                                            processdouble: "Please Select Process",
                                            loginiddouble: "Please Select Login ID",
                                        });
                                        fetchClientUserID(e.value);
                                        fetchProcessQueue(e.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.processdouble, value: penaltyErrorUpload.processdouble }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            processdouble: e.value,
                                            loginiddouble: "Please Select Login ID",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={loginIdOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.loginiddouble, value: penaltyErrorUpload.loginiddouble }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            loginiddouble: e.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Value</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.errorvaluedouble}
                                    placeholder="Please Enter Error Value"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            errorvaluedouble: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.correctvaluedouble}
                                    placeholder="Please Enter Correct Value"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            correctvaluedouble: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Reason</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    type="text"
                                    value={penaltyErrorUpload.reasondouble}
                                    placeholder="Please Enter Reason"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            reasondouble: e.target.value,
                                        });
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        setPopupContentMalert("Pasting is not allowed in this field!");
                                        setPopupSeverityMalert("info");
                                        handleClickOpenPopupMalert();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {/* third */}
                        <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ color: "red" }}>Reconcile Keyer/DKR Keyer/QC Keyer</Typography>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    options={projOpt}
                                    value={{ label: penaltyErrorUpload.projectvendorthird, value: penaltyErrorUpload.projectvendorthird }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            projectvendorthird: e.value,
                                            processthird: "Please Select Process",
                                            loginidthird: "Please Select Login ID",
                                        });
                                        fetchClientUserID(e.value);
                                        fetchProcessQueue(e.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.processthird, value: penaltyErrorUpload.processthird }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            processthird: e.value,
                                            loginidthird: "Please Select Login ID",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Selects
                                    maxMenuHeight={300}
                                    options={loginIdOpt}
                                    isDisabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={{ label: penaltyErrorUpload.loginidthird, value: penaltyErrorUpload.loginidthird }}
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            loginidthird: e.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Value</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.errorvaluethird}
                                    placeholder="Please Enter Error Value"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            errorvaluethird: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.correctvaluethird}
                                    placeholder="Please Enter Correct Value"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            correctvaluethird: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Reason</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    disabled={penaltyErrorUpload.rejectreason || penaltyErrorUpload.clienterror}
                                    value={penaltyErrorUpload.reasonthird}
                                    placeholder="Please Enter Reason"
                                    onChange={(e) => {
                                        setPenaltyErrorUpload({
                                            ...penaltyErrorUpload,
                                            reasonthird: e.target.value,
                                        });
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        setPopupContentMalert("Pasting is not allowed in this field!");
                                        setPopupSeverityMalert("info");
                                        handleClickOpenPopupMalert();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" onClick={editSubmitErrorLoad} sx={buttonStyles.buttonsubmit}>
                        Move
                    </Button>
                    <Button variant="contained" onClick={handleClearMove} sx={buttonStyles.btncancel}>
                        Clear
                    </Button>
                    <Button onClick={handleCloseModEditError} sx={buttonStyles.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={items ?? []}
                filename={"Invalid Error Entry"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            <ExportData
                isFilterOpen={isFilterOpennear}
                handleCloseFilterMod={handleCloseFilterModnear}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpennear}
                isPdfFilterOpen={isPdfFilterOpennear}
                setIsPdfFilterOpen={setIsPdfFilterOpennear}
                handleClosePdfFilterMod={handleClosePdfFilterModnear}
                filteredDataTwo={(filteredChangesNear !== null ? filteredRowDataNear : rowDataTableNearTat) ?? []}
                itemsTwo={viewall ?? []}
                filename={"Invalid Error Entry"}
                exportColumnNames={exportColumnNamesNear}
                exportRowValues={exportRowValuesNear}
                componentRef={componentRefNear}
            />

            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
        </Box>
    );
}

export default InvalidErrorEntry;