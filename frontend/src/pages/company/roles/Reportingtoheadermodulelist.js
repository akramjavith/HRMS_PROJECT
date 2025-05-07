import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, FormControl, IconButton, Switch, List, ListItem, ListItemText, Box, Typography, Dialog, Select, MenuItem, DialogContent, DialogActions, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import { saveAs } from "file-saver";
import { handleApiError } from "../../../components/Errorhandling";
import ImageIcon from '@mui/icons-material/Image';
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import { Hierarchymodulelist } from "../../../components/Reportingtoheadermodulelist";
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";

function Reportingtoheadermodulelist() {
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

    let exportColumnNames = ['Module', 'Sub Module', 'Main Page', 'Sub Page', 'Sub Sub-Page', 'Status', 'Header Name'];
    let exportRowValues = ['module', 'submodule', 'mainpage', 'subpage', 'subsubpage', 'status', 'headername'];

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

    //module

    const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
    const [selectedMainPageName, setSelectedMainPageName] = useState([]);
    const [selectedSubPageName, setSelectedSubPageName] = useState([]);
    const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);
    const [subModuleOptions, setSubModuleOptions] = useState([]);
    const [mainPageoptions, setMainPageoptions] = useState([]);
    const [subPageoptions, setSubPageoptions] = useState([]);
    const [subSubPageoptions, setsubSubPageoptions] = useState([]);
    const [moduleTitleNames, setModuleTitleNames] = useState(["Human Resources", 'Queue Priorities', "Production", "Quality", "PayRoll", "Task", "Training", "Tickets", "Settings"]);
    const [selectedModuleName, setSelectedModuleName] = useState([]);
    const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
    const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
    const [subPageTitleNames, setSubPageTitleNames] = useState([]);
    const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);

    const handleModuleChange = (options) => {
        let ans = options.map((a, index) => {
            return a.value;
        });
        setModuleTitleNames(ans);

        //subModuleDropDown Names
        let subModu = Hierarchymodulelist?.filter((data) => ans.includes(data.module));
        let Submodule = subModu.length > 0 ? subModu?.map((item) => item.submodule) : [];

        setSubModuleOptions(
            Submodule.length > 0 ?
                Submodule?.filter((data) => data !== "")?.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                })).filter((item, index, self) => {
                    return (
                        self.findIndex(
                            (i) =>
                                i.label === item.label && i.value === item.value
                        ) === index
                    );
                }) : []
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

        let subModu = Hierarchymodulelist.filter((data) => submodAns.includes(data.submodule));
        let mainPage = subModu.length > 0 ? subModu?.map((item) => item.mainpage) : [];

        setMainPageoptions(mainPage.length > 0 ?
            mainPage?.filter((data) => data !== "")?.map((data) => ({
                ...data,
                label: data,
                value: data,
            })).filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }) : []);
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

        let mainPageFilt = Hierarchymodulelist.filter((data) => mainpageAns.includes(data.mainpage));
        let subPage = mainPageFilt.length > 0 ? mainPageFilt?.map((item) => item.subpage) : [];
        console.log(subPage, 'subPage')
        setSubPageoptions(subPage.length > 0 ?
            subPage?.filter((data) => data !== "")?.map((data) => ({
                ...data,
                label: data,
                value: data,
            })).filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }) : []);
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

        let subPageFilt = Hierarchymodulelist.filter((data) => subPageAns.includes(data.subpage));
        let subPage = subPageFilt.length > 0 ? subPageFilt?.map((item) => item.subsubpage) : [];

        setsubSubPageoptions(subPage.length > 0 ?
            subPage?.filter((data) => data !== "")?.map((data) => ({
                ...data,
                label: data,
                value: data,
            })).filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) =>
                            i.label === item.label && i.value === item.value
                    ) === index
                );
            }) : []);
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

        let subPageFilt = Hierarchymodulelist.filter((data) => subPageAns.includes(data.subsubpage));
        let subPage = subPageFilt.length > 0 ? subPageFilt?.map((item) => item.subsubpage) : [];

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

    const handleFilter = () => {
        // setModuleTitleNames();
        // if(selectedModuleName?.length === 0){
        //     setPopupContentMalert("Please Select Module Name");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }else if(subModuleTitleNames?.length === 0){
        //     setPopupContentMalert("Please Select SubModule Name");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }else {
        sendRequest();
        // }
    }

    const handleClear = () => {
        setSelectedSubModuleName([]); setsubSubPageoptions([]);
        setSelectedMainPageName([]); setSubPageoptions([]);
        setSelectedSubPageName([]); setMainPageoptions([]);
        setSelectedSubSubPageName([]); setSubModuleOptions([]);
        setModuleTitleNames([]); setSelectedModuleName([]);
        setSubModuleTitleNames([]); setMainPageTitleNames([]);
        setSubPageTitleNames([]); setSubSubPageTitleNames([]);
    }

    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let res = await axios.post(SERVICE.MODULEFILTERREPORTINGTOHEADER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                modulename: moduleTitleNames,
                submodulename: [],
                mainpagename: [],
                subpagename: [],
                subsubpagename: []
            });

            const resdata = Hierarchymodulelist.map((data, index) => {
                let fidata = { ...data, status: "No", headername: "" }
                res?.data?.reportingheaders.forEach((item, index) => {
                    if (item?.subsubpagename?.includes(data?.endpage) || item?.subpagename?.includes(data?.endpage) || item?.mainpagename?.includes(data?.endpage) || item?.submodulename?.includes(data?.endpage) || item?.modulename?.includes(data?.endpage)) {
                        fidata = { ...data, status: "Yes", headername: item.name }
                    }
                })
                return fidata
            })
            setReportingsNewList(resdata)
            setOverallExcelDatas(resdata)
            console.log(resdata, 'resdata')
            console.log(res?.data, 'res')
            setLoader(false);
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const [selectedRows, setSelectedRows] = useState([]);

    const gridRef = useRef(null);
    const [loader, setLoader] = useState(false);
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Reporting Header ModuleList.png");
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
            pagename: String("Reporting Header Module List"),
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
    const fetchOverallExcelDatas = () => {
        setOverallExcelDatas(overallExcelDatas);
    };

    useEffect(() => {
        fetchOverallExcelDatas();
    }, [isFilterOpen])

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        module: true,
        submodule: true,
        mainpage: true,
        subpage: true,
        subsubpage: true, status: true, headername: true,
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


    const [reportingsNewList, setReportingsNewList] = useState([]);

    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess } = useContext(UserRoleAccessContext);

    const addSerialNumber = (datas) => {
        const resfinal = datas.map((data, index) => {
            return { ...data, serialNumber: index + 1 }
        })
        setItems(resfinal);
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

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
        { field: "module", headerName: "Module", flex: 0, width: 300, hide: !columnVisibility.module, headerClassName: "bold-header" },
        { field: "submodule", headerName: "Sub Module", flex: 0, width: 300, hide: !columnVisibility.submodule, headerClassName: "bold-header" },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 300, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 300, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
        { field: "subsubpage", headerName: "Sub Sub-Page", flex: 0, width: 300, hide: !columnVisibility.subsubpage, headerClassName: "bold-header" },
        { field: "status", headerName: "Status", flex: 0, width: 150, hide: !columnVisibility.status, headerClassName: "bold-header" },
        { field: "headername", headerName: "HeaderName", flex: 0, width: 150, hide: !columnVisibility.headername, headerClassName: "bold-header" },
    ];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Reporting Header ModuleList",
        pageStyle: "print",
    });


    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            headername: item.headername,
            module: item.module,
            submodule: item.submodule,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,
            status: item.status
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
                title="Reporting Header ModuleList"
                modulename="Setup"
                submodulename="Reporting Header ModuleList"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lreportingheadermodulelist") && (
                <>
                    {/* <Box sx={userStyle.dialogbox}>
                    <Typography variant="h6">Filter Reporting Header ModuleList</Typography>
                    <Grid container spacing={2}>
                        <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Module Name <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <MultiSelect
                                    options={Hierarchymodulelist.filter((item, index, self) => {
                                        return (
                                          self.findIndex(
                                            (i) =>
                                              i.label === item.label && i.value === item.value
                                          ) === index
                                        );
                                      })}
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
                                    Sub Module Name
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
                                    <LoadingButton loading={isBtn} variant="contained" sx={buttonStyles.buttonsubmit} type="submit" onClick={handleFilter} >
                                        Filter
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
                <br /> */}
                    <Box sx={userStyle.container}>
                        <Typography sx={userStyle.HeaderText}>ModuleList</Typography>
                        <br />
                        <Grid container spacing={4} >
                            <Grid item md={4} sm={6} xs={12}>
                                <LoadingButton loading={isBtn} variant="contained" sx={buttonStyles.buttonsubmit} type="submit" onClick={handleFilter} >
                                    Generate
                                </LoadingButton>
                            </Grid>
                        </Grid>
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
                                    {isUserRoleCompare?.includes("excelreportingheadermodulelist") &&
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
                                    {isUserRoleCompare?.includes("csvreportingheadermodulelist") &&
                                        (<>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchOverallExcelDatas()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                        )
                                    }
                                    {isUserRoleCompare?.includes("printreportingheadermodulelist") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    )}
                                    {isUserRoleCompare?.includes("pdfreportingheadermodulelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchOverallExcelDatas()
                                                }}  ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagereportingheadermodulelist") && (
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

                            <br />
                            {loader ? (
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
                filename={"Reporting Header ModuleList"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            <br />
        </Box>
    );
}

export default Reportingtoheadermodulelist;