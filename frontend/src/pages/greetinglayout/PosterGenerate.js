import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormGroup,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Tooltip,
    Radio,
    RadioGroup,
    Typography,
    Backdrop
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaPlus, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from 'react-router-dom';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { v4 as uuidv4 } from "uuid";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { menuItems } from "../../components/menuItemsList";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import "../../webpages/bdaytemplatetwo2nos.css";
import "../../webpages/bdaytemplatetwo3nos.css";
import "../../webpages/bdcsstemplatetwo.css";
import "../../webpages/weddingcard2nos.css";
import "../../webpages/weddingcard3nos.css";
import "../../webpages/weddingcardtemplate.css";
import { AiOutlineClose } from "react-icons/ai";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingBackdrop = ({ open }) => {
    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <div className="pulsating-circle">
                <CircularProgress color="inherit" className="loading-spinner" />
            </div>
            <Typography
                variant="h6"
                sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
            >
                Loading Please Wait...
            </Typography>
        </Backdrop>
    );
};

function PosterGenerate() {

    const [isLoading, setIsLoading] = useState(false);

    let [valueTeamCat, setValueTeamCat] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);
    let [valueSubCategoryForFilter, setValueSubCategoryForFilter] = useState([]);
    let [valueCategoryForFilter, setValueCategoryForFilter] = useState([]);

    const gridRefTable = useRef(null);
    const [subcategory, setSubcategory] = useState("");
    const [subCategoryTodo, setSubcategoryTodo] = useState([]);

    const [documentFiles, setdocumentFiles] = useState([]);

    const addTodo = () => {

        if (subcategory === "") {
            setPopupContentMalert("Please Enter Employee Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (documentFiles?.length === 0) {
            setPopupContentMalert("Please Upload Profile!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            subCategoryTodo.some(
                (item) => item?.subcategory?.toLowerCase() === subcategory?.toLowerCase()
            )
        ) {
            setPopupContentMalert(
                "Already Added ! Please Enter Another Name!"
            );
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSubcategoryTodo([...subCategoryTodo, { subcategory: subcategory?.toUpperCase(), profile: documentFiles }]);
            setSubcategory("");
            setdocumentFiles([])
        }
    };
    // const handleTodoEdit = (index, newValue) => {
    //     const updatedTodos = [...subCategoryTodo];
    //     updatedTodos[index]?.subcategory = newValue;
    //     setSubcategoryTodo(updatedTodos);
    // };
    const handleTodoEdit = (index, newValue) => {
        setSubcategoryTodo(prevTodos =>
            prevTodos.map((todo, i) =>
                i === index ? { ...todo, subcategory: newValue } : todo
            )
        );
    };

    const deleteTodo = (index) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos.splice(index, 1);
        setSubcategoryTodo(updatedTodos);
    };
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [logicOperator, setLogicOperator] = useState("AND");
    const [filterValue, setFilterValue] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const currentDate = new Date();
    const [enableManualGenerate, setManualGenerate] = useState(false);
    const [manualEntry, setManualEntry] = useState({
        manualentryname: "",
        entrydate: "",
        entrydate: ""
    });

    const today = new Date().toISOString().split("T")[0];
    const [dateForFilter, setdateForFilter] = useState({
        filterdate: today
    });

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setloadingdeloverall(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Employee Name",
        "Category Template Name",
        "Sub Category Template Name",
        "Theme Name",
        "Company Name",
        "Branch",
        "Unit",
        "Team",
    ];
    let exportRowValues = [
        "employeename",
        "categoryname",
        "subcategoryname",
        "themename",
        "company",
        "branch",
        "unit",
        "team",
    ];

    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [subcategoryOpt, setSubcategoryOption] = useState([]);
    const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
    const [subcategorynameOptEdit, setSubcategorynameOptEdit] = useState([]);
    const [userId, setUserID] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //state to handle holiday values
    const [posterGenerate, setPosterGenerate] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
        days: "Please Select Days",
        todate: "",
        fromdate: "",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
    });
    // const [posterGenerate, setPosterGenerate] = useState({
    //     company: "Please Select Company",
    //     branch: "Please Select Branch",
    //     unit: "Please Select Unit",
    //     floor: "Please Select Floor",
    //     area: "Please Select Area",
    //     location: "Please Select Location",
    //     maincabin: "",
    //     subcabin: "",
    // });
    const [themeNames, setThemeNames] = useState([]);
    const [selectedThemeNames, setSelectedThemeNames] = useState([]);
    let [valueCat, setValueCat] = useState([]);


    const [themeNamesEdit, setThemeNamesEdit] = useState([]);
    const [selectedThemeNamesEdit, setSelectedThemeNamesEdit] = useState([]);
    let [valueCatEdit, setValueCatEdit] = useState([]);




    const [posterGenerateEdit, setPosterGenerateEdit] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });


    const [categoryOption, setCategoryOption] = useState([]);
    const [categoryOptionForFIlter, setCategoryOptionForFilter] = useState([]);
    const [subCategoryOptionForFIlter, setSubCategoryOptionForFilter] = useState([]);
    const [posterGenerates, setPosterGenerates] = useState([]);
    const [posterGeneratesForTable, setPosterGeneratesForTable] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, buttonStyles, pageName, allTeam, setPageName, allUsersData, isAssignBranch, } = useContext(
        UserRoleAccessContext
    );
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
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteHoliday, setDeleteHoliday] = useState({});
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allStatusEdit, setAllStatusEdit] = useState([]);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        categoryname: true,
        subcategoryname: true,
        themename: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    //useEffect
    const [categorythemegrouping, setCategorythemegrouping] = useState([])



    const handleResumeUpload = (event) => {
        const resume = event.target.files;
        const allowedExtensions = ["png", "jpeg"];

        if (resume?.length > 0) {
            const file = resume[0]; // Always take the first file
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Check if the file extension is allowed
            if (allowedExtensions.includes(fileExtension)) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    // Replace the previous file with the new one
                    setdocumentFiles([{
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    }]);
                };
            } else {
                setPopupContentMalert("Please upload a valid PNG file.");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    // const handleResumeUpload = (event) => {
    //     const resume = event.target.files;
    //     const allowedExtensions = ["png"]

    //     for (let i = 0; i < resume?.length; i++) {
    //         const file = resume[i];
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => {
    //             setdocumentFiles((prevFiles) => [
    //                 ...prevFiles,
    //                 {
    //                     name: file.name,
    //                     preview: reader.result,
    //                     data: reader.result.split(",")[1],
    //                     remark: "resume file",
    //                 },
    //             ]);
    //         };
    //     }
    // };
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    //get all branches.
    const fetchCategoryAll = async () => {
        setPageName(!pageName);
        try {

            let response = await axios.get(`${SERVICE.POSTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let all_datas = response.data.postermessage
            // let all_datas = res_location?.data?.categorythemegroupings
            setCategorythemegrouping(all_datas)



            setCategoryOption([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
            setCategoryOptionForFilter([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
            setCategoryOptionEdit([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };




    const fetchSubcategoryBased = async (e) => {
        setPageName(!pageName);
        try {
            let data_set = categorythemegrouping.filter((data) => {
                return e.value === data.categoryname;
            });
            let subcategoryname = data_set?.map((item) => {
                return {
                    label: item?.subcategoryname,
                    value: item?.subcategoryname,
                }
            })
            setSubcategoryOption(subcategoryname);
            setSubcategorynameOptEdit(subcategoryname);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteHoliday(res.data.spostergenerate);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let holidayid = deleteHoliday._id;
    const delHoliday = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.POSTERGENERATE_SINGLE}/${holidayid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();
            await fetchEmployeeForFilterForExports();
            await fetchHolidayAllGroup();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayfootertext, setBdayfootertext] = useState("")
    const [bdaywishes, setBdaywishes] = useState("")

    const fetchBdaySetting = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);

            setBdayCompanyLogo(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.companylogo
            );
        } catch (err) {
            console.log(err, '12')
        }
    };

    // const [base64DatasNew, setBase64DatasNew] = useState([]);
    const [employeeValueAdd, setEmployeeValueAdd] = useState([]);

    let legalName = []
    let userName = []
    let companyName = []
    let team = []
    let unit = []
    let branch = []

    let dob = []
    let paddress = []
    let caddress = []
    let email = []
    let contactpersonal = []
    let doj = []
    let empcode = []
    let firstname = []
    let lastname = []
    let designation = []
    let process = []
    let department = []
    let reasondate = []
    let shifttiming = []
    let accname = []
    let accno = []
    let ifsc = []
    let workstation = []
    let workstationcount = []
    let employeecount = []
    let genderheshe = []
    let genderheshesmall = []
    let genderhimher = []
    let prefix = []


    const fetchEmployeeDob = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`);
            const availedData = res?.data?.suser;

            if (availedData?.length !== 0) {

                let accountno = []
                let accountname = []
                let ifsccode = []

                availedData?.bankdetails?.forEach((item) => {
                    accountno.push(item.accountnumber || []);
                    accountname.push(item.accountholdername || []);
                    ifsccode.push(item.ifsccode || []);
                });

                let GenderHeShe = (availedData?.gender !== "" || availedData?.gender !== undefined)
                    ? availedData?.gender === "Male" ? "He" : availedData?.gender === "Female" ? "She" : "He/She" : "He/She";

                let GenderHeShesmall = (availedData?.gender !== "" || availedData?.gender !== undefined)
                    ? availedData?.gender === "Male" ? "he" : availedData?.gender === "Female" ? "she" : "he/she" : "he/she";

                let GenderHimHer = (availedData?.gender !== "" || availedData?.gender !== undefined)
                    ? availedData?.gender === "Male" ? "him" : availedData?.gender === "Female" ? "her" : "him/her" : "him/her";

                let Paddress = `${!availedData?.pdoorno ? "" : availedData?.pdoorno + ","}
                ${!availedData?.pstreet ? "" : availedData?.pstreet + ","}
                ${!availedData?.parea ? "" : availedData?.parea + ","}
                ${!availedData?.plandmark ? "" : availedData?.plandmark + ","}
                ${!availedData?.ptaluk ? "" : availedData?.ptaluk + ","}
                ${!availedData?.ppost ? "" : availedData?.ppost + ","}
                ${!availedData?.pcity ? "" : availedData?.pcity + ","}
                ${!availedData?.pstate ? "" : availedData?.pstate + ","}
                ${!availedData?.pcountry ? "" : availedData?.pcountry + ","}
                ${!availedData?.ppincode ? "" : "-" + availedData?.ppincode}`;

                let Caddress = `${!availedData?.cdoorno ? "" : availedData?.cdoorno + ","}
                ${!availedData?.cstreet ? "" : availedData?.cstreet + ","}
            ${!availedData?.carea ? "" : availedData?.carea + ","}
                ${!availedData?.clandmark ? "" : availedData?.clandmark + ","}
                ${!availedData?.ctaluk ? "" : availedData?.ctaluk + ","}
                ${!availedData?.cpost ? "" : availedData?.cpost + ","}
                ${!availedData?.ccity ? "" : availedData?.ccity + ","}
                ${!availedData?.cstate ? "" : availedData?.cstate + ","}
                ${!availedData?.ccountry ? "" : availedData?.ccountry + ","}
                ${!availedData?.cpincode ? "" : "-" + availedData?.cpincode}`;


                legalName?.push(availedData?.legalname ? availedData?.legalname : "")
                userName?.push(availedData?.username ? availedData?.username : "")
                companyName?.push(availedData?.companyname ? availedData?.companyname : "")
                team?.push(availedData?.team ? availedData?.team : "")
                unit?.push(availedData?.unit ? availedData?.unit : "")
                branch?.push(availedData?.branch ? availedData?.branch : "")

                dob?.push(availedData?.dob ? availedData?.dob : "")
                paddress?.push(Paddress)
                caddress?.push(Caddress)
                email?.push(availedData?.email ? availedData?.email : "")
                contactpersonal?.push(availedData?.contactpersonal ? availedData?.contactpersonal : "")
                doj?.push(availedData?.doj ? availedData?.doj : "")
                empcode?.push(availedData?.empcode ? availedData?.empcode : "")
                firstname?.push(availedData?.firstname ? availedData?.firstname : "")
                lastname?.push(availedData?.lastname ? availedData?.lastname : "")
                designation?.push(availedData?.designation ? availedData?.designation : "")
                process?.push(availedData?.process ? availedData?.process : "")
                department?.push(availedData?.department ? availedData?.department : "")
                reasondate?.push(availedData?.reasondate ? availedData?.reasondate : "")
                shifttiming?.push(availedData?.shifttiming ? availedData?.shifttiming : "")
                accname?.push(availedData?.bankdetails?.length > 0 ? accountname : [])
                accno?.push(availedData?.bankdetails?.length > 0 ? accountno : [])
                ifsc?.push(availedData?.bankdetails?.length > 0 ? ifsccode : [])
                accountno = [];
                accountname = [];
                ifsccode = [];
                workstation?.push(availedData?.workstation ? availedData?.workstation : "")
                workstationcount?.push(availedData?.workstation ? availedData?.workstation?.length : "")
                employeecount?.push(availedData?.employeecount ? availedData?.employeecount : "")
                genderheshe?.push(GenderHeShe)
                genderheshesmall?.push(GenderHeShesmall)
                genderhimher?.push(GenderHimHer)
                prefix?.push(availedData?.prefix ? availedData?.prefix : "Mr/Ms")

                return availedData?.dob;

            } else {
                return '';
            }
        } catch (err) {
            console.log(err, 'Error fetching employee DOB');
            return '';
        }
    };

    const fetchDobs = async (nos, wish, employeeOneID, employeeTwoID, employeeThreeID) => {
        try {
            const dobPromises = [];

            if (nos === "one") {

                if (employeeOneID) {
                    dobPromises.push(fetchEmployeeDob(employeeOneID));
                }

            } else if (nos === "two") {
                if (employeeOneID) {
                    dobPromises.push(fetchEmployeeDob(employeeOneID));
                }

                if (employeeTwoID) {
                    dobPromises.push(fetchEmployeeDob(employeeTwoID));
                }

            } else if (nos === "three") {

                if (employeeOneID) {
                    dobPromises.push(fetchEmployeeDob(employeeOneID));
                }

                if (employeeTwoID) {
                    dobPromises.push(fetchEmployeeDob(employeeTwoID));
                }

                if (employeeThreeID) {
                    dobPromises.push(fetchEmployeeDob(employeeThreeID));
                }

            }



            const Legalname = [...new Set(legalName)]?.toString()
            const Username = [...new Set(userName)]?.toString()
            const Companyname = [...new Set(companyName)]?.toString()
            const Team = [...new Set(team)]?.toString()
            const Unit = [...new Set(unit)]?.toString()
            const Branch = [...new Set(branch)]?.toString()

            const Dob = [...new Set(dob)]?.toString()
            const Paddress = [...new Set(paddress)]?.toString()
            const Caddress = [...new Set(caddress)]?.toString()
            const Email = [...new Set(email)]?.toString()
            const Contactpersonal = [...new Set(contactpersonal)]?.toString()
            const Doj = [...new Set(doj)]?.toString()
            const Empcode = [...new Set(empcode)]?.toString()
            const Firstname = [...new Set(firstname)]?.toString()
            const Lastname = [...new Set(lastname)]?.toString()
            const Designation = [...new Set(designation)]?.toString()
            const Process = [...new Set(process)]?.toString()
            const Department = [...new Set(department)]?.toString()
            const Reasondate = [...new Set(reasondate)]?.toString()
            const Shifttiming = [...new Set(shifttiming)]?.toString()
            const Accname = [...new Set(accname?.flat())]

            const Accno = [...new Set(accno?.flat())]
            const Ifsc = [...new Set(ifsc?.flat())]
            const Workstation = [...new Set(workstation)]?.toString()
            const Workstationcount = [...new Set(workstationcount)]?.toString()
            const Employeecount = [...new Set(employeecount)]?.toString()
            const Genderheshe = [...new Set(genderheshe)]?.toString()
            const Genderheshesmall = [...new Set(genderheshesmall)]?.toString()
            const Genderhimher = [...new Set(genderhimher)]?.toString()
            const Prefix = [...new Set(prefix)]?.toString()


            let replacedWish = wish
                .replaceAll("$LEGALNAME$", Legalname)
                .replaceAll("$LOGIN$", Username)
                .replaceAll("$C:NAME$", Companyname)
                .replaceAll("$TEAM$", Team)
                .replaceAll("$UNIT$", Unit)
                .replaceAll("$BRANCH$", Branch)

                .replaceAll("$DOB$", Dob)
                .replaceAll("$P:ADDRESS$", Paddress)
                .replaceAll("$C:ADDRESS$", Caddress)
                .replaceAll("$EMAIL$", Email)
                .replaceAll("$P:NUMBER$", Contactpersonal)
                .replaceAll("$DOJ$", Doj)
                .replaceAll("$EMPCODE$", Empcode)
                .replaceAll("$F:NAME$", Firstname)
                .replaceAll("$L:NAME$", Lastname)
                .replaceAll("$DESIGNATION$", Designation)
                .replaceAll("$PROCESS$", Process)
                .replaceAll("$DEPARTMENT$", Department)
                .replaceAll("$LWD$", Reasondate)
                .replaceAll("$SHIFT$", Shifttiming)
                .replaceAll("$AC:NAME$", Accname)
                .replaceAll("$AC:NUMBER$", Accno)
                .replaceAll("$IFSC$", Ifsc)
                .replaceAll("$WORKSTATION:NAME$", Workstation)
                .replaceAll("$WORKSTATION:COUNT$", Workstationcount)
                .replaceAll("$SYSTEM:COUNT$", Employeecount)
                .replaceAll("$GENDERHE/SHE$", Genderheshe)
                .replaceAll("$GENDERHE/SHE/SMALL$", Genderheshesmall)
                .replaceAll("$GENDERHIM/HER$", Genderhimher)
                .replaceAll("$SALUTATION$", Prefix)

            return replacedWish

        } catch (err) {
            console.log(err, 'Error fetching DOBs');
        }
    };

    const idArray = [];
    const currentYear = new Date().getFullYear();
    employeeValueAdd?.map((item) => idArray?.push(item?.companyname))

    const sendRequest = async () => {
        setPageName(!pageName);
        setPosterGroup("abc");

        const aggregationPipeline = [
            {
                $match: {
                    $and: [
                        {
                            enquirystatus: {
                                $nin: ["Enquiry Purpose"],
                            },
                        },
                        {
                            resonablestatus: {
                                $nin: [
                                    "Not Joined",
                                    "Postponed",
                                    "Rejected",
                                    "Closed",
                                    "Releave Employee",
                                    "Absconded",
                                    "Hold",
                                    "Terminate",
                                ],
                            },
                        },
                        ...(idArray.length > 0
                            ? [
                                {
                                    companyname: { $in: idArray },
                                },
                            ]
                            : []),
                    ],
                },
            },
            {
                "$lookup": {
                    "from": "employeedocuments",
                    "let": { "userId": { "$toString": "$_id" } },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$eq": ["$commonid", "$$userId"]
                                }
                            }
                        }
                    ],
                    "as": "employeeDocuments"
                }
            },
            {
                "$unwind": "$employeeDocuments"
            },
            {
                "$replaceRoot": { "newRoot": "$employeeDocuments" }
            },
            {
                "$project": {
                    "_id": 1,
                    "commonid": 1,
                    "profileimage": 1
                }
            }
        ];

        let req = await axios.post(
            SERVICE.DYNAMICUSER_CONTROLLER,
            {
                aggregationPipeline,
            },
            {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`
                }
            }
        );

        const userProfile = req?.data?.users


        try {
            const employeeCount = employeeValueAdd.length;
            const ManualemployeeCount = subCategoryTodo.length;

            if (enableManualGenerate) {

                let remainingEmployees = ManualemployeeCount;

                // Generate 3-person templates for every set of 3 employees
                const numberOfThreePersonTemplates = Math.floor(remainingEmployees / 3);
                let processedEmployees = 0;

                for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                    // Get the next 3 employees for the template
                    const employeesForTemplate = subCategoryTodo.slice(processedEmployees, processedEmployees + 3);
                    processedEmployees += 3;
                    remainingEmployees -= 3;

                    // Extract employee values (if needed)
                    const employee = employeesForTemplate.map((item) => item?.subcategory);

                    // Generate base64 images for the template
                    let imageBase64Datas = await Promise.all(
                        employeesForTemplate?.map(async (data, index) => {
                            const templatesubcat = posterGenerate.subcategoryname;
                            const templatecat = posterGenerate.categoryname;

                            const getWishes = wishingMessage.filter((item) =>
                                item?.categoryname === templatecat &&
                                item?.subcategoryname === templatesubcat
                            )[0]?.wishingmessage;

                            const randomWishBD = "Happy Birthday";
                            const randomWishWA = "Happy Wedding Annivesary";
                            const randomWishWO = "Happy Work Annivesary";


                            // Create a temporary div for rendering the template
                            let tempDiv = document.createElement("div");
                            tempDiv.style.position = "absolute";
                            tempDiv.style.left = "-9999px"; // Hide it from view
                            tempDiv.style.width = "500px";
                            tempDiv.style.height = "500px";

                            // Template for Birthday
                            let bdayHtml = `
                                    <div id="birthdaydivtwo3nos">
                                        <div id="birthday-cardtwo3nos">
                                            <div class="companylogotwo3nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                            <div id="emponediv">
                                                <div id="profileImgtwo3nos">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                    ${employeesForTemplate[0]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="emptwodiv">
                                                <div id="profileImgtwotwo3nos">
                                                    <img src="${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'}">                                                    
                                                    ${employeesForTemplate[1]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwotwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="empthreediv">
                                                <div id="profileImgtwothree3nos">
                                                    <img src="${employeesForTemplate[2]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[2]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="bdaywishestwo3nos">
                                                <span style="font-size: ${randomWishBD?.length > 50 ? '11px' : 'initial'}">
                                                    ${randomWishBD}
                                                </span>
                                            </div>
                                            <div class="bdayfootertexttwo3nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;

                            // Template for Birthday
                            let wedHtml = `
                                    <div id="birthdaydivtwo3nos">
                                        <div id="wedding-cardtwo3nos">
                                            <div class="companylogotwo3nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                            <div id="emponediv">
                                                <div id="profileImgtwo3nos">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                    ${employeesForTemplate[0]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="emptwodiv">
                                                <div id="profileImgtwotwo3nos">
                                                    <img src="${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'}">                                                    
                                                    ${employeesForTemplate[1]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwotwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="empthreediv">
                                                <div id="profileImgtwothree3nos">
                                                    <img src="${employeesForTemplate[2]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[2]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="bdaywishestwo3nos">
                                                <span style="font-size: ${randomWishWA?.length > 50 ? '11px' : 'initial'}">
                                                    ${randomWishWA}
                                                </span>
                                            </div>
                                            <div class="bdayfootertexttwo3nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;

                            let workHtml = `
                                    <div id="birthdaydivtwo3nos">
                                        <div id="wedding-cardtwo3nos">
                                            <div class="companylogotwo3nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                            <div id="emponediv">
                                                <div id="profileImgtwo3nos">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                    ${employeesForTemplate[0]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="emptwodiv">
                                                <div id="profileImgtwotwo3nos">
                                                    <img src="${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'}">                                                    
                                                    ${employeesForTemplate[1]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwotwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="empthreediv">
                                                <div id="profileImgtwothree3nos">
                                                    <img src="${employeesForTemplate[2]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[2]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="bdaywishestwo3nos">
                                                <span style="font-size: ${randomWishWO?.length > 50 ? '11px' : 'initial'}">
                                                    ${randomWishWO}
                                                </span>
                                            </div>
                                            <div class="bdayfootertexttwo3nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;



                            // Render the appropriate template
                            tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") ||
                                templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml :
                                templatecat?.toLowerCase()?.includes("work") ||
                                    templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;

                            document.body.appendChild(tempDiv);

                            // Convert the div to an image
                            let canvas = await html2canvas(tempDiv, { scale: 2 });
                            document.body.removeChild(tempDiv); // Cleanup

                            return canvas.toDataURL("image/png"); // Return base64 image
                        })
                    );

                    // Save the generated poster
                    await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                        headers: { Authorization: `Bearer ${auth.APIToken}` },
                        company: ["Manual"],
                        branch: ["Manual"],
                        unit: ["Manual"],
                        team: ["Manual"],
                        employeenamemanual: subCategoryTodo?.map(item => ({
                            subcategory: String(item?.subcategory || ""),
                            profile: Array.isArray(item?.profile) ? item.profile.map(profileItem => ({
                                preview: String(profileItem?.preview || ""),
                                name: String(profileItem?.name || ""),
                                remark: String(profileItem?.remark || "")
                            })) : []
                        })),
                        employeename: [employeesForTemplate[0]?.subcategory, employeesForTemplate[1]?.subcategory, employeesForTemplate[2]?.subcategory], // Ensure it's a string
                        posterdownload: [],
                        imagebase64: imageBase64Datas[0],
                        categoryname: String(posterGenerate.categoryname),
                        subcategoryname: String(posterGenerate.subcategoryname),
                        entrydate: String(manualEntry.entrydate),
                        manualentryname: String(manualEntry.manualentryname),
                        themename: "3-Person Manual Template",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    });

                    // Reset the poster generation state
                    setPosterGenerate({
                        categoryname: "Please Select Category Template Name",
                        subcategoryname: "Please Select Sub-category Template Name",
                        themename: "Please Select Theme Name",
                        days: "Please Select Days",
                    });
                }

                if (remainingEmployees === 2) {
                    const employeesForTemplate = subCategoryTodo.slice(processedEmployees, processedEmployees + 2);

                    const employee = employeesForTemplate.map((item) => item?.value);

                    let imageBase64Datas = await Promise.all(
                        employeesForTemplate?.map(async (data, index) => {
                            const templatesubcat = posterGenerate.subcategoryname;
                            const templatecat = posterGenerate.categoryname;

                            const profilePic = userProfile?.filter((item) => item?.commonid === data?._id)

                            const yearChange = moment(data?.dob).format("DD-MM-YYYY")
                            const [day, month] = yearChange.split("-");
                            const newDate = `${day}-${month}-${currentYear}`;

                            const getWishes = wishingMessage.filter((item) =>
                                item?.categoryname === templatecat &&
                                item?.subcategoryname === templatesubcat
                            )[0]?.wishingmessage;

                            const randomWishBD = "Happy Birthday";
                            const randomWishWA = "Happy Wedding Annivesary";
                            const randomWishWO = "Happy Work Annivesary";


                            // ✅ Create a temporary div inside a React container
                            let tempDiv = document.createElement("div");
                            tempDiv.style.position = "absolute";
                            tempDiv.style.left = "-9999px"; // Hide it from view
                            tempDiv.style.width = "500px";
                            tempDiv.style.height = "500px";

                            let bdayHtml = `
                                <div id="birthdaydivtwo2nos">
                                    <div id="birthday-cardtwo2nos">
                                        <div class="companylogotwo2nos">
                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                        </div>
                                        <div id="twoempprofile">
                                            <div id="emponediv">
                                                <div id="profileImgtwo2nos">
                                                    <img src='${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                    <span class="usernametwo2nos"
                                                        style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}";
                                                        
                                                    >${employeesForTemplate[0]?.subcategory}</span>
                                                    <span class="bdaydobtwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                            </div>
                                            <div id="emptwodiv">
                                                <div id="profileImgtwotwo2nos">
                                                    <img src='${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                    <span id="usernametwotwo2nos" class="usernametwo2nos"
                                                        style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                    >${employeesForTemplate[1]?.subcategory}</span>
                                                    <span class="bdaydobtwotwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bdaywishestwo2nos">
                                            <span
                                                style="font-size: ${randomWishBD?.length > 50 ? '11px' : 'initial'};"
                                            >${randomWishBD}</span>
                                        </div>
                                        <div class="bdayfootertexttwo2nos">
                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                        </div>
                                    </div>
                                </div>
                            `;

                            let wedHtml = `
                                        <div id="weddingtempdivtwo2nos">
                                                <div id="wedding-cardtwo2nos">
                                                    <div class="weddinglogotwo2nos">
                                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                    </div>
                                                    <div id="twoempprofile">
                                                        <div id="emponediv">
                                                            <div id="weddingImgtwo2nos" >
                                                                    <img src='${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[0]?.subcategory}</span>

                                                                    <span class="bdaydobtwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                        <div id="emptwodiv">
                                                            <div id="profileImgweddingtwo2nos" >
                                                                    <img src='${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span id="usernametwotwo2nos" class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[1]?.subcategory}</span>
                                                                    <span class="bdaydobtwotwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div class="weddingwishestwo2nos">
                                                        <span
                                                            style="font-size: ${randomWishWA?.length > 50 ? '11px' : 'initial'};"
                                                            >${randomWishWA}</span>
                                                    </div>
                                                    <div class="weddingfootertexttwo2nos">
                                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                    </div>
                                                </div>
                                        </div>                
                                    `;


                            let workHtml = `
                                        <div id="weddingtempdivtwo2nos">
                                                <div id="wedding-cardtwo2nos">
                                                    <div class="weddinglogotwo2nos">
                                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                    </div>
                                                    <div id="twoempprofile">
                                                        <div id="emponediv">
                                                            <div id="weddingImgtwo2nos" >
                                                                    <img src='${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[0]?.subcategory}</span>

                                                                    <span class="bdaydobtwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                        <div id="emptwodiv">
                                                            <div id="profileImgweddingtwo2nos" >
                                                                    <img src='${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span id="usernametwotwo2nos" class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[1]?.subcategory}</span>
                                                                    <span class="bdaydobtwotwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div class="weddingwishestwo2nos">
                                                        <span
                                                            style="font-size: ${randomWishWO?.length > 50 ? '11px' : 'initial'};"
                                                            >${randomWishWO}</span>
                                                    </div>
                                                    <div class="weddingfootertexttwo2nos">
                                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                    </div>
                                                </div>
                                        </div>                
                                    `;

                            tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml : templatecat?.toLowerCase()?.includes("work") || templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;

                            document.body.appendChild(tempDiv);

                            // ✅ Convert tempDiv to Image
                            let canvas = await html2canvas(tempDiv, { scale: 2 });
                            document.body.removeChild(tempDiv); // Cleanup

                            return canvas.toDataURL("image/png"); // Return base64 image
                        })
                    );

                    await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                        headers: { Authorization: `Bearer ${auth.APIToken}` },
                        company: ["Manual"],
                        branch: ["Manual"],
                        unit: ["Manual"],
                        team: ["Manual"],
                        employeenamemanual: subCategoryTodo?.map(item => ({
                            subcategory: String(item?.subcategory || ""),
                            profile: Array.isArray(item?.profile) ? item.profile.map(profileItem => ({
                                preview: String(profileItem?.preview || ""),
                                name: String(profileItem?.name || ""),
                                remark: String(profileItem?.remark || "")
                            })) : []
                        })),
                        employeename: [employeesForTemplate[0]?.subcategory, employeesForTemplate[1]?.subcategory], // Ensure it's a string
                        posterdownload: [],
                        imagebase64: imageBase64Datas[0],
                        categoryname: String(posterGenerate.categoryname),
                        subcategoryname: String(posterGenerate.subcategoryname),
                        entrydate: String(manualEntry.entrydate),
                        manualentryname: String(manualEntry.manualentryname),
                        themename: "2-Person Manual Template",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    });
                    processedEmployees += 2;
                    remainingEmployees -= 2;

                    setPosterGenerate({
                        categoryname: "Please Select Category Template Name",
                        subcategoryname: "Please Select Sub-category Template Name",
                        themename: "Please Select Theme Name",
                        days: "Please Select Days",
                    });
                }

                // If 1 employee remains, send them to the 1-person template
                if (remainingEmployees === 1) {
                    const employeesForTemplate = subCategoryTodo.slice(processedEmployees, processedEmployees + 1);


                    let imageBase64Datas = await Promise.all(
                        subCategoryTodo?.map(async (data) => {

                            const profilePic = userProfile?.filter((item) => item?.commonid === data?._id)

                            const yearChange = moment(data?.dob).format("DD-MM-YYYY")
                            const [day, month] = yearChange.split("-");
                            const newDate = `${day}-${month}-${currentYear}`;
                            // Get the current year
                            const templatesubcat = posterGenerate.subcategoryname;
                            const templatecat = posterGenerate.categoryname;

                            const getWishes = wishingMessage.filter((item) =>

                                item?.categoryname === templatecat &&
                                item?.subcategoryname === templatesubcat
                            )[0]?.wishingmessage;

                            const randomWishBD = "Happy Birthday";
                            const randomWishWA = "Happy Wedding Annivesary";
                            const randomWishWO = "Happy Work Annivesary";


                            let tempDiv = document.createElement("div");
                            tempDiv.style.position = "absolute";
                            tempDiv.style.left = "-9999px";
                            tempDiv.style.width = "500px";
                            tempDiv.style.height = "500px";

                            let bdayHtml = `
                            <div id="birthdaydivtwo">
                                <div id="birthday-cardtwo">
                                    <div class="companylogotwo">
                                        <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" />
                                    </div>
                                    <div id="profileImgtwo">
                                        <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" 
                                             alt="profile" width="190" height="150" />
                                        <span class="usernametwo" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '14px' : '16px'};">
                                            ${employeesForTemplate[0]?.subcategory}
                                        </span>
                                    </div>
                                    <div class="bdaydobtwo">
                                        <span>${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                    </div>
                                    <div class="bdaywishestwo">
                                        <span 
                                         style="font-size: ${randomWishBD?.length > 50 ? '11px' : 'initial'};"
                                        >${randomWishBD}</span>
                                    </div>
                                    <div class="bdayfootertexttwo">
                                        <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                    </div>
                                </div>
                            </div>
                            `

                            let wedHtml = `
                                        <div id="weddingdivtwo">
                                            <div id="wedding-card">
                                                <div class="companylogowedding">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="profileImgwedding">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                    <span class="usernamewedding"
                                                   style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '14px' : '16px'};"
                                                    >${employeesForTemplate[0]?.subcategory}</span>
                                                </div>
                                                <div class="bdaydobwedding">
                                                    <span>${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                                <div class="bdaywisheswedding">
                                                    <span
                                                     style="font-size: ${randomWishWA?.length > 50 ? '11px' : 'initial'};"
                                                    >${randomWishWA}</span>
                                                </div>
                                                <div class="bdayfootertextwedding">
                                                    <span >${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                            `

                            let workHtml = `
                                        <div id="weddingdivtwo">
                                            <div id="wedding-card">
                                                <div class="companylogowedding">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="profileImgwedding">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                    <span class="usernamewedding"
                                                   style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '14px' : '16px'};"
                                                    >${employeesForTemplate[0]?.subcategory}</span>
                                                </div>
                                                <div class="bdaydobwedding">
                                                    <span>${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                                <div class="bdaywisheswedding">
                                                    <span
                                                     style="font-size: ${randomWishWO?.length > 50 ? '11px' : 'initial'};"
                                                    >${randomWishWO}</span>
                                                </div>
                                                <div class="bdayfootertextwedding">
                                                    <span >${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                            `

                            tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml : templatecat?.toLowerCase()?.includes("work") || templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;

                            document.body.appendChild(tempDiv);

                            // ✅ Convert tempDiv to Image
                            let canvas = await html2canvas(tempDiv, { scale: 2 });
                            document.body.removeChild(tempDiv); // Cleanup

                            return canvas.toDataURL("image/png"); // Return base64 image
                        })
                    );

                    await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                        headers: { Authorization: `Bearer ${auth.APIToken} ` },
                        company: ["Manual"],
                        branch: ["Manual"],
                        unit: ["Manual"],
                        team: ["Manual"],
                        employeenamemanual: subCategoryTodo?.map(item => ({
                            subcategory: String(item?.subcategory || ""),
                            profile: Array.isArray(item?.profile) ? item.profile.map(profileItem => ({
                                preview: String(profileItem?.preview || ""),
                                name: String(profileItem?.name || ""),
                                remark: String(profileItem?.remark || "")
                            })) : []
                        })),
                        employeename: [employeesForTemplate[0]?.subcategory], // Ensure it's a string
                        posterdownload: [],
                        imagebase64: imageBase64Datas[0],
                        categoryname: String(posterGenerate.categoryname),
                        subcategoryname: String(posterGenerate.subcategoryname),
                        entrydate: String(manualEntry.entrydate),
                        manualentryname: String(manualEntry.manualentryname),
                        themename: "1-Person Manual Template",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    });

                    setPosterGenerate({
                        categoryname: "Please Select Category Template Name",
                        subcategoryname: "Please Select Sub-category Template Name",
                        themename: "Please Select Theme Name",
                        days: "Please Select Days",
                    });

                }
            }
            else {
                if (employeeCount > 0) {
                    let remainingEmployees = employeeCount;

                    // Generate 3-person templates for every set of 3 employees
                    const numberOfThreePersonTemplates = Math.floor(remainingEmployees / 3);
                    let processedEmployees = 0;

                    for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                        // Get the next 3 employees for the template
                        const employeesForTemplate = employeeValueAdd.slice(processedEmployees, processedEmployees + 3);
                        processedEmployees += 3;
                        remainingEmployees -= 3;

                        // Extract employee values (if needed)
                        const employee = employeesForTemplate.map((item) => item?.value);

                        // Generate base64 images for the template
                        let imageBase64Datas = await Promise.all(
                            employeesForTemplate?.map(async (data, index) => {
                                const templatesubcat = posterGenerate.subcategoryname;
                                const templatecat = posterGenerate.categoryname;

                                const profilePic1 = userProfile.find((item) => item?.commonid === employeesForTemplate[0]?._id);
                                const profilePic2 = userProfile.find((item) => item?.commonid === employeesForTemplate[1]?._id);
                                const profilePic3 = userProfile.find((item) => item?.commonid === employeesForTemplate[2]?._id);

                                const yearChangeBd1 = moment(employeesForTemplate[0]?.dob).format("DD-MM-YYYY")
                                const yearChangeBd2 = moment(employeesForTemplate[1]?.dob).format("DD-MM-YYYY")
                                const yearChangeBd3 = moment(employeesForTemplate[2]?.dob).format("DD-MM-YYYY")

                                const yearChangedm1 = moment(employeesForTemplate[0]?.dom).format("DD-MM-YYYY")
                                const yearChangedm2 = moment(employeesForTemplate[1]?.dom).format("DD-MM-YYYY")
                                const yearChangedm3 = moment(employeesForTemplate[2]?.dom).format("DD-MM-YYYY")

                                const yearChangedj1 = moment(employeesForTemplate[0]?.doj).format("DD-MM-YYYY")
                                const yearChangedj2 = moment(employeesForTemplate[1]?.doj).format("DD-MM-YYYY")
                                const yearChangedj3 = moment(employeesForTemplate[2]?.doj).format("DD-MM-YYYY")


                                const [daybd1, monthbd1] = yearChangeBd1.split("-");
                                const [daybd2, monthbd2] = yearChangeBd2.split("-");
                                const [daybd3, monthbd3] = yearChangeBd3.split("-");

                                const [daydm1, monthdm1] = yearChangedm1.split("-");
                                const [daydm2, monthdm2] = yearChangedm2.split("-");
                                const [daydm3, monthdm3] = yearChangedm3.split("-");

                                const [daydj1, monthdj1] = yearChangedj1.split("-");
                                const [daydj2, monthdj2] = yearChangedj2.split("-");
                                const [daydj3, monthdj3] = yearChangedj3.split("-");

                                const newDatebd = `${daybd1}-${monthbd1}-${currentYear}`;
                                const newDatebd2 = `${daybd2}-${monthbd2}-${currentYear}`;
                                const newDatebd3 = `${daybd3}-${monthbd3}-${currentYear}`;

                                const newDatema = `${daydm1}-${monthdm1}-${currentYear}`;
                                const newDatema2 = `${daydm2}-${monthdm2}-${currentYear}`;
                                const newDatema3 = `${daydm3}-${monthdm3}-${currentYear}`;

                                const newDatedj = `${daydj1}-${monthdj1}-${currentYear}`;
                                const newDatedj2 = `${daydj2}-${monthdj2}-${currentYear}`;
                                const newDatedj3 = `${daydj3}-${monthdj3}-${currentYear}`;

                                const getWishes = wishingMessage.filter((item) =>
                                    item?.categoryname === templatecat &&
                                    item?.subcategoryname === templatesubcat
                                )[0]?.wishingmessage;

                                const randomWish = getWishes ? getWishes[Math.floor(Math.random() * getWishes.length)] : "Happy Birthday!";

                                let wishs = await fetchDobs("one", randomWish, data?._id, employeesForTemplate[1]?._id, employeesForTemplate[2]?._id)

                                // Create a temporary div for rendering the template
                                let tempDiv = document.createElement("div");
                                tempDiv.style.position = "absolute";
                                tempDiv.style.left = "-9999px"; // Hide it from view
                                tempDiv.style.width = "600px"; // Ensure proper width for rendering

                                // Template for Birthday
                                let bdayHtml = `
                                        <div id="birthdaydivtwo3nos">
                                            <div id="birthday-cardtwo3nos">
                                                <div class="companylogotwo3nos">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="emponediv">
                                                    <div id="profileImgtwo3nos">
                                                        <img src="${profilePic1?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                            <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[0]?.legalname}
                                                        </span>
                                                        <span class="bdaydobtwo3nos">
                                                            ${newDatebd ? newDatebd : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="emptwodiv">
                                                    <div id="profileImgtwotwo3nos">
                                                        <img src="${profilePic2?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                            <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.legalname?.length > 11 ? '11px' : 'initial'}">                                                    
                                                        ${employeesForTemplate[1]?.legalname}
                                                        </span>
                                                        <span class="bdaydobtwotwo3nos">
                                                            ${newDatebd2 ? newDatebd2 : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="empthreediv">
                                                    <div id="profileImgtwothree3nos">
                                                        <img src="${profilePic3?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                            <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                            ${employeesForTemplate[2]?.legalname}
                                                        </span>
                                                        <span class="bdaydobtwothree3nos">
                                                            ${newDatebd3 ? newDatebd3 : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="bdaywishestwo3nos">
                                                    <span style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'}">
                                                        ${wishs}
                                                    </span>
                                                </div>
                                                <div class="bdayfootertexttwo3nos">
                                                    <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `;

                                // Template for Wedding
                                let wedHtml = `
                                        <div id="weddingdivtwo3nos">
                                            <div id="wedding-cardtwo3nos">
                                                <div class="companylogotwo3nos">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="emponediv">
                                                    <div id="profileImgtwo3nos">
                                                        <img src="${profilePic1?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[0]?.legalname}
                                                        </span>
                                                        <span class="weddingdobtwo3nos">
                                                            ${newDatema ? newDatema : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="emptwodiv">
                                                    <div id="profileImgtwotwo3nos">
                                                        <img src="${profilePic2?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[1]?.legalname}
                                                        </span>
                                                        <span class="weddingdobtwotwo3nos">
                                                            ${newDatema2 ? newDatema2 : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="empthreediv">
                                                    <div id="profileImgtwothree3nos">
                                                        <img src="${profilePic3?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                            ${employeesForTemplate[2]?.legalname}
                                                        </span>
                                                        <span class="weddingdobtwothree3nos">
                                                            ${newDatema3 ? newDatema3 : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="bdaywishestwo3nos">
                                                    <span style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'}">
                                                        ${wishs}
                                                    </span>
                                                </div>
                                                <div class="bdayfootertexttwo3nos">
                                                    <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `;

                                // Template for work
                                let workHtml = `
                                        <div id="weddingdivtwo3nos">
                                            <div id="wedding-cardtwo3nos">
                                                <div class="companylogotwo3nos">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="emponediv">
                                                    <div id="profileImgtwo3nos">
                                                        <img src="${profilePic1?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[0]?.legalname}
                                                        </span>
                                                        <span class="weddingdobtwo3nos">
                                                            ${newDatedj ? newDatedj : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="emptwodiv">
                                                    <div id="profileImgtwotwo3nos">
                                                        <img src="${profilePic2?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[1]?.legalname}
                                                        </span>
                                                        <span class="weddingdobtwotwo3nos">
                                                            ${newDatedj2 ? newDatedj2 : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="empthreediv">
                                                    <div id="profileImgtwothree3nos">
                                                        <img src="${profilePic3?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.legalname?.length > 11 ? '11px' : 'initial'}">
                                                            ${employeesForTemplate[2]?.legalname}
                                                        </span>
                                                        <span class="weddingdobtwothree3nos">
                                                            ${newDatedj3 ? newDatedj3 : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="bdaywishestwo3nos">
                                                    <span style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'}">
                                                        ${wishs}
                                                    </span>
                                                </div>
                                                <div class="bdayfootertexttwo3nos">
                                                    <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `;

                                // Render the appropriate template
                                tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml : templatecat?.toLowerCase()?.includes("work") || templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;

                                document.body.appendChild(tempDiv);

                                // Convert the div to an image
                                let canvas = await html2canvas(tempDiv, { scale: 2 });
                                document.body.removeChild(tempDiv); // Cleanup

                                return canvas.toDataURL("image/png"); // Return base64 image
                            })
                        );

                        // Save the generated poster
                        await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                            headers: { Authorization: `Bearer ${auth.APIToken}` },
                            company: [...new Set([
                                employeesForTemplate[0]?.company,
                                employeesForTemplate[1]?.company,
                                employeesForTemplate[2]?.company
                            ].filter(Boolean))],
                            branch: [...new Set([
                                employeesForTemplate[0]?.branch,
                                employeesForTemplate[1]?.branch,
                                employeesForTemplate[2]?.branch
                            ].filter(Boolean))],
                            unit: [...new Set([
                                employeesForTemplate[0]?.unit,
                                employeesForTemplate[1]?.unit,
                                employeesForTemplate[2]?.unit
                            ].filter(Boolean))],
                            team: [...new Set([
                                employeesForTemplate[0]?.team,
                                employeesForTemplate[1]?.team,
                                employeesForTemplate[2]?.team
                            ].filter(Boolean))],
                            employeename: employee,
                            posterdownload: employeesForTemplate,
                            entrydate: String(manualEntry.entrydate),
                            categoryname: String(posterGenerate.categoryname),
                            subcategoryname: String(posterGenerate.subcategoryname),
                            themename: "3-Person Template",
                            imagebase64: imageBase64Datas[0],
                            addedby: [
                                {
                                    name: String(isUserRoleAccess.companyname),
                                    date: String(new Date()),
                                },
                            ],
                        });

                        // Reset the poster generation state
                        setPosterGenerate({
                            categoryname: "Please Select Category Template Name",
                            subcategoryname: "Please Select Sub-category Template Name",
                            themename: "Please Select Theme Name",
                            days: "Please Select Days",
                        });
                    }

                    if (remainingEmployees === 2) {
                        const employeesForTemplate = employeeValueAdd.slice(processedEmployees, processedEmployees + 2);

                        const employee = employeesForTemplate.map((item) => item?.value);

                        let imageBase64Datas = await Promise.all(
                            employeesForTemplate?.map(async (data, index) => {
                                const templatesubcat = posterGenerate.subcategoryname;
                                const templatecat = posterGenerate.categoryname;


                                const profilePic1 = userProfile.find((item) => item?.commonid === employeesForTemplate[0]?._id);
                                const profilePic2 = userProfile.find((item) => item?.commonid === employeesForTemplate[1]?._id);


                                const yearChangeBd1 = moment(data?.dob).format("DD-MM-YYYY")
                                const yearChangedm1 = moment(data?.dom).format("DD-MM-YYYY")
                                const yearChangedj1 = moment(data?.doj).format("DD-MM-YYYY")

                                const yearChangeBd2 = moment(employeesForTemplate[1]?.dob).format("DD-MM-YYYY")
                                const yearChangedm2 = moment(employeesForTemplate[1]?.dom).format("DD-MM-YYYY")
                                const yearChangedj2 = moment(employeesForTemplate[1]?.doj).format("DD-MM-YYYY")

                                const [daybd1, monthbd1] = yearChangeBd1.split("-");
                                const [daydm1, monthdm1] = yearChangedm1.split("-");
                                const [daydj1, monthdj1] = yearChangedj1.split("-");

                                const [daybd2, monthbd2] = yearChangeBd2.split("-");
                                const [daydm2, monthdm2] = yearChangedm2.split("-");
                                const [daydj2, monthdj2] = yearChangedj2.split("-");

                                const newDatebd = `${daybd1}-${monthbd1}-${currentYear}`;
                                const newDatema = `${daydm1}-${monthdm1}-${currentYear}`;
                                const newDatedj = `${daydj1}-${monthdj1}-${currentYear}`;

                                const newDatebd2 = `${daybd2}-${monthbd2}-${currentYear}`;
                                const newDatema2 = `${daydm2}-${monthdm2}-${currentYear}`;
                                const newDatedj2 = `${daydj2}-${monthdj2}-${currentYear}`;

                                const getWishes = wishingMessage.filter((item) =>
                                    item?.categoryname === templatecat &&
                                    item?.subcategoryname === templatesubcat
                                )[0]?.wishingmessage;

                                const randomWish = getWishes ? getWishes[Math.floor(Math.random() * getWishes.length)] : "Happy Birthday!";

                                // let wishs = await fetchDobs("one", randomWish, data?._id, employeesForTemplate[1]?._id)

                                let wishs = await fetchDobs(
                                    "one",
                                    randomWish,
                                    employeesForTemplate[0]?._id, // First employee
                                    employeesForTemplate[1]?._id  // Second employee
                                );

                                // ✅ Create a temporary div inside a React container
                                let tempDiv = document.createElement("div");
                                tempDiv.style.position = "absolute";
                                tempDiv.style.left = "-9999px"; // Hide it from view
                                tempDiv.style.width = "600px"; // Ensure proper width for rendering

                                let bdayHtml = `
                                    <div id="birthdaydivtwo2nos">
                                        <div id="birthday-cardtwo2nos">
                                            <div class="companylogotwo2nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                            <div id="twoempprofile">
                                                <div id="emponediv">
                                                    <div id="profileImgtwo2nos">
                                                        <img src='${profilePic1?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                        <span class="usernametwo2nos"
                                                            style="font-size: ${data?.legalname?.length > 11 ? '11px' : 'initial'}";
                                                            
                                                        >${data?.legalname}</span>
                                                        <span class="bdaydobtwo2nos">${newDatebd ? newDatebd : ""}</span>
                                                    </div>
                                                </div>
                                                <div id="emptwodiv">
                                                    <div id="profileImgtwotwo2nos">
                                                        <img src='${profilePic2?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                        <span id="usernametwotwo2nos" class="usernametwo2nos"
                                                            style="font-size: ${employeesForTemplate[1]?.legalname?.length > 11 ? '11px' : 'initial'};"
                                                        >${employeesForTemplate[1]?.legalname}</span>
                                                        <span class="bdaydobtwotwo2nos">${newDatebd2 ? newDatebd2 : ""}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="bdaywishestwo2nos">
                                                <span
                                                    style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'};"
                                                >${wishs}</span>
                                            </div>
                                            <div class="bdayfootertexttwo2nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;

                                let wedHtml = `
                                            <div id="weddingtempdivtwo2nos">
                                                    <div id="wedding-cardtwo2nos">
                                                        <div class="weddinglogotwo2nos">
                                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                        </div>
                                                        <div id="twoempprofile">
                                                            <div id="emponediv">
                                                                <div id="weddingImgtwo2nos" >
                                                                        <img src='${profilePic1?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                    <span class="usernametwowedding2nos"
                                                                        style="font-size: ${data?.legalname?.length > 11 ? '11px' : 'initial'};"
                                                                        >${data?.legalname}</span>

                                                                        <span class="bdaydobtwo2nos">${newDatema ? newDatema : ""}</span>
                                                                </div>

                                                            </div>
                                                            <div id="emptwodiv">
                                                                <div id="profileImgweddingtwo2nos" >
                                                                        <img src='${profilePic2?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                    <span id="usernametwotwo2nos" class="usernametwowedding2nos"
                                                                        style="font-size: ${employeesForTemplate[1]?.legalname?.length > 11 ? '11px' : 'initial'};"
                                                                        >${employeesForTemplate[1]?.legalname}</span>
                                                                        <span class="bdaydobtwotwo2nos">${newDatema2 ? newDatema2 : ""}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div class="weddingwishestwo2nos">
                                                            <span
                                                                style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'};"
                                                                >${wishs}</span>
                                                        </div>
                                                        <div class="weddingfootertexttwo2nos">
                                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                        </div>
                                                    </div>
                                            </div>                
                                        `;

                                let workHtml = `
                                            <div id="weddingtempdivtwo2nos">
                                                    <div id="wedding-cardtwo2nos">
                                                        <div class="weddinglogotwo2nos">
                                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                        </div>
                                                        <div id="twoempprofile">
                                                            <div id="emponediv">
                                                                <div id="weddingImgtwo2nos" >
                                                                        <img src='${profilePic1?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                    <span class="usernametwowedding2nos"
                                                                        style="font-size: ${data?.legalname?.length > 11 ? '11px' : 'initial'};"
                                                                        >${data?.legalname}</span>

                                                                        <span class="bdaydobtwo2nos">${newDatedj ? newDatedj : ""}</span>
                                                                </div>

                                                            </div>
                                                            <div id="emptwodiv">
                                                                <div id="profileImgweddingtwo2nos" >
                                                                        <img src='${profilePic2?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                    <span id="usernametwotwo2nos" class="usernametwowedding2nos"
                                                                        style="font-size: ${employeesForTemplate[1]?.legalname?.length > 11 ? '11px' : 'initial'};"
                                                                        >${employeesForTemplate[1]?.legalname}</span>
                                                                        <span class="bdaydobtwotwo2nos">${newDatedj2 ? newDatedj2 : ""}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div class="weddingwishestwo2nos">
                                                            <span
                                                                style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'};"
                                                                >${wishs}</span>
                                                        </div>
                                                        <div class="weddingfootertexttwo2nos">
                                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                        </div>
                                                    </div>
                                            </div>                
                                        `;

                                tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") ||
                                    templatesubcat?.toLowerCase()?.includes("birthday") ?
                                    bdayHtml : templatecat?.toLowerCase()?.includes("work") ||
                                        templatesubcat?.toLowerCase()?.includes("work") ? workHtml
                                        : wedHtml;

                                document.body.appendChild(tempDiv);

                                // ✅ Convert tempDiv to Image
                                let canvas = await html2canvas(tempDiv, { scale: 2 });
                                document.body.removeChild(tempDiv); // Cleanup

                                return canvas.toDataURL("image/png"); // Return base64 image
                            })
                        );

                        await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                            headers: { Authorization: `Bearer ${auth.APIToken}` },
                            company: [...new Set([
                                employeesForTemplate[0]?.company,
                                employeesForTemplate[1]?.company,
                            ].filter(Boolean))],
                            branch: [...new Set([
                                employeesForTemplate[0]?.branch,
                                employeesForTemplate[1]?.branch,
                            ].filter(Boolean))],
                            unit: [...new Set([
                                employeesForTemplate[0]?.unit,
                                employeesForTemplate[1]?.unit,
                            ].filter(Boolean))],
                            team: [...new Set([
                                employeesForTemplate[0]?.team,
                                employeesForTemplate[1]?.team,
                            ].filter(Boolean))],
                            employeename: employee,
                            posterdownload: employeesForTemplate,
                            entrydate: String(manualEntry.entrydate),
                            categoryname: String(posterGenerate.categoryname),
                            subcategoryname: String(posterGenerate.subcategoryname),
                            imagebase64: imageBase64Datas[0],
                            themename: "2-Person Template",
                            addedby: [
                                {
                                    name: String(isUserRoleAccess.companyname),
                                    date: String(new Date()),
                                },
                            ],
                        });
                        processedEmployees += 2;
                        remainingEmployees -= 2;

                        setPosterGenerate({
                            categoryname: "Please Select Category Template Name",
                            subcategoryname: "Please Select Sub-category Template Name",
                            themename: "Please Select Theme Name",
                            days: "Please Select Days",
                        });
                    }

                    // If 1 employee remains, send them to the 1-person template
                    if (remainingEmployees === 1) {
                        const employeesForTemplate = employeeValueAdd.slice(processedEmployees, processedEmployees + 1);

                        let imageBase64Datas = await Promise.all(
                            employeeValueAdd?.map(async (data) => {

                                const profilePic = userProfile?.filter((item) => item?.commonid === data?._id)

                                const yearChangeBd = moment(data?.dob).format("DD-MM-YYYY")
                                const yearChangedm = moment(data?.dom).format("DD-MM-YYYY")
                                const yearChangedj = moment(data?.doj).format("DD-MM-YYYY")
                                const [daybd, monthbd] = yearChangeBd.split("-");
                                const [daydm, monthdm] = yearChangedm.split("-");
                                const [daydj, monthdj] = yearChangedj.split("-");
                                const newDatebd = `${daybd}-${monthbd}-${currentYear}`;
                                const newDatema = `${daydm}-${monthdm}-${currentYear}`;
                                const newDatedj = `${daydj}-${monthdj}-${currentYear}`;
                                // Get the current year
                                const templatesubcat = posterGenerate.subcategoryname;
                                const templatecat = posterGenerate.categoryname;

                                const getWishes = wishingMessage.filter((item) =>

                                    item?.categoryname === templatecat &&
                                    item?.subcategoryname === templatesubcat
                                )[0]?.wishingmessage;

                                const randomWish = getWishes ? getWishes[Math.floor(Math.random() * getWishes.length)] : "Happy Birthday!";

                                let wishs = await fetchDobs("one", randomWish, data?._id)

                                let tempDiv = document.createElement("div");
                                tempDiv.style.position = "absolute";
                                tempDiv.style.left = "-9999px";
                                tempDiv.style.width = "600px";

                                let bdayHtml = `
                                <div id="birthdaydivtwo">
                                    <div id="birthday-cardtwo">
                                        <div class="companylogotwo">
                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" />
                                        </div>
                                        <div id="profileImgtwo">
                                            <img src="${profilePic[0]?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" 
                                                 alt="profile" width="190" height="150" />
                                            <span class="usernametwo" style="font-size: ${data?.legalname?.length > 11 ? '14px' : '16px'};">
                                                ${data?.legalname}
                                            </span>
                                        </div>
                                        <div class="bdaydobtwo">
                                            <span>${newDatebd ? newDatebd : ""}</span>
                                        </div>
                                        <div class="bdaywishestwo">
                                            <span 
                                             style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'};"
                                            >${wishs}</span>
                                        </div>
                                        <div class="bdayfootertexttwo">
                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                        </div>
                                    </div>
                                </div>
                                `

                                let wedHtml = `
                                            <div id="weddingdivtwo">
                                                <div id="wedding-card">
                                                    <div class="companylogowedding">
                                                        <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                    </div>
                                                    <div id="profileImgwedding">
                                                        <img src="${profilePic[0]?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                        <span class="usernamewedding"
                                                       style="font-size: ${data?.legalname?.length > 11 ? '14px' : '16px'};"
                                                        >${data?.legalname}</span>
                                                    </div>
                                                    <div class="bdaydobwedding">
                                                        <span>${newDatema ? newDatema : ""}</span>
                                                    </div>
                                                    <div class="bdaywisheswedding">
                                                        <span
                                                         style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'};"
                                                        >${wishs}</span>
                                                    </div>
                                                    <div class="bdayfootertextwedding">
                                                        <span >${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                    </div>
                                                </div>
                                            </div>
                                `

                                let workHtml = `
                                            <div id="weddingdivtwo">
                                                <div id="wedding-card">
                                                    <div class="companylogowedding">
                                                        <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                    </div>
                                                    <div id="profileImgwedding">
                                                        <img src="${profilePic[0]?.profileimage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                        <span class="usernamewedding"
                                                       style="font-size: ${data?.legalname?.length > 11 ? '14px' : '16px'};"
                                                        >${data?.legalname}</span>
                                                    </div>
                                                    <div class="bdaydobwedding">
                                                        <span>${newDatedj ? newDatedj : ""}</span>
                                                    </div>
                                                    <div class="bdaywisheswedding">
                                                        <span
                                                         style="font-size: ${wishs?.length > 50 ? '11px' : 'initial'};"
                                                        >${wishs}</span>
                                                    </div>
                                                    <div class="bdayfootertextwedding">
                                                        <span >${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                    </div>
                                                </div>
                                            </div>
                                `

                                tempDiv.innerHTML =
                                    templatecat?.toLowerCase()?.includes("birthday") ||
                                        templatesubcat?.toLowerCase()?.includes("birthday") ?
                                        bdayHtml : templatecat?.toLowerCase()?.includes("work") ||
                                            templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;

                                document.body.appendChild(tempDiv);

                                // ✅ Convert tempDiv to Image
                                let canvas = await html2canvas(tempDiv, { scale: 2 });
                                document.body.removeChild(tempDiv); // Cleanup

                                return canvas.toDataURL("image/png"); // Return base64 image
                            })
                        );

                        await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                            headers: { Authorization: `Bearer ${auth.APIToken} ` },
                            company: employeesForTemplate[0]?.company,
                            branch: employeesForTemplate[0]?.branch,
                            unit: employeesForTemplate[0]?.unit,
                            team: employeesForTemplate[0]?.team,
                            entrydate: String(manualEntry.entrydate),
                            employeename: employeesForTemplate[0]?.value,
                            posterdownload: employeesForTemplate,
                            categoryname: String(posterGenerate.categoryname),
                            subcategoryname: String(posterGenerate.subcategoryname),
                            imagebase64: imageBase64Datas[0],
                            themename: "1-Person Template",
                            addedby: [
                                {
                                    name: String(isUserRoleAccess.companyname),
                                    date: String(new Date()),
                                },
                            ],
                        });

                        setPosterGenerate({
                            categoryname: "Please Select Category Template Name",
                            subcategoryname: "Please Select Sub-category Template Name",
                            themename: "Please Select Theme Name",
                            days: "Please Select Days",
                        });

                    }
                }
            }
            // Finalize by fetching holiday data and resetting form fields
            // await fetchEmployee();
            await fetchHolidayAllGroup();
            setPosterGenerate({
                categoryname: "Please Select Category Template Name",
                subcategoryname: "Please Select Sub-category Template Name",
                themename: "Please Select Theme Name",
                days: "Please Select Days",
                company: "Please Select Company",
                branch: "Please Select Branch",
                unit: "Please Select Unit",
                team: "Please Select Team",
            });
            setSelectedThemeNames([]);
            setValueCat([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setPosterGroup("efg");
            setSubcategoryTodo([])
            setSubcategory("")
            //company
            setCompanyValueAdd([])
            setValueCompanyAdd([])
            setBranchOption([])
            setBranchValueAdd([])
            setValueBranchAdd([])
            setUnitOption([])
            setUnitValueAdd([])
            setValueUnitAdd([])
            setTeamOption([])
            setTeamValueAdd([])
            setValueTeamAdd([])
            setEmployeeOptionDaysWise([])
            setEmployeeValueAddEdit([])
            setEmployeeValueAdd([])
            setdocumentFiles([])
            setManualEntry({
                manualentryname: "",
                entrydate: "",
                entrydate: ""
            });
            setManualGenerate(false)
        } catch (err) {
            setloadingdeloverall(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //submit option for saving
    const handleSubmit = (e) => {
        setloadingdeloverall(true);
        e.preventDefault();
        const isNameMatch = posterGenerates?.some(
            (item) =>
                item.categoryname?.toLowerCase() === posterGenerate.categoryname?.toLowerCase() &&
                item.subcategoryname?.toLowerCase() === posterGenerate.subcategoryname?.toLowerCase() &&
                item.themename?.toLowerCase() === posterGenerate.themename?.toLowerCase());
        let employees = employeeValueAdd?.map(data => data);

        const hasDuplicates = (arr) =>
            new Set(arr.map((s) => s?.subcategory.toLowerCase())).size !== arr.length;

        if (enableManualGenerate) {
            if (posterGenerate.categoryname === "Please Select Category Template Name") {
                setPopupContentMalert("Please Select Category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                posterGenerate.subcategoryname ===
                "Please Select Sub-category Template Name"
            ) {
                setPopupContentMalert("Please Select Sub-category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (subcategory !== "") {
                setPopupContentMalert("Please Add Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (subCategoryTodo.some((item) => item?.subcategory === "")) {
                setPopupContentMalert("Please Enter Employee Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (hasDuplicates(subCategoryTodo)) {
                setPopupContentMalert("Employee Name Cannot be same!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (subCategoryTodo.length === 0) {
                setPopupContentMalert("Please Add Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                manualEntry.entrydate ===
                ""
            ) {
                setPopupContentMalert("Please Select Date!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            // else if (
            //     documentFiles?.length === 0
            // ) {
            //     setPopupContentMalert("Please Upload Profile!");
            //     setPopupSeverityMalert("info");
            //     handleClickOpenPopupMalert();
            // } 
            else {
                sendRequest();
            }

        }
        else {
            if (posterGenerate.categoryname === "Please Select Category Template Name") {
                setPopupContentMalert("Please Select Category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                posterGenerate.subcategoryname ===
                "Please Select Sub-category Template Name"
            ) {
                setPopupContentMalert("Please Select Sub-category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (companyValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (branchValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (unitValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (teamValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (posterGenerate?.days === "Please Select Days") {
                setPopupContentMalert("Please Select Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (posterGenerate?.days === "Custom Fields" && posterGenerate.fromdate === "") {
                setPopupContentMalert("Please Select From Date");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (employeeValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                manualEntry.entrydate ===
                ""
            ) {
                setPopupContentMalert("Please Select Date!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (isNameMatch) {
                setPopupContentMalert("Data Already Exist!!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest();
            }
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setPosterGenerate({
            categoryname: "Please Select Category Template Name",
            subcategoryname: "Please Select Sub-category Template Name",
            themename: "Please Select Theme Name",
            days: "Please Select Days",
        });
        setSubcategoryOption([]);
        setSelectedThemeNames([]);
        setThemeNames([])
        setValueCat([]);
        setEmployeeValueAdd([])
        setEmployeeOptionDaysWise([])
        setCompanyValueAdd([])
        setValueCompanyAdd([])
        setBranchOption([])
        setBranchValueAdd([])
        setValueBranchAdd([])
        setUnitOption([])
        setUnitValueAdd([])
        setValueUnitAdd([])
        setTeamOption([])
        setTeamValueAdd([])
        setValueTeamAdd([])
        setdocumentFiles([])
        setManualEntry({
            manualentryname: "",
            entrydate: "",
            entrydate: ""
        });
        setManualGenerate(false)
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };



    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPosterGenerateEdit(res?.data?.spostergenerate);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPosterGenerateEdit(res?.data?.spostergenerate);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // updateby edit page...
    let updateby = posterGenerateEdit?.updatedby;

    let addedby = posterGenerateEdit?.addedby;
    let holidayId = posterGenerateEdit?._id;
    //editing the single data...
    const gridRefTableImg = useRef(null);

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "PosterGenerate.png");
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
        documentTitle: "Poster Generate",
        pageStyle: "print",
    });
    //get all data.
    const [statusCheckchild, setStatusCheckchild] = useState(true);
    const [childGroupAll, setChildGroupAll] = useState([])
    const fetchHolidayAllGroup = async () => {
        setPageName(!pageName);
        setStatusCheckchild(true)
        try {
            let res_status = await axios.post(SERVICE.POSTERGENERATEGROUP, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setChildGroupAll(res_status?.data?.postergenerates);
            setStatusCheckchild(false)
        } catch (err) {
            setStatusCheckchild(false)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //serial no for listing items
    const addSerialNumber = (data) => {
        // const itemsWithSerialNumber = posterGenerates?.map((item, index) => ({
        //     ...item,
        //     serialNumber: index + 1,
        // }));
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
    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    // const filteredData = filteredDatas?.slice(
    //     (page - 1) * pageSize,
    //     page * pageSize
    // );
    // const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    // const visiblePages = Math.min(totalPages, 3);
    // const firstVisiblePage = Math.max(1, page - 1);
    // const lastVisiblePage = Math.min(
    //     firstVisiblePage + visiblePages - 1,
    //     totalPages
    // );
    // const pageNumbers = [];
    // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    //     pageNumbers.push(i);
    // }
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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
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
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
        },
        {
            field: "categoryname",
            headerName: "Category Template Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.categoryname,
            headerClassName: "bold-header",
        },
        {
            field: "subcategoryname",
            headerName: "Sub-Category Template Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategoryname,
            headerClassName: "bold-header",
        },
        {
            field: "themename",
            headerName: "Theme Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.themename,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
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
                    {isUserRoleCompare?.includes("vpostergenerate") && (

                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                handleDownloadClick(params.data);
                            }}
                        >
                            <CloudDownloadOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dpostergenerate") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpostergenerate") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipostergenerate") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = filteredDatas.map((item, index) => {

        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
            themename: item.themename,
            company: item?.company.toString(),
            branch: item?.branch.toString(),
            unit: item?.unit.toString(),
            team: item?.team.toString(),
            posterdownload: item?.posterdownload
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
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
    const [wishingMessage, setWishingMessage] = useState([])


    const getwishingmessage = async (e) => {
        setPageName(!pageName);

        try {
            let response = await axios.get(`${SERVICE.POSTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWishingMessage(response?.data?.postermessage)

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [footerMessage, setfooterMessage] = useState('')

    const getfootermessage = async (e) => {
        setPageName(!pageName);

        try {
            let response = await axios.get(`${SERVICE.FOOTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setfooterMessage(response?.data?.footermessage[0]?.footermessage)

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Poster Generate"),
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
        getapi()
        fetchCategoryAll();
        getwishingmessage();
        getfootermessage();
        fetchHolidayAllGroup();
        fetchBdaySetting();
    }, []);

    useEffect(() => {
        addSerialNumber(posterGenerates);
    }, [posterGenerates]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const delAccountcheckbox = async () => {
        setPageName(!pageName);
        setPosterGroup("1")
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.POSTERGENERATE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectAllChecked(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchEmployee();
            await fetchEmployeeForFilterForExports();
            await fetchHolidayAllGroup();
            setPosterGroup("2")
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    // MultiSelects Add
    const [companyOption, setCompanyOption] = useState([]);
    const [companyValueAdd, setCompanyValueAdd] = useState([]);
    let [valueCompanyAdd, setValueCompanyAdd] = useState("");
    const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    // Company MultiSelect
    const handleCompanyChangeAdd = (options) => {
        setValueCompanyAdd(
            options.map(a => {
                return a.value;
            })
        )
        setCompanyValueAdd(options);
        fetchBranch(options);
        setBranchOption([]);
        setBranchValueAdd([]);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setEmployeeOptionDaysWise([])
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });

    }
    // Fetching Companies
    const fetchCompanies = async () => {
        setPageName(!pageName);

        try {
            let result = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Autorization: `Bearer ${auth.APIToken}`,
                },
            });
            //Remove Duplicates From Companies
            let uniqueCompanies = Array.from(new Set(result?.data?.companies.map((t) => t.name)));
            setCompanyOption(
                uniqueCompanies.map((t) => ({
                    label: t,
                    value: t
                }))
            )
        }
        catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    useEffect(() => {
        fetchCompanies();
    }, [])
    const [branchOption, setBranchOption] = useState([]);
    const [branchValueAdd, setBranchValueAdd] = useState([]);
    let [valueBranchAdd, setValueBranchAdd] = useState("");
    const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    // Branch Multi-Select
    const handleBranchChangeAdd = (options) => {
        setValueBranchAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setBranchValueAdd(options);
        fetchUnits(options);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeOptionDaysWise([])
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });

    };
    //Fetching Branches
    const fetchBranch = async (company) => {
        setPageName(!pageName);

        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branch?.data?.branch.map((t) => {
                company.forEach((d) => {
                    if (d.value == t.company) {
                        arr.push(t.name);
                    }
                });
            });
            setBranchOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [unitOption, setUnitOption] = useState([]);
    const [unitValueAdd, setUnitValueAdd] = useState([]);
    let [valueUnitAdd, setValueUnitAdd] = useState("");
    const customValueRendererUnitAdd = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    //Unit MultiSelect
    const handleUnitChangeAdd = (options) => {
        setValueUnitAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setUnitValueAdd(options);
        fetchTeams(options);
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeOptionDaysWise([])
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });
    }
    //Fetching Units
    const fetchUnits = async (branch) => {
        setPageName(!pageName);

        try {
            let res_branchunit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branchunit?.data?.units.map((t) => {
                branch.forEach((d) => {
                    if (d.value == t.branch) {
                        arr.push(t.name);
                    }
                });
            });
            setUnitOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    const [teamOption, setTeamOption] = useState([]);
    const [teamValueAdd, setTeamValueAdd] = useState([]);
    let [valueTeamAdd, setValueTeamAdd] = useState("");
    const customValueRendererTeamAdd = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length ? valueTeamAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Team</span>
    }
    //Team MultiSelect
    const handleTeamChangeAdd = (options) => {
        let teams =
            options.map((a) => {
                return a.value;
            })

        setValueTeamAdd(teams);
        setTeamValueAdd(options);
        fetchEmployeeName(teams)
        setEmployeeOptionDaysWise([])
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });
    }
    //Fetching Teams
    const fetchTeams = async (unit) => {
        setPageName(!pageName);

        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_team?.data?.teamsdetails?.map((t) => {
                unit.forEach((d) => {
                    if (d.value == t.unit) {
                        arr.push(t.teamname);
                    }
                });
            });
            setTeamOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    // const [empcodeValueAdd, setEmpcodeValueAdd] = useState([]);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [employeeOptionDaysWise, setEmployeeOptionDaysWise] = useState([]);


    let [valueEmployeeAdd, setValueEmployeeAdd] = useState("");
    const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    }
    //Employee MultiSelect
    const handleEmployeeChangeAdd = (options) => {
        setValueEmployeeAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setEmployeeValueAdd(options);
    }

    const [thisweekBirthday, setthisweekBirthday] = useState();
    const [thismonthBirthday, setthismonthBirthday] = useState();
    const [lastweekBirthday, setlastweekBirthday] = useState();
    const [lastmonthBirthday, setlastmonthBirthday] = useState();
    const [overallBirthday, setoverallBirthday] = useState();

    const [thisweekWedding, setthisweekWedding] = useState()
    const [lastmonthwedding, setlastmonthwedding] = useState()
    const [lastweekWedding, setlastweekWedding] = useState()
    const [thismonthwedding, setthismonthwedding] = useState()
    const [overallWedding, setoverallWedding] = useState()

    const [thisweekWork, setthisweekWork] = useState()
    const [lastmonthwork, setlastmonthwork] = useState()
    const [lastweekWork, setlastweekWork] = useState()
    const [thismonthwork, setthismonthwork] = useState()
    const [overallWork, setoverallWork] = useState()


    const fetchBirthday = async () => {
        setPageName(!pageName);

        try {
            let response = await axios.get(`${SERVICE.POSTERGENERATEGROUP_GETBIRTHDAY}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            let sortedthisweek = response?.data?.userbirthdaythisweek.sort(
                (a, b) => new Date(a.dob) - new Date(b.dob)
            );
            let sortedlastmonth = response?.data?.userslastmonthdob.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedlastweek = response?.data?.usersLastWeekdob.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedthismonth = response?.data?.usersthismonthbod.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedoverall = response?.data?.usersallbod.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );

            //birthdaythisweek
            if (response?.data?.userbirthdaythisweek.length != 0) {
                const displayDates = sortedthisweek?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setthisweekBirthday(displayDates);
            } else {
                setthisweekBirthday([]);
            }

            //birthdaylastmonth
            if (response?.data?.userslastmonthdob?.length != 0) {
                const displayDates = sortedlastmonth?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setlastmonthBirthday(displayDates);
            } else {
                setlastmonthBirthday([]);
            }

            //birthdaylastweek
            if (response?.data?.usersLastWeekdob.length != 0) {
                const displayDates = sortedlastweek?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setlastweekBirthday(displayDates);
            } else {
                setlastweekBirthday([]);
            }


            //birthdaythismonth
            if (response?.data?.usersthismonthbod.length != 0) {
                const displayDates = sortedthismonth?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setthismonthBirthday(displayDates);
            } else {
                setthismonthBirthday([]);
            }

            //birthdayoverall
            if (response?.data?.usersallbod.length != 0) {
                const displayDates = sortedoverall?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                        };
                    }
                });
                setoverallBirthday(displayDates);
            } else {
                setoverallBirthday([]);
            }


        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchWeddingAnnivesary = async () => {
        setPageName(!pageName);

        try {
            let response = await axios.get(`${SERVICE.POSTERGENERATEGROUP_GETWEDDINGANNIVERSARY}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            let sortedthisweek = response?.data?.userweddingthisweek.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedlastmonth = response?.data?.userslastmonthdom.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedlastweek = response?.data?.usersLastWeekdom.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedthismonth = response?.data?.usersthismonthdom.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedoverall = response?.data?.usersalldom.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );



            //weddingthisweek
            if (response?.data?.userweddingthisweek.length != 0) {
                const displayDates = sortedthisweek?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setthisweekWedding(displayDates);
            } else {
                setthisweekWedding([]);
            }

            //lastmonth
            if (response?.data?.userslastmonthdom?.length != 0) {
                const displayDates = sortedlastmonth?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setlastmonthwedding(displayDates);
            } else {
                setlastmonthwedding([]);
            }

            //lastweek
            if (response?.data?.usersLastWeekdom.length != 0) {
                const displayDates = sortedlastweek?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setlastweekWedding(displayDates);
            } else {
                setlastweekWedding([]);
            }


            //thismonth
            if (response?.data?.usersthismonthdom.length != 0) {
                const displayDates = sortedthismonth?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setthismonthwedding(displayDates);
            } else {
                setthismonthwedding([]);
            }

            //overall
            if (response?.data?.usersalldom.length != 0) {
                const displayDates = sortedoverall?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setoverallWedding(displayDates);
            } else {
                setoverallWedding([]);
            }


        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchWorkAnnivesary = async () => {
        setPageName(!pageName);

        try {
            let response = await axios.get(`${SERVICE.POSTERGENERATEGROUP_GETWORKANNIVERSARY}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            let sortedthisweek = response?.data?.userworkanniversarythisweek.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedlastmonth = response?.data?.userslastmonthdoj.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedlastweek = response?.data?.usersLastWeekdoj.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedthismonth = response?.data?.usersthismonthdoj.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedoverall = response?.data?.usersalldoj.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );



            //weddingthisweek
            if (response?.data?.userworkanniversarythisweek.length != 0) {
                const displayDates = sortedthisweek?.map((item) => {
                    const itemDate = new Date(item.doj);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            doj: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            doj: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setthisweekWork(displayDates);
            } else {
                setthisweekWork([]);
            }

            //lastmonth
            if (response?.data?.userslastmonthdoj?.length != 0) {
                const displayDates = sortedlastmonth?.map((item) => {
                    const itemDate = new Date(item.doj);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            doj: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            doj: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setlastmonthwork(displayDates);
            } else {
                setlastmonthwork([]);
            }

            //lastweek
            if (response?.data?.usersLastWeekdoj.length != 0) {
                const displayDates = sortedlastweek?.map((item) => {
                    const itemDate = new Date(item.doj);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            doj: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            doj: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setlastweekWork(displayDates);
            } else {
                setlastweekWork([]);
            }


            //thismonth
            if (response?.data?.usersthismonthdoj.length != 0) {
                const displayDates = sortedthismonth?.map((item) => {
                    const itemDate = new Date(item.doj);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            doj: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            doj: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setthismonthwork(displayDates);
            } else {
                setthismonthwork([]);
            }

            //overall
            if (response?.data?.usersalldoj.length != 0) {
                const displayDates = sortedoverall?.map((item) => {
                    const itemDate = new Date(item.doj);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            doj: "Today",
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            doj: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                            legalname: item.legalname,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,

                        };
                    }
                });
                setoverallWork(displayDates);
            } else {
                setoverallWork([]);
            }


        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [employeeOptiondob, setEmployeeOptiondob] = useState([])


    //Fetching Employee
    const fetchEmployeeName = async (team) => {
        setPageName(!pageName);
        try {
            // let res_employee = await axios.post(SERVICE.USER_POSTERGENERATE, {
            //     params: { team: team }, // Use 'params' for query parameters
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            const uniqueId = uuidv4();

            let arr = allUsersData?.filter(item => team?.includes(item.team))?.map((t) => ({
                ...t,
                _id: t._id,
                label: t.companyname,
                value: t.companyname,
                groupId: uniqueId,
                legalname: t.legalname,
            }));

            setEmployeeOption(arr)
            setEmployeeOptiondob(arr)

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    // MultiSelect Edit
    const [companyOptionEdit, setCompanyOptionEdit] = useState([]);
    const [companyValueAddEdit, setCompanyValueAddEdit] = useState([]);
    let [valueCompanyAddEdit, setValueCompanyAddEdit] = useState("");
    const customValueRendererCompanyAddEdit = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    // Company MultiSelect
    const handleCompanyChangeAddEdit = (options) => {
        setValueCompanyAddEdit(
            options.map(a => {
                return a.value;
            })
        )
        setCompanyValueAddEdit(options);
        fetchBranchEdit(options);
        setBranchOptionEdit([]);
        setBranchValueAddEdit([]);
        setUnitOptionEdit([]);
        setUnitValueAddEdit([]);
        setTeamOptionEdit([]);
        setEmployeeOptionEdit([]);
        setTeamValueAddEdit([]);
        setEmployeeValueAddEdit([]);
    }
    // Fetching CompaniesEdit
    const fetchCompaniesEdit = async () => {
        setPageName(!pageName);

        try {
            let result = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Autorization: `Bearer ${auth.APIToken}`,
                },
            });
            //Remove Duplicates From Companies
            let uniqueCompanies = Array.from(new Set(result?.data?.companies.map((t) => t.name)));
            setCompanyOptionEdit(
                uniqueCompanies.map((t) => ({
                    label: t,
                    value: t
                }))
            )
        }
        catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }





    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [overallFilterdataAllData, setOverallFilterdataAllData] = useState([]);

    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };


    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };


    const handleResetSearch = async () => {

        setPageName(!pageName)

        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            searchQuery: searchQuery,
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            team: valueTeamCat,
            department: valueDepartmentCat,
            companyname: valueEmployeeCat,
            categoryname: [...valueCategoryForFilter, "Wedding", "Birthday", "Work"],
            subcategoryname: [...valueSubCategoryForFilter, "Wedding", "Birthday", "Work"],
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }


        try {
            let res_employee = await axios.post(SERVICE.POSTERGENERATEGROUP_SORT, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setPosterGenerates(itemsWithSerialNumber);
            setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            })) : []);

            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [posterGeneratesExports, setPosterGeneratesExports] = useState([])

    const fetchEmployeeForFilterForExports = async () => {
        setIsCleared(true)

        setPageName(!pageName)
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            searchQuery: searchQuery,
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            team: valueTeamCat,
            department: valueDepartmentCat,
            companyname: valueEmployeeCat,
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
            categoryname: [...valueCategoryForFilter, "Wedding", "Birthday", "Work"],
            subcategoryname: [...valueSubCategoryForFilter, "Wedding", "Birthday", "Work"],
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }


        try {
            let res_employee = await axios.post(SERVICE.POSTERGENERATEGROUP_SORT_FILTER, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setPosterGeneratesExports(itemsWithSerialNumber);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchEmployeeForFilter = async () => {
        setIsCleared(true)
        setIsLoading(true);

        setPageName(!pageName)
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            searchQuery: searchQuery,
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            team: valueTeamCat,
            department: valueDepartmentCat,
            companyname: valueEmployeeCat,
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
            categoryname: [...valueCategoryForFilter, "Wedding", "Birthday", "Work"],
            subcategoryname: [...valueSubCategoryForFilter, "Wedding", "Birthday", "Work"],
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }


        try {
            let res_employee = await axios.post(SERVICE.POSTERGENERATEGROUP_SORT_FILTER, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setPosterGenerates(itemsWithSerialNumber);
            setPosterGeneratesForTable(itemsWithSerialNumber);
            setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            })) : []);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchEmployee = async () => {

        setPageName(!pageName)
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            searchQuery: searchQuery,
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            team: valueTeamCat,
            companyname: valueEmployeeCat,
            categoryname: [...valueCategoryForFilter, "Wedding", "Birthday", "Work"],
            subcategoryname: [...valueSubCategoryForFilter, "Wedding", "Birthday", "Work"],
            fromdate: String(filterUser.fromdate),
            todate: String(filterUser.todate),
        };


        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }


        try {
            let res_employee = await axios.post(SERVICE.POSTERGENERATEGROUP_SORT, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setPosterGenerates(itemsWithSerialNumber);
            setOverallFilterdataAllData(res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData?.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            })) : []);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [isCleared, setIsCleared] = useState(false)

    useEffect(() => {
        if (isCleared) {
            fetchEmployee();
        }
    }, [page, pageSize, searchQuery]);

    useEffect(() => {
        fetchCompaniesEdit();
        fetchBirthday();
        fetchWeddingAnnivesary();
        fetchWorkAnnivesary();
    }, [])
    const [branchOptionEdit, setBranchOptionEdit] = useState([]);
    const [branchValueAddEdit, setBranchValueAddEdit] = useState([]);
    let [valueBranchAddEdit, setValueBranchAddEdit] = useState("");
    const customValueRendererBranchAddEdit = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    // Branch Multi-Select
    const handleBranchChangeAddEdit = (options) => {
        setValueBranchAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setBranchValueAddEdit(options);
        fetchUnitsEdit(options);
        setUnitOptionEdit([]);
        setUnitValueAddEdit([]);
        setTeamOptionEdit([]);
        setTeamValueAddEdit([]);
        setEmployeeOptionEdit([]);
        setEmployeeValueAddEdit([]);
    };
    //Fetching Branches Edit
    const fetchBranchEdit = async (company) => {
        setPageName(!pageName);

        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branch?.data?.branch.map((t) => {
                company.forEach((d) => {
                    if (d.value == t.company) {
                        arr.push(t.name);
                    }
                });
            });
            setBranchOptionEdit(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [unitOptionEdit, setUnitOptionEdit] = useState([]);
    const [unitValueAddEdit, setUnitValueAddEdit] = useState([]);
    let [valueUnitAddEdit, setValueUnitAddEdit] = useState("");
    const customValueRendererUnitAddEdit = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    //Unit MultiSelect Edit
    const handleUnitChangeAddEdit = (options) => {
        setValueUnitAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setUnitValueAddEdit(options);
        fetchTeamsEdit(options);
    }
    //Fetching Units Edit
    const fetchUnitsEdit = async (branch) => {
        setPageName(!pageName);

        try {
            let res_branchunit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branchunit?.data?.units.map((t) => {
                branch.forEach((d) => {
                    if (d.value == t.branch) {
                        arr.push(t.name);
                    }
                });
            });
            setUnitOptionEdit(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    const [teamOptionEdit, setTeamOptionEdit] = useState([]);
    const [teamValueAddEdit, setTeamValueAddEdit] = useState([]);
    let [valueTeamAddEdit, setValueTeamAddEdit] = useState("");
    const customValueRendererTeamAddEdit = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length ? valueTeamAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Team</span>
    }
    //Team MultiSelect Edit
    const handleTeamChangeAddEdit = (options) => {
        setValueTeamAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setTeamValueAddEdit(options);
        fetchEmployeeEdit(options)
    }
    //Fetching Teams Edit
    const fetchTeamsEdit = async (unit) => {
        setPageName(!pageName);

        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_team?.data?.teamsdetails?.map((t) => {
                unit.forEach((d) => {
                    if (d.value == t.unit) {
                        arr.push(t.teamname);
                    }
                });
            });
            setTeamOptionEdit(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    // const [empcodeValueAdd, setEmpcodeValueAdd] = useState([]);
    const [employeeOptionEdit, setEmployeeOptionEdit] = useState([]);
    const [employeeValueAddEdit, setEmployeeValueAddEdit] = useState([]);
    let [valueEmployeeAddEdit, setValueEmployeeAddEdit] = useState("");
    const customValueRendererEmployeeAddEdit = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    }
    //Employee MultiSelect
    const handleEmployeeChangeAddEdit = (options) => {
        setValueEmployeeAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setEmployeeValueAddEdit(options);
    }
    //Fetching Employee Edit
    const fetchEmployeeEdit = async (team) => {
        let teamsnew = team.map((item) => item.value);
        setPageName(!pageName);

        try {
            let res_employee = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = res_employee?.data?.users.filter((t) => {
                return teamsnew.includes(t.team)
            });
            setEmployeeOptionEdit(
                arr.map((t) => ({
                    label: t.companyname,
                    value: t.companyname,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    const navigate = useNavigate();

    const handlePreviewClick = async () => {
        const allTemplates = menuItems?.filter(item => item?.title === "All-Template-Cards")?.find(item => item?.submenu)
            ?.submenu?.filter(item => item?.title === posterGenerate.themename
            );
        let employees = employeeValueAdd?.map(data => data);

        const employeesPerThreePersonTemplate = 3;
        const employeesPerTwoPersonTemplate = 2;
        const employeeCount = employeeValueAdd?.length;
        const employeeCountManual = subCategoryTodo?.length;

        const hasDuplicates = (arr) =>
            new Set(arr.map((s) => s?.subcategory.toLowerCase())).size !== arr.length;

        const template = allTemplates?.[0]?.url; // Single route from templates

        const getWishes = wishingMessage.filter((item) =>
            item?.categoryname === posterGenerate?.categoryname &&
            item?.subcategoryname === posterGenerate?.subcategoryname
        )[0]?.wishingmessage;



        if (enableManualGenerate) {
            if (posterGenerate.categoryname === "Please Select Category Template Name") {
                setPopupContentMalert("Please Select Category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                posterGenerate.subcategoryname ===
                "Please Select Sub-category Template Name"
            ) {
                setPopupContentMalert("Please Select Sub-category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (subcategory !== "") {
                setPopupContentMalert("Please Add Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (subCategoryTodo.some((item) => item?.subcategory === "")) {
                setPopupContentMalert("Please Enter Employee Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (hasDuplicates(subCategoryTodo)) {
                setPopupContentMalert("Employee Name Cannot be same!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (subCategoryTodo.length === 0) {
                setPopupContentMalert("Please Add Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                manualEntry.entrydate ===
                ""
            ) {
                setPopupContentMalert("Please Select Date!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                const ManualemployeeCount = subCategoryTodo.length;

                if (enableManualGenerate) {

                    let remainingEmployees = ManualemployeeCount;

                    // Generate 3-person templates for every set of 3 employees
                    const numberOfThreePersonTemplates = Math.floor(remainingEmployees / 3);
                    let processedEmployees = 0;

                    for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                        // Get the next 3 employees for the template
                        const employeesForTemplate = subCategoryTodo.slice(processedEmployees, processedEmployees + 3);
                        processedEmployees += 3;
                        remainingEmployees -= 3;

                        // Extract employee values (if needed)
                        const employee = employeesForTemplate.map((item) => item?.subcategory);

                        // Generate base64 images for the template
                        let imageBase64Datas = await Promise.all(
                            employeesForTemplate?.map(async (data, index) => {
                                const templatesubcat = posterGenerate.subcategoryname;
                                const templatecat = posterGenerate.categoryname;

                                const getWishes = wishingMessage.filter((item) =>
                                    item?.categoryname === templatecat &&
                                    item?.subcategoryname === templatesubcat
                                )[0]?.wishingmessage;

                                const randomWishBD = "Happy Birthday";
                                const randomWishWA = "Happy Wedding Annivesary";
                                const randomWishWO = "Happy Work Annivesary";


                                // let wishs = await fetchDobs("one", randomWish, data?._id, employeesForTemplate[1]?._id, employeesForTemplate[2]?._id)

                                // Create a temporary div for rendering the template
                                let tempDiv = document.createElement("div");
                                tempDiv.style.position = "absolute";
                                tempDiv.style.left = "-9999px"; // Hide it from view
                                tempDiv.style.width = "500px";
                                tempDiv.style.height = "500px";
                                // Template for Birthday
                                let bdayHtml = `
                                    <div id="birthdaydivtwo3nos">
                                        <div id="birthday-cardtwo3nos">
                                            <div class="companylogotwo3nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                            <div id="emponediv">
                                                <div id="profileImgtwo3nos">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                    ${employeesForTemplate[0]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="emptwodiv">
                                                <div id="profileImgtwotwo3nos">
                                                    <img src="${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />                                                        
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'}">                                                    
                                                    ${employeesForTemplate[1]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwotwo3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="empthreediv">
                                                <div id="profileImgtwothree3nos">
                                                    <img src="${employeesForTemplate[2]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="Profile Pic" width="190" height="150" />
                                                        <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[2]?.subcategory}
                                                    </span>
                                                    <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="bdaywishestwo3nos">
                                                <span style="font-size: ${randomWishBD?.length > 50 ? '11px' : 'initial'}">
                                                    ${randomWishBD}
                                                </span>
                                            </div>
                                            <div class="bdayfootertexttwo3nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;

                                let wedHtml = `<div id="birthdaydivtwo3nos">
                                    <div id="wedding-cardtwo3nos">
                                         <div class="companylogotwo3nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                        <div id="emponediv">
                                            <div id="profileImgtwo3nos" >
                                                <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                  <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                    ${employeesForTemplate[0]?.subcategory}
                                                    </span>
                                                <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                            </div>

                                        </div>
                                        <div id="emptwodiv">
                                            <div id="profileImgtwotwo3nos" >
                                                <img src="${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                 <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'}">                                                    
                                                    ${employeesForTemplate[1]?.subcategory}
                                                    </span>
                                                <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                            </div>

                                        </div>
                                        <div id="emptwodiv">
                                            <div id="profileImgtwothree3nos" >
                                                <img src="${employeesForTemplate[2]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                    <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[2]?.subcategory}
                                                    </span>
                                                <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                            </div>

                                        </div>
                                         <div class="bdaywishestwo3nos">
                                                <span style="font-size: ${randomWishWA?.length > 50 ? '11px' : 'initial'}">
                                                    ${randomWishWA}
                                                </span>
                                            </div>
                                       
                                           <div class="bdayfootertexttwo3nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                    </div>
                                </div>`

                                let workHtml = `<div id="birthdaydivtwo3nos">
                                    <div id="wedding-cardtwo3nos">
                                         <div class="companylogotwo3nos">
                                                <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                            </div>
                                        <div id="emponediv">
                                            <div id="profileImgtwo3nos" >
                                                <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                  <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                    ${employeesForTemplate[0]?.subcategory}
                                                    </span>
                                                <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                            </div>

                                        </div>
                                        <div id="emptwodiv">
                                            <div id="profileImgtwotwo3nos" >
                                                <img src="${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                 <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'}">                                                    
                                                    ${employeesForTemplate[1]?.subcategory}
                                                    </span>
                                                <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                            </div>

                                        </div>
                                        <div id="emptwodiv">
                                            <div id="profileImgtwothree3nos" >
                                                <img src="${employeesForTemplate[2]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                    <span class="usernametwo3nos" style="font-size: ${employeesForTemplate[2]?.subcategory?.length > 11 ? '11px' : 'initial'}">
                                                        ${employeesForTemplate[2]?.subcategory}
                                                    </span>
                                                <span class="bdaydobtwothree3nos">
                                                        ${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}
                                                    </span>
                                            </div>

                                        </div>
                                              <div class="bdaywishestwo3nos">
                                                <span style="font-size: ${randomWishWO?.length > 50 ? '11px' : 'initial'}">
                                                    ${randomWishWO}
                                                </span>
                                            </div>
                                       
                                           <div class="bdayfootertexttwo3nos">
                                                <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                            </div>
                                    </div>
                                </div>`


                                tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") ||
                                    templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml :
                                    templatecat?.toLowerCase()?.includes("work") ||
                                        templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;

                                document.body.appendChild(tempDiv);

                                // Convert the div to an image
                                let canvas = await html2canvas(tempDiv, { scale: 2 });
                                document.body.removeChild(tempDiv); // Cleanup

                                return canvas.toDataURL("image/png"); // Return base64 image
                            })
                        );

                        function openBase64Image(base64String, mimeType = "image/png") {
                            if (base64String.startsWith("data:image")) {
                                base64String = base64String.split(",")[1]; // Remove prefix if exists
                            }

                            // Convert base64 to byte array
                            const byteCharacters = atob(base64String);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: mimeType });

                            // Create object URL and open in new tab
                            const blobUrl = URL.createObjectURL(blob);
                            window.open(blobUrl, '_blank');
                        }

                        // Call function
                        openBase64Image(imageBase64Datas[0]);

                    }

                    if (remainingEmployees === 2) {
                        const employeesForTemplate = subCategoryTodo.slice(processedEmployees, processedEmployees + 2);

                        const employee = employeesForTemplate.map((item) => item?.value);

                        const randomWishBD = "Happy Birthday";
                        const randomWishWA = "Happy Wedding Annivesary";
                        const randomWishWO = "Happy Work Annivesary";

                        let imageBase64Datas = await Promise.all(
                            employeesForTemplate?.map(async (data, index) => {
                                const templatesubcat = posterGenerate.subcategoryname;
                                const templatecat = posterGenerate.categoryname;

                                const yearChange = moment(data?.dob).format("DD-MM-YYYY")
                                const [day, month] = yearChange.split("-");
                                const newDate = `${day}-${month}-${currentYear}`;

                                const getWishes = wishingMessage.filter((item) =>
                                    item?.categoryname === templatecat &&
                                    item?.subcategoryname === templatesubcat
                                )[0]?.wishingmessage;

                                const randomWish = getWishes ? getWishes[Math.floor(Math.random() * getWishes.length)] : "Happy Birthday!";

                                // ✅ Create a temporary div inside a React container
                                let tempDiv = document.createElement("div");
                                tempDiv.style.position = "absolute";
                                tempDiv.style.left = "-9999px"; // Hide it from view
                                tempDiv.style.width = "500px";
                                tempDiv.style.height = "500px";

                                let bdayHtml = `
                                <div id="birthdaydivtwo2nos">
                                    <div id="birthday-cardtwo2nos">
                                        <div class="companylogotwo2nos">
                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                        </div>
                                        <div id="twoempprofile">
                                            <div id="emponediv">
                                                <div id="profileImgtwo2nos">
                                                    <img src='${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                    <span class="usernametwo2nos"
                                                        style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'}";
                                                        
                                                    >${employeesForTemplate[0]?.subcategory}</span>
                                                    <span class="bdaydobtwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                            </div>
                                            <div id="emptwodiv">
                                                <div id="profileImgtwotwo2nos">
                                                    <img src='${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                    <span id="usernametwotwo2nos" class="usernametwo2nos"
                                                        style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                    >${employeesForTemplate[1]?.subcategory}</span>
                                                    <span class="bdaydobtwotwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bdaywishestwo2nos">
                                            <span
                                                style="font-size: ${randomWishBD?.length > 50 ? '11px' : 'initial'};"
                                            >${randomWishBD}</span>
                                        </div>
                                        <div class="bdayfootertexttwo2nos">
                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                        </div>
                                    </div>
                                </div>
                            `;

                                let wedHtml = `
                                        <div id="weddingtempdivtwo2nos">
                                                <div id="wedding-cardtwo2nos">
                                                    <div class="weddinglogotwo2nos">
                                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                    </div>
                                                    <div id="twoempprofile">
                                                        <div id="emponediv">
                                                            <div id="weddingImgtwo2nos" >
                                                                    <img src='${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[0]?.subcategory}</span>

                                                                    <span class="bdaydobtwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                        <div id="emptwodiv">
                                                            <div id="profileImgweddingtwo2nos" >
                                                                    <img src='${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span id="usernametwotwo2nos" class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[1]?.subcategory}</span>
                                                                    <span class="bdaydobtwotwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div class="weddingwishestwo2nos">
                                                        <span
                                                            style="font-size: ${randomWishWA?.length > 50 ? '11px' : 'initial'};"
                                                            >${randomWishWA}</span>
                                                    </div>
                                                    <div class="weddingfootertexttwo2nos">
                                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                    </div>
                                                </div>
                                        </div>                
                                    `;

                                let workHtml = `
                                        <div id="weddingtempdivtwo2nos">
                                                <div id="wedding-cardtwo2nos">
                                                    <div class="weddinglogotwo2nos">
                                                            <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                    </div>
                                                    <div id="twoempprofile">
                                                        <div id="emponediv">
                                                            <div id="weddingImgtwo2nos" >
                                                                    <img src='${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[0]?.subcategory}</span>

                                                                    <span class="bdaydobtwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                        <div id="emptwodiv">
                                                            <div id="profileImgweddingtwo2nos" >
                                                                    <img src='${employeesForTemplate[1]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}' alt="" width="190" height="150" />
                                                                <span id="usernametwotwo2nos" class="usernametwowedding2nos"
                                                                    style="font-size: ${employeesForTemplate[1]?.subcategory?.length > 11 ? '11px' : 'initial'};"
                                                                    >${employeesForTemplate[1]?.subcategory}</span>
                                                                    <span class="bdaydobtwotwo2nos">${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div class="weddingwishestwo2nos">
                                                        <span
                                                            style="font-size: ${randomWishWO?.length > 50 ? '11px' : 'initial'};"
                                                            >${randomWishWO}</span>
                                                    </div>
                                                    <div class="weddingfootertexttwo2nos">
                                                            <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                    </div>
                                                </div>
                                        </div>                
                                    `;

                                tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") ||
                                    templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml :
                                    templatecat?.toLowerCase()?.includes("work") ||
                                        templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;
                                document.body.appendChild(tempDiv);

                                // ✅ Convert tempDiv to Image
                                let canvas = await html2canvas(tempDiv, { scale: 2 });
                                document.body.removeChild(tempDiv); // Cleanup

                                return canvas.toDataURL("image/png"); // Return base64 image
                            })
                        );

                        function openBase64Image(base64String, mimeType = "image/png") {
                            if (base64String.startsWith("data:image")) {
                                base64String = base64String.split(",")[1]; // Remove prefix if exists
                            }

                            // Convert base64 to byte array
                            const byteCharacters = atob(base64String);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: mimeType });

                            // Create object URL and open in new tab
                            const blobUrl = URL.createObjectURL(blob);
                            window.open(blobUrl, '_blank');
                        }

                        // Call function
                        openBase64Image(imageBase64Datas[0]);

                        processedEmployees += 2;
                        remainingEmployees -= 2;

                    }

                    // If 1 employee remains, send them to the 1-person template
                    if (remainingEmployees === 1) {
                        const employeesForTemplate = subCategoryTodo.slice(processedEmployees, processedEmployees + 1);

                        const randomWishBD = "Happy Birthday";
                        const randomWishWA = "Happy Wedding Annivesary";
                        const randomWishWO = "Happy Work Annivesary";

                        let imageBase64Datas = await Promise.all(
                            subCategoryTodo?.map(async (data) => {

                                const yearChange = moment(data?.dob).format("DD-MM-YYYY")
                                const [day, month] = yearChange.split("-");
                                const newDate = `${day}-${month}-${currentYear}`;
                                // Get the current year
                                const templatesubcat = posterGenerate.subcategoryname;
                                const templatecat = posterGenerate.categoryname;

                                const getWishes = wishingMessage.filter((item) =>

                                    item?.categoryname === templatecat &&
                                    item?.subcategoryname === templatesubcat
                                )[0]?.wishingmessage;

                                const randomWish = getWishes ? getWishes[Math.floor(Math.random() * getWishes.length)] : "Happy Birthday!";

                                let wishs = await fetchDobs("one", randomWish, data?._id)

                                let tempDiv = document.createElement("div");
                                tempDiv.style.position = "absolute";
                                tempDiv.style.left = "-9999px";
                                tempDiv.style.width = "500px";
                                tempDiv.style.height = "500px";

                                let bdayHtml = `
                            <div id="birthdaydivtwo">
                                <div id="birthday-cardtwo">
                                    <div class="companylogotwo">
                                        <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" />
                                    </div>
                                    <div id="profileImgtwo">
                                        <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" 
                                             alt="profile" width="190" height="150" />
                                        <span class="usernametwo" style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '14px' : '16px'};">
                                            ${employeesForTemplate[0]?.subcategory}
                                        </span>
                                    </div>
                                    <div class="bdaydobtwo">
                                        <span>${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                    </div>
                                    <div class="bdaywishestwo">
                                        <span 
                                         style="font-size: ${randomWishBD?.length > 50 ? '11px' : 'initial'};"
                                        >${randomWishBD}</span>
                                    </div>
                                    <div class="bdayfootertexttwo">
                                        <span>${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                    </div>
                                </div>
                            </div>
                            `

                                let wedHtml = `
                                        <div id="weddingdivtwo">
                                            <div id="wedding-card">
                                                <div class="companylogowedding">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="profileImgwedding">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                    <span class="usernamewedding"
                                                   style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '14px' : '16px'};"
                                                    >${employeesForTemplate[0]?.subcategory}</span>
                                                </div>
                                                <div class="bdaydobwedding">
                                                    <span>${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                                <div class="bdaywisheswedding">
                                                    <span
                                                     style="font-size: ${randomWishWA?.length > 50 ? '11px' : 'initial'};"
                                                    >${randomWishWA}</span>
                                                </div>
                                                <div class="bdayfootertextwedding">
                                                    <span >${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                            `

                                let workHtml = `
                                        <div id="weddingdivtwo">
                                            <div id="wedding-card">
                                                <div class="companylogowedding">
                                                    <img src="${bdayCompanyLogo}" alt="logo" height="150" width="165" /><br />
                                                </div>
                                                <div id="profileImgwedding">
                                                    <img src="${employeesForTemplate[0]?.profile[0]?.preview || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}" alt="" width="190" height="150" />
                                                    <span class="usernamewedding"
                                                   style="font-size: ${employeesForTemplate[0]?.subcategory?.length > 11 ? '14px' : '16px'};"
                                                    >${employeesForTemplate[0]?.subcategory}</span>
                                                </div>
                                                <div class="bdaydobwedding">
                                                    <span>${manualEntry.entrydate ? moment(manualEntry.entrydate).format("DD-MM-YYYY") : ""}</span>
                                                </div>
                                                <div class="bdaywisheswedding">
                                                    <span
                                                     style="font-size: ${randomWishWO?.length > 50 ? '11px' : 'initial'};"
                                                    >${randomWishWO}</span>
                                                </div>
                                                <div class="bdayfootertextwedding">
                                                    <span >${footerMessage === "" || footerMessage === undefined || footerMessage === "undefined" ? "" : footerMessage}</span>
                                                </div>
                                            </div>
                                        </div>
                            `

                                tempDiv.innerHTML = templatecat?.toLowerCase()?.includes("birthday") ||
                                    templatesubcat?.toLowerCase()?.includes("birthday") ? bdayHtml :
                                    templatecat?.toLowerCase()?.includes("work") ||
                                        templatesubcat?.toLowerCase()?.includes("work") ? workHtml : wedHtml;
                                document.body.appendChild(tempDiv);

                                // ✅ Convert tempDiv to Image
                                let canvas = await html2canvas(tempDiv, { scale: 2 });
                                document.body.removeChild(tempDiv); // Cleanup

                                return canvas.toDataURL("image/png"); // Return base64 image
                            })
                        );

                        function openBase64Image(base64String, mimeType = "image/png") {
                            if (base64String.startsWith("data:image")) {
                                base64String = base64String.split(",")[1]; // Remove prefix if exists
                            }

                            // Convert base64 to byte array
                            const byteCharacters = atob(base64String);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: mimeType });

                            // Create object URL and open in new tab
                            const blobUrl = URL.createObjectURL(blob);
                            window.open(blobUrl, '_blank');
                        }

                        // Call function
                        openBase64Image(imageBase64Datas[0]);

                    }
                }
            }
        }
        else {

            if (posterGenerate.categoryname === "Please Select Category Template Name") {
                setPopupContentMalert("Please Select Category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                posterGenerate.subcategoryname ===
                "Please Select Sub-category Template Name"
            ) {
                setPopupContentMalert("Please Select Sub-category Template Name!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (companyValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (branchValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (unitValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (teamValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (posterGenerate?.days === "Please Select Days") {
                setPopupContentMalert("Please Select Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (posterGenerate?.days === "Custom Fields" && posterGenerate.fromdate === "") {
                setPopupContentMalert("Please Select From Date");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (employeeValueAdd?.length === 0) {
                setPopupContentMalert("Please Select Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday") || posterGenerate.subcategoryname?.toLowerCase()?.includes("birthday")) {
                if (employeeCount > 0) {
                    let remainingEmployees = employeeCount;
                    const numberOfThreePersonTemplates = Math.floor(remainingEmployees / employeesPerThreePersonTemplate);

                    // Handling 3-person templates
                    for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                        const threePersonGroup = employeeValueAdd.slice(i * 3, (i + 1) * 3);

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                            let combinedEmployeeData = '';

                            threePersonGroup.forEach((employee, index) => {
                                if (index > 0) combinedEmployeeData += '_';  // Add a separator between employee details
                                combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                            });

                            const url = `/birthdaycardtwo3nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, i * 500);
                    }

                    // Handle remaining employees after 3-person templates
                    remainingEmployees = employeeCount % 3;  // This gives us the number of remaining employees after the 3-person groups
                    const startIdx = numberOfThreePersonTemplates * 3;
                    const remainingEmployeeSlice = employeeValueAdd.slice(startIdx);

                    // Handle 2-person template
                    if (remainingEmployees === 2) {
                        const twoPersonGroup = remainingEmployeeSlice.slice(0, 2);  // Select remaining 2 employees

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                            let combinedEmployeeData = '';

                            twoPersonGroup.forEach((employee, index) => {
                                if (index > 0) combinedEmployeeData += '_';
                                combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                            });

                            const url = `/birthdaycardtwo2nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, 500);  // Delay of 500ms for opening the tab
                    }

                    // Handle 1-person template
                    if (remainingEmployees === 1) {
                        const onePersonGroup = remainingEmployeeSlice.slice(0, 1);  // Select the remaining single employee

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                            const employee = onePersonGroup[0];

                            const url = `/birthdaycardtwo/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, 500);
                    }
                } else {
                    // No employees to process
                    console.log("No employees to process.");
                }
            }
            else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding") || posterGenerate.subcategoryname?.toLowerCase()?.includes("wedding")) {
                if (employeeCount > 0) {
                    let remainingEmployees = employeeCount;
                    const numberOfThreePersonTemplates = Math.floor(remainingEmployees / employeesPerThreePersonTemplate);

                    // Handling 3-person templates
                    for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                        const threePersonGroup = employeeValueAdd.slice(i * 3, (i + 1) * 3);

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                            let combinedEmployeeData = '';

                            threePersonGroup.forEach((employee, index) => {
                                if (index > 0) combinedEmployeeData += '_';  // Add a separator between employee details
                                combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                            });

                            const url = `/weddingcard3nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, i * 500);
                    }

                    // Handle remaining employees after 3-person templates
                    remainingEmployees = employeeCount % 3;  // This gives us the number of remaining employees after the 3-person groups
                    const startIdx = numberOfThreePersonTemplates * 3;
                    const remainingEmployeeSlice = employeeValueAdd.slice(startIdx);

                    // Handle 2-person template
                    if (remainingEmployees === 2) {
                        const twoPersonGroup = remainingEmployeeSlice.slice(0, 2);  // Select remaining 2 employees

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                            let combinedEmployeeData = '';

                            twoPersonGroup.forEach((employee, index) => {
                                if (index > 0) combinedEmployeeData += '_';
                                combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                            });

                            const url = `/weddingcard2nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, 500);  // Delay of 500ms for opening the tab
                    }

                    // Handle 1-person template
                    if (remainingEmployees === 1) {
                        const onePersonGroup = remainingEmployeeSlice.slice(0, 1);  // Select the remaining single employee

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                            const employee = onePersonGroup[0];

                            const url = `/weddingcard/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, 500);
                    }
                } else {
                    // No employees to process
                    console.log("No employees to process.");
                }
            }
            else if (posterGenerate.categoryname?.toLowerCase()?.includes("work") || posterGenerate.subcategoryname?.toLowerCase()?.includes("work")) {
                if (employeeCount > 0) {
                    let remainingEmployees = employeeCount;
                    const numberOfThreePersonTemplates = Math.floor(remainingEmployees / employeesPerThreePersonTemplate);

                    // Handling 3-person templates
                    for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                        const threePersonGroup = employeeValueAdd.slice(i * 3, (i + 1) * 3);

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                            let combinedEmployeeData = '';

                            threePersonGroup.forEach((employee, index) => {
                                if (index > 0) combinedEmployeeData += '_';  // Add a separator between employee details
                                combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                            });

                            const url = `/workanniversarythree/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, i * 500);
                    }

                    // Handle remaining employees after 3-person templates
                    remainingEmployees = employeeCount % 3;  // This gives us the number of remaining employees after the 3-person groups
                    const startIdx = numberOfThreePersonTemplates * 3;
                    const remainingEmployeeSlice = employeeValueAdd.slice(startIdx);

                    // Handle 2-person template
                    if (remainingEmployees === 2) {
                        const twoPersonGroup = remainingEmployeeSlice.slice(0, 2);  // Select remaining 2 employees

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                            let combinedEmployeeData = '';

                            twoPersonGroup.forEach((employee, index) => {
                                if (index > 0) combinedEmployeeData += '_';
                                combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                            });

                            const url = `/workanniversarytwo/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, 500);  // Delay of 500ms for opening the tab
                    }

                    // Handle 1-person template
                    if (remainingEmployees === 1) {
                        const onePersonGroup = remainingEmployeeSlice.slice(0, 1);  // Select the remaining single employee

                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                            const employee = onePersonGroup[0];

                            const url = `/workanniversaryone/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                            window.open(url, '_blank');
                        }, 500);
                    }
                } else {
                    // No employees to process
                    console.log("No employees to process.");
                }
            }
        }
    };

    const handleDownloadClick = (row) => {
        const allTemplates = menuItems?.filter(item => item?.title === "All-Template-Cards")?.find(item => item?.submenu)
            ?.submenu?.filter(item => item?.title === row?.themename
            );
        let employeename = row?.posterdownload;
        let employeenamesingle = row?.posterdownload[0]?.value;
        let employeenamesingleid = row?.id;
        let employeedbid = row?.employeedbid;
        // const template = allTemplates?.[0]?.url;
        const templatesubcat = row?.subcategoryname
        const templatecat = row?.categoryname
        const getWishes = wishingMessage.filter((item) =>
            item?.categoryname === row?.categoryname &&
            item?.subcategoryname === row?.subcategoryname
        )[0]?.wishingmessage;

        if (
            row?.themename === "2-Person Manual Template" ||
            row?.themename === "3-Person Manual Template" ||
            row?.themename === "1-Person Manual Template" ||
            row?.categoryname?.toLowerCase()?.includes("work") ||
            row?.subcategoryname?.toLowerCase()?.includes("work")
        ) {

            setTimeout(() => {

                const url = `/manualtemplate/${row?._id}`;
                // const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? "/birthdaycardtwomanualtemplate" : "/weddingcardmanualtemplate"}/?name=${employee}&date=${employeedate}&wish=${encodeURIComponent(randomWish)}&footer=${encodeURIComponent(footerMessage)}&status=${true}`;
                // const url = `/birthdaycardtwomanualtemplate/?name=${employee}&date=${employeedate}&wish=${encodeURIComponent(randomWish)}&footer=${encodeURIComponent(footerMessage)}`, { state: { profileimage: documentFiles[0]?.preview } };

                window.open(url, '_blank');
            }, 500);

        } else {
            if (
                row?.themename === "3-Person Template"
            ) {
                if (employeename.length % 3 === 0) {
                    for (let i = 0; i < employeename.length; i += 3) {
                        setTimeout(() => {
                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

                            let combinedEmployeeData = '';

                            if (employeename[i]) {
                                combinedEmployeeData += `${employeename[i]?.value}-${employeename[i]?._id}`;
                            }

                            if (employeename[i + 1]) {
                                combinedEmployeeData += `_${employeename[i + 1]?.value}-${employeename[i + 1]?._id}`;
                            }

                            if (employeename[i + 2]) {
                                combinedEmployeeData += `_${employeename[i + 2]?.value}-${employeename[i + 2]?._id}`;
                            }

                            const url = `${templatecat?.toLowerCase()?.includes("birthday") ||
                                templatesubcat?.toLowerCase()?.includes("birthday") ? "/birthdaycardtwo3nos" : "/weddingcard3nos"}/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

                            window.open(url, '_blank');
                        }, i * 500);
                    }
                } else {
                    setPopupContentMalert("Please Select Birthday 3NOS!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
            }
            else if (
                row?.themename === "2-Person Template"
            ) {
                if (employeename.length % 2 === 0) {
                    for (let i = 0; i < employeename.length; i += 2) {
                        setTimeout(() => {
                            let combinedEmployeeData = '';

                            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

                            if (employeename[i]) {
                                combinedEmployeeData += `${employeename[i]?.value}-${employeename[i]?._id}`;
                            }

                            if (employeename[i + 1]) {
                                combinedEmployeeData += `_${employeename[i + 1]?.value}-${employeename[i + 1]?._id}`;
                            }

                            const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? "/birthdaycardtwo2nos" : "/weddingcard2nos"}/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

                            window.open(url, '_blank');
                        }, i * 500);
                    }
                } else {
                    setPopupContentMalert("Please Select Birthday 2NOS!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
            }
            else if (
                row?.themename === "1-Person Template"
            ) {

                const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

                // const template = allTemplates?.[0]?.url;
                const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? "/birthdaycardtwo" : "/weddingcard"}/?name=${employeenamesingle}&id=${employeename[0]?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

                // const url = `${template}/?name=${employeename}&id=${employeedbid}&status=${true}`;
                window.open(url, '_blank');

            }
            else {

                const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

                // const template = allTemplates?.[0]?.url;
                const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday") ? "/birthdaycardtwo" : "/weddingcard"}/?name=${employeenamesingle}&id=${employeename[0]?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

                // const url = `${template}/?name=${employeenamesingle}&id=${employeedbid}&status=${true}`;
                window.open(url, '_blank');
            }
        }

        setPosterGenerate({
            categoryname: "Please Select Category Template Name",
            subcategoryname: "Please Select Sub-category Template Name",
            themename: "Please Select Theme Name",
            days: "Please Select Days",
            todate: "",
            fromdate: ""
        });

    };



    const [fileFormat, setFormat] = useState("");
    const [posterGroup, setPosterGroup] = useState("");

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });
    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchDepartments();
    }, []);


    //category FIlter

    const [selectedOptionsCategoryForFilter, setSelectedOptionsCategoryForFilter] = useState(
        []
    );
    const handleCategoryForFilterChange = (options) => {
        setValueCategoryForFilter(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCategoryForFilter(options);
        fetchSubcategoryForFIlter(options.map((a, index) => {
            return a.value;
        }))
    };

    const customValueRendererCategoryForFilter = (valueCategoryForFilter, _categoryname) => {
        return valueCategoryForFilter?.length
            ? valueCategoryForFilter.map(({ label }) => label)?.join(", ")
            : "Please Select Category";
    };

    //SUbCategory Multiselect


    const [selectedOptionsSubCategoryForFilter, setSelectedOptionsSubCategoryForFilter] = useState(
        []
    );
    const handleSubCategoryForFilterChange = (options) => {
        setValueSubCategoryForFilter(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCategoryForFilter(options);

    };

    const customValueRendererSubCategoryForFilter = (valueSubCategoryForFilter, _categoryname) => {
        return valueSubCategoryForFilter?.length
            ? valueSubCategoryForFilter.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    const fetchSubcategoryForFIlter = async (e) => {
        setPageName(!pageName);
        try {
            let data_set = categorythemegrouping.filter((data) => {
                return e?.includes(data.categoryname);
            });
            let subcategoryname = data_set?.map((item) => {
                return {
                    label: item?.subcategoryname,
                    value: item?.subcategoryname,
                }
            })
            setSubCategoryOptionForFilter(subcategoryname);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };




    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );

    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };


    //auto select all dropdowns
    const handleAutoSelect = async () => {
        try {

            let response = await axios.get(`${SERVICE.POSTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let all_datas = response.data.postermessage

            setCategoryOptionForFilter([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
            setSelectedOptionsCategoryForFilter([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ])

            setValueCategoryForFilter([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ].map((a, index) => {
                return a.value;
            }))

            let subcategoryname = all_datas?.map((item) => {
                return {
                    label: item?.subcategoryname,
                    value: item?.subcategoryname,
                }
            })
            setSubCategoryOptionForFilter(subcategoryname);
            setValueSubCategoryForFilter(subcategoryname.map((a, index) => {
                return a.value;
            }));
            setSelectedOptionsSubCategoryForFilter(subcategoryname);


            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            if (selectedValues?.length > 0) {
                selectedCompany = [
                    // "Manual", 
                    ...selectedCompany];
            }

            setValueCompanyCat(selectedCompany);


            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            if (selectedValues?.length > 0) {
                mappedCompany = [
                    // { label: "Manual", value: "Manual" },
                    ...mappedCompany];
            }

            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => u.companyname);
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            // setAllAssignCompany(selectedCompany);

            // setAllAssignBranch(selectedBranch);

            // setAllAssignUnit(selectedUnit);

            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    const handleClearFilter = () => {
        setFilter(false)
        setFilterUser({
            fromdate: today,
            todate: today,
            day: "Today"
        });
        setPosterGenerates([])
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setItems([])
        setTotalProjects(0)
        setTotalPages(0)
        setPageSize(10)
        setPage(1)
        setFilterState({
            type: "Individual",
            employeestatus: "Please Select Employee Status",
        });
        setdateForFilter({
            filterdate: ""
        });
        setIsCleared(false)
        setSelectedOptionsCategoryForFilter([])
        setSelectedOptionsSubCategoryForFilter([])
        setSubCategoryOptionForFilter([])
        setSearchQuery("")
        setFilteredChanges(null)
        setFilteredRowData([])
        setValueCategoryForFilter([])
        setValueSubCategoryForFilter([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //MULTISELECT ONCHANGE END

    const [filter, setFilter] = useState(false)

    const handleFilter = () => {
        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!valueCompanyCat?.includes("Manual") &&
            (["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
                selectedOptionsBranch?.length === 0)
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!valueCompanyCat?.includes("Manual") &&
            (["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
                selectedOptionsUnit?.length === 0)
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!valueCompanyCat?.includes("Manual") &&
            (["Individual", "Team"]?.includes(filterState?.type) &&
                selectedOptionsTeam?.length === 0)
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!valueCompanyCat?.includes("Manual") &&
            (filterState?.type === "Individual" &&
                selectedOptionsEmployee?.length === 0)
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!valueCompanyCat?.includes("Manual") &&
            (filterState?.type === "Department" &&
                selectedOptionsDepartment?.length === 0)
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (valueCategoryForFilter?.length === 0) {
            setPopupContentMalert("Please Select Poster Category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        } else if (valueSubCategoryForFilter?.length === 0) {
            setPopupContentMalert("Please Select Poster Sub-category!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        // else if (dateForFilter.filterdate === "") {
        //     setPopupContentMalert("Please Select Date!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else {
            setSearchQuery("")
            fetchEmployeeForFilter();
            fetchEmployeeForFilterForExports();
        }
    };


    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        fromdate: today,
        todate: today,
        type: "Please Select Type",
        percentage: "",
        day: "Today"
    });



    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
                break;
            default:
                return;
        }
    }

    return (
        <Box>
            <Headtitle title={"Poster Generate"} />
            <PageHeading
                title="Poster Generate"
                modulename="Poster"
                submodulename="Poster Generate"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Poster Generate</Typography> */}

            <>
                {isUserRoleCompare?.includes("apostergenerate") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>

                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}

                                >
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Poster Generate
                                    </Typography>
                                </Grid>


                                <Grid item lg={1} md={12} sm={12} xs={12}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox checked={enableManualGenerate} />}
                                            onChange={(e) => {
                                                setManualGenerate(!enableManualGenerate);
                                                setPosterGenerate({
                                                    categoryname: "Please Select Category Template Name",
                                                    subcategoryname: "Please Select Sub-category Template Name",
                                                    themename: "Please Select Theme Name",
                                                    days: "Please Select Days",
                                                    company: "Please Select Company",
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    team: "Please Select Team",
                                                });
                                                setSubcategoryOption([]);
                                                setSelectedThemeNames([]);
                                                setThemeNames([])
                                                setValueCat([]);
                                                setEmployeeValueAdd([])
                                                setEmployeeOptionDaysWise([])
                                                setCompanyValueAdd([])
                                                setValueCompanyAdd([])
                                                setBranchOption([])
                                                setBranchValueAdd([])
                                                setValueBranchAdd([])
                                                setUnitOption([])
                                                setUnitValueAdd([])
                                                setValueUnitAdd([])
                                                setTeamOption([])
                                                setTeamValueAdd([])
                                                setValueTeamAdd([])
                                                setdocumentFiles([])
                                                setManualEntry({
                                                    manualentryname: "",
                                                    entrydate: "",
                                                    entrydate: ""
                                                });
                                            }}
                                            label="Manual"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item lg={10} md={12} sm={12} xs={12}>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Poster Category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOption}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerate.categoryname,
                                                value: posterGenerate.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerate({
                                                    ...posterGenerate,
                                                    categoryname: e.value,
                                                    subcategoryname:
                                                        "Please Select Sub-category Template Name",
                                                    themename: "Please Select Theme Name",
                                                    days: "Please Select Days",

                                                });
                                                fetchSubcategoryBased(e);
                                                setThemeNames([])
                                                // setEmployeeOption([]);
                                                setEmployeeValueAdd([]);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Poster Sub-category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategoryOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerate.subcategoryname,
                                                value: posterGenerate.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerate({
                                                    ...posterGenerate,
                                                    subcategoryname: e.value,
                                                    themename: "Please Select Theme Name",

                                                });
                                                // fetchThemeBased(e)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {enableManualGenerate ?
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    placeholder="Please Enter SubCategory"
                                                    value="Manual"

                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    placeholder="Please Enter SubCategory"
                                                    value="Manual"

                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    placeholder="Please Enter SubCategory"
                                                    value="Manual"

                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    placeholder="Please Enter SubCategory"
                                                    value="Manual"

                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                                            <Grid item md={4} sm={12} xs={12}>

                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Employee Name <b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        placeholder="Please Enter Employee Name"
                                                        value={subcategory}
                                                        onChange={(e) => setSubcategory(e.target.value)}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            &nbsp;
                                            <Grid item md={2} sm={12} xs={12}>
                                                <Typography >Upload Profile<b style={{ color: "red" }}>*</b></Typography>
                                                <Grid sx={{ display: "flex" }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        component="label"
                                                        sx={{
                                                            "@media only screen and (max-width:550px)": {
                                                                marginY: "5px",
                                                            },
                                                            ...buttonStyles.buttonsubmit
                                                        }}
                                                    >
                                                        Upload
                                                        <input
                                                            type="file"
                                                            id="resume"
                                                            accept=".png, .jpeg"
                                                            name="file"
                                                            hidden
                                                            onChange={(e) => {
                                                                handleResumeUpload(e);
                                                            }}
                                                        />
                                                    </Button>
                                                    &emsp;
                                                </Grid>
                                            </Grid>
                                            {documentFiles?.length > 0 &&
                                                <Grid item md={6} sm={12} xs={12}>
                                                    <Typography >&nbsp;</Typography>
                                                    {documentFiles?.length > 0 &&
                                                        documentFiles.map((file, index) => (
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                sx={{ display: "flex" }}
                                                                key={index}
                                                            >
                                                                <Grid item md={8} sm={5} xs={5}>
                                                                    <Typography>{file.name}</Typography>
                                                                </Grid>
                                                                <Grid item md={1} sm={1} xs={1}>
                                                                    <VisibilityOutlinedIcon
                                                                        style={{
                                                                            fontsize: "large",
                                                                            color: "#357AE8",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => renderFilePreview(file)}
                                                                    />
                                                                </Grid>
                                                                <Grid item md={1} sm={1} xs={1}>
                                                                    <Button
                                                                        style={{
                                                                            fontsize: "large",
                                                                            color: "#357AE8",
                                                                            cursor: "pointer",
                                                                            marginTop: "-5px",
                                                                        }}
                                                                        onClick={() => handleFileDelete(index)}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        ))}
                                                </Grid>
                                            }
                                            &emsp;
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={addTodo}
                                                type="button"
                                                sx={{
                                                    height: "30px",
                                                    minWidth: "30px",
                                                    marginTop: "28px",
                                                    padding: "6px 10px",
                                                }}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Grid>

                                        {subCategoryTodo.length > 0 &&
                                            <Grid item md={12} sm={12} xs={12}>
                                                {subCategoryTodo.length > 0 && (
                                                    <ul type="none">
                                                        {subCategoryTodo.map((item, index) => {
                                                            return (
                                                                <li key={index}>
                                                                    <br />
                                                                    <Grid sx={{ display: "flex" }}>
                                                                        <Grid item md={4} sm={12} xs={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <OutlinedInput
                                                                                    id="component-outlined"
                                                                                    placeholder="Please Enter Employee Name"
                                                                                    value={item?.subcategory}
                                                                                    onChange={(e) =>
                                                                                        handleTodoEdit(index, e.target.value)
                                                                                    }
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        &nbsp;
                                                                        {item?.profile?.length > 0 &&
                                                                            <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                                                                <Typography >&nbsp;</Typography>
                                                                                {item?.profile?.length > 0 &&
                                                                                    item?.profile.map((file, index) => (
                                                                                        <Grid
                                                                                            container
                                                                                            spacing={2}
                                                                                            sx={{ display: "flex" }}
                                                                                            key={index}
                                                                                        >
                                                                                            <Grid item md={8} sm={5} xs={5}>
                                                                                                <Typography>{file.name}</Typography>
                                                                                            </Grid>
                                                                                            <Grid item md={1} sm={1} xs={1}>
                                                                                                <VisibilityOutlinedIcon
                                                                                                    style={{
                                                                                                        fontsize: "large",
                                                                                                        color: "#357AE8",
                                                                                                        cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() => renderFilePreview(file)}
                                                                                                />
                                                                                            </Grid>

                                                                                        </Grid>
                                                                                    ))}
                                                                            </Grid>
                                                                        }
                                                                        &emsp;
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            type="button"
                                                                            onClick={(e) => deleteTodo(index)}
                                                                            sx={{
                                                                                height: "30px",
                                                                                minWidth: "30px",

                                                                                padding: "6px 10px",
                                                                            }}
                                                                        >
                                                                            <AiOutlineClose />{" "}
                                                                        </Button>
                                                                    </Grid>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </Grid>
                                        }
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl size="small" fullWidth>
                                                <Typography>
                                                    Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    placeholder="Employee Name"
                                                    value={manualEntry.entrydate}
                                                    onChange={(e) => {
                                                        setManualEntry({
                                                            ...manualEntry,
                                                            entrydate: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                    </> :
                                    <>
                                        <Grid item lg={4} md={4} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Company <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    // options={companyOption}
                                                    options={accessbranch
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
                                                    value={companyValueAdd}
                                                    valueRenderer={customValueRendererCompanyAdd}
                                                    onChange={handleCompanyChangeAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    // options={branchOption}
                                                    options={accessbranch
                                                        ?.filter((comp) => companyValueAdd?.some((item) => item?.value === comp.company))
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
                                                    value={branchValueAdd}
                                                    valueRenderer={customValueRendererBranchAdd}
                                                    onChange={handleBranchChangeAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Unit <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    // options={unitOption}
                                                    options={accessbranch
                                                        ?.filter((comp) => branchValueAdd?.some((item) => item?.value === comp.branch))
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
                                                    value={unitValueAdd}
                                                    valueRenderer={customValueRendererUnitAdd}
                                                    onChange={handleUnitChangeAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Team <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    options={teamOption}
                                                    value={teamValueAdd}
                                                    valueRenderer={customValueRendererTeamAdd}
                                                    onChange={handleTeamChangeAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Days <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={daysoptions}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: posterGenerate.days,
                                                        value: posterGenerate.days,
                                                    }}
                                                    onChange={(e) => {
                                                        setPosterGenerate({
                                                            ...posterGenerate,
                                                            days: e.value,
                                                            fromdate: "",
                                                            todate: ""
                                                        });
                                                        if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday") || posterGenerate.subcategoryname?.toLowerCase()?.includes("birthday")) {

                                                            if (employeeOption?.length > 0 && e?.value === "Yesterday") {
                                                                const yesterday = moment().subtract(1, 'days').format('MM-DD');  // Get yesterday's date in MM-DD format
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    thisweekBirthday?.some((val) => {
                                                                        // Ensure `val.dob` is properly parsed (assuming it's in DD-MM-YYYY format)
                                                                        const formattedDOB = moment(val?.dob, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).isValid()
                                                                            ? moment(val?.dob, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM-DD')
                                                                            : 'Invalid date';

                                                                        return item?._id === val?._id && formattedDOB === yesterday;
                                                                    })
                                                                );

                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Last Week") {
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    lastweekBirthday?.some((val) => item?._id === val?._id)
                                                                );
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Last Month") {
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    lastmonthBirthday?.some((val) => item?._id === val?._id)
                                                                );
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Today") {
                                                                const empOpt = employeeOption?.filter((item) => thisweekBirthday?.some((val) => item?._id === val?._id && val?.dob === "Today"))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "This Week") {
                                                                const empOpt = employeeOption?.filter((item) => thisweekBirthday?.some((val) => item?._id === val?._id))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "This Month") {
                                                                const empOpt = employeeOption?.filter((item) => thismonthBirthday?.some((val) => item?._id === val?._id))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }

                                                        } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding") || posterGenerate.subcategoryname?.toLowerCase()?.includes("wedding")) {
                                                            if (employeeOption?.length > 0 && e?.value === "Yesterday") {
                                                                const yesterday = moment().subtract(1, 'days').format('MM-DD');  // Get yesterday's date in MM-DD format
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    thisweekWedding?.some((val) => {
                                                                        // Ensure `val.dob` is properly parsed (assuming it's in DD-MM-YYYY format)
                                                                        const formattedDOB = moment(val?.dom, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).isValid()
                                                                            ? moment(val?.dom, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM-DD')
                                                                            : 'Invalid date';

                                                                        return item?._id === val?._id && formattedDOB === yesterday;
                                                                    })
                                                                );

                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Last Week") {
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    lastweekWedding?.some((val) => item?._id === val?._id)
                                                                );
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Last Month") {
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    lastmonthwedding?.some((val) => item?._id === val?._id)
                                                                );
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Today") {
                                                                const empOpt = employeeOption?.filter((item) => thisweekWedding?.some((val) => item?._id === val?._id && val?.dob === "Today"))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "This Week") {
                                                                const empOpt = employeeOption?.filter((item) => thisweekWedding?.some((val) => item?._id === val?._id))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "This Month") {
                                                                const empOpt = employeeOption?.filter((item) => thismonthwedding?.some((val) => item?._id === val?._id))
                                                                setEmployeeOptionDaysWise(empOpt)

                                                            }
                                                        } else if (posterGenerate.categoryname?.toLowerCase()?.includes("work") || posterGenerate.subcategoryname?.toLowerCase()?.includes("work")) {
                                                            if (employeeOption?.length > 0 && e?.value === "Yesterday") {
                                                                const yesterday = moment().subtract(1, 'days').format('MM-DD');  // Get yesterday's date in MM-DD format
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    thisweekWork?.some((val) => {
                                                                        // Ensure `val.dob` is properly parsed (assuming it's in DD-MM-YYYY format)
                                                                        const formattedDOB = moment(val?.doj, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).isValid()
                                                                            ? moment(val?.doj, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM-DD')
                                                                            : 'Invalid date';

                                                                        return item?._id === val?._id && formattedDOB === yesterday;
                                                                    })
                                                                );

                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Last Week") {
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    lastweekWork?.some((val) => item?._id === val?._id)
                                                                );
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Last Month") {
                                                                const empOpt = employeeOption?.filter((item) =>
                                                                    lastmonthwork?.some((val) => item?._id === val?._id)
                                                                );
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "Today") {
                                                                const empOpt = employeeOption?.filter((item) => thisweekWork?.some((val) => item?._id === val?._id && val?.dob === "Today"))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "This Week") {
                                                                const empOpt = employeeOption?.filter((item) => thisweekWork?.some((val) => item?._id === val?._id))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                            else if (employeeOption?.length > 0 && e?.value === "This Month") {
                                                                const empOpt = employeeOption?.filter((item) => thismonthwork?.some((val) => item?._id === val?._id))
                                                                setEmployeeOptionDaysWise(empOpt)
                                                            }
                                                        }
                                                        setEmployeeValueAdd([])
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {posterGenerate.days === "Custom Fields" &&
                                            <>
                                                <Grid item md={2} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            From Date<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            type="date"
                                                            value={posterGenerate.fromdate}
                                                            onChange={(e) => {
                                                                const newFromDate = e.target.value;
                                                                setPosterGenerate((prevState) => ({
                                                                    ...prevState,
                                                                    fromdate: newFromDate,
                                                                    // todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                                    todate: ""
                                                                }));
                                                                if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday") || posterGenerate.subcategoryname?.toLowerCase()?.includes("birthday")) {

                                                                    const empOpt = overallBirthday?.filter((item) => {
                                                                        const itemDob = moment(item?.dob, 'D-M-YYYY', true);
                                                                        const fromDate = moment(newFromDate, 'YYYY-MM-DD', true);
                                                                        return itemDob.isValid() && itemDob.isSameOrAfter(fromDate);
                                                                    });
                                                                    const uniqueId = uuidv4();

                                                                    setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                        label: item?.companyname,
                                                                        value: item?.companyname,
                                                                        _id: item?._id,
                                                                        groupId: uniqueId,
                                                                        legalname: item?.legalname,
                                                                        company: item.company,
                                                                        branch: item.branch,
                                                                        unit: item.unit,
                                                                        team: item.team,
                                                                    })))
                                                                } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding") || posterGenerate.subcategoryname?.toLowerCase()?.includes("wedding")) {
                                                                    const empOpt = overallWedding?.filter((item) => {
                                                                        const itemDob = moment(item?.dom, 'D-M-YYYY', true);
                                                                        const fromDate = moment(newFromDate, 'YYYY-MM-DD', true);
                                                                        return itemDob.isValid() && itemDob.isSameOrAfter(fromDate);
                                                                    });
                                                                    const uniqueId = uuidv4();

                                                                    setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                        label: item?.companyname,
                                                                        value: item?.companyname,
                                                                        _id: item?._id,
                                                                        groupId: uniqueId,
                                                                        legalname: item?.legalname,
                                                                        company: item.company,
                                                                        branch: item.branch,
                                                                        unit: item.unit,
                                                                        team: item.team,
                                                                    })))

                                                                } else if (posterGenerate.categoryname?.toLowerCase()?.includes("work") || posterGenerate.subcategoryname?.toLowerCase()?.includes("work")) {
                                                                    const empOpt = overallWork?.filter((item) => {
                                                                        const itemDob = moment(item?.doj, 'D-M-YYYY', true);
                                                                        const fromDate = moment(newFromDate, 'YYYY-MM-DD', true);
                                                                        return itemDob.isValid() && itemDob.isSameOrAfter(fromDate);
                                                                    });
                                                                    const uniqueId = uuidv4();

                                                                    setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                        label: item?.companyname,
                                                                        value: item?.companyname,
                                                                        _id: item?._id,
                                                                        groupId: uniqueId,
                                                                        legalname: item?.legalname,
                                                                        company: item.company,
                                                                        branch: item.branch,
                                                                        unit: item.unit,
                                                                        team: item.team,
                                                                    })))

                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            To Date
                                                        </Typography>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            type="date"
                                                            value={posterGenerate.todate}
                                                            onChange={(e) => {
                                                                const selectedToDate = new Date(e.target.value);
                                                                const selectedFromDate = new Date(posterGenerate.fromdate);
                                                                const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                                                if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                                    setPosterGenerate({
                                                                        ...posterGenerate,
                                                                        todate: e.target.value
                                                                    });

                                                                    if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday")) {

                                                                        const empOpt = overallBirthday?.filter((item) => {
                                                                            const itemDob = moment(item?.dob, 'D-M-YYYY', true);
                                                                            const fromDate = moment(posterGenerate.fromdate, 'YYYY-MM-DD', true);
                                                                            const toDate = moment(e.target.value, 'YYYY-MM-DD', true);
                                                                            return itemDob.isValid() && itemDob.isBetween(fromDate, toDate, null, '[]');
                                                                        });

                                                                        const uniqueId = uuidv4();

                                                                        setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                            label: item?.companyname,
                                                                            value: item?.companyname,
                                                                            _id: item?._id,
                                                                            groupId: uniqueId,
                                                                            legalname: item.legalname

                                                                        })))

                                                                    } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding")) {
                                                                        const empOpt = overallWedding?.filter((item) => {
                                                                            const itemDob = moment(item?.dom, 'D-M-YYYY', true);
                                                                            const fromDate = moment(posterGenerate.fromdate, 'YYYY-MM-DD', true);
                                                                            const toDate = moment(e.target.value, 'YYYY-MM-DD', true);
                                                                            return itemDob.isValid() && itemDob.isBetween(fromDate, toDate, null, '[]');
                                                                        });

                                                                        const uniqueId = uuidv4();

                                                                        setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                            label: item?.companyname,
                                                                            value: item?.companyname,
                                                                            _id: item?._id,
                                                                            groupId: uniqueId,
                                                                            legalname: item.legalname

                                                                        })))


                                                                    }
                                                                } else {
                                                                    setPosterGenerate({
                                                                        ...posterGenerate,
                                                                        todate: "" // Reset to empty string if the condition fails
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>}
                                        <Grid item lg={4} md={4} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Employee Name <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect size="small"
                                                    options={employeeOptionDaysWise}
                                                    value={employeeValueAdd}
                                                    valueRenderer={customValueRendererEmployeeAdd}
                                                    onChange={handleEmployeeChangeAdd}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl size="small" fullWidth>
                                                <Typography>
                                                    Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    placeholder="Employee Name"
                                                    value={manualEntry.entrydate}
                                                    onChange={(e) => {
                                                        setManualEntry({
                                                            ...manualEntry,
                                                            entrydate: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                }
                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>&nbsp;</Typography>
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button variant="contained"
                                            onClick={handlePreviewClick}>
                                            Preview
                                        </Button>
                                        <LoadingButton
                                            onClick={handleSubmit}
                                            loading={loadingdeloverall}
                                            color="primary"
                                            loadingPosition="end"
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Generate
                                        </LoadingButton>
                                        <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Grid>


                        </>
                    </Box>
                )}
            </>

            <br />
            <br />


            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpostergenerate") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}

                            >
                                <Typography sx={userStyle.importheadtext}>
                                    Poster Generate Filter
                                </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Type<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={TypeOptions}
                                        styles={colourStyles}
                                        value={{
                                            label: filterState.type ?? "Please Select Type",
                                            value: filterState.type ?? "Please Select Type",
                                        }}
                                        onChange={(e) => {
                                            setFilterState((prev) => ({
                                                ...prev,
                                                type: e.value,
                                            }));
                                            setValueCompanyCat([]);
                                            setSelectedOptionsCompany([]);
                                            setValueBranchCat([]);
                                            setSelectedOptionsBranch([]);
                                            setValueUnitCat([]);
                                            setSelectedOptionsUnit([]);
                                            setValueTeamCat([]);
                                            setSelectedOptionsTeam([]);
                                            setValueDepartmentCat([]);
                                            setSelectedOptionsDepartment([]);
                                            setValueEmployeeCat([]);
                                            setSelectedOptionsEmployee([]);

                                            setSelectedOptionsCategoryForFilter([])
                                            setSelectedOptionsSubCategoryForFilter([])
                                            setSubCategoryOptionForFilter([])
                                            setValueCategoryForFilter([])
                                            setValueSubCategoryForFilter([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography>
                                    Company<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    {/* <MultiSelect
                                        options={accessbranch
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
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    /> */}
                                    <MultiSelect
                                        options={[
                                            ...(accessbranch?.length > 0
                                                ? [{ label: "Manual", value: "Manual" }]  // Add "Manual" only if accessbranch has items
                                                : []),
                                            ...accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) => i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                }),
                                        ]}
                                        value={selectedOptionsCompany}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />

                                </FormControl>
                            </Grid>

                            {
                                !valueCompanyCat?.includes("Manual") &&
                                <>
                                    {
                                        ["Individual", "Team"]?.includes(filterState.type) ? (
                                            <>
                                                {/* Branch Unit Team */}
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            Branch <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch
                                                                ?.filter((comp) =>
                                                                    valueCompanyCat?.includes(comp.company)
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                }))
                                                                .filter((item, index, self) => {
                                                                    return (
                                                                        self.findIndex(
                                                                            (i) =>
                                                                                i.label === item.label &&
                                                                                i.value === item.value
                                                                        ) === index
                                                                    );
                                                                })}
                                                            value={selectedOptionsBranch}
                                                            onChange={(e) => {
                                                                handleBranchChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererBranch}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            Unit<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch
                                                                ?.filter(
                                                                    (comp) =>
                                                                        valueCompanyCat?.includes(comp.company) &&
                                                                        valueBranchCat?.includes(comp.branch)
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.unit,
                                                                    value: data.unit,
                                                                }))
                                                                .filter((item, index, self) => {
                                                                    return (
                                                                        self.findIndex(
                                                                            (i) =>
                                                                                i.label === item.label &&
                                                                                i.value === item.value
                                                                        ) === index
                                                                    );
                                                                })}
                                                            value={selectedOptionsUnit}
                                                            onChange={(e) => {
                                                                handleUnitChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererUnit}
                                                            labelledBy="Please Select Unit"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Team<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={allTeam
                                                                ?.filter(
                                                                    (u) =>
                                                                        valueCompanyCat?.includes(u.company) &&
                                                                        valueBranchCat?.includes(u.branch) &&
                                                                        valueUnitCat?.includes(u.unit)
                                                                )
                                                                .map((u) => ({
                                                                    ...u,
                                                                    label: u.teamname,
                                                                    value: u.teamname,
                                                                }))}
                                                            value={selectedOptionsTeam}
                                                            onChange={(e) => {
                                                                handleTeamChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererTeam}
                                                            labelledBy="Please Select Team"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        ) : ["Department"]?.includes(filterState.type) ? (
                                            <>
                                                {/* Department */}
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Department<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={departmentOptions}
                                                            value={selectedOptionsDepartment}
                                                            onChange={(e) => {
                                                                handleDepartmentChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererDepartment}
                                                            labelledBy="Please Select Department"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        ) : ["Branch"]?.includes(filterState.type) ? (
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            Branch <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch
                                                                ?.filter((comp) =>
                                                                    valueCompanyCat?.includes(comp.company)
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                }))
                                                                .filter((item, index, self) => {
                                                                    return (
                                                                        self.findIndex(
                                                                            (i) =>
                                                                                i.label === item.label &&
                                                                                i.value === item.value
                                                                        ) === index
                                                                    );
                                                                })}
                                                            value={selectedOptionsBranch}
                                                            onChange={(e) => {
                                                                handleBranchChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererBranch}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        ) : ["Unit"]?.includes(filterState.type) ? (
                                            <>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            Branch<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch
                                                                ?.filter((comp) =>
                                                                    valueCompanyCat?.includes(comp.company)
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                }))
                                                                .filter((item, index, self) => {
                                                                    return (
                                                                        self.findIndex(
                                                                            (i) =>
                                                                                i.label === item.label &&
                                                                                i.value === item.value
                                                                        ) === index
                                                                    );
                                                                })}
                                                            value={selectedOptionsBranch}
                                                            onChange={(e) => {
                                                                handleBranchChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererBranch}
                                                            labelledBy="Please Select Branch"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            Unit <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={accessbranch
                                                                ?.filter(
                                                                    (comp) =>
                                                                        valueCompanyCat?.includes(comp.company) &&
                                                                        valueBranchCat?.includes(comp.branch)
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.unit,
                                                                    value: data.unit,
                                                                }))
                                                                .filter((item, index, self) => {
                                                                    return (
                                                                        self.findIndex(
                                                                            (i) =>
                                                                                i.label === item.label &&
                                                                                i.value === item.value
                                                                        ) === index
                                                                    );
                                                                })}
                                                            value={selectedOptionsUnit}
                                                            onChange={(e) => {
                                                                handleUnitChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererUnit}
                                                            labelledBy="Please Select Unit"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        ) : (
                                            ""
                                        )
                                    }
                                    {["Individual"]?.includes(filterState.type) && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allUsersData
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team)
                                                        )
                                                        .map((u) => ({
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsEmployee}
                                                    onChange={(e) => {
                                                        handleEmployeeChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererEmployee}
                                                    labelledBy="Please Select Employee"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                </>
                            }




                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Poster Category <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={categoryOptionForFIlter}
                                        value={selectedOptionsCategoryForFilter}
                                        onChange={(e) => {
                                            handleCategoryForFilterChange(e);
                                        }}
                                        valueRenderer={customValueRendererCategoryForFilter}
                                        labelledBy="Please Select Category"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Poster Sub-category<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={subCategoryOptionForFIlter}
                                        value={selectedOptionsSubCategoryForFilter}
                                        onChange={(e) => {
                                            handleSubCategoryForFilterChange(e);
                                        }}
                                        valueRenderer={customValueRendererSubCategoryForFilter}
                                        labelledBy="Please Select Sub Category"
                                    />
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={4} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>
                                        Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Employee Name"
                                        value={dateForFilter.filterdate}
                                        onChange={(e) => {
                                            setdateForFilter({
                                                ...dateForFilter,
                                                filterdate: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "500" }}>
                                        Days<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={daysoptions}
                                        // styles={colourStyles}
                                        value={{ label: filterUser.day, value: filterUser.day }}
                                        onChange={(e) => {
                                            handleChangeFilterDate(e);
                                            setFilterUser((prev) => ({ ...prev, day: e.value }))
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        From Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="from-date"
                                        type="date"
                                        disabled={filterUser.day !== "Custom Fields"}
                                        value={filterUser.fromdate}
                                        onChange={(e) => {
                                            const newFromDate = e.target.value;
                                            setFilterUser((prevState) => ({
                                                ...prevState,
                                                fromdate: newFromDate,
                                                todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="to-date"
                                        type="date"
                                        value={filterUser.todate}
                                        disabled={filterUser.day !== "Custom Fields"}
                                        onChange={(e) => {
                                            const selectedToDate = new Date(e.target.value);
                                            const selectedFromDate = new Date(filterUser.fromdate);
                                            const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                            if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                setFilterUser({
                                                    ...filterUser,
                                                    todate: e.target.value
                                                });
                                            } else {
                                                setFilterUser({
                                                    ...filterUser,
                                                    todate: "" // Reset to empty string if the condition fails
                                                });
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6} mt={3}>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleFilter()
                                            setFilter(true)
                                        }}
                                        // loading={filterLoader}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Filter
                                    </LoadingButton>

                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleClearFilter}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                    <br />
                    <br />
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Poster Generate List
                            </Typography>
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
                                    {isUserRoleCompare?.includes("excelpostergenerate") && (
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
                                    {isUserRoleCompare?.includes("csvpostergenerate") && (
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
                                    {isUserRoleCompare?.includes("printpostergenerate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpostergenerate") && (
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

                                    {isUserRoleCompare?.includes("imagepostergenerate") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                {/* <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
                                </Box> */}
                                <FormControl fullWidth size="small">
                                    <OutlinedInput size="small"
                                        id="outlined-adornment-weight"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <FaSearch />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {advancedFilter && (
                                                    <IconButton onClick={handleResetSearch}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplay()}
                                        onChange={handleSearchChange}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilter}
                                    />
                                </FormControl>
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
                        {isUserRoleCompare?.includes("bdpostergenerate") && (
                            <Button
                                sx={buttonStyles.buttonbulkdelete}
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />

                        {statusCheck ? (

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
                                <AggridTableForPaginationTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    totalDatas={totalProjects}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallFilterdataAllData}
                                />
                                <Popover
                                    id={idSearch}
                                    open={openSearch}
                                    anchorEl={anchorElSearch}
                                    onClose={handleCloseSearch}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                                >
                                    <Box style={{ padding: "10px", maxWidth: '450px' }}>
                                        <Typography variant="h6">Advance Search</Typography>
                                        <IconButton
                                            aria-label="close"
                                            onClick={handleCloseSearch}
                                            sx={{
                                                position: "absolute",
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.grey[500],
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <DialogContent sx={{ width: "100%" }}>
                                            <Box sx={{
                                                width: '350px',
                                                maxHeight: '400px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <Box sx={{
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    // paddingRight: '5px'
                                                }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Columns</Typography>
                                                            <Select fullWidth size="small"
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 200,
                                                                            width: "auto",
                                                                        },
                                                                    },
                                                                }}
                                                                style={{ minWidth: 150 }}
                                                                value={selectedColumn}
                                                                onChange={(e) => setSelectedColumn(e.target.value)}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="" disabled>Select Column</MenuItem>
                                                                {filteredSelectedColumn.map((col) => (
                                                                    <MenuItem key={col.field} value={col.field}>
                                                                        {col.headerName}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Operator</Typography>
                                                            <Select fullWidth size="small"
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 200,
                                                                            width: "auto",
                                                                        },
                                                                    },
                                                                }}
                                                                style={{ minWidth: 150 }}
                                                                value={selectedCondition}
                                                                onChange={(e) => setSelectedCondition(e.target.value)}
                                                                disabled={!selectedColumn}
                                                            >
                                                                {conditions.map((condition) => (
                                                                    <MenuItem key={condition} value={condition}>
                                                                        {condition}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Typography>Value</Typography>
                                                            <TextField fullWidth size="small"
                                                                value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                                                onChange={(e) => setFilterValue(e.target.value)}
                                                                disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                                                placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root.Mui-disabled': {
                                                                        backgroundColor: 'rgb(0 0 0 / 26%)',
                                                                    },
                                                                    '& .MuiOutlinedInput-input.Mui-disabled': {
                                                                        cursor: 'not-allowed',
                                                                    },
                                                                }}
                                                            />
                                                        </Grid>
                                                        {additionalFilters.length > 0 && (
                                                            <>
                                                                <Grid item md={12} sm={12} xs={12}>
                                                                    <RadioGroup
                                                                        row
                                                                        value={logicOperator}
                                                                        onChange={(e) => setLogicOperator(e.target.value)}
                                                                    >
                                                                        <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                                        <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                                    </RadioGroup>
                                                                </Grid>
                                                            </>
                                                        )}
                                                        {additionalFilters.length === 0 && (
                                                            <Grid item md={4} sm={12} xs={12} >
                                                                <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                                    Add Filter
                                                                </Button>
                                                            </Grid>
                                                        )}

                                                        <Grid item md={2} sm={12} xs={12}>
                                                            <Button variant="contained" onClick={() => {
                                                                fetchEmployee();
                                                                setIsSearchActive(true);
                                                                setAdvancedFilter([
                                                                    ...additionalFilters,
                                                                    { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                                                ])
                                                            }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                                Search
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </DialogContent>
                                    </Box>
                                </Popover>
                                {/* <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter(
                                            (column) => columnVisibility[column.field]
                                        )}
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
                                        Showing{" "}
                                        {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                        {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                        {filteredDatas?.length} entries
                                    </Box>
                                    <Box>
                                        <Button
                                            onClick={() => setPage(1)}
                                            disabled={page === 1}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <FirstPageIcon />
                                        </Button>
                                        <Button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button
                                                key={pageNumber}
                                                sx={userStyle.paginationbtn}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={page === pageNumber ? "active" : ""}
                                                disabled={page === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button
                                            onClick={() => setPage(totalPages)}
                                            disabled={page === totalPages}
                                            sx={userStyle.paginationbtn}
                                        >
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box> */}
                            </>
                        )}
                    </Box>
                </>
            )}
            <br />
            <br />
            {/* {isUserRoleCompare?.includes("lpostergenerate") && ( */}
            {/* <PosterGenerateGroupList childGroupAll={childGroupAll} statusCheckchild={statusCheckchild}
                onAction={
                    () => {
                        fetchHolidayAllGroup()
                        fetchHolidayAll()
                    }
                }
            /> */}
            {/* )} */}
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
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: "30px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Poster Generate
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{posterGenerateEdit.company?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{posterGenerateEdit.branch?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{posterGenerateEdit.unit?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography sx={{ wordWrap: 'break-word', overflow: "break-word" }}>{posterGenerateEdit.team?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{posterGenerateEdit.employeename?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category Template Name</Typography>
                                    <Typography>{posterGenerateEdit.categoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub-category Template Name</Typography>
                                    <Typography>
                                        {posterGenerateEdit.subcategoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Theme Name</Typography>
                                    <Typography>{posterGenerateEdit.themename}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                sx={buttonStyles?.buttonsubmit}
                                color="primary"
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
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
                itemsTwo={posterGeneratesExports ?? []}
                filename={"Poster Generate"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Poster Generate Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delHoliday}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAccountcheckbox}
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
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <LoadingBackdrop open={isLoading} />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}
export default PosterGenerate;