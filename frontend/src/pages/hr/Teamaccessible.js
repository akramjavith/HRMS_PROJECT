import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Checkbox, List, ListItem, Popover, ListItemText, TextField, IconButton, Dialog, DialogContent, Select, MenuItem, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../services/Baseservice";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import Selects from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { handleApiError } from "../../components/Errorhandling";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { CircularProgress, Backdrop } from "@mui/material";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { menuItems } from "../../components/menuItemsList";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

const TeamAccessible = () => {
    const pathname = window.location.pathname;
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
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

    let exportColumnNames = ['Emp Code', 'Employee Name', 'From Company', 'From Branch', 'From Unit', 'Module', 'Sub Module', 'Main Page', 'Sub Page', 'Sub Sub Page', 'To Company', 'To Branch', 'To Unit'];
    let exportRowValues = ['employeecode', 'employee', 'fromcompany', 'frombranch', 'fromunit', 'modulename', 'submodulename', 'mainpagename', 'subpagename', 'subsubpagename', 'company', 'branch', 'unit'];


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const { isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);


    const [fileFormat, setFormat] = useState("");

    const { auth } = useContext(AuthContext);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Team Accessible"),
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

    const module =
        menuItems.length > 0 &&
        menuItems?.map((data) => ({
            ...data,
            label: data.title,
            value: data.title,
        }));


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

    const [moduleOptions, setModuleOptions] = useState([]);
    const [moduleOptionsEdit, setModuleOptionsEdit] = useState([]);
    const [clientmanagerRoleDatas, setClientmanagerRoleDatas] = useState([]);
    const [clientmanagerRoleDatasEdit, setClientmanagerRoleDatasEdit] = useState([]);
    const [moduleNameRouteUrl, setModuleNameRouteUrl] = useState([]);
    const [subModuleNameRouteUrl, setSubModuleNameRouteUrl] = useState([]);
    const [mainPageNameRouteUrl, setMainPageNameRouteUrl] = useState([]);
    const [subPageNameRouteUrl, setSubPageNameRouteUrl] = useState([]);
    const [subsubPageNameRouteUrl, setSubSubPageNameRouteUrl] = useState([]);

    const [moduleNameRouteUrlEdit, setModuleNameRouteUrlEdit] = useState([]);
    const [subModuleNameRouteUrlEdit, setSubModuleNameRouteUrlEdit] = useState([]);
    const [mainPageNameRouteUrlEdit, setMainPageNameRouteUrlEdit] = useState([]);
    const [subPageNameRouteUrlEdit, setSubPageNameRouteUrlEdit] = useState([]);
    const [subsubPageNameRouteUrlEdit, setSubSubPageNameRouteUrlEdit] = useState([]);

    console.log(subModuleNameRouteUrlEdit, 'subModuleNameRouteUrlEdit')

    //moduleoptions
    const [rolesNewList, setRolesNewList] = useState([]);
    const [subModuleOptions, setSubModuleOptions] = useState([]);
    const [mainPageoptions, setMainPageoptions] = useState([]);
    const [subPageoptions, setSubPageoptions] = useState([]);
    const [subSubPageoptions, setsubSubPageoptions] = useState([])

    //moduleoptions
    const [subModuleOptionsEdit, setSubModuleOptionsEdit] = useState([]);
    const [mainPageoptionsEdit, setMainPageoptionsEdit] = useState([]);
    const [subPageoptionsEdit, setSubPageoptionsEdit] = useState([]);
    const [subSubPageoptionsEdit, setsubSubPageoptionsEdit] = useState([]);

    // my changes 

    const fetchClientrole = async () => {
        // setPageName(!pageName);
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

            setClientmanagerRoleDatas(mergedObject);

            let ans = module.filter((data) =>
                mergedObject.modulename.includes(data.title)
            );

            setModuleOptions(
                ans.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
            );

            setModuleOptionsEdit(
                ans.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
            );

            return mergedObject;
        } catch (err) {
            console.log(err);
            setClientmanagerRoleDatas([]);
            setModuleOptions([]);
            setSubModuleOptions([]);
            setMainPageoptions([]);
            setModuleOptionsEdit([]);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const fetchClientroleEdit = async () => {
        // setPageName(!pageName);
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

            let ans = module.filter((data) =>
                mergedObject.modulename.includes(data.title)
            );
            setClientmanagerRoleDatasEdit(mergedObject);

            setModuleOptionsEdit(
                ans.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
            );

            return mergedObject;
        } catch (err) {
            console.log(err);

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchClientrole();

    }, []);


    //module this is create functionality

    //Module  Name multiselect
    const [selectedOptionsModuleName, setSelectedOptionsModuleName] = useState(
        []
    );
    let [valueModuleNameCat, setValueModuleNameCat] = useState([]);

    const handleModuleNameChange = (options) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            if (option.submenu.length === 0) {
                urlvalue.push(option.url);
            }
        });

        setModuleNameRouteUrl(urlvalue?.filter(Boolean))

        setValueModuleNameCat(onlyValues);
        setSelectedOptionsModuleName(options);

        const filteredMenuitems = menuItems?.filter((item) =>
            onlyValues?.includes(item.title)
        );

        const submodulerole = clientmanagerRoleDatas?.submodulename?.map(
            (item) => item
        );

        const filteredSubModulename = filteredMenuitems
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => submodulerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setSubModuleOptions(filteredSubModulename);
        setMainPageoptions([]);
        setSubPageoptions([]);
        setsubSubPageoptions([]);

        setSelectedOptionsSubModuleName([]);
        setValueSubModuleNameCat([]);

        setSelectedOptionsMainPage([]);
        setValueMainPageCat([]);

        setSelectedOptionsSubPage([]);
        setValueSubPageCat([]);

        setSelectedOptionsSubSubPage([]);
        setValueSubSubPageCat([]);
        setSubModuleNameRouteUrl([]);
        setMainPageNameRouteUrl([]);
        setSubPageNameRouteUrl([]);
        setSubSubPageNameRouteUrl([]);
    };

    const customValueRendererModuleName = (valueModuleNameCat, _categoryname) => {
        return valueModuleNameCat?.length
            ? valueModuleNameCat.map(({ label }) => label)?.join(", ")
            : "Please Select Module Name";
    };

    //Sub - Module  Name multiselect
    const [selectedOptionsSubModuleName, setSelectedOptionsSubModuleName] =
        useState([]);
    let [valueSubModuleNameCat, setValueSubModuleNameCat] = useState([]);

    const handleSubModuleNameChange = (options) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setSubModuleNameRouteUrl(urlvalue?.filter(Boolean))

        setValueSubModuleNameCat(onlyValues);
        setSelectedOptionsSubModuleName(options);

        const filteredMenuitemsModuleName = menuItems.filter((item) =>
            valueModuleNameCat?.includes(item.title)
        );

        const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => onlyValues?.includes(item.title));

        const mainpagerole = clientmanagerRoleDatas?.mainpagename?.map(
            (item) => item
        );

        const filteredSubModulename = filteredMenuitemsSubModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => mainpagerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setMainPageoptions(filteredSubModulename);
        setSubPageoptions([]);
        setsubSubPageoptions([]);

        setSelectedOptionsMainPage([]);
        setValueMainPageCat([]);

        setSelectedOptionsSubPage([]);
        setValueSubPageCat([]);

        setSelectedOptionsSubSubPage([]);
        setValueSubSubPageCat([]);
        setMainPageNameRouteUrl([]);
        setSubPageNameRouteUrl([]);
        setSubSubPageNameRouteUrl([]);
    };

    const customValueRendererSubModuleName = (
        valueSubModuleNameCat,
        _categoryname
    ) => {
        return valueSubModuleNameCat?.length
            ? valueSubModuleNameCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Module Name";
    };

    //Main Page multiselect
    const [selectedOptionsMainPage, setSelectedOptionsMainPage] = useState([]);
    let [valueMainPageCat, setValueMainPageCat] = useState([]);

    const handleMainPageChange = (options) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setMainPageNameRouteUrl(urlvalue?.filter(Boolean))


        setValueMainPageCat(onlyValues);
        setSelectedOptionsMainPage(options);

        const filteredMenuitemsModuleName = menuItems.filter((item) =>
            valueModuleNameCat?.includes(item.title)
        );

        const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => valueSubModuleNameCat?.includes(item.title));

        const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => onlyValues?.includes(item.title));

        const subpagerole = clientmanagerRoleDatas?.subpagename?.map(
            (item) => item
        );

        const filteredSubModulename = filteredMenuitemsMainPage
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => subpagerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setSubPageoptions(filteredSubModulename);
        setsubSubPageoptions([]);

        setSelectedOptionsSubPage([]);
        setValueSubPageCat([]);

        setSelectedOptionsSubSubPage([]);
        setValueSubSubPageCat([]);
        setSubPageNameRouteUrl([]);
        setSubSubPageNameRouteUrl([]);
    };

    const customValueRendererMainPage = (valueMainPageCat, _categoryname) => {
        return valueMainPageCat?.length
            ? valueMainPageCat.map(({ label }) => label)?.join(", ")
            : "Please Select Main Page";
    };

    //Sub Page multiselect
    const [selectedOptionsSubPage, setSelectedOptionsSubPage] = useState([]);
    let [valueSubPageCat, setValueSubPageCat] = useState([]);

    const handleSubPageChange = (options) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setSubPageNameRouteUrl(urlvalue?.filter(Boolean))

        setValueSubPageCat(onlyValues);
        setSelectedOptionsSubPage(options);

        const filteredMenuitemsModuleName = menuItems.filter((item) =>
            valueModuleNameCat?.includes(item.title)
        );

        const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => valueSubModuleNameCat?.includes(item.title));

        const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => valueMainPageCat?.includes(item.title));

        const filteredMenuitemsSubPage = filteredMenuitemsMainPage
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => onlyValues?.includes(item.title));

        const subpagerole = clientmanagerRoleDatas?.subsubpagename?.map(
            (item) => item
        );

        const filteredSubSubModulename = filteredMenuitemsSubPage
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => subpagerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setsubSubPageoptions(filteredSubSubModulename);

        setSelectedOptionsSubSubPage([]);
        setValueSubSubPageCat([]);
        setSubSubPageNameRouteUrl([]);
    };

    const customValueRendererSubPage = (valueSubPageCat, _categoryname) => {
        return valueSubPageCat?.length
            ? valueSubPageCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Page";
    };

    //SubSub Page multiselect
    const [selectedOptionsSubSubPage, setSelectedOptionsSubSubPage] = useState(
        []
    );
    let [valueSubSubPageCat, setValueSubSubPageCat] = useState([]);

    const handleSubSubPageChange = (options) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setSubSubPageNameRouteUrl(urlvalue?.filter(Boolean))

        setValueSubSubPageCat(onlyValues);
        setSelectedOptionsSubSubPage(options);
    };

    const customValueRendererSubSubPage = (valueSubSubPageCat, _categoryname) => {
        return valueSubSubPageCat?.length
            ? valueSubSubPageCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Sub Page";
    };

    //module this is Edit functionality

    //Module  Name multiselect Edit
    const [selectedOptionsModuleNameEdit, setSelectedOptionsModuleNameEdit] = useState(
        []
    );
    let [valueModuleNameCatEdit, setValueModuleNameCatEdit] = useState([]);

    const handleModuleNameChangeEdit = (options, modulename) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];


        options.forEach((option) => {
            if (option.submenu.length === 0) {
                urlvalue.push(option.url);
            }
        });

        setModuleNameRouteUrlEdit(urlvalue?.filter(Boolean))


        setValueModuleNameCatEdit(onlyValues);
        setSelectedOptionsModuleNameEdit(options);

        const filteredMenuitems = menuItems?.filter((item) =>
            onlyValues?.includes(item.title)
        );

        const submodulerole = modulename?.submodulename?.map(
            (item) => item
        );

        const filteredSubModulename = filteredMenuitems
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => submodulerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setSubModuleOptionsEdit(filteredSubModulename);
        setMainPageoptionsEdit([]);
        setSubPageoptionsEdit([]);
        setsubSubPageoptionsEdit([]);

        setSelectedOptionsSubModuleNameEdit([]);
        setValueSubModuleNameCatEdit([]);

        setSelectedOptionsMainPageEdit([]);
        setValueMainPageCatEdit([]);

        setSelectedOptionsSubPageEdit([]);
        setValueSubPageCatEdit([]);

        setSelectedOptionsSubSubPageEdit([]);
        setValueSubSubPageCatEdit([]);
        setSubModuleNameRouteUrlEdit([]);
        setMainPageNameRouteUrlEdit([]);
        setSubPageNameRouteUrlEdit([]);
        setSubSubPageNameRouteUrlEdit([]);
    };

    const customValueRendererModuleNameEdit = (valueModuleNameCatEdit, _categoryname) => {
        return valueModuleNameCatEdit?.length
            ? valueModuleNameCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Module Name";
    };

    //Sub - Module  Name multiselect
    const [selectedOptionsSubModuleNameEdit, setSelectedOptionsSubModuleNameEdit] =
        useState([]);
    let [valueSubModuleNameCatEdit, setValueSubModuleNameCatEdit] = useState([]);

    const handleSubModuleNameChangeEdit = (options, module, value) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });


        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setSubModuleNameRouteUrlEdit(urlvalue?.filter(Boolean))

        setValueSubModuleNameCatEdit(onlyValues);
        setSelectedOptionsSubModuleNameEdit(options);

        const filteredMenuitemsModuleName = menuItems.filter((item) =>
            module?.includes(item.title)
        );

        const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => onlyValues?.includes(item.title));

        const mainpagerole = value?.mainpagename?.map(
            (item) => item
        );

        const filteredSubModulename = filteredMenuitemsSubModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => mainpagerole?.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setMainPageoptionsEdit(filteredSubModulename);
        setSubPageoptionsEdit([]);
        setsubSubPageoptionsEdit([]);

        setSelectedOptionsMainPageEdit([]);
        setValueMainPageCatEdit([]);

        setSelectedOptionsSubPageEdit([]);
        setValueSubPageCatEdit([]);

        setSelectedOptionsSubSubPageEdit([]);
        setValueSubSubPageCatEdit([]);

        setMainPageNameRouteUrlEdit([]);
        setSubPageNameRouteUrlEdit([]);
        setSubSubPageNameRouteUrlEdit([]);
    };

    const customValueRendererSubModuleNameEdit = (
        valueSubModuleNameCatEdit,
        _categoryname
    ) => {
        return valueSubModuleNameCatEdit?.length
            ? valueSubModuleNameCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Module Name";
    };

    //Main Page multiselect
    const [selectedOptionsMainPageEdit, setSelectedOptionsMainPageEdit] = useState([]);
    let [valueMainPageCatEdit, setValueMainPageCatEdit] = useState([]);

    const handleMainPageChangeEdit = (options, modulename, submodulename, hello) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setMainPageNameRouteUrlEdit(urlvalue?.filter(Boolean))

        setValueMainPageCatEdit(onlyValues);
        setSelectedOptionsMainPageEdit(options);

        const filteredMenuitemsModuleName = menuItems.filter((item) =>
            modulename?.includes(item.title)
        );

        const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => submodulename?.includes(item.title));

        const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => onlyValues?.includes(item.title));

        const subpagerole = hello?.subpagename?.map(
            (item) => item
        );

        const filteredSubModulename = filteredMenuitemsMainPage
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => subpagerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setSubPageoptionsEdit(filteredSubModulename);
        setsubSubPageoptionsEdit([]);

        setSelectedOptionsSubPageEdit([]);
        setValueSubPageCatEdit([]);

        setSelectedOptionsSubSubPageEdit([]);
        setValueSubSubPageCatEdit([]);
        setSubPageNameRouteUrlEdit([]);
        setSubSubPageNameRouteUrlEdit([]);
    };

    const customValueRendererMainPageEdit = (valueMainPageCatEdit, _categoryname) => {
        return valueMainPageCatEdit?.length
            ? valueMainPageCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Main Page";
    };

    //Sub Page multiselect
    const [selectedOptionsSubPageEdit, setSelectedOptionsSubPageEdit] = useState([]);
    let [valueSubPageCatEdit, setValueSubPageCatEdit] = useState([]);

    const handleSubPageChangeEdit = (options, modulename, submodulename, mainpagename, hello) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });

        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }

        });

        setSubPageNameRouteUrlEdit(urlvalue?.filter(Boolean))


        setValueSubPageCatEdit(onlyValues);
        setSelectedOptionsSubPageEdit(options);

        const filteredMenuitemsModuleName = menuItems.filter((item) =>
            modulename?.includes(item.title)
        );

        const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => submodulename?.includes(item.title));

        const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => mainpagename?.includes(item.title));

        const filteredMenuitemsSubPage = filteredMenuitemsMainPage
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => onlyValues?.includes(item.title));

        const subpagerole = hello?.subsubpagename?.map(
            (item) => item
        );

        const filteredSubSubModulename = filteredMenuitemsSubPage
            ?.flatMap((menu) => menu.submenu || [])
            ?.filter((item) => subpagerole?.includes(item.title))
            ?.map((item) => {
                return {
                    ...item,
                    label: item.title,
                    value: item.title,
                };
            });

        setsubSubPageoptionsEdit(filteredSubSubModulename);

        setSelectedOptionsSubSubPageEdit([]);
        setValueSubSubPageCatEdit([]);
        setSubSubPageNameRouteUrlEdit([]);
    };

    const customValueRendererSubPageEdit = (valueSubPageCatEdit, _categoryname) => {
        return valueSubPageCatEdit?.length
            ? valueSubPageCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Page";
    };

    //SubSub Page multiselect
    const [selectedOptionsSubSubPageEdit, setSelectedOptionsSubSubPageEdit] = useState(
        []
    );
    let [valueSubSubPageCatEdit, setValueSubSubPageCatEdit] = useState([]);

    const handleSubSubPageChangeEdit = (options) => {
        let onlyValues = options.map((a, index) => {
            return a.value;
        });


        let urlvalue = [];

        options.forEach((option) => {
            // Check if the option itself has a valid URL
            if (option.url !== "") {
                urlvalue.push(option.url);
            }
        });

        setSubSubPageNameRouteUrlEdit(urlvalue?.filter(Boolean))

        setValueSubSubPageCatEdit(onlyValues);
        setSelectedOptionsSubSubPageEdit(options);
    };

    const customValueRendererSubSubPageEdit = (valueSubSubPageCatEdit, _categoryname) => {
        return valueSubSubPageCatEdit?.length
            ? valueSubSubPageCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Sub Page";
    };


    const [isLoading, setIsLoading] = useState(false);
    const [teamAccess, setTeamAccess] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        employee: "Please Select Employee",
        companycode: "", unitcode: "",
        branchcode: "", branchemail: "", branchaddress: "", branchstate: "", branchcity: "", branchcountry: "",
        fromcompany: "Please Select Company",
        frombranch: "Please Select Branch",
        fromunit: "Please Select Unit",
    });
    const [teamAccessEdit, setTeamAccessEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        employee: "Please Select Employee",
        companycode: "", unitcode: "",
        branchcode: "", branchemail: "", branchaddress: "", branchstate: "", branchcity: "", branchcountry: "",
        fromcompany: "Please Select Company",
        frombranch: "Please Select Branch",
        fromunit: "Please Select Unit",
    });
    const [employees, setEmployees] = useState([]);
    const [teamassignBranchEdit, setTeamAssignBranchEdit] = useState({
        company: "", branch: "", unit: "", employee: "",
        fromcompany: "Please Select Company",
        frombranch: "Please Select Branch",
        fromunit: "Please Select Unit",
    });
    const [isTeamAssignBranchForEdit, setIsTeamAssignBranchForEdit] = useState([]);
    const [isBtn, setIsBtn] = useState(false)

    // employee multiselect add
    const [selectedOptionsEmployeeAdd, setSelectedOptionsEmployeeAdd] = useState([]);
    let [valueEmployeeAdd, setValueEmployeeAdd] = useState([]);


    const [assignBranches, setAssignBranches] = useState([]);
    const [assignBranchesOverall, setAssignBranchesOverall] = useState([]);
    const [assignBranchesforDup, setAssignBranchesforDup] = useState([]);
    const [getrowid, setRowGetid] = useState("");
    const [deleteAssignBranch, setDeleteAssignBranch] = useState({});

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    const [isAllAssignBranch, setIsAllAssignBranch] = useState(false);

    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);

    const [copiedData, setCopiedData] = useState("");

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
    };

    // Delete model
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

    // Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // get all employees in the respective company
    const fetchEmployees = async (company, branch, value) => {
        try {
            // let resUsers = await axios.get(SERVICE.USERALLLIMIT, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            let teamwiseUsers = await axios.post(SERVICE.TEAMWISEUSERS, {
                username: isUserRoleAccess.companyname,
                sector: 'all'
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            // console.log(teamwiseUsers?.data)
            let result = teamwiseUsers?.data?.users.filter((data, index) => {
                if (company === data.company && branch === data.branch && value === data.unit)
                    return data
            })
            setEmployees(
                result?.map(data => ({
                    label: data.companyname,
                    value: data.companyname,
                    employee: data.companyname,
                    empcode: data.empcode
                }))
            );

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // employee multi select
    const handleEmployeeChangeAdd = (options) => {
        setValueEmployeeAdd(
            options.map((a, index) => {
                return a.employee + "-" + a.empcode;
            })
        );
        setSelectedOptionsEmployeeAdd(options);
    };

    const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label)?.join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Select Responsible Person</span>;
    };

    // post call
    const sendRequest = async (data) => {
        setIsBtn(true)
        try {
            let assignbranches = await axios.post(SERVICE.ASSIGNBRANCH_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                accesspage: "teamassignbranch",
                fromcompany: teamAccess.fromcompany,
                frombranch: teamAccess.frombranch,
                fromunit: teamAccess.fromunit,

                modulename: valueModuleNameCat,
                submodulename: valueSubModuleNameCat,
                mainpagename: valueMainPageCat,
                subpagename: valueSubPageCat,
                subsubpagename: valueSubSubPageCat,

                // modulenameurl: moduleNameRouteUrl,
                // submodulenameurl: subModuleNameRouteUrl,
                // mainpagenameurl: mainPageNameRouteUrl,
                // subpagenameurl: subPageNameRouteUrl,
                // subsubpagenameurl: subsubPageNameRouteUrl,

                isupdated: Boolean(true),

                modulenameurl: [
                    ...moduleNameRouteUrl,
                    ...subModuleNameRouteUrl,
                    ...mainPageNameRouteUrl,
                    ...subPageNameRouteUrl,
                    ...subsubPageNameRouteUrl
                ],
                submodulenameurl: [
                    ...moduleNameRouteUrl,
                    ...subModuleNameRouteUrl,
                    ...mainPageNameRouteUrl,
                    ...subPageNameRouteUrl,
                    ...subsubPageNameRouteUrl
                ],
                mainpagenameurl: [
                    ...moduleNameRouteUrl,
                    ...subModuleNameRouteUrl,
                    ...mainPageNameRouteUrl,
                    ...subPageNameRouteUrl,
                    ...subsubPageNameRouteUrl
                ],
                subpagenameurl: [
                    ...moduleNameRouteUrl,
                    ...subModuleNameRouteUrl,
                    ...mainPageNameRouteUrl,
                    ...subPageNameRouteUrl,
                    ...subsubPageNameRouteUrl
                ],
                subsubpagenameurl: [
                    ...moduleNameRouteUrl,
                    ...subModuleNameRouteUrl,
                    ...mainPageNameRouteUrl,
                    ...subPageNameRouteUrl,
                    ...subsubPageNameRouteUrl
                ],

                modulenameurlforedit: moduleNameRouteUrl,
                submodulenameurlforedit: subModuleNameRouteUrl,
                mainpagenameurlforedit: mainPageNameRouteUrl,
                subpagenameurlforedit: subPageNameRouteUrl,
                subsubpagenameurlforedit: subsubPageNameRouteUrl,

                company: teamAccess.company,
                branch: teamAccess.branch,
                unit: teamAccess.unit,
                companycode: teamAccess.companycode,
                branchcode: teamAccess.branchcode,
                branchemail: teamAccess.branchemail,
                branchaddress: teamAccess.branchaddress,
                branchstate: teamAccess.branchstate,
                branchcity: teamAccess.branchcity,
                branchcountry: teamAccess.branchcountry,
                branchpincode: teamAccess.branchpincode,
                unitcode: teamAccess.unitcode,
                employee: data?.split("-")[0],
                employeecode: data?.split("-")[1],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllAssignBranch();
            setSelectedOptionsEmployeeAdd([]);
            setValueEmployeeAdd([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    console.log(assignBranchesOverall)
    console.log(valueModuleNameCat)
    console.log(valueEmployeeAdd)

    // submit option for saving....
    const handleSubmit = (e) => {
        e.preventDefault();

        const duplicate = assignBranchesOverall?.some((data) => {
            const isCompanyMatch = data.company === teamAccess.company;
            const isBranchMatch = data.branch === teamAccess?.branch;
            const isUnitMatch = data.unit === teamAccess?.unit;
            const isEmployeeMatch = selectedOptionsEmployeeAdd?.some((item) => item?.value === data?.employee);
            const isFromCompanyMatch = data.fromcompany === teamAccess.fromcompany;
            const isFromBranchMatch = data.frombranch === teamAccess?.frombranch;
            const isFromUnitMatch = data.fromunit === teamAccess?.fromunit;
            const isModuleNameMatch =
                data?.modulename
                    ?.length > 0
                    ? data?.modulename
                        ?.some((item) => valueModuleNameCat?.includes(item))
                    : true;
            const isSubModuleNameMatch =
                data.submodulename?.length > 0
                    ? data.submodulename.some((item) => valueSubModuleNameCat?.includes(item))
                    : true;
            const isMainPageNameMatch =
                data.mainpagename?.length > 0
                    ? data.mainpagename.some((item) => valueMainPageCat?.includes(item))
                    : true;
            const isSubPageNameMatch =
                data.subpagename?.length > 0
                    ? data.subpagename.some((item) => valueSubPageCat?.includes(item))
                    : true;
            const isSubSubPageNameMatch =
                data.subsubpagename?.length > 0
                    ? data.subsubpagename.some((item) => valueSubSubPageCat?.includes(item))
                    : true;

            return (
                isCompanyMatch &&
                isBranchMatch &&
                isUnitMatch &&
                isEmployeeMatch &&
                isFromCompanyMatch &&
                isFromBranchMatch &&
                isFromUnitMatch &&
                isModuleNameMatch &&
                isSubModuleNameMatch &&
                isMainPageNameMatch &&
                isSubPageNameMatch &&
                isSubSubPageNameMatch
            );
        });


        // from
        if (teamAccess.fromcompany === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccess.frombranch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccess.fromunit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsModuleName?.length === 0) {
            setPopupContentMalert("Please Select Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubModuleName?.length === 0) {
            setPopupContentMalert("Please Select Sub Module!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (mainPageoptions?.length > 0 && selectedOptionsMainPage?.length === 0) {
            setPopupContentMalert("Please Select Main Page!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subPageoptions?.length > 0 && selectedOptionsSubPage?.length === 0) {
            setPopupContentMalert("Please Select Sub Page!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subSubPageoptions?.length > 0 && selectedOptionsSubSubPage?.length === 0) {
            setPopupContentMalert("Please Select Sub Sub-Page!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // to
        else if (teamAccess.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccess.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccess.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsEmployeeAdd?.length < 1) {
            setPopupContentMalert("Please Select Responsible Person");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (duplicate) {
            setPopupContentMalert("Data Already Added");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            valueEmployeeAdd?.map(data => {
                sendRequest(data)
            })
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setTeamAccess({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            companycode: "", unitcode: "",
            branchcode: "", branchemail: "", branchaddress: "", branchstate: "", branchcity: "", branchcountry: "",
            fromcompany: "Please Select Company",
            frombranch: "Please Select Branch",
            fromunit: "Please Select Unit",
        });
        setSubModuleOptions([]);
        setMainPageoptions([]);
        setSubPageoptions([]);
        setsubSubPageoptions([]);
        setSelectedOptionsModuleName([])
        setValueModuleNameCat([])
        setSelectedOptionsSubModuleName([])
        setValueSubModuleNameCat([])
        setSelectedOptionsMainPage([])
        setValueMainPageCat([])
        setSelectedOptionsSubPage([])
        setValueSubPageCat([])
        setSelectedOptionsSubSubPage([])
        setValueSubSubPageCat([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    // edit
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            console.log(res?.data?.sassignbranch, 'res?.data?.sassignbranch')
            setTeamAccessEdit(res?.data?.sassignbranch)
            setIsTeamAssignBranchForEdit(assignBranchesOverall.filter((item) => item._id !== e));
            let hello = await fetchClientroleEdit()

            setRowGetid(res?.data?.sassignbranch);
            const moduleName = module?.filter((item) => res?.data?.sassignbranch?.modulename?.includes(item?.title))

            const submoduleName = module
                .flatMap(item =>
                    item.submenu
                        .filter(subItem =>
                            res?.data?.sassignbranch?.submodulename?.includes(subItem?.title)
                        )
                )
                .map(subItem => {
                    // Check if `value` variable is present, if not add `value` and `label` with "HR"
                    if (!('value' in subItem)) {
                        return {
                            ...subItem,
                            value: subItem?.title,
                            label: subItem?.title
                        };
                    }
                    return subItem;
                }); // Filter out null values

            const flattenSubmenu = (submenuArray) => {
                return submenuArray.flatMap(subItem => {
                    if (subItem.submenu) {
                        // Recursively flatten nested submenu arrays
                        return [subItem, ...flattenSubmenu(subItem.submenu)];
                    }
                    return subItem;
                });
            };

            const mainPageName = module
                .flatMap(item => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
                .filter(subItem =>
                    res?.data?.sassignbranch?.mainpagename?.includes(subItem?.title)
                )
                .map(subItem => {
                    // Check if `value` variable is present, if not add `value` and `label` with subItem.title
                    if (!('value' in subItem)) {
                        return {
                            ...subItem,
                            value: subItem?.title,
                            label: subItem?.title
                        };
                    }
                    return subItem;
                });

            const subPageName = module
                .flatMap(item => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
                .filter(subItem =>
                    res?.data?.sassignbranch?.subpagename?.includes(subItem?.title)
                )
                .map(subItem => {
                    // Check if `value` variable is present, if not add `value` and `label` with subItem.title
                    if (!('value' in subItem)) {
                        return {
                            ...subItem,
                            value: subItem?.title,
                            label: subItem?.title
                        };
                    }
                    return subItem;
                });

            const subsubPageName = module
                .flatMap(item => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
                .filter(subItem =>
                    res?.data?.sassignbranch?.subsubpagename?.includes(subItem?.title)
                )
                .map(subItem => {
                    // Check if `value` variable is present, if not add `value` and `label` with subItem.title
                    if (!('value' in subItem)) {
                        return {
                            ...subItem,
                            value: subItem?.title,
                            label: subItem?.title
                        };
                    }
                    return subItem;
                });

            const submodulename = submoduleName
            const mainpage = mainPageName
            const subpage = subPageName
            const subsubpage = subsubPageName

            setMainPageoptionsEdit()
            setSelectedOptionsModuleNameEdit(moduleName)
            setSelectedOptionsSubModuleNameEdit(submodulename)
            setSelectedOptionsMainPageEdit(mainpage)
            setSelectedOptionsSubPageEdit(subpage)
            setSelectedOptionsSubSubPageEdit(subsubpage)

            handleModuleNameChangeEdit(moduleName, hello)
            handleSubModuleNameChangeEdit(submodulename, res?.data?.sassignbranch?.modulename, hello)
            handleMainPageChangeEdit(mainpage, res?.data?.sassignbranch?.modulename, res?.data?.sassignbranch?.submodulename, hello)
            handleSubPageChangeEdit(subpage, res?.data?.sassignbranch?.modulename, res?.data?.sassignbranch?.submodulename, res?.data?.sassignbranch?.mainpagename, hello)
            handleSubSubPageChangeEdit(subsubpage)
            // setModuleNameRouteUrlEdit(res?.data?.sassignbranch?.modulenameurl)
            // setSubModuleNameRouteUrlEdit(res?.data?.sassignbranch?.submodulenameurl)
            // setMainPageNameRouteUrlEdit(res?.data?.sassignbranch?.mainpagenameurl)
            // setSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subpagenameurl)
            // setSubSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subsubpagenameurl)
            setModuleNameRouteUrlEdit(res?.data?.sassignbranch?.modulenameurlforedit)
            setSubModuleNameRouteUrlEdit(res?.data?.sassignbranch?.submodulenameurlforedit)
            setMainPageNameRouteUrlEdit(res?.data?.sassignbranch?.mainpagenameurlforedit)
            setSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subpagenameurlforedit)
            setSubSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subsubpagenameurlforedit)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // get single row to edit....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpenview();
            setTeamAssignBranchEdit(res?.data?.sassignbranch);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const username = isUserRoleAccess.username;

    //branch updatedby edit page....
    let updateby = teamAccessEdit?.updatedby;
    let addedby = teamAccessEdit?.addedby;

    //edit post call
    let assignbranch_id = getrowid?._id;

    // /edit put
    const sendRequestEdit = async () => {
        setIsLoading(true);

        try {
            let assignbranches = await axios.put(`${SERVICE.ASSIGNBRANCH_SINGLE}/${assignbranch_id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromcompany: teamAccessEdit.fromcompany,
                frombranch: teamAccessEdit.frombranch,
                fromunit: teamAccessEdit.fromunit,

                modulename: valueModuleNameCatEdit,
                submodulename: valueSubModuleNameCatEdit,
                mainpagename: valueMainPageCatEdit,
                subpagename: valueSubPageCatEdit,
                subsubpagename: valueSubSubPageCatEdit,

                // modulenameurl: moduleNameRouteUrlEdit,
                // submodulenameurl: subModuleNameRouteUrlEdit,
                // mainpagenameurl: mainPageNameRouteUrlEdit,
                // subpagenameurl: subPageNameRouteUrlEdit,
                // subsubpagenameurl: subsubPageNameRouteUrlEdit,

                isupdated: Boolean(true),

                modulenameurl: [
                    ...moduleNameRouteUrlEdit,
                    ...subModuleNameRouteUrlEdit,
                    ...mainPageNameRouteUrlEdit,
                    ...subPageNameRouteUrlEdit,
                    ...subsubPageNameRouteUrlEdit
                ],
                submodulenameurl: [
                    ...moduleNameRouteUrlEdit,
                    ...subModuleNameRouteUrlEdit,
                    ...mainPageNameRouteUrlEdit,
                    ...subPageNameRouteUrlEdit,
                    ...subsubPageNameRouteUrlEdit
                ],
                mainpagenameurl: [
                    ...moduleNameRouteUrlEdit,
                    ...subModuleNameRouteUrlEdit,
                    ...mainPageNameRouteUrlEdit,
                    ...subPageNameRouteUrlEdit,
                    ...subsubPageNameRouteUrlEdit
                ],
                subpagenameurl: [
                    ...moduleNameRouteUrlEdit,
                    ...subModuleNameRouteUrlEdit,
                    ...mainPageNameRouteUrlEdit,
                    ...subPageNameRouteUrlEdit,
                    ...subsubPageNameRouteUrlEdit
                ],
                subsubpagenameurl: [
                    ...moduleNameRouteUrlEdit,
                    ...subModuleNameRouteUrlEdit,
                    ...mainPageNameRouteUrlEdit,
                    ...subPageNameRouteUrlEdit,
                    ...subsubPageNameRouteUrlEdit
                ],

                modulenameurlforedit: moduleNameRouteUrlEdit,
                submodulenameurlforedit: subModuleNameRouteUrlEdit,
                mainpagenameurlforedit: mainPageNameRouteUrlEdit,
                subpagenameurlforedit: subPageNameRouteUrlEdit,
                subsubpagenameurlforedit: subsubPageNameRouteUrlEdit,



                company: teamAccessEdit.company,
                branch: teamAccessEdit.branch,
                unit: teamAccessEdit.unit,
                companycode: teamAccessEdit.companycode,
                branchcode: teamAccessEdit.branchcode,
                branchemail: teamAccessEdit.branchemail,
                branchaddress: teamAccessEdit.branchaddress,
                branchstate: teamAccessEdit.branchstate,
                branchcity: teamAccessEdit.branchcity,
                branchcountry: teamAccessEdit.branchcountry,
                branchpincode: teamAccessEdit.branchpincode,
                unitcode: teamAccessEdit.unitcode,
                employee: teamAccessEdit?.employeeset,
                employeecode: teamAccessEdit?.employeecode,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllAssignBranch();
            handleCloseModEdit();
            setIsLoading(false);
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setIsLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const editSubmit = async (e) => {
        e.preventDefault();

        const duplicate = isTeamAssignBranchForEdit?.some((data) => {
            const isCompanyMatch = data.company === teamAccessEdit.company;
            const isBranchMatch = data.branch === teamAccessEdit?.branch;
            const isUnitMatch = data.unit === teamAccessEdit?.unit;
            const isEmployeeMatch = data.employee === teamAccessEdit?.employee;
            const isFromCompanyMatch = data.fromcompany === teamAccessEdit.fromcompany;
            const isFromBranchMatch = data.frombranch === teamAccessEdit?.frombranch;
            const isFromUnitMatch = data.fromunit === teamAccessEdit?.fromunit;
            const isModuleNameMatch =
                data.modulename
                    ?.length > 0
                    ? data.modulename
                        .some((item) => valueModuleNameCatEdit?.includes(item))
                    : true;
            const isSubModuleNameMatch =
                data.submodulename?.length > 0
                    ? data.submodulename.some((item) => valueSubModuleNameCatEdit?.includes(item))
                    : true;
            const isMainPageNameMatch =
                data.mainpagename?.length > 0
                    ? data.mainpagename.some((item) => valueMainPageCatEdit?.includes(item))
                    : true;
            const isSubPageNameMatch =
                data.subpagename?.length > 0
                    ? data.subpagename.some((item) => valueSubPageCatEdit?.includes(item))
                    : true;
            const isSubSubPageNameMatch =
                data.subsubpagename?.length > 0
                    ? data.subsubpagename.some((item) => valueSubSubPageCatEdit?.includes(item))
                    : true;

            return (
                isCompanyMatch &&
                isBranchMatch &&
                isUnitMatch &&
                isEmployeeMatch &&
                isFromCompanyMatch &&
                isFromBranchMatch &&
                isFromUnitMatch &&
                isModuleNameMatch &&
                isSubModuleNameMatch &&
                isMainPageNameMatch &&
                isSubPageNameMatch &&
                isSubSubPageNameMatch
            );
        });


        // from
        if (teamAccessEdit.fromcompany === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccessEdit.frombranch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccessEdit.fromunit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsModuleNameEdit.length === 0) {
            setPopupContentMalert("Please Select Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubModuleNameEdit.length === 0) {
            setPopupContentMalert("Please Select Sub Module!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (mainPageoptionsEdit?.length > 0 && selectedOptionsMainPageEdit?.length === 0) {
            setPopupContentMalert("Please Select Main Page!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subPageoptionsEdit?.length > 0 && selectedOptionsSubPageEdit?.length === 0) {
            setPopupContentMalert("Please Select Sub Page!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subSubPageoptionsEdit?.length > 0 && selectedOptionsSubSubPageEdit?.length === 0) {
            setPopupContentMalert("Please Select Sub Sub-Page!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        //  to
        else if (teamAccessEdit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccessEdit.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccessEdit.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamAccessEdit?.employee === "Please Select Employee") {
            setPopupContentMalert("Please Select Responsible Person");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (duplicate) {
            setPopupContentMalert("Data Already Added");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            await sendRequestEdit(); // Make sure to wait for the asynchronous function to complete
        }
    };

    // view
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTeamAssignBranchEdit(res?.data?.sassignbranch);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // List start
    // get all assignBranches
    const fetchAllAssignBranch = async () => {
        try {
            const [res] = await Promise.all([
                axios.get(SERVICE.ASSIGNBRANCH, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ]);
            const result = res?.data?.assignbranch.map((data, index) => {
                let resdata = { ...data, isownaccess: false }
                if (data.fromcompany === data.company && data.frombranch === data.branch && data.fromunit === data.unit) {
                    resdata = { ...data, isownaccess: true }
                }

                return resdata
            })
            setAssignBranches(result.filter((item) =>
                accessbranch.some(
                    (branch) =>
                        item.company.includes(branch.company) &&
                        item.branch.includes(branch.branch) &&
                        item.unit.includes(branch.unit) &&
                        item?.accesspage === "teamassignbranch",
                )
            ).map((item, index) => ({
                ...item, serialNumber: index + 1,
                modulename: item.modulename?.join(","),
                submodulename: item.submodulename?.join(","),
                mainpagename: item.mainpagename?.join(","),
                subpagename: item.subpagename?.join(","),
                subsubpagename: item.subsubpagename?.join(","),
            })));
            setAssignBranchesOverall(result.filter((item) =>
                accessbranch.some(
                    (branch) =>
                        item.company.includes(branch.company) &&
                        item.branch.includes(branch.branch) &&
                        item.unit.includes(branch.unit) &&
                        item?.accesspage === "teamassignbranch",
                )
            ).map((item, index) => ({
                ...item, serialNumber: index + 1,
                modulename: item.modulename,
                submodulename: item.submodulenam,
                mainpagename: item.mainpagename,
                subpagename: item.subpagename,
                subsubpagename: item.subsubpagename,
            })));
            setIsAllAssignBranch(true);
        } catch (err) { setIsAllAssignBranch(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchAllAssignBranchEdit = async (e) => {
        try {
            let res = await axios.get(SERVICE.ASSIGNBRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setIsTeamAssignBranchForEdit(res?.data?.assignbranch.filter((item) => item._id !== e));
            setIsAllAssignBranch(true);
        } catch (err) { setIsAllAssignBranch(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchAllAssignBranch();
    }, []);

    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(assignBranches);
    }, [assignBranches]);

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
        return searchTerms.every((term) => Object.values(item)?.join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        fromcompany: true,
        frombranch: true,
        fromunit: true,
        company: true,
        branch: true,
        unit: true,
        employee: true,
        employeecode: true,

        modulename: true,
        submodulename: true,
        mainpagename: true,
        subpagename: true,
        subsubpagename: true,

        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteAssignBranch(res?.data?.sassignbranch);
            handleClickOpendel();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let assignbranchid = deleteAssignBranch._id;

    const delBranch = async () => {
        try {
            await axios.delete(`${SERVICE.ASSIGNBRANCH_SINGLE}/${assignbranchid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchAllAssignBranch();
            setPage(1);
            setSelectedRows([]);
            setPage(1);
            handleCloseDel()
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err, 'err')
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delBranchcheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ASSIGNBRANCH_SINGLE}/${item}`, {
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

            await fetchAllAssignBranch();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
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
            width: 60,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "employeecode", headerName: "Emp Code", flex: 0, width: 200, hide: !columnVisibility.employeecode, headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "employee",
            headerName: "Employee Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.employee,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        // from
        { field: "fromcompany", headerName: "From Company", flex: 0, width: 200, hide: !columnVisibility.fromcompany, headerClassName: "bold-header" },
        { field: "frombranch", headerName: " From Branch", flex: 0, width: 200, hide: !columnVisibility.frombranch, headerClassName: "bold-header" },
        { field: "fromunit", headerName: " From Unit", flex: 0, width: 200, hide: !columnVisibility.fromunit, headerClassName: "bold-header" },

        { field: "modulename", headerName: "Module", flex: 0, width: 200, hide: !columnVisibility.modulename, headerClassName: "bold-header" },
        { field: "submodulename", headerName: "Sub Module", flex: 0, width: 200, hide: !columnVisibility.submodulename, headerClassName: "bold-header" },
        { field: "mainpagename", headerName: "Main Page", flex: 0, width: 200, hide: !columnVisibility.mainpagename, headerClassName: "bold-header" },
        { field: "subpagename", headerName: "Sub Page", flex: 0, width: 200, hide: !columnVisibility.subpagename, headerClassName: "bold-header" },
        { field: "subsubpagename", headerName: "Sub Sub Page", flex: 0, width: 200, hide: !columnVisibility.subsubpagename, headerClassName: "bold-header" },
        // to
        { field: "company", headerName: "To Company", flex: 0, width: 200, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: " To Branch", flex: 0, width: 200, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: " To Unit", flex: 0, width: 200, hide: !columnVisibility.unit, headerClassName: "bold-header" },
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

                    {isUserRoleCompare?.includes("eteamaccessible")
                        // && params.data.isownaccess === false
                        && (
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {

                                    getCode(params.data.id);
                                    // fetchAllAssignBranchEdit(params.data.id)
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        )}
                    {isUserRoleCompare?.includes("dteamaccessible") && params.data.isownaccess === false && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vteamaccessible") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iteamaccessible") && (
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
            fromcompany: item.fromcompany,
            frombranch: item.frombranch,
            fromunit: item.fromunit,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            employee: item?.employee,
            employeecode: item?.employeecode,
            isownaccess: item.isownaccess,

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
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // // Function to filter columns based on search query
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
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: " Team Accessible Company/Branch/Unit",
        pageStyle: "print",
    });

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Team Accessible Company/Branch/Unit.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    return (
        <>
            <Headtitle title={"TEAM ACCESSIBLE COMPANY/BRANCH/UNIT"} />
            {/* <Typography sx={userStyle.HeaderText}>Team Accessible Company/Branch/Unit</Typography> */}
            <PageHeading
                title="Team Accessible Company/Branch/Unit"
                modulename="Human Resources"
                submodulename="Facility"
                mainpagename="Team Accessible"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("ateamaccessible") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.SubHeaderText}> Add Team Accessible Company/Branch/Unit</Typography>
                        <br /> <br /> <br />
                        <>
                            <form onSubmit={handleSubmit}>

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>From </Typography>
                                    </Grid>
                                    <br />
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                    companycode: data.companycode,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{ label: teamAccess.fromcompany, value: teamAccess.fromcompany }}
                                                onChange={(e) => {
                                                    setTeamAccess({ ...teamAccess, fromcompany: e.value, companycode: e.companycode, frombranch: "Please Select Branch", fromunit: "Please Select Unit" });

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
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        teamAccess.fromcompany === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                    branchpincode: data.branchpincode,
                                                    branchcountry: data.branchcountry,
                                                    branchcity: data.branchcity,
                                                    branchstate: data.branchstate,
                                                    branchaddress: data.branchaddress,
                                                    branchcode: data.branchcode,
                                                    branchemail: data.branchemail,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{ label: teamAccess.frombranch, value: teamAccess.frombranch }}
                                                onChange={(e) => {
                                                    setTeamAccess({ ...teamAccess, frombranch: e.value, branchpincode: e.branchpincode, branchcountry: e.branchcountry, branchcity: e.branchcity, branchstate: e.branchstate, branchaddress: e.branchaddress, branchemail: e.branchemail, branchcode: e.branchcode, fromunit: "Please Select Unit" });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        teamAccess.fromcompany === comp.company && teamAccess.frombranch === comp.branch
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                    unitcode: data.unitcode,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{ label: teamAccess.fromunit, value: teamAccess.fromunit }}
                                                onChange={(e) => {
                                                    setTeamAccess({ ...teamAccess, fromunit: e.value, unitcode: e.unitcode });


                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Module Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                size="small"
                                                options={moduleOptions}
                                                value={selectedOptionsModuleName}
                                                onChange={(e) => {
                                                    handleModuleNameChange(e);
                                                }}
                                                valueRenderer={customValueRendererModuleName}
                                                labelledBy="Please Select Module Name"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub-Module Name{" "}
                                                {subModuleOptions?.length > 0 && (
                                                    <b style={{ color: "red" }}>*</b>
                                                )}
                                            </Typography>
                                            <MultiSelect
                                                size="small"
                                                options={subModuleOptions}
                                                value={selectedOptionsSubModuleName}
                                                onChange={(e) => {
                                                    handleSubModuleNameChange(e);
                                                }}
                                                valueRenderer={customValueRendererSubModuleName}
                                                labelledBy="Please Select Sub Module Name"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Main Page Name{" "}
                                                {mainPageoptions?.length > 0 && (
                                                    <b style={{ color: "red" }}>*</b>
                                                )}
                                            </Typography>
                                            <MultiSelect
                                                size="small"
                                                options={mainPageoptions}
                                                value={selectedOptionsMainPage}
                                                onChange={(e) => {
                                                    handleMainPageChange(e);
                                                }}
                                                valueRenderer={customValueRendererMainPage}
                                                labelledBy="Please Select Main Page"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub-Page Name{" "}
                                                {subPageoptions?.length > 0 && (
                                                    <b style={{ color: "red" }}>*</b>
                                                )}
                                            </Typography>
                                            <MultiSelect
                                                size="small"
                                                options={subPageoptions}
                                                value={selectedOptionsSubPage}
                                                onChange={(e) => {
                                                    handleSubPageChange(e);
                                                }}
                                                valueRenderer={customValueRendererSubPage}
                                                labelledBy="Please Select Sub Page"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub-Sub-Page Name{" "}
                                                {subSubPageoptions?.length > 0 && (
                                                    <b style={{ color: "red" }}>*</b>
                                                )}
                                            </Typography>
                                            <MultiSelect
                                                size="small"
                                                options={subSubPageoptions}
                                                value={selectedOptionsSubSubPage}
                                                onChange={(e) => {
                                                    handleSubSubPageChange(e);
                                                }}
                                                valueRenderer={customValueRendererSubSubPage}
                                                labelledBy="Please Select Sub Sub Page"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography>To </Typography>
                                    </Grid>
                                    <br />
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{ label: teamAccess.company, value: teamAccess.company }}
                                                onChange={(e) => {
                                                    setEmployees([]);
                                                    setTeamAccess({ ...teamAccess, company: e.value, companycode: e.companycode, branch: "Please Select Branch", unit: "Please Select Unit" });

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
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        teamAccess.company === comp.company
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{ label: teamAccess.branch, value: teamAccess.branch }}
                                                onChange={(e) => {
                                                    setEmployees([]);
                                                    setTeamAccess({ ...teamAccess, branch: e.value, branchpincode: e.branchpincode, branchcountry: e.branchcountry, branchcity: e.branchcity, branchstate: e.branchstate, branchaddress: e.branchaddress, branchemail: e.branchemail, branchcode: e.branchcode, unit: "Please Select Unit" });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={accessbranch?.filter(
                                                    (comp) =>
                                                        teamAccess.company === comp.company && teamAccess.branch === comp.branch
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                styles={colourStyles}
                                                value={{ label: teamAccess.unit, value: teamAccess.unit }}
                                                onChange={(e) => {
                                                    fetchEmployees(teamAccess.company, teamAccess.branch, e.value);
                                                    setTeamAccess({ ...teamAccess, unit: e.value, unitcode: e.unitcode });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} lg={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Responsible Person <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small" options={employees} value={selectedOptionsEmployeeAdd} onChange={handleEmployeeChangeAdd} valueRenderer={customValueRendererEmployeeAdd} />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={2.5} xs={12} sm={6}>
                                        <>
                                            <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit" disabled={isBtn}>
                                                Submit
                                            </Button>
                                        </>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={6}>
                                        <>
                                            <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                                Clear
                                            </Button>
                                        </>
                                    </Grid>
                                </Grid>
                            </form>
                        </>
                    </Box>
                    <br />
                </>
            )}
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lteamaccessible") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Team Accessible Company/Branch/Unit List </Typography>
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
                                        <MenuItem value={assignBranches?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelteamaccessible") && (
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
                                    {isUserRoleCompare?.includes("csvteamaccessible") && (
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
                                    {isUserRoleCompare?.includes("printteamaccessible") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfteamaccessible") && (
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
                                    {isUserRoleCompare?.includes("imageteamaccessible") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                                    maindatas={assignBranches}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={assignBranches}
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
                        {/* {isUserRoleCompare?.includes("bdteamaccessible") && (
              <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )} */}
                        <br />
                        <br />
                        {!isAllAssignBranch ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
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
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={assignBranches}
                                        />
                                    </>
                                </Box>

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

            {/* ****** Table End ****** */}

            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="md"
                    sx={{ marginTop: "47px" }}

                >
                    <Box sx={{ padding: "30px", minWidth: "750px" }}>
                        <Typography sx={userStyle.SubHeaderText}> Edit Team Accessible Company/Branch/Unit</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>From </Typography>
                            </Grid>
                            <br />
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={accessbranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                            companycode: data.companycode,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.fromcompany, value: teamAccessEdit.fromcompany }}
                                        onChange={(e) => {
                                            setTeamAccessEdit({ ...teamAccessEdit, fromcompany: e.value, companycode: e.companycode, frombranch: "Please Select Branch", fromunit: "Please Select Unit" });
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
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                teamAccessEdit.fromcompany === comp.company
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                            branchpincode: data.branchpincode,
                                            branchcountry: data.branchcountry,
                                            branchcity: data.branchcity,
                                            branchstate: data.branchstate,
                                            branchaddress: data.branchaddress,
                                            branchcode: data.branchcode,
                                            branchemail: data.branchemail,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.frombranch, value: teamAccessEdit.frombranch }}
                                        onChange={(e) => {
                                            setTeamAccessEdit({ ...teamAccessEdit, frombranch: e.value, branchpincode: e.branchpincode, branchcountry: e.branchcountry, branchcity: e.branchcity, branchstate: e.branchstate, branchaddress: e.branchaddress, branchemail: e.branchemail, branchcode: e.branchcode, fromunit: "Please Select Unit" });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                teamAccessEdit.fromcompany === comp.company && teamAccessEdit.frombranch === comp.branch
                                        )?.map(data => ({
                                            label: data.unit,
                                            value: data.unit,
                                            unitcode: data.unitcode,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.fromunit, value: teamAccessEdit.fromunit }}
                                        onChange={(e) => {
                                            setTeamAccessEdit({ ...teamAccessEdit, unitcode: e.unitcode, fromunit: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Module Name <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        size="small"
                                        options={moduleOptionsEdit}
                                        value={selectedOptionsModuleNameEdit}
                                        onChange={async (e) => {
                                            let hello = await fetchClientroleEdit();
                                            handleModuleNameChangeEdit(e, hello);
                                        }}
                                        valueRenderer={customValueRendererModuleNameEdit}
                                        labelledBy="Please Select Module Name"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub-Module Name{" "}
                                        {subModuleOptionsEdit?.length > 0 && (
                                            <b style={{ color: "red" }}>*</b>
                                        )}
                                    </Typography>
                                    <MultiSelect
                                        size="small"
                                        options={subModuleOptionsEdit}
                                        value={selectedOptionsSubModuleNameEdit}
                                        onChange={async (e) => {
                                            let hello = await fetchClientroleEdit();
                                            handleSubModuleNameChangeEdit(e, valueModuleNameCatEdit, hello);
                                        }}
                                        valueRenderer={customValueRendererSubModuleNameEdit}
                                        labelledBy="Please Select Sub Module Name"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Main Page Name{" "}
                                        {mainPageoptionsEdit?.length > 0 && (
                                            <b style={{ color: "red" }}>*</b>
                                        )}
                                    </Typography>
                                    <MultiSelect
                                        size="small"
                                        options={mainPageoptionsEdit}
                                        value={selectedOptionsMainPageEdit}
                                        onChange={async (e) => {
                                            let hello = await fetchClientroleEdit();
                                            handleMainPageChangeEdit(e, valueModuleNameCatEdit, valueSubModuleNameCatEdit, hello);
                                        }}
                                        valueRenderer={customValueRendererMainPageEdit}
                                        labelledBy="Please Select Main Page"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub-Page Name{" "}
                                        {subPageoptionsEdit?.length > 0 && (
                                            <b style={{ color: "red" }}>*</b>
                                        )}
                                    </Typography>
                                    <MultiSelect
                                        size="small"
                                        options={subPageoptionsEdit}
                                        value={selectedOptionsSubPageEdit}
                                        onChange={async (e) => {
                                            let hello = await fetchClientroleEdit();
                                            handleSubPageChangeEdit(e, valueModuleNameCatEdit, valueSubModuleNameCatEdit, valueMainPageCatEdit, hello);
                                        }}
                                        valueRenderer={customValueRendererSubPageEdit}
                                        labelledBy="Please Select Sub Page"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub-Sub-Page Name{" "}
                                        {subSubPageoptionsEdit?.length > 0 && (
                                            <b style={{ color: "red" }}>*</b>
                                        )}
                                    </Typography>
                                    <MultiSelect
                                        size="small"
                                        options={subSubPageoptionsEdit}
                                        value={selectedOptionsSubSubPageEdit}
                                        onChange={(e) => {
                                            handleSubSubPageChangeEdit(e);
                                        }}
                                        valueRenderer={customValueRendererSubSubPageEdit}
                                        labelledBy="Please Select Sub Sub Page"
                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>To </Typography>
                            </Grid>
                            <br />
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={accessbranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.company, value: teamAccessEdit.company }}
                                        onChange={(e) => {
                                            setTeamAccessEdit({
                                                ...teamAccessEdit,
                                                company: e.value,
                                                companycode: e.companycode,
                                                branch: "Please Select Branch",
                                                unit: "Please Select Unit",
                                                employee: "Please Select Responsible Person",
                                            });
                                            setEmployees([])

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                teamAccessEdit.company === comp.company
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.branch, value: teamAccessEdit.branch }}
                                        onChange={(e) => {
                                            setTeamAccessEdit({
                                                ...teamAccessEdit,
                                                branch: e.value,
                                                branchpincode: e.branchpincode,
                                                branchcountry: e.branchcountry,
                                                branchcity: e.branchcity,
                                                branchstate: e.branchstate,
                                                branchaddress: e.branchaddress,
                                                branchemail: e.branchemail,
                                                branchcode: e.branchcode,
                                                unit: "Please Select Unit",
                                                employee: "Please Select Responsible Person",
                                            });
                                            setEmployees([])

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                teamAccessEdit.company === comp.company && teamAccessEdit.branch === comp.branch
                                        )?.map(data => ({
                                            label: data.unit,
                                            value: data.unit,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.unit, value: teamAccessEdit.unit }}
                                        onChange={(e) => {
                                            fetchEmployees(teamAccessEdit.company, teamAccessEdit.branch, e.value);
                                            setTeamAccessEdit({
                                                ...teamAccessEdit,
                                                unitcode: e.unitcode,
                                                unit: e.value,
                                                employee: "Please Select Responsible Person",
                                            });
                                            setEmployees([])

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Responsible Person <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={employees}
                                        styles={colourStyles}
                                        value={{ label: teamAccessEdit.employee, value: teamAccessEdit.employee }}
                                        onChange={(e) => {
                                            setTeamAccessEdit({ ...teamAccessEdit, employee: e.value, employeeset: e.employee, employeecode: e.empcode });
                                        }}
                                    />
                                </FormControl>
                                <br />
                                <br />
                                <br />
                                <br />
                            </Grid>
                            <Grid container>
                                <br />
                                <Grid item md={1}></Grid>
                                {isLoading ? (
                                    <>
                                        <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                                            <CircularProgress color="inherit" />
                                        </Backdrop>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                            Update
                                        </Button>
                                        <Grid item md={1}></Grid>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Dialog>
            </Box>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                fullWidth={true} maxWidth="md" sx={{ marginTop: "47px" }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Team Accessible Company/Branch/Unit Details</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>From</Typography>
                            </Grid>
                            <br />
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{teamassignBranchEdit?.fromcompany}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{teamassignBranchEdit?.frombranch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{teamassignBranchEdit?.fromunit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module</Typography>
                                    <Typography>{teamassignBranchEdit?.modulename?.join(", ")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Module</Typography>
                                    <Typography>{teamassignBranchEdit?.submodulename?.join(", ")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Main Page</Typography>
                                    <Typography>{teamassignBranchEdit?.mainpagename?.join(", ")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Page</Typography>
                                    <Typography>{teamassignBranchEdit?.subpagename?.join(", ")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Sub Page</Typography>
                                    <Typography>{teamassignBranchEdit?.subsubpagename?.join(", ")}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography>To</Typography>
                            </Grid>
                            <br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{teamassignBranchEdit?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{teamassignBranchEdit?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{teamassignBranchEdit?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Responsible Person</Typography>
                                    <Typography>{teamassignBranchEdit?.employee}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
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
                itemsTwo={assignBranches ?? []}
                filename={"Team Accessible Company/Branch/Unit"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Team Accessible Company/Branch/Unit Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseDel}
                onConfirm={delBranch}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delBranchcheckbox}
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
            <br />


        </>
    );
};

export default TeamAccessible;