import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, DialogTitle, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextareaAutosize, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { LinearProgress } from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
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
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
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


const progressDialogStyles = {
    dialogPaper: {
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        textAlign: "center",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e0e0e0",
    },
    dialogTitle: {
        fontSize: "22px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#1e3a8a", // Deep Blue
    },
    checkingText: {
        fontSize: "18px",
        marginBottom: "12px",
        color: "#334155", // Slate-700
    },
    highlightText: {
        fontWeight: "600",
        color: "#2563eb", // Blue-600
    },
    progressBarContainer: {
        background: "#f1f5f9", // Light Slate
        borderRadius: "8px",
        padding: "5px",
        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
        marginTop: "10px",
    },
    progressBar: {
        height: "16px",
        borderRadius: "8px",
        background: "linear-gradient(to right, #3b82f6, #60a5fa)",
    },
    percentageText: {
        fontSize: "16px",
        marginTop: "10px",
        color: "#475569", // Slate-600
        fontWeight: "bold",
    },
    startButton: {
        background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
        border: "none",
        padding: "12px 24px",
        fontSize: "16px",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        boxShadow: "0px 2px 10px rgba(59, 130, 246, 0.3)",
    },
};

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

function CandidateDocuments() {
    const [progressValue, setProgressValue] = useState(0); // Progress state
    const [progressOpen, setProgressOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState("");
    const [previewManual, setPreviewManual] = useState(false)
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false); const [savingDatas, setSavingDatas] = useState(false);
    const gridRefTable = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const [userESignature, setUserESignature] = useState("");
    const [emailValuePage, setEmailValuePage] = useState({});
    const handleClickOpenPopupMalert = () => {
        //   setSubmitLoader(false);
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

    const handleClickOpenInfoImage = () => {
        setInfoOpenImage(true);
    };
    const handleCloseInfoImage = () => {
        setInfoOpenImage(false);
    };
    let exportColumnNames = [
        'Date ',
        'Reference No',
        'Template No',
        'Template',
        'Person',
        'Company',
        'Branch',
        'Designation',
        'Rounds',
        // 'Printed Count',
        'Printing Status',
        'Issued Person Details',
        'Issuing Authority'
    ];
    let exportRowValues = [
        'date',
        'referenceno',
        'templateno',
        'template',
        'person',
        'company',
        'branch',
        'designation',
        'roundname',
        // 'printedcount',
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

    const [fromEmail, setFromEmail] = useState("");
    const [qrCodeNeed, setQrCodeNeed] = useState(false)
    const [toCompanyAddress, setToCompanyAddress] = useState(false)
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
    const [loadingAttMonth, setLoadingAttMonth] = useState(false);
    const [loadingMessageAttMonth, setLoadingMessageAttMonth] = useState('Fetching Attendance Month Status...!');
    const [loadingAttDate, setLoadingAttDate] = useState(false);
    const [loadingMessageAttDate, setLoadingMessageAttDate] = useState('Fetching Attendance Date Status...!');
    const [loadingProdDate, setLoadingProdDate] = useState(false);
    const [loadingMessageProdDate, setLoadingMessageProdDate] = useState('Fetching Production Date Status...!');
    const [loadingProdMonth, setLoadingProdMonth] = useState(false);
    const [loadingPreviewData, setLoadingPreviewData] = useState(false);
    const [loadingPreviewManualData, setLoadingPreviewManualData] = useState(false);
    const [loadingMessageProdMonth, setLoadingMessageProdMonth] = useState('Fetching Production Month Status...!');
    const [loadingPreviewMessage, setLoadingPreviewMessage] = useState('Setting up a document for preview...!');
    const [loadingPrintData, setLoadingPrintData] = useState(false);
    const [loadingPrintManualData, setLoadingPrintManualData] = useState(false);
    const [loadingPrintMessage, setLoadingPrintMessage] = useState('Preparing an Document to Print...!');
    const [loadingGeneratingDatas, setLoadingGeneratingDatas] = useState(false);
    const [loadingGeneratingMessages, setLoadingGeneratingMessage] = useState('Generating the set of Documents...!');
    const [savingDatasMessage, setSavingDatasMessage] = useState('Generating the set of Documents for Saving...!');
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
    const [noticePeriodEmpCheck, setNoticePeriodEmpCheck] = useState(false);
    const [noticePeriodEmpCheckPerson, setNoticePeriodEmpCheckPerson] = useState(false);
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
        designation: "Please Select Designation",
        reason: "Document",
        documentneed: "Print Document",
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
        printoptions: "Please Select Print Options",
    });
    // letter headd options
    const HeaderDropDowns = [{ label: "With Letter Head", value: "With Letter Head" }, { label: "Without Letter Head", value: "Without Letter Head" }];
    const WithHeaderOptions = [{ value: "With Head content", label: "With Head content" }, { value: "With Footer content", label: "With Footer content" }];
    const [isOpenLetterHeadPopup, setIsLetterHeadPopup] = useState(false)
    const [headerOptions, setHeaderOptions] = useState("Please Select Print Options");
    const [headvalueAdd, setHeadValueAdd] = useState([]);
    const [DataTableId, setDataTableId] = useState("")
    const [selectedHeadOptAdd, setSelectedHeadOptAdd] = useState([]);
    const [items, setItems] = useState([]);
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
    const [isInfoOpenImage, setInfoOpenImage] = useState(false)
    const [isInfoOpenImagePrint, setInfoOpenImagePrint] = useState(false)
    const [companyName, setCompanyName] = useState("");
    const [sealPlacement, setSealPlacement] = useState("");
    const [waterMarkText, setWaterMarkText] = useState("");
    const [companyNameEdit, setCompanyNameEdit] = useState("");
    const [sealPlacementEdit, setSealPlacementEdit] = useState("");
    const [HeaderOptionsButton, setHeaderOptionsButton] = useState(false)
    const [overallExcelDatas, setOverallExcelDatas] = useState([])
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')

    const [pagePopeOpen, setPagePopUpOpen] = useState("")
    const handleClickOpenInfoImagePrint = () => {

        setInfoOpenImagePrint(true);
    };
    const handleCloseInfoImagePrint = () => {
        setInfoOpenImagePrint(false);
        setButtonLoading(false)
        setLoadingPrintData(false)
    };
    const handleHeadChange = (options) => {
        let value = options.map((a) => {
            return a.value;
        })
        setHeadValue(value)
        if (!["Preview Manual", "Print Manual"]?.includes(pagePopeOpen)) {
            if (value?.length === 1 && value?.includes("With Head content")) {
                setCheckingArray((prevArray) =>
                    prevArray.map((item, ind) =>
                        ind === (indexViewQuest - 1) ? {
                            ...item,
                            header: personId?.letterheadcontentheader[0]?.preview,
                            //  footer: personId?.letterheadcontentfooter[0]?.preview 
                        } : item
                    )
                );
                setHeader(personId?.letterheadcontentheader[0]?.preview)
            }
            else if (value?.length === 1 && value?.includes("With Footer content")) {
                setfooter(personId?.letterheadcontentfooter[0]?.preview)
                setCheckingArray((prevArray) =>
                    prevArray.map((item, ind) =>
                        ind === (indexViewQuest - 1) ? {
                            ...item,
                            // header: personId?.letterheadcontentheader[0]?.preview,
                            footer: personId?.letterheadcontentfooter[0]?.preview
                        } : item
                    )
                );
            }
            else if (value?.length > 1) {
                setCheckingArray((prevArray) =>
                    prevArray.map((item, ind) =>
                        ind === (indexViewQuest - 1) ? {
                            ...item,
                            header: personId?.letterheadcontentheader[0]?.preview,
                            footer: personId?.letterheadcontentfooter[0]?.preview
                        } : item
                    )
                );
                setHeader(personId?.letterheadcontentheader[0]?.preview)
                setfooter(personId?.letterheadcontentfooter[0]?.preview)
            }
            else {
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
            }
        }



        setSelectedHeadOpt(options)
    }
    const customValueRenderHeadFrom = (valueCate) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Letter Head";
    };
    const handleHeadChangeAdd = (options) => {
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
        setHeadValueAdd(value)
        setSelectedHeadOptAdd(options)
    }
    const customValueRenderHeadFromAdd = (valueCate) => {
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
        // setHeader("");
        // setfooter("")
        // setCheckingArray((prevArray) =>
        //   prevArray.map((item, ind) =>
        //     ind === (indexViewQuest - 1) ? {
        //       ...item,
        //       header: "",
        //       footer: ""
        //     } : item
        //   )
        // );
        setSelectedHeadOpt([]);
    }


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
        person: true,
        roundname: true,
        printingstatus: true,
        branch: true,
        designation: true,
        // printedcount: true,
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

    const handlePrintDocument = (index) => {
        if (documentPrepartion?.documentneed !== "Candidate Approval" && headerOptions === "Please Select Print Options") {
            // setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.documentneed !== "Candidate Approval" && headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (generateData) {
            setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setButtonLoading(true)
            setLoadingPrintData(true);

            setHeaderOptionsButton(true);
            downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {
                setHeaderOptionsButton(false);
                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoading(false)
                    setLoadingPrintData(false)
                    setHeaderOptionsButton(false);
                    setPopupContentMalert(`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
                ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`);
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } else {
                    setButtonLoading(false)
                    handleClickOpenInfoImagePrint();

                }

            }).catch((error) => {
                console.error('Error generating PDF:', error);
            })
        }
    }

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
        } else {
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
    const [designationOptions, setDesignationOptions] = useState([]);
    const [roundNames, setRoundNames] = useState([]);
    const [employeeNameOptions, setEmployeeNameOptions] = useState([]);
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
            pagename: String("Human Resource/HR Documents/Candidate Document Preparation"),
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
    const TemplateDropdowns = async (branch, company) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.CANDIDATE_TEMPLATE_CREATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                branch, company
            });
            const candidateDocuments = res.data.templatecreation?.length > 0 ? res?.data?.templatecreation : [];
            setTemplateValues(
                candidateDocuments?.map((data) => ({
                    ...data,
                    label: `${data.name}--(${data.company}--${data.branch})`,
                    value: `${data.name}--(${data.company}--${data.branch})`,
                    company: data.company,
                    branch: data.branch,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchDesignation = async (company, branch) => {
        try {
            let res = await axios.post(SERVICE.DESIGNATION_BASED_COMPANYBRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company, branch
            });
            const designations = res?.data?.designation?.length > 0 ? res?.data?.designation : []
            setDesignationOptions(designations?.map(data => ({
                label: data.designation,
                value: data.designation,
                jobopeningid: data?._id,
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    const fetchRounds = async (designation) => {
        try {
            let res = await axios.post(SERVICE.ROUNDNAMES_BASED_COM_BRAN_DEESIG, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                }, designation
            });

            const roundOrder = res?.data?.rounds?.round ? res.data.rounds.round?.slice(0, -1) : [];
            setRoundNames(roundOrder?.map(data => ({
                label: data,
                value: data,
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    const fetchEmployeeNames = async (rounds) => {

        const query = {
            company: documentPrepartion.company,
            branch: documentPrepartion.branch,
            designation: documentPrepartion.designation,
            jobopeningid: documentPrepartion.jobopeningid,
            rounds: rounds
        }
        try {
            let res = await axios.post(SERVICE.EMPLOYESNAMES_FROM_CANDIDATES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                }, query
            });

            const employeeNames = res?.data?.employeenames ? res?.data?.employeenames : []
            setEmployeeNameOptions(employeeNames?.map(data => ({
                ...data,
                label: data.fullname,
                value: data.fullname,
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }


    const [selectedRounds, setSelectedRounds] = useState([]);
    const [selectedRoundValues, setSelectedRoundValues] = useState([]);

    const handleRoundsChange = (options) => {
        setSelectedRounds(options);
        const value = options?.map(data => data.value)
        setSelectedRoundValues(value);
        fetchEmployeeNames(value)
    };

    const customValueRendererRounds = (valueCate, rounds) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Rounds";
    };


    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [selectedEmployeeValues, setSelectedEmployeeValues] = useState([]);

    const handleEmployeeChange = (options) => {
        setSelectedEmployee(options);
        const Values = options?.map(data => data.value)
        setSelectedEmployeeValues(Values)
    };

    const customValueRendererEmployee = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
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
                const ans = res?.data?.templatecontrolpanel ?
                    res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
                setPersonId(ans)
                setFromEmail(ans?.fromemail)
                setCompanyName(ans)
                setWaterMarkText(ans?.letterheadbodycontent[0].preview)
                setSignatureStatus(e?.signature)
                setSealStatus(e?.seal)
                setGenerateData(false)
            }
            else {
                setGenerateData(true)
                setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

        } catch (err) { console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [uniqueCode, setUniqueCode] = useState("")

    const IdentifyUserCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.CANDIDATE_DOCUMENT_PREPARATION_CODES, {
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

    const extractEmailFormat = async (userdetails, name, id) => {

        const userFind = userdetails ? userdetails : "none";
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
        setPersonId(tempcontpanel?.data?.result[0]);
        handleClickOpenLetterHeader('Email');
        setEmailValuePage({ id, convert, fromemail, ccemail, bccemail })
        // await fetchEmailForUser(id, convert, fromemail, ccemail, bccemail)

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


    //submit option for saving
    const handleSubmited = async (e, index) => {
        e.preventDefault();
        let ans = [];
        if (checkingArray?.length < 1) {
            setPopupContentMalert("Please Add Atleast one Document!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            // const batchSize = 2;
            // // setBtnLoad(true);
            // const results = await processInBatches(checkingArray, batchSize);

            // const allFalse = results.every((isMultiPage) => !isMultiPage);
            // if (!allFalse && templateCreationValue?.pagemode === "Single Page") {
            //   setPopupContentMalert(`This Template has a page mode of ${templateCreationValue?.pagemode}, but the provided documents are ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"} to print documents.`);
            //   setPopupSeverityMalert("info");
            //   handleClickOpenPopupMalert();
            // } else {
            //   handleClickOpenInfoImage();
            // }


            handleClickOpenInfoImage();



        }
    };

    const generatePDFs = async (e) => {
        e.preventDefault()
        setBtnLoad(true);
        setProgressValue(0);
        setCurrentFile("")
        setProgressOpen(true); // Show the progress popup
        try {
            handleCloseInfoImage();
            const results = [];
            let localProgress = 0;
            const totalFiles = checkingArray?.length ?? 0;
            for (let i = 0; i < totalFiles; i++) {

                const isMultiPage = await downloadPdfTesdtCheckTrue(i);
                results.push(isMultiPage);
                setCurrentFile(`${checkingArray[i]?.documentname} - ${checkingArray[i]?.empname}`)
                localProgress = ((i + 1) / totalFiles) * 100;
                setProgressValue(localProgress);
            }

            const allFalse = results.every((isMultiPage) => !isMultiPage);

            if (!allFalse && templateCreationValue?.pagemode === "Single Page") {
                setPopupContentMalert(
                    `This Template has a page mode of ${templateCreationValue?.pagemode}, but the provided documents are ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"
                    } to print documents.`
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                sendRequest(e)
            }
        } catch (error) {
            console.error("Error generating PDFs:", error);
        } finally {
            setBtnLoad(false);
            setProgressOpen(false); // Hide the progress popup
        }
    };
    //add function
    const sendRequest = async () => {
        setBtnLoad(true);
        setPageName(!pageName);
        setProgressOpen(false);
        setSavingDatas(true)
        const batchSize = 10; // Adjust batch size as needed
        const batches = [];

        // Split checkingArray into batches
        for (let i = 0; i < checkingArray.length; i += batchSize) {
            batches.push(checkingArray.slice(i, i + batchSize));
        }

        try {
            for (const batch of batches) {
                const batchRequests = batch.map(async (data) => {
                    await axios.post(SERVICE.CREATE_CANDIDATE_DOCUMENT_PREPARATION, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        date: String(date),
                        template: String(data.template),
                        documentname: String(data.documentname),
                        referenceno: data?.referenceno,
                        tempcode: data?.tempcode,
                        termsAndConditons: templateCreationValue?.termsAndConditons,
                        templateno: data?.autoid,
                        email: data?.email,
                        designation: String(data.designation),
                        issuingauthority: String(data.issuingauthority),
                        department: String(data.department),
                        company: String(data.company),
                        branch: String(data.branch),
                        candidateid: String(data.candidateid),
                        rounds: data.rounds,
                        pagenumberneed: String(data.pagenumberneed),
                        documentneed: String(data.documentneed),
                        person: data.empname === "Please Select Person" ? "" : data.empname,
                        proption: String(data?.proption),
                        watermark: data?.watermark,
                        pageheight: data?.pageheight,
                        pagewidth: data?.pagewidth,
                        pagesize: data?.pagesize,
                        head: data.documentneed === "Candidate Approval" ? data?.header : "",
                        foot: data.documentneed === "Candidate Approval" ? data?.footer : "",
                        qrCodeNeed: data?.qrcodeNeed,
                        sign: data?.sign,
                        sealing: data?.sealing,
                        printingstatus: "Not-Printed",
                        signature: data?.signature,
                        seal: data?.seal,
                        qrcode: data?.qrcode,
                        issuedpersondetails: String(isUserRoleAccess.companyname),
                        document: data?.data,
                        frommailemail: data?.frommailemail,
                        mail: "Send",
                        printoptions: "",
                        addedby: [
                            {
                                name: String(username),
                                date: String(new Date()),
                            },
                        ],
                    });
                });

                // Wait for the current batch to complete before proceeding to the next
                await Promise.all(batchRequests);
            }
            //   setSavingDatas(false)
            fetchBrandMaster();
            handleCloseInfoImage();
            setDocumentPrepartion({
                ...documentPrepartion,
                person: "Please Select Person",
                documentneed: "Print Document"
            });
            setHeader("");
            // setFooter("");
            setSelectedHeadOptAdd([]);
            setQrCodeNeed(false);
            setSavingDatas(false)
            setChecking("");
            setCheckingArray([]);
            setIndexViewQuest(1);
            setEmployeeControlPanel("");
            setEmployeeValue([]);
            //   setEmployeeUserName("");
            window.scrollTo(0, 0);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        } finally {
            setBtnLoad(false);
            setSearchQuery("");
        }
    };
    const handlecleared = (e) => {
        e.preventDefault();
        setGenerateData(false)
        setCheckingArray([])
        setIndexViewQuest(1)
        setDocumentPrepartion({
            date: "",
            documentname: "",
            template: "Please Select Template Name",
            referenceno: "", templateno: "",
            pagenumberneed: "All Pages",
            employeemode: "Please Select Employee Mode",
            reason: "Document",
            department: "Please Select Department",
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            person: "Please Select Person",
            proption: "Please Select Print Option",
            printoptions: "Please Select Print Options",
            issuingauthority: "Please Select Issuing Authority",
            sort: "Please Select Sort",
            attendancedate: "",
            attendancemonth: "Please Select Attendance Month",
            attendanceyear: "Please Select Attendance Year",
            designation: "Please Select Designation",
            productiondate: "",
            productionmonth: "Please Select Production Month",
            productionyear: "Please Select Production Year",
            signature: "Please Select Signature",
            seal: "Please Select Seal",
            pagesize: "Please Select pagesize",
            print: "Please Select Print Option",
            heading: "Please Select Header Option",
            issuedpersondetails: "",
            documentneed: "Print Document",
        });
        setCheckingArray([])
        setSelectedEmployeeValues([])
        setSelectedEmployee([])
        setIndexViewQuest(1)
        // setHeadValue([])
        setSelectedHeadOpt([])
        // setHeader("")
        // setfooter("")
        setSealStatus("")
        setSignatureStatus("")
        setCompanyName("")
        setIssuingAutholrity([])

        setButtonLoading(false)
        setBtnLoad(false)

        setEmployeeNameOptions([])
        setTemplateValues([])
        setDesignationOptions([])
        setRoundNames([])
        setBranchOptions([]);
        setSelectedRounds([])
        setSelectedRoundValues([])

        setChecking("");
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [generateData, setGenerateData] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [personId, setPersonId] = useState('');
    const [imageUrlEdit, setImageUrlEdit] = useState('');
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
            let res_queue = await axios.get(SERVICE.CANDIDATE_DOCUMENT_PREPARATION_AUTOID, {
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


    const value = uniqueCode + "#" + templateCreationValue?.tempcode
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
            // Create a new div element to hold the Quill content
            await Promise.all(selectedRows?.map(async (item) => {
                setBulkPrintStatus(true)
                let response = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await getUpdatePrintingStatus(item, response?.data?.scandidateDocumentPreparation?.updatedby)

                setLoadingGeneratingMessage("Printing the set the Documents..!")
                const pdfElement = document.createElement("div");
                pdfElement.innerHTML = response?.data?.scandidateDocumentPreparation?.document;


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
                        if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "All Pages") {
                            const textY = footerY - 3;
                            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                        } else if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                            const textY = footerY - 3;
                            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                        }
                        // Add QR code and statement only on the last page

                        if (response?.data?.scandidateDocumentPreparation?.qrCodeNeed) {
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
                html2pdf()
                    .from(pdfElement)
                    .set({
                        margin: response.data.scandidateDocumentPreparation?.pagesize == "A3"
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
                                parseFloat(response.data.scandidateDocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                                parseFloat(response.data.scandidateDocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                            ],
                            orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                        },
                        lineHeight: 0, // Increased line spacing
                        fontSize: 12,
                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                    }).toPdf().get('pdf').then((pdf) => {
                        // Convert the watermark image to a base64 string
                        const img = new Image();
                        img.src = response?.data?.scandidateDocumentPreparation?.watermark;
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
                            qrImg.src = response?.data?.scandidateDocumentPreparation?.qrcode; // QR code image URL
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
                                pdf.save(`${response?.data?.scandidateDocumentPreparation?.template}_${response?.data?.scandidateDocumentPreparation?.person}.pdf`);
                                setBulkPrintStatus(false)

                            };
                        };
                    });
            }))
            await fetchBrandMaster();
            handleClickCloseLetterHead();
            setChanged("dsdss")
            handleCloseBulkModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setLoadingGeneratingDatas(false)
        }
    };

    const handlePreviewDocument = (index) => {
        if (documentPrepartion?.documentneed !== "Candidate Approval" && headerOptions === "Please Select Print Options") {
            setButtonLoadingPreview(false);
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.documentneed !== "Candidate Approval" && headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
            setPopupContentMalert("Please Select With Letter Head!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (generateData) {
            setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setButtonLoadingPreview(true);
            setLoadingPreviewData(true);
            handleClickCloseLetterHead();
            setHeaderOptionsButton(true)
            downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {

                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoadingPreview(false)
                    setPreviewManual(true)
                    setLoadingPreviewData(false)
                    setHeaderOptionsButton(false)
                }
                else {
                    setLoadingPreviewData(true)
                    setPreviewManual(false)
                    setButtonLoadingPreview(true);
                    // Create a new div element to hold the Quill content
                    const pdfElement = document.createElement("div");
                    pdfElement.innerHTML = checkingArray[index]?.data;
                    const pdfElementHead = document.createElement("div");
                    pdfElementHead.innerHTML = checkingArray[index]?.header;

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
                    watermarkImage.src = checkingArray[index]?.watermark;
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
                            if (checkingArray[index]?.header !== "") {
                                const headerImgWidth = pageWidth * 0.95;
                                const headerImgHeight = pageHeight * 0.09;
                                const headerX = 5;
                                const headerY = 3.5;
                                doc.addImage(checkingArray[index]?.header, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);
                            }

                            if (checkingArray[index]?.header !== "") {
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
                            const footerY = (pageHeight * 1) - (checkingArray[index]?.footer === "" ? 15 : footerImgHeight - 3);
                            doc.addImage(checkingArray[index]?.footer, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);


                            if (checkingArray[index]?.pagenumberneed === "All Pages") {
                                const textY = footerY - 3;
                                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                            } else if (checkingArray[index]?.pagenumberneed === "End Page" && i === totalPages) {
                                const textY = footerY - 3;
                                doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                            }


                            if (checkingArray[index]?.qrcodeNeed) {
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
                                    const statementText3 = `3. For questions, contact us at ${checkingArray[index]?.frommailemail}.`;

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
                            margin: checkingArray[index]?.pagesize == "A3"
                                ? ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [45, 15, 45, 15]
                                    : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [20, 15, 45, 15]
                                        : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [45, 15, 20, 15] :
                                            [20, 15, 20, 15])

                                :
                                ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [30, 15, 45, 15]
                                    : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [15, 15, 45, 15]
                                        : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [30, 15, 15, 15] : [15, 15, 15, 15]),
                            image: { type: "jpeg", quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: {
                                unit: "mm",
                                format: [
                                    parseFloat(checkingArray[index]?.pagewidth) || 210,
                                    parseFloat(checkingArray[index]?.pageheight) || 297
                                ],
                                orientation: checkingArray[index]?.orientation || "portrait"
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
                                qrImg.src = checkingArray[index]?.qrcodeNeed ? checkingArray[index]?.qrcode : ''; // QR code image URL
                                if (checkingArray[index]?.qrcodeNeed) {
                                    qrImg.onload = () => {
                                        const qrCanvas = document.createElement('canvas');
                                        qrCanvas.width = qrImg.width;
                                        qrCanvas.height = qrImg.height;
                                        const qrCtx = qrCanvas.getContext('2d');
                                        qrCtx.drawImage(qrImg, 0, 0);
                                        const qrCodeImage = qrCanvas.toDataURL('image/png');
                                        // Add page numbers, watermark, and QR code to each page
                                        addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                                        const pdfBlob = pdf.output('blob');
                                        const pdfUrl = URL.createObjectURL(pdfBlob);
                                        const printWindow = window.open(pdfUrl);
                                        setLoadingPrintData(false)
                                        setButtonLoading(false)
                                        handleCloseInfoImagePrint();
                                    }
                                }
                                else {
                                    addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                                    const pdfBlob = pdf.output('blob');
                                    const pdfUrl = URL.createObjectURL(pdfBlob);
                                    const printWindow = window.open(pdfUrl);
                                    setLoadingPrintData(false)
                                    setButtonLoading(false)
                                    handleCloseInfoImagePrint();
                                }
                            };
                        });
                    setLoadingPreviewData(false)
                }
                setHeaderOptionsButton(false)
                setButtonLoadingPreview(false);
                setLoadingPreviewData(false);
                // setHeader("")
                // setfooter("")
                // setCheckingArray((prevArray) =>
                //   prevArray.map((item, ind) =>
                //     ind === (indexViewQuest - 1) ? {
                //       ...item,
                //       header: "",
                //       footer: ""
                //     } : item
                //   )
                // );
            }).catch((error) => {
                setHeaderOptionsButton(false)
                setButtonLoadingPreview(false);
                setLoadingPreviewData(false)
                console.error('Error generating PDF:', error);
            })
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
            let response = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await getUpdatePrintingStatus(response.data.scandidateDocumentPreparation?._id, response.data.scandidateDocumentPreparation?.updatedby)
            const pdfElement = document.createElement("div");
            pdfElement.innerHTML = response.data.scandidateDocumentPreparation.document;
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
                    if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }

                    if (response?.data?.scandidateDocumentPreparation?.qrCodeNeed) {
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
                    margin: response?.data?.scandidateDocumentPreparation?.pagesize == "A3"
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
                            parseFloat(response.data.scandidateDocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                            parseFloat(response.data.scandidateDocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                        ],
                        orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                    },
                    lineHeight: 0, // Increased line spacing
                    fontSize: 12,
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                }).toPdf().get('pdf').then((pdf) => {
                    // Convert the watermark image to a base64 string
                    const img = new Image();
                    img.src = response?.data?.scandidateDocumentPreparation?.watermark;
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
                        qrImg.src = response.data.scandidateDocumentPreparation?.qrcode; // QR code image URL
                        if (response.data.scandidateDocumentPreparation?.qrCodeNeed) {
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
                                // pdf.save(`${response.data.scandidateDocumentPreparation?.template}_${response.data.scandidateDocumentPreparation?.person}.pdf`);
                                handleClickCloseLetterHead();
                            };
                        }
                        else {
                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                            // Save the PDF
                            const pdfBlob = pdf.output('blob');
                            const pdfUrl = URL.createObjectURL(pdfBlob);
                            const printWindow = window.open(pdfUrl);
                            // pdf.save(`${response.data.scandidateDocumentPreparation?.template}_${response.data.scandidateDocumentPreparation?.person}.pdf`);
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
            // Create a new div element to hold the Quill content
            let response = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await getUpdatePrintingStatus(response.data.scandidateDocumentPreparation?._id, response.data.scandidateDocumentPreparation?.updatedby)
            const pdfElement = document.createElement("div");
            pdfElement.innerHTML = response.data.scandidateDocumentPreparation.document;
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
                    if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }

                    if (response?.data?.scandidateDocumentPreparation?.qrCodeNeed) {
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
                    margin: response?.data?.scandidateDocumentPreparation?.pagesize == "A3"
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
                            parseFloat(response.data.scandidateDocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                            parseFloat(response.data.scandidateDocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                        ],
                        orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                    },
                    lineHeight: 0, // Increased line spacing
                    fontSize: 12,
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                }).toPdf().get('pdf').then((pdf) => {
                    // Convert the watermark image to a base64 string
                    const img = new Image();
                    img.src = response?.data?.scandidateDocumentPreparation?.watermark;
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
                        qrImg.src = response.data.scandidateDocumentPreparation?.qrcode; // QR code image URL
                        if (response.data.scandidateDocumentPreparation?.qrCodeNeed) {
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
                                pdf.save(`${response.data.scandidateDocumentPreparation?.template}_${response.data.scandidateDocumentPreparation?.person}.pdf`);
                                handleClickCloseLetterHead();
                            };
                        }
                        else {
                            addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                            // // Save the PDF
                            // const pdfBlob = pdf.output('blob');
                            // const pdfUrl = URL.createObjectURL(pdfBlob);
                            // const printWindow = window.open(pdfUrl);
                            pdf.save(`${response.data.scandidateDocumentPreparation?.template}_${response.data.scandidateDocumentPreparation?.person}.pdf`);
                            handleClickCloseLetterHead();
                        }

                    };
                });

        }
    };
    const downloadPdfTesdt = (index) => {
        if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
            setPopupContentMalert("This Employee is not eligibile to receieve any kind of documents!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setButtonLoading(true)
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
                    doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                    if (head !== "") {
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
                    const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3); // Position at the bottom
                    doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);

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
            if (pdfElement) {
                html2pdf()
                    .from(pdfElement)
                    .set({
                        margin: checkingArray[index]?.pagesize == "A3"
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
                            if (checkingArray[index]?.qrcodeNeed) {
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
                                    pdf.save(`${checkingArray[index]?.template}_${checkingArray[index]?.empname}.pdf`);
                                    setLoadingPrintData(false)
                                    setButtonLoading(false)
                                    setHeaderOptionsButton(false);
                                    handleCloseInfoImagePrint();
                                    handleClickCloseLetterHead();
                                }
                            }
                            else {
                                addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                                // Save the PDF
                                pdf.save(`${checkingArray[index]?.template}_${checkingArray[index]?.empname}.pdf`);
                                setLoadingPrintData(false)
                                setButtonLoading(false)
                                setHeaderOptionsButton(false);
                                handleCloseInfoImagePrint();
                                handleClickCloseLetterHead();
                            }

                        };
                    }).catch((error) => {
                        console.error("Error generating PDF:", error);
                        setButtonLoading(false);
                    });
            }

        }

    };
    const downloadPdfTesdtCheckTrue = (index) => {
        return new Promise((resolve, reject) => {
            // Create a new div element to hold the Quill content
            const pdfElement = document.createElement("div");

            pdfElement.innerHTML = checkingArray[index]?.data;
            const pdfElementHead = document.createElement("div");
            pdfElementHead.innerHTML = checkingArray[index]?.header;
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
            watermarkImage.src = checkingArray[index]?.watermark;
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
                    doc.addImage(checkingArray[index]?.header, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

                    if (checkingArray[index]?.header !== "") {
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
                    const footerY = (pageHeight * 1) - (checkingArray[index]?.footer === "" ? 15 : footerImgHeight - 3);
                    // const footerY = pageHeight - footerHeight;
                    doc.addImage(checkingArray[index]?.footer, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
                    if (checkingArray[index]?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (checkingArray[index]?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }


                    if (checkingArray[index]?.qrcodeNeed) {
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
                            const statementText3 = `3. For questions, contact us at ${checkingArray[index]?.frommailemail}.`;

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
                            parseFloat(checkingArray[index]?.pagewidth) || 210,
                            parseFloat(checkingArray[index]?.pageheight) || 297
                        ],
                        orientation: checkingArray[index]?.orientation || "portrait"
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
                        qrImg.src = checkingArray[index]?.qrcode; // QR code image URL
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

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationDelete(res?.data?.scandidateDocumentPreparation);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let brandid = documentPreparationDelete?._id;
    const delBrand = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${brandid}`, {
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


    let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));


    //submit option for saving
    const handleSubmit = (e) => {

        e.preventDefault();
        const [first, second, third] = moment(new Date()).format("DD-MM-YYYY hh:mm a")?.split(" ")
        const vasr = `${first}_${second}_${third}`
        setDateFormat(vasr)
        const isNameMatch = templateCreationArray?.some((item) =>
            // item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() &&
            item.documentneed === documentPrepartion.documentneed &&
            selectedEmployeeValues?.includes(item.person));


        const isNameMatchInside = checkingArray?.some((item) => selectedEmployeeValues?.includes(item.empname));
        if (documentPrepartion.company === "" || documentPrepartion.template === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
            setPopupContentMalert("Please Select Template Name!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion.designation === "" || documentPrepartion.designation === "Please Select Designation") {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedRounds?.length < 1) {
            setPopupContentMalert("Please Select Rounds!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmployee?.length < 1) {
            setPopupContentMalert("Please Select Person!");
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
            setPopupContentMalert("Document with Person Name and Template already exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatchInside) {
            setPopupContentMalert("Document with Person Name and Template already exists in Todo!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.documentneed === "Candidate Approval" && documentPrepartion?.printoptions === "Please Select Print Options") {
            setPopupContentMalert("Please Select Print Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (documentPrepartion?.documentneed === "Candidate Approval" && documentPrepartion?.printoptions === "With Letter Head" && headvalueAdd?.length === 0) {
            setPopupContentMalert("Please Select Letter Head Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else {

            if (selectedEmployeeValues?.length > 0) {
                selectedEmployeeValues?.map((data, index) => answerDefine(data, index))
            } else {
                answerDefine();
            }


        }
    };

    function formatDOB(dob) {
        const [year, month, day] = dob.split("-");
        return `${day}${month}${year}`;
    }

    const answerDefine = async (personDetails, index) => {
        const constAuotId = await fetchAllRaisedTickets();
        let lastIndex = constAuotId?.length - 1;
        const person = selectedEmployee?.find(data => data?.value === personDetails)
        const formattedDOB = person?.dateofbirth ? formatDOB(person?.dateofbirth) : "";
        let prefixLength = Number(constAuotId[lastIndex]) + (index + 1);
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ?
            `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ?
                `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}`
                    : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` :
                        prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString


        let newval = uniqueCode + "#" + (person ? person?.value?.slice(0, 3) : "" + "_" + formattedDOB) + "_" + templateCreationValue?.tempcode + "_" + postfixLength
        let newvalRefNo = `DP_${postfixLength}`;
        const accessbranchs = accessbranch
            ? accessbranch.map((data) => ({
                branch: data.branch,
                company: data.company,
            }))
            : [];
        setPageName(!pageName);
        try {
            setLoadingGeneratingDatas(true)
            const [res,
                //   res_emp, 
                // res_emp_break,
                //  userDetails
            ] = await Promise.all([
                axios.post(SERVICE.CANDIDATE_TEMPLATE_CREATION_FILTER, {
                    assignbranch: accessbranchs,
                    company: templateCreationValue?.company,
                    branch: templateCreationValue?.branch,
                    name: templateCreationValue?.name,
                    documentname: templateCreationValue?.documentname,
                },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }),
                // axios.post(SERVICE.USER_STATUS_ANSWERDEFINE, {
                //   headers: {
                //     Authorization: `Bearer ${auth.APIToken}`,
                //   },
                //   employeename
                // }),
                // axios.get(SERVICE.SHIFT, {
                //   headers: {
                //     Authorization: `Bearer ${auth.APIToken}`,
                //   },
                // }),
                // axios.post(`${SERVICE.USER_ESIGNATURE_FILTER}`, {
                //   companyname: employeename
                // }
                // )
            ]);



            //   const userESignature = userDetails?.data?.semployeesignature ? userDetails?.data?.semployeesignature?.signatureimage : ""
            //   setUserESignature(userESignature)
            let matches = documentPrepartion?.template?.replaceAll("(", "")?.replaceAll(")", "")?.split("--");
            let format = res?.data?.templatecreation
            //   ?.find((data) => data.company === matches[1] && data.branch === matches[2] && data?.name === documentPrepartion?.template?.split("--")[0]);
            //   let employee = res_emp?.data?.usersstatus;
            //   setEmailUser(employee?.email)

            //   let employeeBreak = res_emp_break?.data?.shifts.find((data) => data?.name === employee?.shifttiming);
            let convert = format?.pageformat;
            const tempElement = document?.createElement("div");
            tempElement.innerHTML = convert;

            const listItems = Array.from(tempElement.querySelectorAll("li"));
            listItems.forEach((li, index) => {
                li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
            });

            // tempElement.appendChild(createFooterElementImage());
            let texted = tempElement.innerHTML;
            setLoadingGeneratingDatas(false);
            //   if (employeeMode === "Manual") {
            //     let findMethod = texted
            //       .replaceAll("$UNIID$", newval ? newval : "");
            //     setChecking(findMethod)

            //   }
            //   else {
            //     let caddress = `<br>${!employee?.cdoorno ? "" : employee?.cdoorno + ", "}${!employee?.cstreet ? "" : employee?.cstreet + ", "}${!employee?.carea ? "" : employee?.carea + ", "}
            // <br>${!employee?.clandmark ? "" : employee?.clandmark + ", "}${!employee?.ctaluk ? "" : employee?.ctaluk + ", "}${!employee?.cpost ? "" : employee?.cpost + ", "}
            // <br>${!employee?.ccity ? "" : employee?.ccity + ", "}${!employee?.cstate ? "" : employee?.cstate + ", "}${!employee?.ccountry ? "" : employee?.ccountry + ", "}${!employee?.cpincode ? "" : "- " + employee?.cpincode}`;
            // console.log(person , 'person')
            let GenderHeShe = (person?.gender !== "" || person?.gender !== undefined)
                ? person?.gender === "Male" ? "He" : person?.gender === "Female" ? "She" : "He/She" : "He/She";

            let GenderHeShesmall = (person?.gender !== "" || person?.gender !== undefined)
                ? person?.gender === "Male" ? "he" : person?.gender === "Female" ? "she" : "he/she" : "he/she";

            let GenderHimHer = (person?.gender !== "" || person?.gender !== undefined)
                ? person?.gender === "Male" ? "him" : person?.gender === "Female" ? "her" : "him/her" : "him/her";



            let caddress = `<br>${!person?.pdoorno ? "" : person?.pdoorno + ", "}${!person?.pstreet ? "" : person?.pstreet + ", "}${!person?.parea ? "" : person?.parea + ", "}
            <br>${!person?.plandmark ? "" : person?.plandmark + ", "}${!person?.ptaluk ? "" : person?.ptaluk + ", "}${!person?.ppost ? "" : person?.ppost + ", "}
            <br>${!person?.pcity ? "" : person?.pcity + ", "}${!person?.pstate ? "" : person?.pstate + ", "}${!person?.pcountry ? "" : person?.pcountry + ", "}
            ${!person?.ppincode ? "" : "- " + person?.ppincode}`;

            let findMethod = texted
                .replaceAll("$C:CONTACT$", person?.mobile ? person?.mobile : "")
                .replaceAll("$C:EMAIL$", person?.email ? person?.email : "")
                .replaceAll("$C:NAME$", person?.value ? `${person?.firstname ? person?.firstname : ""} ${person?.lastname ? person?.lastname : ""}` : "")
                .replaceAll("$C:GENDER$", person?.gender ? person?.gender : "")
                .replaceAll("$C:PAN$", person?.pannumber ? person?.pannumber : "")
                .replaceAll("$C:AADHAR$", person?.adharnumber ? person?.adharnumber : "")
                .replaceAll("$C:ADDRESS$", caddress)
                .replaceAll("$C:DOB$", person?.dateofbirth ? person?.dateofbirth : "")
                .replaceAll("$C:DOB$", person?.dateofbirth ? person?.dateofbirth : "")
                .replaceAll("$C:DOB$", person?.dateofbirth ? person?.dateofbirth : "")
                .replaceAll("$C:DOB$", person?.dateofbirth ? person?.dateofbirth : "")
                .replaceAll("$GROSS$", person?.gross ? person?.gross : "")
                .replaceAll("$BASIC$", person?.basic ? person?.basic : "")
                .replaceAll("$CONVEYANCE$", person?.conveyance ? person?.conveyance : "")
                .replaceAll("$MA$", person?.medallow ? person?.medallow : "")
                .replaceAll("$PRODALLOWANCE1$", person?.prodallow1 ? person?.prodallow1 : "")
                .replaceAll("$PRODALLOWANCE2$", person?.prodallow2 ? person?.prodallow2 : "")
                .replaceAll("$OTHERALLOW$", person?.otherallow ? person?.otherallow : "")
                .replaceAll("$PF$", person?.pf ? person?.pf : "")
                .replaceAll("$ESI$", person?.esi ? person?.esi : "")
                .replaceAll("$GENDERHIM/HER$", GenderHimHer)
                .replaceAll("$SALUTATION$", person?.prefix ? person?.prefix : "Mr/Ms")
                //   .replaceAll("$P:ADDRESS$", paddress)
                //   .replaceAll("$F.COMPANY$", "")
                //   .replaceAll("$F.BRANCH$", "")
                //   .replaceAll("$F.BRANCHADDRESS$", "")
                //   .replaceAll("$T.COMPANY$", "")
                //   .replaceAll("$T.COMPANYADDRESS$", "")
                //   .replaceAll("$GENDERHE/SHE$", GenderHeShe)
                //   .replaceAll("$GENDERHE/SHE/SMALL$", GenderHeShesmall)
                //   .replaceAll("$EMAIL$", employee?.email ? employee?.email : "")
                //   .replaceAll("$P:NUMBER$", employee?.contactpersonal ? employee?.contactpersonal : "")
                //   .replaceAll("$DOJ$", employee?.doj ? employee?.doj : "")
                //   .replaceAll("$EMPCODE$", employee?.empcode ? employee?.empcode : "")
                //   .replaceAll("$BRANCH$", employee?.branch ? employee?.branch : "")
                //   .replaceAll("$UNIT$", employee?.unit ? employee?.unit : "")
                //   .replaceAll("$DESIGNATION$", employee?.designation ? employee?.designation : "")
                //   .replaceAll("$C:NAME$", employee?.companyname ? employee?.companyname : "")
                //   .replaceAll("$TEAM$", employee?.team ? employee?.team : "")
                //   .replaceAll("$PROCESS$", employee?.process ? employee?.process : "")
                //   .replaceAll("$DEPARTMENT$", employee?.department ? employee.department : "")
                //   .replaceAll("$LWD$", employee?.reasondate ? employee?.reasondate : "")
                //   .replaceAll("$SHIFT$", employee?.shifttiming ? employee?.shifttiming : "")
                //   .replaceAll("$AC:NAME$", employee?.accname ? employee?.accname : "")
                //   .replaceAll("$AC:NUMBER$", employee?.accno ? employee?.accno : "")
                //   .replaceAll("$IFSC$", employee?.ifsc ? employee?.ifsc : "")
                //   .replaceAll("$AC:NUMBER$", employee?.accno ? employee?.accno : "")
                //   .replaceAll("$C:DATE$", date)
                //   .replaceAll("$C:TIME$", new Date().toLocaleTimeString())
                //   .replaceAll("$BREAK$", employeeBreak?.breakhours ? employeeBreak?.breakhours : "")
                //   .replaceAll("$F:NAME$", employee?.firstname ? employee?.firstname : "")
                //   .replaceAll("$L:NAME$", employee?.lastname ? employee?.lastname : "")
                //   .replaceAll("$WORKSTATION:NAME$", employee?.workstation ? employee?.workstation : "")
                //   .replaceAll("$WORKSTATION:COUNT$", employee?.workstation ? employee?.workstation?.length : "")
                //   .replaceAll("$SYSTEM:COUNT$", employee?.employeecount ? employee?.employeecount : "")
                .replaceAll("$UNIID$", newval ? newval : "")
                .replaceAll("$RSEAL$", sealPlacement ? `
                    <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
                    ` : "")
                .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
                      <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
              ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
                  <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
                ` : "")
                .replaceAll("$EMPLOYEESIGNATURE$", userESignature ? `
                  <span style="position: relative; display: inline-block;">
                      <img src="${userESignature}" alt="Signature" 
                          style="
                              position: absolute;
                              z-index: 10;
                              ${pageSizePdf === 'A3' ?
                        'width: 200px !important; height: 30px !important; top: -25px;' :
                        'width: 130px !important; height: 25px !important; top: -25px;'}
                              pointer-events: none;
                              background: transparent;
                          "
                      />
                  </span>
              ` : "")

                .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
            <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
                 ` : "")
                .replaceAll("$EMPLOYEESIGNATURE$", userESignature ? `
                  <span style="display: inline-flex; flex-direction: column; align-items: center; text-align: center;">
                      <img src="${userESignature}" alt="Signature" style="${pageSizePdf === 'A3' ? 'width: 200px !important; height: 30px !important;' : 'width: 130px !important; height: 25px !important;'}"/>
                  </span>
              ` : "");

            const answer = [];
            answer.push({
                empname: person?.value,
                email: person?.email,
                candidateid: person?._id,
                template: documentPrepartion?.template,
                documentname: documentPrepartion?.documentname,
                issuingauthority: documentPrepartion?.issuingauthority,
                company: String(documentPrepartion.company),
                branch: String(documentPrepartion.branch),
                autoid: newval,
                designation: String(documentPrepartion.designation),
                rounds: selectedRoundValues,
                data: findMethod,
                referenceno: newvalRefNo,
                pagenumberneed: String(documentPrepartion.pagenumberneed),
                documentneed: String(documentPrepartion.documentneed),
                proption: String(documentPrepartion.proption),
                tempcode: templateCreationValue?.tempcode,
                watermark: waterMarkText,
                qrcodeNeed: qrCodeNeed,
                qrcode: imageUrl,
                signature: signature,
                seal: sealPlacement,
                frommailemail: fromEmail,
                pageheight: agendaEditStyles.height,
                pagewidth: agendaEditStyles.width,
                printoptions: documentPrepartion?.printoptions,
                header: head,
                footer: foot,
                headvalue: headvalueAdd,
                pagesize: pageSizePdf,
                sign: documentPrepartion.signature,
                sealing: documentPrepartion.seal,
                orientation: agendaEditStyles.orientation
            })

            setCheckingArray((prev) => [...prev, ...answer]);
            setIndexViewQuest(1)

            //   }
            setDocumentPrepartion({
                ...documentPrepartion,
                person: "Please Select Person",
                pagenumberneed: "All Pages",
                issuingauthority: "Please Select Issuing Authority",
                sort: "Please Select Sort",
                attendancedate: "",
                // documentneed: "Print Document",
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
            });
            setSelectedEmployeeValues([])
            setSelectedEmployee([])
            setIndexViewQuest(1)
        }
        catch (err) {
            console.log(err, 'err 2862')

            setLoadingGeneratingDatas(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const regex = /\$[A-Z]+\$/g;

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
            let res_freq = await axios.post(`${SERVICE.ACCESSIBLEBRANCHALL_CANDIDATE_DOCUMENTPREPARATION}`, {
                assignbranch: accessbranchs
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // console.log(res_freq?.data, 'res_freq?.data')
            const answer = res_freq?.data?.candidatedocumentPreparation?.length > 0 ? res_freq?.data?.candidatedocumentPreparation?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                roundname: item.rounds?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
                date: moment(item.date).format("DD-MM-YYYY"),
            })) : [];

            setTemplateCreationArrayCreate(answer);
            // setChanged(`ChangedStatus${res_freq?.data?.overalldocuments?.length}`)
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const fetchCandidateDocuments = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let res_freq = await axios.get(`${SERVICE.CANDIDATE_DOCUMENT_DUPLICATE_CHECKING}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTemplateCreationArray(res_freq?.data?.candidatedocumentPreparation);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchCandidateDocuments();
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
                return axios.delete(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${item}`, {
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
    const getUpdatePrintingStatus = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                printingstatus: "Printed",
                $inc: { printedcount: 1 },
            });
            setChanged(e)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchEmailForUser = async (e, emailformat, fromemail, ccemail, bccemail) => {
        setLoading(true);
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
            setLoadingMessage('Document is preparing...');
            let response = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            handleClickCloseLetterHead();
            const tempElementEmail = document?.createElement("div");
            tempElementEmail.innerHTML = emailformat;
            let textedEmail = tempElementEmail.innerHTML;
            let findMethodEmail = textedEmail
                .replaceAll("$TEMPLATENAME$", response.data.scandidateDocumentPreparation?.template ? response.data.scandidateDocumentPreparation?.template : "")
                .replaceAll("$REFERENCEID$", response.data.scandidateDocumentPreparation?.templateno ? response.data.scandidateDocumentPreparation?.templateno : "")
                .replaceAll("$CANDIDATENAME$", response.data.scandidateDocumentPreparation?.person ? response.data.scandidateDocumentPreparation?.person : "")
                .replaceAll("$COMPANYNAME$", isUserRoleAccess?.companyname ? isUserRoleAccess?.companyname : "")
                .replaceAll("$DESIGNATION$", isUserRoleAccess?.designation ? isUserRoleAccess?.designation : "")
                .replaceAll("$COMPANY$", isUserRoleAccess?.company ? isUserRoleAccess?.company : "");

            const pdfElement = document.createElement("div");
            pdfElement.innerHTML = response.data.scandidateDocumentPreparation.document;

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
                    if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "All Pages") {
                        const textY = footerY - 3;
                        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
                    } else if (response?.data?.scandidateDocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
                        const textY = footerY - 3;
                        doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
                    }
                    // Add QR code and statement only on the last page

                    if (response?.data?.scandidateDocumentPreparation?.qrCodeNeed) {
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


            return new Promise((resolve, reject) => {
                html2pdf()
                    .from(pdfElement)
                    .set({
                        margin: response.data.scandidateDocumentPreparation?.pagesize == "A3"
                            ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                                : (head === "" && foot !== "") ? [20, 15, 45, 15]
                                    : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                                        [20, 15, 20, 15])

                            :
                            ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                                : (head === "" && foot !== "") ? [15, 15, 45, 15]
                                    : (head !== "" && foot === "") ? [30, 15, 15, 15] : [15, 15, 15, 15]),
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: {
                            unit: "mm",
                            format: [
                                parseFloat(response.data.scandidateDocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                                parseFloat(response.data.scandidateDocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
                            ],
                            orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
                        },
                        lineHeight: 0, // Increased line spacing
                        fontSize: 12,
                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                    }).toPdf().get('pdf').then(async (pdf) => {
                        const img = new Image();
                        img.src = response.data.scandidateDocumentPreparation?.watermark;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.globalAlpha = 0.1;
                            ctx.drawImage(img, 0, 0);
                            const watermarkImage = canvas.toDataURL('image/png');

                            const qrImg = new Image();
                            qrImg.src = response.data.scandidateDocumentPreparation?.qrcode;
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
                                formData.append('file', pdfBlob, `${response.data.scandidateDocumentPreparation?.template}_${response.data.scandidateDocumentPreparation?.person}.pdf`);

                                // Convert Blob to base64 string
                                const reader = new FileReader();
                                reader.readAsDataURL(pdfBlob);
                                reader.onloadend = async () => {
                                    setLoadingMessage('Document is converting to Email format...');
                                    const base64String = reader.result.split(',')[1]; // Extract base64 string without data:image/jpeg;base64,

                                    let res_module = await axios.post(SERVICE.CANDIDATE_DOCUMENT_PREPARATION_MAIL, {
                                        document: base64String,
                                        companyname: response?.data?.scandidateDocumentPreparation?.person,
                                        letter: response?.data?.scandidateDocumentPreparation?.template,
                                        email: response?.data?.scandidateDocumentPreparation?.email,
                                        emailformat: findMethodEmail,
                                        fromemail: fromemail,
                                        ccemail: ccemail,
                                        bccemail: bccemail,
                                        tempid: response?.data?.scandidateDocumentPreparation?.templateno

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
                        if (response?.data?.scandidateDocumentPreparation?.mail === "Send") {
                            let res = await axios.put(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
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
        }
    };



    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.scandidateDocumentPreparation);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_CANDIDATE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.scandidateDocumentPreparation);
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
                    saveAs(blob, "Candidate Documents Preparation.png");
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
        documentTitle: "Candidate Documents Preparation",
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
            field: "person",
            headerName: "Person",
            flex: 0,
            width: 150,
            hide: !columnVisibility.person,
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
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "roundname",
            headerName: "Rounds",
            flex: 0,
            width: 150,
            hide: !columnVisibility.roundname,
            headerClassName: "bold-header",
        },
        // {
        //     field: "printedcount",
        //     headerName: "Printed Count",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.printedcount,
        //     headerClassName: "bold-header",
        // },
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
            field: "email",
            headerName: "Email",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.email,
            cellRenderer: (params) => (
                <Grid>
                    {isUserRoleCompare?.includes("menuemployeedocumentpreparationmail") && (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: params?.data?.mail === "Send" ? "#4CAF50" : "#F44336", // Green for "Send", Red otherwise
                                color: "white",
                                "&:hover": {
                                    backgroundColor: params?.data?.mail === "Send" ? "#45A049" : "#D32F2F",
                                },
                            }}
                            onClick={() => {
                                extractEmailFormat(params.data, params.data.person, params.data.id)
                            }}

                        >
                            {params?.data?.mail}
                        </Button>
                    )}
                </Grid>
            ),

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
                    {isUserRoleCompare?.includes("dcandidatedocumentpreparation") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcandidatedocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("icandidatedocumentpreparation") && (
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
            person: item.person,
            templateno: item.templateno,
            template: item.template,
            mail: item.mail,
            roundname: item.roundname,
            printingstatus: item.printingstatus,
            // printedcount: item.printedcount,
            company: item.company === "Please Select Company" ? "" : item.company,
            designation: item.designation === "Please Select Designation" ? "" : item.designation,
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
            <Headtitle title={"CANDIDATE DOCUMENT PREPARATION"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Candidate Document Preparation"
                modulename="Human Resources"
                submodulename="HR Documents"
                mainpagename="Candidate Document Preparation"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("acandidatedocumentpreparation") && (


                    <Box sx={userStyle.selectcontainer}>
                        <Typography>
                            Add Candidate Document Preparation
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
                                                    designation: "Please Select Designation",
                                                });
                                                setDesignationOptions([])
                                                setRoundNames([])
                                                setEmployeeNameOptions([])
                                                setSelectedEmployee([])
                                                setSelectedEmployeeValues([])
                                                setSelectedRounds([])
                                                setSelectedRoundValues([])
                                                setTemplateValues([])
                                                BranchDropDowns(e.value)
                                                setToCompanyAddressData("");
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
                                                    designation: "Please Select Designation",
                                                });
                                                // setDesignationOptions([])
                                                setRoundNames([])
                                                setEmployeeNameOptions([])
                                                setSelectedEmployee([])
                                                setSelectedEmployeeValues([])
                                                setSelectedRounds([])
                                                setSelectedRoundValues([])
                                                TemplateDropdowns(e.value, documentPrepartion.company)
                                                fetchDesignation(documentPrepartion.company, e.value)
                                                fetchIsssuingAuthorityManual(e.value)
                                                setBranchAddress(e)
                                                IdentifyUserCode(e)
                                                setToCompanyAddressData("");
                                                setDesignationOptions([]);

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
                                            options={templateValues}
                                            value={{ label: documentPrepartion.template, value: documentPrepartion.template }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    template: e.value,
                                                    documentname: e.documentname,
                                                    sign: "Please Select Signature",
                                                    sealing: "Please Select Seal",
                                                    designation: "Please Select Designation",

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
                                            Designation<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={designationOptions}
                                            value={{ label: documentPrepartion.designation, value: documentPrepartion.designation }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    designation: e.value,
                                                    jobopeningid: e.jobopeningid
                                                });
                                                fetchRounds(e.value)
                                                setSelectedEmployee([])
                                                setSelectedEmployeeValues([])
                                                setSelectedRounds([])
                                                setSelectedRoundValues([])
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Rounds<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={roundNames}
                                            value={selectedRounds}
                                            onChange={(e) => {
                                                handleRoundsChange(e);
                                            }}
                                            valueRenderer={customValueRendererRounds}
                                            labelledBy="Please Select Rounds"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Person<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={employeeNameOptions}
                                            value={selectedEmployee}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                            }}
                                            valueRenderer={customValueRendererEmployee}
                                            labelledBy="Please Select Emoployee"
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
                                        <Typography>
                                            Document Need
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={[{ label: "Print Document", value: "Print Document" }, { label: "Candidate Approval", value: "Candidate Approval" }]}
                                            value={{ label: documentPrepartion.documentneed, value: documentPrepartion.documentneed }}
                                            onChange={(e) => {
                                                setDocumentPrepartion({
                                                    ...documentPrepartion,
                                                    documentneed: e.value,
                                                    printoptions: "Please Select Print Options",
                                                });
                                            }}
                                        />

                                    </FormControl>
                                </Grid>

                                {documentPrepartion?.documentneed === "Candidate Approval" &&
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Print Option<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    maxMenuHeight={300}
                                                    options={HeaderDropDowns}
                                                    value={{ label: documentPrepartion.printoptions, value: documentPrepartion.printoptions }}
                                                    onChange={(e) => {
                                                        setDocumentPrepartion({
                                                            ...documentPrepartion,
                                                            printoptions: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {documentPrepartion.printoptions === "With Letter Head" && (
                                            <Grid item md={documentPrepartion.printoptions === "With Letter Head" ? 4 : 3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        With Letter Head <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        maxMenuHeight={300}
                                                        options={WithHeaderOptions}
                                                        value={selectedHeadOptAdd}
                                                        onChange={handleHeadChangeAdd}
                                                        valueRenderer={customValueRenderHeadFromAdd}
                                                    />
                                                </FormControl>
                                            </Grid>)}
                                    </>

                                }

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
                            {checkingArray?.map((text, index) => {
                                if (index === (indexViewQuest - 1)) {
                                    return (
                                        < Grid item md={12} sm={12} xs={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    <b> Documents List</b>
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item md={11} sm={12} xs={12}>
                                                        <ReactQuill style={{ height: "max-content", minHeight: "150px" }}
                                                            value={text.data}
                                                            readOnly={documentPrepartion?.employeemode !== "Manual"}
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
                                                        <br></br>
                                                        <br></br>
                                                        <br></br>
                                                        <br></br>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                                            {(indexViewQuest > 1 && (indexViewQuest) <= checkingArray?.length) ?
                                                                <Button variant="contained" onClick={handlePrevPage}>Prev Page</Button>
                                                                : null
                                                            }
                                                            {(((indexViewQuest) < checkingArray?.length)) ?
                                                                <Button variant="contained" onClick={handleNextPage}>Next Page</Button>
                                                                : null
                                                            }

                                                        </div>
                                                    </Grid>
                                                    <Grid item md={1} sm={12} xs={12}>
                                                        <Button
                                                            sx={userStyle.buttondelete}
                                                            onClick={(e) => {
                                                                HandleDeleteText(index)
                                                            }}
                                                        >
                                                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                                                        </Button>

                                                    </Grid>
                                                </Grid>
                                            </FormControl>

                                        </Grid>
                                    )
                                }
                            }
                            )}
                            <div>
                                {/* <QRCode value={generateRedirectUrl()} /> */}

                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    {checkingArray?.length > 0 ? (
                                        <LoadingButton
                                            loading={buttonLoadingPreview}
                                            variant="contained"
                                            color="primary"
                                            sx={userStyle.buttonadd}
                                            onClick={() => documentPrepartion?.documentneed === "Candidate Approval" ? handlePreviewDocument(indexViewQuest - 1) : handleClickOpenLetterHeader("Preview")}
                                        >
                                            Preview
                                        </LoadingButton>
                                    ) : (
                                        ""
                                    )}
                                </Grid>
                                &ensp;
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    {checkingArray?.length > 0 ? (
                                        <LoadingButton
                                            loading={buttonLoading}
                                            variant="contained"
                                            color="primary"
                                            sx={userStyle.buttonadd}
                                            // onClick={getDownloadFile}
                                            onClick={() => documentPrepartion?.documentneed === "Candidate Approval" ? handlePrintDocument(indexViewQuest - 1) : handleClickOpenLetterHeader("Print")}
                                        >
                                            Print
                                        </LoadingButton>
                                    ) : (
                                        ""
                                    )}
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <LoadingButton loading={btnload} variant="contained" color="primary" sx={buttonStyles.buttonsubmit} onClick={(e) => handleSubmited(e, indexViewQuest - 1)}>
                                        Save
                                    </LoadingButton>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handlecleared}>
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
            {isUserRoleCompare?.includes("lcandidatedocumentpreparation") && (
                <>
                    <Box sx={userStyle.container}>
                        <NotificationContainer />
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>List Candidate Document Preparation</Typography>
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
                                    {isUserRoleCompare?.includes("excelcandidatedocumentpreparation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvcandidatedocumentpreparation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printcandidatedocumentpreparation") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfcandidatedocumentpreparation") && (
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
                                    {isUserRoleCompare?.includes("imagecandidatedocumentpreparation") && (

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

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: "50px" }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            <b>View Candidate Document Preparation</b>
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
                                    <Typography variant="h6">Designation</Typography>
                                    <Typography>{documentPreparationEdit.designation}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Rounds</Typography>
                                    <Typography>{documentPreparationEdit.rounds?.map((t, i) => `${i + 1 + ". "}` + t).join("\n")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Issuing Authority</Typography>
                                    <Typography>{documentPreparationEdit.issuingauthority}</Typography>
                                </FormControl>
                            </Grid>
                            {(documentPreparationEdit.sealing !== "" && documentPreparationEdit.sealing !== "Please Select Seal") && <Grid item md={4} xs={12} sm={12}>
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
            {/* <Box>
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
                  </Box> */}
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
                                            handlePreviewDocument(indexViewQuest - 1)
                                        }
                                        else if (pagePopeOpen === "Print") {
                                            handlePrintDocument(indexViewQuest - 1)
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
                                        else if (pagePopeOpen === "Email") {
                                            fetchEmailForUser(emailValuePage?.id, emailValuePage?.convert, emailValuePage?.fromemail, emailValuePage?.ccemail, emailValuePage?.bccemail)
                                        }
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
            <Box>
                <Dialog
                    open={isInfoOpenImage}
                    onClose={handleCloseInfoImage}
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
                        <Button onClick={handleCloseInfoImage} sx={buttonStyles.btncancel}>Cancel</Button>
                        <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} autoFocus variant="contained" color='primary'
                            onClick={(e) => generatePDFs(e)}
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
                            Once Check the Document by clicking Preview button while Saving/Printing the Document whether it's perfectly alligned
                        </Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImagePrint} sx={buttonStyles.btncancel}>Cancel</Button>
                        <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
                            onClick={(e) => downloadPdfTesdt(indexViewQuest - 1)}
                        > Download </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Dialog
                open={progressOpen}
                maxWidth="md"
                fullWidth={false}
                PaperProps={{ style: progressDialogStyles.dialogPaper }}>
                <DialogTitle style={progressDialogStyles.dialogTitle}>📄 Checking Documents for Page Mode...</DialogTitle>
                <DialogContent>
                    <p style={progressDialogStyles.checkingText}>
                        Checking: <span style={progressDialogStyles.highlightText}>{currentFile}</span>
                    </p>
                    <div style={progressDialogStyles.progressBarContainer}>
                        <LinearProgress
                            variant="determinate"
                            value={progressValue}
                            style={progressDialogStyles.progressBar}
                        />
                    </div>
                    <p style={progressDialogStyles.percentageText}>{Math.round(progressValue)}% Completed</p>
                </DialogContent>
            </Dialog>
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
                filename={"Candidate Documents Preparation"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Candidate Documents Preparation Info"
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
            {/* <Loader loading={loadingAttMonth} message={loadingMessageAttMonth} />
            <Loader loading={loadingAttDate} message={loadingMessageAttDate} />
        
            <Loader loading={loadingProdDate} message={loadingMessageProdDate} /> */}
            <Loader loading={savingDatas} message={savingDatasMessage} />
        </Box>
    );
}

export default CandidateDocuments;