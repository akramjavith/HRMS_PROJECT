import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextareaAutosize, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
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

function CompanyDocumentPreparationPrinted({data , setData}) {
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
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
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
    const handleExportXL = (isfilter) => {

        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((item, index) => ({
                    "Sno": index + 1,
                    Date: item.date,
                    "Reference No": item.referenceno,
                    "Templateno": item.templateno,
                    Template: item.template,
                    Company: item.company === "Please Select Company" ? "" : item.company,
                    Branch: item.branch === "Please Select Branch" ? "" : item.branch,
                    "To Company": item.tocompany === "Please Select To Company" ? "" : item.tocompany,
                    "Printing Status": item.printingstatus,
                    "Issued Person Details": item.issuedpersondetails,
                    "Issuing Authority": item.issuingauthority,

                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                overallExcelDatas.map((item, index) => ({
                    "Sno": index + 1,
                    Date: moment(item.date).format("DD-MM-YYYY"),
                    "Reference No": item.referenceno,
                    "Templateno": item.templateno,
                    Template: item.template,
                    Company: item.company === "Please Select Company" ? "" : item.company,
                    Branch: item.branch === "Please Select Branch" ? "" : item.branch,
                    "To Company": item.tocompany === "Please Select To Company" ? "" : item.tocompany,
                    "Printing Status": item.printingstatus,
                    "Issued Person Details": item.issuedpersondetails,
                    "Issuing Authority": item.issuingauthority,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

    // get all branches
    const fetchOverallExcelDatas = async () => {
        const accessbranch = isAssignBranch
        ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }))
        : [];
    
        try {
           let res_freq = await axios.post(`${SERVICE.ACCESSIBLEBRANCHALL_COMPANY_DOCUMENTPREPARATION}`, {
            assignbranch: accessbranch
          }, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
            setOverallExcelDatas(res_freq?.data?.companydocumentPreparation?.filter(data => ["Printed", "Re-Printed"].includes(data?.printingstatus)))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchOverallExcelDatas();
    }, [isFilterOpen])
    const [headvalue, setHeadValue] = useState([])
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
        issuingauthority:true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    useEffect(() => {
        addSerialNumber();
    }, [templateCreationArray]);



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
            setIsDeleteOpenBulkcheckbox(true);
        }
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
    const [toCompanyOptions, setToCompanyOptions] = useState([]);
    const [BranchOptions, setBranchOptions] = useState([]);
    const [branchaddress, setBranchAddress] = useState("")
    const [toCompanyAddressData, setToCompanyAddressData] = useState("")
    const [allBranchValue, setAllBranchValue] = useState(false);
    const [UnitOptions, setUnitOptions] = useState([]);
    const [TeamOptions, setTeamOptions] = useState([]);
    const [employeenames, setEmployeenames] = useState([]);
    const [employeeMode, setEmployeeMode] = useState("Manual");

    const TemplateDropdowns = async () => {
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [uniqueCode, setUniqueCode] = useState("")

    const CompanyDropDowns = async () => {
        try {
            setCompanyOptions(isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [agendaEditStyles, setAgendaEditStyles] = useState({});
    const [generateData, setGenerateData] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlEdit, setImageUrlEdit] = useState('');
    let Allcodedata = `${BASE_URL}/document/documentpreparation/${encryptString(isUserRoleAccess.companyname)}/${isUserRoleAccess ? isUserRoleAccess?.empcode : ""}/${encryptString(documentPrepartion?.issuingauthority)}/${DateFormat}/${isUserRoleAccess?._id}`

    let AllcodedataEdit = `${BASE_URL}/document/documentpreparation/${encryptString(documentPreparationEdit.person)}/${companyNameEdit?._id}/${encryptString(documentPreparationEdit?.issuingauthority)}/${DateFormatEdit}`


    const generateQrCode = async () => {
        try {
            const response = await QRCode.toDataURL(`${Allcodedata}`);
            setImageUrl(response);
        } catch (error) {

        }
    }
    const generateQrCodeEdit = async () => {
        try {
            const response = await QRCode.toDataURL(` ${AllcodedataEdit}`);
            setImageUrlEdit(response);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
        try {
            let res_queue = await axios.get(SERVICE.COMPANY_DOCUMENT_PREPARATION_AUTOID, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let refNo = res_queue?.data?.documentPreparation?.length > 0 ?
                res_queue?.data?.documentPreparation[0]?.templateno :
                uniqueCode +  "#" + templateCreationValue?.tempcode + "_" + "0000";
            let codenum = refNo.split("_");
            return codenum;


        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

        try {

            const [res, res_emp, res_emp_break] = await Promise.all([
                axios.get(SERVICE.ALL_TEMPLATECREATION, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.USER_STATUS, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.SHIFT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                })
            ])
            let format = res?.data?.templatecreation?.find((data) => data?.name === documentPrepartion?.template?.split("--")[0]);
            let employee = res_emp?.data?.usersstatus?.find((data) => data?.companyname === employeename);
            setEmailUser(employee?.email)

            let employeeBreak = res_emp_break?.data?.shifts.find((data) => data?.name === employee?.shifttiming);
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
                    .replaceAll("$F.BRANCHADDRESS$", (branchaddress !== "" && toCompanyAddress) ? branchaddress?.branchaddress : "")
                    .replaceAll("$T.COMPANY$", documentPrepartion?.tocompany ? documentPrepartion?.tocompany : "")
                    .replaceAll("$T.COMPANYADDRESS$", toCompanyAddressData ? toCompanyAddressData : "")
                setChecking(findMethod)

            }
        }
        catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const value = uniqueCode  + "#" + templateCreationValue?.tempcode;
    const downloadPdfTesdt = (index) => {
        if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee is not eligibile to receieve any kind of documents"}</p>
                </>
            );
            handleClickOpenerr();
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
                    const footerY = (pageHeight * 0.99) - footerImgHeight; // Position at the bottom
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
                            pdf.save(`${checkingArray[index]?.template}_${checkingArray[index]?.empname}.pdf`);
                            setButtonLoading(false)
                            handleCloseInfoImagePrint();
                        };
                    };
                });
        }

    };
    const downloadPdfTesdtManual = () => {
        if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee is not eligibile to receieve any kind of documents"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {

            setButtonLoading(true)
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
                    const footerY = (pageHeight * 1) - footerImgHeight;
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
                            handleCloseInfoImagePrint();
                        };
                    };
                });
        }

    };


    const handlePreviewDocument = (index) => {
        if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
            setButtonLoadingPreview(false);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"This Employee is not eligible to receive any kind of documents"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (generateData) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {
                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoadingPreview(false)
                    setPreviewManual(true)
                }
                else {
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
                            const footerY = (pageHeight * 1) - footerImgHeight;
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
                                qrImg.src = checkingArray[index]?.qrcode;
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
            }).catch((error) => {
                console.error('Error generating PDF:', error);
            })
        }
    };

    const handlePreviewDocumentManual = () => {
        if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
            setButtonLoadingPreview(false);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"This Employee is not eligible to receive any kind of documents"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Fill All the Fields Which starts From $ and Ends with $"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (generateData) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setButtonLoadingPreview(true)
            downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {
                if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
                    setButtonLoadingPreview(false)
                    setPreviewManual(true)
                }
                else {
                    setPreviewManual(false)
                    setButtonLoadingPreview(true);
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
                            const footerY = (pageHeight * 1) - footerImgHeight;
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
                const footerY = (pageHeight * 1) - footerImgHeight;
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
                    const footerY = (pageHeight * 1) - footerImgHeight;
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
                    const footerY = (pageHeight * 1) - footerImgHeight;
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
        // Create a new div element to hold the Quill content
        await Promise.all(selectedRows?.map(async (item) => {
            setBulkPrintStatus(true)
            let response = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${item}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res = await axios.put(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${item}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                printingstatus: "Printed",
            });


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
                        };
                    };
                });
        }))
        await fetchBrandMaster();

        setChanged("dsdss")
        handleCloseBulkModcheckbox();
        setSelectedRows([]);
        setSelectAllChecked(false);
    };


    const downloadPdfTesdtTable = async (e) => {
        // Create a new div element to hold the Quill content
        let response = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

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
                        pdf.save(`${response.data.sdocumentPreparation?.template}.pdf`);
                    };
                };
            });
    };


    //set function to get particular row
    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // Alert delete popup
    let brandid = documentPreparationEdit?._id;
    const delBrand = async () => {
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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

        let newval = employeeControlPanel ? uniqueCode  + "#" + templateCreationValue?.tempcode + "_" + postfixLength :
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
                tocompanyaddress:toCompanyAddress,
                branch: String(documentPrepartion.branch),
                proption: String(documentPrepartion.proption),
                watermark: waterMarkText,
                pageheight: agendaEditStyles.height,
                pagewidth: agendaEditStyles.width,
                headvalue: headvalue,
                pagesize: pageSizePdf,
                head: head,
                foot: foot,
                qrCodeNeed: qrCodeNeed,
                sign: documentPrepartion.signature,
                sealing: documentPrepartion.seal,
                printingstatus: "Not-Printed",
                signature: signature,
                seal: sealPlacement,
                qrcode: imageUrl,
                issuedpersondetails: String(isUserRoleAccess.companyname),
                document: findMethod,
                // frommailemail: fromEmail,
                // mail: "Send",
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
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
            setEmployeeUserName("")
            window.scrollTo(0, 0)
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
            setBtnLoad(false)
        } catch (err) { setBtnLoad(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));

    const regex = /\$[A-Z]+\$/g;

    //get all brand master name.
    const fetchBrandMaster = async () => {
        setLoader(true);
        const accessbranch = isAssignBranch
        ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }))
        : [];
    
        try {
           let res_freq = await axios.post(`${SERVICE.ACCESSIBLEBRANCHALL_COMPANY_DOCUMENTPREPARATION}`, {
            assignbranch: accessbranch
          }, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });

            setTemplateCreationArrayCreate(res_freq?.data?.companydocumentPreparation?.filter(data => ["Printed", "Re-Printed"].includes(data?.printingstatus)))
            // ?.filter(data => data?.printingstatus === "Not-Printed")
            setTemplateCreationArray(res_freq?.data?.companydocumentPreparation);
            setAutoId(res_freq?.data?.companydocumentPreparation);
            setData("ChangedStatus")
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        TemplateDropdowns();
        CompanyDropDowns();
        fetchBrandMaster();
    }, []);
    useEffect(() => {
        fetchBrandMaster();
    }, [data]);

    const delAreagrpcheckbox = async () => {
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
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setData(selectedRows)
            await fetchBrandMaster();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
            await fetchBrandMaster();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    //get single row to edit....
    const getUpdatePrintingStatus = async (e) => {
        try {
            let res = await axios.put(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                printingstatus: "Printed",
            });
            await fetchBrandMaster();
            setChanged(e)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
        try {
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_COMPANY_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //frequency master name updateby edit page...
    let updateby = documentPreparationEdit?.updatedby;
    let addedby = documentPreparationEdit?.addedby;
    let frequencyId = documentPreparationEdit?._id;

    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "CompanyDocumentPreparationPrinted.png");
                });
            });
        }
    };
    // pdf.....
    const columns = [
        { title: "Date ", field: "date" },
        { title: "Reference No", field: "referenceno" },
        { title: "Template No", field: "templateno" },
        { title: "Template", field: "template" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "To Company", field: "tocompany" },
        { title: "Printing Status", field: "printingstatus" },
        { title: "Issued Person Details", field: "issuedpersondetails" },
        { title: "Issuing Authority", field: "issuingauthority" },
    ];
    const downloadPdf = (isfilter) => {


        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable?.map((item, index) => ({
                "serialNumber": index + 1,
                date: item.date,
                referenceno: item.referenceno,
                templateno: item.templateno,
                template: item.template,
                company: item.company === "Please Select Company" ? "" : item.company,
                branch: item.branch === "Please Select Branch" ? "" : item.branch,
                tocompany: item.tocompany === "Please Select To Company" ? "" : item.tocompany,
                printingstatus: item.printingstatus,
                issuedpersondetails: item.issuedpersondetails,
                issuingauthority: item.issuingauthority,


            })) :
            overallExcelDatas.map((item, index) => ({
                "serialNumber": index + 1,
                date: moment(item.date).format("DD-MM-YYYY"),
                referenceno: item.referenceno,
                templateno: item.templateno,
                template: item.template,
                company: item.company === "Please Select Company" ? "" : item.company,
                branch: item.branch === "Please Select Branch" ? "" : item.branch,
                tocompany: item.tocompany === "Please Select To Company" ? "" : item.tocompany,
                printingstatus: item.printingstatus,
                issuedpersondetails: item.issuedpersondetails,
                issuingauthority: item.issuingauthority,

            }))
            ;

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 5,
                cellWidth: 'auto'
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("CompanyDocumentPreparationPrinted.pdf");
    };
    // Excel
    const fileName = "CompanyDocumentPreparationPrinted";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "CompanyDocumentPreparationPrinted",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = templateCreationArrayCreate?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            date: moment(item.date).format("DD-MM-YYYY"),
        }));
        setItems(itemsWithSerialNumber);
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
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 80,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
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
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.document,
            renderCell: (params) => (
                <Grid>
                    <Button
                        variant="text"
                        onClick={() => {
                            downloadPdfTesdtTable(params.row.id);
                            getUpdatePrintingStatus(params.row.id)
                        }}
                        sx={userStyle.buttonview}
                    >
                        View
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
        // {
        //     field: "email",
        //     headerName: "Email",
        //     flex: 0,
        //     width: 150,
        //     minHeight: "40px",
        //     hide: !columnVisibility.email,
        //     renderCell: (params) => (
        //         <Grid>
        //             {isUserRoleCompare?.includes("menudocumentpreparationmail") && (
        //                 <Button
        //                     variant="contained"
        //                     color={params?.row?.mail === "Send" ? "success" : "error"}
        //                     onClick={() => {

        //                         extractEmailFormat(params.row.person, params.row.id)
        //                     }}
        //                     sx={userStyle.buttonview}
        //                 >
        //                     {params?.row?.mail}
        //                 </Button>
        //             )}
        //         </Grid>
        //     ),

        // },
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
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {isUserRoleCompare?.includes("edocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
                    {isUserRoleCompare?.includes("dcompanydocumentpreparation") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcompanydocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("icompanydocumentpreparation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
                                                fetchOverallExcelDatas()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvcompanydocumentpreparation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchOverallExcelDatas()
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
                                                    fetchOverallExcelDatas()
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
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
                        {isUserRoleCompare?.includes("bdcompanydocumentpreparation") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
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
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
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
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                            </>
                        }
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                            </Box>
                            <Box>
                                <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                    <FirstPageIcon />
                                </Button>
                                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                    <NavigateBeforeIcon />
                                </Button>
                                {pageNumbers?.map((pageNumber) => (
                                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                        {pageNumber}
                                    </Button>
                                ))}
                                {lastVisiblePage < totalPages && <span>...</span>}
                                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                    <NavigateNextIcon />
                                </Button>
                                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>
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
                                    <TableCell>{row.issuedpersondetails}</TableCell>
                                    <TableCell>{row.issuingauthority}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* this is info view details */}
            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            <b>Document Preparation Info</b>
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/*DELETE ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseMod}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

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
                        <Button onClick={handleCloseInfoImageManual} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton loading={btnload} autoFocus variant="contained" color='primary'
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
                        <Button onClick={handleCloseInfoImagePrint} sx={userStyle.btncancel}>Cancel</Button>
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
                        <Button onClick={handleCloseInfoImagePrintManual} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
                            onClick={(e) => downloadPdfTesdtManual(e)}
                        > Download </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={openDialogManual}
                    onClose={handleCloseManualCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Manual User's List
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    {/* <Typography>{moment(documentPreparationEdit.date).format("DD-MM-YYYY")}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reference No</Typography>
                                    {/* <Typography>{documentPreparationEdit.referenceno}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template No</Typography>
                                    {/* <Typography>{documentPreparationEdit.templateno}</Typography> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Template</Typography>
                                    {/* <Typography>{documentPreparationEdit.template}</Typography> */}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseManualCheck} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton
                            loading={buttonLoading}
                            autoFocus
                            variant="contained"
                            color='primary'
                        // onClick={(e) => downloadPdfTesdt(e)}
                        > Download
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
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
                            {( documentPreparationEdit.sign !== "") &&
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
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
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
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                        :
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                            fetchOverallExcelDatas()
                        }}
                    >
                        Export Over All Data
                    </Button>
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
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
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
            {/* Bulk delete ALERT DIALOG */}
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
            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>



            {/* Bulk delete ALERT DIALOG */}
            <Dialog open={isDeleteBulkOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" color="error" onClick={handleCloseBulkModalert}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
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
                        <Button onClick={handleCloseBulkModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <LoadingButton loading={bulkPrintStatus} autoFocus variant="contained" color="error" onClick={(e) => handleBulkPrint(e)}>
                            {" "}
                            OK{" "}
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <br />
            <Loader loading={loading} message={loadingMessage} />
            {/* <Loader loading={loadingAttMonth} message={loadingMessageAttMonth} />
            <Loader loading={loadingAttDate} message={loadingMessageAttDate} />
            <Loader loading={loadingProdDate} message={loadingMessageProdDate} /> */}
        </Box>
    );
}

export default CompanyDocumentPreparationPrinted;