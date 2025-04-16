import React, { useState, useEffect, useRef, useContext } from "react";
import {
    TextField,
    IconButton,
    ListItem,
    List,

    Checkbox,
    ListItemText,
    Popover,
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Table,
    TableHead,
    TableContainer,
    Button,
} from "@mui/material";
import { colourStyles, userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import StyledDataGrid from "../../components/TableStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import RaiseticketOpenList from "./RaiseTicketOpenlist";
import RaiseticketClosedResolvedList from "./RaiseTicketClosedResolved";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '../../components/Pagination';
import LoadingButton from "@mui/lab/LoadingButton"
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

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
        complete: {
            textTransform: "capitalize !IMPORTANT",
            padding: "7px 19px",
            backgroundColor: "#00905d",
            height: "fit-content",
        },
    },
}));

function RaiseticketList() {
    const classes = useStyles();

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const gridApiRef = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
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

    let exportColumnNames = ['Status',
        'Ticket Number',
        'Raised By',
        'Raised Date',
        'Resolved By',
        'Resolved Date',
        'Reason ',
        'Employee Name',
        'Employee Code',
        'Category',
        'Subcategory ',
        'Sub 1 category '];
    let exportRowValues = [
        'status',
        'raiseticketcount',
        'raisedby',
        'raiseddate',
        'resolverby',
        'resolvedate',
        'reason',
        'employeename',
        'employeecode',
        'category',
        'subcategory',
        'subsubcategory'
    ];


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
            pagename: String("Ticket/Raise Ticket/Consolidated Ticket List"),
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


    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [items, setItems] = useState([]);
    const [filterValue, setFilterValue] = useState("All Ticket");
    const [openPageList, setOpenPageList] = useState("");
    const [closedPageList, setClosedPageList] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, allTeam, isAssignBranch, allUsersData, pageName,
        setPageName,
        buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    //Datatable
    const [queueCheck, setQueueCheck] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    // Error Popup model
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [capturedImages, setCapturedImages] = useState([]);
    const [refImage, setRefImage] = useState([]);
    const [refImageDrag, setRefImageDrag] = useState([]);
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



    // FILTER STATES AND VARIABLES
    const [btnSubmit, setBtnSubmit] = useState(false);

    const [changeOverall, setChangeOverall] = useState("")

    const [categorys, setCategorys] = useState([]);
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);
    const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);
    let [valueEmployee, setValueEmployee] = useState([]);
    const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
    let [valueCat, setValueCat] = useState([]);
    //subcategory multiselect
    const [selectedOptionsSubCat, setSelectedOptionsSubCat] = useState([]);
    let [valueSubCat, setValueSubCat] = useState([]);
    const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);
    const [selectedOptionsSubSubCat, setSelectedOptionsSubSubCat] = useState([]);
    let [valueSubSubCat, setValueSubSubCat] = useState([]);
    const [filteredSubCategoryOptions, setFilteredSubCategoryOptions] = useState(
        []
    );
    let [selectedRaiseSelfValues, setSelectRaiseSelfValues] = useState([])
    const [selectedRaiseSelfOptions, setSelectedRaiseSelfOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [filteredSubSubCategoryOptions, setFilteredSubSubCategoryOptions] =
        useState([]);
    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        // fetchBranchAll(options)
    };

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        // fetchUnitAll(options)
    };

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        // fetchTeamAll(options)
    };

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
    };


    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };
    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };
    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };
    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //employee multiselect dropdown changes
    const handleEmployeeChangeFrom = (options) => {
        setSelectedEmployeeFrom(options)
        setValueEmployee(
            options.map((a, index) => {
                return a.value;
            })
        );
    };
    const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Employee";
    };

    const handleCategoryChange = (options) => {
        setValueCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCat(options);
        setValueSubCat([]);
        setSelectedOptionsSubCat([]);
        setValueSubSubCat([]);
        setSelectedOptionsSubSubCat([]);
    };

    const customValueRendererCat = (valueCat, _categoryname) => {
        return valueCat?.length
            ? valueCat.map(({ label }) => label)?.join(", ")
            : "Please Select Category";
    };


    const handleSubCategoryChange = (options) => {
        setValueSubCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCat(options);
        setValueSubSubCat([]);
        setSelectedOptionsSubSubCat([]);
    };

    const customValueRendererSubCat = (valueSubCat, _categoryname) => {
        return valueSubCat?.length
            ? valueSubCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    const handleSubSubCategoryChange = (options) => {
        setValueSubSubCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubSubCat(options);
    };
    const handleRaiseSelfOptions = (options) => {
        setSelectRaiseSelfValues(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedRaiseSelfOptions(options);
    };
    const customValueRendererRaiseSelf = (valueSubSubCat, _categoryname) => {
        return valueSubSubCat?.length
            ? valueSubSubCat.map(({ label }) => label)?.join(", ")
            : "Please Select Ticket Status";
    };

    const customValueRendererSubSubCat = (valueSubSubCat, _categoryname) => {
        return valueSubSubCat?.length
            ? valueSubSubCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Sub Category";
    };
    const fetchSubsubcomponent = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSubSubCategoryOptions(res_vendor?.data?.subsubcomponents);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchCategoryBased = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryOptions(res_category.data.ticketcategory);
            let data_set = res_category.data.ticketcategory
                .filter((data) => {
                    return valueCat.includes(data.categoryname);
                })
                .map((data) => data.subcategoryname);

            let ans = [].concat(...data_set);
            setSubcategorys(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchCategoryTicket = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.ticketcategory.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                })),
            ];

            setCategorys(categoryall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        let catopt = selectedOptionsCat.map((item) => item.value);
        let subcatopt = selectedOptionsSubCat.map((item) => item.value);
        const filteredCategoryOptions = subSubCategoryOptions
            ?.filter(
                (u) =>
                    u.categoryname.some((data) => catopt.includes(data)) &&
                    u.subcategoryname.some((data) => subcatopt.includes(data))
            )
            .map((u) => ({
                ...u,
                label: u.subsubname,
                value: u.subsubname,
            }));

        setFilteredSubSubCategoryOptions(filteredCategoryOptions);
    }, [valueCat, valueSubCat]);

    useEffect(() => {
        const filteredCategoryOptions = categoryOptions
            ?.filter((u) => valueCat?.includes(u.categoryname))
            .map((u) => ({
                ...u,
                label: u.subcategoryname,
                value: u.subcategoryname,
            }));
        let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
            obj.subcategoryname.map((subcategory) => ({
                label: subcategory,
                value: subcategory,
            }))
        );
        setFilteredSubCategoryOptions(subcategoryNames);
    }, [valueCat]);




    useEffect(() => {
        fetchSubsubcomponent();
        fetchCategoryTicket();
        fetchCategoryBased();
    }, [])














    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


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

    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        setIsHandleChange(true)
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Error Popup model
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [showViewAlert, setShowViewAlert] = useState();
    const handleClickOpenViewpop = () => {
        setIsViewOpen(true);
    };
    const handleCloseViewpop = () => {
        setIsViewOpen(false);
    };
    //delete model
    const [openDelete, setOpenDelete] = useState(false);
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const [allUploadedFiles, setAllUploadedFiles] = useState([]);

    const handleClear = async () => {
        await handleFilterTickets("Cleared");
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedEmployeeFrom([])
        setValueEmployee([]);
        setValueCompanyCat([])
        setValueUnitCat([])
        setValueBranchCat([])
        setValueTeamCat([])
        setValueCat([])
        setValueSubCat([])
        setValueSubSubCat([])
        setSelectedOptionsCat([])
        setSelectedOptionsSubCat([])
        setSelectedOptionsSubSubCat([])
        setSelectedRaiseSelfOptions([])
        setSelectRaiseSelfValues([])

        setPage(1);
        setPageSize(10);
        setBtnSubmit(false)


        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    const role = isUserRoleAccess?.role?.map(data => data?.toLowerCase())
    const RoleCheck = role?.some(data => ["manager", 'superadmin']?.includes(data))
    const handleFilterTickets = async (e) => {
        setQueueCheck(true);

        setPageName(!pageName);
        try {
            let res_task = await axios.post(SERVICE.RAISETICKET_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: e === 'Cleared' ? [] : valueCompanyCat,
                unit: e === 'Cleared' ? [] : valueUnitCat,
                branch: e === 'Cleared' ? [] : valueBranchCat,
                team: e === 'Cleared' ? [] : valueTeamCat,
                employeename: e === 'Cleared' ? [] : valueEmployee,
                category: e === 'Cleared' ? [] : valueCat,
                subcategory: e === 'Cleared' ? [] : valueSubCat,
                subsubcategory: e === 'Cleared' ? [] : valueSubSubCat,
                value: e === 'Cleared' ? [] : selectedRaiseSelfValues?.length > 0 ? selectedRaiseSelfValues : ["All Ticket"],
                username: isUserRoleAccess.companyname,
                role: RoleCheck,
                page: page,
                pageSize: pageSize,
            });
            const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : []
            const overallList = res_task?.data?.overallList?.length > 0 ? res_task?.data?.overallList : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                subsubcategory: item?.subsubcategory === "Please Select Sub Sub-category" ? "" : item?.subsubcategory,
            }));
            const overallListData = overallList?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                subsubcategory: item?.subsubcategory === "Please Select Sub Sub-category" ? "" : item?.subsubcategory,
            }));
            setRaiseTicketList(itemsWithSerialNumber);
            setItemsList(overallListData)
            setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setQueueCheck(false);
            setBtnSubmit(false)
        } catch (err) { setQueueCheck(false); setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const addSerialNumber = (data) => {
        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(raiseTicketList);
    }, [raiseTicketList]);

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        if (
            valueCompanyCat?.length < 1
        ) {
            setPopupContentMalert('Please Select Company');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setBtnSubmit(true)
            setSearchQuery("")
            handleFilterTickets();
        }
    };
    useEffect(() => {
        handleFilterTickets();
    }, [page, pageSize]);

    const [singleDoc, setSingleDoc] = useState({});
    const [updateDetails, setUpDateDetails] = useState({});
    let updateby = singleDoc?.updatedby;
    let addedby = singleDoc?.addedby;

    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res?.data?.sraiseticket);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getrowData = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res?.data?.sraiseticket);
            handleClickOpenViewpop();
            setCapturedImages(res?.data?.sraiseticket?.files);
            setRefImage(res?.data?.sraiseticket?.files);
            setRefImageDrag(res?.data?.sraiseticket?.files);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Combine all arrays into a single array
    let combinedArray = allUploadedFiles.concat(
        refImage,
        refImageDrag,
        capturedImages
    );

    // Create an empty object to keep track of unique values
    let uniqueValues = {};

    // Filter out duplicates and create a new array
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });

    const getInfoDetails = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleDoc(res?.data?.sraiseticket);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.delete(
                `${SERVICE.RAISETICKET_SINGLE}/${singleDoc._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            handleCloseDelete();
            setChangeOverall("deleted" + singleDoc._id)
            await handleFilterTickets();
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            setOpenPageList("changed");
            setClosedPageList("changed");
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        status: true,
        raiseticketcount: true,
        raisedby: true,
        raiseddate: true,
        resolverby: true,
        resolvedate: true,
        category: true,
        subcategory: true,
        subsubcategory: true,
        employeename: true,
        employeecode: true,
        reason: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

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
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
        );
    });


    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

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
            headerName: "S.No",
            flex: 0,
            width: 50,
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 100,
            hide: !columnVisibility.status,
            pinned: "left",
            lockPinned: true,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography
                            sx={{
                                color:
                                    params.data.status === "Open"
                                        ? "red"
                                        : params.data.status === "Resolved"
                                            ? "green"
                                            : params.data.status === "Details Needed"
                                                ? "blue"
                                                : params.data.status === "Closed"
                                                    ? "Orange"
                                                    : params.data.status === "Forwarded"
                                                        ? "palevioletred"
                                                        : params.data.status === "Reject"
                                                            ? "darkmagenta"
                                                            : "violet",
                            }}
                        >
                            {params.data.status}
                        </Typography>
                    </Grid>
                </Grid>
            ),
        },
        {
            field: "raiseticketcount",
            headerName: "Ticket Number",
            flex: 0,
            width: 200,
            hide: !columnVisibility.raiseticketcount,
        },
        {
            field: "raisedby",
            headerName: "Raised By",
            flex: 0,
            width: 100,
            hide: !columnVisibility.raisedby,
        },
        {
            field: "raiseddate",
            headerName: "Raised Date/Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.raiseddate,
        },
        {
            field: "resolverby",
            headerName: "Resolved By",
            flex: 0,
            width: 150,
            hide: !columnVisibility.resolverby,
        },
        {
            field: "resolvedate",
            headerName: "Resolved Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.resolvedate,
        },
        {
            field: "reason",
            headerName: "Resolved Reason",
            flex: 0,
            width: 100,
            hide: !columnVisibility.reason,
        },
        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeename,
        },
        {
            field: "employeecode",
            headerName: "Employee Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeecode,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 100,
            hide: !columnVisibility.category,
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 150,

            hide: !columnVisibility.subcategory,
        },
        {
            field: "subsubcategory",
            headerName: "Sub 1 category",
            flex: 0,
            width: 150,

            hide: !columnVisibility.subsubcategory,
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            sortable: false,
            hide: !columnVisibility.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.status !== "Closed" &&
                        params.data.status !== "Resolved" &&
                        params.data.status !== "Reject"
                        ? isUserRoleCompare?.includes("eraiseticket") && (
                            <Link
                                to={`/tickets/raiseticketmaster/${params.data.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                    minWidth: "0px",
                                }}
                            >
                                {params.data.status === "Details Needed" ? (
                                    <Button
                                        sx={userStyle.buttonedit}
                                        style={{ minWidth: "0px" }}
                                    >
                                        {"Re-Raise"}
                                    </Button>
                                ) : (
                                    <Button
                                        sx={userStyle.buttonedit}
                                        style={{ minWidth: "0px" }}
                                    >
                                        <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontSize: "large" }} />
                                    </Button>
                                )}
                            </Link>
                        )
                        : ""}
                    {params.data.status !== "Closed" &&
                        params.data.status !== "Resolved" &&
                        params.data.status !== "Reject"
                        ? isUserRoleCompare?.includes("draiseticket") && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    getinfoCode(params.data.id);

                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                            </Button>
                        )
                        : ""}
                    {isUserRoleCompare?.includes("vraiseticket") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getrowData(params.data.id);

                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iraiseticket") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getInfoDetails(params.data.id);

                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontSize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    // Function to remove HTML tags and convert to numbered list
    const convertToNumberedList = (htmlContent) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;

        const listItems = Array.from(tempElement.querySelectorAll("li"));
        listItems.forEach((li, index) => {
            li.innerHTML = `\u2022 ${li.innerHTML}\n`;
        });

        return tempElement.innerText;
    };

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            employeename: item.employeename,
            employeecode: item.employeecode,
            category: item.category,
            subcategory: item.subcategory,
            subsubcategory: item.subsubcategory,
            workstation: item.workstation,
            materialname: item.materialname,
            type: item.type,
            raiseddate: item.raiseddate,
            raisedby: item.raisedby,
            resolverby: item?.ticketclosed,
            resolvedate: item.resolvedate,
            raiseticketcount: item.raiseticketcount,
            reason: item.textAreaCloseDetails,
            priority: item.priority,
            status: item.raiseself,
            duedate: item.duedate,
            title: item.title,
            description: item.description,
        };
    });

    // Excel
    const fileName = "RaiseTicket_List";
    let snos = 1;

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "RaiseTicket_List",
        pageStyle: "print",
    });





    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Consolidated Raise Ticket List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    // const convertToCSV = (data) => {
    //   if (!data.length) return ''; // Return empty string if no data

    //   const header = Object.keys(data[0]).join(',') + '\n';
    //   const rows = data.map((row) => Object.values(row).join(',')).join('\n');
    //   return header + rows;
    // };



    // const handleCaptureImage = () => {
    //   // Trigger the capture image function in the child
    //   if (gridRefTable.current) {
    //     const gridImage = gridRefTable.current.captureGridImage();
    //     console.log('Captured Image:', gridImage);
    //     // You can process the image here
    //   }
    // };

    // JSX for the "Manage Columns" popover content


    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                                        sx={{ marginTop: "-10px" }}
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={column.headerName}
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
                            onClick={() => setColumnVisibility({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

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

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const delAccountcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.RAISETICKET_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false)
            setPage(1);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setChangeOverall("selectedRows")
            setOpenPageList("changed");
            setClosedPageList("changed");
            await handleFilterTickets();
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [copiedData, setCopiedData] = useState("");

    return (
        <Box>
            <Headtitle title={"RAISE TICKET LIST"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Raise Ticket List</Typography> */}
            <PageHeading
                title="Raise Ticket List"
                modulename="Tickets"
                submodulename="Raise Ticket"
                mainpagename="Consolidated Ticket List"
                subpagename=""
                subsubpagename=""
            />

            <>
                {isUserRoleCompare?.includes("lconsolidatedticketlist") && (
                    <>
                        {RoleCheck && <Box sx={userStyle.selectcontainer}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Raise Ticket List
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    {isUserRoleCompare?.includes("araiseticket") && (
                                        <>
                                            <Link
                                                to="/tickets/raiseticketmaster"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "white",
                                                    float: "right",
                                                }}
                                            >
                                                <Button sx={buttonStyles.buttonsubmit} variant="contained">ADD</Button>
                                            </Link>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch
                                                    ?.map((data) => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsCompany}
                                                onChange={(e) => {
                                                    handleCompanyChange(e);
                                                    setSelectedOptionsBranch([]);
                                                    setValueBranchCat([]);
                                                    setValueUnitCat([]);
                                                    setValueTeamCat([]);
                                                    setSelectedOptionsUnit([]);
                                                    setSelectedOptionsTeam([]);
                                                    setSelectedEmployeeFrom([])
                                                    setValueEmployee([]);
                                                }}
                                                valueRenderer={customValueRendererCompany}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch
                                                    ?.filter((comp) => {
                                                        let datas = selectedOptionsCompany?.map(
                                                            (item) => item?.value
                                                        );
                                                        return datas?.includes(comp.company);
                                                    })
                                                    ?.map((data) => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsBranch}
                                                onChange={(e) => {
                                                    handleBranchChange(e);
                                                    setSelectedOptionsTeam([]);
                                                    setSelectedOptionsUnit([]);
                                                    setValueUnitCat([]);
                                                    setValueTeamCat([]);
                                                    setSelectedEmployeeFrom([])
                                                    setValueEmployee([]);
                                                }}
                                                valueRenderer={customValueRendererBranch}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch
                                                    ?.filter((comp) => {
                                                        let compdatas = selectedOptionsCompany?.map(
                                                            (item) => item?.value
                                                        );
                                                        let branchdatas = selectedOptionsBranch?.map(
                                                            (item) => item?.value
                                                        );
                                                        return (
                                                            compdatas?.includes(comp.company) &&
                                                            branchdatas?.includes(comp.branch)
                                                        );
                                                    })
                                                    ?.map((data) => ({
                                                        label: data.unit,
                                                        value: data.unit,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsUnit}
                                                onChange={(e) => {
                                                    handleUnitChange(e);
                                                    setValueTeamCat([]);
                                                    setSelectedOptionsTeam([]);
                                                    setSelectedEmployeeFrom([])
                                                    setValueEmployee([]);
                                                }}
                                                valueRenderer={customValueRendererUnit}
                                                labelledBy="Please Select Unit"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team
                                            </Typography>
                                            <MultiSelect
                                                options={allTeam
                                                    ?.filter((comp) => {
                                                        let compdatas = selectedOptionsCompany?.map(
                                                            (item) => item?.value
                                                        );
                                                        let branchdatas = selectedOptionsBranch?.map(
                                                            (item) => item?.value
                                                        );
                                                        let unitdatas = selectedOptionsUnit?.map(
                                                            (item) => item?.value
                                                        );
                                                        return (
                                                            compdatas?.includes(comp.company) &&
                                                            branchdatas?.includes(comp.branch) &&
                                                            unitdatas?.includes(comp.unit)
                                                        );
                                                    })
                                                    ?.map((data) => ({
                                                        label: data.teamname,
                                                        value: data.teamname,
                                                    }))
                                                    .filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label && i.value === item.value
                                                            ) === index
                                                        );
                                                    })}
                                                value={selectedOptionsTeam}
                                                onChange={(e) => {
                                                    handleTeamChange(e);
                                                }}
                                                valueRenderer={customValueRendererTeam}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (comp) =>
                                                            valueCompanyCat?.includes(comp.company) &&
                                                            valueBranchCat?.includes(comp.branch) &&
                                                            valueUnitCat?.includes(comp.unit) &&
                                                            valueTeamCat?.includes(comp.team)
                                                    )
                                                    ?.map((com) => ({
                                                        ...com,
                                                        label: com.companyname,
                                                        value: com.companyname,
                                                    }))}
                                                value={selectedEmployeeFrom}
                                                onChange={handleEmployeeChangeFrom}
                                                valueRenderer={customValueRendererEmployeeFrom}
                                                labelledBy="Please Select Employeename"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category
                                            </Typography>
                                            <MultiSelect
                                                options={categorys}
                                                value={selectedOptionsCat}
                                                onChange={(e) => {
                                                    handleCategoryChange(e);
                                                }}
                                                valueRenderer={customValueRendererCat}
                                                labelledBy="Please Select Category"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category
                                            </Typography>
                                            <MultiSelect
                                                options={filteredSubCategoryOptions}
                                                value={selectedOptionsSubCat}
                                                onChange={(e) => {
                                                    handleSubCategoryChange(e);
                                                }}
                                                valueRenderer={customValueRendererSubCat}
                                                labelledBy="Please Select Sub Category"
                                            />
                                        </FormControl>
                                    </Grid>
                                    {filteredSubSubCategoryOptions?.length != 0 && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Sub Sub Category
                                                </Typography>
                                                <MultiSelect
                                                    options={filteredSubSubCategoryOptions}
                                                    value={selectedOptionsSubSubCat}
                                                    onChange={(e) => {
                                                        handleSubSubCategoryChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererSubSubCat}
                                                    labelledBy="Please Select Sub Sub Category"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Ticket Status
                                            </Typography>
                                            <MultiSelect
                                                options={[
                                                    { label: "All Ticket", value: "All Ticket" },
                                                    { label: "Open", value: "Open" },
                                                    { label: "Open Details Needed", value: "Open Details Needed", },
                                                    { label: "Details Needed", value: "Details Needed" },
                                                    { label: "Resolved", value: "Resolved" },
                                                    { label: "Closed", value: "Closed" },
                                                    { label: "Forwarded", value: "Forwarded" },
                                                    { label: "Hold", value: "Hold" },
                                                    { label: "Reject", value: "Reject" },
                                                    { label: "In-Repair", value: "In-Repair", },
                                                ]}
                                                value={selectedRaiseSelfOptions}
                                                onChange={(e) => {
                                                    handleRaiseSelfOptions(e);
                                                }}
                                                valueRenderer={customValueRendererRaiseSelf}
                                                labelledBy="Please Select Ticket Status"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>

                            </Grid> <br></br>
                            <Grid container spacing={2}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <LoadingButton sx={buttonStyles.buttonsubmit} variant="contained" loading={btnSubmit} onClick={handleSubmitFilter}>Filter</LoadingButton>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
                                </Grid>
                            </Grid>
                        </Box>}
                        <br></br>
                        <br></br>
                        <br></br>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Raise Ticket List
                                    </Typography>
                                </Grid>
                                {!RoleCheck && <Grid item xs={4}>
                                    {isUserRoleCompare?.includes("araiseticket") && (
                                        <>
                                            <Link
                                                to="/tickets/raiseticketmaster"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "white",
                                                    float: "right",
                                                }}
                                            >
                                                <Button sx={buttonStyles.buttonsubmit} variant="contained">ADD</Button>
                                            </Link>
                                        </>
                                    )}
                                </Grid>}
                            </Grid>
                            <br></br>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>

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
                                        <MenuItem value={itemsList?.length}>All</MenuItem>
                                    </Select>




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
                                    {isUserRoleCompare?.includes(
                                        "excelconsolidatedticketlist"
                                    ) && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "csvconsolidatedticketlist"
                                    ) && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "printconsolidatedticketlist"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "pdfconsolidatedticketlist"
                                    ) && (

                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>

                                        )}
                                    {isUserRoleCompare?.includes(
                                        "imageconsolidatedticketlist"
                                    ) && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={raiseTicketList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={true}
                                        totalDatas={itemsList}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            {/* ****** Table Grid Container ****** */}

                            <br />
                            <br />
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>{" "}
                            &emsp;
                            {isUserRoleCompare?.includes("bdconsolidatedticketlist") && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleClickOpenalert}
                                    sx={buttonStyles.buttonbulkdelete}
                                >
                                    Bulk Delete
                                </Button>
                            )}
                            <br />
                            <br />
                            {queueCheck ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        minHeight: "350px",
                                    }}
                                >
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

                            ) : (
                                <>
                                    {/* ****** Table start ****** */}
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
                                            gridApiRef={gridApiRef}
                                            paginated={true}
                                            filteredDatas={filteredDatas}
                                            totalDatas={totalProjects}
                                            searchQuery={searchQuery}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={itemsList}

                                        />
                                    </Box>

                                </>)}
                            <br></br>
                            <RaiseticketOpenList changed={changeOverall} setChanged={setChangeOverall} />
                            <br></br>
                            <RaiseticketClosedResolvedList changed={changeOverall} setChanged={setChangeOverall} />
                            {/* ****** Table End ****** */}
                        </Box>

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
                    </>
                )}
            </>

            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isViewOpen}
                    onClose={handleCloseViewpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "scroll",
                        "& .MuiPaper-root": {
                            overflow: "scroll",
                        },
                        marginTop: "40px"
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        View Raise Ticket
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                {singleDoc.accessdrop === "Manager" ? (
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>
                                                    Company
                                                </Typography>
                                                <Typography>{singleDoc.company?.map((t, i) => `${i + 1 + ". "}` + t)
                                                    .toString()}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>
                                                    Branch
                                                </Typography>
                                                <Typography>{singleDoc.branch}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>Unit</Typography>
                                                <Typography>{singleDoc.unit}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={userStyle.HeaderText}>Team</Typography>
                                                <Typography>{singleDoc.team}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            Employee Name
                                        </Typography>
                                        <Typography>
                                            {singleDoc.employeename
                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                .toString()}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            Employee Code
                                        </Typography>
                                        <Typography>
                                            {singleDoc.employeecode
                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                .toString()}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Category</Typography>
                                        <Typography>{singleDoc.category}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            Sub-Category
                                        </Typography>
                                        <Typography>{singleDoc.subcategory}</Typography>
                                    </FormControl>
                                </Grid>
                                {singleDoc.subsubcategory && (
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.HeaderText}>
                                                Sub Sub-Category
                                            </Typography>
                                            <Typography>
                                                {singleDoc.subsubcategory ===
                                                    "Please Select Sub Sub-category"
                                                    ? ""
                                                    : singleDoc.subsubcategory}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Type</Typography>
                                        <Typography>{singleDoc.type}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Reason</Typography>
                                        <Typography>{singleDoc.reason}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            Work Station
                                        </Typography>
                                        <Typography>{singleDoc?.workstation}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    {singleDoc.materialname && (
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.HeaderText}>
                                                Material Name
                                            </Typography>
                                            <Typography>{singleDoc?.materialname}</Typography>
                                        </FormControl>
                                    )}
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Priority</Typography>
                                        <Typography>{singleDoc.priority}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Title</Typography>
                                        <Typography>{singleDoc.title}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            Description
                                        </Typography>
                                        <Typography>
                                            {convertToNumberedList(singleDoc.description)}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>Status</Typography>
                                        <Typography>{singleDoc?.raiseself}</Typography>
                                    </FormControl>
                                </Grid>
                                {singleDoc.materialname && singleDoc.materialstatus && (
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={userStyle.HeaderText}>
                                                Material Status
                                            </Typography>
                                            <Typography>{singleDoc?.materialstatus}</Typography>
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={userStyle.HeaderText}>
                                            Reason For Ticket Status{" "}
                                        </Typography>
                                        <Typography>{singleDoc?.textAreaCloseDetails}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} xs={12} sm={12}></Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    {resultArray.map((file, index) => (
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
                                                    <Typography variant="subtitle2">
                                                        {" "}
                                                        {file.name}{" "}
                                                    </Typography>
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
                                                            onClick={() => renderFilePreview(file)}
                                                        >
                                                            <VisibilityOutlinedIcon
                                                                sx={buttonStyles.buttonview}
                                                                style={{ fontsize: "12px", color: "#357AE8" }}
                                                            />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ))}
                                </Grid>
                            </Grid>

                            <br />

                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={6} xs={6} sm={6}>
                                    <Button variant="contained" onClick={handleCloseViewpop} sx={buttonStyles.btncancel}>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* </DialogContent> */}
                        </>
                    </Box>
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
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "70px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseModalert}
                            sx={buttonStyles.buttonsubmit}
                        >
                            {" "}
                            OK{" "}
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
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            sx={buttonStyles.buttonsubmit}
                            onClick={(e) => delAccountcheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
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
                            sx={buttonStyles.buttonsubmit}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined" sx={buttonStyles.btncancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => getviewCode()}
                        autoFocus
                        variant="contained"
                        color="error"
                        sx={buttonStyles.buttonsubmit}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            <br />
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
                itemsTwo={itemsList ?? []}
                filename={"Consolidated Ticket List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Raise Ticket Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box>
    );
}

export default RaiseticketList;