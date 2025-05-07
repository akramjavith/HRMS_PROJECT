import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
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
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";
import AlertDialog from "../../components/Alert.js";
import { menuItems } from "../../components/menuItemsList";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext.js";
import { colourStyles, userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import domtoimage from 'dom-to-image';

function LimitedControlSetting() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [resLimitModule, setResLimitModule] = useState([]);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setIsBtn(false);
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
        "Company", "Branch", "Limit", "Module Name", "SubModule Name", "Main Page", "Sub Page", "Sub Sub-Page"
    ];
    let exportRowValues = [
        "company", "branch", "limit", "modulename", "submodulename", "mainpagename", "subpagename", "subsubpagename"
    ];

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");

    const [limitcontrol, setLimitcontrol] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        limit: ""
    });

    const [limitcontrolEdit, setLimitcontrolEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        limit: "",
    });
    const [singleSelectValues, setSingleSelectValues] = useState({
        module: "Please Select Module",
        submodule: "Please Select Sub Module",
        mainpage: "Please Select Main Page",
        subpage: "Please Select Sub Page",
        subsubpage: "Please Select Sub Sub Page",
    });
    const [singleSelectValuesEdit, setSingleSelectValuesEdit] = useState({
        module: "Please Select Module",
        submodule: "Please Select Sub Module",
        mainpage: "Please Select Main Page",
        subpage: "Please Select Sub Page",
        subsubpage: "Please Select Sub Sub Page",
    });
    const [limitcontrolsettings, setLimitcontrolsettings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allLimitcontroledit, setAllLimitcontroledit] = useState([]);

    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const accessbranch = [...isUserRoleAccess?.role?.includes("Manager")
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
            })), { company: "Others", branch: "Others", unit: "Others" }];

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
            pagename: String("Limit Control Setting"),
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


    const [locationgroupingCheck, setLocationgroupingcheck] = useState(false);
    const [isBtn, setIsBtn] = useState(false);

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");



    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Limit Control Setting.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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


    const [rolesNewList, setRolesNewList] = useState([]);
    const [rolesNewListEdit, setRolesNewListEdit] = useState([]);
    const [subModuleOptions, setSubModuleOptions] = useState([]);
    const [mainPageoptions, setMainPageoptions] = useState([]);
    const [subPageoptions, setSubPageoptions] = useState([]);
    const [subSubPageoptions, setsubSubPageoptions] = useState([]);
    let [valueMainPage, setValueMainPage] = useState("");
    const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
    const [mainPageDbNames, setMainPageDbNames] = useState([]);
    const [selectedMainPageName, setSelectedMainPageName] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);

    // Edit module  Functionality
    const [subModuleOptionsEdit, setSubModuleOptionsEdit] = useState([]);
    const [mainPageoptionsEdit, setMainPageoptionsEdit] = useState([]);
    const [subPageoptionsEdit, setSubPageoptionsEdit] = useState([]);
    const [subSubPageoptionsEdit, setsubSubPageoptionsEdit] = useState([]);


    let [valueBranch, setValueBranch] = useState([]);

    const handleBranchChangeFrom = (options) => {
        setValueBranch(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedBranchFrom(options);
    };

    const customValueRendererBranchFrom = (valueBranch, _branch) => {
        return valueBranch?.length
            ? valueBranch.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    // get the current user role datas
    const fetchNewRoleList = async () => {
        setPageName(!pageName)
        try {
            let role_new = await axios.get(SERVICE.ROLE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const allRoles = role_new?.data?.roles.filter((item) =>
                isUserRoleAccess?.role?.includes(item?.name)
            );

            let mergedObject = {};
            allRoles.forEach((obj) => {
                const keysToInclude = [
                    "modulename",
                    "submodulename",
                    "mainpagename",
                    "subpagename",
                    "subsubpagename",
                ];

                keysToInclude.forEach((key) => {
                    if (!mergedObject[key]) {
                        mergedObject[key] = [];
                    }

                    if (Array.isArray(obj[key])) {
                        obj[key].forEach((item) => {
                            if (!mergedObject[key].includes(item)) {
                                mergedObject[key].push(item);
                            }
                        });
                    } else {
                        if (!mergedObject[key].includes(obj[key])) {
                            mergedObject[key].push(obj[key]);
                        }
                    }
                });
            });
            console.log(mergedObject, 'mergedObject')
            const moduledata = menuItems.filter((data, index) => {
                if (data.navlimit === true) {
                    return data.title
                }
            });

            const resmodule = moduledata.map((d, i) => {
                return d.title
            })
            setResLimitModule(resmodule);
            console.log(resmodule, 'resmodule')
            setRolesNewList([mergedObject]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchNewRoleList();
    }, [isUserRoleAccess]);

    // get the current user role datas
    const fetchNewRoleListEdit = async () => {
        setPageName(!pageName)
        try {
            let role_new = await axios.get(SERVICE.ROLE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const allRoles = role_new?.data?.roles.filter((item) =>
                isUserRoleAccess?.role?.includes(item?.name)
            );

            let mergedObject = {};
            allRoles.forEach((obj) => {
                const keysToInclude = [
                    "modulename",
                    "submodulename",
                    "mainpagename",
                    "subpagename",
                    "subsubpagename",
                ];

                keysToInclude.forEach((key) => {
                    if (!mergedObject[key]) {
                        mergedObject[key] = [];
                    }

                    if (Array.isArray(obj[key])) {
                        obj[key].forEach((item) => {
                            if (!mergedObject[key].includes(item)) {
                                mergedObject[key].push(item);
                            }
                        });
                    } else {
                        if (!mergedObject[key].includes(obj[key])) {
                            mergedObject[key].push(obj[key]);
                        }
                    }
                });
            });
            const moduledata = menuItems.filter((data, index) => {
                if (data.navlimit === true) {
                    return data.title
                }
            });

            const resmodule = moduledata.map((d, i) => {
                return d.title
            })
            setResLimitModule(resmodule);
            setRolesNewListEdit([mergedObject]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchNewRoleListEdit();
    }, [isEditOpen, limitcontrolEdit, isUserRoleAccess]);

    //single select fetch Submodule
    const handleModuleNameChange = (modulename) => {
        const filteredMenuitems = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const submodulerole = rolesNewList[0]?.submodulename?.map((item) => item);

        const filteredSubModulename = filteredMenuitems[0]?.submenu
            ?.filter((item) => submodulerole.includes(item.title) && item.navlimit === true)
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });
        setSubModuleOptions(filteredSubModulename);
    };

    //single select fetch Main page
    const handleSubModuleNameChange = (modulename, submodulename) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename && item.navlimit === true
            );

        const mainpagerole = rolesNewList[0]?.mainpagename?.map((item) => item);

        const filteredSubModulename = filteredMenuitemsSubModuleName[0]?.submenu
            ?.filter((item) => mainpagerole.includes(item.title) && item.navlimit === true)
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setMainPageoptions(filteredSubModulename);
    };

    //single select fetch Sub page
    const handleMainPageNameChange = (modulename, submodulename, mainpage) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename && item.navlimit === true
            );

        const filteredMenuitemsMainPage =
            filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                (item) => item.title === mainpage && item.navlimit === true
            );

        const subpagerole = rolesNewList[0]?.subpagename?.map((item) => item);

        const filteredSubModulename = filteredMenuitemsMainPage[0]?.submenu
            ?.filter((item) => subpagerole.includes(item.title) && item.navlimit === true)
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setSubPageoptions(filteredSubModulename);
    };

    //single select fetch Sub Sub page
    const handleSubPageNameChange = (
        modulename,
        submodulename,
        mainpage,
        subpage
    ) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename && item.navlimit === true
            );

        const filteredMenuitemsMainPage =
            filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                (item) => item.title === mainpage && item.navlimit === true
            );

        const filteredMenuitemsSubPage =
            filteredMenuitemsMainPage[0]?.submenu?.filter(
                (item) => item.title === subpage && item.navlimit === true
            );

        const subpagerole = rolesNewList[0]?.subsubpagename?.map((item) => item);

        const filteredSubSubModulename = filteredMenuitemsSubPage[0]?.submenu
            ?.filter((item) => subpagerole.includes(item.title) && item.navlimit === true)
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setsubSubPageoptions(filteredSubSubModulename);
    };


    //setting an Main Page names into array
    const handleMainPageChange = (options) => {
        setValueMainPage(
            options.map((a, index) => {
                return a.value;
            })
        );
        let mainpageAns = options.map((a, index) => {
            return a.value;
        });
        setMainPageTitleNames(mainpageAns);
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setMainPageDbNames(dbNames);
        let mainPageFilt = mainPageoptions.filter((data) =>
            mainpageAns.includes(data.title)
        );

        let mainPage =
            mainPageFilt.length > 0 &&
            mainPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        //Removing Add in the list
        let filteredArray =
            mainPage.length > 0 &&
            mainPage.filter((innerArray) => {
                return !innerArray.title.startsWith("Add ");
            });
        //options fetching
        let subPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setSubPageoptions(subPageDropDown);
        setSelectedMainPageName(options);
    };


    // Edit module functionality
    //single select fetch Submodule
    const handleModuleNameChangeEdit = (modulename, e) => {

        const filteredMenuitems = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const submodulerole = e[0]?.submodulename?.map((item) => item);

        const filteredSubModulename =
            filteredMenuitems?.length > 0
                ? filteredMenuitems[0]?.submenu
                    ?.filter((item) => submodulerole?.includes(item.title) && item.navlimit === true)
                    ?.map((item) => {
                        return {
                            label: item.title,
                            value: item.title,
                        };
                    })
                : [];

        setSubModuleOptionsEdit(filteredSubModulename);
    };

    //single select fetch Main page
    const handleSubModuleNameChangeEdit = (modulename, submodulename, e) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName?.length > 0
                ? filteredMenuitemsModuleName[0]?.submenu?.filter(
                    (item) => item.title === submodulename && item.navlimit === true
                )
                : [];

        const mainpagerole = e[0]?.mainpagename?.map((item) => item);

        const filteredSubModulename =
            filteredMenuitemsSubModuleName?.length > 0
                ? filteredMenuitemsSubModuleName[0]?.submenu
                    ?.filter((item) => mainpagerole?.includes(item.title) && item.navlimit === true)
                    ?.map((item) => {
                        return {
                            label: item.title,
                            value: item.title,
                        };
                    })
                : [];

        setMainPageoptionsEdit(filteredSubModulename);
    };

    //single select fetch Sub page
    const handleMainPageNameChangeEdit = (modulename, submodulename, mainpage, e) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName?.length > 0
                ? filteredMenuitemsModuleName[0]?.submenu?.filter(
                    (item) => item.title === submodulename && item.navlimit === true
                )
                : [];

        const filteredMenuitemsMainPage =
            filteredMenuitemsSubModuleName?.length > 0
                ? filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                    (item) => item.title === mainpage && item.navlimit === true
                )
                : [];

        const subpagerole = e[0]?.subpagename?.map((item) => item);

        const filteredSubModulename =
            filteredMenuitemsMainPage?.length > 0
                ? filteredMenuitemsMainPage[0]?.submenu
                    ?.filter((item) => subpagerole?.includes(item.title) && item.navlimit === true)
                    ?.map((item) => {
                        return {
                            label: item.title,
                            value: item.title,
                        };
                    })
                : [];

        setSubPageoptionsEdit(filteredSubModulename);
    };

    //single select fetch Sub Sub page
    const handleSubPageNameChangeEdit = (
        modulename,
        submodulename,
        mainpage,
        subpage,
        e
    ) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename && item.navlimit === true
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName?.length > 0
                ? filteredMenuitemsModuleName[0]?.submenu?.filter(
                    (item) => item.title === submodulename && item.navlimit === true
                )
                : [];

        const filteredMenuitemsMainPage =
            filteredMenuitemsSubModuleName?.length > 0
                ? filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                    (item) => item.title === mainpage && item.navlimit === true
                )
                : [];

        const filteredMenuitemsSubPage =
            filteredMenuitemsMainPage?.length > 0
                ? filteredMenuitemsMainPage[0]?.submenu?.filter(
                    (item) => item.title === subpage && item.navlimit === true
                )
                : [];

        const subpagerole = e[0]?.subsubpagename?.map((item) => item);

        const filteredSubSubModulename =
            filteredMenuitemsSubPage?.length > 0
                ? filteredMenuitemsSubPage[0]?.submenu
                    ?.filter((item) => subpagerole?.includes(item.title) && item.navlimit === true)
                    ?.map((item) => {
                        return {
                            label: item.title,
                            value: item.title,
                        };
                    })
                : [];

        setsubSubPageoptionsEdit(filteredSubSubModulename);
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

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
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

    const handleClickOpenalert = () => {
        setIsHandleChange(true);
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

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        limit: true,
        modulename: true,
        submodulename: true,
        mainpagename: true,
        subpagename: true,
        subsubpagename: true,
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

    const [deleteLimitcontrol, setDeleteLimitcontrol] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.LIMITCONTROLSETTING_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteLimitcontrol(res?.data?.slimitcontrolsetting);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let Limitcontrolsid = deleteLimitcontrol?._id;
    const delLimitcontrol = async () => {
        setPageName(!pageName);
        try {
            if (Limitcontrolsid) {
                await axios.delete(
                    `${SERVICE.LIMITCONTROLSETTING_SINGLE}/${Limitcontrolsid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
                await fetchLimitControlSetting();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
                setFilteredChanges(null)
                setFilteredRowData([])
                setSearchQuery("")
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delLocationgrpcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.LIMITCONTROLSETTING_SINGLE}/${item}`, {
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
            setFilteredChanges(null)
            setFilteredRowData([])
            setSearchQuery("")
            await fetchLimitControlSetting();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        if (accessbranch?.length > 0 && limitcontrol.company === "Please Select Company") {
            const defaultCompany = accessbranch[0].company;

            const defaultBranches = accessbranch
                .filter((data) => data.company === defaultCompany)
                .map((data) => ({ label: data.branch, value: data.branch }));

            setLimitcontrol((prev) => ({
                ...prev,
                company: defaultCompany,
                branch: defaultBranches.length > 0 ? defaultBranches[0].value : "", // ✅ Prevent "Please Select Branch" from being set
            }));

            // if (!selectedBranchFrom?.length) {
            //     setSelectedBranchFrom(defaultBranches);
            // }

            // // ✅ Ensure valueBranch is set when defaultBranches exist
            // if (defaultBranches.length > 0) {
            //     setValueBranch(defaultBranches[0].value);
            // }
        }
    }, [accessbranch]);


    useEffect(() => {
        if (rolesNewList?.length > 0 && rolesNewList[0]?.modulename?.length > 0) {
            // Check if "Expenses" exists in the module list, otherwise take the first module
            const defaultModule = rolesNewList[0].modulename.includes("Expenses")
                ? "Expenses"
                : rolesNewList[0].modulename[0];

            // Find "Add Expense" under the selected module, otherwise take the first submodule
            const defaultSubmodule = rolesNewList[0].submodulename?.includes("Add Expense")
                ? "Add Expense"
                : rolesNewList[0].submodulename?.[0] || "Please Select Sub Module";

            setSingleSelectValues((prev) => ({
                ...prev,
                module: defaultModule,
                submodule: defaultSubmodule,
            }));

            handleModuleNameChange(defaultModule);
        }
    }, [rolesNewList]);

    //Add  Function to send data request
    const sendRequest = async () => {
        setIsBtn(true);
        setPageName(!pageName);
        try {
            if (limitcontrol.company === "Others") {
                let res = await axios.post(SERVICE.LIMITCONTROLSETTING_CREATE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String("Others"),
                    branch: String("Others"),
                    limit: String(limitcontrol.limit),
                    modulename: singleSelectValues.module,
                    submodulename: singleSelectValues.submodule,
                    mainpagename: singleSelectValues.mainpage === "Please Select Main Page" ? "" : singleSelectValues.mainpage,
                    subpagename: singleSelectValues.subpage === "Please Select Sub Page" ? "" : singleSelectValues.subpage,
                    subsubpagename: singleSelectValues.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValues.subsubpage,
                    limitcontrollog: [
                        {

                            company: String("Others"),
                            branch: String("Others"),
                            limit: String(limitcontrol.limit),
                            modulename: singleSelectValues.module,
                            submodulename: singleSelectValues.submodule,
                            mainpagename: singleSelectValues.mainpage === "Please Select Main Page" ? "" : singleSelectValues.mainpage,
                            subpagename: singleSelectValues.subpage === "Please Select Sub Page" ? "" : singleSelectValues.subpage,
                            subsubpagename: singleSelectValues.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValues.subsubpage,
                            updateddatetime: String(new Date()),
                            updatedusername: String(isUserRoleAccess.companyname),
                        },
                    ],
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });

            } else {
                await Promise.all(
                    valueBranch?.map(async (data) => {
                        await axios.post(SERVICE.LIMITCONTROLSETTING_CREATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            company: String(limitcontrol.company),
                            branch: String(data),
                            limit: String(limitcontrol.limit),
                            modulename: singleSelectValues.module,
                            submodulename: singleSelectValues.submodule,
                            mainpagename: singleSelectValues.mainpage === "Please Select Main Page" ? "" : singleSelectValues.mainpage,
                            subpagename: singleSelectValues.subpage === "Please Select Sub Page" ? "" : singleSelectValues.subpage,
                            subsubpagename: singleSelectValues.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValues.subsubpage,
                            limitcontrollog: [
                                {
                                    company: String(limitcontrol.company),
                                    branch: String(data),
                                    limit: String(limitcontrol.limit),
                                    modulename: singleSelectValues.module,
                                    submodulename: singleSelectValues.submodule,
                                    mainpagename: singleSelectValues.mainpage === "Please Select Main Page" ? "" : singleSelectValues.mainpage,
                                    subpagename: singleSelectValues.subpage === "Please Select Sub Page" ? "" : singleSelectValues.subpage,
                                    subsubpagename: singleSelectValues.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValues.subsubpage,
                                    updateddatetime: String(new Date()),
                                    updatedusername: String(isUserRoleAccess.companyname),
                                },
                            ],

                            addedby: [
                                {
                                    name: String(isUserRoleAccess.companyname),
                                    date: String(new Date()),
                                },
                            ],
                        });
                    })
                );
            }

            await fetchLimitControlSetting();
            setFilteredChanges(null);
            setFilteredRowData([]);
            setSearchQuery("");
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        let branches = selectedBranchFrom.map((item) => String(item.value));

        const currentModule = singleSelectValues.module;
        const currentSubmodule = singleSelectValues.submodule;
        const currentMainPage = singleSelectValues.mainpage === "Please Select Main Page" ? "" : singleSelectValues.mainpage;
        const currentSubPage = singleSelectValues.subpage === "Please Select Sub Page" ? "" : singleSelectValues.subpage;
        const currentSubSubPage = singleSelectValues.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValues.subsubpage;

        const isDuplicate = limitcontrolsettings.some((item) => {
            const branchMatch = branches.some((branch) => branch === String(item.branch)); // 🔹 Fix for branch check

            return (
                item.company === limitcontrol.company &&
                item.modulename === currentModule &&
                item.submodulename === currentSubmodule &&
                (item.mainpagename === currentMainPage || !currentMainPage) &&
                (item.subpagename === currentSubPage || !currentSubPage) &&
                (item.subsubpagename === currentSubSubPage || !currentSubSubPage) &&
                branchMatch
            );
        });

        const isDuplicateothers = limitcontrolsettings.some((item) => {

            return (
                item.company === limitcontrol.company &&
                item.modulename === currentModule &&
                item.submodulename === currentSubmodule &&
                (item.mainpagename === currentMainPage || !currentMainPage) &&
                (item.subpagename === currentSubPage || !currentSubPage) &&
                (item.subsubpagename === currentSubSubPage || !currentSubSubPage) &&
                item.branch === "Others"
            );
        });


        if (limitcontrol.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (valueBranch?.length === 0) {
        else if (limitcontrol.company === "Others" && !valueBranch || valueBranch.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (limitcontrol.limit === "") {
            setPopupContentMalert("Please Enter Limit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (currentModule === "Please Select Module") {
            setPopupContentMalert("Please Select Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (currentSubmodule === "Please Select Sub Module") {
            setPopupContentMalert("Please Select Sub Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isDuplicate) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (limitcontrol.company === "Others" && isDuplicateothers) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };


    const handleClear = (e) => {
        e.preventDefault();

        setLimitcontrol({
            company: "Please Select Company",
            branch: "",
            limit: "",
        });

        setSingleSelectValues({
            module: "Please Select Module",
            submodule: "Please Select Sub Module",
            mainpage: "Please Select Main Page",
            subpage: "Please Select Sub Page",
            subsubpage: "Please Select Sub Sub Page",
        });

        // Clearing related selections
        setValueBranch([]);
        setSelectedBranchFrom([]);

        // Module-related clear actions
        setSelectedMainPageName([]);
        setMainPageDbNames([]);
        setSubModuleOptions([]);
        setValueMainPage([]);
        setMainPageTitleNames([]);
        setMainPageoptions([]);
        setSubPageoptions([]);
        setsubSubPageoptions([]);

        // Show popup message
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };


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
            let res = await axios.get(`${SERVICE.LIMITCONTROLSETTING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLimitcontrolEdit(res?.data?.slimitcontrolsetting);
            setSingleSelectValuesEdit({
                module: res?.data?.slimitcontrolsetting?.modulename,
                submodule: res?.data?.slimitcontrolsetting?.submodulename,
                mainpage:
                    res?.data?.slimitcontrolsetting?.mainpagename === ""
                        ? "Please Select Main Page"
                        : res?.data?.slimitcontrolsetting?.mainpagename,
                subpage:
                    res?.data?.slimitcontrolsetting?.subpagename === ""
                        ? "Please Select Sub Page"
                        : res?.data?.slimitcontrolsetting?.subpagename,
                subsubpage:
                    res?.data?.slimitcontrolsetting?.subsubpagename === ""
                        ? "Please Select Sub Sub Page"
                        : res?.data?.slimitcontrolsetting?.subsubpagename,

            });
            handleModuleNameChangeEdit(res?.data?.slimitcontrolsetting?.modulename, rolesNewListEdit);

            handleSubModuleNameChangeEdit(
                res?.data?.slimitcontrolsetting?.modulename,
                res?.data?.slimitcontrolsetting?.submodulename,
                rolesNewListEdit
            );
            handleMainPageNameChangeEdit(
                res?.data?.slimitcontrolsetting?.modulename,
                res?.data?.slimitcontrolsetting?.submodulename,
                res?.data?.slimitcontrolsetting?.mainpagename,
                rolesNewListEdit
            );
            handleSubPageNameChangeEdit(
                res?.data?.slimitcontrolsetting?.modulename,
                res?.data?.slimitcontrolsetting?.submodulename,
                res?.data?.slimitcontrolsetting?.mainpagename,
                res?.data?.slimitcontrolsetting?.subpagename,
                rolesNewListEdit
            );

            handleClickOpenEdit();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.LIMITCONTROLSETTING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLimitcontrolEdit(res?.data?.slimitcontrolsetting);
            setSingleSelectValuesEdit(res?.data?.slimitcontrolsetting);
            handleClickOpenview();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.LIMITCONTROLSETTING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLimitcontrolEdit(res?.data?.slimitcontrolsetting);
            handleClickOpeninfo();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //Project updateby edit page...
    let updateby = limitcontrolEdit?.updatedby;
    let addedby = limitcontrolEdit?.addedby;
    let limitlog = limitcontrolEdit?.limitcontrollog ? limitcontrolEdit?.limitcontrollog : [];

    let subprojectsid = limitcontrolEdit?._id;

    // //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.LIMITCONTROLSETTING_SINGLE}/${subprojectsid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(limitcontrolEdit.company),
                    branch: String(limitcontrolEdit.branch),
                    limit: String(limitcontrolEdit.limit),
                    modulename: singleSelectValuesEdit.module,
                    submodulename: singleSelectValuesEdit.submodule,
                    mainpagename: singleSelectValuesEdit.mainpage === "Please Select Main Page" ? "" : singleSelectValuesEdit.mainpage,
                    subpagename: singleSelectValuesEdit.subpage === "Please Select Sub Page" ? "" : singleSelectValuesEdit.subpage,
                    subsubpagename: singleSelectValuesEdit.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValuesEdit.subsubpage,
                    limitcontrollog: [
                        ...limitlog,
                        {
                            company: String(limitcontrolEdit.company),
                            branch: String(limitcontrolEdit.branch),
                            limit: String(limitcontrolEdit.limit),
                            modulename: singleSelectValuesEdit.module,
                            submodulename: singleSelectValuesEdit.submodule,
                            mainpagename: singleSelectValuesEdit.mainpage === "Please Select Main Page" ? "" : singleSelectValuesEdit.mainpage,
                            subpagename: singleSelectValuesEdit.subpage === "Please Select Sub Page" ? "" : singleSelectValuesEdit.subpage,
                            subsubpagename: singleSelectValuesEdit.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValuesEdit.subsubpage,
                            updateddatetime: String(new Date()),
                            updatedusername: String(isUserRoleAccess.companyname),
                        },
                    ],
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );

            await fetchLimitControlSetting();
            await fetchLimitControlSettingAll();

            handleCloseModEdit();
            setFilteredChanges(null);
            setFilteredRowData([]);
            setSearchQuery("");
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();

        const isDuplicate = allLimitcontroledit.some((item) => {
            if (item._id === subprojectsid) return false;

            const companyMatch = item.company === limitcontrolEdit.company;
            const branchMatch = item.branch === limitcontrolEdit.branch;
            const moduleMatch = item.modulename === singleSelectValuesEdit.module;
            const submoduleMatch = item.submodulename === singleSelectValuesEdit.submodule;
            const mainpageMatch = item.mainpagename === (singleSelectValuesEdit.mainpage === "Please Select Main Page" ? "" : singleSelectValuesEdit.mainpage);
            const subpageMatch = item.subpagename === (singleSelectValuesEdit.subpage === "Please Select Sub Page" ? "" : singleSelectValuesEdit.subpage);
            const subsubpageMatch = item.subsubpagename === (singleSelectValuesEdit.subsubpage === "Please Select Sub Sub Page" ? "" : singleSelectValuesEdit.subsubpage);

            return companyMatch && branchMatch && moduleMatch && submoduleMatch && mainpageMatch && subpageMatch && subsubpageMatch;
        });


        // Validation Checks
        if (limitcontrolEdit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (limitcontrolEdit.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (limitcontrolEdit.limit === "") {
            setPopupContentMalert("Please Enter Limit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (singleSelectValuesEdit.module === "Please Select Module") {
            setPopupContentMalert("Please Select Module!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (singleSelectValuesEdit.submodule === "Please Select Sub Module") {
            setPopupContentMalert("Please Select Sub Module!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isDuplicate) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };


    const [limitControlsall, setLimitControlsAll] = useState([])

    //get all Sub vendormasters.
    const fetchLimitControlSetting = async () => {
        setPageName(!pageName);
        setLocationgroupingcheck(true);
        try {
            let res = await axios.get(SERVICE.LIMITCONTROLSETTING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let ans = res?.data?.limitcontrolsettings?.filter((item) =>
                accessbranch.some(
                    (branch) =>
                        branch.company === item.company &&
                        branch.branch === item.branch

                )
            );
            setLimitcontrolsettings(ans);
            setLimitControlsAll(ans?.map((item, index) => ({
                ...item,
                id: item?._id,
                serialNumber: index + 1,
                company: item.company,
                branch: item.branch,
                limit: item.limit,
                modulename: item.modulename,
                submodulename: item.submodulename,
                mainpage: item.mainpage,
                subpage: item.subpage,
                subsubpage: item.subsubpage,
            })));
            setLocationgroupingcheck(false);
        } catch (err) {
            setLocationgroupingcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all Sub vendormasters.
    const fetchLimitControlSettingAll = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.LIMITCONTROLSETTING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllLimitcontroledit(
                res?.data?.limitcontrolsettings.filter(
                    (item) => item._id !== limitcontrolEdit._id
                )
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    // Excel
    const fileName = "Limit Control Setting";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Limit Control Setting",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchLimitControlSetting();
        fetchLimitControlSettingAll();
    }, []);

    useEffect(() => {
        fetchLimitControlSettingAll();
    }, [isEditOpen, limitcontrolEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            limit: item.limit,
            modulename: item.modulename,
            submodulename: item.submodulename,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(limitcontrolsettings);
    }, [limitcontrolsettings]);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);

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
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

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
                fontWeight: "bold",
            },
            sortable: false,
            width: 80,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 160,
            pinned: "left",
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 160,
            pinned: "left",
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            lockPinned: true,
        },
        {
            field: "limit",
            headerName: "Limit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.limit,
            headerClassName: "bold-header",

        },
        {
            field: "modulename",
            headerName: "Module Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.modulename,
            headerClassName: "bold-header",

        },
        {
            field: "submodulename",
            headerName: "Submodule Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.submodulename,
            headerClassName: "bold-header",

        },
        {
            field: "mainpagename",
            headerName: "Main Page",
            flex: 0,
            width: 180,
            hide: !columnVisibility.mainpagename,
            headerClassName: "bold-header",

        },
        {
            field: "subpagename",
            headerName: "Sub Page",
            flex: 0,
            width: 180,
            hide: !columnVisibility.subpagename,
            headerClassName: "bold-header",

        },
        {
            field: "subsubpagename",
            headerName: "Sub Sub Page",
            flex: 0,
            width: 180,
            hide: !columnVisibility.subsubpagename,
            headerClassName: "bold-header",

        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
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
                    <Link to={`/settings/limitcontrolsettingloglist/${params.data.id}`}>
                        <Button
                            variant="contained"
                            sx={{
                                minWidth: "15px",
                                padding: "6px 5px",
                            }}
                        >
                            <MenuIcon style={{ fontsize: "small" }} />
                        </Button>
                    </Link>
                    &ensp;
                    {isUserRoleCompare?.includes("elimitcontrolsetting") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id, params.data.name);

                            }}
                            variant="contained"
                            color="primary"
                        >
                            Change
                            {/* <EditOutlinedIcon sx={buttonStyles.buttonedit} /> */}
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dlimitcontrolsetting") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vlimitcontrolsetting") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ilimitcontrolsetting") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
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
            company: item.company,
            branch: item.branch,
            limit: item.limit,
            modulename: item.modulename,
            submodulename: item.submodulename,
            mainpagename: item.mainpagename,
            subpagename: item.subpagename,
            subsubpagename: item.subsubpagename,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
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
    return (
        <Box>
            <Headtitle title={"Limit Control Setting"} />
            <PageHeading
                title="Limit Control Setting"
                modulename="Control Panel"
                submodulename="Settings"
                mainpagename="Limit Control Setting"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("alimitcontrolsetting") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Limit Control Setting ( Month Based Limit )
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={[...accessbranch
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
                                                })]}
                                            styles={colourStyles}
                                            value={{
                                                label: limitcontrol.company,
                                                value: limitcontrol.company,
                                            }}
                                            onChange={(e) => {
                                                setValueBranch(e.value === "Others" ? ["Others"] : []);
                                                setSelectedBranchFrom(e.value === "Others" ? [{ label: "Others", value: "Other" }] : [])
                                                setLimitcontrol({
                                                    ...limitcontrol,
                                                    company: e.value,
                                                    branch: e.value === "Other" ? "Other" : "Please Select Branch",

                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {limitcontrol.company === "Others" ?
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                sx={userStyle.input}
                                                value={"Others"}
                                            />
                                        </FormControl>
                                    </Grid> :
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch<b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            <MultiSelect
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        limitcontrol.company === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}

                                                value={selectedBranchFrom}
                                                onChange={handleBranchChangeFrom}
                                                valueRenderer={customValueRendererBranchFrom}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                }
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Limit <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            sx={userStyle.input}
                                            type="Number"
                                            placeholder="Please Enter Limit"
                                            value={limitcontrol.limit}
                                            onChange={(e) => {
                                                const newValue = e.target.value.replace(/\./g, "");
                                                setLimitcontrol({ ...limitcontrol, limit: newValue });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === ".") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            {/* Modules line code */}
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Module Name <b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={rolesNewList[0]?.modulename?.filter((data) => resLimitModule?.includes(data))?.map((item) => {
                                                return { label: item, value: item };
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: singleSelectValues.module,
                                                value: singleSelectValues.module,
                                            }}
                                            onChange={(e) => {
                                                setSingleSelectValues({
                                                    ...singleSelectValues,
                                                    module: e.value,
                                                    submodule: "Please Select Sub Module",
                                                    mainpage: "Please Select Main Page",
                                                    subpage: "Please Select Sub Page",
                                                    subsubpage: "Please Select Sub Sub Page",
                                                });
                                                handleModuleNameChange(e.value);
                                                setMainPageoptions([]);
                                                setSubPageoptions([]);
                                                setsubSubPageoptions([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Module Name<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects

                                            options={subModuleOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: singleSelectValues.submodule,
                                                value: singleSelectValues.submodule,
                                            }}
                                            onChange={(e) => {
                                                setSingleSelectValues({
                                                    ...singleSelectValues,
                                                    submodule: e.value,
                                                    mainpage: "Please Select Main Page",
                                                    subpage: "Please Select Sub Page",
                                                    subsubpage: "Please Select Sub Sub Page",
                                                });
                                                handleSubModuleNameChange(
                                                    singleSelectValues.module,
                                                    e.value
                                                );
                                                setSubPageoptions([]);
                                                setsubSubPageoptions([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Main Page</Typography>

                                        <Selects
                                            options={mainPageoptions}
                                            styles={colourStyles}
                                            value={{
                                                label: singleSelectValues.mainpage,
                                                value: singleSelectValues.mainpage,
                                            }}
                                            onChange={(e) => {
                                                setSingleSelectValues({
                                                    ...singleSelectValues,
                                                    mainpage: e.value,
                                                    subpage: "Please Select Sub Page",
                                                    subsubpage: "Please Select Sub Sub Page",
                                                });
                                                handleMainPageChange([e]);
                                                handleMainPageNameChange(
                                                    singleSelectValues.module,
                                                    singleSelectValues.submodule,
                                                    e.value
                                                );
                                                setsubSubPageoptions([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Sub Page</Typography>

                                        <Selects
                                            options={subPageoptions}
                                            styles={colourStyles}
                                            value={{
                                                label: singleSelectValues.subpage,
                                                value: singleSelectValues.subpage,
                                            }}
                                            onChange={(e) => {
                                                setSingleSelectValues({
                                                    ...singleSelectValues,
                                                    subpage: e.value,
                                                    subsubpage: "Please Select Sub Sub Page",

                                                });
                                                handleSubPageNameChange(
                                                    singleSelectValues.module,
                                                    singleSelectValues.submodule,
                                                    singleSelectValues.mainpage,
                                                    e.value
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Sub Sub-Page</Typography>
                                        <Selects
                                            options={subSubPageoptions}
                                            styles={colourStyles}
                                            value={{
                                                label: singleSelectValues.subsubpage,
                                                value: singleSelectValues.subsubpage,
                                            }}
                                            onChange={(e) => {
                                                setSingleSelectValues({
                                                    ...singleSelectValues,
                                                    subsubpage: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        Clear
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
                    maxWidth="md"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px", width: "850px" }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>
                                            Edit Limit Control Setting
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            {/* <Selects
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
                                                styles={colourStyles}
                                                value={{
                                                    label: limitcontrolEdit.company,
                                                    value: limitcontrolEdit.company,
                                                }}
                                            // onChange={(e) => {
                                            //     setLimitcontrolEdit({
                                            //         ...limitcontrolEdit,
                                            //         company: e.value,
                                            //         branch: e.value === "Others" ? "Others" : "Please Select Branch",
                                            //     });

                                            // }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={limitcontrolEdit.company}

                                            />
                                        </FormControl>
                                    </Grid>
                                    {limitcontrolEdit.company === "Others" ?
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    sx={userStyle.input}
                                                    value={"Others"}

                                                />
                                            </FormControl>
                                        </Grid> :
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                {/* <Selects
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                limitcontrolEdit.company === comp.company
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
                                                    styles={colourStyles}
                                                    value={{
                                                        label: limitcontrolEdit.branch,
                                                        value: limitcontrolEdit.branch,
                                                    }}
                                                // onChange={(e) => {
                                                //     setLimitcontrolEdit({
                                                //         ...limitcontrolEdit,
                                                //         branch: e.value,
                                                //     });
                                                // }}
                                                /> */}
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={limitcontrolEdit.branch}

                                                />
                                            </FormControl>
                                        </Grid>
                                    }
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Limit <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                sx={userStyle.input}
                                                type="Number"
                                                placeholder="Please Enter Limit"
                                                value={limitcontrolEdit.limit}
                                                onChange={(e) => {
                                                    const newValue = e.target.value.replace(/\./g, "");
                                                    setLimitcontrolEdit({ ...limitcontrolEdit, limit: newValue });
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Module Name <b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            {/* <Selects
                                                options={rolesNewListEdit[0]?.modulename?.filter((data) => resLimitModule?.includes(data))?.map((item) => {
                                                    return { label: item, value: item };
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.module,
                                                    value: singleSelectValuesEdit.module,
                                                }}
                                            // onChange={(e) => {
                                            //     setSingleSelectValuesEdit({
                                            //         ...singleSelectValuesEdit,
                                            //         module: e.value,
                                            //         submodule: "Please Select Sub Module",
                                            //         mainpage: "Please Select Main Page",
                                            //         subpage: "Please Select Sub Page",
                                            //         subsubpage: "Please Select Sub Sub Page",
                                            //     });
                                            //     handleModuleNameChangeEdit(e.value, rolesNewListEdit);
                                            //     setMainPageoptionsEdit([]);
                                            //     setSubPageoptionsEdit([]);
                                            //     setsubSubPageoptionsEdit([]);
                                            // }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={limitcontrolEdit.modulename}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Module Name<b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            {/* <Selects

                                                options={subModuleOptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.submodule,
                                                    value: singleSelectValuesEdit.submodule,
                                                }}
                                            // onChange={(e) => {
                                            //     setSingleSelectValuesEdit({
                                            //         ...singleSelectValuesEdit,
                                            //         submodule: e.value,
                                            //         mainpage: "Please Select Main Page",
                                            //         subpage: "Please Select Sub Page",
                                            //         subsubpage: "Please Select Sub Sub Page",

                                            //     });
                                            //     handleSubModuleNameChangeEdit(
                                            //         singleSelectValuesEdit.module,
                                            //         e.value,
                                            //         rolesNewListEdit
                                            //     );
                                            //     setSubPageoptionsEdit([]);
                                            //     setsubSubPageoptionsEdit([]);
                                            // }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={limitcontrolEdit.submodulename}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Main Page</Typography>

                                            {/* <Selects
                                                options={mainPageoptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.mainpage,
                                                    value: singleSelectValuesEdit.mainpage,
                                                }}
                                            // onChange={(e) => {
                                            //     setSingleSelectValuesEdit({
                                            //         ...singleSelectValuesEdit,
                                            //         mainpage: e.value,
                                            //         subpage: "Please Select Sub Page",
                                            //         subsubpage: "Please Select Sub Sub Page",
                                            //     });
                                            //     handleMainPageNameChangeEdit(
                                            //         singleSelectValuesEdit.module,
                                            //         singleSelectValuesEdit.submodule,
                                            //         e.value,
                                            //         rolesNewListEdit
                                            //     );
                                            //     setsubSubPageoptionsEdit([]);
                                            // }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={limitcontrolEdit.mainpagename}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Page</Typography>

                                            {/* <Selects
                                                options={subPageoptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.subpage,
                                                    value: singleSelectValuesEdit.subpage,
                                                }}
                                            // onChange={(e) => {
                                            //     setSingleSelectValuesEdit({
                                            //         ...singleSelectValuesEdit,
                                            //         subpage: e.value,
                                            //         subsubpage: "Please Select Sub Sub Page",

                                            //     });
                                            //     handleSubPageNameChangeEdit(
                                            //         singleSelectValuesEdit.module,
                                            //         singleSelectValuesEdit.submodule,
                                            //         singleSelectValuesEdit.mainpage,
                                            //         e.value,
                                            //         rolesNewListEdit
                                            //     );
                                            // }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={limitcontrolEdit.subpagename}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Sub-Page</Typography>
                                            {/* 
                                            <Selects
                                                options={subSubPageoptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.subsubpage,
                                                    value: singleSelectValuesEdit.subsubpage,
                                                }}
                                            // onChange={(e) => {
                                            //     setSingleSelectValuesEdit({
                                            //         ...singleSelectValuesEdit,
                                            //         subsubpage: e.value,
                                            //     });
                                            // }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={limitcontrolEdit.subsubpagename}

                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />

                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={buttonStyles.buttonsubmit}
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
            {isUserRoleCompare?.includes("llimitcontrolsetting") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Limit Control Setting List
                            </Typography>
                        </Grid>
                        <br />
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
                                        <MenuItem value={limitcontrolsettings?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excellimitcontrolsetting") && (
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
                                    {isUserRoleCompare?.includes("csvlimitcontrolsetting") && (
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
                                    {isUserRoleCompare?.includes("printlimitcontrolsetting") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdflimitcontrolsetting") && (
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
                                    {isUserRoleCompare?.includes("imagelimitcontrolsetting") && (
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
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={limitcontrolsettings}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={limitControlsall}
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
                        {isUserRoleCompare?.includes("bdlimitcontrolsetting") && (
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
                        {locationgroupingCheck ? (
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
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={limitControlsall}
                                />
                            </>
                        )}
                    </Box>
                </>
            )}
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
                <Box sx={{ width: "750px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Limit Control Setting
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{limitcontrolEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{limitcontrolEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Limit</Typography>
                                    <Typography>{limitcontrolEdit.limit}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module Name</Typography>
                                    <Typography>{singleSelectValuesEdit.modulename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Module Name</Typography>
                                    <Typography>{singleSelectValuesEdit.submodulename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Main Page</Typography>
                                    <Typography>{singleSelectValuesEdit.mainpagename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Page</Typography>
                                    <Typography>{singleSelectValuesEdit.subpagename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Sub-Page</Typography>
                                    <Typography>{singleSelectValuesEdit.subsubpagename}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                sx={buttonStyles.btncancel}
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
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
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}
                        >
                            ok
                        </Button>
                        <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
                            Cancel
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
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
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
                itemsTwo={limitControlsall ?? []}
                filename={fileName}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Limit Control Setting Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delLimitcontrol}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delLocationgrpcheckbox}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default LimitedControlSetting;