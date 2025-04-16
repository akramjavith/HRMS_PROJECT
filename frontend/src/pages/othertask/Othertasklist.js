import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
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
import Pagination from '../../components/Pagination';
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";


function OthertaskList() {

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
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    const monthOpt = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ]

    const [selectedMontOpt, setSelectMonthOpt] = useState([
        { value: "January", label: "January" },
        { value: "February", label: "February" },
        { value: "March", label: "March" },
        { value: "April", label: "April" },
        { value: "May", label: "May" },
        { value: "June", label: "June" },
        { value: "July", label: "July" },
        { value: "August", label: "August" },
        { value: "September", label: "September" },
        { value: "October", label: "October" },
        { value: "November", label: "November" },
        { value: "December", label: "December" },
    ])



    let [valueProjectAdd, setValueProjectAdd] = useState("");
    let [valueCategoryAdd, setValueCategoryAdd] = useState("");
    let [valueSubCategoryAdd, setValueSubCategoryAdd] = useState("");
    let [valueAssignedbyAdd, setValueAssignedbyAdd] = useState("");
    let [valueAssignedModeAdd, setValueAssignedModeAdd] = useState("");

    const [selectedProject, setselectedProject] = useState([]);
    const [selectedCategory, setselectedCategory] = useState([]);
    const [selectedSubCategory, setselectedSubCategory] = useState([]);
    const [selectedAssignedBy, setselectedAssignedBy] = useState([]);
    const [selectedAssignedMode, setselectedAssignedMode] = useState([]);


    const customValueRendererProjectAdd = (valueProjectAdd, _companies) => {
        return valueProjectAdd.length ? valueProjectAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Project</span>
    }
    const customValueRendererCategoryAdd = (valueCategoryAdd, _companies) => {
        return valueCategoryAdd.length ? valueCategoryAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Category</span>
    }
    const customValueRendererSubCategoryAdd = (valueSubCategoryAdd, _companies) => {
        return valueSubCategoryAdd.length ? valueSubCategoryAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub Category</span>
    }
    const customValueRendererAssignedbyAdd = (valueAssignedbyAdd, _companies) => {
        return valueAssignedbyAdd.length ? valueAssignedbyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Assigned By</span>
    }
    const customValueRendererAssignedModeAdd = (valueAssignedModeAdd, _companies) => {
        return valueAssignedModeAdd.length ? valueAssignedModeAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Assigned Mode</span>
    }


    const customValueRendererMonthAdd = (valueAssignedModeAdd, _companies) => {
        return valueAssignedModeAdd.length ? valueAssignedModeAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Month</span>
    }

    const customValueRendererYearAdd = (valueAssignedModeAdd, _companies) => {
        return valueAssignedModeAdd.length ? valueAssignedModeAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Year</span>
    }

    const handleProjectChangeAdd = (options) => {
        setValueProjectAdd(
            options.map(a => {
                return a.value;
            })
        )
        fetchCategoryDropdowns(options);
        setselectedProject(options);
        setselectedCategory([])
        setSubcategoryOption([])
        setselectedSubCategory([])
    }

    const handleCategoryChangeAdd = (options) => {
        setValueCategoryAdd(
            options.map(a => {
                return a.value;
            })
        )
        fetchSubcategoryDropdowns(options);
        setselectedCategory(options);
        setselectedSubCategory([])

    }

    const handleSubCategoryChangeAdd = (options) => {
        setValueSubCategoryAdd(
            options.map(a => {
                return a.value;
            })
        )
        setselectedSubCategory(options);
    }

    const handleAssignedbyChangeAdd = (options) => {
        setValueAssignedbyAdd(
            options.map(a => {
                return a.value;
            })
        )
        setselectedAssignedBy(options);
    }

    const handleAssignedModeAdd = (options) => {
        setValueAssignedModeAdd(
            options.map(a => {
                return a.value;
            })
        )
        setselectedAssignedMode(options);
    }

    const [selectedMonth, setselectedMonth] = useState([])
    const [valueMonthAdd, setValueMonthAdd] = useState([])
    const [selectedYear, setSelectedYear] = useState([])
    const [valueYearAdd, setValueYearAdd] = useState([])

    const handleMonthAdd = (options) => {
        setValueMonthAdd(
            options.map(a => {
                return a.value;
            })
        )
        setselectedMonth(options);
    }

    const handleYearAdd = (options) => {
        setValueYearAdd(
            options.map(a => {
                return a.value;
            })
        )
        setSelectedYear(options);
    }

    const handleMonth = (options) => {
        setValueAssignedModeAdd(
            options.map(a => {
                return a.value;
            })
        )
        setselectedAssignedMode(options);
    }



    const [fileFormat, setFormat] = useState("");
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [TextEditor, setTextEditor] = useState("");
    const [TextEditorEdit, setTextEditorEdit] = useState("");
    //state to handle holiday values
    const currentDate = new Date();

    const [manageothertask, setManageothertask] = useState({
        datemonth: "Date",
        fromdate: moment(currentDate).format("YYYY-MM-DD"),
        todate: moment(currentDate).format("YYYY-MM-DD"),
    });


    // const [selectedYear, setSelectedYear] = useState("Select Year");
    const [selectmonthname, setSelectMonthName] = useState("Select Month");
    const [selectedDate, setSelectedDate] = useState("");
    // const [selectedMonth, setSelectedMonth] = useState("");
    const currentYear = new Date().getFullYear();
    const currYear = today.getFullYear();
    const years = [];
    for (let year = currYear + 1; year >= currYear - 10; year--) {
        years.push({ value: year, label: year.toString() });
    }


    const updateDateValue = (year, month) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month, so add 1
        const currentDay = currentDate.getDate();
        const selectedDate = new Date(year, month === "" ? currentMonth - 1 : month - 1, 1); // month is 0-indexed
        const dateToDate = document.getElementById("datefrom");
        if (dateToDate) {
            if (year === currentYear && month == currentMonth) {
                // If selected year and month are the current year and month
                dateToDate.min = `${year}-${String(month).padStart(2, '0')}-01`;
                dateToDate.max = `${year}-${String(month).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
            } else {
                // If selected year and month are not the current year and month
                const selectedMonthStartDate = `${year}-${String(month).padStart(2, '0')}-01`;
                const nextMonth = new Date(year, month - 1 + 1, 0); // Setting date to 0 gets the last day of the previous month (end of the selected month)
                const selectedMonthEndDate = nextMonth.toISOString().split("T")[0];
                dateToDate.min = selectedMonthStartDate;
                dateToDate.max = selectedMonthEndDate;
            }
        }
    };

    const handleMonthChange = (event) => {
        // setSelectedMonth(event.value);
        updateDateValue(selectedYear, event.value);
        setSelectMonthName(event.label);
        setSelectedDate("");
    };

    const [manageothertaskEdit, setManageothertaskEdit] = useState({
        project: "Please Select Project",
        category: "Please Select Category",
        subcategory: "Please Select Sub category",
        total: "",
        date: formattedDate,
        time: "",
        assignedby: "Please Select Assigned by",
        assignedmode: "Please Select Assigned Mode",
        ticket: "",
        duedate: "",
        duetime: "",
        estimation: "Please Select Estimation",
        estimationtime: "",
        orate: 0,
        mrate: 0,
        flagcount: 1,
        points: "0.0000",
        conversion: "8.333333333333333",
    });
    const [documentFiles, setdocumentFiles] = useState([]);
    const [documentFilesEdit, setdocumentFilesEdit] = useState([]);

    const [categoryOption, setCategoryOption] = useState([]);
    const [subcategoryOption, setSubcategoryOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]);
    const [assignedmodeOpt, setAssignedmodeopt] = useState([]);
    const [assignedbyOpt, setAssignedbyopt] = useState([]);

    const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
    const [subcategoryOptionEdit, setSubcategoryOptionEdit] = useState([]);
    const [projectOptEdit, setProjectoptEdit] = useState([]);
    const [assignedmodeOptEdit, setAssignedmodeoptEdit] = useState([]);
    const [assignedbyOptEdit, setAssignedbyoptEdit] = useState([]);

    const [manageothertasks, setManageothertasks] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(true);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [deleteHoliday, setDeleteHoliday] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allManageothertaskEdit, setAllManageothertaskEdit] = useState([]);

    const handleResumeUploadEdit = (event) => {
        const resume = event.target.files;
        for (let i = 0; i < resume?.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesEdit((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ]);
            };
        }
    };

    const handleTextSummary = (value) => {
        setTextEditor(value);
    };

    const handleTextSummaryEdit = (value) => {
        setTextEditorEdit(value);
    };

    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const handleFileDeleteEdit = (index) => {
        setdocumentFilesEdit((prevFiles) =>
            prevFiles.filter((_, i) => i !== index)
        );
    };

    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setProjectopt(companyall);
            setProjectoptEdit(companyall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchAssignedmode = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.MANAGEASSIGNEDMODE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const assignall = [
                ...res_category?.data?.manageassignedmode.map((d) => ({
                    ...d,
                    label: d.manageassignedname,
                    value: d.manageassignedname,
                })),
            ];

            setAssignedmodeopt(assignall);
            setAssignedmodeoptEdit(assignall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchAssignedby = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.ASSIGNEDBY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const assinedbyall = [
                ...res_category?.data?.assignedby.map((d) => ({
                    ...d,
                    label: d.assignedname,
                    value: d.assignedname,
                })),
            ];

            setAssignedbyopt(assinedbyall);
            setAssignedbyoptEdit(assinedbyall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchCategoryDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.categoryprod.filter(
                (d) => e?.some((item) => d.project === item.value)
            );

            const catall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            setCategoryOption(catall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchCategoryDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.categoryprod.filter(
                (d) => d.project?.toLowerCase() === e?.toLowerCase());

            const catall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            setCategoryOptionEdit(catall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchSubcategoryDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res.data.subcategoryprod.filter(
                (d) => e?.some((item) => d.categoryname === item.value)
            );

            const subcatealls = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            setSubcategoryOption(subcatealls);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchSubcategoryDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res.data.subcategoryprod.filter(
                (d) => d.categoryname?.toLowerCase() === e?.toLowerCase());

            const suball = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            setSubcategoryOptionEdit(suball);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //auto select all dropdowns
    const handleAutoSelect = async () => {
        try {
            //project
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_project?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setValueProjectAdd(
                companyall.map(a => {
                    return a.value;
                })
            )
            setselectedProject(companyall);

            //category

            let res_projectc = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let cresult = res_projectc.data.categoryprod.filter(
                (d) => companyall?.some((item) => d.project === item.value)
            );

            const catall = cresult.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            setValueCategoryAdd(
                catall.map(a => {
                    return a.value;
                })
            )
            setselectedCategory(catall);
            setCategoryOption(catall);

            //subcategory

            let res = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let scresult = res.data.subcategoryprod.filter(
                (d) => catall?.some((item) => d.categoryname === item.value)
            );

            const subcatealls = scresult.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            setValueSubCategoryAdd(
                subcatealls.map(a => {
                    return a.value;
                })
            )
            setselectedSubCategory(subcatealls);
            setSubcategoryOption(subcatealls);

            //assignedby

            let res_category = await axios.get(SERVICE.ASSIGNEDBY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const assinedbyall = [
                ...res_category?.data?.assignedby.map((d) => ({
                    ...d,
                    label: d.assignedname,
                    value: d.assignedname,
                })),
            ];

            setValueAssignedbyAdd(
                assinedbyall.map(a => {
                    return a.value;
                })
            )
            setselectedAssignedBy(assinedbyall);

            //assignedmode
            let res_assigned = await axios.get(SERVICE.MANAGEASSIGNEDMODE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const assignall = [
                ...res_assigned?.data?.manageassignedmode.map((d) => ({
                    ...d,
                    label: d.manageassignedname,
                    value: d.manageassignedname,
                })),
            ];

            setValueAssignedModeAdd(
                assignall.map(a => {
                    return a.value;
                })
            )
            setselectedAssignedMode(assignall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    useEffect(() => {
        fetchProjectDropdowns();
        fetchAssignedmode();
        fetchAssignedby();
        handleAutoSelect();

    }, []);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        project: true,
        category: true,
        subcategory: true,
        total: true,
        date: true,
        time: true,
        assignedby: true,
        assignedmode: true,
        ticket: true,
        duedate: true,
        duetime: true,
        estimation: true,
        estimationtime: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [isAddOpenalert, setIsAddOpenalert] = useState(false);
    const [isUpdateOpenalert, setIsUpdateOpenalert] = useState(false);


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
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
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
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGEOTHERTASK_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteHoliday(res.data.smanageothertask);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let holidayid = deleteHoliday._id;
    const delHoliday = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.MANAGEOTHERTASK_SINGLE}/${holidayid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();
            // await fetchMangeothertaskArray();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [isBtn, setIsBtn] = useState(false)
    //add function



    const handleEstimationChangeEdit = (estimation) => {
        if (
            // manageothertask.estimationtime !== "" &&
            manageothertaskEdit.time !== "" &&
            manageothertaskEdit.date !== ""
        ) {
            if (estimation === "Days") {
                const estDate = new Date(manageothertaskEdit.date);
                estDate.setDate(
                    estDate.getDate() + Number(manageothertaskEdit.estimationtime)
                );
                setManageothertaskEdit({
                    ...manageothertaskEdit,
                    estimation: estimation,
                    duedate: moment(estDate).format("YYYY-MM-DD"),
                    duetime: manageothertaskEdit.time,
                });
            } else if (estimation === "Hours") {
                const [hours, minutes] = manageothertaskEdit.time
                    .split(":")
                    .map(Number);
                let newHours = hours + Number(manageothertaskEdit.estimationtime);
                let newDate = new Date(manageothertaskEdit.date);
                if (newHours >= 24) {
                    newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
                    newHours %= 24;
                }
                setManageothertaskEdit({
                    ...manageothertaskEdit,
                    estimation: estimation,
                    duedate: moment(newDate).format("YYYY-MM-DD"),
                    duetime: `${newHours < 10 ? "0" : ""}${newHours}:${minutes < 10 ? "0" : ""
                        }${minutes}`,
                });
            } else if (estimation === "Minutes") {
                const [hours, minutes] = manageothertaskEdit.time
                    .split(":")
                    .map(Number);
                let newMinutes = minutes + Number(manageothertaskEdit.estimationtime);
                let addedHours = Math.floor(newMinutes / 60);
                let adjustedMinutes = newMinutes % 60;
                let newHours = hours + addedHours;
                let newDate = new Date(manageothertaskEdit.date);
                if (newHours >= 24) {
                    newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
                    newHours %= 24;
                }
                setManageothertaskEdit({
                    ...manageothertaskEdit,
                    estimation: estimation,
                    duedate: moment(newDate).format("YYYY-MM-DD"),
                    duetime: `${newHours < 10 ? "0" : ""}${newHours}:${adjustedMinutes < 10 ? "0" : ""
                        }${adjustedMinutes}`,
                });
            }
        }
    };
    const handleEstimationTimeChangeEdit = (estTime) => {
        const regex = /^\d*\.?\d*$/;

        if (
            (manageothertaskEdit.estimation !== "Please Select Estimation" &&
                manageothertaskEdit.time !== "" &&
                manageothertaskEdit.date !== "" &&
                regex.test(estTime)) ||
            estTime === ""
        ) {
            if (manageothertaskEdit.estimation === "Days") {
                const estDate = new Date(manageothertaskEdit.date);
                estDate.setDate(estDate.getDate() + Number(estTime));
                setManageothertaskEdit({
                    ...manageothertaskEdit,
                    estimationtime: estTime,
                    duedate: moment(estDate).format("YYYY-MM-DD"),
                    duetime: manageothertaskEdit.time,
                });
            } else if (manageothertaskEdit.estimation === "Hours") {
                const [hours, minutes] = manageothertaskEdit.time
                    .split(":")
                    .map(Number);
                let newHours = hours + Number(estTime);
                let newDate = new Date(manageothertaskEdit.date);
                if (newHours >= 24) {
                    newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
                    newHours %= 24;
                }
                setManageothertaskEdit({
                    ...manageothertaskEdit,
                    estimationtime: estTime,
                    duedate: moment(newDate).format("YYYY-MM-DD"),
                    duetime: `${newHours < 10 ? "0" : ""}${newHours}:${minutes < 10 ? "0" : ""
                        }${minutes}`,
                });
            } else if (manageothertaskEdit.estimation === "Minutes") {
                const [hours, minutes] = manageothertaskEdit.time
                    .split(":")
                    .map(Number);
                let newMinutes = minutes + Number(estTime);
                let addedHours = Math.floor(newMinutes / 60);
                let adjustedMinutes = newMinutes % 60;
                let newHours = hours + addedHours;
                let newDate = new Date(manageothertaskEdit.date);
                if (newHours >= 24) {
                    newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
                    newHours %= 24;
                }
                setManageothertaskEdit({
                    ...manageothertaskEdit,
                    estimationtime: estTime,
                    duedate: moment(newDate).format("YYYY-MM-DD"),
                    duetime: `${newHours < 10 ? "0" : ""}${newHours}:${adjustedMinutes < 10 ? "0" : ""
                        }${adjustedMinutes}`,
                });
            }
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedProject.length === 0) {

            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            fetchEmployee();
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setselectedCategory([])
        setselectedAssignedBy([])
        setselectedAssignedMode([])
        setselectedProject([])
        setCategoryOption([])
        setSubcategoryOption([])
        setselectedSubCategory([])
        setValueProjectAdd("")
        setValueCategoryAdd("")
        setValueSubCategoryAdd("")
        setValueAssignedbyAdd("")
        setValueAssignedModeAdd("")
        setOverallFilterdata([])
        setTotalProjects(0)
        setManageothertask({
            datemonth: "Date",
            fromdate: "",
            todate: "",
        })
        setselectedMonth([])
        setValueMonthAdd([])
        setSelectedYear([])
        setValueYearAdd([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    //get single row to edit....
    const getCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGEOTHERTASK_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageothertaskEdit(res?.data?.smanageothertask);
            fetchCategoryDropdownsEdit(res?.data?.smanageothertask.project);
            fetchSubcategoryDropdownsEdit(res?.data?.smanageothertask.category);
            setdocumentFilesEdit(res?.data?.smanageothertask?.document);
            setTextEditorEdit(res?.data?.smanageothertask?.documentstext);
            handleClickOpenEdit();
        } catch (err) { 
            handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGEOTHERTASK_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageothertaskEdit(res?.data?.smanageothertask);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGEOTHERTASK_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageothertaskEdit(res?.data?.smanageothertask);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // updateby edit page...
    let updateby = manageothertaskEdit?.updatedby;

    let addedby = manageothertaskEdit?.addedby;
    let holidayId = manageothertaskEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(
                `${SERVICE.MANAGEOTHERTASK_SINGLE}/${holidayId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    project: String(manageothertaskEdit.project),
                    category: String(manageothertaskEdit.category),
                    subcategory: String(manageothertaskEdit.subcategory),
                    total: String(manageothertaskEdit.total),
                    date: String(manageothertaskEdit.date),
                    time: String(manageothertaskEdit.time),
                    assignedby: String(manageothertaskEdit.assignedby),
                    assignedmode: String(manageothertaskEdit.assignedmode),
                    ticket: String(manageothertaskEdit.ticket),
                    document: [...documentFilesEdit],
                    documentstext: TextEditorEdit,
                    duedate: String(manageothertaskEdit.duedate),
                    duetime: String(manageothertaskEdit.duetime),
                    estimation: String(manageothertaskEdit.estimation),
                    estimationtime: String(manageothertaskEdit.estimationtime),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchEmployee();
            // fetchMangeothertaskArray();
            handleCloseModEdit();
        } catch (err) {
            if (err.response.data && err.response.data.message) {
                setPopupContentMalert(err.response.data.message);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {

                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchManageothertaskAll();
        const isNameMatch = resdata.some(
            (item) =>
                item.project === manageothertaskEdit.project &&
                item.category === manageothertaskEdit.category &&
                item.subcategory === manageothertaskEdit.subcategory &&
                item.date === manageothertaskEdit.date &&
                item.time === manageothertaskEdit.time &&
                item.duedate === manageothertaskEdit.duedate &&
                item.duetime === manageothertaskEdit.duetime &&
                item.estimation === manageothertaskEdit.estimation &&
                item.estimationtime === manageothertaskEdit.estimationtime &&
                item.assignedby === manageothertaskEdit.assignedby &&
                item.assignedmode === manageothertaskEdit.assignedmode &&
                item.total?.toLowerCase() === manageothertaskEdit.total?.toLowerCase()
            // && item.ticket == manageothertaskEdit.ticket
        );
        if (manageothertaskEdit.project === "Please Select Project") {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (manageothertaskEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            manageothertaskEdit.subcategory === "Please Select SubCategory"
        ) {
            setPopupContentMalert("Please Select SubCategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (manageothertaskEdit.total === "") {
            setPopupContentMalert("Please Enter Total");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (manageothertaskEdit.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (manageothertaskEdit.time === "") {

            setPopupContentMalert("Please Enter Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (manageothertaskEdit.assignedby === "Please Select Assigned by") {

            setPopupContentMalert("Please Select Assigned by");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            manageothertaskEdit.assignedmode === "Please Select Assigned Mode"
        ) {

            setPopupContentMalert("Please Select Assigned Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            manageothertaskEdit.assignedmode === "Please Select Assigned Mode"
        ) {
            setPopupContentMalert("Please Select Assigned Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageothertaskEdit.estimation === "Please Select Estimation") {
            setPopupContentMalert("Please Select Estimation");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            manageothertaskEdit.estimation != "Immediate" &&
            manageothertaskEdit.estimationtime === ""
        ) {
            setPopupContentMalert("Please Select Estimation Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            manageothertaskEdit.estimationtime <= 0 &&
            manageothertaskEdit.estimation == "Hours"
        ) {
            setPopupContentMalert("Please Enter a Valid Estimation ");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            manageothertaskEdit.estimationtime <= 0 &&
            manageothertaskEdit.estimation == "Minutes"
        ) {
            setPopupContentMalert("Please Enter a Valid Estimation ");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            manageothertaskEdit.estimationtime <= 0 &&
            manageothertaskEdit.estimation == "Days"
        ) {
            setPopupContentMalert("Please Enter a Valid Estimation ");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        } else {
            sendEditRequest();
        }
    };

    const [manageothertasksArray, setManageothertasksArray] = useState([])

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchEmployee = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.ALL_OTHERTASK_SORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                project: valueProjectAdd,
                category: valueCategoryAdd,
                subcategory: valueSubCategoryAdd,
                assignedby: valueAssignedbyAdd,
                assignedmode: valueAssignedModeAdd,
                fromdate:  valueProjectAdd?.length > 0 ? manageothertask.fromdate : "" ,
                todate: valueProjectAdd?.length > 0 ? manageothertask.todate : "",
                month: valueMonthAdd,
                year: valueYearAdd
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                date: moment(item.date).format("DD-MM-YYYY")
            }));

            setManageothertasksArray(itemsWithSerialNumber.map((t, index) => ({
                ...t,
                Sno: index + 1,
                project: t.project,
                category: t.category,
                subcategory: t.subcategory,
                total: t.total,
                date: moment(t.date).format("DD-MM-YYYY"),
                time: moment(
                    `${new Date().toDateString()} ${t.time}`,
                    "ddd MMM DD YYYY HH:mm"
                ).format("hh:mm:ss A"),

                duedate: moment(t.duedate).format("DD-MM-YYYY"),
                duetime: moment(
                    `${new Date().toDateString()} ${t.duetime}`,
                    "ddd MMM DD YYYY HH:mm"
                ).format("hh:mm:ss A"),
                estimation: t.estimation,
                estimationtime: t.estimationtime,
            })))
            setOverallFilterdata(itemsWithSerialNumber)

            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchEmployee();
        // fetchMangeothertaskArray();
    }, [page, pageSize, searchQuery]);

    //get all data.
    const fetchManageothertaskAll = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.get(SERVICE.MANAGEOTHERTASK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            return res_status?.data?.manageothertasks.filter(
                (item) => item._id !== manageothertaskEdit._id
            )
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Manage Other Task.png");
                });
            });
        }
    };



    // Excel
    const fileName = "Manage Other Task";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Manageothertask",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = manageothertasks?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
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
        // setPage(1);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = overallFilterdata?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
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
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredDatas.length
                        );
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 70,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 120,
            hide: !columnVisibility.project,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 150,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },
        {
            field: "total",
            headerName: "Total",
            flex: 0,
            width: 80,
            hide: !columnVisibility.total,
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
            field: "time",
            headerName: "Time",
            flex: 0,
            width: 100,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },
        {
            field: "assignedby",
            headerName: "Assignedb By",
            flex: 0,
            width: 120,
            hide: !columnVisibility.assignedby,
            headerClassName: "bold-header",
        },
        {
            field: "assignedmode",
            headerName: "Assigned Mode",
            flex: 0,
            width: 120,
            hide: !columnVisibility.assignedmode,
            headerClassName: "bold-header",
        },
        {
            field: "ticket",
            headerName: "Ticket",
            flex: 0,
            width: 100,
            hide: !columnVisibility.ticket,
            headerClassName: "bold-header",
        },
        {
            field: "duedate",
            headerName: "Due Date",
            flex: 0,
            width: 120,
            hide: !columnVisibility.duedate,
            headerClassName: "bold-header",
        },
        {
            field: "duetime",
            headerName: "Due Time",
            flex: 0,
            width: 120,
            hide: !columnVisibility.duetime,
            headerClassName: "bold-header",
        },
        {
            field: "estimation",
            headerName: "Estimation",
            flex: 0,
            width: 120,
            hide: !columnVisibility.estimation,
            headerClassName: "bold-header",
        },
        {
            field: "estimationtime",
            headerName: "Estimation Time",
            flex: 0,
            width: 120,
            hide: !columnVisibility.estimationtime,
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
                    {isUserRoleCompare?.includes("eothertasklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dothertasklist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vothertasklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iothertasklist") && (
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

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            project: item.project,
            category: item.category,
            subcategory: item.subcategory,
            total: item.total,
            // date: item.date,
            date: item.date,
            time: moment(
                `${new Date().toDateString()} ${item.time}`,
                "ddd MMM DD YYYY HH:mm"
            ).format("hh:mm:ss A"),
            assignedby: item.assignedby,
            assignedmode: item.assignedmode,
            ticket: item.ticket,
            duedate: moment(item.duedate).format("DD-MM-YYYY"),
            duetime: moment(
                `${new Date().toDateString()} ${item.duetime}`,
                "ddd MMM DD YYYY HH:mm"
            ).format("hh:mm:ss A"),
            estimation: item.estimation,
            estimationtime: item.estimationtime,
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

    useEffect(() => {
        addSerialNumber();
    }, [manageothertasks]);

    const delAccountcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.MANAGEOTHERTASK_SINGLE}/${item}`, {
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

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleCloseAddalert = () => {
        setIsAddOpenalert(false);
    };

    const handleCloseUpdatealert = () => {
        setIsUpdateOpenalert(false);
    };

    const estimateopt = [
        { label: "Minutes", value: "Minutes" },
        { label: "Hours", value: "Hours" },
        { label: "Days", value: "Days" },
        // { label: "Immediate", value: "Immediate" },
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



    let exportColumnNames = ["Project", "Category", " Sub Category", "Total", "Date", "Time", "Assignedby", "Assignedmode", "Ticket", "Duedate", "Duetime", "Estimation", "Estimationtime"];
    let exportRowValues = ["project", "category", "subcategory", "total", "date", "time", "assignedby", "assignedmode", "ticket", "duedate", "duetime", "estimation", "estimationtime"];

    const handleChangemrateedit = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setManageothertaskEdit({ ...manageothertaskEdit, mrate: inputValue });
        }
    };

    const datemonthOption = [{ value: "Date", label: "Date" }, { label: "Month", value: "Month" }]


    return (
        <Box>
            <Headtitle title={"Other Task"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Manage Other Task</Typography> */}
            <PageHeading
                title="Other Task"
                modulename="Other Tasks"
                submodulename="Other Task List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />

            {!statusCheck ? (
                <Box sx={userStyle.container}>
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
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("aothertasklist") && (
                        <Box sx={userStyle.selectcontainer}>
                            <>

                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Project <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                maxMenuHeight={300}
                                                options={projectOpt}
                                                value={selectedProject}
                                                valueRenderer={customValueRendererProjectAdd}
                                                onChange={handleProjectChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category
                                            </Typography>
                                            <MultiSelect
                                                maxMenuHeight={300}
                                                options={categoryOption}
                                                value={selectedCategory}
                                                valueRenderer={customValueRendererCategoryAdd}
                                                onChange={handleCategoryChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category
                                            </Typography>
                                            <MultiSelect
                                                maxMenuHeight={300}
                                                options={subcategoryOption}
                                                value={selectedSubCategory}
                                                valueRenderer={customValueRendererSubCategoryAdd}
                                                onChange={handleSubCategoryChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Assigned By
                                            </Typography>
                                            <MultiSelect
                                                maxMenuHeight={300}
                                                options={assignedbyOpt}
                                                value={selectedAssignedBy}
                                                valueRenderer={customValueRendererAssignedbyAdd}
                                                onChange={handleAssignedbyChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Assigned Mode
                                            </Typography>
                                            <MultiSelect
                                                maxMenuHeight={300}
                                                options={assignedmodeOpt}
                                                value={selectedAssignedMode}
                                                valueRenderer={customValueRendererAssignedModeAdd}
                                                onChange={handleAssignedModeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Date/Month
                                            </Typography>
                                            <Selects
                                                options={datemonthOption}
                                                styles={colourStyles}
                                                value={{
                                                    label: manageothertask.datemonth,
                                                    value: manageothertask.datemonth,
                                                }}
                                                onChange={(e) => {
                                                    setManageothertask({
                                                        ...manageothertask,
                                                        datemonth: e.value,
                                                    });
                                                    if(e.value === "Month"){
                                                        setManageothertask({
                                                            ...manageothertask,
                                                            datemonth: e.value,
                                                            fromdate: "",
                                                            todate: "",                                                    
                                                        }); 
                                                    }else{
                                                        setselectedMonth([])
                                                        setValueMonthAdd([])
                                                        setSelectedYear([])
                                                        setValueYearAdd([])
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {manageothertask.datemonth === "Date" ?
                                        <>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        From Date
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={manageothertask.fromdate}
                                                        onChange={(e) => {
                                                            const newFromDate = e.target.value;
                                                            setManageothertask((prevState) => ({
                                                                ...prevState,
                                                                fromdate: newFromDate,
                                                                todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                            }));
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        To Date
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={manageothertask.todate}
                                                        onChange={(e) => {
                                                            const selectedToDate = new Date(e.target.value);
                                                            const selectedFromDate = new Date(manageothertask.fromdate);
                                                            const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                                            if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                                setManageothertask({
                                                                    ...manageothertask,
                                                                    todate: e.target.value
                                                                });
                                                            } else {
                                                                setManageothertask({
                                                                    ...manageothertask,
                                                                    todate: "" // Reset to empty string if the condition fails
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </> :
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Month
                                                    </Typography>
                                                    <MultiSelect
                                                        maxMenuHeight={300}
                                                        options={selectedMontOpt?.map((item) => ({
                                                            value: item.value,
                                                            label: item.value,
                                                        }))}
                                                        value={selectedMonth}
                                                        valueRenderer={customValueRendererMonthAdd}
                                                        onChange={handleMonthAdd}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Year
                                                    </Typography>
                                                    <MultiSelect
                                                        maxMenuHeight={300}
                                                        options={years?.map((item) => ({
                                                            value: item.value,
                                                            label: item.label,
                                                        }))}
                                                        value={selectedYear}
                                                        valueRenderer={customValueRendererYearAdd}
                                                        onChange={handleYearAdd}

                                                    // value={{ label: selectedYear, value: selectedYear }}
                                                    // valueRenderer={customValueRendererYearAdd}
                                                    // onChange={handleYearChange}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    }

                                </Grid>

                                <br />
                                <br />
                                <Grid item md={12} sm={12} xs={12}>
                                    <br />
                                    <br />
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button variant="contained" onClick={(e)=>{
                                            handleSubmit(e)
                                        }} disabled={isBtn}>
                                            Filter
                                        </Button>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    )}
                    <br />
                </>
            )}

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lothertasklist") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Other Task List
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
                                        {/* <MenuItem value={manageothertasks?.length}>All</MenuItem> */}
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
                                    {isUserRoleCompare?.includes("excelothertasklist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvothertasklist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printothertasklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfothertasklist") && (
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
                                    {isUserRoleCompare?.includes("imageothertasklist") && (
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
                                <Box>
                                    <FormControl fullWidth size="small">
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {isUserRoleCompare?.includes("bdothertasklist") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                        <Box>
                            <Pagination
                                page={page}
                                pageSize={pageSize}
                                totalPages={searchQuery !== "" ? 1 : totalPages}
                                onPageChange={handlePageChange}
                                pageItemLength={filteredDatas?.length}
                                totalProjects={
                                    searchQuery !== "" ? filteredDatas?.length : totalProjects
                                }
                            />
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











            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ padding: "30px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Other Task</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{manageothertaskEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{manageothertaskEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Catgeory</Typography>
                                    <Typography>{manageothertaskEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Total</Typography>
                                    <Typography>{manageothertaskEdit.total}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Date</Typography>
                                    <Typography>
                                        {moment(manageothertaskEdit.date).format("DD-MM-YYYY")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Time</Typography>
                                    <Typography>
                                        {moment(
                                            `${new Date().toDateString()} ${manageothertaskEdit.time
                                            }`,
                                            "ddd MMM DD YYYY HH:mm"
                                        ).format("hh:mm:ss A")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Assigned by</Typography>
                                    <Typography>{manageothertaskEdit.assignedby}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Assigned Mode</Typography>
                                    <Typography>{manageothertaskEdit.assignedmode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Ticket</Typography>
                                    <Typography>{manageothertaskEdit.ticket}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Due Date</Typography>
                                    <Typography>
                                        {moment(manageothertaskEdit.duedate).format("DD-MM-YYYY")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Due Time</Typography>
                                    <Typography>
                                        {moment(
                                            `${new Date().toDateString()} ${manageothertaskEdit.duetime
                                            }`,
                                            "ddd MMM DD YYYY HH:mm"
                                        ).format("hh:mm:ss A")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Estimation</Typography>
                                    <Typography>{manageothertaskEdit.estimation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Estimation Time</Typography>
                                    <Typography>{manageothertaskEdit.estimationtime}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Documents</Typography>
                                    <Typography>
                                        {convertToNumberedList(manageothertaskEdit.documentstext)}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Documents Upload</Typography>
                                    <Typography>
                                        {manageothertaskEdit?.document?.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} md={8} sm={10} xs={6}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => renderFilePreviewEdit(file)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                >
                    <Box sx={{ padding: "30px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Other Task{" "}
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Projcet<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: manageothertaskEdit.project,
                                                value: manageothertaskEdit.project,
                                            }}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    project: e.value,

                                                    category: "Please Select Category",
                                                    subcategory: "Please Select SubCategory",
                                                });
                                                setSubcategoryOptionEdit([]);
                                                fetchCategoryDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: manageothertaskEdit.category,
                                                value: manageothertaskEdit.category,
                                            }}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    category: e.value,
                                                    subcategory: "Please Select SubCategory",
                                                });
                                                fetchSubcategoryDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategoryOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: manageothertaskEdit.subcategory,
                                                value: manageothertaskEdit.subcategory,
                                            }}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    subcategory: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Total <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Total"
                                            value={manageothertaskEdit.total}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    total: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <Grid container sx={{ display: "flex" }}>
                                        <Grid item md={6} sm={3} xs={3}>
                                            <Typography>
                                                Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={manageothertaskEdit.date}
                                                    onChange={(e) => {
                                                        setManageothertaskEdit({
                                                            ...manageothertaskEdit,
                                                            date: e.target.value,
                                                            estimation: "Please Select Estimation",
                                                            estimationtime: "",
                                                            duedate: "",
                                                            duetime: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={9} xs={9}>
                                            <Typography>
                                                Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    value={manageothertaskEdit.time}
                                                    onChange={(e) => {
                                                        setManageothertaskEdit({
                                                            ...manageothertaskEdit,
                                                            time: e.target.value,
                                                            estimation: "Please Select Estimation",
                                                            estimationtime: "",
                                                            duedate: "",
                                                            duetime: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Assigned by <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={assignedbyOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: manageothertaskEdit.assignedby,
                                                value: manageothertaskEdit.assignedby,
                                            }}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    assignedby: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Assigned Mode <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={assignedmodeOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: manageothertaskEdit.assignedmode,
                                                value: manageothertaskEdit.assignedmode,
                                            }}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    assignedmode: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Ticket</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Ticket"
                                            value={manageothertaskEdit.ticket}
                                            onChange={(e) => {
                                                setManageothertaskEdit({
                                                    ...manageothertaskEdit,
                                                    ticket: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Estimation <b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <Selects
                                        options={estimateopt}
                                        styles={colourStyles}
                                        value={{
                                            label: manageothertaskEdit.estimation,
                                            value: manageothertaskEdit.estimation,
                                        }}
                                        onChange={(e) => {
                                            handleEstimationChangeEdit(e.value);
                                        }}
                                    />
                                </Grid>
                                <br />
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Estimation Time <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Enter Time"
                                            value={manageothertaskEdit.estimationtime}
                                            onChange={(e) => {
                                                handleEstimationTimeChangeEdit(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <Grid container sx={{ display: "flex" }}>
                                        <Grid item md={6} sm={3} xs={3}>
                                            <Typography>
                                                Due Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={manageothertaskEdit.duedate}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={9} xs={9}>
                                            <Typography>
                                                Due Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    value={manageothertaskEdit.duetime}
                                                    readOnly
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={6} md={5} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            <b> Documents </b>{" "}
                                        </Typography>
                                        <br />
                                        <ReactQuill
                                            style={{ height: "auto" }}
                                            value={TextEditorEdit}
                                            onChange={(e) => {
                                                handleTextSummaryEdit(e);
                                            }}
                                            modules={{
                                                toolbar: [
                                                    [{ header: "1" }, { header: "2" }, { font: [] }],
                                                    [{ size: [] }],
                                                    [
                                                        "bold",
                                                        "italic",
                                                        "underline",
                                                        "strike",
                                                        "blockquote",
                                                    ],
                                                    [
                                                        { list: "ordered" },
                                                        { list: "bullet" },
                                                        { indent: "-1" },
                                                        { indent: "+1" },
                                                    ],
                                                    ["link", "image", "video"],
                                                    ["clean"],
                                                ],
                                            }}
                                            formats={[
                                                "header",
                                                "font",
                                                "size",
                                                "bold",
                                                "italic",
                                                "underline",
                                                "strike",
                                                "blockquote",
                                                "list",
                                                "bullet",
                                                "indent",
                                                "link",
                                                "image",
                                                "video",
                                            ]}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={0.5} md={0.5} sm={12} xs={12}>
                                    {/* <Typography sx={{ marginTop: '93px' }}><b>(or)</b></Typography> */}
                                </Grid>
                                <Grid item lg={4.5} md={2.5} sm={12} xs={12}>
                                    <Typography>
                                        <b>Upload Document</b>
                                    </Typography>
                                    <Grid>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component="label"
                                            sx={{
                                                "@media only screen and (max-width:550px)": {
                                                    marginY: "5px",
                                                },
                                                marginTop: "15px",
                                            }}
                                        >
                                            Upload
                                            <input
                                                multiple
                                                type="file"
                                                id="resume"
                                                accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                                name="file"
                                                hidden
                                                onChange={(e) => {
                                                    handleResumeUploadEdit(e);
                                                    setTextEditor("");
                                                }}
                                            />
                                        </Button>
                                        <br />
                                        <br />
                                        {documentFilesEdit?.length > 0 &&
                                            documentFilesEdit.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={6} md={8} sm={10} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <VisibilityOutlinedIcon
                                                                style={{
                                                                    fontsize: "large",
                                                                    color: "#357AE8",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => renderFilePreviewEdit(file)}
                                                            />
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <Button
                                                                style={{
                                                                    fontsize: "large",
                                                                    color: "#357AE8",
                                                                    cursor: "pointer",
                                                                    marginTop: "-5px",
                                                                }}
                                                                onClick={() => handleFileDeleteEdit(index)}
                                                            >
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
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
                itemsTwo={manageothertasksArray ?? []}
                filename={"Manage Other Task"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Manage Other Task Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delHoliday}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAccountcheckbox}
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
    );
}
export default OthertaskList;