import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, InputLabel,
    TextareaAutosize,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Menu from '@mui/material/Menu';
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from "@mui/icons-material/Delete";
import Selects from "react-select";
import { FaExpand, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
function TempControlPanel() {

    const [btnSubmit, setBtnSubmit] = useState(false);
    const [btnSubmitEdit, setBtnSubmitEdit] = useState(false);
    const [toCompanyname, setToCompanyname] = useState("");
    const [toAddress, setToAddress] = useState("")
    const [todoscheckToCompany, setTodoscheckToCompany] = useState([]);
    const [toCompanynameEdit, setToCompanynameEdit] = useState("")
    const [toAddressEdit, setToAddressEdit] = useState("")
    const [todoscheckToCompanyEdit, setTodoscheckToCompanyEdit] = useState([]);





    const [purpose, setPurpose] = useState({ purposename: "" });
    const [isClearOpenalert, setClearOpenalert] = useState(false);
    const [isAddOpenalert, setAddOpenalert] = useState(false);
    const [isDeletealert, setDeletealert] = useState(false);
    const [isBulkDelOpenalert, setBulkDelOpenalert] = useState(false);
    const [isUpdateOpenalert, setUpdateOpenalert] = useState(false);
    const [assignedByArray, setAssignebyArray] = useState([])
    const [assignedByArrayEdit, setAssignedbyArrayEdit] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [purposeEdit, setPurposeEdit] = useState({ purposename: "" })
    const [sources, setAssignedby] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allSourceedit, setAllSourceedit] = useState([]);
    const [docBodyHeader, setDocBodyHeader] = useState("Please Select Document");
    const [docBodyHeader2, setDocBodyHeader2] = useState("Please Select Document");
    const [docBodyHeader3, setDocBodyHeader3] = useState("Please Select Document");
    const [docBodyHeader4, setDocBodyHeader4] = useState("Please Select Document");
    const [docBodyHeader5, setDocBodyHeader5] = useState("Please Select Document");
    const [docBodyHeader6, setDocBodyHeader6] = useState("Please Select Document");
    const [docBodyHeader7, setDocBodyHeader7] = useState("Please Select Document");
    const [docBodyHeader8, setDocBodyHeader8] = useState("Please Select Document");
    const [docBodyHeader9, setDocBodyHeader9] = useState("Please Select Document");
    const [docBodyHeader10, setDocBodyHeader10] = useState("Please Select Document");
    const [documentFilesDocumentContentHeader, setdocumentFilesDOcumentContentHeader] = useState([]);
    const [documentFilesDocumentContentFooter, setdocumentFilesDOcumentContentFooter] = useState([]);
    const [documentFilesDocumentBodyContent, setdocumentFilesDOcumentBodyContent] = useState([]);
    const [documentFilesDocumentFrontHeader, setdocumentFilesDOcumentFrontHeader] = useState([]);
    const [documentFilesDocumentFrontFooter, setdocumentFilesDOcumentFrontFooter] = useState([]);
    const [documentFilesDocumentBackHeader, setdocumentFilesDOcumentBackHeader] = useState([]);
    const [documentFilesDocumentBackFooter, setdocumentFilesDOcumentBackFooter] = useState([]);
    const [documentFilesDocumentContentHeaderView, setdocumentFilesDOcumentContentHeaderView] = useState([]);
    const [documentFilesDocumentContentFooterView, setdocumentFilesDOcumentContentFooterView] = useState([]);
    const [documentFilesDocumentBodyContentView, setdocumentFilesDOcumentBodyContentView] = useState([]);
    const [documentFilesDocumentFrontHeaderView, setdocumentFilesDOcumentFrontHeaderView] = useState([]);
    const [documentFilesDocumentFrontFooterView, setdocumentFilesDOcumentFrontFooterView] = useState([]);
    const [documentFilesDocumentBackHeaderView, setdocumentFilesDOcumentBackHeaderView] = useState([]);
    const [documentFilesDocumentBackFooterView, setdocumentFilesDOcumentBackFooterView] = useState([]);
    const [documentFiles, setdocumentFiles] = useState([]);
    const [documentFilesView, setdocumentFilesVIew] = useState([]);
    const [documentFilesSeal, setdocumentFilesSeal] = useState([]);
    const [documentFilesSignature, setdocumentFilesSignature] = useState([]);

    const [companyname, setCompanyname] = useState("");
    const [anchorElDoc, setAnchorElDoc] = useState(null);
    const [anchorElDoc2, setAnchorElDoc2] = useState(null);
    const [anchorElDoc3, setAnchorElDoc3] = useState(null);
    const [anchorElDoc4, setAnchorElDoc4] = useState(null);
    const [anchorElDoc5, setAnchorElDoc5] = useState(null);
    const [anchorElDoc6, setAnchorElDoc6] = useState(null);
    const [anchorElDoc7, setAnchorElDoc7] = useState(null);
    const [anchorElDoc8, setAnchorElDoc8] = useState(null);
    const [anchorElDoc9, setAnchorElDoc9] = useState(null);
    const [anchorElDoc10, setAnchorElDoc10] = useState(null);
    const [option, setOption] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [option5, setOption5] = useState('');
    const [option6, setOption6] = useState('');
    const [option7, setOption7] = useState('');
    const [option8, setOption8] = useState('');
    const [option9, setOption9] = useState('');
    const [option10, setOption10] = useState('');

    // 1St Option
    const handleClick = (event) => {
        setAnchorElDoc(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorElDoc(null);
    };

    const handleMenuItemClick = (selectedOption) => {
        setOption(selectedOption);
        handleClose();
        setDocBodyHeader("Please Select Document")
        setdocumentFilesDOcumentContentHeader([])
    };

    // 2nd 
    const handleClick2 = (event) => {
        setAnchorElDoc2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorElDoc2(null);
    };

    const handleMenuItemClick2 = (selectedOption) => {
        setOption2(selectedOption);
        handleClose2();
        setDocBodyHeader2("Please Select Document")
        setdocumentFilesDOcumentContentFooter([])
    };

    // 3rd 
    const handleClick3 = (event) => {
        setAnchorElDoc3(event.currentTarget);
    };
    const handleClose3 = () => {
        setAnchorElDoc3(null);
    };

    const handleMenuItemClick3 = (selectedOption) => {
        setOption3(selectedOption);
        handleClose3();
        setDocBodyHeader3("Please Select Document")
        setdocumentFilesDOcumentBodyContent([])
    };


    //4th 
    const handleClick4 = (event) => {
        setAnchorElDoc4(event.currentTarget);
    };
    const handleClose4 = () => {
        setAnchorElDoc4(null);
    };

    const handleMenuItemClick4 = (selectedOption) => {
        setOption4(selectedOption);
        handleClose4();
        setDocBodyHeader4("Please Select Document")
        setdocumentFilesDOcumentFrontHeader([])
    };

    //5th
    const handleClick5 = (event) => {
        setAnchorElDoc5(event.currentTarget);
    };
    const handleClose5 = () => {
        setAnchorElDoc5(null);
    };

    const handleMenuItemClick5 = (selectedOption) => {
        setOption5(selectedOption);
        handleClose5();
        setDocBodyHeader5("Please Select Document")
        setdocumentFilesDOcumentFrontFooter([])
    };

    //6th
    const handleClick6 = (event) => {
        setAnchorElDoc6(event.currentTarget);
    };
    const handleClose6 = () => {
        setAnchorElDoc6(null);
    };

    const handleMenuItemClick6 = (selectedOption) => {
        setOption6(selectedOption);
        handleClose6();
        setDocBodyHeader6("Please Select Document")
        setdocumentFilesDOcumentBackHeader([])
    };
    // 2nd 
    const handleClick7 = (event) => {
        setAnchorElDoc7(event.currentTarget);
    };
    const handleClose7 = () => {
        setAnchorElDoc7(null);
    };

    const handleMenuItemClick7 = (selectedOption) => {
        setOption7(selectedOption);
        handleClose7();
        setDocBodyHeader7("Please Select Document")
        setdocumentFilesDOcumentBackFooter([])
    };
    // 2nd 
    const handleClick8 = (event) => {
        setAnchorElDoc8(event.currentTarget);
    };
    const handleClose8 = () => {
        setAnchorElDoc8(null);
    };

    const handleMenuItemClick8 = (selectedOption) => {
        setOption8(selectedOption);
        handleClose8();
        setDocBodyHeader8("Please Select Document")
        setdocumentFiles([])
    };

    const handleClick9 = (event) => {
        setAnchorElDoc9(event.currentTarget);
    };
    const handleClose9 = () => {
        setAnchorElDoc9(null);
    };

    const handleMenuItemClick9 = (selectedOption) => {
        setOption9(selectedOption);
        handleClose9();
        setDocBodyHeader9("Please Select Document")
        setdocumentFilesSeal([])
    };

    const handleClick10 = (event) => {
        setAnchorElDoc10(event.currentTarget);
    };
    const handleClose10 = () => {
        setAnchorElDoc10(null);
    };

    const handleMenuItemClick10 = (selectedOption) => {
        setOption10(selectedOption);
        handleClose10();
        setDocBodyHeader10("Please Select Document")
        setdocumentFilesSignature([])
    };


    const [fromEmail, setFromEmail] = useState("")
    const [ccEmail, setCcEmail] = useState("")
    const [ccEmailTodo, setCcEmailTodo] = useState([])
    const [bccEmailTodo, setBccEmailTodo] = useState([])
    const [bccEmailTodoEdit, setBccEmailTodoEdit] = useState([])
    const [ccEmailTodoEdit, setCcEmailTodoEdit] = useState([])
    const [bccEmail, setBccEmail] = useState("")

    const [fromEmailEdit, setFromEmailEdit] = useState("")
    const [ccEmailEdit, setCcEmailEdit] = useState("")
    const [bccEmailEdit, setBccEmailEdit] = useState("")

    const [address, setAddress] = useState("")
    const [sealtype, setSealtype] = useState("Please Select Seal")
    const [sealname, setSealname] = useState("")
    const [sealtypeTodo, setSealtypeTodo] = useState("Please Select Seal")
    const [sealnameTodo, setSealnameTodo] = useState("")
    const [companyurl, setCompanyUrl] = useState("")
    const [company, setCompany] = useState("Please Select Company")
    const [branch, setBranch] = useState("Please Select Branch")
    const [unit, setUnit] = useState("Please Select Unit")
    const [team, setTeam] = useState("Please Select Team")
    const [employee, setEmployee] = useState("Please Select Employee")
    const [forSeal, setForSeal] = useState("None")
    const [topContent, setTopContent] = useState("")


    const [unitTodo, setUnitTodo] = useState("Please Select Unit")
    const [teamTodo, setTeamTodo] = useState("Please Select Team")
    const [employeeTodo, setEmployeeTodo] = useState("Please Select Employee")
    const [forSealTodo, setForSealTodo] = useState("None")
    const [topContentTodo, setTopContentTodo] = useState("")
    const [bottomContentTodo, setBottomContentTodo] = useState("")
    const [employeeOptionTodo, setEmployeeOptionTodo] = useState([]);
    const [signaturenameTodo, setSignaturenameTodo] = useState("")

    const [emailFormat, setEmailFormat] = useState("")
    const [emailFormatEdit, setEmailFormatEdit] = useState("")
    const [bottomContent, setBottomContent] = useState("")
    const [forSealEdit, setForSealEdit] = useState("None")
    const [topContentEdit, setTopContentEdit] = useState("")
    const [bottomContentEdit, setBottomContentEdit] = useState("")
    const [signaturename, setSignaturename] = useState("")
    const [todoscheckSeal, setTodoscheckSeal] = useState([]);
    const [todoscheckSignature, setTodoscheckSignature] = useState([]);
    const [companyOption, setCompanyOption] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [orgDocuments, setOrgDocuments] = useState([]);

    const [documentFilesDocumentContentHeaderEdit, setdocumentFilesDOcumentContentHeaderEdit] = useState([]);
    const [documentFilesDocumentContentFooterEdit, setdocumentFilesDOcumentContentFooterEdit] = useState([]);
    const [documentFilesDocumentBodyContentEdit, setdocumentFilesDOcumentBodyContentEdit] = useState([]);
    const [documentFilesDocumentFrontHeaderEdit, setdocumentFilesDOcumentFrontHeaderEdit] = useState([]);
    const [documentFilesDocumentFrontFooterEdit, setdocumentFilesDOcumentFrontFooterEdit] = useState([]);
    const [documentFilesDocumentBackHeaderEdit, setdocumentFilesDOcumentBackHeaderEdit] = useState([]);
    const [documentFilesDocumentBackFooterEdit, setdocumentFilesDOcumentBackFooterEdit] = useState([]);
    const [documentFilesEdit, setdocumentFilesEdit] = useState([]);
    const [documentFilesSealEdit, setdocumentFilesSealEdit] = useState([]);
    const [documentFilesSignatureEdit, setdocumentFilesSignatureEdit] = useState([]);

    const [companynameEdit, setCompanynameEdit] = useState("")
    const [addressEdit, setAddressEdit] = useState("")

    const [sealtypeEdit, setSealtypeEdit] = useState("Please Select Seal")
    const [sealtypeEditTodo, setSealtypeEditTodo] = useState("Please Select Seal")
    const [sealnameEdit, setSealnameEdit] = useState("")
    const [sealnameEditTodo, setSealnameEditTodo] = useState("")
    const [companyurlEdit, setCompanyUrlEdit] = useState("")
    const [companyEdit, setCompanyEdit] = useState("Please Select Company")
    const [branchEdit, setBranchEdit] = useState("Please Select Branch")
    const [unitEdit, setUnitEdit] = useState("Please Select Unit")
    const [unitEditTodo, setUnitEditTodo] = useState("Please Select Unit")
    const [teamEditTodo, setTeamEditTodo] = useState("Please Select Team")
    const [forSealEditTodo, setForSealEditTodo] = useState("None")
    const [topContentEditTodo, setTopContentEditTodo] = useState("")
    const [signaturenameEditTodo, setSignaturenameEditTodo] = useState("")
    const [bottomContentEditTodo, setBottomContentEditTodo] = useState("")
    const [employeeEditTodo, setEmployeeEditTodo] = useState("Please Select Employee")
    const [teamEdit, setTeamEdit] = useState("Please Select Team")
    const [employeeEdit, setEmployeeEdit] = useState("Please Select Employee")
    const [signaturenameEdit, setSignaturenameEdit] = useState("")

    const [todoscheckSealEdit, setTodoscheckSealEdit] = useState([]);
    const [todoscheckSignatureEdit, setTodoscheckSignatureEdit] = useState([]);

    const [companyOptionEdit, setCompanyOptionEdit] = useState([]);
    const [branchOptionEdit, setBranchOptionEdit] = useState([]);
    const [unitOptionEdit, setUnitOptionEdit] = useState([]);
    const [employeeOptionEdit, setEmployeeOptionEdit] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, allTeam } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Template Control Panel.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };



    const [anchorElDocEdit, setAnchorElDocEdit] = useState(null);
    const [anchorElDoc2Edit, setAnchorElDoc2Edit] = useState(null);
    const [anchorElDoc3Edit, setAnchorElDoc3Edit] = useState(null);
    const [anchorElDoc4Edit, setAnchorElDoc4Edit] = useState(null);
    const [anchorElDoc5Edit, setAnchorElDoc5Edit] = useState(null);
    const [anchorElDoc6Edit, setAnchorElDoc6Edit] = useState(null);
    const [anchorElDoc7Edit, setAnchorElDoc7Edit] = useState(null);
    const [anchorElDoc8Edit, setAnchorElDoc8Edit] = useState(null);
    const [anchorElDoc9Edit, setAnchorElDoc9Edit] = useState(null);
    const [anchorElDoc10Edit, setAnchorElDoc10Edit] = useState(null);
    const [optionEdit, setOptionEdit] = useState('');
    const [option2Edit, setOption2Edit] = useState('');
    const [option3Edit, setOption3Edit] = useState('');
    const [option4Edit, setOption4Edit] = useState('');
    const [option5Edit, setOption5Edit] = useState('');
    const [option6Edit, setOption6Edit] = useState('');
    const [option7Edit, setOption7Edit] = useState('');
    const [option8Edit, setOption8Edit] = useState('');
    const [option9Edit, setOption9Edit] = useState('');
    const [option10Edit, setOption10Edit] = useState('');
    const [docBodyHeaderEdit, setDocBodyHeaderEdit] = useState("Please Select Document");
    const [docBodyHeader2Edit, setDocBodyHeader2Edit] = useState("Please Select Document");
    const [docBodyHeader3Edit, setDocBodyHeader3Edit] = useState("Please Select Document");
    const [docBodyHeader4Edit, setDocBodyHeader4Edit] = useState("Please Select Document");
    const [docBodyHeader5Edit, setDocBodyHeader5Edit] = useState("Please Select Document");
    const [docBodyHeader6Edit, setDocBodyHeader6Edit] = useState("Please Select Document");
    const [docBodyHeader7Edit, setDocBodyHeader7Edit] = useState("Please Select Document");
    const [docBodyHeader8Edit, setDocBodyHeader8Edit] = useState("Please Select Document");
    const [docBodyHeader9Edit, setDocBodyHeader9Edit] = useState("Please Select Document");
    const [docBodyHeader10Edit, setDocBodyHeader10Edit] = useState("Please Select Document");


    // 1St Option
    const handleClickEdit = (event) => {
        setAnchorElDocEdit(event.currentTarget);
    };
    const handleCloseEdit = () => {
        setAnchorElDocEdit(null);
    };

    const handleMenuItemClickEdit = (selectedOption) => {
        setOptionEdit(selectedOption);
        handleCloseEdit();
        setDocBodyHeaderEdit("Please Select Document")
        setdocumentFilesDOcumentContentHeaderEdit([])
    };

    // 2nd 
    const handleClick2Edit = (event) => {
        setAnchorElDoc2Edit(event.currentTarget);
    };
    const handleClose2Edit = () => {
        setAnchorElDoc2Edit(null);
    };

    const handleMenuItemClick2Edit = (selectedOption) => {
        setOption2Edit(selectedOption);
        handleClose2Edit();
        setDocBodyHeader2Edit("Please Select Document")
        setdocumentFilesDOcumentContentFooterEdit([])
    };

    // 3rd 
    const handleClick3Edit = (event) => {
        setAnchorElDoc3Edit(event.currentTarget);
    };
    const handleClose3Edit = () => {
        setAnchorElDoc3Edit(null);
    };

    const handleMenuItemClick3Edit = (selectedOption) => {
        setOption3Edit(selectedOption);
        handleClose3Edit();
        setDocBodyHeader3Edit("Please Select Document")
        setdocumentFilesDOcumentBodyContentEdit([])
    };


    //4th 
    const handleClick4Edit = (event) => {
        setAnchorElDoc4Edit(event.currentTarget);
    };
    const handleClose4Edit = () => {
        setAnchorElDoc4Edit(null);
    };

    const handleMenuItemClick4Edit = (selectedOption) => {
        setOption4Edit(selectedOption);
        handleClose4Edit();
        setDocBodyHeader4Edit("Please Select Document")
        setdocumentFilesDOcumentFrontHeaderEdit([])
    };

    //5th
    const handleClick5Edit = (event) => {
        setAnchorElDoc5Edit(event.currentTarget);
    };
    const handleClose5Edit = () => {
        setAnchorElDoc5Edit(null);
    };

    const handleMenuItemClick5Edit = (selectedOption) => {
        setOption5Edit(selectedOption);
        handleClose5Edit();
        setDocBodyHeader5Edit("Please Select Document")
        setdocumentFilesDOcumentFrontFooterEdit([])
    };

    //6th
    const handleClick6Edit = (event) => {
        setAnchorElDoc6Edit(event.currentTarget);
    };
    const handleClose6Edit = () => {
        setAnchorElDoc6Edit(null);
    };

    const handleMenuItemClick6Edit = (selectedOption) => {
        setOption6Edit(selectedOption);
        handleClose6Edit();
        setDocBodyHeader6Edit("Please Select Document")
        setdocumentFilesDOcumentBackHeaderEdit([])
    };
    // 2nd 
    const handleClick7Edit = (event) => {
        setAnchorElDoc7Edit(event.currentTarget);
    };
    const handleClose7Edit = () => {
        setAnchorElDoc7Edit(null);
    };

    const handleMenuItemClick7Edit = (selectedOption) => {
        setOption7Edit(selectedOption);
        handleClose7Edit();
        setDocBodyHeader7Edit("Please Select Document")
        setdocumentFilesDOcumentBackFooterEdit([])
    };
    // 2nd 
    const handleClick8Edit = (event) => {
        setAnchorElDoc8Edit(event.currentTarget);
    };
    const handleClose8Edit = () => {
        setAnchorElDoc8Edit(null);
    };

    const handleMenuItemClick8Edit = (selectedOption) => {
        setOption8Edit(selectedOption);
        handleClose8Edit();
        setDocBodyHeader8Edit("Please Select Document")
        setdocumentFilesEdit([])
    };

    const handleClick9Edit = (event) => {
        setAnchorElDoc9Edit(event.currentTarget);
    };
    const handleClose9Edit = () => {
        setAnchorElDoc9Edit(null);
    };

    const handleMenuItemClick9Edit = (selectedOption) => {
        setOption9Edit(selectedOption);
        handleClose9Edit();
        setDocBodyHeader9Edit("Please Select Document")
        setdocumentFilesSealEdit([])
    };

    const handleClick10Edit = (event) => {
        setAnchorElDoc10Edit(event.currentTarget);
    };
    const handleClose10Edit = () => {
        setAnchorElDoc10Edit(null);
    };

    const handleMenuItemClick10Edit = (selectedOption) => {
        setOption10Edit(selectedOption);
        handleClose10Edit();
        setDocBodyHeader10Edit("Please Select Document")
        setdocumentFilesSignatureEdit([])
    };


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const [isInfoOpenImage, setInfoOpenImage] = useState(false);
    const [isInfoOpenImageEdit, setInfoOpenImageEdit] = useState(false);

    const handleClickOpenInfoImage = () => {
        setInfoOpenImage(true);
    };
    const handleCloseInfoImage = () => {
        setInfoOpenImage(false);
    };
    const handleClickOpenInfoImageEdit = () => {
        setInfoOpenImageEdit(true);
    };
    const handleCloseInfoImageEdit = () => {
        setInfoOpenImageEdit(false);
    };



    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsActive(false)
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
        companyurl: true,
        companyname: true,
        address: true,
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
        try {
            let res = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.stemplatecontrolpanel);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async (e) => {

        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${deleteSource?._id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchAssignedBy();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setDeletealert(true);
                setTimeout(() => {
                    setDeletealert(false);
                }, 1000)
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    const delSourcecheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchAssignedBy();
            setBulkDelOpenalert(true);
            setTimeout(() => {
                setBulkDelOpenalert(false);
            }, 1000)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    //add function 
    const sendRequest = async () => {
        setBtnSubmit(true);
        try {
            let res = await axios.post(`${SERVICE.TEMPLATECONTROLPANEL_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(company),
                branch: String(branch),
                emailformat: String(emailFormat),
                fromemail: String(fromEmail),
                ccemail: ccEmailTodo,
                bccemail: bccEmailTodo,
                letterheadcontentheader: documentFilesDocumentContentHeader,
                letterheadcontentfooter: documentFilesDocumentContentFooter,
                letterheadbodycontent: documentFilesDocumentBodyContent,
                companyurl: String(companyurl),
                idcardfrontheader: documentFilesDocumentFrontHeader,
                idcardfrontfooter: documentFilesDocumentFrontFooter,
                idcardbackheader: documentFilesDocumentBackHeader,
                idcardbackfooter: documentFilesDocumentBackFooter,
                companyname: String(companyname),
                address: String(address),
                sealtype: String(sealtype),
                toCompany: todoscheckToCompany,
                sealname: String(sealname),
                documentcompany: documentFiles,
                documentseal: todoscheckSeal,
                documentsignature: todoscheckSignature,
                templatecontrolpanellog: [{
                    company: String(company),
                    branch: String(branch),
                    emailformat: String(emailFormat),
                    fromemail: String(fromEmail),
                    ccemail: ccEmailTodo,
                    bccemail: bccEmailTodo,
                    letterheadcontentheader: documentFilesDocumentContentHeader,
                    letterheadcontentfooter: documentFilesDocumentContentFooter,
                    letterheadbodycontent: documentFilesDocumentBodyContent,
                    companyurl: String(companyurl),
                    toCompany: todoscheckToCompany,
                    idcardfrontheader: documentFilesDocumentFrontHeader,
                    idcardfrontfooter: documentFilesDocumentFrontFooter,
                    idcardbackheader: documentFilesDocumentBackHeader,
                    idcardbackfooter: documentFilesDocumentBackFooter,
                    companyname: String(companyname),
                    address: String(address),
                    sealtype: String(sealtype),
                    sealname: String(sealname),
                    documentcompany: documentFiles,
                    documentseal: todoscheckSeal,
                    documentsignature: todoscheckSignature,
                    createdAt: String(new Date()),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],

            });

            await fetchAssignedBy();
            handleCloseInfoImage();
            setPurpose({ purposename: "" })
            setAddOpenalert(true);
            setTimeout(() => {
                setAddOpenalert(false);
                setIsActive(false)
            }, 1000)
            setBtnSubmit(false);
            setSignTodoCreate(false)
            setSealTodoCreate(false)
            setIndexSealCreate(-1)
            setIndexSignatureCreate(-1)

        } catch (err) {
            setBtnSubmit(false);
            if (err.response.data.message.includes('The value of "offset" is out of range')) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Memory is Full!. Please delete anyone of the previous data in the log list."}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }

        }
    }


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = assignedByArray.some(item => item.company.toLowerCase() == company.toLowerCase() &&
            item.branch?.toLowerCase() === branch?.toLowerCase());

        if (company === "Please Select Company") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (branch === "Please Select Branch") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentContentHeader.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload Document Letter Head Content Header"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentContentFooter.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload Document Letter Head Content Footer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentBodyContent.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload Document Letter Head Body Content(Background)"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (companyurl === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Company URL"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentFrontHeader.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Front Header"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentFrontFooter.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Front Footer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentBackHeader.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Back Header"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentBackFooter.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Back Footer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (companyname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Company Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (address === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Address"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckToCompany?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Atlease Add one To Company and To Address Todo"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckSeal.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Add Seal Todo"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckSignature.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Add Signature Todo"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (fromEmail === undefined || fromEmail === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter From Email Adddress"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (!isValidEmail(fromEmail)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Valid From Email Adddress"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (emailFormat === undefined || emailFormat === "" || emailFormat === "<p><br></p>") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Email Format"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (sealTodoCreate || signTodoCreate) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Update the Todo and Submit the Data!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            handleClickOpenInfoImage();
        }
    }

    const handleCreateTodoToCompany = () => {
        const idTodoExist = todoscheckToCompany.some((item) => item?.toCompanyname?.toLowerCase() == toCompanyname?.toLowerCase())
        if (
            toCompanyname === "" || toCompanyname === undefined
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter To Company Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            toAddress === "" || toAddress === undefined
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter To Company Address"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            idTodoExist
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const newTodocheck = {
                toCompanyname: toCompanyname,
                toAddress: toAddress
            };
            setTodoscheckToCompany([...todoscheckToCompany, newTodocheck]);
            setToCompanyname("")
            setToAddress("")
        }
    };
    const handleCreateTodoToCompanyEdit = () => {
        const idTodoExist = todoscheckToCompanyEdit.some((item) =>
            item?.toCompanyname?.toLowerCase() == toCompanynameEdit?.toLowerCase())

        if (
            toCompanynameEdit === "" || toCompanynameEdit === undefined
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter To Company Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            toAddressEdit === "" || toAddressEdit === undefined
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter To Company Address"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            idTodoExist
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const newTodocheck = {
                toCompanyname: toCompanynameEdit,
                toAddress: toAddressEdit
            };
            setTodoscheckToCompanyEdit([...todoscheckToCompanyEdit, newTodocheck]);
            setToCompanynameEdit("")
            setToAddressEdit("")
        }
    };


    const handleClear = (e) => {
        e.preventDefault();
        setdocumentFilesDOcumentContentHeader([]);
        setdocumentFilesDOcumentContentFooter([]);
        setdocumentFilesDOcumentBodyContent([]);
        setdocumentFilesDOcumentFrontHeader([]);
        setdocumentFilesDOcumentFrontFooter([]);
        setdocumentFilesDOcumentBackHeader([]);
        setdocumentFilesDOcumentBackFooter([]);
        setdocumentFiles([]);
        setdocumentFilesVIew([]);
        setdocumentFilesSeal([]);
        setdocumentFilesSignature([]);
        setCompanyname("")
        setTodoscheckToCompany([])
        setToCompanyname("")
        setAddress("")
        setToAddress("")
        setSealtype("Please Select Seal")
        setSealname("")
        setCompanyUrl("")
        setCompany("Please Select Company")
        setBranch("Please Select Branch")
        setUnit("Please Select Unit")
        setTeam("Please Select Team")
        setEmployee("Please Select Employee")
        setSignaturename("")
        setBranchOption([]);
        setUnitOption([]);
        setEmployeeOption([]);
        setTodoscheckSeal([]);
        setTodoscheckSignature([]);
        setSignTodoCreate(false)
        setSealTodoCreate(false)
        setClearOpenalert(true);
        setIndexSealCreate(-1)
        setIndexSignatureCreate(-1)
        setTimeout(() => {
            setClearOpenalert(false);
        }, 1000)
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
        setEditingIndexSeal(-1);
        setEditingIndexcheck(-1)
        setSealTodo(false)
        setSealTodo(false)

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
    const getOrganizationalDocument = async () => {
        try {
            let res = await axios.get(`${SERVICE.IMAGEALL_ORGDOCUMENT}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const answer = res?.data?.document?.filter(data => data?.document?.length > 0)
            const mappedData = answer?.length > 0 ? answer?.map((data) => ({
                ...data,
                label: data?.name,
                value: data?.name,
                document: data?.document
            })) : []
            setOrgDocuments(mappedData);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    useEffect(() => {
        getOrganizationalDocument();
    }, [])

    const [todoscheckSealView, settodoscheckSealView] = useState([])
    const [documentFilesSignatureView, setdocumentFilesSignatureView] = useState([])

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const lastupdatedata = res?.data?.stemplatecontrolpanel?.templatecontrolpanellog?.length > 0 ?
                res?.data?.stemplatecontrolpanel?.templatecontrolpanellog[res?.data?.stemplatecontrolpanel?.templatecontrolpanellog?.length - 1] : []
            setPurposeEdit(lastupdatedata);
            setdocumentFilesDOcumentContentHeaderView(lastupdatedata?.letterheadcontentheader)
            setdocumentFilesDOcumentContentFooterView(lastupdatedata?.letterheadcontentfooter)
            setdocumentFilesDOcumentBodyContentView(lastupdatedata?.letterheadbodycontent)
            setdocumentFilesDOcumentFrontHeaderView(lastupdatedata?.idcardfrontheader)
            setdocumentFilesDOcumentFrontFooterView(lastupdatedata?.idcardfrontfooter)
            setdocumentFilesDOcumentBackHeaderView(lastupdatedata?.idcardbackheader)
            setdocumentFilesDOcumentBackFooterView(lastupdatedata?.idcardbackfooter)
            settodoscheckSealView(lastupdatedata?.documentseal)
            setdocumentFilesSignatureView(lastupdatedata?.documentsignature)
            setdocumentFilesVIew(lastupdatedata?.documentcompany)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setPurposeEdit(res?.data?.stemplatecontrolpanel);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [templateControlPanelIdEdit, setTemplateControlPanelIdEdit] = useState([])
    const [templateControlPanelEdit, setTemplateControlPanelEdit] = useState([])

    const getCodeEdit = async (e) => {
        try {
            handleClickOpenEdit();
            let res = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            fetchAssignedByEdit(e)
            setTemplateControlPanelIdEdit(res?.data?.stemplatecontrolpanel);
            const lastupdatedata = res?.data?.stemplatecontrolpanel?.templatecontrolpanellog?.length > 0 ?
                res?.data?.stemplatecontrolpanel?.templatecontrolpanellog[res?.data?.stemplatecontrolpanel?.templatecontrolpanellog?.length - 1] : []
            setTemplateControlPanelEdit(lastupdatedata);
            setCompanyEdit(lastupdatedata?.company)
            fetchBranchAllEdit(lastupdatedata?.company)
            setBranchEdit(lastupdatedata?.branch)
            setCompanyUrlEdit(lastupdatedata?.companyurl)
            setCompanynameEdit(lastupdatedata?.companyname)
            setAddressEdit(lastupdatedata?.address)
            setdocumentFilesEdit(lastupdatedata?.documentcompany)
            setdocumentFilesDOcumentContentHeaderEdit(lastupdatedata?.letterheadcontentheader)
            setdocumentFilesDOcumentContentFooterEdit(lastupdatedata?.letterheadcontentfooter)
            setdocumentFilesDOcumentBodyContentEdit(lastupdatedata?.letterheadbodycontent)
            setdocumentFilesDOcumentFrontHeaderEdit(lastupdatedata?.idcardfrontheader)
            setdocumentFilesDOcumentFrontFooterEdit(lastupdatedata?.idcardfrontfooter)
            setdocumentFilesDOcumentBackHeaderEdit(lastupdatedata?.idcardbackheader)
            setdocumentFilesDOcumentBackFooterEdit(lastupdatedata?.idcardbackfooter)
            setTodoscheckSealEdit(lastupdatedata?.documentseal)
            setTodoscheckSignatureEdit(lastupdatedata?.documentsignature)
            setEmailFormatEdit(lastupdatedata?.emailformat);
            setTodoscheckToCompanyEdit(lastupdatedata?.toCompany)
            setFromEmailEdit(lastupdatedata?.fromemail)
            setCcEmailTodoEdit(lastupdatedata?.ccemail)
            setBccEmailTodoEdit(lastupdatedata?.bccemail)
            await fetchUnitAllEdit(lastupdatedata?.branch);

        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };




    //Project updateby edit page...
    let updateby = templateControlPanelEdit?.updatedby;
    let addedby = purposeEdit?.addedby;
    let preallTemp = templateControlPanelIdEdit?.templatecontrolpanellog


    let subprojectsid = templateControlPanelIdEdit?._id;
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editingIndexSeal, setEditingIndexSeal] = useState(-1);
    const [sealTodo, setSealTodo] = useState(false);
    const [signTodo, setSignTodo] = useState(false);

    const handleEditTodoSeal = (index) => {
        setSealTodo(true)
        setEditingIndexSeal(index);
        setSealtypeEditTodo(todoscheckSealEdit[index]?.seal)
        setSealnameEditTodo(todoscheckSealEdit[index]?.name)

    }
    const handleUpdateTodoSeal = () => {
        const idTodoExist = todoscheckSealEdit?.filter((data, index) => index !== editingIndexcheck)?.some((item) => item?.name?.toLowerCase() == sealnameEditTodo?.toLowerCase() &&
            item?.seal?.toLowerCase() == sealtypeEditTodo?.toLowerCase())

        if (sealtypeEditTodo === "Please Select Seal") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Seal"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (sealnameEditTodo === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Seal Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (idTodoExist) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const newTodocheck = [...todoscheckSealEdit];
            newTodocheck[editingIndexSeal].seal = sealtypeEditTodo;
            newTodocheck[editingIndexSeal].name = sealnameEditTodo;
            setTodoscheckSealEdit(newTodocheck);
            setSealtypeEditTodo("Please Select Seal")
            setSealnameEditTodo("")
            setEditingIndexSeal(-1)
            setSealTodo(false)
        }
        // }
    };






    const handleEditTodocheck = (index) => {
        setSignTodo(true)
        setEditingIndexcheck(index);
        setUnitEditTodo(todoscheckSignatureEdit[index]?.unit)
        setTeamEditTodo(todoscheckSignatureEdit[index]?.team)
        setForSealEditTodo(todoscheckSignatureEdit[index]?.seal)
        setTopContentEditTodo(todoscheckSignatureEdit[index]?.topcontent)
        setBottomContentEditTodo(todoscheckSignatureEdit[index]?.bottomcontent)
        setSignaturenameEditTodo(todoscheckSignatureEdit[index]?.signaturename)
        fetchEmployeeAllEditTodo(companyEdit, branchEdit, todoscheckSignatureEdit[index]?.unit, todoscheckSignatureEdit[index]?.team);
        setEmployeeEditTodo(todoscheckSignatureEdit[index]?.employee)
    }


    const handleUpdateTodocheck = () => {
        const isSignatDup = todoscheckSignatureEdit?.filter((data, index) => index !== editingIndexcheck).some((item) =>
            item.unit?.toLowerCase() == unitEditTodo?.toLowerCase() &&
            item.team?.toLowerCase() == teamEditTodo?.toLowerCase() &&
            item.employee?.toLowerCase() == employeeEditTodo?.toLowerCase() &&
            item.signaturename?.toLowerCase() == signaturenameEditTodo?.toLowerCase()
        )

        if (unitEditTodo === "Please Select Unit") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            teamEditTodo === "Please Select Team"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            employeeEditTodo === "Please Select Employee"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealEditTodo === "For Seal" && (topContentEditTodo === "" || topContentEditTodo === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Top Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealEditTodo === "For Seal" && (bottomContentEditTodo === "" || bottomContentEditTodo === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Bottom Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            signaturenameEditTodo === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Signature Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            isSignatDup
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            const newTodoscheck = [...todoscheckSignatureEdit];
            newTodoscheck[editingIndexcheck].unit = unitEditTodo;
            newTodoscheck[editingIndexcheck].team = teamEditTodo;
            newTodoscheck[editingIndexcheck].employee = employeeEditTodo;
            newTodoscheck[editingIndexcheck].signaturename = signaturenameEditTodo;
            newTodoscheck[editingIndexcheck].seal = forSealEditTodo;
            newTodoscheck[editingIndexcheck].topcontent = topContentEditTodo;
            newTodoscheck[editingIndexcheck].bottomcontent = bottomContentEditTodo;
            newTodoscheck[editingIndexcheck].employee = employeeEditTodo;

            setTodoscheckSignatureEdit(newTodoscheck);
            setUnitEditTodo("Please Select Unit")
            setTeamEditTodo("Please Select Team")
            setEmployeeEditTodo("Please Select Employee")
            setSignaturenameEditTodo("")
            setdocumentFilesSignatureEdit([])
            setForSealEditTodo("None")
            setTopContentEditTodo("")
            setBottomContentEditTodo("")
            setEditingIndexcheck(-1)
            setSignTodo(false)
        }
    };
    //editing the single data...
    const sendEditRequest = async (e) => {
        setBtnSubmitEdit(true);
        e.preventDefault();
        try {
            let res = await axios.put(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(companyEdit),
                branch: String(branchEdit),
                letterheadcontentheader: documentFilesDocumentContentHeaderEdit,
                letterheadcontentfooter: documentFilesDocumentContentFooterEdit,
                letterheadbodycontent: documentFilesDocumentBodyContentEdit,
                companyurl: String(companyurlEdit),
                idcardfrontheader: documentFilesDocumentFrontHeaderEdit,
                idcardfrontfooter: documentFilesDocumentFrontFooterEdit,
                idcardbackheader: documentFilesDocumentBackHeaderEdit,
                idcardbackfooter: documentFilesDocumentBackFooterEdit,
                companyname: String(companynameEdit),
                toCompany: todoscheckToCompanyEdit,
                address: String(addressEdit),
                sealtype: String(sealtypeEdit),
                sealname: String(sealnameEdit),
                documentcompany: documentFilesEdit,
                documentseal: todoscheckSealEdit,
                documentsignature: todoscheckSignatureEdit,
                emailformat: emailFormatEdit,
                fromemail: String(fromEmailEdit),
                ccemail: ccEmailTodoEdit,
                bccemail: bccEmailTodoEdit,
                templatecontrolpanellog: [
                    ...preallTemp,
                    {
                        company: String(companyEdit),
                        branch: String(branchEdit),
                        letterheadcontentheader: documentFilesDocumentContentHeaderEdit,
                        letterheadcontentfooter: documentFilesDocumentContentFooterEdit,
                        letterheadbodycontent: documentFilesDocumentBodyContentEdit,
                        companyurl: String(companyurlEdit),
                        idcardfrontheader: documentFilesDocumentFrontHeaderEdit,
                        idcardfrontfooter: documentFilesDocumentFrontFooterEdit,
                        idcardbackheader: documentFilesDocumentBackHeaderEdit,
                        idcardbackfooter: documentFilesDocumentBackFooterEdit,
                        companyname: String(companynameEdit),
                        toCompany: todoscheckToCompanyEdit,
                        address: String(addressEdit),
                        sealtype: String(sealtypeEdit),
                        sealname: String(sealnameEdit),
                        documentcompany: documentFilesEdit,
                        documentseal: todoscheckSealEdit,
                        documentsignature: todoscheckSignatureEdit,
                        emailformat: emailFormatEdit,
                        fromemail: String(fromEmailEdit),
                        ccemail: ccEmailTodoEdit,
                        bccemail: bccEmailTodoEdit,
                        createdAt: String(new Date()),
                        updatedby: [
                            ...updateby,
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    }],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],

            });
            await fetchAssignedBy(); fetchSourceAll();
            handleCloseModEdit();
            handleCloseInfoImageEdit();
            setUpdateOpenalert(true);
            setTimeout(() => {
                setUpdateOpenalert(false);
            }, 1000)
            setBtnSubmitEdit(false);
            setEditingIndexcheck(-1);
            setEditingIndexSeal(-1);
            setSealTodo(false);
            setSignTodo(false);
        } catch (err) {
            setBtnSubmitEdit(false);

            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }

    const editSubmit = (e) => {
        e.preventDefault();

        const duplicate = assignedByArrayEdit?.some(item => item.company.toLowerCase() == companyEdit.toLowerCase() &&
            item.branch?.toLowerCase() === branchEdit?.toLowerCase());
        if (companyEdit === "Please Select Company") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (branchEdit === "Please Select Branch") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentContentHeaderEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload Document Letter Head Content Header"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentContentFooterEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload Document Letter Head Content Footer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentBodyContentEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload Document Letter Head Body Content(Background)"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (documentFilesDocumentFrontHeaderEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Front Header"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentFrontFooterEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Front Footer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentBackHeaderEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Back Header"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (documentFilesDocumentBackFooterEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Upload ID Card Back Footer"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (companyurlEdit === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Company URL"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (companynameEdit === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Company Name"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (addressEdit === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Address"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckToCompanyEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Atlease Add one To Company and To Address Todo"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckSealEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Add Seal Todo"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckSignatureEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Add Signature Todo"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (fromEmailEdit === undefined || fromEmailEdit === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter From Email Adddress"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (!isValidEmail(fromEmailEdit)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Valid From Email Address"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (emailFormatEdit === undefined || emailFormatEdit === "" || emailFormatEdit === "<p><br></p>") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Email Format"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (duplicate) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (signTodo || sealTodo) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Update the Todo and then Update!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            handleClickOpenInfoImageEdit();
        }
    }



    //get all Sub vendormasters.
    const fetchAssignedBy = async () => {
        const accessbranch = isAssignBranch
        ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
        }))
        : [];
        try {
            let res_vendor = await axios.post(SERVICE.ACCESSIBLETEMPLATECONTROLPANEL, {
                assignbranch: accessbranch
                }, {
                headers: {
                Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAssignedby(res_vendor?.data?.templatecontrolpanel);
            setAssignebyArray(res_vendor?.data?.templatecontrolpanel)
            setSourcecheck(true)
        } catch (err) { setSourcecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    //get all Sub vendormasters.
    const fetchAssignedByEdit = async (e) => {

        try {
            let res_vendor = await axios.get(SERVICE.DUPLICATIONTEMPLATECONTROLPANEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const answer = res_vendor?.data?.templatecontrolpanel?.filter(data => data?._id !== e)

            setAssignedbyArrayEdit(answer);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    //get all Sub vendormasters.
    const fetchSourceAll = async () => {
        const accessbranch = isAssignBranch
        ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
        }))
        : [];
        try {
            let res_meet = await axios.post(SERVICE.ACCESSIBLETEMPLATECONTROLPANEL, {
                assignbranch: accessbranch
                }, {
                headers: {
                Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAllSourceedit(res_meet?.data?.templatecontrolpanel.filter(item => item._id !== purposeEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Company URL", field: "companyurl" },
        { title: "Company Name", field: "companyname" },
        { title: "Address", field: "address" },
    ]

    const downloadPdf = () => {

        const doc = new jsPDF()
        doc.autoTable({
            theme: "grid",
            columns: columns.map(col => ({ ...col, dataKey: col.field })),
            body: rowDataTable
        })
        doc.save('Template Control Panel.pdf')
    }

    // Excel
    const fileName = "Template Control Panel";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Template Control Panel',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchAssignedBy();
    }, [])

    useEffect(() => {
        fetchSourceAll();
    }, [isEditOpen, purposeEdit])


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = sources?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [sources])



    //get all comnpany.
    const fetchCompanyAll = async () => {
        try {
            setCompanyOption(isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
            setCompanyOptionEdit(isAssignBranch?.map(data => ({
                label: data.company,
                value: data.company,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all branches.
    const fetchBranchAll = (e) => {
        try {


            setBranchOption(isAssignBranch?.filter(
                (comp) =>
                    e === comp.company
            )?.map(data => ({
                label: data.branch,
                value: data.branch,
                address: data.branchaddress
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //get all unit.
    const fetchUnitAll = async (branchArr) => {
        try {

            setUnitOption(isAssignBranch?.filter(
                (comp) =>
                    branchArr === comp.branch
            )?.map(data => ({
                label: data.unit,
                value: data.unit,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //function to fetch Employee
    const fetchEmployeeAll = (companyArr, branchArr, unitArr, teamArr) => {

        try {
            setEmployeeOption(
                allUsersData?.filter((t) => companyArr === t.company && branchArr === t.branch && unitArr === t.unit
                    && teamArr === t.team)?.map((t) => ({
                        label: t.companyname,
                        value: t.companyname,
                    })),
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //function to fetch Employee
    const fetchEmployeeAllTodo = (companyArr, branchArr, unitArr, teamArr) => {

        try {
            setEmployeeOptionTodo(
                allUsersData?.filter((t) => companyArr === t.company && branchArr === t.branch && unitArr === t.unit
                    && teamArr === t.team)?.map((t) => ({
                        label: t.companyname,
                        value: t.companyname,
                    })),
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //get all branches.
    const fetchBranchAllEdit = async (e) => {

        try {
            setBranchOptionEdit(isAssignBranch?.filter(
                (comp) =>
                    e === comp.company
            )?.map(data => ({
                label: data.branch,
                value: data.branch,
                address: data.branchaddress
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //get all unit.
    const fetchUnitAllEdit = async (branchArr) => {
        try {
            setUnitOptionEdit(isAssignBranch?.filter(
                (comp) =>
                    branchArr === comp.branch
            )?.map(data => ({
                label: data.unit,
                value: data.unit,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //function to fetch Employee
    const fetchEmployeeAllEdit = (companyArr, branchArr, unitArr, teamArr) => {

        try {
            setEmployeeOptionEdit(
                allUsersData?.filter((t) => companyArr === t.company && branchArr === t.branch && unitArr === t.unit
                    && teamArr === t.team)?.map((t) => ({
                        label: t.companyname,
                        value: t.companyname,
                    })),
            );

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //function to fetch Employee
    const fetchEmployeeAllEditTodo = (companyArr, branchArr, unitArr, teamArr) => {

        try {
            setEmployeeOptionEdit(
                allUsersData?.filter((t) => companyArr === t.company && branchArr === t.branch && unitArr === t.unit
                    && teamArr === t.team)?.map((t) => ({
                        label: t.companyname,
                        value: t.companyname,
                    })),
            );

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchCompanyAll();
    }, []);


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

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

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
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "companyurl", headerName: "Company URL", flex: 0, width: 150, hide: !columnVisibility.companyurl, headerClassName: "bold-header" },
        { field: "companyname", headerName: "Company Name", flex: 0, width: 150, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        { field: "address", headerName: "Address", flex: 0, width: 150, hide: !columnVisibility.address, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("etemplatecontrolpanel") && (
                        <Button onClick={() => {

                            getCodeEdit(params.row.id);
                        }}>Change
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dtemplatecontrolpanel") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vtemplatecontrolpanel") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itemplatecontrolpanel") && (
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
                    {isUserRoleCompare?.includes("etemplatecontrolpanel") && (
                        <Link to={`/templatecontrolpanellog/${params.row.id}`} >
                            <Button
                                sx={userStyle.buttondelete}
                            >
                                <MenuIcon style={{ fontsize: "large" }} />
                            </Button>
                        </Link>
                    )}

                </Grid>
            ),
        },
    ]


    const rowDataTable = filteredData.map((item) => {
        const recenttemp = item.templatecontrolpanellog?.length > 0 ? item.templatecontrolpanellog[item.templatecontrolpanellog?.length - 1] : item
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: recenttemp.company,
            branch: recenttemp.branch,
            companyurl: recenttemp.companyurl,
            companyname: recenttemp.companyname,
            address: recenttemp.address
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

    const handleCreateTodocheckSeal = () => {
        // if (currentText && currentText === 0) {

        const idTodoExist = todoscheckSeal.some((item) => item?.name?.toLowerCase() == sealname?.toLowerCase() &&
            item?.seal?.toLowerCase() == sealtype?.toLowerCase())

        if (
            sealtype === "Please Select Seal"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Seal"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            sealname === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Seal Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            documentFilesSeal.length === 0
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Seal Logo"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            idTodoExist
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const newTodocheck = {
                seal: sealtype,
                name: sealname,
                document: documentFilesSeal,
            };
            setTodoscheckSeal([...todoscheckSeal, newTodocheck]);
            setSealtype("Please Select Seal")
            setSealname("")
            setdocumentFilesSeal([])
            //   setRefImage([]);
            //   setPreviewURL(null);
            //   setCurrentText("");
        }
        // }
    };

    const [indexSealCreate, setIndexSealCreate] = useState(-1);
    const [sealTodoCreate, setSealTodoCreate] = useState(false);


    const handleCreateSealEditTodo = (index) => {
        setIndexSealCreate(index)
        setSealTodoCreate(true)
        setSealtypeTodo(todoscheckSeal[index]?.seal)
        setSealnameTodo(todoscheckSeal[index]?.name)
    }
    const handleUpdateTodoSealCreate = () => {
        const idTodoExist = todoscheckSeal?.filter((data, index) => index !== indexSealCreate).some((item) => item?.name?.toLowerCase() == sealnameTodo?.toLowerCase() &&
            item?.seal?.toLowerCase() == sealtypeTodo?.toLowerCase())

        if (
            sealtypeTodo === "Please Select Seal"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Seal"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            sealnameTodo === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Seal Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            idTodoExist
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const newTodocheck = [...todoscheckSeal]
            newTodocheck[indexSealCreate].seal = sealtypeTodo;
            newTodocheck[indexSealCreate].name = sealnameTodo;
            setTodoscheckSeal(newTodocheck);
            setSealtypeTodo("Please Select Seal")
            setSealnameTodo("")
            setSealTodoCreate(false)
            setIndexSealCreate(-1)
        }
    };

    const handleCreateTodocheckSealEdit = () => {
        const idTodoExist = todoscheckSealEdit.some((item) => item?.name?.toLowerCase() == sealnameEdit?.toLowerCase() &&
            item?.seal?.toLowerCase() == sealtypeEdit?.toLowerCase())

        if (
            sealtypeEdit === "Please Select Seal"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Seal"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            sealnameEdit === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Seal Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            documentFilesSealEdit.length === 0
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Seal Logo"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            idTodoExist
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            const newTodocheck = {
                seal: sealtypeEdit,
                name: sealnameEdit,
                document: documentFilesSealEdit,
            };
            setTodoscheckSealEdit([...todoscheckSealEdit, newTodocheck]);
            setSealtypeEdit("Please Select Seal")
            setSealnameEdit("")
            setdocumentFilesSealEdit([])
            //   setRefImage([]);
            //   setPreviewURL(null);
            //   setCurrentText("");
        }
        // }
    };


    const [indexSignatureCreate, setIndexSignatureCreate] = useState(-1);
    const [signTodoCreate, setSignTodoCreate] = useState(false);
    const handleCreateTodocheckSignature = () => {
        // if (currentText && currentText === 0) {

        const isSignatDup = todoscheckSignature.some((item) =>
            // item.company?.toLowerCase() == company?.toLowerCase() &&

            // item.branch?.toLowerCase() == branch?.toLowerCase() &&
            item.unit?.toLowerCase() == unit?.toLowerCase() &&
            item.team?.toLowerCase() == team?.toLowerCase() &&
            item.employee?.toLowerCase() == employee?.toLowerCase() &&
            item.signaturename?.toLowerCase() == signaturename?.toLowerCase()
        )

        if (
            unit === "Please Select Unit"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            team === "Please Select Team"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            employee === "Please Select Employee"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSeal === "For Seal" && (topContent === "" || topContent === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Top Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSeal === "For Seal" && (bottomContent === "" || bottomContent === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Bottom Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            signaturename === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Signature Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSeal === "None" && documentFilesSignature.length === 0
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Signature Logo"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            isSignatDup
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            const newTodocheck = {
                // company: company,
                // branch: branch,
                unit: unit,
                team: team,
                employee: employee,
                signaturename: signaturename,
                document: documentFilesSignature,
                seal: forSeal,
                topcontent: topContent,
                bottomcontent: bottomContent
            };
            setTodoscheckSignature([...todoscheckSignature, newTodocheck]);
            setUnit("Please Select Unit")
            setTeam("Please Select Team")
            setEmployee("Please Select Employee")
            setSignaturename("")
            setForSeal("None")
            setTopContent("")
            setBottomContent("")
            setdocumentFilesSignature([])
        }
    };

    const handleCreateEditSignature = (index) => {
        setSignTodoCreate(true)
        setIndexSignatureCreate(index)
        setUnitTodo(todoscheckSignature[index]?.unit)
        setTeamTodo(todoscheckSignature[index]?.team)
        setEmployeeTodo(todoscheckSignature[index]?.employee)
        setForSealTodo(todoscheckSignature[index]?.seal)
        setTopContentTodo(todoscheckSignature[index]?.topcontent)
        setBottomContentTodo(todoscheckSignature[index]?.bottomcontent)
        setSignaturenameTodo(todoscheckSignature[index]?.signaturename)
        fetchEmployeeAllTodo(company, branch, todoscheckSignature[index]?.unit, todoscheckSignature[index]?.team);

    }

    const handleCreateUpdateSignature = () => {

        const isSignatDup = todoscheckSignature?.filter((data, index) => index !== indexSignatureCreate).some((item) =>
            item.unit?.toLowerCase() == unitTodo?.toLowerCase() &&
            item.team?.toLowerCase() == teamTodo?.toLowerCase() &&
            item.employee?.toLowerCase() == employeeTodo?.toLowerCase() &&
            item.signaturename?.toLowerCase() == signaturenameTodo?.toLowerCase()
        )

        if (
            unitTodo === "Please Select Unit"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            teamTodo === "Please Select Team"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            employeeTodo === "Please Select Employee"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealTodo === "For Seal" && (topContentTodo === "" || topContentTodo === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Top Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealTodo === "For Seal" && (bottomContentTodo === "" || bottomContentTodo === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Bottom Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            signaturenameTodo === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Signature Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            isSignatDup
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            const newTodocheck = [...todoscheckSignature]
            todoscheckSignature[indexSignatureCreate].unit = unitTodo;
            todoscheckSignature[indexSignatureCreate].team = teamTodo;
            todoscheckSignature[indexSignatureCreate].employee = employeeTodo;
            todoscheckSignature[indexSignatureCreate].signaturename = signaturenameTodo;
            todoscheckSignature[indexSignatureCreate].seal = forSealTodo;
            todoscheckSignature[indexSignatureCreate].topcontent = topContentTodo;
            todoscheckSignature[indexSignatureCreate].bottomcontent = bottomContentTodo;



            setTodoscheckSignature(newTodocheck);
            setUnitTodo("Please Select Unit")
            setTeamTodo("Please Select Team")
            setEmployeeTodo("Please Select Employee")
            setSignaturenameTodo("")
            setForSealTodo("None")
            setTopContentTodo("")
            setBottomContentTodo("")
            setIndexSignatureCreate(-1)
            setSignTodoCreate(false)
        }
    };


    const handleCreateCCEmail = () => {
        const isCcEmailDup = ccEmailTodo.some((item) => item?.toLowerCase() == ccEmail?.toLowerCase())
        if (ccEmail === "" || ccEmail === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Add CC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (!isValidEmail(ccEmail)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Valid CC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isCcEmailDup) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Email Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setCcEmailTodo([...ccEmailTodo, ccEmail]);
            setCcEmail("")
        }
    };
    const handleFileDeleteCCEmail = (index) => {
        setCcEmailTodo((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const handleCreateBCCEmail = () => {
        const isBccEmailDup = bccEmailTodo.some((item) => item?.toLowerCase() == bccEmail?.toLowerCase())
        if (bccEmail === "" || bccEmail === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Add BCC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (!isValidEmail(bccEmail)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Valid BCC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isBccEmailDup) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Email Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setBccEmailTodo([...bccEmailTodo, bccEmail]);
            setBccEmail("")
        }
    };
    const handleFileDeleteBCCEmail = (index) => {
        setBccEmailTodo((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const handleCreateCCEmailEdit = () => {
        const isCcEmailDup = ccEmailTodoEdit.some((item) => item?.toLowerCase() == ccEmailEdit?.toLowerCase())
        if (ccEmailEdit === "" || ccEmailEdit === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Add CC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (!isValidEmail(ccEmailEdit)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Valid CC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isCcEmailDup) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Email Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setCcEmailTodoEdit([...ccEmailTodoEdit, ccEmailEdit]);
            setCcEmailEdit("")
        }
    };
    const handleFileDeleteCCEmailEdit = (index) => {
        setCcEmailTodoEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleCreateBCCEmailEdit = () => {
        const isCcEmailDup = bccEmailTodoEdit.some((item) => item?.toLowerCase() == bccEmailEdit?.toLowerCase())

        if (bccEmailEdit === "" || bccEmailEdit === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Add BCC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (!isValidEmail(bccEmailEdit)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Valid BCC Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isCcEmailDup) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Email Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setBccEmailTodoEdit([...bccEmailTodoEdit, bccEmailEdit]);
            setBccEmailEdit("")
        }
    };
    const handleFileDeleteBCCEmailEdit = (index) => {
        setBccEmailTodoEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };











    const handleCreateTodocheckSignatureEdit = () => {
        // if (currentText && currentText === 0) {

        const isSignatDup = todoscheckSignatureEdit.some((item) =>
            // item.company?.toLowerCase() == company?.toLowerCase() &&

            // item.branch?.toLowerCase() == branch?.toLowerCase() &&
            item.unit?.toLowerCase() == unitEdit?.toLowerCase() &&
            item.team?.toLowerCase() == teamEdit?.toLowerCase() &&
            item.employee?.toLowerCase() == employeeEdit?.toLowerCase() &&
            item.signaturename?.toLowerCase() == signaturenameEdit?.toLowerCase()
        )

        if (
            unitEdit === "Please Select Unit"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            teamEdit === "Please Select Team"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            employeeEdit === "Please Select Employee"
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employee"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealEdit === "For Seal" && (topContentEdit === "" || topContentEdit === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Top Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealEdit === "For Seal" && (bottomContentEdit === "" || bottomContentEdit === undefined)
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Bottom Content"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            signaturenameEdit === ""
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Signature Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            forSealEdit === "None" && documentFilesSignatureEdit.length === 0
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Upload Signature Logo"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (
            isSignatDup
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exists"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            const newTodocheck = {
                // company: company,
                // branch: branch,
                unit: unitEdit,
                team: teamEdit,
                employee: employeeEdit,
                signaturename: signaturenameEdit,
                document: documentFilesSignatureEdit,
                seal: forSealEdit,
                topcontent: topContentEdit,
                bottomcontent: bottomContentEdit
            };
            setTodoscheckSignatureEdit([...todoscheckSignatureEdit, newTodocheck]);
            setUnitEdit("Please Select Unit")
            setTeamEdit("Please Select Team")
            setEmployeeEdit("Please Select Employee")
            setSignaturenameEdit("")
            setdocumentFilesSignatureEdit([])
            setForSealEdit("None")
            setTopContentEdit("")
            setBottomContentEdit("")
        }
    };

    const handleDeleteTodocheckToCompany = (index) => {
        const newTodoscheck = [...todoscheckToCompany];
        newTodoscheck.splice(index, 1);
        setTodoscheckToCompany(newTodoscheck);
    };
    const handleDeleteTodocheckToCompanyEdit = (index) => {
        const newTodoscheck = [...todoscheckToCompanyEdit];
        newTodoscheck.splice(index, 1);
        setTodoscheckToCompanyEdit(newTodoscheck);
    };
    const handleDeleteTodocheckSeal = (index) => {
        const newTodoscheck = [...todoscheckSeal];
        newTodoscheck.splice(index, 1);
        setTodoscheckSeal(newTodoscheck);
    };
    const handleDeleteTodocheckSealEdit = (index) => {
        const newTodoscheck = [...todoscheckSealEdit];
        newTodoscheck.splice(index, 1);
        setTodoscheckSealEdit(newTodoscheck);
    };
    const handleDeleteTodocheckSignature = (index) => {
        const newTodoscheck = [...todoscheckSignature];
        newTodoscheck.splice(index, 1);
        setTodoscheckSignature(newTodoscheck);
    };
    const handleDeleteTodocheckSignatureEdit = (index) => {
        const newTodoscheck = [...todoscheckSignatureEdit];
        newTodoscheck.splice(index, 1);
        setTodoscheckSignatureEdit(newTodoscheck);
    };



    const handleFileDeleteDocumentContentHeader = (index) => {
        setdocumentFilesDOcumentContentHeader((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentContentHeaderEdit = (index) => {
        setdocumentFilesDOcumentContentHeaderEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentContentFooter = (index) => {
        setdocumentFilesDOcumentContentFooter((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentContentFooterEdit = (index) => {
        setdocumentFilesDOcumentContentFooterEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentBodyContent = (index) => {
        setdocumentFilesDOcumentBodyContent((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentBodyContentEdit = (index) => {
        setdocumentFilesDOcumentBodyContentEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentFrontHeader = (index) => {
        setdocumentFilesDOcumentFrontHeader((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentFrontHeaderEdit = (index) => {
        setdocumentFilesDOcumentFrontHeaderEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentFrontFooter = (index) => {
        setdocumentFilesDOcumentFrontFooter((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentFrontFooterEdit = (index) => {
        setdocumentFilesDOcumentFrontFooterEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentBackHeader = (index) => {
        setdocumentFilesDOcumentBackHeader((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentBackHeaderEdit = (index) => {
        setdocumentFilesDOcumentBackHeaderEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentBackFooter = (index) => {
        setdocumentFilesDOcumentBackFooter((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteDocumentBackFooterEdit = (index) => {
        setdocumentFilesDOcumentBackFooterEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteEdit = (index) => {
        setdocumentFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileDeleteSeal = (index) => {
        setdocumentFilesSeal((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteSealEdit = (index) => {
        setdocumentFilesSealEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileDeleteSignature = (index) => {
        setdocumentFilesSignature((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileDeleteSignatureEdit = (index) => {
        setdocumentFilesSignatureEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleResumeUploadDocumentContentheader = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentContentHeader([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadDocumentContentheaderEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentContentHeaderEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentContentFooter = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentContentFooter([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadDocumentContentFooterEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentContentFooterEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentBodyContent = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentBodyContent([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadDocumentBodyContentEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentBodyContentEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentFrontHeader = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentFrontHeader([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadDocumentFrontHeaderEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentFrontHeaderEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentFrontFooter = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentFrontFooter([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentFrontFooterEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentFrontFooterEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentBackHeader = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentBackHeader([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadDocumentBackHeaderEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentBackHeaderEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadDocumentBackFooter = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentBackFooter([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadDocumentBackFooterEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesDOcumentBackFooterEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };



    const handleResumeUpload = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFiles([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadSeal = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesSeal([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadSealEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesSealEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const handleResumeUploadSignature = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesSignature([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };
    const handleResumeUploadSignatureEdit = (event) => {
        const resume = event.target.files;
        if (resume.length > 0) {
            const reader = new FileReader();
            const file = resume[0];
            if (file?.type !== 'image/png') {
                alert('Please upload a .png file');
                return;
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesSignatureEdit([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const renderFilePreviewDocumentContentHeader = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentContentHeaderEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentContentFooter = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentContentFooterEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentBodyContent = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentBodyContentEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentFrontHeader = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentFrontHeaderEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentFrontFooter = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentFrontFooterEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentBackHeader = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentBackHeaderEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentBackFooter = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewDocumentBackFooterEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const renderFilePreviewSeal = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const renderFilePreviewSealEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const renderFilePreviewSignature = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewSignatureEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const sealOptions = [{ label: "Round Seal", value: "Round Seal" }, { label: "Normal Seal", value: "Normal Seal" }]
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    return (
        <Box>
            <Headtitle title={'Template Control Panel'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}> Template Control Panel </Typography>
            {isUserRoleCompare?.includes("atemplatecontrolpanel")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}></Grid>
                                <Grid >
                                    {/* <Typography sx={userStyle.importheadtext}>Add Template Control Panel</Typography> */}
                                </Grid>
                                <br />
                                <br />
                                <Grid container >

                                    <Typography sx={userStyle.SubHeaderText}>
                                        Add Template Control Panel
                                    </Typography>
                                    <br />
                                    <br />
                                    <Grid container spacing={2}>


                                        <Grid item md={2} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={companyOption}
                                                    value={{ value: company, label: company }}
                                                    onChange={(e) => {
                                                        fetchBranchAll(e.value)
                                                        setCompanyname(e.value);
                                                        setCompany(e.value)
                                                        setUnitOption([])
                                                        setEmployeeOption([])
                                                        setEmployee("Please Select Employee");
                                                        setTeam("Please Select Team");
                                                        setUnit("Please Select Unit");
                                                        setBranch("Please Select Branch");
                                                        setTodoscheckSignature([])
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={branchOption}
                                                    value={{ value: branch, label: branch }}
                                                    onChange={(e) => {
                                                        fetchUnitAll(e.value);
                                                        setBranch(e.value);
                                                        setAddress(e.address);
                                                        setEmployee("Please Select Employee");
                                                        setTeam("Please Select Team");
                                                        setUnit("Please Select Unit");
                                                        setEmployeeOption([])
                                                        setTodoscheckSignature([])
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <br />
                                    <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel> <b>Document Letter Head Content Header </b><b style={{ color: "red" }}>*</b></InputLabel>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    component="label"
                                                    sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}
                                                    onClick={handleClick}
                                                >
                                                    Upload
                                                </Button>
                                                <Menu
                                                    anchorEl={anchorElDoc}
                                                    open={Boolean(anchorElDoc)}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={() => handleMenuItemClick('local')}>Upload Local</MenuItem>
                                                    <MenuItem onClick={() => handleMenuItemClick('organizational')}>Organizational Document</MenuItem>
                                                </Menu>

                                                {(option === 'local' && documentFilesDocumentContentHeader?.length === 0) && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        component="label"
                                                        sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload Local
                                                        <input
                                                            type="file"
                                                            id="resume"
                                                            accept=".png"
                                                            name="file"
                                                            hidden
                                                            onChange={(e) => {
                                                                handleResumeUploadDocumentContentheader(e);
                                                            }}
                                                        />
                                                    </Button>
                                                )}

                                                {option === 'organizational' && (
                                                    <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                        <Selects
                                                            options={orgDocuments}
                                                            value={{ value: docBodyHeader, label: docBodyHeader }}
                                                            onChange={(e) => {
                                                                setDocBodyHeader(e.value)
                                                                const resume = e?.document[0];
                                                                setdocumentFilesDOcumentContentHeader([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}
                                            </div>

                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentContentHeader?.length > 0 &&
                                                    documentFilesDocumentContentHeader?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentContentHeader(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel> <b>Document Letter Head Content Footer</b><b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>

                                                    <Button variant="contained" size="small" component="label" onClick={handleClick2} sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc2}
                                                        open={Boolean(anchorElDoc2)}
                                                        onClose={handleClose2}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick2('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick2('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option2 === 'local' && documentFilesDocumentContentFooter?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentContentFooter(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option2 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader2, label: docBodyHeader2 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader2(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentContentFooter([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentContentFooter?.length > 0 &&
                                                    documentFilesDocumentContentFooter?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentFooter(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentContentFooter(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Document Letter Head Body Content(Background)</b><b style={{ color: "red" }}>*</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick3} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload
                                                    </Button>

                                                    <Menu
                                                        anchorEl={anchorElDoc3}
                                                        open={Boolean(anchorElDoc3)}
                                                        onClose={handleClose3}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick3('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick3('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option3 === 'local' && documentFilesDocumentBodyContent?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentBodyContent(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option3 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader3, label: docBodyHeader3 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader3(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentBodyContent([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBodyContent?.length > 0 &&
                                                    documentFilesDocumentBodyContent?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBodyContent(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBodyContent(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <br></br>
                                    <Grid container spacing={2}>


                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography><b>Company URL</b><b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Company URL"
                                                    value={companyurl}
                                                    onChange={(e) => {
                                                        setCompanyUrl(

                                                            e.target.value,
                                                        );
                                                    }}
                                                />

                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Front Header</b> <b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>
                                                    <Button variant="contained" onClick={handleClick4} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc4}
                                                        open={Boolean(anchorElDoc4)}
                                                        onClose={handleClose4}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick4('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick4('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option4 === 'local' && documentFilesDocumentFrontHeader?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentFrontHeader(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option4 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader4, label: docBodyHeader4 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader4(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentFrontHeader([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentFrontHeader?.length > 0 &&
                                                    documentFilesDocumentFrontHeader?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontHeader(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentFrontHeader(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Front Footer</b> <b style={{ color: "red" }}>*</b> </InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>
                                                    <Button variant="contained" onClick={handleClick5} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc5}
                                                        open={Boolean(anchorElDoc5)}
                                                        onClose={handleClose5}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick5('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick5('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option5 === 'local' && documentFilesDocumentFrontFooter?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentFrontFooter(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option5 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader5, label: docBodyHeader5 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader5(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentFrontFooter([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>



                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentFrontFooter?.length > 0 &&
                                                    documentFilesDocumentFrontFooter?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontFooter(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentFrontFooter(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <br></br>

                                    <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Back Header</b> <b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick6} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc6}
                                                        open={Boolean(anchorElDoc6)}
                                                        onClose={handleClose6}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick6('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick6('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option6 === 'local' && documentFilesDocumentBackHeader?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentBackHeader(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option6 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader6, label: docBodyHeader6 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader6(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentBackHeader([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBackHeader?.length > 0 &&
                                                    documentFilesDocumentBackHeader?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackHeader(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBackHeader(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Back Footer</b>  <b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick7} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc7}
                                                        open={Boolean(anchorElDoc7)}
                                                        onClose={handleClose7}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick7('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick7('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option7 === 'local' && documentFilesDocumentBackFooter?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentBackFooter(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option7 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader7, label: docBodyHeader7 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader7(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentBackFooter([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBackFooter?.length > 0 &&
                                                    documentFilesDocumentBackFooter?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackFooter(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBackFooter(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br></br>
                                    <br></br>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Company Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={companyname}
                                                        onChange={(e) => {
                                                            setCompanyname(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Address</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={address}
                                                        onChange={(e) => {
                                                            setAddress(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>


                                        <br />

                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Logo</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick8} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc8}
                                                        open={Boolean(anchorElDoc8)}
                                                        onClose={handleClose8}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick8('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick8('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option8 === 'local' && documentFiles?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUpload(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option8 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader8, label: docBodyHeader8 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader8(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFiles([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                                {/* <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpen}
                                        >
                                            Upload
                                        </Button> */}
                                            </Box>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFiles?.length > 0 &&
                                                    documentFiles.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>To Company Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={toCompanyname}
                                                        onChange={(e) => {
                                                            setToCompanyname(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>To Company Address</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={toAddress}
                                                        onChange={(e) => {
                                                            setToAddress(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                                <Button
                                                    variant="contained"
                                                    sx={{ minWidth: "35px" }}
                                                    onClick={handleCreateTodoToCompany}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}> </Grid>
                                        </>
                                        {todoscheckToCompany?.length > 0 &&
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography><b>To Company</b></Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography><b>To Address</b></Typography>

                                                    </FormControl>
                                                </Grid>
                                            </>}
                                        <Grid item md={12} xs={12} sm={12}>
                                            {todoscheckToCompany?.length > 0 &&
                                                todoscheckToCompany?.map((todo, index) => (
                                                    <div key={index}>
                                                        <Grid container spacing={1}>
                                                            <>
                                                                <Grid item md={3} xs={12} sm={12}>
                                                                    <Typography>{todo.toCompanyname}</Typography>
                                                                </Grid>
                                                                <Grid item md={3} xs={12} sm={12}>
                                                                    <Typography>{todo.toAddress}</Typography>

                                                                </Grid>
                                                            </>
                                                            <Grid item md={2} sm={6} xs={6}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        // minWidth: "20px",
                                                                        // minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        // marginTop: "-5px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={() => handleDeleteTodocheckToCompany(index)}
                                                                >
                                                                    <FaTrash
                                                                        style={{
                                                                            color: "#b92525",
                                                                            fontSize: "1rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1} >
                                        <br /> <br />
                                        <Typography variant="h6">
                                            Seal
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>  Seal Type</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <Selects
                                                        options={sealOptions}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: sealtype,
                                                            value: sealtype,
                                                        }}
                                                        onChange={(e) => {
                                                            setSealtype(e.value);
                                                        }}
                                                    />

                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter Name"
                                                        value={sealname}
                                                        onChange={(e) => {
                                                            setSealname(

                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                </FormControl>
                                            </Grid>
                                        </>
                                        <br />
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Seal Logo</b><b style={{ color: "red" }}>*</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>

                                                    <Button variant="contained" onClick={handleClick9} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc9}
                                                        open={Boolean(anchorElDoc9)}
                                                        onClose={handleClose9}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick9('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick9('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>
                                                    {(option9 === 'local' && documentFilesSeal?.length === 0) && (
                                                        <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadSeal(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}
                                                    {option9 === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader9, label: docBodyHeader9 }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader9(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesSeal([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}

                                                </div>

                                                {/* <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpen}
                                        >
                                            Upload
                                        </Button> */}
                                            </Box>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesSeal?.length > 0 &&
                                                    documentFilesSeal.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewSeal(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteSeal(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                            <Button
                                                variant="contained"
                                                sx={{ minWidth: "35px" }}
                                                onClick={handleCreateTodocheckSeal}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {todoscheckSeal?.length > 0 &&
                                                todoscheckSeal.map((todo, index) => (
                                                    <div key={index}>
                                                        <br />
                                                        <br />
                                                        <br />
                                                        {indexSealCreate === index ?
                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>  Seal Type</b><b style={{ color: "red" }}>*</b></Typography>
                                                                            <Selects
                                                                                options={sealOptions}
                                                                                styles={colourStyles}
                                                                                value={{
                                                                                    label: sealtypeTodo,
                                                                                    value: sealtypeTodo,
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    setSealtypeTodo(e.value);
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={sealnameTodo}
                                                                                onChange={(e) => {
                                                                                    setSealnameTodo(

                                                                                        e.target.value,
                                                                                    );
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={4} sm={6} xs={6}>
                                                                    <Typography><b>Seal Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} sm={1} mt={2} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        disabled={
                                                                            false
                                                                        }

                                                                        onClick={handleUpdateTodoSealCreate}
                                                                    >
                                                                        <CheckCircleIcon
                                                                            style={{
                                                                                color: "#216d21",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={1} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSealTodoCreate(false); setIndexSealCreate(-1) }}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <CancelIcon
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            <Grid container spacing={1}>

                                                                <br />
                                                                <br />
                                                                <Grid item md={4} sm={6} xs={6}>
                                                                    <Typography><b>Seal Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => handleCreateSealEditTodo(index)}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <FaEdit
                                                                            style={{
                                                                                color: "#1976d2",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSealTodoCreate(false); handleDeleteTodocheckSeal(index) }}
                                                                    >
                                                                        <FaTrash
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>}

                                                        <br />
                                                    </div>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1} >
                                        <br /> <br />
                                        <Typography variant="h6">
                                            Signature
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={unitOption}
                                                        value={{ value: unit, label: unit }}
                                                        onChange={(e) => {
                                                            setUnit(e.value);
                                                            setEmployee("Please Select Employee");
                                                            setTeam("Please Select Team");
                                                            setEmployeeOption([])
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={allTeam?.filter(
                                                            (comp) =>
                                                                company === comp.company && branch === comp.branch && unit === comp.unit
                                                        )?.map(data => ({
                                                            label: data.teamname,
                                                            value: data.teamname,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={{ value: team, label: team }}
                                                        onChange={(e) => {
                                                            fetchEmployeeAll(company, branch, unit, e.value);
                                                            setTeam(e.value);
                                                            setEmployee("Please Select Employee");
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Employee<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={employeeOption}
                                                        value={{ value: employee, label: employee }}
                                                        onChange={(e) => {
                                                            setEmployee(
                                                                e.value
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Seal<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={[{ label: "None", value: "None" }, { label: "For Seal", value: "For Seal" }]}
                                                        value={{ value: forSeal, label: forSeal }}
                                                        onChange={(e) => {
                                                            setForSeal(
                                                                e.value
                                                            )
                                                            setTopContent("")
                                                            setBottomContent("")
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            {forSeal === "For Seal" &&
                                                <>
                                                    <Grid item md={2} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography><b>Top Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                placeholder="Please Enter Top Content"
                                                                value={topContent}
                                                                onChange={(e) => {
                                                                    setTopContent(
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                            />

                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={2} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography><b>Bottom Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                placeholder="Please Enter Bottom Content"
                                                                value={bottomContent}
                                                                onChange={(e) => {
                                                                    setBottomContent(
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                            />

                                                        </FormControl>
                                                    </Grid>
                                                </>}
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter Name"
                                                        value={signaturename}
                                                        onChange={(e) => {
                                                            setSignaturename(

                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                </FormControl>
                                            </Grid>
                                        </>
                                        <br />
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography><b>Signature Logo</b>{forSeal === "For Seal" ? "" : <b style={{ color: "red" }}>*</b>}</Typography>

                                            <div>

                                                <Button variant="contained" onClick={handleClick10} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload

                                                </Button>
                                                <Menu
                                                    anchorEl={anchorElDoc10}
                                                    open={Boolean(anchorElDoc10)}
                                                    onClose={handleClose10}
                                                >
                                                    <MenuItem onClick={() => handleMenuItemClick10('local')}>Upload Local</MenuItem>
                                                    <MenuItem onClick={() => handleMenuItemClick10('organizational')}>Organizational Document</MenuItem>
                                                </Menu>
                                                {(option10 === 'local' && documentFilesSignature?.length === 0) && (
                                                    <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload Local
                                                        <input
                                                            type="file"
                                                            id="resume"
                                                            accept=".png"
                                                            name="file"
                                                            hidden
                                                            onChange={(e) => {
                                                                handleResumeUploadSignature(e);
                                                            }}
                                                        />
                                                    </Button>
                                                )}
                                                {option10 === 'organizational' && (
                                                    <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                        <Selects
                                                            options={orgDocuments}
                                                            value={{ value: docBodyHeader10, label: docBodyHeader10 }}
                                                            onChange={(e) => {
                                                                setDocBodyHeader10(e.value)
                                                                const resume = e?.document[0];
                                                                setdocumentFilesSignature([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}

                                            </div>

                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesSignature?.length > 0 &&
                                                    documentFilesSignature.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewSignature(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteSignature(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                            <Button
                                                variant="contained"
                                                sx={{ minWidth: "35px" }}
                                                onClick={handleCreateTodocheckSignature}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {todoscheckSignature?.length > 0 &&
                                                todoscheckSignature.map((todo, index) => (
                                                    <div key={index}>
                                                        <br />
                                                        <br />
                                                        <br />
                                                        {indexSignatureCreate === index ?
                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={2} xs={12} sm={6}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography>
                                                                                Unit<b style={{ color: "red" }}>*</b>
                                                                            </Typography>
                                                                            <Selects
                                                                                options={unitOption}
                                                                                value={{ value: unitTodo, label: unitTodo }}
                                                                                onChange={(e) => {
                                                                                    setUnitTodo(e.value);
                                                                                    setEmployeeTodo("Please Select Employee");
                                                                                    setTeamTodo("Please Select Team");
                                                                                    setEmployeeOptionTodo([])
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={6}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography>
                                                                                Team<b style={{ color: "red" }}>*</b>
                                                                            </Typography>
                                                                            <Selects
                                                                                options={allTeam?.filter(
                                                                                    (comp) =>
                                                                                        company === comp.company && branch === comp.branch && unitTodo === comp.unit
                                                                                )?.map(data => ({
                                                                                    label: data.teamname,
                                                                                    value: data.teamname,
                                                                                })).filter((item, index, self) => {
                                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                                })}
                                                                                value={{ value: teamTodo, label: teamTodo }}
                                                                                onChange={(e) => {
                                                                                    fetchEmployeeAllTodo(company, branch, unitTodo, e.value);
                                                                                    setTeamTodo(e.value);
                                                                                    setEmployeeTodo("Please Select Employee");
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={6}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography>
                                                                                Employee<b style={{ color: "red" }}>*</b>
                                                                            </Typography>
                                                                            <Selects
                                                                                options={employeeOptionTodo}
                                                                                value={{ value: employeeTodo, label: employeeTodo }}
                                                                                onChange={(e) => {
                                                                                    setEmployeeTodo(
                                                                                        e.value
                                                                                    )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={6}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography>
                                                                                Seal<b style={{ color: "red" }}>*</b>
                                                                            </Typography>
                                                                            <Selects
                                                                                options={[{ label: "None", value: "None" }, { label: "For Seal", value: "For Seal" }]}
                                                                                value={{ value: forSealTodo, label: forSealTodo }}
                                                                                onChange={(e) => {
                                                                                    setForSealTodo(
                                                                                        e.value
                                                                                    )
                                                                                    setTopContentTodo("")
                                                                                    setBottomContentTodo("")
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    {forSealTodo === "For Seal" &&
                                                                        <>
                                                                            <Grid item md={2} xs={12} sm={12}>
                                                                                <FormControl fullWidth size="small">
                                                                                    <Typography><b>Top Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                                                    <OutlinedInput
                                                                                        id="component-outlined"
                                                                                        type="text"
                                                                                        placeholder="Please Enter Top Content"
                                                                                        value={topContentTodo}
                                                                                        onChange={(e) => {
                                                                                            setTopContentTodo(
                                                                                                e.target.value,
                                                                                            );
                                                                                        }}
                                                                                    />

                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={2} xs={12} sm={12}>
                                                                                <FormControl fullWidth size="small">
                                                                                    <Typography><b>Bottom Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                                                    <OutlinedInput
                                                                                        id="component-outlined"
                                                                                        type="text"
                                                                                        placeholder="Please Enter Bottom Content"
                                                                                        value={bottomContentTodo}
                                                                                        onChange={(e) => {
                                                                                            setBottomContentTodo(
                                                                                                e.target.value,
                                                                                            );
                                                                                        }}
                                                                                    />

                                                                                </FormControl>
                                                                            </Grid>
                                                                        </>}
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={signaturenameTodo}
                                                                                onChange={(e) => {
                                                                                    setSignaturenameTodo(

                                                                                        e.target.value,
                                                                                    );
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={3} sm={6} xs={6}>
                                                                    <Typography><b>Signature Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>

                                                                <Grid item md={1} sm={1} mt={2} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        disabled={
                                                                            false
                                                                        }

                                                                        onClick={handleCreateUpdateSignature}
                                                                    >
                                                                        <CheckCircleIcon
                                                                            style={{
                                                                                color: "#216d21",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={1} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSignTodoCreate(false); setIndexSignatureCreate(-1) }}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <CancelIcon
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Unit</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.unit}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Team</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.team}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Employee</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.employee}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Seal</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.seal}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    {todo?.seal === "For Seal" && <>
                                                                        <Grid item md={2} xs={12} sm={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography><b>Top Content</b></Typography>
                                                                                <OutlinedInput
                                                                                    id="component-outlined"
                                                                                    type="text"
                                                                                    placeholder="Please Enter Name"
                                                                                    value={todo.topcontent}
                                                                                    readOnly={true}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={2} xs={12} sm={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography><b>Bottom Content</b></Typography>
                                                                                <OutlinedInput
                                                                                    id="component-outlined"
                                                                                    type="text"
                                                                                    placeholder="Please Enter Name"
                                                                                    value={todo.bottomcontent}
                                                                                    readOnly={true}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                    </>}
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.signaturename}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={3} sm={6} xs={6}>
                                                                    <Typography><b>Signature Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => handleCreateEditSignature(index)}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <FaEdit
                                                                            style={{
                                                                                color: "#1976d2",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={2} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSignTodoCreate(false); handleDeleteTodocheckSignature(index) }}
                                                                    >
                                                                        <FaTrash
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>}

                                                        <br />
                                                    </div>
                                                ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />  <br />
                                <Grid container spacing={1}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography><b>From Email</b><b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter from address"
                                                value={fromEmail}
                                                onChange={(e) => setFromEmail(e.target.value)} />
                                        </FormControl>
                                    </Grid>



                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography><b>CC Email</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter CC address"
                                                value={ccEmail}
                                                onChange={(e) => setCcEmail(e.target.value)}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                        <Button
                                            variant="contained"
                                            sx={{ minWidth: "35px" }}
                                            onClick={handleCreateCCEmail}
                                        >
                                            <FaPlus />
                                        </Button>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12}>
                                        {ccEmailTodo?.length > 0 && <Typography> <b>CC Email Address Todo : </b></Typography>}
                                        {ccEmailTodo?.length > 0 &&
                                            ccEmailTodo?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={8} sm={6} xs={6}>
                                                            <Typography>{file}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteCCEmail(index)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>



                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography><b>BCC Email</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter BCC address"
                                                value={bccEmail}
                                                onChange={(e) => setBccEmail(e.target.value)}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                        <Button
                                            variant="contained"
                                            sx={{ minWidth: "35px" }}
                                            onClick={handleCreateBCCEmail}
                                        >
                                            <FaPlus />
                                        </Button>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12}>
                                        {bccEmailTodo?.length > 0 && <Typography> <b>BCC Email Address Todo : </b></Typography>}
                                        {bccEmailTodo?.length > 0 &&
                                            bccEmailTodo?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={8} sm={6} xs={6}>
                                                            <Typography>{file}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteBCCEmail(index)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>



                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Email Format <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <ReactQuill
                                                style={{ maxHeight: "350px", height: "350px" }}
                                                value={emailFormat}
                                                onChange={setEmailFormat}
                                                modules={{
                                                    toolbar:
                                                        [[{ header: "1" }, { header: "2" },
                                                        { font: [] }], [{ size: [] }],
                                                        ["bold", "italic", "underline", "strike", "blockquote"],
                                                        [{ align: [] }],
                                                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                                        ["link", "image", "video"],
                                                        ["clean"]]
                                                }}

                                                formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "align", "list", "bullet", "indent", "link", "image", "video"]} />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /><br />
                                <br /><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <LoadingButton loading={btnSubmit} variant='contained' color='primary' onClick={handleSubmit} disabled={isActive}>Submit</LoadingButton>

                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleClear}>Clear</Button>

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
                    maxWidth="lg"
                // sx={{
                //     overflow: 'visible',
                //     '& .MuiPaper-root': {
                //         overflow: 'visible',
                //     },
                // }}
                >

                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText} >Edit Template Control Panel</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid spacing={2}>

                                    <Grid container spacing={2}>


                                        <Grid item md={2} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={companyOptionEdit}
                                                    value={{ value: companyEdit, label: companyEdit }}
                                                    onChange={(e) => {
                                                        fetchBranchAllEdit(e.value)
                                                        setCompanyEdit(e.value)
                                                        setCompanynameEdit(e.value);
                                                        setUnitOptionEdit([])
                                                        setEmployeeOptionEdit([])
                                                        setEmployeeEdit("Please Select Employee");
                                                        setTeamEdit("Please Select Team");
                                                        setUnitEdit("Please Select Unit");
                                                        setBranchEdit("Please Select Branch");
                                                        setTodoscheckSignatureEdit([])
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={branchOptionEdit}
                                                    value={{ value: branchEdit, label: branchEdit }}
                                                    onChange={(e) => {
                                                        fetchUnitAllEdit(e.value);
                                                        setBranchEdit(e.value);
                                                        setAddressEdit(e.address);
                                                        setEmployeeEdit("Please Select Employee");
                                                        setTeamEdit("Please Select Team");
                                                        setUnitEdit("Please Select Unit");
                                                        setEmployeeOptionEdit([])
                                                        setTodoscheckSignatureEdit([])
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <br />
                                    {/* <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel> <b>Document Letter Head Content Header </b><b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentContentheaderEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentContentHeaderEdit?.length > 0 &&
                                                    documentFilesDocumentContentHeaderEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeaderEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentContentHeaderEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel> <b>Document Letter Head Content Footer</b><b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentContentFooterEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentContentFooterEdit?.length > 0 &&
                                                    documentFilesDocumentContentFooterEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentFooterEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentContentFooterEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>

                                            <Typography><b>Document Letter Head Body Content(Background)</b><b style={{ color: "red" }}>*</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentBodyContentEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBodyContentEdit?.length > 0 &&
                                                    documentFilesDocumentBodyContentEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBodyContentEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBodyContentEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid> */}

                                    <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel> <b>Document Letter Head Content Header </b><b style={{ color: "red" }}>*</b></InputLabel>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    component="label"
                                                    sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}
                                                    onClick={handleClickEdit}
                                                >
                                                    Upload
                                                </Button>
                                                <Menu
                                                    anchorEl={anchorElDocEdit}
                                                    open={Boolean(anchorElDocEdit)}
                                                    onClose={handleCloseEdit}
                                                >
                                                    <MenuItem onClick={() => handleMenuItemClickEdit('local')}>Upload Local</MenuItem>
                                                    <MenuItem onClick={() => handleMenuItemClickEdit('organizational')}>Organizational Document</MenuItem>
                                                </Menu>

                                                {(optionEdit === 'local' && documentFilesDocumentContentHeaderEdit?.length === 0) && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        component="label"
                                                        sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload Local
                                                        <input
                                                            type="file"
                                                            id="resume"
                                                            accept=".png"
                                                            name="file"
                                                            hidden
                                                            onChange={(e) => {
                                                                handleResumeUploadDocumentContentheaderEdit(e);
                                                            }}
                                                        />
                                                    </Button>
                                                )}

                                                {optionEdit === 'organizational' && (
                                                    <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                        <Selects
                                                            options={orgDocuments}
                                                            value={{ value: docBodyHeaderEdit, label: docBodyHeaderEdit }}
                                                            onChange={(e) => {
                                                                setDocBodyHeaderEdit(e.value)
                                                                const resume = e?.document[0];
                                                                setdocumentFilesDOcumentContentHeaderEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}
                                            </div>

                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentContentHeaderEdit?.length > 0 &&
                                                    documentFilesDocumentContentHeaderEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeaderEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentContentHeaderEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel> <b>Document Letter Head Content Footer</b><b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>

                                                    <Button variant="contained" size="small" component="label" onClick={handleClick2Edit} sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc2Edit}
                                                        open={Boolean(anchorElDoc2Edit)}
                                                        onClose={handleClose2Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick2Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick2Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option2Edit === 'local' && documentFilesDocumentContentFooterEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentContentFooterEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option2Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader2Edit, label: docBodyHeader2Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader2Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentContentFooterEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentContentFooterEdit?.length > 0 &&
                                                    documentFilesDocumentContentFooterEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentFooterEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentContentFooterEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Document Letter Head Body Content(Background)</b><b style={{ color: "red" }}>*</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick3Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload
                                                    </Button>

                                                    <Menu
                                                        anchorEl={anchorElDoc3Edit}
                                                        open={Boolean(anchorElDoc3Edit)}
                                                        onClose={handleClose3Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick3Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick3Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option3Edit === 'local' && documentFilesDocumentBodyContentEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentBodyContentEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option3Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader3Edit, label: docBodyHeader3Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader3Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentBodyContentEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBodyContentEdit?.length > 0 &&
                                                    documentFilesDocumentBodyContentEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBodyContentEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBodyContentEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <br></br>
                                    <Grid container spacing={2}>


                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography><b>Company URL</b><b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Company URL"
                                                    value={companyurlEdit}
                                                    onChange={(e) => {
                                                        setCompanyUrlEdit(

                                                            e.target.value,
                                                        );
                                                    }}
                                                />

                                            </FormControl>
                                        </Grid>
                                        {/* <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Front Header</b> </InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentFrontHeaderEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentFrontHeaderEdit?.length > 0 &&
                                                    documentFilesDocumentFrontHeaderEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontHeaderEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentFrontHeaderEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Front Footer</b> </InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentFrontFooterEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentFrontFooterEdit?.length > 0 &&
                                                    documentFilesDocumentFrontFooterEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontFooterEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentFrontFooterEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid> */}

                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Front Header</b> <b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>
                                                    <Button variant="contained" onClick={handleClick4Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc4Edit}
                                                        open={Boolean(anchorElDoc4Edit)}
                                                        onClose={handleClose4Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick4Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick4Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option4Edit === 'local' && documentFilesDocumentFrontHeaderEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentFrontHeaderEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option4Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader4Edit, label: docBodyHeader4Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader4Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentFrontHeaderEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentFrontHeaderEdit?.length > 0 &&
                                                    documentFilesDocumentFrontHeaderEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontHeaderEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentFrontHeaderEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Front Footer</b> <b style={{ color: "red" }}>*</b> </InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>
                                                    <Button variant="contained" onClick={handleClick5Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc5Edit}
                                                        open={Boolean(anchorElDoc5Edit)}
                                                        onClose={handleClose5Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick5Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick5Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option5Edit === 'local' && documentFilesDocumentFrontFooterEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentFrontFooterEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option5Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader5Edit, label: docBodyHeader5Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader5Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentFrontFooterEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>



                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentFrontFooterEdit?.length > 0 &&
                                                    documentFilesDocumentFrontFooterEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontFooterEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentFrontFooterEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <br></br>

                                    {/* <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Back Header</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentBackHeaderEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBackHeaderEdit?.length > 0 &&
                                                    documentFilesDocumentBackHeaderEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackHeaderEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBackHeaderEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Back Footer</b>  </InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadDocumentBackFooterEdit(e);
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBackFooterEdit?.length > 0 &&
                                                    documentFilesDocumentBackFooterEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackFooterEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBackFooterEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid> */}

                                    <Grid container spacing={2}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Back Header</b> <b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick6Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc6Edit}
                                                        open={Boolean(anchorElDoc6Edit)}
                                                        onClose={handleClose6Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick6Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick6Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option6Edit === 'local' && documentFilesDocumentBackHeaderEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentBackHeaderEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option6Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader6Edit, label: docBodyHeader6Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader6Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentBackHeaderEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBackHeaderEdit?.length > 0 &&
                                                    documentFilesDocumentBackHeaderEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackHeaderEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBackHeaderEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <InputLabel><b>ID Card Back Footer</b>  <b style={{ color: "red" }}>*</b></InputLabel>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick7Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc7Edit}
                                                        open={Boolean(anchorElDoc7Edit)}
                                                        onClose={handleClose7Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick7Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick7Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option7Edit === 'local' && documentFilesDocumentBackFooterEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadDocumentBackFooterEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option7Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader7Edit, label: docBodyHeader7Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader7Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesDOcumentBackFooterEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                            </Box>
                                            <br></br>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesDocumentBackFooterEdit?.length > 0 &&
                                                    documentFilesDocumentBackFooterEdit?.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackFooterEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteDocumentBackFooterEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <br></br>
                                    <br></br>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={5} >
                                        <br /> <br />
                                        <Typography>
                                            {/* <b>Requirements</b> */}
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Company Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={companynameEdit}
                                                        onChange={(e) => {
                                                            setCompanynameEdit(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Address</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={5}
                                                        value={addressEdit}
                                                        onChange={(e) => {
                                                            setAddressEdit(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>


                                        <br />

                                        {/* <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Logo</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload
                                                    <input
                                                        type="file"
                                                        id="resume"
                                                        accept=".png"
                                                        name="file"
                                                        hidden
                                                        onChange={(e) => {
                                                            handleResumeUploadEdit(e);
                                                        }}
                                                    />
                                                </Button>

                                            </Box>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesEdit?.length > 0 &&
                                                    documentFilesEdit.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid> */}

                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Logo</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                <div>
                                                    <Button variant="contained" onClick={handleClick8Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc8Edit}
                                                        open={Boolean(anchorElDoc8Edit)}
                                                        onClose={handleClose8Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick8Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick8Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>

                                                    {(option8Edit === 'local' && documentFilesEdit?.length === 0) && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            component="label"
                                                            sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}

                                                    {option8Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader8Edit, label: docBodyHeader8Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader8Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </div>
                                                {/* <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpen}
                                        >
                                            Upload
                                        </Button> */}
                                            </Box>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesEdit?.length > 0 &&
                                                    documentFilesEdit.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>

                                        <br /> <br />
                                        <Grid container spacing={1}>
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography><b>To Company Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                        <TextareaAutosize
                                                            aria-label="minimum height"
                                                            minRows={5}
                                                            value={toCompanynameEdit}
                                                            onChange={(e) => {
                                                                setToCompanynameEdit(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography><b>To Company Address</b><b style={{ color: "red" }}>*</b></Typography>
                                                        <TextareaAutosize
                                                            aria-label="minimum height"
                                                            minRows={5}
                                                            value={toAddressEdit}
                                                            onChange={(e) => {
                                                                setToAddressEdit(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ minWidth: "35px" }}
                                                        onClick={handleCreateTodoToCompanyEdit}
                                                    >
                                                        <FaPlus />
                                                    </Button>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}> </Grid>
                                            </>
                                            {todoscheckToCompanyEdit?.length > 0 &&
                                                <>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography><b>To Company</b></Typography>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography><b>To Address</b></Typography>

                                                        </FormControl>
                                                    </Grid>
                                                </>}
                                            <Grid item md={12} xs={12} sm={12}>
                                                {todoscheckToCompanyEdit?.length > 0 &&
                                                    todoscheckToCompanyEdit?.map((todo, index) => (
                                                        <div key={index}>
                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <Typography>{todo.toCompanyname}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <Typography>{todo.toAddress}</Typography>

                                                                    </Grid>
                                                                </>
                                                                <Grid item md={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            // minWidth: "20px",
                                                                            // minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            // marginTop: "-5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => handleDeleteTodocheckToCompanyEdit(index)}
                                                                    >
                                                                        <FaTrash
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1} >
                                        <br /> <br />
                                        <Typography variant="h6">
                                            Seal
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>  Seal Type</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <Selects
                                                        options={sealOptions}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: sealtypeEdit,
                                                            value: sealtypeEdit,
                                                        }}
                                                        onChange={(e) => {
                                                            setSealtypeEdit(e.value);
                                                        }}
                                                    />

                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter Name"
                                                        value={sealnameEdit}
                                                        onChange={(e) => {
                                                            setSealnameEdit(

                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                </FormControl>
                                            </Grid>
                                        </>
                                        <br />
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography><b>Seal Logo</b><b style={{ color: "red" }}>*</b></Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <div>

                                                    <Button variant="contained" onClick={handleClick9Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload

                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorElDoc9Edit}
                                                        open={Boolean(anchorElDoc9Edit)}
                                                        onClose={handleClose9Edit}
                                                    >
                                                        <MenuItem onClick={() => handleMenuItemClick9Edit('local')}>Upload Local</MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick9Edit('organizational')}>Organizational Document</MenuItem>
                                                    </Menu>
                                                    {(option9Edit === 'local' && documentFilesSealEdit?.length === 0) && (
                                                        <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                            Upload Local
                                                            <input
                                                                type="file"
                                                                id="resume"
                                                                accept=".png"
                                                                name="file"
                                                                hidden
                                                                onChange={(e) => {
                                                                    handleResumeUploadSealEdit(e);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}
                                                    {option9Edit === 'organizational' && (
                                                        <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                            <Selects
                                                                options={orgDocuments}
                                                                value={{ value: docBodyHeader9Edit, label: docBodyHeader9Edit }}
                                                                onChange={(e) => {
                                                                    setDocBodyHeader9Edit(e.value)
                                                                    const resume = e?.document[0];
                                                                    setdocumentFilesSealEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    )}

                                                </div>

                                                {/* <Button
                                            variant="contained"
                                            onClick={handleClickUploadPopupOpen}
                                        >
                                            Upload
                                        </Button> */}
                                            </Box>
                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesSealEdit?.length > 0 &&
                                                    documentFilesSealEdit.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewSealEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteSealEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                            <Button
                                                variant="contained"
                                                sx={{ minWidth: "35px" }}
                                                onClick={handleCreateTodocheckSealEdit}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {todoscheckSealEdit?.length > 0 &&
                                                todoscheckSealEdit.map((todo, index) => (
                                                    <div key={index}>
                                                        <br />
                                                        <br />
                                                        <br />
                                                        {editingIndexSeal === index ?
                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>  Seal Type</b><b style={{ color: "red" }}>*</b></Typography>
                                                                            <Selects
                                                                                options={sealOptions}
                                                                                styles={colourStyles}
                                                                                value={{
                                                                                    label: sealtypeEditTodo,
                                                                                    value: sealtypeEditTodo,
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    setSealtypeEditTodo(e.value);
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={sealnameEditTodo}
                                                                                onChange={(e) => {
                                                                                    setSealnameEditTodo(e.target.value);
                                                                                }}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={4} sm={6} xs={6}>
                                                                    <Typography><b>Seal Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} sm={1} mt={2} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        disabled={
                                                                            false
                                                                        }

                                                                        onClick={handleUpdateTodoSeal}
                                                                    >
                                                                        <CheckCircleIcon
                                                                            style={{
                                                                                color: "#216d21",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={1} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSealTodo(false); setEditingIndexSeal(-1) }}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <CancelIcon
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid> :
                                                            <Grid container spacing={1}>
                                                                <>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Seal</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.seal}
                                                                                readOnly={true}
                                                                            />

                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={3} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.name}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={3} sm={6} xs={6}>
                                                                    <Typography><b>Seal Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={8} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => handleEditTodoSeal(index)}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <FaEdit
                                                                            style={{
                                                                                color: "#1976d2",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSealTodo(false); handleDeleteTodocheckSealEdit(index) }}
                                                                    >
                                                                        <FaTrash
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>}

                                                        <br />
                                                    </div>
                                                ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} marginTop={1} >
                                        <br /> <br />
                                        <Typography variant="h6">
                                            Signature
                                        </Typography>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={unitOptionEdit}
                                                        value={{ value: unitEdit, label: unitEdit }}
                                                        onChange={(e) => {
                                                            setUnitEdit(e.value);
                                                            setEmployeeEdit("Please Select Employee");
                                                            setTeamEdit("Please Select Team");
                                                            setEmployeeOptionEdit([])
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={allTeam?.filter(
                                                            (comp) =>
                                                                companyEdit === comp.company && branchEdit === comp.branch && unitEdit === comp.unit
                                                        )?.map(data => ({
                                                            label: data.teamname,
                                                            value: data.teamname,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={{ value: teamEdit, label: teamEdit }}
                                                        onChange={(e) => {
                                                            fetchEmployeeAllEdit(companyEdit, branchEdit, unitEdit, e.value);
                                                            setTeamEdit(e.value);
                                                            setEmployeeEdit("Please Select Employee");
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Employee<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={employeeOptionEdit}
                                                        value={{ value: employeeEdit, label: employeeEdit }}
                                                        onChange={(e) => {
                                                            setEmployeeEdit(
                                                                e.value
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Seal<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={[{ label: "None", value: "None" }, { label: "For Seal", value: "For Seal" }]}
                                                        value={{ value: forSealEdit, label: forSealEdit }}
                                                        onChange={(e) => {
                                                            setForSealEdit(
                                                                e.value
                                                            )
                                                            setTopContentEdit("")
                                                            setBottomContentEdit("")
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            {forSealEdit === "For Seal" &&
                                                <>
                                                    <Grid item md={2} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography><b>Top Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                placeholder="Please Enter Top Content"
                                                                value={topContentEdit}
                                                                onChange={(e) => {
                                                                    setTopContentEdit(
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                            />

                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={2} xs={12} sm={12}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography><b>Bottom Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                placeholder="Please Enter Bottom Content"
                                                                value={bottomContentEdit}
                                                                onChange={(e) => {
                                                                    setBottomContentEdit(
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                            />

                                                        </FormControl>
                                                    </Grid>
                                                </>}
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter Name"
                                                        value={signaturenameEdit}
                                                        onChange={(e) => {
                                                            setSignaturenameEdit(

                                                                e.target.value,
                                                            );
                                                        }}
                                                    />

                                                </FormControl>
                                            </Grid>
                                        </>
                                        <br />
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography><b>Signature Logo</b>{forSeal === "For Seal" ? "" : <b style={{ color: "red" }}>*</b>}</Typography>

                                            <div>

                                                <Button variant="contained" onClick={handleClick10Edit} size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                    Upload

                                                </Button>
                                                <Menu
                                                    anchorEl={anchorElDoc10Edit}
                                                    open={Boolean(anchorElDoc10Edit)}
                                                    onClose={handleClose10Edit}
                                                >
                                                    <MenuItem onClick={() => handleMenuItemClick10Edit('local')}>Upload Local</MenuItem>
                                                    <MenuItem onClick={() => handleMenuItemClick10Edit('organizational')}>Organizational Document</MenuItem>
                                                </Menu>
                                                {(option10Edit === 'local' && documentFilesSignatureEdit?.length === 0) && (
                                                    <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                        Upload Local
                                                        <input
                                                            type="file"
                                                            id="resume"
                                                            accept=".png"
                                                            name="file"
                                                            hidden
                                                            onChange={(e) => {
                                                                handleResumeUploadSignatureEdit(e);
                                                            }}
                                                        />
                                                    </Button>
                                                )}
                                                {option10Edit === 'organizational' && (
                                                    <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                        <Selects
                                                            options={orgDocuments}
                                                            value={{ value: docBodyHeader10Edit, label: docBodyHeader10Edit }}
                                                            onChange={(e) => {
                                                                setDocBodyHeader10Edit(e.value)
                                                                const resume = e?.document[0];
                                                                setdocumentFilesSignatureEdit([{ name: resume?.name, preview: resume?.preview, data: resume?.data, remark: e?.value }]);
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}

                                            </div>

                                            <Grid item md={12} xs={12} sm={12}>
                                                {documentFilesSignatureEdit?.length > 0 &&
                                                    documentFilesSignatureEdit.map((file, index) => (
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid item md={8} sm={6} xs={6}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid></Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewSignatureEdit(file)} />
                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>
                                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteSignatureEdit(index)}>
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                            <Button
                                                variant="contained"
                                                sx={{ minWidth: "35px" }}
                                                onClick={handleCreateTodocheckSignatureEdit}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Grid>
                                        <Grid item md={12} xs={12} sm={12}>
                                            {todoscheckSignatureEdit?.length > 0 &&
                                                todoscheckSignatureEdit.map((todo, index) => (
                                                    <div key={index}>
                                                        <br />
                                                        <br />
                                                        <br />
                                                        {editingIndexcheck === index ?
                                                            <Grid container spacing={1}>
                                                                <>

                                                                    <>
                                                                        <Grid item md={2} xs={12} sm={6}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography>
                                                                                    Unit<b style={{ color: "red" }}>*</b>
                                                                                </Typography>
                                                                                <Selects
                                                                                    options={unitOptionEdit}
                                                                                    value={{ value: unitEditTodo, label: unitEditTodo }}
                                                                                    onChange={(e) => {
                                                                                        setUnitEditTodo(e.value);
                                                                                        setEmployeeEditTodo("Please Select Employee");
                                                                                        setTeamEditTodo("Please Select Team");
                                                                                        setEmployeeOptionEdit([])
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={2} xs={12} sm={6}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography>
                                                                                    Team<b style={{ color: "red" }}>*</b>
                                                                                </Typography>
                                                                                <Selects
                                                                                    options={allTeam?.filter(
                                                                                        (comp) =>
                                                                                            companyEdit === comp.company && branchEdit === comp.branch && unitEditTodo === comp.unit
                                                                                    )?.map(data => ({
                                                                                        label: data.teamname,
                                                                                        value: data.teamname,
                                                                                    })).filter((item, index, self) => {
                                                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                                    })}
                                                                                    value={{ value: teamEditTodo, label: teamEditTodo }}
                                                                                    onChange={(e) => {
                                                                                        fetchEmployeeAllEditTodo(companyEdit, branchEdit, unitEditTodo, e.value);
                                                                                        setTeamEditTodo(e.value);
                                                                                        setEmployeeEditTodo("Please Select Employee");
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={2} xs={12} sm={6}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography>
                                                                                    Employee<b style={{ color: "red" }}>*</b>
                                                                                </Typography>
                                                                                <Selects
                                                                                    options={employeeOptionEdit}
                                                                                    value={{ value: employeeEditTodo, label: employeeEditTodo }}
                                                                                    onChange={(e) => {
                                                                                        setEmployeeEditTodo(
                                                                                            e.value
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={2} xs={12} sm={6}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography>
                                                                                    Seal<b style={{ color: "red" }}>*</b>
                                                                                </Typography>
                                                                                <Selects
                                                                                    options={[{ label: "None", value: "None" }, { label: "For Seal", value: "For Seal" }]}
                                                                                    value={{ value: forSealEditTodo, label: forSealEditTodo }}
                                                                                    onChange={(e) => {
                                                                                        setForSealEditTodo(
                                                                                            e.value
                                                                                        )
                                                                                        setTopContentEditTodo("")
                                                                                        setBottomContentEditTodo("")
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        {forSealEditTodo === "For Seal" &&
                                                                            <>
                                                                                <Grid item md={2} xs={12} sm={12}>
                                                                                    <FormControl fullWidth size="small">
                                                                                        <Typography><b>Top Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                                                        <OutlinedInput
                                                                                            id="component-outlined"
                                                                                            type="text"
                                                                                            placeholder="Please Enter Top Content"
                                                                                            value={topContentEditTodo}
                                                                                            onChange={(e) => {
                                                                                                setTopContentEditTodo(
                                                                                                    e.target.value,
                                                                                                );
                                                                                            }}
                                                                                        />

                                                                                    </FormControl>
                                                                                </Grid>
                                                                                <Grid item md={2} xs={12} sm={12}>
                                                                                    <FormControl fullWidth size="small">
                                                                                        <Typography><b>Bottom Content</b><b style={{ color: "red" }}>*</b></Typography>
                                                                                        <OutlinedInput
                                                                                            id="component-outlined"
                                                                                            type="text"
                                                                                            placeholder="Please Enter Bottom Content"
                                                                                            value={bottomContentEditTodo}
                                                                                            onChange={(e) => {
                                                                                                setBottomContentEditTodo(
                                                                                                    e.target.value,
                                                                                                );
                                                                                            }}
                                                                                        />

                                                                                    </FormControl>
                                                                                </Grid>
                                                                            </>}
                                                                        <Grid item md={2} xs={12} sm={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography><b>Name</b><b style={{ color: "red" }}>*</b></Typography>
                                                                                <OutlinedInput
                                                                                    id="component-outlined"
                                                                                    type="text"
                                                                                    placeholder="Please Enter Name"
                                                                                    value={signaturenameEditTodo}
                                                                                    onChange={(e) => {
                                                                                        setSignaturenameEditTodo(

                                                                                            e.target.value,
                                                                                        );
                                                                                    }}
                                                                                />

                                                                            </FormControl>
                                                                        </Grid>
                                                                    </>
                                                                </>

                                                                <Grid item md={4} sm={6} xs={6}>
                                                                    <Typography><b>Signature Logo</b></Typography>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>   </Grid>
                                                                <Grid item md={1} sm={1} mt={2} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        disabled={
                                                                            false
                                                                        }

                                                                        onClick={handleUpdateTodocheck}
                                                                    >
                                                                        <CheckCircleIcon
                                                                            style={{
                                                                                color: "#216d21",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={1} xs={1}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "5px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSignTodo(false); setEditingIndexcheck(-1) }}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <CancelIcon
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.5rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid> :
                                                            <Grid container spacing={1}>
                                                                <>

                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Unit</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.unit}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Team</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.team}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Employee</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.employee}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Seal</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.seal}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    {todo?.seal === "For Seal" && <>
                                                                        <Grid item md={2} xs={12} sm={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography><b>Top Content</b></Typography>
                                                                                <OutlinedInput
                                                                                    id="component-outlined"
                                                                                    type="text"
                                                                                    placeholder="Please Enter Name"
                                                                                    value={todo.topcontent}
                                                                                    readOnly={true}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item md={2} xs={12} sm={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <Typography><b>Bottom Content</b></Typography>
                                                                                <OutlinedInput
                                                                                    id="component-outlined"
                                                                                    type="text"
                                                                                    placeholder="Please Enter Name"
                                                                                    value={todo.bottomcontent}
                                                                                    readOnly={true}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                    </>}
                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                        <FormControl fullWidth size="small">
                                                                            <Typography><b>Name</b></Typography>
                                                                            <OutlinedInput
                                                                                id="component-outlined"
                                                                                type="text"
                                                                                placeholder="Please Enter Name"
                                                                                value={todo.signaturename}
                                                                                readOnly={true}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </>
                                                                <br />
                                                                <br />
                                                                <Grid item md={3} sm={6} xs={6}>
                                                                    <Typography><b>Signature Logo</b></Typography>
                                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                                    </Box>
                                                                    <Grid item md={12} xs={12} sm={12}>
                                                                        {todo.document?.length > 0 &&
                                                                            todo.document.map((file, index) => (
                                                                                <>
                                                                                    <Grid container spacing={2}>
                                                                                        <Grid item md={10} sm={6} xs={6}>
                                                                                            <Typography>{file.name}</Typography>
                                                                                        </Grid>
                                                                                        <Grid></Grid>
                                                                                        <Grid item md={1} sm={6} xs={6}>
                                                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </>
                                                                            ))}
                                                                    </Grid>

                                                                </Grid>
                                                                <Grid item md={1} sm={6} xs={6}>   </Grid>
                                                                <Grid item md={1} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-13px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => handleEditTodocheck(index)}
                                                                    // disabled={!empdigits}
                                                                    >
                                                                        <FaEdit
                                                                            style={{
                                                                                color: "#1976d2",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item md={1} mt={2} sm={6} xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            minWidth: "20px",
                                                                            minHeight: "41px",
                                                                            background: "transparent",
                                                                            boxShadow: "none",
                                                                            marginTop: "-15px !important",
                                                                            "&:hover": {
                                                                                background: "#f4f4f4",
                                                                                borderRadius: "50%",
                                                                                minHeight: "41px",
                                                                                minWidth: "20px",
                                                                                boxShadow: "none",
                                                                            },
                                                                        }}
                                                                        onClick={() => { setSignTodo(false); handleDeleteTodocheckSignatureEdit(index) }}
                                                                    >
                                                                        <FaTrash
                                                                            style={{
                                                                                color: "#b92525",
                                                                                fontSize: "1.2rem",
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>}

                                                        <br />
                                                    </div>
                                                ))}
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <br />  <br />
                                <Grid container spacing={1}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography><b>From Email</b><b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter from address"
                                                value={fromEmailEdit}
                                                onChange={(e) => setFromEmailEdit(e.target.value)}
                                            // value={todo.signaturename}

                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography><b>CC Email</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter CC address"
                                                value={ccEmailEdit}
                                                onChange={(e) => setCcEmailEdit(e.target.value)}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                        <Button
                                            variant="contained"
                                            sx={{ minWidth: "35px" }}
                                            onClick={handleCreateCCEmailEdit}
                                        >
                                            <FaPlus />
                                        </Button>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12}>
                                        {ccEmailTodoEdit?.length > 0 && <Typography> <b>CC Email Address Todo : </b></Typography>}
                                        {ccEmailTodoEdit?.length > 0 &&
                                            ccEmailTodoEdit?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={8} sm={6} xs={6}>
                                                            <Typography>{file}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteCCEmailEdit(index)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography><b>BCC Email</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter BCC address"
                                                value={bccEmailEdit}
                                                onChange={(e) => setBccEmailEdit(e.target.value)}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
                                        <Button
                                            variant="contained"
                                            sx={{ minWidth: "35px" }}
                                            onClick={handleCreateBCCEmailEdit}
                                        >
                                            <FaPlus />
                                        </Button>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12}>
                                        {bccEmailTodoEdit?.length > 0 && <Typography> <b>BCC Email Address Todo : </b></Typography>}
                                        {bccEmailTodoEdit?.length > 0 &&
                                            bccEmailTodoEdit?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={8} sm={6} xs={6}>
                                                            <Typography>{file}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteBCCEmailEdit(index)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>

                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Email Format <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <ReactQuill
                                                style={{ maxHeight: "350px", height: "350px" }}
                                                value={emailFormatEdit}
                                                onChange={setEmailFormatEdit}
                                                modules={{
                                                    toolbar:
                                                        [[{ header: "1" }, { header: "2" },
                                                        { font: [] }], [{ size: [] }],
                                                        ["bold", "italic", "underline", "strike", "blockquote"],
                                                        [{ align: [] }],
                                                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                                        ["link", "image", "video"],
                                                        ["clean"]]
                                                }}

                                                formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "align", "list", "bullet", "indent", "link", "image", "video"]} />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br /><br />
                                <br /><br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <LoadingButton variant="contained" type="submit" >Update</LoadingButton>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                                    </Grid>
                                </Grid>
                                {/* </DialogContent> */}
                            </form>
                        </>
                    </Box>

                </Dialog>
            </Box >
            <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("ltemplatecontrolpanel") && (
                    <>
                        <Box sx={userStyle.container}>
                            { /* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Template Control Panel List</Typography>
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
                                            <MenuItem value={(sources?.length)}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box >
                                        {isUserRoleCompare?.includes("exceltemplatecontrolpanel") && (
                                            <>
                                                <ExportXL csvData={rowDataTable?.map((t, index) => ({
                                                    "Sno": index + 1,
                                                    "Company": t.company,
                                                    "Branch": t.branch,
                                                    "Company URL": t.companyurl,
                                                    "Company Name": t.companyname,
                                                    "Address": t.address,
                                                }))} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtemplatecontrolpanel") && (
                                            <>
                                                <ExportCSV csvData={rowDataTable?.map((t, index) => ({
                                                    "Sno": index + 1,
                                                    "Company": t.company,
                                                    "Branch": t.branch,
                                                    "Company URL": t.companyurl,
                                                    "Company Name": t.companyname,
                                                    "Address": t.address,
                                                }))} fileName={fileName} />

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtemplatecontrolpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftemplatecontrolpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetemplatecontrolpanel") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        )}
                                    </Box >
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <FormControl fullWidth size="small" >
                                            <Typography>Search</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                            {isUserRoleCompare?.includes("bdtemplatecontrolpanel") && (
                                <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}


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
                                    <Box
                                        style={{
                                            width: '100%',
                                            overflowY: 'hidden', // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            rows={rowsWithCheckboxes}
                                            columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                            onSelectionModelChange={handleSelectionChange}
                                            selectionModel={selectedRows}
                                            autoHeight={true}
                                            ref={gridRef}
                                            density="compact"
                                            hideFooter
                                            getRowClassName={getRowClassName}
                                            disableRowSelectionOnClick
                                        />


                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbers?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePage < totalPages && <span>...</span>}
                                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
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

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delSource(Sourcesid)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>


                {/* this is info view details */}

                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Template Control Panel Info</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">added by</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br /><br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Company URL</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.companyurl}</TableCell>
                                        <TableCell>{row.companyname}</TableCell>
                                        <TableCell>{row.address}</TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Template Control Panel</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography ><b>Company</b></Typography>
                                    <Typography>{purposeEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography ><b>Branch</b></Typography>
                                    <Typography>{purposeEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>Document Letter Head Content Header</b> </Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentContentHeaderView?.length > 0 &&
                                        documentFilesDocumentContentHeaderView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentHeader(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>Document Letter Head Content Footer</b> </Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentContentFooterView?.length > 0 &&
                                        documentFilesDocumentContentFooterView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentContentFooter(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>Document Letter Head Body Content(Background)</b> </Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentBodyContentView?.length > 0 &&
                                        documentFilesDocumentBodyContentView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBodyContent(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography ><b>Company URL</b></Typography>
                                    <Typography>{purposeEdit.companyurl}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>ID Card Front Header</b> </Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentFrontHeaderView?.length > 0 &&
                                        documentFilesDocumentFrontHeaderView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontHeader(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>ID Card Front Footer</b></Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentFrontFooterView?.length > 0 &&
                                        documentFilesDocumentFrontFooterView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentFrontFooter(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>ID Card Back Header</b> </Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentBackHeaderView?.length > 0 &&
                                        documentFilesDocumentBackHeaderView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackHeader(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>ID Card Back Footer </b></Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesDocumentBackFooterView?.length > 0 &&
                                        documentFilesDocumentBackFooterView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackFooter(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography ><b>Company Name</b></Typography>
                                    <Typography>{purposeEdit.companyname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography ><b>Address</b></Typography>
                                    <Typography>{purposeEdit.address}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography ><b>Logo</b> </Typography>
                                <br></br>
                                <Grid item md={12} xs={12} sm={12}>
                                    {documentFilesView?.length > 0 &&
                                        documentFilesView?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item md={8} sm={6} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid></Grid>
                                                    <Grid item md={1} sm={6} xs={6}>
                                                        <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewDocumentBackFooter(file)} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Seal</Typography>
                                    <Grid item md={12} xs={12} sm={12}>
                                        {todoscheckSealView?.length > 0 &&
                                            todoscheckSealView.map((todo, index) => (
                                                <div key={index}>

                                                    <Grid container spacing={1}>
                                                        <>
                                                            <Grid item md={3} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    <Typography><b>Seal Type</b></Typography>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        value={todo.seal}
                                                                        readOnly={true}
                                                                    />

                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={3} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    <Typography><b>Name</b></Typography>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        value={todo.name}
                                                                        readOnly={true}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </>
                                                        <br />
                                                        <br />
                                                        <Grid item md={4} sm={6} xs={6}>
                                                            <Typography><b>Seal Logo</b></Typography>
                                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                            </Box>
                                                            <Grid item md={12} xs={12} sm={12}>
                                                                {todo.document?.length > 0 &&
                                                                    todo.document.map((file, index) => (
                                                                        <>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item md={8} sm={6} xs={6}>
                                                                                    <Typography>{file.name}</Typography>
                                                                                </Grid>
                                                                                <Grid></Grid>
                                                                                <Grid item md={1} sm={6} xs={6}>
                                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                </Grid>

                                                                            </Grid>
                                                                        </>
                                                                    ))}
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>

                                                    <br />
                                                </div>
                                            ))}
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Signature</Typography>
                                    <Grid item md={12} xs={12} sm={12}>
                                        {documentFilesSignatureView?.length > 0 &&
                                            documentFilesSignatureView.map((todo, index) => (
                                                <div key={index}>

                                                    <Grid container spacing={1}>
                                                        <>

                                                            <Grid item md={2.5} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    <Typography><b>Unit</b></Typography>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        value={todo.unit}
                                                                        readOnly={true}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={2.5} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    <Typography><b>Team</b></Typography>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        value={todo.team}
                                                                        readOnly={true}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={2.5} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    <Typography><b>Employee</b></Typography>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        value={todo.employee}
                                                                        readOnly={true}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={2.5} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    <Typography><b>Name</b></Typography>
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        placeholder="Please Enter Name"
                                                                        value={todo.signaturename}
                                                                        readOnly={true}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </>
                                                        <br />
                                                        <br />
                                                        <Grid item md={2} sm={6} xs={6}>
                                                            <Typography><b>Signature Logo</b></Typography>
                                                            <Box sx={{ display: "flex", justifyContent: "left" }}>

                                                            </Box>
                                                            <Grid item md={12} xs={12} sm={12}>
                                                                {todo.document?.length > 0 &&
                                                                    todo.document.map((file, index) => (
                                                                        <>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item md={8} sm={6} xs={6}>
                                                                                    <Typography>{file.name}</Typography>
                                                                                </Grid>
                                                                                <Grid></Grid>
                                                                                <Grid item md={1} sm={6} xs={6}>
                                                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                                                </Grid>

                                                                            </Grid>
                                                                        </>
                                                                    ))}
                                                            </Grid>

                                                        </Grid>
                                                        <br />
                                                        <br />
                                                        <Grid item md={4} xs={12} sm={12} >
                                                            <FormControl fullWidth size="small">
                                                                <Typography ><b>From Email</b></Typography>
                                                                <Typography>{purposeEdit.fromemail}</Typography>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={4} xs={12} sm={12} >
                                                            <FormControl fullWidth size="small">
                                                                <Typography ><b>CC Email</b></Typography>
                                                                {Array.isArray(purposeEdit.ccemail) ? purposeEdit.ccemail?.map((item => <Typography>{item}</Typography>)) : ""}

                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={4} xs={12} sm={12} >
                                                            <FormControl fullWidth size="small">
                                                                <Typography ><b>BCC Email</b></Typography>
                                                                {Array.isArray(purposeEdit.bccemail) ? purposeEdit.bccemail?.map((item => <Typography>{item}</Typography>)) : ""}
                                                            </FormControl>
                                                        </Grid>

                                                    </Grid>

                                                    <br />
                                                </div>
                                            ))}
                                    </Grid>
                                </FormControl>
                            </Grid>



                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delSourcecheckbox(e)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Clear DIALOG */}
            <Dialog open={isClearOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Cleared Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* Add DIALOG */}
            <Dialog open={isAddOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Added Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* Delete DIALOG */}
            <Dialog open={isDeletealert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* BulkDelete DIALOG */}
            <Dialog open={isBulkDelOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* BulkDelete DIALOG */}
            <Dialog open={isUpdateOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Updated Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/*INFO For Uploading Signature */}

            <Box>
                <Dialog
                    open={isInfoOpenImage}
                    onClose={handleCloseInfoImage}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            In case you are uploading An signature's , Please make sure that image's will properly alligned and uploaded in a way that the image shown below
                        </Typography>
                        <Box sx={{ margin: '16px 0' }}>
                            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/SignInfoImage.png" alt="SignInformationImage" />
                                        <HighlightOffIcon sx={{ fontSize: '40px', color: 'red', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/SignInfoImageCorrect.png" alt="SignInformationImageCorrect" />
                                        <CheckCircleOutlineIcon sx={{ fontSize: '40px', color: 'green', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/sealWrong.png" alt="Sealwrong" height={100} width={100} />
                                        <HighlightOffIcon sx={{ fontSize: '40px', color: 'red', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/sealCorrect.png" alt="SealCorrect" height={100} width={100} />
                                        <CheckCircleOutlineIcon sx={{ fontSize: '40px', color: 'green', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImage} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton loading={btnSubmit} autoFocus variant="contained" color='primary'
                            onClick={(e) => sendRequest(e)}
                        > Submit </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={isInfoOpenImageEdit}
                    onClose={handleCloseInfoImageEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">
                            In case you are uploading An signature's , Please make sure that image's will properly alligned and uploaded in a way that the image shown below
                        </Typography>
                        <Box sx={{ margin: '16px 0' }}>
                            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/SignInfoImage.png" alt="SignInformationImage" />
                                        <HighlightOffIcon sx={{ fontSize: '40px', color: 'red', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/SignInfoImageCorrect.png" alt="SignInformationImageCorrect" />
                                        <CheckCircleOutlineIcon sx={{ fontSize: '40px', color: 'green', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/sealWrong.png" alt="Sealwrong" height={100} width={100} />
                                        <HighlightOffIcon sx={{ fontSize: '40px', color: 'red', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src="/sealCorrect.png" alt="SealCorrect" height={100} width={100} />
                                        <CheckCircleOutlineIcon sx={{ fontSize: '40px', color: 'green', marginTop: '8px' }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfoImageEdit} sx={userStyle.btncancel}>Cancel</Button>
                        <LoadingButton loading={btnSubmitEdit} autoFocus variant="contained" color='primary'
                            onClick={(e) => sendEditRequest(e)}
                        > Update </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
}


export default TempControlPanel;