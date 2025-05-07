import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextareaAutosize, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import "jspdf-autotable";
import axios from "axios";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import Selects from "react-select";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
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
import LoadingButton from "@mui/lab/LoadingButton";
import { BASE_URL } from "../../../services/Authservice";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
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

function CompanyDocumentPreparationPrinted({ data, setData }) {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const [loadingGeneratingDatas, setLoadingGeneratingDatas] = useState(false);
    const [loadingGeneratingMessages, setLoadingGeneratingMessage] = useState('Generating the set of Documents...!');
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

    let exportColumnNames = [
        'Date ',
        'Reference No',
        'Template No',
        'Template',
        'Company',
        'Branch',
        'To Company',
        'Printing Status',
        'Printed Count',
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
        'printedcount',
        'issuedpersondetails',
        'issuingauthority'
    ];

    const currentDateAttStatus = new Date();
    const currentYearAttStatus = currentDateAttStatus.getFullYear();

    const [fromEmail, setFromEmail] = useState("");
    const [qrCodeNeed, setQrCodeNeed] = useState(false)
    const [toCompanyAddress, setToCompanyAddress] = useState(false)
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
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
    const [templateCreationArray, setTemplateCreationArray] = useState([]);
    const [noticePeriodEmpCheck, setNoticePeriodEmpCheck] = useState(false);
    const [noticePeriodEmpCheckPerson, setNoticePeriodEmpCheckPerson] = useState(false);
    const [bulkPrintStatus, setBulkPrintStatus] = useState(false);
    const [templateCreationArrayCreate, setTemplateCreationArrayCreate] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        isAssignBranch
    } = useContext(UserRoleAccessContext);
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
    const [sealPlacement, setSealPlacement] = useState("");
    const [waterMarkText, setWaterMarkText] = useState("");
    const [signatureEdit, setSignatureEdit] = useState("");
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


    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    // AssignBranch For Users
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


    // const [headvalue, setHeadValue] = useState([])
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
        printedcount: true,
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
    const username = isUserRoleAccess.username;
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
    const [personId, setPersonId] = useState('');
    const [generateData, setGenerateData] = useState(false)
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
    const [employeeUserName, setEmployeeUserName] = useState("");
    const [CompanyOptions, setCompanyOptions] = useState([]);

    const [employeeMode, setEmployeeMode] = useState("Manual");

    const TemplateDropdowns = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.ALL_TEMPLATECREATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTemplateValues(
                res?.data?.templatecreation.map((data) => ({
                    ...data,
                    label: `${data.name}--(${data.company}--${data.branch})`,
                    value: `${data.name}--(${data.company}--${data.branch})`,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
                                    setLoadingGeneratingDatas(false)
                                };
                            } else {
                                addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                                // Save the PDF
                                pdf.save(`${response?.data?.sdocumentPreparation?.template}.pdf`);
                                setBulkPrintStatus(false)
                                // pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                                handleClickCloseLetterHead();
                                setLoadingGeneratingDatas(false)
                            }

                        };
                    });
            }))

            await fetchBrandMaster();

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
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let brandid = documentPreparationEdit?._id;
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
            setData(brandid)
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));

    const regex = /\$[A-Z]+\$/g;

    //get all brand master name.
    const fetchBrandMaster = async () => {
        setLoader(true);
        const accessbranchs = accessbranch
            ? accessbranch.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }))
            : [];

        setPageName(!pageName);
        try {
            let res_freq = await axios.post(`${SERVICE.ACCESSIBLEBRANCHALL_COMPANY_DOCUMENTPREPARATION}`, {
                assignbranch: accessbranchs
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const final = res_freq?.data?.companydocumentPreparation?.length > 0 ? res_freq?.data?.companydocumentPreparation?.filter(data => ["Printed", "Re-Printed"].includes(data?.printingstatus)) : [];
            const answer = final?.length > 0 ? final?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
                referenceno: item.referenceno,
                templateno: item.templateno,
                template: item.template,
                mail: item.mail,
                printingstatus: item.printingstatus,
                printedcount: item.printedcount,
                company: item.company === "Please Select Company" ? "" : item.company,
                tocompany: item.tocompany === "Please Select To Company" ? "" : item.tocompany,
                branch: item.branch === "Please Select Branch" ? "" : item.branch,
                issuedpersondetails: item.issuedpersondetails,
                issuingauthority: item.issuingauthority,
            })) : [];
            setTemplateCreationArrayCreate(answer)
            // ?.filter(data => data?.printingstatus === "Not-Printed")
            setTemplateCreationArray(res_freq?.data?.companydocumentPreparation);
            setAutoId(res_freq?.data?.companydocumentPreparation);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        TemplateDropdowns();
    }, []);
    useEffect(() => {
        fetchBrandMaster();
    }, [data]);

    const delAreagrpcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false)
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setData(selectedRows)
            await fetchBrandMaster();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
                await fetchBrandMaster();
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
                const footerY = (pageHeight * 1) - footerImgHeight; // Position at the bottom
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
            handleClickOpeninfo();
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
                    saveAs(blob, "Company Document Printed List.png");
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
        documentTitle: "CompanyDocumentPreparationPrinted",
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



    const [HeaderOptionsButton, setHeaderOptionsButton] = useState(false);
    // letter headd options
    const HeaderDropDowns = [{ label: "With Letter Head", value: "With Letter Head" }, { label: "Without Letter Head", value: "Without Letter Head" }];
    const WithHeaderOptions = [{ value: "With Head content", label: "With Head content" }, { value: "With Footer content", label: "With Footer content" }]
    const [isOpenLetterHeadPopup, setIsLetterHeadPopup] = useState(false)
    const [headerOptions, setHeaderOptions] = useState("Please Select Print Options")
    const [pagePopeOpen, setPagePopUpOpen] = useState("")
    const [DataTableId, setDataTableId] = useState("")
    const [selectedHeadOpt, setSelectedHeadOpt] = useState([]);
    const [headvalue, setHeadValue] = useState([]);
    const [emailValuePage, setEmailValuePage] = useState({});
    const handleHeadChange = (options) => {
        let value = options.map((a) => {
            return a.value;
        })
        setHeadValue(value)
        if (!["Preview Manual", "Print Manual"]?.includes(pagePopeOpen)) {
            if (value?.length === 1 && value?.includes("With Head content")) {
                setHeader(personId?.letterheadcontentheader[0]?.preview)
            }
            else if (value?.length === 1 && value?.includes("With Footer content")) {
                setfooter(personId?.letterheadcontentfooter[0]?.preview)
            }
            else if (value?.length > 1) {
                setHeader(personId?.letterheadcontentheader[0]?.preview)
                setfooter(personId?.letterheadcontentfooter[0]?.preview)
            }
            else {
                setHeader("")
                setfooter("")
            }
        }
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
            width: 40,
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
            field: "printedcount",
            headerName: "Printed Count",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.printedcount,

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
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
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
            printedcount: item.printedcount,
            company: item.company,
            tocompany: item.tocompany,
            branch: item.branch,
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




    return (
        <Box>
            <Headtitle title={"COMPANY DOCUMENT PREPARATION"} />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lcompanydocumentpreparation") && (
                <>
                    <Box sx={userStyle.container}>
                        <NotificationContainer />
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Company Documents Printed List</Typography>
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
                                                setFormat("xl")
                                                setIsFilterOpen(true)
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
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
                            <Button variant="contained" color="error" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
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
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Reference No</TableCell>
                            <TableCell>Template No</TableCell>
                            <TableCell>Template</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>To Company</TableCell>
                            <TableCell>Printing Status</TableCell>
                            <TableCell>Printed Count</TableCell>
                            <TableCell>Issued Person Details</TableCell>
                            <TableCell>Issuing Authority</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.referenceno}</TableCell>
                                    <TableCell>{row.templateno}</TableCell>
                                    <TableCell>{row.template}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.tocompany}</TableCell>
                                    <TableCell>{row.printingstatus}</TableCell>
                                    <TableCell>{row.printedcount}</TableCell>
                                    <TableCell>{row.issuedpersondetails}</TableCell>
                                    <TableCell>{row.issuingauthority}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                            {(documentPreparationEdit.sealing !== "" && documentPreparationEdit.sealing !== "Please Select Seal") && <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Seal</Typography>
                                    <Typography>{documentPreparationEdit.sealing}</Typography>
                                </FormControl>
                            </Grid>}
                            {(documentPreparationEdit.sign !== "" && documentPreparationEdit.sign !== "Please Select Signature") &&
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
                <Dialog open={isDeleteOpenBulkcheckbox} onClose={handleCloseBulkModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure you want print all ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseBulkModcheckbox} sx={buttonStyles.btncancel} >
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
                itemsTwo={items ?? []}
                filename={"Company Document Printed List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Company Document Printed Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={(e) => delBrand(brandid)}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAreagrpcheckbox}
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
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteBulkOpenalert}
                onClose={handleCloseBulkModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />

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
                                        // if (pagePopeOpen === "Preview") {
                                        //   handlePreviewDocument(indexViewQuest - 1)
                                        // }
                                        // else if (pagePopeOpen === "Print") {
                                        //   handlePrintDocument(indexViewQuest - 1)
                                        // }
                                        if (pagePopeOpen === "Table View") {
                                            downloadPdfTesdtTable(DataTableId)
                                        }
                                        else if (pagePopeOpen === "Table Print") {
                                            downloadPdfTesdtTablePrint(DataTableId)
                                        }
                                        else if (pagePopeOpen === "Bulk Print") {
                                            handleBulkPrint();
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

            <Loader loading={loading} message={loadingMessage} />
            <Loader loading={loadingGeneratingDatas} message={loadingGeneratingMessages} />
            {/* <Loader loading={loadingAttMonth} message={loadingMessageAttMonth} />
            <Loader loading={loadingAttDate} message={loadingMessageAttDate} />
            <Loader loading={loadingProdDate} message={loadingMessageProdDate} /> */}
        </Box>
    );
}

export default CompanyDocumentPreparationPrinted;