import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextareaAutosize, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import FormControlLabel from '@mui/material/FormControlLabel';
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { htmlToText } from "html-to-text";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { MultiSelect } from "react-multi-select-component";
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import QRCode from 'qrcode';
import LoadingButton from "@mui/lab/LoadingButton";
import { BASE_URL } from "../../../services/Authservice";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';
import CompanyDocumentPreparationPrinted from "./CompanyDocumentsPrinted";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';



const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};

function CompanyDocuments() {
    const [generateData, setGenerateData] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [personId, setPersonId] = useState('');
    const [imageUrlEdit, setImageUrlEdit] = useState('');
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");



    const handleClickOpenPopupMalert = () => {
        //   setSubmitLoader(false);
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [DataTableId, setDataTableId] = useState("")
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const [HeaderOptionsButton, setHeaderOptionsButton] = useState(false);
    // letter headd options
    const HeaderDropDowns = [{ label: "With Letter Head", value: "With Letter Head" }, { label: "Without Letter Head", value: "Without Letter Head" }];
    const WithHeaderOptions = [{ value: "With Head content", label: "With Head content" }, { value: "With Footer content", label: "With Footer content" }]
    const [isOpenLetterHeadPopup, setIsLetterHeadPopup] = useState(false)
    const [headerOptions, setHeaderOptions] = useState("Please Select Print Options")
    const [pagePopeOpen, setPagePopUpOpen] = useState("")
    const handleHeadChange = (options) => {
        let value = options.map((a) => {
            return a.value;
        })


        if (value?.length === 1 && value?.includes("With Head content")) {
            setDocumentPrepartion((prevArray) => ({
                ...prevArray,
                head: personId?.letterheadcontentheader[0]?.preview,
                foot: ""
            }));
            setHeader(personId?.letterheadcontentheader[0]?.preview)
        }
        else if (value?.length === 1 && value?.includes("With Footer content")) {
            setfooter(personId?.letterheadcontentfooter[0]?.preview)

            setDocumentPrepartion((prevArray) => ({
                ...prevArray,
                head: "",
                foot: personId?.letterheadcontentfooter[0]?.preview
            }));
        }
        else if (value?.length > 1) {
            setDocumentPrepartion((prevArray) => ({
                ...prevArray,
                head: personId?.letterheadcontentheader[0]?.preview,
                foot: personId?.letterheadcontentfooter[0]?.preview
            }));
            setHeader(personId?.letterheadcontentheader[0]?.preview)
            setfooter(personId?.letterheadcontentfooter[0]?.preview)
        }
        else {
            setHeader("")
            setfooter("")
            setDocumentPrepartion((prevArray) => ({
                ...prevArray,
                head: "",
                foot: ""
            }));

        }
        setHeadValue(value)
        setSelectedHeadOpt(options)
    }

    const customValueRenderHeadFrom = (valueCate) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Letter Head";
    };

    const handleClickOpenLetterHeader = (page) => {
        setPagePopUpOpen(page)
        setIsLetterHeadPopup(true);
        handleCloseBulkModcheckbox();
    }

    const handleClickCloseLetterHead = () => {
        setIsLetterHeadPopup(false);
        setHeaderOptions("Please Select Print Options")
        setHeadValue([]);
        setPagePopUpOpen("")
        setSelectedHeadOpt([]);
    }


















    let exportColumnNames = [
        'Date ',
        'Reference No',
        'Template No',
        'Template',
        'Company',
        'Branch',
        'To Company',
        'Printing Status',
        'Issued Person Details',
        'Issuing Authority'
    ];
    let exportRowValues = [
        'date',
        'referenceno',
        'templateno',
        'template',
        'company',
        'branch',
        'tocompany',
        'printingstatus',
        'issuedpersondetails',
        'issuingauthority'
    ];



    const [indexViewQuest, setIndexViewQuest] = useState(1);
    const [checking, setChecking] = useState("");
    const [checkingArray, setCheckingArray] = useState([]);
    const currentDateAttStatus = new Date();
    const currentYearAttStatus = currentDateAttStatus.getFullYear();
    const years = Array.from(new Array(10), (val, index) => currentYearAttStatus - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });



    const [loadingPrintData, setLoadingPrintData] = useState(false);
    const [loadingPrintMessage, setLoadingPrintMessage] = useState('Preparing an Document to Print...!');

    const [fromEmail, setFromEmail] = useState("");
    const [qrCodeNeed, setQrCodeNeed] = useState(false)
    const [toCompanyAddress, setToCompanyAddress] = useState(false)
    const [loading, setLoading] = useState(false);
    const [loadingPreviewData, setLoadingPreviewData] = useState(false);
    const [loadingGeneratingDatas, setLoadingGeneratingDatas] = useState(false);
    const [loadingGeneratingMessages, setLoadingGeneratingMessage] = useState('Generating the set of Documents...!');
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
    const [loadingPreviewMessage, setLoadingPreviewMessage] = useState('Setting up a document for preview...!');
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;
    //useStates
    const [date, setDate] = useState(formattedDate);
    const gridRef = useRef(null);
    // let newvalues = "DOC0001";
    const [DateFormat, setDateFormat] = useState();
    const [DateFormatEdit, setDateFormatEdit] = useState();
    const [autoId, setAutoId] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [Changed, setChanged] = useState("");
    const [documentPreparationEdit, setDocumentPreparationEdit] = useState([]);
    const [documentPreparationDelete, setDocumentPreparationDelete] = useState([]);
    const [templateCreationArray, setTemplateCreationArray] = useState([]);
    const [updateGen, setUpdateGen] = useState(true);
    const [bulkPrintStatus, setBulkPrintStatus] = useState(false);
    const [templateCreationArrayCreate, setTemplateCreationArrayCreate] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        isAssignBranch,
        buttonStyles,
    } = useContext(UserRoleAccessContext);


    // AssignBranch For Users
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
    const [btnload, setBtnLoad] = useState(false);
    const [btnloadSave, setBtnLoadSave] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [buttonLoadingPreview, setButtonLoadingPreview] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageSizePdf, setPageSizepdf] = useState("");
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [documentPrepartion, setDocumentPrepartion] = useState({
        date: "",
        template: "Please Select Template Name",
        referenceno: "",
        templateno: "",
        pagenumberneed: "All Pages",
        department: "Please Select Department",
        company: "Please Select Company",
        tocompany: "Please Select To Company",
        reason: "Document",
        issuingauthority: "Please Select Issuing Authority",
        branch: "Please Select Branch",
        month: "Please Select Month",
        sort: "Please Select Sort",
        attendancedate: "",
        attendancemonth: "Please Select Attendance Month",
        attendanceyear: "Please Select Attendance Year",
        productiondate: "",
        productionmonth: "Please Select Production Month",
        productionyear: "Please Select Production Year",
        proption: "Please Select Print Option",
        pagesize: "Please Select pagesize",
        print: "Please Select Print Option",
        heading: "Please Select Header Option",
        signature: "Please Select Signature",
        seal: "Please Select Seal",
        issuedpersondetails: "",
    });

    const [items, setItems] = useState([]);
    //  const [employees, setEmployees] = useState([]);
    const [departmentCheck, setDepartmentCheck] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [agendaEdit, setAgendaEdit] = useState("");
    const [head, setHeader] = useState("");
    const [foot, setfooter] = useState("");
    const [signature, setSignature] = useState("");
    const [signatureContent, setSignatureContent] = useState("");
    const [signatureStatus, setSignatureStatus] = useState("");
    const [sealStatus, setSealStatus] = useState("");

    const [companyName, setCompanyName] = useState("");
    const [sealPlacement, setSealPlacement] = useState("");
    const [waterMarkText, setWaterMarkText] = useState("");
    const [companyNameEdit, setCompanyNameEdit] = useState("");
    const [sealPlacementEdit, setSealPlacementEdit] = useState("");

    const [overallExcelDatas, setOverallExcelDatas] = useState([])
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

    const [isInfoOpenImage, setInfoOpenImage] = useState(false)
    const [previewManual, setPreviewManual] = useState(false)
    const [isInfoOpenImageManual, setInfoOpenImageManual] = useState(false)
    const [isInfoOpenImagePrint, setInfoOpenImagePrint] = useState(false)
    const [isInfoOpenImagePrintManual, setInfoOpenImagePrintManual] = useState(false)

    const handleClickOpenInfoImage = () => {
        setInfoOpenImage(true);
    };
    const handleCloseInfoImage = () => {
        setInfoOpenImage(false);
    };
    const handleClickOpenInfoImageManual = () => {
        setInfoOpenImageManual(true);
    };
    const handleCloseInfoImageManual = () => {
        setInfoOpenImageManual(false);
    };
    const handleClickOpenInfoImagePrint = () => {
        setInfoOpenImagePrint(true);
    };
    const handleCloseInfoImagePrint = () => {
        setInfoOpenImagePrint(false);
    };
    const handleOpenPreviewManual = () => {
        setPreviewManual(true);
    };
    const handleClosePreviewManual = () => {
        setPreviewManual(false);
    };
    const handleClickOpenInfoImagePrintManual = () => {
        setInfoOpenImagePrintManual(true);
    };
    const handleCloseInfoImagePrintManual = () => {
        setInfoOpenImagePrintManual(false);
    };

    const [openDialogManual, setOpenDialogManual] = useState(false)
    const handleClickOpenManualCheck = () => {
        setOpenDialogManual(true);
    };
    const handleCloseManualCheck = () => {
        setOpenDialogManual(false);
    };
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };



    const [headEdit, setHeaderEdit] = useState("");
    const [footEdit, setfooterEdit] = useState("");

    const [headvalue, setHeadValue] = useState([])
    const [selectedHeadOpt, setSelectedHeadOpt] = useState([])
    function encryptString(str) {
        if (str) {
            const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const shift = 3; // You can adjust the shift value as per your requirement
            let encrypted = "";
            for (let i = 0; i < str.length; i++) {
                let charIndex = characters.indexOf(str[i]);
                if (charIndex === -1) {
                    // If character is not found, add it directly to the encrypted string
                    encrypted += str[i];
                } else {
                    // Shift the character index
                    charIndex = (charIndex + shift) % characters.length;
                    encrypted += characters[charIndex];
                }
            }
            return encrypted;
        }
        else {
            return ""
        }

    }

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        referenceno: true,
        templateno: true,
        template: true,
        company: true,
        printingstatus: true,
        branch: true,
        tocompany: true,
        head: true,
        foot: true,
        headvaluetext: true,
        email: true,
        document: true,
        issuedpersondetails: true,
        issuingauthority: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    useEffect(() => {
        addSerialNumber(templateCreationArrayCreate);
    }, [templateCreationArrayCreate]);



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
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnLoad(false)
        setBtnLoadSave(false)
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
        setAgendaEdit("");
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
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
    const username = isUserRoleAccess.companyname;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const [isDeleteOpenBulkcheckbox, setIsDeleteOpenBulkcheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteBulkOpenalert, setIsDeleteBulkOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true)
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };

    const handleClickOpenBulkcheckbox = () => {
        setIsDeleteOpenBulkcheckbox(true);
    };
    const handleCloseBulkModcheckbox = () => {
        setIsDeleteOpenBulkcheckbox(false);
    };

    const handleClickOpenBulkalert = () => {
        if (selectedRows?.length === 0) {
            setIsDeleteBulkOpenalert(true);
        }
        else {
            const selectedData = rowDataTable?.filter(data => selectedRows?.includes(data?.id));

            if (selectedData.length > 0) {
                const isSameCompanyAndBranch = selectedData.every(
                    data => data.company === selectedData[0]?.company && data.branch === selectedData[0]?.branch
                );

                if (!isSameCompanyAndBranch) {
                    setPopupContentMalert("Please Choose Data with the Same Company and Branch!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    return; // Prevents further execution
                }
                TemplateDropdownsValueManual(selectedData[0].company, selectedData[0].branch);
                setIsDeleteOpenBulkcheckbox(true)

            }
        }
        // else {
        //     setIsDeleteOpenBulkcheckbox(true);
        // }
    };

    const TemplateDropdownsValueManual = async (company, branch) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch,
            });
            if (res?.data?.templatecontrolpanel) {

                const ans = res?.data?.templatecontrolpanel ?
                    res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
                setPersonId(ans)
            } else {
                setGenerateData(true)
                setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }


        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const handleCloseBulkModalert = () => {
        setIsDeleteBulkOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const [templateValues, setTemplateValues] = useState([]);
    const [templateCreationValue, setTemplateCreationValue] = useState("");
    const [employeeValue, setEmployeeValue] = useState([]);
    const [CompanyOptions, setCompanyOptions] = useState([]);
    const [toCompanyOptions, setToCompanyOptions] = useState([]);
    const [BranchOptions, setBranchOptions] = useState([]);
    const [branchaddress, setBranchAddress] = useState("")
    const [toCompanyAddressData, setToCompanyAddressData] = useState("");

    const [employeeMode, setEmployeeMode] = useState("Manual");
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
            pagename: String("Human Resource/HR Documents/Company Document Preparation"),
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
    const TemplateDropdowns = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.COMPANY_TEMPLATECREATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTemplateValues(
                res?.data?.templatecreation.map((data) => ({
                    ...data,
                    label: `${data.name}--(${data.company}--${data.branch})`,
                    value: `${data.name}--(${data.company}--${data.branch})`,
                    company: data.company,
                    branch: data.branch,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const TemplateDropdownsValue = async (comp, bran, e) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: comp,
                branch: bran,
            });
            setHeadValue(e?.headvalue);
            setPageSizepdf(e?.pagesize)
            handlePagenameChange(e.pagesize)
            if (res?.data?.templatecontrolpanel) {
                const answer = res?.data?.templatecontrolpanel;
                const ans = answer?.templatecontrolpanellog?.length > 0 ?
                    answer?.templatecontrolpanellog[0] : [];
                const toCompanyBranchOptions = ans ? ans?.toCompany?.map(data => ({
                    ...data,
                    label: data?.toCompanyname,
                    value: data?.toCompanyname
                }
                )) : []
                setToCompanyOptions(toCompanyBranchOptions)
                setPersonId(ans)
                setFromEmail(ans?.fromemail)
                setCompanyName(ans)
                // if (e.headvalue?.includes("With Head content")) {
                //     setHeader(ans?.letterheadcontentheader[0]?.preview)
                // }
                // if (e.headvalue?.includes("With Footer content")) {
                //     setfooter(ans?.letterheadcontentfooter[0]?.preview)
                // }
                setWaterMarkText(ans?.letterheadbodycontent[0].preview)
                setSignatureStatus(e?.signature)
                setSealStatus(e?.seal)
                setGenerateData(false)
            }
            else {
                setGenerateData(true)
                setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }

        } catch (err) { console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [uniqueCode, setUniqueCode] = useState("")

    const IdentifyUserCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.COMPANY_DOCUMENT_PREPARATION_CODES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: documentPrepartion?.company,
                branch: e.branch,
            });

            setUniqueCode(res?.data?.documentPreparation)

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const [issuingauthority, setIssuingAutholrity] = useState([])
    const fetchIsssuingAuthorityManual = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.ASSIGNINTERVIEW_FILTER_MANUAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: documentPrepartion.company === "Please Select Company" ? "" : documentPrepartion.company,
                branch: e,
                type: "Branch"
            });
            //Need to do that to compare company , branch , unit , team
            const answer = res?.data?.user

            setIssuingAutholrity(answer?.length > 0 ? answer.map(Data => ({
                ...Data,
                label: Data.companyname,
                value: Data.companyname
            })) : [])
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const CompanyDropDowns = async () => {
        setPageName(!pageName);
        try {
            setCompanyOptions(accessbranch?.map(data => ({
                label: data.company,
                value: data.company,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const BranchDropDowns = async (e) => {
        setPageName(!pageName);
        try {
            setBranchOptions(accessbranch?.filter(
                (comp) =>
                    e === comp.company
            )?.map(data => ({
                ...data,
                label: data.branch,
                value: data.branch,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const extractEmailFormat = async (name, id) => {
        const suser = await axios.post(SERVICE.USER_NAME_SEARCH, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            name: name
        });

        const userFind = suser?.data?.users?.length > 0 ? suser?.data?.users[0] : "none";
        const tempcontpanel = await axios.post(SERVICE.TEMPLATECONTROLPANEL_USERFIND, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            user: userFind
        });
        let convert = tempcontpanel?.data?.result[0]?.emailformat;
        let fromemail = tempcontpanel?.data?.result[0]?.fromemail;
        let ccemail = tempcontpanel?.data?.result[0]?.ccemail;
        let bccemail = tempcontpanel?.data?.result[0]?.bccemail;


        await fetchEmailForUser(id, convert, fromemail, ccemail, bccemail)

    }

    const [agendaEditStyles, setAgendaEditStyles] = useState({});
    const handlePagenameChange = (format) => {

        if (format === "A3") {
            setAgendaEditStyles({ width: "297mm", height: "420mm" });
        }
        else if (format === "A4") {
            setAgendaEditStyles({ width: "210mm", height: "297mm" });
        }
        else if (format === "Certificate") {
            setAgendaEditStyles({ width: "297mm", height: "180mm" });
        }
        else if (format === "Certificate1") {
            setAgendaEditStyles({ width: "297mm", height: "200mm" });
        }
        else if (format === "Envelope") {
            setAgendaEditStyles({ width: "220mm", height: "110mm" });
        }

    }


    let Allcodedata = `${BASE_URL}/document/documentpreparation/${encryptString(isUserRoleAccess.companyname)}/${isUserRoleAccess ? isUserRoleAccess?._id : ""}/${encryptString(documentPrepartion?.issuingauthority)}/${DateFormat}/${isUserRoleAccess?._id}`

    let AllcodedataEdit = `${BASE_URL}/document/documentpreparation/${encryptString(documentPreparationEdit.person)}/${companyNameEdit?._id}/${encryptString(documentPreparationEdit?.issuingauthority)}/${DateFormatEdit}`


    const generateQrCode = async () => {
        setPageName(!pageName);
        try {
            const response = await QRCode.toDataURL(`${Allcodedata}`);
            setImageUrl(response);
        } catch (error) {

        }
    }
    const generateQrCodeEdit = async () => {
        setPageName(!pageName);
        try {
            const response = await QRCode.toDataURL(` ${AllcodedataEdit}`);
            setImageUrlEdit(response);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        generateQrCode();
    }, [Allcodedata])

    useEffect(() => {
        generateQrCodeEdit();
    }, [documentPreparationEdit, companyNameEdit])



    const createFooterElementImageEdit = () => {
        const footerElement = document.createElement("div");
        footerElement.innerHTML = `
      <div style="margin-top: 10px; page-break-inside: avoid; page-break-before: auto; page-break-after: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid; page-break-before: auto; page-break-after: auto;">
      <img src="${imageUrlEdit}" alt="img" width="100" height="100" style="margin-top: -10px; page-break-inside: avoid; page-break-before: auto; page-break-after: auto;" />
      <img src="${sealPlacementEdit}" alt="img" width="100" height="100" style="margin-top: -10px;  margin-right : 40px;  page-break-inside: avoid; page-break-before: auto; page-break-after: auto;" />
    </div>  
      </div>
    `;
        return footerElement;
    };







    const handleNextPage = () => {
        setIndexViewQuest(indexViewQuest + 1);
    };

    const handlePrevPage = () => {
        setIndexViewQuest(indexViewQuest - 1);
    };
    const HandleDeleteText = (index) => {
        const updatedTodos = [...checkingArray];
        updatedTodos.splice(index, 1);
        setCheckingArray(updatedTodos);
        if (updatedTodos.length > 0) {
            setIndexViewQuest(1);
        }
        else {
            setIndexViewQuest(0);
        }
    };
    const [emailUser, setEmailUser] = useState("");

    const [employeeControlPanel, setEmployeeControlPanel] = useState("");

    const fetchAllRaisedTickets = async () => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.COMPANY_DOCUMENT_PREPARATION_AUTOID, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let refNo = res_queue?.data?.documentPreparation?.length > 0 ?
                res_queue?.data?.documentPreparation[0]?.templateno :
                uniqueCode + "#" + templateCreationValue?.tempcode + "_" + "0000";
            let codenum = refNo.split("_");
            return codenum;


        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };




    const answer = async (person, index) => {
        let employeename = person ? person : employeeValue;
        const constAuotId = await fetchAllRaisedTickets();
        let prefixLength = Number(constAuotId[1]) + (employeeControlPanel ? (index + 1) : 1);
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ?
            `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ?
                `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}`
                    : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` :
                        prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString



        let newval = employeeControlPanel ? uniqueCode + "#" + templateCreationValue?.tempcode + "_" + postfixLength :
            "Man" + "#" + ((templateCreationValue?.tempcode === "" || templateCreationValue?.tempcode === undefined) ? ""
                : templateCreationValue?.tempcode) + "_" + postfixLength;
        let newvalRefNo = `CDP_${postfixLength}`;
        setLoadingGeneratingDatas(true)
        setPageName(!pageName);

        try {
            let matches = documentPrepartion?.template?.replaceAll("(", "")?.replaceAll(")", "")?.split("--");
            const [res] = await Promise.all([
                axios.post(SERVICE.COMPANY_TEMPLATECREATION_FILTER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: matches[1],
                    branch: matches[2],
                    template: documentPrepartion?.template?.split("--")[0]
                }),
            ])
            let format = res?.data?.templatecreation ? res?.data?.templatecreation : "";

            let convert = format?.pageformat;
            const tempElement = document?.createElement("div");
            tempElement.innerHTML = convert;

            const listItems = Array.from(tempElement.querySelectorAll("li"));
            listItems.forEach((li, index) => {
                li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
            });
            let texted = tempElement.innerHTML;
            if (employeeMode === "Manual") {
                let findMethod = texted
                    .replaceAll("$UNIID$", newval ? newval : "")
                    .replaceAll("$F.COMPANY$", toCompanyAddress ? documentPrepartion?.company : "")
                    .replaceAll("$F.BRANCH$", toCompanyAddress ? documentPrepartion?.branch : "")
                    .replaceAll("$F.BRANCHADDRESS$", (branchaddress !== "" && toCompanyAddress) ? branchaddress?.branchaddress?.split(',').join(',\n') : "")
                    .replaceAll("$T.COMPANY$", documentPrepartion?.tocompany ? documentPrepartion?.tocompany : "")
                    .replaceAll("$T.COMPANYADDRESS$", toCompanyAddressData ? toCompanyAddressData : "")
                setChecking(findMethod)

            }
            setLoadingGeneratingDatas(false)
        }
        catch (err) { setLoadingGeneratingDatas(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const value = uniqueCode + "#" + templateCreationValue?.tempcode;

    const handlePrintDocumentManual = () => {
        if (headerOptions === "Please Select Print Options") {
            setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
            setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (generateData) {
            setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            setButtonLoading(true)

            downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {

                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoading(false)
                    setPopupContentMalert(`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {
                    setButtonLoading(false)
                    handleClickOpenInfoImagePrintManual();
                    handleClickCloseLetterHead();
                }

            }).catch((error) => {
                console.error('Error generating PDF:', error);
            })
        }
    }
    const downloadPdfTesdt = (index) => {
        setInfoOpenImagePrint(false)
        setIsLetterHeadPopup(false)
        // Create a new div element to hold the Quill content
        const pdfElement = document.createElement("div");
        pdfElement.innerHTML = checkingArray[index]?.data;
        const pdfElementHead = document.createElement("div");
        pdfElementHead.innerHTML = checkingArray[index]?.header;


        // Add custom styles to the PDF content
        const styleElement = document.createElement("style");
        styleElement.textContent = `
      .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
      .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
      .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
      .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
      .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
      .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
      .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
      .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
      .ql-align-right { text-align: right; } 
      .ql-align-left { text-align: left; } 
      .ql-align-center { text-align: center; } 
      .ql-align-justify { text-align: justify; } 
    `;


        pdfElement.appendChild(styleElement);


        // Create a watermark element
        const watermarkElement = document.createElement("div");
        watermarkElement.style.position = "absolute";
        watermarkElement.style.left = "0";
        watermarkElement.style.top = "0";
        watermarkElement.style.width = "100%";
        watermarkElement.style.height = "100%";
        watermarkElement.style.display = "flex";
        watermarkElement.style.alignItems = "center";
        watermarkElement.style.justifyContent = "center";
        watermarkElement.style.opacity = "0.09"; // Adjust the opacity as needed
        watermarkElement.style.pointerEvents = "none"; // Make sure the watermark doesn't interfere with user interactions

        // Create and append an image element
        const watermarkImage = document.createElement("img");
        watermarkImage.src = checkingArray[index]?.watermark; // Replace "path_to_your_image" with the actual path to your image
        watermarkImage.style.width = "75%"; // Adjust the width of the image
        watermarkImage.style.height = "50%"; // Adjust the height of the image
        watermarkImage.style.objectFit = "contain"; // Adjust the object-fit property as needed

        watermarkElement.appendChild(watermarkImage);

        const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();

            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                // Add header
                doc.setFontSize(12);
                // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
                const headerImgWidth = pageWidth * 0.95; // Adjust as needed
                const headerImgHeight = pageHeight * 0.09; // Adjust as needed
                const headerX = 5; // Start from the left
                const headerY = 3.5; // Start from the top
                doc.addImage(checkingArray[index]?.header, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                if (checkingArray[index]?.header !== "") {
                    const imgWidth = pageWidth * 0.50;
                    const imgHeight = pageHeight * 0.25;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2 - 20;
                    doc.setFillColor(0, 0, 0, 0.1);
                    doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                }
                // Add footer
                doc.setFontSize(10);

                // Add footer image stretched to page width
                const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
                const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
                const footerX = 5; // Start from the left
                const footerY = (pageHeight * 1) - footerImgHeight - 5;
                doc.addImage(checkingArray[index]?.footer, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                if (checkingArray[index]?.pagenumberneed === "All Pages") {
                    const textY = footerY - 3;
                    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                } else if (checkingArray[index]?.pagenumberneed === "End Page" && i === totalPages) {
                    const textY = footerY - 3;
                    doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                }



                if (checkingArray[index]?.qrcodeNeed) {
                    // Add QR code and statement only on the last page
                    if (i === totalPages) {
                        // Add QR code in the left corner
                        const qrCodeWidth = 25; // Adjust as needed
                        const qrCodeHeight = 25; // Adjust as needed
                        const qrCodeX = footerX; // Left corner
                        const qrCodeY = footerY - qrCodeHeight - 15; // 15 units above the footer image
                        doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);




                        // Add statement on the right of the QR code
                        const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                        const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                        const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                        const statementY3 = statementY2 + 5; // Adjust as needed for spacing

                        // Add statements
                        const statementText1 = '1. Scan to verify the authenticity of this document.';
                        const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                        const statementText3 = `3. For questions, contact us at ${checkingArray[index]?.frommailemail}.`;

                        doc.setFontSize(12);
                        doc.text(statementText1, statementX, statementY1);
                        doc.text(statementText2, statementX, statementY2);
                        doc.text(statementText3, statementX, statementY3);
                    }
                    // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
                }


            }
        };

        // Convert the HTML content to PDF
        html2pdf()
            .from(pdfElement)
            .set({
                margin: checkingArray[index]?.pagesize == "A3"
                    ? ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [45, 15, 45, 15]
                        : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [20, 15, 45, 15]
                            : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [45, 15, 20, 15] :
                                [20, 15, 20, 15])

                    :
                    ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [30, 15, 45, 15]
                        : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [15, 15, 45, 15]
                            : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: {
                    unit: "mm",
                    format: [
                        parseFloat(checkingArray[index]?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                        parseFloat(checkingArray[index]?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                    ],
                    orientation: checkingArray[index]?.orientation || "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                },
                lineHeight: 0, // Increased line spacing
                fontSize: 12,
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            }).toPdf().get('pdf').then((pdf) => {
                // Convert the watermark image to a base64 string
                const img = new Image();
                img.src = waterMarkText;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.globalAlpha = 0.1;
                    ctx.drawImage(img, 0, 0);
                    const watermarkImage = canvas.toDataURL('image/png');


                    // Add QR code image
                    const qrImg = new Image();
                    qrImg.src = checkingArray[index]?.qrcodeNeed ? checkingArray[index]?.qrcode : ''; // QR code image URL
                    qrImg.onload = () => {
                        const qrCanvas = document.createElement('canvas');
                        qrCanvas.width = qrImg.width;
                        qrCanvas.height = qrImg.height;
                        const qrCtx = qrCanvas.getContext('2d');
                        qrCtx.drawImage(qrImg, 0, 0);
                        const qrCodeImage = qrCanvas.toDataURL('image/png');

                        // Add page numbers, watermark, and QR code to each page
                        addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                        // Save the PDF
                        pdf.save(`${checkingArray[index]?.template}.pdf`);
                        setButtonLoading(false)
                        handleCloseInfoImagePrint();
                    };
                };
            });


    };

    const downloadPdfTesdtManual = () => {
        // setButtonLoading(true)
        setInfoOpenImagePrintManual(false)
        setLoadingPrintData(true)
        // Create a new div element to hold the Quill content
        const pdfElement = document.createElement("div");
        pdfElement.innerHTML = checking;
        let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
        <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
        ` : "")
            .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
          <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
  ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
      <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
    ` : "")
            .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
      <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
           ` : "")
        pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
        const pdfElementHead = document.createElement("div");
        pdfElementHead.innerHTML = head;


        // Add custom styles to the PDF content
        const styleElement = document.createElement("style");
        styleElement.textContent = `
      .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
      .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
      .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
      .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
      .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
      .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
      .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
      .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
      .ql-align-right { text-align: right; } 
      .ql-align-left { text-align: left; } 
      .ql-align-center { text-align: center; } 
      .ql-align-justify { text-align: justify; } 
    `;


        pdfElement.appendChild(styleElement);


        // Create a watermark element
        const watermarkElement = document.createElement("div");
        watermarkElement.style.position = "absolute";
        watermarkElement.style.left = "0";
        watermarkElement.style.top = "0";
        watermarkElement.style.width = "100%";
        watermarkElement.style.height = "100%";
        watermarkElement.style.display = "flex";
        watermarkElement.style.alignItems = "center";
        watermarkElement.style.justifyContent = "center";
        watermarkElement.style.opacity = "0.09"; // Adjust the opacity as needed
        watermarkElement.style.pointerEvents = "none"; // Make sure the watermark doesn't interfere with user interactions

        // Create and append an image element
        const watermarkImage = document.createElement("img");
        watermarkImage.src = waterMarkText; // Replace "path_to_your_image" with the actual path to your image
        watermarkImage.style.width = "75%"; // Adjust the width of the image
        watermarkImage.style.height = "50%"; // Adjust the height of the image
        watermarkImage.style.objectFit = "contain"; // Adjust the object-fit property as needed

        watermarkElement.appendChild(watermarkImage);

        const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();
            const margin = 15; // Adjust as needed
            const footerHeight = 15; // Adjust as needed
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                doc.setFontSize(12);
                const headerImgWidth = pageWidth * 0.95;
                const headerImgHeight = pageHeight * 0.09;
                const headerX = 5;
                const headerY = 3.5;
                doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                if (head !== "") {
                    const imgWidth = pageWidth * 0.50;
                    const imgHeight = pageHeight * 0.25;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2 - 20;
                    doc.setFillColor(0, 0, 0, 0.1);
                    doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                }
                doc.setFontSize(10);
                const footerImgWidth = pageWidth * 0.95;
                const footerImgHeight = pageHeight * 0.067;
                const footerX = 5;
                const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3); // Position at the bottom
                // const footerY = pageHeight - footerHeight;
                doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                if (documentPrepartion?.pagenumberneed === "All Pages") {
                    const textY = footerY - 3;
                    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
                    const textY = footerY - 3;
                    doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                }


                if (qrCodeNeed) {
                    if (i === totalPages) {
                        const qrCodeWidth = 25;
                        const qrCodeHeight = 25;
                        const qrCodeX = footerX;
                        const qrCodeY = footerY - qrCodeHeight - 4;
                        doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                        const statementX = qrCodeX + qrCodeWidth + 10;
                        const statementY1 = qrCodeY + 10;
                        const statementY2 = statementY1 + 5;
                        const statementY3 = statementY2 + 5;

                        const statementText1 = '1. Scan to verify the authenticity of this document.';
                        const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                        const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                        doc.setFontSize(12);
                        doc.text(statementText1, statementX, statementY1);
                        doc.text(statementText2, statementX, statementY2);
                        doc.text(statementText3, statementX, statementY3);
                    }
                }
                const contentAreaHeight = pageHeight - footerHeight - margin;
            }
        };
        // Convert the HTML content to PDF
        html2pdf()
            .from(pdfElement)
            .set({
                margin: pageSizePdf == "A3"
                    ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                        : (head === "" && foot !== "") ? [20, 15, 45, 15]
                            : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                [20, 15, 20, 15])

                    :
                    ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                        : (head === "" && foot !== "") ? [15, 15, 45, 15]
                            : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: {
                    unit: "mm",
                    format: [
                        parseFloat(agendaEditStyles.width) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                        parseFloat(agendaEditStyles.height) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                    ],
                    orientation: agendaEditStyles.orientation || "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                },
                lineHeight: 0, // Increased line spacing
                fontSize: 12,
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            }).toPdf().get('pdf').then((pdf) => {
                // Convert the watermark image to a base64 string
                const img = new Image();
                img.src = waterMarkText;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.globalAlpha = 0.1;
                    ctx.drawImage(img, 0, 0);
                    const watermarkImage = canvas.toDataURL('image/png');


                    // Add QR code image
                    const qrImg = new Image();
                    qrImg.src = qrCodeNeed ? imageUrl : ''; // QR code image URL
                    if (qrCodeNeed) {
                        qrImg.onload = () => {
                            const qrCanvas = document.createElement('canvas');
                            qrCanvas.width = qrImg.width;
                            qrCanvas.height = qrImg.height;
                            const qrCtx = qrCanvas.getContext('2d');
                            qrCtx.drawImage(qrImg, 0, 0);
                            const qrCodeImage = qrCanvas.toDataURL('image/png');

                            // Add page numbers, watermark, and QR code to each page
                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                            // Save the PDF
                            pdf.save(`${documentPrepartion.template}.pdf`);
                            setButtonLoading(false)
                            setLoadingPrintData(false)
                            handleCloseInfoImagePrint();
                        };

                    }
                    else {
                        addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                        // Save the PDF
                        pdf.save(`${documentPrepartion.template}.pdf`);
                        setLoadingPrintData(false)
                        setButtonLoading(false)
                        setHeaderOptionsButton(false);
                        handleCloseInfoImagePrint();
                        handleClickCloseLetterHead();
                    }
                };
            });


    };

    const handlePreviewDocumentManual = () => {

        if (headerOptions === "Please Select Print Options") {
            setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
            setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (generateData) {
            setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            setHeaderOptionsButton(true);
            setButtonLoadingPreview(true)
            setLoadingPreviewData(true)

            downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {

                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoadingPreview(false)
                    setHeaderOptionsButton(false);
                    setPreviewManual(true)
                    setLoadingPreviewData(false)
                }
                else {
                    handleClickCloseLetterHead()
                    setPreviewManual(false)
                    setLoadingPreviewData(false)
                    setButtonLoadingPreview(true);
                    setHeaderOptionsButton(false);
                    // Create a new div element to hold the Quill content
                    const pdfElement = document.createElement("div");
                    pdfElement.innerHTML = checking;
                    let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
                <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
                ` : "")
                        .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
                  <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
          ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
              <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
            ` : "")
                        .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
              <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
                   ` : "")


                    pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
                    const pdfElementHead = document.createElement("div");
                    pdfElementHead.innerHTML = head;

                    // Add custom styles to the PDF content
                    const styleElement = document.createElement("style");
                    styleElement.textContent = `
                .ql-indent-1 { margin-left: 75px; }
                .ql-indent-2 { margin-left: 150px; }
                .ql-indent-3 { margin-left: 225px; }
                .ql-indent-4 { margin-left: 275px; }
                .ql-indent-5 { margin-left: 325px; }
                .ql-indent-6 { margin-left: 375px; }
                .ql-indent-7 { margin-left: 425px; }
                .ql-indent-8 { margin-left: 475px; }
                .ql-align-right { text-align: right; }
                .ql-align-left { text-align: left; }
                .ql-align-center { text-align: center; }
                .ql-align-justify { text-align: justify; }
              `;

                    pdfElement.appendChild(styleElement);

                    // Create a watermark element
                    const watermarkElement = document.createElement("div");
                    watermarkElement.style.position = "absolute";
                    watermarkElement.style.left = "0";
                    watermarkElement.style.top = "0";
                    watermarkElement.style.width = "100%";
                    watermarkElement.style.height = "100%";
                    watermarkElement.style.display = "flex";
                    watermarkElement.style.alignItems = "center";
                    watermarkElement.style.justifyContent = "center";
                    watermarkElement.style.opacity = "0.09";
                    watermarkElement.style.pointerEvents = "none";

                    const watermarkImage = document.createElement("img");
                    watermarkImage.src = waterMarkText;
                    watermarkImage.style.width = "75%";
                    watermarkImage.style.height = "50%";
                    watermarkImage.style.objectFit = "contain";

                    watermarkElement.appendChild(watermarkImage);

                    const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
                        const totalPages = doc.internal.getNumberOfPages();
                        const margin = 15; // Adjust as needed
                        const footerHeight = 15; // Adjust as needed
                        for (let i = 1; i <= totalPages; i++) {
                            doc.setPage(i);
                            const pageWidth = doc.internal.pageSize.getWidth();
                            const pageHeight = doc.internal.pageSize.getHeight();

                            doc.setFontSize(12);
                            const headerImgWidth = pageWidth * 0.95;
                            const headerImgHeight = pageHeight * 0.09;
                            const headerX = 5;
                            const headerY = 3.5;
                            doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                            const imgWidth = pageWidth * 0.50;
                            const imgHeight = pageHeight * 0.25;
                            const x = (pageWidth - imgWidth) / 2;
                            const y = (pageHeight - imgHeight) / 2 - 20;
                            doc.setFillColor(0, 0, 0, 0.1);
                            doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

                            doc.setFontSize(10);
                            const footerImgWidth = pageWidth * 0.95;
                            const footerImgHeight = pageHeight * 0.067;
                            const footerX = 5;
                            const footerY = (pageHeight * 1) - footerImgHeight - 5;
                            // const footerY = pageHeight - footerHeight;
                            doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                            if (documentPrepartion?.pagenumberneed === "All Pages") {
                                const textY = footerY - 3;
                                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                            } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
                                const textY = footerY - 3;
                                doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                            }


                            if (qrCodeNeed) {
                                if (i === totalPages) {
                                    const qrCodeWidth = 25;
                                    const qrCodeHeight = 25;
                                    const qrCodeX = footerX;
                                    const qrCodeY = footerY - qrCodeHeight - 4;
                                    doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                                    const statementX = qrCodeX + qrCodeWidth + 10;
                                    const statementY1 = qrCodeY + 10;
                                    const statementY2 = statementY1 + 5;
                                    const statementY3 = statementY2 + 5;

                                    const statementText1 = '1. Scan to verify the authenticity of this document.';
                                    const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                                    const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                                    doc.setFontSize(12);
                                    doc.text(statementText1, statementX, statementY1);
                                    doc.text(statementText2, statementX, statementY2);
                                    doc.text(statementText3, statementX, statementY3);
                                }
                            }
                            const contentAreaHeight = pageHeight - footerHeight - margin;
                        }
                    };

                    html2pdf()
                        .from(pdfElement)
                        .set({
                            margin: pageSizePdf == "A3"
                                ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
                                    : (head === "" && foot !== "") ? [20, 15, 45, 15]
                                        : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                            [20, 15, 20, 15])

                                :
                                ((head !== "" && foot !== "") ? [30, 15, 45, 15]
                                    : (head === "" && foot !== "") ? [15, 15, 45, 15]
                                        : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                            image: { type: "jpeg", quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: {
                                unit: "mm",
                                format: [
                                    parseFloat(agendaEditStyles.width) || 210,
                                    parseFloat(agendaEditStyles.height) || 297
                                ],
                                orientation: agendaEditStyles.orientation || "portrait"
                            },
                            lineHeight: 0,
                            fontSize: 12,
                            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                        })
                        .toPdf()
                        .get('pdf')
                        .then((pdf) => {
                            const img = new Image();
                            img.src = waterMarkText;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext('2d');
                                ctx.globalAlpha = 0.1;
                                ctx.drawImage(img, 0, 0);
                                const watermarkImage = canvas.toDataURL('image/png');

                                const qrImg = new Image();
                                qrImg.src = imageUrl;
                                qrImg.onload = () => {
                                    const qrCanvas = document.createElement('canvas');
                                    qrCanvas.width = qrImg.width;
                                    qrCanvas.height = qrImg.height;
                                    const qrCtx = qrCanvas.getContext('2d');
                                    qrCtx.drawImage(qrImg, 0, 0);
                                    const qrCodeImage = qrCanvas.toDataURL('image/png');

                                    addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                                    const pdfBlob = pdf.output('blob');
                                    const pdfUrl = URL.createObjectURL(pdfBlob);
                                    const printWindow = window.open(pdfUrl);
                                    setButtonLoadingPreview(false);
                                };
                            };
                        });
                    setLoadingPreviewData(false)
                }

            }).catch((error) => {
                console.error('Error generating PDF:', error);
            })

        }


    };


    const handleOpenPreviewManualfunc = () => {
        setButtonLoadingPreview(true);
        setPreviewManual(false)
        // Create a new div element to hold the Quill content
        const pdfElement = document.createElement("div");
        pdfElement.innerHTML = checking;
        let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
      <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1;width: 100px; height: 90px;" />
      ` : "")
            .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
        <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
    <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
  ` : "")
            .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
    <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
         ` : "")


        pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
        const pdfElementHead = document.createElement("div");
        pdfElementHead.innerHTML = head;

        // Add custom styles to the PDF content
        const styleElement = document.createElement("style");
        styleElement.textContent = `
      .ql-indent-1 { margin-left: 75px; }
      .ql-indent-2 { margin-left: 150px; }
      .ql-indent-3 { margin-left: 225px; }
      .ql-indent-4 { margin-left: 275px; }
      .ql-indent-5 { margin-left: 325px; }
      .ql-indent-6 { margin-left: 375px; }
      .ql-indent-7 { margin-left: 425px; }
      .ql-indent-8 { margin-left: 475px; }
      .ql-align-right { text-align: right; }
      .ql-align-left { text-align: left; }
      .ql-align-center { text-align: center; }
      .ql-align-justify { text-align: justify; }
    `;

        pdfElement.appendChild(styleElement);

        // Create a watermark element
        const watermarkElement = document.createElement("div");
        watermarkElement.style.position = "absolute";
        watermarkElement.style.left = "0";
        watermarkElement.style.top = "0";
        watermarkElement.style.width = "100%";
        watermarkElement.style.height = "100%";
        watermarkElement.style.display = "flex";
        watermarkElement.style.alignItems = "center";
        watermarkElement.style.justifyContent = "center";
        watermarkElement.style.opacity = "0.09";
        watermarkElement.style.pointerEvents = "none";

        const watermarkImage = document.createElement("img");
        watermarkImage.src = waterMarkText;
        watermarkImage.style.width = "75%";
        watermarkImage.style.height = "50%";
        watermarkImage.style.objectFit = "contain";

        watermarkElement.appendChild(watermarkImage);

        const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();
            const margin = 15; // Adjust as needed
            const footerHeight = 15; // Adjust as needed
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                doc.setFontSize(12);
                const headerImgWidth = pageWidth * 0.95;
                const headerImgHeight = pageHeight * 0.09;
                const headerX = 5;
                const headerY = 3.5;
                doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                const imgWidth = pageWidth * 0.50;
                const imgHeight = pageHeight * 0.25;
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2 - 20;
                doc.setFillColor(0, 0, 0, 0.1);
                doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

                doc.setFontSize(10);
                const footerImgWidth = pageWidth * 0.95;
                const footerImgHeight = pageHeight * 0.067;
                const footerX = 5;
                const footerY = (pageHeight * 1) - footerImgHeight - 5;
                // const footerY = pageHeight - footerHeight;
                doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                if (documentPrepartion?.pagenumberneed === "All Pages") {
                    const textY = footerY - 3;
                    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
                    const textY = footerY - 3;
                    doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                }


                if (qrCodeNeed) {
                    if (i === totalPages) {
                        const qrCodeWidth = 25;
                        const qrCodeHeight = 25;
                        const qrCodeX = footerX;
                        const qrCodeY = footerY - qrCodeHeight - 4;
                        doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                        const statementX = qrCodeX + qrCodeWidth + 10;
                        const statementY1 = qrCodeY + 10;
                        const statementY2 = statementY1 + 5;
                        const statementY3 = statementY2 + 5;

                        const statementText1 = '1. Scan to verify the authenticity of this document.';
                        const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                        const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                        doc.setFontSize(12);
                        doc.text(statementText1, statementX, statementY1);
                        doc.text(statementText2, statementX, statementY2);
                        doc.text(statementText3, statementX, statementY3);
                    }
                }
                const contentAreaHeight = pageHeight - footerHeight - margin;
            }
        };

        html2pdf()
            .from(pdfElement)
            .set({
                margin: pageSizePdf == "A3"
                    ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
                        : (head === "" && foot !== "") ? [20, 15, 45, 15]
                            : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                [20, 15, 20, 15])

                    :
                    ((head !== "" && foot !== "") ? [30, 15, 45, 15]
                        : (head === "" && foot !== "") ? [15, 15, 45, 15]
                            : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: {
                    unit: "mm",
                    format: [
                        parseFloat(agendaEditStyles.width) || 210,
                        parseFloat(agendaEditStyles.height) || 297
                    ],
                    orientation: agendaEditStyles.orientation || "portrait"
                },
                lineHeight: 0,
                fontSize: 12,
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            })
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const img = new Image();
                img.src = waterMarkText;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.globalAlpha = 0.1;
                    ctx.drawImage(img, 0, 0);
                    const watermarkImage = canvas.toDataURL('image/png');

                    const qrImg = new Image();
                    qrImg.src = imageUrl;
                    qrImg.onload = () => {
                        const qrCanvas = document.createElement('canvas');
                        qrCanvas.width = qrImg.width;
                        qrCanvas.height = qrImg.height;
                        const qrCtx = qrCanvas.getContext('2d');
                        qrCtx.drawImage(qrImg, 0, 0);
                        const qrCodeImage = qrCanvas.toDataURL('image/png');

                        addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                        const pdfBlob = pdf.output('blob');
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        const printWindow = window.open(pdfUrl);
                        setButtonLoadingPreview(false);
                    };
                };
            });
    }

    const downloadPdfTesdtCheckTrueManual = () => {
        return new Promise((resolve, reject) => {
            // Create a new div element to hold the Quill content
            const pdfElement = document.createElement("div");

            pdfElement.innerHTML = checking;
            let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
        <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
        ` : "")
                .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
          <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
  ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
      <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
    ` : "")
                .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
      <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
           ` : "")
            pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
            const pdfElementHead = document.createElement("div");

            pdfElementHead.innerHTML = head;
            // Add custom styles to the PDF content
            const styleElement = document.createElement("style");
            styleElement.textContent = `
        .ql-indent-1 { margin-left: 75px; }
        .ql-indent-2 { margin-left: 150px; }
        .ql-indent-3 { margin-left: 225px; }
        .ql-indent-4 { margin-left: 275px; }
        .ql-indent-5 { margin-left: 325px; }
        .ql-indent-6 { margin-left: 375px; }
        .ql-indent-7 { margin-left: 425px; }
        .ql-indent-8 { margin-left: 475px; }
        .ql-align-right { text-align: right; }
        .ql-align-left { text-align: left; }
        .ql-align-center { text-align: center; }
        .ql-align-justify { text-align: justify; }
      `;
            pdfElement.appendChild(styleElement);

            // Create a watermark element
            const watermarkElement = document.createElement("div");
            watermarkElement.style.position = "absolute";
            watermarkElement.style.left = "0";
            watermarkElement.style.top = "0";
            watermarkElement.style.width = "100%";
            watermarkElement.style.height = "100%";
            watermarkElement.style.display = "flex";
            watermarkElement.style.alignItems = "center";
            watermarkElement.style.justifyContent = "center";
            watermarkElement.style.opacity = "0.09";
            watermarkElement.style.pointerEvents = "none";

            // Create and append an image element for watermark
            const watermarkImage = document.createElement("img");
            watermarkImage.src = waterMarkText;
            watermarkImage.style.width = "75%";
            watermarkImage.style.height = "50%";
            watermarkImage.style.objectFit = "contain";
            watermarkElement.appendChild(watermarkImage);

            const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
                const totalPages = doc.internal.getNumberOfPages();
                const margin = 15; // Adjust as needed
                const footerHeight = 15; // Adjust as needed
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();

                    doc.setFontSize(12);
                    const headerImgWidth = pageWidth * 0.95;
                    const headerImgHeight = pageHeight * 0.09;
                    const headerX = 5;
                    const headerY = 3.5;
                    doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                    const imgWidth = pageWidth * 0.50;
                    const imgHeight = pageHeight * 0.25;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2 - 20;
                    doc.setFillColor(0, 0, 0, 0.1);
                    doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

                    doc.setFontSize(10);
                    const footerImgWidth = pageWidth * 0.95;
                    const footerImgHeight = pageHeight * 0.067;
                    const footerX = 5;
                    const footerY = (pageHeight * 1) - footerImgHeight - 5;
                    // const footerY = pageHeight - footerHeight;
                    doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                    if (documentPrepartion?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }


                    if (qrCodeNeed) {
                        if (i === totalPages) {
                            const qrCodeWidth = 25;
                            const qrCodeHeight = 25;
                            const qrCodeX = footerX;
                            const qrCodeY = footerY - qrCodeHeight - 4;
                            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                            const statementX = qrCodeX + qrCodeWidth + 10;
                            const statementY1 = qrCodeY + 10;
                            const statementY2 = statementY1 + 5;
                            const statementY3 = statementY2 + 5;

                            const statementText1 = '1. Scan to verify the authenticity of this document.';
                            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                            const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                            doc.setFontSize(12);
                            doc.text(statementText1, statementX, statementY1);
                            doc.text(statementText2, statementX, statementY2);
                            doc.text(statementText3, statementX, statementY3);
                        }
                    }
                    const contentAreaHeight = pageHeight - footerHeight - margin;
                }
            };

            // Convert the HTML content to PDF
            html2pdf()
                .from(pdfElement)
                .set({
                    margin: pageSizePdf == "A3"
                        ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
                            : (head === "" && foot !== "") ? [20, 15, 45, 15]
                                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                    [20, 15, 20, 15])

                        :
                        ((head !== "" && foot !== "") ? [30, 15, 45, 15]
                            : (head === "" && foot !== "") ? [15, 15, 45, 15]
                                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: {
                        unit: "mm",
                        format: [
                            parseFloat(agendaEditStyles.width) || 210,
                            parseFloat(agendaEditStyles.height) || 297
                        ],
                        orientation: agendaEditStyles.orientation || "portrait"
                    },
                    lineHeight: 0,
                    fontSize: 12,
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                })
                .toPdf()
                .get('pdf')
                .then((pdf) => {
                    // Convert the watermark image to a base64 string
                    const img = new Image();
                    img.src = waterMarkText;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.globalAlpha = 0.1;
                        ctx.drawImage(img, 0, 0);
                        const watermarkImage = canvas.toDataURL('image/png');

                        // Add QR code image
                        const qrImg = new Image();
                        qrImg.src = imageUrl; // QR code image URL
                        qrImg.onload = () => {
                            const qrCanvas = document.createElement('canvas');
                            qrCanvas.width = qrImg.width;
                            qrCanvas.height = qrImg.height;
                            const qrCtx = qrCanvas.getContext('2d');
                            qrCtx.drawImage(qrImg, 0, 0);
                            const qrCodeImage = qrCanvas.toDataURL('image/png');

                            // Add page numbers, watermark, and QR code to each page
                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                            // Return the boolean indicating if the document has more than one page
                            const isMultiPage = pdf.internal.getNumberOfPages() > 1;
                            resolve(isMultiPage);
                        };
                    };
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const handleBulkPrint = async () => {
        if (headerOptions === "Please Select Print Options") {
            setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setLoadingGeneratingDatas(true)

            await Promise.all(selectedRows?.map(async (item) => {
                setBulkPrintStatus(true)
                let response = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await getUpdatePrintingStatus(item, response?.data?.sdocumentPreparation?.updatedby)

                setLoadingGeneratingMessage("Printing the set the Documents..!")


                const pdfElement = document.createElement("div");
                pdfElement.innerHTML = response?.data?.sdocumentPreparation?.document;


                // Add custom styles to the PDF content
                const styleElement = document.createElement("style");
                styleElement.textContent = `
   .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
   .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
   .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
   .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
   .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
   .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
   .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
   .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
   .ql-align-right { text-align: right; } 
   .ql-align-left { text-align: left; } 
   .ql-align-center { text-align: center; } 
   .ql-align-justify { text-align: justify; } 
 `;

                pdfElement.appendChild(styleElement);

                // pdfElement.appendChild(styleElement);
                const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
                    const totalPages = doc.internal.getNumberOfPages();
                    const margin = 15; // Adjust as needed
                    const footerHeight = 15; // Adjust as needed
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const pageHeight = doc.internal.pageSize.getHeight();

                        // Add header
                        doc.setFontSize(12);
                        // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
                        const headerImgWidth = pageWidth * 0.95; // Adjust as needed
                        const headerImgHeight = pageHeight * 0.09;// Adjust as needed
                        //const headerX = (pageWidth - headerImgWidth) / 2;
                        // const headerY = 6; // Adjust as needed for header position
                        const headerX = 5; // Start from the left
                        const headerY = 3.5; // Start from the top
                        doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                        const imgWidth = pageWidth * 0.50; // 75% of page width
                        const imgHeight = pageHeight * 0.25; // 50% of page height
                        const x = (pageWidth - imgWidth) / 2;
                        const y = (pageHeight - imgHeight) / 2 - 20;
                        doc.setFillColor(0, 0, 0, 0.1);
                        doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                        // Add footer
                        doc.setFontSize(10);
                        // doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                        // Add footer image stretched to page width
                        const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
                        const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
                        const footerX = 5; // Start from the left
                        const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
                        doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                        if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
                            const textY = footerY - 3;
                            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                        } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                            const textY = footerY - 3;
                            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                        }
                        // Add QR code and statement only on the last page

                        if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
                            if (i === totalPages) {
                                // Add QR code in the left corner
                                const qrCodeWidth = 25; // Adjust as needed
                                const qrCodeHeight = 25; // Adjust as needed
                                const qrCodeX = footerX; // Left corner
                                const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
                                doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



                                // Add statement on the right of the QR code
                                const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                                const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                                const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                                const statementY3 = statementY2 + 5; // Adjust as needed for spacing



                                // Add statements
                                const statementText1 = '1. Scan to verify the authenticity of this document.';
                                const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                                const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                                doc.setFontSize(12);
                                doc.text(statementText1, statementX, statementY1);
                                doc.text(statementText2, statementX, statementY2);
                                doc.text(statementText3, statementX, statementY3);
                                // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
                            }
                        }
                    }
                };

                // Convert the HTML content to PDF
                // Convert the HTML content to PDF
                html2pdf()
                    .from(pdfElement)
                    .set({
                        margin: response.data.sdocumentPreparation?.pagesize == "A3"
                            ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                                : (head === "" && foot !== "") ? [20, 15, 45, 15]
                                    : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                        [20, 15, 20, 15])

                            :
                            ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                                : (head === "" && foot !== "") ? [15, 15, 45, 15]
                                    : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: {
                            unit: "mm",
                            format: [
                                parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                                parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                            ],
                            orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                        },
                        lineHeight: 0, // Increased line spacing
                        fontSize: 12,
                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                    }).toPdf().get('pdf').then((pdf) => {
                        // Convert the watermark image to a base64 string
                        const img = new Image();
                        img.src = response?.data?.sdocumentPreparation?.watermark;
                        img.onload = () => {
                            const canvas = document?.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.globalAlpha = 0.1;
                            ctx.drawImage(img, 0, 0);
                            const watermarkImage = canvas.toDataURL('image/png');

                            // Add QR code image
                            const qrImg = new Image();
                            qrImg.src = response?.data?.sdocumentPreparation?.qrcode; // QR code image URL
                            if (response?.data?.sdocumentPreparation?.qrcode) {
                                qrImg.onload = () => {
                                    const qrCanvas = document.createElement('canvas');
                                    qrCanvas.width = qrImg.width;
                                    qrCanvas.height = qrImg.height;
                                    const qrCtx = qrCanvas.getContext('2d');
                                    qrCtx.drawImage(qrImg, 0, 0);
                                    const qrCodeImage = qrCanvas.toDataURL('image/png');

                                    // Add page numbers and watermark to each page
                                    addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                                    // Save the PDF
                                    pdf.save(`${response?.data?.sdocumentPreparation?.template}.pdf`);
                                    setBulkPrintStatus(false)
                                    handleClickCloseLetterHead();
                                };
                            } else {
                                addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                                // Save the PDF
                                pdf.save(`${response?.data?.sdocumentPreparation?.template}.pdf`);
                                setBulkPrintStatus(false)
                                // pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                                handleClickCloseLetterHead();
                            }

                        };
                    });
            }))

            await fetchBrandMaster();
            setLoadingGeneratingDatas(false)
            setChanged("dsdss")
            handleCloseBulkModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
        }
    };


    const downloadPdfTesdtTable = async (e) => {

        if (headerOptions === "Please Select Print Options") {
            setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            // Create a new div element to hold the Quill content
            let response = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await getUpdatePrintingStatus(response.data.sdocumentPreparation?._id, response.data.sdocumentPreparation?.updatedby)
            const pdfElement = document.createElement("div");
            pdfElement.innerHTML = response.data.sdocumentPreparation.document;
            // Add custom styles to the PDF content
            const styleElement = document.createElement("style");
            styleElement.textContent = `
     .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
     .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
     .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
     .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
     .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
     .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
     .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
     .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
     .ql-align-right { text-align: right; } 
     .ql-align-left { text-align: left; } 
     .ql-align-center { text-align: center; } 
     .ql-align-justify { text-align: justify; } 
   `;

            pdfElement.appendChild(styleElement);

            // pdfElement.appendChild(styleElement);
            const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    doc.setFontSize(12);
                    const headerImgWidth = pageWidth * 0.95;
                    const headerImgHeight = pageHeight * 0.09;
                    const headerX = 5;
                    const headerY = 3.5;
                    doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                    const imgWidth = pageWidth * 0.50;
                    const imgHeight = pageHeight * 0.25;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2 - 20;
                    doc.setFillColor(0, 0, 0, 0.1);
                    doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                    doc.setFontSize(10);
                    const footerImgWidth = pageWidth * 0.95;
                    const footerImgHeight = pageHeight * 0.067;
                    const footerX = 5;
                    const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
                    doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                    if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }

                    if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
                        if (i === totalPages) {
                            const qrCodeWidth = 25; // Adjust as needed
                            const qrCodeHeight = 25; // Adjust as needed
                            const qrCodeX = footerX; // Left corner
                            const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
                            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



                            // Add statement on the right of the QR code
                            const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                            const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                            const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                            const statementY3 = statementY2 + 5; // Adjust as needed for spacing



                            // Add statements
                            const statementText1 = '1. Scan to verify the authenticity of this document.';
                            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                            const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                            doc.setFontSize(12);
                            doc.text(statementText1, statementX, statementY1);
                            doc.text(statementText2, statementX, statementY2);
                            doc.text(statementText3, statementX, statementY3);
                            // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
                        }
                    }
                }
            };

            // Convert the HTML content to PDF
            html2pdf()
                .from(pdfElement)
                .set({
                    margin: response?.data?.sdocumentPreparation?.pagesize == "A3"
                        ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                            : (head === "" && foot !== "") ? [20, 15, 45, 15]
                                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                    [20, 15, 20, 15])

                        :
                        ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                            : (head === "" && foot !== "") ? [15, 15, 45, 15]
                                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: {
                        unit: "mm",
                        format: [
                            parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                            parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                        ],
                        orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                    },
                    lineHeight: 0, // Increased line spacing
                    fontSize: 12,
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                }).toPdf().get('pdf').then((pdf) => {
                    // Convert the watermark image to a base64 string
                    const img = new Image();
                    img.src = response?.data?.sdocumentPreparation?.watermark;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.globalAlpha = 0.1;
                        ctx.drawImage(img, 0, 0);
                        const watermarkImage = canvas.toDataURL('image/png');

                        // Add QR code image
                        const qrImg = new Image();
                        qrImg.src = response.data.sdocumentPreparation?.qrcode; // QR code image URL
                        if (response.data.sdocumentPreparation?.qrCodeNeed) {
                            qrImg.onload = () => {
                                const qrCanvas = document.createElement('canvas');
                                qrCanvas.width = qrImg.width;
                                qrCanvas.height = qrImg.height;
                                const qrCtx = qrCanvas.getContext('2d');
                                qrCtx.drawImage(qrImg, 0, 0);
                                const qrCodeImage = qrCanvas.toDataURL('image/png');

                                // Add page numbers and watermark to each page
                                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                                // Save the PDF
                                const pdfBlob = pdf.output('blob');
                                const pdfUrl = URL.createObjectURL(pdfBlob);
                                const printWindow = window.open(pdfUrl);
                                // pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                                handleClickCloseLetterHead();
                            };
                        }
                        else {
                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                            // Save the PDF
                            const pdfBlob = pdf.output('blob');
                            const pdfUrl = URL.createObjectURL(pdfBlob);
                            const printWindow = window.open(pdfUrl);
                            // pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                            handleClickCloseLetterHead();
                        }

                    };
                });

        }
    };


    const downloadPdfTesdtTablePrint = async (e) => {
        if (headerOptions === "Please Select Print Options") {
            setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            handleClickCloseLetterHead();
            setLoadingGeneratingDatas(true)
            // Create a new div element to hold the Quill content
            let response = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await getUpdatePrintingStatus(response.data.sdocumentPreparation?._id, response.data.sdocumentPreparation?.updatedby)
            const pdfElement = document.createElement("div");
            pdfElement.innerHTML = response.data.sdocumentPreparation.document;
            // Add custom styles to the PDF content
            const styleElement = document.createElement("style");
            styleElement.textContent = `
         .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
         .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
         .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
         .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
         .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
         .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
         .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
         .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
         .ql-align-right { text-align: right; } 
         .ql-align-left { text-align: left; } 
         .ql-align-center { text-align: center; } 
         .ql-align-justify { text-align: justify; } 
       `;

            pdfElement.appendChild(styleElement);

            // pdfElement.appendChild(styleElement);
            const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    doc.setFontSize(12);
                    const headerImgWidth = pageWidth * 0.95;
                    const headerImgHeight = pageHeight * 0.09;
                    const headerX = 5;
                    const headerY = 3.5;
                    doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                    const imgWidth = pageWidth * 0.50;
                    const imgHeight = pageHeight * 0.25;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2 - 20;
                    doc.setFillColor(0, 0, 0, 0.1);
                    doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                    doc.setFontSize(10);
                    const footerImgWidth = pageWidth * 0.95;
                    const footerImgHeight = pageHeight * 0.067;
                    const footerX = 5;
                    const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
                    doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                    if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }

                    if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
                        if (i === totalPages) {
                            const qrCodeWidth = 25; // Adjust as needed
                            const qrCodeHeight = 25; // Adjust as needed
                            const qrCodeX = footerX; // Left corner
                            const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
                            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



                            // Add statement on the right of the QR code
                            const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                            const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                            const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                            const statementY3 = statementY2 + 5; // Adjust as needed for spacing



                            // Add statements
                            const statementText1 = '1. Scan to verify the authenticity of this document.';
                            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                            const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                            doc.setFontSize(12);
                            doc.text(statementText1, statementX, statementY1);
                            doc.text(statementText2, statementX, statementY2);
                            doc.text(statementText3, statementX, statementY3);
                            // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
                        }
                    }
                }
            };

            // Convert the HTML content to PDF
            html2pdf()
                .from(pdfElement)
                .set({
                    margin: response?.data?.sdocumentPreparation?.pagesize == "A3"
                        ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                            : (head === "" && foot !== "") ? [20, 15, 45, 15]
                                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                    [20, 15, 20, 15])

                        :
                        ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                            : (head === "" && foot !== "") ? [15, 15, 45, 15]
                                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: {
                        unit: "mm",
                        format: [
                            parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                            parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                        ],
                        orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                    },
                    lineHeight: 0, // Increased line spacing
                    fontSize: 12,
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                }).toPdf().get('pdf').then((pdf) => {
                    // Convert the watermark image to a base64 string
                    const img = new Image();
                    img.src = response?.data?.sdocumentPreparation?.watermark;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.globalAlpha = 0.1;
                        ctx.drawImage(img, 0, 0);
                        const watermarkImage = canvas.toDataURL('image/png');

                        // Add QR code image
                        const qrImg = new Image();
                        qrImg.src = response.data.sdocumentPreparation?.qrcode; // QR code image URL
                        if (response.data.sdocumentPreparation?.qrCodeNeed) {
                            qrImg.onload = () => {
                                const qrCanvas = document.createElement('canvas');
                                qrCanvas.width = qrImg.width;
                                qrCanvas.height = qrImg.height;
                                const qrCtx = qrCanvas.getContext('2d');
                                qrCtx.drawImage(qrImg, 0, 0);
                                const qrCodeImage = qrCanvas.toDataURL('image/png');

                                // Add page numbers and watermark to each page
                                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                                // // Save the PDF
                                // const pdfBlob = pdf.output('blob');
                                // const pdfUrl = URL.createObjectURL(pdfBlob);
                                // const printWindow = window.open(pdfUrl);
                                pdf.save(`${response.data.sdocumentPreparation?.template}.pdf`);
                                handleClickCloseLetterHead();
                                setLoadingGeneratingDatas(false)
                            };
                        }
                        else {
                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                            // // Save the PDF
                            // const pdfBlob = pdf.output('blob');
                            // const pdfUrl = URL.createObjectURL(pdfBlob);
                            // const printWindow = window.open(pdfUrl);
                            pdf.save(`${response.data.sdocumentPreparation?.template}.pdf`);

                            setLoadingGeneratingDatas(false)
                        }

                    };
                });

        }
    };


    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DELETE_DOCUMENTPREPARATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationDelete(res?.data?.sdocumentPreparation);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let brandid = documentPreparationDelete?._id;
    const delBrand = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${brandid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchBrandMaster();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendRequestManual = async () => {
        setBtnLoad(true)
        const constAuotId = await fetchAllRaisedTickets();
        let prefixLength = Number(constAuotId[1]) + 1;
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ?
            `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ?
                `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}`
                    : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` :
                        prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString;

        let newval = employeeControlPanel ? uniqueCode + "#" + templateCreationValue?.tempcode + "_" + postfixLength :
            "Man" + "#" + ((templateCreationValue?.tempcode === "" || templateCreationValue?.tempcode === undefined) ? ""
                : templateCreationValue?.tempcode) + "_" + postfixLength;

        let newvalRefNo = `CDP_${postfixLength}`;

        const pdfElement = document.createElement("div");

        pdfElement.innerHTML = checking;
        let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
      <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;;" />
      ` : "")
            .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
        <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
    <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
  ` : "")
            .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
    <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
         ` : "")
        pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
        setPageName(!pageName);
        try {
            let brandCreate = await axios.post(SERVICE.CREATE_COMPANY_DOCUMENT_PREPARATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: String(date),
                template: String(documentPrepartion.template),
                referenceno: newvalRefNo,
                tempcode: templateCreationValue?.tempcode,
                templateno: newval,
                issuingauthority: String(documentPrepartion.issuingauthority),
                pagenumberneed: String(documentPrepartion.pagenumberneed),
                company: String(documentPrepartion.company),
                tocompany: String(documentPrepartion.tocompany),
                tocompanyaddress: toCompanyAddress,
                branch: String(documentPrepartion.branch),
                proption: String(documentPrepartion.proption),
                watermark: waterMarkText,
                pageheight: agendaEditStyles.height,
                pagewidth: agendaEditStyles.width,
                headvalue: headvalue,
                pagesize: pageSizePdf,
                head: "",
                foot: "",
                qrCodeNeed: qrCodeNeed,
                sign: documentPrepartion.signature,
                sealing: documentPrepartion.seal,
                printingstatus: "Not-Printed",
                signature: signature,
                seal: sealPlacement,
                qrcode: imageUrl,
                issuedpersondetails: String(isUserRoleAccess.companyname),
                document: findMethod,
                frommailemail: fromEmail,
                // mail: "Send",
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
            setSearchQuery("")
            //   setTemplateCreation(brandCreate.data);
            await fetchBrandMaster();
            handleCloseInfoImageManual();
            setDocumentPrepartion({
                ...documentPrepartion,
            });
            setBtnLoad(false)
            handleCloseInfoImage();
            setChecking("");
            setEmployeeControlPanel("")
            setEmployeeValue([])
            window.scrollTo(0, 0)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtnLoad(false)
        } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));



    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const [first, second, third] = moment(new Date()).format("DD-MM-YYYY hh:mm a")?.split(" ")
        const vasr = `${first}_${second}_${third}`
        setDateFormat(vasr)
        const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion?.template?.toLowerCase() && moment(item?.date).format("DD-MM-YYYY") === moment(date).format("DD-MM-YYYY"));
        if ((documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
            setPopupContentMalert("Please Select Template Name!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.tocompany === "" || documentPrepartion.tocompany === "Please Select To Company") {
            setPopupContentMalert("Please Select To Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.issuingauthority === "" || documentPrepartion.issuingauthority === "Please Select Issuing Authority") {
            setPopupContentMalert("Please Select Issuing Authority!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((signatureStatus === "With") && (documentPrepartion.signature === "" || documentPrepartion.signature === "Please Select Signature")) {
            setPopupContentMalert("Please Select Signature!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((sealStatus !== 'None' && sealStatus !== "" && signatureContent?.seal !== "None") && (documentPrepartion.seal === "" || documentPrepartion.seal === "Please Select Seal")) {
            setPopupContentMalert("Please Select Seal!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (isNameMatch) {
            setPopupContentMalert("Document with Template Name and Date already exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            answer();
        }
    };


    const handleSubmitedManual = (e) => {
        e.preventDefault();
        const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && moment(item?.date).format("DD-MM-YYYY") === moment(date).format("DD-MM-YYYY"));
        if ((documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
            setPopupContentMalert("Please Select Template Name!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (isNameMatch) {
            setPopupContentMalert("Document with Template Name And Date already exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (checking === "") {
            setPopupContentMalert("Document is Empty!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if ((checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0)) {
            setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            setBtnLoad(true)
            downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {
                setBtnLoad(true)

                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoading(false)
                    setPopupContentMalert(`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
              ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {
                    setBtnLoad(false)
                    handleClickOpenInfoImageManual();
                }
            }).catch((error) => {
                console.error('Error generating PDF:', error);
            })

        }
    };
    const regex = /\$[A-Z]+\$/g;


    const handleclearedManual = (e) => {
        e.preventDefault();
        setGenerateData(false)
        setDocumentPrepartion({
            date: "", template: "Please Select Template Name",
            referenceno: "", templateno: "",
            pagenumberneed: "All Pages",
            department: "Please Select Department",
            company: "Please Select Company",
            branch: "Please Select Branch",
            tocompany: "Please Select To Company",
            proption: "Please Select Print Option",
            issuingauthority: "Please Select Issuing Authority",
            sort: "Please Select Sort",
            attendancedate: "",
            attendancemonth: "Please Select Attendance Month",
            attendanceyear: "Please Select Attendance Year",
            productiondate: "",
            productionmonth: "Please Select Production Month",
            productionyear: "Please Select Production Year",
            signature: "Please Select Signature",
            seal: "Please Select Seal",
            pagesize: "Please Select pagesize",
            print: "Please Select Print Option",
            heading: "Please Select Header Option",
            issuedpersondetails: "",
        });
        setHeadValue([])
        setSelectedHeadOpt([])
        setHeader("")
        setCheckingArray([])
        setIndexViewQuest(1)
        setfooter("")
        setSealStatus("")
        setSignatureStatus("")
        setCompanyName("")
        setIssuingAutholrity([])
        setDepartmentCheck(false);
        setButtonLoading(false)
        setBtnLoad(false)
        setBranchOptions([]);
        setChecking("");
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };


    //get all brand master name.
    const fetchBrandMaster = async () => {

        const accessbranchs = accessbranch
            ? accessbranch.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }))
            : [];

        setPageName(!pageName);
        try {
            setLoader(true);
            let res_freq = await axios.post(`${SERVICE.ACCESSIBLEBRANCHALL_COMPANY_DOCUMENTPREPARATION}`, {
                assignbranch: accessbranchs
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_freq?.data?.companydocumentPreparation?.length > 0 ? res_freq?.data?.companydocumentPreparation?.filter(data => data?.printingstatus === "Not-Printed")?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
            })) : [];
            setTemplateCreationArrayCreate(answer);
            setTemplateCreationArray(res_freq?.data?.overalldocuments);
            setAutoId(res_freq?.data?.overalldocuments);
            setChanged(`ChangedStatus${res_freq?.data?.overalldocuments?.length}`)
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        TemplateDropdowns();
        CompanyDropDowns();
        fetchBrandMaster();
    }, []);
    useEffect(() => {
        fetchBrandMaster();
    }, [Changed]);

    const delAreagrpcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_COMPANY_DELETE_DOCUMENTPREPARATION}/${item}`, {
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
            setPage(1);
            await fetchBrandMaster();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setAgendaEdit("");
        setUpdateGen(true)
    };

    //get single row to edit....
    const getUpdatePrintingStatus = async (e, update) => {
        setPageName(!pageName);
        try {

            let response = await axios.post(SERVICE.FILTER_DOCUMENT_USER_LOGIN, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                person: isUserRoleAccess.companyname,
            });
            if (response?.data?.user) {


                let res = await axios.put(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    printingstatus: "Printed",
                    $inc: { printedcount: 1 },
                    updatedby: update ? [...update, {
                        name: isUserRoleAccess.companyname,
                        date: new Date(),
                    }] : []
                });
                // await fetchBrandMaster();
                setChanged(e)
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchEmailForUser = async (e, emailformat, fromemail, ccemail, bccemail) => {
        setLoading(true);
        setLoadingMessage('Document is preparing...');
        let response = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });


        const tempElementEmail = document?.createElement("div");
        tempElementEmail.innerHTML = emailformat;
        let textedEmail = tempElementEmail.innerHTML;
        let findMethodEmail = textedEmail
            .replaceAll("$TEMPLATENAME$", response.data.sdocumentPreparation?.template ? response.data.sdocumentPreparation?.template : "")
            .replaceAll("$REFERENCEID$", response.data.sdocumentPreparation?.templateno ? response.data.sdocumentPreparation?.templateno : "")
            .replaceAll("$CANDIDATENAME$", response.data.sdocumentPreparation?.person ? response.data.sdocumentPreparation?.person : "")
            .replaceAll("$COMPANYNAME$", isUserRoleAccess?.companyname ? isUserRoleAccess?.companyname : "")
            .replaceAll("$DESIGNATION$", isUserRoleAccess?.designation ? isUserRoleAccess?.designation : "")
            .replaceAll("$COMPANY$", isUserRoleAccess?.company ? isUserRoleAccess?.company : "");

        const pdfElement = document.createElement("div");
        pdfElement.innerHTML = response.data.sdocumentPreparation.document;

        const styleElement = document.createElement("style");
        styleElement.textContent = `
        .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
        .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
        .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
        .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
        .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
        .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
        .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
        .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
        .ql-align-right { text-align: right; } 
        .ql-align-left { text-align: left; } 
        .ql-align-center { text-align: center; } 
        .ql-align-justify { text-align: justify; } 
      `;
        pdfElement.appendChild(styleElement);

        // pdfElement.appendChild(styleElement);
        const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();
            const margin = 15; // Adjust as needed
            const footerHeight = 15; // Adjust as needed
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                // Add header
                doc.setFontSize(12);
                // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
                const headerImgWidth = pageWidth * 0.95; // Adjust as needed
                const headerImgHeight = pageHeight * 0.09;// Adjust as needed
                //const headerX = (pageWidth - headerImgWidth) / 2;
                // const headerY = 6; // Adjust as needed for header position
                const headerX = 5; // Start from the left
                const headerY = 3.5; // Start from the top
                doc.addImage(response.data.sdocumentPreparation.head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                const imgWidth = pageWidth * 0.50; // 75% of page width
                const imgHeight = pageHeight * 0.25; // 50% of page height
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2 - 20;
                doc.setFillColor(0, 0, 0, 0.1);
                doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
                // Add footer
                doc.setFontSize(10);
                // doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                // Add footer image stretched to page width
                const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
                const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
                const footerX = 5; // Start from the left
                const footerY = (pageHeight * 1) - footerImgHeight - 5;
                doc.addImage(response?.data?.sdocumentPreparation?.foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
                    const textY = footerY - 3;
                    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                    const textY = footerY - 3;
                    doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                }
                // Add QR code and statement only on the last page

                if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
                    if (i === totalPages) {
                        // Add QR code in the left corner
                        const qrCodeWidth = 25; // Adjust as needed
                        const qrCodeHeight = 25; // Adjust as needed
                        const qrCodeX = footerX; // Left corner
                        const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
                        doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



                        // Add statement on the right of the QR code
                        const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                        const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                        const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                        const statementY3 = statementY2 + 5; // Adjust as needed for spacing



                        // Add statements
                        const statementText1 = '1. Scan to verify the authenticity of this document.';
                        const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                        const statementText3 = response?.data?.sdocumentPreparation?.frommailemail ? `3. For questions, contact us at ${response?.data?.sdocumentPreparation?.frommailemail}.` : "";

                        doc.setFontSize(12);
                        doc.text(statementText1, statementX, statementY1);
                        doc.text(statementText2, statementX, statementY2);
                        doc.text(statementText3, statementX, statementY3);
                        // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
                    }
                }
            }
        };


        return new Promise((resolve, reject) => {
            html2pdf()
                .from(pdfElement)
                .set({
                    margin: response.data.sdocumentPreparation?.pagesize == "A3"
                        ? ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [45, 15, 45, 15]
                            : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [20, 15, 45, 15]
                                : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 20, 15] :
                                    [20, 15, 20, 15])

                        :
                        ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [30, 15, 45, 15]
                            : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [15, 15, 45, 15]
                                : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: {
                        unit: "mm",
                        format: [
                            parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                            parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                        ],
                        orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                    },
                    lineHeight: 0, // Increased line spacing
                    fontSize: 12,
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                }).toPdf().get('pdf').then(async (pdf) => {
                    const img = new Image();
                    img.src = response.data.sdocumentPreparation?.watermark;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.globalAlpha = 0.1;
                        ctx.drawImage(img, 0, 0);
                        const watermarkImage = canvas.toDataURL('image/png');

                        const qrImg = new Image();
                        qrImg.src = response.data.sdocumentPreparation?.qrcode;
                        qrImg.onload = () => {
                            const qrCanvas = document.createElement('canvas');
                            qrCanvas.width = qrImg.width;
                            qrCanvas.height = qrImg.height;
                            const qrCtx = qrCanvas.getContext('2d');
                            qrCtx.drawImage(qrImg, 0, 0);
                            const qrCodeImage = qrCanvas.toDataURL('image/png');

                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                            // Convert the PDF to a Blob
                            const pdfBlob = pdf.output('blob');

                            // Create FormData and append the PDF Blob
                            const formData = new FormData();
                            formData.append('file', pdfBlob, `${response.data.sdocumentPreparation?.template}.pdf`);

                            // Convert Blob to base64 string
                            const reader = new FileReader();
                            reader.readAsDataURL(pdfBlob);
                            reader.onloadend = async () => {
                                setLoadingMessage('Document is converting to Email format...');
                                const base64String = reader.result.split(',')[1]; // Extract base64 string without data:image/jpeg;base64,

                                let res_module = await axios.post(SERVICE.DOCUMENT_PREPARATION_MAIL, {
                                    document: base64String,
                                    companyname: response?.data?.sdocumentPreparation?.person,
                                    letter: response?.data?.sdocumentPreparation?.template,
                                    email: response?.data?.sdocumentPreparation?.email,
                                    emailformat: findMethodEmail,
                                    fromemail: fromemail,
                                    ccemail: ccemail,
                                    bccemail: bccemail,
                                    tempid: response?.data?.sdocumentPreparation?.templateno

                                }, {
                                    headers: {
                                        Authorization: `Bearer ${auth.APIToken}`,
                                    },
                                });
                                setLoadingMessage('Email is Sending...');
                                if (res_module.status === 200) {
                                    setLoading(false)
                                    NotificationManager.success('Email Sent Successfully 👍', '', 2000);
                                } else {
                                    setLoading(false)
                                }

                                resolve(base64String);
                            };


                        };
                    };
                    if (response?.data?.sdocumentPreparation?.mail === "Send") {
                        let res = await axios.put(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            mail: "Re-send",
                        });
                        await fetchBrandMaster();
                    }

                }).catch(err => {
                    setLoading(false)
                    reject(err)
                });
        });
    };



    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //frequency master name updateby edit page...
    let updateby = documentPreparationEdit?.updatedby;
    let addedby = documentPreparationEdit?.addedby;
    let frequencyId = documentPreparationEdit?._id;

    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Company Documents Preparation.png");
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
        documentTitle: "Company Documents Preparation",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
    };
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

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );



    const getCode = async (e, pagename) => {
        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: e?.company,
                branch: e?.branch,
            });
            if (res?.data?.templatecontrolpanel) {
                const ans = res?.data?.templatecontrolpanel ?
                    res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
                setPersonId(ans);
                handleClickOpenLetterHeader(pagename);
                setDataTableId(e?.id);
            }

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert)
        }
    };
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
            pinned: "left",
            //lockPinned: true,
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
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "referenceno",
            headerName: "Reference No",
            flex: 0,
            width: 100,
            hide: !columnVisibility.referenceno,
            headerClassName: "bold-header",
        },
        {
            field: "templateno",
            headerName: "Template No",
            flex: 0,
            width: 100,
            hide: !columnVisibility.templateno,
            headerClassName: "bold-header",
        },
        {
            field: "template",
            headerName: "Template",
            flex: 0,
            width: 150,
            hide: !columnVisibility.template,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 80,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 80,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "tocompany",
            headerName: "To Company",
            flex: 0,
            width: 80,
            hide: !columnVisibility.tocompany,
            headerClassName: "bold-header",
        },

        {
            field: "document",
            headerName: "Documents",
            flex: 0,
            width: 250,
            minHeight: "40px",
            hide: !columnVisibility.document,
            cellRenderer: (params) => (
                <Grid>
                    {/* {params.data?.approval === "Approved" && */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            getCode(params?.data, "Table View")
                        }}

                    >
                        View
                    </Button>
                    &ensp;
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#FF9800",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#E68900",
                            },
                        }}

                        onClick={() => {
                            getCode(params?.data, "Table Print")
                        }}
                    >
                        Print
                    </Button>

                </Grid>
            ),
        },
        {
            field: "printingstatus",
            headerName: "Printing Status",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.printingstatus,

        },

        {
            field: "issuedpersondetails",
            headerName: "Issued Person Details",
            flex: 0,
            width: 100,
            hide: !columnVisibility.issuedpersondetails,
            headerClassName: "bold-header",
        },
        {
            field: "issuingauthority",
            headerName: "Issuing Authority",
            flex: 0,
            width: 100,
            hide: !columnVisibility.issuingauthority,
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
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {isUserRoleCompare?.includes("edocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
                    {isUserRoleCompare?.includes("dcompanydocumentpreparation") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcompanydocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("icompanydocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
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
            date: item.date,
            referenceno: item.referenceno,
            templateno: item.templateno,
            template: item.template,
            mail: item.mail,
            printingstatus: item.printingstatus,
            company: item.company === "Please Select Company" ? "" : item.company,
            tocompany: item.tocompany === "Please Select To Company" ? "" : item.tocompany,
            branch: item.branch === "Please Select Branch" ? "" : item.branch,
            issuedpersondetails: item.issuedpersondetails,
            issuingauthority: item.issuingauthority,
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
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

    let newvalues = employeeControlPanel
        ? value + "_" + `000${checkingArray?.length === 0 ? 1 : (checkingArray?.length + 1)}` : "Man" + "#" + ((templateCreationValue?.tempcode === "" || templateCreationValue?.tempcode === undefined) ? ""
            : templateCreationValue?.tempcode) + "_" + "0001";

    return (
        <Box>
            <Headtitle title={"COMPANY DOCUMENT PREPARATION"} />
            {/* ****** Header Content ****** */}
            <PageHeading title="Company Document Preparation" modulename="Human Resources" submodulename="HR Documents" mainpagename="Company Documents" subpagename="Company Document Preparation" subsubpagename="" />

            <>
                {isUserRoleCompare?.includes("acompanydocumentpreparation") && (


                    <Box sx={userStyle.selectcontainer}>
                        <Typography>
                            Add Company Document Preparation
                        </Typography>
                        <br /> <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={moment(date).format("DD-MM-YYYY")} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={CompanyOptions}
                                            value={{ label: documentPrepartion.company, value: documentPrepartion.company }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    template: "Please Select Template Name",
                                                    tocompany: "Please Select To Company",
                                                });
                                                BranchDropDowns(e.value)
                                                setToCompanyAddressData("");
                                                setToCompanyOptions([]);
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
                                            maxMenuHeight={300}
                                            options={BranchOptions}
                                            value={{ label: documentPrepartion.branch, value: documentPrepartion.branch }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    branch: e.value,
                                                    template: "Please Select Template Name",
                                                    tocompany: "Please Select To Company",
                                                });
                                                fetchIsssuingAuthorityManual(e.value)
                                                setBranchAddress(e)
                                                IdentifyUserCode(e)
                                                setToCompanyAddressData("");
                                                setToCompanyOptions([]);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Template <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={templateValues.filter((data) => { return data.company === documentPrepartion.company && data.branch === documentPrepartion.branch })}
                                            value={{ label: documentPrepartion.template, value: documentPrepartion.template }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    template: e.value,
                                                    sign: "Please Select Signature",
                                                    sealing: "Please Select Seal",
                                                    tocompany: "Please Select To Company",

                                                });
                                                setSealPlacement("")
                                                setSignature("")
                                                setChecking("")
                                                setTemplateCreationValue(e)
                                                TemplateDropdownsValue(documentPrepartion?.company, documentPrepartion?.branch, e)
                                                setSignatureStatus("")
                                                setSealStatus("")
                                                setCheckingArray([])
                                                setIndexViewQuest(1)
                                                setToCompanyAddressData("");


                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            To Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={toCompanyOptions}
                                            value={{ label: documentPrepartion.tocompany, value: documentPrepartion.tocompany }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    tocompany: e.value,
                                                });
                                                setToCompanyAddressData(e?.toAddress)
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Issuing Authority<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={issuingauthority}
                                            isDisabled={checkingArray?.length > 0}
                                            value={{ label: documentPrepartion.issuingauthority, value: documentPrepartion.issuingauthority }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    issuingauthority: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {(signatureStatus === "With") && <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Signature<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={companyName?.documentsignature?.map(data => ({
                                                ...data,
                                                label: `${data.signaturename} -- ${data.employee}`,
                                                value: `${data.signaturename} -- ${data.employee}`
                                            }))}
                                            value={{ label: documentPrepartion.signature, value: documentPrepartion.signature }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    signature: e.value,
                                                    seal: "Please Select Seal"
                                                });
                                                setSignature(e?.document[0]?.preview)
                                                setSignatureContent(e)
                                                setSealPlacement("")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>}
                                {(sealStatus !== 'None' && sealStatus !== "") &&
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Seal<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={companyName?.documentseal?.map(data => ({
                                                    ...data,
                                                    label: `${data.seal} -- ${data.name}`,
                                                    value: `${data.seal} -- ${data.name}`
                                                }))}
                                                value={{ label: documentPrepartion.seal, value: documentPrepartion.seal }}
                                                onChange={(e) => {
                                                    setDocumentPrepartion({
                                                        ...documentPrepartion,
                                                        seal: e.value,
                                                    });

                                                    setSealPlacement(e?.document[0]?.preview)
                                                }}
                                            />

                                        </FormControl>
                                    </Grid>}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Page Number<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={[{ label: "All Pages", value: "All Pages" }, { label: "End Page", value: "End Page" }, { label: "No Need", value: "No Need" }]}
                                            value={{ label: documentPrepartion.pagenumberneed, value: documentPrepartion.pagenumberneed }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    pagenumberneed: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        {/* <Typography variant="h6">QR Code</Typography> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                    checked={qrCodeNeed}
                                                    onChange={() => setQrCodeNeed((val) => !val)}
                                                    color="primary"
                                                />
                                            }
                                            // sx={{marginTop: 1}}
                                            label="QR Code"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        {/* <Typography variant="h6">QR Code</Typography> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                                                    checked={toCompanyAddress}
                                                    onChange={() => setToCompanyAddress((val) => !val)}
                                                    color="primary"
                                                />
                                            }

                                            label="From Company Address"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>

                                </Grid>
                                <Grid item md={12} xs={12} sm={12}></Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        Generate
                                    </Button>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Document <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <ReactQuill style={{ height: "max-content", minHeight: "150px" }}
                                            value={checking}
                                            onChange={setChecking}
                                            modules={{
                                                toolbar: [[{ header: "1" }, { header: "2" },
                                                { font: [] }], ["tab"], [{ size: [] }],
                                                ["bold", "italic", "underline", "strike", "blockquote"],
                                                [{ align: [] }],
                                                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                                ["link", "image", "video"], ["clean"]]
                                            }}
                                            formats={["header", "font", "size", "bold", "italic", "underline", "strike", "align", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <div>
                                {/* <QRCode value={generateRedirectUrl()} /> */}

                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    {checking ? (
                                        <LoadingButton
                                            loading={buttonLoadingPreview}
                                            variant="contained"
                                            color="primary"
                                            sx={userStyle.buttonadd}
                                            // onClick={handlePreviewDocumentManual}
                                            onClick={() => handleClickOpenLetterHeader("Preview")}
                                        >
                                            Preview
                                        </LoadingButton>
                                    ) : (
                                        ""
                                    )}
                                </Grid>
                                &ensp;
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    {checking ? (
                                        <LoadingButton
                                            loading={buttonLoading}
                                            variant="contained"
                                            color="primary"
                                            sx={userStyle.buttonadd}
                                            // onClick={getDownloadFile}
                                            // onClick={handlePrintDocumentManual}
                                            onClick={() => handleClickOpenLetterHeader("Print")}

                                        >
                                            Print
                                        </LoadingButton>
                                    ) : (
                                        ""
                                    )}
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <LoadingButton loading={btnload} variant="contained" color="primary" sx={buttonStyles.buttonsubmit} onClick={handleSubmitedManual}>
                                        Save
                                    </LoadingButton>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclearedManual}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            {/* } */}
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lcompanydocumentpreparation") && (
                <>
                    <Box sx={userStyle.container}>
                        <NotificationContainer />
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>List Company Document Preparation</Typography>
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
                                        <MenuItem value={templateCreationArrayCreate?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelcompanydocumentpreparation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvcompanydocumentpreparation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printcompanydocumentpreparation") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfcompanydocumentpreparation") && (
                                        // <>
                                        //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                        //     <FaFilePdf />
                                        //     &ensp;Export to PDF&ensp;
                                        //   </Button>
                                        // </>
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagecompanydocumentpreparation") && (

                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>)}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={templateCreationArrayCreate}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={items}
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
                        &ensp;
                        {isUserRoleCompare?.includes("bdcompanydocumentpreparation") && (
                            <Button sx={buttonStyles.buttonbulkdelete} variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )}
                        &ensp;
                        <Button variant="contained" color="error" onClick={
                            handleClickOpenBulkalert
                        }>
                            Bulk Print
                        </Button>
                        <br />
                        <br />
                        {loader ?
                            <>

                                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>

                            </>
                            :
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
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
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={items}
                                    />
                                </Box>
                            </>
                        }
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
            <br />
            <CompanyDocumentPreparationPrinted data={Changed} setData={setChanged} />

            <Box>
                <Dialog
                    open={isInfoOpenImageManual}
                    onClose={handleCloseInfoImageManual}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check the Document by clicking Preview button while Saving/Printing the Document whether it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImageManual} sx={buttonStyles.btncancel}>Cancel</Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} autoFocus variant="contained" color='primary'
                            onClick={(e) => sendRequestManual(e)}
                        > Submit </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isInfoOpenImagePrint}
                    onClose={handleCloseInfoImagePrint}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check the Document by clicking Preview button while Saving/Printing the Document whether  it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImagePrint} sx={buttonStyles.btncancel} >Cancel</Button>
                        <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
                            onClick={(e) => downloadPdfTesdt(indexViewQuest - 1)}
                        > Download </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={previewManual}
                    onClose={handleClosePreviewManual}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            {`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`}
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePreviewManual} sx={userStyle.btncancel}>Change</Button>
                        <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
                            onClick={(e) => handleOpenPreviewManualfunc()}
                        > View </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isInfoOpenImagePrintManual}
                    onClose={handleCloseInfoImagePrintManual}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Once Check the Document by clicking Preview button while Saving/Printing the Document whether  it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImagePrintManual} sx={buttonStyles.btncancel}>Cancel</Button>
                        <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
                            onClick={(e) => downloadPdfTesdtManual(e)}
                        > Download </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: "50px" }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            <b>View Company Document Preparation</b>
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(documentPreparationEdit.date).format("DD-MM-YYYY")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reference No</Typography>
                                    <Typography>{documentPreparationEdit.referenceno}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template No</Typography>
                                    <Typography>{documentPreparationEdit.templateno}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{documentPreparationEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{documentPreparationEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template</Typography>
                                    <Typography>{documentPreparationEdit.template}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">To Company</Typography>
                                    <Typography>{documentPreparationEdit.tocompany}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Issuing Authority</Typography>
                                    <Typography>{documentPreparationEdit.issuingauthority}</Typography>
                                </FormControl>
                            </Grid>
                            {(documentPreparationEdit.sealing !== "") && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Seal</Typography>
                                    <Typography>{documentPreparationEdit.sealing}</Typography>
                                </FormControl>
                            </Grid>}
                            {(documentPreparationEdit.sign !== "") &&
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Signature</Typography>
                                        <Typography>{documentPreparationEdit.sign}</Typography>
                                    </FormControl>
                                </Grid>}





                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Document</Typography>
                                    <ReactQuill readOnly style={{ height: "max-content", minHeight: "150px" }}
                                        value={documentPreparationEdit.document}
                                        modules={{
                                            toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }],
                                            [{ direction: "rtl" }],
                                            [{ size: [] }],

                                            ["bold", "italic", "underline", "strike", "blockquote"],
                                            [{ align: [] }],
                                            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                            ["link", "image", "video"], ["clean"]]
                                        }}

                                        formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "align", "list", "bullet", "indent", "link", "image", "video"]} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <br /> <br />
                        <br />
                        <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
                            <Button sx={buttonStyles.btncancel} variant="contained" color="primary" onClick={handleCloseview}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>





            <Box>
                <Dialog open={isDeleteOpenBulkcheckbox} onClose={handleCloseBulkModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure you want print all ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseBulkModcheckbox} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={bulkPrintStatus} autoFocus variant="contained" onClick={(e) => handleClickOpenLetterHeader("Bulk Print")}>
                            {" "}
                            OK{" "}
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <br />
            <Box>
                <Dialog open={isOpenLetterHeadPopup}
                    onClose={handleClickCloseLetterHead}
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                        marginTop: "50px"
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>View Letter Header Options</Typography>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Print Option<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={HeaderDropDowns}
                                            value={{ label: headerOptions, value: headerOptions }}
                                            onChange={(e) => {
                                                setHeaderOptions(e.value);
                                                setSelectedHeadOpt([])
                                                setHeadValue([])
                                                setHeader("")
                                                setfooter("")
                                                setCheckingArray((prevArray) =>
                                                    prevArray.map((item, ind) =>
                                                        ind === (indexViewQuest - 1) ? {
                                                            ...item,
                                                            header: "",
                                                            footer: ""
                                                        } : item
                                                    )
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {headerOptions === "With Letter Head" && (
                                    <Grid item md={headerOptions === "With Letter Head" ? 4 : 3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                With Letter Head <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                maxMenuHeight={300}
                                                options={WithHeaderOptions}
                                                value={selectedHeadOpt}
                                                onChange={handleHeadChange}
                                                valueRenderer={customValueRenderHeadFrom}
                                            />
                                        </FormControl>
                                    </Grid>)}

                            </Grid>
                            <br />
                            <br /> <br />
                            <br />
                            <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <LoadingButton loading={HeaderOptionsButton} sx={buttonStyles.buttonsubmit} autoFocus variant="contained" onClick={(e) => {
                                        if (pagePopeOpen === "Preview") {
                                            handlePreviewDocumentManual()
                                        }
                                        else if (pagePopeOpen === "Print") {
                                            handlePrintDocumentManual()
                                        }
                                        else if (pagePopeOpen === "Table View") {
                                            downloadPdfTesdtTable(DataTableId)
                                        }
                                        else if (pagePopeOpen === "Table Print") {
                                            downloadPdfTesdtTablePrint(DataTableId)
                                        }
                                        else if (pagePopeOpen === "Bulk Print") {
                                            handleBulkPrint();
                                        }
                                        // else if (pagePopeOpen === "Email") {
                                        //   fetchEmailForUser(emailValuePage?.id, emailValuePage?.convert, emailValuePage?.fromemail, emailValuePage?.ccemail, emailValuePage?.bccemail)
                                        // }
                                    }


                                    }>
                                        {" "}
                                        OK{" "}
                                    </LoadingButton>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Button onClick={handleClickCloseLetterHead} sx={buttonStyles.btncancel}>
                                        Cancel
                                    </Button>
                                </Grid>

                            </Grid>
                        </>
                    </Box>
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
                itemsTwo={templateCreationArrayCreate ?? []}
                filename={"Company Documents Preparation"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Company Documents Preparation Info"
                addedby={addedby}
                updateby={updateby}
            />


            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />

            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAreagrpcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            <PleaseSelectRow
                open={isDeleteBulkOpenalert}
                onClose={handleCloseBulkModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />

            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={(e) => delBrand(brandid)}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <Loader loading={loading} message={loadingMessage} />
            <Loader loading={loadingPreviewData} message={loadingPreviewMessage} />
            <Loader loading={loadingGeneratingDatas} message={loadingGeneratingMessages} />
            <Loader loading={loadingPrintData} message={loadingPrintMessage} />
            {/* <Loader loading={loadingAttMonth} message={loadingMessageAttMonth} />
            <Loader loading={loadingAttDate} message={loadingMessageAttDate} />
            <Loader loading={loadingProdDate} message={loadingMessageProdDate} /> */}
        </Box>
    );
}

export default CompanyDocuments;