import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Resizable from 'react-resizable';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";


function Penaltyclienterror() {

    const pathname = window.location.pathname;
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
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
    }
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const [interactorPurposeOptEdit, setInteractorPurposeOptEdit] = useState([])
    const [interactorspurpose, setInteractorspurpose] = useState([])
    const [interactorPurposeValues, setInteractorPurposeValues] = useState([])
    const [interactorTypeOptEdit, setInteractorTypeOptEdit] = useState([])
    const [assignedByArray, setAssignebyArray] = useState([])
    const [assignedByArrayEdit, setAssignedbyArrayEdit] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [interactorTypeOpt, setInteractorTypeOpt] = useState([])
    const [interactorPurposeOpt, setInteractorPurposeOpt] = useState([])
    const [managetypepgEdit, setManagetypepgEdit] = useState({
        interactorstype: "",
    })
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("Please Select Project");
    const [selectedCategory, setSelectedCategory] = useState("Please Select Category");
    const [categories, setCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubcategory] = useState("Please Select Sub Category");
    const [subcategorys, setSubcategorys] = useState([]);
    const [loginOptions, setLoginOptions] = useState([]);
    const [selectedLogin, setSelectedLogin] = useState("Please Select Login ID");
    const [loginwithUserDetails, setLoginwithUserDetails] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [userDetails, setUserDetails] = useState({
        company: "", branch: "", unit: "", team: "", employeename: "", clienterror: "", correctvalue: "", errorvalue: "", line: "", fieldname: "", documentlink: "", documentnumber: "", date: ""
    })
    // for edit section
    const [selectedProjectEdit, setSelectedProjectEdit] = useState("Please Select Project");
    const [selectedCategoryEdit, setSelectedCategoryEdit] = useState("Please Select Category");
    const [selectedSubCategoryEdit, setSelectedSubcategoryEdit] = useState("Please Select Sub Category");
    const [subcategorysEdit, setSubcategorysEdit] = useState([]);
    const [loginOptionsEdit, setLoginOptionsEdit] = useState([]);
    const [selectedLoginEdit, setSelectedLoginEdit] = useState("Please Select Login ID");
    const [loginwithUserDetailsEdit, setLoginwithUserDetailsEdit] = useState([]);
    const [filteredCategoriesEdit, setFilteredCategoriesEdit] = useState([]);
    const [userDetailsEdit, setUserDetailsEdit] = useState({
        company: "", branch: "", unit: "", team: "", employeename: "", clienterror: "", correctvalue: "", errorvalue: "", line: "", fieldname: "", documentlink: "", documentnumber: "", date: ""
    })
    const handleProjectChangeEdit = (e) => {
        const selectedProject = e.value;
        setSelectedProjectEdit(selectedProject);
        setSelectedLoginEdit("Please Select Login ID");
        setSelectedCategoryEdit("Please Select Category");
        setSelectedSubcategoryEdit("Please Select Sub Category");
        setSubcategorysEdit([]);
        fetchLoginIDEdit(e.value);
        setUserDetailsEdit({
            ...userDetailsEdit, company: "", branch: "", unit: "", team: "", employeename: "",
        })
    };
    const handleLoginChangeEdit = async (e) => {
        let reqData = loginwithUserDetailsEdit.find((item) => item.loginid == e.value);
        setUserDetailsEdit({
            ...userDetailsEdit, ...reqData, employee: reqData.employeename, date: ""
        })
    };
    const handleProjectChange = (e) => {
        const selectedProject = e.value;
        setSelectedProject(selectedProject);
        setSelectedLogin("Please Select Login ID");
        setSelectedCategory("Please Select Category");
        setSelectedSubcategory("Please Select Sub Category");
        setSubcategorys([]);
        fetchLoginID(e.value);
        setUserDetails({
            ...userDetails, company: "", branch: "", unit: "", team: "", employeename: "",
        })
    };
    const handleLoginChange = async (e) => {
        let reqData = loginwithUserDetails.find((item) => item.loginid == e.value);
        setUserDetails({
            ...userDetails, ...reqData, employee: reqData.employeename, date: ""
        })
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Penalty Client Error"),
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

    const fetchCategoryBasedEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_category?.data?.subcategoryprod
                .filter((data) => {
                    return (data.categoryname).trim().toLowerCase() === e.value.trim().toLowerCase();
                })
                .map((value) => value.name);
            setSubcategorysEdit(
                data_set.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const fetchLoginIDEdit = async (project) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA);
            let allottedList = res?.data?.clientuserid?.filter((data) => {
                return data.allotted === "allotted"
            })
            let basedOnProject = allottedList?.filter((data) => {
                return data?.projectvendor.split("-")[0] === project
            });
            // for getting employee details
            let users = await axios.get(SERVICE.USER)
            let definedUsers = users?.data?.users?.map((data) => {
                return {
                    employeename: data?.companyname,
                    empcode: data?.empcode,
                    company: data?.company,
                    branch: data?.branch,
                    unit: data?.unit,
                    team: data?.team,
                }
            })
            // loginid array with userdetails
            let finalList = basedOnProject?.map((data) => {
                let foundData = definedUsers?.find((item) => data?.empcode === item?.empcode);
                if (foundData) {
                    return {
                        company: foundData?.company || "",
                        branch: foundData?.branch || "",
                        unit: foundData?.unit || "",
                        team: foundData?.team || "",
                        employeename: foundData?.employeename || "",
                        empcode: foundData?.empcode || "",
                        date: data?.date || "",
                        loginid: data?.userid || "",
                        projectvendor: data?.projectvendor || ""
                    }
                } else {
                    return {
                        company: "",
                        branch: "",
                        unit: "",
                        team: "",
                        employeename: "",
                        date: data?.date || "",
                        loginid: data?.userid || "",
                        projectvendor: data?.projectvendor || ""
                    }
                }
            });
            setLoginwithUserDetailsEdit(finalList);
            let loginList = basedOnProject?.map((data) => ({
                label: data.userid,
                value: data.userid
            }));
            setLoginOptionsEdit(loginList);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategories = categories
            ?.filter((category) => category.project === selectedProjectEdit)
            .map((category) => ({
                ...category,
                label: category.name,
                value: category.name,
            }));
        setFilteredCategoriesEdit(filteredCategories);
    }, [selectedProjectEdit]);
    //-------------------------------------------------------------------------------------------
    //fetching Project for Dropdowns
    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projall = [
                ...res_project?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setProjects(projall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const fetchCategoryDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // setCategories(res_project?.data?.categoryexcel);
            const catall = [
                ...res_project?.data?.categoryprod.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setCategories(catall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const fetchCategoryBased = async (e) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_category?.data?.subcategoryprod
                .filter((data) => {
                    return (data.categoryname).trim().toLowerCase() === e.value.trim().toLowerCase();
                })
                .map((value) => value.name);
            setSubcategorys(
                data_set.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const fetchLoginID = async (project) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA);
            let allottedList = res?.data?.clientuserid?.filter((data) => {
                return data.allotted === "allotted"
            })
            let basedOnProject = allottedList?.filter((data) => {
                return data?.projectvendor.split("-")[0] === project
            });
            // for getting employee details
            let users = await axios.get(SERVICE.USER)
            let definedUsers = users?.data?.users?.map((data) => {
                return {
                    employeename: data?.companyname,
                    empcode: data?.empcode,
                    company: data?.company,
                    branch: data?.branch,
                    unit: data?.unit,
                    team: data?.team,
                }
            })
            // loginid array with userdetails
            let finalList = basedOnProject?.map((data) => {
                let foundData = definedUsers?.find((item) => data?.empcode === item?.empcode);
                if (foundData) {
                    return {
                        company: foundData?.company || "",
                        branch: foundData?.branch || "",
                        unit: foundData?.unit || "",
                        team: foundData?.team || "",
                        employeename: foundData?.employeename || "",
                        empcode: foundData?.empcode || "",
                        date: data?.date || "",
                        loginid: data?.userid || "",
                        projectvendor: data?.projectvendor || ""
                    }
                } else {
                    return {
                        company: "",
                        branch: "",
                        unit: "",
                        team: "",
                        employeename: "",
                        date: data?.date || "",
                        loginid: data?.userid || "",
                        projectvendor: data?.projectvendor || ""
                    }
                }
            });
            setLoginwithUserDetails(finalList);
            let loginList = basedOnProject?.map((data) => ({
                label: data.userid,
                value: data.userid
            }));
            setLoginOptions(loginList);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategories = categories
            ?.filter((category) => category.project === selectedProject)
            .map((category) => ({
                ...category,
                label: category.name,
                value: category.name,
            }));
        setFilteredCategories(filteredCategories);
    }, [selectedProject]);
    const [sources, setAssignedby] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [openviewalert, setOpenviewalert] = useState(false);

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
                    data?.subsubpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                // Check if the pathname exists in the URL
                return fetfinalurl?.includes(window.location.pathname);
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Penalty Client Error.png');
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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsActive(false)
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true)
        if (selectedRows?.length === 0) {
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
    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
       .react-resizable-handle {
       width: 10px;
       height: 100%;
       position: absolute;
       right: 0;
       bottom: 0;
       cursor: col-resize;
       }
       `;
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
        vendorname: true,
        branchname: true,
        employeecode: true,
        project: true,
        category: true,
        subcategory: true,
        loginid: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        date: true,
        documentnumber: true,
        documentlink: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        clienterror: true,
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
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.spenaltyclienterror);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async (e) => {
        setPageName(!pageName)
        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${Sourcesid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchAssignedBy();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
            }
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const delSourcecheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${item}`, {
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
            setIsHandleChange(false)
            setPage(1);
            await fetchAssignedBy();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //add function 
    const [isBtn, setIsBtn] = useState(false)
    const sendRequest = async () => {
        setIsBtn(true)
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.PENALTYCLIENTERROR_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(selectedProject),
                category: String(selectedCategory),
                subcategory: String(selectedSubCategory),
                loginid: String(selectedLogin),
                company: String(userDetails.company),
                branch: String(userDetails.branch),
                unit: String(userDetails.unit),
                team: String(userDetails.team),
                employeename: String(userDetails.employeename),
                date: String(userDetails.date),
                documentnumber: userDetails.documentnumber == undefined ? "" : String(userDetails.documentnumber),
                documentlink: userDetails.documentlink == undefined ? "" : String(userDetails.documentlink),
                fieldname: userDetails.fieldname == undefined ? "" : String(userDetails.fieldname),
                line: String(userDetails.line),
                errorvalue: String(userDetails.errorvalue),
                correctvalue: String(userDetails.correctvalue),
                clienterror: String(userDetails.clienterror),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchAssignedBy();
            setUserDetails({
                company: "", branch: "", unit: "", team: "", employeename: "", clienterror: "", correctvalue: "", errorvalue: "", line: "", fieldname: "", documentlink: "", documentnumber: "", date: ""
            })
            setSelectedProject("Please Select Project");
            setSelectedCategory("Please Select Category");
            setSelectedSubcategory("Please Select Sub Category");
            setSelectedLogin("Please Select Login ID")
            setFilteredCategories([]);
            setSubcategorys([]);
            setLoginOptions([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) {
            setIsBtn(false)
            console.log(err)
            if (err?.response.data.message == "Data Already Exist!") {
                setPopupContentMalert("Data Already Exist!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
    }
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsActive(true)
        if (selectedProject === "Please Select Project" || selectedProject === "" || selectedProject === undefined) {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedCategory === "Please Select Category" || selectedCategory === "" || selectedCategory === undefined) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedSubCategory === "Please Select Sub Category" || selectedSubCategory === "" || selectedSubCategory === undefined) {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedLogin === "Please Select Login ID" || selectedLogin === "" || selectedLogin === undefined) {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.company === "" || userDetails.company === undefined) {
            setPopupContentMalert("Company is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.branch === "" || userDetails.branch === undefined) {
            setPopupContentMalert("Branch is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.unit === "" || userDetails.unit === undefined) {
            setPopupContentMalert("Unit is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.team === "" || userDetails.team === undefined) {
            setPopupContentMalert("Team is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.employeename === "" || userDetails.employeename === undefined) {
            setPopupContentMalert("Employee Name is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.date === "" || userDetails.date === undefined) {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.line === "" || userDetails.line === undefined) {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.errorvalue === "" || userDetails.errorvalue === undefined) {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.correctvalue === "" || userDetails.correctvalue === undefined) {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetails.clienterror === "" || userDetails.clienterror === undefined) {
            setPopupContentMalert("Please Enter Client Error");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }
    const handleClear = (e) => {
        e.preventDefault();
        setUserDetails({
            company: "", branch: "", unit: "", team: "", employeename: "", clienterror: "", correctvalue: "", errorvalue: "", line: "", fieldname: "", documentlink: "", documentnumber: "", date: ""
        })
        setSelectedProject("Please Select Project");
        setSelectedCategory("Please Select Category");
        setSelectedSubcategory("Please Select Sub Category");
        setSelectedLogin("Please Select Login ID")
        setFilteredCategories([]);
        setSubcategorys([]);
        setLoginOptions([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setUserDetailsEdit({ ...res?.data?.spenaltyclienterror })
            setSelectedProjectEdit(res?.data?.spenaltyclienterror.project)
            setSelectedCategoryEdit(res?.data?.spenaltyclienterror.category)
            setSelectedSubcategoryEdit(res?.data?.spenaltyclienterror.subcategory)
            setSelectedLoginEdit(res?.data?.spenaltyclienterror.loginid)
            fetchCategoryBasedEdit({ value: res?.data?.spenaltyclienterror.category })
            fetchLoginIDEdit(res?.data?.spenaltyclienterror.project)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setUserDetailsEdit({ ...res?.data?.spenaltyclienterror });
            setSelectedProjectEdit(res?.data?.spenaltyclienterror.project)
            setSelectedCategoryEdit(res?.data?.spenaltyclienterror.category)
            setSelectedSubcategoryEdit(res?.data?.spenaltyclienterror.subcategory)
            setSelectedLoginEdit(res?.data?.spenaltyclienterror.loginid)
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setUserDetailsEdit({ ...res?.data?.spenaltyclienterror });
            setSelectedProjectEdit(res?.data?.spenaltyclienterror.project)
            setSelectedCategoryEdit(res?.data?.spenaltyclienterror.category)
            setSelectedSubcategoryEdit(res?.data?.spenaltyclienterror.subcategory)
            setSelectedLoginEdit(res?.data?.spenaltyclienterror.loginid)
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //Project updateby edit page...
    let updateby = userDetailsEdit?.updatedby;
    let addedby = userDetailsEdit?.addedby;
    let subprojectsid = userDetailsEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(selectedProjectEdit),
                category: String(selectedCategoryEdit),
                subcategory: String(selectedSubCategoryEdit),
                loginid: String(selectedLoginEdit),
                company: String(userDetailsEdit.company),
                branch: String(userDetailsEdit.branch),
                unit: String(userDetailsEdit.unit),
                team: String(userDetailsEdit.team),
                employeename: String(userDetailsEdit.employeename),
                date: String(userDetailsEdit.date),
                documentnumber: userDetailsEdit.documentnumber == undefined ? "" : String(userDetailsEdit.documentnumber),
                documentlink: userDetailsEdit.documentlink == undefined ? "" : String(userDetailsEdit.documentlink),
                fieldname: userDetailsEdit.fieldname == undefined ? "" : String(userDetailsEdit.fieldname),
                line: String(userDetailsEdit.line),
                errorvalue: String(userDetailsEdit.errorvalue),
                correctvalue: String(userDetailsEdit.correctvalue),
                clienterror: String(userDetailsEdit.clienterror),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAssignedBy();
            setUserDetailsEdit({
                company: "", branch: "", unit: "", team: "", employeename: "", clienterror: "", correctvalue: "", errorvalue: "", line: "", fieldname: "", documentlink: "", documentnumber: "", date: ""
            })
            setSelectedProjectEdit("Please Select Project");
            setSelectedCategoryEdit("Please Select Category");
            setSelectedSubcategoryEdit("Please Select Sub Category");
            setSelectedLoginEdit("Please Select Login ID")
            setFilteredCategoriesEdit([]);
            setSubcategorysEdit([]);
            setLoginOptionsEdit([]);
            handleCloseModEdit();
            setPopupContent("Upadted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            if (err?.response.data.message == "Data Already Exist!") {
                setPopupContentMalert("Data Already Exist!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
    }
    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchSourceAll();
        if (selectedProjectEdit === "Please Select Project" || selectedProjectEdit === "" || selectedProjectEdit === undefined) {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedCategoryEdit === "Please Select Category" || selectedCategoryEdit === "" || selectedCategoryEdit === undefined) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedSubCategoryEdit === "Please Select Sub Category" || selectedSubCategoryEdit === "" || selectedSubCategoryEdit === undefined) {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedLoginEdit === "Please Select Login ID" || selectedLoginEdit === "" || selectedLoginEdit === undefined) {
            setPopupContentMalert("Company is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.company === "" || userDetailsEdit.company === undefined) {
            setPopupContentMalert("company is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.branch === "" || userDetailsEdit.branch === undefined) {
            setPopupContentMalert("Branch is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.unit === "" || userDetailsEdit.unit === undefined) {
            setPopupContentMalert("Unit is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.team === "" || userDetailsEdit.team === undefined) {
            setPopupContentMalert("Team is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.employeename === "" || userDetailsEdit.employeename === undefined) {
            setPopupContentMalert("Employee Name is Required!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.date === "" || userDetailsEdit.date === undefined) {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.line === "" || userDetailsEdit.line === undefined) {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.errorvalue === "" || userDetailsEdit.errorvalue === undefined) {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.correctvalue === "" || userDetailsEdit.correctvalue === undefined) {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (userDetailsEdit.clienterror === "" || userDetailsEdit.clienterror === undefined) {
            setPopupContentMalert("Please Enter Client Error");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }
    const [penaltyErrorArray, setPenaltyErrorArray] = useState([])
    //get all Sub vendormasters.
    const fetchPenaltyError = async () => {

        setPageName(!pageName)
        try {
            let res_vendor = await axios.post(SERVICE.PENALTYCLIENTERROR, {
                assignbranch: accessbranch
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            let filteredData = res_vendor?.data?.penaltyclienterror
            setPenaltyErrorArray(filteredData.map((t, index) => ({
                ...t,
                Sno: index + 1,
                project: t.project,
                category: t.category,
                subcategory: t.subcategory,
                loginid: t.loginid,
                company: t.company,
                branch: t.branch,
                unit: t.unit,
                team: t.team,
                employeename: t.employeename,
                date: moment(t.date).format('DD-MM-YYYY'),
                documentnumber: t.documentnumber,
                documentlink: t.documentlink,
                fieldname: t.fieldname,
                line: t.line,
                errorvalue: t.errorvalue,
                correctvalue: t.correctvalue,
                clienterror: t.clienterror,
            })));
        } catch (err) { setSourcecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    useEffect(() => {
        fetchPenaltyError();
    }, [isFilterOpen])
    const fetchAssignedBy = async () => {

        setPageName(!pageName)

        try {
            let res_vendor = await axios.post(SERVICE.PENALTYCLIENTERROR, {
                assignbranch: accessbranch
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)

            let filteredData = res_vendor?.data?.penaltyclienterror
            setAssignedby(filteredData);
            setAssignebyArray(res_vendor?.data?.penaltyclienterror)
            setAssignedbyArrayEdit(res_vendor?.data?.penaltyclienterror)
        } catch (err) { setSourcecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }

    }
    //get all Sub vendormasters.
    const fetchSourceAll = async () => {
        setPageName(!pageName)
        try {
            let res_meet = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_meet?.data?.manageTypePG.filter(item => item._id !== managetypepgEdit._id)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Penalty Client Error',
        pageStyle: 'print'
    });
    useEffect(() => {
        fetchAssignedBy();
        fetchInteractorMode();
        fetchInteractorType();
        fetchProjectDropdowns();
        fetchCategoryDropdowns();
    }, [])
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    useEffect(() => {
        addSerialNumber(sources);
    }, [sources])
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
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            lockPinned: true,
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',
        },
        { field: "project", headerName: "Project", flex: 0, width: 150, hide: !columnVisibility.project, headerClassName: "bold-header", pinned: 'left', },
        { field: "category", headerName: "Category", flex: 0, width: 200, hide: !columnVisibility.category, headerClassName: "bold-header", pinned: 'left', },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 200, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        { field: "loginid", headerName: "Login ID", flex: 0, width: 150, hide: !columnVisibility.loginid, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branchname, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 150, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 160, hide: !columnVisibility.documentnumber, headerClassName: "bold-header" },
        { field: "documentlink", headerName: "Document Link", flex: 0, width: 160, hide: !columnVisibility.documentlink, headerClassName: "bold-header" },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 160, hide: !columnVisibility.fieldname, headerClassName: "bold-header" },
        { field: "line", headerName: "Line", flex: 0, width: 160, hide: !columnVisibility.line, headerClassName: "bold-header" },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 160, hide: !columnVisibility.errorvalue, headerClassName: "bold-header" },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 160, hide: !columnVisibility.correctvalue, headerClassName: "bold-header" },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 160, hide: !columnVisibility.clienterror, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("eclienterror") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.data.id);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dclienterror") && (
                        <Button sx={userStyle.buttondelete}
                            onClick={(e) => { rowData(params.data.id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vclienterror") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iclienterror") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            project: item.project,
            category: item.category,
            subcategory: item.subcategory,
            loginid: item.loginid,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.employeename,
            // employeecode: item.employeecode,
            date: moment(item.date).format('DD-MM-YYYY'),
            documentnumber: item.documentnumber,
            documentlink: item.documentlink,
            fieldname: item.fieldname,
            line: item.line,
            errorvalue: item.errorvalue,
            correctvalue: item.correctvalue,
            clienterror: item.clienterror
        }
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
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
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
    const handleChangeFrom = (opt) => {
        setInteractorspurpose(opt)
        setInteractorPurposeValues(opt.map((a, index) => {
            return a.value;
        }))
    }
    //get all interactorType name.
    const fetchInteractorType = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_INTERACTORTYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setInteractorTypeOpt([...res_freq?.data?.interactorType
                .map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
            setInteractorTypeOptEdit([...res_freq?.data?.interactorType
                .map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //get all interactorPurpose name.
    const fetchInteractorMode = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_INTERACTORPURPOSE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setInteractorPurposeOpt([...res_freq?.data?.interactorPurpose
                .map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
            setInteractorPurposeOptEdit([...res_freq?.data?.interactorPurpose
                .map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [fileFormat, setFormat] = useState('')
    let exportColumnNames = ["Project Name", "Category", "Sub Category", "Login ID", "Company", "Branch", "Unit", "Team", "Employee Name", "Date", "Document Number", "Document Link", "Field Name", " Line", "Error Value", "Correct Value", "Client Error"];
    let exportRowValues = ["project", "category", "subcategory", "loginid", "company", "branch", "unit", "team", "employeename", "date", "documentnumber", "documentlink", "fieldname", "line", "errorvalue", "correctvalue", "clienterror"];
    return (
        <Box>
            <Headtitle title={'Penalty Client Error'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Penalty Client Error"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Penalty Client Error"
            />

            {isUserRoleCompare?.includes("aclienterror")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Penalty Client Error</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Project <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects options={projects} styles={colourStyles}
                                                value={{ label: selectedProject, value: selectedProject }}
                                                onChange={handleProjectChange} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects options={filteredCategories} styles={colourStyles} value={{ label: selectedCategory, value: selectedCategory }}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.value)
                                                    setSelectedSubcategory("Please Select Sub Category");
                                                    fetchCategoryBased(e)
                                                }} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>subcategory <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subcategorys}
                                                value={{ label: selectedSubCategory, value: selectedSubCategory }}
                                                onChange={(e) => {
                                                    setSelectedSubcategory(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={loginOptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: selectedLogin,
                                                    value: selectedLogin,
                                                }}
                                                onChange={(e) => {
                                                    setSelectedLogin(e.value);
                                                    handleLoginChange(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Company <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetails.company} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Branch <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetails.branch} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Unit <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetails.unit} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetails.team} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee Name<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetails.employeename} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                placeholder="Please Enter Date"
                                                value={userDetails.date}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, date: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Document Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Document Number"
                                                value={userDetails.documentnumber}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, documentnumber: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Document Link</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Document Link"
                                                value={userDetails.documentlink}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, documentlink: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Field Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Field Name"
                                                value={userDetails.fieldname}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, fieldname: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Line<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Line"
                                                value={userDetails.line}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, line: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Error Value<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Error Value"
                                                value={userDetails.errorvalue}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, errorvalue: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Correct Value<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Correct Value"
                                                value={userDetails.correctvalue}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, correctvalue: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Client Error<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Client Error"
                                                value={userDetails.clienterror}
                                                onChange={(e) => {
                                                    setUserDetails({
                                                        ...userDetails, clienterror: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} mt={3}>
                                        <Grid
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "15px",
                                            }}
                                        >
                                            <Button variant="contained"
                                                color="primary"
                                                onClick={handleSubmit}
                                                disabled={isBtn}
                                                sx={buttonStyles.buttonsubmit}
                                            >
                                                SAVE
                                            </Button>
                                            <Button
                                                onClick={handleClear}
                                                sx={buttonStyles.btncancel}
                                            >
                                                CLEAR
                                            </Button>
                                        </Grid>
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
                    sx={{
                        overflow: 'scroll',
                        '& .MuiPaper-root': {
                            overflow: 'scroll',
                        },
                    }}
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Penalty Client Error</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Project <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects options={projects} styles={colourStyles} value={{ label: selectedProjectEdit, value: selectedProjectEdit }} onChange={handleProjectChangeEdit} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects options={filteredCategoriesEdit} styles={colourStyles} value={{ label: selectedCategoryEdit, value: selectedCategoryEdit }}
                                                onChange={(e) => {
                                                    setSelectedCategoryEdit(e.value)
                                                    setSelectedSubcategoryEdit("Please Select Sub Category");
                                                    fetchCategoryBasedEdit(e)
                                                }} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>subcategory <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subcategorysEdit}
                                                value={{ label: selectedSubCategoryEdit, value: selectedSubCategoryEdit }}
                                                onChange={(e) => {
                                                    setSelectedSubcategoryEdit(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={loginOptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: selectedLoginEdit,
                                                    value: selectedLoginEdit,
                                                }}
                                                onChange={(e) => {
                                                    setSelectedLoginEdit(e.value);
                                                    handleLoginChangeEdit(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Company <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetailsEdit.company} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Branch <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetailsEdit.branch} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Unit <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetailsEdit.unit} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetailsEdit.team} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee Name<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput value={userDetailsEdit.employeename} readOnly />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                placeholder="Please Enter Date"
                                                value={userDetailsEdit.date}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, date: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Document Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Document Number"
                                                value={userDetailsEdit.documentnumber}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, documentnumber: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Document Link</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Document Link"
                                                value={userDetailsEdit.documentlink}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, documentlink: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Field Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Field Name"
                                                value={userDetailsEdit.fieldname}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, fieldname: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Line<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Line"
                                                value={userDetailsEdit.line}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, line: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Error Value<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Error Value"
                                                value={userDetailsEdit.errorvalue}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, errorvalue: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Correct Value<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Correct Value"
                                                value={userDetailsEdit.correctvalue}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, correctvalue: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Client Error<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Client Error"
                                                value={userDetailsEdit.clienterror}
                                                onChange={(e) => {
                                                    setUserDetailsEdit({
                                                        ...userDetailsEdit, clienterror: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" type="submit" >Update</Button>
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
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("menuclienterror") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>List Penalty Client Error</Typography>
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
                                    {isUserRoleCompare?.includes("excelclienterror") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPenaltyError()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterror") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPenaltyError()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterror") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterror") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchPenaltyError()
                                                }}
                                            >
                                                <FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterror") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={sources} setSearchedString={setSearchedString} />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdclienterror") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>Bulk Delete</Button>)}
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
                                    gridRefTable={gridRef}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    handleShowAllColumns={handleShowAllColumns}
                                />
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
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ padding: '20px 50px', marginTop: '20px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>View Penalty Client Error</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project </Typography>
                                    <Typography>{selectedProjectEdit} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category </Typography>
                                    <Typography>{selectedCategoryEdit} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">subcategory </Typography>
                                    <Typography>{selectedSubCategoryEdit} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Login ID</Typography>
                                    <Typography>{selectedLoginEdit} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{userDetailsEdit.company} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch </Typography>
                                    <Typography>{userDetailsEdit.branch} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{userDetailsEdit.unit} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{userDetailsEdit.team} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{userDetailsEdit.employeename} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{userDetailsEdit.date ? moment(userDetailsEdit.date).format('DD-MM-YYYY') : ""} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Document Number</Typography>
                                    <Typography>{userDetailsEdit.documentnumber} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Document Link</Typography>
                                    <Typography>{userDetailsEdit.documentlink} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Field Name</Typography>
                                    <Typography>{userDetailsEdit.fieldname} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Line</Typography>
                                    <Typography>{userDetailsEdit.line} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Error Value</Typography>
                                    <Typography>{userDetailsEdit.errorvalue} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Correct Value</Typography>
                                    <Typography>{userDetailsEdit.correctvalue} </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Client Error</Typography>
                                    <Typography>{userDetailsEdit.clienterror} </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.btncancel} color="primary" onClick={handleCloseview} > Back </Button>
                        </Grid>
                    </>
                </Box>
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={penaltyErrorArray ?? []}
                filename={"Penalty Client Error"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Penalty Client Error Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSource}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delSourcecheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
        </Box>
    )
}
export default Penaltyclienterror;