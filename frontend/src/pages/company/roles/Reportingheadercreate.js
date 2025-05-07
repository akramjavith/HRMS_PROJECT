import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Checkbox, Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import { Link } from "react-router-dom";
import axios from "axios";
import html2canvas from 'html2canvas';
import { saveAs } from "file-saver";
import { handleApiError } from "../../../components/Errorhandling";
import ImageIcon from '@mui/icons-material/Image';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ThreeDots } from "react-loader-spinner";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { MultiSelect } from "react-multi-select-component";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import { menuItems } from "../../../components/menuItemsList";
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import { RestrictionList } from "../../../components/RestrictionList";
import domtoimage from 'dom-to-image';

function ReportingHeaderCreate() {
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
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

    let exportColumnNames = ['Header Name', 'Module', 'Sub Module', 'Main Page', 'Sub Page', 'Sub Sub-Page'];
    let exportRowValues = ['name', 'module', 'submodule', 'mainpage', 'subpage', 'subsubpage'];

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
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
    const gridRef = useRef(null);
    const [loader, setLoader] = useState(false);
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Reporting Header.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const { isUserRoleCompare, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("");
    // State for manage columns search query
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
    const [isBtn, setIsBtn] = useState(false);
    const [overallExcelDatas, setOverallExcelDatas] = useState([])
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Reporting Header"),
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


    // get all branches
    const fetchOverallExcelDatas = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.REPORTINGHEADER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setOverallExcelDatas(res?.data?.reportingheaders);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchOverallExcelDatas();
    }, [isFilterOpen])

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        checkbox: true,
        actions: true,
        name: true,
        serialNumber: true,
        module: true,
        submodule: true,
        mainpage: true,
        subpage: true,
        subsubpage: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    //datatable....
    const [items, setItems] = useState([]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    // restriction code
    const [moduelOptions, setModuleOptions] = useState([]);

    useEffect(() => {
        function findAllSubmodules(data, searchTerms) {
            let matches = [];

            for (let item of data) {
                // Check if the current item's title is in the searchTerms array
                if (searchTerms.includes(item.title)) {
                    matches.push({ title: item?.title, dbname: item?.dbname }); // Add matched item to results
                }

                // If submenu exists, search recursively
                if (item.submenu && item.submenu.length > 0) {
                    const subItemsMatches = findAllSubmodules(item.submenu, searchTerms); // Search submenu recursively
                    if (subItemsMatches.length > 0) {
                        // If any subItem matches, include the current item with the matched subItems
                        matches.push({
                            title: item.title,
                            dbname: item?.dbname,
                            submenu: subItemsMatches
                        });
                    }
                }
            }

            return matches; // Return all matches found in this level of recursion
        }


        const result = findAllSubmodules(menuItems, RestrictionList);
        setModuleOptions(result)
        if (result.length > 0) {
            console.log('Found matching objects:', result);
        } else {
            console.log('No matches found');
        }
    }, [])

    const module =
        moduelOptions?.length > 0 ?
            moduelOptions?.map((data) => ({
                ...data,
                label: data.title,
                value: data.title,
            })) : [];

    // const module =
    //     menuItems.length > 0 &&
    //     menuItems?.map((data) => ({
    //         ...data,
    //         label: data.title,
    //         value: data.title,
    //     }));

    const [reportingheaderName, setReportingheaderName] = useState("");
    const [reportingsNewList, setReportingsNewList] = useState([]);
    const [selectedModuleName, setSelectedModuleName] = useState([]);
    const [subModuleOptions, setSubModuleOptions] = useState([]);
    const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
    const [mainPageoptions, setMainPageoptions] = useState([]);
    const [selectedMainPageName, setSelectedMainPageName] = useState([]);
    const [subPageoptions, setSubPageoptions] = useState([]);
    const [subSubPageoptions, setsubSubPageoptions] = useState([]);
    const [selectedSubPageName, setSelectedSubPageName] = useState([]);
    const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);
    const [moduleTitleNames, setModuleTitleNames] = useState([]);
    const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
    const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
    const [subPageTitleNames, setSubPageTitleNames] = useState([]);
    const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);
    const [moduleDbNames, setModuleDbNames] = useState([]);
    const [subModuleDbNames, setSubModuleDbNames] = useState([]);
    const [mainPageDbNames, setMainPageDbNames] = useState([]);
    const [subPageDbNames, setSubPageDbNames] = useState([]);
    const [subSubPageDbNames, setSubSubPageDbNames] = useState([]);

    //setting an module names into array
    const handleModuleChange = (options) => {
        let ans = options.map((a, index) => {
            return a.value;
        });
        setModuleTitleNames(ans);
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setModuleDbNames(dbNames);
        //subModuleDropDown Names
        let subModu = moduelOptions?.filter((data) => ans.includes(data.title));
        let Submodule = subModu.length > 0 ? subModu?.map((item) => item.submenu) : [];
        let singleArray = Submodule.length > 0 ? [].concat(...Submodule) : [];
        //Removing Add in the list
        let filteredArray =
            singleArray.length > 0 ?
                singleArray.filter((innerArray) => {
                    return !innerArray.title.startsWith("123 ");
                }) : [];

        setSubModuleOptions(
            filteredArray.length > 0 ?
                filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                })) : []
        );
        setMainPageoptions([])
        setsubSubPageoptions([])
        setSubPageoptions([])
        setSelectedModuleName(options);
    };

    //rendering function for options(value field with comma)
    const customValueRendererModule = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Module";
    };

    //setting an Sub module names into array
    const handleSubModuleChange = (options) => {

        let submodAns = options.map((a, index) => {
            return a.value;
        });
        setSubModuleTitleNames(submodAns);
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setSubModuleDbNames(dbNames);
        let subModu = subModuleOptions.filter((data) => submodAns.includes(data.title));
        let mainPage =
            subModu.length > 0 &&
            subModu
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        let filteredArray =
            mainPage.length > 0 &&
            mainPage.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
            });
        let mainPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setMainPageoptions(mainPageDropDown);
        setsubSubPageoptions([])
        setSubPageoptions([])
        setSelectedSubModuleName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererSubModule = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Module";
    };

    //setting an Main Page names into array
    const handleMainPageChange = (options) => {

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
        let mainPageFilt = mainPageoptions.filter((data) => mainpageAns.includes(data.title));

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
                return !innerArray.title.startsWith("123 ");
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
        setsubSubPageoptions([])
        setSelectedMainPageName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererMainPage = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Main-Page";
    };

    //setting an Main Page names into array
    const handleSubPageChange = (options) => {
        let subPageAns = options.map((a, index) => {
            return a.value;
        });
        setSubPageTitleNames(subPageAns);
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setSubPageDbNames(dbNames);

        let subPageFilt = subPageoptions.filter((data) => subPageAns.includes(data.title));
        let controlDrop =
            subPageFilt.length > 0 &&
            subPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        let filteredArray =
            controlDrop.length > 0 &&
            controlDrop.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
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
        setsubSubPageoptions(subPageDropDown);
        setSelectedSubPageName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRendererSubPage = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub-Page";
    };
    //setting an Main Page names into array
    const handleSubSubPageChange = (options) => {
        let subPageAns = options.map((a, index) => {
            return a.value;
        });
        setSubSubPageTitleNames(subPageAns);
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setSubSubPageDbNames(dbNames);

        let subPageFilt = subPageoptions.filter((data) => subPageAns.includes(data.title));

        let controlDrop =
            subPageFilt.length > 0 &&
            subPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();


        setSelectedSubSubPageName(options);
    };
    //rendering function for options(value field with comma)
    const customValueRenderersubSubPage = (valueCate, _categories) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Sub-Page";
    };

    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess } = useContext(UserRoleAccessContext);

    const username = isUserRoleAccess.username;
    const handleSubmit = () => {
        if (reportingheaderName === "" || reportingheaderName === undefined) {
            setPopupContentMalert("Please Enter Header Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (moduleTitleNames.length < 1) {
            setPopupContentMalert("Please Select Module Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (subModuleTitleNames.length < 1) {
            setPopupContentMalert("Please Select Sub-Module Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchReportingHeader();
        }
    };

    const handleClear = () => {
        setReportingheaderName("");
        setSelectedModuleName([]);
        setSelectedSubModuleName([]);
        setSelectedMainPageName([]);
        setSelectedSubPageName([]);
        setSubModuleTitleNames([]);
        setMainPageDbNames([]);
        setModuleTitleNames([]);
        setSubPageTitleNames([]);
        setSubSubPageTitleNames([]);
        setSelectedSubSubPageName([]);
        setMainPageoptions([])
        setSubModuleOptions([])
        setSubPageoptions([])
        setsubSubPageoptions([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //add function...
    const fetchReportingHeader = async () => {
        setPageName(!pageName);
        setIsBtn(true)
        try {
            let roles = await axios.post(`${SERVICE.REPORTINGHEADER_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: String(reportingheaderName),
                modulename: moduleTitleNames,
                submodulename: subModuleTitleNames,
                mainpagename: mainPageTitleNames,
                subpagename: subPageTitleNames,
                subsubpagename: subsubPageTitleNames,
                reportingnew: [...moduleDbNames, ...subModuleDbNames, ...mainPageDbNames, ...subPageDbNames, ...subSubPageDbNames],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchNewReportingList();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setReportingheaderName("");
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get all branches
    const fetchNewReportingList = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.REPORTINGHEADER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setReportingsNewList(res?.data?.reportingheaders.map((item, index) => ({
                id: item._id,
                serialNumber: index + 1,
                name: item.name,
                module: item.modulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                submodule: item.submodulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                mainpage: item.mainpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                subpage: item.subpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                subsubpage: item.subsubpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),

            })));
            setLoader(true);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchNewReportingList();
    }, []);
    const addSerialNumber = (datas) => {
        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(reportingsNewList);
    }, [reportingsNewList]);

    //datatable....
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    const [reportingsedit, setReportingsedit] = useState([]);
    let updateby = reportingsedit?.updatedby;
    let addedby = reportingsedit?.addedby;
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.REPORTINGHEADER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setReportingsedit(res?.data?.sreportingheader);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //View functionalities...
    const [openview, setOpenview] = useState(false);
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };

    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.REPORTINGHEADER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setReportingsedit(res?.data?.sreportingheader);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };


    const [checkReportingname, setCheckReportingname] = useState();

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            const [res, respaid] = await Promise.all([
                axios.get(`${SERVICE.REPORTINGHEADER_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.CHECKREPORTINGHEADER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    //   checkname: name.split(','),
                    checkname: name.split(','),
                })

            ])
            setReportingsedit(res?.data?.sreportingheader);
            setCheckReportingname(respaid?.data?.hirerarchi);
            // handleClickOpen();
            if ((respaid?.data?.hirerarchi).length > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let reportingid = reportingsedit._id;
    const delReporting = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.delete(`${SERVICE.REPORTINGHEADER_SINGLE}/${reportingid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchNewReportingList();
            handleCloseMod();
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delReportingcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.REPORTINGHEADER_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchNewReportingList();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
            lockPinned: true,
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
        { field: "name", headerName: "Header Name", flex: 0, width: 150, hide: !columnVisibility.name, headerClassName: "bold-header" },
        { field: "module", headerName: "Module", flex: 0, width: 300, hide: !columnVisibility.module, headerClassName: "bold-header" },
        { field: "submodule", headerName: "Sub Module", flex: 0, width: 300, hide: !columnVisibility.submodule, headerClassName: "bold-header" },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 300, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 300, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
        { field: "subsubpage", headerName: "Sub Sub-Page", flex: 0, width: 300, hide: !columnVisibility.subsubpage, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ereportingheader") && (
                        <Link to={`/reportingheaderedit/${params.data.id}`}>
                            <Button
                                onClick={() => { }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        </Link>
                    )}
                    {isUserRoleCompare?.includes("dreportingheader") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vreportingheader") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ireportingheader") && (
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

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Reporting Header List",
        pageStyle: "print",
    });


    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            name: item.name,
            module: item.module,
            submodule: item.submodule,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,
        };
    });

    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box sx={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                    {filteredColumns?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => {
                            const newColumnVisibility = {};
                            columnDataTable.forEach((column) => {
                                newColumnVisibility[column.field] = false; // Set hide property to true
                            });
                            setColumnVisibility(newColumnVisibility);
                        }}>
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    return (
        <Box>
            <PageHeading
                title="Reporting Header"
                modulename="Setup"
                submodulename="Reporting Header"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("areportingheader") && (
                <Box sx={userStyle.dialogbox}>
                    <Typography variant="h6">
                        Add Reporting Header
                    </Typography>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        {/* <Words/> */}
                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography >
                                    Header Name<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput type="text" value={reportingheaderName} onChange={(e) => setReportingheaderName(e.target.value)} />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Module Name <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={module}
                                    value={selectedModuleName}
                                    onChange={(e) => {
                                        handleModuleChange(e);
                                        setSelectedSubModuleName([]);
                                        setSelectedMainPageName([]);
                                        setSelectedSubPageName([]);
                                        setSelectedSubSubPageName([]);
                                    }}
                                    valueRenderer={customValueRendererModule}
                                    labelledBy="Please Select Module"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Sub Module Name<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={subModuleOptions}
                                    value={selectedSubModuleName}
                                    onChange={(e) => {
                                        handleSubModuleChange(e);
                                        setSelectedMainPageName([]);
                                        setSelectedSubPageName([]);
                                        setSelectedSubSubPageName([]);
                                    }}
                                    valueRenderer={customValueRendererSubModule}
                                    labelledBy="Please Select Sub-Module"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Main Page</Typography>
                                <MultiSelect
                                    options={mainPageoptions}
                                    value={selectedMainPageName}
                                    onChange={(e) => {
                                        handleMainPageChange(e);
                                        setSelectedSubPageName([]);
                                        setSelectedSubSubPageName([]);
                                    }}
                                    valueRenderer={customValueRendererMainPage}
                                    labelledBy="Please Select Main-Page"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Sub Page</Typography>
                                <MultiSelect
                                    options={subPageoptions}
                                    value={selectedSubPageName}
                                    onChange={(e) => {
                                        handleSubPageChange(e);
                                        setSelectedSubSubPageName([]);
                                    }}
                                    valueRenderer={customValueRendererSubPage}
                                    labelledBy="Please Select Sub-Page"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Sub Sub-Page</Typography>
                                <MultiSelect
                                    options={subSubPageoptions}
                                    value={selectedSubSubPageName}
                                    onChange={(e) => {
                                        handleSubSubPageChange(e);
                                    }}
                                    valueRenderer={customValueRenderersubSubPage}
                                    labelledBy="Please Select Sub sub-Page"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} sx={{ marginTop: "23px" }} >
                            <Grid container spacing={4} >
                                <Grid item md={4} sm={6} xs={12}>
                                    <LoadingButton loading={isBtn} variant="contained" sx={buttonStyles.buttonsubmit} type="submit" onClick={handleSubmit} >
                                        SUBMIT
                                    </LoadingButton>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>
            )}
            <br />
            {isUserRoleCompare?.includes("lreportingheader") && (
                <>
                    <Box sx={userStyle.container}>
                        <Typography sx={userStyle.HeaderText}>Reporting Header List</Typography>
                        <br />
                        <Grid style={userStyle.dataTablestyle}>
                            <Box>
                                <label htmlFor="pageSizeSelect">Show entries:</label>
                                <Select id="pageSizeSelect" defaultValue="" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={reportingsNewList?.length}>All</MenuItem>
                                </Select>
                            </Box>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelreportingheader") &&
                                        (
                                            <>
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        fetchOverallExcelDatas()
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("csvreportingheader") &&
                                        (<>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchOverallExcelDatas()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                        )
                                    }
                                    {isUserRoleCompare?.includes("printreportingheader") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    )}
                                    {isUserRoleCompare?.includes("pdfreportingheader") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchOverallExcelDatas()
                                                }}  ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagereportingheader") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={reportingsNewList}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={reportingsNewList}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <>
                            {" "}
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>
                            &ensp;
                            {/* {isUserRoleCompare?.includes("bdreportingheader") && (
                        <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={() => handleClickOpenalert()} >Bulk Delete</Button>
                    )} */}

                            <br />
                            {!loader ? (
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
                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                            overflowX: "hidden !important", // Hide the X-axis scrollbar
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
                                                itemsList={reportingsNewList}
                                            />
                                        </>

                                    </Box>
                                </>
                            )}
                            <br />

                        </>

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
                    </Box>
                </>
            )
            }

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

            {/* view model */}
            <Dialog open={openview} onClose={handleCloseview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{ marginTop: "47px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Reporting Header</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Typography variant="h6">Header Name: {reportingsedit.name}</Typography>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module</Typography>
                                    <Typography>{reportingsedit.modulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub-Module</Typography>
                                    <Typography>{reportingsedit.submodulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Main Page</Typography>
                                    <Typography>{reportingsedit.mainpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography variant="h6">Sub-Page</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{reportingsedit.subpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography variant="h6">Sub Sub-Page</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{reportingsedit.subsubpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString()}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    <>
                                        {checkReportingname?.length > 0 ? (
                                            <>
                                                <span style={{ fontWeight: "700", color: "#777" }}>{`${reportingsedit.name} `}</span>
                                                was linked in <span style={{ fontWeight: "700" }}>Hierarchy Pages </span>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </>
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
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
                itemsTwo={reportingsNewList ?? []}
                filename={"Reporting Header List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Reporting Header Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delReporting}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delReportingcheckbox}
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
        </Box>
    );
}

export default ReportingHeaderCreate;