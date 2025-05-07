import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
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
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    OutlinedInput,
    InputAdornment,
    Tooltip,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import domtoimage from "dom-to-image";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    FaFileCsv,
    FaFileExcel,
    FaFilePdf,
    FaPrint,
    FaSearch,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";

function CheckListVerificationMaster() {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    let exportColumnNames = [
        "Category",
        "Subcategory",
        "ChecklistType",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Responsible Person",
    ];
    let exportRowValues = [
        "categoryname",
        "subcategoryname",
        "checklisttype",
        "company",
        "branch",
        "unit",
        "team",
        "employee",
    ];

    const [totalDatas, setTotalDatas] = useState(0);

    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = [
        "Contains",
        "Does Not Contain",
        "Equals",
        "Does Not Equal",
        "Begins With",
        "Ends With",
        "Blank",
        "Not Blank",
    ]; // AgGrid-like conditions

    // Search bar
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
    const idSearch = openSearch ? "simple-popover" : undefined;

    const handleAddFilter = () => {
        if (
            (selectedColumn && filterValue) ||
            ["Blank", "Not Blank"].includes(selectedCondition)
        ) {
            setAdditionalFilters([
                ...additionalFilters,
                {
                    column: selectedColumn,
                    condition: selectedCondition,
                    value: filterValue,
                },
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter
                .map((filter, index) => {
                    let showname = columnDataTable.find(
                        (col) => col.field === filter.column
                    )?.headerName;
                    return `${showname} ${filter.condition} "${filter.value}"`;
                })
                .join(
                    " " +
                    (advancedFilter.length > 1 ? advancedFilter[1].condition : "") +
                    " "
                );
        }
        return searchQuery;
    };

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    const pathname = window.location.pathname;
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setBtnSubmit(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [searchedString, setSearchedString] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setBtnSubmit(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Assign checklist"),
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

    useEffect(() => {
        getapi();
    }, []);

    const [gridApi, setGridApi] = useState(null);
    // const [filteredRowData, setFilteredRowData] = useState([]);
    const [columnApi, setColumnApi] = useState(null);
    const columnMoveRef = useRef(0);
    const columnMoveLimit = 3;

    useEffect(() => {
        const pinnedLeft = document.querySelector(".ag-pinned-left");
        const bodyViewport = document.querySelector(".ag-body-viewport");

        if (pinnedLeft && bodyViewport) {
            // Sync horizontal scroll between pinned and body viewports
            pinnedLeft.addEventListener("scroll", () => {
                bodyViewport.scrollLeft = pinnedLeft.scrollLeft;
            });

            bodyViewport.addEventListener("scroll", () => {
                pinnedLeft.scrollLeft = bodyViewport.scrollLeft;
            });
        }

        // Clean up the event listeners
        return () => {
            if (pinnedLeft && bodyViewport) {
                pinnedLeft.removeEventListener("scroll", () => { });
                bodyViewport.removeEventListener("scroll", () => { });
            }
        };
    }, []);

    const [checklistverification, setChecklistverification] = useState({
        categoryname: "Please Select Category",
        subcategoryname: "Please Select Subcategory",
        checklisttype: "Please Select Checklist Type",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Responsible Person",
    });

    const [checklistverificationEdit, setChecklistverificationEdit] = useState({
        categoryname: "Please Select Category",
        subcategoryname: "Please Select Subcategory",
        checklisttype: "Please Select Checklist Type",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Responsible Person",
    });

    const [isBtn, setIsBtn] = useState(false);
    const [checklistverificationmasters, setChecklistverificationmasters] =
        useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allChecklistverificationEdit, setAllChecklistverificationEdit] =
        useState([]);
    const [checklistverificationCheck, setChecklistverificationCheck] =
        useState(false);

    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        allTeam,
        allUsersData,
        pageName,
        setPageName,
        buttonStyles,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

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
                    data?.subsubpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
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

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage
                .toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Assign Checklist.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

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
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
    const [isHandleChange, setIsHandleChange] = useState(false);

    const handleClickOpenalert = () => {
        handleCloseerr();
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            // setIsDeleteOpencheckbox(true);
            checkUsedByOtherBulk();
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

    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [checklisttypesOpt, setChecklisttypesOpt] = useState([]);
    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([]);
    const [checklisttypesOptEdit, setChecklisttypesOptEdit] = useState([]);

    // This is create multi select
    // checklistType
    const [selectedOptionsChecklisttype, setSelectedOptionsChecklisttype] =
        useState([]);
    let [valueChecklisttype, setValueChecklisttype] = useState("");

    const handleChecklisttypeChange = (options) => {
        setValueChecklisttype(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsChecklisttype(options);
    };

    const customValueRendererChecklisttype = (
        valueChecklisttype,
        _checklisttypes
    ) => {
        return valueChecklisttype.length
            ? valueChecklisttype.map(({ label }) => label).join(", ")
            : "Please Select Checklist Type";
    };

    // company
    const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
    let [valueComp, setValueComp] = useState("");

    const handleCompanyChange = (options) => {
        setValueComp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCom(options);
    };

    const customValueRendererCom = (valueComp, _companys) => {
        return valueComp.length
            ? valueComp.map(({ label }) => label).join(", ")
            : "Please Select Company";
    };

    // branch
    const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
    let [valueBran, setValueBran] = useState("");

    const handleBranchChange = (options) => {
        setValueBran(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBran(options);
    };

    const customValueRendererBran = (valueBran, _branchs) => {
        return valueBran.length
            ? valueBran.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    // unit
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnit, setValueUnit] = useState("");

    const handleUnitChange = (options) => {
        setValueUnit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
    };

    const customValueRendererUnit = (valueUnit, _units) => {
        return valueUnit.length
            ? valueUnit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
    };

    // team
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeam, setValueTeam] = useState("");

    const handleTeamChange = (options) => {
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        let ans = options.map((a, index) => {
            return a.value;
        });
        setSelectedOptionsTeam(options);
    };

    const customValueRendererTeam = (valueTeam, _teams) => {
        return valueTeam.length
            ? valueTeam.map(({ label }) => label).join(", ")
            : "Please Select Team";
    };

    // Employee
    const [selectedOptionsEmp, setSelectedOptionsEmp] = useState([]);
    let [valueEmp, setValueEmp] = useState("");

    const handleEmployeeChange = (options) => {
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmp(options);
    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Responsible Person";
    };

    // Edit details
    // checklistType
    const [
        selectedOptionsChecklisttypeEdit,
        setSelectedOptionsChecklisttypeEdit,
    ] = useState([]);

    const handleChecklisttypeChangeEdit = (options) => {
        setSelectedOptionsChecklisttypeEdit(options);
    };

    const customValueRendererChecklisttypeEdit = (
        valueChecklisttypeEdit,
        _checklisttypes
    ) => {
        return valueChecklisttypeEdit.length
            ? valueChecklisttypeEdit.map(({ label }) => label).join(", ")
            : "Please Select Checklist Type";
    };

    // company
    const [selectedOptionsComEdit, setSelectedOptionsComEdit] = useState([]);
    const handleCompanyChangeEdit = (options) => {
        setSelectedOptionsComEdit(options);
    };

    const customValueRendererComEdit = (valueCompEdit, _companys) => {
        return valueCompEdit.length
            ? valueCompEdit.map(({ label }) => label).join(", ")
            : "Please Select Company";
    };

    // branch
    const [selectedOptionsBranEdit, setSelectedOptionsBranEdit] = useState([]);
    let [valueBranEdit, setValueBranEdit] = useState("");

    const handleBranchChangeEdit = (options) => {
        setValueBranEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranEdit(options);
    };

    const customValueRendererBranEdit = (valueBranEdit, _branchs) => {
        return valueBranEdit.length
            ? valueBranEdit.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    // unit
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitEdit, setValueUnitEdit] = useState("");

    const handleUnitChangeEdit = (options) => {
        setValueUnitEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        const ans = options.map((a, index) => {
            return a.value;
        });
        setSelectedOptionsUnitEdit(options);
    };

    const customValueRendererUnitEdit = (valueUnitEdit, _units) => {
        return valueUnitEdit.length
            ? valueUnitEdit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
    };

    // Team
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);

    const handleTeamChangeEdit = (options) => {
        const ans = options.map((a, index) => {
            return a.value;
        });
        setSelectedOptionsTeamEdit(options);
    };

    const customValueRendererTeamEdit = (valueTeamEdit, _teams) => {
        return valueTeamEdit.length
            ? valueTeamEdit.map(({ label }) => label).join(", ")
            : "Please Select Team";
    };

    // Employee
    const [selectedOptionsEmpEdit, setSelectedOptionsEmpEdit] = useState([]);
    const handleEmployeeChangeEdit = (options) => {
        setSelectedOptionsEmpEdit(options);
    };

    const customValueRendererEmpEdit = (valueEmpEdit, _employees) => {
        return valueEmpEdit.length
            ? valueEmpEdit.map(({ label }) => label).join(", ")
            : "Please Select Responsible Person";
    };

    // dropdown values showing data
    const fetchCategroyDropdowns = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let category = res_category?.data?.checklistcategory;
            const categoryall = [
                ...category.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                })),
            ];

            setCategorys(categoryall);
            setCategorysEdit(categoryall);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const fetchSubcategory = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let category = res_category?.data?.checklistcategory
                .filter((data) => {
                    return data.categoryname == e.value;
                })
                .map((item) => item.subcategoryname)
                .flat()
                .map((itemNew) => ({
                    label: itemNew,
                    value: itemNew,
                }));
            setSubcategorys(category);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const fetchSubcategoryEdit = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let category = res_category?.data?.checklistcategory
                .filter((data) => {
                    return data.categoryname == e.value;
                })
                .map((item) => item.subcategoryname)
                .flat()
                .map((itemNew) => ({
                    label: itemNew,
                    value: itemNew,
                }));

            setSubcategorysEdit(category);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const fetchChecklisttypeDropdowns = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTTYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_category.data.checklisttypes.filter(
                (d) =>
                    d.category === checklistverification.categoryname &&
                    d.subcategory === e.value
            );
            const uniqueChecklists = new Set(result.map((d) => d.details));
            const all = Array.from(uniqueChecklists).map((details) => ({
                label: details,
                value: details,
            }));

            setChecklisttypesOpt(all);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const fetchChecklisttypeDropdownsEdit = async (category, subcategory) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTTYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_category.data.checklisttypes.filter(
                (d) => d.category === category && d.subcategory === subcategory
            );

            const uniqueChecklists = new Set(result.map((d) => d.details));

            const all = Array.from(uniqueChecklists).map((details) => ({
                label: details,
                value: details,
            }));

            setChecklisttypesOptEdit(all);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    useEffect(() => {
        fetchCategroyDropdowns();
    }, []);

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
        categoryname: true,
        subcategoryname: true,
        checklisttype: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteGroup, setDeletegroup] = useState("");

    const checkUsedByOtherBulk = async () => {
        let collectedDatas = selectedRows
            .map((item) => {
                return rowDataTable.find((data) => data.id === item);
            })
            .map((item) => {
                return {
                    category: item.categoryname,
                    subcategory: item.subcategoryname,
                    checklisttype: item.checklisttype,
                    employee: item.employee,
                    id: item.id,
                };
            });
        try {
            let res = await axios.post(SERVICE.CHECKLISTASSIGNCHECKWITHMYCHECKLIST, {
                combinedData: collectedDatas,
            });
            const uniqueData = Array.from(
                new Map(
                    res?.data?.matchedConditions?.map((item) => [item?.id, item])
                ).values()
            );
            if (res.data.exists) {
                if (uniqueData.length === selectedRows.length) {
                    setPopupContentMalert(`All the Selected ${res.data.popupMessage}`);
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } else {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                            />
                            <p
                                style={{ fontSize: "20px", fontWeight: 900 }}
                            >{`Some Assigned Checklist Linked to Mychecklist!`}</p>
                        </>
                    );
                    handleClickOpenerr();
                }
                setSelectedRows((prev) => {
                    return prev.filter(
                        (item) =>
                            !res.data.matchedConditions.some((data) => data.id === item)
                    );
                });
            } else {
                setIsDeleteOpencheckbox(true);
            }
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const checkUsedByOther = async (data, id, name) => {
        let combinedData = [
            {
                category: data.categoryname,
                subcategory: data.subcategoryname,
                checklisttype: data.checklisttype,
                employee: data.employee,
                id: data.id,
            },
        ];

        try {
            let res = await axios.post(SERVICE.CHECKLISTASSIGNCHECKWITHMYCHECKLIST, {
                combinedData,
            });
            if (res.data.exists) {
                setPopupContentMalert("Assigned Checklist Linked to Mychecklist!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                rowData(id, name);
            }
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setDeletegroup(res?.data?.schecklistverificationmaster);
            handleClickOpen();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    // Alert delete popup
    let groupEditt = deleteGroup._id;
    const deleGroup = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(
                `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${groupEditt}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchChecklistverification();
            handleCloseMod();
            // setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const delGroupcheckbox = async () => {
        handleCloseerr();
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(
                    `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${item}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);

            // setPage(1);

            setIsHandleChange(false);

            await fetchChecklistverification();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //add function
    const sendRequest = async () => {
        setIsBtn(true);
        setPageName(!pageName);
        try {
            let grpcreate = await axios.post(
                SERVICE.CHECKLISTVERIFICATIONMASTER_CREATE,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    categoryname: String(checklistverification.categoryname),
                    subcategoryname: String(checklistverification.subcategoryname),
                    checklisttype: [...valueChecklisttype],
                    company: [...valueComp],
                    branch: [...valueBran],
                    unit: [...valueUnit],
                    team: [...valueTeam],
                    employee: [...valueEmp],

                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            setChecklistverification(grpcreate.data);
            await fetchChecklistverification();
            setChecklistverification({
                ...checklistverification,
            });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
            setBtnSubmit(false);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const [btnSubmit, setBtnSubmit] = useState(false);
    //submit option for saving
    const handleSubmit = (e) => {
        setBtnSubmit(true);
        let companys = selectedOptionsCom.map((item) => item.value);
        let branchs = selectedOptionsBran.map((item) => item.value);
        let units = selectedOptionsUnit.map((item) => item.value);
        let teams = selectedOptionsTeam.map((item) => item.value);
        let employees = selectedOptionsEmp.map((item) => item.value);
        let checklisttypes = selectedOptionsChecklisttype.map((item) => item.value);
        e.preventDefault();
        const isNameMatch = checklistverificationmasters.some(
            (item) =>
                item.categoryname === checklistverification.categoryname &&
                item.subcategoryname === checklistverification.subcategoryname &&
                item.checklisttype.some((data) => checklisttypes.includes(data)) &&
                item.company.some((data) => companys.includes(data)) &&
                item.branch.some((data) => branchs.includes(data)) &&
                item.unit.some((data) => units.includes(data)) &&
                item.team.some((data) => teams.includes(data)) &&
                item.employee.some((data) => employees.includes(data))
        );
        if (checklistverification.categoryname === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            checklistverification.subcategoryname === "Please Select Subcategory"
        ) {
            setPopupContentMalert("Please Select Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsChecklisttype.length == 0) {
            setPopupContentMalert("Please Select Checklist Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCom.length == 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsBran.length == 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsUnit.length == 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsTeam.length == 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsEmp.length == 0) {
            setPopupContentMalert("Please Select Responsible Person");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data already exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSearchQuery("");
            sendRequest();
        }
    };

    const handleClear = () => {
        setChecklistverification({
            categoryname: "Please Select Category",
            subcategoryname: "Please Select Subcategory",
            checklisttype: "Please Select Checklist Type",
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            employee: "Please Select Responsible Person",
        });
        setValueComp([]);
        setValueBran([]);
        setValueUnit([]);
        setValueTeam([]);
        setValueEmp([]);
        setValueChecklisttype([]);
        setSelectedOptionsCom([]);
        setSelectedOptionsBran([]);
        setSelectedOptionsUnit([]);
        setSelectedOptionsTeam([]);
        setSelectedOptionsEmp([]);
        setSelectedOptionsChecklisttype([]);
        setChecklisttypesOpt([]);
        setSubcategorys([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("");
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
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
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            handleClickOpenEdit();
            setChecklistverificationEdit(res?.data?.schecklistverificationmaster);
            fetchSubcategoryEdit({
                label: res?.data?.schecklistverificationmaster?.categoryname,
                value: res?.data?.schecklistverificationmaster?.categoryname,
            });
            setSelectedOptionsChecklisttypeEdit(
                res?.data?.schecklistverificationmaster.checklisttype.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsComEdit(
                res?.data?.schecklistverificationmaster.company.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsBranEdit(
                res?.data?.schecklistverificationmaster.branch.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsUnitEdit(
                res?.data?.schecklistverificationmaster.unit.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsTeamEdit(
                res?.data?.schecklistverificationmaster.team.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsEmpEdit(
                res?.data?.schecklistverificationmaster.employee.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            handleClickOpenEdit();
            setValueBranEdit(res?.data?.schecklistverificationmaster.branch);
            setValueUnitEdit(res?.data?.schecklistverificationmaster.unit);
            fetchChecklisttypeDropdownsEdit(
                res?.data?.schecklistverificationmaster.categoryname,
                res?.data?.schecklistverificationmaster.subcategoryname
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setChecklistverificationEdit(res?.data?.schecklistverificationmaster);
            handleClickOpenview();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setChecklistverificationEdit(res?.data?.schecklistverificationmaster);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //Project updateby edit page...
    let updateby = checklistverificationEdit.updatedby;
    let addedby = checklistverificationEdit.addedby;

    let projectsid = checklistverificationEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let empComp = selectedOptionsComEdit.map((item) => item.value);
        let empBran = selectedOptionsBranEdit.map((item) => item.value);
        let empUnit = selectedOptionsUnitEdit.map((item) => item.value);
        let empTeam = selectedOptionsTeamEdit.map((item) => item.value);
        let empEmployee = selectedOptionsEmpEdit.map((item) => item.value);
        let empChecklist = selectedOptionsChecklisttypeEdit.map(
            (item) => item.value
        );
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${projectsid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    categoryname: String(checklistverificationEdit.categoryname),
                    subcategoryname: String(checklistverificationEdit.subcategoryname),
                    checklisttype: [...empChecklist],
                    company: [...empComp],
                    branch: [...empBran],
                    unit: [...empUnit],
                    team: [...empTeam],
                    employee: [...empEmployee],
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            setChecklistverificationEdit(res.data);
            await fetchChecklistverification();
            await fetchChecklistverificationAll();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchChecklistverificationAll();
        let companysEditt = selectedOptionsComEdit.map((item) => item.value);
        let branchsEditt = selectedOptionsBranEdit.map((item) => item.value);
        let unitsEditt = selectedOptionsUnitEdit.map((item) => item.value);
        let teamsEditt = selectedOptionsTeamEdit.map((item) => item.value);
        let employesssEditt = selectedOptionsEmpEdit.map((item) => item.value);
        let checklistEditt = selectedOptionsChecklisttypeEdit.map(
            (item) => item.value
        );
        const isNameMatch = allChecklistverificationEdit.some(
            (item) =>
                item.categoryname === checklistverificationEdit.categoryname &&
                item.subcategoryname === checklistverificationEdit.subcategoryname &&
                item.checklisttype.some((data) => checklistEditt.includes(data)) &&
                item.company.some((data) => companysEditt.includes(data)) &&
                item.branch.some((data) => branchsEditt.includes(data)) &&
                item.unit.some((data) => unitsEditt.includes(data)) &&
                item.team.some((data) => teamsEditt.includes(data)) &&
                item.employee.some((data) => employesssEditt.includes(data))
        );

        if (checklistverificationEdit.categoryname === "Please Select Type") {
            setPopupContentMalert("Please Enter Subcategory Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            checklistverificationEdit.subcategoryname === "Please Select Subcategory"
        ) {
            setPopupContentMalert("Please Select Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsChecklisttypeEdit.length == 0) {
            setPopupContentMalert("Please Select Checklist Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsComEdit.length == 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsBranEdit.length == 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsUnitEdit.length == 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsTeamEdit.length == 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsEmpEdit.length == 0) {
            setPopupContentMalert("Please Select Responsible Person");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data already exits!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };

    //get all project.
    const fetchChecklistverification = async () => {
        setPageName(!pageName);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
        };
        const allFilters = [
            ...additionalFilters,
            {
                column: selectedColumn,
                condition: selectedCondition,
                value: filterValue,
            },
        ];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters;
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }

        try {
            let res_status = await axios.post(
                SERVICE.ASSIGNEDCHECKLISTBYPAGINATION,
                queryParams,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            const ans =
                res_status?.data?.result?.length > 0 ? res_status?.data?.result : [];

            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));


            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
            setChecklistverificationmasters(itemsWithSerialNumber);

            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });
            setTimeout(() => {
                setChecklistverificationCheck(true);
            }, 1000);
        } catch (err) {
            setChecklistverificationCheck(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const handleResetSearch = async () => {
        setPageName(!pageName);

        // Reset all filters and pagination state
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
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters;
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery; // Use searchQuery for regular search
        }

        try {
            let res_status = await axios.post(
                SERVICE.ASSIGNEDCHECKLISTBYPAGINATION,
                queryParams,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            const ans =
                res_status?.data?.result?.length > 0 ? res_status?.data?.result : [];

            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));


            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
            setChecklistverificationmasters(itemsWithSerialNumber);
            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });
            setTimeout(() => {
                setChecklistverificationCheck(true);
            }, 1000);
        } catch (err) {
            setChecklistverificationCheck(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //get all project.
    const fetchChecklistverificationAll = async () => {
        setPageName(!pageName);
        try {
            let res_grp = await axios.get(SERVICE.CHECKLISTVERIFICATIONMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const overallWithSerialNumber = res_grp?.data?.checklistverificationmasters?.map(
                (item, index) => ({
                    ...item,
                    serialNumber: index + 1,
                })
            );
            setOverallItems(overallWithSerialNumber);
            setAllChecklistverificationEdit(
                res_grp?.data?.checklistverificationmasters.filter(
                    (item) => item._id !== checklistverificationEdit._id
                )
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //------------------------------------------------------

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName);
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error("Blob or FileSaver not supported");
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error("FileSaver.saveAs is not available");
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error("Error exporting to Excel", error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                Category: item.categoryname || "",

                Subcategory: item.subcategoryname || "",

                ChecklistType: item.checklisttype || "",
                Company: item.company || "",
                Branch: item.branch || "",
                Unit: item.unit || "",
                Team: item.team || "",
                "Responsible Person": item.employee || "",
            };
        });
    };


    // pdf.....
    const columns = [
        { title: "Category", field: "categoryname" },
        { title: "Subcategory", field: "subcategoryname" },
        { title: "ChecklistType", field: "checklisttype" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Responsible Person", field: "employee" },
    ];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Assign Checklist",
        pageStyle: "print",
    });


    useEffect(() => {
        fetchChecklistverificationAll();
    }, [isEditOpen, checklistverificationEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(checklistverificationmasters);
    }, [checklistverificationmasters]);

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
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

    // const [totalPages, setTotalPages] = useState(1); // Initialize with 1 or a default value
    const [page, setPage] = useState(1); // Current page
    const [pageSize, setPageSize] = useState(10); // Page size

    useEffect(() => {
        fetchChecklistverification();
    }, [page, pageSize, searchQuery]);


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
            sortable: false, // Optionally, you can make this column not sortable
            width: 100,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "categoryname",
            headerName: "Category",
            flex: 0,
            width: 150,
            hide: !columnVisibility.categoryname,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "subcategoryname",
            headerName: "Subcategory",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategoryname,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "checklisttype",
            headerName: "Checklist Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.checklisttype,
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
            field: "employee",
            headerName: "Responsible Person",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employee,
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
                    {isUserRoleCompare?.includes("eassignchecklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id, params.data.name);
                            }}
                        >
                            <EditOutlinedIcon
                                sx={buttonStyles.buttonedit}
                                style={{ fontsize: "large" }}
                            />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dassignchecklist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                checkUsedByOther(params.data, params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon
                                sx={buttonStyles.buttondelete}
                                style={{ fontsize: "large" }}
                            />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vassignchecklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon
                                style={{ fontsize: "large" }}
                                sx={buttonStyles.buttonview}
                            />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iassignchecklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon
                                style={{ fontsize: "large" }}
                                sx={buttonStyles.buttoninfo}
                            />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const filteredSelectedColumn = columnDataTable.filter(
        (data) =>
            data.field !== "checkbox" &&
            data.field !== "actions" &&
            data.field !== "serialNumber"
    );
    const rowDataTable = items.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
            checklisttype: item.checklisttype,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employee: item.employee,
        };
    });

    // const rowsWithCheckboxes = rowDataTable.map((row) => ({
    //     ...row,
    //     // Create a custom field for rendering the checkbox
    //     checkbox: selectedRows.includes(row.id),
    // }));

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
        if (!gridApi) return;

        setColumnVisibility((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Search bar
    // const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    // const handleClickSearch = (event) => {
    //   setAnchorElSearch(event.currentTarget);
    // };
    // const handleCloseSearch = () => {
    //   setAnchorElSearch(null);
    //   setSearchQuery("");
    // };

    // const openSearch = Boolean(anchorElSearch);
    // const idSearch = openSearch ? "simple-popover" : undefined;

    return (
        <Box>
            <Headtitle title={"Assign Checklist"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Assign Checklist"
                modulename="Checklist"
                submodulename="Assign Checklist"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aassignchecklist") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography
                                        sx={userStyle.importheadtext}
                                        onClick={() => {
                                            console.log(page);
                                            console.log(overallItems);
                                            console.log(totalPages);
                                        }}
                                    >
                                        Add Assign Checklist
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={categorys}
                                            value={{
                                                label: checklistverification.categoryname,
                                                value: checklistverification.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setChecklistverification({
                                                    ...checklistverification,
                                                    categoryname: e.value,
                                                    subcategoryname: "Please Select Subcategory",
                                                    checklisttype: "Please Select Checklist Type",
                                                });
                                                fetchSubcategory(e);
                                                setSelectedOptionsChecklisttype([]);
                                                setChecklisttypesOpt([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={subcategorys}
                                            value={{
                                                label: checklistverification.subcategoryname,
                                                value: checklistverification.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setChecklistverification({
                                                    ...checklistverification,
                                                    subcategoryname: e.value,
                                                    checklisttype: "Please Select Checklist Type",
                                                });
                                                fetchChecklisttypeDropdowns(e);
                                                setSelectedOptionsChecklisttype([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid
                                    item
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    sx={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Checklist Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={checklisttypesOpt}
                                            value={selectedOptionsChecklisttype}
                                            onChange={(e) => {
                                                handleChecklisttypeChange(e);
                                            }}
                                            valueRenderer={customValueRendererChecklisttype}
                                            labelledBy="Please Select Checklist Type"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid
                                    item
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    sx={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
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
                                            value={selectedOptionsCom}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                                setSelectedOptionsBran([]);
                                                setSelectedOptionsUnit([]);
                                                setSelectedOptionsTeam([]);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererCom}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    sx={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter((comp) =>
                                                    selectedOptionsCom
                                                        .map((data) => data.value)
                                                        .includes(comp.company)
                                                )
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
                                            value={selectedOptionsBran}
                                            onChange={(e) => {
                                                handleBranchChange(e);
                                                setSelectedOptionsUnit([]);
                                                setSelectedOptionsTeam([]);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererBran}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    sx={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter(
                                                    (comp) =>
                                                        selectedOptionsCom
                                                            .map((data) => data.value)
                                                            .includes(comp.company) &&
                                                        selectedOptionsBran
                                                            .map((data) => data.value)
                                                            .includes(comp.branch)
                                                )
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
                                                setSelectedOptionsTeam([]);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    sx={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={allTeam
                                                ?.filter(
                                                    (comp) =>
                                                        selectedOptionsCom
                                                            .map((data) => data.value)
                                                            .includes(comp.company) &&
                                                        selectedOptionsBran
                                                            .map((data) => data.value)
                                                            .includes(comp.branch) &&
                                                        selectedOptionsUnit
                                                            .map((data) => data.value)
                                                            .includes(comp.unit)
                                                )
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
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    sx={{ display: "flex", flexDirection: "row" }}
                                >
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Responsible Person<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={allUsersData
                                                ?.filter(
                                                    (comp) =>
                                                        selectedOptionsCom
                                                            .map((data) => data.value)
                                                            .includes(comp.company) &&
                                                        selectedOptionsBran
                                                            .map((data) => data.value)
                                                            .includes(comp.branch) &&
                                                        selectedOptionsUnit
                                                            .map((data) => data.value)
                                                            .includes(comp.unit) &&
                                                        selectedOptionsTeam
                                                            .map((data) => data.value)
                                                            .includes(comp.team)
                                                )
                                                ?.map((data) => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsEmp}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                            }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Responsible Person"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
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
                                    <LoadingButton
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                        loading={btnSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        SAVE
                                    </LoadingButton>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        CLEAR
                                    </Button>
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
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>
                                            Edit Assign Checklist
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={categorysEdit}
                                                value={{
                                                    label: checklistverificationEdit.categoryname,
                                                    value: checklistverificationEdit.categoryname,
                                                }}
                                                onChange={(e) => {
                                                    setChecklistverificationEdit({
                                                        ...checklistverificationEdit,
                                                        categoryname: e.value,
                                                        subcategoryname: "Please Select Subcategory",
                                                        checklisttype: "Please Select Checklist Type",
                                                    });
                                                    fetchSubcategoryEdit(e);
                                                    setSelectedOptionsChecklisttypeEdit([]);
                                                    setChecklisttypesOptEdit([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Subcategory<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={subcategorysEdit}
                                                value={{
                                                    label: checklistverificationEdit.subcategoryname,
                                                    value: checklistverificationEdit.subcategoryname,
                                                }}
                                                onChange={(e) => {
                                                    setChecklistverificationEdit({
                                                        ...checklistverificationEdit,
                                                        subcategoryname: e.value,
                                                        checklisttype: "Please Select Checklist Type",
                                                    });
                                                    fetchChecklisttypeDropdownsEdit(
                                                        checklistverificationEdit.categoryname,
                                                        e.value
                                                    );
                                                    setSelectedOptionsChecklisttypeEdit([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid
                                        item
                                        md={3}
                                        sm={12}
                                        xs={12}
                                        sx={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Checklist Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={checklisttypesOptEdit}
                                                value={selectedOptionsChecklisttypeEdit}
                                                onChange={(e) => {
                                                    handleChecklisttypeChangeEdit(e);
                                                }}
                                                valueRenderer={customValueRendererChecklisttypeEdit}
                                                labelledBy="Please Select Checklist Type"
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid
                                        item
                                        md={3}
                                        sm={12}
                                        xs={12}
                                        sx={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.map((data) => ({
                                                        label: data.company,
                                                        value: data.company,
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
                                                value={selectedOptionsComEdit}
                                                onChange={(e) => {
                                                    handleCompanyChangeEdit(e);
                                                    setSelectedOptionsBranEdit([]);
                                                    setSelectedOptionsUnitEdit([]);
                                                    setSelectedOptionsTeamEdit([]);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererComEdit}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        md={3}
                                        sm={12}
                                        xs={12}
                                        sx={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter((comp) =>
                                                        selectedOptionsComEdit
                                                            .map((data) => data.value)
                                                            .includes(comp.company)
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
                                                value={selectedOptionsBranEdit}
                                                onChange={(e) => {
                                                    handleBranchChangeEdit(e);
                                                    setSelectedOptionsUnitEdit([]);
                                                    setSelectedOptionsTeamEdit([]);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererBranEdit}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        md={3}
                                        sm={12}
                                        xs={12}
                                        sx={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={accessbranch
                                                    ?.filter(
                                                        (comp) =>
                                                            selectedOptionsComEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.company) &&
                                                            selectedOptionsBranEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.branch)
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
                                                value={selectedOptionsUnitEdit}
                                                onChange={(e) => {
                                                    handleUnitChangeEdit(e);
                                                    setSelectedOptionsTeamEdit([]);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererUnitEdit}
                                                labelledBy="Please Select Unit"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        md={3}
                                        sm={12}
                                        xs={12}
                                        sx={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allTeam
                                                    ?.filter(
                                                        (comp) =>
                                                            selectedOptionsComEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.company) &&
                                                            selectedOptionsBranEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.branch) &&
                                                            selectedOptionsUnitEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.unit)
                                                    )
                                                    ?.map((data) => ({
                                                        label: data.teamname,
                                                        value: data.teamname,
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
                                                value={selectedOptionsTeamEdit}
                                                onChange={(e) => {
                                                    handleTeamChangeEdit(e);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererTeamEdit}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid
                                        item
                                        md={3}
                                        sm={12}
                                        xs={12}
                                        sx={{ display: "flex", flexDirection: "row" }}
                                    >
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Responsible Person<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (comp) =>
                                                            selectedOptionsComEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.company) &&
                                                            selectedOptionsBranEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.branch) &&
                                                            selectedOptionsUnitEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.unit) &&
                                                            selectedOptionsTeamEdit
                                                                .map((data) => data.value)
                                                                .includes(comp.team)
                                                    )
                                                    ?.map((data) => ({
                                                        label: data.companyname,
                                                        value: data.companyname,
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
                                                value={selectedOptionsEmpEdit}
                                                onChange={(e) => {
                                                    handleEmployeeChangeEdit(e);
                                                }}
                                                valueRenderer={customValueRendererEmpEdit}
                                                labelledBy="Please Select Responsible Person"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Button
                                            variant="contained"
                                            sx={buttonStyles.buttonsubmit}
                                            onClick={editSubmit}
                                        >
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleCloseModEdit}
                                        >
                                            Cancel
                                        </Button>
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
            {isUserRoleCompare?.includes("lassignchecklist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Assign Checklist
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
                                        <MenuItem value={filteredDatas?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelassignchecklist") && (
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
                                    {isUserRoleCompare?.includes("csvassignchecklist") && (
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
                                    {isUserRoleCompare?.includes("printassignchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfassignchecklist") && (
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
                                    {isUserRoleCompare?.includes("imageassignchecklist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item md={2} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        size="small"
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
                                                        <IoMdOptions
                                                            style={{ cursor: "pointer" }}
                                                            onClick={handleClickSearch}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ "aria-label": "weight" }}
                                        type="text"
                                        value={getSearchDisplay()}
                                        onChange={handleSearchChange}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilter}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {isUserRoleCompare?.includes("bdassignchecklist") && (
                            <Button
                                variant="contained"
                                color="error"
                                sx={buttonStyles.buttonbulkdelete}
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {!checklistverificationCheck ? (
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
                                    totalDatas={totalDatas}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>
                        )}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={idSearch}
                open={openSearch}
                anchorEl={anchorElSearch}
                onClose={handleCloseSearch}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Box style={{ padding: "10px", maxWidth: "450px" }}>
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
                        <Box
                            sx={{
                                width: "350px",
                                maxHeight: "400px",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <Box
                                sx={{
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                    // paddingRight: '5px'
                                }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Columns</Typography>
                                        <Select
                                            fullWidth
                                            size="small"
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
                                            <MenuItem value="" disabled>
                                                Select Column
                                            </MenuItem>
                                            {filteredSelectedColumn.map((col) => (
                                                <MenuItem key={col.field} value={col.field}>
                                                    {col.headerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Operator</Typography>
                                        <Select
                                            fullWidth
                                            size="small"
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
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={
                                                ["Blank", "Not Blank"].includes(selectedCondition)
                                                    ? ""
                                                    : filterValue
                                            }
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            disabled={["Blank", "Not Blank"].includes(
                                                selectedCondition
                                            )}
                                            placeholder={
                                                ["Blank", "Not Blank"].includes(selectedCondition)
                                                    ? "Disabled"
                                                    : "Enter value"
                                            }
                                            sx={{
                                                "& .MuiOutlinedInput-root.Mui-disabled": {
                                                    backgroundColor: "rgb(0 0 0 / 26%)",
                                                },
                                                "& .MuiOutlinedInput-input.Mui-disabled": {
                                                    cursor: "not-allowed",
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
                                                    <FormControlLabel
                                                        value="AND"
                                                        control={<Radio />}
                                                        label="AND"
                                                    />
                                                    <FormControlLabel
                                                        value="OR"
                                                        control={<Radio />}
                                                        label="OR"
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                        </>
                                    )}
                                    {additionalFilters.length === 0 && (
                                        <Grid item md={4} sm={12} xs={12}>
                                            <Button
                                                variant="contained"
                                                onClick={handleAddFilter}
                                                sx={{ textTransform: "capitalize" }}
                                                disabled={
                                                    ["Blank", "Not Blank"].includes(selectedCondition)
                                                        ? false
                                                        : !filterValue || selectedColumn.length === 0
                                                }
                                            >
                                                Add Filter
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item md={2} sm={12} xs={12}>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                fetchChecklistverification();
                                                setIsSearchActive(true);
                                                setAdvancedFilter([
                                                    ...additionalFilters,
                                                    {
                                                        column: selectedColumn,
                                                        condition: selectedCondition,
                                                        value: filterValue,
                                                    },
                                                ]);
                                            }}
                                            sx={{ textTransform: "capitalize" }}
                                            disabled={
                                                ["Blank", "Not Blank"].includes(selectedCondition)
                                                    ? false
                                                    : !filterValue || selectedColumn.length === 0
                                            }
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
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
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => deleGroup(checklistverificationmasters)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}

                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                Info Assign Checklist{" "}
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
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {"SNO"}.
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {" "}
                                                    {"UserName"}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {" "}
                                                    {"Date"}
                                                </StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {i + 1}.
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.name}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {moment(item.date).format(
                                                                "DD-MM-YYYY hh:mm:ss a"
                                                            )}
                                                        </StyledTableCell>
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
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {"SNO"}.
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {" "}
                                                    {"UserName"}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{ padding: "5px 10px !important" }}
                                                >
                                                    {" "}
                                                    {"Date"}
                                                </StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {i + 1}.
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {item.name}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            sx={{ padding: "5px 10px !important" }}
                                                        >
                                                            {" "}
                                                            {moment(item.date).format(
                                                                "DD-MM-YYYY hh:mm:ss a"
                                                            )}
                                                        </StyledTableCell>
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
                                <Button
                                    variant="contained"
                                    onClick={handleCloseinfo}
                                    sx={userStyle.btncancel}
                                >
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* print layout */}

            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "1150px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Assign Checklist
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>
                                        {checklistverificationEdit.categoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Subcategory</Typography>
                                    <Typography>
                                        {checklistverificationEdit.subcategoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> ChecklistType</Typography>
                                    <Typography>
                                        {checklistverificationEdit.checklisttype + ","}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>
                                        {checklistverificationEdit.company + ","}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>
                                        {checklistverificationEdit.branch + ","}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    <Typography>
                                        {checklistverificationEdit.unit + ","}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Team</Typography>
                                    <Typography>
                                        {checklistverificationEdit.team + ","}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Responsible Person</Typography>
                                    <Typography>
                                        {checklistverificationEdit.employee + ","}
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
                                sx={userStyle.btncancel}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
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
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delGroupcheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
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
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
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
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={handleCloseerr}>
                            close
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={delGroupcheckbox}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={
                    (filteredChanges !== null ? filteredRowData : rowDataTable) ?? []
                }
                itemsTwo={overallItems ?? []}
                filename={"Assign Checklist"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

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
        </Box>
    );
}

export default CheckListVerificationMaster;
