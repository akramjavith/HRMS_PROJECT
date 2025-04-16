import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Checkbox, Box, Typography, OutlinedInput, Dialog, Select, TableRow, TableCell, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { SERVICE } from "../../../services/Baseservice";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import axios from "axios";
import html2canvas from 'html2canvas';
import { saveAs } from "file-saver";
import { handleApiError } from "../../../components/Errorhandling";
import ImageIcon from '@mui/icons-material/Image';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { MultiSelect } from "react-multi-select-component";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import { menuItems } from "../../../components/menuItemsList";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LoadingButton from "@mui/lab/LoadingButton";
import StyledDataGrid from "../../../components/TableStyle";
import PageHeading from "../../../components/PageHeading";

function ReportingHeaderCreate() {

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
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Reporting Header.png');
                });
            });
        }
    };

    const { isUserRoleCompare, pageName, setPageName } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const handleExportXL = (isfilter) => {

        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    "Sno": index + 1,
                    "Header Name": t.headername,
                    Module: t.module,
                    "Sub Module": t.submodule,
                    "Main Page": t.mainpage,
                    "Sub Page": t.subpage,
                    "Sub SubPage": t.subsubpage,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                overallExcelDatas.map((t, index) => ({
                    "Sno": index + 1,
                    "Header Name": t.name,
                    Module: t.modulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                    "Sub Module": t.submodulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                    "Main Page": t.mainpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                    "Sub Page": t.subpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                    "Sub SubPage": t.subsubpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchOverallExcelDatas();
    }, [isFilterOpen])

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        checkbox: true,
        actions: true,
        headername: true,
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

    const module =
        menuItems.length > 0 &&
        menuItems?.map((data) => ({
            ...data,
            label: data.title,
            value: data.title,
        }));


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
    const [controlTitleNames, setControlTitleNames] = useState([]);
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
        let subModu = menuItems.filter((data) => ans.includes(data.title));
        let Submodule = subModu.length > 0 && subModu?.map((item) => item.submenu);
        let singleArray = Submodule.length > 0 && [].concat(...Submodule);
        //Removing Add in the list
        let filteredArray =
            singleArray.length > 0 &&
            singleArray.filter((innerArray) => {
                return !innerArray.title.startsWith("123 ");
            });

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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Enter Header Name</p>
                </>
            );
            handleClickOpenerr();
        } else if (moduleTitleNames.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Select Module Name</p>
                </>
            );
            handleClickOpenerr();
        } else if (subModuleTitleNames.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Select Sub-Module Name</p>
                </>
            );
            handleClickOpenerr();
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
        setControlTitleNames([]);
        setSubSubPageTitleNames([]);
        setSelectedSubSubPageName([]);
        setMainPageoptions([])
        setSubModuleOptions([])
        setSubPageoptions([])
        setsubSubPageoptions([])
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Sucessfully"}</p>
            </>
        );
        handleClickOpenerr();
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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Sucessfully"}</p>
                </>
            );
            handleClickOpenerr();
            setReportingheaderName("");
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
            setReportingsNewList(res?.data?.reportingheaders);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchNewReportingList();
    }, []);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = reportingsNewList?.map((item, index) => ({
            id: item._id,
            serialNumber: index + 1,
            headername: item.name,
            module: item.modulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
            submodule: item.submodulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
            mainpage: item.mainpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
            subpage: item.subpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
            subsubpage: item.subsubpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),

        }));
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber();
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const rowData = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.REPORTINGHEADER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setReportingsedit(res?.data?.sreportingheader);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchNewReportingList();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

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
            headerClassName: "bold-header",
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
        { field: "headername", headerName: "Header Name", flex: 0, width: 150, hide: !columnVisibility.name, headerClassName: "bold-header" },
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
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ereportingheader") && (
                        <Link to={`/reportingheaderedit/${params.row.id}`}>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => { }}
                            >
                                <EditOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                        </Link>
                    )}
                    {isUserRoleCompare?.includes("vreportingheader") && (
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
                    {isUserRoleCompare?.includes("ireportingheader") && (
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
                    {isUserRoleCompare?.includes("dreportingheader") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const fileName = "Reporting Header List";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Reporting Header List",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "Header Name", field: "headername" },
        { title: "Module", field: "module" },
        { title: "Sub Module", field: "submodule" },
        { title: "Main Page", field: "mainpage" },
        { title: "Sub Page", field: "subpage" },
        { title: "Sub Sub-Page", field: "subsubpage" },
    ];


    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            overallExcelDatas?.map(row => ({
                serialNumber: serialNumberCounter++,
                headername: row.name,
                module: row.modulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                submodule: row.submodulename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                mainpage: row.mainpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                subpage: row.subpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),
                subsubpage: row.subsubpagename?.map((item, i) => `${i + 1 + ". "}` + " " + item).toString(),

            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 5,
                cellWidth: 'auto'
            },

            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Reporting Header.pdf");
    };

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
                        <Grid item md={12} xs={12}>
                            <Grid item md={12} xs={12} sx={{ display: "flex" }}>
                                <Typography variant="h6">
                                    Header Name<b style={{ color: "red" }}>*</b>:
                                </Typography>
                                &emsp;
                                <FormControl>
                                    <OutlinedInput type="text" value={reportingheaderName} onChange={(e) => setReportingheaderName(e.target.value)} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12}>
                            <Typography sx={userStyle.HeaderText}>Access Control</Typography>
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
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
                        <Grid item md={4} sm={12} xs={12}>
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
                        <Grid item md={4} sm={12} xs={12}>
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
                        <Grid item md={4} sm={12} xs={12}>
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
                        <Grid item md={4} sm={12} xs={12}>
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

                                 <Grid item md={4} sm={12} xs={12}></Grid>
                        <Grid container spacing={2}>
                            <Grid item md={2} sm={12} xs={12}>
                                <LoadingButton loading={isBtn} variant="contained" type="submit" onClick={handleSubmit} sx={{ minWidth: "40px", height: "37px", marginTop: "28px", padding: "6px 10px" }}>
                                    SUBMIT
                                </LoadingButton>
                            </Grid>
                            <Grid item md={2} sm={12} xs={12}>
                                <Button sx={[userStyle.btncancel, { minWidth: "40px", height: "37px", marginTop: "28px", padding: "6px 10px" }]} onClick={handleClear}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.HeaderText}>Reporting Header List</Typography>
                <br />
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
                            {/* <MenuItem value={reportingsNewList?.length}>All</MenuItem> */}
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
                                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare?.includes("imagereportingheader") && (
                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                            )}
                        </Box>
                    </Grid>
                    <Box>
                        <FormControl fullWidth size="small">
                            <Typography>Search</Typography>
                            <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                        </FormControl>
                    </Box>
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
                    {isUserRoleCompare?.includes("bdreportingheader") && (
                        <Button variant="contained" color="error" onClick={() => handleClickOpenalert()} >Bulk Delete</Button>
                    )}

                    <br />
                    <br />
                    <Box
                        style={{
                            width: "100%",
                            overflowY: "hidden", // Hide the y-axis scrollbar
                            overflowX: "hidden !important", // Hide the X-axis scrollbar
                        }}
                    >
                        <StyledDataGrid
                            ref={gridRef}
                            rows={rowDataTable}
                            columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                            autoHeight={true}
                            density="compact"
                            hideFooter
                            disableRowSelectionOnClick
                            unstable_cellSelection
                            unstable_ignoreValueFormatterDuringExport
                        />
                    </Box>
                    <br />
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                        </Box>
                        <Box>
                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                <FirstPageIcon />
                            </Button>
                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                <NavigateBeforeIcon />
                            </Button>
                            {pageNumbers?.map((pageNumber) => (
                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                    {pageNumber}
                                </Button>
                            ))}
                            {lastVisiblePage < totalPages && <span>...</span>}
                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                <NavigateNextIcon />
                            </Button>
                            <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                <LastPageIcon />
                            </Button>
                        </Box>
                    </Box>
                    <br /> <br />
                </>
                {/* } */}
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

            {/* //info view */}
            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Reporting Header Info</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* view model */}
            <Dialog open={openview} onClose={handleCloseview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
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
                            <Button variant="contained" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Header Name</TableCell>
                            <TableCell> Module</TableCell>
                            <TableCell>Sub Module</TableCell>
                            <TableCell>Main Page</TableCell>
                            <TableCell>Sub Page</TableCell>
                            <TableCell>Sub Sub-Page</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.headername}</TableCell>
                                    <TableCell>{row.module}</TableCell>
                                    <TableCell>{row.submodule}</TableCell>
                                    <TableCell>{row.mainpage}</TableCell>
                                    <TableCell>{row.subpage}</TableCell>
                                    <TableCell>{row.subsubpage}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                            onClick={(e) => delReportingcheckbox(e)}
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
            {/*Export XL Data  */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                        :
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                            fetchOverallExcelDatas()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delReporting(reportingid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default ReportingHeaderCreate;