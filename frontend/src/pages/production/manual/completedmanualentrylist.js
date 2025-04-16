import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TextareaAutosize, TableBody, TableRow, Chip, TableCell, Select, Paper,
    MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer,
    Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
    Radio, InputAdornment, FormControlLabel, RadioGroup, Tooltip,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import Webcamimage from "../../asset/Webcameimageasset";
import ExportData from "../../../components/ExportData";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";


const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));


function Complatedmanualentrylist() {
    const getFileIcon = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };


    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    //  const [filteredRowData, setFilteredRowData] = useState([]);
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions



    let exportColumnNames = [
        'Vendor', 'From Date',
        'Date', 'Time',
        'Category', 'SubCategory',
        'Identifier', 'Login Id',
        'Section', 'Flag Count',
        'Doc Number', 'Doc Link',
        'Start Date Mode', 'Start Date',
        'Start Time', 'Status Mode',
        'Total Pages', 'Pending Pages',
        'Start Page', 'Remarks/Notes',
        'Approval Status', 'Late Entry Status'
    ];
    let exportRowValues = [
        'vendor', 'datemode',
        'fromdate', 'time',
        'filename', 'category',
        'unitid', 'user',
        'section', 'flagcount',
        'docnumber', 'doclink',
        'startmode', 'startdate',
        'starttime', 'statusmode',
        'totalpages', 'pendingpages',
        'startpage', 'notes',
        'approvalstatus', 'lateentrystatus'
    ];




    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const classes = useStyles();
    const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [loadingPdfExport, setLoadingPdfExport] = useState(false);
    const gridRef = useRef(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [loader, setLoader] = useState(false);
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

    const [isFilter, setIsFilter] = useState([]);

    const [overallState, setOverallState] = useState({
        fromdate: "",
    });



    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState([]);
    const [projectOpt, setProjmasterOpt] = useState([]);
    const [vendorOpt, setVendormasterOpt] = useState([]);
    const [categoryOpt, setCategoryOPt] = useState([]);
    const [subcategory, setSubCategoryOpt] = useState([]);

    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
    let [valueCompanyCategory, setValueCategory] = useState([]);

    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
    let [valueSubCat, setValueSubCat] = useState([]);

    const [selectedOptionsLoginid, setSelectedOptionsLoginid] = useState([]);
    let [valueLoginCat, setValueLoginCat] = useState([]);

    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [loginAllotFilter, setLoginAllotFilter] = useState([]);
    let [valueVendor, setValueVendor] = useState([]);


    //get all project.
    const fetchProjMaster = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const projectopt = [...res_project?.data?.projmaster.map((item) => ({
                ...item,
                label: item.name,
                value: item.name

            }))]

            setProjmasterOpt(projectopt);
            let prodjectvalue = projectOpt.length > 0 ? [{
                label: String(projectOpt[0]?.name),
                value: String(projectOpt[0]?.name), name: String(projectOpt[0]?.name)
            }] : []
            setSelectedProject(prodjectvalue)

            fetchVendor(prodjectvalue)
            fetchAllCategory(prodjectvalue)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    //get all Sub vendormasters.
    const fetchVendor = async (e) => {
        const branchArr = e.map((t) => t.name)
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            const projFilt = res_vendor?.data?.vendormaster?.filter((item) => branchArr.includes(item.projectname))
            setVendormasterOpt(
                projFilt?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            );
            // let vendoryOptfirstthree = projFilt.filter((d, index) => index <= 2).map(data => data.name).map((name) => ({
            //     label: name,
            //     value: name,
            // }));


            // let prodjectvalue = vendoryOptfirstthree.length > 0 ? vendoryOptfirstthree : []

            // setSelectedVendor(prodjectvalue)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    //get all category.
    const fetchAllCategory = async (e) => {
        const branchArr = e.map((t) => t.name)
        try {
            let res_module = await axios.get(SERVICE.CATEGORYPROD_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryOpt = Array.from(new Set(
                res_module?.data?.categoryprod
                    .filter((item) => branchArr.includes(item.project))
                    .map((t) => t.name)
            )).map((name) => ({
                label: name,
                value: name,
            }));
            setCategoryOPt(categoryOpt);

            // let categoryOptfirstthree = categoryOpt.filter((d, index) => index <= 2)

            // let prodjectvalue = categoryOptfirstthree.length > 0 ? categoryOptfirstthree : [];
            // setSelectedOptionsCategory(prodjectvalue)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //get all category.
    const fetchAllSubCategory = async () => {
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIST_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projFilt = res_module?.data?.subcategoryprod


            setSubCategoryOpt(projFilt);


            // let defaultsub = Array.from(new Set(subcategory
            //     ?.filter(
            //         (comp) =>
            //             selectedOptionsCategory
            //                 .map((item) => item.value)
            //                 .includes(comp.categoryname)
            //     )
            //     ?.map((com) => com.name)
            // ))
            //     .map((name) => ({
            //         label: name,
            //         value: name,
            //     }))
            // setSelectedOptionsSubCategory(defaultsub)
            // setValueSubCat(
            //     defaultsub.map((a, index) => {
            //         return a.value;
            //     })
            // );

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }




    const fetchAllLogins = async (date, vendor) => {
        try {
            if (date !== "") {
                let res_vendor = await axios.post(SERVICE.CLIENTUSERID_LIMITED_BYCOMPNYNAME_MULTI, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    role: isUserRoleAccess.role,
                    project: vendor,
                    companyname: isUserRoleAccess.companyname,
                    date: date,
                });

                let uniques = [...new Set(res_vendor?.data?.clientuserid.map((item) => item.userid))];
                let alluseridNamesadmin = uniques.map((d) => ({
                    // ...d,
                    label: d,
                    value: d,
                }));

                setLoginAllotFilter(alluseridNamesadmin);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchProjMaster();
        // fetchAllLogins();

    }, [])



    const handleProjectChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedProject(options);
        fetchVendor(options)
        fetchAllCategory(options)

        setSelectedVendor([]);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
    };

    const handleVendorChange = (options) => {
        setValueVendor(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedVendor(options);
        let resultvendor = []
        selectedProject.map(d => d.value).forEach(proj => {

            options.map(d => d.value).forEach(vend => {

                // if (vendorOpt.some(v => v.projectname === proj && v.name === vend)) {

                resultvendor.push(`${proj}-${vend}`);
                // }
            });
        });
        let projvendor = [...new Set(resultvendor)];

        fetchAllLogins(overallState.fromdate, projvendor);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
    };

    const handleCategoryChange = (options) => {
        setValueCategory(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCategory(options);
        fetchAllSubCategory(selectedVendor, options)
        setSelectedOptionsSubCategory([]);
    };

    const handleSubCategoryChange = (options) => {
        setValueSubCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCategory(options);
    };




    //employee multiselect dropdown changes
    const handleLoginChangeFrom = (options) => {
        setSelectedOptionsLoginid(options);
    };
    const customValueRendererLoginFrom = (valueLoginCat, _employeename) => {
        return valueLoginCat.length ? valueLoginCat.map(({ label }) => label).join(", ") : "Please Select Login";
    };


    const customValueRendererProject = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project";
    };

    const customValueRendererVendor = (valueVendor, _categoryname) => {
        return valueVendor?.length ? valueVendor.map(({ label }) => label)?.join(", ") : "Please Select Vendor";
    };

    const customValueRendererCategory = (valueCompanyCategory, _categoryname) => {
        return valueCompanyCategory?.length ? valueCompanyCategory.map(({ label }) => label)?.join(", ") : "Please Select Category";
    };

    const customValueRendererSubCategory = (valueSubCat, _categoryname) => {
        return valueSubCat?.length ? valueSubCat.map(({ label }) => label)?.join(", ") : "Please Select SubCategory";
    };




    //    today date fetching
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    // today = yyyy + "-" + mm + "-" + dd;
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
        setloadingdeloverall(false);

    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [projmasterDup, setProjmasterDup] = useState([])


    // Calculate the date two months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const ddPast = String(twoMonthsAgo.getDate()).padStart(2, "0");
    const mmPast = String(twoMonthsAgo.getMonth() + 1).padStart(2, "0");
    const yyyyPast = twoMonthsAgo.getFullYear();
    const formattedTwoMonthsAgo = `${yyyyPast}-${mmPast}-${ddPast}`;

    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;


    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [ProducionIndividual, setProducionIndividual] = useState({
        vendor: "Please Select Vendor", fromdate: formattedToday, time: currtime, datemode: "Auto", datetimezone: "", category: "Please Select Subcategory",
        filename: "Please Select Category", unitid: "", alllogin: "Please Select AllLogin", user: "Please Select Loginid", mode: "", docnumber: "", doclink: "",
        statusmode: "Please Select Status", flagcount: 0, section: "1", addedby: "", updatedby: "", pendingpages: "", notes: "",
        totalpages: 0, completepages: 0, startpage: "Please Select Start Page", reason: "", startdate: formattedToday, starttime: currtime, startdatemode: "Auto",
    });


    const [ProducionIndividualChange, setProducionIndividualChange] = useState({
        vendor: "Please Select Vendor", fromdate: formattedToday, time: currtime, datemode: "Auto", datetimezone: "", category: "Please Select Subcategory",
        filename: "Please Select Category", unitid: "", alllogin: "Please Select AllLogin", user: "Please Select Loginid", mode: "", docnumber: "", doclink: "",
        statusmode: "Please Select Status", flagcount: "", section: "1", pendingpages: "",
        totalpages: "", completepages: "", startpage: "Please Select Start Page", reason: "", startdate: formattedToday, starttime: currtime, startdatemode: "Auto",
    });

    const [productionedit, setProductionEdit] = useState({
        vendor: "Please Select Vendor", fromdate: "", time: "", datemode: "", datetimezone: "", category: "Please Select Subcategory",
        filename: "Please Select Category", unitid: "", alllogin: "Please Select AllLogin", user: "Please Select Loginid", docnumber: "", doclink: "",
        flagcount: "", section: "",
    });
    const [projmaster, setProjmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [canvasState, setCanvasState] = useState(false);



    let datemodes = isUserRoleCompare.includes("lproductionindividualusers") ||
        isUserRoleAccess.role.includes("Manager")
        || isUserRoleAccess.role.includes("Director")
        || isUserRoleAccess.role.includes("Admin")
        || isUserRoleAccess.role.includes("SuperAdmin") ||
        isUserRoleAccess.role.includes("ADMIN")
        ? [{ label: "Auto", value: "Auto" }, { label: "Manual", value: "Manual" }] : [{ label: "Auto", value: "Auto" }]


    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Completed Manual Entry List.png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length == 0) {
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

    const username = isUserRoleAccess.username;
    const userData = {
        name: username,
        date: new Date(),
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        vendor: true,
        datemode: true,
        fromdate: true,
        time: true,
        filename: true,
        category: true,
        unitid: true,
        user: true,
        section: true,
        flagcount: true,
        alllogin: true,
        docnumber: true,
        doclink: true,
        approvalstatus: true,
        lateentrystatus: true,
        startmode: true,
        startdate: true,
        starttime: true,
        status: true,
        totalpages: true,
        flagcount: true,
        pendingpages: true,
        startpage: true,
        reason: true,
        statusmode: true,
        enddate: true,
        endtime: true,
        notes: true,
        actions: true,
        actionsstatus: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [overalExcel, setoveralExcel] = useState([]);

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setProductionEdit(res?.data?.sProductionIndividual);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all project.
    const fetchProductionIndividual = async () => {
        setPageName(!pageName)
        setProjectCheck(true);
        try {

            let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_COMPLETED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                companyname: isUserRoleAccess.companyname,
                username: isUserRoleAccess.username,
                access: isUserRoleAccess.role
            });

            setProjmasterDup(res_project?.data?.result);
            setProjectCheck(false);
        } catch (err) { setProjectCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchProductionIndividualExcel = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_EXCEL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    notes: (item.notes === "" || item.notes === undefined || item.notes === "undefined") ? "" : item.notes,
                    fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                    startdate: moment(item.startdate).format("DD/MM/YYYY"),
                    statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                    startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });

            setoveralExcel(itemsWithSerialNumber);

            // setoveralExcel(res_employee?.data?.result)


        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    // useEffect(() => {
    //     fetchProductionIndividualExcel();
    // }, []);


    const [loading, setLoading] = useState(false)

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [subcategoriesCount, setSubcategoriesCount] = useState(0);
    const [totalProjectsData, setTotalProjectsData] = useState([]);
    // const [totalPages, setTotalPages] = useState(0);



    const fetchEmployee = async () => {


        setLoading(true);
        try {

            let resultvendor = [];
            selectedProject.map(d => d.value).forEach(proj => {

                selectedVendor.map(d => d.value).forEach(vend => {

                    // if (vendorOpt.some(v => v.projectname === proj && v.name === vend)) {

                    resultvendor.push(`${proj}-${vend}`);
                    // }
                });
            });
            let projvendor = [...new Set(resultvendor)];


            let res_employee = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_FILTER_LIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                vendor: projvendor,
                filename: selectedOptionsCategory.map(item => item.value),
                category: selectedOptionsSubCategory.map(item => item.value),
                // user: selectedOptionsLoginid.map(item => item.value),
                user: selectedOptionsLoginid.map(item => item.value).length === 0 ? loginAllotFilter.map(d => d.value) : selectedOptionsLoginid.map(item => item.value),
                fromdate: overallState.fromdate,
                statusmode: ["", "Completed"],
            })
            const ans = res_employee?.data?.productionindividual?.length > 0 ? res_employee?.data?.productionindividual : []

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    notes: (item.notes === "" || item.notes === undefined || item.notes === "undefined") ? "" : item.notes,
                    fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                    startdate: (item.startdate === "" || item.startdate === undefined || item.startdate === "undefined") ? "" : moment(item.startdate).format("DD/MM/YYYY"),
                    statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                    startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });

            setIsFilter(itemsWithSerialNumber)
            setPage(1)
            setLoading(false);
        } catch (err) {
            setLoading(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    }



    // pdf.....
    const columns = [
        { title: "Vendor", field: "vendor" },
        { title: "From Date", field: "datemode" },
        { title: "Date", field: "fromdate" },
        { title: "Time", field: "time" },
        { title: "Category", field: "filename" },
        { title: "SubCategory", field: "category" },
        { title: "Identifier", field: "unitid" },
        { title: "Login Id", field: "user" },
        { title: "Section", field: "section" },
        { title: "Flag Count", field: "flagcount" },
        { title: "Doc Number", field: "docnumber" },
        { title: "Doc Link", field: "doclink" },
        { title: "Start Date Mode", field: "startmode" },
        { title: "Start Date", field: "startdate" },
        { title: "Start Time", field: "starttime" },
        { title: "Status Mode", field: "statusmode" },
        { title: "Total Pages", field: "totalpages" },
        { title: "Pending Pages", field: "pendingpages" },
        { title: "Start Page", field: "startpage" },
        { title: "Remarks/Notes", field: "notes" },



        { title: "Approval Status", field: "approvalstatus" },
        { title: "Late Entry Status", field: "lateentrystatus" },

    ];



    // Excel



    const downloadPdf = (isfilter) => {
        setLoadingPdfExport(true);  // Start loader
        const doc = new jsPDF();

        let serialNumberCounter = 1;
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        axios.post(SERVICE.PRODUCTION_INDIVIDUALMANUAL_EXCEL_OVERALL, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            companyname: isUserRoleAccess.companyname,
            role: isUserRoleAccess.role,
            statusmode: ["", "Completed"]
        })
            .then(response => {
                const result = response.data.result.map((t, index) => ({
                    serialNumber: index + 1,
                    vendor: t.vendor,
                    datemode: t.datemode,
                    fromdate: moment(t.fromdate).format("DD/MM/YYYY"),
                    time: t.time,
                    filename: t.filename,
                    category: t.category,
                    unitid: t.unitid,
                    user: t.user,
                    section: t.section,
                    flagcount: t.flagcount,
                    docnumber: t.docnumber,
                    doclink: t.doclink,
                    approvalstatus: t.approvalstatus,
                    lateentrystatus: t.lateentrystatus,

                    startmode: t.startmode,
                    startdate: moment(t.startdate).format("DD/MM/YYYY"),
                    starttime: t.starttime,
                    statusmode: t.statusmode === "Please Select Status" ? "" : t.statusmode,
                    totalpages: t.totalpages,
                    flagcount: t.flagcount,
                    startpage: t.startpage === "Please Select Start Page" ? "" : t.startpage,
                    pendingpages: t.pendingpages,
                    reason: t.reason,
                    notes: t.notes,
                }));

                const dataWithSerial = isfilter === "filtered"
                    ? rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ }))
                    : result;

                doc.autoTable({
                    theme: "grid",
                    styles: {
                        fontSize: 4,
                        cellWidth: "auto"
                    },
                    columns: columnsWithSerial,
                    body: dataWithSerial,
                });

                doc.save("Completed Manual Entry List.pdf");
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsFilterOpen(false);
                setLoadingPdfExport(false); // Stop loader // Stop loader
            });
    };



    const fileName = "Completed Manual Entry List";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Completed Manual Entry List",
        pageStyle: "print",
    });
    const addSerialNumber = (datas) => {

        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(isFilter);
    }, [isFilter]);


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
        // setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilterValue(event.target.value);
        setPage(1);
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

    const columnDataTable = [


        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "datemode", headerName: "Date Mode", flex: 0, width: 150, hide: !columnVisibility.datemode, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "time", headerName: "Time", flex: 0, width: 150, hide: !columnVisibility.time, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "SubCategory", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
        { field: "user", headerName: "Login Id", flex: 0, width: 150, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "section", headerName: "Section", flex: 0, width: 150, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "Flag Count", flex: 0, width: 150, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "alllogin", headerName: "All Login", flex: 0, width: 150, hide: !columnVisibility.alllogin, headerClassName: "bold-header" },
        { field: "docnumber", headerName: "Doc Number", flex: 0, width: 150, hide: !columnVisibility.docnumber, headerClassName: "bold-header" },
        { field: "doclink", headerName: "Doc Link", flex: 0, width: 150, hide: !columnVisibility.doclink, headerClassName: "bold-header" },


        { field: "startmode", headerName: "Start Mode", flex: 0, width: 150, hide: !columnVisibility.startmode, headerClassName: "bold-header" },
        { field: "startdate", headerName: "Start Date", flex: 0, width: 150, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
        { field: "starttime", headerName: "Start Time", flex: 0, width: 150, hide: !columnVisibility.starttime, headerClassName: "bold-header" },
        { field: "statusmode", headerName: "Status Mode", flex: 0, width: 150, hide: !columnVisibility.statusmode, headerClassName: "bold-header" },

        { field: "totalpages", headerName: "Total Pages", flex: 0, width: 150, hide: !columnVisibility.totalpages, headerClassName: "bold-header" },
        { field: "pendingpages", headerName: "Pending Pages", flex: 0, width: 150, hide: !columnVisibility.pendingpages, headerClassName: "bold-header" },
        { field: "startpage", headerName: "Start Page", flex: 0, width: 150, hide: !columnVisibility.startpage, headerClassName: "bold-header" },
        { field: "notes", headerName: "Remark/Notes", flex: 0, width: 150, hide: !columnVisibility.notes, headerClassName: "bold-header" },


        {
            field: "actionsstatus",
            headerName: "Status",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actionsstatus,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"warning"}
                        variant="outlined"
                        label={params.data.approvalstatus}
                    />
                    &ensp;
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"success"}
                        variant="outlined"
                        label={params.data.lateentrystatus}
                    />
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", alignItems: "baseline" }}>

                    {isUserRoleCompare?.includes("vproductionmanualentrylist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");



    const rowDataTable = filteredData.map((item, index) => {

        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            datemode: item.datemode,
            fromdate: item.fromdate,
            time: item.time,
            filename: item.filename,
            category: item.category,
            unitid: item.unitid,
            user: item.user,
            section: item.section,
            flagcount: item.flagcount,
            alllogin: item.alllogin,
            docnumber: item.docnumber,
            doclink: item.doclink,
            approvalstatus: item.approvalstatus,
            lateentrystatus: item.lateentrystatus,
            startmode: item.startmode,
            startdate: item.startdate,
            starttime: item.starttime,
            statusmode: item.statusmode,
            totalpages: item.totalpages,
            flagcount: item.flagcount,
            startpage: item.startpage,
            pendingpages: item.pendingpages,
            reason: item.reason,
            enddate: item.enddate,
            endtime: item.endtime,
            notes: item.notes,
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

    useEffect(() => {
        fetchProductionIndividual();
    }, []);

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

    const handleExportXL = async (isfilter) => {
        setloadingdeloverall(true); // Start loader here
        try {
            if (isfilter === "filtered") {
                exportToCSV(
                    rowDataTable?.map((t, index) => ({
                        Sno: index + 1,
                        "Vendor": t.vendor,
                        "Date Mode": t.datemode,
                        "Date": t.fromdate,
                        "Time": t.time,
                        "Category": t.filename,
                        "SubCategory": t.category,
                        "Identifier": t.unitid,
                        "Login Id": t.user,
                        "Section": t.section,
                        "Flag Count": t.flagcount,
                        "alllogin": t.alllogin,
                        "Doc Number": t.docnumber,
                        "Doc Link": t.doclink,
                        "Start Date Mode": t.startmode,
                        "Start Date": t.startdate,
                        "Start Time": t.starttime,
                        "Status Mode": t.statusmode,
                        "Total Pages": t.totalpages,
                        "Pending Pages": t.pendingpages,
                        "Start Page": t.startpage,
                        "Reamarks/Notes": t.notes,
                        "Approval Status": t.approvalstatus,
                        "Late Entry Status": t.lateentrystatus,
                    })),
                    fileName,
                );
                setIsFilterOpen(false);
            } else if (isfilter === "overall") {
                const response = await axios.post(SERVICE.PRODUCTION_INDIVIDUALMANUAL_EXCEL_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    companyname: isUserRoleAccess.companyname,
                    role: isUserRoleAccess.role,
                    statusmode: ["", "Completed"]
                });

                const result = response.data.result.map((t, index) => ({
                    Sno: index + 1,
                    "Vendor": t.vendor,
                    "Date Mode": t.datemode,
                    "Date": moment(t.fromdate).format("DD/MM/YYYY"),
                    "Time": t.time,
                    "Category": t.filename,
                    "SubCategory": t.category,
                    "Identifier": t.unitid,
                    "Login Id": t.user,
                    "Section": t.section,
                    "Flag Count": t.flagcount,
                    "alllogin": t.alllogin,
                    "Doc Number": t.docnumber,
                    "Doc Link": t.doclink,
                    "Start Date Mode": t.startmode,
                    "Start Date": moment(t.startdate).format("DD/MM/YYYY"),
                    "Start Time": t.starttime,
                    "Status Mode": t.statusmode === "Please Select Status" ? "" : t.statusmode,
                    "Total Pages": t.totalpages,
                    "Pending Pages": t.pendingpages,
                    "Start Page": t.startpage === "Please Select Start Page" ? "" : t.startpage,
                    "Reamarks/Notes": t.notes,
                    "Approval Status": t.approvalstatus,
                    "Late Entry Status": t.lateentrystatus
                }));

                await exportToCSV(result, fileName); // Wait for the export to complete
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setloadingdeloverall(false); // Stop loader when done or on error
            setIsFilterOpen(false);
        }
    };

    const [refImageedit, setRefImageedit] = useState([]);
    const [previewURLedit, setPreviewURLedit] = useState(null);
    const [refImageDragedit, setRefImageDragedit] = useState([]);
    const [valNumedit, setValNumedit] = useState(0);
    const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
    const [capturedImagesedit, setCapturedImagesedit] = useState([]);
    const [getImgedit, setGetImgedit] = useState(null);
    const webcamOpenedit = () => {
        setIsWebcamOpenedit(true);
    };
    const webcamCloseedit = () => {
        setIsWebcamOpenedit(false);
        setGetImgedit("");
    };
    const webcamDataStoreedit = () => {
        webcamCloseedit();
        setGetImgedit("");
    };
    const showWebcamedit = () => {
        webcamOpenedit();
    };
    const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
    const handleClickUploadPopupOpenedit = () => {
        setUploadPopupOpenedit(true);
    };
    const handleUploadPopupCloseedit = () => {
        setUploadPopupOpenedit(false);
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleInputChangeedit = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImageedit];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImageedit(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    let combinedArray = allUploadedFilesedit.concat(
        refImageedit,
        refImageDragedit,
        capturedImagesedit
    );
    let uniqueValues = {};
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });

    //first deletefile
    const handleDeleteFileedit = (index) => {
        const newSelectedFiles = [...refImageedit];
        newSelectedFiles.splice(index, 1);
        setRefImageedit(newSelectedFiles);
    };

    const renderFilePreviewedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const resetImageedit = () => {
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleDragOveredit = (event) => { };
    const handleDropedit = (event) => {
        event.preventDefault();
        previewFileedit(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDragedit];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFilesDrag.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImageDragedit(newSelectedFilesDrag);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleUploadOverAlledit = () => {
        setUploadPopupOpenedit(false);
    };
    const previewFileedit = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURLedit(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveFileedit = (index) => {
        const newSelectedFiles = [...refImageDragedit];
        newSelectedFiles.splice(index, 1);
        setRefImageDragedit(newSelectedFiles);
    };


    //submit option for saving
    const handleSubmitFilter = (e) => {
        e.preventDefault();

        if (selectedProject.length === 0) {
            setPopupContentMalert("Please Select Project!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedVendor.length === 0) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCategory.length === 0) {
            setPopupContentMalert("Please Select Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCategory.length === 0) {
            setPopupContentMalert("Please Select SubCategory!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (overallState.fromdate == "") {
            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsLoginid.length === 0) {
            setPopupContentMalert("Please Select All LoginId!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchEmployee();
        }

    };
    const handleClearFilter = async (e) => {
        e.preventDefault();
        setOverallState({
            ...overallState,
            fromdate: "",

        });
        setSelectedProject([])
        setSelectedVendor([])
        setSelectedOptionsCategory([])
        setSelectedOptionsSubCategory([])
        setSelectedOptionsLoginid([])
        setIsFilter([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }




    return (
        <Box>

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lproductionmanualentrylist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Completed Manual Entry List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Project<b style={{ color: "red" }}>*</b></Typography>

                                    <MultiSelect
                                        options={projectOpt}
                                        value={selectedProject}
                                        onChange={(e) => {
                                            handleProjectChange(e);
                                        }}
                                        valueRenderer={customValueRendererProject}
                                        labelledBy="Please Select Project"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Vendor<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={vendorOpt}
                                        value={selectedVendor}
                                        onChange={(e) => {
                                            handleVendorChange(e);

                                        }}
                                        valueRenderer={customValueRendererVendor}
                                        labelledBy="Please Select Vendor"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={categoryOpt}
                                        value={selectedOptionsCategory}
                                        onChange={(e) => {
                                            handleCategoryChange(e);
                                            setOverallState({
                                                ...overallState,
                                                raisedby: "Please Select Category",
                                            });
                                        }}
                                        valueRenderer={customValueRendererCategory}
                                        labelledBy="Please Select Category"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Sub Category<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={Array.from(new Set(subcategory?.filter((comp) => selectedOptionsCategory.map((item) => item.value).includes(comp.categoryname))?.map((com) => com.name))).map((name) => ({
                                            label: name,
                                            value: name,
                                        }))}
                                        value={selectedOptionsSubCategory}
                                        onChange={(e) => {
                                            handleSubCategoryChange(e);
                                            setOverallState({
                                                ...overallState,
                                                raisedby: "Please Select SubCategory",
                                            });
                                        }}
                                        valueRenderer={customValueRendererSubCategory}
                                        labelledBy="Please Select SubCategory"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        From Date <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={overallState.fromdate}
                                        onChange={(e) => {
                                            setOverallState({ ...overallState, fromdate: e.target.value });
                                            let resultvendor = [];
                                            selectedProject.map(d => d.value).forEach(proj => {

                                                selectedVendor.map(d => d.value).forEach(vend => {

                                                    // if (vendorOpt.some(v => v.projectname === proj && v.name === vend)) {

                                                    resultvendor.push(`${proj}-${vend}`);
                                                    // }
                                                });
                                            });


                                            let projvendor = [...new Set(resultvendor)];
                                            fetchAllLogins(e.target.value, projvendor);
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        All Login Id<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={
                                            loginAllotFilter
                                        }

                                        value={selectedOptionsLoginid}
                                        onChange={handleLoginChangeFrom}
                                        valueRenderer={customValueRendererLoginFrom}
                                        labelledBy="Please Select Login"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={1} xs={12} sm={12} marginTop={3}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                    onClick={handleSubmitFilter}
                                >
                                    Filter
                                </Button>
                            </Grid>
                            <Grid item md={0.5} xs={12} sm={12} marginTop={3}>
                                <Button
                                    onClick={handleClearFilter}
                                    sx={buttonStyles.btncancel}>
                                    Clear
                                </Button>
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
                                        <MenuItem value={isFilter.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelproductionmanualentrylist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvproductionmanualentrylist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printproductionmanualentrylist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfproductionmanualentrylist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageproductionmanualentrylist") && (
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

                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={isFilter}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={isFilter}
                                />
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
                        <br />

                        {loading ? (
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
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={isFilter}
                                />


                            </>)}
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
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Production Manual Entry</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>   Vendor</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.vendor}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            {productionedit?.creationstatus != "" || undefined ? (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>  Start Date Mode</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.startmode}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <Typography>
                                                    <b>  Start Date</b>
                                                </Typography>
                                                <Typography>
                                                    {moment(productionedit.startdate).format("DD/MM/YYYY")}

                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        <b>   Start Time</b>
                                                    </Typography>
                                                    <Typography>
                                                        {productionedit.starttime}

                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>   Date Mode</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.datemode}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <Typography>
                                                    <b>    Date</b>
                                                </Typography>
                                                <Typography>
                                                    {moment(productionedit.fromdate).format("DD/MM/YYYY")}

                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        <b>    Time</b>
                                                    </Typography>
                                                    <Typography>
                                                        {productionedit.time}

                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>   Category</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.filename}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Sub Category</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.category}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Identifier</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.unitid}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Login Id</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.user}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    All Login</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.alllogin}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Section</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.section}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            {productionedit?.creationstatus && (
                                <>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Total Pages</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.totalpages}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Completed Pages</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.flagcount}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Pending Pages</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.pendingpages}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Start Page</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.startpage}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Status</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.statusmode}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}

                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>   Doc Number</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.docnumber}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>       Doc Link</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.doclink}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            {productionedit?.statusmode === "Completed" && (
                                <>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b> End Date Mode</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.enddatemode}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <Typography>
                                                    <b>  End  Date</b>
                                                </Typography>
                                                <Typography>
                                                    {moment(productionedit.fromdate).format("DD/MM/YYYY")}

                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        <b>  End  Time</b>
                                                    </Typography>
                                                    <Typography>
                                                        {productionedit.time}

                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b> Remarks</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.remarks}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b> Notes</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.notes}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography>
                                            <b> Attachments</b>
                                        </Typography>
                                        {productionedit?.files?.map((file, index) => (
                                            <>
                                                <Grid container>
                                                    <Grid item md={2} sm={2} xs={2}>
                                                        <Box
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {file.type.includes("image/") ? (
                                                                <img
                                                                    src={file.preview}
                                                                    alt={file.name}
                                                                    height={50}
                                                                    style={{
                                                                        maxWidth: "-webkit-fill-available",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    className={classes.preview}
                                                                    src={getFileIcon(file.name)}
                                                                    height="10"
                                                                    alt="file icon"
                                                                />
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={8}
                                                        sm={8}
                                                        xs={8}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typography variant="subtitle2"> {file.name} </Typography>
                                                    </Grid>
                                                    <Grid item md={1} sm={1} xs={1}>
                                                        <Grid sx={{ display: "flex" }}>
                                                            <Button
                                                                sx={{
                                                                    padding: "14px 14px",
                                                                    minWidth: "40px !important",
                                                                    borderRadius: "50% !important",
                                                                    ":hover": {
                                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                                    },
                                                                }}
                                                                onClick={() => renderFilePreviewedit(file)}
                                                            >
                                                                <VisibilityOutlinedIcon
                                                                    style={{ fontsize: "12px", color: "#357AE8" }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                    </Grid>
                                </>
                            )

                            }

                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
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
            {/*Export XL Data  */}
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

                    <LoadingButton
                        autoFocus variant="contained"
                        onClick={(e) => {

                            handleExportXL("overall")

                        }}
                        loading={loadingdeloverall}
                        loadingPosition="end"
                    >
                        Export Over All Data
                    </LoadingButton>
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
                    <LoadingButton
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                        }}
                        loading={loadingPdfExport}
                        loadingPosition="end"
                    >
                        Export Over All Data
                    </LoadingButton>
                </DialogActions>
            </Dialog>
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
                // filteredDataTwo={filteredData ?? []}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={isFilter ?? []}
                filename={"Completed Manual Entry List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default Complatedmanualentrylist;